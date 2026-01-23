/**
 * RTK Query API for Admin Groomers
 *
 * Provides type-safe data fetching for groomer management.
 * Imports types from API route files (single source of truth).
 *
 * @module features/admin-groomers/state/admin-groomers-api-slice
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { AdminGroomersGetResponse, AdminGroomerInfo } from '@/app/api/admin/groomers/route'
import type { GetCommissionGradesResponse } from '@/app/api/admin/commission-grades/route'
import type { GroomerFilters, UpdateCommissionGradeRequest } from '../types/groomer.types'

/**
 * Request parameters for getGroomers endpoint
 */
export interface GetGroomersParams extends Partial<GroomerFilters> {
  /** Page number (1-indexed) */
  page: number
  /** Number of items per page */
  limit: number
}

/**
 * Response from groomer mutations
 */
interface GroomerMutationResponse {
  success: boolean
  groomer?: AdminGroomerInfo
  message?: string
  error?: string
}

/**
 * Admin Groomers API
 *
 * RTK Query API definition for admin groomers endpoints.
 * Uses the existing API routes and provides type-safe data fetching.
 *
 * Key features:
 * - Type-safe API calls with AdminGroomersGetResponse from route
 * - Automatic caching with tag-based invalidation
 * - Mutations for groomer status changes (activate, deactivate, suspend)
 * - Commission grade updates
 * - Redux DevTools integration for debugging
 *
 * @example
 * ```tsx
 * import { useGetGroomersQuery, useActivateGroomerMutation } from '@/features/admin-groomers/state/admin-groomers-api-slice'
 *
 * function GroomersPage() {
 *   const { data, isLoading } = useGetGroomersQuery({ page: 1, limit: 20, ...filters })
 *   const [activateGroomer] = useActivateGroomerMutation()
 *   // data is typed as AdminGroomersGetResponse
 * }
 * ```
 */
export const adminGroomersApi = createApi({
  reducerPath: 'adminGroomersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Groomers', 'GroomerStats'],
  endpoints: (builder) => ({
    /**
     * Get paginated groomers list with filters
     *
     * Fetches groomers with support for:
     * - Pagination (page, limit)
     * - Search (by name, email, phone)
     * - Filtering (by status, location)
     * - Sorting (by various fields)
     *
     * Type flow:
     * - Request: GetGroomersParams (filters + pagination)
     * - API Response: AdminGroomersGetResponse (from route.ts)
     * - Result: AdminGroomersGetResponse (no transformation needed)
     *
     * Caching strategy:
     * - keepUnusedDataFor: 600 seconds (10 minutes) - matches TanStack Query gcTime
     * - Cached data persists for 10 minutes after last use
     * - Tags: ['Groomers', 'GroomerStats'] for invalidation
     *
     * @param params - Filter and pagination parameters
     * @returns AdminGroomersGetResponse with groomers and pagination info
     */
    getGroomers: builder.query<AdminGroomersGetResponse, GetGroomersParams>({
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
        if (params.locationFilter && params.locationFilter !== 'ALL') {
          queryParams.append('location', params.locationFilter)
        }
        if (params.sortBy) {
          queryParams.append('sortBy', params.sortBy)
        }
        if (params.sortOrder) {
          queryParams.append('sortOrder', params.sortOrder)
        }

        return `/admin/groomers?${queryParams}`
      },
      providesTags: (result) =>
        result
          ? [
              ...result.groomers.map(({ id }) => ({ type: 'Groomers' as const, id })),
              { type: 'Groomers', id: 'LIST' },
              { type: 'GroomerStats', id: 'STATS' },
            ]
          : [{ type: 'Groomers', id: 'LIST' }],
      keepUnusedDataFor: 600, // 10 minutes - matches TanStack Query gcTime
    }),

    /**
     * Activate a groomer
     *
     * Changes groomer status to active.
     * Invalidates Groomers cache to trigger refetch.
     *
     * @param groomerId - ID of groomer to activate
     * @returns Mutation response
     */
    activateGroomer: builder.mutation<GroomerMutationResponse, string>({
      query: (groomerId) => ({
        url: `/admin/groomers/${groomerId}/activate`,
        method: 'POST',
      }),
      invalidatesTags: [
        { type: 'Groomers', id: 'LIST' },
        { type: 'GroomerStats', id: 'STATS' },
      ],
    }),

    /**
     * Deactivate a groomer
     *
     * Changes groomer status to inactive.
     * Invalidates Groomers cache to trigger refetch.
     *
     * @param groomerId - ID of groomer to deactivate
     * @returns Mutation response
     */
    deactivateGroomer: builder.mutation<GroomerMutationResponse, string>({
      query: (groomerId) => ({
        url: `/admin/groomers/${groomerId}/deactivate`,
        method: 'POST',
      }),
      invalidatesTags: [
        { type: 'Groomers', id: 'LIST' },
        { type: 'GroomerStats', id: 'STATS' },
      ],
    }),

    /**
     * Suspend a groomer
     *
     * Suspends a groomer (sets isActive to false).
     * Invalidates Groomers cache to trigger refetch.
     *
     * @param groomerId - ID of groomer to suspend
     * @returns Mutation response
     */
    suspendGroomer: builder.mutation<GroomerMutationResponse, string>({
      query: (groomerId) => ({
        url: `/admin/groomers/${groomerId}/suspend`,
        method: 'POST',
      }),
      invalidatesTags: [
        { type: 'Groomers', id: 'LIST' },
        { type: 'GroomerStats', id: 'STATS' },
      ],
    }),

    /**
     * Update groomer commission grade
     *
     * Updates the commission grade for a groomer.
     * Invalidates Groomers cache to trigger refetch.
     *
     * @param request - Groomer ID and new commission grade ID
     * @returns Mutation response
     */
    updateCommissionGrade: builder.mutation<GroomerMutationResponse, UpdateCommissionGradeRequest>({
      query: ({ groomerId, commissionGradeId }) => ({
        url: `/admin/groomers/${groomerId}/update-commission`,
        method: 'POST',
        body: { commissionGradeId },
      }),
      invalidatesTags: [{ type: 'Groomers', id: 'LIST' }],
    }),

    /**
     * Get commission grades list
     *
     * Fetches all commission grades with optional filtering.
     * Used for displaying commission grade options in forms.
     *
     * @returns GetCommissionGradesResponse with grades list
     */
    getCommissionGrades: builder.query<
      GetCommissionGradesResponse,
      { status?: 'ALL' | 'ACTIVE' | 'INACTIVE' }
    >({
      query: ({ status = 'ACTIVE' } = {}) => `/admin/commission-grades?status=${status}`,
      keepUnusedDataFor: 600, // 10 minutes
    }),
  }),
})

/**
 * Export hooks for usage in components
 *
 * These are automatically generated by RTK Query based on the endpoints.
 */
export const {
  useGetGroomersQuery,
  useActivateGroomerMutation,
  useDeactivateGroomerMutation,
  useSuspendGroomerMutation,
  useUpdateCommissionGradeMutation,
  useGetCommissionGradesQuery,
} = adminGroomersApi
