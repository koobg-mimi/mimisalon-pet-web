/**
 * Global Fetch Interceptor
 *
 * Monkey patches the native fetch API to automatically log all network errors.
 * This must be initialized once at app startup.
 *
 * @module lib/global-fetch-interceptor
 * @clientOnly
 */

'use client'

import { logNetworkError } from './client-logger'

// Store original fetch
let originalFetch: typeof fetch | null = null
let isInterceptorInstalled = false

/**
 * Convert Headers object to plain object
 */
const headersToObject = (headers: Headers): Record<string, string> => {
  const obj: Record<string, string> = {}
  headers.forEach((value, key) => {
    obj[key] = value
  })
  return obj
}

/**
 * Determine if response should be logged
 */
const shouldLogResponse = (response: Response): boolean => {
  // Log 4xx and 5xx errors
  return response.status >= 400
}

/**
 * Format error message based on response
 */
const formatErrorMessage = (response: Response): string => {
  const { status } = response

  if (status >= 500) {
    return `Server Error: ${response.statusText}`
  }

  if (status === 401) {
    return 'Unauthorized: Authentication required'
  }

  if (status === 403) {
    return 'Forbidden: Access denied'
  }

  if (status === 404) {
    return 'Not Found: Resource does not exist'
  }

  if (status === 429) {
    return 'Too Many Requests: Rate limit exceeded'
  }

  if (status >= 400) {
    return `Client Error: ${response.statusText}`
  }

  return response.statusText || 'Unknown error'
}

/**
 * Check if URL should be logged (filter out noisy endpoints)
 */
const shouldLogUrl = (url: string): boolean => {
  const noisyEndpoints = [
    '/api/health',
    '/api/logs', // Don't log the logging endpoint itself
    '/_next/',
    '/api/ping',
  ]

  return !noisyEndpoints.some((endpoint) => url.includes(endpoint))
}

/**
 * Parse request body to readable format
 */
async function parseRequestBody(body: BodyInit | null | undefined): Promise<any> {
  if (!body) return undefined

  try {
    if (typeof body === 'string') {
      // Try to parse as JSON if it looks like JSON
      if (body.trim().startsWith('{') || body.trim().startsWith('[')) {
        return JSON.parse(body)
      }
      return body
    }

    if (body instanceof FormData) {
      const formObject: Record<string, any> = {}
      body.forEach((value, key) => {
        formObject[key] = value instanceof File ? `[File: ${value.name}]` : value
      })
      return formObject
    }

    if (body instanceof URLSearchParams) {
      const params: Record<string, string> = {}
      body.forEach((value, key) => {
        params[key] = value
      })
      return params
    }

    if (body instanceof Blob) {
      return `[Blob: ${body.size} bytes, ${body.type || 'unknown type'}]`
    }

    if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
      return `[Binary data: ${body.byteLength || (body as any).buffer.byteLength} bytes]`
    }

    return '[Unknown body type]'
  } catch {
    return '[Unable to parse request body]'
  }
}

/**
 * Convert relative URL to absolute URL
 */
function getAbsoluteUrl(url: string): string {
  try {
    // If already absolute, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }

    // Convert relative to absolute using window.location
    if (typeof window !== 'undefined') {
      const absoluteUrl = new URL(url, window.location.origin)
      return absoluteUrl.toString()
    }

    return url
  } catch {
    return url
  }
}

/**
 * Enhanced fetch with automatic error logging
 */
