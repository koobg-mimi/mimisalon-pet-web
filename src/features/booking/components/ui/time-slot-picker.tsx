'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TimeSlot {
  time: string
  available: boolean
  isBooked?: boolean
  reason?: string // 예: "이미 예약됨", "운영시간 외"
}

interface TimeSlotPickerProps {
  groomerName: string
  timeSlots: TimeSlot[]
  selectedTime?: string
  estimatedDuration?: number // 분 단위
  onTimeSelect: (time: string) => void
  className?: string
  workingHoursStart?: string // HH:mm format (e.g., "09:00")
  workingHoursEnd?: string // HH:mm format (e.g., "18:00")
}

export function TimeSlotPicker({
  groomerName,
  timeSlots,
  selectedTime,
  estimatedDuration = 60,
  onTimeSelect,
  className,
  workingHoursStart = '09:00',
  workingHoursEnd = '18:00',
}: TimeSlotPickerProps) {
  // 미용사 운영 시간에 따른 30분 단위 슬롯 생성
  const generateTimeSlots = (
    startTime: string = workingHoursStart,
    endTime: string = workingHoursEnd
  ) => {
    const slots: string[] = []

    // Parse start and end times
    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)

    const startMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute

    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      const hour = Math.floor(minutes / 60)
      const minute = minutes % 60
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      slots.push(timeString)
    }

    return slots
  }

  const allSlots = generateTimeSlots()

  const getSlotStatus = (time: string) => {
    const slot = timeSlots.find((ts) => ts.time === time)
    return {
      available: slot?.available ?? true,
      isBooked: slot?.isBooked ?? false,
      reason: slot?.reason || (slot?.isBooked ? '이미 예약됨' : undefined),
    }
  }

  // 시간을 분 단위로 변환
  const timeToMinutes = (time: string): number => {
    const [hour, minute] = time.split(':').map(Number)
    return hour * 60 + minute
  }

  // 분을 시간 문자열로 변환
  const minutesToTime = (minutes: number): string => {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }

  // 선택된 시간부터 서비스 소요시간까지의 시간 슬롯 배열 생성
  const getTimeRangeSlots = (startTime: string, duration: number): string[] => {
    if (!startTime) return []

    const startMinutes = timeToMinutes(startTime)
    const endMinutes = startMinutes + duration
    const slots: string[] = []

    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      const timeSlot = minutesToTime(minutes)
      // 유효한 시간 슬롯인지 확인 (생성된 슬롯 목록에 있는지)
      if (allSlots.includes(timeSlot)) {
        slots.push(timeSlot)
      }
    }

    return slots
  }

  // 현재 선택된 시간 범위 슬롯들
  const selectedTimeRange = selectedTime ? getTimeRangeSlots(selectedTime, estimatedDuration) : []

  // 특정 시간이 선택된 범위에 포함되는지 확인
  const isInSelectedRange = (time: string): boolean => {
    return selectedTimeRange.includes(time)
  }

  // 특정 시간이 선택 범위의 시작인지 확인
  const isRangeStart = (time: string): boolean => {
    return selectedTime === time
  }

  // 특정 시간이 선택 범위의 끝인지 확인
  const isRangeEnd = (time: string): boolean => {
    return selectedTimeRange.length > 0 && selectedTimeRange[selectedTimeRange.length - 1] === time
  }

  // 서비스 시간이 업무 마감 시간을 넘어가는지 확인
  const wouldExceedBusinessHours = (startTime: string, duration: number): boolean => {
    const startMinutes = timeToMinutes(startTime)
    const endMinutes = startMinutes + duration
    const businessEnd = timeToMinutes(workingHoursEnd) // 미용사 업무 마감 시간

    // 서비스 종료 시간이 업무 마감 시간을 넘는 경우
    return endMinutes > businessEnd
  }

  // 특정 시간에 서비스를 시작할 수 있는지 확인
  const canStartServiceAt = (time: string): boolean => {
    const status = getSlotStatus(time)

    // 기본적으로 사용 불가능한 시간
    if (!status.available || status.isBooked) return false

    // 서비스 진행 중에 예약된 시간이 있는지 확인
    const requiredSlots = getTimeRangeSlots(time, estimatedDuration)
    for (const slot of requiredSlots) {
      const slotStatus = getSlotStatus(slot)
      if (!slotStatus.available || slotStatus.isBooked) {
        return false
      }
    }

    // 업무시간 초과는 경고만 표시하고 선택은 가능하게 함
    // (실제 예약 시 백엔드에서 최종 검증)
    return true
  }

  const renderTimeButton = (time: string) => {
    const status = getSlotStatus(time)
    const isStartTime = isRangeStart(time)
    const canStart = canStartServiceAt(time)
    const wouldExceedHours = wouldExceedBusinessHours(time, estimatedDuration)

    // 비활성화 조건: 기본 불가 또는 이미 예약됨
    const isDisabled = !canStart || status.isBooked

    return (
      <Button
        key={time}
        variant={isStartTime ? 'default' : 'outline'}
        size="sm"
        disabled={isDisabled}
        onClick={() => {
          // 이중 체크: disabled 상태에서는 클릭 이벤트를 무시
          if (!isDisabled) {
            onTimeSelect(time)
          }
        }}
        aria-disabled={isDisabled}
        className={cn(
          'relative h-10 text-xs font-medium transition-all',

          // 1. 선택된 시작 시간 스타일링
          isStartTime &&
            !status.isBooked &&
            'bg-primary text-primary-foreground ring-primary font-bold shadow-md ring-2 ring-offset-2',

          // 2. 이미 예약된 시간
          status.isBooked && 'border-gray-500 bg-gray-300 text-gray-700 line-through opacity-70',

          // 3. 업무시간 초과 충돌 (선택되지 않은 시간만)
          wouldExceedHours &&
            !status.isBooked &&
            !isStartTime &&
            'border-orange-300 bg-orange-100 text-orange-700 opacity-60',

          // 4. 기본 호버 상태 (활성화된 경우만)
          !isStartTime &&
            canStart &&
            !status.isBooked &&
            'hover:bg-primary/10 hover:border-primary',

          // 5. 비활성화 스타일 (마지막)
          isDisabled && 'pointer-events-none cursor-not-allowed opacity-50'
        )}
        title={
          status.isBooked
            ? `이미 예약된 시간입니다: ${time}`
            : wouldExceedHours
              ? `서비스가 업무 마감시간(${workingHoursEnd})을 초과함`
              : !status.available
                ? status.reason
                : isStartTime
                  ? `선택된 시작 시간: ${time}`
                  : undefined
        }
      >
        {time}
        {/* 예약된 시간 표시 */}
        {status.isBooked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute h-0.5 w-full bg-gray-600"></div>
          </div>
        )}
      </Button>
    )
  }

  const getEstimatedEndTime = (startTime: string) => {
    if (!startTime) return null

    const [hour, minute] = startTime.split(':').map(Number)
    const startDate = new Date()
    startDate.setHours(hour, minute, 0, 0)

    const endDate = new Date(startDate.getTime() + estimatedDuration * 60 * 1000)
    const endHour = endDate.getHours().toString().padStart(2, '0')
    const endMinute = endDate.getMinutes().toString().padStart(2, '0')

    return `${endHour}:${endMinute}`
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="text-primary h-5 w-5" />
          {groomerName} 미용사 예약 시간 선택
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* 전체 시간 슬롯 그리드 */}
        <div className="space-y-4">
          {/* 통합된 시간 표시 */}
          <div>
            <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium">
              <span className="bg-primary/10 text-primary rounded px-2 py-1 text-xs">
                예약 가능 시간
              </span>
              <span className="text-xs">
                {workingHoursStart} - {workingHoursEnd}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 md:grid-cols-6 lg:grid-cols-8">
              {allSlots.map((time) => renderTimeButton(time))}
            </div>
          </div>
        </div>

        {/* 범례 */}
        <div className="border-border mt-6 border-t pt-4">
          <div className="grid grid-cols-2 gap-3 text-xs md:grid-cols-3">
            <div className="flex items-center gap-2">
              <div className="border-border bg-background h-3 w-3 rounded border"></div>
              <span className="text-muted-foreground">예약 가능</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="border-primary bg-primary ring-primary h-3 w-3 rounded border-2 ring-1"></div>
              <span className="text-muted-foreground">선택된 시간</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border border-orange-200 bg-orange-50"></div>
              <span className="text-muted-foreground">마감시간 초과</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative h-3 w-3 rounded border border-gray-400 bg-gray-200">
                <span className="absolute inset-0 flex items-center justify-center text-xs leading-none text-gray-600">
                  X
                </span>
              </div>
              <span className="text-muted-foreground">이미 예약됨</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="border-border bg-muted h-3 w-3 rounded border opacity-50"></div>
              <span className="text-muted-foreground">예약 불가</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
