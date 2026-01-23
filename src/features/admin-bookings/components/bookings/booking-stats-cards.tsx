import { Calendar, CheckCircle, Clock, DollarSign, TrendingUp, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '../../utils/booking-formatters'
import type { BookingStats } from '../../types/booking.types'

export interface BookingStatsCardsProps {
  /**
   * Booking statistics data
   */
  stats: BookingStats | null
}

/**
 * BookingStatsCards Component
 *
 * Displays a grid of statistics cards showing booking metrics.
 * Uses the existing Card component from shadcn/ui.
 *
 * @example
 * ```tsx
 * import { BookingStatsCards } from '@/features/admin-bookings/components/bookings/booking-stats-cards'
 *
 * const { data: stats } = useBookingStats()
 * <BookingStatsCards stats={stats} />
 * ```
 */
export function BookingStatsCards({ stats }: BookingStatsCardsProps) {
  if (!stats) return null

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
      {/* Total Bookings */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">전체 예약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </div>
        </CardContent>
      </Card>

      {/* Pending Bookings */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">대기중</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</div>
            <Clock className="h-4 w-4 text-yellow-600" />
          </div>
        </CardContent>
      </Card>

      {/* Confirmed Bookings */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">확정</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">{stats.confirmedBookings}</div>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Completed Bookings */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">완료</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-green-600">{stats.completedBookings}</div>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Cancelled Bookings */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">취소</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-red-600">{stats.cancelledBookings}</div>
            <XCircle className="h-4 w-4 text-red-600" />
          </div>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">총 매출</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
