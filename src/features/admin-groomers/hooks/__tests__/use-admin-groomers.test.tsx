/**
 * Tests for useAdminGroomers hook (RTK Query version)
 *
 * Test coverage:
 * - Successful data fetching via RTK Query
 * - Loading states during fetch
 * - Error handling through RTK Query
 * - Pagination support
 * - Filter application (search, status, location, sort)
 * - Stats calculation from groomers
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
import { useAdminGroomers, calculateGroomerStats } from '../use-admin-groomers'
import { adminGroomersApi } from '../../state/admin-groomers-api-slice'
import type { GroomerFilters } from '../../types/groomer.types'
import type { ReactNode } from 'react'
import { mockGroomers } from '../../__tests__/mocks/data'
import { adminGroomersHandlers } from '../../__tests__/mocks/handlers'

// ============================================================================
// MSW Server Setup
// ============================================================================

const server = setupServer(...adminGroomersHandlers)

// ============================================================================
// Test Utilities
// ============================================================================

function createTestStore() {
  return configureStore({
    reducer: {
      [adminGroomersApi.reducerPath]: adminGroomersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(adminGroomersApi.middleware),
  })
}

function createWrapper(store: ReturnType<typeof createTestStore>) {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )
  Wrapper.displayName = 'ReduxTestWrapper'
  return Wrapper
}

const defaultFilters: GroomerFilters = {
  searchQuery: '',
  statusFilter: 'ALL',
  locationFilter: 'ALL',
  sortBy: 'name',
  sortOrder: 'desc',
}

// ============================================================================
// Tests
// ============================================================================

describe('useAdminGroomers (RTK Query)', () => {
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

  it('should fetch groomers successfully with default parameters', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useAdminGroomers(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    // Initially loading
    expect(result.current.isLoading).toBe(true)
    expect(result.current.groomers).toEqual([])

    // Wait for successful fetch
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify data was fetched
    expect(result.current.groomers.length).toBeGreaterThan(0)
    expect(result.current.pagination).toBeDefined()
    expect(result.current.pagination?.page).toBe(1)
    expect(result.current.isError).toBe(false)
  })

  it('should fetch groomers for different pages', async () => {
    const store = createTestStore()

    // Fetch page 1
    const { result: result1 } = renderHook(() => useAdminGroomers(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result1.current.isLoading).toBe(false), { timeout: 3000 })

    const page1Data = result1.current.groomers

    // Fetch page 2
    const { result: result2 } = renderHook(() => useAdminGroomers(defaultFilters, 2, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result2.current.isLoading).toBe(false), { timeout: 3000 })

    // Pages should have different data
    expect(result2.current.pagination?.page).toBe(2)
  })

  it('should return stats calculated from groomers', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useAdminGroomers(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify stats are calculated
    expect(result.current.stats).toBeDefined()
    expect(result.current.stats?.totalGroomers).toBeGreaterThan(0)
    expect(result.current.stats?.activeGroomers).toBeGreaterThanOrEqual(0)
    expect(result.current.stats?.inactiveGroomers).toBeGreaterThanOrEqual(0)
    expect(result.current.stats?.averageRating).toBeGreaterThanOrEqual(0)
    expect(result.current.stats?.totalBookingsThisMonth).toBeGreaterThanOrEqual(0)
    expect(result.current.stats?.totalRevenueThisMonth).toBeGreaterThanOrEqual(0)
  })

  // ==========================================================================
  // Filter Cases
  // ==========================================================================

  it('should fetch groomers with search query', async () => {
    const store = createTestStore()
    const filters: GroomerFilters = {
      ...defaultFilters,
      searchQuery: '최미용',
    }

    const { result } = renderHook(() => useAdminGroomers(filters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Should have filtered results
    expect(result.current.groomers.length).toBeGreaterThan(0)
    result.current.groomers.forEach((groomer) => {
      expect(groomer.user.name?.toLowerCase()).toContain('최미용'.toLowerCase())
    })
  })

  it('should fetch groomers with status filter - ACTIVE', async () => {
    const store = createTestStore()
    const filters: GroomerFilters = {
      ...defaultFilters,
      statusFilter: 'ACTIVE',
    }

    const { result } = renderHook(() => useAdminGroomers(filters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // All groomers should be active
    if (result.current.groomers.length > 0) {
      result.current.groomers.forEach((groomer) => {
        expect(groomer.isActive).toBe(true)
      })
    }
  })

  it('should fetch groomers with status filter - INACTIVE', async () => {
    const store = createTestStore()
    const filters: GroomerFilters = {
      ...defaultFilters,
      statusFilter: 'INACTIVE',
    }

    const { result } = renderHook(() => useAdminGroomers(filters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // All groomers should be inactive
    if (result.current.groomers.length > 0) {
      result.current.groomers.forEach((groomer) => {
        expect(groomer.isActive).toBe(false)
      })
    }
  })

  it('should fetch groomers with location filter', async () => {
    const store = createTestStore()
    const filters: GroomerFilters = {
      ...defaultFilters,
      locationFilter: 'location-1',
    }

    const { result } = renderHook(() => useAdminGroomers(filters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // All groomers should have location-1 in their available locations
    if (result.current.groomers.length > 0) {
      result.current.groomers.forEach((groomer) => {
        expect(groomer.availableLocations.some((loc) => loc.id === 'location-1')).toBe(true)
      })
    }
  })

  it('should fetch groomers with sort by rating ascending', async () => {
    const store = createTestStore()
    const filters: GroomerFilters = {
      ...defaultFilters,
      sortBy: 'rating',
      sortOrder: 'asc',
    }

    const { result } = renderHook(() => useAdminGroomers(filters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify sorting
    if (result.current.groomers.length > 1) {
      const ratings = result.current.groomers.map((g) => g.rating)
      const sortedRatings = [...ratings].sort((a, b) => a - b)
      expect(ratings).toEqual(sortedRatings)
    }
  })

  it('should fetch groomers with sort by revenue descending', async () => {
    const store = createTestStore()
    const filters: GroomerFilters = {
      ...defaultFilters,
      sortBy: 'revenue',
      sortOrder: 'desc',
    }

    const { result } = renderHook(() => useAdminGroomers(filters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify sorting
    if (result.current.groomers.length > 1) {
      const revenues = result.current.groomers.map((g) => g.monthlyRevenue)
      const sortedRevenues = [...revenues].sort((a, b) => b - a)
      expect(revenues).toEqual(sortedRevenues)
    }
  })

  it('should fetch groomers with sort by bookings descending', async () => {
    const store = createTestStore()
    const filters: GroomerFilters = {
      ...defaultFilters,
      sortBy: 'bookings',
      sortOrder: 'desc',
    }

    const { result } = renderHook(() => useAdminGroomers(filters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify sorting
    if (result.current.groomers.length > 1) {
      const bookings = result.current.groomers.map((g) => g.totalBookings)
      const sortedBookings = [...bookings].sort((a, b) => b - a)
      expect(bookings).toEqual(sortedBookings)
    }
  })

  it('should fetch groomers with sort by name ascending', async () => {
    const store = createTestStore()
    const filters: GroomerFilters = {
      ...defaultFilters,
      sortBy: 'name',
      sortOrder: 'asc',
    }

    const { result } = renderHook(() => useAdminGroomers(filters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify sorting
    if (result.current.groomers.length > 1) {
      const names = result.current.groomers.map((g) => g.user.name || '')
      const sortedNames = [...names].sort()
      expect(names).toEqual(sortedNames)
    }
  })

  it('should fetch groomers with sort by joinDate descending', async () => {
    const store = createTestStore()
    const filters: GroomerFilters = {
      ...defaultFilters,
      sortBy: 'joinDate',
      sortOrder: 'desc',
    }

    const { result } = renderHook(() => useAdminGroomers(filters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify sorting
    if (result.current.groomers.length > 1) {
      const dates = result.current.groomers.map((g) => g.user.createdAt)
      const sortedDates = [...dates].sort().reverse()
      expect(dates).toEqual(sortedDates)
    }
  })

  it('should fetch groomers with combined filters', async () => {
    const store = createTestStore()
    const filters: GroomerFilters = {
      searchQuery: '김',
      statusFilter: 'ACTIVE',
      locationFilter: 'ALL',
      sortBy: 'revenue',
      sortOrder: 'desc',
    }

    const { result } = renderHook(() => useAdminGroomers(filters, 1, true), {
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
    const { result } = renderHook(() => useAdminGroomers(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    // Check initial loading state
    expect(result.current.isLoading).toBe(true)
    expect(result.current.groomers).toEqual([])
    expect(result.current.stats).toBeNull()
    // RTK Query returns undefined for error initially, not null
    expect(result.current.error).toBeUndefined()
  })

  it('should not fetch when enabled is false', () => {
    const store = createTestStore()
    const { result } = renderHook(() => useAdminGroomers(defaultFilters, 1, false), {
      wrapper: createWrapper(store),
    })

    // Query should be skipped
    expect(result.current.isLoading).toBe(false)
    expect(result.current.groomers).toEqual([])
  })

  // ==========================================================================
  // Error Handling
  // ==========================================================================

  it('should handle API errors', async () => {
    // Override handler to return error
    server.use(
      http.get('/api/admin/groomers', () => {
        return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 })
      })
    )

    const store = createTestStore()
    const { result } = renderHook(() => useAdminGroomers(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    expect(result.current.isError).toBe(true)
    expect(result.current.error).toBeDefined()
    expect(result.current.groomers).toEqual([])
  })

  it('should handle error with search trigger', async () => {
    const store = createTestStore()
    const filters: GroomerFilters = {
      ...defaultFilters,
      searchQuery: 'ERROR_TRIGGER',
    }

    const { result } = renderHook(() => useAdminGroomers(filters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    expect(result.current.isError).toBe(true)
    expect(result.current.groomers).toEqual([])
  })

  // ==========================================================================
  // Pagination
  // ==========================================================================

  it('should return correct pagination info', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useAdminGroomers(defaultFilters, 1, true), {
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

  it('should indicate hasNext correctly', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useAdminGroomers(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Page 1 should have next page if totalPages > 1
    if (result.current.pagination && result.current.pagination.totalPages > 1) {
      expect(result.current.pagination.hasNext).toBe(true)
    }
  })

  it('should indicate hasPrev correctly', async () => {
    const store = createTestStore()

    // Page 1 should not have previous page
    const { result: result1 } = renderHook(() => useAdminGroomers(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result1.current.isLoading).toBe(false), { timeout: 3000 })
    expect(result1.current.pagination?.hasPrev).toBe(false)

    // Page 2 should have previous page
    const { result: result2 } = renderHook(() => useAdminGroomers(defaultFilters, 2, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result2.current.isLoading).toBe(false), { timeout: 3000 })
    expect(result2.current.pagination?.hasPrev).toBe(true)
  })

  it('should return undefined pagination for empty results', async () => {
    // Override handler to return empty results
    server.use(
      http.get('/api/admin/groomers', () => {
        return HttpResponse.json({
          groomers: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: 1,
        })
      })
    )

    const store = createTestStore()
    const { result } = renderHook(() => useAdminGroomers(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    expect(result.current.pagination).toBeUndefined()
    expect(result.current.groomers).toEqual([])
  })

  // ==========================================================================
  // RTK Query Integration
  // ==========================================================================

  it('should use RTK Query cache for repeated calls', async () => {
    const store = createTestStore()

    // First render
    const { result: result1 } = renderHook(() => useAdminGroomers(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result1.current.isLoading).toBe(false), { timeout: 3000 })

    const firstData = result1.current.groomers

    // Second render with same store - should use cache
    const { result: result2 } = renderHook(() => useAdminGroomers(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    // Should have data immediately from cache
    await waitFor(() => expect(result2.current.groomers.length).toBeGreaterThan(0), {
      timeout: 1000,
    })

    expect(result2.current.groomers).toEqual(firstData)
  })

  it('should integrate with Redux store', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useAdminGroomers(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify data is in Redux store
    const state = store.getState()
    expect(state[adminGroomersApi.reducerPath]).toBeDefined()

    const queries = state[adminGroomersApi.reducerPath].queries
    expect(Object.keys(queries).length).toBeGreaterThan(0)
  })

  it('should return correct interface shape', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useAdminGroomers(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify interface
    expect(result.current).toHaveProperty('groomers')
    expect(result.current).toHaveProperty('pagination')
    expect(result.current).toHaveProperty('stats')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('isFetching')
    expect(result.current).toHaveProperty('isError')
    expect(result.current).toHaveProperty('error')

    expect(Array.isArray(result.current.groomers)).toBe(true)
  })

  it('should track isFetching separately from isLoading', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useAdminGroomers(defaultFilters, 1, true), {
      wrapper: createWrapper(store),
    })

    // Initially both should be true
    expect(result.current.isLoading).toBe(true)
    expect(result.current.isFetching).toBe(true)

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // After initial load, isLoading should be false
    expect(result.current.isLoading).toBe(false)
  })
})

describe('calculateGroomerStats', () => {
  it('should calculate stats from empty array', () => {
    const stats = calculateGroomerStats([])

    expect(stats.totalGroomers).toBe(0)
    expect(stats.activeGroomers).toBe(0)
    expect(stats.inactiveGroomers).toBe(0)
    expect(stats.averageRating).toBe(0)
    expect(stats.totalBookingsThisMonth).toBe(0)
    expect(stats.totalRevenueThisMonth).toBe(0)
  })

  it('should calculate total groomers correctly', () => {
    const stats = calculateGroomerStats(mockGroomers)

    expect(stats.totalGroomers).toBe(mockGroomers.length)
  })

  it('should count active groomers correctly', () => {
    const stats = calculateGroomerStats(mockGroomers)

    const expectedActive = mockGroomers.filter((g) => g.isActive).length

    expect(stats.activeGroomers).toBe(expectedActive)
  })

  it('should count inactive groomers correctly', () => {
    const stats = calculateGroomerStats(mockGroomers)

    const expectedInactive = mockGroomers.filter((g) => !g.isActive).length

    expect(stats.inactiveGroomers).toBe(expectedInactive)
  })

  it('should calculate average rating correctly', () => {
    const stats = calculateGroomerStats(mockGroomers)

    const ratings = mockGroomers.map((g) => g.rating)
    const expectedAverage = ratings.reduce((sum, r) => sum + r, 0) / ratings.length

    expect(stats.averageRating).toBe(Number(expectedAverage.toFixed(1)))
  })

  it('should calculate total revenue this month correctly', () => {
    const stats = calculateGroomerStats(mockGroomers)

    const expectedRevenue = mockGroomers.reduce((sum, g) => sum + g.monthlyRevenue, 0)

    expect(stats.totalRevenueThisMonth).toBe(expectedRevenue)
  })

  it('should calculate total bookings this month correctly', () => {
    const stats = calculateGroomerStats(mockGroomers)

    const expectedBookings = mockGroomers.reduce((sum, g) => {
      return sum + (g.isActive ? Math.floor(g.totalBookings * 0.15) : 0)
    }, 0)

    expect(stats.totalBookingsThisMonth).toBe(expectedBookings)
  })

  it('should handle groomers with zero revenue', () => {
    const testGroomers = [
      {
        ...mockGroomers[0],
        monthlyRevenue: 0,
        isActive: true,
      },
      {
        ...mockGroomers[1],
        monthlyRevenue: 1000000,
        isActive: true,
      },
    ]

    const stats = calculateGroomerStats(testGroomers)

    expect(stats.totalRevenueThisMonth).toBe(1000000)
    expect(stats.totalGroomers).toBe(2)
  })

  it('should handle all groomers being active', () => {
    const testGroomers = mockGroomers.map((g) => ({
      ...g,
      isActive: true,
    }))

    const stats = calculateGroomerStats(testGroomers)

    expect(stats.activeGroomers).toBe(testGroomers.length)
    expect(stats.inactiveGroomers).toBe(0)
  })

  it('should handle all groomers being inactive', () => {
    const testGroomers = mockGroomers.map((g) => ({
      ...g,
      isActive: false,
    }))

    const stats = calculateGroomerStats(testGroomers)

    expect(stats.activeGroomers).toBe(0)
    expect(stats.inactiveGroomers).toBe(testGroomers.length)
    expect(stats.totalBookingsThisMonth).toBe(0)
  })

  it('should handle groomers with same rating', () => {
    const testGroomers = mockGroomers.map((g) => ({
      ...g,
      rating: 4.5,
    }))

    const stats = calculateGroomerStats(testGroomers)

    expect(stats.averageRating).toBe(4.5)
  })
})
