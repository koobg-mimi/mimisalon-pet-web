'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

function DialogClose({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      className={cn(
        'ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none',
        'flex min-h-[44px] min-w-[44px] items-center justify-center sm:min-h-0 sm:min-w-0', // Mobile touch target
        className
      )}
      {...props}
    >
      <XIcon className="h-5 w-5 sm:h-4 sm:w-4" />
      <span className="sr-only">Close</span>
    </DialogPrimitive.Close>
  );
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80',
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'bg-background fixed z-50 grid gap-4 p-6 shadow-lg duration-300',
          // Mobile: Bottom sheet with horizontal centering
          'bottom-0 left-[50%] w-[95vw] max-w-lg translate-x-[-50%]',
          'max-h-[90vh] rounded-t-2xl',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
          // Desktop: Center modal style
          'sm:top-[50%] sm:bottom-auto sm:w-full',
          'sm:translate-y-[-50%] sm:rounded-lg sm:border',
          'sm:data-[state=closed]:fade-out-0 sm:data-[state=open]:fade-in-0',
          'sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95',
          'sm:data-[state=closed]:slide-out-to-left-1/2 sm:data-[state=closed]:slide-out-to-top-[48%]',
          'sm:data-[state=open]:slide-in-from-left-1/2 sm:data-[state=open]:slide-in-from-top-[48%]',
          className
        )}
        {...props}
      >
        {/* Mobile drag handle */}
        <div className="absolute top-3 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-gray-300 sm:hidden" />
        <div className="max-h-[calc(90vh-4rem)] overflow-y-auto sm:max-h-none">{children}</div>
        <DialogClose />
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-0 sm:space-x-2',
        'bg-background sticky bottom-0 pt-4 sm:relative sm:pt-0', // Sticky on mobile for bottom sheet
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('text-lg leading-none font-semibold tracking-tight', className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
