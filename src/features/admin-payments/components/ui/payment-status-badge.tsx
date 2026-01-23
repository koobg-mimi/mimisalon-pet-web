import { getPaymentStatusConfig } from '../../utils/payment-status-config'
import type { AdminPaymentInfo } from '../../types/payment.types'
import { cn } from '@/lib/utils'

/**
 * Props for PaymentStatusBadge component
 */
interface PaymentStatusBadgeProps {
  /** Payment status to display */
  status: AdminPaymentInfo['status']
  /** Additional CSS classes */
  className?: string
}

/**
 * Badge component for displaying payment status
 *
 * Shows a colored badge with localized status label.
 * Colors and labels are configured in payment-status-config.
 *
 * @example
 * ```tsx
 * <PaymentStatusBadge status="PAID" />
 * <PaymentStatusBadge status="FAILED" className="text-sm" />
 * ```
 */
export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const config = getPaymentStatusConfig(status)

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
        config.bgColor,
        config.color,
        className
      )}
      title={config.description}
    >
      {config.label}
    </span>
  )
}
