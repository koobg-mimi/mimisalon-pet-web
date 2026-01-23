import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PaymentStatusBadge } from '../payment-status-badge'
import { PAYMENT_STATUS_CONFIG } from '../../../utils/payment-status-config'
import type { AdminPaymentInfo } from '../../../types/payment.types'

describe('PaymentStatusBadge', () => {
  describe('rendering', () => {
    it('should render PAID status correctly', () => {
      render(<PaymentStatusBadge status="PAID" />)
      expect(screen.getByText('결제완료')).toBeInTheDocument()
    })

    it('should render PENDING status correctly', () => {
      render(<PaymentStatusBadge status="PENDING" />)
      expect(screen.getByText('대기중')).toBeInTheDocument()
    })

    it('should render FAILED status correctly', () => {
      render(<PaymentStatusBadge status="FAILED" />)
      expect(screen.getByText('실패')).toBeInTheDocument()
    })

    it('should render CANCELLED status correctly', () => {
      render(<PaymentStatusBadge status="CANCELLED" />)
      expect(screen.getByText('취소됨')).toBeInTheDocument()
    })

    it('should render REFUNDED status correctly', () => {
      render(<PaymentStatusBadge status="REFUNDED" />)
      expect(screen.getByText('환불완료')).toBeInTheDocument()
    })

    it('should render PARTIALLY_REFUNDED status correctly', () => {
      render(<PaymentStatusBadge status="PARTIALLY_REFUNDED" />)
      expect(screen.getByText('부분환불')).toBeInTheDocument()
    })

    it('should render AUTHORIZED status correctly', () => {
      render(<PaymentStatusBadge status="AUTHORIZED" />)
      expect(screen.getByText('승인됨')).toBeInTheDocument()
    })

    it('should render CAPTURED status correctly', () => {
      render(<PaymentStatusBadge status="CAPTURED" />)
      expect(screen.getByText('확정됨')).toBeInTheDocument()
    })

    it('should render COMPLETED status correctly', () => {
      render(<PaymentStatusBadge status="COMPLETED" />)
      expect(screen.getByText('완료')).toBeInTheDocument()
    })

    it('should render PARTIAL_CANCELLED status correctly', () => {
      render(<PaymentStatusBadge status="PARTIAL_CANCELLED" />)
      expect(screen.getByText('부분취소')).toBeInTheDocument()
    })

    it('should render EXPIRED status correctly', () => {
      render(<PaymentStatusBadge status="EXPIRED" />)
      expect(screen.getByText('만료')).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should apply correct color classes for PAID status', () => {
      const { container } = render(<PaymentStatusBadge status="PAID" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-green-700')
      expect(badge.className).toContain('bg-green-100')
    })

    it('should apply correct color classes for PENDING status', () => {
      const { container } = render(<PaymentStatusBadge status="PENDING" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-yellow-700')
      expect(badge.className).toContain('bg-yellow-100')
    })

    it('should apply correct color classes for FAILED status', () => {
      const { container } = render(<PaymentStatusBadge status="FAILED" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-red-700')
      expect(badge.className).toContain('bg-red-100')
    })

    it('should apply correct color classes for CANCELLED status', () => {
      const { container } = render(<PaymentStatusBadge status="CANCELLED" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-gray-700')
      expect(badge.className).toContain('bg-gray-100')
    })

    it('should apply correct color classes for REFUNDED status', () => {
      const { container } = render(<PaymentStatusBadge status="REFUNDED" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-purple-700')
      expect(badge.className).toContain('bg-purple-100')
    })

    it('should apply correct color classes for PARTIALLY_REFUNDED status', () => {
      const { container } = render(<PaymentStatusBadge status="PARTIALLY_REFUNDED" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-orange-700')
      expect(badge.className).toContain('bg-orange-100')
    })

    it('should apply correct color classes for AUTHORIZED status', () => {
      const { container } = render(<PaymentStatusBadge status="AUTHORIZED" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-blue-700')
      expect(badge.className).toContain('bg-blue-100')
    })

    it('should apply correct color classes for CAPTURED status', () => {
      const { container } = render(<PaymentStatusBadge status="CAPTURED" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-indigo-700')
      expect(badge.className).toContain('bg-indigo-100')
    })

    it('should apply correct color classes for COMPLETED status', () => {
      const { container } = render(<PaymentStatusBadge status="COMPLETED" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-emerald-700')
      expect(badge.className).toContain('bg-emerald-100')
    })

    it('should apply correct color classes for PARTIAL_CANCELLED status', () => {
      const { container } = render(<PaymentStatusBadge status="PARTIAL_CANCELLED" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-amber-700')
      expect(badge.className).toContain('bg-amber-100')
    })

    it('should apply correct color classes for EXPIRED status', () => {
      const { container } = render(<PaymentStatusBadge status="EXPIRED" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-slate-700')
      expect(badge.className).toContain('bg-slate-100')
    })

    it('should apply base classes', () => {
      const { container } = render(<PaymentStatusBadge status="PAID" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('inline-flex')
      expect(badge.className).toContain('items-center')
      expect(badge.className).toContain('rounded-full')
      expect(badge.className).toContain('px-2')
      expect(badge.className).toContain('py-1')
      expect(badge.className).toContain('text-xs')
      expect(badge.className).toContain('font-medium')
    })

    it('should accept and merge custom className', () => {
      const { container } = render(<PaymentStatusBadge status="PAID" className="custom-class" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('custom-class')
      expect(badge.className).toContain('bg-green-100')
    })

    it('should preserve base classes when custom className is provided', () => {
      const { container } = render(<PaymentStatusBadge status="PAID" className="text-lg" />)
      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-lg')
      expect(badge.className).toContain('inline-flex')
      expect(badge.className).toContain('rounded-full')
    })
  })

  describe('tooltip/title', () => {
    it('should show correct description for PAID status', () => {
      render(<PaymentStatusBadge status="PAID" />)
      const badge = screen.getByText('결제완료')
      expect(badge).toHaveAttribute('title', '결제가 정상적으로 완료되었습니다')
    })

    it('should show correct description for PENDING status', () => {
      render(<PaymentStatusBadge status="PENDING" />)
      const badge = screen.getByText('대기중')
      expect(badge).toHaveAttribute('title', '결제 처리 대기 중입니다')
    })

    it('should show correct description for FAILED status', () => {
      render(<PaymentStatusBadge status="FAILED" />)
      const badge = screen.getByText('실패')
      expect(badge).toHaveAttribute('title', '결제가 실패했습니다')
    })

    it('should show correct description for CANCELLED status', () => {
      render(<PaymentStatusBadge status="CANCELLED" />)
      const badge = screen.getByText('취소됨')
      expect(badge).toHaveAttribute('title', '결제가 취소되었습니다')
    })

    it('should show correct description for REFUNDED status', () => {
      render(<PaymentStatusBadge status="REFUNDED" />)
      const badge = screen.getByText('환불완료')
      expect(badge).toHaveAttribute('title', '전액 환불 처리되었습니다')
    })

    it('should show correct description for PARTIALLY_REFUNDED status', () => {
      render(<PaymentStatusBadge status="PARTIALLY_REFUNDED" />)
      const badge = screen.getByText('부분환불')
      expect(badge).toHaveAttribute('title', '부분 환불 처리되었습니다')
    })

    it('should show correct description for AUTHORIZED status', () => {
      render(<PaymentStatusBadge status="AUTHORIZED" />)
      const badge = screen.getByText('승인됨')
      expect(badge).toHaveAttribute('title', '결제 승인되었습니다')
    })

    it('should show correct description for CAPTURED status', () => {
      render(<PaymentStatusBadge status="CAPTURED" />)
      const badge = screen.getByText('확정됨')
      expect(badge).toHaveAttribute('title', '결제 확정되었습니다')
    })

    it('should show correct description for COMPLETED status', () => {
      render(<PaymentStatusBadge status="COMPLETED" />)
      const badge = screen.getByText('완료')
      expect(badge).toHaveAttribute('title', '결제가 완료되었습니다')
    })

    it('should show correct description for PARTIAL_CANCELLED status', () => {
      render(<PaymentStatusBadge status="PARTIAL_CANCELLED" />)
      const badge = screen.getByText('부분취소')
      expect(badge).toHaveAttribute('title', '부분 취소되었습니다')
    })

    it('should show correct description for EXPIRED status', () => {
      render(<PaymentStatusBadge status="EXPIRED" />)
      const badge = screen.getByText('만료')
      expect(badge).toHaveAttribute('title', '결제 유효기간이 만료되었습니다')
    })
  })

  describe('accessibility', () => {
    it('should render as a span element', () => {
      const { container } = render(<PaymentStatusBadge status="PAID" />)
      expect(container.firstChild?.nodeName).toBe('SPAN')
    })

    it('should have accessible text content', () => {
      render(<PaymentStatusBadge status="PAID" />)
      const badge = screen.getByText('결제완료')
      expect(badge).toBeVisible()
    })
  })

  describe('configuration consistency', () => {
    it('should use configuration from PAYMENT_STATUS_CONFIG', () => {
      const status: AdminPaymentInfo['status'] = 'PAID'
      const config = PAYMENT_STATUS_CONFIG[status]

      render(<PaymentStatusBadge status={status} />)
      const badge = screen.getByText(config.label)

      expect(badge).toBeInTheDocument()
      expect(badge).toHaveAttribute('title', config.description)
      expect(badge.className).toContain(config.color.replace('text-', ''))
      expect(badge.className).toContain(config.bgColor.replace('bg-', ''))
    })

    it('should work with all statuses defined in PAYMENT_STATUS_CONFIG', () => {
      const statuses = Object.keys(PAYMENT_STATUS_CONFIG) as AdminPaymentInfo['status'][]

      statuses.forEach((status) => {
        const config = PAYMENT_STATUS_CONFIG[status]
        const { container } = render(<PaymentStatusBadge status={status} />)
        const badge = container.firstChild as HTMLElement

        expect(badge.textContent).toBe(config.label)
        expect(badge.title).toBe(config.description)
      })
    })
  })
})
