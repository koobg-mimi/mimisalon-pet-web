export interface Payment {
  id: string
  paymentId: string
  amount: number
  currency: string
  method: string
  status: string
  orderName: string | null
  receiptUrl: string | null
  paidAt: string | null
  failedAt: string | null
  cancelledAt: string | null
  refundedAt: string | null
  failReason: string | null
  cancelReason: string | null
  createdAt: string
  updatedAt: string
  booking: {
    id: string
    bookingNumber: string
    serviceDate: string
    serviceTime: string
    status: string
    pet: {
      id: string
      name: string
      type: string
      breed: string | null
    } | null
    service: {
      id: string
      name: string
      category: string
    } | null
  } | null
}

export interface PaymentsResponse {
  payments: Payment[]
  totalPayments: number
  totalPages: number
  page: number
  limit: number
}
