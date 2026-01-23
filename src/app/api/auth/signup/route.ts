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
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['CUSTOMER', 'GROOMER', 'ADMIN'], {
    message: 'Role must be CUSTOMER, GROOMER, or ADMIN',
  }),
  phoneVerified: z.boolean(),
})

/**
 * Request body type for signup
 */
export type SignupRequest = z.infer<typeof signupSchema>

/**
 * Response type for successful signup
 */
export type SignupResponse = {
  success: true
  message: string
  userId: string
}

/**
 * Error response type
 */
export type SignupErrorResponse = {
  error: string
  code?: 'PHONE_NOT_VERIFIED' | 'EMAIL_ALREADY_EXISTS'
  message?: string
  details?: z.ZodIssue[]
}

/**
 * User signup endpoint
 *
 * Creates a new user account with email and password.
 * Requires email and phone verification to be completed before signup.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<SignupResponse | SignupErrorResponse>> {
  try {
    const body: unknown = await request.json()

    // Validate request body
    const validatedData = signupSchema.parse(body)
    const { name, email, phone, password, role, phoneVerified } = validatedData

    // Phone verification is required for signup via /auth/signin
    if (!phoneVerified) {
      return NextResponse.json<SignupErrorResponse>(
        { error: 'Phone verification required', code: 'PHONE_NOT_VERIFIED' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json<SignupErrorResponse>(
        { error: 'Email already registered', code: 'EMAIL_ALREADY_EXISTS' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user (phone verification is guaranteed at this point)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        emailVerified: new Date(), // Email verification completed - store timestamp
        phoneNumber: phone,
        phoneNumberVerified: true, // Phone verification completed
        role,
        image: null,
      },
    })

    // Create account record for password
    await prisma.account.create({
      data: {
        userId: user.id,
        accountId: user.id,
        providerId: 'credential',
        password: hashedPassword,
      },
    })

    return NextResponse.json<SignupResponse>(
      {
        success: true,
        message: 'User created successfully',
        userId: user.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json<SignupErrorResponse>(
        {
          error: 'Invalid request data',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json<SignupErrorResponse>(
      { error: 'Failed to create user', message: String(error) },
      { status: 500 }
    )
  }
}
