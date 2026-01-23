'use client';

import * as React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BookingStatus } from '@mimisalon/shared';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Booking } from '../_types/booking.types';
import { BookingStatusBadge } from './BookingStatusBadge';

const bookingCardVariants = cva('rounded-lg border transition-all duration-300 overflow-hidden', {
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

const bookingCardHeaderVariants = cva('flex items-start justify-between', {
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

const bookingCardTitleVariants = cva('font-semibold', {
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

export interface BookingCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bookingCardVariants> {
  booking: Booking;
  onContactCustomerService: () => void;
}

/**
 * 개별 예약 정보를 표시하는 카드 컴포넌트
 * - variants 시스템으로 다양한 스타일 지원
 * - size 옵션으로 크기 조절 가능
 */
const BookingCard = React.forwardRef<HTMLDivElement, BookingCardProps>(
  ({ className, variant, size, booking, onContactCustomerService, ...props }, ref) => {
    const displayPet = booking.pet || booking.pets[0];
    const mainService = booking.services[0];
    const serviceNames =
      booking.services.length > 1
        ? `${mainService?.name} 외 ${booking.services.length - 1}개`
        : mainService?.name || booking.serviceType;

    return (
      <div ref={ref} className={cn(bookingCardVariants({ variant, size, className }))} {...props}>
        <div className={cn(bookingCardHeaderVariants({ size }))}>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h3 className={cn(bookingCardTitleVariants({ size }), 'truncate')}>{serviceNames}</h3>
              <BookingStatusBadge status={booking.status as BookingStatus} />
            </div>
            <p className="text-muted-foreground truncate text-sm">
              {displayPet?.name} ({displayPet?.breed?.name}) • {booking.groomer.name} 미용사
            </p>
            <p className="text-muted-foreground mt-1 text-xs">예약번호: {booking.bookingNumber}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className={cn(bookingCardTitleVariants({ size }))}>
              {booking.totalPrice.toLocaleString('ko-KR')}원
            </p>
            <p className="text-muted-foreground text-sm whitespace-nowrap">
              {format(new Date(booking.serviceDate), 'yyyy년 MM월 dd일', {
                locale: ko,
              })}{' '}
              {booking.serviceTime}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/customer/booking/${booking.id}`}>상세보기</Link>
          </Button>

          <div className="flex flex-wrap gap-2">
            {(booking.status === 'FIRST_PAYMENT_COMPLETE' ||
              booking.status === 'SERVICE_CONFIRMED') && (
              <Button variant="outline" size="sm" onClick={onContactCustomerService}>
                취소 문의
              </Button>
            )}
            {booking.status === 'SERVICE_COMPLETED' && (
              <Button size="sm" asChild>
                <Link href={`/review/create?bookingId=${booking.id}`}>리뷰 작성</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

BookingCard.displayName = 'BookingCard';

export { BookingCard, bookingCardVariants };
