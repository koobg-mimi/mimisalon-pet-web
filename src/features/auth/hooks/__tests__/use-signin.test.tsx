/**
 * useSignIn Hook Tests
 *
 * Tests for the sign-in authentication hook with comprehensive coverage
 * of auth flow, role-based navigation, WebView integration, and error handling
 */

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useSignIn } from '../use-signin'
import { UserRole } from '@prisma/client'
import type { SignInInput } from '@/features/auth/types/auth.types'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useWebViewBridge } from '@/hooks/use-webview-bridge'

// Mock @/lib/auth-client
vi.mock('@/lib/auth-client', () => ({
  authClient: {
    signIn: {
      email: vi.fn(),
    },
    getSession: vi.fn(),
  },
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

// Mock use-webview-bridge
vi.mock('@/hooks/use-webview-bridge', () => ({
  useWebViewBridge: vi.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
}

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock console methods to suppress logs during tests
const originalConsoleLog = console.log
const originalConsoleError = console.error

describe('useSignIn', () => {
  const mockPush = vi.fn()
  const mockSendUserLogin = vi.fn()
  const mockSendMessage = vi.fn()
  const mockSendUserLogout = vi.fn()
  const mockRequestImageUpload = vi.fn()
  const mockRequestCamera = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    console.log = vi.fn()
    console.error = vi.fn()

    // Setup router mock
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any)

    // Setup webview bridge mock (default: not in webview)
    vi.mocked(useWebViewBridge).mockReturnValue({
      sendUserLogin: mockSendUserLogin,
      isWebView: false,
      sendMessage: mockSendMessage,
      sendUserLogout: mockSendUserLogout,
      requestImageUpload: mockRequestImageUpload,
      requestCamera: mockRequestCamera,
    })
  })

  afterEach(() => {
    console.log = originalConsoleLog
    console.error = originalConsoleError
  })

  describe('Successful Sign-In', () => {
    it('should sign in successfully with valid credentials', async () => {
      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '+821012345678',
        role: UserRole.CUSTOMER,
      }

      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      } as any)

      vi.mocked(authClient.getSession).mockResolvedValueOnce({
        data: { user: mockUser },
      } as any)

      const { result } = renderHook(() => useSignIn())

      const credentials: SignInInput = {
        email: 'test@example.com',
        password: 'password123',
      }

      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('')

      await result.current.signIn(credentials)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(authClient.signIn.email).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        callbackURL: '/',
      })

      expect(authClient.getSession).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/customer/dashboard/overview')
      expect(result.current.error).toBe('')
    })

    it('should handle successful sign-in without session data', async () => {
      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: { user: null },
        error: null,
      } as any)

      vi.mocked(authClient.getSession).mockResolvedValueOnce({
        data: null,
      } as any)

      const { result } = renderHook(() => useSignIn({ callbackUrl: '/custom-callback' }))

      const credentials: SignInInput = {
        email: 'test@example.com',
        password: 'password123',
      }

      await result.current.signIn(credentials)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/custom-callback')
      })
    })
  })

  describe('Failed Sign-In', () => {
    it('should handle invalid credentials error', async () => {
      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid credentials' },
      } as any)

      const { result } = renderHook(() => useSignIn())

      const credentials: SignInInput = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      }

      await result.current.signIn(credentials)

      await waitFor(() => {
        expect(result.current.error).toBe('이메일 또는 비밀번호가 잘못되었습니다.')
      })

      expect(result.current.isLoading).toBe(false)
      expect(authClient.getSession).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should handle network error', async () => {
      vi.mocked(authClient.signIn.email).mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useSignIn())

      const credentials: SignInInput = {
        email: 'test@example.com',
        password: 'password123',
      }

      await result.current.signIn(credentials)

      await waitFor(() => {
        expect(result.current.error).toBe('로그인 중 오류가 발생했습니다.')
      })

      expect(result.current.isLoading).toBe(false)
      expect(console.error).toHaveBeenCalledWith('Sign-in error:', expect.any(Error))
    })

    it('should handle unexpected exception', async () => {
      vi.mocked(authClient.signIn.email).mockImplementationOnce(() => {
        throw new Error('Unexpected error')
      })

      const { result } = renderHook(() => useSignIn())

      const credentials: SignInInput = {
        email: 'test@example.com',
        password: 'password123',
      }

      await result.current.signIn(credentials)

      await waitFor(() => {
        expect(result.current.error).toBe('로그인 중 오류가 발생했습니다.')
      })

      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('Remember Me Functionality', () => {
    it('should save email to localStorage when rememberMe is true', async () => {
      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '+821012345678',
        role: UserRole.CUSTOMER,
      }

      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      } as any)

      vi.mocked(authClient.getSession).mockResolvedValueOnce({
        data: { user: mockUser },
      } as any)

      const { result } = renderHook(() => useSignIn())

      const credentials: SignInInput = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      }

      await result.current.signIn(credentials)

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('rememberEmail', 'test@example.com')
      })
    })

    it('should remove email from localStorage when rememberMe is false', async () => {
      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '+821012345678',
        role: UserRole.CUSTOMER,
      }

      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      } as any)

      vi.mocked(authClient.getSession).mockResolvedValueOnce({
        data: { user: mockUser },
      } as any)

      const { result } = renderHook(() => useSignIn())

      const credentials: SignInInput = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      }

      await result.current.signIn(credentials)

      await waitFor(() => {
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('rememberEmail')
      })
    })

    it('should remove email from localStorage when rememberMe is undefined', async () => {
      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '+821012345678',
        role: UserRole.CUSTOMER,
      }

      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      } as any)

      vi.mocked(authClient.getSession).mockResolvedValueOnce({
        data: { user: mockUser },
      } as any)

      const { result } = renderHook(() => useSignIn())

      const credentials: SignInInput = {
        email: 'test@example.com',
        password: 'password123',
      }

      await result.current.signIn(credentials)

      await waitFor(() => {
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('rememberEmail')
      })
    })
  })

  describe('Role-Based Navigation', () => {
    it('should navigate to admin dashboard for ADMIN role', async () => {
      const mockUser = {
        id: 'admin1',
        email: 'admin@example.com',
        name: 'Admin User',
        phoneNumber: '+821012345678',
        role: UserRole.ADMIN,
      }

      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      } as any)

      vi.mocked(authClient.getSession).mockResolvedValueOnce({
        data: { user: mockUser },
      } as any)

      const { result } = renderHook(() => useSignIn())

      const credentials: SignInInput = {
        email: 'admin@example.com',
        password: 'password123',
      }

      await result.current.signIn(credentials)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/admin/dashboard/overview')
      })
    })

    it('should navigate to groomer dashboard for GROOMER role', async () => {
      const mockUser = {
        id: 'groomer1',
        email: 'groomer@example.com',
        name: 'Groomer User',
        phoneNumber: '+821012345678',
        role: UserRole.GROOMER,
      }

      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      } as any)

      vi.mocked(authClient.getSession).mockResolvedValueOnce({
        data: { user: mockUser },
      } as any)

      const { result } = renderHook(() => useSignIn())

      const credentials: SignInInput = {
        email: 'groomer@example.com',
        password: 'password123',
      }

      await result.current.signIn(credentials)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/groomer/dashboard/overview')
      })
    })

    it('should navigate to customer dashboard for CUSTOMER role', async () => {
      const mockUser = {
        id: 'customer1',
        email: 'customer@example.com',
        name: 'Customer User',
        phoneNumber: '+821012345678',
        role: UserRole.CUSTOMER,
      }

      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      } as any)

      vi.mocked(authClient.getSession).mockResolvedValueOnce({
        data: { user: mockUser },
      } as any)

      const { result } = renderHook(() => useSignIn())

      const credentials: SignInInput = {
        email: 'customer@example.com',
        password: 'password123',
      }

      await result.current.signIn(credentials)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/customer/dashboard/overview')
      })
    })

    it('should use custom callbackUrl when provided', async () => {
      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '+821012345678',
        role: UserRole.CUSTOMER,
      }

      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      } as any)

      vi.mocked(authClient.getSession).mockResolvedValueOnce({
        data: { user: mockUser },
      } as any)

      const customCallback = '/custom/path'
      const { result } = renderHook(() => useSignIn({ callbackUrl: customCallback }))

      const credentials: SignInInput = {
        email: 'test@example.com',
        password: 'password123',
      }

      await result.current.signIn(credentials)

      await waitFor(() => {
        expect(authClient.signIn.email).toHaveBeenCalledWith(
          expect.objectContaining({
            callbackURL: customCallback,
          })
        )
      })
    })
  })

  describe('WebView Integration', () => {
    it('should send user data to WebView when isWebView is true', async () => {
      // Mock WebView mode
      vi.mocked(useWebViewBridge).mockReturnValue({
        sendUserLogin: mockSendUserLogin,
        isWebView: true,
        sendMessage: mockSendMessage,
        sendUserLogout: mockSendUserLogout,
        requestImageUpload: mockRequestImageUpload,
        requestCamera: mockRequestCamera,
      })

      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '+821012345678',
        role: UserRole.CUSTOMER,
      }

      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      } as any)

      vi.mocked(authClient.getSession).mockResolvedValueOnce({
        data: { user: mockUser },
      } as any)

      const { result } = renderHook(() => useSignIn())

      const credentials: SignInInput = {
        email: 'test@example.com',
        password: 'password123',
      }

      await result.current.signIn(credentials)

      await waitFor(() => {
        expect(mockSendUserLogin).toHaveBeenCalledWith({
          userId: 'user1',
          email: 'test@example.com',
          name: 'Test User',
          phoneNumber: '+821012345678',
          role: UserRole.CUSTOMER,
        })
      })
    })

    it('should NOT send user data to WebView when isWebView is false', async () => {
      // isWebView is false by default in beforeEach

      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '+821012345678',
        role: UserRole.CUSTOMER,
      }

      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      } as any)

      vi.mocked(authClient.getSession).mockResolvedValueOnce({
        data: { user: mockUser },
      } as any)

      const { result } = renderHook(() => useSignIn())

      const credentials: SignInInput = {
        email: 'test@example.com',
        password: 'password123',
      }

      await result.current.signIn(credentials)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalled()
      })

      expect(mockSendUserLogin).not.toHaveBeenCalled()
    })

    it('should handle missing user data in WebView mode', async () => {
      // Mock WebView mode
      vi.mocked(useWebViewBridge).mockReturnValue({
        sendUserLogin: mockSendUserLogin,
        isWebView: true,
        sendMessage: mockSendMessage,
        sendUserLogout: mockSendUserLogout,
        requestImageUpload: mockRequestImageUpload,
        requestCamera: mockRequestCamera,
      })

      const mockUser = {
        id: 'user1',
        email: null,
        name: null,
        phoneNumber: null,
        role: UserRole.CUSTOMER,
      }

      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      } as any)

      vi.mocked(authClient.getSession).mockResolvedValueOnce({
        data: { user: mockUser },
      } as any)

      const { result } = renderHook(() => useSignIn())

      const credentials: SignInInput = {
        email: 'test@example.com',
        password: 'password123',
      }

      await result.current.signIn(credentials)

      await waitFor(() => {
        expect(mockSendUserLogin).toHaveBeenCalledWith({
          userId: 'user1',
          email: '',
          name: '',
          phoneNumber: '',
          role: UserRole.CUSTOMER,
        })
      })
    })
  })

  describe('Loading States', () => {
    it('should set isLoading to true during sign-in', async () => {
      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '+821012345678',
        role: UserRole.CUSTOMER,
      }

      let resolveSignIn: (value: any) => void
      const signInPromise = new Promise((resolve) => {
        resolveSignIn = resolve
      })

      vi.mocked(authClient.signIn.email).mockReturnValueOnce(signInPromise as any)

      const { result } = renderHook(() => useSignIn())

      expect(result.current.isLoading).toBe(false)

      const signInPromiseResult = result.current.signIn({
        email: 'test@example.com',
        password: 'password123',
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true)
      })

      resolveSignIn!({
        data: { user: mockUser },
        error: null,
      })

      vi.mocked(authClient.getSession).mockResolvedValueOnce({
        data: { user: mockUser },
      } as any)

      await signInPromiseResult

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should set isLoading to false after error', async () => {
      vi.mocked(authClient.signIn.email).mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useSignIn())

      expect(result.current.isLoading).toBe(false)

      await result.current.signIn({
        email: 'test@example.com',
        password: 'password123',
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBe('로그인 중 오류가 발생했습니다.')
      })
    })
  })

  describe('Error Handling', () => {
    it('should clear error with clearError function', async () => {
      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid credentials' },
      } as any)

      const { result } = renderHook(() => useSignIn())

      await result.current.signIn({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      })

      await waitFor(() => {
        expect(result.current.error).toBe('이메일 또는 비밀번호가 잘못되었습니다.')
      })

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBe('')
    })

    it('should clear previous error on new sign-in attempt', async () => {
      // First attempt fails
      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid credentials' },
      } as any)

      const { result } = renderHook(() => useSignIn())

      await result.current.signIn({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      })

      await waitFor(() => {
        expect(result.current.error).toBe('이메일 또는 비밀번호가 잘못되었습니다.')
      })

      // Second attempt succeeds
      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '+821012345678',
        role: UserRole.CUSTOMER,
      }

      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      } as any)

      vi.mocked(authClient.getSession).mockResolvedValueOnce({
        data: { user: mockUser },
      } as any)

      await result.current.signIn({
        email: 'test@example.com',
        password: 'password123',
      })

      await waitFor(() => {
        expect(result.current.error).toBe('')
      })
    })
  })

  describe('Callback Functions', () => {
    it('should call onSuccess callback on successful sign-in', async () => {
      const onSuccess = vi.fn()

      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '+821012345678',
        role: UserRole.CUSTOMER,
      }

      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      } as any)

      vi.mocked(authClient.getSession).mockResolvedValueOnce({
        data: { user: mockUser },
      } as any)

      const { result } = renderHook(() => useSignIn({ onSuccess }))

      await result.current.signIn({
        email: 'test@example.com',
        password: 'password123',
      })

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1)
      })
    })

    it('should call onError callback on failed sign-in', async () => {
      const onError = vi.fn()

      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid credentials' },
      } as any)

      const { result } = renderHook(() => useSignIn({ onError }))

      await result.current.signIn({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      })

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('이메일 또는 비밀번호가 잘못되었습니다.')
      })
    })

    it('should call onError callback on exception', async () => {
      const onError = vi.fn()

      vi.mocked(authClient.signIn.email).mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useSignIn({ onError }))

      await result.current.signIn({
        email: 'test@example.com',
        password: 'password123',
      })

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('로그인 중 오류가 발생했습니다.')
      })
    })

    it('should not throw if callbacks are not provided', async () => {
      const mockUser = {
        id: 'user1',
        email: 'test@example.com',
        name: 'Test User',
        phoneNumber: '+821012345678',
        role: UserRole.CUSTOMER,
      }

      vi.mocked(authClient.signIn.email).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      } as any)

      vi.mocked(authClient.getSession).mockResolvedValueOnce({
        data: { user: mockUser },
      } as any)

      const { result } = renderHook(() => useSignIn())

      await expect(
        result.current.signIn({
          email: 'test@example.com',
          password: 'password123',
        })
      ).resolves.not.toThrow()
    })
  })
})
