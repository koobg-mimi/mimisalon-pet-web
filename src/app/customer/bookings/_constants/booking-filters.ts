import { BookingStatus } from '@mimisalon/shared';

// 필터 타입 정의
export type FilterType =
  | 'ALL'
  | 'PAYMENT_COMPLETE'
  | 'GROOMER_CONFIRM'
  | 'SERVICE_COMPLETED'
  | 'SERVICE_CANCELLED';

// 각 필터에 해당하는 실제 예약 상태들
export const FILTER_STATUS_MAP: Record<FilterType, BookingStatus[] | null> = {
  ALL: null,
  PAYMENT_COMPLETE: ['FIRST_PAYMENT_COMPLETE', 'GROOMER_CONFIRM_PENDING'],
  GROOMER_CONFIRM: ['GROOMER_CONFIRM'],
  SERVICE_COMPLETED: ['SERVICE_COMPLETED'],
  SERVICE_CANCELLED: ['SERVICE_CANCELLED'],
};

// 필터 옵션 배열
export const FILTER_OPTIONS: FilterType[] = [
  'ALL',
  'PAYMENT_COMPLETE',
  'GROOMER_CONFIRM',
  'SERVICE_COMPLETED',
  'SERVICE_CANCELLED',
];
