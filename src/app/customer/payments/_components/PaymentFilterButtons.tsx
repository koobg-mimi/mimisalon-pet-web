import { Button } from '@/components/ui/button';
import { FILTER_OPTIONS, FilterType } from '../_constants/payment-filters';
import { getFilterLabel } from '../_utils/payment-status.utils';

interface PaymentFilterButtonsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function PaymentFilterButtons({ activeFilter, onFilterChange }: PaymentFilterButtonsProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((filterOption) => (
          <Button
            key={filterOption}
            variant={activeFilter === filterOption ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(filterOption)}
          >
            {getFilterLabel(filterOption)}
          </Button>
        ))}
      </div>
    </div>
  );
}
