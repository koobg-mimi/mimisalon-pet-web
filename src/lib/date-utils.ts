/**
 * Date utility functions for handling Korean timezone and formatting
 * Uses date-fns for proper date manipulation
 */

import { ko } from 'date-fns/locale'
import { format } from 'date-fns'

/**
 * Get local date string in YYYY-MM-DD format
 * Avoids timezone conversion issues when storing dates
 * Uses date-fns format instead of toISOString() to prevent timezone issues
 */
export function getLocalDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd', { locale: ko })
}

/**
 * Format time from 24-hour string to 12-hour display format for Korean locale
 */
export function formatTimeDisplay(timeString: string | null | undefined): string {
  // Handle null, undefined or invalid time strings
  if (!timeString || typeof timeString !== 'string') {
    return '시간 미정'
  }

  // Split and validate the time format
  const timeParts = timeString.split(':')
  if (timeParts.length !== 2) {
    return '시간 미정'
  }

  const hours = Number(timeParts[0])
  const minutes = Number(timeParts[1])

  // Validate hours and minutes are valid numbers
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return '시간 미정'
  }

  const period = hours >= 12 ? '오후' : '오전'
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${period} ${displayHours}:${minutes.toString().padStart(2, '0')}`
}
