'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { signUpSchema, type SignUpInput } from '@/lib/validations/auth'
import { EyeIcon, EyeOffIcon, AlertCircleIcon } from 'lucide-react'

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      agreeToPrivacy: false,
      agreeToMarketing: false,
    },
    mode: 'onChange',
  })

  // 비밀번호 강도 검사
  const checkPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^\w\s]/.test(password)) strength++
    return strength
  }

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return '매우 약함'
      case 2:
        return '약함'
      case 3:
        return '보통'
      case 4:
        return '강함'
      case 5:
        return '매우 강함'
      default:
        return ''
    }
  }

  const getPasswordStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return 'text-red-500'
      case 2:
        return 'text-orange-500'
      case 3:
        return 'text-yellow-500'
      case 4:
        return 'text-green-500'
      case 5:
        return 'text-green-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const signupMutation = useMutation({
    mutationFn: async (data: SignUpInput) => {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          agreeToMarketing: data.agreeToMarketing,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw result
      }

      return result
    },
    onSuccess: (result) => {
      if (result.requiresPhoneVerification && result.user.phone) {
        // Redirect to phone verification page
        router.push(
          `/auth/verify-phone?phone=${encodeURIComponent(result.user.phone)}&returnTo=/auth/signin?message=회원가입이 완료되었습니다.`
        )
      } else {
        // No phone verification needed, go to signin
        router.push(
          '/auth/signin?message=회원가입이 완료되었습니다. 이메일을 확인하여 계정을 인증해주세요.'
        )
      }
    },
    onError: (error: any) => {
      if (error.code === 'EMAIL_ALREADY_EXISTS') {
        setAuthError('이미 가입된 이메일입니다.')
        form.setError('email', {
          type: 'manual',
          message: '이미 가입된 이메일입니다.',
        })
      } else if (error.code === 'WEAK_PASSWORD') {
        setAuthError('더 강한 비밀번호를 사용해주세요.')
        form.setError('password', {
          type: 'manual',
          message: '더 강한 비밀번호를 사용해주세요.',
        })
      } else {
        setAuthError(error.message || '회원가입 중 오류가 발생했습니다.')
      }
    },
  })

  const onSubmit = (data: SignUpInput) => {
    setAuthError('')
    signupMutation.mutate(data)
  }

  return (
    <div className="bg-muted/50 flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-foreground text-3xl font-bold">미미살롱 회원가입</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            반려동물 미용 서비스를 이용하기 위해 가입하세요
          </p>
        </div>

        <Form {...form}>
          <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="이름을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="이메일을 입력하세요" {...field} />
                    </FormControl>
                    <FormDescription>가입 완료 후 이메일 인증이 필요합니다.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>전화번호 (선택사항)</FormLabel>
                    <FormControl>
                      <PhoneInput placeholder="010-1234-5678" defaultCountry="KR" {...field} />
                    </FormControl>
                    <FormDescription>
                      서비스 관련 중요한 안내사항을 받을 수 있습니다.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="비밀번호를 입력하세요"
                          className="pr-10"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            setPasswordStrength(checkPasswordStrength(e.target.value))
                          }}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="text-muted-foreground h-4 w-4" />
                          ) : (
                            <EyeIcon className="text-muted-foreground h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    {field.value && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 flex-1 rounded-full bg-gray-200">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                passwordStrength <= 1
                                  ? 'bg-red-500'
                                  : passwordStrength === 2
                                    ? 'bg-orange-500'
                                    : passwordStrength === 3
                                      ? 'bg-yellow-500'
                                      : passwordStrength >= 4
                                        ? 'bg-green-500'
                                        : 'bg-gray-300'
                              }`}
                              style={{
                                width: `${(passwordStrength / 5) * 100}%`,
                              }}
                            />
                          </div>
                          <span className={`text-xs ${getPasswordStrengthColor(passwordStrength)}`}>
                            {getPasswordStrengthText(passwordStrength)}
                          </span>
                        </div>
                        <FormDescription>
                          대문자, 소문자, 숫자, 특수문자를 포함하여 8자 이상
                        </FormDescription>
                      </div>
                    )}
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
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="비밀번호를 다시 입력하세요"
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
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
            </div>

            <div className="border-border space-y-4 border-t pt-4">
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          <span className="text-destructive">*</span>{' '}
                          <a href="/terms" target="_blank" className="text-primary hover:underline">
                            서비스 이용약관
                          </a>
                          에 동의합니다
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agreeToPrivacy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          <span className="text-destructive">*</span>{' '}
                          <a
                            href="/privacy"
                            target="_blank"
                            className="text-primary hover:underline"
                          >
                            개인정보 처리방침
                          </a>
                          에 동의합니다
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agreeToMarketing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          마케팅 정보 수신에 동의합니다 (선택)
                        </FormLabel>
                        <FormDescription>
                          할인 쿠폰, 이벤트 정보 등을 이메일과 SMS로 받을 수 있습니다.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {authError && (
              <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircleIcon className="text-destructive h-4 w-4" />
                  <p className="text-destructive text-sm">{authError}</p>
                </div>
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
                {signupMutation.isPending ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                회원가입
              </Button>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                이미 계정이 있으신가요?{' '}
                <a href="/auth/signin" className="text-primary hover:underline">
                  로그인
                </a>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
