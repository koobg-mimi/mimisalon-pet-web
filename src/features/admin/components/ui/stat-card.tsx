import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * StatCard 컴포넌트의 CVA 변형 정의
 */
const statCardVariants = cva(
  'rounded-lg border transition-all duration-300 overflow-hidden flex flex-col',
  {
    variants: {
      variant: {
        default: 'border-border bg-card shadow-sm',
        compact: 'border-border bg-card shadow-sm',
        detailed: 'border-border bg-card shadow-md',
        highlight: 'border-primary/50 bg-gradient-to-br from-primary/5 to-transparent shadow-md',
        minimal: 'border-border/50 bg-transparent',
      },
      size: {
        sm: 'p-4',
        default: 'p-5',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

/**
 * StatCard 헤더 섹션 변형
 */
const statCardHeaderVariants = cva('flex items-center justify-between', {
  variants: {
    size: {
      sm: 'mb-2 gap-2',
      default: 'mb-3 gap-3',
      lg: 'mb-4 gap-4',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

/**
 * StatCard 타이틀 변형
 */
const statCardTitleVariants = cva('font-medium text-muted-foreground', {
  variants: {
    size: {
      sm: 'text-xs',
      default: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

/**
 * StatCard 값 표시 변형
 */
const statCardValueVariants = cva('font-bold tracking-tight', {
  variants: {
    size: {
      sm: 'text-xl',
      default: 'text-2xl',
      lg: 'text-3xl',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

/**
 * StatCard 아이콘 컨테이너 변형
 */
const statCardIconVariants = cva('rounded-lg flex items-center justify-center', {
  variants: {
    size: {
      sm: 'h-8 w-8',
      default: 'h-10 w-10',
      lg: 'h-12 w-12',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

/**
 * StatCard 서브타이틀 변형
 */
const statCardSubtitleVariants = cva('flex items-center gap-1 font-medium', {
  variants: {
    size: {
      sm: 'text-xs mt-2',
      default: 'text-sm mt-3',
      lg: 'text-base mt-4',
    },
    trend: {
      up: 'text-green-600 dark:text-green-400',
      down: 'text-red-600 dark:text-red-400',
      neutral: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    size: 'default',
    trend: 'neutral',
  },
})

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  /**
   * 통계 항목의 제목 (예: "총 매출")
   */
  title: string
  /**
   * 통계 값 (formatCurrency 등으로 포맷된 문자열)
   */
  value: string
  /**
   * 부가 정보 텍스트 (예: "+12.5% 전월대비")
   */
  subtitle?: string
  /**
   * 좌측 상단에 표시할 아이콘
   */
  icon?: React.ReactNode
  /**
   * 추세 방향 (up: 상승, down: 하락, neutral: 변화 없음)
   */
  trend?: 'up' | 'down' | 'neutral'
}

/**
 * StatCard 컴포넌트
 *
 * 대시보드 통계 정보를 표시하는 카드 컴포넌트입니다.
 * CVA 패턴을 따라 variant와 size를 통해 다양한 스타일을 지원합니다.
 *
 * @example
 * ```tsx
 * import { DollarSign } from 'lucide-react'
 * import { StatCard } from '@/features/admin/components/ui/stat-card'
 * import { formatCurrency } from '@/features/admin/utils/dashboard-formatters'
 *
 * <StatCard
 *   title="총 매출"
 *   value={formatCurrency(1234567)}
 *   subtitle="+12.5% 전월대비"
 *   icon={<DollarSign />}
 *   trend="up"
 *   variant="highlight"
 *   size="default"
 * />
 * ```
 */
const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, variant, size, title, value, subtitle, icon, trend, ...props }, ref) => {
    // 추세에 따른 아이콘 선택
    const TrendIcon = trend === 'up' ? ArrowUpIcon : trend === 'down' ? ArrowDownIcon : MinusIcon

    return (
      <div
        ref={ref}
        className={cn(statCardVariants({ variant, size, className }))}
        role="article"
        aria-label={`${title} 통계 카드`}
        {...props}
      >
        {/* 헤더: 타이틀 + 아이콘 */}
        <div className={cn(statCardHeaderVariants({ size }))}>
          <h3 className={cn(statCardTitleVariants({ size }))}>{title}</h3>
          {icon && (
            <div
              className={cn(statCardIconVariants({ size }), 'text-muted-foreground bg-muted')}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
        </div>

        {/* 메인 값 표시 */}
        <div className="flex-1">
          <p className={cn(statCardValueVariants({ size }))} aria-label={`값: ${value}`}>
            {value}
          </p>
        </div>

        {/* 푸터: 서브타이틀 + 추세 */}
        {subtitle && (
          <div
            className={cn(statCardSubtitleVariants({ size, trend }))}
            aria-label={
              trend
                ? `추세: ${trend === 'up' ? '상승' : trend === 'down' ? '하락' : '변화 없음'}`
                : undefined
            }
          >
            {trend && (
              <TrendIcon
                className={cn(size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4')}
                aria-hidden="true"
              />
            )}
            <span>{subtitle}</span>
          </div>
        )}
      </div>
    )
  }
)

StatCard.displayName = 'StatCard'

export {
  StatCard,
  statCardVariants,
  statCardHeaderVariants,
  statCardTitleVariants,
  statCardValueVariants,
  statCardIconVariants,
  statCardSubtitleVariants,
}
