import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { preRegisterPayment } from '@/lib/portone-server'
import { workerApiClient } from '@/lib/worker-api-client'
import { BookingStatus, PaymentStatus, UserRole, Prisma } from '@mimisalon/shared'
import { PAYMENT_EXPIRY_MS } from '@/lib/config/payment'
import { nanoid } from 'nanoid'
import { env } from '@/lib/env'

// ============================================
// Request Validation Schema
// ============================================
export const initializePaymentSchema = z.object({
  bookingId: z.string().min(1, '예약 ID는 필수입니다'),
  amount: z.number().positive('금액은 양수여야 합니다'),
  orderName: z.string().min(1, '주문명은 필수입니다'),
})

export type InitializePaymentRequest = z.infer<typeof initializePaymentSchema>

// ============================================
// Response Types
// ============================================
export interface InitializePaymentResponse {
  success: boolean
  paymentId: string
  amount: number
  orderName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  channelKey: string
  storeId: string
}

export interface InitializePaymentErrorResponse {
  error: string
  currentStatus?: string
  expectedAmount?: number
  requestedAmount?: number
  paymentType?: string
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<InitializePaymentResponse | InitializePaymentErrorResponse>> {
  try {
    // Log PG service connection status
    console.log('📱 [Payment Initialize] 결제 초기화 요청 시작')
    if (env.PORTONE_API_SECRET) {
      console.log('✅ [Payment Initialize] PG 서비스 (PortOne) 연결 상태: 활성화')
    } else {
      console.error('❌ [Payment Initialize] PG 서비스 (PortOne) 연결 상태: 미활성화')
    }

    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const body: unknown = await request.json()
    const validatedData = initializePaymentSchema.parse(body)
    const { bookingId, amount, orderName } = validatedData

    const expiryThreshold = new Date(Date.now() - PAYMENT_EXPIRY_MS)

    // Comprehensive transaction covering all database operations
    const { paymentId, isNewPayment, user } = await prisma.$transaction(
      async (tx) => {
        // 사용자 전체 정보 조회 (transaction 내)
        const user = await tx.user.findUnique({
          where: { id: session.user.id },
          select: {
            id: true,
            email: true,
            name: true,
            phoneNumber: true,
          },
        })

        if (!user) {
          throw new Error('USER_NOT_FOUND')
        }

        // 예약 정보 확인 (transaction 내)
        const booking = await tx.booking.findUnique({
          where: { id: bookingId },
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
            groomer: {
              include: {
                groomerProfile: true,
              },
            },
          },
        })

        if (!booking) {
          throw new Error('BOOKING_NOT_FOUND')
        }

        // 권한 확인
        if (booking.customerId !== session.user.id) {
          throw new Error('FORBIDDEN')
        }

        // 예약 상태 확인 - 결제 가능한 상태인지 검증
        const payableStatuses: BookingStatus[] = [
          BookingStatus.FIRST_PAYMENT_PENDING,
          BookingStatus.ADDITIONAL_PAYMENT_PENDING,
        ]

        if (!payableStatuses.includes(booking.status)) {
          throw new Error(`INVALID_BOOKING_STATUS:${booking.status}`)
        }

        // 그루머 상태 확인 - 그루머가 할당된 경우에만 검증
        if (booking.groomerId) {
          if (!booking.groomer) {
            throw new Error('GROOMER_NOT_FOUND')
          }

          // 그루머 프로필이 활성화 상태인지 확인
          if (!booking.groomer.groomerProfile?.isActive) {
            throw new Error('GROOMER_INACTIVE')
          }

          // 그루머 role 확인
          if (booking.groomer.role !== UserRole.GROOMER) {
            throw new Error('INVALID_GROOMER')
          }
        }

        // 금액 검증 - 예약 상태별로 다른 검증 로직 적용
        let expectedAmount: number
        let paymentDescription: string

        switch (booking.status) {
          case BookingStatus.FIRST_PAYMENT_PENDING:
            // 1차 결제 시: 예약금(basePrice)과 비교
            expectedAmount = booking.basePrice
            paymentDescription = '예약금'
            break

          case BookingStatus.ADDITIONAL_PAYMENT_PENDING:
            // 2차 결제 시: 잔금(additionalCharges)과 비교
            expectedAmount = booking.additionalCharges
            paymentDescription = '잔금'
            break

          default:
            // 기존 전체 결제: 전체 서비스 금액과 비교
            const totalServiceAmount = booking.bookingPets.reduce((total, pet) => {
              return total + pet.services.reduce((sum, s) => sum + s.servicePrice, 0)
            }, 0)
            expectedAmount = totalServiceAmount
            paymentDescription = '전체 금액'
        }

        if (expectedAmount !== amount) {
          throw new Error(`AMOUNT_MISMATCH:${paymentDescription}:${expectedAmount}:${amount}`)
        }

        // 기존 결제 확인 (transaction 내에서)
        const existingPayment = await tx.payment.findFirst({
          where: {
            bookingId,
            status: PaymentStatus.PENDING,
            createdAt: {
              gt: expiryThreshold,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        // 만료된 PENDING 결제들을 EXPIRED로 변경
        await tx.payment.updateMany({
          where: {
            bookingId,
            status: PaymentStatus.PENDING,
            createdAt: {
              lte: expiryThreshold,
            },
          },
          data: {
            status: PaymentStatus.EXPIRED,
          },
        })

        if (existingPayment) {
          // 기존 결제 ID 재사용
          console.log(`[Payment Initialize] Reusing existing payment: ${existingPayment.paymentId}`)
          return {
            paymentId: existingPayment.paymentId,
            isNewPayment: false,
            user,
          }
        } else {
          // 새로운 결제 ID 생성 (nanoid로 보안성 강화)
          const newPaymentId = `payment-${Date.now()}-${nanoid(10)}`
          console.log(`[Payment Initialize] Creating new payment: ${newPaymentId}`)

          // DB에 결제 레코드 생성 (PENDING 상태) - transaction 내에서
          await tx.payment.create({
            data: {
              paymentId: newPaymentId,
              status: PaymentStatus.PENDING,
              amount,
              currency: 'KRW',
              customerId: user.id,
              bookingId,
              orderName,
              method: 'PENDING', // 결제 방법은 실제 결제 시 업데이트됨
            },
          })

          return {
            paymentId: newPaymentId,
            isNewPayment: true,
            user,
          }
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000, // 5 seconds max wait to acquire transaction
        timeout: 10000, // 10 seconds max transaction duration
      }
    )

    // 새로운 결제인 경우에만 외부 작업 수행 (transaction 외부)
    if (isNewPayment) {
      const preRegisterStartTime = Date.now()

      // 포트원에 결제 사전 등록 (선택사항이지만 권장)
      try {
        await preRegisterPayment({
          paymentId,
          totalAmount: amount,
          currency: 'KRW',
          orderName,
        })
        console.log(`[Payment Initialize] Pre-registration successful for ${paymentId}`)
      } catch (error) {
        console.error('[Payment Initialize] Pre-register failed:', error)
        // 사전 등록 실패해도 계속 진행 (선택사항이므로)
        // NOTE: 프로덕션에서는 이 에러를 모니터링 시스템에 보고해야 합니다
      }

      // 5분 후 자동 정리 작업 예약 (사전 등록 시간 고려)
      // 결제가 5분 내에 완료되지 않으면 자동으로 정리
      try {
        const cleanupDelayMs = 5 * 60 * 1000
        const preRegisterDuration = Date.now() - preRegisterStartTime
        const adjustedCleanupDelay = Math.max(
          cleanupDelayMs - preRegisterDuration,
          60000 // 최소 1분은 보장
        )

        await workerApiClient.schedulePaymentCleanup({
          paymentId,
          bookingId,
          delayMs: adjustedCleanupDelay,
        })
        console.log(
          `[Payment Initialize] Scheduled cleanup job for payment: ${paymentId} (delay: ${adjustedCleanupDelay}ms)`
        )
      } catch (cleanupError) {
        console.error('[Payment Initialize] Failed to schedule cleanup job:', cleanupError)
        // NOTE: 정리 작업 예약 실패는 심각한 문제 - 만료된 결제가 정리되지 않음
        // 프로덕션에서는 이를 즉시 알림으로 전달하거나 재시도해야 합니다
        throw new Error('Failed to schedule payment cleanup - operation aborted')
      }
    }

    // 클라이언트에서 사용할 정보 반환
    const channelKey = env.PORTONE_CHANNEL_KEY || env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY
    const storeId = env.PORTONE_STORE_ID || env.NEXT_PUBLIC_PORTONE_STORE_ID

    if (!channelKey || !storeId) {
      return NextResponse.json<InitializePaymentErrorResponse>(
        { error: 'PortOne 설정이 올바르지 않습니다' },
        { status: 500 }
      )
    }

    return NextResponse.json<InitializePaymentResponse>({
      success: true,
      paymentId,
      amount,
      orderName,
      customerName: user.name || '고객',
      customerEmail: user.email || '',
      customerPhone: user.phoneNumber || '',
      channelKey,
      storeId,
    })
  } catch (error) {
    console.error('[Payment Initialize] Error:', error)

    // Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json<InitializePaymentErrorResponse>(
        { error: '잘못된 요청 데이터입니다' },
        { status: 400 }
      )
    }

    // Handle structured errors from transaction
    if (error instanceof Error) {
      const errorMessage = error.message

      if (errorMessage === 'USER_NOT_FOUND') {
        return NextResponse.json({ error: '사용자 정보를 찾을 수 없습니다' }, { status: 404 })
      }

      if (errorMessage === 'BOOKING_NOT_FOUND') {
        return NextResponse.json({ error: '예약 정보를 찾을 수 없습니다' }, { status: 404 })
      }

      if (errorMessage === 'FORBIDDEN') {
        return NextResponse.json({ error: '접근 권한이 없습니다' }, { status: 403 })
      }

      if (errorMessage.startsWith('INVALID_BOOKING_STATUS:')) {
        const status = errorMessage.split(':')[1]
        return NextResponse.json(
          {
            error: '결제할 수 없는 예약 상태입니다',
            currentStatus: status,
          },
          { status: 400 }
        )
      }

      if (errorMessage === 'GROOMER_NOT_FOUND') {
        return NextResponse.json({ error: '그루머 정보를 찾을 수 없습니다' }, { status: 404 })
      }

      if (errorMessage === 'GROOMER_INACTIVE') {
        return NextResponse.json(
          { error: '선택하신 그루머는 현재 예약을 받을 수 없는 상태입니다' },
          { status: 400 }
        )
      }

      if (errorMessage === 'INVALID_GROOMER') {
        return NextResponse.json({ error: '유효하지 않은 그루머입니다' }, { status: 400 })
      }

      if (errorMessage.startsWith('AMOUNT_MISMATCH:')) {
        const [, paymentDescription, expectedAmount, requestedAmount] = errorMessage.split(':')
        return NextResponse.json(
          {
            error: `${paymentDescription} 결제 금액이 일치하지 않습니다. 예상: ${Number(expectedAmount).toLocaleString('ko-KR')}원, 요청: ${Number(requestedAmount).toLocaleString('ko-KR')}원`,
            expectedAmount: Number(expectedAmount),
            requestedAmount: Number(requestedAmount),
            paymentType: paymentDescription,
          },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({ error: '결제 초기화 중 오류가 발생했습니다' }, { status: 500 })
  }
}
