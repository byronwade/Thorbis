(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/components/layout/nav-grouped.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavGrouped",
    ()=>NavGrouped
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
;
;
function NavGrouped({ groups, pathname = "/dashboard", searchParams, className }) {
    const safePathname = pathname || "/dashboard";
    // Guard against undefined or null groups
    if (!Array.isArray(groups)) {
        return null;
    }
    // Known work subpaths that should NOT mark Jobs (/dashboard/work) as active
    const workSubpaths = [
        "/team",
        "/invoices",
        "/estimates",
        "/contracts",
        "/appointments",
        "/payments",
        "/purchase-orders",
        "/maintenance-plans",
        "/service-agreements",
        "/materials",
        "/equipment",
        "/pricebook",
        "/schedule"
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: groups.map((group, groupIndex)=>{
            // Skip groups without items array
            if (!Array.isArray(group?.items)) {
                return null;
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarGroup"], {
                className: className,
                children: [
                    group.label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarGroupLabel"], {
                        children: group.label
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                        lineNumber: 79,
                        columnNumber: 8
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenu"], {
                        children: group.items.map((item)=>{
                            // Extract pathname and query params from item.url
                            const itemUrl = new URL(item.url, 'http://localhost');
                            const itemPathname = itemUrl.pathname;
                            const itemSearchParams = itemUrl.searchParams;
                            // Check if pathname matches
                            const pathnameMatches = safePathname === itemPathname;
                            // Check if query params match (if item has query params)
                            let queryParamsMatch = true;
                            if (itemSearchParams.toString() && searchParams) {
                                for (const [key, value] of itemSearchParams.entries()){
                                    if (searchParams.get(key) !== value) {
                                        queryParamsMatch = false;
                                        break;
                                    }
                                }
                            } else if (itemSearchParams.toString() && !searchParams) {
                                // Item has query params but current page doesn't
                                queryParamsMatch = false;
                            }
                            // Check if current path matches this item or its detail pages
                            const isExactMatch = pathnameMatches && queryParamsMatch;
                            // Special handling for Jobs (/dashboard/work) to exclude known work subpaths
                            let isDetailPage = safePathname.startsWith(`${item.url}/`);
                            if (item.url === "/dashboard/work" && isDetailPage) {
                                // Check if pathname matches any known work subpath
                                const pathAfterWork = safePathname.replace("/dashboard/work", "");
                                const isKnownSubpath = workSubpaths.some((subpath)=>pathAfterWork.startsWith(subpath));
                                if (isKnownSubpath) {
                                    isDetailPage = false; // Don't mark Jobs as active for known subpaths
                                }
                            }
                            const hasActiveSubItem = item.items?.some((subItem)=>safePathname === subItem.url);
                            const isActive = isExactMatch || isDetailPage || hasActiveSubItem;
                            // If item has sub-items, render parent + children (always open, no chevron)
                            if (item.items && item.items.length > 0) {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuItem"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuButton"], {
                                            asChild: true,
                                            isActive: isActive && safePathname === item.url,
                                            tooltip: item.title,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.url,
                                                children: [
                                                    item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {}, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                                        lineNumber: 140,
                                                        columnNumber: 28
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: item.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                                        lineNumber: 141,
                                                        columnNumber: 14
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                                lineNumber: 139,
                                                columnNumber: 13
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                            lineNumber: 134,
                                            columnNumber: 12
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuSub"], {
                                            children: item.items.map((subItem)=>{
                                                const isSubActive = safePathname === subItem.url || safePathname.startsWith(`${subItem.url}/`);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuSubItem"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuSubButton"], {
                                                        asChild: true,
                                                        isActive: isSubActive,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: subItem.url,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: subItem.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                                                lineNumber: 156,
                                                                columnNumber: 18
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                                            lineNumber: 155,
                                                            columnNumber: 17
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 16
                                                    }, this)
                                                }, subItem.title, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                                    lineNumber: 150,
                                                    columnNumber: 15
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                            lineNumber: 144,
                                            columnNumber: 12
                                        }, this)
                                    ]
                                }, item.title, true, {
                                    fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                    lineNumber: 133,
                                    columnNumber: 11
                                }, this);
                            }
                            // Regular menu item without sub-items
                            const isAnchorLink = item.url.startsWith("#");
                            const highlightClass = item.highlight === "yellow" ? "ring-2 ring-yellow-500/50 hover:ring-yellow-500/70 dark:ring-yellow-500/50 dark:hover:ring-yellow-500/70" : "";
                            // If onClick is provided, use button instead of Link
                            if (item.onClick) {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuItem"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuButton"], {
                                            className: highlightClass,
                                            isActive: isActive,
                                            onClick: item.onClick,
                                            tooltip: item.title,
                                            children: [
                                                item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {}, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 27
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: item.title
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                                    lineNumber: 185,
                                                    columnNumber: 13
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                            lineNumber: 178,
                                            columnNumber: 12
                                        }, this),
                                        item.badge !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuBadge"], {
                                            children: typeof item.badge === "number" ? item.badge.toLocaleString() : item.badge
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                            lineNumber: 188,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, item.title, true, {
                                    fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                    lineNumber: 177,
                                    columnNumber: 11
                                }, this);
                            }
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuItem"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuButton"], {
                                        asChild: true,
                                        className: highlightClass,
                                        isActive: isActive,
                                        tooltip: item.title,
                                        children: isAnchorLink ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: item.url,
                                            children: [
                                                item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {}, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                                    lineNumber: 208,
                                                    columnNumber: 28
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: item.title
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                                    lineNumber: 209,
                                                    columnNumber: 14
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                            lineNumber: 207,
                                            columnNumber: 13
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: item.url,
                                            children: [
                                                item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {}, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                                    lineNumber: 213,
                                                    columnNumber: 28
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: item.title
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 14
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                            lineNumber: 212,
                                            columnNumber: 13
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                        lineNumber: 200,
                                        columnNumber: 11
                                    }, this),
                                    item.badge !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuBadge"], {
                                        children: typeof item.badge === "number" ? item.badge.toLocaleString() : item.badge
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                        lineNumber: 219,
                                        columnNumber: 12
                                    }, this)
                                ]
                            }, item.title, true, {
                                fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                                lineNumber: 199,
                                columnNumber: 10
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                        lineNumber: 81,
                        columnNumber: 7
                    }, this)
                ]
            }, `${group.label || "group"}-${groupIndex}`, true, {
                fileName: "[project]/apps/web/src/components/layout/nav-grouped.tsx",
                lineNumber: 77,
                columnNumber: 6
            }, this);
        })
    }, void 0, false);
}
_c = NavGrouped;
var _c;
__turbopack_context__.k.register(_c, "NavGrouped");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/layout/nav-chat-history.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AiNewChatButton",
    ()=>AiNewChatButton,
    "NavChatHistory",
    ()=>NavChatHistory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PenLine$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript) <export default as PenLine>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/button.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/chat-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ai$2f$chat$2d$search$2d$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ai/chat-search-command.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function AiNewChatButton() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const chats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatSelectors"].chats);
    const { createChat, setActiveChat } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"])();
    const [searchOpen, setSearchOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleNewChat = ()=>{
        // Create a new temporary chat and navigate to the AI landing page
        const newChatId = createChat("New Chat");
        if (newChatId) {
            setActiveChat(newChatId);
        }
        // Navigate to the AI landing page (Thorbis AI)
        router.push("/dashboard/ai");
    };
    const hasChats = chats.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarGroup"], {
                className: "pb-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-2 space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            className: "w-full h-9 font-medium gap-2",
                            variant: "default",
                            onClick: handleNewChat,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PenLine$3e$__["PenLine"], {
                                    className: "size-4"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
                                    lineNumber: 47,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "New Chat"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
                                    lineNumber: 48,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
                            lineNumber: 42,
                            columnNumber: 6
                        }, this),
                        hasChats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            className: "w-full h-8 gap-2 justify-start text-sm font-normal bg-muted/50 border-transparent hover:bg-muted hover:border-border",
                            onClick: ()=>setSearchOpen(true),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "size-4 text-muted-foreground"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
                                    lineNumber: 58,
                                    columnNumber: 8
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-muted-foreground",
                                    children: "Search chats..."
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
                                    lineNumber: 59,
                                    columnNumber: 8
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                    className: "ml-auto hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground",
                                    children: "⌘K"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
                                    lineNumber: 60,
                                    columnNumber: 8
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
                            lineNumber: 53,
                            columnNumber: 7
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
                    lineNumber: 40,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
                lineNumber: 39,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ai$2f$chat$2d$search$2d$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChatSearchCommand"], {
                open: searchOpen,
                onOpenChange: setSearchOpen
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
                lineNumber: 69,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true);
}
_s(AiNewChatButton, "K0mshNYVPUaLVT/wNwko7JBEvUE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"]
    ];
});
_c = AiNewChatButton;
function NavChatHistory() {
    _s1();
    const chats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatSelectors"].chats);
    const activeChatId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatSelectors"].activeChatId);
    const { setActiveChat, deleteChat } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"])();
    const handleSelectChat = (chatId)=>{
        setActiveChat(chatId);
    };
    const handleDeleteChat = (e, chatId)=>{
        e.preventDefault();
        e.stopPropagation();
        deleteChat(chatId);
    };
    // Don't render anything if no chats
    if (chats.length === 0) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarGroup"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarGroupLabel"], {
                children: "Recent Chats"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
                lineNumber: 97,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenu"], {
                children: chats.slice(0, 10).map((chat)=>{
                    const isActive = activeChatId === chat.id;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuItem"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuButton"], {
                                isActive: isActive,
                                onClick: ()=>handleSelectChat(chat.id),
                                title: chat.title,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex-1 truncate text-left",
                                    children: chat.title
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
                                    lineNumber: 109,
                                    columnNumber: 9
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
                                lineNumber: 104,
                                columnNumber: 8
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuAction"], {
                                "aria-label": "Delete chat",
                                onClick: (e)=>handleDeleteChat(e, chat.id),
                                showOnHover: true,
                                title: "Delete chat",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
                                    lineNumber: 117,
                                    columnNumber: 9
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
                                lineNumber: 111,
                                columnNumber: 8
                            }, this)
                        ]
                    }, chat.id, true, {
                        fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
                        lineNumber: 103,
                        columnNumber: 7
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
                lineNumber: 98,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/layout/nav-chat-history.tsx",
        lineNumber: 96,
        columnNumber: 3
    }, this);
}
_s1(NavChatHistory, "dDTFFkAteY/5ixd8lku39JE3erM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$chat$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChatStore"]
    ];
});
_c1 = NavChatHistory;
var _c, _c1;
__turbopack_context__.k.register(_c, "AiNewChatButton");
__turbopack_context__.k.register(_c1, "NavChatHistory");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/layout/nav-flexible.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavFlexible",
    ()=>NavFlexible
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/collapsible.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/collapsible.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/sidebar.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function NavFlexible({ config, groups, items }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const activeValue = config?.activeValue;
    const setActiveValue = config?.onValueChange;
    // If items are provided directly, wrap them in a single group
    const normalizedGroups = groups || (items ? [
        {
            items
        }
    ] : []);
    const renderItem = (item)=>{
        // Link mode - traditional navigation
        if (item.mode === "link") {
            const linkItem = item;
            const isActive = pathname === linkItem.url;
            // If has sub-items, render as collapsible
            if (linkItem.items && linkItem.items.length > 0) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Collapsible"], {
                    asChild: true,
                    className: "group/collapsible",
                    defaultOpen: isActive,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuItem"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleTrigger"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuButton"], {
                                    tooltip: linkItem.title,
                                    children: [
                                        linkItem.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(linkItem.icon, {}, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                                            lineNumber: 62,
                                            columnNumber: 28
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: linkItem.title
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                                            lineNumber: 63,
                                            columnNumber: 10
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                            className: "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                                            lineNumber: 64,
                                            columnNumber: 10
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                                    lineNumber: 61,
                                    columnNumber: 9
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                                lineNumber: 60,
                                columnNumber: 8
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleContent"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuSub"], {
                                    children: linkItem.items.map((subItem)=>{
                                        const isSubActive = pathname === subItem.url;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuSubItem"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuSubButton"], {
                                                asChild: true,
                                                isActive: isSubActive,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: subItem.url,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: subItem.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                                                        lineNumber: 75,
                                                        columnNumber: 15
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                                                    lineNumber: 74,
                                                    columnNumber: 14
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                                                lineNumber: 73,
                                                columnNumber: 13
                                            }, this)
                                        }, subItem.url, false, {
                                            fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                                            lineNumber: 72,
                                            columnNumber: 12
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                                    lineNumber: 68,
                                    columnNumber: 9
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                                lineNumber: 67,
                                columnNumber: 8
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                        lineNumber: 59,
                        columnNumber: 7
                    }, this)
                }, linkItem.url, false, {
                    fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                    lineNumber: 53,
                    columnNumber: 6
                }, this);
            }
            // Regular link item
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuItem"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuButton"], {
                    asChild: true,
                    isActive: isActive,
                    tooltip: linkItem.title,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: linkItem.url,
                        children: [
                            linkItem.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(linkItem.icon, {}, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                                lineNumber: 97,
                                columnNumber: 26
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: linkItem.title
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                                lineNumber: 98,
                                columnNumber: 8
                            }, this),
                            linkItem.badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "bg-primary text-primary-foreground ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium",
                                children: linkItem.badge
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                                lineNumber: 100,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                        lineNumber: 96,
                        columnNumber: 7
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                    lineNumber: 91,
                    columnNumber: 6
                }, this)
            }, linkItem.url, false, {
                fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                lineNumber: 90,
                columnNumber: 5
            }, this);
        }
        // Tab mode - view switching
        if (item.mode === "tab") {
            const tabItem = item;
            const isActive = activeValue === tabItem.value || activeValue === undefined && config?.defaultValue === tabItem.value;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuItem"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuButton"], {
                    isActive: isActive,
                    onClick: ()=>setActiveValue?.(tabItem.value),
                    tooltip: tabItem.title,
                    children: [
                        tabItem.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(tabItem.icon, {}, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                            lineNumber: 124,
                            columnNumber: 24
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: tabItem.title
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                            lineNumber: 125,
                            columnNumber: 7
                        }, this),
                        tabItem.badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "bg-primary text-primary-foreground ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium",
                            children: tabItem.badge
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                            lineNumber: 127,
                            columnNumber: 8
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                    lineNumber: 119,
                    columnNumber: 6
                }, this)
            }, tabItem.value, false, {
                fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                lineNumber: 118,
                columnNumber: 5
            }, this);
        }
        // Filter mode - data filtering
        if (item.mode === "filter") {
            const filterItem = item;
            const isActive = activeValue === filterItem.value || activeValue === undefined && config?.defaultValue === filterItem.value;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuItem"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuButton"], {
                    isActive: isActive,
                    onClick: ()=>setActiveValue?.(filterItem.value),
                    tooltip: filterItem.title,
                    children: [
                        filterItem.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(filterItem.icon, {}, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                            lineNumber: 151,
                            columnNumber: 27
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: filterItem.title
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                            lineNumber: 152,
                            columnNumber: 7
                        }, this),
                        filterItem.count !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-muted-foreground ml-auto text-xs",
                            children: filterItem.count
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                            lineNumber: 154,
                            columnNumber: 8
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                    lineNumber: 146,
                    columnNumber: 6
                }, this)
            }, filterItem.value, false, {
                fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                lineNumber: 145,
                columnNumber: 5
            }, this);
        }
        return null;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: normalizedGroups.map((group, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarGroup"], {
                children: [
                    group.label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarGroupLabel"], {
                        children: group.label
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                        lineNumber: 170,
                        columnNumber: 22
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenu"], {
                        children: group.items.map(renderItem)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                        lineNumber: 171,
                        columnNumber: 6
                    }, this)
                ]
            }, group.label || `group-${index}`, true, {
                fileName: "[project]/apps/web/src/components/layout/nav-flexible.tsx",
                lineNumber: 169,
                columnNumber: 5
            }, this))
    }, void 0, false);
}
_s(NavFlexible, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = NavFlexible;
var _c;
__turbopack_context__.k.register(_c, "NavFlexible");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/layout/nav-main.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavMain",
    ()=>NavMain
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/collapsible.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/collapsible.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/sidebar.tsx [app-client] (ecmascript)");
;
;
;
;
;
function NavMain({ items, pathname = "/dashboard" }) {
    const safePathname = pathname || "/dashboard";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarGroup"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenu"], {
            children: items.map((item)=>{
                // Check if current path matches this item or its detail pages
                const isExactMatch = safePathname === item.url;
                const isDetailPage = safePathname.startsWith(`${item.url}/`);
                const hasActiveSubItem = item.items?.some((subItem)=>safePathname === subItem.url || safePathname.startsWith(`${subItem.url}/`));
                const isActive = isExactMatch || isDetailPage || hasActiveSubItem;
                // If item has sub-items, render parent + children
                if (item.items && item.items.length > 0) {
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Collapsible"], {
                        asChild: true,
                        defaultOpen: true,
                        open: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuItem"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleTrigger"], {
                                    asChild: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuButton"], {
                                        isActive: isActive && safePathname === item.url,
                                        tooltip: item.title,
                                        children: [
                                            item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {}, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                                                lineNumber: 65,
                                                columnNumber: 26
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: item.title
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                                                lineNumber: 66,
                                                columnNumber: 12
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                className: "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                                                lineNumber: 67,
                                                columnNumber: 12
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                                        lineNumber: 61,
                                        columnNumber: 11
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                                    lineNumber: 60,
                                    columnNumber: 10
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$collapsible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleContent"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuSub"], {
                                        children: item.items.map((subItem)=>{
                                            const isSubActive = safePathname === subItem.url || safePathname.startsWith(`${subItem.url}/`);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuSubItem"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuSubButton"], {
                                                    asChild: true,
                                                    isActive: isSubActive,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: subItem.url,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: subItem.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                                                            lineNumber: 83,
                                                            columnNumber: 17
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                                                        lineNumber: 82,
                                                        columnNumber: 16
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                                                    lineNumber: 78,
                                                    columnNumber: 15
                                                }, this)
                                            }, subItem.title, false, {
                                                fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                                                lineNumber: 77,
                                                columnNumber: 14
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                                        lineNumber: 71,
                                        columnNumber: 11
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                                    lineNumber: 70,
                                    columnNumber: 10
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                            lineNumber: 59,
                            columnNumber: 9
                        }, this)
                    }, item.title, false, {
                        fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                        lineNumber: 53,
                        columnNumber: 8
                    }, this);
                }
                // Regular menu item without sub-items
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuItem"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuButton"], {
                        asChild: true,
                        isActive: isActive,
                        tooltip: item.title,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: item.url,
                            children: [
                                item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {}, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                                    lineNumber: 105,
                                    columnNumber: 24
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: item.title
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                                    lineNumber: 106,
                                    columnNumber: 10
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                            lineNumber: 104,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                        lineNumber: 99,
                        columnNumber: 8
                    }, this)
                }, item.title, false, {
                    fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
                    lineNumber: 98,
                    columnNumber: 7
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
            lineNumber: 38,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/layout/nav-main.tsx",
        lineNumber: 37,
        columnNumber: 3
    }, this);
}
_c = NavMain;
var _c;
__turbopack_context__.k.register(_c, "NavMain");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/layout/app-sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppSidebar",
    ()=>AppSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * AppSidebar - Dynamic Navigation Component
 *
 * Performance optimizations:
 * - Uses dynamic icon imports from @/lib/icons/icon-registry
 * - Icons are code-split and loaded on demand
 * - Reduces initial bundle by ~300-900KB
 * - Only loads icons needed for current page section
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$communication$2f$communication$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/communication/communication-switcher.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$communication$2f$communication$2d$reports$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/communication/communication-reports-sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$communication$2f$email$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/communication/email-sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$communication$2f$text$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/communication/text-sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$communication$2f$teams$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/communication/teams-sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$nav$2d$chat$2d$history$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/nav-chat-history.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$nav$2d$flexible$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/nav-flexible.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$nav$2d$grouped$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/nav-grouped.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$nav$2d$main$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/nav-main.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$pricebook$2f$pricebook$2d$tree$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/pricebook/pricebook-tree-sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$reporting$2f$reporting$2d$sidebar$2d$nav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/reporting/reporting-sidebar-nav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$work$2f$job$2d$details$2f$job$2d$details$2d$nav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/work/job-details/job-details-nav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils/icon-registry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$sidebar$2d$scroll$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/use-sidebar-scroll.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
// Navigation sections for each route
const navigationSections = {
    today: [
        {
            title: "Today",
            url: "/dashboard",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Home"]
        }
    ],
    communication: [
        {
            label: "Company Communications",
            items: [
                {
                    title: "All Communications",
                    url: "/dashboard/communication",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Building2"],
                    badge: "new",
                    description: "Company-wide communications hub"
                }
            ]
        },
        {
            label: "My Inbox",
            items: [
                {
                    title: "My Email",
                    url: "/dashboard/communication/email?folder=inbox",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mail"],
                    description: "Personal email inbox"
                },
                {
                    title: "My SMS",
                    url: "/dashboard/communication/sms",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageSquare"],
                    description: "Personal text messages"
                },
                {
                    title: "My Calls",
                    url: "/dashboard/communication/calls",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Phone"],
                    description: "Personal call history"
                }
            ]
        },
        {
            label: "Team Collaboration",
            items: [
                {
                    title: "Teams",
                    url: "/dashboard/communication/teams?channel=general",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Users"],
                    description: "Team channels and discussions"
                }
            ]
        },
        {
            label: "Analytics",
            items: [
                {
                    title: "Statistics",
                    url: "/dashboard/communication/stats",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"],
                    description: "Communication metrics and reports"
                }
            ]
        }
    ],
    work: [
        {
            label: "Work Management",
            items: [
                {
                    title: "Jobs",
                    url: "/dashboard/work",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClipboardList"]
                },
                {
                    title: "Appointments",
                    url: "/dashboard/work/appointments",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calendar"]
                },
                {
                    title: "Team Members",
                    url: "/dashboard/work/team",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserPlus"]
                },
                {
                    title: "Customers",
                    url: "/dashboard/customers",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Users"]
                }
            ]
        },
        {
            label: "Financial Documents",
            items: [
                {
                    title: "Invoices",
                    url: "/dashboard/work/invoices",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileText"]
                },
                {
                    title: "Estimates",
                    url: "/dashboard/work/estimates",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileText"]
                },
                {
                    title: "Payments",
                    url: "/dashboard/work/payments",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreditCard"]
                },
                {
                    title: "Contracts",
                    url: "/dashboard/work/contracts",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileSignature"]
                },
                {
                    title: "Purchase Orders",
                    url: "/dashboard/work/purchase-orders",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Receipt"]
                }
            ]
        },
        {
            label: "Service Management",
            items: [
                {
                    title: "Maintenance Plans",
                    url: "/dashboard/work/maintenance-plans",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Wrench"]
                },
                {
                    title: "Service Agreements",
                    url: "/dashboard/work/service-agreements",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShieldCheck"]
                }
            ]
        },
        {
            label: "Company Resources",
            items: [
                {
                    title: "Price Book",
                    url: "/dashboard/work/pricebook",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BookOpen"]
                },
                {
                    title: "Vendors",
                    url: "/dashboard/work/vendors",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Building2"]
                },
                {
                    title: "Materials Inventory",
                    url: "/dashboard/work/materials",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Box"]
                },
                {
                    title: "Equipment & Fleet",
                    url: "/dashboard/work/equipment",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Package"]
                }
            ]
        }
    ],
    finance: [
        {
            label: "Overview",
            items: [
                {
                    title: "Banking",
                    url: "/dashboard/finance",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Building2"]
                },
                {
                    title: "Cash Flow",
                    url: "/dashboard/finance/cash-flow",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingUp"]
                },
                {
                    title: "Payments",
                    url: "/dashboard/finance/payments",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreditCard"]
                },
                {
                    title: "Reports",
                    url: "/dashboard/finance/reports",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileText"],
                    badge: "Soon"
                }
            ]
        },
        {
            label: "Expenses",
            items: [
                {
                    title: "Expenses",
                    url: "/dashboard/finance/expenses",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Receipt"],
                    badge: "Soon"
                },
                {
                    title: "Debit Cards",
                    url: "/dashboard/finance/debit-cards",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreditCard"]
                },
                {
                    title: "Credit Cards",
                    url: "/dashboard/finance/credit-cards",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreditCard"]
                }
            ]
        },
        {
            label: "Bookkeeping",
            items: [
                {
                    title: "Bookkeeping",
                    url: "/dashboard/finance/bookkeeping",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Book"],
                    badge: "Soon"
                },
                {
                    title: "Bank Reconciliation",
                    url: "/dashboard/finance/bank-reconciliation",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckCircle2"],
                    badge: "Soon"
                },
                {
                    title: "Journal Entries",
                    url: "/dashboard/finance/journal-entries",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileEdit"],
                    badge: "Soon"
                }
            ]
        },
        {
            label: "Accounting",
            items: [
                {
                    title: "Accounting",
                    url: "/dashboard/finance/accounting",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calculator"],
                    badge: "Soon"
                },
                {
                    title: "Chart of Accounts",
                    url: "/dashboard/finance/chart-of-accounts",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["List"],
                    badge: "Soon"
                },
                {
                    title: "General Ledger",
                    url: "/dashboard/finance/general-ledger",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BookOpen"],
                    badge: "Soon"
                },
                {
                    title: "Accounts Receivable",
                    url: "/dashboard/finance/accounts-receivable",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArrowDownToLine"],
                    badge: "Soon"
                },
                {
                    title: "Accounts Payable",
                    url: "/dashboard/finance/accounts-payable",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArrowUpFromLine"],
                    badge: "Soon"
                },
                {
                    title: "QuickBooks",
                    url: "/dashboard/finance/quickbooks",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Building2"],
                    badge: "Soon"
                }
            ]
        },
        {
            label: "Payroll & Taxes",
            items: [
                {
                    title: "Payroll",
                    url: "/dashboard/finance/payroll",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Users"],
                    badge: "Soon"
                },
                {
                    title: "Taxes",
                    url: "/dashboard/finance/tax",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileText"],
                    badge: "Soon"
                }
            ]
        },
        {
            label: "Financing",
            items: [
                {
                    title: "Business Financing",
                    url: "/dashboard/finance/business-financing",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Building2"],
                    badge: "Soon"
                },
                {
                    title: "Consumer Financing",
                    url: "/dashboard/finance/consumer-financing",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Users"],
                    badge: "Soon"
                }
            ]
        },
        {
            label: "Planning",
            items: [
                {
                    title: "Budget",
                    url: "/dashboard/finance/budget",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Target"],
                    badge: "Soon"
                }
            ]
        }
    ],
    reporting: [
        {
            label: "Sections",
            items: [
                {
                    title: "Overview",
                    url: "/dashboard/reporting",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"],
                    badge: "Soon"
                },
                {
                    title: "Executive Dashboard",
                    url: "/dashboard/reporting/executive",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingUp"],
                    badge: "Soon"
                },
                {
                    title: "AI Insights",
                    url: "/dashboard/reporting/ai",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sparkles"],
                    badge: "Soon"
                },
                {
                    title: "Communication",
                    url: "/dashboard/reporting/communication",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageSquare"],
                    badge: "Soon"
                },
                {
                    title: "Finance",
                    url: "/dashboard/reporting/finance",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DollarSign"],
                    badge: "Soon"
                },
                {
                    title: "Operations",
                    url: "/dashboard/reporting/operations",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Wrench"],
                    badge: "Soon"
                },
                {
                    title: "Team Performance",
                    url: "/dashboard/reporting/team",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Users"],
                    badge: "Soon"
                },
                {
                    title: "Custom Reports",
                    url: "/dashboard/reporting/custom",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileEdit"],
                    badge: "Soon"
                }
            ]
        },
        {
            label: "AI & Intelligence",
            items: [
                {
                    title: "AI Performance Metrics",
                    url: "/dashboard/reporting/ai/performance",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sparkles"]
                },
                {
                    title: "Conversation Analytics",
                    url: "/dashboard/reporting/ai/conversations",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageSquare"]
                },
                {
                    title: "Sentiment Analysis",
                    url: "/dashboard/reporting/ai/sentiment",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Target"]
                },
                {
                    title: "AI Response Quality",
                    url: "/dashboard/reporting/ai/quality",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BadgeCheck"]
                },
                {
                    title: "Training Data Insights",
                    url: "/dashboard/reporting/ai/training",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BookOpen"]
                },
                {
                    title: "AI Cost Analysis",
                    url: "/dashboard/reporting/ai/costs",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DollarSign"]
                },
                {
                    title: "Automation Success Rate",
                    url: "/dashboard/reporting/ai/automation",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Zap"]
                }
            ]
        },
        {
            label: "Communication Analytics",
            items: [
                {
                    title: "Phone Call Reports",
                    url: "/dashboard/reporting/communication/calls",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Phone"]
                },
                {
                    title: "Call Duration & Volume",
                    url: "/dashboard/reporting/communication/call-metrics",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"]
                },
                {
                    title: "Call Recordings",
                    url: "/dashboard/reporting/communication/call-recordings",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Archive"]
                },
                {
                    title: "Text Message Analytics",
                    url: "/dashboard/reporting/communication/sms",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageSquare"]
                },
                {
                    title: "Email Campaigns",
                    url: "/dashboard/reporting/communication/email",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mail"]
                },
                {
                    title: "Email Open & Click Rates",
                    url: "/dashboard/reporting/communication/email-metrics",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"]
                },
                {
                    title: "Support Ticket Analysis",
                    url: "/dashboard/reporting/communication/tickets",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Ticket"]
                },
                {
                    title: "Response Time Metrics",
                    url: "/dashboard/reporting/communication/response-time",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Clock"]
                },
                {
                    title: "Customer Satisfaction",
                    url: "/dashboard/reporting/communication/satisfaction",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Star"]
                },
                {
                    title: "Channel Performance",
                    url: "/dashboard/reporting/communication/channels",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingUp"]
                }
            ]
        },
        {
            label: "Financial Reports",
            items: [
                {
                    title: "Profit & Loss",
                    url: "/dashboard/reporting/finance/profit-loss",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DollarSign"]
                },
                {
                    title: "Revenue Analysis",
                    url: "/dashboard/reporting/finance/revenue",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingUp"]
                },
                {
                    title: "Expense Breakdown",
                    url: "/dashboard/reporting/finance/expenses",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Receipt"]
                },
                {
                    title: "Cash Flow Reports",
                    url: "/dashboard/reporting/finance/cash-flow",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArrowUpFromLine"]
                },
                {
                    title: "Invoice Aging",
                    url: "/dashboard/reporting/finance/invoice-aging",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileText"]
                },
                {
                    title: "Payment Analytics",
                    url: "/dashboard/reporting/finance/payments",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreditCard"]
                },
                {
                    title: "Tax Reports",
                    url: "/dashboard/reporting/finance/tax",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileSpreadsheet"]
                },
                {
                    title: "Budget vs Actual",
                    url: "/dashboard/reporting/finance/budget",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Target"]
                },
                {
                    title: "Job Profitability",
                    url: "/dashboard/reporting/finance/job-profitability",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"]
                },
                {
                    title: "Customer Lifetime Value",
                    url: "/dashboard/reporting/finance/ltv",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Users"]
                },
                {
                    title: "Accounts Receivable",
                    url: "/dashboard/reporting/finance/ar",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArrowDownToLine"]
                },
                {
                    title: "Accounts Payable",
                    url: "/dashboard/reporting/finance/ap",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArrowUpFromLine"]
                }
            ]
        },
        {
            label: "Operations & Jobs",
            items: [
                {
                    title: "Job Performance",
                    url: "/dashboard/reporting/operations/jobs",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClipboardList"]
                },
                {
                    title: "Service Type Analysis",
                    url: "/dashboard/reporting/operations/service-types",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Wrench"]
                },
                {
                    title: "Completion Rates",
                    url: "/dashboard/reporting/operations/completion",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckCircle2"]
                },
                {
                    title: "Schedule Efficiency",
                    url: "/dashboard/reporting/operations/schedule",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calendar"]
                },
                {
                    title: "Dispatch Analytics",
                    url: "/dashboard/reporting/operations/dispatch",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapPin"]
                },
                {
                    title: "Route Optimization",
                    url: "/dashboard/reporting/operations/routes",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapPin"]
                },
                {
                    title: "Equipment Utilization",
                    url: "/dashboard/reporting/operations/equipment",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Box"]
                },
                {
                    title: "Materials Usage",
                    url: "/dashboard/reporting/operations/materials",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Package"]
                },
                {
                    title: "Inventory Turnover",
                    url: "/dashboard/reporting/operations/inventory",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Archive"]
                },
                {
                    title: "Warranty Claims",
                    url: "/dashboard/reporting/operations/warranty",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShieldCheck"]
                }
            ]
        },
        {
            label: "Team Performance",
            items: [
                {
                    title: "Technician Leaderboard",
                    url: "/dashboard/reporting/team/leaderboard",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trophy"]
                },
                {
                    title: "Individual Performance",
                    url: "/dashboard/reporting/team/individual",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["User"]
                },
                {
                    title: "Team Productivity",
                    url: "/dashboard/reporting/team/productivity",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingUp"]
                },
                {
                    title: "Revenue Per Technician",
                    url: "/dashboard/reporting/team/revenue",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DollarSign"]
                },
                {
                    title: "Jobs Completed",
                    url: "/dashboard/reporting/team/jobs-completed",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckCircle2"]
                },
                {
                    title: "Customer Ratings",
                    url: "/dashboard/reporting/team/ratings",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Star"]
                },
                {
                    title: "Time Tracking",
                    url: "/dashboard/reporting/team/time-tracking",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Clock"]
                },
                {
                    title: "Attendance & Availability",
                    url: "/dashboard/reporting/team/attendance",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calendar"]
                },
                {
                    title: "Training Completion",
                    url: "/dashboard/reporting/team/training",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraduationCap"]
                },
                {
                    title: "Certifications",
                    url: "/dashboard/reporting/team/certifications",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BadgeCheck"]
                },
                {
                    title: "Commission Reports",
                    url: "/dashboard/reporting/team/commission",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DollarSign"]
                },
                {
                    title: "Bonus Tracking",
                    url: "/dashboard/reporting/team/bonus",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Star"]
                }
            ]
        },
        {
            label: "Customer Analytics",
            items: [
                {
                    title: "Customer Acquisition",
                    url: "/dashboard/reporting/customers/acquisition",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Users"]
                },
                {
                    title: "Retention Rates",
                    url: "/dashboard/reporting/customers/retention",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingUp"]
                },
                {
                    title: "Churn Analysis",
                    url: "/dashboard/reporting/customers/churn",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArrowDownToLine"]
                },
                {
                    title: "Customer Segments",
                    url: "/dashboard/reporting/customers/segments",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["List"]
                },
                {
                    title: "Service History",
                    url: "/dashboard/reporting/customers/service-history",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClipboardList"]
                },
                {
                    title: "Repeat Business",
                    url: "/dashboard/reporting/customers/repeat",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingUp"]
                },
                {
                    title: "Referral Sources",
                    url: "/dashboard/reporting/customers/referrals",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Users"]
                },
                {
                    title: "Customer Geography",
                    url: "/dashboard/reporting/customers/geography",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapPin"]
                },
                {
                    title: "Demographics",
                    url: "/dashboard/reporting/customers/demographics",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"]
                }
            ]
        },
        {
            label: "Marketing & Growth",
            items: [
                {
                    title: "Campaign Performance",
                    url: "/dashboard/reporting/marketing/campaigns",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Megaphone"]
                },
                {
                    title: "Lead Generation",
                    url: "/dashboard/reporting/marketing/leads",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Target"]
                },
                {
                    title: "Lead Conversion",
                    url: "/dashboard/reporting/marketing/conversion",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingUp"]
                },
                {
                    title: "ROI Analysis",
                    url: "/dashboard/reporting/marketing/roi",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DollarSign"]
                },
                {
                    title: "Website Analytics",
                    url: "/dashboard/reporting/marketing/website",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"]
                },
                {
                    title: "Social Media Metrics",
                    url: "/dashboard/reporting/marketing/social",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageSquare"]
                },
                {
                    title: "Review Analysis",
                    url: "/dashboard/reporting/marketing/reviews",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Star"]
                },
                {
                    title: "Ad Performance",
                    url: "/dashboard/reporting/marketing/ads",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Megaphone"]
                },
                {
                    title: "SEO Rankings",
                    url: "/dashboard/reporting/marketing/seo",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingUp"]
                }
            ]
        },
        {
            label: "Scheduling & Dispatch",
            items: [
                {
                    title: "Schedule Utilization",
                    url: "/dashboard/reporting/schedule/utilization",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calendar"]
                },
                {
                    title: "First-Time Fix Rate",
                    url: "/dashboard/reporting/schedule/first-time-fix",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckCircle2"]
                },
                {
                    title: "Callback Analysis",
                    url: "/dashboard/reporting/schedule/callbacks",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Phone"]
                },
                {
                    title: "Travel Time Analysis",
                    url: "/dashboard/reporting/schedule/travel-time",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapPin"]
                },
                {
                    title: "Same-Day Bookings",
                    url: "/dashboard/reporting/schedule/same-day",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calendar"]
                },
                {
                    title: "Appointment Types",
                    url: "/dashboard/reporting/schedule/appointment-types",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClipboardList"]
                },
                {
                    title: "No-Show Rate",
                    url: "/dashboard/reporting/schedule/no-shows",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["X"]
                },
                {
                    title: "Rescheduling Trends",
                    url: "/dashboard/reporting/schedule/rescheduling",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calendar"]
                }
            ]
        },
        {
            label: "Maintenance & Agreements",
            items: [
                {
                    title: "Active Agreements",
                    url: "/dashboard/reporting/maintenance/active",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileText"]
                },
                {
                    title: "Renewal Rates",
                    url: "/dashboard/reporting/maintenance/renewals",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingUp"]
                },
                {
                    title: "Service Plan Revenue",
                    url: "/dashboard/reporting/maintenance/revenue",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DollarSign"]
                },
                {
                    title: "Maintenance Schedule",
                    url: "/dashboard/reporting/maintenance/schedule",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calendar"]
                },
                {
                    title: "Preventive Maintenance",
                    url: "/dashboard/reporting/maintenance/preventive",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Shield"]
                },
                {
                    title: "Agreement Profitability",
                    url: "/dashboard/reporting/maintenance/profitability",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"]
                }
            ]
        },
        {
            label: "Inventory & Materials",
            items: [
                {
                    title: "Stock Levels",
                    url: "/dashboard/reporting/inventory/stock",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Package"]
                },
                {
                    title: "Material Costs",
                    url: "/dashboard/reporting/inventory/costs",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DollarSign"]
                },
                {
                    title: "Reorder Trends",
                    url: "/dashboard/reporting/inventory/reorder",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingUp"]
                },
                {
                    title: "Supplier Performance",
                    url: "/dashboard/reporting/inventory/suppliers",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Building2"]
                },
                {
                    title: "Part Usage",
                    url: "/dashboard/reporting/inventory/usage",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"]
                },
                {
                    title: "Dead Stock Analysis",
                    url: "/dashboard/reporting/inventory/dead-stock",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trash"]
                }
            ]
        },
        {
            label: "Compliance & Safety",
            items: [
                {
                    title: "Licensing Status",
                    url: "/dashboard/reporting/compliance/licensing",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BadgeCheck"]
                },
                {
                    title: "Insurance Coverage",
                    url: "/dashboard/reporting/compliance/insurance",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Shield"]
                },
                {
                    title: "Certification Tracking",
                    url: "/dashboard/reporting/compliance/certifications",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraduationCap"]
                },
                {
                    title: "Safety Incidents",
                    url: "/dashboard/reporting/compliance/safety",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShieldAlert"]
                },
                {
                    title: "OSHA Compliance",
                    url: "/dashboard/reporting/compliance/osha",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShieldCheck"]
                },
                {
                    title: "Audit Reports",
                    url: "/dashboard/reporting/compliance/audits",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileText"]
                }
            ]
        },
        {
            label: "Advanced Analytics",
            items: [
                {
                    title: "Predictive Insights",
                    url: "/dashboard/reporting/analytics/predictive",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sparkles"]
                },
                {
                    title: "Trend Analysis",
                    url: "/dashboard/reporting/analytics/trends",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingUp"]
                },
                {
                    title: "Seasonality Reports",
                    url: "/dashboard/reporting/analytics/seasonality",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calendar"]
                },
                {
                    title: "Forecasting",
                    url: "/dashboard/reporting/analytics/forecasting",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"]
                },
                {
                    title: "Benchmark Comparisons",
                    url: "/dashboard/reporting/analytics/benchmarks",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Target"]
                },
                {
                    title: "What-If Analysis",
                    url: "/dashboard/reporting/analytics/what-if",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calculator"]
                }
            ]
        },
        {
            label: "Export & Sharing",
            items: [
                {
                    title: "Scheduled Reports",
                    url: "/dashboard/reporting/export/scheduled",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calendar"]
                },
                {
                    title: "Report Templates",
                    url: "/dashboard/reporting/export/templates",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileText"]
                },
                {
                    title: "Data Export",
                    url: "/dashboard/reporting/export/data",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArrowDownToLine"]
                },
                {
                    title: "Share Reports",
                    url: "/dashboard/reporting/export/share",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Users"]
                },
                {
                    title: "Report History",
                    url: "/dashboard/reporting/export/history",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Archive"]
                }
            ]
        }
    ],
    marketing: [
        {
            label: "Overview",
            items: [
                {
                    title: "Marketing Dashboard",
                    url: "/dashboard/marketing",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Megaphone"]
                },
                {
                    title: "Campaign Performance",
                    url: "/dashboard/marketing/performance",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingUp"]
                },
                {
                    title: "Lead Analytics",
                    url: "/dashboard/marketing/analytics",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"]
                }
            ]
        },
        {
            label: "Lead Sources",
            items: [
                {
                    title: "All Leads",
                    url: "/dashboard/marketing/leads",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Users"]
                },
                {
                    title: "Thumbtack",
                    url: "/dashboard/marketing/leads/thumbtack",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Target"]
                },
                {
                    title: "Angi (Angie's List)",
                    url: "/dashboard/marketing/leads/angi",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckCircle2"]
                },
                {
                    title: "Google Local Services",
                    url: "/dashboard/marketing/leads/google-local",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Search"]
                },
                {
                    title: "Yelp",
                    url: "/dashboard/marketing/leads/yelp",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Star"]
                },
                {
                    title: "HomeAdvisor",
                    url: "/dashboard/marketing/leads/homeadvisor",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Home"]
                },
                {
                    title: "Website Leads",
                    url: "/dashboard/marketing/leads/website",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Globe"]
                }
            ]
        },
        {
            label: "Paid Advertising",
            items: [
                {
                    title: "Google Ads",
                    url: "/dashboard/marketing/ads/google",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Search"],
                    items: [
                        {
                            title: "Campaigns",
                            url: "/dashboard/marketing/ads/google/campaigns"
                        },
                        {
                            title: "Performance Max",
                            url: "/dashboard/marketing/ads/google/performance-max"
                        },
                        {
                            title: "Search Ads",
                            url: "/dashboard/marketing/ads/google/search"
                        },
                        {
                            title: "Local Services Ads",
                            url: "/dashboard/marketing/ads/google/local-services"
                        },
                        {
                            title: "Analytics & Reports",
                            url: "/dashboard/marketing/ads/google/analytics"
                        }
                    ]
                },
                {
                    title: "Facebook & Instagram Ads",
                    url: "/dashboard/marketing/ads/facebook",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Camera"],
                    items: [
                        {
                            title: "Campaigns",
                            url: "/dashboard/marketing/ads/facebook/campaigns"
                        },
                        {
                            title: "Ad Sets",
                            url: "/dashboard/marketing/ads/facebook/ad-sets"
                        },
                        {
                            title: "Creative Library",
                            url: "/dashboard/marketing/ads/facebook/creative"
                        },
                        {
                            title: "Audience Targeting",
                            url: "/dashboard/marketing/ads/facebook/audiences"
                        },
                        {
                            title: "Performance",
                            url: "/dashboard/marketing/ads/facebook/performance"
                        }
                    ]
                },
                {
                    title: "Nextdoor Ads",
                    url: "/dashboard/marketing/ads/nextdoor",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapPin"]
                },
                {
                    title: "Bing Ads",
                    url: "/dashboard/marketing/ads/bing",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Search"]
                }
            ]
        },
        {
            label: "Organic Marketing",
            items: [
                {
                    title: "Google Business Profile",
                    url: "/dashboard/marketing/organic/google-business",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Search"]
                },
                {
                    title: "SEO Management",
                    url: "/dashboard/marketing/organic/seo",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingUp"]
                },
                {
                    title: "Content Marketing",
                    url: "/dashboard/marketing/organic/content",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileText"]
                },
                {
                    title: "Blog Posts",
                    url: "/dashboard/marketing/organic/blog",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BookOpen"]
                }
            ]
        },
        {
            label: "Social Media",
            items: [
                {
                    title: "Social Hub",
                    url: "/dashboard/marketing/social",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageSquare"]
                },
                {
                    title: "Facebook",
                    url: "/dashboard/marketing/social/facebook",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageSquare"]
                },
                {
                    title: "Instagram",
                    url: "/dashboard/marketing/social/instagram",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Camera"]
                },
                {
                    title: "LinkedIn",
                    url: "/dashboard/marketing/social/linkedin",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Briefcase"]
                },
                {
                    title: "X (Twitter)",
                    url: "/dashboard/marketing/social/twitter",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Hash"]
                },
                {
                    title: "Post Scheduler",
                    url: "/dashboard/marketing/social/scheduler",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calendar"]
                }
            ]
        },
        {
            label: "Review Management",
            items: [
                {
                    title: "All Reviews",
                    url: "/dashboard/marketing/reviews",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Star"]
                },
                {
                    title: "Google Reviews",
                    url: "/dashboard/marketing/reviews/google",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Search"]
                },
                {
                    title: "Yelp Reviews",
                    url: "/dashboard/marketing/reviews/yelp",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Star"]
                },
                {
                    title: "Facebook Reviews",
                    url: "/dashboard/marketing/reviews/facebook",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageSquare"]
                },
                {
                    title: "Angi Reviews",
                    url: "/dashboard/marketing/reviews/angi",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckCircle2"]
                },
                {
                    title: "Thumbtack Reviews",
                    url: "/dashboard/marketing/reviews/thumbtack",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Target"]
                },
                {
                    title: "Review Requests",
                    url: "/dashboard/marketing/reviews/requests",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mail"]
                },
                {
                    title: "Review Responses",
                    url: "/dashboard/marketing/reviews/responses",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageSquare"]
                }
            ]
        },
        {
            label: "Email Marketing",
            items: [
                {
                    title: "Email Campaigns",
                    url: "/dashboard/marketing/email/campaigns",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mail"]
                },
                {
                    title: "Newsletters",
                    url: "/dashboard/marketing/email/newsletters",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MailOpen"]
                },
                {
                    title: "Email Templates",
                    url: "/dashboard/marketing/email/templates",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileText"]
                },
                {
                    title: "Subscriber Lists",
                    url: "/dashboard/marketing/email/lists",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["List"]
                },
                {
                    title: "Automation Workflows",
                    url: "/dashboard/marketing/email/automation",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Zap"]
                }
            ]
        },
        {
            label: "Customer Outreach",
            items: [
                {
                    title: "Outreach Dashboard",
                    url: "/dashboard/marketing/outreach",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Megaphone"]
                },
                {
                    title: "Seasonal Campaigns",
                    url: "/dashboard/marketing/outreach/seasonal",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calendar"]
                },
                {
                    title: "Referral Program",
                    url: "/dashboard/marketing/outreach/referrals",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Users"]
                },
                {
                    title: "Loyalty Program",
                    url: "/dashboard/marketing/outreach/loyalty",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trophy"]
                },
                {
                    title: "Promotions & Offers",
                    url: "/dashboard/marketing/outreach/promotions",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tag"]
                }
            ]
        },
        {
            label: "Lead Management",
            items: [
                {
                    title: "Lead Pipeline",
                    url: "/dashboard/marketing/lead-pipeline",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClipboardList"]
                },
                {
                    title: "Lead Scoring",
                    url: "/dashboard/marketing/lead-scoring",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Target"]
                },
                {
                    title: "Lead Assignment",
                    url: "/dashboard/marketing/lead-assignment",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserPlus"]
                },
                {
                    title: "Lead Nurturing",
                    url: "/dashboard/marketing/lead-nurturing",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendingUp"]
                }
            ]
        },
        {
            label: "Marketing Tools",
            items: [
                {
                    title: "Landing Pages",
                    url: "/dashboard/marketing/tools/landing-pages",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileText"]
                },
                {
                    title: "QR Codes",
                    url: "/dashboard/marketing/tools/qr-codes",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QrCode"]
                },
                {
                    title: "Marketing Materials",
                    url: "/dashboard/marketing/tools/materials",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Package"]
                },
                {
                    title: "Brand Assets",
                    url: "/dashboard/marketing/tools/brand-assets",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Palette"]
                }
            ]
        }
    ],
    shop: [
        {
            label: "Categories",
            items: [
                {
                    title: "All Products",
                    url: "/dashboard/shop",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShoppingCart"],
                    badge: "8"
                },
                {
                    title: "Payment Hardware",
                    url: "/dashboard/shop?category=hardware",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreditCard"],
                    badge: "3"
                },
                {
                    title: "Uniforms & Apparel",
                    url: "/dashboard/shop?category=apparel",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["User"],
                    badge: "1"
                },
                {
                    title: "Tools & Equipment",
                    url: "/dashboard/shop?category=tools",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Wrench"],
                    badge: "1"
                },
                {
                    title: "Office Supplies",
                    url: "/dashboard/shop?category=supplies",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Paperclip"],
                    badge: "1"
                },
                {
                    title: "Marketing Materials",
                    url: "/dashboard/shop?category=marketing",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Megaphone"],
                    badge: "2"
                }
            ]
        }
    ],
    automation: [
        {
            title: "Automation Overview",
            url: "/dashboard/automation",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Zap"]
        },
        {
            title: "Workflows",
            url: "/dashboard/automation/workflows"
        },
        {
            title: "Rules",
            url: "/dashboard/automation/rules"
        },
        {
            title: "Templates",
            url: "/dashboard/automation/templates"
        }
    ],
    ai: [
        {
            label: undefined,
            items: [
                {
                    title: "Automation",
                    url: "/dashboard/ai/automation",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Zap"]
                },
                {
                    title: "AI Calls",
                    url: "/dashboard/ai/calls",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Phone"]
                },
                {
                    title: "AI Texts",
                    url: "/dashboard/ai/texts",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageSquare"]
                },
                {
                    title: "Activity Log",
                    url: "/dashboard/ai/activity",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClipboardList"]
                }
            ]
        }
    ],
    settings: [
        {
            label: undefined,
            items: [
                {
                    title: "Overview",
                    url: "/dashboard/settings",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Settings"]
                }
            ]
        },
        ...("TURBOPACK compile-time truthy", 1) ? [
            {
                label: "Development",
                items: [
                    {
                        title: "Developer Settings",
                        url: "/dashboard/settings/development",
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bug"],
                        highlight: "yellow"
                    }
                ]
            }
        ] : "TURBOPACK unreachable",
        {
            label: "Account",
            items: [
                {
                    title: "Personal Info",
                    url: "/dashboard/settings/profile/personal",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["User"]
                },
                {
                    title: "Security",
                    url: "/dashboard/settings/profile/security",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Shield"]
                },
                {
                    title: "Notifications",
                    url: "/dashboard/settings/profile/notifications",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bell"]
                },
                {
                    title: "Preferences",
                    url: "/dashboard/settings/profile/preferences",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sliders"]
                }
            ]
        },
        {
            label: "Company",
            items: [
                {
                    title: "Company Profile",
                    url: "/dashboard/settings/company",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Building2"]
                },
                {
                    title: "Billing",
                    url: "/dashboard/settings/billing",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreditCard"]
                }
            ]
        },
        {
            label: "Communication",
            items: [
                {
                    title: "Communications",
                    url: "/dashboard/settings/communications",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageSquare"],
                    items: [
                        {
                            title: "Overview",
                            url: "/dashboard/settings/communications"
                        },
                        {
                            title: "Email",
                            url: "/dashboard/settings/communications/email"
                        },
                        {
                            title: "SMS & Text",
                            url: "/dashboard/settings/communications/sms"
                        },
                        {
                            title: "Phone & Voice",
                            url: "/dashboard/settings/communications/phone"
                        },
                        {
                            title: "Notifications",
                            url: "/dashboard/settings/communications/notifications"
                        },
                        {
                            title: "Templates",
                            url: "/dashboard/settings/communications/templates"
                        }
                    ]
                },
                {
                    title: "Teams & Channels",
                    url: "/dashboard/settings/teams-channels",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Users"]
                }
            ]
        },
        {
            label: "Work",
            items: [
                {
                    title: "Jobs",
                    url: "/dashboard/settings/jobs",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Briefcase"]
                },
                {
                    title: "Customer Intake",
                    url: "/dashboard/settings/customer-intake",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClipboardList"]
                },
                {
                    title: "Booking",
                    url: "/dashboard/settings/booking",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calendar"]
                },
                {
                    title: "Checklists",
                    url: "/dashboard/settings/checklists",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckCircle2"]
                },
                {
                    title: "Job Fields",
                    url: "/dashboard/settings/job-fields",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["List"]
                }
            ]
        },
        {
            label: "Schedule",
            items: [
                {
                    title: "Schedule Settings",
                    url: "/dashboard/settings/schedule",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calendar"],
                    items: [
                        {
                            title: "Overview",
                            url: "/dashboard/settings/schedule"
                        },
                        {
                            title: "Calendar Settings",
                            url: "/dashboard/settings/schedule/calendar"
                        },
                        {
                            title: "Availability",
                            url: "/dashboard/settings/schedule/availability"
                        },
                        {
                            title: "Service Areas",
                            url: "/dashboard/settings/schedule/service-areas"
                        },
                        {
                            title: "Dispatch Rules",
                            url: "/dashboard/settings/schedule/dispatch"
                        },
                        {
                            title: "Team Scheduling",
                            url: "/dashboard/settings/schedule/team"
                        }
                    ]
                }
            ]
        },
        {
            label: "Customers",
            items: [
                {
                    title: "Customer Settings",
                    url: "/dashboard/settings/customers",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserCog"],
                    items: [
                        {
                            title: "Overview",
                            url: "/dashboard/settings/customers"
                        },
                        {
                            title: "Preferences",
                            url: "/dashboard/settings/customers/preferences"
                        },
                        {
                            title: "Loyalty & Rewards",
                            url: "/dashboard/settings/customers/loyalty"
                        },
                        {
                            title: "Notifications",
                            url: "/dashboard/settings/customers/notifications"
                        },
                        {
                            title: "Privacy & Consent",
                            url: "/dashboard/settings/customers/privacy"
                        },
                        {
                            title: "Custom Fields",
                            url: "/dashboard/settings/customers/custom-fields"
                        }
                    ]
                },
                {
                    title: "Customer Portal",
                    url: "/dashboard/settings/customer-portal",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Globe"]
                },
                {
                    title: "Tags",
                    url: "/dashboard/settings/tags",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tag"]
                }
            ]
        },
        {
            label: "Finances",
            items: [
                {
                    title: "Invoices",
                    url: "/dashboard/settings/invoices",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Receipt"]
                },
                {
                    title: "Estimates",
                    url: "/dashboard/settings/estimates",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileText"]
                },
                {
                    title: "Price Book",
                    url: "/dashboard/settings/pricebook",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BookOpen"]
                },
                {
                    title: "Service Plans",
                    url: "/dashboard/settings/service-plans",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Repeat"]
                },
                {
                    title: "Payroll",
                    url: "/dashboard/settings/payroll",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Users"],
                    items: [
                        {
                            title: "Overview",
                            url: "/dashboard/settings/payroll"
                        },
                        {
                            title: "Commission",
                            url: "/dashboard/settings/payroll/commission"
                        },
                        {
                            title: "Materials",
                            url: "/dashboard/settings/payroll/materials"
                        },
                        {
                            title: "Callbacks",
                            url: "/dashboard/settings/payroll/callbacks"
                        },
                        {
                            title: "Bonuses",
                            url: "/dashboard/settings/payroll/bonuses"
                        },
                        {
                            title: "Overtime",
                            url: "/dashboard/settings/payroll/overtime"
                        },
                        {
                            title: "Deductions",
                            url: "/dashboard/settings/payroll/deductions"
                        },
                        {
                            title: "Schedule",
                            url: "/dashboard/settings/payroll/schedule"
                        }
                    ]
                },
                {
                    title: "Finance",
                    url: "/dashboard/settings/finance",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Wallet"],
                    items: [
                        {
                            title: "Overview",
                            url: "/dashboard/settings/finance"
                        },
                        {
                            title: "Bank Accounts",
                            url: "/dashboard/settings/finance/bank-accounts"
                        },
                        {
                            title: "Virtual Buckets",
                            url: "/dashboard/settings/finance/virtual-buckets"
                        },
                        {
                            title: "Consumer Financing",
                            url: "/dashboard/settings/finance/consumer-financing"
                        },
                        {
                            title: "Business Financing",
                            url: "/dashboard/settings/finance/business-financing"
                        },
                        {
                            title: "Bookkeeping",
                            url: "/dashboard/settings/finance/bookkeeping"
                        },
                        {
                            title: "Accounting",
                            url: "/dashboard/settings/finance/accounting"
                        },
                        {
                            title: "Debit Cards",
                            url: "/dashboard/settings/finance/debit-cards"
                        },
                        {
                            title: "Gas Cards",
                            url: "/dashboard/settings/finance/gas-cards"
                        },
                        {
                            title: "Gift Cards",
                            url: "/dashboard/settings/finance/gift-cards"
                        }
                    ]
                }
            ]
        },
        {
            label: "Reporting",
            items: [
                {
                    title: "Reporting Settings",
                    url: "/dashboard/settings/reporting",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"],
                    items: [
                        {
                            title: "Overview",
                            url: "/dashboard/settings/reporting"
                        },
                        {
                            title: "Report Templates",
                            url: "/dashboard/settings/reporting/templates"
                        },
                        {
                            title: "Scheduled Reports",
                            url: "/dashboard/settings/reporting/scheduled"
                        },
                        {
                            title: "Distribution",
                            url: "/dashboard/settings/reporting/distribution"
                        },
                        {
                            title: "Metrics & KPIs",
                            url: "/dashboard/settings/reporting/metrics"
                        },
                        {
                            title: "Dashboards",
                            url: "/dashboard/settings/reporting/dashboards"
                        }
                    ]
                }
            ]
        },
        {
            label: "Marketing",
            items: [
                {
                    title: "Marketing Center",
                    url: "/dashboard/settings/marketing",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Megaphone"]
                },
                {
                    title: "Lead Sources",
                    url: "/dashboard/settings/lead-sources",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Target"]
                }
            ]
        },
        {
            label: "Automation",
            items: [
                {
                    title: "Automation Settings",
                    url: "/dashboard/settings/automation",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Workflow"],
                    items: [
                        {
                            title: "Overview",
                            url: "/dashboard/settings/automation"
                        },
                        {
                            title: "Workflows",
                            url: "/dashboard/settings/automation/workflows"
                        },
                        {
                            title: "Triggers & Actions",
                            url: "/dashboard/settings/automation/triggers"
                        },
                        {
                            title: "AI Automation",
                            url: "/dashboard/settings/automation/ai"
                        },
                        {
                            title: "Conditional Logic",
                            url: "/dashboard/settings/automation/logic"
                        },
                        {
                            title: "Data Filters",
                            url: "/dashboard/settings/automation/filters"
                        }
                    ]
                }
            ]
        },
        {
            label: "System",
            items: [
                {
                    title: "Data Import/Export",
                    url: "/dashboard/settings/data-import-export",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Database"]
                },
                {
                    title: "Integrations",
                    url: "/dashboard/settings/integrations",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Package"]
                },
                {
                    title: "QuickBooks",
                    url: "/dashboard/settings/quickbooks",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BookOpen"]
                }
            ]
        }
    ],
    pricebook: "custom",
    tools: [
        {
            label: "Marketing & Social",
            items: [
                {
                    title: "Google Business Profile",
                    url: "/tools/marketing/google-business",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Search"]
                },
                {
                    title: "Local Services Ads",
                    url: "/tools/marketing/local-services",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BadgeCheck"]
                },
                {
                    title: "Social Media Setup",
                    url: "/tools/marketing/social-media",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Megaphone"]
                },
                {
                    title: "Facebook Business",
                    url: "/tools/marketing/facebook",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageSquare"]
                },
                {
                    title: "Instagram for Business",
                    url: "/tools/marketing/instagram",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Camera"]
                },
                {
                    title: "X (Twitter) Business",
                    url: "/tools/marketing/twitter",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Hash"]
                },
                {
                    title: "LinkedIn Company Page",
                    url: "/tools/marketing/linkedin",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Users"]
                }
            ]
        },
        {
            label: "Business Setup",
            items: [
                {
                    title: "Business Registration",
                    url: "/tools/business/registration",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Briefcase"]
                },
                {
                    title: "Licensing & Permits",
                    url: "/tools/business/licensing",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileText"]
                },
                {
                    title: "Insurance Providers",
                    url: "/tools/business/insurance",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Shield"]
                },
                {
                    title: "Banking & Payroll",
                    url: "/tools/business/banking",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DollarSign"]
                },
                {
                    title: "Legal Resources",
                    url: "/tools/business/legal",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShieldCheck"]
                }
            ]
        },
        {
            label: "Financing & Growth",
            items: [
                {
                    title: "Consumer Financing",
                    url: "/tools/financing/consumer",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Receipt"]
                },
                {
                    title: "Business Loans",
                    url: "/tools/financing/business-loans",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DollarSign"]
                },
                {
                    title: "Equipment Financing",
                    url: "/tools/financing/equipment",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Wrench"]
                },
                {
                    title: "Credit Card Processing",
                    url: "/tools/financing/credit-card",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Receipt"]
                }
            ]
        },
        {
            label: "Industry Networks",
            items: [
                {
                    title: "Nexstar Network",
                    url: "/tools/networks/nexstar",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Users"]
                },
                {
                    title: "Service Nation Alliance",
                    url: "/tools/networks/service-nation",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Users"]
                },
                {
                    title: "ACCA (HVAC)",
                    url: "/tools/networks/acca",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Zap"]
                },
                {
                    title: "PHCC (Plumbing)",
                    url: "/tools/networks/phcc",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Wrench"]
                },
                {
                    title: "NECA (Electrical)",
                    url: "/tools/networks/neca",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Zap"]
                }
            ]
        },
        {
            label: "Training & Certification",
            items: [
                {
                    title: "Trade Certifications",
                    url: "/tools/training/certifications",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BadgeCheck"]
                },
                {
                    title: "OSHA Training",
                    url: "/tools/training/osha",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShieldCheck"]
                },
                {
                    title: "EPA Certification",
                    url: "/tools/training/epa",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Shield"]
                },
                {
                    title: "Business Management",
                    url: "/tools/training/business",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraduationCap"]
                }
            ]
        },
        {
            label: "Resources & Tools",
            items: [
                {
                    title: "Industry News",
                    url: "/tools/resources/news",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BookOpen"]
                },
                {
                    title: "Calculators & Estimators",
                    url: "/tools/resources/calculators",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Wrench"]
                },
                {
                    title: "Vendor Directories",
                    url: "/tools/resources/vendors",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Package"]
                },
                {
                    title: "Emergency Services",
                    url: "/tools/resources/emergency",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Phone"]
                }
            ]
        }
    ],
    jobDetails: [
        {
            label: undefined,
            items: [
                {
                    title: "Back to Jobs",
                    url: "/dashboard/work",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArrowLeft"]
                }
            ]
        },
        {
            label: "Overview",
            items: [
                {
                    title: "Job Details",
                    url: "#job-details",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClipboardList"]
                },
                {
                    title: "Timeline",
                    url: "#timeline",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Calendar"]
                }
            ]
        },
        {
            label: "Related",
            items: [
                {
                    title: "Property",
                    url: "#property",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapPin"]
                },
                {
                    title: "Customer",
                    url: "#customer",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["User"]
                }
            ]
        },
        {
            label: "Financials",
            items: [
                {
                    title: "Job Costing",
                    url: "#costing",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DollarSign"]
                },
                {
                    title: "Profitability",
                    url: "#profitability",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"]
                },
                {
                    title: "Invoices",
                    url: "#invoices",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Receipt"]
                },
                {
                    title: "Estimates",
                    url: "#estimates",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileText"]
                }
            ]
        },
        {
            label: "Activity",
            items: [
                {
                    title: "Communications",
                    url: "#communications",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageSquare"]
                },
                {
                    title: "Photo Gallery",
                    url: "#photo-gallery",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Camera"]
                },
                {
                    title: "Documentation",
                    url: "#documents",
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Paperclip"]
                }
            ]
        }
    ]
};
// Regex patterns for route matching
// Match only job detail pages with numeric/UUID IDs, not page names like "invoices", "schedule", etc.
// This prevents the job details sidebar from showing on other work pages
const JOB_DETAILS_PATTERN = /^\/dashboard\/work\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
// Match communication detail pages (e.g., /dashboard/communication/123)
// Function to determine current section based on pathname
function getCurrentSection(pathname) {
    if (pathname === "/dashboard") {
        return "today";
    }
    if (pathname.startsWith("/dashboard/communication")) {
        return "communication";
    }
    // Check for price book page before general work check
    if (pathname.startsWith("/dashboard/work/pricebook")) {
        return "pricebook";
    }
    // Check for job details page pattern: /dashboard/work/[id]
    if (pathname.match(JOB_DETAILS_PATTERN)) {
        return "jobDetails";
    }
    if (pathname.startsWith("/dashboard/work")) {
        return "work";
    }
    if (pathname.startsWith("/dashboard/customers")) {
        return "work";
    }
    if (pathname.startsWith("/dashboard/finance")) {
        return "finance";
    }
    if (pathname.startsWith("/dashboard/reporting")) {
        return "reporting";
    }
    if (pathname.startsWith("/dashboard/marketing")) {
        return "marketing";
    }
    if (pathname.startsWith("/dashboard/shop")) {
        return "shop";
    }
    if (pathname.startsWith("/dashboard/automation")) {
        return "automation";
    }
    if (pathname.startsWith("/dashboard/ai")) {
        return "ai";
    }
    if (pathname.startsWith("/dashboard/settings")) {
        return "settings";
    }
    if (pathname.startsWith("/tools")) {
        return "tools";
    }
    return "today";
}
function AppSidebar({ pathname: externalPathname, ...props }) {
    _s();
    const clientPathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const pathname = clientPathname || externalPathname || "/dashboard";
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$sidebar$2d$scroll$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSidebarScroll"])();
    const currentSection = getCurrentSection(pathname);
    const navItems = navigationSections[currentSection];
    const isAISection = currentSection === "ai";
    const isReportingSection = currentSection === "reporting";
    const isJobDetailsSection = currentSection === "jobDetails";
    // Removed isCommunicationDetail - detail pages should use EmailSidebar like main pages
    // Use grouped navigation for settings, ai, work, communication, finance, marketing, shop, tools, pricebook, and jobDetails sections
    const useGroupedNav = currentSection === "settings" || currentSection === "ai" || currentSection === "work" || currentSection === "communication" || currentSection === "finance" || currentSection === "marketing" || currentSection === "shop" || currentSection === "tools" || currentSection === "pricebook" || currentSection === "jobDetails";
    // Check if page has custom sidebar config
    // Custom sidebar config is no longer used - removed with layout refactor
    const hasCustomConfig = false;
    const sidebarConfig = undefined;
    // Check if using custom sidebar component
    const useCustomSidebar = navItems === "custom";
    // Check for communication-specific sidebars
    // Main communication page (reports/statistics)
    const isCommunicationReportsPage = pathname === "/dashboard/communication";
    // Email page is at /dashboard/communication/email (with query params for folder filtering)
    const isEmailPage = pathname?.startsWith("/dashboard/communication/email");
    const isSmsPage = pathname?.startsWith("/dashboard/communication/sms");
    const isTeamsPage = pathname?.startsWith("/dashboard/communication/teams");
    if (isCommunicationReportsPage) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$communication$2f$communication$2d$reports$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommunicationReportsSidebar"], {
            ...props
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
            lineNumber: 2327,
            columnNumber: 10
        }, this);
    }
    if (isEmailPage) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$communication$2f$email$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmailSidebar"], {
            ...props
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
            lineNumber: 2330,
            columnNumber: 10
        }, this);
    }
    if (isSmsPage) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$communication$2f$text$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextSidebar"], {
            ...props
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
            lineNumber: 2333,
            columnNumber: 10
        }, this);
    }
    if (isTeamsPage) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$communication$2f$teams$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TeamsSidebar"], {
            ...props
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
            lineNumber: 2336,
            columnNumber: 10
        }, this);
    }
    // For pricebook, return tree sidebar
    if (useCustomSidebar && currentSection === "pricebook") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$pricebook$2f$pricebook$2d$tree$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PriceBookTreeSidebar"], {
            ...props
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
            lineNumber: 2341,
            columnNumber: 10
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {
        collapsible: "offcanvas",
        variant: "inset",
        ...props,
        children: [
            currentSection === "communication" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 pt-2 pb-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$communication$2f$communication$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommunicationSwitcher"], {}, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                    lineNumber: 2348,
                    columnNumber: 6
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                lineNumber: 2347,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarContent"], {
                ref: scrollRef,
                children: [
                    isReportingSection ? // Use custom collapsible navigation for reporting
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$reporting$2f$reporting$2d$sidebar$2d$nav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReportingSidebarNav"], {}, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                        lineNumber: 2355,
                        columnNumber: 6
                    }, this) : isJobDetailsSection ? // Use dynamic widget navigation for job details (uses NavGrouped internally)
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$work$2f$job$2d$details$2f$job$2d$details$2d$nav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JobDetailsNav"], {}, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                        lineNumber: 2358,
                        columnNumber: 6
                    }, this) : ("TURBOPACK compile-time falsy", 0) ? // Use custom page configuration from layout
                    /*#__PURE__*/ "TURBOPACK unreachable" : useGroupedNav ? // Use default grouped navigation
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            isAISection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$nav$2d$chat$2d$history$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AiNewChatButton"], {}, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                                lineNumber: 2370,
                                columnNumber: 23
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$nav$2d$grouped$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavGrouped"], {
                                groups: navItems,
                                pathname: pathname
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                                lineNumber: 2371,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true) : // Use default main navigation
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$nav$2d$main$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavMain"], {
                        items: navItems,
                        pathname: pathname
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                        lineNumber: 2375,
                        columnNumber: 6
                    }, this),
                    isAISection && !hasCustomConfig && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$nav$2d$chat$2d$history$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NavChatHistory"], {}, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                        lineNumber: 2379,
                        columnNumber: 41
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                lineNumber: 2351,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarFooter"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "group border-border from-primary/5 via-primary/10 to-primary/5 hover:border-primary/30 relative flex flex-col gap-2 overflow-hidden rounded-lg border bg-gradient-to-br p-4 transition-all hover:shadow-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            className: "absolute inset-0 z-0",
                            href: "/changelog"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                            lineNumber: 2384,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative z-10 flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$icon$2d$registry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sparkles"], {
                                        className: "text-primary h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                                        lineNumber: 2387,
                                        columnNumber: 8
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                                    lineNumber: 2386,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-semibold",
                                            children: "What's New"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                                            lineNumber: 2390,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground text-xs",
                                            children: "Version 2.1.0"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                                            lineNumber: 2391,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                                    lineNumber: 2389,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                            lineNumber: 2385,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground relative z-10 text-xs leading-relaxed",
                            children: "Check out the latest features, improvements, and bug fixes."
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                            lineNumber: 2396,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "via-primary/5 absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                            lineNumber: 2399,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                    lineNumber: 2383,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                lineNumber: 2382,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarRail"], {}, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
                lineNumber: 2402,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/layout/app-sidebar.tsx",
        lineNumber: 2345,
        columnNumber: 3
    }, this);
}
_s(AppSidebar, "0CGoUXzFkWSjKCpj7ivJ3qae2CI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$use$2d$sidebar$2d$scroll$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSidebarScroll"]
    ];
});
_c = AppSidebar;
var _c;
__turbopack_context__.k.register(_c, "AppSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/layout/toolbar-client-actions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToolbarClientActions",
    ()=>ToolbarClientActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$toolbar$2d$actions$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/toolbar-actions-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ToolbarClientActions({ pathname }) {
    _s();
    const actions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$toolbar$2d$actions$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToolbarActionsStore"])({
        "ToolbarClientActions.useToolbarActionsStore[actions]": (state)=>state.actions[pathname]
    }["ToolbarClientActions.useToolbarActionsStore[actions]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ToolbarClientActions.useEffect": ()=>{
            if (actions) {
                document.querySelector(`[data-toolbar-default-actions="${CSS.escape(pathname)}"]`)?.setAttribute("hidden", "true");
            }
        }
    }["ToolbarClientActions.useEffect"], [
        pathname,
        actions
    ]);
    if (!actions) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: actions
    }, void 0, false);
}
_s(ToolbarClientActions, "pT2ZaypjswwgELstujnJjwqZ5dY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$toolbar$2d$actions$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToolbarActionsStore"]
    ];
});
_c = ToolbarClientActions;
var _c;
__turbopack_context__.k.register(_c, "ToolbarClientActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/layout/toolbar-client-stats.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToolbarClientStats",
    ()=>ToolbarClientStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$toolbar$2d$stats$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/toolbar-stats.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$toolbar$2d$stats$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/toolbar-stats.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$toolbar$2d$stats$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/stores/toolbar-stats-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ToolbarClientStats({ pathname }) {
    _s();
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$toolbar$2d$stats$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToolbarStatsStore"])({
        "ToolbarClientStats.useToolbarStatsStore[stats]": (state)=>state.stats[pathname]
    }["ToolbarClientStats.useToolbarStatsStore[stats]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ToolbarClientStats.useEffect": ()=>{
            if (stats && stats.length > 0) {
                document.querySelector(`[data-toolbar-default-stats="${CSS.escape(pathname)}"]`)?.setAttribute("hidden", "true");
            }
        }
    }["ToolbarClientStats.useEffect"], [
        pathname,
        stats
    ]);
    if (!stats || stats.length === 0) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$toolbar$2d$stats$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToolbarStats"], {
        stats: stats
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/layout/toolbar-client-stats.tsx",
        lineNumber: 26,
        columnNumber: 9
    }, this);
}
_s(ToolbarClientStats, "ed08/pO9R+lW0G4kRTz+pIJz31A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$stores$2f$toolbar$2d$stats$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToolbarStatsStore"]
    ];
});
_c = ToolbarClientStats;
var _c;
__turbopack_context__.k.register(_c, "ToolbarClientStats");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/layout/offline-indicator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Offline Indicator Component
 *
 * Displays network status and pending sync operations in the AppToolbar.
 * Critical for field workers to understand offline mode and sync status.
 *
 * States:
 * - Online with no pending: Hidden
 * - Offline: Shows "Offline Mode"
 * - Pending operations: Shows count and sync status
 * - Syncing: Shows spinner
 */ __turbopack_context__.s([
    "OfflineIndicator",
    ()=>OfflineIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/wifi-off.js [app-client] (ecmascript) <export default as WifiOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$offline$2f$network$2d$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/offline/network-status.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function OfflineIndicator() {
    _s();
    const { isOnline, pendingOperations, isSyncing, lastSync } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$offline$2f$network$2d$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNetworkStatus"])();
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Wait for client-side mount to avoid hydration mismatch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OfflineIndicator.useEffect": ()=>{
            setIsMounted(true);
        }
    }["OfflineIndicator.useEffect"], []);
    // Don't render anything on server to avoid hydration mismatch
    if (!isMounted) {
        return null;
    }
    // Don't show anything if online and no pending operations
    if (isOnline && pendingOperations === 0 && !isSyncing) {
        return null;
    }
    // Offline mode
    if (!isOnline) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-warning/10 text-warning dark:text-warning flex items-center gap-2 rounded-md px-3 py-1 text-sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__["WifiOff"], {
                    className: "size-4"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                    lineNumber: 45,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "hidden sm:inline",
                    children: "Offline Mode"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                    lineNumber: 46,
                    columnNumber: 5
                }, this),
                pendingOperations > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "bg-warning/20 rounded-full px-2 py-0.5 text-xs font-medium",
                    children: pendingOperations
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                    lineNumber: 48,
                    columnNumber: 6
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
            lineNumber: 44,
            columnNumber: 4
        }, this);
    }
    // Syncing
    if (isSyncing) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-primary/10 text-primary dark:text-primary flex items-center gap-2 rounded-md px-3 py-1 text-sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                    className: "size-4 animate-spin"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                    lineNumber: 60,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "hidden sm:inline",
                    children: "Syncing..."
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                    lineNumber: 61,
                    columnNumber: 5
                }, this),
                pendingOperations > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "bg-primary/20 rounded-full px-2 py-0.5 text-xs font-medium",
                    children: pendingOperations
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                    lineNumber: 63,
                    columnNumber: 6
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
            lineNumber: 59,
            columnNumber: 4
        }, this);
    }
    // Pending operations (online but not syncing)
    if (pendingOperations > 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-warning/10 text-warning dark:text-warning flex items-center gap-2 rounded-md px-3 py-1 text-sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                    className: "size-4"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                    lineNumber: 75,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "hidden sm:inline",
                    children: [
                        pendingOperations,
                        " pending"
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                    lineNumber: 76,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "sm:hidden",
                    children: pendingOperations
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                    lineNumber: 77,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
            lineNumber: 74,
            columnNumber: 4
        }, this);
    }
    // Recently synced (show for 5 seconds)
    if (lastSync && Date.now() - lastSync.getTime() < 5000) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-success/10 text-success dark:text-success flex items-center gap-2 rounded-md px-3 py-1 text-sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                    className: "size-4"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                    lineNumber: 86,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "hidden sm:inline",
                    children: "Synced"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                    lineNumber: 87,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
            lineNumber: 85,
            columnNumber: 4
        }, this);
    }
    return null;
}
_s(OfflineIndicator, "9m5fgmlDB6P/SdN1rGY9kMRlIhM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$offline$2f$network$2d$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNetworkStatus"]
    ];
});
_c = OfflineIndicator;
/**
 * Detailed sync status for settings/debug pages
 */ function SyncStatusDetail() {
    _s1();
    const { isOnline, pendingOperations, isSyncing, lastSync } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$offline$2f$network$2d$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNetworkStatus"])();
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Wait for client-side mount to avoid hydration mismatch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SyncStatusDetail.useEffect": ()=>{
            setIsMounted(true);
        }
    }["SyncStatusDetail.useEffect"], []);
    // Show loading state on server
    if (!isMounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-3",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground text-sm",
                        children: "Network Status"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                        lineNumber: 113,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground text-sm",
                        children: "Loading..."
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                        lineNumber: 114,
                        columnNumber: 6
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                lineNumber: 112,
                columnNumber: 5
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
            lineNumber: 111,
            columnNumber: 4
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground text-sm",
                        children: "Network Status"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                        lineNumber: 123,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: isOnline ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-success size-2 rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                                    lineNumber: 127,
                                    columnNumber: 8
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-medium",
                                    children: "Online"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                                    lineNumber: 128,
                                    columnNumber: 8
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-warning size-2 rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                                    lineNumber: 132,
                                    columnNumber: 8
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-medium",
                                    children: "Offline"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                                    lineNumber: 133,
                                    columnNumber: 8
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                        lineNumber: 124,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                lineNumber: 122,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground text-sm",
                        children: "Pending Operations"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                        lineNumber: 140,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium",
                        children: pendingOperations === 0 ? "None" : `${pendingOperations}`
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                        lineNumber: 143,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                lineNumber: 139,
                columnNumber: 4
            }, this),
            isSyncing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground text-sm",
                        children: "Sync Status"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                        lineNumber: 150,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                className: "text-primary size-4 animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                                lineNumber: 152,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium",
                                children: "Syncing..."
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                                lineNumber: 153,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                        lineNumber: 151,
                        columnNumber: 6
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                lineNumber: 149,
                columnNumber: 5
            }, this),
            lastSync && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-muted-foreground text-sm",
                        children: "Last Sync"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                        lineNumber: 160,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium",
                        children: new Date(lastSync).toLocaleTimeString()
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                        lineNumber: 161,
                        columnNumber: 6
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
                lineNumber: 159,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
        lineNumber: 121,
        columnNumber: 3
    }, this);
}
_s1(SyncStatusDetail, "9m5fgmlDB6P/SdN1rGY9kMRlIhM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$offline$2f$network$2d$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNetworkStatus"]
    ];
});
_c1 = SyncStatusDetail;
/**
 * Badge variant for compact display
 */ function OfflineBadge() {
    _s2();
    const { isOnline, pendingOperations } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$offline$2f$network$2d$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNetworkStatus"])();
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Wait for client-side mount to avoid hydration mismatch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OfflineBadge.useEffect": ()=>{
            setIsMounted(true);
        }
    }["OfflineBadge.useEffect"], []);
    // Don't render anything on server to avoid hydration mismatch
    if (!isMounted) {
        return null;
    }
    if (isOnline && pendingOperations === 0) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex size-6 items-center justify-center rounded-full text-xs font-bold", isOnline ? "bg-warning text-white" : "bg-warning text-white"),
        children: pendingOperations > 0 ? pendingOperations : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WifiOff$3e$__["WifiOff"], {
            className: "size-3"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
            lineNumber: 201,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/layout/offline-indicator.tsx",
        lineNumber: 192,
        columnNumber: 3
    }, this);
}
_s2(OfflineBadge, "nQUvXJ4+rr9egDmaYP6khFrRZo4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$offline$2f$network$2d$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNetworkStatus"]
    ];
});
_c2 = OfflineBadge;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "OfflineIndicator");
__turbopack_context__.k.register(_c1, "SyncStatusDetail");
__turbopack_context__.k.register(_c2, "OfflineBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/layout/app-toolbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppToolbar",
    ()=>AppToolbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * AppToolbar - Redesigned Responsive Toolbar
 *
 * Modern, intelligent toolbar with:
 * - Responsive design (desktop → tablet → mobile)
 * - Smart action grouping with dropdowns
 * - Context-aware buttons
 * - Mobile-first hamburger menu
 * - Keyboard shortcuts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.4_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$toolbar$2d$client$2d$actions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/toolbar-client-actions.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$toolbar$2d$client$2d$stats$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/toolbar-client-stats.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$offline$2d$indicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/offline-indicator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/button.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/dropdown-menu.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/sheet.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/sheet.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$toolbar$2d$stats$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/toolbar-stats-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$toolbar$2d$stats$2d$inline$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/toolbar-stats-inline.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$toolbar$2d$stats$2d$inline$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/toolbar-stats-inline.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
function AppToolbar({ pathname, config, showLeftSidebar = true, showRightSidebar = false, scope = "page" }) {
    _s();
    const safePathname = pathname || "/dashboard";
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Check if stats is a ReactNode component or StatCard[] array
    const isStatsReactNode = config.stats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"])(config.stats);
    const isStatsArray = config.stats && Array.isArray(config.stats);
    // Determine stats display mode
    const statsMode = config.statsMode || (config.showInlineStats ? "inline" : "hidden");
    // Determine sections presence
    const hasTitle = Boolean(config.title || config.subtitle);
    const hasStats = Boolean(config.stats && statsMode !== "hidden");
    const hasSearch = Boolean(config.search);
    const hasPagination = Boolean(config.pagination);
    const hasActions = Boolean(config.actions);
    // Parse actions into structured groups
    const actionGroups = parseActions(config.actions);
    // If hideOnMobile is true, don't render on mobile
    if (config.hideOnMobile) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
            className: "bg-background/80 sticky top-0 z-40 hidden w-full shrink-0 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 md:flex",
            "data-app-toolbar": true,
            "data-app-toolbar-scope": scope,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-14 w-full items-center gap-3 px-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex shrink-0 items-center gap-2",
                                children: [
                                    showLeftSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarTrigger"], {
                                        className: "-ml-1"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                        lineNumber: 102,
                                        columnNumber: 27
                                    }, this),
                                    config.back && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: config.back
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                        lineNumber: 104,
                                        columnNumber: 8
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                lineNumber: 101,
                                columnNumber: 6
                            }, this),
                            !config.breadcrumbs && hasTitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex min-w-0 shrink-0 flex-col",
                                children: [
                                    config.title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-baseline gap-2",
                                        children: typeof config.title === "string" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "truncate text-sm font-semibold lg:text-base",
                                            children: config.title
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                            lineNumber: 114,
                                            columnNumber: 11
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm font-semibold lg:text-base",
                                            children: config.title
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                            lineNumber: 118,
                                            columnNumber: 11
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                        lineNumber: 112,
                                        columnNumber: 9
                                    }, this),
                                    config.subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-muted-foreground truncate text-xs",
                                        children: config.subtitle
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                        lineNumber: 125,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                lineNumber: 110,
                                columnNumber: 7
                            }, this),
                            config.breadcrumbs && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex min-w-0 items-center",
                                children: config.breadcrumbs
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                lineNumber: 132,
                                columnNumber: 7
                            }, this),
                            hasStats && statsMode === "inline" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden items-center xl:flex",
                                "data-toolbar-default-stats": safePathname,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-border/40 mx-3 h-5 w-px"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                        lineNumber: 143,
                                        columnNumber: 8
                                    }, this),
                                    isStatsReactNode && config.stats,
                                    isStatsArray && config.stats.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$toolbar$2d$stats$2d$inline$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToolbarStatsInline"], {
                                        stats: config.stats
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                        lineNumber: 146,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                lineNumber: 139,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                        lineNumber: 99,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex shrink-0 items-center gap-2",
                        children: [
                            hasSearch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center max-w-md",
                                children: config.search
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                lineNumber: 156,
                                columnNumber: 7
                            }, this),
                            hasStats && statsMode === "button" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    isStatsArray && config.stats.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$toolbar$2d$stats$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToolbarStatsButton"], {
                                        stats: config.stats
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                        lineNumber: 163,
                                        columnNumber: 9
                                    }, this),
                                    isStatsReactNode && config.stats
                                ]
                            }, void 0, true),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$toolbar$2d$client$2d$stats$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToolbarClientStats"], {
                                pathname: safePathname
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                lineNumber: 169,
                                columnNumber: 6
                            }, this),
                            hasPagination && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-border/40 h-5 w-px"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                        lineNumber: 174,
                                        columnNumber: 8
                                    }, this),
                                    config.pagination
                                ]
                            }, void 0, true),
                            actionGroups.primary.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    !config.hideActionSeparator && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-border/40 h-5 w-px"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                        lineNumber: 182,
                                        columnNumber: 40
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5",
                                        children: actionGroups.primary.map((action, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: action
                                            }, idx, false, {
                                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                lineNumber: 185,
                                                columnNumber: 10
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                        lineNumber: 183,
                                        columnNumber: 8
                                    }, this)
                                ]
                            }, void 0, true),
                            actionGroups.secondary.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "sm",
                                            className: "h-8 w-8 p-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 10
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "sr-only",
                                                    children: "More actions"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 10
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                            lineNumber: 195,
                                            columnNumber: 9
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                        lineNumber: 194,
                                        columnNumber: 8
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                        align: "end",
                                        className: "w-56",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                                                children: "Actions"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                lineNumber: 201,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                lineNumber: 202,
                                                columnNumber: 9
                                            }, this),
                                            actionGroups.secondary.map((action, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    asChild: true,
                                                    children: action
                                                }, idx, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                    lineNumber: 204,
                                                    columnNumber: 10
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                        lineNumber: 200,
                                        columnNumber: 8
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                lineNumber: 193,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$toolbar$2d$client$2d$actions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToolbarClientActions"], {
                                pathname: safePathname
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                lineNumber: 213,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$offline$2d$indicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OfflineIndicator"], {}, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                lineNumber: 216,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                        lineNumber: 153,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                lineNumber: 97,
                columnNumber: 5
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
            lineNumber: 91,
            columnNumber: 4
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "bg-background/80 sticky top-0 z-40 flex w-full shrink-0 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
        "data-app-toolbar": true,
        "data-app-toolbar-scope": scope,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "hidden md:flex h-14 w-full items-center gap-3 px-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 min-w-0 flex-1",
                    children: [
                        showLeftSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarTrigger"], {
                            className: "-ml-1"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                            lineNumber: 233,
                            columnNumber: 26
                        }, this),
                        config.back && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center",
                            children: config.back
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                            lineNumber: 236,
                            columnNumber: 7
                        }, this),
                        hasTitle && typeof config.title === "string" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "truncate text-sm font-semibold",
                            children: config.title
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                            lineNumber: 240,
                            columnNumber: 7
                        }, this),
                        hasTitle && typeof config.title !== "string" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm font-semibold truncate",
                            children: config.title
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                            lineNumber: 243,
                            columnNumber: 7
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                    lineNumber: 232,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex shrink-0 items-center gap-1",
                    children: [
                        hasSearch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sheet"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetTrigger"], {
                                    asChild: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: "h-8 w-8 p-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                lineNumber: 253,
                                                columnNumber: 10
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "sr-only",
                                                children: "Search"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                lineNumber: 254,
                                                columnNumber: 10
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                        lineNumber: 252,
                                        columnNumber: 9
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                    lineNumber: 251,
                                    columnNumber: 8
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetContent"], {
                                    side: "top",
                                    className: "h-[200px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetHeader"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetTitle"], {
                                                children: "Search"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                lineNumber: 259,
                                                columnNumber: 10
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                            lineNumber: 258,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4",
                                            children: config.search
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                            lineNumber: 261,
                                            columnNumber: 9
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                    lineNumber: 257,
                                    columnNumber: 8
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                            lineNumber: 250,
                            columnNumber: 7
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$offline$2d$indicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OfflineIndicator"], {}, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                            lineNumber: 266,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sheet"], {
                            open: isMobileMenuOpen,
                            onOpenChange: setIsMobileMenuOpen,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetTrigger"], {
                                    asChild: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: "h-8 w-8 p-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                lineNumber: 272,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "sr-only",
                                                children: "Menu"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                lineNumber: 273,
                                                columnNumber: 9
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                        lineNumber: 271,
                                        columnNumber: 8
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                    lineNumber: 270,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetContent"], {
                                    side: "right",
                                    className: "w-[300px] sm:w-[400px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetHeader"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetTitle"], {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Actions"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                        lineNumber: 279,
                                                        columnNumber: 10
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        variant: "ghost",
                                                        size: "sm",
                                                        className: "h-8 w-8 p-0",
                                                        onClick: ()=>setIsMobileMenuOpen(false),
                                                        "aria-label": "Close menu",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                                lineNumber: 287,
                                                                columnNumber: 11
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "sr-only",
                                                                children: "Close menu"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                                lineNumber: 288,
                                                                columnNumber: 11
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                        lineNumber: 280,
                                                        columnNumber: 10
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                lineNumber: 278,
                                                columnNumber: 9
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                            lineNumber: 277,
                                            columnNumber: 8
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-6 space-y-4",
                                            children: [
                                                hasStats && isStatsArray && config.stats.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-muted-foreground",
                                                            children: "Statistics"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                            lineNumber: 297,
                                                            columnNumber: 11
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid gap-2",
                                                            children: config.stats.map((stat, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-lg border p-3 space-y-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-muted-foreground",
                                                                            children: stat.label
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                                            lineNumber: 306,
                                                                            columnNumber: 14
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-baseline gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-2xl font-bold",
                                                                                    children: stat.value
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                                                    lineNumber: 310,
                                                                                    columnNumber: 15
                                                                                }, this),
                                                                                stat.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-muted-foreground",
                                                                                    children: stat.icon
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                                                    lineNumber: 312,
                                                                                    columnNumber: 16
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                                            lineNumber: 309,
                                                                            columnNumber: 14
                                                                        }, this)
                                                                    ]
                                                                }, idx, true, {
                                                                    fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                                    lineNumber: 302,
                                                                    columnNumber: 13
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                            lineNumber: 300,
                                                            columnNumber: 11
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                    lineNumber: 296,
                                                    columnNumber: 10
                                                }, this),
                                                (actionGroups.primary.length > 0 || actionGroups.secondary.length > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-muted-foreground",
                                                            children: "Actions"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                            lineNumber: 327,
                                                            columnNumber: 11
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid gap-2",
                                                            children: [
                                                                ...actionGroups.primary,
                                                                ...actionGroups.secondary
                                                            ].map((action, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-full",
                                                                    onClick: ()=>setIsMobileMenuOpen(false),
                                                                    children: action
                                                                }, idx, false, {
                                                                    fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                                    lineNumber: 333,
                                                                    columnNumber: 14
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                            lineNumber: 330,
                                                            columnNumber: 11
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                    lineNumber: 326,
                                                    columnNumber: 10
                                                }, this),
                                                hasPagination && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-muted-foreground",
                                                            children: "Navigation"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                            lineNumber: 349,
                                                            columnNumber: 11
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$4_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-center",
                                                            children: config.pagination
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                            lineNumber: 352,
                                                            columnNumber: 11
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                                    lineNumber: 348,
                                                    columnNumber: 10
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                            lineNumber: 293,
                                            columnNumber: 8
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                                    lineNumber: 276,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                            lineNumber: 269,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
                    lineNumber: 248,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
            lineNumber: 230,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/layout/app-toolbar.tsx",
        lineNumber: 224,
        columnNumber: 3
    }, this);
}
_s(AppToolbar, "QerECOS75+B7gv+k3q7FrDf39mc=");
_c = AppToolbar;
/**
 * Parse actions into primary (always visible) and secondary (dropdown) groups
 */ function parseActions(actions) {
    if (!actions) {
        return {
            primary: [],
            secondary: []
        };
    }
    // If actions is a single element, treat as primary
    if (!Array.isArray(actions)) {
        return {
            primary: [
                actions
            ],
            secondary: []
        };
    }
    // Split array: first 2 are primary, rest are secondary
    return {
        primary: actions.slice(0, 2),
        secondary: actions.slice(2)
    };
}
var _c;
__turbopack_context__.k.register(_c, "AppToolbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_src_components_layout_bc248fd6._.js.map