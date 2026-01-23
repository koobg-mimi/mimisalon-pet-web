/**
 * 추가 결제 유틸리티 함수
 * @module features/additional-payment/utils
 */

import type { AdditionalCharge, BookingInfo } from '../types/additional-payment.types'

/**
 * 추가 비용 총액 계산
 * @description 모든 추가 비용 항목의 합계를 계산합니다
 * @param charges - 추가 비용 항목 배열
 * @returns 총액 (원)
 * @example
 * ```ts
 * const total = calculateTotalAdditionalAmount([
 *   { id: '1', name: '털 엉킴', amount: 10000, quantity: 1, total: 10000 },
 *   { id: '2', name: '특수 샴푸', amount: 5000, quantity: 2, total: 10000 }
 * ])
 * // total = 20000
 * ```
 */
export function calculateTotalAdditionalAmount(charges: AdditionalCharge[]): number {
  return charges.reduce((sum, charge) => sum + charge.total, 0)
}

/**
 * 추가 비용 항목 표시 포맷팅
 * @description 추가 비용 항목을 사용자에게 표시할 형식으로 변환합니다
 * @param charge - 추가 비용 항목
 * @returns 포맷된 문자열
 * @example
 * ```ts
 * formatChargeDisplay({ amount: 10000, quantity: 2 })
 * // "10,000원 × 2개"
 * ```
 */
export function formatChargeDisplay(charge: AdditionalCharge): string {
  return `${charge.amount.toLocaleString('ko-KR')}원 × ${charge.quantity}개`
}

/**
 * 금액 한국 형식 포맷팅
 * @description 숫자를 한국 통화 형식으로 변환합니다 (천 단위 구분)
 * @param amount - 금액 (원)
 * @returns 포맷된 금액 문자열
 * @example
 * ```ts
 * formatAmount(123456)
 * // "123,456원"
 * ```
 */
export function formatAmount(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}

/**
 * 주문명 생성
 * @description 결제 시스템에 전달할 주문명을 생성합니다
 * @param bookingInfo - 예약 정보
 * @returns 주문명 (예: "추가 서비스 - 뽀삐")
 * @example
 * ```ts
 * generateOrderName({ pet: { name: '뽀삐' } })
 * // "추가 서비스 - 뽀삐"
 * ```
 */
export function generateOrderName(bookingInfo: BookingInfo): string {
  return `추가 서비스 - ${bookingInfo.pet.name}`
}

/**
 * 추가 비용 항목 검증
 * @description 추가 비용 항목이 유효한지 검증합니다
 * @param charge - 검증할 추가 비용 항목
 * @returns 유효성 여부
 */
export function isValidCharge(charge: AdditionalCharge): boolean {
  return (
    charge.amount > 0 &&
    charge.quantity > 0 &&
    charge.total === charge.amount * charge.quantity &&
    charge.name.trim().length > 0
  )
}

/**
 * 추가 비용 목록 검증
 * @description 추가 비용 목록이 모두 유효한지 검증합니다
 * @param charges - 추가 비용 항목 배열
 * @returns 유효성 여부
 */
export function validateCharges(charges: AdditionalCharge[]): boolean {
  if (!Array.isArray(charges) || charges.length === 0) {
    return false
  }
  return charges.every(isValidCharge)
}

/**
 * 결제 가능 여부 확인
 * @description 추가 결제를 진행할 수 있는 상태인지 확인합니다
 * @param bookingInfo - 예약 정보
 * @returns 결제 가능 여부와 불가 사유
 */
export function canProceedToPayment(bookingInfo: BookingInfo | null | undefined): {
  canProceed: boolean
  reason?: string
} {
  if (!bookingInfo) {
    return { canProceed: false, reason: '예약 정보를 찾을 수 없습니다' }
  }

  if (!bookingInfo.additionalCharges || bookingInfo.additionalCharges.length === 0) {
    return { canProceed: false, reason: '추가 비용 항목이 없습니다' }
  }

  if (!validateCharges(bookingInfo.additionalCharges)) {
    return { canProceed: false, reason: '유효하지 않은 비용 항목이 있습니다' }
  }

  const totalAmount = calculateTotalAdditionalAmount(bookingInfo.additionalCharges)
  if (totalAmount <= 0) {
    return { canProceed: false, reason: '결제 금액이 0원입니다' }
  }

  return { canProceed: true }
}
