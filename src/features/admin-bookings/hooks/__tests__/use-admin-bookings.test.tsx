/**
 * Tests for useAdminBookings hook (RTK Query version)
 *
 * Test coverage:
 * - Successful data fetching via RTK Query
 * - Loading states during fetch
 * - Error handling through RTK Query
 * - Pagination support
 * - Filter application (search, status, date, sort)
 * - Stats calculation from bookings
 * - Integration with Redux store
 *
 * Target coverage: 90%+
 */

import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useAdminBookings, calculateBookingStats } from '../use-admin-bookings'
import { adminBookingsApi } from '../../state/admin-bookings-api-slice'
import type { BookingFilters } from '../../types/booking.types'
import type { ReactNode } from 'react'
import { mockBookings } from '../../__tests__/mocks/data'
import { adminBookingsHandlers } from '../../__tests__/mocks/handlers'
import { BookingStatus } from '@mimisalon/shared'

// ============================================================================
// MSW Server Setup
// ============================================================================

const server = setupServer(...adminBookingsHandlers)

// ============================================================================
// Test Utilities
// ============================================================================

function createTestStore() {
  return configureStore({
    reducer: {
      [adminBookingsApi.reducerPath]: adminBookingsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(adminBookingsApi.middleware),
  })
}

function createWrapper(store: ReturnType<typeof createTestStore>) {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )
  Wrapper.displayName = 'ReduxTestWrapper'
  return Wrapper
}

const defaultFilters: BookingFilters = {
  searchQuery: '',
  statusFilter: 'ALL',
  dateFilter: '',
  sortBy: 'date',
  sortOrder: 'desc',
}

// ============================================================================
// Tests
// ============================================================================

