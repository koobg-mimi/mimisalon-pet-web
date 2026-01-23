import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Button } from '@/components/ui/button'

interface BookingCardProps {
  booking: {
    id: string
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
    date: string
    time: string
    amount: number
    service: {
      name: string
      duration: number
    }
    pet: {
      name: string
      breed: string
    }
    groomer: {
      name: string
      rating: number
    }
    location: {
      name: string
      address: string
    }
  }
  onViewDetails?: () => void
  onCancel?: () => void
  onReview?: () => void
  showActions?: boolean
}

export function BookingCard({
  booking,
  onViewDetails,
  onCancel,
  onReview,
  showActions = true,
}: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-700'
      case 'COMPLETED':
        return 'bg-green-100 text-green-700'
      case 'CANCELLED':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '예약 대기'
      case 'CONFIRMED':
        return '예약 확정'
      case 'COMPLETED':
        return '서비스 완료'
      case 'CANCELLED':
        return '예약 취소'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd', { locale: ko })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-3 w-3 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-muted-foreground ml-1 text-xs">({rating.toFixed(1)})</span>
      </div>
    )
  }

  return (
    <div className="border-border bg-card rounded-lg border p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-lg font-semibold">{booking.service.name}</h3>
            <span className={`rounded-full px-2 py-1 text-xs ${getStatusColor(booking.status)}`}>
              {getStatusText(booking.status)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">{booking.amount.toLocaleString('ko-KR')}원</p>
        </div>
      </div>

      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
            <svg
              className="text-primary h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium">{formatDate(booking.date)}</p>
            <p className="text-muted-foreground text-sm">{booking.time}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
            <svg
              className="text-primary h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium">{booking.groomer.name}</p>
            {renderStars(booking.groomer.rating)}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
            <svg
              className="text-primary h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium">{booking.location.name}</p>
            <p className="text-muted-foreground text-sm">{booking.location.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
            <svg
              className="text-primary h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium">{booking.pet.name}</p>
            <p className="text-muted-foreground text-sm">{booking.pet.breed}</p>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="border-border flex gap-2 border-t pt-4">
          {onViewDetails && (
            <Button variant="outline" onClick={onViewDetails} className="flex-1">
              상세보기
            </Button>
          )}
          {booking.status === 'COMPLETED' && onReview && (
            <Button onClick={onReview} className="flex-1">
              리뷰 작성
            </Button>
          )}
          {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && onCancel && (
            <Button variant="destructive" onClick={onCancel} className="flex-1">
              예약 취소
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
