import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { BookingStatus } from '@mimisalon/shared'

// Response types - EXPORTED
export type CompleteBookingResponse = {
  success: boolean
  booking: {
    id: string
    status: string
    actualEndTime: Date | null
  }
}

type ErrorResponse = {
  error: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<CompleteBookingResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user || session.user.role !== 'GROOMER') {
      return NextResponse.json({ error: '미용사 권한이 필요합니다' }, { status: 403 })
    }

    const { id } = await params

    // 예약 정보 확인
    const booking = await prisma.booking.findFirst({
      where: {
        id,
        groomerId: session.user.id,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 })
    }

    // 이미 완료된 예약인지 확인
    if (booking.status === BookingStatus.SERVICE_COMPLETED) {
      return NextResponse.json({ error: '이미 완료된 예약입니다' }, { status: 400 })
    }

    // 예약 상태를 SERVICE_COMPLETED로 업데이트
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.SERVICE_COMPLETED,
        actualEndTime: new Date(),
      },
    })

    // TODO: 고객에게 서비스 완료 알림 전송
    // TODO: 정산 데이터 생성

    return NextResponse.json({
      success: true,
      booking: {
        id: updatedBooking.id,
        status: updatedBooking.status,
        actualEndTime: updatedBooking.actualEndTime,
      },
    })
  } catch (error) {
    console.error('Service completion error:', error)
    return NextResponse.json({ error: '서비스 완료 처리 중 오류가 발생했습니다' }, { status: 500 })
  }
}
