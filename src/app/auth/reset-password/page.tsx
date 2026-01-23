'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { AlertCircle, CheckCircle, Lock, PawPrint, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

// Password validation schema
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
      .regex(/[a-z]/, '비밀번호는 소문자를 포함해야 합니다')
      .regex(/[A-Z]/, '비밀번호는 대문자를 포함해야 합니다')
      .regex(/[0-9]/, '비밀번호는 숫자를 포함해야 합니다'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })

type PasswordInput = z.infer<typeof passwordSchema>

/**
 * Reset Password Page
 *
 * Handles password reset via email link (token-based method)
 * Token is extracted from URL query parameter: ?token=xxx
 *
 * Flow:
 * 1. Extract token from URL
 * 2. Show password input form
 * 3. Call better-auth resetPassword with token
 * 4. Redirect to sign-in on success
 */
export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form for password reset
  const form = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  // Extract token from URL on mount
  useEffect(() => {
    const tokenParam = searchParams.get('token')
    const errorParam = searchParams.get('error')

    if (errorParam === 'INVALID_TOKEN') {
      setError('유효하지 않거나 만료된 링크입니다. 비밀번호 재설정을 다시 요청해주세요.')
    } else if (tokenParam) {
      setToken(tokenParam)
    } else {
      setError('유효한 재설정 링크가 아닙니다.')
    }
  }, [searchParams])

  /**
   * Handle password reset submission
   */
  const handleSubmit = async (data: PasswordInput) => {
    if (!token) {
      toast.error('유효한 토큰이 없습니다')
      return
    }

    setIsLoading(true)

    try {
      // Use better-auth native resetPassword method
      const { data: result, error: resetError } = await authClient.resetPassword({
        newPassword: data.password,
        token,
      })

      if (resetError) {
        console.error('Password reset error:', resetError)
        toast.error(resetError.message || '비밀번호 재설정에 실패했습니다')
        setIsLoading(false)
        return
      }

      // Success!
      setSuccess(true)
      toast.success('비밀번호가 성공적으로 변경되었습니다')

      // Redirect to sign-in after 2 seconds
      setTimeout(() => {
        router.push('/auth/signin')
      }, 2000)
    } catch (error) {
      console.error('Password reset error:', error)
      toast.error('비밀번호 재설정 중 오류가 발생했습니다')
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <Sparkles className="text-primary h-8 w-8" />
            <PawPrint className="text-primary h-8 w-8" />
          </div>
          <h1 className="text-primary text-2xl font-bold">미미살롱펫</h1>
          <p className="text-muted-foreground">프리미엄 방문 반려동물 미용</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>비밀번호 재설정</CardTitle>
            <CardDescription>
              {success
                ? '비밀번호가 변경되었습니다'
                : error
                  ? '오류가 발생했습니다'
                  : '새로운 비밀번호를 입력하세요'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Error State */}
            {error && (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={() => router.push('/auth/forgot-password')} className="w-full">
                  비밀번호 재설정 다시 요청하기
                </Button>
              </div>
            )}

            {/* Success State */}
            {success && (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">비밀번호가 변경되었습니다</h3>
                  <p className="text-muted-foreground text-sm">
                    잠시 후 로그인 페이지로 이동합니다
                  </p>
                </div>
                <Button onClick={() => router.push('/auth/signin')} className="w-full">
                  지금 로그인하기
                </Button>
              </div>
            )}

            {/* Password Form */}
            {!error && !success && token && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>새 비밀번호</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                              type="password"
                              placeholder="최소 8자 이상"
                              className="pl-10"
                              disabled={isLoading}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          대문자, 소문자, 숫자를 모두 포함해야 합니다
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>비밀번호 확인</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                              type="password"
                              placeholder="비밀번호를 다시 입력하세요"
                              className="pl-10"
                              disabled={isLoading}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                    비밀번호 변경
                  </Button>
                </form>
              </Form>
            )}

            {/* Back to sign-in link */}
            {!success && (
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  비밀번호가 기억나셨나요?{' '}
                  <a href="/auth/signin" className="text-primary hover:underline">
                    로그인
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
