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
 * Modern phone number update component using better-auth phoneNumber plugin.
 * Replaces the deprecated PhoneVerificationStatus component.
 *
 * Features:
 * - Send OTP via better-auth phoneNumber.sendOtp()
 * - Verify and update via better-auth phoneNumber.verify({ updatePhoneNumber: true })
 * - Gets verification status from session (no API calls)
 * - Real-time validation
 *
 * @example
 * ```tsx
 * <PhoneUpdateForm variant="card" onSuccess={() => console.log('Updated!')} />
 * ```
 */
export function PhoneUpdateForm({ variant = 'card', className, onSuccess }: PhoneUpdateFormProps) {
  const { phoneNumber, phoneNumberVerified, isLoading, sendOtp, verifyAndUpdate } = usePhoneUpdate()

  const [step, setStep] = useState<'status' | 'input' | 'verify'>('status')
  const [phoneInput, setPhoneInput] = useState(phoneNumber || '') // Pre-fill with existing phone
  const [otpInput, setOtpInput] = useState('')

  const handleSendOtp = async () => {
    const success = await sendOtp(phoneInput)
    if (success) {
      setStep('verify')
    }
  }

  const handleVerify = async () => {
    const success = await verifyAndUpdate(phoneInput, otpInput)
    if (success) {
      setStep('status')
      setPhoneInput('')
      setOtpInput('')
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

    if (phoneNumberVerified) {
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
                {formatPhoneForDisplay(phoneNumber)}
              </p>
              <Badge variant="secondary" className="border-green-200 bg-green-100 text-green-800">
                인증 완료
              </Badge>
            </div>
            <p className="text-xs text-green-600">전화번호가 성공적으로 인증되었습니다</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setStep('input')}>
            변경
          </Button>
        </div>
      )
    }

    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center space-x-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-yellow-800">
                {formatPhoneForDisplay(phoneNumber)}
              </p>
              <Badge
                variant="secondary"
                className="border-yellow-200 bg-yellow-100 text-yellow-800"
              >
                인증 필요
              </Badge>
            </div>
            <p className="text-xs text-yellow-600">서비스 이용을 위해 전화번호 인증이 필요합니다</p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setPhoneInput(phoneNumber || '')
              setStep('input')
            }}
          >
            인증
          </Button>
        </div>
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
          <Button onClick={handleSendOtp} disabled={isLoading || !phoneInput} className="flex-1">
            {isLoading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <PhoneIcon className="mr-2 h-4 w-4" />
            )}
            인증 코드 전송
          </Button>
          <Button variant="outline" onClick={() => setStep('status')} disabled={isLoading}>
            취소
          </Button>
        </div>
      </div>
    )
  }

  // Verify view: Enter OTP code
  return (
    <div
      className={cn(
        'space-y-4 rounded-lg p-4',
        variant === 'card' && 'border-border bg-card border',
        className
      )}
    >
      <div className="space-y-2">
        <Label htmlFor="otp">인증 코드</Label>
        <Input
          id="otp"
          type="text"
          placeholder="123456"
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
          disabled={isLoading}
          maxLength={6}
        />
        <p className="text-muted-foreground text-xs">
          {formatPhoneForDisplay(phoneInput)}로 전송된 6자리 코드를 입력하세요
        </p>
      </div>

      <div className="flex space-x-2">
        <Button
          onClick={handleVerify}
          disabled={isLoading || otpInput.length !== 6}
          className="flex-1"
        >
          {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
          인증 완료
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setStep('input')
            setOtpInput('')
          }}
          disabled={isLoading}
        >
          다시 입력
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleSendOtp}
        disabled={isLoading}
        className="w-full"
      >
        인증 코드 재전송
      </Button>
    </div>
  )
}
