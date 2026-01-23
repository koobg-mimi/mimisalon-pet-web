/**
 * Logger Utility Functions
 *
 * Helper functions for formatting, sanitizing, and processing logs.
 * Includes privacy protection and data masking utilities.
 *
 * @module lib/logger-utils
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Network error log entry structure
 */
export interface NetworkErrorLog {
  url: string
  method: string
  statusCode?: number
  message: string
  userId?: string
  sessionId?: string
  browser?: string
  userAgent?: string
  timestamp: string
  pathname?: string
  pageUrl?: string
  referrer?: string
  requestHeaders?: Record<string, string>
  responseHeaders?: Record<string, string>
  requestBody?: any
  responseBody?: any
  duration?: number
  [key: string]: any
}

/**
 * Sanitized log entry (privacy protected)
 */
export interface SanitizedLog extends Omit<NetworkErrorLog, 'requestHeaders' | 'responseHeaders'> {
  requestHeaders?: Record<string, string>
  responseHeaders?: Record<string, string>
}

// ============================================================================
// Privacy & Security
// ============================================================================

/**
 * Sensitive header names to exclude from logs
 */
const SENSITIVE_HEADERS = [
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'x-auth-token',
  'proxy-authorization',
]

/**
 * Patterns for sensitive data to mask
 */
const SENSITIVE_PATTERNS = {
  email: /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
  phone: /(\d{3})[-.\s]?(\d{3,4})[-.\s]?(\d{4})/g,
  creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  password: /"password"\s*:\s*"[^"]*"/gi,
  token: /"token"\s*:\s*"[^"]*"/gi,
}

/**
 * Mask email address
 * Example: user@example.com -> u***@example.com
 */
export const maskEmail = (email: string): string => {
  return email.replace(SENSITIVE_PATTERNS.email, (match, username, domain) => {
    if (username.length <= 2) return `${username[0]}***@${domain}`
    return `${username[0]}***${username[username.length - 1]}@${domain}`
  })
}

/**
 * Mask phone number
 * Example: 010-1234-5678 -> 010-****-5678
 */
export const maskPhone = (phone: string): string => {
  return phone.replace(SENSITIVE_PATTERNS.phone, (match, p1, p2, p3) => {
    return `${p1}-****-${p3}`
  })
}

/**
 * Mask user ID
 * Example: user-12345 -> user-***45
 */
export const maskUserId = (userId: string | undefined): string | undefined => {
  if (!userId) return undefined
  if (userId.length <= 5) return '***'
  return `${userId.substring(0, userId.length - 5)}***${userId.substring(userId.length - 2)}`
}

/**
 * Remove sensitive headers from header object
 */
export const sanitizeHeaders = (
  headers?: Record<string, string>
): Record<string, string> | undefined => {
  if (!headers) return undefined

  const sanitized: Record<string, string> = {}

  for (const [key, value] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase()

    // Skip sensitive headers
    if (SENSITIVE_HEADERS.includes(lowerKey)) {
      sanitized[key] = '[REDACTED]'
      continue
    }

    sanitized[key] = value
  }

  return sanitized
}

/**
 * Mask sensitive data in body
 */
export const sanitizeBody = (body: any): any => {
  if (!body) return undefined

  // If body is string, try to parse as JSON
  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body)
      return sanitizeBody(parsed)
    } catch {
      // Not JSON, mask patterns in string
      let sanitized = body
      for (const [key, pattern] of Object.entries(SENSITIVE_PATTERNS)) {
        sanitized = sanitized.replace(pattern, `[MASKED_${key.toUpperCase()}]`)
      }
      return sanitized
    }
  }

  // If body is object, recursively sanitize
  if (typeof body === 'object' && body !== null) {
    const sanitized: any = Array.isArray(body) ? [] : {}

    for (const [key, value] of Object.entries(body)) {
      const lowerKey = key.toLowerCase()

      // Mask password fields
      if (
        lowerKey.includes('password') ||
        lowerKey.includes('secret') ||
        lowerKey.includes('token')
      ) {
        sanitized[key] = '[REDACTED]'
        continue
      }

      // Recursively sanitize nested objects
      if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeBody(value)
      } else if (typeof value === 'string') {
        // Mask sensitive patterns
        let maskedValue = value
        if (SENSITIVE_PATTERNS.email.test(value)) {
          maskedValue = maskEmail(value)
        }
        if (SENSITIVE_PATTERNS.phone.test(value)) {
          maskedValue = maskPhone(value)
        }
        sanitized[key] = maskedValue
      } else {
        sanitized[key] = value
      }
    }

    return sanitized
  }

  return body
}

/**
 * Sanitize complete log entry
 */
