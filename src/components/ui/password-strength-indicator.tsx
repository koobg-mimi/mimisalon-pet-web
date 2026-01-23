'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { calculatePasswordStrength, type PasswordStrength } from '@/lib/validations/password';

export interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

/**
 * PasswordStrengthIndicator Component
 *
 * Displays real-time password strength feedback with visual indicators.
 * Uses the enhanced password validation system to provide comprehensive strength analysis.
 *
 * @example
 * ```tsx
 * <PasswordStrengthIndicator password={password} />
 * ```
 */
export function PasswordStrengthIndicator({ password, className }: PasswordStrengthIndicatorProps) {
  const strength: PasswordStrength = React.useMemo(() => {
    if (!password) {
      return {
        score: 0,
        level: 'weak',
        feedback: [],
      };
    }
    return calculatePasswordStrength(password);
  }, [password]);

  // Don't show indicator if password is empty
  if (!password) {
    return null;
  }

  const strengthConfig = {
    weak: {
      label: '약함',
      color: 'bg-destructive',
      textColor: 'text-destructive',
      progress: 25,
    },
    medium: {
      label: '보통',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600 dark:text-yellow-500',
      progress: 50,
    },
    strong: {
      label: '강함',
      color: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-500',
      progress: 75,
    },
    'very-strong': {
      label: '매우 강함',
      color: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-500',
      progress: 100,
    },
  };

  const config = strengthConfig[strength.level];

  return (
    <div className={cn('space-y-2', className)}>
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">비밀번호 강도</span>
          <span className={cn('font-medium', config.textColor)}>{config.label}</span>
        </div>
        <div className="bg-secondary relative h-1.5 w-full overflow-hidden rounded-full">
          <div
            className={cn('h-full transition-all duration-300', config.color)}
            style={{ width: `${config.progress}%` }}
          />
        </div>
      </div>

      {/* Feedback messages */}
      {strength.feedback.length > 0 && (
        <ul className="text-muted-foreground space-y-0.5 text-xs">
          {strength.feedback.map((message, index) => (
            <li key={index} className="flex items-start gap-1.5">
              <span className="mt-0.5">•</span>
              <span>{message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
