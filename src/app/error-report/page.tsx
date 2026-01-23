'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { ErrorReportForm } from '@/components/error-report/ErrorReportForm'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home } from 'lucide-react'

export default function ErrorReportPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isPending) {
      setIsLoading(false)
    }
  }, [isPending])

  const handleErrorReportSubmit = () => {
    console.log('Error report submitted:')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-4 flex items-center justify-between">
            <div></div>
            <h1 className="text-2xl font-bold text-gray-900">에러 신고</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              홈으로
            </Button>
          </div>
          <p className="text-gray-600">
            문제가 발생했나요? 아래에 설명과 스크린샷을 첨부해서 알려주세요.
          </p>
        </div>

        {/* Simple Notice */}
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>참고:</strong> 개인정보는 포함하지 마시고, 스크린샷을 첨부하면 문제 해결에
            도움이 됩니다.
          </AlertDescription>
        </Alert>

        {/* Error Report Form */}
        <ErrorReportForm onSubmit={handleErrorReportSubmit} className="mb-6" />
      </div>
    </div>
  )
}