export const sanitizeLog = (log: NetworkErrorLog): SanitizedLog => {
  return {
    ...log,
    userId: maskUserId(log.userId),
    requestHeaders: sanitizeHeaders(log.requestHeaders),
    responseHeaders: sanitizeHeaders(log.responseHeaders),
    requestBody: sanitizeBody(log.requestBody),
    responseBody: sanitizeBody(log.responseBody),
  }
}

// ============================================================================
// Log Formatting
// ============================================================================

/**
 * Format error message based on status code
 */
export const formatErrorMessage = (statusCode?: number, originalMessage?: string): string => {
  if (!statusCode) {
    return originalMessage || 'Network error occurred'
  }

  // Client errors (4xx)
  if (statusCode >= 400 && statusCode < 500) {
    switch (statusCode) {
      case 400:
        return 'Bad Request - Invalid request data'
      case 401:
        return 'Unauthorized - Authentication required'
      case 403:
        return 'Forbidden - Access denied'
      case 404:
        return 'Not Found - Resource does not exist'
      case 408:
        return 'Request Timeout - Request took too long'
      case 429:
        return 'Too Many Requests - Rate limit exceeded'
      default:
        return originalMessage || `Client error (${statusCode})`
    }
  }

  // Server errors (5xx)
  if (statusCode >= 500) {
    switch (statusCode) {
      case 500:
        return 'Internal Server Error - Server encountered an error'
      case 502:
        return 'Bad Gateway - Invalid response from upstream server'
      case 503:
        return 'Service Unavailable - Server is temporarily unavailable'
      case 504:
        return 'Gateway Timeout - Upstream server timeout'
      default:
        return originalMessage || `Server error (${statusCode})`
    }
  }

  return originalMessage || `HTTP error (${statusCode})`
}

/**
 * Determine error severity level
 */
export const getErrorSeverity = (statusCode?: number): 'critical' | 'high' | 'medium' | 'low' => {
  if (!statusCode) return 'high'

  // Network/timeout errors
  if (statusCode === 0) return 'critical'

  // Server errors
  if (statusCode >= 500) return 'critical'

  // Authentication errors
  if (statusCode === 401 || statusCode === 403) return 'high'

  // Client errors
  if (statusCode >= 400 && statusCode < 500) return 'medium'

  return 'low'
}

/**
 * Extract browser info from user agent
 */
export const extractBrowserInfo = (userAgent: string): string => {
  // Chrome
  if (userAgent.includes('Chrome')) {
    const match = userAgent.match(/Chrome\/(\d+)/)
    return match ? `Chrome ${match[1]}` : 'Chrome'
  }

  // Firefox
  if (userAgent.includes('Firefox')) {
    const match = userAgent.match(/Firefox\/(\d+)/)
    return match ? `Firefox ${match[1]}` : 'Firefox'
  }

  // Safari
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    const match = userAgent.match(/Version\/(\d+)/)
    return match ? `Safari ${match[1]}` : 'Safari'
  }

  // Edge
  if (userAgent.includes('Edg')) {
    const match = userAgent.match(/Edg\/(\d+)/)
    return match ? `Edge ${match[1]}` : 'Edge'
  }

  return 'Unknown Browser'
}

// ============================================================================
// Log Validation
// ============================================================================

/**
 * Validate log entry structure
 */
export const validateLog = (log: Partial<NetworkErrorLog>): boolean => {
  // Required fields
  if (!log.url || !log.method || !log.message || !log.timestamp) {
    return false
  }

  // Valid HTTP method
  const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
  if (!validMethods.includes(log.method.toUpperCase())) {
    return false
  }

  // Valid timestamp
  if (isNaN(Date.parse(log.timestamp))) {
    return false
  }

  return true
}

/**
 * Check if error should be logged (filter out noise)
 */
export const shouldLogError = (statusCode?: number, url?: string): boolean => {
  // Always log server errors
  if (statusCode && statusCode >= 500) return true

  // Always log authentication errors
  if (statusCode === 401 || statusCode === 403) return true

  // Filter out known noisy endpoints
  const noisyEndpoints = ['/api/health', '/api/ping', '/_next/']
  if (url && noisyEndpoints.some((endpoint) => url.includes(endpoint))) {
    return false
  }

  // Filter out successful requests
  if (statusCode && statusCode >= 200 && statusCode < 400) return false

  return true
}

// ============================================================================
// Export
// ============================================================================

export default {
  maskEmail,
  maskPhone,
  maskUserId,
  sanitizeHeaders,
  sanitizeBody,
  sanitizeLog,
  formatErrorMessage,
  getErrorSeverity,
  extractBrowserInfo,
  validateLog,
  shouldLogError,
}
