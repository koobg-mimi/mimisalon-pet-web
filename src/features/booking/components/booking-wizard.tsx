/**
 * 예약 위저드 메인 컴포넌트
 * 4단계 예약 프로세스를 관리하고 조합
 */

'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Pet } from '@/hooks/usePets'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { nanoid } from 'nanoid'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useBookingData } from '@/hooks/useBookingData'
import { useBookingForm } from '../hooks/use-booking-form'
import { useBookingSteps } from '../hooks/use-booking-steps'
import { canProceedToNextStep, getValidationMessage } from '../utils/booking-validation'
import { calculateTotalDuration, calculateTotalPrice } from '../utils/booking-calculations'
import { PetSelectionStep } from './pet-selection-step'
import { AddressSelectionStep } from './address-selection-step'
import { DateTimeGroomerStep } from './datetime-groomer-step'
import { PaymentStep } from './payment-step'
import { initializeBooking, initializePayment, updateGroomerPage, setPaymentComplating } from '../state/booking-slice'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import type { UserResponse } from '@/app/api/auth/me/route'

interface BookingWizardProps {
  /** 반려동물 목록 */
  pets: Pet[]
  /** 프로필 정보 */
  profile: UserResponse
}

/**
 * 예약 위저드 컴포넌트
 * 4단계 예약 프로세스 전체를 관리
 */
