/**
 * BreedInputForm Component
 *
 * Left panel form for bulk breed input in admin breeds management.
 *
 * This component provides:
 * - Pet type selector (DOG/CAT) - controlled by parent
 * - Category selector - controlled by parent
 * - Breed names textarea for comma-separated input
 * - Auto-fill functionality to populate textarea with existing breeds
 * - Save button with validation and loading state
 *
 * Extracted from /app/admin/dashboard/breeds/page.tsx (lines 191-267)
 *
 * @module features/admin/components/breeds/breed-input-form
 */

'use client'

import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CAT_CATEGORIES, DOG_CATEGORIES } from '@/constants/breed-categories'
import { useGetBreedsQuery, useCreateBreedsMutation } from '../../state/breeds-api-slice'
import type { BreedCategory } from '@mimisalon/shared'

/**
 * Props for BreedInputForm component
 */
export interface BreedInputFormProps {
  /** Currently selected pet type (controlled) */
  selectedPetType: 'DOG' | 'CAT'
  /** Currently selected category (controlled) */
  selectedCategory: string
  /** Handler for pet type changes */
  onPetTypeChange: (value: 'DOG' | 'CAT') => void
  /** Handler for category changes */
  onCategoryChange: (value: string) => void
}

/**
 * BreedInputForm Component
 *
 * Form for bulk breed input with comma-separated breed names.
 * Supports auto-fill of existing breeds when category changes.
 *
 * @example
 * ```typescript
 * <BreedInputForm
 *   selectedPetType="DOG"
 *   selectedCategory="SMALL"
 *   onPetTypeChange={(value) => setSelectedPetType(value)}
 *   onCategoryChange={(value) => setSelectedCategory(value)}
 * />
 * ```
 */
export function BreedInputForm({
  selectedPetType,
  selectedCategory,
  onPetTypeChange,
  onCategoryChange,
}: BreedInputFormProps) {
  const [breedText, setBreedText] = useState('')

  // Fetch all breeds for auto-fill
  const { data: breeds = [] } = useGetBreedsQuery()

  // Save breeds mutation
  const [createBreeds, { isLoading: isSaving }] = useCreateBreedsMutation()

  // Auto-fill textarea with existing breeds when category changes
  useEffect(() => {
    const currentCategoryBreeds = breeds.filter(
      (b) => b.petType === selectedPetType && b.category === selectedCategory
    )
    const breedNames = currentCategoryBreeds.map((b) => b.name).join(', ')
    setBreedText(breedNames)
  }, [selectedPetType, selectedCategory, breeds])

  // Category options based on pet type
  const categoryOptions =
    selectedPetType === 'DOG' ? Object.entries(DOG_CATEGORIES) : Object.entries(CAT_CATEGORIES)

  /**
   * Handle save button click
   * Validates input and calls save mutation
   */
  const handleSave = () => {
    if (!breedText.trim()) {
      toast.error('입력 오류', {
        description: '품종명을 입력해주세요.',
      })
      return
    }

    createBreeds({
      petType: selectedPetType,
      category: selectedCategory as BreedCategory,
      breedNames: breedText,
    })
      .unwrap()
      .then((data) => {
        toast.success('저장 완료', {
          description: `${data.created}개 생성, ${data.updated}개 수정되었습니다.`,
        })
      })
      .catch((error) => {
        toast.error('저장 실패', {
          description: error.message || '품종 저장에 실패했습니다.',
        })
      })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>품종 일괄 입력</CardTitle>
        <CardDescription>콤마(,)로 구분하여 여러 품종을 한 번에 입력할 수 있습니다</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pet type selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">동물 타입</label>
          <Select
            value={selectedPetType}
            onValueChange={(value: 'DOG' | 'CAT') => {
              onPetTypeChange(value)
              // Reset category to default when pet type changes
              const defaultCategory = value === 'DOG' ? 'SMALL' : 'SHORT_HAIR'
              onCategoryChange(defaultCategory)
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DOG">강아지</SelectItem>
              <SelectItem value="CAT">고양이</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">카테고리</label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Breed names textarea */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            품종명 (콤마로 구분)
            <span className="text-muted-foreground ml-2 text-xs">
              예: 토이푸들, 포메라니안, 말티즈
            </span>
          </label>
          <Textarea
            value={breedText}
            onChange={(e) => setBreedText(e.target.value)}
            placeholder="토이푸들, 포메라니안, 말티즈, 시츄"
            rows={6}
            className="font-mono text-sm"
          />
          <p className="text-muted-foreground text-xs">입력 순서대로 표시 순서가 결정됩니다</p>
        </div>

        {/* Save button */}
        <Button onClick={handleSave} disabled={isSaving} className="w-full" size="lg">
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? '저장 중...' : '저장'}
        </Button>
      </CardContent>
    </Card>
  )
}
