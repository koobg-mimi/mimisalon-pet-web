/**
 * PaymentStep Component Tests
 *
 * Tests for the payment step in the booking wizard
 */

import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { PaymentStep } from '../payment-step'
import bookingReducer from '../../state/booking-slice'
import { createMockOption, createMockPet, createMockService } from '../../__tests__/fixtures'

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock PaymentCard
vi.mock('@/components/card/payment-card', () => ({
  PaymentCard: ({ amount, orderName, orderId, onSuccess, onError }: any) => (
    <div data-testid="payment-card">
      <div>Amount: {amount}</div>
      <div>Order: {orderName}</div>
      <div>Payment ID: {orderId}</div>
      <button onClick={onSuccess}>Pay</button>
      <button onClick={() => onError('Payment failed')}>Fail</button>
    </div>
  ),
}))

describe('PaymentStep', () => {
  const mockPets = [
    createMockPet(),
    createMockPet({ id: 'pet2', name: 'Luna', breed: { id: 'breed2', name: 'Poodle' } as any }),
  ]

  const mockProfile = {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '010-1234-5678',
    role: 'CUSTOMER' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    image: null,
    emailVerified: new Date(),
    phoneNumberVerified: true,
    groomerProfile: null,
  } as any

  const defaultProps = {
    pets: mockPets,
    profile: mockProfile,
    totalAmount: 100000,
    orderName: '2마리 반려동물 미용서비스',
    onPaymentSuccess: vi.fn(),
    onPaymentError: vi.fn(),
  }

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

  it('should render payment information summary', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [
            {
              petId: 'pet1',
              services: [createMockService()],
              options: [],
            },
          ],
          addressId: 'addr1',
          groomerId: 'groomer1',
          date: '2024-12-25',
          timeSlot: '09:00',
          specialRequests: '',
        },
      },
    })

    render(<PaymentStep {...defaultProps} />, { wrapper })

    expect(screen.getByText('결제 정보')).toBeInTheDocument()
    expect(screen.getByText('총 결제금액')).toBeInTheDocument()
  })

  it('should display customer information', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    render(<PaymentStep {...defaultProps} />, { wrapper })

    expect(screen.getByText('예약자 정보')).toBeInTheDocument()
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('010-1234-5678')).toBeInTheDocument()
  })

  it('should show warning when phone number is missing', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    const profileWithoutPhone = { ...mockProfile, phoneNumber: null }

    render(<PaymentStep {...defaultProps} profile={profileWithoutPhone} />, { wrapper })

    expect(screen.getByText(/연락처가 등록되지 않았습니다/)).toBeInTheDocument()
    expect(screen.getByText('프로필 설정')).toBeInTheDocument()
  })

  it('should display pet services with prices', () => {
    const service = createMockService({ name: 'Full Grooming', price: 80000 })
    const option = createMockOption({ name: 'Nail Trim', price: 10000 })

    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [
            {
              petId: 'pet1',
              services: [service],
              options: [option],
            },
          ],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    render(<PaymentStep {...defaultProps} />, { wrapper })

    // Using regex to handle text split across multiple elements
    expect(screen.getByText(/Full Grooming/i)).toBeInTheDocument()
    expect(screen.getByText(/80,000/)).toBeInTheDocument()
    expect(screen.getByText(/Nail Trim/i)).toBeInTheDocument()
    expect(screen.getByText(/10,000/)).toBeInTheDocument()
  })

  it('should calculate and display total per pet', () => {
    const service1 = createMockService({ price: 50000 })
    const service2 = createMockService({ id: 'service2', price: 30000 })
    const option = createMockOption({ price: 20000 })

    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [
            {
              petId: 'pet1',
              services: [service1, service2],
              options: [option],
            },
          ],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    render(<PaymentStep {...defaultProps} />, { wrapper })

    // Total should be 50000 + 30000 + 20000 = 100000
    // Using getAllByText since the amount appears in both pet total and overall total
    const amounts = screen.getAllByText('100,000원')
    expect(amounts.length).toBeGreaterThan(0)
  })

  it('should show payment terms and conditions', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    render(<PaymentStep {...defaultProps} />, { wrapper })

    expect(screen.getByText('결제 전 확인사항')).toBeInTheDocument()
    expect(screen.getByText(/예약 변경 및 취소는 24시간 전까지 가능합니다/)).toBeInTheDocument()
    expect(screen.getByText(/당일 취소 시 50% 환불/)).toBeInTheDocument()
  })

  it('should render payment card when paymentId exists', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [
            {
              petId: 'pet1',
              services: [createMockService()],
              options: [],
            },
          ],
          addressId: 'addr1',
          groomerId: 'groomer1',
          date: '2024-12-25',
          timeSlot: '09:00',
          specialRequests: '',
        },
        paymentId: 'payment123',
        selectedBookingId: 'booking123',
      },
    })

    render(<PaymentStep {...defaultProps} />, { wrapper })

    expect(screen.getByTestId('payment-card')).toBeInTheDocument()
    expect(screen.getByText('Amount: 100000')).toBeInTheDocument()
    expect(screen.getByText('Order: 2마리 반려동물 미용서비스')).toBeInTheDocument()
    expect(screen.getByText('Payment ID: payment123')).toBeInTheDocument()
  })

  it('should not render payment card when paymentId is missing', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        },
        paymentId: null,
      },
    })

    render(<PaymentStep {...defaultProps} />, { wrapper })

    expect(screen.queryByTestId('payment-card')).not.toBeInTheDocument()
  })

  it('should display multiple pets with their services', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [
            {
              petId: 'pet1',
              services: [createMockService({ name: 'Bath', price: 30000 })],
              options: [],
            },
            {
              petId: 'pet2',
              services: [createMockService({ name: 'Haircut', price: 50000 })],
              options: [],
            },
          ],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    render(<PaymentStep {...defaultProps} />, { wrapper })

    // Text is split across multiple elements, use regex to find parts
    expect(screen.getByText(/Max/i)).toBeInTheDocument()
    expect(screen.getByText(/Luna/i)).toBeInTheDocument()
    expect(screen.getByText(/Poodle/i)).toBeInTheDocument()
    expect(screen.getByText(/Bath/i)).toBeInTheDocument()
    expect(screen.getByText(/Haircut/i)).toBeInTheDocument()
  })

  it('should show additional options section when options exist', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [
            {
              petId: 'pet1',
              services: [createMockService()],
              options: [createMockOption()],
            },
          ],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    render(<PaymentStep {...defaultProps} />, { wrapper })

    expect(screen.getByText('추가 옵션')).toBeInTheDocument()
  })

  it('should have readonly customer information fields', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    render(<PaymentStep {...defaultProps} />, { wrapper })

    const nameInput = screen.getByDisplayValue('John Doe') as HTMLInputElement
    const phoneInput = screen.getByDisplayValue('010-1234-5678') as HTMLInputElement

    expect(nameInput.readOnly).toBe(true)
    expect(phoneInput.readOnly).toBe(true)
  })

  it('should display formatted prices with commas', () => {
    const service = createMockService({ price: 123456 })

    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [
            {
              petId: 'pet1',
              services: [service],
              options: [],
            },
          ],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    render(<PaymentStep {...defaultProps} />, { wrapper })

    // Using getAllByText since the amount appears in both pet total and overall total
    const amounts = screen.getAllByText('123,456원')
    expect(amounts.length).toBeGreaterThan(0)
  })
})
