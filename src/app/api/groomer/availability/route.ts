import { ko } from 'date-fns/locale';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { format } from 'date-fns';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';

// Response types - EXPORTED
export type AvailabilityScheduleResponse = Array<{
  date: string;
  dayOfWeek: string;
  isWorkingDay: boolean;
  timeSlots: Array<{
    time: string;
    available: boolean;
    booked?: boolean;
    bookingId?: string;
  }>;
}>;

type ErrorResponse = {
  error: string;
};

// Get weekly availability schedule for groomer
export async function GET(
  request: NextRequest
): Promise<NextResponse<AvailabilityScheduleResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user?.role !== 'GROOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const weekOffset = parseInt(searchParams.get('week') ?? '0');

    const groomerId = session.user.id;

    // Calculate the start and end dates for the requested week
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Get groomer's schedule settings
    const schedule = await prisma.groomerSchedule.findUnique({
      where: { groomerId },
    });

    if (!schedule) {
      // Return empty schedule if no settings found
      return NextResponse.json([]);
    }

    // Get existing availability slots for the week
    const existingAvailabilities = await prisma.groomerAvailability.findMany({
      where: {
        groomerId,
        date: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      include: {
        booking: true,
      },
    });

    // Generate the weekly schedule
    const weeklySchedule = [];
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);

      const dayOfWeek = currentDate.getDay();
      const isWorkingDay = schedule.workingDays.includes(dayOfWeek);

      const daySchedule = {
        date: format(currentDate, 'yyyy-MM-dd', { locale: ko }),
        dayOfWeek: dayNames[dayOfWeek],
        isWorkingDay,
        timeSlots: [] as Array<{
          time: string;
          available: boolean;
          booked?: boolean;
          bookingId?: string;
        }>,
      };

      if (isWorkingDay) {
        // Generate time slots for working day
        const timeSlots = generateTimeSlots(
          schedule.workingHoursStart,
          schedule.workingHoursEnd,
          schedule.slotDurationMinutes
        );

        for (const timeSlot of timeSlots) {
          const existingSlot = existingAvailabilities.find(
            (slot) =>
              format(slot.date, 'yyyy-MM-dd', { locale: ko }) === daySchedule.date &&
              slot.timeSlot === timeSlot
          );

          daySchedule.timeSlots.push({
            time: timeSlot,
            available: existingSlot ? existingSlot.isAvailable : true,
            booked: existingSlot ? existingSlot.isBooked : false,
            bookingId: existingSlot?.bookingId || undefined,
          });
        }
      }

      weeklySchedule.push(daySchedule);
    }

    return NextResponse.json(weeklySchedule);
  } catch (error) {
    console.error('Failed to fetch groomer availability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateTimeSlots(
  startTime: string,
  endTime: string,
  slotDurationMinutes: number
): string[] {
  const slots: string[] = [];

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  let currentMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  while (currentMinutes < endMinutes) {
    // Don't add slot if it would end after work hours
    if (currentMinutes + slotDurationMinutes > endMinutes) {
      break;
    }

    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    slots.push(timeString);
    currentMinutes += slotDurationMinutes;
  }

  return slots;
}
