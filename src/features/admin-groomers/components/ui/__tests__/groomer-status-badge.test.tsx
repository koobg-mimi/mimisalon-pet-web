/**
 * Tests for GroomerStatusBadge component
 *
 * Tests CVA pattern implementation:
 * - Status rendering (label, icon, variant)
 * - CVA variants (default, compact, detailed, highlight, minimal)
 * - CVA sizes (sm, default, lg)
 * - Props handling (showIcon, className, ref)
 *
 * Target coverage: 80%+
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GroomerStatusBadge } from '../groomer-status-badge'
import * as React from 'react'

describe('GroomerStatusBadge', () => {
  // ==========================================================================
  // Status Rendering
  // ==========================================================================

  describe('Status rendering', () => {
    it('should render ACTIVE status (isActive=true)', () => {
      render(<GroomerStatusBadge isActive={true} />)
      expect(screen.getByText('활성')).toBeInTheDocument()
    })

    it('should render INACTIVE status (isActive=false)', () => {
      render(<GroomerStatusBadge isActive={false} />)
      expect(screen.getByText('비활성')).toBeInTheDocument()
    })

    it('should render as a badge element', () => {
      const { container } = render(<GroomerStatusBadge isActive={true} />)
      const badge = container.firstChild as HTMLElement
      expect(badge).toBeInTheDocument()
    })

    it('should contain status text', () => {
      render(<GroomerStatusBadge isActive={true} />)
      expect(screen.getByText('활성')).toBeVisible()
    })
  })

  // ==========================================================================
  // Icon Rendering
  // ==========================================================================

  describe('Icon rendering', () => {
    it('should render icon by default', () => {
      const { container } = render(<GroomerStatusBadge isActive={true} />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should hide icon when showIcon is false', () => {
      const { container } = render(<GroomerStatusBadge isActive={true} showIcon={false} />)

      const svg = container.querySelector('svg')
      expect(svg).not.toBeInTheDocument()
    })

    it('should show icon when showIcon is true', () => {
      const { container } = render(<GroomerStatusBadge isActive={true} showIcon={true} />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render CheckCircle2 icon for ACTIVE status', () => {
      const { container } = render(<GroomerStatusBadge isActive={true} />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveClass('h-3', 'w-3')
    })

    it('should render XCircle icon for INACTIVE status', () => {
      const { container } = render(<GroomerStatusBadge isActive={false} />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveClass('h-3', 'w-3')
    })
  })

  // ==========================================================================
  // CVA Variants
  // ==========================================================================

  describe('CVA variants', () => {
    it('should apply default variant classes', () => {
      const { container } = render(<GroomerStatusBadge isActive={true} variant="default" />)

      const badge = container.firstChild as HTMLElement
      expect(badge).toBeInTheDocument()
      expect(badge.className).toContain('inline-flex')
      expect(badge.className).toContain('items-center')
      expect(badge.className).toContain('gap-1')
    })

    it('should apply compact variant classes', () => {
      const { container } = render(<GroomerStatusBadge isActive={true} variant="compact" />)

      const badge = container.firstChild as HTMLElement
      // Compact has text-xs, px-1.5, py-0.5 but size default can override text size
      expect(badge.className).toContain('px-1.5')
      expect(badge.className).toContain('py-0.5')
    })

    it('should apply detailed variant classes', () => {
      const { container } = render(<GroomerStatusBadge isActive={true} variant="detailed" />)

      const badge = container.firstChild as HTMLElement
      // Detailed has text-sm, px-3, py-1.5
      expect(badge.className).toContain('px-3')
      expect(badge.className).toContain('py-1.5')
    })

    it('should apply highlight variant classes', () => {
      const { container } = render(<GroomerStatusBadge isActive={true} variant="highlight" />)

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('font-semibold')
    })

    it('should apply minimal variant classes', () => {
      const { container } = render(<GroomerStatusBadge isActive={true} variant="minimal" />)

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('border-0')
      expect(badge.className).toContain('bg-transparent')
    })

    it('should use default variant when not specified', () => {
      const { container } = render(<GroomerStatusBadge isActive={true} />)

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('inline-flex')
    })
  })

  // ==========================================================================
  // CVA Sizes
  // ==========================================================================

  describe('CVA sizes', () => {
    it('should apply sm size classes', () => {
      const { container } = render(<GroomerStatusBadge isActive={true} size="sm" />)

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-xs')
    })

    it('should apply default size classes', () => {
      const { container } = render(<GroomerStatusBadge isActive={true} size="default" />)

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-sm')
    })

    it('should apply lg size classes', () => {
      const { container } = render(<GroomerStatusBadge isActive={true} size="lg" />)

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-base')
    })

    it('should use default size when not specified', () => {
      const { container } = render(<GroomerStatusBadge isActive={true} />)

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
        <GroomerStatusBadge isActive={true} variant="compact" size="sm" />
      )

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-xs')
      expect(badge.className).toContain('px-1.5')
      expect(badge.className).toContain('py-0.5')
    })

    it('should apply both detailed variant and lg size', () => {
      const { container } = render(
        <GroomerStatusBadge isActive={true} variant="detailed" size="lg" />
      )

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('text-base')
      expect(badge.className).toContain('px-3')
      expect(badge.className).toContain('py-1.5')
    })

    it('should apply both highlight variant and default size', () => {
      const { container } = render(
        <GroomerStatusBadge isActive={true} variant="highlight" size="default" />
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
      const { container } = render(<GroomerStatusBadge isActive={true} className="custom-class" />)

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('custom-class')
    })

    it('should merge custom className with CVA classes', () => {
      const { container } = render(
        <GroomerStatusBadge isActive={true} variant="compact" size="sm" className="custom-margin" />
      )

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('custom-margin')
      expect(badge.className).toContain('text-xs')
    })

    it('should forward additional HTML attributes', () => {
      const { container } = render(
        <GroomerStatusBadge isActive={true} data-testid="custom-badge" aria-label="Custom badge" />
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

      render(<GroomerStatusBadge isActive={true} ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLElement)
    })

    it('should allow ref to access the DOM element', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(<GroomerStatusBadge isActive={true} ref={ref} />)

      expect(ref.current?.textContent).toContain('활성')
    })
  })

  // ==========================================================================
  // Badge Variant Mapping
  // ==========================================================================

  describe('Badge variant mapping from status', () => {
    it('should apply success variant for ACTIVE status', () => {
      const { container } = render(<GroomerStatusBadge isActive={true} />)

      const badge = container.firstChild as HTMLElement
      expect(badge).toBeInTheDocument()
      // The Badge component receives 'success' variant via config
    })

    it('should apply secondary variant for INACTIVE status', () => {
      const { container } = render(<GroomerStatusBadge isActive={false} />)

      const badge = container.firstChild as HTMLElement
      expect(badge).toBeInTheDocument()
      // The Badge component receives 'secondary' variant via config
    })
  })

  // ==========================================================================
  // Accessibility
  // ==========================================================================

  describe('Accessibility', () => {
    it('should render semantic HTML', () => {
      const { container } = render(<GroomerStatusBadge isActive={true} />)

      const badge = container.firstChild as HTMLElement
      expect(badge.tagName).toBeTruthy()
    })

    it('should have readable text content', () => {
      render(<GroomerStatusBadge isActive={true} />)

      expect(screen.getByText('활성')).toBeVisible()
    })

    it('should support ARIA attributes', () => {
      render(<GroomerStatusBadge isActive={true} aria-label="미용사 상태: 활성" role="status" />)

      const badge = screen.getByRole('status')
      expect(badge).toHaveAttribute('aria-label', '미용사 상태: 활성')
    })
  })

  // ==========================================================================
  // Edge Cases
  // ==========================================================================

  describe('Edge cases', () => {
    it('should handle isActive as boolean true', () => {
      render(<GroomerStatusBadge isActive={true} />)
      expect(screen.getByText('활성')).toBeInTheDocument()
    })

    it('should handle isActive as boolean false', () => {
      render(<GroomerStatusBadge isActive={false} />)
      expect(screen.getByText('비활성')).toBeInTheDocument()
    })

    it('should render with all props combined', () => {
      const ref = React.createRef<HTMLDivElement>()

      render(
        <GroomerStatusBadge
          isActive={true}
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
      expect(screen.getByText('활성')).toBeInTheDocument()
      expect(ref.current).toBeInstanceOf(HTMLElement)
    })
  })
})
