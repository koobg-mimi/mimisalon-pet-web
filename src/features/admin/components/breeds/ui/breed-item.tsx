/**
 * BreedItem Component
 *
 * A single breed list item component following the CVA (Class Variance Authority) pattern.
 * Displays breed information with toggle and delete actions.
 *
 * @module features/admin/components/breeds/ui/breed-item
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ToggleRight, ToggleLeft, Trash2 } from 'lucide-react'
import type { BreedWithCount } from '@/features/admin/types/breeds.types'

// ============================================================================
// CVA Variants Definition
// ============================================================================

/**
 * Breed item variants configuration
 *
 * @remarks
 * Defines visual variants and sizes for the breed list item component.
 * All variants follow the project's CVA pattern requirements.
 */
const breedItemVariants = cva('flex items-center justify-between transition-colors', {
  variants: {
    variant: {
      /** Default muted background with subtle styling */
      default: 'bg-muted/50 rounded-lg',
      /** Compact variant with lighter background */
      compact: 'bg-muted/30 rounded',
      /** Detailed variant with card styling and border */
      detailed: 'bg-card border border-border rounded-lg shadow-sm',
      /** Highlight variant with primary accent and gradient */
      highlight:
        'border border-primary/50 bg-gradient-to-br from-primary/5 to-transparent rounded-lg shadow-md',
      /** Minimal variant with transparent background */
      minimal: 'border border-border/50 bg-transparent rounded-lg',
    },
    size: {
      /** Small padding for compact layouts */
      sm: 'p-2',
      /** Default padding for standard layouts */
      default: 'p-3',
      /** Large padding for spacious layouts */
      lg: 'p-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for the BreedItem component
 *
 * @remarks
 * Extends HTMLDivElement attributes and CVA variant props.
 * Requires breed data and handler functions for toggle and delete actions.
 *
 * @example
 * ```tsx
 * <BreedItem
 *   breed={breedWithCount}
 *   onToggleActive={(id, isActive) => handleToggle(id, isActive)}
 *   onDeleteBreed={(id, name) => handleDelete(id, name)}
 *   variant="detailed"
 *   size="lg"
 * />
 * ```
 */
export interface BreedItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'>,
    VariantProps<typeof breedItemVariants> {
  /** Breed data with pet count */
  breed: BreedWithCount
  /** Handler for toggling breed active status */
  onToggleActive: (id: string, isActive: boolean) => void
  /** Handler for deleting breed */
  onDeleteBreed: (id: string, name: string) => void
}

// ============================================================================
// Component Definition
// ============================================================================

/**
 * BreedItem - A single breed list item with actions
 *
 * @remarks
 * Displays breed information including:
 * - Display order number
 * - Breed name
 * - Active/inactive status badge
 * - Pet count badge (if pets exist)
 * - Toggle active/inactive button
 * - Delete button (disabled if pets exist)
 *
 * Follows the CVA pattern with forwardRef for proper ref forwarding.
 *
 * @example
 * ```tsx
 * <BreedItem
 *   breed={{
 *     id: "cuid",
 *     name: "푸들",
 *     displayOrder: 1,
 *     isActive: true,
 *     _count: { pets: 5 }
 *   }}
 *   onToggleActive={handleToggle}
 *   onDeleteBreed={handleDelete}
 * />
 * ```
 */
const BreedItem = React.forwardRef<HTMLDivElement, BreedItemProps>(
  ({ className, variant, size, breed, onToggleActive, onDeleteBreed, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(breedItemVariants({ variant, size, className }))} {...props}>
        {/* Left side: Breed information */}
        <div className="flex items-center gap-3">
          {/* Display order number */}
          <span className="text-muted-foreground w-6 font-mono text-xs">#{breed.displayOrder}</span>

          {/* Breed name */}
          <span className="font-medium">{breed.name}</span>

          {/* Inactive status badge */}
          {!breed.isActive && (
            <Badge variant="outline" className="text-xs">
              비활성
            </Badge>
          )}

          {/* Pet count badge */}
          {breed._count.pets > 0 && (
            <Badge variant="secondary" className="text-xs">
              {breed._count.pets}마리 사용 중
            </Badge>
          )}
        </div>

        {/* Right side: Action buttons */}
        <div className="flex gap-1">
          {/* Toggle active/inactive button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleActive(breed.id, breed.isActive)}
            title={breed.isActive ? '비활성화' : '활성화'}
          >
            {breed.isActive ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
          </Button>

          {/* Delete button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteBreed(breed.id, breed.name)}
            disabled={breed._count.pets > 0}
            title={breed._count.pets > 0 ? '사용 중인 품종은 삭제할 수 없습니다' : '삭제'}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }
)

BreedItem.displayName = 'BreedItem'

// ============================================================================
// Exports
// ============================================================================

export { BreedItem, breedItemVariants }
