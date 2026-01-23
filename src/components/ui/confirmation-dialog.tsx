'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ConfirmationDialogVariant = 'default' | 'destructive' | 'warning' | 'success' | 'info';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: ConfirmationDialogVariant;
  showIcon?: boolean;
  isLoading?: boolean;
}

const variantStyles = {
  default: {
    icon: Info,
    iconClass: 'text-blue-500',
    bgClass: 'bg-blue-50',
    buttonClass: '',
  },
  destructive: {
    icon: AlertTriangle,
    iconClass: 'text-red-500',
    bgClass: 'bg-red-50',
    buttonClass: 'bg-red-600 hover:bg-red-700 text-white',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-yellow-500',
    bgClass: 'bg-yellow-50',
    buttonClass: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  },
  success: {
    icon: CheckCircle,
    iconClass: 'text-green-500',
    bgClass: 'bg-green-50',
    buttonClass: 'bg-green-600 hover:bg-green-700 text-white',
  },
  info: {
    icon: Info,
    iconClass: 'text-blue-500',
    bgClass: 'bg-blue-50',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  variant = 'default',
  showIcon = true,
  isLoading = false,
}: ConfirmationDialogProps) {
  const style = variantStyles[variant];
  const Icon = style.icon;

  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            {showIcon && (
              <div
                className={cn(
                  'flex-shrink-0 rounded-full p-3',
                  style.bgClass,
                  'hidden sm:flex' // Hide icon on mobile to save space
                )}
              >
                <Icon className={cn('h-6 w-6', style.iconClass)} />
              </div>
            )}
            <div className="flex-1">
              <AlertDialogTitle className="text-lg sm:text-xl">
                {showIcon && (
                  <Icon
                    className={cn(
                      'mr-2 inline h-5 w-5 sm:hidden', // Show inline icon on mobile
                      style.iconClass
                    )}
                  />
                )}
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2 text-sm sm:text-base">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              'w-full sm:w-auto',
              style.buttonClass,
              isLoading && 'cursor-not-allowed opacity-50'
            )}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="mr-2 -ml-1 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                처리 중...
              </span>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook for easier usage
import { useState } from 'react';

export function useConfirmationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState<
    Omit<ConfirmationDialogProps, 'open' | 'onOpenChange'>
  >({
    title: '',
    description: '',
    onConfirm: () => {},
  });

  const showConfirmation = (
    props: Omit<ConfirmationDialogProps, 'open' | 'onOpenChange'>
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogProps({
        ...props,
        onConfirm: async () => {
          await props.onConfirm();
          resolve(true);
        },
        onCancel: () => {
          props.onCancel?.();
          resolve(false);
        },
      });
      setIsOpen(true);
    });
  };

  return {
    ConfirmationDialogComponent: (
      <ConfirmationDialog open={isOpen} onOpenChange={setIsOpen} {...dialogProps} />
    ),
    showConfirmation,
  };
}
