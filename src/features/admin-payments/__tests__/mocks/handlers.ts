import { http, HttpResponse } from 'msw'
import { mockPaymentsResponse, mockEmptyPaymentsResponse } from './data'

/**
 * MSW handlers for admin payments API endpoints
 * Used in testing to mock API responses
 */
export const adminPaymentsHandlers = [
  /**
   * GET /api/admin/payments - Get payments with filters and pagination
   */
  http.get('/api/admin/payments', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    const status = url.searchParams.get('status')
    const page = url.searchParams.get('page') || '1'

    // Return empty response for specific test case
    if (search === 'no-results') {
      return HttpResponse.json(mockEmptyPaymentsResponse)
    }

    // Return filtered response
    let filteredPayments = [...mockPaymentsResponse.payments]

    if (status && status !== 'ALL') {
      filteredPayments = filteredPayments.filter((p) => p.status === status)
    }

    if (search) {
      filteredPayments = filteredPayments.filter(
        (p) =>
          p.paymentId.includes(search) ||
          p.orderId?.includes(search) ||
          p.booking?.bookingNumber.includes(search)
      )
    }

    return HttpResponse.json({
      payments: filteredPayments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(filteredPayments.length / 20),
      totalCount: filteredPayments.length,
    })
  }),

  /**
   * Error handler for testing error states
   */
  http.get('/api/admin/payments-error', () => {
    return HttpResponse.json({ error: 'Internal server error' }, { status: 500 })
  }),
]
