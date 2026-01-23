/**
 * 예약 Step 3: 날짜/시간/미용사 선택 (Redux 기반)
 */

'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { type Groomer, GroomerCard } from '@/features/booking/components/ui/groomer-card'
import { type TimeSlot, TimeSlotPicker } from '@/features/booking/components/ui/time-slot-picker'
import { useAppSelector } from '@/lib/redux/hooks'

interface DateTimeGroomerStepProps {
  /** 예상 소요시간 (분) */
  estimatedDuration: number
  /** 미용사 목록 */
  groomers: Groomer[]
  /** 미용사 로딩 상태 */
  isLoadingGroomers: boolean
  /** 가용 시간대 목록 */
  availableTimeSlots: (TimeSlot & { groomerId: string })[]
  /** 미용사 페이지네이션 */
  groomerPagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  /** 날짜 선택 핸들러 (추가 로직을 위해 유지) */
  onDateChange: (date: Date | undefined) => void
  /** 미용사 선택 핸들러 (추가 로직을 위해 유지) */
  onGroomerSelect: (groomerId: string) => void
  /** 시간 선택 핸들러 (추가 로직을 위해 유지) */
  onTimeSelect: (time: string) => void
  /** 미용사 페이지 변경 핸들러 (추가 로직을 위해 유지) */
  onGroomerPageChange: (page: number) => void
  /** 특별 요청사항 변경 핸들러 (추가 로직을 위해 유지) */
  onSpecialRequestsChange: (value: string) => void
}

/**
 * 날짜/시간/미용사 선택 단계
 *
 * Redux에서 selectedDate, selectedGroomerId, selectedTimeSlot 등을 직접 가져옴
 */
