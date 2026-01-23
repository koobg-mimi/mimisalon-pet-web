'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Card, CardContent } from '@/components/ui/card'
import { BookingStatus } from '@mimisalon/shared'

// Feature imports
import { BookingStatsCards } from '@/features/admin-bookings/components/bookings/booking-stats-cards'
import { BookingFilters } from '@/features/admin-bookings/components/bookings/booking-filters'
import { BookingsTable } from '@/features/admin-bookings/components/bookings/bookings-table'
import { BookingDetailModal } from '@/features/admin-bookings/components/bookings/booking-detail-modal'
import { BookingDeleteDialog } from '@/features/admin-bookings/components/bookings/booking-delete-dialog'
import {
  useGetBookingsQuery,
  useConfirmBookingMutation,
  useCancelBookingMutation,
  useCompleteBookingMutation,
  useDeleteBookingMutation,
} from '@/features/admin-bookings/state/admin-bookings-api-slice'
import { useAdminBookings } from '@/features/admin-bookings/hooks/use-admin-bookings'
import { QUERY_CONFIG } from '@/features/admin-bookings/types/booking.types'
import type {
  BookingFilters as BookingFiltersType,
  TransformedBooking,
} from '@/features/admin-bookings/types/booking.types'

/**
 * Admin Bookings Page
 *
 * Refactored to use feature-based architecture.
 * This is a thin wrapper (~150 lines) that composes components from features/admin-bookings/.
 *
 * Architecture:
 * - Hooks for data fetching (useBookingsInfinite, useBookingStats, useBookingMutations)
 * - Domain components for UI (BookingStatsCards, BookingFilters, BookingsTable, modals)
 * - Page handles routing, auth, state coordination
 */

