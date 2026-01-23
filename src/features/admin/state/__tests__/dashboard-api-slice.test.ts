/**
 * Tests for RTK Query Dashboard API Slice
 *
 * Test coverage:
 * - RTK Query endpoint configuration
 * - Query argument serialization
 * - Response transformation
 * - Cache behavior with keepUnusedDataFor
 * - Type safety with DashboardOverviewResponse and OverviewStats
 *
 * @module features/admin/api/__tests__/dashboard-api-slice.test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { dashboardApi } from '../dashboard-api-slice'
import type { DashboardOverviewResponse } from '@/app/api/admin/dashboard/overview/route'
import type { OverviewStats } from '../../types/dashboard.types'

// ============================================================================
// Mock Data
// ============================================================================

/**
 * Mock API response matching DashboardOverviewResponse from route
 */
const mockApiResponse: DashboardOverviewResponse = {
  metrics: {
    totalBookings: 150,
    completedBookings: 120,
    pendingBookings: 25,
    cancelledBookings: 5,
    totalRevenue: 15000000, // 15M KRW in cents
    totalCustomers: 85,
    totalGroomers: 12,
    completionRate: 80,
    avgBookingValue: 125000, // 125K KRW in cents
    averageRating: 4.5,
    totalReviews: 98,
  },
  recentBookings: [
    {
      id: 'booking-1',
      bookingNumber: 'BK20251030001',
      customerName: '김철수',
      groomerName: '박미용',
      serviceDate: '2025-10-30T10:00:00Z',
      totalPrice: 150000,
      status: 'SERVICE_COMPLETED',
      createdAt: '2025-10-30T09:00:00Z',
    },
    {
      id: 'booking-2',
      bookingNumber: 'BK20251030002',
      customerName: '이영희',
      groomerName: '최미용',
      serviceDate: '2025-10-30T14:00:00Z',
      totalPrice: 120000,
      status: 'GROOMER_CONFIRM_PENDING',
      createdAt: '2025-10-30T08:30:00Z',
    },
  ],
  topServices: [
    {
      serviceId: 'service-1',
      name: '풀 그루밍',
      description: '전체 목욕 및 미용',
      bookingCount: 45,
      totalRevenue: 6750000,
    },
  ],
  userGrowth: [
    { period: '2025-10-01', newUsers: 12, cumulativeUsers: 12 },
    { period: '2025-10-29', newUsers: 20, cumulativeUsers: 85 },
  ],
  monthlyRevenue: [
    { month: '2025-09', revenue: 13000000, bookingCount: 130 },
    { month: '2025-10', revenue: 15000000, bookingCount: 150 },
  ],
  previousMetrics: {
    totalBookings: 130,
    completedBookings: 100,
    pendingBookings: 20,
    cancelledBookings: 10,
    totalRevenue: 13000000,
    totalCustomers: 75,
    totalGroomers: 10,
    completionRate: 76.9,
    avgBookingValue: 130000,
    averageRating: 0,
    totalReviews: 0,
  },
  range: 'month',
  startDate: '2025-10-01T00:00:00Z',
  endDate: '2025-10-30T23:59:59Z',
  previousStartDate: '2025-09-01T00:00:00Z',
  previousEndDate: '2025-09-30T23:59:59Z',
}

const mockEmptyApiResponse: DashboardOverviewResponse = {
  metrics: {
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalGroomers: 0,
    completionRate: 0,
    avgBookingValue: 0,
    averageRating: 0,
    totalReviews: 0,
  },
  recentBookings: [],
  topServices: [],
  userGrowth: [],
  monthlyRevenue: [],
  previousMetrics: {
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalGroomers: 0,
    completionRate: 0,
    avgBookingValue: 0,
    averageRating: 0,
    totalReviews: 0,
  },
  range: 'month',
  startDate: '2025-10-01T00:00:00Z',
  endDate: '2025-10-30T23:59:59Z',
  previousStartDate: '2025-09-01T00:00:00Z',
  previousEndDate: '2025-09-30T23:59:59Z',
}

// ============================================================================
// Test Utilities
// ============================================================================

/**
 * Create a test store with the dashboardApi reducer
 */
