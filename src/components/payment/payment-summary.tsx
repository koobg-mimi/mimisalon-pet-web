'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  ScissorsIcon,
  ClockIcon,
  TagIcon,
  PercentIcon,
  CreditCardIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from 'lucide-react'
import { couponSchema, type CouponInput } from '@/lib/validations/payment'
import { cn } from '@/lib/utils'

interface Service {
  id: string
  name: string
  price: number
  duration: number
  category: string
}

interface PaymentSummaryProps {
  services: Service[]
  couponDiscount?: {
    code: string
    discountAmount: number
    discountType: 'AMOUNT' | 'PERCENTAGE'
  }
  onCouponApply: (coupon: CouponInput) => Promise<boolean>
  onCouponRemove: () => void
  className?: string
}

export function PaymentSummary({
  services,
  couponDiscount,
  onCouponApply,
  onCouponRemove,
  className,
}: PaymentSummaryProps) {
  const [isCouponLoading, setIsCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CouponInput>({
    resolver: zodResolver(couponSchema),
  })

  const subtotal = services.reduce((sum, service) => sum + service.price, 0)
  const discountAmount = couponDiscount?.discountAmount || 0
  const total = subtotal - discountAmount
  const totalDuration = services.reduce((sum, service) => sum + service.duration, 0)

  const onCouponSubmit = async (data: CouponInput) => {
    setIsCouponLoading(true)
    setCouponError(null)

    try {
      const success = await onCouponApply({
        ...data,
        bookingAmount: subtotal,
      })

      if (success) {
        reset()
      } else {
        setCouponError('유효하지 않은 쿠폰 코드입니다')
      }
    } catch {
      setCouponError('쿠폰 적용 중 오류가 발생했습니다')
    } finally {
      setIsCouponLoading(false)
    }
  }

  const handleCouponRemove = () => {
    onCouponRemove()
    setCouponError(null)
  }

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCardIcon className="h-5 w-5" />
            <span>결제 요약</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 선택된 서비스 목록 */}
          <div className="space-y-4">
            <h4 className="text-muted-foreground text-sm font-medium">선택된 서비스</h4>
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <ScissorsIcon className="text-primary h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-muted-foreground mt-1 flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-3 w-3" />
                        <span>{service.duration}분</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {service.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{service.price.toLocaleString()}원</div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* 쿠폰 입력 */}
          <div className="space-y-4">
            <h4 className="text-muted-foreground flex items-center space-x-2 text-sm font-medium">
              <TagIcon className="h-4 w-4" />
              <span>할인 쿠폰</span>
            </h4>

            {couponDiscount ? (
              <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">
                      쿠폰 적용 완료: {couponDiscount.code}
                    </div>
                    <div className="text-sm text-green-700">
                      {couponDiscount.discountType === 'PERCENTAGE'
                        ? `${couponDiscount.discountAmount}% 할인`
                        : `${couponDiscount.discountAmount.toLocaleString('ko-KR')}원 할인`}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCouponRemove}
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  제거
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onCouponSubmit)} className="space-y-3">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input placeholder="쿠폰 코드를 입력해주세요" {...register('code')} />
                    {errors.code && (
                      <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
                    )}
                  </div>
                  <Button type="submit" disabled={isCouponLoading} className="px-6">
                    {isCouponLoading ? '확인 중...' : '적용'}
                  </Button>
                </div>
                {couponError && (
                  <div className="flex items-center space-x-2 text-sm text-red-600">
                    <AlertCircleIcon className="h-4 w-4" />
                    <span>{couponError}</span>
                  </div>
                )}
              </form>
            )}
          </div>

          <Separator />

          {/* 결제 금액 계산 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>서비스 소계</span>
              <span>{subtotal.toLocaleString('ko-KR')}원</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-sm text-green-600">
                <div className="flex items-center space-x-1">
                  <PercentIcon className="h-3 w-3" />
                  <span>할인 금액</span>
                </div>
                <span>-{discountAmount.toLocaleString('ko-KR')}원</span>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between text-lg font-semibold">
              <span>총 결제금액</span>
              <span className="text-primary">{total.toLocaleString('ko-KR')}원</span>
            </div>

            <div className="text-muted-foreground flex items-center justify-center text-sm">
              <ClockIcon className="mr-1 h-4 w-4" />
              <span>예상 소요시간: {totalDuration}분</span>
            </div>
          </div>

          {/* 결제 안내 */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start space-x-2">
              <AlertCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">결제 안내</p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>예약 확정 후 24시간 전까지 무료 취소 가능합니다</li>
                  <li>당일 취소 시 취소 수수료가 발생할 수 있습니다</li>
                  <li>결제 후 영수증은 이메일로 발송됩니다</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
