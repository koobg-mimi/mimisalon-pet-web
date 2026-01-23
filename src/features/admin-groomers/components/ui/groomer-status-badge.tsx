import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getStatusConfig } from '../../utils/groomer-status-config'

/**
 * GroomerStatusBadge component variants (CVA pattern)
 *
 * Variants:
 * - default: Standard badge styling
 * - compact: Smaller padding, ideal for dense layouts
 * - detailed: Larger padding, more prominent
 * - highlight: Bold font, stands out more
 * - minimal: No border or background, just text
 *
 * Sizes:
 * - sm: Small text (text-xs)
 * - default: Normal text (text-sm)
 * - lg: Large text (text-base)
 */
const groomerStatusBadgeVariants = cva('inline-flex items-center gap-1', {
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

/**
 * Props for GroomerStatusBadge component
 */
export interface GroomerStatusBadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof groomerStatusBadgeVariants> {
  /**
   * Whether the groomer is active
   */
  isActive: boolean
  /**
   * Whether to show the icon
   * @default true
   */
  showIcon?: boolean
}

/**
 * GroomerStatusBadge Component
 *
 * Displays a groomer status with appropriate styling, icon, and label.
 * Uses CVA pattern for consistent variant management.
 *
 * Features:
 * - 5 variants: default, compact, detailed, highlight, minimal
 * - 3 sizes: sm, default, lg
 * - Automatic color mapping based on status
 * - Optional icon display
 * - Fully typed with TypeScript
 * - forwardRef support for ref handling
 *
 * @example
 * ```tsx
 * import { GroomerStatusBadge } from '@/features/admin-groomers/components/ui/groomer-status-badge'
 *
 * // Default usage
 * <GroomerStatusBadge isActive={true} />
 *
 * // Compact variant without icon
 * <GroomerStatusBadge
 *   isActive={false}
 *   variant="compact"
 *   showIcon={false}
 * />
 *
 * // Large detailed badge
 * <GroomerStatusBadge
 *   isActive={true}
 *   variant="detailed"
 *   size="lg"
 * />
 * ```
 */
const GroomerStatusBadge = React.forwardRef<HTMLDivElement, GroomerStatusBadgeProps>(
  ({ className, variant, size, isActive, showIcon = true, ...props }, ref) => {
    const config = getStatusConfig(isActive)

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        className={cn(groomerStatusBadgeVariants({ variant, size, className }))}
        {...props}
      >
        {showIcon && config.icon}
        {config.label}
      </Badge>
    )
  }
)

GroomerStatusBadge.displayName = 'GroomerStatusBadge'

export { GroomerStatusBadge, groomerStatusBadgeVariants }
