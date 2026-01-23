'use client'

import { useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  StarIcon,
  CameraIcon,
  XIcon,
  UserIcon,
  ScissorsIcon,
  CalendarIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  FolderOpen,
} from 'lucide-react'

// API에서 반환되는 예약 타입 (route.ts의 response 형태와 일치)
interface BookingResponse {
  id: string
  appointmentDate: string
  startTime: string
  endTime: string
  status: string
  totalAmount: number
  paidAmount: number
  additionalAmount: number | null
  paymentStatus: 'PENDING' | 'PAID'
  pet: {
    id: string
    name: string
    species: string
    breed: string // API returns breed name as string
    weight: number
    age: number | null
    photoUrl: string | null
  }
  services: Array<{
    id: string
    name: string
    description: string
    duration: number
    price: number
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  }>
  groomer: {
    id: string
    name: string
    photoUrl: string | null
    rating: number
    experience: string | null
    phone: string
    salon: {
      id: string
      name: string
      address: string
      phone: string
    }
  }
  timeline: Array<{
    id: string
    type: string
    title: string
    description: string
    timestamp: string
  }>
  notes: string | null
  estimatedEndTime: string
}

interface ImageFile {
  file: File
  preview: string
}

// 타입 정의는 이미 위에서 완료됨

export default function CreateReviewPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get('bookingId')

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [images, setImages] = useState<ImageFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Fetch booking details using React Query
  const { data: booking, isLoading } = useQuery<BookingResponse>({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const response = await fetch(`/api/customer/booking/${bookingId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch booking')
      }
      const data: BookingResponse = await response.json()

      // 서비스 완료 상태가 아니면 리뷰 작성 불가
      if (data.status !== 'SERVICE_COMPLETED') {
        router.push(`/customer/booking/${bookingId}`)
        throw new Error('Booking not completed')
      }

      return data
    },
    enabled: !!bookingId,
    retry: false,
  })

  // Submit review using React Query mutation (must be called before any conditional returns)
  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData()
      formData.append('bookingId', bookingId!)
      formData.append('rating', rating.toString())
      formData.append('comment', comment)

      // 이미지 파일들 추가
      images.forEach((img) => {
        formData.append('images', img.file)
      })

      const response = await fetch('/api/customer/reviews', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit review')
      }

      return response.json()
    },
    onSuccess: () => {
      router.push(`/customer/booking/${bookingId}?reviewSubmitted=true`)
    },
    onError: (error) => {
      console.error('Error submitting review:', error)
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.')
    },
  })

  if (!bookingId) {
    router.push('/customer/dashboard/overview')
    return null
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return

    const newImages: ImageFile[] = []
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name}은(는) 지원하지 않는 파일 형식입니다. JPG, PNG, WEBP, GIF만 가능합니다.`)
        return
      }
      if (file.size > maxSize) {
        alert(`${file.name}은(는) 파일 크기가 너무 큽니다. 5MB 이하만 가능합니다.`)
        return
      }
      if (images.length + newImages.length >= 5) {
        alert('최대 5장까지만 업로드 가능합니다.')
        return
      }

      const preview = URL.createObjectURL(file)
      newImages.push({ file, preview })
    })

    setImages((prev) => [...prev, ...newImages])

    // Reset file inputs
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const handleSubmit = () => {
    if (rating === 0) {
      alert('별점을 선택해주세요.')
      return
    }
    if (!comment.trim()) {
      alert('리뷰 내용을 입력해주세요.')
      return
    }

    submitReviewMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <LoadingSpinner size="lg" />
              <p className="text-muted-foreground">정보를 불러오는 중...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!booking) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* 헤더 */}
        <div className="mb-6 flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.push(`/customer/booking/${bookingId}`)}
            className="p-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">리뷰 작성</h1>
            <p className="text-muted-foreground">서비스는 어떠셨나요?</p>
          </div>
        </div>

        {/* 예약 정보 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">서비스 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {booking.groomer.photoUrl ? (
                  <Image
                    src={booking.groomer.photoUrl}
                    alt={booking.groomer.name || '미용사'}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                    <UserIcon className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">{booking.groomer.name} 미용사</p>
                  <p className="text-muted-foreground text-sm">{booking.groomer.salon.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <CalendarIcon className="text-muted-foreground h-4 w-4" />
                <span>
                  {booking.appointmentDate} {booking.startTime}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <ScissorsIcon className="text-muted-foreground h-4 w-4" />
                <div className="flex flex-wrap gap-1">
                  {booking.services.map((service) => (
                    <Badge key={service.id} variant="secondary">
                      {service.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <UserIcon className="text-muted-foreground h-4 w-4" />
                <span>
                  {booking.pet.name} ({booking.pet.breed})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 별점 선택 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">서비스 만족도</CardTitle>
            <CardDescription>전반적인 서비스는 어떠셨나요?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 transition-colors"
                >
                  <StarIcon
                    className={`h-10 w-10 ${
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    } transition-colors hover:fill-yellow-400 hover:text-yellow-400`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-4 text-center text-lg font-medium">
                {rating === 5 && '매우 만족'}
                {rating === 4 && '만족'}
                {rating === 3 && '보통'}
                {rating === 2 && '불만족'}
                {rating === 1 && '매우 불만족'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* 리뷰 내용 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">상세 리뷰</CardTitle>
            <CardDescription>어떤 점이 좋았나요? 개선점이 있다면 알려주세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="미용 서비스에 대한 솔직한 리뷰를 작성해주세요..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px]"
            />
            <p className="text-muted-foreground mt-2 text-sm">{comment.length}/500자</p>
          </CardContent>
        </Card>

        {/* 사진 업로드 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">사진 첨부</CardTitle>
            <CardDescription>미용 전후 사진을 공유해주세요 (최대 5장)</CardDescription>
          </CardHeader>
          <CardContent>
            {/* 업로드된 이미지 미리보기 */}
            {images.length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={img.preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="rounded-lg object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 업로드 버튼 영역 */}
            {images.length < 5 && (
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
                    JPG, PNG, WEBP (최대 5MB) • {images.length}/5 이미지
                  </p>
                </div>

                <div className="flex justify-center gap-3">
                  {/* 파일 선택 버튼 */}
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-12 max-w-[160px] flex-1"
                  >
                    <FolderOpen className="mr-2 h-5 w-5" />
                    사진 선택
                  </Button>

                  {/* 카메라 버튼 */}
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => cameraInputRef.current?.click()}
                    className="h-12 max-w-[160px] flex-1"
                  >
                    <CameraIcon className="mr-2 h-5 w-5" />
                    카메라 촬영
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* 제출 버튼 */}
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/customer/booking/${bookingId}`)}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitReviewMutation.isPending || rating === 0 || !comment.trim()}
            className="flex-1"
          >
            {submitReviewMutation.isPending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                등록 중...
              </>
            ) : (
              <>
                <CheckCircleIcon className="mr-2 h-4 w-4" />
                리뷰 등록
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
