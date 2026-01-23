import { NextRequest, NextResponse } from 'next/server'
import { NotificationScheduler } from '@/lib/notification-scheduler'
import { env } from '@/lib/env'
import { z } from 'zod'

// Request schema
export const schedulerActionSchema = z.object({
  action: z.enum(['reminder', 'today', 'cleanup', 'all']),
})

export type SchedulerActionRequest = z.infer<typeof schedulerActionSchema>

// Response types
export type SchedulerActionResponse = {
  message: string
}

export type SchedulerStatusResponse = {
  status: string
  timestamp: string
  availableActions: string[]
  description: {
    reminder: string
    today: string
    cleanup: string
    all: string
  }
}

export type ErrorResponse = {
  error: string
}

// 스케줄러 실행을 위한 API 엔드포인트
// 실제 운영환경에서는 Cron job이나 외부 스케줄러에서 호출
export async function POST(
  request: NextRequest
): Promise<NextResponse<SchedulerActionResponse | ErrorResponse>> {
  try {
    // 보안을 위한 API 키 확인 (운영환경에서 필수)
    const authHeader = request.headers.get('authorization')
    const apiKey = env.SCHEDULER_API_KEY

    if (apiKey && authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: unknown = await request.json().catch(() => ({}))
    const validatedData = schedulerActionSchema.parse(body)
    const { action } = validatedData

    let result = { message: 'Unknown action' }

    switch (action) {
      case 'reminder':
        await NotificationScheduler.sendReminderNotifications()
        result = { message: 'Reminder notifications processed' }
        break

      case 'today':
        await NotificationScheduler.sendTodayBookingNotifications()
        result = { message: 'Today booking notifications processed' }
        break

      case 'cleanup':
        await NotificationScheduler.cleanupExpiredBookings()
        result = { message: 'Expired bookings cleaned up' }
        break

      case 'all':
        await NotificationScheduler.sendReminderNotifications()
        await NotificationScheduler.sendTodayBookingNotifications()
        await NotificationScheduler.cleanupExpiredBookings()
        result = { message: 'All scheduler tasks processed' }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: reminder, today, cleanup, or all' },
          { status: 400 }
        )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Scheduler API error:', error)
    return NextResponse.json({ error: 'Scheduler execution failed' }, { status: 500 })
  }
}

// GET 메서드로 스케줄러 상태 확인
export async function GET(
  request: NextRequest
): Promise<NextResponse<SchedulerStatusResponse | ErrorResponse>> {
  try {
    const authHeader = request.headers.get('authorization')
    const apiKey = env.SCHEDULER_API_KEY

    if (apiKey && authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      status: 'active',
      timestamp: new Date().toISOString(),
      availableActions: ['reminder', 'today', 'cleanup', 'all'],
      description: {
        reminder: 'Send 2-hour before booking reminder notifications',
        today: "Send today's booking notifications",
        cleanup: 'Clean up expired bookings',
        all: 'Execute all scheduler tasks',
      },
    })
  } catch (error) {
    console.error('Scheduler status error:', error)
    return NextResponse.json({ error: 'Failed to get scheduler status' }, { status: 500 })
  }
}
