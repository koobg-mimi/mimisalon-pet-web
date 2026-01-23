/**
 * 예약 폼 검증 유틸리티
 */

import { Pet } from '@prisma/client'
import { BookingForm, BookingStep } from '../types/booking-form.types'

/**
 * 단계별 진행 가능 여부 확인
 * @param step - 현재 단계
 * @param formData - 예약 폼 데이터
 * @returns 다음 단계로 진행 가능 여부
 */
export function canProceedToNextStep(step: BookingStep, formData: BookingForm): boolean {
  switch (step) {
    case 1:
      // 반려동물이 선택되었고, 모든 선택된 반려동물이 최소 1개 이상의 서비스를 가져야 함
      return (
        formData.petServices.length > 0 &&
        formData.petServices.every((ps) => ps.services.length > 0)
      )
    case 2:
      return !!formData.addressId
    case 3:
      return !!formData.date && !!formData.timeSlot && !!formData.groomerId
    default:
      return true
  }
}

/**
 * 단계별 검증 실패 메시지 반환
 * @param step - 현재 단계
 * @param formData - 예약 폼 데이터
 * @param pets - 반려동물 목록
 * @returns 검증 실패 메시지 (통과 시 빈 문자열)
 */
export function getValidationMessage(
  step: BookingStep,
  formData: BookingForm,
  pets: Pet[]
): string {
  switch (step) {
    case 1:
      if (formData.petServices.length === 0) {
        return '반려동물을 선택해주세요.'
      }
      const petsWithoutServices = formData.petServices.filter((ps) => ps.services.length === 0)
      if (petsWithoutServices.length > 0) {
        const petNames = petsWithoutServices
          .map((ps) => {
            const pet = pets.find((p) => p.id === ps.petId)
            return pet?.name || '선택된 반려동물'
          })
          .join(', ')
        return `${petNames}의 서비스를 선택해주세요.`
      }
      return ''
    case 2:
      if (!formData.addressId) return '주소를 선택해주세요.'
      return ''
    case 3:
      if (!formData.date) return '날짜를 선택해주세요.'
      if (!formData.groomerId) return '미용사를 선택해주세요.'
      if (!formData.timeSlot) return '시간을 선택해주세요.'
      return ''
    default:
      return ''
  }
}

/**
 * 특정 반려동물의 서비스 선택 여부 확인
 * @param petId - 반려동물 ID
 * @param formData - 예약 폼 데이터
 * @returns 서비스 선택 여부
 */
export function hasPetServices(petId: string, formData: BookingForm): boolean {
  const petService = formData.petServices.find((ps) => ps.petId === petId)
  return !!petService && petService.services.length > 0
}

/**
 * 반려동물 선택 여부 확인
 * @param petId - 반려동물 ID
 * @param formData - 예약 폼 데이터
 * @returns 선택 여부
 */
export function isPetSelected(petId: string, formData: BookingForm): boolean {
  return formData.petServices.some((ps) => ps.petId === petId)
}