function createTestStore() {
  return configureStore({
    reducer: {
      [dashboardApi.reducerPath]: dashboardApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(dashboardApi.middleware),
  })
}

// Store original fetch
const originalFetch = global.fetch

// ============================================================================
// Tests
// ============================================================================

describe('Dashboard API Slice (RTK Query)', () => {
  beforeEach(() => {
    // Mock fetch globally for each test
    global.fetch = vi.fn((url: string) => {
      const urlObj = new URL(url, 'http://localhost')
      const range = urlObj.searchParams.get('range')

      const createMockResponse = (body: unknown, ok: boolean, status: number): Response => {
        const mockResponse = {
          ok,
          status,
          statusText: ok ? 'OK' : 'Internal Server Error',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: () => Promise.resolve(body),
          text: () => Promise.resolve(JSON.stringify(body)),
          blob: () => Promise.resolve(new Blob([JSON.stringify(body)])),
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
          formData: () => Promise.resolve(new FormData()),
          clone: function () {
            return createMockResponse(body, ok, status)
          },
          body: null,
          bodyUsed: false,
          redirected: false,
          type: 'basic' as ResponseType,
          url: url.toString(),
        }
        return mockResponse as Response
      }

      if (range === 'error') {
        return Promise.resolve(createMockResponse({ error: 'Internal Server Error' }, false, 500))
      }

      const response =
        range === 'empty'
          ? mockEmptyApiResponse
          : {
              ...mockApiResponse,
              range: range || 'month',
            }

      return Promise.resolve(createMockResponse(response, true, 200))
    }) as typeof fetch
  })

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch
  })

  // ==========================================================================
  // Endpoint Configuration
  // ==========================================================================

  describe('Endpoint Configuration', () => {
    it('should have correct reducer path', () => {
      expect(dashboardApi.reducerPath).toBe('dashboardApi')
    })

    it('should have getDashboardOverview endpoint', () => {
      const endpoints = dashboardApi.endpoints
      expect(endpoints.getDashboardOverview).toBeDefined()
    })

    it('should generate useGetDashboardOverviewQuery hook', () => {
      expect(dashboardApi.useGetDashboardOverviewQuery).toBeDefined()
      expect(typeof dashboardApi.useGetDashboardOverviewQuery).toBe('function')
    })
  })

  // ==========================================================================
  // Query Execution
  // ==========================================================================

  describe('Query Execution', () => {
    it('should fetch and transform dashboard data successfully', async () => {
      const store = createTestStore()

      // Dispatch query
      const promise = store.dispatch(dashboardApi.endpoints.getDashboardOverview.initiate('month'))

      const result = await promise

      // Verify successful fetch
      expect(result.isSuccess).toBe(true)
      expect(result.data).toBeDefined()

      // Verify transformed data structure
      const data = result.data as OverviewStats
      expect(data.totalBookings).toBe(150)
      expect(data.totalRevenue).toBe(15000000)
      expect(data.totalCustomers).toBe(85)
      expect(data.averageBookingValue).toBe(125000)

      // Verify calculated fields
      expect(typeof data.activeGroomers).toBe('number')
      expect(typeof data.completedBookingsToday).toBe('number')
      expect(typeof data.averageRating).toBe('number')

      // Verify period information
      expect(data.periodLabel).toBe('이번 달')
      // Dates are kept as ISO strings for Redux serialization
      expect(typeof data.period.startDate).toBe('string')
      expect(typeof data.period.endDate).toBe('string')

      // Verify state flags
      expect(data.isLoading).toBe(false)
      expect(data.error).toBeNull()

      // Clean up
      promise.unsubscribe()
    })

    it('should handle different time ranges', async () => {
      const store = createTestStore()
      const ranges = ['week', 'month', 'year'] as const

      for (const range of ranges) {
        const promise = store.dispatch(dashboardApi.endpoints.getDashboardOverview.initiate(range))

        const result = await promise
        expect(result.isSuccess).toBe(true)
        expect(result.data).toBeDefined()

        // Verify expected period labels
        const expectedLabels = {
          week: '최근 1주',
          month: '이번 달',
          year: '올해',
        }
        expect(result.data?.periodLabel).toBe(expectedLabels[range])

        promise.unsubscribe()
      }
    })

    it('should handle empty data gracefully', async () => {
      const store = createTestStore()

      // Note: 'empty' is a test-only value to trigger empty response in the mock
      const promise = store.dispatch(
        // @ts-expect-error - Using test-only value to trigger empty response
        dashboardApi.endpoints.getDashboardOverview.initiate('empty')
      )

      const result = await promise

      expect(result.isSuccess).toBe(true)
      expect(result.data).toBeDefined()

      const data = result.data as OverviewStats
      expect(data.totalBookings).toBe(0)
      expect(data.totalRevenue).toBe(0)
      expect(data.totalCustomers).toBe(0)

      promise.unsubscribe()
    })
  })

  // ==========================================================================
  // Transformation
  // ==========================================================================

  describe('Response Transformation', () => {
    it('should transform DashboardOverviewResponse to OverviewStats', async () => {
      const store = createTestStore()

      const promise = store.dispatch(dashboardApi.endpoints.getDashboardOverview.initiate('month'))

      const result = await promise
      const data = result.data as OverviewStats

      // Verify all required OverviewStats fields exist
      expect(data).toHaveProperty('totalBookings')
      expect(data).toHaveProperty('totalRevenue')
      expect(data).toHaveProperty('totalCustomers')
      expect(data).toHaveProperty('activeServices')
      expect(data).toHaveProperty('totalUsers')
      expect(data).toHaveProperty('activeGroomers')
      expect(data).toHaveProperty('completedBookingsToday')
      expect(data).toHaveProperty('pendingBookings')
      expect(data).toHaveProperty('averageRating')
      expect(data).toHaveProperty('bookingGrowth')
      expect(data).toHaveProperty('revenueGrowth')
      expect(data).toHaveProperty('monthlyGrowth')
      expect(data).toHaveProperty('averageBookingValue')
      expect(data).toHaveProperty('periodLabel')
      expect(data).toHaveProperty('period')
      expect(data).toHaveProperty('recentActivity')
      expect(data).toHaveProperty('topServices')
      expect(data).toHaveProperty('monthlyRevenue')
      expect(data).toHaveProperty('userGrowth')
      expect(data).toHaveProperty('isLoading')
      expect(data).toHaveProperty('error')

      promise.unsubscribe()
    })

    it('should keep date strings as ISO for Redux serialization', async () => {
      const store = createTestStore()

      const promise = store.dispatch(dashboardApi.endpoints.getDashboardOverview.initiate('month'))

      const result = await promise
      const data = result.data as OverviewStats

      // Dates are kept as ISO strings for Redux serialization
      expect(typeof data.period.startDate).toBe('string')
      expect(typeof data.period.endDate).toBe('string')
      // Should be valid ISO strings
      expect(new Date(data.period.startDate).getTime()).not.toBeNaN()
      expect(new Date(data.period.endDate).getTime()).not.toBeNaN()

      promise.unsubscribe()
    })

    it('should calculate derived metrics correctly', async () => {
      const store = createTestStore()

      const promise = store.dispatch(dashboardApi.endpoints.getDashboardOverview.initiate('month'))

      const result = await promise
      const data = result.data as OverviewStats

      // Verify derived metrics are numbers
      expect(typeof data.activeGroomers).toBe('number')
      expect(typeof data.completedBookingsToday).toBe('number')
      expect(typeof data.averageRating).toBe('number')
      expect(typeof data.monthlyGrowth).toBe('number')

      // Verify arrays are populated
      expect(Array.isArray(data.recentActivity)).toBe(true)
      expect(Array.isArray(data.topServices)).toBe(true)
      expect(Array.isArray(data.monthlyRevenue)).toBe(true)
      expect(Array.isArray(data.userGrowth)).toBe(true)

      promise.unsubscribe()
    })
  })

  // ==========================================================================
  // Cache Behavior
  // ==========================================================================

  describe('Cache Behavior', () => {
    it('should cache query results', async () => {
      const store = createTestStore()

      // First query
      const promise1 = store.dispatch(dashboardApi.endpoints.getDashboardOverview.initiate('month'))
      await promise1

      // Get cache state
      const state1 = store.getState()
      const cacheEntry1 = state1[dashboardApi.reducerPath].queries['getDashboardOverview("month")']

      expect(cacheEntry1).toBeDefined()
      expect(cacheEntry1?.status).toBe('fulfilled')

      // Second query with same params - should use cache
      const promise2 = store.dispatch(dashboardApi.endpoints.getDashboardOverview.initiate('month'))
      await promise2

      const state2 = store.getState()
      const cacheEntry2 = state2[dashboardApi.reducerPath].queries['getDashboardOverview("month")']

      expect(cacheEntry2).toBe(cacheEntry1) // Same cache entry

      promise1.unsubscribe()
      promise2.unsubscribe()
    })

    it('should create separate cache entries for different time ranges', async () => {
      const store = createTestStore()

      const promise1 = store.dispatch(dashboardApi.endpoints.getDashboardOverview.initiate('week'))
      const promise2 = store.dispatch(dashboardApi.endpoints.getDashboardOverview.initiate('month'))

      await Promise.all([promise1, promise2])

      const state = store.getState()
      const queries = state[dashboardApi.reducerPath].queries

      expect(queries['getDashboardOverview("week")']).toBeDefined()
      expect(queries['getDashboardOverview("month")']).toBeDefined()

      promise1.unsubscribe()
      promise2.unsubscribe()
    })
  })

  // ==========================================================================
  // Error Handling
  // ==========================================================================

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      const store = createTestStore()

      // Note: 'error' is a test-only value to trigger error response in the mock
      const promise = store.dispatch(
        // @ts-expect-error - Using test-only value to trigger error response
        dashboardApi.endpoints.getDashboardOverview.initiate('error')
      )

      const result = await promise

      expect(result.isError).toBe(true)
      expect(result.error).toBeDefined()

      promise.unsubscribe()
    })

    it('should maintain error state in cache', async () => {
      const store = createTestStore()

      // Note: 'error' is a test-only value to trigger error response in the mock
      const promise = store.dispatch(
        // @ts-expect-error - Using test-only value to trigger error response
        dashboardApi.endpoints.getDashboardOverview.initiate('error')
      )

      await promise

      const state = store.getState()
      const cacheEntry = state[dashboardApi.reducerPath].queries['getDashboardOverview("error")']

      expect(cacheEntry?.status).toBe('rejected')
      expect(cacheEntry?.error).toBeDefined()

      promise.unsubscribe()
    })
  })

  // ==========================================================================
  // Type Safety
  // ==========================================================================

  describe('Type Safety', () => {
    it('should return correctly typed OverviewStats', async () => {
      const store = createTestStore()

      const promise = store.dispatch(dashboardApi.endpoints.getDashboardOverview.initiate('month'))

      const result = await promise
      const data = result.data

      if (data) {
        // TypeScript should infer these correctly
        const bookings: number = data.totalBookings
        const revenue: number = data.totalRevenue
        const label: string = data.periodLabel
        const startDate: string = data.period.startDate

        expect(bookings).toBe(150)
        expect(revenue).toBe(15000000)
        expect(typeof label).toBe('string')
        expect(typeof startDate).toBe('string')
      }

      promise.unsubscribe()
    })
  })

  // ==========================================================================
  // Integration Tests
  // ==========================================================================

  describe('Integration Tests', () => {
    it('should work with Redux store', async () => {
      const store = createTestStore()

      // Verify store has dashboardApi reducer
      const state = store.getState()
      expect(state[dashboardApi.reducerPath]).toBeDefined()

      // Verify we can dispatch queries
      const promise = store.dispatch(dashboardApi.endpoints.getDashboardOverview.initiate('month'))

      const result = await promise
      expect(result.isSuccess).toBe(true)

      promise.unsubscribe()
    })

    it('should handle multiple concurrent queries', async () => {
      const store = createTestStore()

      const promises = [
        store.dispatch(dashboardApi.endpoints.getDashboardOverview.initiate('week')),
        store.dispatch(dashboardApi.endpoints.getDashboardOverview.initiate('month')),
        store.dispatch(dashboardApi.endpoints.getDashboardOverview.initiate('year')),
      ]

      const results = await Promise.all(promises)

      results.forEach((result) => {
        expect(result.isSuccess).toBe(true)
        expect(result.data).toBeDefined()
      })

      promises.forEach((promise) => promise.unsubscribe())
    })
  })
})
