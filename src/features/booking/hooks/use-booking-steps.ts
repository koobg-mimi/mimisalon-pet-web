/**
 * 예약 단계 관리 훅 (Redux 기반)
 *
 * Redux store에서 단계 상태를 관리하고 액션을 디스패치하는 훅
 */

import { useCallback } from 'react'
import { BookingStep } from '../types/booking-form.types'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { goToStep as goToStepAction, nextStep, prevStep } from '../state/booking-slice'

/**
 * 예약 단계 네비게이션 훅
 *
 * Redux store에서 currentStep을 가져오고 액션을 디스패치하는 래퍼 훅
 */
export function useBookingSteps() {
  const dispatch = useAppDispatch()
  const currentStep = useAppSelector((state) => state.booking.currentStep)

  /**
   * 다음 단계로 이동
   */
  const handleNextStep = useCallback(() => {
    // 모바일 UX 향상을 위해 스크롤 상단으로
    window.scrollTo({ top: 0, behavior: 'smooth' })
    dispatch(nextStep())
  }, [dispatch])

  /**
   * 이전 단계로 이동
   */
  const handlePrevStep = useCallback(() => {
    dispatch(prevStep())
  }, [dispatch])

  /**
   * 특정 단계로 이동
   */
  const goToStep = useCallback(
    (step: BookingStep) => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      dispatch(goToStepAction(step))
    },
    [dispatch]
  )

  return {
    currentStep,
    handleNextStep,
    handlePrevStep,
    goToStep,
  }
}
