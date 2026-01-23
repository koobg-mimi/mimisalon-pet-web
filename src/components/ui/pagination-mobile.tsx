'use client';

import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MobilePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showPageInfo?: boolean;
}

/**
 * Simplified pagination component optimized for mobile devices
 * Shows only previous/next buttons with current page info
 */
export function MobilePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showPageInfo = true,
}: MobilePaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2',
        'mx-auto w-full max-w-sm', // Center and limit width
        className
      )}
    >
      <Button
        variant="outline"
        size="default"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className={cn(
          'min-h-[44px] px-3 py-2',
          'flex items-center gap-1',
          'max-w-[120px] flex-1' // Flexible width
        )}
      >
        <ChevronLeftIcon className="h-5 w-5" />
        <span className="xs:inline hidden">이전</span>
      </Button>

      {showPageInfo && (
        <div className="min-w-[80px] px-2 text-center">
          <div className="text-sm font-medium">
            {currentPage} / {totalPages}
          </div>
          <div className="text-muted-foreground text-xs">페이지</div>
        </div>
      )}

      <Button
        variant="outline"
        size="default"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className={cn(
          'min-h-[44px] px-3 py-2',
          'flex items-center gap-1',
          'max-w-[120px] flex-1' // Flexible width
        )}
      >
        <span className="xs:inline hidden">다음</span>
        <ChevronRightIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}

/**
 * Advanced mobile pagination with swipeable page indicator
 * Shows dots for pages with swipe gesture support
 */
export function SwipeablePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  maxDots = 5,
}: MobilePaginationProps & { maxDots?: number }) {
  // Calculate which dots to show
  const getVisiblePages = () => {
    if (totalPages <= maxDots) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxDots / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxDots - 1);

    if (end - start < maxDots - 1) {
      start = Math.max(1, end - maxDots + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4',
        'w-full touch-pan-x', // Enable horizontal swipe
        className
      )}
    >
      {/* Dot indicators */}
      <div className="flex items-center gap-2">
        {currentPage > 1 && !visiblePages.includes(1) && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="h-2 w-2 rounded-full bg-gray-300 transition-all"
              aria-label="Page 1"
            />
            <span className="text-gray-400">...</span>
          </>
        )}

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'rounded-full transition-all',
              'min-h-[44px] min-w-[44px]', // Touch target
              'flex items-center justify-center',
              page === currentPage
                ? 'bg-primary text-primary-foreground h-10 w-10 font-bold'
                : 'h-8 w-8 bg-gray-200 hover:bg-gray-300'
            )}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages && !visiblePages.includes(totalPages) && (
          <>
            <span className="text-gray-400">...</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className="h-2 w-2 rounded-full bg-gray-300 transition-all"
              aria-label={`Page ${totalPages}`}
            />
          </>
        )}
      </div>

      {/* Previous/Next buttons */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="min-h-[44px] px-4"
        >
          <ChevronLeftIcon className="mr-1 h-5 w-5" />
          이전
        </Button>

        <div className="text-muted-foreground text-sm">
          {currentPage} / {totalPages}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="min-h-[44px] px-4"
        >
          다음
          <ChevronRightIcon className="ml-1 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
