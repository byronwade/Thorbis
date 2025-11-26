(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
	typeof document === "object" ? document.currentScript : undefined,
	"[project]/apps/admin/src/hooks/use-mobile.ts [app-client] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["useIsMobile", () => useIsMobile]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)",
			);
		var _s = __turbopack_context__.k.signature();
		const MOBILE_BREAKPOINT = 768;
		function useIsMobile() {
			_s();
			const [isMobile, setIsMobile] =
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
					"useState"
				](undefined);
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"useEffect"
			](
				{
					"useIsMobile.useEffect": () => {
						const mql = window.matchMedia(
							`(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
						);
						const onChange = {
							"useIsMobile.useEffect.onChange": () => {
								setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
							},
						}["useIsMobile.useEffect.onChange"];
						mql.addEventListener("change", onChange);
						setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
						return {
							"useIsMobile.useEffect": () =>
								mql.removeEventListener("change", onChange),
						}["useIsMobile.useEffect"];
					},
				}["useIsMobile.useEffect"],
				[],
			);
			return !!isMobile;
		}
		_s(useIsMobile, "D6B2cPXNCaIbeOx+abFr1uxLRM0=");
		if (
			typeof globalThis.$RefreshHelpers$ === "object" &&
			globalThis.$RefreshHelpers !== null
		) {
			__turbopack_context__.k.registerExports(
				__turbopack_context__.m,
				globalThis.$RefreshHelpers$,
			);
		}
	},
	"[project]/apps/admin/src/components/ui/sidebar.tsx [app-client] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"Sidebar",
			() => Sidebar,
			"SidebarContent",
			() => SidebarContent,
			"SidebarFooter",
			() => SidebarFooter,
			"SidebarGroup",
			() => SidebarGroup,
			"SidebarGroupAction",
			() => SidebarGroupAction,
			"SidebarGroupContent",
			() => SidebarGroupContent,
			"SidebarGroupLabel",
			() => SidebarGroupLabel,
			"SidebarHeader",
			() => SidebarHeader,
			"SidebarInput",
			() => SidebarInput,
			"SidebarInset",
			() => SidebarInset,
			"SidebarMenu",
			() => SidebarMenu,
			"SidebarMenuAction",
			() => SidebarMenuAction,
			"SidebarMenuBadge",
			() => SidebarMenuBadge,
			"SidebarMenuButton",
			() => SidebarMenuButton,
			"SidebarMenuItem",
			() => SidebarMenuItem,
			"SidebarMenuSkeleton",
			() => SidebarMenuSkeleton,
			"SidebarMenuSub",
			() => SidebarMenuSub,
			"SidebarMenuSubButton",
			() => SidebarMenuSubButton,
			"SidebarMenuSubItem",
			() => SidebarMenuSubItem,
			"SidebarProvider",
			() => SidebarProvider,
			"SidebarRail",
			() => SidebarRail,
			"SidebarSeparator",
			() => SidebarSeparator,
			"SidebarTrigger",
			() => SidebarTrigger,
			"useSidebar",
			() => useSidebar,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@radix-ui+react-slot@1.2.4_@types+react@19.2.2_react@19.2.0/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftIcon$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/panel-left.js [app-client] (ecmascript) <export default as PanelLeftIcon>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/index.ts [app-client] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/button.tsx [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/input.tsx [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/separator.tsx [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/sheet.tsx [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/skeleton.tsx [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/tooltip.tsx [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/utils.ts [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$hooks$2f$use$2d$mobile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/hooks/use-mobile.ts [app-client] (ecmascript)",
			);
		var _s = __turbopack_context__.k.signature(),
			_s1 = __turbopack_context__.k.signature(),
			_s2 = __turbopack_context__.k.signature(),
			_s3 = __turbopack_context__.k.signature(),
			_s4 = __turbopack_context__.k.signature(),
			_s5 = __turbopack_context__.k.signature(),
			_s6 = __turbopack_context__.k.signature();
		("use client");
		const SIDEBAR_COOKIE_NAME = "sidebar_state";
		const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
		const SIDEBAR_WIDTH = "16rem";
		const SIDEBAR_WIDTH_MOBILE = "18rem";
		const SIDEBAR_WIDTH_ICON = "3rem";
		const SIDEBAR_KEYBOARD_SHORTCUT = "b";
		const SidebarContext =
			/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"createContext"
			](null);
		function useSidebar() {
			_s();
			const context =
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
					"useContext"
				](SidebarContext);
			if (!context) {
				// Return safe defaults during SSR or when not in SidebarProvider
				// This prevents errors during server-side rendering
				return {
					state: "expanded",
					open: true,
					setOpen: () => {},
					openMobile: false,
					setOpenMobile: () => {},
					isMobile: false,
					toggleSidebar: () => {},
				};
			}
			return context;
		}
		_s(useSidebar, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
		function SidebarProvider({
			defaultOpen = true,
			open: openProp,
			onOpenChange: setOpenProp,
			className,
			style,
			children,
			...props
		}) {
			_s1();
			const isMobile = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$hooks$2f$use$2d$mobile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"useIsMobile"
			])();
			const [openMobile, setOpenMobile] =
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
					"useState"
				](false);
			// This is the internal state of the sidebar.
			// We use openProp and setOpenProp for control from outside the component.
			const [_open, _setOpen] =
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
					"useState"
				](defaultOpen);
			const open = openProp ?? _open;
			const setOpen =
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
					"useCallback"
				](
					{
						"SidebarProvider.useCallback[setOpen]": (value) => {
							const openState =
								typeof value === "function" ? value(open) : value;
							if (setOpenProp) {
								setOpenProp(openState);
							} else {
								_setOpen(openState);
							}
							// This sets the cookie to keep the sidebar state.
							document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
						},
					}["SidebarProvider.useCallback[setOpen]"],
					[setOpenProp, open],
				);
			// Helper to toggle the sidebar.
			const toggleSidebar =
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
					"useCallback"
				](
					{
						"SidebarProvider.useCallback[toggleSidebar]": () =>
							isMobile
								? setOpenMobile(
										{
											"SidebarProvider.useCallback[toggleSidebar]": (open) =>
												!open,
										}["SidebarProvider.useCallback[toggleSidebar]"],
									)
								: setOpen(
										{
											"SidebarProvider.useCallback[toggleSidebar]": (open) =>
												!open,
										}["SidebarProvider.useCallback[toggleSidebar]"],
									),
					}["SidebarProvider.useCallback[toggleSidebar]"],
					[isMobile, setOpen],
				);
			// Adds a keyboard shortcut to toggle the sidebar.
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"useEffect"
			](
				{
					"SidebarProvider.useEffect": () => {
						const handleKeyDown = {
							"SidebarProvider.useEffect.handleKeyDown": (event) => {
								if (
									event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
									(event.metaKey || event.ctrlKey)
								) {
									event.preventDefault();
									toggleSidebar();
								}
							},
						}["SidebarProvider.useEffect.handleKeyDown"];
						window.addEventListener("keydown", handleKeyDown);
						return {
							"SidebarProvider.useEffect": () =>
								window.removeEventListener("keydown", handleKeyDown),
						}["SidebarProvider.useEffect"];
					},
				}["SidebarProvider.useEffect"],
				[toggleSidebar],
			);
			// We add a state so that we can do data-state="expanded" or "collapsed".
			// This makes it easier to style the sidebar with Tailwind classes.
			const state = open ? "expanded" : "collapsed";
			const contextValue =
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
					"useMemo"
				](
					{
						"SidebarProvider.useMemo[contextValue]": () => ({
							state,
							open,
							setOpen,
							isMobile,
							openMobile,
							setOpenMobile,
							toggleSidebar,
						}),
					}["SidebarProvider.useMemo[contextValue]"],
					[state, open, setOpen, isMobile, openMobile, toggleSidebar],
				);
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				SidebarContext.Provider,
				{
					value: contextValue,
					children: /*#__PURE__*/ (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"jsxDEV"
					])(
						__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
							"TooltipProvider"
						],
						{
							delayDuration: 0,
							children: /*#__PURE__*/ (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
								"jsxDEV"
							])(
								"div",
								{
									className: (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
										"cn"
									])(
										"group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
										className,
									),
									"data-slot": "sidebar-wrapper",
									style: {
										"--sidebar-width": SIDEBAR_WIDTH,
										"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
										...style,
									},
									...props,
									children: children,
								},
								void 0,
								false,
								{
									fileName:
										"[project]/apps/admin/src/components/ui/sidebar.tsx",
									lineNumber: 141,
									columnNumber: 5,
								},
								this,
							),
						},
						void 0,
						false,
						{
							fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
							lineNumber: 140,
							columnNumber: 4,
						},
						this,
					),
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 139,
					columnNumber: 3,
				},
				this,
			);
		}
		_s1(SidebarProvider, "QSOkjq1AvKFJW5+zwiK52jPX7zI=", false, () => [
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$hooks$2f$use$2d$mobile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"useIsMobile"
			],
		]);
		_c = SidebarProvider;
		function Sidebar({
			side = "left",
			variant = "sidebar",
			collapsible = "offcanvas",
			className,
			children,
			...props
		}) {
			_s2();
			const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
			if (collapsible === "none") {
				return /*#__PURE__*/ (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
					"jsxDEV"
				])(
					"div",
					{
						className: (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
							"cn"
						])(
							"bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
							className,
						),
						"data-slot": "sidebar",
						...props,
						children: children,
					},
					void 0,
					false,
					{
						fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
						lineNumber: 179,
						columnNumber: 4,
					},
					this,
				);
			}
			if (isMobile) {
				return /*#__PURE__*/ (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
					"jsxDEV"
				])(
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"Sheet"
					],
					{
						onOpenChange: setOpenMobile,
						open: openMobile,
						...props,
						children: /*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
								"SheetContent"
							],
							{
								className:
									"bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
								"data-mobile": "true",
								"data-sidebar": "sidebar",
								"data-slot": "sidebar",
								side: side,
								style: {
									"--sidebar-width": SIDEBAR_WIDTH_MOBILE,
								},
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
											"SheetHeader"
										],
										{
											className: "sr-only",
											children: [
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
														"SheetTitle"
													],
													{
														children: "Sidebar",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/ui/sidebar.tsx",
														lineNumber: 208,
														columnNumber: 7,
													},
													this,
												),
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
														"SheetDescription"
													],
													{
														children: "Displays the mobile sidebar.",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/ui/sidebar.tsx",
														lineNumber: 209,
														columnNumber: 7,
													},
													this,
												),
											],
										},
										void 0,
										true,
										{
											fileName:
												"[project]/apps/admin/src/components/ui/sidebar.tsx",
											lineNumber: 207,
											columnNumber: 6,
										},
										this,
									),
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"div",
										{
											className: "flex h-full w-full flex-col",
											children: children,
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/ui/sidebar.tsx",
											lineNumber: 211,
											columnNumber: 6,
										},
										this,
									),
								],
							},
							void 0,
							true,
							{
								fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
								lineNumber: 195,
								columnNumber: 5,
							},
							this,
						),
					},
					void 0,
					false,
					{
						fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
						lineNumber: 194,
						columnNumber: 4,
					},
					this,
				);
			}
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"div",
				{
					className: "group peer text-sidebar-foreground hidden md:block",
					"data-collapsible": state === "collapsed" ? collapsible : "",
					"data-side": side,
					"data-slot": "sidebar",
					"data-state": state,
					"data-variant": variant,
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
									"cn"
								])(
									"relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
									"group-data-[collapsible=offcanvas]:w-0",
									"group-data-[side=right]:rotate-180",
									variant === "floating" || variant === "inset"
										? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
										: "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
								),
								"data-slot": "sidebar-gap",
							},
							void 0,
							false,
							{
								fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
								lineNumber: 227,
								columnNumber: 4,
							},
							this,
						),
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
									"cn"
								])(
									variant === "sidebar"
										? "sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--footer-height)-4rem)] overscroll-none bg-transparent lg:flex"
										: "fixed inset-y-0 top-(--header-height) z-10 hidden h-[calc(100svh-var(--header-height))]! h-svh transition-[left,right,width] duration-200 ease-linear md:flex",
									variant === "sidebar"
										? "w-(--sidebar-width) flex-col"
										: "w-(--sidebar-width)",
									variant !== "sidebar" && [
										side === "left"
											? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
											: "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
										// Adjust the padding for floating and inset variants.
										variant === "floating" || variant === "inset"
											? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
											: "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
									],
									className,
								),
								"data-slot": "sidebar-container",
								...props,
								children: /*#__PURE__*/ (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
									"jsxDEV"
								])(
									"div",
									{
										className: (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
											"cn"
										])(
											"flex h-full w-full flex-col",
											variant === "sidebar" && "bg-transparent",
											variant !== "sidebar" &&
												"bg-sidebar group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm",
										),
										"data-sidebar": "sidebar",
										"data-slot": "sidebar-inner",
										children: children,
									},
									void 0,
									false,
									{
										fileName:
											"[project]/apps/admin/src/components/ui/sidebar.tsx",
										lineNumber: 260,
										columnNumber: 5,
									},
									this,
								),
							},
							void 0,
							false,
							{
								fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
								lineNumber: 238,
								columnNumber: 4,
							},
							this,
						),
					],
				},
				void 0,
				true,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 218,
					columnNumber: 3,
				},
				this,
			);
		}
		_s2(Sidebar, "hAL3+uRFwO9tnbDK50BUE5wZ71s=", false, () => [useSidebar]);
		_c1 = Sidebar;
		function SidebarTrigger({ className, onClick, ...props }) {
			_s3();
			const { toggleSidebar } = useSidebar();
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
					"Button"
				],
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])("size-7", className),
					"data-sidebar": "trigger",
					"data-slot": "sidebar-trigger",
					onClick: (event) => {
						onClick?.(event);
						toggleSidebar();
					},
					size: "icon",
					variant: "ghost",
					...props,
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftIcon$3e$__[
								"PanelLeftIcon"
							],
							{},
							void 0,
							false,
							{
								fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
								lineNumber: 297,
								columnNumber: 4,
							},
							this,
						),
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"span",
							{
								className: "sr-only",
								children: "Toggle Sidebar",
							},
							void 0,
							false,
							{
								fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
								lineNumber: 298,
								columnNumber: 4,
							},
							this,
						),
					],
				},
				void 0,
				true,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 285,
					columnNumber: 3,
				},
				this,
			);
		}
		_s3(SidebarTrigger, "dRnjPhQbCChcVGr4xvQkpNxnqyg=", false, () => [
			useSidebar,
		]);
		_c2 = SidebarTrigger;
		function SidebarRail({ className, ...props }) {
			_s4();
			const { toggleSidebar } = useSidebar();
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"button",
				{
					"aria-label": "Toggle Sidebar",
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])(
						"hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
						"in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
						"[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
						"hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
						"[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
						"[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
						className,
					),
					"data-sidebar": "rail",
					"data-slot": "sidebar-rail",
					onClick: toggleSidebar,
					tabIndex: -1,
					title: "Toggle Sidebar",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 307,
					columnNumber: 3,
				},
				this,
			);
		}
		_s4(SidebarRail, "dRnjPhQbCChcVGr4xvQkpNxnqyg=", false, () => [useSidebar]);
		_c3 = SidebarRail;
		function SidebarInset({ className, ...props }) {
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"main",
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])(
						"bg-background relative flex w-full flex-col overflow-hidden rounded-tl-xl",
						"h-full",
						className,
					),
					"data-slot": "sidebar-inset",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 330,
					columnNumber: 3,
				},
				this,
			);
		}
		_c4 = SidebarInset;
		function SidebarInput({ className, ...props }) {
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
					"Input"
				],
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])("bg-background h-8 w-full shadow-none", className),
					"data-sidebar": "input",
					"data-slot": "sidebar-input",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 347,
					columnNumber: 3,
				},
				this,
			);
		}
		_c5 = SidebarInput;
		function SidebarHeader({ className, ...props }) {
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"div",
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])("flex flex-col gap-2 p-2", className),
					"data-sidebar": "header",
					"data-slot": "sidebar-header",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 358,
					columnNumber: 3,
				},
				this,
			);
		}
		_c6 = SidebarHeader;
		function SidebarFooter({ className, ...props }) {
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"div",
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])("flex flex-col gap-2 p-2", className),
					"data-sidebar": "footer",
					"data-slot": "sidebar-footer",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 369,
					columnNumber: 3,
				},
				this,
			);
		}
		_c7 = SidebarFooter;
		function SidebarSeparator({ className, ...props }) {
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
					"Separator"
				],
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])("bg-sidebar-border mx-2 w-auto", className),
					"data-sidebar": "separator",
					"data-slot": "sidebar-separator",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 383,
					columnNumber: 3,
				},
				this,
			);
		}
		_c8 = SidebarSeparator;
		const SidebarContent =
			/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"forwardRef"
			](
				(_c9 = ({ className, children, ...props }, ref) => {
					return /*#__PURE__*/ (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"jsxDEV"
					])(
						"div",
						{
							ref: ref,
							className: (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
								"cn"
							])(
								"no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-auto overflow-x-hidden px-2 group-data-[collapsible=icon]:overflow-hidden",
								className,
							),
							"data-sidebar": "content",
							"data-slot": "sidebar-content",
							...props,
							children: children,
						},
						void 0,
						false,
						{
							fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
							lineNumber: 397,
							columnNumber: 3,
						},
						("TURBOPACK compile-time value", void 0),
					);
				}),
			);
		_c10 = SidebarContent;
		SidebarContent.displayName = "SidebarContent";
		function SidebarGroup({ className, ...props }) {
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"div",
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])("relative flex w-full min-w-0 flex-col p-2", className),
					"data-sidebar": "group",
					"data-slot": "sidebar-group",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 415,
					columnNumber: 3,
				},
				this,
			);
		}
		_c11 = SidebarGroup;
		function SidebarGroupLabel({ className, asChild = false, ...props }) {
			const Comp = asChild
				? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"Slot"
					]
				: "div";
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				Comp,
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])(
						"text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
						"group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
						className,
					),
					"data-sidebar": "group-label",
					"data-slot": "sidebar-group-label",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 432,
					columnNumber: 3,
				},
				this,
			);
		}
		_c12 = SidebarGroupLabel;
		function SidebarGroupAction({ className, asChild = false, ...props }) {
			const Comp = asChild
				? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"Slot"
					]
				: "button";
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				Comp,
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])(
						"text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", // Increases the hit area of the button on mobile.
						"after:absolute after:-inset-2 md:after:hidden",
						"group-data-[collapsible=icon]:hidden",
						className,
					),
					"data-sidebar": "group-action",
					"data-slot": "sidebar-group-action",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 453,
					columnNumber: 3,
				},
				this,
			);
		}
		_c13 = SidebarGroupAction;
		function SidebarGroupContent({ className, ...props }) {
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"div",
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])("w-full text-sm", className),
					"data-sidebar": "group-content",
					"data-slot": "sidebar-group-content",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 473,
					columnNumber: 3,
				},
				this,
			);
		}
		_c14 = SidebarGroupContent;
		function SidebarMenu({ className, ...props }) {
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"ul",
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])("flex w-full min-w-0 flex-col gap-1", className),
					"data-sidebar": "menu",
					"data-slot": "sidebar-menu",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 484,
					columnNumber: 3,
				},
				this,
			);
		}
		_c15 = SidebarMenu;
		function SidebarMenuItem({ className, ...props }) {
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"li",
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])("group/menu-item relative", className),
					"data-sidebar": "menu-item",
					"data-slot": "sidebar-menu-item",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 495,
					columnNumber: 3,
				},
				this,
			);
		}
		_c16 = SidebarMenuItem;
		const sidebarMenuButtonVariants = (0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
			"cva"
		])(
			"peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
			{
				variants: {
					variant: {
						default:
							"hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
						outline:
							"bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
					},
					size: {
						default: "h-8 text-sm",
						sm: "h-7 text-xs",
						lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
					},
				},
				defaultVariants: {
					variant: "default",
					size: "default",
				},
			},
		);
		function SidebarMenuButton({
			asChild = false,
			isActive = false,
			variant = "default",
			size = "default",
			tooltip,
			className,
			...props
		}) {
			_s5();
			const Comp = asChild
				? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"Slot"
					]
				: "button";
			const { isMobile, state } = useSidebar();
			const button = /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				Comp,
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])(
						sidebarMenuButtonVariants({
							variant,
							size,
						}),
						className,
					),
					"data-active": isActive,
					"data-sidebar": "menu-button",
					"data-size": size,
					"data-slot": "sidebar-menu-button",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 543,
					columnNumber: 3,
				},
				this,
			);
			if (!tooltip) {
				return button;
			}
			if (typeof tooltip === "string") {
				tooltip = {
					children: tooltip,
				};
			}
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
					"Tooltip"
				],
				{
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
								"TooltipTrigger"
							],
							{
								asChild: true,
								children: button,
							},
							void 0,
							false,
							{
								fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
								lineNumber: 565,
								columnNumber: 4,
							},
							this,
						),
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
								"TooltipContent"
							],
							{
								align: "center",
								hidden: state !== "collapsed" || isMobile,
								side: "right",
								...tooltip,
							},
							void 0,
							false,
							{
								fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
								lineNumber: 566,
								columnNumber: 4,
							},
							this,
						),
					],
				},
				void 0,
				true,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 564,
					columnNumber: 3,
				},
				this,
			);
		}
		_s5(SidebarMenuButton, "DSCdbs8JtpmKVxCYgM7sPAZNgB0=", false, () => [
			useSidebar,
		]);
		_c17 = SidebarMenuButton;
		function SidebarMenuAction({
			className,
			asChild = false,
			showOnHover = false,
			...props
		}) {
			const Comp = asChild
				? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"Slot"
					]
				: "button";
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				Comp,
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])(
						"text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", // Increases the hit area of the button on mobile.
						"after:absolute after:-inset-2 md:after:hidden",
						"peer-data-[size=sm]/menu-button:top-1",
						"peer-data-[size=default]/menu-button:top-1.5",
						"peer-data-[size=lg]/menu-button:top-2.5",
						"group-data-[collapsible=icon]:hidden",
						showOnHover &&
							"peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
						className,
					),
					"data-sidebar": "menu-action",
					"data-slot": "sidebar-menu-action",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 588,
					columnNumber: 3,
				},
				this,
			);
		}
		_c18 = SidebarMenuAction;
		function SidebarMenuBadge({ className, ...props }) {
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"div",
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])(
						"text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
						"peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
						"peer-data-[size=sm]/menu-button:top-1",
						"peer-data-[size=default]/menu-button:top-1.5",
						"peer-data-[size=lg]/menu-button:top-2.5",
						"group-data-[collapsible=icon]:hidden",
						className,
					),
					"data-sidebar": "menu-badge",
					"data-slot": "sidebar-menu-badge",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 613,
					columnNumber: 3,
				},
				this,
			);
		}
		_c19 = SidebarMenuBadge;
		function SidebarMenuSkeleton({ className, showIcon = false, ...props }) {
			_s6();
			// Random width between 50 to 90%.
			const width =
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
					"useMemo"
				](
					{
						"SidebarMenuSkeleton.useMemo[width]": () =>
							`${Math.floor(Math.random() * 40) + 50}%`,
					}["SidebarMenuSkeleton.useMemo[width]"],
					[],
				);
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"div",
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])("flex h-8 items-center gap-2 rounded-md px-2", className),
					"data-sidebar": "menu-skeleton",
					"data-slot": "sidebar-menu-skeleton",
					...props,
					children: [
						showIcon &&
							/*#__PURE__*/ (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
								"jsxDEV"
							])(
								__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
									"Skeleton"
								],
								{
									className: "size-4 rounded-md",
									"data-sidebar": "menu-skeleton-icon",
								},
								void 0,
								false,
								{
									fileName:
										"[project]/apps/admin/src/components/ui/sidebar.tsx",
									lineNumber: 651,
									columnNumber: 5,
								},
								this,
							),
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
								"Skeleton"
							],
							{
								className: "h-4 max-w-(--skeleton-width) flex-1",
								"data-sidebar": "menu-skeleton-text",
								style: {
									"--skeleton-width": width,
								},
							},
							void 0,
							false,
							{
								fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
								lineNumber: 656,
								columnNumber: 4,
							},
							this,
						),
					],
				},
				void 0,
				true,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 644,
					columnNumber: 3,
				},
				this,
			);
		}
		_s6(SidebarMenuSkeleton, "nKFjX4dxbYo91VAj5VdWQ1XUe3I=");
		_c20 = SidebarMenuSkeleton;
		function SidebarMenuSub({ className, ...props }) {
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"ul",
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])(
						"border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
						"group-data-[collapsible=icon]:hidden",
						className,
					),
					"data-sidebar": "menu-sub",
					"data-slot": "sidebar-menu-sub",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 671,
					columnNumber: 3,
				},
				this,
			);
		}
		_c21 = SidebarMenuSub;
		function SidebarMenuSubItem({ className, ...props }) {
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"li",
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])("group/menu-sub-item relative", className),
					"data-sidebar": "menu-sub-item",
					"data-slot": "sidebar-menu-sub-item",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 689,
					columnNumber: 3,
				},
				this,
			);
		}
		_c22 = SidebarMenuSubItem;
		function SidebarMenuSubButton({
			asChild = false,
			size = "md",
			isActive = false,
			className,
			...props
		}) {
			const Comp = asChild
				? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"Slot"
					]
				: "a";
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				Comp,
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])(
						"text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px flex-row-reverse items-center justify-end gap-2 overflow-hidden rounded-md px-2 text-right outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
						"data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
						size === "sm" && "text-xs",
						size === "md" && "text-sm",
						"group-data-[collapsible=icon]:hidden",
						className,
					),
					"data-active": isActive,
					"data-sidebar": "menu-sub-button",
					"data-size": size,
					"data-slot": "sidebar-menu-sub-button",
					...props,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/sidebar.tsx",
					lineNumber: 712,
					columnNumber: 3,
				},
				this,
			);
		}
		_c23 = SidebarMenuSubButton;
		var _c,
			_c1,
			_c2,
			_c3,
			_c4,
			_c5,
			_c6,
			_c7,
			_c8,
			_c9,
			_c10,
			_c11,
			_c12,
			_c13,
			_c14,
			_c15,
			_c16,
			_c17,
			_c18,
			_c19,
			_c20,
			_c21,
			_c22,
			_c23;
		__turbopack_context__.k.register(_c, "SidebarProvider");
		__turbopack_context__.k.register(_c1, "Sidebar");
		__turbopack_context__.k.register(_c2, "SidebarTrigger");
		__turbopack_context__.k.register(_c3, "SidebarRail");
		__turbopack_context__.k.register(_c4, "SidebarInset");
		__turbopack_context__.k.register(_c5, "SidebarInput");
		__turbopack_context__.k.register(_c6, "SidebarHeader");
		__turbopack_context__.k.register(_c7, "SidebarFooter");
		__turbopack_context__.k.register(_c8, "SidebarSeparator");
		__turbopack_context__.k.register(_c9, "SidebarContent$React.forwardRef");
		__turbopack_context__.k.register(_c10, "SidebarContent");
		__turbopack_context__.k.register(_c11, "SidebarGroup");
		__turbopack_context__.k.register(_c12, "SidebarGroupLabel");
		__turbopack_context__.k.register(_c13, "SidebarGroupAction");
		__turbopack_context__.k.register(_c14, "SidebarGroupContent");
		__turbopack_context__.k.register(_c15, "SidebarMenu");
		__turbopack_context__.k.register(_c16, "SidebarMenuItem");
		__turbopack_context__.k.register(_c17, "SidebarMenuButton");
		__turbopack_context__.k.register(_c18, "SidebarMenuAction");
		__turbopack_context__.k.register(_c19, "SidebarMenuBadge");
		__turbopack_context__.k.register(_c20, "SidebarMenuSkeleton");
		__turbopack_context__.k.register(_c21, "SidebarMenuSub");
		__turbopack_context__.k.register(_c22, "SidebarMenuSubItem");
		__turbopack_context__.k.register(_c23, "SidebarMenuSubButton");
		if (
			typeof globalThis.$RefreshHelpers$ === "object" &&
			globalThis.$RefreshHelpers !== null
		) {
			__turbopack_context__.k.registerExports(
				__turbopack_context__.m,
				globalThis.$RefreshHelpers$,
			);
		}
	},
	"[project]/apps/admin/src/components/layout/admin-sidebar.tsx [app-client] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["AdminSidebar", () => AdminSidebar]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)",
			);
		/**
		 * Admin Sidebar - Using shadcn Sidebar Components
		 *
		 * Navigation sections for each route, matching web dashboard patterns
		 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$no$2d$axes$2d$column$2d$increasing$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chart-no-axes-column-increasing.js [app-client] (ecmascript) <export default as BarChart>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-client] (ecmascript) <export default as CreditCard>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-client] (ecmascript) <export default as HelpCircle>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$life$2d$buoy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LifeBuoy$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/life-buoy.js [app-client] (ecmascript) <export default as LifeBuoy>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$megaphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Megaphone$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/megaphone.js [app-client] (ecmascript) <export default as Megaphone>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/target.js [app-client] (ecmascript) <export default as Target>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ticket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ticket$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/ticket.js [app-client] (ecmascript) <export default as Ticket>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/user-plus.js [app-client] (ecmascript) <export default as UserPlus>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/components/ui/badge.tsx [app-client] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/badge.tsx [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/components/ui/sidebar.tsx [app-client] (ecmascript)",
			);
		var _s = __turbopack_context__.k.signature();
		("use client");
		const navigationSections = {
			today: [],
			ai: [
				{
					label: undefined,
					items: [
						{
							title: "AI Assistant",
							url: "/dashboard/ai",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__[
								"Sparkles"
							],
						},
						{
							title: "Automation",
							url: "/dashboard/ai/automation",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__[
								"Zap"
							],
						},
					],
				},
			],
			schedule: [
				{
					label: "Thorbis Team",
					items: [
						{
							title: "Team Calendar",
							url: "/dashboard/schedule",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__[
								"Calendar"
							],
						},
						{
							title: "Team Members",
							url: "/dashboard/schedule/team",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__[
								"Users"
							],
						},
						{
							title: "Time Off",
							url: "/dashboard/schedule/time-off",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__[
								"Calendar"
							],
						},
					],
				},
			],
			communication: [
				{
					label: "Channels",
					items: [
						{
							title: "All Messages",
							url: "/dashboard/communication",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__[
								"MessageSquare"
							],
						},
						{
							title: "Email",
							url: "/dashboard/communication/email",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__[
								"Mail"
							],
						},
						{
							title: "Support Tickets",
							url: "/dashboard/communication/tickets",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ticket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ticket$3e$__[
								"Ticket"
							],
						},
						{
							title: "Calls",
							url: "/dashboard/communication/calls",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__[
								"Phone"
							],
						},
					],
				},
			],
			work: [
				{
					label: "Company Management",
					items: [
						{
							title: "Companies",
							url: "/dashboard/work/companies",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__[
								"Building2"
							],
						},
						{
							title: "Users",
							url: "/dashboard/work/users",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__[
								"Users"
							],
						},
						{
							title: "Subscriptions",
							url: "/dashboard/work/subscriptions",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__[
								"CreditCard"
							],
						},
					],
				},
				{
					label: "Support",
					items: [
						{
							title: "Support Tickets",
							url: "/dashboard/work/support",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$life$2d$buoy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LifeBuoy$3e$__[
								"LifeBuoy"
							],
						},
						{
							title: "Onboarding",
							url: "/dashboard/work/onboarding",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__[
								"UserPlus"
							],
						},
						{
							title: "Help Center",
							url: "/dashboard/work/help-center",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__[
								"HelpCircle"
							],
						},
					],
				},
			],
			marketing: [
				{
					label: "Overview",
					items: [
						{
							title: "Dashboard",
							url: "/dashboard/marketing",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$megaphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Megaphone$3e$__[
								"Megaphone"
							],
						},
						{
							title: "Campaigns",
							url: "/dashboard/marketing/campaigns",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__[
								"Target"
							],
						},
					],
				},
				{
					label: "Content",
					items: [
						{
							title: "Website",
							url: "/dashboard/marketing/website",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__[
								"TrendingUp"
							],
						},
						{
							title: "Blog",
							url: "/dashboard/marketing/blog",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__[
								"FileText"
							],
						},
						{
							title: "Email Campaigns",
							url: "/dashboard/marketing/email",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__[
								"Mail"
							],
						},
					],
				},
			],
			finance: [
				{
					label: "Overview",
					items: [
						{
							title: "Dashboard",
							url: "/dashboard/finance",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__[
								"DollarSign"
							],
						},
						{
							title: "Revenue",
							url: "/dashboard/finance/revenue",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__[
								"TrendingUp"
							],
						},
					],
				},
				{
					label: "Billing",
					items: [
						{
							title: "Invoices",
							url: "/dashboard/finance/invoices",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__[
								"FileText"
							],
						},
						{
							title: "Subscriptions",
							url: "/dashboard/finance/subscriptions",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__[
								"CreditCard"
							],
						},
						{
							title: "Payments",
							url: "/dashboard/finance/payments",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__[
								"CreditCard"
							],
						},
					],
				},
			],
			analytics: [
				{
					label: "Platform",
					items: [
						{
							title: "Overview",
							url: "/dashboard/analytics",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$no$2d$axes$2d$column$2d$increasing$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart$3e$__[
								"BarChart"
							],
						},
						{
							title: "Usage Metrics",
							url: "/dashboard/analytics/usage",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__[
								"TrendingUp"
							],
						},
						{
							title: "Performance",
							url: "/dashboard/analytics/performance",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__[
								"Zap"
							],
						},
					],
				},
				{
					label: "Companies",
					items: [
						{
							title: "Company Analytics",
							url: "/dashboard/analytics/companies",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__[
								"Building2"
							],
						},
						{
							title: "Growth",
							url: "/dashboard/analytics/growth",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__[
								"TrendingUp"
							],
						},
						{
							title: "Retention",
							url: "/dashboard/analytics/retention",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__[
								"Users"
							],
						},
					],
				},
			],
			settings: [
				{
					label: undefined,
					items: [
						{
							title: "Overview",
							url: "/dashboard/settings",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__[
								"Settings"
							],
						},
					],
				},
				{
					label: "Account",
					items: [
						{
							title: "Profile",
							url: "/dashboard/settings/profile",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__[
								"Users"
							],
						},
						{
							title: "Security",
							url: "/dashboard/settings/security",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__[
								"Settings"
							],
						},
					],
				},
				{
					label: "Platform",
					items: [
						{
							title: "General",
							url: "/dashboard/settings/general",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__[
								"Settings"
							],
						},
						{
							title: "Billing",
							url: "/dashboard/settings/billing",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__[
								"CreditCard"
							],
						},
						{
							title: "Integrations",
							url: "/dashboard/settings/integrations",
							icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__[
								"Zap"
							],
						},
					],
				},
			],
		};
		function getCurrentSection(pathname) {
			if (pathname === "/dashboard") return "today";
			if (pathname.startsWith("/dashboard/ai")) return "ai";
			if (pathname.startsWith("/dashboard/schedule")) return "schedule";
			if (pathname.startsWith("/dashboard/communication"))
				return "communication";
			if (pathname.startsWith("/dashboard/work")) return "work";
			if (pathname.startsWith("/dashboard/marketing")) return "marketing";
			if (pathname.startsWith("/dashboard/finance")) return "finance";
			if (pathname.startsWith("/dashboard/analytics")) return "analytics";
			if (pathname.startsWith("/dashboard/settings")) return "settings";
			return "today";
		}
		function AdminSidebar(props) {
			_s();
			const pathname =
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
					"usePathname"
				])() ?? "/dashboard";
			const currentSection = getCurrentSection(pathname);
			const groups = navigationSections[currentSection];
			// Today page has no sidebar content
			if (currentSection === "today" || groups.length === 0) {
				return null;
			}
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
					"Sidebar"
				],
				{
					collapsible: "offcanvas",
					variant: "inset",
					...props,
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
								"SidebarContent"
							],
							{
								children: groups.map((group, groupIndex) =>
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
											"SidebarGroup"
										],
										{
											children: [
												group.label &&
													/*#__PURE__*/ (0,
													__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
														"jsxDEV"
													])(
														__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
															"SidebarGroupLabel"
														],
														{
															children: group.label,
														},
														void 0,
														false,
														{
															fileName:
																"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
															lineNumber: 369,
															columnNumber: 8,
														},
														this,
													),
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
														"SidebarGroupContent"
													],
													{
														children: /*#__PURE__*/ (0,
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
															"jsxDEV"
														])(
															__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																"SidebarMenu"
															],
															{
																children: group.items.map((item) => {
																	const isActive =
																		item.url === "/dashboard"
																			? pathname === "/dashboard"
																			: pathname?.startsWith(item.url);
																	const Icon = item.icon;
																	return /*#__PURE__*/ (0,
																	__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																		"jsxDEV"
																	])(
																		__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																			"SidebarMenuItem"
																		],
																		{
																			children: /*#__PURE__*/ (0,
																			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																				"jsxDEV"
																			])(
																				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																					"SidebarMenuButton"
																				],
																				{
																					asChild: true,
																					isActive: isActive,
																					tooltip: item.title,
																					children: /*#__PURE__*/ (0,
																					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																						"jsxDEV"
																					])(
																						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																							"default"
																						],
																						{
																							href: item.url,
																							children: [
																								/*#__PURE__*/ (0,
																								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																									"jsxDEV"
																								])(
																									Icon,
																									{
																										className: "h-4 w-4",
																									},
																									void 0,
																									false,
																									{
																										fileName:
																											"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
																										lineNumber: 388,
																										columnNumber: 14,
																									},
																									this,
																								),
																								/*#__PURE__*/ (0,
																								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																									"jsxDEV"
																								])(
																									"span",
																									{
																										children: item.title,
																									},
																									void 0,
																									false,
																									{
																										fileName:
																											"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
																										lineNumber: 389,
																										columnNumber: 14,
																									},
																									this,
																								),
																								item.badge &&
																									/*#__PURE__*/ (0,
																									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																										"jsxDEV"
																									])(
																										__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																											"Badge"
																										],
																										{
																											variant: "secondary",
																											className:
																												"ml-auto text-xs bg-primary/10 text-primary",
																											children: item.badge,
																										},
																										void 0,
																										false,
																										{
																											fileName:
																												"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
																											lineNumber: 391,
																											columnNumber: 15,
																										},
																										this,
																									),
																							],
																						},
																						void 0,
																						true,
																						{
																							fileName:
																								"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
																							lineNumber: 387,
																							columnNumber: 13,
																						},
																						this,
																					),
																				},
																				void 0,
																				false,
																				{
																					fileName:
																						"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
																					lineNumber: 382,
																					columnNumber: 12,
																				},
																				this,
																			),
																		},
																		item.url,
																		false,
																		{
																			fileName:
																				"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
																			lineNumber: 381,
																			columnNumber: 11,
																		},
																		this,
																	);
																}),
															},
															void 0,
															false,
															{
																fileName:
																	"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
																lineNumber: 372,
																columnNumber: 8,
															},
															this,
														),
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
														lineNumber: 371,
														columnNumber: 7,
													},
													this,
												),
											],
										},
										groupIndex,
										true,
										{
											fileName:
												"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
											lineNumber: 367,
											columnNumber: 6,
										},
										this,
									),
								),
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
								lineNumber: 365,
								columnNumber: 4,
							},
							this,
						),
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
								"SidebarFooter"
							],
							{
								children: /*#__PURE__*/ (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
									"jsxDEV"
								])(
									"div",
									{
										className:
											"rounded-lg bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-4",
										children: /*#__PURE__*/ (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
											"jsxDEV"
										])(
											"div",
											{
												className: "flex items-center gap-2 mb-2",
												children: [
													/*#__PURE__*/ (0,
													__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
														"jsxDEV"
													])(
														"div",
														{
															className:
																"flex h-8 w-8 items-center justify-center rounded-md bg-primary/10",
															children: /*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__[
																	"Sparkles"
																],
																{
																	className: "h-4 w-4 text-primary",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
																	lineNumber: 414,
																	columnNumber: 8,
																},
																this,
															),
														},
														void 0,
														false,
														{
															fileName:
																"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
															lineNumber: 413,
															columnNumber: 7,
														},
														this,
													),
													/*#__PURE__*/ (0,
													__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
														"jsxDEV"
													])(
														"div",
														{
															children: [
																/*#__PURE__*/ (0,
																__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																	"jsxDEV"
																])(
																	"span",
																	{
																		className: "text-sm font-semibold",
																		children: "Admin Panel",
																	},
																	void 0,
																	false,
																	{
																		fileName:
																			"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
																		lineNumber: 417,
																		columnNumber: 8,
																	},
																	this,
																),
																/*#__PURE__*/ (0,
																__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																	"jsxDEV"
																])(
																	"p",
																	{
																		className: "text-xs text-muted-foreground",
																		children: "v1.0.0",
																	},
																	void 0,
																	false,
																	{
																		fileName:
																			"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
																		lineNumber: 418,
																		columnNumber: 8,
																	},
																	this,
																),
															],
														},
														void 0,
														true,
														{
															fileName:
																"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
															lineNumber: 416,
															columnNumber: 7,
														},
														this,
													),
												],
											},
											void 0,
											true,
											{
												fileName:
													"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
												lineNumber: 412,
												columnNumber: 6,
											},
											this,
										),
									},
									void 0,
									false,
									{
										fileName:
											"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
										lineNumber: 411,
										columnNumber: 5,
									},
									this,
								),
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
								lineNumber: 410,
								columnNumber: 4,
							},
							this,
						),
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
								"SidebarRail"
							],
							{},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
								lineNumber: 423,
								columnNumber: 4,
							},
							this,
						),
					],
				},
				void 0,
				true,
				{
					fileName:
						"[project]/apps/admin/src/components/layout/admin-sidebar.tsx",
					lineNumber: 364,
					columnNumber: 3,
				},
				this,
			);
		}
		_s(AdminSidebar, "wVXOWZKWdId76kQQO0KX6Oz3JDA=", false, () => [
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"usePathname"
			],
		]);
		_c = AdminSidebar;
		var _c;
		__turbopack_context__.k.register(_c, "AdminSidebar");
		if (
			typeof globalThis.$RefreshHelpers$ === "object" &&
			globalThis.$RefreshHelpers !== null
		) {
			__turbopack_context__.k.registerExports(
				__turbopack_context__.m,
				globalThis.$RefreshHelpers$,
			);
		}
	},
	"[project]/apps/admin/src/components/layout/app-toolbar.tsx [app-client] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["AppToolbar", () => AppToolbar]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)",
			);
		/**
		 * AppToolbar - Admin Panel Toolbar
		 *
		 * Matches the web dashboard toolbar design:
		 * - Sidebar toggle button
		 * - Title and subtitle
		 * - Actions on the right
		 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/components/ui/sidebar.tsx [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/lib/utils.ts [app-client] (ecmascript)",
			);
		("use client");
		function AppToolbar({
			title,
			subtitle,
			actions,
			showSidebarTrigger = true,
			className,
		}) {
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"header",
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"cn"
					])(
						"bg-background/80 sticky top-0 z-40 flex w-full shrink-0 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
						className,
					),
					"data-app-toolbar": true,
					children: /*#__PURE__*/ (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"jsxDEV"
					])(
						"div",
						{
							className: "flex h-14 w-full items-center gap-3 px-4 md:px-6",
							children: [
								/*#__PURE__*/ (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
									"jsxDEV"
								])(
									"div",
									{
										className: "flex items-center gap-3 min-w-0 flex-1",
										children: [
											showSidebarTrigger &&
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
														"SidebarTrigger"
													],
													{
														className: "-ml-1",
														children: [
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__[
																	"Menu"
																],
																{
																	className: "h-4 w-4",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/layout/app-toolbar.tsx",
																	lineNumber: 46,
																	columnNumber: 8,
																},
																this,
															),
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"span",
																{
																	className: "sr-only",
																	children: "Toggle sidebar",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/layout/app-toolbar.tsx",
																	lineNumber: 47,
																	columnNumber: 8,
																},
																this,
															),
														],
													},
													void 0,
													true,
													{
														fileName:
															"[project]/apps/admin/src/components/layout/app-toolbar.tsx",
														lineNumber: 45,
														columnNumber: 7,
													},
													this,
												),
											title &&
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													"div",
													{
														className: "flex min-w-0 flex-col",
														children: [
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"h1",
																{
																	className:
																		"truncate text-sm font-semibold lg:text-base",
																	children: title,
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/layout/app-toolbar.tsx",
																	lineNumber: 54,
																	columnNumber: 8,
																},
																this,
															),
															subtitle &&
																/*#__PURE__*/ (0,
																__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
																	"jsxDEV"
																])(
																	"p",
																	{
																		className:
																			"text-muted-foreground truncate text-xs",
																		children: subtitle,
																	},
																	void 0,
																	false,
																	{
																		fileName:
																			"[project]/apps/admin/src/components/layout/app-toolbar.tsx",
																		lineNumber: 58,
																		columnNumber: 9,
																	},
																	this,
																),
														],
													},
													void 0,
													true,
													{
														fileName:
															"[project]/apps/admin/src/components/layout/app-toolbar.tsx",
														lineNumber: 53,
														columnNumber: 7,
													},
													this,
												),
										],
									},
									void 0,
									true,
									{
										fileName:
											"[project]/apps/admin/src/components/layout/app-toolbar.tsx",
										lineNumber: 43,
										columnNumber: 5,
									},
									this,
								),
								actions &&
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"div",
										{
											className: "flex shrink-0 items-center gap-2",
											children: actions,
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/layout/app-toolbar.tsx",
											lineNumber: 68,
											columnNumber: 6,
										},
										this,
									),
							],
						},
						void 0,
						true,
						{
							fileName:
								"[project]/apps/admin/src/components/layout/app-toolbar.tsx",
							lineNumber: 41,
							columnNumber: 4,
						},
						this,
					),
				},
				void 0,
				false,
				{
					fileName:
						"[project]/apps/admin/src/components/layout/app-toolbar.tsx",
					lineNumber: 34,
					columnNumber: 3,
				},
				this,
			);
		}
		_c = AppToolbar;
		var _c;
		__turbopack_context__.k.register(_c, "AppToolbar");
		if (
			typeof globalThis.$RefreshHelpers$ === "object" &&
			globalThis.$RefreshHelpers !== null
		) {
			__turbopack_context__.k.registerExports(
				__turbopack_context__.m,
				globalThis.$RefreshHelpers$,
			);
		}
	},
	"[project]/apps/admin/src/components/layout/section-layout.tsx [app-client] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["SectionLayout", () => SectionLayout]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$layout$2f$admin$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/components/layout/admin-sidebar.tsx [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$layout$2f$app$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/components/layout/app-toolbar.tsx [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/components/ui/sidebar.tsx [app-client] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/lib/utils.ts [app-client] (ecmascript)",
			);
		("use client");
		function SectionLayout({
			children,
			title,
			subtitle,
			actions,
			showSidebar = true,
			showToolbar = true,
			className,
		}) {
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
					"SidebarProvider"
				],
				{
					defaultOpen: true,
					children: /*#__PURE__*/ (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
						"jsxDEV"
					])(
						"div",
						{
							className: "fixed inset-0 top-14 flex w-full overflow-hidden",
							"data-admin-layout": true,
							children: [
								showSidebar &&
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$layout$2f$admin$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
											"AdminSidebar"
										],
										{},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/layout/section-layout.tsx",
											lineNumber: 41,
											columnNumber: 21,
										},
										this,
									),
								/*#__PURE__*/ (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
									"jsxDEV"
								])(
									__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
										"SidebarInset"
									],
									{
										className: "relative w-full bg-background",
										children: [
											showToolbar &&
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$layout$2f$app$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
														"AppToolbar"
													],
													{
														title: title,
														subtitle: subtitle,
														actions: actions,
														showSidebarTrigger: showSidebar,
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/layout/section-layout.tsx",
														lineNumber: 45,
														columnNumber: 7,
													},
													this,
												),
											/*#__PURE__*/ (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
												"jsxDEV"
											])(
												"main",
												{
													className: (0,
													__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
														"cn"
													])(
														"flex w-full flex-1 flex-col overflow-y-auto",
														className,
													),
													children: children,
												},
												void 0,
												false,
												{
													fileName:
														"[project]/apps/admin/src/components/layout/section-layout.tsx",
													lineNumber: 53,
													columnNumber: 6,
												},
												this,
											),
										],
									},
									void 0,
									true,
									{
										fileName:
											"[project]/apps/admin/src/components/layout/section-layout.tsx",
										lineNumber: 43,
										columnNumber: 5,
									},
									this,
								),
							],
						},
						void 0,
						true,
						{
							fileName:
								"[project]/apps/admin/src/components/layout/section-layout.tsx",
							lineNumber: 37,
							columnNumber: 4,
						},
						this,
					),
				},
				void 0,
				false,
				{
					fileName:
						"[project]/apps/admin/src/components/layout/section-layout.tsx",
					lineNumber: 36,
					columnNumber: 3,
				},
				this,
			);
		}
		_c = SectionLayout;
		var _c;
		__turbopack_context__.k.register(_c, "SectionLayout");
		if (
			typeof globalThis.$RefreshHelpers$ === "object" &&
			globalThis.$RefreshHelpers !== null
		) {
			__turbopack_context__.k.registerExports(
				__turbopack_context__.m,
				globalThis.$RefreshHelpers$,
			);
		}
	},
]);

//# sourceMappingURL=apps_admin_src_e686c28f._.js.map
