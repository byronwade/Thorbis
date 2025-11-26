module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/apps/web/src/components/layout/skip-link.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SkipLink",
    ()=>SkipLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function SkipLink() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        href: "#main-content",
        className: "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:transition-all",
        children: "Skip to main content"
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/layout/skip-link.tsx",
        lineNumber: 12,
        columnNumber: 3
    }, this);
}
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

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
"[project]/apps/web/src/lib/analytics/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Vercel Analytics Client
 *
 * Client-side analytics tracking using Vercel Analytics.
 * Provides type-safe event tracking with automatic error handling.
 */ __turbopack_context__.s([
    "trackCustomEvent",
    ()=>trackCustomEvent,
    "trackEvent",
    ()=>trackEvent,
    "trackPageView",
    ()=>trackPageView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$vercel$2b$analytics$40$1$2e$5$2e$0_next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$vercel$2f$analytics$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@vercel+analytics@1.5.0_next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0__react@19.2.0/node_modules/@vercel/analytics/dist/index.mjs [app-ssr] (ecmascript)");
"use client";
;
/**
 * Serialize properties to ensure they're compatible with Vercel Analytics
 */ function serializeProperties(properties) {
    if (!properties) {
        return;
    }
    const serialized = {};
    for (const [key, value] of Object.entries(properties)){
        if (value === null || value === undefined) {
            continue;
        }
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            serialized[key] = value;
        } else if (typeof value === "object") {
            // Serialize nested objects to JSON strings
            try {
                serialized[key] = JSON.stringify(value);
            } catch  {
            // Skip if can't serialize
            }
        }
    }
    return serialized;
}
function trackEvent(event) {
    try {
        // Extract event name and properties
        const { name, properties } = event;
        // Serialize properties to ensure compatibility
        const serializedProperties = serializeProperties(properties);
        // Track with Vercel Analytics
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$vercel$2b$analytics$40$1$2e$5$2e$0_next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$vercel$2f$analytics$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["track"])(name, serializedProperties);
    } catch  {
    // Silently fail - analytics should never break the app
    // Errors are swallowed to prevent analytics from breaking user experience
    }
}
/**
 * Track multiple events in batch
 */ function trackEvents(events) {
    for (const event of events){
        trackEvent(event);
    }
}
function trackPageView(path, title) {
    trackEvent({
        name: "page.viewed",
        properties: {
            path,
            title,
            referrer: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined
        }
    });
}
function trackCustomEvent(name, properties) {
    trackEvent({
        name: name,
        properties
    });
}
}),
"[project]/apps/web/src/lib/analytics/hooks.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * React Hooks for Analytics
 *
 * Easy-to-use hooks for tracking events in React components.
 */ __turbopack_context__.s([
    "useAnalytics",
    ()=>useAnalytics,
    "useFeatureTracking",
    ()=>useFeatureTracking,
    "usePageView",
    ()=>usePageView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$analytics$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/analytics/client.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function useAnalytics() {
    const track = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$analytics$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackEvent"])(event);
    }, []);
    return {
        track
    };
}
function usePageView() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (pathname) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$analytics$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackPageView"])(pathname, document.title);
        }
    }, [
        pathname
    ]);
}
/**
 * Hook for tracking form events
 *
 * @example
 * const { trackFormStart, trackFormSubmit, trackFormAbandon } = useFormTracking("signup");
 *
 * useEffect(() => {
 *   trackFormStart();
 *   return () => trackFormAbandon();
 * }, []);
 *
 * const handleSubmit = () => {
 *   trackFormSubmit({ success: true });
 * };
 */ function useFormTracking(formType) {
    const track = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$analytics$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackEvent"])(event);
    }, []);
    const trackFormStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        track({
            name: "form.started",
            properties: {
                formType
            }
        });
    }, [
        formType,
        track
    ]);
    const trackFormSubmit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((properties)=>{
        track({
            name: "form.submitted",
            properties: {
                formType,
                ...properties
            }
        });
    }, [
        formType,
        track
    ]);
    const trackFormAbandon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((properties)=>{
        track({
            name: "form.abandoned",
            properties: {
                formType,
                ...properties
            }
        });
    }, [
        formType,
        track
    ]);
    const trackFieldFocus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((fieldName)=>{
        track({
            name: "form.field_focused",
            properties: {
                formType,
                fieldName
            }
        });
    }, [
        formType,
        track
    ]);
    const trackValidationError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((fieldName, errorType)=>{
        track({
            name: "form.validation_error",
            properties: {
                formType,
                fieldName,
                errorType
            }
        });
    }, [
        formType,
        track
    ]);
    return {
        trackFormStart,
        trackFormSubmit,
        trackFormAbandon,
        trackFieldFocus,
        trackValidationError
    };
}
function useFeatureTracking() {
    const track = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$analytics$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackEvent"])(event);
    }, []);
    const trackFeatureUse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((featureName, properties)=>{
        track({
            name: "feature.used",
            properties: {
                featureName,
                ...properties
            }
        });
    }, [
        track
    ]);
    const trackFeatureDiscovery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((featureName, source)=>{
        track({
            name: "feature.discovered",
            properties: {
                featureName,
                source
            }
        });
    }, [
        track
    ]);
    return {
        trackFeatureUse,
        trackFeatureDiscovery
    };
}
/**
 * Hook for tracking UI interactions
 *
 * @example
 * const { trackModalOpen, trackModalClose } = useUITracking();
 *
 * trackModalOpen("job-details");
 */ function useUITracking() {
    const track = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$analytics$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackEvent"])(event);
    }, []);
    const trackModalOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((modalType, trigger)=>{
        track({
            name: "ui.modal_opened",
            properties: {
                modalType,
                trigger
            }
        });
    }, [
        track
    ]);
    const trackModalClose = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((modalType, action, duration)=>{
        track({
            name: "ui.modal_closed",
            properties: {
                modalType,
                action,
                duration
            }
        });
    }, [
        track
    ]);
    const trackTabSwitch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((tabName, section)=>{
        track({
            name: "ui.tab_switched",
            properties: {
                tabName,
                section
            }
        });
    }, [
        track
    ]);
    return {
        trackModalOpen,
        trackModalClose,
        trackTabSwitch
    };
}
}),
"[project]/apps/web/src/components/providers/analytics-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Analytics Provider
 *
 * Provides automatic page view tracking and analytics context.
 * Should be added to the root layout.
 */ __turbopack_context__.s([
    "AnalyticsProvider",
    ()=>AnalyticsProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$analytics$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/analytics/hooks.ts [app-ssr] (ecmascript)");
"use client";
;
;
function AnalyticsProvider({ children }) {
    // Automatically track page views
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$analytics$2f$hooks$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePageView"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
"[project]/apps/web/src/components/providers/theme-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-themes@0.4.6_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
"use client";
;
;
function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        attribute: "class",
        defaultTheme: "dark",
        disableTransitionOnChange: true,
        enableSystem: true,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/providers/theme-provider.tsx",
        lineNumber: 8,
        columnNumber: 3
    }, this);
}
}),
"[project]/apps/web/src/components/providers/toast-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastProvider",
    ()=>ToastProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Toast Provider - Sonner Toast Notifications
 *
 * Provides toast notifications across the entire application.
 * Automatically themed to match the current theme (light/dark).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-themes@0.4.6_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/sonner@2.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
