import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { GroomerStatus } from '../../types/groomer.types'

export interface GroomerFiltersProps {
  /**
   * Current search query value
   */
  searchQuery: string
  /**
   * Current status filter value
   */
  statusFilter: GroomerStatus
  /**
   * Current location filter value
   */
  locationFilter: string
  /**
   * Handler for search query changes
   */
  onSearchChange: (value: string) => void
  /**
   * Handler for status filter changes
   */
  onStatusChange: (value: GroomerStatus) => void
  /**
   * Handler for location filter changes
   */
  onLocationChange: (value: string) => void
  /**
   * Handler for applying filters
   */
  onApplyFilters: () => void
  /**
   * Total count of groomers matching current filters
   */
  totalCount: number
  /**
   * Current page number (for display)
   */
  currentPage: number
  /**
   * Total pages available
   */
  totalPages: number
  /**
   * Available locations for filtering (optional)
   */
  locations?: Array<{ id: string; name: string }>
}

/**
 * GroomerFilters Component
 *
 * Displays filter controls for the groomers list including search, status filter,
 * location filter, and results count.
 *
 * @example
 * ```tsx
 * import { GroomerFilters } from '@/features/admin-groomers/components/groomers/groomer-filters'
 *
 * <GroomerFilters
 *   searchQuery={searchQuery}
 *   statusFilter={statusFilter}
 *   locationFilter={locationFilter}
 *   onSearchChange={setSearchQuery}
 *   onStatusChange={setStatusFilter}
 *   onLocationChange={setLocationFilter}
 *   onApplyFilters={applyFilters}
 *   totalCount={totalCount}
 *   currentPage={loadedPages.length}
 *   totalPages={totalPages}
 *   locations={availableLocations}
 * />
 * ```
 */
export function GroomerFilters({
  searchQuery,
  statusFilter,
  locationFilter,
  onSearchChange,
  onStatusChange,
  onLocationChange,
  onApplyFilters,
  totalCount,
  currentPage,
  totalPages,
  locations = [],
}: GroomerFiltersProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Input
                placeholder="미용사명, 이메일, 전화번호로 검색..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onApplyFilters()
                  }
                }}
                className="pr-4 pl-4"
              />
            </div>
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="상태 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">모든 상태</SelectItem>
              <SelectItem value="ACTIVE">활동중</SelectItem>
              <SelectItem value="INACTIVE">비활성</SelectItem>
            </SelectContent>
          </Select>

          {/* Location Filter (Optional) */}
          {locations.length > 0 && (
            <Select value={locationFilter} onValueChange={onLocationChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="지역 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">모든 지역</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Apply Filters Button */}
          <Button onClick={onApplyFilters} variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            필터 적용
          </Button>
        </div>

        {/* Results Count */}
        {totalCount > 0 && (
          <div className="text-muted-foreground mt-2 text-sm">
            총 {totalCount.toLocaleString('ko-KR')}명의 미용사 (페이지 {currentPage} / {totalPages})
          </div>
        )}
      </CardContent>
    </Card>
  )
}
