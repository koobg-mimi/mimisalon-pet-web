/**
 * Client-Side Logger
 *
 * Browser-side logger that collects network errors and sends them to the server.
 * Implements batching, debouncing, and error retry logic.
 *
 * @module lib/client-logger
 * @clientOnly
 */

'use client';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Network error details collected by client
 */
export interface ClientNetworkError {
  url: string;
  method: string;
  statusCode?: number;
  message: string;
  timestamp: string;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: any;
  responseBody?: any;
  duration?: number;
}

/**
 * Enriched error log with browser context
 */
interface EnrichedError extends ClientNetworkError {
  browser: string;
  userAgent: string;
  sessionId: string;
  userId?: string;
  pathname: string;
  pageUrl: string;
  referrer: string;
}

// ============================================================================
// Configuration
// ============================================================================

const BATCH_SIZE = 10; // Send logs when batch reaches this size
const BATCH_INTERVAL = 5000; // Send logs every 5 seconds
const MAX_RETRIES = 3; // Maximum retry attempts
const LOG_API_ENDPOINT = '/api/logs'; // Server endpoint for log collection

// Check if logging is enabled
const isLoggingEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  return process.env.NEXT_PUBLIC_LOGGING_ENABLED !== 'false';
};

// ============================================================================
// Browser Context
// ============================================================================

/**
 * Generate or retrieve session ID
 */
const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'ssr-session';

  const STORAGE_KEY = 'mimisalon_session_id';
  let sessionId = sessionStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
};

/**
 * Extract browser info from user agent
 */
const getBrowserInfo = (): string => {
  if (typeof window === 'undefined') return 'Unknown';

  const ua = window.navigator.userAgent;

  if (ua.includes('Chrome')) {
    const match = ua.match(/Chrome\/(\d+)/);
    return match ? `Chrome ${match[1]}` : 'Chrome';
  }

  if (ua.includes('Firefox')) {
    const match = ua.match(/Firefox\/(\d+)/);
    return match ? `Firefox ${match[1]}` : 'Firefox';
  }

  if (ua.includes('Safari') && !ua.includes('Chrome')) {
    const match = ua.match(/Version\/(\d+)/);
    return match ? `Safari ${match[1]}` : 'Safari';
  }

  if (ua.includes('Edg')) {
    const match = ua.match(/Edg\/(\d+)/);
    return match ? `Edge ${match[1]}` : 'Edge';
  }

  return 'Unknown Browser';
};

/**
 * Get current user ID (if available from session/cookie)
 */
const getUserId = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;

  // Try to get user ID from localStorage (set by auth system)
  try {
    const authData = localStorage.getItem('auth_user');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.id;
    }
  } catch {
    // Ignore parsing errors
  }

  return undefined;
};

/**
 * Enrich error with browser context
 */
const enrichError = (error: ClientNetworkError): EnrichedError => {
  return {
    ...error,
    browser: getBrowserInfo(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
    sessionId: getSessionId(),
    userId: getUserId(),
    pathname: typeof window !== 'undefined' ? window.location.pathname : '',
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
  };
};

// ============================================================================
// Batch Management
// ============================================================================

/**
 * Log batch queue
 */
class LogBatchQueue {
  private queue: EnrichedError[] = [];
  private timer: NodeJS.Timeout | null = null;
  private isSending = false;

  /**
   * Add error to queue
   */
  add(error: ClientNetworkError): void {
    if (!isLoggingEnabled()) return;

    const enriched = enrichError(error);
    this.queue.push(enriched);

    // Send immediately if batch is full
    if (this.queue.length >= BATCH_SIZE) {
      this.flush();
    } else {
      // Schedule batch send
      this.scheduleBatchSend();
    }
  }

  /**
   * Schedule batch send after interval
   */
  private scheduleBatchSend(): void {
    if (this.timer) return; // Already scheduled

    this.timer = setTimeout(() => {
      this.flush();
    }, BATCH_INTERVAL);
  }

  /**
   * Send batch to server
   */
  async flush(): Promise<void> {
    if (this.isSending || this.queue.length === 0) return;

    // Clear timer
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    // Get batch to send
    const batch = [...this.queue];
    this.queue = [];
    this.isSending = true;

    try {
      await this.sendBatch(batch);
    } catch (error) {
      console.error('[ClientLogger] Failed to send log batch:', error);
      // Re-queue failed logs (up to max retries)
      // For simplicity, we're not implementing retry logic here
    } finally {
      this.isSending = false;
    }
  }

  /**
   * Send batch to server API
   */
  private async sendBatch(batch: EnrichedError[], retryCount = 0): Promise<void> {
    try {
      const response = await fetch(LOG_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs: batch }),
      });

      if (!response.ok) {
        // Retry on 5xx errors
        if (response.status >= 500 && retryCount < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));
          return this.sendBatch(batch, retryCount + 1);
        }

        throw new Error(`Log API returned ${response.status}`);
      }
    } catch (error) {
      // Retry on network errors
      if (retryCount < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));
        return this.sendBatch(batch, retryCount + 1);
      }

      throw error;
    }
  }

  /**
   * Clear queue and timer
   */
  clear(): void {
    this.queue = [];
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

/**
 * Global log batch queue
 */
const logQueue = new LogBatchQueue();

// Send logs before page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    logQueue.flush();
  });
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Log network error from client
 */
export const logNetworkError = (error: ClientNetworkError): void => {
  if (!isLoggingEnabled()) return;

  // Filter out noisy endpoints
  const noisyEndpoints = ['/api/health', '/api/logs', '/_next/'];
  if (noisyEndpoints.some((endpoint) => error.url.includes(endpoint))) {
    return;
  }

  // Filter out successful requests
  if (error.statusCode && error.statusCode >= 200 && error.statusCode < 400) {
    return;
  }

  logQueue.add(error);
};

/**
 * Manually flush log queue
 */
export const flushLogs = async (): Promise<void> => {
  await logQueue.flush();
};

/**
 * Clear log queue (for testing)
 */
export const clearLogs = (): void => {
  logQueue.clear();
};

// ============================================================================
// Export
// ============================================================================

export default {
  logNetworkError,
  flushLogs,
  clearLogs,
};
