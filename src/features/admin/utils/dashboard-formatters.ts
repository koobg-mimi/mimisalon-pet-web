/**
 * Dashboard Formatting Utility Functions
 *
 * This module provides pure formatting functions for displaying dashboard data
 * in a user-friendly, localized format. All functions follow Korean locale conventions.
 *
 * @module features/admin/utils/dashboard-formatters
 */

import { createElement } from 'react'
import type { ReactNode } from 'react'
import { Calendar, CheckCircle, Clock, CreditCard, Star, UserPlus, XCircle } from 'lucide-react'
import { BookingStatus } from '@mimisalon/shared'

import type { ActivityItem } from '../types/dashboard.types'

// ============================================================================
// Status Type Definitions
// ============================================================================

/**
 * Payment activity status values used in ActivityItem
 * Subset of PaymentStatus enum for activity feed display
 */
export type PaymentActivityStatus = 'completed' | 'pending' | 'failed'

/**
 * Union type for all activity status values
 * Combines BookingStatus enum with PaymentActivityStatus
 */
export type ActivityStatus = BookingStatus | PaymentActivityStatus

// ============================================================================
// Number and Currency Formatting
// ============================================================================

/**
 * Format a number as Korean Won currency with proper locale formatting.
 *
 * Uses Korean Won symbol (₩) and Korean number formatting conventions.
 * Handles null, undefined, and edge cases gracefully.
 *
 * @param amount - Amount in cents (or base currency unit)
 * @returns Formatted currency string with ₩ symbol and thousand separators
 *
 * @example
 * ```typescript
 * formatCurrency(1234567) // "₩1,234,567"
 * formatCurrency(0)       // "₩0"
 * formatCurrency(-5000)   // "₩-5,000"
 * formatCurrency(null)    // "₩0"
 * ```
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return '₩0'

  // Use Korean locale for number formatting
  const formatted = amount.toLocaleString('ko-KR')
  return `₩${formatted}`
}

/**
 * Format a percentage value with proper sign and precision.
 *
 * Automatically adds + or - sign based on value.
 * Displays one decimal place for precision.
 *
 * @param percent - Percentage value (e.g., 12.5 for 12.5%)
 * @returns Formatted percentage string with sign
 *
 * @example
 * ```typescript
 * formatPercent(12.5)   // "+12.5%"
 * formatPercent(-5.2)   // "-5.2%"
 * formatPercent(0)      // "0.0%"
 * formatPercent(null)   // "0.0%"
 * ```
 */
export function formatPercent(percent: number | null | undefined): string {
  if (percent == null) return '0.0%'

  // Add explicit + sign for positive values
  const sign = percent > 0 ? '+' : percent < 0 ? '' : ''
  return `${sign}${percent.toFixed(1)}%`
}

/**
 * Format a number with Korean locale thousand separators.
 *
 * Simple number formatting without currency symbols.
 * Useful for counts, quantities, and non-monetary values.
 *
 * @param num - Number to format
 * @returns Formatted number string with thousand separators
 *
 * @example
 * ```typescript
 * formatNumber(1234567)  // "1,234,567"
 * formatNumber(0)        // "0"
 * formatNumber(-1000)    // "-1,000"
 * formatNumber(null)     // "0"
 * ```
 */
export function formatNumber(num: number | null | undefined): string {
  if (num == null) return '0'
  return num.toLocaleString('ko-KR')
}

/**
 * Format a rating value with star emoji and fixed precision.
 *
 * Displays rating with one decimal place and star emoji prefix.
 * Commonly used for service ratings, review scores, etc.
 *
 * @param rating - Rating value (typically 0-5 scale)
 * @returns Formatted rating string with star emoji
 *
 * @example
 * ```typescript
 * formatRating(4.5)    // "⭐ 4.5"
 * formatRating(3.0)    // "⭐ 3.0"
 * formatRating(5)      // "⭐ 5.0"
 * formatRating(0)      // "⭐ 0.0"
 * formatRating(null)   // "⭐ 0.0"
 * ```
 */
export function formatRating(rating: number | null | undefined): string {
  if (rating == null) return '⭐ 0.0'
  return `⭐ ${rating.toFixed(1)}`
}

// ============================================================================
// Activity Icon Helpers
// ============================================================================

