/**
 * Tests for usePhoneVerification hook
 * @module features/auth/hooks/__tests__/use-phone-verification
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { usePhoneVerification } from '../use-phone-verification'

// Mock dependencies
vi.mock('@/lib/auth-client', () => ({
  authClient: {
    phoneNumber: {
      sendOtp: vi.fn(),
    },
  },
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockFetch = vi.fn()
global.fetch = mockFetch as any

// Import mocked modules
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'

describe('usePhoneVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Initial state', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => usePhoneVerification())

      expect(result.current.phoneVerified).toBe(false)
      expect(result.current.verificationCode).toBe('')
      expect(result.current.verificationError).toBe('')
      expect(result.current.showVerificationInput).toBe(false)
      expect(result.current.cooldownTime).toBe(0)
      expect(result.current.sendingCode).toBe(false)
      expect(result.current.verifyingCode).toBe(false)
    })

    it('should provide all required functions', () => {
      const { result } = renderHook(() => usePhoneVerification())

      expect(typeof result.current.setVerificationCode).toBe('function')
      expect(typeof result.current.sendPhoneCode).toBe('function')
      expect(typeof result.current.verifyPhoneCode).toBe('function')
      expect(typeof result.current.resetVerification).toBe('function')
    })
  })

  describe('sendPhoneCode', () => {
    it('should send OTP successfully', async () => {
      const mockSendOtp = vi.mocked(authClient.phoneNumber.sendOtp)
      mockSendOtp.mockResolvedValueOnce({ error: null } as any)

      const { result } = renderHook(() => usePhoneVerification())

      await act(async () => {
        await result.current.sendPhoneCode('+821012345678')
      })

      expect(mockSendOtp).toHaveBeenCalledWith({
        phoneNumber: '+821012345678',
      })
      expect(result.current.showVerificationInput).toBe(true)
      expect(result.current.cooldownTime).toBe(60)
      expect(result.current.verificationError).toBe('')
    })

    it('should show verification input after sending', async () => {
      const mockSendOtp = vi.mocked(authClient.phoneNumber.sendOtp)
      mockSendOtp.mockResolvedValueOnce({ error: null } as any)

      const { result } = renderHook(() => usePhoneVerification())

      expect(result.current.showVerificationInput).toBe(false)

      await act(async () => {
        await result.current.sendPhoneCode('+821012345678')
      })

      expect(result.current.showVerificationInput).toBe(true)
    })

    it('should start 60-second cooldown timer', async () => {
      const mockSendOtp = vi.mocked(authClient.phoneNumber.sendOtp)
      mockSendOtp.mockResolvedValueOnce({ error: null } as any)

      const { result } = renderHook(() => usePhoneVerification())

      await act(async () => {
        await result.current.sendPhoneCode('+821012345678')
      })

      expect(result.current.cooldownTime).toBe(60)
    })

    it('should validate E.164 format (+82...)', async () => {
      const mockSendOtp = vi.mocked(authClient.phoneNumber.sendOtp)
      mockSendOtp.mockResolvedValueOnce({ error: null } as any)

      const { result } = renderHook(() => usePhoneVerification())

      await act(async () => {
        await result.current.sendPhoneCode('+821012345678')
      })

      expect(result.current.verificationError).toBe('')
    })

    it('should fail for invalid phone format', async () => {
      const { result } = renderHook(() => usePhoneVerification())

      await act(async () => {
        await result.current.sendPhoneCode('01012345678')
      })

      expect(result.current.verificationError).toBe('올바른 한국 휴대폰 번호를 입력해주세요.')
      expect(authClient.phoneNumber.sendOtp).not.toHaveBeenCalled()
    })

    it('should fail for phone not starting with +82', async () => {
      const { result } = renderHook(() => usePhoneVerification())

      await act(async () => {
        await result.current.sendPhoneCode('+15551234567')
      })

      expect(result.current.verificationError).toBe('올바른 한국 휴대폰 번호를 입력해주세요.')
      expect(authClient.phoneNumber.sendOtp).not.toHaveBeenCalled()
    })

    it('should fail for empty phone', async () => {
      const { result } = renderHook(() => usePhoneVerification())

      await act(async () => {
        await result.current.sendPhoneCode('')
      })

      expect(result.current.verificationError).toBe('올바른 한국 휴대폰 번호를 입력해주세요.')
      expect(authClient.phoneNumber.sendOtp).not.toHaveBeenCalled()
    })

    it('should handle better-auth errors', async () => {
      const mockSendOtp = vi.mocked(authClient.phoneNumber.sendOtp)
      mockSendOtp.mockResolvedValueOnce({
        error: { message: 'Phone number already in use' },
      } as any)

      const { result } = renderHook(() => usePhoneVerification())

      await act(async () => {
        await result.current.sendPhoneCode('+821012345678')
      })

      expect(result.current.verificationError).toBe('Phone number already in use')
      expect(result.current.showVerificationInput).toBe(false)
    })

    it('should handle better-auth errors without message', async () => {
      const mockSendOtp = vi.mocked(authClient.phoneNumber.sendOtp)
      mockSendOtp.mockResolvedValueOnce({
        error: {} as any,
      } as any)

      const { result } = renderHook(() => usePhoneVerification())

      await act(async () => {
        await result.current.sendPhoneCode('+821012345678')
      })

      expect(result.current.verificationError).toBe('인증번호 발송 중 오류가 발생했습니다.')
    })

    it('should handle network errors', async () => {
      const mockSendOtp = vi.mocked(authClient.phoneNumber.sendOtp)
      mockSendOtp.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => usePhoneVerification())

      await act(async () => {
        await result.current.sendPhoneCode('+821012345678')
      })

      expect(result.current.verificationError).toBe('인증번호 발송 중 오류가 발생했습니다.')
    })

    it('should set sendingCode loading state', async () => {
      const mockSendOtp = vi.mocked(authClient.phoneNumber.sendOtp)
      mockSendOtp.mockResolvedValueOnce({ error: null } as any)

      const { result } = renderHook(() => usePhoneVerification())

      expect(result.current.sendingCode).toBe(false)

      // Call sendPhoneCode and verify loading state changed
      await act(async () => {
        const promise = result.current.sendPhoneCode('+821012345678')
        // During execution, sendingCode should have been set to true
        await promise
      })

      // Should be false after completion
      expect(result.current.sendingCode).toBe(false)
    })

    it('should clear previous errors before sending', async () => {
      const mockSendOtp = vi.mocked(authClient.phoneNumber.sendOtp)
      mockSendOtp.mockResolvedValueOnce({ error: null } as any)

      const { result } = renderHook(() => usePhoneVerification())

      // Set an error first
      await act(async () => {
        await result.current.sendPhoneCode('')
      })

      expect(result.current.verificationError).toBe('올바른 한국 휴대폰 번호를 입력해주세요.')

      // Send again with valid phone
      await act(async () => {
        await result.current.sendPhoneCode('+821012345678')
      })

      expect(result.current.verificationError).toBe('')
    })
  })

  describe('verifyPhoneCode', () => {
    it('should verify OTP successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const { result } = renderHook(() => usePhoneVerification())

      act(() => {
        result.current.setVerificationCode('123456')
      })

      await act(async () => {
        await result.current.verifyPhoneCode('+821012345678')
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/verify-phone-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: '+821012345678',
          code: '123456',
        }),
      })
      expect(result.current.phoneVerified).toBe(true)
    })

    it('should set phoneVerified to true on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const { result } = renderHook(() => usePhoneVerification())

      act(() => {
        result.current.setVerificationCode('123456')
      })

      expect(result.current.phoneVerified).toBe(false)

      await act(async () => {
        await result.current.verifyPhoneCode('+821012345678')
      })

      expect(result.current.phoneVerified).toBe(true)
    })

    it('should hide verification input on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const { result } = renderHook(() => usePhoneVerification())

      // First show verification input
      const mockSendOtp = vi.mocked(authClient.phoneNumber.sendOtp)
      mockSendOtp.mockResolvedValueOnce({ error: null } as any)

      await act(async () => {
        await result.current.sendPhoneCode('+821012345678')
      })

      expect(result.current.showVerificationInput).toBe(true)

      // Then verify
      act(() => {
        result.current.setVerificationCode('123456')
      })

      await act(async () => {
        await result.current.verifyPhoneCode('+821012345678')
      })

      expect(result.current.showVerificationInput).toBe(false)
    })

    it('should show success toast', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const { result } = renderHook(() => usePhoneVerification())

      act(() => {
        result.current.setVerificationCode('123456')
      })

      await act(async () => {
        await result.current.verifyPhoneCode('+821012345678')
      })

      expect(toast.success).toHaveBeenCalledWith('휴대폰 인증이 완료되었습니다')
    })

    it('should validate 6-digit code', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const { result } = renderHook(() => usePhoneVerification())

      act(() => {
        result.current.setVerificationCode('123456')
      })

      await act(async () => {
        await result.current.verifyPhoneCode('+821012345678')
      })

      expect(result.current.verificationError).toBe('')
    })

    it('should fail for code shorter than 6 digits', async () => {
      const { result } = renderHook(() => usePhoneVerification())

      act(() => {
        result.current.setVerificationCode('12345')
      })

      await act(async () => {
        await result.current.verifyPhoneCode('+821012345678')
      })

      expect(result.current.verificationError).toBe('올바른 6자리 인증번호를 입력해주세요.')
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should fail for code longer than 6 digits', async () => {
      const { result } = renderHook(() => usePhoneVerification())

      act(() => {
        result.current.setVerificationCode('1234567')
      })

      await act(async () => {
        await result.current.verifyPhoneCode('+821012345678')
      })

      expect(result.current.verificationError).toBe('올바른 6자리 인증번호를 입력해주세요.')
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should fail for empty code', async () => {
      const { result } = renderHook(() => usePhoneVerification())

      await act(async () => {
        await result.current.verifyPhoneCode('+821012345678')
      })

      expect(result.current.verificationError).toBe('올바른 6자리 인증번호를 입력해주세요.')
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should handle API errors with error message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid verification code' }),
      })

      const { result } = renderHook(() => usePhoneVerification())

      act(() => {
        result.current.setVerificationCode('123456')
      })

      await act(async () => {
        await result.current.verifyPhoneCode('+821012345678')
      })

      expect(result.current.verificationError).toBe('Invalid verification code')
      expect(result.current.phoneVerified).toBe(false)
    })

    it('should handle API errors without error message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      })

      const { result } = renderHook(() => usePhoneVerification())

      act(() => {
        result.current.setVerificationCode('123456')
      })

      await act(async () => {
        await result.current.verifyPhoneCode('+821012345678')
      })

      expect(result.current.verificationError).toBe('인증 중 오류가 발생했습니다.')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => usePhoneVerification())

      act(() => {
        result.current.setVerificationCode('123456')
      })

      await act(async () => {
        await result.current.verifyPhoneCode('+821012345678')
      })

      expect(result.current.verificationError).toBe('인증 중 오류가 발생했습니다.')
    })

    it('should set verifyingCode loading state', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const { result } = renderHook(() => usePhoneVerification())

      act(() => {
        result.current.setVerificationCode('123456')
      })

      expect(result.current.verifyingCode).toBe(false)

      // Call verifyPhoneCode and verify loading state changed
      await act(async () => {
        const promise = result.current.verifyPhoneCode('+821012345678')
        // During execution, verifyingCode should have been set to true
        await promise
      })

      // Should be false after completion
      expect(result.current.verifyingCode).toBe(false)
    })

    it('should clear errors before verifying', async () => {
      const { result } = renderHook(() => usePhoneVerification())

      // Set an error first
      await act(async () => {
        await result.current.verifyPhoneCode('+821012345678')
      })

      expect(result.current.verificationError).toBe('올바른 6자리 인증번호를 입력해주세요.')

      // Verify again with valid code
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      act(() => {
        result.current.setVerificationCode('123456')
      })

      await act(async () => {
        await result.current.verifyPhoneCode('+821012345678')
      })

      expect(result.current.verificationError).toBe('')
    })
  })

  describe('Cooldown timer', () => {
    it('should decrement cooldown every second', async () => {
      const mockSendOtp = vi.mocked(authClient.phoneNumber.sendOtp)
      mockSendOtp.mockResolvedValueOnce({ error: null } as any)

      const { result } = renderHook(() => usePhoneVerification())

      await act(async () => {
        await result.current.sendPhoneCode('+821012345678')
      })

      expect(result.current.cooldownTime).toBe(60)

      // Advance timer by 1 second and wait for state update
      await act(async () => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.cooldownTime).toBe(59)

      // Advance timer by another second
      await act(async () => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.cooldownTime).toBe(58)
    })

    it('should stop timer at 0', async () => {
      const mockSendOtp = vi.mocked(authClient.phoneNumber.sendOtp)
      mockSendOtp.mockResolvedValueOnce({ error: null } as any)

      const { result } = renderHook(() => usePhoneVerification())

      await act(async () => {
        await result.current.sendPhoneCode('+821012345678')
      })

      expect(result.current.cooldownTime).toBe(60)

      // Advance timer by 60 seconds (1 second at a time to trigger each useEffect)
      for (let i = 0; i < 60; i++) {
        await act(async () => {
          vi.advanceTimersByTime(1000)
        })
      }

      expect(result.current.cooldownTime).toBe(0)

      // Advance timer by another second
      await act(async () => {
        vi.advanceTimersByTime(1000)
      })

      // Should still be 0
      expect(result.current.cooldownTime).toBe(0)
    })

    it('should handle multiple timer decrements', async () => {
      const mockSendOtp = vi.mocked(authClient.phoneNumber.sendOtp)
      mockSendOtp.mockResolvedValueOnce({ error: null } as any)

      const { result } = renderHook(() => usePhoneVerification())

      await act(async () => {
        await result.current.sendPhoneCode('+821012345678')
      })

      expect(result.current.cooldownTime).toBe(60)

      // Advance timer by 30 seconds (1 second at a time to trigger each useEffect)
      for (let i = 0; i < 30; i++) {
        await act(async () => {
          vi.advanceTimersByTime(1000)
        })
      }

      expect(result.current.cooldownTime).toBe(30)
    })
  })

  describe('setVerificationCode', () => {
    it('should update verification code', () => {
      const { result } = renderHook(() => usePhoneVerification())

      expect(result.current.verificationCode).toBe('')

      act(() => {
        result.current.setVerificationCode('123456')
      })

      expect(result.current.verificationCode).toBe('123456')
    })

    it('should allow updating code multiple times', () => {
      const { result } = renderHook(() => usePhoneVerification())

      act(() => {
        result.current.setVerificationCode('111111')
      })

      expect(result.current.verificationCode).toBe('111111')

      act(() => {
        result.current.setVerificationCode('222222')
      })

      expect(result.current.verificationCode).toBe('222222')
    })
  })

  describe('resetVerification', () => {
    it('should reset all state to initial values', async () => {
      const mockSendOtp = vi.mocked(authClient.phoneNumber.sendOtp)
      mockSendOtp.mockResolvedValueOnce({ error: null } as any)

      const { result } = renderHook(() => usePhoneVerification())

      // Set up some state
      await act(async () => {
        await result.current.sendPhoneCode('+821012345678')
      })

      act(() => {
        result.current.setVerificationCode('123456')
      })

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      await act(async () => {
        await result.current.verifyPhoneCode('+821012345678')
      })

      // Verify state changed
      expect(result.current.phoneVerified).toBe(true)
      expect(result.current.verificationCode).toBe('123456')
      expect(result.current.showVerificationInput).toBe(false)

      // Reset
      act(() => {
        result.current.resetVerification()
      })

      // Verify all state reset
      expect(result.current.phoneVerified).toBe(false)
      expect(result.current.verificationCode).toBe('')
      expect(result.current.verificationError).toBe('')
      expect(result.current.showVerificationInput).toBe(false)
      expect(result.current.cooldownTime).toBe(0)
    })

    it('should clear verified status', async () => {
      const { result } = renderHook(() => usePhoneVerification())

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      act(() => {
        result.current.setVerificationCode('123456')
      })

      await act(async () => {
        await result.current.verifyPhoneCode('+821012345678')
      })

      expect(result.current.phoneVerified).toBe(true)

      act(() => {
        result.current.resetVerification()
      })

      expect(result.current.phoneVerified).toBe(false)
    })

    it('should clear verification code', () => {
      const { result } = renderHook(() => usePhoneVerification())

      act(() => {
        result.current.setVerificationCode('123456')
      })

      expect(result.current.verificationCode).toBe('123456')

      act(() => {
        result.current.resetVerification()
      })

      expect(result.current.verificationCode).toBe('')
    })

    it('should clear errors', async () => {
      const { result } = renderHook(() => usePhoneVerification())

      await act(async () => {
        await result.current.sendPhoneCode('')
      })

      expect(result.current.verificationError).toBe('올바른 한국 휴대폰 번호를 입력해주세요.')

      act(() => {
        result.current.resetVerification()
      })

      expect(result.current.verificationError).toBe('')
    })
  })
})
