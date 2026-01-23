/**
 * Redux Store 설정
 *
 * Redux Toolkit을 사용한 전역 상태 관리 스토어
 * RTK Query API 통합
 */

import { configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import bookingReducer from '@/features/booking/state/booking-slice'
import { bookingQueryApi } from '@/features/booking/api/booking-query-api'
import { dashboardApi } from '@/features/admin/state/dashboard-api-slice'
import { breedsApiSlice } from '@/features/admin/state/breeds-api-slice'
import { adminBookingsApi } from '@/features/admin-bookings/state/admin-bookings-api-slice'
import { adminGroomersApi } from '@/features/admin-groomers/state/admin-groomers-api-slice'
import { adminReviewsApi } from '@/features/admin-reviews/state/admin-reviews-api-slice'
import { adminPaymentsApi } from '@/features/admin-payments/state/admin-payments-api-slice'

/**
 * Redux 스토어 생성
 */
export const makeStore = () => {
  return configureStore({
    reducer: {
      booking: bookingReducer,
      // RTK Query API reducers
      [bookingQueryApi.reducerPath]: bookingQueryApi.reducer,
      [dashboardApi.reducerPath]: dashboardApi.reducer,
      [breedsApiSlice.reducerPath]: breedsApiSlice.reducer,
      [adminBookingsApi.reducerPath]: adminBookingsApi.reducer,
      [adminGroomersApi.reducerPath]: adminGroomersApi.reducer,
      [adminReviewsApi.reducerPath]: adminReviewsApi.reducer,
      [adminPaymentsApi.reducerPath]: adminPaymentsApi.reducer,
      // 다른 슬라이스를 여기에 추가
      // payment: paymentReducer,
      // user: userReducer,
    },
    middleware: (getDefaultMiddleware) => {
      // Add RTK Query middleware
      const middleware = getDefaultMiddleware()
        .concat(bookingQueryApi.middleware)
        .concat(dashboardApi.middleware)
        .concat(breedsApiSlice.middleware)
        .concat(adminBookingsApi.middleware)
        .concat(adminGroomersApi.middleware)
        .concat(adminReviewsApi.middleware)
        .concat(adminPaymentsApi.middleware)

      if (process.env.NODE_ENV === 'development') {
        const logger = createLogger({
          collapsed: false, // 로그를 펼친 상태로 표시 (모든 로그 보기)
          duration: true, // 액션 처리 시간 표시
          timestamp: true, // 타임스탬프 표시
          diff: true, // 상태 변경 diff 표시
          logErrors: true, // 에러 로깅
          predicate: () => true, // 모든 액션 로깅
        })
        middleware.push(logger)
      }

      return middleware
    },
    devTools: process.env.NODE_ENV !== 'production',
  })
}

/**
 * 스토어 타입 추론
 */
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
