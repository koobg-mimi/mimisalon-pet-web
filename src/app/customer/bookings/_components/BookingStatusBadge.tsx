import { BookingStatus } from '@mimisalon/shared'
import { getStatusColor, getStatusText } from '../_utils/booking-status.utils'

interface BookingStatusBadgeProps {
  status: BookingStatus
  className?: string
}

/**
 * 예약 상태 배지 컴포넌트
 * - 상태에 따라 색상과 텍스트가 자동으로 변경됨
 */
export function BookingStatusBadge({ status, className = '' }: BookingStatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(status)} ${className}`}
    >
      {getStatusText(status)}
    </span>
  )
}
