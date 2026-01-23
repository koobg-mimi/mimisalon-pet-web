'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { Calendar, CheckCircle, Clock, DollarSign, PawPrint, Star } from 'lucide-react'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { Skeleton } from '@/components/ui/skeleton'

export function StatisticsCards() {
  const { data: stats, isLoading } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border-border bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: '총 예약',
      value: `${stats?.totalBookings || 0}건`,
      icon: Calendar,
      color: 'blue',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: '완료된 예약',
      value: `${stats?.completedBookings || 0}건`,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: '예정된 예약',
      value: `${stats?.upcomingBookings || 0}건`,
      icon: Clock,
      color: 'orange',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      title: '총 지출',
      value: `${(stats?.totalSpent || 0).toLocaleString('ko-KR')}원`,
      icon: DollarSign,
      color: 'purple',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="border-border bg-card rounded-lg border p-4 transition-shadow hover:shadow-lg md:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{card.title}</p>
                <p className="text-foreground mt-1 text-xl font-bold md:text-2xl">{card.value}</p>
              </div>
              <div
                className={`h-10 w-10 md:h-12 md:w-12 ${card.bgColor} flex items-center justify-center rounded-full`}
              >
                <card.icon className={`h-5 w-5 md:h-6 md:w-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {/* Total Pets */}
        <div className="border-border bg-card rounded-lg border p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">등록된 반려동물</p>
              <p className="text-foreground mt-1 text-xl font-bold md:text-2xl">
                {stats?.totalPets || 0}마리
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 md:h-12 md:w-12">
              <PawPrint className="h-5 w-5 text-pink-600 md:h-6 md:w-6" />
            </div>
          </div>
        </div>

        {/* Favorite Groomer */}
        {stats?.favoriteGroomer && (
          <div className="border-border bg-card rounded-lg border p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">선호 미용사</p>
                <p className="text-foreground mt-1 text-lg font-bold">
                  {stats.favoriteGroomer.name}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= Math.round(stats.favoriteGroomer!.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-muted-foreground ml-1 text-xs">
                    ({stats.favoriteGroomer.rating.toFixed(1)})
                  </span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 md:h-12 md:w-12">
                <Star className="h-5 w-5 text-yellow-600 md:h-6 md:w-6" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
