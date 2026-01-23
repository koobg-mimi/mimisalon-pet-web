/**
 * Tests for useDashboardOverview hook (RTK Query version)
 *
 * Test coverage:
 * - Successful data fetching via RTK Query
 * - Loading states during fetch
 * - Error handling through RTK Query
 * - Session-based query skipping
 * - Integration with Redux store
 * - Interface compatibility with original TanStack Query version
 *
 * Migration Note:
 * This test suite has been updated to test the RTK Query implementation
 * while maintaining the same interface as the original TanStack Query version.
 */

import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useDashboardOverview, type TimeRange } from '../use-dashboard-overview'
import { dashboardApi } from '../../state/dashboard-api-slice'
import type { DashboardOverviewResponse } from '@/app/api/admin/dashboard/overview/route'
import type { ReactNode } from 'react'

// Apply mocks before imports
vi.mock('@/lib/auth-client')

import * as authClient from '@/lib/auth-client'

// ============================================================================
// Mock Data
// ============================================================================

const mockApiResponse: DashboardOverviewResponse = {
  metrics: {
    totalBookings: 150,
    completedBookings: 120,
    pendingBookings: 25,
    cancelledBookings: 5,
    totalRevenue: 15000000,
    totalCustomers: 85,
    totalGroomers: 12,
    completionRate: 80,
    avgBookingValue: 125000,
    averageRating: 4.5,
    totalReviews: 100,
  },
  previousMetrics: {
    totalBookings: 140,
    completedBookings: 110,
    pendingBookings: 25,
    cancelledBookings: 5,
    totalRevenue: 14000000,
    totalCustomers: 80,
    totalGroomers: 12,
    completionRate: 78,
    avgBookingValue: 120000,
    averageRating: 4.4,
    totalReviews: 90,
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
  ],
  topServices: [],
  userGrowth: [],
  monthlyRevenue: [],
  range: 'month',
  startDate: '2025-10-01T00:00:00Z',
  endDate: '2025-10-30T23:59:59Z',
  previousStartDate: '2025-09-01T00:00:00Z',
  previousEndDate: '2025-09-30T23:59:59Z',
}

const mockSession = {
  user: {
    id: 'test-user-id',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    email: 'admin@test.com',
    emailVerified: true,
    name: 'Test Admin',
    image: null,
    banned: null,
    role: 'ADMIN',
    banReason: null,
    banExpires: null,
    phoneNumber: null,
    phoneNumberVerified: false,
  },
  session: {
    id: 'test-session-id',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    userId: 'test-user-id',
    expiresAt: new Date(Date.now() + 86400000),
    token: 'test-token',
    ipAddress: null,
    userAgent: null,
    impersonatedBy: null,
  },
}

// ============================================================================
// MSW Server Setup
// ============================================================================

