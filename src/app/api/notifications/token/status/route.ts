import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { ExpoNotificationService } from '@/lib/expo-notification-service'

// Response types
export type DeviceInfo = {
  id: string
  token: string
  platform: string
  deviceId: string | null
  lastUsed: Date
  createdAt: Date
  isValid: boolean
}

export type TokenStatusResponse = {
  success: boolean
  data: {
    userId: string
    userEmail: string | null
    hasToken: boolean
    deviceCount: number
    validTokenCount: number
    devices: DeviceInfo[]
    notificationsEnabled: boolean
  }
}

export type ErrorResponse = {
  error: string
}

export async function GET(): Promise<NextResponse<TokenStatusResponse | ErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's current device tokens from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        notificationsEnabled: true,
        deviceTokens: {
          where: { isActive: true },
          select: {
            id: true,
            token: true,
            platform: true,
            deviceId: true,
            lastUsed: true,
            createdAt: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const validTokens = user.deviceTokens.filter((device) =>
      ExpoNotificationService.isValidExpoPushToken(device.token)
    )

    const tokenStatus = {
      userId: user.id,
      userEmail: user.email,
      hasToken: user.deviceTokens.length > 0,
      deviceCount: user.deviceTokens.length,
      validTokenCount: validTokens.length,
      devices: user.deviceTokens.map((device) => ({
        id: device.id,
        token: device.token,
        platform: device.platform,
        deviceId: device.deviceId,
        lastUsed: device.lastUsed,
        createdAt: device.createdAt,
        isValid: ExpoNotificationService.isValidExpoPushToken(device.token),
      })),
      notificationsEnabled: user.notificationsEnabled,
    }

    console.log('📊 User token status:', tokenStatus)

    return NextResponse.json({
      success: true,
      data: tokenStatus,
    })
  } catch (error) {
    console.error('Error getting token status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
