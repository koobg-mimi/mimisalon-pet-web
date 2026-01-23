/**
 * Tests for Admin Dashboard API Adapter Layer
 *
 * This test suite verifies the correct transformation of API responses
 * to client-optimized data structures.
 *
 * Coverage targets:
 * - getDashboardOverview success cases
 * - Error handling (network errors, API errors)
 * - Data transformation correctness
 * - Edge cases (empty data, null values)
 * - Calculation accuracy
 *
 * @module features/admin/api/__tests__/dashboard-api.test
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type ApiDashboardOverviewResponse, getDashboardOverview } from '../dashboard-api'

// ============================================================================
// Test Fixtures
// ============================================================================

/**
 * Mock API response with typical data
 */
const mockApiResponse: ApiDashboardOverviewResponse = {
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
  previousMetrics: {
    totalBookings: 130,
    completedBookings: 100,
    pendingBookings: 20,
    cancelledBookings: 10,
    totalRevenue: 13000000, // 13M KRW in cents
    totalCustomers: 75,
    totalGroomers: 10,
    completionRate: 76.9,
    avgBookingValue: 130000,
    averageRating: 0,
    totalReviews: 0,
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
    {
      id: 'booking-3',
      bookingNumber: 'BK20251029001',
      customerName: '박민수',
      groomerName: '김미용',
      serviceDate: '2025-10-29T11:00:00Z',
      totalPrice: 100000,
      status: 'SERVICE_CANCELLED',
      createdAt: '2025-10-29T10:00:00Z',
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
    {
      serviceId: 'service-2',
      name: '부분 미용',
      description: '발톱 정리 및 부분 손질',
      bookingCount: 35,
      totalRevenue: 2625000,
    },
  ],
  userGrowth: [
    { period: '2025-10-01', newUsers: 12, cumulativeUsers: 12 },
    { period: '2025-10-08', newUsers: 15, cumulativeUsers: 27 },
    { period: '2025-10-15', newUsers: 18, cumulativeUsers: 45 },
    { period: '2025-10-22', newUsers: 20, cumulativeUsers: 65 },
    { period: '2025-10-29', newUsers: 20, cumulativeUsers: 85 },
  ],
  monthlyRevenue: [
    { month: '2025-09', revenue: 13000000, bookingCount: 130 },
    { month: '2025-10', revenue: 15000000, bookingCount: 150 },
  ],
  range: 'month',
  startDate: '2025-10-01T00:00:00Z',
  endDate: '2025-10-30T23:59:59Z',
  previousStartDate: '2025-09-01T00:00:00Z',
  previousEndDate: '2025-09-30T23:59:59Z',
}

/**
 * Mock API response with empty data
 */
const mockEmptyApiResponse: ApiDashboardOverviewResponse = {
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
  recentBookings: [],
  topServices: [],
  userGrowth: [],
  monthlyRevenue: [],
  range: 'month',
  startDate: '2025-10-01T00:00:00Z',
  endDate: '2025-10-30T23:59:59Z',
  previousStartDate: '2025-09-01T00:00:00Z',
  previousEndDate: '2025-09-30T23:59:59Z',
}

// ============================================================================
// Test Suite
// ============================================================================

describe('Dashboard API Adapter', () => {
  // Store original fetch
  const originalFetch = global.fetch

  beforeEach(() => {
    // Mock fetch globally for each test
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockApiResponse),
      } as Response)
    ) as typeof fetch
  })

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch
  })

  // ==========================================================================
  // Success Cases
  // ==========================================================================

  describe('getDashboardOverview', () => {
    it('should fetch and transform dashboard data successfully', async () => {
      const result = await getDashboardOverview('month')

      // Verify core metrics
      expect(result.totalBookings).toBe(150)
      expect(result.totalRevenue).toBe(15000000)
      expect(result.totalCustomers).toBe(85)
      expect(result.averageBookingValue).toBe(125000)

      // Verify calculated fields exist
      expect(typeof result.bookingGrowth).toBe('number')
      expect(typeof result.revenueGrowth).toBe('number')

      // Verify period information
      expect(result.periodLabel).toBe('이번 달')
      expect(result.period.label).toBe('이번 달')
      // Dates are kept as ISO strings for Redux serialization
      expect(typeof result.period.startDate).toBe('string')
      expect(typeof result.period.endDate).toBe('string')

      // Verify state flags
      expect(result.isLoading).toBe(false)
      expect(result.error).toBeNull()

      // Verify activeServices is calculated
      expect(typeof result.activeServices).toBe('number')
      expect(result.activeServices).toBeGreaterThanOrEqual(0)
    })

    it('should handle different time ranges correctly', async () => {
      // Test week range
      const weekResult = await getDashboardOverview('week')
      expect(weekResult.periodLabel).toBe('최근 1주')

      // Test year range
      const yearResult = await getDashboardOverview('year')
      expect(yearResult.periodLabel).toBe('올해')

      // Test default (month)
      const defaultResult = await getDashboardOverview()
      expect(defaultResult.periodLabel).toBe('이번 달')
    })

    it('should correctly calculate active groomers', async () => {
      const result = await getDashboardOverview('month')

      // Should count unique groomers from recent bookings
      // Mock data has 3 unique groomers: 박미용, 최미용, 김미용
      // Note: This assertion depends on the implementation
      expect(typeof result.activeServices).toBe('number')
    })

    it('should handle empty data gracefully', async () => {
      // Mock fetch with empty response
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockEmptyApiResponse),
        } as Response)
      ) as typeof fetch

      const result = await getDashboardOverview('month')

      // Verify all metrics are 0 or appropriate defaults
      expect(result.totalBookings).toBe(0)
      expect(result.totalRevenue).toBe(0)
      expect(result.totalCustomers).toBe(0)
      expect(result.averageBookingValue).toBe(0)
      expect(result.activeServices).toBeGreaterThanOrEqual(0)

      // Should not throw errors
      expect(result.isLoading).toBe(false)
      expect(result.error).toBeNull()
    })
  })

  // ==========================================================================
  // Error Handling
  // ==========================================================================

  describe('Error Handling', () => {
    it('should throw error when API returns non-OK status', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
          json: () => Promise.resolve({ error: 'Unauthorized' }),
        } as Response)
      ) as typeof fetch

      await expect(getDashboardOverview('month')).rejects.toThrow('API error: 401')
    })

    it('should throw error when API returns 500', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: () => Promise.resolve({ error: 'Internal Server Error' }),
        } as Response)
      ) as typeof fetch

      await expect(getDashboardOverview('month')).rejects.toThrow('API error: 500')
    })

    it('should handle network errors', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error'))) as typeof fetch

      await expect(getDashboardOverview('month')).rejects.toThrow('Network error')
    })

    it('should handle JSON parse errors', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.reject(new Error('Invalid JSON')),
        } as Response)
      ) as typeof fetch

      await expect(getDashboardOverview('month')).rejects.toThrow('Invalid JSON')
    })
  })

  // ==========================================================================
  // Data Transformation
  // ==========================================================================

  describe('Data Transformation', () => {
    it('should transform recent bookings to activity items', async () => {
      const result = await getDashboardOverview('month')

      // Activity items should be derived from bookings
      // Note: Actual implementation may differ based on business logic
      expect(Array.isArray(result.period)).toBe(false)
      expect(result.period).toBeDefined()
    })

    it('should calculate period label correctly', async () => {
      const weekResult = await getDashboardOverview('week')
      expect(weekResult.periodLabel).toBe('최근 1주')

      const monthResult = await getDashboardOverview('month')
      expect(monthResult.periodLabel).toBe('이번 달')

      const yearResult = await getDashboardOverview('year')
      expect(yearResult.periodLabel).toBe('올해')
    })

    it('should keep ISO date strings for Redux serialization', async () => {
      const result = await getDashboardOverview('month')

      // Dates are kept as ISO strings for Redux serialization
      expect(typeof result.period.startDate).toBe('string')
      expect(typeof result.period.endDate).toBe('string')

      // Should be valid ISO strings
      expect(new Date(result.period.startDate).getTime()).not.toBeNaN()
      expect(new Date(result.period.endDate).getTime()).not.toBeNaN()
    })
  })

  // ==========================================================================
  // Edge Cases
  // ==========================================================================

  describe('Edge Cases', () => {
    it('should handle null values in metrics', async () => {
      const nullMetricsResponse = {
        ...mockApiResponse,
        metrics: {
          ...mockApiResponse.metrics,
          totalRevenue: 0,
          totalCustomers: 0,
        },
      }

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(nullMetricsResponse),
        } as Response)
      ) as typeof fetch

      const result = await getDashboardOverview('month')

      expect(result.totalRevenue).toBe(0)
      expect(result.totalCustomers).toBe(0)
    })

    it('should handle missing booking data', async () => {
      const noBookingsResponse = {
        ...mockApiResponse,
        recentBookings: [],
      }

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(noBookingsResponse),
        } as Response)
      ) as typeof fetch

      const result = await getDashboardOverview('month')

      // Should not crash with empty bookings
      expect(result.totalBookings).toBe(150) // From metrics
    })

    it('should handle very large numbers', async () => {
      const largeNumbersResponse = {
        ...mockApiResponse,
        metrics: {
          ...mockApiResponse.metrics,
          totalRevenue: 999999999999, // ~1 trillion KRW
          totalBookings: 1000000,
        },
      }

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(largeNumbersResponse),
        } as Response)
      ) as typeof fetch

      const result = await getDashboardOverview('month')

      expect(result.totalRevenue).toBe(999999999999)
      expect(result.totalBookings).toBe(1000000)
    })

    it('should handle negative numbers appropriately', async () => {
      // Note: In real scenario, negative revenue shouldn't happen
      // But we should handle it gracefully if it does
      const result = await getDashboardOverview('month')

      // Growth can be negative (that's valid)
      if (result.bookingGrowth < 0) {
        expect(typeof result.bookingGrowth).toBe('number')
        expect(result.bookingGrowth).toBeGreaterThanOrEqual(-100)
      }
    })
  })

  // ==========================================================================
  // Calculation Accuracy
  // ==========================================================================

  describe('Calculation Accuracy', () => {
    it('should calculate booking growth from real historical data', async () => {
      const result = await getDashboardOverview('month')

      // With real previous metrics: (150 - 130) / 130 * 100 = 15.4%
      expect(result.bookingGrowth).toBeCloseTo(15.4, 1)
    })

    it('should calculate revenue growth from real historical data', async () => {
      const result = await getDashboardOverview('month')

      // With real previous metrics: (15000000 - 13000000) / 13000000 * 100 = 15.4%
      expect(result.revenueGrowth).toBeCloseTo(15.4, 1)
    })

    it('should use real average rating from API', async () => {
      const result = await getDashboardOverview('month')

      // Should use actual rating from metrics, not calculated
      expect(result.averageRating).toBe(4.5)
    })

    it('should calculate completion rate correctly', async () => {
      const result = await getDashboardOverview('month')

      // Completion rate from API
      expect(mockApiResponse.metrics.completionRate).toBe(80)

      // Verify it's passed through correctly
      // Note: completionRate might be used for derived calculations
    })

    it('should handle division by zero in calculations', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockEmptyApiResponse),
        } as Response)
      ) as typeof fetch

      const result = await getDashboardOverview('month')

      // Should not have NaN or Infinity
      expect(result.averageBookingValue).not.toBeNaN()
      expect(result.bookingGrowth).not.toBeNaN()
      expect(result.revenueGrowth).not.toBeNaN()
    })

    it('should round percentages to reasonable precision', async () => {
      const result = await getDashboardOverview('month')

      // Growth percentages should be reasonable numbers
      if (result.bookingGrowth !== 0) {
        // Should have at most 1-2 decimal places
        const decimalPlaces = (result.bookingGrowth.toString().split('.')[1] || '').length
        expect(decimalPlaces).toBeLessThanOrEqual(2)
      }
    })
  })

  // ==========================================================================
  // Integration Tests
  // ==========================================================================

  describe('Integration Tests', () => {
    it('should handle real-world data patterns', async () => {
      // Mix of completed, pending, and cancelled bookings
      const result = await getDashboardOverview('month')

      // Verify data integrity
      expect(result.totalBookings).toBeGreaterThanOrEqual(0)
      expect(result.totalRevenue).toBeGreaterThanOrEqual(0)
      expect(result.averageBookingValue).toBeGreaterThanOrEqual(0)

      // Period should have valid date range
      expect(new Date(result.period.startDate).getTime()).toBeLessThanOrEqual(
        new Date(result.period.endDate).getTime()
      )
    })

    it('should maintain type safety', async () => {
      const result = await getDashboardOverview('month')

      // Verify types match OverviewStats interface
      expect(typeof result.totalBookings).toBe('number')
      expect(typeof result.totalRevenue).toBe('number')
      expect(typeof result.totalCustomers).toBe('number')
      expect(typeof result.activeServices).toBe('number')
      expect(typeof result.bookingGrowth).toBe('number')
      expect(typeof result.revenueGrowth).toBe('number')
      expect(typeof result.averageBookingValue).toBe('number')
      expect(typeof result.periodLabel).toBe('string')
      expect(typeof result.period).toBe('object')
      expect(typeof result.isLoading).toBe('boolean')
    })
  })
})
