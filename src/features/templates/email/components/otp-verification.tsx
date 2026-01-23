import { Section, Text } from '@react-email/components'
import { BaseEmailLayout } from './base-layout'

interface OTPVerificationProps {
  email: string
  otp: string
  type: 'sign-in' | 'email-verification' | 'forget-password'
}

export function OTPVerificationEmail({ email: _email, otp, type }: OTPVerificationProps) {
  const getTitle = () => {
    switch (type) {
      case 'sign-in':
        return '로그인 인증코드'
      case 'email-verification':
        return '이메일 인증코드'
      case 'forget-password':
        return '비밀번호 재설정 인증코드'
      default:
        return '인증코드'
    }
  }

  const getDescription = () => {
    switch (type) {
      case 'sign-in':
        return '로그인을 완료하기 위해 아래 인증코드를 입력해주세요.'
      case 'email-verification':
        return '이메일 주소를 인증하기 위해 아래 인증코드를 입력해주세요.'
      case 'forget-password':
        return '비밀번호를 재설정하기 위해 아래 인증코드를 입력해주세요.'
      default:
        return '인증을 완료하기 위해 아래 코드를 입력해주세요.'
    }
  }

  const getHeaderGradient = () => {
    switch (type) {
      case 'sign-in':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      case 'email-verification':
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      case 'forget-password':
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  }

  return (
    <BaseEmailLayout title={`${getTitle()} - 미미살롱펫`} previewText={`인증코드: ${otp}`}>
      {/* Header */}
      <Section style={{ ...headerStyle, background: getHeaderGradient() }}>
        <Text style={headerTitleStyle}>🔐 미미살롱펫</Text>
        <Text style={headerSubtitleStyle}>{getTitle()}</Text>
      </Section>

      {/* Content */}
      <Section style={contentStyle}>
        <Section style={welcomeStyle}>
          <Text style={welcomeTitleStyle}>안녕하세요!</Text>
          <Text style={welcomeTextStyle}>{getDescription()}</Text>
        </Section>

        {/* OTP Code Display */}
        <Section style={otpSectionStyle}>
          <Text style={otpLabelStyle}>인증코드</Text>
          <Section style={otpBoxStyle}>
            <Text style={otpCodeStyle}>{otp}</Text>
          </Section>
          <Text style={otpHintStyle}>
            이 코드를 복사하여 인증 페이지에 입력하세요.
            <br />
            인증코드는 <strong>10분 동안</strong> 유효합니다.
          </Text>
        </Section>

        {/* Security Info */}
        <Section style={infoBoxStyle}>
          <Text style={infoBoxTextStyle}>
            <strong>🔒 보안 안내</strong>
            <br />
            • 이 코드는 10분 후 자동으로 만료됩니다
            <br />
            • 최대 5회까지 입력 시도가 가능합니다
            <br />
            • 누구와도 이 코드를 공유하지 마세요
            <br />• 본인이 요청하지 않은 경우 이 메일을 무시하세요
          </Text>
        </Section>

        <Text style={disclaimerTextStyle}>
          본인이 요청하지 않은 경우, 계정 보안을 위해 즉시 비밀번호를 변경하시기 바랍니다.
        </Text>
      </Section>
    </BaseEmailLayout>
  )
}

// Styles
const headerStyle = {
  padding: '40px 20px',
  textAlign: 'center' as const,
}

const headerTitleStyle = {
  color: '#ffffff',
  margin: '0',
  fontSize: '28px',
  fontWeight: '700',
}

const headerSubtitleStyle = {
  color: '#ffffff',
  opacity: '0.9',
  margin: '8px 0 0 0',
  fontSize: '16px',
}

const contentStyle = {
  padding: '40px 20px',
}

const welcomeStyle = {
  textAlign: 'center' as const,
  marginBottom: '32px',
}

const welcomeTitleStyle = {
  color: '#1a202c',
  margin: '0 0 16px 0',
  fontSize: '24px',
  fontWeight: '600',
}

const welcomeTextStyle = {
  color: '#4a5568',
  margin: '0',
  fontSize: '16px',
  lineHeight: '1.5',
}

const otpSectionStyle = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const otpLabelStyle = {
  color: '#718096',
  fontSize: '14px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  marginBottom: '12px',
}

const otpBoxStyle = {
  backgroundColor: '#f7fafc',
  border: '2px dashed #cbd5e0',
  borderRadius: '12px',
  padding: '24px',
  margin: '16px auto',
  maxWidth: '320px',
}

const otpCodeStyle = {
  color: '#1a202c',
  fontSize: '42px',
  fontWeight: '700',
  letterSpacing: '8px',
  fontFamily: 'monospace',
  margin: '0',
  textAlign: 'center' as const,
}

const otpHintStyle = {
  color: '#718096',
  fontSize: '14px',
  marginTop: '16px',
  lineHeight: '1.5',
}

const infoBoxStyle = {
  backgroundColor: '#e6fffa',
  borderLeft: '4px solid #38b2ac',
  padding: '16px',
  margin: '24px 0',
  borderRadius: '4px',
}

const infoBoxTextStyle = {
  margin: '0',
  color: '#234e52',
  fontSize: '14px',
  lineHeight: '1.6',
}

const disclaimerTextStyle = {
  color: '#718096',
  textAlign: 'center' as const,
  fontSize: '13px',
  lineHeight: '1.4',
  marginTop: '24px',
}
