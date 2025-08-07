import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const calendar = google.calendar('v3');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { summary, description, start, end, location, attendees } = body;

    console.log('Received event data:', { summary, description, start, end, location, attendees });

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

    console.log('Google Calendar settings from environment:', {
      hasEmail: !!googleCalendarSettings.serviceAccountEmail,
      hasKey: !!googleCalendarSettings.privateKey,
      hasCalendarId: !!googleCalendarSettings.calendarId,
      emailLength: googleCalendarSettings.serviceAccountEmail?.length || 0,
      keyLength: googleCalendarSettings.privateKey?.length || 0,
      calendarIdLength: googleCalendarSettings.calendarId?.length || 0
    });

    // Validate required Google Calendar settings
    if (!googleCalendarSettings.serviceAccountEmail || !googleCalendarSettings.privateKey || !googleCalendarSettings.calendarId) {
      console.log('Incomplete Google Calendar configuration:', {
        email: !!googleCalendarSettings.serviceAccountEmail,
        key: !!googleCalendarSettings.privateKey,
        calendarId: !!googleCalendarSettings.calendarId
      });
      return NextResponse.json(
        { error: 'Google Calendar configuration is incomplete. Please check environment variables: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_CALENDAR_ID' },
        { status: 400 }
      );
    }

    // Configure Google Auth with environment variables
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: googleCalendarSettings.serviceAccountEmail,
        private_key: googleCalendarSettings.privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    // Create the event object
    const event = {
      summary,
      description,
      start,
      end,
      location,
      attendees,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
    };

    console.log('Creating event with calendar ID:', googleCalendarSettings.calendarId);

    // Create the event in Google Calendar
    const response = await calendar.events.insert({
      auth,
      calendarId: googleCalendarSettings.calendarId,
      requestBody: event,
      // Removed sendUpdates to avoid Domain-Wide Delegation error
    });

    console.log('Event created successfully:', response.data.id);

    return NextResponse.json({
      success: true,
      eventId: response.data.id,
      event: response.data,
    });

  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create event in Google Calendar',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 