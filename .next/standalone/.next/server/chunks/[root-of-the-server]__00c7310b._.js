module.exports = [
  254799,
  (e, t, o) => {
    t.exports = e.x('crypto', () => require('crypto'))
  },
  609730,
  438220,
  874321,
  (e) => {
    'use strict'
    let t = Symbol.for('constructDateFrom')
    function o(e, o) {
      return 'function' == typeof e
        ? e(o)
        : e && 'object' == typeof e && t in e
          ? e[t](o)
          : e instanceof Date
            ? new e.constructor(o)
            : new Date(o)
    }
    function r(e, t) {
      return o(t || e, e)
    }
    ;(e.s(
      [
        'constructFromSymbol',
        0,
        t,
        'millisecondsInDay',
        0,
        864e5,
        'millisecondsInHour',
        0,
        36e5,
        'millisecondsInMinute',
        0,
        6e4,
        'millisecondsInWeek',
        0,
        6048e5,
      ],
      438220
    ),
      e.s(['constructFrom', () => o], 874321),
      e.s(['toDate', () => r], 609730))
  },
  250354,
  662001,
  (e) => {
    'use strict'
    let t = {}
    function o() {
      return t
    }
    e.s(['getDefaultOptions', () => o], 662001)
    var r = e.i(609730)
    function n(e, o) {
      let n =
          o?.weekStartsOn ??
          o?.locale?.options?.weekStartsOn ??
          t.weekStartsOn ??
          t.locale?.options?.weekStartsOn ??
          0,
        i = (0, r.toDate)(e, o?.in),
        s = i.getDay()
      return (i.setDate(i.getDate() - (7 * (s < n) + s - n)), i.setHours(0, 0, 0, 0), i)
    }
    e.s(['startOfWeek', () => n], 250354)
  },
  688947,
  (e, t, o) => {
    t.exports = e.x('stream', () => require('stream'))
  },
  921517,
  (e, t, o) => {
    t.exports = e.x('http', () => require('http'))
  },
  524836,
  (e, t, o) => {
    t.exports = e.x('https', () => require('https'))
  },
  406461,
  (e, t, o) => {
    t.exports = e.x('zlib', () => require('zlib'))
  },
  792509,
  (e, t, o) => {
    t.exports = e.x('url', () => require('url'))
  },
  992097,
  (e, t, o) => {
    t.exports = e.x('punycode', () => require('punycode'))
  },
  389579,
  (e) => {
    'use strict'
    var t = e.i(657446),
      o = e.i(647373)
    let r = new t.PrismaClient()
    class n {
      static isValidExpoPushToken(e) {
        return o.ExpoNotificationService.isValidExpoPushToken(e)
      }
      static async updateUserToken(e, t, n = 'android', i) {
        try {
          if (!o.ExpoNotificationService.isValidExpoPushToken(t))
            return { success: !1, error: 'Invalid ExponentPushToken format' }
          let s = await r.deviceToken.upsert({
            where: { token: t },
            create: {
              userId: e,
              token: t,
              platform: n,
              deviceId: i,
              isActive: !0,
              lastUsed: new Date(),
            },
            update: { isActive: !0, lastUsed: new Date(), platform: n, deviceId: i },
            select: { id: !0, token: !0, platform: !0, lastUsed: !0 },
          })
          return (
            console.log(`✅ ExponentPushToken saved to DeviceToken table:`),
            console.log(`   User ID: ${e}`),
            console.log(`   Token: ${s.token}`),
            console.log(`   Platform: ${s.platform}`),
            console.log(`   Last Used: ${s.lastUsed}`),
            { success: !0 }
          )
        } catch (e) {
          return (
            console.error('Error updating ExponentPushToken:', e),
            { success: !1, error: e instanceof Error ? e.message : 'Unknown error' }
          )
        }
      }
      static async getUserTokens(e) {
        try {
          let t = await r.user.findUnique({
            where: { id: e },
            select: { notificationsEnabled: !0 },
          })
          if (!t || !t.notificationsEnabled) return []
          return (
            await r.deviceToken.findMany({
              where: { userId: e, isActive: !0 },
              select: { token: !0 },
            })
          )
            .filter((e) => o.ExpoNotificationService.isValidExpoPushToken(e.token))
            .map((e) => e.token)
        } catch (e) {
          return (console.error('Error getting user ExponentPushTokens:', e), [])
        }
      }
      static async getUserToken(e) {
        return (await this.getUserTokens(e))[0] || null
      }
      static async getMultipleUserTokens(e) {
        try {
          let t = (
            await r.user.findMany({
              where: { id: { in: e }, notificationsEnabled: !0 },
              select: { id: !0 },
            })
          ).map((e) => e.id)
          return (
            await r.deviceToken.findMany({
              where: { userId: { in: t }, isActive: !0 },
              select: { token: !0 },
            })
          )
            .filter((e) => o.ExpoNotificationService.isValidExpoPushToken(e.token))
            .map((e) => e.token)
        } catch (e) {
          return (console.error('Error getting user ExponentPushTokens:', e), [])
        }
      }
      static async removeDeviceToken(e) {
        try {
          return (
            await r.deviceToken.delete({ where: { token: e } }),
            console.log(`ExponentPushToken removed: ${e}`),
            !0
          )
        } catch (e) {
          return (console.error('Error removing ExponentPushToken:', e), !1)
        }
      }
      static async removeUserToken(e) {
        try {
          return (
            await r.deviceToken.deleteMany({ where: { userId: e } }),
            console.log(`All ExponentPushTokens removed for user: ${e}`),
            !0
          )
        } catch (e) {
          return (console.error('Error removing ExponentPushTokens:', e), !1)
        }
      }
      static async deactivateUserTokens(e) {
        try {
          return (
            await r.deviceToken.updateMany({ where: { userId: e }, data: { isActive: !1 } }),
            console.log(`ExponentPushTokens deactivated for user: ${e}`),
            !0
          )
        } catch (e) {
          return (console.error('Error deactivating ExponentPushTokens:', e), !1)
        }
      }
      static async getTokensByRole(e) {
        try {
          let t = (
            await r.user.findMany({
              where: { role: e, notificationsEnabled: !0 },
              select: { id: !0 },
            })
          ).map((e) => e.id)
          return (
            await r.deviceToken.findMany({
              where: { userId: { in: t }, isActive: !0 },
              select: { token: !0 },
            })
          )
            .filter((e) => o.ExpoNotificationService.isValidExpoPushToken(e.token))
            .map((e) => e.token)
        } catch (e) {
          return (console.error('Error getting ExponentPushTokens by role:', e), [])
        }
      }
      static async updateNotificationPreference(e, t) {
        try {
          return (
            await r.user.update({ where: { id: e }, data: { notificationsEnabled: t } }),
            console.log(`Notification preference updated for user: ${e} to ${t}`),
            !0
          )
        } catch (e) {
          return (console.error('Error updating notification preference:', e), !1)
        }
      }
      static async getAllGroomerTokens() {
        return this.getTokensByRole('GROOMER')
      }
    }
    e.s(['FCMTokenService', () => n])
  },
  102434,
  (e) => {
    'use strict'
    var t = e.i(647373)
    class o {
      static async sendToDevice(e, o) {
        try {
          let r = {
              title: o.title,
              body: o.body,
              data: o.data,
              sound: o.sound,
              badge: o.badge,
              channelId: o.channelId,
            },
            n = await t.ExpoNotificationService.sendToDevice(e, r)
          if (!n.success) return (console.error('Error sending notification:', n.error), !1)
          {
            let e = n.ticket && 'id' in n.ticket ? n.ticket.id : 'unknown'
            return (console.log('Successfully sent notification:', e), !0)
          }
        } catch (e) {
          return (console.error('Error sending notification:', e), !1)
        }
      }
      static async sendToMultipleDevices(e, o) {
        try {
          let r = {
              title: o.title,
              body: o.body,
              data: o.data,
              sound: o.sound,
              badge: o.badge,
              channelId: o.channelId,
            },
            n = await t.ExpoNotificationService.sendToMultipleDevices(e, r)
          return (
            console.log('Successfully sent notifications:', {
              successCount: n.successCount,
              failureCount: n.failureCount,
            }),
            { successCount: n.successCount, failureCount: n.failureCount }
          )
        } catch (t) {
          return (
            console.error('Error sending multicast notification:', t),
            { successCount: 0, failureCount: e.length }
          )
        }
      }
      static async sendToTopic(e, t) {
        return (
          console.warn('Topic notifications are not supported by Expo Push Notifications'),
          !1
        )
      }
      static async subscribeToTopic(e, t) {
        return (
          console.warn('Topic subscriptions are not supported by Expo Push Notifications'),
          !1
        )
      }
      static async unsubscribeFromTopic(e, t) {
        return (
          console.warn('Topic unsubscriptions are not supported by Expo Push Notifications'),
          !1
        )
      }
      static isValidExpoPushToken(e) {
        return t.ExpoNotificationService.isValidExpoPushToken(e)
      }
    }
    e.s(['NotificationService', () => o])
  },
  191486,
  (e) => {
    'use strict'
    var t = e.i(102434),
      o = e.i(389579),
      r = e.i(343747),
      n = e.i(686880)
    class i {
      static async notifyNewBooking(e, i) {
        try {
          let s = await o.FCMTokenService.getUserToken(e)
          if (!s) return (console.log('No FCM token found for customer:', e), !1)
          let a = i.petNames.join(', '),
            c = (0, r.format)(i.serviceDate, 'M월 d일 (E)', { locale: n.ko }),
            u = {
              title: '예약이 성공적으로 완료되었습니다!',
              body: `${a}의 미용 예약 (${c} ${i.serviceTime})`,
              data: {
                type: 'booking_created',
                bookingId: i.bookingId,
                bookingNumber: i.bookingNumber,
                url: `/customer/booking/${i.bookingId}`,
              },
            }
          return await t.NotificationService.sendToDevice(s, u)
        } catch (e) {
          return (console.error('Error sending new booking notification:', e), !1)
        }
      }
      static async notifyGroomersNewBooking(e) {
        try {
          let i = await o.FCMTokenService.getTokensByRole('GROOMER')
          if (0 === i.length)
            return (
              console.log('No groomer FCM tokens found'),
              { successCount: 0, failureCount: 0 }
            )
          let s = e.petNames.join(', '),
            a = (0, r.format)(e.serviceDate, 'M월 d일 (E)', { locale: n.ko }),
            c = {
              title: '새로운 예약이 등록되었습니다',
              body: `${e.customerName}님의 ${s} 미용 예약 (${a} ${e.serviceTime})`,
              data: {
                type: 'new_booking_available',
                bookingId: e.bookingId,
                bookingNumber: e.bookingNumber,
                url: `/groomer/bookings/${e.bookingId}`,
              },
            }
          return await t.NotificationService.sendToMultipleDevices(i, c)
        } catch (e) {
          return (
            console.error('Error sending groomer notification:', e),
            { successCount: 0, failureCount: 0 }
          )
        }
      }
      static async notifyGroomerAssigned(e, i) {
        try {
          let s = await o.FCMTokenService.getUserToken(e)
          if (!s) return (console.log('No FCM token found for customer:', e), !1)
          let a = i.petNames.join(', '),
            c = (0, r.format)(i.serviceDate, 'M월 d일 (E)', { locale: n.ko }),
            u = {
              title: '미용사가 배정되었습니다!',
              body: `${i.groomerName}님이 ${a}의 미용을 담당하게 되었습니다 (${c} ${i.serviceTime})`,
              data: {
                type: 'groomer_assigned',
                bookingId: i.bookingId,
                bookingNumber: i.bookingNumber,
                url: `/customer/booking/${i.bookingId}`,
              },
            }
          return await t.NotificationService.sendToDevice(s, u)
        } catch (e) {
          return (console.error('Error sending groomer assigned notification:', e), !1)
        }
      }
      static async notifyGroomerOfAssignment(e, i) {
        try {
          let s = await o.FCMTokenService.getUserToken(e)
          if (!s) return (console.log('No FCM token found for groomer:', e), !1)
          let a = i.petNames.join(', '),
            c = (0, r.format)(i.serviceDate, 'M월 d일 (E)', { locale: n.ko }),
            u = {
              title: '새로운 예약이 배정되었습니다',
              body: `${i.customerName}님의 ${a} 미용 예약이 배정되었습니다 (${c} ${i.serviceTime})`,
              data: {
                type: 'booking_assigned',
                bookingId: i.bookingId,
                bookingNumber: i.bookingNumber,
                url: `/groomer/booking/${i.bookingId}`,
              },
            }
          return await t.NotificationService.sendToDevice(s, u)
        } catch (e) {
          return (console.error('Error sending assignment notification to groomer:', e), !1)
        }
      }
      static async notifyServiceStarted(e, r) {
        try {
          let n = await o.FCMTokenService.getUserToken(e)
          if (!n) return (console.log('No FCM token found for customer:', e), !1)
          let i = r.petNames.join(', '),
            s = {
              title: '미용 서비스가 시작되었습니다',
              body: `${r.groomerName}님이 ${i}의 미용을 시작했습니다`,
              data: {
                type: 'service_started',
                bookingId: r.bookingId,
                bookingNumber: r.bookingNumber,
                url: `/customer/booking/${r.bookingId}`,
              },
            }
          return await t.NotificationService.sendToDevice(n, s)
        } catch (e) {
          return (console.error('Error sending service started notification:', e), !1)
        }
      }
      static async notifyServiceCompleted(e, r) {
        try {
          let n = await o.FCMTokenService.getUserToken(e)
          if (!n) return (console.log('No FCM token found for customer:', e), !1)
          let i = r.petNames.join(', '),
            s = {
              title: '미용 서비스가 완료되었습니다!',
              body: `${i}의 미용이 완료되었습니다. 리뷰를 남겨주세요!`,
              data: {
                type: 'service_completed',
                bookingId: r.bookingId,
                bookingNumber: r.bookingNumber,
              },
            }
          return await t.NotificationService.sendToDevice(n, s)
        } catch (e) {
          return (console.error('Error sending service completed notification:', e), !1)
        }
      }
      static async notifyPaymentStatus(e, r, n) {
        try {
          let i,
            s,
            a,
            c = await o.FCMTokenService.getUserToken(e)
          if (!c) return (console.log('No FCM token found for customer:', e), !1)
          switch (n) {
            case 'success':
              ;((i = '결제가 완료되었습니다'),
                (s = `예약금 결제가 성공적으로 완료되었습니다 (${r.totalPrice.toLocaleString('ko-KR')}원)`),
                (a = 'payment_success'))
              break
            case 'failed':
              ;((i = '결제에 실패했습니다'),
                (s = '결제 처리 중 문제가 발생했습니다. 다시 시도해주세요.'),
                (a = 'payment_failed'))
              break
            case 'additional_required':
              ;((i = '추가 결제가 필요합니다'),
                (s = '서비스 완료 후 추가 요금이 발생했습니다. 결제를 진행해주세요.'),
                (a = 'additional_payment_required'))
              break
            default:
              return !1
          }
          let u = {
            title: i,
            body: s,
            data: {
              type: a,
              bookingId: r.bookingId,
              bookingNumber: r.bookingNumber,
              url: `/customer/booking/${r.bookingId}/payment`,
            },
          }
          return await t.NotificationService.sendToDevice(c, u)
        } catch (e) {
          return (console.error('Error sending payment status notification:', e), !1)
        }
      }
      static async sendServiceReminder(e, i, s = 2) {
        try {
          let a = await o.FCMTokenService.getUserToken(e)
          if (!a) return (console.log('No FCM token found for customer:', e), !1)
          let c = i.petNames.join(', '),
            u = (0, r.format)(i.serviceDate, 'M월 d일 (E)', { locale: n.ko }),
            l = {
              title: `${s}시간 후 미용 서비스 예정`,
              body: `${c}의 미용 서비스가 곧 시작됩니다 (${u} ${i.serviceTime})`,
              data: {
                type: 'service_reminder',
                bookingId: i.bookingId,
                bookingNumber: i.bookingNumber,
                url: `/customer/booking/${i.bookingId}`,
              },
            }
          return await t.NotificationService.sendToDevice(a, l)
        } catch (e) {
          return (console.error('Error sending service reminder:', e), !1)
        }
      }
      static async sendTodayReminder(e, i) {
        try {
          let s = await o.FCMTokenService.getUserToken(e)
          if (!s) return (console.log('No FCM token found for customer:', e), !1)
          let a = i.petNames.join(', ')
          ;(0, r.format)(i.serviceDate, 'M월 d일 (E)', { locale: n.ko })
          let c = {
            title: '오늘 미용 서비스가 예정되어 있습니다',
            body: `${a}의 미용 서비스가 오늘 ${i.serviceTime}에 진행됩니다. 준비해주세요!`,
            data: {
              type: 'today_reminder',
              bookingId: i.bookingId,
              bookingNumber: i.bookingNumber,
              url: `/customer/booking/${i.bookingId}`,
            },
          }
          return await t.NotificationService.sendToDevice(s, c)
        } catch (e) {
          return (console.error('Error sending today reminder:', e), !1)
        }
      }
      static async notifyGroomerFirstPaymentCompleted(e, i) {
        try {
          let s = await o.FCMTokenService.getUserToken(e)
          if (!s) return (console.log('No Expo token found for groomer:', e), !1)
          let a = i.petNames.join(', '),
            c = (0, r.format)(i.serviceDate, 'M월 d일 (E)', { locale: n.ko }),
            u = {
              title: '새로운 예약 확인이 필요합니다',
              body: `${i.customerName}님의 ${a} 미용 예약을 확인해주세요 (${c} ${i.serviceTime})`,
              data: {
                type: 'groomer_confirmation_needed',
                bookingId: i.bookingId,
                bookingNumber: i.bookingNumber,
                url: `/groomer/booking/${i.bookingId}`,
              },
            }
          return await t.NotificationService.sendToDevice(s, u)
        } catch (e) {
          return (
            console.error('Error sending groomer first payment completed notification:', e),
            !1
          )
        }
      }
      static async notifyAllGroomersFirstPaymentCompleted(e) {
        try {
          let i = await o.FCMTokenService.getTokensByRole('GROOMER')
          if (0 === i.length)
            return (
              console.log('No groomer Expo tokens found'),
              { successCount: 0, failureCount: 0 }
            )
          let s = e.petNames.join(', '),
            a = (0, r.format)(e.serviceDate, 'M월 d일 (E)', { locale: n.ko }),
            c = {
              title: '새로운 예약 확인이 필요합니다',
              body: `${e.customerName}님의 ${s} 미용 예약을 확인해주세요 (${a} ${e.serviceTime})`,
              data: {
                type: 'groomer_confirmation_needed',
                bookingId: e.bookingId,
                bookingNumber: e.bookingNumber,
                url: `/groomer/bookings/${e.bookingId}`,
              },
            }
          return await t.NotificationService.sendToMultipleDevices(i, c)
        } catch (e) {
          return (
            console.error('Error sending groomer first payment completed notifications:', e),
            { successCount: 0, failureCount: 0 }
          )
        }
      }
      static async notifyCustomerQuoteRequested(e, r) {
        try {
          let n = await o.FCMTokenService.getUserToken(e)
          if (!n) return (console.log('No FCM token found for customer:', e), !1)
          let i = {
            title: '추가 서비스 견적이 도착했습니다',
            body: `${r.groomerName}님이 추가 서비스 견적을 보냈습니다 (${r.totalAdditionalAmount.toLocaleString('ko-KR')}원)`,
            data: {
              type: 'quote_requested',
              bookingId: r.bookingId,
              bookingNumber: r.bookingNumber,
            },
          }
          return await t.NotificationService.sendToDevice(n, i)
        } catch (e) {
          return (console.error('Error sending quote requested notification:', e), !1)
        }
      }
      static async notifyGroomerAdditionalPaymentCompleted(e, i) {
        try {
          let s = await o.FCMTokenService.getUserToken(e)
          if (!s) return (console.log('No FCM token found for groomer:', e), !1)
          let a = i.petNames.join(', '),
            c = (0, r.format)(i.serviceDate, 'M월 d일 (E)', { locale: n.ko }),
            u = {
              title: '추가 결제가 완료되었습니다',
              body: `${i.customerName}님의 추가 결제가 완료되었습니다. ${a} 미용을 계속 진행해주세요 (${c} ${i.serviceTime})`,
              data: {
                type: 'additional_payment_completed',
                bookingId: i.bookingId,
                bookingNumber: i.bookingNumber,
              },
            }
          return await t.NotificationService.sendToDevice(s, u)
        } catch (e) {
          return (console.error('Error sending additional payment completed notification:', e), !1)
        }
      }
    }
    e.s(['BookingNotificationService', () => i])
  },
  155655,
  (e) => {
    'use strict'
    var t = e.i(747909),
      o = e.i(174017),
      r = e.i(996250),
      n = e.i(759756),
      i = e.i(561916),
      s = e.i(114444),
      a = e.i(837092),
      c = e.i(869741),
      u = e.i(316795),
      l = e.i(487718),
      d = e.i(995169),
      m = e.i(47587),
      p = e.i(666012),
      g = e.i(570101),
      k = e.i(626937),
      f = e.i(10372),
      b = e.i(193695)
    e.i(52474)
    var v = e.i(600220),
      h = e.i(89171),
      y = e.i(493458),
      T = e.i(79832),
      N = e.i(657446),
      E = e.i(469719),
      w = e.i(191486)
    let R = E.z.object({
      additionalServices: E.z.array(
        E.z.object({
          name: E.z.string().min(1, '서비스 이름을 입력해주세요'),
          description: E.z.string().optional(),
          price: E.z.number().positive('가격은 0보다 커야 합니다'),
          quantity: E.z.number().positive('수량은 1 이상이어야 합니다').default(1),
        })
      ),
      totalAdditionalAmount: E.z.number().positive('총 추가 금액은 0보다 커야 합니다'),
      reason: E.z.string().optional(),
      estimatedTime: E.z.number().optional(),
    })
    async function C(e, { params: t }) {
      try {
        let o = await T.default.api.getSession({ headers: await (0, y.headers)() })
        if (!o?.user || 'GROOMER' !== o.user.role)
          return h.NextResponse.json({ error: '미용사 권한이 필요합니다' }, { status: 403 })
        let { id: r } = await t,
          n = await e.json(),
          i = R.parse(n),
          s = await N.prisma.booking.findUnique({
            where: { id: r },
            include: {
              customer: !0,
              groomer: !0,
              bookingPets: {
                include: {
                  pet: { include: { breed: !0 } },
                  services: { include: { service: !0 } },
                },
              },
            },
          })
        if (!s) return h.NextResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 })
        if (s.groomerId !== o.user.id)
          return h.NextResponse.json({ error: '해당 예약에 대한 권한이 없습니다' }, { status: 403 })
        if (!['GROOMER_CONFIRM', 'WORK_IN_PROGRESS'].includes(s.status))
          return h.NextResponse.json(
            { error: '현재 상태에서는 견적을 요청할 수 없습니다' },
            { status: 400 }
          )
        let a = await N.prisma.booking.update({
            where: { id: r },
            data: {
              status: 'ADDITIONAL_PAYMENT_PENDING',
              additionalCharges: i.totalAdditionalAmount,
              notes: i.reason || s.notes,
              updatedAt: new Date(),
            },
          }),
          c = JSON.stringify({
            services: i.additionalServices,
            totalAmount: i.totalAdditionalAmount,
            estimatedTime: i.estimatedTime,
            requestedAt: new Date(),
            requestedBy: o.user.id,
          })
        return (
          await N.prisma.booking.update({ where: { id: r }, data: { specialRequests: c } }),
          await w.BookingNotificationService.notifyCustomerQuoteRequested(s.customerId, {
            bookingId: s.id,
            bookingNumber: s.bookingNumber || s.id,
            customerName: s.customer.name || '',
            groomerName: s.groomer?.name || '미용사',
            serviceDate: s.serviceDate,
            serviceTime: s.serviceTime,
            petNames: s.bookingPets.map((e) => e.pet.name),
            totalPrice: s.totalPrice || 0,
            totalAdditionalAmount: i.totalAdditionalAmount,
          }),
          h.NextResponse.json({
            message: '견적이 성공적으로 요청되었습니다',
            booking: { id: a.id, status: a.status, additionalCharges: a.additionalCharges },
            quote: {
              additionalServices: i.additionalServices,
              totalAdditionalAmount: i.totalAdditionalAmount,
              estimatedTime: i.estimatedTime,
            },
          })
        )
      } catch (e) {
        if ((console.error('Quote request error:', e), e instanceof E.z.ZodError))
          return h.NextResponse.json(
            { error: '잘못된 견적 요청 데이터입니다', details: e.issues },
            { status: 400 }
          )
        return h.NextResponse.json({ error: '견적 요청 중 오류가 발생했습니다' }, { status: 500 })
      }
    }
    async function x(e, { params: t }) {
      try {
        let e = await T.default.api.getSession({ headers: await (0, y.headers)() })
        if (!e?.user) return h.NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
        let { id: o } = await t,
          r = await N.prisma.booking.findUnique({
            where: { id: o },
            include: {
              customer: !0,
              groomer: !0,
              bookingPets: {
                include: {
                  pet: { include: { breed: !0 } },
                  services: { include: { service: !0 } },
                },
              },
            },
          })
        if (!r) return h.NextResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 })
        if (
          ('CUSTOMER' === e.user.role && r.customerId !== e.user.id) ||
          ('GROOMER' === e.user.role && r.groomerId !== e.user.id)
        )
          return h.NextResponse.json({ error: '해당 예약에 대한 권한이 없습니다' }, { status: 403 })
        let n = []
        if (r.specialRequests)
          try {
            n = JSON.parse(r.specialRequests).services || []
          } catch (e) {
            console.error('Failed to parse additional services:', e)
          }
        return h.NextResponse.json({
          booking: {
            id: r.id,
            status: r.status,
            basePrice: r.basePrice,
            additionalCharges: r.additionalCharges,
            totalPrice: r.totalPrice,
            serviceDate: r.serviceDate,
            serviceTime: r.serviceTime,
            customer: { name: r.customer.name, phone: r.customer.phoneNumber },
            groomer: { name: r.groomer?.name },
            pets: r.bookingPets.map((e) => ({
              name: e.pet.name,
              breed: e.pet.breed?.name || '알 수 없음',
              services: e.services.map((e) => ({ name: e.service.name, price: e.servicePrice })),
            })),
          },
          additionalServices: n,
          totalAdditionalAmount: r.additionalCharges,
        })
      } catch (e) {
        return (
          console.error('Quote fetch error:', e),
          h.NextResponse.json({ error: '견적 정보 조회 중 오류가 발생했습니다' }, { status: 500 })
        )
      }
    }
    e.s(['GET', () => x, 'POST', () => C, 'quoteRequestSchema', 0, R], 698770)
    var _ = e.i(698770)
    let S = new t.AppRouteRouteModule({
        definition: {
          kind: o.RouteKind.APP_ROUTE,
          page: '/api/groomer/bookings/[id]/quote/route',
          pathname: '/api/groomer/bookings/[id]/quote',
          filename: 'route',
          bundlePath: '',
        },
        distDir: '.next',
        relativeProjectDir: '',
        resolvedPagePath: '[project]/src/app/api/groomer/bookings/[id]/quote/route.ts',
        nextConfigOutput: 'standalone',
        userland: _,
      }),
      { workAsyncStorage: P, workUnitAsyncStorage: I, serverHooks: M } = S
    function $() {
      return (0, r.patchFetch)({ workAsyncStorage: P, workUnitAsyncStorage: I })
    }
    async function A(e, t, r) {
      S.isDev && (0, n.addRequestMeta)(e, 'devRequestTimingInternalsEnd', process.hrtime.bigint())
      let h = '/api/groomer/bookings/[id]/quote/route'
      h = h.replace(/\/index$/, '') || '/'
      let y = await S.prepare(e, t, { srcPage: h, multiZoneDraftMode: !1 })
      if (!y)
        return (
          (t.statusCode = 400),
          t.end('Bad Request'),
          null == r.waitUntil || r.waitUntil.call(r, Promise.resolve()),
          null
        )
      let {
          buildId: T,
          params: N,
          nextConfig: E,
          parsedUrl: w,
          isDraftMode: R,
          prerenderManifest: C,
          routerServerContext: x,
          isOnDemandRevalidate: _,
          revalidateOnlyGenerated: P,
          resolvedPathname: I,
          clientReferenceManifest: M,
          serverActionsManifest: $,
        } = y,
        A = (0, c.normalizeAppPath)(h),
        D = !!(C.dynamicRoutes[A] || C.routes[I]),
        q = async () => (
          (null == x ? void 0 : x.render404)
            ? await x.render404(e, t, w, !1)
            : t.end('This page could not be found'),
          null
        )
      if (D && !R) {
        let e = !!C.routes[I],
          t = C.dynamicRoutes[A]
        if (t && !1 === t.fallback && !e) {
          if (E.experimental.adapterPath) return await q()
          throw new b.NoFallbackError()
        }
      }
      let O = null
      !D || S.isDev || R || (O = '/index' === (O = I) ? '/' : O)
      let j = !0 === S.isDev || !D,
        U = D && !j
      $ &&
        M &&
        (0, s.setReferenceManifestsSingleton)({
          page: h,
          clientReferenceManifest: M,
          serverActionsManifest: $,
          serverModuleMap: (0, a.createServerModuleMap)({ serverActionsManifest: $ }),
        })
      let F = e.method || 'GET',
        G = (0, i.getTracer)(),
        H = G.getActiveScopeSpan(),
        z = {
          params: N,
          prerenderManifest: C,
          renderOpts: {
            experimental: { authInterrupts: !!E.experimental.authInterrupts },
            cacheComponents: !!E.cacheComponents,
            supportsDynamicResponse: j,
            incrementalCache: (0, n.getRequestMeta)(e, 'incrementalCache'),
            cacheLifeProfiles: E.cacheLife,
            waitUntil: r.waitUntil,
            onClose: (e) => {
              t.on('close', e)
            },
            onAfterTaskError: void 0,
            onInstrumentationRequestError: (t, o, r) => S.onRequestError(e, t, r, x),
          },
          sharedContext: { buildId: T },
        },
        B = new u.NodeNextRequest(e),
        K = new u.NodeNextResponse(t),
        V = l.NextRequestAdapter.fromNodeNextRequest(B, (0, l.signalFromNodeResponse)(t))
      try {
        let s = async (e) =>
            S.handle(V, z).finally(() => {
              if (!e) return
              e.setAttributes({ 'http.status_code': t.statusCode, 'next.rsc': !1 })
              let o = G.getRootSpanAttributes()
              if (!o) return
              if (o.get('next.span_type') !== d.BaseServerSpan.handleRequest)
                return void console.warn(
                  `Unexpected root span type '${o.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`
                )
              let r = o.get('next.route')
              if (r) {
                let t = `${F} ${r}`
                ;(e.setAttributes({ 'next.route': r, 'http.route': r, 'next.span_name': t }),
                  e.updateName(t))
              } else e.updateName(`${F} ${h}`)
            }),
          a = !!(0, n.getRequestMeta)(e, 'minimalMode'),
          c = async (n) => {
            var i, c
            let u = async ({ previousCacheEntry: o }) => {
                try {
                  if (!a && _ && P && !o)
                    return (
                      (t.statusCode = 404),
                      t.setHeader('x-nextjs-cache', 'REVALIDATED'),
                      t.end('This page could not be found'),
                      null
                    )
                  let i = await s(n)
                  e.fetchMetrics = z.renderOpts.fetchMetrics
                  let c = z.renderOpts.pendingWaitUntil
                  c && r.waitUntil && (r.waitUntil(c), (c = void 0))
                  let u = z.renderOpts.collectedTags
                  if (!D)
                    return (await (0, p.sendResponse)(B, K, i, z.renderOpts.pendingWaitUntil), null)
                  {
                    let e = await i.blob(),
                      t = (0, g.toNodeOutgoingHttpHeaders)(i.headers)
                    ;(u && (t[f.NEXT_CACHE_TAGS_HEADER] = u),
                      !t['content-type'] && e.type && (t['content-type'] = e.type))
                    let o =
                        void 0 !== z.renderOpts.collectedRevalidate &&
                        !(z.renderOpts.collectedRevalidate >= f.INFINITE_CACHE) &&
                        z.renderOpts.collectedRevalidate,
                      r =
                        void 0 === z.renderOpts.collectedExpire ||
                        z.renderOpts.collectedExpire >= f.INFINITE_CACHE
                          ? void 0
                          : z.renderOpts.collectedExpire
                    return {
                      value: {
                        kind: v.CachedRouteKind.APP_ROUTE,
                        status: i.status,
                        body: Buffer.from(await e.arrayBuffer()),
                        headers: t,
                      },
                      cacheControl: { revalidate: o, expire: r },
                    }
                  }
                } catch (t) {
                  throw (
                    (null == o ? void 0 : o.isStale) &&
                      (await S.onRequestError(
                        e,
                        t,
                        {
                          routerKind: 'App Router',
                          routePath: h,
                          routeType: 'route',
                          revalidateReason: (0, m.getRevalidateReason)({
                            isStaticGeneration: U,
                            isOnDemandRevalidate: _,
                          }),
                        },
                        x
                      )),
                    t
                  )
                }
              },
              l = await S.handleResponse({
                req: e,
                nextConfig: E,
                cacheKey: O,
                routeKind: o.RouteKind.APP_ROUTE,
                isFallback: !1,
                prerenderManifest: C,
                isRoutePPREnabled: !1,
                isOnDemandRevalidate: _,
                revalidateOnlyGenerated: P,
                responseGenerator: u,
                waitUntil: r.waitUntil,
                isMinimalMode: a,
              })
            if (!D) return null
            if (
              (null == l || null == (i = l.value) ? void 0 : i.kind) !== v.CachedRouteKind.APP_ROUTE
            )
              throw Object.defineProperty(
                Error(
                  `Invariant: app-route received invalid cache entry ${null == l || null == (c = l.value) ? void 0 : c.kind}`
                ),
                '__NEXT_ERROR_CODE',
                { value: 'E701', enumerable: !1, configurable: !0 }
              )
            ;(a ||
              t.setHeader(
                'x-nextjs-cache',
                _ ? 'REVALIDATED' : l.isMiss ? 'MISS' : l.isStale ? 'STALE' : 'HIT'
              ),
              R &&
                t.setHeader(
                  'Cache-Control',
                  'private, no-cache, no-store, max-age=0, must-revalidate'
                ))
            let d = (0, g.fromNodeOutgoingHttpHeaders)(l.value.headers)
            return (
              (a && D) || d.delete(f.NEXT_CACHE_TAGS_HEADER),
              !l.cacheControl ||
                t.getHeader('Cache-Control') ||
                d.get('Cache-Control') ||
                d.set('Cache-Control', (0, k.getCacheControlHeader)(l.cacheControl)),
              await (0, p.sendResponse)(
                B,
                K,
                new Response(l.value.body, { headers: d, status: l.value.status || 200 })
              ),
              null
            )
          }
        H
          ? await c(H)
          : await G.withPropagatedContext(e.headers, () =>
              G.trace(
                d.BaseServerSpan.handleRequest,
                {
                  spanName: `${F} ${h}`,
                  kind: i.SpanKind.SERVER,
                  attributes: { 'http.method': F, 'http.target': e.url },
                },
                c
              )
            )
      } catch (t) {
        if (
          (t instanceof b.NoFallbackError ||
            (await S.onRequestError(e, t, {
              routerKind: 'App Router',
              routePath: A,
              routeType: 'route',
              revalidateReason: (0, m.getRevalidateReason)({
                isStaticGeneration: U,
                isOnDemandRevalidate: _,
              }),
            })),
          D)
        )
          throw t
        return (await (0, p.sendResponse)(B, K, new Response(null, { status: 500 })), null)
      }
    }
    e.s(
      [
        'handler',
        () => A,
        'patchFetch',
        () => $,
        'routeModule',
        () => S,
        'serverHooks',
        () => M,
        'workAsyncStorage',
        () => P,
        'workUnitAsyncStorage',
        () => I,
      ],
      155655
    )
  },
  308812,
  (e) => {
    e.v((t) =>
      Promise.all(
        [
          'server/chunks/node_modules_better-auth_dist_chunks_bun-sqlite-dialect_mjs_ac94bb8b._.js',
        ].map((t) => e.l(t))
      ).then(() => t(463259))
    )
  },
  922180,
  (e) => {
    e.v((t) =>
      Promise.all(
        [
          'server/chunks/node_modules_better-auth_dist_chunks_node-sqlite-dialect_mjs_29019df6._.js',
        ].map((t) => e.l(t))
      ).then(() => t(8202))
    )
  },
  501603,
  (e) => {
    e.v((t) =>
      Promise.all(['server/chunks/[root-of-the-server]__fd3a5b9b._.js'].map((t) => e.l(t))).then(
        () => t(492749)
      )
    )
  },
  715957,
  (e) => {
    e.v((t) =>
      Promise.all(
        ['server/chunks/[root-of-the-server]__05e349db._.js', 'server/chunks/_1aa5a6b5._.js'].map(
          (t) => e.l(t)
        )
      ).then(() => t(309653))
    )
  },
  578406,
  (e) => {
    e.v((t) =>
      Promise.all(
        [
          'server/chunks/[root-of-the-server]__aa8ebafd._.js',
          'server/chunks/[root-of-the-server]__635f9513._.js',
          'server/chunks/node_modules_mime-db_db_json_a85ad9f0._.js',
          'server/chunks/_46980750._.js',
          'server/chunks/node_modules_0f478c9c._.js',
        ].map((t) => e.l(t))
      ).then(() => t(315159))
    )
  },
]

//# sourceMappingURL=%5Broot-of-the-server%5D__00c7310b._.js.map
