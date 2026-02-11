import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useGeocodeAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (addressId: string) => {
      const response = await fetch(`/api/customer/addresses/${addressId}/geocode`, {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Failed to geocode address')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate address queries to refetch
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}
