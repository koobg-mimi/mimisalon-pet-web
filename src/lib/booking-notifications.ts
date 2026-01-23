import { NotificationService } from './notification-service'
import { FCMTokenService } from './fcm-token-service'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export interface BookingNotificationData {
  bookingId: string
  bookingNumber: string
  customerName: string
  groomerName?: string
  serviceDate: Date
  serviceTime: string
  petNames: string[]
  totalPrice: number
}

export class BookingNotificationService {
  /**
   * Send notification when a new booking is created
   */
  static async notifyNewBooking(
    customerId: string,
    bookingData: BookingNotificationData
  ): Promise<boolean> {
    try {
      const customerToken = await FCMTokenService.getUserToken(customerId)
      if (!customerToken) {
        console.log('No FCM token found for customer:', customerId)
        return false
      }

      const petNamesText = bookingData.petNames.join(', ')
      const dateText = format(bookingData.serviceDate, 'M월 d일 (E)', {
        locale: ko,
      })

      const notification = {
        title: '예약이 성공적으로 완료되었습니다!',
        body: `${petNamesText}의 미용 예약 (${dateText} ${bookingData.serviceTime})`,
        data: {
          type: 'booking_created',
          bookingId: bookingData.bookingId,
          bookingNumber: bookingData.bookingNumber,
          url: `/customer/booking/${bookingData.bookingId}`,
        },
      }

      return await NotificationService.sendToDevice(customerToken, notification)
    } catch (error) {
      console.error('Error sending new booking notification:', error)
      return false
    }
  }

  /**
   * Notify all groomers about a new booking (for groomer assignment)
   */
  static async notifyGroomersNewBooking(
    bookingData: BookingNotificationData
  ): Promise<{ successCount: number; failureCount: number }> {
    try {
      const groomerTokens = await FCMTokenService.getTokensByRole('GROOMER')
      if (groomerTokens.length === 0) {
        console.log('No groomer FCM tokens found')
        return { successCount: 0, failureCount: 0 }
      }

      const petNamesText = bookingData.petNames.join(', ')
      const dateText = format(bookingData.serviceDate, 'M월 d일 (E)', {
        locale: ko,
      })

      const notification = {
        title: '새로운 예약이 등록되었습니다',
        body: `${bookingData.customerName}님의 ${petNamesText} 미용 예약 (${dateText} ${bookingData.serviceTime})`,
        data: {
          type: 'new_booking_available',
          bookingId: bookingData.bookingId,
          bookingNumber: bookingData.bookingNumber,
          url: `/groomer/bookings/${bookingData.bookingId}`,
        },
      }

      return await NotificationService.sendToMultipleDevices(groomerTokens, notification)
    } catch (error) {
      console.error('Error sending groomer notification:', error)
      return { successCount: 0, failureCount: 0 }
    }
  }

  /**
   * Notify customer when groomer is assigned
   */
  static async notifyGroomerAssigned(
    customerId: string,
    bookingData: BookingNotificationData
  ): Promise<boolean> {
    try {
      const customerToken = await FCMTokenService.getUserToken(customerId)
      if (!customerToken) {
        console.log('No FCM token found for customer:', customerId)
        return false
      }

      const petNamesText = bookingData.petNames.join(', ')
      const dateText = format(bookingData.serviceDate, 'M월 d일 (E)', {
        locale: ko,
      })

      const notification = {
        title: '미용사가 배정되었습니다!',
        body: `${bookingData.groomerName}님이 ${petNamesText}의 미용을 담당하게 되었습니다 (${dateText} ${bookingData.serviceTime})`,
        data: {
          type: 'groomer_assigned',
          bookingId: bookingData.bookingId,
          bookingNumber: bookingData.bookingNumber,
          url: `/customer/booking/${bookingData.bookingId}`,
        },
      }

      return await NotificationService.sendToDevice(customerToken, notification)
    } catch (error) {
      console.error('Error sending groomer assigned notification:', error)
      return false
    }
  }

