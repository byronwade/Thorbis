(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/components/ui/card.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Re-export from @stratos/ui package
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/index.ts [app-client] (ecmascript) <locals>");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/call/call-indicator-badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CallIndicatorBadge",
    ()=>CallIndicatorBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Call Indicator Badge - Client Component
 *
 * Client-side features:
 * - Shows when call is popped out to separate window
 * - Click to bring pop-out window to front
 * - Right-click to return call to main window
 * - Real-time call duration display
 * - Animated pulse to show active status
 *
 * Performance optimizations:
 * - Minimal footprint (only renders when call is popped out)
 * - Uses requestAnimationFrame for smooth animations
 * - Cleanup timers on unmount
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PhoneOff$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/phone-off.js [app-client] (ecmascript) <export default as PhoneOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/button.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/card.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/tooltip.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/tooltip.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function CallIndicatorBadge({ callId, customerName, customerPhone, duration, isActive, onFocusPopOut, onReturnToMain, position = "bottom-right" }) {
    _s();
    const [displayDuration, setDisplayDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(duration);
    const [showContextMenu, setShowContextMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Update duration every second
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallIndicatorBadge.useEffect": ()=>{
            if (!isActive) {
                return;
            }
            const interval = setInterval({
                "CallIndicatorBadge.useEffect.interval": ()=>{
                    setDisplayDuration({
                        "CallIndicatorBadge.useEffect.interval": (prev)=>prev + 1
                    }["CallIndicatorBadge.useEffect.interval"]);
                }
            }["CallIndicatorBadge.useEffect.interval"], 1000);
            return ({
                "CallIndicatorBadge.useEffect": ()=>clearInterval(interval)
            })["CallIndicatorBadge.useEffect"];
        }
    }["CallIndicatorBadge.useEffect"], [
        isActive
    ]);
    // Format duration as MM:SS
    const formatDuration = (seconds)=>{
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };
    // Position classes
    const positionClasses = {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6",
        "top-right": "top-24 right-6",
        "top-left": "top-24 left-6"
    };
    // Handle right-click to show context menu
    const handleContextMenu = (e)=>{
        e.preventDefault();
        setShowContextMenu(true);
    };
    // Close context menu when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallIndicatorBadge.useEffect": ()=>{
            if (!showContextMenu) {
                return;
            }
            const handleClickOutside = {
                "CallIndicatorBadge.useEffect.handleClickOutside": ()=>setShowContextMenu(false)
            }["CallIndicatorBadge.useEffect.handleClickOutside"];
            document.addEventListener("click", handleClickOutside);
            return ({
                "CallIndicatorBadge.useEffect": ()=>document.removeEventListener("click", handleClickOutside)
            })["CallIndicatorBadge.useEffect"];
        }
    }["CallIndicatorBadge.useEffect"], [
        showContextMenu
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed z-50 transition-all duration-200", positionClasses[position]),
        onContextMenu: handleContextMenu,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                            asChild: true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group relative cursor-pointer overflow-hidden", "border-primary/30 from-primary/10 to-primary/5 rounded-2xl border-2 bg-gradient-to-br", "shadow-primary/20 shadow-lg backdrop-blur-sm", "hover:border-primary/50 hover:shadow-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl", "animate-pulse-slow"),
                                onClick: onFocusPopOut,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-primary/20 absolute inset-0 animate-ping rounded-2xl opacity-75"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                                        lineNumber: 123,
                                        columnNumber: 8
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative flex items-center gap-3 p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full shadow-md",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                    className: "h-6 w-6 animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                                                    lineNumber: 129,
                                                    columnNumber: 10
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                                                lineNumber: 128,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-foreground text-sm font-semibold",
                                                        children: customerName
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                                                        lineNumber: 134,
                                                        columnNumber: 10
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-muted-foreground text-xs",
                                                        children: customerPhone
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                                                        lineNumber: 137,
                                                        columnNumber: 10
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-primary font-mono text-xs font-bold",
                                                        children: formatDuration(displayDuration)
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                                                        lineNumber: 140,
                                                        columnNumber: 10
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                                                lineNumber: 133,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                className: "ml-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100",
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    onReturnToMain();
                                                },
                                                size: "icon",
                                                variant: "ghost",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                                                    lineNumber: 155,
                                                    columnNumber: 10
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                                                lineNumber: 146,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                                        lineNumber: 126,
                                        columnNumber: 8
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                                lineNumber: 112,
                                columnNumber: 7
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                            lineNumber: 111,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                            className: "max-w-xs",
                            side: "left",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-semibold",
                                        children: "Active Call (Pop-out Window)"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                                        lineNumber: 162,
                                        columnNumber: 8
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-muted-foreground text-xs",
                                        children: "Click to bring window to front"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                                        lineNumber: 163,
                                        columnNumber: 8
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-muted-foreground text-xs",
                                        children: "Right-click or click X to return to main window"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                                        lineNumber: 166,
                                        columnNumber: 8
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                                lineNumber: 161,
                                columnNumber: 7
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                            lineNumber: 160,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                    lineNumber: 110,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                lineNumber: 109,
                columnNumber: 4
            }, this),
            showContextMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-border bg-background absolute right-0 bottom-full mb-2 rounded-lg border p-2 shadow-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    className: "w-full justify-start gap-2 text-sm",
                    onClick: (e)=>{
                        e.stopPropagation();
                        onReturnToMain();
                        setShowContextMenu(false);
                    },
                    size: "sm",
                    variant: "ghost",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PhoneOff$3e$__["PhoneOff"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                            lineNumber: 187,
                            columnNumber: 7
                        }, this),
                        "Return to Main Window"
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                    lineNumber: 177,
                    columnNumber: 6
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
                lineNumber: 176,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/call/call-indicator-badge.tsx",
        lineNumber: 102,
        columnNumber: 3
    }, this);
}
_s(CallIndicatorBadge, "aofSq7hKqpgPWr73iD6oTI2JJuU=");
_c = CallIndicatorBadge;
var _c;
__turbopack_context__.k.register(_c, "CallIndicatorBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/actions/data:c3ede4 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"604ac8c079e9497e74d11dd7c17f442078174db43f":"getCustomerByPhone"},"apps/web/src/actions/customers.ts",""] */ __turbopack_context__.s([
    "getCustomerByPhone",
    ()=>getCustomerByPhone
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var getCustomerByPhone = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("604ac8c079e9497e74d11dd7c17f442078174db43f", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getCustomerByPhone"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vY3VzdG9tZXJzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3VzdG9tZXIgTWFuYWdlbWVudCBTZXJ2ZXIgQWN0aW9uc1xuICpcbiAqIENvbXByZWhlbnNpdmUgY3VzdG9tZXIgcmVsYXRpb25zaGlwIG1hbmFnZW1lbnQgd2l0aDpcbiAqIC0gQ3VzdG9tZXIgQ1JVRCBvcGVyYXRpb25zXG4gKiAtIEN1c3RvbWVyIHBvcnRhbCBpbnZpdGF0aW9uIGFuZCBhY2Nlc3NcbiAqIC0gQ3VzdG9tZXIgbWV0cmljcyB0cmFja2luZyAocmV2ZW51ZSwgam9icywgaW52b2ljZXMpXG4gKiAtIENvbW11bmljYXRpb24gcHJlZmVyZW5jZXNcbiAqIC0gU29mdCBkZWxldGUvYXJjaGl2ZSBzdXBwb3J0XG4gKiAtIEN1c3RvbWVyIHNlYXJjaCBhbmQgZmlsdGVyaW5nXG4gKi9cblxuXCJ1c2Ugc2VydmVyXCI7XG5cbmltcG9ydCB7IGdldEFjdGl2ZUNvbXBhbnlJZCB9IGZyb20gXCJAL2xpYi9hdXRoL2NvbXBhbnktY29udGV4dFwiO1xuaW1wb3J0IHsgc2VuZEVtYWlsIH0gZnJvbSBcIkAvbGliL2VtYWlsL2VtYWlsLXNlbmRlclwiO1xuaW1wb3J0IHsgRW1haWxUZW1wbGF0ZSB9IGZyb20gXCJAL2xpYi9lbWFpbC9lbWFpbC10eXBlc1wiO1xuaW1wb3J0IHtcbiAgICBBY3Rpb25FcnJvcixcbiAgICBFUlJPUl9DT0RFUyxcbiAgICBFUlJPUl9NRVNTQUdFUyxcbn0gZnJvbSBcIkAvbGliL2Vycm9ycy9hY3Rpb24tZXJyb3JcIjtcbmltcG9ydCB7XG4gICAgdHlwZSBBY3Rpb25SZXN1bHQsXG4gICAgYXNzZXJ0QXV0aGVudGljYXRlZCxcbiAgICBhc3NlcnRFeGlzdHMsXG4gICAgd2l0aEVycm9ySGFuZGxpbmcsXG59IGZyb20gXCJAL2xpYi9lcnJvcnMvd2l0aC1lcnJvci1oYW5kbGluZ1wiO1xuaW1wb3J0IHsgZ2VvY29kZUFkZHJlc3NTaWxlbnQgfSBmcm9tIFwiQC9saWIvc2VydmljZXMvZ2VvY29kaW5nXCI7XG5pbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tIFwiQC9saWIvc3VwYWJhc2Uvc2VydmVyXCI7XG5pbXBvcnQgeyByZXZhbGlkYXRlUGF0aCB9IGZyb20gXCJuZXh0L2NhY2hlXCI7XG5pbXBvcnQgeyB6IH0gZnJvbSBcInpvZFwiO1xuaW1wb3J0IFBvcnRhbEludml0YXRpb25FbWFpbCBmcm9tIFwiLi4vLi4vZW1haWxzL3RlbXBsYXRlcy9jdXN0b21lci9wb3J0YWwtaW52aXRhdGlvblwiO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBWQUxJREFUSU9OIFNDSEVNQVNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgQ1VTVE9NRVJfTkFNRV9NQVhfTEVOR1RIID0gMTAwO1xuY29uc3QgQ1VTVE9NRVJfQ09NUEFOWV9NQVhfTEVOR1RIID0gMjAwO1xuY29uc3QgQ1VTVE9NRVJfUEhPTkVfTUFYX0xFTkdUSCA9IDIwO1xuY29uc3QgQ1VTVE9NRVJfQUREUkVTU19NQVhfTEVOR1RIID0gMjAwO1xuY29uc3QgQ1VTVE9NRVJfQUREUkVTUzJfTUFYX0xFTkdUSCA9IDEwMDtcbmNvbnN0IENVU1RPTUVSX0NJVFlfTUFYX0xFTkdUSCA9IDEwMDtcbmNvbnN0IENVU1RPTUVSX1NUQVRFX01BWF9MRU5HVEggPSA1MDtcblxuLy8gSFRUUCBTdGF0dXMgY29kZXNcbmNvbnN0IEhUVFBfU1RBVFVTX0ZPUkJJRERFTiA9IDQwMztcblxuLy8gU2VhcmNoIGRlZmF1bHRzXG5jb25zdCBERUZBVUxUX1NFQVJDSF9MSU1JVCA9IDUwO1xuY29uc3QgQ1VTVE9NRVJfWklQX01BWF9MRU5HVEggPSAyMDtcbmNvbnN0IENVU1RPTUVSX0NPVU5UUllfTUFYX0xFTkdUSCA9IDUwO1xuY29uc3QgQ1VTVE9NRVJfVEFYX0VYRU1QVF9OVU1CRVJfTUFYX0xFTkdUSCA9IDUwO1xuY29uc3QgQ0VOVFNfUEVSX0RPTExBUiA9IDEwMDtcblxuZnVuY3Rpb24gcmVxdWlyZVNpdGVVcmwoKTogc3RyaW5nIHtcblx0Y29uc3Qgc2l0ZVVybCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NJVEVfVVJMO1xuXHRpZiAoIXNpdGVVcmwpIHtcblx0XHR0aHJvdyBuZXcgQWN0aW9uRXJyb3IoXG5cdFx0XHRcIk5FWFRfUFVCTElDX1NJVEVfVVJMIGlzIG5vdCBjb25maWd1cmVkXCIsXG5cdFx0XHRFUlJPUl9DT0RFUy5JTlRFUk5BTF9TRVJWRVJfRVJST1IsXG5cdFx0KTtcblx0fVxuXHRyZXR1cm4gc2l0ZVVybC5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG59XG5cbmNvbnN0IGN1c3RvbWVyU2NoZW1hID0gei5vYmplY3Qoe1xuXHR0eXBlOiB6XG5cdFx0LmVudW0oW1wicmVzaWRlbnRpYWxcIiwgXCJjb21tZXJjaWFsXCIsIFwiaW5kdXN0cmlhbFwiXSlcblx0XHQuZGVmYXVsdChcInJlc2lkZW50aWFsXCIpLFxuXHRmaXJzdE5hbWU6IHpcblx0XHQuc3RyaW5nKClcblx0XHQubWluKDEsIFwiRmlyc3QgbmFtZSBpcyByZXF1aXJlZFwiKVxuXHRcdC5tYXgoQ1VTVE9NRVJfTkFNRV9NQVhfTEVOR1RIKSxcblx0bGFzdE5hbWU6IHpcblx0XHQuc3RyaW5nKClcblx0XHQubWluKDEsIFwiTGFzdCBuYW1lIGlzIHJlcXVpcmVkXCIpXG5cdFx0Lm1heChDVVNUT01FUl9OQU1FX01BWF9MRU5HVEgpLFxuXHRjb21wYW55TmFtZTogei5zdHJpbmcoKS5tYXgoQ1VTVE9NRVJfQ09NUEFOWV9NQVhfTEVOR1RIKS5vcHRpb25hbCgpLFxuXHRlbWFpbDogei5zdHJpbmcoKS5lbWFpbChcIkludmFsaWQgZW1haWwgYWRkcmVzc1wiKSxcblx0cGhvbmU6IHouc3RyaW5nKCkubWluKDEsIFwiUGhvbmUgaXMgcmVxdWlyZWRcIikubWF4KENVU1RPTUVSX1BIT05FX01BWF9MRU5HVEgpLFxuXHRzZWNvbmRhcnlQaG9uZTogei5zdHJpbmcoKS5tYXgoQ1VTVE9NRVJfUEhPTkVfTUFYX0xFTkdUSCkub3B0aW9uYWwoKSxcblx0YWRkcmVzczogei5zdHJpbmcoKS5tYXgoQ1VTVE9NRVJfQUREUkVTU19NQVhfTEVOR1RIKS5vcHRpb25hbCgpLFxuXHRhZGRyZXNzMjogei5zdHJpbmcoKS5tYXgoQ1VTVE9NRVJfQUREUkVTUzJfTUFYX0xFTkdUSCkub3B0aW9uYWwoKSxcblx0Y2l0eTogei5zdHJpbmcoKS5tYXgoQ1VTVE9NRVJfQ0lUWV9NQVhfTEVOR1RIKS5vcHRpb25hbCgpLFxuXHRzdGF0ZTogei5zdHJpbmcoKS5tYXgoQ1VTVE9NRVJfU1RBVEVfTUFYX0xFTkdUSCkub3B0aW9uYWwoKSxcblx0emlwQ29kZTogei5zdHJpbmcoKS5tYXgoQ1VTVE9NRVJfWklQX01BWF9MRU5HVEgpLm9wdGlvbmFsKCksXG5cdGNvdW50cnk6IHouc3RyaW5nKCkubWF4KENVU1RPTUVSX0NPVU5UUllfTUFYX0xFTkdUSCkuZGVmYXVsdChcIlVTQVwiKSxcblx0c291cmNlOiB6XG5cdFx0LmVudW0oW1wicmVmZXJyYWxcIiwgXCJnb29nbGVcIiwgXCJmYWNlYm9va1wiLCBcImRpcmVjdFwiLCBcInllbHBcIiwgXCJvdGhlclwiXSlcblx0XHQub3B0aW9uYWwoKSxcblx0cmVmZXJyZWRCeTogei5zdHJpbmcoKS51dWlkKCkub3B0aW9uYWwoKS5udWxsYWJsZSgpLFxuXHRwcmVmZXJyZWRDb250YWN0TWV0aG9kOiB6LmVudW0oW1wiZW1haWxcIiwgXCJwaG9uZVwiLCBcInNtc1wiXSkuZGVmYXVsdChcImVtYWlsXCIpLFxuXHRwcmVmZXJyZWRUZWNobmljaWFuOiB6LnN0cmluZygpLnV1aWQoKS5vcHRpb25hbCgpLm51bGxhYmxlKCksXG5cdGJpbGxpbmdFbWFpbDogei5zdHJpbmcoKS5lbWFpbCgpLm9wdGlvbmFsKCkubnVsbGFibGUoKSxcblx0cGF5bWVudFRlcm1zOiB6XG5cdFx0LmVudW0oW1wiZHVlX29uX3JlY2VpcHRcIiwgXCJuZXRfMTVcIiwgXCJuZXRfMzBcIiwgXCJuZXRfNjBcIl0pXG5cdFx0LmRlZmF1bHQoXCJkdWVfb25fcmVjZWlwdFwiKSxcblx0Y3JlZGl0TGltaXQ6IHoubnVtYmVyKCkuaW50KCkubWluKDApLmRlZmF1bHQoMCksIC8vIEluIGNlbnRzXG5cdHRheEV4ZW1wdDogei5ib29sZWFuKCkuZGVmYXVsdChmYWxzZSksXG5cdHRheEV4ZW1wdE51bWJlcjogelxuXHRcdC5zdHJpbmcoKVxuXHRcdC5tYXgoQ1VTVE9NRVJfVEFYX0VYRU1QVF9OVU1CRVJfTUFYX0xFTkdUSClcblx0XHQub3B0aW9uYWwoKSxcblx0dGFnczogei5hcnJheSh6LnN0cmluZygpKS5vcHRpb25hbCgpLFxuXHRub3Rlczogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuXHRpbnRlcm5hbE5vdGVzOiB6LnN0cmluZygpLm9wdGlvbmFsKCksXG59KTtcblxuY29uc3QgY29tbXVuaWNhdGlvblByZWZlcmVuY2VzU2NoZW1hID0gei5vYmplY3Qoe1xuXHRlbWFpbDogei5ib29sZWFuKCkuZGVmYXVsdCh0cnVlKSxcblx0c21zOiB6LmJvb2xlYW4oKS5kZWZhdWx0KHRydWUpLFxuXHRwaG9uZTogei5ib29sZWFuKCkuZGVmYXVsdCh0cnVlKSxcblx0bWFya2V0aW5nOiB6LmJvb2xlYW4oKS5kZWZhdWx0KGZhbHNlKSxcbn0pO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBDVVNUT01FUiBDUlVEIE9QRVJBVElPTlNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgY3VzdG9tZXIgd2l0aCBtdWx0aXBsZSBjb250YWN0cyBhbmQgcHJvcGVydGllc1xuICovXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVDdXN0b21lcihcblx0Zm9ybURhdGE6IEZvcm1EYXRhLFxuKTogUHJvbWlzZTxBY3Rpb25SZXN1bHQ8c3RyaW5nPj4ge1xuXHRyZXR1cm4gd2l0aEVycm9ySGFuZGxpbmcoYXN5bmMgKCkgPT4ge1xuXHRcdGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KCk7XG5cdFx0aWYgKCFzdXBhYmFzZSkge1xuXHRcdFx0dGhyb3cgbmV3IEFjdGlvbkVycm9yKFxuXHRcdFx0XHRcIkRhdGFiYXNlIGNvbm5lY3Rpb24gZmFpbGVkXCIsXG5cdFx0XHRcdEVSUk9SX0NPREVTLkRCX0NPTk5FQ1RJT05fRVJST1IsXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHtcblx0XHRcdGRhdGE6IHsgdXNlciB9LFxuXHRcdH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKTtcblx0XHRhc3NlcnRBdXRoZW50aWNhdGVkKHVzZXI/LmlkKTtcblxuXHRcdGNvbnN0IHRlYW1NZW1iZXIgPSBhd2FpdCByZXF1aXJlQ3VzdG9tZXJDb21wYW55TWVtYmVyc2hpcChcblx0XHRcdHN1cGFiYXNlLFxuXHRcdFx0dXNlci5pZCxcblx0XHQpO1xuXHRcdGNvbnN0IHsgY29udGFjdHMsIHByb3BlcnRpZXMsIHRhZ3MgfSA9XG5cdFx0XHRwYXJzZUN1c3RvbWVyQ29udGFjdHNQcm9wZXJ0aWVzQW5kVGFncyhmb3JtRGF0YSk7XG5cdFx0Y29uc3QgcHJpbWFyeUNvbnRhY3QgPSBnZXRQcmltYXJ5Q29udGFjdE9yVGhyb3coY29udGFjdHMpO1xuXHRcdGNvbnN0IHByaW1hcnlQcm9wZXJ0eSA9IGdldFByaW1hcnlQcm9wZXJ0eShwcm9wZXJ0aWVzKTtcblxuXHRcdGF3YWl0IGFzc2VydEN1c3RvbWVyRW1haWxOb3REdXBsaWNhdGUoXG5cdFx0XHRzdXBhYmFzZSxcblx0XHRcdHRlYW1NZW1iZXIuY29tcGFueV9pZCxcblx0XHRcdHByaW1hcnlDb250YWN0LmVtYWlsLFxuXHRcdCk7XG5cblx0XHRjb25zdCBjdXN0b21lclR5cGUgPSBmb3JtRGF0YS5nZXQoXCJ0eXBlXCIpIHx8IFwicmVzaWRlbnRpYWxcIjtcblx0XHRjb25zdCBjb21wYW55TmFtZSA9IGZvcm1EYXRhLmdldChcImNvbXBhbnlOYW1lXCIpO1xuXHRcdGNvbnN0IGRpc3BsYXlOYW1lID0gYnVpbGRDdXN0b21lckRpc3BsYXlOYW1lKFxuXHRcdFx0Y3VzdG9tZXJUeXBlLFxuXHRcdFx0Y29tcGFueU5hbWUsXG5cdFx0XHRwcmltYXJ5Q29udGFjdCxcblx0XHQpO1xuXG5cdFx0Y29uc3QgY29tbXVuaWNhdGlvblByZWZlcmVuY2VzID0gYnVpbGREZWZhdWx0Q29tbXVuaWNhdGlvblByZWZlcmVuY2VzKCk7XG5cdFx0Y29uc3QgY3VzdG9tZXJNZXRhZGF0YSA9IGJ1aWxkQ3VzdG9tZXJNZXRhZGF0YShjb250YWN0cyk7XG5cblx0XHRjb25zdCB7IGxhdDogY3VzdG9tZXJMYXQsIGxvbjogY3VzdG9tZXJMb24gfSA9XG5cdFx0XHRhd2FpdCBnZW9jb2RlUHJpbWFyeVByb3BlcnR5SWZBdmFpbGFibGUocHJpbWFyeVByb3BlcnR5KTtcblxuXHRcdGNvbnN0IGN1c3RvbWVyID0gYXdhaXQgaW5zZXJ0Q3VzdG9tZXJSZWNvcmQoc3VwYWJhc2UsIHtcblx0XHRcdGNvbXBhbnlJZDogdGVhbU1lbWJlci5jb21wYW55X2lkLFxuXHRcdFx0Y3VzdG9tZXJUeXBlLFxuXHRcdFx0cHJpbWFyeUNvbnRhY3QsXG5cdFx0XHRjb21wYW55TmFtZVZhbHVlOiBjb21wYW55TmFtZSxcblx0XHRcdGRpc3BsYXlOYW1lLFxuXHRcdFx0cHJpbWFyeVByb3BlcnR5LFxuXHRcdFx0Y3VzdG9tZXJMYXQsXG5cdFx0XHRjdXN0b21lckxvbixcblx0XHRcdGZvcm1EYXRhLFxuXHRcdFx0dGFncyxcblx0XHRcdGNvbW11bmljYXRpb25QcmVmZXJlbmNlcyxcblx0XHRcdGN1c3RvbWVyTWV0YWRhdGEsXG5cdFx0fSk7XG5cblx0XHRhd2FpdCBpbnNlcnRBZGRpdGlvbmFsUHJvcGVydGllc0lmQW55KFxuXHRcdFx0c3VwYWJhc2UsXG5cdFx0XHR0ZWFtTWVtYmVyLmNvbXBhbnlfaWQsXG5cdFx0XHRjdXN0b21lci5pZCxcblx0XHRcdHByb3BlcnRpZXMsXG5cdFx0KTtcblxuXHRcdHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9jdXN0b21lcnNcIik7XG5cdFx0cmV0dXJuIGN1c3RvbWVyLmlkO1xuXHR9KTtcbn1cblxudHlwZSBQYXJzZWRDdXN0b21lckNvbnRhY3QgPSB7XG5cdGZpcnN0TmFtZTogc3RyaW5nO1xuXHRsYXN0TmFtZTogc3RyaW5nO1xuXHRlbWFpbDogc3RyaW5nO1xuXHRwaG9uZTogc3RyaW5nO1xuXHRyb2xlOiBzdHJpbmc7XG5cdGlzUHJpbWFyeTogYm9vbGVhbjtcbn07XG5cbnR5cGUgUGFyc2VkQ3VzdG9tZXJQcm9wZXJ0eSA9IHtcblx0bmFtZTogc3RyaW5nO1xuXHRhZGRyZXNzOiBzdHJpbmc7XG5cdGFkZHJlc3MyOiBzdHJpbmc7XG5cdGNpdHk6IHN0cmluZztcblx0c3RhdGU6IHN0cmluZztcblx0emlwQ29kZTogc3RyaW5nO1xuXHRjb3VudHJ5OiBzdHJpbmc7XG5cdHByb3BlcnR5VHlwZTogc3RyaW5nO1xuXHRpc1ByaW1hcnk6IGJvb2xlYW47XG5cdG5vdGVzOiBzdHJpbmc7XG59O1xuXG50eXBlIFBhcnNlZEN1c3RvbWVyRm9ybUNvbGxlY3Rpb25zID0ge1xuXHRjb250YWN0czogUGFyc2VkQ3VzdG9tZXJDb250YWN0W107XG5cdHByb3BlcnRpZXM6IFBhcnNlZEN1c3RvbWVyUHJvcGVydHlbXTtcblx0dGFncz86IHN0cmluZ1tdO1xufTtcblxuYXN5bmMgZnVuY3Rpb24gcmVxdWlyZUN1c3RvbWVyQ29tcGFueU1lbWJlcnNoaXAoXG5cdHN1cGFiYXNlOiBOb25OdWxsYWJsZTxBd2FpdGVkPFJldHVyblR5cGU8dHlwZW9mIGNyZWF0ZUNsaWVudD4+Pixcblx0dXNlcklkOiBzdHJpbmcsXG4pIHtcblx0Y29uc3QgeyBkYXRhOiB0ZWFtTWVtYmVyIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdC5mcm9tKFwiY29tcGFueV9tZW1iZXJzaGlwc1wiKVxuXHRcdC5zZWxlY3QoXCJjb21wYW55X2lkXCIpXG5cdFx0LmVxKFwidXNlcl9pZFwiLCB1c2VySWQpXG5cdFx0LnNpbmdsZSgpO1xuXG5cdGlmICghdGVhbU1lbWJlcj8uY29tcGFueV9pZCkge1xuXHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFwiWW91IG11c3QgYmUgcGFydCBvZiBhIGNvbXBhbnlcIixcblx0XHRcdEVSUk9SX0NPREVTLkFVVEhfRk9SQklEREVOLFxuXHRcdFx0SFRUUF9TVEFUVVNfRk9SQklEREVOLFxuXHRcdCk7XG5cdH1cblxuXHRyZXR1cm4gdGVhbU1lbWJlcjtcbn1cblxuZnVuY3Rpb24gcGFyc2VDdXN0b21lckNvbnRhY3RzUHJvcGVydGllc0FuZFRhZ3MoXG5cdGZvcm1EYXRhOiBGb3JtRGF0YSxcbik6IFBhcnNlZEN1c3RvbWVyRm9ybUNvbGxlY3Rpb25zIHtcblx0Y29uc3QgY29udGFjdHMgPSBwYXJzZUNvbnRhY3RzKGZvcm1EYXRhLmdldChcImNvbnRhY3RzXCIpKTtcblx0Y29uc3QgcHJvcGVydGllcyA9IHBhcnNlUHJvcGVydGllcyhmb3JtRGF0YS5nZXQoXCJwcm9wZXJ0aWVzXCIpKTtcblx0Y29uc3QgdGFncyA9IHBhcnNlVGFnc0ZpZWxkKGZvcm1EYXRhLmdldChcInRhZ3NcIikpO1xuXG5cdHJldHVybiB7IGNvbnRhY3RzLCBwcm9wZXJ0aWVzLCB0YWdzIH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlQ29udGFjdHMoXG5cdHZhbHVlOiBGb3JtRGF0YUVudHJ5VmFsdWUgfCBudWxsLFxuKTogUGFyc2VkQ3VzdG9tZXJDb250YWN0W10ge1xuXHRpZiAoIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikge1xuXHRcdHJldHVybiBbXTtcblx0fVxuXG5cdHRyeSB7XG5cdFx0cmV0dXJuIEpTT04ucGFyc2UodmFsdWUpIGFzIFBhcnNlZEN1c3RvbWVyQ29udGFjdFtdO1xuXHR9IGNhdGNoIHtcblx0XHR0aHJvdyBuZXcgQWN0aW9uRXJyb3IoXG5cdFx0XHRcIkludmFsaWQgY29udGFjdHMgZGF0YVwiLFxuXHRcdFx0RVJST1JfQ09ERVMuVkFMSURBVElPTl9GQUlMRUQsXG5cdFx0KTtcblx0fVxufVxuXG5mdW5jdGlvbiBwYXJzZVByb3BlcnRpZXMoXG5cdHZhbHVlOiBGb3JtRGF0YUVudHJ5VmFsdWUgfCBudWxsLFxuKTogUGFyc2VkQ3VzdG9tZXJQcm9wZXJ0eVtdIHtcblx0aWYgKCF2YWx1ZSB8fCB0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHtcblx0XHRyZXR1cm4gW107XG5cdH1cblxuXHR0cnkge1xuXHRcdHJldHVybiBKU09OLnBhcnNlKHZhbHVlKSBhcyBQYXJzZWRDdXN0b21lclByb3BlcnR5W107XG5cdH0gY2F0Y2gge1xuXHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFwiSW52YWxpZCBwcm9wZXJ0aWVzIGRhdGFcIixcblx0XHRcdEVSUk9SX0NPREVTLlZBTElEQVRJT05fRkFJTEVELFxuXHRcdCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFyc2VUYWdzRmllbGQoXG5cdHZhbHVlOiBGb3JtRGF0YUVudHJ5VmFsdWUgfCBudWxsLFxuKTogc3RyaW5nW10gfCB1bmRlZmluZWQge1xuXHRpZiAoIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHRyeSB7XG5cdFx0cmV0dXJuIEpTT04ucGFyc2UodmFsdWUpIGFzIHN0cmluZ1tdO1xuXHR9IGNhdGNoIHtcblx0XHRyZXR1cm4gdmFsdWUuc3BsaXQoXCIsXCIpLm1hcCgodCkgPT4gdC50cmltKCkpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGdldFByaW1hcnlDb250YWN0T3JUaHJvdyhcblx0Y29udGFjdHM6IFBhcnNlZEN1c3RvbWVyQ29udGFjdFtdLFxuKTogUGFyc2VkQ3VzdG9tZXJDb250YWN0IHtcblx0Y29uc3QgcHJpbWFyeUNvbnRhY3QgPSBjb250YWN0cy5maW5kKChjKSA9PiBjLmlzUHJpbWFyeSkgfHwgY29udGFjdHNbMF07XG5cdGlmICghcHJpbWFyeUNvbnRhY3QpIHtcblx0XHR0aHJvdyBuZXcgQWN0aW9uRXJyb3IoXG5cdFx0XHRcIkF0IGxlYXN0IG9uZSBjb250YWN0IGlzIHJlcXVpcmVkXCIsXG5cdFx0XHRFUlJPUl9DT0RFUy5WQUxJREFUSU9OX0ZBSUxFRCxcblx0XHQpO1xuXHR9XG5cdHJldHVybiBwcmltYXJ5Q29udGFjdDtcbn1cblxuZnVuY3Rpb24gZ2V0UHJpbWFyeVByb3BlcnR5KFxuXHRwcm9wZXJ0aWVzOiBQYXJzZWRDdXN0b21lclByb3BlcnR5W10sXG4pOiBQYXJzZWRDdXN0b21lclByb3BlcnR5IHwgdW5kZWZpbmVkIHtcblx0cmV0dXJuIHByb3BlcnRpZXMuZmluZCgocCkgPT4gcC5pc1ByaW1hcnkpIHx8IHByb3BlcnRpZXNbMF07XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGFzc2VydEN1c3RvbWVyRW1haWxOb3REdXBsaWNhdGUoXG5cdHN1cGFiYXNlOiBOb25OdWxsYWJsZTxBd2FpdGVkPFJldHVyblR5cGU8dHlwZW9mIGNyZWF0ZUNsaWVudD4+Pixcblx0Y29tcGFueUlkOiBzdHJpbmcsXG5cdGVtYWlsOiBzdHJpbmcsXG4pIHtcblx0Y29uc3QgeyBkYXRhOiBleGlzdGluZ0VtYWlsIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdC5mcm9tKFwiY3VzdG9tZXJzXCIpXG5cdFx0LnNlbGVjdChcImlkXCIpXG5cdFx0LmVxKFwiY29tcGFueV9pZFwiLCBjb21wYW55SWQpXG5cdFx0LmVxKFwiZW1haWxcIiwgZW1haWwpXG5cdFx0LmlzKFwiZGVsZXRlZF9hdFwiLCBudWxsKVxuXHRcdC5zaW5nbGUoKTtcblxuXHRpZiAoZXhpc3RpbmdFbWFpbCkge1xuXHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFwiQSBjdXN0b21lciB3aXRoIHRoaXMgZW1haWwgYWxyZWFkeSBleGlzdHNcIixcblx0XHRcdEVSUk9SX0NPREVTLkRCX0RVUExJQ0FURV9FTlRSWSxcblx0XHQpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ3VzdG9tZXJEaXNwbGF5TmFtZShcblx0Y3VzdG9tZXJUeXBlOiBGb3JtRGF0YUVudHJ5VmFsdWUgfCBudWxsLFxuXHRjb21wYW55TmFtZVZhbHVlOiBGb3JtRGF0YUVudHJ5VmFsdWUgfCBudWxsLFxuXHRwcmltYXJ5Q29udGFjdDogUGFyc2VkQ3VzdG9tZXJDb250YWN0LFxuKTogc3RyaW5nIHtcblx0Y29uc3QgY29tcGFueU5hbWUgPSBjb21wYW55TmFtZVZhbHVlID8gU3RyaW5nKGNvbXBhbnlOYW1lVmFsdWUpIDogbnVsbDtcblxuXHRpZiAoY3VzdG9tZXJUeXBlID09PSBcImNvbW1lcmNpYWxcIiAmJiBjb21wYW55TmFtZSkge1xuXHRcdHJldHVybiBjb21wYW55TmFtZTtcblx0fVxuXG5cdHJldHVybiBgJHtwcmltYXJ5Q29udGFjdC5maXJzdE5hbWV9ICR7cHJpbWFyeUNvbnRhY3QubGFzdE5hbWV9YDtcbn1cblxuZnVuY3Rpb24gYnVpbGREZWZhdWx0Q29tbXVuaWNhdGlvblByZWZlcmVuY2VzKCkge1xuXHRyZXR1cm4ge1xuXHRcdGVtYWlsOiB0cnVlLFxuXHRcdHNtczogdHJ1ZSxcblx0XHRwaG9uZTogdHJ1ZSxcblx0XHRtYXJrZXRpbmc6IGZhbHNlLFxuXHR9O1xufVxuXG5mdW5jdGlvbiBidWlsZEN1c3RvbWVyTWV0YWRhdGEoY29udGFjdHM6IFBhcnNlZEN1c3RvbWVyQ29udGFjdFtdKSB7XG5cdHJldHVybiB7XG5cdFx0Y29udGFjdHM6IGNvbnRhY3RzLm1hcCgoYykgPT4gKHtcblx0XHRcdGZpcnN0TmFtZTogYy5maXJzdE5hbWUsXG5cdFx0XHRsYXN0TmFtZTogYy5sYXN0TmFtZSxcblx0XHRcdGVtYWlsOiBjLmVtYWlsLFxuXHRcdFx0cGhvbmU6IGMucGhvbmUsXG5cdFx0XHRyb2xlOiBjLnJvbGUsXG5cdFx0XHRpc1ByaW1hcnk6IGMuaXNQcmltYXJ5LFxuXHRcdH0pKSxcblx0fTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2VvY29kZVByaW1hcnlQcm9wZXJ0eUlmQXZhaWxhYmxlKFxuXHRwcmltYXJ5UHJvcGVydHk6IFBhcnNlZEN1c3RvbWVyUHJvcGVydHkgfCB1bmRlZmluZWQsXG4pOiBQcm9taXNlPHsgbGF0OiBudW1iZXIgfCBudWxsOyBsb246IG51bWJlciB8IG51bGwgfT4ge1xuXHRpZiAoXG5cdFx0IShcblx0XHRcdHByaW1hcnlQcm9wZXJ0eT8uYWRkcmVzcyAmJlxuXHRcdFx0cHJpbWFyeVByb3BlcnR5LmNpdHkgJiZcblx0XHRcdHByaW1hcnlQcm9wZXJ0eS5zdGF0ZSAmJlxuXHRcdFx0cHJpbWFyeVByb3BlcnR5LnppcENvZGVcblx0XHQpXG5cdCkge1xuXHRcdHJldHVybiB7IGxhdDogbnVsbCwgbG9uOiBudWxsIH07XG5cdH1cblxuXHRjb25zdCBnZW9jb2RlUmVzdWx0ID0gYXdhaXQgZ2VvY29kZUFkZHJlc3NTaWxlbnQoXG5cdFx0cHJpbWFyeVByb3BlcnR5LmFkZHJlc3MsXG5cdFx0cHJpbWFyeVByb3BlcnR5LmNpdHksXG5cdFx0cHJpbWFyeVByb3BlcnR5LnN0YXRlLFxuXHRcdHByaW1hcnlQcm9wZXJ0eS56aXBDb2RlLFxuXHRcdHByaW1hcnlQcm9wZXJ0eS5jb3VudHJ5IHx8IFwiVVNBXCIsXG5cdCk7XG5cblx0aWYgKCFnZW9jb2RlUmVzdWx0KSB7XG5cdFx0cmV0dXJuIHsgbGF0OiBudWxsLCBsb246IG51bGwgfTtcblx0fVxuXG5cdHJldHVybiB7IGxhdDogZ2VvY29kZVJlc3VsdC5sYXQsIGxvbjogZ2VvY29kZVJlc3VsdC5sb24gfTtcbn1cblxudHlwZSBJbnNlcnRDdXN0b21lclBhcmFtcyA9IHtcblx0Y29tcGFueUlkOiBzdHJpbmc7XG5cdGN1c3RvbWVyVHlwZTogRm9ybURhdGFFbnRyeVZhbHVlIHwgbnVsbDtcblx0cHJpbWFyeUNvbnRhY3Q6IFBhcnNlZEN1c3RvbWVyQ29udGFjdDtcblx0Y29tcGFueU5hbWVWYWx1ZTogRm9ybURhdGFFbnRyeVZhbHVlIHwgbnVsbDtcblx0ZGlzcGxheU5hbWU6IHN0cmluZztcblx0cHJpbWFyeVByb3BlcnR5PzogUGFyc2VkQ3VzdG9tZXJQcm9wZXJ0eTtcblx0Y3VzdG9tZXJMYXQ6IG51bWJlciB8IG51bGw7XG5cdGN1c3RvbWVyTG9uOiBudW1iZXIgfCBudWxsO1xuXHRmb3JtRGF0YTogRm9ybURhdGE7XG5cdHRhZ3M/OiBzdHJpbmdbXTtcblx0Y29tbXVuaWNhdGlvblByZWZlcmVuY2VzOiB7XG5cdFx0ZW1haWw6IGJvb2xlYW47XG5cdFx0c21zOiBib29sZWFuO1xuXHRcdHBob25lOiBib29sZWFuO1xuXHRcdG1hcmtldGluZzogYm9vbGVhbjtcblx0fTtcblx0Y3VzdG9tZXJNZXRhZGF0YTogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG59O1xuXG5hc3luYyBmdW5jdGlvbiBpbnNlcnRDdXN0b21lclJlY29yZChcblx0c3VwYWJhc2U6IE5vbk51bGxhYmxlPEF3YWl0ZWQ8UmV0dXJuVHlwZTx0eXBlb2YgY3JlYXRlQ2xpZW50Pj4+LFxuXHRwYXJhbXM6IEluc2VydEN1c3RvbWVyUGFyYW1zLFxuKSB7XG5cdGNvbnN0IHBheWxvYWQgPSBidWlsZEN1c3RvbWVySW5zZXJ0UGF5bG9hZChwYXJhbXMpO1xuXG5cdGNvbnN0IHsgZGF0YTogY3VzdG9tZXIsIGVycm9yOiBjcmVhdGVFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHQuZnJvbShcImN1c3RvbWVyc1wiKVxuXHRcdC5pbnNlcnQocGF5bG9hZClcblx0XHQuc2VsZWN0KFwiaWRcIilcblx0XHQuc2luZ2xlKCk7XG5cblx0aWYgKGNyZWF0ZUVycm9yIHx8ICFjdXN0b21lcikge1xuXHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdEVSUk9SX01FU1NBR0VTLm9wZXJhdGlvbkZhaWxlZChcImNyZWF0ZSBjdXN0b21lclwiKSxcblx0XHRcdEVSUk9SX0NPREVTLkRCX1FVRVJZX0VSUk9SLFxuXHRcdCk7XG5cdH1cblxuXHRyZXR1cm4gY3VzdG9tZXI7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ3VzdG9tZXJJbnNlcnRQYXlsb2FkKFxuXHRwYXJhbXM6IEluc2VydEN1c3RvbWVyUGFyYW1zLFxuKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuXHRjb25zdCB7XG5cdFx0Y29tcGFueUlkLFxuXHRcdGN1c3RvbWVyVHlwZSxcblx0XHRwcmltYXJ5Q29udGFjdCxcblx0XHRjb21wYW55TmFtZVZhbHVlLFxuXHRcdGRpc3BsYXlOYW1lLFxuXHRcdHByaW1hcnlQcm9wZXJ0eSxcblx0XHRjdXN0b21lckxhdCxcblx0XHRjdXN0b21lckxvbixcblx0XHRmb3JtRGF0YSxcblx0XHR0YWdzLFxuXHRcdGNvbW11bmljYXRpb25QcmVmZXJlbmNlcyxcblx0XHRjdXN0b21lck1ldGFkYXRhLFxuXHR9ID0gcGFyYW1zO1xuXG5cdGNvbnN0IGNvbXBhbnlOYW1lID0gY29tcGFueU5hbWVWYWx1ZSA/IFN0cmluZyhjb21wYW55TmFtZVZhbHVlKSA6IG51bGw7XG5cblx0cmV0dXJuIHtcblx0XHRjb21wYW55X2lkOiBjb21wYW55SWQsXG5cdFx0dHlwZTogU3RyaW5nKGN1c3RvbWVyVHlwZSB8fCBcInJlc2lkZW50aWFsXCIpLFxuXHRcdGZpcnN0X25hbWU6IHByaW1hcnlDb250YWN0LmZpcnN0TmFtZSxcblx0XHRsYXN0X25hbWU6IHByaW1hcnlDb250YWN0Lmxhc3ROYW1lLFxuXHRcdGNvbXBhbnlfbmFtZTogY29tcGFueU5hbWUsXG5cdFx0ZGlzcGxheV9uYW1lOiBkaXNwbGF5TmFtZSxcblx0XHRlbWFpbDogcHJpbWFyeUNvbnRhY3QuZW1haWwsXG5cdFx0cGhvbmU6IHByaW1hcnlDb250YWN0LnBob25lLFxuXHRcdHNlY29uZGFyeV9waG9uZTogbnVsbCxcblx0XHRhZGRyZXNzOiBwcmltYXJ5UHJvcGVydHk/LmFkZHJlc3MgfHwgbnVsbCxcblx0XHRhZGRyZXNzMjogcHJpbWFyeVByb3BlcnR5Py5hZGRyZXNzMiB8fCBudWxsLFxuXHRcdGNpdHk6IHByaW1hcnlQcm9wZXJ0eT8uY2l0eSB8fCBudWxsLFxuXHRcdHN0YXRlOiBwcmltYXJ5UHJvcGVydHk/LnN0YXRlIHx8IG51bGwsXG5cdFx0emlwX2NvZGU6IHByaW1hcnlQcm9wZXJ0eT8uemlwQ29kZSB8fCBudWxsLFxuXHRcdGNvdW50cnk6IHByaW1hcnlQcm9wZXJ0eT8uY291bnRyeSB8fCBcIlVTQVwiLFxuXHRcdGxhdDogY3VzdG9tZXJMYXQsXG5cdFx0bG9uOiBjdXN0b21lckxvbixcblx0XHRzb3VyY2U6IGZvcm1EYXRhLmdldChcInNvdXJjZVwiKSA/IFN0cmluZyhmb3JtRGF0YS5nZXQoXCJzb3VyY2VcIikpIDogbnVsbCxcblx0XHRyZWZlcnJlZF9ieTogZm9ybURhdGEuZ2V0KFwicmVmZXJyZWRCeVwiKVxuXHRcdFx0PyBTdHJpbmcoZm9ybURhdGEuZ2V0KFwicmVmZXJyZWRCeVwiKSlcblx0XHRcdDogbnVsbCxcblx0XHRwcmVmZXJyZWRfY29udGFjdF9tZXRob2Q6XG5cdFx0XHRTdHJpbmcoZm9ybURhdGEuZ2V0KFwicHJlZmVycmVkQ29udGFjdE1ldGhvZFwiKSkgfHwgXCJlbWFpbFwiLFxuXHRcdHByZWZlcnJlZF90ZWNobmljaWFuOiBmb3JtRGF0YS5nZXQoXCJwcmVmZXJyZWRUZWNobmljaWFuXCIpXG5cdFx0XHQ/IFN0cmluZyhmb3JtRGF0YS5nZXQoXCJwcmVmZXJyZWRUZWNobmljaWFuXCIpKVxuXHRcdFx0OiBudWxsLFxuXHRcdGJpbGxpbmdfZW1haWw6IGZvcm1EYXRhLmdldChcImJpbGxpbmdFbWFpbFwiKVxuXHRcdFx0PyBTdHJpbmcoZm9ybURhdGEuZ2V0KFwiYmlsbGluZ0VtYWlsXCIpKVxuXHRcdFx0OiBudWxsLFxuXHRcdHBheW1lbnRfdGVybXM6IFN0cmluZyhmb3JtRGF0YS5nZXQoXCJwYXltZW50VGVybXNcIikpIHx8IFwiZHVlX29uX3JlY2VpcHRcIixcblx0XHRjcmVkaXRfbGltaXQ6IGZvcm1EYXRhLmdldChcImNyZWRpdExpbWl0XCIpXG5cdFx0XHQ/IE51bWJlcihmb3JtRGF0YS5nZXQoXCJjcmVkaXRMaW1pdFwiKSkgKiBDRU5UU19QRVJfRE9MTEFSXG5cdFx0XHQ6IDAsXG5cdFx0dGF4X2V4ZW1wdDogZm9ybURhdGEuZ2V0KFwidGF4RXhlbXB0XCIpID09PSBcIm9uXCIsXG5cdFx0dGF4X2V4ZW1wdF9udW1iZXI6IGZvcm1EYXRhLmdldChcInRheEV4ZW1wdE51bWJlclwiKVxuXHRcdFx0PyBTdHJpbmcoZm9ybURhdGEuZ2V0KFwidGF4RXhlbXB0TnVtYmVyXCIpKVxuXHRcdFx0OiBudWxsLFxuXHRcdHRhZ3M6IHRhZ3MgfHwgbnVsbCxcblx0XHRjb21tdW5pY2F0aW9uX3ByZWZlcmVuY2VzOiBjb21tdW5pY2F0aW9uUHJlZmVyZW5jZXMsXG5cdFx0bm90ZXM6IGZvcm1EYXRhLmdldChcIm5vdGVzXCIpID8gU3RyaW5nKGZvcm1EYXRhLmdldChcIm5vdGVzXCIpKSA6IG51bGwsXG5cdFx0aW50ZXJuYWxfbm90ZXM6IGZvcm1EYXRhLmdldChcImludGVybmFsTm90ZXNcIilcblx0XHRcdD8gU3RyaW5nKGZvcm1EYXRhLmdldChcImludGVybmFsTm90ZXNcIikpXG5cdFx0XHQ6IG51bGwsXG5cdFx0bWV0YWRhdGE6IGN1c3RvbWVyTWV0YWRhdGEsXG5cdFx0c3RhdHVzOiBcImFjdGl2ZVwiLFxuXHRcdHBvcnRhbF9lbmFibGVkOiBmYWxzZSxcblx0XHR0b3RhbF9yZXZlbnVlOiAwLFxuXHRcdHRvdGFsX2pvYnM6IDAsXG5cdFx0dG90YWxfaW52b2ljZXM6IDAsXG5cdFx0YXZlcmFnZV9qb2JfdmFsdWU6IDAsXG5cdFx0b3V0c3RhbmRpbmdfYmFsYW5jZTogMCxcblx0fTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaW5zZXJ0QWRkaXRpb25hbFByb3BlcnRpZXNJZkFueShcblx0c3VwYWJhc2U6IE5vbk51bGxhYmxlPEF3YWl0ZWQ8UmV0dXJuVHlwZTx0eXBlb2YgY3JlYXRlQ2xpZW50Pj4+LFxuXHRjb21wYW55SWQ6IHN0cmluZyxcblx0Y3VzdG9tZXJJZDogc3RyaW5nLFxuXHRwcm9wZXJ0aWVzOiBQYXJzZWRDdXN0b21lclByb3BlcnR5W10sXG4pIHtcblx0Y29uc3QgYWRkaXRpb25hbFByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzLmZpbHRlcigocCkgPT4gIXAuaXNQcmltYXJ5KTtcblx0aWYgKGFkZGl0aW9uYWxQcm9wZXJ0aWVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IHByb3BlcnRpZXNUb0luc2VydCA9IGF3YWl0IFByb21pc2UuYWxsKFxuXHRcdGFkZGl0aW9uYWxQcm9wZXJ0aWVzLm1hcChhc3luYyAocHJvcCkgPT4ge1xuXHRcdFx0bGV0IHByb3BMYXQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXHRcdFx0bGV0IHByb3BMb246IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG5cdFx0XHRpZiAocHJvcC5hZGRyZXNzICYmIHByb3AuY2l0eSAmJiBwcm9wLnN0YXRlICYmIHByb3AuemlwQ29kZSkge1xuXHRcdFx0XHRjb25zdCBnZW9jb2RlUmVzdWx0ID0gYXdhaXQgZ2VvY29kZUFkZHJlc3NTaWxlbnQoXG5cdFx0XHRcdFx0cHJvcC5hZGRyZXNzLFxuXHRcdFx0XHRcdHByb3AuY2l0eSxcblx0XHRcdFx0XHRwcm9wLnN0YXRlLFxuXHRcdFx0XHRcdHByb3AuemlwQ29kZSxcblx0XHRcdFx0XHRwcm9wLmNvdW50cnkgfHwgXCJVU0FcIixcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRpZiAoZ2VvY29kZVJlc3VsdCkge1xuXHRcdFx0XHRcdHByb3BMYXQgPSBnZW9jb2RlUmVzdWx0LmxhdDtcblx0XHRcdFx0XHRwcm9wTG9uID0gZ2VvY29kZVJlc3VsdC5sb247XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0Y29tcGFueV9pZDogY29tcGFueUlkLFxuXHRcdFx0XHRjdXN0b21lcl9pZDogY3VzdG9tZXJJZCxcblx0XHRcdFx0bmFtZTogcHJvcC5uYW1lIHx8IFwiQWRkaXRpb25hbCBQcm9wZXJ0eVwiLFxuXHRcdFx0XHRhZGRyZXNzOiBwcm9wLmFkZHJlc3MsXG5cdFx0XHRcdGFkZHJlc3MyOiBwcm9wLmFkZHJlc3MyIHx8IG51bGwsXG5cdFx0XHRcdGNpdHk6IHByb3AuY2l0eSxcblx0XHRcdFx0c3RhdGU6IHByb3Auc3RhdGUsXG5cdFx0XHRcdHppcF9jb2RlOiBwcm9wLnppcENvZGUsXG5cdFx0XHRcdGNvdW50cnk6IHByb3AuY291bnRyeSB8fCBcIlVTQVwiLFxuXHRcdFx0XHRwcm9wZXJ0eV90eXBlOiBwcm9wLnByb3BlcnR5VHlwZSB8fCBcInJlc2lkZW50aWFsXCIsXG5cdFx0XHRcdG5vdGVzOiBwcm9wLm5vdGVzIHx8IG51bGwsXG5cdFx0XHRcdGxhdDogcHJvcExhdCxcblx0XHRcdFx0bG9uOiBwcm9wTG9uLFxuXHRcdFx0fTtcblx0XHR9KSxcblx0KTtcblxuXHRhd2FpdCBzdXBhYmFzZS5mcm9tKFwicHJvcGVydGllc1wiKS5pbnNlcnQocHJvcGVydGllc1RvSW5zZXJ0KTtcbn1cblxuLyoqXG4gKiBVcGRhdGUgZXhpc3RpbmcgY3VzdG9tZXJcbiAqL1xuYXN5bmMgZnVuY3Rpb24gdXBkYXRlQ3VzdG9tZXIoXG5cdGN1c3RvbWVySWQ6IHN0cmluZyxcblx0Zm9ybURhdGE6IEZvcm1EYXRhLFxuKTogUHJvbWlzZTxBY3Rpb25SZXN1bHQ8dm9pZD4+IHtcblx0cmV0dXJuIHdpdGhFcnJvckhhbmRsaW5nKGFzeW5jICgpID0+IHtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFx0XCJEYXRhYmFzZSBjb25uZWN0aW9uIGZhaWxlZFwiLFxuXHRcdFx0XHRFUlJPUl9DT0RFUy5EQl9DT05ORUNUSU9OX0VSUk9SLFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRjb25zdCB7XG5cdFx0XHRkYXRhOiB7IHVzZXIgfSxcblx0XHR9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKCk7XG5cdFx0YXNzZXJ0QXV0aGVudGljYXRlZCh1c2VyPy5pZCk7XG5cblx0XHRjb25zdCB0ZWFtTWVtYmVyID0gYXdhaXQgcmVxdWlyZUN1c3RvbWVyQ29tcGFueU1lbWJlcnNoaXAoXG5cdFx0XHRzdXBhYmFzZSxcblx0XHRcdHVzZXIuaWQsXG5cdFx0KTtcblxuXHRcdC8vIFZlcmlmeSBjdXN0b21lciBleGlzdHMgYW5kIGJlbG9uZ3MgdG8gY29tcGFueVxuXHRcdGNvbnN0IHsgZGF0YTogY3VzdG9tZXIgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImN1c3RvbWVyc1wiKVxuXHRcdFx0LnNlbGVjdChcImlkLCBjb21wYW55X2lkLCBlbWFpbFwiKVxuXHRcdFx0LmVxKFwiaWRcIiwgY3VzdG9tZXJJZClcblx0XHRcdC5pcyhcImRlbGV0ZWRfYXRcIiwgbnVsbClcblx0XHRcdC5zaW5nbGUoKTtcblxuXHRcdGFzc2VydEV4aXN0cyhjdXN0b21lciwgXCJDdXN0b21lclwiKTtcblxuXHRcdGlmIChjdXN0b21lci5jb21wYW55X2lkICE9PSB0ZWFtTWVtYmVyLmNvbXBhbnlfaWQpIHtcblx0XHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFx0XCJDdXN0b21lciBub3QgZm91bmRcIixcblx0XHRcdFx0RVJST1JfQ09ERVMuQVVUSF9GT1JCSURERU4sXG5cdFx0XHRcdEhUVFBfU1RBVFVTX0ZPUkJJRERFTixcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Ly8gUGFyc2UgdGFncyBpZiBwcm92aWRlZFxuXHRcdGxldCB0YWdzOiBzdHJpbmdbXSB8IHVuZGVmaW5lZDtcblx0XHRjb25zdCB0YWdzU3RyaW5nID0gZm9ybURhdGEuZ2V0KFwidGFnc1wiKTtcblx0XHRpZiAodGFnc1N0cmluZyAmJiB0eXBlb2YgdGFnc1N0cmluZyA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dGFncyA9IEpTT04ucGFyc2UodGFnc1N0cmluZyk7XG5cdFx0XHR9IGNhdGNoIHtcblx0XHRcdFx0dGFncyA9IHRhZ3NTdHJpbmcuc3BsaXQoXCIsXCIpLm1hcCgodCkgPT4gdC50cmltKCkpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFZhbGlkYXRlIGlucHV0XG5cdFx0Y29uc3QgZGF0YSA9IGN1c3RvbWVyU2NoZW1hLnBhcnNlKHtcblx0XHRcdHR5cGU6IGZvcm1EYXRhLmdldChcInR5cGVcIikgfHwgXCJyZXNpZGVudGlhbFwiLFxuXHRcdFx0Zmlyc3ROYW1lOiBmb3JtRGF0YS5nZXQoXCJmaXJzdE5hbWVcIiksXG5cdFx0XHRsYXN0TmFtZTogZm9ybURhdGEuZ2V0KFwibGFzdE5hbWVcIiksXG5cdFx0XHRjb21wYW55TmFtZTogZm9ybURhdGEuZ2V0KFwiY29tcGFueU5hbWVcIikgfHwgdW5kZWZpbmVkLFxuXHRcdFx0ZW1haWw6IGZvcm1EYXRhLmdldChcImVtYWlsXCIpLFxuXHRcdFx0cGhvbmU6IGZvcm1EYXRhLmdldChcInBob25lXCIpLFxuXHRcdFx0c2Vjb25kYXJ5UGhvbmU6IGZvcm1EYXRhLmdldChcInNlY29uZGFyeVBob25lXCIpIHx8IHVuZGVmaW5lZCxcblx0XHRcdGFkZHJlc3M6IGZvcm1EYXRhLmdldChcImFkZHJlc3NcIikgfHwgdW5kZWZpbmVkLFxuXHRcdFx0YWRkcmVzczI6IGZvcm1EYXRhLmdldChcImFkZHJlc3MyXCIpIHx8IHVuZGVmaW5lZCxcblx0XHRcdGNpdHk6IGZvcm1EYXRhLmdldChcImNpdHlcIikgfHwgdW5kZWZpbmVkLFxuXHRcdFx0c3RhdGU6IGZvcm1EYXRhLmdldChcInN0YXRlXCIpIHx8IHVuZGVmaW5lZCxcblx0XHRcdHppcENvZGU6IGZvcm1EYXRhLmdldChcInppcENvZGVcIikgfHwgdW5kZWZpbmVkLFxuXHRcdFx0Y291bnRyeTogZm9ybURhdGEuZ2V0KFwiY291bnRyeVwiKSB8fCBcIlVTQVwiLFxuXHRcdFx0c291cmNlOiBmb3JtRGF0YS5nZXQoXCJzb3VyY2VcIikgfHwgdW5kZWZpbmVkLFxuXHRcdFx0cmVmZXJyZWRCeTogZm9ybURhdGEuZ2V0KFwicmVmZXJyZWRCeVwiKSB8fCBudWxsLFxuXHRcdFx0cHJlZmVycmVkQ29udGFjdE1ldGhvZDogZm9ybURhdGEuZ2V0KFwicHJlZmVycmVkQ29udGFjdE1ldGhvZFwiKSB8fCBcImVtYWlsXCIsXG5cdFx0XHRwcmVmZXJyZWRUZWNobmljaWFuOiBmb3JtRGF0YS5nZXQoXCJwcmVmZXJyZWRUZWNobmljaWFuXCIpIHx8IG51bGwsXG5cdFx0XHRiaWxsaW5nRW1haWw6IGZvcm1EYXRhLmdldChcImJpbGxpbmdFbWFpbFwiKSB8fCBudWxsLFxuXHRcdFx0cGF5bWVudFRlcm1zOiBmb3JtRGF0YS5nZXQoXCJwYXltZW50VGVybXNcIikgfHwgXCJkdWVfb25fcmVjZWlwdFwiLFxuXHRcdFx0Y3JlZGl0TGltaXQ6IGZvcm1EYXRhLmdldChcImNyZWRpdExpbWl0XCIpXG5cdFx0XHRcdD8gTnVtYmVyKGZvcm1EYXRhLmdldChcImNyZWRpdExpbWl0XCIpKVxuXHRcdFx0XHQ6IDAsXG5cdFx0XHR0YXhFeGVtcHQ6IGZvcm1EYXRhLmdldChcInRheEV4ZW1wdFwiKSA9PT0gXCJ0cnVlXCIsXG5cdFx0XHR0YXhFeGVtcHROdW1iZXI6IGZvcm1EYXRhLmdldChcInRheEV4ZW1wdE51bWJlclwiKSB8fCB1bmRlZmluZWQsXG5cdFx0XHR0YWdzLFxuXHRcdFx0bm90ZXM6IGZvcm1EYXRhLmdldChcIm5vdGVzXCIpIHx8IHVuZGVmaW5lZCxcblx0XHRcdGludGVybmFsTm90ZXM6IGZvcm1EYXRhLmdldChcImludGVybmFsTm90ZXNcIikgfHwgdW5kZWZpbmVkLFxuXHRcdH0pO1xuXG5cdFx0Ly8gQ2hlY2sgaWYgZW1haWwgYWxyZWFkeSBleGlzdHMgKGV4Y2x1ZGluZyBjdXJyZW50IGN1c3RvbWVyKVxuXHRcdGlmIChkYXRhLmVtYWlsICE9PSBjdXN0b21lci5lbWFpbCkge1xuXHRcdFx0Y29uc3QgeyBkYXRhOiBleGlzdGluZ0VtYWlsIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0XHQuZnJvbShcImN1c3RvbWVyc1wiKVxuXHRcdFx0XHQuc2VsZWN0KFwiaWRcIilcblx0XHRcdFx0LmVxKFwiY29tcGFueV9pZFwiLCB0ZWFtTWVtYmVyLmNvbXBhbnlfaWQpXG5cdFx0XHRcdC5lcShcImVtYWlsXCIsIGRhdGEuZW1haWwpXG5cdFx0XHRcdC5uZXEoXCJpZFwiLCBjdXN0b21lcklkKVxuXHRcdFx0XHQuaXMoXCJkZWxldGVkX2F0XCIsIG51bGwpXG5cdFx0XHRcdC5zaW5nbGUoKTtcblxuXHRcdFx0aWYgKGV4aXN0aW5nRW1haWwpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEFjdGlvbkVycm9yKFxuXHRcdFx0XHRcdFwiQSBjdXN0b21lciB3aXRoIHRoaXMgZW1haWwgYWxyZWFkeSBleGlzdHNcIixcblx0XHRcdFx0XHRFUlJPUl9DT0RFUy5EQl9EVVBMSUNBVEVfRU5UUlksXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gR2VuZXJhdGUgZGlzcGxheSBuYW1lXG5cdFx0Y29uc3QgZGlzcGxheU5hbWUgPVxuXHRcdFx0ZGF0YS50eXBlID09PSBcImNvbW1lcmNpYWxcIiAmJiBkYXRhLmNvbXBhbnlOYW1lXG5cdFx0XHRcdD8gZGF0YS5jb21wYW55TmFtZVxuXHRcdFx0XHQ6IGAke2RhdGEuZmlyc3ROYW1lfSAke2RhdGEubGFzdE5hbWV9YDtcblxuXHRcdGNvbnN0IGNvbXBhbnlOYW1lID0gZGF0YS5jb21wYW55TmFtZSA/IFN0cmluZyhkYXRhLmNvbXBhbnlOYW1lKSA6IG51bGw7XG5cblx0XHQvLyBVcGRhdGUgY3VzdG9tZXJcblx0XHRjb25zdCB7IGVycm9yOiB1cGRhdGVFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwiY3VzdG9tZXJzXCIpXG5cdFx0XHQudXBkYXRlKHtcblx0XHRcdFx0dHlwZTogZGF0YS50eXBlLFxuXHRcdFx0XHRmaXJzdF9uYW1lOiBkYXRhLmZpcnN0TmFtZSxcblx0XHRcdFx0bGFzdF9uYW1lOiBkYXRhLmxhc3ROYW1lLFxuXHRcdFx0XHRjb21wYW55X25hbWU6IGNvbXBhbnlOYW1lLFxuXHRcdFx0XHRkaXNwbGF5X25hbWU6IGRpc3BsYXlOYW1lLFxuXHRcdFx0XHRlbWFpbDogZGF0YS5lbWFpbCxcblx0XHRcdFx0cGhvbmU6IGRhdGEucGhvbmUsXG5cdFx0XHRcdHNlY29uZGFyeV9waG9uZTogZGF0YS5zZWNvbmRhcnlQaG9uZSxcblx0XHRcdFx0YWRkcmVzczogZGF0YS5hZGRyZXNzLFxuXHRcdFx0XHRhZGRyZXNzMjogZGF0YS5hZGRyZXNzMixcblx0XHRcdFx0Y2l0eTogZGF0YS5jaXR5LFxuXHRcdFx0XHRzdGF0ZTogZGF0YS5zdGF0ZSxcblx0XHRcdFx0emlwX2NvZGU6IGRhdGEuemlwQ29kZSxcblx0XHRcdFx0Y291bnRyeTogZGF0YS5jb3VudHJ5LFxuXHRcdFx0XHRzb3VyY2U6IGRhdGEuc291cmNlLFxuXHRcdFx0XHRyZWZlcnJlZF9ieTogZGF0YS5yZWZlcnJlZEJ5LFxuXHRcdFx0XHRwcmVmZXJyZWRfY29udGFjdF9tZXRob2Q6IGRhdGEucHJlZmVycmVkQ29udGFjdE1ldGhvZCxcblx0XHRcdFx0cHJlZmVycmVkX3RlY2huaWNpYW46IGRhdGEucHJlZmVycmVkVGVjaG5pY2lhbixcblx0XHRcdFx0YmlsbGluZ19lbWFpbDogZGF0YS5iaWxsaW5nRW1haWwsXG5cdFx0XHRcdHBheW1lbnRfdGVybXM6IGRhdGEucGF5bWVudFRlcm1zLFxuXHRcdFx0XHRjcmVkaXRfbGltaXQ6IGRhdGEuY3JlZGl0TGltaXQsXG5cdFx0XHRcdHRheF9leGVtcHQ6IGRhdGEudGF4RXhlbXB0LFxuXHRcdFx0XHR0YXhfZXhlbXB0X251bWJlcjogZGF0YS50YXhFeGVtcHROdW1iZXIsXG5cdFx0XHRcdHRhZ3M6IGRhdGEudGFncyxcblx0XHRcdFx0bm90ZXM6IGRhdGEubm90ZXMsXG5cdFx0XHRcdGludGVybmFsX25vdGVzOiBkYXRhLmludGVybmFsTm90ZXMsXG5cdFx0XHR9KVxuXHRcdFx0LmVxKFwiaWRcIiwgY3VzdG9tZXJJZCk7XG5cblx0XHRpZiAodXBkYXRlRXJyb3IpIHtcblx0XHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFx0RVJST1JfTUVTU0FHRVMub3BlcmF0aW9uRmFpbGVkKFwidXBkYXRlIGN1c3RvbWVyXCIpLFxuXHRcdFx0XHRFUlJPUl9DT0RFUy5EQl9RVUVSWV9FUlJPUixcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL2N1c3RvbWVyc1wiKTtcblx0XHRyZXZhbGlkYXRlUGF0aChgL2Rhc2hib2FyZC9jdXN0b21lcnMvJHtjdXN0b21lcklkfWApO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBEZWxldGUgY3VzdG9tZXIgKHNvZnQgZGVsZXRlL2FyY2hpdmUpXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVDdXN0b21lcihcblx0Y3VzdG9tZXJJZDogc3RyaW5nLFxuKTogUHJvbWlzZTxBY3Rpb25SZXN1bHQ8dm9pZD4+IHtcblx0cmV0dXJuIHdpdGhFcnJvckhhbmRsaW5nKGFzeW5jICgpID0+IHtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFx0XCJEYXRhYmFzZSBjb25uZWN0aW9uIGZhaWxlZFwiLFxuXHRcdFx0XHRFUlJPUl9DT0RFUy5EQl9DT05ORUNUSU9OX0VSUk9SLFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRjb25zdCB7XG5cdFx0XHRkYXRhOiB7IHVzZXIgfSxcblx0XHR9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKCk7XG5cdFx0YXNzZXJ0QXV0aGVudGljYXRlZCh1c2VyPy5pZCk7XG5cblx0XHRjb25zdCB0ZWFtTWVtYmVyID0gYXdhaXQgcmVxdWlyZUN1c3RvbWVyQ29tcGFueU1lbWJlcnNoaXAoXG5cdFx0XHRzdXBhYmFzZSxcblx0XHRcdHVzZXIuaWQsXG5cdFx0KTtcblxuXHRcdC8vIFZlcmlmeSBjdXN0b21lciBleGlzdHMgYW5kIGJlbG9uZ3MgdG8gY29tcGFueVxuXHRcdGNvbnN0IHsgZGF0YTogY3VzdG9tZXIgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImN1c3RvbWVyc1wiKVxuXHRcdFx0LnNlbGVjdChcImlkLCBjb21wYW55X2lkLCBvdXRzdGFuZGluZ19iYWxhbmNlXCIpXG5cdFx0XHQuZXEoXCJpZFwiLCBjdXN0b21lcklkKVxuXHRcdFx0LmlzKFwiZGVsZXRlZF9hdFwiLCBudWxsKVxuXHRcdFx0LnNpbmdsZSgpO1xuXG5cdFx0YXNzZXJ0RXhpc3RzKGN1c3RvbWVyLCBcIkN1c3RvbWVyXCIpO1xuXG5cdFx0aWYgKGN1c3RvbWVyLmNvbXBhbnlfaWQgIT09IHRlYW1NZW1iZXIuY29tcGFueV9pZCkge1xuXHRcdFx0dGhyb3cgbmV3IEFjdGlvbkVycm9yKFxuXHRcdFx0XHRcIkN1c3RvbWVyIG5vdCBmb3VuZFwiLFxuXHRcdFx0XHRFUlJPUl9DT0RFUy5BVVRIX0ZPUkJJRERFTixcblx0XHRcdFx0SFRUUF9TVEFUVVNfRk9SQklEREVOLFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHQvLyBQcmV2ZW50IGRlbGV0aW9uIGlmIGN1c3RvbWVyIGhhcyBvdXRzdGFuZGluZyBiYWxhbmNlXG5cdFx0aWYgKGN1c3RvbWVyLm91dHN0YW5kaW5nX2JhbGFuY2UgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgQWN0aW9uRXJyb3IoXG5cdFx0XHRcdFwiQ2Fubm90IGRlbGV0ZSBjdXN0b21lciB3aXRoIG91dHN0YW5kaW5nIGJhbGFuY2UuIENvbGxlY3QgcGF5bWVudCBmaXJzdC5cIixcblx0XHRcdFx0RVJST1JfQ09ERVMuQlVTSU5FU1NfUlVMRV9WSU9MQVRJT04sXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdC8vIFNvZnQgZGVsZXRlXG5cdFx0Y29uc3QgeyBlcnJvcjogZGVsZXRlRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImN1c3RvbWVyc1wiKVxuXHRcdFx0LnVwZGF0ZSh7XG5cdFx0XHRcdGRlbGV0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcblx0XHRcdFx0ZGVsZXRlZF9ieTogdXNlci5pZCxcblx0XHRcdFx0c3RhdHVzOiBcImFyY2hpdmVkXCIsXG5cdFx0XHR9KVxuXHRcdFx0LmVxKFwiaWRcIiwgY3VzdG9tZXJJZCk7XG5cblx0XHRpZiAoZGVsZXRlRXJyb3IpIHtcblx0XHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFx0RVJST1JfTUVTU0FHRVMub3BlcmF0aW9uRmFpbGVkKFwiZGVsZXRlIGN1c3RvbWVyXCIpLFxuXHRcdFx0XHRFUlJPUl9DT0RFUy5EQl9RVUVSWV9FUlJPUixcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL2N1c3RvbWVyc1wiKTtcblx0fSk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIENVU1RPTUVSIFNUQVRVUyAmIFBSRUZFUkVOQ0VTXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogVXBkYXRlIGN1c3RvbWVyIHN0YXR1c1xuICovXG5hc3luYyBmdW5jdGlvbiB1cGRhdGVDdXN0b21lclN0YXR1cyhcblx0Y3VzdG9tZXJJZDogc3RyaW5nLFxuXHRzdGF0dXM6IFwiYWN0aXZlXCIgfCBcImluYWN0aXZlXCIgfCBcImFyY2hpdmVkXCIgfCBcImJsb2NrZWRcIixcbik6IFByb21pc2U8QWN0aW9uUmVzdWx0PHZvaWQ+PiB7XG5cdHJldHVybiB3aXRoRXJyb3JIYW5kbGluZyhhc3luYyAoKSA9PiB7XG5cdFx0Y29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcblx0XHRpZiAoIXN1cGFiYXNlKSB7XG5cdFx0XHR0aHJvdyBuZXcgQWN0aW9uRXJyb3IoXG5cdFx0XHRcdFwiRGF0YWJhc2UgY29ubmVjdGlvbiBmYWlsZWRcIixcblx0XHRcdFx0RVJST1JfQ09ERVMuREJfQ09OTkVDVElPTl9FUlJPUixcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qge1xuXHRcdFx0ZGF0YTogeyB1c2VyIH0sXG5cdFx0fSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZ2V0VXNlcigpO1xuXHRcdGFzc2VydEF1dGhlbnRpY2F0ZWQodXNlcj8uaWQpO1xuXG5cdFx0Y29uc3QgdGVhbU1lbWJlciA9IGF3YWl0IHJlcXVpcmVDdXN0b21lckNvbXBhbnlNZW1iZXJzaGlwKFxuXHRcdFx0c3VwYWJhc2UsXG5cdFx0XHR1c2VyLmlkLFxuXHRcdCk7XG5cblx0XHQvLyBWZXJpZnkgY3VzdG9tZXIgZXhpc3RzIGFuZCBiZWxvbmdzIHRvIGNvbXBhbnlcblx0XHRjb25zdCB7IGRhdGE6IGN1c3RvbWVyIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJjdXN0b21lcnNcIilcblx0XHRcdC5zZWxlY3QoXCJpZCwgY29tcGFueV9pZFwiKVxuXHRcdFx0LmVxKFwiaWRcIiwgY3VzdG9tZXJJZClcblx0XHRcdC5pcyhcImRlbGV0ZWRfYXRcIiwgbnVsbClcblx0XHRcdC5zaW5nbGUoKTtcblxuXHRcdGFzc2VydEV4aXN0cyhjdXN0b21lciwgXCJDdXN0b21lclwiKTtcblxuXHRcdGlmIChjdXN0b21lci5jb21wYW55X2lkICE9PSB0ZWFtTWVtYmVyLmNvbXBhbnlfaWQpIHtcblx0XHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFx0XCJDdXN0b21lciBub3QgZm91bmRcIixcblx0XHRcdFx0RVJST1JfQ09ERVMuQVVUSF9GT1JCSURERU4sXG5cdFx0XHRcdEhUVFBfU1RBVFVTX0ZPUkJJRERFTixcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Ly8gVXBkYXRlIHN0YXR1c1xuXHRcdGNvbnN0IHsgZXJyb3I6IHVwZGF0ZUVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJjdXN0b21lcnNcIilcblx0XHRcdC51cGRhdGUoeyBzdGF0dXMgfSlcblx0XHRcdC5lcShcImlkXCIsIGN1c3RvbWVySWQpO1xuXG5cdFx0aWYgKHVwZGF0ZUVycm9yKSB7XG5cdFx0XHR0aHJvdyBuZXcgQWN0aW9uRXJyb3IoXG5cdFx0XHRcdEVSUk9SX01FU1NBR0VTLm9wZXJhdGlvbkZhaWxlZChcInVwZGF0ZSBjdXN0b21lciBzdGF0dXNcIiksXG5cdFx0XHRcdEVSUk9SX0NPREVTLkRCX1FVRVJZX0VSUk9SLFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXZhbGlkYXRlUGF0aChcIi9kYXNoYm9hcmQvY3VzdG9tZXJzXCIpO1xuXHRcdHJldmFsaWRhdGVQYXRoKGAvZGFzaGJvYXJkL2N1c3RvbWVycy8ke2N1c3RvbWVySWR9YCk7XG5cdH0pO1xufVxuXG4vKipcbiAqIFVwZGF0ZSBjb21tdW5pY2F0aW9uIHByZWZlcmVuY2VzXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUNvbW11bmljYXRpb25QcmVmZXJlbmNlcyhcblx0Y3VzdG9tZXJJZDogc3RyaW5nLFxuXHRmb3JtRGF0YTogRm9ybURhdGEsXG4pOiBQcm9taXNlPEFjdGlvblJlc3VsdDx2b2lkPj4ge1xuXHRyZXR1cm4gd2l0aEVycm9ySGFuZGxpbmcoYXN5bmMgKCkgPT4ge1xuXHRcdGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KCk7XG5cdFx0aWYgKCFzdXBhYmFzZSkge1xuXHRcdFx0dGhyb3cgbmV3IEFjdGlvbkVycm9yKFxuXHRcdFx0XHRcIkRhdGFiYXNlIGNvbm5lY3Rpb24gZmFpbGVkXCIsXG5cdFx0XHRcdEVSUk9SX0NPREVTLkRCX0NPTk5FQ1RJT05fRVJST1IsXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHtcblx0XHRcdGRhdGE6IHsgdXNlciB9LFxuXHRcdH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKTtcblx0XHRhc3NlcnRBdXRoZW50aWNhdGVkKHVzZXI/LmlkKTtcblxuXHRcdGNvbnN0IHRlYW1NZW1iZXIgPSBhd2FpdCByZXF1aXJlQ3VzdG9tZXJDb21wYW55TWVtYmVyc2hpcChcblx0XHRcdHN1cGFiYXNlLFxuXHRcdFx0dXNlci5pZCxcblx0XHQpO1xuXG5cdFx0Ly8gVmVyaWZ5IGN1c3RvbWVyIGV4aXN0cyBhbmQgYmVsb25ncyB0byBjb21wYW55XG5cdFx0Y29uc3QgeyBkYXRhOiBjdXN0b21lciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwiY3VzdG9tZXJzXCIpXG5cdFx0XHQuc2VsZWN0KFwiaWQsIGNvbXBhbnlfaWRcIilcblx0XHRcdC5lcShcImlkXCIsIGN1c3RvbWVySWQpXG5cdFx0XHQuaXMoXCJkZWxldGVkX2F0XCIsIG51bGwpXG5cdFx0XHQuc2luZ2xlKCk7XG5cblx0XHRhc3NlcnRFeGlzdHMoY3VzdG9tZXIsIFwiQ3VzdG9tZXJcIik7XG5cblx0XHRpZiAoY3VzdG9tZXIuY29tcGFueV9pZCAhPT0gdGVhbU1lbWJlci5jb21wYW55X2lkKSB7XG5cdFx0XHR0aHJvdyBuZXcgQWN0aW9uRXJyb3IoXG5cdFx0XHRcdFwiQ3VzdG9tZXIgbm90IGZvdW5kXCIsXG5cdFx0XHRcdEVSUk9SX0NPREVTLkFVVEhfRk9SQklEREVOLFxuXHRcdFx0XHRIVFRQX1NUQVRVU19GT1JCSURERU4sXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdC8vIFZhbGlkYXRlIGlucHV0XG5cdFx0Y29uc3QgcHJlZmVyZW5jZXMgPSBjb21tdW5pY2F0aW9uUHJlZmVyZW5jZXNTY2hlbWEucGFyc2Uoe1xuXHRcdFx0ZW1haWw6IGZvcm1EYXRhLmdldChcImVtYWlsXCIpID09PSBcInRydWVcIixcblx0XHRcdHNtczogZm9ybURhdGEuZ2V0KFwic21zXCIpID09PSBcInRydWVcIixcblx0XHRcdHBob25lOiBmb3JtRGF0YS5nZXQoXCJwaG9uZVwiKSA9PT0gXCJ0cnVlXCIsXG5cdFx0XHRtYXJrZXRpbmc6IGZvcm1EYXRhLmdldChcIm1hcmtldGluZ1wiKSA9PT0gXCJ0cnVlXCIsXG5cdFx0fSk7XG5cblx0XHQvLyBVcGRhdGUgcHJlZmVyZW5jZXNcblx0XHRjb25zdCB7IGVycm9yOiB1cGRhdGVFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwiY3VzdG9tZXJzXCIpXG5cdFx0XHQudXBkYXRlKHsgY29tbXVuaWNhdGlvbl9wcmVmZXJlbmNlczogcHJlZmVyZW5jZXMgfSlcblx0XHRcdC5lcShcImlkXCIsIGN1c3RvbWVySWQpO1xuXG5cdFx0aWYgKHVwZGF0ZUVycm9yKSB7XG5cdFx0XHR0aHJvdyBuZXcgQWN0aW9uRXJyb3IoXG5cdFx0XHRcdEVSUk9SX01FU1NBR0VTLm9wZXJhdGlvbkZhaWxlZChcInVwZGF0ZSBjb21tdW5pY2F0aW9uIHByZWZlcmVuY2VzXCIpLFxuXHRcdFx0XHRFUlJPUl9DT0RFUy5EQl9RVUVSWV9FUlJPUixcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV2YWxpZGF0ZVBhdGgoYC9kYXNoYm9hcmQvY3VzdG9tZXJzLyR7Y3VzdG9tZXJJZH1gKTtcblx0fSk7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIENVU1RPTUVSIFBPUlRBTFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIEludml0ZSBjdXN0b21lciB0byBwb3J0YWxcbiAqIFNlbmRzIGFuIGVtYWlsIHdpdGggYSBzZWN1cmUgdG9rZW4tYmFzZWQgaW52aXRhdGlvbiBsaW5rLlxuICovXG5hc3luYyBmdW5jdGlvbiBpbnZpdGVUb1BvcnRhbChcblx0Y3VzdG9tZXJJZDogc3RyaW5nLFxuKTogUHJvbWlzZTxBY3Rpb25SZXN1bHQ8dm9pZD4+IHtcblx0cmV0dXJuIHdpdGhFcnJvckhhbmRsaW5nKGFzeW5jICgpID0+IHtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFx0XCJEYXRhYmFzZSBjb25uZWN0aW9uIGZhaWxlZFwiLFxuXHRcdFx0XHRFUlJPUl9DT0RFUy5EQl9DT05ORUNUSU9OX0VSUk9SLFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRjb25zdCB7XG5cdFx0XHRkYXRhOiB7IHVzZXIgfSxcblx0XHR9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKCk7XG5cdFx0YXNzZXJ0QXV0aGVudGljYXRlZCh1c2VyPy5pZCk7XG5cblx0XHRjb25zdCB0ZWFtTWVtYmVyID0gYXdhaXQgcmVxdWlyZUN1c3RvbWVyQ29tcGFueU1lbWJlcnNoaXAoXG5cdFx0XHRzdXBhYmFzZSxcblx0XHRcdHVzZXIuaWQsXG5cdFx0KTtcblxuXHRcdC8vIFZlcmlmeSBjdXN0b21lciBleGlzdHMgYW5kIGJlbG9uZ3MgdG8gY29tcGFueVxuXHRcdGNvbnN0IHsgZGF0YTogY3VzdG9tZXIgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImN1c3RvbWVyc1wiKVxuXHRcdFx0LnNlbGVjdChcImlkLCBjb21wYW55X2lkLCBlbWFpbCwgZGlzcGxheV9uYW1lLCBwb3J0YWxfZW5hYmxlZFwiKVxuXHRcdFx0LmVxKFwiaWRcIiwgY3VzdG9tZXJJZClcblx0XHRcdC5pcyhcImRlbGV0ZWRfYXRcIiwgbnVsbClcblx0XHRcdC5zaW5nbGUoKTtcblxuXHRcdGFzc2VydEV4aXN0cyhjdXN0b21lciwgXCJDdXN0b21lclwiKTtcblxuXHRcdGlmIChjdXN0b21lci5jb21wYW55X2lkICE9PSB0ZWFtTWVtYmVyLmNvbXBhbnlfaWQpIHtcblx0XHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFx0XCJDdXN0b21lciBub3QgZm91bmRcIixcblx0XHRcdFx0RVJST1JfQ09ERVMuQVVUSF9GT1JCSURERU4sXG5cdFx0XHRcdEhUVFBfU1RBVFVTX0ZPUkJJRERFTixcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0aWYgKGN1c3RvbWVyLnBvcnRhbF9lbmFibGVkKSB7XG5cdFx0XHR0aHJvdyBuZXcgQWN0aW9uRXJyb3IoXG5cdFx0XHRcdFwiQ3VzdG9tZXIgaXMgYWxyZWFkeSBpbnZpdGVkIHRvIHBvcnRhbFwiLFxuXHRcdFx0XHRFUlJPUl9DT0RFUy5CVVNJTkVTU19SVUxFX1ZJT0xBVElPTixcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Ly8gR2VuZXJhdGUgc2VjdXJlIHBvcnRhbCBpbnZpdGF0aW9uIHRva2VuXG5cdFx0Y29uc3QgaW52aXRlVG9rZW4gPSBCdWZmZXIuZnJvbShcblx0XHRcdGAke2N1c3RvbWVySWR9OiR7RGF0ZS5ub3coKX06JHtNYXRoLnJhbmRvbSgpfWAsXG5cdFx0KS50b1N0cmluZyhcImJhc2U2NHVybFwiKTtcblxuXHRcdC8vIFVwZGF0ZSBjdXN0b21lclxuXHRcdGNvbnN0IHsgZXJyb3I6IHVwZGF0ZUVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJjdXN0b21lcnNcIilcblx0XHRcdC51cGRhdGUoe1xuXHRcdFx0XHRwb3J0YWxfZW5hYmxlZDogdHJ1ZSxcblx0XHRcdFx0cG9ydGFsX2ludml0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcblx0XHRcdH0pXG5cdFx0XHQuZXEoXCJpZFwiLCBjdXN0b21lcklkKTtcblxuXHRcdGlmICh1cGRhdGVFcnJvcikge1xuXHRcdFx0dGhyb3cgbmV3IEFjdGlvbkVycm9yKFxuXHRcdFx0XHRFUlJPUl9NRVNTQUdFUy5vcGVyYXRpb25GYWlsZWQoXCJpbnZpdGUgY3VzdG9tZXIgdG8gcG9ydGFsXCIpLFxuXHRcdFx0XHRFUlJPUl9DT0RFUy5EQl9RVUVSWV9FUlJPUixcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Ly8gU2VuZCBpbnZpdGF0aW9uIGVtYWlsXG5cdFx0Y29uc3Qgc2l0ZVVybCA9IHJlcXVpcmVTaXRlVXJsKCk7XG5cdFx0Y29uc3QgcG9ydGFsVXJsID0gYCR7c2l0ZVVybH0vcG9ydGFsL3NldHVwP3Rva2VuPSR7aW52aXRlVG9rZW59YDtcblxuXHRcdGNvbnN0IGVtYWlsUmVzdWx0ID0gYXdhaXQgc2VuZEVtYWlsKHtcblx0XHRcdHRvOiBjdXN0b21lci5lbWFpbCxcblx0XHRcdHN1YmplY3Q6IFwiWW91J3ZlIGJlZW4gaW52aXRlZCB0byB5b3VyIEN1c3RvbWVyIFBvcnRhbFwiLFxuXHRcdFx0dGVtcGxhdGU6IFBvcnRhbEludml0YXRpb25FbWFpbCh7XG5cdFx0XHRcdGN1c3RvbWVyTmFtZTogY3VzdG9tZXIuZGlzcGxheV9uYW1lLFxuXHRcdFx0XHRwb3J0YWxVcmwsXG5cdFx0XHRcdGV4cGlyZXNJbkhvdXJzOiAxNjgsIC8vIDcgZGF5c1xuXHRcdFx0XHRzdXBwb3J0RW1haWw6IHByb2Nlc3MuZW52LlJFU0VORF9GUk9NX0VNQUlMIHx8IFwic3VwcG9ydEB0aG9yYmlzLmNvbVwiLFxuXHRcdFx0XHRzdXBwb3J0UGhvbmU6IFwiKDU1NSkgMTIzLTQ1NjdcIixcblx0XHRcdH0pLFxuXHRcdFx0dGVtcGxhdGVUeXBlOiBFbWFpbFRlbXBsYXRlLlBPUlRBTF9JTlZJVEFUSU9OLFxuXHRcdH0pO1xuXG5cdFx0aWYgKCFlbWFpbFJlc3VsdC5zdWNjZXNzKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0cmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL2N1c3RvbWVyc1wiKTtcblx0XHRyZXZhbGlkYXRlUGF0aChgL2Rhc2hib2FyZC9jdXN0b21lcnMvJHtjdXN0b21lcklkfWApO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBSZXZva2UgcG9ydGFsIGFjY2Vzc1xuICovXG5hc3luYyBmdW5jdGlvbiByZXZva2VQb3J0YWxBY2Nlc3MoXG5cdGN1c3RvbWVySWQ6IHN0cmluZyxcbik6IFByb21pc2U8QWN0aW9uUmVzdWx0PHZvaWQ+PiB7XG5cdHJldHVybiB3aXRoRXJyb3JIYW5kbGluZyhhc3luYyAoKSA9PiB7XG5cdFx0Y29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcblx0XHRpZiAoIXN1cGFiYXNlKSB7XG5cdFx0XHR0aHJvdyBuZXcgQWN0aW9uRXJyb3IoXG5cdFx0XHRcdFwiRGF0YWJhc2UgY29ubmVjdGlvbiBmYWlsZWRcIixcblx0XHRcdFx0RVJST1JfQ09ERVMuREJfQ09OTkVDVElPTl9FUlJPUixcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qge1xuXHRcdFx0ZGF0YTogeyB1c2VyIH0sXG5cdFx0fSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZ2V0VXNlcigpO1xuXHRcdGFzc2VydEF1dGhlbnRpY2F0ZWQodXNlcj8uaWQpO1xuXG5cdFx0Y29uc3QgdGVhbU1lbWJlciA9IGF3YWl0IHJlcXVpcmVDdXN0b21lckNvbXBhbnlNZW1iZXJzaGlwKFxuXHRcdFx0c3VwYWJhc2UsXG5cdFx0XHR1c2VyLmlkLFxuXHRcdCk7XG5cblx0XHQvLyBWZXJpZnkgY3VzdG9tZXIgZXhpc3RzIGFuZCBiZWxvbmdzIHRvIGNvbXBhbnlcblx0XHRjb25zdCB7IGRhdGE6IGN1c3RvbWVyIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJjdXN0b21lcnNcIilcblx0XHRcdC5zZWxlY3QoXCJpZCwgY29tcGFueV9pZFwiKVxuXHRcdFx0LmVxKFwiaWRcIiwgY3VzdG9tZXJJZClcblx0XHRcdC5pcyhcImRlbGV0ZWRfYXRcIiwgbnVsbClcblx0XHRcdC5zaW5nbGUoKTtcblxuXHRcdGFzc2VydEV4aXN0cyhjdXN0b21lciwgXCJDdXN0b21lclwiKTtcblxuXHRcdGlmIChjdXN0b21lci5jb21wYW55X2lkICE9PSB0ZWFtTWVtYmVyLmNvbXBhbnlfaWQpIHtcblx0XHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFx0XCJDdXN0b21lciBub3QgZm91bmRcIixcblx0XHRcdFx0RVJST1JfQ09ERVMuQVVUSF9GT1JCSURERU4sXG5cdFx0XHRcdEhUVFBfU1RBVFVTX0ZPUkJJRERFTixcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Ly8gUmV2b2tlIGFjY2Vzc1xuXHRcdGNvbnN0IHsgZXJyb3I6IHVwZGF0ZUVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJjdXN0b21lcnNcIilcblx0XHRcdC51cGRhdGUoeyBwb3J0YWxfZW5hYmxlZDogZmFsc2UgfSlcblx0XHRcdC5lcShcImlkXCIsIGN1c3RvbWVySWQpO1xuXG5cdFx0aWYgKHVwZGF0ZUVycm9yKSB7XG5cdFx0XHR0aHJvdyBuZXcgQWN0aW9uRXJyb3IoXG5cdFx0XHRcdEVSUk9SX01FU1NBR0VTLm9wZXJhdGlvbkZhaWxlZChcInJldm9rZSBwb3J0YWwgYWNjZXNzXCIpLFxuXHRcdFx0XHRFUlJPUl9DT0RFUy5EQl9RVUVSWV9FUlJPUixcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL2N1c3RvbWVyc1wiKTtcblx0XHRyZXZhbGlkYXRlUGF0aChgL2Rhc2hib2FyZC9jdXN0b21lcnMvJHtjdXN0b21lcklkfWApO1xuXHR9KTtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU0VBUkNIICYgUkVQT1JUSU5HXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogR2V0IGN1c3RvbWVyIGJ5IHBob25lIG51bWJlclxuICogVXNlZCBmb3IgaW5jb21pbmcgY2FsbCBsb29rdXBzXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDdXN0b21lckJ5UGhvbmUoXG5cdHBob25lTnVtYmVyOiBzdHJpbmcsXG5cdGNvbXBhbnlJZDogc3RyaW5nLFxuKTogUHJvbWlzZTxBY3Rpb25SZXN1bHQ8dW5rbm93bj4+IHtcblx0cmV0dXJuIHdpdGhFcnJvckhhbmRsaW5nKGFzeW5jICgpID0+IHtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFx0XCJEYXRhYmFzZSBjb25uZWN0aW9uIGZhaWxlZFwiLFxuXHRcdFx0XHRFUlJPUl9DT0RFUy5EQl9DT05ORUNUSU9OX0VSUk9SLFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHQvLyBOb3JtYWxpemUgcGhvbmUgbnVtYmVyIChyZW1vdmUgZm9ybWF0dGluZylcblx0XHRjb25zdCBub3JtYWxpemVkUGhvbmUgPSBwaG9uZU51bWJlci5yZXBsYWNlKC9cXEQvZywgXCJcIik7XG5cblx0XHQvLyBTZWFyY2ggYnkgcHJpbWFyeSBwaG9uZSBvciBzZWNvbmRhcnkgcGhvbmVcblx0XHRjb25zdCB7IGRhdGE6IGN1c3RvbWVyLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwiY3VzdG9tZXJzXCIpXG5cdFx0XHQuc2VsZWN0KFxuXHRcdFx0XHRgXG4gICAgICAgICosXG4gICAgICAgIHByb3BlcnRpZXM6cHJvcGVydGllcygqKVxuICAgICAgYCxcblx0XHRcdClcblx0XHRcdC5lcShcImNvbXBhbnlfaWRcIiwgY29tcGFueUlkKVxuXHRcdFx0Lm9yKFxuXHRcdFx0XHRgcGhvbmUuZXEuJHtwaG9uZU51bWJlcn0scGhvbmUuZXEuJHtub3JtYWxpemVkUGhvbmV9LHNlY29uZGFyeV9waG9uZS5lcS4ke3Bob25lTnVtYmVyfSxzZWNvbmRhcnlfcGhvbmUuZXEuJHtub3JtYWxpemVkUGhvbmV9YCxcblx0XHRcdClcblx0XHRcdC5zaW5nbGUoKTtcblxuXHRcdGlmIChlcnJvciAmJiBlcnJvci5jb2RlICE9PSBcIlBHUlNUMTE2XCIpIHtcblx0XHRcdC8vIFBHUlNUMTE2ID0gbm8gcm93cyBmb3VuZFxuXHRcdFx0dGhyb3cgbmV3IEFjdGlvbkVycm9yKFxuXHRcdFx0XHRgRmFpbGVkIHRvIGZpbmQgY3VzdG9tZXI6ICR7ZXJyb3IubWVzc2FnZX1gLFxuXHRcdFx0XHRFUlJPUl9DT0RFUy5EQl9RVUVSWV9FUlJPUixcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGN1c3RvbWVyIHx8IG51bGw7XG5cdH0pO1xufVxuXG4vKipcbiAqIFNlYXJjaCBjdXN0b21lcnMgYnkgbmFtZSwgZW1haWwsIHBob25lLCBvciBjb21wYW55XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZWFyY2hDdXN0b21lcnMoXG5cdHNlYXJjaFRlcm06IHN0cmluZyxcblx0b3B0aW9ucz86IHsgbGltaXQ/OiBudW1iZXI7IG9mZnNldD86IG51bWJlciB9LFxuKTogUHJvbWlzZTxBY3Rpb25SZXN1bHQ8dW5rbm93bltdPj4ge1xuXHRyZXR1cm4gd2l0aEVycm9ySGFuZGxpbmcoYXN5bmMgKCkgPT4ge1xuXHRcdGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KCk7XG5cdFx0aWYgKCFzdXBhYmFzZSkge1xuXHRcdFx0dGhyb3cgbmV3IEFjdGlvbkVycm9yKFxuXHRcdFx0XHRcIkRhdGFiYXNlIGNvbm5lY3Rpb24gZmFpbGVkXCIsXG5cdFx0XHRcdEVSUk9SX0NPREVTLkRCX0NPTk5FQ1RJT05fRVJST1IsXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHtcblx0XHRcdGRhdGE6IHsgdXNlciB9LFxuXHRcdH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKTtcblx0XHRhc3NlcnRBdXRoZW50aWNhdGVkKHVzZXI/LmlkKTtcblxuXHRcdC8vIFVzZSB0aGUgYWN0aXZlIGNvbXBhbnkgSUQgaGVscGVyIChzYW1lIGFzIGdldEFsbEN1c3RvbWVycylcblx0XHRjb25zdCBhY3RpdmVDb21wYW55SWQgPSBhd2FpdCBnZXRBY3RpdmVDb21wYW55SWQoKTtcblx0XHRpZiAoIWFjdGl2ZUNvbXBhbnlJZCkge1xuXHRcdFx0dGhyb3cgbmV3IEFjdGlvbkVycm9yKFxuXHRcdFx0XHRcIk5vIGFjdGl2ZSBjb21wYW55XCIsXG5cdFx0XHRcdEVSUk9SX0NPREVTLkFVVEhfRk9SQklEREVOLFxuXHRcdFx0XHRIVFRQX1NUQVRVU19GT1JCSURERU4sXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdC8vIFZlcmlmeSB1c2VyIGhhcyBhY2Nlc3MgdG8gdGhlIGFjdGl2ZSBjb21wYW55XG5cdFx0Y29uc3QgeyBkYXRhOiB0ZWFtTWVtYmVyIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJjb21wYW55X21lbWJlcnNoaXBzXCIpXG5cdFx0XHQuc2VsZWN0KFwiY29tcGFueV9pZFwiKVxuXHRcdFx0LmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxuXHRcdFx0LmVxKFwiY29tcGFueV9pZFwiLCBhY3RpdmVDb21wYW55SWQpXG5cdFx0XHQuZXEoXCJzdGF0dXNcIiwgXCJhY3RpdmVcIilcblx0XHRcdC5tYXliZVNpbmdsZSgpO1xuXG5cdFx0aWYgKCF0ZWFtTWVtYmVyPy5jb21wYW55X2lkKSB7XG5cdFx0XHR0aHJvdyBuZXcgQWN0aW9uRXJyb3IoXG5cdFx0XHRcdFwiWW91IGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoaXMgY29tcGFueVwiLFxuXHRcdFx0XHRFUlJPUl9DT0RFUy5BVVRIX0ZPUkJJRERFTixcblx0XHRcdFx0SFRUUF9TVEFUVVNfRk9SQklEREVOLFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHQvLyBVc2UgZnVsbC10ZXh0IHNlYXJjaCB3aXRoIHJhbmtpbmcgZm9yIGJlc3QgbWF0Y2hlc1xuXHRcdC8vIFNlYXJjaGVzIGFjcm9zczogZmlyc3RfbmFtZSwgbGFzdF9uYW1lLCBkaXNwbGF5X25hbWUsIGVtYWlsLCBwaG9uZSxcblx0XHQvLyBzZWNvbmRhcnlfcGhvbmUsIGNvbXBhbnlfbmFtZSwgYWRkcmVzcywgY2l0eSwgc3RhdGVcblx0XHQvLyBSZXR1cm5zIHJlc3VsdHMgb3JkZXJlZCBieSByZWxldmFuY2UgKHdlaWdodGVkOiBuYW1lID4gY29udGFjdCA+IGFkZHJlc3MpXG5cdFx0Y29uc3QgeyBzZWFyY2hDdXN0b21lcnNGdWxsVGV4dCB9ID0gYXdhaXQgaW1wb3J0KFxuXHRcdFx0XCJAL2xpYi9zZWFyY2gvZnVsbC10ZXh0LXNlYXJjaFwiXG5cdFx0KTtcblxuXHRcdGNvbnN0IGN1c3RvbWVycyA9IGF3YWl0IHNlYXJjaEN1c3RvbWVyc0Z1bGxUZXh0KFxuXHRcdFx0c3VwYWJhc2UsXG5cdFx0XHRhY3RpdmVDb21wYW55SWQsXG5cdFx0XHRzZWFyY2hUZXJtLFxuXHRcdFx0e1xuXHRcdFx0XHRsaW1pdDogb3B0aW9ucz8ubGltaXQgfHwgREVGQVVMVF9TRUFSQ0hfTElNSVQsXG5cdFx0XHRcdG9mZnNldDogb3B0aW9ucz8ub2Zmc2V0IHx8IDAsXG5cdFx0XHR9LFxuXHRcdCk7XG5cblx0XHRyZXR1cm4gY3VzdG9tZXJzO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBHZXQgdG9wIGN1c3RvbWVycyBieSByZXZlbnVlXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGdldFRvcEN1c3RvbWVycyhcblx0bGltaXQgPSAxMCxcbik6IFByb21pc2U8QWN0aW9uUmVzdWx0PHVua25vd25bXT4+IHtcblx0cmV0dXJuIHdpdGhFcnJvckhhbmRsaW5nKGFzeW5jICgpID0+IHtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFx0XCJEYXRhYmFzZSBjb25uZWN0aW9uIGZhaWxlZFwiLFxuXHRcdFx0XHRFUlJPUl9DT0RFUy5EQl9DT05ORUNUSU9OX0VSUk9SLFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRjb25zdCB7XG5cdFx0XHRkYXRhOiB7IHVzZXIgfSxcblx0XHR9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKCk7XG5cdFx0YXNzZXJ0QXV0aGVudGljYXRlZCh1c2VyPy5pZCk7XG5cblx0XHRjb25zdCB7IGRhdGE6IHRlYW1NZW1iZXIgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImNvbXBhbnlfbWVtYmVyc2hpcHNcIilcblx0XHRcdC5zZWxlY3QoXCJjb21wYW55X2lkXCIpXG5cdFx0XHQuZXEoXCJ1c2VyX2lkXCIsIHVzZXIuaWQpXG5cdFx0XHQuc2luZ2xlKCk7XG5cblx0XHRpZiAoIXRlYW1NZW1iZXI/LmNvbXBhbnlfaWQpIHtcblx0XHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFx0XCJZb3UgbXVzdCBiZSBwYXJ0IG9mIGEgY29tcGFueVwiLFxuXHRcdFx0XHRFUlJPUl9DT0RFUy5BVVRIX0ZPUkJJRERFTixcblx0XHRcdFx0SFRUUF9TVEFUVVNfRk9SQklEREVOLFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRjb25zdCB7IGRhdGE6IGN1c3RvbWVycywgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImN1c3RvbWVyc1wiKVxuXHRcdFx0LnNlbGVjdChcIipcIilcblx0XHRcdC5lcShcImNvbXBhbnlfaWRcIiwgdGVhbU1lbWJlci5jb21wYW55X2lkKVxuXHRcdFx0LmVxKFwic3RhdHVzXCIsIFwiYWN0aXZlXCIpXG5cdFx0XHQuaXMoXCJkZWxldGVkX2F0XCIsIG51bGwpXG5cdFx0XHQub3JkZXIoXCJ0b3RhbF9yZXZlbnVlXCIsIHsgYXNjZW5kaW5nOiBmYWxzZSB9KVxuXHRcdFx0LmxpbWl0KGxpbWl0KTtcblxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0dGhyb3cgbmV3IEFjdGlvbkVycm9yKFxuXHRcdFx0XHRFUlJPUl9NRVNTQUdFUy5vcGVyYXRpb25GYWlsZWQoXCJmZXRjaCB0b3AgY3VzdG9tZXJzXCIpLFxuXHRcdFx0XHRFUlJPUl9DT0RFUy5EQl9RVUVSWV9FUlJPUixcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGN1c3RvbWVycyB8fCBbXTtcblx0fSk7XG59XG5cbi8qKlxuICogR2V0IGN1c3RvbWVycyB3aXRoIG91dHN0YW5kaW5nIGJhbGFuY2VcbiAqL1xudHlwZSBDdXN0b21lcldpdGhCYWxhbmNlID0ge1xuXHRpZDogc3RyaW5nO1xuXHRkaXNwbGF5X25hbWU6IHN0cmluZztcblx0YmFsYW5jZTogbnVtYmVyO1xufTtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0Q3VzdG9tZXJzV2l0aEJhbGFuY2UoKTogUHJvbWlzZTxcblx0QWN0aW9uUmVzdWx0PEN1c3RvbWVyV2l0aEJhbGFuY2VbXT5cbj4ge1xuXHRyZXR1cm4gd2l0aEVycm9ySGFuZGxpbmcoYXN5bmMgKCkgPT4ge1xuXHRcdGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KCk7XG5cdFx0aWYgKCFzdXBhYmFzZSkge1xuXHRcdFx0dGhyb3cgbmV3IEFjdGlvbkVycm9yKFxuXHRcdFx0XHRcIkRhdGFiYXNlIGNvbm5lY3Rpb24gZmFpbGVkXCIsXG5cdFx0XHRcdEVSUk9SX0NPREVTLkRCX0NPTk5FQ1RJT05fRVJST1IsXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHtcblx0XHRcdGRhdGE6IHsgdXNlciB9LFxuXHRcdH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKTtcblx0XHRhc3NlcnRBdXRoZW50aWNhdGVkKHVzZXI/LmlkKTtcblxuXHRcdGNvbnN0IHsgZGF0YTogdGVhbU1lbWJlciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwiY29tcGFueV9tZW1iZXJzaGlwc1wiKVxuXHRcdFx0LnNlbGVjdChcImNvbXBhbnlfaWRcIilcblx0XHRcdC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcblx0XHRcdC5zaW5nbGUoKTtcblxuXHRcdGlmICghdGVhbU1lbWJlcj8uY29tcGFueV9pZCkge1xuXHRcdFx0dGhyb3cgbmV3IEFjdGlvbkVycm9yKFxuXHRcdFx0XHRcIllvdSBtdXN0IGJlIHBhcnQgb2YgYSBjb21wYW55XCIsXG5cdFx0XHRcdEVSUk9SX0NPREVTLkFVVEhfRk9SQklEREVOLFxuXHRcdFx0XHRIVFRQX1NUQVRVU19GT1JCSURERU4sXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHsgZGF0YTogY3VzdG9tZXJzLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwiY3VzdG9tZXJzXCIpXG5cdFx0XHQuc2VsZWN0KFwiKlwiKVxuXHRcdFx0LmVxKFwiY29tcGFueV9pZFwiLCB0ZWFtTWVtYmVyLmNvbXBhbnlfaWQpXG5cdFx0XHQuaXMoXCJkZWxldGVkX2F0XCIsIG51bGwpXG5cdFx0XHQuZ3QoXCJvdXRzdGFuZGluZ19iYWxhbmNlXCIsIDApXG5cdFx0XHQub3JkZXIoXCJvdXRzdGFuZGluZ19iYWxhbmNlXCIsIHsgYXNjZW5kaW5nOiBmYWxzZSB9KVxuXHRcdFx0LmxpbWl0KDEwMCk7XG5cblx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFx0RVJST1JfTUVTU0FHRVMub3BlcmF0aW9uRmFpbGVkKFwiZmV0Y2ggY3VzdG9tZXJzIHdpdGggYmFsYW5jZVwiKSxcblx0XHRcdFx0RVJST1JfQ09ERVMuREJfUVVFUllfRVJST1IsXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdHJldHVybiBjdXN0b21lcnMgfHwgW107XG5cdH0pO1xufVxuXG50eXBlIEN1c3RvbWVyUmVjb3JkID0ge1xuXHRpZDogc3RyaW5nO1xuXHRjb21wYW55X2lkOiBzdHJpbmc7XG5cdHR5cGU6IHN0cmluZztcblx0Zmlyc3RfbmFtZTogc3RyaW5nO1xuXHRsYXN0X25hbWU6IHN0cmluZztcblx0ZGlzcGxheV9uYW1lOiBzdHJpbmc7XG5cdGNvbXBhbnlfbmFtZT86IHN0cmluZyB8IG51bGw7XG5cdGVtYWlsOiBzdHJpbmc7XG5cdHBob25lOiBzdHJpbmc7XG5cdHNlY29uZGFyeV9waG9uZT86IHN0cmluZztcblx0YWRkcmVzcz86IHN0cmluZztcblx0YWRkcmVzczI/OiBzdHJpbmc7XG5cdGNpdHk/OiBzdHJpbmc7XG5cdHN0YXRlPzogc3RyaW5nO1xuXHR6aXBfY29kZT86IHN0cmluZztcblx0c3RhdHVzOiBzdHJpbmc7XG5cdHRvdGFsX3JldmVudWU/OiBudW1iZXI7XG5cdHRvdGFsX2pvYnM/OiBudW1iZXI7XG5cdHRvdGFsX2ludm9pY2VzPzogbnVtYmVyO1xuXHRvdXRzdGFuZGluZ19iYWxhbmNlPzogbnVtYmVyO1xuXHRsYXN0X2pvYl9kYXRlPzogc3RyaW5nO1xuXHRuZXh0X3NjaGVkdWxlZF9qb2I/OiBzdHJpbmc7XG5cdGNyZWF0ZWRfYXQ6IHN0cmluZztcblx0dXBkYXRlZF9hdDogc3RyaW5nO1xuXHRhcmNoaXZlZF9hdD86IHN0cmluZyB8IG51bGw7XG5cdGRlbGV0ZWRfYXQ/OiBzdHJpbmcgfCBudWxsO1xufTtcblxuLyoqXG4gKiBHZXQgY3VzdG9tZXJzIGZvciBwaG9uZSBkaWFsZXIgKGxpZ2h0d2VpZ2h0LCBubyBlbnJpY2htZW50KVxuICpcbiAqIFBFUkZPUk1BTkNFOiBSZXR1cm5zIG9ubHkgYmFzaWMgY29udGFjdCBpbmZvIG5lZWRlZCBmb3IgZGlhbGVyLlxuICogVXNlIHRoaXMgaW5zdGVhZCBvZiBnZXRBbGxDdXN0b21lcnMoKSBpbiBBcHBIZWFkZXIgdG8gYXZvaWQgTisxIHF1ZXJpZXMuXG4gKlxuICogRXhwZWN0ZWQ6IDUwLTEwMG1zIChzaW5nbGUgcXVlcnkpXG4gKiB2cyBnZXRBbGxDdXN0b21lcnMoKTogMTIwMC0yMDAwbXMgKDE1MSBxdWVyaWVzIHdpdGggZW5yaWNobWVudClcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEN1c3RvbWVyc0ZvckRpYWxlcigpOiBQcm9taXNlPFxuXHRBY3Rpb25SZXN1bHQ8XG5cdFx0QXJyYXk8e1xuXHRcdFx0aWQ6IHN0cmluZztcblx0XHRcdGZpcnN0X25hbWU6IHN0cmluZyB8IG51bGw7XG5cdFx0XHRsYXN0X25hbWU6IHN0cmluZyB8IG51bGw7XG5cdFx0XHRkaXNwbGF5X25hbWU6IHN0cmluZyB8IG51bGw7XG5cdFx0XHRlbWFpbDogc3RyaW5nIHwgbnVsbDtcblx0XHRcdHBob25lOiBzdHJpbmcgfCBudWxsO1xuXHRcdFx0c2Vjb25kYXJ5X3Bob25lPzogc3RyaW5nIHwgbnVsbDtcblx0XHRcdGNvbXBhbnlfbmFtZTogc3RyaW5nIHwgbnVsbDtcblx0XHRcdGFkZHJlc3M6IHN0cmluZyB8IG51bGw7XG5cdFx0XHRhZGRyZXNzMjogc3RyaW5nIHwgbnVsbDtcblx0XHRcdGNpdHk6IHN0cmluZyB8IG51bGw7XG5cdFx0XHRzdGF0ZTogc3RyaW5nIHwgbnVsbDtcblx0XHRcdHppcF9jb2RlOiBzdHJpbmcgfCBudWxsO1xuXHRcdH0+XG5cdD5cbj4ge1xuXHRyZXR1cm4gd2l0aEVycm9ySGFuZGxpbmcoYXN5bmMgKCkgPT4ge1xuXHRcdGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KCk7XG5cdFx0aWYgKCFzdXBhYmFzZSkge1xuXHRcdFx0dGhyb3cgbmV3IEFjdGlvbkVycm9yKFxuXHRcdFx0XHRcIkRhdGFiYXNlIGNvbm5lY3Rpb24gZmFpbGVkXCIsXG5cdFx0XHRcdEVSUk9SX0NPREVTLkRCX0NPTk5FQ1RJT05fRVJST1IsXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHtcblx0XHRcdGRhdGE6IHsgdXNlciB9LFxuXHRcdH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKTtcblx0XHRhc3NlcnRBdXRoZW50aWNhdGVkKHVzZXI/LmlkKTtcblxuXHRcdGNvbnN0IGFjdGl2ZUNvbXBhbnlJZCA9IGF3YWl0IGdldEFjdGl2ZUNvbXBhbnlJZCgpO1xuXHRcdGlmICghYWN0aXZlQ29tcGFueUlkKSB7XG5cdFx0XHR0aHJvdyBuZXcgQWN0aW9uRXJyb3IoXG5cdFx0XHRcdFwiTm8gYWN0aXZlIGNvbXBhbnlcIixcblx0XHRcdFx0RVJST1JfQ09ERVMuQVVUSF9GT1JCSURERU4sXG5cdFx0XHRcdDQwMyxcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Ly8gU2luZ2xlIGxpZ2h0d2VpZ2h0IHF1ZXJ5IC0gbm8gam9pbnMsIG5vIGVucmljaG1lbnRcblx0XHRjb25zdCB7IGRhdGE6IGN1c3RvbWVycywgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImN1c3RvbWVyc1wiKVxuXHRcdFx0LnNlbGVjdChcblx0XHRcdFx0XCJpZCwgZmlyc3RfbmFtZSwgbGFzdF9uYW1lLCBkaXNwbGF5X25hbWUsIGVtYWlsLCBwaG9uZSwgc2Vjb25kYXJ5X3Bob25lLCBjb21wYW55X25hbWUsIGFkZHJlc3MsIGFkZHJlc3MyLCBjaXR5LCBzdGF0ZSwgemlwX2NvZGVcIixcblx0XHRcdClcblx0XHRcdC5lcShcImNvbXBhbnlfaWRcIiwgYWN0aXZlQ29tcGFueUlkKVxuXHRcdFx0LmlzKFwiZGVsZXRlZF9hdFwiLCBudWxsKVxuXHRcdFx0Lm9yZGVyKFwiZGlzcGxheV9uYW1lXCIsIHsgYXNjZW5kaW5nOiB0cnVlIH0pO1xuXG5cdFx0aWYgKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBuZXcgQWN0aW9uRXJyb3IoXG5cdFx0XHRcdEVSUk9SX01FU1NBR0VTLm9wZXJhdGlvbkZhaWxlZChcImZldGNoIGN1c3RvbWVyc1wiKSxcblx0XHRcdFx0RVJST1JfQ09ERVMuREJfUVVFUllfRVJST1IsXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdHJldHVybiBjdXN0b21lcnMgfHwgW107XG5cdH0pO1xufVxuXG4vKipcbiAqIEdldCBhbGwgY3VzdG9tZXJzIGZvciB0aGUgY3VycmVudCBjb21wYW55IChXSVRIIEVOUklDSE1FTlQpXG4gKlxuICogV0FSTklORzogVGhpcyBmdW5jdGlvbiBkb2VzIDE1MSBkYXRhYmFzZSBxdWVyaWVzIGZvciA1MCBjdXN0b21lcnMgKE4rMSBwYXR0ZXJuKS5cbiAqIEV4cGVjdGVkIHRpbWU6IDEyMDAtMjAwMG1zXG4gKlxuICogRE8gTk9UIHVzZSBpbiBBcHBIZWFkZXIgb3Igb3RoZXIgZnJlcXVlbnRseSByZW5kZXJlZCBjb21wb25lbnRzLlxuICogVXNlIGdldEN1c3RvbWVyc0ZvckRpYWxlcigpIGluc3RlYWQgZm9yIGxpZ2h0d2VpZ2h0IGNvbnRhY3QgaW5mby5cbiAqXG4gKiBPbmx5IHVzZSB0aGlzIG9uIGRlZGljYXRlZCBjdXN0b21lciBsaXN0IHBhZ2VzIHdoZXJlIHRoZSBlbnJpY2hlZCBkYXRhIGlzIG5lZWRlZC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZ2V0QWxsQ3VzdG9tZXJzKCk6IFByb21pc2U8XG5cdEFjdGlvblJlc3VsdDxDdXN0b21lclJlY29yZFtdPlxuPiB7XG5cdHJldHVybiB3aXRoRXJyb3JIYW5kbGluZyhhc3luYyAoKSA9PiB7XG5cdFx0Y29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcblx0XHRpZiAoIXN1cGFiYXNlKSB7XG5cdFx0XHR0aHJvdyBuZXcgQWN0aW9uRXJyb3IoXG5cdFx0XHRcdFwiRGF0YWJhc2UgY29ubmVjdGlvbiBmYWlsZWRcIixcblx0XHRcdFx0RVJST1JfQ09ERVMuREJfQ09OTkVDVElPTl9FUlJPUixcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qge1xuXHRcdFx0ZGF0YTogeyB1c2VyIH0sXG5cdFx0fSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZ2V0VXNlcigpO1xuXHRcdGFzc2VydEF1dGhlbnRpY2F0ZWQodXNlcj8uaWQpO1xuXG5cdFx0Ly8gR2V0IGFjdGl2ZSBjb21wYW55IElEIChmcm9tIGNvb2tpZSBvciBmaXJzdCBhdmFpbGFibGUpXG5cdFx0Y29uc3QgYWN0aXZlQ29tcGFueUlkID0gYXdhaXQgZ2V0QWN0aXZlQ29tcGFueUlkKCk7XG5cblx0XHRjb25zdCBGT1JCSURERU5fU1RBVFVTX0NPREUgPSA0MDM7XG5cdFx0aWYgKCFhY3RpdmVDb21wYW55SWQpIHtcblx0XHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFx0XCJZb3UgbXVzdCBiZSBwYXJ0IG9mIGEgY29tcGFueVwiLFxuXHRcdFx0XHRFUlJPUl9DT0RFUy5BVVRIX0ZPUkJJRERFTixcblx0XHRcdFx0Rk9SQklEREVOX1NUQVRVU19DT0RFLFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHQvLyBWZXJpZnkgdXNlciBoYXMgYWNjZXNzIHRvIHRoZSBhY3RpdmUgY29tcGFueVxuXHRcdGNvbnN0IHsgZGF0YTogdGVhbU1lbWJlciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwiY29tcGFueV9tZW1iZXJzaGlwc1wiKVxuXHRcdFx0LnNlbGVjdChcImNvbXBhbnlfaWRcIilcblx0XHRcdC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcblx0XHRcdC5lcShcImNvbXBhbnlfaWRcIiwgYWN0aXZlQ29tcGFueUlkKVxuXHRcdFx0LmVxKFwic3RhdHVzXCIsIFwiYWN0aXZlXCIpXG5cdFx0XHQubWF5YmVTaW5nbGUoKTtcblxuXHRcdGlmICghdGVhbU1lbWJlcj8uY29tcGFueV9pZCkge1xuXHRcdFx0dGhyb3cgbmV3IEFjdGlvbkVycm9yKFxuXHRcdFx0XHRcIllvdSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGlzIGNvbXBhbnlcIixcblx0XHRcdFx0RVJST1JfQ09ERVMuQVVUSF9GT1JCSURERU4sXG5cdFx0XHRcdEZPUkJJRERFTl9TVEFUVVNfQ09ERSxcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgeyBkYXRhOiBjdXN0b21lcnMsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJjdXN0b21lcnNcIilcblx0XHRcdC5zZWxlY3QoXCIqXCIpXG5cdFx0XHQuZXEoXCJjb21wYW55X2lkXCIsIGFjdGl2ZUNvbXBhbnlJZClcblx0XHRcdC5pcyhcImRlbGV0ZWRfYXRcIiwgbnVsbClcblx0XHRcdC5vcmRlcihcImRpc3BsYXlfbmFtZVwiLCB7IGFzY2VuZGluZzogdHJ1ZSB9KTtcblxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0dGhyb3cgbmV3IEFjdGlvbkVycm9yKFxuXHRcdFx0XHRFUlJPUl9NRVNTQUdFUy5vcGVyYXRpb25GYWlsZWQoXCJmZXRjaCBjdXN0b21lcnNcIiksXG5cdFx0XHRcdEVSUk9SX0NPREVTLkRCX1FVRVJZX0VSUk9SLFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHQvLyBQRVJGT1JNQU5DRSBPUFRJTUlaRUQ6IFVzZSBSUEMgZnVuY3Rpb24gaW5zdGVhZCBvZiBOKzEgcXVlcmllc1xuXHRcdC8vIEJFRk9SRTogMTUxIHF1ZXJpZXMgZm9yIDUwIGN1c3RvbWVycyAoMSBiYXNlICsgNTAgw5cgMyBxdWVyaWVzIGVhY2gpXG5cdFx0Ly8gQUZURVI6IDEgUlBDIGNhbGwgd2l0aCBlZmZpY2llbnQgTEFURVJBTCBqb2luc1xuXHRcdC8vIFBlcmZvcm1hbmNlIGdhaW46IDUtMTAgc2Vjb25kcyBmYXN0ZXJcblxuXHRcdC8vIE5vdGU6IGN1c3RvbWVycyB2YXJpYWJsZSBjb250YWlucyB0aGUgYmFzZSBjdXN0b21lciBkYXRhIGZyb20gYWJvdmUgcXVlcnlcblx0XHQvLyBXZSByZXBsYWNlIHRoZSBlbnJpY2htZW50IGxvZ2ljIHdpdGggYSBzaW5nbGUgUlBDIGNhbGxcblx0XHRjb25zdCB7IGRhdGE6IGVucmljaGVkRGF0YSwgZXJyb3I6IGVucmljaEVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZS5ycGMoXG5cdFx0XHRcImdldF9lbnJpY2hlZF9jdXN0b21lcnNfcnBjXCIsXG5cdFx0XHR7XG5cdFx0XHRcdHBfY29tcGFueV9pZDogYWN0aXZlQ29tcGFueUlkLFxuXHRcdFx0fSxcblx0XHQpO1xuXG5cdFx0aWYgKGVucmljaEVycm9yKSB7XG5cdFx0XHQvLyBGYWxsYmFjayB0byBiYXNlIGN1c3RvbWVycyBpZiBlbnJpY2htZW50IGZhaWxzXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGVucmljaCBjdXN0b21lcnM6XCIsIGVucmljaEVycm9yKTtcblx0XHRcdHJldHVybiBjdXN0b21lcnMgYXMgQ3VzdG9tZXJSZWNvcmRbXTtcblx0XHR9XG5cblx0XHQvLyBNZXJnZSBlbnJpY2hlZCBkYXRhIHdpdGggYmFzZSBjdXN0b21lciBkYXRhXG5cdFx0Y29uc3QgZW5yaWNoZWRDdXN0b21lcnMgPSAoZW5yaWNoZWREYXRhIHx8IFtdKS5tYXAoKGN1c3RvbWVyOiBhbnkpID0+ICh7XG5cdFx0XHQuLi5jdXN0b21lcixcblx0XHRcdC8vIE92ZXJyaWRlIHRvdGFsX2pvYnMgYW5kIHRvdGFsX3JldmVudWUgd2l0aCBmcmVzaCBhZ2dyZWdhdGVkIHZhbHVlc1xuXHRcdFx0dG90YWxfam9iczogY3VzdG9tZXIuZW5yaWNoZWRfdG90YWxfam9icyB8fCBjdXN0b21lci50b3RhbF9qb2JzIHx8IDAsXG5cdFx0XHR0b3RhbF9yZXZlbnVlOlxuXHRcdFx0XHRjdXN0b21lci5lbnJpY2hlZF90b3RhbF9yZXZlbnVlIHx8IGN1c3RvbWVyLnRvdGFsX3JldmVudWUgfHwgMCxcblx0XHR9KSk7XG5cblx0XHRyZXR1cm4gZW5yaWNoZWRDdXN0b21lcnMgYXMgQ3VzdG9tZXJSZWNvcmRbXTtcblx0fSk7XG59XG5cbi8qKlxuICogVXBkYXRlIGN1c3RvbWVyIHBhZ2UgY29udGVudCAoTm92ZWwvVGlwdGFwIEpTT04pXG4gKlxuICogU2F2ZXMgdGhlIGN1c3RvbWVyJ3MgZWRpdGFibGUgcGFnZSBsYXlvdXQgYW5kIGNvbnRlbnRcbiAqIFVzZWQgYnkgdGhlIE5vdmVsIGVkaXRvciBmb3IgYXV0by1zYXZlIGZ1bmN0aW9uYWxpdHlcbiAqL1xuYXN5bmMgZnVuY3Rpb24gdXBkYXRlQ3VzdG9tZXJQYWdlQ29udGVudChcblx0Y3VzdG9tZXJJZDogc3RyaW5nLFxuXHRwYWdlQ29udGVudDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4pOiBQcm9taXNlPEFjdGlvblJlc3VsdDx2b2lkPj4ge1xuXHRyZXR1cm4gd2l0aEVycm9ySGFuZGxpbmcoYXN5bmMgKCkgPT4ge1xuXHRcdGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KCk7XG5cdFx0aWYgKCFzdXBhYmFzZSkge1xuXHRcdFx0dGhyb3cgbmV3IEFjdGlvbkVycm9yKFxuXHRcdFx0XHRcIkRhdGFiYXNlIGNvbm5lY3Rpb24gZmFpbGVkXCIsXG5cdFx0XHRcdEVSUk9SX0NPREVTLkRCX0NPTk5FQ1RJT05fRVJST1IsXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHtcblx0XHRcdGRhdGE6IHsgdXNlciB9LFxuXHRcdH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKTtcblx0XHRhc3NlcnRBdXRoZW50aWNhdGVkKHVzZXI/LmlkKTtcblxuXHRcdGNvbnN0IHsgZGF0YTogdGVhbU1lbWJlciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwiY29tcGFueV9tZW1iZXJzaGlwc1wiKVxuXHRcdFx0LnNlbGVjdChcImNvbXBhbnlfaWRcIilcblx0XHRcdC5lcShcInVzZXJfaWRcIiwgdXNlci5pZClcblx0XHRcdC5zaW5nbGUoKTtcblxuXHRcdGlmICghdGVhbU1lbWJlcj8uY29tcGFueV9pZCkge1xuXHRcdFx0dGhyb3cgbmV3IEFjdGlvbkVycm9yKFxuXHRcdFx0XHRcIllvdSBtdXN0IGJlIHBhcnQgb2YgYSBjb21wYW55XCIsXG5cdFx0XHRcdEVSUk9SX0NPREVTLkFVVEhfRk9SQklEREVOLFxuXHRcdFx0XHRIVFRQX1NUQVRVU19GT1JCSURERU4sXG5cdFx0XHQpO1xuXHRcdH1cblxuXHRcdC8vIFZlcmlmeSBjdXN0b21lciBleGlzdHMgYW5kIGJlbG9uZ3MgdG8gY29tcGFueVxuXHRcdGNvbnN0IHsgZGF0YTogY3VzdG9tZXIgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImN1c3RvbWVyc1wiKVxuXHRcdFx0LnNlbGVjdChcImlkLCBjb21wYW55X2lkXCIpXG5cdFx0XHQuZXEoXCJpZFwiLCBjdXN0b21lcklkKVxuXHRcdFx0LmlzKFwiZGVsZXRlZF9hdFwiLCBudWxsKVxuXHRcdFx0LnNpbmdsZSgpO1xuXG5cdFx0YXNzZXJ0RXhpc3RzKGN1c3RvbWVyLCBcIkN1c3RvbWVyXCIpO1xuXG5cdFx0aWYgKGN1c3RvbWVyLmNvbXBhbnlfaWQgIT09IHRlYW1NZW1iZXIuY29tcGFueV9pZCkge1xuXHRcdFx0dGhyb3cgbmV3IEFjdGlvbkVycm9yKFxuXHRcdFx0XHRFUlJPUl9NRVNTQUdFUy5mb3JiaWRkZW4oXCJjdXN0b21lclwiKSxcblx0XHRcdFx0RVJST1JfQ09ERVMuQVVUSF9GT1JCSURERU4sXG5cdFx0XHRcdEhUVFBfU1RBVFVTX0ZPUkJJRERFTixcblx0XHRcdCk7XG5cdFx0fVxuXG5cdFx0Ly8gVXBkYXRlIHBhZ2UgY29udGVudFxuXHRcdGNvbnN0IHsgZXJyb3I6IHVwZGF0ZUVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJjdXN0b21lcnNcIilcblx0XHRcdC51cGRhdGUoe1xuXHRcdFx0XHRwYWdlX2NvbnRlbnQ6IHBhZ2VDb250ZW50LFxuXHRcdFx0XHRjb250ZW50X3VwZGF0ZWRfYnk6IHVzZXIuaWQsXG5cdFx0XHR9KVxuXHRcdFx0LmVxKFwiaWRcIiwgY3VzdG9tZXJJZCk7XG5cblx0XHRpZiAodXBkYXRlRXJyb3IpIHtcblx0XHRcdHRocm93IG5ldyBBY3Rpb25FcnJvcihcblx0XHRcdFx0RVJST1JfTUVTU0FHRVMub3BlcmF0aW9uRmFpbGVkKFwidXBkYXRlIGN1c3RvbWVyIHBhZ2VcIiksXG5cdFx0XHRcdEVSUk9SX0NPREVTLkRCX1FVRVJZX0VSUk9SLFxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXZhbGlkYXRlUGF0aChgL2Rhc2hib2FyZC9jdXN0b21lcnMvJHtjdXN0b21lcklkfWApO1xuXHR9KTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiNlNBMGxDc0IifQ==
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/use-customer-lookup.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * useCustomerLookup - React 19 Hook
 *
 * Performance optimizations:
 * - Uses useState + useEffect for client-side data fetching
 * - Fetches customer data by phone number for incoming call identification
 *
 * Fetches customer data by phone number for incoming call identification.
 */ __turbopack_context__.s([
    "useCustomerLookup",
    ()=>useCustomerLookup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$data$3a$c3ede4__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/apps/web/src/actions/data:c3ede4 [app-client] (ecmascript) <text/javascript>");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
// AI Trust Scores
const AI_HIGH_TRUST_SCORE = 0.9;
const AI_MEDIUM_TRUST_SCORE = 0.5;
const getDefaultCustomerData = (callerNumber)=>({
        name: "Unknown Customer",
        email: "",
        phone: callerNumber || "Unknown",
        company: "",
        accountStatus: "Unknown",
        lastContact: "Never",
        totalCalls: 0,
        openTickets: 0,
        priority: "medium",
        tags: [],
        recentIssues: [],
        aiData: {
            isKnownCustomer: false,
            isSpam: false,
            spamConfidence: 0,
            recognitionSource: "unknown",
            trustScore: AI_MEDIUM_TRUST_SCORE,
            callHistory: [],
            similarCallers: 0,
            riskLevel: "medium",
            aiNotes: [
                "First-time caller",
                "No prior history",
                "Standard verification recommended"
            ]
        }
    });
function useCustomerLookup(callerNumber, companyId) {
    _s();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCustomerLookup.useEffect": ()=>{
            if (!callerNumber || !companyId) {
                setData(getDefaultCustomerData(callerNumber));
                return;
            }
            const fetchCustomer = {
                "useCustomerLookup.useEffect.fetchCustomer": async ()=>{
                    setIsLoading(true);
                    setError(null);
                    try {
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$data$3a$c3ede4__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getCustomerByPhone"])(callerNumber, companyId);
                        if (result.success && result.data) {
                            const customer = result.data;
                            // Customer found - return enriched data
                            setData({
                                name: `${customer.first_name} ${customer.last_name}`,
                                email: customer.email || "",
                                phone: customer.phone || callerNumber,
                                company: customer.company_name || "",
                                accountStatus: customer.status || "Active",
                                lastContact: customer.last_contact_date ? new Date(customer.last_contact_date).toLocaleDateString() : "Unknown",
                                totalCalls: customer.total_interactions || 0,
                                openTickets: 0,
                                priority: customer.priority_level || "medium",
                                tags: customer.tags || [],
                                recentIssues: [],
                                aiData: {
                                    isKnownCustomer: true,
                                    isSpam: false,
                                    spamConfidence: 0,
                                    recognitionSource: "crm",
                                    trustScore: AI_HIGH_TRUST_SCORE,
                                    callHistory: [],
                                    similarCallers: 0,
                                    riskLevel: "low",
                                    aiNotes: [
                                        `Customer since ${customer.created_at ? new Date(customer.created_at).getFullYear() : "Unknown"}`,
                                        "Verified customer",
                                        "Account in good standing"
                                    ]
                                }
                            });
                        } else {
                            // Customer not found - return default
                            setData(getDefaultCustomerData(callerNumber));
                        }
                    } catch (err) {
                        // Error fetching - return default with error note
                        const defaultData = getDefaultCustomerData(callerNumber);
                        defaultData.aiData.aiNotes = [
                            "Error loading customer data"
                        ];
                        setData(defaultData);
                        setError(err instanceof Error ? err : new Error("Failed to fetch customer"));
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["useCustomerLookup.useEffect.fetchCustomer"];
            fetchCustomer();
        }
    }["useCustomerLookup.useEffect"], [
        callerNumber,
        companyId
    ]);
    return {
        data,
        error,
        isLoading
    };
}
_s(useCustomerLookup, "BIPtUHhZaWMTN8qDWBER4j5VY4M=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/actions/data:4a9e61 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40e9b4592b7430c75572741960a36336d9be9f7ae0":"startCallRecording"},"apps/web/src/actions/telnyx.ts",""] */ __turbopack_context__.s([
    "startCallRecording",
    ()=>startCallRecording
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var startCallRecording = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40e9b4592b7430c75572741960a36336d9be9f7ae0", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "startCallRecording"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdGVsbnl4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVsbnl4IFNlcnZlciBBY3Rpb25zXG4gKlxuICogU2VydmVyLXNpZGUgYWN0aW9ucyBmb3IgVGVsbnl4IFZvSVAgb3BlcmF0aW9uczpcbiAqIC0gUGhvbmUgbnVtYmVyIG1hbmFnZW1lbnRcbiAqIC0gQ2FsbCBvcGVyYXRpb25zXG4gKiAtIFNNUyBvcGVyYXRpb25zXG4gKiAtIFZvaWNlbWFpbCBvcGVyYXRpb25zXG4gKlxuICogQWxsIGFjdGlvbnMgaW5jbHVkZSBwcm9wZXIgYXV0aGVudGljYXRpb24gYW5kIGF1dGhvcml6YXRpb24gY2hlY2tzLlxuICovXG5cblwidXNlIHNlcnZlclwiO1xuXG5pbXBvcnQgdHlwZSB7IFN1cGFiYXNlQ2xpZW50IH0gZnJvbSBcIkBzdXBhYmFzZS9zdXBhYmFzZS1qc1wiO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiO1xuaW1wb3J0IHsgaGVhZGVycyB9IGZyb20gXCJuZXh0L2hlYWRlcnNcIjtcbmltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gXCJAL2xpYi9zdXBhYmFzZS9zZXJ2ZXJcIjtcbmltcG9ydCB7XG5cdGFuc3dlckNhbGwsXG5cdGhhbmd1cENhbGwsXG5cdGluaXRpYXRlQ2FsbCxcblx0cmVqZWN0Q2FsbCxcblx0c3RhcnRSZWNvcmRpbmcsXG5cdHN0b3BSZWNvcmRpbmcsXG59IGZyb20gXCJAL2xpYi90ZWxueXgvY2FsbHNcIjtcbmltcG9ydCB7IFRFTE5ZWF9DT05GSUcgfSBmcm9tIFwiQC9saWIvdGVsbnl4L2NsaWVudFwiO1xuaW1wb3J0IHtcblx0dmFsaWRhdGVDYWxsQ29uZmlnLFxuXHR2YWxpZGF0ZVNtc0NvbmZpZyxcbn0gZnJvbSBcIkAvbGliL3RlbG55eC9jb25maWctdmFsaWRhdG9yXCI7XG5pbXBvcnQgeyB2ZXJpZnlDb25uZWN0aW9uIH0gZnJvbSBcIkAvbGliL3RlbG55eC9jb25uZWN0aW9uLXNldHVwXCI7XG5pbXBvcnQgeyBmb3JtYXRQaG9uZU51bWJlciwgc2VuZE1NUywgc2VuZFNNUyB9IGZyb20gXCJAL2xpYi90ZWxueXgvbWVzc2FnaW5nXCI7XG5pbXBvcnQgeyB2ZXJpZnlNZXNzYWdpbmdQcm9maWxlIH0gZnJvbSBcIkAvbGliL3RlbG55eC9tZXNzYWdpbmctcHJvZmlsZS1zZXR1cFwiO1xuaW1wb3J0IHtcblx0dHlwZSBOdW1iZXJGZWF0dXJlLFxuXHR0eXBlIE51bWJlclR5cGUsXG5cdHB1cmNoYXNlTnVtYmVyLFxuXHRyZWxlYXNlTnVtYmVyLFxuXHRzZWFyY2hBdmFpbGFibGVOdW1iZXJzLFxufSBmcm9tIFwiQC9saWIvdGVsbnl4L251bWJlcnNcIjtcbmltcG9ydCB7XG5cdHZlcmlmeVNtc0NhcGFiaWxpdHksXG5cdHZlcmlmeVZvaWNlQ2FwYWJpbGl0eSxcbn0gZnJvbSBcIkAvbGliL3RlbG55eC9waG9uZS1udW1iZXItc2V0dXBcIjtcbmltcG9ydCB7XG5cdHR5cGUgQ29tcGFueVRlbG55eFNldHRpbmdzUm93LFxuXHRlbnN1cmVDb21wYW55VGVsbnl4U2V0dXAsXG5cdGZldGNoQ29tcGFueVRlbG55eFNldHRpbmdzLFxufSBmcm9tIFwiQC9saWIvdGVsbnl4L3Byb3Zpc2lvbi1jb21wYW55XCI7XG5pbXBvcnQgdHlwZSB7IERhdGFiYXNlLCBKc29uIH0gZnJvbSBcIkAvdHlwZXMvc3VwYWJhc2VcIjtcbmltcG9ydCB7IGVuc3VyZU1lc3NhZ2luZ0NhbXBhaWduIH0gZnJvbSBcIi4vbWVzc2FnaW5nLWJyYW5kaW5nXCI7XG5cbnR5cGUgVHlwZWRTdXBhYmFzZUNsaWVudCA9IFN1cGFiYXNlQ2xpZW50PERhdGFiYXNlPjtcblxuZnVuY3Rpb24gbm9ybWFsaXplUGhvbmVOdW1iZXIocGhvbmVOdW1iZXI6IHN0cmluZyk6IHN0cmluZyB7XG5cdHJldHVybiBmb3JtYXRQaG9uZU51bWJlcihwaG9uZU51bWJlcik7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RBcmVhQ29kZShwaG9uZU51bWJlcjogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG5cdGNvbnN0IGRpZ2l0cyA9IHBob25lTnVtYmVyLnJlcGxhY2UoL1xcRC9nLCBcIlwiKTtcblx0aWYgKGRpZ2l0cy5sZW5ndGggPT09IDExICYmIGRpZ2l0cy5zdGFydHNXaXRoKFwiMVwiKSkge1xuXHRcdHJldHVybiBkaWdpdHMuc2xpY2UoMSwgNCk7XG5cdH1cblx0aWYgKGRpZ2l0cy5sZW5ndGggPT09IDEwKSB7XG5cdFx0cmV0dXJuIGRpZ2l0cy5zbGljZSgwLCAzKTtcblx0fVxuXHRyZXR1cm4gbnVsbDtcbn1cblxuY29uc3QgREVGQVVMVF9NRVNTQUdJTkdfUFJPRklMRV9JRCA9XG5cdHByb2Nlc3MuZW52LlRFTE5ZWF9ERUZBVUxUX01FU1NBR0lOR19QUk9GSUxFX0lEIHx8XG5cdHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1RFTE5ZWF9NRVNTQUdJTkdfUFJPRklMRV9JRCB8fFxuXHRcIlwiO1xuXG5jb25zdCBERUZBVUxUX1BIT05FX05VTUJFUl9GRUFUVVJFUzogSnNvbiA9IFtcInZvaWNlXCIsIFwic21zXCIsIFwibW1zXCJdO1xuXG5mdW5jdGlvbiBmb3JtYXREaXNwbGF5UGhvbmVOdW1iZXIocGhvbmVOdW1iZXI6IHN0cmluZyk6IHN0cmluZyB7XG5cdGNvbnN0IGRpZ2l0cyA9IHBob25lTnVtYmVyLnJlcGxhY2UoL1xcRC9nLCBcIlwiKTtcblx0aWYgKGRpZ2l0cy5sZW5ndGggPT09IDExICYmIGRpZ2l0cy5zdGFydHNXaXRoKFwiMVwiKSkge1xuXHRcdHJldHVybiBgKzEgKCR7ZGlnaXRzLnNsaWNlKDEsIDQpfSkgJHtkaWdpdHMuc2xpY2UoNCwgNyl9LSR7ZGlnaXRzLnNsaWNlKDcpfWA7XG5cdH1cblx0aWYgKGRpZ2l0cy5sZW5ndGggPT09IDEwKSB7XG5cdFx0cmV0dXJuIGAoJHtkaWdpdHMuc2xpY2UoMCwgMyl9KSAke2RpZ2l0cy5zbGljZSgzLCA2KX0tJHtkaWdpdHMuc2xpY2UoNil9YDtcblx0fVxuXHRyZXR1cm4gcGhvbmVOdW1iZXI7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldENvbXBhbnlUZWxueXhTZXR0aW5ncyhcblx0c3VwYWJhc2U6IFR5cGVkU3VwYWJhc2VDbGllbnQsXG5cdGNvbXBhbnlJZDogc3RyaW5nIHwgbnVsbCxcbik6IFByb21pc2U8Q29tcGFueVRlbG55eFNldHRpbmdzUm93IHwgbnVsbD4ge1xuXHRpZiAoIWNvbXBhbnlJZCkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Y29uc3QgZXhpc3RpbmcgPSBhd2FpdCBmZXRjaENvbXBhbnlUZWxueXhTZXR0aW5ncyhzdXBhYmFzZSwgY29tcGFueUlkKTtcblx0aWYgKGV4aXN0aW5nICYmIGV4aXN0aW5nLnN0YXR1cyA9PT0gXCJyZWFkeVwiKSB7XG5cdFx0cmV0dXJuIGV4aXN0aW5nO1xuXHR9XG5cblx0Y29uc3QgcHJvdmlzaW9uUmVzdWx0ID0gYXdhaXQgZW5zdXJlQ29tcGFueVRlbG55eFNldHVwKHtcblx0XHRjb21wYW55SWQsXG5cdFx0c3VwYWJhc2UsXG5cdH0pO1xuXG5cdGlmICghcHJvdmlzaW9uUmVzdWx0LnN1Y2Nlc3MpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHJldHVybiBwcm92aXNpb25SZXN1bHQuc2V0dGluZ3MgPz8gbnVsbDtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQmFzZVVybCh1cmw6IHN0cmluZyk6IHN0cmluZyB7XG5cdGNvbnN0IHRyaW1tZWQgPSB1cmwudHJpbSgpLnJlcGxhY2UoL1xcLyskLywgXCJcIik7XG5cdGlmICgvXmh0dHBzPzpcXC9cXC8vaS50ZXN0KHRyaW1tZWQpKSB7XG5cdFx0aWYgKC9eaHR0cDpcXC9cXC8vaS50ZXN0KHRyaW1tZWQpICYmICFpc0xvY2FsVXJsKHRyaW1tZWQpKSB7XG5cdFx0XHRyZXR1cm4gdHJpbW1lZC5yZXBsYWNlKC9eaHR0cDpcXC9cXC8vaSwgXCJodHRwczovL1wiKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRyaW1tZWQ7XG5cdH1cblx0cmV0dXJuIGBodHRwczovLyR7dHJpbW1lZH1gO1xufVxuXG5mdW5jdGlvbiBpc0xvY2FsVXJsKHVybDogc3RyaW5nKTogYm9vbGVhbiB7XG5cdGNvbnN0IGxvd2VyZWQgPSB1cmwudG9Mb3dlckNhc2UoKTtcblx0cmV0dXJuIChcblx0XHRsb3dlcmVkLmluY2x1ZGVzKFwibG9jYWxob3N0XCIpIHx8XG5cdFx0bG93ZXJlZC5pbmNsdWRlcyhcIjEyNy4wLjAuMVwiKSB8fFxuXHRcdGxvd2VyZWQuaW5jbHVkZXMoXCIwLjAuMC4wXCIpIHx8XG5cdFx0bG93ZXJlZC5lbmRzV2l0aChcIi5sb2NhbFwiKSB8fFxuXHRcdGxvd2VyZWQuaW5jbHVkZXMoXCI6Ly9sb2NhbFwiKVxuXHQpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VVcmwodXJsOiBzdHJpbmcpOiBib29sZWFuIHtcblx0aWYgKCF1cmwpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Y29uc3QgdHJpbW1lZCA9IHVybC50cmltKCk7XG5cdGlmICghdHJpbW1lZCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRjb25zdCBpc0hvc3RlZFByb2R1Y3Rpb24gPVxuXHRcdChwcm9jZXNzLmVudi5WRVJDRUwgPT09IFwiMVwiICYmIHByb2Nlc3MuZW52LlZFUkNFTF9FTlYgPT09IFwicHJvZHVjdGlvblwiKSB8fFxuXHRcdHByb2Nlc3MuZW52LkRFUExPWU1FTlRfRU5WID09PSBcInByb2R1Y3Rpb25cIjtcblxuXHRpZiAoaXNIb3N0ZWRQcm9kdWN0aW9uICYmIGlzTG9jYWxVcmwodHJpbW1lZCkpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QmFzZUFwcFVybCgpOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuXHRjb25zdCBjYW5kaWRhdGVzID0gW1xuXHRcdHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NJVEVfVVJMLFxuXHRcdHByb2Nlc3MuZW52LlNJVEVfVVJMLFxuXHRcdHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0FQUF9VUkwsXG5cdFx0cHJvY2Vzcy5lbnYuQVBQX1VSTCxcblx0XTtcblx0Zm9yIChjb25zdCBjYW5kaWRhdGUgb2YgY2FuZGlkYXRlcykge1xuXHRcdGlmIChjYW5kaWRhdGUgJiYgc2hvdWxkVXNlVXJsKGNhbmRpZGF0ZSkpIHtcblx0XHRcdHJldHVybiBub3JtYWxpemVCYXNlVXJsKGNhbmRpZGF0ZSk7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgdmVyY2VsVXJsID0gcHJvY2Vzcy5lbnYuVkVSQ0VMX1VSTDtcblx0aWYgKHZlcmNlbFVybCAmJiBzaG91bGRVc2VVcmwodmVyY2VsVXJsKSkge1xuXHRcdHJldHVybiBub3JtYWxpemVCYXNlVXJsKFxuXHRcdFx0dmVyY2VsVXJsLnN0YXJ0c1dpdGgoXCJodHRwXCIpID8gdmVyY2VsVXJsIDogYGh0dHBzOi8vJHt2ZXJjZWxVcmx9YCxcblx0XHQpO1xuXHR9XG5cblx0dHJ5IHtcblx0XHRjb25zdCBoZHJzID0gYXdhaXQgaGVhZGVycygpO1xuXHRcdGNvbnN0IG9yaWdpbiA9IGhkcnMuZ2V0KFwib3JpZ2luXCIpO1xuXHRcdGlmIChvcmlnaW4gJiYgc2hvdWxkVXNlVXJsKG9yaWdpbikpIHtcblx0XHRcdHJldHVybiBub3JtYWxpemVCYXNlVXJsKG9yaWdpbik7XG5cdFx0fVxuXHRcdGNvbnN0IGhvc3QgPSBoZHJzLmdldChcImhvc3RcIik7XG5cdFx0aWYgKGhvc3QgJiYgc2hvdWxkVXNlVXJsKGhvc3QpKSB7XG5cdFx0XHRjb25zdCBwcm90b2NvbCA9IGhvc3QuaW5jbHVkZXMoXCJsb2NhbGhvc3RcIikgPyBcImh0dHBcIiA6IFwiaHR0cHNcIjtcblx0XHRcdHJldHVybiBub3JtYWxpemVCYXNlVXJsKGAke3Byb3RvY29sfTovLyR7aG9zdH1gKTtcblx0XHR9XG5cdH0gY2F0Y2gge1xuXHRcdC8vIGhlYWRlcnMoKSBub3QgYXZhaWxhYmxlIG91dHNpZGUgb2YgYSByZXF1ZXN0IGNvbnRleHRcblx0fVxuXG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkQWJzb2x1dGVVcmwocGF0aDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcgfCB1bmRlZmluZWQ+IHtcblx0Y29uc3QgYmFzZSA9IGF3YWl0IGdldEJhc2VBcHBVcmwoKTtcblx0aWYgKCFiYXNlKSB7XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXHRjb25zdCBub3JtYWxpemVkUGF0aCA9IHBhdGguc3RhcnRzV2l0aChcIi9cIikgPyBwYXRoIDogYC8ke3BhdGh9YDtcblx0cmV0dXJuIGAke2Jhc2V9JHtub3JtYWxpemVkUGF0aH1gO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRUZWxueXhXZWJob29rVXJsKFxuXHRjb21wYW55SWQ/OiBzdHJpbmcsXG4pOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuXHRpZiAoY29tcGFueUlkKSB7XG5cdFx0cmV0dXJuIGJ1aWxkQWJzb2x1dGVVcmwoYC9hcGkvd2ViaG9va3MvdGVsbnl4P2NvbXBhbnk9JHtjb21wYW55SWR9YCk7XG5cdH1cblx0cmV0dXJuIGJ1aWxkQWJzb2x1dGVVcmwoXCIvYXBpL3dlYmhvb2tzL3RlbG55eFwiKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0UGhvbmVOdW1iZXJJZChcblx0c3VwYWJhc2U6IFR5cGVkU3VwYWJhc2VDbGllbnQsXG5cdHBob25lTnVtYmVyOiBzdHJpbmcsXG4pOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcblx0Y29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVBob25lTnVtYmVyKHBob25lTnVtYmVyKTtcblx0Y29uc3QgeyBkYXRhIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdC5mcm9tKFwicGhvbmVfbnVtYmVyc1wiKVxuXHRcdC5zZWxlY3QoXCJpZFwiKVxuXHRcdC5lcShcInBob25lX251bWJlclwiLCBub3JtYWxpemVkKVxuXHRcdC5pcyhcImRlbGV0ZWRfYXRcIiwgbnVsbClcblx0XHQubWF5YmVTaW5nbGUoKTtcblxuXHRyZXR1cm4gZGF0YT8uaWQgPz8gbnVsbDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZW5zdXJlUGhvbmVOdW1iZXJSZWNvcmRFeGlzdHMoXG5cdHN1cGFiYXNlOiBUeXBlZFN1cGFiYXNlQ2xpZW50LFxuXHRjb21wYW55SWQ6IHN0cmluZyxcblx0cGhvbmVOdW1iZXI6IHN0cmluZyB8IG51bGwsXG4pOiBQcm9taXNlPHZvaWQ+IHtcblx0aWYgKCFwaG9uZU51bWJlcikge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVQaG9uZU51bWJlcihwaG9uZU51bWJlcik7XG5cdGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHQuZnJvbShcInBob25lX251bWJlcnNcIilcblx0XHQuc2VsZWN0KFwiaWRcIilcblx0XHQuZXEoXCJjb21wYW55X2lkXCIsIGNvbXBhbnlJZClcblx0XHQuZXEoXCJwaG9uZV9udW1iZXJcIiwgbm9ybWFsaXplZClcblx0XHQubGltaXQoMSk7XG5cblx0aWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0YXdhaXQgc3VwYWJhc2UuZnJvbShcInBob25lX251bWJlcnNcIikuaW5zZXJ0KHtcblx0XHRjb21wYW55X2lkOiBjb21wYW55SWQsXG5cdFx0cGhvbmVfbnVtYmVyOiBub3JtYWxpemVkLFxuXHRcdGZvcm1hdHRlZF9udW1iZXI6IGZvcm1hdERpc3BsYXlQaG9uZU51bWJlcihub3JtYWxpemVkKSxcblx0XHRjb3VudHJ5X2NvZGU6IFwiVVNcIixcblx0XHRhcmVhX2NvZGU6IGV4dHJhY3RBcmVhQ29kZShub3JtYWxpemVkKSxcblx0XHRudW1iZXJfdHlwZTogXCJsb2NhbFwiLFxuXHRcdHN0YXR1czogXCJhY3RpdmVcIixcblx0XHRmZWF0dXJlczogREVGQVVMVF9QSE9ORV9OVU1CRVJfRkVBVFVSRVMsXG5cdH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZXNvbHZlT3V0Ym91bmRQaG9uZU51bWJlcihcblx0c3VwYWJhc2U6IFR5cGVkU3VwYWJhc2VDbGllbnQsXG5cdGNvbXBhbnlJZDogc3RyaW5nLFxuXHRleHBsaWNpdEZyb20/OiBzdHJpbmcgfCBudWxsLFxuXHRkZWZhdWx0TnVtYmVyPzogc3RyaW5nIHwgbnVsbCxcbik6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuXHRpZiAoZXhwbGljaXRGcm9tKSB7XG5cdFx0cmV0dXJuIG5vcm1hbGl6ZVBob25lTnVtYmVyKGV4cGxpY2l0RnJvbSk7XG5cdH1cblxuXHRjb25zdCBub3JtYWxpemVkRGVmYXVsdCA9IGRlZmF1bHROdW1iZXJcblx0XHQ/IG5vcm1hbGl6ZVBob25lTnVtYmVyKGRlZmF1bHROdW1iZXIpXG5cdFx0OiBudWxsO1xuXG5cdHRyeSB7XG5cdFx0Y29uc3QgeyBkYXRhIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJwaG9uZV9udW1iZXJzXCIpXG5cdFx0XHQuc2VsZWN0KFwicGhvbmVfbnVtYmVyLCBudW1iZXJfdHlwZVwiKVxuXHRcdFx0LmVxKFwiY29tcGFueV9pZFwiLCBjb21wYW55SWQpXG5cdFx0XHQuZXEoXCJzdGF0dXNcIiwgXCJhY3RpdmVcIik7XG5cblx0XHRpZiAoZGF0YSAmJiBkYXRhLmxlbmd0aCA+IDApIHtcblx0XHRcdGNvbnN0IHRvbGxGcmVlID0gZGF0YS5maW5kKChuKSA9PiBuLm51bWJlcl90eXBlID09PSBcInRvbGwtZnJlZVwiKTtcblx0XHRcdGlmICh0b2xsRnJlZSkge1xuXHRcdFx0XHRyZXR1cm4gbm9ybWFsaXplUGhvbmVOdW1iZXIodG9sbEZyZWUucGhvbmVfbnVtYmVyKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG5vcm1hbGl6ZWREZWZhdWx0KSB7XG5cdFx0XHRcdGNvbnN0IGRlZmF1bHRFeGlzdHMgPSBkYXRhLnNvbWUoXG5cdFx0XHRcdFx0KG4pID0+IG5vcm1hbGl6ZVBob25lTnVtYmVyKG4ucGhvbmVfbnVtYmVyKSA9PT0gbm9ybWFsaXplZERlZmF1bHQsXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGlmIChkZWZhdWx0RXhpc3RzKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG5vcm1hbGl6ZWREZWZhdWx0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBub3JtYWxpemVQaG9uZU51bWJlcihkYXRhWzBdLnBob25lX251bWJlcik7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUud2Fybihcblx0XHRcdFwiRmFpbGVkIHRvIGxvYWQgY29tcGFueSBwaG9uZSBudW1iZXJzIGZvciBvdXRib3VuZCBzZWxlY3Rpb246XCIsXG5cdFx0XHRlcnJvcixcblx0XHQpO1xuXHR9XG5cblx0cmV0dXJuIG5vcm1hbGl6ZWREZWZhdWx0O1xufVxuXG5hc3luYyBmdW5jdGlvbiBtZXJnZVByb3ZpZGVyTWV0YWRhdGEoXG5cdHN1cGFiYXNlOiBUeXBlZFN1cGFiYXNlQ2xpZW50LFxuXHRjb21tdW5pY2F0aW9uSWQ6IHN0cmluZyxcblx0cGF0Y2g6IFJlY29yZDxzdHJpbmcsIEpzb24+LFxuKTogUHJvbWlzZTx2b2lkPiB7XG5cdGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHQuZnJvbShcImNvbW11bmljYXRpb25zXCIpXG5cdFx0LnNlbGVjdChcInByb3ZpZGVyX21ldGFkYXRhXCIpXG5cdFx0LmVxKFwiaWRcIiwgY29tbXVuaWNhdGlvbklkKVxuXHRcdC5tYXliZVNpbmdsZSgpO1xuXG5cdGNvbnN0IGN1cnJlbnRNZXRhZGF0YSA9XG5cdFx0KGRhdGE/LnByb3ZpZGVyX21ldGFkYXRhIGFzIFJlY29yZDxzdHJpbmcsIEpzb24+IHwgbnVsbCkgPz8ge307XG5cdGNvbnN0IG1lcmdlZE1ldGFkYXRhOiBSZWNvcmQ8c3RyaW5nLCBKc29uPiA9IHtcblx0XHQuLi5jdXJyZW50TWV0YWRhdGEsXG5cdFx0Li4ucGF0Y2gsXG5cdH07XG5cblx0YXdhaXQgc3VwYWJhc2Vcblx0XHQuZnJvbShcImNvbW11bmljYXRpb25zXCIpXG5cdFx0LnVwZGF0ZSh7XG5cdFx0XHRwcm92aWRlcl9tZXRhZGF0YTogbWVyZ2VkTWV0YWRhdGEsXG5cdFx0fSlcblx0XHQuZXEoXCJpZFwiLCBjb21tdW5pY2F0aW9uSWQpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBQSE9ORSBOVU1CRVIgTUFOQUdFTUVOVCBBQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogU2VhcmNoIGZvciBhdmFpbGFibGUgcGhvbmUgbnVtYmVycyB0byBwdXJjaGFzZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VhcmNoUGhvbmVOdW1iZXJzKHBhcmFtczoge1xuXHRhcmVhQ29kZT86IHN0cmluZztcblx0bnVtYmVyVHlwZT86IE51bWJlclR5cGU7XG5cdGZlYXR1cmVzPzogTnVtYmVyRmVhdHVyZVtdO1xuXHRsaW1pdD86IG51bWJlcjtcbn0pIHtcblx0dHJ5IHtcblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBzZWFyY2hBdmFpbGFibGVOdW1iZXJzKHtcblx0XHRcdGNvdW50cnlDb2RlOiBcIlVTXCIsXG5cdFx0XHRhcmVhQ29kZTogcGFyYW1zLmFyZWFDb2RlLFxuXHRcdFx0bnVtYmVyVHlwZTogcGFyYW1zLm51bWJlclR5cGUsXG5cdFx0XHRmZWF0dXJlczogcGFyYW1zLmZlYXR1cmVzLFxuXHRcdFx0bGltaXQ6IHBhcmFtcy5saW1pdCB8fCAxMCxcblx0XHR9KTtcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3Jcblx0XHRcdFx0XHQ/IGVycm9yLm1lc3NhZ2Vcblx0XHRcdFx0XHQ6IFwiRmFpbGVkIHRvIHNlYXJjaCBwaG9uZSBudW1iZXJzXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIFB1cmNoYXNlIGEgcGhvbmUgbnVtYmVyIGFuZCBhc3NvY2lhdGUgaXQgd2l0aCB0aGUgY3VycmVudCBjb21wYW55XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwdXJjaGFzZVBob25lTnVtYmVyKHBhcmFtczoge1xuXHRwaG9uZU51bWJlcjogc3RyaW5nO1xuXHRjb21wYW55SWQ6IHN0cmluZztcblx0YmlsbGluZ0dyb3VwSWQ/OiBzdHJpbmc7XG59KSB7XG5cdHRyeSB7XG5cdFx0Ly8gVmFsaWRhdGUgY29uZmlndXJhdGlvblxuXHRcdGNvbnN0IHNtc0NvbmZpZyA9IGF3YWl0IHZhbGlkYXRlU21zQ29uZmlnKCk7XG5cdFx0Y29uc3QgY2FsbENvbmZpZyA9IHZhbGlkYXRlQ2FsbENvbmZpZygpO1xuXHRcdGlmICghc21zQ29uZmlnLnZhbGlkIHx8ICFjYWxsQ29uZmlnLnZhbGlkKSB7XG5cdFx0XHRsZXQgZXJyb3JNZXNzYWdlID1cblx0XHRcdFx0XCJUZWxueXggY29uZmlndXJhdGlvbiBpcyBpbmNvbXBsZXRlLiBQbGVhc2UgY29uZmlndXJlIGFsbCByZXF1aXJlZCBlbnZpcm9ubWVudCB2YXJpYWJsZXMuXCI7XG5cblx0XHRcdC8vIElmIHdlIGhhdmUgYSBzdWdnZXN0ZWQgcHJvZmlsZSBJRCwgaW5jbHVkZSBpdCBpbiB0aGUgZXJyb3Jcblx0XHRcdGlmIChzbXNDb25maWcuc3VnZ2VzdGVkUHJvZmlsZUlkKSB7XG5cdFx0XHRcdGVycm9yTWVzc2FnZSArPSBgIEZvdW5kIG1lc3NhZ2luZyBwcm9maWxlIFwiJHtzbXNDb25maWcuc3VnZ2VzdGVkUHJvZmlsZUlkfVwiIGluIHlvdXIgVGVsbnl4IGFjY291bnQuIFNldCBURUxOWVhfREVGQVVMVF9NRVNTQUdJTkdfUFJPRklMRV9JRD0ke3Ntc0NvbmZpZy5zdWdnZXN0ZWRQcm9maWxlSWR9IHRvIHVzZSBpdC5gO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6IGVycm9yTWVzc2FnZSxcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcblx0XHRpZiAoIXN1cGFiYXNlKSB7XG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiU2VydmljZSB1bmF2YWlsYWJsZVwiIH07XG5cdFx0fVxuXG5cdFx0Y29uc3Qgbm9ybWFsaXplZFBob25lTnVtYmVyID0gbm9ybWFsaXplUGhvbmVOdW1iZXIocGFyYW1zLnBob25lTnVtYmVyKTtcblx0XHRjb25zdCBmb3JtYXR0ZWROdW1iZXIgPSBmb3JtYXREaXNwbGF5UGhvbmVOdW1iZXIobm9ybWFsaXplZFBob25lTnVtYmVyKTtcblx0XHRjb25zdCBhcmVhQ29kZSA9IGV4dHJhY3RBcmVhQ29kZShub3JtYWxpemVkUGhvbmVOdW1iZXIpO1xuXG5cdFx0Ly8gUHVyY2hhc2UgbnVtYmVyIGZyb20gVGVsbnl4XG5cdFx0Y29uc3QgbWVzc2FnaW5nUHJvZmlsZUlkID0gREVGQVVMVF9NRVNTQUdJTkdfUFJPRklMRV9JRCB8fCB1bmRlZmluZWQ7XG5cblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBwdXJjaGFzZU51bWJlcih7XG5cdFx0XHRwaG9uZU51bWJlcjogbm9ybWFsaXplZFBob25lTnVtYmVyLFxuXHRcdFx0Y29ubmVjdGlvbklkOiBURUxOWVhfQ09ORklHLmNvbm5lY3Rpb25JZCxcblx0XHRcdG1lc3NhZ2luZ1Byb2ZpbGVJZCxcblx0XHRcdGJpbGxpbmdHcm91cElkOiBwYXJhbXMuYmlsbGluZ0dyb3VwSWQsXG5cdFx0XHRjdXN0b21lclJlZmVyZW5jZTogYGNvbXBhbnlfJHtwYXJhbXMuY29tcGFueUlkfWAsXG5cdFx0fSk7XG5cblx0XHRpZiAoIXJlc3VsdC5zdWNjZXNzKSB7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdC8vIFN0b3JlIGluIGRhdGFiYXNlXG5cdFx0Y29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwicGhvbmVfbnVtYmVyc1wiKVxuXHRcdFx0Lmluc2VydCh7XG5cdFx0XHRcdGNvbXBhbnlfaWQ6IHBhcmFtcy5jb21wYW55SWQsXG5cdFx0XHRcdHRlbG55eF9waG9uZV9udW1iZXJfaWQ6IHJlc3VsdC5vcmRlcklkLFxuXHRcdFx0XHR0ZWxueXhfY29ubmVjdGlvbl9pZDogVEVMTllYX0NPTkZJRy5jb25uZWN0aW9uSWQsXG5cdFx0XHRcdHBob25lX251bWJlcjogbm9ybWFsaXplZFBob25lTnVtYmVyLFxuXHRcdFx0XHRmb3JtYXR0ZWRfbnVtYmVyOiBmb3JtYXR0ZWROdW1iZXIsXG5cdFx0XHRcdGNvdW50cnlfY29kZTogXCJVU1wiLFxuXHRcdFx0XHRhcmVhX2NvZGU6IGFyZWFDb2RlLFxuXHRcdFx0XHRudW1iZXJfdHlwZTogXCJsb2NhbFwiLFxuXHRcdFx0XHRmZWF0dXJlczogW1widm9pY2VcIiwgXCJzbXNcIl0sXG5cdFx0XHRcdHN0YXR1czogXCJwZW5kaW5nXCIsXG5cdFx0XHR9KVxuXHRcdFx0LnNlbGVjdCgpXG5cdFx0XHQuc2luZ2xlKCk7XG5cblx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblxuXHRcdHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9zZXR0aW5ncy9jb21tdW5pY2F0aW9ucy9waG9uZS1udW1iZXJzXCIpO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IGVuc3VyZU1lc3NhZ2luZ0NhbXBhaWduKFxuXHRcdFx0XHRwYXJhbXMuY29tcGFueUlkLFxuXHRcdFx0XHR7IGlkOiBkYXRhLmlkLCBlMTY0OiBub3JtYWxpemVkUGhvbmVOdW1iZXIgfSxcblx0XHRcdFx0eyBzdXBhYmFzZSB9LFxuXHRcdFx0KTtcblx0XHR9IGNhdGNoIChfY2FtcGFpZ25FcnJvcikge31cblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0ZGF0YSxcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdGVycm9yOlxuXHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yXG5cdFx0XHRcdFx0PyBlcnJvci5tZXNzYWdlXG5cdFx0XHRcdFx0OiBcIkZhaWxlZCB0byBwdXJjaGFzZSBwaG9uZSBudW1iZXJcIixcblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogR2V0IGFsbCBwaG9uZSBudW1iZXJzIGZvciBhIGNvbXBhbnlcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENvbXBhbnlQaG9uZU51bWJlcnMoY29tcGFueUlkOiBzdHJpbmcpIHtcblx0dHJ5IHtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHRjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJwaG9uZV9udW1iZXJzXCIpXG5cdFx0XHQuc2VsZWN0KFwiKlwiKVxuXHRcdFx0LmVxKFwiY29tcGFueV9pZFwiLCBjb21wYW55SWQpXG5cdFx0XHQuaXMoXCJkZWxldGVkX2F0XCIsIG51bGwpXG5cdFx0XHQub3JkZXIoXCJjcmVhdGVkX2F0XCIsIHsgYXNjZW5kaW5nOiBmYWxzZSB9KTtcblxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IHRydWUsXG5cdFx0XHRkYXRhOiBkYXRhIHx8IFtdLFxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJGYWlsZWQgdG8gZ2V0IHBob25lIG51bWJlcnNcIixcblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogVXBkYXRlIHBob25lIG51bWJlciBjb25maWd1cmF0aW9uXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVBob25lTnVtYmVyKHBhcmFtczoge1xuXHRwaG9uZU51bWJlcklkOiBzdHJpbmc7XG5cdHJvdXRpbmdSdWxlSWQ/OiBzdHJpbmc7XG5cdGZvcndhcmRUb051bWJlcj86IHN0cmluZztcblx0dm9pY2VtYWlsRW5hYmxlZD86IGJvb2xlYW47XG59KSB7XG5cdHRyeSB7XG5cdFx0Y29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcblx0XHRpZiAoIXN1cGFiYXNlKSB7XG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiU2VydmljZSB1bmF2YWlsYWJsZVwiIH07XG5cdFx0fVxuXG5cdFx0Y29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwicGhvbmVfbnVtYmVyc1wiKVxuXHRcdFx0LnVwZGF0ZSh7XG5cdFx0XHRcdGNhbGxfcm91dGluZ19ydWxlX2lkOiBwYXJhbXMucm91dGluZ1J1bGVJZCxcblx0XHRcdFx0Zm9yd2FyZF90b19udW1iZXI6IHBhcmFtcy5mb3J3YXJkVG9OdW1iZXIsXG5cdFx0XHRcdHZvaWNlbWFpbF9lbmFibGVkOiBwYXJhbXMudm9pY2VtYWlsRW5hYmxlZCxcblx0XHRcdH0pXG5cdFx0XHQuZXEoXCJpZFwiLCBwYXJhbXMucGhvbmVOdW1iZXJJZClcblx0XHRcdC5zZWxlY3QoKVxuXHRcdFx0LnNpbmdsZSgpO1xuXG5cdFx0aWYgKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cblx0XHRyZXZhbGlkYXRlUGF0aChcIi9kYXNoYm9hcmQvc2V0dGluZ3MvY29tbXVuaWNhdGlvbnMvcGhvbmUtbnVtYmVyc1wiKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0ZGF0YSxcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdGVycm9yOlxuXHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yXG5cdFx0XHRcdFx0PyBlcnJvci5tZXNzYWdlXG5cdFx0XHRcdFx0OiBcIkZhaWxlZCB0byB1cGRhdGUgcGhvbmUgbnVtYmVyXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIFJlbGVhc2UgKGRlbGV0ZSkgYSBwaG9uZSBudW1iZXJcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZGVsZXRlUGhvbmVOdW1iZXIocGhvbmVOdW1iZXJJZDogc3RyaW5nKSB7XG5cdHRyeSB7XG5cdFx0Y29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcblx0XHRpZiAoIXN1cGFiYXNlKSB7XG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiU2VydmljZSB1bmF2YWlsYWJsZVwiIH07XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IHBob25lIG51bWJlciBkZXRhaWxzXG5cdFx0Y29uc3QgeyBkYXRhOiBwaG9uZU51bWJlciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwicGhvbmVfbnVtYmVyc1wiKVxuXHRcdFx0LnNlbGVjdChcIipcIilcblx0XHRcdC5lcShcImlkXCIsIHBob25lTnVtYmVySWQpXG5cdFx0XHQuc2luZ2xlKCk7XG5cblx0XHRpZiAoIXBob25lTnVtYmVyKSB7XG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiUGhvbmUgbnVtYmVyIG5vdCBmb3VuZFwiIH07XG5cdFx0fVxuXG5cdFx0Ly8gUmVsZWFzZSBmcm9tIFRlbG55eCBpZiB3ZSBoYXZlIHRoZSBJRFxuXHRcdGlmIChwaG9uZU51bWJlci50ZWxueXhfcGhvbmVfbnVtYmVyX2lkKSB7XG5cdFx0XHRhd2FpdCByZWxlYXNlTnVtYmVyKHBob25lTnVtYmVyLnRlbG55eF9waG9uZV9udW1iZXJfaWQpO1xuXHRcdH1cblxuXHRcdC8vIFNvZnQgZGVsZXRlIGluIGRhdGFiYXNlXG5cdFx0Y29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwicGhvbmVfbnVtYmVyc1wiKVxuXHRcdFx0LnVwZGF0ZSh7XG5cdFx0XHRcdGRlbGV0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcblx0XHRcdFx0c3RhdHVzOiBcImRlbGV0ZWRcIixcblx0XHRcdH0pXG5cdFx0XHQuZXEoXCJpZFwiLCBwaG9uZU51bWJlcklkKTtcblxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXG5cdFx0cmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL3NldHRpbmdzL2NvbW11bmljYXRpb25zL3Bob25lLW51bWJlcnNcIik7XG5cblx0XHRyZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3Jcblx0XHRcdFx0XHQ/IGVycm9yLm1lc3NhZ2Vcblx0XHRcdFx0XHQ6IFwiRmFpbGVkIHRvIGRlbGV0ZSBwaG9uZSBudW1iZXJcIixcblx0XHR9O1xuXHR9XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIENBTEwgT1BFUkFUSU9OUyBBQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogSW5pdGlhdGUgYW4gb3V0Ym91bmQgY2FsbFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFrZUNhbGwocGFyYW1zOiB7XG5cdHRvOiBzdHJpbmc7XG5cdGZyb206IHN0cmluZztcblx0Y29tcGFueUlkOiBzdHJpbmc7XG5cdGN1c3RvbWVySWQ/OiBzdHJpbmc7XG5cdGpvYklkPzogc3RyaW5nO1xuXHRwcm9wZXJ0eUlkPzogc3RyaW5nO1xuXHRpbnZvaWNlSWQ/OiBzdHJpbmc7XG5cdGVzdGltYXRlSWQ/OiBzdHJpbmc7XG59KSB7XG5cdHRyeSB7XG5cdFx0Y29uc29sZS5sb2coXCLwn5OeIG1ha2VDYWxsIGNhbGxlZCB3aXRoIHBhcmFtczpcIiwgcGFyYW1zKTtcblxuXHRcdGNvbnN0IGNhbGxDb25maWcgPSB2YWxpZGF0ZUNhbGxDb25maWcoKTtcblx0XHRjb25zb2xlLmxvZyhcIvCflI0gQ2FsbCBjb25maWcgdmFsaWRhdGlvbjpcIiwgY2FsbENvbmZpZyk7XG5cdFx0aWYgKCFjYWxsQ29uZmlnLnZhbGlkKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6IGNhbGxDb25maWcuZXJyb3IgfHwgXCJDYWxsIGNvbmZpZ3VyYXRpb24gaXMgaW52YWxpZFwiLFxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHRjb25zdCBjb21wYW55U2V0dGluZ3MgPSBhd2FpdCBnZXRDb21wYW55VGVsbnl4U2V0dGluZ3MoXG5cdFx0XHRzdXBhYmFzZSxcblx0XHRcdHBhcmFtcy5jb21wYW55SWQsXG5cdFx0KTtcblxuXHRcdGF3YWl0IGVuc3VyZVBob25lTnVtYmVyUmVjb3JkRXhpc3RzKFxuXHRcdFx0c3VwYWJhc2UsXG5cdFx0XHRwYXJhbXMuY29tcGFueUlkLFxuXHRcdFx0Y29tcGFueVNldHRpbmdzPy5kZWZhdWx0X291dGJvdW5kX251bWJlciB8fCBudWxsLFxuXHRcdCk7XG5cblx0XHRjb25zdCBjb25uZWN0aW9uT3ZlcnJpZGUgPVxuXHRcdFx0Y29tcGFueVNldHRpbmdzPy5jYWxsX2NvbnRyb2xfYXBwbGljYXRpb25faWQgfHxcblx0XHRcdFRFTE5ZWF9DT05GSUcuY29ubmVjdGlvbklkO1xuXHRcdGNvbnN0IGZyb21BZGRyZXNzID0gYXdhaXQgcmVzb2x2ZU91dGJvdW5kUGhvbmVOdW1iZXIoXG5cdFx0XHRzdXBhYmFzZSxcblx0XHRcdHBhcmFtcy5jb21wYW55SWQsXG5cdFx0XHRwYXJhbXMuZnJvbSxcblx0XHRcdGNvbXBhbnlTZXR0aW5ncz8uZGVmYXVsdF9vdXRib3VuZF9udW1iZXIgfHwgbnVsbCxcblx0XHQpO1xuXG5cdFx0aWYgKCFjb25uZWN0aW9uT3ZlcnJpZGUpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0XHRlcnJvcjogXCJObyBUZWxueXggY29ubmVjdGlvbiBjb25maWd1cmVkIGZvciB0aGlzIGNvbXBhbnkuXCIsXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGlmICghZnJvbUFkZHJlc3MpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0XHRlcnJvcjpcblx0XHRcdFx0XHRcIkNvbXBhbnkgZG9lcyBub3QgaGF2ZSBhIGRlZmF1bHQgb3V0Ym91bmQgcGhvbmUgbnVtYmVyIGNvbmZpZ3VyZWQuIFBsZWFzZSBwcm92aXNpb24gbnVtYmVycyBmaXJzdC5cIixcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Ly8gVEVNUDogU2tpcCBjb25uZWN0aW9uIHZlcmlmaWNhdGlvbiAtIExldmVsIDIgcmVxdWlyZWQgZm9yIEFQSSBhY2Nlc3Ncblx0XHQvLyBjb25zdCBjb25uZWN0aW9uU3RhdHVzID0gYXdhaXQgdmVyaWZ5Q29ubmVjdGlvbihjb25uZWN0aW9uT3ZlcnJpZGUpO1xuXHRcdC8vIGlmIChjb25uZWN0aW9uU3RhdHVzLm5lZWRzRml4KSB7XG5cdFx0Ly8gXHRyZXR1cm4ge1xuXHRcdC8vIFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHQvLyBcdFx0ZXJyb3I6IGBDb25uZWN0aW9uIGNvbmZpZ3VyYXRpb24gaXNzdWU6ICR7Y29ubmVjdGlvblN0YXR1cy5pc3N1ZXMuam9pbihcIiwgXCIpfS4gUnVuIGZpeENvbm5lY3Rpb24oKSB0byBhdXRvLWZpeC5gLFxuXHRcdC8vIFx0fTtcblx0XHQvLyB9XG5cblx0XHRjb25zdCB0b0FkZHJlc3MgPSBub3JtYWxpemVQaG9uZU51bWJlcihwYXJhbXMudG8pO1xuXG5cdFx0Ly8gVEVNUDogU2tpcCB2b2ljZSBjYXBhYmlsaXR5IGNoZWNrIC0gTGV2ZWwgMiByZXF1aXJlZCBmb3IgQVBJIGFjY2Vzc1xuXHRcdC8vIGNvbnN0IHZvaWNlQ2FwYWJpbGl0eSA9IGF3YWl0IHZlcmlmeVZvaWNlQ2FwYWJpbGl0eShmcm9tQWRkcmVzcyk7XG5cdFx0Ly8gaWYgKCF2b2ljZUNhcGFiaWxpdHkuaGFzVm9pY2UpIHtcblx0XHQvLyBcdHJldHVybiB7XG5cdFx0Ly8gXHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdC8vIFx0XHRlcnJvcjpcblx0XHQvLyBcdFx0XHR2b2ljZUNhcGFiaWxpdHkuZXJyb3IgfHwgXCJQaG9uZSBudW1iZXIgZG9lcyBub3Qgc3VwcG9ydCB2b2ljZSBjYWxsc1wiLFxuXHRcdC8vIFx0fTtcblx0XHQvLyB9XG5cblx0XHRjb25zdCB0ZWxueXhXZWJob29rVXJsID0gYXdhaXQgZ2V0VGVsbnl4V2ViaG9va1VybChwYXJhbXMuY29tcGFueUlkKTtcblx0XHRjb25zb2xlLmxvZyhcIvCflJcgV2ViaG9vayBVUkw6XCIsIHRlbG55eFdlYmhvb2tVcmwpO1xuXHRcdGlmICghdGVsbnl4V2ViaG9va1VybCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRcdGVycm9yOlxuXHRcdFx0XHRcdFwiU2l0ZSBVUkwgaXMgbm90IGNvbmZpZ3VyZWQuIFNldCBORVhUX1BVQkxJQ19TSVRFX1VSTCBvciBTSVRFX1VSTCB0byBhIHB1YmxpYyBodHRwcyBkb21haW4uXCIsXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGNvbnNvbGUubG9nKFwi8J+TpCBJbml0aWF0aW5nIGNhbGw6XCIsIHtcblx0XHRcdHRvOiB0b0FkZHJlc3MsXG5cdFx0XHRmcm9tOiBmcm9tQWRkcmVzcyxcblx0XHRcdGNvbm5lY3Rpb25JZDogY29ubmVjdGlvbk92ZXJyaWRlLFxuXHRcdFx0d2ViaG9va1VybDogdGVsbnl4V2ViaG9va1VybCxcblx0XHR9KTtcblxuXHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGluaXRpYXRlQ2FsbCh7XG5cdFx0XHR0bzogdG9BZGRyZXNzLFxuXHRcdFx0ZnJvbTogZnJvbUFkZHJlc3MsXG5cdFx0XHRjb25uZWN0aW9uSWQ6IGNvbm5lY3Rpb25PdmVycmlkZSxcblx0XHRcdHdlYmhvb2tVcmw6IHRlbG55eFdlYmhvb2tVcmwsXG5cdFx0XHRhbnN3ZXJpbmdNYWNoaW5lRGV0ZWN0aW9uOiBcInByZW1pdW1cIixcblx0XHR9KTtcblxuXHRcdGNvbnNvbGUubG9nKFwi8J+TpSBUZWxueXggQVBJIHJlc3BvbnNlOlwiLCByZXN1bHQpO1xuXG5cdFx0aWYgKCFyZXN1bHQuc3VjY2Vzcykge1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cblx0XHRjb25zdCBwaG9uZU51bWJlcklkID0gYXdhaXQgZ2V0UGhvbmVOdW1iZXJJZChzdXBhYmFzZSwgZnJvbUFkZHJlc3MpO1xuXHRcdGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImNvbW11bmljYXRpb25zXCIpXG5cdFx0XHQuaW5zZXJ0KHtcblx0XHRcdFx0Y29tcGFueV9pZDogY29tcGFueUlkLFxuXHRcdFx0XHRjdXN0b21lcl9pZDogcGFyYW1zLmN1c3RvbWVySWQsXG5cdFx0XHRcdGpvYl9pZDogcGFyYW1zLmpvYklkID8/IG51bGwsXG5cdFx0XHRcdHByb3BlcnR5X2lkOiBwYXJhbXMucHJvcGVydHlJZCA/PyBudWxsLFxuXHRcdFx0XHRpbnZvaWNlX2lkOiBwYXJhbXMuaW52b2ljZUlkID8/IG51bGwsXG5cdFx0XHRcdGVzdGltYXRlX2lkOiBwYXJhbXMuZXN0aW1hdGVJZCA/PyBudWxsLFxuXHRcdFx0XHR0eXBlOiBcInBob25lXCIsXG5cdFx0XHRcdGNoYW5uZWw6IFwidGVsbnl4XCIsXG5cdFx0XHRcdGRpcmVjdGlvbjogXCJvdXRib3VuZFwiLFxuXHRcdFx0XHRmcm9tX2FkZHJlc3M6IGZyb21BZGRyZXNzLFxuXHRcdFx0XHR0b19hZGRyZXNzOiB0b0FkZHJlc3MsXG5cdFx0XHRcdGJvZHk6IFwiXCIsXG5cdFx0XHRcdHN0YXR1czogXCJxdWV1ZWRcIixcblx0XHRcdFx0cHJpb3JpdHk6IFwibm9ybWFsXCIsXG5cdFx0XHRcdHBob25lX251bWJlcl9pZDogcGhvbmVOdW1iZXJJZCxcblx0XHRcdFx0aXNfYXJjaGl2ZWQ6IGZhbHNlLFxuXHRcdFx0XHRpc19hdXRvbWF0ZWQ6IGZhbHNlLFxuXHRcdFx0XHRpc19pbnRlcm5hbDogZmFsc2UsXG5cdFx0XHRcdGlzX3RocmVhZF9zdGFydGVyOiB0cnVlLFxuXHRcdFx0XHR0ZWxueXhfY2FsbF9jb250cm9sX2lkOiByZXN1bHQuY2FsbENvbnRyb2xJZCxcblx0XHRcdFx0dGVsbnl4X2NhbGxfc2Vzc2lvbl9pZDogcmVzdWx0LmNhbGxTZXNzaW9uSWQsXG5cdFx0XHR9KVxuXHRcdFx0LnNlbGVjdCgpXG5cdFx0XHQuc2luZ2xlKCk7XG5cblx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblxuXHRcdGNvbnNvbGUubG9nKFwi4pyFIENhbGwgY3JlYXRlZCBzdWNjZXNzZnVsbHk6XCIsIHtcblx0XHRcdGNhbGxDb250cm9sSWQ6IHJlc3VsdC5jYWxsQ29udHJvbElkLFxuXHRcdFx0Y29tbXVuaWNhdGlvbklkOiBkYXRhLmlkLFxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IHRydWUsXG5cdFx0XHRjYWxsQ29udHJvbElkOiByZXN1bHQuY2FsbENvbnRyb2xJZCxcblx0XHRcdGRhdGEsXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKFwi4p2MIG1ha2VDYWxsIGVycm9yOlwiLCBlcnJvcik7XG5cdFx0Y29uc29sZS5lcnJvcihcIkVycm9yIGRldGFpbHM6XCIsIHtcblx0XHRcdG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcblx0XHRcdHN0YWNrOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3Iuc3RhY2sgOiB1bmRlZmluZWQsXG5cdFx0fSk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJGYWlsZWQgdG8gbWFrZSBjYWxsXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIEFuc3dlciBhbiBpbmNvbWluZyBjYWxsXG4vKipcbiAqIEFuc3dlciBhbiBpbmNvbWluZyBjYWxsXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGFjY2VwdENhbGwoY2FsbENvbnRyb2xJZDogc3RyaW5nKSB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgdGVsbnl4V2ViaG9va1VybCA9IGF3YWl0IGdldFRlbG55eFdlYmhvb2tVcmwoKTtcblx0XHRpZiAoIXRlbG55eFdlYmhvb2tVcmwpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0XHRlcnJvcjpcblx0XHRcdFx0XHRcIlNpdGUgVVJMIGlzIG5vdCBjb25maWd1cmVkLiBTZXQgTkVYVF9QVUJMSUNfU0lURV9VUkwgb3IgU0lURV9VUkwgdG8gYSBwdWJsaWMgaHR0cHMgZG9tYWluLlwiLFxuXHRcdFx0fTtcblx0XHR9XG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgYW5zd2VyQ2FsbCh7XG5cdFx0XHRjYWxsQ29udHJvbElkLFxuXHRcdFx0d2ViaG9va1VybDogdGVsbnl4V2ViaG9va1VybCxcblx0XHR9KTtcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJGYWlsZWQgdG8gYW5zd2VyIGNhbGxcIixcblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogUmVqZWN0IGFuIGluY29taW5nIGNhbGxcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZGVjbGluZUNhbGwoY2FsbENvbnRyb2xJZDogc3RyaW5nKSB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgcmVqZWN0Q2FsbCh7XG5cdFx0XHRjYWxsQ29udHJvbElkLFxuXHRcdFx0Y2F1c2U6IFwiQ0FMTF9SRUpFQ1RFRFwiLFxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBcIkZhaWxlZCB0byByZWplY3QgY2FsbFwiLFxuXHRcdH07XG5cdH1cbn1cblxuLyoqXG4gKiBFbmQgYW4gYWN0aXZlIGNhbGxcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZW5kQ2FsbChjYWxsQ29udHJvbElkOiBzdHJpbmcpIHtcblx0dHJ5IHtcblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBoYW5ndXBDYWxsKHsgY2FsbENvbnRyb2xJZCB9KTtcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJGYWlsZWQgdG8gZW5kIGNhbGxcIixcblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogU3RhcnQgcmVjb3JkaW5nIGEgY2FsbFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RhcnRDYWxsUmVjb3JkaW5nKGNhbGxDb250cm9sSWQ6IHN0cmluZykge1xuXHR0cnkge1xuXHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IHN0YXJ0UmVjb3JkaW5nKHtcblx0XHRcdGNhbGxDb250cm9sSWQsXG5cdFx0XHRmb3JtYXQ6IFwibXAzXCIsXG5cdFx0XHRjaGFubmVsczogXCJzaW5nbGVcIixcblx0XHR9KTtcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJGYWlsZWQgdG8gc3RhcnQgcmVjb3JkaW5nXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIFN0b3AgcmVjb3JkaW5nIGEgY2FsbFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RvcENhbGxSZWNvcmRpbmcoY2FsbENvbnRyb2xJZDogc3RyaW5nKSB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgc3RvcFJlY29yZGluZyh7IGNhbGxDb250cm9sSWQgfSk7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdGVycm9yOlxuXHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFwiRmFpbGVkIHRvIHN0b3AgcmVjb3JkaW5nXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIFRyYW5zZmVyIGFuIGFjdGl2ZSBjYWxsIHRvIGFub3RoZXIgbnVtYmVyXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0cmFuc2ZlckFjdGl2ZUNhbGwocGFyYW1zOiB7XG5cdGNhbGxDb250cm9sSWQ6IHN0cmluZztcblx0dG86IHN0cmluZztcblx0ZnJvbTogc3RyaW5nO1xufSkge1xuXHR0cnkge1xuXHRcdGNvbnN0IHsgdHJhbnNmZXJDYWxsIH0gPSBhd2FpdCBpbXBvcnQoXCJAL2xpYi90ZWxueXgvY2FsbHNcIik7XG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgdHJhbnNmZXJDYWxsKHtcblx0XHRcdGNhbGxDb250cm9sSWQ6IHBhcmFtcy5jYWxsQ29udHJvbElkLFxuXHRcdFx0dG86IHBhcmFtcy50byxcblx0XHRcdGZyb206IHBhcmFtcy5mcm9tLFxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBcIkZhaWxlZCB0byB0cmFuc2ZlciBjYWxsXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIFRyYW5zY3JpYmUgYSBjYWxsIHJlY29yZGluZyB1c2luZyBBc3NlbWJseUFJXG4gKlxuICogU3VibWl0cyB0aGUgcmVjb3JkaW5nIFVSTCB0byBBc3NlbWJseUFJIGZvciBwb3N0LWNhbGwgdHJhbnNjcmlwdGlvbi5cbiAqIEFzc2VtYmx5QUkgd2lsbCBwcm9jZXNzIHRoZSBhdWRpbyBhbmQgc2VuZCB0aGUgdHJhbnNjcmlwdCB2aWEgd2ViaG9vay5cbiAqXG4gKiBAcGFyYW0gcmVjb3JkaW5nVXJsIC0gVVJMIG9mIHRoZSBjYWxsIHJlY29yZGluZyAoZnJvbSBUZWxueXgpXG4gKiBAcGFyYW0gY29tbXVuaWNhdGlvbklkIC0gRGF0YWJhc2UgSUQgb2YgdGhlIGNvbW11bmljYXRpb24gcmVjb3JkXG4gKiBAcmV0dXJucyBTdWNjZXNzL2Vycm9yIHJlc3BvbnNlIHdpdGggdHJhbnNjcmlwdGlvbiBqb2IgSURcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRyYW5zY3JpYmVDYWxsUmVjb3JkaW5nKHBhcmFtczoge1xuXHRyZWNvcmRpbmdVcmw6IHN0cmluZztcblx0Y29tbXVuaWNhdGlvbklkOiBzdHJpbmc7XG59KSB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgeyBzdWJtaXRUcmFuc2NyaXB0aW9uIH0gPSBhd2FpdCBpbXBvcnQoXCJAL2xpYi9hc3NlbWJseWFpL2NsaWVudFwiKTtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHRjb25zdCB3ZWJob29rVXJsID0gYXdhaXQgYnVpbGRBYnNvbHV0ZVVybChcIi9hcGkvd2ViaG9va3MvYXNzZW1ibHlhaVwiKTtcblx0XHRpZiAoIXdlYmhvb2tVcmwpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0XHRlcnJvcjpcblx0XHRcdFx0XHRcIlNpdGUgVVJMIGlzIG5vdCBjb25maWd1cmVkLiBTZXQgTkVYVF9QVUJMSUNfU0lURV9VUkwgb3IgU0lURV9VUkwuXCIsXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vIFN1Ym1pdCB0byBBc3NlbWJseUFJXG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgc3VibWl0VHJhbnNjcmlwdGlvbih7XG5cdFx0XHRhdWRpb191cmw6IHBhcmFtcy5yZWNvcmRpbmdVcmwsXG5cdFx0XHRzcGVha2VyX2xhYmVsczogdHJ1ZSwgLy8gRW5hYmxlIHNwZWFrZXIgZGlhcml6YXRpb25cblx0XHRcdHdlYmhvb2tfdXJsOiB3ZWJob29rVXJsLFxuXHRcdH0pO1xuXG5cdFx0aWYgKCEocmVzdWx0LnN1Y2Nlc3MgJiYgcmVzdWx0LmRhdGEpKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6IHJlc3VsdC5lcnJvciB8fCBcIkZhaWxlZCB0byBzdWJtaXQgdHJhbnNjcmlwdGlvblwiLFxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHQvLyBTdG9yZSB0cmFuc2NyaXB0aW9uIGpvYiBJRCBpbiBkYXRhYmFzZVxuXHRcdGF3YWl0IG1lcmdlUHJvdmlkZXJNZXRhZGF0YShzdXBhYmFzZSwgcGFyYW1zLmNvbW11bmljYXRpb25JZCwge1xuXHRcdFx0YXNzZW1ibHlhaV90cmFuc2NyaXB0aW9uX2lkOiByZXN1bHQuZGF0YS5pZCxcblx0XHRcdGFzc2VtYmx5YWlfc3RhdHVzOiByZXN1bHQuZGF0YS5zdGF0dXMsXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogdHJ1ZSxcblx0XHRcdHRyYW5zY3JpcHRpb25JZDogcmVzdWx0LmRhdGEuaWQsXG5cdFx0XHRzdGF0dXM6IHJlc3VsdC5kYXRhLnN0YXR1cyxcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdGVycm9yOlxuXHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yXG5cdFx0XHRcdFx0PyBlcnJvci5tZXNzYWdlXG5cdFx0XHRcdFx0OiBcIkZhaWxlZCB0byB0cmFuc2NyaWJlIHJlY29yZGluZ1wiLFxuXHRcdH07XG5cdH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU01TIE9QRVJBVElPTlMgQUNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIFNlbmQgYW4gU01TIG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRUZXh0TWVzc2FnZShwYXJhbXM6IHtcblx0dG86IHN0cmluZztcblx0ZnJvbTogc3RyaW5nO1xuXHR0ZXh0OiBzdHJpbmc7XG5cdGNvbXBhbnlJZD86IHN0cmluZzsgLy8gT3B0aW9uYWwgLSB3aWxsIGJlIGZldGNoZWQgaWYgbm90IHByb3ZpZGVkXG5cdGN1c3RvbWVySWQ/OiBzdHJpbmc7XG5cdGpvYklkPzogc3RyaW5nO1xuXHRpbnZvaWNlSWQ/OiBzdHJpbmc7XG5cdGVzdGltYXRlSWQ/OiBzdHJpbmc7XG59KSB7XG5cdHRyeSB7XG5cdFx0Y29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcblx0XHRpZiAoIXN1cGFiYXNlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwi4p2MIFN1cGFiYXNlIGNsaWVudCB1bmF2YWlsYWJsZVwiKTtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHQvLyBHZXQgY29tcGFueSBJRCBpZiBub3QgcHJvdmlkZWRcblx0XHRsZXQgY29tcGFueUlkID0gcGFyYW1zLmNvbXBhbnlJZDtcblx0XHRpZiAoIWNvbXBhbnlJZCkge1xuXHRcdFx0Y29uc3QgeyBnZXRBY3RpdmVDb21wYW55SWQgfSA9IGF3YWl0IGltcG9ydChcIkAvbGliL2F1dGgvY29tcGFueS1jb250ZXh0XCIpO1xuXHRcdFx0Y29tcGFueUlkID0gYXdhaXQgZ2V0QWN0aXZlQ29tcGFueUlkKCk7XG5cdFx0XHRpZiAoIWNvbXBhbnlJZCkge1xuXHRcdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiTm8gYWN0aXZlIGNvbXBhbnkgZm91bmRcIiB9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnNvbGUubG9nKFwi8J+TsSBTTVMgU2VuZCBSZXF1ZXN0OlwiLCB7XG5cdFx0XHR0bzogcGFyYW1zLnRvLFxuXHRcdFx0ZnJvbTogcGFyYW1zLmZyb20sXG5cdFx0XHRjb21wYW55SWQsXG5cdFx0fSk7XG5cblx0XHRjb25zdCBjb21wYW55U2V0dGluZ3MgPSBhd2FpdCBnZXRDb21wYW55VGVsbnl4U2V0dGluZ3MoXG5cdFx0XHRzdXBhYmFzZSxcblx0XHRcdGNvbXBhbnlJZCxcblx0XHQpO1xuXHRcdGlmICghY29tcGFueVNldHRpbmdzKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwi4p2MIENvbXBhbnkgc2V0dGluZ3Mgbm90IGZvdW5kXCIpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRcdGVycm9yOlxuXHRcdFx0XHRcdFwiVW5hYmxlIHRvIHByb3Zpc2lvbiBUZWxueXggcmVzb3VyY2VzIGZvciB0aGlzIGNvbXBhbnkuIFBsZWFzZSB2ZXJpZnkgdGhlIGNvbXBhbnkncyBvbmJvYXJkaW5nIGlzIGNvbXBsZXRlIGFuZCB0cnkgYWdhaW4uXCIsXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRjb25zb2xlLmxvZyhcIuKchSBDb21wYW55IHNldHRpbmdzIGxvYWRlZDpcIiwge1xuXHRcdFx0bWVzc2FnaW5nUHJvZmlsZUlkOiBjb21wYW55U2V0dGluZ3MubWVzc2FnaW5nX3Byb2ZpbGVfaWQsXG5cdFx0XHRkZWZhdWx0TnVtYmVyOiBjb21wYW55U2V0dGluZ3MuZGVmYXVsdF9vdXRib3VuZF9udW1iZXIsXG5cdFx0fSk7XG5cblx0XHRhd2FpdCBlbnN1cmVQaG9uZU51bWJlclJlY29yZEV4aXN0cyhcblx0XHRcdHN1cGFiYXNlLFxuXHRcdFx0Y29tcGFueUlkLFxuXHRcdFx0Y29tcGFueVNldHRpbmdzLmRlZmF1bHRfb3V0Ym91bmRfbnVtYmVyLFxuXHRcdCk7XG5cblx0XHRjb25zdCBzbXNDb25maWcgPSBhd2FpdCB2YWxpZGF0ZVNtc0NvbmZpZygpO1xuXHRcdGlmICghc21zQ29uZmlnLnZhbGlkICYmICFjb21wYW55U2V0dGluZ3M/Lm1lc3NhZ2luZ19wcm9maWxlX2lkKSB7XG5cdFx0XHRsZXQgZXJyb3JNZXNzYWdlID0gc21zQ29uZmlnLmVycm9yIHx8IFwiU01TIGNvbmZpZ3VyYXRpb24gaXMgaW52YWxpZFwiO1xuXHRcdFx0aWYgKHNtc0NvbmZpZy5zdWdnZXN0ZWRQcm9maWxlSWQpIHtcblx0XHRcdFx0ZXJyb3JNZXNzYWdlICs9IGAgRm91bmQgbWVzc2FnaW5nIHByb2ZpbGUgXCIke3Ntc0NvbmZpZy5zdWdnZXN0ZWRQcm9maWxlSWR9XCIgaW4geW91ciBUZWxueXggYWNjb3VudC4gU2V0IFRFTE5ZWF9ERUZBVUxUX01FU1NBR0lOR19QUk9GSUxFX0lEPSR7c21zQ29uZmlnLnN1Z2dlc3RlZFByb2ZpbGVJZH0gb3IgcHJvdmlzaW9uIGNvbXBhbnktc3BlY2lmaWMgc2V0dGluZ3MuYDtcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUuZXJyb3IoXCLinYwgU01TIGNvbmZpZyBpbnZhbGlkOlwiLCBlcnJvck1lc3NhZ2UpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRcdGVycm9yOiBlcnJvck1lc3NhZ2UsXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRjb25zb2xlLmxvZyhcIuKchSBTTVMgY29uZmlnIHZhbGlkXCIpO1xuXG5cdFx0Y29uc3QgbWVzc2FnaW5nUHJvZmlsZUlkID1cblx0XHRcdGNvbXBhbnlTZXR0aW5ncz8ubWVzc2FnaW5nX3Byb2ZpbGVfaWQgfHwgREVGQVVMVF9NRVNTQUdJTkdfUFJPRklMRV9JRDtcblx0XHRpZiAoIW1lc3NhZ2luZ1Byb2ZpbGVJZCkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihcIuKdjCBObyBtZXNzYWdpbmcgcHJvZmlsZSBJRFwiKTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0XHRlcnJvcjpcblx0XHRcdFx0XHRcIk1lc3NhZ2luZyBwcm9maWxlIGlzIG5vdCBjb25maWd1cmVkIGZvciB0aGlzIGNvbXBhbnkuIFBsZWFzZSBwcm92aXNpb24gY29tbXVuaWNhdGlvbnMgYmVmb3JlIHNlbmRpbmcgU01TLlwiLFxuXHRcdFx0fTtcblx0XHR9XG5cdFx0Y29uc29sZS5sb2coXCLinIUgVXNpbmcgbWVzc2FnaW5nIHByb2ZpbGU6XCIsIG1lc3NhZ2luZ1Byb2ZpbGVJZCk7XG5cblx0XHRpZiAobWVzc2FnaW5nUHJvZmlsZUlkKSB7XG5cdFx0XHRjb25zdCBtZXNzYWdpbmdQcm9maWxlU3RhdHVzID1cblx0XHRcdFx0YXdhaXQgdmVyaWZ5TWVzc2FnaW5nUHJvZmlsZShtZXNzYWdpbmdQcm9maWxlSWQpO1xuXHRcdFx0aWYgKG1lc3NhZ2luZ1Byb2ZpbGVTdGF0dXMubmVlZHNGaXgpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0XHRcIuKdjCBNZXNzYWdpbmcgcHJvZmlsZSBuZWVkcyBmaXg6XCIsXG5cdFx0XHRcdFx0bWVzc2FnaW5nUHJvZmlsZVN0YXR1cy5pc3N1ZXMsXG5cdFx0XHRcdCk7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRcdFx0ZXJyb3I6IGBNZXNzYWdpbmcgcHJvZmlsZSBjb25maWd1cmF0aW9uIGlzc3VlOiAke21lc3NhZ2luZ1Byb2ZpbGVTdGF0dXMuaXNzdWVzLmpvaW4oXCIsIFwiKX0uIFJ1biBmaXhNZXNzYWdpbmdQcm9maWxlKCkgb3IgcmVwcm92aXNpb24gdGhlIGNvbXBhbnkuYCxcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUubG9nKFwi4pyFIE1lc3NhZ2luZyBwcm9maWxlIHZlcmlmaWVkXCIpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZyb21BZGRyZXNzID0gYXdhaXQgcmVzb2x2ZU91dGJvdW5kUGhvbmVOdW1iZXIoXG5cdFx0XHRzdXBhYmFzZSxcblx0XHRcdGNvbXBhbnlJZCxcblx0XHRcdHBhcmFtcy5mcm9tLFxuXHRcdFx0Y29tcGFueVNldHRpbmdzLmRlZmF1bHRfb3V0Ym91bmRfbnVtYmVyLFxuXHRcdCk7XG5cdFx0aWYgKCFmcm9tQWRkcmVzcykge1xuXHRcdFx0Y29uc29sZS5lcnJvcihcIuKdjCBObyBmcm9tIG51bWJlciBhdmFpbGFibGVcIik7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6XG5cdFx0XHRcdFx0XCJDb21wYW55IGRvZXMgbm90IGhhdmUgYSBkZWZhdWx0IG91dGJvdW5kIHBob25lIG51bWJlciBjb25maWd1cmVkLiBQbGVhc2UgcHJvdmlzaW9uIG51bWJlcnMgZmlyc3QuXCIsXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRjb25zdCB0b0FkZHJlc3MgPSBub3JtYWxpemVQaG9uZU51bWJlcihwYXJhbXMudG8pO1xuXHRcdGNvbnNvbGUubG9nKFwi4pyFIFBob25lIG51bWJlcnMgbm9ybWFsaXplZDpcIiwge1xuXHRcdFx0ZnJvbTogZnJvbUFkZHJlc3MsXG5cdFx0XHR0bzogdG9BZGRyZXNzLFxuXHRcdH0pO1xuXG5cdFx0Ly8gVmVyaWZ5IHBob25lIG51bWJlciBoYXMgU01TIGNhcGFiaWxpdHlcblx0XHRjb25zb2xlLmxvZyhcIvCflI0gVmVyaWZ5aW5nIFNNUyBjYXBhYmlsaXR5IGZvcjpcIiwgZnJvbUFkZHJlc3MpO1xuXHRcdGNvbnN0IHNtc0NhcGFiaWxpdHkgPSBhd2FpdCB2ZXJpZnlTbXNDYXBhYmlsaXR5KGZyb21BZGRyZXNzKTtcblx0XHRpZiAoIXNtc0NhcGFiaWxpdHkuaGFzU21zKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwi4p2MIFNNUyBjYXBhYmlsaXR5IGNoZWNrIGZhaWxlZDpcIiwgc21zQ2FwYWJpbGl0eS5lcnJvcik7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6IHNtc0NhcGFiaWxpdHkuZXJyb3IgfHwgXCJQaG9uZSBudW1iZXIgZG9lcyBub3Qgc3VwcG9ydCBTTVNcIixcblx0XHRcdH07XG5cdFx0fVxuXHRcdGNvbnNvbGUubG9nKFwi4pyFIFNNUyBjYXBhYmlsaXR5IHZlcmlmaWVkXCIpO1xuXG5cdFx0Y29uc3Qgd2ViaG9va1VybCA9IGF3YWl0IGdldFRlbG55eFdlYmhvb2tVcmwoY29tcGFueUlkKTtcblx0XHRpZiAoIXdlYmhvb2tVcmwpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCLinYwgTm8gd2ViaG9vayBVUkxcIik7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6XG5cdFx0XHRcdFx0XCJTaXRlIFVSTCBpcyBub3QgY29uZmlndXJlZC4gU2V0IE5FWFRfUFVCTElDX1NJVEVfVVJMIG9yIFNJVEVfVVJMIHRvIGEgcHVibGljIGh0dHBzIGRvbWFpbi5cIixcblx0XHRcdH07XG5cdFx0fVxuXHRcdGNvbnNvbGUubG9nKFwi4pyFIFdlYmhvb2sgVVJMOlwiLCB3ZWJob29rVXJsKTtcblxuXHRcdC8vIFNlbmQgU01TIHZpYSBUZWxueXhcblx0XHRjb25zb2xlLmxvZyhcIvCfk6QgU2VuZGluZyBTTVMgdmlhIFRlbG55eCBBUEkuLi5cIik7XG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgc2VuZFNNUyh7XG5cdFx0XHR0bzogdG9BZGRyZXNzLFxuXHRcdFx0ZnJvbTogZnJvbUFkZHJlc3MsXG5cdFx0XHR0ZXh0OiBwYXJhbXMudGV4dCxcblx0XHRcdHdlYmhvb2tVcmwsXG5cdFx0XHRtZXNzYWdpbmdQcm9maWxlSWQsXG5cdFx0fSk7XG5cblx0XHRpZiAoIXJlc3VsdC5zdWNjZXNzKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwi4p2MIFRlbG55eCBBUEkgZmFpbGVkOlwiLCByZXN1bHQuZXJyb3IpO1xuXG5cdFx0XHQvLyBDaGVjayBpZiBlcnJvciBpcyAxMERMQyByZWdpc3RyYXRpb24gcmVxdWlyZWRcblx0XHRcdGlmIChcblx0XHRcdFx0cmVzdWx0LmVycm9yICYmXG5cdFx0XHRcdChyZXN1bHQuZXJyb3IuaW5jbHVkZXMoXCIxMERMQ1wiKSB8fFxuXHRcdFx0XHRcdHJlc3VsdC5lcnJvci5pbmNsdWRlcyhcIk5vdCAxMERMQyByZWdpc3RlcmVkXCIpIHx8XG5cdFx0XHRcdFx0cmVzdWx0LmVycm9yLmluY2x1ZGVzKFwiQTJQXCIpKVxuXHRcdFx0KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRcdFwi8J+UhCBEZXRlY3RlZCAxMERMQyByZWdpc3RyYXRpb24gcmVxdWlyZWQsIGF0dGVtcHRpbmcgYXV0by1yZWdpc3RyYXRpb24uLi5cIixcblx0XHRcdFx0KTtcblxuXHRcdFx0XHQvLyBJbXBvcnQgMTBETEMgcmVnaXN0cmF0aW9uIGZ1bmN0aW9uXG5cdFx0XHRcdGNvbnN0IHsgcmVnaXN0ZXJDb21wYW55Rm9yMTBETEMgfSA9IGF3YWl0IGltcG9ydChcblx0XHRcdFx0XHRcIkAvYWN0aW9ucy90ZW4tZGxjLXJlZ2lzdHJhdGlvblwiXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Y29uc3QgcmVnaXN0cmF0aW9uUmVzdWx0ID0gYXdhaXQgcmVnaXN0ZXJDb21wYW55Rm9yMTBETEMoXG5cdFx0XHRcdFx0Y29tcGFueUlkLFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmIChyZWdpc3RyYXRpb25SZXN1bHQuc3VjY2Vzcykge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwi4pyFIDEwRExDIHJlZ2lzdHJhdGlvbiBzdWNjZXNzZnVsLCByZXRyeWluZyBTTVMgc2VuZC4uLlwiKTtcblxuXHRcdFx0XHRcdC8vIFJldHJ5IHRoZSBTTVMgc2VuZCBub3cgdGhhdCAxMERMQyBpcyByZWdpc3RlcmVkXG5cdFx0XHRcdFx0Y29uc3QgcmV0cnlSZXN1bHQgPSBhd2FpdCBzZW5kU01TKHtcblx0XHRcdFx0XHRcdHRvOiB0b0FkZHJlc3MsXG5cdFx0XHRcdFx0XHRmcm9tOiBmcm9tQWRkcmVzcyxcblx0XHRcdFx0XHRcdHRleHQ6IHBhcmFtcy50ZXh0LFxuXHRcdFx0XHRcdFx0d2ViaG9va1VybCxcblx0XHRcdFx0XHRcdG1lc3NhZ2luZ1Byb2ZpbGVJZCxcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGlmICghcmV0cnlSZXN1bHQuc3VjY2Vzcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdGVycm9yOiBgMTBETEMgcmVnaXN0cmF0aW9uIGNvbXBsZXRlZCBidXQgU01TIHN0aWxsIGZhaWxlZDogJHtyZXRyeVJlc3VsdC5lcnJvcn0uIFRoZSBjYW1wYWlnbiBtYXkgbmVlZCBhZGRpdGlvbmFsIGFwcHJvdmFsIHRpbWUuYCxcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHJlc3VsdCB3aXRoIHJldHJ5IHN1Y2Nlc3Ncblx0XHRcdFx0XHRyZXN1bHQuc3VjY2VzcyA9IHRydWU7XG5cdFx0XHRcdFx0cmVzdWx0Lm1lc3NhZ2VJZCA9IHJldHJ5UmVzdWx0Lm1lc3NhZ2VJZDtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIuKchSBTTVMgcmV0cnkgc3VjY2Vzc2Z1bCBhZnRlciAxMERMQyByZWdpc3RyYXRpb25cIik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ZXJyb3I6IGAxMERMQyByZWdpc3RyYXRpb24gZmFpbGVkOiAke3JlZ2lzdHJhdGlvblJlc3VsdC5lcnJvcn0uIE9yaWdpbmFsIGVycm9yOiAke3Jlc3VsdC5lcnJvcn1gLFxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNvbnNvbGUubG9nKFwi4pyFIFRlbG55eCBBUEkgc3VjY2VzczpcIiwgcmVzdWx0Lm1lc3NhZ2VJZCk7XG5cblx0XHQvLyBDcmVhdGUgY29tbXVuaWNhdGlvbiByZWNvcmRcblx0XHRjb25zb2xlLmxvZyhcIvCfkr4gQ3JlYXRpbmcgY29tbXVuaWNhdGlvbiByZWNvcmQgaW4gZGF0YWJhc2UuLi5cIik7XG5cdFx0Y29uc3QgcGhvbmVOdW1iZXJJZCA9IGF3YWl0IGdldFBob25lTnVtYmVySWQoc3VwYWJhc2UsIGZyb21BZGRyZXNzKTtcblx0XHRjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJjb21tdW5pY2F0aW9uc1wiKVxuXHRcdFx0Lmluc2VydCh7XG5cdFx0XHRcdGNvbXBhbnlfaWQ6IGNvbXBhbnlJZCxcblx0XHRcdFx0Y3VzdG9tZXJfaWQ6IHBhcmFtcy5jdXN0b21lcklkLFxuXHRcdFx0XHRqb2JfaWQ6IHBhcmFtcy5qb2JJZCA/PyBudWxsLFxuXHRcdFx0XHRpbnZvaWNlX2lkOiBwYXJhbXMuaW52b2ljZUlkID8/IG51bGwsXG5cdFx0XHRcdGVzdGltYXRlX2lkOiBwYXJhbXMuZXN0aW1hdGVJZCA/PyBudWxsLFxuXHRcdFx0XHR0eXBlOiBcInNtc1wiLFxuXHRcdFx0XHRjaGFubmVsOiBcInRlbG55eFwiLFxuXHRcdFx0XHRkaXJlY3Rpb246IFwib3V0Ym91bmRcIixcblx0XHRcdFx0ZnJvbV9hZGRyZXNzOiBmcm9tQWRkcmVzcyxcblx0XHRcdFx0dG9fYWRkcmVzczogdG9BZGRyZXNzLFxuXHRcdFx0XHRib2R5OiBwYXJhbXMudGV4dCxcblx0XHRcdFx0c3RhdHVzOiBcInF1ZXVlZFwiLFxuXHRcdFx0XHRwcmlvcml0eTogXCJub3JtYWxcIixcblx0XHRcdFx0cGhvbmVfbnVtYmVyX2lkOiBwaG9uZU51bWJlcklkLFxuXHRcdFx0XHRpc19hcmNoaXZlZDogZmFsc2UsXG5cdFx0XHRcdGlzX2F1dG9tYXRlZDogZmFsc2UsXG5cdFx0XHRcdGlzX2ludGVybmFsOiBmYWxzZSxcblx0XHRcdFx0aXNfdGhyZWFkX3N0YXJ0ZXI6IHRydWUsXG5cdFx0XHRcdHRlbG55eF9tZXNzYWdlX2lkOiByZXN1bHQubWVzc2FnZUlkLFxuXHRcdFx0fSlcblx0XHRcdC5zZWxlY3QoKVxuXHRcdFx0LnNpbmdsZSgpO1xuXG5cdFx0aWYgKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cblx0XHRyZXZhbGlkYXRlUGF0aChcIi9kYXNoYm9hcmQvY29tbXVuaWNhdGlvblwiKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0bWVzc2FnZUlkOiByZXN1bHQubWVzc2FnZUlkLFxuXHRcdFx0ZGF0YSxcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJTTVMgc2VuZCBlcnJvcjpcIiwgZXJyb3IpO1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJFcnJvciBkZXRhaWxzOlwiLCB7XG5cdFx0XHRtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG5cdFx0XHRzdGFjazogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLnN0YWNrIDogdW5kZWZpbmVkLFxuXHRcdFx0dHlwZTogdHlwZW9mIGVycm9yLFxuXHRcdFx0c3RyaW5naWZpZWQ6IEpTT04uc3RyaW5naWZ5KGVycm9yLCBudWxsLCAyKSxcblx0XHR9KTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRlcnJvcjpcblx0XHRcdFx0ZXJyb3IgaW5zdGFuY2VvZiBFcnJvclxuXHRcdFx0XHRcdD8gZXJyb3IubWVzc2FnZVxuXHRcdFx0XHRcdDogYEZhaWxlZCB0byBzZW5kIFNNUzogJHtTdHJpbmcoZXJyb3IpfWAsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIFNlbmQgYW4gTU1TIG1lc3NhZ2Ugd2l0aCBtZWRpYVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZE1NU01lc3NhZ2UocGFyYW1zOiB7XG5cdHRvOiBzdHJpbmc7XG5cdGZyb206IHN0cmluZztcblx0dGV4dD86IHN0cmluZztcblx0bWVkaWFVcmxzOiBzdHJpbmdbXTtcblx0Y29tcGFueUlkPzogc3RyaW5nOyAvLyBPcHRpb25hbCAtIHdpbGwgYmUgZmV0Y2hlZCBpZiBub3QgcHJvdmlkZWRcblx0Y3VzdG9tZXJJZD86IHN0cmluZztcblx0am9iSWQ/OiBzdHJpbmc7XG5cdHByb3BlcnR5SWQ/OiBzdHJpbmc7XG5cdGludm9pY2VJZD86IHN0cmluZztcblx0ZXN0aW1hdGVJZD86IHN0cmluZztcbn0pIHtcblx0dHJ5IHtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHQvLyBHZXQgY29tcGFueSBJRCBpZiBub3QgcHJvdmlkZWRcblx0XHRsZXQgY29tcGFueUlkID0gcGFyYW1zLmNvbXBhbnlJZDtcblx0XHRpZiAoIWNvbXBhbnlJZCkge1xuXHRcdFx0Y29uc3QgeyBnZXRBY3RpdmVDb21wYW55SWQgfSA9IGF3YWl0IGltcG9ydChcIkAvbGliL2F1dGgvY29tcGFueS1jb250ZXh0XCIpO1xuXHRcdFx0Y29tcGFueUlkID0gYXdhaXQgZ2V0QWN0aXZlQ29tcGFueUlkKCk7XG5cdFx0XHRpZiAoIWNvbXBhbnlJZCkge1xuXHRcdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiTm8gYWN0aXZlIGNvbXBhbnkgZm91bmRcIiB9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnN0IGNvbXBhbnlTZXR0aW5ncyA9IGF3YWl0IGdldENvbXBhbnlUZWxueXhTZXR0aW5ncyhcblx0XHRcdHN1cGFiYXNlLFxuXHRcdFx0Y29tcGFueUlkLFxuXHRcdCk7XG5cdFx0aWYgKCFjb21wYW55U2V0dGluZ3MpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0XHRlcnJvcjpcblx0XHRcdFx0XHRcIlVuYWJsZSB0byBwcm92aXNpb24gVGVsbnl4IHJlc291cmNlcyBmb3IgdGhpcyBjb21wYW55LiBQbGVhc2UgdmVyaWZ5IG9uYm9hcmRpbmcgaXMgY29tcGxldGUuXCIsXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGF3YWl0IGVuc3VyZVBob25lTnVtYmVyUmVjb3JkRXhpc3RzKFxuXHRcdFx0c3VwYWJhc2UsXG5cdFx0XHRjb21wYW55SWQsXG5cdFx0XHRjb21wYW55U2V0dGluZ3MuZGVmYXVsdF9vdXRib3VuZF9udW1iZXIsXG5cdFx0KTtcblxuXHRcdGNvbnN0IHNtc0NvbmZpZyA9IGF3YWl0IHZhbGlkYXRlU21zQ29uZmlnKCk7XG5cdFx0aWYgKCFzbXNDb25maWcudmFsaWQgJiYgIWNvbXBhbnlTZXR0aW5ncy5tZXNzYWdpbmdfcHJvZmlsZV9pZCkge1xuXHRcdFx0bGV0IGVycm9yTWVzc2FnZSA9IHNtc0NvbmZpZy5lcnJvciB8fCBcIlNNUyBjb25maWd1cmF0aW9uIGlzIGludmFsaWRcIjtcblx0XHRcdGlmIChzbXNDb25maWcuc3VnZ2VzdGVkUHJvZmlsZUlkKSB7XG5cdFx0XHRcdGVycm9yTWVzc2FnZSArPSBgIEZvdW5kIG1lc3NhZ2luZyBwcm9maWxlIFwiJHtzbXNDb25maWcuc3VnZ2VzdGVkUHJvZmlsZUlkfVwiIGluIHlvdXIgVGVsbnl4IGFjY291bnQuIFNldCBURUxOWVhfREVGQVVMVF9NRVNTQUdJTkdfUFJPRklMRV9JRD0ke3Ntc0NvbmZpZy5zdWdnZXN0ZWRQcm9maWxlSWR9IG9yIHJlcHJvdmlzaW9uIHRoZSBjb21wYW55LmA7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6IGVycm9yTWVzc2FnZSxcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y29uc3QgbWVzc2FnaW5nUHJvZmlsZUlkID1cblx0XHRcdGNvbXBhbnlTZXR0aW5ncy5tZXNzYWdpbmdfcHJvZmlsZV9pZCB8fCBERUZBVUxUX01FU1NBR0lOR19QUk9GSUxFX0lEO1xuXHRcdGlmICghbWVzc2FnaW5nUHJvZmlsZUlkKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6XG5cdFx0XHRcdFx0XCJNZXNzYWdpbmcgcHJvZmlsZSBpcyBub3QgY29uZmlndXJlZCBmb3IgdGhpcyBjb21wYW55LiBQbGVhc2UgcHJvdmlzaW9uIGNvbW11bmljYXRpb25zIGJlZm9yZSBzZW5kaW5nIE1NUy5cIixcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y29uc3QgZnJvbUFkZHJlc3MgPSBhd2FpdCByZXNvbHZlT3V0Ym91bmRQaG9uZU51bWJlcihcblx0XHRcdHN1cGFiYXNlLFxuXHRcdFx0Y29tcGFueUlkLFxuXHRcdFx0cGFyYW1zLmZyb20sXG5cdFx0XHRjb21wYW55U2V0dGluZ3MuZGVmYXVsdF9vdXRib3VuZF9udW1iZXIsXG5cdFx0KTtcblx0XHRpZiAoIWZyb21BZGRyZXNzKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6XG5cdFx0XHRcdFx0XCJDb21wYW55IGRvZXMgbm90IGhhdmUgYSBkZWZhdWx0IG91dGJvdW5kIHBob25lIG51bWJlciBjb25maWd1cmVkLlwiLFxuXHRcdFx0fTtcblx0XHR9XG5cdFx0Y29uc3QgdG9BZGRyZXNzID0gbm9ybWFsaXplUGhvbmVOdW1iZXIocGFyYW1zLnRvKTtcblxuXHRcdGNvbnN0IHdlYmhvb2tVcmwgPSBhd2FpdCBnZXRUZWxueXhXZWJob29rVXJsKGNvbXBhbnlJZCk7XG5cdFx0aWYgKCF3ZWJob29rVXJsKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6XG5cdFx0XHRcdFx0XCJTaXRlIFVSTCBpcyBub3QgY29uZmlndXJlZC4gU2V0IE5FWFRfUFVCTElDX1NJVEVfVVJMIG9yIFNJVEVfVVJMIHRvIGEgcHVibGljIGh0dHBzIGRvbWFpbi5cIixcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKG1lc3NhZ2luZ1Byb2ZpbGVJZCkge1xuXHRcdFx0Y29uc3QgbWVzc2FnaW5nUHJvZmlsZVN0YXR1cyA9XG5cdFx0XHRcdGF3YWl0IHZlcmlmeU1lc3NhZ2luZ1Byb2ZpbGUobWVzc2FnaW5nUHJvZmlsZUlkKTtcblx0XHRcdGlmIChtZXNzYWdpbmdQcm9maWxlU3RhdHVzLm5lZWRzRml4KSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRcdFx0ZXJyb3I6IGBNZXNzYWdpbmcgcHJvZmlsZSBjb25maWd1cmF0aW9uIGlzc3VlOiAke21lc3NhZ2luZ1Byb2ZpbGVTdGF0dXMuaXNzdWVzLmpvaW4oXCIsIFwiKX0uIFJ1biBmaXhNZXNzYWdpbmdQcm9maWxlKCkgb3IgcmVwcm92aXNpb24gdGhlIGNvbXBhbnkuYCxcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRjb25zdCBzbXNDYXBhYmlsaXR5ID0gYXdhaXQgdmVyaWZ5U21zQ2FwYWJpbGl0eShmcm9tQWRkcmVzcyk7XG5cdFx0aWYgKCFzbXNDYXBhYmlsaXR5Lmhhc1Ntcykge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRcdGVycm9yOiBzbXNDYXBhYmlsaXR5LmVycm9yIHx8IFwiUGhvbmUgbnVtYmVyIGRvZXMgbm90IHN1cHBvcnQgU01TL01NU1wiLFxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBzZW5kTU1TKHtcblx0XHRcdHRvOiB0b0FkZHJlc3MsXG5cdFx0XHRmcm9tOiBmcm9tQWRkcmVzcyxcblx0XHRcdHRleHQ6IHBhcmFtcy50ZXh0LFxuXHRcdFx0bWVkaWFVcmxzOiBwYXJhbXMubWVkaWFVcmxzLFxuXHRcdFx0d2ViaG9va1VybCxcblx0XHRcdG1lc3NhZ2luZ1Byb2ZpbGVJZCxcblx0XHR9KTtcblxuXHRcdGlmICghcmVzdWx0LnN1Y2Nlc3MpIHtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcGhvbmVOdW1iZXJJZCA9IGF3YWl0IGdldFBob25lTnVtYmVySWQoc3VwYWJhc2UsIGZyb21BZGRyZXNzKTtcblx0XHRjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJjb21tdW5pY2F0aW9uc1wiKVxuXHRcdFx0Lmluc2VydCh7XG5cdFx0XHRcdGNvbXBhbnlfaWQ6IGNvbXBhbnlJZCxcblx0XHRcdFx0Y3VzdG9tZXJfaWQ6IHBhcmFtcy5jdXN0b21lcklkLFxuXHRcdFx0XHRqb2JfaWQ6IHBhcmFtcy5qb2JJZCA/PyBudWxsLFxuXHRcdFx0XHRwcm9wZXJ0eV9pZDogcGFyYW1zLnByb3BlcnR5SWQgPz8gbnVsbCxcblx0XHRcdFx0aW52b2ljZV9pZDogcGFyYW1zLmludm9pY2VJZCA/PyBudWxsLFxuXHRcdFx0XHRlc3RpbWF0ZV9pZDogcGFyYW1zLmVzdGltYXRlSWQgPz8gbnVsbCxcblx0XHRcdFx0dHlwZTogXCJzbXNcIixcblx0XHRcdFx0Y2hhbm5lbDogXCJ0ZWxueXhcIixcblx0XHRcdFx0ZGlyZWN0aW9uOiBcIm91dGJvdW5kXCIsXG5cdFx0XHRcdGZyb21fYWRkcmVzczogZnJvbUFkZHJlc3MsXG5cdFx0XHRcdHRvX2FkZHJlc3M6IHRvQWRkcmVzcyxcblx0XHRcdFx0Ym9keTogcGFyYW1zLnRleHQgfHwgXCJcIixcblx0XHRcdFx0YXR0YWNobWVudHM6IHBhcmFtcy5tZWRpYVVybHMubWFwKCh1cmwpID0+ICh7IHVybCwgdHlwZTogXCJpbWFnZVwiIH0pKSxcblx0XHRcdFx0YXR0YWNobWVudF9jb3VudDogcGFyYW1zLm1lZGlhVXJscy5sZW5ndGgsXG5cdFx0XHRcdHN0YXR1czogXCJxdWV1ZWRcIixcblx0XHRcdFx0cHJpb3JpdHk6IFwibm9ybWFsXCIsXG5cdFx0XHRcdHBob25lX251bWJlcl9pZDogcGhvbmVOdW1iZXJJZCxcblx0XHRcdFx0aXNfYXJjaGl2ZWQ6IGZhbHNlLFxuXHRcdFx0XHRpc19hdXRvbWF0ZWQ6IGZhbHNlLFxuXHRcdFx0XHRpc19pbnRlcm5hbDogZmFsc2UsXG5cdFx0XHRcdGlzX3RocmVhZF9zdGFydGVyOiB0cnVlLFxuXHRcdFx0XHR0ZWxueXhfbWVzc2FnZV9pZDogcmVzdWx0Lm1lc3NhZ2VJZCxcblx0XHRcdH0pXG5cdFx0XHQuc2VsZWN0KClcblx0XHRcdC5zaW5nbGUoKTtcblxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXG5cdFx0cmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL2NvbW11bmljYXRpb25cIik7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogdHJ1ZSxcblx0XHRcdG1lc3NhZ2VJZDogcmVzdWx0Lm1lc3NhZ2VJZCxcblx0XHRcdGRhdGEsXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBcIkZhaWxlZCB0byBzZW5kIE1NU1wiLFxuXHRcdH07XG5cdH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gV0VCUlRDIE9QRVJBVElPTlMgQUNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIEdlbmVyYXRlIFdlYlJUQyBjcmVkZW50aWFscyBmb3IgYnJvd3NlciBjYWxsaW5nXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRXZWJSVENDcmVkZW50aWFscygpIHtcblx0dHJ5IHtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHQvLyBHZXQgY3VycmVudCB1c2VyXG5cdFx0Y29uc3Qge1xuXHRcdFx0ZGF0YTogeyB1c2VyIH0sXG5cdFx0XHRlcnJvcjogdXNlckVycm9yLFxuXHRcdH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKTtcblx0XHRpZiAodXNlckVycm9yIHx8ICF1c2VyKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6IFwiVXNlciBub3QgYXV0aGVudGljYXRlZFwiLFxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHQvLyBPUFRJT04gMTogVXNlIHN0YXRpYyBjcmVkZW50aWFscyBmcm9tIGVudmlyb25tZW50IChyZWNvbW1lbmRlZCBmb3IgcHJvZHVjdGlvbilcblx0XHRjb25zdCBzdGF0aWNVc2VybmFtZSA9IHByb2Nlc3MuZW52LlRFTE5ZWF9XRUJSVENfVVNFUk5BTUU7XG5cdFx0Y29uc3Qgc3RhdGljUGFzc3dvcmQgPSBwcm9jZXNzLmVudi5URUxOWVhfV0VCUlRDX1BBU1NXT1JEO1xuXG5cdFx0aWYgKHN0YXRpY1VzZXJuYW1lICYmIHN0YXRpY1Bhc3N3b3JkKSB7XG5cdFx0XHRjb25zdCBjcmVkZW50aWFsID0ge1xuXHRcdFx0XHR1c2VybmFtZTogc3RhdGljVXNlcm5hbWUsXG5cdFx0XHRcdHBhc3N3b3JkOiBzdGF0aWNQYXNzd29yZCxcblx0XHRcdFx0ZXhwaXJlc19hdDogRGF0ZS5ub3coKSArIDg2XzQwMCAqIDEwMDAsIC8vIDI0IGhvdXJzIGZyb20gbm93XG5cdFx0XHRcdHJlYWxtOiBcInNpcC50ZWxueXguY29tXCIsXG5cdFx0XHRcdHNpcF91cmk6IGBzaXA6JHtzdGF0aWNVc2VybmFtZX1Ac2lwLnRlbG55eC5jb21gLFxuXHRcdFx0XHRzdHVuX3NlcnZlcnM6IFtcblx0XHRcdFx0XHRcInN0dW46c3R1bi50ZWxueXguY29tOjM0NzhcIixcblx0XHRcdFx0XHRcInN0dW46c3R1bi50ZWxueXguY29tOjM0NzlcIixcblx0XHRcdFx0XSxcblx0XHRcdFx0dHVybl9zZXJ2ZXJzOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dXJsczogW1xuXHRcdFx0XHRcdFx0XHRcInR1cm46dHVybi50ZWxueXguY29tOjM0Nzg/dHJhbnNwb3J0PXVkcFwiLFxuXHRcdFx0XHRcdFx0XHRcInR1cm46dHVybi50ZWxueXguY29tOjM0Nzg/dHJhbnNwb3J0PXRjcFwiLFxuXHRcdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRcdHVzZXJuYW1lOiBzdGF0aWNVc2VybmFtZSxcblx0XHRcdFx0XHRcdGNyZWRlbnRpYWw6IHN0YXRpY1Bhc3N3b3JkLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdF0sXG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0XHRjcmVkZW50aWFsLFxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRjb25zdCB7IGdlbmVyYXRlV2ViUlRDVG9rZW4gfSA9IGF3YWl0IGltcG9ydChcIkAvbGliL3RlbG55eC93ZWJydGNcIik7XG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgZ2VuZXJhdGVXZWJSVENUb2tlbih7XG5cdFx0XHR1c2VybmFtZTogdXNlci5lbWFpbCB8fCB1c2VyLmlkLFxuXHRcdFx0dHRsOiA4Nl80MDAsIC8vIDI0IGhvdXJzXG5cdFx0fSk7XG5cblx0XHRpZiAoIXJlc3VsdC5zdWNjZXNzKSB7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0Y3JlZGVudGlhbDogcmVzdWx0LmNyZWRlbnRpYWwsXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRlcnJvcjpcblx0XHRcdFx0ZXJyb3IgaW5zdGFuY2VvZiBFcnJvclxuXHRcdFx0XHRcdD8gZXJyb3IubWVzc2FnZVxuXHRcdFx0XHRcdDogXCJGYWlsZWQgdG8gZ2V0IFdlYlJUQyBjcmVkZW50aWFsc1wiLFxuXHRcdH07XG5cdH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVk9JQ0VNQUlMIE9QRVJBVElPTlMgQUNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIEdldCBhbGwgdm9pY2VtYWlscyBmb3IgYSBjb21wYW55XG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGdldFZvaWNlbWFpbHMoY29tcGFueUlkOiBzdHJpbmcpIHtcblx0dHJ5IHtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHRjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJ2b2ljZW1haWxzXCIpXG5cdFx0XHQuc2VsZWN0KFxuXHRcdFx0XHRgXG4gICAgICAgICosXG4gICAgICAgIGN1c3RvbWVyOmN1c3RvbWVycyhpZCwgZmlyc3RfbmFtZSwgbGFzdF9uYW1lLCBlbWFpbCwgcGhvbmUpLFxuICAgICAgICBwaG9uZV9udW1iZXI6cGhvbmVfbnVtYmVycyhwaG9uZV9udW1iZXIsIGZvcm1hdHRlZF9udW1iZXIpXG4gICAgICBgLFxuXHRcdFx0KVxuXHRcdFx0LmVxKFwiY29tcGFueV9pZFwiLCBjb21wYW55SWQpXG5cdFx0XHQuaXMoXCJkZWxldGVkX2F0XCIsIG51bGwpXG5cdFx0XHQub3JkZXIoXCJyZWNlaXZlZF9hdFwiLCB7IGFzY2VuZGluZzogZmFsc2UgfSk7XG5cblx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0ZGF0YTogZGF0YSB8fCBbXSxcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdGVycm9yOlxuXHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFwiRmFpbGVkIHRvIGdldCB2b2ljZW1haWxzXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIE1hcmsgdm9pY2VtYWlsIGFzIHJlYWRcbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWFya1ZvaWNlbWFpbEFzUmVhZCh2b2ljZW1haWxJZDogc3RyaW5nLCB1c2VySWQ6IHN0cmluZykge1xuXHR0cnkge1xuXHRcdGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KCk7XG5cdFx0aWYgKCFzdXBhYmFzZSkge1xuXHRcdFx0cmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIlNlcnZpY2UgdW5hdmFpbGFibGVcIiB9O1xuXHRcdH1cblxuXHRcdGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcInZvaWNlbWFpbHNcIilcblx0XHRcdC51cGRhdGUoe1xuXHRcdFx0XHRpc19yZWFkOiB0cnVlLFxuXHRcdFx0XHRyZWFkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG5cdFx0XHRcdHJlYWRfYnk6IHVzZXJJZCxcblx0XHRcdH0pXG5cdFx0XHQuZXEoXCJpZFwiLCB2b2ljZW1haWxJZClcblx0XHRcdC5zZWxlY3QoKVxuXHRcdFx0LnNpbmdsZSgpO1xuXG5cdFx0aWYgKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cblx0XHRyZXZhbGlkYXRlUGF0aChcIi9kYXNoYm9hcmQvY29tbXVuaWNhdGlvblwiKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0ZGF0YSxcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdGVycm9yOlxuXHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yXG5cdFx0XHRcdFx0PyBlcnJvci5tZXNzYWdlXG5cdFx0XHRcdFx0OiBcIkZhaWxlZCB0byBtYXJrIHZvaWNlbWFpbCBhcyByZWFkXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIERlbGV0ZSB2b2ljZW1haWxcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZGVsZXRlVm9pY2VtYWlsKHZvaWNlbWFpbElkOiBzdHJpbmcsIHVzZXJJZDogc3RyaW5nKSB7XG5cdHRyeSB7XG5cdFx0Y29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcblx0XHRpZiAoIXN1cGFiYXNlKSB7XG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiU2VydmljZSB1bmF2YWlsYWJsZVwiIH07XG5cdFx0fVxuXG5cdFx0Y29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwidm9pY2VtYWlsc1wiKVxuXHRcdFx0LnVwZGF0ZSh7XG5cdFx0XHRcdGRlbGV0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcblx0XHRcdFx0ZGVsZXRlZF9ieTogdXNlcklkLFxuXHRcdFx0fSlcblx0XHRcdC5lcShcImlkXCIsIHZvaWNlbWFpbElkKTtcblxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXG5cdFx0cmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL2NvbW11bmljYXRpb25cIik7XG5cblx0XHRyZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJGYWlsZWQgdG8gZGVsZXRlIHZvaWNlbWFpbFwiLFxuXHRcdH07XG5cdH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQ0FMTCBST1VUSU5HIFJVTEVTIEFDVElPTlNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLyoqXG4gKiBHZXQgYWxsIGNhbGwgcm91dGluZyBydWxlcyBmb3IgYSBjb21wYW55XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDYWxsUm91dGluZ1J1bGVzKGNvbXBhbnlJZDogc3RyaW5nKSB7XG5cdHRyeSB7XG5cdFx0Y29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcblx0XHRpZiAoIXN1cGFiYXNlKSB7XG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiU2VydmljZSB1bmF2YWlsYWJsZVwiIH07XG5cdFx0fVxuXG5cdFx0Y29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwiY2FsbF9yb3V0aW5nX3J1bGVzXCIpXG5cdFx0XHQuc2VsZWN0KFxuXHRcdFx0XHRgXG4gICAgICAgICosXG4gICAgICAgIGNyZWF0ZWRfYnlfdXNlcjp1c2VycyFjYWxsX3JvdXRpbmdfcnVsZXNfY3JlYXRlZF9ieV9ma2V5KGlkLCBuYW1lLCBlbWFpbCksXG4gICAgICAgIGZvcndhcmRfdG9fdXNlcjp1c2VycyFjYWxsX3JvdXRpbmdfcnVsZXNfZm9yd2FyZF90b191c2VyX2lkX2ZrZXkoaWQsIG5hbWUsIGVtYWlsKVxuICAgICAgYCxcblx0XHRcdClcblx0XHRcdC5lcShcImNvbXBhbnlfaWRcIiwgY29tcGFueUlkKVxuXHRcdFx0LmlzKFwiZGVsZXRlZF9hdFwiLCBudWxsKVxuXHRcdFx0Lm9yZGVyKFwicHJpb3JpdHlcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pO1xuXG5cdFx0aWYgKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogdHJ1ZSxcblx0XHRcdGRhdGE6IGRhdGEgfHwgW10sXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRlcnJvcjpcblx0XHRcdFx0ZXJyb3IgaW5zdGFuY2VvZiBFcnJvclxuXHRcdFx0XHRcdD8gZXJyb3IubWVzc2FnZVxuXHRcdFx0XHRcdDogXCJGYWlsZWQgdG8gZ2V0IGNhbGwgcm91dGluZyBydWxlc1wiLFxuXHRcdH07XG5cdH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgY2FsbCByb3V0aW5nIHJ1bGVcbiAqL1xuYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ2FsbFJvdXRpbmdSdWxlKHBhcmFtczoge1xuXHRjb21wYW55SWQ6IHN0cmluZztcblx0dXNlcklkOiBzdHJpbmc7XG5cdG5hbWU6IHN0cmluZztcblx0ZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cdHJvdXRpbmdUeXBlOlxuXHRcdHwgXCJkaXJlY3RcIlxuXHRcdHwgXCJyb3VuZF9yb2JpblwiXG5cdFx0fCBcIml2clwiXG5cdFx0fCBcImJ1c2luZXNzX2hvdXJzXCJcblx0XHR8IFwiY29uZGl0aW9uYWxcIjtcblx0cHJpb3JpdHk/OiBudW1iZXI7XG5cdGJ1c2luZXNzSG91cnM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcblx0dGltZXpvbmU/OiBzdHJpbmc7XG5cdGFmdGVySG91cnNBY3Rpb24/OiBcInZvaWNlbWFpbFwiIHwgXCJmb3J3YXJkXCIgfCBcImhhbmd1cFwiO1xuXHRhZnRlckhvdXJzRm9yd2FyZFRvPzogc3RyaW5nO1xuXHR0ZWFtTWVtYmVycz86IHN0cmluZ1tdO1xuXHRyaW5nVGltZW91dD86IG51bWJlcjtcblx0aXZyTWVudT86IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuXHRpdnJHcmVldGluZ1VybD86IHN0cmluZztcblx0Zm9yd2FyZFRvTnVtYmVyPzogc3RyaW5nO1xuXHRmb3J3YXJkVG9Vc2VySWQ/OiBzdHJpbmc7XG5cdGVuYWJsZVZvaWNlbWFpbD86IGJvb2xlYW47XG5cdHZvaWNlbWFpbEdyZWV0aW5nVXJsPzogc3RyaW5nO1xuXHR2b2ljZW1haWxUcmFuc2NyaXB0aW9uRW5hYmxlZD86IGJvb2xlYW47XG5cdHZvaWNlbWFpbEVtYWlsTm90aWZpY2F0aW9ucz86IGJvb2xlYW47XG5cdHJlY29yZENhbGxzPzogYm9vbGVhbjtcbn0pIHtcblx0dHJ5IHtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHRjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJjYWxsX3JvdXRpbmdfcnVsZXNcIilcblx0XHRcdC5pbnNlcnQoe1xuXHRcdFx0XHRjb21wYW55X2lkOiBwYXJhbXMuY29tcGFueUlkLFxuXHRcdFx0XHRjcmVhdGVkX2J5OiBwYXJhbXMudXNlcklkLFxuXHRcdFx0XHRuYW1lOiBwYXJhbXMubmFtZSxcblx0XHRcdFx0ZGVzY3JpcHRpb246IHBhcmFtcy5kZXNjcmlwdGlvbixcblx0XHRcdFx0cm91dGluZ190eXBlOiBwYXJhbXMucm91dGluZ1R5cGUsXG5cdFx0XHRcdHByaW9yaXR5OiBwYXJhbXMucHJpb3JpdHkgfHwgMCxcblx0XHRcdFx0YnVzaW5lc3NfaG91cnM6IHBhcmFtcy5idXNpbmVzc0hvdXJzLFxuXHRcdFx0XHR0aW1lem9uZTogcGFyYW1zLnRpbWV6b25lIHx8IFwiQW1lcmljYS9Mb3NfQW5nZWxlc1wiLFxuXHRcdFx0XHRhZnRlcl9ob3Vyc19hY3Rpb246IHBhcmFtcy5hZnRlckhvdXJzQWN0aW9uLFxuXHRcdFx0XHRhZnRlcl9ob3Vyc19mb3J3YXJkX3RvOiBwYXJhbXMuYWZ0ZXJIb3Vyc0ZvcndhcmRUbyxcblx0XHRcdFx0dGVhbV9tZW1iZXJzOiBwYXJhbXMudGVhbU1lbWJlcnMsXG5cdFx0XHRcdHJpbmdfdGltZW91dDogcGFyYW1zLnJpbmdUaW1lb3V0IHx8IDIwLFxuXHRcdFx0XHRpdnJfbWVudTogcGFyYW1zLml2ck1lbnUsXG5cdFx0XHRcdGl2cl9ncmVldGluZ191cmw6IHBhcmFtcy5pdnJHcmVldGluZ1VybCxcblx0XHRcdFx0Zm9yd2FyZF90b19udW1iZXI6IHBhcmFtcy5mb3J3YXJkVG9OdW1iZXIsXG5cdFx0XHRcdGZvcndhcmRfdG9fdXNlcl9pZDogcGFyYW1zLmZvcndhcmRUb1VzZXJJZCxcblx0XHRcdFx0ZW5hYmxlX3ZvaWNlbWFpbDogcGFyYW1zLmVuYWJsZVZvaWNlbWFpbCAhPT0gZmFsc2UsXG5cdFx0XHRcdHZvaWNlbWFpbF9ncmVldGluZ191cmw6IHBhcmFtcy52b2ljZW1haWxHcmVldGluZ1VybCxcblx0XHRcdFx0dm9pY2VtYWlsX3RyYW5zY3JpcHRpb25fZW5hYmxlZDpcblx0XHRcdFx0XHRwYXJhbXMudm9pY2VtYWlsVHJhbnNjcmlwdGlvbkVuYWJsZWQgIT09IGZhbHNlLFxuXHRcdFx0XHR2b2ljZW1haWxfZW1haWxfbm90aWZpY2F0aW9uczpcblx0XHRcdFx0XHRwYXJhbXMudm9pY2VtYWlsRW1haWxOb3RpZmljYXRpb25zICE9PSBmYWxzZSxcblx0XHRcdFx0cmVjb3JkX2NhbGxzOiBwYXJhbXMucmVjb3JkQ2FsbHMsXG5cdFx0XHRcdGlzX2FjdGl2ZTogdHJ1ZSxcblx0XHRcdH0pXG5cdFx0XHQuc2VsZWN0KClcblx0XHRcdC5zaW5nbGUoKTtcblxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXG5cdFx0cmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL3NldHRpbmdzL2NvbW11bmljYXRpb25zL2NhbGwtcm91dGluZ1wiKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0ZGF0YSxcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdGVycm9yOlxuXHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yXG5cdFx0XHRcdFx0PyBlcnJvci5tZXNzYWdlXG5cdFx0XHRcdFx0OiBcIkZhaWxlZCB0byBjcmVhdGUgY2FsbCByb3V0aW5nIHJ1bGVcIixcblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogVXBkYXRlIGFuIGV4aXN0aW5nIGNhbGwgcm91dGluZyBydWxlXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVDYWxsUm91dGluZ1J1bGUocGFyYW1zOiB7XG5cdHJ1bGVJZDogc3RyaW5nO1xuXHRuYW1lPzogc3RyaW5nO1xuXHRkZXNjcmlwdGlvbj86IHN0cmluZztcblx0cHJpb3JpdHk/OiBudW1iZXI7XG5cdGJ1c2luZXNzSG91cnM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcblx0dGltZXpvbmU/OiBzdHJpbmc7XG5cdGFmdGVySG91cnNBY3Rpb24/OiBcInZvaWNlbWFpbFwiIHwgXCJmb3J3YXJkXCIgfCBcImhhbmd1cFwiO1xuXHRhZnRlckhvdXJzRm9yd2FyZFRvPzogc3RyaW5nO1xuXHR0ZWFtTWVtYmVycz86IHN0cmluZ1tdO1xuXHRyaW5nVGltZW91dD86IG51bWJlcjtcblx0aXZyTWVudT86IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuXHRpdnJHcmVldGluZ1VybD86IHN0cmluZztcblx0Zm9yd2FyZFRvTnVtYmVyPzogc3RyaW5nO1xuXHRmb3J3YXJkVG9Vc2VySWQ/OiBzdHJpbmc7XG5cdGVuYWJsZVZvaWNlbWFpbD86IGJvb2xlYW47XG5cdHZvaWNlbWFpbEdyZWV0aW5nVXJsPzogc3RyaW5nO1xuXHR2b2ljZW1haWxUcmFuc2NyaXB0aW9uRW5hYmxlZD86IGJvb2xlYW47XG5cdHZvaWNlbWFpbEVtYWlsTm90aWZpY2F0aW9ucz86IGJvb2xlYW47XG5cdHJlY29yZENhbGxzPzogYm9vbGVhbjtcblx0aXNBY3RpdmU/OiBib29sZWFuO1xufSkge1xuXHR0cnkge1xuXHRcdGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KCk7XG5cdFx0aWYgKCFzdXBhYmFzZSkge1xuXHRcdFx0cmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIlNlcnZpY2UgdW5hdmFpbGFibGVcIiB9O1xuXHRcdH1cblxuXHRcdGNvbnN0IHVwZGF0ZURhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG5cblx0XHRpZiAocGFyYW1zLm5hbWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dXBkYXRlRGF0YS5uYW1lID0gcGFyYW1zLm5hbWU7XG5cdFx0fVxuXHRcdGlmIChwYXJhbXMuZGVzY3JpcHRpb24gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dXBkYXRlRGF0YS5kZXNjcmlwdGlvbiA9IHBhcmFtcy5kZXNjcmlwdGlvbjtcblx0XHR9XG5cdFx0aWYgKHBhcmFtcy5wcmlvcml0eSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR1cGRhdGVEYXRhLnByaW9yaXR5ID0gcGFyYW1zLnByaW9yaXR5O1xuXHRcdH1cblx0XHRpZiAocGFyYW1zLmJ1c2luZXNzSG91cnMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dXBkYXRlRGF0YS5idXNpbmVzc19ob3VycyA9IHBhcmFtcy5idXNpbmVzc0hvdXJzO1xuXHRcdH1cblx0XHRpZiAocGFyYW1zLnRpbWV6b25lICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHVwZGF0ZURhdGEudGltZXpvbmUgPSBwYXJhbXMudGltZXpvbmU7XG5cdFx0fVxuXHRcdGlmIChwYXJhbXMuYWZ0ZXJIb3Vyc0FjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR1cGRhdGVEYXRhLmFmdGVyX2hvdXJzX2FjdGlvbiA9IHBhcmFtcy5hZnRlckhvdXJzQWN0aW9uO1xuXHRcdH1cblx0XHRpZiAocGFyYW1zLmFmdGVySG91cnNGb3J3YXJkVG8gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dXBkYXRlRGF0YS5hZnRlcl9ob3Vyc19mb3J3YXJkX3RvID0gcGFyYW1zLmFmdGVySG91cnNGb3J3YXJkVG87XG5cdFx0fVxuXHRcdGlmIChwYXJhbXMudGVhbU1lbWJlcnMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dXBkYXRlRGF0YS50ZWFtX21lbWJlcnMgPSBwYXJhbXMudGVhbU1lbWJlcnM7XG5cdFx0fVxuXHRcdGlmIChwYXJhbXMucmluZ1RpbWVvdXQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dXBkYXRlRGF0YS5yaW5nX3RpbWVvdXQgPSBwYXJhbXMucmluZ1RpbWVvdXQ7XG5cdFx0fVxuXHRcdGlmIChwYXJhbXMuaXZyTWVudSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR1cGRhdGVEYXRhLml2cl9tZW51ID0gcGFyYW1zLml2ck1lbnU7XG5cdFx0fVxuXHRcdGlmIChwYXJhbXMuaXZyR3JlZXRpbmdVcmwgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dXBkYXRlRGF0YS5pdnJfZ3JlZXRpbmdfdXJsID0gcGFyYW1zLml2ckdyZWV0aW5nVXJsO1xuXHRcdH1cblx0XHRpZiAocGFyYW1zLmZvcndhcmRUb051bWJlciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR1cGRhdGVEYXRhLmZvcndhcmRfdG9fbnVtYmVyID0gcGFyYW1zLmZvcndhcmRUb051bWJlcjtcblx0XHR9XG5cdFx0aWYgKHBhcmFtcy5mb3J3YXJkVG9Vc2VySWQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dXBkYXRlRGF0YS5mb3J3YXJkX3RvX3VzZXJfaWQgPSBwYXJhbXMuZm9yd2FyZFRvVXNlcklkO1xuXHRcdH1cblx0XHRpZiAocGFyYW1zLmVuYWJsZVZvaWNlbWFpbCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR1cGRhdGVEYXRhLmVuYWJsZV92b2ljZW1haWwgPSBwYXJhbXMuZW5hYmxlVm9pY2VtYWlsO1xuXHRcdH1cblx0XHRpZiAocGFyYW1zLnZvaWNlbWFpbEdyZWV0aW5nVXJsICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHVwZGF0ZURhdGEudm9pY2VtYWlsX2dyZWV0aW5nX3VybCA9IHBhcmFtcy52b2ljZW1haWxHcmVldGluZ1VybDtcblx0XHR9XG5cdFx0aWYgKHBhcmFtcy52b2ljZW1haWxUcmFuc2NyaXB0aW9uRW5hYmxlZCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR1cGRhdGVEYXRhLnZvaWNlbWFpbF90cmFuc2NyaXB0aW9uX2VuYWJsZWQgPVxuXHRcdFx0XHRwYXJhbXMudm9pY2VtYWlsVHJhbnNjcmlwdGlvbkVuYWJsZWQ7XG5cdFx0fVxuXHRcdGlmIChwYXJhbXMudm9pY2VtYWlsRW1haWxOb3RpZmljYXRpb25zICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHVwZGF0ZURhdGEudm9pY2VtYWlsX2VtYWlsX25vdGlmaWNhdGlvbnMgPVxuXHRcdFx0XHRwYXJhbXMudm9pY2VtYWlsRW1haWxOb3RpZmljYXRpb25zO1xuXHRcdH1cblx0XHRpZiAocGFyYW1zLnJlY29yZENhbGxzICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHVwZGF0ZURhdGEucmVjb3JkX2NhbGxzID0gcGFyYW1zLnJlY29yZENhbGxzO1xuXHRcdH1cblx0XHRpZiAocGFyYW1zLmlzQWN0aXZlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHVwZGF0ZURhdGEuaXNfYWN0aXZlID0gcGFyYW1zLmlzQWN0aXZlO1xuXHRcdH1cblxuXHRcdGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImNhbGxfcm91dGluZ19ydWxlc1wiKVxuXHRcdFx0LnVwZGF0ZSh1cGRhdGVEYXRhKVxuXHRcdFx0LmVxKFwiaWRcIiwgcGFyYW1zLnJ1bGVJZClcblx0XHRcdC5zZWxlY3QoKVxuXHRcdFx0LnNpbmdsZSgpO1xuXG5cdFx0aWYgKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cblx0XHRyZXZhbGlkYXRlUGF0aChcIi9kYXNoYm9hcmQvc2V0dGluZ3MvY29tbXVuaWNhdGlvbnMvY2FsbC1yb3V0aW5nXCIpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IHRydWUsXG5cdFx0XHRkYXRhLFxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3Jcblx0XHRcdFx0XHQ/IGVycm9yLm1lc3NhZ2Vcblx0XHRcdFx0XHQ6IFwiRmFpbGVkIHRvIHVwZGF0ZSBjYWxsIHJvdXRpbmcgcnVsZVwiLFxuXHRcdH07XG5cdH1cbn1cblxuLyoqXG4gKiBEZWxldGUgYSBjYWxsIHJvdXRpbmcgcnVsZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlQ2FsbFJvdXRpbmdSdWxlKHJ1bGVJZDogc3RyaW5nLCB1c2VySWQ6IHN0cmluZykge1xuXHR0cnkge1xuXHRcdGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KCk7XG5cdFx0aWYgKCFzdXBhYmFzZSkge1xuXHRcdFx0cmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIlNlcnZpY2UgdW5hdmFpbGFibGVcIiB9O1xuXHRcdH1cblxuXHRcdGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImNhbGxfcm91dGluZ19ydWxlc1wiKVxuXHRcdFx0LnVwZGF0ZSh7XG5cdFx0XHRcdGRlbGV0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcblx0XHRcdFx0ZGVsZXRlZF9ieTogdXNlcklkLFxuXHRcdFx0fSlcblx0XHRcdC5lcShcImlkXCIsIHJ1bGVJZCk7XG5cblx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblxuXHRcdHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9zZXR0aW5ncy9jb21tdW5pY2F0aW9ucy9jYWxsLXJvdXRpbmdcIik7XG5cblx0XHRyZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3Jcblx0XHRcdFx0XHQ/IGVycm9yLm1lc3NhZ2Vcblx0XHRcdFx0XHQ6IFwiRmFpbGVkIHRvIGRlbGV0ZSBjYWxsIHJvdXRpbmcgcnVsZVwiLFxuXHRcdH07XG5cdH1cbn1cblxuLyoqXG4gKiBUb2dnbGUgY2FsbCByb3V0aW5nIHJ1bGUgYWN0aXZlIHN0YXR1c1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdG9nZ2xlQ2FsbFJvdXRpbmdSdWxlKHJ1bGVJZDogc3RyaW5nLCBpc0FjdGl2ZTogYm9vbGVhbikge1xuXHR0cnkge1xuXHRcdGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KCk7XG5cdFx0aWYgKCFzdXBhYmFzZSkge1xuXHRcdFx0cmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIlNlcnZpY2UgdW5hdmFpbGFibGVcIiB9O1xuXHRcdH1cblxuXHRcdGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImNhbGxfcm91dGluZ19ydWxlc1wiKVxuXHRcdFx0LnVwZGF0ZSh7IGlzX2FjdGl2ZTogaXNBY3RpdmUgfSlcblx0XHRcdC5lcShcImlkXCIsIHJ1bGVJZClcblx0XHRcdC5zZWxlY3QoKVxuXHRcdFx0LnNpbmdsZSgpO1xuXG5cdFx0aWYgKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cblx0XHRyZXZhbGlkYXRlUGF0aChcIi9kYXNoYm9hcmQvc2V0dGluZ3MvY29tbXVuaWNhdGlvbnMvY2FsbC1yb3V0aW5nXCIpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IHRydWUsXG5cdFx0XHRkYXRhLFxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3Jcblx0XHRcdFx0XHQ/IGVycm9yLm1lc3NhZ2Vcblx0XHRcdFx0XHQ6IFwiRmFpbGVkIHRvIHRvZ2dsZSBjYWxsIHJvdXRpbmcgcnVsZVwiLFxuXHRcdH07XG5cdH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gUEhPTkUgTlVNQkVSIFVTQUdFIFNUQVRJU1RJQ1MgQUNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIEdldCB1c2FnZSBzdGF0aXN0aWNzIGZvciBhIHBob25lIG51bWJlclxuICovXG5hc3luYyBmdW5jdGlvbiBnZXRQaG9uZU51bWJlclVzYWdlU3RhdHMoXG5cdHBob25lTnVtYmVySWQ6IHN0cmluZyxcblx0ZGF5cyA9IDMwLFxuKSB7XG5cdHRyeSB7XG5cdFx0Y29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcblx0XHRpZiAoIXN1cGFiYXNlKSB7XG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiU2VydmljZSB1bmF2YWlsYWJsZVwiIH07XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc3RhcnREYXRlID0gbmV3IERhdGUoKTtcblx0XHRzdGFydERhdGUuc2V0RGF0ZShzdGFydERhdGUuZ2V0RGF0ZSgpIC0gZGF5cyk7XG5cblx0XHQvLyBHZXQgY2FsbCBzdGF0aXN0aWNzXG5cdFx0Y29uc3QgeyBkYXRhOiBjYWxsU3RhdHMsIGVycm9yOiBjYWxsRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImNvbW11bmljYXRpb25zXCIpXG5cdFx0XHQuc2VsZWN0KFwidHlwZSwgZGlyZWN0aW9uLCBzdGF0dXMsIGNhbGxfZHVyYXRpb24sIGNyZWF0ZWRfYXRcIilcblx0XHRcdC5lcShcInR5cGVcIiwgXCJwaG9uZVwiKVxuXHRcdFx0LmVxKFwicGhvbmVfbnVtYmVyX2lkXCIsIHBob25lTnVtYmVySWQpXG5cdFx0XHQuZ3RlKFwiY3JlYXRlZF9hdFwiLCBzdGFydERhdGUudG9JU09TdHJpbmcoKSk7XG5cblx0XHRpZiAoY2FsbEVycm9yKSB7XG5cdFx0XHR0aHJvdyBjYWxsRXJyb3I7XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IFNNUyBzdGF0aXN0aWNzXG5cdFx0Y29uc3QgeyBkYXRhOiBzbXNTdGF0cywgZXJyb3I6IHNtc0Vycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJjb21tdW5pY2F0aW9uc1wiKVxuXHRcdFx0LnNlbGVjdChcInR5cGUsIGRpcmVjdGlvbiwgc3RhdHVzLCBjcmVhdGVkX2F0XCIpXG5cdFx0XHQuZXEoXCJ0eXBlXCIsIFwic21zXCIpXG5cdFx0XHQuZXEoXCJwaG9uZV9udW1iZXJfaWRcIiwgcGhvbmVOdW1iZXJJZClcblx0XHRcdC5ndGUoXCJjcmVhdGVkX2F0XCIsIHN0YXJ0RGF0ZS50b0lTT1N0cmluZygpKTtcblxuXHRcdGlmIChzbXNFcnJvcikge1xuXHRcdFx0dGhyb3cgc21zRXJyb3I7XG5cdFx0fVxuXG5cdFx0Ly8gQ2FsY3VsYXRlIGFnZ3JlZ2F0ZXNcblx0XHRjb25zdCBjYWxscyA9IGNhbGxTdGF0cyB8fCBbXTtcblx0XHRjb25zdCBzbXMgPSBzbXNTdGF0cyB8fCBbXTtcblxuXHRcdGNvbnN0IGluY29taW5nQ2FsbHMgPSBjYWxscy5maWx0ZXIoKGMpID0+IGMuZGlyZWN0aW9uID09PSBcImluYm91bmRcIikubGVuZ3RoO1xuXHRcdGNvbnN0IG91dGdvaW5nQ2FsbHMgPSBjYWxscy5maWx0ZXIoXG5cdFx0XHQoYykgPT4gYy5kaXJlY3Rpb24gPT09IFwib3V0Ym91bmRcIixcblx0XHQpLmxlbmd0aDtcblx0XHRjb25zdCB0b3RhbENhbGxEdXJhdGlvbiA9IGNhbGxzLnJlZHVjZShcblx0XHRcdChzdW0sIGMpID0+IHN1bSArIChjLmNhbGxfZHVyYXRpb24gfHwgMCksXG5cdFx0XHQwLFxuXHRcdCk7XG5cdFx0Y29uc3QgaW5jb21pbmdTbXMgPSBzbXMuZmlsdGVyKChzKSA9PiBzLmRpcmVjdGlvbiA9PT0gXCJpbmJvdW5kXCIpLmxlbmd0aDtcblx0XHRjb25zdCBvdXRnb2luZ1NtcyA9IHNtcy5maWx0ZXIoKHMpID0+IHMuZGlyZWN0aW9uID09PSBcIm91dGJvdW5kXCIpLmxlbmd0aDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRpbmNvbWluZ0NhbGxzLFxuXHRcdFx0XHRvdXRnb2luZ0NhbGxzLFxuXHRcdFx0XHR0b3RhbENhbGxzOiBpbmNvbWluZ0NhbGxzICsgb3V0Z29pbmdDYWxscyxcblx0XHRcdFx0dG90YWxDYWxsRHVyYXRpb24sXG5cdFx0XHRcdGluY29taW5nU21zLFxuXHRcdFx0XHRvdXRnb2luZ1Ntcyxcblx0XHRcdFx0dG90YWxTbXM6IGluY29taW5nU21zICsgb3V0Z29pbmdTbXMsXG5cdFx0XHRcdGRhaWx5U3RhdHM6IGFnZ3JlZ2F0ZURhaWx5U3RhdHMoWy4uLmNhbGxzLCAuLi5zbXNdLCBkYXlzKSxcblx0XHRcdH0sXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRlcnJvcjpcblx0XHRcdFx0ZXJyb3IgaW5zdGFuY2VvZiBFcnJvclxuXHRcdFx0XHRcdD8gZXJyb3IubWVzc2FnZVxuXHRcdFx0XHRcdDogXCJGYWlsZWQgdG8gZ2V0IHVzYWdlIHN0YXRpc3RpY3NcIixcblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogR2V0IGNvbXBhbnktd2lkZSB1c2FnZSBzdGF0aXN0aWNzXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGdldENvbXBhbnlVc2FnZVN0YXRzKGNvbXBhbnlJZDogc3RyaW5nLCBkYXlzID0gMzApIHtcblx0dHJ5IHtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHRjb25zdCBzdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuXHRcdHN0YXJ0RGF0ZS5zZXREYXRlKHN0YXJ0RGF0ZS5nZXREYXRlKCkgLSBkYXlzKTtcblxuXHRcdC8vIEdldCBhbGwgY29tbXVuaWNhdGlvbnMgZm9yIHRoZSBjb21wYW55XG5cdFx0Y29uc3QgeyBkYXRhOiBjb21tdW5pY2F0aW9ucywgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImNvbW11bmljYXRpb25zXCIpXG5cdFx0XHQuc2VsZWN0KFwidHlwZSwgZGlyZWN0aW9uLCBzdGF0dXMsIGNhbGxfZHVyYXRpb24sIGNyZWF0ZWRfYXRcIilcblx0XHRcdC5lcShcImNvbXBhbnlfaWRcIiwgY29tcGFueUlkKVxuXHRcdFx0LmluKFwidHlwZVwiLCBbXCJwaG9uZVwiLCBcInNtc1wiXSlcblx0XHRcdC5ndGUoXCJjcmVhdGVkX2F0XCIsIHN0YXJ0RGF0ZS50b0lTT1N0cmluZygpKTtcblxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXRlbXMgPSBjb21tdW5pY2F0aW9ucyB8fCBbXTtcblx0XHRjb25zdCBjYWxscyA9IGl0ZW1zLmZpbHRlcigoaSkgPT4gaS50eXBlID09PSBcInBob25lXCIpO1xuXHRcdGNvbnN0IHNtcyA9IGl0ZW1zLmZpbHRlcigoaSkgPT4gaS50eXBlID09PSBcInNtc1wiKTtcblxuXHRcdGNvbnN0IGluY29taW5nQ2FsbHMgPSBjYWxscy5maWx0ZXIoKGMpID0+IGMuZGlyZWN0aW9uID09PSBcImluYm91bmRcIikubGVuZ3RoO1xuXHRcdGNvbnN0IG91dGdvaW5nQ2FsbHMgPSBjYWxscy5maWx0ZXIoXG5cdFx0XHQoYykgPT4gYy5kaXJlY3Rpb24gPT09IFwib3V0Ym91bmRcIixcblx0XHQpLmxlbmd0aDtcblx0XHRjb25zdCB0b3RhbENhbGxEdXJhdGlvbiA9IGNhbGxzLnJlZHVjZShcblx0XHRcdChzdW0sIGMpID0+IHN1bSArIChjLmNhbGxfZHVyYXRpb24gfHwgMCksXG5cdFx0XHQwLFxuXHRcdCk7XG5cdFx0Y29uc3QgaW5jb21pbmdTbXMgPSBzbXMuZmlsdGVyKChzKSA9PiBzLmRpcmVjdGlvbiA9PT0gXCJpbmJvdW5kXCIpLmxlbmd0aDtcblx0XHRjb25zdCBvdXRnb2luZ1NtcyA9IHNtcy5maWx0ZXIoKHMpID0+IHMuZGlyZWN0aW9uID09PSBcIm91dGJvdW5kXCIpLmxlbmd0aDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRpbmNvbWluZ0NhbGxzLFxuXHRcdFx0XHRvdXRnb2luZ0NhbGxzLFxuXHRcdFx0XHR0b3RhbENhbGxzOiBpbmNvbWluZ0NhbGxzICsgb3V0Z29pbmdDYWxscyxcblx0XHRcdFx0dG90YWxDYWxsRHVyYXRpb24sXG5cdFx0XHRcdGF2ZXJhZ2VDYWxsRHVyYXRpb246XG5cdFx0XHRcdFx0Y2FsbHMubGVuZ3RoID4gMCA/IHRvdGFsQ2FsbER1cmF0aW9uIC8gY2FsbHMubGVuZ3RoIDogMCxcblx0XHRcdFx0aW5jb21pbmdTbXMsXG5cdFx0XHRcdG91dGdvaW5nU21zLFxuXHRcdFx0XHR0b3RhbFNtczogaW5jb21pbmdTbXMgKyBvdXRnb2luZ1Ntcyxcblx0XHRcdFx0ZGFpbHlTdGF0czogYWdncmVnYXRlRGFpbHlTdGF0cyhpdGVtcywgZGF5cyksXG5cdFx0XHR9LFxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3Jcblx0XHRcdFx0XHQ/IGVycm9yLm1lc3NhZ2Vcblx0XHRcdFx0XHQ6IFwiRmFpbGVkIHRvIGdldCB1c2FnZSBzdGF0aXN0aWNzXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBhZ2dyZWdhdGUgZGFpbHkgc3RhdGlzdGljc1xuICovXG5mdW5jdGlvbiBhZ2dyZWdhdGVEYWlseVN0YXRzKFxuXHRpdGVtczogQXJyYXk8eyBjcmVhdGVkX2F0OiBzdHJpbmc7IHR5cGU6IHN0cmluZzsgY2FsbF9kdXJhdGlvbj86IG51bWJlciB9Pixcblx0ZGF5czogbnVtYmVyLFxuKSB7XG5cdGNvbnN0IGRhaWx5U3RhdHM6IFJlY29yZDxcblx0XHRzdHJpbmcsXG5cdFx0eyBkYXRlOiBzdHJpbmc7IGNhbGxzOiBudW1iZXI7IHNtczogbnVtYmVyOyBkdXJhdGlvbjogbnVtYmVyIH1cblx0PiA9IHt9O1xuXG5cdC8vIEluaXRpYWxpemUgYWxsIGRheXNcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXlzOyBpKyspIHtcblx0XHRjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcblx0XHRkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSBpKTtcblx0XHRjb25zdCBkYXRlU3RyID0gZGF0ZS50b0lTT1N0cmluZygpLnNwbGl0KFwiVFwiKVswXTtcblx0XHRkYWlseVN0YXRzW2RhdGVTdHJdID0geyBkYXRlOiBkYXRlU3RyLCBjYWxsczogMCwgc21zOiAwLCBkdXJhdGlvbjogMCB9O1xuXHR9XG5cblx0Ly8gQWdncmVnYXRlIGRhdGFcblx0aXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuXHRcdGNvbnN0IGRhdGVTdHIgPSBpdGVtLmNyZWF0ZWRfYXQuc3BsaXQoXCJUXCIpWzBdO1xuXHRcdGlmIChkYWlseVN0YXRzW2RhdGVTdHJdKSB7XG5cdFx0XHRpZiAoaXRlbS50eXBlID09PSBcInBob25lXCIpIHtcblx0XHRcdFx0ZGFpbHlTdGF0c1tkYXRlU3RyXS5jYWxscyArPSAxO1xuXHRcdFx0XHRkYWlseVN0YXRzW2RhdGVTdHJdLmR1cmF0aW9uICs9IGl0ZW0uY2FsbF9kdXJhdGlvbiB8fCAwO1xuXHRcdFx0fSBlbHNlIGlmIChpdGVtLnR5cGUgPT09IFwic21zXCIpIHtcblx0XHRcdFx0ZGFpbHlTdGF0c1tkYXRlU3RyXS5zbXMgKz0gMTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdHJldHVybiBPYmplY3QudmFsdWVzKGRhaWx5U3RhdHMpLnNvcnQoKGEsIGIpID0+IGEuZGF0ZS5sb2NhbGVDb21wYXJlKGIuZGF0ZSkpO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIwU0EyMEJzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/actions/data:840cd6 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40b8d713ea0a1ff9c9961eb1d6e32fbd00001de582":"stopCallRecording"},"apps/web/src/actions/telnyx.ts",""] */ __turbopack_context__.s([
    "stopCallRecording",
    ()=>stopCallRecording
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var stopCallRecording = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40b8d713ea0a1ff9c9961eb1d6e32fbd00001de582", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "stopCallRecording"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdGVsbnl4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGVsbnl4IFNlcnZlciBBY3Rpb25zXG4gKlxuICogU2VydmVyLXNpZGUgYWN0aW9ucyBmb3IgVGVsbnl4IFZvSVAgb3BlcmF0aW9uczpcbiAqIC0gUGhvbmUgbnVtYmVyIG1hbmFnZW1lbnRcbiAqIC0gQ2FsbCBvcGVyYXRpb25zXG4gKiAtIFNNUyBvcGVyYXRpb25zXG4gKiAtIFZvaWNlbWFpbCBvcGVyYXRpb25zXG4gKlxuICogQWxsIGFjdGlvbnMgaW5jbHVkZSBwcm9wZXIgYXV0aGVudGljYXRpb24gYW5kIGF1dGhvcml6YXRpb24gY2hlY2tzLlxuICovXG5cblwidXNlIHNlcnZlclwiO1xuXG5pbXBvcnQgdHlwZSB7IFN1cGFiYXNlQ2xpZW50IH0gZnJvbSBcIkBzdXBhYmFzZS9zdXBhYmFzZS1qc1wiO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiO1xuaW1wb3J0IHsgaGVhZGVycyB9IGZyb20gXCJuZXh0L2hlYWRlcnNcIjtcbmltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gXCJAL2xpYi9zdXBhYmFzZS9zZXJ2ZXJcIjtcbmltcG9ydCB7XG5cdGFuc3dlckNhbGwsXG5cdGhhbmd1cENhbGwsXG5cdGluaXRpYXRlQ2FsbCxcblx0cmVqZWN0Q2FsbCxcblx0c3RhcnRSZWNvcmRpbmcsXG5cdHN0b3BSZWNvcmRpbmcsXG59IGZyb20gXCJAL2xpYi90ZWxueXgvY2FsbHNcIjtcbmltcG9ydCB7IFRFTE5ZWF9DT05GSUcgfSBmcm9tIFwiQC9saWIvdGVsbnl4L2NsaWVudFwiO1xuaW1wb3J0IHtcblx0dmFsaWRhdGVDYWxsQ29uZmlnLFxuXHR2YWxpZGF0ZVNtc0NvbmZpZyxcbn0gZnJvbSBcIkAvbGliL3RlbG55eC9jb25maWctdmFsaWRhdG9yXCI7XG5pbXBvcnQgeyB2ZXJpZnlDb25uZWN0aW9uIH0gZnJvbSBcIkAvbGliL3RlbG55eC9jb25uZWN0aW9uLXNldHVwXCI7XG5pbXBvcnQgeyBmb3JtYXRQaG9uZU51bWJlciwgc2VuZE1NUywgc2VuZFNNUyB9IGZyb20gXCJAL2xpYi90ZWxueXgvbWVzc2FnaW5nXCI7XG5pbXBvcnQgeyB2ZXJpZnlNZXNzYWdpbmdQcm9maWxlIH0gZnJvbSBcIkAvbGliL3RlbG55eC9tZXNzYWdpbmctcHJvZmlsZS1zZXR1cFwiO1xuaW1wb3J0IHtcblx0dHlwZSBOdW1iZXJGZWF0dXJlLFxuXHR0eXBlIE51bWJlclR5cGUsXG5cdHB1cmNoYXNlTnVtYmVyLFxuXHRyZWxlYXNlTnVtYmVyLFxuXHRzZWFyY2hBdmFpbGFibGVOdW1iZXJzLFxufSBmcm9tIFwiQC9saWIvdGVsbnl4L251bWJlcnNcIjtcbmltcG9ydCB7XG5cdHZlcmlmeVNtc0NhcGFiaWxpdHksXG5cdHZlcmlmeVZvaWNlQ2FwYWJpbGl0eSxcbn0gZnJvbSBcIkAvbGliL3RlbG55eC9waG9uZS1udW1iZXItc2V0dXBcIjtcbmltcG9ydCB7XG5cdHR5cGUgQ29tcGFueVRlbG55eFNldHRpbmdzUm93LFxuXHRlbnN1cmVDb21wYW55VGVsbnl4U2V0dXAsXG5cdGZldGNoQ29tcGFueVRlbG55eFNldHRpbmdzLFxufSBmcm9tIFwiQC9saWIvdGVsbnl4L3Byb3Zpc2lvbi1jb21wYW55XCI7XG5pbXBvcnQgdHlwZSB7IERhdGFiYXNlLCBKc29uIH0gZnJvbSBcIkAvdHlwZXMvc3VwYWJhc2VcIjtcbmltcG9ydCB7IGVuc3VyZU1lc3NhZ2luZ0NhbXBhaWduIH0gZnJvbSBcIi4vbWVzc2FnaW5nLWJyYW5kaW5nXCI7XG5cbnR5cGUgVHlwZWRTdXBhYmFzZUNsaWVudCA9IFN1cGFiYXNlQ2xpZW50PERhdGFiYXNlPjtcblxuZnVuY3Rpb24gbm9ybWFsaXplUGhvbmVOdW1iZXIocGhvbmVOdW1iZXI6IHN0cmluZyk6IHN0cmluZyB7XG5cdHJldHVybiBmb3JtYXRQaG9uZU51bWJlcihwaG9uZU51bWJlcik7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RBcmVhQ29kZShwaG9uZU51bWJlcjogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG5cdGNvbnN0IGRpZ2l0cyA9IHBob25lTnVtYmVyLnJlcGxhY2UoL1xcRC9nLCBcIlwiKTtcblx0aWYgKGRpZ2l0cy5sZW5ndGggPT09IDExICYmIGRpZ2l0cy5zdGFydHNXaXRoKFwiMVwiKSkge1xuXHRcdHJldHVybiBkaWdpdHMuc2xpY2UoMSwgNCk7XG5cdH1cblx0aWYgKGRpZ2l0cy5sZW5ndGggPT09IDEwKSB7XG5cdFx0cmV0dXJuIGRpZ2l0cy5zbGljZSgwLCAzKTtcblx0fVxuXHRyZXR1cm4gbnVsbDtcbn1cblxuY29uc3QgREVGQVVMVF9NRVNTQUdJTkdfUFJPRklMRV9JRCA9XG5cdHByb2Nlc3MuZW52LlRFTE5ZWF9ERUZBVUxUX01FU1NBR0lOR19QUk9GSUxFX0lEIHx8XG5cdHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1RFTE5ZWF9NRVNTQUdJTkdfUFJPRklMRV9JRCB8fFxuXHRcIlwiO1xuXG5jb25zdCBERUZBVUxUX1BIT05FX05VTUJFUl9GRUFUVVJFUzogSnNvbiA9IFtcInZvaWNlXCIsIFwic21zXCIsIFwibW1zXCJdO1xuXG5mdW5jdGlvbiBmb3JtYXREaXNwbGF5UGhvbmVOdW1iZXIocGhvbmVOdW1iZXI6IHN0cmluZyk6IHN0cmluZyB7XG5cdGNvbnN0IGRpZ2l0cyA9IHBob25lTnVtYmVyLnJlcGxhY2UoL1xcRC9nLCBcIlwiKTtcblx0aWYgKGRpZ2l0cy5sZW5ndGggPT09IDExICYmIGRpZ2l0cy5zdGFydHNXaXRoKFwiMVwiKSkge1xuXHRcdHJldHVybiBgKzEgKCR7ZGlnaXRzLnNsaWNlKDEsIDQpfSkgJHtkaWdpdHMuc2xpY2UoNCwgNyl9LSR7ZGlnaXRzLnNsaWNlKDcpfWA7XG5cdH1cblx0aWYgKGRpZ2l0cy5sZW5ndGggPT09IDEwKSB7XG5cdFx0cmV0dXJuIGAoJHtkaWdpdHMuc2xpY2UoMCwgMyl9KSAke2RpZ2l0cy5zbGljZSgzLCA2KX0tJHtkaWdpdHMuc2xpY2UoNil9YDtcblx0fVxuXHRyZXR1cm4gcGhvbmVOdW1iZXI7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldENvbXBhbnlUZWxueXhTZXR0aW5ncyhcblx0c3VwYWJhc2U6IFR5cGVkU3VwYWJhc2VDbGllbnQsXG5cdGNvbXBhbnlJZDogc3RyaW5nIHwgbnVsbCxcbik6IFByb21pc2U8Q29tcGFueVRlbG55eFNldHRpbmdzUm93IHwgbnVsbD4ge1xuXHRpZiAoIWNvbXBhbnlJZCkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Y29uc3QgZXhpc3RpbmcgPSBhd2FpdCBmZXRjaENvbXBhbnlUZWxueXhTZXR0aW5ncyhzdXBhYmFzZSwgY29tcGFueUlkKTtcblx0aWYgKGV4aXN0aW5nICYmIGV4aXN0aW5nLnN0YXR1cyA9PT0gXCJyZWFkeVwiKSB7XG5cdFx0cmV0dXJuIGV4aXN0aW5nO1xuXHR9XG5cblx0Y29uc3QgcHJvdmlzaW9uUmVzdWx0ID0gYXdhaXQgZW5zdXJlQ29tcGFueVRlbG55eFNldHVwKHtcblx0XHRjb21wYW55SWQsXG5cdFx0c3VwYWJhc2UsXG5cdH0pO1xuXG5cdGlmICghcHJvdmlzaW9uUmVzdWx0LnN1Y2Nlc3MpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHJldHVybiBwcm92aXNpb25SZXN1bHQuc2V0dGluZ3MgPz8gbnVsbDtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQmFzZVVybCh1cmw6IHN0cmluZyk6IHN0cmluZyB7XG5cdGNvbnN0IHRyaW1tZWQgPSB1cmwudHJpbSgpLnJlcGxhY2UoL1xcLyskLywgXCJcIik7XG5cdGlmICgvXmh0dHBzPzpcXC9cXC8vaS50ZXN0KHRyaW1tZWQpKSB7XG5cdFx0aWYgKC9eaHR0cDpcXC9cXC8vaS50ZXN0KHRyaW1tZWQpICYmICFpc0xvY2FsVXJsKHRyaW1tZWQpKSB7XG5cdFx0XHRyZXR1cm4gdHJpbW1lZC5yZXBsYWNlKC9eaHR0cDpcXC9cXC8vaSwgXCJodHRwczovL1wiKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRyaW1tZWQ7XG5cdH1cblx0cmV0dXJuIGBodHRwczovLyR7dHJpbW1lZH1gO1xufVxuXG5mdW5jdGlvbiBpc0xvY2FsVXJsKHVybDogc3RyaW5nKTogYm9vbGVhbiB7XG5cdGNvbnN0IGxvd2VyZWQgPSB1cmwudG9Mb3dlckNhc2UoKTtcblx0cmV0dXJuIChcblx0XHRsb3dlcmVkLmluY2x1ZGVzKFwibG9jYWxob3N0XCIpIHx8XG5cdFx0bG93ZXJlZC5pbmNsdWRlcyhcIjEyNy4wLjAuMVwiKSB8fFxuXHRcdGxvd2VyZWQuaW5jbHVkZXMoXCIwLjAuMC4wXCIpIHx8XG5cdFx0bG93ZXJlZC5lbmRzV2l0aChcIi5sb2NhbFwiKSB8fFxuXHRcdGxvd2VyZWQuaW5jbHVkZXMoXCI6Ly9sb2NhbFwiKVxuXHQpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VVcmwodXJsOiBzdHJpbmcpOiBib29sZWFuIHtcblx0aWYgKCF1cmwpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0Y29uc3QgdHJpbW1lZCA9IHVybC50cmltKCk7XG5cdGlmICghdHJpbW1lZCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRjb25zdCBpc0hvc3RlZFByb2R1Y3Rpb24gPVxuXHRcdChwcm9jZXNzLmVudi5WRVJDRUwgPT09IFwiMVwiICYmIHByb2Nlc3MuZW52LlZFUkNFTF9FTlYgPT09IFwicHJvZHVjdGlvblwiKSB8fFxuXHRcdHByb2Nlc3MuZW52LkRFUExPWU1FTlRfRU5WID09PSBcInByb2R1Y3Rpb25cIjtcblxuXHRpZiAoaXNIb3N0ZWRQcm9kdWN0aW9uICYmIGlzTG9jYWxVcmwodHJpbW1lZCkpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QmFzZUFwcFVybCgpOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuXHRjb25zdCBjYW5kaWRhdGVzID0gW1xuXHRcdHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NJVEVfVVJMLFxuXHRcdHByb2Nlc3MuZW52LlNJVEVfVVJMLFxuXHRcdHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0FQUF9VUkwsXG5cdFx0cHJvY2Vzcy5lbnYuQVBQX1VSTCxcblx0XTtcblx0Zm9yIChjb25zdCBjYW5kaWRhdGUgb2YgY2FuZGlkYXRlcykge1xuXHRcdGlmIChjYW5kaWRhdGUgJiYgc2hvdWxkVXNlVXJsKGNhbmRpZGF0ZSkpIHtcblx0XHRcdHJldHVybiBub3JtYWxpemVCYXNlVXJsKGNhbmRpZGF0ZSk7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgdmVyY2VsVXJsID0gcHJvY2Vzcy5lbnYuVkVSQ0VMX1VSTDtcblx0aWYgKHZlcmNlbFVybCAmJiBzaG91bGRVc2VVcmwodmVyY2VsVXJsKSkge1xuXHRcdHJldHVybiBub3JtYWxpemVCYXNlVXJsKFxuXHRcdFx0dmVyY2VsVXJsLnN0YXJ0c1dpdGgoXCJodHRwXCIpID8gdmVyY2VsVXJsIDogYGh0dHBzOi8vJHt2ZXJjZWxVcmx9YCxcblx0XHQpO1xuXHR9XG5cblx0dHJ5IHtcblx0XHRjb25zdCBoZHJzID0gYXdhaXQgaGVhZGVycygpO1xuXHRcdGNvbnN0IG9yaWdpbiA9IGhkcnMuZ2V0KFwib3JpZ2luXCIpO1xuXHRcdGlmIChvcmlnaW4gJiYgc2hvdWxkVXNlVXJsKG9yaWdpbikpIHtcblx0XHRcdHJldHVybiBub3JtYWxpemVCYXNlVXJsKG9yaWdpbik7XG5cdFx0fVxuXHRcdGNvbnN0IGhvc3QgPSBoZHJzLmdldChcImhvc3RcIik7XG5cdFx0aWYgKGhvc3QgJiYgc2hvdWxkVXNlVXJsKGhvc3QpKSB7XG5cdFx0XHRjb25zdCBwcm90b2NvbCA9IGhvc3QuaW5jbHVkZXMoXCJsb2NhbGhvc3RcIikgPyBcImh0dHBcIiA6IFwiaHR0cHNcIjtcblx0XHRcdHJldHVybiBub3JtYWxpemVCYXNlVXJsKGAke3Byb3RvY29sfTovLyR7aG9zdH1gKTtcblx0XHR9XG5cdH0gY2F0Y2gge1xuXHRcdC8vIGhlYWRlcnMoKSBub3QgYXZhaWxhYmxlIG91dHNpZGUgb2YgYSByZXF1ZXN0IGNvbnRleHRcblx0fVxuXG5cdHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkQWJzb2x1dGVVcmwocGF0aDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcgfCB1bmRlZmluZWQ+IHtcblx0Y29uc3QgYmFzZSA9IGF3YWl0IGdldEJhc2VBcHBVcmwoKTtcblx0aWYgKCFiYXNlKSB7XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxuXHRjb25zdCBub3JtYWxpemVkUGF0aCA9IHBhdGguc3RhcnRzV2l0aChcIi9cIikgPyBwYXRoIDogYC8ke3BhdGh9YDtcblx0cmV0dXJuIGAke2Jhc2V9JHtub3JtYWxpemVkUGF0aH1gO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRUZWxueXhXZWJob29rVXJsKFxuXHRjb21wYW55SWQ/OiBzdHJpbmcsXG4pOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuXHRpZiAoY29tcGFueUlkKSB7XG5cdFx0cmV0dXJuIGJ1aWxkQWJzb2x1dGVVcmwoYC9hcGkvd2ViaG9va3MvdGVsbnl4P2NvbXBhbnk9JHtjb21wYW55SWR9YCk7XG5cdH1cblx0cmV0dXJuIGJ1aWxkQWJzb2x1dGVVcmwoXCIvYXBpL3dlYmhvb2tzL3RlbG55eFwiKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0UGhvbmVOdW1iZXJJZChcblx0c3VwYWJhc2U6IFR5cGVkU3VwYWJhc2VDbGllbnQsXG5cdHBob25lTnVtYmVyOiBzdHJpbmcsXG4pOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcblx0Y29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVBob25lTnVtYmVyKHBob25lTnVtYmVyKTtcblx0Y29uc3QgeyBkYXRhIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdC5mcm9tKFwicGhvbmVfbnVtYmVyc1wiKVxuXHRcdC5zZWxlY3QoXCJpZFwiKVxuXHRcdC5lcShcInBob25lX251bWJlclwiLCBub3JtYWxpemVkKVxuXHRcdC5pcyhcImRlbGV0ZWRfYXRcIiwgbnVsbClcblx0XHQubWF5YmVTaW5nbGUoKTtcblxuXHRyZXR1cm4gZGF0YT8uaWQgPz8gbnVsbDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZW5zdXJlUGhvbmVOdW1iZXJSZWNvcmRFeGlzdHMoXG5cdHN1cGFiYXNlOiBUeXBlZFN1cGFiYXNlQ2xpZW50LFxuXHRjb21wYW55SWQ6IHN0cmluZyxcblx0cGhvbmVOdW1iZXI6IHN0cmluZyB8IG51bGwsXG4pOiBQcm9taXNlPHZvaWQ+IHtcblx0aWYgKCFwaG9uZU51bWJlcikge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVQaG9uZU51bWJlcihwaG9uZU51bWJlcik7XG5cdGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHQuZnJvbShcInBob25lX251bWJlcnNcIilcblx0XHQuc2VsZWN0KFwiaWRcIilcblx0XHQuZXEoXCJjb21wYW55X2lkXCIsIGNvbXBhbnlJZClcblx0XHQuZXEoXCJwaG9uZV9udW1iZXJcIiwgbm9ybWFsaXplZClcblx0XHQubGltaXQoMSk7XG5cblx0aWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0YXdhaXQgc3VwYWJhc2UuZnJvbShcInBob25lX251bWJlcnNcIikuaW5zZXJ0KHtcblx0XHRjb21wYW55X2lkOiBjb21wYW55SWQsXG5cdFx0cGhvbmVfbnVtYmVyOiBub3JtYWxpemVkLFxuXHRcdGZvcm1hdHRlZF9udW1iZXI6IGZvcm1hdERpc3BsYXlQaG9uZU51bWJlcihub3JtYWxpemVkKSxcblx0XHRjb3VudHJ5X2NvZGU6IFwiVVNcIixcblx0XHRhcmVhX2NvZGU6IGV4dHJhY3RBcmVhQ29kZShub3JtYWxpemVkKSxcblx0XHRudW1iZXJfdHlwZTogXCJsb2NhbFwiLFxuXHRcdHN0YXR1czogXCJhY3RpdmVcIixcblx0XHRmZWF0dXJlczogREVGQVVMVF9QSE9ORV9OVU1CRVJfRkVBVFVSRVMsXG5cdH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZXNvbHZlT3V0Ym91bmRQaG9uZU51bWJlcihcblx0c3VwYWJhc2U6IFR5cGVkU3VwYWJhc2VDbGllbnQsXG5cdGNvbXBhbnlJZDogc3RyaW5nLFxuXHRleHBsaWNpdEZyb20/OiBzdHJpbmcgfCBudWxsLFxuXHRkZWZhdWx0TnVtYmVyPzogc3RyaW5nIHwgbnVsbCxcbik6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuXHRpZiAoZXhwbGljaXRGcm9tKSB7XG5cdFx0cmV0dXJuIG5vcm1hbGl6ZVBob25lTnVtYmVyKGV4cGxpY2l0RnJvbSk7XG5cdH1cblxuXHRjb25zdCBub3JtYWxpemVkRGVmYXVsdCA9IGRlZmF1bHROdW1iZXJcblx0XHQ/IG5vcm1hbGl6ZVBob25lTnVtYmVyKGRlZmF1bHROdW1iZXIpXG5cdFx0OiBudWxsO1xuXG5cdHRyeSB7XG5cdFx0Y29uc3QgeyBkYXRhIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJwaG9uZV9udW1iZXJzXCIpXG5cdFx0XHQuc2VsZWN0KFwicGhvbmVfbnVtYmVyLCBudW1iZXJfdHlwZVwiKVxuXHRcdFx0LmVxKFwiY29tcGFueV9pZFwiLCBjb21wYW55SWQpXG5cdFx0XHQuZXEoXCJzdGF0dXNcIiwgXCJhY3RpdmVcIik7XG5cblx0XHRpZiAoZGF0YSAmJiBkYXRhLmxlbmd0aCA+IDApIHtcblx0XHRcdGNvbnN0IHRvbGxGcmVlID0gZGF0YS5maW5kKChuKSA9PiBuLm51bWJlcl90eXBlID09PSBcInRvbGwtZnJlZVwiKTtcblx0XHRcdGlmICh0b2xsRnJlZSkge1xuXHRcdFx0XHRyZXR1cm4gbm9ybWFsaXplUGhvbmVOdW1iZXIodG9sbEZyZWUucGhvbmVfbnVtYmVyKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG5vcm1hbGl6ZWREZWZhdWx0KSB7XG5cdFx0XHRcdGNvbnN0IGRlZmF1bHRFeGlzdHMgPSBkYXRhLnNvbWUoXG5cdFx0XHRcdFx0KG4pID0+IG5vcm1hbGl6ZVBob25lTnVtYmVyKG4ucGhvbmVfbnVtYmVyKSA9PT0gbm9ybWFsaXplZERlZmF1bHQsXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGlmIChkZWZhdWx0RXhpc3RzKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG5vcm1hbGl6ZWREZWZhdWx0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBub3JtYWxpemVQaG9uZU51bWJlcihkYXRhWzBdLnBob25lX251bWJlcik7XG5cdFx0fVxuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUud2Fybihcblx0XHRcdFwiRmFpbGVkIHRvIGxvYWQgY29tcGFueSBwaG9uZSBudW1iZXJzIGZvciBvdXRib3VuZCBzZWxlY3Rpb246XCIsXG5cdFx0XHRlcnJvcixcblx0XHQpO1xuXHR9XG5cblx0cmV0dXJuIG5vcm1hbGl6ZWREZWZhdWx0O1xufVxuXG5hc3luYyBmdW5jdGlvbiBtZXJnZVByb3ZpZGVyTWV0YWRhdGEoXG5cdHN1cGFiYXNlOiBUeXBlZFN1cGFiYXNlQ2xpZW50LFxuXHRjb21tdW5pY2F0aW9uSWQ6IHN0cmluZyxcblx0cGF0Y2g6IFJlY29yZDxzdHJpbmcsIEpzb24+LFxuKTogUHJvbWlzZTx2b2lkPiB7XG5cdGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHQuZnJvbShcImNvbW11bmljYXRpb25zXCIpXG5cdFx0LnNlbGVjdChcInByb3ZpZGVyX21ldGFkYXRhXCIpXG5cdFx0LmVxKFwiaWRcIiwgY29tbXVuaWNhdGlvbklkKVxuXHRcdC5tYXliZVNpbmdsZSgpO1xuXG5cdGNvbnN0IGN1cnJlbnRNZXRhZGF0YSA9XG5cdFx0KGRhdGE/LnByb3ZpZGVyX21ldGFkYXRhIGFzIFJlY29yZDxzdHJpbmcsIEpzb24+IHwgbnVsbCkgPz8ge307XG5cdGNvbnN0IG1lcmdlZE1ldGFkYXRhOiBSZWNvcmQ8c3RyaW5nLCBKc29uPiA9IHtcblx0XHQuLi5jdXJyZW50TWV0YWRhdGEsXG5cdFx0Li4ucGF0Y2gsXG5cdH07XG5cblx0YXdhaXQgc3VwYWJhc2Vcblx0XHQuZnJvbShcImNvbW11bmljYXRpb25zXCIpXG5cdFx0LnVwZGF0ZSh7XG5cdFx0XHRwcm92aWRlcl9tZXRhZGF0YTogbWVyZ2VkTWV0YWRhdGEsXG5cdFx0fSlcblx0XHQuZXEoXCJpZFwiLCBjb21tdW5pY2F0aW9uSWQpO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBQSE9ORSBOVU1CRVIgTUFOQUdFTUVOVCBBQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogU2VhcmNoIGZvciBhdmFpbGFibGUgcGhvbmUgbnVtYmVycyB0byBwdXJjaGFzZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VhcmNoUGhvbmVOdW1iZXJzKHBhcmFtczoge1xuXHRhcmVhQ29kZT86IHN0cmluZztcblx0bnVtYmVyVHlwZT86IE51bWJlclR5cGU7XG5cdGZlYXR1cmVzPzogTnVtYmVyRmVhdHVyZVtdO1xuXHRsaW1pdD86IG51bWJlcjtcbn0pIHtcblx0dHJ5IHtcblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBzZWFyY2hBdmFpbGFibGVOdW1iZXJzKHtcblx0XHRcdGNvdW50cnlDb2RlOiBcIlVTXCIsXG5cdFx0XHRhcmVhQ29kZTogcGFyYW1zLmFyZWFDb2RlLFxuXHRcdFx0bnVtYmVyVHlwZTogcGFyYW1zLm51bWJlclR5cGUsXG5cdFx0XHRmZWF0dXJlczogcGFyYW1zLmZlYXR1cmVzLFxuXHRcdFx0bGltaXQ6IHBhcmFtcy5saW1pdCB8fCAxMCxcblx0XHR9KTtcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3Jcblx0XHRcdFx0XHQ/IGVycm9yLm1lc3NhZ2Vcblx0XHRcdFx0XHQ6IFwiRmFpbGVkIHRvIHNlYXJjaCBwaG9uZSBudW1iZXJzXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIFB1cmNoYXNlIGEgcGhvbmUgbnVtYmVyIGFuZCBhc3NvY2lhdGUgaXQgd2l0aCB0aGUgY3VycmVudCBjb21wYW55XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwdXJjaGFzZVBob25lTnVtYmVyKHBhcmFtczoge1xuXHRwaG9uZU51bWJlcjogc3RyaW5nO1xuXHRjb21wYW55SWQ6IHN0cmluZztcblx0YmlsbGluZ0dyb3VwSWQ/OiBzdHJpbmc7XG59KSB7XG5cdHRyeSB7XG5cdFx0Ly8gVmFsaWRhdGUgY29uZmlndXJhdGlvblxuXHRcdGNvbnN0IHNtc0NvbmZpZyA9IGF3YWl0IHZhbGlkYXRlU21zQ29uZmlnKCk7XG5cdFx0Y29uc3QgY2FsbENvbmZpZyA9IHZhbGlkYXRlQ2FsbENvbmZpZygpO1xuXHRcdGlmICghc21zQ29uZmlnLnZhbGlkIHx8ICFjYWxsQ29uZmlnLnZhbGlkKSB7XG5cdFx0XHRsZXQgZXJyb3JNZXNzYWdlID1cblx0XHRcdFx0XCJUZWxueXggY29uZmlndXJhdGlvbiBpcyBpbmNvbXBsZXRlLiBQbGVhc2UgY29uZmlndXJlIGFsbCByZXF1aXJlZCBlbnZpcm9ubWVudCB2YXJpYWJsZXMuXCI7XG5cblx0XHRcdC8vIElmIHdlIGhhdmUgYSBzdWdnZXN0ZWQgcHJvZmlsZSBJRCwgaW5jbHVkZSBpdCBpbiB0aGUgZXJyb3Jcblx0XHRcdGlmIChzbXNDb25maWcuc3VnZ2VzdGVkUHJvZmlsZUlkKSB7XG5cdFx0XHRcdGVycm9yTWVzc2FnZSArPSBgIEZvdW5kIG1lc3NhZ2luZyBwcm9maWxlIFwiJHtzbXNDb25maWcuc3VnZ2VzdGVkUHJvZmlsZUlkfVwiIGluIHlvdXIgVGVsbnl4IGFjY291bnQuIFNldCBURUxOWVhfREVGQVVMVF9NRVNTQUdJTkdfUFJPRklMRV9JRD0ke3Ntc0NvbmZpZy5zdWdnZXN0ZWRQcm9maWxlSWR9IHRvIHVzZSBpdC5gO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6IGVycm9yTWVzc2FnZSxcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcblx0XHRpZiAoIXN1cGFiYXNlKSB7XG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiU2VydmljZSB1bmF2YWlsYWJsZVwiIH07XG5cdFx0fVxuXG5cdFx0Y29uc3Qgbm9ybWFsaXplZFBob25lTnVtYmVyID0gbm9ybWFsaXplUGhvbmVOdW1iZXIocGFyYW1zLnBob25lTnVtYmVyKTtcblx0XHRjb25zdCBmb3JtYXR0ZWROdW1iZXIgPSBmb3JtYXREaXNwbGF5UGhvbmVOdW1iZXIobm9ybWFsaXplZFBob25lTnVtYmVyKTtcblx0XHRjb25zdCBhcmVhQ29kZSA9IGV4dHJhY3RBcmVhQ29kZShub3JtYWxpemVkUGhvbmVOdW1iZXIpO1xuXG5cdFx0Ly8gUHVyY2hhc2UgbnVtYmVyIGZyb20gVGVsbnl4XG5cdFx0Y29uc3QgbWVzc2FnaW5nUHJvZmlsZUlkID0gREVGQVVMVF9NRVNTQUdJTkdfUFJPRklMRV9JRCB8fCB1bmRlZmluZWQ7XG5cblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBwdXJjaGFzZU51bWJlcih7XG5cdFx0XHRwaG9uZU51bWJlcjogbm9ybWFsaXplZFBob25lTnVtYmVyLFxuXHRcdFx0Y29ubmVjdGlvbklkOiBURUxOWVhfQ09ORklHLmNvbm5lY3Rpb25JZCxcblx0XHRcdG1lc3NhZ2luZ1Byb2ZpbGVJZCxcblx0XHRcdGJpbGxpbmdHcm91cElkOiBwYXJhbXMuYmlsbGluZ0dyb3VwSWQsXG5cdFx0XHRjdXN0b21lclJlZmVyZW5jZTogYGNvbXBhbnlfJHtwYXJhbXMuY29tcGFueUlkfWAsXG5cdFx0fSk7XG5cblx0XHRpZiAoIXJlc3VsdC5zdWNjZXNzKSB7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdC8vIFN0b3JlIGluIGRhdGFiYXNlXG5cdFx0Y29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwicGhvbmVfbnVtYmVyc1wiKVxuXHRcdFx0Lmluc2VydCh7XG5cdFx0XHRcdGNvbXBhbnlfaWQ6IHBhcmFtcy5jb21wYW55SWQsXG5cdFx0XHRcdHRlbG55eF9waG9uZV9udW1iZXJfaWQ6IHJlc3VsdC5vcmRlcklkLFxuXHRcdFx0XHR0ZWxueXhfY29ubmVjdGlvbl9pZDogVEVMTllYX0NPTkZJRy5jb25uZWN0aW9uSWQsXG5cdFx0XHRcdHBob25lX251bWJlcjogbm9ybWFsaXplZFBob25lTnVtYmVyLFxuXHRcdFx0XHRmb3JtYXR0ZWRfbnVtYmVyOiBmb3JtYXR0ZWROdW1iZXIsXG5cdFx0XHRcdGNvdW50cnlfY29kZTogXCJVU1wiLFxuXHRcdFx0XHRhcmVhX2NvZGU6IGFyZWFDb2RlLFxuXHRcdFx0XHRudW1iZXJfdHlwZTogXCJsb2NhbFwiLFxuXHRcdFx0XHRmZWF0dXJlczogW1widm9pY2VcIiwgXCJzbXNcIl0sXG5cdFx0XHRcdHN0YXR1czogXCJwZW5kaW5nXCIsXG5cdFx0XHR9KVxuXHRcdFx0LnNlbGVjdCgpXG5cdFx0XHQuc2luZ2xlKCk7XG5cblx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblxuXHRcdHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9zZXR0aW5ncy9jb21tdW5pY2F0aW9ucy9waG9uZS1udW1iZXJzXCIpO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IGVuc3VyZU1lc3NhZ2luZ0NhbXBhaWduKFxuXHRcdFx0XHRwYXJhbXMuY29tcGFueUlkLFxuXHRcdFx0XHR7IGlkOiBkYXRhLmlkLCBlMTY0OiBub3JtYWxpemVkUGhvbmVOdW1iZXIgfSxcblx0XHRcdFx0eyBzdXBhYmFzZSB9LFxuXHRcdFx0KTtcblx0XHR9IGNhdGNoIChfY2FtcGFpZ25FcnJvcikge31cblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0ZGF0YSxcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdGVycm9yOlxuXHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yXG5cdFx0XHRcdFx0PyBlcnJvci5tZXNzYWdlXG5cdFx0XHRcdFx0OiBcIkZhaWxlZCB0byBwdXJjaGFzZSBwaG9uZSBudW1iZXJcIixcblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogR2V0IGFsbCBwaG9uZSBudW1iZXJzIGZvciBhIGNvbXBhbnlcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENvbXBhbnlQaG9uZU51bWJlcnMoY29tcGFueUlkOiBzdHJpbmcpIHtcblx0dHJ5IHtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHRjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJwaG9uZV9udW1iZXJzXCIpXG5cdFx0XHQuc2VsZWN0KFwiKlwiKVxuXHRcdFx0LmVxKFwiY29tcGFueV9pZFwiLCBjb21wYW55SWQpXG5cdFx0XHQuaXMoXCJkZWxldGVkX2F0XCIsIG51bGwpXG5cdFx0XHQub3JkZXIoXCJjcmVhdGVkX2F0XCIsIHsgYXNjZW5kaW5nOiBmYWxzZSB9KTtcblxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IHRydWUsXG5cdFx0XHRkYXRhOiBkYXRhIHx8IFtdLFxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJGYWlsZWQgdG8gZ2V0IHBob25lIG51bWJlcnNcIixcblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogVXBkYXRlIHBob25lIG51bWJlciBjb25maWd1cmF0aW9uXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVBob25lTnVtYmVyKHBhcmFtczoge1xuXHRwaG9uZU51bWJlcklkOiBzdHJpbmc7XG5cdHJvdXRpbmdSdWxlSWQ/OiBzdHJpbmc7XG5cdGZvcndhcmRUb051bWJlcj86IHN0cmluZztcblx0dm9pY2VtYWlsRW5hYmxlZD86IGJvb2xlYW47XG59KSB7XG5cdHRyeSB7XG5cdFx0Y29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcblx0XHRpZiAoIXN1cGFiYXNlKSB7XG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiU2VydmljZSB1bmF2YWlsYWJsZVwiIH07XG5cdFx0fVxuXG5cdFx0Y29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwicGhvbmVfbnVtYmVyc1wiKVxuXHRcdFx0LnVwZGF0ZSh7XG5cdFx0XHRcdGNhbGxfcm91dGluZ19ydWxlX2lkOiBwYXJhbXMucm91dGluZ1J1bGVJZCxcblx0XHRcdFx0Zm9yd2FyZF90b19udW1iZXI6IHBhcmFtcy5mb3J3YXJkVG9OdW1iZXIsXG5cdFx0XHRcdHZvaWNlbWFpbF9lbmFibGVkOiBwYXJhbXMudm9pY2VtYWlsRW5hYmxlZCxcblx0XHRcdH0pXG5cdFx0XHQuZXEoXCJpZFwiLCBwYXJhbXMucGhvbmVOdW1iZXJJZClcblx0XHRcdC5zZWxlY3QoKVxuXHRcdFx0LnNpbmdsZSgpO1xuXG5cdFx0aWYgKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cblx0XHRyZXZhbGlkYXRlUGF0aChcIi9kYXNoYm9hcmQvc2V0dGluZ3MvY29tbXVuaWNhdGlvbnMvcGhvbmUtbnVtYmVyc1wiKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0ZGF0YSxcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdGVycm9yOlxuXHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yXG5cdFx0XHRcdFx0PyBlcnJvci5tZXNzYWdlXG5cdFx0XHRcdFx0OiBcIkZhaWxlZCB0byB1cGRhdGUgcGhvbmUgbnVtYmVyXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIFJlbGVhc2UgKGRlbGV0ZSkgYSBwaG9uZSBudW1iZXJcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZGVsZXRlUGhvbmVOdW1iZXIocGhvbmVOdW1iZXJJZDogc3RyaW5nKSB7XG5cdHRyeSB7XG5cdFx0Y29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcblx0XHRpZiAoIXN1cGFiYXNlKSB7XG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiU2VydmljZSB1bmF2YWlsYWJsZVwiIH07XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IHBob25lIG51bWJlciBkZXRhaWxzXG5cdFx0Y29uc3QgeyBkYXRhOiBwaG9uZU51bWJlciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwicGhvbmVfbnVtYmVyc1wiKVxuXHRcdFx0LnNlbGVjdChcIipcIilcblx0XHRcdC5lcShcImlkXCIsIHBob25lTnVtYmVySWQpXG5cdFx0XHQuc2luZ2xlKCk7XG5cblx0XHRpZiAoIXBob25lTnVtYmVyKSB7XG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiUGhvbmUgbnVtYmVyIG5vdCBmb3VuZFwiIH07XG5cdFx0fVxuXG5cdFx0Ly8gUmVsZWFzZSBmcm9tIFRlbG55eCBpZiB3ZSBoYXZlIHRoZSBJRFxuXHRcdGlmIChwaG9uZU51bWJlci50ZWxueXhfcGhvbmVfbnVtYmVyX2lkKSB7XG5cdFx0XHRhd2FpdCByZWxlYXNlTnVtYmVyKHBob25lTnVtYmVyLnRlbG55eF9waG9uZV9udW1iZXJfaWQpO1xuXHRcdH1cblxuXHRcdC8vIFNvZnQgZGVsZXRlIGluIGRhdGFiYXNlXG5cdFx0Y29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwicGhvbmVfbnVtYmVyc1wiKVxuXHRcdFx0LnVwZGF0ZSh7XG5cdFx0XHRcdGRlbGV0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcblx0XHRcdFx0c3RhdHVzOiBcImRlbGV0ZWRcIixcblx0XHRcdH0pXG5cdFx0XHQuZXEoXCJpZFwiLCBwaG9uZU51bWJlcklkKTtcblxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXG5cdFx0cmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL3NldHRpbmdzL2NvbW11bmljYXRpb25zL3Bob25lLW51bWJlcnNcIik7XG5cblx0XHRyZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3Jcblx0XHRcdFx0XHQ/IGVycm9yLm1lc3NhZ2Vcblx0XHRcdFx0XHQ6IFwiRmFpbGVkIHRvIGRlbGV0ZSBwaG9uZSBudW1iZXJcIixcblx0XHR9O1xuXHR9XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIENBTEwgT1BFUkFUSU9OUyBBQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogSW5pdGlhdGUgYW4gb3V0Ym91bmQgY2FsbFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFrZUNhbGwocGFyYW1zOiB7XG5cdHRvOiBzdHJpbmc7XG5cdGZyb206IHN0cmluZztcblx0Y29tcGFueUlkOiBzdHJpbmc7XG5cdGN1c3RvbWVySWQ/OiBzdHJpbmc7XG5cdGpvYklkPzogc3RyaW5nO1xuXHRwcm9wZXJ0eUlkPzogc3RyaW5nO1xuXHRpbnZvaWNlSWQ/OiBzdHJpbmc7XG5cdGVzdGltYXRlSWQ/OiBzdHJpbmc7XG59KSB7XG5cdHRyeSB7XG5cdFx0Y29uc29sZS5sb2coXCLwn5OeIG1ha2VDYWxsIGNhbGxlZCB3aXRoIHBhcmFtczpcIiwgcGFyYW1zKTtcblxuXHRcdGNvbnN0IGNhbGxDb25maWcgPSB2YWxpZGF0ZUNhbGxDb25maWcoKTtcblx0XHRjb25zb2xlLmxvZyhcIvCflI0gQ2FsbCBjb25maWcgdmFsaWRhdGlvbjpcIiwgY2FsbENvbmZpZyk7XG5cdFx0aWYgKCFjYWxsQ29uZmlnLnZhbGlkKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6IGNhbGxDb25maWcuZXJyb3IgfHwgXCJDYWxsIGNvbmZpZ3VyYXRpb24gaXMgaW52YWxpZFwiLFxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHRjb25zdCBjb21wYW55U2V0dGluZ3MgPSBhd2FpdCBnZXRDb21wYW55VGVsbnl4U2V0dGluZ3MoXG5cdFx0XHRzdXBhYmFzZSxcblx0XHRcdHBhcmFtcy5jb21wYW55SWQsXG5cdFx0KTtcblxuXHRcdGF3YWl0IGVuc3VyZVBob25lTnVtYmVyUmVjb3JkRXhpc3RzKFxuXHRcdFx0c3VwYWJhc2UsXG5cdFx0XHRwYXJhbXMuY29tcGFueUlkLFxuXHRcdFx0Y29tcGFueVNldHRpbmdzPy5kZWZhdWx0X291dGJvdW5kX251bWJlciB8fCBudWxsLFxuXHRcdCk7XG5cblx0XHRjb25zdCBjb25uZWN0aW9uT3ZlcnJpZGUgPVxuXHRcdFx0Y29tcGFueVNldHRpbmdzPy5jYWxsX2NvbnRyb2xfYXBwbGljYXRpb25faWQgfHxcblx0XHRcdFRFTE5ZWF9DT05GSUcuY29ubmVjdGlvbklkO1xuXHRcdGNvbnN0IGZyb21BZGRyZXNzID0gYXdhaXQgcmVzb2x2ZU91dGJvdW5kUGhvbmVOdW1iZXIoXG5cdFx0XHRzdXBhYmFzZSxcblx0XHRcdHBhcmFtcy5jb21wYW55SWQsXG5cdFx0XHRwYXJhbXMuZnJvbSxcblx0XHRcdGNvbXBhbnlTZXR0aW5ncz8uZGVmYXVsdF9vdXRib3VuZF9udW1iZXIgfHwgbnVsbCxcblx0XHQpO1xuXG5cdFx0aWYgKCFjb25uZWN0aW9uT3ZlcnJpZGUpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0XHRlcnJvcjogXCJObyBUZWxueXggY29ubmVjdGlvbiBjb25maWd1cmVkIGZvciB0aGlzIGNvbXBhbnkuXCIsXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGlmICghZnJvbUFkZHJlc3MpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0XHRlcnJvcjpcblx0XHRcdFx0XHRcIkNvbXBhbnkgZG9lcyBub3QgaGF2ZSBhIGRlZmF1bHQgb3V0Ym91bmQgcGhvbmUgbnVtYmVyIGNvbmZpZ3VyZWQuIFBsZWFzZSBwcm92aXNpb24gbnVtYmVycyBmaXJzdC5cIixcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Ly8gVEVNUDogU2tpcCBjb25uZWN0aW9uIHZlcmlmaWNhdGlvbiAtIExldmVsIDIgcmVxdWlyZWQgZm9yIEFQSSBhY2Nlc3Ncblx0XHQvLyBjb25zdCBjb25uZWN0aW9uU3RhdHVzID0gYXdhaXQgdmVyaWZ5Q29ubmVjdGlvbihjb25uZWN0aW9uT3ZlcnJpZGUpO1xuXHRcdC8vIGlmIChjb25uZWN0aW9uU3RhdHVzLm5lZWRzRml4KSB7XG5cdFx0Ly8gXHRyZXR1cm4ge1xuXHRcdC8vIFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHQvLyBcdFx0ZXJyb3I6IGBDb25uZWN0aW9uIGNvbmZpZ3VyYXRpb24gaXNzdWU6ICR7Y29ubmVjdGlvblN0YXR1cy5pc3N1ZXMuam9pbihcIiwgXCIpfS4gUnVuIGZpeENvbm5lY3Rpb24oKSB0byBhdXRvLWZpeC5gLFxuXHRcdC8vIFx0fTtcblx0XHQvLyB9XG5cblx0XHRjb25zdCB0b0FkZHJlc3MgPSBub3JtYWxpemVQaG9uZU51bWJlcihwYXJhbXMudG8pO1xuXG5cdFx0Ly8gVEVNUDogU2tpcCB2b2ljZSBjYXBhYmlsaXR5IGNoZWNrIC0gTGV2ZWwgMiByZXF1aXJlZCBmb3IgQVBJIGFjY2Vzc1xuXHRcdC8vIGNvbnN0IHZvaWNlQ2FwYWJpbGl0eSA9IGF3YWl0IHZlcmlmeVZvaWNlQ2FwYWJpbGl0eShmcm9tQWRkcmVzcyk7XG5cdFx0Ly8gaWYgKCF2b2ljZUNhcGFiaWxpdHkuaGFzVm9pY2UpIHtcblx0XHQvLyBcdHJldHVybiB7XG5cdFx0Ly8gXHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdC8vIFx0XHRlcnJvcjpcblx0XHQvLyBcdFx0XHR2b2ljZUNhcGFiaWxpdHkuZXJyb3IgfHwgXCJQaG9uZSBudW1iZXIgZG9lcyBub3Qgc3VwcG9ydCB2b2ljZSBjYWxsc1wiLFxuXHRcdC8vIFx0fTtcblx0XHQvLyB9XG5cblx0XHRjb25zdCB0ZWxueXhXZWJob29rVXJsID0gYXdhaXQgZ2V0VGVsbnl4V2ViaG9va1VybChwYXJhbXMuY29tcGFueUlkKTtcblx0XHRjb25zb2xlLmxvZyhcIvCflJcgV2ViaG9vayBVUkw6XCIsIHRlbG55eFdlYmhvb2tVcmwpO1xuXHRcdGlmICghdGVsbnl4V2ViaG9va1VybCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRcdGVycm9yOlxuXHRcdFx0XHRcdFwiU2l0ZSBVUkwgaXMgbm90IGNvbmZpZ3VyZWQuIFNldCBORVhUX1BVQkxJQ19TSVRFX1VSTCBvciBTSVRFX1VSTCB0byBhIHB1YmxpYyBodHRwcyBkb21haW4uXCIsXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGNvbnNvbGUubG9nKFwi8J+TpCBJbml0aWF0aW5nIGNhbGw6XCIsIHtcblx0XHRcdHRvOiB0b0FkZHJlc3MsXG5cdFx0XHRmcm9tOiBmcm9tQWRkcmVzcyxcblx0XHRcdGNvbm5lY3Rpb25JZDogY29ubmVjdGlvbk92ZXJyaWRlLFxuXHRcdFx0d2ViaG9va1VybDogdGVsbnl4V2ViaG9va1VybCxcblx0XHR9KTtcblxuXHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGluaXRpYXRlQ2FsbCh7XG5cdFx0XHR0bzogdG9BZGRyZXNzLFxuXHRcdFx0ZnJvbTogZnJvbUFkZHJlc3MsXG5cdFx0XHRjb25uZWN0aW9uSWQ6IGNvbm5lY3Rpb25PdmVycmlkZSxcblx0XHRcdHdlYmhvb2tVcmw6IHRlbG55eFdlYmhvb2tVcmwsXG5cdFx0XHRhbnN3ZXJpbmdNYWNoaW5lRGV0ZWN0aW9uOiBcInByZW1pdW1cIixcblx0XHR9KTtcblxuXHRcdGNvbnNvbGUubG9nKFwi8J+TpSBUZWxueXggQVBJIHJlc3BvbnNlOlwiLCByZXN1bHQpO1xuXG5cdFx0aWYgKCFyZXN1bHQuc3VjY2Vzcykge1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cblx0XHRjb25zdCBwaG9uZU51bWJlcklkID0gYXdhaXQgZ2V0UGhvbmVOdW1iZXJJZChzdXBhYmFzZSwgZnJvbUFkZHJlc3MpO1xuXHRcdGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImNvbW11bmljYXRpb25zXCIpXG5cdFx0XHQuaW5zZXJ0KHtcblx0XHRcdFx0Y29tcGFueV9pZDogY29tcGFueUlkLFxuXHRcdFx0XHRjdXN0b21lcl9pZDogcGFyYW1zLmN1c3RvbWVySWQsXG5cdFx0XHRcdGpvYl9pZDogcGFyYW1zLmpvYklkID8/IG51bGwsXG5cdFx0XHRcdHByb3BlcnR5X2lkOiBwYXJhbXMucHJvcGVydHlJZCA/PyBudWxsLFxuXHRcdFx0XHRpbnZvaWNlX2lkOiBwYXJhbXMuaW52b2ljZUlkID8/IG51bGwsXG5cdFx0XHRcdGVzdGltYXRlX2lkOiBwYXJhbXMuZXN0aW1hdGVJZCA/PyBudWxsLFxuXHRcdFx0XHR0eXBlOiBcInBob25lXCIsXG5cdFx0XHRcdGNoYW5uZWw6IFwidGVsbnl4XCIsXG5cdFx0XHRcdGRpcmVjdGlvbjogXCJvdXRib3VuZFwiLFxuXHRcdFx0XHRmcm9tX2FkZHJlc3M6IGZyb21BZGRyZXNzLFxuXHRcdFx0XHR0b19hZGRyZXNzOiB0b0FkZHJlc3MsXG5cdFx0XHRcdGJvZHk6IFwiXCIsXG5cdFx0XHRcdHN0YXR1czogXCJxdWV1ZWRcIixcblx0XHRcdFx0cHJpb3JpdHk6IFwibm9ybWFsXCIsXG5cdFx0XHRcdHBob25lX251bWJlcl9pZDogcGhvbmVOdW1iZXJJZCxcblx0XHRcdFx0aXNfYXJjaGl2ZWQ6IGZhbHNlLFxuXHRcdFx0XHRpc19hdXRvbWF0ZWQ6IGZhbHNlLFxuXHRcdFx0XHRpc19pbnRlcm5hbDogZmFsc2UsXG5cdFx0XHRcdGlzX3RocmVhZF9zdGFydGVyOiB0cnVlLFxuXHRcdFx0XHR0ZWxueXhfY2FsbF9jb250cm9sX2lkOiByZXN1bHQuY2FsbENvbnRyb2xJZCxcblx0XHRcdFx0dGVsbnl4X2NhbGxfc2Vzc2lvbl9pZDogcmVzdWx0LmNhbGxTZXNzaW9uSWQsXG5cdFx0XHR9KVxuXHRcdFx0LnNlbGVjdCgpXG5cdFx0XHQuc2luZ2xlKCk7XG5cblx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblxuXHRcdGNvbnNvbGUubG9nKFwi4pyFIENhbGwgY3JlYXRlZCBzdWNjZXNzZnVsbHk6XCIsIHtcblx0XHRcdGNhbGxDb250cm9sSWQ6IHJlc3VsdC5jYWxsQ29udHJvbElkLFxuXHRcdFx0Y29tbXVuaWNhdGlvbklkOiBkYXRhLmlkLFxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IHRydWUsXG5cdFx0XHRjYWxsQ29udHJvbElkOiByZXN1bHQuY2FsbENvbnRyb2xJZCxcblx0XHRcdGRhdGEsXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRjb25zb2xlLmVycm9yKFwi4p2MIG1ha2VDYWxsIGVycm9yOlwiLCBlcnJvcik7XG5cdFx0Y29uc29sZS5lcnJvcihcIkVycm9yIGRldGFpbHM6XCIsIHtcblx0XHRcdG1lc3NhZ2U6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSxcblx0XHRcdHN0YWNrOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3Iuc3RhY2sgOiB1bmRlZmluZWQsXG5cdFx0fSk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJGYWlsZWQgdG8gbWFrZSBjYWxsXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIEFuc3dlciBhbiBpbmNvbWluZyBjYWxsXG4vKipcbiAqIEFuc3dlciBhbiBpbmNvbWluZyBjYWxsXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGFjY2VwdENhbGwoY2FsbENvbnRyb2xJZDogc3RyaW5nKSB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgdGVsbnl4V2ViaG9va1VybCA9IGF3YWl0IGdldFRlbG55eFdlYmhvb2tVcmwoKTtcblx0XHRpZiAoIXRlbG55eFdlYmhvb2tVcmwpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0XHRlcnJvcjpcblx0XHRcdFx0XHRcIlNpdGUgVVJMIGlzIG5vdCBjb25maWd1cmVkLiBTZXQgTkVYVF9QVUJMSUNfU0lURV9VUkwgb3IgU0lURV9VUkwgdG8gYSBwdWJsaWMgaHR0cHMgZG9tYWluLlwiLFxuXHRcdFx0fTtcblx0XHR9XG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgYW5zd2VyQ2FsbCh7XG5cdFx0XHRjYWxsQ29udHJvbElkLFxuXHRcdFx0d2ViaG9va1VybDogdGVsbnl4V2ViaG9va1VybCxcblx0XHR9KTtcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJGYWlsZWQgdG8gYW5zd2VyIGNhbGxcIixcblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogUmVqZWN0IGFuIGluY29taW5nIGNhbGxcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZGVjbGluZUNhbGwoY2FsbENvbnRyb2xJZDogc3RyaW5nKSB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgcmVqZWN0Q2FsbCh7XG5cdFx0XHRjYWxsQ29udHJvbElkLFxuXHRcdFx0Y2F1c2U6IFwiQ0FMTF9SRUpFQ1RFRFwiLFxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBcIkZhaWxlZCB0byByZWplY3QgY2FsbFwiLFxuXHRcdH07XG5cdH1cbn1cblxuLyoqXG4gKiBFbmQgYW4gYWN0aXZlIGNhbGxcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZW5kQ2FsbChjYWxsQ29udHJvbElkOiBzdHJpbmcpIHtcblx0dHJ5IHtcblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBoYW5ndXBDYWxsKHsgY2FsbENvbnRyb2xJZCB9KTtcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJGYWlsZWQgdG8gZW5kIGNhbGxcIixcblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogU3RhcnQgcmVjb3JkaW5nIGEgY2FsbFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RhcnRDYWxsUmVjb3JkaW5nKGNhbGxDb250cm9sSWQ6IHN0cmluZykge1xuXHR0cnkge1xuXHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IHN0YXJ0UmVjb3JkaW5nKHtcblx0XHRcdGNhbGxDb250cm9sSWQsXG5cdFx0XHRmb3JtYXQ6IFwibXAzXCIsXG5cdFx0XHRjaGFubmVsczogXCJzaW5nbGVcIixcblx0XHR9KTtcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJGYWlsZWQgdG8gc3RhcnQgcmVjb3JkaW5nXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIFN0b3AgcmVjb3JkaW5nIGEgY2FsbFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc3RvcENhbGxSZWNvcmRpbmcoY2FsbENvbnRyb2xJZDogc3RyaW5nKSB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgc3RvcFJlY29yZGluZyh7IGNhbGxDb250cm9sSWQgfSk7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdGVycm9yOlxuXHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFwiRmFpbGVkIHRvIHN0b3AgcmVjb3JkaW5nXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIFRyYW5zZmVyIGFuIGFjdGl2ZSBjYWxsIHRvIGFub3RoZXIgbnVtYmVyXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0cmFuc2ZlckFjdGl2ZUNhbGwocGFyYW1zOiB7XG5cdGNhbGxDb250cm9sSWQ6IHN0cmluZztcblx0dG86IHN0cmluZztcblx0ZnJvbTogc3RyaW5nO1xufSkge1xuXHR0cnkge1xuXHRcdGNvbnN0IHsgdHJhbnNmZXJDYWxsIH0gPSBhd2FpdCBpbXBvcnQoXCJAL2xpYi90ZWxueXgvY2FsbHNcIik7XG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgdHJhbnNmZXJDYWxsKHtcblx0XHRcdGNhbGxDb250cm9sSWQ6IHBhcmFtcy5jYWxsQ29udHJvbElkLFxuXHRcdFx0dG86IHBhcmFtcy50byxcblx0XHRcdGZyb206IHBhcmFtcy5mcm9tLFxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBcIkZhaWxlZCB0byB0cmFuc2ZlciBjYWxsXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIFRyYW5zY3JpYmUgYSBjYWxsIHJlY29yZGluZyB1c2luZyBBc3NlbWJseUFJXG4gKlxuICogU3VibWl0cyB0aGUgcmVjb3JkaW5nIFVSTCB0byBBc3NlbWJseUFJIGZvciBwb3N0LWNhbGwgdHJhbnNjcmlwdGlvbi5cbiAqIEFzc2VtYmx5QUkgd2lsbCBwcm9jZXNzIHRoZSBhdWRpbyBhbmQgc2VuZCB0aGUgdHJhbnNjcmlwdCB2aWEgd2ViaG9vay5cbiAqXG4gKiBAcGFyYW0gcmVjb3JkaW5nVXJsIC0gVVJMIG9mIHRoZSBjYWxsIHJlY29yZGluZyAoZnJvbSBUZWxueXgpXG4gKiBAcGFyYW0gY29tbXVuaWNhdGlvbklkIC0gRGF0YWJhc2UgSUQgb2YgdGhlIGNvbW11bmljYXRpb24gcmVjb3JkXG4gKiBAcmV0dXJucyBTdWNjZXNzL2Vycm9yIHJlc3BvbnNlIHdpdGggdHJhbnNjcmlwdGlvbiBqb2IgSURcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRyYW5zY3JpYmVDYWxsUmVjb3JkaW5nKHBhcmFtczoge1xuXHRyZWNvcmRpbmdVcmw6IHN0cmluZztcblx0Y29tbXVuaWNhdGlvbklkOiBzdHJpbmc7XG59KSB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgeyBzdWJtaXRUcmFuc2NyaXB0aW9uIH0gPSBhd2FpdCBpbXBvcnQoXCJAL2xpYi9hc3NlbWJseWFpL2NsaWVudFwiKTtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHRjb25zdCB3ZWJob29rVXJsID0gYXdhaXQgYnVpbGRBYnNvbHV0ZVVybChcIi9hcGkvd2ViaG9va3MvYXNzZW1ibHlhaVwiKTtcblx0XHRpZiAoIXdlYmhvb2tVcmwpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0XHRlcnJvcjpcblx0XHRcdFx0XHRcIlNpdGUgVVJMIGlzIG5vdCBjb25maWd1cmVkLiBTZXQgTkVYVF9QVUJMSUNfU0lURV9VUkwgb3IgU0lURV9VUkwuXCIsXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vIFN1Ym1pdCB0byBBc3NlbWJseUFJXG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgc3VibWl0VHJhbnNjcmlwdGlvbih7XG5cdFx0XHRhdWRpb191cmw6IHBhcmFtcy5yZWNvcmRpbmdVcmwsXG5cdFx0XHRzcGVha2VyX2xhYmVsczogdHJ1ZSwgLy8gRW5hYmxlIHNwZWFrZXIgZGlhcml6YXRpb25cblx0XHRcdHdlYmhvb2tfdXJsOiB3ZWJob29rVXJsLFxuXHRcdH0pO1xuXG5cdFx0aWYgKCEocmVzdWx0LnN1Y2Nlc3MgJiYgcmVzdWx0LmRhdGEpKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6IHJlc3VsdC5lcnJvciB8fCBcIkZhaWxlZCB0byBzdWJtaXQgdHJhbnNjcmlwdGlvblwiLFxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHQvLyBTdG9yZSB0cmFuc2NyaXB0aW9uIGpvYiBJRCBpbiBkYXRhYmFzZVxuXHRcdGF3YWl0IG1lcmdlUHJvdmlkZXJNZXRhZGF0YShzdXBhYmFzZSwgcGFyYW1zLmNvbW11bmljYXRpb25JZCwge1xuXHRcdFx0YXNzZW1ibHlhaV90cmFuc2NyaXB0aW9uX2lkOiByZXN1bHQuZGF0YS5pZCxcblx0XHRcdGFzc2VtYmx5YWlfc3RhdHVzOiByZXN1bHQuZGF0YS5zdGF0dXMsXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogdHJ1ZSxcblx0XHRcdHRyYW5zY3JpcHRpb25JZDogcmVzdWx0LmRhdGEuaWQsXG5cdFx0XHRzdGF0dXM6IHJlc3VsdC5kYXRhLnN0YXR1cyxcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdGVycm9yOlxuXHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yXG5cdFx0XHRcdFx0PyBlcnJvci5tZXNzYWdlXG5cdFx0XHRcdFx0OiBcIkZhaWxlZCB0byB0cmFuc2NyaWJlIHJlY29yZGluZ1wiLFxuXHRcdH07XG5cdH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU01TIE9QRVJBVElPTlMgQUNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIFNlbmQgYW4gU01TIG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRUZXh0TWVzc2FnZShwYXJhbXM6IHtcblx0dG86IHN0cmluZztcblx0ZnJvbTogc3RyaW5nO1xuXHR0ZXh0OiBzdHJpbmc7XG5cdGNvbXBhbnlJZD86IHN0cmluZzsgLy8gT3B0aW9uYWwgLSB3aWxsIGJlIGZldGNoZWQgaWYgbm90IHByb3ZpZGVkXG5cdGN1c3RvbWVySWQ/OiBzdHJpbmc7XG5cdGpvYklkPzogc3RyaW5nO1xuXHRpbnZvaWNlSWQ/OiBzdHJpbmc7XG5cdGVzdGltYXRlSWQ/OiBzdHJpbmc7XG59KSB7XG5cdHRyeSB7XG5cdFx0Y29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcblx0XHRpZiAoIXN1cGFiYXNlKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwi4p2MIFN1cGFiYXNlIGNsaWVudCB1bmF2YWlsYWJsZVwiKTtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHQvLyBHZXQgY29tcGFueSBJRCBpZiBub3QgcHJvdmlkZWRcblx0XHRsZXQgY29tcGFueUlkID0gcGFyYW1zLmNvbXBhbnlJZDtcblx0XHRpZiAoIWNvbXBhbnlJZCkge1xuXHRcdFx0Y29uc3QgeyBnZXRBY3RpdmVDb21wYW55SWQgfSA9IGF3YWl0IGltcG9ydChcIkAvbGliL2F1dGgvY29tcGFueS1jb250ZXh0XCIpO1xuXHRcdFx0Y29tcGFueUlkID0gYXdhaXQgZ2V0QWN0aXZlQ29tcGFueUlkKCk7XG5cdFx0XHRpZiAoIWNvbXBhbnlJZCkge1xuXHRcdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiTm8gYWN0aXZlIGNvbXBhbnkgZm91bmRcIiB9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnNvbGUubG9nKFwi8J+TsSBTTVMgU2VuZCBSZXF1ZXN0OlwiLCB7XG5cdFx0XHR0bzogcGFyYW1zLnRvLFxuXHRcdFx0ZnJvbTogcGFyYW1zLmZyb20sXG5cdFx0XHRjb21wYW55SWQsXG5cdFx0fSk7XG5cblx0XHRjb25zdCBjb21wYW55U2V0dGluZ3MgPSBhd2FpdCBnZXRDb21wYW55VGVsbnl4U2V0dGluZ3MoXG5cdFx0XHRzdXBhYmFzZSxcblx0XHRcdGNvbXBhbnlJZCxcblx0XHQpO1xuXHRcdGlmICghY29tcGFueVNldHRpbmdzKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwi4p2MIENvbXBhbnkgc2V0dGluZ3Mgbm90IGZvdW5kXCIpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRcdGVycm9yOlxuXHRcdFx0XHRcdFwiVW5hYmxlIHRvIHByb3Zpc2lvbiBUZWxueXggcmVzb3VyY2VzIGZvciB0aGlzIGNvbXBhbnkuIFBsZWFzZSB2ZXJpZnkgdGhlIGNvbXBhbnkncyBvbmJvYXJkaW5nIGlzIGNvbXBsZXRlIGFuZCB0cnkgYWdhaW4uXCIsXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRjb25zb2xlLmxvZyhcIuKchSBDb21wYW55IHNldHRpbmdzIGxvYWRlZDpcIiwge1xuXHRcdFx0bWVzc2FnaW5nUHJvZmlsZUlkOiBjb21wYW55U2V0dGluZ3MubWVzc2FnaW5nX3Byb2ZpbGVfaWQsXG5cdFx0XHRkZWZhdWx0TnVtYmVyOiBjb21wYW55U2V0dGluZ3MuZGVmYXVsdF9vdXRib3VuZF9udW1iZXIsXG5cdFx0fSk7XG5cblx0XHRhd2FpdCBlbnN1cmVQaG9uZU51bWJlclJlY29yZEV4aXN0cyhcblx0XHRcdHN1cGFiYXNlLFxuXHRcdFx0Y29tcGFueUlkLFxuXHRcdFx0Y29tcGFueVNldHRpbmdzLmRlZmF1bHRfb3V0Ym91bmRfbnVtYmVyLFxuXHRcdCk7XG5cblx0XHRjb25zdCBzbXNDb25maWcgPSBhd2FpdCB2YWxpZGF0ZVNtc0NvbmZpZygpO1xuXHRcdGlmICghc21zQ29uZmlnLnZhbGlkICYmICFjb21wYW55U2V0dGluZ3M/Lm1lc3NhZ2luZ19wcm9maWxlX2lkKSB7XG5cdFx0XHRsZXQgZXJyb3JNZXNzYWdlID0gc21zQ29uZmlnLmVycm9yIHx8IFwiU01TIGNvbmZpZ3VyYXRpb24gaXMgaW52YWxpZFwiO1xuXHRcdFx0aWYgKHNtc0NvbmZpZy5zdWdnZXN0ZWRQcm9maWxlSWQpIHtcblx0XHRcdFx0ZXJyb3JNZXNzYWdlICs9IGAgRm91bmQgbWVzc2FnaW5nIHByb2ZpbGUgXCIke3Ntc0NvbmZpZy5zdWdnZXN0ZWRQcm9maWxlSWR9XCIgaW4geW91ciBUZWxueXggYWNjb3VudC4gU2V0IFRFTE5ZWF9ERUZBVUxUX01FU1NBR0lOR19QUk9GSUxFX0lEPSR7c21zQ29uZmlnLnN1Z2dlc3RlZFByb2ZpbGVJZH0gb3IgcHJvdmlzaW9uIGNvbXBhbnktc3BlY2lmaWMgc2V0dGluZ3MuYDtcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUuZXJyb3IoXCLinYwgU01TIGNvbmZpZyBpbnZhbGlkOlwiLCBlcnJvck1lc3NhZ2UpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRcdGVycm9yOiBlcnJvck1lc3NhZ2UsXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRjb25zb2xlLmxvZyhcIuKchSBTTVMgY29uZmlnIHZhbGlkXCIpO1xuXG5cdFx0Y29uc3QgbWVzc2FnaW5nUHJvZmlsZUlkID1cblx0XHRcdGNvbXBhbnlTZXR0aW5ncz8ubWVzc2FnaW5nX3Byb2ZpbGVfaWQgfHwgREVGQVVMVF9NRVNTQUdJTkdfUFJPRklMRV9JRDtcblx0XHRpZiAoIW1lc3NhZ2luZ1Byb2ZpbGVJZCkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihcIuKdjCBObyBtZXNzYWdpbmcgcHJvZmlsZSBJRFwiKTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0XHRlcnJvcjpcblx0XHRcdFx0XHRcIk1lc3NhZ2luZyBwcm9maWxlIGlzIG5vdCBjb25maWd1cmVkIGZvciB0aGlzIGNvbXBhbnkuIFBsZWFzZSBwcm92aXNpb24gY29tbXVuaWNhdGlvbnMgYmVmb3JlIHNlbmRpbmcgU01TLlwiLFxuXHRcdFx0fTtcblx0XHR9XG5cdFx0Y29uc29sZS5sb2coXCLinIUgVXNpbmcgbWVzc2FnaW5nIHByb2ZpbGU6XCIsIG1lc3NhZ2luZ1Byb2ZpbGVJZCk7XG5cblx0XHRpZiAobWVzc2FnaW5nUHJvZmlsZUlkKSB7XG5cdFx0XHRjb25zdCBtZXNzYWdpbmdQcm9maWxlU3RhdHVzID1cblx0XHRcdFx0YXdhaXQgdmVyaWZ5TWVzc2FnaW5nUHJvZmlsZShtZXNzYWdpbmdQcm9maWxlSWQpO1xuXHRcdFx0aWYgKG1lc3NhZ2luZ1Byb2ZpbGVTdGF0dXMubmVlZHNGaXgpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcblx0XHRcdFx0XHRcIuKdjCBNZXNzYWdpbmcgcHJvZmlsZSBuZWVkcyBmaXg6XCIsXG5cdFx0XHRcdFx0bWVzc2FnaW5nUHJvZmlsZVN0YXR1cy5pc3N1ZXMsXG5cdFx0XHRcdCk7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRcdFx0ZXJyb3I6IGBNZXNzYWdpbmcgcHJvZmlsZSBjb25maWd1cmF0aW9uIGlzc3VlOiAke21lc3NhZ2luZ1Byb2ZpbGVTdGF0dXMuaXNzdWVzLmpvaW4oXCIsIFwiKX0uIFJ1biBmaXhNZXNzYWdpbmdQcm9maWxlKCkgb3IgcmVwcm92aXNpb24gdGhlIGNvbXBhbnkuYCxcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUubG9nKFwi4pyFIE1lc3NhZ2luZyBwcm9maWxlIHZlcmlmaWVkXCIpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGZyb21BZGRyZXNzID0gYXdhaXQgcmVzb2x2ZU91dGJvdW5kUGhvbmVOdW1iZXIoXG5cdFx0XHRzdXBhYmFzZSxcblx0XHRcdGNvbXBhbnlJZCxcblx0XHRcdHBhcmFtcy5mcm9tLFxuXHRcdFx0Y29tcGFueVNldHRpbmdzLmRlZmF1bHRfb3V0Ym91bmRfbnVtYmVyLFxuXHRcdCk7XG5cdFx0aWYgKCFmcm9tQWRkcmVzcykge1xuXHRcdFx0Y29uc29sZS5lcnJvcihcIuKdjCBObyBmcm9tIG51bWJlciBhdmFpbGFibGVcIik7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6XG5cdFx0XHRcdFx0XCJDb21wYW55IGRvZXMgbm90IGhhdmUgYSBkZWZhdWx0IG91dGJvdW5kIHBob25lIG51bWJlciBjb25maWd1cmVkLiBQbGVhc2UgcHJvdmlzaW9uIG51bWJlcnMgZmlyc3QuXCIsXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRjb25zdCB0b0FkZHJlc3MgPSBub3JtYWxpemVQaG9uZU51bWJlcihwYXJhbXMudG8pO1xuXHRcdGNvbnNvbGUubG9nKFwi4pyFIFBob25lIG51bWJlcnMgbm9ybWFsaXplZDpcIiwge1xuXHRcdFx0ZnJvbTogZnJvbUFkZHJlc3MsXG5cdFx0XHR0bzogdG9BZGRyZXNzLFxuXHRcdH0pO1xuXG5cdFx0Ly8gVmVyaWZ5IHBob25lIG51bWJlciBoYXMgU01TIGNhcGFiaWxpdHlcblx0XHRjb25zb2xlLmxvZyhcIvCflI0gVmVyaWZ5aW5nIFNNUyBjYXBhYmlsaXR5IGZvcjpcIiwgZnJvbUFkZHJlc3MpO1xuXHRcdGNvbnN0IHNtc0NhcGFiaWxpdHkgPSBhd2FpdCB2ZXJpZnlTbXNDYXBhYmlsaXR5KGZyb21BZGRyZXNzKTtcblx0XHRpZiAoIXNtc0NhcGFiaWxpdHkuaGFzU21zKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwi4p2MIFNNUyBjYXBhYmlsaXR5IGNoZWNrIGZhaWxlZDpcIiwgc21zQ2FwYWJpbGl0eS5lcnJvcik7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6IHNtc0NhcGFiaWxpdHkuZXJyb3IgfHwgXCJQaG9uZSBudW1iZXIgZG9lcyBub3Qgc3VwcG9ydCBTTVNcIixcblx0XHRcdH07XG5cdFx0fVxuXHRcdGNvbnNvbGUubG9nKFwi4pyFIFNNUyBjYXBhYmlsaXR5IHZlcmlmaWVkXCIpO1xuXG5cdFx0Y29uc3Qgd2ViaG9va1VybCA9IGF3YWl0IGdldFRlbG55eFdlYmhvb2tVcmwoY29tcGFueUlkKTtcblx0XHRpZiAoIXdlYmhvb2tVcmwpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCLinYwgTm8gd2ViaG9vayBVUkxcIik7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6XG5cdFx0XHRcdFx0XCJTaXRlIFVSTCBpcyBub3QgY29uZmlndXJlZC4gU2V0IE5FWFRfUFVCTElDX1NJVEVfVVJMIG9yIFNJVEVfVVJMIHRvIGEgcHVibGljIGh0dHBzIGRvbWFpbi5cIixcblx0XHRcdH07XG5cdFx0fVxuXHRcdGNvbnNvbGUubG9nKFwi4pyFIFdlYmhvb2sgVVJMOlwiLCB3ZWJob29rVXJsKTtcblxuXHRcdC8vIFNlbmQgU01TIHZpYSBUZWxueXhcblx0XHRjb25zb2xlLmxvZyhcIvCfk6QgU2VuZGluZyBTTVMgdmlhIFRlbG55eCBBUEkuLi5cIik7XG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgc2VuZFNNUyh7XG5cdFx0XHR0bzogdG9BZGRyZXNzLFxuXHRcdFx0ZnJvbTogZnJvbUFkZHJlc3MsXG5cdFx0XHR0ZXh0OiBwYXJhbXMudGV4dCxcblx0XHRcdHdlYmhvb2tVcmwsXG5cdFx0XHRtZXNzYWdpbmdQcm9maWxlSWQsXG5cdFx0fSk7XG5cblx0XHRpZiAoIXJlc3VsdC5zdWNjZXNzKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwi4p2MIFRlbG55eCBBUEkgZmFpbGVkOlwiLCByZXN1bHQuZXJyb3IpO1xuXG5cdFx0XHQvLyBDaGVjayBpZiBlcnJvciBpcyAxMERMQyByZWdpc3RyYXRpb24gcmVxdWlyZWRcblx0XHRcdGlmIChcblx0XHRcdFx0cmVzdWx0LmVycm9yICYmXG5cdFx0XHRcdChyZXN1bHQuZXJyb3IuaW5jbHVkZXMoXCIxMERMQ1wiKSB8fFxuXHRcdFx0XHRcdHJlc3VsdC5lcnJvci5pbmNsdWRlcyhcIk5vdCAxMERMQyByZWdpc3RlcmVkXCIpIHx8XG5cdFx0XHRcdFx0cmVzdWx0LmVycm9yLmluY2x1ZGVzKFwiQTJQXCIpKVxuXHRcdFx0KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0XHRcdFwi8J+UhCBEZXRlY3RlZCAxMERMQyByZWdpc3RyYXRpb24gcmVxdWlyZWQsIGF0dGVtcHRpbmcgYXV0by1yZWdpc3RyYXRpb24uLi5cIixcblx0XHRcdFx0KTtcblxuXHRcdFx0XHQvLyBJbXBvcnQgMTBETEMgcmVnaXN0cmF0aW9uIGZ1bmN0aW9uXG5cdFx0XHRcdGNvbnN0IHsgcmVnaXN0ZXJDb21wYW55Rm9yMTBETEMgfSA9IGF3YWl0IGltcG9ydChcblx0XHRcdFx0XHRcIkAvYWN0aW9ucy90ZW4tZGxjLXJlZ2lzdHJhdGlvblwiXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Y29uc3QgcmVnaXN0cmF0aW9uUmVzdWx0ID0gYXdhaXQgcmVnaXN0ZXJDb21wYW55Rm9yMTBETEMoXG5cdFx0XHRcdFx0Y29tcGFueUlkLFxuXHRcdFx0XHQpO1xuXG5cdFx0XHRcdGlmIChyZWdpc3RyYXRpb25SZXN1bHQuc3VjY2Vzcykge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwi4pyFIDEwRExDIHJlZ2lzdHJhdGlvbiBzdWNjZXNzZnVsLCByZXRyeWluZyBTTVMgc2VuZC4uLlwiKTtcblxuXHRcdFx0XHRcdC8vIFJldHJ5IHRoZSBTTVMgc2VuZCBub3cgdGhhdCAxMERMQyBpcyByZWdpc3RlcmVkXG5cdFx0XHRcdFx0Y29uc3QgcmV0cnlSZXN1bHQgPSBhd2FpdCBzZW5kU01TKHtcblx0XHRcdFx0XHRcdHRvOiB0b0FkZHJlc3MsXG5cdFx0XHRcdFx0XHRmcm9tOiBmcm9tQWRkcmVzcyxcblx0XHRcdFx0XHRcdHRleHQ6IHBhcmFtcy50ZXh0LFxuXHRcdFx0XHRcdFx0d2ViaG9va1VybCxcblx0XHRcdFx0XHRcdG1lc3NhZ2luZ1Byb2ZpbGVJZCxcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGlmICghcmV0cnlSZXN1bHQuc3VjY2Vzcykge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdGVycm9yOiBgMTBETEMgcmVnaXN0cmF0aW9uIGNvbXBsZXRlZCBidXQgU01TIHN0aWxsIGZhaWxlZDogJHtyZXRyeVJlc3VsdC5lcnJvcn0uIFRoZSBjYW1wYWlnbiBtYXkgbmVlZCBhZGRpdGlvbmFsIGFwcHJvdmFsIHRpbWUuYCxcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHJlc3VsdCB3aXRoIHJldHJ5IHN1Y2Nlc3Ncblx0XHRcdFx0XHRyZXN1bHQuc3VjY2VzcyA9IHRydWU7XG5cdFx0XHRcdFx0cmVzdWx0Lm1lc3NhZ2VJZCA9IHJldHJ5UmVzdWx0Lm1lc3NhZ2VJZDtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIuKchSBTTVMgcmV0cnkgc3VjY2Vzc2Z1bCBhZnRlciAxMERMQyByZWdpc3RyYXRpb25cIik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0XHRcdFx0ZXJyb3I6IGAxMERMQyByZWdpc3RyYXRpb24gZmFpbGVkOiAke3JlZ2lzdHJhdGlvblJlc3VsdC5lcnJvcn0uIE9yaWdpbmFsIGVycm9yOiAke3Jlc3VsdC5lcnJvcn1gLFxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNvbnNvbGUubG9nKFwi4pyFIFRlbG55eCBBUEkgc3VjY2VzczpcIiwgcmVzdWx0Lm1lc3NhZ2VJZCk7XG5cblx0XHQvLyBDcmVhdGUgY29tbXVuaWNhdGlvbiByZWNvcmRcblx0XHRjb25zb2xlLmxvZyhcIvCfkr4gQ3JlYXRpbmcgY29tbXVuaWNhdGlvbiByZWNvcmQgaW4gZGF0YWJhc2UuLi5cIik7XG5cdFx0Y29uc3QgcGhvbmVOdW1iZXJJZCA9IGF3YWl0IGdldFBob25lTnVtYmVySWQoc3VwYWJhc2UsIGZyb21BZGRyZXNzKTtcblx0XHRjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJjb21tdW5pY2F0aW9uc1wiKVxuXHRcdFx0Lmluc2VydCh7XG5cdFx0XHRcdGNvbXBhbnlfaWQ6IGNvbXBhbnlJZCxcblx0XHRcdFx0Y3VzdG9tZXJfaWQ6IHBhcmFtcy5jdXN0b21lcklkLFxuXHRcdFx0XHRqb2JfaWQ6IHBhcmFtcy5qb2JJZCA/PyBudWxsLFxuXHRcdFx0XHRpbnZvaWNlX2lkOiBwYXJhbXMuaW52b2ljZUlkID8/IG51bGwsXG5cdFx0XHRcdGVzdGltYXRlX2lkOiBwYXJhbXMuZXN0aW1hdGVJZCA/PyBudWxsLFxuXHRcdFx0XHR0eXBlOiBcInNtc1wiLFxuXHRcdFx0XHRjaGFubmVsOiBcInRlbG55eFwiLFxuXHRcdFx0XHRkaXJlY3Rpb246IFwib3V0Ym91bmRcIixcblx0XHRcdFx0ZnJvbV9hZGRyZXNzOiBmcm9tQWRkcmVzcyxcblx0XHRcdFx0dG9fYWRkcmVzczogdG9BZGRyZXNzLFxuXHRcdFx0XHRib2R5OiBwYXJhbXMudGV4dCxcblx0XHRcdFx0c3RhdHVzOiBcInF1ZXVlZFwiLFxuXHRcdFx0XHRwcmlvcml0eTogXCJub3JtYWxcIixcblx0XHRcdFx0cGhvbmVfbnVtYmVyX2lkOiBwaG9uZU51bWJlcklkLFxuXHRcdFx0XHRpc19hcmNoaXZlZDogZmFsc2UsXG5cdFx0XHRcdGlzX2F1dG9tYXRlZDogZmFsc2UsXG5cdFx0XHRcdGlzX2ludGVybmFsOiBmYWxzZSxcblx0XHRcdFx0aXNfdGhyZWFkX3N0YXJ0ZXI6IHRydWUsXG5cdFx0XHRcdHRlbG55eF9tZXNzYWdlX2lkOiByZXN1bHQubWVzc2FnZUlkLFxuXHRcdFx0fSlcblx0XHRcdC5zZWxlY3QoKVxuXHRcdFx0LnNpbmdsZSgpO1xuXG5cdFx0aWYgKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cblx0XHRyZXZhbGlkYXRlUGF0aChcIi9kYXNoYm9hcmQvY29tbXVuaWNhdGlvblwiKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0bWVzc2FnZUlkOiByZXN1bHQubWVzc2FnZUlkLFxuXHRcdFx0ZGF0YSxcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJTTVMgc2VuZCBlcnJvcjpcIiwgZXJyb3IpO1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJFcnJvciBkZXRhaWxzOlwiLCB7XG5cdFx0XHRtZXNzYWdlOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvciksXG5cdFx0XHRzdGFjazogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLnN0YWNrIDogdW5kZWZpbmVkLFxuXHRcdFx0dHlwZTogdHlwZW9mIGVycm9yLFxuXHRcdFx0c3RyaW5naWZpZWQ6IEpTT04uc3RyaW5naWZ5KGVycm9yLCBudWxsLCAyKSxcblx0XHR9KTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRlcnJvcjpcblx0XHRcdFx0ZXJyb3IgaW5zdGFuY2VvZiBFcnJvclxuXHRcdFx0XHRcdD8gZXJyb3IubWVzc2FnZVxuXHRcdFx0XHRcdDogYEZhaWxlZCB0byBzZW5kIFNNUzogJHtTdHJpbmcoZXJyb3IpfWAsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIFNlbmQgYW4gTU1TIG1lc3NhZ2Ugd2l0aCBtZWRpYVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZE1NU01lc3NhZ2UocGFyYW1zOiB7XG5cdHRvOiBzdHJpbmc7XG5cdGZyb206IHN0cmluZztcblx0dGV4dD86IHN0cmluZztcblx0bWVkaWFVcmxzOiBzdHJpbmdbXTtcblx0Y29tcGFueUlkPzogc3RyaW5nOyAvLyBPcHRpb25hbCAtIHdpbGwgYmUgZmV0Y2hlZCBpZiBub3QgcHJvdmlkZWRcblx0Y3VzdG9tZXJJZD86IHN0cmluZztcblx0am9iSWQ/OiBzdHJpbmc7XG5cdHByb3BlcnR5SWQ/OiBzdHJpbmc7XG5cdGludm9pY2VJZD86IHN0cmluZztcblx0ZXN0aW1hdGVJZD86IHN0cmluZztcbn0pIHtcblx0dHJ5IHtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHQvLyBHZXQgY29tcGFueSBJRCBpZiBub3QgcHJvdmlkZWRcblx0XHRsZXQgY29tcGFueUlkID0gcGFyYW1zLmNvbXBhbnlJZDtcblx0XHRpZiAoIWNvbXBhbnlJZCkge1xuXHRcdFx0Y29uc3QgeyBnZXRBY3RpdmVDb21wYW55SWQgfSA9IGF3YWl0IGltcG9ydChcIkAvbGliL2F1dGgvY29tcGFueS1jb250ZXh0XCIpO1xuXHRcdFx0Y29tcGFueUlkID0gYXdhaXQgZ2V0QWN0aXZlQ29tcGFueUlkKCk7XG5cdFx0XHRpZiAoIWNvbXBhbnlJZCkge1xuXHRcdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiTm8gYWN0aXZlIGNvbXBhbnkgZm91bmRcIiB9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnN0IGNvbXBhbnlTZXR0aW5ncyA9IGF3YWl0IGdldENvbXBhbnlUZWxueXhTZXR0aW5ncyhcblx0XHRcdHN1cGFiYXNlLFxuXHRcdFx0Y29tcGFueUlkLFxuXHRcdCk7XG5cdFx0aWYgKCFjb21wYW55U2V0dGluZ3MpIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0XHRlcnJvcjpcblx0XHRcdFx0XHRcIlVuYWJsZSB0byBwcm92aXNpb24gVGVsbnl4IHJlc291cmNlcyBmb3IgdGhpcyBjb21wYW55LiBQbGVhc2UgdmVyaWZ5IG9uYm9hcmRpbmcgaXMgY29tcGxldGUuXCIsXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdGF3YWl0IGVuc3VyZVBob25lTnVtYmVyUmVjb3JkRXhpc3RzKFxuXHRcdFx0c3VwYWJhc2UsXG5cdFx0XHRjb21wYW55SWQsXG5cdFx0XHRjb21wYW55U2V0dGluZ3MuZGVmYXVsdF9vdXRib3VuZF9udW1iZXIsXG5cdFx0KTtcblxuXHRcdGNvbnN0IHNtc0NvbmZpZyA9IGF3YWl0IHZhbGlkYXRlU21zQ29uZmlnKCk7XG5cdFx0aWYgKCFzbXNDb25maWcudmFsaWQgJiYgIWNvbXBhbnlTZXR0aW5ncy5tZXNzYWdpbmdfcHJvZmlsZV9pZCkge1xuXHRcdFx0bGV0IGVycm9yTWVzc2FnZSA9IHNtc0NvbmZpZy5lcnJvciB8fCBcIlNNUyBjb25maWd1cmF0aW9uIGlzIGludmFsaWRcIjtcblx0XHRcdGlmIChzbXNDb25maWcuc3VnZ2VzdGVkUHJvZmlsZUlkKSB7XG5cdFx0XHRcdGVycm9yTWVzc2FnZSArPSBgIEZvdW5kIG1lc3NhZ2luZyBwcm9maWxlIFwiJHtzbXNDb25maWcuc3VnZ2VzdGVkUHJvZmlsZUlkfVwiIGluIHlvdXIgVGVsbnl4IGFjY291bnQuIFNldCBURUxOWVhfREVGQVVMVF9NRVNTQUdJTkdfUFJPRklMRV9JRD0ke3Ntc0NvbmZpZy5zdWdnZXN0ZWRQcm9maWxlSWR9IG9yIHJlcHJvdmlzaW9uIHRoZSBjb21wYW55LmA7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6IGVycm9yTWVzc2FnZSxcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y29uc3QgbWVzc2FnaW5nUHJvZmlsZUlkID1cblx0XHRcdGNvbXBhbnlTZXR0aW5ncy5tZXNzYWdpbmdfcHJvZmlsZV9pZCB8fCBERUZBVUxUX01FU1NBR0lOR19QUk9GSUxFX0lEO1xuXHRcdGlmICghbWVzc2FnaW5nUHJvZmlsZUlkKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6XG5cdFx0XHRcdFx0XCJNZXNzYWdpbmcgcHJvZmlsZSBpcyBub3QgY29uZmlndXJlZCBmb3IgdGhpcyBjb21wYW55LiBQbGVhc2UgcHJvdmlzaW9uIGNvbW11bmljYXRpb25zIGJlZm9yZSBzZW5kaW5nIE1NUy5cIixcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y29uc3QgZnJvbUFkZHJlc3MgPSBhd2FpdCByZXNvbHZlT3V0Ym91bmRQaG9uZU51bWJlcihcblx0XHRcdHN1cGFiYXNlLFxuXHRcdFx0Y29tcGFueUlkLFxuXHRcdFx0cGFyYW1zLmZyb20sXG5cdFx0XHRjb21wYW55U2V0dGluZ3MuZGVmYXVsdF9vdXRib3VuZF9udW1iZXIsXG5cdFx0KTtcblx0XHRpZiAoIWZyb21BZGRyZXNzKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6XG5cdFx0XHRcdFx0XCJDb21wYW55IGRvZXMgbm90IGhhdmUgYSBkZWZhdWx0IG91dGJvdW5kIHBob25lIG51bWJlciBjb25maWd1cmVkLlwiLFxuXHRcdFx0fTtcblx0XHR9XG5cdFx0Y29uc3QgdG9BZGRyZXNzID0gbm9ybWFsaXplUGhvbmVOdW1iZXIocGFyYW1zLnRvKTtcblxuXHRcdGNvbnN0IHdlYmhvb2tVcmwgPSBhd2FpdCBnZXRUZWxueXhXZWJob29rVXJsKGNvbXBhbnlJZCk7XG5cdFx0aWYgKCF3ZWJob29rVXJsKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6XG5cdFx0XHRcdFx0XCJTaXRlIFVSTCBpcyBub3QgY29uZmlndXJlZC4gU2V0IE5FWFRfUFVCTElDX1NJVEVfVVJMIG9yIFNJVEVfVVJMIHRvIGEgcHVibGljIGh0dHBzIGRvbWFpbi5cIixcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKG1lc3NhZ2luZ1Byb2ZpbGVJZCkge1xuXHRcdFx0Y29uc3QgbWVzc2FnaW5nUHJvZmlsZVN0YXR1cyA9XG5cdFx0XHRcdGF3YWl0IHZlcmlmeU1lc3NhZ2luZ1Byb2ZpbGUobWVzc2FnaW5nUHJvZmlsZUlkKTtcblx0XHRcdGlmIChtZXNzYWdpbmdQcm9maWxlU3RhdHVzLm5lZWRzRml4KSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRcdFx0ZXJyb3I6IGBNZXNzYWdpbmcgcHJvZmlsZSBjb25maWd1cmF0aW9uIGlzc3VlOiAke21lc3NhZ2luZ1Byb2ZpbGVTdGF0dXMuaXNzdWVzLmpvaW4oXCIsIFwiKX0uIFJ1biBmaXhNZXNzYWdpbmdQcm9maWxlKCkgb3IgcmVwcm92aXNpb24gdGhlIGNvbXBhbnkuYCxcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRjb25zdCBzbXNDYXBhYmlsaXR5ID0gYXdhaXQgdmVyaWZ5U21zQ2FwYWJpbGl0eShmcm9tQWRkcmVzcyk7XG5cdFx0aWYgKCFzbXNDYXBhYmlsaXR5Lmhhc1Ntcykge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRcdGVycm9yOiBzbXNDYXBhYmlsaXR5LmVycm9yIHx8IFwiUGhvbmUgbnVtYmVyIGRvZXMgbm90IHN1cHBvcnQgU01TL01NU1wiLFxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBzZW5kTU1TKHtcblx0XHRcdHRvOiB0b0FkZHJlc3MsXG5cdFx0XHRmcm9tOiBmcm9tQWRkcmVzcyxcblx0XHRcdHRleHQ6IHBhcmFtcy50ZXh0LFxuXHRcdFx0bWVkaWFVcmxzOiBwYXJhbXMubWVkaWFVcmxzLFxuXHRcdFx0d2ViaG9va1VybCxcblx0XHRcdG1lc3NhZ2luZ1Byb2ZpbGVJZCxcblx0XHR9KTtcblxuXHRcdGlmICghcmVzdWx0LnN1Y2Nlc3MpIHtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcGhvbmVOdW1iZXJJZCA9IGF3YWl0IGdldFBob25lTnVtYmVySWQoc3VwYWJhc2UsIGZyb21BZGRyZXNzKTtcblx0XHRjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJjb21tdW5pY2F0aW9uc1wiKVxuXHRcdFx0Lmluc2VydCh7XG5cdFx0XHRcdGNvbXBhbnlfaWQ6IGNvbXBhbnlJZCxcblx0XHRcdFx0Y3VzdG9tZXJfaWQ6IHBhcmFtcy5jdXN0b21lcklkLFxuXHRcdFx0XHRqb2JfaWQ6IHBhcmFtcy5qb2JJZCA/PyBudWxsLFxuXHRcdFx0XHRwcm9wZXJ0eV9pZDogcGFyYW1zLnByb3BlcnR5SWQgPz8gbnVsbCxcblx0XHRcdFx0aW52b2ljZV9pZDogcGFyYW1zLmludm9pY2VJZCA/PyBudWxsLFxuXHRcdFx0XHRlc3RpbWF0ZV9pZDogcGFyYW1zLmVzdGltYXRlSWQgPz8gbnVsbCxcblx0XHRcdFx0dHlwZTogXCJzbXNcIixcblx0XHRcdFx0Y2hhbm5lbDogXCJ0ZWxueXhcIixcblx0XHRcdFx0ZGlyZWN0aW9uOiBcIm91dGJvdW5kXCIsXG5cdFx0XHRcdGZyb21fYWRkcmVzczogZnJvbUFkZHJlc3MsXG5cdFx0XHRcdHRvX2FkZHJlc3M6IHRvQWRkcmVzcyxcblx0XHRcdFx0Ym9keTogcGFyYW1zLnRleHQgfHwgXCJcIixcblx0XHRcdFx0YXR0YWNobWVudHM6IHBhcmFtcy5tZWRpYVVybHMubWFwKCh1cmwpID0+ICh7IHVybCwgdHlwZTogXCJpbWFnZVwiIH0pKSxcblx0XHRcdFx0YXR0YWNobWVudF9jb3VudDogcGFyYW1zLm1lZGlhVXJscy5sZW5ndGgsXG5cdFx0XHRcdHN0YXR1czogXCJxdWV1ZWRcIixcblx0XHRcdFx0cHJpb3JpdHk6IFwibm9ybWFsXCIsXG5cdFx0XHRcdHBob25lX251bWJlcl9pZDogcGhvbmVOdW1iZXJJZCxcblx0XHRcdFx0aXNfYXJjaGl2ZWQ6IGZhbHNlLFxuXHRcdFx0XHRpc19hdXRvbWF0ZWQ6IGZhbHNlLFxuXHRcdFx0XHRpc19pbnRlcm5hbDogZmFsc2UsXG5cdFx0XHRcdGlzX3RocmVhZF9zdGFydGVyOiB0cnVlLFxuXHRcdFx0XHR0ZWxueXhfbWVzc2FnZV9pZDogcmVzdWx0Lm1lc3NhZ2VJZCxcblx0XHRcdH0pXG5cdFx0XHQuc2VsZWN0KClcblx0XHRcdC5zaW5nbGUoKTtcblxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXG5cdFx0cmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL2NvbW11bmljYXRpb25cIik7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogdHJ1ZSxcblx0XHRcdG1lc3NhZ2VJZDogcmVzdWx0Lm1lc3NhZ2VJZCxcblx0XHRcdGRhdGEsXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBcIkZhaWxlZCB0byBzZW5kIE1NU1wiLFxuXHRcdH07XG5cdH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gV0VCUlRDIE9QRVJBVElPTlMgQUNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIEdlbmVyYXRlIFdlYlJUQyBjcmVkZW50aWFscyBmb3IgYnJvd3NlciBjYWxsaW5nXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRXZWJSVENDcmVkZW50aWFscygpIHtcblx0dHJ5IHtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHQvLyBHZXQgY3VycmVudCB1c2VyXG5cdFx0Y29uc3Qge1xuXHRcdFx0ZGF0YTogeyB1c2VyIH0sXG5cdFx0XHRlcnJvcjogdXNlckVycm9yLFxuXHRcdH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKTtcblx0XHRpZiAodXNlckVycm9yIHx8ICF1c2VyKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdFx0ZXJyb3I6IFwiVXNlciBub3QgYXV0aGVudGljYXRlZFwiLFxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHQvLyBPUFRJT04gMTogVXNlIHN0YXRpYyBjcmVkZW50aWFscyBmcm9tIGVudmlyb25tZW50IChyZWNvbW1lbmRlZCBmb3IgcHJvZHVjdGlvbilcblx0XHRjb25zdCBzdGF0aWNVc2VybmFtZSA9IHByb2Nlc3MuZW52LlRFTE5ZWF9XRUJSVENfVVNFUk5BTUU7XG5cdFx0Y29uc3Qgc3RhdGljUGFzc3dvcmQgPSBwcm9jZXNzLmVudi5URUxOWVhfV0VCUlRDX1BBU1NXT1JEO1xuXG5cdFx0aWYgKHN0YXRpY1VzZXJuYW1lICYmIHN0YXRpY1Bhc3N3b3JkKSB7XG5cdFx0XHRjb25zdCBjcmVkZW50aWFsID0ge1xuXHRcdFx0XHR1c2VybmFtZTogc3RhdGljVXNlcm5hbWUsXG5cdFx0XHRcdHBhc3N3b3JkOiBzdGF0aWNQYXNzd29yZCxcblx0XHRcdFx0ZXhwaXJlc19hdDogRGF0ZS5ub3coKSArIDg2XzQwMCAqIDEwMDAsIC8vIDI0IGhvdXJzIGZyb20gbm93XG5cdFx0XHRcdHJlYWxtOiBcInNpcC50ZWxueXguY29tXCIsXG5cdFx0XHRcdHNpcF91cmk6IGBzaXA6JHtzdGF0aWNVc2VybmFtZX1Ac2lwLnRlbG55eC5jb21gLFxuXHRcdFx0XHRzdHVuX3NlcnZlcnM6IFtcblx0XHRcdFx0XHRcInN0dW46c3R1bi50ZWxueXguY29tOjM0NzhcIixcblx0XHRcdFx0XHRcInN0dW46c3R1bi50ZWxueXguY29tOjM0NzlcIixcblx0XHRcdFx0XSxcblx0XHRcdFx0dHVybl9zZXJ2ZXJzOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dXJsczogW1xuXHRcdFx0XHRcdFx0XHRcInR1cm46dHVybi50ZWxueXguY29tOjM0Nzg/dHJhbnNwb3J0PXVkcFwiLFxuXHRcdFx0XHRcdFx0XHRcInR1cm46dHVybi50ZWxueXguY29tOjM0Nzg/dHJhbnNwb3J0PXRjcFwiLFxuXHRcdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRcdHVzZXJuYW1lOiBzdGF0aWNVc2VybmFtZSxcblx0XHRcdFx0XHRcdGNyZWRlbnRpYWw6IHN0YXRpY1Bhc3N3b3JkLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdF0sXG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0XHRjcmVkZW50aWFsLFxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRjb25zdCB7IGdlbmVyYXRlV2ViUlRDVG9rZW4gfSA9IGF3YWl0IGltcG9ydChcIkAvbGliL3RlbG55eC93ZWJydGNcIik7XG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgZ2VuZXJhdGVXZWJSVENUb2tlbih7XG5cdFx0XHR1c2VybmFtZTogdXNlci5lbWFpbCB8fCB1c2VyLmlkLFxuXHRcdFx0dHRsOiA4Nl80MDAsIC8vIDI0IGhvdXJzXG5cdFx0fSk7XG5cblx0XHRpZiAoIXJlc3VsdC5zdWNjZXNzKSB7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0Y3JlZGVudGlhbDogcmVzdWx0LmNyZWRlbnRpYWwsXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRlcnJvcjpcblx0XHRcdFx0ZXJyb3IgaW5zdGFuY2VvZiBFcnJvclxuXHRcdFx0XHRcdD8gZXJyb3IubWVzc2FnZVxuXHRcdFx0XHRcdDogXCJGYWlsZWQgdG8gZ2V0IFdlYlJUQyBjcmVkZW50aWFsc1wiLFxuXHRcdH07XG5cdH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVk9JQ0VNQUlMIE9QRVJBVElPTlMgQUNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIEdldCBhbGwgdm9pY2VtYWlscyBmb3IgYSBjb21wYW55XG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGdldFZvaWNlbWFpbHMoY29tcGFueUlkOiBzdHJpbmcpIHtcblx0dHJ5IHtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHRjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJ2b2ljZW1haWxzXCIpXG5cdFx0XHQuc2VsZWN0KFxuXHRcdFx0XHRgXG4gICAgICAgICosXG4gICAgICAgIGN1c3RvbWVyOmN1c3RvbWVycyhpZCwgZmlyc3RfbmFtZSwgbGFzdF9uYW1lLCBlbWFpbCwgcGhvbmUpLFxuICAgICAgICBwaG9uZV9udW1iZXI6cGhvbmVfbnVtYmVycyhwaG9uZV9udW1iZXIsIGZvcm1hdHRlZF9udW1iZXIpXG4gICAgICBgLFxuXHRcdFx0KVxuXHRcdFx0LmVxKFwiY29tcGFueV9pZFwiLCBjb21wYW55SWQpXG5cdFx0XHQuaXMoXCJkZWxldGVkX2F0XCIsIG51bGwpXG5cdFx0XHQub3JkZXIoXCJyZWNlaXZlZF9hdFwiLCB7IGFzY2VuZGluZzogZmFsc2UgfSk7XG5cblx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0ZGF0YTogZGF0YSB8fCBbXSxcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdGVycm9yOlxuXHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFwiRmFpbGVkIHRvIGdldCB2b2ljZW1haWxzXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIE1hcmsgdm9pY2VtYWlsIGFzIHJlYWRcbiAqL1xuYXN5bmMgZnVuY3Rpb24gbWFya1ZvaWNlbWFpbEFzUmVhZCh2b2ljZW1haWxJZDogc3RyaW5nLCB1c2VySWQ6IHN0cmluZykge1xuXHR0cnkge1xuXHRcdGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KCk7XG5cdFx0aWYgKCFzdXBhYmFzZSkge1xuXHRcdFx0cmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIlNlcnZpY2UgdW5hdmFpbGFibGVcIiB9O1xuXHRcdH1cblxuXHRcdGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcInZvaWNlbWFpbHNcIilcblx0XHRcdC51cGRhdGUoe1xuXHRcdFx0XHRpc19yZWFkOiB0cnVlLFxuXHRcdFx0XHRyZWFkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG5cdFx0XHRcdHJlYWRfYnk6IHVzZXJJZCxcblx0XHRcdH0pXG5cdFx0XHQuZXEoXCJpZFwiLCB2b2ljZW1haWxJZClcblx0XHRcdC5zZWxlY3QoKVxuXHRcdFx0LnNpbmdsZSgpO1xuXG5cdFx0aWYgKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cblx0XHRyZXZhbGlkYXRlUGF0aChcIi9kYXNoYm9hcmQvY29tbXVuaWNhdGlvblwiKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0ZGF0YSxcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdGVycm9yOlxuXHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yXG5cdFx0XHRcdFx0PyBlcnJvci5tZXNzYWdlXG5cdFx0XHRcdFx0OiBcIkZhaWxlZCB0byBtYXJrIHZvaWNlbWFpbCBhcyByZWFkXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIERlbGV0ZSB2b2ljZW1haWxcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZGVsZXRlVm9pY2VtYWlsKHZvaWNlbWFpbElkOiBzdHJpbmcsIHVzZXJJZDogc3RyaW5nKSB7XG5cdHRyeSB7XG5cdFx0Y29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcblx0XHRpZiAoIXN1cGFiYXNlKSB7XG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiU2VydmljZSB1bmF2YWlsYWJsZVwiIH07XG5cdFx0fVxuXG5cdFx0Y29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwidm9pY2VtYWlsc1wiKVxuXHRcdFx0LnVwZGF0ZSh7XG5cdFx0XHRcdGRlbGV0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcblx0XHRcdFx0ZGVsZXRlZF9ieTogdXNlcklkLFxuXHRcdFx0fSlcblx0XHRcdC5lcShcImlkXCIsIHZvaWNlbWFpbElkKTtcblxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXG5cdFx0cmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL2NvbW11bmljYXRpb25cIik7XG5cblx0XHRyZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJGYWlsZWQgdG8gZGVsZXRlIHZvaWNlbWFpbFwiLFxuXHRcdH07XG5cdH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQ0FMTCBST1VUSU5HIFJVTEVTIEFDVElPTlNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLyoqXG4gKiBHZXQgYWxsIGNhbGwgcm91dGluZyBydWxlcyBmb3IgYSBjb21wYW55XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDYWxsUm91dGluZ1J1bGVzKGNvbXBhbnlJZDogc3RyaW5nKSB7XG5cdHRyeSB7XG5cdFx0Y29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcblx0XHRpZiAoIXN1cGFiYXNlKSB7XG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiU2VydmljZSB1bmF2YWlsYWJsZVwiIH07XG5cdFx0fVxuXG5cdFx0Y29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2Vcblx0XHRcdC5mcm9tKFwiY2FsbF9yb3V0aW5nX3J1bGVzXCIpXG5cdFx0XHQuc2VsZWN0KFxuXHRcdFx0XHRgXG4gICAgICAgICosXG4gICAgICAgIGNyZWF0ZWRfYnlfdXNlcjp1c2VycyFjYWxsX3JvdXRpbmdfcnVsZXNfY3JlYXRlZF9ieV9ma2V5KGlkLCBuYW1lLCBlbWFpbCksXG4gICAgICAgIGZvcndhcmRfdG9fdXNlcjp1c2VycyFjYWxsX3JvdXRpbmdfcnVsZXNfZm9yd2FyZF90b191c2VyX2lkX2ZrZXkoaWQsIG5hbWUsIGVtYWlsKVxuICAgICAgYCxcblx0XHRcdClcblx0XHRcdC5lcShcImNvbXBhbnlfaWRcIiwgY29tcGFueUlkKVxuXHRcdFx0LmlzKFwiZGVsZXRlZF9hdFwiLCBudWxsKVxuXHRcdFx0Lm9yZGVyKFwicHJpb3JpdHlcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pO1xuXG5cdFx0aWYgKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogdHJ1ZSxcblx0XHRcdGRhdGE6IGRhdGEgfHwgW10sXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRlcnJvcjpcblx0XHRcdFx0ZXJyb3IgaW5zdGFuY2VvZiBFcnJvclxuXHRcdFx0XHRcdD8gZXJyb3IubWVzc2FnZVxuXHRcdFx0XHRcdDogXCJGYWlsZWQgdG8gZ2V0IGNhbGwgcm91dGluZyBydWxlc1wiLFxuXHRcdH07XG5cdH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgY2FsbCByb3V0aW5nIHJ1bGVcbiAqL1xuYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ2FsbFJvdXRpbmdSdWxlKHBhcmFtczoge1xuXHRjb21wYW55SWQ6IHN0cmluZztcblx0dXNlcklkOiBzdHJpbmc7XG5cdG5hbWU6IHN0cmluZztcblx0ZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cdHJvdXRpbmdUeXBlOlxuXHRcdHwgXCJkaXJlY3RcIlxuXHRcdHwgXCJyb3VuZF9yb2JpblwiXG5cdFx0fCBcIml2clwiXG5cdFx0fCBcImJ1c2luZXNzX2hvdXJzXCJcblx0XHR8IFwiY29uZGl0aW9uYWxcIjtcblx0cHJpb3JpdHk/OiBudW1iZXI7XG5cdGJ1c2luZXNzSG91cnM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcblx0dGltZXpvbmU/OiBzdHJpbmc7XG5cdGFmdGVySG91cnNBY3Rpb24/OiBcInZvaWNlbWFpbFwiIHwgXCJmb3J3YXJkXCIgfCBcImhhbmd1cFwiO1xuXHRhZnRlckhvdXJzRm9yd2FyZFRvPzogc3RyaW5nO1xuXHR0ZWFtTWVtYmVycz86IHN0cmluZ1tdO1xuXHRyaW5nVGltZW91dD86IG51bWJlcjtcblx0aXZyTWVudT86IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuXHRpdnJHcmVldGluZ1VybD86IHN0cmluZztcblx0Zm9yd2FyZFRvTnVtYmVyPzogc3RyaW5nO1xuXHRmb3J3YXJkVG9Vc2VySWQ/OiBzdHJpbmc7XG5cdGVuYWJsZVZvaWNlbWFpbD86IGJvb2xlYW47XG5cdHZvaWNlbWFpbEdyZWV0aW5nVXJsPzogc3RyaW5nO1xuXHR2b2ljZW1haWxUcmFuc2NyaXB0aW9uRW5hYmxlZD86IGJvb2xlYW47XG5cdHZvaWNlbWFpbEVtYWlsTm90aWZpY2F0aW9ucz86IGJvb2xlYW47XG5cdHJlY29yZENhbGxzPzogYm9vbGVhbjtcbn0pIHtcblx0dHJ5IHtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHRjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJjYWxsX3JvdXRpbmdfcnVsZXNcIilcblx0XHRcdC5pbnNlcnQoe1xuXHRcdFx0XHRjb21wYW55X2lkOiBwYXJhbXMuY29tcGFueUlkLFxuXHRcdFx0XHRjcmVhdGVkX2J5OiBwYXJhbXMudXNlcklkLFxuXHRcdFx0XHRuYW1lOiBwYXJhbXMubmFtZSxcblx0XHRcdFx0ZGVzY3JpcHRpb246IHBhcmFtcy5kZXNjcmlwdGlvbixcblx0XHRcdFx0cm91dGluZ190eXBlOiBwYXJhbXMucm91dGluZ1R5cGUsXG5cdFx0XHRcdHByaW9yaXR5OiBwYXJhbXMucHJpb3JpdHkgfHwgMCxcblx0XHRcdFx0YnVzaW5lc3NfaG91cnM6IHBhcmFtcy5idXNpbmVzc0hvdXJzLFxuXHRcdFx0XHR0aW1lem9uZTogcGFyYW1zLnRpbWV6b25lIHx8IFwiQW1lcmljYS9Mb3NfQW5nZWxlc1wiLFxuXHRcdFx0XHRhZnRlcl9ob3Vyc19hY3Rpb246IHBhcmFtcy5hZnRlckhvdXJzQWN0aW9uLFxuXHRcdFx0XHRhZnRlcl9ob3Vyc19mb3J3YXJkX3RvOiBwYXJhbXMuYWZ0ZXJIb3Vyc0ZvcndhcmRUbyxcblx0XHRcdFx0dGVhbV9tZW1iZXJzOiBwYXJhbXMudGVhbU1lbWJlcnMsXG5cdFx0XHRcdHJpbmdfdGltZW91dDogcGFyYW1zLnJpbmdUaW1lb3V0IHx8IDIwLFxuXHRcdFx0XHRpdnJfbWVudTogcGFyYW1zLml2ck1lbnUsXG5cdFx0XHRcdGl2cl9ncmVldGluZ191cmw6IHBhcmFtcy5pdnJHcmVldGluZ1VybCxcblx0XHRcdFx0Zm9yd2FyZF90b19udW1iZXI6IHBhcmFtcy5mb3J3YXJkVG9OdW1iZXIsXG5cdFx0XHRcdGZvcndhcmRfdG9fdXNlcl9pZDogcGFyYW1zLmZvcndhcmRUb1VzZXJJZCxcblx0XHRcdFx0ZW5hYmxlX3ZvaWNlbWFpbDogcGFyYW1zLmVuYWJsZVZvaWNlbWFpbCAhPT0gZmFsc2UsXG5cdFx0XHRcdHZvaWNlbWFpbF9ncmVldGluZ191cmw6IHBhcmFtcy52b2ljZW1haWxHcmVldGluZ1VybCxcblx0XHRcdFx0dm9pY2VtYWlsX3RyYW5zY3JpcHRpb25fZW5hYmxlZDpcblx0XHRcdFx0XHRwYXJhbXMudm9pY2VtYWlsVHJhbnNjcmlwdGlvbkVuYWJsZWQgIT09IGZhbHNlLFxuXHRcdFx0XHR2b2ljZW1haWxfZW1haWxfbm90aWZpY2F0aW9uczpcblx0XHRcdFx0XHRwYXJhbXMudm9pY2VtYWlsRW1haWxOb3RpZmljYXRpb25zICE9PSBmYWxzZSxcblx0XHRcdFx0cmVjb3JkX2NhbGxzOiBwYXJhbXMucmVjb3JkQ2FsbHMsXG5cdFx0XHRcdGlzX2FjdGl2ZTogdHJ1ZSxcblx0XHRcdH0pXG5cdFx0XHQuc2VsZWN0KClcblx0XHRcdC5zaW5nbGUoKTtcblxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXG5cdFx0cmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL3NldHRpbmdzL2NvbW11bmljYXRpb25zL2NhbGwtcm91dGluZ1wiKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0ZGF0YSxcblx0XHR9O1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiBmYWxzZSxcblx0XHRcdGVycm9yOlxuXHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yXG5cdFx0XHRcdFx0PyBlcnJvci5tZXNzYWdlXG5cdFx0XHRcdFx0OiBcIkZhaWxlZCB0byBjcmVhdGUgY2FsbCByb3V0aW5nIHJ1bGVcIixcblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogVXBkYXRlIGFuIGV4aXN0aW5nIGNhbGwgcm91dGluZyBydWxlXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVDYWxsUm91dGluZ1J1bGUocGFyYW1zOiB7XG5cdHJ1bGVJZDogc3RyaW5nO1xuXHRuYW1lPzogc3RyaW5nO1xuXHRkZXNjcmlwdGlvbj86IHN0cmluZztcblx0cHJpb3JpdHk/OiBudW1iZXI7XG5cdGJ1c2luZXNzSG91cnM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcblx0dGltZXpvbmU/OiBzdHJpbmc7XG5cdGFmdGVySG91cnNBY3Rpb24/OiBcInZvaWNlbWFpbFwiIHwgXCJmb3J3YXJkXCIgfCBcImhhbmd1cFwiO1xuXHRhZnRlckhvdXJzRm9yd2FyZFRvPzogc3RyaW5nO1xuXHR0ZWFtTWVtYmVycz86IHN0cmluZ1tdO1xuXHRyaW5nVGltZW91dD86IG51bWJlcjtcblx0aXZyTWVudT86IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuXHRpdnJHcmVldGluZ1VybD86IHN0cmluZztcblx0Zm9yd2FyZFRvTnVtYmVyPzogc3RyaW5nO1xuXHRmb3J3YXJkVG9Vc2VySWQ/OiBzdHJpbmc7XG5cdGVuYWJsZVZvaWNlbWFpbD86IGJvb2xlYW47XG5cdHZvaWNlbWFpbEdyZWV0aW5nVXJsPzogc3RyaW5nO1xuXHR2b2ljZW1haWxUcmFuc2NyaXB0aW9uRW5hYmxlZD86IGJvb2xlYW47XG5cdHZvaWNlbWFpbEVtYWlsTm90aWZpY2F0aW9ucz86IGJvb2xlYW47XG5cdHJlY29yZENhbGxzPzogYm9vbGVhbjtcblx0aXNBY3RpdmU/OiBib29sZWFuO1xufSkge1xuXHR0cnkge1xuXHRcdGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KCk7XG5cdFx0aWYgKCFzdXBhYmFzZSkge1xuXHRcdFx0cmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIlNlcnZpY2UgdW5hdmFpbGFibGVcIiB9O1xuXHRcdH1cblxuXHRcdGNvbnN0IHVwZGF0ZURhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG5cblx0XHRpZiAocGFyYW1zLm5hbWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dXBkYXRlRGF0YS5uYW1lID0gcGFyYW1zLm5hbWU7XG5cdFx0fVxuXHRcdGlmIChwYXJhbXMuZGVzY3JpcHRpb24gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dXBkYXRlRGF0YS5kZXNjcmlwdGlvbiA9IHBhcmFtcy5kZXNjcmlwdGlvbjtcblx0XHR9XG5cdFx0aWYgKHBhcmFtcy5wcmlvcml0eSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR1cGRhdGVEYXRhLnByaW9yaXR5ID0gcGFyYW1zLnByaW9yaXR5O1xuXHRcdH1cblx0XHRpZiAocGFyYW1zLmJ1c2luZXNzSG91cnMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dXBkYXRlRGF0YS5idXNpbmVzc19ob3VycyA9IHBhcmFtcy5idXNpbmVzc0hvdXJzO1xuXHRcdH1cblx0XHRpZiAocGFyYW1zLnRpbWV6b25lICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHVwZGF0ZURhdGEudGltZXpvbmUgPSBwYXJhbXMudGltZXpvbmU7XG5cdFx0fVxuXHRcdGlmIChwYXJhbXMuYWZ0ZXJIb3Vyc0FjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR1cGRhdGVEYXRhLmFmdGVyX2hvdXJzX2FjdGlvbiA9IHBhcmFtcy5hZnRlckhvdXJzQWN0aW9uO1xuXHRcdH1cblx0XHRpZiAocGFyYW1zLmFmdGVySG91cnNGb3J3YXJkVG8gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dXBkYXRlRGF0YS5hZnRlcl9ob3Vyc19mb3J3YXJkX3RvID0gcGFyYW1zLmFmdGVySG91cnNGb3J3YXJkVG87XG5cdFx0fVxuXHRcdGlmIChwYXJhbXMudGVhbU1lbWJlcnMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dXBkYXRlRGF0YS50ZWFtX21lbWJlcnMgPSBwYXJhbXMudGVhbU1lbWJlcnM7XG5cdFx0fVxuXHRcdGlmIChwYXJhbXMucmluZ1RpbWVvdXQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dXBkYXRlRGF0YS5yaW5nX3RpbWVvdXQgPSBwYXJhbXMucmluZ1RpbWVvdXQ7XG5cdFx0fVxuXHRcdGlmIChwYXJhbXMuaXZyTWVudSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR1cGRhdGVEYXRhLml2cl9tZW51ID0gcGFyYW1zLml2ck1lbnU7XG5cdFx0fVxuXHRcdGlmIChwYXJhbXMuaXZyR3JlZXRpbmdVcmwgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dXBkYXRlRGF0YS5pdnJfZ3JlZXRpbmdfdXJsID0gcGFyYW1zLml2ckdyZWV0aW5nVXJsO1xuXHRcdH1cblx0XHRpZiAocGFyYW1zLmZvcndhcmRUb051bWJlciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR1cGRhdGVEYXRhLmZvcndhcmRfdG9fbnVtYmVyID0gcGFyYW1zLmZvcndhcmRUb051bWJlcjtcblx0XHR9XG5cdFx0aWYgKHBhcmFtcy5mb3J3YXJkVG9Vc2VySWQgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dXBkYXRlRGF0YS5mb3J3YXJkX3RvX3VzZXJfaWQgPSBwYXJhbXMuZm9yd2FyZFRvVXNlcklkO1xuXHRcdH1cblx0XHRpZiAocGFyYW1zLmVuYWJsZVZvaWNlbWFpbCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR1cGRhdGVEYXRhLmVuYWJsZV92b2ljZW1haWwgPSBwYXJhbXMuZW5hYmxlVm9pY2VtYWlsO1xuXHRcdH1cblx0XHRpZiAocGFyYW1zLnZvaWNlbWFpbEdyZWV0aW5nVXJsICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHVwZGF0ZURhdGEudm9pY2VtYWlsX2dyZWV0aW5nX3VybCA9IHBhcmFtcy52b2ljZW1haWxHcmVldGluZ1VybDtcblx0XHR9XG5cdFx0aWYgKHBhcmFtcy52b2ljZW1haWxUcmFuc2NyaXB0aW9uRW5hYmxlZCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR1cGRhdGVEYXRhLnZvaWNlbWFpbF90cmFuc2NyaXB0aW9uX2VuYWJsZWQgPVxuXHRcdFx0XHRwYXJhbXMudm9pY2VtYWlsVHJhbnNjcmlwdGlvbkVuYWJsZWQ7XG5cdFx0fVxuXHRcdGlmIChwYXJhbXMudm9pY2VtYWlsRW1haWxOb3RpZmljYXRpb25zICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHVwZGF0ZURhdGEudm9pY2VtYWlsX2VtYWlsX25vdGlmaWNhdGlvbnMgPVxuXHRcdFx0XHRwYXJhbXMudm9pY2VtYWlsRW1haWxOb3RpZmljYXRpb25zO1xuXHRcdH1cblx0XHRpZiAocGFyYW1zLnJlY29yZENhbGxzICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHVwZGF0ZURhdGEucmVjb3JkX2NhbGxzID0gcGFyYW1zLnJlY29yZENhbGxzO1xuXHRcdH1cblx0XHRpZiAocGFyYW1zLmlzQWN0aXZlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHVwZGF0ZURhdGEuaXNfYWN0aXZlID0gcGFyYW1zLmlzQWN0aXZlO1xuXHRcdH1cblxuXHRcdGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImNhbGxfcm91dGluZ19ydWxlc1wiKVxuXHRcdFx0LnVwZGF0ZSh1cGRhdGVEYXRhKVxuXHRcdFx0LmVxKFwiaWRcIiwgcGFyYW1zLnJ1bGVJZClcblx0XHRcdC5zZWxlY3QoKVxuXHRcdFx0LnNpbmdsZSgpO1xuXG5cdFx0aWYgKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cblx0XHRyZXZhbGlkYXRlUGF0aChcIi9kYXNoYm9hcmQvc2V0dGluZ3MvY29tbXVuaWNhdGlvbnMvY2FsbC1yb3V0aW5nXCIpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IHRydWUsXG5cdFx0XHRkYXRhLFxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3Jcblx0XHRcdFx0XHQ/IGVycm9yLm1lc3NhZ2Vcblx0XHRcdFx0XHQ6IFwiRmFpbGVkIHRvIHVwZGF0ZSBjYWxsIHJvdXRpbmcgcnVsZVwiLFxuXHRcdH07XG5cdH1cbn1cblxuLyoqXG4gKiBEZWxldGUgYSBjYWxsIHJvdXRpbmcgcnVsZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlQ2FsbFJvdXRpbmdSdWxlKHJ1bGVJZDogc3RyaW5nLCB1c2VySWQ6IHN0cmluZykge1xuXHR0cnkge1xuXHRcdGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KCk7XG5cdFx0aWYgKCFzdXBhYmFzZSkge1xuXHRcdFx0cmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIlNlcnZpY2UgdW5hdmFpbGFibGVcIiB9O1xuXHRcdH1cblxuXHRcdGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImNhbGxfcm91dGluZ19ydWxlc1wiKVxuXHRcdFx0LnVwZGF0ZSh7XG5cdFx0XHRcdGRlbGV0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcblx0XHRcdFx0ZGVsZXRlZF9ieTogdXNlcklkLFxuXHRcdFx0fSlcblx0XHRcdC5lcShcImlkXCIsIHJ1bGVJZCk7XG5cblx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdHRocm93IGVycm9yO1xuXHRcdH1cblxuXHRcdHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9zZXR0aW5ncy9jb21tdW5pY2F0aW9ucy9jYWxsLXJvdXRpbmdcIik7XG5cblx0XHRyZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3Jcblx0XHRcdFx0XHQ/IGVycm9yLm1lc3NhZ2Vcblx0XHRcdFx0XHQ6IFwiRmFpbGVkIHRvIGRlbGV0ZSBjYWxsIHJvdXRpbmcgcnVsZVwiLFxuXHRcdH07XG5cdH1cbn1cblxuLyoqXG4gKiBUb2dnbGUgY2FsbCByb3V0aW5nIHJ1bGUgYWN0aXZlIHN0YXR1c1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdG9nZ2xlQ2FsbFJvdXRpbmdSdWxlKHJ1bGVJZDogc3RyaW5nLCBpc0FjdGl2ZTogYm9vbGVhbikge1xuXHR0cnkge1xuXHRcdGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KCk7XG5cdFx0aWYgKCFzdXBhYmFzZSkge1xuXHRcdFx0cmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIlNlcnZpY2UgdW5hdmFpbGFibGVcIiB9O1xuXHRcdH1cblxuXHRcdGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImNhbGxfcm91dGluZ19ydWxlc1wiKVxuXHRcdFx0LnVwZGF0ZSh7IGlzX2FjdGl2ZTogaXNBY3RpdmUgfSlcblx0XHRcdC5lcShcImlkXCIsIHJ1bGVJZClcblx0XHRcdC5zZWxlY3QoKVxuXHRcdFx0LnNpbmdsZSgpO1xuXG5cdFx0aWYgKGVycm9yKSB7XG5cdFx0XHR0aHJvdyBlcnJvcjtcblx0XHR9XG5cblx0XHRyZXZhbGlkYXRlUGF0aChcIi9kYXNoYm9hcmQvc2V0dGluZ3MvY29tbXVuaWNhdGlvbnMvY2FsbC1yb3V0aW5nXCIpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IHRydWUsXG5cdFx0XHRkYXRhLFxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3Jcblx0XHRcdFx0XHQ/IGVycm9yLm1lc3NhZ2Vcblx0XHRcdFx0XHQ6IFwiRmFpbGVkIHRvIHRvZ2dsZSBjYWxsIHJvdXRpbmcgcnVsZVwiLFxuXHRcdH07XG5cdH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gUEhPTkUgTlVNQkVSIFVTQUdFIFNUQVRJU1RJQ1MgQUNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIEdldCB1c2FnZSBzdGF0aXN0aWNzIGZvciBhIHBob25lIG51bWJlclxuICovXG5hc3luYyBmdW5jdGlvbiBnZXRQaG9uZU51bWJlclVzYWdlU3RhdHMoXG5cdHBob25lTnVtYmVySWQ6IHN0cmluZyxcblx0ZGF5cyA9IDMwLFxuKSB7XG5cdHRyeSB7XG5cdFx0Y29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKTtcblx0XHRpZiAoIXN1cGFiYXNlKSB7XG5cdFx0XHRyZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IFwiU2VydmljZSB1bmF2YWlsYWJsZVwiIH07XG5cdFx0fVxuXG5cdFx0Y29uc3Qgc3RhcnREYXRlID0gbmV3IERhdGUoKTtcblx0XHRzdGFydERhdGUuc2V0RGF0ZShzdGFydERhdGUuZ2V0RGF0ZSgpIC0gZGF5cyk7XG5cblx0XHQvLyBHZXQgY2FsbCBzdGF0aXN0aWNzXG5cdFx0Y29uc3QgeyBkYXRhOiBjYWxsU3RhdHMsIGVycm9yOiBjYWxsRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImNvbW11bmljYXRpb25zXCIpXG5cdFx0XHQuc2VsZWN0KFwidHlwZSwgZGlyZWN0aW9uLCBzdGF0dXMsIGNhbGxfZHVyYXRpb24sIGNyZWF0ZWRfYXRcIilcblx0XHRcdC5lcShcInR5cGVcIiwgXCJwaG9uZVwiKVxuXHRcdFx0LmVxKFwicGhvbmVfbnVtYmVyX2lkXCIsIHBob25lTnVtYmVySWQpXG5cdFx0XHQuZ3RlKFwiY3JlYXRlZF9hdFwiLCBzdGFydERhdGUudG9JU09TdHJpbmcoKSk7XG5cblx0XHRpZiAoY2FsbEVycm9yKSB7XG5cdFx0XHR0aHJvdyBjYWxsRXJyb3I7XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IFNNUyBzdGF0aXN0aWNzXG5cdFx0Y29uc3QgeyBkYXRhOiBzbXNTdGF0cywgZXJyb3I6IHNtc0Vycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuXHRcdFx0LmZyb20oXCJjb21tdW5pY2F0aW9uc1wiKVxuXHRcdFx0LnNlbGVjdChcInR5cGUsIGRpcmVjdGlvbiwgc3RhdHVzLCBjcmVhdGVkX2F0XCIpXG5cdFx0XHQuZXEoXCJ0eXBlXCIsIFwic21zXCIpXG5cdFx0XHQuZXEoXCJwaG9uZV9udW1iZXJfaWRcIiwgcGhvbmVOdW1iZXJJZClcblx0XHRcdC5ndGUoXCJjcmVhdGVkX2F0XCIsIHN0YXJ0RGF0ZS50b0lTT1N0cmluZygpKTtcblxuXHRcdGlmIChzbXNFcnJvcikge1xuXHRcdFx0dGhyb3cgc21zRXJyb3I7XG5cdFx0fVxuXG5cdFx0Ly8gQ2FsY3VsYXRlIGFnZ3JlZ2F0ZXNcblx0XHRjb25zdCBjYWxscyA9IGNhbGxTdGF0cyB8fCBbXTtcblx0XHRjb25zdCBzbXMgPSBzbXNTdGF0cyB8fCBbXTtcblxuXHRcdGNvbnN0IGluY29taW5nQ2FsbHMgPSBjYWxscy5maWx0ZXIoKGMpID0+IGMuZGlyZWN0aW9uID09PSBcImluYm91bmRcIikubGVuZ3RoO1xuXHRcdGNvbnN0IG91dGdvaW5nQ2FsbHMgPSBjYWxscy5maWx0ZXIoXG5cdFx0XHQoYykgPT4gYy5kaXJlY3Rpb24gPT09IFwib3V0Ym91bmRcIixcblx0XHQpLmxlbmd0aDtcblx0XHRjb25zdCB0b3RhbENhbGxEdXJhdGlvbiA9IGNhbGxzLnJlZHVjZShcblx0XHRcdChzdW0sIGMpID0+IHN1bSArIChjLmNhbGxfZHVyYXRpb24gfHwgMCksXG5cdFx0XHQwLFxuXHRcdCk7XG5cdFx0Y29uc3QgaW5jb21pbmdTbXMgPSBzbXMuZmlsdGVyKChzKSA9PiBzLmRpcmVjdGlvbiA9PT0gXCJpbmJvdW5kXCIpLmxlbmd0aDtcblx0XHRjb25zdCBvdXRnb2luZ1NtcyA9IHNtcy5maWx0ZXIoKHMpID0+IHMuZGlyZWN0aW9uID09PSBcIm91dGJvdW5kXCIpLmxlbmd0aDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRpbmNvbWluZ0NhbGxzLFxuXHRcdFx0XHRvdXRnb2luZ0NhbGxzLFxuXHRcdFx0XHR0b3RhbENhbGxzOiBpbmNvbWluZ0NhbGxzICsgb3V0Z29pbmdDYWxscyxcblx0XHRcdFx0dG90YWxDYWxsRHVyYXRpb24sXG5cdFx0XHRcdGluY29taW5nU21zLFxuXHRcdFx0XHRvdXRnb2luZ1Ntcyxcblx0XHRcdFx0dG90YWxTbXM6IGluY29taW5nU21zICsgb3V0Z29pbmdTbXMsXG5cdFx0XHRcdGRhaWx5U3RhdHM6IGFnZ3JlZ2F0ZURhaWx5U3RhdHMoWy4uLmNhbGxzLCAuLi5zbXNdLCBkYXlzKSxcblx0XHRcdH0sXG5cdFx0fTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2VzczogZmFsc2UsXG5cdFx0XHRlcnJvcjpcblx0XHRcdFx0ZXJyb3IgaW5zdGFuY2VvZiBFcnJvclxuXHRcdFx0XHRcdD8gZXJyb3IubWVzc2FnZVxuXHRcdFx0XHRcdDogXCJGYWlsZWQgdG8gZ2V0IHVzYWdlIHN0YXRpc3RpY3NcIixcblx0XHR9O1xuXHR9XG59XG5cbi8qKlxuICogR2V0IGNvbXBhbnktd2lkZSB1c2FnZSBzdGF0aXN0aWNzXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGdldENvbXBhbnlVc2FnZVN0YXRzKGNvbXBhbnlJZDogc3RyaW5nLCBkYXlzID0gMzApIHtcblx0dHJ5IHtcblx0XHRjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpO1xuXHRcdGlmICghc3VwYWJhc2UpIHtcblx0XHRcdHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJTZXJ2aWNlIHVuYXZhaWxhYmxlXCIgfTtcblx0XHR9XG5cblx0XHRjb25zdCBzdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuXHRcdHN0YXJ0RGF0ZS5zZXREYXRlKHN0YXJ0RGF0ZS5nZXREYXRlKCkgLSBkYXlzKTtcblxuXHRcdC8vIEdldCBhbGwgY29tbXVuaWNhdGlvbnMgZm9yIHRoZSBjb21wYW55XG5cdFx0Y29uc3QgeyBkYXRhOiBjb21tdW5pY2F0aW9ucywgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG5cdFx0XHQuZnJvbShcImNvbW11bmljYXRpb25zXCIpXG5cdFx0XHQuc2VsZWN0KFwidHlwZSwgZGlyZWN0aW9uLCBzdGF0dXMsIGNhbGxfZHVyYXRpb24sIGNyZWF0ZWRfYXRcIilcblx0XHRcdC5lcShcImNvbXBhbnlfaWRcIiwgY29tcGFueUlkKVxuXHRcdFx0LmluKFwidHlwZVwiLCBbXCJwaG9uZVwiLCBcInNtc1wiXSlcblx0XHRcdC5ndGUoXCJjcmVhdGVkX2F0XCIsIHN0YXJ0RGF0ZS50b0lTT1N0cmluZygpKTtcblxuXHRcdGlmIChlcnJvcikge1xuXHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0fVxuXG5cdFx0Y29uc3QgaXRlbXMgPSBjb21tdW5pY2F0aW9ucyB8fCBbXTtcblx0XHRjb25zdCBjYWxscyA9IGl0ZW1zLmZpbHRlcigoaSkgPT4gaS50eXBlID09PSBcInBob25lXCIpO1xuXHRcdGNvbnN0IHNtcyA9IGl0ZW1zLmZpbHRlcigoaSkgPT4gaS50eXBlID09PSBcInNtc1wiKTtcblxuXHRcdGNvbnN0IGluY29taW5nQ2FsbHMgPSBjYWxscy5maWx0ZXIoKGMpID0+IGMuZGlyZWN0aW9uID09PSBcImluYm91bmRcIikubGVuZ3RoO1xuXHRcdGNvbnN0IG91dGdvaW5nQ2FsbHMgPSBjYWxscy5maWx0ZXIoXG5cdFx0XHQoYykgPT4gYy5kaXJlY3Rpb24gPT09IFwib3V0Ym91bmRcIixcblx0XHQpLmxlbmd0aDtcblx0XHRjb25zdCB0b3RhbENhbGxEdXJhdGlvbiA9IGNhbGxzLnJlZHVjZShcblx0XHRcdChzdW0sIGMpID0+IHN1bSArIChjLmNhbGxfZHVyYXRpb24gfHwgMCksXG5cdFx0XHQwLFxuXHRcdCk7XG5cdFx0Y29uc3QgaW5jb21pbmdTbXMgPSBzbXMuZmlsdGVyKChzKSA9PiBzLmRpcmVjdGlvbiA9PT0gXCJpbmJvdW5kXCIpLmxlbmd0aDtcblx0XHRjb25zdCBvdXRnb2luZ1NtcyA9IHNtcy5maWx0ZXIoKHMpID0+IHMuZGlyZWN0aW9uID09PSBcIm91dGJvdW5kXCIpLmxlbmd0aDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdWNjZXNzOiB0cnVlLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRpbmNvbWluZ0NhbGxzLFxuXHRcdFx0XHRvdXRnb2luZ0NhbGxzLFxuXHRcdFx0XHR0b3RhbENhbGxzOiBpbmNvbWluZ0NhbGxzICsgb3V0Z29pbmdDYWxscyxcblx0XHRcdFx0dG90YWxDYWxsRHVyYXRpb24sXG5cdFx0XHRcdGF2ZXJhZ2VDYWxsRHVyYXRpb246XG5cdFx0XHRcdFx0Y2FsbHMubGVuZ3RoID4gMCA/IHRvdGFsQ2FsbER1cmF0aW9uIC8gY2FsbHMubGVuZ3RoIDogMCxcblx0XHRcdFx0aW5jb21pbmdTbXMsXG5cdFx0XHRcdG91dGdvaW5nU21zLFxuXHRcdFx0XHR0b3RhbFNtczogaW5jb21pbmdTbXMgKyBvdXRnb2luZ1Ntcyxcblx0XHRcdFx0ZGFpbHlTdGF0czogYWdncmVnYXRlRGFpbHlTdGF0cyhpdGVtcywgZGF5cyksXG5cdFx0XHR9LFxuXHRcdH07XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN1Y2Nlc3M6IGZhbHNlLFxuXHRcdFx0ZXJyb3I6XG5cdFx0XHRcdGVycm9yIGluc3RhbmNlb2YgRXJyb3Jcblx0XHRcdFx0XHQ/IGVycm9yLm1lc3NhZ2Vcblx0XHRcdFx0XHQ6IFwiRmFpbGVkIHRvIGdldCB1c2FnZSBzdGF0aXN0aWNzXCIsXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBhZ2dyZWdhdGUgZGFpbHkgc3RhdGlzdGljc1xuICovXG5mdW5jdGlvbiBhZ2dyZWdhdGVEYWlseVN0YXRzKFxuXHRpdGVtczogQXJyYXk8eyBjcmVhdGVkX2F0OiBzdHJpbmc7IHR5cGU6IHN0cmluZzsgY2FsbF9kdXJhdGlvbj86IG51bWJlciB9Pixcblx0ZGF5czogbnVtYmVyLFxuKSB7XG5cdGNvbnN0IGRhaWx5U3RhdHM6IFJlY29yZDxcblx0XHRzdHJpbmcsXG5cdFx0eyBkYXRlOiBzdHJpbmc7IGNhbGxzOiBudW1iZXI7IHNtczogbnVtYmVyOyBkdXJhdGlvbjogbnVtYmVyIH1cblx0PiA9IHt9O1xuXG5cdC8vIEluaXRpYWxpemUgYWxsIGRheXNcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXlzOyBpKyspIHtcblx0XHRjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcblx0XHRkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSBpKTtcblx0XHRjb25zdCBkYXRlU3RyID0gZGF0ZS50b0lTT1N0cmluZygpLnNwbGl0KFwiVFwiKVswXTtcblx0XHRkYWlseVN0YXRzW2RhdGVTdHJdID0geyBkYXRlOiBkYXRlU3RyLCBjYWxsczogMCwgc21zOiAwLCBkdXJhdGlvbjogMCB9O1xuXHR9XG5cblx0Ly8gQWdncmVnYXRlIGRhdGFcblx0aXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuXHRcdGNvbnN0IGRhdGVTdHIgPSBpdGVtLmNyZWF0ZWRfYXQuc3BsaXQoXCJUXCIpWzBdO1xuXHRcdGlmIChkYWlseVN0YXRzW2RhdGVTdHJdKSB7XG5cdFx0XHRpZiAoaXRlbS50eXBlID09PSBcInBob25lXCIpIHtcblx0XHRcdFx0ZGFpbHlTdGF0c1tkYXRlU3RyXS5jYWxscyArPSAxO1xuXHRcdFx0XHRkYWlseVN0YXRzW2RhdGVTdHJdLmR1cmF0aW9uICs9IGl0ZW0uY2FsbF9kdXJhdGlvbiB8fCAwO1xuXHRcdFx0fSBlbHNlIGlmIChpdGVtLnR5cGUgPT09IFwic21zXCIpIHtcblx0XHRcdFx0ZGFpbHlTdGF0c1tkYXRlU3RyXS5zbXMgKz0gMTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdHJldHVybiBPYmplY3QudmFsdWVzKGRhaWx5U3RhdHMpLnNvcnQoKGEsIGIpID0+IGEuZGF0ZS5sb2NhbGVDb21wYXJlKGIuZGF0ZSkpO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJ5U0FnMkJzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/ui/textarea.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Re-export from @stratos/ui package
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/index.ts [app-client] (ecmascript) <locals>");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/stores/posts-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "postsSelectors",
    ()=>postsSelectors,
    "usePostsStore",
    ()=>usePostsStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware/immer.mjs [app-client] (ecmascript)");
;
;
;
/**
 * Initial state
 */ const initialState = {
    posts: [],
    selectedPost: null,
    isLoading: false,
    error: null,
    filters: {}
};
const usePostsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["immer"])((set, get)=>({
        ...initialState,
        setPosts: (posts)=>set((state)=>{
                state.posts = posts;
                state.isLoading = false;
                state.error = null;
            }, false, "setPosts"),
        addPost: (post)=>set((state)=>{
                state.posts.unshift(post);
            }, false, "addPost"),
        updatePost: (id, updates)=>set((state)=>{
                const index = state.posts.findIndex((p)=>p.id === id);
                if (index !== -1) {
                    state.posts[index] = {
                        ...state.posts[index],
                        ...updates
                    };
                }
                if (state.selectedPost?.id === id) {
                    state.selectedPost = {
                        ...state.selectedPost,
                        ...updates
                    };
                }
            }, false, "updatePost"),
        deletePost: (id)=>set((state)=>{
                state.posts = state.posts.filter((p)=>p.id !== id);
                if (state.selectedPost?.id === id) {
                    state.selectedPost = null;
                }
            }, false, "deletePost"),
        setSelectedPost: (post)=>set((state)=>{
                state.selectedPost = post;
            }, false, "setSelectedPost"),
        setLoading: (loading)=>set((state)=>{
                state.isLoading = loading;
            }, false, "setLoading"),
        setError: (error)=>set((state)=>{
                state.error = error;
                state.isLoading = false;
            }, false, "setError"),
        setFilters: (filters)=>set((state)=>{
                state.filters = {
                    ...state.filters,
                    ...filters
                };
            }, false, "setFilters"),
        clearFilters: ()=>set((state)=>{
                state.filters = {};
            }, false, "clearFilters"),
        getFilteredPosts: ()=>{
            const { posts, filters } = get();
            let filtered = [
                ...posts
            ];
            if (filters.published !== undefined) {
                filtered = filtered.filter((p)=>{
                    const isPublished = String(p.published).toLowerCase() === "true" || p.published === true;
                    return isPublished === filters.published;
                });
            }
            if (filters.authorId) {
                filtered = filtered.filter((p)=>p.authorId === filters.authorId);
            }
            return filtered;
        },
        reset: ()=>set(initialState, false, "reset")
    })), {
    name: "PostsStore"
}));
const postsSelectors = {
    posts: (state)=>state.posts,
    selectedPost: (state)=>state.selectedPost,
    isLoading: (state)=>state.isLoading,
    error: (state)=>state.error,
    filters: (state)=>state.filters,
    publishedPosts: (state)=>state.posts.filter((p)=>String(p.published).toLowerCase() === "true" || p.published === true),
    draftPosts: (state)=>state.posts.filter((p)=>!(String(p.published).toLowerCase() === "true" || p.published === true))
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/stores/chat-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import type { UIMessage } from "ai";
__turbopack_context__.s([
    "chatSelectors",
    ()=>chatSelectors,
    "useChatStore",
    ()=>useChatStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware/immer.mjs [app-client] (ecmascript)");
;
;
// Constants
const RANDOM_STRING_BASE = 36;
const RANDOM_STRING_LENGTH = 9;
// Stable empty array reference for selectors (prevents infinite loop with getSnapshot)
const EMPTY_MESSAGES = [];
const initialState = {
    chats: [],
    activeChatId: null,
    isLoading: false,
    error: null
};
const useChatStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["immer"])((set, get)=>({
        ...initialState,
        // Chat management
        createChat: (title = "New Chat")=>{
            let chatId;
            const state = get();
            // Ensure unique ID by checking against existing chats
            do {
                chatId = `chat-${Date.now()}-${Math.random().toString(RANDOM_STRING_BASE).substr(2, RANDOM_STRING_LENGTH)}`;
            }while (state.chats.some((chat)=>chat.id === chatId))
            set((storeState)=>{
                storeState.chats.push({
                    id: chatId,
                    title,
                    createdAt: new Date(),
                    messages: []
                });
                storeState.activeChatId = chatId;
            });
            return chatId;
        },
        deleteChat: (chatId)=>{
            set((state)=>{
                const index = state.chats.findIndex((c)=>c.id === chatId);
                if (index !== -1) {
                    state.chats.splice(index, 1);
                }
                if (state.activeChatId === chatId) {
                    state.activeChatId = state.chats[0]?.id ?? null;
                }
            });
        },
        setActiveChat: (chatId)=>{
            set((state)=>{
                state.activeChatId = chatId;
            });
        },
        updateChatTitle: (chatId, title)=>{
            set((state)=>{
                const chat = state.chats.find((c)=>c.id === chatId);
                if (chat) {
                    chat.title = title;
                }
            });
        },
        cleanupDuplicateChats: ()=>{
            set((state)=>{
                const seen = new Set();
                const uniqueChats = [];
                // Keep only the first occurrence of each chat ID
                for (const chat of state.chats){
                    if (!seen.has(chat.id)) {
                        seen.add(chat.id);
                        uniqueChats.push(chat);
                    }
                }
                state.chats = uniqueChats;
                // If active chat was removed due to duplication, set to first chat or null
                if (state.activeChatId && !uniqueChats.some((chat)=>chat.id === state.activeChatId)) {
                    state.activeChatId = uniqueChats[0]?.id ?? null;
                }
            });
        },
        // Message management
        addMessage: (chatId, message)=>{
            set((state)=>{
                const chat = state.chats.find((c)=>c.id === chatId);
                if (chat) {
                    chat.messages.push(message);
                }
            });
        },
        updateMessage: (chatId, messageId, content)=>{
            set((state)=>{
                const chat = state.chats.find((c)=>c.id === chatId);
                if (chat) {
                    const message = chat.messages.find((m)=>m.id === messageId);
                    if (message) {
                        message.content = content;
                    }
                }
            });
        },
        deleteMessage: (chatId, messageId)=>{
            set((state)=>{
                const chat = state.chats.find((c)=>c.id === chatId);
                if (chat) {
                    const index = chat.messages.findIndex((m)=>m.id === messageId);
                    if (index !== -1) {
                        chat.messages.splice(index, 1);
                    }
                }
            });
        },
        clearMessages: (chatId)=>{
            set((state)=>{
                const chat = state.chats.find((c)=>c.id === chatId);
                if (chat) {
                    chat.messages = [];
                }
            });
        },
        // UI state
        setLoading: (loading)=>{
            set((state)=>{
                state.isLoading = loading;
            });
        },
        setError: (error)=>{
            set((state)=>{
                state.error = error;
            });
        },
        // Utility
        getActiveChat: ()=>{
            const state = get();
            return state.chats.find((c)=>c.id === state.activeChatId) ?? null;
        },
        getChatMessages: (chatId)=>{
            const state = get();
            const chat = state.chats.find((c)=>c.id === chatId);
            return chat?.messages ?? [];
        },
        reset: ()=>{
            set(initialState);
        }
    })));
const chatSelectors = {
    chats: (state)=>state.chats,
    activeChat: (state)=>state.chats.find((c)=>c.id === state.activeChatId) ?? null,
    activeChatId: (state)=>state.activeChatId,
    messages: (state)=>{
        const activeChat = state.chats.find((c)=>c.id === state.activeChatId);
        return activeChat?.messages ?? EMPTY_MESSAGES;
    },
    isLoading: (state)=>state.isLoading,
    error: (state)=>state.error
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/stores/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Central exports for all Zustand stores
 *
 * All stores are consolidated in this directory for better organization.
 * Import stores from this file for consistency.
 */ // Feature stores (already in src/lib/stores/)
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$ui$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/ui-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$role$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/role-store.ts [app-client] (ecmascript)");
;
;
/**
 * Reset all stores to initial state
 * Useful for logout or clearing all state
 */ const resetAllStores = ()=>{
    const stores = [
        __turbopack_context__.r("[project]/apps/web/src/lib/stores/user-store.ts [app-client] (ecmascript)").useUserStore,
        __turbopack_context__.r("[project]/apps/web/src/lib/stores/ui-store.ts [app-client] (ecmascript)").useUIStore,
        __turbopack_context__.r("[project]/apps/web/src/lib/stores/posts-store.ts [app-client] (ecmascript)").usePostsStore,
        __turbopack_context__.r("[project]/apps/web/src/lib/stores/chat-store.ts [app-client] (ecmascript)").useChatStore
    ];
    for (const store of stores){
        store.getState().reset?.();
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/stores/call-preferences-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Call Preferences Store - Zustand State Management
 *
 * Manages CSR preferences for call interface layout including:
 * - Card visibility and order customization
 * - Popover width and size preferences
 * - Card collapsed/expanded states
 * - Auto-save preferences to localStorage
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - Persisted preferences across sessions
 * - Selective subscriptions prevent unnecessary re-renders
 */ __turbopack_context__.s([
    "useCallPreferencesStore",
    ()=>useCallPreferencesStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
// Default card configuration
const defaultCards = [
    {
        id: "call-controls",
        isVisible: true,
        isCollapsed: false,
        order: 0
    },
    {
        id: "transcript",
        isVisible: true,
        isCollapsed: false,
        order: 1
    },
    {
        id: "ai-autofill",
        isVisible: true,
        isCollapsed: false,
        order: 2
    },
    {
        id: "customer-info",
        isVisible: true,
        isCollapsed: false,
        order: 3
    },
    {
        id: "quick-actions",
        isVisible: true,
        isCollapsed: false,
        order: 4
    },
    {
        id: "ai-analysis",
        isVisible: true,
        isCollapsed: false,
        order: 5
    },
    {
        id: "notes",
        isVisible: true,
        isCollapsed: false,
        order: 6
    },
    {
        id: "disposition",
        isVisible: true,
        isCollapsed: false,
        order: 7
    },
    {
        id: "call-scripts",
        isVisible: false,
        isCollapsed: true,
        order: 8
    },
    {
        id: "transfer",
        isVisible: false,
        isCollapsed: true,
        order: 9
    }
];
// Initial state
const initialState = {
    popoverWidth: 800,
    position: "default",
    cards: defaultCards,
    layoutMode: "comfortable",
    showAIConfidence: true,
    autoSaveNotes: true,
    keyboardShortcutsEnabled: true
};
const useCallPreferencesStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        ...initialState,
        setPopoverWidth: (width)=>{
            // Clamp width between 420px and 1400px
            const clampedWidth = Math.max(420, Math.min(1400, width));
            set({
                popoverWidth: clampedWidth
            });
        },
        setPosition: (position)=>{
            set({
                position
            });
        },
        resetPosition: ()=>{
            set({
                position: "default"
            });
        },
        setCardVisibility: (cardId, isVisible)=>{
            set((state)=>({
                    cards: state.cards.map((card)=>card.id === cardId ? {
                            ...card,
                            isVisible
                        } : card)
                }));
        },
        setCardCollapsed: (cardId, isCollapsed)=>{
            set((state)=>({
                    cards: state.cards.map((card)=>card.id === cardId ? {
                            ...card,
                            isCollapsed
                        } : card)
                }));
        },
        setCardOrder: (cardId, newOrder)=>{
            set((state)=>{
                const cards = [
                    ...state.cards
                ];
                const cardIndex = cards.findIndex((c)=>c.id === cardId);
                if (cardIndex === -1) {
                    return state;
                }
                const [card] = cards.splice(cardIndex, 1);
                card.order = newOrder;
                // Reorder all cards
                const reordered = [
                    ...cards.slice(0, newOrder),
                    card,
                    ...cards.slice(newOrder)
                ].map((c, index)=>({
                        ...c,
                        order: index
                    }));
                return {
                    cards: reordered
                };
            });
        },
        reorderCards: (newOrder)=>{
            set((state)=>{
                const cards = state.cards.map((card)=>{
                    const newIndex = newOrder.indexOf(card.id);
                    return newIndex !== -1 ? {
                        ...card,
                        order: newIndex
                    } : card;
                });
                return {
                    cards: cards.sort((a, b)=>a.order - b.order)
                };
            });
        },
        toggleCard: (cardId)=>{
            set((state)=>({
                    cards: state.cards.map((card)=>card.id === cardId ? {
                            ...card,
                            isCollapsed: !card.isCollapsed
                        } : card)
                }));
        },
        setLayoutMode: (mode)=>set({
                layoutMode: mode
            }),
        setShowAIConfidence: (show)=>set({
                showAIConfidence: show
            }),
        setAutoSaveNotes: (enabled)=>set({
                autoSaveNotes: enabled
            }),
        setKeyboardShortcutsEnabled: (enabled)=>set({
                keyboardShortcutsEnabled: enabled
            }),
        resetToDefaults: ()=>set(initialState),
        getVisibleCards: ()=>{
            const { cards } = get();
            return cards.filter((card)=>card.isVisible).sort((a, b)=>a.order - b.order);
        }
    }), {
    name: "call-preferences-storage",
    partialize: (state)=>({
            popoverWidth: state.popoverWidth,
            position: state.position,
            cards: state.cards,
            layoutMode: state.layoutMode,
            showAIConfidence: state.showAIConfidence,
            autoSaveNotes: state.autoSaveNotes,
            keyboardShortcutsEnabled: state.keyboardShortcutsEnabled
        }),
    // PERFORMANCE: Skip hydration to prevent SSR mismatches
    // Allows Next.js to generate static pages without Zustand errors
    skipHydration: true
}), {
    name: "CallPreferencesStore"
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/use-cross-tab-sync.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * useCrossTabSync Hook
 *
 * Synchronizes call state and position across browser tabs
 *
 * Features:
 * - BroadcastChannel API for efficient cross-tab communication
 * - Fallback to localStorage events for older browsers
 * - Syncs call state (incoming, active, ended)
 * - Syncs call actions (answer, end, mute, hold, etc.)
 * - Syncs popover position and size changes
 * - Automatic cleanup on unmount
 *
 * Browser Support:
 * - BroadcastChannel: Chrome 54+, Firefox 38+, Safari 15.4+
 * - localStorage events: All browsers
 */ __turbopack_context__.s([
    "useCrossTabSync",
    ()=>useCrossTabSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$ui$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/ui-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/call-preferences-store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const CHANNEL_NAME = "thorbis-call-sync";
const STORAGE_KEY = "thorbis-call-sync-fallback";
function useCrossTabSync() {
    _s();
    const channelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isProcessingSyncRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false); // Prevent echo when processing sync messages
    // Get store actions
    const uiStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$ui$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIStore"])();
    const callPrefsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"])();
    // Use refs to stabilize callbacks and prevent circular dependency (CRITICAL FIX)
    const callRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(uiStore.call);
    const positionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(callPrefsStore.position);
    const popoverWidthRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(callPrefsStore.popoverWidth);
    const actionsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        answerCall: uiStore.answerCall,
        endCall: uiStore.endCall,
        toggleMute: uiStore.toggleMute,
        toggleHold: uiStore.toggleHold,
        toggleRecording: uiStore.toggleRecording,
        setIncomingCall: uiStore.setIncomingCall,
        setPosition: callPrefsStore.setPosition,
        setPopoverWidth: callPrefsStore.setPopoverWidth
    });
    // Keep refs up to date without triggering re-renders
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCrossTabSync.useEffect": ()=>{
            callRef.current = uiStore.call;
            positionRef.current = callPrefsStore.position;
            popoverWidthRef.current = callPrefsStore.popoverWidth;
            actionsRef.current = {
                answerCall: uiStore.answerCall,
                endCall: uiStore.endCall,
                toggleMute: uiStore.toggleMute,
                toggleHold: uiStore.toggleHold,
                toggleRecording: uiStore.toggleRecording,
                setIncomingCall: uiStore.setIncomingCall,
                setPosition: callPrefsStore.setPosition,
                setPopoverWidth: callPrefsStore.setPopoverWidth
            };
        }
    }["useCrossTabSync.useEffect"]);
    // Handle incoming sync messages - STABILIZED with refs to prevent circular loops
    const handleSyncMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCrossTabSync.useCallback[handleSyncMessage]": (message)=>{
            // Ignore old messages (more than 5 seconds old)
            if (Date.now() - message.timestamp > 5000) {
                return;
            }
            // Set flag to prevent broadcasting while processing sync
            isProcessingSyncRef.current = true;
            try {
                const call = callRef.current;
                const position = positionRef.current;
                const popoverWidth = popoverWidthRef.current;
                const actions = actionsRef.current;
                switch(message.type){
                    case "CALL_INCOMING":
                        {
                            const callData = message.data;
                            if (call.status === "idle") {
                                actions.setIncomingCall({
                                    number: callData.caller.number,
                                    name: callData.caller.name || "Unknown",
                                    avatar: callData.caller.avatar
                                });
                            }
                            break;
                        }
                    case "CALL_ANSWERED":
                        {
                            if (call.status === "incoming") {
                                actions.answerCall();
                            }
                            break;
                        }
                    case "CALL_ENDED":
                        {
                            if (call.status !== "idle" && call.status !== "ended") {
                                actions.endCall();
                            }
                            break;
                        }
                    case "CALL_ACTION":
                        {
                            const action = message.data;
                            switch(action){
                                case "mute":
                                    if (!call.isMuted) {
                                        actions.toggleMute();
                                    }
                                    break;
                                case "unmute":
                                    if (call.isMuted) {
                                        actions.toggleMute();
                                    }
                                    break;
                                case "hold":
                                    if (!call.isOnHold) {
                                        actions.toggleHold();
                                    }
                                    break;
                                case "unhold":
                                    if (call.isOnHold) {
                                        actions.toggleHold();
                                    }
                                    break;
                                case "record_start":
                                    if (!call.isRecording) {
                                        actions.toggleRecording();
                                    }
                                    break;
                                case "record_stop":
                                    if (call.isRecording) {
                                        actions.toggleRecording();
                                    }
                                    break;
                            }
                            break;
                        }
                    case "POSITION_UPDATE":
                        {
                            const newPosition = message.data;
                            if (position !== "default" && (position.x !== newPosition.x || position.y !== newPosition.y)) {
                                actions.setPosition(newPosition);
                            }
                            break;
                        }
                    case "SIZE_UPDATE":
                        {
                            const newWidth = message.data;
                            if (popoverWidth !== newWidth) {
                                actions.setPopoverWidth(newWidth);
                            }
                            break;
                        }
                }
            } finally{
                // Always reset the flag after processing
                isProcessingSyncRef.current = false;
            }
        }
    }["useCrossTabSync.useCallback[handleSyncMessage]"], []);
    // Setup localStorage fallback for older browsers
    const setupLocalStorageFallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCrossTabSync.useCallback[setupLocalStorageFallback]": ()=>{
            const handleStorageEvent = {
                "useCrossTabSync.useCallback[setupLocalStorageFallback].handleStorageEvent": (e)=>{
                    if (e.key === STORAGE_KEY && e.newValue) {
                        try {
                            const message = JSON.parse(e.newValue);
                            handleSyncMessage(message);
                        } catch (_error) {}
                    }
                }
            }["useCrossTabSync.useCallback[setupLocalStorageFallback].handleStorageEvent"];
            window.addEventListener("storage", handleStorageEvent);
            return ({
                "useCrossTabSync.useCallback[setupLocalStorageFallback]": ()=>{
                    window.removeEventListener("storage", handleStorageEvent);
                }
            })["useCrossTabSync.useCallback[setupLocalStorageFallback]"];
        }
    }["useCrossTabSync.useCallback[setupLocalStorageFallback]"], [
        handleSyncMessage
    ]);
    // Initialize BroadcastChannel or fallback
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCrossTabSync.useEffect": ()=>{
            // Try BroadcastChannel (modern browsers)
            if (typeof BroadcastChannel !== "undefined") {
                try {
                    channelRef.current = new BroadcastChannel(CHANNEL_NAME);
                    channelRef.current.onmessage = ({
                        "useCrossTabSync.useEffect": (event)=>{
                            handleSyncMessage(event.data);
                        }
                    })["useCrossTabSync.useEffect"];
                } catch (_error) {
                    setupLocalStorageFallback();
                }
            } else {
                setupLocalStorageFallback();
            }
            // Listen for localStorage changes to sync persisted preferences across tabs
            const handleStorageChange = {
                "useCrossTabSync.useEffect.handleStorageChange": (e)=>{
                    // Zustand persist uses this key for call preferences
                    if (e.key === "call-preferences-storage" && e.newValue) {
                        try {
                            const newState = JSON.parse(e.newValue);
                            const position = positionRef.current;
                            const popoverWidth = popoverWidthRef.current;
                            const actions = actionsRef.current;
                            // Update position if changed
                            if (newState.state?.position && JSON.stringify(newState.state.position) !== JSON.stringify(position)) {
                                actions.setPosition(newState.state.position);
                            }
                            // Update width if changed
                            if (newState.state?.popoverWidth && newState.state.popoverWidth !== popoverWidth) {
                                actions.setPopoverWidth(newState.state.popoverWidth);
                            }
                        } catch (_error) {}
                    }
                }
            }["useCrossTabSync.useEffect.handleStorageChange"];
            window.addEventListener("storage", handleStorageChange);
            return ({
                "useCrossTabSync.useEffect": ()=>{
                    if (channelRef.current) {
                        channelRef.current.close();
                    }
                    window.removeEventListener("storage", handleStorageChange);
                }
            })["useCrossTabSync.useEffect"];
        }
    }["useCrossTabSync.useEffect"], [
        handleSyncMessage,
        setupLocalStorageFallback
    ]); // ✅ Only stable callbacks
    // Broadcast a message to other tabs
    const broadcast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCrossTabSync.useCallback[broadcast]": (message)=>{
            // Don't broadcast if we're currently processing a sync message (prevents infinite loops)
            if (isProcessingSyncRef.current) {
                return;
            }
            if (channelRef.current) {
                // Use BroadcastChannel (doesn't echo back to sender)
                channelRef.current.postMessage(message);
            } else {
                // Use localStorage fallback (will echo back, but we ignore it via timestamp check)
                localStorage.setItem(STORAGE_KEY, JSON.stringify(message));
                // Clear immediately to allow same message to be sent again
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }["useCrossTabSync.useCallback[broadcast]"], []);
    // Public API for broadcasting events
    return {
        broadcastIncomingCall: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useCrossTabSync.useCallback": (caller)=>{
                broadcast({
                    type: "CALL_INCOMING",
                    timestamp: Date.now(),
                    data: {
                        caller
                    }
                });
            }
        }["useCrossTabSync.useCallback"], [
            broadcast
        ]),
        broadcastCallAnswered: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useCrossTabSync.useCallback": ()=>{
                broadcast({
                    type: "CALL_ANSWERED",
                    timestamp: Date.now()
                });
            }
        }["useCrossTabSync.useCallback"], [
            broadcast
        ]),
        broadcastCallEnded: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useCrossTabSync.useCallback": ()=>{
                broadcast({
                    type: "CALL_ENDED",
                    timestamp: Date.now()
                });
            }
        }["useCrossTabSync.useCallback"], [
            broadcast
        ]),
        broadcastCallAction: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useCrossTabSync.useCallback": (action)=>{
                broadcast({
                    type: "CALL_ACTION",
                    timestamp: Date.now(),
                    data: action
                });
            }
        }["useCrossTabSync.useCallback"], [
            broadcast
        ]),
        broadcastPositionUpdate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useCrossTabSync.useCallback": (x, y)=>{
                broadcast({
                    type: "POSITION_UPDATE",
                    timestamp: Date.now(),
                    data: {
                        x,
                        y
                    }
                });
            }
        }["useCrossTabSync.useCallback"], [
            broadcast
        ]),
        broadcastSizeUpdate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useCrossTabSync.useCallback": (width)=>{
                broadcast({
                    type: "SIZE_UPDATE",
                    timestamp: Date.now(),
                    data: width
                });
            }
        }["useCrossTabSync.useCallback"], [
            broadcast
        ])
    };
}
_s(useCrossTabSync, "9q5gcckHQKVd12Av4NZaD7gGmVU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$ui$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/use-draggable-position.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * useDraggablePosition Hook
 *
 * Enables drag-to-move functionality for the call popover
 *
 * Features:
 * - Click and drag header to reposition
 * - Constrain to viewport boundaries
 * - Edge snapping (20px threshold)
 * - Position persistence via preferences store
 * - Visual feedback while dragging
 * - Touch support for mobile
 */ __turbopack_context__.s([
    "useDraggablePosition",
    ()=>useDraggablePosition
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/call-preferences-store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
const DEFAULT_SNAP_THRESHOLD = 20;
const POP_OUT_THRESHOLD = 50; // pixels beyond window edge
function useDraggablePosition(options) {
    _s();
    const { width, height, snapThreshold = DEFAULT_SNAP_THRESHOLD, onDragStart, onDragEnd, onBeyondBounds } = options;
    const position = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"])({
        "useDraggablePosition.useCallPreferencesStore[position]": (state)=>state.position
    }["useDraggablePosition.useCallPreferencesStore[position]"]);
    const setPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"])({
        "useDraggablePosition.useCallPreferencesStore[setPosition]": (state)=>state.setPosition
    }["useDraggablePosition.useCallPreferencesStore[setPosition]"]);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Lazy initialization to avoid SSR issues with window
    const [currentPosition, setCurrentPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useDraggablePosition.useState": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return position === "default" ? {
                x: window.innerWidth - width - 24,
                y: 24
            } : position;
        }
    }["useDraggablePosition.useState"]);
    const dragStartPosRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0
    });
    const dragOffsetRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0
    });
    const animationFrameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isDraggingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Update current position when width changes or store position changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDraggablePosition.useEffect": ()=>{
            if (!isDragging && ("TURBOPACK compile-time value", "object") !== "undefined") {
                if (position === "default") {
                    const defaultPos = {
                        x: window.innerWidth - width - 24,
                        y: 24
                    };
                    setCurrentPosition(defaultPos);
                } else {
                    setCurrentPosition(position);
                }
            }
        }
    }["useDraggablePosition.useEffect"], [
        position,
        width,
        isDragging
    ]);
    // Check if position is beyond window bounds (for pop-out detection)
    const checkBeyondBounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDraggablePosition.useCallback[checkBeyondBounds]": (pos)=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return pos.x < -POP_OUT_THRESHOLD || pos.y < -POP_OUT_THRESHOLD || pos.x > window.innerWidth + POP_OUT_THRESHOLD || pos.y > window.innerHeight + POP_OUT_THRESHOLD;
        }
    }["useDraggablePosition.useCallback[checkBeyondBounds]"], []);
    // Constrain position to viewport with optional edge snapping
    const constrainPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDraggablePosition.useCallback[constrainPosition]": (pos, allowBeyondBounds = false)=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            let { x, y } = pos;
            if (!allowBeyondBounds) {
                // Hard constraints
                x = Math.max(0, Math.min(x, window.innerWidth - width));
                y = Math.max(0, Math.min(y, window.innerHeight - height));
                // Edge snapping
                if (x < snapThreshold) {
                    x = 0;
                }
                if (y < snapThreshold) {
                    y = 0;
                }
                if (window.innerWidth - x - width < snapThreshold) {
                    x = window.innerWidth - width;
                }
                if (window.innerHeight - y - height < snapThreshold) {
                    y = window.innerHeight - height;
                }
            }
            return {
                x,
                y
            };
        }
    }["useDraggablePosition.useCallback[constrainPosition]"], [
        width,
        height,
        snapThreshold
    ]);
    // Handle drag start
    const handleDragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDraggablePosition.useCallback[handleDragStart]": (clientX, clientY, _element)=>{
            isDraggingRef.current = true;
            setIsDragging(true);
            dragStartPosRef.current = {
                x: clientX,
                y: clientY
            };
            dragOffsetRef.current = {
                x: clientX - currentPosition.x,
                y: clientY - currentPosition.y
            };
            onDragStart?.();
        }
    }["useDraggablePosition.useCallback[handleDragStart]"], [
        currentPosition,
        onDragStart
    ]);
    // Mouse events
    const handleMouseDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDraggablePosition.useCallback[handleMouseDown]": (e)=>{
            // Only start drag if clicking on drag handle area
            const target = e.target;
            if (target.closest("[data-drag-handle]")) {
                e.preventDefault();
                // Find the draggable container (go up to the element with drag handlers)
                const container = e.currentTarget.closest("[data-draggable-container]");
                if (container) {
                    handleDragStart(e.clientX, e.clientY, container);
                }
            }
        }
    }["useDraggablePosition.useCallback[handleMouseDown]"], [
        handleDragStart
    ]);
    // Touch events
    const handleTouchStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDraggablePosition.useCallback[handleTouchStart]": (e)=>{
            const target = e.target;
            if (target.closest("[data-drag-handle]")) {
                e.preventDefault();
                const touch = e.touches[0];
                const container = e.currentTarget.closest("[data-draggable-container]");
                if (container) {
                    handleDragStart(touch.clientX, touch.clientY, container);
                }
            }
        }
    }["useDraggablePosition.useCallback[handleTouchStart]"], [
        handleDragStart
    ]);
    // Use refs for callbacks to prevent listener stacking (CRITICAL FIX)
    const constrainPositionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(constrainPosition);
    const checkBeyondBoundsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(checkBeyondBounds);
    const onBeyondBoundsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onBeyondBounds);
    const onDragEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onDragEnd);
    const setPositionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(setPosition);
    // Keep refs up to date
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDraggablePosition.useEffect": ()=>{
            constrainPositionRef.current = constrainPosition;
            checkBeyondBoundsRef.current = checkBeyondBounds;
            onBeyondBoundsRef.current = onBeyondBounds;
            onDragEndRef.current = onDragEnd;
            setPositionRef.current = setPosition;
        }
    }["useDraggablePosition.useEffect"]);
    // Handle dragging
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDraggablePosition.useEffect": ()=>{
            if (!isDragging) {
                return;
            }
            const handleMouseMove = {
                "useDraggablePosition.useEffect.handleMouseMove": (e)=>{
                    if (!isDraggingRef.current) {
                        return;
                    }
                    // Cancel any pending animation frame
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                    }
                    // Use requestAnimationFrame for smooth, performant updates
                    animationFrameRef.current = requestAnimationFrame({
                        "useDraggablePosition.useEffect.handleMouseMove": ()=>{
                            const newPos = {
                                x: e.clientX - dragOffsetRef.current.x,
                                y: e.clientY - dragOffsetRef.current.y
                            };
                            // Check if beyond bounds for pop-out
                            const isBeyond = checkBeyondBoundsRef.current(newPos);
                            onBeyondBoundsRef.current?.(isBeyond);
                            // Allow position beyond bounds while dragging (for pop-out)
                            const constrainedPos = constrainPositionRef.current(newPos, true);
                            // Update local state (no store update = fast)
                            setCurrentPosition(constrainedPos);
                        }
                    }["useDraggablePosition.useEffect.handleMouseMove"]);
                }
            }["useDraggablePosition.useEffect.handleMouseMove"];
            const handleMouseUp = {
                "useDraggablePosition.useEffect.handleMouseUp": (e)=>{
                    if (!isDraggingRef.current) {
                        return;
                    }
                    // Cancel any pending animation frame
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                    }
                    const finalPos = {
                        x: e.clientX - dragOffsetRef.current.x,
                        y: e.clientY - dragOffsetRef.current.y
                    };
                    const isBeyond = checkBeyondBoundsRef.current(finalPos);
                    if (!isBeyond) {
                        // Normal drop - constrain and save (only save to store on drop, not during drag)
                        const constrainedPos = constrainPositionRef.current(finalPos, false);
                        setCurrentPosition(constrainedPos);
                        setPositionRef.current(constrainedPos);
                    }
                    isDraggingRef.current = false;
                    setIsDragging(false);
                    onBeyondBoundsRef.current?.(false);
                    onDragEndRef.current?.();
                }
            }["useDraggablePosition.useEffect.handleMouseUp"];
            const handleTouchMove = {
                "useDraggablePosition.useEffect.handleTouchMove": (e)=>{
                    if (!isDraggingRef.current) {
                        return;
                    }
                    // Cancel any pending animation frame
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                    }
                    // Use requestAnimationFrame for smooth, performant updates
                    animationFrameRef.current = requestAnimationFrame({
                        "useDraggablePosition.useEffect.handleTouchMove": ()=>{
                            const touch = e.touches[0];
                            const newPos = {
                                x: touch.clientX - dragOffsetRef.current.x,
                                y: touch.clientY - dragOffsetRef.current.y
                            };
                            const isBeyond = checkBeyondBoundsRef.current(newPos);
                            onBeyondBoundsRef.current?.(isBeyond);
                            const constrainedPos = constrainPositionRef.current(newPos, true);
                            // Update local state (no store update = fast)
                            setCurrentPosition(constrainedPos);
                        }
                    }["useDraggablePosition.useEffect.handleTouchMove"]);
                }
            }["useDraggablePosition.useEffect.handleTouchMove"];
            const handleTouchEnd = {
                "useDraggablePosition.useEffect.handleTouchEnd": (e)=>{
                    if (!isDraggingRef.current) {
                        return;
                    }
                    // Cancel any pending animation frame
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                    }
                    const touch = e.changedTouches[0];
                    const finalPos = {
                        x: touch.clientX - dragOffsetRef.current.x,
                        y: touch.clientY - dragOffsetRef.current.y
                    };
                    const isBeyond = checkBeyondBoundsRef.current(finalPos);
                    if (!isBeyond) {
                        const constrainedPos = constrainPositionRef.current(finalPos, false);
                        setCurrentPosition(constrainedPos);
                        setPositionRef.current(constrainedPos);
                    }
                    isDraggingRef.current = false;
                    setIsDragging(false);
                    onBeyondBoundsRef.current?.(false);
                    onDragEndRef.current?.();
                }
            }["useDraggablePosition.useEffect.handleTouchEnd"];
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("touchmove", handleTouchMove);
            document.addEventListener("touchend", handleTouchEnd);
            return ({
                "useDraggablePosition.useEffect": ()=>{
                    document.removeEventListener("mousemove", handleMouseMove);
                    document.removeEventListener("mouseup", handleMouseUp);
                    document.removeEventListener("touchmove", handleTouchMove);
                    document.removeEventListener("touchend", handleTouchEnd);
                    // Cleanup animation frame
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                    }
                }
            })["useDraggablePosition.useEffect"];
        }
    }["useDraggablePosition.useEffect"], [
        isDragging
    ]); // ✅ Only isDragging - uses refs for callbacks
    // Reset to default position
    const resetPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDraggablePosition.useCallback[resetPosition]": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const defaultPos = {
                x: window.innerWidth - width - 24,
                y: 24
            };
            setCurrentPosition(defaultPos);
            setPosition(defaultPos);
        }
    }["useDraggablePosition.useCallback[resetPosition]"], [
        width,
        setPosition
    ]);
    return {
        position: currentPosition,
        isDragging,
        handleMouseDown,
        handleTouchStart,
        resetPosition
    };
}
_s(useDraggablePosition, "JCTAnQ5mHKOsjc6+DIJIt23oAuQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/use-pop-out-drag.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * usePopOutDrag Hook
 *
 * Manages pop-out window creation when call UI is dragged beyond window bounds
 *
 * Features:
 * - Detects when drag exceeds threshold (50px beyond edge)
 * - Shows visual indicator when in pop-out zone
 * - Creates pop-out window on release
 * - Manages pop-out state and communication
 * - Handles returning call to main window
 *
 * Works with useDraggablePosition hook for drag detection
 */ __turbopack_context__.s([
    "usePopOutDrag",
    ()=>usePopOutDrag
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function usePopOutDrag(options) {
    _s();
    const { callId, onPopOutCreated, onPopOutClosed } = options;
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        isPopOutZone: false,
        isPopOutActive: false,
        popOutWindow: null
    });
    const popOutWindowRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const messageHandlerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Handle when user drags into/out of pop-out zone
    const handleBeyondBounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePopOutDrag.useCallback[handleBeyondBounds]": (isBeyond)=>{
            setState({
                "usePopOutDrag.useCallback[handleBeyondBounds]": (prev)=>({
                        ...prev,
                        isPopOutZone: isBeyond && !prev.isPopOutActive
                    })
            }["usePopOutDrag.useCallback[handleBeyondBounds]"]);
        }
    }["usePopOutDrag.useCallback[handleBeyondBounds]"], []);
    // Handle when pop-out window is closed
    const handlePopOutClosed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePopOutDrag.useCallback[handlePopOutClosed]": ()=>{
            popOutWindowRef.current = null;
            setState({
                "usePopOutDrag.useCallback[handlePopOutClosed]": (prev)=>({
                        ...prev,
                        isPopOutActive: false,
                        popOutWindow: null
                    })
            }["usePopOutDrag.useCallback[handlePopOutClosed]"]);
            onPopOutClosed?.();
        }
    }["usePopOutDrag.useCallback[handlePopOutClosed]"], [
        onPopOutClosed
    ]);
    // Create call window in new tab
    const createPopOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePopOutDrag.useCallback[createPopOut]": ()=>{
            if (state.isPopOutActive || popOutWindowRef.current) {
                return;
            }
            // Open in new tab (much simpler and more reliable)
            const popOut = window.open(`/call?callId=${callId}`, "_blank", "noopener,noreferrer");
            if (!popOut) {
                return;
            }
            popOutWindowRef.current = popOut;
            setState({
                "usePopOutDrag.useCallback[createPopOut]": (prev)=>({
                        ...prev,
                        isPopOutActive: true,
                        isPopOutZone: false,
                        popOutWindow: popOut
                    })
            }["usePopOutDrag.useCallback[createPopOut]"]);
            // Wait for pop-out to load, then send call data
            const checkInterval = setInterval({
                "usePopOutDrag.useCallback[createPopOut].checkInterval": ()=>{
                    if (popOut.closed) {
                        clearInterval(checkInterval);
                        handlePopOutClosed();
                        return;
                    }
                    try {
                        // Send call state to pop-out window
                        popOut.postMessage({
                            type: "CALL_STATE_INIT",
                            callId,
                            timestamp: Date.now()
                        }, window.location.origin);
                        // Successfully sent, stop checking
                        clearInterval(checkInterval);
                        onPopOutCreated?.();
                    } catch (_error) {
                    // Pop-out not ready yet, continue checking
                    }
                }
            }["usePopOutDrag.useCallback[createPopOut].checkInterval"], 100);
            // Stop checking after 5 seconds
            setTimeout({
                "usePopOutDrag.useCallback[createPopOut]": ()=>clearInterval(checkInterval)
            }["usePopOutDrag.useCallback[createPopOut]"], 5000);
            // Monitor for pop-out window close
            const closeInterval = setInterval({
                "usePopOutDrag.useCallback[createPopOut].closeInterval": ()=>{
                    if (popOut.closed) {
                        clearInterval(closeInterval);
                        handlePopOutClosed();
                    }
                }
            }["usePopOutDrag.useCallback[createPopOut].closeInterval"], 500);
            return ({
                "usePopOutDrag.useCallback[createPopOut]": ()=>{
                    clearInterval(checkInterval);
                    clearInterval(closeInterval);
                }
            })["usePopOutDrag.useCallback[createPopOut]"];
        }
    }["usePopOutDrag.useCallback[createPopOut]"], [
        callId,
        state.isPopOutActive,
        onPopOutCreated,
        handlePopOutClosed
    ]);
    // Close pop-out and return call to main window
    const returnToMain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePopOutDrag.useCallback[returnToMain]": ()=>{
            if (popOutWindowRef.current && !popOutWindowRef.current.closed) {
                popOutWindowRef.current.close();
            }
            handlePopOutClosed();
        }
    }["usePopOutDrag.useCallback[returnToMain]"], [
        handlePopOutClosed
    ]);
    // Bring pop-out window to front
    const focusPopOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePopOutDrag.useCallback[focusPopOut]": ()=>{
            if (popOutWindowRef.current && !popOutWindowRef.current.closed) {
                popOutWindowRef.current.focus();
            }
        }
    }["usePopOutDrag.useCallback[focusPopOut]"], []);
    // Handle messages from pop-out window
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePopOutDrag.useEffect": ()=>{
            const handleMessage = {
                "usePopOutDrag.useEffect.handleMessage": (event)=>{
                    // Security: Verify origin
                    if (event.origin !== window.location.origin) {
                        return;
                    }
                    const { type, callId: messageCallId } = event.data;
                    // Only handle messages for this call
                    if (messageCallId !== callId) {
                        return;
                    }
                    switch(type){
                        case "CALL_POP_OUT_READY":
                            // Pop-out window is ready to receive data
                            if (popOutWindowRef.current) {
                                popOutWindowRef.current.postMessage({
                                    type: "CALL_STATE_SYNC",
                                    callId,
                                    timestamp: Date.now()
                                }, window.location.origin);
                            }
                            break;
                        case "CALL_POP_OUT_CLOSED":
                            // Pop-out requested to close
                            handlePopOutClosed();
                            break;
                        case "CALL_ACTION":
                            break;
                        default:
                            break;
                    }
                }
            }["usePopOutDrag.useEffect.handleMessage"];
            messageHandlerRef.current = handleMessage;
            window.addEventListener("message", handleMessage);
            return ({
                "usePopOutDrag.useEffect": ()=>{
                    if (messageHandlerRef.current) {
                        window.removeEventListener("message", messageHandlerRef.current);
                    }
                }
            })["usePopOutDrag.useEffect"];
        }
    }["usePopOutDrag.useEffect"], [
        callId,
        handlePopOutClosed
    ]);
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePopOutDrag.useEffect": ()=>({
                "usePopOutDrag.useEffect": ()=>{
                    if (popOutWindowRef.current && !popOutWindowRef.current.closed) {
                        popOutWindowRef.current.close();
                    }
                }
            })["usePopOutDrag.useEffect"]
    }["usePopOutDrag.useEffect"], []);
    return {
        // State
        isPopOutZone: state.isPopOutZone,
        isPopOutActive: state.isPopOutActive,
        popOutWindow: state.popOutWindow,
        // Actions
        handleBeyondBounds,
        createPopOut,
        returnToMain,
        focusPopOut
    };
}
_s(usePopOutDrag, "o3V8XUrBFKVD2ukXZr2DANa5KSU=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/use-resizable-multi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * useResizableMulti Hook
 *
 * Multi-directional resize functionality with snap points
 *
 * Features:
 * - Resize from any edge (top, right, bottom, left)
 * - Resize from corners (diagonal resizing)
 * - Snap points at common sizes
 * - Min/max width and height constraints
 * - Persists size to preferences store
 * - Adjusts position when resizing from top/left
 *
 * Performance optimizations:
 * - Uses requestAnimationFrame for smooth resizing
 * - Debounced store updates
 */ __turbopack_context__.s([
    "useResizableMulti",
    ()=>useResizableMulti
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/call-preferences-store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
const DEFAULT_SNAP_POINTS = [
    600,
    800,
    1000,
    1200
];
const DEFAULT_MIN_WIDTH = 420;
const DEFAULT_MAX_WIDTH = 1400;
const DEFAULT_MIN_HEIGHT = 400;
const DEFAULT_MAX_HEIGHT = 2000;
const DEFAULT_SNAP_THRESHOLD = 30;
function useResizableMulti(currentPosition, currentHeight, options = {}) {
    _s();
    const { minWidth = DEFAULT_MIN_WIDTH, maxWidth = DEFAULT_MAX_WIDTH, minHeight = DEFAULT_MIN_HEIGHT, maxHeight = DEFAULT_MAX_HEIGHT, snapPoints = DEFAULT_SNAP_POINTS, snapThreshold = DEFAULT_SNAP_THRESHOLD, onResize } = options;
    const width = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"])({
        "useResizableMulti.useCallPreferencesStore[width]": (state)=>state.popoverWidth
    }["useResizableMulti.useCallPreferencesStore[width]"]);
    const setPopoverWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"])({
        "useResizableMulti.useCallPreferencesStore[setPopoverWidth]": (state)=>state.setPopoverWidth
    }["useResizableMulti.useCallPreferencesStore[setPopoverWidth]"]);
    const setPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"])({
        "useResizableMulti.useCallPreferencesStore[setPosition]": (state)=>state.setPosition
    }["useResizableMulti.useCallPreferencesStore[setPosition]"]);
    const [isResizing, setIsResizing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeDirection, setActiveDirection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Local state for instant updates during resize (no store latency)
    const [localState, setLocalState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        width,
        height: currentHeight,
        x: currentPosition.x,
        y: currentPosition.y
    });
    const startRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        posX: 0,
        posY: 0
    });
    const animationFrameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isResizingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Apply snap to value
    const applySnap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useResizableMulti.useCallback[applySnap]": (value)=>{
            for (const snapPoint of snapPoints){
                if (Math.abs(value - snapPoint) < snapThreshold) {
                    return snapPoint;
                }
            }
            return value;
        }
    }["useResizableMulti.useCallback[applySnap]"], [
        snapPoints,
        snapThreshold
    ]);
    // Sync local state with props when not resizing
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useResizableMulti.useEffect": ()=>{
            if (!isResizing) {
                setLocalState({
                    width,
                    height: currentHeight,
                    x: currentPosition.x,
                    y: currentPosition.y
                });
            }
        }
    }["useResizableMulti.useEffect"], [
        width,
        currentHeight,
        currentPosition,
        isResizing
    ]);
    // Handle resize start
    const handleResizeStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useResizableMulti.useCallback[handleResizeStart]": (e, direction)=>{
            e.preventDefault();
            e.stopPropagation();
            const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
            const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
            isResizingRef.current = true;
            setIsResizing(true);
            setActiveDirection(direction);
            startRef.current = {
                x: clientX,
                y: clientY,
                width: localState.width,
                height: localState.height,
                posX: localState.x,
                posY: localState.y
            };
        }
    }["useResizableMulti.useCallback[handleResizeStart]"], [
        localState
    ]);
    // Calculate new dimensions based on direction
    const calculateResize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useResizableMulti.useCallback[calculateResize]": (deltaX, deltaY, direction)=>{
            const { width: startWidth, height: startHeight, posX: startPosX, posY: startPosY } = startRef.current;
            let newWidth = startWidth;
            let newHeight = startHeight;
            let newX = startPosX;
            let newY = startPosY;
            // Handle horizontal resizing
            if (direction.includes("e")) {
                // Resize from right edge (width increases with mouse movement right)
                newWidth = startWidth + deltaX;
            } else if (direction.includes("w")) {
                // Resize from left edge (width increases with mouse movement left, position adjusts)
                newWidth = startWidth - deltaX;
                newX = startPosX + deltaX;
            }
            // Handle vertical resizing
            if (direction.includes("s")) {
                // Resize from bottom edge (height increases with mouse movement down)
                newHeight = startHeight + deltaY;
            } else if (direction.includes("n")) {
                // Resize from top edge (height increases with mouse movement up, position adjusts)
                newHeight = startHeight - deltaY;
                newY = startPosY + deltaY;
            }
            // Apply constraints
            newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
            newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
            // Apply snap points (only to width for now)
            newWidth = applySnap(newWidth);
            // If we hit min/max constraints, adjust position back
            if (direction.includes("w")) {
                const actualWidthChange = newWidth - startWidth;
                newX = startPosX - actualWidthChange;
            }
            if (direction.includes("n")) {
                const actualHeightChange = newHeight - startHeight;
                newY = startPosY - actualHeightChange;
            }
            return {
                width: newWidth,
                height: newHeight,
                x: newX,
                y: newY
            };
        }
    }["useResizableMulti.useCallback[calculateResize]"], [
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        applySnap
    ]);
    // Use refs for callbacks to prevent listener stacking (CRITICAL FIX)
    const calculateResizeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(calculateResize);
    const onResizeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onResize);
    const setPopoverWidthRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(setPopoverWidth);
    const setPositionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(setPosition);
    const localStateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(localState);
    // Keep refs up to date
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useResizableMulti.useEffect": ()=>{
            calculateResizeRef.current = calculateResize;
            onResizeRef.current = onResize;
            setPopoverWidthRef.current = setPopoverWidth;
            setPositionRef.current = setPosition;
            localStateRef.current = localState;
        }
    }["useResizableMulti.useEffect"]);
    // Handle resize move
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useResizableMulti.useEffect": ()=>{
            if (!(isResizing && activeDirection)) {
                return;
            }
            const handleMove = {
                "useResizableMulti.useEffect.handleMove": (e)=>{
                    if (!isResizingRef.current) {
                        return;
                    }
                    // Cancel any pending animation frame
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                    }
                    // Use requestAnimationFrame for smooth, performant updates
                    animationFrameRef.current = requestAnimationFrame({
                        "useResizableMulti.useEffect.handleMove": ()=>{
                            const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
                            const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
                            const deltaX = clientX - startRef.current.x;
                            const deltaY = clientY - startRef.current.y;
                            const newState = calculateResizeRef.current(deltaX, deltaY, activeDirection);
                            // Update local state (no store update = fast)
                            setLocalState(newState);
                            localStateRef.current = newState;
                            // Trigger callback for other updates (like height state in parent)
                            onResizeRef.current?.(newState.width, newState.height, newState.x, newState.y);
                        }
                    }["useResizableMulti.useEffect.handleMove"]);
                }
            }["useResizableMulti.useEffect.handleMove"];
            const handleEnd = {
                "useResizableMulti.useEffect.handleEnd": ()=>{
                    if (!isResizingRef.current) {
                        return;
                    }
                    // Cancel any pending animation frame
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                    }
                    // Save to store once at the end (prevents lag during resize)
                    const currentState = localStateRef.current;
                    setPopoverWidthRef.current(currentState.width);
                    setPositionRef.current({
                        x: currentState.x,
                        y: currentState.y
                    });
                    isResizingRef.current = false;
                    setIsResizing(false);
                    setActiveDirection(null);
                }
            }["useResizableMulti.useEffect.handleEnd"];
            document.addEventListener("mousemove", handleMove);
            document.addEventListener("mouseup", handleEnd);
            document.addEventListener("touchmove", handleMove);
            document.addEventListener("touchend", handleEnd);
            return ({
                "useResizableMulti.useEffect": ()=>{
                    document.removeEventListener("mousemove", handleMove);
                    document.removeEventListener("mouseup", handleEnd);
                    document.removeEventListener("touchmove", handleMove);
                    document.removeEventListener("touchend", handleEnd);
                    // Cleanup animation frame
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                    }
                }
            })["useResizableMulti.useEffect"];
        }
    }["useResizableMulti.useEffect"], [
        isResizing,
        activeDirection
    ]); // ✅ Stable dependencies only
    // Create handle props for each direction
    const createHandleProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useResizableMulti.useCallback[createHandleProps]": (direction)=>({
                onMouseDown: ({
                    "useResizableMulti.useCallback[createHandleProps]": (e)=>handleResizeStart(e, direction)
                })["useResizableMulti.useCallback[createHandleProps]"],
                onTouchStart: ({
                    "useResizableMulti.useCallback[createHandleProps]": (e)=>handleResizeStart(e, direction)
                })["useResizableMulti.useCallback[createHandleProps]"]
            })
    }["useResizableMulti.useCallback[createHandleProps]"], [
        handleResizeStart
    ]);
    return {
        // State - always use local state for instant updates
        width: localState.width,
        height: localState.height,
        position: {
            x: localState.x,
            y: localState.y
        },
        isResizing,
        activeDirection,
        // Handle props generators
        handleNorth: createHandleProps("n"),
        handleEast: createHandleProps("e"),
        handleSouth: createHandleProps("s"),
        handleWest: createHandleProps("w"),
        handleNorthEast: createHandleProps("ne"),
        handleSouthEast: createHandleProps("se"),
        handleSouthWest: createHandleProps("sw"),
        handleNorthWest: createHandleProps("nw")
    };
}
_s(useResizableMulti, "E9UbSojsRhfbua55KUf2bjiXMD0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/stores/transcript-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Transcript Store - Zustand State Management
 *
 * Manages live call transcript state including:
 * - Real-time transcript entries with speaker detection
 * - AI analysis status for each transcript segment
 * - Transcript search and export functionality
 * - Speaker identification and timestamp tracking
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Selective subscriptions prevent unnecessary re-renders
 */ __turbopack_context__.s([
    "useTranscriptStore",
    ()=>useTranscriptStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
// Initial state
const initialState = {
    entries: [],
    isRecording: false,
    currentSpeaker: null,
    searchQuery: "",
    filteredEntries: []
};
const useTranscriptStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devtools"])((set, get)=>({
        ...initialState,
        addEntry: (entry)=>{
            const newEntry = {
                ...entry,
                id: `transcript-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                timestamp: Date.now(),
                isAnalyzing: false
            };
            set((state)=>{
                const entries = [
                    ...state.entries,
                    newEntry
                ];
                return {
                    entries,
                    filteredEntries: state.searchQuery ? entries.filter((e)=>e.text.toLowerCase().includes(state.searchQuery.toLowerCase())) : entries
                };
            });
        },
        updateEntry: (id, updates)=>{
            set((state)=>{
                const entries = state.entries.map((entry)=>entry.id === id ? {
                        ...entry,
                        ...updates
                    } : entry);
                return {
                    entries,
                    filteredEntries: state.searchQuery ? entries.filter((e)=>e.text.toLowerCase().includes(state.searchQuery.toLowerCase())) : entries
                };
            });
        },
        markAsAnalyzing: (id)=>{
            get().updateEntry(id, {
                isAnalyzing: true
            });
        },
        markAsAnalyzed: (id, extracted)=>{
            get().updateEntry(id, {
                isAnalyzing: false,
                aiExtracted: extracted
            });
        },
        setCurrentSpeaker: (speaker)=>set({
                currentSpeaker: speaker
            }),
        setSearchQuery: (query)=>{
            set((state)=>({
                    searchQuery: query,
                    filteredEntries: query ? state.entries.filter((e)=>e.text.toLowerCase().includes(query.toLowerCase())) : state.entries
                }));
        },
        startRecording: ()=>set({
                isRecording: true
            }),
        stopRecording: ()=>set({
                isRecording: false
            }),
        clearTranscript: ()=>set(initialState),
        exportTranscript: ()=>{
            const { entries } = get();
            return JSON.stringify(entries.map((e)=>({
                    speaker: e.speaker,
                    text: e.text,
                    timestamp: new Date(e.timestamp).toISOString(),
                    aiExtracted: e.aiExtracted
                })), null, 2);
        },
        getFullTranscript: ()=>{
            const { entries } = get();
            return entries.map((e)=>{
                const time = new Date(e.timestamp).toLocaleTimeString();
                const speaker = e.speaker === "csr" ? "CSR" : "Customer";
                return `[${time}] ${speaker}: ${e.text}`;
            }).join("\n");
        }
    }), {
    name: "TranscriptStore"
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/layout/incoming-call-notification.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IncomingCallNotification",
    ()=>IncomingCallNotification
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Incoming Call Notification - Redesigned
 *
 * Complete redesign with dashboard layout, live transcript, and AI auto-fill
 *
 * Features:
 * - Resizable popover (420px - 1400px) with snap points
 * - Dashboard grid layout with customizable cards
 * - Live transcript panel with AI analysis
 * - AI auto-fill preview with one-click approval
 * - Improved visual design (better contrast, spacing, typography)
 * - Keyboard shortcuts
 * - Auto-save functionality
 *
 * Performance optimizations:
 * - Server Components where possible
 * - Lazy loading for heavy components
 * - Memoized card rendering
 * - Debounced auto-save
 */ /**
 * PERFORMANCE FIX: Using dynamic icon imports from icon-registry
 * Reduces bundle size by ~200KB by lazy-loading icons
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$call$2f$call$2d$indicator$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/call/call-indicator-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/badge.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/button.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/card.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$customer$2d$lookup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/use-customer-lookup.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$data$3a$4a9e61__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/apps/web/src/actions/data:4a9e61 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$data$3a$840cd6__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/apps/web/src/actions/data:840cd6 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/avatar.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/textarea.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$cross$2d$tab$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/use-cross-tab-sync.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$draggable$2d$position$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/use-draggable-position.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$pop$2d$out$2d$drag$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/use-pop-out-drag.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$resizable$2d$multi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/use-resizable-multi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$telnyx$2d$webrtc$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/use-telnyx-webrtc.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$ui$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/ui-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/call-preferences-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$transcript$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/transcript-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$web$2d$credentials$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/telnyx/web-credentials-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils.ts [app-client] (ecmascript)");
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
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
"use client";
;
// Dynamic icon imports - only load what's needed
const AlertCircle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.AlertCircle), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c = AlertCircle;
const AlertTriangle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.AlertTriangle), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c1 = AlertTriangle;
const ArrowRightLeft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.ArrowRightLeft), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c2 = ArrowRightLeft;
const Brain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(_c3 = ()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Brain), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c4 = Brain;
const Building2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Building2), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c5 = Building2;
const CheckCircle2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.CheckCircle2), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c6 = CheckCircle2;
const ChevronDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.ChevronDown), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c7 = ChevronDown;
const ChevronUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.ChevronUp), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c8 = ChevronUp;
const Clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Clock), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c9 = Clock;
const FileText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.FileText), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c10 = FileText;
const Hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Hash), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c11 = Hash;
const HelpCircle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.HelpCircle), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c12 = HelpCircle;
const Maximize2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Maximize2), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c13 = Maximize2;
const Mic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Mic), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c14 = Mic;
const MicOff = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.MicOff), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c15 = MicOff;
const Minimize2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Minimize2), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c16 = Minimize2;
const Pause = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Pause), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c17 = Pause;
const Phone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Phone), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c18 = Phone;
const PhoneOff = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.PhoneOff), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c19 = PhoneOff;
const Play = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Play), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c20 = Play;
const Settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Settings), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c21 = Settings;
const Shield = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Shield), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c22 = Shield;
const Square = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Square), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c23 = Square;
const SquareStack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.SquareStack), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c24 = SquareStack;
const Tag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(_c25 = ()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Tag), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c26 = Tag;
const User = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(_c27 = ()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.User), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c28 = User;
const Video = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Video), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c29 = Video;
const VideoOff = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.VideoOff), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c30 = VideoOff;
const Voicemail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Voicemail), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    }
});
_c31 = Voicemail;
;
;
;
;
;
;
/**
 * PERFORMANCE FIX: Heavy components loaded dynamically (only when call is active)
 * - TransferCallModal: ~50KB
 * - AIAutofillPreview: ~30KB
 * - TranscriptPanel: ~40KB
 * - VideoConferenceView: ~100KB+
 * Total savings: ~220KB+ when no call is active
 */ const TransferCallModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/apps/web/src/components/call/transfer-call-modal.tsx [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>({
            default: mod.TransferCallModal
        })), {
    loadableGenerated: {
        modules: [
            "[project]/apps/web/src/components/call/transfer-call-modal.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    loading: ()=>null
});
_c32 = TransferCallModal;
const AIAutofillPreview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/apps/web/src/components/communication/ai-autofill-preview.tsx [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>({
            default: mod.AIAutofillPreview
        })), {
    loadableGenerated: {
        modules: [
            "[project]/apps/web/src/components/communication/ai-autofill-preview.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    loading: ()=>null
});
_c33 = AIAutofillPreview;
const TranscriptPanel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/apps/web/src/components/communication/transcript-panel.tsx [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>({
            default: mod.TranscriptPanel
        })), {
    loadableGenerated: {
        modules: [
            "[project]/apps/web/src/components/communication/transcript-panel.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    loading: ()=>null
});
_c34 = TranscriptPanel;
const VideoConferenceView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/apps/web/src/components/layout/video-conference.tsx [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>({
            default: mod.VideoConferenceView
        })), {
    loadableGenerated: {
        modules: [
            "[project]/apps/web/src/components/layout/video-conference.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    loading: ()=>null
});
_c35 = VideoConferenceView;
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
;
;
// AI Constants
const _AI_SPAM_THRESHOLD = 75;
const _AI_MAX_SCORE = 100;
const _AI_LOW_SPAM_SCORE = 15;
const AI_HIGH_TRUST_SCORE = 95;
const _AI_LOW_TRUST_SCORE = 20;
const AI_MEDIUM_TRUST_SCORE = 60;
const _AI_SPAM_SIMILAR_CALLERS = 47;
const AI_TRUST_HIGH_THRESHOLD = 80;
const AI_TRUST_MEDIUM_THRESHOLD = 50;
// Helper functions
const getPriorityColorClass = (priority)=>{
    if (priority === "high") {
        return "bg-destructive text-destructive-foreground";
    }
    if (priority === "medium") {
        return "bg-warning text-warning-foreground dark:text-warning-foreground";
    }
    return "bg-success text-success-foreground dark:text-success-foreground";
};
const getPriorityTextColorClass = (priority)=>{
    if (priority === "high") {
        return "text-destructive";
    }
    if (priority === "medium") {
        return "text-warning";
    }
    return "text-success";
};
const getTrustScoreColorClass = (score)=>{
    if (score >= AI_TRUST_HIGH_THRESHOLD) {
        return "bg-success";
    }
    if (score >= AI_TRUST_MEDIUM_THRESHOLD) {
        return "bg-warning";
    }
    return "bg-destructive";
};
const getRiskLevelColorClass = (riskLevel)=>{
    if (riskLevel === "high") {
        return "bg-destructive text-destructive";
    }
    if (riskLevel === "medium") {
        return "bg-warning text-warning";
    }
    return "bg-success text-success";
};
const _getVideoButtonClass = (videoStatus)=>{
    if (videoStatus === "connected") {
        return "bg-primary hover:bg-primary/90 text-primary-foreground";
    }
    if (videoStatus === "requesting" || videoStatus === "ringing") {
        return "animate-pulse bg-warning hover:bg-warning/90 text-warning-foreground dark:text-warning-foreground";
    }
    return "bg-background hover:bg-accent text-muted-foreground";
};
/**
 * useCustomerData Hook - MIGRATED TO REACT QUERY
 *
 * Now using useCustomerLookup from /lib/hooks/use-customer-lookup.ts
 * This provides automatic caching, refetching, and better performance.
 *
 * @deprecated Use useCustomerLookup instead
 */ const useCustomerData = (callerNumber, companyId)=>{
    _s();
    const [customerData, setCustomerData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCustomerData.useEffect": ()=>{
            // Cancellation token to prevent state updates after unmount
            let cancelled = false;
            if (!(callerNumber && companyId)) {
                // Return default data for unknown callers
                setCustomerData({
                    name: "Unknown Customer",
                    email: "",
                    phone: callerNumber || "Unknown",
                    company: "",
                    accountStatus: "Unknown",
                    lastContact: "Never",
                    totalCalls: 0,
                    openTickets: 0,
                    priority: "medium",
                    tags: [],
                    recentIssues: [],
                    aiData: {
                        isKnownCustomer: false,
                        isSpam: false,
                        spamConfidence: 0,
                        recognitionSource: "unknown",
                        trustScore: AI_MEDIUM_TRUST_SCORE,
                        callHistory: [],
                        similarCallers: 0,
                        riskLevel: "medium",
                        aiNotes: [
                            "First-time caller",
                            "No prior history",
                            "Standard verification recommended"
                        ]
                    }
                });
                return;
            }
            setIsLoading(true);
            // Fetch real customer data from database
            __turbopack_context__.A("[project]/apps/web/src/actions/customers.ts [app-client] (ecmascript, async loader)").then({
                "useCustomerData.useEffect": ({ getCustomerByPhone })=>getCustomerByPhone(callerNumber, companyId)
            }["useCustomerData.useEffect"]).then({
                "useCustomerData.useEffect": (result)=>{
                    if (cancelled) {
                        return;
                    }
                    if (result.success && result.data) {
                        // Don't update if unmounted
                        const customer = result.data;
                        // Calculate AI metrics based on real customer data
                        const isKnown = true;
                        const randomSpamScore = 0; // Real spam detection would come from external service
                        const isSpam = false;
                        if (cancelled) {
                            return; // Double-check before state update
                        }
                        setCustomerData({
                            name: `${customer.first_name} ${customer.last_name}`,
                            email: customer.email || "",
                            phone: customer.phone || callerNumber,
                            company: customer.company_name || "",
                            accountStatus: customer.status || "Active",
                            lastContact: customer.last_contact_date ? new Date(customer.last_contact_date).toLocaleDateString() : "Unknown",
                            totalCalls: customer.total_interactions || 0,
                            openTickets: 0,
                            priority: customer.priority_level || "medium",
                            tags: customer.tags || [],
                            recentIssues: [],
                            aiData: {
                                isKnownCustomer: isKnown,
                                isSpam,
                                spamConfidence: randomSpamScore,
                                recognitionSource: "crm",
                                trustScore: AI_HIGH_TRUST_SCORE,
                                callHistory: [],
                                similarCallers: 0,
                                riskLevel: "low",
                                aiNotes: [
                                    `Customer since ${customer.created_at ? new Date(customer.created_at).getFullYear() : "Unknown"}`,
                                    "Verified customer",
                                    "Account in good standing"
                                ]
                            }
                        });
                    } else {
                        // Customer not found - return default data
                        return; // Check before state update
                        //TURBOPACK unreachable
                        ;
                    }
                }
            }["useCustomerData.useEffect"]).catch({
                "useCustomerData.useEffect": (_error)=>{
                    if (cancelled) {
                        return; // Check before state update
                    }
                    setCustomerData({
                        name: "Unknown Customer",
                        email: "",
                        phone: callerNumber,
                        company: "",
                        accountStatus: "Unknown",
                        lastContact: "Never",
                        totalCalls: 0,
                        openTickets: 0,
                        priority: "medium",
                        tags: [],
                        recentIssues: [],
                        aiData: {
                            isKnownCustomer: false,
                            isSpam: false,
                            spamConfidence: 0,
                            recognitionSource: "unknown",
                            trustScore: AI_MEDIUM_TRUST_SCORE,
                            callHistory: [],
                            similarCallers: 0,
                            riskLevel: "medium",
                            aiNotes: [
                                "Error loading customer data"
                            ]
                        }
                    });
                }
            }["useCustomerData.useEffect"]).finally({
                "useCustomerData.useEffect": ()=>{
                    if (!cancelled) {
                        setIsLoading(false);
                    }
                }
            }["useCustomerData.useEffect"]);
            // Cleanup function to prevent state updates after unmount
            return ({
                "useCustomerData.useEffect": ()=>{
                    cancelled = true;
                }
            })["useCustomerData.useEffect"];
        }
    }["useCustomerData.useEffect"], [
        callerNumber,
        companyId
    ]);
    return {
        customerData,
        isLoading
    };
};
_s(useCustomerData, "HG7R42uwKyMq1dG3sUw0MpOWRC4=");
// Incoming Call View - Redesigned with better performance and design
const IncomingCallView = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s1(function IncomingCallView({ caller, customerData, onAnswer, onDecline, onVoicemail }) {
    _s1();
    const { aiData } = customerData;
    // Memoize expensive computations
    const statusBanner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "IncomingCallView.IncomingCallView.useMemo[statusBanner]": ()=>{
            if (aiData.isSpam) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-destructive/50 bg-destructive/5 dark:bg-destructive/10 mb-4 flex items-center gap-2.5 rounded-lg border p-3 backdrop-blur-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertTriangle, {
                            className: "text-destructive size-4 shrink-0"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                            lineNumber: 471,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-destructive text-xs leading-tight font-semibold",
                                    children: "Potential Spam Detected"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                    lineNumber: 473,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-destructive/70 dark:text-destructive/90 mt-0.5 text-[11px]",
                                    children: [
                                        Math.round(aiData.spamConfidence),
                                        "% confidence •",
                                        " ",
                                        aiData.similarCallers,
                                        " similar reports"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                    lineNumber: 476,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                            lineNumber: 472,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                    lineNumber: 470,
                    columnNumber: 5
                }, this);
            }
            if (aiData.isKnownCustomer) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-success/50 bg-success/5 dark:bg-success/10 mb-4 flex items-center gap-2.5 rounded-lg border p-3 backdrop-blur-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckCircle2, {
                            className: "text-success size-4 shrink-0"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                            lineNumber: 487,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-success text-xs leading-tight font-semibold",
                                    children: "Verified Customer"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                    lineNumber: 489,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-success/70 dark:text-success/90 mt-0.5 text-[11px]",
                                    children: [
                                        "Trust score: ",
                                        aiData.trustScore,
                                        "% •",
                                        " ",
                                        aiData.recognitionSource.toUpperCase()
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                    lineNumber: 492,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                            lineNumber: 488,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                    lineNumber: 486,
                    columnNumber: 5
                }, this);
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-warning/50 bg-warning/5 dark:bg-warning/10 mb-4 flex items-center gap-2.5 rounded-lg border p-3 backdrop-blur-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HelpCircle, {
                        className: "text-warning size-4 shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                        lineNumber: 502,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-warning text-xs leading-tight font-semibold",
                                children: "Unknown Caller"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                lineNumber: 504,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-warning/70 dark:text-warning/90 mt-0.5 text-[11px]",
                                children: "First-time caller • Verification recommended"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                lineNumber: 507,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                        lineNumber: 503,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                lineNumber: 501,
                columnNumber: 4
            }, this);
        }
    }["IncomingCallView.IncomingCallView.useMemo[statusBanner]"], [
        aiData.isSpam,
        aiData.isKnownCustomer,
        aiData.spamConfidence,
        aiData.similarCallers,
        aiData.trustScore,
        aiData.recognitionSource
    ]);
    const callerInitials = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "IncomingCallView.IncomingCallView.useMemo[callerInitials]": ()=>caller.name?.split(" ").map({
                "IncomingCallView.IncomingCallView.useMemo[callerInitials]": (n)=>n[0]
            }["IncomingCallView.IncomingCallView.useMemo[callerInitials]"]).join("").toUpperCase() || "?"
    }["IncomingCallView.IncomingCallView.useMemo[callerInitials]"], [
        caller.name
    ]);
    const tagsMemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "IncomingCallView.IncomingCallView.useMemo[tagsMemo]": ()=>customerData.tags.map({
                "IncomingCallView.IncomingCallView.useMemo[tagsMemo]": (tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                        className: "px-2 py-0.5 text-[10px]",
                        variant: "default",
                        children: tag
                    }, tag, false, {
                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                        lineNumber: 535,
                        columnNumber: 5
                    }, this)
            }["IncomingCallView.IncomingCallView.useMemo[tagsMemo]"])
    }["IncomingCallView.IncomingCallView.useMemo[tagsMemo]"], [
        customerData.tags
    ]);
    // Memoize callbacks
    const handleAnswer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IncomingCallView.IncomingCallView.useCallback[handleAnswer]": ()=>{
            onAnswer();
        }
    }["IncomingCallView.IncomingCallView.useCallback[handleAnswer]"], [
        onAnswer
    ]);
    const handleDecline = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IncomingCallView.IncomingCallView.useCallback[handleDecline]": ()=>{
            onDecline();
        }
    }["IncomingCallView.IncomingCallView.useCallback[handleDecline]"], [
        onDecline
    ]);
    const handleVoicemail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "IncomingCallView.IncomingCallView.useCallback[handleVoicemail]": ()=>{
            onVoicemail();
        }
    }["IncomingCallView.IncomingCallView.useCallback[handleVoicemail]"], [
        onVoicemail
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fade-in slide-in-from-bottom-4 animate-in fixed right-6 bottom-6 z-50 w-[420px] duration-300 ease-out",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: "bg-card/95 dark:bg-card/95 border-2 shadow-2xl backdrop-blur-xl dark:shadow-2xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                    className: "space-y-0 pb-4",
                    children: [
                        statusBanner,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-4 pt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                            className: "ring-primary/20 dark:ring-primary/30 size-20 shadow-lg ring-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                                    src: caller.avatar
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                    lineNumber: 564,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                                    className: "border-primary/20 from-primary/20 to-primary/10 text-foreground border-2 bg-gradient-to-br text-lg font-semibold",
                                                    children: callerInitials
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                    lineNumber: 565,
                                                    columnNumber: 9
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 563,
                                            columnNumber: 8
                                        }, this),
                                        aiData.isKnownCustomer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border-card bg-success absolute -right-1 -bottom-1 rounded-full border-2 p-1",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Shield, {
                                                className: "text-success-foreground size-3"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 571,
                                                columnNumber: 10
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 570,
                                            columnNumber: 9
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                    lineNumber: 562,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0 flex-1 pt-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-1 flex items-center gap-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-foreground truncate text-lg leading-tight font-bold",
                                                children: caller.name || "Unknown Caller"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 578,
                                                columnNumber: 9
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 577,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-muted-foreground mb-2 font-mono text-sm",
                                            children: caller.number
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 582,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-success shadow-success/50 size-2 animate-pulse rounded-full shadow-sm"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                    lineNumber: 586,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-muted-foreground text-xs font-medium",
                                                    children: "Incoming call..."
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                    lineNumber: 587,
                                                    columnNumber: 9
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 585,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                    lineNumber: 576,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                            lineNumber: 561,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                    lineNumber: 558,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            className: "bg-muted/30 dark:bg-muted/20 border-2 p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-3 flex flex-wrap items-center gap-2",
                                    children: [
                                        tagsMemo,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2 py-0.5 text-[10px]", getPriorityColorClass(customerData.priority)),
                                            variant: customerData.priority === "high" ? "destructive" : customerData.priority === "medium" ? "outline" : "secondary",
                                            children: customerData.priority.toUpperCase()
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 599,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                    lineNumber: 597,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2.5 text-xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-muted-foreground flex items-center gap-2.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Building2, {
                                                    className: "size-4 shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                    lineNumber: 617,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    children: customerData.company || "No company"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                    lineNumber: 618,
                                                    columnNumber: 9
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 616,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-muted-foreground flex items-center gap-2.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Clock, {
                                                    className: "size-4 shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                    lineNumber: 623,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "Last contact: ",
                                                        customerData.lastContact
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                    lineNumber: 624,
                                                    columnNumber: 9
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 622,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-muted-foreground flex items-center gap-2.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FileText, {
                                                    className: "size-4 shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                    lineNumber: 627,
                                                    columnNumber: 9
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        customerData.openTickets,
                                                        " open tickets"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                    lineNumber: 628,
                                                    columnNumber: 9
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 626,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                    lineNumber: 615,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                            lineNumber: 596,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-3 gap-3 pt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    className: "h-14 flex-col gap-1.5 rounded-xl font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95",
                                    onClick: handleDecline,
                                    size: "lg",
                                    variant: "destructive",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PhoneOff, {
                                            className: "size-5"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 640,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs",
                                            children: "Decline"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 641,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                    lineNumber: 634,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    className: "h-14 flex-col gap-1.5 rounded-xl border-2 font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95",
                                    onClick: handleVoicemail,
                                    size: "lg",
                                    variant: "outline",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Voicemail, {
                                            className: "size-5"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 649,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs",
                                            children: "Voicemail"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 650,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                    lineNumber: 643,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    className: "bg-success text-success-foreground hover:bg-success/90 h-14 flex-col gap-1.5 rounded-xl font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95",
                                    onClick: handleAnswer,
                                    size: "lg",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Phone, {
                                            className: "size-5"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 657,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs",
                                            children: "Answer"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 658,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                    lineNumber: 652,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                            lineNumber: 633,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                    lineNumber: 595,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
            lineNumber: 557,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
        lineNumber: 556,
        columnNumber: 3
    }, this);
}, "mcnpTBAwSspG8ueVutLz/LSq3Cg="));
_c36 = IncomingCallView;
// Enhanced Active Call Widget - Draggable with More Controls
const MinimizedCallWidget = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s2(function MinimizedCallWidget({ caller, callDuration, call, onMaximize, onEndCall, toggleMute, toggleHold, sendDTMF }) {
    _s2();
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showKeypad, setShowKeypad] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Fixed: Lazy initialization to prevent hydration mismatch
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "MinimizedCallWidget.MinimizedCallWidget.useState": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return {
                x: window.innerWidth - 350,
                y: window.innerHeight - 150
            };
        }
    }["MinimizedCallWidget.MinimizedCallWidget.useState"]);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Use refs to avoid dependency issues and prevent listener stacking
    const dragOffsetRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0
    });
    // Dragging handlers
    const handleMouseDown = (e)=>{
        setIsDragging(true);
        dragOffsetRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };
    const handleMouseMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MinimizedCallWidget.MinimizedCallWidget.useCallback[handleMouseMove]": (e)=>{
            setPosition({
                x: e.clientX - dragOffsetRef.current.x,
                y: e.clientY - dragOffsetRef.current.y
            });
        }
    }["MinimizedCallWidget.MinimizedCallWidget.useCallback[handleMouseMove]"], []); // ✅ No dependencies - uses ref
    const handleMouseUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MinimizedCallWidget.MinimizedCallWidget.useCallback[handleMouseUp]": ()=>{
            setIsDragging(false);
        }
    }["MinimizedCallWidget.MinimizedCallWidget.useCallback[handleMouseUp]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MinimizedCallWidget.MinimizedCallWidget.useEffect": ()=>{
            if (isDragging) {
                window.addEventListener("mousemove", handleMouseMove);
                window.addEventListener("mouseup", handleMouseUp);
                return ({
                    "MinimizedCallWidget.MinimizedCallWidget.useEffect": ()=>{
                        window.removeEventListener("mousemove", handleMouseMove);
                        window.removeEventListener("mouseup", handleMouseUp);
                    }
                })["MinimizedCallWidget.MinimizedCallWidget.useEffect"];
            }
        }
    }["MinimizedCallWidget.MinimizedCallWidget.useEffect"], [
        isDragging,
        handleMouseMove,
        handleMouseUp
    ]); // ✅ Stable callbacks
    const keypadButtons = [
        [
            "1",
            "2",
            "3"
        ],
        [
            "4",
            "5",
            "6"
        ],
        [
            "7",
            "8",
            "9"
        ],
        [
            "*",
            "0",
            "#"
        ]
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fade-in slide-in-from-bottom-2 animate-in fixed z-50 duration-300", isDragging && "cursor-grabbing"),
        style: {
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: isExpanded ? "340px" : "320px"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "border-border bg-card rounded-xl border shadow-2xl dark:shadow-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-border bg-muted/50 dark:bg-muted/30 cursor-grab rounded-t-xl border-b px-4 py-3 active:cursor-grabbing",
                    onMouseDown: handleMouseDown,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                className: "ring-border dark:ring-border/50 size-10 ring-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                        src: caller.avatar
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 762,
                                        columnNumber: 8
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                        className: "bg-muted text-muted-foreground text-xs",
                                        children: caller.name?.split(" ").map((n)=>n[0]).join("").toUpperCase() || "?"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 763,
                                        columnNumber: 8
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                lineNumber: 761,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-foreground truncate text-sm font-medium",
                                        children: caller.name || "Unknown"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 772,
                                        columnNumber: 8
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-success size-1.5 animate-pulse rounded-full"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 776,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-muted-foreground font-mono text-[11px]",
                                                children: callDuration
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 777,
                                                columnNumber: 9
                                            }, this),
                                            call.isRecording && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground",
                                                        children: "•"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                        lineNumber: 782,
                                                        columnNumber: 11
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Square, {
                                                        className: "text-destructive size-2 fill-red-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                        lineNumber: 783,
                                                        columnNumber: 11
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 775,
                                        columnNumber: 8
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                lineNumber: 771,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "bg-background hover:bg-accent flex size-7 items-center justify-center rounded-lg transition-colors active:scale-95",
                                onClick: ()=>setIsExpanded(!isExpanded),
                                title: isExpanded ? "Collapse" : "Expand",
                                type: "button",
                                children: isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChevronUp, {
                                    className: "text-muted-foreground size-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                    lineNumber: 795,
                                    columnNumber: 9
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChevronDown, {
                                    className: "text-muted-foreground size-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                    lineNumber: 797,
                                    columnNumber: 9
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                lineNumber: 788,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                        lineNumber: 760,
                        columnNumber: 6
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                    lineNumber: 756,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-3",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-5 gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center gap-1 rounded-lg p-2 transition-colors active:scale-95", call.isMuted ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-background text-muted-foreground hover:bg-accent"),
                                onClick: toggleMute,
                                title: call.isMuted ? "Unmute" : "Mute",
                                type: "button",
                                children: [
                                    call.isMuted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MicOff, {
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 818,
                                        columnNumber: 9
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Mic, {
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 820,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9px]",
                                        children: call.isMuted ? "Unmute" : "Mute"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 822,
                                        columnNumber: 8
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                lineNumber: 806,
                                columnNumber: 7
                            }, this),
                            toggleHold && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center gap-1 rounded-lg p-2 transition-colors active:scale-95", call.isOnHold ? "bg-warning text-warning-foreground hover:bg-warning/90 dark:text-warning-foreground" : "bg-background text-muted-foreground hover:bg-accent"),
                                onClick: toggleHold,
                                title: call.isOnHold ? "Resume" : "Hold",
                                type: "button",
                                children: [
                                    call.isOnHold ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Play, {
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 840,
                                        columnNumber: 10
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pause, {
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 842,
                                        columnNumber: 10
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9px]",
                                        children: call.isOnHold ? "Resume" : "Hold"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 844,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                lineNumber: 828,
                                columnNumber: 8
                            }, this),
                            sendDTMF && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center gap-1 rounded-lg p-2 transition-colors active:scale-95", showKeypad ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-background text-muted-foreground hover:bg-accent"),
                                onClick: ()=>setShowKeypad(!showKeypad),
                                title: "Keypad",
                                type: "button",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Hash, {
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 862,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9px]",
                                        children: "Keypad"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 863,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                lineNumber: 851,
                                columnNumber: 8
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "bg-background text-muted-foreground hover:bg-accent flex flex-col items-center gap-1 rounded-lg p-2 transition-colors active:scale-95",
                                onClick: onMaximize,
                                title: "Open Dashboard",
                                type: "button",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Maximize2, {
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 873,
                                        columnNumber: 8
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9px]",
                                        children: "Open"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 874,
                                        columnNumber: 8
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                lineNumber: 867,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "bg-destructive text-destructive-foreground hover:bg-destructive/90 flex flex-col items-center gap-1 rounded-lg p-2 transition-colors active:scale-95",
                                onClick: onEndCall,
                                title: "End Call",
                                type: "button",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PhoneOff, {
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 883,
                                        columnNumber: 8
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9px]",
                                        children: "End"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 884,
                                        columnNumber: 8
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                lineNumber: 877,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                        lineNumber: 805,
                        columnNumber: 6
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                    lineNumber: 804,
                    columnNumber: 5
                }, this),
                isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-border border-t p-3",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-muted-foreground",
                                        children: "Caller Number"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 894,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-muted-foreground font-mono",
                                        children: caller.number
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 895,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                lineNumber: 893,
                                columnNumber: 8
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-muted-foreground",
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 900,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-success size-1.5 rounded-full"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 902,
                                                columnNumber: 10
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-muted-foreground",
                                                children: call.isOnHold ? "On Hold" : "Active"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 903,
                                                columnNumber: 10
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 901,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                lineNumber: 899,
                                columnNumber: 8
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                        lineNumber: 892,
                        columnNumber: 7
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                    lineNumber: 891,
                    columnNumber: 6
                }, this),
                showKeypad && sendDTMF && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-border border-t p-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-2 text-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-muted-foreground text-xs",
                                children: "Dial Tones"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                lineNumber: 916,
                                columnNumber: 8
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                            lineNumber: 915,
                            columnNumber: 7
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-3 gap-2",
                            children: keypadButtons.flat().map((digit)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "border-border bg-background text-foreground hover:bg-accent flex size-12 items-center justify-center rounded-lg border font-mono text-lg transition-colors active:scale-95",
                                    onClick: ()=>sendDTMF(digit),
                                    type: "button",
                                    children: digit
                                }, digit, false, {
                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                    lineNumber: 920,
                                    columnNumber: 9
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                            lineNumber: 918,
                            columnNumber: 7
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                    lineNumber: 914,
                    columnNumber: 6
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
            lineNumber: 754,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
        lineNumber: 743,
        columnNumber: 3
    }, this);
}, "gfD9tnCDOIyD3o8+eR68fB9+e+o="));
_c37 = MinimizedCallWidget;
// Dashboard Card Component
const DashboardCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function DashboardCard({ id, title, icon, children, isCollapsed, onToggleCollapse, badge }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border-border bg-card/50 dark:bg-card/80 overflow-hidden rounded-xl border shadow-sm backdrop-blur-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "bg-muted/50 hover:bg-muted/70 dark:bg-muted/30 dark:hover:bg-muted/50 flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors active:scale-[0.98]",
                onClick: onToggleCollapse,
                type: "button",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2.5",
                        children: [
                            icon,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-foreground text-sm font-semibold",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                lineNumber: 964,
                                columnNumber: 6
                            }, this),
                            badge
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                        lineNumber: 962,
                        columnNumber: 5
                    }, this),
                    isCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChevronDown, {
                        className: "text-muted-foreground size-4"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                        lineNumber: 968,
                        columnNumber: 6
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChevronUp, {
                        className: "text-muted-foreground size-4"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                        lineNumber: 970,
                        columnNumber: 6
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                lineNumber: 957,
                columnNumber: 4
            }, this),
            !isCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-border bg-card/30 dark:bg-card/50 border-t p-5",
                children: children
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                lineNumber: 975,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
        lineNumber: 956,
        columnNumber: 3
    }, this);
});
_c38 = DashboardCard;
// Redesigned Active Call View with Dashboard Layout
const ActiveCallView = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s3(function ActiveCallView({ call, caller, callDuration, customerData, callNotes, setCallNotes, disposition, setDisposition, onEndCall, onMinimize, onRequestVideo, onEndVideo, onTransfer, toggleMute, toggleHold, toggleRecording, position, height, width, isDragging, isResizing, handleMouseDown, handleTouchStart, isPopOutZone, resizeHandles }) {
    _s3();
    const cards = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"])({
        "ActiveCallView.ActiveCallView.useCallPreferencesStore[cards]": (state)=>state.cards
    }["ActiveCallView.ActiveCallView.useCallPreferencesStore[cards]"]);
    const toggleCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"])({
        "ActiveCallView.ActiveCallView.useCallPreferencesStore[toggleCard]": (state)=>state.toggleCard
    }["ActiveCallView.ActiveCallView.useCallPreferencesStore[toggleCard]"]);
    const layoutMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"])({
        "ActiveCallView.ActiveCallView.useCallPreferencesStore[layoutMode]": (state)=>state.layoutMode
    }["ActiveCallView.ActiveCallView.useCallPreferencesStore[layoutMode]"]);
    // Get spacing based on layout mode
    const spacing = layoutMode === "compact" ? "gap-3" : layoutMode === "comfortable" ? "gap-4" : "gap-5";
    const padding = layoutMode === "compact" ? "p-4" : layoutMode === "comfortable" ? "p-5" : "p-6";
    // Get visible cards
    const visibleCards = cards.filter((c)=>c.isVisible).sort((a, b)=>a.order - b.order);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fade-in slide-in-from-bottom-2 animate-in fixed z-50 duration-300", isDragging && "cursor-grabbing", isPopOutZone && "scale-95 opacity-50"),
        "data-draggable-container": true,
        style: {
            width: `${width}px`,
            height: `${height}px`,
            left: `${position.x}px`,
            top: `${position.y}px`
        },
        children: [
            isPopOutZone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-primary bg-primary/10 absolute inset-0 z-50 flex items-center justify-center rounded-2xl border-2 border-dashed backdrop-blur-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SquareStack, {
                            className: "text-primary mx-auto mb-2 h-12 w-12"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                            lineNumber: 1119,
                            columnNumber: 7
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-primary font-semibold",
                            children: "Release to Pop Out"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                            lineNumber: 1120,
                            columnNumber: 7
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground text-sm",
                            children: "Opens call in separate window"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                            lineNumber: 1121,
                            columnNumber: 7
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                    lineNumber: 1118,
                    columnNumber: 6
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                lineNumber: 1117,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("hover:bg-primary/20 absolute -top-1 right-0 left-0 h-2 cursor-ns-resize", isResizing && "bg-primary/30"),
                ...resizeHandles.handleNorth
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                lineNumber: 1130,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("hover:bg-primary/20 absolute top-0 -right-1 bottom-0 w-2 cursor-ew-resize", isResizing && "bg-primary/30"),
                ...resizeHandles.handleEast
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                lineNumber: 1139,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("hover:bg-primary/20 absolute right-0 -bottom-1 left-0 h-2 cursor-ns-resize", isResizing && "bg-primary/30"),
                ...resizeHandles.handleSouth
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                lineNumber: 1148,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("hover:bg-primary/20 absolute top-0 bottom-0 -left-1 w-2 cursor-ew-resize", isResizing && "bg-primary/30"),
                ...resizeHandles.handleWest
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                lineNumber: 1157,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("hover:bg-primary/30 absolute -top-1 -left-1 h-4 w-4 cursor-nwse-resize rounded-tl-2xl", isResizing && "bg-primary/40"),
                ...resizeHandles.handleNorthWest
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                lineNumber: 1167,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("hover:bg-primary/30 absolute -top-1 -right-1 h-4 w-4 cursor-nesw-resize rounded-tr-2xl", isResizing && "bg-primary/40"),
                ...resizeHandles.handleNorthEast
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                lineNumber: 1176,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("hover:bg-primary/30 absolute -right-1 -bottom-1 h-4 w-4 cursor-nwse-resize rounded-br-2xl", isResizing && "bg-primary/40"),
                ...resizeHandles.handleSouthEast
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                lineNumber: 1185,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("hover:bg-primary/30 absolute -bottom-1 -left-1 h-4 w-4 cursor-nesw-resize rounded-bl-2xl", isResizing && "bg-primary/40"),
                ...resizeHandles.handleSouthWest
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                lineNumber: 1194,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-border bg-card flex h-full flex-col rounded-2xl border shadow-2xl dark:shadow-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-border bg-muted/50 dark:bg-muted/30 cursor-grab border-b p-6 active:cursor-grabbing",
                        "data-drag-handle": true,
                        onMouseDown: handleMouseDown,
                        onTouchStart: handleTouchStart,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                                className: "ring-border dark:ring-border/50 size-14 ring-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                                        src: caller.avatar
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                        lineNumber: 1213,
                                                        columnNumber: 9
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                                        className: "bg-muted text-muted-foreground",
                                                        children: caller.name?.split(" ").map((n)=>n[0]).join("").toUpperCase() || "?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                        lineNumber: 1214,
                                                        columnNumber: 9
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1212,
                                                columnNumber: 8
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-foreground text-base font-semibold",
                                                                children: caller.name || "Unknown"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1224,
                                                                columnNumber: 10
                                                            }, this),
                                                            customerData.priority === "high" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertCircle, {
                                                                className: "text-destructive size-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1228,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                        lineNumber: 1223,
                                                        columnNumber: 9
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-muted-foreground text-sm",
                                                        children: caller.number
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                        lineNumber: 1231,
                                                        columnNumber: 9
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-1.5 flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "bg-success size-2 animate-pulse rounded-full"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1233,
                                                                columnNumber: 10
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-muted-foreground font-mono text-xs",
                                                                children: callDuration
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1234,
                                                                columnNumber: 10
                                                            }, this),
                                                            call.isRecording && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-muted-foreground",
                                                                        children: "•"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                        lineNumber: 1239,
                                                                        columnNumber: 12
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Square, {
                                                                        className: "text-destructive size-2.5 fill-red-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                        lineNumber: 1240,
                                                                        columnNumber: 12
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-destructive text-xs",
                                                                        children: "REC"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                        lineNumber: 1241,
                                                                        columnNumber: 12
                                                                    }, this)
                                                                ]
                                                            }, void 0, true)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                        lineNumber: 1232,
                                                        columnNumber: 9
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1222,
                                                columnNumber: 8
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 1211,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "bg-background hover:bg-accent flex size-9 items-center justify-center rounded-lg transition-colors active:scale-95",
                                                onClick: onMinimize,
                                                title: "Minimize",
                                                type: "button",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Minimize2, {
                                                    className: "text-muted-foreground size-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                    lineNumber: 1254,
                                                    columnNumber: 9
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1248,
                                                columnNumber: 8
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "bg-background hover:bg-accent flex size-9 items-center justify-center rounded-lg transition-colors active:scale-95",
                                                title: "Settings",
                                                type: "button",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Settings, {
                                                    className: "text-muted-foreground size-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                    lineNumber: 1261,
                                                    columnNumber: 9
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1256,
                                                columnNumber: 8
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 1247,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                lineNumber: 1210,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-5 grid grid-cols-6 gap-2.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center gap-1.5 rounded-lg p-3 transition-colors active:scale-95", call.isMuted ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-background text-muted-foreground hover:bg-accent"),
                                        onClick: toggleMute,
                                        type: "button",
                                        children: [
                                            call.isMuted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MicOff, {
                                                className: "size-5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1279,
                                                columnNumber: 9
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Mic, {
                                                className: "size-5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1281,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px]",
                                                children: call.isMuted ? "Unmute" : "Mute"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1283,
                                                columnNumber: 8
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 1268,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center gap-1.5 rounded-lg p-3 transition-colors active:scale-95", call.isOnHold ? "bg-warning text-warning-foreground hover:bg-warning/90 dark:text-warning-foreground" : "bg-background text-muted-foreground hover:bg-accent"),
                                        onClick: toggleHold,
                                        type: "button",
                                        children: [
                                            call.isOnHold ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Play, {
                                                className: "size-5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1299,
                                                columnNumber: 9
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pause, {
                                                className: "size-5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1301,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px]",
                                                children: call.isOnHold ? "Resume" : "Hold"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1303,
                                                columnNumber: 8
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 1288,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center gap-1.5 rounded-lg p-3 transition-colors active:scale-95", call.isRecording ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-background text-muted-foreground hover:bg-accent"),
                                        onClick: toggleRecording,
                                        type: "button",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Square, {
                                                className: "size-5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1318,
                                                columnNumber: 8
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px]",
                                                children: call.isRecording ? "Stop" : "Record"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1319,
                                                columnNumber: 8
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 1308,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "bg-background text-muted-foreground hover:bg-accent flex flex-col items-center gap-1.5 rounded-lg p-3 transition-colors active:scale-95",
                                        onClick: onTransfer,
                                        title: "Transfer Call",
                                        type: "button",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ArrowRightLeft, {
                                                className: "size-5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1330,
                                                columnNumber: 8
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px]",
                                                children: "Transfer"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1331,
                                                columnNumber: 8
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 1324,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center gap-1.5 rounded-lg p-3 transition-colors active:scale-95", call.videoStatus === "connected" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-background text-muted-foreground hover:bg-accent"),
                                        onClick: ()=>{
                                            if (call.videoStatus === "off") {
                                                onRequestVideo();
                                            } else if (call.videoStatus === "connected") {
                                                onEndVideo();
                                            }
                                        },
                                        type: "button",
                                        children: [
                                            call.videoStatus === "connected" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Video, {
                                                className: "size-5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1351,
                                                columnNumber: 9
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(VideoOff, {
                                                className: "size-5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1353,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px]",
                                                children: "Video"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1355,
                                                columnNumber: 8
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 1334,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "bg-destructive text-destructive-foreground hover:bg-destructive/90 flex flex-col items-center gap-1.5 rounded-lg p-3 transition-colors active:scale-95",
                                        onClick: onEndCall,
                                        type: "button",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PhoneOff, {
                                                className: "size-5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1363,
                                                columnNumber: 8
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px]",
                                                children: "End"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1364,
                                                columnNumber: 8
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                        lineNumber: 1358,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                lineNumber: 1267,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                        lineNumber: 1204,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 overflow-y-auto", padding, spacing),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("grid gap-4", width >= 1200 ? "grid-cols-2" : "grid-cols-1"),
                            children: visibleCards.map((card)=>{
                                switch(card.id){
                                    case "transcript":
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardCard, {
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FileText, {
                                                className: "text-primary size-4"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1382,
                                                columnNumber: 18
                                            }, void 0),
                                            id: card.id,
                                            isCollapsed: card.isCollapsed,
                                            onToggleCollapse: ()=>toggleCard(card.id),
                                            title: "Live Transcript",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-96",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TranscriptPanel, {}, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                    lineNumber: 1390,
                                                    columnNumber: 13
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1389,
                                                columnNumber: 12
                                            }, this)
                                        }, card.id, false, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 1381,
                                            columnNumber: 11
                                        }, this);
                                    case "ai-autofill":
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardCard, {
                                            badge: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-accent text-accent-foreground rounded-full px-2 py-0.5 text-[9px]",
                                                children: "AI"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1399,
                                                columnNumber: 13
                                            }, void 0),
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Brain, {
                                                className: "text-accent-foreground size-4"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1403,
                                                columnNumber: 18
                                            }, void 0),
                                            id: card.id,
                                            isCollapsed: card.isCollapsed,
                                            onToggleCollapse: ()=>toggleCard(card.id),
                                            title: "AI Auto-fill",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-96",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AIAutofillPreview, {}, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                    lineNumber: 1411,
                                                    columnNumber: 13
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1410,
                                                columnNumber: 12
                                            }, this)
                                        }, card.id, false, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 1397,
                                            columnNumber: 11
                                        }, this);
                                    case "customer-info":
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardCard, {
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(User, {
                                                className: "text-success size-4"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1419,
                                                columnNumber: 18
                                            }, void 0),
                                            id: card.id,
                                            isCollapsed: card.isCollapsed,
                                            onToggleCollapse: ()=>toggleCard(card.id),
                                            title: "Customer Information",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-2 gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-muted-foreground mb-1.5 block text-xs font-medium",
                                                                        children: "Email"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                        lineNumber: 1429,
                                                                        columnNumber: 15
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-muted-foreground text-sm",
                                                                        children: customerData.email
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                        lineNumber: 1432,
                                                                        columnNumber: 15
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1428,
                                                                columnNumber: 14
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-muted-foreground mb-1.5 block text-xs font-medium",
                                                                        children: "Company"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                        lineNumber: 1437,
                                                                        columnNumber: 15
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-muted-foreground text-sm",
                                                                        children: customerData.company
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                        lineNumber: 1440,
                                                                        columnNumber: 15
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1436,
                                                                columnNumber: 14
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-muted-foreground mb-1.5 block text-xs font-medium",
                                                                        children: "Status"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                        lineNumber: 1445,
                                                                        columnNumber: 15
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-success text-sm",
                                                                        children: customerData.accountStatus
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                        lineNumber: 1448,
                                                                        columnNumber: 15
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1444,
                                                                columnNumber: 14
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-muted-foreground mb-1.5 block text-xs font-medium",
                                                                        children: "Priority"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                        lineNumber: 1453,
                                                                        columnNumber: 15
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm", getPriorityTextColorClass(customerData.priority)),
                                                                        children: customerData.priority.charAt(0).toUpperCase() + customerData.priority.slice(1)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                        lineNumber: 1456,
                                                                        columnNumber: 15
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1452,
                                                                columnNumber: 14
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                        lineNumber: 1427,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-muted-foreground mb-1.5 block text-xs font-medium",
                                                                children: "Tags"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1471,
                                                                columnNumber: 14
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap gap-2",
                                                                children: customerData.tags.map((tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs",
                                                                        children: tag
                                                                    }, tag, false, {
                                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                        lineNumber: 1476,
                                                                        columnNumber: 16
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1474,
                                                                columnNumber: 14
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                        lineNumber: 1470,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-muted-foreground mb-1.5 block text-xs font-medium",
                                                                children: "Recent Issues"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1487,
                                                                columnNumber: 14
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-1.5",
                                                                children: customerData.recentIssues.map((issue)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-muted-foreground text-sm",
                                                                        children: [
                                                                            "• ",
                                                                            issue.text
                                                                        ]
                                                                    }, issue.id, true, {
                                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                        lineNumber: 1492,
                                                                        columnNumber: 16
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1490,
                                                                columnNumber: 14
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                        lineNumber: 1486,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1426,
                                                columnNumber: 12
                                            }, this)
                                        }, card.id, false, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 1418,
                                            columnNumber: 11
                                        }, this);
                                    case "ai-analysis":
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardCard, {
                                            badge: customerData.aiData.isKnownCustomer ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-success text-success-foreground dark:text-success-foreground rounded px-2 py-0.5 text-[9px]",
                                                children: "VERIFIED"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1510,
                                                columnNumber: 14
                                            }, void 0) : customerData.aiData.isSpam ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-destructive text-destructive-foreground rounded px-2 py-0.5 text-[9px]",
                                                children: "SPAM"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1514,
                                                columnNumber: 14
                                            }, void 0) : null,
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Brain, {
                                                className: "text-warning size-4"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1519,
                                                columnNumber: 18
                                            }, void 0),
                                            id: card.id,
                                            isCollapsed: card.isCollapsed,
                                            onToggleCollapse: ()=>toggleCard(card.id),
                                            title: "AI Analysis",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mb-2 flex items-center justify-between",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-muted-foreground text-xs font-medium",
                                                                        children: "Trust Score"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                        lineNumber: 1530,
                                                                        columnNumber: 15
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-foreground font-mono text-sm font-semibold",
                                                                        children: [
                                                                            customerData.aiData.trustScore,
                                                                            "%"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                        lineNumber: 1533,
                                                                        columnNumber: 15
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1529,
                                                                columnNumber: 14
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "bg-muted h-2 overflow-hidden rounded-full",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-full transition-all", getTrustScoreColorClass(customerData.aiData.trustScore)),
                                                                    style: {
                                                                        width: `${customerData.aiData.trustScore}%`
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                    lineNumber: 1538,
                                                                    columnNumber: 15
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1537,
                                                                columnNumber: 14
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                        lineNumber: 1528,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-muted-foreground text-xs font-medium",
                                                                children: "Risk Level"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1554,
                                                                columnNumber: 14
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded px-3 py-1 text-xs font-semibold", getRiskLevelColorClass(customerData.aiData.riskLevel)),
                                                                children: customerData.aiData.riskLevel.toUpperCase()
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1557,
                                                                columnNumber: 14
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                        lineNumber: 1553,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-muted-foreground mb-2 block text-xs font-medium",
                                                                children: "AI Insights"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1571,
                                                                columnNumber: 14
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2",
                                                                children: customerData.aiData.aiNotes.map((note, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "border-border bg-muted/50 dark:bg-muted/30 flex items-start gap-2.5 rounded-lg border p-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "bg-success mt-1 size-2 shrink-0 rounded-full"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                                lineNumber: 1580,
                                                                                columnNumber: 17
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-muted-foreground flex-1 text-sm leading-relaxed",
                                                                                children: note
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                                lineNumber: 1581,
                                                                                columnNumber: 17
                                                                            }, this)
                                                                        ]
                                                                    }, index, true, {
                                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                        lineNumber: 1576,
                                                                        columnNumber: 16
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                                lineNumber: 1574,
                                                                columnNumber: 14
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                        lineNumber: 1570,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1526,
                                                columnNumber: 12
                                            }, this)
                                        }, card.id, false, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 1507,
                                            columnNumber: 11
                                        }, this);
                                    case "notes":
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardCard, {
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FileText, {
                                                className: "text-muted-foreground size-4"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1596,
                                                columnNumber: 13
                                            }, void 0),
                                            id: card.id,
                                            isCollapsed: card.isCollapsed,
                                            onToggleCollapse: ()=>toggleCard(card.id),
                                            title: "Call Notes",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                                className: "border-border bg-background text-foreground placeholder:text-muted-foreground min-h-32 text-sm",
                                                onChange: (e)=>setCallNotes(e.target.value),
                                                placeholder: "Enter call notes and customer concerns...",
                                                value: callNotes
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1604,
                                                columnNumber: 12
                                            }, this)
                                        }, card.id, false, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 1594,
                                            columnNumber: 11
                                        }, this);
                                    case "disposition":
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardCard, {
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tag, {
                                                className: "text-muted-foreground size-4"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1616,
                                                columnNumber: 18
                                            }, void 0),
                                            id: card.id,
                                            isCollapsed: card.isCollapsed,
                                            onToggleCollapse: ()=>toggleCard(card.id),
                                            title: "Call Disposition",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-3",
                                                children: [
                                                    {
                                                        value: "resolved",
                                                        label: "Resolved",
                                                        color: "green"
                                                    },
                                                    {
                                                        value: "escalated",
                                                        label: "Escalated",
                                                        color: "red"
                                                    },
                                                    {
                                                        value: "callback",
                                                        label: "Callback",
                                                        color: "amber"
                                                    },
                                                    {
                                                        value: "voicemail",
                                                        label: "Voicemail",
                                                        color: "blue"
                                                    }
                                                ].map((disp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-lg border px-4 py-3 text-sm font-medium transition-colors active:scale-95", disposition === disp.value ? disp.color === "green" ? "border-success bg-success text-success-foreground dark:text-success-foreground" : disp.color === "red" ? "border-destructive bg-destructive text-destructive-foreground" : disp.color === "amber" ? "border-warning bg-warning text-warning-foreground dark:text-warning-foreground" : "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:bg-accent"),
                                                        onClick: ()=>setDisposition(disp.value),
                                                        type: "button",
                                                        children: disp.label
                                                    }, disp.value, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                        lineNumber: 1646,
                                                        columnNumber: 14
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1623,
                                                columnNumber: 12
                                            }, this)
                                        }, card.id, false, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 1615,
                                            columnNumber: 11
                                        }, this);
                                    case "quick-actions":
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardCard, {
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SquareStack, {
                                                className: "text-muted-foreground size-4"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1676,
                                                columnNumber: 13
                                            }, void 0),
                                            id: card.id,
                                            isCollapsed: card.isCollapsed,
                                            onToggleCollapse: ()=>toggleCard(card.id),
                                            title: "Quick Actions",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-2.5",
                                                children: [
                                                    "Check Balance",
                                                    "Reset Password",
                                                    "Open Ticket",
                                                    "Send Email"
                                                ].map((action)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "border-border bg-background text-foreground hover:bg-accent rounded-lg border px-4 py-3 text-sm transition-colors active:scale-95",
                                                        type: "button",
                                                        children: action
                                                    }, action, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                        lineNumber: 1691,
                                                        columnNumber: 14
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                                lineNumber: 1684,
                                                columnNumber: 12
                                            }, this)
                                        }, card.id, false, {
                                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                                            lineNumber: 1674,
                                            columnNumber: 11
                                        }, this);
                                    default:
                                        return null;
                                }
                            })
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                            lineNumber: 1371,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                        lineNumber: 1370,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                lineNumber: 1202,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
        lineNumber: 1101,
        columnNumber: 3
    }, this);
}, "HvDv7+6cQAqu372R0muJKqdnLng=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$call$2d$preferences$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallPreferencesStore"]
    ];
}));
_c39 = ActiveCallView;
function IncomingCallNotification() {
    _s4();
    // WebRTC credentials and state
    const [webrtcCredentials, setWebrtcCredentials] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [_isLoadingCredentials, setIsLoadingCredentials] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Fetch WebRTC credentials on mount (shared cache across components)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IncomingCallNotification.useEffect": ()=>{
            let cancelled = false;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$web$2d$credentials$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWebRTCCredentialsOnce"])().then({
                "IncomingCallNotification.useEffect": (result)=>{
                    if (cancelled) {
                        return;
                    }
                    if (result.success && result.credential) {
                        setWebrtcCredentials({
                            username: result.credential.username,
                            password: result.credential.password
                        });
                    }
                }
            }["IncomingCallNotification.useEffect"]).catch({
                "IncomingCallNotification.useEffect": ()=>{
                    if (!cancelled) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$telnyx$2f$web$2d$credentials$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resetWebRTCCredentialsCache"])();
                    }
                }
            }["IncomingCallNotification.useEffect"]).finally({
                "IncomingCallNotification.useEffect": ()=>{
                    if (!cancelled) {
                        setIsLoadingCredentials(false);
                    }
                }
            }["IncomingCallNotification.useEffect"]);
            return ({
                "IncomingCallNotification.useEffect": ()=>{
                    cancelled = true;
                }
            })["IncomingCallNotification.useEffect"];
        }
    }["IncomingCallNotification.useEffect"], []);
    // PERFORMANCE: Don't auto-connect WebRTC on every page load
    // This was hitting Telnyx 5-connection limit causing 2-8s timeouts!
    // WebRTC will connect ONLY when there's an actual incoming call or user initiates call
    const webrtc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$telnyx$2d$webrtc$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTelnyxWebRTC"])({
        username: webrtcCredentials?.username || "",
        password: webrtcCredentials?.password || "",
        autoConnect: false,
        disabled: !webrtcCredentials,
        debug: ("TURBOPACK compile-time value", "development") === "development",
        onIncomingCall: {
            "IncomingCallNotification.useTelnyxWebRTC[webrtc]": (_call)=>{
            // The incoming call UI will show based on currentCall state
            }
        }["IncomingCallNotification.useTelnyxWebRTC[webrtc]"],
        onCallEnded: {
            "IncomingCallNotification.useTelnyxWebRTC[webrtc]": (_call)=>{
                clearTranscript();
            }
        }["IncomingCallNotification.useTelnyxWebRTC[webrtc]"]
    });
    // Fallback to UI store for video features (not in WebRTC)
    const { call: uiCall, requestVideo, endVideo } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$ui$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIStore"])();
    const [callDuration, setCallDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("00:00");
    const [callNotes, setCallNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [disposition, setDisposition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isMinimized, setIsMinimized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showTransferModal, setShowTransferModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isRecording, setIsRecording] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Map WebRTC call state to UI format (real Telnyx calls only)
    const call = webrtc.currentCall ? {
        status: webrtc.currentCall.state === "ringing" ? webrtc.currentCall.direction === "inbound" ? "incoming" : "active" : webrtc.currentCall.state === "active" ? "active" : webrtc.currentCall.state === "ended" ? "ended" : "idle",
        caller: {
            name: webrtc.currentCall.remoteName || "Unknown Caller",
            number: webrtc.currentCall.remoteNumber
        },
        isMuted: webrtc.currentCall.isMuted,
        isOnHold: webrtc.currentCall.isHeld,
        isRecording,
        startTime: webrtc.currentCall.startTime?.getTime(),
        videoStatus: uiCall.videoStatus || "off",
        isLocalVideoEnabled: uiCall.isLocalVideoEnabled,
        isRemoteVideoEnabled: uiCall.isRemoteVideoEnabled,
        isScreenSharing: false,
        connectionQuality: "excellent",
        hasVirtualBackground: false,
        reactions: [],
        chatMessages: [],
        participants: [],
        meetingLink: ""
    } : {
        status: "idle",
        caller: null,
        isMuted: false,
        isOnHold: false,
        isRecording: false,
        startTime: undefined,
        videoStatus: "off",
        isLocalVideoEnabled: false,
        isRemoteVideoEnabled: false
    };
    // Cross-tab synchronization
    const sync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$cross$2d$tab$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCrossTabSync"])();
    // Initialize transcript on call answer
    const startRecording = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$transcript$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranscriptStore"])({
        "IncomingCallNotification.useTranscriptStore[startRecording]": (state)=>state.startRecording
    }["IncomingCallNotification.useTranscriptStore[startRecording]"]);
    const stopRecording = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$transcript$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranscriptStore"])({
        "IncomingCallNotification.useTranscriptStore[stopRecording]": (state)=>state.stopRecording
    }["IncomingCallNotification.useTranscriptStore[stopRecording]"]);
    const clearTranscript = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$transcript$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranscriptStore"])({
        "IncomingCallNotification.useTranscriptStore[clearTranscript]": (state)=>state.clearTranscript
    }["IncomingCallNotification.useTranscriptStore[clearTranscript]"]);
    const addEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$transcript$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranscriptStore"])({
        "IncomingCallNotification.useTranscriptStore[addEntry]": (state)=>state.addEntry
    }["IncomingCallNotification.useTranscriptStore[addEntry]"]);
    // Fetch company ID for current user
    const [companyId, setCompanyId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IncomingCallNotification.useEffect": ()=>{
            async function fetchCompanyId() {
                const supabase = await __turbopack_context__.A("[project]/packages/database/src/client.ts [app-client] (ecmascript, async loader)").then({
                    "IncomingCallNotification.useEffect.fetchCompanyId": (m)=>m.createClient()
                }["IncomingCallNotification.useEffect.fetchCompanyId"]);
                if (!supabase) {
                    return;
                }
                const { data: { user } } = await supabase.auth.getUser();
                try {
                    if (!user) {
                        return;
                    }
                    const { data, error } = await supabase.from("company_memberships").select("company_id").eq("user_id", user.id).eq("status", "active").order("updated_at", {
                        ascending: false
                    }).limit(1);
                    if (error) {
                        return;
                    }
                    const firstRow = Array.isArray(data) ? data[0] : data;
                    if (firstRow?.company_id) {
                        setCompanyId(firstRow.company_id);
                    }
                } catch (_error) {}
            }
            fetchCompanyId();
        }
    }["IncomingCallNotification.useEffect"], []);
    // Fetch real customer data from database (React Query)
    const { data: fetchedCustomerData, isLoading: isLoadingCustomer } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$customer$2d$lookup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerLookup"])(call.caller?.number, companyId || undefined);
    // Use fetched data or fallback to default
    const customerData = fetchedCustomerData || {
        name: call.caller?.name || "Unknown Customer",
        email: "",
        phone: call.caller?.number || "Unknown",
        company: "",
        accountStatus: "Unknown",
        lastContact: "Never",
        totalCalls: 0,
        openTickets: 0,
        priority: "medium",
        tags: [],
        recentIssues: [],
        aiData: {
            isKnownCustomer: false,
            isSpam: false,
            spamConfidence: 0,
            recognitionSource: "unknown",
            trustScore: AI_MEDIUM_TRUST_SCORE,
            callHistory: [],
            similarCallers: 0,
            riskLevel: "medium",
            aiNotes: [
                "Loading customer data..."
            ]
        }
    };
    // Generate call ID from caller info
    const callId = `call-${call.caller?.number || Date.now()}`;
    // Broadcast incoming call to other tabs
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IncomingCallNotification.useEffect": ()=>{
            if (call.status === "incoming" && call.caller) {
                sync.broadcastIncomingCall(call.caller);
            }
        }
    }["IncomingCallNotification.useEffect"], [
        call.status,
        call.caller,
        sync
    ]);
    // Initial dimensions
    const [currentHeight, setCurrentHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(800);
    // Drag-to-move functionality
    const dragHook = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$draggable$2d$position$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDraggablePosition"])({
        width: 900,
        height: currentHeight,
        onBeyondBounds: {
            "IncomingCallNotification.useDraggablePosition[dragHook]": (isBeyond)=>{
                handleBeyondBounds(isBeyond);
            }
        }["IncomingCallNotification.useDraggablePosition[dragHook]"]
    });
    // Multi-directional resize functionality
    const resizeHook = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$resizable$2d$multi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useResizableMulti"])(dragHook.position, currentHeight, {
        onResize: {
            "IncomingCallNotification.useResizableMulti[resizeHook]": (_width, height, _x, _y)=>{
                setCurrentHeight(height);
            }
        }["IncomingCallNotification.useResizableMulti[resizeHook]"]
    });
    // Pop-out window functionality
    const { isPopOutZone, isPopOutActive, popOutWindow, handleBeyondBounds, createPopOut, returnToMain, focusPopOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$pop$2d$out$2d$drag$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePopOutDrag"])({
        callId,
        onPopOutCreated: {
            "IncomingCallNotification.usePopOutDrag": ()=>{}
        }["IncomingCallNotification.usePopOutDrag"],
        onPopOutClosed: {
            "IncomingCallNotification.usePopOutDrag": ()=>{}
        }["IncomingCallNotification.usePopOutDrag"]
    });
    // Handle creating pop-out when drag ends in pop-out zone
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IncomingCallNotification.useEffect": ()=>{
            if (isPopOutZone && !dragHook.isDragging) {
                createPopOut();
            }
        }
    }["IncomingCallNotification.useEffect"], [
        isPopOutZone,
        dragHook.isDragging,
        createPopOut
    ]);
    // Mock transcript entries for demo
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IncomingCallNotification.useEffect": ()=>{
            if (call.status === "active") {
                startRecording();
                // Add demo transcript entries
                const timer1 = setTimeout({
                    "IncomingCallNotification.useEffect.timer1": ()=>{
                        addEntry({
                            speaker: "customer",
                            text: "Hi, I'm calling about my recent order. My name is John Smith and my email is john.smith@example.com"
                        });
                    }
                }["IncomingCallNotification.useEffect.timer1"], 2000);
                const timer2 = setTimeout({
                    "IncomingCallNotification.useEffect.timer2": ()=>{
                        addEntry({
                            speaker: "csr",
                            text: "Thank you for calling. I'll help you with that. Let me pull up your account."
                        });
                    }
                }["IncomingCallNotification.useEffect.timer2"], 4000);
                const timer3 = setTimeout({
                    "IncomingCallNotification.useEffect.timer3": ()=>{
                        addEntry({
                            speaker: "customer",
                            text: "I haven't received my package yet and it's been 5 days. The tracking number shows it's still in processing."
                        });
                    }
                }["IncomingCallNotification.useEffect.timer3"], 6000);
                const timer4 = setTimeout({
                    "IncomingCallNotification.useEffect.timer4": ()=>{
                        addEntry({
                            speaker: "csr",
                            text: "I understand your concern. Let me check on that for you right away. I'll follow up with the shipping department and send you an email update within 24 hours."
                        });
                    }
                }["IncomingCallNotification.useEffect.timer4"], 8000);
                return ({
                    "IncomingCallNotification.useEffect": ()=>{
                        clearTimeout(timer1);
                        clearTimeout(timer2);
                        clearTimeout(timer3);
                        clearTimeout(timer4);
                    }
                })["IncomingCallNotification.useEffect"];
            }
            if (call.status === "ended") {
                // Only stop recording when call actually ends
                stopRecording();
            }
        }
    }["IncomingCallNotification.useEffect"], [
        call.status,
        addEntry,
        startRecording,
        stopRecording
    ]); // Fixed: Only depend on call.status, functions should be stable
    // Call duration timer
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IncomingCallNotification.useEffect": ()=>{
            if (call.status === "active" && call.startTime) {
                const UPDATE_INTERVAL = 1000;
                const SECONDS_PER_MINUTE = 60;
                const interval = setInterval({
                    "IncomingCallNotification.useEffect.interval": ()=>{
                        const now = Date.now();
                        const duration = Math.floor((now - (call.startTime || now)) / UPDATE_INTERVAL);
                        const minutes = Math.floor(duration / SECONDS_PER_MINUTE);
                        const seconds = duration % SECONDS_PER_MINUTE;
                        setCallDuration(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
                    }
                }["IncomingCallNotification.useEffect.interval"], UPDATE_INTERVAL);
                return ({
                    "IncomingCallNotification.useEffect": ()=>clearInterval(interval)
                })["IncomingCallNotification.useEffect"];
            }
        }
    }["IncomingCallNotification.useEffect"], [
        call.status,
        call.startTime
    ]);
    if (call.status === "idle" || call.status === "ended" || !call.caller) {
        return null;
    }
    // Wrapped handlers that use WebRTC and broadcast to other tabs
    const handleAnswerCall = async ()=>{
        // Real Telnyx call handling only
        try {
            await webrtc.answerCall();
            sync.broadcastCallAnswered();
            // Open call window in new tab when user accepts the call
            if ("TURBOPACK compile-time truthy", 1) {
                const params = new URLSearchParams({
                    callId,
                    ...companyId && {
                        companyId
                    },
                    ...call.caller?.number && {
                        from: call.caller.number
                    },
                    direction: "inbound"
                });
                const url = `/call?${params.toString()}`;
                window.open(url, "_blank", "noopener,noreferrer");
            }
        } catch (_error) {}
    };
    const handleEndCall = async ()=>{
        // Real Telnyx call handling only
        if (!webrtc.currentCall) {
            clearTranscript();
            setIsRecording(false);
            sync.broadcastCallEnded();
            return;
        }
        try {
            await webrtc.endCall();
            clearTranscript();
            setIsRecording(false); // Reset recording state
            sync.broadcastCallEnded();
        } catch (_error) {}
    };
    const handleVoicemail = async ()=>{
        setDisposition("voicemail");
        if (!webrtc.currentCall) {
            clearTranscript();
            sync.broadcastCallEnded();
            return;
        }
        try {
            await webrtc.endCall();
            sync.broadcastCallEnded();
        } catch (_error) {}
    };
    const handleToggleMute = async ()=>{
        // Real Telnyx call handling only
        try {
            if (call.isMuted) {
                await webrtc.unmuteCall();
                sync.broadcastCallAction("unmute");
            } else {
                await webrtc.muteCall();
                sync.broadcastCallAction("mute");
            }
        } catch (_error) {}
    };
    const handleToggleHold = async ()=>{
        // Real Telnyx call handling only
        try {
            if (call.isOnHold) {
                await webrtc.unholdCall();
                sync.broadcastCallAction("unhold");
            } else {
                await webrtc.holdCall();
                sync.broadcastCallAction("hold");
            }
        } catch (_error) {}
    };
    const handleToggleRecording = async ()=>{
        if (!webrtc.currentCall?.id) {
            return;
        }
        try {
            if (isRecording) {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$data$3a$840cd6__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["stopCallRecording"])(webrtc.currentCall.id);
                if (result.success) {
                    setIsRecording(false);
                    sync.broadcastCallAction("record_stop");
                } else {}
            } else {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$data$3a$4a9e61__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["startCallRecording"])(webrtc.currentCall.id);
                if (result.success) {
                    setIsRecording(true);
                    sync.broadcastCallAction("record_start");
                } else {}
            }
        } catch (_error) {}
    };
    const handleSendDTMF = async (digit)=>{
        try {
            await webrtc.sendDTMF(digit);
        } catch (_error) {}
    };
    const handleTransfer = ()=>{
        setShowTransferModal(true);
    };
    const handleTransferSuccess = ()=>{
        // Call will end after successful transfer
        clearTranscript();
        sync.broadcastCallEnded();
    };
    // Show video conference view when video is active
    if (call.status === "active" && (call.videoStatus === "requesting" || call.videoStatus === "ringing" || call.videoStatus === "connected")) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(VideoConferenceView, {
            addReaction: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$ui$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIStore"].getState().addReaction,
            call: call,
            callDuration: callDuration,
            caller: call.caller,
            onEndCall: handleEndCall,
            onEndVideo: endVideo,
            onToggleLocalVideo: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$ui$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIStore"].getState().toggleLocalVideo,
            sendChatMessage: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$ui$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIStore"].getState().sendChatMessage,
            toggleMute: handleToggleMute,
            toggleRecording: handleToggleRecording,
            toggleScreenShare: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$ui$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIStore"].getState().toggleScreenShare,
            toggleVirtualBackground: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$ui$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIStore"].getState().toggleVirtualBackground
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
            lineNumber: 2164,
            columnNumber: 4
        }, this);
    }
    if (call.status === "incoming") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IncomingCallView, {
            caller: call.caller,
            customerData: customerData,
            onAnswer: handleAnswerCall,
            onDecline: handleEndCall,
            onVoicemail: handleVoicemail
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
            lineNumber: 2183,
            columnNumber: 4
        }, this);
    }
    if (isMinimized) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MinimizedCallWidget, {
            call: call,
            callDuration: callDuration,
            caller: call.caller,
            onEndCall: handleEndCall,
            onMaximize: ()=>setIsMinimized(false),
            sendDTMF: handleSendDTMF,
            toggleHold: handleToggleHold,
            toggleMute: handleToggleMute
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
            lineNumber: 2195,
            columnNumber: 4
        }, this);
    }
    // Show indicator badge when call is popped out
    if (isPopOutActive) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$call$2f$call$2d$indicator$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CallIndicatorBadge"], {
            callId: callId,
            customerName: call.caller?.name || "Unknown Caller",
            customerPhone: call.caller?.number || "",
            duration: Math.floor((Date.now() - (call.startTime || Date.now())) / 1000),
            isActive: call.status === "active",
            onFocusPopOut: focusPopOut,
            onReturnToMain: returnToMain,
            position: "bottom-right"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
            lineNumber: 2211,
            columnNumber: 4
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActiveCallView, {
                call: call,
                callDuration: callDuration,
                caller: call.caller,
                callNotes: callNotes,
                customerData: customerData,
                disposition: disposition,
                handleMouseDown: dragHook.handleMouseDown,
                handleTouchStart: dragHook.handleTouchStart,
                height: resizeHook.height,
                isDragging: dragHook.isDragging,
                isPopOutZone: isPopOutZone,
                isResizing: resizeHook.isResizing,
                onEndCall: handleEndCall,
                onEndVideo: endVideo,
                onMinimize: ()=>setIsMinimized(true),
                onRequestVideo: requestVideo,
                onTransfer: handleTransfer,
                position: resizeHook.position,
                resizeHandles: {
                    handleNorth: resizeHook.handleNorth,
                    handleEast: resizeHook.handleEast,
                    handleSouth: resizeHook.handleSouth,
                    handleWest: resizeHook.handleWest,
                    handleNorthEast: resizeHook.handleNorthEast,
                    handleSouthEast: resizeHook.handleSouthEast,
                    handleSouthWest: resizeHook.handleSouthWest,
                    handleNorthWest: resizeHook.handleNorthWest
                },
                setCallNotes: setCallNotes,
                setDisposition: setDisposition,
                toggleHold: handleToggleHold,
                toggleMute: handleToggleMute,
                toggleRecording: handleToggleRecording,
                width: resizeHook.width
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                lineNumber: 2228,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TransferCallModal, {
                callControlId: webrtc.currentCall?.id || null,
                fromNumber: call.caller?.number || "",
                onOpenChange: setShowTransferModal,
                onTransferSuccess: handleTransferSuccess,
                open: showTransferModal
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/incoming-call-notification.tsx",
                lineNumber: 2265,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true);
}
_s4(IncomingCallNotification, "/9C+KE/KYvSxKyBdjyYsSBOTmH0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$telnyx$2d$webrtc$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTelnyxWebRTC"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$ui$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$cross$2d$tab$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCrossTabSync"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$transcript$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranscriptStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$transcript$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranscriptStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$transcript$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranscriptStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$transcript$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranscriptStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$customer$2d$lookup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCustomerLookup"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$draggable$2d$position$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDraggablePosition"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$resizable$2d$multi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useResizableMulti"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$pop$2d$out$2d$drag$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePopOutDrag"]
    ];
});
_c40 = IncomingCallNotification;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15, _c16, _c17, _c18, _c19, _c20, _c21, _c22, _c23, _c24, _c25, _c26, _c27, _c28, _c29, _c30, _c31, _c32, _c33, _c34, _c35, _c36, _c37, _c38, _c39, _c40;
__turbopack_context__.k.register(_c, "AlertCircle");
__turbopack_context__.k.register(_c1, "AlertTriangle");
__turbopack_context__.k.register(_c2, "ArrowRightLeft");
__turbopack_context__.k.register(_c3, "Brain$dynamic");
__turbopack_context__.k.register(_c4, "Brain");
__turbopack_context__.k.register(_c5, "Building2");
__turbopack_context__.k.register(_c6, "CheckCircle2");
__turbopack_context__.k.register(_c7, "ChevronDown");
__turbopack_context__.k.register(_c8, "ChevronUp");
__turbopack_context__.k.register(_c9, "Clock");
__turbopack_context__.k.register(_c10, "FileText");
__turbopack_context__.k.register(_c11, "Hash");
__turbopack_context__.k.register(_c12, "HelpCircle");
__turbopack_context__.k.register(_c13, "Maximize2");
__turbopack_context__.k.register(_c14, "Mic");
__turbopack_context__.k.register(_c15, "MicOff");
__turbopack_context__.k.register(_c16, "Minimize2");
__turbopack_context__.k.register(_c17, "Pause");
__turbopack_context__.k.register(_c18, "Phone");
__turbopack_context__.k.register(_c19, "PhoneOff");
__turbopack_context__.k.register(_c20, "Play");
__turbopack_context__.k.register(_c21, "Settings");
__turbopack_context__.k.register(_c22, "Shield");
__turbopack_context__.k.register(_c23, "Square");
__turbopack_context__.k.register(_c24, "SquareStack");
__turbopack_context__.k.register(_c25, "Tag$dynamic");
__turbopack_context__.k.register(_c26, "Tag");
__turbopack_context__.k.register(_c27, "User$dynamic");
__turbopack_context__.k.register(_c28, "User");
__turbopack_context__.k.register(_c29, "Video");
__turbopack_context__.k.register(_c30, "VideoOff");
__turbopack_context__.k.register(_c31, "Voicemail");
__turbopack_context__.k.register(_c32, "TransferCallModal");
__turbopack_context__.k.register(_c33, "AIAutofillPreview");
__turbopack_context__.k.register(_c34, "TranscriptPanel");
__turbopack_context__.k.register(_c35, "VideoConferenceView");
__turbopack_context__.k.register(_c36, "IncomingCallView");
__turbopack_context__.k.register(_c37, "MinimizedCallWidget");
__turbopack_context__.k.register(_c38, "DashboardCard");
__turbopack_context__.k.register(_c39, "ActiveCallView");
__turbopack_context__.k.register(_c40, "IncomingCallNotification");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/layout/incoming-call-notification.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/src/components/layout/incoming-call-notification.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=apps_web_src_eef64b54._.js.map