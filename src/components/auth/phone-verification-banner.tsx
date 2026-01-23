'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PhoneIcon, XIcon, AlertTriangleIcon } from 'lucide-react';

interface PhoneVerificationBannerProps {
  userRole: 'CUSTOMER' | 'GROOMER';
  phone?: string | null;
  phoneVerified?: boolean;
  className?: string;
}

export function PhoneVerificationBanner({
  userRole,
  phone,
  phoneVerified = false,
  className = '',
}: PhoneVerificationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('phone-verification-banner-dismissed') === 'true';
  });
  const router = useRouter();
  const { data: session } = useSession();

  // Periodically check phone verification status when banner is shown
  useEffect(() => {
    if (!phone || phoneVerified || isDismissed) return;

    const checkVerificationStatus = async () => {
      try {
        // Reload page to refresh session
        window.location.reload();
      } catch (error) {
        console.error('Failed to refresh session:', error);
      }
    };

    // Check every 20 seconds when banner is visible
    const interval = setInterval(checkVerificationStatus, 20000);

    return () => clearInterval(interval);
  }, [phone, phoneVerified, isDismissed]);

  // Check if banner should be shown
  const shouldShow = phone && !phoneVerified && !isDismissed;

  const handleVerifyNow = () => {
    const profilePath =
      userRole === 'CUSTOMER' ? '/customer/dashboard/profile' : '/groomer/dashboard/profile';
    router.push(`${profilePath}?verify=phone`);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('phone-verification-banner-dismissed', 'true');
  };

  const handleLater = () => {
    setIsDismissed(true);
    // Don't save to session storage so it shows again next time
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <Alert className="border-amber-200 bg-amber-50 text-amber-800">
        <AlertTriangleIcon className="h-4 w-4 text-amber-600" />
        <div className="flex w-full items-center justify-between">
          <AlertDescription className="flex-1 pr-4">
            <div className="space-y-1">
              <p className="font-medium text-amber-800">전화번호 인증이 필요합니다</p>
              <p className="text-sm text-amber-700">
                {userRole === 'CUSTOMER'
                  ? '예약 및 알림 서비스를 이용하려면 전화번호 인증이 필요합니다.'
                  : '미용 서비스 제공을 위해 전화번호 인증이 필요합니다.'}
              </p>
            </div>
          </AlertDescription>

          <div className="flex items-center space-x-2">
            <Button
              onClick={handleVerifyNow}
              size="sm"
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              <PhoneIcon className="mr-1 h-4 w-4" />
              지금 인증하기
            </Button>

            <Button
              onClick={handleLater}
              variant="ghost"
              size="sm"
              className="text-amber-700 hover:bg-amber-100 hover:text-amber-800"
            >
              나중에
            </Button>

            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="p-1 text-amber-600 hover:bg-amber-100 hover:text-amber-700"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Alert>
    </div>
  );
}

export function PhoneVerificationCompactBanner({
  userRole,
  phone,
  phoneVerified = false,
  className = '',
}: PhoneVerificationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('phone-verification-compact-banner-dismissed') === 'true';
  });
  const router = useRouter();
  const { data: session } = useSession();

  // Periodically check phone verification status when banner is shown
  useEffect(() => {
    if (!phone || phoneVerified || isDismissed) return;

    const checkVerificationStatus = async () => {
      try {
        // Reload page to refresh session
        window.location.reload();
      } catch (error) {
        console.error('Failed to refresh session:', error);
      }
    };

    // Check every 25 seconds when compact banner is visible
    const interval = setInterval(checkVerificationStatus, 25000);

    return () => clearInterval(interval);
  }, [phone, phoneVerified, isDismissed]);

  const shouldShow = phone && !phoneVerified && !isDismissed;

  const handleVerifyNow = () => {
    const profilePath =
      userRole === 'CUSTOMER' ? '/customer/profile' : '/groomer/dashboard/profile';
    router.push(`${profilePath}?verify=phone`);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('phone-verification-compact-banner-dismissed', 'true');
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <div className={`border-l-4 border-amber-400 bg-amber-50 p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangleIcon className="mr-2 h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">전화번호 인증이 필요합니다</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={handleVerifyNow}
            size="sm"
            variant="outline"
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            인증하기
          </Button>

          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="p-1 text-amber-600 hover:bg-amber-100 hover:text-amber-700"
          >
            <XIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
