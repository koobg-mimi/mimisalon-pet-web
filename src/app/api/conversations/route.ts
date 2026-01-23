import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createConversationSchema } from '@/lib/validations/message';

// ============================================================================
// Types
// ============================================================================

export interface ConversationListResponse {
  conversations: Array<unknown>;
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
}

export interface ConversationCreateResponse {
  success: true;
  conversation: unknown;
  message: string;
}

export interface ConversationErrorResponse {
  error: string;
  details?: unknown;
}

// 모의 대화 데이터
const MOCK_CONVERSATIONS = [
  {
    id: 'conv_001',
    type: 'CUSTOMER_GROOMER',
    participants: [
      {
        id: 'user_001',
        name: '김고객',
        avatar: '/avatars/customer1.jpg',
        role: 'CUSTOMER',
        isOnline: true,
        lastSeen: '2024-01-15T15:30:00Z',
      },
      {
        id: 'groomer_001',
        name: '박미용사',
        avatar: '/avatars/groomer1.jpg',
        role: 'GROOMER',
        isOnline: false,
        lastSeen: '2024-01-15T14:45:00Z',
      },
    ],
    bookingId: 'booking_001',
    lastMessage: {
      id: 'msg_001',
      content: '뽀삐 미용이 완료되었습니다! 사진을 확인해주세요.',
      senderId: 'groomer_001',
      createdAt: '2024-01-15T15:20:00Z',
    },
    unreadCount: 2,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T15:20:00Z',
  },
  {
    id: 'conv_002',
    type: 'CUSTOMER_ADMIN',
    participants: [
      {
        id: 'user_001',
        name: '김고객',
        avatar: '/avatars/customer1.jpg',
        role: 'CUSTOMER',
        isOnline: true,
        lastSeen: '2024-01-15T15:30:00Z',
      },
      {
        id: 'admin_001',
        name: '미미살롱 고객센터',
        avatar: '/avatars/admin.jpg',
        role: 'ADMIN',
        isOnline: true,
        lastSeen: '2024-01-15T15:25:00Z',
      },
    ],
    title: '환불 문의',
    lastMessage: {
      id: 'msg_002',
      content: '환불 처리가 완료되었습니다. 3-5 영업일 내에 계좌로 입금될 예정입니다.',
      senderId: 'admin_001',
      createdAt: '2024-01-14T16:30:00Z',
    },
    unreadCount: 0,
    createdAt: '2024-01-14T14:00:00Z',
    updatedAt: '2024-01-14T16:30:00Z',
  },
  {
    id: 'conv_003',
    type: 'CUSTOMER_GROOMER',
    participants: [
      {
        id: 'user_001',
        name: '김고객',
        avatar: '/avatars/customer1.jpg',
        role: 'CUSTOMER',
        isOnline: true,
        lastSeen: '2024-01-15T15:30:00Z',
      },
      {
        id: 'groomer_002',
        name: '이미용사',
        avatar: '/avatars/groomer2.jpg',
        role: 'GROOMER',
        isOnline: true,
        lastSeen: '2024-01-12T09:15:00Z',
      },
    ],
    bookingId: 'booking_002',
    lastMessage: {
      id: 'msg_003',
      content: '다음 주 화요일 오후 2시로 예약 변경이 가능할까요?',
      senderId: 'user_001',
      createdAt: '2024-01-12T09:10:00Z',
    },
    unreadCount: 0,
    createdAt: '2024-01-11T16:00:00Z',
    updatedAt: '2024-01-12T09:10:00Z',
  },
] as const;

// ============================================================================
// Route Handlers
// ============================================================================

/**
 * GET /api/conversations
 * Get conversation list with filtering
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ConversationListResponse | ConversationErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);

    // 쿼리 파라미터 파싱
    const filterParams = {
      type: searchParams.get('type') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      search: searchParams.get('search') || undefined,
      unreadOnly: searchParams.get('unreadOnly') === 'true',
    };

    // 사용자 ID (실제로는 JWT에서 추출)
    const currentUserId = 'user_001';

    // 해당 사용자가 참여한 대화만 필터링
    let conversations = MOCK_CONVERSATIONS.filter((conv) =>
      conv.participants.some((p) => p.id === currentUserId)
    );

    // 추가 필터링
    if (filterParams.type) {
      conversations = conversations.filter((conv) => conv.type === filterParams.type);
    }

    if (filterParams.unreadOnly) {
      conversations = conversations.filter((conv) => conv.unreadCount > 0);
    }

    if (filterParams.search) {
      const search = filterParams.search.toLowerCase();
      conversations = conversations.filter((conv) => {
        const otherParticipant = conv.participants.find((p) => p.id !== currentUserId);
        const title = otherParticipant?.name || '';
        return (
          title.toLowerCase().includes(search) ||
          conv.lastMessage?.content.toLowerCase().includes(search)
        );
      });
    }

    // 정렬 (최근 메시지 순)
    conversations.sort((a, b) => {
      const aTime = new Date(a.lastMessage?.createdAt || a.updatedAt).getTime();
      const bTime = new Date(b.lastMessage?.createdAt || b.updatedAt).getTime();
      return bTime - aTime;
    });

    // 페이지네이션
    const startIndex = (filterParams.page - 1) * filterParams.limit;
    const endIndex = startIndex + filterParams.limit;
    const paginatedConversations = conversations.slice(startIndex, endIndex);

    return NextResponse.json<ConversationListResponse>({
      conversations: paginatedConversations,
      pagination: {
        page: filterParams.page,
        limit: filterParams.limit,
        total: conversations.length,
        totalPages: Math.ceil(conversations.length / filterParams.limit),
      },
      summary: {
        unreadCount: conversations.filter((conv) => conv.unreadCount > 0).length,
        totalCount: conversations.length,
      },
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json<ConversationErrorResponse>(
      { error: '대화 목록을 불러올 수 없습니다' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations
 * Create new conversation
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ConversationCreateResponse | ConversationErrorResponse>> {
  try {
    const body = await request.json();
    const conversationData = createConversationSchema.parse(body);

    // 새 대화 생성
    const newConversation = {
      id: `conv_${Date.now()}`,
      ...conversationData,
      lastMessage: undefined,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 실제로는 DB에 저장
    // await prisma.conversation.create({
    //   data: newConversation
    // })

    return NextResponse.json<ConversationCreateResponse>({
      success: true,
      conversation: newConversation,
      message: '대화가 성공적으로 생성되었습니다',
    });
  } catch (error) {
    console.error('Error creating conversation:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json<ConversationErrorResponse>(
        { error: '잘못된 대화 데이터입니다', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json<ConversationErrorResponse>(
      { error: '대화 생성 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
