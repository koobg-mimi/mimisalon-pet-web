/**
 * RTK Query API for Booking Data
 *
 * Replaces TanStack Query with RTK Query for booking-related data fetching
 * Imports types from API route files (single source of truth)
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Pet } from '@/hooks/usePets'
import type { Address } from '@/app/api/customer/addresses/route'
import type { AvailabilityResponse } from '@/app/api/bookings/availability/route'

/**
 * Re-export types for convenience
 */
export type { Address, AvailabilityResponse }

/**
 * Availability query parameters
 */
export interface AvailabilityQueryParams {
  date?: string
  addressId?: string
  page?: number
  limit?: number
}

/**
 * Booking Query API
 */
export const bookingQueryApi = createApi({
  reducerPath: 'bookingQueryApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Pets', 'Addresses', 'Availability'],
  endpoints: (builder) => ({
    /**
     * Get customer pets
     *
     * Note: Dates are kept as ISO strings for Redux serializability.
     * Components should parse them to Date objects when needed.
     */
    getPets: builder.query<Pet[], void>({
      query: () => '/customer/pets',
      providesTags: ['Pets'],
    }),

    /**
     * Get customer addresses
     */
    getAddresses: builder.query<Address[], void>({
      query: () => '/customer/addresses',
      providesTags: ['Addresses'],
    }),

    /**
     * Get availability (groomers and time slots)
     */
    getAvailability: builder.query<AvailabilityResponse, AvailabilityQueryParams>({
      query: ({ date, addressId, page = 1, limit = 6 }) => {
        const params = new URLSearchParams()
        if (date) params.append('date', date)
        if (addressId) params.append('addressId', addressId)
        params.append('page', page.toString())
        params.append('limit', limit.toString())

        return `/bookings/availability?${params.toString()}`
      },
      providesTags: ['Availability'],
      keepUnusedDataFor: 300, // 5 minutes cache
    }),
  }),
})

/**
 * Export hooks for usage in components
 */
export const { useGetPetsQuery, useGetAddressesQuery, useGetAvailabilityQuery } = bookingQueryApi
