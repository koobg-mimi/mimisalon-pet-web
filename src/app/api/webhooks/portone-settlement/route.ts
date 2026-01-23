/**
 * PortOne 파트너 정산 웹훅 핸들러
 *
 * PortOne에서 발생하는 정산 관련 이벤트를 처리합니다:
 * - 정산 상태 변경
 * - 지급 완료/실패
 * - 일괄 지급 상태 변경
 */

import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma, Prisma } from '@mimisalon/shared'
import { isPortOneEnabled } from '@/lib/portone-client'
import { env } from '@/lib/env'

// ============================================================================
// Types
// ============================================================================

type PlatformPartnerSettlementStatus =
  | 'PAYOUT_SCHEDULED'
  | 'PAYOUT_PREPARED'
  | 'PAYOUT_WITHHELD'
  | 'PAYOUT_FAILED'
  | 'IN_PAYOUT'
  | 'PAID_OUT'
  | 'CANCELLED'

interface PortOneWebhookEvent {
  type: string
  timestamp: string
  data: Record<string, unknown>
}

interface PartnerSettlementStatusChangedEvent {
  type: 'PartnerSettlement.StatusChanged'
  timestamp: string
  data: {
    partnerSettlementId: string
    partnerId: string
    status: PlatformPartnerSettlementStatus
    settlementAmount: number
    settlementCurrency: string
    settlementDate: string
    memo?: string
  }
}

interface BulkPayoutStatusChangedEvent {
  type: 'BulkPayout.StatusChanged'
  timestamp: string
  data: {
    bulkPayoutId: string
    status: 'PREPARED' | 'CANCELLED' | 'STOPPED' | 'PROCESSING' | 'COMPLETED' | 'SCHEDULED'
    totalAmount: number
    totalCount: number
    currency: string
    memo?: string
    partnerSettlementIds: string[]
  }
}

interface PayoutCompletedEvent {
  type: 'Payout.Completed'
  timestamp: string
  data: {
    payoutId: string
    partnerSettlementId: string
    partnerId: string
    amount: number
    currency: string
    completedAt: string
  }
}

interface PayoutFailedEvent {
  type: 'Payout.Failed'
  timestamp: string
  data: {
    payoutId: string
    partnerSettlementId: string
    partnerId: string
    amount: number
    currency: string
    failureReason: string
    failedAt: string
  }
}

interface WebhookSuccessResponse {
  success: true
  message?: string
}

interface WebhookErrorResponse {
  error: string
  message?: string
  success?: false
}

interface WebhookStatusResponse {
  status: string
  enabled: boolean
  timestamp: string
}

