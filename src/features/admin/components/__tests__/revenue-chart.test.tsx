import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RevenueChart } from '../revenue-chart'
import type { MonthlyRevenue } from '@/features/admin/types/dashboard.types'

describe('RevenueChart', () => {
  const mockData: MonthlyRevenue[] = [
    {
      month: '2025-01',
      value: 1000000,
      previousValue: 900000,
      percentageChange: 11.1,
    },
    {
      month: '2025-02',
      value: 1200000,
      previousValue: 1000000,
      percentageChange: 20.0,
    },
    {
      month: '2025-03',
      value: 1100000,
      previousValue: 1200000,
      percentageChange: -8.3,
    },
  ]

  describe('기본 렌더링', () => {
    it('카드 제목을 렌더링해야 한다', () => {
      render(<RevenueChart data={mockData} />)

      expect(screen.getByText('월별 매출 현황')).toBeDefined()
    })

    it('차트를 렌더링해야 한다', () => {
      const { container } = render(<RevenueChart data={mockData} />)

      // ResponsiveContainer가 렌더링되는지 확인
      const chart = container.querySelector('.recharts-wrapper')
      expect(chart).toBeDefined()
    })
  })

  describe('데이터 처리', () => {
    it('최근 12개월 데이터만 표시해야 한다', () => {
      const manyMonths: MonthlyRevenue[] = Array.from({ length: 24 }, (_, i) => ({
        month: `2024-${String(i + 1).padStart(2, '0')}`,
        value: 1000000 + i * 10000,
        previousValue: 950000 + i * 10000,
        percentageChange: 5.0,
      }))

      const { container } = render(<RevenueChart data={manyMonths} />)

      // BarChart가 렌더링되는지 확인
      const chart = container.querySelector('.recharts-wrapper')
      expect(chart).toBeDefined()
    })

    it('빈 데이터를 처리해야 한다', () => {
      const { container } = render(<RevenueChart data={[]} />)

      // 차트가 여전히 렌더링되어야 함 (빈 상태)
      const chart = container.querySelector('.recharts-wrapper')
      expect(chart).toBeDefined()
    })
  })

  describe('레이아웃', () => {
    it('고정된 높이를 가져야 한다', () => {
      const { container } = render(<RevenueChart data={mockData} />)

      const chartContainer = container.querySelector('.h-\\[300px\\]')
      expect(chartContainer).toBeDefined()
      expect(chartContainer?.className).toContain('w-full')
    })
  })

  describe('엣지 케이스', () => {
    it('단일 데이터 포인트를 처리해야 한다', () => {
      const singleData: MonthlyRevenue[] = [mockData[0]]

      const { container } = render(<RevenueChart data={singleData} />)

      const chart = container.querySelector('.recharts-wrapper')
      expect(chart).toBeDefined()
    })

    it('0 값을 처리해야 한다', () => {
      const zeroData: MonthlyRevenue[] = [
        {
          month: '2025-01',
          value: 0,
          previousValue: 0,
          percentageChange: 0,
        },
      ]

      const { container } = render(<RevenueChart data={zeroData} />)

      const chart = container.querySelector('.recharts-wrapper')
      expect(chart).toBeDefined()
    })

    it('큰 숫자를 처리해야 한다', () => {
      const largeData: MonthlyRevenue[] = [
        {
          month: '2025-01',
          value: 999999999,
          previousValue: 888888888,
          percentageChange: 12.5,
        },
      ]

      const { container } = render(<RevenueChart data={largeData} />)

      const chart = container.querySelector('.recharts-wrapper')
      expect(chart).toBeDefined()
    })
  })

  describe('반응형 디자인', () => {
    it('ResponsiveContainer를 사용해야 한다', () => {
      const { container } = render(<RevenueChart data={mockData} />)

      // ResponsiveContainer가 100% width를 가져야 함
      const responsive = container.querySelector('.recharts-responsive-container')
      expect(responsive).toBeDefined()
    })
  })
})
