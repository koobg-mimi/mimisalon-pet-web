/**
 * Tests for payment status configuration utilities
 *
 * Tests status configuration mapping and display properties.
 * Target coverage: 100%
 */

import { describe, it, expect } from 'vitest'
import { PaymentStatus } from '@mimisalon/shared'
import {
  PAYMENT_STATUS_CONFIG,
  getPaymentStatusConfig,
  type PaymentStatusConfig,
} from '../payment-status-config'

describe('PAYMENT_STATUS_CONFIG', () => {
  describe('Configuration completeness', () => {
    it('should have configuration for all PaymentStatus enum values', () => {
      const allStatuses = Object.values(PaymentStatus)

      allStatuses.forEach((status) => {
        const config = PAYMENT_STATUS_CONFIG[status]

        // Should have configuration entry
        expect(config).toBeDefined()
        expect(config).not.toBeNull()
      })
    })

    it('should have exactly 11 status configurations', () => {
      const configKeys = Object.keys(PAYMENT_STATUS_CONFIG)
      expect(configKeys).toHaveLength(11)
    })

    it('should have configuration for PENDING status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.PENDING]).toBeDefined()
    })

    it('should have configuration for PAID status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.PAID]).toBeDefined()
    })

    it('should have configuration for AUTHORIZED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.AUTHORIZED]).toBeDefined()
    })

    it('should have configuration for CAPTURED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.CAPTURED]).toBeDefined()
    })

    it('should have configuration for COMPLETED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.COMPLETED]).toBeDefined()
    })

    it('should have configuration for FAILED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.FAILED]).toBeDefined()
    })

    it('should have configuration for CANCELLED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.CANCELLED]).toBeDefined()
    })

    it('should have configuration for PARTIAL_CANCELLED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.PARTIAL_CANCELLED]).toBeDefined()
    })

    it('should have configuration for REFUNDED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.REFUNDED]).toBeDefined()
    })

    it('should have configuration for PARTIALLY_REFUNDED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.PARTIALLY_REFUNDED]).toBeDefined()
    })

    it('should have configuration for EXPIRED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.EXPIRED]).toBeDefined()
    })
  })

  describe('Configuration structure', () => {
    it('should have all required fields for each status', () => {
      const allStatuses = Object.values(PaymentStatus)

      allStatuses.forEach((status) => {
        const config = PAYMENT_STATUS_CONFIG[status]

        // Check all required fields exist
        expect(config.label).toBeDefined()
        expect(config.color).toBeDefined()
        expect(config.bgColor).toBeDefined()
        expect(config.description).toBeDefined()
      })
    })

    it('should have string type for label field', () => {
      const allStatuses = Object.values(PaymentStatus)

      allStatuses.forEach((status) => {
        const config = PAYMENT_STATUS_CONFIG[status]
        expect(typeof config.label).toBe('string')
        expect(config.label.length).toBeGreaterThan(0)
      })
    })

    it('should have string type for color field', () => {
      const allStatuses = Object.values(PaymentStatus)

      allStatuses.forEach((status) => {
        const config = PAYMENT_STATUS_CONFIG[status]
        expect(typeof config.color).toBe('string')
        expect(config.color.length).toBeGreaterThan(0)
      })
    })

    it('should have string type for bgColor field', () => {
      const allStatuses = Object.values(PaymentStatus)

      allStatuses.forEach((status) => {
        const config = PAYMENT_STATUS_CONFIG[status]
        expect(typeof config.bgColor).toBe('string')
        expect(config.bgColor.length).toBeGreaterThan(0)
      })
    })

    it('should have string type for description field', () => {
      const allStatuses = Object.values(PaymentStatus)

      allStatuses.forEach((status) => {
        const config = PAYMENT_STATUS_CONFIG[status]
        expect(typeof config.description).toBe('string')
        expect(config.description.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Korean labels', () => {
    it('should have Korean labels for all statuses', () => {
      const allStatuses = Object.values(PaymentStatus)

      allStatuses.forEach((status) => {
        const label = PAYMENT_STATUS_CONFIG[status].label

        // Korean characters are in the Unicode range \uAC00-\uD7A3
        const hasKorean = /[\uAC00-\uD7A3]/.test(label)
        expect(hasKorean).toBe(true)
      })
    })

    it('should return correct Korean label for PAID status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.PAID].label).toBe('결제완료')
    })

    it('should return correct Korean label for PENDING status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.PENDING].label).toBe('대기중')
    })

    it('should return correct Korean label for FAILED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.FAILED].label).toBe('실패')
    })

    it('should return correct Korean label for CANCELLED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.CANCELLED].label).toBe('취소됨')
    })

    it('should return correct Korean label for REFUNDED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.REFUNDED].label).toBe('환불완료')
    })

    it('should return correct Korean label for PARTIALLY_REFUNDED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.PARTIALLY_REFUNDED].label).toBe('부분환불')
    })

    it('should return correct Korean label for AUTHORIZED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.AUTHORIZED].label).toBe('승인됨')
    })

    it('should return correct Korean label for CAPTURED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.CAPTURED].label).toBe('확정됨')
    })

    it('should return correct Korean label for COMPLETED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.COMPLETED].label).toBe('완료')
    })

    it('should return correct Korean label for PARTIAL_CANCELLED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.PARTIAL_CANCELLED].label).toBe('부분취소')
    })

    it('should return correct Korean label for EXPIRED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.EXPIRED].label).toBe('만료')
    })
  })

  describe('Tailwind CSS color format', () => {
    it('should use Tailwind text color classes', () => {
      const allStatuses = Object.values(PaymentStatus)

      allStatuses.forEach((status) => {
        const color = PAYMENT_STATUS_CONFIG[status].color

        // Should start with 'text-' and contain a color name
        expect(color).toMatch(/^text-\w+-\d{3}$/)
      })
    })

    it('should use Tailwind background color classes', () => {
      const allStatuses = Object.values(PaymentStatus)

      allStatuses.forEach((status) => {
        const bgColor = PAYMENT_STATUS_CONFIG[status].bgColor

        // Should start with 'bg-' and contain a color name
        expect(bgColor).toMatch(/^bg-\w+-\d{3}$/)
      })
    })

    it('should use green colors for PAID status', () => {
      const config = PAYMENT_STATUS_CONFIG[PaymentStatus.PAID]
      expect(config.color).toBe('text-green-700')
      expect(config.bgColor).toBe('bg-green-100')
    })

    it('should use yellow colors for PENDING status', () => {
      const config = PAYMENT_STATUS_CONFIG[PaymentStatus.PENDING]
      expect(config.color).toBe('text-yellow-700')
      expect(config.bgColor).toBe('bg-yellow-100')
    })

    it('should use red colors for FAILED status', () => {
      const config = PAYMENT_STATUS_CONFIG[PaymentStatus.FAILED]
      expect(config.color).toBe('text-red-700')
      expect(config.bgColor).toBe('bg-red-100')
    })

    it('should use gray colors for CANCELLED status', () => {
      const config = PAYMENT_STATUS_CONFIG[PaymentStatus.CANCELLED]
      expect(config.color).toBe('text-gray-700')
      expect(config.bgColor).toBe('bg-gray-100')
    })

    it('should use purple colors for REFUNDED status', () => {
      const config = PAYMENT_STATUS_CONFIG[PaymentStatus.REFUNDED]
      expect(config.color).toBe('text-purple-700')
      expect(config.bgColor).toBe('bg-purple-100')
    })

    it('should use orange colors for PARTIALLY_REFUNDED status', () => {
      const config = PAYMENT_STATUS_CONFIG[PaymentStatus.PARTIALLY_REFUNDED]
      expect(config.color).toBe('text-orange-700')
      expect(config.bgColor).toBe('bg-orange-100')
    })

    it('should use blue colors for AUTHORIZED status', () => {
      const config = PAYMENT_STATUS_CONFIG[PaymentStatus.AUTHORIZED]
      expect(config.color).toBe('text-blue-700')
      expect(config.bgColor).toBe('bg-blue-100')
    })

    it('should use indigo colors for CAPTURED status', () => {
      const config = PAYMENT_STATUS_CONFIG[PaymentStatus.CAPTURED]
      expect(config.color).toBe('text-indigo-700')
      expect(config.bgColor).toBe('bg-indigo-100')
    })

    it('should use emerald colors for COMPLETED status', () => {
      const config = PAYMENT_STATUS_CONFIG[PaymentStatus.COMPLETED]
      expect(config.color).toBe('text-emerald-700')
      expect(config.bgColor).toBe('bg-emerald-100')
    })

    it('should use amber colors for PARTIAL_CANCELLED status', () => {
      const config = PAYMENT_STATUS_CONFIG[PaymentStatus.PARTIAL_CANCELLED]
      expect(config.color).toBe('text-amber-700')
      expect(config.bgColor).toBe('bg-amber-100')
    })

    it('should use slate colors for EXPIRED status', () => {
      const config = PAYMENT_STATUS_CONFIG[PaymentStatus.EXPIRED]
      expect(config.color).toBe('text-slate-700')
      expect(config.bgColor).toBe('bg-slate-100')
    })

    it('should use consistent color intensity (700 for text)', () => {
      const allStatuses = Object.values(PaymentStatus)

      allStatuses.forEach((status) => {
        const color = PAYMENT_STATUS_CONFIG[status].color
        expect(color).toMatch(/-700$/)
      })
    })

    it('should use consistent background intensity (100 for bg)', () => {
      const allStatuses = Object.values(PaymentStatus)

      allStatuses.forEach((status) => {
        const bgColor = PAYMENT_STATUS_CONFIG[status].bgColor
        expect(bgColor).toMatch(/-100$/)
      })
    })
  })

  describe('Status descriptions', () => {
    it('should have meaningful Korean descriptions', () => {
      const allStatuses = Object.values(PaymentStatus)

      allStatuses.forEach((status) => {
        const description = PAYMENT_STATUS_CONFIG[status].description

        // Should contain Korean characters
        const hasKorean = /[\uAC00-\uD7A3]/.test(description)
        expect(hasKorean).toBe(true)

        // Should be descriptive (at least 5 characters)
        expect(description.length).toBeGreaterThanOrEqual(5)
      })
    })

    it('should return correct description for PAID status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.PAID].description).toBe(
        '결제가 정상적으로 완료되었습니다'
      )
    })

    it('should return correct description for PENDING status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.PENDING].description).toBe(
        '결제 처리 대기 중입니다'
      )
    })

    it('should return correct description for FAILED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.FAILED].description).toBe('결제가 실패했습니다')
    })

    it('should return correct description for CANCELLED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.CANCELLED].description).toBe(
        '결제가 취소되었습니다'
      )
    })

    it('should return correct description for REFUNDED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.REFUNDED].description).toBe(
        '전액 환불 처리되었습니다'
      )
    })

    it('should return correct description for EXPIRED status', () => {
      expect(PAYMENT_STATUS_CONFIG[PaymentStatus.EXPIRED].description).toBe(
        '결제 유효기간이 만료되었습니다'
      )
    })
  })
})

