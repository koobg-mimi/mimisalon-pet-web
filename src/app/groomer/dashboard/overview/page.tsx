'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { PageHeader } from '@/components/layout/PageHeader'
import { formatTimeDisplay } from '@/lib/date-utils'
import { GroomerOverviewStats } from '@/types/groomer'
import { RefreshCw, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { PendingBookingCard } from '@/components/groomer/pending-booking-card'
import { StatsCard } from '@/components/stats/card'
import { StatsGrid } from '@/components/stats/grid'

const fetchGroomerStats = async (): Promise<GroomerOverviewStats> => {
  const response = await fetch('/api/groomer/dashboard/overview')

  if (!response.ok) {
    throw new Error('데이터를 불러오는데 실패했습니다')
  }

  return response.json()
}

export default function GroomerDashboardOverviewPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()

  const {
    data: stats,
    isLoading,
    error,
    refetch,
    isFetching,
    dataUpdatedAt,
  } = useQuery<GroomerOverviewStats>({
    queryKey: ['groomer', 'dashboard', 'overview'],
    queryFn: fetchGroomerStats,
    enabled: session?.user?.role === 'GROOMER',
    refetchInterval: 5 * 60 * 1000, // 5 minutes auto refetch
    refetchIntervalInBackground: true,
    staleTime: 1 * 60 * 1000, // Consider data stale after 1 minute
  })

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
    if (session?.user?.role && session.user.role !== 'GROOMER') {
      router.push('/dashboard')
    }
  }, [session, router])

  const handleRefresh = () => {
    refetch()
  }

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt) : null

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/groomer/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'GROOMER_CONFIRM',
        }),
      })

      if (!response.ok) {
        throw new Error('예약 확정에 실패했습니다')
      }

      // Refresh the stats to update the UI
      queryClient.invalidateQueries({ queryKey: ['groomer', 'dashboard', 'overview'] })

      // Show success message (you could add a toast notification here)
      console.log('예약이 성공적으로 확정되었습니다')
    } catch (error) {
      console.error('Failed to confirm booking:', error)
      // Handle error (you could show an error toast here)
    }
  }

  const handleRejectBooking = async (bookingId: string, reason?: string) => {
    try {
      const response = await fetch(`/api/groomer/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'SERVICE_CANCELLED',
          reason: reason || '미용사가 예약을 거절했습니다',
        }),
      })

      if (!response.ok) {
        throw new Error('예약 거절에 실패했습니다')
      }

      // Refresh the stats to update the UI
      queryClient.invalidateQueries({ queryKey: ['groomer', 'dashboard', 'overview'] })

      // Show success message (you could add a toast notification here)
      console.log('예약이 성공적으로 거절되었습니다')
    } catch (error) {
      console.error('Failed to reject booking:', error)
      // Handle error (you could show an error toast here)
    }
  }

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
    )
  }

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'GROOMER') {
    return null
  }

  if (error && !stats) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
    return (
      <div className="bg-background min-h-screen">
        <header className="border-border border-b">
          <PageHeader
            title="미용사 개요"
            description={`${session.user?.name} 미용사님의 활동 현황을 확인하세요`}
          />
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <RefreshCw className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-foreground mb-2 text-lg font-medium">
              데이터를 불러올 수 없습니다
            </h3>
            <p className="text-muted-foreground mb-4">{errorMessage}</p>
            <Button onClick={() => refetch()} disabled={isLoading}>
              {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              다시 시도
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <PageHeader
          title="미용사 개요"
          description={`${session.user?.name} 미용사님의 활동 현황을 확인하세요`}
        >
          <div className="mr-4 flex flex-col items-end">
            {lastUpdated && (
              <span className="text-muted-foreground text-xs">
                마지막 업데이트: {format(lastUpdated, 'HH:mm:ss', { locale: ko })}
              </span>
            )}
            {error && <span className="text-xs text-red-500">업데이트 오류 발생</span>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
          <Button asChild>
            <Link href="/groomer/dashboard/bookings">예약 관리</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/groomer/dashboard/overview">대시보드</Link>
          </Button>
        </PageHeader>
      </header>

      <main className="container mx-auto px-4 py-8">
        {stats && (
          <>
            {/* Pending Confirmation Section */}
            {stats.pendingBookings && stats.pendingBookings.length > 0 && (
              <div className="mb-8">
                <div className="mb-6 flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                  <h2 className="text-foreground text-xl font-bold">확인이 필요한 예약</h2>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                    {stats.pendingBookings.length}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {stats.pendingBookings.map((booking) => (
                    <PendingBookingCard
                      key={booking.id}
                      booking={booking}
                      onConfirm={handleConfirmBooking}
                      onReject={handleRejectBooking}
                      isLoading={isFetching}
                    />
                  ))}
                </div>
              </div>
            )}

            <StatsGrid>
              <StatsCard
                title="오늘 예약"
                value={`${stats.todayBookings}건`}
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

              <StatsCard
                title="이번 주 예약"
                value={`${stats.weeklyBookings}건`}
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                }
                iconBgColor="bg-green-100"
              />

              <StatsCard
                title="월 수익"
                value={`${stats.monthlyRevenue.toLocaleString('ko-KR')}원`}
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
                title="완료율"
                value={`${stats.completionRate}%`}
                icon={
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                iconBgColor="bg-purple-100"
              />
            </StatsGrid>

            <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="border-border bg-card rounded-lg border p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">평점 현황</h2>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/groomer/dashboard/reviews">전체 보기</Link>
                  </Button>
                </div>
                <div className="mb-4 text-center">
                  {stats.totalReviews === 0 ? (
                    <>
                      <div className="text-muted-foreground mb-2 text-3xl font-bold">-</div>
                      <div className="mb-2 flex justify-center">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className="h-4 w-4 text-gray-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm">아직 리뷰가 없습니다</p>
                    </>
                  ) : (
                    <>
                      <div className="text-primary mb-2 text-3xl font-bold">
                        {stats.averageRating.toFixed(1)}
                      </div>
                      <div className="mb-2 flex justify-center">
                        {renderStars(Math.round(stats.averageRating))}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {stats.totalReviews}개 리뷰 기준
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="border-border bg-card rounded-lg border p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">오늘의 일정</h2>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/groomer/dashboard/bookings?filter=today">전체 보기</Link>
                  </Button>
                </div>
                {stats.upcomingBookings.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="bg-muted mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                      <svg
                        className="text-muted-foreground h-6 w-6"
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
                    <p className="text-muted-foreground">오늘 예약이 없습니다</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.upcomingBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-muted/50 flex items-center gap-3 rounded-lg p-3"
                      >
                        <div className="text-primary text-sm font-medium">
                          {formatTimeDisplay(booking.time)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{booking.service.name}</p>
                          <p className="text-muted-foreground text-sm">
                            {booking.customer.name} • {booking.pet.name} (
                            {booking.pet.breed || '정보없음'})
                          </p>
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {booking.service.duration}분
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">최근 리뷰</h2>
                <Button variant="outline" asChild>
                  <Link href="/groomer/dashboard/reviews">전체 보기</Link>
                </Button>
              </div>

              {stats.recentReviews.length === 0 ? (
                <div className="border-border rounded-lg border p-8 text-center">
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-medium">아직 리뷰가 없습니다</h3>
                  <p className="text-muted-foreground">
                    서비스를 완료하면 고객들의 리뷰를 받을 수 있습니다.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {stats.recentReviews.map((review) => (
                    <div key={review.id} className="border-border bg-card rounded-lg border p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.customer.name}</span>
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-muted-foreground text-xs">
                          {format(new Date(review.createdAt), 'yyyy-MM-dd', { locale: ko })}
                        </span>
                      </div>
                      {review.content && review.content.trim() ? (
                        <p className="text-foreground text-sm">{review.content}</p>
                      ) : (
                        <p className="text-muted-foreground text-sm italic">리뷰 내용이 없습니다</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="border-border bg-card rounded-lg border p-6">
            <h3 className="mb-2 text-lg font-semibold">예약 관리</h3>
            <p className="text-muted-foreground mb-4">오늘의 예약을 확인하고 관리하세요.</p>
            <Button asChild className="w-full">
              <Link href="/groomer/dashboard/bookings">예약 보기</Link>
            </Button>
          </div>

          <div className="border-border bg-card rounded-lg border p-6">
            <h3 className="mb-2 text-lg font-semibold">일정 설정</h3>
            <p className="text-muted-foreground mb-4">근무 시간과 가능한 일정을 관리하세요.</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/groomer/dashboard/availability">일정 관리</Link>
            </Button>
          </div>

          <div className="border-border bg-card rounded-lg border p-6">
            <h3 className="mb-2 text-lg font-semibold">프로필 관리</h3>
            <p className="text-muted-foreground mb-4">프로필과 서비스 정보를 업데이트하세요.</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/groomer/dashboard/profile">프로필 설정</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
