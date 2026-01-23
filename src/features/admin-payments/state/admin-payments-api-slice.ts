import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { AdminPaymentsGetResponse } from '../types/payment.types'

/**
 * Query parameters for fetching payments
 */
export interface GetPaymentsParams {
  page: number
  limit: number
  searchQuery?: string
  statusFilter?: string
}

/**
 * RTK Query API slice for admin payments feature
 *
 * Provides cached queries for payment data with automatic
 * cache invalidation and refetching capabilities.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useGetPaymentsQuery({
 *   page: 1,
 *   limit: 20,
 *   statusFilter: 'PAID'
 * })
 * ```
 */
export const adminPaymentsApi = createApi({
  reducerPath: 'adminPaymentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Payments', 'PaymentStats'],
  endpoints: (builder) => ({
    /**
     * Get paginated list of payments with optional filters
     *
     * Cache tags (for surgical invalidation):
     * - `Payments:LIST` - Invalidates all paginated lists (use after create/delete)
     * - `Payments:{id}` - Invalidates specific payment detail (use after update)
     * - `PaymentStats:STATS` - Invalidates statistics (use after create/delete/status change)
     *
     * Invalidation strategy:
     * - After creating payment: invalidate `Payments:LIST` + `PaymentStats:STATS`
     * - After updating payment: invalidate `Payments:{id}` (+ `LIST` if status changed)
     * - After deleting payment: invalidate `Payments:LIST` + `PaymentStats:STATS`
     * - After refund: invalidate both `Payments:{id}` and `PaymentStats:STATS`
     *
     * Cache retention: Data remains cached while any component is subscribed.
     * After all components unsubscribe, data is kept for 10 minutes (600 seconds)
     * before being garbage collected. Cache can be manually invalidated via tags
     * regardless of subscription state.
     */
    getPayments: builder.query<AdminPaymentsGetResponse, GetPaymentsParams>({
      query: (params) => {
        const queryParams = new URLSearchParams({
          page: params.page.toString(),
          limit: params.limit.toString(),
        })

        if (params.searchQuery) {
          queryParams.append('search', params.searchQuery)
        }

        if (params.statusFilter && params.statusFilter !== 'ALL') {
          queryParams.append('status', params.statusFilter)
        }

        return `/admin/payments?${queryParams.toString()}`
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Payments', id: 'LIST' },
              { type: 'PaymentStats', id: 'STATS' },
              ...result.payments.map(({ id }) => ({ type: 'Payments' as const, id })),
            ]
          : [{ type: 'Payments', id: 'LIST' }],
      keepUnusedDataFor: 600, // 10 minutes cache
    }),
  }),
})

/**
 * Auto-generated hooks for payment queries
 */
export const { useGetPaymentsQuery } = adminPaymentsApi

/**
 * Export endpoints for use in server-side code or manual queries
 */
export const { getPayments } = adminPaymentsApi.endpoints
