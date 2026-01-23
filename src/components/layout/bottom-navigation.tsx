'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  HomeIcon,
  CalendarIcon,
  MessageCircleIcon,
  BellIcon,
  UserIcon,
  ScissorsIcon,
  BarChart3Icon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface BottomNavigationProps {
  userRole: 'CUSTOMER' | 'GROOMER' | 'ADMIN';
  unreadNotifications?: number;
  unreadMessages?: number;
  className?: string;
}

const CUSTOMER_TABS: BottomNavigationItem[] = [
  {
    label: '홈',
    href: '/customer',
    icon: HomeIcon,
  },
  {
    label: '예약',
    href: '/customer/bookings',
    icon: CalendarIcon,
  },
  {
    label: '메시지',
    href: '/customer/messages',
    icon: MessageCircleIcon,
  },
  {
    label: '알림',
    href: '/customer/notifications',
    icon: BellIcon,
  },
  {
    label: '내 정보',
    href: '/customer/profile',
    icon: UserIcon,
  },
];

const GROOMER_TABS: BottomNavigationItem[] = [
  {
    label: '홈',
    href: '/groomer/dashboard/overview',
    icon: HomeIcon,
  },
  {
    label: '예약',
    href: '/groomer/dashboard/bookings',
    icon: CalendarIcon,
  },
  {
    label: '서비스',
    href: '/groomer/dashboard/services',
    icon: ScissorsIcon,
  },
  {
    label: '메시지',
    href: '/groomer/dashboard/messages',
    icon: MessageCircleIcon,
  },
  {
    label: '프로필',
    href: '/groomer/dashboard/profile',
    icon: UserIcon,
  },
];

const ADMIN_TABS: BottomNavigationItem[] = [
  {
    label: '대시보드',
    href: '/admin/dashboard/overview',
    icon: HomeIcon,
  },
  {
    label: '통계',
    href: '/admin/analytics',
    icon: BarChart3Icon,
  },
  {
    label: '서비스',
    href: '/admin/services',
    icon: ScissorsIcon,
  },
  {
    label: '사용자',
    href: '/admin/users',
    icon: UserIcon,
  },
  {
    label: '알림',
    href: '/admin/notifications',
    icon: BellIcon,
  },
];

export function BottomNavigation({
  userRole,
  unreadNotifications = 0,
  unreadMessages = 0,
  className,
}: BottomNavigationProps) {
  const pathname = usePathname();

  const getNavigationTabs = () => {
    switch (userRole) {
      case 'CUSTOMER':
        return CUSTOMER_TABS;
      case 'GROOMER':
        return GROOMER_TABS;
      case 'ADMIN':
        return ADMIN_TABS;
      default:
        return [];
    }
  };

  const navigationTabs = getNavigationTabs();

  const getBadgeCount = (href: string) => {
    if (href.includes('/notifications')) return unreadNotifications;
    if (href.includes('/messages')) return unreadMessages;
    return undefined;
  };

  const isTabActive = (href: string) => {
    if (
      href === '/customer' ||
      href === '/groomer/dashboard/overview' ||
      href === '/admin/dashboard/overview'
    ) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div
      className={cn(
        'fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white',
        'safe-area-pb sm:hidden', // Only show on mobile
        className
      )}
    >
      <nav className="flex items-center justify-around px-1">
        {navigationTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = isTabActive(tab.href);
          const badgeCount = getBadgeCount(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'relative flex min-h-[56px] min-w-0 flex-1 flex-col items-center justify-center px-2 py-2',
                'rounded-lg transition-all duration-200',
                'active:scale-95 active:bg-gray-50', // Touch feedback
                isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <div className="relative">
                <Icon
                  className={cn('mb-0.5 h-6 w-6', isActive ? 'text-primary' : 'text-gray-500')}
                />

                {badgeCount && badgeCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 flex h-[18px] min-h-[18px] w-auto min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold"
                  >
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </Badge>
                )}
              </div>

              <span
                className={cn(
                  'mt-0.5 w-full truncate text-center text-[11px] font-medium',
                  isActive ? 'text-primary font-semibold' : 'text-gray-500'
                )}
              >
                {tab.label}
              </span>

              {/* Active indicator - moved to bottom */}
              {isActive && (
                <div className="bg-primary absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 transform rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom" />
    </div>
  );
}