async function interceptedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (!originalFetch) {
    throw new Error('Global fetch interceptor not initialized')
  }

  const startTime = performance.now()
  const relativeUrl =
    typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
  const absoluteUrl = getAbsoluteUrl(relativeUrl)
  const method = init?.method?.toUpperCase() || 'GET'

  // Check if we should log this URL
  if (!shouldLogUrl(relativeUrl)) {
    return originalFetch(input, init)
  }

  try {
    // Call original fetch
    const response = await originalFetch(input, init)
    const duration = performance.now() - startTime

    // Log error responses
    if (shouldLogResponse(response)) {
      // Clone response to read body without consuming original
      const clonedResponse = response.clone()
      let responseBody: any

      try {
        const contentType = clonedResponse.headers.get('content-type')
        if (contentType?.includes('application/json')) {
          responseBody = await clonedResponse.json()
        } else {
          responseBody = await clonedResponse.text()
        }
      } catch {
        responseBody = '[Unable to read response body]'
      }

      // Parse request body
      const parsedRequestBody = await parseRequestBody(init?.body)

      logNetworkError({
        url: absoluteUrl,
        method,
        statusCode: response.status,
        message: `[${response.status}] ${formatErrorMessage(response)}`,
        timestamp: new Date().toISOString(),
        requestHeaders: init?.headers ? headersToObject(new Headers(init.headers)) : undefined,
        responseHeaders: headersToObject(response.headers),
        requestBody: parsedRequestBody,
        responseBody,
        duration,
      })
    }

    return response
  } catch (error) {
    const duration = performance.now() - startTime

    // Log network errors (timeout, connection failed, etc.)
    const isTimeout = error instanceof Error && error.message.includes('timeout')
    const statusCode = isTimeout ? 408 : 0

    // Parse request body
    const parsedRequestBody = await parseRequestBody(init?.body)

    logNetworkError({
      url: absoluteUrl,
      method,
      statusCode,
      message: `[${statusCode}] ${error instanceof Error ? error.message : 'Network request failed'}`,
      timestamp: new Date().toISOString(),
      requestHeaders: init?.headers ? headersToObject(new Headers(init.headers)) : undefined,
      requestBody: parsedRequestBody,
      duration,
    })

    // Re-throw error to maintain fetch API behavior
    throw error
  }
}

/**
 * Install global fetch interceptor
 *
 * This replaces the native fetch with our intercepted version.
 * Should be called once at app startup.
 *
 * @example
 * ```typescript
 * // In app/layout.tsx or _app.tsx
 * import { installFetchInterceptor } from '@/lib/global-fetch-interceptor';
 *
 * useEffect(() => {
 *   installFetchInterceptor();
 * }, []);
 * ```
 */
export function installFetchInterceptor(): void {
  // Only install in browser environment
  if (typeof window === 'undefined') {
    console.warn('[FetchInterceptor] Cannot install in SSR environment')
    return
  }

  // Check if logging is enabled
  if (process.env.NEXT_PUBLIC_LOGGING_ENABLED === 'false') {
    console.log('[FetchInterceptor] Logging disabled, skipping installation')
    return
  }

  // Don't install twice
  if (isInterceptorInstalled) {
    console.warn('[FetchInterceptor] Already installed, skipping')
    return
  }

  // Store original fetch
  originalFetch = window.fetch

  // Replace with intercepted version
  window.fetch = interceptedFetch as typeof fetch

  isInterceptorInstalled = true
  console.log('[FetchInterceptor] ✅ Global fetch interceptor installed')
}

/**
 * Uninstall global fetch interceptor
 *
 * Restores the original native fetch function.
 * Useful for testing or cleanup.
 */
export function uninstallFetchInterceptor(): void {
  if (typeof window === 'undefined') {
    return
  }

  if (!isInterceptorInstalled || !originalFetch) {
    console.warn('[FetchInterceptor] Not installed, nothing to uninstall')
    return
  }

  // Restore original fetch
  window.fetch = originalFetch
  originalFetch = null
  isInterceptorInstalled = false

  console.log('[FetchInterceptor] ⚠️ Global fetch interceptor uninstalled')
}

/**
 * Check if interceptor is installed
 */
export function isFetchInterceptorInstalled(): boolean {
  return isInterceptorInstalled
}

/**
 * Get original fetch function (for testing)
 */
export function getOriginalFetch(): typeof fetch | null {
  return originalFetch
}
