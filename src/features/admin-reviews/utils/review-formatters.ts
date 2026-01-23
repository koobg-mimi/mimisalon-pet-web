import { format, formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { AdminReviewInfo } from '@/features/admin-reviews/types/review.types'

/**
 * Date Formatting Utilities
 */

/**
 * Format a review date string to a localized date format
 *
 * @param dateString - ISO date string from the API
 * @param formatStr - date-fns format string (default: 'PPP' for localized long date)
 * @returns Formatted date string in Korean locale
 *
 * @example
 * formatReviewDate('2025-11-03T10:30:00.000Z') // '2025년 11월 3일'
 * formatReviewDate('2025-11-03T10:30:00.000Z', 'yyyy-MM-dd') // '2025-11-03'
 */
export function formatReviewDate(dateString: string, formatStr = 'PPP'): string {
  try {
    const date = new Date(dateString)
    return format(date, formatStr, { locale: ko })
  } catch (error) {
    console.error('Invalid date string:', dateString, error)
    return dateString
  }
}

/**
 * Format a date string to show relative time (e.g., "2 hours ago", "3 days ago")
 *
 * @param dateString - ISO date string from the API
 * @returns Relative time string in Korean locale
 *
 * @example
 * formatRelativeDate('2025-11-03T10:30:00.000Z') // '2시간 전'
 * formatRelativeDate('2025-11-01T10:30:00.000Z') // '2일 전'
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { locale: ko, addSuffix: true })
  } catch (error) {
    console.error('Invalid date string:', dateString, error)
    return dateString
  }
}

/**
 * Format date and time together
 *
 * @param dateString - ISO date string from the API
 * @returns Formatted date and time string
 *
 * @example
 * formatDateTime('2025-11-03T10:30:00.000Z') // '2025년 11월 3일 오전 10:30'
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    return format(date, 'PPP p', { locale: ko })
  } catch (error) {
    console.error('Invalid date string:', dateString, error)
    return dateString
  }
}

/**
 * Rating Display Utilities
 */

/**
 * Format a numeric rating for display
 *
 * @param rating - Rating value (1-5)
 * @param includeOutOf - Whether to include "/5" suffix
 * @returns Formatted rating string
 *
 * @example
 * formatRating(4.5) // '4.5'
 * formatRating(4.5, true) // '4.5/5'
 * formatRating(4) // '4.0'
 */
export function formatRating(rating: number, includeOutOf = false): string {
  const formatted = rating.toFixed(1)
  return includeOutOf ? `${formatted}/5` : formatted
}

/**
 * Get a text label for a rating value
 *
 * @param rating - Rating value (1-5)
 * @returns Korean label for the rating
 *
 * @example
 * getRatingLabel(5) // '최고예요'
 * getRatingLabel(4) // '좋아요'
 * getRatingLabel(3) // '보통이에요'
 */
export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return '최고예요'
  if (rating >= 3.5) return '좋아요'
  if (rating >= 2.5) return '보통이에요'
  if (rating >= 1.5) return '별로예요'
  return '최악이에요'
}

/**
 * Get emoji representation of rating
 *
 * @param rating - Rating value (1-5)
 * @returns Emoji string
 *
 * @example
 * getRatingEmoji(5) // '⭐⭐⭐⭐⭐'
 * getRatingEmoji(3) // '⭐⭐⭐'
 */
export function getRatingEmoji(rating: number): string {
  const fullStars = Math.floor(rating)
  return '⭐'.repeat(fullStars)
}

/**
 * Customer & User Formatting Utilities
 */

/**
 * Format customer name with fallback
 *
 * @param name - Customer name from review
 * @param fallback - Fallback text if name is missing (default: '익명')
 * @returns Formatted name
 *
 * @example
 * formatCustomerName('김철수') // '김철수'
 * formatCustomerName('', '알 수 없음') // '알 수 없음'
 */
export function formatCustomerName(name: string | null | undefined, fallback = '익명'): string {
  if (!name || name.trim() === '') {
    return fallback
  }
  return name.trim()
}

/**
 * Format customer name with masking for privacy (show first character only)
 *
 * @param name - Customer name
 * @returns Masked name (e.g., '김**')
 *
 * @example
 * formatMaskedCustomerName('김철수') // '김**'
 * formatMaskedCustomerName('John Smith') // 'J****'
 */
