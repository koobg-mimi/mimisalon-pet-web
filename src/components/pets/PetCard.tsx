'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { Calendar, Camera, Cat, Dog, Edit2, Heart, Syringe, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Pet } from '@/hooks/usePets'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import Image from 'next/image'

interface PetCardProps {
  pet: Pet
  onEdit: (pet: Pet) => void
  onDelete: (petId: string) => void
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

export function PetCard({ pet, onEdit, onDelete }: PetCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const petAge = calculateAge(pet.birthDate, pet.age)

  // Get primary image if available
  const primaryImage = pet.images?.find((img) => img.isPrimary) || pet.images?.[0]

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    onDelete(pet.id)
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        {/* Image Section */}
        <div className="bg-muted relative h-48">
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
                  <Dog className="text-muted-foreground/50 mx-auto h-16 w-16" />
                ) : (
                  <Cat className="text-muted-foreground/50 mx-auto h-16 w-16" />
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

          {/* Vaccination Status Badge - Positioned on image */}
          <div className="absolute top-2 right-2">
            {getVaccinationStatusBadge(pet.vaccinationStatus)}
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                {pet.type === 'DOG' ? (
                  <Dog className="text-primary h-5 w-5" />
                ) : (
                  <Cat className="text-primary h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{pet.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {pet.breed?.name || (pet.type === 'DOG' ? '믹스견' : '믹스묘')}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* Show breed for dogs */}
            {pet.type === 'DOG' && pet.breed?.name && (
              <div className="flex items-center gap-2">
                <Heart className="text-muted-foreground h-4 w-4" />
                <span>{pet.breed.name}</span>
              </div>
            )}

            {/* Show hair type for cats */}
            {pet.type === 'CAT' && pet.hairType && (
              <div className="flex items-center gap-2">
                <Heart className="text-muted-foreground h-4 w-4" />
                <span>{getHairTypeLabel(pet.hairType)}</span>
              </div>
            )}

            {pet.gender && pet.gender !== 'UNKNOWN' && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">성별:</span>
                <span>{pet.gender === 'MALE' ? '남자' : '여자'}</span>
              </div>
            )}

            {petAge !== null && petAge !== undefined && (
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span>{petAge}살</span>
              </div>
            )}

            {pet.weight && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">체중:</span>
                <span>{pet.weight}kg</span>
              </div>
            )}
          </div>

          {pet.specialNeeds && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="mb-1 text-xs font-medium">특이사항</p>
              <p className="text-muted-foreground line-clamp-2 text-xs">{pet.specialNeeds}</p>
            </div>
          )}

          {pet.vaccinationDate && (
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <Syringe className="h-3 w-3" />
              <span>최근 접종: {format(pet.vaccinationDate, 'yyyy-MM-dd', { locale: ko })}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-row gap-2 pt-3">
          <Button variant="outline" size="sm" onClick={() => onEdit(pet)} className="flex-1">
            <Edit2 className="mr-2 h-4 w-4" />
            수정
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteClick}
            className="text-destructive hover:text-destructive flex-1"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>반려동물 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              {pet.name}을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
