import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'
import auth from '@/lib/auth'
import { createIssueWithAttachments, testJiraConnection } from '@/lib/jira'
import {
  errorReportServerSchema,
  validateImages,
  ErrorReportApiResponse,
  ErrorReportApiError,
} from '@/lib/validations/error-report'
import { ErrorReport } from '@/types/error-report'

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_MAX = 5 // 5 reports per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds

function checkRateLimit(identifier: string): {
  allowed: boolean
  remaining: number
  resetTime: number
} {
  const now = Date.now()
  const key = identifier
  const windowStart = now - RATE_LIMIT_WINDOW

  let entry = rateLimitStore.get(key)

  // Clean expired entries
  if (entry && entry.resetTime < now) {
    entry = undefined
    rateLimitStore.delete(key)
  }

  if (!entry) {
    entry = { count: 0, resetTime: now + RATE_LIMIT_WINDOW }
    rateLimitStore.set(key, entry)
  }

  const allowed = entry.count < RATE_LIMIT_MAX
  if (allowed) {
    entry.count += 1
  }

  return {
    allowed,
    remaining: Math.max(0, RATE_LIMIT_MAX - entry.count),
    resetTime: entry.resetTime,
  }
}

/**
 * Parse FormData to extract form fields and files
 */
async function parseFormData(request: NextRequest): Promise<{
  formData: any
  images: File[]
}> {
  const formData = await request.formData()

  // Extract text fields
  const textData: any = {}
  const images: File[] = []

  for (const [key, value] of formData.entries()) {
    if (key === 'images') {
      if (value instanceof File) {
        images.push(value)
      }
    } else if (typeof value === 'string') {
      textData[key] = value
    }
  }

  return { formData: textData, images }
}

// ============================================================================
// Route Handlers
// ============================================================================

/**
 * POST /api/error-report
 * Handle error report submission
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ErrorReportApiResponse | ErrorReportApiError>> {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id || 'anonymous'
    const userName = session?.user?.name || session?.user?.email

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitKey = session ? `user:${userId}` : `ip:${clientIp}`
    const rateLimit = checkRateLimit(rateLimitKey)

    if (!rateLimit.allowed) {
      const response: ErrorReportApiError = {
        success: false,
        error: `요청 한도를 초과했습니다. 시간당 최대 ${RATE_LIMIT_MAX}개의 신고만 가능합니다.`,
      }

      return NextResponse.json(response, {
        status: 429,
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
        },
      })
    }

    // Check if Jira is configured and accessible
    const isJiraReady = await testJiraConnection()
    if (!isJiraReady) {
      const response: ErrorReportApiError = {
        success: false,
        error: 'Jira 연결에 실패했습니다. 관리자에게 문의해주세요.',
      }
      return NextResponse.json(response, { status: 500 })
    }

    // Parse FormData
    const { formData: rawData, images } = await parseFormData(request)

    // Validate images
    const imageValidation = validateImages(images)
    if (imageValidation.errors.length > 0) {
      const response: ErrorReportApiError = {
        success: false,
        error: '이미지 파일에 문제가 있습니다',
        details: imageValidation.errors.map((error) => ({
          field: 'images',
          message: error,
        })),
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Prepare server validation data
    const serverData = {
      ...rawData,
      hasImages: imageValidation.valid.length > 0,
      imageCount: imageValidation.valid.length,
      userId: userId,
      userName: userName,
    }

    // Validate form data
    const validationResult = errorReportServerSchema.safeParse(serverData)
    if (!validationResult.success) {
      const response: ErrorReportApiError = {
        success: false,
        error: '입력 데이터가 유효하지 않습니다',
        details: validationResult.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      }
      return NextResponse.json(response, { status: 400 })
    }

    const validData = validationResult.data

    // Create simplified ErrorReport object
    const errorReport: ErrorReport = {
      description: validData.description,
      images: imageValidation.valid,
      metadata: {
        browser: validData.browserInfo,
        timestamp: validData.timestamp,
        userId: validData.userId,
        userName: validData.userName,
        url: validData.url,
      },
    }

    // Create Jira issue with attachments
    const result = await createIssueWithAttachments(errorReport)

    // Success response
    const response: ErrorReportApiResponse = {
      success: true,
      issue: result.issue,
      attachmentIds: result.attachmentIds,
      message: '에러 신고가 성공적으로 접수되었습니다.',
    }

    return NextResponse.json(response, {
      status: 201,
      headers: {
        'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': rateLimit.resetTime.toString(),
      },
    })
  } catch (error) {
    console.error('Error report submission failed:', error)

    let errorMessage = '에러 신고 처리 중 문제가 발생했습니다'
    let statusCode = 500

    if (error instanceof z.ZodError) {
      errorMessage = '입력 데이터 형식이 올바르지 않습니다'
      statusCode = 400
    } else if (error instanceof Error) {
      // Don't expose internal error messages to users
      console.error('Internal error:', error.message)

      // But provide more specific messages for known error types
      if (error.message.includes('Jira')) {
        errorMessage = 'Jira 서비스에 연결할 수 없습니다'
      } else if (error.message.includes('attachment')) {
        errorMessage = '이미지 업로드 중 오류가 발생했습니다'
      } else if (error.message.includes('rate limit')) {
        errorMessage = '너무 많은 요청입니다. 잠시 후 다시 시도해주세요'
        statusCode = 429
      }
    }

    const response: ErrorReportApiError = {
      success: false,
      error: errorMessage,
    }

    return NextResponse.json(response, { status: statusCode })
  }
}

export interface ErrorReportRateLimitResponse {
  remaining: number
  resetTime: number
  limit: number
}

/**
 * GET /api/error-report
 * Get rate limit info for current user/IP
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ErrorReportRateLimitResponse | { error: string }>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitKey = session ? `user:${userId}` : `ip:${clientIp}`

    const rateLimit = checkRateLimit(rateLimitKey)

    return NextResponse.json({
      remaining: rateLimit.remaining,
      resetTime: rateLimit.resetTime,
      limit: RATE_LIMIT_MAX,
    })
  } catch (error) {
    console.error('Failed to get rate limit info:', error)
    return NextResponse.json({ error: 'Failed to get rate limit info' }, { status: 500 })
  }
}
