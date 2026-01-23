import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { adminFcmNotificationSchema } from '@/lib/validations/notification'
import { ZodError, type ZodIssue } from 'zod'
import { ExpoNotificationService } from '@/lib/expo-notification-service'
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestBody = await req.json()

    // Validate input using Zod schema
    const validatedData = adminFcmNotificationSchema.parse(requestBody)
    const { userId, title, body } = validatedData

    // 사용자 정보 및 디바이스 토큰 조회
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        notificationsEnabled: true,
        deviceTokens: {
          where: { isActive: true },
          select: { token: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.notificationsEnabled) {
      return NextResponse.json({ error: 'User has disabled notifications' }, { status: 400 })
    }

    if (user.deviceTokens.length === 0) {
      return NextResponse.json(
        { error: 'User does not have any device tokens registered' },
        { status: 400 }
      )
    }

    // Filter valid ExponentPushTokens
    const validTokens = user.deviceTokens
      .map((d) => d.token)
      .filter((token) => ExpoNotificationService.isValidExpoPushToken(token))

    if (validTokens.length === 0) {
      return NextResponse.json({ error: '유효한 ExponentPushToken이 없습니다' }, { status: 400 })
    }

    // Prepare Expo notification
    const notificationData = {
      title,
      body,
      data: {
        type: 'ADMIN_MESSAGE',
        userId: user.id,
        timestamp: new Date().toISOString(),
      },
      sound: 'default' as const,
      badge: 1,
      channelId: 'mimisalon_notifications',
    }

    // Send Expo notification to all user's devices
    const sendResults = await Promise.all(
      validTokens.map((token) => ExpoNotificationService.sendToDevice(token, notificationData))
    )

    const failedDevices = sendResults.filter((r) => !r.success)
    const sendResult = {
      success: failedDevices.length === 0,
      error: failedDevices.length > 0 ? `Failed on ${failedDevices.length} device(s)` : undefined,
    }

    if (!sendResult.success) {
      console.error('❌ Expo notification send failed:', {
        userId: user.id,
        error: sendResult.error,
      })

      // Check if it's a token-related error that needs cleanup
      if (
        sendResult.error?.includes('DeviceNotRegistered') ||
        sendResult.error?.includes('InvalidCredentials') ||
        sendResult.error?.includes('Invalid ExponentPushToken')
      ) {
        // Token is invalid, mark it as inactive in DeviceToken table
        try {
          await prisma.deviceToken.updateMany({
            where: {
              userId: user.id,
              token: { in: validTokens },
            },
            data: { isActive: false },
          })
          console.log('🧹 Marked invalid ExponentPushTokens as inactive for user:', user.id)
        } catch (dbError) {
          console.error('Failed to mark invalid ExponentPushTokens as inactive:', dbError)
        }

        return NextResponse.json(
          { error: 'ExponentPushToken이 유효하지 않아 비활성화되었습니다' },
          { status: 400 }
        )
      }

      if (sendResult.error?.includes('RateLimitExceeded')) {
        return NextResponse.json({ error: '메시지 전송 속도 제한을 초과했습니다' }, { status: 429 })
      }

      // Generic Expo error
      return NextResponse.json(
        { error: `알림 전송에 실패했습니다: ${sendResult.error}` },
        { status: 500 }
      )
    }

    // Note: Expo returns multiple results, extract ticket from first successful result if available
    const expoPushTicketId = undefined

    console.log('✅ Expo notification sent successfully:', {
      ticketId: expoPushTicketId,
      userId: user.id,
      title: title.substring(0, 50) + (title.length > 50 ? '...' : ''),
    })

    // 알림 기록 저장
    await prisma.notification.create({
      data: {
        userId: user.id,
        title,
        body,
        type: 'ADMIN_MESSAGE',
        isRead: false,
        metadata: {
          sentBy: session.user.id,
          sentAt: new Date().toISOString(),
          method: 'EXPO',
          expoPushTicketId,
          expoStatus: 'sent',
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Expo notification sent successfully',
      expoPushTicketId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: '유효하지 않은 입력 데이터입니다',
          details: error.issues.map((err: ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      )
    }

    // Handle other errors
    console.error('FCM send error:', error)

    // If it's a Prisma error, handle it appropriately
    if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
      return NextResponse.json({ error: '데이터베이스 오류가 발생했습니다' }, { status: 500 })
    }

    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다' }, { status: 500 })
  }
}
