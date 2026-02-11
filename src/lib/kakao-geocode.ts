interface KakaoGeocodeResponse {
  documents: Array<{
    x: string // longitude
    y: string // latitude
    address_name: string
    address_type: string
  }>
  meta: {
    total_count: number
    pageable_count: number
    is_end: boolean
  }
}

interface GeocodeResult {
  latitude: number
  longitude: number
  address: string
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const apiKey = process.env.KAKAO_REST_API_KEY

  if (!apiKey) {
    console.error('❌ KAKAO_REST_API_KEY is not configured')
    return null
  }

  try {
    const encodedAddress = encodeURIComponent(address)
    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodedAddress}`

    console.log('📍 [Kakao API] Geocoding request:', address)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
    })

    console.log(`📡 [Kakao API] Response: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`❌ [Kakao API] Error ${response.status}:`, errorBody)
      return null
    }

    const data: KakaoGeocodeResponse = await response.json()

    if (!data.documents || data.documents.length === 0) {
      console.warn(`⚠️ [Kakao API] No results found for: ${address}`)
      return null
    }

    const result = data.documents[0]
    const geocodeResult = {
      latitude: parseFloat(result.y),
      longitude: parseFloat(result.x),
      address: result.address_name,
    }

    console.log('✅ [Kakao API] Success:', {
      address: result.address_name,
      lat: geocodeResult.latitude,
      lng: geocodeResult.longitude,
    })

    return geocodeResult
  } catch (error) {
    console.error('❌ [Kakao API] Exception:', error instanceof Error ? error.message : error)
    return null
  }
}

export async function geocodePostalCode(postalCode: string): Promise<GeocodeResult | null> {
  return geocodeAddress(postalCode)
}

// Test function to verify API key
export async function testKakaoApiKey(): Promise<boolean> {
  const apiKey = process.env.KAKAO_REST_API_KEY

  if (!apiKey) {
    console.error('KAKAO_REST_API_KEY is not configured')
    return false
  }

  try {
    // Test with a simple address query
    const response = await fetch(
      'https://dapi.kakao.com/v2/local/search/address.json?query=서울특별시 중구 을지로',
      {
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
          'User-Agent': 'Mozilla/5.0 (compatible; MimiSalon/1.0)',
          KA: 'sdk/1.0.0 os/javascript origin/http://localhost:3001',
        },
      }
    )

    console.log('API Key Test Result:', {
      status: response.status,
      statusText: response.statusText,
      isOk: response.ok,
    })

    return response.ok
  } catch (error) {
    console.error('API Key test failed:', error)
    return false
  }
}
