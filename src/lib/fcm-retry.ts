/**
 * FCM Retry Logic Utility
 * Provides exponential backoff retry mechanism for FCM notifications with concurrent request limiting
 */

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

/**
 * Semaphore implementation for limiting concurrent requests
 */
class Semaphore {
  private permits: number;
  private waitQueue: Array<() => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      this.waitQueue.push(resolve);
    });
  }

  release(): void {
    this.permits++;
    if (this.waitQueue.length > 0) {
      const nextResolver = this.waitQueue.shift();
      if (nextResolver) {
        this.permits--;
        nextResolver();
      }
    }
  }
}

export interface RetryResult<T> {
  success: boolean;
  result?: T;
  error?: string;
  attempts: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
};

// Concurrent request limiting for FCM operations
const CONCURRENT_LIMIT = 10;
const fcmSemaphore = new Semaphore(CONCURRENT_LIMIT);

/**
 * Execute a function with exponential backoff retry logic and concurrent request limiting
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  shouldRetry: (error: unknown) => boolean,
  config: Partial<RetryConfig> = {}
): Promise<RetryResult<T>> {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: unknown;

  for (let attempt = 1; attempt <= finalConfig.maxRetries; attempt++) {
    // Acquire semaphore permit before operation
    await fcmSemaphore.acquire();

    try {
      const result = await operation();

      if (attempt > 1) {
        console.log(`✅ Operation succeeded on attempt ${attempt}`);
      }

      return {
        success: true,
        result,
        attempts: attempt,
      };
    } catch (error) {
      lastError = error;

      // Check if we should retry this error
      if (!shouldRetry(error)) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          attempts: attempt,
        };
      }

      // Don't retry on the last attempt
      if (attempt < finalConfig.maxRetries) {
        const delay = Math.min(
          finalConfig.baseDelayMs * Math.pow(finalConfig.backoffMultiplier, attempt - 1),
          finalConfig.maxDelayMs
        );

        console.log(
          `⏳ Attempt ${attempt} failed, retrying in ${delay}ms... Error: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } finally {
      // Always release semaphore permit after operation
      fcmSemaphore.release();
    }
  }

  console.error(`❌ Operation failed after ${finalConfig.maxRetries} attempts`);

  return {
    success: false,
    error: lastError instanceof Error ? lastError.message : 'Maximum retry attempts exceeded',
    attempts: finalConfig.maxRetries,
  };
}

/**
 * Determine if an FCM error should be retried
 */
export function shouldRetryFCMError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const errorCode = (error as Error & { code: string }).code;

  // Don't retry client errors (4xx equivalent)
  const nonRetriableErrors = [
    'messaging/invalid-registration-token',
    'messaging/registration-token-not-registered',
    'messaging/invalid-argument',
    'messaging/authentication-error',
    'messaging/insufficient-quota',
  ];

  if (nonRetriableErrors.includes(errorCode)) {
    return false;
  }

  // Retry server errors and rate limits
  const retriableErrors = [
    'messaging/quota-exceeded',
    'messaging/message-rate-exceeded',
    'messaging/internal-error',
    'messaging/server-unavailable',
    'messaging/timeout',
  ];

  if (retriableErrors.includes(errorCode)) {
    return true;
  }

  // Default to retry for unknown errors (could be transient)
  return true;
}
