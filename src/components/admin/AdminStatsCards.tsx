'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { useEffect, useState } from 'react';
import {
  Users,
  Calendar,
  DollarSign,
  Star,
  UserCheck,
  UserCog,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { StatsCard } from '@/components/stats/card';
import { StatsGrid } from '@/components/stats/grid';

interface AdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalGroomers: number;
  totalAdmins: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  todayBookings: number;
  todayRevenue: number;
  monthlyRevenue: number;
  totalRevenue: number;
  totalReviews: number;
  averageRating: number;
}

interface AdminStatsCardsProps {
  variant?: 'overview' | 'users' | 'bookings' | 'groomers' | 'reviews' | 'services' | 'settlements';
}

export function AdminStatsCards({ variant = 'overview' }: AdminStatsCardsProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <StatsGrid>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border-border bg-card animate-pulse rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="bg-muted h-4 w-20 rounded"></div>
                <div className="bg-muted h-8 w-16 rounded"></div>
              </div>
              <div className="bg-muted h-12 w-12 rounded-full"></div>
            </div>
          </div>
        ))}
      </StatsGrid>
    );
  }

  if (!stats) {
    return null;
  }

  const getStatsCards = () => {
    switch (variant) {
      case 'users':
        return [
          {
            title: '총 사용자',
            value: stats.totalUsers,
            icon: <Users className="h-6 w-6 text-blue-600" />,
            color: 'bg-blue-100',
          },
          {
            title: '고객',
            value: stats.totalCustomers,
            icon: <UserCheck className="h-6 w-6 text-green-600" />,
            color: 'bg-green-100',
          },
          {
            title: '미용사',
            value: stats.totalGroomers,
            icon: <UserCog className="h-6 w-6 text-purple-600" />,
            color: 'bg-purple-100',
          },
          {
            title: '관리자',
            value: stats.totalAdmins,
            icon: <Users className="h-6 w-6 text-red-600" />,
            color: 'bg-red-100',
          },
        ];

      case 'bookings':
        return [
          {
            title: '총 예약',
            value: stats.totalBookings,
            icon: <Calendar className="h-6 w-6 text-blue-600" />,
            color: 'bg-blue-100',
          },
          {
            title: '대기중',
            value: stats.pendingBookings,
            icon: <Clock className="h-6 w-6 text-yellow-600" />,
            color: 'bg-yellow-100',
          },
          {
            title: '완료',
            value: stats.completedBookings,
            icon: <CheckCircle className="h-6 w-6 text-green-600" />,
            color: 'bg-green-100',
          },
          {
            title: '취소',
            value: stats.cancelledBookings,
            icon: <XCircle className="h-6 w-6 text-red-600" />,
            color: 'bg-red-100',
          },
        ];

      case 'groomers':
        return [
          {
            title: '등록 미용사',
            value: stats.totalGroomers,
            icon: <UserCog className="h-6 w-6 text-purple-600" />,
            color: 'bg-purple-100',
          },
          {
            title: '완료 예약',
            value: stats.completedBookings,
            icon: <CheckCircle className="h-6 w-6 text-green-600" />,
            color: 'bg-green-100',
          },
          {
            title: '평균 별점',
            value: stats.averageRating.toFixed(1),
            icon: <Star className="h-6 w-6 text-yellow-600" />,
            color: 'bg-yellow-100',
          },
          {
            title: '총 리뷰',
            value: stats.totalReviews,
            icon: <Star className="h-6 w-6 text-orange-600" />,
            color: 'bg-orange-100',
          },
        ];

      case 'reviews':
        return [
          {
            title: '총 리뷰',
            value: stats.totalReviews,
            icon: <Star className="h-6 w-6 text-yellow-600" />,
            color: 'bg-yellow-100',
          },
          {
            title: '평균 별점',
            value: stats.averageRating.toFixed(1),
            icon: <Star className="h-6 w-6 text-orange-600" />,
            color: 'bg-orange-100',
          },
          {
            title: '완료 예약',
            value: stats.completedBookings,
            icon: <CheckCircle className="h-6 w-6 text-green-600" />,
            color: 'bg-green-100',
          },
          {
            title: '총 고객',
            value: stats.totalCustomers,
            icon: <Users className="h-6 w-6 text-blue-600" />,
            color: 'bg-blue-100',
          },
        ];

      case 'settlements':
        return [
          {
            title: '월 매출',
            value: `${stats.monthlyRevenue.toLocaleString('ko-KR')}원`,
            icon: <DollarSign className="h-6 w-6 text-green-600" />,
            color: 'bg-green-100',
          },
          {
            title: '총 매출',
            value: `${stats.totalRevenue.toLocaleString('ko-KR')}원`,
            icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
            color: 'bg-blue-100',
          },
          {
            title: '등록 미용사',
            value: stats.totalGroomers,
            icon: <UserCog className="h-6 w-6 text-purple-600" />,
            color: 'bg-purple-100',
          },
          {
            title: '완료 예약',
            value: stats.completedBookings,
            icon: <CheckCircle className="h-6 w-6 text-green-600" />,
            color: 'bg-green-100',
          },
        ];

      default: // overview
        return [
          {
            title: '총 사용자',
            value: stats.totalUsers,
            icon: <Users className="h-6 w-6 text-blue-600" />,
            color: 'bg-blue-100',
          },
          {
            title: '총 예약',
            value: stats.totalBookings,
            icon: <Calendar className="h-6 w-6 text-green-600" />,
            color: 'bg-green-100',
          },
          {
            title: '월 매출',
            value: `${stats.monthlyRevenue.toLocaleString('ko-KR')}원`,
            icon: <DollarSign className="text-primary h-6 w-6" />,
            color: 'bg-primary/10',
          },
          {
            title: '등록 미용사',
            value: stats.totalGroomers,
            icon: <UserCog className="h-6 w-6 text-purple-600" />,
            color: 'bg-purple-100',
          },
        ];
    }
  };

  const statsCards = getStatsCards();

  return (
    <StatsGrid>
      {statsCards.map((card, index) => (
        <StatsCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          iconBgColor={card.color}
        />
      ))}
    </StatsGrid>
  );
}
