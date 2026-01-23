'use client'

import { useState } from 'react'
import { useDashboardOverview, type TimeRange } from '@/features/admin/hooks'
import {
  DashboardStatsGrid,
  RevenueChart,
  TopServicesCard,
  ActivityFeed,
  QuickActions,
} from '@/features/admin/components'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { PageHeader } from '@/components/layout/PageHeader'

/**
 * Admin Dashboard Overview Page
 *
 * Thin wrapper page that composes feature-based components.
 * All business logic, data fetching, and transformations are handled
 * by the features/admin module.
 *
 * Architecture:
 * - useDashboardOverview: Data fetching and state management
 * - Feature components: Presentation and UI logic
 * - This page: Composition and layout only
 *
 * Refactored from 510 lines to ~60 lines (88% reduction)
 */
export default function AdminDashboardOverviewPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month')
  const { data: stats, isLoading, isError, error } = useDashboardOverview(timeRange)

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-destructive text-center">
          <p className="text-lg font-semibold">데이터를 불러오는데 실패했습니다</p>
          <p className="text-muted-foreground text-sm">
            {error?.message || '알 수 없는 오류가 발생했습니다'}
          </p>
        </div>
      </div>
    )
  }

  // No data state
  if (!stats) {
    return null
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header with time range selector */}
      <PageHeader title="관리자 대시보드" description="플랫폼 전체 현황을 관리하세요">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          className="border-input bg-background rounded-md border px-3 py-2 text-sm"
        >
          <option value="week">최근 1주</option>
          <option value="month">최근 1개월</option>
          <option value="year">최근 1년</option>
        </select>
      </PageHeader>

      {/* Stats Grid - 4 key metrics */}
      <DashboardStatsGrid stats={stats} />

      {/* Revenue Chart + Top Services */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={stats.monthlyRevenue || []} />
        <TopServicesCard services={stats.topServices || []} />
      </div>

      {/* Activity Feed + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityFeed activities={stats.recentActivity || []} />
        </div>
        <QuickActions />
      </div>
    </div>
  )
}
