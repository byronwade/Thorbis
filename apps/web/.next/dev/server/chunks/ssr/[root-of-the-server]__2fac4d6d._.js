module.exports = [
"[project]/apps/web/emails/theme.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EMAIL_COLORS",
    ()=>EMAIL_COLORS
]);
const EMAIL_COLORS = {
    background: "#fafafa",
    surface: "#fcfcfc",
    surfaceStrong: "#f2f2f2",
    primary: "#3c6ff5",
    primaryText: "#fafafa",
    heading: "#171717",
    text: "#171717",
    muted: "#737373",
    border: "#e6e6e6"
};
}),
"[project]/apps/web/emails/components/button.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Email Button Component - Matches dashboard button design
 *
 * Design:
 * - Primary variant with Thorbis Electric Blue
 * - Outline variant for secondary actions
 * - Responsive and accessible
 * - Supports both link and button styles
 */ __turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$button$40$0$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$button$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+button@0.2.0_react@19.2.0/node_modules/@react-email/button/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/theme.ts [app-rsc] (ecmascript)");
;
;
;
function Button({ href, children, variant = "primary" }) {
    const baseStyle = {
        display: "inline-block",
        padding: "12px 24px",
        fontSize: "16px",
        fontWeight: "600",
        textDecoration: "none",
        borderRadius: "8px",
        textAlign: "center",
        transition: "all 0.2s ease"
    };
    const variantStyles = {
        primary: {
            backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].primary,
            color: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].primaryText,
            border: "none"
        },
        outline: {
            backgroundColor: "transparent",
            color: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].primary,
            border: `2px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].primary}`
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$button$40$0$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$button$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
        href: href,
        style: {
            ...baseStyle,
            ...variantStyles[variant]
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/emails/components/button.tsx",
        lineNumber: 46,
        columnNumber: 3
    }, this);
}
}),
"[project]/apps/web/emails/components/card.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Email Card Component - Information card matching dashboard cards
 *
 * Design:
 * - Clean white background with subtle border
 * - Rounded corners
 * - Padding for content spacing
 * - Optional header and footer sections
 */ __turbopack_context__.s([
    "Card",
    ()=>Card
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$section$40$0$2e$0$2e$16_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+section@0.0.16_react@19.2.0/node_modules/@react-email/section/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+text@0.1.5_react@19.2.0/node_modules/@react-email/text/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/theme.ts [app-rsc] (ecmascript)");
;
;
;
function Card({ children, title, style }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$section$40$0$2e$0$2e$16_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Section"], {
        style: {
            ...cardStyle,
            ...style
        },
        children: [
            title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                style: titleStyle,
                children: title
            }, void 0, false, {
                fileName: "[project]/apps/web/emails/components/card.tsx",
                lineNumber: 29,
                columnNumber: 14
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/emails/components/card.tsx",
        lineNumber: 23,
        columnNumber: 3
    }, this);
}
const cardStyle = {
    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].surface,
    border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].border}`,
    borderRadius: "8px",
    padding: "24px",
    margin: "16px 0"
};
const titleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].heading,
    margin: "0 0 16px 0"
};
}),
"[project]/apps/web/emails/components/heading.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Email Heading Component - Typography for email headings
 *
 * Design:
 * - H1, H2, H3 variants
 * - Matches dashboard typography
 * - Proper spacing and hierarchy
 */ __turbopack_context__.s([
    "Heading",
    ()=>Heading
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$heading$40$0$2e$0$2e$15_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$heading$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+heading@0.0.15_react@19.2.0/node_modules/@react-email/heading/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/theme.ts [app-rsc] (ecmascript)");
;
;
;
function Heading({ children, level = 1, style }) {
    const headingTag = `h${level}`;
    const headingStyles = {
        1: {
            fontSize: "32px",
            fontWeight: "700",
            color: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].heading,
            margin: "0 0 16px 0",
            lineHeight: "1.2"
        },
        2: {
            fontSize: "24px",
            fontWeight: "600",
            color: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].text,
            margin: "0 0 12px 0",
            lineHeight: "1.3"
        },
        3: {
            fontSize: "18px",
            fontWeight: "600",
            color: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].muted,
            margin: "0 0 8px 0",
            lineHeight: "1.4"
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$heading$40$0$2e$0$2e$15_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$heading$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Heading"], {
        as: headingTag,
        style: {
            ...headingStyles[level],
            ...style
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/emails/components/heading.tsx",
        lineNumber: 46,
        columnNumber: 3
    }, this);
}
}),
"[project]/apps/web/emails/layouts/base-layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Thorbis-Branded Email Layout
 *
 * For platform/system emails:
 * - Clean, full-width design (no cards)
 * - Thorbis logo image from CDN/env
 * - Thorbis Electric Blue branding
 * - Professional footer with Thorbis info
 *
 * Uses environment variables for:
 * - Logo URL
 * - App URL
 * - Support email
 * - Company info
 */ __turbopack_context__.s([
    "BaseLayout",
    ()=>BaseLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$body$40$0$2e$1$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$body$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+body@0.1.0_react@19.2.0/node_modules/@react-email/body/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$container$40$0$2e$0$2e$15_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$container$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+container@0.0.15_react@19.2.0/node_modules/@react-email/container/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$head$40$0$2e$0$2e$12_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$head$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+head@0.0.12_react@19.2.0/node_modules/@react-email/head/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$hr$40$0$2e$0$2e$11_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$hr$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+hr@0.0.11_react@19.2.0/node_modules/@react-email/hr/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$html$40$0$2e$0$2e$11_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$html$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+html@0.0.11_react@19.2.0/node_modules/@react-email/html/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$img$40$0$2e$0$2e$11_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$img$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+img@0.0.11_react@19.2.0/node_modules/@react-email/img/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$link$40$0$2e$0$2e$12_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$link$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+link@0.0.12_react@19.2.0/node_modules/@react-email/link/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$preview$40$0$2e$0$2e$13_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$preview$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+preview@0.0.13_react@19.2.0/node_modules/@react-email/preview/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$section$40$0$2e$0$2e$16_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+section@0.0.16_react@19.2.0/node_modules/@react-email/section/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+text@0.1.5_react@19.2.0/node_modules/@react-email/text/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/theme.ts [app-rsc] (ecmascript)");
;
;
;
// Environment-based configuration
const THORBIS_LOGO_URL = process.env.NEXT_PUBLIC_THORBIS_LOGO_URL || "https://thorbis.com/logo-white.png";
const THORBIS_APP_URL = ("TURBOPACK compile-time value", "http://localhost:3000") || "https://app.thorbis.com";
const THORBIS_WEBSITE = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://thorbis.com";
const THORBIS_SUPPORT_EMAIL = process.env.THORBIS_SUPPORT_EMAIL || "support@thorbis.com";
const THORBIS_DOCS_URL = `${THORBIS_WEBSITE}/docs`;
const THORBIS_PRIVACY_URL = `${THORBIS_WEBSITE}/privacy`;
const THORBIS_TERMS_URL = `${THORBIS_WEBSITE}/terms`;
function BaseLayout({ children, previewText }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$html$40$0$2e$0$2e$11_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$html$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Html"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$head$40$0$2e$0$2e$12_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$head$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Head"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                    children: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          /* Reset email client styles */
          body { margin: 0; padding: 0; }
          table { border-collapse: collapse; }
          img { border: 0; }

          /* Responsive */
          @media only screen and (max-width: 600px) {
            .mobile-padding { padding: 20px !important; }
            .mobile-text { font-size: 14px !important; }
            .mobile-heading { font-size: 24px !important; }
          }
        `
                }, void 0, false, {
                    fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                    lineNumber: 55,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                lineNumber: 54,
                columnNumber: 4
            }, this),
            previewText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$preview$40$0$2e$0$2e$13_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$preview$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Preview"], {
                children: previewText
            }, void 0, false, {
                fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                lineNumber: 71,
                columnNumber: 20
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$body$40$0$2e$1$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$body$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Body"], {
                style: main,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$container$40$0$2e$0$2e$15_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$container$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Container"], {
                    style: container,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$section$40$0$2e$0$2e$16_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Section"], {
                            style: header,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$img$40$0$2e$0$2e$11_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$img$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Img"], {
                                src: THORBIS_LOGO_URL,
                                alt: "Thorbis",
                                width: "160",
                                height: "40",
                                style: logo
                            }, void 0, false, {
                                fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                                lineNumber: 76,
                                columnNumber: 7
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                            lineNumber: 75,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$section$40$0$2e$0$2e$16_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Section"], {
                            style: content,
                            className: "mobile-padding",
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                            lineNumber: 86,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$hr$40$0$2e$0$2e$11_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$hr$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Hr"], {
                            style: divider
                        }, void 0, false, {
                            fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                            lineNumber: 91,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$section$40$0$2e$0$2e$16_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$section$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Section"], {
                            style: footer,
                            className: "mobile-padding",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                                    style: footerText,
                                    children: [
                                        "Need help?",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$link$40$0$2e$0$2e$12_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$link$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Link"], {
                                            href: `mailto:${THORBIS_SUPPORT_EMAIL}`,
                                            style: footerLink,
                                            children: "Contact Support"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                                            lineNumber: 98,
                                            columnNumber: 8
                                        }, this),
                                        " • ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$link$40$0$2e$0$2e$12_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$link$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Link"], {
                                            href: THORBIS_DOCS_URL,
                                            style: footerLink,
                                            children: "Documentation"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                                            lineNumber: 102,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                                    lineNumber: 96,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                                    style: footerText,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$link$40$0$2e$0$2e$12_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$link$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Link"], {
                                            href: THORBIS_PRIVACY_URL,
                                            style: footerLink,
                                            children: "Privacy Policy"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                                            lineNumber: 109,
                                            columnNumber: 8
                                        }, this),
                                        " • ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$link$40$0$2e$0$2e$12_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$link$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Link"], {
                                            href: THORBIS_TERMS_URL,
                                            style: footerLink,
                                            children: "Terms of Service"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                                            lineNumber: 113,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                                    lineNumber: 108,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                                    style: footerCopyright,
                                    children: [
                                        "© ",
                                        new Date().getFullYear(),
                                        " Thorbis. All rights reserved."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                                    lineNumber: 119,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                                    style: footerAddress,
                                    children: "Thorbis • 123 Innovation Drive, San Francisco, CA 94105"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                                    lineNumber: 123,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                                    style: footerUnsubscribe,
                                    children: [
                                        "You're receiving this email because you have an account with Thorbis.",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$link$40$0$2e$0$2e$12_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$link$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Link"], {
                                            href: "{{unsubscribe_url}}",
                                            style: footerLink,
                                            children: "Unsubscribe from marketing emails"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                                            lineNumber: 131,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                                    lineNumber: 128,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                            lineNumber: 94,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                    lineNumber: 73,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
                lineNumber: 72,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/emails/layouts/base-layout.tsx",
        lineNumber: 53,
        columnNumber: 3
    }, this);
}
// Styles - Clean, full-width design
const main = {
    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].background,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale"
};
const container = {
    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].surface,
    maxWidth: "600px",
    margin: "0 auto"
};
const header = {
    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].primary,
    padding: "40px 0",
    textAlign: "center"
};
const logo = {
    margin: "0 auto",
    display: "block"
};
const content = {
    padding: "48px 40px",
    color: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].text,
    fontSize: "16px",
    lineHeight: "24px"
};
const divider = {
    borderColor: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].border,
    borderWidth: "1px",
    margin: "0"
};
const footer = {
    padding: "32px 40px",
    textAlign: "center",
    backgroundColor: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].surfaceStrong
};
const footerText = {
    color: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].muted,
    fontSize: "14px",
    lineHeight: "24px",
    margin: "8px 0"
};
const footerLink = {
    color: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].primary,
    textDecoration: "none",
    fontWeight: "500"
};
const footerCopyright = {
    color: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].muted,
    fontSize: "13px",
    margin: "16px 0 0 0",
    fontWeight: "600"
};
const footerAddress = {
    color: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].muted,
    fontSize: "12px",
    margin: "8px 0"
};
const footerUnsubscribe = {
    color: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EMAIL_COLORS"].muted,
    fontSize: "11px",
    margin: "16px 0 0 0",
    lineHeight: "18px"
};
}),
"[project]/apps/web/emails/templates/onboarding/verification-complete.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Verification Complete Email Template
 * Sent when toll-free verification is approved (or all verifications complete)
 *
 * Features:
 * - Celebrates approval
 * - Confirms SMS/MMS are now enabled
 * - Provides quick start guide
 * - Links to messaging dashboard
 */ __turbopack_context__.s([
    "default",
    ()=>VerificationCompleteEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+text@0.1.5_react@19.2.0/node_modules/@react-email/text/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/components/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/components/card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$heading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/components/heading.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$layouts$2f$base$2d$layout$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/layouts/base-layout.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
function VerificationCompleteEmail({ companyName, contactName, verificationTypes, dashboardUrl, messagingUrl, previewText = "Your business messaging is now fully enabled!" }) {
    const hasTollFree = verificationTypes.includes("toll-free");
    const has10DLC = verificationTypes.includes("10dlc");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$layouts$2f$base$2d$layout$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BaseLayout"], {
        previewText: previewText,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$heading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Heading"], {
                level: 1,
                children: "🎉 Your Messaging is Live!"
            }, void 0, false, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                lineNumber: 32,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                style: paragraph,
                children: [
                    "Hi ",
                    contactName,
                    ","
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                lineNumber: 34,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                style: paragraph,
                children: [
                    "Excellent news! Your business messaging verification for",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: companyName
                    }, void 0, false, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                        lineNumber: 38,
                        columnNumber: 5
                    }, this),
                    " has been approved. You can now send SMS and MMS messages to your customers."
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                lineNumber: 36,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                style: successCard,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: cardIcon,
                        children: "✅"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                        lineNumber: 44,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$heading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Heading"], {
                        level: 3,
                        style: cardTitle,
                        children: "All Systems Ready"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                        lineNumber: 45,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                        style: cardText,
                        children: [
                            hasTollFree && has10DLC && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: "Both your toll-free and regular (10DLC) numbers are now approved and ready to send messages."
                            }, void 0, false),
                            hasTollFree && !has10DLC && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: "Your toll-free numbers have been approved and are ready to send messages."
                            }, void 0, false),
                            !hasTollFree && has10DLC && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: "Your 10DLC (regular) numbers have been approved and are ready to send messages."
                            }, void 0, false)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                        lineNumber: 48,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                lineNumber: 43,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$heading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Heading"], {
                level: 3,
                children: "What You Can Do Now"
            }, void 0, false, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                lineNumber: 71,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                style: list,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        style: listItem,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Send SMS/MMS:"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                                lineNumber: 75,
                                columnNumber: 6
                            }, this),
                            " Text your customers with appointment reminders, estimates, invoices, and updates"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                        lineNumber: 74,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        style: listItem,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Two-Way Messaging:"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                                lineNumber: 79,
                                columnNumber: 6
                            }, this),
                            " Receive and respond to customer texts directly in your dashboard"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                        lineNumber: 78,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        style: listItem,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Automated Messages:"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                                lineNumber: 83,
                                columnNumber: 6
                            }, this),
                            " Set up automatic text notifications for jobs, appointments, and payments"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                        lineNumber: 82,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        style: listItem,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Rich Media:"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                                lineNumber: 87,
                                columnNumber: 6
                            }, this),
                            " Send photos, documents, and other attachments via MMS"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                        lineNumber: 86,
                        columnNumber: 5
                    }, this),
                    hasTollFree && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        style: listItem,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "RCS Messaging:"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                                lineNumber: 92,
                                columnNumber: 7
                            }, this),
                            " Support for read receipts and rich messaging features on compatible devices"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                        lineNumber: 91,
                        columnNumber: 6
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                lineNumber: 73,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$heading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Heading"], {
                        level: 3,
                        children: "Quick Start Guide"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                        lineNumber: 100,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                        style: stepText,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "1. Set Up Message Templates"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                                lineNumber: 103,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                                lineNumber: 104,
                                columnNumber: 6
                            }, this),
                            "Create reusable templates for common messages like appointment confirmations and reminders."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                        lineNumber: 102,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                        style: stepText,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "2. Configure Notifications"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                                lineNumber: 110,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                                lineNumber: 111,
                                columnNumber: 6
                            }, this),
                            "Enable automatic text notifications for job updates, invoice payments, and more."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                        lineNumber: 109,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                        style: stepText,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "3. Start Messaging"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                                lineNumber: 117,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                                lineNumber: 118,
                                columnNumber: 6
                            }, this),
                            "Send your first text message! Try texting a test appointment reminder or estimate notification."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                        lineNumber: 116,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                lineNumber: 99,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: buttonContainer,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                    href: messagingUrl,
                    children: "Open Messaging Dashboard"
                }, void 0, false, {
                    fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                    lineNumber: 126,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                lineNumber: 125,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: secondaryButtonContainer,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: dashboardUrl,
                    style: secondaryLink,
                    children: "Back to Main Dashboard →"
                }, void 0, false, {
                    fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                    lineNumber: 130,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                lineNumber: 129,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                style: supportText,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Need help getting started?"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                        lineNumber: 137,
                        columnNumber: 5
                    }, this),
                    " Check out our",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "https://thorbis.com/docs/messaging",
                        style: link,
                        children: "messaging guide"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                        lineNumber: 138,
                        columnNumber: 5
                    }, this),
                    " ",
                    "or contact support at",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "mailto:support@thorbis.com",
                        style: link,
                        children: "support@thorbis.com"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                        lineNumber: 142,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                lineNumber: 136,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                style: footerNote,
                children: "Your approval was issued by The Campaign Registry and is valid for all US carriers. Keep sending great messages! 📱"
            }, void 0, false, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
                lineNumber: 147,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/emails/templates/onboarding/verification-complete.tsx",
        lineNumber: 31,
        columnNumber: 3
    }, this);
}
const paragraph = {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0 0 16px 0"
};
const successCard = {
    backgroundColor: "#f0fdf4",
    border: "1px solid #86efac",
    borderRadius: "8px",
    padding: "24px",
    margin: "24px 0",
    textAlign: "center"
};
const cardIcon = {
    fontSize: "48px",
    marginBottom: "12px"
};
const cardTitle = {
    color: "#166534",
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 8px 0"
};
const cardText = {
    color: "#15803d",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0"
};
const list = {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "16px 0 24px 24px",
    padding: "0"
};
const listItem = {
    margin: "0 0 12px 0"
};
const stepText = {
    color: "#6b7280",
    fontSize: "15px",
    lineHeight: "22px",
    margin: "0 0 16px 0"
};
const buttonContainer = {
    margin: "32px 0 16px 0",
    textAlign: "center"
};
const secondaryButtonContainer = {
    margin: "0 0 32px 0",
    textAlign: "center"
};
const secondaryLink = {
    color: "hsl(217 91% 60%)",
    fontSize: "16px",
    textDecoration: "none",
    fontWeight: "500"
};
const supportText = {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "24px 0 0 0",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    textAlign: "center"
};
const footerNote = {
    color: "#9ca3af",
    fontSize: "13px",
    lineHeight: "18px",
    margin: "24px 0 0 0",
    textAlign: "center",
    fontStyle: "italic"
};
const link = {
    color: "hsl(217 91% 60%)",
    textDecoration: "underline"
};
}),
"[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Verification Submitted Email Template
 * Sent immediately after user submits toll-free/10DLC verification during onboarding
 *
 * Features:
 * - Confirms submission received
 * - Explains verification timeline
 * - Sets expectations for what happens next
 * - Provides support contact info
 */ __turbopack_context__.s([
    "default",
    ()=>VerificationSubmittedEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+text@0.1.5_react@19.2.0/node_modules/@react-email/text/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/components/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/components/card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$heading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/components/heading.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$layouts$2f$base$2d$layout$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/layouts/base-layout.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
function VerificationSubmittedEmail({ companyName, contactName, hasTollFreeNumbers, has10DLCNumbers, tollFreeCount = 0, dlcCount = 0, dashboardUrl, previewText = "Your messaging verification has been submitted successfully" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$layouts$2f$base$2d$layout$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BaseLayout"], {
        previewText: previewText,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$heading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Heading"], {
                level: 1,
                children: "Verification Submitted Successfully!"
            }, void 0, false, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                lineNumber: 31,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                style: paragraph,
                children: [
                    "Hi ",
                    contactName,
                    ","
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                lineNumber: 33,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                style: paragraph,
                children: [
                    "Great news! We've successfully submitted your business messaging verification for ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: companyName
                    }, void 0, false, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                        lineNumber: 37,
                        columnNumber: 22
                    }, this),
                    ". Here's what happens next:"
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                lineNumber: 35,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: timelineContainer,
                children: [
                    has10DLCNumbers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                        style: successCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: cardIcon,
                                children: "✅"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                                lineNumber: 45,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$heading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Heading"], {
                                level: 3,
                                style: cardTitle,
                                children: "10DLC Registration Complete"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                                lineNumber: 46,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                                style: cardText,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: [
                                            dlcCount,
                                            " regular number",
                                            dlcCount !== 1 ? "s" : ""
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                                        lineNumber: 50,
                                        columnNumber: 8
                                    }, this),
                                    " ",
                                    "enabled for SMS immediately. You can start sending text messages right away!"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                                lineNumber: 49,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                        lineNumber: 44,
                        columnNumber: 6
                    }, this),
                    hasTollFreeNumbers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                        style: pendingCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: cardIcon,
                                children: "⏰"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                                lineNumber: 61,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$heading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Heading"], {
                                level: 3,
                                style: cardTitle,
                                children: "Toll-Free Verification Pending"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                                lineNumber: 62,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                                style: cardText,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: [
                                            tollFreeCount,
                                            " toll-free number",
                                            tollFreeCount !== 1 ? "s" : ""
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                                        lineNumber: 66,
                                        columnNumber: 8
                                    }, this),
                                    " ",
                                    "submitted for verification. Approval typically takes",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "5-7 business days"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                                        lineNumber: 70,
                                        columnNumber: 8
                                    }, this),
                                    "."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                                lineNumber: 65,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                        lineNumber: 60,
                        columnNumber: 6
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                lineNumber: 42,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$heading$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Heading"], {
                        level: 3,
                        children: "What to Expect"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                        lineNumber: 78,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        style: list,
                        children: [
                            has10DLCNumbers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                style: listItem,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Regular Numbers (10DLC):"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                                        lineNumber: 83,
                                        columnNumber: 8
                                    }, this),
                                    " Ready to use! Start sending SMS/MMS to your customers right away."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                                lineNumber: 82,
                                columnNumber: 7
                            }, this),
                            hasTollFreeNumbers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                style: listItem,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Toll-Free Numbers:"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                                        lineNumber: 89,
                                        columnNumber: 8
                                    }, this),
                                    " Under review by our carrier partners. We'll email you when they're approved (usually within 5-7 business days)."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                                lineNumber: 88,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                style: listItem,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "No Action Required:"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                                        lineNumber: 95,
                                        columnNumber: 7
                                    }, this),
                                    " We're handling everything automatically. You can continue setting up your account."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                                lineNumber: 94,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                style: listItem,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Notification:"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                                        lineNumber: 99,
                                        columnNumber: 7
                                    }, this),
                                    " You'll receive another email once your toll-free verification is complete."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                                lineNumber: 98,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                        lineNumber: 80,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                lineNumber: 77,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: buttonContainer,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$components$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                    href: dashboardUrl,
                    children: "Go to Dashboard"
                }, void 0, false, {
                    fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                    lineNumber: 107,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                lineNumber: 106,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                style: supportText,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Need help?"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                        lineNumber: 112,
                        columnNumber: 5
                    }, this),
                    " If you have any questions about the verification process, our support team is here to help at",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "mailto:support@thorbis.com",
                        style: link,
                        children: "support@thorbis.com"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                        lineNumber: 114,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                lineNumber: 111,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$text$40$0$2e$1$2e$5_react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$text$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Text"], {
                style: footerNote,
                children: "This is a federal requirement enforced by The Campaign Registry and US carriers to prevent spam and ensure legitimate business messaging."
            }, void 0, false, {
                fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
                lineNumber: 119,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx",
        lineNumber: 30,
        columnNumber: 3
    }, this);
}
const paragraph = {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0 0 16px 0"
};
const timelineContainer = {
    margin: "32px 0",
    display: "grid",
    gap: "16px"
};
const successCard = {
    backgroundColor: "#f0fdf4",
    border: "1px solid #86efac",
    borderRadius: "8px",
    padding: "24px"
};
const pendingCard = {
    backgroundColor: "#fffbeb",
    border: "1px solid #fde047",
    borderRadius: "8px",
    padding: "24px"
};
const cardIcon = {
    fontSize: "32px",
    marginBottom: "8px"
};
const cardTitle = {
    color: "#374151",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 8px 0"
};
const cardText = {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "20px",
    margin: "0"
};
const list = {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "16px 0 0 24px",
    padding: "0"
};
const listItem = {
    margin: "0 0 12px 0"
};
const buttonContainer = {
    margin: "32px 0",
    textAlign: "center"
};
const supportText = {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "24px 0 0 0",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    textAlign: "center"
};
const footerNote = {
    color: "#9ca3af",
    fontSize: "13px",
    lineHeight: "18px",
    margin: "24px 0 0 0",
    textAlign: "center",
    fontStyle: "italic"
};
const link = {
    color: "hsl(217 91% 60%)",
    textDecoration: "underline"
};
}),
"[externals]/prettier/plugins/html [external] (prettier/plugins/html, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("prettier/plugins/html");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/prettier/standalone [external] (prettier/standalone, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("prettier/standalone");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/apps/web/src/lib/email/deliverability-monitor.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00c33d6af75b179c3e5fb2a253ea5a10b9f9653dff":"runHealthCheckForAllDomains","407f3abd7521af716b17126cab115727d0f9d2d93c":"getDomainHealth","40872808aec1a4f1b129010a366e6a68870ce0df8d":"processResendWebhookEvent","409c8641fcd4f7b2db25c834d3da962a5bd66b4798":"getCompanyDomainsHealth","40b125991185ef24f09bd02dc43e2aa44f415f71f9":"generateDeliverabilityReport","40c65805cd77cf6cd7eae148fa7901b55f8b6c304b":"recordDeliveryEvent"},"",""] */ __turbopack_context__.s([
    "generateDeliverabilityReport",
    ()=>generateDeliverabilityReport,
    "getCompanyDomainsHealth",
    ()=>getCompanyDomainsHealth,
    "getDomainHealth",
    ()=>getDomainHealth,
    "processResendWebhookEvent",
    ()=>processResendWebhookEvent,
    "recordDeliveryEvent",
    ()=>recordDeliveryEvent,
    "runHealthCheckForAllDomains",
    ()=>runHealthCheckForAllDomains
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function recordDeliveryEvent(event) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    // Use the database function to update reputation
    const { error } = await supabase.rpc("update_domain_reputation", {
        p_domain_id: event.domainId,
        p_event_type: event.eventType
    });
    if (error) {
        console.error("Error recording delivery event:", error);
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true
    };
}
async function processResendWebhookEvent(webhookData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    // Map Resend event types to our event types
    const eventTypeMap = {
        "email.delivered": "delivered",
        "email.bounced": "bounced",
        "email.complained": "complained",
        "email.opened": "opened",
        "email.clicked": "clicked",
        // Soft bounces might come as delivery_delayed in some providers
        "email.delivery_delayed": "soft_bounce"
    };
    const eventType = eventTypeMap[webhookData.type];
    if (!eventType) {
        // Not a delivery event we track
        return {
            success: true
        };
    }
    // Extract domain from the "from" address
    const fromEmail = webhookData.data.from;
    if (!fromEmail) {
        return {
            success: true
        };
    }
    const domain = fromEmail.includes("@") ? fromEmail.split("@")[1] : fromEmail;
    // Look up the domain in our database
    const { data: domainRecord } = await supabase.from("company_email_domains").select("id").eq("domain_name", domain).maybeSingle();
    if (!domainRecord) {
        // Domain not found in our system
        return {
            success: true
        };
    }
    // Record the event
    return recordDeliveryEvent({
        domainId: domainRecord.id,
        eventType,
        emailId: webhookData.data.email_id,
        metadata: webhookData.data
    });
}
async function getDomainHealth(domainId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data, error } = await supabase.from("company_email_domains").select("id, domain_name, reputation_score, bounce_rate, total_emails_sent, hard_bounces, soft_bounces, spam_complaints, is_suspended, last_health_check").eq("id", domainId).single();
    if (error || !data) {
        return null;
    }
    const totalEvents = data.total_emails_sent + data.hard_bounces + data.soft_bounces;
    const bounceRate = totalEvents > 0 ? (data.hard_bounces + data.soft_bounces) / totalEvents * 100 : 0;
    const complaintRate = data.total_emails_sent > 0 ? data.spam_complaints / data.total_emails_sent * 100 : 0;
    const deliveryRate = totalEvents > 0 ? data.total_emails_sent / totalEvents * 100 : 100;
    let status = "healthy";
    if (data.is_suspended) {
        status = "suspended";
    } else if (data.reputation_score < 30 || bounceRate > 10 || complaintRate > 0.5) {
        status = "critical";
    } else if (data.reputation_score < 60 || bounceRate > 5 || complaintRate > 0.2) {
        status = "warning";
    }
    return {
        domainId: data.id,
        domain: data.domain_name,
        reputationScore: Number(data.reputation_score),
        bounceRate: Number(bounceRate.toFixed(2)),
        complaintRate: Number(complaintRate.toFixed(3)),
        deliveryRate: Number(deliveryRate.toFixed(2)),
        status,
        totalEmailsSent: data.total_emails_sent,
        hardBounces: data.hard_bounces,
        softBounces: data.soft_bounces,
        complaints: data.spam_complaints,
        lastHealthCheck: data.last_health_check
    };
}
async function getCompanyDomainsHealth(companyId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data, error } = await supabase.from("company_email_domains").select("id, domain_name, reputation_score, bounce_rate, total_emails_sent, hard_bounces, soft_bounces, spam_complaints, is_suspended, last_health_check").eq("company_id", companyId);
    if (error || !data) {
        return [];
    }
    return data.map((d)=>{
        const totalEvents = d.total_emails_sent + d.hard_bounces + d.soft_bounces;
        const bounceRate = totalEvents > 0 ? (d.hard_bounces + d.soft_bounces) / totalEvents * 100 : 0;
        const complaintRate = d.total_emails_sent > 0 ? d.spam_complaints / d.total_emails_sent * 100 : 0;
        const deliveryRate = totalEvents > 0 ? d.total_emails_sent / totalEvents * 100 : 100;
        let status = "healthy";
        if (d.is_suspended) {
            status = "suspended";
        } else if (d.reputation_score < 30 || bounceRate > 10 || complaintRate > 0.5) {
            status = "critical";
        } else if (d.reputation_score < 60 || bounceRate > 5 || complaintRate > 0.2) {
            status = "warning";
        }
        return {
            domainId: d.id,
            domain: d.domain_name,
            reputationScore: Number(d.reputation_score),
            bounceRate: Number(bounceRate.toFixed(2)),
            complaintRate: Number(complaintRate.toFixed(3)),
            deliveryRate: Number(deliveryRate.toFixed(2)),
            status,
            totalEmailsSent: d.total_emails_sent,
            hardBounces: d.hard_bounces,
            softBounces: d.soft_bounces,
            complaints: d.spam_complaints,
            lastHealthCheck: d.last_health_check
        };
    });
}
async function runHealthCheckForAllDomains() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    // Get all active domains
    const { data: domains } = await supabase.from("company_email_domains").select("id, reputation_score, hard_bounces, soft_bounces, spam_complaints, total_emails_sent").eq("is_suspended", false);
    if (!domains) {
        return {
            checked: 0,
            suspended: 0,
            warnings: 0
        };
    }
    let suspended = 0;
    let warnings = 0;
    for (const domain of domains){
        const totalEvents = domain.total_emails_sent + domain.hard_bounces + domain.soft_bounces;
        const bounceRate = totalEvents > 100 ? (domain.hard_bounces + domain.soft_bounces) / totalEvents * 100 : 0;
        const complaintRate = domain.total_emails_sent > 100 ? domain.spam_complaints / domain.total_emails_sent * 100 : 0;
        // Auto-suspend if reputation is critical
        if (domain.reputation_score < 20 || bounceRate > 15 || complaintRate > 1) {
            await supabase.from("company_email_domains").update({
                is_suspended: true,
                suspension_reason: `Auto-suspended: Reputation ${domain.reputation_score}, Bounce rate ${bounceRate.toFixed(1)}%, Complaint rate ${complaintRate.toFixed(2)}%`,
                suspended_at: new Date().toISOString(),
                last_health_check: new Date().toISOString()
            }).eq("id", domain.id);
            suspended++;
        } else if (domain.reputation_score < 50 || bounceRate > 8 || complaintRate > 0.3) {
            // Update health check timestamp for warning domains
            await supabase.from("company_email_domains").update({
                last_health_check: new Date().toISOString()
            }).eq("id", domain.id);
            warnings++;
        } else {
            // Healthy, just update timestamp
            await supabase.from("company_email_domains").update({
                last_health_check: new Date().toISOString()
            }).eq("id", domain.id);
        }
    }
    return {
        checked: domains.length,
        suspended,
        warnings
    };
}
async function generateDeliverabilityReport(domainId) {
    const health = await getDomainHealth(domainId);
    if (!health) {
        return null;
    }
    const recommendations = [];
    if (health.bounceRate > 5) {
        recommendations.push("High bounce rate detected. Clean your email list and remove invalid addresses.");
    }
    if (health.complaintRate > 0.1) {
        recommendations.push("Spam complaints detected. Ensure recipients have opted in and make unsubscribe easy.");
    }
    if (health.reputationScore < 70) {
        recommendations.push("Reputation score is below optimal. Reduce sending volume temporarily and focus on engagement.");
    }
    if (health.status === "warning" || health.status === "critical") {
        recommendations.push("Domain health is degraded. Review your email content and sending practices.");
    }
    if (recommendations.length === 0) {
        recommendations.push("Domain health is good. Continue monitoring and maintain current practices.");
    }
    return {
        domain: health.domain,
        period: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
        },
        metrics: {
            totalSent: health.totalEmailsSent,
            delivered: health.totalEmailsSent - health.hardBounces,
            bounced: health.hardBounces + health.softBounces,
            complained: health.complaints,
            deliveryRate: health.deliveryRate,
            bounceRate: health.bounceRate,
            complaintRate: health.complaintRate
        },
        reputation: {
            current: health.reputationScore,
            change: 0,
            status: health.status
        },
        recommendations
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    recordDeliveryEvent,
    processResendWebhookEvent,
    getDomainHealth,
    getCompanyDomainsHealth,
    runHealthCheckForAllDomains,
    generateDeliverabilityReport
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(recordDeliveryEvent, "40c65805cd77cf6cd7eae148fa7901b55f8b6c304b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(processResendWebhookEvent, "40872808aec1a4f1b129010a366e6a68870ce0df8d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getDomainHealth, "407f3abd7521af716b17126cab115727d0f9d2d93c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCompanyDomainsHealth, "409c8641fcd4f7b2db25c834d3da962a5bd66b4798", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(runHealthCheckForAllDomains, "00c33d6af75b179c3e5fb2a253ea5a10b9f9653dff", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(generateDeliverabilityReport, "40b125991185ef24f09bd02dc43e2aa44f415f71f9", null);
}),
"[project]/apps/web/src/lib/email/email-types.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Email Types - Type definitions for email templates
 *
 * Features:
 * - Type-safe email data
 * - Template props interfaces
 * - Email send result types
 * - Validation schemas
 */ __turbopack_context__.s([
    "EmailTemplate",
    ()=>EmailTemplate,
    "emailSendSchema",
    ()=>emailSendSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
// Validation Schemas
const emailAddressSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email("Invalid email address").min(1, "Email is required");
const emailSendSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    to: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].union([
        emailAddressSchema,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(emailAddressSchema)
    ]),
    subject: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Subject is required").max(200),
    replyTo: emailAddressSchema.optional()
});
var EmailTemplate = /*#__PURE__*/ function(EmailTemplate) {
    // Auth
    EmailTemplate["WELCOME"] = "welcome";
    EmailTemplate["EMAIL_VERIFICATION"] = "email-verification";
    EmailTemplate["PASSWORD_RESET"] = "password-reset";
    EmailTemplate["PASSWORD_CHANGED"] = "password-changed";
    EmailTemplate["MAGIC_LINK"] = "magic-link";
    // Jobs
    EmailTemplate["JOB_CONFIRMATION"] = "job-confirmation";
    EmailTemplate["APPOINTMENT_REMINDER"] = "appointment-reminder";
    EmailTemplate["TECH_EN_ROUTE"] = "tech-en-route";
    EmailTemplate["JOB_COMPLETE"] = "job-complete";
    // Billing
    EmailTemplate["INVOICE"] = "invoice";
    EmailTemplate["ESTIMATE"] = "estimate";
    EmailTemplate["INVOICE_SENT"] = "invoice-sent";
    EmailTemplate["PAYMENT_RECEIVED"] = "payment-received";
    EmailTemplate["PAYMENT_REMINDER"] = "payment-reminder";
    EmailTemplate["ESTIMATE_SENT"] = "estimate-sent";
    // Customer
    EmailTemplate["REVIEW_REQUEST"] = "review-request";
    EmailTemplate["SERVICE_REMINDER"] = "service-reminder";
    EmailTemplate["WELCOME_CUSTOMER"] = "welcome-customer";
    EmailTemplate["PORTAL_INVITATION"] = "portal-invitation";
    // Team
    EmailTemplate["TEAM_INVITATION"] = "team-invitation";
    // Onboarding & Verification
    EmailTemplate["VERIFICATION_SUBMITTED"] = "verification-submitted";
    EmailTemplate["VERIFICATION_COMPLETE"] = "verification-complete";
    // Waitlist
    EmailTemplate["WAITLIST_SUBSCRIPTION"] = "waitlist-subscription";
    EmailTemplate["WAITLIST_ADMIN_NOTIFICATION"] = "waitlist-admin-notification";
    // Generic
    EmailTemplate["GENERIC"] = "generic";
    return EmailTemplate;
}({});
}),
"[project]/apps/web/src/lib/email/pre-send-checks.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addToGlobalBounceList",
    ()=>addToGlobalBounceList,
    "addToSuppressionList",
    ()=>addToSuppressionList,
    "calculateSpamScore",
    ()=>calculateSpamScore,
    "checkDomainWarmup",
    ()=>checkDomainWarmup,
    "checkSuppressionList",
    ()=>checkSuppressionList,
    "getSuppressionList",
    ()=>getSuppressionList,
    "removeFromSuppressionList",
    ()=>removeFromSuppressionList,
    "runPreSendChecks",
    ()=>runPreSendChecks,
    "verifyDomainStatus",
    ()=>verifyDomainStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
