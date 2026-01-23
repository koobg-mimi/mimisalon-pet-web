import { useMemo } from 'react'
import { BookingStatus } from '@mimisalon/shared'
import { useGetBookingsQuery } from '../state/admin-bookings-api-slice'
import type { BookingFilters, BookingStats } from '../types/booking.types'
import { QUERY_CONFIG } from '../types/booking.types'

/**
 * Helper hook for admin bookings with infinite scroll support
 *
 * This hook wraps RTK Query's useGetBookingsQuery and provides:
 * - Paginated bookings data
 * - Calculated stats from bookings
 * - Loading and error states
 *
 * Note: Unlike TanStack Query's useQueries, we fetch one page at a time.
 * For infinite scroll, the page component should track the current page
 * and this hook will fetch that specific page.
 *
 * @param filters - Current filter state
 * @param page - Current page number (1-indexed)
 * @param enabled - Whether query should be enabled
 * @returns Bookings data, stats, and query states
 */
export function useAdminBookings(
  filters: BookingFilters,
  page: number = 1,
  enabled: boolean = true
) {
  const { data, isLoading, isFetching, isError, error } = useGetBookingsQuery(
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
   * Calculate stats from current bookings data
   *
   * This provides real-time stats based on the fetched bookings.
   * Note: For a complete picture, we'd need to aggregate across all pages,
   * but for now we show stats based on the current dataset.
   */
  const stats: BookingStats | null = useMemo(() => {
    if (!data?.bookings) return null

    const bookings = data.bookings
    const totalBookings = data.pagination.totalCount

    // Calculate status counts
    const pendingBookings = bookings.filter(
      (b) =>
        b.status === BookingStatus.FIRST_PAYMENT_PENDING ||
        b.status === BookingStatus.FIRST_PAYMENT_VERIFY ||
        b.status === BookingStatus.GROOMER_CONFIRM_PENDING ||
        b.status === BookingStatus.ADDITIONAL_PAYMENT_PENDING
    ).length

    const confirmedBookings = bookings.filter(
      (b) =>
        b.status === BookingStatus.GROOMER_CONFIRM ||
        b.status === BookingStatus.ADDITIONAL_PAYMENT_COMPLETE
    ).length

    const completedBookings = bookings.filter(
      (b) => b.status === BookingStatus.SERVICE_COMPLETED
    ).length

    const cancelledBookings = bookings.filter(
      (b) => b.status === BookingStatus.SERVICE_CANCELLED
    ).length

    // Calculate total revenue from all bookings
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.paidAmount, 0)

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
    }
  }, [data])

  return {
    bookings: data?.bookings ?? [],
    pagination: data?.pagination,
    stats,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
  }
}

/**
 * Calculate comprehensive stats across all bookings
 *
 * This would require fetching all pages or a dedicated stats endpoint.
 * For now, it returns stats based on the visible bookings.
 *
 * TODO: Consider implementing a dedicated stats endpoint for accurate counts
 */
export function calculateBookingStats(
  bookings: Array<{ status: BookingStatus; paidAmount: number }>
): BookingStats {
  const totalBookings = bookings.length

  const pendingBookings = bookings.filter(
    (b) =>
      b.status === BookingStatus.FIRST_PAYMENT_PENDING ||
      b.status === BookingStatus.FIRST_PAYMENT_VERIFY ||
      b.status === BookingStatus.GROOMER_CONFIRM_PENDING ||
      b.status === BookingStatus.ADDITIONAL_PAYMENT_PENDING
  ).length

  const confirmedBookings = bookings.filter(
    (b) =>
      b.status === BookingStatus.GROOMER_CONFIRM ||
      b.status === BookingStatus.ADDITIONAL_PAYMENT_COMPLETE
  ).length

  const completedBookings = bookings.filter(
    (b) => b.status === BookingStatus.SERVICE_COMPLETED
  ).length

  const cancelledBookings = bookings.filter(
    (b) => b.status === BookingStatus.SERVICE_CANCELLED
  ).length

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.paidAmount, 0)

  return {
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    totalRevenue,
  }
}
