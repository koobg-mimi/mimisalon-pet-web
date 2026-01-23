/**
 * Admin Dashboard Type Definitions
 *
 * This file contains all type definitions for the admin dashboard feature,
 * bridging the gap between server-side API responses and client-side UI requirements.
 *
 * Key patterns:
 * - DashboardMetrics: Raw API response from route.ts
 * - OverviewStats: Client-optimized type for dashboard UI
 * - Date → string serialization handling for Next.js JSON responses
 * - Prisma.GetPayload pattern for type-safe database queries
 *
 * @module features/admin/types/dashboard
 */

import { BookingStatus } from '@mimisalon/shared'

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Utility type to convert Date fields to strings in API responses.
 * Next.js automatically serializes Date objects to ISO strings when using NextResponse.json().
 *
 * @example
 * ```typescript
 * type UserResponse = SerializeApiResponse<User>;
 * // Date fields become string, nested objects are recursively processed
 * ```
 */
export type SerializeApiResponse<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends Date | null
      ? string | null
      : T[K] extends (infer U)[]
        ? SerializeApiResponse<U>[]
        : T[K] extends object
          ? SerializeApiResponse<T[K]>
          : T[K]
}

// ============================================================================
// API Response Types (Server-Side)
// ============================================================================

/**
 * Core dashboard metrics returned by the API.
 * These metrics represent aggregated statistics over a given date range.
 * All dates are provided as ISO strings from the API.
 */
export interface DashboardMetrics {
  /** Total number of bookings in the period */
  totalBookings: number
  /** Total revenue generated in the period (in cents) */
  totalRevenue: number
  /** Total number of unique customers */
  totalCustomers: number
  /** Total number of active services */
  totalServices: number
  /** Month-over-month booking growth percentage */
  bookingGrowth: number
  /** Month-over-month revenue growth percentage */
  revenueGrowth: number
  /** Average booking value (in cents) */
  averageBookingValue: number
  /** Period the metrics cover */
  period: DateRangeFilter
}

/**
 * Recent booking with customer and service information.
 * Represents a single booking record from the database.
 * All dates stored as ISO strings for Redux serialization.
 */
export interface RecentBooking {
  /** Unique booking identifier */
  id: string
  /** Customer who made the booking */
  customer: {
    id: string
    name: string
    email: string
    phone: string | null
  }
  /** Service booked */
  service: {
    id: string
    name: string
    duration: number // in minutes
    price: number // in cents
  }
  /** Current status of the booking */
  status: BookingStatus
  /** When the booking is scheduled - ISO string */
  scheduledAt: string
  /** When the booking was created - ISO string */
  createdAt: string
  /** Optional completion timestamp - ISO string */
  completedAt: string | null
  /** Total amount paid (in cents) */
  amount: number
}

/**
 * Complete API response structure for dashboard overview.
 * Contains all necessary data to render the admin dashboard.
 * All dates stored as ISO strings for Redux serialization.
 */
export interface DashboardOverviewResponse {
  /** Aggregated metrics for the selected period */
  metrics: DashboardMetrics
  /** List of recent bookings (limit 10) */
  recentBookings: RecentBooking[]
  /** Service performance breakdown */
  serviceStats: ServicePerformance[]
  /** Monthly revenue trend data */
  monthlyRevenue: MonthlyRevenueData[]
  /** User growth trend data */
  userGrowthData: UserGrowthTrendData[]
  /** Timestamp of when this data was generated - ISO string */
  generatedAt: string
}

/**
 * Serialized API response type - what the client receives after Next.js JSON serialization.
 * All Date objects are converted to ISO strings.
 */
export type DashboardOverviewApiResponse = SerializeApiResponse<DashboardOverviewResponse>

// ============================================================================
// Supporting Types for API
// ============================================================================

/**
 * Service performance metrics breakdown.
 * Used for service-level analysis and comparison.
 */
export interface ServicePerformance {
  /** Service identifier */
  serviceId: string
  /** Service name */
  serviceName: string
  /** Number of bookings for this service */
  bookingCount: number
  /** Total revenue from this service (in cents) */
  revenue: number
  /** Average rating (0-5) */
  averageRating: number
  /** Customer satisfaction percentage */
  satisfactionRate: number
}

/**
 * Monthly revenue data point for trend analysis.
 * Used for charting revenue over time.
 */
export interface MonthlyRevenueData {
  /** Month in YYYY-MM format */
  month: string
  /** Revenue in cents */
  revenue: number
  /** Revenue from previous month for comparison */
  previousMonthRevenue: number
}

/**
 * User growth trend data point.
 * Used for charting customer acquisition trends.
 */
