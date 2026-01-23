'use client'

import type { MonthlyRevenue } from '@/features/admin/types/dashboard.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatCurrency } from '@/features/admin/utils/dashboard-formatters'

interface RevenueChartProps {
  data: MonthlyRevenue[]
}

/**
 * RevenueChart 컴포넌트
 *
 * 월별 매출 현황을 바 차트로 시각화합니다.
 * recharts 라이브러리를 사용하여 반응형 차트를 렌더링합니다.
 *
 * @example
 * ```tsx
 * <RevenueChart data={monthlyRevenueData} />
 * ```
 */
export function RevenueChart({ data }: RevenueChartProps) {
  // 최근 12개월 데이터만 표시
  const chartData = data.slice(-12).map((item) => ({
    month: item.month,
    매출: item.value,
    전월: item.previousValue,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>월별 매출 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--card-foreground))',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Bar dataKey="매출" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              <Bar dataKey="전월" fill="hsl(var(--muted))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
