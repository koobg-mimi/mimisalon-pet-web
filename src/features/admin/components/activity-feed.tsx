'use client'

import type { ActivityItem } from '@/features/admin/types/dashboard.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  getActivityIcon,
  getStatusColor,
  getStatusLabel,
  getRelativeTime,
  formatCurrency,
  type ActivityStatus,
} from '@/features/admin/utils/dashboard-formatters'
import { cn } from '@/lib/utils'

interface ActivityFeedProps {
  activities: ActivityItem[]
}

/**
 * ActivityFeed 컴포넌트
 *
 * 최근 활동 내역을 타임라인 형식으로 표시합니다.
 * 예약, 리뷰, 사용자 가입, 결제 등 다양한 활동 타입을 지원합니다.
 *
 * @example
 * ```tsx
 * <ActivityFeed activities={recentActivities} />
 * ```
 */
export function ActivityFeed({ activities }: ActivityFeedProps) {
  // 최근 15개 활동만 표시
  const recentActivities = activities.slice(0, 15)

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              최근 활동이 없습니다.
            </div>
          ) : (
            recentActivities.map((activity) => (
              <ActivityItemCard key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * ActivityItemCard 서브 컴포넌트
 *
 * 개별 활동 항목을 렌더링합니다.
 * ActivityItem의 discriminated union type을 활용하여 타입별 렌더링을 처리합니다.
 */
function ActivityItemCard({ activity }: { activity: ActivityItem }) {
  const icon = getActivityIcon(activity.type)

  return (
    <div className="flex gap-3 border-b pb-4 last:border-0 last:pb-0">
      {/* 아이콘 */}
      <div className="bg-muted text-muted-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
        {icon}
      </div>

      {/* 내용 */}
      <div className="min-w-0 flex-1 space-y-1">
        {/* 활동 설명 */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <ActivityDescription activity={activity} />
          </div>
          <div className="text-muted-foreground shrink-0 text-xs">
            {getRelativeTime(activity.timestamp)}
          </div>
        </div>

        {/* 상태 배지 */}
        {(activity.type === 'booking' || activity.type === 'payment') && (
          <div>
            <ActivityStatusBadge status={activity.status} />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * ActivityDescription 서브 컴포넌트
 *
 * 활동 타입에 따라 적절한 설명 텍스트를 생성합니다.
 */
function ActivityDescription({ activity }: { activity: ActivityItem }) {
  switch (activity.type) {
    case 'booking':
      return (
        <p className="text-sm">
          <span className="font-medium">{activity.customerName}</span>님이{' '}
          <span className="text-primary font-medium">{activity.serviceName}</span> 서비스를
          예약했습니다.
          <span className="text-muted-foreground ml-2">{formatCurrency(activity.amount)}</span>
        </p>
      )

    case 'review':
      return (
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-medium">{activity.customerName}</span>님이 리뷰를 작성했습니다.
            <span className="ml-2 text-yellow-600">⭐ {activity.rating.toFixed(1)}</span>
          </p>
          {activity.comment && (
            <p className="text-muted-foreground line-clamp-2 text-xs italic">
              &ldquo;{activity.comment}&rdquo;
            </p>
          )}
        </div>
      )

    case 'user_signup':
      return (
        <p className="text-sm">
          <span className="font-medium">{activity.customerName}</span>님이 회원가입했습니다.
        </p>
      )

    case 'payment':
      return (
        <p className="text-sm">
          <span className="font-medium">{activity.customerName}</span>님이 결제를 진행했습니다.
          <span className="text-primary ml-2 font-medium">{formatCurrency(activity.amount)}</span>
        </p>
      )

    default:
      // TypeScript exhaustiveness check
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustive: never = activity
      return null
  }
}

/**
 * ActivityStatusBadge 서브 컴포넌트
 *
 * 활동 상태를 시각적으로 표시하는 배지입니다.
 * BookingStatus enum 또는 PaymentActivityStatus를 타입 안전하게 처리합니다.
 */
function ActivityStatusBadge({ status }: { status: ActivityStatus }) {
  const colors = getStatusColor(status)
  const label = getStatusLabel(status)

  return (
    <Badge variant="secondary" className={cn('text-xs font-medium', colors.text, colors.bg)}>
      {label}
    </Badge>
  )
}
