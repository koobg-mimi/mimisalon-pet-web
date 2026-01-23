'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from '@/lib/auth-client'
import { UserResponse } from '@/app/api/auth/me/route'

// Main hook for profile management
export function useProfile() {
  const { data: session, isPending } = useSession()
  const queryClient = useQueryClient()

  // Query for fetching profile data from /api/auth/me
  const profileQuery = useQuery<UserResponse>({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      const response = await fetch('/api/auth/me')

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized')
        }
        throw new Error('Failed to fetch profile')
      }

      return response.json() // Auto-typed as MeResponse!
    },
    enabled: !!session?.user,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (error.message === 'Unauthorized') return false
      return failureCount < 2
    },
  })

  // Helper to check if profile is complete
  const isProfileComplete = () => {
    const profile = profileQuery.data
    if (!profile) return false

    const hasBasicInfo = !!(profile.name && profile.phoneNumber)
    const isPhoneVerified = profile.phoneNumberVerified

    if (profile.role === 'GROOMER') {
      const hasGroomerInfo = !!(
        profile.groomerProfile?.bankName && profile.groomerProfile?.bankAccountNumber
      )
      return hasBasicInfo && isPhoneVerified && hasGroomerInfo
    }

    return hasBasicInfo && isPhoneVerified
  }

  // Helper to get profile completion percentage
  const getProfileCompletionPercentage = () => {
    const profile = profileQuery.data
    if (!profile) return 0

    let completedFields = 0
    let totalFields = 5 // email, name, phone, phoneVerified, image

    if (profile.email) completedFields++
    if (profile.name) completedFields++
    if (profile.phoneNumber) completedFields++
    if (profile.phoneNumberVerified) completedFields++
    if (profile.image) completedFields++

    if (profile.role === 'GROOMER') {
      totalFields += 3 // Add groomer specific fields
      if (profile.groomerProfile?.bankName) completedFields++
      if (profile.groomerProfile?.bankAccountNumber) completedFields++
      if (profile.groomerProfile?.settlementCycle) completedFields++
    }

    return Math.round((completedFields / totalFields) * 100)
  }

  // Function to manually refetch profile data
  const refreshProfile = () => {
    return profileQuery.refetch()
  }

  // Function to invalidate profile cache (useful after updates from other components)
  const invalidateProfile = () => {
    return queryClient.invalidateQueries({ queryKey: ['profile', session?.user?.id] })
  }

  return {
    // Profile data
    profile: profileQuery.data,

    // Loading states
    isLoading: profileQuery.isLoading || isPending,
    isError: profileQuery.isError,
    error: profileQuery.error,

    // Helper functions
    isProfileComplete,
    getProfileCompletionPercentage,

    // Refetch functions
    refreshProfile,
    invalidateProfile,

    // Additional useful states
    isAuthenticated: !!session?.user,
    isCustomer: profileQuery.data?.role === 'CUSTOMER',
    isGroomer: profileQuery.data?.role === 'GROOMER',
    isAdmin: profileQuery.data?.role === 'ADMIN',
  }
}

// Hook for customer-specific profile operations
export function useCustomerProfile() {
  const profile = useProfile()

  return {
    ...profile,
    // Only return profile if user is a customer
    profile: profile.isCustomer ? profile.profile : undefined,
  }
}

// Hook for groomer-specific profile operations
export function useGroomerProfile() {
  const profile = useProfile()

  return {
    ...profile,
    // Only return profile if user is a groomer
    profile: profile.isGroomer ? profile.profile : undefined,
    groomerProfile: profile.profile?.groomerProfile,
  }
}
