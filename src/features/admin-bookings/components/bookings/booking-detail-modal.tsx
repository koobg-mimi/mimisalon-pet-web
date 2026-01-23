import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { BookingStatusBadge } from '../ui/booking-status-badge'
import { formatCurrency, formatDate, formatTime } from '../../utils/booking-formatters'
import type { TransformedBooking } from '../../types/booking.types'

export interface BookingDetailModalProps {
  /**
   * Booking data to display
   */
  booking: TransformedBooking | null
  /**
   * Whether the modal is open
   */
  open: boolean
  /**
   * Handler for closing the modal
   */
  onClose: () => void
}

/**
 * BookingDetailModal Component
 *
 * Displays comprehensive booking information in a modal dialog.
 * Shows customer info, groomer info, service details, payment info, and notes.
 * Uses ScrollArea for mobile responsiveness.
 *
 * @example
 * ```tsx
 * import { BookingDetailModal } from '@/features/admin-bookings/components/bookings/booking-detail-modal'
 *
 * <BookingDetailModal
 *   booking={selectedBooking}
 *   open={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 * />
 * ```
 */
export function BookingDetailModal({ booking, open, onClose }: BookingDetailModalProps) {
  if (!booking) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">예약 상세 정보</DialogTitle>
              <DialogDescription className="mt-1">
                예약번호: #{booking.bookingNumber.slice(-6)}
              </DialogDescription>
            </div>
            <BookingStatusBadge status={booking.status} variant="detailed" />
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 px-6 pb-6">
            {/* Customer Information */}
            <section>
              <h3 className="mb-3 text-lg font-semibold">고객 정보</h3>
              <div className="bg-muted/50 space-y-2 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <span className="text-muted-foreground text-sm">고객명</span>
                    <p className="font-medium">{booking.customer?.name || '이름 없음'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">전화번호</span>
                    <p className="font-medium">{booking.customer?.phoneNumber || '-'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground text-sm">이메일</span>
                    <p className="font-medium">{booking.customer?.email || '-'}</p>
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* Groomer Information */}
            <section>
              <h3 className="mb-3 text-lg font-semibold">미용사 정보</h3>
              <div className="bg-muted/50 space-y-2 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <span className="text-muted-foreground text-sm">미용사명</span>
                    <p className="font-medium">{booking.groomer?.name || '미지정'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">전화번호</span>
                    <p className="font-medium">{booking.groomer?.phoneNumber || '-'}</p>
                  </div>
                  {booking.groomer?.email && (
                    <div className="sm:col-span-2">
                      <span className="text-muted-foreground text-sm">이메일</span>
                      <p className="font-medium">{booking.groomer.email}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <Separator />

            {/* Service Details */}
            <section>
              <h3 className="mb-3 text-lg font-semibold">서비스 정보</h3>
              <div className="space-y-3">
                {booking.bookingPets.map((bookingPet, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-semibold">{bookingPet.pet.name}</h4>
                      <span className="text-muted-foreground text-sm">
                        {bookingPet.pet.breed?.name || '품종 미정'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {bookingPet.services.map((service, serviceIndex) => (
                        <div
                          key={serviceIndex}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{service.service?.name || '서비스명 없음'}</span>
                          <span className="font-medium">{formatCurrency(service.price || 0)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Booking Information */}
            <section>
              <h3 className="mb-3 text-lg font-semibold">예약 정보</h3>
              <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <span className="text-muted-foreground text-sm">예약일</span>
                    <p className="font-medium">{formatDate(booking.serviceDate)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">시작시간</span>
                    <p className="font-medium">{formatTime(booking.startTime)}</p>
                  </div>
                  {booking.endTime && (
                    <div>
                      <span className="text-muted-foreground text-sm">종료시간</span>
                      <p className="font-medium">{formatTime(booking.endTime)}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground text-sm">예약일시</span>
                    <p className="text-xs font-medium">
                      {formatDate(booking.createdAt)} {formatTime(booking.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* Payment Information */}
            <section>
              <h3 className="mb-3 text-lg font-semibold">결제 정보</h3>
              <div className="bg-muted/50 space-y-2 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">총 예약금액</span>
                  <span className="text-lg font-bold">{formatCurrency(booking.totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">결제액</span>
                  <span className="font-medium">
                    {booking.paidAmount > 0 ? formatCurrency(booking.paidAmount) : '-'}
                  </span>
                </div>
                {booking.additionalAmount && booking.additionalAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">추가액</span>
                    <span className="font-medium text-orange-600">
                      {formatCurrency(booking.additionalAmount)}
                    </span>
                  </div>
                )}
                {booking.payments && booking.payments.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">결제 방법</span>
                        <span>{booking.payments[0]?.method || '-'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">결제 상태</span>
                        <span>{booking.payments[0]?.status || '-'}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Address Information */}
            {booking.customerAddress && (
              <>
                <Separator />
                <section>
                  <h3 className="mb-3 text-lg font-semibold">방문 주소</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="mb-1 font-medium">
                      {[
                        booking.customerAddress.street,
                        booking.customerAddress.city,
                        booking.customerAddress.state,
                      ]
                        .filter(Boolean)
                        .join(' ') || '-'}
                    </p>
                    {booking.customerAddress.zipCode && (
                      <p className="text-muted-foreground mt-2 text-xs">
                        우편번호: {booking.customerAddress.zipCode}
                      </p>
                    )}
                  </div>
                </section>
              </>
            )}

            {/* Notes */}
            {booking.notes && (
              <>
                <Separator />
                <section>
                  <h3 className="mb-3 text-lg font-semibold">메모</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                      {booking.notes}
                    </p>
                  </div>
                </section>
              </>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end border-t px-6 py-4">
          <Button onClick={onClose} variant="outline">
            <X className="mr-2 h-4 w-4" />
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
