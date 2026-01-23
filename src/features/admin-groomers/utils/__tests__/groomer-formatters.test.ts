/**
 * Tests for groomer formatter utility functions
 *
 * Tests pure formatting functions that transform data for display.
 * Target coverage: 100%
 */

import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatCoordinates,
  calculateAge,
  formatAge,
  formatRating,
  formatCommissionRate,
  formatPhoneNumber,
} from '../groomer-formatters'

describe('formatCurrency', () => {
  it('should format positive amounts as Korean currency', () => {
    expect(formatCurrency(50000)).toBe('50,000원')
    expect(formatCurrency(1000000)).toBe('1,000,000원')
    expect(formatCurrency(123456)).toBe('123,456원')
  })

  it('should format zero as currency', () => {
    expect(formatCurrency(0)).toBe('0원')
  })

  it('should format large amounts correctly', () => {
    expect(formatCurrency(10000000)).toBe('10,000,000원')
    expect(formatCurrency(999999999)).toBe('999,999,999원')
  })

  it('should format negative amounts', () => {
    expect(formatCurrency(-50000)).toBe('-50,000원')
  })

  it('should format small amounts', () => {
    expect(formatCurrency(1)).toBe('1원')
    expect(formatCurrency(100)).toBe('100원')
    expect(formatCurrency(999)).toBe('999원')
  })

  it('should format decimal amounts', () => {
    expect(formatCurrency(50000.5)).toBe('50,000.5원')
    expect(formatCurrency(50000.99)).toBe('50,000.99원')
  })
})

describe('formatDate', () => {
  it('should format ISO date strings to yyyy-MM-dd format', () => {
    expect(formatDate('2025-11-02')).toBe('2025-11-02')
    expect(formatDate('2025-01-01')).toBe('2025-01-01')
    expect(formatDate('2025-12-31')).toBe('2025-12-31')
  })

  it('should handle dates with time components', () => {
    expect(formatDate('2025-11-02T10:30:00Z')).toBe('2025-11-02')
    expect(formatDate('2025-11-02T00:00:00Z')).toBe('2025-11-02')
  })

  it('should format dates at year boundaries', () => {
    expect(formatDate('2025-01-01')).toBe('2025-01-01')
    expect(formatDate('2024-12-31')).toBe('2024-12-31')
  })

  it('should handle leap year dates', () => {
    expect(formatDate('2024-02-29')).toBe('2024-02-29')
  })

  it('should format dates from different months', () => {
    expect(formatDate('2025-03-15')).toBe('2025-03-15')
    expect(formatDate('2025-06-20')).toBe('2025-06-20')
    expect(formatDate('2025-09-05')).toBe('2025-09-05')
  })
})

describe('formatDateTime', () => {
  it('should format ISO date-time strings to yyyy-MM-dd HH:mm:ss format', () => {
    expect(formatDateTime('2025-11-02T14:30:45Z')).toBe('2025-11-02 14:30:45')
    expect(formatDateTime('2025-01-01T09:00:00Z')).toBe('2025-01-01 09:00:00')
  })

  it('should handle midnight', () => {
    expect(formatDateTime('2025-11-02T00:00:00Z')).toBe('2025-11-02 00:00:00')
  })

  it('should handle late night times', () => {
    expect(formatDateTime('2025-11-02T23:59:59Z')).toBe('2025-11-02 23:59:59')
  })

  it('should format various date-time combinations', () => {
    expect(formatDateTime('2025-12-31T18:30:00Z')).toBe('2025-12-31 18:30:00')
    expect(formatDateTime('2025-01-01T06:00:00Z')).toBe('2025-01-01 06:00:00')
  })
})

describe('formatCoordinates', () => {
  it('should format coordinates with 4 decimal places', () => {
    expect(formatCoordinates(37.5665, 126.978)).toBe('37.5665°N, 126.9780°E')
    expect(formatCoordinates(35.1796, 129.0756)).toBe('35.1796°N, 129.0756°E')
  })

  it('should handle zero coordinates', () => {
    expect(formatCoordinates(0, 0)).toBe('0.0000°N, 0.0000°E')
  })

  it('should handle negative coordinates', () => {
    expect(formatCoordinates(-33.8688, 151.2093)).toBe('-33.8688°N, 151.2093°E')
  })

  it('should round to 4 decimal places', () => {
    expect(formatCoordinates(37.56651234, 126.97801234)).toBe('37.5665°N, 126.9780°E')
    expect(formatCoordinates(37.56659999, 126.97809999)).toBe('37.5666°N, 126.9781°E')
  })

  it('should handle very small coordinates', () => {
    expect(formatCoordinates(0.0001, 0.0001)).toBe('0.0001°N, 0.0001°E')
  })

  it('should handle large coordinates', () => {
    expect(formatCoordinates(89.9999, 179.9999)).toBe('89.9999°N, 179.9999°E')
  })
})

