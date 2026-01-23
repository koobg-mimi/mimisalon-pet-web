/**
 * Additional Payment Utils Unit Tests
 *
 * 추가 결제 유틸리티 함수 단위 테스트
 */

import { describe, expect, it } from 'vitest'
import {
  calculateTotalAdditionalAmount,
  formatChargeDisplay,
  formatAmount,
  generateOrderName,
  isValidCharge,
  validateCharges,
  canProceedToPayment,
} from '../utils/additional-payment.utils'
import type { AdditionalCharge, BookingInfo } from '../types/additional-payment.types'

// 테스트용 헬퍼 함수
const createCharge = (overrides: Partial<AdditionalCharge> = {}): AdditionalCharge => ({
  id: 'charge1',
  name: '털 엉킴 해결',
  amount: 10000,
  quantity: 1,
  total: 10000,
  description: '추가 작업',
  ...overrides,
})

const createBookingInfo = (overrides: Partial<BookingInfo> = {}): BookingInfo => ({
  id: 'booking1',
  pet: {
    name: '뽀삐',
    breed: '푸들',
  },
  service: {
    name: '전체 미용',
  },
  groomer: {
    name: '김미용사',
  },
  location: {
    name: '강남점',
    address: '서울시 강남구',
  },
  date: '2025-10-30',
  time: '10:00',
  originalAmount: 50000,
  additionalCharges: [],
  status: 'COMPLETED',
  ...overrides,
})

