'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Flag } from 'lucide-react'
import type { AdminReviewInfo } from '../../types/review.types'

// Validation schema
const flagReviewSchema = z.object({
  reason: z
    .string()
    .min(10, { message: '신고 사유는 최소 10자 이상 입력해주세요.' })
    .max(500, { message: '신고 사유는 최대 500자까지 입력 가능합니다.' }),
})

type FlagReviewFormData = z.infer<typeof flagReviewSchema>

export interface ReviewFlagModalProps {
  /**
   * Review data to flag
   */
  review: AdminReviewInfo | null
  /**
   * Whether the modal is open
   */
  open: boolean
  /**
   * Handler for modal state changes
   */
  onOpenChange: (open: boolean) => void
  /**
   * Handler for form submission
   * Called with review ID and flag reason
   */
  onSubmit: (data: { reviewId: string; reason: string }) => void | Promise<void>
  /**
   * Whether the form is submitting
   */
  isSubmitting?: boolean
}

/**
 * ReviewFlagModal Component
 *
 * Modal for flagging inappropriate reviews.
 * Includes a form with validation for entering the flag reason.
 * Requires a minimum of 10 characters for the reason.
 *
 * @example
 * ```tsx
 * import { ReviewFlagModal } from '@/features/admin-reviews/components/reviews/review-flag-modal'
 *
 * <ReviewFlagModal
 *   review={selectedReview}
 *   open={isFlagModalOpen}
 *   onOpenChange={setIsFlagModalOpen}
 *   onSubmit={handleFlagSubmit}
 *   isSubmitting={isFlagging}
 * />
 * ```
 */
export function ReviewFlagModal({
  review,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: ReviewFlagModalProps) {
  const form = useForm<FlagReviewFormData>({
    resolver: zodResolver(flagReviewSchema),
    defaultValues: {
      reason: '',
    },
  })

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  const handleFormSubmit = async (data: FlagReviewFormData) => {
    if (!review) return

    try {
      await onSubmit({
        reviewId: review.id,
        reason: data.reason,
      })
      handleClose()
    } catch (error) {
      // Error handling is done by the parent component
      console.error('Failed to flag review:', error)
    }
  }

  if (!review) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-600" />
            <DialogTitle>리뷰 신고</DialogTitle>
          </div>
          <DialogDescription>
            부적절한 리뷰를 신고합니다. 신고 사유를 상세히 입력해주세요.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Review Context */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">고객:</span>{' '}
                  <span className="font-medium">{review.customer.name}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">평점:</span>{' '}
                  <span className="font-medium">⭐ {review.rating}</span>
                </p>
                {review.comment && (
                  <p className="text-muted-foreground line-clamp-2">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Flag Reason Input */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>신고 사유 *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="신고 사유를 입력해주세요 (최소 10자)"
                      className="min-h-[120px] resize-none"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between">
                    <FormMessage />
                    <span className="text-muted-foreground text-xs">
                      {field.value?.length || 0} / 500
                    </span>
                  </div>
                </FormItem>
              )}
            />

            {/* Actions */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                취소
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
                    신고 중...
                  </>
                ) : (
                  <>
                    <Flag className="mr-2 h-4 w-4" />
                    신고하기
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
