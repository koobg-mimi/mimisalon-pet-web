/**
 * DateTimeGroomerStep Component Tests
 *
 * Tests for the date, time, and groomer selection step in the booking wizard
 */

import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { DateTimeGroomerStep } from '../datetime-groomer-step'
import bookingReducer from '../../state/booking-slice'

// Mock child components
vi.mock('@/components/ui/calendar', () => ({
  Calendar: ({ selected, onSelect, disabled }: any) => (
    <div data-testid="calendar">
      <button onClick={() => onSelect(new Date('2024-12-25'))}>Select Date</button>
      {selected && <div>Selected: {selected.toISOString()}</div>}
    </div>
  ),
}))

vi.mock('@/components/booking/GroomerCard', () => ({
  GroomerCard: ({
    groomer,
    isSelected,
    onSelect,
  }: {
    groomer: any
    isSelected: boolean
    onSelect: (id: string) => void
  }) => (
    <div
      data-testid={`groomer-card-${groomer.id}`}
      className={isSelected ? 'selected' : ''}
      onClick={() => onSelect(groomer.id)}
    >
      {groomer.name}
    </div>
  ),
}))

vi.mock('@/components/booking/TimeSlotPicker', () => ({
  TimeSlotPicker: ({ groomerName, timeSlots, selectedTime, onTimeSelect }: any) => (
    <div data-testid="time-slot-picker">
      <div>Groomer: {groomerName}</div>
      {timeSlots.map((slot: any) => (
        <button
          key={slot.time}
          onClick={() => onTimeSelect(slot.time)}
          disabled={!slot.available}
          className={selectedTime === slot.time ? 'selected' : ''}
        >
          {slot.time}
        </button>
      ))}
    </div>
  ),
}))

vi.mock('@/components/ui/loading-spinner', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}))

