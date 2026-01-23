'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { CUSTOMER_SERVICE } from '@/lib/constants/customer-service';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="bg-background flex min-h-screen items-center justify-center">
          <div className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-2xl space-y-8 text-center">
              <div className="space-y-4">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                  <span className="text-4xl">💥</span>
                </div>
                <h1 className="text-6xl font-bold text-red-600">오류</h1>
                <h2 className="text-foreground text-2xl font-semibold">
                  예상치 못한 오류가 발생했습니다
                </h2>
                <p className="text-muted-foreground text-lg">
                  애플리케이션에 심각한 문제가 발생했습니다.
                  <br />
                  페이지를 새로고침하거나 잠시 후 다시 시도해 주세요.
                </p>
              </div>

              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <details className="text-left">
                  <summary className="mb-2 cursor-pointer font-medium text-red-900">
                    기술적 세부사항
                  </summary>
                  <pre className="overflow-auto text-xs whitespace-pre-wrap text-red-800">
                    {error.message}
                    {error.digest && <div className="mt-2">Error ID: {error.digest}</div>}
                  </pre>
                </details>
              </div>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" onClick={reset}>
                  <RefreshCw className="mr-2 h-5 w-5" />
                  애플리케이션 재시작
                </Button>
                <Button variant="outline" size="lg" onClick={() => (window.location.href = '/')}>
                  홈페이지로 이동
                </Button>
              </div>

              <div className="border-border border-t pt-8">
                <div className="text-muted-foreground space-y-2 text-sm">
                  <p>
                    이 오류는 자동으로 기록되었습니다. 계속 문제가 발생하면 고객센터로 문의해
                    주세요.
                  </p>
                  {error.digest && (
                    <p className="rounded bg-gray-100 p-2 font-mono text-xs">
                      오류 ID: {error.digest}
                    </p>
                  )}
                  <div className="flex flex-col justify-center gap-4 text-sm sm:flex-row">
                    <span>{CUSTOMER_SERVICE.PHONE_DISPLAY}</span>
                    <span>{CUSTOMER_SERVICE.EMAIL_DISPLAY}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
