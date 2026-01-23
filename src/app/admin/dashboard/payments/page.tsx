'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { CreditCard } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { PageHeader } from '@/components/layout/PageHeader'

// Feature imports
import { PaymentFilters } from '@/features/admin-payments/components/payments/payment-filters'
import { PaymentsTable } from '@/features/admin-payments/components/payments/payments-table'
import { PaymentDetailModal } from '@/features/admin-payments/components/payments/payment-detail-modal'

// Hooks and types
import { useAdminPayments } from '@/features/admin-payments/hooks/use-admin-payments'
import type {
  PaymentFilters as PaymentFiltersType,
  AdminPaymentInfo,
} from '@/features/admin-payments/types/payment.types'

/**
 * Admin Payments Page
 *
 * Displays and manages all payment transactions in the system.
 * Uses feature-based architecture with RTK Query for data fetching.
 */
export default function AdminPaymentsPage() {
  // Authentication
  const { data: session, isPending } = useSession()
  const router = useRouter()

  // Local UI state - filters
  const [filters, setFilters] = useState<PaymentFiltersType>({
    searchQuery: '',
    statusFilter: 'ALL',
  })
  const [page, setPage] = useState(1)

  // Local UI state - modals
  const [selectedPayment, setSelectedPayment] = useState<AdminPaymentInfo | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // RTK Query hook
  const { payments, pagination, isLoading, isFetching, isError, error } = useAdminPayments({
    filters,
    page,
    limit: 20,
    enabled: !!session?.user && session.user.role === 'ADMIN',
  })

  // Authentication redirect
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/auth/signin')
    }
    if (!isPending && session?.user?.role && session.user.role !== 'ADMIN') {
      router.push('/admin/dashboard/overview')
    }
  }, [session, isPending, router])

  // Event handlers
  const handleViewDetails = useCallback((payment: AdminPaymentInfo) => {
    setSelectedPayment(payment)
    setShowDetailModal(true)
  }, [])

  const handleFiltersChange = useCallback((newFilters: Partial<PaymentFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPage(1) // Reset to first page when filters change
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  // Loading state
  if (isPending) {
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

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">데이터를 불러오는데 실패했습니다</p>
          <p className="text-muted-foreground text-sm">
            {(error as Error)?.message || '잠시 후 다시 시도해주세요'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <PageHeader title="결제 이력" description="플랫폼의 모든 결제 내역을 조회하고 관리하세요">
          <div className="flex items-center gap-2">
            <CreditCard className="text-primary h-5 w-5" />
          </div>
        </PageHeader>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Filters */}
          <PaymentFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            totalCount={pagination.totalCount}
          />

          {/* Payments Table */}
          <PaymentsTable
            payments={payments}
            isLoading={isLoading || isFetching}
            onViewDetails={handleViewDetails}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />

          {/* Detail Modal */}
          {selectedPayment && (
            <PaymentDetailModal
              payment={selectedPayment}
              open={showDetailModal}
              onOpenChange={setShowDetailModal}
            />
          )}
        </div>
      </main>
    </div>
  )
}
