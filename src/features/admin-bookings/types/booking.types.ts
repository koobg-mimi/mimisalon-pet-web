import { BookingStatus } from '@mimisalon/shared'

/**
 * Re-export API types from the admin bookings API route
 * These types represent the transformed data shape returned by the API
 */
export type {
  TransformedBooking,
  PaginationInfo,
  AdminBookingsGetResponse,
  UserInfo,
  ServiceInfo,
  BookingPetInfo,
  PaymentInfo,
  AddressInfo,
} from '@/app/api/admin/bookings/route'

/**
 * Booking filter state
 * Represents the current filter configuration for the bookings list
 */
export interface BookingFilters {
  /** Search query for booking number, customer name, or phone */
  searchQuery: string
  /** Status filter - 'ALL' or specific BookingStatus */
  statusFilter: 'ALL' | BookingStatus
  /** Date filter in YYYY-MM-DD format */
  dateFilter: string
  /** Field to sort by */
  sortBy: 'date' | 'status' | 'amount'
  /** Sort order */
  sortOrder: 'asc' | 'desc'
}

/**
 * Booking statistics
 * Dashboard metrics for booking overview
 */
export interface BookingStats {
  /** Total number of bookings */
  totalBookings: number
  /** Number of bookings in pending state */
  pendingBookings: number
  /** Number of confirmed bookings */
  confirmedBookings: number
  /** Number of completed bookings */
  completedBookings: number
  /** Number of cancelled bookings */
  cancelledBookings: number
  /** Total revenue from all bookings */
  totalRevenue: number
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
 * Booking action type
 * Available actions that can be performed on a booking
 */
export type BookingAction = 'confirm' | 'cancel' | 'complete' | 'delete' | 'view'

/**
 * Query configuration constants
 * Shared configuration for TanStack Query hooks
 */
export const QUERY_CONFIG = {
  /** Stale time: 5 minutes */
  STALE_TIME: 5 * 60 * 1000,
  /** Garbage collection time: 30 minutes */
  GC_TIME: 30 * 60 * 1000,
  /** Number of bookings per page */
  PAGE_SIZE: 50,
  /** Root margin for intersection observer */
  ROOT_MARGIN: '100px',
  /** Intersection observer threshold */
  THRESHOLD: 0.1,
} as const
