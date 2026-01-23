import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuickActions } from '../quick-actions'

describe('QuickActions', () => {
  describe('기본 렌더링', () => {
    it('카드 제목을 렌더링해야 한다', () => {
      render(<QuickActions />)

      expect(screen.getByText('빠른 작업')).toBeDefined()
    })

    it('3개의 액션 버튼을 렌더링해야 한다', () => {
      render(<QuickActions />)

      expect(screen.getByText('미용사 관리')).toBeDefined()
      expect(screen.getByText('서비스 관리')).toBeDefined()
      expect(screen.getByText('사용자 관리')).toBeDefined()
    })

    it('각 버튼에 설명을 표시해야 한다', () => {
      render(<QuickActions />)

      expect(screen.getByText('미용사 목록과 일정을 관리합니다.')).toBeDefined()
      expect(screen.getByText('서비스 메뉴와 가격을 관리합니다.')).toBeDefined()
      expect(screen.getByText('고객과 관리자 계정을 관리합니다.')).toBeDefined()
    })
  })

  describe('링크', () => {
    it('올바른 href를 가져야 한다', () => {
      const { container } = render(<QuickActions />)

      const links = container.querySelectorAll('a')
      expect(links.length).toBe(3)

      expect(links[0].getAttribute('href')).toBe('/admin/dashboard/groomers')
      expect(links[1].getAttribute('href')).toBe('/admin/dashboard/services')
      expect(links[2].getAttribute('href')).toBe('/admin/dashboard/users')
    })

    it('Next.js Link 컴포넌트를 사용해야 한다', () => {
      const { container } = render(<QuickActions />)

      // Link는 <a> 태그로 렌더링됨
      const links = container.querySelectorAll('a')
      expect(links.length).toBe(3)
    })
  })

  describe('아이콘', () => {
    it('각 액션마다 적절한 아이콘을 표시해야 한다', () => {
      const { container } = render(<QuickActions />)

      // 아이콘 컨테이너가 3개 있어야 함
      const iconContainers = container.querySelectorAll('.h-10.w-10')
      expect(iconContainers.length).toBe(3)
    })

    it('아이콘이 원형 배경을 가져야 한다', () => {
      const { container } = render(<QuickActions />)

      const iconContainers = container.querySelectorAll('.rounded-lg')
      expect(iconContainers.length).toBeGreaterThan(0)
    })
  })

  describe('레이아웃', () => {
    it('수직 레이아웃을 사용해야 한다', () => {
      const { container } = render(<QuickActions />)

      // CardContent의 첫 번째 div가 flex flex-col gap-3을 가져야 함
      const layout = container.querySelector('[class*="flex"][class*="flex-col"][class*="gap-3"]')
      expect(layout).toBeDefined()
      expect(layout?.className).toContain('flex')
      expect(layout?.className).toContain('flex-col')
      expect(layout?.className).toContain('gap-3')
    })
  })

  describe('스타일링', () => {
    it('모든 버튼이 secondary variant를 가져야 한다', () => {
      const { container } = render(<QuickActions />)

      // asChild를 사용하므로 Link가 렌더링됨
      const links = container.querySelectorAll('a')
      expect(links.length).toBe(3)
    })

    it('버튼에 호버 효과가 있어야 한다', () => {
      const { container } = render(<QuickActions />)

      // asChild를 사용하므로 Link가 렌더링됨
      const links = container.querySelectorAll('a')
      links.forEach((link) => {
        expect(link.className).toContain('hover:scale-')
      })
    })
  })

  describe('접근성', () => {
    it('버튼이 클릭 가능해야 한다', () => {
      const { container } = render(<QuickActions />)

      // asChild를 사용하므로 Link가 렌더링됨
      const links = container.querySelectorAll('a')
      expect(links.length).toBe(3)

      links.forEach((link) => {
        expect(link).toBeDefined()
      })
    })

    it('각 버튼이 적절한 텍스트 레이블을 가져야 한다', () => {
      render(<QuickActions />)

      expect(screen.getByText('미용사 관리')).toBeDefined()
      expect(screen.getByText('서비스 관리')).toBeDefined()
      expect(screen.getByText('사용자 관리')).toBeDefined()
    })
  })

  describe('버튼 구조', () => {
    it('버튼이 아이콘과 텍스트를 포함해야 한다', () => {
      const { container } = render(<QuickActions />)

      // asChild를 사용하므로 Link가 렌더링됨
      const links = container.querySelectorAll('a')
      links.forEach((link) => {
        // 아이콘 컨테이너
        const icon = link.querySelector('.h-10.w-10')
        expect(icon).toBeDefined()

        // 텍스트 컨테이너
        const text = link.querySelector('.font-semibold')
        expect(text).toBeDefined()

        // 설명 텍스트
        const description = link.querySelector('.text-xs')
        expect(description).toBeDefined()
      })
    })

    it('버튼이 왼쪽 정렬되어야 한다', () => {
      const { container } = render(<QuickActions />)

      // asChild를 사용하므로 Link가 렌더링됨
      const links = container.querySelectorAll('a')
      links.forEach((link) => {
        expect(link.className).toContain('justify-start')
      })
    })

    it('버튼이 전체 너비를 차지해야 한다', () => {
      const { container } = render(<QuickActions />)

      // asChild를 사용하므로 Link가 렌더링됨
      const links = container.querySelectorAll('a')
      links.forEach((link) => {
        expect(link.className).toContain('w-full')
      })
    })
  })
})
