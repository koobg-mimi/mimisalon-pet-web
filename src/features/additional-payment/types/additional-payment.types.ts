/**
 * 추가 결제 기능 관련 타입 정의
 * @module features/additional-payment/types
 */

/**
 * 추가 비용 항목 정보
 * @description 서비스 진행 중 발생한 추가 비용 항목을 나타냅니다
 */
export interface AdditionalCharge {
  /** 추가 비용 항목 고유 ID */
  id: string
  /** 항목명 (예: "털 엉킴 처리", "특수 샴푸 사용") */
  name: string
  /** 항목 상세 설명 */
  description: string
  /** 단가 (원) */
  amount: number
  /** 수량 */
  quantity: number
  /** 총액 (amount × quantity) */
  total: number
}

/**
 * 예약 정보 (추가 결제용)
 * @description 추가 결제 페이지에서 표시할 예약 관련 정보
 */
export interface BookingInfo {
  /** 예약 ID */
  id: string
  /** 예약 상태 */
  status: string
  /** 기본 서비스 금액 (원) */
  originalAmount: number
  /** 서비스 정보 */
  service: {
    /** 서비스명 */
    name: string
  }
  /** 반려동물 정보 */
  pet: {
    /** 반려동물 이름 */
    name: string
    /** 품종 */
    breed: string
  }
  /** 미용사 정보 */
  groomer: {
    /** 미용사 이름 */
    name: string
  }
  /** 지점 정보 */
  location: {
    /** 지점명 */
    name: string
    /** 지점 주소 */
    address: string
  }
  /** 예약 날짜 (YYYY-MM-DD) */
  date: string
  /** 예약 시간 (HH:mm) */
  time: string
  /** 추가 비용 항목 목록 */
  additionalCharges: AdditionalCharge[]
}

/**
 * 결제 요청 결과
 * @description PaymentCard 컴포넌트로 전달할 결제 정보
 */
export interface PaymentRequestResult {
  /** 결제 ID */
  paymentId: string
  /** 예약 ID */
  bookingId: string
  /** 결제 금액 (원) */
  amount: number
  /** 주문명 */
  orderName: string
}

/**
 * 추가 결제 상태
 * @description 추가 결제 프로세스의 진행 상태
 */
export type AdditionalPaymentStatus =
  | 'idle' // 초기 상태
  | 'initializing' // 결제 초기화 중
  | 'ready' // 결제 준비 완료
  | 'processing' // 결제 진행 중
  | 'success' // 결제 성공
  | 'error' // 결제 오류

/**
 * 추가 결제 커스텀 데이터
 * @description PaymentCard에 전달할 추가 결제 관련 메타데이터
 */
export interface AdditionalPaymentCustomData {
  /** 결제 타입 (추가 결제 식별용) */
  type: 'additional'
  /** 예약 ID */
  bookingId: string
  /** 기본 서비스 금액 */
  originalAmount: number
  /** 추가 비용 항목 목록 */
  additionalCharges: AdditionalCharge[]
}
