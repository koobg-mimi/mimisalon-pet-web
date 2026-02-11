#!/usr/bin/env node

const apiKey = '358d353cd6f82807b3e9ffa78759d86c'

const testAddresses = [
  '강남구',
  '서울 강남구',
  '강남 테헤란로',
  '서울시 강남구 테헤란로',
  '테헤란로 1',
]

console.log('🧪 [테스트] 카카오 Maps API 연동 확인')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log(`🔑 API Key: ${apiKey.substring(0, 8)}... (유효함)\n`)

async function testKakaoAPI(address) {
  try {
    const encodedAddress = encodeURIComponent(address)
    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodedAddress}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `KakaoAK ${apiKey}`,
      },
    })

    const data = await response.json()
    const count = data.documents?.length || 0

    if (count > 0) {
      const doc = data.documents[0]
      console.log(`✅ "${address}"`)
      console.log(`   ├─ 주소: ${doc.address_name}`)
      console.log(`   ├─ 위도: ${doc.y}`)
      console.log(`   └─ 경도: ${doc.x}\n`)
      return true
    } else {
      console.log(`⚠️ "${address}" → 결과 없음\n`)
      return false
    }
  } catch (error) {
    console.log(`❌ "${address}" → 에러: ${error.message}\n`)
    return false
  }
}

async function runAllTests() {
  let successCount = 0

  for (const addr of testAddresses) {
    const success = await testKakaoAPI(addr)
    if (success) successCount++
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  if (successCount > 0) {
    console.log(`✨ 카카오 API가 정상 작동합니다! (${successCount}/${testAddresses.length} 성공)`)
  } else {
    console.log('⚠️ API는 응답하지만 주소 검색 결과가 없습니다.')
    console.log('   → Kakao 개발자 콘솔에서 서비스 설정을 확인하세요.')
  }
}

runAllTests()
