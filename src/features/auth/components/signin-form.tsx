/**
 * Sign-in form component
 * @module features/auth/components/signin-form
 */

'use client'

import * as React from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, EyeIcon, EyeOffIcon, Lock, Mail } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { signInSchema, type SignInInput } from '@/lib/validations/auth'
import { useSignIn } from '../hooks/use-signin'

export interface SignInFormProps {
  /**
   * Callback URL to redirect after successful sign-in
   */
  callbackUrl?: string
  /**
   * Called when sign-in is successful
   */
  onSuccess?: () => void
  /**
   * Called when "Forgot Password" link is clicked
   */
  onForgotPassword?: () => void
  /**
   * Show development test account buttons
   */
  showTestAccounts?: boolean
}

/**
 * Sign-in form with email/password authentication
 *
 * Features:
 * - Email and password validation
 * - Remember me functionality
 * - Password visibility toggle
 * - Forgot password link
 * - Development test account shortcuts
 *
 * @example
 * ```tsx
 * <SignInForm
 *   callbackUrl="/dashboard"
 *   onSuccess={() => toast.success('Logged in!')}
 *   onForgotPassword={() => router.push('/auth/forgot-password')}
 *   showTestAccounts={isDevelopment}
 * />
 * ```
 */
export function SignInForm({
  callbackUrl,
  onSuccess,
  onForgotPassword,
  showTestAccounts = false,
}: SignInFormProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const { signIn, isLoading, error, clearError } = useSignIn({
    callbackUrl,
    onSuccess,
  })

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberEmail')
    if (rememberedEmail) {
      form.setValue('email', rememberedEmail)
      form.setValue('rememberMe', true)
    }
  }, [form])

  // Clear error when form values change
  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [form.watch('email'), form.watch('password')]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (data: SignInInput) => {
    await signIn(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 sm:left-2.5" />
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    className="pl-10 sm:pl-9"
                    disabled={isLoading}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 sm:left-2.5" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    className="pr-10 pl-10 sm:pr-9 sm:pl-9"
                    disabled={isLoading}
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2 sm:right-2.5"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="text-muted-foreground h-4 w-4" />
                    ) : (
                      <EyeIcon className="text-muted-foreground h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">로그인 상태 유지</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-primary text-sm hover:underline"
          >
            비밀번호 찾기
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
          로그인
        </Button>

        {/* Development Test Accounts */}
        {showTestAccounts && (
          <div className="bg-muted rounded-lg p-3">
            <p className="mb-3 text-sm font-medium">테스트 계정 로그인:</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  form.setValue('email', 'customer@petmanagement.com')
                  form.setValue('password', 'Defaultpass123!')
                }}
                disabled={isLoading}
              >
                고객
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  form.setValue('email', 'groomer@petmanagement.com')
                  form.setValue('password', 'Defaultpass123!')
                }}
                disabled={isLoading}
              >
                미용사
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  form.setValue('email', 'admin@petmanagement.com')
                  form.setValue('password', 'Defaultpass123!')
                }}
                disabled={isLoading}
              >
                관리자
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  )
}

SignInForm.displayName = 'SignInForm'
