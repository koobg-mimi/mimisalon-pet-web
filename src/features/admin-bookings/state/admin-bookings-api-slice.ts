/**
 * RTK Query API for Admin Bookings
 *
 * Replaces TanStack Query with RTK Query for admin bookings data fetching.
 * Imports types from API route files (single source of truth).
 *
 * @module features/admin-bookings/state/admin-bookings-api-slice
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { AdminBookingsGetResponse, TransformedBooking } from '@/app/api/admin/bookings/route'
import type { BookingFilters } from '../types/booking.types'

/**
 * Request parameters for getBookings endpoint
 */
export interface GetBookingsParams extends BookingFilters {
  /** Page number (1-indexed) */
  page: number
  /** Number of items per page */
  limit: number
}

/**
 * Response from booking mutations
 */
interface BookingMutationResponse {
  success: boolean
  booking?: TransformedBooking
  message?: string
  error?: string
}

/**
 * Admin Bookings API
 *
 * RTK Query API definition for admin bookings endpoints.
 * Uses the existing API routes and provides type-safe data fetching.
 *
 * Key features:
 * - Type-safe API calls with AdminBookingsGetResponse from route
 * - Automatic caching with tag-based invalidation
 * - Mutations for booking state changes (confirm, cancel, complete, delete)
 * - Redux DevTools integration for debugging
 *
 * @example
 * ```tsx
 * import { useGetBookingsQuery, useConfirmBookingMutation } from '@/features/admin-bookings/state/admin-bookings-api-slice'
 *
 * function BookingsPage() {
 *   const { data, isLoading } = useGetBookingsQuery({ page: 1, limit: 50, ...filters })
 *   const [confirmBooking] = useConfirmBookingMutation()
 *   // data is typed as AdminBookingsGetResponse
 * }
 * ```
 */
export const adminBookingsApi = createApi({
  reducerPath: 'adminBookingsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Bookings'],
  endpoints: (builder) => ({
    /**
     * Get paginated bookings list with filters
     *
     * Fetches bookings with support for:
     * - Pagination (page, limit)
     * - Search (by booking number, customer name, phone)
     * - Filtering (by status, date)
     * - Sorting (by date, status, amount)
     *
     * Type flow:
     * - Request: GetBookingsParams (filters + pagination)
     * - API Response: AdminBookingsGetResponse (from route.ts)
     * - Result: AdminBookingsGetResponse (no transformation needed)
     *
     * Caching strategy:
     * - keepUnusedDataFor: 600 seconds (10 minutes) - matches TanStack Query gcTime
     * - Cached data persists for 10 minutes after last use
     * - Tags: ['Bookings', 'BookingStats'] for invalidation
     *
     * @param params - Filter and pagination parameters
     * @returns AdminBookingsGetResponse with bookings and pagination info
     */
    getBookings: builder.query<AdminBookingsGetResponse, GetBookingsParams>({
      query: (params) => {
        // Ensure timezone-safe date formatting (avoid toISOString() in UTC+9)
        const dateParam = params.dateFilter
          ? format(new Date(params.dateFilter + 'T00:00:00'), 'yyyy-MM-dd', { locale: ko })
          : ''

        const queryParams = new URLSearchParams({
          page: params.page.toString(),
          limit: params.limit.toString(),
          search: params.searchQuery,
          status: params.statusFilter,
          date: dateParam,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
        })

        return `/admin/bookings?${queryParams}`
      },
      providesTags: (result) =>
        result
          ? [
              ...result.bookings.map(({ id }) => ({ type: 'Bookings' as const, id })),
              { type: 'Bookings', id: 'LIST' },
            ]
          : [{ type: 'Bookings', id: 'LIST' }],
      keepUnusedDataFor: 600, // 10 minutes - matches TanStack Query gcTime
    }),

    /**
     * Confirm a booking
     *
     * Changes booking status to CONFIRMED.
     * Invalidates Bookings cache to trigger refetch.
     *
     * @param bookingId - ID of booking to confirm
     * @returns Mutation response with updated booking
     */
    confirmBooking: builder.mutation<BookingMutationResponse, string>({
      query: (bookingId) => ({
        url: `/admin/bookings/${bookingId}/confirm`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Bookings', id: 'LIST' }],
    }),

    /**
     * Cancel a booking
     *
     * Changes booking status to CANCELLED.
     * Invalidates Bookings cache to trigger refetch.
     *
     * @param bookingId - ID of booking to cancel
     * @returns Mutation response with updated booking
     */
    cancelBooking: builder.mutation<BookingMutationResponse, string>({
      query: (bookingId) => ({
        url: `/admin/bookings/${bookingId}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Bookings', id: 'LIST' }],
    }),

    /**
     * Complete a booking
     *
     * Changes booking status to COMPLETED.
     * Invalidates Bookings cache to trigger refetch.
     *
     * @param bookingId - ID of booking to complete
     * @returns Mutation response with updated booking
     */
    completeBooking: builder.mutation<BookingMutationResponse, string>({
      query: (bookingId) => ({
        url: `/admin/bookings/${bookingId}/complete`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Bookings', id: 'LIST' }],
    }),

    /**
     * Delete a booking
     *
     * Permanently deletes a booking.
     * Invalidates Bookings cache to trigger refetch.
     *
     * @param bookingId - ID of booking to delete
     * @returns Mutation response
     */
    deleteBooking: builder.mutation<BookingMutationResponse, string>({
      query: (bookingId) => ({
        url: `/admin/bookings/${bookingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Bookings', id: 'LIST' }],
    }),
  }),
})

/**
 * Export hooks for usage in components
 *
 * These are automatically generated by RTK Query based on the endpoints.
 */
export const {
  useGetBookingsQuery,
  useConfirmBookingMutation,
  useCancelBookingMutation,
  useCompleteBookingMutation,
  useDeleteBookingMutation,
} = adminBookingsApi
