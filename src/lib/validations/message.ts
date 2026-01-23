import { z } from 'zod';

// 메시지 타입
export const messageTypeSchema = z.enum(['TEXT', 'IMAGE', 'FILE', 'BOOKING_INFO', 'SYSTEM']);

// 대화 타입
export const conversationTypeSchema = z.enum([
  'CUSTOMER_GROOMER',
  'CUSTOMER_ADMIN',
  'GROOMER_ADMIN',
  'GROUP',
]);

// 메시지 상태
export const messageStatusSchema = z.enum(['SENT', 'DELIVERED', 'READ', 'FAILED']);

// 메시지 생성 스키마
export const createMessageSchema = z.object({
  conversationId: z.string().min(1, '대화 ID가 필요합니다'),
  content: z
    .string()
    .min(1, '메시지 내용을 입력해주세요')
    .max(1000, '메시지는 1000자 이하로 입력해주세요'),
  type: messageTypeSchema,
  attachments: z
    .array(
      z.object({
        fileName: z.string(),
        fileUrl: z.string().url(),
        fileSize: z.number(),
        mimeType: z.string(),
      })
    )
    .optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  replyToId: z.string().optional(), // 답장할 메시지 ID
});

// 대화 생성 스키마
export const createConversationSchema = z.object({
  type: conversationTypeSchema,
  participants: z.array(z.string()).min(2, '최소 2명의 참가자가 필요합니다'),
  title: z.string().optional(),
  bookingId: z.string().optional(), // 예약 관련 대화인 경우
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// 메시지 조회 필터 스키마
export const messageFilterSchema = z.object({
  conversationId: z.string(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  beforeMessageId: z.string().optional(), // 특정 메시지 이전의 메시지들 조회
  afterMessageId: z.string().optional(), // 특정 메시지 이후의 메시지들 조회
});

// 대화 목록 조회 필터 스키마
export const conversationFilterSchema = z.object({
  type: conversationTypeSchema.optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
  search: z.string().optional(),
  unreadOnly: z.boolean().default(false),
});

// 메시지 업데이트 스키마
export const updateMessageSchema = z.object({
  content: z.string().min(1).max(1000).optional(),
  status: messageStatusSchema.optional(),
  readAt: z.date().optional(),
});

// 대화 설정 업데이트 스키마
export const updateConversationSchema = z.object({
  title: z.string().max(100).optional(),
  isArchived: z.boolean().optional(),
  isMuted: z.boolean().optional(),
  mutedUntil: z.date().optional(),
});

// 파일 업로드 스키마
export const fileUploadSchema = z.object({
  file: z.instanceof(File), // File 객체
  conversationId: z.string(),
  caption: z.string().optional(),
});

// 메시지 검색 스키마
export const messageSearchSchema = z.object({
  query: z.string().min(1, '검색어를 입력해주세요'),
  conversationId: z.string().optional(),
  type: messageTypeSchema.optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
});

// 실시간 메시지 이벤트 스키마
export const messageEventSchema = z.object({
  type: z.enum([
    'MESSAGE_SENT',
    'MESSAGE_READ',
    'TYPING_START',
    'TYPING_STOP',
    'USER_JOINED',
    'USER_LEFT',
  ]),
  conversationId: z.string(),
  userId: z.string(),
  messageId: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export type MessageType = z.infer<typeof messageTypeSchema>;
export type ConversationType = z.infer<typeof conversationTypeSchema>;
export type MessageStatus = z.infer<typeof messageStatusSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type MessageFilter = z.infer<typeof messageFilterSchema>;
export type ConversationFilter = z.infer<typeof conversationFilterSchema>;
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;
export type UpdateConversationInput = z.infer<typeof updateConversationSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type MessageSearchInput = z.infer<typeof messageSearchSchema>;
export type MessageEvent = z.infer<typeof messageEventSchema>;
