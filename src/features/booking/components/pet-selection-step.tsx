/**
 * 예약 Step 1: 반려동물 및 서비스 선택 (Redux 기반)
 */

'use client'

import { useState } from 'react'
import { Pet } from '@/hooks/usePets'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { SelectablePetCard } from '@/features/booking/components/ui/selectable-pet-card'
import { ServiceSelector } from '@/features/booking/components/ui/service-selector'
import { ServiceOptionSelector } from '@/features/booking/components/ui/service-option-selector'
import { calculateServicePrice, ServiceData } from '@/data/services'
import { useQuery } from '@tanstack/react-query'
import { calculateTotalPrice } from '../utils/booking-calculations'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { togglePet, updateOptions, updateServices } from '../state/booking-slice'

interface PetSelectionStepProps {
  /** 반려동물 목록 */
  pets: Pet[]
}

/**
 * 반려동물 및 서비스 선택 단계
 *
 * Redux에서 formData를 직접 가져오고 액션을 디스패치
 */
export function PetSelectionStep({ pets }: PetSelectionStepProps) {
  const dispatch = useAppDispatch()
  const formData = useAppSelector((state) => state.booking.formData)
  const [serviceModalOpen, setServiceModalOpen] = useState(false)
  const [selectedPetForService, setSelectedPetForService] = useState<Pet | null>(null)

  // 선택된 반려동물의 서비스 목록 조회
  const {
    data: availableServices = [],
    isLoading: isLoadingServices,
    isError: isServicesError,
    error: servicesError,
  } = useQuery<ServiceData[]>({
    queryKey: ['customer', 'services', selectedPetForService?.id],
    queryFn: async () => {
      if (!selectedPetForService?.id) {
        throw new Error('Pet not selected')
      }
      const response = await fetch(`/api/customer/services?petId=${selectedPetForService.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch services')
      }
      return response.json()
    },
    enabled: !!selectedPetForService,
  })

  /**
   * 서비스 편집 모달 열기
   */
  const handleEditServices = (pet: Pet) => {
    setSelectedPetForService(pet)
    setServiceModalOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* 반려동물 선택 그리드 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => {
          const currentServices =
            formData.petServices.find((ps) => ps.petId === pet.id)?.services || []
          const isSelected = formData.petServices.some((ps) => ps.petId === pet.id)
          const hasServices = currentServices.length > 0
          const needsService = isSelected && !hasServices

          return (
            <SelectablePetCard
              key={pet.id}
              pet={pet}
              isSelected={isSelected}
              hasServices={hasServices}
              needsService={needsService}
              onToggleSelect={(pet) => dispatch(togglePet(pet))}
            />
          )
        })}
      </div>

      {/* 선택된 반려동물의 서비스 편집 섹션 */}
      {formData.petServices.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">선택된 반려동물 서비스</h3>
          {formData.petServices.map((petService) => {
            const pet = pets.find((p) => p.id === petService.petId)
            if (!pet) return null

            return (
              <Card key={petService.petId} className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-medium">{pet.name}의 서비스</h4>
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground text-sm">
                      {petService.services.length}개 서비스 선택됨
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEditServices(pet)}>
                      서비스 편집
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {petService.services.length > 0 ? (
                    <div className="space-y-2">
                      {petService.services.map((service, index) => (
                        <div
                          key={index}
                          className="bg-muted flex items-center justify-between rounded-lg p-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{service.icon}</span>
                              <span className="font-medium">{service.name}</span>
                            </div>
                            <p className="text-muted-foreground text-sm">{service.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {calculateServicePrice(
                                service,
                                pet.type,
                                pet.weight || 0,
                                pet.breedId || undefined
                              ).toLocaleString()}
                              원
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border-2 border-dashed border-red-200 bg-red-50 py-6 text-center">
                      <div className="mb-3 flex items-center justify-center">
                        <svg
                          className="mr-2 h-6 w-6 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="font-medium text-red-700">서비스를 선택해주세요</p>
                      </div>
                      <p className="mb-4 text-sm text-red-600">
                        예약을 계속하려면 최소 1개 이상의 서비스를 선택해야 합니다
                      </p>
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-100"
                        onClick={() => handleEditServices(pet)}
                      >
                        서비스 선택하기
                      </Button>
                    </div>
                  )}

                  {/* 추가 옵션 선택 - 서비스가 선택된 경우에만 표시 */}
                  {petService.services.length > 0 && (
                    <ServiceOptionSelector
                      petId={pet.id}
                      petName={pet.name}
                      selectedOptions={petService.options}
                      onOptionsChange={(options) =>
                        dispatch(updateOptions({ petId: pet.id, options }))
                      }
                    />
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* 선택 요약 카드 */}
      {formData.petServices.length > 0 && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle>선택 요약</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
              <div>
                <div className="text-primary text-2xl font-bold">{formData.petServices.length}</div>
                <div className="text-muted-foreground text-sm">반려동물</div>
              </div>
              <div>
                <div className="text-primary text-2xl font-bold">
                  {formData.petServices.reduce((total, ps) => total + ps.services.length, 0)}
                </div>
                <div className="text-muted-foreground text-sm">서비스</div>
              </div>
              <div>
                <div className="text-primary text-2xl font-bold">
                  {calculateTotalPrice(formData, pets).toLocaleString()}원
                </div>
                <div className="text-muted-foreground text-sm">총 예상 금액</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 서비스 선택 다이얼로그 */}
      <Dialog open={serviceModalOpen} onOpenChange={setServiceModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>서비스 선택</DialogTitle>
          </DialogHeader>
          {selectedPetForService && (
            <>
              {isServicesError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-5 w-5 flex-shrink-0 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-red-700">
                      서비스 목록을 불러오는데 실패했습니다.{' '}
                      {servicesError instanceof Error ? servicesError.message : ''}
                    </p>
                  </div>
                </div>
              )}
              {isLoadingServices ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="lg" />
                  <p className="text-muted-foreground ml-3">서비스를 불러오는 중...</p>
                </div>
              ) : (
                <ServiceSelector
                  pet={selectedPetForService}
                  availableServices={availableServices}
                  selectedServices={
                    formData.petServices.find((ps) => ps.petId === selectedPetForService.id)
                      ?.services || []
                  }
                  onServiceChange={(services) => {
                    dispatch(updateServices({ petId: selectedPetForService.id, services }))
                    setServiceModalOpen(false)
                  }}
                  onClose={() => setServiceModalOpen(false)}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
