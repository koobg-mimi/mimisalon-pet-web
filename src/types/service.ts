export interface ServicePriceRange {
  id: string
  petType: 'DOG' | 'CAT'
  minWeight?: number
  maxWeight?: number | null
  price: number
  selectedBreedIds?: string[] // Selected breed IDs for this price range
}

export interface Service {
  id: string
  name: string
  description?: string
  duration: number
  basePrice: number
  isActive: boolean
  petTypes: ('DOG' | 'CAT')[]
  breedCategories?: string[] // ['SMALL', 'MEDIUM', 'LARGE', etc.]
  priceRanges?: ServicePriceRange[]
  requirements?: string
  afterCareInstructions?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
  bookingCount: number
  averageRating: number
}

export interface ServiceFormData {
  name: string
  description: string
  duration: string
  basePrice: string
  priceRanges?: ServicePriceRange[]
  petTypes: ('DOG' | 'CAT')[]
  breedCategories?: string[] // Selected breed categories
  requirements?: string
  afterCareInstructions?: string
  isActive: boolean
}
