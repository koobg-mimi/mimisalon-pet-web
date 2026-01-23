'use client'

import { useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
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
  CreditCardIcon,
  DownloadIcon,
  HomeIcon,
  MessageCircleIcon,
  PhoneIcon,
  AlertCircleIcon,
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CUSTOMER_SERVICE } from '@/lib/constants/customer-service'

interface PaymentDetails {
  id: string
  amount: number
  method: string
  paidAt: string
  booking: {
    id: string
    services: Array<{
      id: string
      name: string
      price: number
      duration: number
    }>
    pet: {
      name: string
      species: string
    }
    groomer: {
      name: string
      phone: string
    }
    scheduledDate: string
    scheduledTime: string
  }
  receipt: {
    receiptNumber: string
    downloadUrl: string
  }
}

export default function PaymentSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('payment')

  useEffect(() => {
    if (!paymentId) {
      router.push(`/customer/booking/${resolvedParams.id}`)
    }
  }, [paymentId, resolvedParams.id, router])

  // Fetch payment details using React Query
  const { data: payment, isLoading } = useQuery<PaymentDetails>({
    queryKey: ['payment', paymentId],
    queryFn: async () => {
      const response = await fetch(`/api/payments/verify/${paymentId}`)
      if (!response.ok) {
        throw new Error('결제 정보를 불러올 수 없습니다')
      }
      const data = await response.json()

      // Verify endpoint returns a different structure, extract payment data
      if (data.success && data.payment) {
        // Transform the data to match the expected PaymentDetails structure
        const paymentData: PaymentDetails = {
          id: data.payment.id,
          amount: data.payment.amount,
          method: data.payment.method || '카드',
          paidAt: data.payment.paidAt
            ? format(new Date(data.payment.paidAt), 'yyyy-MM-dd HH:mm:ss', { locale: ko })
            : format(new Date(), 'yyyy-MM-dd HH:mm:ss', { locale: ko }),
          booking: data.payment.booking
            ? {
                id: data.payment.booking.id,
                services:
                  data.payment.booking.pets?.flatMap((pet: any) =>
                    pet.services?.map((service: any) => ({
                      id: service.name,
                      name: service.name,
                      price: service.price,
                      duration: service.duration,
                    }))
                  ) || [],
                pet: data.payment.booking.pets?.[0]
                  ? {
                      name: data.payment.booking.pets[0].name,
                      species: data.payment.booking.pets[0].breed || '강아지',
                    }
                  : {
                      name: '알 수 없음',
                      species: '알 수 없음',
                    },
                groomer: data.payment.booking.groomer
                  ? {
                      name: data.payment.booking.groomer.name || '미용사',
                      phone: '',
                    }
                  : {
                      name: '미용사',
                      phone: '',
                    },
                scheduledDate: data.payment.booking.serviceDate
                  ? format(new Date(data.payment.booking.serviceDate), 'yyyy년 MM월 dd일', {
                      locale: ko,
                    })
                  : '',
                scheduledTime: data.payment.booking.serviceTime || '',
              }
            : {
                // Fallback booking data if not available
                id: resolvedParams.id,
                services: [],
                pet: { name: '알 수 없음', species: '알 수 없음' },
                groomer: { name: '미용사', phone: '' },
                scheduledDate: '',
                scheduledTime: '',
              },
          receipt: {
            receiptNumber: data.payment.paymentId,
            downloadUrl: data.payment.receiptUrl || '',
          },
        }
        return paymentData
      } else {
        throw new Error('결제 정보가 올바르지 않습니다')
      }
    },
    enabled: !!paymentId,
    retry: false,
  })

  // Download receipt using React Query mutation
  const downloadReceiptMutation = useMutation({
    mutationFn: async () => {
      if (!payment?.receipt.downloadUrl) {
        throw new Error('Download URL not available')
      }
      const response = await fetch(payment.receipt.downloadUrl)
      if (!response.ok) {
        throw new Error('Failed to download receipt')
      }
      return {
        blob: await response.blob(),
        filename: `receipt_${payment.receipt.receiptNumber}.pdf`,
      }
    },
    onSuccess: ({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    },
    onError: (error) => {
      console.error('Error downloading receipt:', error)
    },
  })

  const handleReceiptDownload = () => {
    downloadReceiptMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <LoadingSpinner size="lg" />
              <p className="text-muted-foreground">결제 정보를 불러오는 중...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <AlertCircleIcon className="text-muted-foreground mx-auto h-12 w-12" />
              <h3 className="text-lg font-semibold">결제 정보를 찾을 수 없습니다</h3>
              <p className="text-muted-foreground">
                유효하지 않은 결제이거나 이미 처리된 결제입니다.
              </p>
              <Button onClick={() => router.push('/customer/bookings')}>
                예약 목록으로 돌아가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* 성공 헤더 */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-green-900">결제가 완료되었습니다!</h1>
          <p className="text-muted-foreground">
            {payment.booking.pet.name}의 미용 예약이 확정되었습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 왼쪽: 예약 및 결제 정보 */}
          <div className="space-y-6 lg:col-span-2">
            {/* 예약 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>예약 정보</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-muted-foreground text-sm">반려동물</div>
                    <div className="font-medium">
                      {payment.booking.pet.name} ({payment.booking.pet.species})
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">예약 번호</div>
                    <div className="font-mono font-medium">#{payment.booking.id}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">예약 날짜</div>
                    <div className="font-medium">{payment.booking.scheduledDate}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">예약 시간</div>
                    <div className="font-medium">{payment.booking.scheduledTime}</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-muted-foreground mb-2 text-sm">미용사 정보</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{payment.booking.groomer.name}</div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${payment.booking.groomer.phone}`}>
                        <PhoneIcon className="mr-2 h-4 w-4" />
                        연락하기
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 서비스 목록 */}
            <Card>
              <CardHeader>
                <CardTitle>선택된 서비스</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payment.booking.services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between border-b py-3 last:border-b-0"
                    >
                      <div>
                        <div className="font-medium">{service.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{service.price.toLocaleString()}원</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 결제 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCardIcon className="h-5 w-5" />
                  <span>결제 정보</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-muted-foreground text-sm">결제 금액</div>
                    <div className="text-primary text-lg font-bold">
                      {payment.amount.toLocaleString('ko-KR')}원
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">결제 방법</div>
                    <div className="font-medium">{payment.method}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">결제 시간</div>
                    <div className="font-medium">{payment.paidAt}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">영수증 번호</div>
                    <div className="font-mono font-medium">{payment.receipt.receiptNumber}</div>
                  </div>
                </div>

                <Separator />

                <Button variant="outline" onClick={handleReceiptDownload} className="w-full">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  영수증 다운로드
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 다음 단계 안내 */}
          <div className="space-y-6">
            {/* 예약 상태 */}
            <Card>
              <CardHeader>
                <CardTitle>예약 상태</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge
                    variant="default"
                    className="bg-green-100 px-3 py-1 text-sm text-green-800"
                  >
                    예약 확정
                  </Badge>
                  <p className="text-muted-foreground mt-2 text-sm">미용사가 예약을 확인했습니다</p>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                    <div>
                      <div className="font-medium">예약 확정</div>
                      <div className="text-muted-foreground">결제 완료됨</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="bg-muted mt-2 h-2 w-2 flex-shrink-0 rounded-full"></div>
                    <div>
                      <div className="font-medium">서비스 준비</div>
                      <div className="text-muted-foreground">미용 준비 중</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="bg-muted mt-2 h-2 w-2 flex-shrink-0 rounded-full"></div>
                    <div>
                      <div className="font-medium">서비스 진행</div>
                      <div className="text-muted-foreground">미용 시작</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="bg-muted mt-2 h-2 w-2 flex-shrink-0 rounded-full"></div>
                    <div>
                      <div className="font-medium">완료</div>
                      <div className="text-muted-foreground">서비스 완료</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 유용한 링크 */}
            <Card>
              <CardHeader>
                <CardTitle>바로가기</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/customer/booking/${payment.booking.id}`}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    예약 상세보기
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/customer/bookings">
                    <CalendarIcon className="mr-2 h-4 w-4" />내 예약 목록
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/customer/messages">
                    <MessageCircleIcon className="mr-2 h-4 w-4" />
                    메시지함
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/customer">
                    <HomeIcon className="mr-2 h-4 w-4" />
                    홈으로
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* 고객 지원 */}
            <Card>
              <CardHeader>
                <CardTitle>고객 지원</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm">예약이나 결제에 문제가 있으신가요?</p>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={CUSTOMER_SERVICE.PHONE_URL}>
                    <PhoneIcon className="mr-2 h-4 w-4" />
                    고객센터: {CUSTOMER_SERVICE.PHONE}
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/support">
                    <MessageCircleIcon className="mr-2 h-4 w-4" />
                    온라인 문의
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
