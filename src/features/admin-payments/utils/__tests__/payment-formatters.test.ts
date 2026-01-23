import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, getPaymentMethodName } from '../payment-formatters'

describe('payment-formatters', () => {
  describe('formatCurrency', () => {
    it('should format KRW currency correctly', () => {
      const result = formatCurrency(50000, 'KRW')
      expect(result).toContain('50,000')
      expect(result).toContain('₩')
    })

    it('should use KRW as default currency', () => {
      const result = formatCurrency(50000)
      expect(result).toContain('50,000')
      expect(result).toContain('₩')
    })

    it('should format USD currency correctly', () => {
      const result = formatCurrency(50000, 'USD')
      expect(result).toContain('50,000')
      expect(result).toContain('$')
    })

    it('should handle zero amount', () => {
      const result = formatCurrency(0)
      expect(result).toContain('0')
    })

    it('should handle large amounts', () => {
      const result = formatCurrency(1000000)
      expect(result).toContain('1,000,000')
    })

    it('should handle decimal amounts', () => {
      const result = formatCurrency(50000.5)
      expect(result).toBeDefined()
    })
  })

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const result = formatDate('2025-11-04T10:30:00.000Z')
      expect(result).toMatch(/2025-11-04/)
      expect(result).toMatch(/\d{2}:\d{2}/)
    })

    it('should return "-" for null', () => {
      const result = formatDate(null)
      expect(result).toBe('-')
    })

    it('should handle different date formats', () => {
      const result = formatDate('2025-01-15T08:45:30.123Z')
      expect(result).toMatch(/2025-01-15/)
    })

    it('should format time correctly', () => {
      const result = formatDate('2025-11-04T23:59:59.000Z')
      // The time will be converted to local timezone, so just check it contains a time
      expect(result).toMatch(/\d{2}:\d{2}/)
    })
  })

  describe('getPaymentMethodName', () => {
    it('should return correct Korean name for CARD', () => {
      expect(getPaymentMethodName('CARD')).toBe('신용/체크카드')
    })

    it('should return correct Korean name for VIRTUAL_ACCOUNT', () => {
      expect(getPaymentMethodName('VIRTUAL_ACCOUNT')).toBe('가상계좌')
    })

    it('should return correct Korean name for TRANSFER', () => {
      expect(getPaymentMethodName('TRANSFER')).toBe('계좌이체')
    })

    it('should return correct Korean name for PHONE', () => {
      expect(getPaymentMethodName('PHONE')).toBe('휴대폰')
    })

    it('should return correct Korean name for GIFT_CERTIFICATE', () => {
      expect(getPaymentMethodName('GIFT_CERTIFICATE')).toBe('상품권')
    })

    it('should return correct Korean name for EASY_PAY', () => {
      expect(getPaymentMethodName('EASY_PAY')).toBe('간편결제')
    })

    it('should return original method name for unknown method', () => {
      expect(getPaymentMethodName('UNKNOWN_METHOD')).toBe('UNKNOWN_METHOD')
    })

    it('should handle empty string', () => {
      expect(getPaymentMethodName('')).toBe('')
    })
  })
})
