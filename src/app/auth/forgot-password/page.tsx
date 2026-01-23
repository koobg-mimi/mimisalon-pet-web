'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, CheckCircle, Mail, PawPrint, Smartphone, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { OTPInputDialog } from '@/components/auth/otp-input-dialog'

// Types
type ResetMethod = 'email-otp' | 'sms-otp'
type ContactType = 'email' | 'phone'
type Step = 'contact' | 'otp-sent' | 'new-password' | 'success'

// Validation schemas
const emailSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
})

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, '올바른 전화번호를 입력해주세요'),
})

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
      .regex(/[a-z]/, '소문자 포함 필요')
      .regex(/[A-Z]/, '대문자 포함 필요')
      .regex(/[0-9]/, '숫자 포함 필요'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })

type EmailInput = z.infer<typeof emailSchema>
type PhoneInputType = z.infer<typeof phoneSchema>
type PasswordInput = z.infer<typeof passwordSchema>

/**
 * Forgot Password Page - OTP-Only Implementation
 *
 * Supports two password reset methods:
 * 1. Email OTP: 6-digit code via email
 * 2. SMS OTP: 6-digit code via phone number
 *
 * All methods use better-auth plugins directly (no custom API routes)
 */
export default function ForgotPasswordPage() {
  const router = useRouter()

  // Step management
  const [step, setStep] = useState<Step>('contact')
  const [isLoading, setIsLoading] = useState(false)

  // Contact type
  const [contactType, setContactType] = useState<ContactType>('email')

  // User contact info
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  // Method (determined by contact type)
  const [selectedMethod, setSelectedMethod] = useState<ResetMethod | null>(null)

  // OTP handling
  const [showOTPDialog, setShowOTPDialog] = useState(false)
  const [verifiedOTP, setVerifiedOTP] = useState('')

  // Forms
  const emailForm = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  })

  const phoneForm = useForm<PhoneInputType>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: '' },
  })

  const passwordForm = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  /**
   * Step 1: Submit email
   */
  const handleEmailSubmit = async (data: EmailInput) => {
    setEmail(data.email)
    setSelectedMethod('email-otp')
    setIsLoading(true)

    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: data.email,
        type: 'forget-password',
      })

      toast.success('인증코드가 이메일로 전송되었습니다')
      setShowOTPDialog(true)
    } catch (error: any) {
      console.error('Send email OTP error:', error)
      toast.error(error?.message || '전송에 실패했습니다. 다시 시도해주세요')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Step 1: Submit phone number
   */
  const handlePhoneSubmit = async (data: PhoneInputType) => {
    setPhoneNumber(data.phoneNumber)
    setSelectedMethod('sms-otp')
    setIsLoading(true)

    try {
      await authClient.phoneNumber.sendOtp({
        phoneNumber: data.phoneNumber,
      })

      toast.success('인증코드가 문자로 전송되었습니다')
      setShowOTPDialog(true)
    } catch (error: any) {
      console.error('Send SMS OTP error:', error)
      toast.error(error?.message || '전송에 실패했습니다. 다시 시도해주세요')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Step 2: OTP verified, show password form
   */
  const handleOTPSuccess = (otp?: string) => {
    if (!otp) {
      toast.error('인증 코드가 필요합니다')
      return
    }
    setVerifiedOTP(otp)
    setShowOTPDialog(false)
    setStep('new-password')
    toast.success('인증이 완료되었습니다. 새 비밀번호를 입력하세요')
  }

  /**
   * Step 3: Reset password with verified OTP
   */
  const handlePasswordSubmit = async (data: PasswordInput) => {
    if (!verifiedOTP) {
      toast.error('인증이 필요합니다')
      return
    }

    setIsLoading(true)

    try {
      if (selectedMethod === 'email-otp') {
        // Email OTP password reset
        const { error } = await authClient.emailOtp.resetPassword({
          email,
          otp: verifiedOTP,
          password: data.password,
        })

        if (error) {
          toast.error(error.message || '비밀번호 재설정에 실패했습니다')
          setIsLoading(false)
          return
        }
      } else if (selectedMethod === 'sms-otp') {
        // SMS OTP password reset
        const { error } = await authClient.phoneNumber.resetPassword({
          phoneNumber,
          otp: verifiedOTP,
          newPassword: data.password,
        })

        if (error) {
          toast.error(error.message || '비밀번호 재설정에 실패했습니다')
          setIsLoading(false)
          return
        }
      }

      // Success!
      setStep('success')
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
              {step === 'contact' && '등록된 이메일 또는 전화번호로 인증코드를 받으세요'}
              {step === 'new-password' && '새로운 비밀번호를 입력하세요'}
              {step === 'success' && '비밀번호가 변경되었습니다'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Step 1: Contact Input */}
            {step === 'contact' && (
              <Tabs
                value={contactType}
                onValueChange={(value) => setContactType(value as ContactType)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">
                    <Mail className="mr-2 h-4 w-4" />
                    이메일
                  </TabsTrigger>
                  <TabsTrigger value="phone">
                    <Smartphone className="mr-2 h-4 w-4" />
                    전화번호
                  </TabsTrigger>
                </TabsList>

                {/* Email Tab */}
                <TabsContent value="email" className="space-y-4">
                  <Form {...emailForm}>
                    <form
                      onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>이메일 주소</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="example@email.com"
                                disabled={isLoading}
                                autoComplete="email"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              가입할 때 사용한 이메일 주소를 입력하세요
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                        <Mail className="mr-2 h-4 w-4" />
                        이메일로 인증코드 받기
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                {/* Phone Tab */}
                <TabsContent value="phone" className="space-y-4">
                  <Form {...phoneForm}>
                    <form
                      onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={phoneForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>전화번호</FormLabel>
                            <FormControl>
                              <PhoneInput
                                defaultCountry="KR"
                                placeholder="010-1234-5678"
                                disabled={isLoading}
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormDescription>
                              가입할 때 사용한 전화번호를 입력하세요
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                        <Smartphone className="mr-2 h-4 w-4" />
                        문자로 인증코드 받기
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            )}

            {/* Step 2: OTP Dialog (modal) */}
            <OTPInputDialog
              open={showOTPDialog}
              onOpenChange={setShowOTPDialog}
              identifier={contactType === 'email' ? email : phoneNumber}
              method={contactType === 'email' ? 'email' : 'sms'}
              type="forget-password"
              onSuccess={handleOTPSuccess}
            />

            {/* Step 3: New Password Input */}
            {step === 'new-password' && (
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                  className="space-y-6"
                >
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      인증이 완료되었습니다. 새 비밀번호를 입력하세요
                    </AlertDescription>
                  </Alert>

                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>새 비밀번호</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="최소 8자 이상"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>대문자, 소문자, 숫자 포함 필요</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>비밀번호 확인</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            disabled={isLoading}
                            {...field}
                          />
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

            {/* Step 4: Success */}
            {step === 'success' && (
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

            {/* Back to login link */}
            {step !== 'success' && (
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

        {/* Back to home */}
        {step === 'contact' && (
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              메인으로 돌아가기
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
