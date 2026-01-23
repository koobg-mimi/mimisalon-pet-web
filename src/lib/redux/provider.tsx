/**
 * Redux Store Provider
 * Next.js App Router와 함께 사용하기 위한 Redux Provider
 * 클라이언트 컴포넌트로 구현
 */

'use client'

import { Provider } from 'react-redux'
import { makeStore } from './store'

interface ReduxProviderProps {
  children: React.ReactNode
}

const store = makeStore()

/**
 * Redux Provider 컴포넌트
 *
 * Next.js App Router에서 Redux를 사용하기 위해
 * 클라이언트 컴포넌트로 구현된 Provider
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { ReduxProvider } from '@/lib/redux/provider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ReduxProvider>{children}</ReduxProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>
}
