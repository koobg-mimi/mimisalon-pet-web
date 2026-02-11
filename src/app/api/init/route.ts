import { NextResponse } from 'next/server'
import { initializeKakaoAPI } from '@/lib/kakao-init'

/**
 * GET /api/init - 서버 초기화 및 API 연동 확인
 * 서버 시작 후 첫 요청 시 호출됨
 */
export async function GET() {
  try {
    const kakaoStatus = await initializeKakaoAPI()

    return NextResponse.json({
      status: 'ok',
      kakaoAPI: kakaoStatus ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Server initialization error:', error)
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
