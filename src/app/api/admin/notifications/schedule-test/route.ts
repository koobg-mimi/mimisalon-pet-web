import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { prisma } from '@mimisalon/shared'
import { workerApiClient } from '@/lib/worker-api-client'
import { adminScheduleNotificationSchema } from '@/lib/validations/notification'
import { ZodError, type ZodIssue } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestBody = await req.json()

    // Validate input using Zod schema
    const validatedData = adminScheduleNotificationSchema.parse(requestBody)
    const { userId, delayMinutes, title, body } = validatedData

    // 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        notificationsEnabled: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 테스트 알림 스케줄링 via Worker API
    // Note: Using sendImmediateNotification for now
    // TODO: Add scheduled notification endpoint to Worker API for proper delay support
    await workerApiClient.sendImmediateNotification({
      type: 'status_update',
      bookingId: '', // 테스트용이므로 빈 값
      targetAudience: 'CUSTOMER',
      title: `[테스트] ${title}`,
      body: `${body} (원래 ${delayMinutes}분 지연 예정이었으나 즉시 발송)`,
      data: {
        isTest: true,
        originalDelayMinutes: delayMinutes,
        scheduledAt: new Date().toISOString(),
        userId,
      },
    })

    console.log(
      `Sent test notification to user ${user.name} (${user.email}) immediately (originally ${delayMinutes} minutes)`
    )

    // 스케줄 기록 저장
    const notificationRecord = await prisma.notification.create({
      data: {
        userId: user.id,
        title: `[테스트] ${title}`,
        body,
        type: 'SYSTEM',
        isRead: false,
        metadata: {
          scheduledBy: session.user.id,
          scheduledAt: new Date().toISOString(),
          originalDelayMinutes: delayMinutes,
          isScheduled: false,
          sentImmediately: true,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: `Test notification sent immediately (originally scheduled for ${delayMinutes} minutes)`,
      notificationId: notificationRecord.id,
      note: 'Scheduled notifications require Worker API endpoint enhancement',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: '유효하지 않은 입력 데이터입니다',
          details: error.issues.map((err: ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      )
    }

    // Handle other errors
    console.error('Schedule test notification error:', error)

    // If it's a Prisma error, handle it appropriately
    if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
      return NextResponse.json({ error: '데이터베이스 오류가 발생했습니다' }, { status: 500 })
    }

    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다' }, { status: 500 })
  }
}
