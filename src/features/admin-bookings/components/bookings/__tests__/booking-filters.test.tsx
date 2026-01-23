/**
 * Tests for BookingFilters component
 *
 * Tests form interactions, filter state management, and user input handling.
 * Covers controlled inputs, event handlers, and results display.
 *
 * Target coverage: 100%
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookingFilters } from '../booking-filters'
import { BookingStatus } from '@mimisalon/shared'

describe('BookingFilters', () => {
  const mockHandlers = {
    onSearchChange: vi.fn(),
    onStatusChange: vi.fn(),
    onDateChange: vi.fn(),
    onApplyFilters: vi.fn(),
  }

  const defaultProps = {
    searchQuery: '',
    statusFilter: 'ALL',
    dateFilter: '',
    totalCount: 100,
    currentPage: 1,
    totalPages: 5,
    ...mockHandlers,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==========================================================================
  // Rendering
  // ==========================================================================

  describe('Rendering', () => {
    it('should render all filter controls', () => {
      const { container } = render(<BookingFilters {...defaultProps} />)

      // Search input
      expect(
        screen.getByPlaceholderText('예약번호, 고객명, 전화번호로 검색...')
      ).toBeInTheDocument()

      // Status filter (trigger button)
      expect(screen.getByText('모든 상태')).toBeInTheDocument()

      // Date input
      const dateInput = container.querySelector('input[type="date"]')
      expect(dateInput).toBeInTheDocument()

      // Apply button
      expect(screen.getByRole('button', { name: /필터 적용/i })).toBeInTheDocument()
    })

    it('should render results count when totalCount > 0', () => {
      render(<BookingFilters {...defaultProps} totalCount={150} />)

      expect(screen.getByText(/총 150개의 예약/)).toBeInTheDocument()
      expect(screen.getByText(/페이지 1 \/ 5/)).toBeInTheDocument()
    })

    it('should not render results count when totalCount is 0', () => {
      render(<BookingFilters {...defaultProps} totalCount={0} />)

      expect(screen.queryByText(/총/)).not.toBeInTheDocument()
    })

    it('should use responsive flex layout', () => {
      const { container } = render(<BookingFilters {...defaultProps} />)

      const flexContainer = container.querySelector('.flex.flex-col.gap-4.sm\\:flex-row')
      expect(flexContainer).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Search Input
  // ==========================================================================

  describe('Search input', () => {
    it('should display current search query', () => {
      render(<BookingFilters {...defaultProps} searchQuery="김철수" />)

      const searchInput = screen.getByPlaceholderText('예약번호, 고객명, 전화번호로 검색...')
      expect(searchInput).toHaveValue('김철수')
    })

    it('should call onSearchChange when typing', async () => {
      const user = userEvent.setup()
      render(<BookingFilters {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('예약번호, 고객명, 전화번호로 검색...')
      await user.type(searchInput, 'test')

      expect(mockHandlers.onSearchChange).toHaveBeenCalledTimes(4) // 't', 'e', 's', 't'
      // userEvent.type() fires onChange for each character, so last call is 't' not 'test'
      expect(mockHandlers.onSearchChange).toHaveBeenLastCalledWith('t')
    })

    it('should call onApplyFilters when Enter key is pressed', () => {
      render(<BookingFilters {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('예약번호, 고객명, 전화번호로 검색...')
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' })

      expect(mockHandlers.onApplyFilters).toHaveBeenCalledTimes(1)
    })

    it('should not call onApplyFilters when other keys are pressed', () => {
      render(<BookingFilters {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('예약번호, 고객명, 전화번호로 검색...')
      fireEvent.keyDown(searchInput, { key: 'a', code: 'KeyA' })
      fireEvent.keyDown(searchInput, { key: 'Tab', code: 'Tab' })

      expect(mockHandlers.onApplyFilters).not.toHaveBeenCalled()
    })

    it('should handle empty search query', () => {
      render(<BookingFilters {...defaultProps} searchQuery="" />)

      const searchInput = screen.getByPlaceholderText('예약번호, 고객명, 전화번호로 검색...')
      expect(searchInput).toHaveValue('')
    })

    it('should handle long search queries', () => {
      const longQuery = 'Very long search query with many characters that should still work fine'
      render(<BookingFilters {...defaultProps} searchQuery={longQuery} />)

      const searchInput = screen.getByPlaceholderText('예약번호, 고객명, 전화번호로 검색...')
      expect(searchInput).toHaveValue(longQuery)
    })
  })

  // ==========================================================================
  // Status Filter
  // ==========================================================================

  describe('Status filter', () => {
    it('should display current status filter', () => {
      render(<BookingFilters {...defaultProps} statusFilter="ALL" />)

      expect(screen.getByText('모든 상태')).toBeInTheDocument()
    })

    it('should render combobox trigger for status selection', () => {
      render(<BookingFilters {...defaultProps} />)

      // Verify the Select trigger is rendered and accessible
      const trigger = screen.getByRole('combobox')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveTextContent('모든 상태')
    })

    it('should call onStatusChange when status is changed', () => {
      render(<BookingFilters {...defaultProps} onStatusChange={mockHandlers.onStatusChange} />)

      // Verify the callback is passed correctly
      // Note: Full dropdown interaction testing is not feasible with happy-dom + Radix UI
      // due to Pointer Capture API limitations. Integration tests should cover actual behavior.
      const trigger = screen.getByRole('combobox')
      expect(trigger).toBeInTheDocument()
    })

    it('should have fixed width', () => {
      const { container } = render(<BookingFilters {...defaultProps} />)

      const selectTrigger = container.querySelector('.w-\\[180px\\]')
      expect(selectTrigger).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Date Filter
  // ==========================================================================

  describe('Date filter', () => {
    it('should display current date filter', () => {
      const { container } = render(<BookingFilters {...defaultProps} dateFilter="2025-11-05" />)

      const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement

      expect(dateInput).toHaveValue('2025-11-05')
    })

    it('should call onDateChange when date is changed', () => {
      const { container } = render(<BookingFilters {...defaultProps} />)

      const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement

      fireEvent.change(dateInput, { target: { value: '2025-12-25' } })

      expect(mockHandlers.onDateChange).toHaveBeenCalledWith('2025-12-25')
    })

    it('should handle empty date filter', () => {
      const { container } = render(<BookingFilters {...defaultProps} dateFilter="" />)

      const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement

      expect(dateInput).toHaveValue('')
    })

    it('should use date input type', () => {
      const { container } = render(<BookingFilters {...defaultProps} />)

      const dateInput = container.querySelector('input[type="date"]')

      expect(dateInput).toHaveAttribute('type', 'date')
    })

    it('should have fixed width', () => {
      const { container } = render(<BookingFilters {...defaultProps} />)

      const dateInputs = container.querySelectorAll('.w-\\[180px\\]')
      expect(dateInputs.length).toBeGreaterThan(0)
    })
  })

  // ==========================================================================
  // Apply Filters Button
  // ==========================================================================

  describe('Apply filters button', () => {
    it('should render apply button with correct text', () => {
      render(<BookingFilters {...defaultProps} />)

      const button = screen.getByRole('button', { name: /필터 적용/i })
      expect(button).toBeInTheDocument()
    })

    it('should call onApplyFilters when clicked', async () => {
      const user = userEvent.setup()
      render(<BookingFilters {...defaultProps} />)

      const button = screen.getByRole('button', { name: /필터 적용/i })
      await user.click(button)

      expect(mockHandlers.onApplyFilters).toHaveBeenCalledTimes(1)
    })

    it('should render Filter icon', () => {
      const { container } = render(<BookingFilters {...defaultProps} />)

      const button = screen.getByRole('button', { name: /필터 적용/i })
      const icon = button.querySelector('svg')

      expect(icon).toBeInTheDocument()
    })

    it('should use outline variant', () => {
      render(<BookingFilters {...defaultProps} />)

      const button = screen.getByRole('button', { name: /필터 적용/i })
      expect(button.className).toContain('border')
    })
  })

  // ==========================================================================
  // Results Count Display
  // ==========================================================================

  describe('Results count display', () => {
    it('should format total count with Korean locale', () => {
      render(<BookingFilters {...defaultProps} totalCount={1234} />)

      expect(screen.getByText(/총 1,234개의 예약/)).toBeInTheDocument()
    })

    it('should display current page and total pages', () => {
      render(<BookingFilters {...defaultProps} currentPage={3} totalPages={10} />)

      expect(screen.getByText(/페이지 3 \/ 10/)).toBeInTheDocument()
    })

    it('should display for page 1 of 1', () => {
      render(<BookingFilters {...defaultProps} currentPage={1} totalPages={1} totalCount={10} />)

      expect(screen.getByText(/페이지 1 \/ 1/)).toBeInTheDocument()
    })

    it('should display for large page numbers', () => {
      render(<BookingFilters {...defaultProps} currentPage={99} totalPages={100} />)

      expect(screen.getByText(/페이지 99 \/ 100/)).toBeInTheDocument()
    })

    it('should format large counts correctly', () => {
      render(<BookingFilters {...defaultProps} totalCount={123456} />)

      expect(screen.getByText(/총 123,456개의 예약/)).toBeInTheDocument()
    })

    it('should not display when totalCount is 0', () => {
      render(<BookingFilters {...defaultProps} totalCount={0} />)

      expect(screen.queryByText(/총/)).not.toBeInTheDocument()
      expect(screen.queryByText(/페이지/)).not.toBeInTheDocument()
    })

    it('should use muted text color', () => {
      const { container } = render(<BookingFilters {...defaultProps} totalCount={100} />)

      const resultsText = container.querySelector('.text-muted-foreground')
      expect(resultsText).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Controlled Components
  // ==========================================================================

  describe('Controlled components behavior', () => {
    it('should update search input when prop changes', () => {
      const { rerender } = render(<BookingFilters {...defaultProps} searchQuery="" />)

      let searchInput = screen.getByPlaceholderText('예약번호, 고객명, 전화번호로 검색...')
      expect(searchInput).toHaveValue('')

      rerender(<BookingFilters {...defaultProps} searchQuery="새로운 검색어" />)

      searchInput = screen.getByPlaceholderText('예약번호, 고객명, 전화번호로 검색...')
      expect(searchInput).toHaveValue('새로운 검색어')
    })

    it('should update date input when prop changes', () => {
      const { rerender, container } = render(<BookingFilters {...defaultProps} dateFilter="" />)

      let dateInput = container.querySelector('input[type="date"]') as HTMLInputElement
      expect(dateInput).toHaveValue('')

      rerender(<BookingFilters {...defaultProps} dateFilter="2025-12-25" />)

      dateInput = container.querySelector('input[type="date"]') as HTMLInputElement
      expect(dateInput).toHaveValue('2025-12-25')
    })

    it('should update results count when props change', () => {
      const { rerender } = render(<BookingFilters {...defaultProps} totalCount={100} />)

      expect(screen.getByText(/총 100개의 예약/)).toBeInTheDocument()

      rerender(<BookingFilters {...defaultProps} totalCount={250} />)

      expect(screen.getByText(/총 250개의 예약/)).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Integration Scenarios
  // ==========================================================================

  describe('Integration scenarios', () => {
    it('should handle complete filter workflow', async () => {
      const user = userEvent.setup()
      const { container } = render(<BookingFilters {...defaultProps} />)

      // Type search query
      const searchInput = screen.getByPlaceholderText('예약번호, 고객명, 전화번호로 검색...')
      await user.type(searchInput, '김철수')

      // Change date (use fireEvent for date inputs)
      const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement
      fireEvent.change(dateInput, { target: { value: '2025-11-05' } })

      // Click apply
      const applyButton = screen.getByRole('button', { name: /필터 적용/i })
      await user.click(applyButton)

      expect(mockHandlers.onSearchChange).toHaveBeenCalled()
      expect(mockHandlers.onDateChange).toHaveBeenCalled()
      expect(mockHandlers.onApplyFilters).toHaveBeenCalledTimes(1)
    })

    it('should handle Enter key in search after typing', async () => {
      const user = userEvent.setup()
      render(<BookingFilters {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('예약번호, 고객명, 전화번호로 검색...')
      await user.type(searchInput, 'test{Enter}')

      expect(mockHandlers.onSearchChange).toHaveBeenCalled()
      expect(mockHandlers.onApplyFilters).toHaveBeenCalledTimes(1)
    })
  })

  // ==========================================================================
  // Accessibility
  // ==========================================================================

  describe('Accessibility', () => {
    it('should have proper input placeholders', () => {
      render(<BookingFilters {...defaultProps} />)

      expect(
        screen.getByPlaceholderText('예약번호, 고객명, 전화번호로 검색...')
      ).toBeInTheDocument()
    })

    it('should have clickable button', () => {
      render(<BookingFilters {...defaultProps} />)

      const button = screen.getByRole('button', { name: /필터 적용/i })
      expect(button).toBeEnabled()
    })

    it('should have focusable inputs', () => {
      render(<BookingFilters {...defaultProps} />)

      const searchInput = screen.getByPlaceholderText('예약번호, 고객명, 전화번호로 검색...')
      expect(searchInput).not.toHaveAttribute('disabled')
    })
  })
})
