import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'

interface ErrorResponse {
  error: string
  message?: string
}

interface AdminBookingDeleteResponse {
  success: boolean
  message: string
}

export async function DELETE({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<NextResponse<AdminBookingDeleteResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    // 관리자 권한 확인
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: bookingId } = await params

    // Booking 존재 확인
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        bookingNumber: true,
        status: true,
        payments: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // 진행 중인 결제가 있는지 확인
    const hasActivePayments = booking.payments.some(
      (payment) => payment.status === 'PAID' || payment.status === 'COMPLETED'
    )

    if (hasActivePayments) {
      return NextResponse.json(
        {
          error: 'Cannot delete booking with active payments',
          message: '활성 결제가 있는 예약은 삭제할 수 없습니다. 먼저 예약을 취소해주세요.',
        },
        { status: 400 }
      )
    }

    // 트랜잭션으로 관련 데이터 삭제
    await prisma.$transaction(async (tx) => {
      // BookingService 삭제 (BookingPet에 cascade 설정되어 있음)
      // BookingPet 삭제 (Booking에 cascade 설정 필요할 수 있음)
      // 명시적으로 관련 데이터 삭제
      await tx.bookingService.deleteMany({
        where: {
          bookingPet: {
            bookingId,
          },
        },
      })

      await tx.bookingPet.deleteMany({
        where: { bookingId },
      })

      // Payments는 보존 (audit trail을 위해)하거나 soft delete 고려
      // 여기서는 연결만 해제
      await tx.payment.updateMany({
        where: { bookingId },
        data: { bookingId: null },
      })

      // Booking 삭제
      await tx.booking.delete({
        where: { id: bookingId },
      })
    })

    console.log(`[Delete] Booking ${booking.bookingNumber} deleted by admin`)

    return NextResponse.json({
      success: true,
      message: '예약이 삭제되었습니다.',
    })
  } catch (error) {
    console.error('[Delete] Error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
