'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { Calendar } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { Skeleton } from '@/components/ui/skeleton'

interface RecentBookingsProps {
  limit?: number
}

export function RecentBookings({ limit = 5 }: RecentBookingsProps) {
  const { data: stats, isLoading } = useDashboardStats()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'FIRST_PAYMENT_PENDING':
        return 'text-yellow-600 bg-yellow-50'
      case 'CONFIRMED':
      case 'FIRST_PAYMENT_COMPLETED':
        return 'text-blue-600 bg-blue-50'
      case 'COMPLETED':
      case 'FINAL_PAYMENT_COMPLETED':
        return 'text-green-600 bg-green-50'
      case 'CANCELLED':
        return 'text-red-600 bg-red-50'
      case 'IN_PROGRESS':
        return 'text-purple-600 bg-purple-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '대기중'
      case 'FIRST_PAYMENT_PENDING':
        return '1차 결제 대기'
      case 'FIRST_PAYMENT_COMPLETED':
        return '1차 결제 완료'
      case 'CONFIRMED':
        return '확정'
      case 'IN_PROGRESS':
        return '진행중'
      case 'COMPLETED':
        return '완료'
      case 'FINAL_PAYMENT_COMPLETED':
        return '최종 결제 완료'
      case 'CANCELLED':
        return '취소'
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="border-border rounded-lg border p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-border rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const recentBookings = stats?.recentBookings.slice(0, limit) || []

  return (
    <div className="border-border bg-card rounded-lg border p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold md:text-xl">최근 예약</h2>
        <Button variant="outline" size="sm" asChild>
          <Link href="/customer/bookings">전체 보기</Link>
        </Button>
      </div>

      {recentBookings.length === 0 ? (
        <div className="py-8 text-center">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Calendar className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="text-foreground mb-2 text-lg font-medium">예약 내역이 없습니다</h3>
          <p className="text-muted-foreground mb-4">첫 번째 미용 예약을 만들어보세요.</p>
          <Button asChild>
            <Link href="/booking/new">예약하기</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="border-border hover:bg-accent/50 rounded-lg border p-4 transition-colors"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-sm font-semibold md:text-base">{booking.service.name}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    {booking.groomer.name} •{' '}
                    {format(new Date(booking.date), 'yyyy-MM-dd', { locale: ko })}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild className="self-end sm:self-auto">
                  <Link href={`/customer/booking/${booking.id}`}>상세보기</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {recentBookings.length > 0 && (
        <div className="mt-4 text-center">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/booking/new">
              <Calendar className="mr-2 h-4 w-4" />새 예약 만들기
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
