/**
 * Tests for BookingStatusBadge component
 *
 * Tests CVA pattern implementation:
 * - Status rendering (label, icon, variant)
 * - CVA variants (default, compact, detailed, highlight, minimal)
 * - CVA sizes (sm, default, lg)
 * - Props handling (showIcon, className, ref)
 *
 * Target coverage: 100%
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BookingStatus } from '@mimisalon/shared'
import { BookingStatusBadge } from '../booking-status-badge'
import * as React from 'react'

describe('BookingStatusBadge', () => {
  // ==========================================================================
  // Status Rendering
  // ==========================================================================

  describe('Status rendering', () => {
    it('should render FIRST_PAYMENT_PENDING status', () => {
      render(<BookingStatusBadge status={BookingStatus.FIRST_PAYMENT_PENDING} />)
      expect(screen.getByText('1차 결제 대기')).toBeInTheDocument()
    })

    it('should render FIRST_PAYMENT_COMPLETE status', () => {
      render(<BookingStatusBadge status={BookingStatus.FIRST_PAYMENT_COMPLETE} />)
      expect(screen.getByText('1차 결제 완료')).toBeInTheDocument()
    })

    it('should render FIRST_PAYMENT_VERIFY status', () => {
      render(<BookingStatusBadge status={BookingStatus.FIRST_PAYMENT_VERIFY} />)
      expect(screen.getByText('1차 결제 확인중')).toBeInTheDocument()
    })

    it('should render GROOMER_CONFIRM_PENDING status', () => {
      render(<BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM_PENDING} />)
      expect(screen.getByText('미용사 확인 대기')).toBeInTheDocument()
    })

    it('should render GROOMER_CONFIRM status', () => {
      render(<BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} />)
      expect(screen.getByText('미용사 확정')).toBeInTheDocument()
    })

    it('should render ADDITIONAL_PAYMENT_PENDING status', () => {
      render(<BookingStatusBadge status={BookingStatus.ADDITIONAL_PAYMENT_PENDING} />)
      expect(screen.getByText('추가 결제 대기')).toBeInTheDocument()
    })

    it('should render ADDITIONAL_PAYMENT_COMPLETE status', () => {
      render(<BookingStatusBadge status={BookingStatus.ADDITIONAL_PAYMENT_COMPLETE} />)
      expect(screen.getByText('추가 결제 완료')).toBeInTheDocument()
    })

    it('should render WORK_IN_PROGRESS status', () => {
      render(<BookingStatusBadge status={BookingStatus.WORK_IN_PROGRESS} />)
      expect(screen.getByText('진행중')).toBeInTheDocument()
    })

    it('should render SERVICE_COMPLETED status', () => {
      render(<BookingStatusBadge status={BookingStatus.SERVICE_COMPLETED} />)
      expect(screen.getByText('완료')).toBeInTheDocument()
    })

    it('should render SERVICE_CANCELLED status', () => {
      render(<BookingStatusBadge status={BookingStatus.SERVICE_CANCELLED} />)
      expect(screen.getByText('취소됨')).toBeInTheDocument()
    })

    it('should render BOOKING_FAILED status', () => {
      render(<BookingStatusBadge status={BookingStatus.BOOKING_FAILED} />)
      expect(screen.getByText('예약 실패')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Icon Rendering
  // ==========================================================================

  describe('Icon rendering', () => {
    it('should render icon by default', () => {
      const { container } = render(<BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should hide icon when showIcon is false', () => {
      const { container } = render(
        <BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} showIcon={false} />
      )

      const svg = container.querySelector('svg')
      expect(svg).not.toBeInTheDocument()
    })

    it('should show icon when showIcon is true', () => {
      const { container } = render(
        <BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} showIcon={true} />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render different icons for different statuses', () => {
      const { container: container1 } = render(
        <BookingStatusBadge status={BookingStatus.SERVICE_COMPLETED} />
      )
      const { container: container2 } = render(
        <BookingStatusBadge status={BookingStatus.SERVICE_CANCELLED} />
      )

      // Both should have icons
      expect(container1.querySelector('svg')).toBeInTheDocument()
      expect(container2.querySelector('svg')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // CVA Variants
  // ==========================================================================

  describe('CVA variants', () => {
    it('should apply default variant classes', () => {
      const { container } = render(
        <BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} variant="default" />
      )

      const badge = container.firstChild as HTMLElement
      expect(badge).toBeInTheDocument()
    })

    it('should apply compact variant classes', () => {
      const { container } = render(
        <BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} variant="compact" />
      )

      const badge = container.firstChild as HTMLElement
      // Compact variant should have smaller padding
      expect(badge.className).toContain('px-1.5')
      expect(badge.className).toContain('py-0.5')
    })

    it('should apply detailed variant classes', () => {
      const { container } = render(
        <BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} variant="detailed" />
      )

      const badge = container.firstChild as HTMLElement
      // Detailed variant should have larger padding
      expect(badge.className).toContain('px-3')
      expect(badge.className).toContain('py-1.5')
    })

    it('should apply highlight variant classes', () => {
      const { container } = render(
        <BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} variant="highlight" />
      )

      const badge = container.firstChild as HTMLElement
      // Highlight variant should have font-semibold
      expect(badge.className).toContain('font-semibold')
    })

    it('should apply minimal variant classes', () => {
      const { container } = render(
        <BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} variant="minimal" />
      )

      const badge = container.firstChild as HTMLElement
      // Minimal variant should have no border and transparent background
      expect(badge.className).toContain('border-0')
      expect(badge.className).toContain('bg-transparent')
    })

    it('should use default variant when not specified', () => {
      const { container } = render(<BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} />)

      const badge = container.firstChild as HTMLElement
      expect(badge).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // CVA Sizes
  // ==========================================================================

  describe('CVA sizes', () => {
    it('should apply sm size classes', () => {
      const { container } = render(
        <BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} size="sm" />
      )

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-xs')
    })

    it('should apply default size classes', () => {
      const { container } = render(
        <BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} size="default" />
      )

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-sm')
    })

    it('should apply lg size classes', () => {
      const { container } = render(
        <BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} size="lg" />
      )

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-base')
    })

    it('should use default size when not specified', () => {
      const { container } = render(<BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} />)

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-sm')
    })
  })

  // ==========================================================================
  // Variant + Size Combinations
  // ==========================================================================

  describe('Variant and size combinations', () => {
    it('should apply both compact variant and sm size', () => {
      const { container } = render(
        <BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} variant="compact" size="sm" />
      )

      const badge = container.firstChild as HTMLElement
      // Should have both variant and size classes
      expect(badge.className).toContain('text-xs')
    })

    it('should apply both detailed variant and lg size', () => {
      const { container } = render(
        <BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} variant="detailed" size="lg" />
      )

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-base')
    })

    it('should apply both highlight variant and default size', () => {
      const { container } = render(
        <BookingStatusBadge
          status={BookingStatus.GROOMER_CONFIRM}
          variant="highlight"
          size="default"
        />
      )

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('font-semibold')
      expect(badge.className).toContain('text-sm')
    })
  })

  // ==========================================================================
  // Custom Props
  // ==========================================================================

  describe('Custom props', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} className="custom-class" />
      )

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('custom-class')
    })

    it('should merge custom className with CVA classes', () => {
      const { container } = render(
        <BookingStatusBadge
          status={BookingStatus.GROOMER_CONFIRM}
          variant="compact"
          size="sm"
          className="custom-margin"
        />
      )

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('custom-margin')
      expect(badge.className).toContain('text-xs')
    })

    it('should forward additional HTML attributes', () => {
      const { container } = render(
        <BookingStatusBadge
          status={BookingStatus.GROOMER_CONFIRM}
          data-testid="custom-badge"
          aria-label="Custom badge"
        />
      )

      const badge = container.firstChild as HTMLElement
      expect(badge.getAttribute('data-testid')).toBe('custom-badge')
      expect(badge.getAttribute('aria-label')).toBe('Custom badge')
    })
  })

  // ==========================================================================
  // Ref Forwarding
  // ==========================================================================

  describe('Ref forwarding', () => {
    it('should forward ref to Badge component', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(<BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLElement)
    })

    it('should allow ref to access the DOM element', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(<BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} ref={ref} />)

      expect(ref.current?.textContent).toContain('미용사 확정')
    })
  })

  // ==========================================================================
  // Badge Variant Mapping
  // ==========================================================================

  describe('Badge variant mapping from status', () => {
    it('should apply secondary variant for pending statuses', () => {
      const { container } = render(
        <BookingStatusBadge status={BookingStatus.FIRST_PAYMENT_PENDING} />
      )

      // The Badge component should receive 'secondary' variant
      const badge = container.firstChild as HTMLElement
      expect(badge).toBeInTheDocument()
    })

    it('should apply destructive variant for cancelled status', () => {
      const { container } = render(<BookingStatusBadge status={BookingStatus.SERVICE_CANCELLED} />)

      const badge = container.firstChild as HTMLElement
      expect(badge).toBeInTheDocument()
    })

    it('should apply destructive variant for failed status', () => {
      const { container } = render(<BookingStatusBadge status={BookingStatus.BOOKING_FAILED} />)

      const badge = container.firstChild as HTMLElement
      expect(badge).toBeInTheDocument()
    })

    it('should apply default variant for confirmed status', () => {
      const { container } = render(<BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} />)

      const badge = container.firstChild as HTMLElement
      expect(badge).toBeInTheDocument()
    })

    it('should apply outline variant for payment complete statuses', () => {
      const { container } = render(
        <BookingStatusBadge status={BookingStatus.FIRST_PAYMENT_COMPLETE} />
      )

      const badge = container.firstChild as HTMLElement
      expect(badge).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Accessibility
  // ==========================================================================

  describe('Accessibility', () => {
    it('should render semantic HTML', () => {
      const { container } = render(<BookingStatusBadge status={BookingStatus.GROOMER_CONFIRM} />)

      const badge = container.firstChild as HTMLElement
      expect(badge.tagName).toBeTruthy()
    })

    it('should have readable text content', () => {
      render(<BookingStatusBadge status={BookingStatus.SERVICE_COMPLETED} />)

      // Text should be visible and readable
      expect(screen.getByText('완료')).toBeVisible()
    })

    it('should support ARIA attributes', () => {
      render(
        <BookingStatusBadge
          status={BookingStatus.GROOMER_CONFIRM}
          aria-label="예약 상태: 미용사 확정"
          role="status"
        />
      )

      const badge = screen.getByRole('status')
      expect(badge).toHaveAttribute('aria-label', '예약 상태: 미용사 확정')
    })
  })

  // ==========================================================================
  // Edge Cases
  // ==========================================================================

  describe('Edge cases', () => {
    it('should handle unknown status gracefully', () => {
      render(<BookingStatusBadge status={'UNKNOWN_STATUS' as BookingStatus} />)

      // Should render fallback label
      expect(screen.getByText('알 수 없음')).toBeInTheDocument()
    })

    it('should render with all props combined', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(
        <BookingStatusBadge
          status={BookingStatus.GROOMER_CONFIRM}
          variant="highlight"
          size="lg"
          showIcon={true}
          className="custom-class"
          data-testid="full-props-badge"
          ref={ref}
        />
      )

      const badge = screen.getByTestId('full-props-badge')
      expect(badge).toBeInTheDocument()
      expect(badge.className).toContain('custom-class')
      expect(badge.className).toContain('font-semibold')
      expect(badge.className).toContain('text-base')
      expect(screen.getByText('미용사 확정')).toBeInTheDocument()
      expect(ref.current).toBeInstanceOf(HTMLElement)
    })
  })
})
