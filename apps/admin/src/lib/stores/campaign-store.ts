/**
 * Email Campaign Store - Zustand state management
 *
 * Manages campaign state for the admin marketing panel:
 * - Campaign list with filtering/sorting
 * - Selected campaign for detail view
 * - Campaign builder wizard state
 * - Sending progress tracking
 * - Audience preview state
 */

import { create } from "zustand";
import type {
	EmailCampaign,
	EmailCampaignStatus,
	EmailCampaignAudienceType,
	CampaignDraft,
	CampaignBuilderStep,
	AudienceFilter,
	WaitlistStats,
} from "@/types/campaigns";

// ============================================================================
// Filter & Sort Types
// ============================================================================

type CampaignSortField = "name" | "status" | "createdAt" | "scheduledFor" | "sentAt" | "openRate" | "clickRate";
type SortDirection = "asc" | "desc";

type CampaignFilters = {
	status?: EmailCampaignStatus[];
	audienceType?: EmailCampaignAudienceType[];
	dateRange?: {
		start: string;
		end: string;
	};
	search?: string;
	tags?: string[];
};

// ============================================================================
// Builder State Types
// ============================================================================

type BuilderState = {
	isOpen: boolean;
	currentStep: CampaignBuilderStep;
	draft: CampaignDraft;
	editingCampaignId?: string;
	isDirty: boolean;
	validationErrors: Record<string, string>;
};

