import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { prisma } from '@mimisalon/shared';
import { z } from 'zod';
import { BookingNotificationService } from '@/lib/booking-notifications';

// Request schema - EXPORTED
export const quoteRequestSchema = z.object({
  additionalServices: z.array(
    z.object({
      name: z.string().min(1, '서비스 이름을 입력해주세요'),
      description: z.string().optional(),
      price: z.number().positive('가격은 0보다 커야 합니다'),
      quantity: z.number().positive('수량은 1 이상이어야 합니다').default(1),
    })
  ),
  totalAdditionalAmount: z.number().positive('총 추가 금액은 0보다 커야 합니다'),
  reason: z.string().optional(),
  estimatedTime: z.number().optional(),
});

export type QuoteRequestRequest = z.infer<typeof quoteRequestSchema>;

// Response types - EXPORTED
export type QuoteRequestResponse = {
  message: string;
  booking: {
    id: string;
    status: string;
    additionalCharges: number;
  };
  quote: {
    additionalServices: Array<{
      name: string;
      description?: string;
      price: number;
      quantity: number;
    }>;
    totalAdditionalAmount: number;
    estimatedTime?: number;
  };
};

export type QuoteInfoResponse = {
  booking: {
    id: string;
    status: string;
    basePrice: number;
    additionalCharges: number;
    totalPrice: number;
    serviceDate: Date;
    serviceTime: string;
    customer: {
      name: string | null;
      phone: string | null;
    };
    groomer: {
      name: string | null | undefined;
    };
    pets: Array<{
      name: string;
      breed: string;
      services: Array<{
        name: string;
        price: number;
      }>;
    }>;
  };
  additionalServices: Array<{
    name: string;
    description?: string;
    price: number;
    quantity: number;
  }>;
  totalAdditionalAmount: number;
};

type ErrorResponse = {
  error: string;
  details?: unknown;
};

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || session.user.role !== 'GROOMER') {
      return NextResponse.json({ error: '미용사 권한이 필요합니다' }, { status: 403 });
    }

    const { id: bookingId } = await params;
    const body = await request.json();
    const quoteData = quoteRequestSchema.parse(body);

    // 예약 정보 조회 및 권한 확인
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        groomer: true,
        bookingPets: {
          include: {
            pet: {
              include: {
                breed: true,
              },
            },
            services: {
              include: {
                service: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 });
    }

    if (booking.groomerId !== session.user.id) {
      return NextResponse.json({ error: '해당 예약에 대한 권한이 없습니다' }, { status: 403 });
    }

    // 견적 요청 가능한 상태인지 확인
    if (!['GROOMER_CONFIRM', 'WORK_IN_PROGRESS'].includes(booking.status)) {
      return NextResponse.json(
        { error: '현재 상태에서는 견적을 요청할 수 없습니다' },
        { status: 400 }
      );
    }

    // 예약에 추가 서비스 정보 저장
    // 실제로는 별도의 AdditionalService 테이블을 만들거나
    // booking 테이블에 JSON 필드로 저장할 수 있습니다
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'ADDITIONAL_PAYMENT_PENDING',
        additionalCharges: quoteData.totalAdditionalAmount,
        notes: quoteData.reason || booking.notes,
        updatedAt: new Date(),
      },
    });

    // 추가 서비스 정보를 JSON으로 저장하거나 별도 테이블에 저장
    // 여기서는 간단히 notes 필드에 저장하는 예시
    const additionalServicesJson = JSON.stringify({
      services: quoteData.additionalServices,
      totalAmount: quoteData.totalAdditionalAmount,
      estimatedTime: quoteData.estimatedTime,
      requestedAt: new Date(),
      requestedBy: session.user.id,
    });

    // 실제로는 별도 테이블에 저장하는 것이 좋습니다
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        specialRequests: additionalServicesJson,
      },
    });

    // 고객에게 견적 요청 알림 발송
    await BookingNotificationService.notifyCustomerQuoteRequested(booking.customerId, {
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber || booking.id,
      customerName: booking.customer.name || '',
      groomerName: booking.groomer?.name || '미용사',
      serviceDate: booking.serviceDate,
      serviceTime: booking.serviceTime,
      petNames: booking.bookingPets.map((bp) => bp.pet.name),
      totalPrice: booking.totalPrice || 0,
      totalAdditionalAmount: quoteData.totalAdditionalAmount,
    });

    return NextResponse.json({
      message: '견적이 성공적으로 요청되었습니다',
      booking: {
        id: updatedBooking.id,
        status: updatedBooking.status,
        additionalCharges: updatedBooking.additionalCharges,
      },
      quote: {
        additionalServices: quoteData.additionalServices,
        totalAdditionalAmount: quoteData.totalAdditionalAmount,
        estimatedTime: quoteData.estimatedTime,
      },
    });
  } catch (error) {
    console.error('Quote request error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '잘못된 견적 요청 데이터입니다', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: '견적 요청 중 오류가 발생했습니다' }, { status: 500 });
  }
}

// 견적 정보 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    const { id: bookingId } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        groomer: true,
        bookingPets: {
          include: {
            pet: {
              include: {
                breed: true,
              },
            },
            services: {
              include: {
                service: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 });
    }

    // 권한 확인 (고객 본인 또는 담당 미용사)
    if (session.user.role === 'CUSTOMER' && booking.customerId !== session.user.id) {
      return NextResponse.json({ error: '해당 예약에 대한 권한이 없습니다' }, { status: 403 });
    }

    if (session.user.role === 'GROOMER' && booking.groomerId !== session.user.id) {
      return NextResponse.json({ error: '해당 예약에 대한 권한이 없습니다' }, { status: 403 });
    }

    // 추가 서비스 정보 파싱
    let additionalServices = [];
    if (booking.specialRequests) {
      try {
        const parsed = JSON.parse(booking.specialRequests);
        additionalServices = parsed.services || [];
      } catch (e) {
        console.error('Failed to parse additional services:', e);
      }
    }

    return NextResponse.json({
      booking: {
        id: booking.id,
        status: booking.status,
        basePrice: booking.basePrice,
        additionalCharges: booking.additionalCharges,
        totalPrice: booking.totalPrice,
        serviceDate: booking.serviceDate,
        serviceTime: booking.serviceTime,
        customer: {
          name: booking.customer.name,
          phone: booking.customer.phoneNumber,
        },
        groomer: {
          name: booking.groomer?.name,
        },
        pets: booking.bookingPets.map((bp) => ({
          name: bp.pet.name,
          breed: bp.pet.breed?.name || '알 수 없음',
          services: bp.services.map((s) => ({
            name: s.service.name,
            price: s.servicePrice,
          })),
        })),
      },
      additionalServices,
      totalAdditionalAmount: booking.additionalCharges,
    });
  } catch (error) {
    console.error('Quote fetch error:', error);
    return NextResponse.json({ error: '견적 정보 조회 중 오류가 발생했습니다' }, { status: 500 });
  }
}
