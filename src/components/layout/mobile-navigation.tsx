'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  MenuIcon,
  HomeIcon,
  CalendarIcon,
  MessageCircleIcon,
  BellIcon,
  UserIcon,
  ScissorsIcon,
  CreditCardIcon,
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon,
  XIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  description?: string
}

interface MobileNavigationProps {
  userRole: 'CUSTOMER' | 'GROOMER' | 'ADMIN'
  unreadNotifications?: number
  unreadMessages?: number
  className?: string
}

const CUSTOMER_NAVIGATION: NavigationItem[] = [
  {
    label: '홈',
    href: '/customer',
    icon: HomeIcon,
    description: '대시보드 및 최근 활동',
  },
  {
    label: '예약 관리',
    href: '/customer/bookings',
    icon: CalendarIcon,
    description: '예약 내역 및 일정 관리',
  },
  {
    label: '서비스',
    href: '/customer/services',
    icon: ScissorsIcon,
    description: '이용 가능한 미용 서비스',
  },
  {
    label: '메시지',
    href: '/customer/messages',
    icon: MessageCircleIcon,
    description: '미용사와의 채팅',
  },
  {
    label: '알림',
    href: '/customer/notifications',
    icon: BellIcon,
    description: '예약 및 서비스 알림',
  },
  {
    label: '결제 내역',
    href: '/customer/payments',
    icon: CreditCardIcon,
    description: '결제 및 환불 내역',
  },
  {
    label: '내 정보',
    href: '/customer/profile',
    icon: UserIcon,
    description: '프로필 및 반려동물 정보',
  },
]

const GROOMER_NAVIGATION: NavigationItem[] = [
  {
    label: '대시보드',
    href: '/groomer/dashboard/overview',
    icon: HomeIcon,
    description: '오늘의 일정 및 요약',
  },
  {
    label: '예약 관리',
    href: '/groomer/dashboard/bookings',
    icon: CalendarIcon,
    description: '고객 예약 확인 및 관리',
  },
  {
    label: '메시지',
    href: '/groomer/dashboard/messages',
    icon: MessageCircleIcon,
    description: '고객과의 채팅',
  },
  {
    label: '알림',
    href: '/groomer/dashboard/notifications',
    icon: BellIcon,
    description: '예약 및 업무 알림',
  },
  {
    label: '내 정보',
    href: '/groomer/dashboard/profile',
    icon: UserIcon,
    description: '프로필 및 업무 설정',
  },
]

const ADMIN_NAVIGATION: NavigationItem[] = [
  {
    label: '대시보드',
    href: '/admin/dashboard/overview',
    icon: HomeIcon,
    description: '전체 현황 및 통계',
  },
  {
    label: '서비스 관리',
    href: '/admin/services',
    icon: ScissorsIcon,
    description: '서비스 등록 및 수정',
  },
  {
    label: '예약 관리',
    href: '/admin/bookings',
    icon: CalendarIcon,
    description: '전체 예약 현황',
  },
  {
    label: '사용자 관리',
    href: '/admin/users',
    icon: UserIcon,
    description: '고객 및 미용사 관리',
  },
  {
    label: '알림',
    href: '/admin/notifications',
    icon: BellIcon,
    description: '시스템 알림 관리',
  },
]

const COMMON_NAVIGATION: NavigationItem[] = [
  {
    label: '설정',
    href: '/settings',
    icon: SettingsIcon,
    description: '앱 설정 및 환경설정',
  },
  {
    label: '고객센터',
    href: '/support',
    icon: HelpCircleIcon,
    description: '문의 및 도움말',
  },
]

export function MobileNavigation({
  userRole,
  unreadNotifications = 0,
  unreadMessages = 0,
  className,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const getNavigationItems = () => {
    switch (userRole) {
      case 'CUSTOMER':
        return CUSTOMER_NAVIGATION
      case 'GROOMER':
        return GROOMER_NAVIGATION
      case 'ADMIN':
        return ADMIN_NAVIGATION
      default:
        return []
    }
  }

  const navigationItems = getNavigationItems()

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  const getBadgeCount = (href: string) => {
    if (href.includes('/notifications')) return unreadNotifications
    if (href.includes('/messages')) return unreadMessages
    return undefined
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'CUSTOMER':
        return '고객'
      case 'GROOMER':
        return '미용사'
      case 'ADMIN':
        return '관리자'
      default:
        return ''
    }
  }

  return (
    <div className={cn('lg:hidden', className)}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="relative min-h-[44px] min-w-[44px] p-2">
            <MenuIcon className="h-6 w-6" />
            {(unreadNotifications > 0 || unreadMessages > 0) && (
              <div className="absolute top-2 right-2 h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
            )}
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-80 p-0">
          <div className="flex h-full flex-col">
            {/* 헤더 */}
            <SheetHeader className="border-b p-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <SheetTitle className="text-left">미미살롱</SheetTitle>
                  <SheetDescription className="text-left">
                    {getRoleLabel(userRole)} 메뉴
                  </SheetDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>
            </SheetHeader>

            {/* 내비게이션 목록 */}
            <div className="flex-1 overflow-y-auto">
              <nav className="space-y-2 p-4">
                {/* 주요 메뉴 */}
                <div className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/' && pathname.startsWith(item.href))
                    const badgeCount = getBadgeCount(item.href)

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={cn(
                          'flex min-h-[48px] items-center space-x-3 rounded-lg px-4 py-3 transition-all',
                          'active:scale-[0.98] active:opacity-90', // Touch feedback
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground active:bg-muted'
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.label}</span>
                            {badgeCount && badgeCount > 0 && (
                              <Badge
                                variant={isActive ? 'secondary' : 'destructive'}
                                className="rounded-full px-2 py-1 text-xs"
                              >
                                {badgeCount}
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <p className="mt-1 text-xs opacity-70">{item.description}</p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {/* 구분선 */}
                <div className="my-6 border-t" />

                {/* 공통 메뉴 */}
                <div className="space-y-1">
                  {COMMON_NAVIGATION.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={cn(
                          'flex min-h-[48px] items-center space-x-3 rounded-lg px-4 py-3 transition-all',
                          'active:scale-[0.98] active:opacity-90', // Touch feedback
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground active:bg-muted'
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="font-medium">{item.label}</span>
                          {item.description && (
                            <p className="mt-1 text-xs opacity-70">{item.description}</p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </nav>
            </div>

            {/* 하단 로그아웃 */}
            <div className="border-t p-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => {
                  // 로그아웃 처리
                  console.log('Logout')
                  handleLinkClick()
                }}
              >
                <LogOutIcon className="mr-3 h-5 w-5" />
                로그아웃
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
