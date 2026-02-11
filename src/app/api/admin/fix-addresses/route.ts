import { NextResponse } from 'next/server'
import { prisma } from '@mimisalon/shared'
import { geocodeAddress } from '@/lib/kakao-geocode'

/**
 * POST /api/admin/fix-addresses - 좌표가 없는 모든 주소를 일괄 업데이트 (개발용)
 * 이 엔드포인트는 개발 환경에서만 사용하세요
 */
export async function POST() {
  try {
    console.log('🔍 좌표가 없는 주소 수정 시작...\n')

    // 좌표가 없는 주소들 찾기
    const addressesWithoutCoords = await prisma.address.findMany({
      where: {
        OR: [{ centerLat: null }, { centerLng: null }],
      },
    })

    console.log(`📍 수정할 주소: ${addressesWithoutCoords.length}개\n`)

    if (addressesWithoutCoords.length === 0) {
      return NextResponse.json(
        {
          status: 'success',
          message: '좌표가 없는 주소가 없습니다',
          updated: 0,
          failed: 0,
        },
        { status: 200 }
      )
    }

    let successCount = 0
    let failCount = 0
    const results: Array<{
      id: string
      address: string
      status: 'success' | 'failed'
      lat?: number
      lng?: number
    }> = []

    for (const addr of addressesWithoutCoords) {
      // 주소 문자열 조합
      const fullAddress = [addr.street, addr.city, addr.state].filter(Boolean).join(' ')

      console.log(`📍 처리 중: ${fullAddress}`)

      const geocodeResult = await geocodeAddress(fullAddress)

      if (geocodeResult) {
        // 데이터베이스 업데이트
        await prisma.address.update({
          where: { id: addr.id },
          data: {
            centerLat: geocodeResult.latitude,
            centerLng: geocodeResult.longitude,
          },
        })

        console.log(
          `   ✅ 완료: (${geocodeResult.latitude.toFixed(4)}, ${geocodeResult.longitude.toFixed(4)})\n`
        )

        results.push({
          id: addr.id,
          address: fullAddress,
          status: 'success',
          lat: geocodeResult.latitude,
          lng: geocodeResult.longitude,
        })
        successCount++
      } else {
        console.log(`   ❌ 실패: 좌표를 찾을 수 없습니다\n`)

        results.push({
          id: addr.id,
          address: fullAddress,
          status: 'failed',
        })
        failCount++
      }

      // API 호출 제한 회피를 위해 딜레이
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`✅ 성공: ${successCount}개`)
    console.log(`❌ 실패: ${failCount}개`)
    console.log(`📊 성공율: ${((successCount / (successCount + failCount)) * 100).toFixed(1)}%`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    return NextResponse.json(
      {
        status: 'success',
        message: `${successCount}개 주소 수정 완료`,
        updated: successCount,
        failed: failCount,
        successRate: ((successCount / (successCount + failCount)) * 100).toFixed(1),
        results,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ 주소 수정 중 에러:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
