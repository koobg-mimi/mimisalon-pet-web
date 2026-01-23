'use client'

import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PaymentStatusBadge } from '../ui/payment-status-badge'
import { PaymentMethodIcon } from '../ui/payment-method-icon'
import { formatCurrency, formatDate } from '../../utils'
import type { AdminPaymentInfo } from '../../types/payment.types'

/**
 * Props for PaymentsTable component
 */
interface PaymentsTableProps {
  /** Array of payments to display */
  payments: AdminPaymentInfo[]
  /** Loading state */
  isLoading: boolean
  /** Callback when viewing payment details (optional) */
  onViewDetails?: (payment: AdminPaymentInfo) => void
  /** Current page number */
  currentPage: number
  /** Total number of pages */
  totalPages: number
  /** Callback when page changes */
  onPageChange: (page: number) => void
}

/**
 * Table displaying payment records with pagination
 *
 * Shows payment information including order details, customer info,
 * amount, status, dates, and actions (receipt link).
 *
 * @example
 * ```tsx
 * <PaymentsTable
 *   payments={payments}
 *   isLoading={false}
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={setPage}
 * />
 * ```
 */
export function PaymentsTable({
  payments,
  isLoading,
  onViewDetails,
  currentPage,
  totalPages,
  onPageChange,
}: PaymentsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-muted-foreground flex items-center justify-center text-sm">
            결제 내역을 불러오는 중...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>결제 정보</TableHead>
                <TableHead>고객</TableHead>
                <TableHead>금액</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>결제일시</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground py-8 text-center">
                    결제 내역이 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => onViewDetails?.(payment)}
                  >
                    {/* Payment Info */}
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                          <PaymentMethodIcon method={payment.method} />
                        </div>
                        <div>
                          <p className="font-medium">{payment.orderName || '주문명 없음'}</p>
                          <div className="text-muted-foreground space-y-0.5 text-xs">
                            {payment.booking?.bookingNumber && (
                              <div>예약번호: {payment.booking.bookingNumber}</div>
                            )}
                            <div>결제 ID: {payment.paymentId}</div>
                            {payment.orderId && <div>주문 ID: {payment.orderId}</div>}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Customer Info */}
                    <TableCell>
                      {payment.customer ? (
                        <div>
                          <p className="text-sm font-medium">
                            {payment.customer.name || '이름 없음'}
                          </p>
                          <p className="text-muted-foreground text-xs">{payment.customer.email}</p>
                        </div>
                      ) : payment.booking?.customer ? (
                        <div>
                          <p className="text-sm font-medium">
                            {payment.booking.customer.name || '이름 없음'}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {payment.booking.customer.email}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>

                    {/* Amount */}
                    <TableCell>
                      <div>
                        <p className="font-semibold">
                          {formatCurrency(payment.amount, payment.currency)}
                        </p>
                        {payment.cancelledAmount && payment.cancelledAmount > 0 && (
                          <p className="text-xs text-orange-600">
                            환불: {formatCurrency(payment.cancelledAmount, payment.currency)}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <div className="space-y-1">
                        <PaymentStatusBadge status={payment.status} />
                        {payment.status === 'FAILED' && payment.failReason && (
                          <p className="mt-1 text-xs text-red-600">{payment.failReason}</p>
                        )}
                        {(payment.status === 'CANCELLED' ||
                          payment.status === 'PARTIAL_CANCELLED') &&
                          payment.cancelReason && (
                            <p className="mt-1 text-xs text-gray-600">{payment.cancelReason}</p>
                          )}
                      </div>
                    </TableCell>

                    {/* Dates */}
                    <TableCell>
                      <div className="space-y-0.5 text-sm">
                        <div>
                          {payment.paidAt
                            ? formatDate(payment.paidAt)
                            : payment.failedAt
                              ? formatDate(payment.failedAt)
                              : formatDate(payment.createdAt)}
                        </div>
                        {payment.cancelledAt && (
                          <div className="text-xs text-gray-500">
                            취소: {formatDate(payment.cancelledAt)}
                          </div>
                        )}
                        {payment.refundedAt && (
                          <div className="text-xs text-purple-600">
                            환불: {formatDate(payment.refundedAt)}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      {payment.receiptUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(payment.receiptUrl!, '_blank')
                          }}
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          영수증
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-muted-foreground text-sm">
              페이지 {currentPage} / {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                이전
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                다음
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
