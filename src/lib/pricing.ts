import { ServicePriceRange } from '@/types/service';

export interface PetInfo {
  type: 'DOG' | 'CAT';
  weight: number;
  breedId?: string;
}

export interface ServiceInfo {
  id: string;
  name: string;
  priceRanges: ServicePriceRange[];
}

/**
 * 서비스의 기본 가격을 priceRanges에서 계산합니다.
 * @param service 서비스 정보
 * @returns 기본 가격 (최소 가격)
 */
export function getBasePrice(service: ServiceInfo): number {
  if (!service.priceRanges || service.priceRanges.length === 0) {
    throw new Error(`Service ${service.id} has no price ranges`);
  }
  return Math.min(...service.priceRanges.map((r) => r.price));
}

/**
 * 서비스와 펫 정보를 기반으로 가격을 계산합니다.
 *
 * Price Matching Rules:
 * 1. First, check if breed-specific pricing exists
 * 2. Then check weight-based pricing:
 *    - Weight ranges are INCLUSIVE on both ends: [minWeight, maxWeight]
 *    - NULL minWeight is treated as 0kg (no lower limit)
 *    - NULL maxWeight means no upper limit (e.g., "10kg and above")
 * 3. Fall back to base price if no match found
 *
 * @param service 서비스 정보
 * @param pet 펫 정보
 * @returns 계산된 가격
 */
export function calculateServicePrice(service: ServiceInfo, pet: PetInfo): number {
  if (!service.priceRanges || service.priceRanges.length === 0) {
    throw new Error(`Service ${service.id} has no price ranges`);
  }

  // 해당 펫 타입의 가격 구간 필터링
  const applicableRanges = service.priceRanges.filter((range) => range.petType === pet.type);

  // 1. 품종별 가격이 설정된 경우 우선 확인
  if (pet.breedId) {
    const breedSpecificRange = applicableRanges.find((range) => {
      // selectedBreedIds가 있고 현재 품종이 포함된 경우
      if (range.selectedBreedIds && range.selectedBreedIds.length > 0) {
        if (range.selectedBreedIds.includes(pet.breedId!)) {
          // 무게 조건 확인
          const minWeight = range.minWeight ?? 0;
          const isMinWeightValid = pet.weight >= minWeight;
          const isMaxWeightValid = range.maxWeight == null || pet.weight <= range.maxWeight;
          return isMinWeightValid && isMaxWeightValid;
        }
      }
      return false;
    });

    if (breedSpecificRange) {
      return breedSpecificRange.price;
    }
  }

  // 2. 품종별 가격이 없거나 매치되지 않으면 일반 무게 기반 가격 확인
  const matchingRange = applicableRanges.find((range) => {
    // 품종이 지정되지 않은 가격 범위만 확인 (일반 가격)
    if (!range.selectedBreedIds || range.selectedBreedIds.length === 0) {
      const minWeight = range.minWeight ?? 0;
      const isMinWeightValid = pet.weight >= minWeight;
      const isMaxWeightValid = range.maxWeight == null || pet.weight <= range.maxWeight;
      return isMinWeightValid && isMaxWeightValid;
    }
    return false;
  });

  if (matchingRange) {
    return matchingRange.price;
  }

  // 3. 매칭되는 구간이 없으면 펫 타입에 관계없이 모든 구간에서 찾기
  const fallbackRange = service.priceRanges.find((range) => {
    const minWeight = range.minWeight ?? 0;
    const isMinWeightValid = pet.weight >= minWeight;
    const isMaxWeightValid = range.maxWeight == null || pet.weight <= range.maxWeight;
    return isMinWeightValid && isMaxWeightValid;
  });

  if (fallbackRange) {
    return fallbackRange.price;
  }

  // 기본값: 최소 가격 반환
  return getBasePrice(service);
}

/**
 * 여러 서비스의 총 가격을 계산합니다.
 * @param services 서비스 목록
 * @param pet 펫 정보
 * @returns 총 가격
 */
export function calculateTotalPrice(services: ServiceInfo[], pet: PetInfo): number {
  return services.reduce((total, service) => {
    return total + calculateServicePrice(service, pet);
  }, 0);
}

/**
 * 가격을 한국 원화 포맷으로 변환합니다.
 * @param price 가격
 * @returns 포맷된 가격 문자열
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * 펫의 크기를 무게 기준으로 판단합니다.
 * @param weight 펫의 무게 (kg)
 * @param petType 펫의 종류
 * @returns 펫의 크기 카테고리
 */
export function getPetSizeByWeight(
  weight: number,
  petType: 'DOG' | 'CAT'
): 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE' {
  if (petType === 'CAT') {
    if (weight <= 4) return 'SMALL';
    if (weight <= 6) return 'MEDIUM';
    if (weight <= 8) return 'LARGE';
    return 'EXTRA_LARGE';
  } else {
    // DOG
    if (weight <= 7) return 'SMALL';
    if (weight <= 25) return 'MEDIUM';
    if (weight <= 40) return 'LARGE';
    return 'EXTRA_LARGE';
  }
}

/**
 * 무게 구간의 표시 텍스트를 생성합니다.
 * @param minWeight 최소 무게
 * @param maxWeight 최대 무게 (null이면 무제한)
 * @returns 무게 구간 텍스트
 */
export function formatWeightRange(minWeight: number, maxWeight: number | null): string {
  if (maxWeight === null) {
    return `${minWeight}kg 이상`;
  }
  if (minWeight === 0) {
    return `${maxWeight}kg 이하`;
  }
  return `${minWeight}kg - ${maxWeight}kg`;
}

/**
 * 서비스 가격 정보의 요약을 생성합니다.
 * @param service 서비스 정보
 * @returns 가격 정보 요약
 */
export function getServicePricingSummary(service: ServiceInfo): string {
  if (!service.priceRanges || service.priceRanges.length === 0) {
    throw new Error(`Service ${service.id} has no price ranges`);
  }

  const minPrice = Math.min(...service.priceRanges.map((r) => r.price));
  const maxPrice = Math.max(...service.priceRanges.map((r) => r.price));

  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  }

  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}
