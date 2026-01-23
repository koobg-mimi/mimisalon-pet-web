/**
 * MSW Request Handlers for Admin Groomers API
 *
 * Intercepts and mocks API requests for testing.
 * Supports all admin groomers endpoints with realistic behavior.
 */

import { http, HttpResponse, type HttpHandler } from 'msw'
import type { AdminGroomersGetResponse } from '@/app/api/admin/groomers/route'
import {
  mockGroomers,
  generateGroomersPage,
  filterGroomersBySearch,
  filterGroomersByStatus,
  filterGroomersByLocation,
  sortGroomers,
  createMockGroomer,
} from './data'

/**
 * GET /api/admin/groomers
 * Returns paginated groomers with filter/sort support
 */
export const getGroomersHandler = http.get('/api/admin/groomers', ({ request }) => {
  const url = new URL(request.url)

  // Parse query parameters
  const page = parseInt(url.searchParams.get('page') || '1', 10)
  const limit = parseInt(url.searchParams.get('limit') || '20', 10)
  const searchQuery = url.searchParams.get('search') || ''
  const statusFilter = url.searchParams.get('status') || 'ALL'
  const locationFilter = url.searchParams.get('location') || 'ALL'
  const sortBy = (url.searchParams.get('sortBy') || 'name') as
    | 'name'
    | 'rating'
    | 'revenue'
    | 'bookings'
    | 'joinDate'
  const sortOrder = (url.searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

  // Special case: trigger error for testing
  if (searchQuery === 'ERROR_TRIGGER') {
    return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }

  // Apply filters
  let filteredGroomers = [...mockGroomers]

  if (searchQuery) {
    filteredGroomers = filterGroomersBySearch(filteredGroomers, searchQuery)
  }

  if (statusFilter !== 'ALL') {
    filteredGroomers = filterGroomersByStatus(filteredGroomers, statusFilter)
  }

  if (locationFilter !== 'ALL') {
    filteredGroomers = filterGroomersByLocation(filteredGroomers, locationFilter)
  }

  // Apply sorting
  filteredGroomers = sortGroomers(filteredGroomers, sortBy, sortOrder)

  // Calculate pagination
  const totalCount = filteredGroomers.length
  const totalPages = Math.ceil(totalCount / limit)
  const startIndex = (page - 1) * limit
  const endIndex = Math.min(startIndex + limit, totalCount)
  const pageGroomers = filteredGroomers.slice(startIndex, endIndex)

  const response: AdminGroomersGetResponse = {
    groomers: pageGroomers,
    totalCount,
    totalPages,
    currentPage: page,
  }

  return HttpResponse.json(response)
})

/**
 * POST /api/admin/groomers/:id/activate
 * Activates a groomer
 */
export const activateGroomerHandler = http.post(
  '/api/admin/groomers/:id/activate',
  ({ params }) => {
    const { id } = params

    // Simulate error for specific groomer ID
    if (id === 'error-groomer') {
      return HttpResponse.json({ error: 'Failed to activate groomer' }, { status: 500 })
    }

    // Find groomer
    const groomer = mockGroomers.find((g) => g.id === id)

    if (!groomer) {
      return HttpResponse.json({ error: 'Groomer not found' }, { status: 404 })
    }

    // Return updated groomer with active status
    const updatedGroomer = {
      ...groomer,
      isActive: true,
      user: {
        ...groomer.user,
        isActive: true,
      },
    }

    return HttpResponse.json({
      success: true,
      groomer: updatedGroomer,
      message: 'Groomer activated successfully',
    })
  }
)

/**
 * POST /api/admin/groomers/:id/deactivate
 * Deactivates a groomer
 */
export const deactivateGroomerHandler = http.post(
  '/api/admin/groomers/:id/deactivate',
  ({ params }) => {
    const { id } = params

    // Simulate error for specific groomer ID
    if (id === 'error-groomer') {
      return HttpResponse.json({ error: 'Failed to deactivate groomer' }, { status: 500 })
    }

    // Find groomer
    const groomer = mockGroomers.find((g) => g.id === id)

    if (!groomer) {
      return HttpResponse.json({ error: 'Groomer not found' }, { status: 404 })
    }

    // Return updated groomer with inactive status
    const updatedGroomer = {
      ...groomer,
      isActive: false,
      user: {
        ...groomer.user,
        isActive: false,
      },
    }

    return HttpResponse.json({
      success: true,
      groomer: updatedGroomer,
      message: 'Groomer deactivated successfully',
    })
  }
)

/**
 * POST /api/admin/groomers/:id/suspend
 * Suspends a groomer
 */
export const suspendGroomerHandler = http.post('/api/admin/groomers/:id/suspend', ({ params }) => {
  const { id } = params

  // Simulate error for specific groomer ID
  if (id === 'error-groomer') {
    return HttpResponse.json({ error: 'Failed to suspend groomer' }, { status: 500 })
  }

  // Find groomer
  const groomer = mockGroomers.find((g) => g.id === id)

  if (!groomer) {
    return HttpResponse.json({ error: 'Groomer not found' }, { status: 404 })
  }

  // Return updated groomer with suspended (inactive) status
  const updatedGroomer = {
    ...groomer,
    isActive: false,
    user: {
      ...groomer.user,
      isActive: false,
    },
  }

  return HttpResponse.json({
    success: true,
    groomer: updatedGroomer,
    message: 'Groomer suspended successfully',
  })
})

/**
 * POST /api/admin/groomers/:id/update-commission
 * Updates groomer commission grade
 */
export const updateCommissionGradeHandler = http.post(
  '/api/admin/groomers/:id/update-commission',
  async ({ params, request }) => {
    const { id } = params

    // Simulate error for specific groomer ID
    if (id === 'error-groomer') {
      return HttpResponse.json({ error: 'Failed to update commission grade' }, { status: 500 })
    }

    // Find groomer
    const groomer = mockGroomers.find((g) => g.id === id)

    if (!groomer) {
      return HttpResponse.json({ error: 'Groomer not found' }, { status: 404 })
    }

    // Parse request body
    const body = (await request.json()) as { commissionGradeId: string }

    // Mock commission grades
    const commissionGrades = {
      'grade-1': { id: 'grade-1', name: 'Gold', commissionRate: 0.85 },
      'grade-2': { id: 'grade-2', name: 'Silver', commissionRate: 0.8 },
      'grade-3': { id: 'grade-3', name: 'Bronze', commissionRate: 0.75 },
    }

    const newGrade = commissionGrades[body.commissionGradeId as keyof typeof commissionGrades]

    if (!newGrade) {
      return HttpResponse.json({ error: 'Invalid commission grade' }, { status: 400 })
    }

    // Return updated groomer with new commission grade
    const updatedGroomer = {
      ...groomer,
      commissionGrade: newGrade,
    }

    return HttpResponse.json({
      success: true,
      groomer: updatedGroomer,
      message: 'Commission grade updated successfully',
    })
  }
)

/**
 * All handlers for admin groomers API
 */
export const adminGroomersHandlers: HttpHandler[] = [
  getGroomersHandler,
  activateGroomerHandler,
  deactivateGroomerHandler,
  suspendGroomerHandler,
  updateCommissionGradeHandler,
]

/**
 * Create a custom handler for specific test scenarios
 */
export function createCustomHandler(
  method: 'get' | 'post',
  path: string,
  responseFactory: (request: Request) => Response | Promise<Response>
): HttpHandler {
  const handlers = {
    get: http.get,
    post: http.post,
  }

  return handlers[method](path, ({ request }) => responseFactory(request))
}

/**
 * Create an error handler for testing error scenarios
 */
export function createErrorHandler(
  method: 'get' | 'post',
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
  method: 'get' | 'post',
  path: string,
  delay: number = 2000
): HttpHandler {
  return createCustomHandler(method, path, async (request) => {
    await new Promise((resolve) => setTimeout(resolve, delay))

    // Return default successful response
    if (method === 'get') {
      return HttpResponse.json(generateGroomersPage(1, 20, 100))
    }

    return HttpResponse.json({ success: true, message: 'Operation successful' })
  })
}
