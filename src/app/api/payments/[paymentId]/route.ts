import { ko } from 'date-fns/locale'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { format } from 'date-fns'

// ============================================
// Response Types
// ============================================
export interface PaymentDetailsResponse {
  id: string
  amount: number
  method: string
  paidAt: string | null
  booking: {
    id: string
    services: Array<{
      id: string
      name: string
      price: number
      duration: number
    }>
    pet: {
      name: string
      species: string
    }
    groomer: {
      name: string
      salon: string
      phone: string
    }
    scheduledDate: string
    scheduledTime: string
  } | null
  receipt: {
    receiptNumber: string
    downloadUrl: string
  }
}

export interface RefundResponse {
  success: boolean
  refundId: string
  refundAmount: number
  estimatedDate: string
  message: string
}

export interface PaymentErrorResponse {
  error: string
}

// ============================================
// Request Validation Schema (for PATCH)
// ============================================
export const refundPaymentSchema = z.object({
  reason: z.string().optional(),
})

export type RefundPaymentRequest = z.infer<typeof refundPaymentSchema>

/**
 * 결제 상세 정보 조회 엔드포인트
 * Success 페이지에서 사용
 *
 * @deprecated Use /api/payments/verify/[paymentId] instead
 * This endpoint will be removed in the next version
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
): Promise<NextResponse<PaymentDetailsResponse | PaymentErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { paymentId } = await params

    // 실제 DB에서 결제 정보 조회
    const payment = await prisma.payment.findUnique({
      where: { paymentId },
      include: {
        booking: {
          include: {
            customer: true,
            groomer: {
              include: {
                groomerProfile: true,
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
            customerAddress: true,
          },
        },
      },
    })

    if (!payment) {
      return NextResponse.json({ error: '결제 정보를 찾을 수 없습니다' }, { status: 404 })
    }

    // 권한 확인: 본인의 결제만 조회 가능
    if (payment.customerId && payment.customerId !== session.user.id) {
      return NextResponse.json({ error: '접근 권한이 없습니다' }, { status: 403 })
    }

    // Success 페이지 형식으로 데이터 변환
    const formattedPayment = {
      id: payment.id,
      amount: payment.amount,
      method: payment.method || '카드',
      paidAt: payment.paidAt ? format(payment.paidAt, 'yyyy-MM-dd HH:mm:ss', { locale: ko }) : null,
      booking: payment.booking
        ? {
            id: payment.booking.id,
            services: payment.booking.bookingPets.flatMap((bp) =>
              bp.services.map((s) => ({
                id: s.service.id,
                name: s.service.name,
                price: s.servicePrice,
                duration: s.service.durationMinutes,
              }))
            ),
            pet: payment.booking.bookingPets[0]
              ? {
                  name: payment.booking.bookingPets[0].pet.name,
                  species: payment.booking.bookingPets[0].pet.type,
                }
              : {
                  name: '알 수 없음',
                  species: '알 수 없음',
                },
            groomer: payment.booking.groomer
              ? {
                  name: payment.booking.groomer.name || '미용사',
                  salon: payment.booking.groomer.groomerProfile?.bankName || '미미살롱',
                  phone: payment.booking.groomer.phoneNumber || '',
                }
              : {
                  name: '미용사',
                  salon: '미미살롱',
                  phone: '',
                },
            scheduledDate: format(payment.booking.serviceDate, 'yyyy-MM-dd', { locale: ko }),
            scheduledTime: payment.booking.serviceTime,
          }
        : null,
      receipt: {
        receiptNumber: payment.paymentId,
        downloadUrl: payment.receiptUrl || '',
      },
    }

    return NextResponse.json<PaymentDetailsResponse>(formattedPayment)
  } catch (error) {
    console.error('[Payment Details] Error:', error)
    return NextResponse.json<PaymentErrorResponse>(
      { error: '결제 정보 조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

/**
 * 결제 취소/환불 요청
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
): Promise<NextResponse<RefundResponse | PaymentErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { paymentId } = await params
    const body: unknown = await request.json()
    const validatedData = refundPaymentSchema.parse(body)

    // 결제 정보 조회
    const payment = await prisma.payment.findUnique({
      where: { paymentId },
      include: {
        booking: true,
      },
    })

    if (!payment) {
      return NextResponse.json({ error: '결제 정보를 찾을 수 없습니다' }, { status: 404 })
    }

    // 권한 확인
    if (payment.customerId !== session.user.id) {
      return NextResponse.json({ error: '접근 권한이 없습니다' }, { status: 403 })
    }

    // 취소/환불 가능 여부 확인
    if (payment.status !== 'PAID') {
      return NextResponse.json({ error: '취소 가능한 결제가 아닙니다' }, { status: 400 })
    }

    if (payment.booking) {
      const scheduledDateTime = new Date(payment.booking.serviceDate)
      const now = new Date()
      const hoursUntilScheduled = (scheduledDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

      // 이미 지난 예약은 환불 불가
      if (hoursUntilScheduled < 0) {
        return NextResponse.json(
          { error: '이미 완료된 예약은 환불할 수 없습니다' },
          { status: 400 }
        )
      }

      // 환불 금액 계산 (2시간 이내는 50% 환불)
      const refundRate = hoursUntilScheduled < 2 ? 0.5 : 1.0
      const refundAmount = Math.floor(payment.amount * refundRate)

      // TODO: PortOne API를 통한 실제 환불 처리
      // const refundResult = await portoneClient.payment.cancelPayment({
      //   paymentId,
      //   reason: body.reason || "고객 요청",
      //   amount: refundAmount
      // });

      // DB 업데이트
      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelReason: validatedData.reason || '고객 요청',
          cancelledAmount: refundAmount,
        },
      })

      // 예약 상태도 업데이트
      if (payment.bookingId) {
        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            status: 'SERVICE_CANCELLED',
            paymentStatus: 'REFUNDED',
          },
        })
      }

      return NextResponse.json<RefundResponse>({
        success: true,
        refundId: `refund_${Date.now()}`,
        refundAmount,
        estimatedDate: format(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd', {
          locale: ko,
        }),
        message: '환불 요청이 성공적으로 접수되었습니다',
      })
    }

    return NextResponse.json<PaymentErrorResponse>(
      { error: '예약 정보를 찾을 수 없습니다' },
      { status: 404 }
    )
  } catch (error) {
    console.error('[Payment Refund] Error:', error)

    // Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json<PaymentErrorResponse>(
        { error: '잘못된 요청 데이터입니다' },
        { status: 400 }
      )
    }

    return NextResponse.json<PaymentErrorResponse>(
      { error: '환불 처리 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
