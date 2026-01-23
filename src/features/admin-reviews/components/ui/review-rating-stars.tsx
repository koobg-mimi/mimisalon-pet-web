import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

/**
 * CVA definition for review rating stars variants
 * Supports different sizes for various display contexts
 */
const reviewRatingStarsVariants = cva('inline-flex items-center gap-0.5', {
  variants: {
    size: {
      sm: 'text-sm',
      default: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

/**
 * Props interface for ReviewRatingStars component
 * Extends standard HTML div attributes with CVA variant props
 */
export interface ReviewRatingStarsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof reviewRatingStarsVariants> {
  /** Rating value (1-5) */
  rating: number
  /** Whether to show the numeric rating next to stars (default: false) */
  showNumeric?: boolean
}

/**
 * ReviewRatingStars - Display Component
 *
 * Displays a read-only star rating visualization for reviews.
 * Shows filled stars up to the rating value and empty stars for the remainder.
 * Supports sizes (sm, default, lg) for different display contexts.
 *
 * @example
 * ```tsx
 * // Default 4-star rating
 * <ReviewRatingStars rating={4} />
 *
 * // Small 5-star rating with numeric value
 * <ReviewRatingStars rating={5} size="sm" showNumeric />
 *
 * // Large 3-star rating
 * <ReviewRatingStars rating={3} size="lg" />
 * ```
 */
const ReviewRatingStars = React.forwardRef<HTMLDivElement, ReviewRatingStarsProps>(
  ({ className, size, rating, showNumeric = false, ...props }, ref) => {
    // Clamp rating between 1 and 5
    const clampedRating = Math.max(1, Math.min(5, Math.round(rating)))

    // Determine icon size based on variant size
    const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'

    // Generate array of 5 stars
    const stars = Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1
      const isFilled = starNumber <= clampedRating

      return (
        <Star
          key={starNumber}
          className={cn(
            iconSize,
            'transition-colors',
            isFilled
              ? 'fill-yellow-400 text-yellow-400 dark:fill-yellow-500 dark:text-yellow-500'
              : 'fill-none text-gray-300 dark:text-gray-600'
          )}
          aria-hidden="true"
        />
      )
    })

    return (
      <div
        ref={ref}
        className={cn(reviewRatingStarsVariants({ size, className }))}
        role="img"
        aria-label={`Rating: ${clampedRating} out of 5 stars`}
        {...props}
      >
        {stars}
        {showNumeric && (
          <span
            className={cn(
              'text-muted-foreground ml-1.5 font-medium',
              size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
            )}
          >
            {clampedRating}
          </span>
        )}
      </div>
    )
  }
)

ReviewRatingStars.displayName = 'ReviewRatingStars'

export { ReviewRatingStars, reviewRatingStarsVariants }