const defaultDraft: CampaignDraft = {
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

// ============================================================================
// Sending State Types
// ============================================================================

type SendingProgress = {
	campaignId: string;
	status: "preparing" | "sending" | "completed" | "failed" | "cancelled";
	totalRecipients: number;
	sentCount: number;
	failedCount: number;
	startedAt: string;
	estimatedCompletionTime?: string;
	errorMessage?: string;
};

// ============================================================================
// Audience Preview Types
// ============================================================================

type AudiencePreview = {
	isLoading: boolean;
	estimatedCount: number;
	sampleRecipients: {
		email: string;
		name?: string;
		type: string;
	}[];
	lastUpdated?: string;
};

// ============================================================================
// Store Type Definition
// ============================================================================

type CampaignStore = {
	// -------------------------------------------------------------------------
	// Campaign List State
	// -------------------------------------------------------------------------
	campaigns: EmailCampaign[];
	setCampaigns: (campaigns: EmailCampaign[]) => void;
	addCampaign: (campaign: EmailCampaign) => void;
	updateCampaign: (id: string, updates: Partial<EmailCampaign>) => void;
	removeCampaign: (id: string) => void;

	// List loading state
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
	error: string | null;
	setError: (error: string | null) => void;

	// -------------------------------------------------------------------------
	// Selection State
	// -------------------------------------------------------------------------
	selectedCampaignId: string | null;
	setSelectedCampaignId: (id: string | null) => void;

	// -------------------------------------------------------------------------
	// Filters & Sorting
	// -------------------------------------------------------------------------
	filters: CampaignFilters;
	setFilters: (filters: Partial<CampaignFilters>) => void;
	resetFilters: () => void;

	sortField: CampaignSortField;
	sortDirection: SortDirection;
	setSort: (field: CampaignSortField, direction?: SortDirection) => void;

	// -------------------------------------------------------------------------
	// Campaign Builder State
	// -------------------------------------------------------------------------
	builder: BuilderState;
	openBuilder: (campaignId?: string) => void;
	closeBuilder: () => void;
	setBuilderStep: (step: CampaignBuilderStep) => void;
	updateDraft: (updates: Partial<CampaignDraft>) => void;
	setValidationErrors: (errors: Record<string, string>) => void;
	clearValidationError: (field: string) => void;
	resetBuilder: () => void;

	// -------------------------------------------------------------------------
	// Audience Preview State
	// -------------------------------------------------------------------------
	audiencePreview: AudiencePreview;
	setAudiencePreview: (preview: Partial<AudiencePreview>) => void;
	resetAudiencePreview: () => void;

	// -------------------------------------------------------------------------
	// Sending Progress State
	// -------------------------------------------------------------------------
	sendingProgress: SendingProgress | null;
	setSendingProgress: (progress: SendingProgress | null) => void;
	updateSendingProgress: (updates: Partial<SendingProgress>) => void;

	// -------------------------------------------------------------------------
	// Waitlist Stats (for dashboard)
	// -------------------------------------------------------------------------
	waitlistStats: WaitlistStats | null;
	setWaitlistStats: (stats: WaitlistStats | null) => void;

	// -------------------------------------------------------------------------
	// UI State
	// -------------------------------------------------------------------------
	activeTab: "campaigns" | "templates" | "segments" | "settings";
	setActiveTab: (tab: "campaigns" | "templates" | "segments" | "settings") => void;

	// Preview modal
	previewCampaignId: string | null;
	setPreviewCampaignId: (id: string | null) => void;

	// Delete confirmation
	deletingCampaignId: string | null;
	setDeletingCampaignId: (id: string | null) => void;
};

// ============================================================================
// Store Implementation
// ============================================================================

export const useCampaignStore = create<CampaignStore>((set, get) => ({
	// -------------------------------------------------------------------------
	// Campaign List State
	// -------------------------------------------------------------------------
	campaigns: [],
	setCampaigns: (campaigns) => set({ campaigns }),
	addCampaign: (campaign) =>
		set((state) => ({
			campaigns: [campaign, ...state.campaigns],
		})),
	updateCampaign: (id, updates) =>
		set((state) => ({
			campaigns: state.campaigns.map((c) => (c.id === id ? { ...c, ...updates } : c)),
		})),
	removeCampaign: (id) =>
		set((state) => ({
			campaigns: state.campaigns.filter((c) => c.id !== id),
			selectedCampaignId: state.selectedCampaignId === id ? null : state.selectedCampaignId,
		})),

	isLoading: false,
	setIsLoading: (isLoading) => set({ isLoading }),
	error: null,
	setError: (error) => set({ error }),

	// -------------------------------------------------------------------------
	// Selection State
	// -------------------------------------------------------------------------
	selectedCampaignId: null,
	setSelectedCampaignId: (id) => set({ selectedCampaignId: id }),

	// -------------------------------------------------------------------------
	// Filters & Sorting
	// -------------------------------------------------------------------------
	filters: {},
	setFilters: (filters) =>
		set((state) => ({
			filters: { ...state.filters, ...filters },
		})),
	resetFilters: () => set({ filters: {} }),

	sortField: "createdAt",
	sortDirection: "desc",
	setSort: (field, direction) =>
		set((state) => ({
			sortField: field,
			sortDirection: direction ?? (state.sortField === field && state.sortDirection === "asc" ? "desc" : "asc"),
		})),

	// -------------------------------------------------------------------------
	// Campaign Builder State
	// -------------------------------------------------------------------------
	builder: {
		isOpen: false,
		currentStep: "details",
		draft: { ...defaultDraft },
		isDirty: false,
		validationErrors: {},
	},
	openBuilder: (campaignId) => {
		const { campaigns } = get();
		const existingCampaign = campaignId ? campaigns.find((c) => c.id === campaignId) : null;

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
						audienceFilter: existingCampaign.audienceFilter || defaultDraft.audienceFilter,
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
					draft: { ...defaultDraft },
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
				draft: { ...defaultDraft },
				isDirty: false,
				validationErrors: {},
			},
		}),
	setBuilderStep: (step) =>
		set((state) => ({
			builder: { ...state.builder, currentStep: step },
		})),
	updateDraft: (updates) =>
		set((state) => ({
			builder: {
				...state.builder,
				draft: { ...state.builder.draft, ...updates },
				isDirty: true,
			},
		})),
	setValidationErrors: (errors) =>
		set((state) => ({
			builder: { ...state.builder, validationErrors: errors },
		})),
	clearValidationError: (field) =>
		set((state) => {
			const { [field]: _, ...rest } = state.builder.validationErrors;
			return {
				builder: { ...state.builder, validationErrors: rest },
			};
		}),
	resetBuilder: () =>
		set({
			builder: {
				isOpen: false,
				currentStep: "details",
				draft: { ...defaultDraft },
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
			audiencePreview: { ...state.audiencePreview, ...preview },
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
	setSendingProgress: (progress) => set({ sendingProgress: progress }),
	updateSendingProgress: (updates) =>
		set((state) => ({
			sendingProgress: state.sendingProgress ? { ...state.sendingProgress, ...updates } : null,
		})),

	// -------------------------------------------------------------------------
	// Waitlist Stats
	// -------------------------------------------------------------------------
	waitlistStats: null,
	setWaitlistStats: (stats) => set({ waitlistStats: stats }),

	// -------------------------------------------------------------------------
	// UI State
	// -------------------------------------------------------------------------
	activeTab: "campaigns",
	setActiveTab: (tab) => set({ activeTab: tab }),

	previewCampaignId: null,
	setPreviewCampaignId: (id) => set({ previewCampaignId: id }),

	deletingCampaignId: null,
	setDeletingCampaignId: (id) => set({ deletingCampaignId: id }),
}));

// ============================================================================
// Selector Hooks (for optimized re-renders)
// ============================================================================

/** Get filtered and sorted campaigns */
export const useFilteredCampaigns = () => {
	return useCampaignStore((state) => {
		let filtered = [...state.campaigns];

		// Apply filters
		if (state.filters.status?.length) {
			filtered = filtered.filter((c) => state.filters.status!.includes(c.status));
		}
		if (state.filters.audienceType?.length) {
			filtered = filtered.filter((c) => state.filters.audienceType!.includes(c.audienceType));
		}
		if (state.filters.search) {
			const search = state.filters.search.toLowerCase();
			filtered = filtered.filter(
				(c) => c.name.toLowerCase().includes(search) || c.subject.toLowerCase().includes(search) || c.tags.some((t) => t.toLowerCase().includes(search))
			);
		}
		if (state.filters.tags?.length) {
			filtered = filtered.filter((c) => state.filters.tags!.some((t) => c.tags.includes(t)));
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
			let aVal: string | number | undefined;
			let bVal: string | number | undefined;

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
					aVal = a.totalRecipients > 0 ? a.uniqueOpens / a.totalRecipients : 0;
					bVal = b.totalRecipients > 0 ? b.uniqueOpens / b.totalRecipients : 0;
					break;
				case "clickRate":
					aVal = a.totalRecipients > 0 ? a.uniqueClicks / a.totalRecipients : 0;
					bVal = b.totalRecipients > 0 ? b.uniqueClicks / b.totalRecipients : 0;
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

/** Get selected campaign */
export const useSelectedCampaign = () => {
	return useCampaignStore((state) => (state.selectedCampaignId ? state.campaigns.find((c) => c.id === state.selectedCampaignId) || null : null));
};

/** Get campaign stats summary */
export const useCampaignStats = () => {
	return useCampaignStore((state) => {
		const campaigns = state.campaigns;
		return {
			total: campaigns.length,
			draft: campaigns.filter((c) => c.status === "draft").length,
			scheduled: campaigns.filter((c) => c.status === "scheduled").length,
			sending: campaigns.filter((c) => c.status === "sending").length,
			sent: campaigns.filter((c) => c.status === "sent").length,
			totalRecipients: campaigns.reduce((sum, c) => sum + c.totalRecipients, 0),
			totalOpens: campaigns.reduce((sum, c) => sum + c.uniqueOpens, 0),
			totalClicks: campaigns.reduce((sum, c) => sum + c.uniqueClicks, 0),
			totalRevenue: campaigns.reduce((sum, c) => sum + c.revenueAttributed, 0),
		};
	});
};

/** Check if builder has unsaved changes */
export const useBuilderIsDirty = () => {
	return useCampaignStore((state) => state.builder.isDirty);
};
