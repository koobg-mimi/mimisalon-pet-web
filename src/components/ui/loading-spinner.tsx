import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-6',
    lg: 'size-8',
  }

  return (
    <Loader2
      data-slot="loading-spinner"
      className={cn('animate-spin', sizeClasses[size], className)}
    />
  )
}

export { LoadingSpinner }
