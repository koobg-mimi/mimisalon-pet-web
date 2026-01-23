'use client'

import { ReactNode } from 'react'
import Image from 'next/image'
import { MobileNavigation } from './mobile-navigation'
import { BottomNavigation } from './bottom-navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BellIcon, MessageCircleIcon, UserIcon, SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResponsiveLayoutProps {
  children: ReactNode
  userRole: 'CUSTOMER' | 'GROOMER' | 'ADMIN'
  user?: {
    name: string
    avatar?: string
    role: string
  }
  unreadNotifications?: number
  unreadMessages?: number
  showSearch?: boolean
  title?: string
  subtitle?: string
  headerActions?: ReactNode
  className?: string
}

export function ResponsiveLayout({
  children,
  userRole,
  user,
  unreadNotifications = 0,
  unreadMessages = 0,
  showSearch = false,
  title,
  subtitle,
  headerActions,
  className,
}: ResponsiveLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side - Menu */}
          <div className="flex items-center space-x-3">
            <MobileNavigation
              userRole={userRole}
              unreadNotifications={unreadNotifications}
              unreadMessages={unreadMessages}
            />

            {/* Title/Logo */}
            <div>
              {title ? (
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                  {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                </div>
              ) : (
                <h1 className="text-primary text-xl font-bold">미미살롱</h1>
              )}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            {showSearch && (
              <Button variant="ghost" size="sm">
                <SearchIcon className="h-5 w-5" />
              </Button>
            )}

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <BellIcon className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                >
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </Badge>
              )}
            </Button>

            {/* Messages */}
            <Button variant="ghost" size="sm" className="relative">
              <MessageCircleIcon className="h-5 w-5" />
              {unreadMessages > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                >
                  {unreadMessages > 99 ? '99+' : unreadMessages}
                </Badge>
              )}
            </Button>

            {/* User Avatar */}
            <Button variant="ghost" size="sm" className="rounded-full p-1">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                  <UserIcon className="h-4 w-4 text-gray-600" />
                </div>
              )}
            </Button>

            {/* Custom header actions */}
            {headerActions}
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          {/* Desktop navigation content would go here */}
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-primary text-2xl font-bold">미미살롱</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {/* Desktop navigation items would be implemented here */}
              <div className="mt-8 text-center text-gray-500">
                <p>Desktop navigation</p>
                <p className="text-sm">coming soon</p>
              </div>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1',
          'lg:pl-64', // Desktop: account for sidebar
          'pb-20 sm:pb-0' // Mobile: account for bottom navigation
        )}
      >
        {/* Desktop Header */}
        <div className="hidden border-b border-gray-200 bg-white px-6 py-4 lg:block">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                  {subtitle && <p className="text-gray-500">{subtitle}</p>}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {showSearch && (
                <div className="relative">
                  <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="text"
                    placeholder="검색..."
                    className="focus:ring-primary focus:border-primary w-64 rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2"
                  />
                </div>
              )}

              {/* Desktop notifications and user menu */}
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="relative">
                  <BellIcon className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                    >
                      {unreadNotifications > 99 ? '99+' : unreadNotifications}
                    </Badge>
                  )}
                </Button>

                <Button variant="ghost" size="sm" className="relative">
                  <MessageCircleIcon className="h-5 w-5" />
                  {unreadMessages > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                    >
                      {unreadMessages > 99 ? '99+' : unreadMessages}
                    </Badge>
                  )}
                </Button>

                {user && (
                  <div className="flex items-center space-x-3">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                        <UserIcon className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                    <div className="hidden xl:block">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </div>
                )}

                {headerActions}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        userRole={userRole}
        unreadNotifications={unreadNotifications}
        unreadMessages={unreadMessages}
      />
    </div>
  )
}
