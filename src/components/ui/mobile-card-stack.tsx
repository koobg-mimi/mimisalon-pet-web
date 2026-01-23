'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { ReactNode } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileCardItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  image?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  href?: string;
  metadata?: Record<string, string | number | boolean>;
}

interface MobileCardStackProps {
  items: MobileCardItem[];
  title?: string;
  subtitle?: string;
  onItemClick?: (item: MobileCardItem) => void;
  showChevron?: boolean;
  layout?: 'list' | 'grid';
  emptyState?: {
    icon?: ReactNode;
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  className?: string;
}

export function MobileCardStack({
  items,
  title,
  subtitle,
  onItemClick,
  showChevron = true,
  layout = 'list',
  emptyState,
  className,
}: MobileCardStackProps) {
  if (items.length === 0 && emptyState) {
    return (
      <div className={cn('space-y-4', className)}>
        {(title || subtitle) && (
          <div className="px-4 pt-4">
            {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
            {subtitle && <p className="mt-1 text-gray-600">{subtitle}</p>}
          </div>
        )}

        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
          {emptyState.icon && <div className="mb-4">{emptyState.icon}</div>}
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{emptyState.title}</h3>
          <p className="mb-6 max-w-sm text-gray-600">{emptyState.description}</p>
          {emptyState.action && (
            <Button onClick={emptyState.action.onClick}>{emptyState.action.label}</Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {(title || subtitle) && (
        <div className="px-4 pt-4">
          {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
          {subtitle && <p className="mt-1 text-gray-600">{subtitle}</p>}
        </div>
      )}

      <div
        className={cn(
          layout === 'grid' ? 'grid grid-cols-1 gap-4 px-4 sm:grid-cols-2' : 'space-y-2 px-4'
        )}
      >
        {items.map((item) => (
          <Card
            key={item.id}
            className={cn(
              'cursor-pointer transition-all duration-200',
              'hover:scale-[1.02] hover:shadow-md active:scale-[0.98]',
              'border border-gray-200',
              layout === 'list' && 'rounded-lg'
            )}
            onClick={() => onItemClick?.(item)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                {/* Icon or Image */}
                {item.icon && <div className="flex-shrink-0">{item.icon}</div>}

                {item.image && (
                  <div className="flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="mt-1 truncate text-sm text-gray-600">{item.subtitle}</p>
                      )}
                      {item.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Badge */}
                    {item.badge && <div className="ml-2 flex-shrink-0">{item.badge}</div>}
                  </div>

                  {/* Action Button */}
                  {item.action && (
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          item.action!.onClick();
                        }}
                        className="text-xs"
                      >
                        {item.action.label}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Chevron */}
                {showChevron && !item.action && (
                  <div className="flex-shrink-0">
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Specialized components for different data types
interface BookingCardStackProps {
  bookings: Array<{
    id: string;
    petName: string;
    serviceName: string;
    groomerName: string;
    salonName: string;
    scheduledDate: string;
    scheduledTime: string;
    status: string;
    totalAmount: number;
  }>;
  onBookingClick: (bookingId: string) => void;
  className?: string;
}

export function BookingCardStack({ bookings, onBookingClick, className }: BookingCardStackProps) {
  const items: MobileCardItem[] = bookings.map((booking) => ({
    id: booking.id,
    title: `${booking.petName} - ${booking.serviceName}`,
    subtitle: `${booking.groomerName} • ${booking.salonName}`,
    description: `${booking.scheduledDate} ${booking.scheduledTime}`,
    icon: (
      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
        <span className="text-primary text-lg font-semibold">{booking.petName.charAt(0)}</span>
      </div>
    ),
    badge: (
      <div className="text-right">
        <div className="text-sm font-semibold text-gray-900">
          {booking.totalAmount.toLocaleString('ko-KR')}원
        </div>
        <div
          className={cn(
            'rounded-full px-2 py-1 text-xs',
            booking.status === 'CONFIRMED' && 'bg-green-100 text-green-800',
            booking.status === 'PENDING' && 'bg-yellow-100 text-yellow-800',
            booking.status === 'CANCELLED' && 'bg-red-100 text-red-800'
          )}
        >
          {booking.status === 'CONFIRMED' && '확정'}
          {booking.status === 'PENDING' && '대기'}
          {booking.status === 'CANCELLED' && '취소'}
        </div>
      </div>
    ),
    metadata: booking,
  }));

  return (
    <MobileCardStack
      items={items}
      title="예약 내역"
      onItemClick={(item) => onBookingClick(item.id)}
      emptyState={{
        icon: <div className="h-16 w-16 rounded-full bg-gray-100" />,
        title: '예약 내역이 없습니다',
        description: '새로운 예약을 만들어보세요',
        action: {
          label: '예약하기',
          onClick: () => {
            // Navigate to booking page
          },
        },
      }}
      className={className}
    />
  );
}

interface NotificationCardStackProps {
  notifications: Array<{
    id: string;
    title: string;
    content: string;
    type: string;
    createdAt: string;
    isRead: boolean;
  }>;
  onNotificationClick: (notificationId: string) => void;
  className?: string;
}

export function NotificationCardStack({
  notifications,
  onNotificationClick,
  className,
}: NotificationCardStackProps) {
  const items: MobileCardItem[] = notifications.map((notification) => ({
    id: notification.id,
    title: notification.title,
    description: notification.content,
    subtitle: format(new Date(notification.createdAt), 'yyyy-MM-dd HH:mm:ss', { locale: ko }),
    icon: (
      <div
        className={cn('h-3 w-3 rounded-full', notification.isRead ? 'bg-gray-300' : 'bg-blue-500')}
      />
    ),
    metadata: notification,
  }));

  return (
    <MobileCardStack
      items={items}
      title="알림"
      onItemClick={(item) => onNotificationClick(item.id)}
      emptyState={{
        icon: <div className="h-16 w-16 rounded-full bg-gray-100" />,
        title: '새로운 알림이 없습니다',
        description: '알림이 오면 여기에 표시됩니다',
      }}
      className={className}
    />
  );
}