export interface UserGrowthTrendData {
  /** Month in YYYY-MM format */
  month: string
  /** Number of new users acquired */
  newUsers: number
  /** Total cumulative users */
  totalUsers: number
}

// ============================================================================
// Client UI Types
// ============================================================================

/**
 * Primary dashboard data structure for UI rendering.
 * Optimized for presentation layer with computed values.
 */
export interface OverviewStats {
  /** Total number of bookings */
  totalBookings: number
  /** Total revenue in cents */
  totalRevenue: number
  /** Number of unique customers */
  totalCustomers: number
  /** Alias for totalCustomers (for backward compatibility) */
  totalUsers?: number
  /** Number of active services */
  activeServices: number
  /** Number of active groomers */
  activeGroomers?: number
  /** Number of bookings completed today */
  completedBookingsToday?: number
  /** Number of pending bookings */
  pendingBookings?: number
  /** Average rating (0-5) */
  averageRating?: number
  /** Month-over-month booking change percentage */
  bookingGrowth: number
  /** Month-over-month revenue change percentage */
  revenueGrowth: number
  /** Alias for bookingGrowth (for backward compatibility) */
  monthlyGrowth?: number
  /** Average value per booking in cents */
  averageBookingValue: number
  /** Current period label (e.g., "This Month") */
  periodLabel: string
  /** Period the stats cover */
  period: TimeRange
  /** Recent activity items */
  recentActivity?: ActivityItem[]
  /** Top services statistics */
  topServices?: ServiceStats[]
  /** Monthly revenue data */
  monthlyRevenue?: MonthlyRevenue[]
  /** User growth data */
  userGrowth?: UserGrowthData[]
  /** Whether the data is loading */
  isLoading?: boolean
  /** Error message if data failed to load */
  error?: string | null
}

/**
 * Activity feed item with discriminated union for type-safe handling.
 * Can represent different types of activities (booking, review, etc.).
 * All timestamps stored as ISO strings for Redux serialization.
 */
export type ActivityItem =
  | {
      type: 'booking'
      id: string
      customerName: string
      serviceName: string
      status: BookingStatus
      timestamp: string // ISO string for Redux serialization
      amount: number
    }
  | {
      type: 'review'
      id: string
      customerName: string
      rating: number
      comment: string
      timestamp: string // ISO string for Redux serialization
    }
  | {
      type: 'user_signup'
      id: string
      customerName: string
      timestamp: string // ISO string for Redux serialization
    }
  | {
      type: 'payment'
      id: string
      customerName: string
      amount: number
      status: 'completed' | 'pending' | 'failed'
      timestamp: string // ISO string for Redux serialization
    }

/**
 * Service performance metrics for dashboard display.
 * Computed values optimized for UI rendering.
 */
export interface ServiceStats {
  /** Service identifier */
  serviceId: string
  /** Service display name */
  name: string
  /** Number of bookings this period */
  bookings: number
  /** Total revenue from bookings (in cents) */
  revenue: number
  /** Customer rating (0-5) */
  rating: number
  /** Percentage of positive reviews */
  satisfactionRate: number
  /** Rank among all services */
  rank: number
  /** Month-over-month growth percentage */
  growth: number
}

/**
 * Monthly revenue data for charting.
 * Includes both current and comparison values.
 */
export interface MonthlyRevenue {
  /** Month label for display */
  month: string
  /** Revenue in cents */
  value: number
  /** Revenue from previous month in cents */
  previousValue: number
  /** Percentage change from previous month */
  percentageChange: number
}

/**
 * User growth trend data for charting.
 * Shows acquisition and cumulative growth.
 */
export interface UserGrowthData {
  /** Month label for display */
  month: string
  /** New users acquired this month */
  newUsers: number
  /** Total cumulative users */
  total: number
}

// ============================================================================
// Filter and Time Range Types
// ============================================================================

/**
 * Time range filter for dashboard data.
 * Used to specify which period to fetch data for.
 * All dates stored as ISO strings for Redux serialization.
 */
export interface TimeRange {
  /** Start date (inclusive) - ISO string */
  startDate: string
  /** End date (inclusive) - ISO string */
  endDate: string
  /** Label for the range */
  label: string
}

/**
 * Date range filter for API requests.
 * Follows ISO 8601 format for consistency.
 */
export interface DateRangeFilter {
  /** Start date in ISO 8601 format */
  startDate: string
  /** End date in ISO 8601 format */
  endDate: string
  /** Range label for reference */
  label: string
}

// ============================================================================
// Type Transformation Mapping
// ============================================================================

