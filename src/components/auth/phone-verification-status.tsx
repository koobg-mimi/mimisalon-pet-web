'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertTriangleIcon, CheckCircleIcon, PhoneIcon, XCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * @deprecated This component uses deprecated phone verification endpoints.
 *
 * Migration path:
 * - Use PhoneUpdateForm component instead (src/components/auth/phone-update-form.tsx)
 * - Get verification status from session: useSession().data?.user?.phoneNumberVerified
 * - Use better-auth phoneNumber plugin for updates
 *
 * This component will be removed in Q2 2026.
 * See docs/MIGRATION.md for complete migration guide.
 */
interface PhoneVerificationStatusProps {
  phone?: string | null;
  phoneVerified?: boolean;
  userId?: string;
  showActions?: boolean;
  className?: string;
}

/**
 * @deprecated Use PhoneUpdateForm instead. This component calls deprecated /api/auth/phone/* endpoints.
 */
export function PhoneVerificationStatus({
  phone,
  phoneVerified = false,
  userId,
  showActions = true,
  className = '',
}: PhoneVerificationStatusProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoadingFreshStatus, setIsLoadingFreshStatus] = useState(true);
  const [freshVerificationStatus, setFreshVerificationStatus] = useState<{
    phone?: string | null;
    phoneVerified?: boolean;
    phoneVerifiedAt?: Date | null;
  } | null>(null);
  const router = useRouter();
  const {} = useSession();

  // Deprecation warning
  useEffect(() => {
    console.warn(
      '[DEPRECATED] PhoneVerificationStatus component uses deprecated /api/auth/phone/* endpoints. ' +
        'Migrate to PhoneUpdateForm and better-auth phoneNumber plugin. ' +
        'See docs/MIGRATION.md for details. This component will be removed in Q2 2026.'
    );
  }, []);

  // Fetch fresh verification status from database
  const fetchFreshStatus = async () => {
    try {
      const response = await fetch('/api/auth/phone/status');
      if (response.ok) {
        const data = await response.json();
        setFreshVerificationStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch fresh verification status:', error);
    } finally {
      setIsLoadingFreshStatus(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchFreshStatus();
  }, []);

  // Remove the periodic checking for phone verification status
  // This was causing unnecessary API calls and the fresh status check on mount is sufficient

  // Use fresh data if available, otherwise fall back to props
  const currentPhone = freshVerificationStatus?.phone ?? phone;
  const currentPhoneVerified = freshVerificationStatus?.phoneVerified ?? phoneVerified;

  // Show loading state if fresh status is still loading and no props provided
  if (isLoadingFreshStatus && !phone) {
    return (
      <div className={`bg-muted/50 flex items-center space-x-3 rounded-lg p-4 ${className}`}>
        <LoadingSpinner size="sm" />
        <div className="flex-1">
          <p className="text-muted-foreground text-sm font-medium">
            전화번호 인증 상태를 확인하는 중...
          </p>
        </div>
      </div>
    );
  }

  const formatPhoneForDisplay = (phoneNumber: string | null | undefined) => {
    // Display E.164 format as-is for consistency
    return phoneNumber || '';
  };

  const handleSendVerification = async () => {
    if (!currentPhone) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/phone/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: currentPhone,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Redirect to verification page
        router.push(
          `/auth/verify-phone?phone=${encodeURIComponent(currentPhone)}&userId=${userId}&returnTo=/settings/profile`
        );
      } else {
        setError(result.message || '인증 코드 전송에 실패했습니다.');
      }
    } catch {
      setError('인증 코드 전송 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentPhone) {
    return (
      <div className={`bg-muted/50 flex items-center space-x-3 rounded-lg p-4 ${className}`}>
        <XCircleIcon className="text-muted-foreground h-5 w-5" />
        <div className="flex-1">
          <p className="text-muted-foreground text-sm font-medium">
            전화번호가 등록되지 않았습니다
          </p>
          <p className="text-muted-foreground text-xs">프로필에서 전화번호를 추가해주세요</p>
        </div>
      </div>
    );
  }

  if (currentPhoneVerified) {
    return (
      <div
        className={`flex items-center space-x-3 rounded-lg border border-green-200 bg-green-50 p-4 ${className}`}
      >
        <CheckCircleIcon className="h-5 w-5 text-green-600" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-green-800">
              {formatPhoneForDisplay(currentPhone)}
            </p>
            <Badge variant="secondary" className="border-green-200 bg-green-100 text-green-800">
              인증 완료
            </Badge>
          </div>
          <p className="text-xs text-green-600">전화번호가 성공적으로 인증되었습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center space-x-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-yellow-800">
              {formatPhoneForDisplay(currentPhone)}
            </p>
            <Badge variant="secondary" className="border-yellow-200 bg-yellow-100 text-yellow-800">
              인증 필요
            </Badge>
          </div>
          <p className="text-xs text-yellow-600">서비스 이용을 위해 전화번호 인증이 필요합니다</p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-3">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {showActions && (
        <Button
          onClick={handleSendVerification}
          disabled={isLoading}
          className="w-full"
          variant="outline"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <PhoneIcon className="mr-2 h-4 w-4" />
          )}
          전화번호 인증하기
        </Button>
      )}
    </div>
  );
}
