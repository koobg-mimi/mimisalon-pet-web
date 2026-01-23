import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { FCMTokenService } from '@/lib/fcm-token-service'
import auth from '@/lib/auth'
import { z } from 'zod'

// Request schema
export const updatePreferencesSchema = z.object({
  enabled: z.boolean(),
})

export type UpdatePreferencesRequest = z.infer<typeof updatePreferencesSchema>

// Response type
export type UpdatePreferencesResponse = {
  success: boolean
  message: string
}

export type ErrorResponse = {
  error: string
}

export async function PUT(
  request: NextRequest
): Promise<NextResponse<UpdatePreferencesResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: unknown = await request.json()
    const validatedData = updatePreferencesSchema.parse(body)
    const { enabled } = validatedData

    const success = await FCMTokenService.updateNotificationPreference(session.user.id, enabled)

    if (success) {
      return NextResponse.json({
        success: true,
        message: `Notifications ${enabled ? 'enabled' : 'disabled'} successfully`,
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to update notification preferences' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error updating notification preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
