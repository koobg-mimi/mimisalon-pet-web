/**
 * useBookingDetails Hook Unit Tests
 *
 * 예약 상세 정보 조회 훅 단위 테스트
 */

import React from 'react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useBookingDetails } from '../hooks/useBookingDetails'
import type { BookingInfo } from '../types/additional-payment.types'

// 테스트용 예약 정보 모킹
const mockBookingInfo: BookingInfo = {
  id: 'booking-123',
  pet: {
    name: '뽀삐',
    breed: '푸들',
  },
  service: {
    name: '전체 미용',
  },
  groomer: {
    name: '김미용사',
  },
  location: {
    name: '강남점',
    address: '서울시 강남구',
  },
  date: '2025-10-30',
  time: '10:00',
  originalAmount: 50000,
  additionalCharges: [
    {
      id: 'charge-1',
      name: '털 엉킴 해결',
      amount: 10000,
      quantity: 1,
      total: 10000,
      description: '추가 작업',
    },
  ],
  status: 'COMPLETED',
}

describe('useBookingDetails', () => {
  let queryClient: QueryClient

  // 각 테스트 전에 QueryClient 초기화
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // 테스트에서는 재시도하지 않음
        },
      },
    })
    // fetch 모킹 초기화
    global.fetch = vi.fn()
  })

  // 각 테스트 후 정리
  afterEach(() => {
    queryClient.clear()
    vi.resetAllMocks()
  })

  // 테스트용 래퍼 컴포넌트 생성 함수
  const createWrapper = (client: QueryClient) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )
    Wrapper.displayName = 'TestQueryClientWrapper'
    return Wrapper
  }

  it('초기 상태가 올바르게 설정되어야 함', () => {
    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        useBookingDetails({
          bookingId: 'booking-123',
          hasSession: false, // 세션 없음 -> 쿼리 비활성화
          isCustomer: false,
        }),
      { wrapper }
    )

    expect(result.current.booking).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('세션이 없으면 쿼리가 실행되지 않아야 함', () => {
    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        useBookingDetails({
          bookingId: 'booking-123',
          hasSession: false,
          isCustomer: true,
        }),
      { wrapper }
    )

    expect(result.current.isLoading).toBe(false)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('CUSTOMER 역할이 아니면 쿼리가 실행되지 않아야 함', () => {
    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        useBookingDetails({
          bookingId: 'booking-123',
          hasSession: true,
          isCustomer: false,
        }),
      { wrapper }
    )

    expect(result.current.isLoading).toBe(false)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('bookingId가 없으면 쿼리가 실행되지 않아야 함', () => {
    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        useBookingDetails({
          bookingId: '',
          hasSession: true,
          isCustomer: true,
        }),
      { wrapper }
    )

    expect(result.current.isLoading).toBe(false)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('모든 조건이 만족되면 예약 정보를 성공적으로 조회해야 함', async () => {
    // fetch 성공 모킹
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockBookingInfo,
    } as Response)

    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        useBookingDetails({
          bookingId: 'booking-123',
          hasSession: true,
          isCustomer: true,
        }),
      { wrapper }
    )

    // 초기 로딩 상태 확인
    expect(result.current.isLoading).toBe(true)
    expect(result.current.booking).toBeUndefined()

    // API 호출 완료 대기
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // fetch가 올바른 URL로 호출되었는지 확인
    expect(global.fetch).toHaveBeenCalledWith('/api/bookings/booking-123/additional-payment')

    // 결과 데이터 확인
    expect(result.current.booking).toEqual(mockBookingInfo)
    expect(result.current.error).toBeNull()
  })

  it('API 오류 시 오류를 반환해야 함', async () => {
    // fetch 실패 모킹
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: '예약을 찾을 수 없습니다' }),
    } as Response)

    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        useBookingDetails({
          bookingId: 'booking-123',
          hasSession: true,
          isCustomer: true,
        }),
      { wrapper }
    )

    // 오류 처리 완료 대기
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.booking).toBeUndefined()
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('예약을 찾을 수 없습니다')
  })

  it('네트워크 오류 시 기본 오류 메시지를 반환해야 함', async () => {
    // fetch 오류 모킹 (네트워크 실패)
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => {
        throw new Error('Network error')
      },
    } as unknown as Response)

    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        useBookingDetails({
          bookingId: 'booking-123',
          hasSession: true,
          isCustomer: true,
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.booking).toBeUndefined()
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('예약 정보를 불러오는데 실패했습니다')
  })

  it('queryResult 객체가 올바르게 반환되어야 함', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockBookingInfo,
    } as Response)

    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        useBookingDetails({
          bookingId: 'booking-123',
          hasSession: true,
          isCustomer: true,
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // queryResult 객체가 존재하고 필요한 속성들을 가지고 있는지 확인
    expect(result.current.queryResult).toBeDefined()
    expect(result.current.queryResult.data).toEqual(mockBookingInfo)
    expect(result.current.queryResult.isLoading).toBe(false)
    expect(result.current.queryResult.isSuccess).toBe(true)
    expect(result.current.queryResult.isError).toBe(false)
  })

  it('올바른 캐시 키로 데이터를 조회해야 함', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockBookingInfo,
    } as Response)

    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        useBookingDetails({
          bookingId: 'booking-123',
          hasSession: true,
          isCustomer: true,
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // 데이터가 캐시에서 올바르게 조회되는지 확인
    const cachedData = queryClient.getQueryData(['booking', 'booking-123', 'additional-payment'])
    expect(cachedData).toEqual(mockBookingInfo)
  })

  it('다른 bookingId로 호출 시 올바른 API를 호출해야 함', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockBookingInfo, id: 'booking-456' }),
    } as Response)

    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        useBookingDetails({
          bookingId: 'booking-456',
          hasSession: true,
          isCustomer: true,
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/bookings/booking-456/additional-payment')
    expect(result.current.booking?.id).toBe('booking-456')
  })

  it('추가 비용이 있는 예약 정보를 올바르게 파싱해야 함', async () => {
    const bookingWithMultipleCharges: BookingInfo = {
      ...mockBookingInfo,
      additionalCharges: [
        {
          id: 'charge-1',
          name: '털 엉킴 심함',
          amount: 20000,
          quantity: 1,
          total: 20000,
          description: '추가 작업',
        },
        {
          id: 'charge-2',
          name: '특수 샴푸',
          amount: 10000,
          quantity: 2,
          total: 20000,
          description: '피부병 관리',
        },
      ],
    }

    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => bookingWithMultipleCharges,
    } as Response)

    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        useBookingDetails({
          bookingId: 'booking-123',
          hasSession: true,
          isCustomer: true,
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.booking?.additionalCharges).toHaveLength(2)
    expect(result.current.booking?.additionalCharges[0].name).toBe('털 엉킴 심함')
    expect(result.current.booking?.additionalCharges[1].name).toBe('특수 샴푸')
  })

  it('추가 비용이 없는 예약도 처리해야 함', async () => {
    const bookingWithoutCharges: BookingInfo = {
      ...mockBookingInfo,
      additionalCharges: [],
    }

    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => bookingWithoutCharges,
    } as Response)

    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        useBookingDetails({
          bookingId: 'booking-123',
          hasSession: true,
          isCustomer: true,
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.booking?.additionalCharges).toEqual([])
  })
})
