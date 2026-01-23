import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  iconBgColor: string
  subtitle?: string
}

export function StatsCard({ title, value, icon, iconBgColor, subtitle }: StatsCardProps) {
  return (
    <div className="border-border bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground truncate text-sm">{title}</p>
          <p className="text-foreground text-2xl font-bold whitespace-nowrap">
            {typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
          </p>
          {subtitle && <p className="text-muted-foreground mt-1 truncate text-xs">{subtitle}</p>}
        </div>
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconBgColor}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
