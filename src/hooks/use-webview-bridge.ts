import { useEffect, useCallback } from 'react'
import { useSession } from '@/lib/auth-client'
import { SimpleExpoToken } from '@/lib/simple-expo-token'
import { UserRole } from '@prisma/client'

export enum WebViewMessageType {
  USER_LOGGED_IN = 'USER_LOGGED_IN',
  USER_LOGGED_OUT = 'USER_LOGGED_OUT',
  EXPO_TOKEN_REGISTERED = 'EXPO_TOKEN_REGISTERED',
  IMAGE_UPLOAD_REQUEST = 'IMAGE_UPLOAD_REQUEST',
  CAMERA_REQUEST = 'CAMERA_REQUEST',
  IMAGE_UPLOAD_RESPONSE = 'IMAGE_UPLOAD_RESPONSE',
}

interface WebViewMessage {
  type: WebViewMessageType
  data?: Record<string, unknown>
  id?: string
}

export function useWebViewBridge() {
  const { data: session, isPending } = useSession()
  const isWebView = SimpleExpoToken.isReactNativeWebView()

  const sendMessage = useCallback(
    (message: WebViewMessage) => {
      if (!isWebView) return

      if (typeof window !== 'undefined' && window.ReactNativeWebView) {
        try {
          const messageString = JSON.stringify(message)
          window.ReactNativeWebView.postMessage(messageString)
          console.log('📤 Sent message to React Native:', message)
        } catch {
          return
        }
      }
    },
    [isWebView]
  )

  const sendUserLogin = useCallback(
    (userData: {
      userId?: string
      email?: string
      name?: string
      phoneNumber?: string
      role?: UserRole
    }) => {
      sendMessage({
        type: WebViewMessageType.USER_LOGGED_IN,
        data: userData,
      })
    },
    [sendMessage]
  )

  const sendUserLogout = useCallback(() => {
    sendMessage({
      type: WebViewMessageType.USER_LOGGED_OUT,
    })
  }, [sendMessage])

  const requestImageUpload = useCallback(() => {
    sendMessage({
      type: WebViewMessageType.IMAGE_UPLOAD_REQUEST,
    })
  }, [sendMessage])

  const requestCamera = useCallback(() => {
    sendMessage({
      type: WebViewMessageType.CAMERA_REQUEST,
    })
  }, [sendMessage])

  // Automatically send user data when session becomes available
  useEffect(() => {
    try {
      if (!isPending && session?.user && isWebView) {
        console.log('🔄 Sending user data to React Native from bridge hook')

        sendUserLogin({
          userId: session.user.id,
          email: session.user.email || '',
          name: session.user.name || '',
          phoneNumber: session.user.phoneNumber || '',
          role: session.user.role as UserRole | undefined,
        })
      }
    } catch {
      // Silently catch and ignore any errors to prevent propagation
      return
    }
  }, [session, isPending, isWebView, sendUserLogin])

  return {
    isWebView,
    sendMessage,
    sendUserLogin,
    sendUserLogout,
    requestImageUpload,
    requestCamera,
  }
}
