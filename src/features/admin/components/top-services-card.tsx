'use client'

import type { ServiceStats } from '@/features/admin/types/dashboard.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, TrendingUp, TrendingDown } from 'lucide-react'
import {
  formatCurrency,
  formatNumber,
  formatRating,
  formatPercent,
} from '@/features/admin/utils/dashboard-formatters'
import { cn } from '@/lib/utils'

interface TopServicesCardProps {
  services: ServiceStats[]
}

/**
 * TopServicesCard 컴포넌트
 *
 * 인기 서비스 순위와 통계를 표시합니다.
 * 서비스별 예약 건수, 매출, 평점, 성장률을 한눈에 확인할 수 있습니다.
 *
 * @example
 * ```tsx
 * <TopServicesCard services={topServicesData} />
 * ```
 */
export function TopServicesCard({ services }: TopServicesCardProps) {
  // 상위 10개 서비스만 표시
  const topServices = services.slice(0, 10)
  const maxRevenue = Math.max(...topServices.map((s) => s.revenue), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="text-primary h-5 w-5" />
          인기 서비스
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topServices.map((service) => {
            const revenuePercentage = (service.revenue / maxRevenue) * 100
            const isGrowing = service.growth > 0

            return (
              <div key={service.serviceId} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        {service.rank}
                      </span>
                      <h4 className="truncate font-medium">{service.name}</h4>
                    </div>
                    <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
                      <span>{formatNumber(service.bookings)} 건</span>
                      <span>•</span>
                      <span>{formatRating(service.rating)}</span>
                      {service.growth !== 0 && (
                        <>
                          <span>•</span>
                          <span
                            className={cn(
                              'flex items-center gap-0.5',
                              isGrowing ? 'text-green-600' : 'text-red-600'
                            )}
                          >
                            {isGrowing ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {formatPercent(service.growth)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-semibold">{formatCurrency(service.revenue)}</div>
                    <div className="text-muted-foreground text-xs">
                      만족도 {service.satisfactionRate}%
                    </div>
                  </div>
                </div>

                {/* 매출 진행률 바 */}
                <div className="bg-muted relative h-2 w-full overflow-hidden rounded-full">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      service.rank === 1
                        ? 'from-primary to-primary/60 bg-gradient-to-r'
                        : service.rank <= 3
                          ? 'bg-primary/80'
                          : 'bg-primary/60'
                    )}
                    style={{ width: `${revenuePercentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
