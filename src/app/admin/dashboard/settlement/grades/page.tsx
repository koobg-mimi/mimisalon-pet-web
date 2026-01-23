'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit, Plus, Settings, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AdminStatsCards } from '@/components/admin/AdminStatsCards'
import Link from 'next/link'
import type {
  CreateCommissionGradeResponse,
  FormattedCommissionGrade,
  GetCommissionGradesResponse,
} from '@/app/api/admin/commission-grades/route'
import type { UpdateCommissionGradeSuccessResponse } from '@/app/api/admin/commission-grades/[id]/route'
import type { CommissionGradeActionSuccessResponse } from '@/app/api/admin/commission-grades/[id]/[action]/route'

type CommissionGrade = FormattedCommissionGrade
type GradesResponse = GetCommissionGradesResponse

export default function AdminSettlementGradesPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')
  const [selectedGrade, setSelectedGrade] = useState<CommissionGrade | null>(null)
  const [editingGrade, setEditingGrade] = useState<CommissionGrade | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
    if (session?.user?.role && session.user.role !== 'ADMIN') {
      router.push('/admin/dashboard/overview')
    }
  }, [session, router])

  const { data: gradesData, isLoading } = useQuery<GetCommissionGradesResponse>({
    queryKey: ['admin', 'commission-grades', searchQuery, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: searchQuery,
        status: statusFilter,
      })

      const response = await fetch(`/api/admin/commission-grades?${params}`)
      if (!response.ok) throw new Error('Failed to fetch commission grades')
      return response.json() as Promise<GetCommissionGradesResponse>
    },
    enabled: !!session?.user && session.user.role === 'ADMIN',
  })

  const gradeActionMutation = useMutation<
    CommissionGradeActionSuccessResponse,
    Error,
    { gradeId: string; action: 'activate' | 'deactivate' | 'delete' }
  >({
    mutationFn: async ({
      gradeId,
      action,
    }: {
      gradeId: string
      action: 'activate' | 'deactivate' | 'delete'
    }) => {
      const response = await fetch(`/api/admin/commission-grades/${gradeId}/${action}`, {
        method: action === 'delete' ? 'DELETE' : 'PATCH',
      })
      if (!response.ok) throw new Error(`Failed to ${action} grade`)
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'commission-grades'] })
    },
    onError: (error, variables) => {
      console.error(`Failed to ${variables.action} grade:`, error)
    },
  })

  const saveGradeMutation = useMutation<
    UpdateCommissionGradeSuccessResponse | CreateCommissionGradeResponse,
    Error,
    { gradeData: Partial<CommissionGrade>; isEdit: boolean; gradeId?: string }
  >({
    mutationFn: async ({
      gradeData,
      isEdit,
      gradeId,
    }: {
      gradeData: Partial<CommissionGrade>
      isEdit: boolean
      gradeId?: string
    }) => {
      const url = isEdit
        ? `/api/admin/commission-grades/${gradeId}`
        : '/api/admin/commission-grades'
      const response = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gradeData),
      })
      if (!response.ok) throw new Error('Failed to save grade')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'commission-grades'] })
      setEditingGrade(null)
      setIsCreating(false)
    },
    onError: (error) => {
      console.error('Failed to save grade:', error)
    },
  })

  const handleGradeAction = (gradeId: string, action: 'activate' | 'deactivate' | 'delete') => {
    gradeActionMutation.mutate({ gradeId, action })
  }

  const handleGradeSubmit = (gradeData: Partial<CommissionGrade>) => {
    saveGradeMutation.mutate({
      gradeData,
      isEdit: !!editingGrade,
      gradeId: editingGrade?.id,
    })
  }

  const grades = gradesData?.grades || []

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd', { locale: ko })
  }

  const getCommissionColor = (rate: number) => {
    if (rate <= 10) return 'text-green-600'
    if (rate <= 15) return 'text-yellow-600'
    return 'text-red-600'
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
                <Settings className="text-primary h-6 w-6" />
                <h1 className="text-foreground text-3xl font-bold">정산 등급 설정</h1>
              </div>
              <p className="text-muted-foreground">미용사 수수료 등급을 관리하세요</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="mr-2 h-4 w-4" />새 등급
              </Button>
              <Button asChild>
                <Link href="/admin/dashboard/settlement/management">정산 관리</Link>
              </Button>
              <Button asChild>
                <Link href="/admin/dashboard/overview">대시보드</Link>
              </Button>
              <span className="text-muted-foreground text-sm">총 {grades.length}개</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <AdminStatsCards variant="settlements" />

        {/* Commission Grades Management */}
        <div className="border-border bg-card rounded-lg border">
          <div className="border-border border-b p-6">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="등급명, 설명으로 검색..."
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
                  <option value="ACTIVE">활성</option>
                  <option value="INACTIVE">비활성</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-border bg-muted/50 border-b">
                  <th className="p-4 text-left font-medium">등급명</th>
                  <th className="p-4 text-left font-medium">수수료율</th>
                  <th className="p-4 text-left font-medium">할당 방식</th>
                  <th className="p-4 text-left font-medium">적용 미용사</th>
                  <th className="p-4 text-left font-medium">상태</th>
                  <th className="p-4 text-left font-medium">생성일</th>
                  <th className="p-4 text-right font-medium">작업</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => (
                  <tr key={grade.id} className="border-border hover:bg-muted/30 border-b">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{grade.name}</p>
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {grade.description}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-lg font-bold ${getCommissionColor(grade.commissionRate)}`}
                      >
                        {grade.commissionRate}%
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="text-muted-foreground">수동 할당</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium">{grade.groomerCount || 0}명</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          grade.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {grade.isActive ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{formatDate(grade.createdAt)}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="outline" onClick={() => setSelectedGrade(grade)}>
                          상세
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingGrade(grade)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleGradeAction(grade.id, grade.isActive ? 'deactivate' : 'activate')
                          }
                          disabled={gradeActionMutation.isPending}
                        >
                          {grade.isActive ? '비활성' : '활성'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGradeAction(grade.id, 'delete')}
                          disabled={gradeActionMutation.isPending}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {grades.length === 0 && (
            <div className="text-muted-foreground p-8 text-center">
              등급이 없습니다. 새 등급을 생성해주세요.
            </div>
          )}
        </div>
      </main>

      {/* Grade Detail Modal */}
      {selectedGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border-border max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border">
            <div className="border-border flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-semibold">등급 상세 정보</h2>
              <Button variant="outline" size="sm" onClick={() => setSelectedGrade(null)}>
                닫기
              </Button>
            </div>
            <div className="space-y-6 p-6">
              <div>
                <h3 className="mb-3 font-semibold">기본 정보</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">등급명:</span>
                    <p>{selectedGrade.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">수수료율:</span>
                    <p className={`font-bold ${getCommissionColor(selectedGrade.commissionRate)}`}>
                      {selectedGrade.commissionRate}%
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">상태:</span>
                    <p>{selectedGrade.isActive ? '활성' : '비활성'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">적용 미용사:</span>
                    <p className="font-medium">{selectedGrade.groomerCount || 0}명</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">생성일:</span>
                    <p>{formatDate(selectedGrade.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">수정일:</span>
                    <p>{formatDate(selectedGrade.updatedAt)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">설명</h3>
                <p className="bg-muted rounded p-3 text-sm">{selectedGrade.description}</p>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">할당 방식</h3>
                <div className="bg-muted/30 rounded border p-3">
                  <p className="text-muted-foreground text-sm">관리자가 미용사별로 수동 할당</p>
                </div>
              </div>

              <div className="border-border flex gap-2 border-t pt-4">
                <Button onClick={() => setEditingGrade(selectedGrade)}>등급 수정</Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleGradeAction(
                      selectedGrade.id,
                      selectedGrade.isActive ? 'deactivate' : 'activate'
                    )
                  }
                  disabled={gradeActionMutation.isPending}
                >
                  {selectedGrade.isActive ? '비활성화' : '활성화'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grade Create/Edit Modal */}
      {(isCreating || editingGrade) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border-border max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border">
            <div className="border-border flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-semibold">
                {editingGrade ? '등급 수정' : '새 등급 생성'}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingGrade(null)
                  setIsCreating(false)
                }}
              >
                취소
              </Button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const gradeData = {
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  commissionRate: parseFloat(formData.get('commissionRate') as string),
                  isActive: formData.get('isActive') === 'true',
                }
                handleGradeSubmit(gradeData)
              }}
              className="space-y-6 p-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">등급명</label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={editingGrade?.name || ''}
                    className="border-input bg-background w-full rounded-md border px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">수수료율 (%)</label>
                  <input
                    name="commissionRate"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    defaultValue={editingGrade?.commissionRate || ''}
                    className="border-input bg-background w-full rounded-md border px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">설명</label>
                <textarea
                  name="description"
                  defaultValue={editingGrade?.description || ''}
                  rows={3}
                  className="border-input bg-background w-full rounded-md border px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">상태</label>
                <select
                  name="isActive"
                  defaultValue={editingGrade?.isActive?.toString() || 'true'}
                  className="border-input bg-background w-full rounded-md border px-3 py-2"
                >
                  <option value="true">활성</option>
                  <option value="false">비활성</option>
                </select>
              </div>

              <div className="border-border flex gap-2 border-t pt-4">
                <Button type="submit" disabled={saveGradeMutation.isPending}>
                  {editingGrade ? '수정 완료' : '등급 생성'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingGrade(null)
                    setIsCreating(false)
                  }}
                >
                  취소
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