export function BookingWizard({ pets, profile }: BookingWizardProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()

  // Redux 상태
  const isCreating = useAppSelector((state) => state.booking.isCreating)
  const isInitializingPayment = useAppSelector((state) => state.booking.isInitializingPayment)
  const bookingId = useAppSelector((state) => state.booking.selectedBookingId)
  const paymentId = useAppSelector((state) => state.booking.paymentId)
  const currentGroomerPage = useAppSelector((state) => state.booking.currentGroomerPage)

  // 폼 상태 관리
  const {
    formData,
    handleAddressChange,
    handleDateChange,
    handleGroomerChange,
    handleTimeSlotChange,
    handleSpecialRequestsChange,
  } = useBookingForm()

  // 단계 관리
  const { currentStep, handleNextStep, handlePrevStep } = useBookingSteps()

  // 데이터 조회
  const {
    savedAddresses,
    timeSlots: availableTimeSlots,
    groomers,
    groomerPagination,
    isInitialLoading: isLoading,
    isLoadingGroomers,
  } = useBookingData({
    date: formData.date,
    addressId: formData.addressId,
    currentPage: currentGroomerPage,
    enabled: !!profile,
  })

  // 기본 주소 자동 선택
  useEffect(() => {
    if (savedAddresses.length > 0 && !formData.addressId) {
      const defaultAddress = savedAddresses.find((addr: any) => addr.isDefault)
      if (defaultAddress) {
        handleAddressChange(defaultAddress.id)
      }
    }
  }, [savedAddresses, formData.addressId, handleAddressChange])

  /**
   * 날짜 변경 핸들러 (확장)
   */
  const handleDateChangeWithReset = useCallback(
    async (selectedDate: Date | undefined) => {
      if (!selectedDate) return

      const dateString = format(selectedDate, 'yyyy-MM-dd', { locale: ko })
      handleDateChange(dateString)
      dispatch(updateGroomerPage(1))
    },
    [handleDateChange, dispatch]
  )

  /**
   * 미용사 선택 핸들러
   */
  const handleGroomerSelectWithState = useCallback(
    (groomerId: string) => {
      handleGroomerChange(groomerId)
    },
    [handleGroomerChange]
  )

  /**
   * 결제 요청 핸들러
   */
  const handlePaymentRequest = useCallback(async () => {
    if (isCreating || isInitializingPayment) return null

    // 전화번호 검증
    const customerPhone = profile?.phoneNumber?.trim()
    if (!customerPhone) {
      alert('결제를 진행하려면 프로필에서 전화번호를 등록해주세요.')
      router.push('/profile')
      return null
    }

    const idempotencyKey = `booking-${nanoid()}`

    try {
      const totalAmount = calculateTotalPrice(formData, pets)
      const orderName =
        formData.petServices.length === 1
          ? `${pets.find((p) => p.id === formData.petServices[0].petId)?.name} 미용서비스`
          : `${formData.petServices.length}마리 반려동물 미용서비스`

      // 1. 예약 초기화 (Redux thunk)
      const bookingResult = await dispatch(
        initializeBooking({
          idempotencyKey,
          petServices: formData.petServices.map((ps) => ({
            petId: ps.petId,
            services: ps.services.map((service) => ({
              id: service.id,
              name: service.name,
              price: service.price,
              duration: service.duration,
            })),
            options: ps.options.map((option) => ({
              id: option.id,
              name: option.name,
              price: option.price,
            })),
          })),
          addressId: formData.addressId,
          groomerId: formData.groomerId,
          date: formData.date,
          timeSlot: formData.timeSlot,
          specialRequests: formData.specialRequests,
        })
      ).unwrap()

      const newBookingId = bookingResult.bookingId

      // 이미 처리된 예약이면 리다이렉트
      if (bookingResult.isExisting && bookingResult.status !== 'FIRST_PAYMENT_PENDING') {
        router.push(`/booking/${newBookingId}/confirmation`)
        return null
      }

      // 2. 결제 초기화 (Redux thunk - paymentId는 자동으로 Redux state에 저장됨)
      const paymentResult = await dispatch(
        initializePayment({
          bookingId: newBookingId,
          amount: totalAmount,
          orderName,
        })
      ).unwrap()

      const newPaymentId = paymentResult.paymentId

      return {
        paymentId: newPaymentId,
        bookingId: newBookingId,
        amount: totalAmount,
        orderName,
      }
    } catch (error: any) {
      if (error.code === 'BOOKING_CONFLICT') {
        alert(error.message || '선택한 시간대가 이미 예약되었습니다')
      } else {
        alert(error.message || '예약 생성에 실패했습니다')
      }
      return null
    }
  }, [isCreating, isInitializingPayment, profile, formData, pets, router, dispatch])

  /**
   * 결제 성공 핸들러
   */
  const handlePaymentSuccess = useCallback(async () => {
    if (bookingId) {
      try {
        // 로딩 상태 시작
        dispatch(setPaymentComplating(true))
        // 예약 완료 페이지로 이동
        await router.push(`/booking/${bookingId}/confirmation`)
      } catch (error) {
        console.error('[Payment] Redirect failed:', error)
        alert('결제는 완료되었으나 페이지 이동에 실패했습니다. 예약 내역에서 확인해주세요.')
      } finally {
        // 로딩 상태 종료
        dispatch(setPaymentComplating(false))
      }
    } else {
      console.error('[Payment] Missing bookingId after success')
      alert('결제가 완료되었으나 정보를 찾을 수 없습니다. 고객센터로 문의해주세요.')
    }
  }, [bookingId, router, dispatch])

  /**
   * 결제 에러 핸들러
   */
  const handlePaymentError = useCallback((error: string) => {
    console.error('Payment error:', error)
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const totalAmount = calculateTotalPrice(formData, pets)
  const orderName =
    formData.petServices.length === 1
      ? `${pets.find((p) => p.id === formData.petServices[0].petId)?.name} 미용서비스`
      : `${formData.petServices.length}마리 반려동물 미용서비스`

  return (
    <div className="mx-auto max-w-4xl">
      {/* 단계별 컴포넌트 렌더링 */}
      {currentStep === 1 && <PetSelectionStep pets={pets} />}

      {currentStep === 2 && <AddressSelectionStep savedAddresses={savedAddresses} />}

      {currentStep === 3 && (
        <DateTimeGroomerStep
          estimatedDuration={calculateTotalDuration(formData)}
          groomers={groomers}
          isLoadingGroomers={isLoadingGroomers}
          availableTimeSlots={availableTimeSlots}
          groomerPagination={groomerPagination}
          onDateChange={handleDateChangeWithReset}
          onGroomerSelect={handleGroomerSelectWithState}
          onTimeSelect={handleTimeSlotChange}
          onGroomerPageChange={(page) => dispatch(updateGroomerPage(page))}
          onSpecialRequestsChange={handleSpecialRequestsChange}
        />
      )}

      {currentStep === 4 && (
        <PaymentStep
          pets={pets}
          profile={profile}
          totalAmount={totalAmount}
          orderName={orderName}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}

      {/* 검증 메시지 */}
      {!canProceedToNextStep(currentStep, formData) &&
        getValidationMessage(currentStep, formData, pets) && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center">
              <svg
                className="mr-2 h-5 w-5 flex-shrink-0 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-medium text-red-700">
                {getValidationMessage(currentStep, formData, pets)}
              </p>
            </div>
          </div>
        )}

      {/* 네비게이션 버튼 */}
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 1}>
          이전
        </Button>
        {currentStep < 4 ? (
          <Button onClick={handleNextStep} disabled={!canProceedToNextStep(currentStep, formData)}>
            다음
          </Button>
        ) : !paymentId ? (
          <Button
            onClick={handlePaymentRequest}
            disabled={isCreating || isInitializingPayment}
            size="lg"
            className="px-8"
          >
            {isCreating || isInitializingPayment ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            결제 진행하기
          </Button>
        ) : null}
      </div>
    </div>
  )
}
