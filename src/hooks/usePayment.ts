'use client'

import { useState, useCallback } from 'react'
import PortOne, { PaymentPayMethod } from '@portone/browser-sdk/v2'
import { PaymentResponse, Currency } from '@portone/browser-sdk/v2'
import { usePublicEnv } from '@/lib/queries/env'
// Payment request types
export interface PaymentRequest {
  // Required fields
  amount: number
  orderName: string
  orderId: string

  // Customer information
  customerName?: string
  customerEmail?: string
  customerPhone?: string

  // Payment method
  payMethod: 'CARD' | 'VIRTUAL_ACCOUNT' | 'EASY_PAY' | 'TRANSFER' | 'MOBILE'

  // PortOne configuration
  storeId?: string
  channelKey?: string

  // Additional data (PortOne supports object format)
  customData?: Record<string, unknown>

  // Web-specific fields
  currency?: string
  customer?: {
    fullName?: string
    phoneNumber?: string
    email?: string
  }
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  transactionId?: string
  error?: string
  code?: string
  message?: string
  cancelled?: boolean
}

export interface UsePaymentReturn {
  requestPayment: (request: PaymentRequest) => Promise<PaymentResult>
  isLoading: boolean
  error: string | null
  clearError: () => void
}

export const usePayment = (): UsePaymentReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { data: envConfig, isLoading: isEnvLoading } = usePublicEnv()

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const requestPayment = useCallback(
    async (request: PaymentRequest): Promise<PaymentResult> => {
      // Wait for environment config to be loaded
      if (isEnvLoading || !envConfig) {
        return {
          success: false,
          error: '환경 설정을 불러오는 중입니다. 잠시 후 다시 시도해주세요.',
        }
      }

      setIsLoading(true)
      setError(null)

      try {
        // Always use PortOne SDK for web payments
        console.log('[usePayment] Processing web payment')

        // Get the base URL for redirect URLs
        const baseUrl =
          typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'

        if (!envConfig.NEXT_PUBLIC_PORTONE_STORE_ID) {
          throw new Error(
            'storeId 파라미터는 필수 입력입니다. 환경 변수 NEXT_PUBLIC_PORTONE_STORE_ID를 확인해주세요.'
          )
        }

        if (!envConfig.NEXT_PUBLIC_PORTONE_CHANNEL_KEY) {
          throw new Error(
            'channelKey 파라미터는 필수 입력입니다. 환경 변수 NEXT_PUBLIC_PORTONE_CHANNEL_KEY를 확인해주세요.'
          )
        }

        // Prepare web payment request with proper typing
        const webPaymentRequest = {
          storeId: envConfig.NEXT_PUBLIC_PORTONE_STORE_ID,
          channelKey: envConfig.NEXT_PUBLIC_PORTONE_CHANNEL_KEY,
          paymentId: request.orderId,
          orderName: request.orderName,
          totalAmount: request.amount,
          currency: Currency.KRW,
          payMethod: PaymentPayMethod.CARD,
          customer: request.customer || {
            fullName: request.customerName || '',
            phoneNumber: request.customerPhone || '',
            email: request.customerEmail || '',
          },
          customData: request.customData || {},
          // Add redirect URLs for payment completion
          redirectUrl: `${baseUrl}/payment/success`,
        }

        console.log('[usePayment] Requesting web payment:', webPaymentRequest)

        const paymentResponse = await PortOne.requestPayment(webPaymentRequest)

        // Check if payment was successful
        if (paymentResponse?.code !== undefined) {
          const errorMessage = paymentResponse?.message || '알 수 없는 오류'

          // Handle user cancellation specifically (not an error)
          if (
            paymentResponse.code === 'FAILURE_TYPE_USER_CANCEL' ||
            paymentResponse.code === 'PG_CANCEL' ||
            errorMessage.includes('사용자') ||
            errorMessage.includes('취소')
          ) {
            console.log('[usePayment] Payment cancelled by user')
            return {
              success: false,
              code: paymentResponse.code,
              message: '결제가 취소되었습니다',
              cancelled: true,
            }
          }

          // Handle actual payment errors
          console.error('[usePayment] Web payment failed:', errorMessage)
          setError(`결제에 실패했습니다: ${errorMessage}`)
          return {
            success: false,
            code: paymentResponse.code,
            message: errorMessage,
            error: errorMessage,
          }
        }

        console.log('[usePayment] Web payment successful:', paymentResponse)

        return {
          success: true,
          paymentId: paymentResponse?.paymentId,
          transactionId: (paymentResponse as PaymentResponse & { transactionId?: string })
            ?.transactionId,
        }
      } catch (unexpectedError: unknown) {
        console.error('[usePayment] Unexpected error:', unexpectedError)
        const errorMessage =
          unexpectedError instanceof Error
            ? unexpectedError.message
            : '결제 처리 중 예기치 않은 오류가 발생했습니다.'
        setError(errorMessage)
        return {
          success: false,
          error: errorMessage,
        }
      } finally {
        setIsLoading(false)
      }
    },
    [envConfig, isEnvLoading]
  )

  return {
    requestPayment,
    isLoading,
    error,
    clearError,
  }
}
