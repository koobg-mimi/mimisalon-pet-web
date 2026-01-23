/**
 * 예약 API 레이어 (BFF: Backend-For-Frontend)
 *
 * 서버 응답을 프론트엔드 친화적 형식으로 변환하고
 * 여러 API 호출을 병합하여 UI가 단순히 표시만 하도록 함
 */

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

/**
 * 예약 초기화 요청 데이터
 */
export interface InitializeBookingRequest {
  /** 멱등성 키 (중복 방지) */
  idempotencyKey: string
  /** 반려동물별 서비스 정보 */
  petServices: {
    petId: string
    services: {
      id: string
      name: string
      price: number
      duration: number
    }[]
    options: {
      id: string
      name: string
      price: number
    }[]
  }[]
  /** 서비스 주소 ID */
  addressId: string
  /** 미용사 ID */
  groomerId: string
  /** 예약 날짜 (YYYY-MM-DD) */
  date: string
  /** 시간대 */
  timeSlot: string
  /** 특별 요청사항 */
  specialRequests?: string
}

/**
 * 예약 초기화 응답 데이터
 */
export interface InitializeBookingResponse {
  /** 예약 ID */
  bookingId: string
  /** 기존 예약 여부 */
  isExisting: boolean
  /** 예약 상태 */
  status: string
}

/**
 * 결제 초기화 요청 데이터
 */
export interface InitializePaymentRequest {
  /** 예약 ID */
  bookingId: string
  /** 결제 금액 */
  amount: number
  /** 주문명 */
  orderName: string
}

/**
 * 결제 초기화 응답 데이터
 */
export interface InitializePaymentResponse {
  /** 결제 ID */
  paymentId: string
  /** PortOne 결제 키 */
  portonePaymentId: string
}

/**
 * 예약 상세 정보 (프론트엔드 친화적 형식)
 */
export interface BookingDetails {
  /** 예약 ID */
  id: string
  /** 고객 정보 */
  customer: {
    id: string
    name: string
    phone: string
    email: string
  }
  /** 매장 정보 */
  shop: {
    id: string
    name: string
    address: string
    phone: string
  }
  /** 미용사 정보 */
  groomer: {
    id: string
    name: string
    profileImage?: string
  }
  /** 반려동물 정보 */
  pets: {
    id: string
    name: string
    breed: string
    type: string
  }[]
  /** 서비스 정보 */
  services: {
    petName: string
    serviceName: string
    price: number
    formattedPrice: string
  }[]
  /** 예약 날짜 및 시간 */
  scheduledAt: Date
  /** 포맷된 날짜 */
  formattedDate: string
  /** 포맷된 시간 */
  formattedTime: string
  /** 총 금액 */
  totalAmount: number
  /** 포맷된 총 금액 */
  formattedTotalAmount: string
  /** 예약 상태 */
  status: string
  /** 특별 요청사항 */
  specialRequests?: string
  /** 결제 정보 */
  payment?: {
    id: string
    status: string
    paidAt?: Date
  }
  /** 생성일시 */
  createdAt: Date
  /** 수정일시 */
  updatedAt: Date
}

/**
 * 예약 목록 필터
 */
export interface BookingListFilters {
  /** 고객 ID */
  userId?: string
  /** 예약 상태 */
  status?: string
  /** 날짜 범위 시작 */
  startDate?: string
  /** 날짜 범위 종료 */
  endDate?: string
  /** 페이지 번호 */
  page?: number
  /** 페이지 크기 */
  pageSize?: number
}

/**
 * 통화 포맷 헬퍼
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

/**
 * 예약 API
 */
