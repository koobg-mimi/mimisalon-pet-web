import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { z } from 'zod';
import { generateRequiredTimeSlots, checkGroomerAvailability } from '@/lib/booking-availability';

// ============================================
// Request Schema & Type
// ============================================

export const bookingInitializeSchema = z.object({
  idempotencyKey: z.string().min(1, '멱등성 키가 필요합니다'),
  petServices: z.array(
    z.object({
      petId: z.string(),
      services: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          price: z.number(),
          duration: z.number(),
        })
      ),
      options: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            price: z.number(),
          })
        )
        .default([]),
    })
  ),
  addressId: z.string().optional(),
  customerAddress: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      detailAddress: z.string().optional(),
    })
    .optional(),
  groomerId: z.string().min(1, '미용사를 선택해주세요'),
  date: z.string().min(1, '날짜를 선택해주세요'),
  timeSlot: z
    .string()
    .min(1, '시간을 선택해주세요')
    .regex(/^\d{2}:\d{2}$/, '올바른 시간 형식이 아닙니다 (HH:mm)'),
  specialRequests: z.string().optional(),
});

export type BookingInitializeRequest = z.infer<typeof bookingInitializeSchema>;

// ============================================
// Response Types
// ============================================

export type BookingInitializeResponse = {
  success?: true;
  bookingId: string;
  bookingNumber: string;
  status: string;
  totalAmount: number;
  orderName?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  isExisting: boolean;
};

export type BookingInitializeErrorResponse = {
  error: string;
  code?: string;
  conflicts?: string[];
  message?: string;
  details?: unknown;
};

// ============================================
// API Handler
// ============================================

