import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { BookingStatus, Prisma, prisma } from '@mimisalon/shared'

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
  }
}>

// Serialized response type (Date fields converted to strings for Redux compatibility)
interface AdminBookingsConfirmResponse {
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

interface ErrorResponse {
  error: string
}

export async function PATCH({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<NextResponse<AdminBookingsConfirmResponse | ErrorResponse>> {
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
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // 확정 가능한 상태인지 확인
    const confirmableStatuses: BookingStatus[] = [
      BookingStatus.GROOMER_CONFIRM_PENDING,
      BookingStatus.FIRST_PAYMENT_COMPLETE,
    ]

    if (!confirmableStatuses.includes(booking.status)) {
      return NextResponse.json(
        {
          error: 'Invalid status for confirmation',
          currentStatus: booking.status,
          allowedStatuses: confirmableStatuses,
        },
        { status: 400 }
      )
    }

    // Booking 상태 업데이트
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.GROOMER_CONFIRM,
        confirmedAt: new Date(),
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
      },
    })

    console.log(`[Confirm] Booking ${booking.bookingNumber} confirmed by admin`)

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
      message: '예약이 확정되었습니다.',
    })
  } catch (error) {
    console.error('[Confirm] Error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
