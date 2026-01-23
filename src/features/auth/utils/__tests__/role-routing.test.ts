/**
 * @fileoverview Tests for role-based routing utility functions
 * @module features/auth/utils/__tests__/role-routing
 */

import { describe, it, expect } from 'vitest'
import { getRoleDashboardUrl } from '../role-routing'
import type { UserRole } from '@mimisalon/shared'

describe('getRoleDashboardUrl', () => {
  describe('valid role routing', () => {
    it('should return "/admin/dashboard/overview" for ADMIN role', () => {
      expect(getRoleDashboardUrl('ADMIN')).toBe('/admin/dashboard/overview')
    })

    it('should return "/groomer/dashboard/overview" for GROOMER role', () => {
      expect(getRoleDashboardUrl('GROOMER')).toBe('/groomer/dashboard/overview')
    })

    it('should return "/customer/dashboard/overview" for CUSTOMER role', () => {
      expect(getRoleDashboardUrl('CUSTOMER')).toBe('/customer/dashboard/overview')
    })
  })

  describe('undefined/null role handling', () => {
    it('should return default fallback "/" when role is undefined', () => {
      expect(getRoleDashboardUrl(undefined)).toBe('/')
    })

    it('should return custom fallback when role is undefined and fallback provided', () => {
      expect(getRoleDashboardUrl(undefined, '/login')).toBe('/login')
    })
  })

  describe('custom fallback URL', () => {
    it('should use custom fallback for undefined role', () => {
      expect(getRoleDashboardUrl(undefined, '/home')).toBe('/home')
    })

    it('should ignore fallback when valid role is provided', () => {
      expect(getRoleDashboardUrl('ADMIN', '/home')).toBe('/admin/dashboard/overview')
      expect(getRoleDashboardUrl('GROOMER', '/home')).toBe('/groomer/dashboard/overview')
      expect(getRoleDashboardUrl('CUSTOMER', '/home')).toBe('/customer/dashboard/overview')
    })
  })

  describe('invalid role handling', () => {
    it('should return default fallback for invalid role', () => {
      // Type assertion to test runtime behavior with invalid values
      expect(getRoleDashboardUrl('INVALID_ROLE' as UserRole)).toBe('/')
    })

    it('should return custom fallback for invalid role', () => {
      // Type assertion to test runtime behavior with invalid values
      expect(getRoleDashboardUrl('UNKNOWN' as UserRole, '/error')).toBe('/error')
    })

    it('should handle empty string as role', () => {
      // Type assertion to test runtime behavior with edge case
      expect(getRoleDashboardUrl('' as UserRole)).toBe('/')
    })
  })
})
