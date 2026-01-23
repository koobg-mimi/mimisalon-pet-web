'use client'

import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface EnhancedPaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  className?: string
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  maxVisiblePages?: number
}

/**
 * Enhanced pagination component with page numbers and page size selector
 * Optimized for both mobile and desktop
 */
export function EnhancedPagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
  pageSizeOptions = [10, 20, 50],
  showPageSizeSelector = true,
  maxVisiblePages = 5,
}: EnhancedPaginationProps) {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  // Calculate which page numbers to show
  const getVisiblePages = (): (number | 'ellipsis')[] => {
    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total is small
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | 'ellipsis')[] = []
    const halfVisible = Math.floor(maxVisiblePages / 2)

    // Always show first page
    pages.push(1)

    let start = Math.max(2, currentPage - halfVisible)
    let end = Math.min(totalPages - 1, currentPage + halfVisible)

    // Adjust if we're near the start or end
    if (currentPage <= halfVisible + 1) {
      end = Math.min(totalPages - 1, maxVisiblePages)
    } else if (currentPage >= totalPages - halfVisible) {
      start = Math.max(2, totalPages - maxVisiblePages)
    }

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('ellipsis')
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push('ellipsis')
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div
      className={cn('flex flex-col items-center justify-between gap-4', 'sm:flex-row', className)}
    >
      {/* Page size selector */}
      {showPageSizeSelector && onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm whitespace-nowrap">페이지당</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-9 w-[70px] sm:w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-muted-foreground text-sm whitespace-nowrap">개씩 보기</span>
        </div>
      )}

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className="h-9 w-9"
          aria-label="이전 페이지"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <div key={`ellipsis-${index}`} className="flex h-9 w-9 items-center justify-center">
                  <span className="text-muted-foreground">...</span>
                </div>
              )
            }

            const isActive = page === currentPage

            return (
              <Button
                key={page}
                variant={isActive ? 'default' : 'outline'}
                size="icon"
                onClick={() => onPageChange(page)}
                className={cn('h-9 w-9', isActive && 'pointer-events-none')}
                aria-label={`페이지 ${page}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </Button>
            )
          })}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="h-9 w-9"
          aria-label="다음 페이지"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Page info (mobile fallback) */}
      <div className="text-muted-foreground text-sm sm:hidden">
        {currentPage} / {totalPages} 페이지
      </div>
    </div>
  )
}

/**
 * Compact version for mobile
 */
export function CompactPagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
  pageSizeOptions = [10, 20, 50],
}: EnhancedPaginationProps) {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Page size selector */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">페이지당</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-9 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-muted-foreground text-sm">개</span>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="default"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className="min-h-[44px] flex-1"
        >
          <ChevronLeftIcon className="mr-1 h-5 w-5" />
          이전
        </Button>

        <div className="min-w-[80px] text-center">
          <div className="text-sm font-medium">
            {currentPage} / {totalPages}
          </div>
        </div>

        <Button
          variant="outline"
          size="default"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="min-h-[44px] flex-1"
        >
          다음
          <ChevronRightIcon className="ml-1 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
