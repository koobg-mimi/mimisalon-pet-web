/**
 * Admin Reviews RTK Query API Slice
 *
 * Provides RTK Query hooks for managing admin review operations:
 * - Fetching reviews with filters, pagination, and sorting
 * - Approving, flagging, hiding, and deleting reviews
 * - Responding to reviews
 *
 * Uses tag-based cache invalidation for automatic updates.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  AdminReviewsGetResponse,
  ReviewMutationResponse,
} from '@/features/admin-reviews/types/review.types'

// Query parameters interface
export interface GetReviewsParams {
  page?: number
  limit?: number
  search?: string
  rating?: number | null
  status?: string
  service?: string
  sortBy?: string
  sortOrder?: string
}

// Create RTK Query API
export const adminReviewsApi = createApi({
  reducerPath: 'adminReviewsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),

  // Tag types for cache invalidation
  tagTypes: ['Reviews', 'ReviewStats'],

  endpoints: (builder) => ({
    // GET /api/admin/reviews
    getReviews: builder.query<AdminReviewsGetResponse, GetReviewsParams>({
      query: (params) => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.limit) queryParams.append('limit', params.limit.toString())
        if (params.search) queryParams.append('search', params.search)
        if (params.rating) queryParams.append('rating', params.rating.toString())
        if (params.status) queryParams.append('status', params.status)
        if (params.service) queryParams.append('service', params.service)
        if (params.sortBy) queryParams.append('sortBy', params.sortBy)
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)

        return `/admin/reviews?${queryParams}`
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Reviews', id: 'LIST' },
              { type: 'ReviewStats', id: 'STATS' },
              ...result.reviews.map(({ id }) => ({ type: 'Reviews' as const, id })),
            ]
          : [{ type: 'Reviews', id: 'LIST' }],
      keepUnusedDataFor: 600, // 10 minutes cache
    }),

    // POST /api/admin/reviews/[id]/approve
    approveReview: builder.mutation<ReviewMutationResponse, string>({
      query: (reviewId) => ({
        url: `/admin/reviews/${reviewId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, reviewId) => [
        { type: 'Reviews', id: reviewId },
        { type: 'Reviews', id: 'LIST' },
        { type: 'ReviewStats', id: 'STATS' },
      ],
    }),

    // POST /api/admin/reviews/[id]/flag
    flagReview: builder.mutation<ReviewMutationResponse, { reviewId: string; reason: string }>({
      query: ({ reviewId, reason }) => ({
        url: `/admin/reviews/${reviewId}/flag`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { reviewId }) => [
        { type: 'Reviews', id: reviewId },
        { type: 'Reviews', id: 'LIST' },
        { type: 'ReviewStats', id: 'STATS' },
      ],
    }),

    // DELETE /api/admin/reviews/[id]
    deleteReview: builder.mutation<ReviewMutationResponse, string>({
      query: (reviewId) => ({
        url: `/admin/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, reviewId) => [
        { type: 'Reviews', id: reviewId },
        { type: 'Reviews', id: 'LIST' },
        { type: 'ReviewStats', id: 'STATS' },
      ],
    }),

    // POST /api/admin/reviews/[id]/respond
    respondToReview: builder.mutation<
      ReviewMutationResponse,
      { reviewId: string; response: string }
    >({
      query: ({ reviewId, response }) => ({
        url: `/admin/reviews/${reviewId}/respond`,
        method: 'POST',
        body: { response },
      }),
      invalidatesTags: (_result, _error, { reviewId }) => [
        { type: 'Reviews', id: reviewId },
        { type: 'Reviews', id: 'LIST' },
        { type: 'ReviewStats', id: 'STATS' },
      ],
    }),

    // POST /api/admin/reviews/[id]/hide
    hideReview: builder.mutation<ReviewMutationResponse, string>({
      query: (reviewId) => ({
        url: `/admin/reviews/${reviewId}/hide`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, reviewId) => [
        { type: 'Reviews', id: reviewId },
        { type: 'Reviews', id: 'LIST' },
        { type: 'ReviewStats', id: 'STATS' },
      ],
    }),
  }),
})

// Export hooks for usage in components
export const {
  useGetReviewsQuery,
  useApproveReviewMutation,
  useFlagReviewMutation,
  useDeleteReviewMutation,
  useRespondToReviewMutation,
  useHideReviewMutation,
} = adminReviewsApi
