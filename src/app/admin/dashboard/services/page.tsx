'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Settings } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AdminStatsCards } from '@/components/admin/AdminStatsCards'
import { ServiceCard, Service } from '@/components/admin/ServiceCard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlusIcon, SearchIcon, AlertCircleIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function AdminDashboardServicesPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
    if (session?.user?.role && session.user.role !== 'ADMIN') {
      router.push('/admin/dashboard/overview')
    }
  }, [session, router])

  // 서비스 목록 조회
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['admin', 'services'],
    queryFn: async () => {
      const response = await fetch('/api/admin/services')
      if (!response.ok) {
        throw new Error('서비스 목록을 불러올 수 없습니다')
      }
      return response.json()
    },
    enabled: !!session?.user && session.user.role === 'ADMIN',
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // 필터링된 서비스 목록
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && service.isActive) ||
      (statusFilter === 'INACTIVE' && !service.isActive)

    return matchesSearch && matchesStatus
  })

  // 서비스 상태 토글 mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ serviceId, isActive }: { serviceId: string; isActive: boolean }) => {
      const response = await fetch(`/api/admin/services/${serviceId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (!response.ok) {
        throw new Error('상태 변경에 실패했습니다')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : '오류가 발생했습니다')
    },
  })

  // 서비스 삭제 mutation
  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('서비스 삭제에 실패했습니다')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : '오류가 발생했습니다')
    },
  })

  const handleEditService = (service: Service) => {
    router.push(`/admin/dashboard/services/${service.id}/edit`)
  }

  const handleToggleStatus = (serviceId: string, isActive: boolean) => {
    toggleStatusMutation.mutate({ serviceId, isActive })
  }

  const handleDeleteService = (serviceId: string) => {
    if (!confirm('정말로 이 서비스를 삭제하시겠습니까?')) {
      return
    }
    deleteServiceMutation.mutate(serviceId)
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
        <PageHeader title="서비스 관리" description="미용 서비스를 생성, 수정, 관리할 수 있습니다">
          <div className="flex items-center gap-2">
            <Settings className="text-primary h-5 w-5" />
          </div>
        </PageHeader>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Statistics Cards */}
          <AdminStatsCards variant="services" />

          {/* Action button */}
          <div className="flex justify-end">
            <Button onClick={() => router.push('/admin/dashboard/services/new')}>
              <PlusIcon className="mr-2 h-4 w-4" />
              서비스 추가
            </Button>
          </div>

          {/* 필터 및 검색 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    placeholder="서비스명 또는 설명으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">모든 상태</SelectItem>
                    <SelectItem value="ACTIVE">활성</SelectItem>
                    <SelectItem value="INACTIVE">비활성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 서비스 목록 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={handleEditService}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteService}
              />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4 text-center">
                  <AlertCircleIcon className="text-muted-foreground mx-auto h-12 w-12" />
                  <h3 className="text-lg font-semibold">서비스가 없습니다</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'ALL'
                      ? '검색 조건에 맞는 서비스가 없습니다.'
                      : '첫 번째 서비스를 추가해보세요.'}
                  </p>
                  {!searchTerm && statusFilter === 'ALL' && (
                    <Button onClick={() => router.push('/admin/dashboard/services/new')}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      서비스 추가
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
