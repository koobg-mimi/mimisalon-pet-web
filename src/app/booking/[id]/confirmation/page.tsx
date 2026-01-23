'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  CheckCircleIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  ScissorsIcon,
  HomeIcon,
  ListIcon,
  AlertCircleIcon,
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface BookingDetails {
  id: string
  appointmentDate: string
  startTime: string
  status: string
  totalAmount: number
  paidAmount: number
  additionalAmount: number
  paymentStatus: string
  groomer: {
    id: string
    name: string
    photoUrl: string | null
    phone: string
    salon: {
      id: string
      name: string
      address: string
      phone: string
    }
  }
  pet: {
    id: string
    name: string
    species: string
    breed: string
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
    status: string
  }>
  options: Array<{
    id: string
    name: string
    description: string
    price: number
  }>
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

export default function BookingConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()

  // Fetch booking details using React Query
  const {
    data: booking,
    isLoading,
    isError,
  } = useQuery<BookingDetails>({
    queryKey: ['booking', resolvedParams.id],
    queryFn: async () => {
      const response = await fetch(`/api/customer/booking/${resolvedParams.id}`)
      if (!response.ok) {
        throw new Error('예약 정보를 불러올 수 없습니다')
      }
      return response.json()
    },
    retry: false,
  })

  // Redirect on error (must be in useEffect to avoid render-time navigation)
  useEffect(() => {
    if (isError) {
      router.push('/customer/bookings')
    }
  }, [isError, router])

  if (isLoading || isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircleIcon className="text-destructive mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-medium">예약 정보를 찾을 수 없습니다</h3>
              <Button asChild className="mt-4">
                <Link href="/customer/bookings">예약 목록으로 돌아가기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy년 MM월 dd일 (EEEE)', { locale: ko })
  }

  return (
    <div className="from-primary/5 to-background min-h-screen bg-gradient-to-b">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {/* Success Header */}
          <div className="mb-8 text-center">
            <CheckCircleIcon className="mx-auto mb-4 h-16 w-16 text-green-600" />
            <h1 className="mb-2 text-3xl font-bold">예약이 완료되었습니다!</h1>
            <p className="text-muted-foreground">
              예약번호:{' '}
              <span className="font-mono font-semibold">{booking.id.slice(-8).toUpperCase()}</span>
            </p>
          </div>

          {/* Main Booking Details Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                예약 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date and Time */}
              <div className="flex items-start gap-4">
                <CalendarIcon className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div className="flex-1">
                  <p className="font-medium">{formatDate(booking.appointmentDate)}</p>
                  <p className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                    <ClockIcon className="h-4 w-4" />
                    {booking.startTime}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Groomer */}
              <div className="flex items-start gap-4">
                <UserIcon className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm">담당 미용사</p>
                  <p className="font-medium">{booking.groomer.name}</p>
                </div>
              </div>

              <Separator />

              {/* Pet and Services */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ScissorsIcon className="text-muted-foreground h-5 w-5" />
                  <p className="font-medium">서비스 내역</p>
                </div>
                <div className="bg-muted/50 ml-7 rounded-lg p-3">
                  <p className="mb-2 font-medium">
                    {booking.pet.name} ({booking.pet.breed})
                  </p>
                  <div className="space-y-1">
                    {booking.services.map((service, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">• {service.name}</span>
                        <span className="font-medium">{service.price.toLocaleString()}원</span>
                      </div>
                    ))}
                    {booking.options && booking.options.length > 0 && (
                      <>
                        <div className="mt-2 border-t pt-2">
                          <span className="text-muted-foreground text-xs font-medium">
                            추가 옵션
                          </span>
                        </div>
                        {booking.options.map((option, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">+ {option.name}</span>
                            <span className="font-medium">{option.price.toLocaleString()}원</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Total Price */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-lg font-semibold">총 결제금액</p>
                <p className="text-primary text-2xl font-bold">
                  {booking.totalAmount.toLocaleString('ko-KR')}원
                </p>
              </div>

              {/* Payment Status */}
              <div className="flex items-center gap-2">
                <Badge variant={booking.paymentStatus === 'PAID' ? 'success' : 'secondary'}>
                  {booking.paymentStatus === 'PAID' ? '결제완료' : '결제대기'}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  1차 결제: {booking.paidAmount.toLocaleString('ko-KR')}원
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
            <CardContent className="pt-6">
              <h3 className="mb-2 flex items-center gap-2 font-semibold">
                <AlertCircleIcon className="h-5 w-5 text-yellow-600" />
                예약 안내사항
              </h3>
              <ul className="text-muted-foreground ml-7 space-y-1 text-sm">
                <li>• 예약 2시간 전에 알림을 보내드립니다</li>
                <li>• 예약 시간 10분 전까지 도착해 주세요</li>
                <li>• 예약 변경이 필요한 경우 미리 연락 부탁드립니다</li>
                <li>• 반려동물의 건강 상태를 미리 알려주세요</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/customer/bookings">
                <ListIcon className="mr-2 h-4 w-4" />
                예약 목록 보기
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                <HomeIcon className="mr-2 h-4 w-4" />
                홈으로 돌아가기
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
