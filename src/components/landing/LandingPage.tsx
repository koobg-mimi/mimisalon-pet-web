'use client'

import { CTA } from './CTA'
import { Footer } from './Footer'
import { Header } from './Header'
import { Card, CardContent } from '../ui/card'

export function LandingPage() {
  return (
    <div className="bg-background min-h-screen" data-cy="landing-page">
      <Header />

      {/* About Section */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          {/* Hero Title */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
              미용 스트레스는 가라!!
            </h2>
            <div className="from-primary/50 via-primary to-primary/50 mx-auto h-1 w-24 bg-linear-to-r"></div>
          </div>

          {/* Main Content Card */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-50/50 via-white to-pink-50/30 shadow-xl">
            {/* Decorative background elements */}
            <div className="from-primary/10 absolute top-0 right-0 h-40 w-40 translate-x-20 -translate-y-20 transform rounded-full bg-linear-to-br to-purple-200/20 blur-3xl"></div>
            <div className="to-primary/10 absolute bottom-0 left-0 h-32 w-32 -translate-x-16 translate-y-16 transform rounded-full bg-linear-to-br from-pink-200/20 blur-3xl"></div>

            <CardContent className="relative space-y-6 p-8 sm:p-12">
              <div className="text-lg leading-relaxed text-gray-700">
                <p className="mb-6">
                  안심 방문 미용 서비스{' '}
                  <span className="text-primary font-semibold">&apos;미미살롱펫&apos;</span>은{' '}
                  <span className="font-semibold">2017년 11월 서비스 개시 후</span>
                </p>
                <p className="mb-6">
                  강아지, 고양이들의 미용 스트레스 해소의 가장 좋은 방법은{' '}
                  <span className="text-primary font-semibold">
                    가장 익숙한 공간(집)에서 미용을 하고 보호자가 근처에 있거나 함께 미용을 하는 것
                  </span>
                  입니다.
                </p>
                <p>
                  미미살롱펫은 강아지, 고양이가{' '}
                  <span className="font-semibold text-purple-600">멋진 미용보다는 편안한 미용</span>
                  을 추구합니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  )
}
