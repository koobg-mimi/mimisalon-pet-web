/**
 * Booking Redux Slice Tests
 *
 * Comprehensive tests for booking state management
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import bookingReducer, {
  cancelBooking,
  goToStep,
  initializeBooking,
  initializePayment,
  nextStep,
  prevStep,
  resetForm,
  setPaymentId,
  togglePet,
  updateAddress,
  updateDate,
  updateGroomer,
  updateGroomerPage,
  updateOptions,
  updateServices,
  updateSpecialRequests,
  updateTimeSlot,
} from '../booking-slice'
import { mockOption, mockPet, mockService } from '../../__tests__/fixtures'
import type { Pet } from '@/hooks/usePets'

// Mock fetch globally
global.fetch = vi.fn()

// Helper type for store state
type RootState = {
  booking: ReturnType<typeof bookingReducer>
}

describe('booking-slice', () => {
  let store: ReturnType<typeof configureStore<RootState>>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        booking: bookingReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false, // Disable for tests to allow Date objects
        }),
    })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = (store.getState() as RootState).booking
      expect(state).toEqual({
        selectedBookingId: null,
        filters: { status: 'all' },
        isLoading: false,
        error: null,
        isCreating: false,
        isInitializingPayment: false,
        formData: {
          petServices: [],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        },
        currentStep: 1,
        paymentId: null,
        currentGroomerPage: 1,
      })
    })
  })

  describe('Pet Selection Actions', () => {
    it('should add pet when toggled', () => {
      store.dispatch(togglePet(mockPet))
      const state = (store.getState() as RootState).booking

      expect(state.formData.petServices).toHaveLength(1)
      expect(state.formData.petServices[0]).toEqual({
        petId: 'pet1',
        services: [],
        options: [],
      })
    })

    it('should remove pet when toggled again', () => {
      store.dispatch(togglePet(mockPet))
      store.dispatch(togglePet(mockPet))
      const state = (store.getState() as RootState).booking

      expect(state.formData.petServices).toHaveLength(0)
    })

    it('should handle multiple pets', () => {
      const mockPet2: Pet = { ...mockPet, id: 'pet2', name: 'Luna' }

      store.dispatch(togglePet(mockPet))
      store.dispatch(togglePet(mockPet2))
      const state = (store.getState() as RootState).booking

      expect(state.formData.petServices).toHaveLength(2)
      expect(state.formData.petServices[0].petId).toBe('pet1')
      expect(state.formData.petServices[1].petId).toBe('pet2')
    })
  })

  describe('Service and Option Actions', () => {
    beforeEach(() => {
      store.dispatch(togglePet(mockPet))
    })

    it('should update services for a pet', () => {
      store.dispatch(
        updateServices({
          petId: 'pet1',
          services: [mockService],
        })
      )
      const state = (store.getState() as RootState).booking

      expect(state.formData.petServices[0].services).toHaveLength(1)
      expect(state.formData.petServices[0].services[0]).toEqual(mockService)
    })

    it('should update options for a pet', () => {
      store.dispatch(
        updateOptions({
          petId: 'pet1',
          options: [mockOption],
        })
      )
      const state = (store.getState() as RootState).booking

      expect(state.formData.petServices[0].options).toHaveLength(1)
      expect(state.formData.petServices[0].options[0]).toEqual(mockOption)
    })

    it('should not update services for non-existent pet', () => {
      store.dispatch(
        updateServices({
          petId: 'nonexistent',
          services: [mockService],
        })
      )
      const state = (store.getState() as RootState).booking

      expect(state.formData.petServices[0].services).toHaveLength(0)
    })
  })

  describe('Address Selection', () => {
    it('should update address', () => {
      store.dispatch(updateAddress('address1'))
      const state = (store.getState() as RootState).booking

      expect(state.formData.addressId).toBe('address1')
    })

    it('should allow changing address', () => {
      store.dispatch(updateAddress('address1'))
      store.dispatch(updateAddress('address2'))
      const state = (store.getState() as RootState).booking

      expect(state.formData.addressId).toBe('address2')
    })
  })

  describe('Date, Groomer, and Time Selection', () => {
    it('should update date and reset time and groomer', () => {
      store.dispatch(updateTimeSlot('10:00'))
      store.dispatch(updateGroomer('groomer1'))
      store.dispatch(updateDate('2024-01-15'))

      const state = (store.getState() as RootState).booking
      expect(state.formData.date).toBe('2024-01-15')
      expect(state.formData.timeSlot).toBe('')
      expect(state.formData.groomerId).toBe('')
    })

    it('should update groomer and reset time', () => {
      store.dispatch(updateTimeSlot('10:00'))
      store.dispatch(updateGroomer('groomer1'))

      const state = (store.getState() as RootState).booking
      expect(state.formData.groomerId).toBe('groomer1')
      expect(state.formData.timeSlot).toBe('')
    })

    it('should update time slot', () => {
      store.dispatch(updateTimeSlot('10:00'))
      const state = (store.getState() as RootState).booking

      expect(state.formData.timeSlot).toBe('10:00')
    })

    it('should update special requests', () => {
      store.dispatch(updateSpecialRequests('Please be gentle'))
      const state = (store.getState() as RootState).booking

      expect(state.formData.specialRequests).toBe('Please be gentle')
    })
  })

  describe('Step Navigation', () => {
    it('should move to next step', () => {
      store.dispatch(nextStep())
      let state = (store.getState() as RootState).booking
      expect(state.currentStep).toBe(2)

      store.dispatch(nextStep())
      state = (store.getState() as RootState).booking
      expect(state.currentStep).toBe(3)
    })

    it('should not go beyond step 4', () => {
      store.dispatch(goToStep(4))
      store.dispatch(nextStep())
      const state = (store.getState() as RootState).booking

      expect(state.currentStep).toBe(4)
    })

    it('should move to previous step', () => {
      store.dispatch(goToStep(3))
      store.dispatch(prevStep())
      const state = (store.getState() as RootState).booking

      expect(state.currentStep).toBe(2)
    })

    it('should not go below step 1', () => {
      store.dispatch(prevStep())
      const state = (store.getState() as RootState).booking

      expect(state.currentStep).toBe(1)
    })

    it('should jump to specific step', () => {
      store.dispatch(goToStep(3))
      const state = (store.getState() as RootState).booking

      expect(state.currentStep).toBe(3)
    })
  })

  describe('Form Reset', () => {
    it('should reset form to initial state', () => {
      store.dispatch(togglePet(mockPet))
      store.dispatch(updateAddress('address1'))
      store.dispatch(updateDate('2024-01-15'))
      store.dispatch(goToStep(3))
      store.dispatch(updateGroomerPage(2))
      store.dispatch(setPaymentId('payment123'))

      store.dispatch(resetForm())
      const state = (store.getState() as RootState).booking

      expect(state.formData).toEqual({
        petServices: [],
        addressId: '',
        groomerId: '',
        date: '',
        timeSlot: '',
        specialRequests: '',
      })
      expect(state.currentStep).toBe(1)
      expect(state.paymentId).toBeNull()
      expect(state.currentGroomerPage).toBe(1)
    })
  })

  describe('Groomer Page Management', () => {
    it('should update groomer page', () => {
      store.dispatch(updateGroomerPage(3))
      const state = (store.getState() as RootState).booking

      expect(state.currentGroomerPage).toBe(3)
    })
  })

  describe('Payment ID Management', () => {
    it('should set payment ID', () => {
      store.dispatch(setPaymentId('payment123'))
      const state = (store.getState() as RootState).booking

      expect(state.paymentId).toBe('payment123')
    })
  })

  describe('Async Thunks', () => {
    describe('initializeBooking', () => {
      it('should handle successful booking initialization', async () => {
        const mockResponse = {
          bookingId: 'booking123',
          isExisting: false,
          status: 'FIRST_PAYMENT_PENDING',
        }

        ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response)

        await store.dispatch(
          initializeBooking({
            idempotencyKey: 'key123',
            petServices: [
              {
                petId: 'pet1',
                services: [
                  {
                    id: 'service1',
                    name: 'Basic Grooming',
                    price: 50000,
                    duration: 60,
                  },
                ],
                options: [],
              },
            ],
            addressId: 'address1',
            groomerId: 'groomer1',
            date: '2024-01-15',
            timeSlot: '10:00',
          })
        )

        const state = (store.getState() as RootState).booking
        expect(state.isCreating).toBe(false)
        expect(state.selectedBookingId).toBe('booking123')
        expect(state.error).toBeNull()
      })

      it('should handle booking initialization failure', async () => {
        const mockError = { message: 'Booking failed' }

        ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
          ok: false,
          json: async () => mockError,
        } as Response)

        await store.dispatch(
          initializeBooking({
            idempotencyKey: 'key123',
            petServices: [
              {
                petId: 'pet1',
                services: [
                  {
                    id: 'service1',
                    name: 'Basic Grooming',
                    price: 50000,
                    duration: 60,
                  },
                ],
                options: [],
              },
            ],
            addressId: 'address1',
            groomerId: 'groomer1',
            date: '2024-01-15',
            timeSlot: '10:00',
          })
        )

        const state = (store.getState() as RootState).booking
        expect(state.isCreating).toBe(false)
        expect(state.error).toBe('Booking failed')
      })

      it('should set isCreating during pending state', async () => {
        let resolvePromise: (value: any) => void
        const promise = new Promise((resolve) => {
          resolvePromise = resolve
        })

        ;(global.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(
          promise as Promise<Response>
        )

        const action = store.dispatch(
          initializeBooking({
            idempotencyKey: 'key123',
            petServices: [
              {
                petId: 'pet1',
                services: [
                  {
                    id: 'service1',
                    name: 'Basic Grooming',
                    price: 50000,
                    duration: 60,
                  },
                ],
                options: [],
              },
            ],
            addressId: 'address1',
            groomerId: 'groomer1',
            date: '2024-01-15',
            timeSlot: '10:00',
          })
        )

        let state = (store.getState() as RootState).booking
        expect(state.isCreating).toBe(true)

        resolvePromise!({
          ok: true,
          json: async () => ({
            bookingId: 'booking123',
            isExisting: false,
            status: 'FIRST_PAYMENT_PENDING',
          }),
        })

        await action

        state = (store.getState() as RootState).booking
        expect(state.isCreating).toBe(false)
      })
    })

    describe('initializePayment', () => {
      it('should handle successful payment initialization', async () => {
        const mockResponse = {
          paymentId: 'payment123',
          portonePaymentId: 'portone123',
        }

        ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response)

        await store.dispatch(
          initializePayment({
            bookingId: 'booking123',
            amount: 50000,
            orderName: 'Max 미용서비스',
          })
        )

        const state = (store.getState() as RootState).booking
        expect(state.isInitializingPayment).toBe(false)
        expect(state.paymentId).toBe('payment123')
        expect(state.error).toBeNull()
      })

      it('should handle payment initialization failure', async () => {
        const mockError = { message: 'Payment initialization failed' }

        ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
          ok: false,
          json: async () => mockError,
        } as Response)

        await store.dispatch(
          initializePayment({
            bookingId: 'booking123',
            amount: 50000,
            orderName: 'Max 미용서비스',
          })
        )

        const state = (store.getState() as RootState).booking
        expect(state.isInitializingPayment).toBe(false)
        expect(state.error).toBe('Payment initialization failed')
      })
    })

    describe('cancelBooking', () => {
      it('should handle successful booking cancellation', async () => {
        store.dispatch({ type: 'booking/selectBooking', payload: 'booking123' })
        ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        } as Response)

        await store.dispatch(
          cancelBooking({
            bookingId: 'booking123',
            reason: 'Changed plans',
          })
        )

        const state = (store.getState() as RootState).booking
        expect(state.isLoading).toBe(false)
        expect(state.selectedBookingId).toBeNull()
        expect(state.error).toBeNull()
      })

      it('should handle booking cancellation failure', async () => {
        const mockError = { message: 'Cancellation failed' }

        ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
          ok: false,
          json: async () => mockError,
        } as Response)

        await store.dispatch(
          cancelBooking({
            bookingId: 'booking123',
            reason: 'Changed plans',
          })
        )

        const state = (store.getState() as RootState).booking
        expect(state.isLoading).toBe(false)
        expect(state.error).toBe('Cancellation failed')
      })
    })
  })

  describe('Complex Scenarios', () => {
    it('should handle complete booking flow', () => {
      // Step 1: Select pet and services
      store.dispatch(togglePet(mockPet))
      store.dispatch(
        updateServices({
          petId: 'pet1',
          services: [mockService],
        })
      )
      store.dispatch(
        updateOptions({
          petId: 'pet1',
          options: [mockOption],
        })
      )
      store.dispatch(nextStep())

      // Step 2: Select address
      store.dispatch(updateAddress('address1'))
      store.dispatch(nextStep())

      // Step 3: Select date, groomer, time
      store.dispatch(updateDate('2024-01-15'))
      store.dispatch(updateGroomer('groomer1'))
      store.dispatch(updateTimeSlot('10:00'))
      store.dispatch(updateSpecialRequests('Please be gentle with Max'))
      store.dispatch(nextStep())

      const state = (store.getState() as RootState).booking
      expect(state.currentStep).toBe(4)
      expect(state.formData.petServices).toHaveLength(1)
      expect(state.formData.petServices[0].services).toHaveLength(1)
      expect(state.formData.petServices[0].options).toHaveLength(1)
      expect(state.formData.addressId).toBe('address1')
      expect(state.formData.date).toBe('2024-01-15')
      expect(state.formData.groomerId).toBe('groomer1')
      expect(state.formData.timeSlot).toBe('10:00')
      expect(state.formData.specialRequests).toBe('Please be gentle with Max')
    })

    it('should handle date change resetting groomer and time', () => {
      store.dispatch(updateDate('2024-01-15'))
      store.dispatch(updateGroomer('groomer1'))
      store.dispatch(updateTimeSlot('10:00'))

      let state = (store.getState() as RootState).booking
      expect(state.formData.date).toBe('2024-01-15')
      expect(state.formData.groomerId).toBe('groomer1')
      expect(state.formData.timeSlot).toBe('10:00')

      store.dispatch(updateDate('2024-01-16'))

      state = (store.getState() as RootState).booking
      expect(state.formData.date).toBe('2024-01-16')
      expect(state.formData.groomerId).toBe('')
      expect(state.formData.timeSlot).toBe('')
    })

    it('should handle groomer change resetting time only', () => {
      store.dispatch(updateGroomer('groomer1'))
      store.dispatch(updateTimeSlot('10:00'))

      let state = (store.getState() as RootState).booking
      expect(state.formData.groomerId).toBe('groomer1')
      expect(state.formData.timeSlot).toBe('10:00')

      store.dispatch(updateGroomer('groomer2'))

      state = (store.getState() as RootState).booking
      expect(state.formData.groomerId).toBe('groomer2')
      expect(state.formData.timeSlot).toBe('')
    })
  })
})
