/**
 * 결제 안내 공지 컴포넌트
 * @module features/additional-payment/components
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'

/**
 * 결제 안내 공지 variants 정의
 */
const paymentInfoNoticeVariants = cva('rounded-lg p-4', {
  variants: {
    variant: {
      warning: 'bg-yellow-50 border border-yellow-200',
      info: 'bg-blue-50 border border-blue-200',
      success: 'bg-green-50 border border-green-200',
    },
    size: {
      sm: 'p-3',
      default: 'p-4',
      lg: 'p-5',
    },
  },
  defaultVariants: {
    variant: 'warning',
    size: 'default',
  },
})

/**
 * PaymentInfoNotice 컴포넌트 Props
 */
export interface PaymentInfoNoticeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paymentInfoNoticeVariants> {
  /** 제목 */
  title?: string
  /** 안내 항목 배열 */
  items?: string[]
  /** 커스텀 아이콘 */
  icon?: React.ReactNode
}

/**
 * 결제 안내 공지
 * @description 추가 결제 관련 중요 정보를 사용자에게 안내합니다
 *
 * @example
 * ```tsx
 * <PaymentInfoNotice
 *   variant="warning"
 *   title="추가 비용 안내"
 *   items={[
 *     "위 비용은 서비스 진행 중 발생한 추가 항목입니다",
 *     "미용사와 사전 협의된 내용에 한해 청구됩니다"
 *   ]}
 * />
 * ```
 */
const PaymentInfoNotice = React.forwardRef<HTMLDivElement, PaymentInfoNoticeProps>(
  (
    { className, variant, size, title = '추가 비용 안내', items, icon, children, ...props },
    ref
  ) => {
    // Variant에 따른 아이콘 및 텍스트 색상 결정
    const variantConfig = {
      warning: {
        icon: icon || <AlertCircle className="h-5 w-5 text-yellow-600" />,
        titleColor: 'text-yellow-900',
        textColor: 'text-yellow-800',
      },
      info: {
        icon: icon || <Info className="h-5 w-5 text-blue-600" />,
        titleColor: 'text-blue-900',
        textColor: 'text-blue-800',
      },
      success: {
        icon: icon || <CheckCircle className="h-5 w-5 text-green-600" />,
        titleColor: 'text-green-900',
        textColor: 'text-green-800',
      },
    }

    const config = variantConfig[variant || 'warning']

    // 기본 안내 항목 (items가 없을 경우)
    const defaultItems = [
      '위 비용은 서비스 진행 중 발생한 추가 항목입니다',
      '미용사와 사전 협의된 내용에 한해 청구됩니다',
      '문의사항이 있으시면 고객센터로 연락주세요',
    ]

    const displayItems = items || defaultItems

    return (
      <div
        ref={ref}
        className={cn(paymentInfoNoticeVariants({ variant, size }), className)}
        {...props}
      >
        <div className="flex items-start space-x-3">
          <div className="mt-0.5 flex-shrink-0">{config.icon}</div>
          <div className="flex-1">
            <h3 className={cn('mb-2 font-semibold', config.titleColor)}>{title}</h3>
            {children || (
              <ul className={cn('space-y-1 text-sm', config.textColor)}>
                {displayItems.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    )
  }
)

PaymentInfoNotice.displayName = 'PaymentInfoNotice'

export { PaymentInfoNotice, paymentInfoNoticeVariants }
