import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FilterType } from '../_constants/payment-filters';

interface EmptyPaymentStateProps {
  filter: FilterType;
}

export function EmptyPaymentState({ filter }: EmptyPaymentStateProps) {
  const getEmptyMessage = () => {
    switch (filter) {
      case 'PAID':
        return {
          title: '완료된 결제 내역이 없습니다',
          description: '미용 서비스를 예약하고 결제를 완료해보세요.',
        };
      case 'PENDING':
        return {
          title: '대기 중인 결제가 없습니다',
          description: '모든 결제가 완료되었습니다.',
        };
      case 'FAILED':
        return {
          title: '실패한 결제 내역이 없습니다',
          description: '모든 결제가 성공적으로 처리되었습니다.',
        };
      case 'REFUNDED':
        return {
          title: '환불 내역이 없습니다',
          description: '환불 처리된 결제가 없습니다.',
        };
      default:
        return {
          title: '결제 내역이 없습니다',
          description: '첫 번째 미용 서비스를 예약해보세요.',
        };
    }
  };

  const { title, description } = getEmptyMessage();

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
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      </div>
      <h3 className="text-foreground mb-2 text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {filter === 'ALL' && (
        <Button asChild>
          <Link href="/booking/new">예약하기</Link>
        </Button>
      )}
    </div>
  );
}
