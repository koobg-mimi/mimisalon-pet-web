module.exports = [
"[externals]/@react-email/render [external] (@react-email/render, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("@react-email/render");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/@react-email/components [external] (@react-email/components, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("@react-email/components");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/features/templates/email/components/base-layout.tsx [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "BaseEmailLayout",
    ()=>BaseEmailLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@react-email/components [external] (@react-email/components, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
function BaseEmailLayout({ children, title, previewText }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Html"], {
        lang: "ko",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Head"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/features/templates/email/components/base-layout.tsx",
                        lineNumber: 13,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Font"], {
                        fontFamily: "system-ui",
                        fallbackFontFamily: "Arial",
                        webFont: {
                            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
                            format: 'woff2'
                        },
                        fontWeight: 400,
                        fontStyle: "normal"
                    }, void 0, false, {
                        fileName: "[project]/src/features/templates/email/components/base-layout.tsx",
                        lineNumber: 14,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/templates/email/components/base-layout.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Body"], {
                style: bodyStyle,
                children: [
                    previewText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                        style: previewTextStyle,
                        children: previewText
                    }, void 0, false, {
                        fileName: "[project]/src/features/templates/email/components/base-layout.tsx",
                        lineNumber: 26,
                        columnNumber: 25
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Container"], {
                        style: containerStyle,
                        children: [
                            children,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Hr"], {
                                style: hrStyle
                            }, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/base-layout.tsx",
                                lineNumber: 31,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Section"], {
                                style: footerStyle,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                    style: footerTextStyle,
                                    children: [
                                        "이 메일은 발신 전용입니다. 문의사항이 있으시면 고객센터로 연락해주세요.",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/features/templates/email/components/base-layout.tsx",
                                            lineNumber: 35,
                                            columnNumber: 15
                                        }, this),
                                        "© 2024 미미살롱펫. All rights reserved."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/features/templates/email/components/base-layout.tsx",
                                    lineNumber: 33,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/base-layout.tsx",
                                lineNumber: 32,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/templates/email/components/base-layout.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/templates/email/components/base-layout.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/templates/email/components/base-layout.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
// Styles
const bodyStyle = {
    margin: '0',
    padding: '0',
    backgroundColor: '#f8fafc',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
};
const previewTextStyle = {
    display: 'none',
    overflow: 'hidden',
    lineHeight: '1px',
    opacity: 0,
    maxHeight: '0',
    maxWidth: '0'
};
const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff'
};
const hrStyle = {
    borderColor: '#e2e8f0',
    margin: '0'
};
const footerStyle = {
    backgroundColor: '#f8fafc',
    padding: '24px 20px',
    textAlign: 'center',
    borderTop: '1px solid #e2e8f0'
};
const footerTextStyle = {
    color: '#718096',
    margin: '0',
    fontSize: '14px',
    lineHeight: '1.4'
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/features/templates/email/components/email-verification.tsx [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "EmailVerificationEmail",
    ()=>EmailVerificationEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@react-email/components [external] (@react-email/components, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/templates/email/components/base-layout.tsx [middleware] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
function EmailVerificationEmail({ name, verificationUrl }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__["BaseEmailLayout"], {
        title: "이메일 인증 - 미미살롱펫",
        previewText: `안녕하세요 ${name}님, 미미살롱펫 이메일 인증을 완료해주세요.`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Section"], {
                style: headerStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                        style: headerTitleStyle,
                        children: "🐾 미미살롱펫"
                    }, void 0, false, {
                        fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                        style: headerSubtitleStyle,
                        children: "프리미엄 방문 반려동물 미용"
                    }, void 0, false, {
                        fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Section"], {
                style: contentStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Section"], {
                        style: welcomeStyle,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                style: welcomeTitleStyle,
                                children: [
                                    "안녕하세요, ",
                                    name,
                                    "님!"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                                lineNumber: 24,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                style: welcomeTextStyle,
                                children: [
                                    "미미살롱펫에 가입해 주셔서 감사합니다.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                                        lineNumber: 27,
                                        columnNumber: 13
                                    }, this),
                                    "아래 버튼을 클릭하여 이메일 인증을 완료해주세요."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                                lineNumber: 25,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Section"], {
                        style: verificationSectionStyle,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                style: verificationTitleStyle,
                                children: "이메일 인증이 필요합니다"
                            }, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                                lineNumber: 33,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                style: verificationTextStyle,
                                children: "계정 보안을 위해 이메일 주소를 인증해주세요."
                            }, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Button"], {
                                href: verificationUrl,
                                style: verificationButtonStyle,
                                children: "✅ 이메일 인증하기"
                            }, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                style: linkInstructionStyle,
                                children: "버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요:"
                            }, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                style: linkUrlStyle,
                                children: verificationUrl
                            }, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Section"], {
                        style: infoBoxStyle,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                            style: infoBoxTextStyle,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "🔒 보안 안내"
                                }, void 0, false, {
                                    fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                                    lineNumber: 48,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                                    lineNumber: 49,
                                    columnNumber: 13
                                }, this),
                                "• 이 링크는 24시간 동안만 유효합니다",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this),
                                "• 링크는 한 번만 사용할 수 있습니다",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                                    lineNumber: 53,
                                    columnNumber: 13
                                }, this),
                                "• 본인이 요청하지 않은 경우 이 메일을 무시하세요"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/templates/email/components/email-verification.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
