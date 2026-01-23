'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation active:scale-[0.98] active:opacity-90 relative overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md active:shadow-sm before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95 shadow-sm hover:shadow-md',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/90 shadow-sm hover:shadow-md hover:border-primary/30',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90 shadow-sm hover:shadow-md',
        ghost: 'hover:bg-accent hover:text-accent-foreground active:bg-accent/90',
        link: 'text-primary underline-offset-4 hover:underline active:text-primary/80',
        cta: 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl active:shadow-md transform hover:scale-[1.02] active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700',
        'cta-outline':
          'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300',
        'mobile-primary':
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl active:shadow-md min-h-[48px] sm:min-h-[44px] rounded-lg font-semibold',
      },
      size: {
        default: 'min-h-[44px] px-4 py-3 sm:min-h-[40px] sm:py-2',
        sm: 'min-h-[40px] rounded-md px-3 py-2 sm:min-h-[36px] text-sm',
        lg: 'min-h-[48px] rounded-md px-6 py-3 sm:min-h-[44px] sm:px-8 text-base',
        xl: 'min-h-[52px] rounded-lg px-8 py-4 sm:min-h-[48px] sm:px-10 text-lg font-semibold',
        icon: 'min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px]',
        'icon-sm': 'min-h-[36px] min-w-[36px] sm:min-h-[32px] sm:min-w-[32px]',
        'icon-lg': 'min-h-[48px] min-w-[48px] sm:min-h-[44px] sm:min-w-[44px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
