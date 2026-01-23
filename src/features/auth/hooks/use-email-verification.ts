/**
 * Email verification hook for signup
 * @module features/auth/hooks/use-email-verification
 */

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'

export interface UseEmailVerificationReturn {
  emailVerified: boolean
  showEmailOTPDialog: boolean
  sendingEmailCode: boolean
  setShowEmailOTPDialog: (show: boolean) => void
  sendEmailVerificationCode: (email: string) => Promise<void>
  handleEmailVerificationSuccess: () => void
  resetEmailVerification: () => void
}

/**
 * Hook for handling email verification during signup
 *
 * @example
 * ```tsx
 * const {
 *   emailVerified,
 *   showEmailOTPDialog,
 *   sendEmailVerificationCode,
 *   handleEmailVerificationSuccess,
 * } = useEmailVerification();
 *
 * // Send verification code
 * await sendEmailVerificationCode('user@example.com');
 *
 * // Handle success (called by OTPInputDialog)
 * handleEmailVerificationSuccess();
 * ```
 */
export function useEmailVerification(): UseEmailVerificationReturn {
  const [emailVerified, setEmailVerified] = useState(false)
  const [showEmailOTPDialog, setShowEmailOTPDialog] = useState(false)
  const [sendingEmailCode, setSendingEmailCode] = useState(false)

  const sendEmailVerificationCode = async (email: string) => {
    if (!email) {
      toast.error('이메일 주소를 입력해주세요')
      return
    }

    setSendingEmailCode(true)

    try {
      // Use authClient's emailOtp plugin directly
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'email-verification',
      })

      toast.success('이메일로 인증코드가 전송되었습니다')
      setShowEmailOTPDialog(true)
    } catch (error) {
      console.error('Email verification error:', error)
      toast.error('인증코드 전송 중 오류가 발생했습니다')
    } finally {
      setSendingEmailCode(false)
    }
  }

  const handleEmailVerificationSuccess = () => {
    setEmailVerified(true)
    setShowEmailOTPDialog(false)
    toast.success('이메일 인증이 완료되었습니다')
  }

  const resetEmailVerification = () => {
    setEmailVerified(false)
    setShowEmailOTPDialog(false)
  }

  return {
    emailVerified,
    showEmailOTPDialog,
    sendingEmailCode,
    setShowEmailOTPDialog,
    sendEmailVerificationCode,
    handleEmailVerificationSuccess,
    resetEmailVerification,
  }
}
