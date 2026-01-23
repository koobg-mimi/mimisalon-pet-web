'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Prisma } from '@prisma/client'

export interface PetImage {
  id: string
  url: string
  filename: string
  isPrimary: boolean
}

export interface Breed {
  id: string
  name: string
  petType: 'DOG' | 'CAT'
  category: 'SMALL' | 'MEDIUM' | 'LARGE' | 'SPECIAL' | 'SHORT_HAIR' | 'LONG_HAIR'
  displayOrder: number
  isActive: boolean
}

export type Pet = Prisma.PetGetPayload<{
  include: {
    breed: true
    images: true
  }
}>

export interface PetFormData {
  name: string
  type: 'DOG' | 'CAT'
  breedId?: string
  weight?: number
  age?: number
  birthDate?: string
  gender?: 'MALE' | 'FEMALE' | 'UNKNOWN'
  hairType?: 'SHORT_HAIR' | 'LONG_HAIR'
  specialNeeds?: string
  vaccinationStatus?: 'UP_TO_DATE' | 'OVERDUE' | 'PARTIAL' | 'UNKNOWN'
  vaccinationDate?: string
  termsAcception: boolean
}

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all pets
  const fetchPets = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/customer/pets')

      if (!response.ok) {
        throw new Error('Failed to fetch pets')
      }

      const data = await response.json()
      // Convert date strings to Date objects
      const petsWithDates = data.map((pet: any) => ({
        ...pet,
        birthDate: pet.birthDate ? new Date(pet.birthDate) : null,
        vaccinationDate: pet.vaccinationDate ? new Date(pet.vaccinationDate) : null,
        createdAt: pet.createdAt ? new Date(pet.createdAt) : new Date(),
        updatedAt: pet.updatedAt ? new Date(pet.updatedAt) : new Date(),
      }))
      setPets(petsWithDates)
      setError(null)
    } catch (err) {
      console.error('Error fetching pets:', err)
      setError('반려동물 정보를 불러오는데 실패했습니다')
      toast.error('반려동물 정보를 불러오는데 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Create a new pet
  const createPet = useCallback(async (petData: PetFormData) => {
    try {
      const response = await fetch('/api/customer/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create pet')
      }

      const data = await response.json()
      const newPet = {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        vaccinationDate: data.vaccinationDate ? new Date(data.vaccinationDate) : null,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      }
      setPets((prev) => [newPet, ...prev])
      toast.success('반려동물이 등록되었습니다')
      return newPet
    } catch (err) {
      console.error('Error creating pet:', err)
      toast.error('반려동물 등록에 실패했습니다')
      throw err
    }
  }, [])

  // Update an existing pet
  const updatePet = useCallback(async (petId: string, petData: Partial<PetFormData>) => {
    try {
      const response = await fetch(`/api/customer/pets/${petId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update pet')
      }

      const data = await response.json()
      const updatedPet = {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        vaccinationDate: data.vaccinationDate ? new Date(data.vaccinationDate) : null,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      }
      setPets((prev) => prev.map((pet) => (pet.id === petId ? updatedPet : pet)))
      toast.success('반려동물 정보가 수정되었습니다')
      return updatedPet
    } catch (err) {
      console.error('Error updating pet:', err)
      toast.error('반려동물 정보 수정에 실패했습니다')
      throw err
    }
  }, [])

  // Delete a pet
  const deletePet = useCallback(async (petId: string) => {
    try {
      const response = await fetch(`/api/customer/pets/${petId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete pet')
      }

      setPets((prev) => prev.filter((pet) => pet.id !== petId))
      toast.success('반려동물이 삭제되었습니다')
    } catch (err) {
      console.error('Error deleting pet:', err)
      toast.error('반려동물 삭제에 실패했습니다')
      throw err
    }
  }, [])

  // Fetch pets on mount
  useEffect(() => {
    fetchPets()
  }, [fetchPets])

  return {
    pets,
    isLoading,
    error,
    fetchPets,
    createPet,
    updatePet,
    deletePet,
  }
}
