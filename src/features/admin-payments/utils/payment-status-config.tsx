import type { AdminPaymentInfo } from '../types/payment.types'

/**
 * Payment status configuration including display labels, colors, and descriptions
 */
export interface PaymentStatusConfig {
  label: string
  color: string
  bgColor: string
  description: string
}

/**
 * Configuration map for all payment statuses
 * Used for consistent status display across the application
 */
export const PAYMENT_STATUS_CONFIG: Record<AdminPaymentInfo['status'], PaymentStatusConfig> = {
  PAID: {
    label: '결제완료',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    description: '결제가 정상적으로 완료되었습니다',
  },
  PENDING: {
    label: '대기중',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    description: '결제 처리 대기 중입니다',
  },
  FAILED: {
    label: '실패',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    description: '결제가 실패했습니다',
  },
  CANCELLED: {
    label: '취소됨',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    description: '결제가 취소되었습니다',
  },
  REFUNDED: {
    label: '환불완료',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    description: '전액 환불 처리되었습니다',
  },
  PARTIALLY_REFUNDED: {
    label: '부분환불',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    description: '부분 환불 처리되었습니다',
  },
  AUTHORIZED: {
    label: '승인됨',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    description: '결제 승인되었습니다',
  },
  CAPTURED: {
    label: '확정됨',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
    description: '결제 확정되었습니다',
  },
  COMPLETED: {
    label: '완료',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    description: '결제가 완료되었습니다',
  },
  PARTIAL_CANCELLED: {
    label: '부분취소',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    description: '부분 취소되었습니다',
  },
  EXPIRED: {
    label: '만료',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
    description: '결제 유효기간이 만료되었습니다',
  },
}

/**
 * Get payment status configuration for display
 * @param status - Payment status
 * @returns Status configuration with label, colors, and description
 *
 * @example
 * const config = getPaymentStatusConfig('PAID')
 * // { label: '결제완료', color: 'text-green-700', ... }
 */
export function getPaymentStatusConfig(status: AdminPaymentInfo['status']): PaymentStatusConfig {
  return PAYMENT_STATUS_CONFIG[status]
}
