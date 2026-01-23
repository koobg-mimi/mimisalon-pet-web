'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarIcon, CalendarIcon, UserIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface ReviewImage {
  id: string
  url: string
  order: number
}

interface ReviewResponse {
  id: string
  content: string
  createdAt: string
}

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  images: ReviewImage[]
  response: ReviewResponse | null
  customer: {
    id: string
    name: string | null
    image: string | null
  }
  booking: {
    id: string
    serviceDate: string
    serviceType: string
    bookingPets?: Array<{
      pet: {
        name: string
        breed: string | null
      }
    }>
  }
}

interface ReviewCardProps {
  review: Review
  className?: string
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        {/* 리뷰 헤더 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start space-x-3 sm:space-x-4">
            {review.customer.image ? (
              <Image
                src={review.customer.image}
                alt={review.customer.name || '고객'}
                width={48}
                height={48}
                className="h-10 w-10 flex-shrink-0 rounded-full object-cover sm:h-12 sm:w-12"
                unoptimized
              />
            ) : (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 sm:h-12 sm:w-12">
                <UserIcon className="h-5 w-5 text-gray-400 sm:h-6 sm:w-6" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h3 className="truncate font-semibold">{review.customer.name || '익명 고객'}</h3>
              </div>
              <div className="text-muted-foreground flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:gap-3 sm:text-sm">
                <span className="flex items-center space-x-1">
                  <CalendarIcon className="h-3 w-3" />
                  <span>
                    {format(new Date(review.booking.serviceDate), 'MM/dd', { locale: ko })}
                    <span className="hidden sm:inline">
                      {format(new Date(review.booking.serviceDate), ' (yyyy년)', {
                        locale: ko,
                      })}
                    </span>
                  </span>
                </span>
                {review.booking.bookingPets && review.booking.bookingPets.length > 0 && (
                  <span className="flex items-center">
                    <span className="mr-1 hidden sm:inline">•</span>
                    <span className="truncate">
                      {review.booking.bookingPets[0].pet.name}
                      {review.booking.bookingPets[0].pet.breed &&
                        ` (${review.booking.bookingPets[0].pet.breed})`}
                      {review.booking.bookingPets.length > 1 &&
                        ` 외 ${review.booking.bookingPets.length - 1} 마리`}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* 별점 */}
        <div className="mb-3 flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`h-4 w-4 sm:h-5 sm:w-5 ${
                star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-muted-foreground ml-2 text-xs sm:text-sm">{review.rating}.0</span>
        </div>

        {/* 리뷰 내용 */}
        {review.comment && (
          <p className="mb-4 text-sm leading-relaxed break-words">{review.comment}</p>
        )}

        {/* 이미지 */}
        {review.images.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {review.images.map((img) => (
              <div key={img.id} className="relative aspect-square">
                <Image
                  src={img.url}
                  alt="Review image"
                  fill
                  className="rounded-lg object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}

        {/* 미용사 답변 */}
        {review.response && (
          <div className="bg-primary/5 border-primary/20 mt-4 rounded-lg border p-3 sm:p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge className="text-xs">미용사 답변</Badge>
              <span className="text-muted-foreground text-xs">
                {format(new Date(review.response.createdAt), 'MM/dd', { locale: ko })}
                <span className="hidden sm:inline">
                  {format(new Date(review.response.createdAt), ' (yyyy년)', { locale: ko })}
                </span>
              </span>
            </div>
            <p className="text-sm break-words">{review.response.content}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
