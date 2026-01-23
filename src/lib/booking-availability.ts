import { prisma } from '@mimisalon/shared';
import { Prisma } from '@mimisalon/shared';

/**
 * 서비스 후 정리 및 준비 시간 (분)
 * 모든 예약에 대해 서비스 시간 외에 추가로 차단되는 시간
 */
export const CLEANUP_BUFFER_MINUTES = 90;

/**
 * 예약 시 필요한 시간 슬롯 목록 생성
 * @param startTime 시작 시간 (HH:mm)
 * @param durationMinutes 서비스 소요 시간 (분)
 * @returns 필요한 시간 슬롯 배열
 */
export function generateRequiredTimeSlots(startTime: string, durationMinutes: number): string[] {
  const slots: string[] = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);

  let currentMinutes = startHour * 60 + startMinute;
  const endMinutes = currentMinutes + durationMinutes;

  while (currentMinutes < endMinutes) {
    const hour = Math.floor(currentMinutes / 60);
    const minute = currentMinutes % 60;
    const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    slots.push(timeSlot);
    currentMinutes += 30; // 30분 단위 슬롯
  }

  return slots;
}

/**
 * 미용사의 특정 날짜/시간 슬롯이 예약 가능한지 확인
 * @param groomerId 미용사 ID
 * @param date 예약 날짜
 * @param timeSlots 확인할 시간 슬롯들
 * @returns 예약 가능 여부
 */
export async function checkGroomerAvailability(
  groomerId: string,
  date: Date,
  timeSlots: string[]
): Promise<{ available: boolean; conflicts?: string[] }> {
  // 1. 기존 예약 확인
  const existingBookings = await prisma.booking.findMany({
    where: {
      groomerId,
      serviceDate: date,
      status: {
        notIn: ['SERVICE_CANCELLED', 'BOOKING_FAILED'],
      },
    },
    select: {
      serviceTime: true,
      estimatedDurationMinutes: true,
    },
  });

  const conflictingSlots = new Set<string>();

  // 2. 각 기존 예약의 시간 슬롯 계산 (정리 시간 포함)
  for (const booking of existingBookings) {
    const bookedSlots = generateRequiredTimeSlots(
      booking.serviceTime,
      (booking.estimatedDurationMinutes || 60) + CLEANUP_BUFFER_MINUTES
    );
    bookedSlots.forEach((slot) => conflictingSlots.add(slot));
  }

  // 3. 요청된 시간 슬롯과 충돌 확인
  const conflicts = timeSlots.filter((slot) => conflictingSlots.has(slot));

  if (conflicts.length > 0) {
    return { available: false, conflicts };
  }

  // 4. GroomerAvailability 테이블 확인 (명시적으로 차단된 시간)
  const blockedSlots = await prisma.groomerAvailability.findMany({
    where: {
      groomerId,
      date,
      timeSlot: { in: timeSlots },
      OR: [{ isAvailable: false }, { isBooked: true }],
    },
    select: {
      timeSlot: true,
    },
  });

  if (blockedSlots.length > 0) {
    return {
      available: false,
      conflicts: blockedSlots.map((s) => s.timeSlot),
    };
  }

  return { available: true };
}

/**
 * 예약 생성 시 시간 슬롯 차단 (트랜잭션 내에서 실행)
 * @param tx Prisma 트랜잭션 클라이언트
 * @param groomerId 미용사 ID
 * @param date 예약 날짜
 * @param timeSlots 차단할 시간 슬롯들
 * @param bookingId 예약 ID
 */
