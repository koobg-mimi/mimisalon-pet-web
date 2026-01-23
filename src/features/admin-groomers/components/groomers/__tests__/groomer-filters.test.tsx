/**
 * Tests for GroomerFilters component
 *
 * Tests form interactions, filter state management, and user input handling.
 * Covers controlled inputs, event handlers, and results display.
 *
 * Target coverage: 80%+
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GroomerFilters } from '../groomer-filters'

describe('GroomerFilters', () => {
  const mockHandlers = {
    onSearchChange: vi.fn(),
    onStatusChange: vi.fn(),
    onLocationChange: vi.fn(),
    onApplyFilters: vi.fn(),
  }

  const defaultProps = {
    searchQuery: '',
    statusFilter: 'ALL' as const,
    locationFilter: 'ALL',
    totalCount: 45,
    currentPage: 1,
    totalPages: 3,
    ...mockHandlers,
  }

  const mockLocations = [
    { id: 'seoul', name: '서울' },
    { id: 'busan', name: '부산' },
    { id: 'incheon', name: '인천' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==========================================================================
  // Rendering
  // ==========================================================================

  describe('Rendering', () => {
    it('should render all filter controls', () => {
      render(<GroomerFilters {...defaultProps} />)

      // Search input
      expect(
        screen.getByPlaceholderText('미용사명, 이메일, 전화번호로 검색...')
      ).toBeInTheDocument()

      // Status filter (trigger button)
      expect(screen.getByText('모든 상태')).toBeInTheDocument()

      // Apply button
      expect(screen.getByRole('button', { name: /필터 적용/i })).toBeInTheDocument()
    })

    it('should render results count when totalCount > 0', () => {
      render(<GroomerFilters {...defaultProps} totalCount={45} currentPage={2} totalPages={5} />)

      expect(screen.getByText(/총 45명의 미용사/)).toBeInTheDocument()
      expect(screen.getByText(/페이지 2 \/ 5/)).toBeInTheDocument()
    })

    it('should not render results count when totalCount is 0', () => {
      render(<GroomerFilters {...defaultProps} totalCount={0} />)

      expect(screen.queryByText(/총/)).not.toBeInTheDocument()
    })

    it('should use responsive flex layout', () => {
      const { container } = render(<GroomerFilters {...defaultProps} />)

      const flexContainer = container.querySelector('.flex.flex-col.gap-4.sm\\:flex-row')
      expect(flexContainer).toBeInTheDocument()
    })

    it('should render location filter when locations are provided', () => {
      render(<GroomerFilters {...defaultProps} locations={mockLocations} />)

      // Should have 2 comboboxes (status + location)
      const comboboxes = screen.getAllByRole('combobox')
      expect(comboboxes.length).toBe(2)
    })

    it('should not render location filter when locations array is empty', () => {
      render(<GroomerFilters {...defaultProps} locations={[]} />)

      // Should have only 1 combobox (status only)
      const comboboxes = screen.getAllByRole('combobox')
      expect(comboboxes.length).toBe(1)
    })
  })

  // ==========================================================================
  // Search Input
  // ==========================================================================

  describe('Search input', () => {
    it('should display current search query', () => {
      render(<GroomerFilters {...defaultProps} searchQuery="김미용사" />)

      const searchInput = screen.getByPlaceholderText('미용사명, 이메일, 전화번호로 검색...')
      expect(searchInput).toHaveValue('김미용사')
    })

    it('should call onSearchChange when typing', async () => {
      const user = userEvent.setup()
      render(<GroomerFilters {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('미용사명, 이메일, 전화번호로 검색...')
      await user.type(searchInput, 'test')

      expect(mockHandlers.onSearchChange).toHaveBeenCalledTimes(4) // 't', 'e', 's', 't'
      expect(mockHandlers.onSearchChange).toHaveBeenLastCalledWith('t')
    })

    it('should call onApplyFilters when Enter key is pressed', () => {
      render(<GroomerFilters {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('미용사명, 이메일, 전화번호로 검색...')
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' })

      expect(mockHandlers.onApplyFilters).toHaveBeenCalledTimes(1)
    })

    it('should not call onApplyFilters when other keys are pressed', () => {
      render(<GroomerFilters {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('미용사명, 이메일, 전화번호로 검색...')
      fireEvent.keyDown(searchInput, { key: 'a', code: 'KeyA' })
      fireEvent.keyDown(searchInput, { key: 'Tab', code: 'Tab' })

      expect(mockHandlers.onApplyFilters).not.toHaveBeenCalled()
    })

    it('should handle empty search query', () => {
      render(<GroomerFilters {...defaultProps} searchQuery="" />)

      const searchInput = screen.getByPlaceholderText('미용사명, 이메일, 전화번호로 검색...')
      expect(searchInput).toHaveValue('')
    })

    it('should handle long search queries', () => {
      const longQuery = 'Very long search query with email test@example.com and phone 010-1234-5678'
      render(<GroomerFilters {...defaultProps} searchQuery={longQuery} />)

      const searchInput = screen.getByPlaceholderText('미용사명, 이메일, 전화번호로 검색...')
      expect(searchInput).toHaveValue(longQuery)
    })
  })

  // ==========================================================================
  // Status Filter
  // ==========================================================================

  describe('Status filter', () => {
    it('should display current status filter', () => {
      render(<GroomerFilters {...defaultProps} statusFilter="ALL" />)

      expect(screen.getByText('모든 상태')).toBeInTheDocument()
    })

    it('should render combobox trigger for status selection', () => {
      render(<GroomerFilters {...defaultProps} />)

      const triggers = screen.getAllByRole('combobox')
      expect(triggers.length).toBeGreaterThan(0)
      expect(triggers[0]).toHaveTextContent('모든 상태')
    })

    it('should call onStatusChange when status is changed', () => {
      render(<GroomerFilters {...defaultProps} onStatusChange={mockHandlers.onStatusChange} />)

      const trigger = screen.getAllByRole('combobox')[0]
      expect(trigger).toBeInTheDocument()
    })

    it('should have fixed width', () => {
      const { container } = render(<GroomerFilters {...defaultProps} />)

      const selectTriggers = container.querySelectorAll('.w-\\[180px\\]')
      expect(selectTriggers.length).toBeGreaterThan(0)
    })

    it('should support ACTIVE status', () => {
      render(<GroomerFilters {...defaultProps} statusFilter="ACTIVE" />)

      const trigger = screen.getAllByRole('combobox')[0]
      expect(trigger).toBeInTheDocument()
    })

    it('should support INACTIVE status', () => {
      render(<GroomerFilters {...defaultProps} statusFilter="INACTIVE" />)

      const trigger = screen.getAllByRole('combobox')[0]
      expect(trigger).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Location Filter
  // ==========================================================================

  describe('Location filter', () => {
    it('should display location filter when locations provided', () => {
      render(<GroomerFilters {...defaultProps} locations={mockLocations} />)

      const comboboxes = screen.getAllByRole('combobox')
      expect(comboboxes.length).toBe(2) // status + location
    })

    it('should not display location filter when no locations', () => {
      render(<GroomerFilters {...defaultProps} />)

      const comboboxes = screen.getAllByRole('combobox')
      expect(comboboxes.length).toBe(1) // status only
    })

    it('should not display location filter when locations is empty array', () => {
      render(<GroomerFilters {...defaultProps} locations={[]} />)

      const comboboxes = screen.getAllByRole('combobox')
      expect(comboboxes.length).toBe(1) // status only
    })

    it('should have fixed width', () => {
      const { container } = render(<GroomerFilters {...defaultProps} locations={mockLocations} />)

      const selectTriggers = container.querySelectorAll('.w-\\[180px\\]')
      expect(selectTriggers.length).toBe(2) // Both filters should have 180px width
    })

    it('should handle multiple locations', () => {
      const manyLocations = [
        { id: 'loc1', name: '지역1' },
        { id: 'loc2', name: '지역2' },
        { id: 'loc3', name: '지역3' },
        { id: 'loc4', name: '지역4' },
        { id: 'loc5', name: '지역5' },
      ]

      render(<GroomerFilters {...defaultProps} locations={manyLocations} />)

      const comboboxes = screen.getAllByRole('combobox')
      expect(comboboxes.length).toBe(2)
    })

    it('should call onLocationChange when location is changed', () => {
      render(<GroomerFilters {...defaultProps} locations={mockLocations} />)

      const comboboxes = screen.getAllByRole('combobox')
      expect(comboboxes[1]).toBeInTheDocument() // Location filter is second
    })

    it('should support ALL location filter', () => {
      render(<GroomerFilters {...defaultProps} locations={mockLocations} locationFilter="ALL" />)

      const comboboxes = screen.getAllByRole('combobox')
      expect(comboboxes.length).toBe(2)
    })
  })

  // ==========================================================================
  // Apply Filters Button
  // ==========================================================================

  describe('Apply filters button', () => {
    it('should render apply filters button', () => {
      render(<GroomerFilters {...defaultProps} />)

      expect(screen.getByRole('button', { name: /필터 적용/i })).toBeInTheDocument()
    })

    it('should call onApplyFilters when clicked', () => {
      render(<GroomerFilters {...defaultProps} />)

      const applyButton = screen.getByRole('button', { name: /필터 적용/i })
      fireEvent.click(applyButton)

      expect(mockHandlers.onApplyFilters).toHaveBeenCalledTimes(1)
    })

    it('should render Filter icon in button', () => {
      const { container } = render(<GroomerFilters {...defaultProps} />)

      const button = screen.getByRole('button', { name: /필터 적용/i })
      const svg = button.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should have outline variant', () => {
      render(<GroomerFilters {...defaultProps} />)

      const button = screen.getByRole('button', { name: /필터 적용/i })
      expect(button.className).toContain('border')
    })
  })

  // ==========================================================================
  // Results Count Display
  // ==========================================================================

  describe('Results count display', () => {
    it('should format large numbers with Korean locale', () => {
      render(<GroomerFilters {...defaultProps} totalCount={12345} />)

      expect(screen.getByText(/총 12,345명의 미용사/)).toBeInTheDocument()
    })

    it('should show single groomer correctly', () => {
      render(<GroomerFilters {...defaultProps} totalCount={1} />)

      expect(screen.getByText(/총 1명의 미용사/)).toBeInTheDocument()
    })

    it('should show current page and total pages', () => {
      render(<GroomerFilters {...defaultProps} currentPage={3} totalPages={10} />)

      expect(screen.getByText(/페이지 3 \/ 10/)).toBeInTheDocument()
    })

    it('should show page 1 of 1 for single page', () => {
      render(<GroomerFilters {...defaultProps} currentPage={1} totalPages={1} />)

      expect(screen.getByText(/페이지 1 \/ 1/)).toBeInTheDocument()
    })

    it('should hide count when totalCount is 0', () => {
      render(<GroomerFilters {...defaultProps} totalCount={0} />)

      expect(screen.queryByText(/명의 미용사/)).not.toBeInTheDocument()
    })

    it('should apply muted text color to count', () => {
      const { container } = render(<GroomerFilters {...defaultProps} totalCount={45} />)

      const countText = container.querySelector('.text-muted-foreground')
      expect(countText).toBeInTheDocument()
      expect(countText?.className).toContain('text-sm')
    })

    it('should apply margin top to count', () => {
      const { container } = render(<GroomerFilters {...defaultProps} totalCount={45} />)

      const countText = container.querySelector('.mt-2')
      expect(countText).toBeInTheDocument()
    })

    it('should handle very large counts', () => {
      render(<GroomerFilters {...defaultProps} totalCount={999999} />)

      expect(screen.getByText(/총 999,999명의 미용사/)).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Controlled Components
  // ==========================================================================

  describe('Controlled components', () => {
    it('should update search input when searchQuery prop changes', () => {
      const { rerender } = render(<GroomerFilters {...defaultProps} searchQuery="initial" />)

      let searchInput = screen.getByPlaceholderText('미용사명, 이메일, 전화번호로 검색...')
      expect(searchInput).toHaveValue('initial')

      rerender(<GroomerFilters {...defaultProps} searchQuery="updated" />)

      searchInput = screen.getByPlaceholderText('미용사명, 이메일, 전화번호로 검색...')
      expect(searchInput).toHaveValue('updated')
    })

    it('should update totalCount when prop changes', () => {
      const { rerender } = render(<GroomerFilters {...defaultProps} totalCount={10} />)

      expect(screen.getByText(/총 10명의 미용사/)).toBeInTheDocument()

      rerender(<GroomerFilters {...defaultProps} totalCount={25} />)

      expect(screen.getByText(/총 25명의 미용사/)).toBeInTheDocument()
    })

    it('should update page info when props change', () => {
      const { rerender } = render(
        <GroomerFilters {...defaultProps} currentPage={1} totalPages={5} />
      )

      expect(screen.getByText(/페이지 1 \/ 5/)).toBeInTheDocument()

      rerender(<GroomerFilters {...defaultProps} currentPage={3} totalPages={5} />)

      expect(screen.getByText(/페이지 3 \/ 5/)).toBeInTheDocument()
    })

    it('should handle dynamic location list updates', () => {
      const { rerender } = render(<GroomerFilters {...defaultProps} />)

      let comboboxes = screen.getAllByRole('combobox')
      expect(comboboxes.length).toBe(1) // Only status filter

      rerender(<GroomerFilters {...defaultProps} locations={mockLocations} />)

      comboboxes = screen.getAllByRole('combobox')
      expect(comboboxes.length).toBe(2) // Status + location
    })
  })

  // ==========================================================================
  // Integration Scenarios
  // ==========================================================================

  describe('Integration scenarios', () => {
    it('should work with all filters active', () => {
      render(
        <GroomerFilters
          {...defaultProps}
          searchQuery="김미용사"
          statusFilter="ACTIVE"
          locationFilter="seoul"
          locations={mockLocations}
          totalCount={5}
        />
      )

      expect(screen.getByPlaceholderText('미용사명, 이메일, 전화번호로 검색...')).toHaveValue(
        '김미용사'
      )
      expect(screen.getByText(/총 5명의 미용사/)).toBeInTheDocument()
    })

    it('should handle clearing all filters', () => {
      render(
        <GroomerFilters
          {...defaultProps}
          searchQuery=""
          statusFilter="ALL"
          locationFilter="ALL"
          locations={mockLocations}
        />
      )

      expect(screen.getByPlaceholderText('미용사명, 이메일, 전화번호로 검색...')).toHaveValue('')
    })

    it('should support sequential filter changes', () => {
      const { rerender } = render(<GroomerFilters {...defaultProps} />)

      // Change search
      rerender(<GroomerFilters {...defaultProps} searchQuery="test" />)
      expect(screen.getByPlaceholderText('미용사명, 이메일, 전화번호로 검색...')).toHaveValue(
        'test'
      )

      // Change status
      rerender(<GroomerFilters {...defaultProps} searchQuery="test" statusFilter="ACTIVE" />)
      expect(screen.getByPlaceholderText('미용사명, 이메일, 전화번호로 검색...')).toHaveValue(
        'test'
      )
    })
  })

  // ==========================================================================
  // Accessibility
  // ==========================================================================

  describe('Accessibility', () => {
    it('should have accessible search input', () => {
      render(<GroomerFilters {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('미용사명, 이메일, 전화번호로 검색...')
      expect(searchInput).toBeInTheDocument()
      expect(searchInput.tagName).toBe('INPUT')
    })

    it('should have accessible combobox for status', () => {
      render(<GroomerFilters {...defaultProps} />)

      const combobox = screen.getAllByRole('combobox')[0]
      expect(combobox).toBeInTheDocument()
    })

    it('should have accessible button', () => {
      render(<GroomerFilters {...defaultProps} />)

      const button = screen.getByRole('button', { name: /필터 적용/i })
      expect(button).toBeInTheDocument()
    })
  })
})
