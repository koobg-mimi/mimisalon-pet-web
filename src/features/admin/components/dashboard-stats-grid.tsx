'use client'

import type { OverviewStats } from '@/features/admin/types/dashboard.types'
import { StatCard } from '@/features/admin/components/ui/stat-card'
import { DollarSign, Calendar, Users, Star } from 'lucide-react'
import {
  formatCurrency,
  formatNumber,
  formatPercent,
} from '@/features/admin/utils/dashboard-formatters'

interface DashboardStatsGridProps {
  stats: OverviewStats
}

/**
 * DashboardStatsGrid 컴포넌트
 *
 * 대시보드 메인 통계를 4개의 StatCard로 표시합니다.
 * 총 매출, 전체 예약, 등록 사용자, 평균 평점을 그리드 레이아웃으로 배치합니다.
 *
 * @example
 * ```tsx
 * <DashboardStatsGrid stats={overviewStats} />
 * ```
 */
export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* 총 매출 */}
      <StatCard
        title="총 매출"
        value={formatCurrency(stats.totalRevenue)}
        subtitle={`${formatPercent(stats.revenueGrowth)} 전월대비`}
        icon={<DollarSign />}
        trend={stats.revenueGrowth > 0 ? 'up' : stats.revenueGrowth < 0 ? 'down' : 'neutral'}
        variant={stats.revenueGrowth > 0 ? 'highlight' : 'default'}
      />

      {/* 전체 예약 */}
      <StatCard
        title="전체 예약"
        value={formatNumber(stats.totalBookings)}
        subtitle={`${formatPercent(stats.bookingGrowth)} 전월대비`}
        icon={<Calendar />}
        trend={stats.bookingGrowth > 0 ? 'up' : stats.bookingGrowth < 0 ? 'down' : 'neutral'}
      />

      {/* 등록 사용자 */}
      <StatCard title="등록 사용자" value={formatNumber(stats.totalCustomers)} icon={<Users />} />

      {/* 평균 예약 금액 */}
      <StatCard
        title="평균 예약 금액"
        value={formatCurrency(stats.averageBookingValue)}
        icon={<Star />}
      />
    </div>
  )
}
