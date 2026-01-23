import { PrismaClient } from '@mimisalon/shared'
import { env } from './env'
import { FCMTokenService } from './fcm-token-service'

// 알림 스케줄러에서 사용할 예약 타입 정의
type BookingWithRelations = {
  id: string
  serviceDate: Date
  serviceTime: string
  customer: {
    id: string
    name: string | null
    notificationsEnabled: boolean
  } | null
  groomer: {
    id: string
    name: string | null
    notificationsEnabled: boolean
  } | null
  bookingPets: Array<{
    pet: {
      name: string
      breed: {
        name: string
      } | null
    }
    services: Array<{
      service: {
        name: string
      }
    }>
  }>
}

const prisma = new PrismaClient()

export class NotificationScheduler {
  /**
   * 예약 2시간 전 알림 발송
   */
  static async sendReminderNotifications(): Promise<void> {
    try {
      const now = new Date()
      const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000) // 2시간 후

      console.log(
        `Checking for bookings between ${now.toISOString()} and ${twoHoursLater.toISOString()}`
      )

      // 2시간 후에 시작되는 확정된 예약들 조회
      const upcomingBookings = await prisma.booking.findMany({
        where: {
          status: {
            in: ['GROOMER_CONFIRM', 'ADDITIONAL_PAYMENT_COMPLETE'],
          },
          serviceDate: {
            gte: now,
            lte: twoHoursLater,
          },
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              notificationsEnabled: true,
            },
          },
          groomer: {
            select: {
              id: true,
              name: true,
              notificationsEnabled: true,
            },
          },
          bookingPets: {
            include: {
              pet: {
                select: {
                  name: true,
                  breed: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              services: {
                include: {
                  service: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      })

      console.log(`Found ${upcomingBookings.length} upcoming bookings`)

      for (const booking of upcomingBookings) {
        await this.sendBookingReminderNotification(booking)

        // 알림 발송 후 플래그 업데이트 (중복 발송 방지)
        await this.markReminderSent(booking.id)
      }
    } catch (error) {
      console.error('Error sending reminder notifications:', error)
    }
  }

  /**
   * 개별 예약에 대한 리마인더 알림 발송
   */
  private static async sendBookingReminderNotification(
    booking: BookingWithRelations
  ): Promise<void> {
    try {
      const serviceTime = this.formatTime(booking.serviceTime)
      const petNames = booking.bookingPets.map((bp) => bp.pet.name).join(', ')
      const serviceNames = booking.bookingPets
        .flatMap((bp) => bp.services.map((s) => s.service.name))
        .join(', ')

      // 고객에게 알림
      if (booking.customer && booking.customer.notificationsEnabled) {
        await this.sendNotification({
          userId: booking.customer.id,
          title: '예약 2시간 전 알림',
          body: `${petNames}의 미용 예약이 2시간 후 시작됩니다. (${serviceTime}, ${serviceNames})`,
          data: {
            bookingId: booking.id,
            type: 'BOOKING_REMINDER',
            targetAudience: 'CUSTOMER',
          },
        })
      }

      // 미용사에게 알림
      if (booking.groomer && booking.groomer.notificationsEnabled) {
        await this.sendNotification({
          userId: booking.groomer.id,
          title: '예약 2시간 전 알림',
          body: `${booking.customer?.name}님의 ${petNames} 미용이 2시간 후 시작됩니다. (${serviceTime})`,
          data: {
            bookingId: booking.id,
            type: 'BOOKING_REMINDER',
            targetAudience: 'GROOMER',
          },
        })
      }

      console.log(`Reminder sent for booking ${booking.id}`)
    } catch (error) {
      console.error(`Error sending reminder for booking ${booking.id}:`, error)
    }
  }

  /**
   * 알림 발송 처리
   */
  private static async sendNotification(params: {
    userId: string
    title: string
    body: string
    data: Record<string, unknown>
  }): Promise<void> {
    try {
      const response = await fetch(`${env.BETTER_AUTH_URL}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'USER_SPECIFIC',
          targetUserIds: [params.userId],
          title: params.title,
          body: params.body,
          data: params.data,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error(`Failed to send notification to user ${params.userId}:`, error)
      }
    } catch (error) {
      console.error(`Error sending notification to user ${params.userId}:`, error)
    }
  }

  /**
   * 리마인더 발송 완료 표시
   */
  private static async markReminderSent(bookingId: string): Promise<void> {
    try {
      // notes 필드에 리마인더 발송 기록 추가
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { notes: true },
      })

      const reminderMark = `[REMINDER_SENT:${new Date().toISOString()}]`
      const updatedNotes = booking?.notes ? `${booking.notes}\n${reminderMark}` : reminderMark

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          notes: updatedNotes,
          updatedAt: new Date(),
        },
      })
    } catch (error) {
      console.error(`Error marking reminder sent for booking ${bookingId}:`, error)
    }
  }

  /**
   * 시간 포맷팅 유틸리티
   */
  private static formatTime(timeString: string): string {
    // "HH:mm" 형식으로 변환
    if (timeString.includes(':')) {
      return timeString
    }

    // "HHmm" 형식인 경우 변환
    if (timeString.length === 4) {
      return `${timeString.substring(0, 2)}:${timeString.substring(2)}`
    }

    return timeString
  }

  /**
   * 당일 예약 알림 발송
   */
  static async sendTodayBookingNotifications(): Promise<void> {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const todayBookings = await prisma.booking.findMany({
        where: {
          status: {
            in: ['GROOMER_CONFIRM', 'ADDITIONAL_PAYMENT_COMPLETE'],
          },
          serviceDate: {
            gte: today,
            lt: tomorrow,
          },
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              notificationsEnabled: true,
            },
          },
          groomer: {
            select: {
              id: true,
              name: true,
              notificationsEnabled: true,
            },
          },
          bookingPets: {
            include: {
              pet: {
                select: {
                  name: true,
                  breed: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      })

      for (const booking of todayBookings) {
        const petNames = (booking.bookingPets as Array<{ pet: { name: string } }>)
          .map((bp) => bp.pet.name)
          .join(', ')
        const serviceTime = this.formatTime(booking.serviceTime as string)

        // 고객에게 당일 알림
        if (booking.customer && booking.customer.notificationsEnabled) {
          await this.sendNotification({
            userId: booking.customer.id as string,
            title: '오늘 예약 알림',
            body: `오늘 ${serviceTime}에 ${petNames}의 미용 예약이 있습니다.`,
            data: {
              bookingId: booking.id as string,
              type: 'TODAY_BOOKING',
              targetAudience: 'CUSTOMER',
            },
          })
        }

        // 미용사에게 당일 알림
        if (booking.groomer && booking.groomer.notificationsEnabled) {
          await this.sendNotification({
            userId: booking.groomer.id as string,
            title: '오늘 예약 알림',
            body: `오늘 ${serviceTime}에 ${booking.customer?.name}님의 ${petNames} 미용 예약이 있습니다.`,
            data: {
              bookingId: booking.id as string,
              type: 'TODAY_BOOKING',
              targetAudience: 'GROOMER',
            },
          })
        }
      }

      console.log(`Today booking notifications sent for ${todayBookings.length} bookings`)
    } catch (error) {
      console.error('Error sending today booking notifications:', error)
    }
  }

  /**
   * 만료된 예약 정리
   */
  static async cleanupExpiredBookings(): Promise<void> {
    try {
      const oneDayAgo = new Date()
      oneDayAgo.setDate(oneDayAgo.getDate() - 1)

      // 하루 전에 종료되었지만 완료되지 않은 예약들을 자동으로 취소 처리
      const expiredBookings = await prisma.booking.updateMany({
        where: {
          serviceDate: {
            lt: oneDayAgo,
          },
          status: {
            notIn: ['SERVICE_COMPLETED', 'SERVICE_CANCELLED'],
          },
        },
        data: {
          status: 'SERVICE_CANCELLED',
          cancelledAt: new Date(),
          cancellationReason: '예약 시간 만료로 인한 자동 취소',
          updatedAt: new Date(),
        },
      })

      console.log(`Cleaned up ${expiredBookings.count} expired bookings`)
    } catch (error) {
      console.error('Error cleaning up expired bookings:', error)
    }
  }
}
