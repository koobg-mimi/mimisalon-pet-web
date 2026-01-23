/**
 * Simplified ExponentPushToken management
 * Now using HTTP API instead of WebView messaging
 */

import type {
  RegisterTokenRequest,
  RegisterTokenResponse,
  RegisterTokenErrorResponse,
} from '@/app/api/notifications/register-token/route'
import type { TokenStatusResponse } from '@/app/api/notifications/token/status/route'

// TypeScript declaration for React Native WebView
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void
    }
  }
}

export class SimpleExpoToken {
  /**
   * Check if we're running in a React Native WebView
   */
  static isReactNativeWebView(): boolean {
    if (typeof window === 'undefined') {
      return false
    }

    return !!(
      window.ReactNativeWebView ||
      navigator.userAgent.includes('ReactNative') ||
      navigator.userAgent.includes('MimiSalon')
    )
  }

  /**
   * Register token via HTTP API (for server-side use)
   */
  static async registerTokenViaAPI(
    params: RegisterTokenRequest
  ): Promise<RegisterTokenResponse | RegisterTokenErrorResponse> {
    try {
      const response = await fetch('/api/notifications/register-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      const result: RegisterTokenResponse | RegisterTokenErrorResponse = await response.json()
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Get current token status for authenticated user
   */
  static async getTokenStatus(): Promise<TokenStatusResponse | { success: false; error: string }> {
    try {
      const response = await fetch('/api/notifications/token/status')
      const result: TokenStatusResponse = await response.json()
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}
