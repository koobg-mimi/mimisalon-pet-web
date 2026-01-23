'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Scissors } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Card, CardContent } from '@/components/ui/card'

// Feature imports
import { GroomerStatsCards } from '@/features/admin-groomers/components/groomers/groomer-stats-cards'
import { GroomerFilters } from '@/features/admin-groomers/components/groomers/groomer-filters'
import { GroomersTable } from '@/features/admin-groomers/components/groomers/groomers-table'
import { GroomerDetailModal } from '@/features/admin-groomers/components/groomers/groomer-detail-modal'
import {
  useActivateGroomerMutation,
  useDeactivateGroomerMutation,
  useSuspendGroomerMutation,
  useUpdateCommissionGradeMutation,
  useGetCommissionGradesQuery,
} from '@/features/admin-groomers/state/admin-groomers-api-slice'
import { useAdminGroomers } from '@/features/admin-groomers/hooks/use-admin-groomers'
import type {
  AdminGroomerInfo,
  GroomerFilters as GroomerFiltersType,
  GroomerStatus,
} from '@/features/admin-groomers/types/groomer.types'

/**
 * Admin Groomers Page
 *
 * Refactored to use feature-based architecture.
 * This is a thin wrapper (~150 lines) that composes components from features/admin-groomers/.
 *
 * Architecture:
 * - Hooks for data fetching (useAdminGroomers)
 * - RTK Query mutations for groomer actions
 * - Domain components for UI (GroomerStatsCards, GroomerFilters, GroomersTable, GroomerDetailModal)
 * - Page handles routing, auth, state coordination
 */

export default function AdminDashboardGroomersPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  // Filter state (input values - local state before "Apply" is clicked)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<GroomerStatus>('ALL')
  const [locationFilter, setLocationFilter] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'revenue' | 'bookings' | 'joinDate'>(
    'joinDate'
  )
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Applied filters (triggers API calls - updated when user clicks "Apply")
  const [appliedFilters, setAppliedFilters] = useState<GroomerFiltersType>({
    searchQuery: '',
    statusFilter: 'ALL',
    locationFilter: 'ALL',
    sortBy: 'joinDate',
    sortOrder: 'desc',
  })

  // UI state for modal
  const [selectedGroomer, setSelectedGroomer] = useState<AdminGroomerInfo | null>(null)

  // Infinite scroll state - simplified to single page tracking
  const [currentPage, setCurrentPage] = useState(1)
  const [allLoadedGroomers, setAllLoadedGroomers] = useState<AdminGroomerInfo[]>([])
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
      locationFilter,
      sortBy,
      sortOrder,
    })
    setCurrentPage(1) // Reset to first page when filters change
    setAllLoadedGroomers([]) // Clear loaded groomers
  }, [searchQuery, statusFilter, locationFilter, sortBy, sortOrder])

  // Data fetching with RTK Query
  const isEnabled = !!session?.user && session.user.role === 'ADMIN'
  const { groomers, pagination, stats, isLoading, isFetching, isError, error } = useAdminGroomers(
    appliedFilters,
    currentPage,
    isEnabled
  )

  // RTK Query mutations
  const [activateGroomer] = useActivateGroomerMutation()
  const [deactivateGroomer] = useDeactivateGroomerMutation()
  const [suspendGroomer] = useSuspendGroomerMutation()
  const [updateCommissionGrade] = useUpdateCommissionGradeMutation()

  // Fetch commission grades for the detail modal
  const { data: commissionGradesData } = useGetCommissionGradesQuery(
    { status: 'ACTIVE' },
    { skip: !isEnabled }
  )
  const commissionGrades =
    commissionGradesData?.grades.map((g) => ({
      id: g.id,
      name: g.name,
      commissionRate: g.commissionRate,
    })) ?? []

  // Accumulate groomers as we load more pages
  useEffect(() => {
    if (groomers.length > 0 && !isLoading) {
      setAllLoadedGroomers((prev) => {
        // Deduplicate by ID
        const groomerMap = new Map(prev.map((g) => [g.id, g]))
        groomers.forEach((g) => groomerMap.set(g.id, g))
        return Array.from(groomerMap.values())
      })
    }
  }, [groomers, isLoading])

  // Reset accumulated groomers when filters change
  useEffect(() => {
    setAllLoadedGroomers([])
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
  const handleSort = (field: 'name' | 'rating' | 'revenue' | 'bookings' | 'joinDate') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const handleViewDetails = (groomer: AdminGroomerInfo) => {
    setSelectedGroomer(groomer)
  }

  const handleActivate = async (groomerId: string) => {
    try {
      await activateGroomer(groomerId).unwrap()
    } catch (error) {
      alert(error instanceof Error ? error.message : '미용사 활성화에 실패했습니다.')
    }
  }

  const handleDeactivate = async (groomerId: string) => {
    try {
      await deactivateGroomer(groomerId).unwrap()
    } catch (error) {
      alert(error instanceof Error ? error.message : '미용사 비활성화에 실패했습니다.')
    }
  }

  const handleSuspend = async (groomerId: string) => {
    try {
      await suspendGroomer(groomerId).unwrap()
    } catch (error) {
      alert(error instanceof Error ? error.message : '미용사 정지에 실패했습니다.')
    }
  }

  const handleUpdateCommission = async (groomerId: string, commissionGradeId: string) => {
    try {
      await updateCommissionGrade({ groomerId, commissionGradeId }).unwrap()
      // Refresh the modal if it's open for this groomer
      if (selectedGroomer?.id === groomerId) {
        const updatedGroomer = allLoadedGroomers.find((g) => g.id === groomerId)
        if (updatedGroomer) {
          setSelectedGroomer(updatedGroomer)
        }
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : '커미션 등급 업데이트에 실패했습니다.')
    }
  }

  // Loading state
  if (isPending || (isLoading && allLoadedGroomers.length === 0)) {
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-2">
        <Scissors className="text-primary h-5 w-5" />
        <h1 className="text-2xl font-bold">미용사 관리</h1>
      </div>

      {/* Statistics Cards */}
      <GroomerStatsCards stats={stats ?? null} />

      {/* Filters */}
      <GroomerFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        locationFilter={locationFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onLocationChange={setLocationFilter}
        onApplyFilters={applyFilters}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      {/* Error Display */}
      {isError && error && (
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="text-destructive mb-1 font-semibold">
              데이터를 불러오는 중 오류가 발생했습니다
            </div>
            <p className="text-muted-foreground mb-3 text-sm">
              {error instanceof Error ? error.message : '잠시 후 다시 시도해주세요'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Groomers Table */}
      <GroomersTable
        groomers={allLoadedGroomers}
        isLoading={isFetching}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onViewDetails={handleViewDetails}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onSuspend={handleSuspend}
        scrollContainerRef={scrollContainerRef}
        loadMoreTriggerRef={loadMoreTriggerRef}
        hasMore={hasMore}
      />

      {/* Detail Modal */}
      <GroomerDetailModal
        groomer={selectedGroomer}
        open={!!selectedGroomer}
        onClose={() => setSelectedGroomer(null)}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onSuspend={handleSuspend}
        onUpdateCommission={handleUpdateCommission}
        commissionGrades={commissionGrades}
      />
    </div>
  )
}
