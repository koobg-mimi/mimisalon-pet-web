module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/env.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
 */ __turbopack_context__.s([
    "env",
    ()=>env
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$t3$2d$oss$2f$env$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@t3-oss/env-nextjs/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
;
const env = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$t3$2d$oss$2f$env$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createEnv"])({
    /**
   * Server-side environment variables
   * These are only available on the server and never exposed to the client
   */ server: {
        // ===================================================
        // Node Environment
        // ===================================================
        NODE_ENV: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'development',
            'production',
            'test'
        ]).default('development'),
        // ===================================================
        // Database Configuration
        // ===================================================
        DATABASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().describe('PostgreSQL database connection string'),
        // ===================================================
        // Authentication (better-auth)
        // ===================================================
        BETTER_AUTH_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(32).describe('Auth secret key for session encryption'),
        BETTER_AUTH_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().default('http://localhost:3000').describe('Application base URL'),
        AUTH_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional().describe('Deprecated: Use BETTER_AUTH_SECRET instead'),
        AUTH_TRUST_HOST: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().transform((val)=>val === 'true').optional(),
        AUTH_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional().describe('Deprecated: Use BETTER_AUTH_URL instead'),
        // ===================================================
        // Email Configuration (SMTP)
        // ===================================================
        SMTP_HOST: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('SMTP server hostname'),
        SMTP_PORT: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).max(65535).describe('SMTP server port'),
        SMTP_USERNAME: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().describe('SMTP authentication username'),
        SMTP_PASSWORD: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('SMTP authentication password'),
        // ===================================================
        // Twilio Configuration (SMS & Phone Verification)
        // ===================================================
        TWILIO_ACCOUNT_SID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('Twilio Account SID'),
        TWILIO_AUTH_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('Twilio Auth Token'),
        TWILIO_VERIFY_SERVICE_SID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('Twilio Verify Service SID'),
        TWILIO_PHONE_NUMBER: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\+\d{1,15}$/, 'Must be E.164 format').describe('Twilio phone number in E.164 format'),
        // ===================================================
        // PortOne Payment Configuration
        // ===================================================
        PORTONE_API_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('PortOne API secret for partner settlement'),
        PORTONE_CHANNEL_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('PortOne channel key'),
        PORTONE_STORE_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('PortOne store ID'),
        PORTONE_API_BASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().default('https://api.portone.io'),
        PORTONE_WEBHOOK_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional().describe('PortOne webhook secret for signature verification'),
        PORTONE_PLATFORM_ENABLED: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().transform((val)=>val === 'true').optional(),
        PORTONE_DEFAULT_CONTRACT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        // ===================================================
        // Settlement Configuration
        // ===================================================
        SETTLEMENT_COMMISSION_RATE: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().min(0).max(100).default(10),
        // ===================================================
        // Google Cloud Storage (GCS)
        // ===================================================
        GCS_PROJECT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('Google Cloud project ID'),
        GOOGLE_APPLICATION_CREDENTIALS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Path to service account JSON key (local dev only)'),
        GCS_APP_BUCKET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('GCS bucket name for application files'),
        // ===================================================
        // Kakao API (Server-side)
        // ===================================================
        KAKAO_REST_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('Kakao REST API key for geocoding'),
        // ===================================================
        // Firebase Configuration (Push Notifications)
        // ===================================================
        FIREBASE_PROJECT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        FIREBASE_CLIENT_EMAIL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().optional(),
        FIREBASE_PRIVATE_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        // ===================================================
        // Expo Push Notifications
        // ===================================================
        EXPO_ACCESS_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Expo access token for push notifications'),
        // ===================================================
        // JIRA Error Reporting
        // ===================================================
        JIRA_DOMAIN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('JIRA domain for error reporting'),
        JIRA_EMAIL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().optional().describe('JIRA authentication email'),
        JIRA_API_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('JIRA API token'),
        JIRA_PROJECT_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('JIRA project key'),
        // ===================================================
        // Winston Logging Configuration
        // ===================================================
        LOG_LEVEL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'error',
            'warn',
            'info',
            'debug'
        ]).default('info'),
        LOG_DIR: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('logs'),
        LOG_MAX_SIZE: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('20m').describe('Maximum log file size before rotation'),
        LOG_MAX_FILES: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('14d').describe('Keep logs for specified duration'),
        // ===================================================
        // BullMQ Queue Configuration (Optional)
        // ===================================================
        BULLMQ_NOTIFICATION_CONCURRENCY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_EMAIL_CONCURRENCY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_CLEANUP_CONCURRENCY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_EMAIL_RATE_LIMIT: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_NOTIFICATION_RATE_LIMIT: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_MAX_COMPLETED_JOBS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_MAX_FAILED_JOBS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_EMAIL_MAX_ATTEMPTS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_EMAIL_RETRY_DELAY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(0).optional(),
        BULLMQ_CLEANUP_MAX_ATTEMPTS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_CLEANUP_RETRY_DELAY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(0).optional(),
        BULLMQ_ENABLE_LEADER_ELECTION: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().transform((val)=>val === 'true').optional(),
        BULLMQ_LEADER_TTL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1000).optional(),
        BULLMQ_LEADER_HEARTBEAT: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1000).optional(),
        BULLMQ_LEADER_RETRY_INTERVAL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1000).optional(),
        BULLMQ_VERBOSE_LOGGING: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().transform((val)=>val === 'true').optional(),
        BULLMQ_ENABLE_METRICS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().transform((val)=>val === 'true').optional(),
        // ===================================================
        // OAuth Providers (Optional)
        // ===================================================
        GOOGLE_CLIENT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Google OAuth client ID'),
        GOOGLE_CLIENT_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Google OAuth client secret'),
        // ===================================================
        // API Configuration
        // ===================================================
        API_BASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional().describe('Backend API base URL'),
        // ===================================================
        // Webhook & Security Configuration
        // ===================================================
        PORTONE_WEBHOOK_ALLOWED_IPS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default('52.78.100.19,52.78.48.223,52.78.5.241,127.0.0.1,::1').describe('Comma-separated list of allowed IPs for PortOne webhooks'),
        // ===================================================
        // Scheduled Jobs & Cron
        // ===================================================
        CRON_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Secret for authenticating cron job requests - REQUIRED in production'),
        SCHEDULER_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('API key for notification scheduler endpoints'),
        QUEUE_HEALTH_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Authentication token for queue health check endpoint'),
        // ===================================================
        // Build & Runtime
        // ===================================================
        NEXT_PHASE: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Next.js build phase identifier'),
        npm_package_version: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default('1.0.0').describe('Application version')
    },
    /**
   * Client-side environment variables (NEXT_PUBLIC_*)
   * These are exposed to the browser and must be prefixed with NEXT_PUBLIC_
   */ client: {
        // ===================================================
        // Kakao Map API (Client-side)
        // ===================================================
        NEXT_PUBLIC_KAKAO_MAP_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Kakao Map JavaScript API key'),
        // ===================================================
        // PortOne (Client-side)
        // ===================================================
        // Optional for runtime injection via /api/env endpoint
        NEXT_PUBLIC_PORTONE_CHANNEL_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('PortOne channel key for checkout (runtime injected)'),
        NEXT_PUBLIC_PORTONE_STORE_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('PortOne store ID for checkout (runtime injected)'),
        // ===================================================
        // Customer Service
        // ===================================================
        NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('+82-10-4043-9775').describe('Customer service phone number'),
        NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().default('koobg@mimisalon.pet').describe('Customer service email'),
        // ===================================================
        // Client-side Logging
        // ===================================================
        NEXT_PUBLIC_LOGGING_ENABLED: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('true').transform((val)=>val === 'true').describe('Enable client-side error logging')
    },
    /**
   * Runtime environment variable mapping
   * You can't destruct `process.env` as a regular object in Next.js edge runtime
   * so we need to manually map each variable
   */ runtimeEnv: {
        // Node Environment
        NODE_ENV: ("TURBOPACK compile-time value", "development"),
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
        NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL: process.env.NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL
    },
    /**
   * Skip validation during build
   * This allows the build to succeed even if some optional variables are missing
   */ skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    /**
   * Emit validation errors with helpful messages
   */ emptyStringAsUndefined: true
});
}),
"[project]/src/lib/logger.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Winston Logger Configuration
 *
 * Server-side only logger for structured logging to local filesystem.
 * Uses daily log rotation with automatic cleanup.
 *
 * @module lib/logger
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "logApiError",
    ()=>logApiError,
    "logAuthError",
    ()=>logAuthError,
    "logDebug",
    ()=>logDebug,
    "logInfo",
    ()=>logInfo,
    "logNetworkError",
    ()=>logNetworkError,
    "logWarning",
    ()=>logWarning
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/winston/lib/winston.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2d$daily$2d$rotate$2d$file$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/winston-daily-rotate-file/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/env.ts [app-route] (ecmascript)");
;
;
;
;
// ============================================================================
// Configuration (Lazy Initialization)
// ============================================================================
// Lazy getters for configuration to prevent build-time errors
const getLogDir = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].LOG_DIR;
const getLogLevel = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].LOG_LEVEL;
const getLogMaxSize = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].LOG_MAX_SIZE;
const getLogMaxFiles = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].LOG_MAX_FILES;
// ============================================================================
// Custom Log Format
// ============================================================================
/**
 * Custom format for structured JSON logging
 */ const jsonFormat = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].format.combine(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
}), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].format.errors({
    stack: true
}), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].format.metadata({
    fillExcept: [
        'timestamp',
        'level',
        'message'
    ]
}), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].format.json());
/**
 * Custom format for console output (development)
 */ const consoleFormat = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].format.combine(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].format.colorize(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
}), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].format.printf(({ timestamp, level, message, ...metadata })=>{
    let msg = `${timestamp} [${level}]: ${message}`;
    // Add metadata if present
    if (Object.keys(metadata).length > 0) {
        msg += `\n${JSON.stringify(metadata, null, 2)}`;
    }
    return msg;
}));
// ============================================================================
// Lazy Logger Initialization
// ============================================================================
let _logger = null;
/**
 * Get or create the Winston logger instance (lazy initialization)
 * This prevents build-time errors when environment variables are not available
 */ function getLogger() {
    if (!_logger) {
        const LOG_DIR = getLogDir();
        const LOG_LEVEL = getLogLevel();
        const LOG_MAX_SIZE = getLogMaxSize();
        const LOG_MAX_FILES = getLogMaxFiles();
        /**
     * Daily rotate file transport for error logs
     */ const errorFileTransport = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2d$daily$2d$rotate$2d$file$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
            filename: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(LOG_DIR, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxSize: LOG_MAX_SIZE,
            maxFiles: LOG_MAX_FILES,
            format: jsonFormat,
            zippedArchive: true
        });
        /**
     * Daily rotate file transport for combined logs
     */ const combinedFileTransport = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2d$daily$2d$rotate$2d$file$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
            filename: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(LOG_DIR, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: LOG_MAX_SIZE,
            maxFiles: LOG_MAX_FILES,
            format: jsonFormat,
            zippedArchive: true
        });
        /**
     * Daily rotate file transport for network error logs
     */ const networkFileTransport = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2d$daily$2d$rotate$2d$file$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
            filename: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(LOG_DIR, 'network-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: LOG_MAX_SIZE,
            maxFiles: LOG_MAX_FILES,
            format: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].format.combine(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].format((info)=>{
                return info.type === 'NETWORK_ERROR' ? info : false;
            })(), jsonFormat),
            zippedArchive: true
        });
        /**
     * Console transport for development
     */ const consoleTransport = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].transports.Console({
            format: consoleFormat,
            level: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'debug'
        });
        _logger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createLogger({
            level: LOG_LEVEL,
            format: jsonFormat,
            defaultMeta: {
                service: 'mimisalon-nextjs',
                environment: ("TURBOPACK compile-time value", "development") || 'development'
            },
            transports: [
                errorFileTransport,
                combinedFileTransport,
                networkFileTransport,
                consoleTransport
            ],
            exceptionHandlers: [
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2d$daily$2d$rotate$2d$file$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
                    filename: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(LOG_DIR, 'exceptions-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    maxSize: LOG_MAX_SIZE,
                    maxFiles: LOG_MAX_FILES,
                    format: jsonFormat
                })
            ],
            rejectionHandlers: [
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2d$daily$2d$rotate$2d$file$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
                    filename: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(LOG_DIR, 'rejections-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    maxSize: LOG_MAX_SIZE,
                    maxFiles: LOG_MAX_FILES,
                    format: jsonFormat
                })
            ]
        });
    }
    return _logger;
}
// Proxy to maintain API compatibility
const logger = new Proxy({}, {
    get (_, prop) {
        return getLogger()[prop];
    }
});
const logNetworkError = (error)=>{
    logger.error(error.message, {
        type: 'NETWORK_ERROR',
        ...error
    });
};
const logApiError = (endpoint, error, context)=>{
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    logger.error(errorMessage, {
        type: 'API_ERROR',
        endpoint,
        stack: errorStack,
        ...context
    });
};
const logAuthError = (action, error, userId, context)=>{
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(errorMessage, {
        type: 'AUTH_ERROR',
        action,
        userId,
        ...context
    });
};
const logInfo = (message, context)=>{
    logger.info(message, context);
};
const logWarning = (message, context)=>{
    logger.warn(message, context);
};
const logDebug = (message, context)=>{
    logger.debug(message, context);
};
const __TURBOPACK__default__export__ = logger;
}),
"[project]/src/lib/logger-utils.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Logger Utility Functions
 *
 * Helper functions for formatting, sanitizing, and processing logs.
 * Includes privacy protection and data masking utilities.
 *
 * @module lib/logger-utils
 */ // ============================================================================
