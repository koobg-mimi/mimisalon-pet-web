/**
 * 예약 폼 상태 관리 훅 (Redux 기반)
 *
 * Redux store에서 폼 상태를 관리하고 액션을 디스패치하는 훅
 */

import { useCallback } from 'react'
import { Pet } from '@prisma/client'
import { ServiceData } from '@/data/services'
import { ServiceOption } from '@/features/booking/components/ui/service-option-selector'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import {
  resetForm,
  togglePet,
  updateAddress,
  updateDate,
  updateGroomer,
  updateOptions,
  updateServices,
  updateSpecialRequests,
  updateTimeSlot,
} from '../state/booking-slice'

/**
 * 예약 폼 상태 관리 훅
 *
 * Redux store에서 formData를 가져오고 액션을 디스패치하는 래퍼 훅
 */
export function useBookingForm() {
  const dispatch = useAppDispatch()
  const formData = useAppSelector((state) => state.booking.formData)

  /**
   * 반려동물 선택/해제 토글
   */
  const handlePetToggle = useCallback(
    (pet: Pet) => {
      dispatch(togglePet(pet))
    },
    [dispatch]
  )

  /**
   * 반려동물의 서비스 변경
   */
  const handleServiceChange = useCallback(
    (petId: string, services: ServiceData[]) => {
      dispatch(updateServices({ petId, services }))
    },
    [dispatch]
  )

  /**
   * 반려동물의 옵션 변경
   */
  const handleOptionsChange = useCallback(
    (petId: string, options: ServiceOption[]) => {
      dispatch(updateOptions({ petId, options }))
    },
    [dispatch]
  )

  /**
   * 주소 선택
   */
  const handleAddressChange = useCallback(
    (addressId: string) => {
      dispatch(updateAddress(addressId))
    },
    [dispatch]
  )

  /**
   * 날짜 선택 (시간과 미용사 초기화)
   */
  const handleDateChange = useCallback(
    (date: string) => {
      dispatch(updateDate(date))
    },
    [dispatch]
  )

  /**
   * 미용사 선택 (시간 초기화)
   */
  const handleGroomerChange = useCallback(
    (groomerId: string) => {
      dispatch(updateGroomer(groomerId))
    },
    [dispatch]
  )

  /**
   * 시간대 선택
   */
  const handleTimeSlotChange = useCallback(
    (timeSlot: string) => {
      dispatch(updateTimeSlot(timeSlot))
    },
    [dispatch]
  )

  /**
   * 특별 요청사항 변경
   */
  const handleSpecialRequestsChange = useCallback(
    (specialRequests: string) => {
      dispatch(updateSpecialRequests(specialRequests))
    },
    [dispatch]
  )

  /**
   * 폼 초기화
   */
  const handleResetForm = useCallback(() => {
    dispatch(resetForm())
  }, [dispatch])

  return {
    formData,
    handlePetToggle,
    handleServiceChange,
    handleOptionsChange,
    handleAddressChange,
    handleDateChange,
    handleGroomerChange,
    handleTimeSlotChange,
    handleSpecialRequestsChange,
    resetForm: handleResetForm,
  }
}