/**
 * Get the appropriate Lucide React icon component for an activity type.
 *
 * Returns icon as a JSX element for direct use in components.
 * All icons use consistent sizing (h-4 w-4) for visual harmony.
 *
 * Icon mapping:
 * - booking → Calendar icon
 * - review → Star icon
 * - user_signup → UserPlus icon
 * - payment → CreditCard icon
 *
 * @param type - Activity type from ActivityItem discriminated union
 * @returns React element containing the appropriate icon
 *
 * @example
 * ```typescript
 * const icon = getActivityIcon('booking');
 * // Returns: <Calendar className="h-4 w-4" />
 *
 * // Usage in component:
 * <div>{getActivityIcon(activity.type)}</div>
 * ```
 */
export function getActivityIcon(type: ActivityItem['type']): ReactNode {
  switch (type) {
    case 'booking':
      return createElement(Calendar, { className: 'h-4 w-4' })
    case 'review':
      return createElement(Star, { className: 'h-4 w-4' })
    case 'user_signup':
      return createElement(UserPlus, { className: 'h-4 w-4' })
    case 'payment':
      return createElement(CreditCard, { className: 'h-4 w-4' })
    default:
      // Exhaustiveness check - TypeScript will error if we miss a case
      const _exhaustive: never = type
      return null
  }
}

/**
 * Get the appropriate Lucide React icon component for a booking status.
 *
 * Returns icon as a JSX element for status indicators.
 * Uses semantic icons that clearly communicate status state.
 *
 * Status mapping:
 * - completed/success → CheckCircle (green context)
 * - pending → Clock (yellow context)
 * - cancelled/failed → XCircle (red context)
 *
 * @param status - Status string from booking or payment
 * @returns React element containing the appropriate status icon
 *
 * @example
 * ```typescript
 * const icon = getStatusIcon('completed');
 * // Returns: <CheckCircle className="h-4 w-4" />
 * ```
 */
export function getStatusIcon(
  status: 'completed' | 'pending' | 'cancelled' | 'failed' | string
): ReactNode {
  switch (status) {
    case 'completed':
    case 'success':
      return createElement(CheckCircle, { className: 'h-4 w-4' })
    case 'pending':
      return createElement(Clock, { className: 'h-4 w-4' })
    case 'cancelled':
    case 'failed':
    case 'error':
      return createElement(XCircle, { className: 'h-4 w-4' })
    default:
      return createElement(Clock, { className: 'h-4 w-4' }) // Default to pending icon
  }
}

// ============================================================================
// Activity Status Color Helpers
// ============================================================================

/**
 * Get Tailwind CSS color classes for activity status visualization.
 *
 * Returns color classes for both text and background styling.
 * Follows semantic color conventions for status states.
 *
 * Color mapping:
 * - Completed states → Green (text-green-500, bg-green-100)
 * - Pending/In-progress states → Yellow (text-yellow-500, bg-yellow-100)
 * - Cancelled/Failed states → Red (text-red-500, bg-red-100)
 * - Confirmed states → Blue (text-blue-500, bg-blue-100)
 *
 * @param status - ActivityStatus (BookingStatus or PaymentActivityStatus)
 * @returns Object with text and bg Tailwind color classes
 *
 * @example
 * ```typescript
 * const colors = getStatusColor(BookingStatus.SERVICE_COMPLETED);
 * // Returns: { text: 'text-green-500', bg: 'bg-green-100' }
 *
 * // Usage in component:
 * <div className={colors.bg}>
 *   <span className={colors.text}>Completed</span>
 * </div>
 * ```
 */
export function getStatusColor(status: ActivityStatus): { text: string; bg: string } {
  switch (status) {
    // Completed states - Green
    case BookingStatus.SERVICE_COMPLETED:
    case BookingStatus.FIRST_PAYMENT_COMPLETE:
    case BookingStatus.FIRST_PAYMENT_VERIFY:
    case BookingStatus.ADDITIONAL_PAYMENT_COMPLETE:
    case 'completed':
      return {
        text: 'text-green-500',
        bg: 'bg-green-100',
      }

    // Confirmed states - Blue
    case BookingStatus.GROOMER_CONFIRM:
      return {
        text: 'text-blue-500',
        bg: 'bg-blue-100',
      }

    // In-progress states - Indigo
    case BookingStatus.WORK_IN_PROGRESS:
      return {
        text: 'text-indigo-500',
        bg: 'bg-indigo-100',
      }

    // Pending states - Yellow
    case BookingStatus.FIRST_PAYMENT_PENDING:
    case BookingStatus.GROOMER_CONFIRM_PENDING:
    case BookingStatus.ADDITIONAL_PAYMENT_PENDING:
    case 'pending':
      return {
        text: 'text-yellow-500',
        bg: 'bg-yellow-100',
      }

    // Cancelled/Failed states - Red
    case BookingStatus.SERVICE_CANCELLED:
    case 'failed':
      return {
        text: 'text-red-500',
        bg: 'bg-red-100',
      }

    default:
      // Default to neutral gray for unknown statuses
      return {
        text: 'text-gray-500',
        bg: 'bg-gray-100',
      }
  }
}