  /**
   * Notify groomer when they are assigned to a booking
   */
  static async notifyGroomerOfAssignment(
    groomerId: string,
    bookingData: BookingNotificationData
  ): Promise<boolean> {
    try {
      const groomerToken = await FCMTokenService.getUserToken(groomerId)
      if (!groomerToken) {
        console.log('No FCM token found for groomer:', groomerId)
        return false
      }

      const petNamesText = bookingData.petNames.join(', ')
      const dateText = format(bookingData.serviceDate, 'M월 d일 (E)', {
        locale: ko,
      })

      const notification = {
        title: '새로운 예약이 배정되었습니다',
        body: `${bookingData.customerName}님의 ${petNamesText} 미용 예약이 배정되었습니다 (${dateText} ${bookingData.serviceTime})`,
        data: {
          type: 'booking_assigned',
          bookingId: bookingData.bookingId,
          bookingNumber: bookingData.bookingNumber,
          url: `/groomer/booking/${bookingData.bookingId}`,
        },
      }

      return await NotificationService.sendToDevice(groomerToken, notification)
    } catch (error) {
      console.error('Error sending assignment notification to groomer:', error)
      return false
    }
  }

  /**
   * Notify customer when service starts
   */
  static async notifyServiceStarted(
    customerId: string,
    bookingData: BookingNotificationData
  ): Promise<boolean> {
    try {
      const customerToken = await FCMTokenService.getUserToken(customerId)
      if (!customerToken) {
        console.log('No FCM token found for customer:', customerId)
        return false
      }

      const petNamesText = bookingData.petNames.join(', ')

      const notification = {
        title: '미용 서비스가 시작되었습니다',
        body: `${bookingData.groomerName}님이 ${petNamesText}의 미용을 시작했습니다`,
        data: {
          type: 'service_started',
          bookingId: bookingData.bookingId,
          bookingNumber: bookingData.bookingNumber,
          url: `/customer/booking/${bookingData.bookingId}`,
        },
      }

      return await NotificationService.sendToDevice(customerToken, notification)
    } catch (error) {
      console.error('Error sending service started notification:', error)
      return false
    }
  }

  /**
   * Notify customer when service is completed
   */
  static async notifyServiceCompleted(
    customerId: string,
    bookingData: BookingNotificationData
  ): Promise<boolean> {
    try {
      const customerToken = await FCMTokenService.getUserToken(customerId)
      if (!customerToken) {
        console.log('No FCM token found for customer:', customerId)
        return false
      }

      const petNamesText = bookingData.petNames.join(', ')

      const notification = {
        title: '미용 서비스가 완료되었습니다!',
        body: `${petNamesText}의 미용이 완료되었습니다. 리뷰를 남겨주세요!`,
        data: {
          type: 'service_completed',
          bookingId: bookingData.bookingId,
          bookingNumber: bookingData.bookingNumber,
        },
      }

      return await NotificationService.sendToDevice(customerToken, notification)
    } catch (error) {
      console.error('Error sending service completed notification:', error)
      return false
    }
  }

  /**
   * Notify about payment status changes
   */
  static async notifyPaymentStatus(
    customerId: string,
    bookingData: BookingNotificationData,
    paymentStatus: 'success' | 'failed' | 'additional_required'
  ): Promise<boolean> {
    try {
      const customerToken = await FCMTokenService.getUserToken(customerId)
      if (!customerToken) {
        console.log('No FCM token found for customer:', customerId)
        return false
      }

      let title: string
      let body: string
      let notificationType: string

      switch (paymentStatus) {
        case 'success':
          title = '결제가 완료되었습니다'
          body = `예약금 결제가 성공적으로 완료되었습니다 (${bookingData.totalPrice.toLocaleString('ko-KR')}원)`
          notificationType = 'payment_success'
          break
        case 'failed':
          title = '결제에 실패했습니다'
          body = '결제 처리 중 문제가 발생했습니다. 다시 시도해주세요.'
          notificationType = 'payment_failed'
          break
        case 'additional_required':
          title = '추가 결제가 필요합니다'
          body = '서비스 완료 후 추가 요금이 발생했습니다. 결제를 진행해주세요.'
          notificationType = 'additional_payment_required'
          break
        default:
          return false
      }

      const notification = {
        title,
        body,
        data: {
          type: notificationType,
          bookingId: bookingData.bookingId,
          bookingNumber: bookingData.bookingNumber,
          url: `/customer/booking/${bookingData.bookingId}/payment`,
        },
      }

      return await NotificationService.sendToDevice(customerToken, notification)
    } catch (error) {
      console.error('Error sending payment status notification:', error)
      return false
    }
  }

