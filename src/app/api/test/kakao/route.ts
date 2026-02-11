import { NextResponse } from 'next/server'
import { testKakaoApiKey, geocodeAddress } from '@/lib/kakao-geocode'

// GET /api/test/kakao - Test Kakao API
export async function GET() {
  try {
    console.log('🧪 Testing Kakao API configuration...')

    // Test API key
    const apiKeyAvailable = await testKakaoApiKey()

    console.log('API Key Test Result:', { apiKeyAvailable })

    if (!apiKeyAvailable) {
      return NextResponse.json(
        {
          status: 'FAILED',
          message: 'Kakao API key test failed',
          error: 'API key is not configured or invalid',
        },
        { status: 400 }
      )
    }

    // Test with a known address
    const testAddress = '서울특별시 강남구 테헤란로 1'
    console.log(`🔍 Testing geocoding with address: ${testAddress}`)

    const result = await geocodeAddress(testAddress)

    if (!result) {
      return NextResponse.json(
        {
          status: 'PARTIAL',
          message: 'API key is valid but geocoding test failed',
          apiKeyValid: true,
          geocodingTest: false,
        },
        { status: 400 }
      )
    }

    console.log('✅ Kakao API test successful:', result)

    return NextResponse.json({
      status: 'SUCCESS',
      message: 'Kakao API is working correctly',
      apiKeyValid: true,
      geocodingTest: true,
      testResult: result,
    })
  } catch (error) {
    console.error('Kakao API test error:', error)
    return NextResponse.json(
      {
        status: 'ERROR',
        message: 'Kakao API test failed with exception',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
