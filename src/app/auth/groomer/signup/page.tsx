'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  ArrowLeft,
  Info,
  Lock,
  Mail,
  PawPrint,
  Sparkles,
  User,
  EyeIcon,
  EyeOffIcon,
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
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

export default function GroomerSignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [success, setSuccess] = useState('')
  const [showSignupSuccess, setShowSignupSuccess] = useState(false)
  const [signupEmail, setSignupEmail] = useState('')
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationError, setVerificationError] = useState('')
  const [showVerificationInput, setShowVerificationInput] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [sendingCode, setSendingCode] = useState(false)
  const [verifyingCode, setVerifyingCode] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const router = useRouter()

  const groomerSignupForm = useForm<SignUpInput>({
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

  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => setCooldownTime((t) => t - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldownTime])

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

  const handleGroomerSignup = async (data: SignUpInput) => {
    setIsLoading(true)
    setAuthError('')
    setSuccess('')

    if (!phoneVerified) {
      setAuthError('휴대폰 인증을 완료해주세요.')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          role: 'GROOMER' as const,
          phoneVerified: phoneVerified,
        } satisfies import('@/app/api/auth/signup/route').SignupRequest),
      })

      if (response.ok) {
        const result: import('@/app/api/auth/signup/route').SignupResponse = await response.json()
        setSuccess('미용사 등록이 완료되었습니다! 이메일 인증을 완료해주세요.')
        setSignupEmail(data.email)
        setShowSignupSuccess(true)
        groomerSignupForm.reset()
        setPhoneVerified(false)
        setVerificationCode('')
        setVerificationError('')
        setShowVerificationInput(false)
        setCooldownTime(0)
      } else {
        const result: import('@/app/api/auth/signup/route').SignupErrorResponse =
          await response.json()
        if (result.code === 'EMAIL_ALREADY_EXISTS') {
          setAuthError('이미 가입된 이메일입니다.')
        } else {
          setAuthError(result.message || result.error || '미용사 등록 중 오류가 발생했습니다.')
        }
      }
    } catch {
      setAuthError('미용사 등록 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const sendPhoneCode = async () => {
    setVerificationError('')
    const phone = groomerSignupForm.getValues('phone')

    if (!phone || !phone.startsWith('+82')) {
      setVerificationError('올바른 한국 휴대폰 번호를 입력해주세요.')
      return
    }

    try {
      setSendingCode(true)

      const response = await fetch('/api/auth/phone/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setShowVerificationInput(true)
        setCooldownTime(60)
      } else {
        if (result.code === 'TOO_MANY_REQUESTS') {
          setVerificationError('너무 자주 요청하고 있습니다. 잠시 후 다시 시도해주세요.')
        } else if (result.code === 'DAILY_LIMIT_EXCEEDED') {
          setVerificationError('일일 인증 시도 횟수를 초과했습니다.')
        } else if (result.code === 'PHONE_ALREADY_VERIFIED') {
          setVerificationError('이미 다른 계정에서 인증된 전화번호입니다.')
        } else {
          setVerificationError(result.message || '인증번호 발송 중 오류가 발생했습니다.')
        }
      }
    } catch {
      setVerificationError('인증번호 발송 중 오류가 발생했습니다.')
    } finally {
      setSendingCode(false)
    }
  }

  const verifyPhoneCode = async () => {
    setVerificationError('')
    if (!verificationCode || verificationCode.length !== 6) {
      setVerificationError('올바른 6자리 인증번호를 입력해주세요.')
      return
    }

    const phone = groomerSignupForm.getValues('phone')

    try {
      setVerifyingCode(true)

      const response = await fetch('/api/auth/phone/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
          code: verificationCode,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setPhoneVerified(true)
        setShowVerificationInput(false)
        setVerificationError('')
      } else {
        if (result.code === 'INVALID_CODE') {
          setVerificationError('인증번호가 올바르지 않습니다. 다시 확인해주세요.')
        } else if (result.code === 'TOO_MANY_ATTEMPTS') {
          setVerificationError('인증 시도 횟수를 초과했습니다. 새로운 인증번호를 요청해주세요.')
        } else {
          setVerificationError(result.message || '인증 중 오류가 발생했습니다.')
        }
      }
    } catch {
      setVerificationError('인증 중 오류가 발생했습니다.')
    } finally {
      setVerifyingCode(false)
    }
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
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
            <CardTitle>미용사 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...groomerSignupForm}>
              <form
                onSubmit={groomerSignupForm.handleSubmit(handleGroomerSignup)}
                className="space-y-4"
              >
                <FormField
                  control={groomerSignupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <div className="relative">
                        <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="이름을 입력하세요"
                            className="pl-10 sm:pl-9"
                            disabled={isLoading}
                            autoComplete="name"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={groomerSignupForm.control}
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

                <FormField
                  control={groomerSignupForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>전화번호</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <PhoneInput
                            placeholder="010-0000-0000"
                            defaultCountry="KR"
                            disabled={isLoading || phoneVerified}
                            className="flex-1"
                            {...field}
                          />
                          {!phoneVerified && (
                            <Button
                              type="button"
                              variant={cooldownTime > 0 ? 'secondary' : 'outline'}
                              onClick={sendPhoneCode}
                              disabled={sendingCode || cooldownTime > 0}
                              className="whitespace-nowrap"
                            >
                              {cooldownTime > 0
                                ? `재전송 (${cooldownTime}s)`
                                : sendingCode
                                  ? '전송 중...'
                                  : '인증번호 발송'}
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      {!phoneVerified && showVerificationInput && (
                        <div className="mt-2 flex items-center gap-2">
                          <Input
                            placeholder="인증번호 6자리"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="w-32"
                            maxLength={6}
                          />
                          <Button type="button" onClick={verifyPhoneCode} disabled={verifyingCode}>
                            {verifyingCode ? '확인 중...' : '확인'}
                          </Button>
                        </div>
                      )}
                      {verificationError && (
                        <p className="text-destructive mt-1 text-sm">{verificationError}</p>
                      )}
                      {phoneVerified && (
                        <p className="mt-1 text-sm text-green-600">휴대폰 인증이 완료되었습니다.</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={groomerSignupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비밀번호</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 sm:left-2.5" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="최소 8자 이상"
                            className="pr-10 pl-10 sm:pr-9 sm:pl-9"
                            disabled={isLoading}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              setPasswordStrength(checkPasswordStrength(e.target.value))
                            }}
                          />
                          <button
                            type="button"
                            className="absolute top-1/2 right-3 -translate-y-1/2 sm:right-2.5"
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
                            <span
                              className={`text-xs ${getPasswordStrengthColor(passwordStrength)}`}
                            >
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
                  control={groomerSignupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비밀번호 확인</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 sm:left-2.5" />
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="비밀번호를 다시 입력하세요"
                            className="pr-10 pl-10 sm:pr-9 sm:pl-9"
                            disabled={isLoading}
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute top-1/2 right-3 -translate-y-1/2 sm:right-2.5"
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

                <div className="border-border space-y-4 border-t pt-4">
                  <div className="space-y-3">
                    <FormField
                      control={groomerSignupForm.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              <span className="text-destructive">*</span>{' '}
                              <a
                                href="/terms"
                                target="_blank"
                                className="text-primary hover:underline"
                              >
                                서비스 이용약관
                              </a>
                              에 동의합니다
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={groomerSignupForm.control}
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
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={groomerSignupForm.control}
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
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <Info className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading || !phoneVerified}>
                  {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                  미용사 등록
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/auth/signin')}
            className="text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            로그인 페이지로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  )
}
