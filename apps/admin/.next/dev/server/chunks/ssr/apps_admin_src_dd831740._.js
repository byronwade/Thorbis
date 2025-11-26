module.exports = [
	"[project]/apps/admin/src/lib/datatable/custom-column-renderer.tsx [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		/**
		 * Custom Column Renderer
		 *
		 * Renders custom column values based on format type.
		 * Handles nested field access and formatting.
		 */ __turbopack_context__.s([
			"getColumnWidthClass",
			() => getColumnWidthClass,
			"renderCustomColumn",
			() => renderCustomColumn,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$4$2e$1$2e$0$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/date-fns@4.1.0/node_modules/date-fns/format.js [app-ssr] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/index.ts [app-ssr] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/badge.tsx [app-ssr] (ecmascript)",
			);
		/**
		 * Get nested value from object using dot notation path
		 */ function getNestedValue(obj, path) {
			return path.split(".").reduce((current, key) => current?.[key], obj);
		}
		/**
		 * Format currency value
		 */ function formatCurrency(value) {
			if (value === null || value === undefined || value === "") {
				return "—";
			}
			const num = Number(value);
			if (Number.isNaN(num)) {
				return "—";
			}
			return new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(num);
		}
		/**
		 * Format number value
		 */ function formatNumber(value) {
			if (value === null || value === undefined || value === "") {
				return "—";
			}
			const num = Number(value);
			if (Number.isNaN(num)) {
				return "—";
			}
			return new Intl.NumberFormat("en-US").format(num);
		}
		/**
		 * Format date value
		 */ function formatDate(value) {
			if (!value) {
				return "—";
			}
			try {
				const date = new Date(value);
				if (Number.isNaN(date.getTime())) {
					return "—";
				}
				return (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$date$2d$fns$40$4$2e$1$2e$0$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
					"format"
				])(date, "MMM d, yyyy h:mm a");
			} catch {
				return "—";
			}
		}
		function renderCustomColumn(item, fieldPath, columnFormat) {
			const value = getNestedValue(item, fieldPath);
			// Handle null/undefined values
			if (value === null || value === undefined || value === "") {
				return /*#__PURE__*/ (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"jsxDEV"
				])(
					"span",
					{
						className: "text-muted-foreground text-xs",
						children: "—",
					},
					void 0,
					false,
					{
						fileName:
							"[project]/apps/admin/src/lib/datatable/custom-column-renderer.tsx",
						lineNumber: 79,
						columnNumber: 10,
					},
					this,
				);
			}
			switch (columnFormat) {
				case "date":
					return /*#__PURE__*/ (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"jsxDEV"
					])(
						"span",
						{
							className: "text-xs",
							children: formatDate(value),
						},
						void 0,
						false,
						{
							fileName:
								"[project]/apps/admin/src/lib/datatable/custom-column-renderer.tsx",
							lineNumber: 84,
							columnNumber: 11,
						},
						this,
					);
				case "currency":
					return /*#__PURE__*/ (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"jsxDEV"
					])(
						"span",
						{
							className: "font-mono text-xs tabular-nums",
							children: formatCurrency(value),
						},
						void 0,
						false,
						{
							fileName:
								"[project]/apps/admin/src/lib/datatable/custom-column-renderer.tsx",
							lineNumber: 88,
							columnNumber: 5,
						},
						this,
					);
				case "number":
					return /*#__PURE__*/ (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"jsxDEV"
					])(
						"span",
						{
							className: "font-mono text-xs tabular-nums",
							children: formatNumber(value),
						},
						void 0,
						false,
						{
							fileName:
								"[project]/apps/admin/src/lib/datatable/custom-column-renderer.tsx",
							lineNumber: 95,
							columnNumber: 5,
						},
						this,
					);
				case "badge":
					// Handle boolean values
					if (typeof value === "boolean") {
						return /*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"Badge"
							],
							{
								variant: value ? "default" : "secondary",
								children: value ? "Yes" : "No",
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/lib/datatable/custom-column-renderer.tsx",
								lineNumber: 104,
								columnNumber: 6,
							},
							this,
						);
					}
					// Handle string values as badges
					return /*#__PURE__*/ (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"jsxDEV"
					])(
						__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"Badge"
						],
						{
							className: "capitalize",
							variant: "outline",
							children: String(value).replace(/_/g, " "),
						},
						void 0,
						false,
						{
							fileName:
								"[project]/apps/admin/src/lib/datatable/custom-column-renderer.tsx",
							lineNumber: 111,
							columnNumber: 5,
						},
						this,
					);
				default: {
					// Truncate long text
					const text = String(value);
					const truncated = text.length > 50 ? `${text.slice(0, 50)}...` : text;
					return /*#__PURE__*/ (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"jsxDEV"
					])(
						"span",
						{
							className: "text-xs",
							title: text,
							children: truncated,
						},
						void 0,
						false,
						{
							fileName:
								"[project]/apps/admin/src/lib/datatable/custom-column-renderer.tsx",
							lineNumber: 120,
							columnNumber: 5,
						},
						this,
					);
				}
			}
		}
		function getColumnWidthClass(width) {
			switch (width) {
				case "sm":
					return "w-32";
				case "md":
					return "w-48";
				case "lg":
					return "w-64";
				case "xl":
					return "w-96";
				default:
					return "flex-1";
			}
		}
	},
	"[project]/apps/admin/src/lib/stores/custom-columns-store.ts [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		/**
		 * Custom Columns Store - Zustand State Management
		 *
		 * Manages custom column definitions per entity type for datatables
		 */ __turbopack_context__.s([
			"useCustomColumnsStore",
			() => useCustomColumnsStore,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)",
			);
		// Initial state
		const initialState = {
			columns: {},
		};
		const useCustomColumnsStore = (0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
			"create"
		])()(
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"persist"
			])(
				(set, get) => ({
					...initialState,
					addColumn: (entity, column) =>
						set((state) => ({
							columns: {
								...state.columns,
								[entity]: [...(state.columns[entity] || []), column],
							},
						})),
					removeColumn: (entity, columnId) =>
						set((state) => ({
							columns: {
								...state.columns,
								[entity]: (state.columns[entity] || []).filter(
									(col) => col.id !== columnId,
								),
							},
						})),
					updateColumn: (entity, columnId, updates) =>
						set((state) => ({
							columns: {
								...state.columns,
								[entity]: (state.columns[entity] || []).map((col) =>
									col.id === columnId
										? {
												...col,
												...updates,
											}
										: col,
								),
							},
						})),
					reorderColumns: (entity, fromIndex, toIndex) =>
						set((state) => {
							const entityColumns = [...(state.columns[entity] || [])];
							const [removed] = entityColumns.splice(fromIndex, 1);
							entityColumns.splice(toIndex, 0, removed);
							return {
								columns: {
									...state.columns,
									[entity]: entityColumns,
								},
							};
						}),
					getColumns: (entity) => {
						const state = get();
						return state.columns[entity] || [];
					},
					clearEntity: (entity) =>
						set((state) => {
							const { [entity]: _, ...rest } = state.columns;
							return {
								columns: rest,
							};
						}),
					clearAll: () =>
						set({
							columns: {},
						}),
				}),
				{
					name: "admin-custom-columns-storage",
					skipHydration: true,
					version: 1,
				},
			),
		);
	},
	"[project]/apps/admin/src/lib/stores/datatable-columns-store.ts [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		/**
		 * DataTable Columns Store - Zustand State Management
		 *
		 * Performance optimizations:
		 * - Lightweight state management with Zustand
		 * - No provider wrapper needed
		 * - Selective subscriptions prevent unnecessary re-renders
		 * - Persisted to localStorage for user preferences
		 *
		 * Manages column visibility and ordering state per entity type
		 */ __turbopack_context__.s([
			"useDataTableColumnsStore",
			() => useDataTableColumnsStore,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)",
			);
		// Initial state
		const initialState = {
			entities: {},
			columnOrder: {},
		};
		const useDataTableColumnsStore = (0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
			"create"
		])()(
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"persist"
			])(
				(set, get) => ({
					...initialState,
					// Visibility Actions
					setColumnVisibility: (entity, columnKey, visible) =>
						set((state) => ({
							entities: {
								...state.entities,
								[entity]: {
									...state.entities[entity],
									[columnKey]: visible,
								},
							},
						})),
					toggleColumn: (entity, columnKey) => {
						const current = get().isColumnVisible(entity, columnKey);
						get().setColumnVisibility(entity, columnKey, !current);
					},
					showAllColumns: (entity, columnKeys) =>
						set((state) => ({
							entities: {
								...state.entities,
								[entity]: columnKeys.reduce((acc, key) => {
									acc[key] = true;
									return acc;
								}, {}),
							},
						})),
					hideAllColumns: (entity, columnKeys) =>
						set((state) => ({
							entities: {
								...state.entities,
								[entity]: columnKeys.reduce((acc, key) => {
									acc[key] = false;
									return acc;
								}, {}),
							},
						})),
					isColumnVisible: (entity, columnKey) => {
						const state = get();
						// Default to true if not set
						return state.entities[entity]?.[columnKey] ?? true;
					},
					getVisibleColumns: (entity) => {
						const state = get();
						const entityState = state.entities[entity] || {};
						return Object.entries(entityState)
							.filter(([, visible]) => visible)
							.map(([key]) => key);
					},
					// Ordering Actions
					setColumnOrder: (entity, columnOrder) =>
						set((state) => ({
							columnOrder: {
								...state.columnOrder,
								[entity]: columnOrder,
							},
						})),
					getColumnOrder: (entity) => {
						const state = get();
						return state.columnOrder[entity];
					},
					reorderColumn: (entity, fromIndex, toIndex) => {
						const state = get();
						const currentOrder = state.columnOrder[entity];
						if (!currentOrder) {
							return;
						}
						const newOrder = [...currentOrder];
						const [removed] = newOrder.splice(fromIndex, 1);
						newOrder.splice(toIndex, 0, removed);
						get().setColumnOrder(entity, newOrder);
					},
					resetColumnOrder: (entity) =>
						set((state) => {
							const { [entity]: _, ...rest } = state.columnOrder;
							return {
								columnOrder: rest,
							};
						}),
					// General Actions
					resetEntity: (entity) =>
						set((state) => {
							const { [entity]: _visibility, ...restEntities } = state.entities;
							const { [entity]: _order, ...restOrder } = state.columnOrder;
							return {
								entities: restEntities,
								columnOrder: restOrder,
							};
						}),
					initializeEntity: (entity, columns) => {
						const state = get();
						if (!state.entities[entity]) {
							set((currentState) => ({
								entities: {
									...currentState.entities,
									[entity]: columns.reduce((acc, key) => {
										acc[key] = true;
										return acc;
									}, {}),
								},
							}));
						}
						// Initialize column order if not set
						if (!state.columnOrder[entity]) {
							get().setColumnOrder(entity, columns);
						}
					},
				}),
				{
					name: "admin-datatable-columns-storage",
					skipHydration: true,
					version: 1,
				},
			),
		);
	},
	"[project]/apps/admin/src/components/ui/full-width-datatable.tsx [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["FullWidthDataTable", () => FullWidthDataTable]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)",
			);
		/**
		 * FullWidthDataTable - Universal Table Component for Admin
		 * Enterprise-grade table with design system variants
		 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$dnd$2d$kit$2b$core$40$6$2e$3$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@dnd-kit+core@6.3.1_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/@dnd-kit/core/dist/core.esm.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$dnd$2d$kit$2b$sortable$40$10$2e$0$2e$0_$40$dnd$2d$kit$2b$core$40$6$2e$3$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@dnd-kit+sortable@10.0.0_@dnd-kit+core@6.3.1_react-dom@19.2.0_react@19.2.0__react@19.2.0__react@19.2.0/node_modules/@dnd-kit/sortable/dist/sortable.esm.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$dnd$2d$kit$2b$utilities$40$3$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@dnd-kit+utilities@3.2.2_react@19.2.0/node_modules/@dnd-kit/utilities/dist/utilities.esm.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$virtual$40$3$2e$13$2e$12_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$virtual$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/@tanstack+react-virtual@3.13.12_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/@tanstack/react-virtual/dist/esm/index.js [app-ssr] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-down.js [app-ssr] (ecmascript) <export default as ArrowDown>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-up.js [app-ssr] (ecmascript) <export default as ArrowUp>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-ssr] (ecmascript) <export default as ArrowUpDown>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-ssr] (ecmascript) <export default as CheckCircle2>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-ssr] (ecmascript) <export default as ChevronLeft>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/index.ts [app-ssr] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/button.tsx [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/checkbox.tsx [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/input.tsx [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/utils.ts [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$datatable$2f$custom$2d$column$2d$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/lib/datatable/custom-column-renderer.tsx [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$stores$2f$custom$2d$columns$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/lib/stores/custom-columns-store.ts [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$stores$2f$datatable$2d$columns$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/lib/stores/datatable-columns-store.ts [app-ssr] (ecmascript)",
			);
		("use client");
		// Sortable Column Header Component
		function SortableColumnHeader({
			column,
			isSorted,
			sortDirection,
			onSort,
			colIndex,
			totalColumns,
		}) {
			const [mouseDownPos, setMouseDownPos] = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useState"
			])(null);
			const {
				attributes,
				listeners,
				setNodeRef,
				transform,
				transition,
				isDragging,
			} = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$dnd$2d$kit$2b$sortable$40$10$2e$0$2e$0_$40$dnd$2d$kit$2b$core$40$6$2e$3$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useSortable"
			])({
				id: column.key,
			});
			const widthClass = column.width || "flex-1";
			const shrinkClass = column.shrink ? "shrink-0" : "";
			const alignClass =
				column.align === "right"
					? "justify-end text-right"
					: column.align === "center"
						? "justify-center text-center"
						: "justify-start text-left";
			const hideClass = column.hideOnMobile ? "hidden md:flex" : "flex";
			const cellBorder =
				colIndex < totalColumns - 1 ? "border-r border-border/30" : "";
			const style = {
				transform:
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$dnd$2d$kit$2b$utilities$40$3$2e$2$2e$2_react$40$19$2e$2$2e$0$2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"CSS"
					].Transform.toString(transform),
				transition,
			};
			const handleMouseDown = (e) => {
				setMouseDownPos({
					x: e.clientX,
					y: e.clientY,
				});
			};
			const handleClick = (e) => {
				if (!(column.sortable && mouseDownPos)) {
					return;
				}
				const deltaX = Math.abs(e.clientX - mouseDownPos.x);
				const deltaY = Math.abs(e.clientY - mouseDownPos.y);
				if (deltaX < 5 && deltaY < 5) {
					onSort(column.key);
				}
				setMouseDownPos(null);
			};
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"div",
				{
					className: `${hideClass} ${widthClass} ${shrinkClass} ${alignClass} ${cellBorder} group/header relative flex min-w-0 cursor-grab items-center gap-1.5 overflow-hidden px-2 ${isDragging ? "opacity-40" : "transition-all active:cursor-grabbing"}`,
					onClick: handleClick,
					onMouseDown: handleMouseDown,
					ref: setNodeRef,
					style: style,
					...attributes,
					...listeners,
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"span",
							{
								className: "font-medium",
								children: column.header,
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
								lineNumber: 148,
								columnNumber: 4,
							},
							this,
						),
						column.sortable &&
							(isSorted
								? sortDirection === "asc"
									? /*#__PURE__*/ (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"jsxDEV"
										])(
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__[
												"ArrowUp"
											],
											{
												className: "size-3 shrink-0",
											},
											void 0,
											false,
											{
												fileName:
													"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
												lineNumber: 152,
												columnNumber: 7,
											},
											this,
										)
									: /*#__PURE__*/ (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"jsxDEV"
										])(
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__[
												"ArrowDown"
											],
											{
												className: "size-3 shrink-0",
											},
											void 0,
											false,
											{
												fileName:
													"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
												lineNumber: 154,
												columnNumber: 7,
											},
											this,
										)
								: /*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__[
											"ArrowUpDown"
										],
										{
											className:
												"size-3 shrink-0 opacity-40 transition-opacity group-hover/header:opacity-60",
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
											lineNumber: 157,
											columnNumber: 6,
										},
										this,
									)),
					],
				},
				void 0,
				true,
				{
					fileName:
						"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
					lineNumber: 139,
					columnNumber: 3,
				},
				this,
			);
		}
		const VARIANT_CONFIG = {
			full: {
				itemsPerPage: 50,
				virtualRowHeight: 60,
				toolbarPadding: "px-4 py-2 sm:px-4",
				headerPadding: "px-4 py-2",
				rowPadding: "px-3 py-1.5 sm:px-4 sm:py-2",
				cellPadding: "px-2",
				headerTextSize: "text-xs",
				cellTextSize: "text-sm",
				headerBg: "bg-muted dark:bg-muted",
				rowBg: "bg-card",
				rowBgAlt: "bg-card/70",
				rowHover: "hover:bg-accent/50",
				borderColor: "border-border/50",
				gapSize: "gap-4 sm:gap-6",
				showPagination: true,
				showSearch: true,
			},
			compact: {
				itemsPerPage: 20,
				virtualRowHeight: 48,
				toolbarPadding: "px-4 py-3 sm:px-6",
				headerPadding: "px-3 py-1.5",
				rowPadding: "px-2 py-1 sm:px-3 sm:py-1.5",
				cellPadding: "px-1.5",
				headerTextSize: "text-[11px]",
				cellTextSize: "text-xs",
				headerBg: "bg-muted/80 dark:bg-muted/60",
				rowBg: "bg-background",
				rowBgAlt: "bg-muted/20 dark:bg-muted/10",
				rowHover: "hover:bg-accent/40",
				borderColor: "border-border/40",
				gapSize: "gap-3 sm:gap-4",
				showPagination: true,
				showSearch: true,
			},
			nested: {
				itemsPerPage: 10,
				virtualRowHeight: 40,
				toolbarPadding: "px-2 py-1",
				headerPadding: "px-2 py-1",
				rowPadding: "px-1.5 py-0.5 sm:px-2 sm:py-1",
				cellPadding: "px-1",
				headerTextSize: "text-[10px]",
				cellTextSize: "text-[11px]",
				headerBg: "bg-muted/60 dark:bg-muted/40",
				rowBg: "bg-background",
				rowBgAlt: "bg-muted/10 dark:bg-muted/5",
				rowHover: "hover:bg-accent/30",
				borderColor: "border-border/30",
				gapSize: "gap-2 sm:gap-3",
				showPagination: false,
				showSearch: false,
			},
		};
		function FullWidthDataTable({
			data = [],
			columns,
			getItemId,
			variant = "full",
			isHighlighted,
			getHighlightClass,
			onRowClick,
			bulkActions = [],
			searchPlaceholder = "Search...",
			searchFilter,
			emptyMessage = "No items found",
			emptyIcon,
			emptyAction,
			showRefresh = false,
			onRefresh,
			showPagination,
			itemsPerPage,
			totalCount,
			currentPageFromServer = 1,
			serverPagination = false,
			toolbarActions,
			enableSelection = true,
			getRowClassName,
			enableVirtualization = "auto",
			virtualRowHeight,
			virtualOverscan = 5,
			entity,
			showArchived = true,
			isArchived,
			initialSearchQuery = "",
			serverSearch = false,
			searchParamKey = "search",
			searchDebounceMs = 300,
			noPadding = false,
			onSelectionChange,
		}) {
			const config = VARIANT_CONFIG[variant];
			const effectiveItemsPerPage = itemsPerPage ?? config.itemsPerPage;
			const effectiveVirtualRowHeight =
				virtualRowHeight ?? config.virtualRowHeight;
			const effectiveShowPagination = showPagination ?? config.showPagination;
			const effectiveShowSearch =
				(searchFilter || serverSearch) && config.showSearch;
			const router = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useRouter"
			])();
			const [selectedIds, setSelectedIds] = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useState"
			])(new Set());
			const [searchQuery, setSearchQuery] = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useState"
			])(initialSearchQuery ?? "");
			const [currentPage, setCurrentPage] = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useState"
			])(currentPageFromServer);
			const lastServerSearchRef = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useRef"
			])(initialSearchQuery ?? "");
			const scrollContainerRef = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useRef"
			])(null);
			const toolbarRef = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useRef"
			])(null);
			const [toolbarHeight, setToolbarHeight] = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useState"
			])(50);
			const lastSelectedIndexRef = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useRef"
			])(null);
			const [isClient, setIsClient] = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useState"
			])(false);
			const [sortBy, setSortBy] = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useState"
			])(null);
			const [sortDirection, setSortDirection] = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useState"
			])("asc");
			const _isColumnVisible = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$stores$2f$datatable$2d$columns$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useDataTableColumnsStore"
			])((state) => state.isColumnVisible);
			const getColumnOrder = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$stores$2f$datatable$2d$columns$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useDataTableColumnsStore"
			])((state) => state.getColumnOrder);
			const setColumnOrder = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$stores$2f$datatable$2d$columns$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useDataTableColumnsStore"
			])((state) => state.setColumnOrder);
			const initializeEntity = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$stores$2f$datatable$2d$columns$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useDataTableColumnsStore"
			])((state) => state.initializeEntity);
			const columnVisibilityState = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$stores$2f$datatable$2d$columns$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useDataTableColumnsStore"
			])((state) => (entity ? state.entities[entity] : null));
			const columnOrderState = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$stores$2f$datatable$2d$columns$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useDataTableColumnsStore"
			])((state) => (entity ? state.columnOrder[entity] : null));
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useEffect"
			])(() => {
				setIsClient(true);
			}, []);
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useEffect"
			])(() => {
				setCurrentPage(currentPageFromServer);
			}, [currentPageFromServer]);
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useEffect"
			])(() => {
				const normalized = initialSearchQuery ?? "";
				setSearchQuery(normalized);
				lastServerSearchRef.current = normalized;
			}, [initialSearchQuery]);
			const allCustomColumns = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$stores$2f$custom$2d$columns$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useCustomColumnsStore"
			])((state) => state.columns);
			const customColumns = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useMemo"
			])(
				() => (entity ? allCustomColumns[entity] || [] : []),
				[allCustomColumns, entity],
			);
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useEffect"
			])(() => {
				const measureToolbar = () => {
					if (toolbarRef.current) {
						const height = toolbarRef.current.offsetHeight;
						setToolbarHeight(height);
					}
				};
				measureToolbar();
				window.addEventListener("resize", measureToolbar);
				const timer = setTimeout(measureToolbar, 100);
				return () => {
					window.removeEventListener("resize", measureToolbar);
					clearTimeout(timer);
				};
			}, []);
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useEffect"
			])(() => {
				if (!serverSearch) {
					return;
				}
				if (searchQuery === lastServerSearchRef.current) {
					return;
				}
				const handler = setTimeout(() => {
					if (("TURBOPACK compile-time truthy", 1)) {
						return;
					}
					//TURBOPACK unreachable
					const params = undefined;
					const queryString = undefined;
				}, searchDebounceMs);
				return () => clearTimeout(handler);
			}, [searchQuery, serverSearch, searchParamKey, router, searchDebounceMs]);
			const allColumns = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useMemo"
			])(() => {
				if (!entity) {
					return columns;
				}
				const customColumnDefs = customColumns.map((col) => ({
					key: col.id,
					header: col.label,
					width: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$datatable$2f$custom$2d$column$2d$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"getColumnWidthClass"
					])(col.width),
					sortable: col.sortable,
					hideable: true,
					render: (item) =>
						(0,
						__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$datatable$2f$custom$2d$column$2d$renderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"renderCustomColumn"
						])(item, col.fieldPath, col.format),
				}));
				return [...columns, ...customColumnDefs];
			}, [columns, customColumns, entity]);
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useEffect"
			])(() => {
				if (isClient && entity && allColumns.length > 0) {
					initializeEntity(
						entity,
						allColumns.map((col) => col.key),
					);
				}
			}, [isClient, entity, allColumns, initializeEntity]);
			const orderedColumns = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useMemo"
			])(() => {
				if (!(isClient && entity)) {
					return allColumns;
				}
				const storedOrder = columnOrderState || getColumnOrder(entity);
				if (!storedOrder || storedOrder.length === 0) {
					return allColumns;
				}
				const columnMap = new Map(allColumns.map((col) => [col.key, col]));
				const ordered = [];
				const usedKeys = new Set();
				for (const key of storedOrder) {
					const column = columnMap.get(key);
					if (column) {
						ordered.push(column);
						usedKeys.add(key);
					}
				}
				for (const column of allColumns) {
					if (!usedKeys.has(column.key)) {
						ordered.push(column);
					}
				}
				return ordered;
			}, [isClient, allColumns, entity, columnOrderState, getColumnOrder]);
			const visibleColumns = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useMemo"
			])(() => {
				if (!entity) {
					return orderedColumns;
				}
				const filtered = orderedColumns.filter((col) => {
					if (!col.hideable) {
						return true;
					}
					const visible = columnVisibilityState?.[col.key] ?? true;
					return visible;
				});
				const hasFlexColumn = filtered.some(
					(col) => col.width === "flex-1" || !col.width,
				);
				if (!hasFlexColumn && filtered.length > 0) {
					const flexibleColumnIndex = filtered.findIndex(
						(col) =>
							!col.width ||
							col.width === "flex-1" ||
							!col.width.startsWith("w-"),
					);
					if (flexibleColumnIndex !== -1) {
						filtered[flexibleColumnIndex] = {
							...filtered[flexibleColumnIndex],
							width: "flex-1",
						};
					}
				}
				return filtered;
			}, [orderedColumns, entity, columnVisibilityState]);
			const filteredData = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useMemo"
			])(() => {
				let filtered = data;
				if (searchQuery && searchFilter) {
					filtered = filtered.filter((item) =>
						searchFilter(item, searchQuery.toLowerCase()),
					);
				}
				if (!showArchived && isArchived) {
					filtered = filtered.filter((item) => !isArchived(item));
				}
				return filtered;
			}, [data, searchQuery, searchFilter, showArchived, isArchived]);
			const sortedData = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useMemo"
			])(() => {
				if (!sortBy) {
					return filteredData;
				}
				const column = allColumns.find((c) => c.key === sortBy);
				if (!column?.sortable) {
					return filteredData;
				}
				const active = filteredData.filter((item) => !isArchived?.(item));
				const archived = filteredData.filter((item) => isArchived?.(item));
				const sortedActive = [...active].sort((a, b) => {
					if (column.sortFn) {
						const result = column.sortFn(a, b);
						return sortDirection === "asc" ? result : -result;
					}
					const aVal = String(a[sortBy] ?? "");
					const bVal = String(b[sortBy] ?? "");
					const comparison = aVal.localeCompare(bVal);
					return sortDirection === "asc" ? comparison : -comparison;
				});
				return [...sortedActive, ...archived];
			}, [filteredData, sortBy, sortDirection, allColumns, isArchived]);
			const useVirtualization = false;
			const rowVirtualizer = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$virtual$40$3$2e$13$2e$12_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$virtual$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
				"useVirtualizer"
			])({
				count: ("TURBOPACK compile-time falsy", 0)
					? "TURBOPACK unreachable"
					: 0,
				getScrollElement: () => scrollContainerRef.current,
				estimateSize: () => effectiveVirtualRowHeight,
				overscan: virtualOverscan,
				enabled: useVirtualization,
			});
			const paginatedData = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useMemo"
			])(() => {
				if (
					("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
				);
				if (!effectiveShowPagination || serverPagination) {
					return sortedData;
				}
				const start = (currentPage - 1) * effectiveItemsPerPage;
				const end = start + effectiveItemsPerPage;
				return sortedData.slice(start, end);
			}, [
				sortedData,
				currentPage,
				effectiveItemsPerPage,
				effectiveShowPagination,
				serverPagination,
				useVirtualization,
			]);
			const virtualItems = ("TURBOPACK compile-time falsy", 0)
				? "TURBOPACK unreachable"
				: [];
			const displayData = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useMemo"
			])(() => {
				if (
					("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
				);
				return paginatedData.map((item) => ({
					item,
					virtualItem: null,
				}));
			}, [useVirtualization, virtualItems, sortedData, paginatedData]);
			const totalPages = Math.ceil(
				(totalCount || sortedData.length) / effectiveItemsPerPage,
			);
			const handleSelectAll = (checked) => {
				if (checked) {
					const allIds = new Set(paginatedData.map(getItemId));
					setSelectedIds(allIds);
				} else {
					setSelectedIds(new Set());
				}
			};
			const handleSelectItem = (id, index, event) => {
				const newSelected = new Set(selectedIds);
				const isShiftHeld = event && "shiftKey" in event && event.shiftKey;
				if (isShiftHeld && lastSelectedIndexRef.current !== null) {
					const start = Math.min(lastSelectedIndexRef.current, index);
					const end = Math.max(lastSelectedIndexRef.current, index);
					for (let i = start; i <= end; i++) {
						const item = paginatedData[i];
						if (item) {
							newSelected.add(getItemId(item));
						}
					}
				} else {
					if (newSelected.has(id)) {
						newSelected.delete(id);
					} else {
						newSelected.add(id);
					}
				}
				lastSelectedIndexRef.current = index;
				setSelectedIds(newSelected);
			};
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useEffect"
			])(() => {
				onSelectionChange?.(selectedIds);
			}, [selectedIds, onSelectionChange]);
			const handleRowClick = (item, event) => {
				const target = event.target;
				if (
					target.closest("[data-no-row-click]") ||
					target.closest("button") ||
					target.closest('[role="checkbox"]')
				) {
					return;
				}
				onRowClick?.(item);
			};
			const updatePageInQuery = (newPage) => {
				if (("TURBOPACK compile-time truthy", 1)) {
					return;
				}
				//TURBOPACK unreachable
				const params = undefined;
				const queryString = undefined;
			};
			const handlePreviousPage = () => {
				const newPage = Math.max(1, currentPage - 1);
				setCurrentPage(newPage);
				updatePageInQuery(newPage);
			};
			const handleNextPage = () => {
				const newPage = Math.min(totalPages, currentPage + 1);
				setCurrentPage(newPage);
				updatePageInQuery(newPage);
			};
			const isAllSelected =
				selectedIds.size === paginatedData.length && paginatedData.length > 0;
			const handleSort = (columnKey) => {
				if (sortBy === columnKey) {
					if (sortDirection === "asc") {
						setSortDirection("desc");
					} else {
						setSortBy(null);
						setSortDirection("asc");
					}
				} else {
					setSortBy(columnKey);
					setSortDirection("asc");
				}
			};
			const sensors = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$dnd$2d$kit$2b$core$40$6$2e$3$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useSensors"
			])(
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$dnd$2d$kit$2b$core$40$6$2e$3$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"useSensor"
				])(
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$dnd$2d$kit$2b$core$40$6$2e$3$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"MouseSensor"
					],
					{
						activationConstraint: {
							distance: 5,
						},
					},
				),
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$dnd$2d$kit$2b$core$40$6$2e$3$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"useSensor"
				])(
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$dnd$2d$kit$2b$core$40$6$2e$3$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"TouchSensor"
					],
					{
						activationConstraint: {
							delay: 200,
							tolerance: 5,
						},
					},
				),
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$dnd$2d$kit$2b$core$40$6$2e$3$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"useSensor"
				])(
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$dnd$2d$kit$2b$core$40$6$2e$3$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"KeyboardSensor"
					],
				),
			);
			const [activeColumn, setActiveColumn] = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useState"
			])(null);
			const handleDragStart = (event) => {
				const column = orderedColumns.find(
					(col) => col.key === event.active.id,
				);
				if (column) {
					let width = 150;
					try {
						const element = event.active.rect?.current?.initial;
						if (element?.width) {
							width = element.width;
						}
					} catch (_error) {}
					const align = column.align || "left";
					setActiveColumn({
						column,
						width,
						align,
					});
				} else {
					setActiveColumn(null);
				}
			};
			const handleDragEnd = (event) => {
				const { active, over } = event;
				if (!(entity && over) || active.id === over.id) {
					setActiveColumn(null);
					return;
				}
				const currentOrder = getColumnOrder(entity);
				if (!currentOrder) {
					setActiveColumn(null);
					return;
				}
				const oldIndex = currentOrder.indexOf(active.id);
				const newIndex = currentOrder.indexOf(over.id);
				if (oldIndex === -1 || newIndex === -1) {
					setActiveColumn(null);
					return;
				}
				const newOrder = [...currentOrder];
				const [removed] = newOrder.splice(oldIndex, 1);
				newOrder.splice(newIndex, 0, removed);
				setColumnOrder(entity, newOrder);
				setActiveColumn(null);
			};
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"div",
				{
					className:
						"bg-background relative flex h-full flex-1 flex-col overflow-hidden",
					children: /*#__PURE__*/ (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"jsxDEV"
					])(
						"div",
						{
							className: "flex-1 overflow-x-auto overflow-y-auto",
							ref: scrollContainerRef,
							children: [
								/*#__PURE__*/ (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
									"jsxDEV"
								])(
									"div",
									{
										className: (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"cn"
										])(
											"bg-background dark:bg-background sticky top-0 z-30 flex flex-wrap items-center gap-2 border-b sm:gap-2",
											config.borderColor,
											noPadding ? "px-0 py-0" : config.toolbarPadding,
										),
										ref: toolbarRef,
										children: [
											/*#__PURE__*/ (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"jsxDEV"
											])(
												"div",
												{
													className: "flex items-center gap-1.5 sm:gap-2",
													children:
														effectiveShowSearch &&
														/*#__PURE__*/ (0,
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
															"jsxDEV"
														])(
															"div",
															{
																className: "relative",
																children: [
																	/*#__PURE__*/ (0,
																	__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																		"jsxDEV"
																	])(
																		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__[
																			"Search"
																		],
																		{
																			className:
																				"text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors",
																		},
																		void 0,
																		false,
																		{
																			fileName:
																				"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																			lineNumber: 766,
																			columnNumber: 9,
																		},
																		this,
																	),
																	/*#__PURE__*/ (0,
																	__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																		"jsxDEV"
																	])(
																		__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																			"Input"
																		],
																		{
																			className:
																				"focus:ring-primary/20 h-10 md:h-9 w-full sm:w-64 md:w-96 pl-9 text-base md:text-sm transition-all duration-200 focus:ring-2",
																			onChange: (e) => {
																				setSearchQuery(e.target.value);
																				setCurrentPage(1);
																			},
																			placeholder: searchPlaceholder,
																			value: searchQuery,
																		},
																		void 0,
																		false,
																		{
																			fileName:
																				"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																			lineNumber: 767,
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
																	"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																lineNumber: 765,
																columnNumber: 8,
															},
															this,
														),
												},
												void 0,
												false,
												{
													fileName:
														"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
													lineNumber: 763,
													columnNumber: 6,
												},
												this,
											),
											selectedIds.size > 0 &&
												bulkActions.length > 0 &&
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"Fragment"
													],
													{
														children: [
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"div",
																{
																	className: "bg-border/50 mx-2 h-5 w-px",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																	lineNumber: 783,
																	columnNumber: 8,
																},
																this,
															),
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"div",
																{
																	className:
																		"flex flex-wrap items-center gap-2",
																	children: [
																		bulkActions.map((action, index) =>
																			/*#__PURE__*/ (0,
																			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																				"jsxDEV"
																			])(
																				__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																					"Button"
																				],
																				{
																					className: (0,
																					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																						"cn"
																					])(
																						"transition-all duration-200 hover:scale-105 active:scale-95",
																						action.variant === "destructive" &&
																							"text-white hover:text-white dark:text-white",
																					),
																					onClick: () =>
																						action.onClick(selectedIds),
																					size: "sm",
																					variant: action.variant || "outline",
																					children: [
																						action.icon,
																						/*#__PURE__*/ (0,
																						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																							"jsxDEV"
																						])(
																							"span",
																							{
																								className:
																									"ml-2 hidden sm:inline",
																								children: action.label,
																							},
																							void 0,
																							false,
																							{
																								fileName:
																									"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																								lineNumber: 798,
																								columnNumber: 11,
																							},
																							this,
																						),
																					],
																				},
																				index,
																				true,
																				{
																					fileName:
																						"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																					lineNumber: 786,
																					columnNumber: 10,
																				},
																				this,
																			),
																		),
																		/*#__PURE__*/ (0,
																		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																			"jsxDEV"
																		])(
																			"div",
																			{
																				className: "bg-border/50 mx-1 h-5 w-px",
																			},
																			void 0,
																			false,
																			{
																				fileName:
																					"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																				lineNumber: 801,
																				columnNumber: 9,
																			},
																			this,
																		),
																		/*#__PURE__*/ (0,
																		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																			"jsxDEV"
																		])(
																			"span",
																			{
																				className:
																					"text-muted-foreground text-xs font-medium tabular-nums",
																				children: [
																					selectedIds.size,
																					" selected",
																				],
																			},
																			void 0,
																			true,
																			{
																				fileName:
																					"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																				lineNumber: 802,
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
																		"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																	lineNumber: 784,
																	columnNumber: 8,
																},
																this,
															),
														],
													},
													void 0,
													true,
												),
											/*#__PURE__*/ (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"jsxDEV"
											])(
												"div",
												{
													className:
														"ml-auto flex flex-wrap items-center gap-2",
													children: [
														showRefresh &&
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"Button"
																],
																{
																	className:
																		"h-10 w-10 md:h-9 md:w-9 p-0 transition-all duration-200 hover:scale-105 active:scale-95",
																	onClick: onRefresh,
																	size: "icon",
																	title: "Refresh",
																	variant: "ghost",
																	children: /*#__PURE__*/ (0,
																	__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																		"jsxDEV"
																	])(
																		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__[
																			"RefreshCw"
																		],
																		{
																			className: "h-5 w-5 md:h-4 md:w-4",
																		},
																		void 0,
																		false,
																		{
																			fileName:
																				"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																			lineNumber: 819,
																			columnNumber: 9,
																		},
																		this,
																	),
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																	lineNumber: 812,
																	columnNumber: 8,
																},
																this,
															),
														toolbarActions,
														effectiveShowPagination &&
															!useVirtualization &&
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"Fragment"
																],
																{
																	children: [
																		/*#__PURE__*/ (0,
																		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																			"jsxDEV"
																		])(
																			"div",
																			{
																				className: "bg-border/50 h-5 w-px",
																			},
																			void 0,
																			false,
																			{
																				fileName:
																					"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																				lineNumber: 827,
																				columnNumber: 9,
																			},
																			this,
																		),
																		/*#__PURE__*/ (0,
																		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																			"jsxDEV"
																		])(
																			"div",
																			{
																				className:
																					"flex items-center gap-1 md:gap-2",
																				children: [
																					/*#__PURE__*/ (0,
																					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																						"jsxDEV"
																					])(
																						__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																							"Button"
																						],
																						{
																							className:
																								"h-10 w-10 md:h-9 md:w-9 p-0 transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100",
																							disabled: currentPage === 1,
																							onClick: handlePreviousPage,
																							size: "icon",
																							variant: "ghost",
																							children: /*#__PURE__*/ (0,
																							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																								"jsxDEV"
																							])(
																								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__[
																									"ChevronLeft"
																								],
																								{
																									className:
																										"h-5 w-5 md:h-4 md:w-4",
																								},
																								void 0,
																								false,
																								{
																									fileName:
																										"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																									lineNumber: 836,
																									columnNumber: 11,
																								},
																								this,
																							),
																						},
																						void 0,
																						false,
																						{
																							fileName:
																								"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																							lineNumber: 829,
																							columnNumber: 10,
																						},
																						this,
																					),
																					/*#__PURE__*/ (0,
																					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																						"jsxDEV"
																					])(
																						"span",
																						{
																							className:
																								"text-muted-foreground text-xs font-medium text-nowrap tabular-nums",
																							children: [
																								/*#__PURE__*/ (0,
																								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																									"jsxDEV"
																								])(
																									"span",
																									{
																										className:
																											"hidden sm:inline",
																										children: [
																											(currentPage - 1) *
																												effectiveItemsPerPage +
																												1,
																											"-",
																											Math.min(
																												currentPage *
																													effectiveItemsPerPage,
																												totalCount ||
																													filteredData.length,
																											),
																											" ",
																											"of",
																											" ",
																										],
																									},
																									void 0,
																									true,
																									{
																										fileName:
																											"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																										lineNumber: 839,
																										columnNumber: 11,
																									},
																									this,
																								),
																								(
																									totalCount ||
																									filteredData.length
																								).toLocaleString(),
																							],
																						},
																						void 0,
																						true,
																						{
																							fileName:
																								"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																							lineNumber: 838,
																							columnNumber: 10,
																						},
																						this,
																					),
																					/*#__PURE__*/ (0,
																					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																						"jsxDEV"
																					])(
																						__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																							"Button"
																						],
																						{
																							className:
																								"h-10 w-10 md:h-9 md:w-9 p-0 transition-all duration-200 hover:scale-110 active:scale-95 disabled:hover:scale-100",
																							disabled:
																								currentPage === totalPages,
																							onClick: handleNextPage,
																							size: "icon",
																							variant: "ghost",
																							children: /*#__PURE__*/ (0,
																							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																								"jsxDEV"
																							])(
																								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__[
																									"ChevronRight"
																								],
																								{
																									className:
																										"h-5 w-5 md:h-4 md:w-4",
																								},
																								void 0,
																								false,
																								{
																									fileName:
																										"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																									lineNumber: 856,
																									columnNumber: 11,
																								},
																								this,
																							),
																						},
																						void 0,
																						false,
																						{
																							fileName:
																								"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																							lineNumber: 849,
																							columnNumber: 10,
																						},
																						this,
																					),
																				],
																			},
																			void 0,
																			true,
																			{
																				fileName:
																					"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																				lineNumber: 828,
																				columnNumber: 9,
																			},
																			this,
																		),
																	],
																},
																void 0,
																true,
															),
													],
												},
												void 0,
												true,
												{
													fileName:
														"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
													lineNumber: 810,
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
											"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
										lineNumber: 754,
										columnNumber: 5,
									},
									this,
								),
								paginatedData.length > 0 &&
									(isClient && entity
										? /*#__PURE__*/ (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"jsxDEV"
											])(
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$dnd$2d$kit$2b$core$40$6$2e$3$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"DndContext"
												],
												{
													collisionDetection:
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$dnd$2d$kit$2b$core$40$6$2e$3$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
															"closestCenter"
														],
													onDragEnd: handleDragEnd,
													onDragStart: handleDragStart,
													sensors: sensors,
													children: [
														/*#__PURE__*/ (0,
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
															"jsxDEV"
														])(
															"div",
															{
																className: (0,
																__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"cn"
																])(
																	"sticky z-20 flex min-w-max items-center border-b font-semibold",
																	config.headerBg,
																	config.borderColor,
																	config.gapSize,
																	config.headerPadding,
																	config.headerTextSize,
																	"text-foreground",
																),
																style: {
																	top: `${toolbarHeight}px`,
																},
																children: [
																	enableSelection &&
																		/*#__PURE__*/ (0,
																		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																			"jsxDEV"
																		])(
																			"div",
																			{
																				className:
																					"flex w-8 shrink-0 items-center justify-center",
																				children: /*#__PURE__*/ (0,
																				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																					"jsxDEV"
																				])(
																					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																						"Checkbox"
																					],
																					{
																						"aria-label": "Select all",
																						checked: isAllSelected,
																						onCheckedChange: handleSelectAll,
																					},
																					void 0,
																					false,
																					{
																						fileName:
																							"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																						lineNumber: 887,
																						columnNumber: 11,
																					},
																					this,
																				),
																			},
																			void 0,
																			false,
																			{
																				fileName:
																					"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																				lineNumber: 886,
																				columnNumber: 10,
																			},
																			this,
																		),
																	/*#__PURE__*/ (0,
																	__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																		"jsxDEV"
																	])(
																		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$dnd$2d$kit$2b$sortable$40$10$2e$0$2e$0_$40$dnd$2d$kit$2b$core$40$6$2e$3$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																			"SortableContext"
																		],
																		{
																			items: visibleColumns.map(
																				(col) => col.key,
																			),
																			strategy:
																				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$dnd$2d$kit$2b$sortable$40$10$2e$0$2e$0_$40$dnd$2d$kit$2b$core$40$6$2e$3$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																					"horizontalListSortingStrategy"
																				],
																			children: visibleColumns.map(
																				(column, colIndex) => {
																					const isSorted =
																						sortBy === column.key;
																					return /*#__PURE__*/ (0,
																					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																						"jsxDEV"
																					])(
																						SortableColumnHeader,
																						{
																							colIndex: colIndex,
																							column: column,
																							isSorted: isSorted,
																							onSort: handleSort,
																							sortDirection: sortDirection,
																							totalColumns:
																								visibleColumns.length,
																						},
																						column.key,
																						false,
																						{
																							fileName:
																								"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																							lineNumber: 903,
																							columnNumber: 12,
																						},
																						this,
																					);
																				},
																			),
																		},
																		void 0,
																		false,
																		{
																			fileName:
																				"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																			lineNumber: 895,
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
																	"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																lineNumber: 873,
																columnNumber: 8,
															},
															this,
														),
														/*#__PURE__*/ (0,
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
															"jsxDEV"
														])(
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$dnd$2d$kit$2b$core$40$6$2e$3$2e$1_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"DragOverlay"
															],
															{
																dropAnimation: null,
																children: activeColumn
																	? /*#__PURE__*/ (0,
																		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																			"jsxDEV"
																		])(
																			"div",
																			{
																				className: `border-primary/40 bg-background/95 text-foreground ring-primary/30 flex cursor-grabbing items-center gap-1.5 overflow-hidden border px-2 py-2 text-xs font-medium shadow-2xl ring-2 backdrop-blur-sm ${activeColumn.align === "right" ? "justify-end text-right" : activeColumn.align === "center" ? "justify-center text-center" : "justify-start text-left"}`,
																				style: {
																					width: `${activeColumn.width}px`,
																				},
																				children: [
																					/*#__PURE__*/ (0,
																					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																						"jsxDEV"
																					])(
																						"span",
																						{
																							className: "truncate",
																							children:
																								activeColumn.column.header,
																						},
																						void 0,
																						false,
																						{
																							fileName:
																								"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																							lineNumber: 928,
																							columnNumber: 11,
																						},
																						this,
																					),
																					activeColumn.column.sortable &&
																						/*#__PURE__*/ (0,
																						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																							"jsxDEV"
																						])(
																							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__[
																								"ArrowUpDown"
																							],
																							{
																								className:
																									"size-3 shrink-0 opacity-50",
																							},
																							void 0,
																							false,
																							{
																								fileName:
																									"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																								lineNumber: 932,
																								columnNumber: 12,
																							},
																							this,
																						),
																				],
																			},
																			void 0,
																			true,
																			{
																				fileName:
																					"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																				lineNumber: 918,
																				columnNumber: 10,
																			},
																			this,
																		)
																	: null,
															},
															void 0,
															false,
															{
																fileName:
																	"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																lineNumber: 916,
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
														"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
													lineNumber: 867,
													columnNumber: 7,
												},
												this,
											)
										: /*#__PURE__*/ (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"jsxDEV"
											])(
												"div",
												{
													className: (0,
													__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"cn"
													])(
														"sticky z-20 flex min-w-max items-center border-b font-semibold",
														config.headerBg,
														config.borderColor,
														config.gapSize,
														config.headerPadding,
														config.headerTextSize,
														"text-foreground",
													),
													style: {
														top: `${toolbarHeight}px`,
													},
													children: [
														enableSelection &&
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"div",
																{
																	className:
																		"flex w-8 shrink-0 items-center justify-center",
																	children: /*#__PURE__*/ (0,
																	__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																		"jsxDEV"
																	])(
																		__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																			"Checkbox"
																		],
																		{
																			"aria-label": "Select all",
																			checked: isAllSelected,
																			onCheckedChange: handleSelectAll,
																		},
																		void 0,
																		false,
																		{
																			fileName:
																				"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																			lineNumber: 953,
																			columnNumber: 10,
																		},
																		this,
																	),
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																	lineNumber: 952,
																	columnNumber: 9,
																},
																this,
															),
														visibleColumns.map((column, colIndex) => {
															const widthClass = column.width || "flex-1";
															const shrinkClass = column.shrink
																? "shrink-0"
																: "";
															const alignClass =
																column.align === "right"
																	? "justify-end text-right"
																	: column.align === "center"
																		? "justify-center text-center"
																		: "justify-start text-left";
															const hideClass = column.hideOnMobile
																? "hidden md:flex"
																: "flex";
															const cellBorder =
																colIndex < visibleColumns.length - 1
																	? "border-r border-border/30"
																	: "";
															const isSorted = sortBy === column.key;
															return /*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"div",
																{
																	className: `${hideClass} ${widthClass} ${shrinkClass} ${alignClass} ${cellBorder} min-w-0 overflow-hidden px-2`,
																	children: column.sortable
																		? /*#__PURE__*/ (0,
																			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																				"jsxDEV"
																			])(
																				"button",
																				{
																					className:
																						"hover:text-foreground flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-100",
																					onClick: () => handleSort(column.key),
																					type: "button",
																					children: [
																						/*#__PURE__*/ (0,
																						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																							"jsxDEV"
																						])(
																							"span",
																							{
																								className: "font-medium",
																								children: column.header,
																							},
																							void 0,
																							false,
																							{
																								fileName:
																									"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																								lineNumber: 991,
																								columnNumber: 13,
																							},
																							this,
																						),
																						isSorted
																							? sortDirection === "asc"
																								? /*#__PURE__*/ (0,
																									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																										"jsxDEV"
																									])(
																										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__[
																											"ArrowUp"
																										],
																										{
																											className:
																												"size-3 shrink-0",
																										},
																										void 0,
																										false,
																										{
																											fileName:
																												"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																											lineNumber: 994,
																											columnNumber: 15,
																										},
																										this,
																									)
																								: /*#__PURE__*/ (0,
																									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																										"jsxDEV"
																									])(
																										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__[
																											"ArrowDown"
																										],
																										{
																											className:
																												"size-3 shrink-0",
																										},
																										void 0,
																										false,
																										{
																											fileName:
																												"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																											lineNumber: 996,
																											columnNumber: 15,
																										},
																										this,
																									)
																							: /*#__PURE__*/ (0,
																								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																									"jsxDEV"
																								])(
																									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__[
																										"ArrowUpDown"
																									],
																									{
																										className:
																											"size-3 shrink-0 opacity-40 transition-opacity group-hover:opacity-60",
																									},
																									void 0,
																									false,
																									{
																										fileName:
																											"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																										lineNumber: 999,
																										columnNumber: 14,
																									},
																									this,
																								),
																					],
																				},
																				void 0,
																				true,
																				{
																					fileName:
																						"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																					lineNumber: 986,
																					columnNumber: 12,
																				},
																				this,
																			)
																		: /*#__PURE__*/ (0,
																			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																				"jsxDEV"
																			])(
																				"span",
																				{
																					className: "font-medium",
																					children: column.header,
																				},
																				void 0,
																				false,
																				{
																					fileName:
																						"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																					lineNumber: 1003,
																					columnNumber: 12,
																				},
																				this,
																			),
																},
																column.key,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																	lineNumber: 981,
																	columnNumber: 10,
																},
																this,
															);
														}),
													],
												},
												void 0,
												true,
												{
													fileName:
														"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
													lineNumber: 939,
													columnNumber: 7,
												},
												this,
											)),
								paginatedData.length === 0
									? /*#__PURE__*/ (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"jsxDEV"
										])(
											"div",
											{
												className:
													"flex min-h-[50vh] items-center justify-center px-4 py-12 md:min-h-[60vh]",
												children: /*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													"div",
													{
														className:
															"mx-auto w-full max-w-md space-y-4 text-center",
														children: [
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"div",
																{
																	className:
																		"bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full",
																	children: emptyIcon,
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																	lineNumber: 1015,
																	columnNumber: 8,
																},
																this,
															),
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"div",
																{
																	className: "space-y-2",
																	children: [
																		/*#__PURE__*/ (0,
																		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																			"jsxDEV"
																		])(
																			"h3",
																			{
																				className: "text-lg font-semibold",
																				children: emptyMessage,
																			},
																			void 0,
																			false,
																			{
																				fileName:
																					"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																				lineNumber: 1019,
																				columnNumber: 9,
																			},
																			this,
																		),
																		searchQuery &&
																			/*#__PURE__*/ (0,
																			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																				"jsxDEV"
																			])(
																				"p",
																				{
																					className:
																						"text-muted-foreground text-sm",
																					children: [
																						'No results found for "',
																						searchQuery,
																						'". Try adjusting your search terms.',
																					],
																				},
																				void 0,
																				true,
																				{
																					fileName:
																						"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																					lineNumber: 1021,
																					columnNumber: 10,
																				},
																				this,
																			),
																		!searchQuery &&
																			/*#__PURE__*/ (0,
																			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																				"jsxDEV"
																			])(
																				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																					"Fragment"
																				],
																				{
																					children: [
																						/*#__PURE__*/ (0,
																						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																							"jsxDEV"
																						])(
																							"p",
																							{
																								className:
																									"text-muted-foreground text-sm",
																								children:
																									"Get started by creating your first item.",
																							},
																							void 0,
																							false,
																							{
																								fileName:
																									"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																								lineNumber: 1028,
																								columnNumber: 11,
																							},
																							this,
																						),
																						emptyAction &&
																							/*#__PURE__*/ (0,
																							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																								"jsxDEV"
																							])(
																								"div",
																								{
																									className:
																										"flex justify-center pt-2",
																									children: emptyAction,
																								},
																								void 0,
																								false,
																								{
																									fileName:
																										"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																									lineNumber: 1032,
																									columnNumber: 12,
																								},
																								this,
																							),
																					],
																				},
																				void 0,
																				true,
																			),
																	],
																},
																void 0,
																true,
																{
																	fileName:
																		"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																	lineNumber: 1018,
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
															"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
														lineNumber: 1014,
														columnNumber: 7,
													},
													this,
												),
											},
											void 0,
											false,
											{
												fileName:
													"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
												lineNumber: 1013,
												columnNumber: 6,
											},
											this,
										)
									: /*#__PURE__*/ (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"jsxDEV"
										])(
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"Fragment"
											],
											{
												children: [
													displayData.map(({ item }, rowIndex) => {
														const itemId = getItemId(item);
														const isSelected = selectedIds.has(itemId);
														const highlighted = isHighlighted?.(item);
														const isEvenRow = rowIndex % 2 === 0;
														const highlightClass = highlighted
															? getHighlightClass?.(item) ||
																"bg-primary/30 dark:bg-primary/10"
															: "";
														const customRowClass =
															getRowClassName?.(item) || "";
														const variantRowClass = isEvenRow
															? config.rowBg
															: config.rowBgAlt;
														const selectedClass = isSelected
															? "bg-blue-50 dark:bg-blue-950/50"
															: "";
														return /*#__PURE__*/ (0,
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
															"jsxDEV"
														])(
															"div",
															{
																className: (0,
																__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"cn"
																])(
																	"group flex min-w-max cursor-pointer items-center border-b transition-colors",
																	config.borderColor,
																	config.rowHover,
																	config.gapSize,
																	config.rowPadding,
																	variantRowClass,
																	highlightClass,
																	selectedClass,
																	customRowClass,
																),
																onClick: (e) => handleRowClick(item, e),
																children: [
																	enableSelection &&
																		/*#__PURE__*/ (0,
																		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																			"jsxDEV"
																		])(
																			"div",
																			{
																				className:
																					"flex w-8 shrink-0 items-center justify-center",
																				"data-no-row-click": true,
																				onClick: (e) => {
																					e.stopPropagation();
																					handleSelectItem(itemId, rowIndex, e);
																				},
																				children: /*#__PURE__*/ (0,
																				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																					"jsxDEV"
																				])(
																					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																						"Checkbox"
																					],
																					{
																						"aria-label": `Select item ${itemId}`,
																						checked: isSelected,
																						className: "pointer-events-none",
																					},
																					void 0,
																					false,
																					{
																						fileName:
																							"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																						lineNumber: 1084,
																						columnNumber: 12,
																					},
																					this,
																				),
																			},
																			void 0,
																			false,
																			{
																				fileName:
																					"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																				lineNumber: 1076,
																				columnNumber: 11,
																			},
																			this,
																		),
																	visibleColumns.map((column, colIndex) => {
																		const widthClass = column.width || "flex-1";
																		const shrinkClass = column.shrink
																			? "shrink-0"
																			: "";
																		const alignClass =
																			column.align === "right"
																				? "justify-end text-right"
																				: column.align === "center"
																					? "justify-center text-center"
																					: "justify-start text-left";
																		const hideClass = column.hideOnMobile
																			? "hidden md:flex"
																			: "flex";
																		const cellBorder =
																			colIndex < visibleColumns.length - 1
																				? "border-r"
																				: "";
																		return /*#__PURE__*/ (0,
																		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																			"jsxDEV"
																		])(
																			"div",
																			{
																				className: (0,
																				__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																					"cn"
																				])(
																					"min-w-0 items-center overflow-hidden",
																					hideClass,
																					widthClass,
																					shrinkClass,
																					alignClass,
																					cellBorder,
																					config.borderColor,
																					config.cellPadding,
																					config.cellTextSize,
																				),
																				children: column.render(item),
																			},
																			column.key,
																			false,
																			{
																				fileName:
																					"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																				lineNumber: 1108,
																				columnNumber: 12,
																			},
																			this,
																		);
																	}),
																],
															},
															itemId,
															true,
															{
																fileName:
																	"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																lineNumber: 1060,
																columnNumber: 9,
															},
															this,
														);
													}),
													filteredData.length > 10 &&
														/*#__PURE__*/ (0,
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
															"jsxDEV"
														])(
															"div",
															{
																className:
																	"border-border/50 from-muted/30 to-muted/50 flex flex-col items-center justify-center gap-3 border-t-2 bg-gradient-to-b py-8 text-center backdrop-blur-sm",
																children:
																	currentPage === totalPages
																		? /*#__PURE__*/ (0,
																			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																				"jsxDEV"
																			])(
																				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																					"Fragment"
																				],
																				{
																					children: [
																						/*#__PURE__*/ (0,
																						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																							"jsxDEV"
																						])(
																							"div",
																							{
																								className:
																									"flex items-center gap-2",
																								children: [
																									/*#__PURE__*/ (0,
																									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																										"jsxDEV"
																									])(
																										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__[
																											"CheckCircle2"
																										],
																										{
																											className:
																												"h-5 w-5 text-green-600 dark:text-green-500",
																										},
																										void 0,
																										false,
																										{
																											fileName:
																												"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																											lineNumber: 1136,
																											columnNumber: 12,
																										},
																										this,
																									),
																									/*#__PURE__*/ (0,
																									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																										"jsxDEV"
																									])(
																										"span",
																										{
																											className:
																												"text-foreground text-lg font-semibold",
																											children:
																												"All Data Loaded",
																										},
																										void 0,
																										false,
																										{
																											fileName:
																												"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																											lineNumber: 1137,
																											columnNumber: 12,
																										},
																										this,
																									),
																								],
																							},
																							void 0,
																							true,
																							{
																								fileName:
																									"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																								lineNumber: 1135,
																								columnNumber: 11,
																							},
																							this,
																						),
																						/*#__PURE__*/ (0,
																						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																							"jsxDEV"
																						])(
																							"p",
																							{
																								className:
																									"text-muted-foreground text-sm",
																								children: [
																									"Page ",
																									currentPage,
																									" of ",
																									totalPages,
																									" •",
																									" ",
																									(
																										totalCount ||
																										filteredData.length
																									).toLocaleString(),
																									" ",
																									"total rows",
																								],
																							},
																							void 0,
																							true,
																							{
																								fileName:
																									"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																								lineNumber: 1141,
																								columnNumber: 11,
																							},
																							this,
																						),
																					],
																				},
																				void 0,
																				true,
																			)
																		: /*#__PURE__*/ (0,
																			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																				"jsxDEV"
																			])(
																				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																					"Fragment"
																				],
																				{
																					children: [
																						/*#__PURE__*/ (0,
																						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																							"jsxDEV"
																						])(
																							"div",
																							{
																								className:
																									"flex items-center gap-2",
																								children: /*#__PURE__*/ (0,
																								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																									"jsxDEV"
																								])(
																									"span",
																									{
																										className:
																											"text-foreground text-lg font-semibold",
																										children: [
																											"Page ",
																											currentPage,
																											" of ",
																											totalPages,
																										],
																									},
																									void 0,
																									true,
																									{
																										fileName:
																											"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																										lineNumber: 1150,
																										columnNumber: 12,
																									},
																									this,
																								),
																							},
																							void 0,
																							false,
																							{
																								fileName:
																									"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																								lineNumber: 1149,
																								columnNumber: 11,
																							},
																							this,
																						),
																						/*#__PURE__*/ (0,
																						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																							"jsxDEV"
																						])(
																							"p",
																							{
																								className:
																									"text-muted-foreground text-sm",
																								children:
																									"Use pagination controls above to view more data",
																							},
																							void 0,
																							false,
																							{
																								fileName:
																									"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																								lineNumber: 1154,
																								columnNumber: 11,
																							},
																							this,
																						),
																					],
																				},
																				void 0,
																				true,
																			),
															},
															void 0,
															false,
															{
																fileName:
																	"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
																lineNumber: 1132,
																columnNumber: 8,
															},
															this,
														),
												],
											},
											void 0,
											true,
										),
							],
						},
						void 0,
						true,
						{
							fileName:
								"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
							lineNumber: 749,
							columnNumber: 4,
						},
						this,
					),
				},
				void 0,
				false,
				{
					fileName:
						"[project]/apps/admin/src/components/ui/full-width-datatable.tsx",
					lineNumber: 748,
					columnNumber: 3,
				},
				this,
			);
		}
	},
	"[project]/apps/admin/src/components/ui/status-badge.tsx [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		/**
		 * Admin Status Badge Components
		 *
		 * Simple status badges for admin panel entities.
		 */ __turbopack_context__.s([
			"AudienceTypeBadge",
			() => AudienceTypeBadge,
			"CampaignStatusBadge",
			() => CampaignStatusBadge,
			"CompanyStatusBadge",
			() => CompanyStatusBadge,
			"PlanBadge",
			() => PlanBadge,
			"SubscriptionStatusBadge",
			() => SubscriptionStatusBadge,
			"TicketStatusBadge",
			() => TicketStatusBadge,
			"UserStatusBadge",
			() => UserStatusBadge,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/index.ts [app-ssr] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/badge.tsx [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/utils.ts [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/ban.js [app-ssr] (ecmascript) <export default as Ban>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as Calendar>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pause.js [app-ssr] (ecmascript) <export default as Pause>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/send.js [app-ssr] (ecmascript) <export default as Send>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$timer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Timer$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/timer.js [app-ssr] (ecmascript) <export default as Timer>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>",
			);
		function CompanyStatusBadge({ status, className }) {
			const config = getCompanyStatusConfig(status);
			const Icon = config.icon;
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"Badge"
				],
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"cn"
					])(
						"inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium",
						config.className,
						className,
					),
					variant: config.variant,
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							Icon,
							{
								className: "h-3 w-3",
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/components/ui/status-badge.tsx",
								lineNumber: 47,
								columnNumber: 4,
							},
							this,
						),
						config.label,
					],
				},
				void 0,
				true,
				{
					fileName: "[project]/apps/admin/src/components/ui/status-badge.tsx",
					lineNumber: 39,
					columnNumber: 3,
				},
				this,
			);
		}
		function getCompanyStatusConfig(status) {
			switch (status?.toLowerCase()) {
				case "active":
					return {
						label: "Active",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__[
							"CheckCircle"
						],
						className:
							"bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
						variant: "outline",
					};
				case "trial":
					return {
						label: "Trial",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$timer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Timer$3e$__[
							"Timer"
						],
						className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
						variant: "outline",
					};
				case "suspended":
					return {
						label: "Suspended",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__[
							"Pause"
						],
						className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
						variant: "outline",
					};
				case "cancelled":
				case "canceled":
					return {
						label: "Cancelled",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__[
							"Ban"
						],
						className: "bg-red-500/10 text-red-600 border-red-500/20",
						variant: "outline",
					};
				default:
					return {
						label: status || "Unknown",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__[
							"AlertCircle"
						],
						className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
						variant: "outline",
					};
			}
		}
		function SubscriptionStatusBadge({ status, className }) {
			const config = getSubscriptionStatusConfig(status);
			const Icon = config.icon;
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"Badge"
				],
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"cn"
					])(
						"inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium",
						config.className,
						className,
					),
					variant: config.variant,
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							Icon,
							{
								className: "h-3 w-3",
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/components/ui/status-badge.tsx",
								lineNumber: 121,
								columnNumber: 4,
							},
							this,
						),
						config.label,
					],
				},
				void 0,
				true,
				{
					fileName: "[project]/apps/admin/src/components/ui/status-badge.tsx",
					lineNumber: 113,
					columnNumber: 3,
				},
				this,
			);
		}
		function getSubscriptionStatusConfig(status) {
			switch (status?.toLowerCase()) {
				case "active":
					return {
						label: "Active",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__[
							"CheckCircle"
						],
						className:
							"bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
						variant: "outline",
					};
				case "trialing":
					return {
						label: "Trialing",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$timer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Timer$3e$__[
							"Timer"
						],
						className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
						variant: "outline",
					};
				case "past_due":
					return {
						label: "Past Due",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__[
							"AlertCircle"
						],
						className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
						variant: "outline",
					};
				case "cancelled":
				case "canceled":
					return {
						label: "Cancelled",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__[
							"Ban"
						],
						className: "bg-red-500/10 text-red-600 border-red-500/20",
						variant: "outline",
					};
				case "paused":
					return {
						label: "Paused",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__[
							"Pause"
						],
						className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
						variant: "outline",
					};
				default:
					return {
						label: status || "Unknown",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__[
							"AlertCircle"
						],
						className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
						variant: "outline",
					};
			}
		}
		function UserStatusBadge({ status, className }) {
			const config = getUserStatusConfig(status);
			const Icon = config.icon;
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"Badge"
				],
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"cn"
					])(
						"inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium",
						config.className,
						className,
					),
					variant: config.variant,
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							Icon,
							{
								className: "h-3 w-3",
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/components/ui/status-badge.tsx",
								lineNumber: 202,
								columnNumber: 4,
							},
							this,
						),
						config.label,
					],
				},
				void 0,
				true,
				{
					fileName: "[project]/apps/admin/src/components/ui/status-badge.tsx",
					lineNumber: 194,
					columnNumber: 3,
				},
				this,
			);
		}
		function getUserStatusConfig(status) {
			switch (status?.toLowerCase()) {
				case "active":
					return {
						label: "Active",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__[
							"CheckCircle"
						],
						className:
							"bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
						variant: "outline",
					};
				case "pending":
					return {
						label: "Pending",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__[
							"Clock"
						],
						className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
						variant: "outline",
					};
				case "suspended":
					return {
						label: "Suspended",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__[
							"Pause"
						],
						className: "bg-red-500/10 text-red-600 border-red-500/20",
						variant: "outline",
					};
				case "inactive":
					return {
						label: "Inactive",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__[
							"Ban"
						],
						className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
						variant: "outline",
					};
				default:
					return {
						label: status || "Unknown",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__[
							"AlertCircle"
						],
						className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
						variant: "outline",
					};
			}
		}
		function TicketStatusBadge({ status, className }) {
			const config = getTicketStatusConfig(status);
			const Icon = config.icon;
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"Badge"
				],
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"cn"
					])(
						"inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium",
						config.className,
						className,
					),
					variant: config.variant,
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							Icon,
							{
								className: "h-3 w-3",
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/components/ui/status-badge.tsx",
								lineNumber: 275,
								columnNumber: 4,
							},
							this,
						),
						config.label,
					],
				},
				void 0,
				true,
				{
					fileName: "[project]/apps/admin/src/components/ui/status-badge.tsx",
					lineNumber: 267,
					columnNumber: 3,
				},
				this,
			);
		}
		function getTicketStatusConfig(status) {
			switch (status?.toLowerCase()) {
				case "open":
					return {
						label: "Open",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__[
							"AlertCircle"
						],
						className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
						variant: "outline",
					};
				case "in_progress":
					return {
						label: "In Progress",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__[
							"Clock"
						],
						className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
						variant: "outline",
					};
				case "resolved":
					return {
						label: "Resolved",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__[
							"CheckCircle"
						],
						className:
							"bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
						variant: "outline",
					};
				case "closed":
					return {
						label: "Closed",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__[
							"Ban"
						],
						className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
						variant: "outline",
					};
				default:
					return {
						label: status || "Unknown",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__[
							"AlertCircle"
						],
						className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
						variant: "outline",
					};
			}
		}
		function PlanBadge({ plan, className }) {
			const config = getPlanConfig(plan);
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"Badge"
				],
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"cn"
					])(
						"px-2 py-0.5 text-[11px] font-medium",
						config.className,
						className,
					),
					variant: config.variant,
					children: config.label,
				},
				void 0,
				false,
				{
					fileName: "[project]/apps/admin/src/components/ui/status-badge.tsx",
					lineNumber: 339,
					columnNumber: 3,
				},
				this,
			);
		}
		function getPlanConfig(plan) {
			switch (plan?.toLowerCase()) {
				case "starter":
					return {
						label: "Starter",
						className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
						variant: "outline",
					};
				case "professional":
				case "pro":
					return {
						label: "Professional",
						className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
						variant: "outline",
					};
				case "enterprise":
					return {
						label: "Enterprise",
						className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
						variant: "outline",
					};
				default:
					return {
						label: plan || "Free",
						className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
						variant: "outline",
					};
			}
		}
		function CampaignStatusBadge({ status, className }) {
			const config = getCampaignStatusConfig(status);
			const Icon = config.icon;
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"Badge"
				],
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"cn"
					])(
						"inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium",
						config.className,
						className,
					),
					variant: config.variant,
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							Icon,
							{
								className: "h-3 w-3",
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/components/ui/status-badge.tsx",
								lineNumber: 408,
								columnNumber: 4,
							},
							this,
						),
						config.label,
					],
				},
				void 0,
				true,
				{
					fileName: "[project]/apps/admin/src/components/ui/status-badge.tsx",
					lineNumber: 400,
					columnNumber: 3,
				},
				this,
			);
		}
		function getCampaignStatusConfig(status) {
			switch (status?.toLowerCase()) {
				case "draft":
					return {
						label: "Draft",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__[
							"FileText"
						],
						className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
						variant: "outline",
					};
				case "scheduled":
					return {
						label: "Scheduled",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__[
							"Calendar"
						],
						className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
						variant: "outline",
					};
				case "sending":
					return {
						label: "Sending",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__[
							"Loader2"
						],
						className:
							"bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse",
						variant: "outline",
					};
				case "sent":
					return {
						label: "Sent",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__[
							"CheckCircle"
						],
						className:
							"bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
						variant: "outline",
					};
				case "paused":
					return {
						label: "Paused",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__[
							"Pause"
						],
						className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
						variant: "outline",
					};
				case "cancelled":
				case "canceled":
					return {
						label: "Cancelled",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__[
							"XCircle"
						],
						className: "bg-red-500/10 text-red-600 border-red-500/20",
						variant: "outline",
					};
				default:
					return {
						label: status || "Unknown",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__[
							"AlertCircle"
						],
						className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
						variant: "outline",
					};
			}
		}
		function AudienceTypeBadge({ audienceType, className }) {
			const config = getAudienceTypeConfig(audienceType);
			const Icon = config.icon;
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"Badge"
				],
				{
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"cn"
					])(
						"inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium",
						config.className,
						className,
					),
					variant: config.variant,
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							Icon,
							{
								className: "h-3 w-3",
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/components/ui/status-badge.tsx",
								lineNumber: 496,
								columnNumber: 4,
							},
							this,
						),
						config.label,
					],
				},
				void 0,
				true,
				{
					fileName: "[project]/apps/admin/src/components/ui/status-badge.tsx",
					lineNumber: 488,
					columnNumber: 3,
				},
				this,
			);
		}
		function getAudienceTypeConfig(audienceType) {
			switch (audienceType?.toLowerCase()) {
				case "all_users":
					return {
						label: "All Users",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__[
							"Mail"
						],
						className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
						variant: "outline",
					};
				case "all_companies":
					return {
						label: "All Companies",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__[
							"Mail"
						],
						className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
						variant: "outline",
					};
				case "waitlist":
					return {
						label: "Waitlist",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__[
							"Clock"
						],
						className:
							"bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
						variant: "outline",
					};
				case "segment":
					return {
						label: "Segment",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__[
							"Send"
						],
						className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
						variant: "outline",
					};
				case "custom":
					return {
						label: "Custom",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__[
							"FileText"
						],
						className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
						variant: "outline",
					};
				default:
					return {
						label: audienceType || "Unknown",
						icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__[
							"AlertCircle"
						],
						className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
						variant: "outline",
					};
			}
		}
	},
	"[project]/apps/admin/src/lib/formatters.ts [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		/**
		 * Admin Formatters
		 *
		 * Utility functions for formatting values in admin tables.
		 */ /**
		 * Format currency values
		 */ __turbopack_context__.s([
			"formatCurrency",
			() => formatCurrency,
			"formatDate",
			() => formatDate,
			"formatNumber",
			() => formatNumber,
			"formatPercent",
			() => formatPercent,
			"formatRate",
			() => formatRate,
			"formatRelativeTime",
			() => formatRelativeTime,
		]);
		function formatCurrency(value, options) {
			if (value === null || value === undefined) {
				return "—";
			}
			const decimals = options?.decimals ?? 2;
			return new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
				minimumFractionDigits: decimals,
				maximumFractionDigits: decimals,
			}).format(value);
		}
		function formatDate(value, format = "medium") {
			if (!value) {
				return "—";
			}
			try {
				const date = typeof value === "string" ? new Date(value) : value;
				if (Number.isNaN(date.getTime())) {
					return "—";
				}
				const formatOptions = {
					short: {
						month: "short",
						day: "numeric",
					},
					medium: {
						month: "short",
						day: "numeric",
						year: "numeric",
					},
					long: {
						month: "long",
						day: "numeric",
						year: "numeric",
						hour: "numeric",
						minute: "2-digit",
					},
				};
				const options = formatOptions[format];
				return new Intl.DateTimeFormat("en-US", options).format(date);
			} catch {
				return "—";
			}
		}
		function formatRelativeTime(value) {
			if (!value) {
				return "—";
			}
			try {
				const date = typeof value === "string" ? new Date(value) : value;
				if (Number.isNaN(date.getTime())) {
					return "—";
				}
				const now = new Date();
				const diffMs = now.getTime() - date.getTime();
				const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
				if (diffDays === 0) {
					return "Today";
				}
				if (diffDays === 1) {
					return "Yesterday";
				}
				if (diffDays < 7) {
					return `${diffDays} days ago`;
				}
				if (diffDays < 30) {
					const weeks = Math.floor(diffDays / 7);
					return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
				}
				if (diffDays < 365) {
					const months = Math.floor(diffDays / 30);
					return `${months} month${months > 1 ? "s" : ""} ago`;
				}
				const years = Math.floor(diffDays / 365);
				return `${years} year${years > 1 ? "s" : ""} ago`;
			} catch {
				return "—";
			}
		}
		function formatNumber(value, options) {
			if (value === null || value === undefined) {
				return "—";
			}
			if (options?.compact && value >= 1000) {
				return new Intl.NumberFormat("en-US", {
					notation: "compact",
					maximumFractionDigits: 1,
				}).format(value);
			}
			return new Intl.NumberFormat("en-US").format(value);
		}
		function formatPercent(value, options) {
			if (value === null || value === undefined) {
				return "—";
			}
			const decimals = options?.decimals ?? 1;
			return `${value.toFixed(decimals)}%`;
		}
		function formatRate(numerator, denominator, options) {
			if (denominator === 0) {
				return "0%";
			}
			const rate = (numerator / denominator) * 100;
			return formatPercent(rate, options);
		}
	},
	"[project]/apps/admin/src/components/marketing/campaigns-table.tsx [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["CampaignsTable", () => CampaignsTable]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)",
			);
		/**
		 * CampaignsTable Component
		 *
		 * Admin datatable for managing email marketing campaigns.
		 * Displays campaign stats including open rates, click rates, and revenue.
		 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$archive$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Archive$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/archive.js [app-ssr] (ecmascript) <export default as Archive>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-ssr] (ecmascript) <export default as BarChart3>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript) <export default as Copy>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-ssr] (ecmascript) <export default as Edit>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/pause.js [app-ssr] (ecmascript) <export default as Pause>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/play.js [app-ssr] (ecmascript) <export default as Play>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/send.js [app-ssr] (ecmascript) <export default as Send>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/index.ts [app-ssr] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/button.tsx [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$row$2d$actions$2d$dropdown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/row-actions-dropdown.tsx [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$full$2d$width$2d$datatable$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/components/ui/full-width-datatable.tsx [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/components/ui/status-badge.tsx [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/lib/formatters.ts [app-ssr] (ecmascript)",
			);
		("use client");
		function CampaignsTable({
			campaigns,
			itemsPerPage = 50,
			totalCount,
			currentPage = 1,
			onCampaignClick,
			onDuplicate,
			onPause,
			onResume,
			onDelete,
			onSend,
			showRefresh = false,
			initialSearchQuery = "",
		}) {
			const columns = [
				{
					key: "name",
					header: "Campaign",
					width: "flex-1",
					render: (campaign) =>
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"default"
							],
							{
								className: "block min-w-0",
								href: `/dashboard/marketing/campaigns/${campaign.id}`,
								onClick: (e) => e.stopPropagation(),
								children: /*#__PURE__*/ (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
									"jsxDEV"
								])(
									"div",
									{
										className: "flex items-center gap-3",
										children: [
											/*#__PURE__*/ (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"jsxDEV"
											])(
												"div",
												{
													className:
														"bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
													children: /*#__PURE__*/ (0,
													__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"jsxDEV"
													])(
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__[
															"Mail"
														],
														{
															className: "text-muted-foreground h-4 w-4",
														},
														void 0,
														false,
														{
															fileName:
																"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
															lineNumber: 81,
															columnNumber: 8,
														},
														this,
													),
												},
												void 0,
												false,
												{
													fileName:
														"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
													lineNumber: 80,
													columnNumber: 7,
												},
												this,
											),
											/*#__PURE__*/ (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"jsxDEV"
											])(
												"div",
												{
													className: "min-w-0",
													children: [
														/*#__PURE__*/ (0,
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
															"jsxDEV"
														])(
															"div",
															{
																className:
																	"truncate text-sm font-medium hover:underline",
																children: campaign.name,
															},
															void 0,
															false,
															{
																fileName:
																	"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
																lineNumber: 84,
																columnNumber: 8,
															},
															this,
														),
														/*#__PURE__*/ (0,
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
															"jsxDEV"
														])(
															"div",
															{
																className:
																	"text-muted-foreground truncate text-xs",
																children: campaign.subject,
															},
															void 0,
															false,
															{
																fileName:
																	"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
																lineNumber: 87,
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
														"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
													lineNumber: 83,
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
											"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
										lineNumber: 79,
										columnNumber: 6,
									},
									this,
								),
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
								lineNumber: 74,
								columnNumber: 5,
							},
							this,
						),
				},
				{
					key: "status",
					header: "Status",
					width: "w-28",
					shrink: true,
					hideable: false,
					render: (campaign) =>
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"CampaignStatusBadge"
							],
							{
								status: campaign.status,
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
								lineNumber: 101,
								columnNumber: 26,
							},
							this,
						),
				},
				{
					key: "audience",
					header: "Audience",
					width: "w-32",
					shrink: true,
					hideOnMobile: true,
					hideable: true,
					render: (campaign) =>
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: "flex flex-col gap-1",
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$status$2d$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"AudienceTypeBadge"
										],
										{
											audienceType: campaign.audienceType,
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
											lineNumber: 112,
											columnNumber: 6,
										},
										this,
									),
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"span",
										{
											className:
												"text-muted-foreground flex items-center gap-1 text-[10px]",
											children: [
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__[
														"Users"
													],
													{
														className: "h-3 w-3",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
														lineNumber: 114,
														columnNumber: 7,
													},
													this,
												),
												(0,
												__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"formatNumber"
												])(campaign.totalRecipients),
											],
										},
										void 0,
										true,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
											lineNumber: 113,
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
									"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
								lineNumber: 111,
								columnNumber: 5,
							},
							this,
						),
				},
				{
					key: "delivered",
					header: "Delivered",
					width: "w-24",
					shrink: true,
					align: "right",
					hideOnMobile: true,
					hideable: true,
					render: (campaign) =>
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: "text-right",
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"span",
										{
											className: "font-mono text-sm tabular-nums",
											children: (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"formatNumber"
											])(campaign.deliveredCount),
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
											lineNumber: 130,
											columnNumber: 6,
										},
										this,
									),
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"span",
										{
											className: "text-muted-foreground block text-[10px]",
											children: (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"formatRate"
											])(campaign.deliveredCount, campaign.sentCount),
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
											lineNumber: 133,
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
									"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
								lineNumber: 129,
								columnNumber: 5,
							},
							this,
						),
				},
				{
					key: "opens",
					header: "Opens",
					width: "w-24",
					shrink: true,
					align: "right",
					hideOnMobile: true,
					hideable: true,
					render: (campaign) =>
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: "text-right",
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"span",
										{
											className: "font-mono text-sm tabular-nums",
											children: (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"formatNumber"
											])(campaign.uniqueOpens),
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
											lineNumber: 149,
											columnNumber: 6,
										},
										this,
									),
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"span",
										{
											className: "text-muted-foreground block text-[10px]",
											children: (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"formatRate"
											])(campaign.uniqueOpens, campaign.deliveredCount),
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
											lineNumber: 152,
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
									"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
								lineNumber: 148,
								columnNumber: 5,
							},
							this,
						),
				},
				{
					key: "clicks",
					header: "Clicks",
					width: "w-24",
					shrink: true,
					align: "right",
					hideOnMobile: true,
					hideable: true,
					render: (campaign) =>
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: "text-right",
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"span",
										{
											className: "font-mono text-sm tabular-nums",
											children: (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"formatNumber"
											])(campaign.uniqueClicks),
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
											lineNumber: 168,
											columnNumber: 6,
										},
										this,
									),
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"span",
										{
											className: "text-muted-foreground block text-[10px]",
											children: (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"formatRate"
											])(campaign.uniqueClicks, campaign.deliveredCount),
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
											lineNumber: 171,
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
									"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
								lineNumber: 167,
								columnNumber: 5,
							},
							this,
						),
				},
				{
					key: "revenue",
					header: "Revenue",
					width: "w-28",
					shrink: true,
					align: "right",
					hideOnMobile: true,
					hideable: true,
					render: (campaign) =>
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"span",
							{
								className: "font-mono text-sm tabular-nums text-emerald-600",
								children: (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
									"formatCurrency"
								])(campaign.revenueAttributed, {
									decimals: 0,
								}),
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
								lineNumber: 186,
								columnNumber: 5,
							},
							this,
						),
				},
				{
					key: "date",
					header: "Date",
					width: "w-28",
					shrink: true,
					hideOnMobile: true,
					hideable: true,
					render: (campaign) => {
						const displayDate =
							campaign.sentAt || campaign.scheduledFor || campaign.createdAt;
						const label = campaign.sentAt
							? "Sent"
							: campaign.scheduledFor
								? "Scheduled"
								: "Created";
						return /*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: "text-right",
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"span",
										{
											className: "text-muted-foreground text-sm tabular-nums",
											children: (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$formatters$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"formatDate"
											])(displayDate, "short"),
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
											lineNumber: 207,
											columnNumber: 7,
										},
										this,
									),
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"span",
										{
											className: "text-muted-foreground block text-[10px]",
											children: label,
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
											lineNumber: 210,
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
									"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
								lineNumber: 206,
								columnNumber: 6,
							},
							this,
						);
					},
				},
				{
					key: "actions",
					header: "",
					width: "w-10",
					shrink: true,
					render: (campaign) => {
						const actions = [
							{
								label: "View Details",
								icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__[
									"Eye"
								],
								href: `/dashboard/marketing/campaigns/${campaign.id}`,
							},
							{
								label: "View Analytics",
								icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__[
									"BarChart3"
								],
								href: `/dashboard/marketing/campaigns/${campaign.id}/analytics`,
							},
						];
						// Add edit for draft campaigns
						if (campaign.status === "draft") {
							actions.push({
								label: "Edit Campaign",
								icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__[
									"Edit"
								],
								href: `/dashboard/marketing/campaigns/${campaign.id}/edit`,
							});
						}
						// Add send action for draft campaigns
						if (campaign.status === "draft" && onSend) {
							actions.push({
								label: "Send Now",
								icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__[
									"Send"
								],
								onClick: () => onSend(campaign),
								separatorBefore: true,
							});
						}
						// Add pause/resume for sending campaigns
						if (campaign.status === "sending" && onPause) {
							actions.push({
								label: "Pause Sending",
								icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__[
									"Pause"
								],
								onClick: () => onPause(campaign),
								separatorBefore: true,
							});
						}
						if (campaign.status === "paused" && onResume) {
							actions.push({
								label: "Resume Sending",
								icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__[
									"Play"
								],
								onClick: () => onResume(campaign),
								separatorBefore: true,
							});
						}
						// Always show duplicate
						if (onDuplicate) {
							actions.push({
								label: "Duplicate",
								icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__[
									"Copy"
								],
								onClick: () => onDuplicate(campaign),
								separatorBefore: !actions.some((a) => a.separatorBefore),
							});
						}
						// Add delete for draft campaigns
						if (campaign.status === "draft" && onDelete) {
							actions.push({
								label: "Delete",
								icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__[
									"Trash2"
								],
								variant: "destructive",
								onClick: () => onDelete(campaign),
								separatorBefore: true,
							});
						}
						return /*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$row$2d$actions$2d$dropdown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"RowActionsDropdown"
							],
							{
								actions: actions,
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
								lineNumber: 301,
								columnNumber: 12,
							},
							this,
						);
					},
				},
			];
			const bulkActions = [
				{
					label: "Archive Selected",
					icon: /*#__PURE__*/ (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"jsxDEV"
					])(
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$archive$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Archive$3e$__[
							"Archive"
						],
						{
							className: "h-4 w-4",
						},
						void 0,
						false,
						{
							fileName:
								"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
							lineNumber: 309,
							columnNumber: 10,
						},
						this,
					),
					onClick: (selectedIds) => {
						console.log("Archive campaigns:", selectedIds);
					},
					variant: "destructive",
				},
			];
			const handleRowClick = (campaign) => {
				if (onCampaignClick) {
					onCampaignClick(campaign);
				} else {
					window.location.href = `/dashboard/marketing/campaigns/${campaign.id}`;
				}
			};
			const handleRefresh = () => {
				window.location.reload();
			};
			const handleAddCampaign = () => {
				window.location.href = "/dashboard/marketing/campaigns/new";
			};
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$full$2d$width$2d$datatable$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"FullWidthDataTable"
				],
				{
					bulkActions: bulkActions,
					columns: columns,
					data: campaigns,
					totalCount: totalCount,
					currentPageFromServer: currentPage,
					initialSearchQuery: initialSearchQuery,
					serverPagination: true,
					emptyAction: /*#__PURE__*/ (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"jsxDEV"
					])(
						__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"Button"
						],
						{
							onClick: handleAddCampaign,
							size: "sm",
							children: [
								/*#__PURE__*/ (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
									"jsxDEV"
								])(
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__[
										"Plus"
									],
									{
										className: "mr-2 size-4",
									},
									void 0,
									false,
									{
										fileName:
											"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
										lineNumber: 344,
										columnNumber: 6,
									},
									void 0,
								),
								"Create Campaign",
							],
						},
						void 0,
						true,
						{
							fileName:
								"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
							lineNumber: 343,
							columnNumber: 5,
						},
						void 0,
					),
					emptyIcon: /*#__PURE__*/ (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"jsxDEV"
					])(
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__[
							"Mail"
						],
						{
							className: "text-muted-foreground h-8 w-8",
						},
						void 0,
						false,
						{
							fileName:
								"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
							lineNumber: 348,
							columnNumber: 15,
						},
						void 0,
					),
					emptyMessage: "No campaigns found",
					enableSelection: true,
					entity: "email-campaigns",
					getItemId: (campaign) => campaign.id,
					itemsPerPage: itemsPerPage,
					onRefresh: handleRefresh,
					onRowClick: handleRowClick,
					serverSearch: true,
					searchParamKey: "search",
					searchPlaceholder: "Search campaigns by name, subject...",
					showRefresh: showRefresh,
				},
				void 0,
				false,
				{
					fileName:
						"[project]/apps/admin/src/components/marketing/campaigns-table.tsx",
					lineNumber: 334,
					columnNumber: 3,
				},
				this,
			);
		}
	},
];

//# sourceMappingURL=apps_admin_src_dd831740._.js.map
