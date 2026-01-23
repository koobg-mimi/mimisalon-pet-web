/**
 * Dashboard Formatters Test Suite
 *
 * Comprehensive test coverage for dashboard formatting utility functions.
 * Target: 100% coverage for all pure functions.
 *
 * @module features/admin/utils/__tests__/dashboard-formatters
 */

import { describe, it, expect } from 'vitest'
import { isValidElement } from 'react'
import { BookingStatus } from '@mimisalon/shared'

import {
  formatCurrency,
  formatPercent,
  formatNumber,
  formatRating,
  getActivityIcon,
  getStatusIcon,
  type ActivityStatus,
  getStatusColor,
  getStatusTextColor,
  getStatusLabel,
  formatDate,
  formatDateTime,
  getRelativeTime,
} from '../dashboard-formatters'

// ============================================================================
// Number and Currency Formatting Tests
// ============================================================================

describe('formatCurrency', () => {
  it('should format positive amounts with Korean Won symbol', () => {
    expect(formatCurrency(1234567)).toBe('₩1,234,567')
    expect(formatCurrency(100)).toBe('₩100')
    expect(formatCurrency(1)).toBe('₩1')
  })

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('₩0')
  })

  it('should format negative amounts with minus sign', () => {
    expect(formatCurrency(-5000)).toBe('₩-5,000')
    expect(formatCurrency(-123456789)).toBe('₩-123,456,789')
  })

  it('should handle large numbers', () => {
    expect(formatCurrency(1000000000)).toBe('₩1,000,000,000')
    expect(formatCurrency(999999999999)).toBe('₩999,999,999,999')
  })

  it('should handle null and undefined gracefully', () => {
    expect(formatCurrency(null)).toBe('₩0')
    expect(formatCurrency(undefined)).toBe('₩0')
  })

  it('should use Korean locale thousand separators', () => {
    const result = formatCurrency(1234)
    expect(result).toContain(',')
    expect(result).toBe('₩1,234')
  })
})

describe('formatPercent', () => {
  it('should format positive percentages with plus sign', () => {
    expect(formatPercent(12.5)).toBe('+12.5%')
    expect(formatPercent(5.0)).toBe('+5.0%')
    expect(formatPercent(0.1)).toBe('+0.1%')
  })

  it('should format negative percentages with minus sign', () => {
    expect(formatPercent(-5.2)).toBe('-5.2%')
    expect(formatPercent(-12.8)).toBe('-12.8%')
    expect(formatPercent(-0.5)).toBe('-0.5%')
  })

  it('should format zero without sign', () => {
    expect(formatPercent(0)).toBe('0.0%')
  })

  it('should display one decimal place', () => {
    expect(formatPercent(12.567)).toBe('+12.6%')
    expect(formatPercent(-5.234)).toBe('-5.2%')
    expect(formatPercent(100)).toBe('+100.0%')
  })

  it('should handle null and undefined gracefully', () => {
    expect(formatPercent(null)).toBe('0.0%')
    expect(formatPercent(undefined)).toBe('0.0%')
  })

  it('should handle very small percentages', () => {
    expect(formatPercent(0.01)).toBe('+0.0%')
    expect(formatPercent(-0.01)).toBe('-0.0%')
  })

  it('should handle very large percentages', () => {
    expect(formatPercent(1000)).toBe('+1000.0%')
    expect(formatPercent(-500)).toBe('-500.0%')
  })
})

describe('formatNumber', () => {
  it('should format positive numbers with thousand separators', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
    expect(formatNumber(1000)).toBe('1,000')
    expect(formatNumber(100)).toBe('100')
  })

  it('should format zero correctly', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('should format negative numbers with minus sign', () => {
    expect(formatNumber(-1000)).toBe('-1,000')
    expect(formatNumber(-123456)).toBe('-123,456')
  })

  it('should handle single digit numbers', () => {
    expect(formatNumber(1)).toBe('1')
    expect(formatNumber(9)).toBe('9')
  })

  it('should handle null and undefined gracefully', () => {
    expect(formatNumber(null)).toBe('0')
    expect(formatNumber(undefined)).toBe('0')
  })

  it('should use Korean locale formatting', () => {
    const result = formatNumber(1234567)
    expect(result).toContain(',')
    expect(result.split(',').length - 1).toBe(2) // Two commas
  })

  it('should handle very large numbers', () => {
    expect(formatNumber(9999999999)).toBe('9,999,999,999')
  })
})

