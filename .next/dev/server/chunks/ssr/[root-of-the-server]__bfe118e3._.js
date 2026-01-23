module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/lib/client-logger.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Client-Side Logger
 *
 * Browser-side logger that collects network errors and sends them to the server.
 * Implements batching, debouncing, and error retry logic.
 *
 * @module lib/client-logger
 * @clientOnly
 */ __turbopack_context__.s([
    "clearLogs",
    ()=>clearLogs,
    "default",
    ()=>__TURBOPACK__default__export__,
    "flushLogs",
    ()=>flushLogs,
    "logNetworkError",
    ()=>logNetworkError
]);
'use client';
// ============================================================================
// Configuration
// ============================================================================
const BATCH_SIZE = 10; // Send logs when batch reaches this size
const BATCH_INTERVAL = 5000; // Send logs every 5 seconds
const MAX_RETRIES = 3; // Maximum retry attempts
const LOG_API_ENDPOINT = '/api/logs'; // Server endpoint for log collection
// Check if logging is enabled
const isLoggingEnabled = ()=>{
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
};
// ============================================================================
// Browser Context
// ============================================================================
/**
 * Generate or retrieve session ID
 */ const getSessionId = ()=>{
    if ("TURBOPACK compile-time truthy", 1) return 'ssr-session';
    //TURBOPACK unreachable
    ;
    const STORAGE_KEY = undefined;
    let sessionId;
};
/**
 * Extract browser info from user agent
 */ const getBrowserInfo = ()=>{
    if ("TURBOPACK compile-time truthy", 1) return 'Unknown';
    //TURBOPACK unreachable
    ;
    const ua = undefined;
};
/**
 * Get current user ID (if available from session/cookie)
 */ const getUserId = ()=>{
    if ("TURBOPACK compile-time truthy", 1) return undefined;
    //TURBOPACK unreachable
    ;
};
/**
 * Enrich error with browser context
 */ const enrichError = (error)=>{
    return {
        ...error,
        browser: getBrowserInfo(),
        userAgent: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'Unknown',
        sessionId: getSessionId(),
        userId: getUserId(),
        pathname: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '',
        pageUrl: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '',
        referrer: typeof document !== 'undefined' ? document.referrer : ''
    };
};
// ============================================================================
// Batch Management
// ============================================================================
/**
 * Log batch queue
 */ class LogBatchQueue {
    queue = [];
    timer = null;
    isSending = false;
    /**
   * Add error to queue
   */ add(error) {
        if (!isLoggingEnabled()) return;
        const enriched = enrichError(error);
        this.queue.push(enriched);
        // Send immediately if batch is full
        if (this.queue.length >= BATCH_SIZE) {
            this.flush();
        } else {
            // Schedule batch send
            this.scheduleBatchSend();
        }
    }
    /**
   * Schedule batch send after interval
   */ scheduleBatchSend() {
        if (this.timer) return; // Already scheduled
        this.timer = setTimeout(()=>{
            this.flush();
        }, BATCH_INTERVAL);
    }
    /**
   * Send batch to server
   */ async flush() {
        if (this.isSending || this.queue.length === 0) return;
        // Clear timer
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        // Get batch to send
        const batch = [
            ...this.queue
        ];
        this.queue = [];
        this.isSending = true;
        try {
            await this.sendBatch(batch);
        } catch (error) {
            console.error('[ClientLogger] Failed to send log batch:', error);
        // Re-queue failed logs (up to max retries)
        // For simplicity, we're not implementing retry logic here
        } finally{
            this.isSending = false;
        }
    }
    /**
   * Send batch to server API
   */ async sendBatch(batch, retryCount = 0) {
        try {
            const response = await fetch(LOG_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    logs: batch
                })
            });
            if (!response.ok) {
                // Retry on 5xx errors
                if (response.status >= 500 && retryCount < MAX_RETRIES) {
                    await new Promise((resolve)=>setTimeout(resolve, 1000 * (retryCount + 1)));
                    return this.sendBatch(batch, retryCount + 1);
                }
                throw new Error(`Log API returned ${response.status}`);
            }
        } catch (error) {
            // Retry on network errors
            if (retryCount < MAX_RETRIES) {
                await new Promise((resolve)=>setTimeout(resolve, 1000 * (retryCount + 1)));
                return this.sendBatch(batch, retryCount + 1);
            }
            throw error;
        }
    }
    /**
   * Clear queue and timer
   */ clear() {
        this.queue = [];
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}
// ============================================================================
// Singleton Instance
// ============================================================================
/**
 * Global log batch queue
 */ const logQueue = new LogBatchQueue();