function ToastProvider() {
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$themes$40$0$2e$4$2e$6_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toaster"], {
        closeButton: true,
        expand: false,
        offset: "72px",
        position: "top-right",
        richColors: true,
        theme: theme === "dark" ? "dark" : "light",
        toastOptions: {
            classNames: {
                toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                description: "group-[.toast]:text-muted-foreground",
                actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
            }
        }
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/providers/toast-provider.tsx",
        lineNumber: 17,
        columnNumber: 3
    }, this);
}
}),
"[project]/apps/web/src/types/roles.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Role Type Definitions
 *
 * Defines all user roles in the system with their permissions and capabilities
 */ __turbopack_context__.s([
    "USER_ROLES",
    ()=>USER_ROLES
]);
const USER_ROLES = {
    OWNER: "owner",
    DISPATCHER: "dispatcher",
    MANAGER: "manager",
    TECHNICIAN: "technician",
    CSR: "csr",
    ADMIN: "admin"
};
const ROLE_CONFIGS = {
    [USER_ROLES.OWNER]: {
        id: "owner",
        label: "Owner",
        description: "Full system access with focus on business financials and growth",
        color: "purple",
        permissions: [
            "*"
        ],
        dashboardFeatures: [
            "financial-overview",
            "profit-margins",
            "cash-flow",
            "business-growth",
            "payroll-overview",
            "all-reports"
        ]
    },
    [USER_ROLES.DISPATCHER]: {
        id: "dispatcher",
        label: "Dispatcher",
        description: "Manage technician schedules, job assignments, and real-time operations",
        color: "blue",
        permissions: [
            "view-schedule",
            "manage-assignments",
            "view-technicians",
            "dispatch-jobs",
            "view-customers"
        ],
        dashboardFeatures: [
            "dispatch-map",
            "technician-locations",
            "unassigned-jobs",
            "emergency-queue",
            "quick-dispatch",
            "tech-status"
        ]
    },
    [USER_ROLES.MANAGER]: {
        id: "manager",
        label: "Manager",
        description: "Oversee team performance, customer satisfaction, and operations",
        color: "green",
        permissions: [
            "view-reports",
            "manage-team",
            "view-customers",
            "handle-escalations",
            "view-financials"
        ],
        dashboardFeatures: [
            "team-performance",
            "customer-satisfaction",
            "callback-queue",
            "review-alerts",
            "kpi-tracking",
            "inventory-management"
        ]
    },
    [USER_ROLES.TECHNICIAN]: {
        id: "technician",
        label: "Technician",
        description: "View assigned jobs, update job status, and track personal performance",
        color: "orange",
        permissions: [
            "view-my-schedule",
            "update-job-status",
            "view-job-details",
            "upload-photos",
            "create-invoices"
        ],
        dashboardFeatures: [
            "my-schedule",
            "active-job",
            "my-earnings",
            "my-performance",
            "parts-inventory",
            "time-tracking"
        ]
    },
    [USER_ROLES.CSR]: {
        id: "csr",
        label: "Customer Service Rep",
        description: "Handle customer calls, schedule appointments, and manage customer relationships",
        color: "pink",
        permissions: [
            "view-customers",
            "create-jobs",
            "schedule-appointments",
            "view-schedule",
            "send-communications"
        ],
        dashboardFeatures: [
            "call-queue",
            "booking-calendar",
            "customer-search",
            "follow-up-queue",
            "estimate-pipeline",
            "call-scripts"
        ]
    },
    [USER_ROLES.ADMIN]: {
        id: "admin",
        label: "Admin",
        description: "System administration and configuration",
        color: "red",
        permissions: [
            "*"
        ],
        dashboardFeatures: [
            "system-settings",
            "user-management",
            "integrations",
            "audit-logs"
        ]
    }
};
function getRoleConfig(role) {
    return ROLE_CONFIGS[role];
}
function hasPermission(role, permission) {
    const config = getRoleConfig(role);
    return config.permissions.includes("*") || config.permissions.includes(permission);
}
}),
"[project]/apps/web/src/lib/stores/role-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Role Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Automatic localStorage persistence for development mode
 * - Selective subscriptions prevent unnecessary re-renders
 *
 * Manages user role state with two modes:
 * 1. Development: localStorage override for testing different roles
 * 2. Production: Fetches actual role from database
 *
 * The store checks localStorage first (dev mode), then falls back to DB role.
 */ __turbopack_context__.s([
    "useRoleStore",
    ()=>useRoleStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/roles.ts [app-ssr] (ecmascript)");
;
;
;
const initialState = {
    role: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["USER_ROLES"].OWNER,
    isLoading: false,
    isDevelopmentOverride: false,
    actualRole: null
};
/**
 * Check if we're in development mode
 */ const isDevelopment = ("TURBOPACK compile-time value", "development") === "development";
const useRoleStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        ...initialState,
        /**
				 * Set role (development mode override)
				 * This is used by the development settings page
				 */ setRole: (role)=>set({
                role,
                isDevelopmentOverride: true
            }),
        /**
				 * Set actual role from database
				 * This is set when fetching user's real role
				 */ setActualRole: (actualRole)=>{
            const state = get();
            // If no development override, use actual role
            if (state.isDevelopmentOverride && isDevelopment) {
                // Keep development override but store actual role
                set({
                    actualRole
                });
            } else {
                set({
                    actualRole,
                    role: actualRole || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["USER_ROLES"].OWNER,
                    isDevelopmentOverride: false
                });
            }
        },
        /**
				 * Clear development override and use actual role
				 */ clearDevelopmentOverride: ()=>{
            const state = get();
            set({
                role: state.actualRole || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$roles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["USER_ROLES"].OWNER,
                isDevelopmentOverride: false
            });
        },
        reset: ()=>set(initialState)
    }), {
    name: "thorbis_dev_role",
    skipHydration: true,
    partialize: (state)=>({
            // Only persist in development mode
            role: ("TURBOPACK compile-time truthy", 1) ? state.role : "TURBOPACK unreachable",
            isDevelopmentOverride: ("TURBOPACK compile-time truthy", 1) ? state.isDevelopmentOverride : "TURBOPACK unreachable"
        })
}), {
    name: "RoleStore"
}));
/**
 * Hook to initialize role from database
 * Call this in layout or auth wrapper to sync role
 *
 * @example
 * ```typescript
 * // In layout or auth provider
 * import { initializeRoleFromDatabase } from '@/lib/stores/role-store';
 *
 * useEffect(() => {
 *   initializeRoleFromDatabase();
 * }, []);
 * ```
 */ async function initializeRoleFromDatabase() {
    try {
        // Import dynamically to avoid circular dependencies
        const { getCurrentUserRole } = await __turbopack_context__.A("[project]/apps/web/src/actions/roles.ts [app-ssr] (ecmascript, async loader)");
        const result = await getCurrentUserRole();
        if (result.success && result.data) {
            useRoleStore.getState().setActualRole(result.data);
        }
    } catch (_error) {}
}
}),
"[project]/apps/web/src/lib/stores/schedule-view-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Schedule View Store - Zustand State Management
 * Optimized for timeline-only view with performant infinite scroll
 */ __turbopack_context__.s([
    "useScheduleViewStore",
    ()=>useScheduleViewStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
;
;
// Buffer configuration for infinite scroll (PERFORMANCE TUNED)
const BUFFER_DAYS_BEFORE = 3; // Initial days to load before current date
const BUFFER_DAYS_AFTER = 3; // Initial days to load after current date
const EXTEND_DAYS = 3; // Days to add when extending buffer (reduces state updates)
const MAX_BUFFER_DAYS = 14; // Maximum buffer size before trimming (prevents memory bloat)
// Detect mobile viewport and set default view accordingly
// List view is more mobile-friendly than day view
const getDefaultViewMode = ()=>{
    if ("TURBOPACK compile-time truthy", 1) return "day"; // SSR fallback
    //TURBOPACK unreachable
    ;
};
// Helper to create buffer dates around a center date
const createBufferDates = (centerDate)=>{
    const start = new Date(centerDate);
    start.setDate(start.getDate() - BUFFER_DAYS_BEFORE);
    start.setHours(0, 0, 0, 0);
    const end = new Date(centerDate);
    end.setDate(end.getDate() + BUFFER_DAYS_AFTER);
    end.setHours(23, 59, 59, 999);
    return {
        bufferStartDate: start,
        bufferEndDate: end
    };
};
const now = new Date();
const { bufferStartDate, bufferEndDate } = createBufferDates(now);
const initialState = {
    viewMode: getDefaultViewMode(),
    currentDate: new Date(),
    zoomLevel: 30,
    showTravelTime: true,
    showCapacity: true,
    bufferStartDate,
    bufferEndDate
};
const useScheduleViewStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        ...initialState,
        setViewMode: (mode)=>set({
                viewMode: mode
            }),
        setCurrentDate: (date)=>{
            // Update buffer when current date changes
            const { bufferStartDate, bufferEndDate } = createBufferDates(date);
            set({
                currentDate: date,
                bufferStartDate,
                bufferEndDate
            });
        },
        setZoomLevel: (level)=>set({
                zoomLevel: level
            }),
        toggleTravelTime: ()=>set((state)=>({
                    showTravelTime: !state.showTravelTime
                })),
        toggleCapacity: ()=>set((state)=>({
                    showCapacity: !state.showCapacity
                })),
        goToToday: ()=>{
            const today = new Date();
            const { bufferStartDate, bufferEndDate } = createBufferDates(today);
            set({
                currentDate: today,
                bufferStartDate,
                bufferEndDate
            });
        },
        navigatePrevious: ()=>{
            const { currentDate, viewMode } = get();
            const newDate = new Date(currentDate);
            if (viewMode === "day" || viewMode === "list") {
                newDate.setDate(newDate.getDate() - 1);
            } else if (viewMode === "week") {
                newDate.setDate(newDate.getDate() - 7);
            } else {
                newDate.setMonth(newDate.getMonth() - 1);
            }
            const { bufferStartDate, bufferEndDate } = createBufferDates(newDate);
            set({
                currentDate: newDate,
                bufferStartDate,
                bufferEndDate
            });
        },
        navigateNext: ()=>{
            const { currentDate, viewMode } = get();
            const newDate = new Date(currentDate);
            if (viewMode === "day" || viewMode === "list") {
                newDate.setDate(newDate.getDate() + 1);
            } else if (viewMode === "week") {
                newDate.setDate(newDate.getDate() + 7);
            } else {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            const { bufferStartDate, bufferEndDate } = createBufferDates(newDate);
            set({
                currentDate: newDate,
                bufferStartDate,
                bufferEndDate
            });
        },
        // Extend buffer to the left (earlier dates) for infinite scroll
        // Extends by EXTEND_DAYS at once to reduce state update frequency
        extendBufferLeft: ()=>{
            const { bufferStartDate, bufferEndDate } = get();
            const newStart = new Date(bufferStartDate);
            newStart.setDate(newStart.getDate() - EXTEND_DAYS);
            // Check if buffer would exceed max size, trim from right if so
            const totalDays = Math.ceil((bufferEndDate.getTime() - newStart.getTime()) / (1000 * 60 * 60 * 24));
            if (totalDays > MAX_BUFFER_DAYS) {
                const newEnd = new Date(bufferEndDate);
                newEnd.setDate(newEnd.getDate() - (totalDays - MAX_BUFFER_DAYS));
                set({
                    bufferStartDate: newStart,
                    bufferEndDate: newEnd
                });
            } else {
                set({
                    bufferStartDate: newStart
                });
            }
        },
        // Extend buffer to the right (later dates) for infinite scroll
        // Extends by EXTEND_DAYS at once to reduce state update frequency
        extendBufferRight: ()=>{
            const { bufferStartDate, bufferEndDate } = get();
            const newEnd = new Date(bufferEndDate);
            newEnd.setDate(newEnd.getDate() + EXTEND_DAYS);
            // Check if buffer would exceed max size, trim from left if so
            const totalDays = Math.ceil((newEnd.getTime() - bufferStartDate.getTime()) / (1000 * 60 * 60 * 24));
            if (totalDays > MAX_BUFFER_DAYS) {
                const newStart = new Date(bufferStartDate);
                newStart.setDate(newStart.getDate() + (totalDays - MAX_BUFFER_DAYS));
                set({
                    bufferStartDate: newStart,
                    bufferEndDate: newEnd
                });
            } else {
                set({
                    bufferEndDate: newEnd
                });
            }
        },
        // Trim buffer to MAX_BUFFER_DAYS centered around the given date
        trimBuffer: (centerDate)=>{
            const { bufferStartDate, bufferEndDate } = get();
            const totalDays = Math.ceil((bufferEndDate.getTime() - bufferStartDate.getTime()) / (1000 * 60 * 60 * 24));
            if (totalDays <= MAX_BUFFER_DAYS) return;
            const halfMax = Math.floor(MAX_BUFFER_DAYS / 2);
            const newStart = new Date(centerDate);
            newStart.setDate(newStart.getDate() - halfMax);
            newStart.setHours(0, 0, 0, 0);
            const newEnd = new Date(centerDate);
            newEnd.setDate(newEnd.getDate() + halfMax);
            newEnd.setHours(23, 59, 59, 999);
            set({
                bufferStartDate: newStart,
                bufferEndDate: newEnd
            });
        },
        // Reset buffer to default around current date
        resetBuffer: ()=>{
            const { currentDate } = get();
            const { bufferStartDate, bufferEndDate } = createBufferDates(currentDate);
            set({
                bufferStartDate,
                bufferEndDate
            });
        },
        reset: ()=>set(initialState)
    }), {
    name: "schedule-view-store",
    skipHydration: true,
    // Don't persist buffer dates - they should be recalculated on load
    partialize: (state)=>({
            viewMode: state.viewMode,
            currentDate: state.currentDate,
            zoomLevel: state.zoomLevel,
            showTravelTime: state.showTravelTime,
            showCapacity: state.showCapacity
        })
}), {
    name: "ScheduleViewStore"
}));
}),
"[project]/apps/web/src/lib/stores/sidebar-state-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Sidebar State Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Page-specific sidebar state for tailored UX
 * - Persists preferences per route in localStorage
 *
 * This store manages both LEFT and RIGHT sidebar open/closed state on a per-page basis.
 * Each route can have its own sidebar states, allowing users to:
 * - Close sidebar on schedule page for more calendar space
 * - Keep sidebar open on settings for easy navigation
 * - Toggle right sidebar on invoice/pricebook pages
 * - Customize workspace per context
 */ __turbopack_context__.s([
    "useSidebarStateStore",
    ()=>useSidebarStateStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
;
;
// ============================================================================
// Initial State
// ============================================================================
const initialState = {
    sidebarStates: {},
    rightSidebarStates: {}
};
const useSidebarStateStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        ...initialState,
        // Left sidebar methods
        getSidebarState: (route)=>{
            const states = get().sidebarStates;
            // Default to true (open) if not set
            return states[route] ?? true;
        },
        setSidebarState: (route, isOpen)=>{
            set((state)=>({
                    sidebarStates: {
                        ...state.sidebarStates,
                        [route]: isOpen
                    }
                }));
        },
        toggleSidebarState: (route)=>{
            const currentState = get().getSidebarState(route);
            get().setSidebarState(route, !currentState);
        },
        // Right sidebar methods
        getRightSidebarState: (route, defaultOpen = true)=>{
            const states = get().rightSidebarStates;
            // Default to true (open) if not set, unless specified otherwise
            return states[route] ?? defaultOpen;
        },
        setRightSidebarState: (route, isOpen)=>{
            set((state)=>({
                    rightSidebarStates: {
                        ...state.rightSidebarStates,
                        [route]: isOpen
                    }
                }));
        },
        toggleRightSidebarState: (route)=>{
            const currentState = get().getRightSidebarState(route);
            get().setRightSidebarState(route, !currentState);
        },
        // Reset methods
        resetAllStates: ()=>{
            set({
                sidebarStates: {},
                rightSidebarStates: {}
            });
        },
        resetRouteState: (route)=>{
            set((state)=>{
                const newLeftStates = {
                    ...state.sidebarStates
                };
                const newRightStates = {
                    ...state.rightSidebarStates
                };
                delete newLeftStates[route];
                delete newRightStates[route];
                return {
                    sidebarStates: newLeftStates,
                    rightSidebarStates: newRightStates
                };
            });
        }
    }), {
    name: "sidebar-state-storage",
    // Persist both left and right sidebar states
    partialize: (state)=>({
            sidebarStates: state.sidebarStates,
            rightSidebarStates: state.rightSidebarStates
        }),
    // PERFORMANCE: Skip hydration to prevent SSR mismatches
    // Allows Next.js to generate static pages without Zustand errors
    skipHydration: true
}), {
    name: "SidebarStateStore"
}));
}),
"[project]/apps/web/src/lib/stores/ui-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "uiSelectors",
    ()=>uiSelectors,
    "useUIStore",
    ()=>useUIStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware/immer.mjs [app-ssr] (ecmascript)");
