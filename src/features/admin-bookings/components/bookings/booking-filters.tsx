import { Filter, Search } from 'lucide-react'
import { BookingStatus } from '@mimisalon/shared'
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

export interface BookingFiltersProps {
  /**
   * Current search query value
   */
  searchQuery: string
  /**
   * Current status filter value
   */
  statusFilter: string
  /**
   * Current date filter value (YYYY-MM-DD)
   */
  dateFilter: string
  /**
   * Handler for search query changes
   */
  onSearchChange: (value: string) => void
  /**
   * Handler for status filter changes
   */
  onStatusChange: (value: string) => void
  /**
   * Handler for date filter changes
   */
  onDateChange: (value: string) => void
  /**
   * Handler for applying filters
   */
  onApplyFilters: () => void
  /**
   * Total count of bookings matching current filters
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
}

/**
 * BookingFilters Component
 *
 * Displays filter controls for the bookings list including search, status filter,
 * date filter, and results count.
 *
 * @example
 * ```tsx
 * import { BookingFilters } from '@/features/admin-bookings/components/bookings/booking-filters'
 *
 * <BookingFilters
 *   searchQuery={searchQuery}
 *   statusFilter={statusFilter}
 *   dateFilter={dateFilter}
 *   onSearchChange={setSearchQuery}
 *   onStatusChange={setStatusFilter}
 *   onDateChange={setDateFilter}
 *   onApplyFilters={applyFilters}
 *   totalCount={totalCount}
 *   currentPage={loadedPages.length}
 *   totalPages={totalPages}
 * />
 * ```
 */
export function BookingFilters({
  searchQuery,
  statusFilter,
  dateFilter,
  onSearchChange,
  onStatusChange,
  onDateChange,
  onApplyFilters,
  totalCount,
  currentPage,
  totalPages,
}: BookingFiltersProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Input
                placeholder="예약번호, 고객명, 전화번호로 검색..."
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
              <SelectItem value={BookingStatus.GROOMER_CONFIRM_PENDING}>
                미용사 확인 대기
              </SelectItem>
              <SelectItem value={BookingStatus.GROOMER_CONFIRM}>미용사 확정</SelectItem>
              <SelectItem value={BookingStatus.WORK_IN_PROGRESS}>진행중</SelectItem>
              <SelectItem value={BookingStatus.SERVICE_COMPLETED}>완료</SelectItem>
              <SelectItem value={BookingStatus.SERVICE_CANCELLED}>취소</SelectItem>
              <SelectItem value={BookingStatus.BOOKING_FAILED}>예약 실패</SelectItem>
              <SelectItem value={BookingStatus.FIRST_PAYMENT_PENDING}>결제 대기</SelectItem>
              <SelectItem value={BookingStatus.FIRST_PAYMENT_COMPLETE}>결제 완료</SelectItem>
              <SelectItem value={BookingStatus.FIRST_PAYMENT_VERIFY}>결제 확인 중</SelectItem>
              <SelectItem value={BookingStatus.ADDITIONAL_PAYMENT_PENDING}>
                추가 결제 대기
              </SelectItem>
              <SelectItem value={BookingStatus.ADDITIONAL_PAYMENT_COMPLETE}>
                추가 결제 완료
              </SelectItem>
              <SelectItem value={BookingStatus.WORK_IN_PROGRESS}>진행중</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-[180px]"
          />

          {/* Apply Filters Button */}
          <Button onClick={onApplyFilters} variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            필터 적용
          </Button>
        </div>

        {/* Results Count */}
        {totalCount > 0 && (
          <div className="text-muted-foreground mt-2 text-sm">
            총 {totalCount.toLocaleString('ko-KR')}개의 예약 (페이지 {currentPage} / {totalPages})
          </div>
        )}
      </CardContent>
    </Card>
  )
}
