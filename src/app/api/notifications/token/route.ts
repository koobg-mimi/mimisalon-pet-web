import { NextRequest, NextResponse } from 'next/server'
import { FCMTokenService } from '@/lib/fcm-token-service'
import auth from '@/lib/auth'
import { headers } from 'next/headers'
import { z } from 'zod'

// Request schema
export const updateTokenSchema = z.object({
  token: z.string().min(1, 'ExponentPushToken is required'),
  platform: z.enum(['ios', 'android', 'web']).optional(),
  deviceId: z.string().optional(),
})

export type UpdateTokenRequest = z.infer<typeof updateTokenSchema>

// Response types
export type UpdateTokenResponse = {
  success: boolean
  message: string
}

export type DeleteTokenResponse = {
  success: boolean
  message: string
}

export type ErrorResponse = {
  error: string
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<UpdateTokenResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: unknown = await request.json()
    const validatedData = updateTokenSchema.parse(body)
    const { token, platform, deviceId } = validatedData

    console.log(`💾 Saving ExponentPushToken for user ${session.user.id} to DeviceToken table:`, {
      token,
      platform,
      deviceId,
    })

    const result = await FCMTokenService.updateUserToken(
      session.user.id,
      token,
      platform || 'android',
      deviceId
    )

    if (result.success) {
      console.log(`✅ ExponentPushToken successfully saved to database for user ${session.user.id}`)
      return NextResponse.json({
        success: true,
        message: 'ExponentPushToken updated successfully',
      })
    } else {
      console.error(
        `❌ Failed to save ExponentPushToken for user ${session.user.id}:`,
        result.error
      )
      return NextResponse.json(
        { error: result.error || 'Failed to update ExponentPushToken' },
        { status: result.error?.includes('Invalid') ? 400 : 500 }
      )
    }
  } catch (error) {
    console.error('Error updating ExponentPushToken:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(): Promise<NextResponse<DeleteTokenResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const success = await FCMTokenService.removeUserToken(session.user.id)

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'ExponentPushToken removed successfully',
      })
    } else {
      return NextResponse.json({ error: 'Failed to remove ExponentPushToken' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error removing ExponentPushToken:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
