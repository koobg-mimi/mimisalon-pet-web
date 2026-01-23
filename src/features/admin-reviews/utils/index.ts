/**
 * Admin Reviews Utilities
 *
 * Barrel export for all utility functions and configurations
 * related to admin reviews feature
 */

// Formatter utilities
export {
  // Date formatting
  formatReviewDate,
  formatRelativeDate,
  formatDateTime,
  // Rating formatting
  formatRating,
  getRatingLabel,
  getRatingEmoji,
  // Customer formatting
  formatCustomerName,
  formatMaskedCustomerName,
  // Service formatting
  getServiceName,
  getAllServiceNames,
  formatServicesString,
  getPetNames,
  formatPetNamesString,
  // Text utilities
  truncateText,
  getTextLength,
  // Miscellaneous
  getGroomerName,
  getBookingDate,
} from './review-formatters'

// Status configuration
export {
  // Types
  type ReviewStatus,
  type FilterStatus,
  type SortField,
  type SortOrder,
  type ReviewAction,
  type StatusColorConfig,
  // Status colors and styles
  getStatusColor,
  getStatusColorClasses,
  getStatusIcon,
  getStatusLabel,
  getStatusLabelEn,
  getStatusType,
  // Response status
  getResponseStatusIcon,
  getResponseStatusLabel,
  getResponseStatusColorClasses,
  // Rating configuration
  getRatingColorClasses,
  getRatingIcon,
  // Filter configuration
  getFilterStatusLabel,
  getFilterStatusOptions,
  // Sort configuration
  getSortFieldLabel,
  getSortOrderLabel,
  getSortFieldOptions,
  // Action configuration
  getActionLabel,
  getActionIcon,
} from './review-status-config'
