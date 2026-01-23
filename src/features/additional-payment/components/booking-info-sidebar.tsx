/**
 * 예약 정보 사이드바 컴포넌트
 * @module features/additional-payment/components
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { BookingInfo } from '../types/additional-payment.types'
import { formatAmount } from '../utils/additional-payment.utils'

/**
 * 예약 정보 사이드바 variants 정의
 */
const bookingInfoSidebarVariants = cva('transition-all', {
  variants: {
    variant: {
      default: 'border-border bg-card shadow-sm',
      compact: 'border-border bg-card shadow-sm',
      detailed: 'border-border bg-card shadow-md',
      highlight: 'border-primary/50 bg-gradient-to-br from-primary/5 to-transparent shadow-md',
      minimal: 'border-border/50 bg-transparent',
    },
    size: {
      sm: '',
      default: '',
      lg: '',
    },
    sticky: {
      true: 'sticky top-8',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    sticky: true,
  },
})

/**
 * BookingInfoSidebar 컴포넌트 Props
 */
export interface BookingInfoSidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bookingInfoSidebarVariants> {
  /** 예약 정보 */
  booking: BookingInfo
  /** 추가 결제 금액 */
  totalAdditional: number
}

/**
 * 예약 정보 사이드바
 * @description 추가 결제 페이지의 사이드바에 예약 정보와 금액 요약을 표시합니다
 *
 * @example
 * ```tsx
 * <BookingInfoSidebar
 *   booking={booking}
 *   totalAdditional={50000}
 *   variant="default"
 *   sticky
 * />
 * ```
 */
const BookingInfoSidebar = React.forwardRef<HTMLDivElement, BookingInfoSidebarProps>(
  ({ className, variant, size, sticky, booking, totalAdditional, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(bookingInfoSidebarVariants({ variant, size, sticky }), className)}
        {...props}
      >
        <CardHeader>
          <CardTitle className="text-lg">예약 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 서비스 및 반려동물 정보 */}
            <div>
              <h3 className="text-foreground font-medium">{booking.service.name}</h3>
              <p className="text-muted-foreground text-sm">
                {booking.pet.name} ({booking.pet.breed})
              </p>
            </div>

            {/* 미용사 및 지점 정보 */}
            <div>
              <p className="text-sm">
                <span className="font-medium">미용사:</span> {booking.groomer.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">지점:</span> {booking.location.name}
              </p>
            </div>

            {/* 예약 일시 */}
            <div>
              <p className="text-sm">
                <span className="font-medium">예약일시:</span>
              </p>
              <p className="text-muted-foreground text-sm">
                {booking.date} {booking.time}
              </p>
            </div>

            {/* 금액 요약 */}
            <div className="border-border border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">기본 서비스</span>
                <span className="text-sm">{formatAmount(booking.originalAmount)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm">추가 비용</span>
                <span className="text-sm">{formatAmount(totalAdditional)}</span>
              </div>
              <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
                <span className="text-lg font-semibold">추가 결제금액</span>
                <span className="text-primary text-lg font-bold">
                  {formatAmount(totalAdditional)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)

BookingInfoSidebar.displayName = 'BookingInfoSidebar'

export { BookingInfoSidebar, bookingInfoSidebarVariants }
