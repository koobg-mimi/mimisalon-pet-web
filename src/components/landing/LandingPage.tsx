'use client'

import { CTA } from './CTA'
import { Footer } from './Footer'
import { Header } from './Header'
import { Card, CardContent } from '../ui/card'
import { Sparkles, Heart, Shield, Clock, Star } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="bg-background min-h-screen" data-cy="landing-page">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 via-pink-50 to-white py-20 sm:py-32">
        {/* Background decorations */}
        <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-gradient-to-tr from-blue-200 to-purple-200 opacity-20 blur-3xl"></div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-block rounded-full bg-gradient-to-r from-purple-200 to-pink-200 px-4 py-2">
              <span className="text-sm font-semibold text-purple-700">✨ 프리미엄 반려동물 미용 서비스</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 sm:text-6xl">
              우리 아이의 <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                행복한 미용
              </span>
              <br />
              시작하세요
            </h1>
            <p className="mb-8 text-xl text-gray-600 sm:text-2xl">
              집에서 편하게, 스트레스 없이 받는 프리미엄 방문 미용 서비스
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={() => {
                  const event = new CustomEvent('handleBookingClick')
                  window.dispatchEvent(event)
                }}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:shadow-xl hover:from-purple-700 hover:to-pink-700"
              >
                지금 예약하기 →
              </button>
              <button className="rounded-xl border-2 border-gray-300 px-8 py-4 font-semibold text-gray-700 transition hover:border-purple-300 hover:bg-purple-50">
                서비스 알아보기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">미미살롱펫만의 특별함</h2>
            <p className="text-lg text-gray-600">우리 아이를 위한 최고의 경험을 제공합니다</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-md transition hover:shadow-lg">
              <CardContent className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">안심 방문 미용</h3>
                <p className="text-sm text-gray-600">
                  가장 익숙한 집에서 스트레스 없이 받는 미용 서비스
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 shadow-md transition hover:shadow-lg">
              <CardContent className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600 text-white">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">전문가 그루머</h3>
                <p className="text-sm text-gray-600">
                  검증된 전문가들의 섬세한 손길과 맞춤 케어
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 bg-gradient-to-br from-pink-50 to-pink-100/50 shadow-md transition hover:shadow-lg">
              <CardContent className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-600 text-white">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">편리한 일정</h3>
                <p className="text-sm text-gray-600">
                  내 일정에 맞춰 자유롭게 예약하고 관리
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-0 bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-md transition hover:shadow-lg">
              <CardContent className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-600 text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">프리미엄 케어</h3>
                <p className="text-sm text-gray-600">
                  최고급 제품과 정성으로 만드는 특별한 경험
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Left side - Content */}
              <div className="space-y-6">
                <div>
                  <span className="inline-block rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
                    미미살롱펫 이야기
                  </span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                  편안한 미용이 <br />
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    최고의 미용
                  </span>
                </h2>
                <p className="text-lg text-gray-600">
                  2017년부터 우리는 강아지, 고양이들의 미용 스트레스 해소를 위해 노력해왔습니다.
                </p>
                <div className="space-y-4 border-l-4 border-purple-600 pl-6">
                  <div>
                    <p className="text-sm font-semibold text-purple-600">핵심 철학</p>
                    <p className="text-gray-700">
                      멋진 미용보다는 <strong>편안한 미용</strong>을 추구합니다
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-purple-600">서비스 방식</p>
                    <p className="text-gray-700">
                      보호자가 옆에서 함께할 수 있는 <strong>신뢰의 미용</strong>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-purple-600">최종 목표</p>
                    <p className="text-gray-700">
                      <strong>우리 아이의 행복</strong>을 최우선으로
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side - Stats Card */}
              <div className="space-y-6">
                <Card className="border-0 bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl">
                  <CardContent className="space-y-8 p-8">
                    <div>
                      <p className="text-5xl font-bold">7+</p>
                      <p className="mt-2 text-lg text-white/80">년간의 신뢰받은 서비스</p>
                    </div>
                    <div className="space-y-3 border-t border-white/20 pt-6">
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                        <span>수천 명의 만족한 반려견 보호자</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Heart className="h-5 w-5" />
                        <span>업계 최고 재방문율 95%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  )
}
