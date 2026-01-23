import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@mimisalon/shared'
import { FCMTokenService } from '@/lib/fcm-token-service'
import { z } from 'zod'

// Request body validation schema
export const registerTokenSchema = z
  .object({
    // User identification methods (at least one required)
    userId: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),

    // Token data
    expoToken: z.string().min(1, 'ExpoToken is required'),

    // Optional device info for better tracking
    deviceInfo: z
      .object({
        platform: z.enum(['ios', 'android']).optional(),
        deviceId: z.string().optional(),
        appVersion: z.string().optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      // At least one identification method must be provided
      return data.userId || data.email || data.phone
    },
    {
      message: 'At least one user identification method (userId, email, or phone) is required',
    }
  )

export type RegisterTokenRequest = z.infer<typeof registerTokenSchema>

// Response types
export type RegisterTokenResponse = {
  success: boolean
  message: string
  data: {
    userId: string
    userEmail: string | null
    userName: string | null
    platform: string
    deviceId?: string
  }
}

export type RegisterTokenErrorResponse = {
  success: false
  error: string
  details?: Array<{
    field: string
    message: string
  }>
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<RegisterTokenResponse | RegisterTokenErrorResponse>> {
  try {
    const body: unknown = await request.json()

    // Validate request body
    const validatedData = registerTokenSchema.parse(body)

    console.log('📱 Received token registration request:', {
      hasUserId: !!validatedData.userId,
      hasEmail: !!validatedData.email,
      hasPhone: !!validatedData.phone,
      tokenPreview: validatedData.expoToken?.substring(0, 30) + '...',
    })
    const { userId, email, phone, expoToken, deviceInfo } = validatedData

    // Validate ExponentPushToken format
    if (!FCMTokenService.isValidExpoPushToken(expoToken)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid ExponentPushToken format',
        },
        { status: 400 }
      )
    }

    // Find user by provided identification
    let user

    if (userId) {
      console.log('🔍 Looking up user by ID:', userId)
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          phoneNumber: true,
          name: true,
        },
      })
    } else if (email) {
      console.log('🔍 Looking up user by email:', email)
      user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          phoneNumber: true,
          name: true,
        },
      })
    } else if (phone) {
      console.log('🔍 Looking up user by phone:', phone)
      user = await prisma.user.findFirst({
        where: { phoneNumber: phone },
        select: {
          id: true,
          email: true,
          phoneNumber: true,
          name: true,
        },
      })
    }

    if (!user) {
      console.log('❌ User not found')
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      )
    }

    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      name: user.name,
    })

    // Register device token using FCMTokenService
    const result = await FCMTokenService.updateUserToken(
      user.id,
      expoToken,
      deviceInfo?.platform || 'android',
      deviceInfo?.deviceId
    )

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to register token',
        },
        { status: 500 }
      )
    }

    console.log('✅ ExponentPushToken successfully registered:')
    console.log('   User ID:', user.id)
    console.log('   User Email:', user.email)
    console.log('   User Name:', user.name)
    console.log('   Platform:', deviceInfo?.platform || 'android')
    console.log('   Device ID:', deviceInfo?.deviceId)

    return NextResponse.json({
      success: true,
      message: 'ExponentPushToken registered successfully',
      data: {
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        platform: deviceInfo?.platform || 'android',
        deviceId: deviceInfo?.deviceId,
      },
    })
  } catch (error) {
    console.error('❌ Error registering ExponentPushToken:', error)

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      )
    }

    // Handle database errors
    if (error && typeof error === 'object' && 'code' in error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database error occurred',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
