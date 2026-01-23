'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatsCard } from '@/components/stats/card';
import { StatsGrid } from '@/components/stats/grid';
import { EnhancedPagination } from '@/components/ui/pagination-enhanced';
import Link from 'next/link';
import { PaymentCard } from './_components/PaymentCard';
import { PaymentFilterButtons } from './_components/PaymentFilterButtons';
import { EmptyPaymentState } from './_components/EmptyPaymentState';
import { FilterType, FILTER_STATUS_MAP } from './_constants/payment-filters';
import { PaymentsResponse } from './_types/payment.types';

export default function CustomerPaymentsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터에서 초기값 읽기
  const [filter, setFilter] = useState<FilterType>(
    (searchParams.get('filter') as FilterType) || 'ALL'
  );
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 10);

  // URL 업데이트 함수
  const updateURL = (newPage: number, newLimit: number, newFilter: FilterType) => {
    const params = new URLSearchParams();
    params.set('page', newPage.toString());
    params.set('limit', newLimit.toString());
    if (newFilter !== 'ALL') {
      params.set('filter', newFilter);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
    }
    if (session?.user?.role && session.user.role !== 'CUSTOMER') {
      router.push('/dashboard');
    }
  }, [session, router]);

  const { data, isLoading } = useQuery<PaymentsResponse>({
    queryKey: ['customer', 'payments', page, filter, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // 서버 사이드 필터링 지원 - 여러 상태를 쉼표로 구분하여 전달
      if (filter !== 'ALL') {
        const statuses = FILTER_STATUS_MAP[filter];
        if (statuses) {
          params.append('status', statuses.join(','));
        }
      }

      const response = await fetch(`/api/customer/payments?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      return response.json();
    },
    enabled: !!session?.user && session.user.role === 'CUSTOMER',
  });

  const payments = data?.payments || [];
  const totalPages = data?.totalPages || 1;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateURL(newPage, limit, filter);
    // 페이지 변경 시 스크롤을 상단으로
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize: number) => {
    setLimit(newSize);
    setPage(1); // 페이지 크기 변경 시 첫 페이지로
    updateURL(1, newSize, filter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setPage(1); // 필터 변경 시 첫 페이지로
    updateURL(1, limit, newFilter);
  };

  const totalAmount = payments
    .filter((payment) => payment.status === 'PAID' || payment.status === 'COMPLETED')
    .reduce((sum, payment) => sum + payment.amount, 0);

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session || session.user?.role !== 'CUSTOMER') {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <PageHeader title="결제 내역" description="미용 서비스 결제 내역과 영수증을 확인하세요">
          <Button variant="outline" asChild>
            <Link href="/customer/dashboard/overview">대시보드</Link>
          </Button>
        </PageHeader>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* <StatsGrid>
          <StatsCard
            title="총 결제 금액"
            value={`${totalAmount.toLocaleString()}원`}
            icon={
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
            }
            iconBgColor="bg-primary/10"
          />

          <StatsCard
            title="완료된 결제"
            value={`${payments.filter((p) => p.status === 'PAID' || p.status === 'COMPLETED').length}건`}
            icon={
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            }
            iconBgColor="bg-green-100"
          />

          <StatsCard
            title="이번 달 결제"
            value={`${payments
              .filter((p) => {
                const paymentDate = new Date(p.createdAt);
                const currentDate = new Date();
                return (
                  paymentDate.getMonth() === currentDate.getMonth() &&
                  paymentDate.getFullYear() === currentDate.getFullYear() &&
                  (p.status === 'PAID' || p.status === 'COMPLETED')
                );
              })
              .reduce((sum, p) => sum + p.amount, 0)
              .toLocaleString()}원`}
            icon={
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
            }
            iconBgColor="bg-blue-100"
          />
        </StatsGrid> */}

        <PaymentFilterButtons activeFilter={filter} onFilterChange={handleFilterChange} />

        {payments.length === 0 ? (
          <EmptyPaymentState filter={filter} />
        ) : (
          <div className="space-y-8">
            <div className="grid gap-6">
              {payments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 0 && (
              <div className="mt-8">
                <EnhancedPagination
                  currentPage={page}
                  totalPages={totalPages}
                  pageSize={limit}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  pageSizeOptions={[10, 20, 50]}
                  showPageSizeSelector={true}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
