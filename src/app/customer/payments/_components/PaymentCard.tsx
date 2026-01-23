'use client';

import * as React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { PaymentStatus } from '@mimisalon/shared';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Payment } from '../_types/payment.types';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { getMethodText } from '../_utils/payment-status.utils';

const paymentCardVariants = cva('rounded-lg border transition-all duration-300 overflow-hidden', {
  variants: {
    variant: {
      default:
        'border-border bg-card shadow-sm before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/5 before:to-transparent before:translate-x-[-200%] before:duration-700',
      compact: 'border-border bg-card shadow-sm',
      detailed: 'border-border bg-card shadow-md',
      highlight: 'border-primary/50 bg-gradient-to-br from-primary/5 to-transparent shadow-md',
      minimal: 'border-border/50 bg-transparent',
    },
    size: {
      sm: 'p-4',
      default: 'p-5',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const paymentCardHeaderVariants = cva('flex items-start justify-between', {
  variants: {
    size: {
      sm: 'mb-3 gap-3',
      default: 'mb-4 gap-4',
      lg: 'mb-6 gap-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const paymentCardTitleVariants = cva('font-semibold', {
  variants: {
    size: {
      sm: 'text-sm',
      default: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface PaymentCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paymentCardVariants> {
  payment: Payment;
}

/**
 * 개별 결제 정보를 표시하는 카드 컴포넌트
 * - variants 시스템으로 다양한 스타일 지원
 * - size 옵션으로 크기 조절 가능
 */
const PaymentCard = React.forwardRef<HTMLDivElement, PaymentCardProps>(
  ({ className, variant, size, payment, ...props }, ref) => {
    const serviceName = payment.booking?.service?.name || payment.orderName || '미용 서비스';
    const petName = payment.booking?.pet?.name || '';

    return (
      <div ref={ref} className={cn(paymentCardVariants({ variant, size, className }))} {...props}>
        <div className={cn(paymentCardHeaderVariants({ size }))}>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h3 className={cn(paymentCardTitleVariants({ size }), 'truncate')}>{serviceName}</h3>
              <PaymentStatusBadge status={payment.status as PaymentStatus} />
            </div>
            <p className="text-muted-foreground truncate text-sm">
              {petName && `${petName} • `}
              {getMethodText(payment.method)}
            </p>
            <p className="text-muted-foreground text-xs">
              {format(new Date(payment.createdAt), 'yyyy년 MM월 dd일 HH:mm', {
                locale: ko,
              })}
            </p>
            {payment.booking && (
              <p className="text-muted-foreground mt-1 text-xs">
                예약번호: {payment.booking.bookingNumber}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 text-right">
            <p className={cn(paymentCardTitleVariants({ size }))}>
              {payment.amount.toLocaleString('ko-KR')}원
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          {payment.booking ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/customer/booking/${payment.booking.id}`}>예약 상세</Link>
            </Button>
          ) : (
            <div />
          )}

          {(payment.status === 'PAID' || payment.status === 'COMPLETED') && payment.receiptUrl && (
            <Button size="sm" variant="outline" asChild>
              <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer">
                영수증 보기
              </a>
            </Button>
          )}
        </div>
      </div>
    );
  }
);

PaymentCard.displayName = 'PaymentCard';

export { PaymentCard, paymentCardVariants };
