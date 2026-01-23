'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

// Feature imports
import { ReviewStatsCards } from '@/features/admin-reviews/components/reviews/review-stats-cards'
import { ReviewFilters } from '@/features/admin-reviews/components/reviews/review-filters'
import { ReviewsList } from '@/features/admin-reviews/components/reviews/reviews-list'
import { ReviewDetailModal } from '@/features/admin-reviews/components/reviews/review-detail-modal'
import { ReviewFlagModal } from '@/features/admin-reviews/components/reviews/review-flag-modal'
import { ReviewDeleteDialog } from '@/features/admin-reviews/components/reviews/review-delete-dialog'

// Hooks and types
import { useAdminReviews } from '@/features/admin-reviews/hooks/use-admin-reviews'
import {
  useApproveReviewMutation,
  useFlagReviewMutation,
  useDeleteReviewMutation,
  useHideReviewMutation,
} from '@/features/admin-reviews/state/admin-reviews-api-slice'
import type {
  ReviewFilters as ReviewFiltersType,
  AdminReviewInfo,
} from '@/features/admin-reviews/types/review.types'

/**
 * Admin Reviews Management Page
 *
 * Refactored to use feature-based architecture with RTK Query for state management.
 * This is a thin wrapper that composes feature components.
 *
 * Key features:
 * - Review statistics dashboard
 * - Advanced filtering and search
 * - Review list with pagination
 * - Detail view, flag, and delete modals
 * - RTK Query for data fetching and mutations
 *
 * @see PLAN.md for architecture details
 */
export default function AdminReviewsPage() {
  // Authentication
  const { data: session, isPending } = useSession()
  const router = useRouter()

  // Local UI state - filters
  const [filters, setFilters] = useState<ReviewFiltersType>({
    searchQuery: '',
    ratingFilter: null,
    statusFilter: 'ALL',
    serviceFilter: 'ALL',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  const [page, setPage] = useState(1)

  // Local UI state - modals
  const [selectedReview, setSelectedReview] = useState<AdminReviewInfo | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showFlagModal, setShowFlagModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // RTK Query hooks
  const { reviews, pagination, stats, isLoading, isFetching } = useAdminReviews({
    filters,
    page,
    limit: 20,
    enabled: !!session?.user && session.user.role === 'ADMIN',
  })

  // RTK Query mutations
  const [approveReview] = useApproveReviewMutation()
  const [flagReview, { isLoading: isFlagging }] = useFlagReviewMutation()
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation()
  const [hideReview] = useHideReviewMutation()

  // Authentication redirect
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/auth/signin')
    }
    if (!isPending && session?.user?.role && session.user.role !== 'ADMIN') {
      router.push('/admin/dashboard/overview')
    }
  }, [session, isPending, router])

  // Event handlers
  const handleViewDetails = useCallback((review: AdminReviewInfo) => {
    setSelectedReview(review)
    setShowDetailModal(true)
  }, [])

  const handleApprove = useCallback(
    async (reviewId: string) => {
      try {
        await approveReview(reviewId).unwrap()
        setShowDetailModal(false)
      } catch (error) {
        console.error('Failed to approve review:', error)
        alert('리뷰 승인에 실패했습니다.')
      }
    },
    [approveReview]
  )

  const handleFlag = useCallback(
    async (data: { reviewId: string; reason: string }) => {
      try {
        await flagReview(data).unwrap()
        setShowFlagModal(false)
        setShowDetailModal(false)
      } catch (error) {
        console.error('Failed to flag review:', error)
        alert('리뷰 신고에 실패했습니다.')
      }
    },
    [flagReview]
  )

  const handleHide = useCallback(
    async (reviewId: string) => {
      try {
        await hideReview(reviewId).unwrap()
        setShowDetailModal(false)
      } catch (error) {
        console.error('Failed to hide review:', error)
        alert('리뷰 상태 변경에 실패했습니다.')
      }
    },
    [hideReview]
  )

  const handleDelete = useCallback(
    async (reviewId: string) => {
      try {
        await deleteReview(reviewId).unwrap()
        setShowDeleteDialog(false)
        setShowDetailModal(false)
        setSelectedReview(null)
      } catch (error) {
        console.error('Failed to delete review:', error)
        alert('리뷰 삭제에 실패했습니다.')
      }
    },
    [deleteReview]
  )

  const handleFiltersChange = useCallback((newFilters: Partial<ReviewFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPage(1) // Reset to first page on filter change
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  // Loading state
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  // Auth check
  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">리뷰 관리</h1>
        <p className="text-muted-foreground">전체 리뷰를 관리하고 모니터링합니다</p>
      </div>

      {/* Statistics Dashboard */}
      <ReviewStatsCards stats={stats ?? null} />

      {/* Filters */}
      <ReviewFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalCount={pagination.totalCount}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
      />

      {/* Reviews List */}
      <ReviewsList
        reviews={reviews}
        isLoading={isLoading || isFetching}
        onViewDetails={handleViewDetails}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />

      {/* Modals */}
      {selectedReview && (
        <>
          <ReviewDetailModal
            review={selectedReview}
            open={showDetailModal}
            onOpenChange={setShowDetailModal}
            onApprove={handleApprove}
            onFlag={() => setShowFlagModal(true)}
            onHide={handleHide}
            onDelete={() => setShowDeleteDialog(true)}
          />

          <ReviewFlagModal
            review={selectedReview}
            open={showFlagModal}
            onOpenChange={setShowFlagModal}
            onSubmit={handleFlag}
            isSubmitting={isFlagging}
          />

          <ReviewDeleteDialog
            review={selectedReview}
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
          />
        </>
      )}
    </div>
  )
}
