'use client'

import * as React from 'react'
import { Mail, Smartphone, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export type VerificationMethod = 'email' | 'sms'

export interface VerificationMethodSelectorProps {
  onSelect: (method: VerificationMethod) => void
  emailAddress?: string
  phoneNumber?: string
  defaultMethod?: VerificationMethod
  className?: string
}

/**
 * Verification Method Selector Component
 *
 * Allows users to choose between email or SMS verification
 */
export function VerificationMethodSelector({
  onSelect,
  emailAddress,
  phoneNumber,
  defaultMethod,
  className,
}: VerificationMethodSelectorProps) {
  const [selected, setSelected] = React.useState<VerificationMethod | null>(defaultMethod || null)

  const handleSelect = (method: VerificationMethod) => {
    setSelected(method)
    onSelect(method)
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <h3 className="text-muted-foreground text-sm font-medium">인증 방법을 선택하세요</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Email Option */}
          {emailAddress && (
            <button
              type="button"
              onClick={() => handleSelect('email')}
              className={cn(
                'group hover:border-primary/50 relative flex flex-col items-start gap-3 rounded-lg border-2 p-4 transition-all',
                'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                selected === 'email'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:bg-accent/50'
              )}
            >
              <div className="flex w-full items-center justify-between">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                    selected === 'email'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  )}
                >
                  <Mail className="h-5 w-5" />
                </div>
                {selected === 'email' && (
                  <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="space-y-1 text-left">
                <p className="text-sm font-semibold">이메일 인증</p>
                <p className="text-muted-foreground text-xs">{emailAddress}</p>
              </div>
            </button>
          )}

          {/* SMS Option */}
          {phoneNumber && (
            <button
              type="button"
              onClick={() => handleSelect('sms')}
              className={cn(
                'group hover:border-primary/50 relative flex flex-col items-start gap-3 rounded-lg border-2 p-4 transition-all',
                'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                selected === 'sms'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:bg-accent/50'
              )}
            >
              <div className="flex w-full items-center justify-between">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                    selected === 'sms'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  )}
                >
                  <Smartphone className="h-5 w-5" />
                </div>
                {selected === 'sms' && (
                  <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="space-y-1 text-left">
                <p className="text-sm font-semibold">문자 인증</p>
                <p className="text-muted-foreground text-xs">{phoneNumber}</p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Info Card */}
      {selected && (
        <Card className="border-muted bg-muted/30">
          <CardContent className="text-muted-foreground pt-4 text-sm">
            {selected === 'email' ? (
              <p>
                📧 이메일로 6자리 인증코드가 전송됩니다.
                <br />
                <span className="text-xs">보통 1분 이내에 도착하며, 10분간 유효합니다.</span>
              </p>
            ) : (
              <p>
                📱 휴대폰 문자로 6자리 인증코드가 전송됩니다.
                <br />
                <span className="text-xs">보통 즉시 도착하며, 10분간 유효합니다.</span>
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/**
 * Compact Verification Method Selector (for inline forms)
 */
export function VerificationMethodSelectorCompact({
  onSelect,
  emailAddress,
  phoneNumber,
  defaultMethod,
  className,
}: VerificationMethodSelectorProps) {
  const [selected, setSelected] = React.useState<VerificationMethod | null>(defaultMethod || null)

  const handleSelect = (method: VerificationMethod) => {
    setSelected(method)
    onSelect(method)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-muted-foreground text-sm">인증 방법</p>
      <div className="flex gap-2">
        {emailAddress && (
          <Button
            type="button"
            variant={selected === 'email' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSelect('email')}
            className="flex-1"
          >
            <Mail className="mr-2 h-4 w-4" />
            이메일
          </Button>
        )}
        {phoneNumber && (
          <Button
            type="button"
            variant={selected === 'sms' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSelect('sms')}
            className="flex-1"
          >
            <Smartphone className="mr-2 h-4 w-4" />
            문자
          </Button>
        )}
      </div>
    </div>
  )
}
