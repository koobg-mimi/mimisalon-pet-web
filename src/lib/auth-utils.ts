import auth from '@/lib/auth';
import { UserRole } from '@mimisalon/shared';
import { headers } from 'next/headers';

/**
 * Authentication utility functions for better-auth
 *
 * These utilities provide a convenient API for common auth operations
 * in Server Components, Server Actions, and API routes.
 */

/**
 * Get the current authenticated session
 * Can be used in Server Components and Server Actions
 *
 * @returns Session object or null if not authenticated
 */
export async function getSession() {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}

/**
 * Get the current authenticated user
 * Returns null if not authenticated
 *
 * @returns User object or null
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Check if the current user has a specific role
 *
 * @param role - Single role or array of roles to check
 * @returns True if user has one of the specified roles
 */
export async function hasRole(role: UserRole | UserRole[]): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(user.role as UserRole);
}

/**
 * Require authentication - throws an error if not authenticated
 * Useful for protecting API routes and server actions
 *
 * @throws Error if user is not authenticated
 * @returns Session object
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error('Unauthorized: Authentication required');
  }
  return session;
}

/**
 * Require a specific role - throws an error if not authorized
 *
 * @param role - Single role or array of allowed roles
 * @throws Error if user doesn't have required role
 * @returns Session object
 */
export async function requireRole(role: UserRole | UserRole[]) {
  const session = await requireAuth();

  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(session.user.role as UserRole)) {
    throw new Error(`Unauthorized: Requires ${roles.join(' or ')} role`);
  }

  return session;
}

/**
 * Check if a user can access a specific resource
 * This is a placeholder for more complex authorization logic
 *
 * @param resourceType - Type of resource being accessed
 * @param resourceId - ID of the resource
 * @param action - Action being performed
 * @returns True if user can access the resource
 */
export async function canAccessResource(
  resourceType: 'pet' | 'booking' | 'service' | 'user',
  resourceId: string,
  action: 'view' | 'create' | 'update' | 'delete'
): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  // Admin can access everything
  if (user.role === 'ADMIN') return true;

  // Implement resource-specific logic here
  switch (resourceType) {
    case 'pet':
      // Customers can manage their own pets
      if (user.role === 'CUSTOMER') {
        // Would need to check if the pet belongs to the user
        return action === 'view' || action === 'create';
      }
      break;

    case 'booking':
      // Customers can view/create their bookings
      // Groomers can view assigned bookings
      if (user.role === 'CUSTOMER') {
        return action === 'view' || action === 'create';
      }
      if (user.role === 'GROOMER') {
        return action === 'view' || action === 'update';
      }
      break;

    case 'service':
      // Only admins can manage services
      return false;

    case 'user':
      // Users can view/update their own profile
      if (resourceId === user.id) {
        return action === 'view' || action === 'update';
      }
      break;
  }

  return false;
}

/**
 * Generate a secure random token
 * Useful for email verification, password reset, etc.
 *
 * @param length - Length of the token (default: 32)
 * @returns Random token string
 */
export function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return token;
}

/**
 * Generate a numeric OTP (One-Time Password)
 * Useful for phone verification
 *
 * @param length - Length of the OTP (default: 6)
 * @returns Numeric OTP string
 */
export function generateOTP(length: number = 6): string {
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }

  return otp;
}

/**
 * Format user display name
 *
 * @param user - User object with name and email
 * @returns Formatted display name
 */
export function getUserDisplayName(user: { name?: string | null; email: string }): string {
  return user.name || user.email.split('@')[0];
}

/**
 * Get role display name in Korean
 *
 * @param role - User role
 * @returns Korean display name for the role
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    CUSTOMER: '고객',
    GROOMER: '미용사',
    ADMIN: '관리자',
  };

  return roleNames[role] || role;
}

/**
 * Password hashing and verification are now handled by better-auth
 * These functions are no longer needed and have been removed:
 * - hashPassword() - Use auth.api.signUpEmail() instead
 * - verifyPassword() - Handled internally by better-auth
 */
