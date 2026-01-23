/**
 * PasswordStrengthIndicator Component Tests
 *
 * Tests for the password strength indicator component with progress bar and text
 */

import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PasswordStrengthIndicator } from '../password-strength-indicator'

// Mock the FormDescription component
vi.mock('@/components/ui/form', () => ({
  FormDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-description">{children}</div>
  ),
}))

describe('PasswordStrengthIndicator', () => {
  describe('Rendering with different strength levels', () => {
    it('should render with strength level 0', () => {
      render(<PasswordStrengthIndicator password="a" strength={0} />)

      expect(screen.getByText('매우 약함')).toBeInTheDocument()
      expect(
        screen.getByText('대문자, 소문자, 숫자, 특수문자를 포함하여 8자 이상')
      ).toBeInTheDocument()
    })

    it('should render with strength level 1', () => {
      render(<PasswordStrengthIndicator password="abcdefgh" strength={1} />)

      expect(screen.getByText('매우 약함')).toBeInTheDocument()
    })

    it('should render with strength level 2', () => {
      render(<PasswordStrengthIndicator password="Abcdefgh" strength={2} />)

      expect(screen.getByText('약함')).toBeInTheDocument()
    })

    it('should render with strength level 3', () => {
      render(<PasswordStrengthIndicator password="Abcdefgh1" strength={3} />)

      expect(screen.getByText('보통')).toBeInTheDocument()
    })

    it('should render with strength level 4', () => {
      render(<PasswordStrengthIndicator password="Abcdefgh1!" strength={4} />)

      expect(screen.getByText('강함')).toBeInTheDocument()
    })

    it('should render with strength level 5', () => {
      render(<PasswordStrengthIndicator password="Abcdefgh1!" strength={5} />)

      expect(screen.getByText('매우 강함')).toBeInTheDocument()
    })
  })

  describe('Color classes', () => {
    it('should display correct color class for strength 0', () => {
      render(<PasswordStrengthIndicator password="a" strength={0} />)

      const textElement = screen.getByText('매우 약함')
      expect(textElement).toHaveClass('text-red-500')
    })

    it('should display correct color class for strength 1', () => {
      render(<PasswordStrengthIndicator password="ab" strength={1} />)

      const textElement = screen.getByText('매우 약함')
      expect(textElement).toHaveClass('text-red-500')
    })

    it('should display correct color class for strength 2', () => {
      render(<PasswordStrengthIndicator password="Ab" strength={2} />)

      const textElement = screen.getByText('약함')
      expect(textElement).toHaveClass('text-orange-500')
    })

    it('should display correct color class for strength 3', () => {
      render(<PasswordStrengthIndicator password="Ab1" strength={3} />)

      const textElement = screen.getByText('보통')
      expect(textElement).toHaveClass('text-yellow-500')
    })

    it('should display correct color class for strength 4', () => {
      render(<PasswordStrengthIndicator password="Ab1!" strength={4} />)

      const textElement = screen.getByText('강함')
      expect(textElement).toHaveClass('text-green-500')
    })

    it('should display correct color class for strength 5', () => {
      render(<PasswordStrengthIndicator password="Ab1!x" strength={5} />)

      const textElement = screen.getByText('매우 강함')
      expect(textElement).toHaveClass('text-green-600')
    })
  })

  describe('Progress bar', () => {
    it('should display 0% width for strength 0', () => {
      const { container } = render(<PasswordStrengthIndicator password="a" strength={0} />)

      const progressBar = container.querySelector('.h-2.rounded-full.transition-all')
      expect(progressBar).toHaveStyle({ width: '0%' })
    })

    it('should display 20% width for strength 1', () => {
      const { container } = render(<PasswordStrengthIndicator password="ab" strength={1} />)

      const progressBar = container.querySelector('.h-2.rounded-full.transition-all')
      expect(progressBar).toHaveStyle({ width: '20%' })
    })

    it('should display 40% width for strength 2', () => {
      const { container } = render(<PasswordStrengthIndicator password="Ab" strength={2} />)

      const progressBar = container.querySelector('.h-2.rounded-full.transition-all')
      expect(progressBar).toHaveStyle({ width: '40%' })
    })

    it('should display 60% width for strength 3', () => {
      const { container } = render(<PasswordStrengthIndicator password="Ab1" strength={3} />)

      const progressBar = container.querySelector('.h-2.rounded-full.transition-all')
      expect(progressBar).toHaveStyle({ width: '60%' })
    })

    it('should display 80% width for strength 4', () => {
      const { container } = render(<PasswordStrengthIndicator password="Ab1!" strength={4} />)

      const progressBar = container.querySelector('.h-2.rounded-full.transition-all')
      expect(progressBar).toHaveStyle({ width: '80%' })
    })

    it('should display 100% width for strength 5', () => {
      const { container } = render(<PasswordStrengthIndicator password="Ab1!x" strength={5} />)

      const progressBar = container.querySelector('.h-2.rounded-full.transition-all')
      expect(progressBar).toHaveStyle({ width: '100%' })
    })
  })

  describe('Progress bar color classes', () => {
    it('should display red color for strength 0-1', () => {
      const { container } = render(<PasswordStrengthIndicator password="a" strength={0} />)

      const progressBar = container.querySelector('.h-2.rounded-full.transition-all')
      expect(progressBar).toHaveClass('bg-red-500')
    })

    it('should display orange color for strength 2', () => {
      const { container } = render(<PasswordStrengthIndicator password="Ab" strength={2} />)

      const progressBar = container.querySelector('.h-2.rounded-full.transition-all')
      expect(progressBar).toHaveClass('bg-orange-500')
    })

    it('should display yellow color for strength 3', () => {
      const { container } = render(<PasswordStrengthIndicator password="Ab1" strength={3} />)

      const progressBar = container.querySelector('.h-2.rounded-full.transition-all')
      expect(progressBar).toHaveClass('bg-yellow-500')
    })

    it('should display green color for strength 4-5', () => {
      const { container } = render(<PasswordStrengthIndicator password="Ab1!" strength={4} />)

      const progressBar = container.querySelector('.h-2.rounded-full.transition-all')
      expect(progressBar).toHaveClass('bg-green-500')
    })
  })

  describe('Helper text', () => {
    it('should show helper text', () => {
      render(<PasswordStrengthIndicator password="password" strength={2} />)

      expect(
        screen.getByText('대문자, 소문자, 숫자, 특수문자를 포함하여 8자 이상')
      ).toBeInTheDocument()
    })
  })

  describe('Empty password handling', () => {
    it('should not render when password is empty', () => {
      const { container } = render(<PasswordStrengthIndicator password="" strength={0} />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <PasswordStrengthIndicator password="test" strength={2} className="custom-class" />
      )

      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('custom-class')
    })
  })
})
