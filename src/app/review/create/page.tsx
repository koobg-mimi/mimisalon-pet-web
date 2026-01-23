'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface BookingInfo {
  id: string
  service: {
    name: string
    price: number
  }
  pet: {
    name: string
    breed: string // API returns breed name as string
  }
  groomer: {
    id: string
    name: string
  }
  location: {
    name: string
  }
  date: string
  time: string
  status: string
}

interface ReviewForm {
  rating: number
  content: string
  serviceQuality: number
  communication: number
  timeliness: number
  cleanliness: number
}

export default function CreateReviewPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const [formData, setFormData] = useState<ReviewForm>({
    rating: 0,
    content: '',
    serviceQuality: 0,
    communication: 0,
    timeliness: 0,
    cleanliness: 0,
  })

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
    if (session?.user?.role && session.user.role !== 'CUSTOMER') {
      router.push('/dashboard')
    }
  }, [session, router])

  // Fetch booking details using React Query
  const { data: booking, isLoading } = useQuery<BookingInfo>({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/${bookingId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch booking')
      }
      const data = await response.json()

      if (data.status !== 'COMPLETED') {
        router.push('/customer/bookings')
        throw new Error('Booking not completed')
      }

      return data
    },
    enabled: !!bookingId && !!session?.user && session.user.role === 'CUSTOMER',
    retry: false,
  })

  useEffect(() => {
    if (!bookingId) {
      router.push('/customer/bookings')
    }
  }, [bookingId, router])

  const handleRatingChange = (field: keyof ReviewForm, rating: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: rating,
    }))
  }

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }))
  }

  // Submit review using React Query mutation
  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          groomerId: booking?.groomer.id,
          rating: formData.rating,
          content: formData.content,
          serviceQuality: formData.serviceQuality,
          communication: formData.communication,
          timeliness: formData.timeliness,
          cleanliness: formData.cleanliness,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '리뷰 작성 중 오류가 발생했습니다.')
      }

      return response.json()
    },
    onSuccess: () => {
      router.push('/customer/dashboard/reviews?success=true')
    },
    onError: (error: Error) => {
      console.error('Failed to create review:', error)
      alert(error.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.rating === 0) {
      alert('별점을 선택해주세요.')
      return
    }

    if (formData.content.trim().length < 10) {
      alert('리뷰 내용을 10자 이상 입력해주세요.')
      return
    }

    submitReviewMutation.mutate()
  }

  const renderStars = (
    rating: number,
    onRatingChange?: (rating: number) => void,
    size: 'sm' | 'lg' = 'sm'
  ) => {
    const starSize = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5'

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange?.(star)}
            disabled={!onRatingChange}
            className={`${starSize} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } ${onRatingChange ? 'cursor-pointer hover:text-yellow-300' : ''} transition-colors`}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    )
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return '매우 불만족'
      case 2:
        return '불만족'
      case 3:
        return '보통'
      case 4:
        return '만족'
      case 5:
        return '매우 만족'
      default:
        return '평가해주세요'
    }
  }

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'CUSTOMER' || !booking) {
    return null
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-foreground text-2xl font-bold">리뷰 작성</h1>
          <p className="text-muted-foreground text-sm">서비스에 대한 솔직한 후기를 남겨주세요</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="border-border bg-card mb-6 rounded-lg border p-6">
            <h2 className="mb-4 text-lg font-semibold">서비스 정보</h2>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div>
                <p>
                  <span className="font-medium">서비스:</span> {booking.service.name}
                </p>
                <p>
                  <span className="font-medium">반려동물:</span> {booking.pet.name} (
                  {booking.pet.breed})
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">미용사:</span> {booking.groomer.name}
                </p>
                <p>
                  <span className="font-medium">지점:</span> {booking.location.name}
                </p>
              </div>
              <div className="md:col-span-2">
                <p>
                  <span className="font-medium">이용일:</span> {booking.date} {booking.time}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-border bg-card rounded-lg border p-6">
              <h2 className="mb-6 text-lg font-semibold">전체 평가</h2>

              <div className="mb-6 text-center">
                <div className="mb-4">
                  {renderStars(
                    formData.rating,
                    (rating) => handleRatingChange('rating', rating),
                    'lg'
                  )}
                </div>
                <p className="text-foreground text-lg font-medium">
                  {getRatingText(formData.rating)}
                </p>
              </div>
            </div>

            <div className="border-border bg-card rounded-lg border p-6">
              <h2 className="mb-6 text-lg font-semibold">세부 평가</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">서비스 품질</span>
                  <div className="flex items-center gap-2">
                    {renderStars(formData.serviceQuality, (rating) =>
                      handleRatingChange('serviceQuality', rating)
                    )}
                    <span className="text-muted-foreground w-16 text-sm">
                      {formData.serviceQuality > 0 ? `${formData.serviceQuality}점` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">소통</span>
                  <div className="flex items-center gap-2">
                    {renderStars(formData.communication, (rating) =>
                      handleRatingChange('communication', rating)
                    )}
                    <span className="text-muted-foreground w-16 text-sm">
                      {formData.communication > 0 ? `${formData.communication}점` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">시간 준수</span>
                  <div className="flex items-center gap-2">
                    {renderStars(formData.timeliness, (rating) =>
                      handleRatingChange('timeliness', rating)
                    )}
                    <span className="text-muted-foreground w-16 text-sm">
                      {formData.timeliness > 0 ? `${formData.timeliness}점` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">청결도</span>
                  <div className="flex items-center gap-2">
                    {renderStars(formData.cleanliness, (rating) =>
                      handleRatingChange('cleanliness', rating)
                    )}
                    <span className="text-muted-foreground w-16 text-sm">
                      {formData.cleanliness > 0 ? `${formData.cleanliness}점` : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-border bg-card rounded-lg border p-6">
              <h2 className="mb-4 text-lg font-semibold">리뷰 작성</h2>
              <textarea
                value={formData.content}
                onChange={(e) => handleContentChange(e.target.value)}
                rows={6}
                placeholder="서비스에 대한 솔직한 후기를 작성해주세요. (최소 10자 이상)"
                className="border-input bg-background focus:ring-ring w-full resize-none rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none"
                required
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-muted-foreground text-xs">최소 10자 이상 작성해주세요</span>
                <span className="text-muted-foreground text-xs">{formData.content.length}/500</span>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/customer/bookings')}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={
                  submitReviewMutation.isPending ||
                  formData.rating === 0 ||
                  formData.content.trim().length < 10
                }
              >
                {submitReviewMutation.isPending ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : null}
                리뷰 등록
              </Button>
            </div>
          </form>

          <div className="mt-8 rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">리뷰 작성 안내</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• 솔직하고 구체적인 후기를 작성해주세요</li>
              <li>• 다른 고객들에게 도움이 되는 정보를 포함해주세요</li>
              <li>• 욕설이나 비방은 삭제될 수 있습니다</li>
              <li>• 리뷰 작성 시 포인트를 적립해드립니다</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