  /**
   * Send reminder notification before service
   */
  static async sendServiceReminder(
    customerId: string,
    bookingData: BookingNotificationData,
    hoursBeforeService: number = 2
  ): Promise<boolean> {
    try {
      const customerToken = await FCMTokenService.getUserToken(customerId)
      if (!customerToken) {
        console.log('No FCM token found for customer:', customerId)
        return false
      }

      const petNamesText = bookingData.petNames.join(', ')
      const dateText = format(bookingData.serviceDate, 'M월 d일 (E)', {
        locale: ko,
      })

      const notification = {
        title: `${hoursBeforeService}시간 후 미용 서비스 예정`,
        body: `${petNamesText}의 미용 서비스가 곧 시작됩니다 (${dateText} ${bookingData.serviceTime})`,
        data: {
          type: 'service_reminder',
          bookingId: bookingData.bookingId,
          bookingNumber: bookingData.bookingNumber,
          url: `/customer/booking/${bookingData.bookingId}`,
        },
      }

      return await NotificationService.sendToDevice(customerToken, notification)
    } catch (error) {
      console.error('Error sending service reminder:', error)
      return false
    }
  }

  /**
   * Send "today is your service day" notification
   */
  static async sendTodayReminder(
    customerId: string,
    bookingData: BookingNotificationData
  ): Promise<boolean> {
    try {
      const customerToken = await FCMTokenService.getUserToken(customerId)
      if (!customerToken) {
        console.log('No FCM token found for customer:', customerId)
        return false
      }

      const petNamesText = bookingData.petNames.join(', ')
      const dateText = format(bookingData.serviceDate, 'M월 d일 (E)', {
        locale: ko,
      })

      const notification = {
        title: '오늘 미용 서비스가 예정되어 있습니다',
        body: `${petNamesText}의 미용 서비스가 오늘 ${bookingData.serviceTime}에 진행됩니다. 준비해주세요!`,
        data: {
          type: 'today_reminder',
          bookingId: bookingData.bookingId,
          bookingNumber: bookingData.bookingNumber,
          url: `/customer/booking/${bookingData.bookingId}`,
        },
      }

      return await NotificationService.sendToDevice(customerToken, notification)
    } catch (error) {
      console.error('Error sending today reminder:', error)
      return false
    }
  }

  /**
   * Notify assigned groomer about unconfirmed booking after first payment completion
   */
  static async notifyGroomerFirstPaymentCompleted(
    groomerId: string,
    bookingData: BookingNotificationData
  ): Promise<boolean> {
    try {
      const groomerToken = await FCMTokenService.getUserToken(groomerId)
      if (!groomerToken) {
        console.log('No Expo token found for groomer:', groomerId)
        return false
      }

      const petNamesText = bookingData.petNames.join(', ')
      const dateText = format(bookingData.serviceDate, 'M월 d일 (E)', {
        locale: ko,
      })

      const notification = {
        title: '새로운 예약 확인이 필요합니다',
        body: `${bookingData.customerName}님의 ${petNamesText} 미용 예약을 확인해주세요 (${dateText} ${bookingData.serviceTime})`,
        data: {
          type: 'groomer_confirmation_needed',
          bookingId: bookingData.bookingId,
          bookingNumber: bookingData.bookingNumber,
          url: `/groomer/booking/${bookingData.bookingId}`,
        },
      }

      return await NotificationService.sendToDevice(groomerToken, notification)
    } catch (error) {
      console.error('Error sending groomer first payment completed notification:', error)
      return false
    }
  }

