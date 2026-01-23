module.exports = [
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/packages/shared/dist/prisma/client.js [middleware] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Prisma Client Singleton
 *
 * Ensures single Prisma Client instance across the application
 * Prevents "too many clients" errors in development with HMR
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.prisma = void 0;
const client_1 = __turbopack_context__.r("[externals]/@prisma/client [external] (@prisma/client, cjs)");
// PrismaClient is attached to the `global` object in development
// to prevent exhausting database connection limit
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ?? new client_1.PrismaClient({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        'query',
        'error',
        'warn'
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) {
    globalForPrisma.prisma = exports.prisma;
} //# sourceMappingURL=client.js.map
}),
"[project]/packages/shared/dist/types/worker-api.js [middleware] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Worker API Types
 *
 * TypeScript types for REST API communication with @mimisalon/worker service.
 * Defines request/response shapes for all queue job endpoints.
 *
 * @module types/worker-api
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.WorkerApiError = void 0;
// ============================================================================
// Error Types
// ============================================================================
/**
 * Worker API error class
 */ class WorkerApiError extends Error {
    constructor(message, code, statusCode, details){
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'WorkerApiError';
    }
}
exports.WorkerApiError = WorkerApiError; //# sourceMappingURL=worker-api.js.map
}),
"[project]/packages/shared/dist/types/index.js [middleware] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Shared TypeScript types
 *
 * Export common types used across the monorepo
 */ var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
// Re-export Prisma types
__exportStar(__turbopack_context__.r("[externals]/@prisma/client [external] (@prisma/client, cjs)"), exports);
// Worker API types (shared between Next.js and Worker service)
__exportStar(__turbopack_context__.r("[project]/packages/shared/dist/types/worker-api.js [middleware] (ecmascript)"), exports); //# sourceMappingURL=index.js.map
}),
"[project]/packages/shared/dist/index.js [middleware] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @mimisalon/shared
 *
 * Shared code for MimiSalon monorepo
 * Exports Prisma client, shared types, and utilities
 */ var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.prisma = void 0;
