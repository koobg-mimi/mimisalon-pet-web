import { AlertTriangle } from 'lucide-react'
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
import { formatDate, formatTime } from '../../utils/booking-formatters'
import type { TransformedBooking } from '../../types/booking.types'

export interface BookingDeleteDialogProps {
  /**
   * Booking to delete
   */
  booking: TransformedBooking | null
  /**
   * Whether the dialog is open
   */
  open: boolean
  /**
   * Whether the deletion is in progress
   */
  isDeleting: boolean
  /**
   * Handler for confirming deletion
   */
  onConfirm: () => void
  /**
   * Handler for cancelling deletion
   */
  onCancel: () => void
}

/**
 * BookingDeleteDialog Component
 *
 * Displays a confirmation dialog before deleting a booking.
 * Shows booking details to ensure the user is deleting the correct booking.
 * Handles loading state during deletion.
 *
 * @example
 * ```tsx
 * import { BookingDeleteDialog } from '@/features/admin-bookings/components/bookings/booking-delete-dialog'
 *
 * <BookingDeleteDialog
 *   booking={bookingToDelete}
 *   open={isDeleteDialogOpen}
 *   isDeleting={deleteMutation.isPending}
 *   onConfirm={handleConfirmDelete}
 *   onCancel={() => setIsDeleteDialogOpen(false)}
 * />
 * ```
 */
export function BookingDeleteDialog({
  booking,
  open,
  isDeleting,
  onConfirm,
  onCancel,
}: BookingDeleteDialogProps) {
  if (!booking) return null

  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-destructive h-5 w-5" />
            예약 삭제 확인
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>정말로 이 예약을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>

            <div className="bg-muted text-foreground space-y-2 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">예약번호</span>
                <span className="text-sm">#{booking.bookingNumber.slice(-6)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">고객명</span>
                <span className="text-sm">{booking.customer?.name || '이름 없음'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">예약일시</span>
                <span className="text-sm">
                  {formatDate(booking.serviceDate)} {formatTime(booking.startTime)}
                </span>
              </div>
              {booking.bookingPets.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">반려동물</span>
                  <span className="text-sm">
                    {booking.bookingPets.map((bp) => bp.pet.name).join(', ')}
                  </span>
                </div>
              )}
            </div>

            <p className="text-destructive font-medium">
              ⚠️ 이 예약과 관련된 모든 데이터가 영구적으로 삭제됩니다.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isDeleting}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