// Type Definitions
// ============================================================================
/**
 * Network error log entry structure
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "extractBrowserInfo",
    ()=>extractBrowserInfo,
    "formatErrorMessage",
    ()=>formatErrorMessage,
    "getErrorSeverity",
    ()=>getErrorSeverity,
    "maskEmail",
    ()=>maskEmail,
    "maskPhone",
    ()=>maskPhone,
    "maskUserId",
    ()=>maskUserId,
    "sanitizeBody",
    ()=>sanitizeBody,
    "sanitizeHeaders",
    ()=>sanitizeHeaders,
    "sanitizeLog",
    ()=>sanitizeLog,
    "shouldLogError",
    ()=>shouldLogError,
    "validateLog",
    ()=>validateLog
]);
// ============================================================================
// Privacy & Security
// ============================================================================
/**
 * Sensitive header names to exclude from logs
 */ const SENSITIVE_HEADERS = [
    'authorization',
    'cookie',
    'set-cookie',
    'x-api-key',
    'x-auth-token',
    'proxy-authorization'
];
/**
 * Patterns for sensitive data to mask
 */ const SENSITIVE_PATTERNS = {
    email: /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    phone: /(\d{3})[-.\s]?(\d{3,4})[-.\s]?(\d{4})/g,
    creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
    password: /"password"\s*:\s*"[^"]*"/gi,
    token: /"token"\s*:\s*"[^"]*"/gi
};
const maskEmail = (email)=>{
    return email.replace(SENSITIVE_PATTERNS.email, (match, username, domain)=>{
        if (username.length <= 2) return `${username[0]}***@${domain}`;
        return `${username[0]}***${username[username.length - 1]}@${domain}`;
    });
};
const maskPhone = (phone)=>{
    return phone.replace(SENSITIVE_PATTERNS.phone, (match, p1, p2, p3)=>{
        return `${p1}-****-${p3}`;
    });
};
const maskUserId = (userId)=>{
    if (!userId) return undefined;
    if (userId.length <= 5) return '***';
    return `${userId.substring(0, userId.length - 5)}***${userId.substring(userId.length - 2)}`;
};
const sanitizeHeaders = (headers)=>{
    if (!headers) return undefined;
    const sanitized = {};
    for (const [key, value] of Object.entries(headers)){
        const lowerKey = key.toLowerCase();
        // Skip sensitive headers
        if (SENSITIVE_HEADERS.includes(lowerKey)) {
            sanitized[key] = '[REDACTED]';
            continue;
        }
        sanitized[key] = value;
    }
    return sanitized;
};
const sanitizeBody = (body)=>{
    if (!body) return undefined;
    // If body is string, try to parse as JSON
    if (typeof body === 'string') {
        try {
            const parsed = JSON.parse(body);
            return sanitizeBody(parsed);
        } catch  {
            // Not JSON, mask patterns in string
            let sanitized = body;
            for (const [key, pattern] of Object.entries(SENSITIVE_PATTERNS)){
                sanitized = sanitized.replace(pattern, `[MASKED_${key.toUpperCase()}]`);
            }
            return sanitized;
        }
    }
    // If body is object, recursively sanitize
    if (typeof body === 'object' && body !== null) {
        const sanitized = Array.isArray(body) ? [] : {};
        for (const [key, value] of Object.entries(body)){
            const lowerKey = key.toLowerCase();
            // Mask password fields
            if (lowerKey.includes('password') || lowerKey.includes('secret') || lowerKey.includes('token')) {
                sanitized[key] = '[REDACTED]';
                continue;
            }
            // Recursively sanitize nested objects
            if (typeof value === 'object' && value !== null) {
                sanitized[key] = sanitizeBody(value);
            } else if (typeof value === 'string') {
                // Mask sensitive patterns
                let maskedValue = value;
                if (SENSITIVE_PATTERNS.email.test(value)) {
                    maskedValue = maskEmail(value);
                }
                if (SENSITIVE_PATTERNS.phone.test(value)) {
                    maskedValue = maskPhone(value);
                }
                sanitized[key] = maskedValue;
            } else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }
    return body;
};
const sanitizeLog = (log)=>{
    return {
        ...log,
        userId: maskUserId(log.userId),
        requestHeaders: sanitizeHeaders(log.requestHeaders),
        responseHeaders: sanitizeHeaders(log.responseHeaders),
        requestBody: sanitizeBody(log.requestBody),
        responseBody: sanitizeBody(log.responseBody)
    };
};
const formatErrorMessage = (statusCode, originalMessage)=>{
    if (!statusCode) {
        return originalMessage || 'Network error occurred';
    }
    // Client errors (4xx)
    if (statusCode >= 400 && statusCode < 500) {
        switch(statusCode){
            case 400:
                return 'Bad Request - Invalid request data';
            case 401:
                return 'Unauthorized - Authentication required';
            case 403:
                return 'Forbidden - Access denied';
            case 404:
                return 'Not Found - Resource does not exist';
            case 408:
                return 'Request Timeout - Request took too long';
            case 429:
                return 'Too Many Requests - Rate limit exceeded';
            default:
                return originalMessage || `Client error (${statusCode})`;
        }
    }
    // Server errors (5xx)
    if (statusCode >= 500) {
        switch(statusCode){
            case 500:
                return 'Internal Server Error - Server encountered an error';
            case 502:
                return 'Bad Gateway - Invalid response from upstream server';
            case 503:
                return 'Service Unavailable - Server is temporarily unavailable';
            case 504:
                return 'Gateway Timeout - Upstream server timeout';
            default:
                return originalMessage || `Server error (${statusCode})`;
        }
    }
    return originalMessage || `HTTP error (${statusCode})`;
};
const getErrorSeverity = (statusCode)=>{
    if (!statusCode) return 'high';
    // Network/timeout errors
    if (statusCode === 0) return 'critical';
    // Server errors
    if (statusCode >= 500) return 'critical';
    // Authentication errors
    if (statusCode === 401 || statusCode === 403) return 'high';
    // Client errors
    if (statusCode >= 400 && statusCode < 500) return 'medium';
    return 'low';
};
const extractBrowserInfo = (userAgent)=>{
    // Chrome
    if (userAgent.includes('Chrome')) {
        const match = userAgent.match(/Chrome\/(\d+)/);
        return match ? `Chrome ${match[1]}` : 'Chrome';
    }
    // Firefox
    if (userAgent.includes('Firefox')) {
        const match = userAgent.match(/Firefox\/(\d+)/);
        return match ? `Firefox ${match[1]}` : 'Firefox';
    }
    // Safari
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        const match = userAgent.match(/Version\/(\d+)/);
        return match ? `Safari ${match[1]}` : 'Safari';
    }
    // Edge
    if (userAgent.includes('Edg')) {
        const match = userAgent.match(/Edg\/(\d+)/);
        return match ? `Edge ${match[1]}` : 'Edge';
    }
    return 'Unknown Browser';
};
const validateLog = (log)=>{
    // Required fields
    if (!log.url || !log.method || !log.message || !log.timestamp) {
        return false;
    }
    // Valid HTTP method
    const validMethods = [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'HEAD',
        'OPTIONS'
    ];
    if (!validMethods.includes(log.method.toUpperCase())) {
        return false;
    }
    // Valid timestamp
    if (isNaN(Date.parse(log.timestamp))) {
        return false;
    }
    return true;
};
const shouldLogError = (statusCode, url)=>{
    // Always log server errors
    if (statusCode && statusCode >= 500) return true;
    // Always log authentication errors
    if (statusCode === 401 || statusCode === 403) return true;
    // Filter out known noisy endpoints
    const noisyEndpoints = [
        '/api/health',
        '/api/ping',
        '/_next/'
    ];
    if (url && noisyEndpoints.some((endpoint)=>url.includes(endpoint))) {
        return false;
    }
    // Filter out successful requests
    if (statusCode && statusCode >= 200 && statusCode < 400) return false;
    return true;
};
const __TURBOPACK__default__export__ = {
    maskEmail,
    maskPhone,
    maskUserId,
    sanitizeHeaders,
    sanitizeBody,
    sanitizeLog,
    formatErrorMessage,
    getErrorSeverity,
    extractBrowserInfo,
    validateLog,
    shouldLogError
};
}),
"[project]/src/app/api/logs/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Client Log Collection API
 *
 * Server endpoint for receiving client-side network error logs.
 * Implements rate limiting, validation, and Winston logging.
 *
 * @route POST /api/logs
 */ __turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "logBatchSchema",
    ()=>logBatchSchema,
    "logEntrySchema",
    ()=>logEntrySchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/logger.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/logger-utils.ts [app-route] (ecmascript)");
