/**
 * 예약 Redux Slice
 *
 * 예약 도메인의 클라이언트 상태 관리
 * Redux Toolkit의 createSlice와 createAsyncThunk 사용
 */

import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { Pet } from '@prisma/client'
import { bookingApi, type InitializeBookingRequest } from '../api/booking-api'
import { BookingForm, BookingStep, initialBookingForm } from '../types/booking-form.types'
import { ServiceData } from '@/data/services'
import { ServiceOption } from '@/features/booking/components/ui/service-option-selector'

/**
 * 예약 필터 인터페이스
 */
export interface BookingFilters {
  /** 예약 상태 */
  status: string
  /** 시작 날짜 */
  startDate?: string
  /** 종료 날짜 */
  endDate?: string
}

/**
 * 예약 상태 인터페이스
 */
export interface BookingState {
  /** 선택된 예약 ID */
  selectedBookingId: string | null
  /** 예약 필터 */
  filters: BookingFilters
  /** 로딩 상태 */
  isLoading: boolean
  /** 에러 메시지 */
  error: string | null
  /** 현재 예약 생성 중 여부 */
  isCreating: boolean
  /** 현재 결제 초기화 중 여부 */
  isInitializingPayment: boolean
  /** 예약 폼 데이터 */
  formData: BookingForm
  /** 현재 예약 단계 */
  currentStep: BookingStep
  /** 결제 ID */
  paymentId: string | null
  /** 현재 미용사 페이지 */
  currentGroomerPage: number
}

/**
 * 초기 상태
 */
const initialState: BookingState = {
  selectedBookingId: null,
  filters: {
    status: 'all',
  },
  isLoading: false,
  error: null,
  isCreating: false,
  isInitializingPayment: false,
  formData: initialBookingForm,
  currentStep: 1,
  paymentId: null,
  currentGroomerPage: 1,
}

/**
 * 예약 초기화 비동기 액션
 *
 * 멱등성이 보장된 예약 생성
 */
export const initializeBooking = createAsyncThunk(
  'booking/initialize',
  async (request: InitializeBookingRequest, { rejectWithValue }) => {
    try {
      return await bookingApi.initializeBooking(request)
    } catch (error: any) {
      return rejectWithValue(error.message || '예약 초기화에 실패했습니다')
    }
  }
)

/**
 * 결제 초기화 비동기 액션
 */
export const initializePayment = createAsyncThunk(
  'booking/initializePayment',
  async (
    { bookingId, amount, orderName }: { bookingId: string; amount: number; orderName: string },
    { rejectWithValue }
  ) => {
    try {
      return await bookingApi.initializePayment({
        bookingId,
        amount,
        orderName,
      })
    } catch (error: any) {
      return rejectWithValue(error.message || '결제 초기화에 실패했습니다')
    }
  }
)

/**
 * 예약 취소 비동기 액션
 */
export const cancelBooking = createAsyncThunk(
  'booking/cancel',
  async ({ bookingId, reason }: { bookingId: string; reason?: string }, { rejectWithValue }) => {
    try {
      await bookingApi.cancelBooking(bookingId, reason)
      return bookingId
    } catch (error: any) {
      return rejectWithValue(error.message || '예약 취소에 실패했습니다')
    }
  }
)