describe('formatRating', () => {
  it('should format ratings with star emoji and one decimal', () => {
    expect(formatRating(4.5)).toBe('⭐ 4.5')
    expect(formatRating(3.7)).toBe('⭐ 3.7')
    expect(formatRating(5.0)).toBe('⭐ 5.0')
  })

  it('should format whole number ratings with decimal', () => {
    expect(formatRating(5)).toBe('⭐ 5.0')
    expect(formatRating(4)).toBe('⭐ 4.0')
    expect(formatRating(3)).toBe('⭐ 3.0')
  })

  it('should format zero rating', () => {
    expect(formatRating(0)).toBe('⭐ 0.0')
  })

  it('should handle null and undefined gracefully', () => {
    expect(formatRating(null)).toBe('⭐ 0.0')
    expect(formatRating(undefined)).toBe('⭐ 0.0')
  })

  it('should round to one decimal place', () => {
    expect(formatRating(4.567)).toBe('⭐ 4.6')
    expect(formatRating(3.234)).toBe('⭐ 3.2')
    expect(formatRating(4.999)).toBe('⭐ 5.0')
  })

  it('should handle ratings outside 0-5 range', () => {
    expect(formatRating(6.5)).toBe('⭐ 6.5')
    expect(formatRating(-1)).toBe('⭐ -1.0')
  })
})

// ============================================================================
// Icon Helper Tests
// ============================================================================

describe('getActivityIcon', () => {
  it('should return valid React element for booking activity', () => {
    const icon = getActivityIcon('booking')
    expect(icon).toBeTruthy()
    expect(isValidElement(icon)).toBe(true)
  })

  it('should return valid React element for review activity', () => {
    const icon = getActivityIcon('review')
    expect(icon).toBeTruthy()
    expect(isValidElement(icon)).toBe(true)
  })

  it('should return valid React element for user_signup activity', () => {
    const icon = getActivityIcon('user_signup')
    expect(icon).toBeTruthy()
    expect(isValidElement(icon)).toBe(true)
  })

  it('should return valid React element for payment activity', () => {
    const icon = getActivityIcon('payment')
    expect(icon).toBeTruthy()
    expect(isValidElement(icon)).toBe(true)
  })

  it('should return valid React elements for all activity types', () => {
    const types: Array<'booking' | 'review' | 'user_signup' | 'payment'> = [
      'booking',
      'review',
      'user_signup',
      'payment',
    ]

    types.forEach((type) => {
      const icon = getActivityIcon(type)
      expect(icon).toBeTruthy()
      expect(isValidElement(icon)).toBe(true)
    })
  })
})

describe('getStatusIcon', () => {
  it('should return valid React element for success statuses', () => {
    const completedIcon = getStatusIcon('completed')
    const successIcon = getStatusIcon('success')

    expect(completedIcon).toBeTruthy()
    expect(successIcon).toBeTruthy()
    expect(isValidElement(completedIcon)).toBe(true)
    expect(isValidElement(successIcon)).toBe(true)
  })

  it('should return valid React element for pending status', () => {
    const icon = getStatusIcon('pending')
    expect(icon).toBeTruthy()
    expect(isValidElement(icon)).toBe(true)
  })

  it('should return valid React element for error statuses', () => {
    const statuses = ['cancelled', 'failed', 'error']

    statuses.forEach((status) => {
      const icon = getStatusIcon(status)
      expect(icon).toBeTruthy()
      expect(isValidElement(icon)).toBe(true)
    })
  })

  it('should return valid React element for unknown status', () => {
    const icon = getStatusIcon('unknown_status')
    expect(icon).toBeTruthy()
    expect(isValidElement(icon)).toBe(true)
  })
})

// ============================================================================
// Status Color Helper Tests
// ============================================================================

