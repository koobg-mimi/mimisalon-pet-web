import { AlertCircle, CheckCircle, Clock, DollarSign, XCircle } from 'lucide-react'
import { BookingStatus } from '@mimisalon/shared'
import type { ReactNode } from 'react'

/**
 * Badge variant types matching shadcn/ui Badge component
 */
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

/**
 * Status configuration object
 */
export interface StatusConfig {
  /** Display label for the status */
  label: string
  /** Badge variant for styling */
  variant: BadgeVariant
  /** Icon component to display */
  icon: ReactNode
}

/**
 * Get status configuration for a booking status
 * Maps BookingStatus enum values to UI properties (label, variant, icon)
 *
 * @param status - The booking status
 * @returns Status configuration object
 * @example
 * const config = getStatusConfig(BookingStatus.GROOMER_CONFIRM)
 * // { label: "미용사 확정", variant: "default", icon: <CheckCircle /> }
 */
export function getStatusConfig(status: BookingStatus): StatusConfig {
  const statusConfigMap: Record<BookingStatus, StatusConfig> = {
    [BookingStatus.FIRST_PAYMENT_PENDING]: {
      label: '1차 결제 대기',
      variant: 'secondary',
      icon: <Clock className="h-3 w-3" />,
    },
    [BookingStatus.FIRST_PAYMENT_COMPLETE]: {
      label: '1차 결제 완료',
      variant: 'outline',
      icon: <CheckCircle className="h-3 w-3" />,
    },
    [BookingStatus.FIRST_PAYMENT_VERIFY]: {
      label: '1차 결제 확인중',
      variant: 'secondary',
      icon: <Clock className="h-3 w-3" />,
    },
    [BookingStatus.GROOMER_CONFIRM_PENDING]: {
      label: '미용사 확인 대기',
      variant: 'secondary',
      icon: <AlertCircle className="h-3 w-3" />,
    },
    [BookingStatus.GROOMER_CONFIRM]: {
      label: '미용사 확정',
      variant: 'default',
      icon: <CheckCircle className="h-3 w-3" />,
    },
    [BookingStatus.ADDITIONAL_PAYMENT_PENDING]: {
      label: '추가 결제 대기',
      variant: 'secondary',
      icon: <DollarSign className="h-3 w-3" />,
    },
    [BookingStatus.ADDITIONAL_PAYMENT_COMPLETE]: {
      label: '추가 결제 완료',
      variant: 'outline',
      icon: <CheckCircle className="h-3 w-3" />,
    },
    [BookingStatus.WORK_IN_PROGRESS]: {
      label: '진행중',
      variant: 'default',
      icon: <Clock className="h-3 w-3" />,
    },
    [BookingStatus.SERVICE_COMPLETED]: {
      label: '완료',
      variant: 'default',
      icon: <CheckCircle className="h-3 w-3" />,
    },
    [BookingStatus.SERVICE_CANCELLED]: {
      label: '취소됨',
      variant: 'destructive',
      icon: <XCircle className="h-3 w-3" />,
    },
    [BookingStatus.BOOKING_FAILED]: {
      label: '예약 실패',
      variant: 'destructive',
      icon: <XCircle className="h-3 w-3" />,
    },
  }

  // Return config or fallback for unknown status
  return (
    statusConfigMap[status] || {
      label: '알 수 없음',
      variant: 'secondary' as const,
      icon: <AlertCircle className="h-3 w-3" />,
    }
  )
}

/**
 * Get just the label for a booking status
 * @param status - The booking status
 * @returns Status label string
 */
export function getStatusLabel(status: BookingStatus): string {
  return getStatusConfig(status).label
}

/**
 * Get just the variant for a booking status
 * @param status - The booking status
 * @returns Badge variant
 */
export function getStatusVariant(status: BookingStatus): BadgeVariant {
  return getStatusConfig(status).variant
}

/**
 * Check if a status represents a completed state
 * @param status - The booking status
 * @returns True if the booking is in a final state
 */
export function isCompletedStatus(status: BookingStatus): boolean {
  return (
    status === BookingStatus.SERVICE_COMPLETED ||
    status === BookingStatus.SERVICE_CANCELLED ||
    status === BookingStatus.BOOKING_FAILED
  )
}

/**
 * Check if a status allows cancellation
 * @param status - The booking status
 * @returns True if the booking can be cancelled
 */
export function isCancellable(status: BookingStatus): boolean {
  return (
    status !== BookingStatus.SERVICE_CANCELLED &&
    status !== BookingStatus.SERVICE_COMPLETED &&
    status !== BookingStatus.BOOKING_FAILED
  )
}

/**
 * Check if a status allows confirmation
 * @param status - The booking status
 * @returns True if the booking can be confirmed
 */
export function isConfirmable(status: BookingStatus): boolean {
  return (
    status === BookingStatus.GROOMER_CONFIRM_PENDING ||
    status === BookingStatus.FIRST_PAYMENT_COMPLETE
  )
}

/**
 * Check if a status allows completion
 * @param status - The booking status
 * @returns True if the booking can be marked as complete
 */
export function isCompletable(status: BookingStatus): boolean {
  return status === BookingStatus.WORK_IN_PROGRESS
}
