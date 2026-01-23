import { PaymentStatus } from '@mimisalon/shared'
import { FilterType } from '../_constants/payment-filters'

/**
 * 결제 상태에 따른 배지 색상 클래스 반환
 */
export const getStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case 'PAID':
    case 'COMPLETED':
    case 'CAPTURED':
      return 'text-green-600 bg-green-50'
    case 'PENDING':
    case 'AUTHORIZED':
      return 'text-yellow-600 bg-yellow-50'
    case 'FAILED':
    case 'CANCELLED':
    case 'EXPIRED':
      return 'text-red-600 bg-red-50'
    case 'REFUNDED':
    case 'PARTIALLY_REFUNDED':
    case 'PARTIAL_CANCELLED':
      return 'text-orange-600 bg-orange-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

/**
 * 결제 상태에 따른 한글 텍스트 반환
 */
export const getStatusText = (status: PaymentStatus): string => {
  switch (status) {
    case 'PAID':
      return '결제완료'
    case 'PENDING':
      return '결제대기'
    case 'AUTHORIZED':
      return '승인완료'
    case 'CAPTURED':
      return '결제완료'
    case 'COMPLETED':
      return '완료'
    case 'FAILED':
      return '실패'
    case 'CANCELLED':
      return '취소'
    case 'PARTIAL_CANCELLED':
      return '부분취소'
    case 'REFUNDED':
      return '환불완료'
    case 'PARTIALLY_REFUNDED':
      return '부분환불'
    case 'EXPIRED':
      return '만료'
    default:
      return status
  }
}

/**
 * 결제 수단에 따른 한글 텍스트 반환
 */
export const getMethodText = (method: string): string => {
  if (!method || method === 'PENDING') return '처리중'

  // PortOne 결제 수단 매핑
  if (method.includes('CARD') || method.includes('card')) return '카드'
  if (method.includes('VIRTUAL_ACCOUNT') || method.includes('virtual')) return '가상계좌'
  if (method.includes('TRANSFER') || method.includes('transfer')) return '계좌이체'
  if (method.includes('KAKAO') || method.includes('kakao')) return '카카오페이'
  if (method.includes('NAVER') || method.includes('naver')) return '네이버페이'
  if (method.includes('TOSS') || method.includes('toss')) return '토스페이'
  if (method.includes('PAYPAL') || method.includes('paypal')) return '페이팔'

  return method
}

/**
 * 필터 타입에 따른 한글 라벨 반환
 */
export const getFilterLabel = (filterType: FilterType): string => {
  switch (filterType) {
    case 'ALL':
      return '전체'
    case 'PAID':
      return '결제완료'
    case 'PENDING':
      return '결제대기'
    case 'FAILED':
      return '실패'
    case 'REFUNDED':
      return '환불'
    default:
      return filterType
  }
}
