'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession, authClient } from '@/lib/auth-client';
import { Home, LogOut, PawPrint, Scissors, Shield, Sparkles } from 'lucide-react';

import { AppSidebar } from '../app-sidebar';
import { Button } from '../ui/button';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { useWebViewBridge } from '@/hooks/use-webview-bridge';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onBackToLanding?: () => void;
}

export function DashboardLayout({ children, onBackToLanding }: DashboardLayoutProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { isWebView, sendUserLogout } = useWebViewBridge();

  // Note: ExponentPushToken is now handled via HTTP API in React Native
  // WebView bridge automatically sends user data when session is available

  // Handle logout
  const handleLogout = async () => {
    try {
      // Send logout message to React Native WebView
      if (isWebView) {
        sendUserLogout();
      }

      await authClient.signOut();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle back to landing
  const handleBackToLanding = () => {
    if (onBackToLanding) {
      onBackToLanding();
    } else if (session?.user?.role) {
      // Use role-specific back to landing handlers
      switch (session.user.role) {
        case 'CUSTOMER':
          router.push('/customer/dashboard/overview');
          break;
        case 'GROOMER':
          router.push('/groomer/dashboard/overview');
          break;
        case 'ADMIN':
          router.push('/admin/dashboard/overview');
          break;
        default:
          router.push('/');
      }
    } else {
      router.push('/');
    }
  };

  // Loading state
  if (isPending) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Sparkles className="text-primary mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated state
  if (!session || !session?.user) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Shield className="text-destructive mx-auto mb-4 h-8 w-8" />
          <p className="text-muted-foreground">인증이 필요합니다</p>
          <Button onClick={handleBackToLanding} className="mt-4">
            로그인 페이지로 이동
          </Button>
        </div>
      </div>
    );
  }

  const user = session.user;

  // Get role-specific icon
  const getRoleIcon = () => {
    switch (user.role) {
      case 'CUSTOMER':
        return <PawPrint className="text-primary h-6 w-6" />;
      case 'GROOMER':
        return <Scissors className="text-primary h-6 w-6" />;
      case 'ADMIN':
        return <Shield className="text-primary h-6 w-6" />;
      default:
        return <Sparkles className="text-primary h-6 w-6" />;
    }
  };

  // Get role-specific title
  const getRoleTitle = () => {
    switch (user.role) {
      case 'CUSTOMER':
        return '고객';
      case 'GROOMER':
        return '미용사';
      case 'ADMIN':
        return '관리자';
      default:
        return '사용자';
    }
  };

  // Get role-specific data attributes
  const getRoleDataAttr = () => {
    switch (user.role) {
      case 'CUSTOMER':
        return {
          'data-testid': 'customer-dashboard',
          'data-role': 'customer-dashboard',
        };
      case 'GROOMER':
        return {
          'data-testid': 'groomer-dashboard',
          'data-role': 'groomer-dashboard',
        };
      case 'ADMIN':
        return {
          'data-testid': 'admin-dashboard',
          'data-role': 'admin-dashboard',
        };
      default:
        return { 'data-testid': 'dashboard', 'data-role': 'dashboard' };
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="bg-background min-h-screen" {...getRoleDataAttr()}>
          {/* Header */}
          <header className="bg-card border-b">
            <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="flex flex-shrink-0 items-center space-x-1 sm:space-x-2">
                <Sparkles className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
                {getRoleIcon()}
              </div>
              <div className="min-w-0 flex-1">
                {/* Mobile: Shorter title */}
                <h1 className="truncate text-base font-bold sm:text-xl">
                  <span className="hidden sm:inline">
                    {user.name || '사용자'} 님의 미미살롱펫 {getRoleTitle()} 대시보드
                  </span>
                  <span className="sm:hidden">{getRoleTitle()} 대시보드</span>
                </h1>
              </div>
              {/* Right side - Actions */}
              <div className="flex flex-shrink-0 items-center space-x-1 sm:space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToLanding}
                  className="p-2 sm:px-3"
                  title="홈으로"
                >
                  <Home className="h-4 w-4" />
                  <span className="ml-2 hidden lg:inline">홈</span>
                </Button>
                <div data-testid="user-menu" aria-label="User menu">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    data-testid="logout-button"
                    className="p-2 sm:px-3"
                    title="로그아웃"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">로그아웃</span>
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
