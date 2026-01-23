import { ExpoNotificationService, ExpoNotificationData } from './expo-notification-service';

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, string>;
  sound?: 'default' | null;
  badge?: number;
  channelId?: string;
}

export interface NotificationTarget {
  token?: string;
  tokens?: string[];
  topic?: string;
}

export class NotificationService {
  /**
   * Send notification to a single device using ExponentPushToken
   */
  static async sendToDevice(token: string, notification: NotificationData): Promise<boolean> {
    try {
      const expoNotification: ExpoNotificationData = {
        title: notification.title,
        body: notification.body,
        data: notification.data,
        sound: notification.sound,
        badge: notification.badge,
        channelId: notification.channelId,
      };

      const result = await ExpoNotificationService.sendToDevice(token, expoNotification);

      if (result.success) {
        const ticketId = result.ticket && 'id' in result.ticket ? result.ticket.id : 'unknown';
        console.log('Successfully sent notification:', ticketId);
        return true;
      } else {
        console.error('Error sending notification:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  /**
   * Send notification to multiple devices using ExponentPushTokens
   */
  static async sendToMultipleDevices(
    tokens: string[],
    notification: NotificationData
  ): Promise<{ successCount: number; failureCount: number }> {
    try {
      const expoNotification: ExpoNotificationData = {
        title: notification.title,
        body: notification.body,
        data: notification.data,
        sound: notification.sound,
        badge: notification.badge,
        channelId: notification.channelId,
      };

      const result = await ExpoNotificationService.sendToMultipleDevices(tokens, expoNotification);

      console.log('Successfully sent notifications:', {
        successCount: result.successCount,
        failureCount: result.failureCount,
      });

      return {
        successCount: result.successCount,
        failureCount: result.failureCount,
      };
    } catch (error) {
      console.error('Error sending multicast notification:', error);
      return { successCount: 0, failureCount: tokens.length };
    }
  }

  /**
   * Send notification to a topic (not supported by Expo, kept for compatibility)
   */
  static async sendToTopic(topic: string, notification: NotificationData): Promise<boolean> {
    console.warn('Topic notifications are not supported by Expo Push Notifications');
    return false;
  }

  /**
   * Subscribe tokens to a topic (not supported by Expo, kept for compatibility)
   */
  static async subscribeToTopic(tokens: string[], topic: string): Promise<boolean> {
    console.warn('Topic subscriptions are not supported by Expo Push Notifications');
    return false;
  }

  /**
   * Unsubscribe tokens from a topic (not supported by Expo, kept for compatibility)
   */
  static async unsubscribeFromTopic(tokens: string[], topic: string): Promise<boolean> {
    console.warn('Topic unsubscriptions are not supported by Expo Push Notifications');
    return false;
  }

  /**
   * Validate if a token is a valid ExponentPushToken
   */
  static isValidExpoPushToken(token: string): boolean {
    return ExpoNotificationService.isValidExpoPushToken(token);
  }
}
