import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { BookingStatus, PaymentStatus, prisma } from '@mimisalon/shared'
import { cancelPayment } from '@/lib/portone-server'

interface ErrorResponse {
  error: string
  message?: string
  details?: Array<{ paymentId: string; error: string }>
}

// Serialized response type (Date fields converted to strings for Redux compatibility)
interface AdminBookingCancelResponse {
  success: boolean
  booking: {
    id: string
    bookingNumber: string
    status: BookingStatus
    cancelledAt: string | null // ✅ string, not Date
    cancelledBy: string | null
    cancellationReason: string | null
  }
  cancellationResults: {
    totalPayments: number
    successfulCancellations: number
    failedCancellations: number
    details?: Array<{ paymentId: string; error: string }>
  }
  message: string
}

export async function PATCH({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<NextResponse<AdminBookingCancelResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    // 관리자 권한 확인
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: bookingId } = await params

    // 관리자 사용자 정보 조회
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, name: true },
    })

    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 })
    }

    // Booking과 관련된 모든 결제 정보 조회
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payments: {
          where: {
            status: {
              in: [PaymentStatus.PAID, PaymentStatus.COMPLETED],
            },
          },
        },
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // 이미 취소된 예약인지 확인
    if (booking.status === BookingStatus.SERVICE_CANCELLED) {
      return NextResponse.json({ error: 'Booking is already cancelled' }, { status: 400 })
    }

    // 취소 가능한 상태인지 확인
    const cancellableStatuses: BookingStatus[] = [
      BookingStatus.FIRST_PAYMENT_PENDING,
      BookingStatus.FIRST_PAYMENT_COMPLETE,
      BookingStatus.FIRST_PAYMENT_VERIFY,
      BookingStatus.GROOMER_CONFIRM_PENDING,
      BookingStatus.GROOMER_CONFIRM,
      BookingStatus.ADDITIONAL_PAYMENT_PENDING,
      BookingStatus.ADDITIONAL_PAYMENT_COMPLETE,
      BookingStatus.WORK_IN_PROGRESS,
      BookingStatus.SERVICE_COMPLETED, // 완료된 예약도 환불 가능
    ]

    if (!cancellableStatuses.includes(booking.status)) {
      return NextResponse.json(
        { error: 'Booking cannot be cancelled in current status' },
        { status: 400 }
      )
    }

    // 결제 취소 결과 추적
    const cancellationResults = {
      successful: [] as string[],
      failed: [] as { paymentId: string; error: string }[],
    }

    // 취소 사유 결정
    const isRefund = booking.status === BookingStatus.SERVICE_COMPLETED
    const cancelReason = isRefund
      ? `관리자 환불 처리 - 예약번호: ${booking.bookingNumber} (서비스 완료 후 환불)`
      : `관리자 예약 취소 - 예약번호: ${booking.bookingNumber}`

    // 각 결제에 대해 PortOne 취소 API 호출
    for (const payment of booking.payments) {
      try {
        console.log(`[Cancel] Processing payment cancellation for paymentId: ${payment.paymentId}`)

        // PortOne API를 통한 결제 취소
        await cancelPayment(payment.paymentId, cancelReason)

        cancellationResults.successful.push(payment.paymentId)
        console.log(`[Cancel] Successfully cancelled payment: ${payment.paymentId}`)
      } catch (error) {
        console.error(`[Cancel] Failed to cancel payment ${payment.paymentId}:`, error)

        // 이미 취소된 결제는 성공으로 처리
        if (error instanceof Error && error.message.includes('already cancelled')) {
          cancellationResults.successful.push(payment.paymentId)
        } else {
          cancellationResults.failed.push({
            paymentId: payment.paymentId,
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }
    }

    // 모든 결제 취소가 실패한 경우
    if (cancellationResults.successful.length === 0 && booking.payments.length > 0) {
      return NextResponse.json(
        {
          error: 'Failed to cancel all payments',
          details: cancellationResults.failed,
        },
        { status: 500 }
      )
    }

    // 트랜잭션으로 DB 업데이트
    const updatedBooking = await prisma.$transaction(async (tx) => {
      // 성공한 결제들의 상태 업데이트
      if (cancellationResults.successful.length > 0) {
        await tx.payment.updateMany({
          where: {
            bookingId,
            paymentId: {
              in: cancellationResults.successful,
            },
          },
          data: {
            status: PaymentStatus.CANCELLED,
            cancelledAt: new Date(),
            cancelReason: isRefund ? '관리자 환불 처리' : '관리자 예약 취소',
            cancelledAmount: booking.totalPrice, // 전액 취소
          },
        })
      }

      // Booking 상태 업데이트
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.SERVICE_CANCELLED,
          paymentStatus: PaymentStatus.CANCELLED,
          cancelledAt: new Date(),
          cancelledBy: `${adminUser.name} (${adminUser.id})`,
          cancellationReason: isRefund ? '관리자에 의한 환불 처리' : '관리자에 의한 예약 취소',
        },
        include: {
          customer: true,
          groomer: true,
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

      return updated
    })

    // 취소 알림 로그 (추후 알림 시스템 구현 시 활용)
    console.log(`[Cancel] Booking ${booking.bookingNumber} cancelled by admin ${adminUser.name}`)
    console.log(`[Cancel] Customer: ${booking.customer.name} (${booking.customer.email})`)
    console.log(`[Cancel] Successful cancellations: ${cancellationResults.successful.length}`)
    console.log(`[Cancel] Failed cancellations: ${cancellationResults.failed.length}`)

    // Serialize Date fields to ISO strings for Redux compatibility (CLAUDE.md lines 98-128)
    // 응답 반환
    return NextResponse.json({
      success: true,
      booking: {
        id: updatedBooking.id,
        bookingNumber: updatedBooking.bookingNumber,
        status: updatedBooking.status,
        cancelledAt: updatedBooking.cancelledAt?.toISOString() ?? null,
        cancelledBy: updatedBooking.cancelledBy,
        cancellationReason: updatedBooking.cancellationReason,
      },
      cancellationResults: {
        totalPayments: booking.payments.length,
        successfulCancellations: cancellationResults.successful.length,
        failedCancellations: cancellationResults.failed.length,
        details: cancellationResults.failed.length > 0 ? cancellationResults.failed : undefined,
      },
      message:
        cancellationResults.failed.length > 0
          ? isRefund
            ? `환불 처리되었습니다. 일부 결제 환불 실패 (${cancellationResults.failed.length}건)`
            : `예약이 취소되었습니다. 일부 결제 취소 실패 (${cancellationResults.failed.length}건)`
          : isRefund
            ? '예약과 모든 결제가 성공적으로 환불 처리되었습니다.'
            : '예약과 모든 결제가 성공적으로 취소되었습니다.',
    })
  } catch (error) {
    console.error('[Cancel] Unexpected error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