// Send logs before page unload
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const logNetworkError = (error)=>{
    if (!isLoggingEnabled()) return;
    // Filter out noisy endpoints
    const noisyEndpoints = [
        '/api/health',
        '/api/logs',
        '/_next/'
    ];
    if (noisyEndpoints.some((endpoint)=>error.url.includes(endpoint))) {
        return;
    }
    // Filter out successful requests
    if (error.statusCode && error.statusCode >= 200 && error.statusCode < 400) {
        return;
    }
    logQueue.add(error);
};
const flushLogs = async ()=>{
    await logQueue.flush();
};
const clearLogs = ()=>{
    logQueue.clear();
};
const __TURBOPACK__default__export__ = {
    logNetworkError,
    flushLogs,
    clearLogs
};
}),
"[project]/src/lib/global-fetch-interceptor.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Global Fetch Interceptor
 *
 * Monkey patches the native fetch API to automatically log all network errors.
 * This must be initialized once at app startup.
 *
 * @module lib/global-fetch-interceptor
 * @clientOnly
 */ __turbopack_context__.s([
    "getOriginalFetch",
    ()=>getOriginalFetch,
    "installFetchInterceptor",
    ()=>installFetchInterceptor,
    "isFetchInterceptorInstalled",
    ()=>isFetchInterceptorInstalled,
    "uninstallFetchInterceptor",
    ()=>uninstallFetchInterceptor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/client-logger.ts [app-ssr] (ecmascript)");
'use client';
;
// Store original fetch
let originalFetch = null;
let isInterceptorInstalled = false;
/**
 * Convert Headers object to plain object
 */ const headersToObject = (headers)=>{
    const obj = {};
    headers.forEach((value, key)=>{
        obj[key] = value;
    });
    return obj;
};
/**
 * Determine if response should be logged
 */ const shouldLogResponse = (response)=>{
    // Log 4xx and 5xx errors
    return response.status >= 400;
};
/**
 * Format error message based on response
 */ const formatErrorMessage = (response)=>{
    const { status } = response;
    if (status >= 500) {
        return `Server Error: ${response.statusText}`;
    }
    if (status === 401) {
        return 'Unauthorized: Authentication required';
    }
    if (status === 403) {
        return 'Forbidden: Access denied';
    }
    if (status === 404) {
        return 'Not Found: Resource does not exist';
    }
    if (status === 429) {
        return 'Too Many Requests: Rate limit exceeded';
    }
    if (status >= 400) {
        return `Client Error: ${response.statusText}`;
    }
    return response.statusText || 'Unknown error';
};
/**
 * Check if URL should be logged (filter out noisy endpoints)
 */ const shouldLogUrl = (url)=>{
    const noisyEndpoints = [
        '/api/health',
        '/api/logs',
        '/_next/',
        '/api/ping'
    ];
    return !noisyEndpoints.some((endpoint)=>url.includes(endpoint));
};
/**
 * Parse request body to readable format
 */ async function parseRequestBody(body) {
    if (!body) return undefined;
    try {
        if (typeof body === 'string') {
            // Try to parse as JSON if it looks like JSON
            if (body.trim().startsWith('{') || body.trim().startsWith('[')) {
                return JSON.parse(body);
            }
            return body;
        }
        if (body instanceof FormData) {
            const formObject = {};
            body.forEach((value, key)=>{
                formObject[key] = value instanceof File ? `[File: ${value.name}]` : value;
            });
            return formObject;
        }
        if (body instanceof URLSearchParams) {
            const params = {};
            body.forEach((value, key)=>{
                params[key] = value;
            });
            return params;
        }
        if (body instanceof Blob) {
            return `[Blob: ${body.size} bytes, ${body.type || 'unknown type'}]`;
        }
        if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
            return `[Binary data: ${body.byteLength || body.buffer.byteLength} bytes]`;
        }
        return '[Unknown body type]';
    } catch  {
        return '[Unable to parse request body]';
    }
}
/**
 * Convert relative URL to absolute URL
 */ function getAbsoluteUrl(url) {
    try {
        // If already absolute, return as is
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        // Convert relative to absolute using window.location
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return url;
    } catch  {
        return url;
    }
}
/**
 * Enhanced fetch with automatic error logging
 */ async function interceptedFetch(input, init) {
    if (!originalFetch) {
        throw new Error('Global fetch interceptor not initialized');
    }
    const startTime = performance.now();
    const relativeUrl = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const absoluteUrl = getAbsoluteUrl(relativeUrl);
    const method = init?.method?.toUpperCase() || 'GET';
    // Check if we should log this URL
    if (!shouldLogUrl(relativeUrl)) {
        return originalFetch(input, init);
    }
    try {
        // Call original fetch
        const response = await originalFetch(input, init);
        const duration = performance.now() - startTime;
        // Log error responses
        if (shouldLogResponse(response)) {
            // Clone response to read body without consuming original
            const clonedResponse = response.clone();
            let responseBody;
            try {
                const contentType = clonedResponse.headers.get('content-type');
                if (contentType?.includes('application/json')) {
                    responseBody = await clonedResponse.json();
                } else {
                    responseBody = await clonedResponse.text();
                }
            } catch  {
                responseBody = '[Unable to read response body]';
            }
            // Parse request body
            const parsedRequestBody = await parseRequestBody(init?.body);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logNetworkError"])({
                url: absoluteUrl,
                method,
                statusCode: response.status,
                message: `[${response.status}] ${formatErrorMessage(response)}`,
                timestamp: new Date().toISOString(),
                requestHeaders: init?.headers ? headersToObject(new Headers(init.headers)) : undefined,
                responseHeaders: headersToObject(response.headers),
                requestBody: parsedRequestBody,
                responseBody,
                duration
            });
        }
        return response;
    } catch (error) {
        const duration = performance.now() - startTime;
        // Log network errors (timeout, connection failed, etc.)
        const isTimeout = error instanceof Error && error.message.includes('timeout');
        const statusCode = isTimeout ? 408 : 0;
        // Parse request body
        const parsedRequestBody = await parseRequestBody(init?.body);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$client$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logNetworkError"])({
            url: absoluteUrl,
            method,
            statusCode,
            message: `[${statusCode}] ${error instanceof Error ? error.message : 'Network request failed'}`,
            timestamp: new Date().toISOString(),
            requestHeaders: init?.headers ? headersToObject(new Headers(init.headers)) : undefined,
            requestBody: parsedRequestBody,
            duration
        });
        // Re-throw error to maintain fetch API behavior
        throw error;
    }
}
function installFetchInterceptor() {
    // Only install in browser environment
    if ("TURBOPACK compile-time truthy", 1) {
        console.warn('[FetchInterceptor] Cannot install in SSR environment');
        return;
    }
    //TURBOPACK unreachable
    ;
}
function uninstallFetchInterceptor() {
    if ("TURBOPACK compile-time truthy", 1) {
        return;
    }
    //TURBOPACK unreachable
    ;
}
function isFetchInterceptorInstalled() {
    return isInterceptorInstalled;
}
function getOriginalFetch() {
    return originalFetch;
}
}),
"[project]/src/components/providers/fetch-interceptor-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Fetch Interceptor Provider
 *
 * Client component that installs the global fetch interceptor on mount.
 * Should be included in the root layout.
 *
 * @module components/providers/fetch-interceptor-provider
 */ __turbopack_context__.s([
    "FetchInterceptorProvider",
    ()=>FetchInterceptorProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$global$2d$fetch$2d$interceptor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/global-fetch-interceptor.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function FetchInterceptorProvider({ children }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Install fetch interceptor on mount
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$global$2d$fetch$2d$interceptor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["installFetchInterceptor"])();
    // Cleanup is optional - usually we want to keep it installed
    // return () => {
    //   uninstallFetchInterceptor();
    // };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
"[project]/src/features/booking/api/booking-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * 예약 API 레이어 (BFF: Backend-For-Frontend)
 *
 * 서버 응답을 프론트엔드 친화적 형식으로 변환하고
 * 여러 API 호출을 병합하여 UI가 단순히 표시만 하도록 함
 */ __turbopack_context__.s([
    "bookingApi",
    ()=>bookingApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$ko$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/locale/ko.js [app-ssr] (ecmascript)");
;
;
/**
 * 통화 포맷 헬퍼
 */ function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
    }).format(amount);
}
const bookingApi = {
    /**
   * 예약 초기화 (멱등성 보장)
   *
   * @param request 예약 초기화 요청 데이터
   * @returns 예약 ID 및 상태
   */ async initializeBooking (request) {
        const response = await fetch('/api/bookings/initialize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '예약 초기화에 실패했습니다');
        }
        return response.json();
    },
    /**
   * 결제 초기화
   *
   * @param request 결제 초기화 요청 데이터
   * @returns 결제 ID 및 PortOne 결제 키
   */ async initializePayment (request) {
        const response = await fetch('/api/payments/initialize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '결제 초기화에 실패했습니다');
        }
        return response.json();
    },
    /**
   * 예약 상세 조회 (프론트엔드 친화적 형식)
   *
   * @param bookingId 예약 ID
   * @returns 예약 상세 정보 (이미 포맷됨)
   */ async getBooking (bookingId) {
        const response = await fetch(`/api/bookings/${bookingId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '예약 조회에 실패했습니다');
        }
        const data = await response.json();
        // 서버 응답을 프론트엔드 친화적 형식으로 변환
        return {
            ...data,
            scheduledAt: new Date(data.scheduledAt),
            formattedDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(data.scheduledAt), 'yyyy년 M월 d일 (EEEE)', {
                locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$ko$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ko"]
            }),
            formattedTime: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(data.scheduledAt), 'HH:mm', {
                locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$ko$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ko"]
            }),
            formattedTotalAmount: formatCurrency(data.totalAmount),
            services: data.services.map((service)=>({
                    ...service,
                    formattedPrice: formatCurrency(service.price)
                })),
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
            payment: data.payment ? {
                ...data.payment,
                paidAt: data.payment.paidAt ? new Date(data.payment.paidAt) : undefined
            } : undefined
        };
    },
    /**
   * 예약 목록 조회 (프론트엔드 친화적 형식)
   *
   * @param filters 필터 조건
   * @returns 예약 목록 (이미 포맷됨)
   */ async getBookings (filters) {
        const queryParams = new URLSearchParams();
        if (filters?.userId) queryParams.append('userId', filters.userId);
        if (filters?.status) queryParams.append('status', filters.status);
        if (filters?.startDate) queryParams.append('startDate', filters.startDate);
        if (filters?.endDate) queryParams.append('endDate', filters.endDate);
        if (filters?.page) queryParams.append('page', filters.page.toString());
        if (filters?.pageSize) queryParams.append('pageSize', filters.pageSize.toString());
        const response = await fetch(`/api/bookings?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '예약 목록 조회에 실패했습니다');
        }
        const data = await response.json();
        // 각 예약을 프론트엔드 친화적 형식으로 변환
        return {
            bookings: data.bookings.map((booking)=>({
                    ...booking,
                    scheduledAt: new Date(booking.scheduledAt),
                    formattedDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(booking.scheduledAt), 'yyyy년 M월 d일 (EEEE)', {
                        locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$ko$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ko"]
                    }),
                    formattedTime: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(booking.scheduledAt), 'HH:mm', {
                        locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$ko$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ko"]
                    }),
                    formattedTotalAmount: formatCurrency(booking.totalAmount),
                    services: booking.services.map((service)=>({
                            ...service,
                            formattedPrice: formatCurrency(service.price)
                        })),
                    createdAt: new Date(booking.createdAt),
                    updatedAt: new Date(booking.updatedAt)
                })),
            pagination: data.pagination
        };
    },
    /**
   * 예약 취소
   *
   * @param bookingId 예약 ID
   * @param reason 취소 사유
   */ async cancelBooking (bookingId, reason) {
        const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reason
            })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '예약 취소에 실패했습니다');
        }
    },
    /**
   * 예약 상태 업데이트
   *
   * @param bookingId 예약 ID
   * @param status 새로운 상태
   */ async updateBookingStatus (bookingId, status) {
        const response = await fetch(`/api/bookings/${bookingId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status
            })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '예약 상태 업데이트에 실패했습니다');
        }
    }
};
}),
"[project]/src/features/booking/types/booking-form.types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * 예약 폼 타입 정의
 */ __turbopack_context__.s([
    "initialBookingForm",
    ()=>initialBookingForm
]);
const initialBookingForm = {
    petServices: [],
    addressId: '',
    groomerId: '',
    date: '',
    timeSlot: '',
    specialRequests: ''
};
}),
"[project]/src/features/booking/state/booking-slice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * 예약 Redux Slice
 *
 * 예약 도메인의 클라이언트 상태 관리
 * Redux Toolkit의 createSlice와 createAsyncThunk 사용
 */ __turbopack_context__.s([
    "cancelBooking",
    ()=>cancelBooking,
    "default",
    ()=>__TURBOPACK__default__export__,
    "goToStep",
    ()=>goToStep,
    "initializeBooking",
    ()=>initializeBooking,
    "initializePayment",
    ()=>initializePayment,
    "nextStep",
    ()=>nextStep,
    "prevStep",
    ()=>prevStep,
    "resetForm",
    ()=>resetForm,
    "selectBooking",
    ()=>selectBooking,
    "setPaymentId",
    ()=>setPaymentId,
    "togglePet",
    ()=>togglePet,
    "updateAddress",
    ()=>updateAddress,
    "updateDate",
    ()=>updateDate,
    "updateGroomer",
    ()=>updateGroomer,
    "updateGroomerPage",
    ()=>updateGroomerPage,
    "updateOptions",
    ()=>updateOptions,
    "updateServices",
    ()=>updateServices,
    "updateSpecialRequests",
    ()=>updateSpecialRequests,
    "updateTimeSlot",
    ()=>updateTimeSlot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$booking$2f$api$2f$booking$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/booking/api/booking-api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$booking$2f$types$2f$booking$2d$form$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/booking/types/booking-form.types.ts [app-ssr] (ecmascript)");
;
;
;
/**
 * 초기 상태
 */ const initialState = {
    selectedBookingId: null,
    filters: {
        status: 'all'
    },
    isLoading: false,
    error: null,
    isCreating: false,
    isInitializingPayment: false,
    formData: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$booking$2f$types$2f$booking$2d$form$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialBookingForm"],
    currentStep: 1,
    paymentId: null,
    currentGroomerPage: 1
};
const initializeBooking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('booking/initialize', async (request, { rejectWithValue })=>{
    try {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$booking$2f$api$2f$booking$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bookingApi"].initializeBooking(request);
    } catch (error) {
        return rejectWithValue(error.message || '예약 초기화에 실패했습니다');
    }
});
const initializePayment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('booking/initializePayment', async ({ bookingId, amount, orderName }, { rejectWithValue })=>{
    try {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$booking$2f$api$2f$booking$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bookingApi"].initializePayment({
            bookingId,
            amount,
            orderName
        });
    } catch (error) {
        return rejectWithValue(error.message || '결제 초기화에 실패했습니다');
    }
});
const cancelBooking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])('booking/cancel', async ({ bookingId, reason }, { rejectWithValue })=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$booking$2f$api$2f$booking$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bookingApi"].cancelBooking(bookingId, reason);
        return bookingId;
    } catch (error) {
        return rejectWithValue(error.message || '예약 취소에 실패했습니다');
    }
});
/**
 * 예약 슬라이스
 */ const bookingSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'booking',
    initialState,
    reducers: {
        /**
     * 예약 선택
     */ selectBooking: (state, action)=>{
            state.selectedBookingId = action.payload;
        },
        /**
     * 예약 선택 해제
     */ clearSelectedBooking: (state)=>{
            state.selectedBookingId = null;
        },
        /**
     * 필터 업데이트
     */ updateFilters: (state, action)=>{
            state.filters = {
                ...state.filters,
                ...action.payload
            };
        },
        /**
     * 필터 초기화
     */ resetFilters: (state)=>{
            state.filters = {
                status: 'all'
            };
        },
        /**
     * 에러 초기화
     */ clearError: (state)=>{
            state.error = null;
        },
        // ===== 폼 관련 액션 =====
        /**
     * 반려동물 선택/해제 토글
     */ togglePet: (state, action)=>{
            const pet = action.payload;
            const existingIndex = state.formData.petServices.findIndex((ps)=>ps.petId === pet.id);
            if (existingIndex >= 0) {
                // 선택 해제
                state.formData.petServices.splice(existingIndex, 1);
            } else {
                // 선택 (빈 서비스와 옵션 배열로 초기화)
                state.formData.petServices.push({
                    petId: pet.id,
                    services: [],
                    options: []
                });
            }
        },
        /**
     * 반려동물의 서비스 변경
     */ updateServices: (state, action)=>{
            const { petId, services } = action.payload;
            const petService = state.formData.petServices.find((ps)=>ps.petId === petId);
            if (petService) {
                petService.services = services;
            }
        },
        /**
     * 반려동물의 옵션 변경
     */ updateOptions: (state, action)=>{
            const { petId, options } = action.payload;
            const petService = state.formData.petServices.find((ps)=>ps.petId === petId);
            if (petService) {
                petService.options = options;
            }
        },
        /**
     * 주소 선택
     */ updateAddress: (state, action)=>{
            state.formData.addressId = action.payload;
        },
        /**
     * 날짜 선택 (시간과 미용사 초기화)
     */ updateDate: (state, action)=>{
            state.formData.date = action.payload;
            state.formData.timeSlot = '';
            state.formData.groomerId = '';
        },
        /**
     * 미용사 선택 (시간 초기화)
     */ updateGroomer: (state, action)=>{
            state.formData.groomerId = action.payload;
            state.formData.timeSlot = '';
        },
        /**
     * 시간대 선택
     */ updateTimeSlot: (state, action)=>{
            state.formData.timeSlot = action.payload;
        },
        /**
     * 특별 요청사항 변경
     */ updateSpecialRequests: (state, action)=>{
            state.formData.specialRequests = action.payload;
        },
        /**
     * 폼 초기화
     */ resetForm: (state)=>{
            state.formData = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$booking$2f$types$2f$booking$2d$form$2e$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialBookingForm"];
            state.currentStep = 1;
            state.paymentId = null;
            state.currentGroomerPage = 1;
        },
        // ===== 단계 관련 액션 =====
        /**
     * 다음 단계로 이동
     */ nextStep: (state)=>{
            if (state.currentStep < 4) {
                state.currentStep = state.currentStep + 1;
            }
        },
        /**
     * 이전 단계로 이동
     */ prevStep: (state)=>{
            if (state.currentStep > 1) {
                state.currentStep = state.currentStep - 1;
            }
        },
        /**
     * 특정 단계로 이동
     */ goToStep: (state, action)=>{
            state.currentStep = action.payload;
        },
        // ===== 기타 액션 =====
        /**
     * 미용사 페이지 업데이트
     */ updateGroomerPage: (state, action)=>{
            state.currentGroomerPage = action.payload;
        },
        /**
     * 결제 ID 설정
     */ setPaymentId: (state, action)=>{
            state.paymentId = action.payload;
        }
    },
    extraReducers: (builder)=>{
        // 예약 초기화 처리
        builder.addCase(initializeBooking.pending, (state)=>{
            state.isCreating = true;
            state.error = null;
        }).addCase(initializeBooking.fulfilled, (state, action)=>{
            state.isCreating = false;
            state.selectedBookingId = action.payload.bookingId;
        }).addCase(initializeBooking.rejected, (state, action)=>{
            state.isCreating = false;
            state.error = action.payload;
        });
        // 결제 초기화 처리
        builder.addCase(initializePayment.pending, (state)=>{
            state.isInitializingPayment = true;
            state.error = null;
        }).addCase(initializePayment.fulfilled, (state, action)=>{
            state.isInitializingPayment = false;
            state.paymentId = action.payload.paymentId;
        }).addCase(initializePayment.rejected, (state, action)=>{
            state.isInitializingPayment = false;
            state.error = action.payload;
        });
        // 예약 취소 처리
        builder.addCase(cancelBooking.pending, (state)=>{
            state.isLoading = true;
            state.error = null;
        }).addCase(cancelBooking.fulfilled, (state)=>{
            state.isLoading = false;
            // 취소된 예약이 현재 선택된 예약이면 선택 해제
            state.selectedBookingId = null;
        }).addCase(cancelBooking.rejected, (state, action)=>{
            state.isLoading = false;
            state.error = action.payload;
        });
    }
});
const { selectBooking, togglePet, updateServices, updateOptions, updateAddress, updateDate, updateGroomer, updateTimeSlot, updateSpecialRequests, resetForm, nextStep, prevStep, goToStep, updateGroomerPage, setPaymentId } = bookingSlice.actions;
const __TURBOPACK__default__export__ = bookingSlice.reducer /**
 * 셀렉터
 * Note: Selectors have been removed as they were unused. If needed in the future,
 * consider using createSelector from @reduxjs/toolkit for memoization.
 */ ;
}),
"[project]/src/features/booking/api/booking-query-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * RTK Query API for Booking Data
 *
 * Replaces TanStack Query with RTK Query for booking-related data fetching
 * Imports types from API route files (single source of truth)
 */ __turbopack_context__.s([
    "bookingQueryApi",
    ()=>bookingQueryApi,
    "useGetAddressesQuery",
    ()=>useGetAddressesQuery,
    "useGetAvailabilityQuery",
    ()=>useGetAvailabilityQuery,
    "useGetPetsQuery",
    ()=>useGetPetsQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-ssr] (ecmascript)");
;
const bookingQueryApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: 'bookingQueryApi',
    baseQuery: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
        baseUrl: '/api'
    }),
    tagTypes: [
        'Pets',
        'Addresses',
        'Availability'
    ],
    endpoints: (builder)=>({
            /**
     * Get customer pets
     *
     * Note: Dates are kept as ISO strings for Redux serializability.
     * Components should parse them to Date objects when needed.
     */ getPets: builder.query({
                query: ()=>'/customer/pets',
                providesTags: [
                    'Pets'
                ]
            }),
            /**
     * Get customer addresses
     */ getAddresses: builder.query({
                query: ()=>'/customer/addresses',
                providesTags: [
                    'Addresses'
                ]
            }),
            /**
     * Get availability (groomers and time slots)
     */ getAvailability: builder.query({
                query: ({ date, addressId, page = 1, limit = 6 })=>{
                    const params = new URLSearchParams();
                    if (date) params.append('date', date);
                    if (addressId) params.append('addressId', addressId);
                    params.append('page', page.toString());
                    params.append('limit', limit.toString());
                    return `/bookings/availability?${params.toString()}`;
                },
                providesTags: [
                    'Availability'
                ],
                keepUnusedDataFor: 300
            })
        })
});
const { useGetPetsQuery, useGetAddressesQuery, useGetAvailabilityQuery } = bookingQueryApi;
}),
"[project]/src/features/admin/api/dashboard-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Admin Dashboard API Adapter Layer
 *
 * This module implements the BFF (Backend for Frontend) pattern, transforming
 * raw API responses into client-optimized data structures for the admin dashboard.
 *
 * Key responsibilities:
 * - Fetch data from API routes
 * - Transform API responses to UI-friendly formats
 * - Perform calculations and aggregations
 * - Apply formatting for display
 * - Handle errors gracefully
 *
 * Architecture: API Route → API Adapter (this layer) → React Hook → UI Components
 *
 * @module features/admin/api/dashboard-api
 */ __turbopack_context__.s([
    "calculateActiveGroomers",
    ()=>calculateActiveGroomers,
    "calculateMonthlyGrowth",
    ()=>calculateMonthlyGrowth,
    "calculateRevenueGrowth",
    ()=>calculateRevenueGrowth,
    "filterTodayBookings",
    ()=>filterTodayBookings,
    "getDashboardOverview",
    ()=>getDashboardOverview,
    "getPeriodLabel",
    ()=>getPeriodLabel,
    "transformMonthlyRevenue",
    ()=>transformMonthlyRevenue,
    "transformToActivityItems",
    ()=>transformToActivityItems,
    "transformTopServices",
    ()=>transformTopServices,
    "transformUserGrowth",
    ()=>transformUserGrowth
]);
async function getDashboardOverview(timeRange = 'month') {
    try {
        // 1. Fetch from API route
        const response = await fetch(`/api/admin/dashboard/overview?range=${timeRange}`);
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        const apiData = await response.json();
        // 2. Calculate derived metrics
        const bookingGrowth = calculateMonthlyGrowth(apiData.metrics, apiData.previousMetrics);
        const revenueGrowth = calculateRevenueGrowth(apiData.metrics, apiData.previousMetrics);
        const activeGroomers = calculateActiveGroomers(apiData);
        const completedBookingsToday = filterTodayBookings(apiData);
        // 3. Transform data structures
        const recentActivity = transformToActivityItems(apiData.recentBookings);
        const topServices = transformTopServices(apiData.topServices);
        const monthlyRevenue = transformMonthlyRevenue(apiData.monthlyRevenue);
        const userGrowth = transformUserGrowth(apiData.userGrowth);
        // 4. Construct UI-optimized response
        const overviewStats = {
            // Core metrics from API
            totalBookings: apiData.metrics.totalBookings,
            totalRevenue: apiData.metrics.totalRevenue,
            totalCustomers: apiData.metrics.totalCustomers,
            activeServices: topServices.length,
            totalUsers: apiData.metrics.totalCustomers,
            activeGroomers: activeGroomers,
            completedBookingsToday: completedBookingsToday,
            pendingBookings: apiData.metrics.pendingBookings,
            averageRating: apiData.metrics.averageRating,
            // Calculated metrics (now using real historical data)
            bookingGrowth: bookingGrowth,
            revenueGrowth: revenueGrowth,
            monthlyGrowth: bookingGrowth,
            averageBookingValue: apiData.metrics.avgBookingValue,
            // Period information (keep as ISO strings for Redux serialization)
            periodLabel: getPeriodLabel(timeRange),
            period: {
                startDate: apiData.startDate,
                endDate: apiData.endDate,
                label: getPeriodLabel(timeRange)
            },
            // Transformed data for UI components
            recentActivity: recentActivity,
            topServices: topServices,
            monthlyRevenue: monthlyRevenue,
            userGrowth: userGrowth,
            // State flags
            isLoading: false,
            error: null
        };
        return overviewStats;
    } catch (error) {
        console.error('Failed to fetch dashboard overview:', error);
        throw error;
    }
}
function calculateMonthlyGrowth(currentMetrics, previousMetrics) {
    if (previousMetrics.totalBookings === 0) return 0;
    const growth = (currentMetrics.totalBookings - previousMetrics.totalBookings) / previousMetrics.totalBookings * 100;
    return Math.round(growth * 10) / 10 // Round to 1 decimal place
    ;
}
function calculateRevenueGrowth(currentMetrics, previousMetrics) {
    if (previousMetrics.totalRevenue === 0) return 0;
    const growth = (currentMetrics.totalRevenue - previousMetrics.totalRevenue) / previousMetrics.totalRevenue * 100;
    return Math.round(growth * 10) / 10 // Round to 1 decimal place
    ;
}
function calculateActiveGroomers(data) {
    // Count unique groomers from recent bookings
    const uniqueGroomers = new Set(data.recentBookings.map((booking)=>booking.groomerName).filter((name)=>name !== '미배정'));
    return uniqueGroomers.size;
}
function filterTodayBookings(data) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const completedToday = data.recentBookings.filter((booking)=>{
        if (booking.status !== 'SERVICE_COMPLETED') return false;
        const serviceDate = new Date(booking.serviceDate);
        return serviceDate >= today && serviceDate < tomorrow;
    });
    return completedToday.length;
}
function getPeriodLabel(timeRange) {
    switch(timeRange){
        case 'week':
            return '최근 1주';
        case 'month':
            return '이번 달';
        case 'year':
            return '올해';
        default:
            return '이번 달';
    }
}
function transformToActivityItems(bookings) {
    const activities = bookings.map((booking)=>{
        // Map booking status to activity status
        const activityStatus = mapBookingStatusToActivityStatus(booking.status);
        return {
            type: 'booking',
            id: booking.id,
            customerName: booking.customerName || '알 수 없음',
            serviceName: `예약 #${booking.bookingNumber}`,
            status: booking.status,
            timestamp: booking.createdAt,
            amount: booking.totalPrice
        };
    });
    // Sort by timestamp (newest first) and limit to 20 items
    // ISO strings can be compared directly for chronological sorting
    return activities.sort((a, b)=>b.timestamp.localeCompare(a.timestamp)).slice(0, 20);
}
/**
 * Map booking status to activity status.
 *
 * @param bookingStatus - Booking status from API
 * @returns Activity status (completed/pending/failed)
 */ function mapBookingStatusToActivityStatus(bookingStatus) {
    if (bookingStatus === 'SERVICE_COMPLETED') return 'completed';
    if (bookingStatus === 'SERVICE_CANCELLED') return 'failed';
    return 'pending';
}
function transformTopServices(apiTopServices) {
    return apiTopServices.map((service, index)=>({
            serviceId: service.serviceId,
            name: service.name,
            bookings: service.bookingCount,
            revenue: service.totalRevenue,
            rating: 4.5,
            satisfactionRate: 95,
            rank: index + 1,
            growth: 0
        }));
}
function transformMonthlyRevenue(apiMonthlyRevenue) {
    return apiMonthlyRevenue.map((data, index)=>{
        // Get previous month data for comparison
        const prevData = index > 0 ? apiMonthlyRevenue[index - 1] : {
            revenue: 0
        };
        // Calculate percentage change
        const percentageChange = prevData.revenue > 0 ? (data.revenue - prevData.revenue) / prevData.revenue * 100 : 0;
        return {
            month: data.month,
            value: data.revenue,
            previousValue: prevData.revenue,
            percentageChange: Math.round(percentageChange * 10) / 10
        };
    });
}
function transformUserGrowth(apiUserGrowth) {
    return apiUserGrowth.map((data)=>({
            month: data.period,
            newUsers: data.newUsers,
            total: data.cumulativeUsers
        }));
}
}),
"[project]/src/features/admin/state/dashboard-api-slice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * RTK Query API for Admin Dashboard Data
 *
 * Replaces TanStack Query with RTK Query for admin dashboard data fetching.
 * Imports types from API route files (single source of truth).
 *
 * @module features/admin/api/dashboard-api-slice
 */ __turbopack_context__.s([
    "dashboardApi",
    ()=>dashboardApi,
    "useGetDashboardOverviewQuery",
    ()=>useGetDashboardOverviewQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$api$2f$dashboard$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/admin/api/dashboard-api.ts [app-ssr] (ecmascript)");
;
;
const dashboardApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: 'dashboardApi',
    baseQuery: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
        baseUrl: '/api'
    }),
    tagTypes: [
        'DashboardOverview'
    ],
    endpoints: (builder)=>({
            /**
     * Get dashboard overview statistics
     *
     * Fetches comprehensive dashboard metrics and transforms them
     * from the API response format to the client-optimized format.
     *
     * Type flow:
     * - Request: TimeRange ('week' | 'month' | 'year')
     * - API Response: DashboardOverviewResponse (from route.ts)
     * - Transformed Result: OverviewStats (client format)
     *
     * Caching strategy:
     * - keepUnusedDataFor: 600 seconds (10 minutes) - same as TanStack Query gcTime
     * - Cached data persists for 10 minutes after last use
     * - Provides fast navigation within admin section
     *
     * @param timeRange - Time range filter ('week' | 'month' | 'year')
     * @returns OverviewStats with all dashboard metrics
     */ getDashboardOverview: builder.query({
                query: (timeRange)=>`/admin/dashboard/overview?range=${timeRange}`,
                /**
       * Transform API response to client format
       *
       * Converts DashboardOverviewResponse from the API route
       * to OverviewStats that the UI components expect.
       *
       * Reuses all transformation logic from dashboard-api.ts:
       * - calculateMonthlyGrowth, calculateActiveGroomers
       * - transformToActivityItems, aggregateTopServices
       * - generateMonthlyRevenue, generateUserGrowth
       */ transformResponse: (response)=>{
                    const { metrics, previousMetrics, recentBookings, topServices: apiTopServices, userGrowth: apiUserGrowth, monthlyRevenue: apiMonthlyRevenue, range, startDate, endDate } = response;
                    // Convert DashboardOverviewResponse to ApiDashboardOverviewResponse
                    // (Date → string conversion happens automatically via JSON serialization)
                    const apiData = {
                        metrics,
                        previousMetrics,
                        recentBookings: recentBookings.map((booking)=>({
                                ...booking,
                                // Dates are already strings after JSON deserialization
                                serviceDate: booking.serviceDate,
                                createdAt: booking.createdAt
                            })),
                        topServices: apiTopServices,
                        userGrowth: apiUserGrowth,
                        monthlyRevenue: apiMonthlyRevenue,
                        range,
                        startDate: startDate,
                        endDate: endDate,
                        previousStartDate: response.previousStartDate,
                        previousEndDate: response.previousEndDate
                    };
                    // Calculate derived metrics using helper functions (now with real historical data)
                    const bookingGrowth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$api$2f$dashboard$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateMonthlyGrowth"])(apiData.metrics, apiData.previousMetrics);
                    const revenueGrowth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$api$2f$dashboard$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateRevenueGrowth"])(apiData.metrics, apiData.previousMetrics);
                    const activeGroomers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$api$2f$dashboard$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateActiveGroomers"])(apiData);
                    const completedBookingsToday = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$api$2f$dashboard$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filterTodayBookings"])(apiData);
                    // Transform data structures using helper functions
                    const recentActivity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$api$2f$dashboard$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformToActivityItems"])(apiData.recentBookings);
                    const topServices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$api$2f$dashboard$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformTopServices"])(apiData.topServices);
                    const monthlyRevenue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$api$2f$dashboard$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformMonthlyRevenue"])(apiData.monthlyRevenue);
                    const userGrowth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$api$2f$dashboard$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformUserGrowth"])(apiData.userGrowth);
                    // Construct client-optimized response
                    const overviewStats = {
                        // Core metrics from API
                        totalBookings: metrics.totalBookings,
                        totalRevenue: metrics.totalRevenue,
                        totalCustomers: metrics.totalCustomers,
                        activeServices: topServices.length,
                        totalUsers: metrics.totalCustomers,
                        activeGroomers,
                        completedBookingsToday,
                        pendingBookings: metrics.pendingBookings,
                        averageRating: metrics.averageRating,
                        // Calculated metrics (now using real historical data)
                        bookingGrowth,
                        revenueGrowth,
                        monthlyGrowth: bookingGrowth,
                        averageBookingValue: metrics.avgBookingValue,
                        // Period information (keep as ISO strings for Redux serialization)
                        periodLabel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$api$2f$dashboard$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPeriodLabel"])(range),
                        period: {
                            startDate: startDate,
                            endDate: endDate,
                            label: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$api$2f$dashboard$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPeriodLabel"])(range)
                        },
                        // Transformed data for UI components
                        recentActivity,
                        topServices,
                        monthlyRevenue,
                        userGrowth,
                        // State flags
                        isLoading: false,
                        error: null
                    };
                    return overviewStats;
                },
                providesTags: [
                    'DashboardOverview'
                ],
                /**
       * Cache configuration
       *
       * Maps TanStack Query settings to RTK Query equivalents:
       * - keepUnusedDataFor: 600 seconds (10 minutes) - equivalent to TanStack Query gcTime
       *   Cached data persists for 10 minutes after last use
       *
       * Note: In RTK Query, refetch on focus and reconnect are handled by setupListeners
       * configuration in the store setup, not at the endpoint level.
       * See: configureStore setup with setupListeners for full TanStack Query compatibility.
       *
       * This ensures consistent cache behavior with the original TanStack Query implementation.
       */ keepUnusedDataFor: 600
            })
        })
});
const { useGetDashboardOverviewQuery } = dashboardApi;
}),
"[project]/src/features/admin/state/breeds-api-slice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * RTK Query API for Admin Breeds Management
 *
 * Replaces TanStack Query with RTK Query for admin breeds data fetching.
 * Provides type-safe CRUD operations for breed management with automatic
 * cache invalidation and Redux DevTools integration.
 *
 * @module features/admin/state/breeds-api-slice
 */ __turbopack_context__.s([
    "breedsApiSlice",
    ()=>breedsApiSlice,
    "useCreateBreedsMutation",
    ()=>useCreateBreedsMutation,
    "useDeleteBreedMutation",
    ()=>useDeleteBreedMutation,
    "useGetBreedsQuery",
    ()=>useGetBreedsQuery,
    "useUpdateBreedMutation",
    ()=>useUpdateBreedMutation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-ssr] (ecmascript)");
;
const breedsApiSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: 'breedsApi',
    baseQuery: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
        baseUrl: '/api/admin'
    }),
    tagTypes: [
        'Breeds'
    ],
    endpoints: (builder)=>({
            /**
     * Get all breeds with pet counts
     *
     * Fetches the complete list of breeds ordered by:
     * petType → category → displayOrder → name
     *
     * Each breed includes a count of associated pets for validation
     * (e.g., preventing deletion of breeds with pets).
     *
     * Type flow:
     * - Request: void (no parameters)
     * - API Response: BreedsResponse (array of BreedWithCount)
     *
     * Caching strategy:
     * - Provides ['Breeds'] tag for automatic invalidation
     * - Cache persists until invalidated by mutations
     *
     * @returns Array of breeds with pet counts
     *
     * @example
     * ```tsx
     * function BreedsList() {
     *   const { data: breeds = [], isLoading, error } = useGetBreedsQuery()
     *
     *   if (isLoading) return <LoadingSpinner />
     *   if (error) return <ErrorMessage error={error} />
     *
     *   return (
     *     <div>
     *       {breeds.map(breed => (
     *         <BreedCard key={breed.id} breed={breed} />
     *       ))}
     *     </div>
     *   )
     * }
     * ```
     *
     * @see GET /api/admin/breeds - Server endpoint
     * @see BreedsResponse - Return type documentation
     */ getBreeds: builder.query({
                query: ()=>'/breeds',
                providesTags: [
                    'Breeds'
                ]
            }),
            /**
     * Create or update multiple breeds in bulk
     *
     * Accepts comma-separated breed names and performs bulk operation:
     * - Creates new breeds that don't exist
     * - Updates existing breeds (e.g., reorder via displayOrder)
     * - Returns summary of created vs updated counts
     *
     * Type flow:
     * - Request: CreateBreedsInput (petType, category, breedNames)
     * - API Response: CreateBreedsResponse (created, updated, total counts)
     *
     * Cache invalidation:
     * - Invalidates ['Breeds'] tag to trigger refetch of breeds list
     * - UI automatically updates with new/updated breeds
     *
     * @param input - Breed creation input with petType, category, and comma-separated names
     * @returns Creation summary with counts of created/updated breeds
     *
     * @example
     * ```tsx
     * function BreedForm() {
     *   const [createBreeds, { isLoading }] = useCreateBreedsMutation()
     *
     *   const handleSubmit = async () => {
     *     try {
     *       const result = await createBreeds({
     *         petType: 'DOG',
     *         category: 'SMALL',
     *         breedNames: '푸들, 말티즈, 비숑'
     *       }).unwrap()
     *
     *       toast.success(`Created: ${result.created}, Updated: ${result.updated}`)
     *     } catch (error) {
     *       toast.error('Failed to save breeds')
     *     }
     *   }
     *
     *   return <Button onClick={handleSubmit} disabled={isLoading}>Save</Button>
     * }
     * ```
     *
     * @see POST /api/admin/breeds - Server endpoint
     * @see CreateBreedsInput - Input type documentation
     * @see CreateBreedsResponse - Response type documentation
     */ createBreeds: builder.mutation({
                query: (input)=>({
                        url: '/breeds',
                        method: 'POST',
                        body: input
                    }),
                invalidatesTags: [
                    'Breeds'
                ]
            }),
            /**
     * Delete a single breed by ID
     *
     * Removes the specified breed from the database.
     * Server will prevent deletion if the breed is currently in use by any pets.
     *
     * Type flow:
     * - Request: string (breed ID)
     * - API Response: { message: string }
     *
     * Cache invalidation:
     * - Invalidates ['Breeds'] tag to remove deleted breed from UI
     * - Automatically updates breeds list after successful deletion
     *
     * @param id - Unique identifier of the breed to delete
     * @returns Success message from server
     *
     * @example
     * ```tsx
     * function BreedDeleteButton({ breed }) {
     *   const [deleteBreed, { isLoading }] = useDeleteBreedMutation()
     *
     *   const handleDelete = async () => {
     *     if (!confirm(`Delete "${breed.name}"?`)) return
     *
     *     try {
     *       await deleteBreed(breed.id).unwrap()
     *       toast.success('Breed deleted')
     *     } catch (error) {
     *       toast.error('Cannot delete breed - it has associated pets')
     *     }
     *   }
     *
     *   return (
     *     <Button
     *       onClick={handleDelete}
     *       disabled={breed._count.pets > 0 || isLoading}
     *     >
     *       Delete
     *     </Button>
     *   )
     * }
     * ```
     *
     * @see DELETE /api/admin/breeds/[breedId] - Server endpoint
     */ deleteBreed: builder.mutation({
                query: (id)=>({
                        url: `/breeds/${id}`,
                        method: 'DELETE'
                    }),
                invalidatesTags: [
                    'Breeds'
                ]
            }),
            /**
     * Update breed active status
     *
     * Toggles or sets the isActive flag for a breed.
     * Used for quick enable/disable of breeds in the admin list.
     *
     * Type flow:
     * - Request: { id: string, isActive: boolean }
     * - API Response: BreedWithCount (updated breed)
     *
     * Cache invalidation:
     * - Invalidates ['Breeds'] tag to reflect status change in UI
     * - UI updates automatically with new status
     *
     * Note: This is a silent operation (no toast notifications)
     * as it's a frequent, low-risk action. UI updates provide
     * sufficient visual feedback.
     *
     * @param params - Object containing breed ID and new isActive status
     * @returns Updated breed with new status and pet count
     *
     * @example
     * ```tsx
     * function BreedToggle({ breed }) {
     *   const [updateBreed, { isLoading }] = useUpdateBreedMutation()
     *
     *   const handleToggle = async () => {
     *     try {
     *       await updateBreed({
     *         id: breed.id,
     *         isActive: !breed.isActive
     *       }).unwrap()
     *     } catch (error) {
     *       toast.error('Failed to update breed')
     *     }
     *   }
     *
     *   return (
     *     <Button onClick={handleToggle} disabled={isLoading}>
     *       {breed.isActive ? 'Active' : 'Inactive'}
     *     </Button>
     *   )
     * }
     * ```
     *
     * @see PATCH /api/admin/breeds/[breedId] - Server endpoint
     * @see BreedWithCount - Return type documentation
     */ updateBreed: builder.mutation({
                query: ({ id, isActive })=>({
                        url: `/breeds/${id}`,
                        method: 'PATCH',
                        body: {
                            isActive
                        }
                    }),
                invalidatesTags: [
                    'Breeds'
                ]
            })
        })
});
const { useGetBreedsQuery, useCreateBreedsMutation, useDeleteBreedMutation, useUpdateBreedMutation } = breedsApiSlice;
}),
"[project]/src/features/admin-bookings/state/admin-bookings-api-slice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * RTK Query API for Admin Bookings
 *
 * Replaces TanStack Query with RTK Query for admin bookings data fetching.
 * Imports types from API route files (single source of truth).
 *
 * @module features/admin-bookings/state/admin-bookings-api-slice
 */ __turbopack_context__.s([
    "adminBookingsApi",
    ()=>adminBookingsApi,
    "useCancelBookingMutation",
    ()=>useCancelBookingMutation,
    "useCompleteBookingMutation",
    ()=>useCompleteBookingMutation,
    "useConfirmBookingMutation",
    ()=>useConfirmBookingMutation,
    "useDeleteBookingMutation",
    ()=>useDeleteBookingMutation,
    "useGetBookingsQuery",
    ()=>useGetBookingsQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$ko$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/locale/ko.js [app-ssr] (ecmascript)");
;
;
;
const adminBookingsApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: 'adminBookingsApi',
    baseQuery: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
        baseUrl: '/api'
    }),
    tagTypes: [
        'Bookings'
    ],
    endpoints: (builder)=>({
            /**
     * Get paginated bookings list with filters
     *
     * Fetches bookings with support for:
     * - Pagination (page, limit)
     * - Search (by booking number, customer name, phone)
     * - Filtering (by status, date)
     * - Sorting (by date, status, amount)
     *
     * Type flow:
     * - Request: GetBookingsParams (filters + pagination)
     * - API Response: AdminBookingsGetResponse (from route.ts)
     * - Result: AdminBookingsGetResponse (no transformation needed)
     *
     * Caching strategy:
     * - keepUnusedDataFor: 600 seconds (10 minutes) - matches TanStack Query gcTime
     * - Cached data persists for 10 minutes after last use
     * - Tags: ['Bookings', 'BookingStats'] for invalidation
     *
     * @param params - Filter and pagination parameters
     * @returns AdminBookingsGetResponse with bookings and pagination info
     */ getBookings: builder.query({
                query: (params)=>{
                    // Ensure timezone-safe date formatting (avoid toISOString() in UTC+9)
                    const dateParam = params.dateFilter ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(params.dateFilter + 'T00:00:00'), 'yyyy-MM-dd', {
                        locale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$locale$2f$ko$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ko"]
                    }) : '';
                    const queryParams = new URLSearchParams({
                        page: params.page.toString(),
                        limit: params.limit.toString(),
                        search: params.searchQuery,
                        status: params.statusFilter,
                        date: dateParam,
                        sortBy: params.sortBy,
                        sortOrder: params.sortOrder
                    });
                    return `/admin/bookings?${queryParams}`;
                },
                providesTags: (result)=>result ? [
                        ...result.bookings.map(({ id })=>({
                                type: 'Bookings',
                                id
                            })),
                        {
                            type: 'Bookings',
                            id: 'LIST'
                        }
                    ] : [
                        {
                            type: 'Bookings',
                            id: 'LIST'
                        }
                    ],
                keepUnusedDataFor: 600
            }),
            /**
     * Confirm a booking
     *
     * Changes booking status to CONFIRMED.
     * Invalidates Bookings cache to trigger refetch.
     *
     * @param bookingId - ID of booking to confirm
     * @returns Mutation response with updated booking
     */ confirmBooking: builder.mutation({
                query: (bookingId)=>({
                        url: `/admin/bookings/${bookingId}/confirm`,
                        method: 'PATCH'
                    }),
                invalidatesTags: [
                    {
                        type: 'Bookings',
                        id: 'LIST'
                    }
                ]
            }),
            /**
     * Cancel a booking
     *
     * Changes booking status to CANCELLED.
     * Invalidates Bookings cache to trigger refetch.
     *
     * @param bookingId - ID of booking to cancel
     * @returns Mutation response with updated booking
     */ cancelBooking: builder.mutation({
                query: (bookingId)=>({
                        url: `/admin/bookings/${bookingId}/cancel`,
                        method: 'PATCH'
                    }),
                invalidatesTags: [
                    {
                        type: 'Bookings',
                        id: 'LIST'
                    }
                ]
            }),
            /**
     * Complete a booking
     *
     * Changes booking status to COMPLETED.
     * Invalidates Bookings cache to trigger refetch.
     *
     * @param bookingId - ID of booking to complete
     * @returns Mutation response with updated booking
     */ completeBooking: builder.mutation({
                query: (bookingId)=>({
                        url: `/admin/bookings/${bookingId}/complete`,
                        method: 'PATCH'
                    }),
                invalidatesTags: [
                    {
                        type: 'Bookings',
                        id: 'LIST'
                    }
                ]
            }),
            /**
     * Delete a booking
     *
     * Permanently deletes a booking.
     * Invalidates Bookings cache to trigger refetch.
     *
     * @param bookingId - ID of booking to delete
     * @returns Mutation response
     */ deleteBooking: builder.mutation({
                query: (bookingId)=>({
                        url: `/admin/bookings/${bookingId}`,
                        method: 'DELETE'
                    }),
                invalidatesTags: [
                    {
                        type: 'Bookings',
                        id: 'LIST'
                    }
                ]
            })
        })
});
const { useGetBookingsQuery, useConfirmBookingMutation, useCancelBookingMutation, useCompleteBookingMutation, useDeleteBookingMutation } = adminBookingsApi;
}),
"[project]/src/features/admin-groomers/state/admin-groomers-api-slice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * RTK Query API for Admin Groomers
 *
 * Provides type-safe data fetching for groomer management.
 * Imports types from API route files (single source of truth).
 *
 * @module features/admin-groomers/state/admin-groomers-api-slice
 */ __turbopack_context__.s([
    "adminGroomersApi",
    ()=>adminGroomersApi,
    "useActivateGroomerMutation",
    ()=>useActivateGroomerMutation,
    "useDeactivateGroomerMutation",
    ()=>useDeactivateGroomerMutation,
    "useGetCommissionGradesQuery",
    ()=>useGetCommissionGradesQuery,
    "useGetGroomersQuery",
    ()=>useGetGroomersQuery,
    "useSuspendGroomerMutation",
    ()=>useSuspendGroomerMutation,
    "useUpdateCommissionGradeMutation",
    ()=>useUpdateCommissionGradeMutation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-ssr] (ecmascript)");
;
const adminGroomersApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: 'adminGroomersApi',
    baseQuery: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
        baseUrl: '/api'
    }),
    tagTypes: [
        'Groomers',
        'GroomerStats'
    ],
    endpoints: (builder)=>({
            /**
     * Get paginated groomers list with filters
     *
     * Fetches groomers with support for:
     * - Pagination (page, limit)
     * - Search (by name, email, phone)
     * - Filtering (by status, location)
     * - Sorting (by various fields)
     *
     * Type flow:
     * - Request: GetGroomersParams (filters + pagination)
     * - API Response: AdminGroomersGetResponse (from route.ts)
     * - Result: AdminGroomersGetResponse (no transformation needed)
     *
     * Caching strategy:
     * - keepUnusedDataFor: 600 seconds (10 minutes) - matches TanStack Query gcTime
     * - Cached data persists for 10 minutes after last use
     * - Tags: ['Groomers', 'GroomerStats'] for invalidation
     *
     * @param params - Filter and pagination parameters
     * @returns AdminGroomersGetResponse with groomers and pagination info
     */ getGroomers: builder.query({
                query: (params)=>{
                    const queryParams = new URLSearchParams({
                        page: params.page.toString(),
                        limit: params.limit.toString()
                    });
                    if (params.searchQuery) {
                        queryParams.append('search', params.searchQuery);
                    }
                    if (params.statusFilter && params.statusFilter !== 'ALL') {
                        queryParams.append('status', params.statusFilter);
                    }
                    if (params.locationFilter && params.locationFilter !== 'ALL') {
                        queryParams.append('location', params.locationFilter);
                    }
                    if (params.sortBy) {
                        queryParams.append('sortBy', params.sortBy);
                    }
                    if (params.sortOrder) {
                        queryParams.append('sortOrder', params.sortOrder);
                    }
                    return `/admin/groomers?${queryParams}`;
                },
                providesTags: (result)=>result ? [
                        ...result.groomers.map(({ id })=>({
                                type: 'Groomers',
                                id
                            })),
                        {
                            type: 'Groomers',
                            id: 'LIST'
                        },
                        {
                            type: 'GroomerStats',
                            id: 'STATS'
                        }
                    ] : [
                        {
                            type: 'Groomers',
                            id: 'LIST'
                        }
                    ],
                keepUnusedDataFor: 600
            }),
            /**
     * Activate a groomer
     *
     * Changes groomer status to active.
     * Invalidates Groomers cache to trigger refetch.
     *
     * @param groomerId - ID of groomer to activate
     * @returns Mutation response
     */ activateGroomer: builder.mutation({
                query: (groomerId)=>({
                        url: `/admin/groomers/${groomerId}/activate`,
                        method: 'POST'
                    }),
                invalidatesTags: [
                    {
                        type: 'Groomers',
                        id: 'LIST'
                    },
                    {
                        type: 'GroomerStats',
                        id: 'STATS'
                    }
                ]
            }),
            /**
     * Deactivate a groomer
     *
     * Changes groomer status to inactive.
     * Invalidates Groomers cache to trigger refetch.
     *
     * @param groomerId - ID of groomer to deactivate
     * @returns Mutation response
     */ deactivateGroomer: builder.mutation({
                query: (groomerId)=>({
                        url: `/admin/groomers/${groomerId}/deactivate`,
                        method: 'POST'
                    }),
                invalidatesTags: [
                    {
                        type: 'Groomers',
                        id: 'LIST'
                    },
                    {
                        type: 'GroomerStats',
                        id: 'STATS'
                    }
                ]
            }),
            /**
     * Suspend a groomer
     *
     * Suspends a groomer (sets isActive to false).
     * Invalidates Groomers cache to trigger refetch.
     *
     * @param groomerId - ID of groomer to suspend
     * @returns Mutation response
     */ suspendGroomer: builder.mutation({
                query: (groomerId)=>({
                        url: `/admin/groomers/${groomerId}/suspend`,
                        method: 'POST'
                    }),
                invalidatesTags: [
                    {
                        type: 'Groomers',
                        id: 'LIST'
                    },
                    {
                        type: 'GroomerStats',
                        id: 'STATS'
                    }
                ]
            }),
            /**
     * Update groomer commission grade
     *
     * Updates the commission grade for a groomer.
     * Invalidates Groomers cache to trigger refetch.
     *
     * @param request - Groomer ID and new commission grade ID
     * @returns Mutation response
     */ updateCommissionGrade: builder.mutation({
                query: ({ groomerId, commissionGradeId })=>({
                        url: `/admin/groomers/${groomerId}/update-commission`,
                        method: 'POST',
                        body: {
                            commissionGradeId
                        }
                    }),
                invalidatesTags: [
                    {
                        type: 'Groomers',
                        id: 'LIST'
                    }
                ]
            }),
            /**
     * Get commission grades list
     *
     * Fetches all commission grades with optional filtering.
     * Used for displaying commission grade options in forms.
     *
     * @returns GetCommissionGradesResponse with grades list
     */ getCommissionGrades: builder.query({
                query: ({ status = 'ACTIVE' } = {})=>`/admin/commission-grades?status=${status}`,
                keepUnusedDataFor: 600
            })
        })
});
const { useGetGroomersQuery, useActivateGroomerMutation, useDeactivateGroomerMutation, useSuspendGroomerMutation, useUpdateCommissionGradeMutation, useGetCommissionGradesQuery } = adminGroomersApi;
}),
"[project]/src/features/admin-reviews/state/admin-reviews-api-slice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Admin Reviews RTK Query API Slice
 *
 * Provides RTK Query hooks for managing admin review operations:
 * - Fetching reviews with filters, pagination, and sorting
 * - Approving, flagging, hiding, and deleting reviews
 * - Responding to reviews
 *
 * Uses tag-based cache invalidation for automatic updates.
 */ __turbopack_context__.s([
    "adminReviewsApi",
    ()=>adminReviewsApi,
    "useApproveReviewMutation",
    ()=>useApproveReviewMutation,
    "useDeleteReviewMutation",
    ()=>useDeleteReviewMutation,
    "useFlagReviewMutation",
    ()=>useFlagReviewMutation,
    "useGetReviewsQuery",
    ()=>useGetReviewsQuery,
    "useHideReviewMutation",
    ()=>useHideReviewMutation,
    "useRespondToReviewMutation",
    ()=>useRespondToReviewMutation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-ssr] (ecmascript)");
;
const adminReviewsApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: 'adminReviewsApi',
    baseQuery: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
        baseUrl: '/api'
    }),
    // Tag types for cache invalidation
    tagTypes: [
        'Reviews',
        'ReviewStats'
    ],
    endpoints: (builder)=>({
            // GET /api/admin/reviews
            getReviews: builder.query({
                query: (params)=>{
                    const queryParams = new URLSearchParams();
                    if (params.page) queryParams.append('page', params.page.toString());
                    if (params.limit) queryParams.append('limit', params.limit.toString());
                    if (params.search) queryParams.append('search', params.search);
                    if (params.rating) queryParams.append('rating', params.rating.toString());
                    if (params.status) queryParams.append('status', params.status);
                    if (params.service) queryParams.append('service', params.service);
                    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
                    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
                    return `/admin/reviews?${queryParams}`;
                },
                providesTags: (result)=>result ? [
                        {
                            type: 'Reviews',
                            id: 'LIST'
                        },
                        {
                            type: 'ReviewStats',
                            id: 'STATS'
                        },
                        ...result.reviews.map(({ id })=>({
                                type: 'Reviews',
                                id
                            }))
                    ] : [
                        {
                            type: 'Reviews',
                            id: 'LIST'
                        }
                    ],
                keepUnusedDataFor: 600
            }),
            // POST /api/admin/reviews/[id]/approve
            approveReview: builder.mutation({
                query: (reviewId)=>({
                        url: `/admin/reviews/${reviewId}/approve`,
                        method: 'POST'
                    }),
                invalidatesTags: (_result, _error, reviewId)=>[
                        {
                            type: 'Reviews',
                            id: reviewId
                        },
                        {
                            type: 'Reviews',
                            id: 'LIST'
                        },
                        {
                            type: 'ReviewStats',
                            id: 'STATS'
                        }
                    ]
            }),
            // POST /api/admin/reviews/[id]/flag
            flagReview: builder.mutation({
                query: ({ reviewId, reason })=>({
                        url: `/admin/reviews/${reviewId}/flag`,
                        method: 'POST',
                        body: {
                            reason
                        }
                    }),
                invalidatesTags: (_result, _error, { reviewId })=>[
                        {
                            type: 'Reviews',
                            id: reviewId
                        },
                        {
                            type: 'Reviews',
                            id: 'LIST'
                        },
                        {
                            type: 'ReviewStats',
                            id: 'STATS'
                        }
                    ]
            }),
            // DELETE /api/admin/reviews/[id]
            deleteReview: builder.mutation({
                query: (reviewId)=>({
                        url: `/admin/reviews/${reviewId}`,
                        method: 'DELETE'
                    }),
                invalidatesTags: (_result, _error, reviewId)=>[
                        {
                            type: 'Reviews',
                            id: reviewId
                        },
                        {
                            type: 'Reviews',
                            id: 'LIST'
                        },
                        {
                            type: 'ReviewStats',
                            id: 'STATS'
                        }
                    ]
            }),
            // POST /api/admin/reviews/[id]/respond
            respondToReview: builder.mutation({
                query: ({ reviewId, response })=>({
                        url: `/admin/reviews/${reviewId}/respond`,
                        method: 'POST',
                        body: {
                            response
                        }
                    }),
                invalidatesTags: (_result, _error, { reviewId })=>[
                        {
                            type: 'Reviews',
                            id: reviewId
                        },
                        {
                            type: 'Reviews',
                            id: 'LIST'
                        },
                        {
                            type: 'ReviewStats',
                            id: 'STATS'
                        }
                    ]
            }),
            // POST /api/admin/reviews/[id]/hide
            hideReview: builder.mutation({
                query: (reviewId)=>({
                        url: `/admin/reviews/${reviewId}/hide`,
                        method: 'POST'
                    }),
                invalidatesTags: (_result, _error, reviewId)=>[
                        {
                            type: 'Reviews',
                            id: reviewId
                        },
                        {
                            type: 'Reviews',
                            id: 'LIST'
                        },
                        {
                            type: 'ReviewStats',
                            id: 'STATS'
                        }
                    ]
            })
        })
});
const { useGetReviewsQuery, useApproveReviewMutation, useFlagReviewMutation, useDeleteReviewMutation, useRespondToReviewMutation, useHideReviewMutation } = adminReviewsApi;
}),
"[project]/src/features/admin-payments/state/admin-payments-api-slice.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminPaymentsApi",
    ()=>adminPaymentsApi,
    "getPayments",
    ()=>getPayments,
    "useGetPaymentsQuery",
    ()=>useGetPaymentsQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-ssr] (ecmascript)");
