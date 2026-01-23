import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FilterType } from '../_constants/booking-filters';
import { getFilterLabel } from '../_utils/booking-status.utils';

interface EmptyBookingStateProps {
  filter: FilterType;
}

/**
 * 예약이 없을 때 표시되는 빈 상태 컴포넌트
 */
export function EmptyBookingState({ filter }: EmptyBookingStateProps) {
  return (
    <div className="py-12 text-center">
      <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <svg
          className="text-muted-foreground h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-foreground mb-2 text-lg font-medium">
        {filter === 'ALL' ? '예약 내역이 없습니다' : `${getFilterLabel(filter)} 예약이 없습니다`}
      </h3>
      <p className="text-muted-foreground mb-4">첫 번째 미용 예약을 만들어보세요.</p>
      <Button asChild>
        <Link href="/booking/new">예약하기</Link>
      </Button>
    </div>
  );
}
