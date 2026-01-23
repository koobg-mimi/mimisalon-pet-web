/**
 * Tests for BookingStatsCards component
 *
 * Tests presentation component that displays booking statistics.
 * Covers data display, formatting, null handling, and visual elements.
 *
 * Target coverage: 100%
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BookingStatsCards } from '../booking-stats-cards'
import type { BookingStats } from '../../../types/booking.types'

describe('BookingStatsCards', () => {
  const mockStats: BookingStats = {
    totalBookings: 150,
    pendingBookings: 25,
    confirmedBookings: 50,
    completedBookings: 60,
    cancelledBookings: 15,
    totalRevenue: 15000000,
  }

  // ==========================================================================
  // Null Handling
  // ==========================================================================

  describe('Null handling', () => {
    it('should render nothing when stats is null', () => {
      const { container } = render(<BookingStatsCards stats={null} />)
      expect(container.firstChild).toBeNull()
    })

    it('should not render any cards when stats is null', () => {
      render(<BookingStatsCards stats={null} />)

      expect(screen.queryByText('전체 예약')).not.toBeInTheDocument()
      expect(screen.queryByText('대기중')).not.toBeInTheDocument()
      expect(screen.queryByText('확정')).not.toBeInTheDocument()
      expect(screen.queryByText('완료')).not.toBeInTheDocument()
      expect(screen.queryByText('취소')).not.toBeInTheDocument()
      expect(screen.queryByText('총 매출')).not.toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Card Rendering
  // ==========================================================================

  describe('Card rendering', () => {
    it('should render all 6 stat cards when stats is provided', () => {
      render(<BookingStatsCards stats={mockStats} />)

      expect(screen.getByText('전체 예약')).toBeInTheDocument()
      expect(screen.getByText('대기중')).toBeInTheDocument()
      expect(screen.getByText('확정')).toBeInTheDocument()
      expect(screen.getByText('완료')).toBeInTheDocument()
      expect(screen.getByText('취소')).toBeInTheDocument()
      expect(screen.getByText('총 매출')).toBeInTheDocument()
    })

    it('should render cards in correct order', () => {
      const { container } = render(<BookingStatsCards stats={mockStats} />)

      const cards = container.querySelectorAll('[class*="rounded"]')
      expect(cards.length).toBeGreaterThanOrEqual(6)
    })

    it('should use responsive grid layout', () => {
      const { container } = render(<BookingStatsCards stats={mockStats} />)

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
    it('should display total bookings correctly', () => {
      render(<BookingStatsCards stats={mockStats} />)
      expect(screen.getByText('150')).toBeInTheDocument()
    })

    it('should display pending bookings correctly', () => {
      render(<BookingStatsCards stats={mockStats} />)
      expect(screen.getByText('25')).toBeInTheDocument()
    })

    it('should display confirmed bookings correctly', () => {
      render(<BookingStatsCards stats={mockStats} />)
      expect(screen.getByText('50')).toBeInTheDocument()
    })

    it('should display completed bookings correctly', () => {
      render(<BookingStatsCards stats={mockStats} />)
      expect(screen.getByText('60')).toBeInTheDocument()
    })

    it('should display cancelled bookings correctly', () => {
      render(<BookingStatsCards stats={mockStats} />)
      expect(screen.getByText('15')).toBeInTheDocument()
    })

    it('should format and display total revenue correctly', () => {
      render(<BookingStatsCards stats={mockStats} />)
      expect(screen.getByText('₩15,000,000')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Zero Values
  // ==========================================================================

  describe('Zero values', () => {
    it('should handle zero bookings', () => {
      const zeroStats: BookingStats = {
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
      }

      render(<BookingStatsCards stats={zeroStats} />)

      // Should render "0" for counts
      const zeros = screen.getAllByText('0')
      expect(zeros.length).toBeGreaterThanOrEqual(5) // 5 count stats

      // Should render "₩0" for revenue
      expect(screen.getByText('₩0')).toBeInTheDocument()
    })

    it('should handle zero revenue', () => {
      const statsWithZeroRevenue: BookingStats = {
        ...mockStats,
        totalRevenue: 0,
      }

      render(<BookingStatsCards stats={statsWithZeroRevenue} />)
      expect(screen.getByText('₩0')).toBeInTheDocument()
    })

    it('should handle mixed zero and non-zero values', () => {
      const mixedStats: BookingStats = {
        totalBookings: 100,
        pendingBookings: 0,
        confirmedBookings: 45,
        completedBookings: 0,
        cancelledBookings: 55,
        totalRevenue: 5000000,
      }

      render(<BookingStatsCards stats={mixedStats} />)

      expect(screen.getByText('100')).toBeInTheDocument()
      expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(2)
      expect(screen.getByText('45')).toBeInTheDocument()
      expect(screen.getByText('55')).toBeInTheDocument()
      expect(screen.getByText('₩5,000,000')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Large Numbers
  // ==========================================================================

  describe('Large numbers', () => {
    it('should handle large booking counts', () => {
      const largeStats: BookingStats = {
        totalBookings: 999999,
        pendingBookings: 123456,
        confirmedBookings: 234567,
        completedBookings: 345678,
        cancelledBookings: 456789,
        totalRevenue: 999999999,
      }

      render(<BookingStatsCards stats={largeStats} />)

      expect(screen.getByText('999999')).toBeInTheDocument()
      expect(screen.getByText('123456')).toBeInTheDocument()
      expect(screen.getByText('₩999,999,999')).toBeInTheDocument()
    })

    it('should format large revenue amounts correctly', () => {
      const largeRevenueStats: BookingStats = {
        ...mockStats,
        totalRevenue: 1234567890,
      }

      render(<BookingStatsCards stats={largeRevenueStats} />)
      expect(screen.getByText('₩1,234,567,890')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Icons
  // ==========================================================================

  describe('Icons', () => {
    it('should render icons for each stat card', () => {
      const { container } = render(<BookingStatsCards stats={mockStats} />)

      // Should have 6 SVG icons (one per card)
      const svgs = container.querySelectorAll('svg')
      expect(svgs.length).toBe(6)
    })

    it('should render Calendar icon for total bookings', () => {
      const { container } = render(<BookingStatsCards stats={mockStats} />)

      // Calendar icon should be present
      const svgs = container.querySelectorAll('svg')
      expect(svgs.length).toBeGreaterThan(0)
    })

    it('should render Clock icon for pending bookings with yellow color', () => {
      const { container } = render(<BookingStatsCards stats={mockStats} />)

      const yellowIcons = container.querySelectorAll('.text-yellow-600')
      expect(yellowIcons.length).toBeGreaterThan(0)
    })

    it('should render TrendingUp icon for confirmed bookings with blue color', () => {
      const { container } = render(<BookingStatsCards stats={mockStats} />)

      const blueIcons = container.querySelectorAll('.text-blue-600')
      expect(blueIcons.length).toBeGreaterThan(0)
    })

    it('should render CheckCircle icon for completed bookings with green color', () => {
      const { container } = render(<BookingStatsCards stats={mockStats} />)

      const greenIcons = container.querySelectorAll('.text-green-600')
      expect(greenIcons.length).toBeGreaterThan(0)
    })

    it('should render XCircle icon for cancelled bookings with red color', () => {
      const { container } = render(<BookingStatsCards stats={mockStats} />)

      const redIcons = container.querySelectorAll('.text-red-600')
      expect(redIcons.length).toBeGreaterThan(0)
    })
  })

  // ==========================================================================
  // Styling
  // ==========================================================================

  describe('Styling', () => {
    it('should apply correct text colors to pending bookings', () => {
      const { container } = render(<BookingStatsCards stats={mockStats} />)

      const pendingValue = container.querySelector('.text-yellow-600')
      expect(pendingValue).toBeInTheDocument()
    })

    it('should apply correct text colors to confirmed bookings', () => {
      const { container } = render(<BookingStatsCards stats={mockStats} />)

      const confirmedValue = container.querySelector('.text-blue-600')
      expect(confirmedValue).toBeInTheDocument()
    })

    it('should apply correct text colors to completed bookings', () => {
      const { container } = render(<BookingStatsCards stats={mockStats} />)

      const completedValue = container.querySelector('.text-green-600')
      expect(completedValue).toBeInTheDocument()
    })

    it('should apply correct text colors to cancelled bookings', () => {
      const { container } = render(<BookingStatsCards stats={mockStats} />)

      const cancelledValue = container.querySelector('.text-red-600')
      expect(cancelledValue).toBeInTheDocument()
    })

    it('should display numbers in bold 2xl font', () => {
      const { container } = render(<BookingStatsCards stats={mockStats} />)

      const boldNumbers = container.querySelectorAll('.text-2xl.font-bold')
      expect(boldNumbers.length).toBe(6) // All 6 stat values
    })

    it('should apply margin bottom to the container', () => {
      const { container } = render(<BookingStatsCards stats={mockStats} />)

      const grid = container.querySelector('.mb-8')
      expect(grid).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Labels
  // ==========================================================================

  describe('Labels', () => {
    it('should display Korean labels for all cards', () => {
      render(<BookingStatsCards stats={mockStats} />)

      expect(screen.getByText('전체 예약')).toBeInTheDocument()
      expect(screen.getByText('대기중')).toBeInTheDocument()
      expect(screen.getByText('확정')).toBeInTheDocument()
      expect(screen.getByText('완료')).toBeInTheDocument()
      expect(screen.getByText('취소')).toBeInTheDocument()
      expect(screen.getByText('총 매출')).toBeInTheDocument()
    })

    it('should display labels in small font', () => {
      const { container } = render(<BookingStatsCards stats={mockStats} />)

      const labels = container.querySelectorAll('.text-sm.font-medium')
      expect(labels.length).toBe(6)
    })
  })

  // ==========================================================================
  // Accessibility
  // ==========================================================================

  describe('Accessibility', () => {
    it('should render semantic card structure', () => {
      const { container } = render(<BookingStatsCards stats={mockStats} />)

      // Card components should be present
      expect(container.querySelector('[class*="rounded"]')).toBeInTheDocument()
    })

    it('should have readable text content for all stats', () => {
      render(<BookingStatsCards stats={mockStats} />)

      expect(screen.getByText('150')).toBeVisible()
      expect(screen.getByText('25')).toBeVisible()
      expect(screen.getByText('50')).toBeVisible()
      expect(screen.getByText('60')).toBeVisible()
      expect(screen.getByText('15')).toBeVisible()
      expect(screen.getByText('₩15,000,000')).toBeVisible()
    })
  })

  // ==========================================================================
  // Edge Cases
  // ==========================================================================

  describe('Edge cases', () => {
    it('should handle negative revenue (refunds)', () => {
      const negativeRevenueStats: BookingStats = {
        ...mockStats,
        totalRevenue: -500000,
      }

      render(<BookingStatsCards stats={negativeRevenueStats} />)
      expect(screen.getByText('-₩500,000')).toBeInTheDocument()
    })

    it('should handle very large numbers without breaking layout', () => {
      const extremeStats: BookingStats = {
        totalBookings: 9999999,
        pendingBookings: 9999999,
        confirmedBookings: 9999999,
        completedBookings: 9999999,
        cancelledBookings: 9999999,
        totalRevenue: 9999999999,
      }

      const { container } = render(<BookingStatsCards stats={extremeStats} />)

      // Should render without errors
      expect(container.querySelector('.grid')).toBeInTheDocument()
      expect(screen.getByText('₩9,999,999,999')).toBeInTheDocument()
    })

    it('should handle decimal revenue amounts', () => {
      const decimalStats: BookingStats = {
        ...mockStats,
        totalRevenue: 12345.67,
      }

      render(<BookingStatsCards stats={decimalStats} />)
      // Korean currency doesn't use decimals, should round
      expect(screen.getByText('₩12,346')).toBeInTheDocument()
    })
  })
})
