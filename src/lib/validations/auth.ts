import { z } from 'zod'
import { enhancedPasswordSchema } from './password'

// 기본 이메일 검증
export const emailSchema = z
  .string()
  .min(1, '이메일을 입력해주세요')
  .email('올바른 이메일 형식을 입력해주세요')

// 기본 비밀번호 검증 (레거시)
export const passwordSchema = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다')

// 강화된 비밀번호 검증 (새로운 계정용)
export const strongPasswordSchema = enhancedPasswordSchema

/**
 * @deprecated
 * 전화번호 검증 (한국 형식)
 */
export const phoneSchema = z
  .string()
  .optional()
  .refine((val) => {
    if (!val) return true
    // E.164 형식: +821012345678 (Korean mobile numbers)
    return /^\+821[0-9]{8,9}$/.test(val)
  }, '올바른 전화번호 형식을 입력해주세요 (예: +821012345678)')

// 필수 전화번호 검증 (가입 시 사용) - E.164 형식
export const requiredPhoneSchema = z
  .string()
  .min(1, '전화번호를 입력해주세요')
  .refine((val) => {
    // E.164 형식: +821012345678 (Korean mobile numbers)
    return /^\+821[0-9]{8,9}$/.test(val)
  }, '올바른 전화번호 형식을 입력해주세요 (예: +821012345678)')

// 사용자 역할 검증
export const userRoleSchema = z.enum(['CUSTOMER', 'GROOMER', 'ADMIN'], {
  message: '올바른 사용자 역할을 선택해주세요',
})

// 이름 검증
// 한글 자모(ㄱ-ㅎ, ㅏ-ㅣ)를 포함하여 IME 입력 중에도 validation 통과
export const nameSchema = z
  .string()
  .min(2, '이름은 최소 2자 이상이어야 합니다')
  .max(50, '이름은 최대 50자까지 입력 가능합니다')
  .regex(/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\s]+$/, '이름은 한글, 영문만 입력 가능합니다')

// 로그인 스키마
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, '비밀번호를 입력해주세요'),
  rememberMe: z.boolean().optional(),
})

// 고객 회원가입 스키마
export const customerSignUpSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: '서비스 이용약관에 동의해주세요',
    }),
    agreeToPrivacy: z.boolean().refine((val) => val === true, {
      message: '개인정보 처리방침에 동의해주세요',
    }),
    agreeToMarketing: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })

// 미용사 회원가입 스키마
export const groomerSignUpSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: requiredPhoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
    experience: z.string().min(1, '경력을 선택해주세요'),
    certifications: z.string().optional(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: '서비스 이용약관에 동의해주세요',
    }),
    agreeToPrivacy: z.boolean().refine((val) => val === true, {
      message: '개인정보 처리방침에 동의해주세요',
    }),
    agreeToMarketing: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })

// 관리자 회원가입 스키마 (전화번호 선택사항)
export const adminSignUpSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema, // Optional for admins
    password: passwordSchema,
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: '서비스 이용약관에 동의해주세요',
    }),
    agreeToPrivacy: z.boolean().refine((val) => val === true, {
      message: '개인정보 처리방침에 동의해주세요',
    }),
    agreeToMarketing: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })

// 기존 호환성을 위한 회원가입 스키마 (고객용과 동일)
export const signUpSchema = customerSignUpSchema

// 비밀번호 재설정 스키마 (이메일 링크 방식용 - 토큰 기반)
// Note: Email OTP and SMS OTP methods use their own validation in better-auth
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, '유효하지 않은 토큰입니다'),
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })

// 이메일 인증 재발송 스키마
export const resendVerificationSchema = z.object({
  email: emailSchema,
})

// 전화번호 인증 요청 스키마
export const phoneVerificationRequestSchema = z.object({
  phone: requiredPhoneSchema,
})

// 전화번호 인증 확인 스키마
export const phoneVerificationConfirmSchema = z.object({
  phone: requiredPhoneSchema,
  code: z.string().min(6, '인증번호 6자리를 입력해주세요').max(6, '인증번호는 6자리입니다'),
})

// 이메일 인증 토큰 검증 스키마
export const verifyEmailTokenSchema = z.object({
  token: z.string().min(1, '유효하지 않은 인증 토큰입니다'),
})

// 타입 추론
export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type CustomerSignUpInput = z.infer<typeof customerSignUpSchema>
export type GroomerSignUpInput = z.infer<typeof groomerSignUpSchema>
export type AdminSignUpInput = z.infer<typeof adminSignUpSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>
export type PhoneVerificationRequestInput = z.infer<typeof phoneVerificationRequestSchema>
export type PhoneVerificationConfirmInput = z.infer<typeof phoneVerificationConfirmSchema>
export type VerifyEmailTokenInput = z.infer<typeof verifyEmailTokenSchema>
export type UserRole = z.infer<typeof userRoleSchema>
