/**
 * 예약 관련 계산 유틸리티
 */

import { Pet } from '@/hooks/usePets'
import { calculateServicePrice } from '@/data/services'
import { BookingForm } from '../types/booking-form.types'

/**
 * 예약 총 금액 계산
 * @param formData - 예약 폼 데이터
 * @param pets - 반려동물 목록
 * @returns 총 예상 금액 (원)
 */
export function calculateTotalPrice(formData: BookingForm, pets: Pet[]): number {
  return formData.petServices.reduce((total, petService) => {
    const pet = pets.find((p) => p.id === petService.petId)

    // 서비스 비용 계산
    const servicesTotal = petService.services.reduce((serviceTotal, service) => {
      const price = calculateServicePrice(
        service,
        pet?.type,
        pet?.weight || 0,
        pet?.breedId || undefined
      )
      return serviceTotal + price
    }, 0)

    // 옵션 비용 계산
    const optionsTotal = petService.options.reduce((optionTotal, option) => {
      return optionTotal + option.price
    }, 0)

    return total + servicesTotal + optionsTotal
  }, 0)
}

/**
 * 예약 총 소요시간 계산
 * @param formData - 예약 폼 데이터
 * @returns 총 예상 소요시간 (분)
 */
export function calculateTotalDuration(formData: BookingForm): number {
  return formData.petServices.reduce((total, petService) => {
    return (
      total +
      petService.services.reduce((serviceTotal, service) => {
        return serviceTotal + service.duration
      }, 0)
    )
  }, 0)
}

/**
 * 특정 반려동물의 서비스 금액 계산
 * @param petId - 반려동물 ID
 * @param formData - 예약 폼 데이터
 * @param pets - 반려동물 목록
 * @returns 해당 반려동물의 서비스 총액 (원)
 */
export function calculatePetServicePrice(
  petId: string,
  formData: BookingForm,
  pets: Pet[]
): number {
  const petService = formData.petServices.find((ps) => ps.petId === petId)
  if (!petService) return 0

  const pet = pets.find((p) => p.id === petId)

  const servicesTotal = petService.services.reduce((sum, service) => {
    const price = calculateServicePrice(
      service,
      pet?.type,
      pet?.weight || 0,
      pet?.breedId || undefined
    )
    return sum + price
  }, 0)

  const optionsTotal = petService.options.reduce((sum, option) => {
    return sum + option.price
  }, 0)

  return servicesTotal + optionsTotal
}