;
;
;
/**
 * Initial state
 */ const initialState = {
    sidebarOpen: true,
    modals: {},
    notifications: [],
    call: {
        status: "idle",
        caller: null,
        startTime: null,
        isMuted: false,
        isOnHold: false,
        isRecording: false,
        videoStatus: "off",
        isLocalVideoEnabled: false,
        isRemoteVideoEnabled: false,
        customerId: null,
        customerData: null,
        callControlId: null,
        callSessionId: null,
        direction: "inbound",
        telnyxCallState: "idle",
        telnyxError: null,
        isScreenSharing: false,
        connectionQuality: "excellent",
        hasVirtualBackground: false,
        reactions: [],
        chatMessages: [],
        participants: [],
        meetingLink: "https://meet.thorbis.app/abc-defg-hij"
    }
};
const useUIStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["immer"])((set)=>({
        ...initialState,
        toggleSidebar: ()=>set((state)=>{
                state.sidebarOpen = !state.sidebarOpen;
            }, false, "toggleSidebar"),
        setSidebarOpen: (open)=>set((state)=>{
                state.sidebarOpen = open;
            }, false, "setSidebarOpen"),
        openModal: (type, data)=>set((state)=>{
                state.modals[type] = {
                    isOpen: true,
                    type,
                    data
                };
            }, false, "openModal"),
        closeModal: (type)=>set((state)=>{
                if (state.modals[type]) {
                    state.modals[type].isOpen = false;
                }
            }, false, "closeModal"),
        addNotification: (notification)=>set((state)=>{
                const id = crypto.randomUUID();
                state.notifications.push({
                    ...notification,
                    id
                });
                // Auto-remove after duration
                if (notification.duration) {
                    setTimeout(()=>{
                        set((currentState)=>{
                            currentState.notifications = currentState.notifications.filter((n)=>n.id !== id);
                        }, false, "autoRemoveNotification");
                    }, notification.duration);
                }
            }, false, "addNotification"),
        removeNotification: (id)=>set((state)=>{
                state.notifications = state.notifications.filter((n)=>n.id !== id);
            }, false, "removeNotification"),
        // Call actions
        setIncomingCall: (caller)=>set((state)=>{
                state.call.caller = caller;
                state.call.status = "incoming";
                state.call.startTime = Date.now();
            }, false, "setIncomingCall"),
        answerCall: ()=>set((state)=>{
                if (state.call.status === "incoming") {
                    state.call.status = "active";
                    state.call.startTime = Date.now();
                    // Add mock participants for testing
                    state.call.participants = [
                        {
                            id: "1",
                            name: "Sarah Johnson",
                            skipHydration: true,
                            isMuted: false,
                            isVideoEnabled: true,
                            isSpeaking: true,
                            isScreenSharing: false
                        },
                        {
                            id: "2",
                            name: "Michael Chen",
                            skipHydration: true,
                            isMuted: false,
                            isVideoEnabled: true,
                            isSpeaking: false,
                            isScreenSharing: false
                        },
                        {
                            id: "3",
                            name: "Emily Rodriguez",
                            skipHydration: true,
                            isMuted: true,
                            isVideoEnabled: false,
                            isSpeaking: false,
                            isScreenSharing: false
                        },
                        {
                            id: "4",
                            name: "David Kim",
                            skipHydration: true,
                            isMuted: false,
                            isVideoEnabled: true,
                            isSpeaking: false,
                            isScreenSharing: false
                        },
                        {
                            id: "5",
                            name: "Lisa Anderson",
                            skipHydration: true,
                            isMuted: false,
                            isVideoEnabled: true,
                            isSpeaking: false,
                            isScreenSharing: false
                        },
                        {
                            id: "6",
                            name: "James Wilson",
                            skipHydration: true,
                            isMuted: true,
                            isVideoEnabled: true,
                            isSpeaking: false,
                            isScreenSharing: false
                        },
                        {
                            id: "7",
                            name: "Maria Garcia",
                            skipHydration: true,
                            isMuted: false,
                            isVideoEnabled: false,
                            isSpeaking: false,
                            isScreenSharing: false
                        },
                        {
                            id: "8",
                            name: "Robert Taylor",
                            skipHydration: true,
                            isMuted: false,
                            isVideoEnabled: true,
                            isSpeaking: false,
                            isScreenSharing: false
                        },
                        {
                            id: "9",
                            name: "Jennifer Lee",
                            skipHydration: true,
                            isMuted: false,
                            isVideoEnabled: true,
                            isSpeaking: false,
                            isScreenSharing: false
                        }
                    ];
                }
            }, false, "answerCall"),
        endCall: ()=>set((state)=>{
                state.call.status = "ended";
                state.call.caller = null;
                state.call.startTime = null;
                state.call.isMuted = false;
                state.call.isOnHold = false;
                state.call.isRecording = false;
                state.call.videoStatus = "off";
                state.call.isLocalVideoEnabled = false;
                state.call.isRemoteVideoEnabled = false;
                state.call.isScreenSharing = false;
                state.call.connectionQuality = "excellent";
                state.call.hasVirtualBackground = false;
                state.call.reactions = [];
                state.call.chatMessages = [];
                state.call.participants = [];
            }, false, "endCall"),
        toggleMute: ()=>set((state)=>{
                state.call.isMuted = !state.call.isMuted;
            }, false, "toggleMute"),
        toggleHold: ()=>set((state)=>{
                state.call.isOnHold = !state.call.isOnHold;
            }, false, "toggleHold"),
        toggleRecording: ()=>set((state)=>{
                state.call.isRecording = !state.call.isRecording;
            }, false, "toggleRecording"),
        // Video actions
        requestVideo: ()=>set((state)=>{
                state.call.videoStatus = "requesting";
                state.call.isLocalVideoEnabled = true;
                // Simulate other party seeing the request
                setTimeout(()=>{
                    set((currentState)=>{
                        if (currentState.call.videoStatus === "requesting") {
                            currentState.call.videoStatus = "ringing";
                        }
                    }, false, "videoRinging");
                    // Auto-accept after 3 seconds for demo
                    setTimeout(()=>{
                        set((currentState)=>{
                            if (currentState.call.videoStatus === "ringing") {
                                currentState.call.videoStatus = "connected";
                                currentState.call.isRemoteVideoEnabled = true;
                            }
                        }, false, "videoAutoAccept");
                    }, 3000);
                }, 1000);
            }, false, "requestVideo"),
        acceptVideo: ()=>set((state)=>{
                state.call.videoStatus = "connected";
                state.call.isLocalVideoEnabled = true;
                state.call.isRemoteVideoEnabled = true;
            }, false, "acceptVideo"),
        declineVideo: ()=>set((state)=>{
                state.call.videoStatus = "declined";
                state.call.isLocalVideoEnabled = false;
                state.call.isRemoteVideoEnabled = false;
                // Reset to off after 2 seconds
                setTimeout(()=>{
                    set((currentState)=>{
                        currentState.call.videoStatus = "off";
                    }, false, "videoResetAfterDecline");
                }, 2000);
            }, false, "declineVideo"),
        endVideo: ()=>set((state)=>{
                state.call.videoStatus = "off";
                state.call.isLocalVideoEnabled = false;
                state.call.isRemoteVideoEnabled = false;
            }, false, "endVideo"),
        toggleLocalVideo: ()=>set((state)=>{
                state.call.isLocalVideoEnabled = !state.call.isLocalVideoEnabled;
            }, false, "toggleLocalVideo"),
        // Enhanced feature actions
        toggleScreenShare: ()=>set((state)=>{
                state.call.isScreenSharing = !state.call.isScreenSharing;
            }, false, "toggleScreenShare"),
        toggleVirtualBackground: ()=>set((state)=>{
                state.call.hasVirtualBackground = !state.call.hasVirtualBackground;
            }, false, "toggleVirtualBackground"),
        addReaction: (type)=>set((state)=>{
                const reaction = {
                    id: Math.random().toString(36).slice(2, 9),
                    type,
                    timestamp: Date.now()
                };
                state.call.reactions.push(reaction);
                // Auto-remove reaction after 3 seconds
                setTimeout(()=>{
                    set((currentState)=>{
                        const index = currentState.call.reactions.findIndex((r)=>r.id === reaction.id);
                        if (index !== -1) {
                            currentState.call.reactions.splice(index, 1);
                        }
                    }, false, "removeReaction");
                }, 3000);
            }, false, "addReaction"),
        clearReactions: ()=>set((state)=>{
                state.call.reactions = [];
            }, false, "clearReactions"),
        sendChatMessage: (message)=>set((state)=>{
                state.call.chatMessages.push({
                    id: Math.random().toString(36).slice(2, 9),
                    sender: "me",
                    message,
                    timestamp: Date.now()
                });
            }, false, "sendChatMessage"),
        clearChat: ()=>set((state)=>{
                state.call.chatMessages = [];
            }, false, "clearChat"),
        setConnectionQuality: (quality)=>set((state)=>{
                state.call.connectionQuality = quality;
            }, false, "setConnectionQuality"),
        // Customer data actions
        setCustomerData: (data)=>set((state)=>{
                state.call.customerData = data;
                const customer = data?.customer ?? null;
                state.call.customerId = customer?.id || null;
            }, false, "setCustomerData"),
        clearCustomerData: ()=>set((state)=>{
                state.call.customerData = null;
                state.call.customerId = null;
            }, false, "clearCustomerData"),
        // Telnyx state actions
        setTelnyxCallState: (telnyxState)=>set((state)=>{
                state.call.telnyxCallState = telnyxState;
            }, false, "setTelnyxCallState"),
        setTelnyxError: (error)=>set((state)=>{
                state.call.telnyxError = error;
            }, false, "setTelnyxError"),
        setCallMetadata: (metadata)=>set((state)=>{
                state.call.callControlId = metadata.callControlId;
                state.call.callSessionId = metadata.callSessionId;
                state.call.direction = metadata.direction;
            }, false, "setCallMetadata"),
        reset: ()=>set(initialState, false, "reset")
    })), {
    name: "ui-store",
    skipHydration: true,
    partialize: (state)=>({
            sidebarOpen: state.sidebarOpen
        })
}), {
    name: "UIStore"
}));
const uiSelectors = {
    sidebarOpen: (state)=>state.sidebarOpen,
    modals: (state)=>state.modals,
    notifications: (state)=>state.notifications,
    getModal: (type)=>(state)=>state.modals[type],
    call: (state)=>state.call,
    callStatus: (state)=>state.call.status,
    caller: (state)=>state.call.caller
};
}),
"[project]/apps/web/src/lib/stores/user-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUserStore",
    ()=>useUserStore,
    "userSelectors",
    ()=>userSelectors
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware/immer.mjs [app-ssr] (ecmascript)");
;
;
;
/**
 * Initial state
 */ const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true
};
const useUserStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["immer"])((set)=>({
        ...initialState,
        setUser: (user)=>set((state)=>{
                state.user = user;
                state.isAuthenticated = !!user;
                state.isLoading = false;
            }, false, "setUser"),
        updateUser: (updates)=>set((state)=>{
                if (state.user) {
                    state.user = {
                        ...state.user,
                        ...updates
                    };
                }
            }, false, "updateUser"),
        logout: ()=>set((state)=>{
                state.user = null;
                state.isAuthenticated = false;
                state.isLoading = false;
            }, false, "logout"),
        setLoading: (loading)=>set((state)=>{
                state.isLoading = loading;
            }, false, "setLoading"),
        reset: ()=>set(initialState, false, "reset")
    })), {
    name: "user-store",
    skipHydration: true,
    partialize: (state)=>({
            user: state.user,
            isAuthenticated: state.isAuthenticated
        })
}), {
    name: "UserStore"
}));
const userSelectors = {
    user: (state)=>state.user,
    isAuthenticated: (state)=>state.isAuthenticated,
    isLoading: (state)=>state.isLoading
};
}),
"[project]/apps/web/src/lib/stores/view-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useViewStore",
    ()=>useViewStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
