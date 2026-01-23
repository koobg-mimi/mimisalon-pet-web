import { PrismaClient } from '@mimisalon/shared'
import { ExpoNotificationService } from './expo-notification-service'

const prisma = new PrismaClient()

export class FCMTokenService {
  /**
   * Validate if a token is a valid ExponentPushToken
   */
  static isValidExpoPushToken(token: string): boolean {
    return ExpoNotificationService.isValidExpoPushToken(token)
  }

  /**
   * Update or create user's ExponentPushToken in DeviceToken table
   * Supports multiple devices per user
   */
  static async updateUserToken(
    userId: string,
    token: string,
    platform: 'ios' | 'android' | 'web' = 'android',
    deviceId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate that the token is a valid ExponentPushToken
      if (!ExpoNotificationService.isValidExpoPushToken(token)) {
        return {
          success: false,
          error: 'Invalid ExponentPushToken format',
        }
      }

      // Upsert device token (create or update existing)
      const deviceToken = await prisma.deviceToken.upsert({
        where: { token },
        create: {
          userId,
          token,
          platform,
          deviceId,
          isActive: true,
          lastUsed: new Date(),
        },
        update: {
          isActive: true,
          lastUsed: new Date(),
          platform,
          deviceId,
        },
        select: {
          id: true,
          token: true,
          platform: true,
          lastUsed: true,
        },
      })

      console.log(`✅ ExponentPushToken saved to DeviceToken table:`)
      console.log(`   User ID: ${userId}`)
      console.log(`   Token: ${deviceToken.token}`)
      console.log(`   Platform: ${deviceToken.platform}`)
      console.log(`   Last Used: ${deviceToken.lastUsed}`)

      return { success: true }
    } catch (error) {
      console.error('Error updating ExponentPushToken:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Get user's active ExponentPushTokens (all devices)
   * Returns array of tokens since users can have multiple devices
   */
  static async getUserTokens(userId: string): Promise<string[]> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { notificationsEnabled: true },
      })

      if (!user || !user.notificationsEnabled) {
        return []
      }

      const deviceTokens = await prisma.deviceToken.findMany({
        where: {
          userId,
          isActive: true,
        },
        select: { token: true },
      })

      // Validate all tokens
      const validTokens = deviceTokens
        .filter((device) => ExpoNotificationService.isValidExpoPushToken(device.token))
        .map((device) => device.token)

      return validTokens
    } catch (error) {
      console.error('Error getting user ExponentPushTokens:', error)
      return []
    }
  }

  /**
   * Get user's single ExponentPushToken (most recently used)
   * For backward compatibility - prefer getUserTokens for multi-device support
   */
  static async getUserToken(userId: string): Promise<string | null> {
    const tokens = await this.getUserTokens(userId)
    return tokens[0] || null
  }

  /**
   * Get ExponentPushTokens for multiple users
   * Returns all active device tokens for the specified users
   */
  static async getMultipleUserTokens(userIds: string[]): Promise<string[]> {
    try {
      const users = await prisma.user.findMany({
        where: {
          id: { in: userIds },
          notificationsEnabled: true,
        },
        select: { id: true },
      })

      const enabledUserIds = users.map((u) => u.id)

      const deviceTokens = await prisma.deviceToken.findMany({
        where: {
          userId: { in: enabledUserIds },
          isActive: true,
        },
        select: { token: true },
      })

      // Validate all tokens
      const validTokens = deviceTokens
        .filter((device) => ExpoNotificationService.isValidExpoPushToken(device.token))
        .map((device) => device.token)

      return validTokens
    } catch (error) {
      console.error('Error getting user ExponentPushTokens:', error)
      return []
    }
  }

  /**
   * Remove specific device token
   */
  static async removeDeviceToken(token: string): Promise<boolean> {
    try {
      await prisma.deviceToken.delete({
        where: { token },
      })
      console.log(`ExponentPushToken removed: ${token}`)
      return true
    } catch (error) {
      console.error('Error removing ExponentPushToken:', error)
      return false
    }
  }

  /**
   * Remove all device tokens for a user (when user logs out or uninstalls app)
   */
  static async removeUserToken(userId: string): Promise<boolean> {
    try {
      await prisma.deviceToken.deleteMany({
        where: { userId },
      })
      console.log(`All ExponentPushTokens removed for user: ${userId}`)
      return true
    } catch (error) {
      console.error('Error removing ExponentPushTokens:', error)
      return false
    }
  }

  /**
   * Deactivate user's device tokens instead of deleting
   * Useful for temporary disablement
   */
  static async deactivateUserTokens(userId: string): Promise<boolean> {
    try {
      await prisma.deviceToken.updateMany({
        where: { userId },
        data: { isActive: false },
      })
      console.log(`ExponentPushTokens deactivated for user: ${userId}`)
      return true
    } catch (error) {
      console.error('Error deactivating ExponentPushTokens:', error)
      return false
    }
  }

  /**
   * Get ExponentPushTokens for users with a specific role
   */
  static async getTokensByRole(role: 'CUSTOMER' | 'GROOMER' | 'ADMIN'): Promise<string[]> {
    try {
      const users = await prisma.user.findMany({
        where: {
          role,
          notificationsEnabled: true,
        },
        select: { id: true },
      })

      const userIds = users.map((u) => u.id)

      const deviceTokens = await prisma.deviceToken.findMany({
        where: {
          userId: { in: userIds },
          isActive: true,
        },
        select: { token: true },
      })

      // Validate all tokens
      const validTokens = deviceTokens
        .filter((device) => ExpoNotificationService.isValidExpoPushToken(device.token))
        .map((device) => device.token)

      return validTokens
    } catch (error) {
      console.error('Error getting ExponentPushTokens by role:', error)
      return []
    }
  }

  /**
   * Update user's notification preferences
   */
  static async updateNotificationPreference(userId: string, enabled: boolean): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { notificationsEnabled: enabled },
      })
      console.log(`Notification preference updated for user: ${userId} to ${enabled}`)
      return true
    } catch (error) {
      console.error('Error updating notification preference:', error)
      return false
    }
  }

  /**
   * Get all active groomers' ExponentPushTokens
   */
  static async getAllGroomerTokens(): Promise<string[]> {
    return this.getTokensByRole('GROOMER')
  }
}
