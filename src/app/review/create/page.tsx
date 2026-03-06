'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LegacyCreateReviewRedirectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const bookingId = searchParams.get('bookingId')
    if (bookingId) {
      router.replace(`/customer/review/create?bookingId=${bookingId}`)
      return
    }

    router.replace('/customer/dashboard/overview')
  }, [router, searchParams])

  return null
}