/**
 * 예약 슬라이스
 */
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    /**
     * 예약 선택
     */
    selectBooking: (state, action: PayloadAction<string>) => {
      state.selectedBookingId = action.payload
    },

    /**
     * 예약 선택 해제
     */
    clearSelectedBooking: (state) => {
      state.selectedBookingId = null
    },

    /**
     * 필터 업데이트
     */
    updateFilters: (state, action: PayloadAction<Partial<BookingFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },

    /**
     * 필터 초기화
     */
    resetFilters: (state) => {
      state.filters = { status: 'all' }
    },

    /**
     * 에러 초기화
     */
    clearError: (state) => {
      state.error = null
    },

    // ===== 폼 관련 액션 =====

    /**
     * 반려동물 선택/해제 토글
     */
    togglePet: (state, action: PayloadAction<Pet>) => {
      const pet = action.payload
      const existingIndex = state.formData.petServices.findIndex((ps) => ps.petId === pet.id)

      if (existingIndex >= 0) {
        // 선택 해제
        state.formData.petServices.splice(existingIndex, 1)
      } else {
        // 선택 (빈 서비스와 옵션 배열로 초기화)
        state.formData.petServices.push({
          petId: pet.id,
          services: [],
          options: [],
        })
      }
    },

    /**
     * 반려동물의 서비스 변경
     */
    updateServices: (state, action: PayloadAction<{ petId: string; services: ServiceData[] }>) => {
      const { petId, services } = action.payload
      const petService = state.formData.petServices.find((ps) => ps.petId === petId)
      if (petService) {
        petService.services = services
      }
    },

    /**
     * 반려동물의 옵션 변경
     */
    updateOptions: (state, action: PayloadAction<{ petId: string; options: ServiceOption[] }>) => {
      const { petId, options } = action.payload
      const petService = state.formData.petServices.find((ps) => ps.petId === petId)
      if (petService) {
        petService.options = options
      }
    },

    /**
     * 주소 선택
     */
    updateAddress: (state, action: PayloadAction<string>) => {
      state.formData.addressId = action.payload
    },

    /**
     * 날짜 선택 (시간과 미용사 초기화)
     */
    updateDate: (state, action: PayloadAction<string>) => {
      state.formData.date = action.payload
      state.formData.timeSlot = ''
      state.formData.groomerId = ''
    },

    /**
     * 미용사 선택 (시간 초기화)
     */
    updateGroomer: (state, action: PayloadAction<string>) => {
      state.formData.groomerId = action.payload
      state.formData.timeSlot = ''
    },

    /**
     * 시간대 선택
     */
    updateTimeSlot: (state, action: PayloadAction<string>) => {
      state.formData.timeSlot = action.payload
    },

    /**
     * 특별 요청사항 변경
     */
    updateSpecialRequests: (state, action: PayloadAction<string>) => {
      state.formData.specialRequests = action.payload
    },

    /**
     * 폼 초기화
     */
    resetForm: (state) => {
      state.formData = initialBookingForm
      state.currentStep = 1
      state.paymentId = null
      state.currentGroomerPage = 1
    },

    // ===== 단계 관련 액션 =====

    /**
     * 다음 단계로 이동
     */
    nextStep: (state) => {
      if (state.currentStep < 4) {
        state.currentStep = (state.currentStep + 1) as BookingStep
      }
    },

    /**
     * 이전 단계로 이동
     */
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep = (state.currentStep - 1) as BookingStep
      }
    },

    /**
     * 특정 단계로 이동
     */
    goToStep: (state, action: PayloadAction<BookingStep>) => {
      state.currentStep = action.payload
    },

    // ===== 기타 액션 =====

    /**
     * 미용사 페이지 업데이트
     */
    updateGroomerPage: (state, action: PayloadAction<number>) => {
      state.currentGroomerPage = action.payload
    },

    /**
     * 결제 ID 설정
     */
    setPaymentId: (state, action: PayloadAction<string>) => {
      state.paymentId = action.payload
    },
  },
  extraReducers: (builder) => {
    // 예약 초기화 처리
    builder
      .addCase(initializeBooking.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(initializeBooking.fulfilled, (state, action) => {
        state.isCreating = false
        state.selectedBookingId = action.payload.bookingId
      })
      .addCase(initializeBooking.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload as string
      })

    // 결제 초기화 처리
    builder
      .addCase(initializePayment.pending, (state) => {
        state.isInitializingPayment = true
        state.error = null
      })
      .addCase(initializePayment.fulfilled, (state, action) => {
        state.isInitializingPayment = false
        state.paymentId = action.payload.paymentId
      })
      .addCase(initializePayment.rejected, (state, action) => {
        state.isInitializingPayment = false
        state.error = action.payload as string
      })

    // 예약 취소 처리
    builder
      .addCase(cancelBooking.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(cancelBooking.fulfilled, (state) => {
        state.isLoading = false
        // 취소된 예약이 현재 선택된 예약이면 선택 해제
        state.selectedBookingId = null
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

// 액션 내보내기
export const {
  selectBooking,
  togglePet,
  updateServices,
  updateOptions,
  updateAddress,
  updateDate,
  updateGroomer,
  updateTimeSlot,
  updateSpecialRequests,
  resetForm,
  nextStep,
  prevStep,
  goToStep,
  updateGroomerPage,
  setPaymentId,
} = bookingSlice.actions

// 리듀서 내보내기 (기본 export)
export default bookingSlice.reducer

/**
 * 셀렉터
 * Note: Selectors have been removed as they were unused. If needed in the future,
 * consider using createSelector from @reduxjs/toolkit for memoization.
 */
