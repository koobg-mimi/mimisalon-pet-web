/**
 * 결제 초기화 훅
 * @module features/additional-payment/hooks
 */

import { useState } from 'react'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import type { PaymentRequestResult } from '../types/additional-payment.types'

/**
 * usePaymentInitialization 훅 파라미터
 */
interface UsePaymentInitializationParams {
  /** 예약 ID */
  bookingId: string
  /** 결제 금액 (원) */
  amount: number
  /** 주문명 */
  orderName: string
}

/**
 * 결제 초기화 API 응답
 */
interface PaymentInitResponse {
  /** 생성된 결제 ID */
  paymentId: string
}

/**
 * usePaymentInitialization 훅 반환 타입
 */
export interface UsePaymentInitializationReturn {
  /** 결제 ID (초기화 성공 후 설정됨) */
  paymentId: string | null
  /** 결제 초기화 실행 함수 */
  initializePayment: () => Promise<PaymentRequestResult | null>
  /** 초기화 진행 중 여부 */
  isInitializing: boolean
  /** 초기화 오류 */
  error: Error | null
  /** 결제 초기화 mutation 객체 */
  mutation: UseMutationResult<string, Error, void, unknown>
}

/**
 * 결제 초기화 훅
 * @description 추가 결제를 위한 결제 초기화를 처리합니다
 *
 * @param params - 훅 파라미터
 * @returns 결제 초기화 함수 및 상태
 *
 * @example
 * ```tsx
 * const { paymentId, initializePayment, isInitializing } = usePaymentInitialization({
 *   bookingId: '123',
 *   amount: 50000,
 *   orderName: '추가 서비스 - 뽀삐'
 * })
 *
 * // 결제 초기화 실행
 * const result = await initializePayment()
 * if (result) {
 *   console.log('Payment initialized:', result.paymentId)
 * }
 * ```
 */
export function usePaymentInitialization(
  params: UsePaymentInitializationParams
): UsePaymentInitializationReturn {
  const { bookingId, amount, orderName } = params
  const [paymentId, setPaymentId] = useState<string | null>(null)

  const mutation = useMutation<string, Error, void>({
    mutationFn: async () => {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          amount,
          orderName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || '결제 초기화에 실패했습니다')
      }

      const data: PaymentInitResponse = await response.json()
      return data.paymentId
    },
    onSuccess: (newPaymentId) => {
      setPaymentId(newPaymentId)
    },
    onError: (error: Error) => {
      // 오류 발생 시 paymentId 초기화
      setPaymentId(null)
      console.error('[Payment Initialization] Error:', error.message)
    },
  })

  /**
   * 결제 초기화 실행
   * @description 중복 클릭을 방지하고 결제 초기화를 실행합니다
   */
  const initializePayment = async (): Promise<PaymentRequestResult | null> => {
    // 중복 클릭 방지
    if (mutation.isPending) {
      console.log('[Additional Payment] Request already in progress, ignoring duplicate click')
      return null
    }

    try {
      const newPaymentId = await mutation.mutateAsync()
      return {
        paymentId: newPaymentId,
        bookingId,
        amount,
        orderName,
      }
    } catch (error) {
      // 오류는 mutation의 onError에서 처리됨
      console.error('[Payment Initialization] Failed:', error)
      return null
    }
  }

  return {
    paymentId,
    initializePayment,
    isInitializing: mutation.isPending,
    error: mutation.error,
    mutation,
  }
}
