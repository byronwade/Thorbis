module.exports = [
	"[project]/apps/admin/src/lib/stores/campaign-store.ts [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		/**
		 * Email Campaign Store - Zustand state management
		 *
		 * Manages campaign state for the admin marketing panel:
		 * - Campaign list with filtering/sorting
		 * - Selected campaign for detail view
		 * - Campaign builder wizard state
		 * - Sending progress tracking
		 * - Audience preview state
		 */ __turbopack_context__.s([
			"useBuilderIsDirty",
			() => useBuilderIsDirty,
			"useCampaignStats",
			() => useCampaignStats,
			"useCampaignStore",
			() => useCampaignStore,
			"useFilteredCampaigns",
			() => useFilteredCampaigns,
			"useSelectedCampaign",
			() => useSelectedCampaign,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/zustand@5.0.8_@types+react@19.2.2_immer@10.2.0_react@19.2.0_use-sync-external-store@1.6.0_react@19.2.0_/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)",
			);
		const defaultDraft = {
			name: "",
			subject: "",
			previewText: "",
			audienceType: "waitlist",
			audienceFilter: {
				excludeUnsubscribed: true,
				excludeBounced: true,
				excludeComplained: true,
			},
			fromName: "Thorbis",
			fromEmail: "noreply@thorbis.com",
			tags: [],
		};
		const useCampaignStore = (0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$8_$40$types$2b$react$40$19$2e$2$2e$2_immer$40$10$2e$2$2e$0_react$40$19$2e$2$2e$0_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$0_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
			"create"
		])((set, get) => ({
			// -------------------------------------------------------------------------
			// Campaign List State
			// -------------------------------------------------------------------------
			campaigns: [],
			setCampaigns: (campaigns) =>
				set({
					campaigns,
				}),
			addCampaign: (campaign) =>
				set((state) => ({
					campaigns: [campaign, ...state.campaigns],
				})),
			updateCampaign: (id, updates) =>
				set((state) => ({
					campaigns: state.campaigns.map((c) =>
						c.id === id
							? {
									...c,
									...updates,
								}
							: c,
					),
				})),
			removeCampaign: (id) =>
				set((state) => ({
					campaigns: state.campaigns.filter((c) => c.id !== id),
					selectedCampaignId:
						state.selectedCampaignId === id ? null : state.selectedCampaignId,
				})),
			isLoading: false,
			setIsLoading: (isLoading) =>
				set({
					isLoading,
				}),
			error: null,
			setError: (error) =>
				set({
					error,
				}),
			// -------------------------------------------------------------------------
			// Selection State
			// -------------------------------------------------------------------------
			selectedCampaignId: null,
			setSelectedCampaignId: (id) =>
				set({
					selectedCampaignId: id,
				}),
			// -------------------------------------------------------------------------
			// Filters & Sorting
			// -------------------------------------------------------------------------
			filters: {},
			setFilters: (filters) =>
				set((state) => ({
					filters: {
						...state.filters,
						...filters,
					},
				})),
			resetFilters: () =>
				set({
					filters: {},
				}),
			sortField: "createdAt",
			sortDirection: "desc",
			setSort: (field, direction) =>
				set((state) => ({
					sortField: field,
					sortDirection:
						direction ??
						(state.sortField === field && state.sortDirection === "asc"
							? "desc"
							: "asc"),
				})),
			// -------------------------------------------------------------------------
			// Campaign Builder State
			// -------------------------------------------------------------------------
			builder: {
				isOpen: false,
				currentStep: "details",
				draft: {
					...defaultDraft,
				},
				isDirty: false,
				validationErrors: {},
			},
			openBuilder: (campaignId) => {
				const { campaigns } = get();
				const existingCampaign = campaignId
					? campaigns.find((c) => c.id === campaignId)
					: null;
				if (existingCampaign) {
					// Load existing campaign into draft
					set({
						builder: {
							isOpen: true,
							currentStep: "details",
							editingCampaignId: campaignId,
							isDirty: false,
							validationErrors: {},
							draft: {
								name: existingCampaign.name,
								subject: existingCampaign.subject,
								previewText: existingCampaign.previewText || "",
								templateId: existingCampaign.templateId,
								templateData: existingCampaign.templateData,
								htmlContent: existingCampaign.htmlContent,
								plainTextContent: existingCampaign.plainTextContent,
								audienceType: existingCampaign.audienceType,
								audienceFilter:
									existingCampaign.audienceFilter ||
									defaultDraft.audienceFilter,
								fromName: existingCampaign.fromName,
								fromEmail: existingCampaign.fromEmail,
								replyTo: existingCampaign.replyTo,
								tags: existingCampaign.tags,
								notes: existingCampaign.notes,
								scheduledFor: existingCampaign.scheduledFor,
							},
						},
					});
				} else {
					// New campaign
					set({
						builder: {
							isOpen: true,
							currentStep: "details",
							draft: {
								...defaultDraft,
							},
							isDirty: false,
							validationErrors: {},
						},
					});
				}
			},
			closeBuilder: () =>
				set({
					builder: {
						isOpen: false,
						currentStep: "details",
						draft: {
							...defaultDraft,
						},
						isDirty: false,
						validationErrors: {},
					},
				}),
			setBuilderStep: (step) =>
				set((state) => ({
					builder: {
						...state.builder,
						currentStep: step,
					},
				})),
			updateDraft: (updates) =>
				set((state) => ({
					builder: {
						...state.builder,
						draft: {
							...state.builder.draft,
							...updates,
						},
						isDirty: true,
					},
				})),
			setValidationErrors: (errors) =>
				set((state) => ({
					builder: {
						...state.builder,
						validationErrors: errors,
					},
				})),
			clearValidationError: (field) =>
				set((state) => {
					const { [field]: _, ...rest } = state.builder.validationErrors;
					return {
						builder: {
							...state.builder,
							validationErrors: rest,
						},
					};
				}),
			resetBuilder: () =>
				set({
					builder: {
						isOpen: false,
						currentStep: "details",
						draft: {
							...defaultDraft,
						},
						isDirty: false,
						validationErrors: {},
					},
				}),
			// -------------------------------------------------------------------------
			// Audience Preview State
			// -------------------------------------------------------------------------
			audiencePreview: {
				isLoading: false,
				estimatedCount: 0,
				sampleRecipients: [],
			},
			setAudiencePreview: (preview) =>
				set((state) => ({
					audiencePreview: {
						...state.audiencePreview,
						...preview,
					},
				})),
			resetAudiencePreview: () =>
				set({
					audiencePreview: {
						isLoading: false,
						estimatedCount: 0,
						sampleRecipients: [],
					},
				}),
			// -------------------------------------------------------------------------
			// Sending Progress State
			// -------------------------------------------------------------------------
			sendingProgress: null,
			setSendingProgress: (progress) =>
				set({
					sendingProgress: progress,
				}),
			updateSendingProgress: (updates) =>
				set((state) => ({
					sendingProgress: state.sendingProgress
						? {
								...state.sendingProgress,
								...updates,
							}
						: null,
				})),
			// -------------------------------------------------------------------------
			// Waitlist Stats
			// -------------------------------------------------------------------------
			waitlistStats: null,
			setWaitlistStats: (stats) =>
				set({
					waitlistStats: stats,
				}),
			// -------------------------------------------------------------------------
			// UI State
			// -------------------------------------------------------------------------
			activeTab: "campaigns",
			setActiveTab: (tab) =>
				set({
					activeTab: tab,
				}),
			previewCampaignId: null,
			setPreviewCampaignId: (id) =>
				set({
					previewCampaignId: id,
				}),
			deletingCampaignId: null,
			setDeletingCampaignId: (id) =>
				set({
					deletingCampaignId: id,
				}),
		}));
		const useFilteredCampaigns = () => {
			return useCampaignStore((state) => {
				let filtered = [...state.campaigns];
				// Apply filters
				if (state.filters.status?.length) {
					filtered = filtered.filter((c) =>
						state.filters.status.includes(c.status),
					);
				}
				if (state.filters.audienceType?.length) {
					filtered = filtered.filter((c) =>
						state.filters.audienceType.includes(c.audienceType),
					);
				}
				if (state.filters.search) {
					const search = state.filters.search.toLowerCase();
					filtered = filtered.filter(
						(c) =>
							c.name.toLowerCase().includes(search) ||
							c.subject.toLowerCase().includes(search) ||
							c.tags.some((t) => t.toLowerCase().includes(search)),
					);
				}
				if (state.filters.tags?.length) {
					filtered = filtered.filter((c) =>
						state.filters.tags.some((t) => c.tags.includes(t)),
					);
				}
				if (state.filters.dateRange) {
					const { start, end } = state.filters.dateRange;
					filtered = filtered.filter((c) => {
						const date = new Date(c.createdAt);
						return date >= new Date(start) && date <= new Date(end);
					});
				}
				// Apply sorting
				filtered.sort((a, b) => {
					let aVal;
					let bVal;
					switch (state.sortField) {
						case "name":
							aVal = a.name.toLowerCase();
							bVal = b.name.toLowerCase();
							break;
						case "status":
							aVal = a.status;
							bVal = b.status;
							break;
						case "createdAt":
							aVal = a.createdAt;
							bVal = b.createdAt;
							break;
						case "scheduledFor":
							aVal = a.scheduledFor || "";
							bVal = b.scheduledFor || "";
							break;
						case "sentAt":
							aVal = a.sentAt || "";
							bVal = b.sentAt || "";
							break;
						case "openRate":
							aVal =
								a.totalRecipients > 0 ? a.uniqueOpens / a.totalRecipients : 0;
							bVal =
								b.totalRecipients > 0 ? b.uniqueOpens / b.totalRecipients : 0;
							break;
						case "clickRate":
							aVal =
								a.totalRecipients > 0 ? a.uniqueClicks / a.totalRecipients : 0;
							bVal =
								b.totalRecipients > 0 ? b.uniqueClicks / b.totalRecipients : 0;
							break;
						default:
							aVal = a.createdAt;
							bVal = b.createdAt;
					}
					if (aVal === undefined || bVal === undefined) return 0;
					if (aVal < bVal) return state.sortDirection === "asc" ? -1 : 1;
					if (aVal > bVal) return state.sortDirection === "asc" ? 1 : -1;
					return 0;
				});
				return filtered;
			});
		};
		const useSelectedCampaign = () => {
			return useCampaignStore((state) =>
				state.selectedCampaignId
					? state.campaigns.find((c) => c.id === state.selectedCampaignId) ||
						null
					: null,
			);
		};
		const useCampaignStats = () => {
			return useCampaignStore((state) => {
				const campaigns = state.campaigns;
				return {
					total: campaigns.length,
					draft: campaigns.filter((c) => c.status === "draft").length,
					scheduled: campaigns.filter((c) => c.status === "scheduled").length,
					sending: campaigns.filter((c) => c.status === "sending").length,
					sent: campaigns.filter((c) => c.status === "sent").length,
					totalRecipients: campaigns.reduce(
						(sum, c) => sum + c.totalRecipients,
						0,
					),
					totalOpens: campaigns.reduce((sum, c) => sum + c.uniqueOpens, 0),
					totalClicks: campaigns.reduce((sum, c) => sum + c.uniqueClicks, 0),
					totalRevenue: campaigns.reduce(
						(sum, c) => sum + c.revenueAttributed,
						0,
					),
				};
			});
		};
		const useBuilderIsDirty = () => {
			return useCampaignStore((state) => state.builder.isDirty);
		};
	},
	"[project]/apps/admin/src/components/ui/checkbox.tsx [app-ssr] (ecmascript) <locals>",
	(__turbopack_context__) => {
		"use strict";

		// Re-export from @stratos/ui package
		__turbopack_context__.s([]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/index.ts [app-ssr] (ecmascript) <locals>",
			);
	},
	"[project]/apps/admin/src/components/marketing/audience-selector.tsx [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["AudienceSelector", () => AudienceSelector]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)",
			);
		/**
		 * Audience Selector Component
		 *
		 * Allows selection of campaign audience type and filters.
		 * Used in the campaign builder for targeting recipients.
		 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/funnel.js [app-ssr] (ecmascript) <export default as Filter>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/index.ts [app-ssr] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/label.tsx [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/utils.ts [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/components/ui/checkbox.tsx [app-ssr] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/checkbox.tsx [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$stores$2f$campaign$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/lib/stores/campaign-store.ts [app-ssr] (ecmascript)",
			);
		("use client");
		const AUDIENCE_OPTIONS = [
			{
				id: "waitlist",
				label: "Waitlist Subscribers",
				description: "Send to everyone who signed up for the waitlist",
				icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__[
					"Clock"
				],
				iconColor: "text-emerald-600",
				bgColor: "bg-emerald-500/10",
			},
			{
				id: "all_users",
				label: "All Platform Users",
				description: "Send to all registered users across all companies",
				icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__[
					"Users"
				],
				iconColor: "text-blue-600",
				bgColor: "bg-blue-500/10",
			},
			{
				id: "all_companies",
				label: "All Companies",
				description: "Send to company owners/admins only",
				icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__[
					"Building2"
				],
				iconColor: "text-purple-600",
				bgColor: "bg-purple-500/10",
			},
			{
				id: "segment",
				label: "Custom Segment",
				description: "Filter users or companies by specific criteria",
				icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__[
					"Filter"
				],
				iconColor: "text-amber-600",
				bgColor: "bg-amber-500/10",
			},
			{
				id: "custom",
				label: "Custom Email List",
				description: "Enter specific email addresses manually",
				icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__[
					"Mail"
				],
				iconColor: "text-gray-600",
				bgColor: "bg-gray-500/10",
			},
		];
		function AudienceSelector({ value, filter, onChange, error }) {
			const [localFilter, setLocalFilter] = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useState"
			])(
				filter || {
					excludeUnsubscribed: true,
					excludeBounced: true,
					excludeComplained: true,
				},
			);
			const [customEmails, setCustomEmails] = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useState"
			])(filter?.customEmails?.join("\n") || "");
			const { audiencePreview, setAudiencePreview } = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$stores$2f$campaign$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useCampaignStore"
			])();
			// Simulate fetching audience count when selection changes
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useEffect"
			])(() => {
				setAudiencePreview({
					isLoading: true,
				});
				// Simulate API call
				const timer = setTimeout(() => {
					const counts = {
						waitlist: 2156,
						all_users: 8432,
						all_companies: 342,
						segment: 0,
						custom: customEmails.split("\n").filter((e) => e.trim()).length,
					};
					setAudiencePreview({
						isLoading: false,
						estimatedCount: counts[value] || 0,
						sampleRecipients: [
							{
								email: "john@example.com",
								name: "John Doe",
								type: value,
							},
							{
								email: "jane@example.com",
								name: "Jane Smith",
								type: value,
							},
							{
								email: "mike@example.com",
								name: "Mike Johnson",
								type: value,
							},
						],
						lastUpdated: new Date().toISOString(),
					});
				}, 500);
				return () => clearTimeout(timer);
			}, [value, customEmails, setAudiencePreview]);
			const handleTypeChange = (type) => {
				onChange(type, localFilter);
			};
			const handleFilterChange = (updates) => {
				const newFilter = {
					...localFilter,
					...updates,
				};
				setLocalFilter(newFilter);
				onChange(value, newFilter);
			};
			const handleCustomEmailsChange = (emails) => {
				setCustomEmails(emails);
				const emailList = emails
					.split("\n")
					.map((e) => e.trim())
					.filter((e) => e && e.includes("@"));
				handleFilterChange({
					customEmails: emailList,
				});
			};
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"div",
				{
					className: "space-y-6",
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: "grid gap-3",
								children: AUDIENCE_OPTIONS.map((option) => {
									const isSelected = value === option.id;
									const Icon = option.icon;
									return /*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"button",
										{
											type: "button",
											className: (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"cn"
											])(
												"flex items-start gap-4 rounded-lg border p-4 text-left transition-colors",
												isSelected
													? "border-primary bg-primary/5 ring-1 ring-primary"
													: "hover:border-primary/50 hover:bg-muted/50",
											),
											onClick: () => handleTypeChange(option.id),
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
														])("rounded-lg p-2", option.bgColor),
														children: /*#__PURE__*/ (0,
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
															"jsxDEV"
														])(
															Icon,
															{
																className: (0,
																__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"cn"
																])("size-5", option.iconColor),
															},
															void 0,
															false,
															{
																fileName:
																	"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																lineNumber: 167,
																columnNumber: 9,
															},
															this,
														),
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
														lineNumber: 166,
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
														className: "flex-1 min-w-0",
														children: [
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"div",
																{
																	className: "flex items-center gap-2",
																	children: [
																		/*#__PURE__*/ (0,
																		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																			"jsxDEV"
																		])(
																			"p",
																			{
																				className: "font-medium",
																				children: option.label,
																			},
																			void 0,
																			false,
																			{
																				fileName:
																					"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																				lineNumber: 171,
																				columnNumber: 10,
																			},
																			this,
																		),
																		isSelected &&
																			/*#__PURE__*/ (0,
																			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																				"jsxDEV"
																			])(
																				"div",
																				{
																					className:
																						"rounded-full bg-primary p-0.5",
																					children: /*#__PURE__*/ (0,
																					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																						"jsxDEV"
																					])(
																						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__[
																							"Check"
																						],
																						{
																							className:
																								"size-3 text-primary-foreground",
																						},
																						void 0,
																						false,
																						{
																							fileName:
																								"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																							lineNumber: 174,
																							columnNumber: 12,
																						},
																						this,
																					),
																				},
																				void 0,
																				false,
																				{
																					fileName:
																						"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																					lineNumber: 173,
																					columnNumber: 11,
																				},
																				this,
																			),
																	],
																},
																void 0,
																true,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																	lineNumber: 170,
																	columnNumber: 9,
																},
																this,
															),
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"p",
																{
																	className: "text-sm text-muted-foreground",
																	children: option.description,
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																	lineNumber: 178,
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
															"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
														lineNumber: 169,
														columnNumber: 8,
													},
													this,
												),
											],
										},
										option.id,
										true,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
											lineNumber: 155,
											columnNumber: 7,
										},
										this,
									);
								}),
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
								lineNumber: 149,
								columnNumber: 4,
							},
							this,
						),
						error &&
							/*#__PURE__*/ (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"jsxDEV"
							])(
								"p",
								{
									className: "text-sm text-destructive",
									children: error,
								},
								void 0,
								false,
								{
									fileName:
										"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
									lineNumber: 185,
									columnNumber: 14,
								},
								this,
							),
						value === "segment" &&
							/*#__PURE__*/ (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"jsxDEV"
							])(
								"div",
								{
									className: "rounded-lg border p-4 space-y-4",
									children: [
										/*#__PURE__*/ (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"jsxDEV"
										])(
											"h4",
											{
												className: "font-medium",
												children: "Segment Filters",
											},
											void 0,
											false,
											{
												fileName:
													"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
												lineNumber: 190,
												columnNumber: 6,
											},
											this,
										),
										/*#__PURE__*/ (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"jsxDEV"
										])(
											"div",
											{
												className: "space-y-4",
												children: [
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
																	__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																		"Label"
																	],
																	{
																		className: "text-sm",
																		children: "User Roles",
																	},
																	void 0,
																	false,
																	{
																		fileName:
																			"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																		lineNumber: 195,
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
																		className: "flex flex-wrap gap-2",
																		children: [
																			"owner",
																			"admin",
																			"manager",
																			"technician",
																		].map((role) =>
																			/*#__PURE__*/ (0,
																			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																				"jsxDEV"
																			])(
																				"label",
																				{
																					className:
																						"flex items-center gap-2 rounded border px-3 py-1.5 text-sm cursor-pointer hover:bg-muted",
																					children: [
																						/*#__PURE__*/ (0,
																						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																							"jsxDEV"
																						])(
																							__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																								"Checkbox"
																							],
																							{
																								checked:
																									localFilter.userRoles?.includes(
																										role,
																									) || false,
																								onCheckedChange: (checked) => {
																									const currentRoles =
																										localFilter.userRoles || [];
																									const newRoles = checked
																										? [...currentRoles, role]
																										: currentRoles.filter(
																												(r) => r !== role,
																											);
																									handleFilterChange({
																										userRoles:
																											newRoles.length > 0
																												? newRoles
																												: undefined,
																									});
																								},
																							},
																							void 0,
																							false,
																							{
																								fileName:
																									"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																								lineNumber: 202,
																								columnNumber: 11,
																							},
																							this,
																						),
																						/*#__PURE__*/ (0,
																						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																							"jsxDEV"
																						])(
																							"span",
																							{
																								className: "capitalize",
																								children: role,
																							},
																							void 0,
																							false,
																							{
																								fileName:
																									"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																								lineNumber: 212,
																								columnNumber: 11,
																							},
																							this,
																						),
																					],
																				},
																				role,
																				true,
																				{
																					fileName:
																						"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																					lineNumber: 198,
																					columnNumber: 10,
																				},
																				this,
																			),
																		),
																	},
																	void 0,
																	false,
																	{
																		fileName:
																			"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																		lineNumber: 196,
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
																"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
															lineNumber: 194,
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
															className: "space-y-2",
															children: [
																/*#__PURE__*/ (0,
																__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"jsxDEV"
																])(
																	__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																		"Label"
																	],
																	{
																		className: "text-sm",
																		children: "Company Plans",
																	},
																	void 0,
																	false,
																	{
																		fileName:
																			"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																		lineNumber: 220,
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
																		className: "flex flex-wrap gap-2",
																		children: [
																			"starter",
																			"professional",
																			"enterprise",
																		].map((plan) =>
																			/*#__PURE__*/ (0,
																			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																				"jsxDEV"
																			])(
																				"label",
																				{
																					className:
																						"flex items-center gap-2 rounded border px-3 py-1.5 text-sm cursor-pointer hover:bg-muted",
																					children: [
																						/*#__PURE__*/ (0,
																						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																							"jsxDEV"
																						])(
																							__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																								"Checkbox"
																							],
																							{
																								checked:
																									localFilter.companyPlans?.includes(
																										plan,
																									) || false,
																								onCheckedChange: (checked) => {
																									const currentPlans =
																										localFilter.companyPlans ||
																										[];
																									const newPlans = checked
																										? [...currentPlans, plan]
																										: currentPlans.filter(
																												(p) => p !== plan,
																											);
																									handleFilterChange({
																										companyPlans:
																											newPlans.length > 0
																												? newPlans
																												: undefined,
																									});
																								},
																							},
																							void 0,
																							false,
																							{
																								fileName:
																									"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																								lineNumber: 227,
																								columnNumber: 11,
																							},
																							this,
																						),
																						/*#__PURE__*/ (0,
																						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																							"jsxDEV"
																						])(
																							"span",
																							{
																								className: "capitalize",
																								children: plan,
																							},
																							void 0,
																							false,
																							{
																								fileName:
																									"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																								lineNumber: 237,
																								columnNumber: 11,
																							},
																							this,
																						),
																					],
																				},
																				plan,
																				true,
																				{
																					fileName:
																						"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																					lineNumber: 223,
																					columnNumber: 10,
																				},
																				this,
																			),
																		),
																	},
																	void 0,
																	false,
																	{
																		fileName:
																			"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																		lineNumber: 221,
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
																"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
															lineNumber: 219,
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
															className: "space-y-2",
															children: [
																/*#__PURE__*/ (0,
																__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"jsxDEV"
																])(
																	__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																		"Label"
																	],
																	{
																		className: "text-sm",
																		children: "Company Status",
																	},
																	void 0,
																	false,
																	{
																		fileName:
																			"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																		lineNumber: 245,
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
																		className: "flex flex-wrap gap-2",
																		children: [
																			"active",
																			"trial",
																			"suspended",
																		].map((status) =>
																			/*#__PURE__*/ (0,
																			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																				"jsxDEV"
																			])(
																				"label",
																				{
																					className:
																						"flex items-center gap-2 rounded border px-3 py-1.5 text-sm cursor-pointer hover:bg-muted",
																					children: [
																						/*#__PURE__*/ (0,
																						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																							"jsxDEV"
																						])(
																							__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																								"Checkbox"
																							],
																							{
																								checked:
																									localFilter.companyStatuses?.includes(
																										status,
																									) || false,
																								onCheckedChange: (checked) => {
																									const currentStatuses =
																										localFilter.companyStatuses ||
																										[];
																									const newStatuses = checked
																										? [
																												...currentStatuses,
																												status,
																											]
																										: currentStatuses.filter(
																												(s) => s !== status,
																											);
																									handleFilterChange({
																										companyStatuses:
																											newStatuses.length > 0
																												? newStatuses
																												: undefined,
																									});
																								},
																							},
																							void 0,
																							false,
																							{
																								fileName:
																									"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																								lineNumber: 252,
																								columnNumber: 11,
																							},
																							this,
																						),
																						/*#__PURE__*/ (0,
																						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																							"jsxDEV"
																						])(
																							"span",
																							{
																								className: "capitalize",
																								children: status,
																							},
																							void 0,
																							false,
																							{
																								fileName:
																									"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																								lineNumber: 262,
																								columnNumber: 11,
																							},
																							this,
																						),
																					],
																				},
																				status,
																				true,
																				{
																					fileName:
																						"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																					lineNumber: 248,
																					columnNumber: 10,
																				},
																				this,
																			),
																		),
																	},
																	void 0,
																	false,
																	{
																		fileName:
																			"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																		lineNumber: 246,
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
																"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
															lineNumber: 244,
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
													"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
												lineNumber: 192,
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
										"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
									lineNumber: 189,
									columnNumber: 5,
								},
								this,
							),
						value === "custom" &&
							/*#__PURE__*/ (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"jsxDEV"
							])(
								"div",
								{
									className: "rounded-lg border p-4 space-y-4",
									children: [
										/*#__PURE__*/ (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"jsxDEV"
										])(
											"h4",
											{
												className: "font-medium",
												children: "Custom Email List",
											},
											void 0,
											false,
											{
												fileName:
													"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
												lineNumber: 274,
												columnNumber: 6,
											},
											this,
										),
										/*#__PURE__*/ (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"jsxDEV"
										])(
											"p",
											{
												className: "text-sm text-muted-foreground",
												children: "Enter email addresses, one per line",
											},
											void 0,
											false,
											{
												fileName:
													"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
												lineNumber: 275,
												columnNumber: 6,
											},
											this,
										),
										/*#__PURE__*/ (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"jsxDEV"
										])(
											"textarea",
											{
												className:
													"w-full min-h-[150px] rounded-md border bg-background px-3 py-2 text-sm font-mono",
												placeholder:
													"john@example.com\njane@example.com\nmike@example.com",
												value: customEmails,
												onChange: (e) =>
													handleCustomEmailsChange(e.target.value),
											},
											void 0,
											false,
											{
												fileName:
													"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
												lineNumber: 278,
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
										"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
									lineNumber: 273,
									columnNumber: 5,
								},
								this,
							),
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: "rounded-lg border p-4 space-y-4",
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"h4",
										{
											className: "font-medium",
											children: "Exclusions",
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
											lineNumber: 289,
											columnNumber: 5,
										},
										this,
									),
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"div",
										{
											className: "space-y-3",
											children: [
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													"label",
													{
														className: "flex items-center gap-2 cursor-pointer",
														children: [
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"Checkbox"
																],
																{
																	checked:
																		localFilter.excludeUnsubscribed !== false,
																	onCheckedChange: (checked) =>
																		handleFilterChange({
																			excludeUnsubscribed: checked === true,
																		}),
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																	lineNumber: 292,
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
																	className: "text-sm",
																	children: "Exclude unsubscribed contacts",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																	lineNumber: 298,
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
															"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
														lineNumber: 291,
														columnNumber: 6,
													},
													this,
												),
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													"label",
													{
														className: "flex items-center gap-2 cursor-pointer",
														children: [
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"Checkbox"
																],
																{
																	checked: localFilter.excludeBounced !== false,
																	onCheckedChange: (checked) =>
																		handleFilterChange({
																			excludeBounced: checked === true,
																		}),
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																	lineNumber: 301,
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
																	className: "text-sm",
																	children: "Exclude bounced emails",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																	lineNumber: 307,
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
															"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
														lineNumber: 300,
														columnNumber: 6,
													},
													this,
												),
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													"label",
													{
														className: "flex items-center gap-2 cursor-pointer",
														children: [
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"Checkbox"
																],
																{
																	checked:
																		localFilter.excludeComplained !== false,
																	onCheckedChange: (checked) =>
																		handleFilterChange({
																			excludeComplained: checked === true,
																		}),
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																	lineNumber: 310,
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
																	className: "text-sm",
																	children: "Exclude spam complaints",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																	lineNumber: 316,
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
															"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
														lineNumber: 309,
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
												"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
											lineNumber: 290,
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
									"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
								lineNumber: 288,
								columnNumber: 4,
							},
							this,
						),
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: "rounded-lg border bg-muted/30 p-4",
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"div",
										{
											className: "flex items-center justify-between",
											children: [
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													"div",
													{
														className: "flex items-center gap-2",
														children: [
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__[
																	"Users"
																],
																{
																	className: "size-4 text-muted-foreground",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																	lineNumber: 325,
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
																	className: "text-sm font-medium",
																	children: "Estimated Recipients",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																	lineNumber: 326,
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
															"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
														lineNumber: 324,
														columnNumber: 6,
													},
													this,
												),
												audiencePreview.isLoading
													? /*#__PURE__*/ (0,
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
															"jsxDEV"
														])(
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__[
																"Loader2"
															],
															{
																className:
																	"size-4 animate-spin text-muted-foreground",
															},
															void 0,
															false,
															{
																fileName:
																	"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																lineNumber: 329,
																columnNumber: 7,
															},
															this,
														)
													: /*#__PURE__*/ (0,
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
															"jsxDEV"
														])(
															"span",
															{
																className: "text-lg font-bold",
																children:
																	audiencePreview.estimatedCount.toLocaleString(),
															},
															void 0,
															false,
															{
																fileName:
																	"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																lineNumber: 331,
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
												"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
											lineNumber: 323,
											columnNumber: 5,
										},
										this,
									),
									!audiencePreview.isLoading &&
										audiencePreview.sampleRecipients.length > 0 &&
										/*#__PURE__*/ (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"jsxDEV"
										])(
											"div",
											{
												className: "mt-3 pt-3 border-t",
												children: [
													/*#__PURE__*/ (0,
													__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"jsxDEV"
													])(
														"p",
														{
															className: "text-xs text-muted-foreground mb-2",
															children: "Sample recipients:",
														},
														void 0,
														false,
														{
															fileName:
																"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
															lineNumber: 339,
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
															className: "space-y-1",
															children: audiencePreview.sampleRecipients
																.slice(0, 3)
																.map((recipient, i) =>
																	/*#__PURE__*/ (0,
																	__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																		"jsxDEV"
																	])(
																		"div",
																		{
																			className:
																				"flex items-center gap-2 text-sm",
																			children: [
																				/*#__PURE__*/ (0,
																				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																					"jsxDEV"
																				])(
																					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__[
																						"Mail"
																					],
																					{
																						className:
																							"size-3 text-muted-foreground",
																					},
																					void 0,
																					false,
																					{
																						fileName:
																							"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																						lineNumber: 343,
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
																						children: recipient.email,
																					},
																					void 0,
																					false,
																					{
																						fileName:
																							"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																						lineNumber: 344,
																						columnNumber: 10,
																					},
																					this,
																				),
																				recipient.name &&
																					/*#__PURE__*/ (0,
																					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																						"jsxDEV"
																					])(
																						"span",
																						{
																							className:
																								"text-muted-foreground",
																							children: [
																								"(",
																								recipient.name,
																								")",
																							],
																						},
																						void 0,
																						true,
																						{
																							fileName:
																								"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																							lineNumber: 346,
																							columnNumber: 11,
																						},
																						this,
																					),
																			],
																		},
																		i,
																		true,
																		{
																			fileName:
																				"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
																			lineNumber: 342,
																			columnNumber: 9,
																		},
																		this,
																	),
																),
														},
														void 0,
														false,
														{
															fileName:
																"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
															lineNumber: 340,
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
													"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
												lineNumber: 338,
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
									"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
								lineNumber: 322,
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
						"[project]/apps/admin/src/components/marketing/audience-selector.tsx",
					lineNumber: 147,
					columnNumber: 3,
				},
				this,
			);
		}
	},
	"[project]/apps/admin/src/components/marketing/campaign-builder.tsx [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["CampaignBuilder", () => CampaignBuilder]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)",
			);
		/**
		 * Campaign Builder Component
		 *
		 * Multi-step wizard for creating and editing email campaigns.
		 * Steps: Details → Content → Audience → Review
		 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-ssr] (ecmascript) <export default as ArrowRight>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>",
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
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/send.js [app-ssr] (ecmascript) <export default as Send>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as Calendar>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/clock.js [app-ssr] (ecmascript) <export default as Clock>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/index.ts [app-ssr] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/button.tsx [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/input.tsx [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/label.tsx [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/textarea.tsx [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/packages/ui/src/utils.ts [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$stores$2f$campaign$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/lib/stores/campaign-store.ts [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$marketing$2f$audience$2d$selector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/components/marketing/audience-selector.tsx [app-ssr] (ecmascript)",
			);
		("use client");
		const STEPS = [
			{
				id: "details",
				label: "Details",
				icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__[
					"FileText"
				],
			},
			{
				id: "content",
				label: "Content",
				icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__[
					"Mail"
				],
			},
			{
				id: "audience",
				label: "Audience",
				icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__[
					"Users"
				],
			},
			{
				id: "review",
				label: "Review",
				icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__[
					"Eye"
				],
			},
		];
		function CampaignBuilder({
			onSave,
			onSend,
			onSchedule,
			onCancel,
			isSubmitting = false,
		}) {
			const {
				builder,
				setBuilderStep,
				updateDraft,
				setValidationErrors,
				clearValidationError,
			} = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$stores$2f$campaign$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useCampaignStore"
			])();
			const [scheduleDate, setScheduleDate] = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useState"
			])("");
			const [scheduleTime, setScheduleTime] = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useState"
			])("09:00");
			const { currentStep, draft, validationErrors, editingCampaignId } =
				builder;
			const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
			// Validation
			const validateStep = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useCallback"
			])(
				(step) => {
					const errors = {};
					switch (step) {
						case "details":
							if (!draft.name.trim()) errors.name = "Campaign name is required";
							if (!draft.subject.trim())
								errors.subject = "Subject line is required";
							break;
						case "content":
							if (!draft.htmlContent?.trim() && !draft.templateId) {
								errors.content = "Email content or template is required";
							}
							break;
						case "audience":
							if (!draft.audienceType)
								errors.audienceType = "Audience type is required";
							break;
					}
					if (Object.keys(errors).length > 0) {
						setValidationErrors(errors);
						return false;
					}
					return true;
				},
				[draft, setValidationErrors],
			);
			const handleNext = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useCallback"
			])(() => {
				if (!validateStep(currentStep)) return;
				const nextIndex = currentStepIndex + 1;
				if (nextIndex < STEPS.length) {
					setBuilderStep(STEPS[nextIndex].id);
				}
			}, [currentStep, currentStepIndex, validateStep, setBuilderStep]);
			const handleBack = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useCallback"
			])(() => {
				const prevIndex = currentStepIndex - 1;
				if (prevIndex >= 0) {
					setBuilderStep(STEPS[prevIndex].id);
				}
			}, [currentStepIndex, setBuilderStep]);
			const handleStepClick = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useCallback"
			])(
				(stepId) => {
					const targetIndex = STEPS.findIndex((s) => s.id === stepId);
					// Can only go back, or to current step
					if (targetIndex <= currentStepIndex) {
						setBuilderStep(stepId);
					}
				},
				[currentStepIndex, setBuilderStep],
			);
			const handleSave = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useCallback"
			])(async () => {
				if (onSave) {
					await onSave(draft);
				}
			}, [draft, onSave]);
			const handleSend = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useCallback"
			])(async () => {
				if (
					!validateStep("details") ||
					!validateStep("content") ||
					!validateStep("audience")
				) {
					return;
				}
				if (onSend) {
					await onSend(draft);
				}
			}, [draft, onSend, validateStep]);
			const handleSchedule = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useCallback"
			])(async () => {
				if (
					!validateStep("details") ||
					!validateStep("content") ||
					!validateStep("audience")
				) {
					return;
				}
				if (!scheduleDate) {
					setValidationErrors({
						schedule: "Please select a date",
					});
					return;
				}
				const scheduledFor = `${scheduleDate}T${scheduleTime}:00.000Z`;
				if (onSchedule) {
					await onSchedule(draft, scheduledFor);
				}
			}, [
				draft,
				onSchedule,
				scheduleDate,
				scheduleTime,
				validateStep,
				setValidationErrors,
			]);
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"div",
				{
					className: "flex h-full flex-col",
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: "border-b px-6 py-4",
								children: /*#__PURE__*/ (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
									"jsxDEV"
								])(
									"div",
									{
										className: "flex items-center justify-between",
										children: STEPS.map((step, index) => {
											const isActive = step.id === currentStep;
											const isCompleted = index < currentStepIndex;
											const isClickable = index <= currentStepIndex;
											const Icon = step.icon;
											return /*#__PURE__*/ (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"jsxDEV"
											])(
												"div",
												{
													className: "flex items-center",
													children: [
														/*#__PURE__*/ (0,
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
															"jsxDEV"
														])(
															"button",
															{
																type: "button",
																className: (0,
																__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"cn"
																])(
																	"flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
																	isActive &&
																		"bg-primary text-primary-foreground",
																	isCompleted &&
																		!isActive &&
																		"bg-emerald-100 text-emerald-700",
																	!isActive &&
																		!isCompleted &&
																		"text-muted-foreground",
																	isClickable &&
																		!isActive &&
																		"hover:bg-muted cursor-pointer",
																),
																onClick: () => handleStepClick(step.id),
																disabled: !isClickable,
																children: [
																	isCompleted && !isActive
																		? /*#__PURE__*/ (0,
																			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																				"jsxDEV"
																			])(
																				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__[
																					"Check"
																				],
																				{
																					className: "size-4",
																				},
																				void 0,
																				false,
																				{
																					fileName:
																						"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																					lineNumber: 170,
																					columnNumber: 11,
																				},
																				this,
																			)
																		: /*#__PURE__*/ (0,
																			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																				"jsxDEV"
																			])(
																				Icon,
																				{
																					className: "size-4",
																				},
																				void 0,
																				false,
																				{
																					fileName:
																						"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																					lineNumber: 172,
																					columnNumber: 11,
																				},
																				this,
																			),
																	/*#__PURE__*/ (0,
																	__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																		"jsxDEV"
																	])(
																		"span",
																		{
																			className: "hidden sm:inline",
																			children: step.label,
																		},
																		void 0,
																		false,
																		{
																			fileName:
																				"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																			lineNumber: 174,
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
																			className: "sm:hidden",
																			children: index + 1,
																		},
																		void 0,
																		false,
																		{
																			fileName:
																				"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																			lineNumber: 175,
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
																	"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																lineNumber: 157,
																columnNumber: 9,
															},
															this,
														),
														index < STEPS.length - 1 &&
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
																		"mx-2 h-px w-8 sm:w-12",
																		index < currentStepIndex
																			? "bg-emerald-500"
																			: "bg-border",
																	),
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																	lineNumber: 178,
																	columnNumber: 10,
																},
																this,
															),
													],
												},
												step.id,
												true,
												{
													fileName:
														"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
													lineNumber: 156,
													columnNumber: 8,
												},
												this,
											);
										}),
									},
									void 0,
									false,
									{
										fileName:
											"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
										lineNumber: 148,
										columnNumber: 5,
									},
									this,
								),
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
								lineNumber: 147,
								columnNumber: 4,
							},
							this,
						),
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: "flex-1 overflow-auto p-6",
								children: [
									currentStep === "details" &&
										/*#__PURE__*/ (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"jsxDEV"
										])(
											DetailsStep,
											{
												draft: draft,
												errors: validationErrors,
												onChange: updateDraft,
												onClearError: clearValidationError,
											},
											void 0,
											false,
											{
												fileName:
													"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
												lineNumber: 194,
												columnNumber: 6,
											},
											this,
										),
									currentStep === "content" &&
										/*#__PURE__*/ (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"jsxDEV"
										])(
											ContentStep,
											{
												draft: draft,
												errors: validationErrors,
												onChange: updateDraft,
												onClearError: clearValidationError,
											},
											void 0,
											false,
											{
												fileName:
													"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
												lineNumber: 202,
												columnNumber: 6,
											},
											this,
										),
									currentStep === "audience" &&
										/*#__PURE__*/ (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"jsxDEV"
										])(
											AudienceStep,
											{
												draft: draft,
												errors: validationErrors,
												onChange: updateDraft,
												onClearError: clearValidationError,
											},
											void 0,
											false,
											{
												fileName:
													"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
												lineNumber: 210,
												columnNumber: 6,
											},
											this,
										),
									currentStep === "review" &&
										/*#__PURE__*/ (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"jsxDEV"
										])(
											ReviewStep,
											{
												draft: draft,
												scheduleDate: scheduleDate,
												scheduleTime: scheduleTime,
												onScheduleDateChange: setScheduleDate,
												onScheduleTimeChange: setScheduleTime,
												errors: validationErrors,
											},
											void 0,
											false,
											{
												fileName:
													"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
												lineNumber: 218,
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
									"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
								lineNumber: 192,
								columnNumber: 4,
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
									"flex items-center justify-between border-t px-6 py-4",
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"div",
										{
											className: "flex gap-2",
											children: [
												currentStepIndex > 0 &&
													/*#__PURE__*/ (0,
													__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"jsxDEV"
													])(
														__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
															"Button"
														],
														{
															variant: "outline",
															onClick: handleBack,
															disabled: isSubmitting,
															children: [
																/*#__PURE__*/ (0,
																__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"jsxDEV"
																])(
																	__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__[
																		"ArrowLeft"
																	],
																	{
																		className: "mr-2 size-4",
																	},
																	void 0,
																	false,
																	{
																		fileName:
																			"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																		lineNumber: 234,
																		columnNumber: 8,
																	},
																	this,
																),
																"Back",
															],
														},
														void 0,
														true,
														{
															fileName:
																"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
															lineNumber: 233,
															columnNumber: 7,
														},
														this,
													),
												onCancel &&
													/*#__PURE__*/ (0,
													__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"jsxDEV"
													])(
														__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
															"Button"
														],
														{
															variant: "ghost",
															onClick: onCancel,
															disabled: isSubmitting,
															children: "Cancel",
														},
														void 0,
														false,
														{
															fileName:
																"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
															lineNumber: 239,
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
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 231,
											columnNumber: 5,
										},
										this,
									),
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"div",
										{
											className: "flex gap-2",
											children: [
												onSave &&
													/*#__PURE__*/ (0,
													__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"jsxDEV"
													])(
														__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
															"Button"
														],
														{
															variant: "outline",
															onClick: handleSave,
															disabled: isSubmitting,
															children: [
																isSubmitting
																	? /*#__PURE__*/ (0,
																		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																			"jsxDEV"
																		])(
																			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__[
																				"Loader2"
																			],
																			{
																				className: "mr-2 size-4 animate-spin",
																			},
																			void 0,
																			false,
																			{
																				fileName:
																					"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																				lineNumber: 249,
																				columnNumber: 9,
																			},
																			this,
																		)
																	: null,
																"Save Draft",
															],
														},
														void 0,
														true,
														{
															fileName:
																"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
															lineNumber: 247,
															columnNumber: 7,
														},
														this,
													),
												currentStep !== "review"
													? /*#__PURE__*/ (0,
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
															"jsxDEV"
														])(
															__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"Button"
															],
															{
																onClick: handleNext,
																disabled: isSubmitting,
																children: [
																	"Next",
																	/*#__PURE__*/ (0,
																	__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																		"jsxDEV"
																	])(
																		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__[
																			"ArrowRight"
																		],
																		{
																			className: "ml-2 size-4",
																		},
																		void 0,
																		false,
																		{
																			fileName:
																				"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																			lineNumber: 258,
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
																	"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																lineNumber: 256,
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
																className: "flex gap-2",
																children: [
																	onSchedule &&
																		scheduleDate &&
																		/*#__PURE__*/ (0,
																		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																			"jsxDEV"
																		])(
																			__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																				"Button"
																			],
																			{
																				variant: "secondary",
																				onClick: handleSchedule,
																				disabled: isSubmitting,
																				children: [
																					isSubmitting
																						? /*#__PURE__*/ (0,
																							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																								"jsxDEV"
																							])(
																								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__[
																									"Loader2"
																								],
																								{
																									className:
																										"mr-2 size-4 animate-spin",
																								},
																								void 0,
																								false,
																								{
																									fileName:
																										"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																									lineNumber: 265,
																									columnNumber: 11,
																								},
																								this,
																							)
																						: /*#__PURE__*/ (0,
																							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																								"jsxDEV"
																							])(
																								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__[
																									"Calendar"
																								],
																								{
																									className: "mr-2 size-4",
																								},
																								void 0,
																								false,
																								{
																									fileName:
																										"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																									lineNumber: 267,
																									columnNumber: 11,
																								},
																								this,
																							),
																					"Schedule",
																				],
																			},
																			void 0,
																			true,
																			{
																				fileName:
																					"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																				lineNumber: 263,
																				columnNumber: 9,
																			},
																			this,
																		),
																	onSend &&
																		/*#__PURE__*/ (0,
																		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																			"jsxDEV"
																		])(
																			__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																				"Button"
																			],
																			{
																				onClick: handleSend,
																				disabled: isSubmitting,
																				children: [
																					isSubmitting
																						? /*#__PURE__*/ (0,
																							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																								"jsxDEV"
																							])(
																								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__[
																									"Loader2"
																								],
																								{
																									className:
																										"mr-2 size-4 animate-spin",
																								},
																								void 0,
																								false,
																								{
																									fileName:
																										"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																									lineNumber: 275,
																									columnNumber: 11,
																								},
																								this,
																							)
																						: /*#__PURE__*/ (0,
																							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																								"jsxDEV"
																							])(
																								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__[
																									"Send"
																								],
																								{
																									className: "mr-2 size-4",
																								},
																								void 0,
																								false,
																								{
																									fileName:
																										"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																									lineNumber: 277,
																									columnNumber: 11,
																								},
																								this,
																							),
																					"Send Now",
																				],
																			},
																			void 0,
																			true,
																			{
																				fileName:
																					"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																				lineNumber: 273,
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
																	"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																lineNumber: 261,
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
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 245,
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
									"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
								lineNumber: 230,
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
						"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
					lineNumber: 145,
					columnNumber: 3,
				},
				this,
			);
		}
		function DetailsStep({ draft, errors, onChange, onClearError }) {
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"div",
				{
					className: "mx-auto max-w-2xl space-y-6",
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"h2",
										{
											className: "text-lg font-semibold",
											children: "Campaign Details",
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 305,
											columnNumber: 5,
										},
										this,
									),
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"p",
										{
											className: "text-sm text-muted-foreground",
											children:
												"Set up the basic information for your campaign",
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 306,
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
									"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
								lineNumber: 304,
								columnNumber: 4,
							},
							this,
						),
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: "space-y-4",
								children: [
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
													__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"Label"
													],
													{
														htmlFor: "name",
														children: "Campaign Name *",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 313,
														columnNumber: 6,
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
														id: "name",
														placeholder: "e.g., Holiday Promotion 2024",
														value: draft.name,
														onChange: (e) => {
															onChange({
																name: e.target.value,
															});
															onClearError("name");
														},
														className: errors.name ? "border-destructive" : "",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 314,
														columnNumber: 6,
													},
													this,
												),
												errors.name &&
													/*#__PURE__*/ (0,
													__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"jsxDEV"
													])(
														"p",
														{
															className: "text-sm text-destructive",
															children: errors.name,
														},
														void 0,
														false,
														{
															fileName:
																"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
															lineNumber: 325,
															columnNumber: 7,
														},
														this,
													),
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													"p",
													{
														className: "text-xs text-muted-foreground",
														children:
															"Internal name for organization (not shown to recipients)",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 327,
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
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 312,
											columnNumber: 5,
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
													__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"Label"
													],
													{
														htmlFor: "subject",
														children: "Subject Line *",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 333,
														columnNumber: 6,
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
														id: "subject",
														placeholder: "e.g., Special Holiday Offer Inside!",
														value: draft.subject,
														onChange: (e) => {
															onChange({
																subject: e.target.value,
															});
															onClearError("subject");
														},
														className: errors.subject
															? "border-destructive"
															: "",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 334,
														columnNumber: 6,
													},
													this,
												),
												errors.subject &&
													/*#__PURE__*/ (0,
													__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"jsxDEV"
													])(
														"p",
														{
															className: "text-sm text-destructive",
															children: errors.subject,
														},
														void 0,
														false,
														{
															fileName:
																"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
															lineNumber: 345,
															columnNumber: 7,
														},
														this,
													),
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													"p",
													{
														className: "text-xs text-muted-foreground",
														children: [
															draft.subject.length,
															"/60 characters recommended",
														],
													},
													void 0,
													true,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 347,
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
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 332,
											columnNumber: 5,
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
													__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"Label"
													],
													{
														htmlFor: "previewText",
														children: "Preview Text",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 353,
														columnNumber: 6,
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
														id: "previewText",
														placeholder:
															"e.g., Get 20% off your next purchase...",
														value: draft.previewText,
														onChange: (e) =>
															onChange({
																previewText: e.target.value,
															}),
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 354,
														columnNumber: 6,
													},
													this,
												),
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													"p",
													{
														className: "text-xs text-muted-foreground",
														children:
															"Text shown after the subject in the inbox preview",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 360,
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
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 352,
											columnNumber: 5,
										},
										this,
									),
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"div",
										{
											className: "grid gap-4 sm:grid-cols-2",
											children: [
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
																__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"Label"
																],
																{
																	htmlFor: "fromName",
																	children: "From Name",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																	lineNumber: 367,
																	columnNumber: 7,
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
																	id: "fromName",
																	placeholder: "Thorbis",
																	value: draft.fromName,
																	onChange: (e) =>
																		onChange({
																			fromName: e.target.value,
																		}),
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																	lineNumber: 368,
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
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 366,
														columnNumber: 6,
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
																__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"Label"
																],
																{
																	htmlFor: "fromEmail",
																	children: "From Email",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																	lineNumber: 376,
																	columnNumber: 7,
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
																	id: "fromEmail",
																	type: "email",
																	placeholder: "hello@thorbis.com",
																	value: draft.fromEmail,
																	onChange: (e) =>
																		onChange({
																			fromEmail: e.target.value,
																		}),
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																	lineNumber: 377,
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
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 375,
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
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 365,
											columnNumber: 5,
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
													__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"Label"
													],
													{
														htmlFor: "replyTo",
														children: "Reply-To Email",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 388,
														columnNumber: 6,
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
														id: "replyTo",
														type: "email",
														placeholder: "support@thorbis.com (optional)",
														value: draft.replyTo || "",
														onChange: (e) =>
															onChange({
																replyTo: e.target.value || undefined,
															}),
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 389,
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
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 387,
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
									"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
								lineNumber: 311,
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
						"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
					lineNumber: 303,
					columnNumber: 3,
				},
				this,
			);
		}
		function ContentStep({ draft, errors, onChange, onClearError }) {
			// For now, simple HTML textarea - can be replaced with rich editor
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"div",
				{
					className: "mx-auto max-w-3xl space-y-6",
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"h2",
										{
											className: "text-lg font-semibold",
											children: "Email Content",
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 407,
											columnNumber: 5,
										},
										this,
									),
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"p",
										{
											className: "text-sm text-muted-foreground",
											children:
												"Create your email content using HTML or select a template",
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 408,
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
									"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
								lineNumber: 406,
								columnNumber: 4,
							},
							this,
						),
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: "space-y-4",
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"div",
										{
											className: "rounded-lg border bg-muted/50 p-4",
											children: /*#__PURE__*/ (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"jsxDEV"
											])(
												"p",
												{
													className: "text-sm text-muted-foreground",
													children:
														"Template library coming soon. For now, enter HTML content directly.",
												},
												void 0,
												false,
												{
													fileName:
														"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
													lineNumber: 416,
													columnNumber: 6,
												},
												this,
											),
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 415,
											columnNumber: 5,
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
													__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"Label"
													],
													{
														htmlFor: "htmlContent",
														children: "HTML Content *",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 422,
														columnNumber: 6,
													},
													this,
												),
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"Textarea"
													],
													{
														id: "htmlContent",
														placeholder:
															"<html><body><h1>Hello!</h1><p>Your email content here...</p></body></html>",
														value: draft.htmlContent || "",
														onChange: (e) => {
															onChange({
																htmlContent: e.target.value,
															});
															onClearError("content");
														},
														className: (0,
														__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
															"cn"
														])(
															"min-h-[300px] font-mono text-sm",
															errors.content && "border-destructive",
														),
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 423,
														columnNumber: 6,
													},
													this,
												),
												errors.content &&
													/*#__PURE__*/ (0,
													__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"jsxDEV"
													])(
														"p",
														{
															className: "text-sm text-destructive",
															children: errors.content,
														},
														void 0,
														false,
														{
															fileName:
																"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
															lineNumber: 434,
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
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 421,
											columnNumber: 5,
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
													__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"Label"
													],
													{
														htmlFor: "plainTextContent",
														children: "Plain Text Version (optional)",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 439,
														columnNumber: 6,
													},
													this,
												),
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"Textarea"
													],
													{
														id: "plainTextContent",
														placeholder: "Hello! Your email content here...",
														value: draft.plainTextContent || "",
														onChange: (e) =>
															onChange({
																plainTextContent: e.target.value,
															}),
														className: "min-h-[150px]",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 440,
														columnNumber: 6,
													},
													this,
												),
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													"p",
													{
														className: "text-xs text-muted-foreground",
														children:
															"Fallback for email clients that don't support HTML",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 447,
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
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 438,
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
									"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
								lineNumber: 413,
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
						"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
					lineNumber: 405,
					columnNumber: 3,
				},
				this,
			);
		}
		function AudienceStep({ draft, errors, onChange, onClearError }) {
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"div",
				{
					className: "mx-auto max-w-2xl space-y-6",
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"h2",
										{
											className: "text-lg font-semibold",
											children: "Select Audience",
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 460,
											columnNumber: 5,
										},
										this,
									),
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"p",
										{
											className: "text-sm text-muted-foreground",
											children: "Choose who will receive this campaign",
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 461,
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
									"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
								lineNumber: 459,
								columnNumber: 4,
							},
							this,
						),
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$marketing$2f$audience$2d$selector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"AudienceSelector"
							],
							{
								value: draft.audienceType,
								filter: draft.audienceFilter,
								onChange: (audienceType, audienceFilter) => {
									onChange({
										audienceType,
										audienceFilter,
									});
									onClearError("audienceType");
								},
								error: errors.audienceType,
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
								lineNumber: 466,
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
						"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
					lineNumber: 458,
					columnNumber: 3,
				},
				this,
			);
		}
		function ReviewStep({
			draft,
			scheduleDate,
			scheduleTime,
			onScheduleDateChange,
			onScheduleTimeChange,
			errors,
		}) {
			const audienceLabels = {
				all_users: "All Users",
				all_companies: "All Companies",
				waitlist: "Waitlist Subscribers",
				segment: "Custom Segment",
				custom: "Custom List",
			};
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"div",
				{
					className: "mx-auto max-w-2xl space-y-6",
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"h2",
										{
											className: "text-lg font-semibold",
											children: "Review & Send",
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 505,
											columnNumber: 5,
										},
										this,
									),
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"p",
										{
											className: "text-sm text-muted-foreground",
											children: "Review your campaign before sending",
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 506,
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
									"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
								lineNumber: 504,
								columnNumber: 4,
							},
							this,
						),
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: "rounded-lg border p-4 space-y-4",
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"h3",
										{
											className: "font-medium",
											children: "Campaign Summary",
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 513,
											columnNumber: 5,
										},
										this,
									),
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"div",
										{
											className: "grid gap-4 sm:grid-cols-2",
											children: [
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													"div",
													{
														children: [
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"p",
																{
																	className: "text-xs text-muted-foreground",
																	children: "Campaign Name",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																	lineNumber: 517,
																	columnNumber: 7,
																},
																this,
															),
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"p",
																{
																	className: "font-medium",
																	children: draft.name || "—",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																	lineNumber: 518,
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
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 516,
														columnNumber: 6,
													},
													this,
												),
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													"div",
													{
														children: [
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"p",
																{
																	className: "text-xs text-muted-foreground",
																	children: "From",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																	lineNumber: 521,
																	columnNumber: 7,
																},
																this,
															),
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"p",
																{
																	className: "font-medium",
																	children: [
																		draft.fromName,
																		" <",
																		draft.fromEmail,
																		">",
																	],
																},
																void 0,
																true,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																	lineNumber: 522,
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
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 520,
														columnNumber: 6,
													},
													this,
												),
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													"div",
													{
														className: "sm:col-span-2",
														children: [
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"p",
																{
																	className: "text-xs text-muted-foreground",
																	children: "Subject Line",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																	lineNumber: 525,
																	columnNumber: 7,
																},
																this,
															),
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"p",
																{
																	className: "font-medium",
																	children: draft.subject || "—",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																	lineNumber: 526,
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
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 524,
														columnNumber: 6,
													},
													this,
												),
												draft.previewText &&
													/*#__PURE__*/ (0,
													__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"jsxDEV"
													])(
														"div",
														{
															className: "sm:col-span-2",
															children: [
																/*#__PURE__*/ (0,
																__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"jsxDEV"
																])(
																	"p",
																	{
																		className: "text-xs text-muted-foreground",
																		children: "Preview Text",
																	},
																	void 0,
																	false,
																	{
																		fileName:
																			"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																		lineNumber: 530,
																		columnNumber: 8,
																	},
																	this,
																),
																/*#__PURE__*/ (0,
																__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"jsxDEV"
																])(
																	"p",
																	{
																		className: "text-sm text-muted-foreground",
																		children: draft.previewText,
																	},
																	void 0,
																	false,
																	{
																		fileName:
																			"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																		lineNumber: 531,
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
																"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
															lineNumber: 529,
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
														children: [
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"p",
																{
																	className: "text-xs text-muted-foreground",
																	children: "Audience",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																	lineNumber: 535,
																	columnNumber: 7,
																},
																this,
															),
															/*#__PURE__*/ (0,
															__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																"jsxDEV"
															])(
																"p",
																{
																	className: "font-medium",
																	children: audienceLabels[draft.audienceType],
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																	lineNumber: 536,
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
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 534,
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
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 515,
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
									"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
								lineNumber: 512,
								columnNumber: 4,
							},
							this,
						),
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: "rounded-lg border p-4 space-y-4",
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"div",
										{
											className: "flex items-center gap-2",
											children: [
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__[
														"Clock"
													],
													{
														className: "size-4 text-muted-foreground",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 544,
														columnNumber: 6,
													},
													this,
												),
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													"h3",
													{
														className: "font-medium",
														children: "Schedule (Optional)",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 545,
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
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 543,
											columnNumber: 5,
										},
										this,
									),
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"p",
										{
											className: "text-sm text-muted-foreground",
											children:
												"Schedule this campaign for later, or send it immediately",
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 547,
											columnNumber: 5,
										},
										this,
									),
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"div",
										{
											className: "grid gap-4 sm:grid-cols-2",
											children: [
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
																__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"Label"
																],
																{
																	htmlFor: "scheduleDate",
																	children: "Date",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																	lineNumber: 553,
																	columnNumber: 7,
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
																	id: "scheduleDate",
																	type: "date",
																	value: scheduleDate,
																	onChange: (e) =>
																		onScheduleDateChange(e.target.value),
																	min: new Date().toISOString().split("T")[0],
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																	lineNumber: 554,
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
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 552,
														columnNumber: 6,
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
																__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
																	"Label"
																],
																{
																	htmlFor: "scheduleTime",
																	children: "Time (UTC)",
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																	lineNumber: 563,
																	columnNumber: 7,
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
																	id: "scheduleTime",
																	type: "time",
																	value: scheduleTime,
																	onChange: (e) =>
																		onScheduleTimeChange(e.target.value),
																},
																void 0,
																false,
																{
																	fileName:
																		"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
																	lineNumber: 564,
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
															"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
														lineNumber: 562,
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
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 551,
											columnNumber: 5,
										},
										this,
									),
									errors.schedule &&
										/*#__PURE__*/ (0,
										__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"jsxDEV"
										])(
											"p",
											{
												className: "text-sm text-destructive",
												children: errors.schedule,
											},
											void 0,
											false,
											{
												fileName:
													"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
												lineNumber: 573,
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
									"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
								lineNumber: 542,
								columnNumber: 4,
							},
							this,
						),
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: "rounded-lg border p-4 space-y-4",
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"h3",
										{
											className: "font-medium",
											children: "Email Preview",
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
											lineNumber: 579,
											columnNumber: 5,
										},
										this,
									),
									draft.htmlContent
										? /*#__PURE__*/ (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"jsxDEV"
											])(
												"div",
												{
													className: "rounded border bg-white p-4",
													children: /*#__PURE__*/ (0,
													__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"jsxDEV"
													])(
														"div",
														{
															className: "prose prose-sm max-w-none",
															dangerouslySetInnerHTML: {
																__html: draft.htmlContent,
															},
														},
														void 0,
														false,
														{
															fileName:
																"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
															lineNumber: 582,
															columnNumber: 7,
														},
														this,
													),
												},
												void 0,
												false,
												{
													fileName:
														"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
													lineNumber: 581,
													columnNumber: 6,
												},
												this,
											)
										: /*#__PURE__*/ (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"jsxDEV"
											])(
												"p",
												{
													className: "text-sm text-muted-foreground",
													children: "No content to preview",
												},
												void 0,
												false,
												{
													fileName:
														"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
													lineNumber: 588,
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
									"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
								lineNumber: 578,
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
						"[project]/apps/admin/src/components/marketing/campaign-builder.tsx",
					lineNumber: 503,
					columnNumber: 3,
				},
				this,
			);
		}
	},
	"[project]/apps/admin/src/app/(dashboard)/dashboard/marketing/campaigns/new/page.tsx [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["default", () => NewCampaignPage]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)",
			);
		/**
		 * New Campaign Page
		 *
		 * Create a new email marketing campaign using the campaign builder wizard.
		 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lucide-react@0.552.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>",
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
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$marketing$2f$campaign$2d$builder$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/components/marketing/campaign-builder.tsx [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$stores$2f$campaign$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/apps/admin/src/lib/stores/campaign-store.ts [app-ssr] (ecmascript)",
			);
		("use client");
		function NewCampaignPage() {
			const router = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useRouter"
			])();
			const [isSubmitting, setIsSubmitting] = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useState"
			])(false);
			const { openBuilder, closeBuilder, addCampaign } = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$lib$2f$stores$2f$campaign$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useCampaignStore"
			])();
			// Initialize builder when page loads
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useEffect"
			])(() => {
				openBuilder();
				return () => closeBuilder();
			}, [openBuilder, closeBuilder]);
			const handleSave = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useCallback"
			])(
				async (draft) => {
					setIsSubmitting(true);
					try {
						// TODO: Replace with actual API call
						await new Promise((resolve) => setTimeout(resolve, 1000));
						// Create campaign in store (mock)
						const newCampaign = {
							id: `campaign_${Date.now()}`,
							...draft,
							status: "draft",
							totalRecipients: 0,
							sentCount: 0,
							deliveredCount: 0,
							openedCount: 0,
							uniqueOpens: 0,
							clickedCount: 0,
							uniqueClicks: 0,
							bouncedCount: 0,
							complainedCount: 0,
							unsubscribedCount: 0,
							failedCount: 0,
							revenueAttributed: 0,
							conversionsCount: 0,
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						};
						addCampaign(newCampaign);
						router.push(`/dashboard/marketing/campaigns/${newCampaign.id}`);
					} catch (error) {
						console.error("Failed to save campaign:", error);
					} finally {
						setIsSubmitting(false);
					}
				},
				[addCampaign, router],
			);
			const handleSend = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useCallback"
			])(
				async (draft) => {
					setIsSubmitting(true);
					try {
						// TODO: Replace with actual API call
						await new Promise((resolve) => setTimeout(resolve, 1500));
						// Create and send campaign (mock)
						const newCampaign = {
							id: `campaign_${Date.now()}`,
							...draft,
							status: "sending",
							totalRecipients: 2156,
							sentCount: 0,
							deliveredCount: 0,
							openedCount: 0,
							uniqueOpens: 0,
							clickedCount: 0,
							uniqueClicks: 0,
							bouncedCount: 0,
							complainedCount: 0,
							unsubscribedCount: 0,
							failedCount: 0,
							revenueAttributed: 0,
							conversionsCount: 0,
							sendingStartedAt: new Date().toISOString(),
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						};
						addCampaign(newCampaign);
						router.push(`/dashboard/marketing/campaigns/${newCampaign.id}`);
					} catch (error) {
						console.error("Failed to send campaign:", error);
					} finally {
						setIsSubmitting(false);
					}
				},
				[addCampaign, router],
			);
			const handleSchedule = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useCallback"
			])(
				async (draft, scheduledFor) => {
					setIsSubmitting(true);
					try {
						// TODO: Replace with actual API call
						await new Promise((resolve) => setTimeout(resolve, 1000));
						// Schedule campaign (mock)
						const newCampaign = {
							id: `campaign_${Date.now()}`,
							...draft,
							status: "scheduled",
							scheduledFor,
							totalRecipients: 2156,
							sentCount: 0,
							deliveredCount: 0,
							openedCount: 0,
							uniqueOpens: 0,
							clickedCount: 0,
							uniqueClicks: 0,
							bouncedCount: 0,
							complainedCount: 0,
							unsubscribedCount: 0,
							failedCount: 0,
							revenueAttributed: 0,
							conversionsCount: 0,
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						};
						addCampaign(newCampaign);
						router.push(`/dashboard/marketing/campaigns/${newCampaign.id}`);
					} catch (error) {
						console.error("Failed to schedule campaign:", error);
					} finally {
						setIsSubmitting(false);
					}
				},
				[addCampaign, router],
			);
			const handleCancel = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useCallback"
			])(() => {
				router.push("/dashboard/marketing/campaigns");
			}, [router]);
			return /*#__PURE__*/ (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"jsxDEV"
			])(
				"div",
				{
					className: "flex h-full flex-col",
					children: [
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: "flex items-center gap-4 border-b px-6 py-4",
								children: [
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"Button"
										],
										{
											variant: "ghost",
											size: "icon",
											asChild: true,
											children: /*#__PURE__*/ (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"jsxDEV"
											])(
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"default"
												],
												{
													href: "/dashboard/marketing/campaigns",
													children: /*#__PURE__*/ (0,
													__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
														"jsxDEV"
													])(
														__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$552$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__[
															"ArrowLeft"
														],
														{
															className: "size-4",
														},
														void 0,
														false,
														{
															fileName:
																"[project]/apps/admin/src/app/(dashboard)/dashboard/marketing/campaigns/new/page.tsx",
															lineNumber: 161,
															columnNumber: 7,
														},
														this,
													),
												},
												void 0,
												false,
												{
													fileName:
														"[project]/apps/admin/src/app/(dashboard)/dashboard/marketing/campaigns/new/page.tsx",
													lineNumber: 160,
													columnNumber: 6,
												},
												this,
											),
										},
										void 0,
										false,
										{
											fileName:
												"[project]/apps/admin/src/app/(dashboard)/dashboard/marketing/campaigns/new/page.tsx",
											lineNumber: 159,
											columnNumber: 5,
										},
										this,
									),
									/*#__PURE__*/ (0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"jsxDEV"
									])(
										"div",
										{
											children: [
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													"h1",
													{
														className: "text-lg font-semibold",
														children: "Create Campaign",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/app/(dashboard)/dashboard/marketing/campaigns/new/page.tsx",
														lineNumber: 165,
														columnNumber: 6,
													},
													this,
												),
												/*#__PURE__*/ (0,
												__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
													"jsxDEV"
												])(
													"p",
													{
														className: "text-sm text-muted-foreground",
														children: "Build a new email marketing campaign",
													},
													void 0,
													false,
													{
														fileName:
															"[project]/apps/admin/src/app/(dashboard)/dashboard/marketing/campaigns/new/page.tsx",
														lineNumber: 166,
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
												"[project]/apps/admin/src/app/(dashboard)/dashboard/marketing/campaigns/new/page.tsx",
											lineNumber: 164,
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
									"[project]/apps/admin/src/app/(dashboard)/dashboard/marketing/campaigns/new/page.tsx",
								lineNumber: 158,
								columnNumber: 4,
							},
							this,
						),
						/*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"jsxDEV"
						])(
							"div",
							{
								className: "flex-1 overflow-hidden",
								children: /*#__PURE__*/ (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
									"jsxDEV"
								])(
									__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$admin$2f$src$2f$components$2f$marketing$2f$campaign$2d$builder$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"CampaignBuilder"
									],
									{
										onSave: handleSave,
										onSend: handleSend,
										onSchedule: handleSchedule,
										onCancel: handleCancel,
										isSubmitting: isSubmitting,
									},
									void 0,
									false,
									{
										fileName:
											"[project]/apps/admin/src/app/(dashboard)/dashboard/marketing/campaigns/new/page.tsx",
										lineNumber: 174,
										columnNumber: 5,
									},
									this,
								),
							},
							void 0,
							false,
							{
								fileName:
									"[project]/apps/admin/src/app/(dashboard)/dashboard/marketing/campaigns/new/page.tsx",
								lineNumber: 173,
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
						"[project]/apps/admin/src/app/(dashboard)/dashboard/marketing/campaigns/new/page.tsx",
					lineNumber: 156,
					columnNumber: 3,
				},
				this,
			);
		}
	},
];

//# sourceMappingURL=apps_admin_src_1be275ec._.js.map