export default function AdminBookingsPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  // Filter state (input values - local state before "Apply" is clicked)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL')
  const [dateFilter, setDateFilter] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'amount'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Applied filters (triggers API calls - updated when user clicks "Apply")
  const [appliedFilters, setAppliedFilters] = useState<BookingFiltersType>({
    searchQuery: '',
    statusFilter: 'ALL',
    dateFilter: '',
    sortBy: 'date',
    sortOrder: 'desc',
  })

  // UI state for modals
  const [selectedBooking, setSelectedBooking] = useState<TransformedBooking | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Infinite scroll state - simplified to single page tracking
  const [currentPage, setCurrentPage] = useState(1)
  const [allLoadedBookings, setAllLoadedBookings] = useState<TransformedBooking[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null!)
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null!)

  // Auth and routing
  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
    if (session?.user?.role && session.user.role !== 'ADMIN') {
      router.push('/admin/dashboard/overview')
    }
  }, [session, router])

  // Apply filters - update applied filters and reset pagination
  const applyFilters = useCallback(() => {
    setAppliedFilters({
      searchQuery,
      statusFilter,
      dateFilter,
      sortBy,
      sortOrder,
    })
    setCurrentPage(1) // Reset to first page when filters change
    setAllLoadedBookings([]) // Clear loaded bookings
  }, [searchQuery, statusFilter, dateFilter, sortBy, sortOrder])

  // Data fetching with RTK Query
  const isEnabled = !!session?.user && session.user.role === 'ADMIN'
  const { bookings, pagination, stats, isLoading, isFetching, isError, error } = useAdminBookings(
    appliedFilters,
    currentPage,
    isEnabled
  )

  // RTK Query mutations
  const [confirmBooking] = useConfirmBookingMutation()
  const [cancelBooking] = useCancelBookingMutation()
  const [completeBooking] = useCompleteBookingMutation()
  const [deleteBooking] = useDeleteBookingMutation()

  // Accumulate bookings as we load more pages
  useEffect(() => {
    if (bookings.length > 0 && !isLoading) {
      setAllLoadedBookings((prev) => {
        // Deduplicate by ID
        const bookingMap = new Map(prev.map((b) => [b.id, b]))
        bookings.forEach((b) => bookingMap.set(b.id, b))
        return Array.from(bookingMap.values())
      })
    }
  }, [bookings, isLoading])

  // Reset accumulated bookings when filters change
  useEffect(() => {
    setAllLoadedBookings([])
    setCurrentPage(1)
  }, [appliedFilters])

  const hasMore = pagination ? currentPage < pagination.totalPages : false
  const totalCount = pagination?.totalCount ?? 0
  const totalPages = pagination?.totalPages ?? 1

  // Load more function - increments page number
  const loadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [hasMore, isFetching])

  // Infinite scroll setup with Intersection Observer
  const loadMoreRef = useRef(loadMore)
  useEffect(() => {
    loadMoreRef.current = loadMore
  }, [loadMore])

  useEffect(() => {
    const trigger = loadMoreTriggerRef.current
    if (!trigger) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreRef.current()
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin: '100px',
        threshold: 0.1,
      }
    )

    observer.observe(trigger)
    return () => observer.disconnect()
  }, [])

  // Event handlers
  const handleSort = (field: 'date' | 'status' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const handleViewDetails = (booking: TransformedBooking) => {
    setSelectedBooking(booking)
    setShowDetailModal(true)
  }

  const handleConfirm = async (bookingId: string) => {
    try {
      await confirmBooking(bookingId).unwrap()
    } catch (error) {
      alert(error instanceof Error ? error.message : '예약 확정 처리에 실패했습니다.')
    }
  }

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId).unwrap()
    } catch (error) {
      alert(error instanceof Error ? error.message : '예약 취소 처리에 실패했습니다.')
    }
  }

  const handleComplete = async (bookingId: string) => {
    try {
      await completeBooking(bookingId).unwrap()
    } catch (error) {
      alert(error instanceof Error ? error.message : '예약 완료 처리에 실패했습니다.')
    }
  }

  const handleDeleteClick = (booking: TransformedBooking) => {
    setSelectedBooking(booking)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedBooking) return
    try {
      await deleteBooking(selectedBooking.id).unwrap()
      setShowDeleteDialog(false)
      setSelectedBooking(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : '예약 삭제 처리에 실패했습니다.')
    }
  }

  // Loading state
  if (isPending || (isLoading && allLoadedBookings.length === 0)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Auth check
  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">예약 관리</h1>
        <p className="text-muted-foreground">전체 예약을 관리하고 처리합니다</p>
      </div>

      {/* Statistics Cards */}
      <BookingStatsCards stats={stats ?? null} />

      {/* Filters */}
      <BookingFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={(value) => setStatusFilter(value as 'ALL' | BookingStatus)}
        onDateChange={setDateFilter}
        onApplyFilters={applyFilters}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      {/* Error Display */}
      {isError && error && (
        <Card className="border-destructive mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-destructive mt-0.5 h-5 w-5 shrink-0" />
              <div className="flex-1">
                <h3 className="text-destructive mb-1 font-semibold">
                  데이터를 불러오는 중 오류가 발생했습니다
                </h3>
                <p className="text-muted-foreground mb-3 text-sm">
                  {error instanceof Error ? error.message : '잠시 후 다시 시도해주세요'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentPage(1)
                    setAllLoadedBookings([])
                    // RTK Query will automatically refetch on component remount or cache invalidation
                  }}
                >
                  다시 시도
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bookings Table */}
      <BookingsTable
        bookings={allLoadedBookings}
        isLoading={isFetching}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onViewDetails={handleViewDetails}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onComplete={handleComplete}
        onDelete={handleDeleteClick}
        scrollContainerRef={scrollContainerRef}
        loadMoreTriggerRef={loadMoreTriggerRef}
        hasMore={hasMore}
      />

      {/* Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />

      {/* Delete Dialog */}
      <BookingDeleteDialog
        booking={selectedBooking}
        open={showDeleteDialog}
        isDeleting={false} // RTK Query mutations don't expose isPending the same way
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  )
}
