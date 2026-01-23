'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DollarSign, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import Link from 'next/link'

interface Settlement {
  id: string
  groomerId: string
  period: string
  totalBookings: number
  totalRevenue: number
  commission: number
  netAmount: number
  status: 'PENDING' | 'CALCULATED' | 'PAID' | 'FAILED' | 'CANCELLED'
  calculatedAt: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
  groomer?: {
    name: string
    email: string
    commissionRate: number
    bankName: string | null
    bankAccountNumber: string | null
    bankAccountHolderName: string | null
  }
  bookings?: Array<{
    id: string
    bookingCode: string
    totalAmount: number
    completedAt: string
    service?: {
      name: string
    }
  }>
}

interface SettlementsResponse {
  settlements: Settlement[]
  totalCount: number
  totalPages: number
  currentPage: number
  summary: {
    totalPendingAmount: number
    totalPaidAmount: number
    totalCommission: number
    pendingCount: number
  }
}

export default function AdminSettlementManagementPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | Settlement['status']>('ALL')
  const [periodFilter, setPeriodFilter] = useState('')
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null)
  const [selectedSettlements, setSelectedSettlements] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
    if (session?.user?.role && session.user.role !== 'ADMIN') {
      router.push('/admin/dashboard/overview')
    }
  }, [session, router])

  // Fetch settlements with React Query
  const {
    data: settlementsData,
    isLoading,
    error,
  } = useQuery<SettlementsResponse>({
    queryKey: ['settlements', currentPage, searchQuery, statusFilter, periodFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchQuery,
        status: statusFilter,
        period: periodFilter,
      })

      const response = await fetch(`/api/admin/settlements?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch settlements')
      }
      return response.json()
    },
    enabled: session?.user?.role === 'ADMIN',
  })

  const settlements = settlementsData?.settlements ?? []
  const totalPages = settlementsData?.totalPages ?? 1
  const totalCount = settlementsData?.totalCount ?? 0
  const summary = settlementsData?.summary ?? {
    totalPendingAmount: 0,
    totalPaidAmount: 0,
    totalCommission: 0,
    pendingCount: 0,
  }

  // Bulk payment mutation
  const bulkPaymentMutation = useMutation({
    mutationFn: async (settlementIds: string[]) => {
      const promises = settlementIds.map((id) =>
        fetch(`/api/admin/settlements/${id}/pay`, {
          method: 'PATCH',
        })
      )
      const results = await Promise.all(promises)
      return results.filter((r) => r.ok).length
    },
    onSuccess: (successCount, settlementIds) => {
      alert(`✅ ${successCount}건의 정산이 지급 처리되었습니다.`)
      queryClient.invalidateQueries({ queryKey: ['settlements'] })
      setSelectedSettlements(new Set())
    },
    onError: (error) => {
      console.error('Failed to process bulk payment:', error)
      alert('❌ 지급 처리 중 오류가 발생했습니다.')
    },
  })

  const handleToggleSelectAll = () => {
    if (selectedSettlements.size === settlements.length) {
      setSelectedSettlements(new Set())
    } else {
      setSelectedSettlements(new Set(settlements.map((s) => s.id)))
    }
  }

  const handleToggleSelect = (settlementId: string) => {
    const newSelected = new Set(selectedSettlements)
    if (newSelected.has(settlementId)) {
      newSelected.delete(settlementId)
    } else {
      newSelected.add(settlementId)
    }
    setSelectedSettlements(newSelected)
  }

  const handleBulkPayment = () => {
    if (selectedSettlements.size === 0) {
      alert('지급할 정산을 선택해주세요.')
      return
    }

    const confirmPay = confirm(
      `선택된 ${selectedSettlements.size}건의 정산을 지급 처리하시겠습니까?`
    )

    if (!confirmPay) return

    bulkPaymentMutation.mutate(Array.from(selectedSettlements))
  }

  // Settlement action mutation (calculate, pay)
  const settlementActionMutation = useMutation({
    mutationFn: async ({
      settlementId,
      action,
    }: {
      settlementId: string
      action: 'calculate' | 'pay'
    }) => {
      const response = await fetch(`/api/admin/settlements/${settlementId}/${action}`, {
        method: 'PATCH',
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} settlement`)
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] })
      setSelectedSettlement(null)
    },
    onError: (error: Error) => {
      console.error('Settlement action failed:', error)
      alert(`❌ ${error.message}`)
    },
  })

  // Weekly settlement creation mutation
  const weeklySettlementMutation = useMutation({
    mutationFn: async (weekOffset: number) => {
      const response = await fetch('/api/admin/settlements/create-weekly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ weekOffset }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '정산 생성 중 오류가 발생했습니다.')
      }

      return result
    },
    onSuccess: (result) => {
      alert(
        `✅ ${result.message}\n\n` +
          `📊 정산 요약:\n` +
          `- 총 미용사: ${result.summary.totalGroomers}명\n` +
          `- 생성된 정산: ${result.summary.totalCreated}건\n` +
          `- 총 정산액: ${result.summary.totalAmount.toLocaleString('ko-KR')}원\n` +
          `${result.summary.failed > 0 ? `- 실패: ${result.summary.failed}건` : ''}`
      )
      queryClient.invalidateQueries({ queryKey: ['settlements'] })
    },
    onError: (error: Error, variables, context) => {
      alert(`❌ ${error.message}`)
    },
  })

  const handleBulkCalculation = () => {
    const confirmCreate = confirm(
      '지난주 정산을 생성하시겠습니까?\n' + '완료된 예약을 기준으로 미용사 수수료가 계산됩니다.'
    )

    if (!confirmCreate) return

    weeklySettlementMutation.mutate(1) // 지난주 정산
  }

  const getStatusBadgeColor = (status: Settlement['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700'
      case 'CALCULATED':
        return 'bg-blue-100 text-blue-700'
      case 'PAID':
        return 'bg-green-100 text-green-700'
      case 'FAILED':
        return 'bg-red-100 text-red-700'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusDisplayName = (status: Settlement['status']) => {
    switch (status) {
      case 'PENDING':
        return '대기중'
      case 'CALCULATED':
        return '계산됨'
      case 'PAID':
        return '지급완료'
      case 'FAILED':
        return '실패'
      case 'CANCELLED':
        return '취소'
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd', { locale: ko })
  }

  const formatPeriod = (period: string) => {
    // Handle ISO week format: "2024-W39"
    if (period.includes('W')) {
      const [year, week] = period.split('-W')
      return `${year}년 ${week}주차`
    }
    // Fallback for month format: "2024-09"
    const [year, month] = period.split('-')
    return `${year}년 ${month}월`
  }

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Calculator className="text-primary h-6 w-6" />
                <h1 className="text-foreground text-3xl font-bold">정산 관리</h1>
              </div>
              <p className="text-muted-foreground">수익과 미용사 정산을 관리하세요</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleBulkCalculation} disabled={weeklySettlementMutation.isPending}>
                <Calculator className="mr-2 h-4 w-4" />
                주간 정산 생성
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/dashboard/settlement/grades">등급 설정</Link>
              </Button>
              <span className="text-muted-foreground text-sm">
                총 {totalCount.toLocaleString('ko-KR')}건
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Bulk Action Bar */}
        {selectedSettlements.size > 0 && (
          <div className="border-border bg-primary/5 mb-4 flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">{selectedSettlements.size}건 선택됨</span>
            </div>
            <Button onClick={handleBulkPayment} disabled={bulkPaymentMutation.isPending}>
              <DollarSign className="mr-2 h-4 w-4" />
              지급처리완료
            </Button>
          </div>
        )}

        {/* Settlement Management Table */}
        <div className="border-border bg-card rounded-lg border">
          <div className="border-border border-b p-6">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="미용사명, 이메일로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-input bg-background focus:ring-ring w-full rounded-md border px-4 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                >
                  <option value="ALL">모든 상태</option>
                  <option value="PENDING">대기중</option>
                  <option value="CALCULATED">계산됨</option>
                  <option value="PAID">지급완료</option>
                  <option value="FAILED">실패</option>
                  <option value="CANCELLED">취소</option>
                </select>
                <input
                  type="month"
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={
                      settlements.length > 0 && selectedSettlements.size === settlements.length
                    }
                    onChange={handleToggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>정산 기간</TableHead>
                <TableHead>미용사</TableHead>
                <TableHead>계좌정보</TableHead>
                <TableHead className="text-right">수수료</TableHead>
                <TableHead className="text-right">정산금액</TableHead>
                <TableHead className="text-center">서비스 건수</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settlements.map((settlement) => (
                <TableRow key={settlement.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedSettlements.has(settlement.id)}
                      onChange={() => handleToggleSelect(settlement.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{formatPeriod(settlement.period)}</span>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{settlement.groomer?.name || '알 수 없음'}</p>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {settlement.groomer?.bankName && settlement.groomer?.bankAccountNumber ? (
                        <>
                          <p className="font-medium">{settlement.groomer.bankName}</p>
                          <p className="text-muted-foreground">
                            {settlement.groomer.bankAccountNumber}
                          </p>
                        </>
                      ) : (
                        <p className="text-muted-foreground">계좌 미등록</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-sm">
                      <p className="text-muted-foreground">
                        {settlement.groomer?.commissionRate || 0}%
                      </p>
                      <p className="font-medium text-red-600">
                        {settlement.commission.toLocaleString('ko-KR')}원
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <p className="text-primary font-bold">
                      {settlement.netAmount.toLocaleString('ko-KR')}원
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-medium">{settlement.totalBookings}건</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="border-border border-t p-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(page)
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }
                    return null
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>

      {/* Settlement Detail Modal */}
      {selectedSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border-border max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border">
            <div className="border-border flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-semibold">정산 상세 정보</h2>
              <Button variant="outline" size="sm" onClick={() => setSelectedSettlement(null)}>
                닫기
              </Button>
            </div>
            <div className="space-y-6 p-6">
              <div>
                <h3 className="mb-3 font-semibold">기본 정보</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">미용사:</span>
                    <p>{selectedSettlement.groomer?.name || '알 수 없음'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">이메일:</span>
                    <p>{selectedSettlement.groomer?.email || '알 수 없음'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">정산 기간:</span>
                    <p>{formatPeriod(selectedSettlement.period)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">상태:</span>
                    <p>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getStatusBadgeColor(selectedSettlement.status)}`}
                      >
                        {getStatusDisplayName(selectedSettlement.status)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">계좌 정보</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">은행:</span>
                    <p>{selectedSettlement.groomer?.bankName || '미등록'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">계좌번호:</span>
                    <p>{selectedSettlement.groomer?.bankAccountNumber || '미등록'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">예금주:</span>
                    <p>{selectedSettlement.groomer?.bankAccountHolderName || '미등록'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">정산 내역</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">총 예약:</span>
                    <p className="font-medium">{selectedSettlement.totalBookings}건</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">총 매출:</span>
                    <p className="font-medium">
                      {selectedSettlement.totalRevenue.toLocaleString('ko-KR')}원
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">수수료율:</span>
                    <p className="font-medium">
                      {selectedSettlement.groomer?.commissionRate || 0}%
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">수수료:</span>
                    <p className="font-medium text-red-600">
                      {selectedSettlement.commission.toLocaleString('ko-KR')}원
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">최종 정산액:</span>
                    <p className="text-primary text-lg font-bold">
                      {selectedSettlement.netAmount.toLocaleString('ko-KR')}원
                    </p>
                  </div>
                </div>
              </div>

              {selectedSettlement.bookings && selectedSettlement.bookings.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold">포함된 예약</h3>
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-border border-b">
                          <th className="p-2 text-left">예약코드</th>
                          <th className="p-2 text-left">서비스</th>
                          <th className="p-2 text-left">완료일</th>
                          <th className="p-2 text-right">금액</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedSettlement.bookings.map((booking) => (
                          <tr key={booking.id} className="border-border border-b">
                            <td className="p-2">#{booking.bookingCode}</td>
                            <td className="p-2">{booking.service?.name || '알 수 없음'}</td>
                            <td className="p-2">{formatDate(booking.completedAt)}</td>
                            <td className="p-2 text-right font-medium">
                              {booking.totalAmount.toLocaleString('ko-KR')}원
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-3 font-semibold">처리 이력</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>생성일:</span>
                    <span>{formatDate(selectedSettlement.createdAt)}</span>
                  </div>
                  {selectedSettlement.calculatedAt && (
                    <div className="flex justify-between">
                      <span>계산일:</span>
                      <span>{formatDate(selectedSettlement.calculatedAt)}</span>
                    </div>
                  )}
                  {selectedSettlement.paidAt && (
                    <div className="flex justify-between">
                      <span>지급일:</span>
                      <span>{formatDate(selectedSettlement.paidAt)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>최종 수정:</span>
                    <span>{formatDate(selectedSettlement.updatedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="border-border flex gap-2 border-t pt-4">
                {selectedSettlement.status === 'PENDING' && (
                  <Button
                    onClick={() =>
                      settlementActionMutation.mutate({
                        settlementId: selectedSettlement.id,
                        action: 'calculate',
                      })
                    }
                    disabled={settlementActionMutation.isPending}
                  >
                    정산 계산
                  </Button>
                )}
                {selectedSettlement.status === 'CALCULATED' && (
                  <Button
                    onClick={() =>
                      settlementActionMutation.mutate({
                        settlementId: selectedSettlement.id,
                        action: 'pay',
                      })
                    }
                    disabled={settlementActionMutation.isPending}
                  >
                    정산 지급
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
