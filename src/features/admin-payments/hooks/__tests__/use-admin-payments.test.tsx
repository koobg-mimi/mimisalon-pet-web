/**
 * Integration tests for useAdminPayments hook
 *
 * Test coverage:
 * - Data fetching and transformation via RTK Query
 * - Loading states (isLoading, isFetching)
 * - Pagination metadata computation
 * - Computed values (isEmpty, hasNextPage, hasPreviousPage)
 * - Filter handling (search, status)
 * - Page navigation
 * - Error states
 * - Query enabling/disabling
 * - Refetch functionality
 * - Default parameters
 * - Redux store integration
 *
 * Target coverage: 95%+
 */

import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useAdminPayments } from '../use-admin-payments'
import { adminPaymentsApi } from '../../state/admin-payments-api-slice'
import type { PaymentFilters } from '../../types/payment.types'
import type { ReactNode } from 'react'
import {
  mockPaymentsResponse,
  mockEmptyPaymentsResponse,
  mockPayments,
} from '../../__tests__/mocks/data'
import { adminPaymentsHandlers } from '../../__tests__/mocks/handlers'

// ============================================================================
// MSW Server Setup
// ============================================================================

const server = setupServer(...adminPaymentsHandlers)

// ============================================================================
// Test Utilities
// ============================================================================

function createTestStore() {
  return configureStore({
    reducer: {
      [adminPaymentsApi.reducerPath]: adminPaymentsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(adminPaymentsApi.middleware),
  })
}

function createWrapper(store: ReturnType<typeof createTestStore>) {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )
  Wrapper.displayName = 'ReduxTestWrapper'
  return Wrapper
}

const defaultFilters: PaymentFilters = {
  searchQuery: '',
  statusFilter: 'ALL',
}

// ============================================================================
// Tests
// ============================================================================

