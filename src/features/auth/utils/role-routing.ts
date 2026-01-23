/**
 * Role-based routing utility for authentication
 * @module features/auth/utils/role-routing
 */

import type { UserRole } from '@mimisalon/shared'

/**
 * Get the appropriate dashboard URL based on user role
 * @param role - User role (ADMIN, GROOMER, CUSTOMER)
 * @param fallback - Fallback URL if role doesn't match (default: '/')
 * @returns Dashboard URL for the given role
 */
export function getRoleDashboardUrl(role?: UserRole, fallback: string = '/'): string {
  if (!role) return fallback

  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard/overview'
    case 'GROOMER':
      return '/groomer/dashboard/overview'
    case 'CUSTOMER':
      return '/customer/dashboard/overview'
    default:
      return fallback
  }
}