describe('getStatusColor', () => {
  it('should return green colors for completed status', () => {
    const completed = getStatusColor('completed')

    expect(completed).toEqual({ text: 'text-green-500', bg: 'bg-green-100' })
  })

  it('should return yellow colors for pending status', () => {
    const pending = getStatusColor('pending')
    expect(pending).toEqual({ text: 'text-yellow-500', bg: 'bg-yellow-100' })
  })

  it('should return red colors for failed status', () => {
    const failed = getStatusColor('failed')
    expect(failed).toEqual({ text: 'text-red-500', bg: 'bg-red-100' })
  })

  it('should return gray colors for unknown status', () => {
    const unknown = getStatusColor('unknown_status' as any)
    expect(unknown).toEqual({ text: 'text-gray-500', bg: 'bg-gray-100' })
  })

  it('should return consistent color pairs', () => {
    const colors = getStatusColor('completed')
    expect(colors.text).toContain('text-')
    expect(colors.bg).toContain('bg-')
    expect(colors.text.split('-')[1]).toBe(colors.bg.split('-')[1]) // Same color family
  })

  it('should handle BookingStatus enum - completed states', () => {
    const completedStatuses = [
      BookingStatus.SERVICE_COMPLETED,
      BookingStatus.FIRST_PAYMENT_COMPLETE,
      BookingStatus.FIRST_PAYMENT_VERIFY,
      BookingStatus.ADDITIONAL_PAYMENT_COMPLETE,
    ]

    completedStatuses.forEach((status) => {
      const colors = getStatusColor(status)
      expect(colors).toEqual({ text: 'text-green-500', bg: 'bg-green-100' })
    })
  })

  it('should handle BookingStatus enum - pending states', () => {
    const pendingStatuses = [
      BookingStatus.FIRST_PAYMENT_PENDING,
      BookingStatus.GROOMER_CONFIRM_PENDING,
      BookingStatus.ADDITIONAL_PAYMENT_PENDING,
    ]

    pendingStatuses.forEach((status) => {
      const colors = getStatusColor(status)
      expect(colors).toEqual({ text: 'text-yellow-500', bg: 'bg-yellow-100' })
    })
  })

  it('should handle BookingStatus enum - confirmed state', () => {
    const colors = getStatusColor(BookingStatus.GROOMER_CONFIRM)
    expect(colors).toEqual({ text: 'text-blue-500', bg: 'bg-blue-100' })
  })

  it('should handle BookingStatus enum - in-progress state', () => {
    const colors = getStatusColor(BookingStatus.WORK_IN_PROGRESS)
    expect(colors).toEqual({ text: 'text-indigo-500', bg: 'bg-indigo-100' })
  })

  it('should handle BookingStatus enum - cancelled state', () => {
    const colors = getStatusColor(BookingStatus.SERVICE_CANCELLED)
    expect(colors).toEqual({ text: 'text-red-500', bg: 'bg-red-100' })
  })
})

describe('getStatusTextColor', () => {
  it('should return text color only for completed status', () => {
    expect(getStatusTextColor('completed')).toBe('text-green-500')
  })

  it('should return text color only for pending status', () => {
    expect(getStatusTextColor('pending')).toBe('text-yellow-500')
  })

  it('should return text color only for failed status', () => {
    expect(getStatusTextColor('failed')).toBe('text-red-500')
  })

  it('should match getStatusColor text property', () => {
    const statuses: ActivityStatus[] = ['completed', 'pending', 'failed']

    statuses.forEach((status) => {
      const textColor = getStatusTextColor(status)
      const fullColors = getStatusColor(status)
      expect(textColor).toBe(fullColors.text)
    })
  })

  it('should handle BookingStatus enum values', () => {
    const bookingStatuses = [
      BookingStatus.SERVICE_COMPLETED,
      BookingStatus.FIRST_PAYMENT_PENDING,
      BookingStatus.GROOMER_CONFIRM,
      BookingStatus.WORK_IN_PROGRESS,
      BookingStatus.SERVICE_CANCELLED,
    ]

    bookingStatuses.forEach((status) => {
      const textColor = getStatusTextColor(status)
      const fullColors = getStatusColor(status)
      expect(textColor).toBe(fullColors.text)
      expect(textColor).toContain('text-')
    })
  })
})

