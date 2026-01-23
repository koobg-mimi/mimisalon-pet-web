/**
 * 추가 비용 항목 카드 컴포넌트
 * @module features/additional-payment/components
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { AdditionalCharge } from '../types/additional-payment.types'
import { formatAmount, formatChargeDisplay } from '../utils/additional-payment.utils'

/**
 * 추가 비용 카드 variants 정의
 */
const additionalChargesCardVariants = cva('rounded-lg border transition-all', {
  variants: {
    variant: {
      default: 'border-border bg-muted/50',
      compact: 'border-border bg-card shadow-sm',
      detailed: 'border-border bg-card shadow-md',
      highlight: 'border-primary/50 bg-gradient-to-br from-primary/5 to-transparent shadow-md',
      minimal: 'border-border/50 bg-transparent',
    },
    size: {
      sm: 'p-3',
      default: 'p-4',
      lg: 'p-5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

/**
 * AdditionalChargesCard 컴포넌트 Props
 */
export interface AdditionalChargesCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof additionalChargesCardVariants> {
  /** 추가 비용 항목 배열 */
  charges: AdditionalCharge[]
  /** 총액 표시 여부 */
  showTotal?: boolean
}

/**
 * 추가 비용 항목 카드
 * @description 서비스 진행 중 발생한 추가 비용 항목을 카드 형태로 표시합니다
 *
 * @example
 * ```tsx
 * <AdditionalChargesCard
 *   charges={booking.additionalCharges}
 *   variant="detailed"
 *   size="default"
 *   showTotal
 * />
 * ```
 */
const AdditionalChargesCard = React.forwardRef<HTMLDivElement, AdditionalChargesCardProps>(
  ({ className, variant, size, charges, showTotal = false, ...props }, ref) => {
    const totalAmount = charges.reduce((sum, charge) => sum + charge.total, 0)

    return (
      <div ref={ref} className="space-y-4" {...props}>
        {charges.map((charge) => (
          <div
            key={charge.id}
            className={cn(
              additionalChargesCardVariants({ variant, size }),
              'flex items-center justify-between',
              className
            )}
          >
            <div className="flex-1">
              <h3 className="font-medium">{charge.name}</h3>
              {charge.description && (
                <p className="text-muted-foreground text-sm">{charge.description}</p>
              )}
              <p className="text-muted-foreground text-xs">{formatChargeDisplay(charge)}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatAmount(charge.total)}</p>
            </div>
          </div>
        ))}

        {showTotal && charges.length > 0 && (
          <div className="border-border flex items-center justify-between border-t pt-4">
            <span className="font-semibold">총 추가 비용</span>
            <span className="text-primary text-lg font-bold">{formatAmount(totalAmount)}</span>
          </div>
        )}
      </div>
    )
  }
)

AdditionalChargesCard.displayName = 'AdditionalChargesCard'

export { AdditionalChargesCard, additionalChargesCardVariants }
