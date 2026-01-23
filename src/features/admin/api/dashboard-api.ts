/**
 * Admin Dashboard API Adapter Layer
 *
 * This module implements the BFF (Backend for Frontend) pattern, transforming
 * raw API responses into client-optimized data structures for the admin dashboard.
 *
 * Key responsibilities:
 * - Fetch data from API routes
 * - Transform API responses to UI-friendly formats
 * - Perform calculations and aggregations
 * - Apply formatting for display
 * - Handle errors gracefully
 *
 * Architecture: API Route → API Adapter (this layer) → React Hook → UI Components
 *
 * @module features/admin/api/dashboard-api
 */

import type {
  ActivityItem,
  MonthlyRevenue,
  OverviewStats,
  ServiceStats,
  UserGrowthData,
} from '../types/dashboard.types'

// ============================================================================
// API Response Types (from existing route)
// ============================================================================

/**
 * API response from /api/admin/dashboard/overview
 * This matches the existing API route structure.
 */
interface ApiDashboardOverviewResponse {
  metrics: {
    totalBookings: number
    completedBookings: number
    pendingBookings: number
    cancelledBookings: number
    totalRevenue: number
    totalCustomers: number
    totalGroomers: number
    completionRate: number
    avgBookingValue: number
    averageRating: number
    totalReviews: number
  }
  previousMetrics: {
    totalBookings: number
    completedBookings: number
    pendingBookings: number
    cancelledBookings: number
    totalRevenue: number
    totalCustomers: number
    totalGroomers: number
    completionRate: number
    avgBookingValue: number
    averageRating: number
    totalReviews: number
  }
  recentBookings: Array<{
    id: string
    bookingNumber: string
    customerName: string | null
    groomerName: string
    serviceDate: string // ISO date string after JSON serialization
    totalPrice: number
    status: string
    createdAt: string // ISO date string after JSON serialization
  }>
  topServices: Array<{
    serviceId: string
    name: string
    description: string | null
    bookingCount: number
    totalRevenue: number
  }>
  userGrowth: Array<{
    period: string
    newUsers: number
    cumulativeUsers: number
  }>
  monthlyRevenue: Array<{
    month: string // YYYY-MM format
    revenue: number // Total revenue in cents
    bookingCount: number // Number of bookings
  }>
  range: 'week' | 'month' | 'year'
  startDate: string // ISO date string
  endDate: string // ISO date string
  previousStartDate: string
  previousEndDate: string
}

// ============================================================================
// Public API Functions
// ============================================================================

/**
 * Fetch and transform dashboard overview data from API.
 *
 * This is the primary entry point for dashboard data fetching.
 * It performs the following transformations:
 * 1. Fetches raw data from API route
 * 2. Calculates derived metrics (growth, active groomers, etc.)
 * 3. Transforms booking data to activity items
 * 4. Aggregates service statistics
 * 5. Generates time-series data for charts
 *
 * @param timeRange - Time range filter ('week', 'month', 'year')
 * @returns Transformed OverviewStats optimized for UI rendering
 * @throws Error if API request fails or data is invalid
 *
 * @example
 * ```typescript
 * const stats = await getDashboardOverview('month');
 * console.log(stats.totalRevenue); // UI-ready data
 * ```
 */
