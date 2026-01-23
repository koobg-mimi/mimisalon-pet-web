import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

/**
 * 페이지 헤더 컴포넌트
 *
 * 페이지 상단에 제목, 설명, 액션 버튼을 일관된 형태로 표시합니다.
 * 모바일 환경에서는 버튼들이 세로로 배치되어 사용성을 향상시킵니다.
 */
export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'container mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="text-foreground text-2xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>

      {children && (
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-0 sm:space-x-4">
          {children}
        </div>
      )}
    </div>
  )
}
