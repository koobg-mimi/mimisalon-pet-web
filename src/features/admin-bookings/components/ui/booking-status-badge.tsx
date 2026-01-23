import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { BookingStatus } from '@mimisalon/shared'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getStatusConfig } from '../../utils/booking-status-config'

/**
 * BookingStatusBadge component variants (CVA pattern)
 */
const bookingStatusBadgeVariants = cva('inline-flex items-center gap-1', {
  variants: {
    variant: {
      default: '',
      compact: 'text-xs px-1.5 py-0.5',
      detailed: 'text-sm px-3 py-1.5',
      highlight: 'font-semibold',
      minimal: 'border-0 bg-transparent',
    },
    size: {
      sm: 'text-xs',
      default: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export interface BookingStatusBadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof bookingStatusBadgeVariants> {
  /**
   * The booking status to display
   */
  status: BookingStatus
  /**
   * Whether to show the icon
   * @default true
   */
  showIcon?: boolean
}

/**
 * BookingStatusBadge Component
 *
 * Displays a booking status with appropriate styling, icon, and label.
 * Uses CVA pattern for consistent variant management.
 *
 * @example
 * ```tsx
 * import { BookingStatusBadge } from '@/features/admin-bookings/components/ui/booking-status-badge'
 * import { BookingStatus } from '@mimisalon/shared'
 *
 * <BookingStatusBadge
 *   status={BookingStatus.GROOMER_CONFIRM}
 *   variant="default"
 *   size="default"
 * />
 * ```
 */
const BookingStatusBadge = React.forwardRef<HTMLDivElement, BookingStatusBadgeProps>(
  ({ className, variant, size, status, showIcon = true, ...props }, ref) => {
    const config = getStatusConfig(status)

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        className={cn(bookingStatusBadgeVariants({ variant, size, className }))}
        {...props}
      >
        {showIcon && config.icon}
        {config.label}
      </Badge>
    )
  }
)

BookingStatusBadge.displayName = 'BookingStatusBadge'

export { BookingStatusBadge, bookingStatusBadgeVariants }
