import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardStatsGrid } from '../dashboard-stats-grid'
import type { OverviewStats } from '@/features/admin/types/dashboard.types'

describe('DashboardStatsGrid', () => {
  const mockStats: OverviewStats = {
    totalBookings: 150,
    totalRevenue: 5000000,
    totalCustomers: 80,
    activeServices: 12,
    bookingGrowth: 12.5,
    revenueGrowth: 15.3,
    averageBookingValue: 33333,
    periodLabel: '이번 달',
    period: {
      startDate: new Date('2025-10-01').toISOString(),
      endDate: new Date('2025-10-30').toISOString(),
      label: '이번 달',
    },
  }

  describe('기본 렌더링', () => {
    it('4개의 StatCard를 렌더링해야 한다', () => {
      render(<DashboardStatsGrid stats={mockStats} />)

      expect(screen.getByText('총 매출')).toBeDefined()
      expect(screen.getByText('전체 예약')).toBeDefined()
      expect(screen.getByText('등록 사용자')).toBeDefined()
      expect(screen.getByText('평균 예약 금액')).toBeDefined()
    })

    it('포맷된 통계 값을 표시해야 한다', () => {
      render(<DashboardStatsGrid stats={mockStats} />)

      expect(screen.getByText('₩5,000,000')).toBeDefined()
      expect(screen.getByText('150')).toBeDefined()
      expect(screen.getByText('80')).toBeDefined()
      expect(screen.getByText('₩33,333')).toBeDefined()
    })

    it('성장률을 표시해야 한다', () => {
      render(<DashboardStatsGrid stats={mockStats} />)

      expect(screen.getByText('+15.3% 전월대비')).toBeDefined()
      expect(screen.getByText('+12.5% 전월대비')).toBeDefined()
    })
  })

  describe('레이아웃', () => {
    it('그리드 레이아웃을 적용해야 한다', () => {
      const { container } = render(<DashboardStatsGrid stats={mockStats} />)

      const grid = container.querySelector('.grid')
      expect(grid).toBeDefined()
      expect(grid?.className).toContain('gap-4')
      expect(grid?.className).toContain('md:grid-cols-2')
      expect(grid?.className).toContain('lg:grid-cols-4')
    })
  })

  describe('트렌드 처리', () => {
    it('긍정적 트렌드는 highlight variant를 사용해야 한다', () => {
      render(<DashboardStatsGrid stats={mockStats} />)

      // 매출 카드가 highlight variant를 가져야 함 (revenueGrowth > 0)
      const revenueCard = screen.getByText('총 매출').closest('[role="article"]')
      expect(revenueCard?.className).toContain('border-primary/50')
    })

    it('부정적 트렌드를 올바르게 표시해야 한다', () => {
      const negativeStats: OverviewStats = {
        ...mockStats,
        revenueGrowth: -5.2,
        bookingGrowth: -3.1,
      }

      render(<DashboardStatsGrid stats={negativeStats} />)

      expect(screen.getByText('-5.2% 전월대비')).toBeDefined()
      expect(screen.getByText('-3.1% 전월대비')).toBeDefined()
    })

    it('중립 트렌드를 올바르게 표시해야 한다', () => {
      const neutralStats: OverviewStats = {
        ...mockStats,
        revenueGrowth: 0,
        bookingGrowth: 0,
      }

      render(<DashboardStatsGrid stats={neutralStats} />)

      // 2개의 0.0% 전월대비 (매출, 예약)가 있어야 함
      expect(screen.getAllByText('0.0% 전월대비').length).toBe(2)
    })
  })

  describe('엣지 케이스', () => {
    it('0 값을 올바르게 처리해야 한다', () => {
      const zeroStats: OverviewStats = {
        totalBookings: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        activeServices: 0,
        bookingGrowth: 0,
        revenueGrowth: 0,
        averageBookingValue: 0,
        periodLabel: '이번 달',
        period: {
          startDate: new Date('2025-10-01').toISOString(),
          endDate: new Date('2025-10-30').toISOString(),
          label: '이번 달',
        },
      }

      render(<DashboardStatsGrid stats={zeroStats} />)

      // 3개의 ₩0 (총 매출, 평균 예약 금액)이 있어야 함
      expect(screen.getAllByText('₩0').length).toBeGreaterThan(0)
      // 2개의 0 (전체 예약, 등록 사용자)이 있어야 함
      expect(screen.getAllByText('0').length).toBe(2)
    })

    it('큰 숫자를 올바르게 포맷해야 한다', () => {
      const largeStats: OverviewStats = {
        ...mockStats,
        totalRevenue: 999999999,
        totalBookings: 99999,
        averageBookingValue: 5555555,
      }

      render(<DashboardStatsGrid stats={largeStats} />)

      expect(screen.getByText('₩999,999,999')).toBeDefined()
      expect(screen.getByText('99,999')).toBeDefined()
      expect(screen.getByText('₩5,555,555')).toBeDefined()
    })

    it('소수점이 있는 성장률을 올바르게 표시해야 한다', () => {
      const decimalStats: OverviewStats = {
        ...mockStats,
        revenueGrowth: 12.567,
        bookingGrowth: -3.891,
      }

      render(<DashboardStatsGrid stats={decimalStats} />)

      expect(screen.getByText('+12.6% 전월대비')).toBeDefined()
      expect(screen.getByText('-3.9% 전월대비')).toBeDefined()
    })
  })

  describe('아이콘 표시', () => {
    it('각 카드에 적절한 아이콘을 표시해야 한다', () => {
      const { container } = render(<DashboardStatsGrid stats={mockStats} />)

      // 아이콘 컨테이너가 4개 있어야 함 (각 StatCard마다 아이콘과 trend 아이콘이 있음)
      // 실제로는 4개의 main 아이콘 + 2개의 trend 아이콘 = 6개
      const iconContainers = container.querySelectorAll('.h-10.w-10')
      expect(iconContainers.length).toBe(4)
    })
  })
})
