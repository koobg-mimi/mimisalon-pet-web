import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

/**
 * Format a number as Korean currency (KRW)
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "₩50,000")
 * @example
 * formatCurrency(50000) // "₩50,000"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

/**
 * Format a date string to Korean format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "2025년 11월 02일")
 * @example
 * formatDate("2025-11-02") // "2025년 11월 02일"
 */
export function formatDate(dateString: string): string {
  return format(new Date(dateString), 'yyyy년 MM월 dd일', { locale: ko })
}

/**
 * Format a time string to HH:mm format
 * @param timeString - Time string (e.g., "14:30:00")
 * @returns Formatted time string (e.g., "14:30") or fallback message
 * @example
 * formatTime("14:30:00") // "14:30"
 * formatTime(null) // "시간 미정"
 */
export function formatTime(timeString: string | null | undefined): string {
  if (!timeString) return '시간 미정'
  return timeString.slice(0, 5)
}

/**
 * Format a booking number by extracting the last 6 digits
 * @param bookingNumber - Full booking number
 * @returns Shortened booking number with # prefix (e.g., "#123456")
 * @example
 * formatBookingNumber("BK-2025-000123456") // "#123456"
 */
export function formatBookingNumber(bookingNumber: string): string {
  return `#${bookingNumber.slice(-6)}`
}

/**
 * Format a date and time together
 * @param dateString - ISO date string
 * @param timeString - Time string or null
 * @returns Combined formatted date and time
 * @example
 * formatDateTime("2025-11-02", "14:30:00") // "2025년 11월 02일 14:30"
 */
export function formatDateTime(dateString: string, timeString: string | null | undefined): string {
  const formattedDate = formatDate(dateString)
  const formattedTime = formatTime(timeString)
  return `${formattedDate} ${formattedTime}`
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
