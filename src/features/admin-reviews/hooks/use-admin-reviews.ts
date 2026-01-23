import { useMemo } from 'react'
import { useGetReviewsQuery } from '@/features/admin-reviews/state/admin-reviews-api-slice'
import type { ReviewFilters } from '@/features/admin-reviews/types/review.types'

interface UseAdminReviewsOptions {
  filters: ReviewFilters
  page: number
  limit?: number
  enabled?: boolean
}

/**
 * Custom hook for fetching and managing admin reviews data
 *
 * This hook wraps the RTK Query useGetReviewsQuery hook and provides
 * a clean interface with memoized derived data for components.
 *
 * @param options - Configuration options for fetching reviews
 * @param options.filters - Filter criteria for reviews
 * @param options.page - Current page number (1-indexed)
 * @param options.limit - Number of reviews per page (default: 20)
 * @param options.enabled - Whether to enable the query (default: true)
 *
 * @returns Object containing reviews data, pagination info, stats, and loading states
 *
 * @example
 * ```tsx
 * const { reviews, pagination, stats, isLoading } = useAdminReviews({
 *   filters: {
 *     searchQuery: 'John',
 *     ratingFilter: 5,
 *     statusFilter: 'PUBLIC',
 *     serviceFilter: 'ALL',
 *     sortBy: 'createdAt',
 *     sortOrder: 'desc'
 *   },
 *   page: 1,
 *   limit: 20
 * })
 * ```
 */
export function useAdminReviews({
  filters,
  page,
  limit = 20,
  enabled = true,
}: UseAdminReviewsOptions) {
  // RTK Query hook
  const { data, isLoading, isFetching, error } = useGetReviewsQuery(
    {
      page,
      limit,
      search: filters.searchQuery,
      rating: filters.ratingFilter,
      status: filters.statusFilter !== 'ALL' ? filters.statusFilter : undefined,
      service: filters.serviceFilter,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    },
    { skip: !enabled }
  )

  // Memoized reviews list
  const reviews = useMemo(() => data?.reviews ?? [], [data?.reviews])

  // Memoized pagination metadata
  const pagination = useMemo(
    () => ({
      currentPage: data?.currentPage ?? 1,
      totalPages: data?.totalPages ?? 1,
      totalCount: data?.totalCount ?? 0,
      hasNext: (data?.currentPage ?? 1) < (data?.totalPages ?? 1),
      hasPrev: (data?.currentPage ?? 1) > 1,
    }),
    [data]
  )

  // Memoized statistics
  const stats = useMemo(() => data?.stats, [data?.stats])

  return {
    reviews,
    pagination,
    stats,
    isLoading,
    isFetching,
    error,
  }
}
