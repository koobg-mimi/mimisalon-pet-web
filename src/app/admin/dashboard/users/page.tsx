'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Users } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { PageHeader } from '@/components/layout/PageHeader'
import { AdminStatsCards } from '@/components/admin/AdminStatsCards'
import { AdminUserTable } from '@/components/table/AdminUserTable'

export default function AdminDashboardUsersPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  // Authentication and authorization check
  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
    if (session?.user?.role && session.user.role !== 'ADMIN') {
      router.push('/admin/dashboard/overview')
    }
  }, [session, router])

  if (isPending) {
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
        <PageHeader title="사용자 관리" description="플랫폼 사용자를 관리하고 모니터링하세요">
          <div className="flex items-center gap-2">
            <Users className="text-primary h-5 w-5" />
          </div>
        </PageHeader>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Statistics Cards */}
          <AdminStatsCards variant="users" />

          {/* User Management Table */}
          <AdminUserTable />
        </div>
      </main>
    </div>
  )
}
