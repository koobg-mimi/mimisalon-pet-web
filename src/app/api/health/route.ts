import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

// ============================================================================
// Types
// ============================================================================

export interface HealthResponse {
  status: string | number;
  timestamp: string;
  service?: string;
  version?: string;
  environment?: string;
  uptime?: number;
  error?: string;
}

/**
 * Health check endpoint for Cloud Run health probes
 * Used by Terraform-configured readiness and liveness probes
 */
export async function GET(): Promise<NextResponse<HealthResponse>> {
  try {
    const healthStatus: HealthResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'mimisalon-nextjs',
      version: env.npm_package_version,
      environment: env.NODE_ENV,
      uptime: process.uptime(),
    };

    return NextResponse.json(healthStatus, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 500 }
    );
  }
}

// Support HEAD requests for basic connectivity checks
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
