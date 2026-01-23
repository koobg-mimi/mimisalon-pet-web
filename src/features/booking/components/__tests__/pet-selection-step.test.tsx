/**
 * PetSelectionStep Component Tests
 *
 * Tests for the pet and service selection step in the booking wizard
 */

import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PetSelectionStep } from '../pet-selection-step'
import bookingReducer from '../../state/booking-slice'
import { createMockPet, createMockService } from '../../__tests__/fixtures'

// Mock fetch
global.fetch = vi.fn()

// Mock child components
vi.mock('@/components/booking/SelectablePetCard', () => ({
  SelectablePetCard: ({
    pet,
    isSelected,
    onToggleSelect,
  }: {
    pet: any
    isSelected: boolean
    onToggleSelect: (pet: any) => void
  }) => (
    <div
      data-testid={`pet-card-${pet.id}`}
      onClick={() => onToggleSelect(pet)}
      className={isSelected ? 'selected' : ''}
    >
      {pet.name}
    </div>
  ),
}))

vi.mock('@/components/booking/ServiceSelector', () => ({
  ServiceSelector: ({
    pet,
    onServiceChange,
    onClose,
  }: {
    pet: any
    onServiceChange: (services: any[]) => void
    onClose: () => void
  }) => (
    <div data-testid="service-selector">
      <button onClick={() => onServiceChange([createMockService()])}>Select Service</button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}))

vi.mock('@/components/booking/ServiceOptionSelector', () => ({
  ServiceOptionSelector: ({ petId, onOptionsChange }: any) => (
    <div data-testid={`option-selector-${petId}`}>
      <button onClick={() => onOptionsChange([])}>Select Options</button>
    </div>
  ),
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/components/ui/loading-spinner', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}))

describe('PetSelectionStep', () => {
  const mockPets = [createMockPet(), createMockPet({ id: 'pet2', name: 'Luna' })]

  const createWrapper = (preloadedState = {}) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
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
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>{children}</Provider>
      </QueryClientProvider>
    )
    Wrapper.displayName = 'TestWrapper'
    return Wrapper
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render pet cards', () => {
    const wrapper = createWrapper()
    render(<PetSelectionStep pets={mockPets} />, { wrapper })

    expect(screen.getByText('Max')).toBeInTheDocument()
    expect(screen.getByText('Luna')).toBeInTheDocument()
  })

  it('should toggle pet selection when pet card is clicked', async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<PetSelectionStep pets={mockPets} />, { wrapper })

    const petCard = screen.getByTestId('pet-card-pet1')
    await user.click(petCard)

    expect(petCard).toHaveClass('selected')
  })

  it('should show service editing section when pets are selected', async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<PetSelectionStep pets={mockPets} />, { wrapper })

    const petCard = screen.getByTestId('pet-card-pet1')
    await user.click(petCard)

    await waitFor(() => {
      expect(screen.getByText('선택된 반려동물 서비스')).toBeInTheDocument()
      expect(screen.getByText('Max의 서비스')).toBeInTheDocument()
    })
  })

  it('should show warning when pet is selected but no services chosen', async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<PetSelectionStep pets={mockPets} />, { wrapper })

    const petCard = screen.getByTestId('pet-card-pet1')
    await user.click(petCard)

    await waitFor(() => {
      expect(screen.getByText('서비스를 선택해주세요')).toBeInTheDocument()
      expect(
        screen.getByText(/예약을 계속하려면 최소 1개 이상의 서비스를 선택해야 합니다/)
      ).toBeInTheDocument()
    })
  })

  it('should show summary card when pets are selected', async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<PetSelectionStep pets={mockPets} />, { wrapper })

    const petCard = screen.getByTestId('pet-card-pet1')
    await user.click(petCard)

    await waitFor(() => {
      expect(screen.getByText('선택 요약')).toBeInTheDocument()
      expect(screen.getByText('반려동물')).toBeInTheDocument()
      expect(screen.getByText('서비스')).toBeInTheDocument()
      expect(screen.getByText('총 예상 금액')).toBeInTheDocument()
    })
  })

  it('should open service selection dialog when edit button is clicked', async () => {
    const user = userEvent.setup()
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [createMockService()],
    })

    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [
            {
              petId: 'pet1',
              services: [],
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

    render(<PetSelectionStep pets={mockPets} />, { wrapper })

    const editButton = screen.getByText('서비스 편집')
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByTestId('dialog')).toBeInTheDocument()
      expect(screen.getByText('서비스 선택')).toBeInTheDocument()
    })
  })

  it('should fetch services when pet is selected for editing', async () => {
    const user = userEvent.setup()
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [createMockService()],
    })
    global.fetch = mockFetch

    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [{ petId: 'pet1', services: [], options: [] }],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    render(<PetSelectionStep pets={mockPets} />, { wrapper })

    const editButton = screen.getByText('서비스 편집')
    await user.click(editButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/customer/services?petId=pet1')
    })
  })

  it('should show error when service fetch fails', async () => {
    const user = userEvent.setup()
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
    })

    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [{ petId: 'pet1', services: [], options: [] }],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    render(<PetSelectionStep pets={mockPets} />, { wrapper })

    const editButton = screen.getByText('서비스 편집')
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByText(/서비스 목록을 불러오는데 실패했습니다/)).toBeInTheDocument()
    })
  })

  it('should show loading state when fetching services', async () => {
    const user = userEvent.setup()
    ;(global.fetch as any).mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ ok: true, json: async () => [] }), 100))
    )

    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [{ petId: 'pet1', services: [], options: [] }],
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    render(<PetSelectionStep pets={mockPets} />, { wrapper })

    const editButton = screen.getByText('서비스 편집')
    await user.click(editButton)

    await waitFor(() => {
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      expect(screen.getByText('서비스를 불러오는 중...')).toBeInTheDocument()
    })
  })

  it('should display service count when services are selected', async () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [
            {
              petId: 'pet1',
              services: [createMockService(), createMockService({ id: 'service2' })],
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

    render(<PetSelectionStep pets={mockPets} />, { wrapper })

    expect(screen.getByText('2개 서비스 선택됨')).toBeInTheDocument()
  })

  it('should show service option selector when services are selected', async () => {
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
          addressId: '',
          groomerId: '',
          date: '',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    render(<PetSelectionStep pets={mockPets} />, { wrapper })

    expect(screen.getByTestId('option-selector-pet1')).toBeInTheDocument()
  })

  it('should handle multiple pets selection', async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    render(<PetSelectionStep pets={mockPets} />, { wrapper })

    const petCard1 = screen.getByTestId('pet-card-pet1')
    const petCard2 = screen.getByTestId('pet-card-pet2')

    await user.click(petCard1)
    await user.click(petCard2)

    await waitFor(() => {
      expect(screen.getByText('Max의 서비스')).toBeInTheDocument()
      expect(screen.getByText('Luna의 서비스')).toBeInTheDocument()
    })
  })
})