describe('DateTimeGroomerStep', () => {
  const mockGroomers = [
    {
      id: 'groomer1',
      name: 'John Doe',
      schedule: {
        workingHoursStart: '09:00',
        workingHoursEnd: '18:00',
        workingDays: [0, 1, 2, 3, 4, 5, 6],
        slotDurationMinutes: 30,
      },
    },
    {
      id: 'groomer2',
      name: 'Jane Smith',
      schedule: {
        workingHoursStart: '10:00',
        workingHoursEnd: '19:00',
        workingDays: [0, 1, 2, 3, 4, 5, 6],
        slotDurationMinutes: 30,
      },
    },
  ] as any

  const mockTimeSlots = [
    { time: '09:00', available: true, isBooked: false, groomerId: 'groomer1' },
    { time: '10:00', available: true, isBooked: false, groomerId: 'groomer1' },
    { time: '11:00', available: false, isBooked: true, groomerId: 'groomer1' },
    { time: '09:00', available: true, isBooked: false, groomerId: 'groomer2' },
  ]

  const defaultProps = {
    estimatedDuration: 60,
    groomers: mockGroomers,
    isLoadingGroomers: false,
    availableTimeSlots: mockTimeSlots,
    onDateChange: vi.fn(),
    onGroomerSelect: vi.fn(),
    onTimeSelect: vi.fn(),
    onGroomerPageChange: vi.fn(),
    onSpecialRequestsChange: vi.fn(),
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

  it('should render calendar', () => {
    const wrapper = createWrapper()
    render(<DateTimeGroomerStep {...defaultProps} />, { wrapper })

    expect(screen.getByTestId('calendar')).toBeInTheDocument()
    expect(screen.getByText('날짜 선택')).toBeInTheDocument()
  })

  it('should show placeholder when no date is selected', () => {
    const wrapper = createWrapper()
    render(<DateTimeGroomerStep {...defaultProps} />, { wrapper })

    expect(screen.getByText('날짜를 선택해주세요')).toBeInTheDocument()
  })

  it('should call onDateChange when date is selected', async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    const onDateChange = vi.fn()

    render(<DateTimeGroomerStep {...defaultProps} onDateChange={onDateChange} />, { wrapper })

    const selectButton = screen.getByText('Select Date')
    await user.click(selectButton)

    expect(onDateChange).toHaveBeenCalled()
  })

  it('should show groomer selection after date is selected', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: '',
          groomerId: '',
          date: '2024-12-25',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    render(<DateTimeGroomerStep {...defaultProps} />, { wrapper })

    expect(screen.getByText('미용사 선택')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('should not show groomer selection when no date is selected', () => {
    const wrapper = createWrapper()
    render(<DateTimeGroomerStep {...defaultProps} />, { wrapper })

    expect(screen.queryByText('미용사 선택')).not.toBeInTheDocument()
  })

  it('should show loading state for groomers', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: '',
          groomerId: '',
          date: '2024-12-25',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    render(<DateTimeGroomerStep {...defaultProps} isLoadingGroomers={true} />, { wrapper })

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    expect(screen.getByText('미용사 정보를 불러오는 중...')).toBeInTheDocument()
  })

  it('should show empty state when no groomers available', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: '',
          groomerId: '',
          date: '2024-12-25',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    render(<DateTimeGroomerStep {...defaultProps} groomers={[]} />, { wrapper })

    expect(screen.getByText('서비스 가능한 미용사가 없습니다')).toBeInTheDocument()
  })

  it('should call onGroomerSelect when groomer is clicked', async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: '',
          groomerId: '',
          date: '2024-12-25',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })
    const onGroomerSelect = vi.fn()

    render(<DateTimeGroomerStep {...defaultProps} onGroomerSelect={onGroomerSelect} />, {
      wrapper,
    })

    const groomerCard = screen.getByTestId('groomer-card-groomer1')
    await user.click(groomerCard)

    expect(onGroomerSelect).toHaveBeenCalledWith('groomer1')
  })

  it('should show time slot picker after groomer is selected', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: '',
          groomerId: 'groomer1',
          date: '2024-12-25',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    render(<DateTimeGroomerStep {...defaultProps} />, { wrapper })

    expect(screen.getByTestId('time-slot-picker')).toBeInTheDocument()
    expect(screen.getByText('Groomer: John Doe')).toBeInTheDocument()
  })

  it('should filter time slots by selected groomer', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: '',
          groomerId: 'groomer1',
          date: '2024-12-25',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })

    render(<DateTimeGroomerStep {...defaultProps} />, { wrapper })

    const timePicker = screen.getByTestId('time-slot-picker')
    const buttons = within(timePicker).getAllByRole('button')

    // Should show time slots for groomer1 only (09:00, 10:00, 11:00)
    expect(buttons).toHaveLength(3)
  })

  it('should call onTimeSelect when time slot is clicked', async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: '',
          groomerId: 'groomer1',
          date: '2024-12-25',
          timeSlot: '',
          specialRequests: '',
        },
      },
    })
    const onTimeSelect = vi.fn()

    render(<DateTimeGroomerStep {...defaultProps} onTimeSelect={onTimeSelect} />, { wrapper })

    const timeButton = screen.getByText('09:00')
    await user.click(timeButton)

    expect(onTimeSelect).toHaveBeenCalledWith('09:00')
  })

  it('should show booking summary when all selections are made', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: '',
          groomerId: 'groomer1',
          date: '2024-12-25',
          timeSlot: '09:00',
          specialRequests: '',
        },
      },
    })

    render(<DateTimeGroomerStep {...defaultProps} />, { wrapper })

    expect(screen.getByText('선택된 예약 정보')).toBeInTheDocument()
    const groomerNames = screen.getAllByText('John Doe')
    expect(groomerNames.length).toBeGreaterThan(0)
  })

  it('should render special requests textarea', () => {
    const wrapper = createWrapper()
    render(<DateTimeGroomerStep {...defaultProps} />, { wrapper })

    const textarea = screen.getByPlaceholderText(
      /미용사에게 전달할 특별한 요청사항이 있으시면 입력해주세요/
    )
    expect(textarea).toBeInTheDocument()
  })

  it('should call onSpecialRequestsChange when textarea value changes', async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper()
    const onSpecialRequestsChange = vi.fn()

    render(
      <DateTimeGroomerStep {...defaultProps} onSpecialRequestsChange={onSpecialRequestsChange} />,
      { wrapper }
    )

    const textarea = screen.getByPlaceholderText(
      /미용사에게 전달할 특별한 요청사항이 있으시면 입력해주세요/
    )
    await user.type(textarea, 'Please be gentle')

    expect(onSpecialRequestsChange).toHaveBeenCalled()
  })

  it('should show pagination when there are multiple pages', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: '',
          groomerId: '',
          date: '2024-12-25',
          timeSlot: '',
          specialRequests: '',
        },
        currentGroomerPage: 1,
      },
    })

    const pagination = {
      currentPage: 1,
      totalPages: 3,
      totalItems: 15,
      itemsPerPage: 5,
      hasNextPage: true,
      hasPreviousPage: false,
    }

    render(<DateTimeGroomerStep {...defaultProps} groomerPagination={pagination} />, { wrapper })

    expect(screen.getByText('총 15명의 미용사 중 1-5명 표시')).toBeInTheDocument()
    expect(screen.getByText('이전')).toBeInTheDocument()
    expect(screen.getByText('다음')).toBeInTheDocument()
  })

  it('should call onGroomerPageChange when pagination button is clicked', async () => {
    const user = userEvent.setup()
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: '',
          groomerId: '',
          date: '2024-12-25',
          timeSlot: '',
          specialRequests: '',
        },
        currentGroomerPage: 1,
      },
    })

    const pagination = {
      currentPage: 1,
      totalPages: 3,
      totalItems: 15,
      itemsPerPage: 5,
      hasNextPage: true,
      hasPreviousPage: false,
    }

    const onGroomerPageChange = vi.fn()

    render(
      <DateTimeGroomerStep
        {...defaultProps}
        groomerPagination={pagination}
        onGroomerPageChange={onGroomerPageChange}
      />,
      { wrapper }
    )

    const nextButton = screen.getByText('다음')
    await user.click(nextButton)

    expect(onGroomerPageChange).toHaveBeenCalledWith(2)
  })

  it('should disable previous button on first page', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: '',
          groomerId: '',
          date: '2024-12-25',
          timeSlot: '',
          specialRequests: '',
        },
        currentGroomerPage: 1,
      },
    })

    const pagination = {
      currentPage: 1,
      totalPages: 3,
      totalItems: 15,
      itemsPerPage: 5,
      hasNextPage: true,
      hasPreviousPage: false,
    }

    render(<DateTimeGroomerStep {...defaultProps} groomerPagination={pagination} />, { wrapper })

    const prevButton = screen.getByText('이전')
    expect(prevButton).toBeDisabled()
  })

  it('should disable next button on last page', () => {
    const wrapper = createWrapper({
      booking: {
        formData: {
          petServices: [],
          addressId: '',
          groomerId: '',
          date: '2024-12-25',
          timeSlot: '',
          specialRequests: '',
        },
        currentGroomerPage: 3,
      },
    })

    const pagination = {
      currentPage: 3,
      totalPages: 3,
      totalItems: 15,
      itemsPerPage: 5,
      hasNextPage: false,
      hasPreviousPage: true,
    }

    render(<DateTimeGroomerStep {...defaultProps} groomerPagination={pagination} />, { wrapper })

    const nextButton = screen.getByText('다음')
    expect(nextButton).toBeDisabled()
  })
})
