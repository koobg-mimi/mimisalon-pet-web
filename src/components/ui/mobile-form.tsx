'use client'

import { ReactNode, forwardRef, useState } from 'react'
import { Input, InputProps } from '@/components/ui/input'
import { Textarea, TextareaProps } from '@/components/ui/textarea'
import { Button, ButtonProps } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mobile-optimized Input with larger touch targets
interface MobileInputProps extends Omit<InputProps, 'size'> {
  label?: string
  error?: string
  required?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  helpText?: string
}

export const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  ({ label, error, required, leftIcon, rightIcon, helpText, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className="text-base font-medium">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </Label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400">
              {leftIcon}
            </div>
          )}

          <Input
            ref={ref}
            className={cn(
              'h-12 text-base', // Larger height and font size for mobile
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {helpText && !error && <p className="text-sm text-gray-600">{helpText}</p>}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

MobileInput.displayName = 'MobileInput'

// Mobile-optimized Textarea
interface MobileTextareaProps extends TextareaProps {
  label?: string
  error?: string
  required?: boolean
  helpText?: string
}

export const MobileTextarea = forwardRef<HTMLTextAreaElement, MobileTextareaProps>(
  ({ label, error, required, helpText, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className="text-base font-medium">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </Label>
        )}

        <Textarea
          ref={ref}
          className={cn(
            'min-h-[120px] resize-none text-base', // Larger height and font size
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />

        {helpText && !error && <p className="text-sm text-gray-600">{helpText}</p>}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

MobileTextarea.displayName = 'MobileTextarea'

// Mobile-optimized Button with larger touch targets
interface MobileButtonProps extends ButtonProps {
  fullWidth?: boolean
  loading?: boolean
}

export const MobileButton = forwardRef<HTMLButtonElement, MobileButtonProps>(
  ({ fullWidth, loading, children, className, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'h-12 text-base font-semibold', // Larger height and font size
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>처리 중...</span>
          </div>
        ) : (
          children
        )}
      </Button>
    )
  }
)

MobileButton.displayName = 'MobileButton'

// Mobile-friendly select/dropdown
interface MobileSelectProps {
  label?: string
  value?: string
  onValueChange: (value: string) => void
  options: Array<{
    value: string
    label: string
    description?: string
  }>
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function MobileSelect({
  label,
  value,
  onValueChange,
  options,
  error,
  required,
  disabled,
  className,
}: MobileSelectProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label className="text-base font-medium">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </Label>
      )}

      <div className="space-y-2">
        {options.map((option) => (
          <div
            key={option.value}
            className={cn(
              'flex cursor-pointer items-center justify-between rounded-lg border bg-white p-4 transition-colors',
              'hover:bg-gray-50 active:bg-gray-100',
              value === option.value && 'border-primary bg-primary/5',
              disabled && 'cursor-not-allowed opacity-50',
              error && 'border-red-500'
            )}
            onClick={() => !disabled && onValueChange(option.value)}
          >
            <div className="flex-1">
              <div className="font-medium text-gray-900">{option.label}</div>
              {option.description && (
                <div className="mt-1 text-sm text-gray-600">{option.description}</div>
              )}
            </div>

            {value === option.value && <CheckIcon className="text-primary h-5 w-5" />}
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

// Mobile-friendly checkbox group
interface MobileCheckboxGroupProps {
  label?: string
  value: string[]
  onValueChange: (value: string[]) => void
  options: Array<{
    value: string
    label: string
    description?: string
  }>
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function MobileCheckboxGroup({
  label,
  value,
  onValueChange,
  options,
  error,
  required,
  disabled,
  className,
}: MobileCheckboxGroupProps) {
  const handleToggle = (optionValue: string) => {
    if (disabled) return

    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue]

    onValueChange(newValue)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label className="text-base font-medium">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </Label>
      )}

      <div className="space-y-2">
        {options.map((option) => (
          <div
            key={option.value}
            className={cn(
              'flex cursor-pointer items-center justify-between rounded-lg border bg-white p-4 transition-colors',
              'hover:bg-gray-50 active:bg-gray-100',
              value.includes(option.value) && 'border-primary bg-primary/5',
              disabled && 'cursor-not-allowed opacity-50',
              error && 'border-red-500'
            )}
            onClick={() => handleToggle(option.value)}
          >
            <div className="flex-1">
              <div className="font-medium text-gray-900">{option.label}</div>
              {option.description && (
                <div className="mt-1 text-sm text-gray-600">{option.description}</div>
              )}
            </div>

            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded border-2',
                value.includes(option.value) ? 'border-primary bg-primary' : 'border-gray-300'
              )}
            >
              {value.includes(option.value) && <CheckIcon className="h-3 w-3 text-white" />}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

// Mobile form section wrapper
interface MobileFormSectionProps {
  title: string
  subtitle?: string
  children: ReactNode
  collapsible?: boolean
  defaultExpanded?: boolean
  className?: string
}

export function MobileFormSection({
  title,
  subtitle,
  children,
  collapsible = false,
  defaultExpanded = true,
  className,
}: MobileFormSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div
        className={cn('border-b bg-gray-50 p-4', collapsible && 'cursor-pointer')}
        onClick={() => collapsible && setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
          </div>

          {collapsible && (
            <ChevronDownIcon
              className={cn(
                'h-5 w-5 text-gray-400 transition-transform',
                expanded && 'rotate-180 transform'
              )}
            />
          )}
        </div>
      </div>

      {expanded && <CardContent className="space-y-6 p-4">{children}</CardContent>}
    </Card>
  )
}
