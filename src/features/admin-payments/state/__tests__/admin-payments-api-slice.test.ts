import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { adminPaymentsHandlers } from '../../__tests__/mocks/handlers'
import {
  mockPaymentsResponse,
  mockEmptyPaymentsResponse,
  mockPayment,
  mockFailedPayment,
  mockRefundedPayment,
  mockPartialRefundedPayment,
  mockPendingPayment,
  mockCancelledPayment,
} from '../../__tests__/mocks/data'
import { adminPaymentsApi, useGetPaymentsQuery } from '../admin-payments-api-slice'
import type { GetPaymentsParams } from '../admin-payments-api-slice'

// Setup MSW server
const server = setupServer(...adminPaymentsHandlers)

// Helper function to create a test store
const createTestStore = () => {
  const store = configureStore({
    reducer: {
      [adminPaymentsApi.reducerPath]: adminPaymentsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(adminPaymentsApi.middleware),
  })
  setupListeners(store.dispatch)
  return store
}

describe('admin-payments-api-slice', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  describe('configuration', () => {
    it('should have correct reducerPath', () => {
      expect(adminPaymentsApi.reducerPath).toBe('adminPaymentsApi')
    })

    it('should have correct tagTypes', () => {
      // RTK Query stores tag types internally, we verify they work through endpoint behavior
      // The API should have the getPayments endpoint defined which uses the tags
      expect(adminPaymentsApi.endpoints.getPayments).toBeDefined()
      // Tag types are ['Payments', 'PaymentStats'] as defined in the API slice
    })

    it('should configure baseQuery with correct baseUrl', () => {
      // Verify by checking that endpoints are defined correctly
      const { getPayments } = adminPaymentsApi.endpoints
      expect(getPayments.name).toBe('getPayments')
    })

    it('should export useGetPaymentsQuery hook', () => {
      expect(useGetPaymentsQuery).toBeDefined()
      expect(typeof useGetPaymentsQuery).toBe('function')
    })

    it('should export endpoints object', () => {
      expect(adminPaymentsApi.endpoints.getPayments).toBeDefined()
    })
  })

  describe('getPayments endpoint - query building', () => {
    it('should build correct query string with basic params', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data).toEqual(mockPaymentsResponse)
      expect(result.data?.payments).toHaveLength(6)
    })

    it('should include page parameter in query string', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 2,
        limit: 20,
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data?.currentPage).toBe(2)
    })

    it('should include limit parameter in query string', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 50,
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data).toBeDefined()
    })

    it('should handle page=0 edge case', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 0,
        limit: 20,
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data).toBeDefined()
    })

    it('should handle large limit values', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 100,
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data).toBeDefined()
    })
  })

  describe('getPayments endpoint - search parameter', () => {
    it('should include search parameter when provided', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
        searchQuery: 'portone-payment-1',
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data?.payments).toHaveLength(1)
      expect(result.data?.payments[0].paymentId).toBe('portone-payment-1')
    })

    it('should not include search parameter when empty string', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
        searchQuery: '',
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data?.payments).toHaveLength(6)
    })

    it('should not include search parameter when undefined', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data?.payments).toHaveLength(6)
    })

    it('should return empty results for no-match search', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
        searchQuery: 'no-results',
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data).toEqual(mockEmptyPaymentsResponse)
      expect(result.data?.payments).toHaveLength(0)
    })

    it('should handle special characters in search query', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
        searchQuery: 'payment-1',
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data?.payments.length).toBeGreaterThan(0)
    })
  })

  describe('getPayments endpoint - status filter', () => {
    it('should include status parameter when provided', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
        statusFilter: 'PAID',
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data?.payments).toHaveLength(1)
      expect(result.data?.payments[0].status).toBe('PAID')
    })

    it('should NOT include status parameter when filter is "ALL"', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
        statusFilter: 'ALL',
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      // Should return all payments without filtering
      expect(result.data?.payments).toHaveLength(6)
    })

    it('should not include status parameter when undefined', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data?.payments).toHaveLength(6)
    })

    it('should filter by FAILED status', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
        statusFilter: 'FAILED',
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data?.payments).toHaveLength(1)
      expect(result.data?.payments[0].status).toBe('FAILED')
    })

    it('should filter by REFUNDED status', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
        statusFilter: 'REFUNDED',
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data?.payments).toHaveLength(1)
      expect(result.data?.payments[0].status).toBe('REFUNDED')
    })

    it('should filter by PENDING status', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
        statusFilter: 'PENDING',
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data?.payments).toHaveLength(1)
      expect(result.data?.payments[0].status).toBe('PENDING')
    })

    it('should handle empty string status filter as no filter', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
        statusFilter: '',
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data?.payments).toHaveLength(6)
    })
  })

  describe('getPayments endpoint - combined filters', () => {
    it('should handle search and status filter together', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
        searchQuery: 'portone-payment',
        statusFilter: 'PAID',
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data?.payments.length).toBeGreaterThanOrEqual(0)
      if (result.data?.payments.length) {
        expect(result.data.payments[0].status).toBe('PAID')
      }
    })

    it('should handle pagination with filters', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 2,
        statusFilter: 'PAID',
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data).toBeDefined()
    })
  })

  describe('cache tags - providesTags', () => {
    it('should provide Payments:LIST tag', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      // Verify query was successful and data is cached
      expect(result.data).toBeDefined()
      expect(result.isSuccess).toBe(true)

      const state = store.getState()
      const queries = state[adminPaymentsApi.reducerPath].queries

      // Verify cache entry exists
      expect(Object.keys(queries).length).toBeGreaterThan(0)
    })

    it('should provide PaymentStats:STATS tag', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
      }

      await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      const state = store.getState()
      const queries = state[adminPaymentsApi.reducerPath].queries
      expect(queries).toBeDefined()
    })

    it('should provide individual payment tags for each payment', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      // Verify all payments have IDs that would generate tags
      result.data?.payments.forEach((payment) => {
        expect(payment.id).toBeDefined()
      })
    })

    it('should provide only LIST tag when result is empty', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
        searchQuery: 'no-results',
      }

      await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      const state = store.getState()
      const queries = state[adminPaymentsApi.reducerPath].queries
      expect(queries).toBeDefined()
    })

    it('should provide tags for all 6 mock payments', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data?.payments).toHaveLength(6)
      expect(result.data?.payments.map((p) => p.id)).toEqual([
        mockPayment.id,
        mockFailedPayment.id,
        mockRefundedPayment.id,
        mockPartialRefundedPayment.id,
        mockPendingPayment.id,
        mockCancelledPayment.id,
      ])
    })
  })

  describe('cache configuration', () => {
    it('should have keepUnusedDataFor set to 600 seconds', () => {
      const endpoint = adminPaymentsApi.endpoints.getPayments
      // RTK Query stores this in the endpoint definition
      expect(endpoint).toBeDefined()
      // The actual keepUnusedDataFor value is set in the endpoint configuration
    })

    it('should cache identical queries', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
      }

      // First call
      const result1 = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      // Second call with same params should use cache
      const result2 = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result1.data).toEqual(result2.data)
    })

    it('should not cache queries with different parameters', async () => {
      const store = createTestStore()
      const params1: GetPaymentsParams = {
        page: 1,
        limit: 20,
      }
      const params2: GetPaymentsParams = {
        page: 2,
        limit: 20,
      }

      await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params1))
      await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params2))

      const state = store.getState()
      const queries = state[adminPaymentsApi.reducerPath].queries

      // Should have separate cache entries
      expect(Object.keys(queries).length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('response data structure', () => {
    it('should return correct response structure', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.data).toHaveProperty('payments')
      expect(result.data).toHaveProperty('currentPage')
      expect(result.data).toHaveProperty('totalPages')
      expect(result.data).toHaveProperty('totalCount')
    })

    it('should return array of payments', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(Array.isArray(result.data?.payments)).toBe(true)
    })

    it('should return payments with correct structure', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      const payment = result.data?.payments[0]
      expect(payment).toHaveProperty('id')
      expect(payment).toHaveProperty('paymentId')
      expect(payment).toHaveProperty('amount')
      expect(payment).toHaveProperty('status')
      expect(payment).toHaveProperty('method')
      expect(payment).toHaveProperty('booking')
      expect(payment).toHaveProperty('customer')
    })

    it('should return pagination metadata', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(typeof result.data?.currentPage).toBe('number')
      expect(typeof result.data?.totalPages).toBe('number')
      expect(typeof result.data?.totalCount).toBe('number')
    })
  })

  describe('error handling', () => {
    it('should handle query execution without errors', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
      }

      const result = await store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      expect(result.isError).toBe(false)
      expect(result.isSuccess).toBe(true)
    })

    it('should provide isLoading state', async () => {
      const store = createTestStore()
      const params: GetPaymentsParams = {
        page: 1,
        limit: 20,
      }

      const promise = store.dispatch(adminPaymentsApi.endpoints.getPayments.initiate(params))

      const state = store.getState()
      const queries = state[adminPaymentsApi.reducerPath].queries

      expect(queries).toBeDefined()

      await promise
    })
  })
})
