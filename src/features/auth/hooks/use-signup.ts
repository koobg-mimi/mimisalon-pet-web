/**
 * Sign-up (customer registration) hook
 * @module features/auth/hooks/use-signup
 */

import { useState } from 'react'
import type { SignUpInput } from '../types/auth.types'

export interface UseSignUpOptions {
  onSuccess?: (email: string) => void
  onError?: (error: string) => void
}

export interface UseSignUpReturn {
  signUp: (data: SignUpInput, phoneVerified: boolean, emailVerified: boolean) => Promise<void>
  isLoading: boolean
  error: string
  success: string
  clearMessages: () => void
}

/**
 * Hook for handling customer sign-up
 *
 * @example
 * ```tsx
 * const { signUp, isLoading, error, success } = useSignUp({
 *   onSuccess: (email) => {
 *     setShowSuccessModal(true);
 *     setUserEmail(email);
 *   },
 * });
 *
 * await signUp(formData, phoneVerified, emailVerified);
 * ```
 */
export function useSignUp(options: UseSignUpOptions = {}): UseSignUpReturn {
  const { onSuccess, onError } = options
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  const signUp = async (data: SignUpInput, phoneVerified: boolean, emailVerified: boolean) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Validation checks
    if (!phoneVerified) {
      const errorMessage = '휴대폰 인증을 완료해주세요.'
      setError(errorMessage)
      onError?.(errorMessage)
      setIsLoading(false)
      return
    }

    if (!emailVerified) {
      const errorMessage = '이메일 인증을 완료해주세요.'
      setError(errorMessage)
      onError?.(errorMessage)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          role: 'CUSTOMER',
          phoneVerified,
        }),
      })

      if (response.ok) {
        const successMessage = '회원가입이 완료되었습니다!'
        setSuccess(successMessage)
        onSuccess?.(data.email)
      } else {
        const result = await response.json()

        let errorMessage = '회원가입 중 오류가 발생했습니다.'
        if (result.code === 'EMAIL_ALREADY_EXISTS') {
          errorMessage = '이미 가입된 이메일입니다.'
        } else if (result.message) {
          errorMessage = result.message
        }

        setError(errorMessage)
        onError?.(errorMessage)
      }
    } catch (err) {
      const errorMessage = '회원가입 중 오류가 발생했습니다.'
      setError(errorMessage)
      onError?.(errorMessage)
      console.error('Sign-up error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    signUp,
    isLoading,
    error,
    success,
    clearMessages,
  }
}
