import { Html, Head, Body, Container, Section, Text, Hr, Font } from '@react-email/components'

interface BaseEmailLayoutProps {
  children: React.ReactNode
  title: string
  previewText?: string
}

export function BaseEmailLayout({ children, title, previewText }: BaseEmailLayoutProps) {
  return (
    <Html lang="ko">
      <Head>
        <title>{title}</title>
        <Font
          fontFamily="system-ui"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body style={bodyStyle}>
        {previewText && <Text style={previewTextStyle}>{previewText}</Text>}
        <Container style={containerStyle}>
          {children}

          {/* Footer */}
          <Hr style={hrStyle} />
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              이 메일은 발신 전용입니다. 문의사항이 있으시면 고객센터로 연락해주세요.
              <br />© 2024 미미살롱펫. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const bodyStyle = {
  margin: '0',
  padding: '0',
  backgroundColor: '#f8fafc',
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
}

const previewTextStyle = {
  display: 'none',
  overflow: 'hidden',
  lineHeight: '1px',
  opacity: 0,
  maxHeight: '0',
  maxWidth: '0',
}

const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
}

const hrStyle = {
  borderColor: '#e2e8f0',
  margin: '0',
}

const footerStyle = {
  backgroundColor: '#f8fafc',
  padding: '24px 20px',
  textAlign: 'center' as const,
  borderTop: '1px solid #e2e8f0',
}

const footerTextStyle = {
  color: '#718096',
  margin: '0',
  fontSize: '14px',
  lineHeight: '1.4',
}
