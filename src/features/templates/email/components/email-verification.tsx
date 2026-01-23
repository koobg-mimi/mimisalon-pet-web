import { Section, Text, Button } from '@react-email/components'
import { BaseEmailLayout } from './base-layout'

interface EmailVerificationProps {
  name: string
  verificationUrl: string
}

export function EmailVerificationEmail({ name, verificationUrl }: EmailVerificationProps) {
  return (
    <BaseEmailLayout
      title="이메일 인증 - 미미살롱펫"
      previewText={`안녕하세요 ${name}님, 미미살롱펫 이메일 인증을 완료해주세요.`}
    >
      {/* Header */}
      <Section style={headerStyle}>
        <Text style={headerTitleStyle}>🐾 미미살롱펫</Text>
        <Text style={headerSubtitleStyle}>프리미엄 방문 반려동물 미용</Text>
      </Section>

      {/* Content */}
      <Section style={contentStyle}>
        <Section style={welcomeStyle}>
          <Text style={welcomeTitleStyle}>안녕하세요, {name}님!</Text>
          <Text style={welcomeTextStyle}>
            미미살롱펫에 가입해 주셔서 감사합니다.
            <br />
            아래 버튼을 클릭하여 이메일 인증을 완료해주세요.
          </Text>
        </Section>

        <Section style={verificationSectionStyle}>
          <Text style={verificationTitleStyle}>이메일 인증이 필요합니다</Text>
          <Text style={verificationTextStyle}>계정 보안을 위해 이메일 주소를 인증해주세요.</Text>

          <Button href={verificationUrl} style={verificationButtonStyle}>
            ✅ 이메일 인증하기
          </Button>

          <Text style={linkInstructionStyle}>
            버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요:
          </Text>
          <Text style={linkUrlStyle}>{verificationUrl}</Text>
        </Section>

        <Section style={infoBoxStyle}>
          <Text style={infoBoxTextStyle}>
            <strong>🔒 보안 안내</strong>
            <br />
            • 이 링크는 24시간 동안만 유효합니다
            <br />
            • 링크는 한 번만 사용할 수 있습니다
            <br />• 본인이 요청하지 않은 경우 이 메일을 무시하세요
          </Text>
        </Section>
      </Section>
    </BaseEmailLayout>
  )
}

// Styles
const headerStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
  color: '#e2e8f0',
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

const verificationSectionStyle = {
  backgroundColor: '#f7fafc',
  borderRadius: '12px',
  padding: '32px',
  textAlign: 'center' as const,
  margin: '32px 0',
}

const verificationTitleStyle = {
  color: '#1a202c',
  marginTop: '0',
  fontSize: '20px',
  fontWeight: '600',
}

const verificationTextStyle = {
  color: '#4a5568',
  marginBottom: '24px',
  fontSize: '16px',
}

const verificationButtonStyle = {
  display: 'inline-block',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#ffffff',
  textDecoration: 'none',
  padding: '16px 32px',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '16px',
  margin: '16px 0',
}

const linkInstructionStyle = {
  color: '#718096',
  fontSize: '12px',
  marginTop: '16px',
}

const linkUrlStyle = {
  color: '#667eea',
  wordBreak: 'break-all' as const,
  fontSize: '12px',
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
  lineHeight: '1.4',
}
