'use client'

import { Calendar, Camera, Cat, Check, Dog, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Pet } from '@/hooks/usePets'
import Image from 'next/image'

interface SelectablePetCardProps {
  pet: Pet
  isSelected: boolean
  hasServices: boolean
  needsService?: boolean // New prop to indicate if pet is selected but has no services
  onToggleSelect: (pet: Pet) => void
}

const getHairTypeLabel = (hairType?: string | null) => {
  switch (hairType) {
    case 'SHORT_HAIR':
      return '단모'
    case 'LONG_HAIR':
      return '장모'
    default:
      return null
  }
}

const getVaccinationStatusBadge = (status?: string) => {
  switch (status) {
    case 'UP_TO_DATE':
      return <Badge className="bg-green-500">접종 완료</Badge>
    case 'OVERDUE':
      return <Badge variant="destructive">접종 지연</Badge>
    case 'PARTIAL':
      return <Badge variant="secondary">부분 접종</Badge>
    default:
      return <Badge variant="outline">미확인</Badge>
  }
}

/**
 * Safely calculate pet age from birthDate (string or Date) or fallback to age
 * @param birthDate - Date object, ISO string, or null
 * @param age - Fallback age if birthDate is not available
 * @returns Calculated age in years or null
 */
const calculateAge = (birthDate?: Date | string | null, age?: number | null) => {
  if (birthDate) {
    // Parse birthDate safely - handle both Date objects and ISO strings
    let parsedDate: Date
    if (typeof birthDate === 'string') {
      parsedDate = new Date(birthDate)
      // Check if date is valid
      if (isNaN(parsedDate.getTime())) {
        return age // Invalid date, fallback to age
      }
    } else {
      parsedDate = birthDate
    }

    const today = new Date()
    const years = today.getFullYear() - parsedDate.getFullYear()
    const months = today.getMonth() - parsedDate.getMonth()

    if (months < 0 || (months === 0 && today.getDate() < parsedDate.getDate())) {
      return years - 1
    }
    return years
  }
  return age
}

export function SelectablePetCard({
  pet,
  isSelected,
  hasServices,
  needsService = false,
  onToggleSelect,
}: SelectablePetCardProps) {
  const petAge = calculateAge(pet.birthDate, pet.age)
  const primaryImage = pet.images?.find((img) => img.isPrimary) || pet.images?.[0]

  return (
    <Card
      className={`relative cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg ${
        needsService
          ? 'border-2 border-red-500 bg-red-50/50 shadow-lg'
          : isSelected
            ? 'border-2 border-green-500 bg-green-50/50 shadow-lg'
            : 'border-border hover:border-primary/50'
      }`}
      onClick={() => onToggleSelect(pet)}
    >
      {/* Selection indicator */}
      {needsService ? (
        <div className="absolute top-3 left-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
          <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      ) : isSelected ? (
        <div className="absolute top-3 left-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
          <Check className="h-4 w-4 text-white" />
        </div>
      ) : null}

      {/* Image Section */}
      <div className="bg-muted relative h-40">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={pet.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              {pet.type === 'DOG' ? (
                <Dog className="text-muted-foreground/50 mx-auto h-12 w-12" />
              ) : (
                <Cat className="text-muted-foreground/50 mx-auto h-12 w-12" />
              )}
              <p className="text-muted-foreground mt-2 text-xs">사진 없음</p>
            </div>
          </div>
        )}

        {/* Image count indicator */}
        {pet.images && pet.images.length > 0 && (
          <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
            <Camera className="h-3 w-3" />
            {pet.images.length}
          </div>
        )}

        {/* Vaccination Status Badge */}
        <div className="absolute top-2 right-2">
          {getVaccinationStatusBadge(pet.vaccinationStatus)}
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                needsService ? 'bg-red-100' : isSelected ? 'bg-green-100' : 'bg-primary/10'
              }`}
            >
              {pet.type === 'DOG' ? (
                <Dog
                  className={`h-5 w-5 ${
                    needsService ? 'text-red-600' : isSelected ? 'text-green-600' : 'text-primary'
                  }`}
                />
              ) : (
                <Cat
                  className={`h-5 w-5 ${
                    needsService ? 'text-red-600' : isSelected ? 'text-green-600' : 'text-primary'
                  }`}
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-semibold">{pet.name}</h3>
              <p className="text-muted-foreground truncate text-sm">
                {pet.breed?.name || (pet.type === 'DOG' ? '믹스견' : '믹스묘')}
              </p>
            </div>
          </div>
          {needsService ? (
            <div className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
              서비스 필요
            </div>
          ) : hasServices ? (
            <div className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
              서비스 선택됨
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {/* Breed for dogs */}
          {pet.type === 'DOG' && pet.breed?.name && (
            <div className="flex items-center gap-2">
              <Heart className="text-muted-foreground h-4 w-4" />
              <span>{pet.breed.name}</span>
            </div>
          )}

          {/* Hair type for cats */}
          {pet.type === 'CAT' && pet.hairType && (
            <div className="flex items-center gap-2">
              <Heart className="text-muted-foreground h-4 w-4" />
              <span>{getHairTypeLabel(pet.hairType)}</span>
            </div>
          )}

          {/* Gender */}
          {pet.gender && pet.gender !== 'UNKNOWN' && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">성별:</span>
              <span>{pet.gender === 'MALE' ? '남자' : '여자'}</span>
            </div>
          )}

          {/* Age */}
          {petAge !== null && petAge !== undefined && (
            <div className="flex items-center gap-2">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <span>{petAge}살</span>
            </div>
          )}

          {/* Weight */}
          {pet.weight && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">체중:</span>
              <span>{pet.weight}kg</span>
            </div>
          )}
        </div>

        {/* Special needs */}
        {pet.specialNeeds && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="mb-1 text-xs font-medium text-blue-800">특이사항</p>
            <p className="line-clamp-2 text-xs break-words text-blue-700">{pet.specialNeeds}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
