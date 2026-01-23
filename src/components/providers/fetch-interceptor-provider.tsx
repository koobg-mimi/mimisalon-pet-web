/**
 * Fetch Interceptor Provider
 *
 * Client component that installs the global fetch interceptor on mount.
 * Should be included in the root layout.
 *
 * @module components/providers/fetch-interceptor-provider
 */

'use client';

import { useEffect } from 'react';
import { installFetchInterceptor } from '@/lib/global-fetch-interceptor';

/**
 * Provider component that installs fetch interceptor
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * <FetchInterceptorProvider>
 *   {children}
 * </FetchInterceptorProvider>
 * ```
 */
export function FetchInterceptorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Install fetch interceptor on mount
    installFetchInterceptor();

    // Cleanup is optional - usually we want to keep it installed
    // return () => {
    //   uninstallFetchInterceptor();
    // };
  }, []);

  return <>{children}</>;
}
