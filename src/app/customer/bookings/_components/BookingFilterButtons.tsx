import { Button } from '@/components/ui/button'
import { FilterType, FILTER_OPTIONS } from '../_constants/booking-filters'
import { getFilterLabel } from '../_utils/booking-status.utils'

interface BookingFilterButtonsProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

/**
 * 예약 필터 버튼 그룹 컴포넌트
 */
export function BookingFilterButtons({ activeFilter, onFilterChange }: BookingFilterButtonsProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((filterType) => (
          <Button
            key={filterType}
            variant={activeFilter === filterType ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(filterType)}
          >
            {getFilterLabel(filterType)}
          </Button>
        ))}
      </div>
    </div>
  )
}
