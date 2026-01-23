/**
 * SignInForm Component Tests
 *
 * Tests for the sign-in form component with email/password authentication
 */

import React from 'react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignInForm } from '../signin-form'

// Mock the useSignIn hook
const mockSignIn = vi.fn()
const mockClearError = vi.fn()

vi.mock('@/features/auth/hooks/use-signin', () => ({
  useSignIn: vi.fn(() => ({
    signIn: mockSignIn,
    isLoading: false,
    error: '',
    clearError: mockClearError,
  })),
}))

// Import the mocked hook to access it in tests
import { useSignIn } from '@/features/auth/hooks/use-signin'

describe('SignInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Rendering', () => {
    it('should render email input', () => {
      render(<SignInForm />)

      expect(screen.getByText('이메일')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('example@email.com')).toBeInTheDocument()
    })

    it('should render password input', () => {
      render(<SignInForm />)

      expect(screen.getByText('비밀번호')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('비밀번호를 입력하세요')).toBeInTheDocument()
    })

    it('should render remember-me checkbox', () => {
      render(<SignInForm />)

      expect(screen.getByText('로그인 상태 유지')).toBeInTheDocument()
    })

    it('should render submit button', () => {
      render(<SignInForm />)

      expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
    })

    it('should render forgot password link', () => {
      render(<SignInForm />)

      expect(screen.getByText('비밀번호 찾기')).toBeInTheDocument()
    })
  })

  describe('Form validation', () => {
    it('should validate required email field', async () => {
      const user = userEvent.setup()
      render(<SignInForm />)

      const submitButton = screen.getByRole('button', { name: '로그인' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/이메일을 입력해주세요|Required/i)).toBeInTheDocument()
      })
    })

    it('should validate email format', async () => {
      const user = userEvent.setup()
      render(<SignInForm />)

      const emailInput = screen.getByPlaceholderText('example@email.com')
      const passwordInput = screen.getByPlaceholderText('비밀번호를 입력하세요')

      // Type invalid email and a password (to satisfy required password validation)
      await user.clear(emailInput)
      await user.type(emailInput, 'invalid-email')
      await user.type(passwordInput, 'somepassword')

      // Manually trigger form submission via fireEvent to bypass HTML5 validation
      const form = emailInput.closest('form')
      fireEvent.submit(form!)

      // Wait for validation to complete and error message to appear
      const errorMessage = await screen.findByText(
        '올바른 이메일 형식을 입력해주세요',
        {},
        { timeout: 3000 }
      )
      expect(errorMessage).toBeInTheDocument()
    })

    it('should validate required password field', async () => {
      const user = userEvent.setup()
      render(<SignInForm />)

      const emailInput = screen.getByPlaceholderText('example@email.com')
      await user.type(emailInput, 'test@example.com')

      const submitButton = screen.getByRole('button', { name: '로그인' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/비밀번호를 입력해주세요|Required/i)).toBeInTheDocument()
      })
    })
  })

  describe('Password visibility toggle', () => {
    it('should toggle password visibility', async () => {
      const user = userEvent.setup()
      render(<SignInForm />)

      const passwordInput = screen.getByPlaceholderText('비밀번호를 입력하세요')
      expect(passwordInput).toHaveAttribute('type', 'password')

      const toggleButton = screen.getByLabelText('Show password')
      await user.click(toggleButton)

      expect(passwordInput).toHaveAttribute('type', 'text')

      await user.click(screen.getByLabelText('Hide password'))
      expect(passwordInput).toHaveAttribute('type', 'password')
    })
  })

  describe('Form submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup()
      render(<SignInForm />)

      const emailInput = screen.getByPlaceholderText('example@email.com')
      const passwordInput = screen.getByPlaceholderText('비밀번호를 입력하세요')

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: '로그인' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          rememberMe: false,
        })
      })
    })

    it('should call signIn hook with correct data', async () => {
      const user = userEvent.setup()
      render(<SignInForm />)

      const emailInput = screen.getByPlaceholderText('example@email.com')
      const passwordInput = screen.getByPlaceholderText('비밀번호를 입력하세요')
      const rememberMeCheckbox = screen.getByRole('checkbox')

      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'mypassword')
      await user.click(rememberMeCheckbox)

      const submitButton = screen.getByRole('button', { name: '로그인' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({
          email: 'user@example.com',
          password: 'mypassword',
          rememberMe: true,
        })
      })
    })
  })

  describe('Loading state', () => {
    it('should disable form during loading', () => {
      vi.mocked(useSignIn).mockReturnValue({
        signIn: mockSignIn,
        isLoading: true,
        error: '',
        clearError: mockClearError,
      })

      render(<SignInForm />)

      const emailInput = screen.getByPlaceholderText('example@email.com')
      const passwordInput = screen.getByPlaceholderText('비밀번호를 입력하세요')
      const submitButton = screen.getByRole('button', { name: '로그인' })

      expect(emailInput).toBeDisabled()
      expect(passwordInput).toBeDisabled()
      expect(submitButton).toBeDisabled()
    })

    it('should show loading indicator', () => {
      vi.mocked(useSignIn).mockReturnValue({
        signIn: mockSignIn,
        isLoading: true,
        error: '',
        clearError: mockClearError,
      })

      render(<SignInForm />)

      // LoadingSpinner should be present
      const submitButton = screen.getByRole('button', { name: '로그인' })
      expect(submitButton.querySelector('.animate-spin')).toBeInTheDocument()
    })
  })

  describe('Error handling', () => {
    it('should display error message from hook', () => {
      vi.mocked(useSignIn).mockReturnValue({
        signIn: mockSignIn,
        isLoading: false,
        error: '로그인에 실패했습니다',
        clearError: mockClearError,
      })

      render(<SignInForm />)

      expect(screen.getByText('로그인에 실패했습니다')).toBeInTheDocument()
    })

    it('should clear error on email input change', async () => {
      vi.mocked(useSignIn).mockReturnValue({
        signIn: mockSignIn,
        isLoading: false,
        error: '로그인에 실패했습니다',
        clearError: mockClearError,
      })

      const user = userEvent.setup()
      render(<SignInForm />)

      const emailInput = screen.getByPlaceholderText('example@email.com')
      await user.type(emailInput, 't')

      // clearError should be called when email changes
      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalled()
      })
    })

    it('should clear error on password input change', async () => {
      vi.mocked(useSignIn).mockReturnValue({
        signIn: mockSignIn,
        isLoading: false,
        error: '로그인에 실패했습니다',
        clearError: mockClearError,
      })

      const user = userEvent.setup()
      render(<SignInForm />)

      const passwordInput = screen.getByPlaceholderText('비밀번호를 입력하세요')
      await user.type(passwordInput, 'p')

      // clearError should be called when password changes
      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalled()
      })
    })
  })

  describe('Remember me functionality', () => {
    it('should load remembered email from localStorage', async () => {
      localStorage.setItem('rememberEmail', 'remembered@example.com')

      render(<SignInForm />)

      // Wait for useEffect to populate form values from localStorage
      await waitFor(() => {
        const emailInput = screen.getByPlaceholderText('example@email.com') as HTMLInputElement
        expect(emailInput.value).toBe('remembered@example.com')
      })

      // The checkbox is rendered as a button element with data-state
      await waitFor(() => {
        const rememberMeCheckbox = screen.getByRole('checkbox')
        expect(rememberMeCheckbox).toHaveAttribute('data-state', 'checked')
      })
    })
  })

  describe('Forgot password callback', () => {
    it('should call forgot password callback', async () => {
      const mockOnForgotPassword = vi.fn()
      const user = userEvent.setup()
      render(<SignInForm onForgotPassword={mockOnForgotPassword} />)

      const forgotPasswordButton = screen.getByText('비밀번호 찾기')
      await user.click(forgotPasswordButton)

      expect(mockOnForgotPassword).toHaveBeenCalledTimes(1)
    })
  })

  describe('Test account buttons', () => {
    it('should render test account buttons when showTestAccounts is true', () => {
      render(<SignInForm showTestAccounts={true} />)

      expect(screen.getByText('테스트 계정 로그인:')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '고객' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '미용사' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '관리자' })).toBeInTheDocument()
    })

    it('should not render test account buttons when showTestAccounts is false', () => {
      render(<SignInForm showTestAccounts={false} />)

      expect(screen.queryByText('테스트 계정 로그인:')).not.toBeInTheDocument()
    })

    it('should populate form with customer credentials when customer button clicked', async () => {
      const user = userEvent.setup()
      render(<SignInForm showTestAccounts={true} />)

      const customerButton = screen.getByRole('button', { name: '고객' })
      await user.click(customerButton)

      const emailInput = screen.getByPlaceholderText('example@email.com') as HTMLInputElement
      const passwordInput = screen.getByPlaceholderText('비밀번호를 입력하세요') as HTMLInputElement

      expect(emailInput.value).toBe('customer@petmanagement.com')
      expect(passwordInput.value).toBe('defaultpass123')
    })

    it('should populate form with groomer credentials when groomer button clicked', async () => {
      const user = userEvent.setup()
      render(<SignInForm showTestAccounts={true} />)

      const groomerButton = screen.getByRole('button', { name: '미용사' })
      await user.click(groomerButton)

      const emailInput = screen.getByPlaceholderText('example@email.com') as HTMLInputElement
      const passwordInput = screen.getByPlaceholderText('비밀번호를 입력하세요') as HTMLInputElement

      expect(emailInput.value).toBe('groomer@petmanagement.com')
      expect(passwordInput.value).toBe('defaultpass123')
    })

    it('should populate form with admin credentials when admin button clicked', async () => {
      const user = userEvent.setup()
      render(<SignInForm showTestAccounts={true} />)

      const adminButton = screen.getByRole('button', { name: '관리자' })
      await user.click(adminButton)

      const emailInput = screen.getByPlaceholderText('example@email.com') as HTMLInputElement
      const passwordInput = screen.getByPlaceholderText('비밀번호를 입력하세요') as HTMLInputElement

      expect(emailInput.value).toBe('admin@petmanagement.com')
      expect(passwordInput.value).toBe('defaultpass123')
    })

    it('should disable test account buttons during loading', () => {
      vi.mocked(useSignIn).mockReturnValue({
        signIn: mockSignIn,
        isLoading: true,
        error: '',
        clearError: mockClearError,
      })

      render(<SignInForm showTestAccounts={true} />)

      const customerButton = screen.getByRole('button', { name: '고객' })
      const groomerButton = screen.getByRole('button', { name: '미용사' })
      const adminButton = screen.getByRole('button', { name: '관리자' })

      expect(customerButton).toBeDisabled()
      expect(groomerButton).toBeDisabled()
      expect(adminButton).toBeDisabled()
    })
  })
})
