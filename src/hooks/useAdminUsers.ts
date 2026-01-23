'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from '@/lib/auth-client'

export interface User {
  id: string
  email: string
  name: string | null
  role: 'CUSTOMER' | 'GROOMER' | 'ADMIN'
  phone?: string | null
  address?: string | null
  dateOfBirth?: string | null
  isActive?: boolean
  lastLoginAt?: string | null
  createdAt: string
  updatedAt?: string
  groomerProfile?: {
    isActive: boolean
  } | null
  workAreas?: Array<{
    id: string
    name: string
    address: string | null
    centerLat: number
    centerLng: number
    radiusKm: number
    isActive: boolean
  }>
}

export interface UsersResponse {
  users: User[]
  totalCount: number
  totalPages: number
  currentPage: number
}

interface UseAdminUsersParams {
  page?: number
  searchQuery?: string
  roleFilter?: 'ALL' | 'CUSTOMER' | 'GROOMER' | 'ADMIN'
  statusFilter?: 'ALL' | 'ACTIVE' | 'INACTIVE'
  limit?: number
}

export function useAdminUsers({
  page = 1,
  searchQuery = '',
  roleFilter = 'ALL',
  statusFilter = 'ALL',
  limit = 20,
}: UseAdminUsersParams = {}) {
  const { data: session } = useSession()

  const queryKey = ['admin', 'users', { page, searchQuery, roleFilter, statusFilter, limit }]

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<UsersResponse>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: searchQuery,
        role: roleFilter,
        status: statusFilter,
      })

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Admin access required')
        }
        if (response.status === 403) {
          throw new Error('Forbidden: Insufficient permissions')
        }
        throw new Error(`Failed to fetch users: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    },
    enabled: !!session?.user && session.user.role === 'ADMIN',
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (
        error instanceof Error &&
        (error.message.includes('Unauthorized') || error.message.includes('Forbidden'))
      ) {
        return false
      }
      return failureCount < 2
    },
    refetchOnWindowFocus: false,
  })

  return {
    // Data
    users: data?.users || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 1,
    currentPage: data?.currentPage || page,

    // Loading states
    isLoading,
    isError,
    isRefetching,
    error,

    // Actions
    refetch,

    // Computed values
    hasNextPage: (data?.currentPage || 1) < (data?.totalPages || 1),
    hasPreviousPage: (data?.currentPage || 1) > 1,
    isEmpty: !isLoading && data?.users?.length === 0,
  }
}

// Hook for fetching a single user details
export function useAdminUserDetails(userId: string | null) {
  const { data: session } = useSession()

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<User>({
    queryKey: ['admin', 'users', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required')

      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found')
        }
        if (response.status === 401) {
          throw new Error('Unauthorized')
        }
        throw new Error(`Failed to fetch user details: ${response.statusText}`)
      }

      return response.json()
    },
    enabled: !!session?.user && session.user.role === 'ADMIN' && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error) => {
      if (
        error instanceof Error &&
        (error.message.includes('not found') || error.message.includes('Unauthorized'))
      ) {
        return false
      }
      return failureCount < 2
    },
  })

  return {
    user,
    isLoading,
    isError,
    error,
    refetch,
  }
}
