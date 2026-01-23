'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { useSession } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Link from 'next/link';
import type {
  PaymentVerificationResponse,
  PaymentVerificationData,
} from '@/app/api/payments/verify/[paymentId]/route';

export default function PaymentSuccessPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  useEffect(() => {
    // Check if this is actually a failed/cancelled payment
    if (errorCode || errorMessage) {
      const reason = errorMessage || '결제가 취소되었습니다';
      const bookingId = searchParams.get('bookingId') || '';

      // Redirect to fail page with error details
      router.push(`/payment/fail?reason=${encodeURIComponent(reason)}&bookingId=${bookingId}`);
      return;
    }

    if (!session) {
      router.push('/auth/signin');
    }
    if (session?.user?.role && session.user.role !== 'CUSTOMER') {
      router.push('/dashboard');
    }
  }, [session, router, errorCode, errorMessage, searchParams]);

  // Fetch payment with retry logic using React Query
  const { data: payment, isLoading } = useQuery<PaymentVerificationData>({
    queryKey: ['payment', paymentId],
    queryFn: async ({ signal }) => {
      console.log(`Verifying payment:`, paymentId);

      const response = await fetch(`/api/payments/verify/${paymentId}`, { signal });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('NOT_FOUND');
        }
        throw new Error('Failed to verify payment');
      }

      const data: PaymentVerificationResponse = await response.json();

      if (data.success && data.payment) {
        console.log('Payment verification successful:', data);
        return data.payment;
      } else if (data.status === 'PENDING' || data.status === 'NOT_FOUND') {
        // Throw error to trigger retry
        throw new Error(data.status);
      } else {
        // Payment failed or cancelled
        const errorMsg = data.error || data.message || '결제 확인 실패';
        console.error('Payment verification failed:', errorMsg, data);
        router.push(`/payment/fail?reason=${encodeURIComponent(errorMsg)}&paymentId=${paymentId}`);
        throw new Error(errorMsg);
      }
    },
    enabled:
      !!paymentId &&
      !!session?.user &&
      session.user.role === 'CUSTOMER' &&
      !errorCode &&
      !errorMessage,
    retry: (failureCount, error) => {
      // Retry up to 20 times for PENDING or NOT_FOUND status
      if ((error.message === 'PENDING' || error.message === 'NOT_FOUND') && failureCount < 20) {
        return true;
      }
      return false;
    },
    retryDelay: 3000, // Wait 3 seconds between retries
  });

  useEffect(() => {
    if (!paymentId && !errorCode && !errorMessage) {
      router.push('/customer/bookings');
    }
  }, [paymentId, errorCode, errorMessage, router]);

  // Download receipt using React Query mutation
  const downloadReceiptMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/payments/${paymentId}/receipt`);
      if (!response.ok) {
        throw new Error('Failed to download receipt');
      }
      return response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onError: (error) => {
      console.error('Failed to download receipt:', error);
    },
  });

  const handleDownloadReceipt = () => {
    downloadReceiptMutation.mutate();
  };

  // Show loading spinner while checking for errors or loading payment
  if (isPending || isLoading || errorCode || errorMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          {isLoading && !errorCode && !errorMessage && (
            <>
              <p className="mt-4 text-lg font-semibold">결제를 확인하고 있습니다...</p>
              <p className="text-muted-foreground mt-2 text-sm">
                최대 1분 정도 소요될 수 있습니다.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'CUSTOMER' || !payment) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-foreground mb-2 text-3xl font-bold">결제가 완료되었습니다!</h1>
            <div className="text-muted-foreground">
              <p>예약이 성공적으로 접수되었습니다.</p>
              <p>미용사 확인 후 예약이 확정됩니다.</p>
            </div>
          </div>

          <div className="border-border bg-card mb-8 rounded-lg border p-6 text-left">
            <h2 className="mb-4 text-center text-xl font-semibold">결제 정보</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">결제번호</span>
                <span className="font-medium">{payment.id}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">결제금액</span>
                <span className="text-primary text-lg font-semibold">
                  {payment.amount.toLocaleString('ko-KR')}원
                </span>
              </div>

              {payment.booking && (
                <div className="border-border border-t pt-4">
                  <h3 className="mb-3 font-semibold">예약 정보</h3>
                  <div className="space-y-2 text-sm">
                    {payment.booking.pets && payment.booking.pets.length > 0 && (
                      <>
                        {payment.booking.pets.map((pet, petIndex) => (
                          <div key={petIndex} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">반려동물</span>
                              <span>
                                {pet.name} {pet.breed && `(${pet.breed})`}
                              </span>
                            </div>
                            {pet.services && pet.services.length > 0 && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">서비스</span>
                                <span>
                                  {pet.services.map((service) => service.name).join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                    {payment.booking.groomer && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">미용사</span>
                        <span>{payment.booking.groomer.name}</span>
                      </div>
                    )}
                    {payment.booking.address && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">주소</span>
                        <span>
                          {payment.booking.address.street}, {payment.booking.address.city}
                        </span>
                      </div>
                    )}
                    {(payment.booking.serviceDate || payment.booking.serviceTime) && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">예약일시</span>
                        <span>
                          {payment.booking.serviceDate &&
                            format(new Date(payment.booking.serviceDate), 'yyyy-MM-dd', {
                              locale: ko,
                            })}{' '}
                          {payment.booking.serviceTime}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Button onClick={handleDownloadReceipt} variant="outline" className="w-full">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                영수증 다운로드
              </Button>

              {payment.booking?.id && (
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/customer/booking/${payment.booking.id}`}>
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    예약 상세보기
                  </Link>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Button asChild className="w-full">
                <Link href="/customer/bookings">예약 관리</Link>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link href="/booking/new">새 예약하기</Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">안내사항</h3>
            <ul className="space-y-1 text-left text-sm text-blue-800">
              {/*TODO: Need to fix it later.*/}
              <li>• 예약 확정 여부는 SMS 또는 앱 알림으로 안내드립니다.</li>
              <li>• 예약 변경이나 취소는 예약일 1일 전까지 가능합니다.</li>
              <li>• 문의사항이 있으시면 고객센터로 연락주세요.</li>
              <li>• 서비스 완료 후 리뷰 작성시 포인트를 적립해드립니다.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
