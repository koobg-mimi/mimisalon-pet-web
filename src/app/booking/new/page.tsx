/**
 * 예약 생성 페이지 (Thin Wrapper)
 *
 * 비즈니스 로직은 features/booking/으로 분리되어 있으며,
 * 이 페이지는 인증 체크와 기본 레이아웃만 담당합니다.
 */

'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useProfile } from '@/hooks/useProfile'
import { useBookingData } from '@/hooks/useBookingData'
import { BookingWizard } from '@/features/booking/components/booking-wizard'

export default function NewBookingPage() {
  const session = useSession()
  const router = useRouter()
  const { profile, isLoading: isProfileLoading, isCustomer } = useProfile()

  // 기본 데이터 조회 (pets만 필요)
  const { pets, isInitialLoading: isLoading } = useBookingData({
    enabled: profile && isCustomer,
  })

  // 인증 및 권한 체크
  useEffect(() => {
    if (!session.data) {
      router.push('/auth/signin')
    }
    if (profile && !isCustomer) {
      router.push('/dashboard')
    }
  }, [session.data, profile, isCustomer, router])

  // 로딩 상태
  if (session.isPending || isLoading || isProfileLoading || !profile || !pets) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // 반려동물 미등록
  if (pets.length === 0) {
    return (
      <div className="bg-background min-h-screen">
        <header className="border-border border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-foreground text-2xl font-bold">새 예약</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-md text-center">
            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <svg
                className="text-muted-foreground h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-foreground mb-2 text-lg font-medium">등록된 반려동물이 없습니다</h3>
            <p className="text-muted-foreground mb-4">
              예약을 하기 위해서는 먼저 반려동물을 등록해야 합니다.
            </p>
            <Button asChild>
              <Link href="/customer/pets">반려동물 등록</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // 메인 예약 위저드
  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" asChild>
              <Link href="/customer/bookings">예약 내역</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <BookingWizard pets={pets} profile={profile} />
      </main>
    </div>
  )
}