const server = setupServer(
  http.get('/api/admin/dashboard/overview', ({ request }) => {
    const url = new URL(request.url)
    const range = url.searchParams.get('range')

    if (range === 'error') {
      return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    return HttpResponse.json({
      ...mockApiResponse,
      range: range || 'month',
    })
  })
)

// ============================================================================
// Test Utilities
// ============================================================================

function createTestStore() {
  return configureStore({
    reducer: {
      [dashboardApi.reducerPath]: dashboardApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(dashboardApi.middleware),
  })
}

function createWrapper(store: ReturnType<typeof createTestStore>) {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )
  Wrapper.displayName = 'ReduxTestWrapper'
  return Wrapper
}

// ============================================================================
// Tests
// ============================================================================

describe('useDashboardOverview (RTK Query)', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  beforeEach(() => {
    vi.clearAllMocks()
    // Setup default mock: authenticated user
    vi.mocked(authClient.useSession).mockReturnValue({
      data: mockSession,
      isPending: false,
      error: null,
      isRefetching: false,
      refetch: vi.fn(),
    })
  })

  afterEach(() => {
    server.resetHandlers()
    vi.clearAllMocks()
  })

  afterAll(() => {
    server.close()
  })

  // ==========================================================================
  // Success Cases
  // ==========================================================================

  it('should fetch dashboard data successfully', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useDashboardOverview('month'), {
      wrapper: createWrapper(store),
    })

    // Initially loading
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()

    // Wait for successful fetch
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify data was fetched
    expect(result.current.data).toBeDefined()
    expect(result.current.data?.totalBookings).toBe(150)
    expect(result.current.data?.totalRevenue).toBe(15000000)
    expect(result.current.isError).toBe(false)
  })

  it('should use default timeRange of "month" when not specified', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useDashboardOverview(), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    expect(result.current.data?.periodLabel).toBe('이번 달')
  })

  it('should fetch data for different time ranges', async () => {
    const timeRanges: TimeRange[] = ['week', 'month', 'year']
    const expectedLabels = {
      week: '최근 1주',
      month: '이번 달',
      year: '올해',
    }

    for (const range of timeRanges) {
      const store = createTestStore()
      const { result } = renderHook(() => useDashboardOverview(range), {
        wrapper: createWrapper(store),
      })

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      expect(result.current.data?.periodLabel).toBe(expectedLabels[range])
    }
  })

  // ==========================================================================
  // Loading State
  // ==========================================================================

  it('should show loading state initially', () => {
    const store = createTestStore()
    const { result } = renderHook(() => useDashboardOverview('month'), {
      wrapper: createWrapper(store),
    })

    // Check initial loading state
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeNull()
  })

  // ==========================================================================
  // Session Checks
  // ==========================================================================

  it('should not fetch when user is not authenticated', () => {
    // Mock no session (unauthenticated)
    vi.mocked(authClient.useSession).mockReturnValue({
      data: null,
      isPending: false,
      error: null,
      isRefetching: false,
      refetch: vi.fn(),
    })

    const store = createTestStore()
    const { result } = renderHook(() => useDashboardOverview('month'), {
      wrapper: createWrapper(store),
    })

    // Query should be skipped
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it('should not fetch when session is pending', () => {
    // Mock pending session state
    vi.mocked(authClient.useSession).mockReturnValue({
      data: null,
      isPending: true,
      error: null,
      isRefetching: false,
      refetch: vi.fn(),
    })

    const store = createTestStore()
    const { result } = renderHook(() => useDashboardOverview('month'), {
      wrapper: createWrapper(store),
    })

    // Query should be skipped while session loads
    expect(result.current.isLoading).toBe(true) // isSessionPending is true
    expect(result.current.data).toBeUndefined()
  })

  // ==========================================================================
  // Error Handling
  // ==========================================================================

  it('should handle API errors', async () => {
    server.use(
      http.get('/api/admin/dashboard/overview', () => {
        return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 })
      })
    )

    const store = createTestStore()
    const { result } = renderHook(() => useDashboardOverview('month'), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    expect(result.current.isError).toBe(true)
    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  // ==========================================================================
  // Interface Compatibility
  // ==========================================================================

  it('should return TanStack Query-compatible interface', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useDashboardOverview('month'), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify interface matches original TanStack Query return type
    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('isError')
    expect(result.current).toHaveProperty('error')
    expect(result.current).toHaveProperty('refetch')

    // Verify refetch is a function
    expect(typeof result.current.refetch).toBe('function')
  })

  // ==========================================================================
  // Data Structure
  // ==========================================================================

  it('should return correctly structured OverviewStats', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useDashboardOverview('month'), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    const data = result.current.data

    expect(data).toBeDefined()
    if (data) {
      // Core metrics
      expect(typeof data.totalBookings).toBe('number')
      expect(typeof data.totalRevenue).toBe('number')
      expect(typeof data.totalCustomers).toBe('number')
      expect(typeof data.activeServices).toBe('number')

      // Calculated metrics
      expect(typeof data.bookingGrowth).toBe('number')
      expect(typeof data.revenueGrowth).toBe('number')
      expect(typeof data.averageBookingValue).toBe('number')

      // Period information
      expect(typeof data.periodLabel).toBe('string')
      expect(data.period.startDate).toBeInstanceOf(Date)
      expect(data.period.endDate).toBeInstanceOf(Date)

      // Arrays
      expect(Array.isArray(data.recentActivity)).toBe(true)
      expect(Array.isArray(data.topServices)).toBe(true)
      expect(Array.isArray(data.monthlyRevenue)).toBe(true)
      expect(Array.isArray(data.userGrowth)).toBe(true)

      // State flags
      expect(data.isLoading).toBe(false)
      expect(data.error).toBeNull()
    }
  })

  // ==========================================================================
  // Cache Behavior (RTK Query)
  // ==========================================================================

  it('should use RTK Query cache for repeated calls', async () => {
    const store = createTestStore()

    // First render
    const { result: result1 } = renderHook(() => useDashboardOverview('month'), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result1.current.isLoading).toBe(false), { timeout: 3000 })

    const firstData = result1.current.data

    // Second render with same store - should use cache
    const { result: result2 } = renderHook(() => useDashboardOverview('month'), {
      wrapper: createWrapper(store),
    })

    // Should have data immediately from cache
    await waitFor(() => expect(result2.current.data).toBeDefined(), { timeout: 1000 })

    expect(result2.current.data).toEqual(firstData)
  })

  it('should fetch separately for different time ranges', async () => {
    const store = createTestStore()

    // Fetch for 'week'
    const { result: result1 } = renderHook(() => useDashboardOverview('week'), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result1.current.isLoading).toBe(false), { timeout: 3000 })

    // Fetch for 'month'
    const { result: result2 } = renderHook(() => useDashboardOverview('month'), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result2.current.isLoading).toBe(false), { timeout: 3000 })

    // Different ranges should have different data
    expect(result1.current.data?.periodLabel).toBe('최근 1주')
    expect(result2.current.data?.periodLabel).toBe('이번 달')
  })

  // ==========================================================================
  // Type Safety
  // ==========================================================================

  it('should maintain type safety with RTK Query', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useDashboardOverview('month'), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // TypeScript should infer correct types
    const data = result.current.data

    if (data) {
      // These should not throw TypeScript errors
      const bookings: number = data.totalBookings
      const revenue: number = data.totalRevenue
      const label: string = data.periodLabel
      const startDate: string = data.period.startDate

      expect(bookings).toBe(150)
      expect(revenue).toBe(15000000)
      expect(typeof label).toBe('string')
      expect(typeof startDate).toBe('string')
    }
  })

  // ==========================================================================
  // Refetch Functionality
  // ==========================================================================

  it('should support refetch', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useDashboardOverview('month'), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify refetch function exists and is callable
    expect(typeof result.current.refetch).toBe('function')

    // Call refetch
    const refetchResult = result.current.refetch()

    // RTK Query refetch returns a Promise
    expect(refetchResult).toBeInstanceOf(Promise)
  })

  // ==========================================================================
  // Integration with Redux
  // ==========================================================================

  it('should integrate with Redux store', async () => {
    const store = createTestStore()
    const { result } = renderHook(() => useDashboardOverview('month'), {
      wrapper: createWrapper(store),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

    // Verify data is in Redux store
    const state = store.getState()
    expect(state[dashboardApi.reducerPath]).toBeDefined()

    const queries = state[dashboardApi.reducerPath].queries
    expect(Object.keys(queries).length).toBeGreaterThan(0)
  })
})
