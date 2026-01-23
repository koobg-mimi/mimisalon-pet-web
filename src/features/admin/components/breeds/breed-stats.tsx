/**
 * Admin Breeds Feature - Statistics Component
 *
 * Displays aggregate statistics for breed data including counts by pet type
 * and active status. Extracted from the main breeds page for better modularity.
 *
 * @module features/admin/components/breeds/breed-stats
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { BreedWithCount } from '@/features/admin/types/breeds.types'

/**
 * Props for the BreedStats component
 */
interface BreedStatsProps {
  /** Array of breeds with pet counts to calculate statistics from */
  breeds: BreedWithCount[]
}

/**
 * Statistics panel showing breed counts by various categories
 *
 * @remarks
 * Displays four statistics in a responsive grid:
 * - Dog breed count
 * - Cat breed count
 * - Active breed count
 * - Inactive breed count
 *
 * @example
 * ```tsx
 * <BreedStats breeds={breeds} />
 * ```
 */
export function BreedStats({ breeds }: BreedStatsProps) {
  // Calculate statistics from breeds array
  const dogCount = breeds.filter((b) => b.petType === 'DOG').length
  const catCount = breeds.filter((b) => b.petType === 'CAT').length
  const activeCount = breeds.filter((b) => b.isActive).length
  const inactiveCount = breeds.filter((b) => !b.isActive).length

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>전체 품종 통계</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">강아지 품종</p>
            <p className="text-2xl font-bold">{dogCount}개</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">고양이 품종</p>
            <p className="text-2xl font-bold">{catCount}개</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">활성 품종</p>
            <p className="text-2xl font-bold">{activeCount}개</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">비활성 품종</p>
            <p className="text-2xl font-bold">{inactiveCount}개</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