export function DateTimeGroomerStep({
  estimatedDuration,
  groomers,
  isLoadingGroomers,
  availableTimeSlots,
  groomerPagination,
  onDateChange,
  onGroomerSelect,
  onTimeSelect,
  onGroomerPageChange,
  onSpecialRequestsChange,
}: DateTimeGroomerStepProps) {
  // Redux 상태 가져오기
  const selectedDate = useAppSelector((state) => state.booking.formData.date)
  const selectedGroomerId = useAppSelector((state) => state.booking.formData.groomerId)
  const selectedTimeSlot = useAppSelector((state) => state.booking.formData.timeSlot)
  const currentGroomerPage = useAppSelector((state) => state.booking.currentGroomerPage)
  const specialRequests = useAppSelector((state) => state.booking.formData.specialRequests)
  const selectedGroomer = groomers.find((g) => g.id === selectedGroomerId)

  /**
   * 안전하게 문자열 날짜를 Date 객체로 변환
   * 빈 문자열이나 잘못된 형식은 undefined를 반환
   */
  const safeParseDate = (dateString: string): Date | undefined => {
    if (!dateString || dateString.trim() === '') return undefined
    const parsed = new Date(dateString)
    // Invalid Date 체크
    if (isNaN(parsed.getTime())) return undefined
    return parsed
  }

  /**
   * 특정 미용사의 가용 시간대 조회
   */
  const getGroomerTimeSlots = (groomerId: string): TimeSlot[] => {
    return availableTimeSlots
      .filter((slot) => slot.groomerId === groomerId)
      .map((slot) => ({
        time: slot.time,
        available: slot.available,
        isBooked: slot.isBooked || false,
        reason: !slot.available ? (slot.isBooked ? '이미 예약됨' : '예약 불가') : undefined,
      }))
  }

  return (
    <div className="space-y-8">
      {/* 캘린더 선택 */}
      <Card className="overflow-hidden p-0 sm:p-6">
        <div className="space-y-6">
          <div className="px-4 pt-4 sm:px-0 sm:pt-0">
            <Label className="text-lg font-medium">날짜 선택</Label>
            <p className="text-muted-foreground mt-1 text-sm">
              원하는 날짜를 달력에서 직접 선택하세요
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* 캘린더 */}
            <div className="-mx-4 flex-shrink-0 px-0 sm:mx-0 sm:px-0">
              <Calendar
                mode="single"
                selected={safeParseDate(selectedDate)}
                onSelect={onDateChange}
                disabled={(date) => {
                  const today = new Date()
                  const maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                  return date < today || date > maxDate
                }}
                locale={ko}
                weekStartsOn={0}
                showOutsideDays={false}
                fixedWeeks
                className="w-full rounded-none border border-x-0 sm:w-auto sm:rounded-md sm:border-x"
                modifiers={{
                  today: (date) => {
                    const today = new Date()
                    return date.toDateString() === today.toDateString()
                  },
                }}
                modifiersClassNames={{
                  today: 'bg-accent text-accent-foreground font-semibold',
                }}
              />
            </div>

            {/* 선택된 날짜 정보 */}
            <div className="flex-1 space-y-4 px-4 sm:px-0">
              {selectedDate && safeParseDate(selectedDate) ? (
                <Card className="border-primary bg-primary/5">
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <CalendarDays className="text-primary h-5 w-5" />
                      <div>
                        <h3 className="text-primary font-semibold">선택된 날짜</h3>
                        <p className="text-muted-foreground text-sm">
                          {format(safeParseDate(selectedDate)!, 'yyyy년 M월 d일 (EEEE)', {
                            locale: ko,
                          })}
                          {safeParseDate(selectedDate)!.toDateString() ===
                            new Date().toDateString() && ' (오늘)'}
                        </p>
                      </div>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      이 날짜에 서비스 가능한 미용사를 확인하고 시간을 선택하세요.
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-4 text-center sm:p-8">
                    <CalendarDays className="text-muted-foreground mx-auto mb-3 h-10 w-10 sm:mb-4 sm:h-12 sm:w-12" />
                    <h3 className="text-muted-foreground mb-2 font-medium">날짜를 선택해주세요</h3>
                    <p className="text-muted-foreground text-sm">
                      <span className="sm:hidden">위의</span>
                      <span className="hidden sm:inline">왼쪽</span> 달력에서 원하는 날짜를
                      클릭하세요
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="text-muted-foreground bg-muted/50 rounded-lg p-3 text-xs">
                <p className="mb-1 font-medium">📅 예약 가능 기간</p>
                <p>• 오늘부터 최대 1개월 후까지 예약 가능합니다</p>
                <p>• 과거 날짜는 선택할 수 없습니다</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 미용사 선택 */}
      {selectedDate && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold">미용사 선택</h3>
                <p className="text-muted-foreground text-sm">
                  {selectedDate} (
                  {safeParseDate(selectedDate) &&
                    format(safeParseDate(selectedDate)!, 'EEEE', { locale: ko })}
                  )에 서비스 가능한 미용사를 선택하세요
                </p>
              </div>

              {isLoadingGroomers ? (
                <div className="py-8 text-center">
                  <LoadingSpinner size="lg" />
                  <p className="text-muted-foreground mt-4">미용사 정보를 불러오는 중...</p>
                </div>
              ) : groomers.length > 0 ? (
                <div className="space-y-6">
                  {/* 미용사 그리드 */}
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {groomers.map((groomer) => (
                      <GroomerCard
                        key={groomer.id}
                        groomer={groomer}
                        isSelected={selectedGroomerId === groomer.id}
                        onSelect={onGroomerSelect}
                      />
                    ))}
                  </div>

                  {/* 페이지네이션 */}
                  {groomerPagination && groomerPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <div className="text-muted-foreground text-sm">
                        총 {groomerPagination.totalItems}명의 미용사 중{' '}
                        {(groomerPagination.currentPage - 1) * groomerPagination.itemsPerPage + 1}-
                        {Math.min(
                          groomerPagination.currentPage * groomerPagination.itemsPerPage,
                          groomerPagination.totalItems
                        )}
                        명 표시
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onGroomerPageChange(currentGroomerPage - 1)}
                          disabled={!groomerPagination.hasPreviousPage || isLoadingGroomers}
                        >
                          이전
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: groomerPagination.totalPages }, (_, i) => i + 1)
                            .filter((page) => {
                              return (
                                Math.abs(page - groomerPagination.currentPage) <= 2 ||
                                page === 1 ||
                                page === groomerPagination.totalPages
                              )
                            })
                            .map((page, index, arr) => (
                              <div key={page} className="flex items-center">
                                {index > 0 && arr[index - 1] !== page - 1 && (
                                  <span className="text-muted-foreground px-2">...</span>
                                )}
                                <Button
                                  variant={
                                    page === groomerPagination.currentPage ? 'default' : 'outline'
                                  }
                                  size="sm"
                                  onClick={() => onGroomerPageChange(page)}
                                  disabled={isLoadingGroomers}
                                  className="min-w-[32px]"
                                >
                                  {page}
                                </Button>
                              </div>
                            ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onGroomerPageChange(currentGroomerPage + 1)}
                          disabled={!groomerPagination.hasNextPage || isLoadingGroomers}
                        >
                          다음
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <svg
                      className="text-muted-foreground h-8 w-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-medium">
                    서비스 가능한 미용사가 없습니다
                  </h3>
                  <p className="text-muted-foreground">
                    해당 지역과 날짜에 서비스 가능한 미용사를 찾지 못했습니다. 다른 날짜를
                    선택해주세요.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* 시간 선택 - 미용사 선택 후에만 표시 */}
          {selectedGroomer && (
            <TimeSlotPicker
              groomerName={selectedGroomer.name}
              timeSlots={getGroomerTimeSlots(selectedGroomer.id)}
              selectedTime={selectedTimeSlot}
              estimatedDuration={estimatedDuration}
              onTimeSelect={onTimeSelect}
              workingHoursStart={selectedGroomer.schedule?.workingHoursStart}
              workingHoursEnd={selectedGroomer.schedule?.workingHoursEnd}
            />
          )}
        </div>
      )}

      {/* 선택된 예약 정보 요약 */}
      {selectedDate && selectedGroomerId && selectedTimeSlot && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">선택된 예약 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-green-600">미용사</p>
                <p className="text-green-800">{selectedGroomer?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">날짜</p>
                <p className="text-green-800">
                  {selectedDate} (
                  {safeParseDate(selectedDate) &&
                    format(safeParseDate(selectedDate)!, 'EEE', { locale: ko })}
                  )
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">시간</p>
                <p className="text-green-800">{selectedTimeSlot}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 특별 요청사항 */}
      <Card className="p-6">
        <div className="space-y-4">
          <Label htmlFor="specialRequests" className="text-lg font-medium">
            특별 요청사항
          </Label>
          <textarea
            id="specialRequests"
            value={specialRequests}
            onChange={(e) => onSpecialRequestsChange(e.target.value)}
            rows={4}
            placeholder="미용사에게 전달할 특별한 요청사항이 있으시면 입력해주세요..."
            className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none"
          />
          <p className="text-muted-foreground text-sm">
            반려동물의 특성, 주의사항, 선호하는 스타일 등을 자유롭게 입력해주세요.
          </p>
        </div>
      </Card>
    </div>
  )
}
