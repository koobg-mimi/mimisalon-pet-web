'use client'

import { useCallback, useState } from 'react'
import { authClient, useSession } from '@/lib/auth-client'
import { toast } from 'sonner'

export interface UsePhoneUpdateReturn {
  /** Current phone number from session (user.phoneNumber) */
  phoneNumber: string | null
  /** Phone verification status from session (user.phoneNumberVerified) */
  phoneNumberVerified: boolean
  /** Whether phone update operation is in progress */
  isLoading: boolean
  /** Send OTP to phone number */
  sendOtp: (phoneNumber: string) => Promise<boolean>
  /** Verify OTP and update user's phone number */
  verifyAndUpdate: (phoneNumber: string, code: string) => Promise<boolean>
  /** User role from session */
  userRole: 'CUSTOMER' | 'GROOMER' | 'ADMIN' | null
}

/**
 * Hook for updating user's phone number using better-auth phoneNumber plugin
 *
 * @example
 * ```tsx
 * const { phone, phoneVerified, sendOtp, verifyAndUpdate } = usePhoneUpdate();
 *
 * // Step 1: Send OTP
 * await sendOtp('+821012345678');
 *
 * // Step 2: Verify and update
 * await verifyAndUpdate('+821012345678', '123456');
 * ```
 */
export function usePhoneUpdate(): UsePhoneUpdateReturn {
  const { data: session, isPending } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  if (!session) {
    throw new Error('usePhoneUpdate must be used within a SessionProvider')
  }

  const user = session.user
  const phoneNumber = user.phoneNumber || null
  const phoneNumberVerified = user.phoneNumberVerified || false
  const userRole = user?.role as 'CUSTOMER' | 'GROOMER' | 'ADMIN' | null

  /**
   * Send OTP code to phone number
   */
  const sendOtp = useCallback(async (phoneNumber: string): Promise<boolean> => {
    if (!phoneNumber) {
      toast.error('전화번호를 입력해주세요.')
      return false
    }

    // Validate phone number format (E.164)
    if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
      toast.error('올바른 전화번호 형식이 아닙니다. (예: +821012345678)')
      return false
    }

    setIsLoading(true)

    try {
      console.log('📱 Sending SMS OTP to:', phoneNumber)

      await authClient.phoneNumber.sendOtp({
        phoneNumber,
      })

      console.log('✅ SMS OTP sent successfully')
      toast.success('인증 코드가 전송되었습니다.')
      return true
    } catch (error) {
      if (error instanceof Error) {
        console.error('❌ Failed to send SMS OTP:', error)
        toast.error(error?.message || '인증 코드 전송에 실패했습니다.')
      } else {
        console.error('❌ Unknown error sending SMS OTP:', error)
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Verify OTP code and update user's phone number
   */
  const verifyAndUpdate = useCallback(
    async (phoneNumber: string, code: string): Promise<boolean> => {
      if (!phoneNumber || !code) {
        toast.error('전화번호와 인증 코드를 입력해주세요.')
        return false
      }

      if (code.length !== 6) {
        toast.error('인증 코드는 6자리입니다.')
        return false
      }

      setIsLoading(true)

      try {
        console.log('🔍 Verifying SMS OTP:', { phoneNumber, code })

        const result = await authClient.phoneNumber.verify({
          phoneNumber,
          code,
          updatePhoneNumber: true, // Update user's phone number
        })

        if (result.error) {
          console.error('❌ OTP verification failed:', result.error)
          toast.error(result.error.message || '인증에 실패했습니다.')
          return false
        }

        console.log('✅ Phone number verified and updated successfully')
        toast.success('전화번호가 인증되었습니다.')

        // Session will be automatically updated by better-auth
        // Optionally trigger a session refresh if needed
        window.location.reload()

        return true
      } catch (error: any) {
        console.error('❌ Phone verification error:', error)
        toast.error(error?.message || '인증 중 오류가 발생했습니다.')
        return false
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    phoneNumber,
    phoneNumberVerified,
    isLoading: isPending || isLoading,
    sendOtp,
    verifyAndUpdate,
    userRole,
  }
}
