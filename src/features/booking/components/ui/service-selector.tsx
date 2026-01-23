'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Pet } from '@/hooks/usePets'
import {
  ServiceData,
  getAvailableServicesForPet,
  calculateServicePrice,
  sortServices,
} from '@/data/services'
import { Star, Clock, DollarSign, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ServiceSelectorProps {
  pet: Pet
  availableServices: ServiceData[]
  selectedServices: ServiceData[]
  onServiceChange: (services: ServiceData[]) => void
  onClose: () => void
}

export function ServiceSelector({
  pet,
  availableServices,
  selectedServices,
  onServiceChange,
  onClose,
}: ServiceSelectorProps) {
  const [localSelectedServices, setLocalSelectedServices] =
    useState<ServiceData[]>(selectedServices)

  const petAvailableServices = getAvailableServicesForPet(availableServices, pet.type)
  const sortedServices = sortServices([...petAvailableServices])

  const handleServiceToggle = (service: ServiceData, checked: boolean) => {
    if (checked) {
      setLocalSelectedServices((prev) => [...prev, service])
    } else {
      setLocalSelectedServices((prev) => prev.filter((s) => s.id !== service.id))
    }
  }

  const handleSave = () => {
    onServiceChange(localSelectedServices)
    onClose()
  }

  const getTotalPrice = () => {
    return localSelectedServices.reduce((total, service) => {
      return (
        total +
        calculateServicePrice(service, pet.type, pet.weight ?? undefined, pet.breedId ?? undefined)
      )
    }, 0)
  }

  const getTotalDuration = () => {
    return localSelectedServices.reduce((total, service) => {
      return total + service.duration
    }, 0)
  }

  const ServiceCard = ({ service }: { service: ServiceData }) => {
    const isSelected = localSelectedServices.some((s) => s.id === service.id)
    const price = calculateServicePrice(
      service,
      pet.type,
      pet.weight ?? undefined,
      pet.breedId ?? undefined
    )

    return (
      <Card
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onClick={() => handleServiceToggle(service, !isSelected)}
      >
        <CardContent>
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => handleServiceToggle(service, !!checked)}
              className="mt-1"
            />
            <div className="min-w-0 flex-1">
              <div className="mb-2">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-lg">{service.icon}</span>
                  <h4 className="min-w-0 flex-1 font-medium">{service.name}</h4>
                </div>
                {(service.isPopular || service.isRecommended) && (
                  <div className="flex flex-wrap items-center gap-1">
                    {service.isPopular && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="mr-1 h-3 w-3" />
                        인기
                      </Badge>
                    )}
                    {service.isRecommended && <Badge className="text-xs">추천</Badge>}
                  </div>
                )}
              </div>
              <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                {service.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <DollarSign className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">{price.toLocaleString()}원</span>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Info className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{service.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{pet.name}의 서비스 선택</h2>
          <p className="text-muted-foreground text-sm">
            원하는 서비스를 선택해주세요. 여러 개 선택 가능합니다.
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          취소
        </Button>
      </div>

      <div className="space-y-3">
        {sortedServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {sortedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">선택 가능한 서비스가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 선택된 서비스 요약 */}
      {localSelectedServices.length > 0 && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle>선택된 서비스 요약</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-primary text-lg font-bold">
                    {localSelectedServices.length}
                  </div>
                  <div className="text-muted-foreground text-sm">서비스</div>
                </div>
                <div>
                  <div className="text-primary text-lg font-bold">
                    {getTotalPrice().toLocaleString()}원
                  </div>
                  <div className="text-muted-foreground text-sm">예상 금액</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                {localSelectedServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between text-sm">
                    <span>
                      {service.icon} {service.name}
                    </span>
                    <span className="font-medium">
                      {calculateServicePrice(
                        service,
                        pet.type,
                        pet.weight ?? undefined,
                        pet.breedId ?? undefined
                      ).toLocaleString()}
                      원
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 저장 버튼 */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          className="flex-1"
          disabled={localSelectedServices.length === 0}
        >
          {localSelectedServices.length > 0
            ? `${localSelectedServices.length}개 서비스 선택 완료`
            : '최소 1개 서비스를 선택해주세요'}
        </Button>
        <Button variant="outline" onClick={onClose}>
          취소
        </Button>
      </div>
    </div>
  )
}
