'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { PageHeader } from '@/components/layout/PageHeader'
import { PetCard } from '@/components/pets/PetCard'
import { PetModal } from '@/components/pets/PetModal'
import { usePets, Pet, PetFormData } from '@/hooks/usePets'
import { Plus, PawPrint } from 'lucide-react'
import { toast } from 'sonner'

export default function CustomerPetsPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const { pets, isLoading, createPet, updatePet, deletePet, fetchPets } = usePets()

  // Modal states
  const [isPetModalOpen, setIsPetModalOpen] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | undefined>()
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
    if (session?.user?.role && session.user.role !== 'CUSTOMER') {
      router.push('/dashboard')
    }
  }, [session, router])

  const handleAddPet = () => {
    setSelectedPet(undefined)
    setModalMode('create')
    setIsPetModalOpen(true)
  }

  const handleEditPet = (pet: Pet) => {
    setSelectedPet(pet)
    setModalMode('edit')
    setIsPetModalOpen(true)
  }

  const handleSavePet = async (petData: PetFormData & { images?: File[] }) => {
    if (modalMode === 'edit' && selectedPet) {
      await updatePet(selectedPet.id, petData)
      // Refresh pets to show any updated information
      await fetchPets()
    } else {
      // Extract images from petData if present
      const { images, ...petInfo } = petData

      // Create the pet first
      const newPet = await createPet(petInfo)

      // If there are images, upload them
      if (images && images.length > 0 && newPet?.id) {
        try {
          const formData = new FormData()
          images.forEach((image: File) => {
            formData.append('files', image)
          })

          const response = await fetch(`/api/customer/pets/${newPet.id}/images`, {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            console.error('Failed to upload images')
            toast.error('이미지 업로드에 실패했습니다')
          } else {
            toast.success(`${images.length}개의 이미지가 업로드되었습니다`)
            // Refresh pets to show the new images
            await fetchPets()
          }
        } catch (error) {
          console.error('Error uploading images:', error)
        }
      }
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'CUSTOMER') {
    return null
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <PageHeader
          title="내 반려동물"
          description="반려동물 정보를 관리하고 예약 시 선택할 수 있습니다"
        >
          <Button onClick={handleAddPet}>
            <Plus className="mr-2 h-4 w-4" />
            반려동물 추가
          </Button>
        </PageHeader>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : pets.length === 0 ? (
          <div className="mx-auto max-w-md">
            <div className="border-border rounded-lg border-2 border-dashed p-12 text-center">
              <PawPrint className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
              <h2 className="mb-2 text-xl font-semibold">등록된 반려동물이 없습니다</h2>
              <p className="text-muted-foreground mb-6">
                반려동물을 등록하고 미용 서비스를 예약해보세요
              </p>
              <Button onClick={handleAddPet} size="lg">
                <Plus className="mr-2 h-5 w-5" />첫 반려동물 등록하기
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} onEdit={handleEditPet} onDelete={deletePet} />
            ))}
          </div>
        )}

        {/* Statistics Section */}
        {pets.length > 0 && (
          <div className="bg-card border-border mt-12 rounded-lg border p-6">
            <h2 className="mb-4 text-lg font-semibold">반려동물 통계</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <p className="text-muted-foreground text-sm">총 반려동물</p>
                <p className="text-2xl font-bold">{pets.length}마리</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">강아지</p>
                <p className="text-2xl font-bold">
                  {pets.filter((p) => p.type === 'DOG').length}마리
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">고양이</p>
                <p className="text-2xl font-bold">
                  {pets.filter((p) => p.type === 'CAT').length}마리
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-muted/50 mt-8 rounded-lg p-6">
          <h3 className="mb-3 font-semibold">💡 알아두세요</h3>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li>• 반려동물 정보는 예약 시 미용사에게 전달됩니다</li>
            <li>• 예방접종 정보를 최신으로 유지해주세요</li>
            <li>• 특이사항은 미용 시 주의사항으로 활용됩니다</li>
            <li>• 정확한 체중 정보는 서비스 요금 산정에 도움이 됩니다</li>
          </ul>
        </div>
      </main>

      {/* Pet Modal */}
      <PetModal
        isOpen={isPetModalOpen}
        onClose={() => {
          setIsPetModalOpen(false)
          setSelectedPet(undefined)
        }}
        onSave={handleSavePet}
        pet={selectedPet}
        mode={modalMode}
        onImagesUpdated={fetchPets}
      />
    </div>
  )
}
