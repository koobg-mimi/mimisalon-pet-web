/**
 * 예약 Step 4: 결제 (Redux 기반)
 */

'use client'

import Link from 'next/link'
import { Pet } from '@/hooks/usePets'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PaymentCard } from '@/components/card/payment-card'
import { useAppSelector } from '@/lib/redux/hooks'
import { UserResponse } from '@/app/api/auth/me/route'

interface PaymentStepProps {
  /** 반려동물 목록 */
  pets: Pet[]
  /** 프로필 정보 */
  profile: UserResponse
  /** 총 금액 */
  totalAmount: number
  /** 주문명 */
  orderName: string
  /** 결제 성공 핸들러 */
  onPaymentSuccess: () => void
  /** 결제 에러 핸들러 */
  onPaymentError: (error: string) => void
}

/**
 * 결제 단계
 *
 * Redux에서 formData, paymentId, bookingId를 직접 가져옴
 */
export function PaymentStep({
  pets,
  profile,
  totalAmount,
  orderName,
  onPaymentSuccess,
  onPaymentError,
}: PaymentStepProps) {
  // Redux 상태 가져오기
  const formData = useAppSelector((state) => state.booking.formData)
  const paymentId = useAppSelector((state) => state.booking.paymentId)
  const bookingId = useAppSelector((state) => state.booking.selectedBookingId)
  return (
    <div className="space-y-6">
      {/* 결제 정보 요약 */}
      <Card className="border-primary bg-primary/5">
        <CardHeader>
          <CardTitle>결제 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.petServices.map((petService, index) => {
              const pet = pets.find((p) => p.id === petService.petId)
              const servicesTotal = petService.services.reduce(
                (sum, service) => sum + service.price,
                0
              )
              const optionsTotal = petService.options.reduce((sum, option) => sum + option.price, 0)
              const petTotal = servicesTotal + optionsTotal

              return (
                <div key={index} className="rounded-lg border bg-white p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="font-semibold">
                      {pet?.name} ({pet?.breed?.name})
                    </h4>
                    <span className="text-primary font-semibold">
                      {petTotal.toLocaleString()}원
                    </span>
                  </div>
                  <div className="space-y-1">
                    {petService.services.map((service, serviceIndex) => (
                      <div
                        key={serviceIndex}
                        className="text-muted-foreground flex items-center justify-between text-sm"
                      >
                        <span>- {service.name}</span>
                        <span>{service.price.toLocaleString()}원</span>
                      </div>
                    ))}
                    {petService.options.length > 0 && (
                      <>
                        <div className="mt-2 border-t pt-2">
                          <span className="text-muted-foreground text-xs font-medium">
                            추가 옵션
                          </span>
                        </div>
                        {petService.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="text-muted-foreground flex items-center justify-between text-sm"
                          >
                            <span>+ {option.name}</span>
                            <span>{option.price.toLocaleString()}원</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )
            })}

            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">총 결제금액</span>
                <span className="text-primary text-2xl font-bold">
                  {totalAmount.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 예약자 정보 */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">예약자 정보</h3>
          <p className="text-muted-foreground text-sm">
            현재 로그인된 계정의 정보로 자동 입력됩니다.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customerName">예약자 이름 *</Label>
              <Input id="customerName" value={profile?.name || ''} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">연락처 *</Label>
              <Input
                id="customerPhone"
                value={profile?.phoneNumber || ''}
                readOnly
                className="bg-muted"
                placeholder={!profile?.phoneNumber ? '연락처가 등록되지 않았습니다' : ''}
              />
            </div>
          </div>
          {!profile?.phoneNumber && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
              <p className="text-sm text-yellow-700">
                연락처가 등록되지 않았습니다. 예약을 위해{' '}
                <Link href="/customer/profile" className="font-medium underline">
                  프로필 설정
                </Link>
                에서 연락처를 등록해주세요.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* 주의사항 */}
      <Card className="border-yellow-200 bg-yellow-50 p-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-yellow-800">결제 전 확인사항</h3>
          <ul className="space-y-1 text-sm text-yellow-700">
            <li>• 예약 변경 및 취소는 24시간 전까지 가능합니다.</li>
            <li>• 당일 취소 시 50% 환불, 노쇼 시 환불이 불가합니다.</li>
            <li>• 반려동물의 건강상태에 따라 서비스가 제한될 수 있습니다.</li>
            <li>• 추가 서비스 요청 시 현장에서 별도 결제가 가능합니다.</li>
          </ul>
        </div>
      </Card>

      {/* Payment Card */}
      {paymentId && (
        <PaymentCard
          amount={totalAmount}
          orderName={orderName}
          orderId={paymentId}
          customerInfo={{
            name: profile?.name || '',
            email: profile?.email || '',
            phone: profile?.phoneNumber || '',
          }}
          onSuccess={onPaymentSuccess}
          onError={onPaymentError}
          termsText="서비스 이용약관 및 결제 약관에 동의합니다"
          customData={{
            bookingId,
            bookingType: 'grooming',
            petCount: formData.petServices.length,
            groomerId: formData.groomerId,
            serviceDate: formData.date,
            serviceTime: formData.timeSlot,
          }}
        />
      )}
    </div>
  )
}
