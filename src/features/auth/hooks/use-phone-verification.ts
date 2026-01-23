/**
 * Phone verification hook for signup
 * @module features/auth/hooks/use-phone-verification
 */

import { useState, useEffect } from 'react'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'

export interface UsePhoneVerificationReturn {
  phoneVerified: boolean
  verificationCode: string
  verificationError: string
  showVerificationInput: boolean
  cooldownTime: number
  sendingCode: boolean
  verifyingCode: boolean
  setVerificationCode: (code: string) => void
  sendPhoneCode: (phoneNumber: string) => Promise<void>
  verifyPhoneCode: (phoneNumber: string) => Promise<void>
  resetVerification: () => void
}

/**
 * Hook for handling phone verification during signup
 *
 * @example
 * ```tsx
 * const {
 *   phoneVerified,
 *   sendPhoneCode,
 *   verifyPhoneCode,
 *   verificationCode,
 *   setVerificationCode,
 * } = usePhoneVerification();
 *
 * // Send OTP
 * await sendPhoneCode('+821012345678');
 *
 * // Verify OTP
 * await verifyPhoneCode('+821012345678');
 * ```
 */
export function usePhoneVerification(): UsePhoneVerificationReturn {
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationError, setVerificationError] = useState('')
  const [showVerificationInput, setShowVerificationInput] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [sendingCode, setSendingCode] = useState(false)
  const [verifyingCode, setVerifyingCode] = useState(false)

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => setCooldownTime((t) => t - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldownTime])

  const sendPhoneCode = async (phoneNumber: string) => {
    setVerificationError('')

    // Validate phone number format (E.164)
    if (!phoneNumber || !phoneNumber.startsWith('+82')) {
      setVerificationError('올바른 한국 휴대폰 번호를 입력해주세요.')
      return
    }

    try {
      setSendingCode(true)

      // Use better-auth phoneNumber plugin
      const { error } = await authClient.phoneNumber.sendOtp({
        phoneNumber,
      })

      if (error) {
        console.error('Phone OTP send error:', error)
        setVerificationError(error.message || '인증번호 발송 중 오류가 발생했습니다.')
      } else {
        setShowVerificationInput(true)
        setCooldownTime(60) // 60 second cooldown
      }
    } catch (error) {
      console.error('Unexpected error sending phone OTP:', error)
      setVerificationError('인증번호 발송 중 오류가 발생했습니다.')
    } finally {
      setSendingCode(false)
    }
  }

  const verifyPhoneCode = async (phoneNumber: string) => {
    setVerificationError('')

    if (!verificationCode || verificationCode.length !== 6) {
      setVerificationError('올바른 6자리 인증번호를 입력해주세요.')
      return
    }

    try {
      setVerifyingCode(true)

      // Use custom verification API for signup (doesn't require existing user)
      const response = await fetch('/api/auth/verify-phone-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          code: verificationCode,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Phone OTP verify error:', result)
        setVerificationError(result.error || '인증 중 오류가 발생했습니다.')
      } else {
        setPhoneVerified(true)
        setShowVerificationInput(false)
        setVerificationError('')
        toast.success('휴대폰 인증이 완료되었습니다')
      }
    } catch (error) {
      console.error('Unexpected error verifying phone OTP:', error)
      setVerificationError('인증 중 오류가 발생했습니다.')
    } finally {
      setVerifyingCode(false)
    }
  }

  const resetVerification = () => {
    setPhoneVerified(false)
    setVerificationCode('')
    setVerificationError('')
    setShowVerificationInput(false)
    setCooldownTime(0)
  }

  return {
    phoneVerified,
    verificationCode,
    verificationError,
    showVerificationInput,
    cooldownTime,
    sendingCode,
    verifyingCode,
    setVerificationCode,
    sendPhoneCode,
    verifyPhoneCode,
    resetVerification,
  }
}
