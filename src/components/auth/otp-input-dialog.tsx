'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

// Type definitions for verification
type VerificationMethod = 'email' | 'sms';
type VerificationType = 'sign-in' | 'email-verification' | 'forget-password';

export interface OTPInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  identifier: string; // email or phone
  method: VerificationMethod;
  type: VerificationType;
  onSuccess: (otp?: string) => void;
}

/**
 * OTP Input Dialog Component
 *
 * Allows users to enter and verify OTP codes
 */
export function OTPInputDialog({
  open,
  onOpenChange,
  identifier,
  method,
  type,
  onSuccess,
}: OTPInputDialogProps) {
  const [otp, setOtp] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);

  // Countdown timer for resend button
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-submit when OTP is complete
  React.useEffect(() => {
    if (otp.length === 6 && !isVerifying) {
      handleVerify();
    }
  }, [otp]);

  // Reset OTP when dialog opens
  React.useEffect(() => {
    if (open) {
      setOtp('');
      setCountdown(60); // Start 60s countdown
    }
  }, [open]);

  const handleVerify = async () => {
    if (otp.length !== 6) return;

    setIsVerifying(true);

    try {
      console.log('🔍 OTP 검증 시작:', { method, type, identifier, otp });

      // For forget-password (both email and SMS), just pass OTP to parent
      // Parent will call better-auth's resetPassword with the OTP
      if (type === 'forget-password') {
        console.log('🔑 비밀번호 재설정: OTP를 부모로 전달');
        toast.success('인증코드를 확인했습니다');
        onSuccess(otp); // Pass OTP to parent for better-auth resetPassword
        onOpenChange(false);
        return;
      }

      // For email signup verification, use custom API (doesn't require existing user)
      if (method === 'email' && type === 'email-verification') {
        console.log('📧 이메일 회원가입 검증 중...');

        const response = await fetch('/api/auth/verify-email-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: identifier,
            code: otp,
          } satisfies import('@/app/api/auth/verify-email-otp/route').VerifyEmailOtpRequest),
        });

        const result: import('@/app/api/auth/verify-email-otp/route').VerifyEmailOtpResponse | import('@/app/api/auth/verify-email-otp/route').VerifyEmailOtpErrorResponse = await response.json();

        if (!response.ok) {
          console.error('❌ 이메일 OTP 검증 실패:', result);
          toast.error('error' in result ? result.error : '인증에 실패했습니다');
          setOtp(''); // Clear for retry
          return;
        }
      } else if (method === 'sms') {
        // SMS verification: Use custom API (doesn't require existing user)
        console.log('📱 SMS OTP 검증 중...');

        const response = await fetch('/api/auth/verify-phone-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: identifier,
            code: otp,
          } satisfies import('@/app/api/auth/verify-phone-otp/route').VerifyPhoneOtpRequest),
        });

        const result: import('@/app/api/auth/verify-phone-otp/route').VerifyPhoneOtpResponse | import('@/app/api/auth/verify-phone-otp/route').VerifyPhoneOtpErrorResponse = await response.json();

        if (!response.ok) {
          console.error('❌ SMS OTP 검증 실패:', result);
          toast.error('error' in result ? result.error : '인증에 실패했습니다');
          setOtp(''); // Clear for retry
          return;
        }
      }

      toast.success('인증이 완료되었습니다');
      onSuccess(otp); // Pass the OTP back to parent
      onOpenChange(false);
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('인증 중 오류가 발생했습니다');
      setOtp('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);

    try {
      if (method === 'email') {
        // 이메일 재전송: better-auth emailOtp 플러그인 사용
        console.log('📧 이메일 OTP 재전송 중...');
        await authClient.emailOtp.sendVerificationOtp({
          email: identifier,
          type,
        });
        console.log('✅ 이메일 OTP 재전송 완료');
      } else {
        // SMS 재전송: better-auth phoneNumber 플러그인 사용
        console.log('📱 SMS OTP 재전송 중...');
        await authClient.phoneNumber.sendOtp({
          phoneNumber: identifier,
        });
        console.log('✅ SMS OTP 재전송 완료');
      }

      toast.success('인증코드가 재전송되었습니다');
      setCountdown(60); // Restart countdown
      setOtp(''); // Clear current input
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('재전송 중 오류가 발생했습니다');
    } finally {
      setIsResending(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'sign-in':
        return '로그인 인증';
      case 'email-verification':
        return '이메일 인증';
      case 'forget-password':
        return '비밀번호 재설정 인증';
      default:
        return '인증';
    }
  };

  const getDescription = () => {
    const destination = method === 'email' ? identifier : identifier;
    return `${destination}으로 전송된 6자리 인증코드를 입력하세요.`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* OTP Input */}
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isVerifying}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Info & Actions */}
          <div className="space-y-3">
            <p className="text-muted-foreground text-center text-sm">
              {otp.length === 6
                ? '인증 중입니다...'
                : `인증코드 ${otp.length}/6 입력 (10분간 유효)`}
            </p>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResend}
                disabled={countdown > 0 || isResending || isVerifying}
                className="flex-1"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    재전송 중...
                  </>
                ) : countdown > 0 ? (
                  `재전송 (${countdown}초)`
                ) : (
                  '재전송'
                )}
              </Button>

              <Button
                type="button"
                onClick={handleVerify}
                disabled={otp.length !== 6 || isVerifying}
                className="flex-1"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    확인 중...
                  </>
                ) : (
                  '확인'
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
