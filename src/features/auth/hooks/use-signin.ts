/**
 * Sign-in authentication hook
 * @module features/auth/hooks/use-signin
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useWebViewBridge } from '@/hooks/use-webview-bridge'
import { getRoleDashboardUrl } from '../utils/role-routing'
import type { SignInInput, WebViewUserData } from '../types/auth.types'
import { UserRole } from '@prisma/client'

export interface UseSignInOptions {
  callbackUrl?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export interface UseSignInReturn {
  signIn: (data: SignInInput) => Promise<void>
  isLoading: boolean
  error: string
  clearError: () => void
}

/**
 * Hook for handling sign-in authentication flow
 *
 * @example
 * ```tsx
 * const { signIn, isLoading, error } = useSignIn({
 *   callbackUrl: '/dashboard',
 *   onSuccess: () => toast.success('Logged in!'),
 * });
 *
 * await signIn({ email, password, rememberMe: true });
 * ```
 */
export function useSignIn(options: UseSignInOptions = {}): UseSignInReturn {
  const { callbackUrl = '/', onSuccess, onError } = options
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { sendUserLogin, isWebView } = useWebViewBridge()

  const clearError = () => setError('')

  const signIn = async (data: SignInInput) => {
    setIsLoading(true)
    setError('')

    try {
      const { data: result, error: authError } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: callbackUrl || '/dashboard',
      })

      if (authError) {
        const errorMessage = '이메일 또는 비밀번호가 잘못되었습니다.'
        setError(errorMessage)
        onError?.(errorMessage)
        return
      }

      if (result) {
        // Handle remember me functionality
        if (data.rememberMe) {
          localStorage.setItem('rememberEmail', data.email)
        } else {
          localStorage.removeItem('rememberEmail')
        }

        // Wait for session to be established
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Get session and send to WebView if needed
        const { data: session } = await authClient.getSession()

        if (session?.user) {
          console.log('🔄 Login successful, sending user data to React Native')

          // Send user login message to React Native WebView
          if (isWebView) {
            const userData: WebViewUserData = {
              userId: session.user.id,
              email: session.user.email || '',
              name: session.user.name || '',
              phoneNumber: session.user.phoneNumber || '',
              role: (session.user.role ?? UserRole.CUSTOMER) as UserRole,
            }
            sendUserLogin(userData)
          }

          // Role-based navigation
          const dashboardUrl = getRoleDashboardUrl(
            session.user.role as UserRole | undefined,
            callbackUrl
          )
          router.push(dashboardUrl)

          onSuccess?.()
        } else {
          router.push(callbackUrl)
          onSuccess?.()
        }
      }
    } catch (err) {
      const errorMessage = '로그인 중 오류가 발생했습니다.'
      setError(errorMessage)
      onError?.(errorMessage)
      console.error('Sign-in error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    signIn,
    isLoading,
    error,
    clearError,
  }
}