;
// Spam trigger words and patterns
const SPAM_TRIGGERS = {
    urgency: [
        "act now",
        "limited time",
        "urgent",
        "immediate",
        "expires",
        "hurry",
        "don't miss",
        "last chance",
        "final notice",
        "deadline"
    ],
    money: [
        "free",
        "$$$",
        "cash",
        "discount",
        "save big",
        "best price",
        "cheap",
        "bargain",
        "bonus",
        "prize",
        "winner",
        "congratulations"
    ],
    suspicious: [
        "click here",
        "click below",
        "buy now",
        "order now",
        "subscribe now",
        "sign up free",
        "no obligation",
        "risk free",
        "100% free",
        "act immediately"
    ],
    formatting: [
        "ALL CAPS WORDS",
        "!!!",
        "???",
        "$$$",
        "***",
        "###"
    ]
};
// Weight multipliers for spam scoring
const SPAM_WEIGHTS = {
    urgency: 2,
    money: 3,
    suspicious: 4,
    formatting: 1.5,
    excessiveLinks: 5,
    noUnsubscribe: 3,
    shortContent: 2,
    imageHeavy: 3
};
async function checkSuppressionList(companyId, recipientEmails) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const results = new Map();
    // Initialize all as not suppressed
    for (const email of recipientEmails){
        results.set(email.toLowerCase(), {
            suppressed: false
        });
    }
    // Check suppression list
    const { data: suppressions } = await supabase.from("email_suppressions").select("email, reason, created_at").eq("company_id", companyId).in("email", recipientEmails.map((e)=>e.toLowerCase()));
    if (suppressions) {
        for (const suppression of suppressions){
            results.set(suppression.email, {
                suppressed: true,
                reason: suppression.reason,
                suppressedAt: suppression.created_at
            });
        }
    }
    // Also check global hard bounces (cross-company)
    const { data: globalBounces } = await supabase.from("email_global_bounces").select("email, bounce_type, created_at").in("email", recipientEmails.map((e)=>e.toLowerCase())).eq("bounce_type", "hard");
    if (globalBounces) {
        for (const bounce of globalBounces){
            const existing = results.get(bounce.email);
            if (!existing?.suppressed) {
                results.set(bounce.email, {
                    suppressed: true,
                    reason: `Global hard bounce: ${bounce.bounce_type}`,
                    suppressedAt: bounce.created_at
                });
            }
        }
    }
    return results;
}
function calculateSpamScore(subject, htmlContent, textContent, hasUnsubscribeLink) {
    let score = 0;
    const issues = [];
    const fullText = `${subject} ${textContent}`.toLowerCase();
    const htmlLower = htmlContent.toLowerCase();
    // Check spam trigger words
    for (const [category, words] of Object.entries(SPAM_TRIGGERS)){
        const weight = SPAM_WEIGHTS[category] || 1;
        for (const word of words){
            const regex = new RegExp(word.toLowerCase(), "gi");
            const matches = fullText.match(regex);
            if (matches) {
                score += matches.length * weight;
                if (matches.length > 1) {
                    issues.push(`Contains "${word}" ${matches.length} times`);
                }
            }
        }
    }
    // Check for ALL CAPS in subject
    const capsWords = subject.split(" ").filter((w)=>w.length > 3 && w === w.toUpperCase());
    if (capsWords.length > 0) {
        score += capsWords.length * 3;
        issues.push(`Subject contains ${capsWords.length} ALL CAPS words`);
    }
    // Check excessive punctuation
    const exclamations = (subject.match(/!/g) || []).length;
    if (exclamations > 1) {
        score += exclamations * 2;
        issues.push(`Excessive exclamation marks in subject (${exclamations})`);
    }
    // Check link density
    const links = (htmlLower.match(/<a\s/gi) || []).length;
    const wordCount = textContent.split(/\s+/).length;
    if (wordCount > 0 && links / wordCount > 0.1) {
        score += SPAM_WEIGHTS.excessiveLinks;
        issues.push(`High link density (${links} links in ${wordCount} words)`);
    }
    // Check image-to-text ratio
    const images = (htmlLower.match(/<img\s/gi) || []).length;
    if (images > 0 && textContent.length < 200) {
        score += SPAM_WEIGHTS.imageHeavy;
        issues.push("Image-heavy email with little text");
    }
    // Check for unsubscribe link
    if (!hasUnsubscribeLink) {
        score += SPAM_WEIGHTS.noUnsubscribe;
        issues.push("Missing unsubscribe link (required for marketing emails)");
    }
    // Check content length (very short emails look suspicious)
    if (textContent.length < 50) {
        score += SPAM_WEIGHTS.shortContent;
        issues.push("Very short email content");
    }
    // Check for suspicious patterns
    if (htmlLower.includes("display:none") || htmlLower.includes("font-size:0")) {
        score += 10;
        issues.push("Contains hidden text (spam technique)");
    }
    // Check for deceptive link text
    const deceptiveLinkPattern = /<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
    let match;
    while((match = deceptiveLinkPattern.exec(htmlContent)) !== null){
        const href = match[1].toLowerCase();
        const text = match[2].toLowerCase();
        if (text.includes("click here") || text.includes("click this") || text.startsWith("http") && !text.includes(new URL(href).hostname)) {
            score += 5;
            issues.push("Contains deceptive or vague link text");
            break;
        }
    }
    return {
        score: Math.min(score, 100),
        issues
    };
}
async function checkDomainWarmup(domainId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data: domain } = await supabase.from("company_email_domains").select("created_at, emails_sent_today, total_emails_sent, warmup_completed").eq("id", domainId).single();
    if (!domain) {
        return {
            inWarmup: true,
            daysSinceCreation: 0,
            recommendedDailyLimit: 10,
            currentDaySent: 0,
            suggestions: [
                "Domain not found"
            ]
        };
    }
    const createdAt = new Date(domain.created_at);
    const now = new Date();
    const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    // Warm-up schedule (days -> max emails per day)
    // Gradual increase over 4-6 weeks for best deliverability
    const warmupSchedule = {
        0: 20,
        2: 50,
        4: 100,
        7: 200,
        14: 500,
        21: 1000,
        28: 2500,
        35: 5000,
        42: 10000
    };
    let recommendedLimit = 20;
    for (const [day, limit] of Object.entries(warmupSchedule)){
        if (daysSinceCreation >= parseInt(day)) {
            recommendedLimit = limit;
        }
    }
    const inWarmup = daysSinceCreation < 42 && !domain.warmup_completed;
    const suggestions = [];
    if (inWarmup) {
        suggestions.push(`Domain is in warm-up period (day ${daysSinceCreation}/42). Recommended daily limit: ${recommendedLimit} emails.`);
        if (domain.emails_sent_today >= recommendedLimit * 0.8) {
            suggestions.push("Approaching daily warm-up limit. Consider spreading sends across multiple days.");
        }
    }
    return {
        inWarmup,
        daysSinceCreation,
        recommendedDailyLimit: recommendedLimit,
        currentDaySent: domain.emails_sent_today || 0,
        suggestions
    };
}
async function verifyDomainStatus(domainId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data: domain } = await supabase.from("company_email_domains").select("status, is_suspended, sending_enabled, spf_verified, dkim_verified, dmarc_verified").eq("id", domainId).single();
    if (!domain) {
        return {
            canSend: false,
            issues: [
                "Domain not found"
            ],
            dnsStatus: {
                spf: false,
                dkim: false,
                dmarc: false
            }
        };
    }
    const issues = [];
    if (domain.status !== "verified") {
        issues.push(`Domain not verified (status: ${domain.status})`);
    }
    if (domain.is_suspended) {
        issues.push("Domain is suspended");
    }
    if (!domain.sending_enabled) {
        issues.push("Sending is disabled for this domain");
    }
    if (!domain.spf_verified) {
        issues.push("SPF record not verified - emails may fail authentication");
    }
    if (!domain.dkim_verified) {
        issues.push("DKIM not verified - emails may fail authentication");
    }
    if (!domain.dmarc_verified) {
        issues.push("DMARC not configured - reduces deliverability");
    }
    return {
        canSend: issues.length === 0,
        issues,
        dnsStatus: {
            spf: domain.spf_verified || false,
            dkim: domain.dkim_verified || false,
            dmarc: domain.dmarc_verified || false
        }
    };
}
async function runPreSendChecks(companyId, domainId, recipientEmails, subject, htmlContent, textContent, isMarketingEmail = false) {
    const warnings = [];
    const errors = [];
    const suggestions = [];
    // 1. Check domain status
    const domainStatus = await verifyDomainStatus(domainId);
    if (!domainStatus.canSend) {
        errors.push(...domainStatus.issues);
    } else {
        // Add warnings for missing DNS records
        if (!domainStatus.dnsStatus.dmarc) {
            warnings.push("DMARC not configured - consider adding for better deliverability");
        }
    }
    // 2. Check suppression list
    const suppressions = await checkSuppressionList(companyId, recipientEmails);
    const recipientStatus = [];
    let suppressedCount = 0;
    for (const [email, status] of suppressions){
        recipientStatus.push({
            email,
            suppressed: status.suppressed,
            reason: status.reason
        });
        if (status.suppressed) {
            suppressedCount++;
        }
    }
    if (suppressedCount > 0) {
        warnings.push(`${suppressedCount} recipient(s) on suppression list and will be skipped`);
    }
    if (suppressedCount === recipientEmails.length) {
        errors.push("All recipients are on suppression list - no emails will be sent");
    }
    // 3. Calculate spam score
    const hasUnsubscribe = htmlContent.includes("unsubscribe") || htmlContent.includes("List-Unsubscribe");
    const spamAnalysis = calculateSpamScore(subject, htmlContent, textContent, hasUnsubscribe || !isMarketingEmail);
    if (spamAnalysis.score >= 60) {
        errors.push(`High spam score (${spamAnalysis.score}/100) - email likely to be filtered`);
        errors.push(...spamAnalysis.issues);
    } else if (spamAnalysis.score >= 30) {
        warnings.push(`Moderate spam score (${spamAnalysis.score}/100) - consider improvements`);
        warnings.push(...spamAnalysis.issues);
    }
    // 4. Check warm-up status
    const warmupStatus = await checkDomainWarmup(domainId);
    if (warmupStatus.inWarmup) {
        suggestions.push(...warmupStatus.suggestions);
        const activeRecipients = recipientEmails.length - suppressedCount;
        const remainingCapacity = warmupStatus.recommendedDailyLimit - warmupStatus.currentDaySent;
        if (activeRecipients > remainingCapacity) {
            warnings.push(`Sending ${activeRecipients} emails exceeds warm-up limit (${remainingCapacity} remaining today). ` + `Consider sending over multiple days.`);
        }
    }
    // 5. Content-specific suggestions
    if (!htmlContent.includes("<!DOCTYPE") && !htmlContent.includes("<html")) {
        suggestions.push("Consider using proper HTML structure with DOCTYPE for better rendering");
    }
    if (textContent.length < 100) {
        suggestions.push("Consider adding more text content - very short emails may look suspicious");
    }
    if (isMarketingEmail && !hasUnsubscribe) {
        errors.push("Marketing emails MUST include an unsubscribe link (CAN-SPAM requirement)");
    }
    // Check for personalization
    if (!htmlContent.includes("{{") && !htmlContent.includes("{name}") && !subject.includes("{{")) {
        suggestions.push("Consider adding personalization (recipient name, company) for better engagement");
    }
    return {
        allowed: errors.length === 0,
        warnings,
        errors,
        suggestions,
        spamScore: spamAnalysis.score,
        recipientStatus
    };
}
async function addToSuppressionList(companyId, email, reason, details) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { error } = await supabase.from("email_suppressions").upsert({
        company_id: companyId,
        email: email.toLowerCase(),
        reason,
        details,
        created_at: new Date().toISOString()
    }, {
        onConflict: "company_id,email"
    });
    if (error) {
        console.error("Error adding to suppression list:", error);
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true
    };
}
async function addToGlobalBounceList(email, bounceType, bounceReason) {
    // Only track hard bounces globally
    if (bounceType !== "hard") {
        return {
            success: true
        };
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { error } = await supabase.from("email_global_bounces").upsert({
        email: email.toLowerCase(),
        bounce_type: bounceType,
        bounce_reason: bounceReason,
        bounce_count: 1,
        last_bounce_at: new Date().toISOString(),
        created_at: new Date().toISOString()
    }, {
        onConflict: "email"
    });
    if (error) {
        console.error("Error adding to global bounce list:", error);
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true
    };
}
async function removeFromSuppressionList(companyId, email) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { error } = await supabase.from("email_suppressions").delete().eq("company_id", companyId).eq("email", email.toLowerCase());
    if (error) {
        console.error("Error removing from suppression list:", error);
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true
    };
}
async function getSuppressionList(companyId, limit = 100, offset = 0) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { data, count, error } = await supabase.from("email_suppressions").select("email, reason, details, created_at", {
        count: "exact"
    }).eq("company_id", companyId).order("created_at", {
        ascending: false
    }).range(offset, offset + limit - 1);
    if (error) {
        console.error("Error fetching suppression list:", error);
        return {
            data: [],
            total: 0
        };
    }
    return {
        data: data || [],
        total: count || 0
    };
}
}),
"[project]/apps/web/src/lib/email/rate-limiter.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Email Rate Limiter
 *
 * Implements per-domain rate limiting for email sending to:
 * - Prevent spam/abuse
 * - Protect domain reputation
 * - Enforce plan-based limits
 * - Track daily/hourly email quotas
 */ /* __next_internal_action_entry_do_not_use__ [{"0020a1d15ae77f64582de2c225d74b37bc9b2a8829":"resetHourlyCounters","00465270d3bffebed3c4f6194507dd54b9dddb7ac3":"resetDailyCounters","403e591ad4fb452eef9adfd77242abc86364b2744d":"incrementEmailCounter","4061912faba61aa4780a560a519048767cb9ddc45c":"getCompanyActiveDomain","40eb9b5dc8fc719648117169eca131590fddc21657":"checkRateLimit"},"",""] */ __turbopack_context__.s([
    "checkRateLimit",
    ()=>checkRateLimit,
    "getCompanyActiveDomain",
    ()=>getCompanyActiveDomain,
    "incrementEmailCounter",
    ()=>incrementEmailCounter,
    "resetDailyCounters",
    ()=>resetDailyCounters,
    "resetHourlyCounters",
    ()=>resetHourlyCounters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
// =============================================================================
// RATE LIMIT CONFIGURATION
// =============================================================================
// Default rate limits (can be overridden per domain/plan)
const DEFAULT_LIMITS = {
    daily: 1000,
    hourly: 100,
    perMinute: 10
};
// In-memory cache for rate limit tracking (resets on server restart)
// For production, use Redis or database counters
const rateLimitCache = new Map();
async function getCompanyActiveDomain(companyId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    // Query for the active sending domain
    const { data: domain, error } = await supabase.from("company_email_domains").select(`
			id,
			domain_name,
			reply_to_email,
			daily_limit,
			hourly_limit,
			emails_sent_today,
			emails_sent_this_hour,
			is_platform_subdomain
		`).eq("company_id", companyId).eq("status", "verified").eq("sending_enabled", true).eq("is_suspended", false).order("is_platform_subdomain", {
        ascending: true
    }) // Custom domains first
    .order("created_at", {
        ascending: false
    }).maybeSingle();
    if (error) {
        console.error("Error fetching company email domain:", error);
        return null;
    }
    if (!domain) {
        return null;
    }
    return {
        domainId: domain.id,
        domain: domain.domain_name,
        replyToEmail: domain.reply_to_email,
        dailyLimit: domain.daily_limit || DEFAULT_LIMITS.daily,
        hourlyLimit: domain.hourly_limit || DEFAULT_LIMITS.hourly,
        emailsSentToday: domain.emails_sent_today || 0,
        emailsSentThisHour: domain.emails_sent_this_hour || 0
    };
}
async function checkRateLimit(domainId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    // Get current domain stats
    const { data: domain, error } = await supabase.from("company_email_domains").select(`
			daily_limit,
			hourly_limit,
			emails_sent_today,
			emails_sent_this_hour,
			is_suspended,
			daily_limit_reset_at,
			hourly_limit_reset_at
		`).eq("id", domainId).single();
    if (error || !domain) {
        return {
            allowed: false,
            reason: "Domain not found or error fetching limits"
        };
    }
    // Check if domain is suspended
    if (domain.is_suspended) {
        return {
            allowed: false,
            reason: "Domain is suspended due to reputation issues"
        };
    }
    const dailyLimit = domain.daily_limit || DEFAULT_LIMITS.daily;
    const hourlyLimit = domain.hourly_limit || DEFAULT_LIMITS.hourly;
    const emailsSentToday = domain.emails_sent_today || 0;
    const emailsSentThisHour = domain.emails_sent_this_hour || 0;
    // Check daily limit
    if (emailsSentToday >= dailyLimit) {
        return {
            allowed: false,
            reason: `Daily email limit reached (${dailyLimit} emails/day)`,
            remaining: 0,
            resetAt: domain.daily_limit_reset_at || getNextMidnightUTC()
        };
    }
    // Check hourly limit
    if (emailsSentThisHour >= hourlyLimit) {
        return {
            allowed: false,
            reason: `Hourly email limit reached (${hourlyLimit} emails/hour)`,
            remaining: 0,
            resetAt: domain.hourly_limit_reset_at || getNextHourUTC()
        };
    }
    // Check per-minute limit (in-memory)
    const minuteKey = `${domainId}:minute`;
    const minuteWindow = getMinuteWindow();
    const minuteCache = rateLimitCache.get(minuteKey);
    if (minuteCache && minuteCache.windowStart === minuteWindow) {
        if (minuteCache.count >= DEFAULT_LIMITS.perMinute) {
            return {
                allowed: false,
                reason: `Rate limit: Too many emails per minute (${DEFAULT_LIMITS.perMinute}/min)`,
                remaining: 0
            };
        }
    }
    return {
        allowed: true,
        remaining: Math.min(dailyLimit - emailsSentToday, hourlyLimit - emailsSentThisHour)
    };
}
async function incrementEmailCounter(domainId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    // Use a database function for atomic increment and validation
    // This prevents race conditions in high-concurrency scenarios
    const { data, error } = await supabase.rpc("increment_email_counter", {
        p_domain_id: domainId
    });
    if (error) {
        // If the RPC doesn't exist, fall back to manual increment
        if (error.code === "PGRST202" || error.message.includes("function")) {
            return await incrementEmailCounterFallback(domainId);
        }
        console.error("Error incrementing email counter:", error);
        return {
            allowed: false,
            reason: error.message
        };
    }
    // Handle RPC result
    if (data && typeof data === "object") {
        const result = data;
        return {
            allowed: result.allowed,
            reason: result.reason,
            remaining: result.remaining
        };
    }
    // Default: allowed if no error
    return {
        allowed: true
    };
}
// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
/**
 * Fallback increment method when RPC function doesn't exist
 */ async function incrementEmailCounterFallback(domainId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    // Get current counts
    const { data: domain, error: fetchError } = await supabase.from("company_email_domains").select("emails_sent_today, emails_sent_this_hour, daily_limit, hourly_limit").eq("id", domainId).single();
    if (fetchError || !domain) {
        return {
            allowed: false,
            reason: "Domain not found"
        };
    }
    const dailyLimit = domain.daily_limit || DEFAULT_LIMITS.daily;
    const hourlyLimit = domain.hourly_limit || DEFAULT_LIMITS.hourly;
    // Check limits before incrementing
    if ((domain.emails_sent_today || 0) >= dailyLimit) {
        return {
            allowed: false,
            reason: "Daily limit reached"
        };
    }
    if ((domain.emails_sent_this_hour || 0) >= hourlyLimit) {
        return {
            allowed: false,
            reason: "Hourly limit reached"
        };
    }
    // Increment counters
    const { error: updateError } = await supabase.from("company_email_domains").update({
        emails_sent_today: (domain.emails_sent_today || 0) + 1,
        emails_sent_this_hour: (domain.emails_sent_this_hour || 0) + 1
    }).eq("id", domainId);
    if (updateError) {
        console.error("Error updating email counters:", updateError);
        return {
            allowed: false,
            reason: updateError.message
        };
    }
    // Update in-memory per-minute counter
    const minuteKey = `${domainId}:minute`;
    const minuteWindow = getMinuteWindow();
    const minuteCache = rateLimitCache.get(minuteKey);
    if (minuteCache && minuteCache.windowStart === minuteWindow) {
        minuteCache.count++;
    } else {
        rateLimitCache.set(minuteKey, {
            count: 1,
            windowStart: minuteWindow
        });
    }
    return {
        allowed: true,
        remaining: Math.min(dailyLimit - (domain.emails_sent_today || 0) - 1, hourlyLimit - (domain.emails_sent_this_hour || 0) - 1)
    };
}
/**
 * Get the current minute window (for per-minute rate limiting)
 */ function getMinuteWindow() {
    return Math.floor(Date.now() / 60000);
}
/**
 * Get the next midnight UTC timestamp
 */ function getNextMidnightUTC() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    return tomorrow.toISOString();
}
/**
 * Get the next hour UTC timestamp
 */ function getNextHourUTC() {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setUTCHours(nextHour.getUTCHours() + 1, 0, 0, 0);
    return nextHour.toISOString();
}
async function resetDailyCounters() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { error } = await supabase.from("company_email_domains").update({
        emails_sent_today: 0,
        daily_limit_reset_at: getNextMidnightUTC()
    }).neq("id", ""); // Update all rows
    if (error) {
        console.error("Error resetting daily counters:", error);
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true
    };
}
async function resetHourlyCounters() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
    const { error } = await supabase.from("company_email_domains").update({
        emails_sent_this_hour: 0,
        hourly_limit_reset_at: getNextHourUTC()
    }).neq("id", ""); // Update all rows
    if (error) {
        console.error("Error resetting hourly counters:", error);
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getCompanyActiveDomain,
    checkRateLimit,
    incrementEmailCounter,
    resetDailyCounters,
    resetHourlyCounters
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCompanyActiveDomain, "4061912faba61aa4780a560a519048767cb9ddc45c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(checkRateLimit, "40eb9b5dc8fc719648117169eca131590fddc21657", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(incrementEmailCounter, "403e591ad4fb452eef9adfd77242abc86364b2744d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(resetDailyCounters, "00465270d3bffebed3c4f6194507dd54b9dddb7ac3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(resetHourlyCounters, "0020a1d15ae77f64582de2c225d74b37bc9b2a8829", null);
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/apps/web/src/lib/email/resend-client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Resend Client - Email Service Configuration
 *
 * Features:
 * - Singleton Resend client instance
 * - Environment-based configuration
 * - Type-safe email sending
 * - Development mode support (logs instead of sending)
 */ __turbopack_context__.s([
    "emailConfig",
    ()=>emailConfig,
    "isResendConfigured",
    ()=>isResendConfigured,
    "resend",
    ()=>resend
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$resend$40$6$2e$4$2e$2_$40$react$2d$email$2b$render$40$1$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_$2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/resend@6.4.2_@react-email+render@1.4.0_react-dom@19.2.0_react@19.2.0__react@19.2.0_/node_modules/resend/dist/index.mjs [app-rsc] (ecmascript)");
;
const requiredSiteUrl = ("TURBOPACK compile-time value", "http://localhost:3000");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const resend = process.env.RESEND_API_KEY ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$resend$40$6$2e$4$2e$2_$40$react$2d$email$2b$render$40$1$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_$2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Resend"](process.env.RESEND_API_KEY) : null;
const emailConfig = {
    from: `${process.env.RESEND_FROM_NAME || "Thorbis"} <${process.env.RESEND_FROM_EMAIL || "noreply@thorbis.com"}>`,
    // Enable production mode if RESEND_API_KEY is configured, even in development
    isDevelopment: !process.env.RESEND_API_KEY || ("TURBOPACK compile-time value", "development") === "development" && !process.env.RESEND_API_KEY,
    siteUrl: requiredSiteUrl,
    appUrl: ("TURBOPACK compile-time value", "http://localhost:3000") || requiredSiteUrl
};
function isResendConfigured() {
    if (!resend) {
        return false;
    }
    return true;
}
}),
"[project]/apps/web/src/lib/email/postmark-client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Postmark Email Client
 *
 * This module provides integration with Postmark as a fallback email provider.
 * Postmark is known for excellent deliverability and is used when Resend fails.
 *
 * Features:
 * - Email sending with automatic retry
 * - Domain/sender signature management
 * - Webhook signature verification
 * - Delivery status tracking
 *
 * Environment Variables Required:
 * - POSTMARK_API_KEY: Your Postmark server API token
 * - POSTMARK_WEBHOOK_SECRET: Secret for verifying webhook signatures (optional)
 *
 * @see https://postmarkapp.com/developer
 */ __turbopack_context__.s([
    "checkPostmarkHealth",
    ()=>checkPostmarkHealth,
    "createPostmarkDomain",
    ()=>createPostmarkDomain,
    "deletePostmarkDomain",
    ()=>deletePostmarkDomain,
    "getPostmarkDNSRecords",
    ()=>getPostmarkDNSRecords,
    "getPostmarkDomain",
    ()=>getPostmarkDomain,
    "getPostmarkServerInfo",
    ()=>getPostmarkServerInfo,
    "isPostmarkConfigured",
    ()=>isPostmarkConfigured,
    "listPostmarkDomains",
    ()=>listPostmarkDomains,
    "postmarkConfig",
    ()=>postmarkConfig,
    "resendPostmarkConfirmation",
    ()=>resendPostmarkConfirmation,
    "sendPostmarkBatchEmails",
    ()=>sendPostmarkBatchEmails,
    "sendPostmarkEmail",
    ()=>sendPostmarkEmail,
    "verifyPostmarkDKIM",
    ()=>verifyPostmarkDKIM,
    "verifyPostmarkReturnPath",
    ()=>verifyPostmarkReturnPath,
    "verifyPostmarkWebhook",
    ()=>verifyPostmarkWebhook
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
// =============================================================================
// CONFIGURATION
// =============================================================================
const POSTMARK_API_BASE = "https://api.postmarkapp.com";
const postmarkConfig = {
    apiKey: process.env.POSTMARK_API_KEY || "",
    webhookSecret: process.env.POSTMARK_WEBHOOK_SECRET || "",
    // Default "from" address for Postmark (must be verified sender signature)
    from: process.env.POSTMARK_FROM_EMAIL || process.env.EMAIL_FROM || "notifications@stratos.app",
    // Is Postmark configured and ready to use?
    isConfigured: !!process.env.POSTMARK_API_KEY,
    // Provider name for logging/monitoring
    providerName: "postmark"
};
// =============================================================================
// API REQUEST HELPER
// =============================================================================
/**
 * Makes authenticated requests to Postmark API
 *
 * @param path - API endpoint path (e.g., "/email")
 * @param init - Fetch request options
 * @returns Typed response with success/error handling
 *
 * @example
 * const result = await postmarkRequest<PostmarkSendResponse>("/email", {
 *   method: "POST",
 *   body: JSON.stringify(emailData),
 * });
 */ async function postmarkRequest(path, init) {
    // Check if Postmark is configured
    if (!postmarkConfig.apiKey) {
        return {
            success: false,
            error: "Postmark API key is not configured. Set POSTMARK_API_KEY environment variable."
        };
    }
    try {
        const response = await fetch(`${POSTMARK_API_BASE}${path}`, {
            ...init,
            headers: {
                // Postmark uses X-Postmark-Server-Token for authentication
                "X-Postmark-Server-Token": postmarkConfig.apiKey,
                "Content-Type": "application/json",
                Accept: "application/json",
                ...init.headers
            }
        });
        // Parse response body
        const body = await response.json().catch(()=>({}));
        // Handle non-OK responses
        if (!response.ok) {
            return {
                success: false,
                error: body.Message || body.message || response.statusText,
                errorCode: body.ErrorCode
            };
        }
        return {
            success: true,
            data: body
        };
    } catch (error) {
        // Network or parsing error
        return {
            success: false,
            error: error instanceof Error ? error.message : "Postmark request failed"
        };
    }
}
async function sendPostmarkEmail(options) {
    const { to, subject, html, text, from = postmarkConfig.from, replyTo, tag, trackOpens = true, trackLinks = true, metadata, messageStream = "outbound" } = options;
    // Postmark requires single recipient per request for /email endpoint
    // For multiple recipients, we'd use /email/batch
    const recipient = Array.isArray(to) ? to.join(", ") : to;
    const request = {
        From: from,
        To: recipient,
        Subject: subject,
        HtmlBody: html,
        TextBody: text,
        ReplyTo: replyTo,
        Tag: tag,
        TrackOpens: trackOpens,
        TrackLinks: trackLinks ? "HtmlAndText" : "None",
        MessageStream: messageStream,
        Metadata: metadata
    };
    // Log send attempt for monitoring
    console.log(`[Postmark] Sending email to ${recipient}, subject: "${subject}"`);
    const result = await postmarkRequest("/email", {
        method: "POST",
        body: JSON.stringify(request)
    });
    // Log result for monitoring
    if (result.success) {
        console.log(`[Postmark] Email sent successfully, MessageID: ${result.data.MessageID}`);
    } else {
        console.error(`[Postmark] Email send failed: ${result.error}`);
    }
    return result;
}
async function sendPostmarkBatchEmails(emails) {
    if (emails.length > 500) {
        return {
            success: false,
            error: "Postmark batch limit is 500 emails per request"
        };
    }
    const requests = emails.map((email)=>({
            From: email.from || postmarkConfig.from,
            To: email.to,
            Subject: email.subject,
            HtmlBody: email.html,
            TextBody: email.text,
            ReplyTo: email.replyTo,
            Tag: email.tag,
            TrackOpens: true,
            TrackLinks: "HtmlAndText",
            Metadata: email.metadata
        }));
    console.log(`[Postmark] Sending batch of ${emails.length} emails`);
    return postmarkRequest("/email/batch", {
        method: "POST",
        body: JSON.stringify(requests)
    });
}
async function listPostmarkDomains() {
    console.log("[Postmark] Listing sender signatures");
    return postmarkRequest("/senders", {
        method: "GET"
    });
}
async function getPostmarkDomain(signatureId) {
    console.log(`[Postmark] Getting sender signature ${signatureId}`);
    return postmarkRequest(`/senders/${signatureId}`, {
        method: "GET"
    });
}
async function createPostmarkDomain(options) {
    const { fromEmail, name, replyToEmail } = options;
    console.log(`[Postmark] Creating sender signature for ${fromEmail}`);
    return postmarkRequest("/senders", {
        method: "POST",
        body: JSON.stringify({
            FromEmail: fromEmail,
            Name: name,
            ReplyToEmail: replyToEmail || fromEmail
        })
    });
}
async function deletePostmarkDomain(signatureId) {
    console.log(`[Postmark] Deleting sender signature ${signatureId}`);
    return postmarkRequest(`/senders/${signatureId}`, {
        method: "DELETE"
    });
}
async function resendPostmarkConfirmation(signatureId) {
    console.log(`[Postmark] Resending confirmation for signature ${signatureId}`);
    return postmarkRequest(`/senders/${signatureId}/resend`, {
        method: "POST"
    });
}
async function verifyPostmarkDKIM(signatureId) {
    console.log(`[Postmark] Verifying DKIM for signature ${signatureId}`);
    return postmarkRequest(`/senders/${signatureId}/verifyDkim`, {
        method: "PUT"
    });
}
async function verifyPostmarkReturnPath(signatureId) {
    console.log(`[Postmark] Verifying Return-Path for signature ${signatureId}`);
    return postmarkRequest(`/senders/${signatureId}/verifyReturnPath`, {
        method: "PUT"
    });
}
async function getPostmarkServerInfo() {
    console.log("[Postmark] Getting server info");
    return postmarkRequest("/server", {
        method: "GET"
    });
}
function verifyPostmarkWebhook(options) {
    const { token } = options;
    // If no secret configured, accept all webhooks (not recommended for production)
    if (!postmarkConfig.webhookSecret) {
        console.warn("[Postmark] No webhook secret configured - accepting webhook without verification");
        return true;
    }
    // Verify the token matches our secret
    if (!token) {
        console.error("[Postmark] Webhook missing token");
        return false;
    }
    // Use timing-safe comparison to prevent timing attacks
    try {
        const expected = Buffer.from(postmarkConfig.webhookSecret);
        const received = Buffer.from(token);
        if (expected.length !== received.length) {
            return false;
        }
        return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["default"].timingSafeEqual(expected, received);
    } catch  {
        return false;
    }
}
async function checkPostmarkHealth() {
    const startTime = Date.now();
    try {
        const result = await getPostmarkServerInfo();
        const latencyMs = Date.now() - startTime;
        if (result.success) {
            console.log(`[Postmark] Health check passed in ${latencyMs}ms`);
            return {
                healthy: true,
                provider: "postmark",
                latencyMs
            };
        }
        console.error(`[Postmark] Health check failed: ${result.error}`);
        return {
            healthy: false,
            provider: "postmark",
            latencyMs,
            error: result.error
        };
    } catch (error) {
        const latencyMs = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`[Postmark] Health check error: ${errorMessage}`);
        return {
            healthy: false,
            provider: "postmark",
            latencyMs,
            error: errorMessage
        };
    }
}
function isPostmarkConfigured() {
    return postmarkConfig.isConfigured;
}
function getPostmarkDNSRecords(domain) {
    const records = [];
    // DKIM record
    if (domain.DKIMHost && domain.DKIMTextValue) {
        records.push({
            type: "TXT",
            name: domain.DKIMHost,
            value: domain.DKIMTextValue,
            verified: domain.DKIMVerified
        });
    }
    // Return-Path CNAME
    if (domain.ReturnPathDomain && domain.ReturnPathDomainCNAMEValue) {
        records.push({
            type: "CNAME",
            name: domain.ReturnPathDomain,
            value: domain.ReturnPathDomainCNAMEValue,
            verified: domain.ReturnPathDomainVerified
        });
    }
    return records;
}
}),
"[project]/apps/web/src/lib/email/token-encryption.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Token Encryption Service
 *
 * Encrypts and decrypts OAuth refresh tokens before storing in database.
 * Uses AES-256-GCM for authenticated encryption.
 *
 * Security Features:
 * - AES-256-GCM authenticated encryption
 * - Unique IV (initialization vector) per token
 * - Authentication tag prevents tampering
 * - Key derivation from environment variable
 *
 * Environment Variables Required:
 * - TOKEN_ENCRYPTION_KEY: 32-byte hex string (64 characters)
 *
 * Generate key with: openssl rand -hex 32
 *
 * CRITICAL: Never commit encryption key to version control!
 */ __turbopack_context__.s([
    "decryptToken",
    ()=>decryptToken,
    "decryptTokenSafe",
    ()=>decryptTokenSafe,
    "encryptToken",
    ()=>encryptToken,
    "encryptTokenSafe",
    ()=>encryptTokenSafe,
    "isEncryptionConfigured",
    ()=>isEncryptionConfigured,
    "migrateTokensToEncrypted",
    ()=>migrateTokensToEncrypted,
    "testEncryption",
    ()=>testEncryption
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
// =============================================================================
// CONSTANTS
// =============================================================================
/** Encryption algorithm (AES-256-GCM) */ const ALGORITHM = "aes-256-gcm";
/** IV length in bytes (12 bytes = 96 bits, recommended for GCM) */ const IV_LENGTH = 12;
/** Auth tag length in bytes (16 bytes = 128 bits) */ const AUTH_TAG_LENGTH = 16;
/** Encoding for encrypted output */ const ENCODING = "base64";
// =============================================================================
// KEY MANAGEMENT
// =============================================================================
/**
 * Get encryption key from environment
 * Throws error if key is missing or invalid
 */ function getEncryptionKey() {
    const keyHex = process.env.TOKEN_ENCRYPTION_KEY;
    if (!keyHex) {
        throw new Error("TOKEN_ENCRYPTION_KEY environment variable not set. Generate with: openssl rand -hex 32");
    }
    // Verify key is 32 bytes (64 hex characters)
    if (keyHex.length !== 64) {
        throw new Error("TOKEN_ENCRYPTION_KEY must be 32 bytes (64 hex characters). Generate with: openssl rand -hex 32");
    }
    // Convert hex string to buffer
    const key = Buffer.from(keyHex, "hex");
    if (key.length !== 32) {
        throw new Error("Invalid TOKEN_ENCRYPTION_KEY format");
    }
    return key;
}
function encryptToken(plaintext) {
    try {
        const key = getEncryptionKey();
        // Generate random IV (never reuse IVs!)
        const iv = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(IV_LENGTH);
        // Create cipher
        const cipher = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createCipheriv(ALGORITHM, key, iv);
        // Encrypt
        let ciphertext = cipher.update(plaintext, "utf8", ENCODING);
        ciphertext += cipher.final(ENCODING);
        // Get authentication tag
        const authTag = cipher.getAuthTag();
        // Return format: iv:authTag:ciphertext (all base64)
        return [
            iv.toString(ENCODING),
            authTag.toString(ENCODING),
            ciphertext
        ].join(":");
    } catch (error) {
        console.error("[Token Encryption] Encryption failed:", error);
        throw new Error("Failed to encrypt token");
    }
}
function decryptToken(encrypted) {
    try {
        const key = getEncryptionKey();
        // Parse encrypted format: iv:authTag:ciphertext
        const parts = encrypted.split(":");
        if (parts.length !== 3) {
            throw new Error("Invalid encrypted token format");
        }
        const [ivBase64, authTagBase64, ciphertext] = parts;
        // Convert from base64
        const iv = Buffer.from(ivBase64, ENCODING);
        const authTag = Buffer.from(authTagBase64, ENCODING);
        // Verify lengths
        if (iv.length !== IV_LENGTH) {
            throw new Error("Invalid IV length");
        }
        if (authTag.length !== AUTH_TAG_LENGTH) {
            throw new Error("Invalid auth tag length");
        }
        // Create decipher
        const decipher = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);
        // Decrypt
        let plaintext = decipher.update(ciphertext, ENCODING, "utf8");
        plaintext += decipher.final("utf8");
        return plaintext;
    } catch (error) {
        console.error("[Token Encryption] Decryption failed:", error);
        throw new Error("Failed to decrypt token");
    }
}
function isEncryptionConfigured() {
    try {
        getEncryptionKey();
        return true;
    } catch  {
        return false;
    }
}
function testEncryption() {
    try {
        const testToken = "test_token_" + __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(32).toString("hex");
        const encrypted = encryptToken(testToken);
        const decrypted = decryptToken(encrypted);
        return decrypted === testToken;
    } catch  {
        return false;
    }
}
async function migrateTokensToEncrypted() {
    // This would be implemented as a standalone migration script
    // NOT included here to prevent accidental execution
    console.warn("[Token Encryption] Migration must be run as standalone script");
    throw new Error("Use standalone migration script");
}
function encryptTokenSafe(plaintext) {
    if (!isEncryptionConfigured()) {
        console.warn("[Token Encryption] Encryption key not configured - storing plaintext (DEV ONLY)");
        return plaintext;
    }
    return encryptToken(plaintext);
}
function decryptTokenSafe(encrypted) {
    if (!isEncryptionConfigured()) {
        console.warn("[Token Encryption] Encryption key not configured - returning plaintext (DEV ONLY)");
        return encrypted;
    }
    // Check if token is already encrypted (contains colons)
    if (!encrypted.includes(":")) {
        console.warn("[Token Encryption] Token appears to be plaintext - returning as-is (MIGRATION MODE)");
        return encrypted;
    }
    try {
        return decryptToken(encrypted);
    } catch (error) {
        console.error("[Token Encryption] Decryption failed, returning plaintext:", error);
        return encrypted;
    }
}
}),
"[project]/apps/web/src/lib/email/gmail-rate-limiter.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Gmail API Rate Limiter
 *
 * Prevents Gmail API quota exhaustion and abuse by implementing rate limits
 * at multiple levels: per-user, per-company, and global.
 *
 * Gmail API Quotas (Google-imposed):
 * - 1 billion quota units per day (project-wide)
 * - 250 quota units/user/second
 * - messages.get = 5 units, messages.list = 5 units
 *
 * Our Limits:
 * - Per-user: 1 sync every 5 minutes (max 12 syncs/hour)
 * - Per-user: Max 100 messages per sync
 * - Global: Max 10 concurrent syncs
 * - API endpoints: 60 requests/minute per user
 *
 * Implementation:
 * - In-memory rate limiting with Map (resets on server restart)
 * - Redis for distributed rate limiting (optional, for multi-server)
 * - Automatic cleanup of stale entries
 *
 * @see https://developers.google.com/gmail/api/reference/quota
 */ // =============================================================================
