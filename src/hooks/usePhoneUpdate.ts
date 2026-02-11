'use client'

import { useCallback, useState } from 'react'
import { authClient, useSession } from '@/lib/auth-client'
import { toast } from 'sonner'

export interface UsePhoneUpdateReturn {
  /** Current phone number from session (user.phoneNumber) */
  phoneNumber: string | null
  /** Whether phone update operation is in progress */
  isLoading: boolean
  /** Update user's phone number directly without verification */
  updatePhoneNumber: (phoneNumber: string) => Promise<boolean>
  /** User role from session */
  userRole: 'CUSTOMER' | 'GROOMER' | 'ADMIN' | null
}

/**
 * Hook for updating user's phone number directly without verification
 *
 * @example
 * ```tsx
 * const { phoneNumber, updatePhoneNumber } = usePhoneUpdate();
 *
 * // Update phone number directly
 * await updatePhoneNumber('+821012345678');
 * ```
 */
export function usePhoneUpdate(): UsePhoneUpdateReturn {
  const { data: session, isPending } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  if (!session) {
    throw new Error('usePhoneUpdate must be used within a SessionProvider')
  }

  const user = session.user
  const phoneNumber = user.phoneNumber || null
  const userRole = user?.role as 'CUSTOMER' | 'GROOMER' | 'ADMIN' | null

  /**
   * Update user's phone number directly without verification
   */
  const updatePhoneNumber = useCallback(async (phoneNumber: string): Promise<boolean> => {
    if (!phoneNumber) {
      toast.error('전화번호를 입력해주세요.')
      return false
    }

    // Validate phone number format (E.164)
    if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
      toast.error('올바른 전화번호 형식이 아닙니다. (예: +821012345678)')
      return false
    }

    setIsLoading(true)

    try {
      console.log('📱 Updating phone number to:', phoneNumber)

      // Update phone number via better-auth without verification
      const result = await authClient.updateUser({
        phoneNumber,
      })

      if (result.data) {
        console.log('✅ Phone number updated successfully')
        toast.success('전화번호가 저장되었습니다.')
        
        // Reload page to refresh session with new phone number
        window.location.reload()
        return true
      } else {
        console.error('❌ Failed to update phone number:', result.error)
        toast.error(result.error?.message || '전화번호 저장에 실패했습니다.')
        return false
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('❌ Error updating phone number:', error)
        toast.error(error?.message || '전화번호 저장 중 오류가 발생했습니다.')
      } else {
        console.error('❌ Unknown error updating phone number:', error)
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    phoneNumber,
    isLoading: isPending || isLoading,
    updatePhoneNumber,
    userRole,
  }
}
