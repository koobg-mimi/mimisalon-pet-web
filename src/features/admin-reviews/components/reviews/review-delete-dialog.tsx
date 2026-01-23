import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AlertTriangle } from 'lucide-react'
import type { AdminReviewInfo } from '../../types/review.types'

export interface ReviewDeleteDialogProps {
  /**
   * Review data to delete
   */
  review: AdminReviewInfo | null
  /**
   * Whether the dialog is open
   */
  open: boolean
  /**
   * Handler for dialog state changes
   */
  onOpenChange: (open: boolean) => void
  /**
   * Handler for confirming deletion
   * Called with the review ID
   */
  onConfirm: (reviewId: string) => void | Promise<void>
  /**
   * Whether the deletion is in progress
   */
  isDeleting?: boolean
}

/**
 * ReviewDeleteDialog Component
 *
 * Confirmation dialog for deleting reviews.
 * Shows review context (customer, date, rating) to help verify the deletion.
 * Uses destructive action styling to indicate the permanent nature of the action.
 *
 * @example
 * ```tsx
 * import { ReviewDeleteDialog } from '@/features/admin-reviews/components/reviews/review-delete-dialog'
 *
 * <ReviewDeleteDialog
 *   review={selectedReview}
 *   open={isDeleteDialogOpen}
 *   onOpenChange={setIsDeleteDialogOpen}
 *   onConfirm={handleDeleteConfirm}
 *   isDeleting={isDeleting}
 * />
 * ```
 */
export function ReviewDeleteDialog({
  review,
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: ReviewDeleteDialogProps) {
  const handleConfirm = async () => {
    if (!review) return

    try {
      await onConfirm(review.id)
      onOpenChange(false)
    } catch (error) {
      // Error handling is done by the parent component
      console.error('Failed to delete review:', error)
    }
  }

  if (!review) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDialogTitle>리뷰 삭제</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-2">
            <p>정말로 이 리뷰를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>

            {/* Review Context for Verification */}
            <div className="bg-muted/50 rounded-lg p-3 text-left">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">고객:</span>
                  <span className="text-foreground font-medium">{review.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">작성일:</span>
                  <span className="text-foreground font-medium">
                    {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">평점:</span>
                  <span className="text-foreground font-medium">⭐ {review.rating}</span>
                </div>
                {review.comment && (
                  <div className="border-border mt-2 border-t pt-2">
                    <p className="text-muted-foreground line-clamp-2 text-xs">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              ⚠️ 삭제된 리뷰는 복구할 수 없습니다.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
                삭제 중...
              </>
            ) : (
              '삭제'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
