/**
 * Components for admin-groomers feature
 */

// UI Components
export * from './ui'

// Groomer Components (explicit re-export to avoid type conflicts)
export { GroomerStatsCards, GroomerFilters, GroomersTable, GroomerDetailModal } from './groomers'
export type {
  GroomerStatsCardsProps,
  GroomerFiltersProps,
  GroomersTableProps,
  GroomerDetailModalProps,
} from './groomers'
