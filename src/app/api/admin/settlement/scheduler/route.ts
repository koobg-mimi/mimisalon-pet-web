import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import auth from '@/lib/auth'
import { SettlementJobManager, settlementScheduler } from '@/lib/settlement-scheduler'

// GET - 스케줄러 상태 및 작업 목록 조회
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 })
    }

    const jobStatus = await SettlementJobManager.getJobStatus()

    return NextResponse.json({
      success: true,
      data: {
        scheduler: {
          isRunning: true, // TODO: 실제 상태 확인
        },
        ...jobStatus,
      },
    })
  } catch (error) {
    console.error('Error fetching scheduler status:', error)
    return NextResponse.json(
      { error: '스케줄러 상태 조회 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// POST - 스케줄러 제어 및 작업 관리
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다' }, { status: 403 })
    }

    const body = await request.json()
    const { action, ...params } = body

    let result

    switch (action) {
      case 'start_scheduler':
        settlementScheduler.start()
        result = { message: '자동 정산 스케줄러가 비활성화되었습니다' }
        break

      case 'stop_scheduler':
        settlementScheduler.stop()
        result = { message: '스케줄러가 중지되었습니다' }
        break

      case 'schedule_weekly':
        const weeklyJobs = await SettlementJobManager.scheduleWeeklySettlements(
          params.weeksAhead || 4
        )
        result = {
          message: `자동 주간 정산 작업 예약이 비활성화되었습니다`,
          jobs: weeklyJobs,
        }
        break

      case 'add_manual':
        if (!params.groomerId || !params.periodStart || !params.periodEnd) {
          return NextResponse.json(
            { error: '수동 정산에 필요한 데이터가 부족합니다' },
            { status: 400 }
          )
        }
        const manualJob = await SettlementJobManager.addManualSettlement(
          params.groomerId,
          new Date(params.periodStart),
          new Date(params.periodEnd),
          session.user.id,
          params.scheduleTime ? new Date(params.scheduleTime) : undefined
        )
        result = {
          message: '수동 정산 작업이 추가되었습니다',
          job: manualJob,
        }
        break

      case 'run_immediate':
        try {
          const immediateJob = await SettlementJobManager.runImmediateSettlement()
          result = {
            message: '즉시 정산 작업이 추가되었습니다',
            job: immediateJob,
          }
        } catch (error) {
          return NextResponse.json(
            { error: error instanceof Error ? error.message : '즉시 정산 실행 실패' },
            { status: 400 }
          )
        }
        break

      case 'retry_job':
        if (!params.jobId) {
          return NextResponse.json({ error: '작업 ID가 필요합니다' }, { status: 400 })
        }
        const retryJob = await SettlementJobManager.retryFailedJob(params.jobId)
        result = {
          message: '작업 재시도가 예약되었습니다',
          job: retryJob,
        }
        break

      case 'cancel_job':
        if (!params.jobId) {
          return NextResponse.json({ error: '작업 ID가 필요합니다' }, { status: 400 })
        }
        const cancelledJob = await SettlementJobManager.cancelJob(params.jobId)
        result = {
          message: '작업이 취소되었습니다',
          job: cancelledJob,
        }
        break

      case 'cleanup_jobs':
        const cleanup = await SettlementJobManager.cleanupOldJobs(params.daysToKeep || 30)
        result = {
          message: `${cleanup.count}개의 오래된 작업이 정리되었습니다`,
          deleted: cleanup.count,
        }
        break

      default:
        return NextResponse.json({ error: `알 수 없는 액션: ${action}` }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('Error in scheduler action:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '서버 오류가 발생했습니다',
      },
      { status: 500 }
    )
  }
}
