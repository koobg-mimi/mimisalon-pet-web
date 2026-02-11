'use client'

import * as React from 'react'
import { useState } from 'react'
import { AlertTriangleIcon, CheckCircleIcon, PhoneIcon, XCircleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { usePhoneUpdate } from '@/hooks/usePhoneUpdate'
import { cn } from '@/lib/utils'

export interface PhoneUpdateFormProps {
  /** Show as card or inline */
  variant?: 'card' | 'inline'
  /** Additional CSS classes */
  className?: string
  /** Callback after successful verification */
  onSuccess?: () => void
}

/**
 * Phone Update Form Component
 *
 * Simple phone number update component without verification.
 * Directly saves phone number without requiring OTP verification.
 *
 * Features:
 * - Direct phone number save via better-auth
 * - Gets current phone from session (no API calls)
 * - Real-time validation
 *
 * @example
 * ```tsx
 * <PhoneUpdateForm variant="card" onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function PhoneUpdateForm({ variant = 'card', className, onSuccess }: PhoneUpdateFormProps) {
  const { phoneNumber, isLoading, updatePhoneNumber } = usePhoneUpdate()

  const [step, setStep] = useState<'status' | 'input'>('status')
  const [phoneInput, setPhoneInput] = useState(phoneNumber || '') // Pre-fill with existing phone

  const handleSavePhone = async () => {
    const success = await updatePhoneNumber(phoneInput)
    if (success) {
      setStep('status')
      setPhoneInput('')
      onSuccess?.()
    }
  }

  const formatPhoneForDisplay = (phoneNumber: string | null | undefined) => {
    // Display E.164 format as-is for consistency
    return phoneNumber || ''
  }

  // Status view: Show current verification status
  if (step === 'status') {
    if (!phoneNumber) {
      return (
        <div
          className={cn(
            'bg-muted/50 flex items-center space-x-3 rounded-lg p-4',
            variant === 'card' && 'border-border border',
            className
          )}
        >
          <XCircleIcon className="text-muted-foreground h-5 w-5" />
          <div className="flex-1">
            <p className="text-muted-foreground text-sm font-medium">
              전화번호가 등록되지 않았습니다
            </p>
            <p className="text-muted-foreground text-xs">전화번호를 추가해주세요</p>
          </div>
          <Button size="sm" onClick={() => setStep('input')}>
            <PhoneIcon className="mr-2 h-4 w-4" />
            추가
          </Button>
        </div>
      )
    }

    return (
      <div
        className={cn(
          'flex items-center space-x-3 rounded-lg border border-green-200 bg-green-50 p-4',
          className
        )}
      >
        <CheckCircleIcon className="h-5 w-5 text-green-600" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-green-800">
              {phoneNumber}
            </p>
            <Badge variant="secondary" className="border-green-200 bg-green-100 text-green-800">
              등록됨
            </Badge>
          </div>
          <p className="text-xs text-green-600">전화번호가 등록되었습니다</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => {
          setPhoneInput(phoneNumber || '')
          setStep('input')
        }}>
          변경
        </Button>
      </div>
    )
  }

  // Input view: Enter phone number
  if (step === 'input') {
    return (
      <div
        className={cn(
          'space-y-4 rounded-lg p-4',
          variant === 'card' && 'border-border bg-card border',
          className
        )}
      >
        <div className="space-y-2">
          <Label htmlFor="phone">전화번호 (E.164 형식)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+821012345678"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-muted-foreground text-xs">
            국가 코드를 포함하여 입력하세요 (예: +82 1012345678)
          </p>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleSavePhone} disabled={isLoading || !phoneInput} className="flex-1">
            {isLoading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <PhoneIcon className="mr-2 h-4 w-4" />
            )}
            저장
          </Button>
          <Button variant="outline" onClick={() => setStep('status')} disabled={isLoading}>
            취소
          </Button>
        </div>
      </div>
    )
  }

  return null
}
