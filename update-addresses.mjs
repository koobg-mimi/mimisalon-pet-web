#!/usr/bin/env node

/**
 * 기존 주소들의 좌표를 카카오 API로 일괄 업데이트
 * 좌표가 없는 모든 주소를 찾아서 지오코딩 처리
 */

import { PrismaClient } from '@prisma/client'

const apiKey = '358d353cd6f82807b3e9ffa78759d86c'
const prisma = new PrismaClient()

interface GeocodeResult {
  latitude: number
  longitude: number
  address: string
}

async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  try {
    const encodedAddress = encodeURIComponent(address)
    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodedAddress}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
    })

    if (!response.ok) {
      console.error(`❌ API Error ${response.status} for: ${address}`)
      return null
    }

    const data = await response.json()

    if (!data.documents || data.documents.length === 0) {
      console.warn(`⚠️ No results for: ${address}`)
      return null
    }

    const result = data.documents[0]
    return {
      latitude: parseFloat(result.y),
      longitude: parseFloat(result.x),
      address: result.address_name,
    }
  } catch (error) {
    console.error(`❌ Error geocoding ${address}:`, error instanceof Error ? error.message : error)
    return null
  }
}

async function updateAddresses() {
  console.log('🔍 주소 좌표 업데이트 시작\n')

  try {
    // 좌표가 없는 주소들 찾기
    const addressesWithoutCoords = await prisma.address.findMany({
      where: {
        OR: [{ centerLat: null }, { centerLng: null }],
      },
    })

    console.log(`📍 업데이트할 주소: ${addressesWithoutCoords.length}개\n`)

    if (addressesWithoutCoords.length === 0) {
      console.log('✅ 좌표가 없는 주소가 없습니다!')
      return
    }

    let successCount = 0
    let failCount = 0

    for (const addr of addressesWithoutCoords) {
      // 주소 문자열 조합
      const fullAddress = [addr.street, addr.city, addr.state].filter(Boolean).join(' ')

      console.log(`📍 처리 중: ${fullAddress} (${addr.id})`)

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

        console.log(`   ✅ 완료: (${geocodeResult.latitude.toFixed(4)}, ${geocodeResult.longitude.toFixed(4)})\n`)
        successCount++
      } else {
        console.log(`   ❌ 실패\n`)
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

    console.log('이제 미용사 검색이 정상 작동합니다! 🎉')
  } catch (error) {
    console.error('❌ 업데이트 중 에러:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateAddresses()