// Export Prisma client
var client_1 = __turbopack_context__.r("[project]/packages/shared/dist/prisma/client.js [middleware] (ecmascript)");
Object.defineProperty(exports, "prisma", {
    enumerable: true,
    get: function() {
        return client_1.prisma;
    }
});
// Export shared types (to be added as needed)
__exportStar(__turbopack_context__.r("[project]/packages/shared/dist/types/index.js [middleware] (ecmascript)"), exports); //# sourceMappingURL=index.js.map
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/env.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$t3$2d$oss$2f$env$2d$nextjs$2f$dist$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@t3-oss/env-nextjs/dist/index.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [middleware] (ecmascript) <export * as z>");
;
;
const env = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$t3$2d$oss$2f$env$2d$nextjs$2f$dist$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createEnv"])({
    /**
   * Server-side environment variables
   * These are only available on the server and never exposed to the client
   */ server: {
        // ===================================================
        // Node Environment
        // ===================================================
        NODE_ENV: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'development',
            'production',
            'test'
        ]).default('development'),
        // ===================================================
        // Database Configuration
        // ===================================================
        DATABASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().describe('PostgreSQL database connection string'),
        // ===================================================
        // Authentication (better-auth)
        // ===================================================
        BETTER_AUTH_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(32).describe('Auth secret key for session encryption'),
        BETTER_AUTH_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().default('http://localhost:3000').describe('Application base URL'),
        AUTH_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional().describe('Deprecated: Use BETTER_AUTH_SECRET instead'),
        AUTH_TRUST_HOST: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().transform((val)=>val === 'true').optional(),
        AUTH_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional().describe('Deprecated: Use BETTER_AUTH_URL instead'),
        // ===================================================
        // Email Configuration (SMTP)
        // ===================================================
        SMTP_HOST: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('SMTP server hostname'),
        SMTP_PORT: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).max(65535).describe('SMTP server port'),
        SMTP_USERNAME: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().describe('SMTP authentication username'),
        SMTP_PASSWORD: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('SMTP authentication password'),
        // ===================================================
        // Twilio Configuration (SMS & Phone Verification)
        // ===================================================
        TWILIO_ACCOUNT_SID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('Twilio Account SID'),
        TWILIO_AUTH_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('Twilio Auth Token'),
        TWILIO_VERIFY_SERVICE_SID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('Twilio Verify Service SID'),
        TWILIO_PHONE_NUMBER: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\+\d{1,15}$/, 'Must be E.164 format').describe('Twilio phone number in E.164 format'),
        // ===================================================
        // PortOne Payment Configuration
        // ===================================================
        PORTONE_API_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('PortOne API secret for partner settlement'),
        PORTONE_CHANNEL_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('PortOne channel key'),
        PORTONE_STORE_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('PortOne store ID'),
        PORTONE_API_BASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().default('https://api.portone.io'),
        PORTONE_WEBHOOK_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional().describe('PortOne webhook secret for signature verification'),
        PORTONE_PLATFORM_ENABLED: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().transform((val)=>val === 'true').optional(),
        PORTONE_DEFAULT_CONTRACT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        // ===================================================
        // Settlement Configuration
        // ===================================================
        SETTLEMENT_COMMISSION_RATE: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().min(0).max(100).default(10),
        // ===================================================
        // Google Cloud Storage (GCS)
        // ===================================================
        GCS_PROJECT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('Google Cloud project ID'),
        GOOGLE_APPLICATION_CREDENTIALS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Path to service account JSON key (local dev only)'),
        GCS_APP_BUCKET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('GCS bucket name for application files'),
        // ===================================================
        // Kakao API (Server-side)
        // ===================================================
        KAKAO_REST_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('Kakao REST API key for geocoding'),
        // ===================================================
        // Firebase Configuration (Push Notifications)
        // ===================================================
        FIREBASE_PROJECT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        FIREBASE_CLIENT_EMAIL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().optional(),
        FIREBASE_PRIVATE_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        // ===================================================
        // Expo Push Notifications
        // ===================================================
        EXPO_ACCESS_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Expo access token for push notifications'),
        // ===================================================
        // JIRA Error Reporting
        // ===================================================
        JIRA_DOMAIN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('JIRA domain for error reporting'),
        JIRA_EMAIL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().optional().describe('JIRA authentication email'),
        JIRA_API_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('JIRA API token'),
        JIRA_PROJECT_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('JIRA project key'),
        // ===================================================
        // Winston Logging Configuration
        // ===================================================
        LOG_LEVEL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'error',
            'warn',
            'info',
            'debug'
        ]).default('info'),
        LOG_DIR: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('logs'),
        LOG_MAX_SIZE: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('20m').describe('Maximum log file size before rotation'),
        LOG_MAX_FILES: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('14d').describe('Keep logs for specified duration'),
        // ===================================================
        // BullMQ Queue Configuration (Optional)
        // ===================================================
        BULLMQ_NOTIFICATION_CONCURRENCY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_EMAIL_CONCURRENCY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_CLEANUP_CONCURRENCY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_EMAIL_RATE_LIMIT: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_NOTIFICATION_RATE_LIMIT: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_MAX_COMPLETED_JOBS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_MAX_FAILED_JOBS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_EMAIL_MAX_ATTEMPTS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_EMAIL_RETRY_DELAY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(0).optional(),
        BULLMQ_CLEANUP_MAX_ATTEMPTS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_CLEANUP_RETRY_DELAY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(0).optional(),
        BULLMQ_ENABLE_LEADER_ELECTION: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().transform((val)=>val === 'true').optional(),
        BULLMQ_LEADER_TTL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1000).optional(),
        BULLMQ_LEADER_HEARTBEAT: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1000).optional(),
        BULLMQ_LEADER_RETRY_INTERVAL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1000).optional(),
        BULLMQ_VERBOSE_LOGGING: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().transform((val)=>val === 'true').optional(),
        BULLMQ_ENABLE_METRICS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().transform((val)=>val === 'true').optional(),
        // ===================================================
        // OAuth Providers (Optional)
        // ===================================================
        GOOGLE_CLIENT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Google OAuth client ID'),
        GOOGLE_CLIENT_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Google OAuth client secret'),
        // ===================================================
        // API Configuration
        // ===================================================
        API_BASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional().describe('Backend API base URL'),
        // ===================================================
        // Webhook & Security Configuration
        // ===================================================
        PORTONE_WEBHOOK_ALLOWED_IPS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default('52.78.100.19,52.78.48.223,52.78.5.241,127.0.0.1,::1').describe('Comma-separated list of allowed IPs for PortOne webhooks'),
        // ===================================================
        // Scheduled Jobs & Cron
        // ===================================================
        CRON_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Secret for authenticating cron job requests - REQUIRED in production'),
        SCHEDULER_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('API key for notification scheduler endpoints'),
        QUEUE_HEALTH_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Authentication token for queue health check endpoint'),
        // ===================================================
        // Build & Runtime
        // ===================================================
        NEXT_PHASE: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Next.js build phase identifier'),
        npm_package_version: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default('1.0.0').describe('Application version')
    },
    /**
   * Client-side environment variables (NEXT_PUBLIC_*)
   * These are exposed to the browser and must be prefixed with NEXT_PUBLIC_
   */ client: {
        // ===================================================
        // Kakao Map API (Client-side)
        // ===================================================
        NEXT_PUBLIC_KAKAO_MAP_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Kakao Map JavaScript API key'),
        // ===================================================
        // PortOne (Client-side)
        // ===================================================
        // Optional for runtime injection via /api/env endpoint
        NEXT_PUBLIC_PORTONE_CHANNEL_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('PortOne channel key for checkout (runtime injected)'),
        NEXT_PUBLIC_PORTONE_STORE_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('PortOne store ID for checkout (runtime injected)'),
        // ===================================================
        // Customer Service
        // ===================================================
        NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('+82-10-4043-9775').describe('Customer service phone number'),
        NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().default('koobg@mimisalon.pet').describe('Customer service email'),
        // ===================================================
        // Client-side Logging
        // ===================================================
        NEXT_PUBLIC_LOGGING_ENABLED: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('true').transform((val)=>val === 'true').describe('Enable client-side error logging')
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
"[project]/src/lib/auth.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/index.mjs [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CDx1PoNO$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__b__as__betterAuth$3e$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/shared/better-auth.CDx1PoNO.mjs [middleware] (ecmascript) <export b as betterAuth>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$adapters$2f$prisma$2d$adapter$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/adapters/prisma-adapter/index.mjs [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$dist$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared/dist/index.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/plugins/index.mjs [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Bz5l8J5E$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__a__as__admin$3e$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/shared/better-auth.Bz5l8J5E.mjs [middleware] (ecmascript) <export a as admin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/plugins/email-otp/index.mjs [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$phone$2d$number$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/better-auth/dist/plugins/phone-number/index.mjs [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/env.ts [middleware] (ecmascript)");
;
;
;
;
;
;
const prisma = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2f$dist$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["PrismaClient"]();
/**
 * Better Auth Configuration
 *
 * Replaces NextAuth.js with better-auth for improved type safety,
 * plugin ecosystem, and better developer experience.
 *
 * Features:
 * - Email/Password authentication with bcrypt
 * - Role-based access control (CUSTOMER, GROOMER, ADMIN)
 * - Prisma adapter for PostgreSQL
 * - Session management with secure cookies
 * - Admin plugin for role management
 */ const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$CDx1PoNO$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__b__as__betterAuth$3e$__["betterAuth"])({
    // Database configuration with Prisma adapter
    database: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$adapters$2f$prisma$2d$adapter$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["prismaAdapter"])(prisma, {
        provider: 'postgresql'
    }),
    // App configuration
    baseURL: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["env"].BETTER_AUTH_URL,
    basePath: '/api/auth',
    secret: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["env"].BETTER_AUTH_SECRET,
    // Trust host in production - include both staging and production domains
    trustedOrigins: [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["env"].BETTER_AUTH_URL,
        'http://localhost:3000',
        'https://mimisalon.pet',
        'https://staging.mimisalon.pet'
    ],
    // Email and password authentication
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url })=>{
            // Import email service dynamically to avoid build-time issues
            const { sendEmail } = await __turbopack_context__.A("[project]/src/lib/email.ts [middleware] (ecmascript, async loader)");
            const { generatePasswordResetTemplate } = await __turbopack_context__.A("[project]/src/features/templates/index.ts [middleware] (ecmascript, async loader)");
            const html = await generatePasswordResetTemplate(user.name || user.email, url);
            await sendEmail({
                to: user.email,
                subject: '비밀번호 재설정 - 미미살롱펫',
                html
            });
        },
        // Custom password hashing and verification (bcrypt)
        password: {
            hash: async (password)=>{
                return await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"].hash(password, 10);
            },
            verify: async ({ hash, password })=>{
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"].compare(password, hash);
            }
        }
    },
    // Email verification configuration
    emailVerification: {
        sendVerificationEmail: async ({ user, url })=>{
            // Import email service dynamically
            const { sendEmail } = await __turbopack_context__.A("[project]/src/lib/email.ts [middleware] (ecmascript, async loader)");
            const { generateEmailVerificationTemplate } = await __turbopack_context__.A("[project]/src/features/templates/index.ts [middleware] (ecmascript, async loader)");
            const html = await generateEmailVerificationTemplate(user.name || user.email, url);
            await sendEmail({
                to: user.email,
                subject: '이메일 인증 - 미미살롱펫',
                html
            });
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true
    },
    // Session configuration
    session: {
        expiresIn: 60 * 60 * 24 * 30,
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5
        }
    },
    // Account linking configuration
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: [
                'credential'
            ]
        }
    },
    // Social providers configuration (add as needed)
    socialProviders: {
    },
    // Plugins for extended functionality
    plugins: [
        // Admin plugin for role-based access control
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$shared$2f$better$2d$auth$2e$Bz5l8J5E$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__$3c$export__a__as__admin$3e$__["admin"])({
            impersonationSessionDuration: 60 * 60
        }),
        // Email OTP plugin for flexible verification
        // Supports: email verification during signup, sign-in OTP, password reset OTP
        // OTP is sent when client calls sendVerificationEmail() method
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$email$2d$otp$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__["emailOTP"])({
            // Send OTP via email for various verification scenarios
            async sendVerificationOTP ({ email, otp, type }) {
                console.log('Sending OTP to:', email, 'with code:', otp);
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            },
            otpLength: 6,
            expiresIn: 600,
            disableSignUp: false,
            allowedAttempts: 5
        }),
        // Phone Number plugin for SMS authentication
        // Supports: phone verification during signup, sign-in OTP, password reset via SMS
        // OTP is sent when client calls sendVerificationOtp() method
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$better$2d$auth$2f$dist$2f$plugins$2f$phone$2d$number$2f$index$2e$mjs__$5b$middleware$5d$__$28$ecmascript$29$__["phoneNumber"])({
            // Send OTP via SMS using Twilio
            async sendOTP ({ phoneNumber, code }, request) {
                console.log('Sending SMS OTP to:', phoneNumber, 'with code:', code);
                // Import Twilio service dynamically
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                console.log('SMS OTP sent successfully to:', phoneNumber);
            },
            otpLength: 6,
            expiresIn: 600,
            allowedAttempts: 3
        })
    ],
    // Advanced options
    advanced: {
        database: {
            generateId: ()=>{
                // Use cuid for ID generation (compatible with existing schema)
                return crypto.randomUUID();
            }
        }
    }
});
const __TURBOPACK__default__export__ = auth;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "proxy",
    ()=>proxy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/env.ts [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [middleware] (ecmascript)");
;
;
;
// PortOne webhook allowed IPs
const getWebhookAllowedIps = ()=>{
    const envIps = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["env"].PORTONE_WEBHOOK_ALLOWED_IPS;
    // Parse comma-separated IPs from environment variable
    const customIps = envIps.split(',').map((ip)=>ip.trim()).filter(Boolean);
    return customIps;
};
const WEBHOOK_ALLOWED_IPS = getWebhookAllowedIps();
// Helper function to extract client IP
function getClientIp(req) {
    // Check various headers that might contain the real IP
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const clientIp = req.headers.get('x-client-ip');
    if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return forwardedFor.split(',')[0].trim();
    }
    if (realIp) {
        return realIp.trim();
    }
    if (clientIp) {
        return clientIp.trim();
    }
    return null;
}
async function proxy(req) {
    const { nextUrl } = req;
    // Get session from better-auth
    const session = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["default"].api.getSession({
        headers: req.headers
    });
    const isLoggedIn = !!session;
    // Extract user role from session if available
    const userRole = session?.user?.role;
    // Define route patterns
    const isAuthPage = nextUrl.pathname.startsWith('/auth');
    const isPublicPage = nextUrl.pathname === '/' || nextUrl.pathname === '/about' || nextUrl.pathname === '/services' || nextUrl.pathname === '/contact' || nextUrl.pathname === '/terms' || nextUrl.pathname === '/error-report';
    const isApiRoute = nextUrl.pathname.startsWith('/api');
    const isAdminRoute = nextUrl.pathname.startsWith('/admin');
    const isGroomerRoute = nextUrl.pathname.startsWith('/groomer');
    const isCustomerRoute = nextUrl.pathname.startsWith('/customer');
    const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard');
    const isPhoneVerificationPage = nextUrl.pathname.startsWith('/auth/verify-phone');
    const isWebhookRoute = nextUrl.pathname.startsWith('/api/v1/webhooks/portone');
    // Check IP whitelist for webhook endpoint
    if (isWebhookRoute) {
        const clientIp = getClientIp(req);
        console.log(`[Webhook] Incoming request from IP: ${clientIp}`);
        console.log(`[Webhook] Headers:`, {
            'x-forwarded-for': req.headers.get('x-forwarded-for'),
            'x-real-ip': req.headers.get('x-real-ip'),
            'x-client-ip': req.headers.get('x-client-ip')
        });
        // Skip IP whitelist check in development environment
        const isDevelopment = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["env"].NODE_ENV === 'development';
        if (isDevelopment) {
            console.log(`[Webhook] Development mode - allowing all IPs`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
        }
        // If we can't determine the IP, log a warning but allow the request
        // This prevents blocking legitimate requests due to header issues
        if (!clientIp) {
            console.warn('[Webhook] Could not determine client IP, allowing request');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
        }
        // Check if the IP is in the whitelist (production only)
        if (!WEBHOOK_ALLOWED_IPS.includes(clientIp)) {
            console.error(`[Webhook] Blocked request from unauthorized IP: ${clientIp}`);
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"](JSON.stringify({
                error: 'Forbidden'
            }), {
                status: 403,
                headers: {
                    'content-type': 'application/json'
                }
            });
        }
        console.log(`[Webhook] Allowed request from IP: ${clientIp}`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Allow all other API routes (auth handled at endpoint level)
    if (isApiRoute) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Allow public pages
    if (isPublicPage) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Allow phone verification page
    if (isPhoneVerificationPage) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Redirect to sign in if accessing protected route without being logged in
    if (!isLoggedIn && !isAuthPage) {
        const callbackUrl = nextUrl.pathname + nextUrl.search;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`, nextUrl));
    }
    // Redirect to appropriate dashboard if accessing auth pages while logged in
    if (isLoggedIn && isAuthPage) {
        // Redirect based on user role
        switch(userRole){
            case 'ADMIN':
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/admin/dashboard/overview', nextUrl));
            case 'GROOMER':
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/groomer/dashboard/overview', nextUrl));
            case 'CUSTOMER':
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/customer/dashboard/overview', nextUrl));
            default:
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/', nextUrl));
        }
    }
    // Handle generic dashboard route
    if (isLoggedIn && isDashboardRoute && nextUrl.pathname === '/dashboard') {
        switch(userRole){
            case 'ADMIN':
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/admin/dashboard/overview', nextUrl));
            case 'GROOMER':
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/groomer/dashboard/overview', nextUrl));
            case 'CUSTOMER':
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/customer/dashboard/overview', nextUrl));
            default:
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/', nextUrl));
        }
    }
    // Phone verification check removed - keeping auth minimal
    // No redirects to /settings/profile for phone verification
    // Role-based route protection
    if (isLoggedIn) {
        // Admin routes - only admins can access
        if (isAdminRoute && userRole !== 'ADMIN') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/unauthorized', nextUrl));
        }
        // Groomer routes - groomers and admins can access
        if (isGroomerRoute && userRole !== 'GROOMER' && userRole !== 'ADMIN') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/unauthorized', nextUrl));
        }
        // Customer routes - customers and admins can access
        if (isCustomerRoute && userRole !== 'CUSTOMER' && userRole !== 'ADMIN') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/unauthorized', nextUrl));
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.svg (favicon files)
     * - public assets (logo, manifest, robots, etc.)
     * - API health check endpoints
     */ '/((?!_next/static|_next/image|favicon.ico|icon.svg|logo.*|manifest.json|robots.txt|sitemap.xml|sw.js|workbox-.*|api/health).*)'
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3f453a48._.js.map