export function formatMaskedCustomerName(name: string | null | undefined): string {
  const formatted = formatCustomerName(name)
  if (formatted === '익명') return formatted

  const firstChar = formatted.charAt(0)
  const length = formatted.length
  return `${firstChar}${'*'.repeat(Math.min(length - 1, 4))}`
}

/**
 * Service & Booking Formatting Utilities
 */

/**
 * Extract service name from review's booking data
 *
 * @param review - Admin review info object
 * @returns Primary service name or fallback
 *
 * @example
 * getServiceName(review) // '전체 미용'
 */
export function getServiceName(review: AdminReviewInfo): string {
  if (review.booking.services && review.booking.services.length > 0) {
    return review.booking.services[0].name
  }
  if (review.booking.service) {
    return review.booking.service.name
  }
  return '서비스 정보 없음'
}

/**
 * Get all service names from review
 *
 * @param review - Admin review info object
 * @returns Array of service names
 *
 * @example
 * getAllServiceNames(review) // ['전체 미용', '목욕', '발톱 관리']
 */
export function getAllServiceNames(review: AdminReviewInfo): string[] {
  if (review.booking.services && review.booking.services.length > 0) {
    return review.booking.services.map((s) => s.name)
  }
  if (review.booking.service) {
    return [review.booking.service.name]
  }
  return []
}

/**
 * Format multiple services as comma-separated string
 *
 * @param review - Admin review info object
 * @param maxServices - Maximum number of services to show before truncating
 * @returns Formatted services string
 *
 * @example
 * formatServicesString(review) // '전체 미용, 목욕, 발톱 관리'
 * formatServicesString(review, 2) // '전체 미용, 목욕 외 1개'
 */
export function formatServicesString(review: AdminReviewInfo, maxServices = 3): string {
  const services = getAllServiceNames(review)

  if (services.length === 0) {
    return '서비스 정보 없음'
  }

  if (services.length <= maxServices) {
    return services.join(', ')
  }

  const visible = services.slice(0, maxServices)
  const remaining = services.length - maxServices
  return `${visible.join(', ')} 외 ${remaining}개`
}

/**
 * Get pet names from review
 *
 * @param review - Admin review info object
 * @returns Array of pet names
 *
 * @example
 * getPetNames(review) // ['뽀미', '초코']
 */
export function getPetNames(review: AdminReviewInfo): string[] {
  if (review.booking.pets && review.booking.pets.length > 0) {
    return review.booking.pets.map((p) => p.name)
  }
  return []
}

/**
 * Format pet names as comma-separated string
 *
 * @param review - Admin review info object
 * @returns Formatted pet names string
 *
 * @example
 * formatPetNamesString(review) // '뽀미, 초코'
 */
export function formatPetNamesString(review: AdminReviewInfo): string {
  const pets = getPetNames(review)
  return pets.length > 0 ? pets.join(', ') : '반려동물 정보 없음'
}

/**
 * Text Formatting Utilities
 */

/**
 * Truncate long text with ellipsis
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 *
 * @example
 * truncateText('아주 긴 리뷰 내용입니다...', 10) // '아주 긴 리뷰 내...'
 */
export function truncateText(text: string | null | undefined, maxLength = 100): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

/**
 * Count words in text (Korean-aware)
 *
 * @param text - Text to count
 * @returns Number of words/characters
 */
export function getTextLength(text: string | null | undefined): number {
  if (!text) return 0
  // For Korean text, count characters; for English, count words
  const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text)
  if (hasKorean) {
    return text.length
  }
  return text.split(/\s+/).filter((word) => word.length > 0).length
}

/**
 * Miscellaneous Utilities
 */

/**
 * Format groomer name from review
 *
 * @param review - Admin review info object
 * @returns Groomer name
 */
export function getGroomerName(review: AdminReviewInfo): string {
  return review.booking.groomer.name || '담당자 정보 없음'
}

/**
 * Format booking date from review
 *
 * @param review - Admin review info object
 * @returns Formatted booking date
 */
export function getBookingDate(review: AdminReviewInfo): string {
  return formatReviewDate(review.booking.date)
}
