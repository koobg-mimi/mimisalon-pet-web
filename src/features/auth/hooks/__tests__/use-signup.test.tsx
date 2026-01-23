/**
 * useSignUp Hook Tests
 *
 * Tests for the customer sign-up hook with comprehensive coverage
 * of validation, API calls, error handling, and callback functions
 */

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useSignUp } from '../use-signup'
import type { SignUpInput } from '@/features/auth/types/auth.types'

// Mock console methods to suppress logs during tests
const originalConsoleError = console.error

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('useSignUp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    console.error = vi.fn()
  })

  afterEach(() => {
    console.error = originalConsoleError
  })

  const validSignUpData: SignUpInput = {
    name: '홍길동',
    email: 'test@example.com',
    phone: '+821012345678',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    agreeToTerms: true,
    agreeToPrivacy: true,
    agreeToMarketing: false,
  }

  describe('Successful Sign-Up', () => {
    it('should sign up successfully with verified phone and email', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const { result } = renderHook(() => useSignUp())

      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('')
      expect(result.current.success).toBe('')

      await result.current.signUp(validSignUpData, true, true)

      await waitFor(() => {
        expect(result.current.success).toBe('회원가입이 완료되었습니다!')
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...validSignUpData,
          role: 'CUSTOMER',
          phoneVerified: true,
        }),
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('')
    })

    it('should call onSuccess callback with email on successful signup', async () => {
      const onSuccess = vi.fn()

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const { result } = renderHook(() => useSignUp({ onSuccess }))

      await result.current.signUp(validSignUpData, true, true)

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith('test@example.com')
      })

      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
  })

  describe('Validation Errors', () => {
    it('should block signup without phone verification', async () => {
      const { result } = renderHook(() => useSignUp())

      await result.current.signUp(validSignUpData, false, true)

      await waitFor(() => {
        expect(result.current.error).toBe('휴대폰 인증을 완료해주세요.')
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.success).toBe('')
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should block signup without email verification', async () => {
      const { result } = renderHook(() => useSignUp())

      await result.current.signUp(validSignUpData, true, false)

      await waitFor(() => {
        expect(result.current.error).toBe('이메일 인증을 완료해주세요.')
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.success).toBe('')
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should block signup without both phone and email verification', async () => {
      const { result } = renderHook(() => useSignUp())

      await result.current.signUp(validSignUpData, false, false)

      await waitFor(() => {
        expect(result.current.error).toBe('휴대폰 인증을 완료해주세요.')
      })

      expect(result.current.isLoading).toBe(false)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should call onError callback when phone verification is missing', async () => {
      const onError = vi.fn()

      const { result } = renderHook(() => useSignUp({ onError }))

      await result.current.signUp(validSignUpData, false, true)

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('휴대폰 인증을 완료해주세요.')
      })
    })

    it('should call onError callback when email verification is missing', async () => {
      const onError = vi.fn()

      const { result } = renderHook(() => useSignUp({ onError }))

      await result.current.signUp(validSignUpData, true, false)

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('이메일 인증을 완료해주세요.')
      })
    })
  })

  describe('API Error Handling', () => {
    it('should handle EMAIL_ALREADY_EXISTS error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Email already exists',
        }),
      })

      const { result } = renderHook(() => useSignUp())

      await result.current.signUp(validSignUpData, true, true)

      await waitFor(() => {
        expect(result.current.error).toBe('이미 가입된 이메일입니다.')
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.success).toBe('')
    })

    it('should handle generic API error with message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          code: 'VALIDATION_ERROR',
          message: '잘못된 입력값입니다.',
        }),
      })

      const { result } = renderHook(() => useSignUp())

      await result.current.signUp(validSignUpData, true, true)

      await waitFor(() => {
        expect(result.current.error).toBe('잘못된 입력값입니다.')
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.success).toBe('')
    })

    it('should handle API error without specific message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          code: 'UNKNOWN_ERROR',
        }),
      })

      const { result } = renderHook(() => useSignUp())

      await result.current.signUp(validSignUpData, true, true)

      await waitFor(() => {
        expect(result.current.error).toBe('회원가입 중 오류가 발생했습니다.')
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('should call onError callback on API error', async () => {
      const onError = vi.fn()

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Email already exists',
        }),
      })

      const { result } = renderHook(() => useSignUp({ onError }))

      await result.current.signUp(validSignUpData, true, true)

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('이미 가입된 이메일입니다.')
      })
    })
  })

  describe('Network Error Handling', () => {
    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useSignUp())

      await result.current.signUp(validSignUpData, true, true)

      await waitFor(() => {
        expect(result.current.error).toBe('회원가입 중 오류가 발생했습니다.')
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.success).toBe('')
      expect(console.error).toHaveBeenCalledWith('Sign-up error:', expect.any(Error))
    })

    it('should handle unexpected exception', async () => {
      mockFetch.mockImplementationOnce(() => {
        throw new Error('Unexpected error')
      })

      const { result } = renderHook(() => useSignUp())

      await result.current.signUp(validSignUpData, true, true)

      await waitFor(() => {
        expect(result.current.error).toBe('회원가입 중 오류가 발생했습니다.')
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('should call onError callback on network error', async () => {
      const onError = vi.fn()

      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useSignUp({ onError }))

      await result.current.signUp(validSignUpData, true, true)

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('회원가입 중 오류가 발생했습니다.')
      })
    })
  })

  describe('Loading States', () => {
    it('should set isLoading to true during signup', async () => {
      let resolveFetch: (value: any) => void
      const fetchPromise = new Promise((resolve) => {
        resolveFetch = resolve
      })

      mockFetch.mockReturnValueOnce(fetchPromise)

      const { result } = renderHook(() => useSignUp())

      expect(result.current.isLoading).toBe(false)

      const signUpPromise = result.current.signUp(validSignUpData, true, true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true)
      })

      resolveFetch!({
        ok: true,
        json: async () => ({ success: true }),
      })

      await signUpPromise

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should set isLoading to false after validation error', async () => {
      const { result } = renderHook(() => useSignUp())

      expect(result.current.isLoading).toBe(false)

      await result.current.signUp(validSignUpData, false, true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBe('휴대폰 인증을 완료해주세요.')
      })
    })

    it('should set isLoading to false after API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          code: 'EMAIL_ALREADY_EXISTS',
        }),
      })

      const { result } = renderHook(() => useSignUp())

      await result.current.signUp(validSignUpData, true, true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBe('이미 가입된 이메일입니다.')
      })
    })

    it('should set isLoading to false after network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useSignUp())

      await result.current.signUp(validSignUpData, true, true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBe('회원가입 중 오류가 발생했습니다.')
      })
    })
  })

  describe('Message Clearing', () => {
    it('should clear messages with clearMessages function', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const { result } = renderHook(() => useSignUp())

      await result.current.signUp(validSignUpData, true, true)

      await waitFor(() => {
        expect(result.current.success).toBe('회원가입이 완료되었습니다!')
      })

      act(() => {
        result.current.clearMessages()
      })

      expect(result.current.success).toBe('')
      expect(result.current.error).toBe('')
    })

    it('should clear error messages with clearMessages function', async () => {
      const { result } = renderHook(() => useSignUp())

      await result.current.signUp(validSignUpData, false, true)

      await waitFor(() => {
        expect(result.current.error).toBe('휴대폰 인증을 완료해주세요.')
      })

      act(() => {
        result.current.clearMessages()
      })

      expect(result.current.error).toBe('')
      expect(result.current.success).toBe('')
    })

    it('should clear previous messages on new signup attempt', async () => {
      // First attempt fails
      const { result } = renderHook(() => useSignUp())

      await result.current.signUp(validSignUpData, false, true)

      await waitFor(() => {
        expect(result.current.error).toBe('휴대폰 인증을 완료해주세요.')
      })

      // Second attempt succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      await result.current.signUp(validSignUpData, true, true)

      await waitFor(() => {
        expect(result.current.error).toBe('')
        expect(result.current.success).toBe('회원가입이 완료되었습니다!')
      })
    })
  })

  describe('Callback Functions', () => {
    it('should not throw if callbacks are not provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const { result } = renderHook(() => useSignUp())

      await expect(result.current.signUp(validSignUpData, true, true)).resolves.not.toThrow()
    })

    it('should not throw if onSuccess callback throws', async () => {
      const onSuccess = vi.fn().mockImplementation(() => {
        throw new Error('Callback error')
      })

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const { result } = renderHook(() => useSignUp({ onSuccess }))

      // The hook should not crash even if callback throws
      await expect(result.current.signUp(validSignUpData, true, true)).resolves.not.toThrow()
    })

    it('should call onError callback even if it throws', async () => {
      const onError = vi.fn().mockImplementation(() => {
        throw new Error('Callback error')
      })

      const { result } = renderHook(() => useSignUp({ onError }))

      // The callback will be called and will throw, but we can verify it was called
      await expect(result.current.signUp(validSignUpData, false, true)).rejects.toThrow(
        'Callback error'
      )

      expect(onError).toHaveBeenCalledWith('휴대폰 인증을 완료해주세요.')
    })
  })

  describe('Request Payload', () => {
    it('should include phoneVerified flag in request payload', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const { result } = renderHook(() => useSignUp())

      await result.current.signUp(validSignUpData, true, true)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/auth/signup',
          expect.objectContaining({
            body: expect.stringContaining('"phoneVerified":true'),
          })
        )
      })
    })

    it('should always set role to CUSTOMER', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const { result } = renderHook(() => useSignUp())

      await result.current.signUp(validSignUpData, true, true)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/auth/signup',
          expect.objectContaining({
            body: expect.stringContaining('"role":"CUSTOMER"'),
          })
        )
      })
    })

    it('should include all user data in request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const { result } = renderHook(() => useSignUp())

      await result.current.signUp(validSignUpData, true, true)

      await waitFor(() => {
        const callArgs = mockFetch.mock.calls[0]
        const body = JSON.parse(callArgs[1].body)

        expect(body).toMatchObject({
          name: '홍길동',
          email: 'test@example.com',
          phone: '+821012345678',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          agreeToTerms: true,
          agreeToPrivacy: true,
          agreeToMarketing: false,
          role: 'CUSTOMER',
          phoneVerified: true,
        })
      })
    })
  })
})
