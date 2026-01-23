'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ScissorsIcon,
  SearchIcon,
  ClockIcon,
  DollarSignIcon,
  InfoIcon,
  PlusIcon,
  MinusIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number // 계산된 가격
  petTypes: string[]
  requirements?: string
  afterCareInstructions?: string
  imageUrl?: string
  isPopular: boolean
  isRecommended: boolean
  averageRating: number
  bookingCount: number
}

interface Pet {
  id: string
  name: string
  species: string
  breed: string
  weight: number
  breedId?: string
}

interface ServiceSelectorProps {
  pet: Pet
  selectedServices: Service[]
  onServicesChange: (services: Service[]) => void
  maxServices?: number
}

export function ServiceSelector({
  pet,
  selectedServices,
  onServicesChange,
  maxServices = 5,
}: ServiceSelectorProps) {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<string>('popular')
  const [showRecommended, setShowRecommended] = useState(true)

  // 서비스 목록 조회
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/customer/services?petId=${pet.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('서비스 목록을 불러오는데 실패했습니다')
        }

        const data = await response.json()
        setServices(data)
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [pet.id])

  // 서비스 필터링 및 정렬
  const filteredAndSortedServices = services
    .filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPetType = service.petTypes.includes(pet.species)

      return matchesSearch && matchesPetType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.bookingCount - a.bookingCount
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'duration-short':
          return a.duration - b.duration
        case 'duration-long':
          return b.duration - a.duration
        case 'rating':
          return b.averageRating - a.averageRating
        default:
          return 0
      }
    })

  // 추천 서비스 분리
  const recommendedServices = showRecommended
    ? filteredAndSortedServices.filter((service) => service.isRecommended)
    : []

  const regularServices = filteredAndSortedServices.filter(
    (service) => !showRecommended || !service.isRecommended
  )

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some((s) => s.id === serviceId)
  }

  const canAddService = () => {
    return selectedServices.length < maxServices
  }

  const handleServiceToggle = (service: Service) => {
    const isSelected = isServiceSelected(service.id)

    if (isSelected) {
      // 서비스 제거
      const newServices = selectedServices.filter((s) => s.id !== service.id)
      onServicesChange(newServices)
    } else {
      // 서비스 추가
      if (canAddService()) {
        const newServices = [...selectedServices, service]
        onServicesChange(newServices)
      }
    }
  }

  const getTotalDuration = () => {
    return selectedServices.reduce((acc, service) => acc + service.duration, 0)
  }

  const getTotalPrice = () => {
    return selectedServices.reduce((acc, service) => acc + service.price, 0)
  }

  const getServiceCompatibility = (service: Service) => {
    const warnings = []

    // 총 시간 초과 체크
    const totalDuration = getTotalDuration() + service.duration
    if (totalDuration > 240) {
      // 4시간 초과
      warnings.push('총 시간이 4시간을 초과할 수 있습니다')
    }

    return warnings
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground">서비스 목록을 불러오는 중...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 선택된 서비스 요약 */}
      {selectedServices.length > 0 && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                선택된 서비스 ({selectedServices.length}/{maxServices})
              </span>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>{getTotalDuration()}분</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSignIcon className="h-4 w-4" />
                  <span>{getTotalPrice().toLocaleString('ko-KR')}원</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-muted flex items-center justify-between rounded-lg p-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{service.name}</span>
                      {service.isPopular && (
                        <Badge variant="secondary" className="text-xs">
                          인기
                        </Badge>
                      )}
                    </div>
                    <div className="text-muted-foreground mt-1 flex items-center space-x-4 text-sm">
                      <span>{service.duration}분</span>
                      <span>{service.price.toLocaleString()}원</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleServiceToggle(service)}>
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="서비스명 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">인기순</SelectItem>
                  <SelectItem value="price-low">가격 낮은순</SelectItem>
                  <SelectItem value="price-high">가격 높은순</SelectItem>
                  <SelectItem value="duration-short">시간 짧은순</SelectItem>
                  <SelectItem value="duration-long">시간 긴순</SelectItem>
                  <SelectItem value="rating">평점순</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="show-recommended"
                checked={showRecommended}
                onCheckedChange={(checked) => setShowRecommended(checked === true)}
              />
              <label
                htmlFor="show-recommended"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {pet.name}에게 권장하는 서비스만 보기
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 추천 서비스 */}
      {recommendedServices.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">{pet.name}에게 추천</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {recommendedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={isServiceSelected(service.id)}
                canSelect={canAddService() || isServiceSelected(service.id)}
                onToggle={() => handleServiceToggle(service)}
                compatibility={getServiceCompatibility(service)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 일반 서비스 */}
      <div className="space-y-4">
        {!showRecommended && <h3 className="text-lg font-semibold">모든 서비스</h3>}
        {regularServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {regularServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={isServiceSelected(service.id)}
                canSelect={canAddService() || isServiceSelected(service.id)}
                onToggle={() => handleServiceToggle(service)}
                compatibility={getServiceCompatibility(service)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 text-center">
                <ScissorsIcon className="text-muted-foreground mx-auto h-12 w-12" />
                <h3 className="text-lg font-semibold">검색 결과가 없습니다</h3>
                <p className="text-muted-foreground">다른 검색어나 필터를 시도해보세요.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

interface ServiceCardProps {
  service: Service
  isSelected: boolean
  canSelect: boolean
  onToggle: () => void
  compatibility: string[]
}

function ServiceCard({
  service,
  isSelected,
  canSelect,
  onToggle,
  compatibility,
}: ServiceCardProps) {
  return (
    <Card
      className={cn('transition-colors', {
        'border-primary bg-primary/5': isSelected,
        'opacity-60': !canSelect && !isSelected,
      })}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center space-x-2">
              <CardTitle className="text-lg">{service.name}</CardTitle>
              {service.isPopular && (
                <Badge variant="secondary" className="text-xs">
                  인기
                </Badge>
              )}
              {service.isRecommended && (
                <Badge variant="outline" className="border-green-600 text-xs text-green-600">
                  추천
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground line-clamp-2 text-sm">{service.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <ClockIcon className="text-muted-foreground h-4 w-4" />
            <span>{service.duration}분</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSignIcon className="text-muted-foreground h-4 w-4" />
            <span>{service.price.toLocaleString()}원</span>
          </div>
        </div>

        {service.averageRating > 0 && (
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500">★</span>
              <span>{service.averageRating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground">({service.bookingCount}건 예약)</span>
          </div>
        )}

        {compatibility.length > 0 && (
          <div className="space-y-2">
            {compatibility.map((warning, index) => (
              <div
                key={index}
                className="flex items-start space-x-2 rounded border border-yellow-200 bg-yellow-50 p-2"
              >
                <AlertCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600" />
                <p className="text-xs text-yellow-800">{warning}</p>
              </div>
            ))}
          </div>
        )}

        {service.requirements && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-start space-x-2">
              <InfoIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
              <div>
                <p className="text-xs font-medium text-blue-900">서비스 요구사항</p>
                <p className="mt-1 text-xs text-blue-800">{service.requirements}</p>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={onToggle}
          disabled={!canSelect && !isSelected}
          className="w-full"
          variant={isSelected ? 'outline' : 'default'}
        >
          {isSelected ? (
            <>
              <MinusIcon className="mr-2 h-4 w-4" />
              선택 해제
            </>
          ) : (
            <>
              <PlusIcon className="mr-2 h-4 w-4" />
              선택하기
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
