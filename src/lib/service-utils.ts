import { ServicePriceRange } from '@mimisalon/shared'

export interface PriceDisplayInfo {
  display: string
  hasRange: boolean
  count?: number
}

export interface ServiceWithPricing {
  priceRanges: ServicePriceRange[]
}

/**
 * 서비스 가격 범위를 계산하여 표시용 정보를 반환합니다.
 *
 * @param service - 가격 정보를 포함한 서비스 객체
 * @returns 가격 표시 정보 (display: 표시 문자열, hasRange: 범위 여부, count: 옵션 개수)
 *
 * @example
 * // FIXED 가격
 * getPriceDisplay({ priceType: 'FIXED', priceRanges: [{ price: 50000 }] })
 * // => { display: "50,000원", hasRange: false }
 *
 * // WEIGHT_BASED 가격
 * getPriceDisplay({
 *   priceType: 'WEIGHT_BASED',
 *   priceRanges: [{ price: 40000 }, { price: 60000 }]
 * })
 * // => { display: "40,000원 ~ 60,000원", hasRange: true, count: 2 }
 */
export function getPriceDisplay(service: ServiceWithPricing): PriceDisplayInfo {
  if (!service.priceRanges || service.priceRanges.length === 0) {
    return {
      display: '가격 미설정',
      hasRange: false,
    }
  }

  const prices = service.priceRanges.map((r) => r.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  if (minPrice === maxPrice) {
    return {
      display: `${minPrice.toLocaleString('ko-KR')}원`,
      hasRange: false,
    }
  }

  return {
    display: `${minPrice.toLocaleString('ko-KR')}원 ~ ${maxPrice.toLocaleString('ko-KR')}원`,
    hasRange: true,
    count: service.priceRanges.length,
  }
}
