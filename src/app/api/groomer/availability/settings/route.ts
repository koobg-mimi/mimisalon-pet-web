import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';

// Request schema - EXPORTED
export const updateAvailabilitySettingsSchema = z.object({
  workingDays: z.array(z.string()),
  workingHours: z.object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  }),
  slotDuration: z.number().default(30),
});

export type UpdateAvailabilitySettingsRequest = z.infer<typeof updateAvailabilitySettingsSchema>;

// Response types - EXPORTED
export type AvailabilitySettingsResponse = {
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
  slotDuration: number;
};

type ErrorResponse = {
  error: string;
};

// Get groomer availability settings
export async function GET(): Promise<
  NextResponse<AvailabilitySettingsResponse | ErrorResponse>
> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groomerId = session.user.id;

    let schedule = await prisma.groomerSchedule.findUnique({
      where: { groomerId },
    });

    // Create default settings if none exist
    if (!schedule) {
      schedule = await prisma.groomerSchedule.create({
        data: {
          groomerId,
          workingDays: [1, 2, 3, 4, 5], // Monday to Friday by default
          workingHoursStart: '09:00',
          workingHoursEnd: '18:00',
          slotDurationMinutes: 30,
        },
      });
    }

    // Convert to frontend format
    const settings = {
      workingDays: schedule.workingDays.map(String), // Convert numbers to strings for frontend
      workingHours: {
        start: schedule.workingHoursStart,
        end: schedule.workingHoursEnd,
      },
      slotDuration: schedule.slotDurationMinutes,
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch groomer settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update groomer availability settings
export async function PUT(
  request: NextRequest
): Promise<NextResponse<AvailabilitySettingsResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groomerId = session.user.id;
    const body: unknown = await request.json();
    const validatedData = updateAvailabilitySettingsSchema.parse(body);

    // Validate the request body
    const { workingDays, workingHours, slotDuration } = validatedData;

    if (
      !workingDays ||
      !workingHours ||
      !workingHours.start ||
      !workingHours.end ||
      !slotDuration
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate working days are valid day numbers (0-6)
    const workingDaysNumbers = workingDays.map((day: string) => parseInt(day));
    if (workingDaysNumbers.some((day: number) => day < 0 || day > 6)) {
      return NextResponse.json({ error: 'Invalid working days' }, { status: 400 });
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(workingHours.start) || !timeRegex.test(workingHours.end)) {
      return NextResponse.json({ error: 'Invalid time format' }, { status: 400 });
    }

    // Validate start time is before end time
    const startMinutes = parseTimeToMinutes(workingHours.start);
    const endMinutes = parseTimeToMinutes(workingHours.end);
    if (startMinutes >= endMinutes) {
      return NextResponse.json({ error: 'Start time must be before end time' }, { status: 400 });
    }

    // Validate slot duration (fixed to 30 minutes)
    if (slotDuration !== 30) {
      return NextResponse.json({ error: 'Slot duration must be 30 minutes' }, { status: 400 });
    }

    // Update or create the schedule
    const schedule = await prisma.groomerSchedule.upsert({
      where: { groomerId },
      update: {
        workingDays: workingDaysNumbers,
        workingHoursStart: workingHours.start,
        workingHoursEnd: workingHours.end,
        slotDurationMinutes: slotDuration,
      },
      create: {
        groomerId,
        workingDays: workingDaysNumbers,
        workingHoursStart: workingHours.start,
        workingHoursEnd: workingHours.end,
        slotDurationMinutes: slotDuration,
      },
    });

    // Clear future availability slots that are affected by the settings change
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.groomerAvailability.deleteMany({
      where: {
        groomerId,
        date: {
          gte: today,
        },
        isBooked: false, // Don't delete slots that are already booked
      },
    });

    // Convert back to frontend format
    const updatedSettings = {
      workingDays: schedule.workingDays.map(String),
      workingHours: {
        start: schedule.workingHoursStart,
        end: schedule.workingHoursEnd,
      },
      slotDuration: schedule.slotDurationMinutes,
    };

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Failed to update groomer settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
