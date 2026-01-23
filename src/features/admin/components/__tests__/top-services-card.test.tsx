import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TopServicesCard } from '../top-services-card'
import type { ServiceStats } from '@/features/admin/types/dashboard.types'

describe('TopServicesCard', () => {
  const mockServices: ServiceStats[] = [
    {
      serviceId: '1',
      name: '전신 미용',
      bookings: 150,
      revenue: 5000000,
      rating: 4.8,
      satisfactionRate: 95,
      rank: 1,
      growth: 12.5,
    },
    {
      serviceId: '2',
      name: '부분 미용',
      bookings: 120,
      revenue: 3000000,
      rating: 4.6,
      satisfactionRate: 90,
      rank: 2,
      growth: 8.3,
    },
    {
      serviceId: '3',
      name: '샴푸',
      bookings: 100,
      revenue: 1500000,
      rating: 4.5,
      satisfactionRate: 88,
      rank: 3,
      growth: -2.1,
    },
  ]

  describe('기본 렌더링', () => {
    it('카드 제목을 렌더링해야 한다', () => {
      render(<TopServicesCard services={mockServices} />)

      expect(screen.getByText('인기 서비스')).toBeDefined()
    })

    it('모든 서비스를 렌더링해야 한다', () => {
      render(<TopServicesCard services={mockServices} />)

      expect(screen.getByText('전신 미용')).toBeDefined()
      expect(screen.getByText('부분 미용')).toBeDefined()
      expect(screen.getByText('샴푸')).toBeDefined()
    })

    it('서비스 통계를 표시해야 한다', () => {
      render(<TopServicesCard services={mockServices} />)

      expect(screen.getByText('150 건')).toBeDefined()
      expect(screen.getByText('₩5,000,000')).toBeDefined()
      expect(screen.getByText('⭐ 4.8')).toBeDefined()
      expect(screen.getByText('만족도 95%')).toBeDefined()
    })
  })

  describe('순위 표시', () => {
    it('각 서비스의 순위를 표시해야 한다', () => {
      render(<TopServicesCard services={mockServices} />)

      expect(screen.getByText('1')).toBeDefined()
      expect(screen.getByText('2')).toBeDefined()
      expect(screen.getByText('3')).toBeDefined()
    })

    it('순위 배지가 원형이어야 한다', () => {
      const { container } = render(<TopServicesCard services={mockServices} />)

      const badges = container.querySelectorAll('.rounded-full')
      expect(badges.length).toBeGreaterThan(0)
    })
  })

  describe('성장률 표시', () => {
    it('긍정적 성장률을 표시해야 한다', () => {
      render(<TopServicesCard services={mockServices} />)

      expect(screen.getByText('+12.5%')).toBeDefined()
      expect(screen.getByText('+8.3%')).toBeDefined()
    })

    it('부정적 성장률을 표시해야 한다', () => {
      render(<TopServicesCard services={mockServices} />)

      expect(screen.getByText('-2.1%')).toBeDefined()
    })

    it('성장률에 따라 적절한 색상을 적용해야 한다', () => {
      const { container } = render(<TopServicesCard services={mockServices} />)

      // 긍정적 성장률은 녹색
      const positiveGrowth = screen.getByText('+12.5%').closest('span')
      expect(positiveGrowth?.className).toContain('text-green-600')

      // 부정적 성장률은 빨간색
      const negativeGrowth = screen.getByText('-2.1%').closest('span')
      expect(negativeGrowth?.className).toContain('text-red-600')
    })

    it('0% 성장률은 표시하지 않아야 한다', () => {
      const zeroGrowthServices: ServiceStats[] = [
        {
          ...mockServices[0],
          growth: 0,
        },
      ]

      render(<TopServicesCard services={zeroGrowthServices} />)

      expect(screen.queryByText('+0.0%')).toBeNull()
      expect(screen.queryByText('-0.0%')).toBeNull()
    })
  })

  describe('진행률 바', () => {
    it('각 서비스에 진행률 바가 있어야 한다', () => {
      const { container } = render(<TopServicesCard services={mockServices} />)

      // 진행률 바 컨테이너
      const progressBars = container.querySelectorAll('.h-2')
      expect(progressBars.length).toBe(mockServices.length)
    })

    it('1위 서비스는 그라데이션 배경을 가져야 한다', () => {
      const { container } = render(<TopServicesCard services={mockServices} />)

      const gradientBar = container.querySelector('.bg-gradient-to-r')
      expect(gradientBar).toBeDefined()
    })
  })

  describe('데이터 제한', () => {
    it('최대 10개 서비스만 표시해야 한다', () => {
      const manyServices: ServiceStats[] = Array.from({ length: 20 }, (_, i) => ({
        serviceId: String(i + 1),
        name: `서비스 ${i + 1}`,
        bookings: 100 - i,
        revenue: 1000000 - i * 10000,
        rating: 4.5,
        satisfactionRate: 90,
        rank: i + 1,
        growth: 5.0,
      }))

      render(<TopServicesCard services={manyServices} />)

      // 10개만 렌더링되어야 함
      expect(screen.getByText('서비스 1')).toBeDefined()
      expect(screen.getByText('서비스 10')).toBeDefined()
      expect(screen.queryByText('서비스 11')).toBeNull()
    })
  })

  describe('엣지 케이스', () => {
    it('빈 서비스 리스트를 처리해야 한다', () => {
      const { container } = render(<TopServicesCard services={[]} />)

      expect(screen.getByText('인기 서비스')).toBeDefined()
      // 빈 상태가 렌더링되어야 함
      const content = container.querySelector('.space-y-4')
      expect(content).toBeDefined()
    })

    it('0 값을 처리해야 한다', () => {
      const zeroServices: ServiceStats[] = [
        {
          serviceId: '1',
          name: '테스트 서비스',
          bookings: 0,
          revenue: 0,
          rating: 0,
          satisfactionRate: 0,
          rank: 1,
          growth: 0,
        },
      ]

      render(<TopServicesCard services={zeroServices} />)

      expect(screen.getByText('0 건')).toBeDefined()
      expect(screen.getByText('₩0')).toBeDefined()
      expect(screen.getByText('⭐ 0.0')).toBeDefined()
      expect(screen.getByText('만족도 0%')).toBeDefined()
    })

    it('긴 서비스 이름을 처리해야 한다', () => {
      const longNameService: ServiceStats[] = [
        {
          serviceId: '1',
          name: '이것은 매우 긴 서비스 이름으로 UI에서 잘리는지 확인하기 위한 테스트입니다',
          bookings: 100,
          revenue: 1000000,
          rating: 4.5,
          satisfactionRate: 90,
          rank: 1,
          growth: 5.0,
        },
      ]

      render(<TopServicesCard services={longNameService} />)

      // Service name rendered successfully
      expect(screen.getByText(/이것은 매우 긴 서비스 이름/)).toBeDefined()
    })
  })
})
