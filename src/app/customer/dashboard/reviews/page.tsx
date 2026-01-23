'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Review, ReviewImage } from '@mimisalon/shared'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageGallery } from '@/components/ui/image-gallery'
import { useConfirmationDialog } from '@/components/ui/confirmation-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  StarIcon,
  CalendarIcon,
  UserIcon,
  TrashIcon,
  ImageIcon,
  MessageSquareIcon,
  MoreVertical,
  Eye,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { StatsCard } from '@/components/stats/card'
import { StatsGrid } from '@/components/stats/grid'

// API 응답 타입
interface ReviewWithRelations extends Review {
  images: ReviewImage[]
  response: {
    id: string
    content: string
    createdAt: Date
  } | null
  booking: {
    id: string
    serviceDate: Date
    serviceType: string
    groomer: {
      id: string
      name: string | null
      image: string | null
    } | null
  }
}

// Skeleton component for loading states
function ReviewSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-gray-200" />
              <div>
                <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
                <div className="h-3 w-32 rounded bg-gray-200" />
              </div>
            </div>
          </div>
          <div className="mb-3 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-5 w-5 rounded bg-gray-200" />
            ))}
          </div>
          <div className="mb-4 h-16 rounded bg-gray-200" />
          <div className="grid grid-cols-2 gap-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="aspect-square rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CustomerReviewsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('all')
  const { ConfirmationDialogComponent, showConfirmation } = useConfirmationDialog()

  // Fetch reviews using React Query
  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
  } = useQuery<ReviewWithRelations[]>({
    queryKey: ['customer', 'reviews'],
    queryFn: async () => {
      const response = await fetch('/api/customer/reviews')
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }
      return response.json()
    },
  })

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const response = await fetch(`/api/customer/reviews/${reviewId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete review')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'reviews'] })
    },
  })

  const handleDeleteReview = async (reviewId: string) => {
    await showConfirmation({
      title: '리뷰 삭제',
      description: '이 리뷰를 삭제하시겠습니까? 삭제된 리뷰는 복구할 수 없습니다.',
      confirmText: '삭제',
      cancelText: '취소',
      variant: 'destructive',
      onConfirm: async () => {
        try {
          await deleteReviewMutation.mutateAsync(reviewId)
        } catch (error) {
          console.error('Error deleting review:', error)
          alert('리뷰 삭제 중 오류가 발생했습니다.')
        }
      },
    })
  }

  const filteredReviews = reviews.filter((review) => {
    if (activeTab === 'all') return true
    if (activeTab === 'with-photos') return review.images.length > 0
    if (activeTab === 'with-response') return review.response !== null
    return true
  })

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

  const stats = {
    total: reviews.length,
    withPhotos: reviews.filter((r) => r.images.length > 0).length,
    withResponse: reviews.filter((r) => r.response !== null).length,
    thisMonth: reviews.filter((r) => {
      const reviewDate = new Date(r.createdAt)
      const now = new Date()
      return (
        reviewDate.getMonth() === now.getMonth() && reviewDate.getFullYear() === now.getFullYear()
      )
    }).length,
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {/* Header skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-2 h-8 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Stats skeleton */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 sm:p-6">
                <div className="animate-pulse">
                  <div className="mb-2 h-3 w-16 rounded bg-gray-200" />
                  <div className="h-7 w-12 rounded bg-gray-200" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Review skeletons */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <ReviewSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      {ConfirmationDialogComponent}
      <div className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {/* 헤더 - Mobile optimized */}
        <div className="mb-6 sm:mb-8">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">내 리뷰 관리</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            작성한 리뷰를 확인하고 관리할 수 있습니다
          </p>
        </div>

        {/* 통계 카드 - Using StatsCard component */}
        <StatsGrid>
          <StatsCard
            title="전체 리뷰"
            value={`${stats.total}건`}
            icon={<MessageSquareIcon className="h-6 w-6 text-blue-600" />}
            iconBgColor="bg-blue-100"
          />

          <StatsCard
            title="평균 별점"
            value={averageRating.toFixed(1)}
            icon={<StarIcon className="h-6 w-6 text-yellow-600" />}
            iconBgColor="bg-yellow-100"
          />

          <StatsCard
            title="사진 리뷰"
            value={`${stats.withPhotos}건`}
            icon={<ImageIcon className="h-6 w-6 text-blue-600" />}
            iconBgColor="bg-blue-100"
          />

          <StatsCard
            title="이번 달"
            value={`${stats.thisMonth}건`}
            icon={<TrendingUp className="h-6 w-6 text-green-600" />}
            iconBgColor="bg-green-100"
          />
        </StatsGrid>

        {/* 탭 필터 - Horizontally scrollable on mobile */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-auto min-w-full sm:min-w-0">
              <TabsTrigger value="all" className="flex-1 sm:flex-initial">
                <span className="whitespace-nowrap">전체 ({stats.total})</span>
              </TabsTrigger>
              <TabsTrigger value="with-photos" className="flex-1 sm:flex-initial">
                <span className="whitespace-nowrap">사진 리뷰 ({stats.withPhotos})</span>
              </TabsTrigger>
              <TabsTrigger value="with-response" className="flex-1 sm:flex-initial">
                <span className="whitespace-nowrap">답변 받은 ({stats.withResponse})</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        {/* 리뷰 목록 - Enhanced empty state */}
        {filteredReviews.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 sm:py-12">
              <div className="space-y-4 text-center">
                <div className="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-full sm:h-16 sm:w-16">
                  <MessageSquareIcon className="text-muted-foreground h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div>
                  <h3 className="text-base font-semibold sm:text-lg">리뷰가 없습니다</h3>
                  <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                    {activeTab === 'with-photos'
                      ? '사진과 함께 작성한 리뷰가 없습니다.'
                      : activeTab === 'with-response'
                        ? '답변을 받은 리뷰가 없습니다.'
                        : '아직 작성한 리뷰가 없습니다.'}
                  </p>
                </div>
                <Button
                  onClick={() => router.push('/customer/dashboard/bookings')}
                  className="w-full sm:w-auto"
                >
                  예약 내역 보기
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="transition-all duration-200 hover:shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  {/* 리뷰 헤더 - Mobile optimized */}
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      {/* Groomer Avatar */}
                      <div className="flex-shrink-0">
                        {review.booking.groomer?.image ? (
                          <Image
                            src={review.booking.groomer.image}
                            alt={review.booking.groomer.name || '미용사'}
                            width={48}
                            height={48}
                            className="ring-background h-10 w-10 rounded-full object-cover ring-2 sm:h-12 sm:w-12"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 sm:h-12 sm:w-12">
                            <UserIcon className="h-5 w-5 text-gray-500 sm:h-6 sm:w-6" />
                          </div>
                        )}
                      </div>

                      {/* Groomer Info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold sm:text-lg">
                          {review.booking.groomer?.name || '미용사'} 미용사
                        </h3>
                        <div className="text-muted-foreground flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:gap-3 sm:text-sm">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              {format(new Date(review.booking.serviceDate), 'yy.MM.dd', {
                                locale: ko,
                              })}
                            </span>
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 flex-shrink-0 sm:hidden" />
                            <span className="truncate">
                              {format(new Date(review.createdAt), 'yy.MM.dd', { locale: ko })} 작성
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Responsive */}
                    <div className="flex items-center justify-end sm:justify-start">
                      {/* Desktop buttons */}
                      <div className="hidden items-center gap-2 sm:flex">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/customer/booking/${review.bookingId}`)}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          예약 상세
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Mobile dropdown menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild className="sm:hidden">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">더보기</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => router.push(`/customer/booking/${review.bookingId}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            예약 상세 보기
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            리뷰 삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* 별점 - Enhanced visual */}
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={cn(
                            'h-4 w-4 transition-colors sm:h-5 sm:w-5',
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-foreground text-sm font-medium sm:text-base">
                      {review.rating}.0
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {review.rating >= 4 ? '최고!' : review.rating >= 3 ? '보통' : '아쉬워요'}
                    </Badge>
                  </div>

                  {/* 리뷰 내용 - Better typography */}
                  {review.comment && (
                    <p className="text-foreground/90 mb-4 text-sm leading-relaxed sm:text-base">
                      {review.comment}
                    </p>
                  )}

                  {/* 이미지 - Using new ImageGallery component */}
                  {review.images.length > 0 && (
                    <div className="mb-4">
                      <ImageGallery
                        images={review.images.map((img) => ({
                          id: img.id,
                          url: img.url,
                          alt: 'Review image',
                        }))}
                        columns={{ mobile: 2, tablet: 3, desktop: 4 }}
                        aspectRatio="square"
                      />
                    </div>
                  )}

                  {/* 미용사 답변 - Enhanced style */}
                  {review.response && (
                    <div className="from-primary/5 to-primary/10 border-primary mt-4 rounded-lg border-l-2 bg-gradient-to-r p-3 sm:p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="outline" className="border-primary/30 text-xs">
                          <MessageSquareIcon className="mr-1 h-3 w-3" />
                          미용사 답변
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                          {format(new Date(review.response.createdAt), 'yy.MM.dd', { locale: ko })}
                        </span>
                      </div>
                      <p className="text-foreground/80 text-sm sm:text-base">
                        {review.response.content}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
