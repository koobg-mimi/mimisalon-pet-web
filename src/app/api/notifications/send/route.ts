import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { NotificationService } from '@/lib/notification-service'
import { FCMTokenService } from '@/lib/fcm-token-service'
import auth from '@/lib/auth'
import { z } from 'zod'

// Request schema
export const sendNotificationSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  targetType: z.enum(['user', 'role', 'topic']),
  targetIds: z.array(z.string()).optional(),
  role: z.string().optional(),
  topic: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
})

export type SendNotificationRequest = z.infer<typeof sendNotificationSchema>

// Response type
export type SendNotificationResponse = {
  success: boolean
  successCount: number
  failureCount: number
  message: string
}

export type ErrorResponse = {
  error: string
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SendNotificationResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can send notifications manually
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body: unknown = await request.json()
    const validatedData = sendNotificationSchema.parse(body)
    const { title, message, targetType, targetIds, role, data, topic } = validatedData

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 })
    }

    const notificationData = {
      title,
      body: message,
      data: (data ? Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
      ) : {}) as Record<string, string>,
    }

    let result
    let successCount = 0
    let failureCount = 0

    switch (targetType) {
      case 'user': {
        if (!targetIds || !Array.isArray(targetIds)) {
          return NextResponse.json(
            { error: 'targetIds array is required for user targeting' },
            { status: 400 }
          )
        }

        // Fetch tokens for all target users
        const allTokens: string[] = []
        for (const userId of targetIds) {
          const userTokens = await FCMTokenService.getUserTokens(userId)
          allTokens.push(...userTokens)
        }

        if (allTokens.length === 0) {
          return NextResponse.json(
            { error: 'No valid FCM tokens found for target users' },
            { status: 400 }
          )
        }

        result = await NotificationService.sendToMultipleDevices(allTokens, notificationData)
        successCount = result.successCount
        failureCount = result.failureCount
        break
      }

      case 'role': {
        if (!role) {
          return NextResponse.json(
            { error: 'Role is required for role-based targeting' },
            { status: 400 }
          )
        }

        const tokens = await FCMTokenService.getTokensByRole(role as 'ADMIN' | 'CUSTOMER' | 'GROOMER')
        if (tokens.length === 0) {
          return NextResponse.json(
            { error: `No valid FCM tokens found for role: ${role}` },
            { status: 400 }
          )
        }

        result = await NotificationService.sendToMultipleDevices(tokens, notificationData)
        successCount = result.successCount
        failureCount = result.failureCount
        break
      }

      case 'topic': {
        if (!topic) {
          return NextResponse.json(
            { error: 'Topic is required for topic-based targeting' },
            { status: 400 }
          )
        }

        const success = await NotificationService.sendToTopic(topic, notificationData)
        successCount = success ? 1 : 0
        failureCount = success ? 0 : 1
        break
      }

      default:
        return NextResponse.json(
          { error: 'Invalid targetType. Use "user", "role", or "topic"' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      successCount,
      failureCount,
      message: `Notification sent. Success: ${successCount}, Failed: ${failureCount}`,
    })
  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
