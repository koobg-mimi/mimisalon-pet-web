'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { ArrowRight, Calendar, LogIn, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'

export function CTA() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleLoginClick = () => {
    if (session?.user) {
      const userRole = session.user.role
      if (userRole === 'ADMIN') {
        router.push('/admin/dashboard/overview')
      } else if (userRole === 'GROOMER') {
        router.push('/groomer/dashboard/overview')
      } else if (userRole === 'CUSTOMER') {
        router.push('/customer/dashboard/overview')
      }
    } else {
      router.push('/auth/signin')
    }
  }

  const handleBookingClick = () => {
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=/booking/new')
    } else {
      router.push('/booking/new')
    }
  }

  const isLoggedIn = !!session?.user
  const currentUser = session?.user

  return (
    <section data-cy="cta" className="relative overflow-hidden py-20 sm:py-28">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600"></div>
      <div className="absolute top-0 right-0 h-96 w-96 translate-x-32 -translate-y-32 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-32 translate-y-32 rounded-full bg-white/10 blur-3xl"></div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="space-y-8 p-8 text-center sm:p-12">
              <div className="space-y-6">
                <div className="inline-block rounded-full bg-gradient-to-r from-purple-200 to-pink-200 px-4 py-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                    <Sparkles className="h-4 w-4" />
                    지금 바로 예약하고 특별한 경험을 시작하세요
                  </span>
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                    우리 아이의 행복한 미용,
                    <br />
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      지금 시작하세요
                    </span>
                  </h3>
                </div>
                <p className="mx-auto max-w-2xl text-lg text-gray-600">
                  미미살롱펫과 함께 우리 아이에게 가장 편안하고 행복한 미용 경험을 선물해주세요.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                {isLoggedIn && currentUser ? (
                  <Button
                    size="lg"
                    onClick={handleBookingClick}
                    className="h-auto bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:shadow-xl hover:from-purple-700 hover:to-pink-700"
                  >
                    <Calendar className="mr-3 h-5 w-5" />
                    지금 바로 예약하기
                    <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={handleBookingClick}
                      className="h-auto bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:shadow-xl hover:from-purple-700 hover:to-pink-700"
                    >
                      <Calendar className="mr-3 h-5 w-5" />
                      예약하기
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleLoginClick}
                      variant="outline"
                      className="h-auto border-2 border-purple-600 px-8 py-4 text-lg font-bold text-purple-600 transition hover:bg-purple-50"
                    >
                      <LogIn className="mr-3 h-5 w-5" />
                      로그인하기
                    </Button>
                  </>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500">
                  📞 문의사항은 언제든지 연락주세요 | 🏠 방문 미용 서비스로 편하게 이용하세요
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