;
;
;
;
// ============================================================================
// Rate Limiting
// ============================================================================
// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map();
const RATE_LIMIT_MAX = 100; // 100 logs per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
/**
 * Check rate limit for client
 */ function checkRateLimit(identifier) {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;
    let entry = rateLimitStore.get(identifier);
    // Clean expired entries
    if (entry && entry.resetTime < now) {
        entry = undefined;
        rateLimitStore.delete(identifier);
    }
    if (!entry) {
        entry = {
            count: 0,
            resetTime: now + RATE_LIMIT_WINDOW
        };
        rateLimitStore.set(identifier, entry);
    }
    const allowed = entry.count < RATE_LIMIT_MAX;
    if (allowed) {
        entry.count += 1;
    }
    return {
        allowed,
        remaining: Math.max(0, RATE_LIMIT_MAX - entry.count),
        resetTime: entry.resetTime
    };
}
const logEntrySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    method: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    statusCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().optional(),
    message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    timestamp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().datetime(),
    requestHeaders: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()).optional(),
    responseHeaders: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()).optional(),
    requestBody: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().optional(),
    responseBody: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any().optional(),
    duration: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    browser: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    userAgent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    sessionId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    userId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    pathname: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    pageUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    referrer: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const logBatchSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    logs: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(logEntrySchema).min(1).max(50)
});
async function POST(request) {
    try {
        // Rate limiting
        const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const rateLimitKey = `logs:${clientIp}`;
        const rateLimit = checkRateLimit(rateLimitKey);
        if (!rateLimit.allowed) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: `Rate limit exceeded. Maximum ${RATE_LIMIT_MAX} logs per hour.`
            }, {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
                    'X-RateLimit-Remaining': rateLimit.remaining.toString(),
                    'X-RateLimit-Reset': rateLimit.resetTime.toString()
                }
            });
        }
        // Parse request body
        const body = await request.json();
        // Validate request
        const validationResult = logBatchSchema.safeParse(body);
        if (!validationResult.success) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Invalid log data',
                details: validationResult.error.issues
            }, {
                status: 400
            });
        }
        const { logs } = validationResult.data;
        // Process each log entry
        let processedCount = 0;
        let skippedCount = 0;
        for (const log of logs){
            // Validate log structure
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateLog"])(log)) {
                skippedCount++;
                continue;
            }
            // Sanitize log (remove sensitive data)
            const sanitized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeLog"])(log);
            // Log to Winston
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logNetworkError"])({
                url: sanitized.url,
                method: sanitized.method,
                statusCode: sanitized.statusCode,
                message: sanitized.message,
                userId: sanitized.userId,
                sessionId: sanitized.sessionId,
                browser: sanitized.browser,
                userAgent: sanitized.userAgent,
                timestamp: sanitized.timestamp,
                pathname: sanitized.pathname,
                pageUrl: sanitized.pageUrl,
                referrer: sanitized.referrer,
                requestHeaders: sanitized.requestHeaders,
                responseHeaders: sanitized.responseHeaders,
                requestBody: sanitized.requestBody,
                responseBody: sanitized.responseBody,
                duration: sanitized.duration
            });
            processedCount++;
        }
        // Success response
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            processed: processedCount,
            skipped: skippedCount,
            message: `Successfully processed ${processedCount} log(s)`
        }, {
            status: 200,
            headers: {
                'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
                'X-RateLimit-Remaining': rateLimit.remaining.toString(),
                'X-RateLimit-Reset': rateLimit.resetTime.toString()
            }
        });
    } catch (error) {
        console.error('[LogAPI] Failed to process logs:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to process logs',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    try {
        const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const rateLimitKey = `logs:${clientIp}`;
        const rateLimit = checkRateLimit(rateLimitKey);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            remaining: rateLimit.remaining,
            resetTime: rateLimit.resetTime,
            limit: RATE_LIMIT_MAX
        });
    } catch (error) {
        console.error('[LogAPI] Failed to get rate limit info:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to get rate limit info'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6d4a8ae8._.js.map