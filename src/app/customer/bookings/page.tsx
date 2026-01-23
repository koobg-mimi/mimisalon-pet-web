'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { PageHeader } from '@/components/layout/PageHeader'
import { EnhancedPagination } from '@/components/ui/pagination-enhanced'
import Link from 'next/link'
import { BookingCard } from './_components/BookingCard'
import { BookingFilterButtons } from './_components/BookingFilterButtons'
import { EmptyBookingState } from './_components/EmptyBookingState'
import { FilterType, FILTER_STATUS_MAP } from './_constants/booking-filters'
import { BookingsResponse } from './_types/booking.types'
import { usePublicEnv } from '@/lib/queries/env'

export default function CustomerBookingsPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL 쿼리 파라미터에서 초기값 읽기
  const [filter, setFilter] = useState<FilterType>(
    (searchParams.get('filter') as FilterType) || 'ALL'
  )
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 10)

  // URL 업데이트 함수
  const updateURL = (newPage: number, newLimit: number, newFilter: FilterType) => {
    const params = new URLSearchParams()
    params.set('page', newPage.toString())
    params.set('limit', newLimit.toString())
    if (newFilter !== 'ALL') {
      params.set('filter', newFilter)
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const { data, isLoading } = useQuery<BookingsResponse>({
    queryKey: ['customer', 'bookings', page, filter, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      // 서버 사이드 필터링 지원 - 여러 상태를 쉼표로 구분하여 전달
      if (filter !== 'ALL') {
        const statuses = FILTER_STATUS_MAP[filter]
        if (statuses) {
          params.append('status', statuses.join(','))
        }
      }

      const response = await fetch(`/api/customer/bookings?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }
      return response.json()
    },
    enabled: !!session?.user && session.user.role === 'CUSTOMER',
  })

  const bookings = data?.bookings || []
  const totalPages = data?.totalPages || 1

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
    if (session?.user?.role && session.user.role !== 'CUSTOMER') {
      router.push('/dashboard')
    }
  }, [session, router])

  const { data: envConfig } = usePublicEnv()

  const handleContactCustomerService = () => {
    const phoneNumber = envConfig?.NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE || '1588-1234'
    if (confirm(`고객센터로 연결하시겠습니까?\n전화번호: ${phoneNumber}`)) {
      window.location.href = `tel:${phoneNumber}`
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    updateURL(newPage, limit, filter)
    // 페이지 변경 시 스크롤을 상단으로
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageSizeChange = (newSize: number) => {
    setLimit(newSize)
    setPage(1) // 페이지 크기 변경 시 첫 페이지로
    updateURL(1, newSize, filter)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter)
    setPage(1) // 필터 변경 시 첫 페이지로
    updateURL(1, limit, newFilter)
  }

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'CUSTOMER') {
    return null
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <PageHeader title="예약 관리" description="미용 예약을 확인하고 관리하세요">
          <Button asChild>
            <Link href="/booking/new">새 예약</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/customer/dashboard/overview">대시보드</Link>
          </Button>
        </PageHeader>
      </header>

      <main className="container mx-auto px-4 py-8">
        <BookingFilterButtons activeFilter={filter} onFilterChange={handleFilterChange} />

        {bookings.length === 0 ? (
          <EmptyBookingState filter={filter} />
        ) : (
          <div className="space-y-8">
            <div className="grid gap-6">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onContactCustomerService={handleContactCustomerService}
                />
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
  )
}
