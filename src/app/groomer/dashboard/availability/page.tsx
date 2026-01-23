'use client'

import { ko } from 'date-fns/locale'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { WorkingDatesCalendar, WorkingDate } from '@/components/groomer/working-dates-calendar'
import { addDays, format } from 'date-fns'
import { Save } from 'lucide-react'
import Link from 'next/link'
import { type GroomerWorkingDate } from '@/app/api/groomer/working-dates/route'

export default function GroomerAvailabilityPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [workingDates, setWorkingDates] = useState<WorkingDate[]>([])

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
    if (session?.user?.role && session.user.role !== 'GROOMER') {
      router.push('/dashboard')
    }
  }, [session, router])

  // Fetch working dates for the next 90 days
  const { data: fetchedDates, isLoading } = useQuery<GroomerWorkingDate[]>({
    queryKey: ['groomer', 'working-dates'],
    queryFn: async () => {
      const today = new Date()
      const endDate = addDays(today, 30)

      const response = await fetch(
        `/api/groomer/working-dates?startDate=${format(today, 'yyyy-MM-dd', { locale: ko })}&endDate=${format(endDate, 'yyyy-MM-dd', { locale: ko })}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch working dates')
      }
      return response.json()
    },
    enabled: !!session?.user && session.user.role === 'GROOMER',
  })

  useEffect(() => {
    if (fetchedDates) {
      const dates: WorkingDate[] = fetchedDates.map((wd) => ({
        date: new Date(wd.date),
        startTime: wd.startTime,
        endTime: wd.endTime,
      }))
      setWorkingDates(dates)
    }
  }, [fetchedDates])

  const saveWorkingDatesMutation = useMutation({
    mutationFn: async (dates: WorkingDate[]) => {
      const payload = {
        workingDates: dates.map((wd) => ({
          date: format(wd.date, 'yyyy-MM-dd', { locale: ko }),
          startTime: wd.startTime,
          endTime: wd.endTime,
          slotDuration: 30,
        })),
      }

      const response = await fetch('/api/groomer/working-dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save working dates')
      }

      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['groomer', 'working-dates'] })
      alert(data.message || '근무 날짜가 저장되었습니다.')
    },
    onError: (error: Error) => {
      alert(error.message || '저장 중 오류가 발생했습니다.')
    },
  })

  const handleSave = () => {
    saveWorkingDatesMutation.mutate(workingDates)
  }

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'GROOMER') {
    return null
  }

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground text-2xl font-bold">근무 일정 설정</h1>
              <p className="text-muted-foreground text-sm">
                특정 날짜를 선택하여 근무 시간을 설정하세요
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/groomer/dashboard/bookings">예약 관리</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/groomer/dashboard/overview">대시보드</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <WorkingDatesCalendar
          workingDates={workingDates}
          onChange={setWorkingDates}
          maxDaysInAdvance={90}
          defaultStartTime="09:00"
          defaultEndTime="18:00"
        />

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saveWorkingDatesMutation.isPending}
            className="flex items-center gap-2"
            size="lg"
          >
            {saveWorkingDatesMutation.isPending ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saveWorkingDatesMutation.isPending ? '저장 중...' : '변경사항 저장'}
          </Button>
        </div>
      </main>
    </div>
  )
}
