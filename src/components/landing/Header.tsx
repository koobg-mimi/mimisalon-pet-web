'use client'

import { useState } from 'react'
import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Calendar, Home, LogIn, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    <header className="bg-card sticky top-0 z-50 border-b" data-cy="header">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and brand - responsive sizing */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Brand mark */}
            <div className="ring-border flex h-11 w-11 items-center justify-center rounded-md bg-white p-1 shadow-sm ring-1 sm:h-12 sm:w-12">
              <Image
                src="/icon.svg"
                alt="미미살롱펫 로고"
                width={40}
                height={40}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-primary text-lg font-bold sm:text-2xl">미미살롱펫</h1>
              <p className="text-muted-foreground hidden text-xs sm:block sm:text-sm">
                프리미엄 방문 반려동물 미용
              </p>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden items-center space-x-3 md:flex">
            {isLoggedIn && currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="bg-secondary/50 rounded-lg border px-3 py-2 text-sm">
                  <span className="text-muted-foreground">안녕하세요, </span>
                  <span className="text-primary font-semibold">{currentUser.name}님</span>
                </div>
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleLoginClick}
                  className="font-medium"
                  aria-label={
                    currentUser.role === 'CUSTOMER' ? '예약현황으로 이동' : '대시보드로 이동'
                  }
                >
                  <Home className="mr-2 h-4 w-4" />
                  {currentUser.role === 'CUSTOMER' ? '예약현황' : '대시보드'}
                </Button>
                <Button
                  variant="cta"
                  size="default"
                  onClick={handleBookingClick}
                  className="font-semibold shadow-lg"
                  aria-label="펫 미용 예약하기"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  예약하기
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleLoginClick}
                  className="font-medium"
                  aria-label="로그인 페이지로 이동"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  로그인
                </Button>
                <Button
                  variant="cta"
                  size="default"
                  onClick={handleBookingClick}
                  className="font-semibold shadow-lg"
                  aria-label="펫 미용 예약하기"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  예약하기
                </Button>
              </div>
            )}
          </div>

          {/* Mobile navigation */}
          <div className="flex items-center space-x-2 md:hidden">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={mobileMenuOpen}
              className="hover:bg-accent/80 focus:bg-accent/80 relative rounded-lg"
            >
              <div className="relative h-5 w-5">
                <Menu
                  className={`absolute h-5 w-5 transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'
                  }`}
                />
                <X
                  className={`absolute h-5 w-5 transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-45 opacity-0'
                  }`}
                />
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-border mt-4 border-t pb-4">
            <div className="flex flex-col space-y-3 pt-4">
              {isLoggedIn && currentUser ? (
                <>
                  <div className="bg-secondary/30 mx-2 rounded-lg border px-4 py-3 text-sm">
                    <span className="text-muted-foreground">안녕하세요, </span>
                    <span className="text-primary font-semibold">{currentUser.name}님</span>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      handleLoginClick()
                      setMobileMenuOpen(false)
                    }}
                    className="mx-2 justify-start font-medium"
                    aria-label={
                      currentUser.role === 'CUSTOMER' ? '예약현황으로 이동' : '대시보드로 이동'
                    }
                  >
                    <Home className="mr-3 h-5 w-5" />
                    {currentUser.role === 'CUSTOMER' ? '예약현황' : '대시보드'}
                  </Button>
                  <Button
                    variant="mobile-primary"
                    size="lg"
                    onClick={() => {
                      handleBookingClick()
                      setMobileMenuOpen(false)
                    }}
                    className="mx-2 justify-start shadow-lg"
                    aria-label="펫 미용 예약하기"
                  >
                    <Calendar className="mr-3 h-5 w-5" />
                    예약하기
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      handleLoginClick()
                      setMobileMenuOpen(false)
                    }}
                    className="mx-2 justify-start font-medium"
                    aria-label="로그인 페이지로 이동"
                  >
                    <LogIn className="mr-3 h-5 w-5" />
                    로그인
                  </Button>
                  <Button
                    variant="mobile-primary"
                    size="lg"
                    onClick={() => {
                      handleBookingClick()
                      setMobileMenuOpen(false)
                    }}
                    className="mx-2 justify-start shadow-lg"
                    aria-label="펫 미용 예약하기"
                  >
                    <Calendar className="mr-3 h-5 w-5" />
                    예약하기
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
