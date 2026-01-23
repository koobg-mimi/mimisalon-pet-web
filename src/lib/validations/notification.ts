import { z } from 'zod'

// 알림 타입 정의
export const notificationTypeSchema = z.enum([
  'BOOKING_CONFIRMED',
  'BOOKING_CANCELLED',
  'BOOKING_REMINDER',
  'GROOMING_STARTED',
  'GROOMING_COMPLETED',
  'PAYMENT_RECEIVED',
  'PAYMENT_FAILED',
  'REFUND_PROCESSED',
  'REVIEW_REQUEST',
  'PROMOTION',
  'SYSTEM_NOTICE',
])

// 알림 우선순위
export const notificationPrioritySchema = z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT'])

// 알림 상태
export const notificationStatusSchema = z.enum(['UNREAD', 'READ', 'ARCHIVED'])

// 알림 생성 스키마
export const createNotificationSchema = z.object({
  type: notificationTypeSchema,
  title: z.string().min(1, '제목을 입력해주세요').max(100, '제목은 100자 이하로 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요').max(500, '내용은 500자 이하로 입력해주세요'),
  priority: notificationPrioritySchema.default('NORMAL'),
  recipientId: z.string().min(1, '수신자 ID가 필요합니다'),
  relatedId: z.string().optional(), // 관련 예약/결제 등의 ID
  metadata: z.record(z.string(), z.any()).optional(),
  scheduledAt: z.date().optional(), // 예약 발송
})

// 알림 업데이트 스키마
export const updateNotificationSchema = z.object({
  status: notificationStatusSchema.optional(),
  readAt: z.date().optional(),
  archivedAt: z.date().optional(),
})

// 알림 조회 필터 스키마
export const notificationFilterSchema = z.object({
  status: notificationStatusSchema.optional(),
  type: notificationTypeSchema.optional(),
  priority: notificationPrioritySchema.optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

// 푸시 알림 설정 스키마
export const pushNotificationSettingsSchema = z.object({
  bookingUpdates: z.boolean().default(true),
  paymentNotifications: z.boolean().default(true),
  promotions: z.boolean().default(false),
  systemNotices: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
})

// 알림 배치 발송 스키마
export const batchNotificationSchema = z.object({
  type: notificationTypeSchema,
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(500),
  priority: notificationPrioritySchema.default('NORMAL'),
  recipientIds: z.array(z.string()).min(1, '수신자를 선택해주세요'),
  metadata: z.record(z.string(), z.any()).optional(),
  scheduledAt: z.date().optional(),
})

// 관리자 FCM 전송 스키마
export const adminFcmNotificationSchema = z.object({
  userId: z.string().cuid('유효하지 않은 사용자 ID입니다'),
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이하로 입력해주세요')
    .refine((val) => val.trim().length > 0, '제목에 공백만 포함될 수 없습니다'),
  body: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(500, '내용은 500자 이하로 입력해주세요')
    .refine((val) => val.trim().length > 0, '내용에 공백만 포함될 수 없습니다'),
})

// 관리자 스케줄 알림 스키마
export const adminScheduleNotificationSchema = z.object({
  userId: z.string().cuid('유효하지 않은 사용자 ID입니다'),
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이하로 입력해주세요')
    .refine((val) => val.trim().length > 0, '제목에 공백만 포함될 수 없습니다'),
  body: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(500, '내용은 500자 이하로 입력해주세요')
    .refine((val) => val.trim().length > 0, '내용에 공백만 포함될 수 없습니다'),
  delayMinutes: z
    .number()
    .int('정수만 입력 가능합니다')
    .min(1, '최소 1분 이상이어야 합니다')
    .max(60, '최대 60분까지 설정 가능합니다'),
})

export type NotificationType = z.infer<typeof notificationTypeSchema>
export type NotificationPriority = z.infer<typeof notificationPrioritySchema>
export type NotificationStatus = z.infer<typeof notificationStatusSchema>
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>
export type NotificationFilter = z.infer<typeof notificationFilterSchema>
export type PushNotificationSettings = z.infer<typeof pushNotificationSettingsSchema>
export type BatchNotificationInput = z.infer<typeof batchNotificationSchema>
export type AdminFcmNotificationInput = z.infer<typeof adminFcmNotificationSchema>
export type AdminScheduleNotificationInput = z.infer<typeof adminScheduleNotificationSchema>
