'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Shield } from 'lucide-react';
import { CUSTOMER_SERVICE } from '@/lib/constants/customer-service';

export default function UnauthorizedPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl space-y-8 text-center">
          <div className="space-y-4">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
              <Shield className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-6xl font-bold text-red-600">403</h1>
            <h2 className="text-foreground text-2xl font-semibold">접근 권한이 없습니다</h2>
            <p className="text-muted-foreground text-lg">
              이 페이지에 접근할 권한이 없습니다.
              <br />
              로그인이 필요하거나 해당 역할의 권한이 필요할 수 있습니다.
            </p>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
            <h3 className="mb-2 font-semibold text-yellow-900">권한 안내</h3>
            <div className="space-y-1 text-sm text-yellow-800">
              <p>
                • <strong>고객</strong>: 예약, 리뷰, 결제 관련 페이지
              </p>
              <p>
                • <strong>미용사</strong>: 스케줄, 고객 관리, 정산 관련 페이지
              </p>
              <p>
                • <strong>관리자</strong>: 시스템 관리 및 운영 관련 페이지
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/auth/signin">로그인하기</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
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
              <p>계정 관련 문의사항이 있으시면 고객센터로 연락주세요.</p>
              <div className="flex flex-col justify-center gap-4 text-sm sm:flex-row">
                <span>{CUSTOMER_SERVICE.PHONE_DISPLAY}</span>
                <span>{CUSTOMER_SERVICE.EMAIL_DISPLAY}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