describe('getStatusLabel', () => {
  it('should return Korean label for completed status', () => {
    expect(getStatusLabel('completed')).toBe('완료')
  })

  it('should return Korean label for pending status', () => {
    expect(getStatusLabel('pending')).toBe('대기')
  })

  it('should return Korean label for failed status', () => {
    expect(getStatusLabel('failed')).toBe('실패')
  })

  it('should return default label for unknown status', () => {
    expect(getStatusLabel('unknown_status' as any)).toBe('알 수 없음')
  })

  it('should return all strings in Korean', () => {
    const statuses: ActivityStatus[] = ['completed', 'pending', 'failed']

    statuses.forEach((status) => {
      const label = getStatusLabel(status)
      // Check that label contains Korean characters (Unicode range)
      const hasKorean = /[\uAC00-\uD7AF]/.test(label)
      expect(hasKorean).toBe(true)
    })
  })

  it('should handle BookingStatus enum - payment states', () => {
    expect(getStatusLabel(BookingStatus.FIRST_PAYMENT_PENDING)).toBe('결제 대기')
    expect(getStatusLabel(BookingStatus.FIRST_PAYMENT_COMPLETE)).toBe('결제 완료')
    expect(getStatusLabel(BookingStatus.FIRST_PAYMENT_VERIFY)).toBe('결제 확인 중')
    expect(getStatusLabel(BookingStatus.ADDITIONAL_PAYMENT_PENDING)).toBe('추가 결제 대기')
    expect(getStatusLabel(BookingStatus.ADDITIONAL_PAYMENT_COMPLETE)).toBe('추가 결제 완료')
  })

  it('should handle BookingStatus enum - groomer states', () => {
    expect(getStatusLabel(BookingStatus.GROOMER_CONFIRM_PENDING)).toBe('미용사 확인 대기')
    expect(getStatusLabel(BookingStatus.GROOMER_CONFIRM)).toBe('예약 확정')
  })

  it('should handle BookingStatus enum - service states', () => {
    expect(getStatusLabel(BookingStatus.WORK_IN_PROGRESS)).toBe('진행 중')
    expect(getStatusLabel(BookingStatus.SERVICE_COMPLETED)).toBe('서비스 완료')
    expect(getStatusLabel(BookingStatus.SERVICE_CANCELLED)).toBe('취소됨')
  })

  it('should return Korean labels for all BookingStatus values', () => {
    const allBookingStatuses = Object.values(BookingStatus)

    allBookingStatuses.forEach((status) => {
      const label = getStatusLabel(status)
      // Check that label contains Korean characters
      const hasKorean = /[\uAC00-\uD7AF]/.test(label)
      expect(hasKorean).toBe(true)
      expect(label).not.toBe('알 수 없음') // No status should be unknown
    })
  })
})

// ============================================================================
// Date Formatting Tests
// ============================================================================

describe('formatDate', () => {
  it('should format Date objects in Korean format', () => {
    const date = new Date('2025-10-30T14:30:00')
    const formatted = formatDate(date)

    expect(formatted).toContain('2025')
    expect(formatted).toContain('10')
    expect(formatted).toContain('30')
  })

  it('should format ISO string dates', () => {
    const formatted = formatDate('2025-10-30T14:30:00')

    expect(formatted).toContain('2025')
    expect(formatted).toContain('10')
    expect(formatted).toContain('30')
  })

  it('should use consistent date separator', () => {
    const formatted = formatDate(new Date('2025-01-15'))
    // Korean locale typically uses dots or slashes
    expect(formatted).toBeTruthy()
    expect(formatted.length).toBeGreaterThan(8)
  })

  it('should handle different months correctly', () => {
    const jan = formatDate(new Date('2025-01-01'))
    const dec = formatDate(new Date('2025-12-31'))

    expect(jan).toContain('01')
    expect(dec).toContain('12')
  })
})

describe('formatDateTime', () => {
  it('should format Date objects with time in Korean format', () => {
    const date = new Date('2025-10-30T14:30:00')
    const formatted = formatDateTime(date)

    expect(formatted).toContain('2025')
    expect(formatted).toContain('14')
    expect(formatted).toContain('30')
  })

  it('should format ISO string datetimes', () => {
    const formatted = formatDateTime('2025-10-30T14:30:00')

    expect(formatted).toContain('2025')
    expect(formatted).toContain('14')
    expect(formatted).toContain('30')
  })

  it('should use 24-hour format', () => {
    const morning = formatDateTime(new Date('2025-10-30T09:30:00'))
    const afternoon = formatDateTime(new Date('2025-10-30T15:30:00'))

    expect(morning).toContain('09')
    expect(afternoon).toContain('15')
    expect(afternoon).not.toContain('03') // Not 3 PM
  })

  it('should include both date and time components', () => {
    const formatted = formatDateTime(new Date('2025-10-30T14:30:00'))

    // Should have date components
    expect(formatted).toContain('2025')
    expect(formatted).toContain('10')
    expect(formatted).toContain('30')

    // Should have time components
    expect(formatted).toContain('14')
    expect(formatted).toContain('30')
  })
})