  /**
   * Notify all available groomers about unconfirmed booking when no groomer is assigned
   */
  static async notifyAllGroomersFirstPaymentCompleted(
    bookingData: BookingNotificationData
  ): Promise<{ successCount: number; failureCount: number }> {
    try {
      const groomerTokens = await FCMTokenService.getTokensByRole('GROOMER')
      if (groomerTokens.length === 0) {
        console.log('No groomer Expo tokens found')
        return { successCount: 0, failureCount: 0 }
      }

      const petNamesText = bookingData.petNames.join(', ')
      const dateText = format(bookingData.serviceDate, 'M월 d일 (E)', {
        locale: ko,
      })

      const notification = {
        title: '새로운 예약 확인이 필요합니다',
        body: `${bookingData.customerName}님의 ${petNamesText} 미용 예약을 확인해주세요 (${dateText} ${bookingData.serviceTime})`,
        data: {
          type: 'groomer_confirmation_needed',
          bookingId: bookingData.bookingId,
          bookingNumber: bookingData.bookingNumber,
          url: `/groomer/bookings/${bookingData.bookingId}`,
        },
      }

      return await NotificationService.sendToMultipleDevices(groomerTokens, notification)
    } catch (error) {
      console.error('Error sending groomer first payment completed notifications:', error)
      return { successCount: 0, failureCount: 0 }
    }
  }

  /**
   * Notify customer when groomer sends a quote for additional services
   */
  static async notifyCustomerQuoteRequested(
    customerId: string,
    bookingData: BookingNotificationData & {
      totalAdditionalAmount: number
    }
  ): Promise<boolean> {
    try {
      const customerToken = await FCMTokenService.getUserToken(customerId)
      if (!customerToken) {
        console.log('No FCM token found for customer:', customerId)
        return false
      }

      const notification = {
        title: '추가 서비스 견적이 도착했습니다',
        body: `${bookingData.groomerName}님이 추가 서비스 견적을 보냈습니다 (${bookingData.totalAdditionalAmount.toLocaleString('ko-KR')}원)`,
        data: {
          type: 'quote_requested',
          bookingId: bookingData.bookingId,
          bookingNumber: bookingData.bookingNumber,
        },
      }

      return await NotificationService.sendToDevice(customerToken, notification)
    } catch (error) {
      console.error('Error sending quote requested notification:', error)
      return false
    }
  }

  /**
   * Notify groomer when additional payment is completed
   */
  static async notifyGroomerAdditionalPaymentCompleted(
    groomerId: string,
    bookingData: BookingNotificationData & {
      totalAdditionalAmount: number
    }
  ): Promise<boolean> {
    try {
      const groomerToken = await FCMTokenService.getUserToken(groomerId)
      if (!groomerToken) {
        console.log('No FCM token found for groomer:', groomerId)
        return false
      }

      const petNamesText = bookingData.petNames.join(', ')
      const dateText = format(bookingData.serviceDate, 'M월 d일 (E)', {
        locale: ko,
      })

      const notification = {
        title: '추가 결제가 완료되었습니다',
        body: `${bookingData.customerName}님의 추가 결제가 완료되었습니다. ${petNamesText} 미용을 계속 진행해주세요 (${dateText} ${bookingData.serviceTime})`,
        data: {
          type: 'additional_payment_completed',
          bookingId: bookingData.bookingId,
          bookingNumber: bookingData.bookingNumber,
        },
      }

      return await NotificationService.sendToDevice(groomerToken, notification)
    } catch (error) {
      console.error('Error sending additional payment completed notification:', error)
      return false
    }
  }
}
