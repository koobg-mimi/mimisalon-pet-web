/**
 * Sign-up (customer registration) form component
 * @module features/auth/components/signup-form
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle, EyeIcon, EyeOffIcon, Info, Lock, Mail, User } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
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
import { OTPInputDialog } from '@/components/auth/otp-input-dialog'
import { useSignUp } from '../hooks/use-signup'
import { usePhoneVerification } from '../hooks/use-phone-verification'
import { useEmailVerification } from '../hooks/use-email-verification'
import { checkPasswordStrength } from '../utils/password-strength'
import { PasswordStrengthIndicator } from './ui/password-strength-indicator'

export interface SignUpFormProps {
  /**
   * Called when sign-up is successful
   * @param email - The registered email address
   */
  onSuccess?: (email: string) => void
  /**
   * Show debug information (development mode)
   */
  showDebug?: boolean
}

/**
 * Customer sign-up form with multi-step verification
 *
 * Features:
 * - Name, email, phone, password fields
 * - Phone verification via SMS OTP
 * - Email verification via email OTP
 * - Password strength indicator
 * - Terms and conditions checkboxes
 * - Real-time validation
 *
 * @example
 * ```tsx
 * <SignUpForm
 *   onSuccess={(email) => {
 *     setShowSuccessModal(true);
 *     setUserEmail(email);
 *   }}
 *   showDebug={isDevelopment}
 * />
 * ```
 */
export function SignUpForm({ onSuccess, showDebug = false }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Authentication hooks
  const { signUp, isLoading: isSigningUp, error, success } = useSignUp({ onSuccess })

  // Phone verification hook
  const {
    phoneVerified,
    verificationCode,
    verificationError,
    showVerificationInput,
    cooldownTime,
    sendingCode,
    verifyingCode,
    setVerificationCode,
    sendPhoneCode,
    verifyPhoneCode,
    resetVerification: resetPhoneVerification,
  } = usePhoneVerification()

  // Email verification hook
  const {
    emailVerified,
    showEmailOTPDialog,
    sendingEmailCode,
    setShowEmailOTPDialog,
    sendEmailVerificationCode,
    handleEmailVerificationSuccess,
    resetEmailVerification,
  } = useEmailVerification()

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
    mode: 'onBlur', // Prevent validation during IME composition
  })

  const handleSubmit = async (data: SignUpInput) => {
    await signUp(data, phoneVerified, emailVerified)

    // Reset form and verification states on success
    if (success) {
      form.reset()
      setUsername('')
      setPasswordStrength(0)
      resetPhoneVerification()
      resetEmailVerification()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Debug Info */}
        {showDebug && (
          <div className="rounded border border-yellow-200 bg-yellow-50 p-2 text-xs">
            <p>Customer Form State Debug:</p>
            <p>Name value: {JSON.stringify(form.watch('name'))}</p>
            <p>Email value: {JSON.stringify(form.watch('email'))}</p>
            <p>Phone value: {JSON.stringify(form.watch('phone'))}</p>
            <p>Phone Verified: {phoneVerified ? 'Yes' : 'No'}</p>
            <p>Form errors: {JSON.stringify(form.formState.errors.name?.message)}</p>
          </div>
        )}

        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <div className="relative">
                <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <FormControl>
                  <Input
                    type="text"
                    placeholder="이름을 입력하세요"
                    className="pl-10 sm:pl-9"
                    disabled={isSigningUp}
                    autoComplete="name"
                    value={username}
                    onChange={(e) => {
                      const newValue = e.target.value
                      setUsername(newValue)
                      field.onChange(newValue)
                      form.setValue('name', newValue)
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    disabled={isSigningUp}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Field with Verification */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>전화번호</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <PhoneInput
                    placeholder="010-0000-0000"
                    defaultCountry="KR"
                    disabled={isSigningUp || phoneVerified}
                    className="flex-1"
                    {...field}
                  />
                  {!phoneVerified && (
                    <Button
                      type="button"
                      variant={cooldownTime > 0 ? 'secondary' : 'outline'}
                      onClick={() => sendPhoneCode(field.value)}
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
                  <Button
                    type="button"
                    onClick={() => verifyPhoneCode(field.value)}
                    disabled={verifyingCode}
                  >
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

        {/* Email Verification Section */}
        {phoneVerified && !emailVerified && (
          <div className="border-border bg-muted/50 space-y-4 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold">
                2
              </div>
              <h4 className="font-semibold">이메일 인증</h4>
            </div>

            <div className="text-muted-foreground text-sm">
              <Mail className="mr-2 inline h-4 w-4" />
              <strong>{form.watch('email')}</strong>로 인증코드가 전송됩니다
            </div>

            <Button
              type="button"
              onClick={() => sendEmailVerificationCode(form.watch('email'))}
              disabled={sendingEmailCode}
              className="w-full"
            >
              {sendingEmailCode ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  전송 중...
                </>
              ) : (
                '이메일로 인증코드 전송'
              )}
            </Button>
          </div>
        )}

        {/* Email Verification Success Message */}
        {emailVerified && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              이메일 인증이 완료되었습니다
            </AlertDescription>
          </Alert>
        )}

        {/* Email OTP Dialog */}
        <OTPInputDialog
          open={showEmailOTPDialog}
          onOpenChange={setShowEmailOTPDialog}
          identifier={form.watch('email')}
          method="email"
          type="email-verification"
          onSuccess={handleEmailVerificationSuccess}
        />

        {/* Password Field with Strength Indicator */}
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
                    placeholder="최소 8자 이상"
                    className="pr-10 pl-10 sm:pr-9 sm:pl-9"
                    disabled={isSigningUp}
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
              <PasswordStrengthIndicator
                password={field.value}
                strength={passwordStrength as any}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
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
                    disabled={isSigningUp}
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2 sm:right-2.5"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
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

        {/* Terms and Conditions */}
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
                      <a href="/privacy" target="_blank" className="text-primary hover:underline">
                        개인정보 처리방침
                      </a>
                      에 동의합니다
                    </FormLabel>
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

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSigningUp || !phoneVerified || !emailVerified}
        >
          {isSigningUp && <LoadingSpinner size="sm" className="mr-2" />}
          회원가입
        </Button>
      </form>
    </Form>
  )
}

SignUpForm.displayName = 'SignUpForm'
