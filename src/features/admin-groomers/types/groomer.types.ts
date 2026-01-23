/**
 * Re-export API types from the admin groomers API route
 * These types represent the transformed data shape returned by the API
 */
export type { AdminGroomerInfo, AdminGroomersGetResponse } from '@/app/api/admin/groomers/route'

/**
 * Groomer status for filtering
 */
export type GroomerStatus = 'ALL' | 'ACTIVE' | 'INACTIVE'

/**
 * Groomer filter state
 * Represents the current filter configuration for the groomers list
 */
export interface GroomerFilters {
  /** Search query for groomer name, email, or phone */
  searchQuery: string
  /** Status filter - 'ALL', 'ACTIVE', or 'INACTIVE' */
  statusFilter: GroomerStatus
  /** Location filter - 'ALL' or specific location ID */
  locationFilter: string
  /** Field to sort by */
  sortBy: 'name' | 'rating' | 'revenue' | 'bookings' | 'joinDate'
  /** Sort order */
  sortOrder: 'asc' | 'desc'
}

/**
 * Groomer statistics
 * Dashboard metrics for groomer overview
 */
export interface GroomerStats {
  /** Total number of groomers */
  totalGroomers: number
  /** Number of active groomers */
  activeGroomers: number
  /** Number of inactive groomers */
  inactiveGroomers: number
  /** Average groomer rating */
  averageRating: number
  /** Total bookings this month */
  totalBookingsThisMonth: number
  /** Total revenue this month */
  totalRevenueThisMonth: number
}

/**
 * Infinite scroll state
 * Tracks which pages have been loaded and pagination metadata
 */
export interface InfiniteScrollState {
  /** Array of page numbers that have been loaded */
  loadedPages: number[]
  /** Whether there are more pages to load */
  hasMore: boolean
  /** Total number of pages available */
  totalPages: number
}

/**
 * Groomer action type
 * Available actions that can be performed on a groomer
 */
export type GroomerAction =
  | 'activate'
  | 'deactivate'
  | 'suspend'
  | 'updateCommission'
  | 'view'
  | 'edit'

/**
 * Commission grade update request
 */
export interface UpdateCommissionGradeRequest {
  groomerId: string
  commissionGradeId: string
}

/**
 * Groomer status update request
 */
export interface UpdateGroomerStatusRequest {
  groomerId: string
  action: 'activate' | 'deactivate' | 'suspend'
}

/**
 * Query configuration constants
 * Shared configuration for RTK Query hooks
 */
export const QUERY_CONFIG = {
  /** Stale time: 5 minutes */
  STALE_TIME: 5 * 60 * 1000,
  /** Garbage collection time: 30 minutes */
  GC_TIME: 30 * 60 * 1000,
  /** Number of groomers per page */
  PAGE_SIZE: 20,
  /** Root margin for intersection observer */
  ROOT_MARGIN: '100px',
  /** Intersection observer threshold */
  THRESHOLD: 0.1,
} as const
