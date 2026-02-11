/**
 * Kakao Maps API 초기화 및 연동 확인
 */

export async function initializeKakaoAPI() {
  const apiKey = process.env.KAKAO_REST_API_KEY
  const jsKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY

  console.log('\n🗺️  [Kakao Maps API] 초기화 시작')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // API Key 확인
  if (!apiKey) {
    console.error('❌ KAKAO_REST_API_KEY가 설정되지 않았습니다')
    return false
  }

  if (!jsKey) {
    console.error('❌ NEXT_PUBLIC_KAKAO_MAP_KEY가 설정되지 않았습니다')
    return false
  }

  console.log(`✅ REST API Key: ${apiKey.substring(0, 8)}...`)
  console.log(`✅ JavaScript Key: ${jsKey.substring(0, 8)}...`)

  // Kakao API 연동 테스트
  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=강남구`,
      {
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      }
    )

    if (response.ok) {
      const data = await response.json()
      if (data.documents && data.documents.length > 0) {
        console.log('✅ 지오코딩 테스트: 성공')
        console.log('   → 주소 검색 및 좌표 변환 정상 작동\n')
        return true
      } else {
        console.warn('⚠️  지오코딩 테스트: 결과 없음')
        console.log('   → Kakao 콘솔에서 서비스 활성화를 확인하세요\n')
        return false
      }
    } else {
      console.error(`❌ API 응답 오류: ${response.status}`)
      return false
    }
  } catch (error) {
    console.error(`❌ 초기화 실패: ${error instanceof Error ? error.message : error}`)
    return false
  }
}