/**
 * PortOne 웹훅 서명 검증
 */
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  if (!signature || !secret) {
    return false
  }

  try {
    // PortOne은 HMAC-SHA256 서명을 사용
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex')

    // 서명 형식 확인 (v1= 접두사가 있을 수 있음)
    const cleanSignature = signature.replace(/^v1=/, '')

    return crypto.timingSafeEqual(
      Buffer.from(cleanSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch (error) {
    console.error('웹훅 서명 검증 중 오류:', error)
    return false
  }
}

/**
 * 파트너 정산 상태 변경 처리
 */
async function handlePartnerSettlementStatusChanged(
  event: PartnerSettlementStatusChangedEvent
): Promise<void> {
  const { partnerSettlementId, status } = event.data

  try {
    // 해당 PortOne 정산 ID로 로컬 정산 찾기
    const settlement = await prisma.groomerSettlement.findFirst({
      where: { portoneSettlementId: partnerSettlementId },
    })

    if (!settlement) {
      console.warn(`로컬 정산을 찾을 수 없음: PortOne ID ${partnerSettlementId}`)
      return
    }

    // PortOne 상태를 로컬 상태로 매핑
    let localStatus = settlement.status
    let paidAt = settlement.paidAt

    switch (status) {
      case 'PAYOUT_SCHEDULED':
      case 'PAYOUT_PREPARED':
        localStatus = 'READY_FOR_PAYOUT'
        break
      case 'IN_PAYOUT':
        localStatus = 'PROCESSING'
        break
      case 'PAID_OUT':
        localStatus = 'PAID'
        paidAt = new Date()
        break
      case 'CANCELLED':
        localStatus = 'CANCELLED'
        break
      case 'PAYOUT_FAILED':
        localStatus = 'FAILED'
        break
      case 'PAYOUT_WITHHELD':
        localStatus = 'PROCESSING'
        break
    }

    // 로컬 정산 상태 업데이트
    await prisma.groomerSettlement.update({
      where: { id: settlement.id },
      data: {
        status: localStatus,
        paidAt,
        processedAt: new Date(),
      },
    })

    console.log(`✅ 정산 상태 업데이트: ${settlement.id} -> ${localStatus} (PortOne: ${status})`)
  } catch (error) {
    console.error('파트너 정산 상태 변경 처리 실패:', error)
    throw error
  }
}

/**
 * 일괄 지급 상태 변경 처리
 */
async function handleBulkPayoutStatusChanged(event: BulkPayoutStatusChangedEvent): Promise<void> {
  const { bulkPayoutId, status, partnerSettlementIds } = event.data

  try {
    // 해당 일괄 지급에 포함된 정산들 조회
    const settlements = await prisma.groomerSettlement.findMany({
      where: {
        portoneSettlementId: { in: partnerSettlementIds },
      },
    })

    if (settlements.length === 0) {
      console.warn(`일괄 지급에 해당하는 로컬 정산을 찾을 수 없음: ${bulkPayoutId}`)
      return
    }

    // 일괄 지급 상태에 따른 로컬 상태 매핑
    let localStatus = settlements[0].status

    switch (status) {
      case 'PROCESSING':
        localStatus = 'PROCESSING'
        break
      case 'COMPLETED':
        localStatus = 'PAID'
        break
      case 'CANCELLED':
      case 'STOPPED':
        localStatus = 'FAILED'
        break
    }

    // 모든 관련 정산 상태 업데이트
    await prisma.groomerSettlement.updateMany({
      where: {
        portoneSettlementId: { in: partnerSettlementIds },
      },
      data: {
        status: localStatus,
        paidAt: status === 'COMPLETED' ? new Date() : undefined,
        processedAt: new Date(),
      },
    })

    console.log(
      `✅ 일괄 지급 상태 업데이트: ${settlements.length}개 정산 -> ${localStatus} (PortOne: ${status})`
    )
  } catch (error) {
    console.error('일괄 지급 상태 변경 처리 실패:', error)
    throw error
  }
}

/**
 * 지급 완료 처리
 */
async function handlePayoutCompleted(event: PayoutCompletedEvent): Promise<void> {
  const { payoutId, partnerSettlementId, amount, completedAt } = event.data

  try {
    const settlement = await prisma.groomerSettlement.findFirst({
      where: { portoneSettlementId: partnerSettlementId },
    })

    if (!settlement) {
      console.warn(`지급 완료된 정산을 찾을 수 없음: ${partnerSettlementId}`)
      return
    }

    await prisma.groomerSettlement.update({
      where: { id: settlement.id },
      data: {
        status: 'PAID',
        paidAt: new Date(completedAt),
        processedAt: new Date(),
        portonePayoutId: payoutId,
      },
    })

    console.log(`✅ 지급 완료: ${settlement.id} (${amount}원, ${payoutId})`)
  } catch (error) {
    console.error('지급 완료 처리 실패:', error)
    throw error
  }
}

/**
 * 지급 실패 처리
 */
async function handlePayoutFailed(event: PayoutFailedEvent): Promise<void> {
  const { payoutId, partnerSettlementId, failureReason, failedAt } = event.data

  try {
    const settlement = await prisma.groomerSettlement.findFirst({
      where: { portoneSettlementId: partnerSettlementId },
    })

    if (!settlement) {
      console.warn(`지급 실패된 정산을 찾을 수 없음: ${partnerSettlementId}`)
      return
    }

    await prisma.groomerSettlement.update({
      where: { id: settlement.id },
      data: {
        status: 'FAILED',
        failureReason,
        processedAt: new Date(failedAt),
        portonePayoutId: payoutId,
      },
    })

    console.error(`❌ 지급 실패: ${settlement.id} - ${failureReason} (${payoutId})`)

    // TODO: 관리자에게 알림 발송
  } catch (error) {
    console.error('지급 실패 처리 실패:', error)
    throw error
  }
}

/**
 * 웹훅 이벤트 라우팅
 */
async function processWebhookEvent(event: PortOneWebhookEvent): Promise<void> {
  console.log(`📨 PortOne 웹훅 이벤트 수신: ${event.type}`)

  switch (event.type) {
    case 'PartnerSettlement.StatusChanged':
      await handlePartnerSettlementStatusChanged(event as PartnerSettlementStatusChangedEvent)
      break

    case 'BulkPayout.StatusChanged':
      await handleBulkPayoutStatusChanged(event as BulkPayoutStatusChangedEvent)
      break

    case 'Payout.Completed':
      await handlePayoutCompleted(event as PayoutCompletedEvent)
      break

    case 'Payout.Failed':
      await handlePayoutFailed(event as PayoutFailedEvent)
      break

    default:
      console.log(`⚠️ 처리되지 않은 웹훅 이벤트 타입: ${event.type}`)
      break
  }
}

/**
 * POST /api/webhooks/portone-settlement
 * PortOne 파트너 정산 웹훅 엔드포인트
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<WebhookSuccessResponse | WebhookErrorResponse>> {
  try {
    // PortOne 기능 비활성화 체크
    if (!isPortOneEnabled()) {
      console.warn('PortOne 기능이 비활성화됨 - 웹훅 무시')
      return NextResponse.json<WebhookSuccessResponse>({
        success: true,
        message: 'PortOne disabled',
      })
    }

    // 요청 본문 읽기
    const body = await request.text()
    const headersList = await headers()

    // 웹훅 서명 검증
    const signature = headersList.get('x-portone-signature')
    const webhookSecret = env.PORTONE_WEBHOOK_SECRET

    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(body, signature, webhookSecret)
      if (!isValid) {
        console.error('PortOne 웹훅 서명 검증 실패')
        return NextResponse.json<WebhookErrorResponse>(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    } else if (env.NODE_ENV === 'production') {
      // 프로덕션에서는 서명 검증 필수
      console.error('PortOne 웹훅 서명 또는 시크릿이 없음')
      return NextResponse.json<WebhookErrorResponse>(
        { error: 'Missing signature or secret' },
        { status: 401 }
      )
    }

    // JSON 파싱
    let event: PortOneWebhookEvent
    try {
      event = JSON.parse(body)
    } catch (error) {
      console.error('PortOne 웹훅 JSON 파싱 실패:', error)
      return NextResponse.json<WebhookErrorResponse>({ error: 'Invalid JSON' }, { status: 400 })
    }

    // 이벤트 처리
    await processWebhookEvent(event)

    return NextResponse.json<WebhookSuccessResponse>({ success: true })
  } catch (error) {
    console.error('PortOne 웹훅 처리 실패:', error)

    // 5xx 에러를 반환하면 PortOne이 재시도함
    return NextResponse.json<WebhookErrorResponse>(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/webhooks/portone-settlement
 * 웹훅 엔드포인트 상태 확인용
 */
export async function GET(): Promise<NextResponse<WebhookStatusResponse>> {
  return NextResponse.json<WebhookStatusResponse>({
    status: 'ready',
    enabled: isPortOneEnabled(),
    timestamp: new Date().toISOString(),
  })
}

// ============================================================================
// Type Exports
// ============================================================================

export type {
  PlatformPartnerSettlementStatus,
  PortOneWebhookEvent,
  PartnerSettlementStatusChangedEvent,
  BulkPayoutStatusChangedEvent,
  PayoutCompletedEvent,
  PayoutFailedEvent,
  WebhookSuccessResponse,
  WebhookErrorResponse,
  WebhookStatusResponse,
}
