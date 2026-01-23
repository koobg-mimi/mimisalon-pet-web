'use client';

import { useSession } from '@/lib/auth-client';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * @deprecated This hook uses deprecated phone verification endpoints.
 *
 * Migration path:
 * - Use usePhoneUpdate hook instead (src/hooks/usePhoneUpdate.ts)
 * - Get verification status from session: useSession().data?.user?.phoneNumberVerified
 * - Use better-auth phoneNumber plugin methods directly
 *
 * This hook will be removed in Q2 2026.
 * See docs/MIGRATION.md for complete migration guide.
 */
interface UsePhoneVerificationReturn {
  needsVerification: boolean;
  phone: string | null;
  phoneVerified: boolean;
  userRole: 'CUSTOMER' | 'GROOMER' | 'ADMIN' | null;
  isLoading: boolean;
  startVerification: () => void;
  goToProfile: () => void;
  sendVerificationCode: () => Promise<boolean>;
  showVerificationReminder: () => void;
}

/**
 * @deprecated Use usePhoneUpdate hook instead. This hook calls deprecated /api/auth/phone/* endpoints.
 */
export function usePhoneVerification(): UsePhoneVerificationReturn {
  const { data: session, isPending } = useSession();

  // Deprecation warning
  useEffect(() => {
    console.warn(
      '[DEPRECATED] usePhoneVerification hook uses deprecated /api/auth/phone/* endpoints. ' +
        'Migrate to usePhoneUpdate hook and better-auth phoneNumber plugin. ' +
        'See docs/MIGRATION.md for details. This hook will be removed in Q2 2026.'
    );
  }, []);
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const user = session?.user;
  const phone = (user as any)?.phone || null;
  const phoneVerified = (user as any)?.phoneVerified || false;
  const userRole = (user?.role as 'CUSTOMER' | 'GROOMER' | 'ADMIN') || null;

  // Determine if verification is needed based on role
  const needsVerification = Boolean(
    phone && !phoneVerified && (userRole === 'CUSTOMER' || userRole === 'GROOMER')
  );

  // Periodically check phone verification status when verification is needed
  useEffect(() => {
    if (!needsVerification || isPending || !session) return;

    const checkVerificationStatus = async () => {
      try {
        // Reload the page to refresh session
        window.location.reload();
      } catch (error) {
        console.error('Failed to refresh session:', error);
      }
    };

    // Check every 30 seconds if verification is still needed
    const interval = setInterval(checkVerificationStatus, 30000);

    return () => clearInterval(interval);
  }, [needsVerification, isPending, session]);

  const goToProfile = useCallback(() => {
    if (!userRole) return;

    const profilePaths = {
      CUSTOMER: '/customer/profile',
      GROOMER: '/groomer/dashboard/profile',
      ADMIN: '/admin/profile',
    };

    const path = profilePaths[userRole as keyof typeof profilePaths];
    if (path) {
      router.push(`${path}?verify=phone`);
    }
  }, [userRole, router]);

  const startVerification = useCallback(() => {
    if (!phone || !user?.id) {
      toast.error('전화번호가 등록되지 않았습니다.');
      goToProfile();
      return;
    }

    router.push(
      `/auth/verify-phone?phone=${encodeURIComponent(phone)}&userId=${user.id}&returnTo=${pathname}`
    );
  }, [phone, user?.id, router, goToProfile, pathname]);

  const sendVerificationCode = useCallback(async (): Promise<boolean> => {
    if (!phone) {
      toast.error('전화번호가 등록되지 않았습니다.');
      return false;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/phone/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('인증 코드가 전송되었습니다.');
        return true;
      } else {
        toast.error(result.message || '인증 코드 전송에 실패했습니다.');
        return false;
      }
    } catch {
      toast.error('인증 코드 전송 중 오류가 발생했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [phone]);

  const showVerificationReminder = useCallback(() => {
    if (!needsVerification) return;

    // Check if reminder was shown recently
    const lastReminder = sessionStorage.getItem('phone-verification-reminder');
    const now = Date.now();
    const reminderCooldown = 30 * 60 * 1000; // 30 minutes

    if (lastReminder && now - parseInt(lastReminder) < reminderCooldown) {
      return;
    }

    // Show reminder toast
    toast('전화번호 인증이 필요합니다', {
      description: '서비스 이용을 위해 전화번호를 인증해주세요.',
      action: {
        label: '지금 인증',
        onClick: goToProfile,
      },
      duration: 6000,
    });

    // Save timestamp
    sessionStorage.setItem('phone-verification-reminder', now.toString());
  }, [needsVerification, goToProfile]);

  return {
    needsVerification,
    phone,
    phoneVerified,
    userRole,
    isLoading: isPending || isLoading,
    startVerification,
    goToProfile,
    sendVerificationCode,
    showVerificationReminder,
  };
}

/**
 * @deprecated Use usePhoneUpdate hook instead. This hook depends on deprecated usePhoneVerification.
 */
// Hook for checking verification requirements on specific actions
export function useVerificationGuard() {
  const { needsVerification, goToProfile } = usePhoneVerification();

  const checkVerification = useCallback(
    (action?: string): boolean => {
      if (needsVerification) {
        toast.warning('전화번호 인증이 필요합니다', {
          description: action
            ? `${action}을 하려면 먼저 전화번호를 인증해주세요.`
            : '이 기능을 사용하려면 먼저 전화번호를 인증해주세요.',
          action: {
            label: '지금 인증',
            onClick: goToProfile,
          },
          duration: 5000,
        });
        return false;
      }
      return true;
    },
    [needsVerification, goToProfile]
  );

  return {
    needsVerification,
    checkVerification,
    goToProfile,
  };
}
