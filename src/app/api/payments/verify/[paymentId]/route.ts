import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'

/**
 * 결제 상태 조회 엔드포인트 (웹훅 기반)
 *
 * 이 엔드포인트는 DB에 저장된 결제 상태만 조회합니다.
 * 모든 결제 상태 업데이트는 /api/v1/webhooks/portone 웹훅을 통해 처리됩니다.
 *
 * @security 웹훅 전용 인증으로 클라이언트 조작 방지
 * @description PortOne API를 직접 호출하지 않고 웹훅으로 받은 데이터만 신뢰
 */

// ============================================
// Response Types
// ============================================
export interface PaymentVerificationResponse {
  success: boolean
  status?: string
  error?: string
  message?: string
  payment?: PaymentVerificationData
}

export interface PaymentVerificationData {
  id: string
  paymentId: string
  amount: number
  method: string
  status: string
  paidAt: Date | null
  receiptUrl: string | null
  booking: {
    id: string
    bookingNumber: string
    serviceDate: Date
    serviceTime: string
    status: string // Can be BookingStatus enum value as string
    groomer: {
      name: string | null // Allow null for name
    } | null
    pets: Array<{
      name: string
      breed: string // breed name as string, not object
      services: Array<{
        name: string
        price: number
        duration: number
      }>
    }>
    address: {
      street: string
      city: string
      state: string
      zipCode: string
    } | null
  } | null
}

export interface ErrorResponse {
  error: string
  details?: unknown
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
): Promise<NextResponse<PaymentVerificationResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return NextResponse.json<ErrorResponse>({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { paymentId } = await params

    // 데이터베이스에서 결제 정보 조회 (웹훅으로 업데이트된 상태)
    const paymentRecord = await prisma.payment.findUnique({
      where: { paymentId },
      include: {
        booking: {
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
            customerAddress: true,
          },
        },
      },
    })

    // 결제 레코드가 없으면 에러 반환
    if (!paymentRecord) {
      return NextResponse.json(
        {
          success: false,
          status: 'NOT_FOUND',
          error: '결제 정보를 찾을 수 없습니다.',
          message: '결제가 아직 처리되지 않았습니다. 잠시 후 다시 시도해주세요.',
        },
        { status: 404 }
      )
    }

    // 권한 확인: 본인의 결제만 조회 가능
    if (paymentRecord.customerId && paymentRecord.customerId !== session.user.id) {
      return NextResponse.json<ErrorResponse>({ error: '접근 권한이 없습니다' }, { status: 403 })
    }

    // 결제 상태에 따른 응답 처리
    switch (paymentRecord.status) {
      case 'PAID':
        // 결제 성공 - 웹훅으로 확인된 상태
        return NextResponse.json<PaymentVerificationResponse>({
          success: true,
          payment: {
            id: paymentRecord.id,
            paymentId: paymentRecord.paymentId,
            amount: paymentRecord.amount,
            method: paymentRecord.method,
            status: paymentRecord.status,
            paidAt: paymentRecord.paidAt,
            receiptUrl: paymentRecord.receiptUrl,
            booking: paymentRecord.booking
              ? {
                  id: paymentRecord.booking.id,
                  bookingNumber: paymentRecord.booking.bookingNumber,
                  serviceDate: paymentRecord.booking.serviceDate,
                  serviceTime: paymentRecord.booking.serviceTime,
                  status: paymentRecord.booking.status,
                  groomer: paymentRecord.booking.groomer
                    ? {
                        name: paymentRecord.booking.groomer.name,
                      }
                    : null,
                  pets: paymentRecord.booking.bookingPets.map((bp) => ({
                    name: bp.pet.name,
                    breed: bp.pet.breed?.name || '알 수 없음',
                    services: bp.services.map((s) => ({
                      name: s.service.name,
                      price: s.servicePrice,
                      duration: s.service.durationMinutes,
                    })),
                  })),
                  address: paymentRecord.booking.customerAddress
                    ? {
                        street: paymentRecord.booking.customerAddress.street,
                        city: paymentRecord.booking.customerAddress.city,
                        state: paymentRecord.booking.customerAddress.state,
                        zipCode: paymentRecord.booking.customerAddress.zipCode,
                      }
                    : null,
                }
              : null,
          },
        })

      case 'PENDING':
        // 결제 대기 중 - 웹훅을 아직 받지 못한 상태
        return NextResponse.json<PaymentVerificationResponse>({
          success: false,
          status: 'PENDING',
          message: '결제가 처리 중입니다. 잠시 후 다시 확인해주세요.',
        })

      case 'FAILED':
        // 결제 실패 - 웹훅으로 확인된 상태
        return NextResponse.json<PaymentVerificationResponse>({
          success: false,
          status: 'FAILED',
          error: paymentRecord.failReason || '결제가 실패했습니다',
          message: '결제가 실패했습니다. 다시 시도해주세요.',
        })

      case 'CANCELLED':
        // 결제 취소 - 웹훅으로 확인된 상태
        return NextResponse.json<PaymentVerificationResponse>({
          success: false,
          status: 'CANCELLED',
          error: paymentRecord.cancelReason || '결제가 취소되었습니다',
          message: '결제가 취소되었습니다.',
        })

      default:
        // 알 수 없는 상태
        return NextResponse.json<PaymentVerificationResponse>({
          success: false,
          status: paymentRecord.status,
          message: '결제 상태를 확인할 수 없습니다.',
        })
    }
  } catch (error) {
    console.error('[Payment Status Check] Error:', error)
    return NextResponse.json<ErrorResponse>(
      { error: '결제 상태 확인 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
