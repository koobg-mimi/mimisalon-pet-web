'use client';

import * as React from 'react';
import { useSession } from '@/lib/auth-client';
import {
  BarChart3,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Home,
  PawPrint,
  Scissors,
  Settings2,
  Star,
  TestTube,
  User as UserIcon,
  UserCog,
  Users,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { SidebarSkeleton } from '@/components/sidebar-skeleton';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

// User interface for type safety
interface User {
  name?: string;
  email?: string;
  profileImage?: string;
  role?: string;
}

// Role-based navigation data
const getNavigationData = (user: User | null) => {
  const baseData = {
    user: {
      name: user?.name || '사용자',
      email: user?.email || '',
      avatar: user?.profileImage || '/default-avatar.png',
    },
    teams: [
      {
        name: '미미살롱펫',
        plan: getRolePlan(user?.role),
      },
    ],
  };

  // Normalize role
  const normalizedRole = user?.role?.toUpperCase();

  switch (normalizedRole) {
    case 'CUSTOMER':
      return {
        ...baseData,
        navMain: [
          {
            title: '대시보드',
            icon: Home,
            url: '/customer/dashboard/overview',
          },
          {
            title: '예약 관리',
            url: '#',
            icon: Calendar,
            items: [
              {
                title: '새 예약',
                url: '/booking/new',
              },
              {
                title: '예약 내역',
                url: '/customer/bookings',
              },
            ],
          },
          {
            title: '내 반려동물',
            url: '/customer/pets',
            icon: PawPrint,
          },
          {
            title: '결제 내역',
            url: '/customer/payments',
            icon: DollarSign,
          },
          {
            title: '리뷰 관리',
            url: '/customer/dashboard/reviews',
            icon: Star,
          },
          {
            title: '내 정보',
            url: '/customer/profile',
            icon: Users,
          },
        ],
      };

    case 'GROOMER':
      return {
        ...baseData,
        navMain: [
          {
            title: '대시보드',
            url: '/groomer/dashboard/overview',
            icon: Home,
            isActive: true,
          },
          {
            title: '예약 관리',
            url: '/groomer/dashboard/bookings',
            icon: Calendar,
          },
          {
            title: '가능한 날짜',
            url: '/groomer/dashboard/availability',
            icon: Clock,
          },
          {
            title: '담당 지역',
            url: '/groomer/dashboard/locations',
            icon: Scissors,
          },
          {
            title: '리뷰 관리',
            url: '/groomer/dashboard/reviews',
            icon: Star,
          },
          {
            title: '내 정보',
            url: '/groomer/dashboard/profile',
            icon: Settings2,
          },
        ],
      };

    case 'ADMIN':
      return {
        ...baseData,
        navMain: [
          {
            title: '대시보드',
            url: '/admin/dashboard/overview',
            icon: Home,
            isActive: true,
          },
          {
            title: '사용자 관리',
            url: '/admin/dashboard/users',
            icon: Users,
          },
          {
            title: '예약 관리',
            url: '/admin/dashboard/bookings',
            icon: Calendar,
          },
          {
            title: '서비스 관리',
            url: '#',
            icon: Scissors,
            items: [
              {
                title: '서비스 관리',
                url: '/admin/dashboard/services',
              },
              {
                title: '옵션 관리',
                url: '/admin/dashboard/service-options',
              },
            ],
          },
          {
            title: '품종 관리',
            url: '/admin/dashboard/breeds',
            icon: PawPrint,
          },
          {
            title: '미용사 관리',
            url: '/admin/dashboard/groomers',
            icon: UserCog,
          },
          {
            title: '리뷰',
            url: '/admin/dashboard/reviews',
            icon: Star,
          },
          {
            title: '정산 관리',
            url: '#',
            icon: DollarSign,
            items: [
              {
                title: '정산 관리',
                url: '/admin/dashboard/settlement/management',
              },
              {
                title: '정산 등급 설정',
                url: '/admin/dashboard/settlement/grades',
              },
            ],
          },
          {
            title: '결제 이력',
            url: '/admin/dashboard/payments',
            icon: CreditCard,
          },
          {
            title: '내 프로필',
            url: '/admin/dashboard/profile',
            icon: UserIcon,
          },
          {
            title: '시스템 테스트',
            url: '/admin/dashboard/system-test',
            icon: TestTube,
          },
        ],
      };

    default:
      return {
        ...baseData,
        navMain: [
          {
            title: '대시보드',
            url: '/dashboard',
            icon: Home,
            isActive: true,
          },
        ],
        projects: [],
      };
  }
};

function getRolePlan(role?: string) {
  switch (role?.toUpperCase()) {
    case 'CUSTOMER':
      return '고객';
    case 'GROOMER':
      return '미용사';
    case 'ADMIN':
      return '관리자';
    default:
      return '사용자';
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending } = useSession();

  // Use navigation data based on user role - compute before early return
  const data = React.useMemo(() => {
    // Return default navigation if not authenticated or no user/role
    if (!session?.user || !session.user.role) {
      return getNavigationData(null);
    }

    return getNavigationData({
      name: session.user.name || '',
      email: session.user.email || '',
      profileImage: session.user.image || '',
      role: session.user.role,
    });
  }, [session]);

  // Show skeleton during loading to prevent navigation flash
  if (isPending) {
    return <SidebarSkeleton {...props} />;
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
