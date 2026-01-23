/**
 * Booking Data Hook (RTK Query version)
 *
 * Replaces TanStack Query with RTK Query for data fetching
 */

import {
  useGetAddressesQuery,
  useGetAvailabilityQuery,
  useGetPetsQuery,
} from '@/features/booking/api/booking-query-api'

interface UseBookingDataProps {
  date?: string
  addressId?: string
  currentPage?: number
  enabled?: boolean
}

export function useBookingData({
  date,
  addressId,
  currentPage = 1,
  enabled = true,
}: UseBookingDataProps = {}) {
  // Fetch pets
  const {
    data: pets = [],
    isLoading: isPetsLoading,
    error: petsError,
  } = useGetPetsQuery(undefined, {
    skip: !enabled,
  })

  // Fetch addresses
  const {
    data: savedAddresses = [],
    isLoading: isAddressesLoading,
    error: addressesError,
  } = useGetAddressesQuery(undefined, {
    skip: !enabled,
  })

  // Fetch availability (groomers and time slots)
  const {
    data: availabilityData,
    isLoading: isLoadingGroomers,
    error: availabilityError,
    refetch: refetchAvailability,
  } = useGetAvailabilityQuery(
    {
      date,
      addressId,
      page: currentPage,
      limit: 6,
    },
    {
      skip: !enabled || !date || !addressId,
      // Poll every 5 seconds when the query is active
      pollingInterval: 5000,
    }
  )

  // Extract availability data with fallbacks
  const timeSlots = availabilityData?.timeSlots || []
  const groomers = availabilityData?.groomers || []
  const groomerPagination = availabilityData?.pagination
  const filteringInfo = availabilityData?.filteringInfo

  const isInitialLoading = isPetsLoading || isAddressesLoading
  const hasError = !!petsError || !!addressesError || !!availabilityError

  return {
    // Data
    pets,
    savedAddresses,
    timeSlots,
    groomers,
    groomerPagination,
    filteringInfo,

    // Loading states
    isPetsLoading,
    isAddressesLoading,
    isLoadingGroomers,
    isInitialLoading,

    // Errors
    petsError,
    addressesError,
    availabilityError,
    hasError,

    // Actions
    refetchAvailability,
  }
}
