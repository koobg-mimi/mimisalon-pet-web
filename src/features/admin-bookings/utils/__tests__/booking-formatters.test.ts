/**
 * Tests for booking formatter utility functions
 *
 * Tests pure formatting functions that transform data for display.
 * Target coverage: 100%
 */

import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatDate,
  formatTime,
  formatBookingNumber,
  formatDateTime,
  formatPhoneNumber,
} from '../booking-formatters'

describe('formatCurrency', () => {
  it('should format positive amounts as Korean currency', () => {
    expect(formatCurrency(50000)).toBe('₩50,000')
    expect(formatCurrency(1000000)).toBe('₩1,000,000')
    expect(formatCurrency(123456)).toBe('₩123,456')
  })

  it('should format zero as currency', () => {
    expect(formatCurrency(0)).toBe('₩0')
  })

  it('should format large amounts correctly', () => {
    expect(formatCurrency(10000000)).toBe('₩10,000,000')
    expect(formatCurrency(999999999)).toBe('₩999,999,999')
  })

  it('should format negative amounts', () => {
    expect(formatCurrency(-50000)).toBe('-₩50,000')
  })

  it('should format decimal amounts', () => {
    // Korean currency typically doesn't use decimals, but should handle them
    expect(formatCurrency(50000.5)).toBe('₩50,001') // Rounds to nearest won
    expect(formatCurrency(50000.4)).toBe('₩50,000')
  })

  it('should format small amounts', () => {
    expect(formatCurrency(1)).toBe('₩1')
    expect(formatCurrency(100)).toBe('₩100')
    expect(formatCurrency(999)).toBe('₩999')
  })
})

describe('formatDate', () => {
  it('should format ISO date strings to Korean format', () => {
    expect(formatDate('2025-11-02')).toBe('2025년 11월 02일')
    expect(formatDate('2025-01-01')).toBe('2025년 01월 01일')
    expect(formatDate('2025-12-31')).toBe('2025년 12월 31일')
  })

  it('should handle dates with time components', () => {
    expect(formatDate('2025-11-02T10:30:00Z')).toBe('2025년 11월 02일')
    expect(formatDate('2025-11-02T00:00:00Z')).toBe('2025년 11월 02일')
  })

  it('should format dates at year boundaries', () => {
    expect(formatDate('2025-01-01')).toBe('2025년 01월 01일')
    expect(formatDate('2024-12-31')).toBe('2024년 12월 31일')
  })

  it('should handle leap year dates', () => {
    expect(formatDate('2024-02-29')).toBe('2024년 02월 29일')
  })

  it('should format dates from different months', () => {
    expect(formatDate('2025-03-15')).toBe('2025년 03월 15일')
    expect(formatDate('2025-06-20')).toBe('2025년 06월 20일')
    expect(formatDate('2025-09-05')).toBe('2025년 09월 05일')
  })
})

describe('formatTime', () => {
  it('should format time strings to HH:mm', () => {
    expect(formatTime('14:30:00')).toBe('14:30')
    expect(formatTime('09:00:00')).toBe('09:00')
    expect(formatTime('23:59:00')).toBe('23:59')
  })

  it('should handle midnight and noon', () => {
    expect(formatTime('00:00:00')).toBe('00:00')
    expect(formatTime('12:00:00')).toBe('12:00')
  })

  it('should return fallback for null', () => {
    expect(formatTime(null)).toBe('시간 미정')
  })

  it('should return fallback for undefined', () => {
    expect(formatTime(undefined)).toBe('시간 미정')
  })

  it('should handle time strings without seconds', () => {
    expect(formatTime('14:30')).toBe('14:30')
    expect(formatTime('09:00')).toBe('09:00')
  })

  it('should handle edge case times', () => {
    expect(formatTime('00:01:00')).toBe('00:01')
    expect(formatTime('23:59:59')).toBe('23:59')
  })

  it('should handle empty string', () => {
    expect(formatTime('')).toBe('시간 미정')
  })
})

