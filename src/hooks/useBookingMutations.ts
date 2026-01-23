import { useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  BookingInitializeRequest,
  BookingInitializeResponse,
} from '@/app/api/bookings/initialize/route'
import type {
  InitializePaymentRequest,
  InitializePaymentResponse,
} from '@/app/api/payments/initialize/route'

interface SaveAddressData {
  street: string
  city: string
  state: string
  zipCode: string
  country?: string
}

export function useBookingMutations() {
  const queryClient = useQueryClient()

  // 새 주소 저장
  const saveAddressMutation = useMutation({
    mutationFn: async (addressData: SaveAddressData): Promise<{ id: string }> => {
      const response = await fetch('/api/customer/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...addressData,
          country: addressData.country || 'KR',
        }),
      })

      if (!response.ok) {
        throw new Error('주소 저장에 실패했습니다.')
      }

      return response.json()
    },
    onSuccess: () => {
      // 주소 목록 쿼리 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['customer', 'addresses'] })
    },
    onError: (error) => {
      console.error('Failed to save address:', error)
    },
  })

  // 예약 초기화
  const initializeBookingMutation = useMutation<
    BookingInitializeResponse,
    Error,
    BookingInitializeRequest
  >({
    mutationFn: async (bookingData) => {
      const response = await fetch('/api/bookings/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        const error = new Error(errorData.error || '예약 생성에 실패했습니다')
        ;(error as any).code = errorData.code
        throw error
      }

      return response.json()
    },
    onError: (error: any) => {
      console.error('Failed to initialize booking:', error)
    },
  })

  // 결제 초기화
  const initializePaymentMutation = useMutation<
    InitializePaymentResponse,
    Error,
    InitializePaymentRequest
  >({
    mutationFn: async (paymentData) => {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        throw new Error('결제 초기화에 실패했습니다')
      }

      return response.json()
    },
    onError: (error) => {
      console.error('Failed to initialize payment:', error)
    },
  })

  return {
    saveAddressMutation,
    initializeBookingMutation,
    initializePaymentMutation,
  }
}
