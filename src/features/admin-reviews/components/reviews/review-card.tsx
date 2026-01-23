import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ReviewStatusBadge } from '@/features/admin-reviews/components/ui/review-status-badge'
import { ReviewRatingStars } from '@/features/admin-reviews/components/ui/review-rating-stars'
import type { AdminReviewInfo } from '@/features/admin-reviews/types/review.types'

/**
 * CVA definition for review card variants
 * Follows the standard card variant pattern from CLAUDE.md
 */
const reviewCardVariants = cva('cursor-pointer transition-all hover:shadow-md', {
  variants: {
    variant: {
      default: 'border-border bg-card shadow-sm',
      compact: 'border-border bg-card shadow-sm',
      detailed: 'border-border bg-card shadow-md',
      highlight: 'border-primary/50 bg-gradient-to-br from-primary/5 to-transparent shadow-md',
      minimal: 'border-border/50 bg-transparent shadow-none',
    },
    size: {
      sm: 'p-4',
      default: 'p-5',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

/**
 * Props interface for ReviewCard component
 * Extends standard HTML div attributes with CVA variant props
 */
export interface ReviewCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof reviewCardVariants> {
  /** Review data to display */
  review: AdminReviewInfo
  /** Callback when card is clicked to view details */
  onViewDetails?: (review: AdminReviewInfo) => void
}

/**
 * ReviewCard - CVA Component
 *
 * Displays a review summary card with status badge, rating stars, customer info,
 * date, and comment preview. Supports multiple variants and sizes for different
 * display contexts.
 *
 * @example
 * ```tsx
 * // Default review card
 * <ReviewCard review={review} onViewDetails={handleViewDetails} />
 *
 * // Compact variant for dense layouts
 * <ReviewCard review={review} variant="compact" size="sm" />
 *
 * // Highlighted flagged review
 * <ReviewCard
 *   review={flaggedReview}
 *   variant="highlight"
 *   onViewDetails={handleViewDetails}
 * />
 * ```
 */
const ReviewCard = React.forwardRef<HTMLDivElement, ReviewCardProps>(
  ({ className, variant, size, review, onViewDetails, ...props }, ref) => {
    const handleClick = () => {
      onViewDetails?.(review)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onViewDetails?.(review)
      }
    }

    // Format date for display
    const formattedDate = new Date(review.createdAt).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    return (
      <Card
        ref={ref}
        className={cn(reviewCardVariants({ variant, size, className }))}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={onViewDetails ? 0 : undefined}
        role={onViewDetails ? 'button' : undefined}
        aria-label={
          onViewDetails ? `View details for review by ${review.customer.name}` : undefined
        }
        {...props}
      >
        <CardHeader className="space-y-2 p-0 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1">
              <ReviewRatingStars rating={review.rating} size={size} />
              <p className="text-muted-foreground text-sm">
                <span className="text-foreground font-medium">{review.customer.name}</span>
                <span className="mx-1.5">•</span>
                <span>{formattedDate}</span>
              </p>
            </div>
            <ReviewStatusBadge
              isPublic={review.isPublic}
              isFlagged={review.isFlagged}
              size={size}
              variant={variant === 'minimal' ? 'minimal' : 'compact'}
            />
          </div>
        </CardHeader>

        {review.comment && (
          <CardContent className="p-0 pb-3">
            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
              {review.comment}
            </p>
          </CardContent>
        )}

        <CardFooter className="text-muted-foreground flex items-center justify-between p-0 text-xs">
          <span>{review.booking.service.name}</span>
          {review.response && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              Response
            </span>
          )}
        </CardFooter>
      </Card>
    )
  }
)

ReviewCard.displayName = 'ReviewCard'

export { ReviewCard, reviewCardVariants }