describe('formatBookingNumber', () => {
  it('should extract last 6 digits with # prefix', () => {
    expect(formatBookingNumber('BK-2025-000123')).toBe('#000123')
    expect(formatBookingNumber('BK-2025-999999')).toBe('#999999')
  })

  it('should handle booking numbers with different prefixes', () => {
    expect(formatBookingNumber('BOOKING-2025-123456')).toBe('#123456')
    expect(formatBookingNumber('XXX-2025-789012')).toBe('#789012')
  })

  it('should handle short booking numbers', () => {
    expect(formatBookingNumber('BK-001')).toBe('#BK-001')
    expect(formatBookingNumber('12345')).toBe('#12345')
  })

  it('should handle exactly 6 character booking numbers', () => {
    expect(formatBookingNumber('123456')).toBe('#123456')
    expect(formatBookingNumber('ABCDEF')).toBe('#ABCDEF')
  })

  it('should handle long booking numbers', () => {
    expect(formatBookingNumber('BK-2025-11-02-000123456')).toBe('#123456')
  })
})

describe('formatDateTime', () => {
  it('should combine date and time', () => {
    expect(formatDateTime('2025-11-02', '14:30:00')).toBe('2025년 11월 02일 14:30')
    expect(formatDateTime('2025-01-01', '09:00:00')).toBe('2025년 01월 01일 09:00')
  })

  it('should handle null time', () => {
    expect(formatDateTime('2025-11-02', null)).toBe('2025년 11월 02일 시간 미정')
  })

  it('should handle undefined time', () => {
    expect(formatDateTime('2025-11-02', undefined)).toBe('2025년 11월 02일 시간 미정')
  })

  it('should format midnight', () => {
    expect(formatDateTime('2025-11-02', '00:00:00')).toBe('2025년 11월 02일 00:00')
  })

  it('should format late night times', () => {
    expect(formatDateTime('2025-11-02', '23:59:00')).toBe('2025년 11월 02일 23:59')
  })

  it('should combine different date and time combinations', () => {
    expect(formatDateTime('2025-12-31', '18:30:00')).toBe('2025년 12월 31일 18:30')
    expect(formatDateTime('2025-01-01', '06:00:00')).toBe('2025년 01월 01일 06:00')
  })
})

describe('formatPhoneNumber', () => {
  it('should format 11-digit phone numbers', () => {
    expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678')
    expect(formatPhoneNumber('01098765432')).toBe('010-9876-5432')
  })

  it('should format 10-digit phone numbers', () => {
    expect(formatPhoneNumber('0212345678')).toBe('021-234-5678')
    expect(formatPhoneNumber('0519876543')).toBe('051-987-6543')
  })

  it('should return fallback for null', () => {
    expect(formatPhoneNumber(null)).toBe('-')
  })

  it('should return fallback for undefined', () => {
    expect(formatPhoneNumber(undefined)).toBe('-')
  })

  it('should handle already formatted phone numbers', () => {
    // Should strip non-digits and reformat
    expect(formatPhoneNumber('010-1234-5678')).toBe('010-1234-5678')
    // 9 digits (02-123-4567 -> 021234567) doesn't match pattern, returns original
    expect(formatPhoneNumber('02-123-4567')).toBe('02-123-4567')
  })

  it('should handle phone numbers with spaces', () => {
    expect(formatPhoneNumber('010 1234 5678')).toBe('010-1234-5678')
  })

  it('should handle phone numbers with parentheses', () => {
    expect(formatPhoneNumber('(010) 1234-5678')).toBe('010-1234-5678')
  })

  it('should handle phone numbers with dots', () => {
    expect(formatPhoneNumber('010.1234.5678')).toBe('010-1234-5678')
  })

  it('should return original for unusual formats', () => {
    expect(formatPhoneNumber('123')).toBe('123')
    expect(formatPhoneNumber('12345')).toBe('12345')
  })

  it('should handle empty string', () => {
    expect(formatPhoneNumber('')).toBe('-')
  })

  it('should handle phone numbers with country code', () => {
    // Will format as 12 digits -> returns original
    const withCountryCode = '+821012345678'
    const result = formatPhoneNumber(withCountryCode)
    // Strips to 821012345678 (12 digits) -> doesn't match patterns -> returns original
    expect(result).toBe('+821012345678')
  })

  it('should handle various Seoul area codes', () => {
    expect(formatPhoneNumber('0212345678')).toBe('021-234-5678')
    expect(formatPhoneNumber('0312345678')).toBe('031-234-5678')
    expect(formatPhoneNumber('0512345678')).toBe('051-234-5678')
  })
})