describe('calculateAge', () => {
  it('should calculate age correctly', () => {
    // Mock today as 2025-11-03
    const result1990 = calculateAge('1990-05-15')
    expect(result1990).toBeGreaterThanOrEqual(34)
    expect(result1990).toBeLessThanOrEqual(35)

    const result2000 = calculateAge('2000-01-01')
    expect(result2000).toBeGreaterThanOrEqual(24)
    expect(result2000).toBeLessThanOrEqual(25)
  })

  it('should return null for null birth date', () => {
    expect(calculateAge(null)).toBe(null)
  })

  it('should return null for undefined birth date', () => {
    expect(calculateAge(undefined)).toBe(null)
  })

  it('should handle birth date before birthday this year', () => {
    // Someone born on Dec 31 hasn't had birthday yet if today is before Dec 31
    const resultDec = calculateAge('2000-12-31')
    expect(resultDec).toBeGreaterThanOrEqual(24)
    expect(resultDec).toBeLessThanOrEqual(25)
  })

  it('should handle birth date after birthday this year', () => {
    // Someone born on Jan 1 already had birthday this year
    const resultJan = calculateAge('2000-01-01')
    expect(resultJan).toBeGreaterThanOrEqual(24)
    expect(resultJan).toBeLessThanOrEqual(25)
  })

  it('should handle leap year birth dates', () => {
    const result = calculateAge('1992-02-29')
    expect(result).toBeGreaterThanOrEqual(32)
    expect(result).toBeLessThanOrEqual(33)
  })

  it('should handle very young ages', () => {
    const result = calculateAge('2023-06-15')
    expect(result).toBeGreaterThanOrEqual(1)
    expect(result).toBeLessThanOrEqual(2)
  })
})

describe('formatAge', () => {
  it('should format age with Korean suffix', () => {
    const age1990 = formatAge('1990-05-15')
    expect(age1990).toMatch(/^\d+세$/)

    const age2000 = formatAge('2000-01-01')
    expect(age2000).toMatch(/^\d+세$/)
  })

  it('should return fallback for null', () => {
    expect(formatAge(null)).toBe('-')
  })

  it('should return fallback for undefined', () => {
    expect(formatAge(undefined)).toBe('-')
  })

  it('should handle various birth dates', () => {
    expect(formatAge('1985-03-20')).toMatch(/^\d+세$/)
    expect(formatAge('1995-07-10')).toMatch(/^\d+세$/)
    expect(formatAge('2005-12-25')).toMatch(/^\d+세$/)
  })
})

describe('formatRating', () => {
  it('should format rating with star emoji', () => {
    expect(formatRating(4.5, 23)).toBe('⭐ 4.5 (23개)')
    expect(formatRating(3.8, 15)).toBe('⭐ 3.8 (15개)')
    expect(formatRating(5.0, 100)).toBe('⭐ 5.0 (100개)')
  })

  it('should handle zero rating', () => {
    expect(formatRating(0, 0)).toBe('⭐ 0.0 (0개)')
  })

  it('should format rating with one decimal place', () => {
    expect(formatRating(4.567, 50)).toBe('⭐ 4.6 (50개)')
    expect(formatRating(3.123, 10)).toBe('⭐ 3.1 (10개)')
  })

  it('should handle perfect rating', () => {
    expect(formatRating(5.0, 200)).toBe('⭐ 5.0 (200개)')
  })

  it('should handle single review', () => {
    expect(formatRating(4.0, 1)).toBe('⭐ 4.0 (1개)')
  })

  it('should handle large review counts', () => {
    expect(formatRating(4.9, 9999)).toBe('⭐ 4.9 (9999개)')
  })
})

describe('formatCommissionRate', () => {
  it('should format commission rate with percent sign', () => {
    expect(formatCommissionRate(15)).toBe('15%')
    expect(formatCommissionRate(20)).toBe('20%')
    expect(formatCommissionRate(25)).toBe('25%')
  })

  it('should handle zero commission', () => {
    expect(formatCommissionRate(0)).toBe('0%')
  })

  it('should handle decimal commission rates', () => {
    expect(formatCommissionRate(12.5)).toBe('12.5%')
    expect(formatCommissionRate(17.75)).toBe('17.75%')
  })

  it('should handle high commission rates', () => {
    expect(formatCommissionRate(50)).toBe('50%')
    expect(formatCommissionRate(100)).toBe('100%')
  })

  it('should handle single digit rates', () => {
    expect(formatCommissionRate(5)).toBe('5%')
    expect(formatCommissionRate(9)).toBe('9%')
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
    expect(formatPhoneNumber('010-1234-5678')).toBe('010-1234-5678')
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
    const withCountryCode = '+821012345678'
    const result = formatPhoneNumber(withCountryCode)
    expect(result).toBe('+821012345678')
  })

  it('should handle various area codes', () => {
    expect(formatPhoneNumber('0212345678')).toBe('021-234-5678')
    expect(formatPhoneNumber('0312345678')).toBe('031-234-5678')
    expect(formatPhoneNumber('0512345678')).toBe('051-234-5678')
  })
})
