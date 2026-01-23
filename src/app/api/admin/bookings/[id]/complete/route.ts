import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { BookingStatus, PaymentStatus, prisma, Prisma } from '@mimisalon/shared'

interface ErrorResponse {
  error: string
}

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: {
    customer: {
      select: {
        id: true
        name: true
        email: true
        phoneNumber: true
      }
    }
    groomer: {
      select: {
        id: true
        name: true
        email: true
        phoneNumber: true
      }
    }
    bookingPets: {
      include: {
        pet: true
        services: {
          include: {
            service: true
          }
        }
      }
    }
    payments: true
  }
}>

// Serialized response type (Date fields converted to strings for Redux compatibility)
interface AdminBookingsCompleteResponse {
  success: boolean
  booking: Omit<
    BookingWithRelations,
    | 'createdAt'
    | 'updatedAt'
    | 'serviceDate'
    | 'confirmedAt'
    | 'cancelledAt'
    | 'completedAt'
    | 'actualStartTime'
    | 'actualEndTime'
  > & {
    createdAt: string
    updatedAt: string
    serviceDate: string
    confirmedAt: string | null
    cancelledAt: string | null
    completedAt: string | null
    actualStartTime: string | null
    actualEndTime: string | null
  }
  message: string
}

export async function PATCH({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<NextResponse<AdminBookingsCompleteResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    // 관리자 권한 확인
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: bookingId } = await params

    // Booking 조회
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        status: true,
        bookingNumber: true,
        serviceDate: true,
        serviceTime: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // 완료 가능한 상태인지 확인
    const completableStatuses: BookingStatus[] = [
      BookingStatus.WORK_IN_PROGRESS,
      BookingStatus.ADDITIONAL_PAYMENT_COMPLETE,
    ]

    if (!completableStatuses.includes(booking.status)) {
      return NextResponse.json(
        {
          error: 'Invalid status for completion',
          currentStatus: booking.status,
          allowedStatuses: completableStatuses,
        },
        { status: 400 }
      )
    }

    // Booking 상태 업데이트
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.SERVICE_COMPLETED,
        paymentStatus: PaymentStatus.COMPLETED,
        completedAt: new Date(),
        actualEndTime: new Date(), // 실제 종료 시간 기록
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        groomer: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
        bookingPets: {
          include: {
            pet: true,
            services: {
              include: {
                service: true,
              },
            },
          },
        },
        payments: true,
      },
    })

    console.log(`[Complete] Booking ${booking.bookingNumber} completed by admin`)

    // Serialize Date fields to ISO strings for Redux compatibility (CLAUDE.md lines 98-128)
    return NextResponse.json({
      success: true,
      booking: {
        ...updatedBooking,
        createdAt: updatedBooking.createdAt.toISOString(),
        updatedAt: updatedBooking.updatedAt.toISOString(),
        serviceDate: updatedBooking.serviceDate.toISOString(),
        confirmedAt: updatedBooking.confirmedAt?.toISOString() ?? null,
        cancelledAt: updatedBooking.cancelledAt?.toISOString() ?? null,
        completedAt: updatedBooking.completedAt?.toISOString() ?? null,
        actualStartTime: updatedBooking.actualStartTime?.toISOString() ?? null,
        actualEndTime: updatedBooking.actualEndTime?.toISOString() ?? null,
      },
      message: '서비스가 완료 처리되었습니다.',
    })
  } catch (error) {
    console.error('[Complete] Error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
