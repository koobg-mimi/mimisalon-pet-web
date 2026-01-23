import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

/**
 * Format currency amount with locale
 * @param amount - The amount to format
 * @param currency - Currency code (default: KRW)
 * @returns Formatted currency string (e.g., "₩50,000")
 *
 * @example
 * formatCurrency(50000) // "₩50,000"
 * formatCurrency(50000, 'USD') // "$50,000.00"
 */
export function formatCurrency(amount: number, currency: string = 'KRW'): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

/**
 * Format date string to Korean locale with timezone conversion
 *
 * Converts ISO 8601 date strings to the user's local timezone and formats
 * them as "YYYY-MM-DD HH:mm". Times are displayed in the browser's timezone.
 *
 * @param dateString - ISO 8601 date string (with or without timezone) or null
 * @returns Formatted date string in local timezone, or "-" if null
 *
 * @example
 * // UTC time converted to local timezone (UTC+9 for Korea)
 * formatDate("2025-11-04T10:30:00Z") // "2025-11-04 19:30" (in Korea)
 * formatDate("2025-11-04T10:30:00Z") // "2025-11-04 10:30" (in UTC timezone)
 * formatDate(null) // "-"
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return '-'
  return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: ko })
}

/**
 * Get payment method display name in Korean
 * @param method - Payment method code
 * @returns Localized payment method name
 *
 * @example
 * getPaymentMethodName('CARD') // "신용/체크카드"
 * getPaymentMethodName('EASY_PAY') // "간편결제"
 */
export function getPaymentMethodName(method: string): string {
  const methodMap: Record<string, string> = {
    CARD: '신용/체크카드',
    VIRTUAL_ACCOUNT: '가상계좌',
    TRANSFER: '계좌이체',
    PHONE: '휴대폰',
    GIFT_CERTIFICATE: '상품권',
    EASY_PAY: '간편결제',
  }
  return methodMap[method] || method
}