// TYPES
// =============================================================================
__turbopack_context__.s([
    "RATE_LIMITS",
    ()=>RATE_LIMITS,
    "acquireSyncLock",
    ()=>acquireSyncLock,
    "checkApiRateLimit",
    ()=>checkApiRateLimit,
    "checkSyncRateLimit",
    ()=>checkSyncRateLimit,
    "getActiveSyncCount",
    ()=>getActiveSyncCount,
    "getRateLimiterStats",
    ()=>getRateLimiterStats,
    "releaseSyncLock",
    ()=>releaseSyncLock,
    "resetRateLimits",
    ()=>resetRateLimits,
    "startCleanup",
    ()=>startCleanup,
    "stopCleanup",
    ()=>stopCleanup,
    "validateSyncParams",
    ()=>validateSyncParams
]);
// =============================================================================
// CONSTANTS
// =============================================================================
/** Minimum time between syncs per user (5 minutes) */ const SYNC_COOLDOWN_MS = 5 * 60 * 1000;
/** Maximum messages per sync */ const MAX_MESSAGES_PER_SYNC = 100;
/** Maximum concurrent syncs globally */ const MAX_CONCURRENT_SYNCS = 10;
/** API rate limit: requests per window */ const API_RATE_LIMIT = 60;
/** API rate limit window (1 minute) */ const API_RATE_WINDOW_MS = 60 * 1000;
/** How long to keep rate limit entries in memory */ const RATE_LIMIT_CLEANUP_MS = 60 * 60 * 1000; // 1 hour
/** How long a sync lock is valid (30 minutes max) */ const SYNC_LOCK_TIMEOUT_MS = 30 * 60 * 1000;
// =============================================================================
// IN-MEMORY STORAGE
// =============================================================================
/** Per-user API rate limits */ const apiRateLimits = new Map();
/** Per-user last sync timestamps */ const lastSyncTimes = new Map();
/** Active sync locks */ const activeSyncLocks = new Set();
/** Cleanup interval */ let cleanupInterval = null;
function checkApiRateLimit(userId) {
    const now = Date.now();
    const entry = apiRateLimits.get(userId);
    if (!entry) {
        // First request - allow and record
        apiRateLimits.set(userId, {
            count: 1,
            firstRequest: now,
            lastRequest: now
        });
        return {
            allowed: true
        };
    }
    // Check if window has expired
    const windowAge = now - entry.firstRequest;
    if (windowAge > API_RATE_WINDOW_MS) {
        // Window expired - reset counter
        apiRateLimits.set(userId, {
            count: 1,
            firstRequest: now,
            lastRequest: now
        });
        return {
            allowed: true
        };
    }
    // Within window - check limit
    if (entry.count >= API_RATE_LIMIT) {
        // Rate limit exceeded
        const retryAfter = Math.ceil((entry.firstRequest + API_RATE_WINDOW_MS - now) / 1000);
        return {
            allowed: false,
            retryAfter
        };
    }
    // Increment counter
    entry.count++;
    entry.lastRequest = now;
    apiRateLimits.set(userId, entry);
    return {
        allowed: true
    };
}
function checkSyncRateLimit(teamMemberId) {
    const now = Date.now();
    // Check sync cooldown
    const lastSync = lastSyncTimes.get(teamMemberId);
    if (lastSync) {
        const timeSinceLastSync = now - lastSync;
        if (timeSinceLastSync < SYNC_COOLDOWN_MS) {
            const retryAfter = Math.ceil((SYNC_COOLDOWN_MS - timeSinceLastSync) / 1000);
            return {
                allowed: false,
                reason: "Sync cooldown active",
                retryAfter
            };
        }
    }
    // Check concurrent sync limit
    const activeCount = getActiveSyncCount();
    if (activeCount >= MAX_CONCURRENT_SYNCS) {
        return {
            allowed: false,
            reason: "Maximum concurrent syncs reached",
            retryAfter: 60
        };
    }
    // Check if user already has active sync
    const existingLock = Array.from(activeSyncLocks).find((lock)=>lock.teamMemberId === teamMemberId);
    if (existingLock) {
        // Check if lock is expired
        if (now > existingLock.expiresAt) {
            // Lock expired - remove it
            activeSyncLocks.delete(existingLock);
        } else {
            return {
                allowed: false,
                reason: "Sync already in progress",
                retryAfter: Math.ceil((existingLock.expiresAt - now) / 1000)
            };
        }
    }
    return {
        allowed: true
    };
}
function acquireSyncLock(teamMemberId) {
    const check = checkSyncRateLimit(teamMemberId);
    if (!check.allowed) {
        return null;
    }
    const now = Date.now();
    const lock = {
        teamMemberId,
        startedAt: now,
        expiresAt: now + SYNC_LOCK_TIMEOUT_MS
    };
    activeSyncLocks.add(lock);
    lastSyncTimes.set(teamMemberId, now);
    return lock;
}
function releaseSyncLock(lock) {
    activeSyncLocks.delete(lock);
}
function getActiveSyncCount() {
    // Clean up expired locks first
    const now = Date.now();
    for (const lock of activeSyncLocks){
        if (now > lock.expiresAt) {
            activeSyncLocks.delete(lock);
        }
    }
    return activeSyncLocks.size;
}
// =============================================================================
// CLEANUP
// =============================================================================
/**
 * Clean up stale rate limit entries
 */ function cleanup() {
    const now = Date.now();
    // Clean API rate limits
    for (const [userId, entry] of apiRateLimits.entries()){
        const age = now - entry.lastRequest;
        if (age > RATE_LIMIT_CLEANUP_MS) {
            apiRateLimits.delete(userId);
        }
    }
    // Clean last sync times
    for (const [userId, lastSync] of lastSyncTimes.entries()){
        const age = now - lastSync;
        if (age > RATE_LIMIT_CLEANUP_MS) {
            lastSyncTimes.delete(userId);
        }
    }
    // Clean expired sync locks
    for (const lock of activeSyncLocks){
        if (now > lock.expiresAt) {
            activeSyncLocks.delete(lock);
        }
    }
}
function startCleanup() {
    if (cleanupInterval) {
        return; // Already started
    }
    // Run cleanup every 5 minutes
    cleanupInterval = setInterval(cleanup, 5 * 60 * 1000);
    console.log("[Gmail Rate Limiter] Cleanup scheduled");
}
function stopCleanup() {
    if (cleanupInterval) {
        clearInterval(cleanupInterval);
        cleanupInterval = null;
    }
}
function validateSyncParams(maxResults) {
    if (maxResults <= 0) {
        return {
            valid: false,
            error: "maxResults must be positive"
        };
    }
    if (maxResults > MAX_MESSAGES_PER_SYNC) {
        return {
            valid: false,
            error: `maxResults cannot exceed ${MAX_MESSAGES_PER_SYNC}`
        };
    }
    return {
        valid: true
    };
}
function getRateLimiterStats() {
    return {
        apiRateLimits: apiRateLimits.size,
        lastSyncTimes: lastSyncTimes.size,
        activeSyncs: getActiveSyncCount(),
        maxConcurrentSyncs: MAX_CONCURRENT_SYNCS
    };
}
function resetRateLimits() {
    apiRateLimits.clear();
    lastSyncTimes.clear();
    activeSyncLocks.clear();
    console.warn("[Gmail Rate Limiter] All rate limits reset");
}
// =============================================================================
// INITIALIZATION
// =============================================================================
// Start cleanup on module load
startCleanup();
const RATE_LIMITS = {
    SYNC_COOLDOWN_MS,
    MAX_MESSAGES_PER_SYNC,
    MAX_CONCURRENT_SYNCS,
    API_RATE_LIMIT,
    API_RATE_WINDOW_MS
};
}),
"[project]/apps/web/src/lib/email/audit-logger.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Email Security Audit Logger
 *
 * Logs security-relevant events for compliance, investigation, and monitoring.
 * All logs are stored in the database with retention policies.
 *
 * Events Logged:
 * - Gmail connections/disconnections
 * - Token refresh failures
 * - Permission grants/revokes
 * - Sync errors
 * - Email access (optional, for compliance)
 *
 * Usage:
 * await logAuditEvent('gmail_connected', { teamMemberId, email });
 * await logAuditEvent('permission_granted', { grantedBy, grantedTo, category });
 *
 * Database Table: email_audit_log (to be created)
 *
 * @see /docs/email/SECURITY_AUDIT.md
 */ __turbopack_context__.s([
    "getAuditEventsForCompany",
    ()=>getAuditEventsForCompany,
    "getAuditEventsForUser",
    ()=>getAuditEventsForUser,
    "getCriticalSecurityEvents",
    ()=>getCriticalSecurityEvents,
    "logAuditEvent",
    ()=>logAuditEvent,
    "logGmailConnected",
    ()=>logGmailConnected,
    "logGmailDisconnected",
    ()=>logGmailDisconnected,
    "logPermissionGranted",
    ()=>logPermissionGranted,
    "logPermissionRevoked",
    ()=>logPermissionRevoked,
    "logRateLimitExceeded",
    ()=>logRateLimitExceeded,
    "logSyncFailed",
    ()=>logSyncFailed,
    "logTokenRefreshFailed",
    ()=>logTokenRefreshFailed,
    "logUnauthorizedAccess",
    ()=>logUnauthorizedAccess
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
;
async function logAuditEvent(eventType, metadata = {}, severity = "info", message) {
    try {
        // Generate default message if not provided
        const defaultMessage = generateDefaultMessage(eventType, metadata);
        // In production, store in database
        // For now, log to console with structured format
        const logEntry = {
            timestamp: new Date().toISOString(),
            eventType,
            severity,
            message: message || defaultMessage,
            metadata
        };
        // Console output with color coding
        const prefix = `[Email Audit]`;
        const severityEmoji = {
            info: "ℹ️",
            warning: "⚠️",
            error: "❌",
            critical: "🚨"
        }[severity];
        console.log(`${prefix} ${severityEmoji} [${severity.toUpperCase()}] ${logEntry.message}`, metadata);
        // Store in database
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
            if (supabase) {
                await supabase.from("email_audit_log").insert({
                    company_id: metadata.companyId || null,
                    event_type: eventType,
                    severity,
                    message: logEntry.message,
                    team_member_id: metadata.teamMemberId || null,
                    user_id: metadata.userId || null,
                    gmail_email: metadata.gmailEmail || null,
                    metadata,
                    ip_address: metadata.ipAddress || null,
                    user_agent: metadata.userAgent || null
                });
            }
        } catch (dbError) {
            // Don't fail the audit log if database write fails - console log is still captured
            console.error("[Email Audit] Failed to store in database:", dbError);
        }
        return {
            success: true
        };
    } catch (error) {
        console.error("[Email Audit] Failed to log event:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
/**
 * Generate default message for event type
 */ function generateDefaultMessage(eventType, metadata) {
    const name = metadata.userName || metadata.teamMemberId || "User";
    switch(eventType){
        case "gmail_connected":
            return `${name} connected Gmail account (${metadata.gmailEmail})`;
        case "gmail_disconnected":
            return `${name} disconnected Gmail account (${metadata.gmailEmail})`;
        case "gmail_token_refreshed":
            return `Gmail token refreshed for ${metadata.gmailEmail}`;
        case "gmail_token_refresh_failed":
            return `Failed to refresh Gmail token for ${metadata.gmailEmail}: ${metadata.error}`;
        case "gmail_token_revoked":
            return `Gmail token revoked for ${metadata.gmailEmail}`;
        case "permission_granted":
            return `${metadata.grantedBy} granted ${metadata.category} permissions to ${metadata.grantedTo}`;
        case "permission_revoked":
            return `${metadata.grantedBy} revoked ${metadata.category} permissions from ${metadata.grantedTo}`;
        case "permission_updated":
            return `${metadata.grantedBy} updated ${metadata.category} permissions for ${metadata.grantedTo}`;
        case "permission_check_failed":
            return `Permission check failed for ${name}: ${metadata.error}`;
        case "sync_started":
            return `${name} started inbox sync`;
        case "sync_completed":
            return `${name} completed inbox sync (${metadata.syncMessageCount} messages)`;
        case "sync_failed":
            return `Inbox sync failed for ${name}: ${metadata.error}`;
        case "sync_rate_limited":
            return `${name} sync rate limited (retry after ${metadata.retryAfter}s)`;
        case "email_accessed":
            return `${name} accessed email: ${metadata.emailSubject}`;
        case "email_sent":
            return `${name} sent email to ${metadata.toAddress}: ${metadata.emailSubject}`;
        case "email_assigned":
            return `${name} assigned email to ${metadata.grantedTo}`;
        case "unauthorized_access_attempt":
            return `Unauthorized access attempt by ${name}: ${metadata.error}`;
        case "permission_escalation_attempt":
            return `Permission escalation attempt by ${name}: ${metadata.error}`;
        case "invalid_oauth_state":
            return `Invalid OAuth state detected: ${metadata.error}`;
        case "token_cleanup_executed":
            return `Token cleanup executed: ${metadata.syncMessageCount} tokens removed`;
        case "rate_limit_exceeded":
            return `Rate limit exceeded for ${name} (${metadata.requestsPerMinute} req/min)`;
        default:
            return `${eventType} event for ${name}`;
    }
}
async function logGmailConnected(teamMemberId, userName, gmailEmail, companyId) {
    await logAuditEvent("gmail_connected", {
        teamMemberId,
        userName,
        gmailEmail,
        companyId
    }, "info");
}
async function logGmailDisconnected(teamMemberId, userName, gmailEmail, companyId) {
    await logAuditEvent("gmail_disconnected", {
        teamMemberId,
        userName,
        gmailEmail,
        companyId
    }, "info");
}
async function logTokenRefreshFailed(teamMemberId, gmailEmail, error) {
    await logAuditEvent("gmail_token_refresh_failed", {
        teamMemberId,
        gmailEmail,
        error
    }, "warning");
}
async function logPermissionGranted(grantedBy, grantedByName, grantedTo, grantedToName, category, companyId) {
    await logAuditEvent("permission_granted", {
        grantedBy,
        userName: grantedByName,
        grantedTo,
        category,
        companyId
    }, "info");
}
async function logPermissionRevoked(revokedBy, revokedByName, revokedFrom, revokedFromName, category, companyId) {
    await logAuditEvent("permission_revoked", {
        grantedBy: revokedBy,
        userName: revokedByName,
        grantedTo: revokedFrom,
        category,
        companyId
    }, "info");
}
async function logSyncFailed(teamMemberId, userName, gmailEmail, error) {
    await logAuditEvent("sync_failed", {
        teamMemberId,
        userName,
        gmailEmail,
        error
    }, "error");
}
async function logUnauthorizedAccess(userId, userName, resource, error) {
    await logAuditEvent("unauthorized_access_attempt", {
        userId,
        userName,
        error,
        communicationId: resource
    }, "warning");
}
async function logRateLimitExceeded(userId, userName, requestsPerMinute, retryAfter) {
    await logAuditEvent("rate_limit_exceeded", {
        userId,
        userName,
        requestsPerMinute,
        retryAfter
    }, "warning");
}
async function getAuditEventsForUser(teamMemberId, limit = 100) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        if (!supabase) return [];
        const { data, error } = await supabase.from("email_audit_log").select("id, event_type, severity, message, metadata, created_at").eq("team_member_id", teamMemberId).order("created_at", {
            ascending: false
        }).limit(limit);
        if (error) {
            console.error("[Email Audit] Failed to query events for user:", error);
            return [];
        }
        return (data || []).map((row)=>({
                id: row.id,
                eventType: row.event_type,
                severity: row.severity,
                message: row.message,
                metadata: row.metadata || {},
                createdAt: row.created_at
            }));
    } catch (error) {
        console.error("[Email Audit] Failed to query events for user:", error);
        return [];
    }
}
async function getAuditEventsForCompany(companyId, limit = 100) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        if (!supabase) return [];
        const { data, error } = await supabase.from("email_audit_log").select("id, event_type, severity, message, metadata, created_at").eq("company_id", companyId).order("created_at", {
            ascending: false
        }).limit(limit);
        if (error) {
            console.error("[Email Audit] Failed to query events for company:", error);
            return [];
        }
        return (data || []).map((row)=>({
                id: row.id,
                eventType: row.event_type,
                severity: row.severity,
                message: row.message,
                metadata: row.metadata || {},
                createdAt: row.created_at
            }));
    } catch (error) {
        console.error("[Email Audit] Failed to query events for company:", error);
        return [];
    }
}
async function getCriticalSecurityEvents(limit = 50) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        if (!supabase) return [];
        const { data, error } = await supabase.from("email_audit_log").select("id, event_type, severity, message, metadata, created_at").in("severity", [
            "error",
            "critical"
        ]).order("created_at", {
            ascending: false
        }).limit(limit);
        if (error) {
            console.error("[Email Audit] Failed to query critical events:", error);
            return [];
        }
        return (data || []).map((row)=>({
                id: row.id,
                eventType: row.event_type,
                severity: row.severity,
                message: row.message,
                metadata: row.metadata || {},
                createdAt: row.created_at
            }));
    } catch (error) {
        console.error("[Email Audit] Failed to query critical events:", error);
        return [];
    }
}
}),
"[project]/apps/web/src/lib/email/gmail-client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Gmail API Client (Company-Level & Per-User / Multi-Tenant)
 *
 * CRITICAL: Reply-to addresses ALWAYS use the platform subdomain (mail.thorbis.com),
 * even when sending from personal Gmail. This ensures replies go to the company's
 * centralized inbox, not the personal Gmail account.
 *
 * Example:
 * - FROM: john@gmail.com (personal Gmail)
 * - REPLY-TO: support@acme-plumbing.mail.thorbis.com (platform subdomain)
 *
 * See: /docs/email/REPLY_TO_ARCHITECTURE.md for full details
 *
 * This module provides Gmail API integration at two levels:
 * 1. Company-Level: One Gmail account for the entire company (sending only)
 * 2. Per-User: Individual team member Gmail accounts (inbox access + sending)
 *
 * Multi-Tenant Architecture:
 * - Each company can configure their own email provider
 * - Options: 'managed' (Resend/Postmark), 'gmail', or 'disabled'
 * - Company tokens stored in company_gmail_tokens table
 * - Per-user tokens stored in user_gmail_tokens table
 *
 * Key Features:
 * - Send emails via company's Gmail API
 * - Per-user inbox access and synchronization
 * - Automatic token refresh before expiration
 * - Token validation and error handling
 * - Integration with provider monitoring
 *
 * How It Works (Company-Level):
 * 1. Company admin connects Gmail via OAuth (grants gmail.send scope)
 * 2. Tokens stored in company_gmail_tokens table
 * 3. Before sending, we check/refresh tokens
 * 4. Use Gmail API to send email as company
 *
 * How It Works (Per-User):
 * 1. Team member connects their Gmail via OAuth (grants gmail.readonly + gmail.send)
 * 2. Tokens stored in user_gmail_tokens table
 * 3. Background sync job fetches inbox emails every 5-10 minutes
 * 4. Emails stored in communications table with mailbox_owner_id
 * 5. Role-based permissions control who can see which emails
 *
 * Rate Limits (Gmail API):
 * - Consumer accounts: 100 emails/day
 * - Google Workspace: 2,000 emails/day
 * - Per-minute limit: 100 messages
 *
 * Required Scopes:
 * - Company: https://www.googleapis.com/auth/gmail.send
 * - Per-User: https://www.googleapis.com/auth/gmail.readonly, gmail.send
 *
 * Environment Variables:
 * - GOOGLE_CLIENT_ID: OAuth client ID
 * - GOOGLE_CLIENT_SECRET: OAuth client secret
 *
 * @see https://developers.google.com/gmail/api/reference/rest
 */ /* __next_internal_action_entry_do_not_use__ [{"0077b5d695a6e4bd1ec48ffe0a639d5f7737bedd9a":"isGmailIntegrationEnabled","402e7af979456c6169a23490efd5611eedb77b7f8d":"getUserGmailTokens","40668734ac0715444771ef63df4ce2328f9e9144e1":"disconnectUserGmail","4093292a46f282093734eae84e8bdd79e58274f64f":"disconnectCompanyGmail","40b41f81fe9259fafce704bbd3935f68276fc4e2ca":"getCompanyEmailProvider","40f32c0cfb7780293a18cf77271d2770c0d61fe547":"getCompanyGmailTokens","6028c8a328b5f7616873329b038fce472d56c751d5":"checkCompanyGmailHealth","60666d082731fc0da1ea78000a7b22b3afbbc989b7":"sendCompanyGmailEmail","606b9ecbf77951fa1ec76cb2b2d919f43a5335a5f2":"syncUserInbox","607bbb8ec456319d6f212db11b0dad6d62ec6e5cdc":"refreshUserGmailToken","60afa4f94f55ff80042f81a76c673e75545d27872d":"refreshCompanyGmailToken","701eda529738b7cb8db9c89a5a499d69941ede094c":"setCompanyEmailProvider","70b8ccf02d177c82841b8a8e25abfece8615b480cf":"fetchUserInbox","78ce69226fb0c4303ba3e078a1534c86a000dbb744":"storeGmailMessage","7e684d0fcd64a86c227a3635ab611c4c140250b6fb":"storeUserGmailTokens","7fa9d4af88bd605b13c48fb4e2937bda4ef2ce0a20":"storeCompanyGmailTokens"},"",""] */ __turbopack_context__.s([
    "checkCompanyGmailHealth",
    ()=>checkCompanyGmailHealth,
    "disconnectCompanyGmail",
    ()=>disconnectCompanyGmail,
    "disconnectUserGmail",
    ()=>disconnectUserGmail,
    "fetchUserInbox",
    ()=>fetchUserInbox,
    "getCompanyEmailProvider",
    ()=>getCompanyEmailProvider,
    "getCompanyGmailTokens",
    ()=>getCompanyGmailTokens,
    "getUserGmailTokens",
    ()=>getUserGmailTokens,
    "isGmailIntegrationEnabled",
    ()=>isGmailIntegrationEnabled,
    "refreshCompanyGmailToken",
    ()=>refreshCompanyGmailToken,
    "refreshUserGmailToken",
    ()=>refreshUserGmailToken,
    "sendCompanyGmailEmail",
    ()=>sendCompanyGmailEmail,
    "setCompanyEmailProvider",
    ()=>setCompanyEmailProvider,
    "storeCompanyGmailTokens",
    ()=>storeCompanyGmailTokens,
    "storeGmailMessage",
    ()=>storeGmailMessage,
    "storeUserGmailTokens",
    ()=>storeUserGmailTokens,
    "syncUserInbox",
    ()=>syncUserInbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/token-encryption.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/gmail-rate-limiter.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$audit$2d$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/audit-logger.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
// =============================================================================
// CONSTANTS
// =============================================================================
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GMAIL_API_URL = "https://gmail.googleapis.com/gmail/v1";
const GMAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send";
const GMAIL_READONLY_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";
const GMAIL_MODIFY_SCOPE = "https://www.googleapis.com/auth/gmail.modify";
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;
async function getCompanyEmailProvider(companyId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data } = await supabase.from("companies").select("email_provider").eq("id", companyId).single();
        return data?.email_provider || "managed";
    } catch (error) {
        console.error("[Gmail] Error getting company email provider:", error);
        return "managed";
    }
}
async function setCompanyEmailProvider(companyId, provider, updatedByUserId) {
    try {
        // If switching to Gmail, verify tokens exist
        if (provider === "gmail") {
            const tokens = await getCompanyGmailTokens(companyId);
            if (!tokens || !tokens.isValid) {
                return {
                    success: false,
                    error: "Gmail is not connected. Please connect Gmail first."
                };
            }
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { error } = await supabase.from("companies").update({
            email_provider: provider,
            email_provider_updated_at: new Date().toISOString(),
            email_provider_updated_by: updatedByUserId || null
        }).eq("id", companyId);
        if (error) {
            return {
                success: false,
                error: error.message
            };
        }
        console.log(`[Gmail] Company ${companyId} email provider set to: ${provider}`);
        return {
            success: true
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
            success: false,
            error: message
        };
    }
}
async function getCompanyGmailTokens(companyId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data, error } = await supabase.from("company_gmail_tokens").select("*").eq("company_id", companyId).maybeSingle();
        if (error || !data) {
            return null;
        }
        const tokenData = {
            companyId: data.company_id,
            gmailEmail: data.gmail_email,
            gmailDisplayName: data.gmail_display_name,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            tokenExpiresAt: new Date(data.token_expires_at),
            isValid: data.is_valid,
            scopes: data.scopes || [
                GMAIL_SEND_SCOPE
            ],
            connectedBy: data.connected_by,
            connectedByName: data.connected_by_name
        };
        // Check if token needs refresh
        if (isTokenExpiringSoon(tokenData.tokenExpiresAt)) {
            console.log(`[Gmail] Token expiring soon for company ${companyId}, refreshing...`);
            const refreshed = await refreshCompanyGmailToken(companyId, tokenData.refreshToken);
            if (refreshed) {
                return refreshed;
            }
            console.warn("[Gmail] Token refresh failed, using existing token");
        }
        return tokenData;
    } catch (error) {
        console.error("[Gmail] Error getting company tokens:", error);
        return null;
    }
}
function isTokenExpiringSoon(expiresAt) {
    return expiresAt.getTime() - Date.now() < TOKEN_REFRESH_BUFFER_MS;
}
async function refreshCompanyGmailToken(companyId, refreshToken) {
    try {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        if (!clientId || !clientSecret) {
            console.error("[Gmail] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
            return null;
        }
        const response = await fetch(GOOGLE_TOKEN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: "refresh_token"
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Gmail] Token refresh failed: ${response.status}`, errorText);
            if (response.status === 400 || response.status === 401) {
                await markCompanyTokenInvalid(companyId, `Refresh failed: ${response.status}`);
            }
            return null;
        }
        const tokenResponse = await response.json();
        const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data, error } = await supabase.from("company_gmail_tokens").update({
            access_token: tokenResponse.access_token,
            token_expires_at: expiresAt.toISOString(),
            ...tokenResponse.refresh_token && {
                refresh_token: tokenResponse.refresh_token
            },
            is_valid: true,
            last_error: null
        }).eq("company_id", companyId).select("*").single();
        if (error || !data) {
            console.error("[Gmail] Failed to update refreshed token:", error?.message);
            return null;
        }
        console.log(`[Gmail] Token refreshed for company ${companyId}`);
        return {
            companyId: data.company_id,
            gmailEmail: data.gmail_email,
            gmailDisplayName: data.gmail_display_name,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            tokenExpiresAt: new Date(data.token_expires_at),
            isValid: data.is_valid,
            scopes: data.scopes || [
                GMAIL_SEND_SCOPE
            ],
            connectedBy: data.connected_by,
            connectedByName: data.connected_by_name
        };
    } catch (error) {
        console.error("[Gmail] Token refresh error:", error);
        return null;
    }
}
async function markCompanyTokenInvalid(companyId, reason) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        await supabase.from("company_gmail_tokens").update({
            is_valid: false,
            last_error: reason
        }).eq("company_id", companyId);
        console.log(`[Gmail] Marked token invalid for company ${companyId}: ${reason}`);
    } catch (error) {
        console.error("[Gmail] Failed to mark token invalid:", error);
    }
}
async function storeCompanyGmailTokens(companyId, gmailEmail, displayName, accessToken, refreshToken, expiresIn, scopes, connectedByUserId, connectedByName) {
    try {
        if (!scopes.includes(GMAIL_SEND_SCOPE)) {
            return {
                success: false,
                error: `Missing required scope: ${GMAIL_SEND_SCOPE}`
            };
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const expiresAt = new Date(Date.now() + expiresIn * 1000);
        const { error } = await supabase.from("company_gmail_tokens").upsert({
            company_id: companyId,
            gmail_email: gmailEmail,
            gmail_display_name: displayName,
            access_token: accessToken,
            refresh_token: refreshToken,
            token_expires_at: expiresAt.toISOString(),
            scopes,
            is_valid: true,
            last_error: null,
            connected_by: connectedByUserId || null,
            connected_by_name: connectedByName || null
        }, {
            onConflict: "company_id"
        });
        if (error) {
            console.error("[Gmail] Failed to store tokens:", error.message);
            return {
                success: false,
                error: error.message
            };
        }
        console.log(`[Gmail] Stored tokens for company ${companyId} (${gmailEmail})`);
        return {
            success: true
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
            success: false,
            error: message
        };
    }
}
async function disconnectCompanyGmail(companyId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Get token to revoke
        const { data: tokenData } = await supabase.from("company_gmail_tokens").select("access_token").eq("company_id", companyId).single();
        // Delete from database
        const { error } = await supabase.from("company_gmail_tokens").delete().eq("company_id", companyId);
        if (error) {
            return {
                success: false,
                error: error.message
            };
        }
        // Reset to managed provider
        await setCompanyEmailProvider(companyId, "managed");
        // Revoke token with Google (best effort)
        if (tokenData?.access_token) {
            try {
                await fetch(`https://oauth2.googleapis.com/revoke?token=${tokenData.access_token}`, {
                    method: "POST"
                });
            } catch  {
                console.warn("[Gmail] Token revocation request failed (non-critical)");
            }
        }
        console.log(`[Gmail] Disconnected Gmail for company ${companyId}`);
        return {
            success: true
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
            success: false,
            error: message
        };
    }
}
async function sendCompanyGmailEmail(companyId, emailData) {
    try {
        const tokens = await getCompanyGmailTokens(companyId);
        if (!tokens) {
            return {
                success: false,
                error: "Gmail not connected for this company"
            };
        }
        if (!tokens.isValid) {
            return {
                success: false,
                error: `Gmail connection invalid: ${tokens.gmailEmail}`
            };
        }
        const mimeMessage = buildMimeMessage({
            from: tokens.gmailDisplayName ? `${tokens.gmailDisplayName} <${tokens.gmailEmail}>` : tokens.gmailEmail,
            to: Array.isArray(emailData.to) ? emailData.to.join(", ") : emailData.to,
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text,
            replyTo: emailData.replyTo,
            cc: emailData.cc ? Array.isArray(emailData.cc) ? emailData.cc.join(", ") : emailData.cc : undefined,
            bcc: emailData.bcc ? Array.isArray(emailData.bcc) ? emailData.bcc.join(", ") : emailData.bcc : undefined,
            headers: emailData.headers
        });
        const encodedMessage = base64UrlEncode(mimeMessage);
        const response = await fetch(`${GMAIL_API_URL}/users/me/messages/send`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                raw: encodedMessage
            })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            const errorMessage = errorData.error?.message || `Gmail API error: ${response.status}`;
            console.error(`[Gmail] Send failed: ${errorMessage}`);
            if (response.status === 401) {
                await markCompanyTokenInvalid(companyId, "Authentication failed");
            }
            return {
                success: false,
                error: errorMessage
            };
        }
        const result = await response.json();
        // Update last used timestamp
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        await supabase.from("company_gmail_tokens").update({
            last_used_at: new Date().toISOString()
        }).eq("company_id", companyId);
        console.log(`[Gmail] Sent email for company ${companyId} (ID: ${result.id})`);
        return {
            success: true,
            messageId: result.id,
            threadId: result.threadId,
            labelIds: result.labelIds
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("[Gmail] Send error:", message);
        return {
            success: false,
            error: message
        };
    }
}
function buildMimeMessage(parts) {
    const boundary = `boundary_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const lines = [
        `From: ${parts.from}`,
        `To: ${parts.to}`,
        `Subject: =?UTF-8?B?${Buffer.from(parts.subject).toString("base64")}?=`,
        "MIME-Version: 1.0"
    ];
    if (parts.replyTo) lines.push(`Reply-To: ${parts.replyTo}`);
    if (parts.cc) lines.push(`Cc: ${parts.cc}`);
    if (parts.bcc) lines.push(`Bcc: ${parts.bcc}`);
    if (parts.headers) {
        for (const [key, value] of Object.entries(parts.headers)){
            lines.push(`${key}: ${value}`);
        }
    }
    lines.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
    lines.push("");
    const textContent = parts.text || extractTextFromHtml(parts.html);
    lines.push(`--${boundary}`);
    lines.push("Content-Type: text/plain; charset=UTF-8");
    lines.push("Content-Transfer-Encoding: base64");
    lines.push("");
    lines.push(Buffer.from(textContent).toString("base64"));
    lines.push(`--${boundary}`);
    lines.push("Content-Type: text/html; charset=UTF-8");
    lines.push("Content-Transfer-Encoding: base64");
    lines.push("");
    lines.push(Buffer.from(parts.html).toString("base64"));
    lines.push(`--${boundary}--`);
    return lines.join("\r\n");
}
function extractTextFromHtml(html) {
    return html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function base64UrlEncode(str) {
    return Buffer.from(str).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function checkCompanyGmailHealth(companyId, testApi = false) {
    try {
        const tokens = await getCompanyGmailTokens(companyId);
        if (!tokens) {
            return {
                connected: false,
                tokenValid: false
            };
        }
        const result = {
            connected: true,
            email: tokens.gmailEmail,
            displayName: tokens.gmailDisplayName,
            tokenValid: tokens.isValid,
            tokenExpiresAt: tokens.tokenExpiresAt,
            connectedBy: tokens.connectedByName,
            apiHealthy: undefined
        };
        if (testApi && tokens.isValid) {
            try {
                const response = await fetch(`${GMAIL_API_URL}/users/me/profile`, {
                    headers: {
                        Authorization: `Bearer ${tokens.accessToken}`
                    }
                });
                result.apiHealthy = response.ok;
            } catch  {
                result.apiHealthy = false;
            }
        }
        return result;
    } catch (error) {
        return {
            connected: false,
            tokenValid: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function getUserGmailTokens(teamMemberId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data, error } = await supabase.from("user_gmail_tokens").select("*, user_email_accounts!inner(email_address)").eq("team_member_id", teamMemberId).eq("sync_enabled", true).maybeSingle();
        if (error || !data) {
            return null;
        }
        // Decrypt tokens before using (CRITICAL SECURITY)
        const decryptedAccessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decryptToken"])(data.access_token);
        const decryptedRefreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decryptToken"])(data.refresh_token);
        const tokenData = {
            teamMemberId: data.team_member_id,
            emailAccountId: data.user_email_account_id,
            gmailEmail: data.user_email_accounts.email_address,
            accessToken: decryptedAccessToken,
            refreshToken: decryptedRefreshToken,
            tokenExpiresAt: new Date(data.token_expiry),
            scopes: data.scopes || [],
            syncEnabled: data.sync_enabled,
            lastSyncedAt: data.last_synced_at ? new Date(data.last_synced_at) : undefined
        };
        // Check if token needs refresh
        if (isTokenExpiringSoon(tokenData.tokenExpiresAt)) {
            console.log(`[Gmail] Token expiring soon for user ${teamMemberId}, refreshing...`);
            const refreshed = await refreshUserGmailToken(teamMemberId, tokenData.refreshToken);
            if (refreshed) {
                return refreshed;
            }
            console.warn("[Gmail] User token refresh failed, using existing token");
        }
        return tokenData;
    } catch (error) {
        console.error("[Gmail] Error getting user tokens:", error);
        return null;
    }
}
async function refreshUserGmailToken(teamMemberId, refreshToken) {
    try {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        if (!clientId || !clientSecret) {
            console.error("[Gmail] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
            return null;
        }
        const response = await fetch(GOOGLE_TOKEN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: "refresh_token"
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Gmail] User token refresh failed: ${response.status}`, errorText);
            // Log token refresh failure for audit trail
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$audit$2d$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logTokenRefreshFailed"])(teamMemberId, "Unknown", `Token refresh failed: ${response.status} - ${errorText}`);
            if (response.status === 400 || response.status === 401) {
                await markUserTokenInvalid(teamMemberId, `Refresh failed: ${response.status}`);
            }
            return null;
        }
        const tokenResponse = await response.json();
        const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);
        // Encrypt refreshed tokens before storing (CRITICAL SECURITY)
        const encryptedAccessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encryptToken"])(tokenResponse.access_token);
        const encryptedRefreshToken = tokenResponse.refresh_token ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encryptToken"])(tokenResponse.refresh_token) : undefined;
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const { data, error } = await supabase.from("user_gmail_tokens").update({
            access_token: encryptedAccessToken,
            token_expiry: expiresAt.toISOString(),
            ...encryptedRefreshToken && {
                refresh_token: encryptedRefreshToken
            }
        }).eq("team_member_id", teamMemberId).select("*, user_email_accounts!inner(email_address)").single();
        if (error || !data) {
            console.error("[Gmail] Failed to update refreshed user token:", error?.message);
            return null;
        }
        console.log(`[Gmail] User token refreshed for team member ${teamMemberId}`);
        // Decrypt tokens for return (already encrypted in DB)
        const decryptedAccessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decryptToken"])(data.access_token);
        const decryptedRefreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decryptToken"])(data.refresh_token);
        return {
            teamMemberId: data.team_member_id,
            emailAccountId: data.user_email_account_id,
            gmailEmail: data.user_email_accounts.email_address,
            accessToken: decryptedAccessToken,
            refreshToken: decryptedRefreshToken,
            tokenExpiresAt: new Date(data.token_expiry),
            scopes: data.scopes || [],
            syncEnabled: data.sync_enabled,
            lastSyncedAt: data.last_synced_at ? new Date(data.last_synced_at) : undefined
        };
    } catch (error) {
        console.error("[Gmail] User token refresh error:", error);
        return null;
    }
}
async function markUserTokenInvalid(teamMemberId, reason) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        await supabase.from("user_gmail_tokens").update({
            sync_enabled: false
        }).eq("team_member_id", teamMemberId);
        console.log(`[Gmail] Disabled sync for team member ${teamMemberId}: ${reason}`);
    } catch (error) {
        console.error("[Gmail] Failed to mark user token invalid:", error);
    }
}
async function storeUserGmailTokens(teamMemberId, emailAccountId, accessToken, refreshToken, expiresIn, scopes) {
    try {
        if (!scopes.includes(GMAIL_READONLY_SCOPE) && !scopes.includes(GMAIL_MODIFY_SCOPE)) {
            return {
                success: false,
                error: `Missing required scope: ${GMAIL_READONLY_SCOPE} or ${GMAIL_MODIFY_SCOPE}`
            };
        }
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const expiresAt = new Date(Date.now() + expiresIn * 1000);
        // Encrypt tokens before storing (CRITICAL SECURITY)
        const encryptedAccessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encryptToken"])(accessToken);
        const encryptedRefreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$token$2d$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encryptToken"])(refreshToken);
        const { error } = await supabase.from("user_gmail_tokens").upsert({
            team_member_id: teamMemberId,
            user_email_account_id: emailAccountId,
            access_token: encryptedAccessToken,
            refresh_token: encryptedRefreshToken,
            token_expiry: expiresAt.toISOString(),
            scopes,
            sync_enabled: true,
            last_synced_at: null
        }, {
            onConflict: "user_email_account_id"
        });
        if (error) {
            console.error("[Gmail] Failed to store user tokens:", error.message);
            return {
                success: false,
                error: error.message
            };
        }
        console.log(`[Gmail] Stored encrypted tokens for team member ${teamMemberId}`);
        return {
            success: true
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
            success: false,
            error: message
        };
    }
}
async function disconnectUserGmail(teamMemberId) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Get token to revoke
        const { data: tokenData } = await supabase.from("user_gmail_tokens").select("access_token").eq("team_member_id", teamMemberId).single();
        // Delete from database
        const { error } = await supabase.from("user_gmail_tokens").delete().eq("team_member_id", teamMemberId);
        if (error) {
            return {
                success: false,
                error: error.message
            };
        }
        // Revoke token with Google (best effort)
        if (tokenData?.access_token) {
            try {
                await fetch(`https://oauth2.googleapis.com/revoke?token=${tokenData.access_token}`, {
                    method: "POST"
                });
            } catch  {
                console.warn("[Gmail] User token revocation request failed (non-critical)");
            }
        }
        console.log(`[Gmail] Disconnected Gmail for team member ${teamMemberId}`);
        return {
            success: true
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
            success: false,
            error: message
        };
    }
}
async function fetchUserInbox(teamMemberId, maxResults = 50, pageToken) {
    try {
        const tokens = await getUserGmailTokens(teamMemberId);
        if (!tokens) {
            return {
                messages: [],
                error: "Gmail not connected for this user"
            };
        }
        // Build query parameters
        const params = new URLSearchParams({
            maxResults: maxResults.toString(),
            q: "in:inbox",
            ...pageToken && {
                pageToken
            }
        });
        // List messages
        const listResponse = await fetch(`${GMAIL_API_URL}/users/me/messages?${params}`, {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`
            }
        });
        if (!listResponse.ok) {
            const errorText = await listResponse.text();
            console.error(`[Gmail] Inbox fetch failed: ${listResponse.status}`, errorText);
            return {
                messages: [],
                error: `API error: ${listResponse.status}`
            };
        }
        const listData = await listResponse.json();
        const messageIds = listData.messages || [];
        const messages = [];
        // Fetch full message details for each message
        for (const msgRef of messageIds){
            const msgResponse = await fetch(`${GMAIL_API_URL}/users/me/messages/${msgRef.id}`, {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken}`
                }
            });
            if (msgResponse.ok) {
                const msgData = await msgResponse.json();
                messages.push(msgData);
            }
        }
        return {
            messages,
            nextPageToken: listData.nextPageToken
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("[Gmail] Inbox fetch error:", message);
        return {
            messages: [],
            error: message
        };
    }
}
/**
 * Parse Gmail message to structured format
 */ function parseGmailMessage(message) {
    const headers = message.payload.headers;
    const getHeader = (name)=>headers.find((h)=>h.name.toLowerCase() === name.toLowerCase())?.value || "";
    const from = getHeader("From");
    const to = getHeader("To").split(",").map((e)=>e.trim()).filter(Boolean);
    const cc = getHeader("Cc")?.split(",").map((e)=>e.trim()).filter(Boolean);
    const subject = getHeader("Subject");
    // Extract body content
    let textBody;
    let htmlBody;
    const extractBody = (part)=>{
        if (part.mimeType === "text/plain" && part.body?.data) {
            textBody = Buffer.from(part.body.data, "base64").toString("utf-8");
        } else if (part.mimeType === "text/html" && part.body?.data) {
            htmlBody = Buffer.from(part.body.data, "base64").toString("utf-8");
        }
        if (part.parts) {
            part.parts.forEach(extractBody);
        }
    };
    if (message.payload.parts) {
        message.payload.parts.forEach(extractBody);
    } else if (message.payload.body?.data) {
        // Single part message
        if (message.payload.mimeType === "text/plain") {
            textBody = Buffer.from(message.payload.body.data, "base64").toString("utf-8");
        } else if (message.payload.mimeType === "text/html") {
            htmlBody = Buffer.from(message.payload.body.data, "base64").toString("utf-8");
        }
    }
    return {
        gmailMessageId: message.id,
        gmailThreadId: message.threadId,
        from,
        to,
        cc,
        subject,
        textBody,
        htmlBody,
        receivedAt: new Date(parseInt(message.internalDate)),
        hasAttachments: message.payload.parts?.some((p)=>p.body.size > 0 && p.mimeType.startsWith("attachment/")) || false,
        labels: message.labelIds
    };
}
async function storeGmailMessage(companyId, teamMemberId, emailAccountId, parsedMessage) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Check if message already exists
        const { data: existing } = await supabase.from("communications").select("id").eq("gmail_message_id", parsedMessage.gmailMessageId).maybeSingle();
        if (existing) {
            return {
                success: true,
                communicationId: existing.id
            };
        }
        // Extract customer email from "from" field
        const fromEmail = parsedMessage.from.match(/<(.+?)>/)?.[1] || parsedMessage.from;
        // Try to find customer by email
        const { data: customer } = await supabase.from("customers").select("id").eq("company_id", companyId).eq("email", fromEmail).maybeSingle();
        // Insert communication
        const { data: communication, error } = await supabase.from("communications").insert({
            company_id: companyId,
            type: "email",
            direction: "inbound",
            status: "received",
            from_address: fromEmail,
            to_address: parsedMessage.to[0] || "",
            subject: parsedMessage.subject,
            body: parsedMessage.htmlBody || parsedMessage.textBody || "",
            customer_id: customer?.id || null,
            mailbox_owner_id: teamMemberId,
            email_account_id: emailAccountId,
            visibility_scope: "private",
            gmail_message_id: parsedMessage.gmailMessageId,
            gmail_thread_id: parsedMessage.gmailThreadId
        }).select("id").single();
        if (error) {
            console.error("[Gmail] Failed to store message:", error.message);
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true,
            communicationId: communication.id
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
            success: false,
            error: message
        };
    }
}
async function syncUserInbox(companyId, teamMemberId) {
    const startTime = new Date();
    let messagesFetched = 0;
    let messagesStored = 0;
    const errors = [];
    let syncLock = null;
    try {
        // Check rate limit before syncing (CRITICAL SAFEGUARD)
        const rateLimitCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkSyncRateLimit"])(teamMemberId);
        if (!rateLimitCheck.allowed) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$audit$2d$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAuditEvent"])("sync_rate_limited", {
                teamMemberId,
                retryAfter: rateLimitCheck.retryAfter
            }, "warning");
            return {
                success: false,
                messagesFetched: 0,
                messagesStored: 0,
                errors: [
                    rateLimitCheck.reason || "Rate limit exceeded"
                ],
                lastSyncedAt: startTime
            };
        }
        // Acquire sync lock to prevent concurrent syncs
        syncLock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["acquireSyncLock"])(teamMemberId);
        if (!syncLock) {
            return {
                success: false,
                messagesFetched: 0,
                messagesStored: 0,
                errors: [
                    "Could not acquire sync lock - another sync may be in progress"
                ],
                lastSyncedAt: startTime
            };
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$audit$2d$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAuditEvent"])("sync_started", {
            teamMemberId
        }, "info");
        const tokens = await getUserGmailTokens(teamMemberId);
        if (!tokens) {
            return {
                success: false,
                messagesFetched: 0,
                messagesStored: 0,
                errors: [
                    "Gmail not connected"
                ],
                lastSyncedAt: startTime
            };
        }
        // Fetch messages since last sync (or all if never synced)
        let pageToken;
        let hasMore = true;
        while(hasMore){
            const { messages, nextPageToken, error } = await fetchUserInbox(teamMemberId, 50, pageToken);
            if (error) {
                errors.push(error);
                break;
            }
            messagesFetched += messages.length;
            // Store each message
            for (const message of messages){
                const parsed = parseGmailMessage(message);
                const { success, error: storeError } = await storeGmailMessage(companyId, teamMemberId, tokens.emailAccountId, parsed);
                if (success) {
                    messagesStored++;
                } else if (storeError) {
                    errors.push(storeError);
                }
            }
            // Continue to next page if available
            pageToken = nextPageToken;
            hasMore = !!nextPageToken && messages.length > 0;
        }
        // Update last synced timestamp
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        await supabase.from("user_gmail_tokens").update({
            last_synced_at: startTime.toISOString()
        }).eq("team_member_id", teamMemberId);
        console.log(`[Gmail] Synced ${messagesStored}/${messagesFetched} messages for team member ${teamMemberId}`);
        // Log successful sync
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$audit$2d$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAuditEvent"])("sync_completed", {
            teamMemberId,
            syncMessageCount: messagesStored
        }, "info");
        return {
            success: errors.length === 0,
            messagesFetched,
            messagesStored,
            errors,
            lastSyncedAt: startTime
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        errors.push(message);
        // Log failed sync
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$audit$2d$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logAuditEvent"])("sync_failed", {
            teamMemberId,
            error: message
        }, "error");
        return {
            success: false,
            messagesFetched,
            messagesStored,
            errors,
            lastSyncedAt: startTime
        };
    } finally{
        // Always release sync lock (CRITICAL)
        if (syncLock) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["releaseSyncLock"])(syncLock);
        }
    }
}
async function isGmailIntegrationEnabled() {
    return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && ("TURBOPACK compile-time value", "http://localhost:3000"));
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getCompanyEmailProvider,
    setCompanyEmailProvider,
    getCompanyGmailTokens,
    refreshCompanyGmailToken,
    storeCompanyGmailTokens,
    disconnectCompanyGmail,
    sendCompanyGmailEmail,
    checkCompanyGmailHealth,
    getUserGmailTokens,
    refreshUserGmailToken,
    storeUserGmailTokens,
    disconnectUserGmail,
    fetchUserInbox,
    storeGmailMessage,
    syncUserInbox,
    isGmailIntegrationEnabled
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCompanyEmailProvider, "40b41f81fe9259fafce704bbd3935f68276fc4e2ca", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(setCompanyEmailProvider, "701eda529738b7cb8db9c89a5a499d69941ede094c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCompanyGmailTokens, "40f32c0cfb7780293a18cf77271d2770c0d61fe547", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(refreshCompanyGmailToken, "60afa4f94f55ff80042f81a76c673e75545d27872d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(storeCompanyGmailTokens, "7fa9d4af88bd605b13c48fb4e2937bda4ef2ce0a20", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(disconnectCompanyGmail, "4093292a46f282093734eae84e8bdd79e58274f64f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sendCompanyGmailEmail, "60666d082731fc0da1ea78000a7b22b3afbbc989b7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(checkCompanyGmailHealth, "6028c8a328b5f7616873329b038fce472d56c751d5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserGmailTokens, "402e7af979456c6169a23490efd5611eedb77b7f8d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(refreshUserGmailToken, "607bbb8ec456319d6f212db11b0dad6d62ec6e5cdc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(storeUserGmailTokens, "7e684d0fcd64a86c227a3635ab611c4c140250b6fb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(disconnectUserGmail, "40668734ac0715444771ef63df4ce2328f9e9144e1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchUserInbox, "70b8ccf02d177c82841b8a8e25abfece8615b480cf", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(storeGmailMessage, "78ce69226fb0c4303ba3e078a1534c86a000dbb744", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(syncUserInbox, "606b9ecbf77951fa1ec76cb2b2d919f43a5335a5f2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(isGmailIntegrationEnabled, "0077b5d695a6e4bd1ec48ffe0a639d5f7737bedd9a", null);
}),
"[project]/apps/web/src/lib/email/email-provider.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Email Provider Abstraction Layer
 *
 * This module provides a unified interface for sending emails through multiple
 * providers (Resend and Postmark) with automatic fallback support.
 *
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                    Email Provider Layer                         │
 * ├─────────────────────────────────────────────────────────────────┤
 * │  1. Try Primary Provider (Resend)                               │
 * │     ├─ Success → Return result, log to monitor                  │
 * │     └─ Failure → Try Fallback                                   │
 * │  2. Try Fallback Provider (Postmark)                            │
 * │     ├─ Success → Return result, log to monitor                  │
 * │     └─ Failure → Return error with both provider failures       │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Features:
 * - Automatic fallback when primary provider fails
 * - Health monitoring for both providers
 * - Unified response format
 * - Comprehensive logging for debugging
 * - Provider-agnostic interface for email operations
 *
 * Usage:
 * ```typescript
 * import { sendEmailWithFallback } from "@/lib/email/email-provider";
 *
 * const result = await sendEmailWithFallback({
 *   to: "user@example.com",
 *   subject: "Welcome!",
 *   html: "<h1>Hello</h1>",
 * });
 * ```
 */ __turbopack_context__.s([
    "checkAllProvidersHealth",
    ()=>checkAllProvidersHealth,
    "getBestAvailableProvider",
    ()=>getBestAvailableProvider,
    "getConfiguredProviders",
    ()=>getConfiguredProviders,
    "getProviderSetupInfo",
    ()=>getProviderSetupInfo,
    "isProviderConfigured",
    ()=>isProviderConfigured,
    "logProviderConfiguration",
    ()=>logProviderConfiguration,
    "providerConfig",
    ()=>providerConfig,
    "sendEmailWithFallback",
    ()=>sendEmailWithFallback
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/resend-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$postmark$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/postmark-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/gmail-client.ts [app-rsc] (ecmascript)");
;
;
;
const providerConfig = {
    /** Primary provider - tried first */ primary: "resend",
    /** Fallback provider - used if primary fails */ fallback: "postmark",
    /** Enable automatic fallback on failure */ enableFallback: true,
    /** Log all provider operations for monitoring */ enableLogging: true,
    /** Retry count before falling back (0 = immediate fallback) */ primaryRetries: 0
};
function isProviderConfigured(provider) {
    switch(provider){
        case "resend":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isResendConfigured"])();
        case "postmark":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$postmark$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isPostmarkConfigured"])();
        default:
            return false;
    }
}
function getConfiguredProviders() {
    const providers = [];
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isResendConfigured"])()) {
        providers.push("resend");
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$postmark$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isPostmarkConfigured"])()) {
        providers.push("postmark");
    }
    return providers;
}
function getBestAvailableProvider() {
    if (isProviderConfigured(providerConfig.primary)) {
        return providerConfig.primary;
    }
    if (providerConfig.enableFallback && isProviderConfigured(providerConfig.fallback)) {
        return providerConfig.fallback;
    }
    return null;
}
// =============================================================================
// EMAIL SENDING
// =============================================================================
/**
 * Send email via Resend
 *
 * @param options - Email options
 * @returns Send result
 */ async function sendViaResend(options) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isResendConfigured"])() || !__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resend"]) {
        return {
            success: false,
            error: "Resend is not configured"
        };
    }
    try {
        // Build tags array for Resend
        const tags = [];
        if (options.tags) {
            for (const [name, value] of Object.entries(options.tags)){
                tags.push({
                    name,
                    value
                });
            }
        }
        if (options.communicationId) {
            tags.push({
                name: "communication_id",
                value: options.communicationId
            });
        }
        // Send via Resend
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resend"].emails.send({
            from: options.from || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].from,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
            replyTo: options.replyTo,
            tags: tags.length > 0 ? tags : undefined
        });
        if (error) {
            return {
                success: false,
                error: error.message || "Resend send failed"
            };
        }
        return {
            success: true,
            messageId: data?.id
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Resend send failed"
        };
    }
}
/**
 * Send email via Postmark
 *
 * @param options - Email options
 * @returns Send result
 */ async function sendViaPostmark(options) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$postmark$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isPostmarkConfigured"])()) {
        return {
            success: false,
            error: "Postmark is not configured"
        };
    }
    try {
        // Convert tags to Postmark metadata format
        const metadata = {
            ...options.tags
        };
        if (options.communicationId) {
            metadata.communication_id = options.communicationId;
        }
        if (options.companyId) {
            metadata.company_id = options.companyId;
        }
        // Determine tag (Postmark only supports one tag per email)
        const tag = options.tags?.template || options.tags?.type || "transactional";
        // Send via Postmark
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$postmark$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendPostmarkEmail"])({
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
            from: options.from || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$postmark$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["postmarkConfig"].from,
            replyTo: options.replyTo,
            tag,
            metadata
        });
        if (!result.success) {
            return {
                success: false,
                error: result.error
            };
        }
        return {
            success: true,
            messageId: result.data.MessageID
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Postmark send failed"
        };
    }
}
/**
 * Send email via Gmail (company's connected Gmail account)
 *
 * @param companyId - Company ID with connected Gmail
 * @param options - Email options
 * @returns Send result
 */ async function sendViaGmail(companyId, options) {
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendCompanyGmailEmail"])(companyId, {
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
            replyTo: options.replyTo,
            cc: options.cc,
            bcc: options.bcc
        });
        if (!result.success) {
            return {
                success: false,
                error: result.error
            };
        }
        return {
            success: true,
            messageId: result.messageId
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Gmail send failed"
        };
    }
}
/**
 * Check if Gmail is available for a company
 *
 * @param companyId - Company ID to check
 * @returns Whether Gmail is available and configured
 */ async function isCompanyGmailAvailable(companyId) {
    try {
        // Check if Gmail integration is enabled globally
        if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isGmailIntegrationEnabled"])()) {
            return false;
        }
        const tokens = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyGmailTokens"])(companyId);
        return tokens !== null && tokens.isValid;
    } catch  {
        return false;
    }
}
async function sendEmailWithFallback(options) {
    const attempts = [];
    const recipient = Array.isArray(options.to) ? options.to.join(", ") : options.to;
    // Log the send attempt
    if (providerConfig.enableLogging) {
        console.log(`[EmailProvider] Sending email to ${recipient}, subject: "${options.subject}"`);
    }
    // ==========================================================================
    // COMPANY EMAIL PROVIDER CHECK (Multi-Tenant)
    // ==========================================================================
    // Each company (tenant) can choose:
    // - 'managed': Use our Resend/Postmark providers
    // - 'gmail': Use their connected Gmail account
    // - 'disabled': Email is disabled for this company
    if (options.companyId) {
        const companyPreference = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$gmail$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyEmailProvider"])(options.companyId);
        // Handle disabled - company has turned off email
        if (companyPreference === "disabled") {
            if (providerConfig.enableLogging) {
                console.log(`[EmailProvider] Company ${options.companyId} has email disabled`);
            }
            return {
                success: false,
                error: "Email is disabled for this company",
                usedFallback: false,
                attempts: []
            };
        }
        // Handle Gmail preference
        if (companyPreference === "gmail") {
            const gmailAvailable = await isCompanyGmailAvailable(options.companyId);
            if (gmailAvailable) {
                const startTime = Date.now();
                if (providerConfig.enableLogging) {
                    console.log(`[EmailProvider] Company ${options.companyId} prefers Gmail, attempting Gmail send...`);
                }
                const result = await sendViaGmail(options.companyId, options);
                const latencyMs = Date.now() - startTime;
                attempts.push({
                    provider: "gmail",
                    success: result.success,
                    messageId: result.messageId,
                    error: result.error,
                    latencyMs
                });
                if (result.success) {
                    if (providerConfig.enableLogging) {
                        console.log(`[EmailProvider] ✓ Gmail send succeeded in ${latencyMs}ms, messageId: ${result.messageId}`);
                    }
                    return {
                        success: true,
                        provider: "gmail",
                        messageId: result.messageId,
                        usedFallback: false,
                        attempts
                    };
                }
                // Gmail failed - fall through to managed providers
                if (providerConfig.enableLogging) {
                    console.warn(`[EmailProvider] ✗ Gmail send failed in ${latencyMs}ms: ${result.error}`);
                    console.log("[EmailProvider] Falling back to managed providers...");
                }
            } else {
                if (providerConfig.enableLogging) {
                    console.log(`[EmailProvider] Company ${options.companyId} prefers Gmail but no valid tokens, using managed providers`);
                }
            }
        }
    }
    // ==========================================================================
    // MANAGED PROVIDERS: Primary (Resend) → Fallback (Postmark)
    // ==========================================================================
    // ==========================================================================
    // ATTEMPT 1: Primary Provider (Resend)
    // ==========================================================================
    if (isProviderConfigured(providerConfig.primary)) {
        const startTime = Date.now();
        if (providerConfig.enableLogging) {
            console.log(`[EmailProvider] Trying primary provider: ${providerConfig.primary}`);
        }
        const result = providerConfig.primary === "resend" ? await sendViaResend(options) : await sendViaPostmark(options);
        const latencyMs = Date.now() - startTime;
        attempts.push({
            provider: providerConfig.primary,
            success: result.success,
            messageId: result.messageId,
            error: result.error,
            latencyMs
        });
        // If primary succeeded, return immediately
        if (result.success) {
            if (providerConfig.enableLogging) {
                console.log(`[EmailProvider] ✓ Primary provider succeeded in ${latencyMs}ms, messageId: ${result.messageId}`);
            }
            return {
                success: true,
                provider: providerConfig.primary,
                messageId: result.messageId,
                usedFallback: false,
                attempts
            };
        }
        // Primary failed
        if (providerConfig.enableLogging) {
            console.warn(`[EmailProvider] ✗ Primary provider failed in ${latencyMs}ms: ${result.error}`);
        }
    } else {
        if (providerConfig.enableLogging) {
            console.warn(`[EmailProvider] Primary provider (${providerConfig.primary}) not configured`);
        }
    }
    // ==========================================================================
    // ATTEMPT 2: Fallback Provider (Postmark)
    // ==========================================================================
    if (providerConfig.enableFallback && isProviderConfigured(providerConfig.fallback)) {
        const startTime = Date.now();
        if (providerConfig.enableLogging) {
            console.log(`[EmailProvider] Trying fallback provider: ${providerConfig.fallback}`);
        }
        const result = providerConfig.fallback === "postmark" ? await sendViaPostmark(options) : await sendViaResend(options);
        const latencyMs = Date.now() - startTime;
        attempts.push({
            provider: providerConfig.fallback,
            success: result.success,
            messageId: result.messageId,
            error: result.error,
            latencyMs
        });
        // If fallback succeeded, return
        if (result.success) {
            if (providerConfig.enableLogging) {
                console.log(`[EmailProvider] ✓ Fallback provider succeeded in ${latencyMs}ms, messageId: ${result.messageId}`);
            }
            return {
                success: true,
                provider: providerConfig.fallback,
                messageId: result.messageId,
                usedFallback: true,
                attempts
            };
        }
        // Fallback also failed
        if (providerConfig.enableLogging) {
            console.error(`[EmailProvider] ✗ Fallback provider also failed in ${latencyMs}ms: ${result.error}`);
        }
    } else if (providerConfig.enableFallback) {
        if (providerConfig.enableLogging) {
            console.warn(`[EmailProvider] Fallback provider (${providerConfig.fallback}) not configured`);
        }
    }
    // ==========================================================================
    // ALL PROVIDERS FAILED
    // ==========================================================================
    const errors = attempts.map((a)=>`${a.provider}: ${a.error}`).join("; ");
    if (providerConfig.enableLogging) {
        console.error(`[EmailProvider] ✗ All providers failed: ${errors}`);
    }
    return {
        success: false,
        error: `All email providers failed. ${errors}`,
        usedFallback: attempts.length > 1,
        attempts
    };
}
// =============================================================================
// HEALTH CHECKS
// =============================================================================
/**
 * Check health of Resend provider
 *
 * @returns Health status
 */ async function checkResendHealth() {
    const startTime = Date.now();
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isResendConfigured"])() || !__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resend"]) {
        return {
            provider: "resend",
            healthy: false,
            latencyMs: 0,
            lastChecked: new Date(),
            error: "Resend is not configured"
        };
    }
    try {
        // Resend doesn't have a dedicated health endpoint
        // We'll list domains as a health check (lightweight operation)
        const response = await fetch("https://api.resend.com/domains", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        const latencyMs = Date.now() - startTime;
        if (response.ok) {
            console.log(`[EmailProvider] Resend health check passed in ${latencyMs}ms`);
            return {
                provider: "resend",
                healthy: true,
                latencyMs,
                lastChecked: new Date()
            };
        }
        const error = await response.text();
        console.error(`[EmailProvider] Resend health check failed: ${error}`);
        return {
            provider: "resend",
            healthy: false,
            latencyMs,
            lastChecked: new Date(),
            error: `HTTP ${response.status}: ${error}`
        };
    } catch (error) {
        const latencyMs = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`[EmailProvider] Resend health check error: ${errorMessage}`);
        return {
            provider: "resend",
            healthy: false,
            latencyMs,
            lastChecked: new Date(),
            error: errorMessage
        };
    }
}
async function checkAllProvidersHealth() {
    console.log("[EmailProvider] Checking health of all providers...");
    const results = {
        primary: null,
        fallback: null,
        recommendedProvider: null
    };
    // Check primary (Resend)
    if (isProviderConfigured("resend")) {
        results.primary = await checkResendHealth();
    }
    // Check fallback (Postmark)
    if (isProviderConfigured("postmark")) {
        const postmarkHealth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$postmark$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkPostmarkHealth"])();
        results.fallback = {
            provider: "postmark",
            healthy: postmarkHealth.healthy,
            latencyMs: postmarkHealth.latencyMs,
            lastChecked: new Date(),
            error: postmarkHealth.error
        };
    }
    // Determine recommended provider based on health
    if (results.primary?.healthy) {
        results.recommendedProvider = "resend";
    } else if (results.fallback?.healthy) {
        results.recommendedProvider = "postmark";
    }
    console.log(`[EmailProvider] Health check complete. Primary: ${results.primary?.healthy ? "healthy" : "unhealthy"}, Fallback: ${results.fallback?.healthy ? "healthy" : "unhealthy"}, Recommended: ${results.recommendedProvider || "none"}`);
    return results;
}
function getProviderSetupInfo() {
    const primaryConfigured = isProviderConfigured(providerConfig.primary);
    const fallbackConfigured = isProviderConfigured(providerConfig.fallback);
    const configuredProviders = getConfiguredProviders();
    let status;
    if (primaryConfigured && fallbackConfigured) {
        status = "fully_configured";
    } else if (primaryConfigured) {
        status = "primary_only";
    } else if (fallbackConfigured) {
        status = "fallback_only";
    } else {
        status = "not_configured";
    }
    return {
        primaryConfigured,
        fallbackConfigured,
        fallbackEnabled: providerConfig.enableFallback,
        configuredProviders,
        status
    };
}
function logProviderConfiguration() {
    const info = getProviderSetupInfo();
    console.log("=".repeat(60));
    console.log("[EmailProvider] Configuration Summary");
    console.log("=".repeat(60));
    console.log(`Primary Provider: ${providerConfig.primary} (${info.primaryConfigured ? "✓ configured" : "✗ not configured"})`);
    console.log(`Fallback Provider: ${providerConfig.fallback} (${info.fallbackConfigured ? "✓ configured" : "✗ not configured"})`);
    console.log(`Fallback Enabled: ${info.fallbackEnabled ? "Yes" : "No"}`);
    console.log(`Status: ${info.status}`);
    console.log(`Configured Providers: ${info.configuredProviders.join(", ") || "none"}`);
    console.log("=".repeat(60));
}
}),
"[project]/apps/web/src/lib/email/provider-monitor.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00faa648440817b6eb791efa3ac3f6799aadfc9c34":"getProviderHealthDashboard","409b5721717e9390fdc0497fb59a8e8288ce7e42eb":"recordProviderEvent","40e70ff533f92b7e4f1d73f0ee5ca1fb5976d2a7b7":"checkProviderAlert","40f62a25c31b2883789933798d9582364eb2054b33":"cleanupOldEvents","600d8ab2284910a9b02d01729982f3d70069af430f":"getProviderStats","781dfc9673db486fe6aca86ae42d62ed8772859573":"recordFallbackTriggered","784c581679ff185a1c20eb49054e2d9cb65647d043":"recordSendSuccess","7856b878a603663b87a02cbc0e54b6231beee483cb":"recordSendFailure"},"",""] */ __turbopack_context__.s([
    "checkProviderAlert",
    ()=>checkProviderAlert,
    "cleanupOldEvents",
    ()=>cleanupOldEvents,
    "getProviderHealthDashboard",
    ()=>getProviderHealthDashboard,
    "getProviderStats",
    ()=>getProviderStats,
    "recordFallbackTriggered",
    ()=>recordFallbackTriggered,
    "recordProviderEvent",
    ()=>recordProviderEvent,
    "recordSendFailure",
    ()=>recordSendFailure,
    "recordSendSuccess",
    ()=>recordSendSuccess
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
/**
 * Email Provider Monitor
 *
 * This module tracks the health and performance of email providers (Resend & Postmark).
 * It records every email send attempt and provides analytics for monitoring.
 *
 * Features:
 * - Track success/failure rates per provider
 * - Record latency metrics
 * - Store detailed error information
 * - Provide real-time health dashboards
 * - Alert on provider degradation
 *
 * Database Tables Used:
 * - email_provider_events: Individual send attempts
 * - email_provider_health: Aggregated health metrics (updated periodically)
 *
 * Usage:
 * ```typescript
 * // Record a successful send
 * await recordProviderEvent({
 *   provider: "resend",
 *   eventType: "send_success",
 *   messageId: "abc123",
 *   latencyMs: 150,
 * });
 *
 * // Get provider health stats
 * const stats = await getProviderStats("resend", "24h");
 * ```
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function recordProviderEvent(event) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Log to console for immediate visibility
        const logPrefix = event.eventType.includes("success") ? "✓" : "✗";
        console.log(`[ProviderMonitor] ${logPrefix} ${event.provider}:${event.eventType}` + (event.latencyMs ? ` (${event.latencyMs}ms)` : "") + (event.error ? ` - ${event.error}` : ""));
        // Insert event into database
        const { error } = await supabase.from("email_provider_events").insert({
            provider: event.provider,
            event_type: event.eventType,
            message_id: event.messageId || null,
            latency_ms: event.latencyMs || null,
            error_message: event.error || null,
            metadata: event.metadata || null,
            company_id: event.companyId || null,
            domain_id: event.domainId || null,
            created_at: new Date().toISOString()
        });
        if (error) {
            // Don't fail the main operation if monitoring fails
            console.error(`[ProviderMonitor] Failed to record event: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true
        };
    } catch (error) {
        // Monitoring should never break the main flow
        console.error(`[ProviderMonitor] Error recording event: ${error instanceof Error ? error.message : "Unknown error"}`);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
async function recordSendSuccess(provider, messageId, latencyMs, options) {
    await recordProviderEvent({
        provider,
        eventType: "send_success",
        messageId,
        latencyMs,
        ...options
    });
}
async function recordSendFailure(provider, error, latencyMs, options) {
    await recordProviderEvent({
        provider,
        eventType: "send_failure",
        error,
        latencyMs,
        ...options
    });
}
async function recordFallbackTriggered(primaryProvider, fallbackProvider, primaryError, options) {
    await recordProviderEvent({
        provider: primaryProvider,
        eventType: "fallback_triggered",
        error: primaryError,
        metadata: {
            fallback_provider: fallbackProvider,
            ...options?.metadata
        },
        ...options
    });
}
async function getProviderStats(provider, period = "24h") {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        // Calculate start time based on period
        const now = new Date();
        const periodMs = {
            "1h": 60 * 60 * 1000,
            "24h": 24 * 60 * 60 * 1000,
            "7d": 7 * 24 * 60 * 60 * 1000,
            "30d": 30 * 24 * 60 * 60 * 1000
        };
        const startTime = new Date(now.getTime() - periodMs[period]).toISOString();
        // Query events for this provider and period
        const { data: events, error } = await supabase.from("email_provider_events").select("event_type, latency_ms, error_message, created_at").eq("provider", provider).gte("created_at", startTime).order("created_at", {
            ascending: false
        });
        if (error) {
            console.error(`[ProviderMonitor] Failed to get stats: ${error.message}`);
            return null;
        }
        if (!events || events.length === 0) {
            return {
                provider,
                period,
                totalEvents: 0,
                successCount: 0,
                failureCount: 0,
                successRate: 0,
                averageLatencyMs: 0,
                p95LatencyMs: 0,
                fallbackCount: 0,
                lastEventAt: null,
                lastError: null
            };
        }
        // Calculate statistics
        const sendEvents = events.filter((e)=>e.event_type === "send_success" || e.event_type === "send_failure");
        const successEvents = events.filter((e)=>e.event_type === "send_success");
        const failureEvents = events.filter((e)=>e.event_type === "send_failure");
        const fallbackEvents = events.filter((e)=>e.event_type === "fallback_triggered");
        // Calculate latency metrics
        const latencies = successEvents.map((e)=>e.latency_ms).filter((l)=>l !== null).sort((a, b)=>a - b);
        const avgLatency = latencies.length > 0 ? latencies.reduce((sum, l)=>sum + l, 0) / latencies.length : 0;
        const p95Index = Math.floor(latencies.length * 0.95);
        const p95Latency = latencies.length > 0 ? latencies[p95Index] || latencies[latencies.length - 1] : 0;
        // Find last error
        const lastFailure = failureEvents[0];
        return {
            provider,
            period,
            totalEvents: events.length,
            successCount: successEvents.length,
            failureCount: failureEvents.length,
            successRate: sendEvents.length > 0 ? successEvents.length / sendEvents.length * 100 : 0,
            averageLatencyMs: Math.round(avgLatency),
            p95LatencyMs: Math.round(p95Latency),
            fallbackCount: fallbackEvents.length,
            lastEventAt: events[0] ? new Date(events[0].created_at) : null,
            lastError: lastFailure?.error_message || null
        };
    } catch (error) {
        console.error(`[ProviderMonitor] Error getting stats: ${error instanceof Error ? error.message : "Unknown error"}`);
        return null;
    }
}
async function getProviderHealthDashboard() {
    console.log("[ProviderMonitor] Getting health dashboard data...");
    // Get stats for both providers
    const [resendStats, postmarkStats] = await Promise.all([
        getProviderStats("resend", "24h"),
        getProviderStats("postmark", "24h")
    ]);
    // Determine health status based on success rate
    const getStatus = (stats)=>{
        if (!stats || stats.totalEvents === 0) return "unknown";
        if (stats.successRate >= 99) return "healthy";
        if (stats.successRate >= 95) return "degraded";
        return "down";
    };
    // Calculate fallback rate
    const totalFallbacks = (resendStats?.fallbackCount || 0) + (postmarkStats?.fallbackCount || 0);
    const totalSends = (resendStats?.successCount || 0) + (resendStats?.failureCount || 0) + (postmarkStats?.successCount || 0) + (postmarkStats?.failureCount || 0);
    const fallbackRate = totalSends > 0 ? totalFallbacks / totalSends * 100 : 0;
    // Determine recommended action
    let recommendedAction;
    const resendStatus = getStatus(resendStats);
    const postmarkStatus = getStatus(postmarkStats);
    if (resendStatus === "down" && postmarkStatus === "down") {
        recommendedAction = "CRITICAL: Both providers are down. Check API keys and provider status.";
    } else if (resendStatus === "down") {
        recommendedAction = "Primary provider (Resend) is down. Traffic is using fallback.";
    } else if (fallbackRate > 10) {
        recommendedAction = "High fallback rate detected. Review primary provider health.";
    } else if (resendStatus === "degraded") {
        recommendedAction = "Primary provider showing degraded performance. Monitor closely.";
    }
    return {
        resend: {
            status: resendStatus,
            successRate24h: resendStats?.successRate || 0,
            avgLatencyMs: resendStats?.averageLatencyMs || 0,
            totalSent24h: resendStats?.successCount || 0,
            lastError: resendStats?.lastError || undefined,
            lastSuccessAt: resendStats?.lastEventAt || undefined
        },
        postmark: {
            status: postmarkStatus,
            successRate24h: postmarkStats?.successRate || 0,
            avgLatencyMs: postmarkStats?.averageLatencyMs || 0,
            totalSent24h: postmarkStats?.successCount || 0,
            lastError: postmarkStats?.lastError || undefined,
            lastSuccessAt: postmarkStats?.lastEventAt || undefined
        },
        overall: {
            primaryProvider: "resend",
            fallbackProvider: "postmark",
            fallbackRate24h: fallbackRate,
            recommendedAction
        }
    };
}
async function cleanupOldEvents(retentionDays = 30) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
        const { data, error } = await supabase.from("email_provider_events").delete().lt("created_at", cutoffDate.toISOString()).select("id");
        if (error) {
            console.error(`[ProviderMonitor] Cleanup failed: ${error.message}`);
            return {
                deleted: 0,
                error: error.message
            };
        }
        const deletedCount = data?.length || 0;
        console.log(`[ProviderMonitor] Cleaned up ${deletedCount} events older than ${retentionDays} days`);
        return {
            deleted: deletedCount
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`[ProviderMonitor] Cleanup error: ${errorMessage}`);
        return {
            deleted: 0,
            error: errorMessage
        };
    }
}
async function checkProviderAlert(provider) {
    const stats = await getProviderStats(provider, "1h");
    if (!stats) {
        return {
            shouldAlert: false,
            severity: "info"
        };
    }
    // No events in the last hour - might be expected during low traffic
    if (stats.totalEvents === 0) {
        return {
            shouldAlert: false,
            severity: "info"
        };
    }
    // Critical: Success rate below 90%
    if (stats.successRate < 90) {
        return {
            shouldAlert: true,
            severity: "critical",
            reason: `${provider} success rate is ${stats.successRate.toFixed(1)}% (below 90%)`
        };
    }
    // Warning: Success rate below 99%
    if (stats.successRate < 99) {
        return {
            shouldAlert: true,
            severity: "warning",
            reason: `${provider} success rate is ${stats.successRate.toFixed(1)}% (below 99%)`
        };
    }
    // Warning: High latency
    if (stats.averageLatencyMs > 5000) {
        return {
            shouldAlert: true,
            severity: "warning",
            reason: `${provider} average latency is ${stats.averageLatencyMs}ms (above 5s)`
        };
    }
    return {
        shouldAlert: false,
        severity: "info"
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    recordProviderEvent,
    recordSendSuccess,
    recordSendFailure,
    recordFallbackTriggered,
    getProviderStats,
    getProviderHealthDashboard,
    cleanupOldEvents,
    checkProviderAlert
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(recordProviderEvent, "409b5721717e9390fdc0497fb59a8e8288ce7e42eb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(recordSendSuccess, "784c581679ff185a1c20eb49054e2d9cb65647d043", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(recordSendFailure, "7856b878a603663b87a02cbc0e54b6231beee483cb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(recordFallbackTriggered, "781dfc9673db486fe6aca86ae42d62ed8772859573", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProviderStats, "600d8ab2284910a9b02d01729982f3d70069af430f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getProviderHealthDashboard, "00faa648440817b6eb791efa3ac3f6799aadfc9c34", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cleanupOldEvents, "40f62a25c31b2883789933798d9582364eb2054b33", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(checkProviderAlert, "40e70ff533f92b7e4f1d73f0ee5ca1fb5976d2a7b7", null);
}),
"[project]/apps/web/src/lib/email/email-sender.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/**
 * Email Sender - Type-safe email sending utilities
 *
 * CRITICAL RULE - Reply-To Addresses:
 * ====================================
 * Reply-to ALWAYS uses the company's platform subdomain (mail.thorbis.com),
 * regardless of which email provider or sending method is used.
 *
 * Examples:
 * - FROM: notifications@acme.mail.thorbis.com → REPLY-TO: support@acme.mail.thorbis.com
 * - FROM: notifications@acme-plumbing.com (custom) → REPLY-TO: support@acme.mail.thorbis.com
 * - FROM: john@gmail.com (personal) → REPLY-TO: support@acme.mail.thorbis.com
 *
 * See: /docs/email/REPLY_TO_ARCHITECTURE.md for full details
 *
 * Features:
 * - Type-safe email sending with validation
 * - Development mode logging
 * - Error handling and logging
 * - Email logging to database
 * - Retry logic for failed sends
 * - Per-company rate limiting
 * - Deliverability monitoring
 */ /* __next_internal_action_entry_do_not_use__ [{"4045fd66fd12d1ad15f17f3d1f2568de874cc6fe03":"sendEmail","60f3c70ab599823c9a6057a8809a3f49da02ad41ca":"handleComplaintWebhook","786c50dbddde0ade87252ff3556bd12a05815d3db8":"handleBounceWebhook"},"",""] */ __turbopack_context__.s([
    "handleBounceWebhook",
    ()=>handleBounceWebhook,
    "handleComplaintWebhook",
    ()=>handleComplaintWebhook,
    "sendEmail",
    ()=>sendEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$render$40$1$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$render$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@react-email+render@1.4.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/@react-email/render/dist/node/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.1.12/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$deliverability$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/deliverability-monitor.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/email-types.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$pre$2d$send$2d$checks$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/pre-send-checks.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/rate-limiter.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/resend-client.ts [app-rsc] (ecmascript)");
// =============================================================================
// MULTI-PROVIDER SUPPORT (Resend primary, Postmark fallback)
// =============================================================================
// Provider abstraction layer - handles automatic fallback when primary fails
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$provider$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/email-provider.ts [app-rsc] (ecmascript)");
// Provider monitoring - tracks success rates, latency for both providers
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/provider-monitor.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$render$40$1$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$render$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$render$40$1$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$render$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
;
async function sendEmail({ to, subject, template, templateType, replyTo, tags = [], companyId, communicationId, fromOverride, cc, bcc, attachments, isMarketingEmail = false, skipPreSendChecks = false, textContent = "", unsubscribeUrl, listId }) {
    let activeDomainId = null;
    let companyReplyTo = null;
    let activeDomain = null;
    try {
        // In development, log email instead of sending
        if (__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].isDevelopment) {
            return {
                success: true,
                data: {
                    id: `dev-mode-${Date.now()}`,
                    message: "Email logged in development mode (not actually sent)"
                }
            };
        }
        // Check if at least one email provider is configured
        // We support Resend (primary) and Postmark (fallback)
        const providerInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$provider$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProviderSetupInfo"])();
        if (providerInfo.status === "not_configured") {
            return {
                success: false,
                error: "Email service not configured. Please add RESEND_API_KEY or POSTMARK_API_KEY to environment variables."
            };
        }
        console.log(`[EmailSender] Providers available: ${providerInfo.configuredProviders.join(", ")} (status: ${providerInfo.status})`);
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        // Fetch company email domain to get reply-to configuration
        if (companyId) {
            activeDomain = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyActiveDomain"])(companyId);
            if (!activeDomain) {
                return {
                    success: false,
                    error: "No active email domain configured for this company. Please set up email in settings."
                };
            }
            activeDomainId = activeDomain.domainId;
            // Set reply-to from company's domain configuration
            // If not set, construct default using the company's domain (e.g., support@acme.mail.thorbis.com)
            // This ensures all replies go to the same branded subdomain as the FROM address
            if (activeDomain.replyToEmail) {
                companyReplyTo = activeDomain.replyToEmail;
            } else {
                // Default to support@{company-domain}
                companyReplyTo = `support@${activeDomain.domain}`;
            }
        }
        // Determine final reply-to address
        // Priority: 1) Explicit replyTo parameter, 2) Company's configured reply-to, 3) None
        const finalReplyTo = replyTo || companyReplyTo || undefined;
        // Validate email data (now with proper reply-to)
        const validatedData = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailSendSchema"].parse({
            to,
            subject,
            replyTo: finalReplyTo
        });
        // Normalize recipient list
        const recipientEmails = Array.isArray(validatedData.to) ? validatedData.to : [
            validatedData.to
        ];
        // Check rate limits and run pre-send checks if companyId is provided
        if (companyId && activeDomainId) {
            // Check rate limit before incrementing
            const rateLimitCheck = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkRateLimit"])(activeDomain.domainId);
            if (!rateLimitCheck.allowed) {
                return {
                    success: false,
                    error: rateLimitCheck.reason || "Rate limit exceeded"
                };
            }
            // Run pre-send deliverability checks (unless skipped for system emails)
            if (!skipPreSendChecks) {
                // Render template early to get HTML for spam check
                const preCheckHtml = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$render$40$1$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$render$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["render"])(template);
                const plainText = textContent || extractTextFromHtml(preCheckHtml);
                const preSendResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$pre$2d$send$2d$checks$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runPreSendChecks"])(companyId, activeDomain.domainId, recipientEmails, subject, preCheckHtml, plainText, isMarketingEmail);
                // Block if there are critical errors
                if (!preSendResult.allowed) {
                    return {
                        success: false,
                        error: `Deliverability check failed: ${preSendResult.errors.join("; ")}`,
                        data: {
                            spamScore: preSendResult.spamScore,
                            warnings: preSendResult.warnings,
                            suggestions: preSendResult.suggestions
                        }
                    };
                }
                // Filter out suppressed recipients
                const activeRecipients = recipientEmails.filter((email)=>{
                    const status = preSendResult.recipientStatus?.find((r)=>r.email.toLowerCase() === email.toLowerCase());
                    return !status?.suppressed;
                });
                if (activeRecipients.length === 0) {
                    return {
                        success: false,
                        error: "All recipients are on suppression list - no emails sent"
                    };
                }
                // Update validated data with filtered recipients
                if (activeRecipients.length < recipientEmails.length) {
                    validatedData.to = activeRecipients.length === 1 ? activeRecipients[0] : activeRecipients;
                }
                // Log warnings if any (but still send)
                if (preSendResult.warnings.length > 0) {
                    console.warn("[Email Deliverability Warnings]", preSendResult.warnings);
                }
            } else {
                // Even for system emails, check suppression list
                const suppressions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$pre$2d$send$2d$checks$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkSuppressionList"])(companyId, recipientEmails);
                const activeRecipients = recipientEmails.filter((email)=>{
                    const status = suppressions.get(email.toLowerCase());
                    return !status?.suppressed;
                });
                if (activeRecipients.length === 0) {
                    return {
                        success: false,
                        error: "All recipients are on suppression list"
                    };
                }
                if (activeRecipients.length < recipientEmails.length) {
                    validatedData.to = activeRecipients.length === 1 ? activeRecipients[0] : activeRecipients;
                }
            }
            // Increment the counter (this also validates limits atomically)
            const incrementResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$rate$2d$limiter$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["incrementEmailCounter"])(activeDomain.domainId);
            if (!incrementResult.allowed) {
                return {
                    success: false,
                    error: incrementResult.reason || "Rate limit exceeded"
                };
            }
        }
        // Determine from identity
        let fromAddress = fromOverride || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].from;
        if (companyId && supabase) {
            const override = await getCompanyEmailIdentity(supabase, companyId);
            if (override) {
                fromAddress = override;
            }
        }
        // Render template to HTML
        let html = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$react$2d$email$2b$render$40$1$2e$4$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$react$2d$email$2f$render$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["render"])(template);
        // Add email tracking if communicationId is provided
        if (communicationId) {
            const { addEmailTracking } = await __turbopack_context__.A("[project]/apps/web/src/lib/email/email-tracking.ts [app-rsc] (ecmascript, async loader)");
            html = addEmailTracking(html, communicationId);
        }
        const sendTags = [
            ...tags,
            {
                name: "template",
                value: templateType
            },
            {
                name: "environment",
                value: ("TURBOPACK compile-time value", "development") || "development"
            }
        ];
        if (communicationId) {
            sendTags.push({
                name: "communication_id",
                value: communicationId
            });
        }
        // Add company_id tag for webhook suppression list tracking
        if (companyId) {
            sendTags.push({
                name: "company_id",
                value: companyId
            });
        }
        // Build enhanced headers for better deliverability
        const emailHeaders = {
            // Precedence helps identify transactional vs marketing
            "X-Priority": "3",
            "X-Mailer": "Stratos Email System"
        };
        // Add List-Unsubscribe header for marketing emails (RFC 2369 compliance)
        if (isMarketingEmail && unsubscribeUrl) {
            emailHeaders["List-Unsubscribe"] = `<${unsubscribeUrl}>`;
            emailHeaders["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
        }
        // Add List-Id for mailing lists (helps with filtering)
        if (listId) {
            emailHeaders["List-Id"] = listId;
        }
        // Auto-Submitted header for transactional/automated emails
        if (!isMarketingEmail) {
            emailHeaders["Auto-Submitted"] = "auto-generated";
            emailHeaders["Precedence"] = "bulk"; // Prevents auto-replies
        }
        // =======================================================================
        // SEND EMAIL VIA PROVIDER LAYER (Resend → Postmark fallback)
        // =======================================================================
        // Convert tags to Record format for provider layer
        const tagsRecord = {};
        for (const tag of sendTags){
            tagsRecord[tag.name] = tag.value;
        }
        // Track timing for monitoring
        const sendStartTime = Date.now();
        // Send via provider layer (tries Resend first, then Postmark if Resend fails)
        const providerResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$provider$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmailWithFallback"])({
            to: validatedData.to,
            subject: validatedData.subject,
            html,
            text: textContent || extractTextFromHtml(html),
            from: fromAddress,
            replyTo: validatedData.replyTo,
            tags: tagsRecord,
            communicationId,
            companyId,
            cc,
            bcc,
            attachments
        });
        const sendLatencyMs = Date.now() - sendStartTime;
        // =======================================================================
        // RECORD PROVIDER MONITORING EVENTS
        // =======================================================================
        // Track success/failure for each provider attempt (for health dashboard)
        for (const attempt of providerResult.attempts){
            if (attempt.success) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordSendSuccess"])(attempt.provider, attempt.messageId || "", attempt.latencyMs, {
                    companyId,
                    domainId: activeDomainId || undefined,
                    metadata: {
                        template: templateType
                    }
                });
            } else {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordSendFailure"])(attempt.provider, attempt.error || "Unknown error", attempt.latencyMs, {
                    companyId,
                    domainId: activeDomainId || undefined,
                    metadata: {
                        template: templateType
                    }
                });
            }
        }
        // Record if fallback was triggered
        if (providerResult.usedFallback && providerResult.success) {
            const primaryAttempt = providerResult.attempts.find((a)=>a.provider === "resend");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$provider$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordFallbackTriggered"])("resend", "postmark", primaryAttempt?.error || "Primary failed", {
                companyId,
                metadata: {
                    template: templateType
                }
            });
            console.log(`[EmailSender] Used Postmark fallback after Resend failed: ${primaryAttempt?.error}`);
        }
        // =======================================================================
        // HANDLE RESULT
        // =======================================================================
        if (providerResult.success) {
            // SUCCESS: Email sent via one of the providers
            console.log(`[EmailSender] ✓ Email sent via ${providerResult.provider}${providerResult.usedFallback ? " (fallback)" : ""} in ${sendLatencyMs}ms`);
            // Log successful email to database
            try {
                if (supabase) {
                    await supabase.from("email_logs").insert({
                        to: Array.isArray(validatedData.to) ? validatedData.to.join(", ") : validatedData.to,
                        from: fromAddress,
                        subject: validatedData.subject,
                        html_body: html,
                        status: "sent",
                        message_id: providerResult.messageId,
                        company_id: companyId || null,
                        metadata: {
                            template: templateType,
                            tags: sendTags,
                            provider: providerResult.provider,
                            usedFallback: providerResult.usedFallback,
                            latencyMs: sendLatencyMs
                        },
                        sent_at: new Date().toISOString()
                    });
                }
            } catch (_logError) {
            // Don't throw - email was sent successfully even if logging failed
            }
            // Record delivered event for deliverability tracking
            // Note: This is an optimistic record; actual delivery confirmation comes via webhook
            if (activeDomainId) {
                try {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$deliverability$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordDeliveryEvent"])({
                        domainId: activeDomainId,
                        eventType: "delivered",
                        emailId: providerResult.messageId,
                        metadata: {
                            template: templateType,
                            provider: providerResult.provider
                        }
                    });
                } catch (_deliverabilityError) {
                // Don't fail the overall operation
                }
            }
            return {
                success: true,
                data: {
                    id: providerResult.messageId,
                    message: `Email sent successfully via ${providerResult.provider}${providerResult.usedFallback ? " (fallback)" : ""}`
                }
            };
        } else {
            // FAILURE: All providers failed
            console.error(`[EmailSender] ✗ All providers failed: ${providerResult.error}`);
            // Log failed email to database for retry queue
            try {
                if (supabase) {
                    await supabase.from("email_logs").insert({
                        to: Array.isArray(validatedData.to) ? validatedData.to.join(", ") : validatedData.to,
                        from: fromAddress,
                        subject: validatedData.subject,
                        html_body: html,
                        status: "failed",
                        error_message: providerResult.error || "All providers failed",
                        company_id: companyId || null,
                        metadata: {
                            template: templateType,
                            tags: sendTags,
                            attempts: providerResult.attempts,
                            latencyMs: sendLatencyMs
                        },
                        retry_count: 0,
                        max_retries: 3,
                        next_retry_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
                    });
                }
            } catch (_logError) {}
            // Record bounce event for deliverability tracking
            if (activeDomainId) {
                try {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$deliverability$2d$monitor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["recordDeliveryEvent"])({
                        domainId: activeDomainId,
                        eventType: "bounced",
                        metadata: {
                            error: providerResult.error,
                            template: templateType,
                            attempts: providerResult.attempts.length
                        }
                    });
                } catch (_deliverabilityError) {
                // Don't fail the overall operation
                }
            }
            return {
                success: false,
                error: providerResult.error || "Failed to send email (all providers failed)"
            };
        }
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: error.issues[0]?.message || "Invalid email data"
            };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send email"
        };
    }
}
/**
 * Send batch emails (up to 100 at once per Resend limits)
 *
 * Features:
 * - Validates batch size
 * - Sends multiple emails
 * - Returns results for each email
 */ async function sendBatchEmails(emails) {
    if (emails.length > 100) {
        return [
            {
                success: false,
                error: "Cannot send more than 100 emails at once"
            }
        ];
    }
    const results = await Promise.all(emails.map((email)=>sendEmail(email)));
    return results;
}
/**
 * Test email configuration by sending a test email
 *
 * Features:
 * - Validates Resend configuration
 * - Sends test email to specified address
 * - Returns detailed error information
 */ async function testEmailConfiguration(testEmailAddress) {
    try {
        const validatedEmail = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailSendSchema"].shape.to.parse(testEmailAddress);
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isResendConfigured"])()) {
            return {
                success: false,
                error: "Resend API key is not configured"
            };
        }
        // Create a simple test template
        const testTemplate = {
            type: "div",
            props: {
                children: [
                    {
                        type: "h1",
                        props: {
                            children: "Email Configuration Test"
                        }
                    },
                    {
                        type: "p",
                        props: {
                            children: "This is a test email from your Thorbis application."
                        }
                    },
                    {
                        type: "p",
                        props: {
                            children: "If you received this, your email configuration is working correctly!"
                        }
                    }
                ]
            }
        };
        return await sendEmail({
            to: validatedEmail,
            subject: "Test Email - Thorbis Email Configuration",
            template: testTemplate,
            templateType: "welcome",
            tags: [
                {
                    name: "type",
                    value: "test"
                }
            ]
        });
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$1$2e$12$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return {
                success: false,
                error: "Invalid email address"
            };
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : "Configuration test failed"
        };
    }
}
async function getCompanyEmailIdentity(supabase, companyId) {
    // Get company name first
    const { data: company } = await supabase.from("companies").select("name").eq("id", companyId).single();
    const companyName = company?.name || "Notification";
    // Check company_email_domains table for active sending domain
    // Prioritizes custom domains over platform subdomains
    const { data: domain } = await supabase.from("company_email_domains").select("domain_name, is_platform_subdomain").eq("company_id", companyId).eq("status", "verified").eq("sending_enabled", true).eq("is_suspended", false).order("is_platform_subdomain", {
        ascending: true
    }) // Custom domains first
    .order("created_at", {
        ascending: false
    }).maybeSingle();
    if (domain?.domain_name) {
        // domain_name contains the full domain (e.g., company.mail.stratos.app or mail.custom.com)
        return formatFromAddress(companyName, `notifications@${domain.domain_name}`);
    }
    // Fallback: Check old communication_email_settings (legacy)
    const { data: settings } = await supabase.from("communication_email_settings").select("smtp_from_email, smtp_from_name").eq("company_id", companyId).maybeSingle();
    if (settings?.smtp_from_email) {
        return formatFromAddress(settings.smtp_from_name, settings.smtp_from_email);
    }
    return null;
}
function formatFromAddress(name, email) {
    if (name?.trim()) {
        return `${name} <${email}>`;
    }
    return email;
}
/**
 * Extract plain text from HTML for spam scoring and multipart emails
 */ function extractTextFromHtml(html) {
    // Remove script and style tags with their content
    let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    // Replace block elements with newlines
    text = text.replace(/<\/(p|div|h[1-6]|li|br|tr)>/gi, "\n");
    text = text.replace(/<(br|hr)\s*\/?>/gi, "\n");
    // Remove all remaining HTML tags
    text = text.replace(/<[^>]+>/g, " ");
    // Decode common HTML entities
    text = text.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&mdash;/gi, "—").replace(/&ndash;/gi, "–");
    // Clean up whitespace
    text = text.replace(/\s+/g, " ").trim();
    text = text.replace(/\n\s*\n/g, "\n\n"); // Multiple newlines to double
    return text;
}
async function handleBounceWebhook(companyId, email, bounceType, bounceReason) {
    // Import here to avoid circular dependency
    const { addToSuppressionList, addToGlobalBounceList } = await __turbopack_context__.A("[project]/apps/web/src/lib/email/pre-send-checks.ts [app-rsc] (ecmascript, async loader)");
    // Add to company suppression list for hard bounces
    if (bounceType === "hard") {
        await addToSuppressionList(companyId, email, "bounce", bounceReason);
    }
    // Add to global bounce list (hard bounces only)
    await addToGlobalBounceList(email, bounceType, bounceReason);
}
async function handleComplaintWebhook(companyId, email) {
    const { addToSuppressionList } = await __turbopack_context__.A("[project]/apps/web/src/lib/email/pre-send-checks.ts [app-rsc] (ecmascript, async loader)");
    // Always suppress on complaint - user marked as spam
    await addToSuppressionList(companyId, email, "complaint", "User reported email as spam");
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    sendEmail,
    handleBounceWebhook,
    handleComplaintWebhook
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sendEmail, "4045fd66fd12d1ad15f17f3d1f2568de874cc6fe03", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(handleBounceWebhook, "786c50dbddde0ade87252ff3556bd12a05815d3db8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(handleComplaintWebhook, "60f3c70ab599823c9a6057a8809a3f49da02ad41ca", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/apps/web/src/lib/email/verification-emails.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/**
 * Verification Email Utilities
 * Helper functions for sending onboarding verification emails
 *
 * Features:
 * - Send "verification submitted" email
 * - Send "verification complete" email
 * - Type-safe email sending
 * - Company-specific context
 */ /* __next_internal_action_entry_do_not_use__ [{"70ee6c0c90bbedfc55720dd1229b710f17eaa1141d":"sendVerificationSubmittedEmail"},"",""] */ __turbopack_context__.s([
    "sendVerificationSubmittedEmail",
    ()=>sendVerificationSubmittedEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$onboarding$2f$verification$2d$complete$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/onboarding/verification-complete.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$onboarding$2f$verification$2d$submitted$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/emails/templates/onboarding/verification-submitted.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/email-sender.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/email-types.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/resend-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
async function sendVerificationSubmittedEmail(companyId, recipientEmail, context) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        // Fetch company details
        const { data: company, error: companyError } = await supabase.from("companies").select("name").eq("id", companyId).single();
        if (companyError || !company) {
            return {
                success: false,
                error: `Company not found: ${companyError?.message}`
            };
        }
        // Fetch user details (company owner)
        const { data: owner, error: ownerError } = await supabase.from("company_memberships").select("full_name").eq("company_id", companyId).eq("role", "owner").single();
        const contactName = owner?.full_name || "there";
        // Build dashboard URL
        const dashboardUrl = `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].appUrl}/dashboard`;
        // Create email template
        const emailTemplate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$onboarding$2f$verification$2d$submitted$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])({
            companyName: company.name,
            contactName,
            hasTollFreeNumbers: context.hasTollFreeNumbers,
            has10DLCNumbers: context.has10DLCNumbers,
            tollFreeCount: context.tollFreeCount || 0,
            dlcCount: context.dlcCount || 0,
            dashboardUrl
        });
        // Send email
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
            to: recipientEmail,
            subject: `Messaging Verification Submitted - ${company.name}`,
            template: emailTemplate,
            templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].VERIFICATION_SUBMITTED,
            companyId,
            tags: [
                {
                    name: "type",
                    value: "onboarding"
                },
                {
                    name: "verification",
                    value: "submitted"
                }
            ]
        });
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send verification submitted email"
        };
    }
}
/**
 * Send "Verification Complete" email
 * Called when toll-free verification is approved (or all verifications complete)
 *
 * @param companyId - Company UUID
 * @param recipientEmail - Email address to send to
 * @param verificationTypes - Array of verification types that completed (["toll-free", "10dlc"])
 */ async function sendVerificationCompleteEmail(companyId, recipientEmail, verificationTypes) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        // Fetch company details
        const { data: company, error: companyError } = await supabase.from("companies").select("name").eq("id", companyId).single();
        if (companyError || !company) {
            return {
                success: false,
                error: `Company not found: ${companyError?.message}`
            };
        }
        // Fetch user details (company owner)
        const { data: owner } = await supabase.from("company_memberships").select("full_name").eq("company_id", companyId).eq("role", "owner").single();
        const contactName = owner?.full_name || "there";
        // Build URLs
        const dashboardUrl = `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].appUrl}/dashboard`;
        const messagingUrl = `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$resend$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["emailConfig"].appUrl}/dashboard/communications/messaging`;
        // Create email template
        const emailTemplate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$emails$2f$templates$2f$onboarding$2f$verification$2d$complete$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])({
            companyName: company.name,
            contactName,
            verificationTypes,
            dashboardUrl,
            messagingUrl
        });
        // Send email
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$sender$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendEmail"])({
            to: recipientEmail,
            subject: `🎉 Messaging Approved - ${company.name}`,
            template: emailTemplate,
            templateType: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$email$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EmailTemplate"].VERIFICATION_COMPLETE,
            companyId,
            tags: [
                {
                    name: "type",
                    value: "onboarding"
                },
                {
                    name: "verification",
                    value: "complete"
                }
            ]
        });
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send verification complete email"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    sendVerificationSubmittedEmail
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sendVerificationSubmittedEmail, "70ee6c0c90bbedfc55720dd1229b710f17eaa1141d", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/apps/web/src/lib/telnyx/account-verification.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Telnyx Account Verification
 *
 * Utilities for checking Telnyx account verification status.
 * Verification levels:
 * - Level 1: Basic identity verification (1-2 business days)
 * - Level 2: Business verification required for 10DLC (2-5 business days)
 */ __turbopack_context__.s([
    "checkAccountVerificationStatus",
    ()=>checkAccountVerificationStatus,
    "getNextSteps",
    ()=>getNextSteps,
    "getVerificationRequirements",
    ()=>getVerificationRequirements
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/api.ts [app-rsc] (ecmascript)");
;
async function checkAccountVerificationStatus() {
    try {
        // Try to get account verification info
        // Note: Telnyx may not have a direct endpoint for this
        const accountResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxRequest"])("/account/verifications", {
            method: "GET"
        });
        if (accountResult.success && accountResult.data) {
            const { verifications } = accountResult.data;
            const level1Complete = verifications.identity_verification?.status === "verified";
            const level2Complete = verifications.business_verification?.status === "verified";
            const requirementsRemaining = [];
            let estimatedDays = 0;
            if (!level1Complete) {
                requirementsRemaining.push("Complete Level 1 verification (ID, payment method, contact info)");
                estimatedDays = Math.max(estimatedDays, 2);
            }
            if (!level2Complete) {
                requirementsRemaining.push("Complete Level 2 verification (EIN letter, business license, proof of address)");
                estimatedDays = Math.max(estimatedDays, 5);
            }
            const currentLevel = level2Complete ? "level_2" : level1Complete ? "level_1" : "none";
            return {
                success: true,
                data: {
                    currentLevel,
                    isLevel1Complete: level1Complete,
                    isLevel2Complete: level2Complete,
                    canCreate10DLC: level2Complete,
                    requirementsRemaining,
                    estimatedCompletionDays: requirementsRemaining.length > 0 ? estimatedDays : undefined
                }
            };
        }
        // If direct endpoint doesn't exist, try to infer from 10DLC brand creation
        // This will fail with 403 if not verified
        const brandTestResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["telnyxRequest"])("/10dlc/brand", {
            method: "GET"
        });
        if (brandTestResult.success) {
            // If we can access brands, Level 2 is complete
            return {
                success: true,
                data: {
                    currentLevel: "level_2",
                    isLevel1Complete: true,
                    isLevel2Complete: true,
                    canCreate10DLC: true,
                    requirementsRemaining: []
                }
            };
        }
        // Check the error to determine verification level
        if (brandTestResult.error?.includes("403") || brandTestResult.error?.includes("verification")) {
            // 403 means account exists but not verified for 10DLC
            return {
                success: true,
                data: {
                    currentLevel: "level_1",
                    isLevel1Complete: true,
                    isLevel2Complete: false,
                    canCreate10DLC: false,
                    requirementsRemaining: [
                        "Complete Level 2 verification (EIN letter, business license, proof of address)"
                    ],
                    estimatedCompletionDays: 5
                }
            };
        }
        // Unknown state - assume no verification
        return {
            success: true,
            data: {
                currentLevel: "none",
                isLevel1Complete: false,
                isLevel2Complete: false,
                canCreate10DLC: false,
                requirementsRemaining: [
                    "Complete Level 1 verification (ID, payment method, contact info)",
                    "Complete Level 2 verification (EIN letter, business license, proof of address)"
                ],
                estimatedCompletionDays: 7
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to check verification status"
        };
    }
}
function getVerificationRequirements(currentLevel) {
    return {
        level1: {
            required: currentLevel === "none",
            items: [
                "Valid government-issued ID (Driver's License, Passport, etc.)",
                "Payment method (Credit card or bank account)",
                "Phone number verification",
                "Email verification",
                "Business address confirmation"
            ]
        },
        level2: {
            required: currentLevel === "none" || currentLevel === "level_1",
            items: [
                "IRS EIN Confirmation Letter (CP 575 or 147C)",
                "Business License or Articles of Incorporation",
                "Proof of Business Address (Utility bill, lease agreement)",
                "Government-issued ID for business representative",
                "Tax documents (W-9 or recent tax return)"
            ]
        }
    };
}
function getNextSteps(status) {
    const steps = [];
    if (!status.isLevel1Complete) {
        steps.push({
            step: "Complete Level 1 Verification",
            action: "Visit Telnyx Portal → Account → Public Profile and complete identity verification",
            url: "https://portal.telnyx.com/#/app/account/public-profile"
        });
    }
    if (!status.isLevel2Complete && status.isLevel1Complete) {
        steps.push({
            step: "Complete Level 2 Verification",
            action: "Visit Telnyx Portal → Account → Verifications and upload business documents",
            url: "https://portal.telnyx.com/#/app/account/verifications"
        });
    }
    if (status.canCreate10DLC) {
        steps.push({
            step: "Create 10DLC Brand & Campaign",
            action: "Run automated setup to create 10DLC brand and campaign (fully automated)",
            url: "/test-telnyx-setup"
        });
    }
    return steps;
}
}),
"[project]/apps/web/src/actions/ten-dlc-registration.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/* __next_internal_action_entry_do_not_use__ [{"00a35b9d088292bb54d357cd06416e3d415487c89b":"checkTelnyxVerificationStatus","4017edba3139fb44e6e281ece4fc8cd9455c636be2":"registerCompanyFor10DLC","4023a6f3546ea5f35e67810da9438db269e6791107":"submitAutomatedVerification"},"",""] */ __turbopack_context__.s([
    "checkTelnyxVerificationStatus",
    ()=>checkTelnyxVerificationStatus,
    "registerCompanyFor10DLC",
    ()=>registerCompanyFor10DLC,
    "submitAutomatedVerification",
    ()=>submitAutomatedVerification
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/email/verification-emails.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/database/src/service-client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$account$2d$verification$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/account-verification.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/ten-dlc.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
async function registerCompanyFor10DLC(companyId) {
    const log = [];
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    if (!supabase) {
        return {
            success: false,
            error: "Failed to create Supabase client",
            log
        };
    }
    try {
        // 1. Fetch company data
        log.push("Fetching company data...");
        const { data: company, error: companyError } = await supabase.from("companies").select(`
				id,
				name,
				ein,
				website,
				industry,
				address,
				city,
				state,
				zip_code,
				phone,
				email,
				support_email,
				support_phone
			`).eq("id", companyId).single();
        if (companyError || !company) {
            return {
                success: false,
                error: `Company not found: ${companyError?.message}`,
                log
            };
        }
        // Validate required fields
        if (!company.ein) {
            return {
                success: false,
                error: "Company EIN is required for 10DLC registration. Please add the company's Tax ID.",
                log
            };
        }
        if (!company.address || !company.city || !company.state || !company.zip_code) {
            return {
                success: false,
                error: "Company address is incomplete. Please add full address, city, state, and ZIP code.",
                log
            };
        }
        const contactEmail = company.email || company.support_email;
        const contactPhone = company.phone || company.support_phone;
        if (!contactEmail || !contactPhone) {
            return {
                success: false,
                error: "Company contact email and phone are required for 10DLC registration.",
                log
            };
        }
        // CRITICAL: Verify email domain before 10DLC registration
        log.push("Verifying company email domain...");
        const supabaseService = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$service$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServiceSupabaseClient"])();
        if (!supabaseService) {
            return {
                success: false,
                error: "Database service client failed",
                log
            };
        }
        const { data: verifiedDomain } = await supabaseService.from("company_email_domains").select("*").eq("company_id", companyId).eq("status", "verified").single();
        if (!verifiedDomain) {
            return {
                success: false,
                error: "Company email domain must be verified before 10DLC registration. TCR (The Campaign Registry) requires a verified business email domain with proper SPF/DKIM/DMARC records. Please complete email domain setup in the onboarding steps.",
                log
            };
        }
        // Use domain email for TCR registration
        const fullDomain = verifiedDomain.subdomain ? `${verifiedDomain.subdomain}.${verifiedDomain.domain_name}` : verifiedDomain.domain_name;
        const domainEmail = `admin@${fullDomain}`;
        log.push(`Email domain verified: ${fullDomain}`);
        // Normalize phone to E.164 format (Telnyx requirement)
        const normalizeToE164 = (phone)=>{
            // Remove all non-digit characters
            const digits = phone.replace(/\D/g, "");
            // Ensure it starts with country code (default to US +1)
            if (digits.length === 10) {
                return `+1${digits}`;
            }
            if (digits.length === 11 && digits.startsWith("1")) {
                return `+${digits}`;
            }
            // Already has country code
            return `+${digits}`;
        };
        const normalizedPhone = normalizeToE164(contactPhone);
        // 2. Check if already registered
        log.push("Checking existing 10DLC registration...");
        const { data: settings } = await supabase.from("company_telnyx_settings").select("ten_dlc_brand_id, ten_dlc_campaign_id").eq("company_id", companyId).single();
        if (settings?.ten_dlc_brand_id && settings?.ten_dlc_campaign_id) {
            log.push("Company already has 10DLC registration");
            return {
                success: true,
                brandId: settings.ten_dlc_brand_id,
                campaignId: settings.ten_dlc_campaign_id,
                log
            };
        }
        // 3. Create 10DLC Brand
        log.push("Creating 10DLC brand with Telnyx...");
        const brandPayload = {
            entityType: "PRIVATE_PROFIT",
            displayName: company.name || "Unknown Company",
            companyName: company.name || "Unknown Company",
            firstName: "Business",
            lastName: "Owner",
            ein: company.ein,
            phone: normalizedPhone,
            street: company.address || "",
            city: company.city || "",
            state: company.state || "",
            postalCode: company.zip_code || "",
            country: "US",
            email: contactEmail,
            website: company.website,
            vertical: determineVertical(company.industry),
            businessContactEmail: contactEmail,
            // ISV/Reseller identification - Stratos is the platform
            isReseller: true
        };
        const brandResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createTenDlcBrand"])(brandPayload);
        if (!brandResult.success || !brandResult.data?.brandId) {
            return {
                success: false,
                error: `Failed to create 10DLC brand: ${brandResult.error}`,
                log
            };
        }
        const brandId = brandResult.data.brandId;
        log.push(`Brand created: ${brandId}`);
        // 4. Poll brand status until approved (max 60 seconds)
        log.push("Waiting for brand approval...");
        const brandApprovalResult = await pollForApproval(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTenDlcBrand"])(brandId), 60);
        if (!brandApprovalResult.approved) {
            log.push(`Brand approval failed: ${brandApprovalResult.failureReason || "Unknown reason"}`);
            // Check if failure was due to email validation (fail fast)
            if (brandApprovalResult.failureReason?.toLowerCase().includes("email")) {
                return {
                    success: false,
                    error: `Email validation failed: ${brandApprovalResult.failureReason}. ` + "TCR requires a verified business email domain (not personal/free providers). " + "Options: 1) Use toll-free numbers (bypasses TCR), " + "2) Set up Google Workspace/Microsoft 365, " + "3) See /TELNYX_10DLC_EMAIL_REQUIREMENTS.md",
                    brandId,
                    log
                };
            }
            // Save brand ID even if not approved yet
            await supabase.from("company_telnyx_settings").update({
                ten_dlc_brand_id: brandId
            }).eq("company_id", companyId);
            return {
                success: false,
                error: brandApprovalResult.failureReason || "Brand created but approval pending. Please check back in a few minutes.",
                brandId,
                log
            };
        }
        log.push("Brand approved");
        // 5. Create 10DLC Campaign
        log.push("Creating 10DLC campaign...");
        const campaignPayload = {
            brandId: brandId,
            usecase: "MIXED",
            description: `Business messaging for ${company.name}`,
            messageFlow: "Customers opt-in when providing phone number. Messages sent for appointments, invoices, and general updates.",
            helpMessage: "Reply HELP for assistance or call us.",
            helpKeywords: "HELP",
            optinKeywords: "START YES SUBSCRIBE",
            optinMessage: "You are now subscribed to messages from " + company.name + ". Reply STOP to unsubscribe.",
            optoutKeywords: "STOP END UNSUBSCRIBE CANCEL QUIT",
            optoutMessage: "You have been unsubscribed from " + company.name + " messages. Reply START to resubscribe.",
            sample1: "Your appointment is confirmed for tomorrow at 2 PM.",
            sample2: "Thank you for your payment. Receipt: #12345",
            sample3: "Reminder: Service scheduled for next week.",
            autoRenewal: true,
            termsAndConditions: true,
            termsAndConditionsLink: company.website ? `${company.website}/terms` : "https://stratos.thorbis.com/terms",
            subscriberHelp: true,
            subscriberOptin: true,
            subscriberOptout: true
        };
        const campaignResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createTenDlcCampaign"])(campaignPayload);
        if (!campaignResult.success || !campaignResult.data?.campaignId) {
            return {
                success: false,
                error: `Failed to create 10DLC campaign: ${campaignResult.error}`,
                brandId,
                log
            };
        }
        const campaignId = campaignResult.data.campaignId;
        log.push(`Campaign created: ${campaignId}`);
        // 6. Poll campaign status
        log.push("Waiting for campaign approval...");
        const campaignApprovalResult = await pollForApproval(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTenDlcCampaign"])(campaignId), 60);
        if (!campaignApprovalResult.approved) {
            log.push(`Campaign approval failed: ${campaignApprovalResult.failureReason || "Unknown reason"}`);
            await supabase.from("company_telnyx_settings").update({
                ten_dlc_brand_id: brandId,
                ten_dlc_campaign_id: campaignId
            }).eq("company_id", companyId);
            return {
                success: false,
                error: campaignApprovalResult.failureReason || "Campaign created but approval pending. Please check back in a few minutes.",
                brandId,
                campaignId,
                log
            };
        }
        log.push("Campaign approved");
        // 7. Attach all company phone numbers to campaign
        log.push("Attaching phone numbers to campaign...");
        const { data: phoneNumbers } = await supabase.from("phone_numbers").select("phone_number").eq("company_id", companyId).eq("status", "active");
        let attachedCount = 0;
        for (const phone of phoneNumbers || []){
            const attachResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$ten$2d$dlc$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["attachNumberToCampaign"])(campaignId, phone.phone_number);
            if (attachResult.success) {
                attachedCount++;
            } else {
                log.push(`Failed to attach ${phone.phone_number}: ${attachResult.error}`);
            }
        }
        log.push(`Attached ${attachedCount} phone numbers to campaign`);
        // 8. Update company settings
        log.push("Updating company Telnyx settings...");
        await supabase.from("company_telnyx_settings").update({
            ten_dlc_brand_id: brandId,
            ten_dlc_campaign_id: campaignId
        }).eq("company_id", companyId);
        return {
            success: true,
            brandId,
            campaignId,
            log
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            log
        };
    }
}
/**
 * Poll approval status until approved or timeout
 */ async function pollForApproval(fetcher, maxSeconds) {
    const startTime = Date.now();
    const pollInterval = 5000; // 5 seconds
    while(Date.now() - startTime < maxSeconds * 1000){
        const result = await fetcher();
        if (!result.success || !result.data) {
            return {
                approved: false,
                failureReason: "Failed to fetch status"
            };
        }
        const status = result.data.status.toLowerCase();
        if (status === "approved" || status === "active") {
            return {
                approved: true
            };
        }
        if (status === "rejected" || status === "failed" || status === "registration_failed") {
            // Extract failure reason from response
            const failureReason = result.data.failureReasons?.[0]?.description || `Registration ${status}`;
            return {
                approved: false,
                failureReason
            };
        }
        // Wait before polling again
        await new Promise((resolve)=>setTimeout(resolve, pollInterval));
    }
    return {
        approved: false,
        failureReason: "Timeout waiting for approval"
    };
}
/**
 * Map business type to 10DLC vertical
 */ function determineVertical(businessType) {
    if (!businessType) return "PROFESSIONAL";
    const type = businessType.toLowerCase();
    // Map to Telnyx's exact vertical values
    // Valid values from error: AGRICULTURE, COMMUNICATION, CONSTRUCTION, EDUCATION,
    // ENERGY, ENTERTAINMENT, FINANCIAL, GAMBLING, GOVERNMENT, HEALTHCARE, HOSPITALITY,
    // HUMAN_RESOURCES, INSURANCE, LEGAL, MANUFACTURING, NGO, POLITICAL, POSTAL,
    // PROFESSIONAL, REAL_ESTATE, RETAIL, TECHNOLOGY, TRANSPORTATION
    if (type.includes("healthcare") || type.includes("medical")) return "HEALTHCARE";
    if (type.includes("finance") || type.includes("banking")) return "FINANCIAL";
    if (type.includes("insurance")) return "INSURANCE";
    if (type.includes("real estate")) return "REAL_ESTATE";
    if (type.includes("retail") || type.includes("ecommerce")) return "RETAIL";
    if (type.includes("hospitality") || type.includes("restaurant") || type.includes("food") || type.includes("hotel")) return "HOSPITALITY";
    if (type.includes("education")) return "EDUCATION";
    if (type.includes("technology") || type.includes("software")) return "TECHNOLOGY";
    if (type.includes("nonprofit") || type.includes("charity") || type.includes("ngo")) return "NGO";
    if (type.includes("construction") || type.includes("plumbing") || type.includes("hvac") || type.includes("electrical") || type.includes("contractor")) return "CONSTRUCTION";
    if (type.includes("legal") || type.includes("law")) return "LEGAL";
    if (type.includes("manufacturing")) return "MANUFACTURING";
    if (type.includes("transportation") || type.includes("logistics")) return "TRANSPORTATION";
    if (type.includes("energy") || type.includes("utilities")) return "ENERGY";
    if (type.includes("agriculture") || type.includes("farming")) return "AGRICULTURE";
    if (type.includes("entertainment") || type.includes("media")) return "ENTERTAINMENT";
    // Default for service businesses
    return "PROFESSIONAL";
}
async function checkTelnyxVerificationStatus() {
    try {
        const statusResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$account$2d$verification$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkAccountVerificationStatus"])();
        if (!statusResult.success) {
            return {
                success: false,
                error: statusResult.error || "Failed to check verification status"
            };
        }
        const status = statusResult.data;
        const nextSteps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$account$2d$verification$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getNextSteps"])(status);
        const requirements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$account$2d$verification$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getVerificationRequirements"])(status.currentLevel);
        return {
            success: true,
            data: {
                ...status,
                nextSteps,
                requirements
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to check verification status"
        };
    }
}
async function submitAutomatedVerification(companyId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$database$2f$src$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const log = [];
    const normalizePhone = (value)=>{
        if (!value) return null;
        const digits = value.replace(/\D/g, "");
        if (!digits) return null;
        if (digits.length === 10) {
            return `+1${digits}`;
        }
        if (digits.length === 11 && digits.startsWith("1")) {
            return `+${digits}`;
        }
        return value.startsWith("+") ? value : `+${digits}`;
    };
    if (!supabase) {
        return {
            success: false,
            error: "Failed to create Supabase client",
            log
        };
    }
    try {
        // 1. Fetch company data
        const { data: company, error: companyError } = await supabase.from("companies").select(`
				id,
				name,
				ein,
				website,
				industry,
				address,
				city,
				state,
				zip_code,
				phone,
				email,
				support_email,
				support_phone
			`).eq("id", companyId).single();
        if (companyError || !company) {
            log.push("Company lookup failed");
            return {
                success: false,
                error: `Company not found: ${companyError?.message}`,
                log
            };
        }
        log.push(`Company loaded: ${company.name} (${company.id})`);
        // Validate required fields
        if (!company.ein) {
            log.push("Missing EIN");
            return {
                success: false,
                error: "Company EIN is required for messaging verification. Please add your Tax ID in Step 1.",
                log
            };
        }
        if (!company.address || !company.city || !company.state || !company.zip_code) {
            log.push("Incomplete address");
            return {
                success: false,
                error: "Company address is incomplete. Please complete all address fields in Step 1.",
                log
            };
        }
        const companyPhone = normalizePhone(company.phone || company.support_phone);
        if (!companyPhone) {
            log.push("Missing company phone");
            return {
                success: false,
                error: "Company phone number is required for verification.",
                log
            };
        }
        // 2. Get company phone numbers
        const { data: phoneNumbers, error: phoneError } = await supabase.from("phone_numbers").select("phone_number, number_type").eq("company_id", companyId).eq("status", "active");
        if (phoneError || !phoneNumbers || phoneNumbers.length === 0) {
            log.push("No phone numbers found for company");
            return {
                success: false,
                error: "No phone numbers found. Please add a phone number before enabling messaging.",
                log
            };
        }
        // Separate toll-free and 10DLC numbers
        const tollFreeNumbers = phoneNumbers.filter((p)=>p.number_type === "toll-free");
        const dlcNumbers = phoneNumbers.filter((p)=>p.number_type === "local");
        log.push(`Detected toll-free numbers: ${tollFreeNumbers.length}, 10DLC numbers: ${dlcNumbers.length}`);
        // If no toll-free numbers, recommend using toll-free for immediate setup
        if (tollFreeNumbers.length === 0 && dlcNumbers.length > 0) {
            console.log("Note: Only local numbers found. Toll-free verification works immediately without Level 2. Consider adding toll-free numbers for faster setup.");
        }
        const contactPhone = companyPhone;
        const contactEmail = company.email || company.support_email || null;
        if (!contactEmail) {
            return {
                success: false,
                error: "A primary email is required for toll-free verification.",
                log
            };
        }
        // Get company owner's profile for business contact info
        const { data: ownerMembership } = await supabase.from("company_memberships").select("user_id, user_profiles!inner(first_name, last_name)").eq("company_id", companyId).eq("role", "owner").eq("status", "active").single();
        // Extract owner name, fallback to "Admin User" if not found
        const ownerProfile = ownerMembership?.user_profiles;
        const businessContactFirstName = ownerProfile?.first_name || "Admin";
        const businessContactLastName = ownerProfile?.last_name || "User";
        // 3. Submit toll-free verification if we have toll-free numbers
        let tollFreeRequestId;
        if (tollFreeNumbers.length > 0) {
            log.push("Preparing toll-free verification payload");
            const normalizedWebsite = company.website || `https://${company.name.toLowerCase().replace(/\s+/g, "")}.com`;
            const optInImageUrl = `${normalizedWebsite.replace(/\/$/, "")}/opt-in`;
            const additionalInfo = `${company.name} sends timely service notifications, scheduling updates, and customer support follow-ups for ${company.industry || "field service"} operations.`;
            const sanitizedEin = company.ein.replace(/[^\d]/g, "");
            const tollFreePayload = {
                businessName: company.name,
                corporateWebsite: normalizedWebsite,
                businessAddr1: company.address,
                businessCity: company.city,
                businessState: company.state,
                businessZip: company.zip_code,
                businessContactFirstName: businessContactFirstName,
                businessContactLastName: businessContactLastName,
                businessContactEmail: contactEmail,
                businessContactPhone: contactPhone,
                phoneNumbers: tollFreeNumbers.map((p)=>({
                        phoneNumber: p.phone_number
                    })),
                useCase: "Customer Support",
                useCaseSummary: `${company.industry} business communications including appointment reminders, service notifications, and customer support`,
                productionMessageContent: `Hi! This is ${company.name}. Your appointment is scheduled for tomorrow at 10 AM. Reply STOP to opt out.`,
                messageVolume: "10000",
                optInWorkflow: "Customers opt-in during service booking and account creation",
                optInWorkflowImageURLs: [
                    {
                        url: optInImageUrl || "https://dummyimage.com/600x400/cccccc/000000&text=Opt-In",
                        description: "Opt-in form screenshot"
                    }
                ],
                optInKeywords: "YES,START",
                optOutKeywords: "STOP,UNSUBSCRIBE",
                optOutMessage: `You have opted out of ${company.name} messages. Reply START to opt in again.`,
                helpKeywords: "HELP,INFO",
                businessRegistrationNumber: sanitizedEin,
                businessRegistrationType: "EIN",
                businessRegistrationCountry: "US",
                entityType: "PRIVATE_PROFIT",
                additionalInformation: additionalInfo,
                helpMessageResponse: `For help, reply HELP or call ${companyPhone}.`,
                optInConfirmationResponse: `Thanks for subscribing to ${company.name} updates.`
            };
            log.push("Submitting toll-free verification to Telnyx");
            const tollFreeResult = await submitTollFreeVerification(tollFreePayload);
            if (!tollFreeResult.success || !tollFreeResult.data) {
                log.push(`Toll-free verification failed: ${tollFreeResult.error || "unknown"}`);
                return {
                    success: false,
                    error: `Toll-free verification failed: ${tollFreeResult.error}`,
                    log
                };
            }
            tollFreeRequestId = tollFreeResult.data.id;
            log.push(`Toll-free verification request created: ${tollFreeRequestId}`);
            // Save toll-free request ID to database
            await supabase.from("company_telnyx_settings").upsert({
                company_id: companyId,
                toll_free_verification_request_id: tollFreeRequestId,
                toll_free_verification_status: "pending",
                toll_free_verification_submitted_at: new Date().toISOString()
            });
        }
        // 4. Submit 10DLC registration if we have regular numbers (OPTIONAL - won't block toll-free)
        let brandId;
        let campaignId;
        let dlcError;
        if (dlcNumbers.length > 0) {
            log.push("Attempting 10DLC registration");
            const registrationResult = await registerCompanyFor10DLC(companyId);
            if (!registrationResult.success) {
                // Check if this is a 403 error (account verification required)
                const is403Error = registrationResult.error?.includes("403") || registrationResult.error?.includes("verifications required");
                if (is403Error) {
                    // Platform account needs Level 2 verification
                    // Don't fail - just log the error and continue with toll-free
                    dlcError = "10DLC requires Level 2 verification (see /TELNYX_PLATFORM_SETUP.md). Toll-free verification will proceed.";
                    console.warn(dlcError);
                    log.push(dlcError);
                    // If we have toll-free numbers, continue (toll-free works without Level 2)
                    // If we ONLY have local numbers and no toll-free, then fail
                    if (tollFreeNumbers.length === 0) {
                        return {
                            success: false,
                            error: "Platform setup required: Your Telnyx account needs Level 2 verification to enable 10DLC registration for local numbers. Alternative: Add toll-free numbers which work immediately without Level 2 verification. See /TELNYX_PLATFORM_SETUP.md for details.",
                            requiresPlatformSetup: true,
                            log
                        };
                    }
                } else {
                    // Other error - log but don't fail if we have toll-free
                    dlcError = `10DLC registration failed: ${registrationResult.error}`;
                    console.error(dlcError);
                    log.push(dlcError);
                    if (tollFreeNumbers.length === 0) {
                        // No toll-free backup - fail
                        return {
                            success: false,
                            error: dlcError,
                            log
                        };
                    }
                }
            } else {
                brandId = registrationResult.brandId;
                campaignId = registrationResult.campaignId;
                log.push(`10DLC registration completed: brand=${brandId}, campaign=${campaignId}`);
            }
        }
        // 5. Send verification submitted email
        // Note: Don't block the response if email fails - verification was successful
        if (company.email) {
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$email$2f$verification$2d$emails$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sendVerificationSubmittedEmail"])(companyId, company.email, {
                    hasTollFreeNumbers: tollFreeNumbers.length > 0,
                    has10DLCNumbers: dlcNumbers.length > 0,
                    tollFreeCount: tollFreeNumbers.length,
                    dlcCount: dlcNumbers.length
                });
                log.push("Verification submitted email sent");
            } catch (emailError) {
                // Log but don't fail - email is non-critical
                console.error("Failed to send verification email:", emailError);
                log.push(`Failed to send verification email: ${emailError instanceof Error ? emailError.message : emailError}`);
            }
        }
        // Build success message
        const messages = [];
        if (tollFreeRequestId) {
            messages.push(`✅ Toll-free verification submitted (${tollFreeNumbers.length} number${tollFreeNumbers.length > 1 ? "s" : ""}) - Approval in 5-7 business days`);
        }
        if (brandId && campaignId) {
            messages.push(`✅ 10DLC registration completed (${dlcNumbers.length} number${dlcNumbers.length > 1 ? "s" : ""}) - Active immediately`);
        }
        if (dlcError) {
            messages.push(`⚠️ ${dlcError}`);
        }
        log.push(...messages);
        return {
            success: true,
            tollFreeRequestId,
            brandId,
            campaignId,
            message: messages.join(". "),
            log
        };
    } catch (error) {
        log.push(`Unhandled verification error: ${error instanceof Error ? error.message : error}`);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to submit verification",
            log
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    registerCompanyFor10DLC,
    checkTelnyxVerificationStatus,
    submitAutomatedVerification
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(registerCompanyFor10DLC, "4017edba3139fb44e6e281ece4fc8cd9455c636be2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(checkTelnyxVerificationStatus, "00a35b9d088292bb54d357cd06416e3d415487c89b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(submitAutomatedVerification, "4023a6f3546ea5f35e67810da9438db269e6791107", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2fac4d6d._.js.map