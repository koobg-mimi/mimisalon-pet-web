import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createNotificationSchema } from '@/lib/validations/notification';
import { Prisma } from '@prisma/client';

// Request schemas
export const getNotificationsQuerySchema = z.object({
  status: z.string().optional(),
  type: z.string().optional(),
  priority: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

export type GetNotificationsQuery = z.infer<typeof getNotificationsQuerySchema>;

// Response types
export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  content: string;
  priority: string;
  status: string;
  createdAt: string;
  readAt?: string;
  relatedId?: string;
  recipientId: string;
  metadata?: Record<string, unknown>;
};

export type GetNotificationsResponse = {
  notifications: NotificationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    unreadCount: number;
    totalCount: number;
  };
};

export type CreateNotificationRequest = z.infer<typeof createNotificationSchema>;

export type CreateNotificationResponse = {
  success: boolean;
  notification: NotificationItem & {
    id: string;
    status: 'UNREAD' | 'READ';
    createdAt: string;
  };
  message: string;
};

// 모의 알림 데이터
const MOCK_NOTIFICATIONS = [
  {
    id: 'notif_001',
    type: 'BOOKING_CONFIRMED',
    title: '예약이 확정되었습니다',
    content:
      '뽀삐의 프리미엄 전체 미용 예약이 확정되었습니다. 1월 20일 오전 10시에 미미살롱 강남점에서 뵙겠습니다.',
    priority: 'HIGH',
    status: 'UNREAD',
    createdAt: '2024-01-15T14:30:00Z',
    relatedId: 'booking_001',
    recipientId: 'user_001',
    metadata: { bookingId: 'booking_001', groomerName: '김미용사' },
  },
  {
    id: 'notif_002',
    type: 'PAYMENT_RECEIVED',
    title: '결제가 완료되었습니다',
    content: '85,000원 결제가 성공적으로 완료되었습니다. 영수증을 확인해주세요.',
    priority: 'NORMAL',
    status: 'READ',
    createdAt: '2024-01-15T14:25:00Z',
    readAt: '2024-01-15T14:35:00Z',
    relatedId: 'payment_001',
    recipientId: 'user_001',
    metadata: { paymentId: 'payment_001', amount: 85000 },
  },
  {
    id: 'notif_003',
    type: 'GROOMING_STARTED',
    title: '미용이 시작되었습니다',
    content: '뽀삐의 미용이 시작되었습니다. 실시간으로 진행 상황을 확인할 수 있습니다.',
    priority: 'NORMAL',
    status: 'UNREAD',
    createdAt: '2024-01-20T10:05:00Z',
    relatedId: 'booking_001',
    recipientId: 'user_001',
    metadata: { bookingId: 'booking_001', stage: 'STARTED' },
  },
  {
    id: 'notif_004',
    type: 'PROMOTION',
    title: '신규 고객 할인 이벤트',
    content: '첫 방문 고객을 위한 20% 할인 이벤트가 진행 중입니다. 지금 예약하세요!',
    priority: 'LOW',
    status: 'UNREAD',
    createdAt: '2024-01-14T09:00:00Z',
    relatedId: 'promo_001',
    recipientId: 'user_001',
    metadata: { promoCode: 'FIRST20', discount: 20 },
  },
] as const;

export type ErrorResponse = {
  error: string;
  details?: unknown;
};

export async function GET(
  request: NextRequest
): Promise<NextResponse<GetNotificationsResponse | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);

    // 쿼리 파라미터 파싱
    const filterParams = {
      status: searchParams.get('status') || undefined,
      type: searchParams.get('type') || undefined,
      priority: searchParams.get('priority') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      search: searchParams.get('search') || undefined,
    };

    // 필터링
    let notifications = [...MOCK_NOTIFICATIONS];

    if (filterParams.status) {
      notifications = notifications.filter((n) => n.status === filterParams.status);
    }

    if (filterParams.type) {
      notifications = notifications.filter((n) => n.type === filterParams.type);
    }

    if (filterParams.priority) {
      notifications = notifications.filter((n) => n.priority === filterParams.priority);
    }

    if (filterParams.search) {
      const search = filterParams.search.toLowerCase();
      notifications = notifications.filter(
        (n) => n.title.toLowerCase().includes(search) || n.content.toLowerCase().includes(search)
      );
    }

    // 정렬 (최신순)
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 페이지네이션
    const startIndex = (filterParams.page - 1) * filterParams.limit;
    const endIndex = startIndex + filterParams.limit;
    const paginatedNotifications = notifications.slice(startIndex, endIndex);

    return NextResponse.json({
      notifications: paginatedNotifications,
      pagination: {
        page: filterParams.page,
        limit: filterParams.limit,
        total: notifications.length,
        totalPages: Math.ceil(notifications.length / filterParams.limit),
      },
      summary: {
        unreadCount: MOCK_NOTIFICATIONS.filter((n) => n.status === 'UNREAD').length,
        totalCount: MOCK_NOTIFICATIONS.length,
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: '알림을 불러올 수 없습니다' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<CreateNotificationResponse | ErrorResponse>> {
  try {
    const body: unknown = await request.json();
    const notificationData = createNotificationSchema.parse(body);

    // 알림 생성 (실제로는 DB에 저장)
    const newNotification = {
      id: `notif_${Date.now()}`,
      ...notificationData,
      status: 'UNREAD' as const,
      createdAt: new Date().toISOString(),
    };

    // 실시간 푸시 알림 발송
    await sendPushNotification(newNotification);

    return NextResponse.json({
      success: true,
      notification: newNotification,
      message: '알림이 성공적으로 생성되었습니다',
    });
  } catch (error) {
    console.error('Error creating notification:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '잘못된 알림 데이터입니다', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: '알림 생성 중 오류가 발생했습니다' }, { status: 500 });
  }
}

// 실시간 푸시 알림 발송
type NotificationWithMeta = z.infer<typeof createNotificationSchema> & {
  id: string;
  status: 'UNREAD' | 'READ';
  createdAt: string;
};

async function sendPushNotification(notification: NotificationWithMeta) {
  try {
    // 실제로는 Firebase FCM, 웹 푸시 등을 사용
    console.log('Sending push notification:', notification);

    // 웹 브라우저 알림 (서비스 워커 필요)
    // await self.registration.showNotification(notification.title, {
    //   body: notification.content,
    //   icon: '/icon-192x192.png',
    //   badge: '/badge-72x72.png',
    //   tag: notification.id,
    //   data: notification
    // })

    // 이메일 알림 (중요한 알림만)
    if (notification.priority === 'HIGH' || notification.priority === 'URGENT') {
      await sendEmailNotification(notification);
    }

    // SMS 알림 (긴급 알림만)
    if (notification.priority === 'URGENT') {
      await sendSMSNotification(notification);
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

// 이메일 알림 발송
async function sendEmailNotification(notification: NotificationWithMeta) {
  // 실제로는 이메일 서비스 API 호출
  console.log('Sending email notification:', notification);
}

// SMS 알림 발송
async function sendSMSNotification(notification: NotificationWithMeta) {
  // 실제로는 SMS 서비스 API 호출
  console.log('Sending SMS notification:', notification);
}
