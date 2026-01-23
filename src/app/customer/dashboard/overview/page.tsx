'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import Link from 'next/link'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { PhoneVerificationStatusBanner } from '@/components/auth/phone-verification-status-banner'
import { AddressVerificationBanner } from '@/components/customer/AddressVerificationBanner'
import { PetVerificationBanner } from '@/components/customer/PetVerificationBanner'
import { FavoriteGroomer } from '@/components/customer/FavoriteGroomer'
import { useAddresses } from '@/hooks/useAddresses'
import { usePets } from '@/hooks/usePets'
import { BookingStatus } from '@mimisalon/shared'

function getStatusColor(status: BookingStatus) {
  switch (status) {
    case BookingStatus.FIRST_PAYMENT_PENDING:
    case BookingStatus.GROOMER_CONFIRM_PENDING:
    case BookingStatus.FIRST_PAYMENT_COMPLETE:
      return 'text-yellow-600 bg-yellow-50'
    case BookingStatus.GROOMER_CONFIRM:
    case BookingStatus.ADDITIONAL_PAYMENT_PENDING:
    case BookingStatus.ADDITIONAL_PAYMENT_COMPLETE:
      return 'text-blue-600 bg-blue-50'
    case BookingStatus.WORK_IN_PROGRESS:
      return 'text-purple-600 bg-purple-50'
    case BookingStatus.SERVICE_COMPLETED:
      return 'text-green-600 bg-green-50'
    case BookingStatus.SERVICE_CANCELLED:
    case BookingStatus.BOOKING_FAILED:
      return 'text-red-600 bg-red-50'
    default:
      throw new Error('Error on Types')
  }
}

function getStatusText(status: BookingStatus) {
  switch (status) {
    case BookingStatus.FIRST_PAYMENT_PENDING:
      return '1차 결제 대기'
    case BookingStatus.FIRST_PAYMENT_COMPLETE:
      return '1차 결제 완료'
    case BookingStatus.GROOMER_CONFIRM_PENDING:
      return '미용사 확인 대기'
    case BookingStatus.GROOMER_CONFIRM:
      return '미용사 확정'
    case BookingStatus.ADDITIONAL_PAYMENT_PENDING:
      return '추가 결제 대기'
    case BookingStatus.ADDITIONAL_PAYMENT_COMPLETE:
      return '추가 결제 완료'
    case BookingStatus.WORK_IN_PROGRESS:
      return '진행중'
    case BookingStatus.SERVICE_COMPLETED:
      return '완료'
    case BookingStatus.SERVICE_CANCELLED:
      return '취소됨'
    case BookingStatus.BOOKING_FAILED:
      return '예약 실패'
    default:
      throw new Error('Error on Types')
  }
}

export default function CustomerDashboardOverviewPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const { data: stats, isLoading } = useDashboardStats()
  const { addresses, isLoading: addressesLoading } = useAddresses()
  const { pets, isLoading: petsLoading } = usePets()

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
    if (session?.user?.role && session.user.role !== 'CUSTOMER') {
      router.push('/dashboard')
    }
  }, [session, router])

  if (isPending || isLoading || addressesLoading || petsLoading) {
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
      {/* Verification Banners */}
      <div className="space-y-3">
        {/* Phone Verification Status - Read-only banner that directs to profile for changes */}
        {!session?.user?.phoneNumberVerified && (
          <PhoneVerificationStatusBanner userRole="CUSTOMER" className="container mx-auto px-4" />
        )}
        <AddressVerificationBanner
          hasAddresses={addresses.length > 0}
          className="container mx-auto px-4"
        />
        <PetVerificationBanner hasPets={pets.length > 0} className="container mx-auto px-4" />
      </div>

      <main className="container mx-auto px-4 py-4">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="border-border bg-card rounded-lg border p-6">
            <h3 className="mb-2 text-lg font-semibold">빠른 예약</h3>
            <p className="text-muted-foreground mb-4">간편하게 새로운 미용 예약을 만들어보세요.</p>
            <Button asChild className="w-full">
              <Link href="/booking/new">예약하기</Link>
            </Button>
          </div>
          <div className="border-border bg-card rounded-lg border p-6">
            <h3 className="mb-2 text-lg font-semibold">반려동물 추가</h3>
            <p className="text-muted-foreground mb-4">새로운 반려동물을 등록하고 관리하세요.</p>
            <Button asChild className="w-full" variant="outline">
              <Link href="/customer/pets">반려동물 관리</Link>
            </Button>
          </div>
        </div>

        {stats && (
          <>
            {stats.favoriteGroomer && <FavoriteGroomer groomer={stats.favoriteGroomer} />}

            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">최근 예약</h2>
                <Button variant="outline" asChild>
                  <Link href="/customer/bookings">전체 보기</Link>
                </Button>
              </div>

              {stats.recentBookings.length === 0 ? (
                <div className="border-border rounded-lg border p-8 text-center">
                  <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <svg
                      className="text-muted-foreground h-8 w-8"
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
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-medium">예약 내역이 없습니다</h3>
                  <p className="text-muted-foreground mb-4">첫 번째 미용 예약을 만들어보세요.</p>
                  <Button asChild>
                    <Link href="/booking/new">예약하기</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {stats.recentBookings.map((booking) => (
                    <div key={booking.id} className="border-border bg-card rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <h3 className="font-semibold">{booking.service.name}</h3>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}
                            >
                              {getStatusText(booking.status)}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {booking.groomer.name} • {booking.date}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {booking.status === 'ADDITIONAL_PAYMENT_PENDING' && (
                            <Button size="sm" asChild className="bg-orange-600 hover:bg-orange-700">
                              <Link href={`/payment/additional/${booking.id}`}>추가 결제</Link>
                            </Button>
                          )}
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/customer/booking/${booking.id}`}>상세보기</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
