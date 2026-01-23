/**
 * 예약 폼 타입 정의
 */

import { ServiceData } from '@/data/services'
import { ServiceOption } from '@/features/booking/components/ui/service-option-selector'

/**
 * 반려동물별 서비스 선택 정보
 */
export interface PetServiceSelection {
  /** 반려동물 ID */
  petId: string
  /** 선택된 서비스 목록 */
  services: ServiceData[]
  /** 선택된 추가 옵션 목록 */
  options: ServiceOption[]
}

/**
 * 예약 폼 데이터 구조
 */
export interface BookingForm {
  /** 반려동물별 서비스 선택 목록 */
  petServices: PetServiceSelection[]
  /** 선택된 주소 ID */
  addressId: string
  /** 선택된 미용사 ID */
  groomerId: string
  /** 예약 날짜 (yyyy-MM-dd) */
  date: string
  /** 예약 시간대 */
  timeSlot: string
  /** 특별 요청사항 */
  specialRequests: string
}

/**
 * 예약 폼 단계 타입
 */
export type BookingStep = 1 | 2 | 3 | 4

/**
 * 초기 폼 상태
 */
export const initialBookingForm: BookingForm = {
  petServices: [],
  addressId: '',
  groomerId: '',
  date: '',
  timeSlot: '',
  specialRequests: '',
}
