/**
 * Admin Reviews Type Definitions
 *
 * Re-exports API types from the API route (single source of truth)
 * and defines feature-specific types for the admin reviews feature.
 */

// Re-export API types (single source of truth)
export type { AdminReviewInfo, AdminReviewsGetResponse } from '@/app/api/admin/reviews/route'

// Re-export nested types that are part of AdminReviewInfo
import type { AdminReviewInfo, AdminReviewsGetResponse } from '@/app/api/admin/reviews/route'

export type CustomerInfo = AdminReviewInfo['customer']
export type BookingInfo = AdminReviewInfo['booking']
export type ReviewImageInfo = AdminReviewInfo['images'][number]
export type ReviewResponseInfo = NonNullable<AdminReviewInfo['response']>
export type ReviewStats = AdminReviewsGetResponse['stats']

// Feature-specific types
export type ReviewFilterStatus =
  | 'ALL'
  | 'PUBLIC'
  | 'PRIVATE'
  | 'FLAGGED'
  | 'WITH_RESPONSE'
  | 'NO_RESPONSE'

export interface ReviewFilters {
  searchQuery: string
  ratingFilter: number | null
  statusFilter: ReviewFilterStatus
  serviceFilter: string
  sortBy: 'createdAt' | 'rating' | 'customerName'
  sortOrder: 'asc' | 'desc'
}

export interface ReviewListItem extends AdminReviewInfo {
  // Additional computed properties if needed
  customerName: string
  serviceName: string
}

// Mutation response types
export interface ReviewMutationResponse {
  success: boolean
  message: string
}

export interface FlagReviewRequest {
  reviewId: string
  reason: string
}

export interface RespondToReviewRequest {
  reviewId: string
  response: string
}

export interface HideReviewRequest {
  reviewId: string
}

export interface ApproveReviewRequest {
  reviewId: string
}
