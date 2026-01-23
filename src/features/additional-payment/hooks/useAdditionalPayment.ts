/**
 * 추가 결제 통합 훅
 * @module features/additional-payment/hooks
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { useProfile } from '@/hooks/useProfile'
import type { PaymentResult } from '@/hooks/usePayment'
import { useBookingDetails } from './useBookingDetails'
import { usePaymentInitialization } from './usePaymentInitialization'
import {
  calculateTotalAdditionalAmount,
  generateOrderName,
} from '../utils/additional-payment.utils'
import type { BookingInfo, PaymentRequestResult } from '../types/additional-payment.types'

/**
 * useAdditionalPayment 훅 파라미터
 */
interface UseAdditionalPaymentParams {
  /** 예약 ID */
  bookingId: string
}

/**
 * useAdditionalPayment 훅 반환 타입
 */
export interface UseAdditionalPaymentReturn {
  // 인증 관련
  /** 세션 정보 */
  session: ReturnType<typeof useSession>['data']
  /** 세션 로딩 중 여부 */
  isSessionPending: boolean
  /** 사용자 프로필 */
  profile: ReturnType<typeof useProfile>['profile']

  // 예약 정보 관련
  /** 예약 정보 */
  booking: BookingInfo | undefined
  /** 예약 정보 로딩 중 여부 */
  isBookingLoading: boolean
  /** 예약 정보 조회 오류 */
  bookingError: Error | null

  // 결제 관련
  /** 결제 ID */
  paymentId: string | null
  /** 결제 초기화 진행 중 여부 */
  isInitializingPayment: boolean
  /** 총 추가 결제 금액 */
  totalAdditionalAmount: number
  /** 주문명 */
  orderName: string

  // 이벤트 핸들러
  /** 결제 요청 핸들러 */
  handlePaymentRequest: () => Promise<PaymentRequestResult | null>
  /** 결제 성공 핸들러 */
  handlePaymentSuccess: (result: PaymentResult) => Promise<void>
  /** 결제 오류 핸들러 */
  handlePaymentError: (error: string) => void
}

/**
 * 추가 결제 통합 훅
 * @description 추가 결제에 필요한 모든 로직을 통합하여 제공합니다
 *
 * - 인증 확인 및 리디렉션
 * - 예약 정보 조회
 * - 결제 초기화
 * - 결제 성공/오류 처리
 *
 * @param params - 훅 파라미터
 * @returns 통합된 상태 및 핸들러
 *
 * @example
 * ```tsx
 * const {
 *   session,
 *   booking,
 *   paymentId,
 *   totalAdditionalAmount,
 *   handlePaymentRequest,
 *   handlePaymentSuccess,
 *   handlePaymentError
 * } = useAdditionalPayment({ bookingId: '123' })
 * ```
 */
export function useAdditionalPayment(
  params: UseAdditionalPaymentParams
): UseAdditionalPaymentReturn {
  const { bookingId } = params
  const router = useRouter()
  const { data: session, isPending: isSessionPending } = useSession()
  const { profile } = useProfile()

  // 인증 확인
  const hasSession = !!session?.user
  const isCustomer = session?.user?.role === 'CUSTOMER'

  // 예약 정보 조회
  const {
    booking,
    isLoading: isBookingLoading,
    error: bookingError,
  } = useBookingDetails({
    bookingId,
    hasSession,
    isCustomer,
  })

  // 계산된 값
  const totalAdditionalAmount = booking
    ? calculateTotalAdditionalAmount(booking.additionalCharges)
    : 0

  const orderName = booking ? generateOrderName(booking) : ''

  // 결제 초기화
  const { paymentId, initializePayment, isInitializing } = usePaymentInitialization({
    bookingId,
    amount: totalAdditionalAmount,
    orderName,
  })

  // 인증 리디렉션 처리
  useEffect(() => {
    if (isSessionPending) return

    if (!hasSession) {
      router.push('/auth/signin')
      return
    }

    if (!isCustomer) {
      router.push('/dashboard')
      return
    }
  }, [hasSession, isCustomer, isSessionPending, router])

  // bookingId 검증 리디렉션
  useEffect(() => {
    if (!bookingId) {
      router.push('/customer/bookings')
    }
  }, [bookingId, router])

  /**
   * 결제 요청 핸들러
   * @description 결제 초기화를 실행하고 결과를 반환합니다
   */
  const handlePaymentRequest = async (): Promise<PaymentRequestResult | null> => {
    return initializePayment()
  }

  /**
   * 결제 성공 핸들러
   * @description 결제 성공 후 성공 페이지로 리디렉션합니다
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePaymentSuccess = async (_result: PaymentResult): Promise<void> => {
    // Payment successful - booking status will be updated via webhook
    // Redirect to success page
    if (paymentId) {
      try {
        await router.push(`/payment/success?paymentId=${paymentId}&type=additional`)
      } catch (error) {
        console.error('[Payment] Redirect failed:', error)
        alert('결제는 완료되었으나 페이지 이동에 실패했습니다. 예약 내역에서 확인해주세요.')
      }
    } else {
      console.error('[Payment] Missing paymentId after success')
      alert('결제가 완료되었으나 정보를 찾을 수 없습니다. 고객센터로 문의해주세요.')
    }
  }

  /**
   * 결제 오류 핸들러
   * @description 결제 오류 시 호출됩니다 (오류는 PaymentCard에서 표시)
   */
  const handlePaymentError = (error: string): void => {
    console.error('[Payment] Error:', error)
    // Error is displayed by PaymentCard component
    // State is managed by usePaymentInitialization (paymentId reset on error)
  }

  return {
    // 인증 관련
    session,
    isSessionPending,
    profile,

    // 예약 정보 관련
    booking,
    isBookingLoading,
    bookingError,

    // 결제 관련
    paymentId,
    isInitializingPayment: isInitializing,
    totalAdditionalAmount,
    orderName,

    // 이벤트 핸들러
    handlePaymentRequest,
    handlePaymentSuccess,
    handlePaymentError,
  }
}
