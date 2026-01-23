import { useQuery } from '@tanstack/react-query'

export interface PublicEnvConfig {
  NEXT_PUBLIC_PORTONE_STORE_ID: string
  NEXT_PUBLIC_PORTONE_CHANNEL_KEY: string
  NEXT_PUBLIC_KAKAO_MAP_KEY?: string
  NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE?: string
}

/**
 * Fetch public environment variables from the server
 */
async function fetchPublicEnv(): Promise<PublicEnvConfig> {
  const response = await fetch('/api/env')

  if (!response.ok) {
    throw new Error('Failed to fetch environment configuration')
  }

  return response.json()
}

/**
 * React Query hook to fetch and cache public environment variables
 */
export function usePublicEnv() {
  return useQuery({
    queryKey: ['public-env'],
    queryFn: fetchPublicEnv,
    staleTime: Infinity, // Environment variables don't change during runtime
    gcTime: Infinity, // Keep in cache forever (previously cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
