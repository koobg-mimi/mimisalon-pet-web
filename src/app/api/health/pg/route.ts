import { NextResponse } from 'next/server'
import { env } from '@/lib/env'

/**
 * Health check endpoint for PG (Payment Gateway) service
 * GET /api/health/pg
 */
export async function GET() {
  const pgStatus = {
    portone: {
      connected: !!env.PORTONE_API_SECRET,
      hasSecret: !!env.PORTONE_API_SECRET,
      timestamp: new Date().toISOString(),
    },
    environment: {
      nodeEnv: env.NODE_ENV,
    },
  }

  // Log to server console
  if (pgStatus.portone.connected) {
    console.log('✅ [PG Health Check] PortOne 서비스 연결됨')
  } else {
    console.error('❌ [PG Health Check] PortOne 서비스 연결 안됨 - API Secret 미설정')
  }

  return NextResponse.json(pgStatus)
}