export async function getDashboardOverview(
  timeRange: 'week' | 'month' | 'year' = 'month'
): Promise<OverviewStats> {
  try {
    // 1. Fetch from API route
    const response = await fetch(`/api/admin/dashboard/overview?range=${timeRange}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const apiData: ApiDashboardOverviewResponse = await response.json()

    // 2. Calculate derived metrics
    const bookingGrowth = calculateMonthlyGrowth(apiData.metrics, apiData.previousMetrics)
    const revenueGrowth = calculateRevenueGrowth(apiData.metrics, apiData.previousMetrics)
    const activeGroomers = calculateActiveGroomers(apiData)
    const completedBookingsToday = filterTodayBookings(apiData)

    // 3. Transform data structures
    const recentActivity = transformToActivityItems(apiData.recentBookings)
    const topServices = transformTopServices(apiData.topServices)
    const monthlyRevenue = transformMonthlyRevenue(apiData.monthlyRevenue)
    const userGrowth = transformUserGrowth(apiData.userGrowth)

    // 4. Construct UI-optimized response
    const overviewStats: any = {
      // Core metrics from API
      totalBookings: apiData.metrics.totalBookings,
      totalRevenue: apiData.metrics.totalRevenue,
      totalCustomers: apiData.metrics.totalCustomers,
      activeServices: topServices.length, // Number of services with bookings
      totalUsers: apiData.metrics.totalCustomers, // Alias for compatibility
      activeGroomers: activeGroomers,
      completedBookingsToday: completedBookingsToday,
      pendingBookings: apiData.metrics.pendingBookings,
      averageRating: apiData.metrics.averageRating,

      // Calculated metrics (now using real historical data)
      bookingGrowth: bookingGrowth,
      revenueGrowth: revenueGrowth,
      monthlyGrowth: bookingGrowth, // Alias for compatibility
      averageBookingValue: apiData.metrics.avgBookingValue,

      // Period information (keep as ISO strings for Redux serialization)
      periodLabel: getPeriodLabel(timeRange),
      period: {
        startDate: apiData.startDate, // Keep as ISO string
        endDate: apiData.endDate, // Keep as ISO string
        label: getPeriodLabel(timeRange),
      },

      // Transformed data for UI components
      recentActivity: recentActivity,
      topServices: topServices,
      monthlyRevenue: monthlyRevenue,
      userGrowth: userGrowth,

      // State flags
      isLoading: false,
      error: null,
    }

    return overviewStats
  } catch (error) {
    console.error('Failed to fetch dashboard overview:', error)
    throw error
  }
}

// ============================================================================
// Calculation Helpers
// ============================================================================
// These helper functions are exported for reuse in dashboard-api-slice.ts

/**
 * Calculate month-over-month booking growth percentage.
 *
 * Compares current period bookings to previous period.
 * Returns percentage change (-100 to +Infinity).
 *
 * @param currentMetrics - Current period metrics
 * @param previousMetrics - Previous period metrics
 * @returns Growth percentage (1 decimal place)
 */
export function calculateMonthlyGrowth(
  currentMetrics: ApiDashboardOverviewResponse['metrics'],
  previousMetrics: ApiDashboardOverviewResponse['previousMetrics']
): number {
  if (previousMetrics.totalBookings === 0) return 0

  const growth =
    ((currentMetrics.totalBookings - previousMetrics.totalBookings) /
      previousMetrics.totalBookings) *
    100
  return Math.round(growth * 10) / 10 // Round to 1 decimal place
}

/**
 * Calculate month-over-month revenue growth percentage.
 *
 * Compares current period revenue to previous period.
 * Returns percentage change (-100 to +Infinity).
 *
 * @param currentMetrics - Current period metrics
 * @param previousMetrics - Previous period metrics
 * @returns Growth percentage (1 decimal place)
 */
export function calculateRevenueGrowth(
  currentMetrics: ApiDashboardOverviewResponse['metrics'],
  previousMetrics: ApiDashboardOverviewResponse['previousMetrics']
): number {
  if (previousMetrics.totalRevenue === 0) return 0

  const growth =
    ((currentMetrics.totalRevenue - previousMetrics.totalRevenue) / previousMetrics.totalRevenue) *
    100
  return Math.round(growth * 10) / 10 // Round to 1 decimal place
}

/**
 * Calculate number of active groomers.
 *
 * Active groomers are those with bookings in the current period.
 * This is derived from the recentBookings data.
 *
 * @param data - API response data
 * @returns Count of active groomers
 */
export function calculateActiveGroomers(data: ApiDashboardOverviewResponse): number {
  // Count unique groomers from recent bookings
  const uniqueGroomers = new Set(
    data.recentBookings.map((booking) => booking.groomerName).filter((name) => name !== '미배정')
  )

  return uniqueGroomers.size
}

/**
 * Filter bookings completed today.
 *
 * Counts bookings with status 'SERVICE_COMPLETED' and serviceDate within today.
 *
 * @param data - API response data
 * @returns Count of completed bookings today
 */
export function filterTodayBookings(data: ApiDashboardOverviewResponse): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const completedToday = data.recentBookings.filter((booking) => {
    if (booking.status !== 'SERVICE_COMPLETED') return false

    const serviceDate = new Date(booking.serviceDate)
    return serviceDate >= today && serviceDate < tomorrow
  })

  return completedToday.length
}

/**
 * Get human-readable label for time period.
 *
 * @param timeRange - Time range filter
 * @returns Korean label for the period
 */
export function getPeriodLabel(timeRange: 'week' | 'month' | 'year'): string {
  switch (timeRange) {
    case 'week':
      return '최근 1주'
    case 'month':
      return '이번 달'
    case 'year':
      return '올해'
    default:
      return '이번 달'
  }
}

// ============================================================================
// Data Transformation Helpers
// ============================================================================

/**
 * Transform bookings to activity feed items.
 *
 * Converts raw booking data to ActivityItem discriminated union.
 * Maps booking status to activity status (success/pending/error).
 * Sorts by timestamp (newest first).
 * Limits to 20 most recent items.
 *
 * @param bookings - Raw booking data from API
 * @returns Array of activity items for UI rendering
 */
export function transformToActivityItems(
  bookings: ApiDashboardOverviewResponse['recentBookings']
): ActivityItem[] {
  const activities: ActivityItem[] = bookings.map((booking) => {
    // Map booking status to activity status
    const activityStatus = mapBookingStatusToActivityStatus(booking.status)

    return {
      type: 'booking' as const,
      id: booking.id,
      customerName: booking.customerName || '알 수 없음',
      serviceName: `예약 #${booking.bookingNumber}`,
      status: booking.status as any, // BookingStatus type
      timestamp: booking.createdAt, // Keep as ISO string for Redux serialization
      amount: booking.totalPrice,
    }
  })

  // Sort by timestamp (newest first) and limit to 20 items
  // ISO strings can be compared directly for chronological sorting
  return activities.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 20)
}

