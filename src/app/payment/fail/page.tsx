'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CUSTOMER_SERVICE } from '@/lib/constants/customer-service';

export default function PaymentFailPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || '알 수 없는 오류가 발생했습니다';
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
    }
    if (session?.user?.role && session.user.role !== 'CUSTOMER') {
      router.push('/dashboard');
    }
  }, [session, router]);

  const commonReasons = [
    {
      key: 'cancel',
      title: '결제 취소',
      description: '사용자가 결제를 취소하였습니다.',
      solutions: [
        "다시 결제를 진행하시려면 아래 '다시 결제하기' 버튼을 클릭해주세요",
        "예약 내용을 수정하시려면 '예약 관리'에서 확인해주세요",
        '문의사항이 있으시면 고객센터로 연락주세요',
      ],
    },
    {
      key: 'insufficient_funds',
      title: '잔액 부족',
      description: '결제 수단의 잔액이나 한도가 부족합니다.',
      solutions: [
        '계좌 잔액을 확인하고 충분한 금액을 입금해주세요',
        '신용카드의 경우 사용 한도를 확인해주세요',
        '다른 결제 수단을 이용해보세요',
      ],
    },
    {
      key: 'invalid_card',
      title: '카드 정보 오류',
      description: '입력하신 카드 정보가 올바르지 않습니다.',
      solutions: [
        '카드번호, 유효기간, CVC 번호를 다시 확인해주세요',
        '카드 소유자명을 정확히 입력했는지 확인해주세요',
        '카드가 온라인 결제 차단 상태인지 확인해주세요',
      ],
    },
    {
      key: 'expired_card',
      title: '카드 유효기간 만료',
      description: '사용하신 카드의 유효기간이 만료되었습니다.',
      solutions: ['유효기간이 지나지 않은 다른 카드를 사용해주세요', '카드 재발급을 신청해주세요'],
    },
    {
      key: 'network_error',
      title: '네트워크 오류',
      description: '일시적인 네트워크 오류가 발생했습니다.',
      solutions: [
        '잠시 후 다시 시도해주세요',
        '인터넷 연결 상태를 확인해주세요',
        '다른 브라우저나 기기에서 시도해보세요',
      ],
    },
  ];

  const getReasonInfo = (reason: string) => {
    // Check for cancellation keywords in Korean or English
    if (
      reason.includes('취소') ||
      reason.toLowerCase().includes('cancel') ||
      reason.includes('CANCELED') ||
      reason.includes('PAY_PROCESS_CANCELED')
    ) {
      return commonReasons.find((r) => r.key === 'cancel')!;
    }

    const found = commonReasons.find((r) => reason.toLowerCase().includes(r.key));
    return (
      found || {
        title: '결제 실패',
        description: reason,
        solutions: [
          '카드 정보를 다시 확인해주세요',
          '다른 결제 수단을 이용해보세요',
          '문제가 지속되면 고객센터로 문의해주세요',
        ],
      }
    );
  };

  const reasonInfo = getReasonInfo(reason);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'CUSTOMER') {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-10 w-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-foreground mb-2 text-3xl font-bold">결제에 실패했습니다</h1>
            <p className="text-muted-foreground">
              결제 처리 중 문제가 발생했습니다. 아래 안내를 확인해주세요.
            </p>
          </div>

          <div className="border-border bg-card mb-8 rounded-lg border p-6 text-left">
            <div className="mb-4 flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-4 w-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.084 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-foreground mb-1 text-lg font-semibold">{reasonInfo.title}</h2>
                <p className="text-muted-foreground mb-4">{reasonInfo.description}</p>
              </div>
            </div>

            <div>
              <h3 className="text-foreground mb-3 font-semibold">해결 방법</h3>
              <ul className="space-y-2">
                {reasonInfo.solutions.map((solution, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full"></span>
                    <span className="text-muted-foreground text-sm">{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {bookingId ? (
                <Button asChild className="w-full">
                  <Link href={`/payment/checkout?bookingId=${bookingId}`}>
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    다시 결제하기
                  </Link>
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/booking/new">
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    새 예약하기
                  </Link>
                </Button>
              )}

              <Button asChild variant="outline" className="w-full">
                <Link href="/customer/bookings">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  예약 내역
                </Link>
              </Button>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link href="/customer/dashboard/overview">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                대시보드로 돌아가기
              </Link>
            </Button>
          </div>

          <div className="mt-8 rounded-lg bg-amber-50 p-4">
            <h3 className="mb-2 font-semibold text-amber-900">도움이 필요하신가요?</h3>
            <div className="space-y-2 text-sm text-amber-800">
              <p>결제 문제가 계속 발생하면 아래 방법으로 문의해주세요:</p>
              <div className="flex flex-col justify-center gap-2 sm:flex-row">
                <Button size="sm" variant="outline" className="border-amber-300 text-amber-800">
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {CUSTOMER_SERVICE.PHONE}
                </Button>
                <Button size="sm" variant="outline" className="border-amber-300 text-amber-800">
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  1:1 문의
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
