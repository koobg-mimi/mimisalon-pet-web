'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TestTube,
  Bell,
  Users,
  Clock,
  Send,
  Calendar,
  Smartphone,
  Activity,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  name: string
  email: string
  role: 'CUSTOMER' | 'GROOMER' | 'ADMIN'
  fcmToken?: string
}

interface QueueStatus {
  waiting: number
  active: number
  completed: number
  failed: number
  delayed: number
}

interface QueueJob {
  id: string
  name: string
  data: {
    title?: string
    body?: string
    userId?: string
    type?: string
    [key: string]: unknown
  }
  state: string
  timestamp: number
  delay?: number
  attempts: number
  maxAttempts: number
}

export default function SystemTestPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()

  // FCM 알림 폼 상태
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [notificationTitle, setNotificationTitle] = useState('')
  const [notificationBody, setNotificationBody] = useState('')

  // 예약 알림 테스트 폼 상태
  const [delayMinutes, setDelayMinutes] = useState<number>(1)
  const [testNotificationTitle, setTestNotificationTitle] = useState('미미살롱 예약 알림')
  const [testNotificationBody, setTestNotificationBody] = useState('곧 예약 시간입니다!')

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
    if (session?.user?.role && session.user.role !== 'ADMIN') {
      router.push('/admin/dashboard/overview')
    }
  }, [session, router])

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      return response.json()
    },
    enabled: !!session?.user && session.user.role === 'ADMIN',
  })

  const {
    data: queueData,
    isLoading: isLoadingQueue,
    refetch: refetchQueue,
  } = useQuery({
    queryKey: ['admin', 'queue-status'],
    queryFn: async () => {
      const response = await fetch('/api/admin/notifications/queue-status')
      if (!response.ok) throw new Error('Failed to fetch queue status')
      return response.json()
    },
    enabled: !!session?.user && session.user.role === 'ADMIN',
  })

  const sendFCMMutation = useMutation({
    mutationFn: async (data: { userId: string; title: string; body: string }) => {
      const response = await fetch('/api/admin/notifications/send-fcm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'FCM 알림 전송에 실패했습니다.')
      }
      return response.json()
    },
    onSuccess: () => {
      toast.success('FCM 알림이 성공적으로 전송되었습니다!')
      setNotificationTitle('')
      setNotificationBody('')
    },
    onError: (error) => {
      console.error('FCM send error:', error)
      toast.error(error instanceof Error ? error.message : 'FCM 알림 전송 중 오류가 발생했습니다.')
    },
  })

  const scheduleTestMutation = useMutation({
    mutationFn: async (data: {
      userId: string
      delayMinutes: number
      title: string
      body: string
    }) => {
      const response = await fetch('/api/admin/notifications/schedule-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '알림 예약에 실패했습니다.')
      }
      return response.json()
    },
    onSuccess: (data, variables) => {
      toast.success(`${variables.delayMinutes}분 후 알림이 예약되었습니다! (Job ID: ${data.jobId})`)
      queryClient.invalidateQueries({ queryKey: ['admin', 'queue-status'] })
    },
    onError: (error) => {
      console.error('Schedule test error:', error)
      toast.error(error instanceof Error ? error.message : '알림 예약 중 오류가 발생했습니다.')
    },
  })

  const handleSendFCM = () => {
    if (!selectedUserId || !notificationTitle || !notificationBody) {
      toast.error('모든 필드를 입력해주세요.')
      return
    }
    sendFCMMutation.mutate({
      userId: selectedUserId,
      title: notificationTitle,
      body: notificationBody,
    })
  }

  const handleScheduleTest = () => {
    if (!selectedUserId || delayMinutes < 1) {
      toast.error('유효한 사용자와 시간을 선택해주세요.')
      return
    }
    scheduleTestMutation.mutate({
      userId: selectedUserId,
      delayMinutes,
      title: testNotificationTitle,
      body: testNotificationBody,
    })
  }

  const users = usersData?.users || []
  const queueStatus = queueData?.status || null
  const recentJobs = queueData?.recentJobs || []

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  const selectedUser = users.find((user: User) => user.id === selectedUserId)

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <TestTube className="text-primary h-6 w-6" />
          <h1 className="text-foreground text-3xl font-bold">시스템 테스트</h1>
        </div>
        <p className="text-muted-foreground">FCM 알림 및 예약 알림 시스템을 테스트하세요</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* FCM 즉시 알림 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              FCM 즉시 알림 테스트
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="user-select">대상 사용자</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="사용자를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user: User) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {user.name} ({user.email})
                        <span className="bg-muted rounded px-1 text-xs">{user.role}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedUser && (
                <p className="text-muted-foreground mt-1 text-xs">
                  FCM 토큰: {selectedUser.fcmToken ? '등록됨' : '미등록'}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="notification-title">알림 제목</Label>
              <Input
                id="notification-title"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                placeholder="알림 제목을 입력하세요"
              />
            </div>

            <div>
              <Label htmlFor="notification-body">알림 내용</Label>
              <Textarea
                id="notification-body"
                value={notificationBody}
                onChange={(e) => setNotificationBody(e.target.value)}
                placeholder="알림 내용을 입력하세요"
                rows={3}
              />
            </div>

            <Button
              onClick={handleSendFCM}
              disabled={sendFCMMutation.isPending || !selectedUserId}
              className="w-full"
            >
              {sendFCMMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  전송 중...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  FCM 알림 전송
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* BullMQ 예약 알림 테스트 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              BullMQ 예약 알림 테스트
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="delay-minutes">지연 시간 (분)</Label>
              <Input
                id="delay-minutes"
                type="number"
                min="1"
                max="60"
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(Number(e.target.value))}
                placeholder="1-60분 사이 입력"
              />
              <p className="text-muted-foreground mt-1 text-xs">
                {delayMinutes}분 후에 알림이 전송됩니다
              </p>
            </div>

            <div>
              <Label htmlFor="test-title">테스트 알림 제목</Label>
              <Input
                id="test-title"
                value={testNotificationTitle}
                onChange={(e) => setTestNotificationTitle(e.target.value)}
                placeholder="테스트 알림 제목"
              />
            </div>

            <div>
              <Label htmlFor="test-body">테스트 알림 내용</Label>
              <Textarea
                id="test-body"
                value={testNotificationBody}
                onChange={(e) => setTestNotificationBody(e.target.value)}
                placeholder="테스트 알림 내용"
                rows={3}
              />
            </div>

            <Button
              onClick={handleScheduleTest}
              disabled={scheduleTestMutation.isPending || !selectedUserId}
              className="w-full"
              variant="outline"
            >
              {scheduleTestMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  예약 중...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  {delayMinutes}분 후 알림 예약
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 시스템 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            시스템 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            <div>
              <span className="text-muted-foreground">총 사용자 수:</span>
              <p className="font-medium">{users.length}명</p>
            </div>
            <div>
              <span className="text-muted-foreground">FCM 토큰 등록 사용자:</span>
              <p className="font-medium">{users.filter((user: User) => user.fcmToken).length}명</p>
            </div>
            <div>
              <span className="text-muted-foreground">선택된 사용자:</span>
              <p className="font-medium">
                {selectedUser ? `${selectedUser.name} (${selectedUser.role})` : '없음'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 큐 상태 모니터링 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              BullMQ 큐 상태
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchQueue()}
              disabled={isLoadingQueue}
            >
              {isLoadingQueue ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              새로고침
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {queueStatus ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-5">
                <div className="rounded border p-3 text-center">
                  <div className="text-xl font-bold text-yellow-600">{queueStatus.waiting}</div>
                  <div className="text-muted-foreground">대기중</div>
                </div>
                <div className="rounded border p-3 text-center">
                  <div className="text-xl font-bold text-blue-600">{queueStatus.active}</div>
                  <div className="text-muted-foreground">처리중</div>
                </div>
                <div className="rounded border p-3 text-center">
                  <div className="text-xl font-bold text-purple-600">{queueStatus.delayed}</div>
                  <div className="text-muted-foreground">지연됨</div>
                </div>
                <div className="rounded border p-3 text-center">
                  <div className="text-xl font-bold text-green-600">{queueStatus.completed}</div>
                  <div className="text-muted-foreground">완료</div>
                </div>
                <div className="rounded border p-3 text-center">
                  <div className="text-xl font-bold text-red-600">{queueStatus.failed}</div>
                  <div className="text-muted-foreground">실패</div>
                </div>
              </div>

              {recentJobs.length > 0 && (
                <div>
                  <h4 className="mb-3 font-medium">최근 작업 목록</h4>
                  <div className="max-h-60 space-y-2 overflow-y-auto">
                    {recentJobs.map((job: QueueJob) => (
                      <div key={job.id} className="rounded border p-3 text-sm">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium">Job #{job.id}</span>
                          <span
                            className={`rounded px-2 py-1 text-xs ${
                              job.state === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : job.state === 'failed'
                                  ? 'bg-red-100 text-red-700'
                                  : job.state === 'delayed'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {job.state}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          <div>제목: {job.data?.title || job.name}</div>
                          {job.delay && <div>지연시간: {Math.round(job.delay / 1000 / 60)}분</div>}
                          <div>
                            시도: {job.attempts}/{job.maxAttempts}
                          </div>
                          <div>
                            생성:{' '}
                            {format(new Date(job.timestamp), 'yyyy-MM-dd HH:mm:ss', { locale: ko })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-muted-foreground py-4 text-center">큐 상태를 불러오는 중...</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
