'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PendingBooking } from '@/types/groomer';
import { Calendar, Check, Clock, MapPin, Phone, Scissors, User, X } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PendingBookingCardProps {
  booking: PendingBooking;
  onConfirm: (bookingId: string) => Promise<void>;
  onReject: (bookingId: string, reason?: string) => Promise<void>;
  isLoading?: boolean;
}

export function PendingBookingCard({
  booking,
  onConfirm,
  onReject,
  isLoading = false,
}: PendingBookingCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleConfirm = async () => {
    if (isLoading || isConfirming || isRejecting) return;

    setIsConfirming(true);
    try {
      await onConfirm(booking.id);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleReject = async () => {
    if (isLoading || isConfirming || isRejecting) return;

    setIsRejecting(true);
    try {
      await onReject(booking.id, '미용사가 예약을 거절했습니다');
    } finally {
      setIsRejecting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString + 'T00:00:00');
      return format(date, 'M월 d일 (E)', { locale: ko });
    } catch {
      return dateString;
    }
  };

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    try {
      const [hours, minutes] = startTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);

      const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
      return format(endDate, 'HH:mm', { locale: ko });
    } catch {
      return '';
    }
  };

  const totalServices = booking.pets.reduce((total, pet) => total + pet.services.length, 0);

  return (
    <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Header with booking number and status */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 animate-pulse rounded-full bg-amber-500"></div>
          <span className="text-sm font-medium text-amber-700">
            예약번호: {booking.bookingNumber}
          </span>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {booking.totalPrice.toLocaleString('ko-KR')}원
          </div>
          <div className="text-sm text-gray-500">총 {totalServices}개 서비스</div>
        </div>
      </div>

      {/* Date and Time */}
      <div className="mb-4 flex items-center gap-4 text-gray-700">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{formatDate(booking.serviceDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{booking.serviceTime}</span>
          {booking.estimatedDurationMinutes && (
            <span className="font-medium">
              ~ {calculateEndTime(booking.serviceTime, booking.estimatedDurationMinutes)}
            </span>
          )}
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{booking.customer.name}</span>
        </div>
        {booking.customer.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{booking.customer.phone}</span>
          </div>
        )}
      </div>

      {/* Customer Address */}
      {booking.customer.address && (
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{booking.customer.address}</span>
        </div>
      )}

      {/* Pets and Services */}
      <div className="mb-4">
        <div className="mb-3 flex items-center gap-2">
          <Scissors className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-700">펫별 서비스</span>
        </div>
        <div className="ml-6 space-y-4">
          {booking.pets.map((pet, petIndex) => (
            <div key={petIndex} className="border-l-2 border-gray-200 pl-4">
              <div className="mb-2 font-medium text-gray-800">
                {pet.name} {pet.breed && `(${pet.breed})`}
              </div>
              <div className="ml-2 space-y-1">
                {pet.services.map((service, serviceIndex) => (
                  <div key={serviceIndex} className="flex justify-between text-sm">
                    <span className="text-gray-700">{service.name}</span>
                    <span className="font-medium text-gray-600">
                      {service.price.toLocaleString()}원
                    </span>
                  </div>
                ))}
                {pet.options && pet.options.length > 0 && (
                  <>
                    <div className="mt-1 border-t border-gray-100 pt-1">
                      <span className="text-xs font-medium text-gray-500">추가 옵션</span>
                    </div>
                    {pet.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex justify-between text-sm">
                        <span className="text-gray-600">+ {option.name}</span>
                        <span className="font-medium text-gray-600">
                          {option.price.toLocaleString()}원
                        </span>
                      </div>
                    ))}
                  </>
                )}
                <div className="flex justify-between border-t border-gray-100 pt-1 text-sm font-medium">
                  <span className="text-gray-600">소계</span>
                  <span className="text-gray-700">
                    {(
                      pet.services.reduce((sum, service) => sum + service.price, 0) +
                      (pet.options?.reduce((sum, option) => sum + option.price, 0) || 0)
                    ).toLocaleString()}
                    원
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Requests */}
      {booking.specialRequests && (
        <div className="mb-4 rounded-lg bg-blue-50 p-3">
          <div className="mb-1 text-sm font-medium text-blue-700">특별 요청사항</div>
          <div className="text-sm text-blue-600">{booking.specialRequests}</div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 border-t border-amber-200 pt-4">
        <Button
          onClick={handleReject}
          variant="outline"
          disabled={isLoading || isConfirming || isRejecting}
          className="flex-1 border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50"
        >
          {isRejecting ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <X className="mr-2 h-4 w-4" />
          )}
          거절
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isLoading || isConfirming || isRejecting}
          className="flex-1 bg-green-600 text-white hover:bg-green-700"
        >
          {isConfirming ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          예약 확정
        </Button>
      </div>
    </div>
  );
}
