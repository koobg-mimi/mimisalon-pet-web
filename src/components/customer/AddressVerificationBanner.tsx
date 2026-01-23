'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPinIcon, XIcon, PlusIcon } from 'lucide-react';

interface AddressVerificationBannerProps {
  hasAddresses: boolean;
  className?: string;
}

export function AddressVerificationBanner({
  hasAddresses,
  className = '',
}: AddressVerificationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('address-verification-banner-dismissed') === 'true';
  });
  const router = useRouter();

  const handleAddAddress = () => {
    router.push('/customer/profile');
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('address-verification-banner-dismissed', 'true');
  };

  const handleLater = () => {
    setIsDismissed(true);
    // Don't save to session storage so it shows again next visit
  };

  // Don't show if user has addresses or dismissed
  if (hasAddresses || isDismissed) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <Alert className="border-blue-200 bg-blue-50 text-blue-800">
        <MapPinIcon className="h-4 w-4 text-blue-600" />
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <AlertDescription className="flex-1">
            <div className="space-y-1">
              <p className="font-medium text-blue-800">주소를 등록해주세요</p>
              <p className="text-sm text-blue-700">
                예약 시 방문 주소를 선택하려면 주소 등록이 필요합니다. 정확한 위치 정보는 미용사의
                빠른 방문을 도와줍니다.
              </p>
            </div>
          </AlertDescription>

          <div className="flex flex-shrink-0 items-center gap-2">
            <Button
              onClick={handleAddAddress}
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <PlusIcon className="mr-1 h-4 w-4" />
              주소 추가하기
            </Button>

            <Button
              onClick={handleLater}
              variant="ghost"
              size="sm"
              className="text-blue-700 hover:bg-blue-100 hover:text-blue-800"
            >
              나중에
            </Button>

            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">닫기</span>
            </Button>
          </div>
        </div>
      </Alert>
    </div>
  );
}

export function AddressVerificationCompactBanner({
  hasAddresses,
  className = '',
}: AddressVerificationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('address-verification-compact-banner-dismissed') === 'true';
  });
  const router = useRouter();

  const handleAddAddress = () => {
    router.push('/customer/addresses');
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('address-verification-compact-banner-dismissed', 'true');
  };

  if (hasAddresses || isDismissed) {
    return null;
  }

  return (
    <div className={`border-l-4 border-blue-400 bg-blue-50 p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MapPinIcon className="mr-2 h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">주소 등록이 필요합니다</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleAddAddress}
            size="sm"
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            추가하기
          </Button>

          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
          >
            <XIcon className="h-3 w-3" />
            <span className="sr-only">닫기</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
