import { MessageSquare, Star, Eye, Flag, MessageCircle, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ReviewStats } from '@/features/admin-reviews/types/review.types'

export interface ReviewStatsCardsProps {
  /**
   * Review statistics data
   */
  stats: ReviewStats | null
}

/**
 * ReviewStatsCards Component
 *
 * Displays a responsive grid of statistics cards showing review metrics.
 * Includes total reviews, average rating, rating distribution, public/flagged counts,
 * and reviews with responses.
 *
 * Uses the existing Card component from shadcn/ui for consistent styling.
 *
 * @example
 * ```tsx
 * import { ReviewStatsCards } from '@/features/admin-reviews/components/reviews/review-stats-cards'
 *
 * const { data } = useGetReviewsQuery({ page: 1 })
 * <ReviewStatsCards stats={data?.stats} />
 * ```
 */
export function ReviewStatsCards({ stats }: ReviewStatsCardsProps) {
  if (!stats) return null

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Reviews */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">전체 리뷰</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{stats.totalReviews.toLocaleString('ko-KR')}</div>
            <MessageSquare className="text-muted-foreground h-4 w-4" />
          </div>
        </CardContent>
      </Card>

      {/* Average Rating */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">평균 평점</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.averageRating.toFixed(1)}
            </div>
            <Star className="h-4 w-4 fill-yellow-600 text-yellow-600" />
          </div>
        </CardContent>
      </Card>

      {/* Public Reviews */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">공개된 리뷰</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-green-600">
              {stats.publicReviews.toLocaleString('ko-KR')}
            </div>
            <Eye className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            {stats.totalReviews > 0
              ? `${((stats.publicReviews / stats.totalReviews) * 100).toFixed(0)}% 공개`
              : '리뷰 없음'}
          </p>
        </CardContent>
      </Card>

      {/* Flagged Reviews */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">신고된 리뷰</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-red-600">
              {stats.flaggedReviews.toLocaleString('ko-KR')}
            </div>
            <Flag className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            {stats.flaggedReviews > 0 ? '확인 필요' : '정상'}
          </p>
        </CardContent>
      </Card>

      {/* Rating Distribution - Spans 2 columns on md and above */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">평점 분포</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count =
                stats.ratingDistribution[rating.toString() as '1' | '2' | '3' | '4' | '5']
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0

              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex w-12 items-center justify-end gap-1 text-sm">
                    <span className="font-medium">{rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-secondary h-2 overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full bg-yellow-500 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-muted-foreground w-16 text-right text-sm tabular-nums">
                    {count} ({percentage.toFixed(0)}%)
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Response Rate */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">답변율</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {(stats.responseRate * 100).toFixed(0)}%
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {Math.round(stats.totalReviews * stats.responseRate).toLocaleString('ko-KR')}개 /{' '}
                {stats.totalReviews.toLocaleString('ko-KR')}개 리뷰에 답변
              </p>
            </div>
            <div className="flex gap-2">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <BarChart3 className="text-muted-foreground h-8 w-8" />
            </div>
          </div>
          {/* Response Rate Progress Bar */}
          <div className="mt-4">
            <div className="bg-secondary h-3 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${stats.responseRate * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
