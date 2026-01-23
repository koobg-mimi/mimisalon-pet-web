export const FILTER_OPTIONS = ['ALL', 'PAID', 'PENDING', 'FAILED', 'REFUNDED'] as const

export type FilterType = (typeof FILTER_OPTIONS)[number]

export const FILTER_STATUS_MAP: Record<FilterType, string[] | null> = {
  ALL: null,
  PAID: ['PAID', 'COMPLETED', 'CAPTURED'],
  PENDING: ['PENDING', 'AUTHORIZED'],
  FAILED: ['FAILED', 'CANCELLED', 'EXPIRED'],
  REFUNDED: ['REFUNDED', 'PARTIALLY_REFUNDED', 'PARTIAL_CANCELLED'],
}