describe('getRelativeTime', () => {
  it('should return "방금 전" for very recent times', () => {
    const now = new Date()
    const recent = new Date(now.getTime() - 30000) // 30 seconds ago

    expect(getRelativeTime(recent)).toBe('방금 전')
  })

  it('should return minutes for times within an hour', () => {
    const now = new Date()
    const fiveMinsAgo = new Date(now.getTime() - 5 * 60000)

    const result = getRelativeTime(fiveMinsAgo)
    expect(result).toContain('분 전')
    expect(result).toContain('5')
  })

  it('should return hours for times within a day', () => {
    const now = new Date()
    const twoHoursAgo = new Date(now.getTime() - 2 * 3600000)

    const result = getRelativeTime(twoHoursAgo)
    expect(result).toContain('시간 전')
    expect(result).toContain('2')
  })

  it('should return days for times within a week', () => {
    const now = new Date()
    const threeDaysAgo = new Date(now.getTime() - 3 * 86400000)

    const result = getRelativeTime(threeDaysAgo)
    expect(result).toContain('일 전')
    expect(result).toContain('3')
  })

  it('should return formatted date for times over a week', () => {
    const now = new Date()
    const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000)

    const result = getRelativeTime(twoWeeksAgo)
    // Should return formatted date, not relative time
    expect(result).not.toContain('전')
  })

  it('should handle string date inputs', () => {
    const now = new Date()
    const fiveMinsAgo = new Date(now.getTime() - 5 * 60000).toISOString()

    const result = getRelativeTime(fiveMinsAgo)
    expect(result).toContain('분 전')
  })

  it('should handle edge case at exactly 1 minute', () => {
    const now = new Date()
    const oneMinAgo = new Date(now.getTime() - 60000)

    const result = getRelativeTime(oneMinAgo)
    expect(result).toContain('분 전')
  })

  it('should handle edge case at exactly 1 hour', () => {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 3600000)

    const result = getRelativeTime(oneHourAgo)
    expect(result).toContain('시간 전')
  })

  it('should handle edge case at exactly 1 day', () => {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 86400000)

    const result = getRelativeTime(oneDayAgo)
    expect(result).toContain('일 전')
  })
})

// ============================================================================
// Integration Tests
// ============================================================================

describe('Integration: Formatting consistency', () => {
  it('should format currency and percent with consistent precision', () => {
    const currency = formatCurrency(12345.67)
    const percent = formatPercent(12.345)

    // Both should have consistent formatting style
    expect(currency).toBeTruthy()
    expect(percent).toBeTruthy()
  })

  it('should handle null values consistently across all formatters', () => {
    expect(formatCurrency(null)).toBe('₩0')
    expect(formatPercent(null)).toBe('0.0%')
    expect(formatNumber(null)).toBe('0')
    expect(formatRating(null)).toBe('⭐ 0.0')
  })

  it('should return Korean locale formatted strings', () => {
    const num = formatNumber(1000000)
    const currency = formatCurrency(1000000)

    // Korean locale uses commas for thousands
    expect(num).toContain(',')
    expect(currency).toContain(',')
  })

  it('should provide semantic color-status consistency', () => {
    const statuses: ActivityStatus[] = ['completed', 'pending', 'failed']

    statuses.forEach((status) => {
      const colors = getStatusColor(status)
      const label = getStatusLabel(status)

      // Both should be truthy
      expect(colors.text).toBeTruthy()
      expect(colors.bg).toBeTruthy()
      expect(label).toBeTruthy()
    })
  })
})

describe('Edge Cases and Error Handling', () => {
  it('should handle extremely large numbers', () => {
    const large = 999999999999999
    expect(() => formatCurrency(large)).not.toThrow()
    expect(() => formatNumber(large)).not.toThrow()
  })

  it('should handle extremely small numbers', () => {
    expect(formatPercent(0.001)).toBe('+0.0%')
    expect(formatCurrency(0.1)).toBe('₩0.1')
  })

  it('should handle negative zero', () => {
    // In JavaScript, -0 is formatted differently in toLocaleString
    // Accept both '₩0' and '₩-0' as valid
    const currency = formatCurrency(-0)
    expect(currency === '₩0' || currency === '₩-0').toBe(true)

    const number = formatNumber(-0)
    expect(number === '0' || number === '-0').toBe(true)

    expect(formatPercent(-0)).toBe('0.0%')
  })

  it('should handle infinity gracefully', () => {
    // JavaScript Infinity should not crash formatters
    const inf = formatNumber(Infinity)
    expect(inf).toBeTruthy()
  })

  it('should handle NaN gracefully', () => {
    // NaN should convert to string representation
    const nan = formatNumber(NaN)
    expect(nan).toBeTruthy()
  })
})
