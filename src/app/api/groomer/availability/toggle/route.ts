import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';

// Request schema - EXPORTED
export const toggleAvailabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:mm'),
});

export type ToggleAvailabilityRequest = z.infer<typeof toggleAvailabilitySchema>;

// Response type - EXPORTED
export type ToggleAvailabilityResponse = {
  success: boolean;
  available: boolean;
  message: string;
};

type ErrorResponse = {
  error: string;
};

// Toggle time slot availability
export async function POST(
  request: NextRequest
): Promise<NextResponse<ToggleAvailabilityResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groomerId = session.user.id;
    const body: unknown = await request.json();
    const { date, time } = toggleAvailabilitySchema.parse(body);

    // Don't allow modifying past dates
    const targetDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (targetDate < today) {
      return NextResponse.json({ error: 'Cannot modify past dates' }, { status: 400 });
    }

    // Don't allow scheduling more than 4 weeks in advance
    const maxFutureDate = new Date(today);
    maxFutureDate.setDate(today.getDate() + 28); // 4 weeks

    if (targetDate > maxFutureDate) {
      return NextResponse.json(
        { error: 'Cannot schedule more than 4 weeks in advance' },
        { status: 400 }
      );
    }

    // Get groomer's schedule to validate the time slot
    const schedule = await prisma.groomerSchedule.findUnique({
      where: { groomerId },
    });

    if (!schedule) {
      return NextResponse.json(
        {
          error: 'Groomer schedule not found. Please set up your working hours first.',
        },
        { status: 404 }
      );
    }

    // Check if the day is a working day
    const dayOfWeek = targetDate.getDay();
    if (!schedule.workingDays.includes(dayOfWeek)) {
      return NextResponse.json({ error: 'This is not a working day' }, { status: 400 });
    }

    // Validate that the time slot is within working hours
    const timeMinutes = parseTimeToMinutes(time);
    const workingStartMinutes = parseTimeToMinutes(schedule.workingHoursStart);
    const workingEndMinutes = parseTimeToMinutes(schedule.workingHoursEnd);

    if (timeMinutes < workingStartMinutes || timeMinutes >= workingEndMinutes) {
      return NextResponse.json({ error: 'Time slot is outside working hours' }, { status: 400 });
    }

    // Check if there's an existing availability slot
    const existingSlot = await prisma.groomerAvailability.findUnique({
      where: {
        groomerId_date_timeSlot: {
          groomerId,
          date: targetDate,
          timeSlot: time,
        },
      },
    });

    if (existingSlot) {
      // Check if the slot is already booked
      if (existingSlot.isBooked) {
        return NextResponse.json({ error: 'Cannot modify booked time slot' }, { status: 400 });
      }

      // Toggle the availability
      const updatedSlot = await prisma.groomerAvailability.update({
        where: { id: existingSlot.id },
        data: { isAvailable: !existingSlot.isAvailable },
      });

      return NextResponse.json({
        success: true,
        available: updatedSlot.isAvailable,
        message: updatedSlot.isAvailable
          ? 'Time slot marked as available'
          : 'Time slot marked as unavailable',
      });
    } else {
      // Create new availability slot (default is unavailable since we're toggling)
      const newSlot = await prisma.groomerAvailability.create({
        data: {
          scheduleId: schedule.id,
          groomerId,
          date: targetDate,
          timeSlot: time,
          isAvailable: false, // Since we're toggling from default (available)
        },
      });

      return NextResponse.json({
        success: true,
        available: newSlot.isAvailable,
        message: 'Time slot marked as unavailable',
      });
    }
  } catch (error) {
    console.error('Failed to toggle time slot:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
