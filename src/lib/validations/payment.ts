import { z } from 'zod'

// 결제 정보 스키마
export const paymentMethodSchema = z.object({
  type: z.enum(['CARD', 'BANK_TRANSFER', 'DIGITAL_WALLET']),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardHolderName: z.string().optional(),
  bankCode: z.string().optional(),
  accountNumber: z.string().optional(),
  walletProvider: z.enum(['KAKAO_PAY', 'TOSS_PAY', 'NAVER_PAY']).optional(),
})

export const billingAddressSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  phone: z.string().min(1, '연락처를 입력해주세요'),
  address: z.string().min(1, '주소를 입력해주세요'),
  detailAddress: z.string().optional(),
  zipCode: z.string().min(5, '우편번호를 입력해주세요'),
})

export const paymentSchema = z.object({
  bookingId: z.string(),
  services: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      duration: z.number(),
    })
  ),
  totalAmount: z.number().positive('결제 금액이 올바르지 않습니다'),
  discountAmount: z.number().optional().default(0),
  finalAmount: z.number().positive(),
  paymentMethod: paymentMethodSchema,
  billingAddress: billingAddressSchema,
  couponCode: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: '이용약관에 동의해주세요',
  }),
  agreeToPrivacy: z.boolean().refine((val) => val === true, {
    message: '개인정보 처리방침에 동의해주세요',
  }),
})

export const refundRequestSchema = z.object({
  bookingId: z.string(),
  reason: z.enum([
    'CUSTOMER_REQUEST',
    'GROOMER_CANCELLATION',
    'SALON_CLOSURE',
    'FORCE_MAJEURE',
    'OTHER',
  ]),
  customReason: z.string().optional(),
  refundAmount: z.number().positive(),
  bankAccount: z
    .object({
      bankCode: z.string(),
      accountNumber: z.string(),
      accountHolder: z.string(),
    })
    .optional(),
})

export const couponSchema = z.object({
  code: z.string().min(1, '쿠폰 코드를 입력해주세요'),
  bookingAmount: z.number().positive(),
})

export type PaymentMethod = z.infer<typeof paymentMethodSchema>
export type BillingAddress = z.infer<typeof billingAddressSchema>
export type PaymentInput = z.infer<typeof paymentSchema>
export type RefundRequestInput = z.infer<typeof refundRequestSchema>
export type CouponInput = z.infer<typeof couponSchema>
