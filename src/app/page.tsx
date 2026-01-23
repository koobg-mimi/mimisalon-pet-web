'use client'

import { useSession } from '@/lib/auth-client'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { LandingPage } from '@/components/landing/LandingPage'

export default function Home() {
  const session = useSession()

  if (session.isPending) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <LandingPage />
}
