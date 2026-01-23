'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AlertCircle } from 'lucide-react'
import { usePayment } from '@/hooks/usePayment'
import type { PaymentResult } from '@/hooks/usePayment'
import { cn } from '@/lib/utils'

interface PaymentCardProps {
  amount: number
  orderName: string
  orderId: string
  customerInfo?: {
    name?: string
    email?: string
    phone?: string
  }
  onSuccess?: (result: PaymentResult) => void
  onError?: (error: string) => void
  termsText?: string
  buttonText?: string
  customData?: Record<string, unknown>
  className?: string
  title?: string
  description?: string
}

export function PaymentCard({
  amount,
  orderName,
  orderId,
  customerInfo,
  onSuccess,
  onError,
  termsText = '결제 약관에 동의합니다',
  buttonText,
  customData,
  className,
  title = '카드 결제',
  description = '신용/체크카드로 안전하게 결제합니다',
}: PaymentCardProps) {
  const [termsAccepted, setTermsAccepted] = useState(false)

  const {
    requestPayment,
    isLoading: isPaymentLoading,
    error: paymentError,
    clearError,
  } = usePayment()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!termsAccepted) {
      const error = '약관에 동의해주세요.'
      if (onError) onError(error)
      return
    }

    try {
      const result = await requestPayment({
        amount,
        orderName,
        orderId,
        customerName: customerInfo?.name || '',
        customerEmail: customerInfo?.email || '',
        customerPhone: customerInfo?.phone || '',
        payMethod: 'CARD',
        customData,
      })

      if (result.success) {
        if (onSuccess) onSuccess(result)
      } else {
        if (onError) onError(result.error || '결제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Payment processing failed:', error)
      if (onError) onError('결제 처리 중 오류가 발생했습니다.')
    }
  }
  const finalButtonText = buttonText || `${amount.toLocaleString('ko-KR')}원 결제하기`

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Terms and Submit */}
            <div className="border-border border-t pt-6">
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="payment-terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mr-2"
                  required
                />
                <label htmlFor="payment-terms" className="text-foreground text-sm">
                  {termsText}
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isPaymentLoading || !termsAccepted}
                size="lg"
              >
                {isPaymentLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    처리 중...
                  </>
                ) : (
                  finalButtonText
                )}
              </Button>
            </div>
          </form>

          {/* Error Display */}
          {paymentError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  <div className="flex-1">
                    <h3 className="mb-1 text-sm font-semibold text-red-800">결제 오류</h3>
                    <p className="text-sm text-red-700">{paymentError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearError}
                      className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
                    >
                      닫기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
