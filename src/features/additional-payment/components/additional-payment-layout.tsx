/**
 * 추가 결제 페이지 레이아웃 컴포넌트
 * @module features/additional-payment/components
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * AdditionalPaymentLayout 컴포넌트 Props
 */
export interface AdditionalPaymentLayoutProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  /** 헤더 영역 */
  header?: React.ReactNode
  /** 메인 콘텐츠 영역 (왼쪽) */
  content: React.ReactNode
  /** 사이드바 영역 (오른쪽) */
  sidebar: React.ReactNode
}

/**
 * 추가 결제 페이지 레이아웃
 * @description 추가 결제 페이지의 전체 레이아웃을 제공합니다
 * - 헤더 (페이지 제목 및 설명)
 * - 그리드 레이아웃 (콘텐츠 + 사이드바)
 * - 반응형 디자인 (모바일: 세로 스택, 데스크톱: 2:1 그리드)
 *
 * @example
 * ```tsx
 * <AdditionalPaymentLayout
 *   header={<PageHeader />}
 *   content={<ChargesSection />}
 *   sidebar={<BookingInfo />}
 * />
 * ```
 */
export function AdditionalPaymentLayout({
  className,
  header,
  content,
  sidebar,
  ...props
}: AdditionalPaymentLayoutProps) {
  return (
    <div className={cn('bg-background min-h-screen', className)} {...props}>
      {/* 헤더 영역 */}
      {header && (
        <header className="border-border border-b">
          <div className="container mx-auto px-4 py-4">{header}</div>
        </header>
      )}

      {/* 메인 콘텐츠 영역 */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* 그리드 레이아웃: 모바일 1열, 데스크톱 3열 (2:1 비율) */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* 콘텐츠 영역 (2/3) */}
            <div className="space-y-6 lg:col-span-2">{content}</div>

            {/* 사이드바 영역 (1/3) */}
            <div className="lg:col-span-1">{sidebar}</div>
          </div>
        </div>
      </main>
    </div>
  )
}

/**
 * AdditionalPaymentHeader 컴포넌트 Props
 */
export interface AdditionalPaymentHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 페이지 제목 */
  title?: string
  /** 페이지 설명 */
  description?: string
}

/**
 * 추가 결제 페이지 헤더
 * @description 추가 결제 페이지의 헤더 (제목 및 설명)를 제공합니다
 *
 * @example
 * ```tsx
 * <AdditionalPaymentHeader
 *   title="추가 결제"
 *   description="서비스 중 추가로 발생한 비용을 결제해주세요"
 * />
 * ```
 */
export function AdditionalPaymentHeader({
  className,
  title = '추가 결제',
  description = '서비스 중 추가로 발생한 비용을 결제해주세요',
  ...props
}: AdditionalPaymentHeaderProps) {
  return (
    <div className={cn(className)} {...props}>
      <h1 className="text-foreground text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}

AdditionalPaymentLayout.displayName = 'AdditionalPaymentLayout'
AdditionalPaymentHeader.displayName = 'AdditionalPaymentHeader'