describe('getPaymentStatusConfig', () => {
  describe('Function behavior', () => {
    it('should return correct config for PAID status', () => {
      const config = getPaymentStatusConfig(PaymentStatus.PAID)

      expect(config.label).toBe('결제완료')
      expect(config.color).toBe('text-green-700')
      expect(config.bgColor).toBe('bg-green-100')
      expect(config.description).toBe('결제가 정상적으로 완료되었습니다')
    })

    it('should return correct config for PENDING status', () => {
      const config = getPaymentStatusConfig(PaymentStatus.PENDING)

      expect(config.label).toBe('대기중')
      expect(config.color).toBe('text-yellow-700')
      expect(config.bgColor).toBe('bg-yellow-100')
      expect(config.description).toBe('결제 처리 대기 중입니다')
    })

    it('should return correct config for FAILED status', () => {
      const config = getPaymentStatusConfig(PaymentStatus.FAILED)

      expect(config.label).toBe('실패')
      expect(config.color).toBe('text-red-700')
      expect(config.bgColor).toBe('bg-red-100')
      expect(config.description).toBe('결제가 실패했습니다')
    })

    it('should return correct config for CANCELLED status', () => {
      const config = getPaymentStatusConfig(PaymentStatus.CANCELLED)

      expect(config.label).toBe('취소됨')
      expect(config.color).toBe('text-gray-700')
      expect(config.bgColor).toBe('bg-gray-100')
      expect(config.description).toBe('결제가 취소되었습니다')
    })

    it('should return correct config for REFUNDED status', () => {
      const config = getPaymentStatusConfig(PaymentStatus.REFUNDED)

      expect(config.label).toBe('환불완료')
      expect(config.color).toBe('text-purple-700')
      expect(config.bgColor).toBe('bg-purple-100')
      expect(config.description).toBe('전액 환불 처리되었습니다')
    })

    it('should return correct config for PARTIALLY_REFUNDED status', () => {
      const config = getPaymentStatusConfig(PaymentStatus.PARTIALLY_REFUNDED)

      expect(config.label).toBe('부분환불')
      expect(config.color).toBe('text-orange-700')
      expect(config.bgColor).toBe('bg-orange-100')
      expect(config.description).toBe('부분 환불 처리되었습니다')
    })

    it('should return correct config for AUTHORIZED status', () => {
      const config = getPaymentStatusConfig(PaymentStatus.AUTHORIZED)

      expect(config.label).toBe('승인됨')
      expect(config.color).toBe('text-blue-700')
      expect(config.bgColor).toBe('bg-blue-100')
      expect(config.description).toBe('결제 승인되었습니다')
    })

    it('should return correct config for CAPTURED status', () => {
      const config = getPaymentStatusConfig(PaymentStatus.CAPTURED)

      expect(config.label).toBe('확정됨')
      expect(config.color).toBe('text-indigo-700')
      expect(config.bgColor).toBe('bg-indigo-100')
      expect(config.description).toBe('결제 확정되었습니다')
    })

    it('should return correct config for COMPLETED status', () => {
      const config = getPaymentStatusConfig(PaymentStatus.COMPLETED)

      expect(config.label).toBe('완료')
      expect(config.color).toBe('text-emerald-700')
      expect(config.bgColor).toBe('bg-emerald-100')
      expect(config.description).toBe('결제가 완료되었습니다')
    })

    it('should return correct config for PARTIAL_CANCELLED status', () => {
      const config = getPaymentStatusConfig(PaymentStatus.PARTIAL_CANCELLED)

      expect(config.label).toBe('부분취소')
      expect(config.color).toBe('text-amber-700')
      expect(config.bgColor).toBe('bg-amber-100')
      expect(config.description).toBe('부분 취소되었습니다')
    })

    it('should return correct config for EXPIRED status', () => {
      const config = getPaymentStatusConfig(PaymentStatus.EXPIRED)

      expect(config.label).toBe('만료')
      expect(config.color).toBe('text-slate-700')
      expect(config.bgColor).toBe('bg-slate-100')
      expect(config.description).toBe('결제 유효기간이 만료되었습니다')
    })

    it('should return PaymentStatusConfig type', () => {
      const config = getPaymentStatusConfig(PaymentStatus.PAID)

      // Type check through structure
      expect(config).toHaveProperty('label')
      expect(config).toHaveProperty('color')
      expect(config).toHaveProperty('bgColor')
      expect(config).toHaveProperty('description')
    })

    it('should return same object reference as in PAYMENT_STATUS_CONFIG', () => {
      const status = PaymentStatus.PAID
      const configFromFunction = getPaymentStatusConfig(status)
      const configFromMap = PAYMENT_STATUS_CONFIG[status]

      expect(configFromFunction).toBe(configFromMap)
    })
  })

  describe('Return value consistency', () => {
    it('should return consistent results for multiple calls', () => {
      const config1 = getPaymentStatusConfig(PaymentStatus.PAID)
      const config2 = getPaymentStatusConfig(PaymentStatus.PAID)

      expect(config1).toBe(config2)
      expect(config1.label).toBe(config2.label)
      expect(config1.color).toBe(config2.color)
    })

    it('should return different configs for different statuses', () => {
      const paidConfig = getPaymentStatusConfig(PaymentStatus.PAID)
      const failedConfig = getPaymentStatusConfig(PaymentStatus.FAILED)

      expect(paidConfig).not.toBe(failedConfig)
      expect(paidConfig.label).not.toBe(failedConfig.label)
      expect(paidConfig.color).not.toBe(failedConfig.color)
    })
  })
})

describe('Type safety', () => {
  it('should accept all PaymentStatus enum values', () => {
    const allStatuses = Object.values(PaymentStatus)

    allStatuses.forEach((status) => {
      // Should not throw
      expect(() => getPaymentStatusConfig(status)).not.toThrow()
    })
  })

  it('should return objects with all required PaymentStatusConfig properties', () => {
    const allStatuses = Object.values(PaymentStatus)

    allStatuses.forEach((status) => {
      const config = getPaymentStatusConfig(status)

      const requiredKeys: (keyof PaymentStatusConfig)[] = [
        'label',
        'color',
        'bgColor',
        'description',
      ]

      requiredKeys.forEach((key) => {
        expect(config).toHaveProperty(key)
        expect(config[key]).toBeDefined()
      })
    })
  })
})
