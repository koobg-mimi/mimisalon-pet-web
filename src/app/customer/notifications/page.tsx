'use client'

import { useRouter } from 'next/navigation'
import { NotificationCenter } from '@/components/notifications/notification-center'
import type { NotificationItem } from '@/app/api/notifications/route'

// Use the API type
type Notification = NotificationItem

export default function NotificationsPage() {
  const router = useRouter()

  // 알림 클릭 시 관련 페이지로 이동
  const handleNotificationNavigate = (notification: Notification) => {
    if (!notification.relatedId) return

    // 알림 타입에 따라 적절한 페이지로 이동
    switch (notification.type) {
      case 'BOOKING_CONFIRMED':
      case 'BOOKING_CANCELLED':
      case 'BOOKING_REMINDER':
      case 'GROOMING_STARTED':
      case 'GROOMING_COMPLETED':
        router.push(`/customer/booking/${notification.relatedId}`)
        break

      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_FAILED':
      case 'REFUND_PROCESSED':
        // payment ID에서 booking ID를 추출하거나 별도 처리
        if (notification.metadata?.bookingId) {
          router.push(`/customer/booking/${notification.metadata.bookingId}`)
        }
        break

      case 'REVIEW_REQUEST':
        router.push(`/customer/booking/${notification.relatedId}/review`)
        break

      case 'PROMOTION':
        // 프로모션 상세 페이지 또는 해당 서비스 페이지로 이동
        if (notification.metadata?.promotionUrl) {
          router.push(String(notification.metadata.promotionUrl))
        } else {
          router.push('/customer/services')
        }
        break

      case 'SYSTEM_NOTICE':
        // 공지사항 페이지로 이동
        router.push(`/notices/${notification.relatedId}`)
        break

      default:
        // 기본적으로 고객 대시보드로 이동
        router.push('/customer')
        break
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <NotificationCenter onNavigate={handleNotificationNavigate} />
      </div>
    </div>
  )
}
