import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@mimisalon/shared'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

/**
 * Request schema for email OTP verification
 */
export const verifyEmailOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().min(6, 'OTP code must be at least 6 characters'),
})

/**
 * Request body type for email OTP verification
 */
export type VerifyEmailOtpRequest = z.infer<typeof verifyEmailOtpSchema>

/**
 * Response type for successful email OTP verification
 */
export type VerifyEmailOtpResponse = {
  success: true
  message: string
}

/**
 * Error response type for email OTP verification
 */
export type VerifyEmailOtpErrorResponse = {
  error: string
  details?: z.ZodIssue[]
}

/**
 * Verify email OTP code for signup
 *
 * This endpoint checks if the OTP code is valid without updating any user records.
 * Used during signup flow before user account is created.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<VerifyEmailOtpResponse | VerifyEmailOtpErrorResponse>> {
  try {
    const body: unknown = await request.json()

    // Validate request body
    const validatedData = verifyEmailOtpSchema.parse(body)
    const { email, code } = validatedData

    // Find verification record
    // Note: better-auth emailOTP plugin stores identifier as "email-verification-otp-{email}"
    // and OTP in format "CODE:ATTEMPTS" (e.g., "123456:0")
    const identifier = `email-verification-otp-${email}`

    const verification = await prisma.verification.findFirst({
      where: {
        identifier: identifier,
        expiresAt: {
          gt: new Date(), // Not expired
        },
      },
      orderBy: {
        createdAt: 'desc', // Get most recent
      },
    })

    if (!verification) {
      return NextResponse.json<VerifyEmailOtpErrorResponse>(
        { error: 'Invalid or expired OTP code' },
        { status: 400 }
      )
    }

    // Parse the stored value format: "CODE:ATTEMPTS"
    const [storedCode] = verification.value.split(':')

    if (storedCode !== code) {
      return NextResponse.json<VerifyEmailOtpErrorResponse>(
        { error: 'Invalid OTP code' },
        { status: 400 }
      )
    }

    // OTP is valid - delete the verification record to prevent reuse
    await prisma.verification.delete({
      where: {
        id: verification.id,
      },
    })

    return NextResponse.json<VerifyEmailOtpResponse>({
      success: true,
      message: 'Email verified successfully',
    })
  } catch (error) {
    console.error('Error verifying email OTP:', error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json<VerifyEmailOtpErrorResponse>(
        {
          error: 'Invalid request data',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json<VerifyEmailOtpErrorResponse>(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}
