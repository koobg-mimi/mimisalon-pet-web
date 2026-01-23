import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { workerApiClient } from '@/lib/worker-api-client';

// ============================================================================
// Types
// ============================================================================

export interface QueueStatusResponse {
  success: true;
  timestamp: string;
  queue: {
    healthCheck: 'healthy' | 'warning';
    counts: {
      total: number;
      waiting: number;
      active: number;
      completed: number;
      failed: number;
      delayed: number;
    };
  };
}

export interface QueueErrorResponse {
  error: string;
}

// ============================================================================
// Route Handler
// ============================================================================

/**
 * GET /api/queue/status
 *
 * Get notification queue status (admin only).
 */
export async function GET(): Promise<NextResponse<QueueStatusResponse | QueueErrorResponse>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    // 관리자만 큐 상태 조회 가능
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json<QueueErrorResponse>(
        { error: '관리자 권한이 필요합니다' },
        { status: 403 }
      );
    }

    const status = await workerApiClient.getNotificationQueueStatus();

    return NextResponse.json<QueueStatusResponse>({
      success: true,
      timestamp: new Date().toISOString(),
      queue: {
        ...status,
        healthCheck: status.counts.total < 10000 ? 'healthy' : 'warning', // 임계치 설정
      },
    });
  } catch (error) {
    console.error('Queue status error:', error);
    return NextResponse.json<QueueErrorResponse>(
      { error: '큐 상태 조회 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
