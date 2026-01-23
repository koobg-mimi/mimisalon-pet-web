import { useGetPaymentsQuery } from '../state/admin-payments-api-slice'
import type { PaymentFilters } from '../types/payment.types'

/**
 * Parameters for useAdminPayments hook
 */
interface UseAdminPaymentsParams {
  /** Filter criteria for payments */
  filters: PaymentFilters
  /** Current page number (1-indexed) */
  page: number
  /** Number of items per page */
  limit?: number
  /** Whether to enable the query (for conditional fetching) */
  enabled?: boolean
}

/**
 * Custom hook for fetching and managing admin payments data
 *
 * Wraps RTK Query's useGetPaymentsQuery with additional computed values
 * and a simplified interface for components.
 *
 * @param params - Hook parameters including filters and pagination
 * @param params.filters - Payment filter criteria (searchQuery, statusFilter)
 * @param params.page - Current page number (1-indexed)
 * @param params.limit - Items per page (default: 20)
 * @param params.enabled - Whether to enable query execution (default: true)
 *
 * @returns Object containing:
 * - `payments`: Array of AdminPaymentInfo records
 * - `pagination`: Metadata (currentPage, totalPages, totalCount)
 * - `isLoading`: True during initial data fetch
 * - `isFetching`: True during any fetch (including refetch)
 * - `isError`: True if query failed
 * - `error`: Error object if isError is true
 * - `refetch`: Function to manually trigger data refetch
 * - `isEmpty`: True if no results and not loading
 * - `hasNextPage`: True if more pages exist after current
 * - `hasPreviousPage`: True if pages exist before current
 *
 * @example
 * ```tsx
 * const { payments, pagination, isLoading, isEmpty } = useAdminPayments({
 *   filters: { searchQuery: '', statusFilter: 'ALL' },
 *   page: 1,
 *   limit: 20
 * })
 * ```
 */
export function useAdminPayments({
  filters,
  page,
  limit = 20,
  enabled = true,
}: UseAdminPaymentsParams) {
  // RTK Query hook
  const { data, isLoading, isFetching, isError, error, refetch } = useGetPaymentsQuery(
    {
      page,
      limit,
      searchQuery: filters.searchQuery,
      statusFilter: filters.statusFilter,
    },
    {
      skip: !enabled,
    }
  )

  return {
    // Data
    /** Array of payment records */
    payments: data?.payments ?? [],

    // Pagination metadata
    pagination: {
      /** Current page number */
      currentPage: data?.currentPage ?? page,
      /** Total number of pages */
      totalPages: data?.totalPages ?? 1,
      /** Total count of all payments matching filters */
      totalCount: data?.totalCount ?? 0,
    },

    // Loading states
    /** True when initial data is being fetched */
    isLoading,
    /** True when data is being fetched (including refetch) */
    isFetching,
    /** True when an error occurred */
    isError,
    /** Error object if isError is true */
    error,

    // Actions
    /** Manually trigger a refetch of the data */
    refetch,

    // Computed values
    /** True if no payments found and not loading */
    isEmpty: !isLoading && (data?.payments?.length ?? 0) === 0,
    /** True if there are more pages after current */
    hasNextPage: (data?.currentPage ?? 1) < (data?.totalPages ?? 1),
    /** True if there are pages before current */
    hasPreviousPage: (data?.currentPage ?? 1) > 1,
  }
}
