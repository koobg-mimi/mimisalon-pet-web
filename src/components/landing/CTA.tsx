'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { ArrowRight, Calendar, LogIn } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export function CTA() {
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
    <section data-cy="cta" className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <Card className="from-primary via-primary to-primary/90 relative overflow-hidden bg-gradient-to-br text-white">
          {/* 배경 장식 */}
          <div className="absolute inset-0 -skew-y-1 transform bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-32 -translate-y-32 transform rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-24 translate-y-24 transform rounded-full bg-white/10 blur-3xl"></div>

          <CardContent className="relative p-8 text-center sm:p-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-3xl leading-tight font-bold text-white sm:text-4xl">
                  우리 아이를 위한 특별한 케어
                </h3>
                <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/95 sm:text-xl">
                  우리 아이에게 최고의 미용 서비스를 제공합니다.
                  <br className="hidden sm:block" />
                  지금 예약하고 특별한 경험을 선사해보세요.
                </p>
              </div>

              <div className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 sm:flex-row">
                {isLoggedIn && currentUser ? (
                  <Button
                    size="xl"
                    variant="outline"
                    onClick={handleBookingClick}
                    className="text-primary hover:shadow-3xl group h-auto w-full transform border-2 border-white bg-white px-8 py-4 text-lg font-bold shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 sm:w-auto"
                    aria-label="지금 바로 펫 미용 예약하기"
                  >
                    <Calendar className="mr-3 h-6 w-6" />
                    지금 바로 예약하기
                    <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                    <Button
                      size="xl"
                      variant="outline"
                      onClick={handleBookingClick}
                      className="text-primary hover:shadow-3xl group h-auto w-full transform border-2 border-white bg-white px-8 py-4 text-lg font-bold shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 sm:w-auto"
                      aria-label="펫 미용 예약하기"
                    >
                      <Calendar className="mr-3 h-6 w-6" />
                      예약하기
                      <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button
                      size="xl"
                      variant="ghost"
                      onClick={handleLoginClick}
                      className="h-auto w-full border-2 border-white/80 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/20 sm:w-auto"
                      aria-label="로그인하기"
                    >
                      <LogIn className="mr-3 h-5 w-5" />
                      로그인하기
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
