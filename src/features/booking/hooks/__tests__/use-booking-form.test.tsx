/**
 * useBookingForm Hook Tests
 *
 * Tests for the Redux-based booking form hook
 */

import React from 'react'
import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { useBookingForm } from '../use-booking-form'
import bookingReducer from '../../state/booking-slice'
import { mockOption, mockPet, mockService } from '../../__tests__/fixtures'
import type { Pet } from '@/hooks/usePets'
import type { ServiceData } from '@/data/services'

describe('useBookingForm', () => {
  const createWrapper = () => {
    const store = configureStore({
      reducer: {
        booking: bookingReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    })

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    )
    Wrapper.displayName = 'TestWrapper'
    return Wrapper
  }

  it('should provide initial form data', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingForm(), { wrapper })

    expect(result.current.formData).toEqual({
      petServices: [],
      addressId: '',
      groomerId: '',
      date: '',
      timeSlot: '',
      specialRequests: '',
    })
  })

  it('should toggle pet selection', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingForm(), { wrapper })

    act(() => {
      result.current.handlePetToggle(mockPet)
    })

    expect(result.current.formData.petServices).toHaveLength(1)
    expect(result.current.formData.petServices[0].petId).toBe('pet1')

    act(() => {
      result.current.handlePetToggle(mockPet)
    })

    expect(result.current.formData.petServices).toHaveLength(0)
  })

  it('should update services for a pet', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingForm(), { wrapper })

    act(() => {
      result.current.handlePetToggle(mockPet)
    })

    act(() => {
      result.current.handleServiceChange('pet1', [mockService])
    })

    expect(result.current.formData.petServices[0].services).toHaveLength(1)
    expect(result.current.formData.petServices[0].services[0]).toEqual(mockService)
  })

  it('should update options for a pet', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingForm(), { wrapper })

    act(() => {
      result.current.handlePetToggle(mockPet)
    })

    act(() => {
      result.current.handleOptionsChange('pet1', [mockOption])
    })

    expect(result.current.formData.petServices[0].options).toHaveLength(1)
    expect(result.current.formData.petServices[0].options[0]).toEqual(mockOption)
  })

  it('should update address', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingForm(), { wrapper })

    act(() => {
      result.current.handleAddressChange('address1')
    })

    expect(result.current.formData.addressId).toBe('address1')
  })

  it('should update date and reset time/groomer', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingForm(), { wrapper })

    act(() => {
      result.current.handleDateChange('2024-01-15')
      result.current.handleGroomerChange('groomer1')
      result.current.handleTimeSlotChange('10:00')
    })

    expect(result.current.formData.date).toBe('2024-01-15')
    expect(result.current.formData.groomerId).toBe('groomer1')
    expect(result.current.formData.timeSlot).toBe('10:00')

    act(() => {
      result.current.handleDateChange('2024-01-16')
    })

    expect(result.current.formData.date).toBe('2024-01-16')
    expect(result.current.formData.groomerId).toBe('')
    expect(result.current.formData.timeSlot).toBe('')
  })

  it('should update groomer and reset time', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingForm(), { wrapper })

    act(() => {
      result.current.handleGroomerChange('groomer1')
      result.current.handleTimeSlotChange('10:00')
    })

    expect(result.current.formData.groomerId).toBe('groomer1')
    expect(result.current.formData.timeSlot).toBe('10:00')

    act(() => {
      result.current.handleGroomerChange('groomer2')
    })

    expect(result.current.formData.groomerId).toBe('groomer2')
    expect(result.current.formData.timeSlot).toBe('')
  })

  it('should update time slot', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingForm(), { wrapper })

    act(() => {
      result.current.handleTimeSlotChange('14:00')
    })

    expect(result.current.formData.timeSlot).toBe('14:00')
  })

  it('should update special requests', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingForm(), { wrapper })

    act(() => {
      result.current.handleSpecialRequestsChange('Please be gentle')
    })

    expect(result.current.formData.specialRequests).toBe('Please be gentle')
  })

  it('should reset form', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingForm(), { wrapper })

    act(() => {
      result.current.handlePetToggle(mockPet)
      result.current.handleAddressChange('address1')
      result.current.handleDateChange('2024-01-15')
    })

    expect(result.current.formData.petServices).toHaveLength(1)
    expect(result.current.formData.addressId).toBe('address1')
    expect(result.current.formData.date).toBe('2024-01-15')

    act(() => {
      result.current.resetForm()
    })

    expect(result.current.formData).toEqual({
      petServices: [],
      addressId: '',
      groomerId: '',
      date: '',
      timeSlot: '',
      specialRequests: '',
    })
  })

  it('should handle multiple pets with different services', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingForm(), { wrapper })

    const mockPet2: Pet = { ...mockPet, id: 'pet2', name: 'Luna' }
    const mockService2: ServiceData = { ...mockService, id: 'service2', name: 'Bath' }

    act(() => {
      result.current.handlePetToggle(mockPet)
      result.current.handlePetToggle(mockPet2)
    })

    act(() => {
      result.current.handleServiceChange('pet1', [mockService])
      result.current.handleServiceChange('pet2', [mockService2])
    })

    expect(result.current.formData.petServices).toHaveLength(2)
    expect(result.current.formData.petServices[0].services[0].name).toBe('Basic Grooming')
    expect(result.current.formData.petServices[1].services[0].name).toBe('Bath')
  })
})