/**
 * Map booking status to activity status.
 *
 * @param bookingStatus - Booking status from API
 * @returns Activity status (completed/pending/failed)
 */
function mapBookingStatusToActivityStatus(
  bookingStatus: string
): 'completed' | 'pending' | 'failed' {
  if (bookingStatus === 'SERVICE_COMPLETED') return 'completed'
  if (bookingStatus === 'SERVICE_CANCELLED') return 'failed'
  return 'pending'
}

/**
 * Transform API top services data to UI-friendly ServiceStats format.
 *
 * Converts raw service statistics from API to enriched format for display.
 * Adds ranking and placeholder values for fields not yet implemented.
 *
 * @param apiTopServices - Top services data from API
 * @returns Array of service statistics for UI rendering
 */
export function transformTopServices(
  apiTopServices: ApiDashboardOverviewResponse['topServices']
): ServiceStats[] {
  return apiTopServices.map((service, index) => ({
    serviceId: service.serviceId,
    name: service.name,
    bookings: service.bookingCount,
    revenue: service.totalRevenue,
    rating: 4.5, // TODO: Add service-level rating calculation in API
    satisfactionRate: 95, // TODO: Calculate from review data
    rank: index + 1,
    growth: 0, // TODO: Requires previous period service comparison
  }))
}

/**
 * Transform API monthly revenue data to UI-friendly format.
 *
 * Converts aggregated monthly revenue from the API to the chart-ready format
 * with percentage change calculations.
 *
 * @param apiMonthlyRevenue - Monthly revenue data from API
 * @returns Array of monthly revenue data points for charting
 */
export function transformMonthlyRevenue(
  apiMonthlyRevenue: Array<{ month: string; revenue: number; bookingCount: number }>
): MonthlyRevenue[] {
  return apiMonthlyRevenue.map((data, index) => {
    // Get previous month data for comparison
    const prevData = index > 0 ? apiMonthlyRevenue[index - 1] : { revenue: 0 }

    // Calculate percentage change
    const percentageChange =
      prevData.revenue > 0 ? ((data.revenue - prevData.revenue) / prevData.revenue) * 100 : 0

    return {
      month: data.month,
      value: data.revenue,
      previousValue: prevData.revenue,
      percentageChange: Math.round(percentageChange * 10) / 10,
    }
  })
}

/**
 * Transform API user growth data to UI-friendly format.
 *
 * Converts period-based user registration data from API to chart-ready format.
 *
 * @param apiUserGrowth - User growth data from API
 * @returns Array of user growth data points for charting
 */
export function transformUserGrowth(
  apiUserGrowth: ApiDashboardOverviewResponse['userGrowth']
): UserGrowthData[] {
  return apiUserGrowth.map((data) => ({
    month: data.period,
    newUsers: data.newUsers,
    total: data.cumulativeUsers,
  }))
}

// ============================================================================
// Exports
// ============================================================================

export type { ApiDashboardOverviewResponse }
