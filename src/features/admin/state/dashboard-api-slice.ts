/**
 * RTK Query API for Admin Dashboard Data
 *
 * Replaces TanStack Query with RTK Query for admin dashboard data fetching.
 * Imports types from API route files (single source of truth).
 *
 * @module features/admin/api/dashboard-api-slice
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { DashboardOverviewResponse } from '@/app/api/admin/dashboard/overview/route'
import type { OverviewStats } from '../types/dashboard.types'
import {
  type ApiDashboardOverviewResponse,
  calculateActiveGroomers,
  calculateMonthlyGrowth,
  calculateRevenueGrowth,
  filterTodayBookings,
  transformMonthlyRevenue,
  getPeriodLabel,
  transformToActivityItems,
  transformTopServices,
  transformUserGrowth,
} from '../api/dashboard-api'

/**
 * Time range type for dashboard queries
 */
export type TimeRange = 'week' | 'month' | 'year'

/**
 * Admin Dashboard API
 *
 * RTK Query API definition for admin dashboard endpoints.
 * Uses the existing API routes and transformation logic.
 *
 * Key features:
 * - Type-safe API calls with DashboardOverviewResponse from route
 * - Automatic caching with 5-minute staleness
 * - Transformation to client-optimized OverviewStats
 * - Redux DevTools integration for debugging
 *
 * @example
 * ```tsx
 * import { useGetDashboardOverviewQuery } from '@/features/admin/api/dashboard-api-slice'
 *
 * function DashboardPage() {
 *   const { data, isLoading } = useGetDashboardOverviewQuery('month')
 *   // data is typed as OverviewStats
 * }
 * ```
 */
export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['DashboardOverview'],
  endpoints: (builder) => ({
    /**
     * Get dashboard overview statistics
     *
     * Fetches comprehensive dashboard metrics and transforms them
     * from the API response format to the client-optimized format.
     *
     * Type flow:
     * - Request: TimeRange ('week' | 'month' | 'year')
     * - API Response: DashboardOverviewResponse (from route.ts)
     * - Transformed Result: OverviewStats (client format)
     *
     * Caching strategy:
     * - keepUnusedDataFor: 600 seconds (10 minutes) - same as TanStack Query gcTime
     * - Cached data persists for 10 minutes after last use
     * - Provides fast navigation within admin section
     *
     * @param timeRange - Time range filter ('week' | 'month' | 'year')
     * @returns OverviewStats with all dashboard metrics
     */
    getDashboardOverview: builder.query<OverviewStats, TimeRange>({
      query: (timeRange) => `/admin/dashboard/overview?range=${timeRange}`,

      /**
       * Transform API response to client format
       *
       * Converts DashboardOverviewResponse from the API route
       * to OverviewStats that the UI components expect.
       *
       * Reuses all transformation logic from dashboard-api.ts:
       * - calculateMonthlyGrowth, calculateActiveGroomers
       * - transformToActivityItems, aggregateTopServices
       * - generateMonthlyRevenue, generateUserGrowth
       */
      transformResponse: (response: DashboardOverviewResponse): OverviewStats => {
        const {
          metrics,
          previousMetrics,
          recentBookings,
          topServices: apiTopServices,
          userGrowth: apiUserGrowth,
          monthlyRevenue: apiMonthlyRevenue,
          range,
          startDate,
          endDate,
        } = response

        // Convert DashboardOverviewResponse to ApiDashboardOverviewResponse
        // (Date → string conversion happens automatically via JSON serialization)
        const apiData: ApiDashboardOverviewResponse = {
          metrics,
          previousMetrics,
          recentBookings: recentBookings.map((booking) => ({
            ...booking,
            // Dates are already strings after JSON deserialization
            serviceDate: booking.serviceDate as unknown as string,
            createdAt: booking.createdAt as unknown as string,
          })),
          topServices: apiTopServices,
          userGrowth: apiUserGrowth,
          monthlyRevenue: apiMonthlyRevenue,
          range,
          startDate: startDate as unknown as string,
          endDate: endDate as unknown as string,
          previousStartDate: response.previousStartDate as unknown as string,
          previousEndDate: response.previousEndDate as unknown as string,
        }

        // Calculate derived metrics using helper functions (now with real historical data)
        const bookingGrowth = calculateMonthlyGrowth(apiData.metrics, apiData.previousMetrics)
        const revenueGrowth = calculateRevenueGrowth(apiData.metrics, apiData.previousMetrics)
        const activeGroomers = calculateActiveGroomers(apiData)
        const completedBookingsToday = filterTodayBookings(apiData)

        // Transform data structures using helper functions
        const recentActivity = transformToActivityItems(apiData.recentBookings)
        const topServices = transformTopServices(apiData.topServices)
        const monthlyRevenue = transformMonthlyRevenue(apiData.monthlyRevenue)
        const userGrowth = transformUserGrowth(apiData.userGrowth)

        // Construct client-optimized response
        const overviewStats: OverviewStats = {
          // Core metrics from API
          totalBookings: metrics.totalBookings,
          totalRevenue: metrics.totalRevenue,
          totalCustomers: metrics.totalCustomers,
          activeServices: topServices.length,
          totalUsers: metrics.totalCustomers,
          activeGroomers,
          completedBookingsToday,
          pendingBookings: metrics.pendingBookings,
          averageRating: metrics.averageRating,

          // Calculated metrics (now using real historical data)
          bookingGrowth,
          revenueGrowth,
          monthlyGrowth: bookingGrowth,
          averageBookingValue: metrics.avgBookingValue,

          // Period information (keep as ISO strings for Redux serialization)
          periodLabel: getPeriodLabel(range),
          period: {
            startDate: startDate, // Keep as ISO string
            endDate: endDate, // Keep as ISO string
            label: getPeriodLabel(range),
          },

          // Transformed data for UI components
          recentActivity,
          topServices,
          monthlyRevenue,
          userGrowth,

          // State flags
          isLoading: false,
          error: null,
        }

        return overviewStats
      },

      providesTags: ['DashboardOverview'],

      /**
       * Cache configuration
       *
       * Maps TanStack Query settings to RTK Query equivalents:
       * - keepUnusedDataFor: 600 seconds (10 minutes) - equivalent to TanStack Query gcTime
       *   Cached data persists for 10 minutes after last use
       *
       * Note: In RTK Query, refetch on focus and reconnect are handled by setupListeners
       * configuration in the store setup, not at the endpoint level.
       * See: configureStore setup with setupListeners for full TanStack Query compatibility.
       *
       * This ensures consistent cache behavior with the original TanStack Query implementation.
       */
      keepUnusedDataFor: 600, // 10 minutes - matches TanStack Query gcTime
    }),
  }),
})

/**
 * Export hooks for usage in components
 *
 * These are automatically generated by RTK Query based on the endpoints.
 */
export const { useGetDashboardOverviewQuery } = dashboardApi
