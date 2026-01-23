'use client'

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
import type { PaymentFilters } from '../../types/payment.types'

/**
 * Props for PaymentFilters component
 */
interface PaymentFiltersProps {
  /** Current filter values */
  filters: PaymentFilters
  /** Callback when filters change */
  onFiltersChange: (filters: Partial<PaymentFilters>) => void
  /** Total count of payments (for display) */
  totalCount: number
}

/**
 * Payment search and filter controls
 *
 * Provides UI for searching payments by ID/order/booking number
 * and filtering by payment status.
 *
 * @example
 * ```tsx
 * <PaymentFilters
 *   filters={{ searchQuery: '', statusFilter: 'ALL' }}
 *   onFiltersChange={(filters) => setFilters(prev => ({ ...prev, ...filters }))}
 *   totalCount={150}
 * />
 * ```
 */
export function PaymentFilters({ filters, onFiltersChange, totalCount }: PaymentFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ searchQuery: value })
  }

  const handleStatusChange = (value: PaymentFilters['statusFilter']) => {
    onFiltersChange({ statusFilter: value })
  }

  const handleApplyFilters = () => {
    // Filters are applied automatically via onFiltersChange
    // This button is kept for explicit "apply" UX if needed
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="결제 ID, 주문 ID, 주문명, 예약번호로 검색..."
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            />
          </div>

          {/* Status Filter */}
          <Select value={filters.statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-10 w-full sm:w-[180px]">
              <SelectValue placeholder="상태 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">모든 상태</SelectItem>
              <SelectItem value="PENDING">대기중</SelectItem>
              <SelectItem value="PAID">결제완료</SelectItem>
              <SelectItem value="AUTHORIZED">승인됨</SelectItem>
              <SelectItem value="CAPTURED">확정됨</SelectItem>
              <SelectItem value="COMPLETED">완료</SelectItem>
              <SelectItem value="FAILED">실패</SelectItem>
              <SelectItem value="CANCELLED">취소됨</SelectItem>
              <SelectItem value="PARTIAL_CANCELLED">부분취소</SelectItem>
              <SelectItem value="REFUNDED">환불완료</SelectItem>
              <SelectItem value="PARTIALLY_REFUNDED">부분환불</SelectItem>
              <SelectItem value="EXPIRED">만료</SelectItem>
            </SelectContent>
          </Select>

          {/* Apply Button */}
          <Button onClick={handleApplyFilters} variant="outline" className="h-10 w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            필터 적용
          </Button>
        </div>

        {/* Results Count */}
        {totalCount > 0 && (
          <div className="text-muted-foreground mt-4 text-sm">
            총 {totalCount.toLocaleString()}건의 결제 내역
          </div>
        )}
      </CardContent>
    </Card>
  )
}
