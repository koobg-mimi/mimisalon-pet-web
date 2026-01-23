import type { AdminPaymentInfo, AdminPaymentsGetResponse } from '../../types/payment.types'

/**
 * Mock payment data for testing
 */
export const mockPayment: AdminPaymentInfo = {
  id: 'payment-1',
  bookingId: 'booking-1',
  customerId: 'customer-1',
  paymentId: 'portone-payment-1',
  pgTxId: 'pg-tx-123456',
  orderId: 'order-2025-001',
  orderName: '강아지 목욕 서비스',
  amount: 50000,
  currency: 'KRW',
  method: 'CARD',
  status: 'PAID',
  paidAt: '2025-11-04T10:30:00.000Z',
  failedAt: null,
  cancelledAt: null,
  refundedAt: null,
  failReason: null,
  cancelReason: null,
  cancelledAmount: null,
  receiptUrl: 'https://example.com/receipt/payment-1',
  booking: {
    id: 'booking-1',
    bookingNumber: 'BK-2025-001',
    serviceDate: '2025-11-05T00:00:00.000Z',
    serviceTime: '14:00',
    customer: {
      id: 'customer-1',
      name: '김철수',
      email: 'customer@example.com',
    },
    groomer: {
      id: 'groomer-1',
      name: '박미용',
      email: 'groomer@example.com',
    },
  },
  customer: {
    id: 'customer-1',
    name: '김철수',
    email: 'customer@example.com',
  },
  createdAt: '2025-11-04T10:00:00.000Z',
  updatedAt: '2025-11-04T10:30:00.000Z',
}

/**
 * Mock payment with failed status
 */
export const mockFailedPayment: AdminPaymentInfo = {
  ...mockPayment,
  id: 'payment-2',
  paymentId: 'portone-payment-2',
  status: 'FAILED',
  paidAt: null,
  failedAt: '2025-11-04T11:00:00.000Z',
  failReason: '카드 한도 초과',
}

/**
 * Mock payment with refunded status
 */
export const mockRefundedPayment: AdminPaymentInfo = {
  ...mockPayment,
  id: 'payment-3',
  paymentId: 'portone-payment-3',
  status: 'REFUNDED',
  refundedAt: '2025-11-04T15:00:00.000Z',
  cancelReason: '고객 요청',
  cancelledAmount: 50000,
}

/**
 * Mock payment with partial refund status
 */
export const mockPartialRefundedPayment: AdminPaymentInfo = {
  ...mockPayment,
  id: 'payment-4',
  paymentId: 'portone-payment-4',
  status: 'PARTIALLY_REFUNDED',
  refundedAt: '2025-11-04T16:00:00.000Z',
  cancelReason: '부분 취소',
  cancelledAmount: 25000,
}

/**
 * Mock payment with pending status
 */
export const mockPendingPayment: AdminPaymentInfo = {
  ...mockPayment,
  id: 'payment-5',
  paymentId: 'portone-payment-5',
  status: 'PENDING',
  paidAt: null,
}

/**
 * Mock payment with cancelled status
 */
export const mockCancelledPayment: AdminPaymentInfo = {
  ...mockPayment,
  id: 'payment-6',
  paymentId: 'portone-payment-6',
  status: 'CANCELLED',
  paidAt: null,
  cancelledAt: '2025-11-04T12:00:00.000Z',
  cancelReason: '결제 취소',
}

/**
 * Array of all mock payments for list testing
 */
export const mockPayments: AdminPaymentInfo[] = [
  mockPayment,
  mockFailedPayment,
  mockRefundedPayment,
  mockPartialRefundedPayment,
  mockPendingPayment,
  mockCancelledPayment,
]

/**
 * Mock API response for payments list
 */
export const mockPaymentsResponse: AdminPaymentsGetResponse = {
  payments: mockPayments,
  currentPage: 1,
  totalPages: 1,
  totalCount: 6,
}

/**
 * Mock empty API response
 */
export const mockEmptyPaymentsResponse: AdminPaymentsGetResponse = {
  payments: [],
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
}
