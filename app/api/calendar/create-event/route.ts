import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { prisma } from '@/lib/prisma'; 

const calendar = google.calendar('v3');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { summary, description, start, end, customerName, customerEmail, customerPhone, numberOfPeople, specialRequests } = body;

    console.log('Received event data:', { summary, description, start, end, customerName, customerEmail, customerPhone, numberOfPeople, specialRequests });

    // Validate required fields
    if (!summary || !start || !end) {
      console.log('Missing required fields:', { summary: !!summary, start: !!start, end: !!end });
      return NextResponse.json(
        { error: 'Missing required fields: summary, start, or end' },
        { status: 400 }
      );
    }

    // Get Google Calendar settings from environment variables
    const googleCalendarSettings = {
      enabled: true, // Always enabled when using env vars
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: process.env.GOOGLE_PRIVATE_KEY,
      calendarId: process.env.GOOGLE_CALENDAR_ID
    };

    // Configure Google Auth with environment variables
    if (!googleCalendarSettings.privateKey) {
      return NextResponse.json({ error: 'Google Calendar private key is missing.' }, { status: 500 });
    }
    
    // Fix private key formatting - replace literal \n with actual newlines
    const privateKey = googleCalendarSettings.privateKey.replace(/\\n/g, '\n');
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: googleCalendarSettings.serviceAccountEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    // Create the event object
    const event = {
      summary,
      description,
      start,
      end,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
    };

    // Create the event in Google Calendar
    const response = await calendar.events.insert({
      auth,
      calendarId: googleCalendarSettings.calendarId,
      requestBody: event,
    });

    // Save booking to PostgreSQL
    await prisma.booking.create({
      data: {
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
        numberOfPeople: numberOfPeople || 1,
        reservationDate: new Date(start.dateTime),
        startTime: new Date(start.dateTime),
        endTime: new Date(end.dateTime),
        specialRequests: specialRequests || '',
        calendarEventId: response.data.id,
      }
    });

    return NextResponse.json({
      success: true,
      eventId: response.data.id,
      event: response.data,
    });

  } catch (error) {
    console.error('Error creating Google Calendar event or saving booking:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create event in Google Calendar or save booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 