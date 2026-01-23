'use client';

import { useSession, authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Redirect authenticated users to their role-specific dashboard
    if (session?.user?.role) {
      const userRole = session.user.role;
      if (userRole === 'ADMIN') {
        router.push('/admin/dashboard/overview');
      } else if (userRole === 'GROOMER') {
        router.push('/groomer/dashboard/overview');
      } else if (userRole === 'CUSTOMER') {
        router.push('/customer/dashboard/overview');
      }
    }
  }, [session, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/');
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-foreground text-2xl font-bold">미미살롱 대시보드</h1>
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground text-sm">
              안녕하세요, {session.user?.name}님
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="border-border bg-card rounded-lg border p-6">
            <h3 className="mb-2 text-lg font-semibold">내 반려동물</h3>
            <p className="text-muted-foreground">
              등록된 반려동물을 관리하고 정보를 업데이트하세요.
            </p>
            <Button className="mt-4" variant="outline">
              관리하기
            </Button>
          </div>

          <div className="border-border bg-card rounded-lg border p-6">
            <h3 className="mb-2 text-lg font-semibold">예약 관리</h3>
            <p className="text-muted-foreground">
              미용 예약을 확인하고 새로운 예약을 만들어보세요.
            </p>
            <Button className="mt-4" variant="outline">
              예약하기
            </Button>
          </div>

          <div className="border-border bg-card rounded-lg border p-6">
            <h3 className="mb-2 text-lg font-semibold">서비스 이력</h3>
            <p className="text-muted-foreground">지난 미용 서비스 이력과 리뷰를 확인하세요.</p>
            <Button className="mt-4" variant="outline">
              이력 보기
            </Button>
          </div>

          {session.user?.role === 'GROOMER' && (
            <div className="border-border bg-card rounded-lg border p-6">
              <h3 className="mb-2 text-lg font-semibold">미용사 관리</h3>
              <p className="text-muted-foreground">고객 예약을 관리하고 스케줄을 확인하세요.</p>
              <Button className="mt-4" variant="outline">
                관리하기
              </Button>
            </div>
          )}

          {session.user?.role === 'ADMIN' && (
            <div className="border-border bg-card rounded-lg border p-6">
              <h3 className="mb-2 text-lg font-semibold">관리자 패널</h3>
              <p className="text-muted-foreground">시스템 관리 및 사용자 관리 기능에 접근하세요.</p>
              <Button className="mt-4" variant="outline">
                관리자 패널
              </Button>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">최근 활동</h2>
          <div className="border-border rounded-lg border p-6">
            <p className="text-muted-foreground text-center">아직 활동 내역이 없습니다.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
