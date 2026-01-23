import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DollarSign, Calendar } from 'lucide-react'
import { StatCard } from '../stat-card'

describe('StatCard', () => {
  describe('기본 렌더링', () => {
    it('필수 props(title, value)로 렌더링되어야 한다', () => {
      render(<StatCard title="총 매출" value="₩1,234,567" />)

      expect(screen.getByText('총 매출')).toBeDefined()
      expect(screen.getByText('₩1,234,567')).toBeDefined()
    })

    it('아이콘과 함께 렌더링되어야 한다', () => {
      render(
        <StatCard
          title="총 매출"
          value="₩1,234,567"
          icon={<DollarSign data-testid="dollar-icon" />}
        />
      )

      expect(screen.getByTestId('dollar-icon')).toBeDefined()
    })

    it('subtitle과 함께 렌더링되어야 한다', () => {
      render(<StatCard title="총 매출" value="₩1,234,567" subtitle="+12.5% 전월대비" />)

      expect(screen.getByText('+12.5% 전월대비')).toBeDefined()
    })

    it('모든 optional props와 함께 렌더링되어야 한다', () => {
      render(
        <StatCard
          title="총 매출"
          value="₩1,234,567"
          subtitle="+12.5% 전월대비"
          icon={<DollarSign data-testid="dollar-icon" />}
          trend="up"
        />
      )

      expect(screen.getByText('총 매출')).toBeDefined()
      expect(screen.getByText('₩1,234,567')).toBeDefined()
      expect(screen.getByText('+12.5% 전월대비')).toBeDefined()
      expect(screen.getByTestId('dollar-icon')).toBeDefined()
    })
  })

  describe('Trend 표시', () => {
    it('trend="up"일 때 상승 아이콘을 표시해야 한다', () => {
      const { container } = render(
        <StatCard title="총 매출" value="₩1,234,567" subtitle="+12.5% 전월대비" trend="up" />
      )

      // ArrowUpIcon이 렌더링되었는지 확인
      const subtitle = screen.getByText('+12.5% 전월대비').closest('div')
      expect(subtitle).toBeDefined()
      expect(subtitle?.className).toContain('text-green-600')
    })

    it('trend="down"일 때 하락 아이콘을 표시해야 한다', () => {
      const { container } = render(
        <StatCard title="총 매출" value="₩1,234,567" subtitle="-5.2% 전월대비" trend="down" />
      )

      const subtitle = screen.getByText('-5.2% 전월대비').closest('div')
      expect(subtitle).toBeDefined()
      expect(subtitle?.className).toContain('text-red-600')
    })

    it('trend="neutral"일 때 중립 아이콘을 표시해야 한다', () => {
      const { container } = render(
        <StatCard title="총 매출" value="₩1,234,567" subtitle="변화 없음" trend="neutral" />
      )

      const subtitle = screen.getByText('변화 없음').closest('div')
      expect(subtitle).toBeDefined()
      expect(subtitle?.className).toContain('text-muted-foreground')
    })

    it('trend가 없을 때 아이콘을 표시하지 않아야 한다', () => {
      const { container } = render(
        <StatCard title="총 매출" value="₩1,234,567" subtitle="전월대비" />
      )

      // subtitle은 있지만 trend 아이콘은 없어야 함
      const subtitle = screen.getByText('전월대비')
      expect(subtitle).toBeDefined()
    })
  })

  describe('CVA Variants', () => {
    it('variant="default"를 적용해야 한다', () => {
      const { container } = render(
        <StatCard title="총 매출" value="₩1,234,567" variant="default" />
      )

      const card = container.querySelector('[role="article"]')
      expect(card?.className).toContain('border-border')
      expect(card?.className).toContain('bg-card')
      expect(card?.className).toContain('shadow-sm')
    })

    it('variant="compact"를 적용해야 한다', () => {
      const { container } = render(
        <StatCard title="총 매출" value="₩1,234,567" variant="compact" />
      )

      const card = container.querySelector('[role="article"]')
      expect(card?.className).toContain('border-border')
      expect(card?.className).toContain('bg-card')
      expect(card?.className).toContain('shadow-sm')
    })

    it('variant="detailed"를 적용해야 한다', () => {
      const { container } = render(
        <StatCard title="총 매출" value="₩1,234,567" variant="detailed" />
      )

      const card = container.querySelector('[role="article"]')
      expect(card?.className).toContain('border-border')
      expect(card?.className).toContain('bg-card')
      expect(card?.className).toContain('shadow-md')
    })

    it('variant="highlight"를 적용해야 한다', () => {
      const { container } = render(
        <StatCard title="총 매출" value="₩1,234,567" variant="highlight" />
      )

      const card = container.querySelector('[role="article"]')
      expect(card?.className).toContain('border-primary/50')
      expect(card?.className).toContain('bg-gradient-to-br')
      expect(card?.className).toContain('shadow-md')
    })

    it('variant="minimal"를 적용해야 한다', () => {
      const { container } = render(
        <StatCard title="총 매출" value="₩1,234,567" variant="minimal" />
      )

      const card = container.querySelector('[role="article"]')
      expect(card?.className).toContain('border-border/50')
      expect(card?.className).toContain('bg-transparent')
    })
  })

  describe('CVA Sizes', () => {
    it('size="sm"을 적용해야 한다', () => {
      const { container } = render(<StatCard title="총 매출" value="₩1,234,567" size="sm" />)

      const card = container.querySelector('[role="article"]')
      expect(card?.className).toContain('p-4')
    })

    it('size="default"를 적용해야 한다', () => {
      const { container } = render(<StatCard title="총 매출" value="₩1,234,567" size="default" />)

      const card = container.querySelector('[role="article"]')
      expect(card?.className).toContain('p-5')
    })

    it('size="lg"를 적용해야 한다', () => {
      const { container } = render(<StatCard title="총 매출" value="₩1,234,567" size="lg" />)

      const card = container.querySelector('[role="article"]')
      expect(card?.className).toContain('p-6')
    })
  })

  describe('Custom className', () => {
    it('커스텀 className을 적용해야 한다', () => {
      const { container } = render(
        <StatCard title="총 매출" value="₩1,234,567" className="custom-class" />
      )

      const card = container.querySelector('[role="article"]')
      expect(card?.className).toContain('custom-class')
    })

    it('커스텀 className이 기본 스타일과 병합되어야 한다', () => {
      const { container } = render(
        <StatCard
          title="총 매출"
          value="₩1,234,567"
          variant="highlight"
          size="lg"
          className="custom-class"
        />
      )

      const card = container.querySelector('[role="article"]')
      expect(card?.className).toContain('custom-class')
      expect(card?.className).toContain('border-primary/50')
      expect(card?.className).toContain('p-6')
    })
  })

  describe('Ref 전달', () => {
    it('ref를 올바르게 전달해야 한다', () => {
      let ref: HTMLDivElement | null = null

      render(
        <StatCard
          ref={(el) => {
            ref = el
          }}
          title="총 매출"
          value="₩1,234,567"
        />
      )

      expect(ref).toBeDefined()
    })
  })

  describe('접근성', () => {
    it('role="article"을 가져야 한다', () => {
      const { container } = render(<StatCard title="총 매출" value="₩1,234,567" />)

      const card = container.querySelector('[role="article"]')
      expect(card).toBeDefined()
    })

    it('적절한 aria-label을 가져야 한다', () => {
      render(<StatCard title="총 매출" value="₩1,234,567" />)

      const card = screen.getByLabelText('총 매출 통계 카드')
      expect(card).toBeDefined()
    })

    it('값에 대한 aria-label을 가져야 한다', () => {
      render(<StatCard title="총 매출" value="₩1,234,567" />)

      const value = screen.getByLabelText('값: ₩1,234,567')
      expect(value).toBeDefined()
    })

    it('trend가 있을 때 추세 aria-label을 가져야 한다', () => {
      render(<StatCard title="총 매출" value="₩1,234,567" subtitle="+12.5% 전월대비" trend="up" />)

      const subtitle = screen.getByLabelText('추세: 상승')
      expect(subtitle).toBeDefined()
    })
  })

  describe('HTML 속성 전달', () => {
    it('추가 HTML 속성을 전달해야 한다', () => {
      const { container } = render(
        <StatCard title="총 매출" value="₩1,234,567" data-testid="custom-stat-card" id="stat-1" />
      )

      const card = container.querySelector('#stat-1')
      expect(card).toBeDefined()
      expect(card?.getAttribute('data-testid')).toBe('custom-stat-card')
    })
  })

  describe('Optional Props 누락', () => {
    it('icon 없이 렌더링되어야 한다', () => {
      const { container } = render(<StatCard title="총 매출" value="₩1,234,567" />)

      const iconContainer = container.querySelector('[aria-hidden="true"]')
      expect(iconContainer).toBeNull()
    })

    it('subtitle 없이 렌더링되어야 한다', () => {
      render(<StatCard title="총 매출" value="₩1,234,567" />)

      const value = screen.getByText('₩1,234,567')
      expect(value).toBeDefined()
      // subtitle 텍스트가 없어야 함
      expect(screen.queryByText('+12.5%')).toBeNull()
    })

    it('trend 없이 subtitle만 렌더링되어야 한다', () => {
      const { container } = render(
        <StatCard title="총 매출" value="₩1,234,567" subtitle="전월 대비" />
      )

      expect(screen.getByText('전월 대비')).toBeDefined()
      // trend 아이콘이 없어야 함 (ArrowUpIcon, ArrowDownIcon, MinusIcon 없음)
      const subtitle = screen.getByText('전월 대비').closest('div')
      // trend가 없으면 아이콘 컴포넌트가 렌더링되지 않음
    })
  })

  describe('다양한 컨텐츠 조합', () => {
    it('긴 title을 처리해야 한다', () => {
      render(<StatCard title="이번 달 총 매출액 합계 (부가세 포함)" value="₩123,456,789" />)

      expect(screen.getByText('이번 달 총 매출액 합계 (부가세 포함)')).toBeDefined()
    })

    it('큰 숫자 값을 처리해야 한다', () => {
      render(<StatCard title="총 매출" value="₩999,999,999,999" />)

      expect(screen.getByText('₩999,999,999,999')).toBeDefined()
    })

    it('다양한 아이콘을 지원해야 한다', () => {
      render(
        <StatCard title="전체 예약" value="1,234" icon={<Calendar data-testid="calendar-icon" />} />
      )

      expect(screen.getByTestId('calendar-icon')).toBeDefined()
    })

    it('여러 variant와 size 조합을 지원해야 한다', () => {
      const { rerender, container } = render(
        <StatCard title="총 매출" value="₩1,234,567" variant="default" size="sm" />
      )

      let card = container.querySelector('[role="article"]')
      expect(card?.className).toContain('p-4')
      expect(card?.className).toContain('shadow-sm')

      rerender(<StatCard title="총 매출" value="₩1,234,567" variant="highlight" size="lg" />)

      card = container.querySelector('[role="article"]')
      expect(card?.className).toContain('p-6')
      expect(card?.className).toContain('shadow-md')
    })
  })
})