export async function POST(
  request: NextRequest
): Promise<NextResponse<BookingInitializeResponse | BookingInitializeErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.email) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    if (session.user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: '고객만 예약을 생성할 수 있습니다' }, { status: 403 });
    }

    const body: unknown = await request.json();
    const validatedData = bookingInitializeSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: '사용자 정보를 찾을 수 없습니다' }, { status: 404 });
    }

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const existingBooking = await prisma.booking.findFirst({
      where: {
        customerId: user.id,
        idempotencyKey: validatedData.idempotencyKey,
        createdAt: {
          gt: fifteenMinutesAgo,
        },
      },
      include: {
        bookingPets: {
          include: {
            services: {
              include: {
                service: true,
              },
            },
          },
        },
      },
    });

    if (existingBooking) {
      console.log(
        `[Booking Initialize] Returning existing booking for idempotency key: ${validatedData.idempotencyKey}`
      );
      return NextResponse.json({
        bookingId: existingBooking.id,
        bookingNumber: existingBooking.bookingNumber,
        status: existingBooking.status,
        totalAmount: existingBooking.totalPrice,
        isExisting: true,
      });
    }

    const groomer = await prisma.user.findFirst({
      where: {
        id: validatedData.groomerId,
        role: 'GROOMER',
      },
      include: {
        groomerProfile: true,
      },
    });

    if (!groomer) {
      return NextResponse.json({ error: '미용사를 찾을 수 없습니다' }, { status: 404 });
    }

    if (!groomer.groomerProfile?.isActive) {
      return NextResponse.json(
        { error: '선택하신 미용사는 현재 예약을 받을 수 없는 상태입니다' },
        { status: 400 }
      );
    }

    const totalDuration = validatedData.petServices.reduce(
      (total, ps) => total + ps.services.reduce((dur, s) => dur + (s.duration || 60), 0),
      0
    );

    const requiredSlots = generateRequiredTimeSlots(validatedData.timeSlot, totalDuration);

    const availabilityCheck = await checkGroomerAvailability(
      validatedData.groomerId,
      new Date(validatedData.date),
      requiredSlots
    );

    if (!availabilityCheck.available) {
      return NextResponse.json(
        {
          error: '선택한 시간대가 이미 예약되었습니다',
          conflicts: availabilityCheck.conflicts,
          message: `다음 시간이 이미 예약되어 있습니다: ${availabilityCheck.conflicts?.join(', ')}`,
        },
        { status: 409 }
      );
    }

    const expectedTotal = validatedData.petServices.reduce((total, petService) => {
      const servicesTotal = petService.services.reduce((serviceTotal, service) => {
        return serviceTotal + service.price;
      }, 0);
      const optionsTotal = petService.options.reduce((optionTotal, option) => {
        return optionTotal + option.price;
      }, 0);
      return total + servicesTotal + optionsTotal;
    }, 0);

    const bookingNumber = `BK${Date.now()}`;

    const newBooking = await prisma.$transaction(async (tx) => {
      const existingConflict = await tx.booking.findFirst({
        where: {
          groomerId: validatedData.groomerId,
          serviceDate: new Date(validatedData.date),
          status: {
            notIn: ['SERVICE_CANCELLED', 'BOOKING_FAILED'],
          },
          OR: requiredSlots.map((slot) => ({
            serviceTime: slot,
          })),
        },
      });

      if (existingConflict) {
        throw new Error('시간대가 다른 예약과 충돌합니다. 다른 시간을 선택해주세요.');
      }

      let customerAddressId = validatedData.addressId;

      if (!customerAddressId && validatedData.customerAddress) {
        const newAddress = await tx.address.create({
          data: {
            customerId: user.id,
            street: validatedData.customerAddress.street,
            city: validatedData.customerAddress.city,
            state: validatedData.customerAddress.state,
            zipCode: validatedData.customerAddress.zipCode,
            country: 'KR',
            isDefault: false,
          },
        });
        customerAddressId = newAddress.id;
      }

      const booking = await tx.booking.create({
        data: {
          bookingNumber,
          customerId: user.id,
          groomerId: validatedData.groomerId,
          serviceDate: new Date(validatedData.date),
          serviceTime: validatedData.timeSlot,
          basePrice: expectedTotal,
          additionalCharges: 0,
          totalPrice: expectedTotal,
          status: 'FIRST_PAYMENT_PENDING',
          paymentStatus: 'PENDING',
          serviceType: 'GROOMING',
          specialRequests: validatedData.specialRequests,
          customerAddressId,
          estimatedDurationMinutes: totalDuration,
          idempotencyKey: validatedData.idempotencyKey,
        },
      });

      for (const petService of validatedData.petServices) {
        const bookingPet = await tx.bookingPet.create({
          data: {
            bookingId: booking.id,
            petId: petService.petId,
          },
        });

        // 서비스 저장
        for (const service of petService.services) {
          await tx.bookingService.create({
            data: {
              bookingPetId: bookingPet.id,
              serviceId: service.id,
              servicePrice: service.price,
            },
          });
        }

        // 옵션 저장
        for (const option of petService.options) {
          await tx.bookingPetOption.create({
            data: {
              bookingPetId: bookingPet.id,
              serviceOptionId: option.id,
              optionPrice: option.price,
            },
          });
        }
      }

      await tx.booking.update({
        where: { id: booking.id },
        data: {
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      });

      return booking;
    });

    console.log(`[Booking Initialize] Created new pending booking: ${newBooking.id}`);

    const orderName =
      validatedData.petServices.length === 1
        ? `${validatedData.petServices[0].services[0].name}`
        : `반려동물 ${validatedData.petServices.length}마리 미용서비스`;

    return NextResponse.json({
      success: true,
      bookingId: newBooking.id,
      bookingNumber: newBooking.bookingNumber,
      status: newBooking.status,
      totalAmount: expectedTotal,
      orderName,
      customerName: user.name || '고객',
      customerEmail: user.email || '',
      customerPhone: user.phoneNumber || '',
      isExisting: false,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message.includes('충돌') || error.message.includes('예약')) {
        return NextResponse.json(
          {
            error: error.message,
            code: 'BOOKING_CONFLICT',
          },
          { status: 409 }
        );
      }
    }

    console.error('[Booking Initialize] Error:', error);
    return NextResponse.json({ error: '예약 초기화 중 오류가 발생했습니다' }, { status: 500 });
  }
}