// Styles
const headerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px',
    textAlign: 'center'
};
const headerTitleStyle = {
    color: '#ffffff',
    margin: '0',
    fontSize: '28px',
    fontWeight: '700'
};
const headerSubtitleStyle = {
    color: '#e2e8f0',
    margin: '8px 0 0 0',
    fontSize: '16px'
};
const contentStyle = {
    padding: '40px 20px'
};
const welcomeStyle = {
    textAlign: 'center',
    marginBottom: '32px'
};
const welcomeTitleStyle = {
    color: '#1a202c',
    margin: '0 0 16px 0',
    fontSize: '24px',
    fontWeight: '600'
};
const welcomeTextStyle = {
    color: '#4a5568',
    margin: '0',
    fontSize: '16px',
    lineHeight: '1.5'
};
const verificationSectionStyle = {
    backgroundColor: '#f7fafc',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
    margin: '32px 0'
};
const verificationTitleStyle = {
    color: '#1a202c',
    marginTop: '0',
    fontSize: '20px',
    fontWeight: '600'
};
const verificationTextStyle = {
    color: '#4a5568',
    marginBottom: '24px',
    fontSize: '16px'
};
const verificationButtonStyle = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '16px 32px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    margin: '16px 0'
};
const linkInstructionStyle = {
    color: '#718096',
    fontSize: '12px',
    marginTop: '16px'
};
const linkUrlStyle = {
    color: '#667eea',
    wordBreak: 'break-all',
    fontSize: '12px'
};
const infoBoxStyle = {
    backgroundColor: '#e6fffa',
    borderLeft: '4px solid #38b2ac',
    padding: '16px',
    margin: '24px 0',
    borderRadius: '4px'
};
const infoBoxTextStyle = {
    margin: '0',
    color: '#234e52',
    fontSize: '14px',
    lineHeight: '1.4'
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/features/templates/email/components/password-reset.tsx [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "PasswordResetEmail",
    ()=>PasswordResetEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@react-email/components [external] (@react-email/components, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/templates/email/components/base-layout.tsx [middleware] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
function PasswordResetEmail({ name, resetUrl }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__["BaseEmailLayout"], {
        title: "비밀번호 재설정 - 미미살롱펫",
        previewText: `${name}님의 비밀번호 재설정 요청을 처리해드리겠습니다.`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Section"], {
                style: headerStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                        style: headerTitleStyle,
                        children: "🔐 미미살롱펫"
                    }, void 0, false, {
                        fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                        style: headerSubtitleStyle,
                        children: "비밀번호 재설정"
                    }, void 0, false, {
                        fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                        lineNumber: 18,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Section"], {
                style: contentStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Section"], {
                        style: welcomeStyle,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                style: welcomeTitleStyle,
                                children: "비밀번호 재설정 요청"
                            }, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                                lineNumber: 24,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                style: welcomeTextStyle,
                                children: [
                                    "안녕하세요, ",
                                    name,
                                    "님.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                                        lineNumber: 27,
                                        columnNumber: 13
                                    }, this),
                                    "계정의 비밀번호 재설정을 요청하셨습니다."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                                lineNumber: 25,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Section"], {
                        style: resetSectionStyle,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                style: resetTitleStyle,
                                children: "새 비밀번호를 설정하세요"
                            }, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                                lineNumber: 33,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                style: resetTextStyle,
                                children: "아래 버튼을 클릭하여 안전한 새 비밀번호를 설정하세요."
                            }, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Button"], {
                                href: resetUrl,
                                style: resetButtonStyle,
                                children: "🔑 비밀번호 재설정하기"
                            }, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                style: linkInstructionStyle,
                                children: "버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요:"
                            }, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                style: linkUrlStyle,
                                children: resetUrl
                            }, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Section"], {
                        style: warningBoxStyle,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                            style: warningBoxTextStyle,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "⚠️ 보안 주의사항"
                                }, void 0, false, {
                                    fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                                    lineNumber: 48,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                                    lineNumber: 49,
                                    columnNumber: 13
                                }, this),
                                "• 이 링크는 30분 동안만 유효합니다",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this),
                                "• 링크는 한 번만 사용할 수 있습니다",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                                    lineNumber: 53,
                                    columnNumber: 13
                                }, this),
                                "• 본인이 요청하지 않은 경우 즉시 고객센터로 연락하세요",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                                    lineNumber: 55,
                                    columnNumber: 13
                                }, this),
                                "• 비밀번호 변경 후 모든 기기에서 다시 로그인하세요"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                        style: disclaimerTextStyle,
                        children: [
                            "혹시 비밀번호 재설정을 요청하지 않으셨다면, 이 메일을 무시하셔도 됩니다.",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this),
                            "계정은 안전하게 보호되고 있습니다."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/templates/email/components/password-reset.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
