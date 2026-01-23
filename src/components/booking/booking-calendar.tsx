'use client';

import { ko } from 'date-fns/locale';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked: boolean;
  groomerId: string;
  groomerName: string;
  price: number;
  estimatedDuration: number;
}

interface DayAvailability {
  date: string;
  isAvailable: boolean;
  timeSlots: TimeSlot[];
  specialNote?: string;
}

interface BookingCalendarProps {
  selectedServices: Array<{
    id: string;
    name: string;
    duration: number;
    price: number;
  }>;
  petId: string;
  onTimeSlotSelect: (date: string, timeSlot: TimeSlot) => void;
  selectedDate?: string;
  selectedTimeSlot?: TimeSlot;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

export function BookingCalendar({
  selectedServices,
  petId,
  onTimeSlotSelect,
  selectedDate,
  selectedTimeSlot,
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState<Record<string, DayAvailability>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'slots'>('calendar');

  const totalDuration = selectedServices.reduce((acc, service) => acc + service.duration, 0);
  const totalPrice = selectedServices.reduce((acc, service) => acc + service.price, 0);

  // 달력 날짜 생성
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startCalendar = new Date(firstDay);
    startCalendar.setDate(startCalendar.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startCalendar);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  // 예약 가능 시간 조회
  useEffect(() => {
    const fetchAvailability = async () => {
      if (selectedServices.length === 0) return;

      setIsLoading(true);
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const response = await fetch('/api/booking/availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate: format(firstDay, 'yyyy-MM-dd', { locale: ko }),
            endDate: format(lastDay, 'yyyy-MM-dd', { locale: ko }),
            services: selectedServices.map((s) => s.id),
            petId,
            totalDuration,
          }),
        });

        if (!response.ok) {
          throw new Error('예약 가능 시간을 불러오는데 실패했습니다');
        }

        const data = await response.json();
        setAvailability(data);
      } catch (error) {
        console.error('Error fetching availability:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [currentDate, selectedServices, petId, totalDuration]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const getDayAvailability = (date: Date) => {
    const dateStr = formatDate(date);
    return availability[dateStr];
  };

  const handleDateSelect = (date: Date) => {
    if (isPastDate(date) || !isCurrentMonth(date)) return;

    const dayAvail = getDayAvailability(date);
    if (!dayAvail?.isAvailable) return;

    setViewMode('slots');
  };

  const handleTimeSlotSelect = (date: string, timeSlot: TimeSlot) => {
    onTimeSlotSelect(date, timeSlot);
    setViewMode('calendar');
  };

  const getSelectedDateAvailability = () => {
    if (!selectedDate) return null;
    return availability[selectedDate];
  };

  const calendarDays = generateCalendarDays();
  const selectedDateAvail = getSelectedDateAvailability();

  if (selectedServices.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4 text-center">
            <CalendarIcon className="text-muted-foreground mx-auto h-12 w-12" />
            <h3 className="text-lg font-semibold">날짜를 선택하세요</h3>
            <p className="text-muted-foreground">먼저 서비스를 선택한 후 예약 날짜를 선택하세요.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 선택된 서비스 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">선택된 서비스</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {selectedServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-muted-foreground text-sm">{service.duration}분</p>
                </div>
                <p className="font-semibold">{service.price.toLocaleString()}원</p>
              </div>
            ))}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">총 {totalDuration}분</span>
                  </div>
                </div>
                <p className="text-lg font-bold">{totalPrice.toLocaleString('ko-KR')}원</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 달력 및 시간 선택 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>{viewMode === 'calendar' ? '날짜 선택' : '시간 선택'}</span>
            </CardTitle>
            {viewMode === 'slots' && (
              <Button variant="outline" size="sm" onClick={() => setViewMode('calendar')}>
                달력으로 돌아가기
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'calendar' ? (
            <div className="space-y-4">
              {/* 월 네비게이션 */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  disabled={isLoading}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <h3 className="text-xl font-semibold">
                  {currentDate.getFullYear()}년 {MONTHS[currentDate.getMonth()]}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  disabled={isLoading}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>

              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-1">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="text-muted-foreground flex h-10 items-center justify-center text-sm font-medium"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* 달력 그리드 */}
              {isLoading ? (
                <div className="grid min-h-[240px] grid-cols-7 place-items-center gap-1">
                  <div className="col-span-7 flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((date, index) => {
                    const dateStr = formatDate(date);
                    const dayAvail = getDayAvailability(date);
                    const isPast = isPastDate(date);
                    const isCurrent = isCurrentMonth(date);
                    const isSelectedDate = selectedDate === dateStr;
                    const hasAvailableSlots =
                      dayAvail?.timeSlots?.some((slot) => slot.isAvailable) || false;

                    return (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(date)}
                        disabled={isPast || !isCurrent || !dayAvail?.isAvailable}
                        className={cn(
                          'relative h-10 w-full rounded-md text-sm transition-colors',
                          'hover:bg-accent focus:ring-ring focus:ring-2 focus:outline-none',
                          {
                            'text-muted-foreground': !isCurrent,
                            'bg-primary text-primary-foreground': isSelectedDate,
                            'bg-muted text-muted-foreground cursor-not-allowed': isPast,
                            'border-2 border-blue-500': isToday(date) && !isSelectedDate,
                            'cursor-pointer': isCurrent && dayAvail?.isAvailable && !isPast,
                            'opacity-50': !dayAvail?.isAvailable && isCurrent && !isPast,
                          }
                        )}
                      >
                        <span>{date.getDate()}</span>
                        {hasAvailableSlots && isCurrent && !isPast && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 transform">
                            <div className="h-1 w-1 rounded-full bg-green-500" />
                          </div>
                        )}
                        {dayAvail?.specialNote && (
                          <div className="absolute top-1 right-1">
                            <AlertCircleIcon className="h-3 w-3 text-orange-500" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 범례 */}
              <div className="text-muted-foreground flex items-center justify-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>예약 가능</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span>오늘</span>
                </div>
                <div className="flex items-center space-x-1">
                  <AlertCircleIcon className="h-3 w-3 text-orange-500" />
                  <span>특별 안내</span>
                </div>
              </div>
            </div>
          ) : (
            // 시간 슬롯 선택
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {selectedDate && format(new Date(selectedDate), 'yyyy-MM-dd', { locale: ko })}
                </h3>
                <p className="text-muted-foreground text-sm">원하는 시간을 선택하세요</p>
              </div>

              {selectedDateAvail?.specialNote && (
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircleIcon className="h-4 w-4 text-orange-600" />
                    <p className="text-sm text-orange-800">{selectedDateAvail.specialNote}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {selectedDateAvail?.timeSlots
                  ?.filter((slot) => slot.isAvailable)
                  .map((timeSlot) => (
                    <button
                      key={timeSlot.id}
                      onClick={() => handleTimeSlotSelect(selectedDate!, timeSlot)}
                      className={cn(
                        'hover:bg-accent rounded-lg border p-4 text-left transition-colors',
                        {
                          'border-primary bg-primary/5': selectedTimeSlot?.id === timeSlot.id,
                        }
                      )}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="text-muted-foreground h-4 w-4" />
                            <span className="font-medium">
                              {timeSlot.startTime} - {timeSlot.endTime}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {timeSlot.estimatedDuration}분
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <UserIcon className="text-muted-foreground h-4 w-4" />
                          <span className="text-muted-foreground text-sm">
                            {timeSlot.groomerName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            종료 시간:{' '}
                            {format(
                              new Date(
                                parseISO(`${selectedDate}T${timeSlot.startTime}`).getTime() +
                                  totalDuration * 60000
                              ),
                              'HH:mm:ss',
                              { locale: ko }
                            )}
                          </span>
                          <span className="text-primary font-semibold">
                            {timeSlot.price.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>

              {selectedDateAvail?.timeSlots?.filter((slot) => slot.isAvailable).length === 0 && (
                <div className="space-y-4 py-8 text-center">
                  <AlertCircleIcon className="text-muted-foreground mx-auto h-12 w-12" />
                  <h3 className="text-lg font-semibold">예약 가능한 시간이 없습니다</h3>
                  <p className="text-muted-foreground">다른 날짜를 선택해주세요.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 예약 정보 요약 */}
      {selectedDate && selectedTimeSlot && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-primary text-lg">예약 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">예약 날짜</span>
                <span>{format(new Date(selectedDate), 'yyyy-MM-dd', { locale: ko })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">예약 시간</span>
                <span>
                  {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">담당 미용사</span>
                <span>{selectedTimeSlot.groomerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">총 소요시간</span>
                <span>{totalDuration}분</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2 text-lg font-semibold">
                <span>총 금액</span>
                <span>{totalPrice.toLocaleString('ko-KR')}원</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
