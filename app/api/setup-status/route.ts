import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get or create setup status
    let setupStatus = await prisma.setupStatus.findUnique({
      where: { id: 1 }
    });

    if (!setupStatus) {
      setupStatus = await prisma.setupStatus.create({
        data: { id: 1, isSetup: false }
      });
    }

    return NextResponse.json({ isSetup: setupStatus.isSetup });
  } catch (error) {
    console.error('Error checking setup status:', error);
    return NextResponse.json(
      { error: 'Failed to check setup status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isSetup } = await request.json();
    
    await prisma.setupStatus.upsert({
      where: { id: 1 },
      update: { isSetup },
      create: { id: 1, isSetup }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating setup status:', error);
    return NextResponse.json(
      { error: 'Failed to update setup status' },
      { status: 500 }
    );
  }
} 