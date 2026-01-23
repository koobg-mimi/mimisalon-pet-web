module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/src/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])('inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation active:scale-[0.98] active:opacity-90 relative overflow-hidden', {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md active:shadow-sm before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95 shadow-sm hover:shadow-md',
            outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/90 shadow-sm hover:shadow-md hover:border-primary/30',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90 shadow-sm hover:shadow-md',
            ghost: 'hover:bg-accent hover:text-accent-foreground active:bg-accent/90',
            link: 'text-primary underline-offset-4 hover:underline active:text-primary/80',
            cta: 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl active:shadow-md transform hover:scale-[1.02] active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700',
            'cta-outline': 'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300',
            'mobile-primary': 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl active:shadow-md min-h-[48px] sm:min-h-[44px] rounded-lg font-semibold'
        },
        size: {
            default: 'min-h-[44px] px-4 py-3 sm:min-h-[40px] sm:py-2',
            sm: 'min-h-[40px] rounded-md px-3 py-2 sm:min-h-[36px] text-sm',
            lg: 'min-h-[48px] rounded-md px-6 py-3 sm:min-h-[44px] sm:px-8 text-base',
            xl: 'min-h-[52px] rounded-lg px-8 py-4 sm:min-h-[48px] sm:px-10 text-lg font-semibold',
            icon: 'min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px]',
            'icon-sm': 'min-h-[36px] min-w-[36px] sm:min-h-[32px] sm:min-w-[32px]',
            'icon-lg': 'min-h-[48px] min-w-[48px] sm:min-h-[44px] sm:min-w-[44px]'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 58,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Button.displayName = 'Button';
;
}),
"[project]/src/lib/env.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$t3$2d$oss$2f$env$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@t3-oss/env-nextjs/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z>");
;
;
const env = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$t3$2d$oss$2f$env$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEnv"])({
    /**
   * Server-side environment variables
   * These are only available on the server and never exposed to the client
   */ server: {
        // ===================================================
        // Node Environment
        // ===================================================
        NODE_ENV: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'development',
            'production',
            'test'
        ]).default('development'),
        // ===================================================
        // Database Configuration
        // ===================================================
        DATABASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().describe('PostgreSQL database connection string'),
        // ===================================================
        // Authentication (better-auth)
        // ===================================================
        BETTER_AUTH_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(32).describe('Auth secret key for session encryption'),
        BETTER_AUTH_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().default('http://localhost:3000').describe('Application base URL'),
        AUTH_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional().describe('Deprecated: Use BETTER_AUTH_SECRET instead'),
        AUTH_TRUST_HOST: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().transform((val)=>val === 'true').optional(),
        AUTH_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional().describe('Deprecated: Use BETTER_AUTH_URL instead'),
        // ===================================================
        // Email Configuration (SMTP)
        // ===================================================
        SMTP_HOST: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('SMTP server hostname'),
        SMTP_PORT: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).max(65535).describe('SMTP server port'),
        SMTP_USERNAME: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().describe('SMTP authentication username'),
        SMTP_PASSWORD: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('SMTP authentication password'),
        // ===================================================
        // Twilio Configuration (SMS & Phone Verification)
        // ===================================================
        TWILIO_ACCOUNT_SID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('Twilio Account SID'),
        TWILIO_AUTH_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('Twilio Auth Token'),
        TWILIO_VERIFY_SERVICE_SID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('Twilio Verify Service SID'),
        TWILIO_PHONE_NUMBER: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^\+\d{1,15}$/, 'Must be E.164 format').describe('Twilio phone number in E.164 format'),
        // ===================================================
        // PortOne Payment Configuration
        // ===================================================
        PORTONE_API_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('PortOne API secret for partner settlement'),
        PORTONE_CHANNEL_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('PortOne channel key'),
        PORTONE_STORE_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('PortOne store ID'),
        PORTONE_API_BASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().default('https://api.portone.io'),
        PORTONE_WEBHOOK_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional().describe('PortOne webhook secret for signature verification'),
        PORTONE_PLATFORM_ENABLED: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().transform((val)=>val === 'true').optional(),
        PORTONE_DEFAULT_CONTRACT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        // ===================================================
        // Settlement Configuration
        // ===================================================
        SETTLEMENT_COMMISSION_RATE: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().min(0).max(100).default(10),
        // ===================================================
        // Google Cloud Storage (GCS)
        // ===================================================
        GCS_PROJECT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('Google Cloud project ID'),
        GOOGLE_APPLICATION_CREDENTIALS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Path to service account JSON key (local dev only)'),
        GCS_APP_BUCKET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('GCS bucket name for application files'),
        // ===================================================
        // Kakao API (Server-side)
        // ===================================================
        KAKAO_REST_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).describe('Kakao REST API key for geocoding'),
        // ===================================================
        // Firebase Configuration (Push Notifications)
        // ===================================================
        FIREBASE_PROJECT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        FIREBASE_CLIENT_EMAIL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().optional(),
        FIREBASE_PRIVATE_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
        // ===================================================
        // Expo Push Notifications
        // ===================================================
        EXPO_ACCESS_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Expo access token for push notifications'),
        // ===================================================
        // JIRA Error Reporting
        // ===================================================
        JIRA_DOMAIN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('JIRA domain for error reporting'),
        JIRA_EMAIL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().optional().describe('JIRA authentication email'),
        JIRA_API_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('JIRA API token'),
        JIRA_PROJECT_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('JIRA project key'),
        // ===================================================
        // Winston Logging Configuration
        // ===================================================
        LOG_LEVEL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            'error',
            'warn',
            'info',
            'debug'
        ]).default('info'),
        LOG_DIR: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('logs'),
        LOG_MAX_SIZE: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('20m').describe('Maximum log file size before rotation'),
        LOG_MAX_FILES: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('14d').describe('Keep logs for specified duration'),
        // ===================================================
        // BullMQ Queue Configuration (Optional)
        // ===================================================
        BULLMQ_NOTIFICATION_CONCURRENCY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_EMAIL_CONCURRENCY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_CLEANUP_CONCURRENCY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_EMAIL_RATE_LIMIT: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_NOTIFICATION_RATE_LIMIT: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_MAX_COMPLETED_JOBS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_MAX_FAILED_JOBS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_EMAIL_MAX_ATTEMPTS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_EMAIL_RETRY_DELAY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(0).optional(),
        BULLMQ_CLEANUP_MAX_ATTEMPTS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1).optional(),
        BULLMQ_CLEANUP_RETRY_DELAY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(0).optional(),
        BULLMQ_ENABLE_LEADER_ELECTION: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().transform((val)=>val === 'true').optional(),
        BULLMQ_LEADER_TTL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1000).optional(),
        BULLMQ_LEADER_HEARTBEAT: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1000).optional(),
        BULLMQ_LEADER_RETRY_INTERVAL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().int().min(1000).optional(),
        BULLMQ_VERBOSE_LOGGING: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().transform((val)=>val === 'true').optional(),
        BULLMQ_ENABLE_METRICS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().transform((val)=>val === 'true').optional(),
        // ===================================================
        // OAuth Providers (Optional)
        // ===================================================
        GOOGLE_CLIENT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Google OAuth client ID'),
        GOOGLE_CLIENT_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Google OAuth client secret'),
        // ===================================================
        // API Configuration
        // ===================================================
        API_BASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional().describe('Backend API base URL'),
        // ===================================================
        // Webhook & Security Configuration
        // ===================================================
        PORTONE_WEBHOOK_ALLOWED_IPS: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default('52.78.100.19,52.78.48.223,52.78.5.241,127.0.0.1,::1').describe('Comma-separated list of allowed IPs for PortOne webhooks'),
        // ===================================================
        // Scheduled Jobs & Cron
        // ===================================================
        CRON_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Secret for authenticating cron job requests - REQUIRED in production'),
        SCHEDULER_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('API key for notification scheduler endpoints'),
        QUEUE_HEALTH_TOKEN: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Authentication token for queue health check endpoint'),
        // ===================================================
        // Build & Runtime
        // ===================================================
        NEXT_PHASE: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Next.js build phase identifier'),
        npm_package_version: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().default('1.0.0').describe('Application version')
    },
    /**
   * Client-side environment variables (NEXT_PUBLIC_*)
   * These are exposed to the browser and must be prefixed with NEXT_PUBLIC_
   */ client: {
        // ===================================================
        // Kakao Map API (Client-side)
        // ===================================================
        NEXT_PUBLIC_KAKAO_MAP_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('Kakao Map JavaScript API key'),
        // ===================================================
        // PortOne (Client-side)
        // ===================================================
        // Optional for runtime injection via /api/env endpoint
        NEXT_PUBLIC_PORTONE_CHANNEL_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('PortOne channel key for checkout (runtime injected)'),
        NEXT_PUBLIC_PORTONE_STORE_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().describe('PortOne store ID for checkout (runtime injected)'),
        // ===================================================
        // Customer Service
        // ===================================================
        NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('+82-10-4043-9775').describe('Customer service phone number'),
        NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().default('koobg@mimisalon.pet').describe('Customer service email'),
        // ===================================================
        // Client-side Logging
        // ===================================================
        NEXT_PUBLIC_LOGGING_ENABLED: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default('true').transform((val)=>val === 'true').describe('Enable client-side error logging')
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
"[project]/src/lib/constants/customer-service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Customer Service Contact Information Constants
 * Centralized configuration for customer support contact details
 */ __turbopack_context__.s([
    "CUSTOMER_SERVICE",
    ()=>CUSTOMER_SERVICE
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/env.ts [app-ssr] (ecmascript)");
;
const CUSTOMER_SERVICE = {
    // Phone number for customer service
    PHONE: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["env"].NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE,
    // Email address for customer service
    EMAIL: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["env"].NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL,
    // Formatted display values with icons
    PHONE_DISPLAY: `📞 ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["env"].NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE}`,
    EMAIL_DISPLAY: `📧 ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["env"].NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL}`,
    // URLs for direct contact
    get PHONE_URL () {
        return `tel:${this.PHONE.replace(/-/g, '')}`;
    },
    get EMAIL_URL () {
        return `mailto:${this.EMAIL}`;
    }
};
}),
"[project]/src/app/global-error.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GlobalError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$customer$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants/customer-service.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function GlobalError({ error, reset }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Log the error to an error reporting service
        console.error('Global application error:', error);
    }, [
        error
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-background flex min-h-screen items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 py-16",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto max-w-2xl space-y-8 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-4xl",
                                            children: "💥"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/global-error.tsx",
                                            lineNumber: 28,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/global-error.tsx",
                                        lineNumber: 27,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-6xl font-bold text-red-600",
                                        children: "오류"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/global-error.tsx",
                                        lineNumber: 30,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-foreground text-2xl font-semibold",
                                        children: "예상치 못한 오류가 발생했습니다"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/global-error.tsx",
                                        lineNumber: 31,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-muted-foreground text-lg",
                                        children: [
                                            "애플리케이션에 심각한 문제가 발생했습니다.",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/src/app/global-error.tsx",
                                                lineNumber: 36,
                                                columnNumber: 19
                                            }, this),
                                            "페이지를 새로고침하거나 잠시 후 다시 시도해 주세요."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/global-error.tsx",
                                        lineNumber: 34,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/global-error.tsx",
                                lineNumber: 26,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-lg border border-red-200 bg-red-50 p-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                    className: "text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                            className: "mb-2 cursor-pointer font-medium text-red-900",
                                            children: "기술적 세부사항"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/global-error.tsx",
                                            lineNumber: 43,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                            className: "overflow-auto text-xs whitespace-pre-wrap text-red-800",
                                            children: [
                                                error.message,
                                                error.digest && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-2",
                                                    children: [
                                                        "Error ID: ",
                                                        error.digest
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/global-error.tsx",
                                                    lineNumber: 48,
                                                    columnNumber: 38
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/global-error.tsx",
                                            lineNumber: 46,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/global-error.tsx",
                                    lineNumber: 42,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/global-error.tsx",
                                lineNumber: 41,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col justify-center gap-4 sm:flex-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "lg",
                                        onClick: reset,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                className: "mr-2 h-5 w-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/global-error.tsx",
                                                lineNumber: 55,
                                                columnNumber: 19
                                            }, this),
                                            "애플리케이션 재시작"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/global-error.tsx",
                                        lineNumber: 54,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "lg",
                                        onClick: ()=>window.location.href = '/',
                                        children: "홈페이지로 이동"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/global-error.tsx",
                                        lineNumber: 58,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/global-error.tsx",
                                lineNumber: 53,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-border border-t pt-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-muted-foreground space-y-2 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "이 오류는 자동으로 기록되었습니다. 계속 문제가 발생하면 고객센터로 문의해 주세요."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/global-error.tsx",
                                            lineNumber: 65,
                                            columnNumber: 19
                                        }, this),
                                        error.digest && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "rounded bg-gray-100 p-2 font-mono text-xs",
                                            children: [
                                                "오류 ID: ",
                                                error.digest
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/global-error.tsx",
                                            lineNumber: 70,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col justify-center gap-4 text-sm sm:flex-row",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$customer$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CUSTOMER_SERVICE"].PHONE_DISPLAY
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/global-error.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2f$customer$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CUSTOMER_SERVICE"].EMAIL_DISPLAY
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/global-error.tsx",
                                                    lineNumber: 76,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/global-error.tsx",
                                            lineNumber: 74,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/global-error.tsx",
                                    lineNumber: 64,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/global-error.tsx",
                                lineNumber: 63,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/global-error.tsx",
                        lineNumber: 25,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/global-error.tsx",
                    lineNumber: 24,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/global-error.tsx",
                lineNumber: 23,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/global-error.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/global-error.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__22a60a62._.js.map