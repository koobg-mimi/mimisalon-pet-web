'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

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
    duration: number
  }
  pet: {
    name: string
    breed: string
  }
  groomer: {
    name: string
  }
  location: {
    name: string
    address: string
  }
  date: string
  time: string
}

interface PaymentForm {
  method: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'KAKAO_PAY' | 'TOSS_PAY'
  cardNumber?: string
  cardExpiry?: string
  cardCvc?: string
  cardHolder?: string
  bankAccount?: string
}

export default function CheckoutPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    method: 'CREDIT_CARD',
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
    queryKey: ['booking', bookingId, 'payment-info'],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/${bookingId}/payment-info`)
      if (!response.ok) {
        throw new Error('Failed to fetch booking')
      }
      return response.json()
    },
    enabled: !!bookingId && !!session?.user && session.user.role === 'CUSTOMER',
    retry: false,
  })

  useEffect(() => {
    if (!bookingId) {
      router.push('/customer/bookings')
    }
  }, [bookingId, router])

  const handlePaymentMethodChange = (method: PaymentForm['method']) => {
    setPaymentForm({
      method,
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      cardHolder: '',
      bankAccount: '',
    })
  }

  const handleInputChange = (field: keyof PaymentForm, value: string) => {
    setPaymentForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Process payment using React Query mutation
  const paymentMutation = useMutation({
    mutationFn: async (formData: PaymentForm) => {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          paymentMethod: formData.method,
          paymentData: formData,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Payment processing failed')
      }

      return response.json()
    },
    onSuccess: (result) => {
      router.push(`/payment/success?paymentId=${result.paymentId}`)
    },
    onError: (error: Error) => {
      console.error('Payment processing failed:', error)
      router.push(`/payment/fail?reason=${encodeURIComponent(error.message)}`)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    paymentMutation.mutate(paymentForm)
  }

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{4})(?=\d)/g, '$1-')
  }

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 4)
    }
    return numbers
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
          <h1 className="text-foreground text-2xl font-bold">결제하기</h1>
          <p className="text-muted-foreground text-sm">예약을 완료하기 위해 결제를 진행해주세요</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="border-border bg-card rounded-lg border p-6">
              <h2 className="mb-6 text-xl font-semibold">결제 방법 선택</h2>

              <div className="mb-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[
                    { value: 'CREDIT_CARD', label: '신용카드', icon: '💳' },
                    { value: 'KAKAO_PAY', label: '카카오페이', icon: '🟡' },
                    { value: 'TOSS_PAY', label: '토스페이', icon: '🔵' },
                    { value: 'BANK_TRANSFER', label: '계좌이체', icon: '🏦' },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() =>
                        handlePaymentMethodChange(method.value as PaymentForm['method'])
                      }
                      className={`rounded-lg border p-4 text-center transition-colors ${
                        paymentForm.method === method.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="mb-1 text-2xl">{method.icon}</div>
                      <div className="text-sm font-medium">{method.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {paymentForm.method === 'CREDIT_CARD' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">카드 정보</h3>
                    <div>
                      <label className="text-foreground mb-2 block text-sm font-medium">
                        카드번호
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        value={paymentForm.cardNumber || ''}
                        onChange={(e) =>
                          handleInputChange('cardNumber', formatCardNumber(e.target.value))
                        }
                        placeholder="1234-5678-9012-3456"
                        className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-foreground mb-2 block text-sm font-medium">
                          유효기간
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={paymentForm.cardExpiry || ''}
                          onChange={(e) =>
                            handleInputChange('cardExpiry', formatExpiry(e.target.value))
                          }
                          placeholder="MM/YY"
                          className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-foreground mb-2 block text-sm font-medium">
                          CVC
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={3}
                          value={paymentForm.cardCvc || ''}
                          onChange={(e) =>
                            handleInputChange('cardCvc', e.target.value.replace(/\D/g, ''))
                          }
                          placeholder="123"
                          className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-foreground mb-2 block text-sm font-medium">
                        카드 소유자명
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.cardHolder || ''}
                        onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                        placeholder="홍길동"
                        className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {paymentForm.method === 'BANK_TRANSFER' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">계좌 정보</h3>
                    <div>
                      <label className="text-foreground mb-2 block text-sm font-medium">
                        계좌번호
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentForm.bankAccount || ''}
                        onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                        placeholder="123-456-789012"
                        className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {(paymentForm.method === 'KAKAO_PAY' || paymentForm.method === 'TOSS_PAY') && (
                  <div className="py-8 text-center">
                    <div className="mb-4 text-6xl">
                      {paymentForm.method === 'KAKAO_PAY' ? '🟡' : '🔵'}
                    </div>
                    <p className="text-muted-foreground">
                      {paymentForm.method === 'KAKAO_PAY' ? '카카오페이' : '토스페이'}
                      창이 새로 열려 결제를 진행합니다.
                    </p>
                  </div>
                )}

                <div className="border-border border-t pt-6">
                  <div className="mb-4 flex items-center">
                    <input type="checkbox" id="agree" required className="mr-2" />
                    <label htmlFor="agree" className="text-foreground text-sm">
                      결제 약관에 동의합니다
                    </label>
                  </div>

                  <Button type="submit" className="w-full" disabled={paymentMutation.isPending}>
                    {paymentMutation.isPending ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : null}
                    {booking.service.price.toLocaleString()}원 결제하기
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border-border bg-card sticky top-8 rounded-lg border p-6">
              <h2 className="mb-4 text-lg font-semibold">예약 정보</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground font-medium">{booking.service.name}</h3>
                  <p className="text-muted-foreground text-sm">{booking.service.duration}분</p>
                </div>

                <div>
                  <p className="text-sm">
                    <span className="font-medium">반려동물:</span> {booking.pet.name} (
                    {booking.pet.breed})
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">미용사:</span> {booking.groomer.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm">
                    <span className="font-medium">지점:</span> {booking.location.name}
                  </p>
                  <p className="text-muted-foreground text-xs">{booking.location.address}</p>
                </div>

                <div>
                  <p className="text-sm">
                    <span className="font-medium">예약일시:</span>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {booking.date} {booking.time}
                  </p>
                </div>

                <div className="border-border border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">서비스 금액</span>
                    <span>{booking.service.price.toLocaleString()}원</span>
                  </div>
                  <div className="text-muted-foreground mt-2 flex items-center justify-between text-sm">
                    <span>VAT</span>
                    <span>포함</span>
                  </div>
                  <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
                    <span className="text-lg font-semibold">총 결제금액</span>
                    <span className="text-primary text-lg font-bold">
                      {booking.service.price.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
