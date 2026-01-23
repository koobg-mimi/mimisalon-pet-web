'use client'

import { useSession } from '@/lib/auth-client'
import { useGetDashboardOverviewQuery } from '../state/dashboard-api-slice'
import type { OverviewStats } from '../types/dashboard.types'

/**
 * Time range filter options for dashboard data aggregation.
 * Determines the period for which statistics are calculated.
 */
export type TimeRange = 'week' | 'month' | 'year'

/**
 * Custom hook for fetching admin dashboard overview data.
 *
 * **Migration Note (Task 1.11):**
 * This hook has been migrated from TanStack Query to RTK Query while maintaining
 * backward compatibility with the original API. Components using this hook
 * should continue to work without modifications.
 *
 * Previous implementation:
 * - TanStack Query with `useQuery` hook
 * - Direct API adapter call with `getDashboardOverview`
 *
 * Current implementation:
 * - RTK Query with `useGetDashboardOverviewQuery` from dashboard-api-slice
 * - Returns interface-compatible object with TanStack Query return type
 * - Session-aware query skipping for authentication
 *
 * Key features:
 * - Automatic data fetching with configurable time ranges
 * - Session-aware: only fetches when user is authenticated (uses RTK Query `skip` option)
 * - Smart caching: 10-minute keepUnusedDataFor for reduced API calls
 * - Redux DevTools integration for state debugging
 * - Type-safe return values with OverviewStats
 *
 * Architecture:
 * ```
 * API Route → RTK Query Slice (transforms) → useGetDashboardOverviewQuery →
 *   useDashboardOverview (compat wrapper, this) → UI Components
 * ```
 *
 * RTK Query Benefits:
 * - Centralized cache management via Redux store
 * - Automatic request deduplication
 * - Built-in optimistic updates support
 * - Redux DevTools integration for debugging
 * - Normalized cache for related data
 *
 * @param timeRange - Time range for data aggregation ('week' | 'month' | 'year')
 * @returns TanStack Query-compatible result with OverviewStats data
 *
 * @example
 * ```tsx
 * function DashboardPage() {
 *   const { data: stats, isLoading, error } = useDashboardOverview('month')
 *
 *   if (isLoading) return <LoadingSpinner />
 *   if (error) return <ErrorMessage error={error} />
 *   if (!stats) return null
 *
 *   return <DashboardStatsGrid stats={stats} />
 * }
 * ```
 *
 * @example With time range selector
 * ```tsx
 * function DashboardWithFilter() {
 *   const [timeRange, setTimeRange] = useState<TimeRange>('month')
 *   const { data: stats } = useDashboardOverview(timeRange)
 *
 *   return (
 *     <>
 *       <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
 *       <DashboardStatsGrid stats={stats} />
 *     </>
 *   )
 * }
 * ```
 */
export function useDashboardOverview(timeRange: TimeRange = 'month') {
  // Get session to determine if user is authenticated
  // Session check is used to skip RTK Query when not authenticated
  const { data: session, isPending: isSessionPending } = useSession()

  // Use RTK Query hook with session-based skipping
  // skip: true prevents the query from running when:
  // - Session is still loading (isSessionPending)
  // - No authenticated user session exists
  const {
    data,
    isLoading: isQueryLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetDashboardOverviewQuery(timeRange, {
    // Skip query execution if:
    // 1. Session is still being loaded (prevents premature 401 errors)
    // 2. User is not authenticated (no session.user)
    // This matches the TanStack Query `enabled` behavior
    skip: isSessionPending || !session?.user,
  })

  // Return TanStack Query-compatible interface
  // Maps RTK Query return values to match original hook API
  return {
    // Data is undefined when loading or skipped
    data,

    // isLoading combines session loading and query loading states
    // This ensures loading state is true during initial authentication check
    isLoading: isSessionPending || isQueryLoading || isFetching,

    // Error state from RTK Query
    isError,
    error: error as Error | null,

    // Refetch function maintains same signature as TanStack Query
    // RTK Query refetch returns a Promise, matching TanStack Query behavior
    refetch,
  }
}

/**
 * Type export for hook return value.
 * Useful for typing variables or props that receive the hook result.
 *
 * @example
 * ```tsx
 * type DashboardProps = {
 *   queryResult: UseDashboardOverviewResult
 * }
 *
 * function Dashboard({ queryResult }: DashboardProps) {
 *   const { data, isLoading } = queryResult
 *   // ...
 * }
 * ```
 */
export type UseDashboardOverviewResult = ReturnType<typeof useDashboardOverview>
