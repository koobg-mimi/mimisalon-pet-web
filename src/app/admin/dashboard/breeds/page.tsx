'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { PawPrint } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useGetBreedsQuery } from '@/features/admin/state/breeds-api-slice'
import { BreedInputForm } from '@/features/admin/components/breeds/breed-input-form'
import { BreedList } from '@/features/admin/components/breeds/breed-list'
import { BreedStats } from '@/features/admin/components/breeds/breed-stats'

export default function AdminBreedsPage() {
  // Authentication
  const { data: session, isPending } = useSession()
  const router = useRouter()

  // State for pet type and category (lifted state for child components)
  const [selectedPetType, setSelectedPetType] = useState<'DOG' | 'CAT'>('DOG')
  const [selectedCategory, setSelectedCategory] = useState<string>('SMALL')

  // Fetch breeds using hook
  const { data: breeds = [], isLoading } = useGetBreedsQuery()

  // Auth redirect effect
  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
    if (session?.user?.role && session.user.role !== 'ADMIN') {
      router.push('/admin/dashboard/overview')
    }
  }, [session, router])

  // Loading state
  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Auth guard
  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  // Render - compose feature components
  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <PageHeader title="품종 관리" description="반려동물 품종을 일괄 등록 및 수정할 수 있습니다">
          <div className="flex items-center gap-2">
            <PawPrint className="text-primary h-5 w-5" />
          </div>
        </PageHeader>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <BreedInputForm
            selectedPetType={selectedPetType}
            selectedCategory={selectedCategory}
            onPetTypeChange={setSelectedPetType}
            onCategoryChange={setSelectedCategory}
          />

          <BreedList
            breeds={breeds}
            selectedPetType={selectedPetType}
            selectedCategory={selectedCategory}
          />
        </div>

        <BreedStats breeds={breeds} />
      </main>
    </div>
  )
}
