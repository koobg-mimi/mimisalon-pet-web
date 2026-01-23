/**
 * Fetch API Wrapper with Automatic Error Logging
 *
 * Drop-in replacement for native fetch() that automatically logs network errors.
 * Maintains full compatibility with standard fetch API.
 *
 * @module lib/fetch-wrapper
 * @clientOnly
 */

'use client';

import { logNetworkError } from './client-logger';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Fetch options with optional logging configuration
 */
export interface FetchWrapperOptions extends RequestInit {
  /**
   * Disable automatic error logging for this request
   */
  skipLogging?: boolean;

  /**
   * Request timeout in milliseconds
   */
  timeout?: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert Headers object to plain object
 */
const headersToObject = (headers: Headers): Record<string, string> => {
  const obj: Record<string, string> = {};
  headers.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
};

/**
 * Extract HTTP method from options
 */
const getMethod = (options?: FetchWrapperOptions): string => {
  return options?.method?.toUpperCase() || 'GET';
};

/**
 * Determine if response should be logged as error
 */
const shouldLogResponse = (response: Response): boolean => {
  // Log 4xx and 5xx errors
  return response.status >= 400;
};

/**
 * Format error message based on response
 */
const formatErrorMessage = (response: Response): string => {
  const { status } = response;

  if (status >= 500) {
    return `Server Error: ${response.statusText}`;
  }

  if (status === 401) {
    return 'Unauthorized: Authentication required';
  }

  if (status === 403) {
    return 'Forbidden: Access denied';
  }

  if (status === 404) {
    return 'Not Found: Resource does not exist';
  }

  if (status === 429) {
    return 'Too Many Requests: Rate limit exceeded';
  }

  if (status >= 400) {
    return `Client Error: ${response.statusText}`;
  }

  return response.statusText || 'Unknown error';
};

/**
 * Create timeout promise
 */
const createTimeoutPromise = (timeoutMs: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });
};

// ============================================================================
// Main Fetch Wrapper
// ============================================================================

/**
 * Enhanced fetch with automatic error logging
 *
 * @example
 * ```typescript
 * // Same as native fetch
 * const response = await fetchWithLogging('/api/users');
 *
 * // With options
 * const response = await fetchWithLogging('/api/users', {
 *   method: 'POST',
 *   body: JSON.stringify(data),
 *   timeout: 5000, // Optional timeout
 * });
 *
 * // Skip logging for specific request
 * const response = await fetchWithLogging('/api/internal', {
 *   skipLogging: true,
 * });
 * ```
 */
export async function fetchWithLogging(
  input: RequestInfo | URL,
  options?: FetchWrapperOptions
): Promise<Response> {
  const startTime = performance.now();
  const url =
    typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  const method = getMethod(options);
  const skipLogging = options?.skipLogging || false;
  const timeout = options?.timeout;

  // Remove custom options before passing to native fetch
  const { skipLogging: _, timeout: __, ...fetchOptions } = options || {};

  try {
    // Create fetch promise
    const fetchPromise = fetch(input, fetchOptions);

    // Add timeout if specified
    const response = timeout
      ? await Promise.race([fetchPromise, createTimeoutPromise(timeout)])
      : await fetchPromise;

    const duration = performance.now() - startTime;

    // Log error responses
    if (!skipLogging && shouldLogResponse(response)) {
      // Clone response to read body without consuming original
      const clonedResponse = response.clone();
      let responseBody: any;

      try {
        const contentType = clonedResponse.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          responseBody = await clonedResponse.json();
        } else {
          responseBody = await clonedResponse.text();
        }
      } catch {
        responseBody = '[Unable to read response body]';
      }

      logNetworkError({
        url,
        method,
        statusCode: response.status,
        message: formatErrorMessage(response),
        timestamp: new Date().toISOString(),
        requestHeaders: fetchOptions.headers
          ? headersToObject(new Headers(fetchOptions.headers))
          : undefined,
        responseHeaders: headersToObject(response.headers),
        requestBody: fetchOptions.body,
        responseBody,
        duration,
      });
    }

    return response;
  } catch (error) {
    const duration = performance.now() - startTime;

    // Log network errors (timeout, connection failed, etc.)
    if (!skipLogging) {
      const isTimeout = error instanceof Error && error.message.includes('timeout');
      const statusCode = isTimeout ? 408 : 0;

      logNetworkError({
        url,
        method,
        statusCode,
        message: error instanceof Error ? error.message : 'Network request failed',
        timestamp: new Date().toISOString(),
        requestHeaders: fetchOptions.headers
          ? headersToObject(new Headers(fetchOptions.headers))
          : undefined,
        requestBody: fetchOptions.body,
        duration,
      });
    }

    // Re-throw error to maintain fetch API behavior
    throw error;
  }
}

// ============================================================================
// Convenience Methods
// ============================================================================

/**
 * GET request with logging
 */
export const get = (
  url: string,
  options?: Omit<FetchWrapperOptions, 'method'>
): Promise<Response> => {
  return fetchWithLogging(url, { ...options, method: 'GET' });
};

/**
 * POST request with logging
 */
export const post = (
  url: string,
  data?: any,
  options?: Omit<FetchWrapperOptions, 'method' | 'body'>
): Promise<Response> => {
  return fetchWithLogging(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PUT request with logging
 */
export const put = (
  url: string,
  data?: any,
  options?: Omit<FetchWrapperOptions, 'method' | 'body'>
): Promise<Response> => {
  return fetchWithLogging(url, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PATCH request with logging
 */
export const patch = (
  url: string,
  data?: any,
  options?: Omit<FetchWrapperOptions, 'method' | 'body'>
): Promise<Response> => {
  return fetchWithLogging(url, {
    ...options,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * DELETE request with logging
 */
export const del = (
  url: string,
  options?: Omit<FetchWrapperOptions, 'method'>
): Promise<Response> => {
  return fetchWithLogging(url, { ...options, method: 'DELETE' });
};

// ============================================================================
// Export
// ============================================================================

export default fetchWithLogging;
