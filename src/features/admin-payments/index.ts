/**
 * Admin Payments Feature
 *
 * Barrel export for all admin payments functionality
 */

// Components
export { PaymentFilters } from './components/payments/payment-filters'
export { PaymentsTable } from './components/payments/payments-table'
export { PaymentDetailModal } from './components/payments/payment-detail-modal'
export { PaymentStatusBadge } from './components/ui/payment-status-badge'
export { PaymentMethodIcon } from './components/ui/payment-method-icon'

// Hooks
export { useAdminPayments } from './hooks/use-admin-payments'

// State
export { adminPaymentsApi, useGetPaymentsQuery } from './state/admin-payments-api-slice'
export type { GetPaymentsParams } from './state/admin-payments-api-slice'

// Types
export type {
  AdminPaymentPayload,
  AdminPaymentInfo,
  AdminPaymentsGetResponse,
  PaymentFilters as PaymentFiltersType,
  PaymentPagination,
} from './types/payment.types'

// Utils
export {
  formatCurrency,
  formatDate,
  getPaymentMethodName,
  getPaymentStatusConfig,
  PAYMENT_STATUS_CONFIG,
} from './utils'
export type { PaymentStatusConfig } from './utils/payment-status-config'
