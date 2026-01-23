'use client'

import { use } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PaymentCard } from '@/components/card/payment-card'
import {
  AdditionalPaymentLayout,
  AdditionalPaymentHeader,
  AdditionalChargesCard,
  BookingInfoSidebar,
  PaymentInfoNotice,
} from '@/features/additional-payment/components'
import { useAdditionalPayment } from '@/features/additional-payment/hooks'
import type { AdditionalPaymentCustomData } from '@/features/additional-payment/types/additional-payment.types'

export default function PaymentAdditionalPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const resolvedParams = use(params)
  const bookingId = resolvedParams.bookingId

  const {
    session,
    isSessionPending,
    profile,
    booking,
    isBookingLoading,
    paymentId,
    isInitializingPayment,
    totalAdditionalAmount,
    orderName,
    handlePaymentRequest,
    handlePaymentSuccess,
    handlePaymentError,
  } = useAdditionalPayment({ bookingId })

  // 로딩 상태
  if (isSessionPending || isBookingLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // 인증 확인 (리디렉션은 useAdditionalPayment 훅에서 처리)
  if (!session || session.user?.role !== 'CUSTOMER' || !booking) {
    return null
  }

  return (
    <AdditionalPaymentLayout
      header={<AdditionalPaymentHeader />}
      content={
        <>
          {/* 추가 비용 내역 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">추가 비용 내역</CardTitle>
              <p className="text-muted-foreground text-sm">서비스 중 추가로 발생한 비용입니다</p>
            </CardHeader>
            <CardContent>
              <AdditionalChargesCard
                charges={booking.additionalCharges}
                variant="default"
                size="default"
              />

              <PaymentInfoNotice className="mt-6" />
            </CardContent>
          </Card>

          {/* 결제 진행 섹션 */}
          {!paymentId ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">결제 진행</CardTitle>
                <p className="text-muted-foreground text-sm">
                  아래 버튼을 클릭하여 결제를 진행해주세요
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handlePaymentRequest}
                  disabled={isInitializingPayment}
                  size="lg"
                  className="w-full"
                >
                  {isInitializingPayment ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      결제 준비 중...
                    </>
                  ) : (
                    '결제 진행하기'
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <PaymentCard
              amount={totalAdditionalAmount}
              orderName={orderName}
              orderId={paymentId}
              customerInfo={{
                name: profile?.name || session?.user?.name || '',
                email: profile?.email || session?.user?.email || '',
                phone: profile?.phoneNumber || '',
              }}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              termsText="추가 결제 약관에 동의합니다"
              customData={
                {
                  type: 'additional',
                  bookingId: bookingId,
                  originalAmount: booking.originalAmount,
                  additionalCharges: booking.additionalCharges,
                } satisfies AdditionalPaymentCustomData
              }
              title="결제 방법 선택"
              description="추가 서비스 결제를 위한 방법을 선택해주세요"
            />
          )}
        </>
      }
      sidebar={
        <BookingInfoSidebar
          booking={booking}
          totalAdditional={totalAdditionalAmount}
          variant="default"
          sticky
        />
      }
    />
  )
}
