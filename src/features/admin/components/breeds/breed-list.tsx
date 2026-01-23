/**
 * BreedList Component
 *
 * Right panel component displaying the current list of breeds filtered by pet type and category.
 * Provides delete and toggle functionality for individual breed items.
 *
 * @module features/admin/components/breeds/breed-list
 */

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { getCategoryName } from '@/constants/breed-categories'
import { BreedItem } from './ui/breed-item'
import {
  useDeleteBreedMutation,
  useUpdateBreedMutation,
} from '@/features/admin/state/breeds-api-slice'
import type { BreedWithCount } from '@/features/admin/types/breeds.types'
import type { BreedCategory } from '@mimisalon/shared'

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for the BreedList component
 *
 * @remarks
 * Displays a filtered list of breeds based on selected pet type and category.
 * Provides actions for toggling active status and deleting breeds.
 *
 * @example
 * ```tsx
 * <BreedList
 *   breeds={allBreeds}
 *   selectedPetType="DOG"
 *   selectedCategory="SMALL"
 * />
 * ```
 */
export interface BreedListProps {
  /** All breeds data (will be filtered by component) */
  breeds: BreedWithCount[]
  /** Currently selected pet type filter */
  selectedPetType: 'DOG' | 'CAT'
  /** Currently selected category filter */
  selectedCategory: string
}

// ============================================================================
// Component Definition
// ============================================================================

/**
 * BreedList - Displays filtered list of breeds with management actions
 *
 * @remarks
 * Features:
 * - Filters breeds by selected pet type and category
 * - Displays breed count in header badge
 * - Shows pet type and category name in description
 * - Maps breeds to BreedItem components
 * - Provides delete handler with confirmation dialog
 * - Provides toggle handler for active/inactive status
 * - Shows empty state when no breeds match filters
 *
 * Uses mutation hooks from use-breed-mutations.ts for delete and toggle operations.
 *
 * @example
 * ```tsx
 * function BreedsPage() {
 *   const { data: breeds } = useBreeds()
 *   const [petType, setPetType] = useState<'DOG' | 'CAT'>('DOG')
 *   const [category, setCategory] = useState('SMALL')
 *
 *   return (
 *     <BreedList
 *       breeds={breeds}
 *       selectedPetType={petType}
 *       selectedCategory={category}
 *     />
 *   )
 * }
 * ```
 */
export function BreedList({ breeds, selectedPetType, selectedCategory }: BreedListProps) {
  // Mutation hooks
  const [deleteBreed] = useDeleteBreedMutation()
  const [updateBreed] = useUpdateBreedMutation()

  // Filter breeds by selected pet type and category
  const currentCategoryBreeds = breeds.filter(
    (breed) => breed.petType === selectedPetType && breed.category === selectedCategory
  )

  /**
   * Handle breed deletion with confirmation
   *
   * @remarks
   * Shows native confirm dialog before deleting.
   * Uses RTK Query mutation with explicit toast feedback.
   *
   * @param breedId - ID of the breed to delete
   * @param breedName - Name of the breed (for confirmation message)
   */
  const handleDelete = (breedId: string, breedName: string) => {
    if (confirm(`"${breedName}" 품종을 삭제하시겠습니까?`)) {
      deleteBreed(breedId)
        .unwrap()
        .then(() => {
          toast.success('삭제 완료', {
            description: '품종이 삭제되었습니다.',
          })
        })
        .catch((error) => {
          toast.error('삭제 실패', {
            description: error.message || '품종 삭제에 실패했습니다.',
          })
        })
    }
  }

  /**
   * Handle breed active status toggle
   *
   * @remarks
   * Silent operation - no confirmation dialog, no success toast.
   * Only shows error toast on failure.
   *
   * @param breedId - ID of the breed to toggle
   * @param isActive - Current active status (will be toggled)
   */
  const handleToggle = (breedId: string, isActive: boolean) => {
    updateBreed({ id: breedId, isActive })
      .unwrap()
      .catch((error) => {
        toast.error('상태 변경 실패', {
          description: error.message || '품종 상태 변경에 실패했습니다.',
        })
      })
  }

  return (
    <Card>
      {/* Header with title and count badge */}
      <CardHeader>
        <CardTitle>
          현재 품종 목록
          <Badge variant="secondary" className="ml-2">
            {currentCategoryBreeds.length}개
          </Badge>
        </CardTitle>

        {/* Description showing pet type and category */}
        <CardDescription>
          {selectedPetType === 'DOG' ? '강아지' : '고양이'} ·{' '}
          {getCategoryName(selectedCategory as BreedCategory)}
        </CardDescription>
      </CardHeader>

      {/* List of breeds or empty state */}
      <CardContent>
        <div className="space-y-2">
          {currentCategoryBreeds.length === 0 ? (
            // Empty state
            <p className="text-muted-foreground py-8 text-center text-sm">등록된 품종이 없습니다</p>
          ) : (
            // Breed items list
            currentCategoryBreeds.map((breed) => (
              <BreedItem
                key={breed.id}
                breed={breed}
                onToggleActive={handleToggle}
                onDeleteBreed={handleDelete}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
