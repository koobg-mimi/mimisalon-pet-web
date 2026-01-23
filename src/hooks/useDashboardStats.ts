'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from '@/lib/auth-client'
import { BookingStatus } from '@prisma/client'

interface DashboardStats {
  totalBookings: number
  completedBookings: number
  upcomingBookings: number
  totalSpent: number
  totalPets: number
  favoriteGroomer?: {
    name: string
    rating: number
  }
  recentBookings: Array<{
    id: string
    date: string
    service: {
      name: string
    }
    groomer: {
      name: string
    }
    status: BookingStatus
  }>
}

export function useDashboardStats() {
  const { data: session } = useSession()

  return useQuery<DashboardStats>({
    queryKey: ['customer', 'dashboard', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/customer/dashboard/stats')

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }

      return response.json()
    },
    enabled: !!session?.user && session.user.role === 'CUSTOMER',
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 60 * 1000, // Refresh every minute
  })
}
