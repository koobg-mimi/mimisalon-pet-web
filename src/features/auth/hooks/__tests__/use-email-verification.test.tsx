/**
 * Tests for useEmailVerification hook
 * @module features/auth/hooks/__tests__/use-email-verification
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEmailVerification } from '../use-email-verification'

// Mock dependencies
vi.mock('@/lib/auth-client', () => ({
  authClient: {
    emailOtp: {
      sendVerificationOtp: vi.fn(),
    },
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Import mocked modules
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'

describe('useEmailVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial state', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useEmailVerification())

      expect(result.current.emailVerified).toBe(false)
      expect(result.current.showEmailOTPDialog).toBe(false)
      expect(result.current.sendingEmailCode).toBe(false)
    })

    it('should provide all required functions', () => {
      const { result } = renderHook(() => useEmailVerification())

      expect(typeof result.current.setShowEmailOTPDialog).toBe('function')
      expect(typeof result.current.sendEmailVerificationCode).toBe('function')
      expect(typeof result.current.handleEmailVerificationSuccess).toBe('function')
      expect(typeof result.current.resetEmailVerification).toBe('function')
    })
  })

  describe('sendEmailVerificationCode', () => {
    it('should send verification code successfully', async () => {
      const mockSendVerificationOtp = vi.mocked(authClient.emailOtp.sendVerificationOtp)
      mockSendVerificationOtp.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.sendEmailVerificationCode('user@example.com')
      })

      expect(mockSendVerificationOtp).toHaveBeenCalledWith({
        email: 'user@example.com',
        type: 'email-verification',
      })
    })

    it('should show OTP dialog after sending', async () => {
      const mockSendVerificationOtp = vi.mocked(authClient.emailOtp.sendVerificationOtp)
      mockSendVerificationOtp.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useEmailVerification())

      expect(result.current.showEmailOTPDialog).toBe(false)

      await act(async () => {
        await result.current.sendEmailVerificationCode('user@example.com')
      })

      expect(result.current.showEmailOTPDialog).toBe(true)
    })

    it('should show success toast after sending', async () => {
      const mockSendVerificationOtp = vi.mocked(authClient.emailOtp.sendVerificationOtp)
      mockSendVerificationOtp.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.sendEmailVerificationCode('user@example.com')
      })

      expect(toast.success).toHaveBeenCalledWith('이메일로 인증코드가 전송되었습니다')
    })

    it('should validate email presence', async () => {
      const mockSendVerificationOtp = vi.mocked(authClient.emailOtp.sendVerificationOtp)
      mockSendVerificationOtp.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.sendEmailVerificationCode('user@example.com')
      })

      expect(toast.error).not.toHaveBeenCalled()
    })

    it('should fail for empty email', async () => {
      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.sendEmailVerificationCode('')
      })

      expect(toast.error).toHaveBeenCalledWith('이메일 주소를 입력해주세요')
      expect(authClient.emailOtp.sendVerificationOtp).not.toHaveBeenCalled()
      expect(result.current.showEmailOTPDialog).toBe(false)
    })

    it('should handle send errors', async () => {
      const mockSendVerificationOtp = vi.mocked(authClient.emailOtp.sendVerificationOtp)
      mockSendVerificationOtp.mockRejectedValueOnce(new Error('Email send failed'))

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.sendEmailVerificationCode('user@example.com')
      })

      expect(toast.error).toHaveBeenCalledWith('인증코드 전송 중 오류가 발생했습니다')
      expect(result.current.showEmailOTPDialog).toBe(false)
    })

    it('should set sendingEmailCode loading state to true during send', async () => {
      const mockSendVerificationOtp = vi.mocked(authClient.emailOtp.sendVerificationOtp)
      let resolvePromise: (() => void) | undefined
      mockSendVerificationOtp.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolvePromise = () => resolve(undefined)
          })
      )

      const { result } = renderHook(() => useEmailVerification())

      expect(result.current.sendingEmailCode).toBe(false)

      // Start the async operation without awaiting (wrapped in act to avoid warnings)
      let sendPromise: Promise<void> | undefined
      act(() => {
        sendPromise = result.current.sendEmailVerificationCode('user@example.com')
      })

      // Check that loading state is true
      await act(async () => {
        await Promise.resolve() // Flush microtasks
      })

      expect(result.current.sendingEmailCode).toBe(true)

      // Resolve the promise and wait for completion
      await act(async () => {
        resolvePromise!()
        await sendPromise
      })

      // Loading state should be false after send completes
      expect(result.current.sendingEmailCode).toBe(false)
    })

    it('should set sendingEmailCode to false after successful send', async () => {
      const mockSendVerificationOtp = vi.mocked(authClient.emailOtp.sendVerificationOtp)
      mockSendVerificationOtp.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.sendEmailVerificationCode('user@example.com')
      })

      expect(result.current.sendingEmailCode).toBe(false)
    })

    it('should set sendingEmailCode to false after send error', async () => {
      const mockSendVerificationOtp = vi.mocked(authClient.emailOtp.sendVerificationOtp)
      mockSendVerificationOtp.mockRejectedValueOnce(new Error('Send failed'))

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.sendEmailVerificationCode('user@example.com')
      })

      expect(result.current.sendingEmailCode).toBe(false)
    })

    it('should handle network errors', async () => {
      const mockSendVerificationOtp = vi.mocked(authClient.emailOtp.sendVerificationOtp)
      mockSendVerificationOtp.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.sendEmailVerificationCode('user@example.com')
      })

      expect(toast.error).toHaveBeenCalledWith('인증코드 전송 중 오류가 발생했습니다')
    })

    it('should log errors to console', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockSendVerificationOtp = vi.mocked(authClient.emailOtp.sendVerificationOtp)
      const error = new Error('Test error')
      mockSendVerificationOtp.mockRejectedValueOnce(error)

      const { result } = renderHook(() => useEmailVerification())

      await act(async () => {
        await result.current.sendEmailVerificationCode('user@example.com')
      })

      expect(consoleSpy).toHaveBeenCalledWith('Email verification error:', error)
      consoleSpy.mockRestore()
    })
  })

  describe('handleEmailVerificationSuccess', () => {
    it('should set emailVerified to true', () => {
      const { result } = renderHook(() => useEmailVerification())

      expect(result.current.emailVerified).toBe(false)

      act(() => {
        result.current.handleEmailVerificationSuccess()
      })

      expect(result.current.emailVerified).toBe(true)
    })

    it('should close OTP dialog', async () => {
      const mockSendVerificationOtp = vi.mocked(authClient.emailOtp.sendVerificationOtp)
      mockSendVerificationOtp.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useEmailVerification())

      // First open dialog
      await act(async () => {
        await result.current.sendEmailVerificationCode('user@example.com')
      })

      expect(result.current.showEmailOTPDialog).toBe(true)

      // Then handle success
      act(() => {
        result.current.handleEmailVerificationSuccess()
      })

      expect(result.current.showEmailOTPDialog).toBe(false)
    })

    it('should show success toast', () => {
      const { result } = renderHook(() => useEmailVerification())

      act(() => {
        result.current.handleEmailVerificationSuccess()
      })

      expect(toast.success).toHaveBeenCalledWith('이메일 인증이 완료되었습니다')
    })
  })

  describe('setShowEmailOTPDialog', () => {
    it('should update dialog visibility', () => {
      const { result } = renderHook(() => useEmailVerification())

      expect(result.current.showEmailOTPDialog).toBe(false)

      act(() => {
        result.current.setShowEmailOTPDialog(true)
      })

      expect(result.current.showEmailOTPDialog).toBe(true)

      act(() => {
        result.current.setShowEmailOTPDialog(false)
      })

      expect(result.current.showEmailOTPDialog).toBe(false)
    })

    it('should allow closing dialog manually', async () => {
      const mockSendVerificationOtp = vi.mocked(authClient.emailOtp.sendVerificationOtp)
      mockSendVerificationOtp.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useEmailVerification())

      // Open dialog by sending code
      await act(async () => {
        await result.current.sendEmailVerificationCode('user@example.com')
      })

      expect(result.current.showEmailOTPDialog).toBe(true)

      // Close manually
      act(() => {
        result.current.setShowEmailOTPDialog(false)
      })

      expect(result.current.showEmailOTPDialog).toBe(false)
    })
  })

  describe('resetEmailVerification', () => {
    it('should reset emailVerified to false', () => {
      const { result } = renderHook(() => useEmailVerification())

      // Set verified
      act(() => {
        result.current.handleEmailVerificationSuccess()
      })

      expect(result.current.emailVerified).toBe(true)

      // Reset
      act(() => {
        result.current.resetEmailVerification()
      })

      expect(result.current.emailVerified).toBe(false)
    })

    it('should reset showEmailOTPDialog to false', async () => {
      const mockSendVerificationOtp = vi.mocked(authClient.emailOtp.sendVerificationOtp)
      mockSendVerificationOtp.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useEmailVerification())

      // Open dialog
      await act(async () => {
        await result.current.sendEmailVerificationCode('user@example.com')
      })

      expect(result.current.showEmailOTPDialog).toBe(true)

      // Reset
      act(() => {
        result.current.resetEmailVerification()
      })

      expect(result.current.showEmailOTPDialog).toBe(false)
    })

    it('should reset all state to initial values', async () => {
      const mockSendVerificationOtp = vi.mocked(authClient.emailOtp.sendVerificationOtp)
      mockSendVerificationOtp.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useEmailVerification())

      // Send code and verify
      await act(async () => {
        await result.current.sendEmailVerificationCode('user@example.com')
      })

      act(() => {
        result.current.handleEmailVerificationSuccess()
      })

      expect(result.current.emailVerified).toBe(true)
      expect(result.current.showEmailOTPDialog).toBe(false)

      // Reset
      act(() => {
        result.current.resetEmailVerification()
      })

      expect(result.current.emailVerified).toBe(false)
      expect(result.current.showEmailOTPDialog).toBe(false)
    })
  })

  describe('Integration scenarios', () => {
    it('should handle complete verification flow', async () => {
      const mockSendVerificationOtp = vi.mocked(authClient.emailOtp.sendVerificationOtp)
      mockSendVerificationOtp.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useEmailVerification())

      // Initial state
      expect(result.current.emailVerified).toBe(false)
      expect(result.current.showEmailOTPDialog).toBe(false)

      // Send code
      await act(async () => {
        await result.current.sendEmailVerificationCode('user@example.com')
      })

      expect(result.current.showEmailOTPDialog).toBe(true)
      expect(toast.success).toHaveBeenCalledWith('이메일로 인증코드가 전송되었습니다')

      // User verifies code (simulated)
      act(() => {
        result.current.handleEmailVerificationSuccess()
      })

      expect(result.current.emailVerified).toBe(true)
      expect(result.current.showEmailOTPDialog).toBe(false)
      expect(toast.success).toHaveBeenCalledWith('이메일 인증이 완료되었습니다')
    })

    it('should handle resend code scenario', async () => {
      const mockSendVerificationOtp = vi.mocked(authClient.emailOtp.sendVerificationOtp)
      mockSendVerificationOtp.mockResolvedValue(undefined)

      const { result } = renderHook(() => useEmailVerification())

      // Send code first time
      await act(async () => {
        await result.current.sendEmailVerificationCode('user@example.com')
      })

      expect(mockSendVerificationOtp).toHaveBeenCalledTimes(1)

      // Send code again (resend)
      await act(async () => {
        await result.current.sendEmailVerificationCode('user@example.com')
      })

      expect(mockSendVerificationOtp).toHaveBeenCalledTimes(2)
      expect(toast.success).toHaveBeenCalledTimes(2)
    })

    it('should handle cancel verification scenario', async () => {
      const mockSendVerificationOtp = vi.mocked(authClient.emailOtp.sendVerificationOtp)
      mockSendVerificationOtp.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useEmailVerification())

      // Send code
      await act(async () => {
        await result.current.sendEmailVerificationCode('user@example.com')
      })

      expect(result.current.showEmailOTPDialog).toBe(true)

      // User cancels by closing dialog
      act(() => {
        result.current.setShowEmailOTPDialog(false)
      })

      expect(result.current.showEmailOTPDialog).toBe(false)
      expect(result.current.emailVerified).toBe(false)
    })
  })
})
