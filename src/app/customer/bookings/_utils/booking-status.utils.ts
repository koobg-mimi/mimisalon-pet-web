import { BookingStatus } from '@mimisalon/shared';
import { FilterType } from '../_constants/booking-filters';

/**
 * 예약 상태에 따른 배지 색상 클래스 반환
 */
export const getStatusColor = (status: BookingStatus): string => {
  switch (status) {
    case 'FIRST_PAYMENT_PENDING':
      return 'text-gray-600 bg-gray-50';
    case 'FIRST_PAYMENT_COMPLETE':
      return 'text-yellow-600 bg-yellow-50';
    case 'FIRST_PAYMENT_VERIFY':
      return 'text-orange-600 bg-orange-50';
    case 'GROOMER_CONFIRM_PENDING':
      return 'text-purple-600 bg-purple-50';
    case 'GROOMER_CONFIRM':
      return 'text-blue-600 bg-blue-50';
    case 'ADDITIONAL_PAYMENT_PENDING':
      return 'text-amber-600 bg-amber-50';
    case 'ADDITIONAL_PAYMENT_COMPLETE':
      return 'text-amber-700 bg-amber-100';
    case 'WORK_IN_PROGRESS':
      return 'text-indigo-600 bg-indigo-50';
    case 'SERVICE_COMPLETED':
      return 'text-green-600 bg-green-50';
    case 'SERVICE_CANCELLED':
      return 'text-red-600 bg-red-50';
    case 'BOOKING_FAILED':
      return 'text-red-700 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

/**
 * 예약 상태에 따른 한글 텍스트 반환
 */
export const getStatusText = (status: BookingStatus): string => {
  switch (status) {
    case 'FIRST_PAYMENT_PENDING':
      return '결제대기';
    case 'FIRST_PAYMENT_COMPLETE':
      return '결제완료';
    case 'FIRST_PAYMENT_VERIFY':
      return '결제검증중';
    case 'GROOMER_CONFIRM_PENDING':
      return '미용사 확인중';
    case 'GROOMER_CONFIRM':
      return '확정';
    case 'ADDITIONAL_PAYMENT_PENDING':
      return '추가결제 대기';
    case 'ADDITIONAL_PAYMENT_COMPLETE':
      return '추가결제 완료';
    case 'WORK_IN_PROGRESS':
      return '작업중';
    case 'SERVICE_COMPLETED':
      return '완료';
    case 'SERVICE_CANCELLED':
      return '취소';
    case 'BOOKING_FAILED':
      return '예약실패';
    default:
      return status;
  }
};

/**
 * 필터 타입에 따른 한글 라벨 반환
 */
export const getFilterLabel = (filterType: FilterType): string => {
  switch (filterType) {
    case 'ALL':
      return '전체';
    case 'PAYMENT_COMPLETE':
      return '결제완료';
    case 'GROOMER_CONFIRM':
      return '확정';
    case 'SERVICE_COMPLETED':
      return '완료';
    case 'SERVICE_CANCELLED':
      return '취소';
    default:
      return filterType;
  }
};