describe('useAdminBookings (RTK Query)', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  beforeEach(() => {
    // Reset any runtime handlers added during tests
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  // ==========================================================================
  // Success Cases
  // ==========================================================================

  it('should fetch bookings successfully with default parameters', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useAdminBookings(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    // Initially loading
    expect(result.current.isLoading).toBe(true)
    expect(result.current.bookings).toEqual([])

    // Wait for successful fetch
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify data was fetched
    expect(result.current.bookings.length).toBeGreaterThan(0)
    expect(result.current.pagination).toBeDefined()
    expect(result.current.pagination?.page).toBe(1)
    expect(result.current.isError).toBe(false)
  })

  it('should fetch bookings for different pages', async () => {
    const store = createTestStore()

    // Fetch page 1
    const { result: result1 } = renderHook(() => useAdminBookings(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result1.current.isLoading).toBe(false), { timeout: 3000 })

    const page1Data = result1.current.bookings

    // Fetch page 2
    const { result: result2 } = renderHook(() => useAdminBookings(defaultFilters, 2, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result2.current.isLoading).toBe(false), { timeout: 3000 })

    // Pages should have different data
    expect(result2.current.pagination?.page).toBe(2)
  })

  it('should return stats calculated from bookings', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useAdminBookings(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify stats are calculated
    expect(result.current.stats).toBeDefined()
    expect(result.current.stats?.totalBookings).toBeGreaterThan(0)
    expect(result.current.stats?.totalRevenue).toBeGreaterThanOrEqual(0)
    expect(result.current.stats?.pendingBookings).toBeGreaterThanOrEqual(0)
    expect(result.current.stats?.confirmedBookings).toBeGreaterThanOrEqual(0)
    expect(result.current.stats?.completedBookings).toBeGreaterThanOrEqual(0)
    expect(result.current.stats?.cancelledBookings).toBeGreaterThanOrEqual(0)
  })

  // ==========================================================================
  // Filter Cases
  // ==========================================================================

  it('should fetch bookings with search query', async () => {
    const store = createTestStore()
    const filters: BookingFilters = {
      ...defaultFilters,
      searchQuery: '김철수',
    }

    const { result } = renderHook(() => useAdminBookings(filters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Should have filtered results
    expect(result.current.bookings.length).toBeGreaterThan(0)
  })

  it('should fetch bookings with status filter', async () => {
    const store = createTestStore()
    const filters: BookingFilters = {
      ...defaultFilters,
      statusFilter: BookingStatus.GROOMER_CONFIRM,
    }

    const { result } = renderHook(() => useAdminBookings(filters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // All bookings should have the filtered status
    if (result.current.bookings.length > 0) {
      result.current.bookings.forEach((booking) => {
        expect(booking.status).toBe(BookingStatus.GROOMER_CONFIRM)
      })
    }
  })

  it('should fetch bookings with date filter', async () => {
    const store = createTestStore()
    const filters: BookingFilters = {
      ...defaultFilters,
      dateFilter: '2025-11-05',
    }

    const { result } = renderHook(() => useAdminBookings(filters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // All bookings should have the filtered date
    if (result.current.bookings.length > 0) {
      result.current.bookings.forEach((booking) => {
        expect(booking.serviceDate).toBe('2025-11-05')
      })
    }
  })

  it('should fetch bookings with sort by amount ascending', async () => {
    const store = createTestStore()
    const filters: BookingFilters = {
      ...defaultFilters,
      sortBy: 'amount',
      sortOrder: 'asc',
    }

    const { result } = renderHook(() => useAdminBookings(filters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify sorting
    if (result.current.bookings.length > 1) {
      const amounts = result.current.bookings.map((b) => b.totalAmount)
      const sortedAmounts = [...amounts].sort((a, b) => a - b)
      expect(amounts).toEqual(sortedAmounts)
    }
  })

  it('should fetch bookings with sort by date descending', async () => {
    const store = createTestStore()
    const filters: BookingFilters = {
      ...defaultFilters,
      sortBy: 'date',
      sortOrder: 'desc',
    }

    const { result } = renderHook(() => useAdminBookings(filters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify sorting
    if (result.current.bookings.length > 1) {
      const dates = result.current.bookings.map((b) => b.serviceDate)
      const sortedDates = [...dates].sort().reverse()
      expect(dates).toEqual(sortedDates)
    }
  })

  it('should fetch bookings with combined filters', async () => {
    const store = createTestStore()
    const filters: BookingFilters = {
      searchQuery: '김',
      statusFilter: BookingStatus.GROOMER_CONFIRM_PENDING,
      dateFilter: '',
      sortBy: 'amount',
      sortOrder: 'desc',
    }

    const { result } = renderHook(() => useAdminBookings(filters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Should fetch successfully with combined filters
    expect(result.current.isError).toBe(false)
  })

  // ==========================================================================
  // Loading States
  // ==========================================================================

  it('should show loading state initially', () => {
    const store = createTestStore()
    const { result } = renderHook(() => useAdminBookings(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    // Check initial loading state
    expect(result.current.isLoading).toBe(true)
    expect(result.current.bookings).toEqual([])
    expect(result.current.stats).toBeNull()
    // RTK Query returns undefined for error initially, not null
    expect(result.current.error).toBeUndefined()
  })

  it('should not fetch when enabled is false', () => {
    const store = createTestStore()
    const { result } = renderHook(() => useAdminBookings(defaultFilters, 1, false), {
      wrapper: createWrapper(store),
    })

    // Query should be skipped
    expect(result.current.isLoading).toBe(false)
    expect(result.current.bookings).toEqual([])
  })

  // ==========================================================================
  // Error Handling
  // ==========================================================================

  it('should handle API errors', async () => {
    // Override handler to return error
    server.use(
      http.get('/api/admin/bookings', () => {
        return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 })
      })
    )

    const store = createTestStore()
    const { result } = renderHook(() => useAdminBookings(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    expect(result.current.isError).toBe(true)
    expect(result.current.error).toBeDefined()
    expect(result.current.bookings).toEqual([])
  })

  // ==========================================================================
  // Pagination
  // ==========================================================================

  it('should return correct pagination info', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useAdminBookings(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    const pagination = result.current.pagination
    expect(pagination).toBeDefined()
    expect(pagination?.page).toBe(1)
    expect(pagination?.limit).toBeGreaterThan(0)
    expect(pagination?.totalCount).toBeGreaterThan(0)
    expect(pagination?.totalPages).toBeGreaterThan(0)
    expect(typeof pagination?.hasNext).toBe('boolean')
    expect(typeof pagination?.hasPrev).toBe('boolean')
  })

  it('should indicate hasNextPage correctly', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useAdminBookings(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Page 1 should have next page if totalPages > 1
    if (result.current.pagination && result.current.pagination.totalPages > 1) {
      expect(result.current.pagination.hasNext).toBe(true)
    }
  })

  it('should indicate hasPreviousPage correctly', async () => {
    const store = createTestStore()

    // Page 1 should not have previous page
    const { result: result1 } = renderHook(() => useAdminBookings(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result1.current.isLoading).toBe(false), { timeout: 3000 })
    expect(result1.current.pagination?.hasPrev).toBe(false)

    // Page 2 should have previous page
    const { result: result2 } = renderHook(() => useAdminBookings(defaultFilters, 2, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result2.current.isLoading).toBe(false), { timeout: 3000 })
    expect(result2.current.pagination?.hasPrev).toBe(true)
  })

  // ==========================================================================
  // RTK Query Integration
  // ==========================================================================

  it('should use RTK Query cache for repeated calls', async () => {
    const store = createTestStore()

    // First render
    const { result: result1 } = renderHook(() => useAdminBookings(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result1.current.isLoading).toBe(false), { timeout: 3000 })

    const firstData = result1.current.bookings

    // Second render with same store - should use cache
    const { result: result2 } = renderHook(() => useAdminBookings(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    // Should have data immediately from cache
    await waitFor(() => expect(result2.current.bookings.length).toBeGreaterThan(0), {
      timeout: 1000,
    })

    expect(result2.current.bookings).toEqual(firstData)
  })

  it('should integrate with Redux store', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useAdminBookings(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify data is in Redux store
    const state = store.getState()
    expect(state[adminBookingsApi.reducerPath]).toBeDefined()

    const queries = state[adminBookingsApi.reducerPath].queries
    expect(Object.keys(queries).length).toBeGreaterThan(0)
  })

  it('should return correct interface shape', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useAdminBookings(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify interface
    expect(result.current).toHaveProperty('bookings')
    expect(result.current).toHaveProperty('pagination')
    expect(result.current).toHaveProperty('stats')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('isFetching')
    expect(result.current).toHaveProperty('isError')
    expect(result.current).toHaveProperty('error')

    expect(Array.isArray(result.current.bookings)).toBe(true)
  })
})

describe('calculateBookingStats', () => {
  it('should calculate stats from empty array', () => {
    const stats = calculateBookingStats([])

    expect(stats.totalBookings).toBe(0)
    expect(stats.pendingBookings).toBe(0)
    expect(stats.confirmedBookings).toBe(0)
    expect(stats.completedBookings).toBe(0)
    expect(stats.cancelledBookings).toBe(0)
    expect(stats.totalRevenue).toBe(0)
  })

  it('should calculate total bookings correctly', () => {
    const stats = calculateBookingStats(mockBookings)

    expect(stats.totalBookings).toBe(mockBookings.length)
  })

  it('should count pending bookings correctly', () => {
    const stats = calculateBookingStats(mockBookings)

    const expectedPending = mockBookings.filter(
      (b) =>
        b.status === BookingStatus.FIRST_PAYMENT_PENDING ||
        b.status === BookingStatus.FIRST_PAYMENT_VERIFY ||
        b.status === BookingStatus.GROOMER_CONFIRM_PENDING ||
        b.status === BookingStatus.ADDITIONAL_PAYMENT_PENDING
    ).length

    expect(stats.pendingBookings).toBe(expectedPending)
  })

  it('should count confirmed bookings correctly', () => {
    const stats = calculateBookingStats(mockBookings)

    const expectedConfirmed = mockBookings.filter(
      (b) =>
        b.status === BookingStatus.GROOMER_CONFIRM ||
        b.status === BookingStatus.ADDITIONAL_PAYMENT_COMPLETE
    ).length

    expect(stats.confirmedBookings).toBe(expectedConfirmed)
  })

  it('should count completed bookings correctly', () => {
    const stats = calculateBookingStats(mockBookings)

    const expectedCompleted = mockBookings.filter(
      (b) => b.status === BookingStatus.SERVICE_COMPLETED
    ).length

    expect(stats.completedBookings).toBe(expectedCompleted)
  })

  it('should count cancelled bookings correctly', () => {
    const stats = calculateBookingStats(mockBookings)

    const expectedCancelled = mockBookings.filter(
      (b) => b.status === BookingStatus.SERVICE_CANCELLED
    ).length

    expect(stats.cancelledBookings).toBe(expectedCancelled)
  })

  it('should calculate total revenue correctly', () => {
    const stats = calculateBookingStats(mockBookings)

    const expectedRevenue = mockBookings.reduce((sum, b) => sum + b.paidAmount, 0)

    expect(stats.totalRevenue).toBe(expectedRevenue)
  })

  it('should handle bookings with zero paid amount', () => {
    const testBookings = [
      { status: BookingStatus.FIRST_PAYMENT_PENDING, paidAmount: 0 },
      { status: BookingStatus.SERVICE_COMPLETED, paidAmount: 100000 },
    ]

    const stats = calculateBookingStats(testBookings)

    expect(stats.totalRevenue).toBe(100000)
    expect(stats.totalBookings).toBe(2)
  })

  it('should handle all bookings of same status', () => {
    const testBookings = Array(5).fill({
      status: BookingStatus.GROOMER_CONFIRM,
      paidAmount: 50000,
    })

    const stats = calculateBookingStats(testBookings)

    expect(stats.confirmedBookings).toBe(5)
    expect(stats.pendingBookings).toBe(0)
    expect(stats.completedBookings).toBe(0)
    expect(stats.totalRevenue).toBe(250000)
  })
})