export async function blockTimeSlots(
  tx: Prisma.TransactionClient,
  groomerId: string,
  date: Date,
  timeSlots: string[],
  bookingId: string
): Promise<void> {
  // 1. 이미 예약된 시간인지 최종 확인 (트랜잭션 내에서)
  const existingBookings = await tx.booking.findMany({
    where: {
      groomerId,
      serviceDate: date,
      status: {
        notIn: ['SERVICE_CANCELLED', 'BOOKING_FAILED'],
      },
      NOT: {
        id: bookingId, // 자기 자신 제외
      },
    },
    select: {
      serviceTime: true,
      estimatedDurationMinutes: true,
    },
  });

  const conflictingSlots = new Set<string>();
  for (const booking of existingBookings) {
    const bookedSlots = generateRequiredTimeSlots(
      booking.serviceTime,
      (booking.estimatedDurationMinutes || 60) + CLEANUP_BUFFER_MINUTES
    );
    bookedSlots.forEach((slot) => conflictingSlots.add(slot));
  }

  const conflicts = timeSlots.filter((slot) => conflictingSlots.has(slot));
  if (conflicts.length > 0) {
    throw new Error(`다음 시간은 이미 예약되었습니다: ${conflicts.join(', ')}`);
  }

  // 2. GroomerAvailability 레코드 생성 또는 업데이트
  // 먼저 스케줄 확인
  const schedule = await tx.groomerSchedule.findUnique({
    where: { groomerId },
  });

  const scheduleId = schedule?.id;

  // 3. 각 시간 슬롯을 차단
  for (const timeSlot of timeSlots) {
    await tx.groomerAvailability.upsert({
      where: {
        groomerId_date_timeSlot: {
          groomerId,
          date,
          timeSlot,
        },
      },
      update: {
        isBooked: true,
        bookingId,
        isAvailable: false,
      },
      create: {
        groomerId,
        scheduleId: scheduleId || '',
        date,
        timeSlot,
        isBooked: true,
        bookingId,
        isAvailable: false,
      },
    });
  }
}

/**
 * 예약 취소 시 시간 슬롯 해제
 * @param bookingId 예약 ID
 */
export async function releaseTimeSlots(bookingId: string): Promise<void> {
  await prisma.groomerAvailability.updateMany({
    where: {
      bookingId,
    },
    data: {
      isBooked: false,
      bookingId: undefined,
      isAvailable: true,
    },
  });
}

/**
 * 실시간 예약 상태 조회
 * @param groomerId 미용사 ID
 * @param date 조회할 날짜
 * @returns 해당 날짜의 예약 상태
 */
export async function getGroomerDaySchedule(groomerId: string, date: Date) {
  // 1. 해당 날짜의 모든 예약 조회
  const bookings = await prisma.booking.findMany({
    where: {
      groomerId,
      serviceDate: date,
      status: {
        notIn: ['SERVICE_CANCELLED', 'BOOKING_FAILED'],
      },
    },
    select: {
      id: true,
      serviceTime: true,
      estimatedDurationMinutes: true,
      status: true,
      customer: {
        select: {
          name: true,
        },
      },
    },
  });

  // 2. 명시적으로 차단된 시간 조회
  const blockedSlots = await prisma.groomerAvailability.findMany({
    where: {
      groomerId,
      date,
      OR: [{ isAvailable: false }, { isBooked: true }],
    },
    select: {
      timeSlot: true,
      isBooked: true,
      bookingId: true,
    },
  });

  // 3. 시간별 상태 맵 생성
  const timeSlotStatus = new Map<
    string,
    {
      available: boolean;
      bookingId?: string;
      customerName?: string;
      status?: string;
    }
  >();

  // 예약된 시간 처리 (정리 시간 포함)
  for (const booking of bookings) {
    const slots = generateRequiredTimeSlots(
      booking.serviceTime,
      (booking.estimatedDurationMinutes || 60) + CLEANUP_BUFFER_MINUTES
    );

    slots.forEach((slot) => {
      timeSlotStatus.set(slot, {
        available: false,
        bookingId: booking.id,
        customerName: booking.customer?.name || undefined,
        status: booking.status,
      });
    });
  }

  // 명시적으로 차단된 시간 처리
  for (const blocked of blockedSlots) {
    if (!timeSlotStatus.has(blocked.timeSlot)) {
      timeSlotStatus.set(blocked.timeSlot, {
        available: false,
        bookingId: blocked.bookingId || undefined,
      });
    }
  }

  return timeSlotStatus;
}
