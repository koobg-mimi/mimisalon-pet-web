'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'
import { CUSTOMER_SERVICE } from '@/lib/constants/customer-service'

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl space-y-8 text-center">
          <div className="space-y-4">
            <div className="bg-primary/10 mx-auto flex h-24 w-24 items-center justify-center rounded-full">
              <span className="text-4xl">🐕</span>
            </div>
            <h1 className="text-primary text-6xl font-bold">404</h1>
            <h2 className="text-foreground text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground text-lg">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
              <br />
              URL을 다시 확인해 주세요.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                홈으로 돌아가기
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => history.back()}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              이전 페이지로
            </Button>
          </div>

          <div className="border-border border-t pt-8">
            <div className="text-muted-foreground space-y-2 text-sm">
              <p>문제가 지속되면 고객센터로 문의해 주세요.</p>
              <div className="flex flex-col justify-center gap-4 text-sm sm:flex-row">
                <span>{CUSTOMER_SERVICE.PHONE_DISPLAY}</span>
                <span>{CUSTOMER_SERVICE.EMAIL_DISPLAY}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
