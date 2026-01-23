'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { usePayment } from '@/hooks/usePayment';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PaymentMethodSelector } from '@/components/payment/payment-method-selector';
import { PaymentSummary } from '@/components/payment/payment-summary';
import { BillingAddressForm } from '@/components/payment/billing-address-form';
import {
  ShieldCheckIcon,
  CreditCardIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from 'lucide-react';
import {
  paymentSchema,
  type PaymentMethod,
  type BillingAddress,
  type CouponInput,
} from '@/lib/validations/payment';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
}

interface BookingDetails {
  id: string;
  services: Service[];
  pet: {
    id: string;
    name: string;
    species: string;
  };
  groomer: {
    id: string;
    name: string;
    salon: string;
  };
  scheduledDate: string;
  scheduledTime: string;
}

interface CouponDiscount {
  code: string;
  discountAmount: number;
  discountType: 'AMOUNT' | 'PERCENTAGE';
}

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [billingAddress, setBillingAddress] = useState<BillingAddress | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<CouponDiscount | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);

  const {
    requestPayment,
    isLoading: isPaymentLoading,
    error: paymentError,
    clearError,
  } = usePayment();

  const {
    handleSubmit,
    formState: {},
  } = useForm({
    resolver: zodResolver(paymentSchema),
    mode: 'onChange',
  });

  // Fetch booking using React Query
  const {
    data: booking,
    isLoading,
    isError,
  } = useQuery<BookingDetails>({
    queryKey: ['customer', 'bookings', resolvedParams.id],
    queryFn: async () => {
      const response = await fetch(`/api/customer/bookings/${resolvedParams.id}`);
      if (!response.ok) {
        throw new Error('예약 정보를 불러올 수 없습니다');
      }
      return response.json();
    },
    enabled: !!resolvedParams.id,
  });

  // Redirect to bookings if booking fetch fails
  useEffect(() => {
    if (isError) {
      router.push('/customer/bookings');
    }
  }, [isError, router]);

  // 쿠폰 적용
  const handleCouponApply = async (coupon: CouponInput): Promise<boolean> => {
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coupon),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      setCouponDiscount(data);
      return true;
    } catch (error) {
      console.error('Error applying coupon:', error);
      return false;
    }
  };

  // 쿠폰 제거
  const handleCouponRemove = () => {
    setCouponDiscount(null);
  };

  // 결제 처리
  const onSubmit = async () => {
    if (!booking || !paymentMethod || !billingAddress) {
      return;
    }

    setIsProcessing(true);

    try {
      const subtotal = booking.services.reduce((sum, service) => sum + service.price, 0);
      const discountAmount = couponDiscount?.discountAmount || 0;
      const finalAmount = subtotal - discountAmount;

      // 1. 먼저 서버에서 결제 초기화 (고유 paymentId 생성)
      const initResponse = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: finalAmount,
          orderName: `${booking.pet.name} 미용 서비스`,
        }),
      });

      if (!initResponse.ok) {
        throw new Error('결제 초기화에 실패했습니다');
      }

      const initData = await initResponse.json();

      // 2. 포트원 SDK로 결제 요청
      const paymentRequest = {
        amount: finalAmount,
        orderName: initData.orderName,
        orderId: initData.paymentId, // 서버에서 생성한 고유 ID 사용
        customerName: initData.customerName || billingAddress.name,
        customerEmail: initData.customerEmail || '',
        customerPhone: initData.customerPhone || billingAddress.phone || '',
        payMethod: paymentMethod.type as
          | 'CARD'
          | 'VIRTUAL_ACCOUNT'
          | 'EASY_PAY'
          | 'TRANSFER'
          | 'MOBILE',
        storeId: initData.storeId,
        channelKey: initData.channelKey,
        customData: {
          bookingId: booking.id,
          services: booking.services.map((s) => ({
            id: s.id,
            name: s.name,
            price: s.price,
          })),
          originalAmount: subtotal,
          discountAmount,
          finalAmount,
        },
      };

      console.log('[Payment] Requesting payment via usePayment hook:', paymentRequest);

      const paymentResult = await requestPayment(paymentRequest);

      if (paymentResult.success) {
        // 3. 서버에서 결제 검증 (Polling 방식)
        // 웹훅이 도착할 때까지 최대 30초 동안 1초마다 확인
        const maxAttempts = 30;
        let attempts = 0;
        let verificationSuccess = false;
        let verificationError: string | null = null;

        console.log('[Payment] Starting payment verification polling...');

        while (attempts < maxAttempts && !verificationSuccess) {
          try {
            const verifyResponse = await fetch(`/api/payments/verify/${initData.paymentId}`, {
              method: 'GET',
            });

            if (!verifyResponse.ok) {
              // 404는 아직 웹훅이 도착하지 않은 것일 수 있음
              if (verifyResponse.status === 404) {
                console.log(
                  `[Payment] Attempt ${attempts + 1}/${maxAttempts}: Payment not found, waiting for webhook...`
                );
              } else {
                throw new Error('서버 결제 검증 실패');
              }
            } else {
              const verifyResult = await verifyResponse.json();
              console.log(
                `[Payment] Attempt ${attempts + 1}/${maxAttempts}: Status = ${verifyResult.status}`
              );

              if (verifyResult.success) {
                // 결제 성공
                verificationSuccess = true;
                console.log('[Payment] Payment verified successfully!');
                router.push(
                  `/customer/booking/${booking.id}/payment/success?payment=${initData.paymentId}`
                );
                break;
              } else if (verifyResult.status === 'FAILED' || verifyResult.status === 'CANCELLED') {
                // 결제 실패 또는 취소
                verificationError =
                  verifyResult.error ||
                  `결제가 ${verifyResult.status === 'FAILED' ? '실패' : '취소'}되었습니다`;
                break;
              } else if (verifyResult.status === 'PENDING') {
                // 아직 처리 중 - 계속 polling
                console.log('[Payment] Payment still pending, continuing to poll...');
              }
            }

            // 다음 시도 전 1초 대기
            if (attempts < maxAttempts - 1 && !verificationSuccess) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            attempts++;
          } catch (error) {
            console.error(`[Payment] Verification attempt ${attempts + 1} failed:`, error);

            // 마지막 시도가 아니면 계속 시도
            if (attempts < maxAttempts - 1) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              attempts++;
            } else {
              // 모든 시도 실패
              verificationError =
                error instanceof Error ? error.message : '결제 확인 중 오류가 발생했습니다';
              break;
            }
          }
        }

        // Polling 결과 처리
        if (!verificationSuccess) {
          if (attempts >= maxAttempts) {
            throw new Error('결제 확인 시간이 초과되었습니다. 고객센터에 문의해주세요.');
          } else if (verificationError) {
            throw new Error(verificationError);
          }
        }
      } else {
        // 결제 실패 처리
        if (paymentResult.cancelled) {
          console.log('[Payment] Payment was cancelled by user');
          // 취소된 경우는 에러를 표시하지 않음
        } else {
          throw new Error(paymentResult.error || '결제에 실패했습니다');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      // 에러 처리 - 구체적인 에러 메시지 표시
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      alert(`결제 처리 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const canProceedToPayment = () => {
    return paymentMethod && billingAddress && agreeToTerms && agreeToPrivacy;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <LoadingSpinner size="lg" />
              <p className="text-muted-foreground">결제 정보를 불러오는 중...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <AlertTriangleIcon className="text-muted-foreground mx-auto h-12 w-12" />
              <h3 className="text-lg font-semibold">예약 정보를 찾을 수 없습니다</h3>
              <p className="text-muted-foreground">
                유효하지 않은 예약이거나 이미 처리된 예약입니다.
              </p>
              <Button onClick={() => router.push('/customer/bookings')}>
                예약 목록으로 돌아가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* 헤더 */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            이전으로
          </Button>

          <div className="mb-2 flex items-center space-x-3">
            <CreditCardIcon className="text-primary h-6 w-6" />
            <h1 className="text-2xl font-bold">결제하기</h1>
          </div>

          <div className="text-muted-foreground">
            {booking.pet.name}의 기본 미용 서비스 결제 (추가 서비스는 현장에서 결제)
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 왼쪽: 결제 정보 입력 */}
          <div className="space-y-6 lg:col-span-2">
            {/* 예약 요약 */}
            <Card>
              <CardHeader>
                <CardTitle>예약 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  <div>
                    <div className="font-medium">반려동물</div>
                    <div className="text-muted-foreground">
                      {booking.pet.name} ({booking.pet.species})
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">미용사</div>
                    <div className="text-muted-foreground">
                      {booking.groomer.name} - {booking.groomer.salon}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">예약 날짜</div>
                    <div className="text-muted-foreground">{booking.scheduledDate}</div>
                  </div>
                  <div>
                    <div className="font-medium">예약 시간</div>
                    <div className="text-muted-foreground">{booking.scheduledTime}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 결제 방법 선택 */}
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
            />

            {/* 청구 주소 */}
            <BillingAddressForm onAddressChange={setBillingAddress} />

            {/* 결제 안내 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                  <span>결제 안내</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 rounded-lg bg-blue-50 p-4">
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>
                      • <strong>1차 결제 (지금)</strong>: 기본 미용 서비스 금액
                    </li>
                    <li>
                      • <strong>2차 결제 (추가금 결제)</strong>: 미용사가 제안하는 추가 서비스 금액
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 약관 동의 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span>약관 동의</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                    />
                    <label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed">
                      <span className="font-medium">이용약관</span>에 동의합니다. (필수)
                      <br />
                      <span className="text-muted-foreground">
                        서비스 이용 조건 및 결제 정책을 확인했습니다.
                      </span>
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="privacy"
                      checked={agreeToPrivacy}
                      onCheckedChange={(checked) => setAgreeToPrivacy(checked === true)}
                    />
                    <label htmlFor="privacy" className="cursor-pointer text-sm leading-relaxed">
                      <span className="font-medium">개인정보 처리방침</span>에 동의합니다. (필수)
                      <br />
                      <span className="text-muted-foreground">
                        개인정보 수집 및 이용에 대한 안내를 확인했습니다.
                      </span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 결제 요약 */}
          <div className="space-y-6">
            <PaymentSummary
              services={booking.services}
              couponDiscount={couponDiscount || undefined}
              onCouponApply={handleCouponApply}
              onCouponRemove={handleCouponRemove}
            />

            {/* 결제 버튼 */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={!canProceedToPayment() || isProcessing || isPaymentLoading}
                  className="h-12 w-full text-lg font-semibold"
                  size="lg"
                >
                  {isProcessing || isPaymentLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      결제 처리 중...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="mr-2 h-5 w-5" />
                      결제하기
                    </>
                  )}
                </Button>

                {!canProceedToPayment() && (
                  <p className="text-muted-foreground mt-3 text-center text-sm">
                    결제 정보를 모두 입력하고 약관에 동의해주세요
                  </p>
                )}

                {paymentError && (
                  <div className="mt-3 rounded bg-red-50 p-2 text-center text-sm text-red-500">
                    {paymentError}
                    <button onClick={clearError} className="ml-2 text-red-700 underline">
                      닫기
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
