'use client';

/**
 *
 * @deprecated
 * this page is deprecated remove it
 */

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PageHeader } from '@/components/layout/PageHeader';
import Link from 'next/link';
import { PhoneVerificationStatusBanner } from '@/components/auth/phone-verification-status-banner';

interface GroomerStats {
  todayBookings: number;
  weeklyBookings: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
}

export default function GroomerDashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
    }
    if (session?.user?.role && session.user.role !== 'GROOMER') {
      router.push('/dashboard');
    }
  }, [session, router]);

  const { data: stats, isLoading } = useQuery<GroomerStats>({
    queryKey: ['groomer', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/groomer/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      return response.json();
    },
    enabled: !!session?.user && session.user.role === 'GROOMER',
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session || session.user?.role !== 'GROOMER') {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <PageHeader
          title="미용사 대시보드"
          description={`안녕하세요, ${session.user?.name} 미용사님`}
        >
          <Button asChild>
            <Link href="/dashboard">메인 대시보드</Link>
          </Button>
        </PageHeader>
      </header>

      {/* Phone Verification Status - Read-only banner that directs to profile for changes */}
      <div className="container mx-auto px-4 pt-4">
        {!session?.user?.phoneNumberVerified && (
          <PhoneVerificationStatusBanner userRole="GROOMER" />
        )}
      </div>

      <main className="container mx-auto px-4 py-8">
        {stats && (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="border-border bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">오늘 예약</p>
                  <p className="text-foreground text-2xl font-bold">{stats.todayBookings}건</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <svg
                    className="h-6 w-6 text-blue-600"
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
                </div>
              </div>
            </div>

            <div className="border-border bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">이번 주 예약</p>
                  <p className="text-foreground text-2xl font-bold">{stats.weeklyBookings}건</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="border-border bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">월 수익</p>
                  <p className="text-foreground text-2xl font-bold">
                    {stats.monthlyRevenue.toLocaleString('ko-KR')}원
                  </p>
                </div>
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                  <svg
                    className="text-primary h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="border-border bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">평균 별점</p>
                  <div className="flex items-center gap-2">
                    <p className="text-foreground text-2xl font-bold">
                      {stats.averageRating.toFixed(1)}
                    </p>
                    {renderStars(Math.round(stats.averageRating))}
                  </div>
                  <p className="text-muted-foreground text-xs">{stats.totalReviews}개 리뷰</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                  <svg className="h-6 w-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="border-border bg-card rounded-lg border p-6">
            <h3 className="mb-2 text-lg font-semibold">예약 관리</h3>
            <p className="text-muted-foreground mb-4">고객 예약을 확인하고 스케줄을 관리하세요.</p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/groomer/dashboard/bookings">예약 관리</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/groomer/dashboard/bookings?filter=today">오늘 예약</Link>
              </Button>
            </div>
          </div>

          <div className="border-border bg-card rounded-lg border p-6">
            <h3 className="mb-2 text-lg font-semibold">일정 관리</h3>
            <p className="text-muted-foreground mb-4">근무 시간과 가능한 일정을 설정하세요.</p>
            <Button asChild className="w-full">
              <Link href="/groomer/dashboard/availability">일정 설정</Link>
            </Button>
          </div>

          <div className="border-border bg-card rounded-lg border p-6">
            <h3 className="mb-2 text-lg font-semibold">지점 관리</h3>
            <p className="text-muted-foreground mb-4">근무하는 지점과 서비스를 관리하세요.</p>
            <Button asChild className="w-full">
              <Link href="/groomer/dashboard/locations">지점 관리</Link>
            </Button>
          </div>

          <div className="border-border bg-card rounded-lg border p-6">
            <h3 className="mb-2 text-lg font-semibold">리뷰 관리</h3>
            <p className="text-muted-foreground mb-4">고객 리뷰를 확인하고 답변하세요.</p>
            <Button asChild className="w-full">
              <Link href="/groomer/dashboard/reviews">리뷰 관리</Link>
            </Button>
          </div>

          <div className="border-border bg-card rounded-lg border p-6">
            <h3 className="mb-2 text-lg font-semibold">프로필 설정</h3>
            <p className="text-muted-foreground mb-4">프로필과 서비스 정보를 관리하세요.</p>
            <Button asChild className="w-full">
              <Link href="/groomer/dashboard/profile">프로필 설정</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">오늘의 일정</h2>
          <div className="border-border rounded-lg border p-6">
            <p className="text-muted-foreground text-center">오늘 예약된 일정이 없습니다.</p>
            <div className="mt-4 text-center">
              <Button asChild>
                <Link href="/groomer/dashboard/availability">일정 설정하기</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">빠른 액션</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" asChild>
              <Link href="/groomer/dashboard/bookings">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                예약 확인
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/groomer/dashboard/availability">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                일정 추가
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/groomer/dashboard/profile">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                설정
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
