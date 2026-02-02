import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@mimisalon/shared'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const prisma = new PrismaClient()

/**
 * Request schema for user signup
 */
export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),

  // ✅ phone optional (빈 문자열도 허용)
  phone: z.string().trim().optional().or(z.literal('')),

  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['CUSTOMER', 'GROOMER', 'ADMIN'], {
    message: 'Role must be CUSTOMER, GROOMER, or ADMIN',
  }),

  // ✅ phone 인증값은 유지하되, phone이 없으면 의미 없으니 optional로 해도 됨
  phoneVerified: z.boolean().optional(),
})

export type SignupRequest = z.infer<typeof signupSchema>

export type SignupResponse = {
  success: true
  message: string
  userId: string
}

export type SignupErrorResponse = {
  error: string
  code?: 'PHONE_NOT_VERIFIED' | 'EMAIL_ALREADY_EXISTS'
  message?: string
  details?: z.ZodIssue[]
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SignupResponse | SignupErrorResponse>> {
  try {
    const body: unknown = await request.json()

    const validatedData = signupSchema.parse(body)
    const { name, email, password, role } = validatedData

    // ✅ phone 정규화: '' -> undefined
    const phone = validatedData.phone?.trim() ? validatedData.phone.trim() : undefined
    const phoneVerified = Boolean(validatedData.phoneVerified)

    // ✅ phone이 존재할 때만 phoneVerified 요구
    if (phone && !phoneVerified) {
      return NextResponse.json<SignupErrorResponse>(
        { error: 'Phone verification required', code: 'PHONE_NOT_VERIFIED' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json<SignupErrorResponse>(
        { error: 'Email already registered', code: 'EMAIL_ALREADY_EXISTS' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        emailVerified: new Date(),

        // ✅ phone이 있을 때만 저장
        phoneNumber: phone ?? null,
        phoneNumberVerified: phone ? true : false,

        role,
        image: null,
      },
    })

    await prisma.account.create({
      data: {
        userId: user.id,
        accountId: user.id,
        providerId: 'credential',
        password: hashedPassword,
      },
    })

    return NextResponse.json<SignupResponse>(
      { success: true, message: 'User created successfully', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json<SignupErrorResponse>(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json<SignupErrorResponse>(
      { error: 'Failed to create user', message: String(error) },
      { status: 500 }
    )
  }
}