/**
 * Documentation of the transformation strategy from API types to UI types.
 * This serves as a blueprint for the API adapter (Task 1.3).
 *
 * Transformation flow:
 * ```
 * DashboardOverviewApiResponse
 *   └─ API Adapter (Task 1.3)
 *       └─ OverviewStats
 *       └─ ActivityItem[]
 *       └─ ServiceStats[]
 *       └─ MonthlyRevenue[]
 *       └─ UserGrowthData[]
 * ```
 */
export interface DashboardDataMapping {
  /** Maps DashboardMetrics to OverviewStats with computed values */
  metricsTransformation: {
    /** Period label computed from date range */
    periodLabelComputation: string
    /** Period object reconstructed from date strings */
    periodReconstruction: TimeRange
  }

  /** Maps RecentBooking[] to ActivityItem[] with type discrimination */
  bookingTransformation: {
    /** Discriminated union type for type-safe activity handling */
    activityTypeMapping: 'booking' | 'payment'
    /** Booking status preserved from original */
    statusPassthrough: boolean
  }

  /** Maps ServicePerformance[] to ServiceStats[] with ranking */
  serviceTransformation: {
    /** Ranks services by revenue or booking count */
    rankingStrategy: 'revenue' | 'bookings'
    /** Calculates month-over-month growth */
    growthCalculation: 'percentage' | 'absolute'
  }

  /** Maps MonthlyRevenueData[] to MonthlyRevenue[] with computed changes */
  revenueTransformation: {
    /** Calculates percentage change between months */
    percentageChangeCalculation: boolean
    /** Currency conversion if needed */
    currencyConversion: boolean
  }

  /** Maps UserGrowthTrendData[] to UserGrowthData[] with label generation */
  userGrowthTransformation: {
    /** Formats month for display */
    monthLabelFormat: 'YYYY-MM' | 'MMM YYYY' | 'full'
    /** Generates month labels for charts */
    labelGeneration: boolean
  }
}

// ============================================================================
// Type Guards / Runtime Validation
// ============================================================================

/**
 * Runtime type guard to validate ActivityItem discriminated union.
 * Used to safely handle different activity types.
 *
 * @example
 * ```typescript
 * if (isActivityItem(data)) {
 *   if (data.type === 'booking') {
 *     console.log(data.serviceName); // TypeScript knows this property exists
 *   }
 * }
 * ```
 */
export function isActivityItem(value: unknown): value is ActivityItem {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.type === 'string' &&
    (item.type === 'booking' ||
      item.type === 'review' ||
      item.type === 'user_signup' ||
      item.type === 'payment') &&
    typeof item.id === 'string' &&
    typeof item.customerName === 'string' &&
    typeof item.timestamp === 'string' // ISO string, not Date object
  )
}

/**
 * Runtime type guard for ServiceStats.
 * Validates service statistics object structure.
 */
export function isServiceStats(value: unknown): value is ServiceStats {
  if (typeof value !== 'object' || value === null) return false
  const stats = value as Record<string, unknown>
  return (
    typeof stats.serviceId === 'string' &&
    typeof stats.name === 'string' &&
    typeof stats.bookings === 'number' &&
    typeof stats.revenue === 'number' &&
    typeof stats.rating === 'number' &&
    typeof stats.satisfactionRate === 'number' &&
    typeof stats.rank === 'number'
  )
}

/**
 * Runtime type guard for OverviewStats.
 * Validates dashboard overview statistics.
 */
export function isOverviewStats(value: unknown): value is OverviewStats {
  if (typeof value !== 'object' || value === null) return false
  const stats = value as Record<string, unknown>
  return (
    typeof stats.totalBookings === 'number' &&
    typeof stats.totalRevenue === 'number' &&
    typeof stats.totalCustomers === 'number' &&
    typeof stats.activeServices === 'number' &&
    typeof stats.bookingGrowth === 'number' &&
    typeof stats.revenueGrowth === 'number' &&
    typeof stats.averageBookingValue === 'number' &&
    typeof stats.periodLabel === 'string'
  )
}

/**
 * Runtime type guard for MonthlyRevenue.
 * Validates monthly revenue data point.
 */
export function isMonthlyRevenue(value: unknown): value is MonthlyRevenue {
  if (typeof value !== 'object' || value === null) return false
  const revenue = value as Record<string, unknown>
  return (
    typeof revenue.month === 'string' &&
    typeof revenue.value === 'number' &&
    typeof revenue.previousValue === 'number' &&
    typeof revenue.percentageChange === 'number'
  )
}

/**
 * Runtime type guard for UserGrowthData.
 * Validates user growth trend data point.
 */
export function isUserGrowthData(value: unknown): value is UserGrowthData {
  if (typeof value !== 'object' || value === null) return false
  const growth = value as Record<string, unknown>
  return (
    typeof growth.month === 'string' &&
    typeof growth.newUsers === 'number' &&
    typeof growth.total === 'number'
  )
}
