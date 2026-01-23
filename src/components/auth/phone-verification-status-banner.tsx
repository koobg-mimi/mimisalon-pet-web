'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AlertTriangleIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

export interface PhoneVerificationStatusBannerProps {
  /** User role to determine profile link */
  userRole: 'CUSTOMER' | 'GROOMER' | 'ADMIN';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Phone Verification Status Banner
 *
 * Read-only component that displays phone verification status on dashboard.
 * For actual phone number changes and verification, directs users to their profile page.
 *
 * Features:
 * - Shows verification status from session
 * - No editing capability (read-only)
 * - Provides links to profile page for changes
 * - Different colors based on verification state
 *
 * @example
 * ```tsx
 * <PhoneVerificationStatusBanner userRole="GROOMER" />
 * ```
 */
export function PhoneVerificationStatusBanner({
  userRole,
  className,
}: PhoneVerificationStatusBannerProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const user = session?.user;
  const phoneNumber = user?.phoneNumber;
  const phoneNumberVerified = user?.phoneNumberVerified || false;

  const formatPhoneForDisplay = (phoneNumber: string | null | undefined) => {
    // Display E.164 format as-is for consistency
    return phoneNumber || '';
  };

  const getProfilePath = () => {
    switch (userRole) {
      case 'CUSTOMER':
        return '/customer/profile';
      case 'GROOMER':
        return '/groomer/dashboard/profile';
      case 'ADMIN':
        return '/admin/dashboard/profile';
      default:
        return '/profile';
    }
  };

  const handleGoToProfile = () => {
    router.push(getProfilePath());
  };

  // Loading state
  if (isPending) {
    return (
      <div
        className={cn(
          'bg-muted/50 border-border flex items-center space-x-3 rounded-lg border p-4',
          className
        )}
      >
        <div className="bg-muted h-5 w-5 animate-pulse rounded-full" />
        <div className="flex-1">
          <div className="bg-muted h-4 w-48 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  // No phone number registered
  if (!phoneNumber) {
    return (
      <div
        className={cn(
          'bg-muted/50 border-border flex items-center space-x-3 rounded-lg border p-4',
          className
        )}
      >
        <XCircleIcon className="text-muted-foreground h-5 w-5" />
        <div className="flex-1">
          <p className="text-muted-foreground text-sm font-medium">
            전화번호가 등록되지 않았습니다
          </p>
          <p className="text-muted-foreground text-xs">프로필에서 전화번호를 추가해주세요</p>
        </div>
        <Button size="sm" variant="outline" onClick={handleGoToProfile}>
          프로필로 이동
        </Button>
      </div>
    );
  }

  // Phone verified
  if (phoneNumberVerified) {
    return (
      <div
        className={cn(
          'flex items-center space-x-3 rounded-lg border border-green-200 bg-green-50 p-4',
          className
        )}
      >
        <CheckCircleIcon className="h-5 w-5 text-green-600" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-green-800">
              {formatPhoneForDisplay(phoneNumber)}
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

  // Phone not verified
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center space-x-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-yellow-800">
              {formatPhoneForDisplay(phoneNumber)}
            </p>
            <Badge variant="secondary" className="border-yellow-200 bg-yellow-100 text-yellow-800">
              인증 필요
            </Badge>
          </div>
          <p className="text-xs text-yellow-600">서비스 이용을 위해 전화번호 인증이 필요합니다</p>
        </div>
        <Button size="sm" onClick={handleGoToProfile}>
          프로필에서 인증
        </Button>
      </div>
    </div>
  );
}
