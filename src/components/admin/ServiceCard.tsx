import { memo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ClockIcon,
  DollarSignIcon,
  EditIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
  TrashIcon,
} from 'lucide-react'
import { ServicePriceRange } from '@mimisalon/shared'
import { getPriceDisplay } from '@/lib/service-utils'

export interface Service {
  id: string
  name: string
  description: string
  duration: number
  isActive: boolean
  petTypes: ('DOG' | 'CAT')[]
  priceRanges: ServicePriceRange[]
  requirements?: string
  afterCareInstructions?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
  bookingCount: number
  averageRating: number
}

export const PET_TYPES = {
  DOG: '강아지',
  CAT: '고양이',
} as const

interface ServiceCardProps {
  service: Service
  onEdit: (service: Service) => void
  onToggleStatus: (serviceId: string, isActive: boolean) => void
  onDelete: (serviceId: string) => void
}

const ServiceCardComponent = ({ service, onEdit, onToggleStatus, onDelete }: ServiceCardProps) => {
  const priceInfo = getPriceDisplay(service)

  return (
    <Card key={service.id} className={service.isActive ? '' : 'opacity-60'}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {!service.isActive && (
              <div className="mb-2 flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  비활성
                </Badge>
              </div>
            )}
            <CardTitle className="text-lg">{service.name}</CardTitle>
            <CardDescription className="line-clamp-2">{service.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <ClockIcon className="text-muted-foreground h-4 w-4" />
            <span>{service.duration}분</span>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <DollarSignIcon className="text-muted-foreground h-4 w-4" />
              <span>{priceInfo.display}</span>
            </div>
            {priceInfo.hasRange && priceInfo.count && (
              <Badge variant="secondary" className="w-fit text-xs">
                {priceInfo.count}개 옵션
              </Badge>
            )}
          </div>
        </div>

        {service.bookingCount > 0 && (
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>예약 {service.bookingCount}회</span>
            {service.averageRating > 0 && <span>평점 {service.averageRating.toFixed(1)}</span>}
          </div>
        )}

        <Separator />

        <div className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(service)}>
              <EditIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleStatus(service.id, service.isActive)}
            >
              {service.isActive ? (
                <ToggleLeftIcon className="h-4 w-4" />
              ) : (
                <ToggleRightIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(service.id)}
            className="text-destructive hover:text-destructive"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export const ServiceCard = memo(ServiceCardComponent)