;
;
const defaultFilters = {
    technicianIds: [],
    statuses: [],
    priorities: [],
    searchQuery: ""
};
const useViewStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        // Initial state
        zoom: 100,
        currentDate: new Date(),
        filters: defaultFilters,
        sidebarCollapsed: false,
        showCompletedJobs: true,
        showConflicts: true,
        showTravelTime: false,
        workingHoursStart: 7,
        workingHoursEnd: 19,
        // Zoom actions
        setZoom: (zoom)=>{
            const clampedZoom = Math.max(5, Math.min(500, zoom));
            set({
                zoom: clampedZoom
            });
        },
        zoomIn: ()=>{
            const currentZoom = get().zoom;
            const newZoom = Math.min(500, currentZoom * 1.2);
            set({
                zoom: newZoom
            });
        },
        zoomOut: ()=>{
            const currentZoom = get().zoom;
            const newZoom = Math.max(5, currentZoom / 1.2);
            set({
                zoom: newZoom
            });
        },
        resetZoom: ()=>set({
                zoom: 100
            }),
        // Navigation actions
        setCurrentDate: (date)=>set({
                currentDate: date
            }),
        goToToday: ()=>set({
                currentDate: new Date()
            }),
        goToDate: (date)=>set({
                currentDate: date
            }),
        navigateDays: (days)=>{
            const current = get().currentDate;
            const newDate = new Date(current);
            newDate.setDate(newDate.getDate() + days);
            set({
                currentDate: newDate
            });
        },
        // Filter actions
        setFilters: (updates)=>{
            set((state)=>({
                    filters: {
                        ...state.filters,
                        ...updates
                    }
                }));
        },
        resetFilters: ()=>set({
                filters: defaultFilters
            }),
        toggleTechnicianFilter: (technicianId)=>{
            set((state)=>{
                const current = state.filters.technicianIds;
                const updated = current.includes(technicianId) ? current.filter((id)=>id !== technicianId) : [
                    ...current,
                    technicianId
                ];
                return {
                    filters: {
                        ...state.filters,
                        technicianIds: updated
                    }
                };
            });
        },
        setSearchQuery: (query)=>{
            set((state)=>({
                    filters: {
                        ...state.filters,
                        searchQuery: query
                    }
                }));
        },
        // UI actions
        toggleSidebar: ()=>{
            set((state)=>({
                    sidebarCollapsed: !state.sidebarCollapsed
                }));
        },
        setSidebarCollapsed: (collapsed)=>set({
                sidebarCollapsed: collapsed
            }),
        toggleCompletedJobs: ()=>{
            set((state)=>({
                    showCompletedJobs: !state.showCompletedJobs
                }));
        },
        toggleConflicts: ()=>{
            set((state)=>({
                    showConflicts: !state.showConflicts
                }));
        },
        toggleTravelTime: ()=>{
            set((state)=>({
                    showTravelTime: !state.showTravelTime
                }));
        },
        // Working hours
        setWorkingHours: (start, end)=>{
            set({
                workingHoursStart: Math.max(0, Math.min(23, start)),
                workingHoursEnd: Math.max(0, Math.min(23, end))
            });
        },
        // Helpers
        getVisibleTimeRange: ()=>{
            const { currentDate, zoom } = get();
            // Calculate visible range based on zoom level
            // Lower zoom = more days visible, higher zoom = fewer days/more hours
            let daysVisible;
            if (zoom < 50) {
                daysVisible = 90; // ~3 months
            } else if (zoom < 100) {
                daysVisible = 30; // 1 month
            } else if (zoom < 200) {
                daysVisible = 7; // 1 week
            } else if (zoom < 400) {
                daysVisible = 1; // 1 day (hourly view)
            } else {
                daysVisible = 0.5; // Half day (detailed hourly)
            }
            const start = new Date(currentDate);
            start.setDate(start.getDate() - Math.floor(daysVisible / 2));
            start.setHours(0, 0, 0, 0);
            const end = new Date(currentDate);
            end.setDate(end.getDate() + Math.ceil(daysVisible / 2));
            end.setHours(23, 59, 59, 999);
            return {
                start,
                end
            };
        },
        isFiltered: ()=>{
            const { filters } = get();
            return filters.technicianIds.length > 0 || filters.statuses.length > 0 || filters.priorities.length > 0 || filters.searchQuery.trim() !== "";
        }
    }), {
    name: "view-storage",
    skipHydration: true,
    partialize: (state)=>({
            zoom: state.zoom,
            sidebarCollapsed: state.sidebarCollapsed,
            showCompletedJobs: state.showCompletedJobs,
            showConflicts: state.showConflicts,
            showTravelTime: state.showTravelTime,
            workingHoursStart: state.workingHoursStart,
            workingHoursEnd: state.workingHoursEnd
        })
})));
}),
"[project]/apps/web/src/lib/stores/work-view-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSetWorkView",
    ()=>useSetWorkView,
    "useWorkView",
    ()=>useWorkView,
    "useWorkViewStore",
    ()=>useWorkViewStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
