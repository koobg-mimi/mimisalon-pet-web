'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, Scissors, UserCog, Zap } from 'lucide-react'

/**
 * QuickActions 컴포넌트
 *
 * 관리자 대시보드에서 자주 사용하는 작업들에 빠르게 접근할 수 있는 버튼 모음입니다.
 * 각 버튼은 Next.js Link 컴포넌트를 사용하여 해당 관리 페이지로 라우팅합니다.
 *
 * @example
 * ```tsx
 * <QuickActions />
 * ```
 */
export function QuickActions() {
  const actions = [
    {
      label: '미용사 관리',
      href: '/admin/dashboard/groomers',
      icon: Scissors,
      variant: 'secondary' as const,
      description: '미용사 목록과 일정을 관리합니다.',
    },
    {
      label: '서비스 관리',
      href: '/admin/dashboard/services',
      icon: Zap,
      variant: 'secondary' as const,
      description: '서비스 메뉴와 가격을 관리합니다.',
    },
    {
      label: '사용자 관리',
      href: '/admin/dashboard/users',
      icon: Users,
      variant: 'secondary' as const,
      description: '고객과 관리자 계정을 관리합니다.',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="text-primary h-5 w-5" />
          빠른 작업
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.href}
                variant={action.variant}
                className="h-auto w-full justify-start gap-3 p-4 transition-all hover:scale-[1.02]"
                asChild
              >
                <Link href={action.href}>
                  <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="text-primary h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{action.label}</div>
                    <div className="text-muted-foreground text-xs font-normal">
                      {action.description}
                    </div>
                  </div>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
