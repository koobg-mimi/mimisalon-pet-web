import { Eye, EyeOff, Flag, MessageSquare, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ReviewStatusBadge } from '../ui/review-status-badge'
import { ReviewRatingStars } from '../ui/review-rating-stars'
import type { AdminReviewInfo } from '../../types/review.types'
import Image from 'next/image'

export interface ReviewDetailModalProps {
  /**
   * Review data to display
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
   * Handler for approving the review
   */
  onApprove?: (reviewId: string) => void
  /**
   * Handler for flagging the review
   */
  onFlag?: (reviewId: string) => void
  /**
   * Handler for hiding the review
   */
  onHide?: (reviewId: string) => void
  /**
   * Handler for responding to the review
   */
  onRespond?: (reviewId: string) => void
  /**
   * Handler for deleting the review
   */
  onDelete?: (reviewId: string) => void
}

/**
 * ReviewDetailModal Component
 *
 * Displays comprehensive review information in a modal dialog.
 * Shows customer info, rating, comment, images, booking details,
 * and existing response if available.
 * Provides action buttons for approve, flag, hide, respond, and delete.
 *
 * @example
 * ```tsx
 * import { ReviewDetailModal } from '@/features/admin-reviews/components/reviews/review-detail-modal'
 *
 * <ReviewDetailModal
 *   review={selectedReview}
 *   open={isModalOpen}
 *   onOpenChange={setIsModalOpen}
 *   onApprove={handleApprove}
 *   onFlag={handleFlag}
 *   onHide={handleHide}
 *   onRespond={handleRespond}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export function ReviewDetailModal({
  review,
  open,
  onOpenChange,
  onApprove,
  onFlag,
  onHide,
  onRespond,
  onDelete,
}: ReviewDetailModalProps) {
  if (!review) return null

  const handleClose = () => onOpenChange(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={review.customer.image || undefined} alt={review.customer.name} />
                <AvatarFallback className="text-2xl">
                  {review.customer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{review.customer.name}</DialogTitle>
                <DialogDescription className="mt-1">{review.customer.email}</DialogDescription>
              </div>
            </div>
            <ReviewStatusBadge
              isPublic={review.isPublic}
              isFlagged={review.isFlagged}
              variant="detailed"
            />
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <div className="space-y-6 px-6 pb-6">
            {/* Rating and Comment */}
            <section>
              <h3 className="mb-3 text-lg font-semibold">리뷰 내용</h3>
              <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                <div>
                  <span className="text-muted-foreground text-sm">평점</span>
                  <div className="mt-1">
                    <ReviewRatingStars rating={review.rating} size="lg" showNumeric />
                  </div>
                </div>
                {review.comment && (
                  <div>
                    <span className="text-muted-foreground text-sm">리뷰 내용</span>
                    <p className="mt-1 text-sm whitespace-pre-wrap">{review.comment}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <span className="text-muted-foreground text-sm">작성일</span>
                    <p className="font-medium">
                      {new Date(review.createdAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">수정일</span>
                    <p className="font-medium">
                      {new Date(review.updatedAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <>
                <Separator />
                <section>
                  <h3 className="mb-3 text-lg font-semibold">리뷰 사진</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {review.images.map((image) => (
                      <div
                        key={image.id}
                        className="border-border relative aspect-square overflow-hidden rounded-lg border"
                      >
                        <Image
                          src={image.url}
                          alt={`Review image ${image.order}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Booking Information */}
            <Separator />
            <section>
              <h3 className="mb-3 text-lg font-semibold">예약 정보</h3>
              <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <span className="text-muted-foreground text-sm">예약일</span>
                    <p className="font-medium">{review.booking.date}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">서비스</span>
                    <p className="font-medium">{review.booking.service.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">미용사</span>
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={review.booking.groomer.image || undefined}
                          alt={review.booking.groomer.name}
                        />
                        <AvatarFallback className="text-xs">
                          {review.booking.groomer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{review.booking.groomer.name}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">지점</span>
                    <p className="font-medium">{review.booking.location.name}</p>
                  </div>
                </div>
                {review.booking.pets && review.booking.pets.length > 0 && (
                  <div>
                    <span className="text-muted-foreground text-sm">반려동물</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {review.booking.pets.map((pet) => (
                        <span
                          key={pet.id}
                          className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                        >
                          {pet.name} ({pet.breed?.name || '알 수 없음'})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Response */}
            {review.response && (
              <>
                <Separator />
                <section>
                  <h3 className="mb-3 text-lg font-semibold">미용사 답변</h3>
                  <div className="bg-muted/50 space-y-2 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">답변자:</span>
                      <span className="font-medium">{review.response.groomer.name}</span>
                      <span className="text-muted-foreground text-xs">
                        • {new Date(review.response.createdAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{review.response.content}</p>
                  </div>
                </section>
              </>
            )}

            {/* Flag Information */}
            {review.isFlagged && review.flagReason && (
              <>
                <Separator />
                <section>
                  <h3 className="mb-3 text-lg font-semibold text-red-600">신고 정보</h3>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
                    <p className="text-sm text-red-800 dark:text-red-200">{review.flagReason}</p>
                  </div>
                </section>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Actions Footer */}
        <DialogFooter className="px-6 pb-6">
          <div className="flex w-full flex-wrap gap-2">
            {review.isPublic ? (
              <Button
                onClick={() => onHide?.(review.id)}
                variant="outline"
                size="sm"
                className="text-orange-600"
              >
                <EyeOff className="mr-2 h-4 w-4" />
                숨기기
              </Button>
            ) : (
              <Button
                onClick={() => onApprove?.(review.id)}
                variant="outline"
                size="sm"
                className="text-green-600"
              >
                <Eye className="mr-2 h-4 w-4" />
                공개
              </Button>
            )}
            {!review.isFlagged && (
              <Button
                onClick={() => onFlag?.(review.id)}
                variant="outline"
                size="sm"
                className="text-red-600"
              >
                <Flag className="mr-2 h-4 w-4" />
                신고
              </Button>
            )}
            {!review.response && (
              <Button onClick={() => onRespond?.(review.id)} variant="outline" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                답변 작성
              </Button>
            )}
            <Button
              onClick={() => onDelete?.(review.id)}
              variant="outline"
              size="sm"
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </Button>
            <Button onClick={handleClose} variant="default" size="sm" className="ml-auto">
              닫기
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
