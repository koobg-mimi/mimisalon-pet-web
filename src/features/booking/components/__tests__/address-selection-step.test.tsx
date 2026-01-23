/**
 * AddressSelectionStep Component Tests
 *
 * Tests for the address selection step in the booking wizard
 */

import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { AddressSelectionStep } from '../address-selection-step'
import bookingReducer from '../../state/booking-slice'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('AddressSelectionStep', () => {
  const mockAddresses = [
    {
      id: 'addr1',
      city: 'Seoul',
      state: 'Gangnam',
      street: '123 Test St',
      zipCode: '12345',
      isDefault: true,
    },
    {
      id: 'addr2',
      city: 'Seoul',
      state: 'Seocho',
      street: '456 Demo Ave',
      zipCode: '67890',
      isDefault: false,
    },
  ]

  const createWrapper = (preloadedState = {}) => {
    const store = configureStore({
      reducer: {
        booking: bookingReducer,
      },
      preloadedState,
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

  it('should render address list when addresses are provided', () => {
    const wrapper = createWrapper()
    render(<AddressSelectionStep savedAddresses={mockAddresses} />, { wrapper })

    expect(screen.getByText('서비스 주소')).toBeInTheDocument()
    expect(screen.getByText(/Seoul Gangnam 123 Test St/)).toBeInTheDocument()
    expect(screen.getByText(/Seoul Seocho 456 Demo Ave/)).toBeInTheDocument()
  })

  it('should show default address badge', () => {
    const wrapper = createWrapper()
    render(<AddressSelectionStep savedAddresses={mockAddresses} />, { wrapper })

    expect(screen.getByText('기본 주소')).toBeInTheDocument()
  })

  it('should show empty state when no addresses provided', () => {
    const wrapper = createWrapper()
    render(<AddressSelectionStep savedAddresses={[]} />, { wrapper })

    expect(screen.getByText('등록된 주소가 없습니다')).toBeInTheDocument()
    expect(
      screen.getByText(/예약을 계속하려면 프로필에서 주소를 먼저 등록해주세요/)
    ).toBeInTheDocument()
    expect(screen.getByText('주소 등록하러 가기')).toBeInTheDocument()
  })

  it('should highlight selected address', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: 'addr1',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })
    render(<AddressSelectionStep savedAddresses={mockAddresses} />, { wrapper })

    // Check the main address list (not the confirmation card)
    const addresses = screen.getAllByText(/Seoul Gangnam 123 Test St/)
    const addressContainer = addresses[0].closest('.cursor-pointer')
    expect(addressContainer).toHaveClass('border-primary')
  })

  it('should dispatch updateAddress when address is clicked', async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<AddressSelectionStep savedAddresses={mockAddresses} />, { wrapper })

    const address = screen.getByText(/Seoul Seocho 456 Demo Ave/)
    const addressContainer = address.closest('.cursor-pointer')
    await user.click(addressContainer!)

    // Address should now be highlighted (Redux state updated)
    expect(addressContainer).toHaveClass('border-primary')
  })

  it('should show selected address confirmation card when address is selected', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: 'addr1',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })
    render(<AddressSelectionStep savedAddresses={mockAddresses} />, { wrapper })

    expect(screen.getByText('선택된 주소')).toBeInTheDocument()
    const confirmationCards = screen.getAllByText(/Seoul Gangnam 123 Test St/)
    expect(confirmationCards.length).toBeGreaterThan(1) // Appears in both list and confirmation
  })

  it('should not show confirmation card when no address is selected', () => {
    const wrapper = createWrapper()
    render(<AddressSelectionStep savedAddresses={mockAddresses} />, { wrapper })

    expect(screen.queryByText('선택된 주소')).not.toBeInTheDocument()
  })

  it('should display zipCode when provided', () => {
    const wrapper = createWrapper()
    render(<AddressSelectionStep savedAddresses={mockAddresses} />, { wrapper })

    expect(screen.getByText('(12345)')).toBeInTheDocument()
    expect(screen.getByText('(67890)')).toBeInTheDocument()
  })

  it('should show add new address button when addresses exist', () => {
    const wrapper = createWrapper()
    render(<AddressSelectionStep savedAddresses={mockAddresses} />, { wrapper })

    expect(screen.getByText('새 주소 추가하기')).toBeInTheDocument()
  })

  it('should handle addresses without zipCode gracefully', () => {
    const addressesWithoutZip = [
      {
        id: 'addr3',
        city: 'Busan',
        state: 'Haeundae',
        street: '789 Beach Rd',
        isDefault: false,
      },
    ]

    const wrapper = createWrapper()
    render(<AddressSelectionStep savedAddresses={addressesWithoutZip} />, { wrapper })

    expect(screen.getByText(/Busan Haeundae 789 Beach Rd/)).toBeInTheDocument()
    expect(screen.queryByText(/\(/)).not.toBeInTheDocument() // No zipCode parentheses
  })

  it('should allow toggling between addresses', async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<AddressSelectionStep savedAddresses={mockAddresses} />, { wrapper })

    // Click first address
    const firstAddress = screen.getAllByText(/Seoul Gangnam 123 Test St/)[0]
    const firstContainer = firstAddress.closest('.cursor-pointer')
    await user.click(firstContainer!)

    expect(firstContainer).toHaveClass('border-primary')

    // Click second address
    const secondAddress = screen.getByText(/Seoul Seocho 456 Demo Ave/)
    const secondContainer = secondAddress.closest('.cursor-pointer')
    await user.click(secondContainer!)

    expect(secondContainer).toHaveClass('border-primary')

    // First should no longer be selected
    expect(firstContainer).not.toHaveClass('border-primary')
  })
})
