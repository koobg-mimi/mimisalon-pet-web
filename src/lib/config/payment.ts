/**
 * Payment configuration constants
 */

/**
 * Payment expiry time in minutes
 * PENDING payments older than this will be marked as EXPIRED
 */
export const PAYMENT_EXPIRY_MINUTES = 30;

/**
 * Payment expiry time in milliseconds
 */
export const PAYMENT_EXPIRY_MS = PAYMENT_EXPIRY_MINUTES * 60 * 1000;
