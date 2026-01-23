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
    console.error('KAKAO_REST_API_KEY is not configured')
    return null
  }

  try {
    const encodedAddress = encodeURIComponent(address)
    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodedAddress}`

    console.log('Kakao API Request:', {
      url,
      apiKeyLength: apiKey.length,
      apiKeyPrefix: apiKey.substring(0, 8) + '...',
      address: address,
    })

    const response = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; MimiSalon/1.0)',
        KA: 'sdk/1.0.0 os/javascript origin/http://localhost:3001',
      },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Kakao geocoding API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      })

      // Provide more specific error information
      if (response.status === 401) {
        const errorData = JSON.parse(errorBody)
        if (errorData.message?.includes('domain mismatched')) {
          console.error(
            "Domain mismatch error. Please add localhost to your Kakao app's registered domains."
          )
        }
      } else if (response.status === 403) {
        const errorData = JSON.parse(errorBody)
        if (errorData.message?.includes('disabled OPEN_MAP_AND_LOCAL service')) {
          console.error(
            "Kakao Local API service is disabled. Enable 'Maps and Local' service in your Kakao app."
          )
        }
      }

      return null
    }

    const data: KakaoGeocodeResponse = await response.json()

    if (data.documents.length === 0) {
      console.warn('No geocoding results found for address:', address)
      return null
    }

    const result = data.documents[0]
    return {
      latitude: parseFloat(result.y),
      longitude: parseFloat(result.x),
      address: result.address_name,
    }
  } catch (error) {
    console.error('Error during geocoding:', error)
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