;
const adminPaymentsApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: 'adminPaymentsApi',
    baseQuery: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
        baseUrl: '/api'
    }),
    tagTypes: [
        'Payments',
        'PaymentStats'
    ],
    endpoints: (builder)=>({
            /**
     * Get paginated list of payments with optional filters
     *
     * Cache tags (for surgical invalidation):
     * - `Payments:LIST` - Invalidates all paginated lists (use after create/delete)
     * - `Payments:{id}` - Invalidates specific payment detail (use after update)
     * - `PaymentStats:STATS` - Invalidates statistics (use after create/delete/status change)
     *
     * Invalidation strategy:
     * - After creating payment: invalidate `Payments:LIST` + `PaymentStats:STATS`
     * - After updating payment: invalidate `Payments:{id}` (+ `LIST` if status changed)
     * - After deleting payment: invalidate `Payments:LIST` + `PaymentStats:STATS`
     * - After refund: invalidate both `Payments:{id}` and `PaymentStats:STATS`
     *
     * Cache retention: Data remains cached while any component is subscribed.
     * After all components unsubscribe, data is kept for 10 minutes (600 seconds)
     * before being garbage collected. Cache can be manually invalidated via tags
     * regardless of subscription state.
     */ getPayments: builder.query({
                query: (params)=>{
                    const queryParams = new URLSearchParams({
                        page: params.page.toString(),
                        limit: params.limit.toString()
                    });
                    if (params.searchQuery) {
                        queryParams.append('search', params.searchQuery);
                    }
                    if (params.statusFilter && params.statusFilter !== 'ALL') {
                        queryParams.append('status', params.statusFilter);
                    }
                    return `/admin/payments?${queryParams.toString()}`;
                },
                providesTags: (result)=>result ? [
                        {
                            type: 'Payments',
                            id: 'LIST'
                        },
                        {
                            type: 'PaymentStats',
                            id: 'STATS'
                        },
                        ...result.payments.map(({ id })=>({
                                type: 'Payments',
                                id
                            }))
                    ] : [
                        {
                            type: 'Payments',
                            id: 'LIST'
                        }
                    ],
                keepUnusedDataFor: 600
            })
        })
});
const { useGetPaymentsQuery } = adminPaymentsApi;
const { getPayments } = adminPaymentsApi.endpoints;
}),
"[project]/src/lib/redux/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Redux Store 설정
 *
 * Redux Toolkit을 사용한 전역 상태 관리 스토어
 * RTK Query API 통합
 */ __turbopack_context__.s([
    "makeStore",
    ()=>makeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$logger$2f$dist$2f$redux$2d$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/redux-logger/dist/redux-logger.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$booking$2f$state$2f$booking$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/booking/state/booking-slice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$booking$2f$api$2f$booking$2d$query$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/booking/api/booking-query-api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$state$2f$dashboard$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/admin/state/dashboard-api-slice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$state$2f$breeds$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/admin/state/breeds-api-slice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2d$bookings$2f$state$2f$admin$2d$bookings$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/admin-bookings/state/admin-bookings-api-slice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2d$groomers$2f$state$2f$admin$2d$groomers$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/admin-groomers/state/admin-groomers-api-slice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2d$reviews$2f$state$2f$admin$2d$reviews$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/admin-reviews/state/admin-reviews-api-slice.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2d$payments$2f$state$2f$admin$2d$payments$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/admin-payments/state/admin-payments-api-slice.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
const makeStore = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
        reducer: {
            booking: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$booking$2f$state$2f$booking$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
            // RTK Query API reducers
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$booking$2f$api$2f$booking$2d$query$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bookingQueryApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$booking$2f$api$2f$booking$2d$query$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bookingQueryApi"].reducer,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$state$2f$dashboard$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dashboardApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$state$2f$dashboard$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dashboardApi"].reducer,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$state$2f$breeds$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["breedsApiSlice"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$state$2f$breeds$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["breedsApiSlice"].reducer,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2d$bookings$2f$state$2f$admin$2d$bookings$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adminBookingsApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2d$bookings$2f$state$2f$admin$2d$bookings$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adminBookingsApi"].reducer,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2d$groomers$2f$state$2f$admin$2d$groomers$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adminGroomersApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2d$groomers$2f$state$2f$admin$2d$groomers$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adminGroomersApi"].reducer,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2d$reviews$2f$state$2f$admin$2d$reviews$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adminReviewsApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2d$reviews$2f$state$2f$admin$2d$reviews$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adminReviewsApi"].reducer,
            [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2d$payments$2f$state$2f$admin$2d$payments$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adminPaymentsApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2d$payments$2f$state$2f$admin$2d$payments$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adminPaymentsApi"].reducer
        },
        middleware: (getDefaultMiddleware)=>{
            // Add RTK Query middleware
            const middleware = getDefaultMiddleware().concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$booking$2f$api$2f$booking$2d$query$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bookingQueryApi"].middleware).concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$state$2f$dashboard$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dashboardApi"].middleware).concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2f$state$2f$breeds$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["breedsApiSlice"].middleware).concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2d$bookings$2f$state$2f$admin$2d$bookings$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adminBookingsApi"].middleware).concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2d$groomers$2f$state$2f$admin$2d$groomers$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adminGroomersApi"].middleware).concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2d$reviews$2f$state$2f$admin$2d$reviews$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adminReviewsApi"].middleware).concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$admin$2d$payments$2f$state$2f$admin$2d$payments$2d$api$2d$slice$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["adminPaymentsApi"].middleware);
            if ("TURBOPACK compile-time truthy", 1) {
                const logger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$redux$2d$logger$2f$dist$2f$redux$2d$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createLogger"])({
                    collapsed: false,
                    duration: true,
                    timestamp: true,
                    diff: true,
                    logErrors: true,
                    predicate: ()=>true
                });
                middleware.push(logger);
            }
            return middleware;
        },
        devTools: ("TURBOPACK compile-time value", "development") !== 'production'
    });
};
}),
"[project]/src/lib/redux/provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Redux Store Provider
 * Next.js App Router와 함께 사용하기 위한 Redux Provider
 * 클라이언트 컴포넌트로 구현
 */ __turbopack_context__.s([
    "ReduxProvider",
    ()=>ReduxProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/redux/store.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeStore"])();
function ReduxProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"], {
        store: store,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/lib/redux/provider.tsx",
        lineNumber: 41,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2d$devtools$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query-devtools/build/modern/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$fetch$2d$interceptor$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/providers/fetch-interceptor-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/redux/provider.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function Providers({ children }) {
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000,
                    refetchOnWindowFocus: false
                }
            }
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$redux$2f$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReduxProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
            client: queryClient,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$fetch$2d$interceptor$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FetchInterceptorProvider"], {
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2d$devtools$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReactQueryDevtools"], {
                        initialIsOpen: false
                    }, void 0, false, {
                        fileName: "[project]/src/components/providers.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/providers.tsx",
                lineNumber: 31,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/providers.tsx",
            lineNumber: 30,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/providers.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bfe118e3._.js.map