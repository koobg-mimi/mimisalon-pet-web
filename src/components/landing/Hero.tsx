'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { ArrowRight, Calendar, Heart, LogIn, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function Hero() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLoginClick = () => {
    if (session?.user) {
      const userRole = session.user.role;
      if (userRole === 'ADMIN') {
        router.push('/admin/dashboard/overview');
      } else if (userRole === 'GROOMER') {
        router.push('/groomer/dashboard/overview');
      } else if (userRole === 'CUSTOMER') {
        router.push('/customer/dashboard/overview');
      }
    } else {
      router.push('/auth/signin');
    }
  };

  const handleBookingClick = () => {
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=/booking/new');
    } else {
      router.push('/booking/new');
    }
  };

  const isLoggedIn = !!session?.user;
  const currentUser = session?.user;

  return (
    <section data-cy="hero" className="container mx-auto px-4 py-20">
      <div className="space-y-8 text-center">
        <div className="space-y-4">
          <h2 className="text-4xl leading-tight font-bold md:text-6xl">
            우리 아이를 위한 <br />
            <span className="text-primary">프리미엄 방문미용</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            집에서 편안하게, 우리 아이에게 최고의 미용 서비스를 제공합니다.
          </p>
        </div>

        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 sm:max-w-none sm:flex-row">
          {isLoggedIn && currentUser ? (
            <Button
              variant="cta"
              size="xl"
              onClick={handleBookingClick}
              className="hover:shadow-3xl h-auto w-full transform px-8 py-4 text-lg font-bold tracking-wide shadow-2xl transition-all duration-300 hover:scale-105 sm:w-auto"
              aria-label="지금 바로 펫 미용 예약하기"
            >
              <Calendar className="mr-3 h-6 w-6" />
              지금 예약하기
              <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Button>
          ) : (
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                variant="cta"
                size="xl"
                onClick={handleBookingClick}
                className="hover:shadow-3xl group h-auto w-full transform px-8 py-4 text-lg font-bold tracking-wide shadow-2xl transition-all duration-300 hover:scale-105 sm:w-auto"
                aria-label="펫 미용 예약하기"
              >
                <Calendar className="mr-3 h-6 w-6" />
                예약하기
                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="cta-outline"
                size="xl"
                onClick={handleLoginClick}
                className="h-auto w-full px-8 py-4 text-lg font-semibold tracking-wide sm:w-auto"
                aria-label="로그인 또는 회원가입하기"
              >
                <LogIn className="mr-3 h-5 w-5" />
                로그인 / 회원가입
              </Button>
            </div>
          )}
        </div>

        {/* 로그인 안내 - 개선된 디자인 */}
        {!isLoggedIn && (
          <div className="relative">
            <div className="inline-flex items-center gap-3 rounded-xl border border-blue-200/60 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 text-sm font-medium text-blue-800 shadow-sm backdrop-blur-sm">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <span className="leading-relaxed">방문미용 예약은 고객 로그인이 필요합니다</span>
            </div>
            {/* 장식용 화살표 */}
            <div className="absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-r-[8px] border-b-[8px] border-l-[8px] border-r-transparent border-b-blue-100 border-l-transparent"></div>
          </div>
        )}
      </div>
    </section>
  );
}
