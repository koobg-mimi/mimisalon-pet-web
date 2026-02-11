/**
 * Environment Variable Validation
 *
 * Provides type-safe runtime validation for all environment variables
 * using @t3-oss/env-nextjs and Zod schemas.
 *
 * Usage:
 * ```typescript
 * import { env } from '@/lib/env';
 *
 * // Server-side
 * const dbUrl = env.DATABASE_URL;
 *
 * // Client-side
 * const apiKey = env.NEXT_PUBLIC_KAKAO_MAP_KEY;
 * ```
 *
 * Features:
 * - Runtime validation with helpful error messages
 * - TypeScript autocomplete and type safety
 * - Separate server and client validation
 * - Build-time validation to catch issues early
 */

import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  /**
   * Server-side environment variables
   * These are only available on the server and never exposed to the client
   */
  server: {
    // ===================================================
    // Node Environment
    // ===================================================
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // ===================================================
    // Database Configuration
    // ===================================================
    DATABASE_URL: z.string().url().describe('PostgreSQL database connection string'),

    // ===================================================
    // Authentication (better-auth)
    // ===================================================
    BETTER_AUTH_SECRET: z.string().min(32).describe('Auth secret key for session encryption'),
    BETTER_AUTH_URL: z
      .string()
      .url()
      .default('http://localhost:3000')
      .describe('Application base URL'),
    AUTH_SECRET: z
      .string()
      .min(1)
      .optional()
      .describe('Deprecated: Use BETTER_AUTH_SECRET instead'),
    AUTH_TRUST_HOST: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    AUTH_URL: z.string().url().optional().describe('Deprecated: Use BETTER_AUTH_URL instead'),

    // ===================================================
    // Email Configuration (SMTP)
    // ===================================================
    SMTP_HOST: z.string().min(1).describe('SMTP server hostname'),
    SMTP_PORT: z.coerce.number().int().min(1).max(65535).describe('SMTP server port'),
    SMTP_USERNAME: z.string().email().describe('SMTP authentication username'),
    SMTP_PASSWORD: z.string().min(1).describe('SMTP authentication password'),

    // ===================================================
    // Twilio Configuration (SMS & Phone Verification)
    // ===================================================
    TWILIO_ACCOUNT_SID: z.string().min(1).describe('Twilio Account SID'),
    TWILIO_AUTH_TOKEN: z.string().min(1).describe('Twilio Auth Token'),
    TWILIO_VERIFY_SERVICE_SID: z.string().min(1).describe('Twilio Verify Service SID'),
    TWILIO_PHONE_NUMBER: z
      .string()
      .regex(/^\+\d{1,15}$/, 'Must be E.164 format')
      .describe('Twilio phone number in E.164 format'),

    // ===================================================
    // PortOne Payment Configuration
    // ===================================================
    PORTONE_API_SECRET: z.string().min(1).describe('PortOne API secret for partner settlement'),
    PORTONE_CHANNEL_KEY: z.string().min(1).describe('PortOne channel key'),
    PORTONE_STORE_ID: z.string().min(1).describe('PortOne store ID'),
    PORTONE_API_BASE_URL: z.string().url().default('https://api.portone.io'),
    PORTONE_WEBHOOK_SECRET: z
      .string()
      .min(1)
      .optional()
      .describe('PortOne webhook secret for signature verification'),
    PORTONE_PLATFORM_ENABLED: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    PORTONE_DEFAULT_CONTRACT_ID: z.string().optional(),

    // ===================================================
    // Settlement Configuration
    // ===================================================
    SETTLEMENT_COMMISSION_RATE: z.coerce.number().min(0).max(100).default(10),

    // ===================================================
    // Google Cloud Storage (GCS)
    // ===================================================
    GCS_PROJECT_ID: z.string().min(1).describe('Google Cloud project ID'),
    GOOGLE_APPLICATION_CREDENTIALS: z
      .string()
      .optional()
      .describe('Path to service account JSON key (local dev only)'),
    GCS_APP_BUCKET: z.string().min(1).describe('GCS bucket name for application files'),

    // ===================================================
    // Kakao API (Server-side)
    // ===================================================
    KAKAO_REST_API_KEY: z.string().min(1).describe('Kakao REST API key for geocoding'),

    // ===================================================
    // Firebase Configuration (Push Notifications)
    // ===================================================
    FIREBASE_PROJECT_ID: z.string().optional(),
    FIREBASE_CLIENT_EMAIL: z.string().email().optional(),
    FIREBASE_PRIVATE_KEY: z.string().optional(),

    // ===================================================
    // Expo Push Notifications
    // ===================================================
    EXPO_ACCESS_TOKEN: z.string().optional().describe('Expo access token for push notifications'),

    // ===================================================
    // JIRA Error Reporting
    // ===================================================
    JIRA_DOMAIN: z.string().optional().describe('JIRA domain for error reporting'),
    JIRA_EMAIL: z.string().email().optional().describe('JIRA authentication email'),
    JIRA_API_TOKEN: z.string().optional().describe('JIRA API token'),
    JIRA_PROJECT_KEY: z.string().optional().describe('JIRA project key'),

    // ===================================================
    // Winston Logging Configuration
    // ===================================================
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    LOG_DIR: z.string().default('logs'),
    LOG_MAX_SIZE: z.string().default('20m').describe('Maximum log file size before rotation'),
    LOG_MAX_FILES: z.string().default('14d').describe('Keep logs for specified duration'),

    // ===================================================
    // BullMQ Queue Configuration (Optional)
    // ===================================================
    BULLMQ_NOTIFICATION_CONCURRENCY: z.coerce.number().int().min(1).optional(),
    BULLMQ_EMAIL_CONCURRENCY: z.coerce.number().int().min(1).optional(),
    BULLMQ_CLEANUP_CONCURRENCY: z.coerce.number().int().min(1).optional(),
    BULLMQ_EMAIL_RATE_LIMIT: z.coerce.number().int().min(1).optional(),
    BULLMQ_NOTIFICATION_RATE_LIMIT: z.coerce.number().int().min(1).optional(),
    BULLMQ_MAX_COMPLETED_JOBS: z.coerce.number().int().min(1).optional(),
    BULLMQ_MAX_FAILED_JOBS: z.coerce.number().int().min(1).optional(),
    BULLMQ_EMAIL_MAX_ATTEMPTS: z.coerce.number().int().min(1).optional(),
    BULLMQ_EMAIL_RETRY_DELAY: z.coerce.number().int().min(0).optional(),
    BULLMQ_CLEANUP_MAX_ATTEMPTS: z.coerce.number().int().min(1).optional(),
    BULLMQ_CLEANUP_RETRY_DELAY: z.coerce.number().int().min(0).optional(),
    BULLMQ_ENABLE_LEADER_ELECTION: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    BULLMQ_LEADER_TTL: z.coerce.number().int().min(1000).optional(),
    BULLMQ_LEADER_HEARTBEAT: z.coerce.number().int().min(1000).optional(),
    BULLMQ_LEADER_RETRY_INTERVAL: z.coerce.number().int().min(1000).optional(),
    BULLMQ_VERBOSE_LOGGING: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    BULLMQ_ENABLE_METRICS: z
      .string()
      .transform((val) => val === 'true')
      .optional(),

    // ===================================================
    // OAuth Providers (Optional)
    // ===================================================
    GOOGLE_CLIENT_ID: z.string().optional().describe('Google OAuth client ID'),
    GOOGLE_CLIENT_SECRET: z.string().optional().describe('Google OAuth client secret'),

    // ===================================================
    // API Configuration
    // ===================================================
    API_BASE_URL: z.string().url().optional().describe('Backend API base URL'),

    // ===================================================
    // Webhook & Security Configuration
    // ===================================================
    PORTONE_WEBHOOK_ALLOWED_IPS: z
      .string()
      .optional()
      .default('52.78.100.19,52.78.48.223,52.78.5.241,127.0.0.1,::1')
      .describe('Comma-separated list of allowed IPs for PortOne webhooks'),

    // ===================================================
    // Scheduled Jobs & Cron
    // ===================================================
    CRON_SECRET: z
      .string()
      .optional()
      .describe('Secret for authenticating cron job requests - REQUIRED in production'),
    SCHEDULER_API_KEY: z
      .string()
      .optional()
      .describe('API key for notification scheduler endpoints'),
    QUEUE_HEALTH_TOKEN: z
      .string()
      .optional()
      .describe('Authentication token for queue health check endpoint'),

    // ===================================================
    // Build & Runtime
    // ===================================================
    NEXT_PHASE: z.string().optional().describe('Next.js build phase identifier'),
    npm_package_version: z.string().optional().default('1.0.0').describe('Application version'),
  },

  /**
   * Client-side environment variables (NEXT_PUBLIC_*)
   * These are exposed to the browser and must be prefixed with NEXT_PUBLIC_
   */
  client: {
    // ===================================================
    // Kakao Map API (Client-side)
    // ===================================================
    NEXT_PUBLIC_KAKAO_MAP_KEY: z.string().min(1).describe('Kakao Map JavaScript API key'),

    // ===================================================
    // PortOne (Client-side)
    // ===================================================
    // Optional for runtime injection via /api/env endpoint
    NEXT_PUBLIC_PORTONE_CHANNEL_KEY: z
      .string()
      .optional()
      .describe('PortOne channel key for checkout (runtime injected)'),
    NEXT_PUBLIC_PORTONE_STORE_ID: z
      .string()
      .optional()
      .describe('PortOne store ID for checkout (runtime injected)'),

    // ===================================================
    // Customer Service
    // ===================================================
    NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE: z
      .string()
      .default('+82-10-4043-9775')
      .describe('Customer service phone number'),
    NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL: z
      .string()
      .email()
      .default('koobg@mimisalon.pet')
      .describe('Customer service email'),

    // ===================================================
    // Client-side Logging
    // ===================================================
    NEXT_PUBLIC_LOGGING_ENABLED: z
      .string()
      .default('true')
      .transform((val) => val === 'true')
      .describe('Enable client-side error logging'),
  },

  /**
   * Runtime environment variable mapping
   * You can't destruct `process.env` as a regular object in Next.js edge runtime
   * so we need to manually map each variable
   */
  runtimeEnv: {
    // Node Environment
    NODE_ENV: process.env.NODE_ENV,

    // Database
    DATABASE_URL: process.env.DATABASE_URL,

    // Authentication
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
    AUTH_URL: process.env.AUTH_URL,

    // Email
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,

    // Twilio
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_VERIFY_SERVICE_SID: process.env.TWILIO_VERIFY_SERVICE_SID,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,

    // PortOne
    PORTONE_API_SECRET: process.env.PORTONE_API_SECRET,
    PORTONE_CHANNEL_KEY: process.env.PORTONE_CHANNEL_KEY,
    PORTONE_STORE_ID: process.env.PORTONE_STORE_ID,
    PORTONE_API_BASE_URL: process.env.PORTONE_API_BASE_URL,
    PORTONE_WEBHOOK_SECRET: process.env.PORTONE_WEBHOOK_SECRET,
    PORTONE_PLATFORM_ENABLED: process.env.PORTONE_PLATFORM_ENABLED,
    PORTONE_DEFAULT_CONTRACT_ID: process.env.PORTONE_DEFAULT_CONTRACT_ID,
    NEXT_PUBLIC_PORTONE_CHANNEL_KEY: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY,
    NEXT_PUBLIC_PORTONE_STORE_ID: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,

    // Settlement
    SETTLEMENT_COMMISSION_RATE: process.env.SETTLEMENT_COMMISSION_RATE,

    // Google Cloud Storage
    GCS_PROJECT_ID: process.env.GCS_PROJECT_ID,
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    GCS_APP_BUCKET: process.env.GCS_APP_BUCKET,

    // Kakao
    KAKAO_REST_API_KEY: process.env.KAKAO_REST_API_KEY,
    NEXT_PUBLIC_KAKAO_MAP_KEY: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY,

    // Firebase
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,

    // Expo
    EXPO_ACCESS_TOKEN: process.env.EXPO_ACCESS_TOKEN,

    // JIRA
    JIRA_DOMAIN: process.env.JIRA_DOMAIN,
    JIRA_EMAIL: process.env.JIRA_EMAIL,
    JIRA_API_TOKEN: process.env.JIRA_API_TOKEN,
    JIRA_PROJECT_KEY: process.env.JIRA_PROJECT_KEY,

    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL,
    LOG_DIR: process.env.LOG_DIR,
    LOG_MAX_SIZE: process.env.LOG_MAX_SIZE,
    LOG_MAX_FILES: process.env.LOG_MAX_FILES,
    NEXT_PUBLIC_LOGGING_ENABLED: process.env.NEXT_PUBLIC_LOGGING_ENABLED,

    // BullMQ
    BULLMQ_NOTIFICATION_CONCURRENCY: process.env.BULLMQ_NOTIFICATION_CONCURRENCY,
    BULLMQ_EMAIL_CONCURRENCY: process.env.BULLMQ_EMAIL_CONCURRENCY,
    BULLMQ_CLEANUP_CONCURRENCY: process.env.BULLMQ_CLEANUP_CONCURRENCY,
    BULLMQ_EMAIL_RATE_LIMIT: process.env.BULLMQ_EMAIL_RATE_LIMIT,
    BULLMQ_NOTIFICATION_RATE_LIMIT: process.env.BULLMQ_NOTIFICATION_RATE_LIMIT,
    BULLMQ_MAX_COMPLETED_JOBS: process.env.BULLMQ_MAX_COMPLETED_JOBS,
    BULLMQ_MAX_FAILED_JOBS: process.env.BULLMQ_MAX_FAILED_JOBS,
    BULLMQ_EMAIL_MAX_ATTEMPTS: process.env.BULLMQ_EMAIL_MAX_ATTEMPTS,
    BULLMQ_EMAIL_RETRY_DELAY: process.env.BULLMQ_EMAIL_RETRY_DELAY,
    BULLMQ_CLEANUP_MAX_ATTEMPTS: process.env.BULLMQ_CLEANUP_MAX_ATTEMPTS,
    BULLMQ_CLEANUP_RETRY_DELAY: process.env.BULLMQ_CLEANUP_RETRY_DELAY,
    BULLMQ_ENABLE_LEADER_ELECTION: process.env.BULLMQ_ENABLE_LEADER_ELECTION,
    BULLMQ_LEADER_TTL: process.env.BULLMQ_LEADER_TTL,
    BULLMQ_LEADER_HEARTBEAT: process.env.BULLMQ_LEADER_HEARTBEAT,
    BULLMQ_LEADER_RETRY_INTERVAL: process.env.BULLMQ_LEADER_RETRY_INTERVAL,
    BULLMQ_VERBOSE_LOGGING: process.env.BULLMQ_VERBOSE_LOGGING,
    BULLMQ_ENABLE_METRICS: process.env.BULLMQ_ENABLE_METRICS,

    // OAuth
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    // API
    API_BASE_URL: process.env.API_BASE_URL,

    // Webhook & Security
    PORTONE_WEBHOOK_ALLOWED_IPS: process.env.PORTONE_WEBHOOK_ALLOWED_IPS,

    // Scheduled Jobs & Cron
    CRON_SECRET: process.env.CRON_SECRET,
    SCHEDULER_API_KEY: process.env.SCHEDULER_API_KEY,
    QUEUE_HEALTH_TOKEN: process.env.QUEUE_HEALTH_TOKEN,

    // Build & Runtime
    NEXT_PHASE: process.env.NEXT_PHASE,
    npm_package_version: process.env.npm_package_version,

    // Customer Service
    NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE: process.env.NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE,
    NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL: process.env.NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL,
  },

  /**
   * Skip validation during build
   * This allows the build to succeed even if some optional variables are missing
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Emit validation errors with helpful messages
   */
  emptyStringAsUndefined: true,
})
