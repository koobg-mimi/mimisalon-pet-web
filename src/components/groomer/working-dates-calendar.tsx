'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Trash2 } from 'lucide-react';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export interface WorkingDate {
  date: Date;
  startTime: string;
  endTime: string;
}

interface WorkingDatesCalendarProps {
  workingDates: WorkingDate[];
  onChange: (dates: WorkingDate[]) => void;
  maxDaysInAdvance?: number;
  defaultStartTime?: string;
  defaultEndTime?: string;
}

export function WorkingDatesCalendar({
  workingDates,
  onChange,
  maxDaysInAdvance = 90,
  defaultStartTime = '09:00',
  defaultEndTime = '18:00',
}: WorkingDatesCalendarProps) {
  const [currentSelectedDate, setCurrentSelectedDate] = React.useState<Date | null>(null);

  const minDate = startOfDay(new Date());
  const maxDate = addDays(minDate, maxDaysInAdvance);

  // Get current selected date's time values
  const getCurrentTimes = () => {
    if (!currentSelectedDate) {
      return { startTime: defaultStartTime, endTime: defaultEndTime };
    }

    const dateStr = format(currentSelectedDate, 'yyyy-MM-dd', { locale: ko });
    const workingDate = workingDates.find(
      (wd) => format(wd.date, 'yyyy-MM-dd', { locale: ko }) === dateStr
    );

    return {
      startTime: workingDate?.startTime || defaultStartTime,
      endTime: workingDate?.endTime || defaultEndTime,
    };
  };

  const currentTimes = getCurrentTimes();

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const dateStr = format(date, 'yyyy-MM-dd', { locale: ko });
    const existing = workingDates.find(
      (wd) => format(wd.date, 'yyyy-MM-dd', { locale: ko }) === dateStr
    );

    if (existing) {
      // If already selected, remove it (toggle behavior)
      handleRemoveDate(date);
    } else {
      // Add new date with default times
      const newWorkingDate: WorkingDate = {
        date,
        startTime: defaultStartTime,
        endTime: defaultEndTime,
      };
      const newWorkingDates = [...workingDates, newWorkingDate].sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      );
      onChange(newWorkingDates);
      setCurrentSelectedDate(date);
    }
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    if (!currentSelectedDate) return;

    const dateStr = format(currentSelectedDate, 'yyyy-MM-dd', { locale: ko });
    const newWorkingDates = workingDates.map((wd) => {
      if (format(wd.date, 'yyyy-MM-dd', { locale: ko }) === dateStr) {
        return { ...wd, [field]: value };
      }
      return wd;
    });
    onChange(newWorkingDates);
  };

  const handleRemoveDate = (dateToRemove: Date) => {
    const dateStr = format(dateToRemove, 'yyyy-MM-dd', { locale: ko });
    const newWorkingDates = workingDates.filter(
      (wd) => format(wd.date, 'yyyy-MM-dd', { locale: ko }) !== dateStr
    );
    onChange(newWorkingDates);

    // If removed date was current, switch to next available date
    if (
      currentSelectedDate &&
      format(currentSelectedDate, 'yyyy-MM-dd', { locale: ko }) === dateStr
    ) {
      if (newWorkingDates.length > 0) {
        // Find the index of removed date
        const removedIndex = workingDates.findIndex(
          (wd) => format(wd.date, 'yyyy-MM-dd', { locale: ko }) === dateStr
        );

        // Try to select next date, or previous if it was the last
        if (removedIndex < newWorkingDates.length) {
          setCurrentSelectedDate(newWorkingDates[removedIndex].date);
        } else {
          setCurrentSelectedDate(newWorkingDates[newWorkingDates.length - 1].date);
        }
      } else {
        setCurrentSelectedDate(null);
      }
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return isBefore(date, today) || date > maxDate;
  };

  const isDateSelected = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd', { locale: ko });
    return workingDates.some((wd) => format(wd.date, 'yyyy-MM-dd', { locale: ko }) === dateStr);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            근무 날짜 선택
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Calendar
              mode="single"
              selected={undefined}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              locale={ko}
              weekStartsOn={0}
              showOutsideDays={false}
              className="rounded-md"
              modifiers={{
                selected: isDateSelected,
              }}
              modifiersClassNames={{
                selected: 'bg-primary text-primary-foreground font-semibold',
              }}
            />
          </div>
          <div className="mt-4 rounded-lg bg-blue-50 p-3">
            <p className="text-sm text-blue-900">
              • 캘린더에서 날짜를 클릭하여 추가/제거하세요
              <br />
              • 선택된 날짜를 클릭하면 하단에 시간 설정이 표시됩니다
              <br />• 최대 {maxDaysInAdvance}일 후까지 설정 가능합니다
            </p>
          </div>
        </CardContent>
      </Card>

      {currentSelectedDate && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {format(currentSelectedDate, 'M월 d일 (EEEE)', { locale: ko })} 근무 시간
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveDate(currentSelectedDate)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time" className="text-sm font-medium">
                  시작 시간
                </Label>
                <Input
                  id="start-time"
                  type="time"
                  value={currentTimes.startTime}
                  onChange={(e) => handleTimeChange('startTime', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="end-time" className="text-sm font-medium">
                  종료 시간
                </Label>
                <Input
                  id="end-time"
                  type="time"
                  value={currentTimes.endTime}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {workingDates.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarIcon className="text-muted-foreground/50 mb-4 h-12 w-12" />
            <p className="text-muted-foreground text-center">
              근무할 날짜를 선택하세요
              <br />
              <span className="text-sm">캘린더에서 날짜를 클릭하면 추가됩니다</span>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