export const bookingApi = {
  /**
   * 예약 초기화 (멱등성 보장)
   *
   * @param request 예약 초기화 요청 데이터
   * @returns 예약 ID 및 상태
   */
  async initializeBooking(request: InitializeBookingRequest): Promise<InitializeBookingResponse> {
    const response = await fetch('/api/bookings/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '예약 초기화에 실패했습니다')
    }

    return response.json()
  },

  /**
   * 결제 초기화
   *
   * @param request 결제 초기화 요청 데이터
   * @returns 결제 ID 및 PortOne 결제 키
   */
  async initializePayment(request: InitializePaymentRequest): Promise<InitializePaymentResponse> {
    const response = await fetch('/api/payments/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '결제 초기화에 실패했습니다')
    }

    return response.json()
  },

  /**
   * 예약 상세 조회 (프론트엔드 친화적 형식)
   *
   * @param bookingId 예약 ID
   * @returns 예약 상세 정보 (이미 포맷됨)
   */
  async getBooking(bookingId: string): Promise<BookingDetails> {
    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '예약 조회에 실패했습니다')
    }

    const data = await response.json()

    // 서버 응답을 프론트엔드 친화적 형식으로 변환
    return {
      ...data,
      scheduledAt: new Date(data.scheduledAt),
      formattedDate: format(new Date(data.scheduledAt), 'yyyy년 M월 d일 (EEEE)', {
        locale: ko,
      }),
      formattedTime: format(new Date(data.scheduledAt), 'HH:mm', { locale: ko }),
      formattedTotalAmount: formatCurrency(data.totalAmount),
      services: data.services.map((service: any) => ({
        ...service,
        formattedPrice: formatCurrency(service.price),
      })),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      payment: data.payment
        ? {
            ...data.payment,
            paidAt: data.payment.paidAt ? new Date(data.payment.paidAt) : undefined,
          }
        : undefined,
    }
  },

  /**
   * 예약 목록 조회 (프론트엔드 친화적 형식)
   *
   * @param filters 필터 조건
   * @returns 예약 목록 (이미 포맷됨)
   */
  async getBookings(filters?: BookingListFilters): Promise<{
    bookings: BookingDetails[]
    pagination: {
      currentPage: number
      totalPages: number
      totalItems: number
      pageSize: number
    }
  }> {
    const queryParams = new URLSearchParams()
    if (filters?.userId) queryParams.append('userId', filters.userId)
    if (filters?.status) queryParams.append('status', filters.status)
    if (filters?.startDate) queryParams.append('startDate', filters.startDate)
    if (filters?.endDate) queryParams.append('endDate', filters.endDate)
    if (filters?.page) queryParams.append('page', filters.page.toString())
    if (filters?.pageSize) queryParams.append('pageSize', filters.pageSize.toString())

    const response = await fetch(`/api/bookings?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '예약 목록 조회에 실패했습니다')
    }

    const data = await response.json()

    // 각 예약을 프론트엔드 친화적 형식으로 변환
    return {
      bookings: data.bookings.map((booking: any) => ({
        ...booking,
        scheduledAt: new Date(booking.scheduledAt),
        formattedDate: format(new Date(booking.scheduledAt), 'yyyy년 M월 d일 (EEEE)', {
          locale: ko,
        }),
        formattedTime: format(new Date(booking.scheduledAt), 'HH:mm', { locale: ko }),
        formattedTotalAmount: formatCurrency(booking.totalAmount),
        services: booking.services.map((service: any) => ({
          ...service,
          formattedPrice: formatCurrency(service.price),
        })),
        createdAt: new Date(booking.createdAt),
        updatedAt: new Date(booking.updatedAt),
      })),
      pagination: data.pagination,
    }
  },

  /**
   * 예약 취소
   *
   * @param bookingId 예약 ID
   * @param reason 취소 사유
   */
  async cancelBooking(bookingId: string, reason?: string): Promise<void> {
    const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '예약 취소에 실패했습니다')
    }
  },

  /**
   * 예약 상태 업데이트
   *
   * @param bookingId 예약 ID
   * @param status 새로운 상태
   */
  async updateBookingStatus(bookingId: string, status: string): Promise<void> {
    const response = await fetch(`/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '예약 상태 업데이트에 실패했습니다')
    }
  },
}
