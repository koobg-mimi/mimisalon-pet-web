import { MessageSquare, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ReviewCard } from './review-card'
import type { AdminReviewInfo } from '@/features/admin-reviews/types/review.types'

export interface ReviewsListProps {
  /**
   * Array of reviews to display
   */
  reviews: AdminReviewInfo[]
  /**
   * Whether the list is currently loading
   */
  isLoading: boolean
  /**
   * Handler for viewing review details
   */
  onViewDetails: (review: AdminReviewInfo) => void
  /**
   * Current page number
   */
  currentPage?: number
  /**
   * Total pages available
   */
  totalPages?: number
  /**
   * Handler for page changes
   */
  onPageChange?: (page: number) => void
  /**
   * Card variant to use for review cards
   */
  cardVariant?: 'default' | 'compact' | 'detailed' | 'highlight' | 'minimal'
  /**
   * Card size to use for review cards
   */
  cardSize?: 'sm' | 'default' | 'lg'
}

/**
 * ReviewsList Component
 *
 * Displays a list of review cards with loading states, empty state,
 * and optional pagination controls.
 *
 * Follows the pattern from admin-groomers groomers-table.tsx but uses
 * a card-based layout instead of a table.
 *
 * @example
 * ```tsx
 * import { ReviewsList } from '@/features/admin-reviews/components/reviews/reviews-list'
 *
 * <ReviewsList
 *   reviews={reviews}
 *   isLoading={isLoading}
 *   onViewDetails={handleViewDetails}
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={handlePageChange}
 * />
 * ```
 */
export function ReviewsList({
  reviews,
  isLoading,
  onViewDetails,
  currentPage,
  totalPages,
  onPageChange,
  cardVariant = 'default',
  cardSize = 'default',
}: ReviewsListProps) {
  // Loading State
  if (isLoading && reviews.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[400px] items-center justify-center">
          <div className="text-muted-foreground flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">리뷰 불러오는 중...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Empty State
  if (!isLoading && reviews.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center">
            <MessageSquare className="text-muted-foreground/50 h-12 w-12" />
            <div>
              <p className="text-lg font-medium">리뷰를 찾을 수 없습니다</p>
              <p className="text-muted-foreground text-sm">필터나 검색어를 변경해보세요</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Reviews Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onViewDetails={onViewDetails}
            variant={review.isFlagged ? 'highlight' : cardVariant}
            size={cardSize}
          />
        ))}
      </div>

      {/* Loading More Indicator */}
      {isLoading && reviews.length > 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>추가 리뷰 불러오는 중...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination Controls */}
      {onPageChange && currentPage !== undefined && totalPages !== undefined && totalPages > 1 && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div className="text-muted-foreground text-sm">
              페이지 {currentPage} / {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
              >
                이전
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
              >
                다음
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* End of Results Indicator */}
      {!onPageChange && !isLoading && reviews.length > 0 && (
        <Card>
          <CardContent className="text-muted-foreground py-4 text-center text-sm">
            모든 리뷰를 불러왔습니다
          </CardContent>
        </Card>
      )}
    </div>
  )
}
