'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { useDashboardOverview, type TimeRange } from '@/features/admin/hooks'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
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
function getErrorMessage(error: unknown): string {
  if (!error) return '알 수 없는 오류가 발생했습니다'

  if (typeof error === 'object' && error !== null) {
    const e = error as FetchBaseQueryError & { message?: string }

    if ('status' in e) {
      if (e.status === 401)
        return '관리자 권한이 없거나 세션이 만료되었습니다. 다시 로그인해 주세요.'
      if (e.status === 403) return '접근 권한이 없습니다.'
      if (e.status === 500) return '서버 내부 오류가 발생했습니다. 서버 로그를 확인해 주세요.'

      const data = (e as { data?: unknown }).data
      if (data && typeof data === 'object' && 'error' in (data as Record<string, unknown>)) {
        return String((data as Record<string, unknown>).error)
      }
    }

    if ('message' in e && typeof e.message === 'string' && e.message) {
      return e.message
    }
  }

  return '알 수 없는 오류가 발생했습니다'
}

export default function AdminDashboardOverviewPage() {
  const router = useRouter()
  const { data: session, isPending: isSessionPending } = useSession()
  const [timeRange, setTimeRange] = useState<TimeRange>('month')
  const { data: stats, isLoading, isError, error } = useDashboardOverview(timeRange)

  useEffect(() => {
    if (isSessionPending) return

    if (!session?.user) {
      router.replace('/auth/signin')
      return
    }

    if (session.user.role !== 'ADMIN') {
      router.replace('/dashboard')
    }
  }, [isSessionPending, session, router])

  // Redirect guard pending
  if (isSessionPending || !session?.user || session.user.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

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
          <p className="text-muted-foreground text-sm">{getErrorMessage(error)}</p>
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
