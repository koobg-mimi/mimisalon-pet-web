import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import auth from '@/lib/auth';
import { workerApiClient } from '@/lib/worker-api-client';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 큐 상태 조회 via Worker API
    const status = await workerApiClient.getNotificationQueueStatus();

    // TODO: Worker API needs enhancement for job listing
    // notificationQueue.getJobs() requires new Worker API endpoint
    return NextResponse.json({
      status,
      queueName: 'notification',
      timestamp: new Date().toISOString(),
      note: 'Recent jobs listing requires Worker API enhancement - add /api/jobs/notification/list endpoint',
    });
  } catch (error) {
    console.error('Queue status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
