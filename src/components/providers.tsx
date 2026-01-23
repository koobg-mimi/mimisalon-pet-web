'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { FetchInterceptorProvider } from '@/components/providers/fetch-interceptor-provider'
import { ReduxProvider } from '@/lib/redux/provider'

/**
 * Providers Component
 *
 * better-auth doesn't require a SessionProvider wrapper.
 * Session state is managed internally through better-auth hooks.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <ReduxProvider>
      <QueryClientProvider client={queryClient}>
        <FetchInterceptorProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </FetchInterceptorProvider>
      </QueryClientProvider>
    </ReduxProvider>
  )
}
