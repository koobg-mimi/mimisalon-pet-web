'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { use, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import Link from 'next/link'

interface BookingDetail {
  id: string
  status: string
  date: string
  time: string
  createdAt: string
  specialRequests?: string
  customer: {
    name: string
    email: string
    phone?: string
  }
  pet: {
    name: string
    breed: string
    weight?: number
    specialNotes?: string
  }
  service: {
    name: string
    description: string
    price: number
    duration: number
  }
  groomer: {
    name: string
    email: string
    phone?: string
    rating: number
  }
  location: {
    name: string
    address: string
    phone: string
  }
  payment?: {
    id: string
    amount: number
    method: string
    status: string
    createdAt: string
  }
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const resolvedParams = use(params)
  const bookingId = resolvedParams.id
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
  }, [router, session])

  // Fetch booking details using React Query
  const { data: booking, isLoading } = useQuery<BookingDetail>({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/${bookingId}`)
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/404')
        }
        throw new Error('Failed to fetch booking')
      }
      return response.json()
    },
    enabled: !!session && !!bookingId,
    retry: false,
  })

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to cancel booking')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] })
    },
    onError: (error) => {
      console.error('Failed to cancel booking:', error)
    },
  })

  // Update booking status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) {
        throw new Error('Failed to update booking status')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] }).then()
    },
    onError: (error) => {
      console.error('Failed to update booking status:', error)
    },
  })

  const handleCancelBooking = async () => {
    if (!confirm('정말 예약을 취소하시겠습니까?')) return
    cancelBookingMutation.mutate()
  }

  const handleUpdateStatus = async (newStatus: string) => {
    updateStatusMutation.mutate(newStatus)
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50'
      case 'CONFIRMED':
        return 'text-blue-600 bg-blue-50'
      case 'IN_PROGRESS':
        return 'text-purple-600 bg-purple-50'
      case 'COMPLETED':
        return 'text-green-600 bg-green-50'
      case 'CANCELLED':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'PENDING':
        return '대기중'
      case 'CONFIRMED':
        return '확정'
      case 'IN_PROGRESS':
        return '진행중'
      case 'COMPLETED':
        return '완료'
      case 'CANCELLED':
        return '취소'
      default:
        return status
    }
  }

  function getPaymentStatusColor(status: string) {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-50'
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50'
      case 'FAILED':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  function getPaymentStatusText(status: string) {
    switch (status) {
      case 'COMPLETED':
        return '완료'
      case 'PENDING':
        return '처리중'
      case 'FAILED':
        return '실패'
      default:
        return status
    }
  }

  function renderStars(rating: number) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-muted-foreground ml-1 text-sm">({rating})</span>
      </div>
    )
  }

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!session || !booking) {
    return null
  }

  const isCustomer = session.user?.role === 'CUSTOMER'
  const isGroomer = session.user?.role === 'GROOMER'
  const isAdmin = session.user?.role === 'ADMIN'

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-foreground text-2xl font-bold">예약 상세</h1>
            <p className="text-muted-foreground text-sm">예약 번호: {booking.id}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link
                href={
                  isCustomer
                    ? '/customer/bookings'
                    : isGroomer
                      ? '/groomer/bookings'
                      : '/admin/bookings'
                }
              >
                예약 목록
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="border-border bg-card rounded-lg border p-6">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="mb-2 text-2xl font-semibold">{booking.service.name}</h2>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(booking.status)}`}
                  >
                    {getStatusText(booking.status)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    예약일: {format(new Date(booking.createdAt), 'yyyy-MM-dd', { locale: ko })}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-primary text-2xl font-bold">
                  {booking.service.price.toLocaleString()}원
                </p>
                <p className="text-muted-foreground text-sm">{booking.service.duration}분</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-foreground mb-3 font-semibold">예약 일시</h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <svg
                      className="text-muted-foreground h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {booking.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <svg
                      className="text-muted-foreground h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {booking.time}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-foreground mb-3 font-semibold">반려동물 정보</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">이름:</span> {booking.pet.name}
                  </p>
                  <p>
                    <span className="font-medium">품종:</span> {booking.pet.breed}
                  </p>
                  {booking.pet.weight && (
                    <p>
                      <span className="font-medium">몸무게:</span> {booking.pet.weight}kg
                    </p>
                  )}
                  {booking.pet.specialNotes && (
                    <p>
                      <span className="font-medium">특이사항:</span> {booking.pet.specialNotes}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-foreground mb-3 font-semibold">미용사 정보</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">이름:</span> {booking.groomer.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">평점:</span>
                    {renderStars(booking.groomer.rating)}
                  </div>
                  {booking.groomer.phone && (
                    <p>
                      <span className="font-medium">연락처:</span> {booking.groomer.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-foreground mb-3 font-semibold">지점 정보</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">지점명:</span> {booking.location.name}
                  </p>
                  <p>
                    <span className="font-medium">주소:</span> {booking.location.address}
                  </p>
                  <p>
                    <span className="font-medium">연락처:</span> {booking.location.phone}
                  </p>
                </div>
              </div>

              {!isGroomer && (
                <div>
                  <h3 className="text-foreground mb-3 font-semibold">고객 정보</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">이름:</span> {booking.customer.name}
                    </p>
                    <p>
                      <span className="font-medium">이메일:</span> {booking.customer.email}
                    </p>
                    {booking.customer.phone && (
                      <p>
                        <span className="font-medium">연락처:</span> {booking.customer.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-foreground mb-3 font-semibold">서비스 정보</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">서비스:</span> {booking.service.name}
                  </p>
                  <p>
                    <span className="font-medium">설명:</span> {booking.service.description}
                  </p>
                  <p>
                    <span className="font-medium">소요시간:</span> {booking.service.duration}분
                  </p>
                  <p>
                    <span className="font-medium">가격:</span>{' '}
                    {booking.service.price.toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>

            {booking.specialRequests && (
              <div className="bg-muted/50 mt-6 rounded-md p-4">
                <h3 className="text-foreground mb-2 font-semibold">특별 요청사항</h3>
                <p className="text-foreground">{booking.specialRequests}</p>
              </div>
            )}
          </div>

          {booking.payment && (
            <div className="border-border bg-card rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">결제 정보</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p>
                    <span className="font-medium">결제 금액:</span>{' '}
                    {booking.payment.amount.toLocaleString('ko-KR')}원
                  </p>
                  <p>
                    <span className="font-medium">결제 방법:</span> {booking.payment.method}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">결제 상태:</span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getPaymentStatusColor(booking.payment.status)}`}
                    >
                      {getPaymentStatusText(booking.payment.status)}
                    </span>
                  </div>
                  <p>
                    <span className="font-medium">결제일:</span>{' '}
                    {format(new Date(booking.payment.createdAt), 'yyyy-MM-dd', { locale: ko })}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-x-2">
              {booking.status === 'COMPLETED' && isCustomer && (
                <Button asChild>
                  <Link href={`/review/create?bookingId=${booking.id}`}>리뷰 작성</Link>
                </Button>
              )}
              {booking.payment?.status === 'COMPLETED' && (
                <Button variant="outline">영수증 다운로드</Button>
              )}
            </div>

            <div className="space-x-2">
              {isCustomer && booking.status === 'PENDING' && (
                <Button
                  variant="outline"
                  onClick={handleCancelBooking}
                  disabled={cancelBookingMutation.isPending}
                >
                  {cancelBookingMutation.isPending ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : null}
                  예약 취소
                </Button>
              )}

              {isGroomer && (
                <>
                  {booking.status === 'PENDING' && (
                    <>
                      <Button
                        onClick={() => handleUpdateStatus('CONFIRMED')}
                        disabled={updateStatusMutation.isPending}
                      >
                        {updateStatusMutation.isPending ? (
                          <LoadingSpinner size="sm" className="mr-2" />
                        ) : null}
                        확정
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateStatus('CANCELLED')}
                        disabled={updateStatusMutation.isPending}
                      >
                        취소
                      </Button>
                    </>
                  )}
                  {booking.status === 'CONFIRMED' && (
                    <Button
                      onClick={() => handleUpdateStatus('IN_PROGRESS')}
                      disabled={updateStatusMutation.isPending}
                    >
                      {updateStatusMutation.isPending ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : null}
                      시작
                    </Button>
                  )}
                  {booking.status === 'IN_PROGRESS' && (
                    <Button
                      onClick={() => handleUpdateStatus('COMPLETED')}
                      disabled={updateStatusMutation.isPending}
                    >
                      {updateStatusMutation.isPending ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : null}
                      완료
                    </Button>
                  )}
                </>
              )}

              {isAdmin && <Button variant="outline">관리자 액션</Button>}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
