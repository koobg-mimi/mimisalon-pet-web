import { Users, UserCheck, UserX, Star, Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '../../utils/groomer-formatters'
import type { GroomerStats } from '../../types/groomer.types'

export interface GroomerStatsCardsProps {
  /**
   * Groomer statistics data
   */
  stats: GroomerStats | null
}

/**
 * GroomerStatsCards Component
 *
 * Displays a grid of statistics cards showing groomer metrics.
 * Uses the existing Card component from shadcn/ui.
 *
 * @example
 * ```tsx
 * import { GroomerStatsCards } from '@/features/admin-groomers/components/groomers/groomer-stats-cards'
 *
 * const { data: stats } = useGroomerStats()
 * <GroomerStatsCards stats={stats} />
 * ```
 */
export function GroomerStatsCards({ stats }: GroomerStatsCardsProps) {
  if (!stats) return null

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
      {/* Total Groomers */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">전체 미용사</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{stats.totalGroomers}</div>
            <Users className="text-muted-foreground h-4 w-4" />
          </div>
        </CardContent>
      </Card>

      {/* Active Groomers */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">활동중</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-green-600">{stats.activeGroomers}</div>
            <UserCheck className="h-4 w-4 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Inactive Groomers */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">비활성</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-600">{stats.inactiveGroomers}</div>
            <UserX className="h-4 w-4 text-gray-600" />
          </div>
        </CardContent>
      </Card>

      {/* Average Rating */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">평균 평점</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.averageRating.toFixed(1)}
            </div>
            <Star className="h-4 w-4 text-yellow-600" />
          </div>
        </CardContent>
      </Card>

      {/* Bookings This Month */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">이번 달 예약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">{stats.totalBookingsThisMonth}</div>
            <Calendar className="h-4 w-4 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Revenue This Month */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">이번 달 매출</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenueThisMonth)}</div>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
