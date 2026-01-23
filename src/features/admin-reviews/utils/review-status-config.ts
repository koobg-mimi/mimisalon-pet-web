import { Eye, EyeOff, Flag, CheckCircle, AlertCircle, type LucideIcon } from 'lucide-react'

/**
 * Review Status Configuration
 *
 * This module provides consistent status colors, icons, and labels
 * for review status badges and UI elements throughout the admin interface.
 */

/**
 * Review status types
 */
export type ReviewStatus = 'public' | 'private' | 'flagged'

/**
 * Status badge color variants for Tailwind classes
 */
export interface StatusColorConfig {
  bg: string
  text: string
  border: string
  darkBg: string
  darkText: string
}

/**
 * Get Tailwind color classes for a review status
 *
 * @param isPublic - Whether the review is public
 * @param isFlagged - Whether the review is flagged
 * @returns Object with Tailwind color classes for bg, text, border, and dark mode variants
 *
 * @example
 * const colors = getStatusColor(true, false) // Public review
 * // Returns: { bg: 'bg-green-100', text: 'text-green-800', ... }
 */
export function getStatusColor(isPublic: boolean, isFlagged: boolean): StatusColorConfig {
  if (isFlagged) {
    return {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
      darkBg: 'dark:bg-red-900',
      darkText: 'dark:text-red-200',
    }
  }

  if (isPublic) {
    return {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      darkBg: 'dark:bg-green-900',
      darkText: 'dark:text-green-200',
    }
  }

  // Private
  return {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
    darkBg: 'dark:bg-gray-800',
    darkText: 'dark:text-gray-200',
  }
}

/**
 * Get all color classes as a single string for easy className usage
 *
 * @param isPublic - Whether the review is public
 * @param isFlagged - Whether the review is flagged
 * @returns Combined color classes string
 *
 * @example
 * <Badge className={getStatusColorClasses(true, false)}>Public</Badge>
 */
export function getStatusColorClasses(isPublic: boolean, isFlagged: boolean): string {
  const colors = getStatusColor(isPublic, isFlagged)
  return `${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText}`
}

/**
 * Get Lucide icon component for a review status
 *
 * @param isPublic - Whether the review is public
 * @param isFlagged - Whether the review is flagged
 * @returns Lucide icon component
 *
 * @example
 * const Icon = getStatusIcon(true, false)
 * <Icon className="h-4 w-4" />
 */
export function getStatusIcon(isPublic: boolean, isFlagged: boolean): LucideIcon {
  if (isFlagged) return Flag
  if (isPublic) return Eye
  return EyeOff
}

/**
 * Get text label for a review status (Korean)
 *
 * @param isPublic - Whether the review is public
 * @param isFlagged - Whether the review is flagged
 * @returns Korean status label
 *
 * @example
 * getStatusLabel(true, false) // '공개'
 * getStatusLabel(false, false) // '비공개'
 * getStatusLabel(false, true) // '신고됨'
 */
export function getStatusLabel(isPublic: boolean, isFlagged: boolean): string {
  if (isFlagged) return '신고됨'
  if (isPublic) return '공개'
  return '비공개'
}

/**
 * Get English text label for a review status
 *
 * @param isPublic - Whether the review is public
 * @param isFlagged - Whether the review is flagged
 * @returns English status label
 *
 * @example
 * getStatusLabelEn(true, false) // 'Public'
 */
export function getStatusLabelEn(isPublic: boolean, isFlagged: boolean): string {
  if (isFlagged) return 'Flagged'
  if (isPublic) return 'Public'
  return 'Private'
}

/**
 * Get status type enum
 *
 * @param isPublic - Whether the review is public
 * @param isFlagged - Whether the review is flagged
 * @returns Status type string
 */
export function getStatusType(isPublic: boolean, isFlagged: boolean): ReviewStatus {
  if (isFlagged) return 'flagged'
  if (isPublic) return 'public'
  return 'private'
}

/**
 * Response Status Configuration
 */

/**
 * Get icon for review response status
 *
 * @param hasResponse - Whether the review has a response
 * @returns Lucide icon component
 */
export function getResponseStatusIcon(hasResponse: boolean): LucideIcon {
  return hasResponse ? CheckCircle : AlertCircle
}

/**
 * Get label for review response status
 *
 * @param hasResponse - Whether the review has a response
 * @returns Korean label
 */
export function getResponseStatusLabel(hasResponse: boolean): string {
  return hasResponse ? '답변 완료' : '답변 대기'
}

