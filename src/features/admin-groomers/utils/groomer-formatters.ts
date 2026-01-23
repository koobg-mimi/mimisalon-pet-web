import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

/**
 * Format a number as Korean currency (KRW)
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "50,000원")
 * @example
 * formatCurrency(50000) // "50,000원"
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원'
}

/**
 * Format a date string to yyyy-MM-dd format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "2025-11-02")
 * @example
 * formatDate("2025-11-02T00:00:00.000Z") // "2025-11-02"
 */
export function formatDate(dateString: string): string {
  return format(new Date(dateString), 'yyyy-MM-dd', { locale: ko })
}

/**
 * Format a date-time string to yyyy-MM-dd HH:mm:ss format
 * @param dateString - ISO date string
 * @returns Formatted date-time string (e.g., "2025-11-02 14:30:45")
 * @example
 * formatDateTime("2025-11-02T14:30:45.000Z") // "2025-11-02 14:30:45"
 */
export function formatDateTime(dateString: string): string {
  return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss', { locale: ko })
}

/**
 * Format geographic coordinates
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Formatted coordinates string (e.g., "37.5665°N, 126.9780°E")
 * @example
 * formatCoordinates(37.5665, 126.978) // "37.5665°N, 126.9780°E"
 */
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`
}

/**
 * Calculate age from birth date
 * @param birthDate - Birth date string or null
 * @returns Age in years or null if no birth date provided
 * @example
 * calculateAge("1990-05-15") // 35 (as of 2025)
 * calculateAge(null) // null
 */
export function calculateAge(birthDate: string | null | undefined): number | null {
  if (!birthDate) return null

  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

/**
 * Format age for display
 * @param birthDate - Birth date string or null
 * @returns Formatted age string (e.g., "35세") or fallback
 * @example
 * formatAge("1990-05-15") // "35세"
 * formatAge(null) // "-"
 */
export function formatAge(birthDate: string | null | undefined): string {
  const age = calculateAge(birthDate)
  return age !== null ? `${age}세` : '-'
}

/**
 * Format rating for display
 * @param rating - Rating number
 * @param totalReviews - Total number of reviews
 * @returns Formatted rating string (e.g., "⭐ 4.5 (23개)")
 * @example
 * formatRating(4.5, 23) // "⭐ 4.5 (23개)"
 */
export function formatRating(rating: number, totalReviews: number): string {
  return `⭐ ${rating.toFixed(1)} (${totalReviews}개)`
}

/**
 * Format commission rate
 * @param commissionRate - Commission rate as decimal (e.g., 15 for 15%)
 * @returns Formatted commission rate string (e.g., "15%")
 * @example
 * formatCommissionRate(15) // "15%"
 */
export function formatCommissionRate(commissionRate: number): string {
  return `${commissionRate}%`
}

/**
 * Format a phone number to Korean format
 * @param phoneNumber - Phone number string
 * @returns Formatted phone number or fallback
 * @example
 * formatPhoneNumber("01012345678") // "010-1234-5678"
 */
export function formatPhoneNumber(phoneNumber: string | null | undefined): string {
  if (!phoneNumber) return '-'

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '')

  // Format as XXX-XXXX-XXXX or XXX-XXX-XXXX
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
  } else if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  // Return original if format doesn't match
  return phoneNumber
}
