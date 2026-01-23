/**
 * MSW Request Handlers for Admin Bookings API
 *
 * Intercepts and mocks API requests for testing.
 * Supports all admin bookings endpoints with realistic behavior.
 */

import { http, HttpResponse, type HttpHandler } from 'msw'
import type { AdminBookingsGetResponse } from '@/app/api/admin/bookings/route'
import {
  mockBookings,
  generateBookingsPage,
  filterBookingsBySearch,
  filterBookingsByStatus,
  filterBookingsByDate,
  sortBookings,
  createMockBooking,
} from './data'
import { BookingStatus } from '@mimisalon/shared'

/**
 * GET /api/admin/bookings
 * Returns paginated bookings with filter/sort support
 */
export const getBookingsHandler = http.get('/api/admin/bookings', ({ request }) => {
  const url = new URL(request.url)

  // Parse query parameters
  const page = parseInt(url.searchParams.get('page') || '1', 10)
  const limit = parseInt(url.searchParams.get('limit') || '50', 10)
  const searchQuery = url.searchParams.get('search') || ''
  const statusFilter = url.searchParams.get('status') || 'ALL'
  const dateFilter = url.searchParams.get('date') || ''
  const sortBy = (url.searchParams.get('sortBy') || 'date') as 'date' | 'status' | 'amount'
  const sortOrder = (url.searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

  // Special case: trigger error for testing
  if (searchQuery === 'ERROR_TRIGGER') {
    return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }

  // Apply filters
  let filteredBookings = [...mockBookings]

  if (searchQuery) {
    filteredBookings = filterBookingsBySearch(filteredBookings, searchQuery)
  }

  if (statusFilter !== 'ALL') {
    filteredBookings = filterBookingsByStatus(filteredBookings, statusFilter)
  }

  if (dateFilter) {
    filteredBookings = filterBookingsByDate(filteredBookings, dateFilter)
  }

  // Apply sorting
  filteredBookings = sortBookings(filteredBookings, sortBy, sortOrder)

  // Calculate pagination
  const totalCount = filteredBookings.length
  const totalPages = Math.ceil(totalCount / limit)
  const startIndex = (page - 1) * limit
  const endIndex = Math.min(startIndex + limit, totalCount)
  const pageBookings = filteredBookings.slice(startIndex, endIndex)

  const response: AdminBookingsGetResponse = {
    bookings: pageBookings,
    pagination: {
      page,
      totalPages,
      totalCount,
      limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }

  return HttpResponse.json(response)
})

/**
 * PATCH /api/admin/bookings/:id/confirm
 * Confirms a booking
 */
export const confirmBookingHandler = http.patch('/api/admin/bookings/:id/confirm', ({ params }) => {
  const { id } = params

  // Simulate error for specific booking ID
  if (id === 'error-booking') {
    return HttpResponse.json({ error: 'Failed to confirm booking' }, { status: 500 })
  }

  // Find booking
  const booking = mockBookings.find((b) => b.id === id)

  if (!booking) {
    return HttpResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  // Return updated booking with confirmed status
  const updatedBooking = {
    ...booking,
    status: BookingStatus.GROOMER_CONFIRM,
    updatedAt: new Date().toISOString(),
  }

  return HttpResponse.json({
    success: true,
    booking: updatedBooking,
    message: 'Booking confirmed successfully',
  })
})

/**
 * PATCH /api/admin/bookings/:id/cancel
 * Cancels a booking
 */
export const cancelBookingHandler = http.patch('/api/admin/bookings/:id/cancel', ({ params }) => {
  const { id } = params

  // Simulate error for specific booking ID
  if (id === 'error-booking') {
    return HttpResponse.json({ error: 'Failed to cancel booking' }, { status: 500 })
  }

  // Find booking
  const booking = mockBookings.find((b) => b.id === id)

  if (!booking) {
    return HttpResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  // Check if booking is cancellable
  if (
    booking.status === BookingStatus.SERVICE_CANCELLED ||
    booking.status === BookingStatus.SERVICE_COMPLETED
  ) {
    return HttpResponse.json({ error: 'Booking cannot be cancelled' }, { status: 400 })
  }

  // Return updated booking with cancelled status
  const updatedBooking = {
    ...booking,
    status: BookingStatus.SERVICE_CANCELLED,
    updatedAt: new Date().toISOString(),
  }

  return HttpResponse.json({
    success: true,
    booking: updatedBooking,
    message: 'Booking cancelled successfully',
  })
})

/**
 * PATCH /api/admin/bookings/:id/complete
 * Completes a booking
 */
export const completeBookingHandler = http.patch(
  '/api/admin/bookings/:id/complete',
  ({ params }) => {
    const { id } = params

    // Simulate error for specific booking ID
    if (id === 'error-booking') {
      return HttpResponse.json({ error: 'Failed to complete booking' }, { status: 500 })
    }

    // Find booking
    const booking = mockBookings.find((b) => b.id === id)

    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if booking is in progress
    if (booking.status !== BookingStatus.WORK_IN_PROGRESS) {
      return HttpResponse.json(
        { error: 'Only bookings in progress can be completed' },
        { status: 400 }
      )
    }

    // Return updated booking with completed status
    const updatedBooking = {
      ...booking,
      status: BookingStatus.SERVICE_COMPLETED,
      endTime: new Date().toISOString().slice(11, 16), // HH:mm format
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json({
      success: true,
      booking: updatedBooking,
      message: 'Booking completed successfully',
    })
  }
)

/**
 * DELETE /api/admin/bookings/:id
 * Deletes a booking
 */
export const deleteBookingHandler = http.delete('/api/admin/bookings/:id', ({ params }) => {
  const { id } = params

  // Simulate error for specific booking ID
  if (id === 'error-booking') {
    return HttpResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }

  // Find booking
  const booking = mockBookings.find((b) => b.id === id)

  if (!booking) {
    return HttpResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  return HttpResponse.json({
    success: true,
    message: 'Booking deleted successfully',
  })
})

/**
 * All handlers for admin bookings API
 */
export const adminBookingsHandlers: HttpHandler[] = [
  getBookingsHandler,
  confirmBookingHandler,
  cancelBookingHandler,
  completeBookingHandler,
  deleteBookingHandler,
]

/**
 * Create a custom handler for specific test scenarios
 */
export function createCustomHandler(
  method: 'get' | 'patch' | 'delete',
  path: string,
  responseFactory: (request: Request) => Response | Promise<Response>
): HttpHandler {
  const handlers = {
    get: http.get,
    patch: http.patch,
    delete: http.delete,
  }

  return handlers[method](path, ({ request }) => responseFactory(request))
}

/**
 * Create an error handler for testing error scenarios
 */
export function createErrorHandler(
  method: 'get' | 'patch' | 'delete',
  path: string,
  statusCode: number = 500,
  errorMessage: string = 'Internal Server Error'
): HttpHandler {
  return createCustomHandler(method, path, () =>
    HttpResponse.json({ error: errorMessage }, { status: statusCode })
  )
}

/**
 * Create a slow response handler for testing loading states
 */
export function createSlowHandler(
  method: 'get' | 'patch' | 'delete',
  path: string,
  delay: number = 2000
): HttpHandler {
  return createCustomHandler(method, path, async (request) => {
    await new Promise((resolve) => setTimeout(resolve, delay))

    // Return default successful response
    if (method === 'get') {
      return HttpResponse.json(generateBookingsPage(1, 50, 150))
    }

    return HttpResponse.json({ success: true, message: 'Operation successful' })
  })
}
