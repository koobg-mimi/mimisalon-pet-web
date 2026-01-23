'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Award, MapPin, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Groomer {
  id: string
  name: string
  profileImage?: string
  rating?: number
  reviewCount?: number
  workAreas?: string[]
  distance?: number
  serviceArea?: string
  isSelected?: boolean
  schedule?: {
    workingHoursStart: string
    workingHoursEnd: string
    workingDays: number[]
    slotDurationMinutes: number
  } | null
}

interface GroomerCardProps {
  groomer: Groomer
  onSelect: (groomerId: string) => void
  isSelected?: boolean
  className?: string
}

export function GroomerCard({
  groomer,
  onSelect,
  isSelected = false,
  className,
}: GroomerCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={cn(
          'h-4 w-4',
          index < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        )}
      />
    ))
  }

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        isSelected ? 'ring-primary border-primary bg-primary/5 ring-2' : 'hover:border-primary/50',
        className
      )}
      onClick={() => onSelect(groomer.id)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* 프로필 이미지 */}
          <Avatar className="border-border h-16 w-16 border-2">
            <AvatarImage src={groomer.profileImage} alt={`${groomer.name} 프로필`} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {getInitials(groomer.name)}
            </AvatarFallback>
          </Avatar>

          {/* 미용사 정보 */}
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg leading-tight font-semibold">{groomer.name}</h3>

                {/* 별점 - 데이터가 있을 때만 표시 */}
                {groomer.rating !== undefined && (
                  <div className="mt-1 flex items-center gap-1">
                    {renderStars(groomer.rating)}
                    <span className="text-muted-foreground ml-1 text-sm">
                      {groomer.rating}
                      {groomer.reviewCount && ` (${groomer.reviewCount})`}
                    </span>
                  </div>
                )}
              </div>

              {/* 선택 상태 표시 */}
              {isSelected && (
                <div className="text-primary flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-medium">선택됨</span>
                </div>
              )}
            </div>

            {/* 서비스 지역 및 거리 정보 */}
            <div className="mb-4 space-y-1">
              {groomer.workAreas && groomer.workAreas.length > 0 && (
                <div className="text-muted-foreground flex items-center gap-1 text-sm">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{groomer.workAreas.join(', ')}</span>
                </div>
              )}

              {groomer.distance !== undefined && (
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-primary font-medium">
                    {groomer.distance < 1
                      ? `${Math.round(groomer.distance * 1000)}m`
                      : `${groomer.distance}km`}
                  </span>
                  <span className="text-muted-foreground">거리</span>
                  {groomer.serviceArea && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground truncate">{groomer.serviceArea}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 선택 버튼 */}
            <Button
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'w-full transition-colors',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-primary hover:text-primary-foreground'
              )}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(groomer.id)
              }}
            >
              {isSelected ? '선택됨' : '이 미용사 선택'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
