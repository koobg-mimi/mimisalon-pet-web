import { ko } from 'date-fns/locale';
import { parseISO, format } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { couponSchema } from '@/lib/validations/payment';
import { env } from '@/lib/env';

// ============================================================================
// Types
// ============================================================================

export interface CouponValidationResponse {
  code: string;
  discountAmount: number;
  discountType: 'PERCENTAGE' | 'AMOUNT';
  message: string;
}

export interface CouponListResponse {
  availableCoupons: Array<{
    code: string;
    discountType: 'PERCENTAGE' | 'AMOUNT';
    discountValue: number;
    minAmount: number;
    maxDiscount: number;
    description: string;
  }>;
}

export interface CouponErrorResponse {
  error: string;
  details?: unknown;
}

// 모의 쿠폰 데이터
const MOCK_COUPONS = [
  {
    code: 'WELCOME10',
    discountType: 'PERCENTAGE' as const,
    discountValue: 10,
    minAmount: 50000,
    maxDiscount: 20000,
    expiresAt: parseISO('2024-12-31'),
    isActive: true,
    usageLimit: 1000,
    usedCount: 150,
  },
  {
    code: 'FIRST20',
    discountType: 'PERCENTAGE' as const,
    discountValue: 20,
    minAmount: 30000,
    maxDiscount: 15000,
    expiresAt: parseISO('2024-12-31'),
    isActive: true,
    usageLimit: 500,
    usedCount: 200,
  },
  {
    code: 'SAVE5000',
    discountType: 'AMOUNT' as const,
    discountValue: 5000,
    minAmount: 25000,
    maxDiscount: 5000,
    expiresAt: parseISO('2024-12-31'),
    isActive: true,
    usageLimit: 2000,
    usedCount: 800,
  },
  {
    code: 'VIP30',
    discountType: 'PERCENTAGE' as const,
    discountValue: 30,
    minAmount: 100000,
    maxDiscount: 50000,
    expiresAt: parseISO('2024-12-31'),
    isActive: true,
    usageLimit: 100,
    usedCount: 25,
  },
] as const;

// ============================================================================
// Route Handlers
// ============================================================================

/**
 * POST /api/coupons/validate
 * Validate coupon code and calculate discount
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<CouponValidationResponse | CouponErrorResponse>> {
  try {
    const body = await request.json();

    // 요청 데이터 검증
    const { code, bookingAmount } = couponSchema.parse(body);

    // 쿠폰 코드를 대소문자 구분 없이 검색
    const coupon = MOCK_COUPONS.find((c) => c.code.toLowerCase() === code.toLowerCase());

    if (!coupon) {
      return NextResponse.json<CouponErrorResponse>(
        { error: '존재하지 않는 쿠폰 코드입니다' },
        { status: 404 }
      );
    }

    // 쿠폰 유효성 검사
    const validationResult = validateCoupon(coupon, bookingAmount);

    if (!validationResult.isValid) {
      return NextResponse.json<CouponErrorResponse>(
        { error: validationResult.error! },
        { status: 400 }
      );
    }

    // 할인 금액 계산
    const discountAmount = calculateDiscountAmount(coupon, bookingAmount);

    // 사용자별 쿠폰 사용 이력 확인 (실제로는 DB에서 조회)
    const userUsageCount = await getUserCouponUsageCount();

    if (userUsageCount >= 1) {
      // 대부분의 쿠폰은 1인 1회 제한
      return NextResponse.json<CouponErrorResponse>(
        { error: '이미 사용한 쿠폰입니다' },
        { status: 400 }
      );
    }

    return NextResponse.json<CouponValidationResponse>({
      code: coupon.code,
      discountAmount,
      discountType: coupon.discountType,
      message: `${discountAmount.toLocaleString('ko-KR')}원 할인이 적용됩니다`,
    });
  } catch (error) {
    console.error('Coupon validation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json<CouponErrorResponse>(
        { error: '잘못된 쿠폰 정보입니다', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json<CouponErrorResponse>(
      { error: '쿠폰 확인 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// 쿠폰 유효성 검사
function validateCoupon(coupon: (typeof MOCK_COUPONS)[number], bookingAmount: number) {
  // 쿠폰 활성화 상태 확인
  if (!coupon.isActive) {
    return { isValid: false, error: '비활성화된 쿠폰입니다' };
  }

  // 만료일 확인
  if (new Date() > coupon.expiresAt) {
    return { isValid: false, error: '만료된 쿠폰입니다' };
  }

  // 최소 주문 금액 확인
  if (bookingAmount < coupon.minAmount) {
    return {
      isValid: false,
      error: `${coupon.minAmount.toLocaleString('ko-KR')}원 이상 주문 시 사용 가능합니다`,
    };
  }

  // 사용 한도 확인
  if (coupon.usedCount >= coupon.usageLimit) {
    return { isValid: false, error: '쿠폰 사용 한도가 초과되었습니다' };
  }

  return { isValid: true };
}

// 할인 금액 계산
function calculateDiscountAmount(
  coupon: (typeof MOCK_COUPONS)[number],
  bookingAmount: number
): number {
  let discountAmount: number;

  if (coupon.discountType === 'PERCENTAGE') {
    discountAmount = Math.floor(bookingAmount * (coupon.discountValue / 100));
    // 최대 할인 금액 제한
    discountAmount = Math.min(discountAmount, coupon.maxDiscount);
  } else {
    discountAmount = coupon.discountValue;
  }

  // 할인 금액이 주문 금액을 초과하지 않도록
  return Math.min(discountAmount, bookingAmount);
}

// 사용자별 쿠폰 사용 이력 확인 (모의 구현)
async function getUserCouponUsageCount(): Promise<number> {
  // 실제로는 JWT 토큰에서 사용자 ID를 추출하고 DB에서 조회
  // 현재는 모의 데이터 반환

  // 세션/토큰에서 사용자 ID 추출
  // const userId = await getUserIdFromRequest(request)

  // DB에서 사용자의 해당 쿠폰 사용 이력 조회
  // const usageCount = await prisma.couponUsage.count({
  //   where: {
  //     userId: userId,
  //     couponCode: couponCode
  //   }
  // })

  // 모의 데이터 반환 (실제로는 위의 DB 쿼리 결과 반환)
  return 0;
}

/**
 * GET /api/coupons/validate
 * Get available coupons (development/test only)
 */
export async function GET(): Promise<NextResponse<CouponListResponse | CouponErrorResponse>> {
  if (env.NODE_ENV !== 'development') {
    return NextResponse.json<CouponErrorResponse>(
      { error: 'Not available in production' },
      { status: 404 }
    );
  }

  return NextResponse.json<CouponListResponse>({
    availableCoupons: MOCK_COUPONS.map((coupon) => ({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minAmount: coupon.minAmount,
      maxDiscount: coupon.maxDiscount,
      description: getCouponDescription(coupon),
    })),
  });
}

// 쿠폰 설명 생성
function getCouponDescription(coupon: (typeof MOCK_COUPONS)[number]): string {
  if (coupon.discountType === 'PERCENTAGE') {
    return `${coupon.discountValue}% 할인 (최대 ${coupon.maxDiscount.toLocaleString('ko-KR')}원, ${coupon.minAmount.toLocaleString('ko-KR')}원 이상 주문시)`;
  } else {
    return `${coupon.discountValue.toLocaleString('ko-KR')}원 할인 (${coupon.minAmount.toLocaleString('ko-KR')}원 이상 주문시)`;
  }
}
