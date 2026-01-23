/**
 * Password strength indicator component
 * @module features/auth/components/ui/password-strength-indicator
 */

import * as React from 'react'
import { FormDescription } from '@/components/ui/form'
import {
  getPasswordStrengthText,
  getPasswordStrengthColor,
  getPasswordStrengthBarColor,
  type PasswordStrength,
} from '../../utils/password-strength'

export interface PasswordStrengthIndicatorProps {
  /**
   * Password string to evaluate
   */
  password: string
  /**
   * Password strength score (0-5)
   */
  strength: PasswordStrength
  /**
   * Optional CSS class name
   */
  className?: string
}

/**
 * Visual indicator showing password strength with progress bar and text
 *
 * @example
 * ```tsx
 * const [password, setPassword] = useState('');
 * const strength = checkPasswordStrength(password);
 *
 * <PasswordStrengthIndicator password={password} strength={strength} />
 * ```
 */
export function PasswordStrengthIndicator({
  password,
  strength,
  className,
}: PasswordStrengthIndicatorProps) {
  // Only show if there's a password
  if (!password) return null

  return (
    <div className={className}>
      <div className="space-y-2">
        {/* Progress bar */}
        <div className="flex items-center space-x-2">
          <div className="h-2 flex-1 rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full transition-all ${getPasswordStrengthBarColor(strength)}`}
              style={{
                width: `${(strength / 5) * 100}%`,
              }}
            />
          </div>
          {/* Strength text */}
          <span className={`text-xs ${getPasswordStrengthColor(strength)}`}>
            {getPasswordStrengthText(strength)}
          </span>
        </div>

        {/* Helper text */}
        <FormDescription>대문자, 소문자, 숫자, 특수문자를 포함하여 8자 이상</FormDescription>
      </div>
    </div>
  )
}

PasswordStrengthIndicator.displayName = 'PasswordStrengthIndicator'