// Styles
const headerStyle = {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    padding: '40px 20px',
    textAlign: 'center'
};
const headerTitleStyle = {
    color: '#ffffff',
    margin: '0',
    fontSize: '28px',
    fontWeight: '700'
};
const headerSubtitleStyle = {
    color: '#fce4ec',
    margin: '8px 0 0 0',
    fontSize: '16px'
};
const contentStyle = {
    padding: '40px 20px'
};
const welcomeStyle = {
    textAlign: 'center',
    marginBottom: '32px'
};
const welcomeTitleStyle = {
    color: '#1a202c',
    margin: '0 0 16px 0',
    fontSize: '24px',
    fontWeight: '600'
};
const welcomeTextStyle = {
    color: '#4a5568',
    margin: '0',
    fontSize: '16px',
    lineHeight: '1.5'
};
const resetSectionStyle = {
    backgroundColor: '#fff5f5',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
    margin: '32px 0'
};
const resetTitleStyle = {
    color: '#1a202c',
    marginTop: '0',
    fontSize: '20px',
    fontWeight: '600'
};
const resetTextStyle = {
    color: '#4a5568',
    marginBottom: '24px',
    fontSize: '16px'
};
const resetButtonStyle = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '16px 32px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    margin: '16px 0'
};
const linkInstructionStyle = {
    color: '#718096',
    fontSize: '12px',
    marginTop: '16px'
};
const linkUrlStyle = {
    color: '#f5576c',
    wordBreak: 'break-all',
    fontSize: '12px'
};
const warningBoxStyle = {
    backgroundColor: '#fef5e7',
    borderLeft: '4px solid #f6ad55',
    padding: '16px',
    margin: '24px 0',
    borderRadius: '4px'
};
const warningBoxTextStyle = {
    margin: '0',
    color: '#744210',
    fontSize: '14px',
    lineHeight: '1.4'
};
const disclaimerTextStyle = {
    color: '#718096',
    textAlign: 'center',
    fontSize: '14px',
    lineHeight: '1.4'
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/features/templates/email/components/otp-verification.tsx [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "OTPVerificationEmail",
    ()=>OTPVerificationEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@react-email/components [external] (@react-email/components, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/templates/email/components/base-layout.tsx [middleware] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
function OTPVerificationEmail({ email: _email, otp, type }) {
    const getTitle = ()=>{
        switch(type){
            case 'sign-in':
                return '로그인 인증코드';
            case 'email-verification':
                return '이메일 인증코드';
            case 'forget-password':
                return '비밀번호 재설정 인증코드';
            default:
                return '인증코드';
        }
    };
    const getDescription = ()=>{
        switch(type){
            case 'sign-in':
                return '로그인을 완료하기 위해 아래 인증코드를 입력해주세요.';
            case 'email-verification':
                return '이메일 주소를 인증하기 위해 아래 인증코드를 입력해주세요.';
            case 'forget-password':
                return '비밀번호를 재설정하기 위해 아래 인증코드를 입력해주세요.';
            default:
                return '인증을 완료하기 위해 아래 코드를 입력해주세요.';
        }
    };
    const getHeaderGradient = ()=>{
        switch(type){
            case 'sign-in':
                return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            case 'email-verification':
                return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
            case 'forget-password':
                return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
            default:
                return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__["BaseEmailLayout"], {
        title: `${getTitle()} - 미미살롱펫`,
        previewText: `인증코드: ${otp}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Section"], {
                style: {
                    ...headerStyle,
                    background: getHeaderGradient()
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                        style: headerTitleStyle,
                        children: "🔐 미미살롱펫"
                    }, void 0, false, {
                        fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                        style: headerSubtitleStyle,
                        children: getTitle()
                    }, void 0, false, {
                        fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Section"], {
                style: contentStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Section"], {
                        style: welcomeStyle,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                style: welcomeTitleStyle,
                                children: "안녕하세요!"
                            }, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                style: welcomeTextStyle,
                                children: getDescription()
                            }, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Section"], {
                        style: otpSectionStyle,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                style: otpLabelStyle,
                                children: "인증코드"
                            }, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Section"], {
                                style: otpBoxStyle,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                    style: otpCodeStyle,
                                    children: otp
                                }, void 0, false, {
                                    fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                                    lineNumber: 69,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                                lineNumber: 68,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                                style: otpHintStyle,
                                children: [
                                    "이 코드를 복사하여 인증 페이지에 입력하세요.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                                        lineNumber: 73,
                                        columnNumber: 13
                                    }, this),
                                    "인증코드는 ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "10분 동안"
                                    }, void 0, false, {
                                        fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                                        lineNumber: 74,
                                        columnNumber: 19
                                    }, this),
                                    " 유효합니다."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Section"], {
                        style: infoBoxStyle,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                            style: infoBoxTextStyle,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "🔒 보안 안내"
                                }, void 0, false, {
                                    fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                                    lineNumber: 81,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, this),
                                "• 이 코드는 10분 후 자동으로 만료됩니다",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                                    lineNumber: 84,
                                    columnNumber: 13
                                }, this),
                                "• 최대 5회까지 입력 시도가 가능합니다",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                                    lineNumber: 86,
                                    columnNumber: 13
                                }, this),
                                "• 누구와도 이 코드를 공유하지 마세요",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                                    lineNumber: 88,
                                    columnNumber: 13
                                }, this),
                                "• 본인이 요청하지 않은 경우 이 메일을 무시하세요"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$components__$5b$external$5d$__$2840$react$2d$email$2f$components$2c$__esm_import$29$__["Text"], {
                        style: disclaimerTextStyle,
                        children: "본인이 요청하지 않은 경우, 계정 보안을 위해 즉시 비밀번호를 변경하시기 바랍니다."
                    }, void 0, false, {
                        fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/features/templates/email/components/otp-verification.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
// Styles
const headerStyle = {
    padding: '40px 20px',
    textAlign: 'center'
};
const headerTitleStyle = {
    color: '#ffffff',
    margin: '0',
    fontSize: '28px',
    fontWeight: '700'
};
const headerSubtitleStyle = {
    color: '#ffffff',
    opacity: '0.9',
    margin: '8px 0 0 0',
    fontSize: '16px'
};
const contentStyle = {
    padding: '40px 20px'
};
const welcomeStyle = {
    textAlign: 'center',
    marginBottom: '32px'
};
const welcomeTitleStyle = {
    color: '#1a202c',
    margin: '0 0 16px 0',
    fontSize: '24px',
    fontWeight: '600'
};
const welcomeTextStyle = {
    color: '#4a5568',
    margin: '0',
    fontSize: '16px',
    lineHeight: '1.5'
};
const otpSectionStyle = {
    textAlign: 'center',
    margin: '32px 0'
};
const otpLabelStyle = {
    color: '#718096',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px'
};
const otpBoxStyle = {
    backgroundColor: '#f7fafc',
    border: '2px dashed #cbd5e0',
    borderRadius: '12px',
    padding: '24px',
    margin: '16px auto',
    maxWidth: '320px'
};
const otpCodeStyle = {
    color: '#1a202c',
    fontSize: '42px',
    fontWeight: '700',
    letterSpacing: '8px',
    fontFamily: 'monospace',
    margin: '0',
    textAlign: 'center'
};
const otpHintStyle = {
    color: '#718096',
    fontSize: '14px',
    marginTop: '16px',
    lineHeight: '1.5'
};
const infoBoxStyle = {
    backgroundColor: '#e6fffa',
    borderLeft: '4px solid #38b2ac',
    padding: '16px',
    margin: '24px 0',
    borderRadius: '4px'
};
const infoBoxTextStyle = {
    margin: '0',
    color: '#234e52',
    fontSize: '14px',
    lineHeight: '1.6'
};
const disclaimerTextStyle = {
    color: '#718096',
    textAlign: 'center',
    fontSize: '13px',
    lineHeight: '1.4',
    marginTop: '24px'
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/features/templates/email/templates.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "generateEmailTemplate",
    ()=>generateEmailTemplate,
    "generateEmailVerificationTemplate",
    ()=>generateEmailVerificationTemplate,
    "generateOTPEmailTemplate",
    ()=>generateOTPEmailTemplate,
    "generatePasswordResetTemplate",
    ()=>generatePasswordResetTemplate
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$render__$5b$external$5d$__$2840$react$2d$email$2f$render$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@react-email/render [external] (@react-email/render, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$email$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/templates/email/components/email-verification.tsx [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$password$2d$reset$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/templates/email/components/password-reset.tsx [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$otp$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/templates/email/components/otp-verification.tsx [middleware] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$render__$5b$external$5d$__$2840$react$2d$email$2f$render$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$email$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$password$2d$reset$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$otp$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$render__$5b$external$5d$__$2840$react$2d$email$2f$render$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$email$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$password$2d$reset$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$otp$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
async function generateEmailVerificationTemplate(name, verificationUrl) {
    return await (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$render__$5b$external$5d$__$2840$react$2d$email$2f$render$2c$__esm_import$29$__["render"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$email$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__["EmailVerificationEmail"])({
        name,
        verificationUrl
    }));
}
async function generatePasswordResetTemplate(name, resetUrl) {
    return await (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$render__$5b$external$5d$__$2840$react$2d$email$2f$render$2c$__esm_import$29$__["render"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$password$2d$reset$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordResetEmail"])({
        name,
        resetUrl
    }));
}
async function generateOTPEmailTemplate(email, otp, type) {
    return await (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$react$2d$email$2f$render__$5b$external$5d$__$2840$react$2d$email$2f$render$2c$__esm_import$29$__["render"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$otp$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__["OTPVerificationEmail"])({
        email,
        otp,
        type
    }));
}
async function generateEmailTemplate(type, props) {
    switch(type){
        case 'email-verification':
            return await generateEmailVerificationTemplate(props.name, props.url);
        case 'password-reset':
            return await generatePasswordResetTemplate(props.name, props.url);
        default:
            throw new Error(`Unknown email template type: ${type}`);
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/features/templates/email/index.ts [middleware] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/**
 * Email Templates Module
 *
 * Re-exports email template components and generation functions
 */ // Template generation functions
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$templates$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/templates/email/templates.ts [middleware] (ecmascript)");
// React Email components (for direct use if needed)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$email$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/templates/email/components/email-verification.tsx [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$password$2d$reset$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/templates/email/components/password-reset.tsx [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$otp$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/templates/email/components/otp-verification.tsx [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/templates/email/components/base-layout.tsx [middleware] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$templates$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$email$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$password$2d$reset$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$otp$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$templates$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$email$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$password$2d$reset$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$otp$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/features/templates/index.ts [middleware] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/**
 * Templates Module
 *
 * Centralized exports for all application templates
 */ // Email templates
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/templates/email/index.ts [middleware] (ecmascript) <locals>");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/features/templates/email/index.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "BaseEmailLayout",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__["BaseEmailLayout"],
    "EmailVerificationEmail",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$email$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__["EmailVerificationEmail"],
    "OTPVerificationEmail",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$otp$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__["OTPVerificationEmail"],
    "PasswordResetEmail",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$password$2d$reset$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordResetEmail"],
    "generateEmailTemplate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$templates$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["generateEmailTemplate"],
    "generateEmailVerificationTemplate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$templates$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["generateEmailVerificationTemplate"],
    "generateOTPEmailTemplate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$templates$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["generateOTPEmailTemplate"],
    "generatePasswordResetTemplate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$templates$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["generatePasswordResetTemplate"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/templates/email/index.ts [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$templates$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/templates/email/templates.ts [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$email$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/templates/email/components/email-verification.tsx [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$password$2d$reset$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/templates/email/components/password-reset.tsx [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$otp$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/templates/email/components/otp-verification.tsx [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/templates/email/components/base-layout.tsx [middleware] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$templates$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$email$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$password$2d$reset$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$otp$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$templates$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$email$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$password$2d$reset$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$otp$2d$verification$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$components$2f$base$2d$layout$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/features/templates/index.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "BaseEmailLayout",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["BaseEmailLayout"],
    "EmailVerificationEmail",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["EmailVerificationEmail"],
    "OTPVerificationEmail",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["OTPVerificationEmail"],
    "PasswordResetEmail",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["PasswordResetEmail"],
    "generateEmailTemplate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["generateEmailTemplate"],
    "generateEmailVerificationTemplate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["generateEmailVerificationTemplate"],
    "generateOTPEmailTemplate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["generateOTPEmailTemplate"],
    "generatePasswordResetTemplate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["generatePasswordResetTemplate"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/features/templates/index.ts [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/features/templates/email/index.ts [middleware] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$features$2f$templates$2f$email$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [middleware] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [middleware] (ecmascript)").vendored['react-rsc'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7eca1d15._.js.map