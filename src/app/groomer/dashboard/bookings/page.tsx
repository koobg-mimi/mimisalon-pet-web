'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { PageHeader } from '@/components/layout/PageHeader'
import { QuoteModal } from '@/components/groomer/quote-modal'
import Link from 'next/link'
import { BookingStatus } from '@mimisalon/shared'

interface Booking {
  id: string
  bookingNumber: string
  date: string
  time: string
  status: string
  dbStatus: string // 원본 DB 상태
  paymentStatus: string
  customer: {
    id: string
    name: string
    phone?: string
    email: string
  }
  pets: Array<{
    id: string
    name: string
    breed: string
    weight?: number
    age?: number
    specialNotes?: string
    services: Array<{
      id: string
      name: string
      category: string
      price: number
      duration: number
    }>
  }>
  location?: {
    name: string
    address: string
    detailAddress?: string
    zipCode?: string
  }
  serviceType: string
  serviceDescription?: string
  specialRequests?: string
  totalPrice: number
  estimatedDuration: number
  createdAt: string
}

interface PaginationInfo {
  page: number
  limit: number
  totalPages: number
  totalCount: number
  hasNext: boolean
  hasPrev: boolean
}

export default function GroomerBookingsPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<
    'ALL' | 'TODAY' | 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  >('ALL')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
    if (session?.user?.role && session.user.role !== 'GROOMER') {
      router.push('/dashboard')
    }
  }, [session, router])

  useEffect(() => {
    const filterParam = searchParams.get('filter')
    if (filterParam === 'today') {
      setFilter('TODAY')
    }
  }, [searchParams])

  const { data, isLoading } = useQuery({
    queryKey: ['groomer', 'bookings', filter, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        filter: filter,
        page: currentPage.toString(),
        limit: '10',
        sortBy: 'serviceDate',
        sortOrder: 'desc',
      })

      const response = await fetch(`/api/groomer/bookings?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }
      return response.json()
    },
    enabled: !!session?.user && session.user.role === 'GROOMER',
  })

  const bookings = data?.bookings || []
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  }

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      bookingId,
      newStatus,
    }: {
      bookingId: string
      newStatus: BookingStatus
    }) => {
      const response = await fetch(`/api/groomer/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) {
        throw new Error('Failed to update booking status')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groomer', 'bookings'] })
    },
  })

  const handleUpdateStatus = (bookingId: string, newStatus: BookingStatus) => {
    updateStatusMutation.mutate({ bookingId, newStatus })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50'
      case 'CONFIRMED':
        return 'text-blue-600 bg-blue-50'
      case 'IN_PROGRESS':
        return 'text-purple-600 bg-purple-50'
      case 'COMPLETED':
        return 'text-green-600 bg-green-50'
      case 'CANCELLED':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '고객 결제 완료 (확인 필요)'
      case 'CONFIRMED':
        return '예약 확정'
      case 'IN_PROGRESS':
        return '진행중'
      case 'COMPLETED':
        return '완료'
      case 'CANCELLED':
        return '취소'
      default:
        return status
    }
  }

  const isToday = (dateString: string) => {
    const today = new Date()
    const bookingDate = new Date(dateString)
    return bookingDate.toDateString() === today.toDateString()
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

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <PageHeader title="예약 관리" description="고객 예약을 확인하고 관리하세요">
          <Button variant="outline" asChild>
            <Link href="/groomer/dashboard/overview">대시보드</Link>
          </Button>
        </PageHeader>
      </header>

      <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {['ALL', 'TODAY', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(
              (status) => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm"
                  onClick={() =>
                    setFilter(
                      status as
                        | 'ALL'
                        | 'TODAY'
                        | 'PENDING'
                        | 'CONFIRMED'
                        | 'IN_PROGRESS'
                        | 'COMPLETED'
                        | 'CANCELLED'
                    )
                  }
                >
                  {status === 'ALL'
                    ? '전체'
                    : status === 'TODAY'
                      ? '오늘'
                      : status === 'IN_PROGRESS'
                        ? '진행중'
                        : getStatusText(status)}
                </Button>
              )
            )}
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="py-8 text-center sm:py-12">
            <div className="bg-muted mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16">
              <svg
                className="text-muted-foreground h-6 w-6 sm:h-8 sm:w-8"
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
            <h3 className="text-foreground mb-2 text-base font-medium sm:text-lg">
              {filter === 'ALL'
                ? '예약이 없습니다'
                : filter === 'TODAY'
                  ? '오늘 예약이 없습니다'
                  : `${getStatusText(filter)} 예약이 없습니다`}
            </h3>
            <p className="text-muted-foreground px-4 text-sm sm:text-base">
              새로운 예약이 들어오면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {bookings.map((booking: Booking) => (
              <div key={booking.id} className="border-border bg-card rounded-lg border p-4 sm:p-6">
                <div className="mb-4">
                  <div className="flex-1">
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <h3 className="text-base font-semibold sm:text-lg">
                        예약번호: {booking.bookingNumber}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusText(booking.status)}
                        </span>
                        {isToday(booking.date) && (
                          <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                            오늘
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 sm:gap-4 sm:text-sm">
                      <div>
                        <p className="text-foreground text-sm font-medium sm:text-base">
                          {booking.customer.name}
                        </p>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                          {booking.customer.phone || '연락처 없음'}
                        </p>
                      </div>
                      <div>
                        {booking.pets.map((pet: Booking['pets'][number], idx: number) => (
                          <div key={pet.id} className={idx > 0 ? 'mt-2' : ''}>
                            <p className="text-foreground text-sm font-medium sm:text-base">
                              {pet.name} ({pet.breed})
                            </p>
                            {pet.weight && (
                              <p className="text-muted-foreground text-xs sm:text-sm">
                                {pet.weight}kg
                              </p>
                            )}
                            <div className="text-muted-foreground text-xs break-words">
                              {pet.services
                                .map((s: Booking['pets'][number]['services'][number]) => s.name)
                                .join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-medium sm:text-base">
                          {booking.date} {booking.time}
                        </p>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                          {booking.estimatedDuration}분 •{' '}
                          {booking.totalPrice.toLocaleString('ko-KR')}원
                        </p>
                      </div>
                      <div>
                        {booking.location ? (
                          <>
                            <p className="text-foreground text-sm font-medium sm:text-base">
                              {booking.location.name}
                            </p>
                            <p className="text-muted-foreground text-xs break-words sm:text-sm">
                              {booking.location.address}
                            </p>
                            {booking.location.detailAddress && (
                              <p className="text-muted-foreground text-xs break-words">
                                {booking.location.detailAddress}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-muted-foreground text-xs sm:text-sm">주소 정보 없음</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button variant="outline" className="w-full text-xs sm:w-auto sm:text-sm" asChild>
                    <Link href={`/groomer/dashboard/bookings/${booking.id}`}>상세보기</Link>
                  </Button>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    {/* DB 상태에 따른 버튼 렌더링 */}
                    {(booking.dbStatus === 'GROOMER_CONFIRM_PENDING' ||
                      booking.dbStatus === 'FIRST_PAYMENT_COMPLETE') && (
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                          className="w-full text-xs sm:w-auto sm:text-sm"
                          onClick={() =>
                            handleUpdateStatus(booking.id, BookingStatus.GROOMER_CONFIRM)
                          }
                        >
                          확정
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full text-xs sm:w-auto sm:text-sm"
                          onClick={() =>
                            handleUpdateStatus(booking.id, BookingStatus.SERVICE_CANCELLED)
                          }
                        >
                          취소
                        </Button>
                      </div>
                    )}
                    {booking.dbStatus === 'GROOMER_CONFIRM' && (
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <QuoteModal
                          bookingId={booking.id}
                          onQuoteSubmitted={() => {
                            // 견적 전송 후 예약 목록 새로고침
                            queryClient.invalidateQueries({ queryKey: ['groomer', 'bookings'] })
                          }}
                          trigger={
                            <Button
                              className="w-full text-xs sm:w-auto sm:text-sm"
                              variant="outline"
                            >
                              견적 보내기
                            </Button>
                          }
                        />
                        <Button
                          className="w-full text-xs sm:w-auto sm:text-sm"
                          onClick={() =>
                            handleUpdateStatus(booking.id, BookingStatus.WORK_IN_PROGRESS)
                          }
                        >
                          바로 시작
                        </Button>
                      </div>
                    )}
                    {booking.dbStatus === 'WORK_IN_PROGRESS' && (
                      <Button
                        className="w-full text-xs sm:w-auto sm:text-sm"
                        onClick={() =>
                          handleUpdateStatus(booking.id, BookingStatus.SERVICE_COMPLETED)
                        }
                      >
                        완료
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 UI */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 sm:mt-8">
            {/* 모바일 페이지네이션 */}
            <div className="flex items-center justify-center gap-2 sm:hidden">
              <Button
                variant="outline"
                className="px-3 py-2 text-xs"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrev || isLoading}
              >
                이전
              </Button>

              <div className="px-3 py-2 text-xs">
                <span className="font-medium">{currentPage}</span>
                <span className="text-muted-foreground"> / {pagination.totalPages}</span>
              </div>

              <Button
                variant="outline"
                className="px-3 py-2 text-xs"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNext || isLoading}
              >
                다음
              </Button>
            </div>

            {/* 데스크탑 페이지네이션 */}
            <div className="hidden items-center justify-center gap-2 sm:flex">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrev || isLoading}
              >
                이전
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum: number
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={isLoading}
                      className="min-w-[40px]"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNext || isLoading}
              >
                다음
              </Button>

              <span className="text-muted-foreground ml-4 text-sm">
                전체 {pagination.totalCount}개 중 {(currentPage - 1) * pagination.limit + 1}-
                {Math.min(currentPage * pagination.limit, pagination.totalCount)}
                번째
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
