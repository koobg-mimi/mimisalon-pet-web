interface BookingStatusProps {
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function BookingStatus({ status, size = 'md', showIcon = false }: BookingStatusProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          text: '예약 대기',
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      case 'CONFIRMED':
        return {
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          text: '예약 확정',
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      case 'COMPLETED':
        return {
          color: 'bg-green-100 text-green-700 border-green-200',
          text: '서비스 완료',
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
        };
      case 'CANCELLED':
        return {
          color: 'bg-red-100 text-red-700 border-red-200',
          text: '예약 취소',
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ),
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          text: status,
          icon: null,
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${config.color} ${sizeClasses}`}
    >
      {showIcon && config.icon}
      {config.text}
    </span>
  );
}
