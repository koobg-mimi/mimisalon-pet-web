import { useMemo } from 'react'
import { useGetGroomersQuery } from '../state/admin-groomers-api-slice'
import type { GroomerFilters, GroomerStats } from '../types/groomer.types'
import { QUERY_CONFIG } from '../types/groomer.types'
import type { AdminGroomerInfo } from '@/app/api/admin/groomers/route'

/**
 * Helper hook for admin groomers with infinite scroll support
 *
 * This hook wraps RTK Query's useGetGroomersQuery and provides:
 * - Paginated groomers data
 * - Calculated stats from groomers
 * - Loading and error states
 *
 * Note: Unlike TanStack Query's useQueries, we fetch one page at a time.
 * For infinite scroll, the page component should track the current page
 * and this hook will fetch that specific page.
 *
 * @param filters - Current filter state
 * @param page - Current page number (1-indexed)
 * @param enabled - Whether query should be enabled
 * @returns Groomers data, stats, and query states
 */
export function useAdminGroomers(
  filters: GroomerFilters,
  page: number = 1,
  enabled: boolean = true
) {
  const { data, isLoading, isFetching, isError, error } = useGetGroomersQuery(
    {
      ...filters,
      page,
      limit: QUERY_CONFIG.PAGE_SIZE,
    },
    {
      skip: !enabled,
    }
  )

  /**
   * Calculate stats from current groomers data
   *
   * This provides real-time stats based on the fetched groomers.
   * Note: For a complete picture, we'd need to aggregate across all pages,
   * but for now we show stats based on the current dataset.
   */
  const stats: GroomerStats | null = useMemo(() => {
    if (!data?.groomers) return null

    const groomers = data.groomers
    const totalGroomers = data.totalCount

    // Calculate status counts
    const activeGroomers = groomers.filter((g) => g.isActive).length
    const inactiveGroomers = groomers.filter((g) => !g.isActive).length

    // Calculate average rating
    const ratings = groomers.map((g) => g.rating)
    const averageRating =
      ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0

    // Calculate monthly stats (last 30 days)
    // Note: This uses monthlyRevenue from the API which is already calculated
    const totalRevenueThisMonth = groomers.reduce((sum, groomer) => sum + groomer.monthlyRevenue, 0)

    // Estimate bookings this month (15% of total bookings for active groomers)
    const totalBookingsThisMonth = groomers.reduce((sum, groomer) => {
      return sum + (groomer.isActive ? Math.floor(groomer.totalBookings * 0.15) : 0)
    }, 0)

    return {
      totalGroomers,
      activeGroomers,
      inactiveGroomers,
      averageRating: Number(averageRating.toFixed(1)),
      totalBookingsThisMonth,
      totalRevenueThisMonth,
    }
  }, [data])

  return {
    groomers: data?.groomers ?? [],
    pagination:
      data && data.totalCount > 0
        ? {
            page: data.currentPage,
            totalPages: data.totalPages,
            totalCount: data.totalCount,
            limit: QUERY_CONFIG.PAGE_SIZE,
            hasNext: data.currentPage < data.totalPages,
            hasPrev: data.currentPage > 1,
          }
        : undefined,
    stats,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
  }
}

/**
 * Calculate comprehensive stats across all groomers
 *
 * This would require fetching all pages or a dedicated stats endpoint.
 * For now, it returns stats based on the visible groomers.
 *
 * TODO: Consider implementing a dedicated stats endpoint for accurate counts
 */
export function calculateGroomerStats(groomers: AdminGroomerInfo[]): GroomerStats {
  const totalGroomers = groomers.length

  const activeGroomers = groomers.filter((g) => g.isActive).length
  const inactiveGroomers = groomers.filter((g) => !g.isActive).length

  // Calculate average rating
  const ratings = groomers.map((g) => g.rating)
  const averageRating =
    ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0

  // Calculate monthly stats
  const totalRevenueThisMonth = groomers.reduce((sum, groomer) => sum + groomer.monthlyRevenue, 0)

  // Estimate bookings this month (15% of total bookings for active groomers)
  const totalBookingsThisMonth = groomers.reduce((sum, groomer) => {
    return sum + (groomer.isActive ? Math.floor(groomer.totalBookings * 0.15) : 0)
  }, 0)

  return {
    totalGroomers,
    activeGroomers,
    inactiveGroomers,
    averageRating: Number(averageRating.toFixed(1)),
    totalBookingsThisMonth,
    totalRevenueThisMonth,
  }
}
