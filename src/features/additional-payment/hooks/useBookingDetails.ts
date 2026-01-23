/**
 * 예약 상세 정보 조회 훅
 * @module features/additional-payment/hooks
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { BookingInfo } from '../types/additional-payment.types'

/**
 * useBookingDetails 훅 파라미터
 */
interface UseBookingDetailsParams {
  /** 예약 ID */
  bookingId: string
  /** 사용자 세션 존재 여부 */
  hasSession: boolean
  /** 사용자 역할이 CUSTOMER인지 여부 */
  isCustomer: boolean
}

/**
 * useBookingDetails 훅 반환 타입
 */
export interface UseBookingDetailsReturn {
  /** 예약 정보 */
  booking: BookingInfo | undefined
  /** 로딩 중 여부 */
  isLoading: boolean
  /** 오류 */
  error: Error | null
  /** React Query 결과 객체 */
  queryResult: UseQueryResult<BookingInfo, Error>
}

/**
 * 추가 결제용 예약 상세 정보 조회 훅
 * @description React Query를 사용하여 예약 정보를 조회합니다
 *
 * @param params - 훅 파라미터
 * @returns 예약 정보 조회 결과
 *
 * @example
 * ```tsx
 * const { booking, isLoading, error } = useBookingDetails({
 *   bookingId: '123',
 *   hasSession: true,
 *   isCustomer: true
 * })
 * ```
 */
export function useBookingDetails(params: UseBookingDetailsParams): UseBookingDetailsReturn {
  const { bookingId, hasSession, isCustomer } = params

  const queryResult = useQuery<BookingInfo, Error>({
    queryKey: ['booking', bookingId, 'additional-payment'],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/${bookingId}/additional-payment`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || '예약 정보를 불러오는데 실패했습니다')
      }

      return response.json()
    },
    // 세션이 있고 CUSTOMER 역할일 때만 쿼리 실행
    enabled: !!bookingId && hasSession && isCustomer,
    // 실패 시 재시도하지 않음 (인증 오류 가능성)
    retry: false,
    // 5분간 캐시 유지
    staleTime: 5 * 60 * 1000,
  })

  return {
    booking: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    queryResult,
  }
}
