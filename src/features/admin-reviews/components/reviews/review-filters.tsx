import { Filter, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ReviewFilters as ReviewFiltersType } from '@/features/admin-reviews/types/review.types'

export interface ReviewFiltersProps {
  /**
   * Current filter values
   */
  filters: ReviewFiltersType
  /**
   * Handler for filter changes
   */
  onFiltersChange: (filters: Partial<ReviewFiltersType>) => void
  /**
   * Handler for applying filters (optional - filters can be applied on change)
   */
  onApplyFilters?: () => void
  /**
   * Total count of reviews matching current filters
   */
  totalCount?: number
  /**
   * Current page number (for display)
   */
  currentPage?: number
  /**
   * Total pages available
   */
  totalPages?: number
  /**
   * Available services for filtering (optional)
   */
  services?: Array<{ id: string; name: string }>
}

/**
 * ReviewFilters Component
 *
 * Displays filter controls for the reviews list including search, rating filter,
 * status filter, service filter, and sort controls.
 *
 * Follows the pattern from admin-groomers groomer-filters.tsx.
 *
 * @example
 * ```tsx
 * import { ReviewFilters } from '@/features/admin-reviews/components/reviews/review-filters'
 *
 * <ReviewFilters
 *   filters={filters}
 *   onFiltersChange={handleFiltersChange}
 *   onApplyFilters={applyFilters}
 *   totalCount={totalCount}
 *   currentPage={1}
 *   totalPages={10}
 *   services={availableServices}
 * />
 * ```
 */
export function ReviewFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
  totalCount,
  currentPage,
  totalPages,
  services = [],
}: ReviewFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ searchQuery: value })
  }

  const handleRatingChange = (value: string) => {
    onFiltersChange({ ratingFilter: value === 'ALL' ? null : parseInt(value, 10) })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({ statusFilter: value as ReviewFiltersType['statusFilter'] })
  }

  const handleServiceChange = (value: string) => {
    onFiltersChange({ serviceFilter: value })
  }

  const handleSortByChange = (value: string) => {
    onFiltersChange({ sortBy: value as ReviewFiltersType['sortBy'] })
  }

  const handleSortOrderChange = (value: string) => {
    onFiltersChange({ sortOrder: value as ReviewFiltersType['sortOrder'] })
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        {/* Main Filters Row */}
        <div className="flex flex-col gap-4">
          {/* Search and Primary Filters */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Search Input */}
            <div className="flex-1">
              <Input
                placeholder="고객명, 리뷰 내용, 서비스명으로 검색..."
                value={filters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && onApplyFilters) {
                    onApplyFilters()
                  }
                }}
                className="w-full"
              />
            </div>

            {/* Rating Filter */}
            <Select
              value={filters.ratingFilter?.toString() || 'ALL'}
              onValueChange={handleRatingChange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="평점" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체 평점</SelectItem>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    <div className="flex items-center gap-1">
                      <span>{rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filters.statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체 상태</SelectItem>
                <SelectItem value="PUBLIC">공개</SelectItem>
                <SelectItem value="PRIVATE">비공개</SelectItem>
                <SelectItem value="FLAGGED">신고됨</SelectItem>
                <SelectItem value="WITH_RESPONSE">답변 완료</SelectItem>
                <SelectItem value="NO_RESPONSE">답변 대기</SelectItem>
              </SelectContent>
            </Select>

            {/* Apply Filters Button (Optional) */}
            {onApplyFilters && (
              <Button onClick={onApplyFilters} variant="outline" className="w-full sm:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                필터 적용
              </Button>
            )}
          </div>

          {/* Secondary Filters Row */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Service Filter (Optional) */}
            {services.length > 0 && (
              <Select value={filters.serviceFilter} onValueChange={handleServiceChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="서비스" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">전체 서비스</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Sort By */}
            <Select value={filters.sortBy} onValueChange={handleSortByChange}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">작성일</SelectItem>
                <SelectItem value="rating">평점</SelectItem>
                <SelectItem value="customerName">고객명</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Select value={filters.sortOrder} onValueChange={handleSortOrderChange}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">최신순</SelectItem>
                <SelectItem value="asc">오래된순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        {totalCount !== undefined && totalCount > 0 && (
          <div className="text-muted-foreground mt-4 text-sm">
            총 {totalCount.toLocaleString('ko-KR')}개의 리뷰
            {currentPage !== undefined && totalPages !== undefined && (
              <span>
                {' '}
                (페이지 {currentPage} / {totalPages})
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