/**
 * Get color classes for review response status
 *
 * @param hasResponse - Whether the review has a response
 * @returns Tailwind color classes
 */
export function getResponseStatusColorClasses(hasResponse: boolean): string {
  return hasResponse
    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
}

/**
 * Rating Configuration
 */

/**
 * Get color classes for rating badges based on rating value
 *
 * @param rating - Rating value (1-5)
 * @returns Tailwind color classes
 *
 * @example
 * getRatingColorClasses(5) // 'bg-green-100 text-green-800...'
 * getRatingColorClasses(3) // 'bg-yellow-100 text-yellow-800...'
 * getRatingColorClasses(1) // 'bg-red-100 text-red-800...'
 */
export function getRatingColorClasses(rating: number): string {
  if (rating >= 4) {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  if (rating >= 3) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

/**
 * Get icon for rating value
 *
 * @param rating - Rating value (1-5)
 * @returns Lucide icon component
 */
export function getRatingIcon(rating: number): LucideIcon {
  if (rating >= 4) return CheckCircle
  if (rating >= 3) return AlertCircle
  return Flag
}

/**
 * Filter Status Configuration
 */

export type FilterStatus =
  | 'ALL'
  | 'PUBLIC'
  | 'PRIVATE'
  | 'FLAGGED'
  | 'WITH_RESPONSE'
  | 'NO_RESPONSE'

/**
 * Get display label for filter status (Korean)
 *
 * @param status - Filter status value
 * @returns Korean label
 */
export function getFilterStatusLabel(status: FilterStatus): string {
  const labels: Record<FilterStatus, string> = {
    ALL: '전체',
    PUBLIC: '공개',
    PRIVATE: '비공개',
    FLAGGED: '신고됨',
    WITH_RESPONSE: '답변 완료',
    NO_RESPONSE: '답변 대기',
  }
  return labels[status]
}

/**
 * Get all available filter status options
 *
 * @returns Array of filter status options with labels
 */
export function getFilterStatusOptions(): Array<{ value: FilterStatus; label: string }> {
  return [
    { value: 'ALL', label: getFilterStatusLabel('ALL') },
    { value: 'PUBLIC', label: getFilterStatusLabel('PUBLIC') },
    { value: 'PRIVATE', label: getFilterStatusLabel('PRIVATE') },
    { value: 'FLAGGED', label: getFilterStatusLabel('FLAGGED') },
    { value: 'WITH_RESPONSE', label: getFilterStatusLabel('WITH_RESPONSE') },
    { value: 'NO_RESPONSE', label: getFilterStatusLabel('NO_RESPONSE') },
  ]
}

/**
 * Sort Configuration
 */

export type SortField = 'date' | 'rating' | 'customer'
export type SortOrder = 'asc' | 'desc'

/**
 * Get display label for sort field (Korean)
 *
 * @param field - Sort field value
 * @returns Korean label
 */
export function getSortFieldLabel(field: SortField): string {
  const labels: Record<SortField, string> = {
    date: '날짜',
    rating: '평점',
    customer: '고객명',
  }
  return labels[field]
}

/**
 * Get display label for sort order (Korean)
 *
 * @param order - Sort order value
 * @returns Korean label
 */
export function getSortOrderLabel(order: SortOrder): string {
  return order === 'asc' ? '오름차순' : '내림차순'
}

/**
 * Get all available sort field options
 *
 * @returns Array of sort field options with labels
 */
export function getSortFieldOptions(): Array<{ value: SortField; label: string }> {
  return [
    { value: 'date', label: getSortFieldLabel('date') },
    { value: 'rating', label: getSortFieldLabel('rating') },
    { value: 'customer', label: getSortFieldLabel('customer') },
  ]
}

/**
 * Action Configuration
 */

export type ReviewAction = 'approve' | 'flag' | 'hide' | 'delete' | 'respond'

/**
 * Get display label for review action (Korean)
 *
 * @param action - Review action type
 * @returns Korean label
 */
export function getActionLabel(action: ReviewAction): string {
  const labels: Record<ReviewAction, string> = {
    approve: '승인',
    flag: '신고',
    hide: '숨기기',
    delete: '삭제',
    respond: '답변',
  }
  return labels[action]
}

/**
 * Get icon for review action
 *
 * @param action - Review action type
 * @returns Lucide icon component
 */
export function getActionIcon(action: ReviewAction): LucideIcon {
  const icons: Record<ReviewAction, LucideIcon> = {
    approve: CheckCircle,
    flag: Flag,
    hide: EyeOff,
    delete: AlertCircle,
    respond: CheckCircle,
  }
  return icons[action]
}
