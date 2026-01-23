module.exports = [
"[externals]/nodemailer [external] (nodemailer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("nodemailer", () => require("nodemailer"));

module.exports = mod;
}),
"[project]/src/lib/email.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Email Service
 *
 * Provides email sending functionality using Nodemailer
 * Migrated from packages/worker for direct use in Next.js app
 */ __turbopack_context__.s([
    "checkSMTPHealth",
    ()=>checkSMTPHealth,
    "sendEmail",
    ()=>sendEmail,
    "testSMTPConnection",
    ()=>testSMTPConnection
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$nodemailer__$5b$external$5d$__$28$nodemailer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/nodemailer [external] (nodemailer, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/env.ts [app-route] (ecmascript)");
;
;
/**
 * Get SMTP configuration from environment variables
 */ function getSMTPConfig() {
    return {
        host: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].SMTP_HOST,
        port: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].SMTP_PORT,
        secure: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].SMTP_PORT === 465,
        auth: {
            user: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].SMTP_USERNAME,
            pass: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].SMTP_PASSWORD
        }
    };
}
/**
 * Create email transporter (lazy initialization)
 */ let transporter = null;
function getEmailTransporter() {
    if (!transporter) {
        const smtpConfig = getSMTPConfig();
        transporter = __TURBOPACK__imported__module__$5b$externals$5d2f$nodemailer__$5b$external$5d$__$28$nodemailer$2c$__cjs$29$__["default"].createTransport(smtpConfig);
    }
    return transporter;
}
async function sendEmail({ to, subject, html, text }) {
    try {
        // Validate email address
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to)) {
            return {
                success: false,
                error: `Invalid recipient email address: ${to}`
            };
        }
        // Get transporter
        const transporter = getEmailTransporter();
        // Send email
        const info = await transporter.sendMail({
            from: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].SMTP_USERNAME,
            to,
            subject,
            text: text || undefined,
            html
        });
        console.log('📧 Email sent successfully:', {
            messageId: info.messageId,
            to,
            subject
        });
        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
async function testSMTPConnection() {
    try {
        const transporter = getEmailTransporter();
        await transporter.verify();
        return {
            success: true,
            message: 'SMTP connection test successful'
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
function checkSMTPHealth() {
    try {
        const config = getSMTPConfig();
        if (!config.host || !config.auth.user || !config.auth.pass) {
            return {
                healthy: false,
                message: 'SMTP configuration is incomplete'
            };
        }
        return {
            healthy: true,
            message: `SMTP configured for ${config.host}:${config.port}`
        };
    } catch (error) {
        return {
            healthy: false,
            message: error instanceof Error ? error.message : 'Unknown SMTP error'
        };
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fd3a5b9b._.js.map