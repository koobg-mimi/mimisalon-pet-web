/**
 * usePaymentInitialization Hook Unit Tests
 *
 * 결제 초기화 훅 단위 테스트
 */

import React from 'react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePaymentInitialization } from '../hooks/usePaymentInitialization'

describe('usePaymentInitialization', () => {
  let queryClient: QueryClient

  // 각 테스트 전에 QueryClient 초기화
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: {
          retry: false, // 테스트에서는 재시도하지 않음
        },
      },
    })
    // fetch 모킹 초기화
    global.fetch = vi.fn()
    // console.error 모킹 (오류 로그 출력 방지)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
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
        usePaymentInitialization({
          bookingId: 'booking-123',
          amount: 50000,
          orderName: '추가 서비스 - 뽀삐',
        }),
      { wrapper }
    )

    expect(result.current.paymentId).toBeNull()
    expect(result.current.isInitializing).toBe(false)
    expect(result.current.error).toBeNull()
    expect(typeof result.current.initializePayment).toBe('function')
  })

  it('결제 초기화가 성공하면 paymentId를 설정해야 함', async () => {
    const mockPaymentId = 'payment-abc-123'

    // fetch 성공 모킹
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ paymentId: mockPaymentId }),
    } as Response)

    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        usePaymentInitialization({
          bookingId: 'booking-123',
          amount: 50000,
          orderName: '추가 서비스 - 뽀삐',
        }),
      { wrapper }
    )

    let initResult
    await act(async () => {
      initResult = await result.current.initializePayment()
    })

    // fetch가 올바른 파라미터로 호출되었는지 확인
    expect(global.fetch).toHaveBeenCalledWith('/api/payments/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingId: 'booking-123',
        amount: 50000,
        orderName: '추가 서비스 - 뽀삐',
      }),
    })

    // 결제 ID가 설정되었는지 확인
    expect(result.current.paymentId).toBe(mockPaymentId)
    expect(result.current.isInitializing).toBe(false)
    expect(result.current.error).toBeNull()

    // 반환값 확인
    expect(initResult).toEqual({
      paymentId: mockPaymentId,
      bookingId: 'booking-123',
      amount: 50000,
      orderName: '추가 서비스 - 뽀삐',
    })
  })

  it('결제 초기화 중 isInitializing이 true가 되어야 함', async () => {
    // fetch를 느리게 응답하도록 모킹
    ;(global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => ({ paymentId: 'payment-123' }),
            } as Response)
          }, 100)
        })
    )

    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        usePaymentInitialization({
          bookingId: 'booking-123',
          amount: 50000,
          orderName: '추가 서비스 - 뽀삐',
        }),
      { wrapper }
    )

    act(() => {
      result.current.initializePayment()
    })

    // 초기화 중인 상태 확인
    await waitFor(() => {
      expect(result.current.isInitializing).toBe(true)
    })

    // 완료 대기
    await waitFor(
      () => {
        expect(result.current.isInitializing).toBe(false)
      },
      { timeout: 200 }
    )
  })

  it('API 오류 시 오류를 반환하고 paymentId는 null이어야 함', async () => {
    // fetch 실패 모킹
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: '결제 초기화 실패' }),
    } as Response)

    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        usePaymentInitialization({
          bookingId: 'booking-123',
          amount: 50000,
          orderName: '추가 서비스 - 뽀삐',
        }),
      { wrapper }
    )

    let initResult
    await act(async () => {
      initResult = await result.current.initializePayment()
    })

    // 오류 상태 업데이트 대기
    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error)
    })

    expect(result.current.paymentId).toBeNull()
    expect(result.current.error?.message).toBe('결제 초기화 실패')
    expect(initResult).toBeNull()
  })

  it('네트워크 오류 시 기본 오류 메시지를 반환해야 함', async () => {
    // fetch 오류 모킹 (JSON 파싱 실패)
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => {
        throw new Error('Network error')
      },
    } as unknown as Response)

    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        usePaymentInitialization({
          bookingId: 'booking-123',
          amount: 50000,
          orderName: '추가 서비스 - 뽀삐',
        }),
      { wrapper }
    )

    let initResult
    await act(async () => {
      initResult = await result.current.initializePayment()
    })

    // 오류 상태 업데이트 대기
    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error)
    })

    expect(result.current.paymentId).toBeNull()
    expect(result.current.error?.message).toBe('결제 초기화에 실패했습니다')
    expect(initResult).toBeNull()
  })

  it('중복 클릭 시 두 번째 요청을 무시해야 함', async () => {
    // fetch를 느리게 응답하도록 모킹
    ;(global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => ({ paymentId: 'payment-123' }),
            } as Response)
          }, 100)
        })
    )

    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        usePaymentInitialization({
          bookingId: 'booking-123',
          amount: 50000,
          orderName: '추가 서비스 - 뽀삐',
        }),
      { wrapper }
    )

    // 첫 번째 요청
    act(() => {
      result.current.initializePayment()
    })

    await waitFor(() => {
      expect(result.current.isInitializing).toBe(true)
    })

    // 두 번째 요청 (중복)
    let secondResult
    await act(async () => {
      secondResult = await result.current.initializePayment()
    })

    // 두 번째 요청은 null을 반환해야 함
    expect(secondResult).toBeNull()

    // 첫 번째 요청만 fetch를 호출해야 함
    expect(global.fetch).toHaveBeenCalledTimes(1)

    // 완료 대기
    await waitFor(
      () => {
        expect(result.current.isInitializing).toBe(false)
      },
      { timeout: 200 }
    )
  })

  it('mutation 객체가 올바르게 노출되어야 함', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ paymentId: 'payment-123' }),
    } as Response)

    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        usePaymentInitialization({
          bookingId: 'booking-123',
          amount: 50000,
          orderName: '추가 서비스 - 뽀삐',
        }),
      { wrapper }
    )

    expect(result.current.mutation).toBeDefined()
    expect(result.current.mutation.isPending).toBe(false)
    expect(result.current.mutation.isSuccess).toBe(false)
    expect(result.current.mutation.isError).toBe(false)

    await act(async () => {
      await result.current.initializePayment()
    })

    expect(result.current.mutation.isSuccess).toBe(true)
    expect(result.current.mutation.data).toBe('payment-123')
  })

  it('다른 금액과 주문명으로 결제 초기화를 실행해야 함', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ paymentId: 'payment-456' }),
    } as Response)

    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        usePaymentInitialization({
          bookingId: 'booking-456',
          amount: 30000,
          orderName: '추가 서비스 - 루비',
        }),
      { wrapper }
    )

    await act(async () => {
      await result.current.initializePayment()
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/payments/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingId: 'booking-456',
        amount: 30000,
        orderName: '추가 서비스 - 루비',
      }),
    })

    expect(result.current.paymentId).toBe('payment-456')
  })

  it('오류 후 다시 시도할 수 있어야 함', async () => {
    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        usePaymentInitialization({
          bookingId: 'booking-123',
          amount: 50000,
          orderName: '추가 서비스 - 뽀삐',
        }),
      { wrapper }
    )

    // 첫 번째 시도: 실패
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: '서버 오류' }),
    } as Response)

    await act(async () => {
      await result.current.initializePayment()
    })

    // 오류 상태 업데이트 대기
    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error)
    })

    expect(result.current.paymentId).toBeNull()

    // 두 번째 시도: 성공
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ paymentId: 'payment-retry-123' }),
    } as Response)

    await act(async () => {
      await result.current.initializePayment()
    })

    expect(result.current.paymentId).toBe('payment-retry-123')
    expect(result.current.error).toBeNull()
  })

  it('0원 금액도 처리할 수 있어야 함', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ paymentId: 'payment-zero' }),
    } as Response)

    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        usePaymentInitialization({
          bookingId: 'booking-123',
          amount: 0,
          orderName: '추가 서비스 - 테스트',
        }),
      { wrapper }
    )

    await act(async () => {
      await result.current.initializePayment()
    })

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/payments/initialize',
      expect.objectContaining({
        body: expect.stringContaining('"amount":0'),
      })
    )
  })

  it('큰 금액도 정확히 전달해야 함', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ paymentId: 'payment-large' }),
    } as Response)

    const wrapper = createWrapper(queryClient)

    const { result } = renderHook(
      () =>
        usePaymentInitialization({
          bookingId: 'booking-123',
          amount: 1000000,
          orderName: '추가 서비스 - 대형견',
        }),
      { wrapper }
    )

    await act(async () => {
      await result.current.initializePayment()
    })

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/payments/initialize',
      expect.objectContaining({
        body: expect.stringContaining('"amount":1000000'),
      })
    )

    expect(result.current.paymentId).toBe('payment-large')
  })
})
