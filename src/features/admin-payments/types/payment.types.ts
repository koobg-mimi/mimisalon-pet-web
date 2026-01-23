import { Prisma, PaymentStatus } from '@mimisalon/shared'

/**
 * Prisma payload type (server-side with Date objects)
 * This type represents the full payment data with relations as returned by Prisma
 */
export type AdminPaymentPayload = Prisma.PaymentGetPayload<{
  include: {
    booking: {
      select: {
        id: true
        bookingNumber: true
        serviceDate: true
        serviceTime: true
        customer: { select: { id: true; name: true; email: true } }
        groomer: { select: { id: true; name: true; email: true } }
      }
    }
    customer: { select: { id: true; name: true; email: true } }
  }
}>

/**
 * Client-side payment type (dates as strings after serialization)
 * This is used throughout the frontend as Next.js serializes Date objects to ISO strings
 */
export interface AdminPaymentInfo {
  id: string
  bookingId: string | null
  customerId: string | null
  paymentId: string
  pgTxId: string | null
  orderId: string | null
  orderName: string | null
  amount: number
  currency: string
  method: string
  status: PaymentStatus
  paidAt: string | null
  failedAt: string | null
  cancelledAt: string | null
  refundedAt: string | null
  failReason: string | null
  cancelReason: string | null
  cancelledAmount: number | null
  receiptUrl: string | null
  createdAt: string
  updatedAt: string
  booking: {
    id: string
    bookingNumber: string
    serviceDate: string
    serviceTime: string
    customer: {
      id: string
      name: string | null
      email: string
    }
    groomer: {
      id: string
      name: string | null
      email: string
    } | null
  } | null
  customer: {
    id: string
    name: string | null
    email: string
  } | null
}

/**
 * API response type with serialized dates
 */
export interface AdminPaymentsGetResponse {
  payments: AdminPaymentInfo[]
  totalCount: number
  totalPages: number
  currentPage: number
}

/**
 * Filter types for payment search and filtering
 */
export interface PaymentFilters {
  searchQuery: string
  statusFilter:
    | 'ALL'
    | 'PENDING'
    | 'PAID'
    | 'AUTHORIZED'
    | 'CAPTURED'
    | 'COMPLETED'
    | 'FAILED'
    | 'CANCELLED'
    | 'PARTIAL_CANCELLED'
    | 'REFUNDED'
    | 'PARTIALLY_REFUNDED'
    | 'EXPIRED'
}

/**
 * Pagination metadata
 */
export interface PaymentPagination {
  currentPage: number
  totalPages: number
  totalCount: number
}
