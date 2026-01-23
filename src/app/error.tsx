'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.084 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-foreground text-2xl font-bold">오류가 발생했습니다</h1>
          <p className="text-muted-foreground">
            예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={reset} className="w-full">
            다시 시도
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')} className="w-full">
            홈으로 돌아가기
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 rounded-lg bg-red-50 p-4 text-left">
            <h3 className="mb-2 font-semibold text-red-900">개발 모드 - 오류 정보</h3>
            <div className="space-y-1 text-sm text-red-800">
              <p>
                <strong>메시지:</strong> {error.message}
              </p>
              {error.digest && (
                <p>
                  <strong>Digest:</strong> {error.digest}
                </p>
              )}
              <details className="mt-2">
                <summary className="cursor-pointer">스택 트레이스</summary>
                <pre className="mt-2 max-h-40 overflow-auto rounded bg-red-100 p-2 text-xs">
                  {error.stack}
                </pre>
              </details>
            </div>
          </div>
        )}

        <div className="border-border border-t pt-6">
          <p className="text-muted-foreground text-sm">
            문제가 지속되면{' '}
            <a href="mailto:support@mimisalon.com" className="text-primary hover:underline">
              고객센터
            </a>
            로 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
