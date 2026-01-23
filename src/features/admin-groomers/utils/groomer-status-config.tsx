import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

/**
 * Groomer active status type (for badge display)
 */
export type GroomerActiveStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

/**
 * Badge variant type (from shadcn Badge component)
 */
export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning'

/**
 * Configuration for a groomer status
 */
export interface GroomerStatusConfig {
  /**
   * The status value
   */
  status: GroomerActiveStatus
  /**
   * Display label for the status
   */
  label: string
  /**
   * Icon component for the status
   */
  icon: React.ReactNode
  /**
   * Badge variant for the status
   */
  variant: BadgeVariant
  /**
   * Description of the status
   */
  description: string
}

/**
 * Status configurations
 * Maps each groomer status to its display properties
 */
const statusConfigs: Record<GroomerActiveStatus, GroomerStatusConfig> = {
  ACTIVE: {
    status: 'ACTIVE',
    label: '활성',
    icon: <CheckCircle2 className="h-3 w-3" />,
    variant: 'success',
    description: '현재 활성화된 미용사',
  },
  INACTIVE: {
    status: 'INACTIVE',
    label: '비활성',
    icon: <XCircle className="h-3 w-3" />,
    variant: 'secondary',
    description: '비활성화된 미용사',
  },
  SUSPENDED: {
    status: 'SUSPENDED',
    label: '정지',
    icon: <AlertCircle className="h-3 w-3" />,
    variant: 'destructive',
    description: '정지된 미용사',
  },
}

/**
 * Get status configuration for a groomer status
 * @param isActive - Whether the groomer is active
 * @returns Status configuration
 * @example
 * const config = getStatusConfig(true)
 * // { status: 'ACTIVE', label: '활성', icon: <CheckCircle2 />, variant: 'success', ... }
 */
export function getStatusConfig(isActive: boolean): GroomerStatusConfig {
  return isActive ? statusConfigs.ACTIVE : statusConfigs.INACTIVE
}

/**
 * Get status configuration by status string
 * @param status - The groomer status
 * @returns Status configuration
 * @example
 * const config = getStatusConfigByStatus('ACTIVE')
 * // { status: 'ACTIVE', label: '활성', icon: <CheckCircle2 />, variant: 'success', ... }
 */
export function getStatusConfigByStatus(status: GroomerActiveStatus): GroomerStatusConfig {
  return statusConfigs[status]
}

/**
 * Get all status configurations
 * @returns Array of all status configurations
 */
export function getAllStatusConfigs(): GroomerStatusConfig[] {
  return Object.values(statusConfigs)
}
