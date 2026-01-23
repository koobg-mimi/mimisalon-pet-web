/**
 * useBookingSteps Hook Tests
 *
 * Tests for booking step navigation hook
 */

import React from 'react'
import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { useBookingSteps } from '../use-booking-steps'
import bookingReducer from '../../state/booking-slice'

describe('useBookingSteps', () => {
  const createWrapper = () => {
    const store = configureStore({
      reducer: {
        booking: bookingReducer,
      },
    })

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    )
    Wrapper.displayName = 'TestWrapper'
    return Wrapper
  }

  it('should start at step 1', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingSteps(), { wrapper })

    expect(result.current.currentStep).toBe(1)
  })

  it('should move to next step', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingSteps(), { wrapper })

    act(() => {
      result.current.handleNextStep()
    })

    expect(result.current.currentStep).toBe(2)

    act(() => {
      result.current.handleNextStep()
    })

    expect(result.current.currentStep).toBe(3)

    act(() => {
      result.current.handleNextStep()
    })

    expect(result.current.currentStep).toBe(4)
  })

  it('should not go beyond step 4', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingSteps(), { wrapper })

    // Move to step 4
    act(() => {
      result.current.handleNextStep()
      result.current.handleNextStep()
      result.current.handleNextStep()
    })

    expect(result.current.currentStep).toBe(4)

    // Try to go beyond step 4
    act(() => {
      result.current.handleNextStep()
    })

    expect(result.current.currentStep).toBe(4)
  })

  it('should move to previous step', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingSteps(), { wrapper })

    // Move to step 3
    act(() => {
      result.current.handleNextStep()
      result.current.handleNextStep()
    })

    expect(result.current.currentStep).toBe(3)

    // Go back
    act(() => {
      result.current.handlePrevStep()
    })

    expect(result.current.currentStep).toBe(2)

    act(() => {
      result.current.handlePrevStep()
    })

    expect(result.current.currentStep).toBe(1)
  })

  it('should not go below step 1', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingSteps(), { wrapper })

    expect(result.current.currentStep).toBe(1)

    act(() => {
      result.current.handlePrevStep()
    })

    expect(result.current.currentStep).toBe(1)
  })

  it('should navigate back and forth', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingSteps(), { wrapper })

    act(() => {
      result.current.handleNextStep()
      result.current.handleNextStep()
    })

    expect(result.current.currentStep).toBe(3)

    act(() => {
      result.current.handlePrevStep()
    })

    expect(result.current.currentStep).toBe(2)

    act(() => {
      result.current.handleNextStep()
      result.current.handleNextStep()
    })

    expect(result.current.currentStep).toBe(4)
  })

  it('should handle rapid navigation', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useBookingSteps(), { wrapper })

    act(() => {
      // Rapid forward
      result.current.handleNextStep()
      result.current.handleNextStep()
      result.current.handleNextStep()
      result.current.handleNextStep()
      result.current.handleNextStep() // Should stay at 4
    })

    expect(result.current.currentStep).toBe(4)

    act(() => {
      // Rapid backward
      result.current.handlePrevStep()
      result.current.handlePrevStep()
      result.current.handlePrevStep()
      result.current.handlePrevStep()
      result.current.handlePrevStep() // Should stay at 1
    })

    expect(result.current.currentStep).toBe(1)
  })
})
