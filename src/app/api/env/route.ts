import { NextResponse } from 'next/server';
import { env as envConfig } from '@/lib/env';

// ============================================================================
// Types
// ============================================================================

export interface PublicEnvResponse {
  NEXT_PUBLIC_PORTONE_STORE_ID: string | undefined;
  NEXT_PUBLIC_PORTONE_CHANNEL_KEY: string | undefined;
  NEXT_PUBLIC_KAKAO_MAP_KEY: string;
  NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE: string;
}

// ============================================================================
// Route Handler
// ============================================================================

/**
 * GET /api/env
 *
 * Public environment variables endpoint.
 * Returns non-sensitive configuration values that are safe to expose to the client.
 * These values are injected at runtime by Cloud Run from Secret Manager.
 */
export async function GET(): Promise<NextResponse<PublicEnvResponse>> {
  // Return public environment variables that client needs
  const env: PublicEnvResponse = {
    // PortOne configuration (required for payments)
    NEXT_PUBLIC_PORTONE_STORE_ID: envConfig.NEXT_PUBLIC_PORTONE_STORE_ID,
    NEXT_PUBLIC_PORTONE_CHANNEL_KEY: envConfig.NEXT_PUBLIC_PORTONE_CHANNEL_KEY,

    // Optional configuration
    NEXT_PUBLIC_KAKAO_MAP_KEY: envConfig.NEXT_PUBLIC_KAKAO_MAP_KEY || '',

    NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE: envConfig.NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE,
  };

  // Log for debugging in Cloud Run
  if (!env.NEXT_PUBLIC_PORTONE_STORE_ID || !env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY) {
    console.warn('[/api/env] Missing PortOne configuration:', {
      hasStoreId: !!env.NEXT_PUBLIC_PORTONE_STORE_ID,
      hasChannelKey: !!env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY,
    });
  }

  return NextResponse.json<PublicEnvResponse>(env);
}
