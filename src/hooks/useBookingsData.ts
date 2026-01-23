'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from '@/lib/auth-client'

interface Booking {
  id: string
  bookingNumber: string
  serviceDate: string
  serviceTime: string
  status: string
  paymentStatus: string
  serviceType: string
  totalPrice: number
  totalAmount: number
  additionalCharges: number
  groomer?: {
    id: string
    name: string
    email: string
  }
  pet?: {
    id: string
    name: string
    type: string
    breed?: string
  }
  pets: Array<{
    id: string
    name: string
    type: string
  }>
  services: Array<{
    id: string
    name: string
    basePrice: number
  }>
  customerRating?: number
  customerReview?: string
  createdAt: string
  updatedAt: string
}

interface BookingListResponse {
  bookings: Booking[]
  totalBookings: number
  totalPages: number
  page: number
  size: number
  first: boolean
  last: boolean
}

interface BookingQueryParams {
  page?: number
  limit?: number
  status?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// Query keys for React Query
const bookingQueryKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingQueryKeys.all, 'list'] as const,
  list: (params: BookingQueryParams) => [...bookingQueryKeys.lists(), params] as const,
} as const

/**
 * Hook to fetch customer bookings with pagination
 */
export function useBookingsData(
  params: BookingQueryParams = {
    page: 1,
    limit: 10,
    sort_by: 'serviceDate',
    sort_order: 'desc',
  }
) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const query = useQuery<BookingListResponse>({
    queryKey: bookingQueryKeys.list(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams()

      if (params.page) searchParams.append('page', params.page.toString())
      if (params.limit) searchParams.append('limit', params.limit.toString())
      if (params.status) searchParams.append('status', params.status)
      if (params.sort_by) searchParams.append('sort_by', params.sort_by)
      if (params.sort_order) searchParams.append('sort_order', params.sort_order)

      const response = await fetch(`/api/customer/bookings?${searchParams}`)

      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }

      return response.json()
    },
    enabled: !!session?.user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })

  // Computed statistics
  const completedBookings = query.data?.bookings.filter((b) => b.status === 'COMPLETED') || []

  const upcomingBookings =
    query.data?.bookings.filter(
      (b) => b.status === 'CONFIRMED' && new Date(b.serviceDate) > new Date()
    ) || []

  const totalSpent = completedBookings.reduce(
    (sum, b) => sum + (b.totalAmount || b.totalPrice || 0),
    0
  )

  // Refresh function
  const refresh = () => query.refetch()

  // Load specific page
  const loadPage = async (page: number) => {
    const newParams = { ...params, page }
    await queryClient.fetchQuery({
      queryKey: bookingQueryKeys.list(newParams),
      queryFn: async () => {
        const searchParams = new URLSearchParams()
        searchParams.append('page', page.toString())
        if (newParams.limit) searchParams.append('limit', newParams.limit.toString())
        if (newParams.sort_by) searchParams.append('sort_by', newParams.sort_by)
        if (newParams.sort_order) searchParams.append('sort_order', newParams.sort_order)

        const response = await fetch(`/api/customer/bookings?${searchParams}`)

        if (!response.ok) {
          throw new Error('Failed to fetch bookings')
        }

        return response.json()
      },
    })
  }

  return {
    bookings: query.data?.bookings || [],
    loading: query.isPending,
    error: query.error?.message || '',
    refresh,
    completedBookings,
    upcomingBookings,
    totalSpent,
    // Pagination data
    currentPage: query.data?.page || 1,
    totalPages: query.data?.totalPages || 1,
    totalItems: query.data?.totalBookings || 0,
    itemsPerPage: query.data?.size || 10,
    hasNext: !query.data?.last || false,
    hasPrev: !query.data?.first || false,
    loadPage,
  }
}