/**
 * Get Tailwind CSS color class for text-only status display.
 *
 * Simplified version of getStatusColor that only returns text color.
 * Useful when you don't need background styling.
 *
 * @param status - ActivityStatus (BookingStatus or PaymentActivityStatus)
 * @returns Tailwind text color class
 *
 * @example
 * ```typescript
 * getStatusTextColor(BookingStatus.SERVICE_COMPLETED)  // "text-green-500"
 * getStatusTextColor('pending')                        // "text-yellow-500"
 * getStatusTextColor('failed')                         // "text-red-500"
 * ```
 */
export function getStatusTextColor(status: ActivityStatus): string {
  return getStatusColor(status).text
}

/**
 * Get Korean label for activity status.
 *
 * Translates BookingStatus enum and payment status values
 * to user-friendly Korean labels for UI display.
 *
 * @param status - ActivityStatus (BookingStatus or PaymentActivityStatus)
 * @returns Korean label for the status
 *
 * @example
 * ```typescript
 * getStatusLabel(BookingStatus.SERVICE_COMPLETED)     // "서비스 완료"
 * getStatusLabel(BookingStatus.FIRST_PAYMENT_PENDING) // "결제 대기"
 * getStatusLabel('completed')                         // "완료"
 * getStatusLabel('pending')                           // "대기"
 * ```
 */
export function getStatusLabel(status: ActivityStatus): string {
  switch (status) {
    // BookingStatus enum - Detailed labels
    case BookingStatus.FIRST_PAYMENT_PENDING:
      return '결제 대기'
    case BookingStatus.FIRST_PAYMENT_COMPLETE:
      return '결제 완료'
    case BookingStatus.FIRST_PAYMENT_VERIFY:
      return '결제 확인 중'
    case BookingStatus.GROOMER_CONFIRM_PENDING:
      return '미용사 확인 대기'
    case BookingStatus.GROOMER_CONFIRM:
      return '예약 확정'
    case BookingStatus.ADDITIONAL_PAYMENT_PENDING:
      return '추가 결제 대기'
    case BookingStatus.ADDITIONAL_PAYMENT_COMPLETE:
      return '추가 결제 완료'
    case BookingStatus.WORK_IN_PROGRESS:
      return '진행 중'
    case BookingStatus.SERVICE_COMPLETED:
      return '서비스 완료'
    case BookingStatus.SERVICE_CANCELLED:
      return '취소됨'

    // PaymentActivityStatus - Simple labels
    case 'completed':
      return '완료'
    case 'pending':
      return '대기'
    case BookingStatus.BOOKING_FAILED:
    case 'failed':
      return '실패'

    default:
      return '알 수 없음'
  }
}

// ============================================================================
// Date Formatting Helpers
// ============================================================================

/**
 * Format date with Korean locale conventions.
 *
 * Uses date-fns for consistent formatting across the application.
 * Returns date in YYYY-MM-DD format.
 *
 * @param date - Date to format
 * @returns Formatted date string in Korean format
 *
 * @example
 * ```typescript
 * formatDate(new Date('2025-10-30')) // "2025-10-30"
 * ```
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * Format datetime with Korean locale conventions.
 *
 * Returns datetime in YYYY-MM-DD HH:mm format.
 *
 * @param date - Date to format
 * @returns Formatted datetime string in Korean format
 *
 * @example
 * ```typescript
 * formatDateTime(new Date('2025-10-30T14:30:00')) // "2025-10-30 14:30"
 * ```
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * Get relative time label (e.g., "방금 전", "5분 전").
 *
 * Returns human-readable Korean time labels for recent timestamps.
 *
 * @param date - Date to get relative time for
 * @returns Korean relative time label
 *
 * @example
 * ```typescript
 * getRelativeTime(new Date(Date.now() - 1000))    // "방금 전"
 * getRelativeTime(new Date(Date.now() - 300000))  // "5분 전"
 * ```
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '방금 전'
  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 7) return `${diffDays}일 전`

  return formatDate(d)
}
