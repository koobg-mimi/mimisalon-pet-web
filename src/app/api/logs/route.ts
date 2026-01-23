/**
 * Client Log Collection API
 *
 * Server endpoint for receiving client-side network error logs.
 * Implements rate limiting, validation, and Winston logging.
 *
 * @route POST /api/logs
 */

import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {logNetworkError} from '@/lib/logger';
import {type NetworkErrorLog, sanitizeLog, validateLog} from '@/lib/logger-utils';

// ============================================================================
// Rate Limiting
// ============================================================================

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 100; // 100 logs per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Check rate limit for client
 */
function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  let entry = rateLimitStore.get(identifier);

  // Clean expired entries
  if (entry && entry.resetTime < now) {
    entry = undefined;
    rateLimitStore.delete(identifier);
  }

  if (!entry) {
    entry = {count: 0, resetTime: now + RATE_LIMIT_WINDOW};
    rateLimitStore.set(identifier, entry);
  }

  const allowed = entry.count < RATE_LIMIT_MAX;
  if (allowed) {
    entry.count += 1;
  }

  return {
    allowed,
    remaining: Math.max(0, RATE_LIMIT_MAX - entry.count),
    resetTime: entry.resetTime,
  };
}

// ============================================================================
// Types
// ============================================================================

export interface LogBatchResponse {
  success: boolean;
  processed: number;
  skipped: number;
  message: string;
}

export interface LogRateLimitResponse {
  remaining: number;
  resetTime: number;
  limit: number;
}

export interface LogErrorResponse {
  success: false;
  error: string;
  details?: unknown;
  message?: string;
}

// ============================================================================
// Validation Schema
// ============================================================================

/**
 * Single log entry schema
 */
export const logEntrySchema = z.object({
  url: z.string().min(1),
  method: z.string().min(1),
  statusCode: z.number().int().optional(),
  message: z.string().min(1),
  timestamp: z.string().datetime(),
  requestHeaders: z.record(z.string(), z.unknown()).optional(),
  responseHeaders: z.record(z.string(), z.unknown()).optional(),
  requestBody: z.any().optional(),
  responseBody: z.any().optional(),
  duration: z.number().optional(),
  browser: z.string().optional(),
  userAgent: z.string().optional(),
  sessionId: z.string().optional(),
  userId: z.string().optional(),
  pathname: z.string().optional(),
  pageUrl: z.string().optional(),
  referrer: z.string().optional(),
});

/**
 * Batch request schema
 */
export const logBatchSchema = z.object({
  logs: z.array(logEntrySchema).min(1).max(50), // Max 50 logs per batch
});

export type LogBatchRequest = z.infer<typeof logBatchSchema>;

// ============================================================================
// API Handler
// ============================================================================

/**
 * POST /api/logs
 * Receive and process client-side error logs
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<LogBatchResponse | LogErrorResponse>> {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `logs:${clientIp}`;
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return NextResponse.json<LogErrorResponse>(
        {
          success: false,
          error: `Rate limit exceeded. Maximum ${RATE_LIMIT_MAX} logs per hour.`,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          },
        }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate request
    const validationResult = logBatchSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json<LogErrorResponse>(
        {
          success: false,
          error: 'Invalid log data',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const {logs} = validationResult.data;

    // Process each log entry
    let processedCount = 0;
    let skippedCount = 0;

    for (const log of logs) {
      // Validate log structure
      if (!validateLog(log as Partial<NetworkErrorLog>)) {
        skippedCount++;
        continue;
      }

      // Sanitize log (remove sensitive data)
      const sanitized = sanitizeLog(log as NetworkErrorLog);

      // Log to Winston
      logNetworkError({
        url: sanitized.url,
        method: sanitized.method,
        statusCode: sanitized.statusCode,
        message: sanitized.message,
        userId: sanitized.userId,
        sessionId: sanitized.sessionId,
        browser: sanitized.browser,
        userAgent: sanitized.userAgent,
        timestamp: sanitized.timestamp,
        pathname: sanitized.pathname,
        pageUrl: sanitized.pageUrl,
        referrer: sanitized.referrer,
        requestHeaders: sanitized.requestHeaders as Record<string, string> | undefined,
        responseHeaders: sanitized.responseHeaders as Record<string, string> | undefined,
        requestBody: sanitized.requestBody,
        responseBody: sanitized.responseBody,
        duration: sanitized.duration,
      });
      processedCount++;
    }

    // Success response
    return NextResponse.json<LogBatchResponse>(
      {
        success: true,
        processed: processedCount,
        skipped: skippedCount,
        message: `Successfully processed ${processedCount} log(s)`,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
        },
      }
    );
  } catch (error) {
    console.error('[LogAPI] Failed to process logs:', error);

    return NextResponse.json<LogErrorResponse>(
      {
        success: false,
        error: 'Failed to process logs',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/logs
 * Get rate limit info for current client
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<LogRateLimitResponse | LogErrorResponse>> {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `logs:${clientIp}`;
    const rateLimit = checkRateLimit(rateLimitKey);

    return NextResponse.json<LogRateLimitResponse>({
      remaining: rateLimit.remaining,
      resetTime: rateLimit.resetTime,
      limit: RATE_LIMIT_MAX,
    });
  } catch (error) {
    console.error('[LogAPI] Failed to get rate limit info:', error);

    return NextResponse.json<LogErrorResponse>(
      {
        success: false,
        error: 'Failed to get rate limit info',
      },
      { status: 500 }
    );
  }
}
