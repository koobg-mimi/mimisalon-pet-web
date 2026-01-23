/**
 * Customer Service Contact Information Constants
 * Centralized configuration for customer support contact details
 */

import { env } from '../env';

export const CUSTOMER_SERVICE = {
  // Phone number for customer service
  PHONE: env.NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE,

  // Email address for customer service
  EMAIL: env.NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL,

  // Formatted display values with icons
  PHONE_DISPLAY: `📞 ${env.NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE}`,
  EMAIL_DISPLAY: `📧 ${env.NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL}`,

  // URLs for direct contact
  get PHONE_URL() {
    return `tel:${this.PHONE.replace(/-/g, '')}`;
  },
  get EMAIL_URL() {
    return `mailto:${this.EMAIL}`;
  },
} as const;
