import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_SETTINGS = {
  maxPeople: 20,
  maxAccommodation: 20,
  avgReservationLength: 90,
  daysJson: JSON.stringify({
    monday: { enabled: true, timeSlots: [{ start: '09:00', end: '21:00' }] },
    tuesday: { enabled: true, timeSlots: [{ start: '09:00', end: '21:00' }] },
    wednesday: { enabled: true, timeSlots: [{ start: '09:00', end: '21:00' }] },
    thursday: { enabled: true, timeSlots: [{ start: '09:00', end: '21:00' }] },
    friday: { enabled: true, timeSlots: [{ start: '09:00', end: '21:00' }] },
    saturday: { enabled: true, timeSlots: [{ start: '09:00', end: '21:00' }] },
    sunday: { enabled: true, timeSlots: [{ start: '09:00', end: '21:00' }] },
  }),
  customDaysJson: JSON.stringify([]),
};

export async function GET() {
  let settings = await prisma.adminSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.adminSettings.create({
      data: { id: 1, ...DEFAULT_SETTINGS },
    });
  }
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  let settings = await prisma.adminSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.adminSettings.create({
      data: { id: 1, ...DEFAULT_SETTINGS },
    });
  }
  const updated = await prisma.adminSettings.update({
    where: { id: 1 },
    data: {
      maxPeople: data.maxPeople ?? settings.maxPeople,
      maxAccommodation: data.maxAccommodation ?? settings.maxAccommodation,
      avgReservationLength: data.avgReservationLength ?? settings.avgReservationLength,
      daysJson: data.days ? JSON.stringify(data.days) : settings.daysJson,
      customDaysJson: data.customDays ? JSON.stringify(data.customDays) : settings.customDaysJson,
    },
  });
  return NextResponse.json(updated);
} 