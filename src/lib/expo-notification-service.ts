import { Expo, ExpoPushMessage, ExpoPushTicket, ExpoPushReceipt } from 'expo-server-sdk'

export interface ExpoNotificationData {
  title: string
  body: string
  data?: Record<string, string>
  sound?: 'default' | null
  badge?: number
  channelId?: string
}

export interface ExpoNotificationTarget {
  token?: string
  tokens?: string[]
}

export class ExpoNotificationService {
  private static expo = new Expo({
    accessToken: process.env.EXPO_ACCESS_TOKEN,
    useFcmV1: true, // Use the newer FCM v1 API
  })

  /**
   * Send notification to a single device using ExponentPushToken
   */
  static async sendToDevice(
    token: string,
    notification: ExpoNotificationData
  ): Promise<{ success: boolean; ticket?: ExpoPushTicket; error?: string }> {
    try {
      // Check if the token is a valid Expo push token
      if (!Expo.isExpoPushToken(token)) {
        return {
          success: false,
          error: 'Invalid ExponentPushToken format',
        }
      }

      const message: ExpoPushMessage = {
        to: token,
        sound: notification.sound || 'default',
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        badge: notification.badge,
        channelId: notification.channelId || 'mimisalon_notifications',
        priority: 'high',
      }

      const tickets = await this.expo.sendPushNotificationsAsync([message])
      const ticket = tickets[0]

      if (ticket.status === 'error') {
        console.error('Error sending notification:', ticket.message)
        return {
          success: false,
          error: ticket.message,
        }
      }

      console.log('Successfully sent notification:', ticket.id)
      return {
        success: true,
        ticket,
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Send notification to multiple devices using ExponentPushTokens
   */
  static async sendToMultipleDevices(
    tokens: string[],
    notification: ExpoNotificationData
  ): Promise<{
    successCount: number
    failureCount: number
    tickets: ExpoPushTicket[]
    errors: string[]
  }> {
    try {
      // Filter valid tokens
      const validTokens = tokens.filter((token) => Expo.isExpoPushToken(token))
      const invalidTokens = tokens.filter((token) => !Expo.isExpoPushToken(token))

      if (invalidTokens.length > 0) {
        console.warn(`Found ${invalidTokens.length} invalid tokens:`, invalidTokens)
      }

      if (validTokens.length === 0) {
        return {
          successCount: 0,
          failureCount: tokens.length,
          tickets: [],
          errors: ['No valid ExponentPushTokens found'],
        }
      }

      // Create messages
      const messages: ExpoPushMessage[] = validTokens.map((token) => ({
        to: token,
        sound: notification.sound || 'default',
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        badge: notification.badge,
        channelId: notification.channelId || 'mimisalon_notifications',
        priority: 'high',
      }))

      // Send notifications in chunks (Expo recommends max 100 per batch)
      const chunks = this.expo.chunkPushNotifications(messages)
      const tickets: ExpoPushTicket[] = []
      const errors: string[] = []

      for (const chunk of chunks) {
        try {
          const chunkTickets = await this.expo.sendPushNotificationsAsync(chunk)
          tickets.push(...chunkTickets)
        } catch (error) {
          console.error('Error sending chunk:', error)
          errors.push(error instanceof Error ? error.message : 'Unknown chunk error')
        }
      }

      const successCount = tickets.filter((ticket) => ticket.status === 'ok').length
      const failureCount = tickets.filter((ticket) => ticket.status === 'error').length

      // Add invalid tokens to failure count
      const totalFailureCount = failureCount + invalidTokens.length

      console.log(`Sent notifications: ${successCount} success, ${totalFailureCount} failed`)

      return {
        successCount,
        failureCount: totalFailureCount,
        tickets,
        errors,
      }
    } catch (error) {
      console.error('Error sending multicast notification:', error)
      return {
        successCount: 0,
        failureCount: tokens.length,
        tickets: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      }
    }
  }

  /**
   * Get push notification receipts to check delivery status
   */
  static async getPushNotificationReceipts(
    receiptIds: string[]
  ): Promise<{ receipts: ExpoPushReceipt[]; errors: string[] }> {
    try {
      const receiptIdChunks = this.expo.chunkPushNotificationReceiptIds(receiptIds)
      const receipts: ExpoPushReceipt[] = []
      const errors: string[] = []

      for (const chunk of receiptIdChunks) {
        try {
          const chunkReceipts = await this.expo.getPushNotificationReceiptsAsync(chunk)
          receipts.push(...Object.values(chunkReceipts))
        } catch (error) {
          console.error('Error fetching receipts:', error)
          errors.push(error instanceof Error ? error.message : 'Unknown receipt error')
        }
      }

      return { receipts, errors }
    } catch (error) {
      console.error('Error getting push notification receipts:', error)
      return {
        receipts: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      }
    }
  }

  /**
   * Validate if a token is a valid ExponentPushToken
   */
  static isValidExpoPushToken(token: string): boolean {
    return Expo.isExpoPushToken(token)
  }
}