;
;
const defaultViews = {
    jobs: "table",
    appointments: "table",
    payments: "table",
    estimates: "table",
    invoices: "table",
    contracts: "table",
    maintenancePlans: "table",
    materials: "table",
    purchaseOrders: "table",
    serviceAgreements: "table",
    equipment: "table",
    teams: "table",
    customers: "table",
    vendors: "table"
};
function createInitialState() {
    return {
        views: {
            ...defaultViews
        },
        setView: ()=>{},
        getView: ()=>"table",
        reset: ()=>{}
    };
}
const useWorkViewStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        ...createInitialState(),
        setView: (section, mode)=>set((state)=>({
                    views: {
                        ...state.views,
                        [section]: mode
                    }
                })),
        getView: (section)=>get().views[section] ?? "table",
        reset: ()=>set({
                views: {
                    ...defaultViews
                }
            })
    }), {
    name: "work-view-preferences",
    partialize: (state)=>({
            views: state.views
        }),
    skipHydration: true
}), {
    name: "WorkViewStore"
}));
function useWorkView(section) {
    return useWorkViewStore((state)=>state.views[section] ?? "table");
}
function useSetWorkView(section) {
    const setView = useWorkViewStore((state)=>state.setView);
    return (mode)=>setView(section, mode);
}
}),
"[project]/apps/web/src/components/providers/zustand-hydration.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ZustandHydration",
    ()=>ZustandHydration
]);
/**
 * Zustand Hydration Provider
 *
 * CRITICAL FIX for Next.js 16 + Zustand persist hydration issues.
 *
 * Problem:
 * - Zustand persist was auto-rehydrating during Next.js Server Component hydration
 * - This caused hydration mismatches
 * - Next.js 16's cacheComponents detected mismatches and triggered continuous POST requests
 * - Result: Infinite loop of revalidation (50+ POST requests per page load)
 *
 * Solution:
 * - All Zustand stores now have `skipHydration: true`
 * - This component manually rehydrates AFTER Next.js hydration completes
 * - Prevents hydration mismatches and infinite loops
 *
 * References:
 * - https://github.com/pmndrs/zustand/issues/938
 * - https://docs.pmnd.rs/zustand/integrations/persisting-store-data#hydration-and-asynchronous-storages
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$role$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/role-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$view$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/schedule-view-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$sidebar$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/sidebar-state-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$ui$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/ui-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$user$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/user-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$view$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/view-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$work$2d$view$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/work-view-store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
// Global flag to ensure hydration only happens ONCE per session
let hasHydrated = false;
function ZustandHydration() {
    const hasRun = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // CRITICAL: Only hydrate ONCE globally, never on re-mounts or navigations
        if (hasRun.current || hasHydrated) {
            return;
        }
        hasRun.current = true;
        hasHydrated = true;
        // Manually rehydrate all persisted stores AFTER Next.js hydration completes
        // This happens once on client mount, preventing hydration mismatches
        // View/UI stores
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$work$2d$view$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWorkViewStore"].persist.rehydrate();
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$schedule$2d$view$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useScheduleViewStore"].persist.rehydrate();
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$view$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useViewStore"].persist.rehydrate();
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$sidebar$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSidebarStateStore"].persist.rehydrate();
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$ui$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUIStore"].persist.rehydrate();
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$user$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUserStore"].persist.rehydrate();
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$role$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRoleStore"].persist.rehydrate(); // CRITICAL: Dashboard depends on this
    // Filter stores rehydrate automatically (less critical for hydration)
    // Add more stores here if needed
    }, []);
    return null; // This component renders nothing
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c6c06eb2._.js.map