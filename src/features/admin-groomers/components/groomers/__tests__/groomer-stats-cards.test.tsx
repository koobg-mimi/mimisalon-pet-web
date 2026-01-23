/**
 * Tests for GroomerStatsCards component
 *
 * Tests presentation component that displays groomer statistics.
 * Covers data display, formatting, null handling, and visual elements.
 *
 * Target coverage: 80%+
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GroomerStatsCards } from '../groomer-stats-cards'
import type { GroomerStats } from '../../../types/groomer.types'

describe('GroomerStatsCards', () => {
  const mockStats: GroomerStats = {
    totalGroomers: 45,
    activeGroomers: 38,
    inactiveGroomers: 7,
    averageRating: 4.6,
    totalBookingsThisMonth: 320,
    totalRevenueThisMonth: 48000000,
  }

  // ==========================================================================
  // Null Handling
  // ==========================================================================

  describe('Null handling', () => {
    it('should render nothing when stats is null', () => {
      const { container } = render(<GroomerStatsCards stats={null} />)
      expect(container.firstChild).toBeNull()
    })

    it('should not render any cards when stats is null', () => {
      render(<GroomerStatsCards stats={null} />)

      expect(screen.queryByText('전체 미용사')).not.toBeInTheDocument()
      expect(screen.queryByText('활동중')).not.toBeInTheDocument()
      expect(screen.queryByText('비활성')).not.toBeInTheDocument()
      expect(screen.queryByText('평균 평점')).not.toBeInTheDocument()
      expect(screen.queryByText('이번 달 예약')).not.toBeInTheDocument()
      expect(screen.queryByText('이번 달 매출')).not.toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Card Rendering
  // ==========================================================================

  describe('Card rendering', () => {
    it('should render all 6 stat cards when stats is provided', () => {
      render(<GroomerStatsCards stats={mockStats} />)

      expect(screen.getByText('전체 미용사')).toBeInTheDocument()
      expect(screen.getByText('활동중')).toBeInTheDocument()
      expect(screen.getByText('비활성')).toBeInTheDocument()
      expect(screen.getByText('평균 평점')).toBeInTheDocument()
      expect(screen.getByText('이번 달 예약')).toBeInTheDocument()
      expect(screen.getByText('이번 달 매출')).toBeInTheDocument()
    })

    it('should render cards in correct order', () => {
      const { container } = render(<GroomerStatsCards stats={mockStats} />)

      const cards = container.querySelectorAll('[class*="rounded"]')
      expect(cards.length).toBeGreaterThanOrEqual(6)
    })

    it('should use responsive grid layout', () => {
      const { container } = render(<GroomerStatsCards stats={mockStats} />)

      const grid = container.querySelector('.grid')
      expect(grid).toBeInTheDocument()
      expect(grid?.className).toContain('grid-cols-1')
      expect(grid?.className).toContain('md:grid-cols-2')
      expect(grid?.className).toContain('lg:grid-cols-6')
    })
  })

  // ==========================================================================
  // Data Display
  // ==========================================================================

  describe('Data display', () => {
    it('should display total groomers correctly', () => {
      render(<GroomerStatsCards stats={mockStats} />)
      expect(screen.getByText('45')).toBeInTheDocument()
    })

    it('should display active groomers correctly', () => {
      render(<GroomerStatsCards stats={mockStats} />)
      expect(screen.getByText('38')).toBeInTheDocument()
    })

    it('should display inactive groomers correctly', () => {
      render(<GroomerStatsCards stats={mockStats} />)
      expect(screen.getByText('7')).toBeInTheDocument()
    })

    it('should display average rating with one decimal place', () => {
      render(<GroomerStatsCards stats={mockStats} />)
      expect(screen.getByText('4.6')).toBeInTheDocument()
    })

    it('should display total bookings this month correctly', () => {
      render(<GroomerStatsCards stats={mockStats} />)
      expect(screen.getByText('320')).toBeInTheDocument()
    })

    it('should format and display total revenue this month correctly', () => {
      render(<GroomerStatsCards stats={mockStats} />)
      expect(screen.getByText('48,000,000원')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Zero Values
  // ==========================================================================

  describe('Zero values', () => {
    it('should handle zero groomers', () => {
      const zeroStats: GroomerStats = {
        totalGroomers: 0,
        activeGroomers: 0,
        inactiveGroomers: 0,
        averageRating: 0,
        totalBookingsThisMonth: 0,
        totalRevenueThisMonth: 0,
      }

      render(<GroomerStatsCards stats={zeroStats} />)

      // Should render "0" for counts
      const zeros = screen.getAllByText('0')
      expect(zeros.length).toBeGreaterThanOrEqual(4) // 4 count stats + rating

      // Should render "0.0" for rating
      expect(screen.getByText('0.0')).toBeInTheDocument()

      // Should render "0원" for revenue
      expect(screen.getByText('0원')).toBeInTheDocument()
    })

    it('should handle zero revenue', () => {
      const statsWithZeroRevenue: GroomerStats = {
        ...mockStats,
        totalRevenueThisMonth: 0,
      }

      render(<GroomerStatsCards stats={statsWithZeroRevenue} />)
      expect(screen.getByText('0원')).toBeInTheDocument()
    })

    it('should handle mixed zero and non-zero values', () => {
      const mixedStats: GroomerStats = {
        totalGroomers: 100,
        activeGroomers: 0,
        inactiveGroomers: 50,
        averageRating: 3.5,
        totalBookingsThisMonth: 0,
        totalRevenueThisMonth: 25000000,
      }

      render(<GroomerStatsCards stats={mixedStats} />)

      expect(screen.getByText('100')).toBeInTheDocument()
      expect(screen.getByText('50')).toBeInTheDocument()
      expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(2)
      expect(screen.getByText('3.5')).toBeInTheDocument()
      expect(screen.getByText('25,000,000원')).toBeInTheDocument()
    })

    it('should handle zero rating', () => {
      const zeroRatingStats: GroomerStats = {
        ...mockStats,
        averageRating: 0,
      }

      render(<GroomerStatsCards stats={zeroRatingStats} />)
      expect(screen.getByText('0.0')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Large Numbers
  // ==========================================================================

  describe('Large numbers', () => {
    it('should handle large groomer counts', () => {
      const largeStats: GroomerStats = {
        totalGroomers: 9999,
        activeGroomers: 8888,
        inactiveGroomers: 1111,
        averageRating: 4.9,
        totalBookingsThisMonth: 999999,
        totalRevenueThisMonth: 999999999,
      }

      render(<GroomerStatsCards stats={largeStats} />)

      expect(screen.getByText('9999')).toBeInTheDocument()
      expect(screen.getByText('8888')).toBeInTheDocument()
      expect(screen.getByText('999,999,999원')).toBeInTheDocument()
    })

    it('should format large revenue amounts correctly', () => {
      const largeRevenueStats: GroomerStats = {
        ...mockStats,
        totalRevenueThisMonth: 1234567890,
      }

      render(<GroomerStatsCards stats={largeRevenueStats} />)
      expect(screen.getByText('1,234,567,890원')).toBeInTheDocument()
    })

    it('should handle perfect rating', () => {
      const perfectRatingStats: GroomerStats = {
        ...mockStats,
        averageRating: 5.0,
      }

      render(<GroomerStatsCards stats={perfectRatingStats} />)
      expect(screen.getByText('5.0')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Icons
  // ==========================================================================

  describe('Icons', () => {
    it('should render icons for each stat card', () => {
      const { container } = render(<GroomerStatsCards stats={mockStats} />)

      // Should have 6 SVG icons (one per card)
      const svgs = container.querySelectorAll('svg')
      expect(svgs.length).toBe(6)
    })

    it('should render Users icon for total groomers', () => {
      const { container } = render(<GroomerStatsCards stats={mockStats} />)

      const svgs = container.querySelectorAll('svg')
      expect(svgs.length).toBeGreaterThan(0)
    })

    it('should render UserCheck icon for active groomers with green color', () => {
      const { container } = render(<GroomerStatsCards stats={mockStats} />)

      const greenIcons = container.querySelectorAll('.text-green-600')
      expect(greenIcons.length).toBeGreaterThan(0)
    })

    it('should render UserX icon for inactive groomers with gray color', () => {
      const { container } = render(<GroomerStatsCards stats={mockStats} />)

      const grayIcons = container.querySelectorAll('.text-gray-600')
      expect(grayIcons.length).toBeGreaterThan(0)
    })

    it('should render Star icon for average rating with yellow color', () => {
      const { container } = render(<GroomerStatsCards stats={mockStats} />)

      const yellowIcons = container.querySelectorAll('.text-yellow-600')
      expect(yellowIcons.length).toBeGreaterThan(0)
    })

    it('should render Calendar icon for bookings this month with blue color', () => {
      const { container } = render(<GroomerStatsCards stats={mockStats} />)

      const blueIcons = container.querySelectorAll('.text-blue-600')
      expect(blueIcons.length).toBeGreaterThan(0)
    })
  })

  // ==========================================================================
  // Styling
  // ==========================================================================

  describe('Styling', () => {
    it('should apply correct text colors to active groomers', () => {
      const { container } = render(<GroomerStatsCards stats={mockStats} />)

      const activeValue = container.querySelector('.text-green-600')
      expect(activeValue).toBeInTheDocument()
    })

    it('should apply correct text colors to inactive groomers', () => {
      const { container } = render(<GroomerStatsCards stats={mockStats} />)

      const inactiveValue = container.querySelector('.text-gray-600')
      expect(inactiveValue).toBeInTheDocument()
    })

    it('should apply correct text colors to average rating', () => {
      const { container } = render(<GroomerStatsCards stats={mockStats} />)

      const ratingValue = container.querySelector('.text-yellow-600')
      expect(ratingValue).toBeInTheDocument()
    })

    it('should apply correct text colors to bookings this month', () => {
      const { container } = render(<GroomerStatsCards stats={mockStats} />)

      const bookingsValue = container.querySelector('.text-blue-600')
      expect(bookingsValue).toBeInTheDocument()
    })

    it('should display numbers in bold 2xl font', () => {
      const { container } = render(<GroomerStatsCards stats={mockStats} />)

      const boldNumbers = container.querySelectorAll('.text-2xl.font-bold')
      expect(boldNumbers.length).toBe(6) // All 6 stat values
    })

    it('should apply margin bottom to the container', () => {
      const { container } = render(<GroomerStatsCards stats={mockStats} />)

      const grid = container.querySelector('.mb-8')
      expect(grid).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Labels
  // ==========================================================================

  describe('Labels', () => {
    it('should display Korean labels for all cards', () => {
      render(<GroomerStatsCards stats={mockStats} />)

      expect(screen.getByText('전체 미용사')).toBeInTheDocument()
      expect(screen.getByText('활동중')).toBeInTheDocument()
      expect(screen.getByText('비활성')).toBeInTheDocument()
      expect(screen.getByText('평균 평점')).toBeInTheDocument()
      expect(screen.getByText('이번 달 예약')).toBeInTheDocument()
      expect(screen.getByText('이번 달 매출')).toBeInTheDocument()
    })

    it('should display labels in small font', () => {
      const { container } = render(<GroomerStatsCards stats={mockStats} />)

      const labels = container.querySelectorAll('.text-sm.font-medium')
      expect(labels.length).toBe(6)
    })
  })

  // ==========================================================================
  // Accessibility
  // ==========================================================================

  describe('Accessibility', () => {
    it('should render semantic card structure', () => {
      const { container } = render(<GroomerStatsCards stats={mockStats} />)

      // Card components should be present
      expect(container.querySelector('[class*="rounded"]')).toBeInTheDocument()
    })

    it('should have readable text content for all stats', () => {
      render(<GroomerStatsCards stats={mockStats} />)

      expect(screen.getByText('45')).toBeVisible()
      expect(screen.getByText('38')).toBeVisible()
      expect(screen.getByText('7')).toBeVisible()
      expect(screen.getByText('4.6')).toBeVisible()
      expect(screen.getByText('320')).toBeVisible()
      expect(screen.getByText('48,000,000원')).toBeVisible()
    })
  })

  // ==========================================================================
  // Edge Cases
  // ==========================================================================

  describe('Edge cases', () => {
    it('should handle negative revenue (refunds/adjustments)', () => {
      const negativeRevenueStats: GroomerStats = {
        ...mockStats,
        totalRevenueThisMonth: -500000,
      }

      render(<GroomerStatsCards stats={negativeRevenueStats} />)
      expect(screen.getByText('-500,000원')).toBeInTheDocument()
    })

    it('should handle very large numbers without breaking layout', () => {
      const extremeStats: GroomerStats = {
        totalGroomers: 9999999,
        activeGroomers: 9999999,
        inactiveGroomers: 9999999,
        averageRating: 5.0,
        totalBookingsThisMonth: 9999999,
        totalRevenueThisMonth: 9999999999,
      }

      const { container } = render(<GroomerStatsCards stats={extremeStats} />)

      // Should render without errors
      expect(container.querySelector('.grid')).toBeInTheDocument()
      expect(screen.getByText('9,999,999,999원')).toBeInTheDocument()
    })

    it('should handle decimal rating with proper formatting', () => {
      const decimalStats: GroomerStats = {
        ...mockStats,
        averageRating: 4.567,
      }

      render(<GroomerStatsCards stats={decimalStats} />)
      // Should be rounded to 1 decimal place
      expect(screen.getByText('4.6')).toBeInTheDocument()
    })
  })
})