describe('useAdminPayments', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  // ==========================================================================
  // Data Fetching
  // ==========================================================================

  describe('data fetching', () => {
    it('should return payments from API', async () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      // Initially loading
      expect(result.current.isLoading).toBe(true)
      expect(result.current.payments).toEqual([])

      // Wait for successful fetch
      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      // Verify data was fetched
      expect(result.current.payments.length).toBeGreaterThan(0)
      expect(result.current.payments).toEqual(mockPaymentsResponse.payments)
      expect(result.current.isError).toBe(false)
    })

    it('should return empty array when no payments found', async () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: { ...defaultFilters, searchQuery: 'no-results' },
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      expect(result.current.payments).toEqual([])
      expect(result.current.pagination.totalCount).toBe(0)
    })

    it('should fetch payments for different pages', async () => {
      const store = createTestStore()

      // Fetch page 1
      const { result: result1 } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result1.current.isLoading).toBe(false), { timeout: 3000 })

      expect(result1.current.pagination.currentPage).toBe(1)

      // Fetch page 2
      const { result: result2 } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 2,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result2.current.isLoading).toBe(false), { timeout: 3000 })

      expect(result2.current.pagination.currentPage).toBe(2)
    })

    it('should use default limit of 20', async () => {
      const store = createTestStore()
      let capturedUrl = ''

      // Intercept request to verify limit parameter
      server.use(
        http.get('/api/admin/payments', ({ request }) => {
          capturedUrl = request.url
          return HttpResponse.json(mockPaymentsResponse)
        })
      )

      renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
            // limit not specified - should default to 20
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(capturedUrl).not.toBe(''), { timeout: 3000 })

      const url = new URL(capturedUrl)
      expect(url.searchParams.get('limit')).toBe('20')
    })

    it('should respect custom limit parameter', async () => {
      const store = createTestStore()
      let capturedUrl = ''

      server.use(
        http.get('/api/admin/payments', ({ request }) => {
          capturedUrl = request.url
          return HttpResponse.json(mockPaymentsResponse)
        })
      )

      renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
            limit: 50,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(capturedUrl).not.toBe(''), { timeout: 3000 })

      const url = new URL(capturedUrl)
      expect(url.searchParams.get('limit')).toBe('50')
    })
  })

  // ==========================================================================
  // Pagination Metadata
  // ==========================================================================

  describe('pagination', () => {
    it('should return correct pagination metadata', async () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      expect(result.current.pagination).toEqual({
        currentPage: mockPaymentsResponse.currentPage,
        totalPages: mockPaymentsResponse.totalPages,
        totalCount: mockPaymentsResponse.totalCount,
      })
    })

    it('should use fallback values when data is undefined', () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 3,
            enabled: false, // Disabled query - no data
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      // When query is disabled, should use fallback values
      expect(result.current.pagination).toEqual({
        currentPage: 3, // Uses page parameter
        totalPages: 1, // Fallback
        totalCount: 0, // Fallback
      })
    })

    it('should update pagination when page changes', async () => {
      const store = createTestStore()

      // Page 1
      const { result: result1, unmount: unmount1 } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result1.current.isLoading).toBe(false), { timeout: 3000 })
      expect(result1.current.pagination.currentPage).toBe(1)

      unmount1()

      // Page 2
      const { result: result2 } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 2,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result2.current.isLoading).toBe(false), { timeout: 3000 })
      expect(result2.current.pagination.currentPage).toBe(2)
    })
  })

  // ==========================================================================
  // Loading States
  // ==========================================================================

  describe('loading states', () => {
    it('should return isLoading true initially', () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      expect(result.current.isLoading).toBe(true)
      expect(result.current.payments).toEqual([])
    })

    it('should return isLoading false after fetch completes', async () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.payments.length).toBeGreaterThan(0)
    })

    it('should return isFetching true during fetch', () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      expect(result.current.isFetching).toBe(true)
    })

    it('should return isFetching false after fetch', async () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isFetching).toBe(false), { timeout: 3000 })

      expect(result.current.isFetching).toBe(false)
    })

    it('should not fetch when enabled is false', () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
            enabled: false,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      expect(result.current.isLoading).toBe(false)
      expect(result.current.isFetching).toBe(false)
      expect(result.current.payments).toEqual([])
    })
  })

  // ==========================================================================
  // Computed Values
  // ==========================================================================

  describe('computed values', () => {
    it('should compute isEmpty correctly when no results and not loading', async () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: { ...defaultFilters, searchQuery: 'no-results' },
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      expect(result.current.isEmpty).toBe(true)
      expect(result.current.payments.length).toBe(0)
      expect(result.current.isLoading).toBe(false)
    })

    it('should compute isEmpty as false when has results', async () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      expect(result.current.isEmpty).toBe(false)
      expect(result.current.payments.length).toBeGreaterThan(0)
    })

    it('should compute isEmpty as false when loading', () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      // While loading, isEmpty should be false even if no data yet
      expect(result.current.isLoading).toBe(true)
      expect(result.current.isEmpty).toBe(false)
    })

    it('should compute hasNextPage correctly when on first page', async () => {
      // Mock response with multiple pages
      server.use(
        http.get('/api/admin/payments', () => {
          return HttpResponse.json({
            payments: mockPayments,
            currentPage: 1,
            totalPages: 3,
            totalCount: 60,
          })
        })
      )

      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      expect(result.current.hasNextPage).toBe(true)
      expect(result.current.pagination.currentPage).toBe(1)
      expect(result.current.pagination.totalPages).toBe(3)
    })

    it('should compute hasNextPage correctly when on last page', async () => {
      // Mock response on last page
      server.use(
        http.get('/api/admin/payments', () => {
          return HttpResponse.json({
            payments: mockPayments,
            currentPage: 3,
            totalPages: 3,
            totalCount: 60,
          })
        })
      )

      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 3,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      expect(result.current.hasNextPage).toBe(false)
      expect(result.current.pagination.currentPage).toBe(3)
      expect(result.current.pagination.totalPages).toBe(3)
    })

    it('should compute hasNextPage as false when only one page', async () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      // Mock response has totalPages: 1
      expect(result.current.hasNextPage).toBe(false)
      expect(result.current.pagination.totalPages).toBe(1)
    })

    it('should compute hasPreviousPage correctly when on first page', async () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      expect(result.current.hasPreviousPage).toBe(false)
      expect(result.current.pagination.currentPage).toBe(1)
    })

    it('should compute hasPreviousPage correctly when on second page', async () => {
      // Mock response with multiple pages
      server.use(
        http.get('/api/admin/payments', () => {
          return HttpResponse.json({
            payments: mockPayments,
            currentPage: 2,
            totalPages: 3,
            totalCount: 60,
          })
        })
      )

      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 2,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      expect(result.current.hasPreviousPage).toBe(true)
      expect(result.current.pagination.currentPage).toBe(2)
    })
  })

  // ==========================================================================
  // Filter Handling
  // ==========================================================================

  describe('filters', () => {
    it('should handle search query filter', async () => {
      const store = createTestStore()
      let capturedUrl = ''

      server.use(
        http.get('/api/admin/payments', ({ request }) => {
          capturedUrl = request.url
          return HttpResponse.json(mockPaymentsResponse)
        })
      )

      renderHook(
        () =>
          useAdminPayments({
            filters: { ...defaultFilters, searchQuery: 'portone-payment-1' },
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(capturedUrl).not.toBe(''), { timeout: 3000 })

      const url = new URL(capturedUrl)
      expect(url.searchParams.get('search')).toBe('portone-payment-1')
    })

    it('should handle status filter', async () => {
      const store = createTestStore()
      let capturedUrl = ''

      server.use(
        http.get('/api/admin/payments', ({ request }) => {
          capturedUrl = request.url
          return HttpResponse.json(mockPaymentsResponse)
        })
      )

      renderHook(
        () =>
          useAdminPayments({
            filters: { ...defaultFilters, statusFilter: 'PAID' },
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(capturedUrl).not.toBe(''), { timeout: 3000 })

      const url = new URL(capturedUrl)
      expect(url.searchParams.get('status')).toBe('PAID')
    })

    it('should not send status parameter when filter is ALL', async () => {
      const store = createTestStore()
      let capturedUrl = ''

      server.use(
        http.get('/api/admin/payments', ({ request }) => {
          capturedUrl = request.url
          return HttpResponse.json(mockPaymentsResponse)
        })
      )

      renderHook(
        () =>
          useAdminPayments({
            filters: { ...defaultFilters, statusFilter: 'ALL' },
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(capturedUrl).not.toBe(''), { timeout: 3000 })

      const url = new URL(capturedUrl)
      expect(url.searchParams.has('status')).toBe(false)
    })

    it('should handle combined filters', async () => {
      const store = createTestStore()
      let capturedUrl = ''

      server.use(
        http.get('/api/admin/payments', ({ request }) => {
          capturedUrl = request.url
          return HttpResponse.json(mockPaymentsResponse)
        })
      )

      renderHook(
        () =>
          useAdminPayments({
            filters: {
              searchQuery: 'test-search',
              statusFilter: 'PAID',
            },
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(capturedUrl).not.toBe(''), { timeout: 3000 })

      const url = new URL(capturedUrl)
      expect(url.searchParams.get('search')).toBe('test-search')
      expect(url.searchParams.get('status')).toBe('PAID')
    })

    it('should refetch when filters change', async () => {
      const store = createTestStore()

      // Initial render with no filters
      const { result, rerender } = renderHook(
        ({ filters }) => useAdminPayments({ filters, page: 1 }),
        {
          wrapper: createWrapper(store),
          initialProps: { filters: defaultFilters },
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      const initialPayments = result.current.payments

      // Change filters
      rerender({ filters: { ...defaultFilters, statusFilter: 'PAID' as const } })

      await waitFor(() => expect(result.current.isFetching).toBe(true), { timeout: 1000 })

      await waitFor(() => expect(result.current.isFetching).toBe(false), { timeout: 3000 })

      // Should have different data (or at least re-fetched)
      expect(result.current.payments).toBeDefined()
    })
  })

  // ==========================================================================
  // Page Changes
  // ==========================================================================

  describe('page changes', () => {
    it('should handle page changes', async () => {
      const store = createTestStore()

      const { result, rerender } = renderHook(
        ({ page }) => useAdminPayments({ filters: defaultFilters, page }),
        {
          wrapper: createWrapper(store),
          initialProps: { page: 1 },
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })
      expect(result.current.pagination.currentPage).toBe(1)

      // Change page
      rerender({ page: 2 })

      await waitFor(() => expect(result.current.isFetching).toBe(true), { timeout: 1000 })
      await waitFor(() => expect(result.current.isFetching).toBe(false), { timeout: 3000 })

      expect(result.current.pagination.currentPage).toBe(2)
    })
  })

  // ==========================================================================
  // Error Handling
  // ==========================================================================

  describe('error states', () => {
    it('should handle API errors', async () => {
      // Override handler to return error
      server.use(
        http.get('/api/admin/payments', () => {
          return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        })
      )

      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      expect(result.current.isError).toBe(true)
      expect(result.current.error).toBeDefined()
      expect(result.current.payments).toEqual([])
    })

    it('should handle network errors', async () => {
      // Simulate network error
      server.use(
        http.get('/api/admin/payments', () => {
          return HttpResponse.error()
        })
      )

      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      expect(result.current.isError).toBe(true)
      expect(result.current.error).toBeDefined()
    })
  })

  // ==========================================================================
  // Refetch Functionality
  // ==========================================================================

  describe('refetch functionality', () => {
    it('should provide refetch function', async () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      expect(result.current.refetch).toBeDefined()
      expect(typeof result.current.refetch).toBe('function')
    })

    it('should refetch data when refetch is called', async () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      const initialData = result.current.payments

      // Call refetch and wait for it to complete
      await result.current.refetch()

      // Data should be refreshed (refetch completed)
      expect(result.current.payments).toBeDefined()
      expect(result.current.payments.length).toBeGreaterThan(0)
    })
  })

  // ==========================================================================
  // RTK Query Integration
  // ==========================================================================

  describe('RTK Query integration', () => {
    it('should integrate with Redux store', async () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      // Verify data is in Redux store
      const state = store.getState()
      expect(state[adminPaymentsApi.reducerPath]).toBeDefined()

      const queries = state[adminPaymentsApi.reducerPath].queries
      expect(Object.keys(queries).length).toBeGreaterThan(0)
    })

    it('should use RTK Query cache for repeated calls', async () => {
      const store = createTestStore()

      // First render
      const { result: result1 } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result1.current.isLoading).toBe(false), { timeout: 3000 })

      const firstData = result1.current.payments

      // Second render with same store - should use cache
      const { result: result2 } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      // Should have data immediately from cache
      await waitFor(() => expect(result2.current.payments.length).toBeGreaterThan(0), {
        timeout: 1000,
      })

      expect(result2.current.payments).toEqual(firstData)
    })

    it('should return correct interface shape', async () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      // Verify interface has all required properties
      expect(result.current).toHaveProperty('payments')
      expect(result.current).toHaveProperty('pagination')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('isFetching')
      expect(result.current).toHaveProperty('isError')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('refetch')
      expect(result.current).toHaveProperty('isEmpty')
      expect(result.current).toHaveProperty('hasNextPage')
      expect(result.current).toHaveProperty('hasPreviousPage')

      // Verify types
      expect(Array.isArray(result.current.payments)).toBe(true)
      expect(typeof result.current.pagination).toBe('object')
      expect(typeof result.current.isLoading).toBe('boolean')
      expect(typeof result.current.isFetching).toBe('boolean')
      expect(typeof result.current.isError).toBe('boolean')
      expect(typeof result.current.refetch).toBe('function')
      expect(typeof result.current.isEmpty).toBe('boolean')
      expect(typeof result.current.hasNextPage).toBe('boolean')
      expect(typeof result.current.hasPreviousPage).toBe('boolean')
    })

    it('should validate pagination object structure', async () => {
      const store = createTestStore()
      const { result } = renderHook(
        () =>
          useAdminPayments({
            filters: defaultFilters,
            page: 1,
          }),
        {
          wrapper: createWrapper(store),
        }
      )

      await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })

      const { pagination } = result.current

      expect(pagination).toHaveProperty('currentPage')
      expect(pagination).toHaveProperty('totalPages')
      expect(pagination).toHaveProperty('totalCount')

      expect(typeof pagination.currentPage).toBe('number')
      expect(typeof pagination.totalPages).toBe('number')
      expect(typeof pagination.totalCount).toBe('number')

      expect(pagination.currentPage).toBeGreaterThanOrEqual(1)
      expect(pagination.totalPages).toBeGreaterThanOrEqual(0)
      expect(pagination.totalCount).toBeGreaterThanOrEqual(0)
    })
  })
})
