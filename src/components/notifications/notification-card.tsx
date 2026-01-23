'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  CalendarIcon,
  CreditCardIcon,
  ScissorsIcon,
  GiftIcon,
  AlertCircleIcon,
  InfoIcon,
  MoreVerticalIcon,
  CheckIcon,
  ArchiveIcon,
  TrashIcon,
  ExternalLinkIcon,
} from 'lucide-react'
import {
  type NotificationType,
  type NotificationPriority,
  type NotificationStatus,
} from '@/lib/validations/notification'
import { cn } from '@/lib/utils'
import type { NotificationItem } from '@/app/api/notifications/route'

// Use the API type
type Notification = NotificationItem

interface NotificationCardProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onMarkAsUnread: (id: string) => void
  onArchive: (id: string) => void
  onDelete: (id: string) => void
  onNavigate?: (notification: Notification) => void
  className?: string
}

const NOTIFICATION_ICONS = {
  BOOKING_CONFIRMED: CalendarIcon,
  BOOKING_CANCELLED: CalendarIcon,
  BOOKING_REMINDER: CalendarIcon,
  GROOMING_STARTED: ScissorsIcon,
  GROOMING_COMPLETED: ScissorsIcon,
  PAYMENT_RECEIVED: CreditCardIcon,
  PAYMENT_FAILED: CreditCardIcon,
  REFUND_PROCESSED: CreditCardIcon,
  REVIEW_REQUEST: ScissorsIcon,
  PROMOTION: GiftIcon,
  SYSTEM_NOTICE: InfoIcon,
} as const

const NOTIFICATION_COLORS = {
  BOOKING_CONFIRMED: 'text-green-600 bg-green-100',
  BOOKING_CANCELLED: 'text-red-600 bg-red-100',
  BOOKING_REMINDER: 'text-blue-600 bg-blue-100',
  GROOMING_STARTED: 'text-purple-600 bg-purple-100',
  GROOMING_COMPLETED: 'text-green-600 bg-green-100',
  PAYMENT_RECEIVED: 'text-emerald-600 bg-emerald-100',
  PAYMENT_FAILED: 'text-red-600 bg-red-100',
  REFUND_PROCESSED: 'text-orange-600 bg-orange-100',
  REVIEW_REQUEST: 'text-yellow-600 bg-yellow-100',
  PROMOTION: 'text-pink-600 bg-pink-100',
  SYSTEM_NOTICE: 'text-gray-600 bg-gray-100',
} as const

const PRIORITY_STYLES = {
  LOW: 'border-l-gray-300',
  NORMAL: 'border-l-blue-400',
  HIGH: 'border-l-orange-400',
  URGENT: 'border-l-red-500',
} as const

export function NotificationCard({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onArchive,
  onDelete,
  onNavigate,
  className,
}: NotificationCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const Icon = NOTIFICATION_ICONS[notification.type as NotificationType] || AlertCircleIcon
  const iconColor =
    NOTIFICATION_COLORS[notification.type as NotificationType] || 'text-gray-600 bg-gray-100'
  const priorityStyle = PRIORITY_STYLES[notification.priority as NotificationPriority]

  const isUnread = notification.status === 'UNREAD'
  const isArchived = notification.status === 'ARCHIVED'

  const handleCardClick = () => {
    if (isUnread) {
      onMarkAsRead(notification.id)
    }
    if (onNavigate) {
      onNavigate(notification)
    }
  }

  const getTypeLabel = (type: NotificationType): string => {
    const labels = {
      BOOKING_CONFIRMED: '예약 확정',
      BOOKING_CANCELLED: '예약 취소',
      BOOKING_REMINDER: '예약 알림',
      GROOMING_STARTED: '미용 시작',
      GROOMING_COMPLETED: '미용 완료',
      PAYMENT_RECEIVED: '결제 완료',
      PAYMENT_FAILED: '결제 실패',
      REFUND_PROCESSED: '환불 완료',
      REVIEW_REQUEST: '리뷰 요청',
      PROMOTION: '프로모션',
      SYSTEM_NOTICE: '시스템 공지',
    }
    return labels[type] || type
  }

  const getPriorityBadge = (priority: NotificationPriority) => {
    if (priority === 'LOW') return null

    const variants = {
      NORMAL: { variant: 'secondary' as const, label: '일반' },
      HIGH: { variant: 'outline' as const, label: '중요' },
      URGENT: { variant: 'destructive' as const, label: '긴급' },
    }

    const config = variants[priority]
    if (!config) return null

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    )
  }

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return '방금 전'
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}시간 전`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}일 전`

    return format(date, 'yyyy-MM-dd', { locale: ko })
  }

  return (
    <Card
      className={cn(
        'cursor-pointer border-l-4 transition-all duration-200 hover:shadow-md',
        priorityStyle,
        {
          'border-blue-200 bg-blue-50/50': isUnread,
          'opacity-60': isArchived,
        },
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* 아이콘 */}
          <div className={cn('flex-shrink-0 rounded-lg p-2', iconColor)}>
            <Icon className="h-5 w-5" />
          </div>

          {/* 컨텐츠 */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center space-x-2">
                  <h4
                    className={cn(
                      'truncate text-sm font-medium',
                      isUnread ? 'text-gray-900' : 'text-gray-700'
                    )}
                  >
                    {notification.title}
                  </h4>
                  {isUnread && <div className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />}
                </div>

                <p className="mb-2 line-clamp-2 text-sm text-gray-600">{notification.content}</p>

                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span>{getTypeLabel(notification.type as NotificationType)}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(notification.createdAt)}</span>
                  {notification.readAt && (
                    <>
                      <span>•</span>
                      <span>읽음</span>
                    </>
                  )}
                </div>
              </div>

              <div className="ml-2 flex items-center space-x-2">
                {getPriorityBadge(notification.priority as NotificationPriority)}

                {/* 더보기 메뉴 */}
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsMenuOpen(!isMenuOpen)
                      }}
                    >
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {isUnread ? (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onMarkAsRead(notification.id)
                          setIsMenuOpen(false)
                        }}
                      >
                        <CheckIcon className="mr-2 h-4 w-4" />
                        읽음 표시
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onMarkAsUnread(notification.id)
                          setIsMenuOpen(false)
                        }}
                      >
                        <AlertCircleIcon className="mr-2 h-4 w-4" />
                        읽지 않음 표시
                      </DropdownMenuItem>
                    )}

                    {!isArchived && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onArchive(notification.id)
                          setIsMenuOpen(false)
                        }}
                      >
                        <ArchiveIcon className="mr-2 h-4 w-4" />
                        보관
                      </DropdownMenuItem>
                    )}

                    {notification.relatedId && onNavigate && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onNavigate(notification)
                          setIsMenuOpen(false)
                        }}
                      >
                        <ExternalLinkIcon className="mr-2 h-4 w-4" />
                        관련 페이지로 이동
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(notification.id)
                        setIsMenuOpen(false)
                      }}
                      className="text-red-600 focus:text-red-600"
                    >
                      <TrashIcon className="mr-2 h-4 w-4" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
