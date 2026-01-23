/**
 * Admin Groomers Feature Module
 *
 * This module provides groomer management functionality for administrators.
 * Follows feature-based architecture with proper separation of concerns.
 */

// Types
export type {
  AdminGroomerInfo,
  AdminGroomersGetResponse,
  GroomerStatus,
  GroomerFilters as GroomerFiltersState,
  GroomerStats,
  InfiniteScrollState,
  GroomerAction,
  UpdateCommissionGradeRequest,
  UpdateGroomerStatusRequest,
} from './types'
export { QUERY_CONFIG } from './types'

// API Layer
export * from './api'

// State Management (RTK Query)
export * from './state'

// Custom Hooks
export * from './hooks'

// Components
export * from './components'

// Utilities
export * from './utils'
