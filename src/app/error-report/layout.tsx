import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '에러 신고 | 미미살롱',
  description: '서비스 이용 중 발생한 문제를 신고해주세요. 빠른 시일 내에 검토하여 해결하겠습니다.',
  robots: 'noindex, nofollow', // Prevent indexing of error report page
}

export default function ErrorReportLayout({ children }: { children: React.ReactNode }) {
  return children
}
