'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

import { authClient } from '@/lib/auth-client'
import { enhancedPasswordSchema } from '@/lib/validations/password'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordStrengthIndicator } from '@/components/ui/password-strength-indicator'

/**
 * Form validation schema for password change
 */
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
    newPassword: enhancedPasswordSchema,
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: '새 비밀번호는 현재 비밀번호와 달라야 합니다',
    path: ['newPassword'],
  })

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export interface ChangePasswordFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

/**
 * ChangePasswordForm Component
 *
 * Allows authenticated users to change their password with comprehensive validation
 * and security features including:
 * - Current password verification
 * - Real-time password strength indicator
 * - Enhanced password validation
 * - Automatic session revocation on other devices
 *
 * @example
 * ```tsx
 * <ChangePasswordForm onSuccess={() => console.log('Password changed!')} />
 * ```
 */
export function ChangePasswordForm({ onSuccess, onCancel }: ChangePasswordFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  })

  // Watch new password for strength indicator
  const newPassword = watch('newPassword', '')

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      // Call better-auth changePassword API
      const { error } = await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: true, // Security: logout all other devices
      })

      if (error) {
        // Handle better-auth errors
        if (error.message?.includes('current password')) {
          toast.error('현재 비밀번호가 올바르지 않습니다')
        } else if (error.message?.includes('same')) {
          toast.error('새 비밀번호는 현재 비밀번호와 달라야 합니다')
        } else {
          toast.error(error.message || '비밀번호 변경에 실패했습니다')
        }
        return
      }

      // Success!
      toast.success('비밀번호가 성공적으로 변경되었습니다', {
        description: '보안을 위해 다른 기기에서 자동 로그아웃되었습니다',
      })

      // Reset form
      reset()

      // Call success callback
      onSuccess?.()
    } catch (error) {
      console.error('Password change error:', error)
      toast.error('비밀번호 변경 중 오류가 발생했습니다')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Current Password */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword">현재 비밀번호</Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrentPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="현재 비밀번호를 입력하세요"
            {...register('currentPassword')}
            aria-invalid={!!errors.currentPassword}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
            aria-label={showCurrentPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="text-destructive text-sm">{errors.currentPassword.message}</p>
        )}
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword">새 비밀번호</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="새 비밀번호를 입력하세요"
            {...register('newPassword')}
            aria-invalid={!!errors.newPassword}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
            aria-label={showNewPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-destructive text-sm">{errors.newPassword.message}</p>
        )}
        {/* Real-time password strength indicator */}
        {newPassword && <PasswordStrengthIndicator password={newPassword} />}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="비밀번호를 다시 입력하세요"
            {...register('confirmPassword')}
            aria-invalid={!!errors.confirmPassword}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
            aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Security Notice */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          🔒 보안을 위해 비밀번호 변경 시 다른 모든 기기에서 자동으로 로그아웃됩니다.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            취소
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? '변경 중...' : '비밀번호 변경'}
        </Button>
      </div>
    </form>
  )
}
