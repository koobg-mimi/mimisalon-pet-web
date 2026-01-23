'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DogIcon, XIcon, PlusIcon } from 'lucide-react';

interface PetVerificationBannerProps {
  hasPets: boolean;
  className?: string;
}

export function PetVerificationBanner({ hasPets, className = '' }: PetVerificationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('pet-verification-banner-dismissed') === 'true';
  });
  const router = useRouter();

  const handleAddPet = () => {
    router.push('/customer/pets');
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('pet-verification-banner-dismissed', 'true');
  };

  const handleLater = () => {
    setIsDismissed(true);
    // Don't save to session storage so it shows again next visit
  };

  // Don't show if user has pets or dismissed
  if (hasPets || isDismissed) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <Alert className="border-purple-200 bg-purple-50 text-purple-800">
        <DogIcon className="h-4 w-4 text-purple-600" />
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <AlertDescription className="flex-1">
            <div className="space-y-1">
              <p className="font-medium text-purple-800">반려동물을 등록해주세요</p>
              <p className="text-sm text-purple-700">
                미용 서비스 예약을 위해 반려동물 정보가 필요합니다. 반려동물의 특성과 건강 상태를
                미리 알려주시면 더 나은 서비스를 제공할 수 있습니다.
              </p>
            </div>
          </AlertDescription>

          <div className="flex flex-shrink-0 items-center gap-2">
            <Button
              onClick={handleAddPet}
              size="sm"
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              <PlusIcon className="mr-1 h-4 w-4" />
              반려동물 추가하기
            </Button>

            <Button
              onClick={handleLater}
              variant="ghost"
              size="sm"
              className="text-purple-700 hover:bg-purple-100 hover:text-purple-800"
            >
              나중에
            </Button>

            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-purple-600 hover:bg-purple-100 hover:text-purple-700"
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

export function PetVerificationCompactBanner({
  hasPets,
  className = '',
}: PetVerificationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('pet-verification-compact-banner-dismissed') === 'true';
  });
  const router = useRouter();

  const handleAddPet = () => {
    router.push('/customer/pets');
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('pet-verification-compact-banner-dismissed', 'true');
  };

  if (hasPets || isDismissed) {
    return null;
  }

  return (
    <div className={`border-l-4 border-purple-400 bg-purple-50 p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <DogIcon className="mr-2 h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-800">반려동물 등록이 필요합니다</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleAddPet}
            size="sm"
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            추가하기
          </Button>

          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-purple-600 hover:bg-purple-100 hover:text-purple-700"
          >
            <XIcon className="h-3 w-3" />
            <span className="sr-only">닫기</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
