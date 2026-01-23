import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Flag } from 'lucide-react'

/**
 * CVA definition for review status badge variants
 * Supports multiple presentation styles (variant), sizes, and status-specific colors
 */
const reviewStatusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors border',
  {
    variants: {
      variant: {
        default: 'border-transparent px-2.5 py-0.5',
        compact: 'text-xs px-2 py-0.5 border-transparent',
        detailed: 'text-sm px-3 py-1.5 border-transparent shadow-sm',
        highlight: 'px-3 py-1 border-current ring-2 ring-offset-2 ring-current/20',
        minimal: 'border-0 bg-transparent px-0 py-0',
      },
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
      status: {
        public: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        private: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        flagged: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      status: 'public',
    },
  }
)

/**
 * Props interface for ReviewStatusBadge component
 * Extends standard HTML div attributes with CVA variant props
 */
export interface ReviewStatusBadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof reviewStatusBadgeVariants> {
  /** Whether the review is publicly visible */
  isPublic: boolean
  /** Whether the review has been flagged for review */
  isFlagged: boolean
  /** Whether to show the status icon (default: true) */
  showIcon?: boolean
}

/**
 * ReviewStatusBadge - CVA Component
 *
 * Displays the visibility/moderation status of a review with appropriate styling and icons.
 * Supports three states: Public (visible to customers), Private (hidden), and Flagged (requires review).
 *
 * @example
 * ```tsx
 * // Default public badge
 * <ReviewStatusBadge isPublic={true} isFlagged={false} />
 *
 * // Compact flagged badge without icon
 * <ReviewStatusBadge
 *   isPublic={false}
 *   isFlagged={true}
 *   variant="compact"
 *   showIcon={false}
 * />
 *
 * // Large highlighted public badge
 * <ReviewStatusBadge
 *   isPublic={true}
 *   isFlagged={false}
 *   variant="highlight"
 *   size="lg"
 * />
 * ```
 */
const ReviewStatusBadge = React.forwardRef<HTMLDivElement, ReviewStatusBadgeProps>(
  ({ className, variant, size, isPublic, isFlagged, showIcon = true, ...props }, ref) => {
    // Determine status based on flags (flagged takes precedence)
    const status = isFlagged ? 'flagged' : isPublic ? 'public' : 'private'

    // Select appropriate icon based on status
    const Icon = isFlagged ? Flag : isPublic ? Eye : EyeOff

    // Determine label text
    const label = isFlagged ? 'Flagged' : isPublic ? 'Public' : 'Private'

    // Determine icon size based on badge size
    const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'

    return (
      <div
        ref={ref}
        className={cn(reviewStatusBadgeVariants({ variant, size, status, className }))}
        role="status"
        aria-label={`Review status: ${label}`}
        {...props}
      >
        {showIcon && <Icon className={iconSize} aria-hidden="true" />}
        <span>{label}</span>
      </div>
    )
  }
)

ReviewStatusBadge.displayName = 'ReviewStatusBadge'

export { ReviewStatusBadge, reviewStatusBadgeVariants }
