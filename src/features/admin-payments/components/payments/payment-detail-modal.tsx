'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PaymentStatusBadge } from '../ui/payment-status-badge'
import { PaymentMethodIcon } from '../ui/payment-method-icon'
import { formatCurrency, formatDate, getPaymentMethodName } from '../../utils'
import type { AdminPaymentInfo } from '../../types/payment.types'

/**
 * Props for PaymentDetailModal component
 */
interface PaymentDetailModalProps {
  /** Payment data to display */
  payment: AdminPaymentInfo | null
  /** Whether the modal is open */
  open: boolean
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void
}

/**
 * Modal displaying detailed payment information
 *
 * Shows comprehensive payment details including booking information,
 * customer details, transaction timeline, and payment metadata.
 *
 * @example
 * ```tsx
 * <PaymentDetailModal
 *   payment={selectedPayment}
 *   open={showModal}
 *   onOpenChange={setShowModal}
 * />
 * ```
 */
export function PaymentDetailModal({ payment, open, onOpenChange }: PaymentDetailModalProps) {
  if (!payment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            결제 상세 정보
            <PaymentStatusBadge status={payment.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Information */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">결제 정보</h3>
            <div className="bg-muted/50 space-y-2 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">결제 수단</span>
                <div className="flex items-center gap-2">
                  <PaymentMethodIcon method={payment.method} className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {getPaymentMethodName(payment.method)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">결제 금액</span>
                <span className="text-base font-semibold">
                  {formatCurrency(payment.amount, payment.currency)}
                </span>
              </div>
              {payment.cancelledAmount && payment.cancelledAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">환불 금액</span>
                  <span className="text-sm font-medium text-orange-600">
                    {formatCurrency(payment.cancelledAmount, payment.currency)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">주문명</span>
                <span className="text-sm">{payment.orderName || '-'}</span>
              </div>
            </div>
          </div>

          {/* Transaction IDs */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">거래 식별자</h3>
            <div className="bg-muted/50 space-y-2 rounded-lg p-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs">결제 ID</span>
                <code className="text-xs">{payment.paymentId}</code>
              </div>
              {payment.orderId && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">주문 ID</span>
                  <code className="text-xs">{payment.orderId}</code>
                </div>
              )}
              {payment.pgTxId && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">PG 거래 ID</span>
                  <code className="text-xs">{payment.pgTxId}</code>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          {payment.customer && (
            <div>
              <h3 className="mb-3 text-sm font-semibold">고객 정보</h3>
              <div className="bg-muted/50 space-y-2 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">이름</span>
                  <span className="text-sm">{payment.customer.name || '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">이메일</span>
                  <span className="text-sm">{payment.customer.email}</span>
                </div>
              </div>
            </div>
          )}

          {/* Booking Information */}
          {payment.booking && (
            <div>
              <h3 className="mb-3 text-sm font-semibold">예약 정보</h3>
              <div className="bg-muted/50 space-y-2 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">예약 번호</span>
                  <span className="font-mono text-sm">{payment.booking.bookingNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">서비스 일시</span>
                  <span className="text-sm">
                    {formatDate(payment.booking.serviceDate)} {payment.booking.serviceTime}
                  </span>
                </div>
                {payment.booking.groomer && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">담당 미용사</span>
                    <span className="text-sm">{payment.booking.groomer.name || '-'}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">거래 내역</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full p-1 text-xs font-medium">
                  1
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">결제 생성</div>
                  <div className="text-muted-foreground text-xs">
                    {formatDate(payment.createdAt)}
                  </div>
                </div>
              </div>

              {payment.paidAt && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 p-1 text-xs font-medium text-green-700">
                    ✓
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">결제 완료</div>
                    <div className="text-muted-foreground text-xs">
                      {formatDate(payment.paidAt)}
                    </div>
                  </div>
                </div>
              )}

              {payment.failedAt && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 p-1 text-xs font-medium text-red-700">
                    ✕
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">결제 실패</div>
                    <div className="text-muted-foreground text-xs">
                      {formatDate(payment.failedAt)}
                    </div>
                    {payment.failReason && (
                      <div className="mt-1 text-xs text-red-600">{payment.failReason}</div>
                    )}
                  </div>
                </div>
              )}

              {payment.cancelledAt && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 p-1 text-xs font-medium text-gray-700">
                    −
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">결제 취소</div>
                    <div className="text-muted-foreground text-xs">
                      {formatDate(payment.cancelledAt)}
                    </div>
                    {payment.cancelReason && (
                      <div className="mt-1 text-xs text-gray-600">{payment.cancelReason}</div>
                    )}
                  </div>
                </div>
              )}

              {payment.refundedAt && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 p-1 text-xs font-medium text-purple-700">
                    ↺
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">환불 처리</div>
                    <div className="text-muted-foreground text-xs">
                      {formatDate(payment.refundedAt)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Receipt Link */}
          {payment.receiptUrl && (
            <div>
              <a
                href={payment.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm hover:underline"
              >
                영수증 보기 →
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
