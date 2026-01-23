// DB 스키마 기반 서비스 데이터 타입 정의

export interface ServicePriceRange {
  petType: string
  minWeight: number | null
  maxWeight: number | null
  price: number
  selectedBreedIds?: string[]
}

export interface ServiceData {
  id: string
  name: string
  description: string
  price: number // Calculated price from API
  duration: number // 분 단위
  petTypes: ('DOG' | 'CAT' | 'OTHER')[]
  priceRanges: ServicePriceRange[]
  requiresVaccination: boolean
  bookingCount: number
  icon: string
  isPopular: boolean
  isRecommended: boolean
  createdAt: string
  updatedAt: string
}

// 서비스 fetch 함수
export const fetchAvailableServices = async (): Promise<ServiceData[]> => {
  try {
    const response = await fetch('/api/customer/services')
    if (!response.ok) {
      throw new Error('Failed to fetch services')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}

// 반려동물 타입에 따른 서비스 필터링
// API가 이미 pet의 breed를 기반으로 필터링했으므로 모든 서비스를 그대로 반환
export const getAvailableServicesForPet = (
  services: ServiceData[],
  petType: 'DOG' | 'CAT'
): ServiceData[] => {
  // API에서 이미 breed 기반으로 필터링되었으므로 모든 서비스 반환
  return services
}

// 서비스 가격 반환 (API에서 이미 계산됨)
export const calculateServicePrice = (
  service: ServiceData,
  petType?: string,
  petWeight?: number,
  petBreedId?: string
): number => {
  // API가 이미 pet 정보를 기반으로 가격을 계산하여 반환하므로
  // 단순히 service.price를 반환
  return service.price
}

// 서비스 정렬 함수
export const sortServices = (services: ServiceData[]): ServiceData[] => {
  return services.sort((a, b) => {
    // 추천 서비스 우선
    if (a.isRecommended && !b.isRecommended) return -1
    if (!a.isRecommended && b.isRecommended) return 1

    // 인기 서비스 다음
    if (a.isPopular && !b.isPopular) return -1
    if (!a.isPopular && b.isPopular) return 1

    // 예약 횟수 많은 순
    if (a.bookingCount !== b.bookingCount) {
      return b.bookingCount - a.bookingCount
    }

    // 이름 순
    return a.name.localeCompare(b.name, 'ko')
  })
}
