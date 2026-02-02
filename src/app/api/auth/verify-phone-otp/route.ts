import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@mimisalon/shared'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

/**
 * Request schema for phone OTP verification
 */
export const verifyPhoneOtpSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
  code: z.string().min(6, 'OTP code must be at least 6 characters'),
})

/**
 * Request body type for phone OTP verification
 */
export type VerifyPhoneOtpRequest = z.infer<typeof verifyPhoneOtpSchema>

/**
 * Response type for successful phone OTP verification
 */
export type VerifyPhoneOtpResponse = {
  success: true
  message: string
}

/**
 * Error response type for phone OTP verification
 */
export type VerifyPhoneOtpErrorResponse = {
  error: string
  details?: z.ZodIssue[]
}

/**
 * Verify phone OTP code for signup
 *
 * This endpoint checks if the OTP code is valid without updating any user records.
 * Used during signup flow before user account is created.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<VerifyPhoneOtpResponse | VerifyPhoneOtpErrorResponse>> {
  try {
    const body: unknown = await request.json()

    // Validate request body
    const validatedData = verifyPhoneOtpSchema.parse(body)
    const { phoneNumber, code } = validatedData

    // Find verification record
    // Note: better-auth stores OTP in format "CODE:ATTEMPTS" (e.g., "123456:0")
    const verification = await prisma.verification.findFirst({
      where: {
        identifier: phoneNumber,
        expiresAt: {
          gt: new Date(), // Not expired
        },
      },
      orderBy: {
        createdAt: 'desc', // Get most recent
      },
    })

    if (!verification) {
      return NextResponse.json<VerifyPhoneOtpErrorResponse>(
        { error: 'Invalid or expired OTP code' },
        { status: 400 }
      )
    }

    // Parse the stored value format: "CODE:ATTEMPTS"
    const [storedCode] = verification.value.split(':')

    if (storedCode !== code) {
      return NextResponse.json<VerifyPhoneOtpErrorResponse>(
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

    return NextResponse.json<VerifyPhoneOtpResponse>({
      success: true,
      message: 'Phone number verified successfully',
    })
  } catch (error) {
    console.error('Error verifying phone OTP:', error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json<VerifyPhoneOtpErrorResponse>(
        {
          error: 'Invalid request data',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json<VerifyPhoneOtpErrorResponse>(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}
