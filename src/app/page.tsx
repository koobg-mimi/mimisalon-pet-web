'use client'

import { useEffect } from 'react'
import { useSession } from '@/lib/auth-client'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { LandingPage } from '@/components/landing/LandingPage'

export default function Home() {
  const session = useSession()

  // Check PG service connection on app initialization
  useEffect(() => {
    const checkPGConnection = async () => {
      try {
        const response = await fetch('/api/health/pg')
        const data = await response.json()
        
        if (data.portone?.connected) {
          console.log('✅ [App Init] PG 서비스 연결 확인됨 - PortOne 활성화')
        } else {
          console.warn('⚠️ [App Init] PG 서비스 미연결 - PortOne API Secret 미설정')
        }
      } catch (error) {
        console.error('❌ [App Init] PG 서비스 연결 확인 실패:', error)
      }
    }

    checkPGConnection()
  }, [])

  if (session.isPending) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <LandingPage />
}
