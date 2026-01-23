'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useSession } from '@/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  phoneVerificationConfirmSchema,
  type PhoneVerificationConfirmInput,
} from '@/lib/validations/auth'
import { CheckCircleIcon, AlertCircleIcon, PhoneIcon, ClockIcon } from 'lucide-react'

export default function VerifyPhonePage() {
  const [verificationError, setVerificationError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  // Get phone number from URL params (passed from signup)
  const phoneFromParams = searchParams.get('phone') || ''
  const userId = searchParams.get('userId') || ''
  const returnTo = searchParams.get('returnTo') || '/dashboard'

  const form = useForm<PhoneVerificationConfirmInput>({
    resolver: zodResolver(phoneVerificationConfirmSchema),
    defaultValues: {
      phone: phoneFromParams,
      code: '',
    },
  })

  // Countdown timer for resend button
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendCooldown])

  const formatPhoneForDisplay = (phone: string) => {
    // Display E.164 format as-is for consistency
    return phone
  }

  const verifyCodeMutation = useMutation({
    mutationFn: async (data: PhoneVerificationConfirmInput) => {
      const response = await fetch('/api/auth/phone/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: data.phone,
          code: data.code,
          userId: userId || undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw result
      }

      return result
    },
    onSuccess: async () => {
      // Phone verification successful - session will be updated on next page load

      // Show success message briefly then redirect
      setTimeout(() => {
        if (userId) {
          // For existing users updating phone
          router.push('/settings/profile?verified=true')
        } else {
          // For new signups, continue to dashboard or complete signup
          router.push(returnTo)
        }
      }, 1500)
    },
    onError: (error: any) => {
      if (error.code === 'INVALID_CODE') {
        setVerificationError('인증 코드가 올바르지 않습니다. 다시 확인해주세요.')
        form.setError('code', {
          type: 'manual',
          message: '올바르지 않은 인증 코드입니다.',
        })
      } else if (error.code === 'TOO_MANY_ATTEMPTS') {
        setVerificationError('인증 시도 횟수를 초과했습니다. 새로운 인증 코드를 요청해주세요.')
      } else {
        setVerificationError(error.message || '인증 코드 확인에 실패했습니다.')
      }
    },
  })

  const resendCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/phone/resend-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneFromParams,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw result
      }

      return result
    },
    onSuccess: () => {
      setResendCooldown(60) // 1 minute cooldown
      // Clear the form
      form.setValue('code', '')
      setVerificationError('')
    },
    onError: (error: any) => {
      if (error.code === 'TOO_SOON') {
        setVerificationError(`${error.waitTime}초 후에 다시 요청할 수 있습니다.`)
        setResendCooldown(error.waitTime)
      } else {
        setVerificationError(error.message || '인증 코드 재전송에 실패했습니다.')
      }
    },
  })

  const onSubmit = (data: PhoneVerificationConfirmInput) => {
    setVerificationError('')
    verifyCodeMutation.mutate(data)
  }

  const handleResendCode = () => {
    setVerificationError('')
    resendCodeMutation.mutate()
  }

  if (verifyCodeMutation.isSuccess) {
    return (
      <div className="bg-muted/50 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-8 p-8 text-center">
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-foreground text-2xl font-bold">인증 완료!</h2>
            <p className="text-muted-foreground">전화번호가 성공적으로 인증되었습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-muted/50 flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="space-y-4 text-center">
          <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <PhoneIcon className="text-primary h-8 w-8" />
          </div>
          <h2 className="text-foreground text-3xl font-bold">전화번호 인증</h2>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              다음 번호로 전송된 6자리 인증 코드를 입력하세요
            </p>
            <p className="text-foreground font-medium">{formatPhoneForDisplay(phoneFromParams)}</p>
          </div>
        </div>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center space-y-4">
                  <FormLabel>인증 코드</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={verifyCodeMutation.isPending}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>SMS로 전송된 6자리 숫자를 입력하세요</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {verificationError && (
              <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircleIcon className="text-destructive h-4 w-4" />
                  <p className="text-destructive text-sm">{verificationError}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={verifyCodeMutation.isPending || form.watch('code').length !== 6}
              >
                {verifyCodeMutation.isPending ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : null}
                인증 확인
              </Button>

              <div className="space-y-2 text-center">
                <p className="text-muted-foreground text-sm">인증 코드를 받지 못하셨나요?</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendCode}
                  disabled={resendCodeMutation.isPending || resendCooldown > 0}
                  className="w-full"
                >
                  {resendCodeMutation.isPending ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : resendCooldown > 0 ? (
                    <ClockIcon className="mr-2 h-4 w-4" />
                  ) : null}
                  {resendCooldown > 0 ? `다시 전송 (${resendCooldown}초)` : '인증 코드 다시 전송'}
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                전화번호를 변경하시겠어요?{' '}
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-primary hover:underline"
                >
                  이전으로
                </button>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
