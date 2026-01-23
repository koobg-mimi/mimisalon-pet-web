/**
 * Sign-in / Sign-up page (thin wrapper)
 * @module app/auth/signin
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, LogIn, Lock, PawPrint, Sparkles, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SignInForm, SignUpForm } from '@/features/auth/components'

/**
 * Thin page wrapper that composes authentication forms
 *
 * This page demonstrates the "thin wrapper" pattern from PROJECT_ARCHITECTURE.md:
 * - No business logic (delegated to hooks in features/auth/hooks/)
 * - No complex state management (delegated to form components)
 * - Only UI composition and routing logic
 * - Imports from feature slices (@/features/auth/components)
 */
export default function SignInPage() {
  const [isSignupMode, setIsSignupMode] = useState(false)
  const [isDevelopment, setIsDevelopment] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const message = searchParams.get('message')
  const errorParam = searchParams.get('error')
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  // Set development mode only on client side to prevent hydration mismatch
  useEffect(() => {
    setIsDevelopment(process.env.NODE_ENV === 'development')
  }, [])

  // Display specific error messages from URL params
  const initialError =
    errorParam === 'INACTIVE_GROOMER'
      ? '미용사 계정이 비활성화 상태입니다. 관리자 승인을 기다려주세요.'
      : null

  const toggleSignupMode = () => {
    setIsSignupMode(!isSignupMode)
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <Sparkles className="text-primary h-8 w-8" />
            <PawPrint className="text-primary h-8 w-8" />
          </div>
          <h1 className="text-primary text-2xl font-bold">미미살롱펫</h1>
          <p className="text-muted-foreground">프리미엄 방문 반려동물 미용</p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-800">{message}</p>
          </div>
        )}

        {/* Initial Error Message */}
        {initialError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{initialError}</p>
          </div>
        )}

        {/* Main Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>{isSignupMode ? '회원가입' : '로그인'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Render appropriate form based on mode */}
              {!isSignupMode ? (
                <SignInForm
                  callbackUrl={callbackUrl}
                  onForgotPassword={() => router.push('/auth/forgot-password')}
                  showTestAccounts={isDevelopment}
                />
              ) : (
                <SignUpForm showDebug={isDevelopment} />
              )}

              {/* Toggle between Sign In / Sign Up */}
              <div className="text-center">
                {isSignupMode ? (
                  <Button variant="outline" onClick={toggleSignupMode} className="w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    이미 계정이 있으신가요? 로그인하기
                  </Button>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => router.push('/auth/forgot-password')}
                      className="w-full"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      비밀번호를 잊으셨나요?
                    </Button>
                    <Button variant="outline" onClick={toggleSignupMode} className="w-full">
                      <UserPlus className="mr-2 h-4 w-4" />
                      처음이신가요? 회원가입하기
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home Button */}
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            메인으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  )
}
