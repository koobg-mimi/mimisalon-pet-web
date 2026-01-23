import { Section, Text, Button } from '@react-email/components'
import { BaseEmailLayout } from './base-layout'

interface PasswordResetProps {
  name: string
  resetUrl: string
}

export function PasswordResetEmail({ name, resetUrl }: PasswordResetProps) {
  return (
    <BaseEmailLayout
      title="비밀번호 재설정 - 미미살롱펫"
      previewText={`${name}님의 비밀번호 재설정 요청을 처리해드리겠습니다.`}
    >
      {/* Header */}
      <Section style={headerStyle}>
        <Text style={headerTitleStyle}>🔐 미미살롱펫</Text>
        <Text style={headerSubtitleStyle}>비밀번호 재설정</Text>
      </Section>

      {/* Content */}
      <Section style={contentStyle}>
        <Section style={welcomeStyle}>
          <Text style={welcomeTitleStyle}>비밀번호 재설정 요청</Text>
          <Text style={welcomeTextStyle}>
            안녕하세요, {name}님.
            <br />
            계정의 비밀번호 재설정을 요청하셨습니다.
          </Text>
        </Section>

        <Section style={resetSectionStyle}>
          <Text style={resetTitleStyle}>새 비밀번호를 설정하세요</Text>
          <Text style={resetTextStyle}>아래 버튼을 클릭하여 안전한 새 비밀번호를 설정하세요.</Text>

          <Button href={resetUrl} style={resetButtonStyle}>
            🔑 비밀번호 재설정하기
          </Button>

          <Text style={linkInstructionStyle}>
            버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요:
          </Text>
          <Text style={linkUrlStyle}>{resetUrl}</Text>
        </Section>

        <Section style={warningBoxStyle}>
          <Text style={warningBoxTextStyle}>
            <strong>⚠️ 보안 주의사항</strong>
            <br />
            • 이 링크는 30분 동안만 유효합니다
            <br />
            • 링크는 한 번만 사용할 수 있습니다
            <br />
            • 본인이 요청하지 않은 경우 즉시 고객센터로 연락하세요
            <br />• 비밀번호 변경 후 모든 기기에서 다시 로그인하세요
          </Text>
        </Section>

        <Text style={disclaimerTextStyle}>
          혹시 비밀번호 재설정을 요청하지 않으셨다면, 이 메일을 무시하셔도 됩니다.
          <br />
          계정은 안전하게 보호되고 있습니다.
        </Text>
      </Section>
    </BaseEmailLayout>
  )
}

// Styles
const headerStyle = {
  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
  color: '#fce4ec',
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

const resetSectionStyle = {
  backgroundColor: '#fff5f5',
  borderRadius: '12px',
  padding: '32px',
  textAlign: 'center' as const,
  margin: '32px 0',
}

const resetTitleStyle = {
  color: '#1a202c',
  marginTop: '0',
  fontSize: '20px',
  fontWeight: '600',
}

const resetTextStyle = {
  color: '#4a5568',
  marginBottom: '24px',
  fontSize: '16px',
}

const resetButtonStyle = {
  display: 'inline-block',
  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
  color: '#f5576c',
  wordBreak: 'break-all' as const,
  fontSize: '12px',
}

const warningBoxStyle = {
  backgroundColor: '#fef5e7',
  borderLeft: '4px solid #f6ad55',
  padding: '16px',
  margin: '24px 0',
  borderRadius: '4px',
}

const warningBoxTextStyle = {
  margin: '0',
  color: '#744210',
  fontSize: '14px',
  lineHeight: '1.4',
}

const disclaimerTextStyle = {
  color: '#718096',
  textAlign: 'center' as const,
  fontSize: '14px',
  lineHeight: '1.4',
}