describe('additional-payment.utils', () => {
  describe('calculateTotalAdditionalAmount', () => {
    it('빈 배열의 경우 0을 반환해야 함', () => {
      const result = calculateTotalAdditionalAmount([])
      expect(result).toBe(0)
    })

    it('단일 항목의 총액을 정확히 계산해야 함', () => {
      const charges = [createCharge({ total: 10000 })]
      const result = calculateTotalAdditionalAmount(charges)
      expect(result).toBe(10000)
    })

    it('여러 항목의 총액을 합산해야 함', () => {
      const charges = [
        createCharge({ id: 'c1', total: 10000 }),
        createCharge({ id: 'c2', total: 15000 }),
        createCharge({ id: 'c3', total: 5000 }),
      ]
      const result = calculateTotalAdditionalAmount(charges)
      expect(result).toBe(30000)
    })

    it('수량과 금액이 다른 항목들을 정확히 합산해야 함', () => {
      const charges = [
        createCharge({ amount: 10000, quantity: 2, total: 20000 }),
        createCharge({ amount: 5000, quantity: 3, total: 15000 }),
      ]
      const result = calculateTotalAdditionalAmount(charges)
      expect(result).toBe(35000)
    })
  })

  describe('formatChargeDisplay', () => {
    it('기본 포맷을 정확히 적용해야 함', () => {
      const charge = createCharge({ amount: 10000, quantity: 1 })
      const result = formatChargeDisplay(charge)
      expect(result).toBe('10,000원 × 1개')
    })

    it('천 단위 구분 기호를 정확히 표시해야 함', () => {
      const charge = createCharge({ amount: 123456, quantity: 1 })
      const result = formatChargeDisplay(charge)
      expect(result).toBe('123,456원 × 1개')
    })

    it('수량이 여러 개인 경우 정확히 표시해야 함', () => {
      const charge = createCharge({ amount: 5000, quantity: 3 })
      const result = formatChargeDisplay(charge)
      expect(result).toBe('5,000원 × 3개')
    })

    it('큰 금액도 정확히 포맷해야 함', () => {
      const charge = createCharge({ amount: 1000000, quantity: 2 })
      const result = formatChargeDisplay(charge)
      expect(result).toBe('1,000,000원 × 2개')
    })
  })

  describe('formatAmount', () => {
    it('기본 금액을 한국 형식으로 포맷해야 함', () => {
      const result = formatAmount(10000)
      expect(result).toBe('10,000원')
    })

    it('0원도 정확히 표시해야 함', () => {
      const result = formatAmount(0)
      expect(result).toBe('0원')
    })

    it('천 단위 구분 기호를 정확히 표시해야 함', () => {
      const result = formatAmount(123456789)
      expect(result).toBe('123,456,789원')
    })

    it('작은 금액도 정확히 포맷해야 함', () => {
      const result = formatAmount(500)
      expect(result).toBe('500원')
    })
  })

  describe('generateOrderName', () => {
    it('기본 주문명을 생성해야 함', () => {
      const booking = createBookingInfo()
      const result = generateOrderName(booking)
      expect(result).toBe('추가 서비스 - 뽀삐')
    })

    it('다른 반려동물 이름으로 주문명을 생성해야 함', () => {
      const booking = createBookingInfo({
        pet: { name: '루비', breed: '페르시안' },
      })
      const result = generateOrderName(booking)
      expect(result).toBe('추가 서비스 - 루비')
    })

    it('특수문자가 포함된 이름도 처리해야 함', () => {
      const booking = createBookingInfo({
        pet: { name: '초코♥', breed: '시츄' },
      })
      const result = generateOrderName(booking)
      expect(result).toBe('추가 서비스 - 초코♥')
    })
  })

  describe('isValidCharge', () => {
    it('유효한 비용 항목을 true로 판단해야 함', () => {
      const charge = createCharge()
      const result = isValidCharge(charge)
      expect(result).toBe(true)
    })

    it('금액이 0 이하인 경우 false를 반환해야 함', () => {
      const charge = createCharge({ amount: 0, total: 0 })
      const result = isValidCharge(charge)
      expect(result).toBe(false)
    })

    it('수량이 0 이하인 경우 false를 반환해야 함', () => {
      const charge = createCharge({ quantity: 0, total: 0 })
      const result = isValidCharge(charge)
      expect(result).toBe(false)
    })

    it('total이 amount * quantity와 다른 경우 false를 반환해야 함', () => {
      const charge = createCharge({ amount: 10000, quantity: 2, total: 15000 })
      const result = isValidCharge(charge)
      expect(result).toBe(false)
    })

    it('이름이 빈 문자열인 경우 false를 반환해야 함', () => {
      const charge = createCharge({ name: '' })
      const result = isValidCharge(charge)
      expect(result).toBe(false)
    })

    it('이름이 공백만 있는 경우 false를 반환해야 함', () => {
      const charge = createCharge({ name: '   ' })
      const result = isValidCharge(charge)
      expect(result).toBe(false)
    })

    it('음수 금액은 유효하지 않음', () => {
      const charge = createCharge({ amount: -10000, quantity: 1, total: -10000 })
      const result = isValidCharge(charge)
      expect(result).toBe(false)
    })

    it('음수 수량은 유효하지 않음', () => {
      const charge = createCharge({ amount: 10000, quantity: -1, total: -10000 })
      const result = isValidCharge(charge)
      expect(result).toBe(false)
    })
  })

  describe('validateCharges', () => {
    it('모든 항목이 유효한 경우 true를 반환해야 함', () => {
      const charges = [
        createCharge({ id: 'c1', amount: 10000, quantity: 1, total: 10000 }),
        createCharge({ id: 'c2', amount: 5000, quantity: 2, total: 10000 }),
      ]
      const result = validateCharges(charges)
      expect(result).toBe(true)
    })

    it('빈 배열인 경우 false를 반환해야 함', () => {
      const result = validateCharges([])
      expect(result).toBe(false)
    })

    it('배열이 아닌 경우 false를 반환해야 함', () => {
      const result = validateCharges(null as unknown as AdditionalCharge[])
      expect(result).toBe(false)
    })

    it('하나라도 유효하지 않은 항목이 있으면 false를 반환해야 함', () => {
      const charges = [
        createCharge({ id: 'c1', amount: 10000, quantity: 1, total: 10000 }),
        createCharge({ id: 'c2', amount: 0, quantity: 1, total: 0 }), // 유효하지 않음
      ]
      const result = validateCharges(charges)
      expect(result).toBe(false)
    })

    it('total 계산이 잘못된 항목이 있으면 false를 반환해야 함', () => {
      const charges = [
        createCharge({ id: 'c1', amount: 10000, quantity: 1, total: 10000 }),
        createCharge({ id: 'c2', amount: 5000, quantity: 2, total: 5000 }), // total이 잘못됨
      ]
      const result = validateCharges(charges)
      expect(result).toBe(false)
    })
  })

  describe('canProceedToPayment', () => {
    it('정상적인 예약 정보의 경우 결제 가능해야 함', () => {
      const booking = createBookingInfo({
        additionalCharges: [createCharge({ amount: 10000, quantity: 1, total: 10000 })],
      })
      const result = canProceedToPayment(booking)
      expect(result).toEqual({ canProceed: true })
    })

    it('예약 정보가 null인 경우 결제 불가해야 함', () => {
      const result = canProceedToPayment(null)
      expect(result).toEqual({
        canProceed: false,
        reason: '예약 정보를 찾을 수 없습니다',
      })
    })

    it('예약 정보가 undefined인 경우 결제 불가해야 함', () => {
      const result = canProceedToPayment(undefined)
      expect(result).toEqual({
        canProceed: false,
        reason: '예약 정보를 찾을 수 없습니다',
      })
    })

    it('추가 비용 항목이 없는 경우 결제 불가해야 함', () => {
      const booking = createBookingInfo({ additionalCharges: [] })
      const result = canProceedToPayment(booking)
      expect(result).toEqual({
        canProceed: false,
        reason: '추가 비용 항목이 없습니다',
      })
    })

    it('추가 비용 항목이 null인 경우 결제 불가해야 함', () => {
      const booking = createBookingInfo({ additionalCharges: null as unknown as [] })
      const result = canProceedToPayment(booking)
      expect(result).toEqual({
        canProceed: false,
        reason: '추가 비용 항목이 없습니다',
      })
    })

    it('유효하지 않은 비용 항목이 있는 경우 결제 불가해야 함', () => {
      const booking = createBookingInfo({
        additionalCharges: [
          createCharge({ amount: 0, quantity: 1, total: 0 }), // 유효하지 않음
        ],
      })
      const result = canProceedToPayment(booking)
      expect(result).toEqual({
        canProceed: false,
        reason: '유효하지 않은 비용 항목이 있습니다',
      })
    })

    it('총액이 0원인 경우 결제 불가해야 함', () => {
      const booking = createBookingInfo({
        additionalCharges: [createCharge({ amount: 10000, quantity: 0, total: 0 })],
      })
      const result = canProceedToPayment(booking)
      expect(result).toEqual({
        canProceed: false,
        reason: '유효하지 않은 비용 항목이 있습니다',
      })
    })

    it('여러 항목이 있고 모두 유효한 경우 결제 가능해야 함', () => {
      const booking = createBookingInfo({
        additionalCharges: [
          createCharge({ id: 'c1', amount: 10000, quantity: 1, total: 10000 }),
          createCharge({ id: 'c2', amount: 5000, quantity: 2, total: 10000 }),
          createCharge({ id: 'c3', amount: 15000, quantity: 1, total: 15000 }),
        ],
      })
      const result = canProceedToPayment(booking)
      expect(result).toEqual({ canProceed: true })
    })

    it('total 계산이 잘못된 항목이 있으면 결제 불가해야 함', () => {
      const booking = createBookingInfo({
        additionalCharges: [
          createCharge({ amount: 10000, quantity: 2, total: 15000 }), // total이 잘못됨
        ],
      })
      const result = canProceedToPayment(booking)
      expect(result).toEqual({
        canProceed: false,
        reason: '유효하지 않은 비용 항목이 있습니다',
      })
    })
  })

  describe('통합 시나리오 테스트', () => {
    it('실제 추가 결제 시나리오를 올바르게 처리해야 함', () => {
      // 1. 예약 정보 생성
      const booking = createBookingInfo({
        additionalCharges: [
          createCharge({
            id: 'c1',
            name: '털 엉킴 심함',
            amount: 20000,
            quantity: 1,
            total: 20000,
          }),
          createCharge({
            id: 'c2',
            name: '특수 샴푸 사용',
            amount: 10000,
            quantity: 1,
            total: 10000,
          }),
        ],
      })

      // 2. 결제 가능 여부 확인
      const canProceed = canProceedToPayment(booking)
      expect(canProceed.canProceed).toBe(true)

      // 3. 총액 계산
      const total = calculateTotalAdditionalAmount(booking.additionalCharges)
      expect(total).toBe(30000)

      // 4. 주문명 생성
      const orderName = generateOrderName(booking)
      expect(orderName).toBe('추가 서비스 - 뽀삐')

      // 5. 각 항목의 표시 형식 확인
      const displays = booking.additionalCharges.map(formatChargeDisplay)
      expect(displays).toEqual(['20,000원 × 1개', '10,000원 × 1개'])

      // 6. 총액 표시 형식 확인
      const formattedTotal = formatAmount(total)
      expect(formattedTotal).toBe('30,000원')
    })

    it('유효하지 않은 항목이 포함된 시나리오를 올바르게 거부해야 함', () => {
      const booking = createBookingInfo({
        additionalCharges: [
          createCharge({
            id: 'c1',
            name: '털 엉킴 심함',
            amount: 20000,
            quantity: 1,
            total: 20000,
          }),
          createCharge({
            id: 'c2',
            name: '',
            amount: 10000,
            quantity: 1,
            total: 10000,
          }),
        ],
      })

      const canProceed = canProceedToPayment(booking)
      expect(canProceed).toEqual({
        canProceed: false,
        reason: '유효하지 않은 비용 항목이 있습니다',
      })
    })
  })
})
