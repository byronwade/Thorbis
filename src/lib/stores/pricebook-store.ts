/**
 * Price Book Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Selective subscriptions prevent unnecessary re-renders
 * - Organized in /src/lib/stores/ directory
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ============================================================================
// Types
// ============================================================================

export type SupplierName = "ferguson" | "fastenal" | "grainger" | "hdsupply" | "pace" | "winsupply";

export type SyncStatus = "connected" | "syncing" | "error" | "disconnected" | "warning";

export type SupplierStatus = {
	name: SupplierName;
	displayName: string;
	status: SyncStatus;
	lastSyncAt: Date | null;
	itemsImported: number;
	errorMessage: string | null;
	apiEnabled: boolean;
};

export type ItemTypeFilter = "all" | "service" | "material" | "equipment";

export type CategoryFilter = {
	category: string | null;
	subcategory: string | null;
};

// Navigation path for drill-down (new)
export type NavigationPath = string[]; // e.g., ["HVAC", "Heating", "Furnaces"]

export type PriceBookFilter = {
	search: string;
	categories: string[];
	itemTypes: ("service" | "material" | "package")[];
	statusFilter: "all" | "active" | "inactive";
	supplierFilter: SupplierName[];
	priceRange: { min: number | null; max: number | null };
	marginRange: { min: number | null; max: number | null };
};

export type ViewMode = "grid" | "table" | "list";

// ============================================================================
// Store State Type
// ============================================================================

type PriceBookStore = {
	// View State
	viewMode: ViewMode;
	selectedItemIds: string[];

	// Navigation State (new drill-down system)
	navigationPath: NavigationPath;

	// Filters (legacy - keeping for compatibility)
	filters: PriceBookFilter;

	// Drill-down Filters (legacy - keeping for compatibility)
	itemTypeFilter: ItemTypeFilter;
	categoryFilter: CategoryFilter;

	// Supplier Status
	suppliers: SupplierStatus[];

	// Sidebar State
	sidebarCollapsed: boolean;
	activeSection: string | null;

	// Actions - View Mode
	setViewMode: (mode: ViewMode) => void;
	toggleSelection: (id: string) => void;
	selectAll: (ids: string[]) => void;
	clearSelection: () => void;

	// Actions - Navigation (new drill-down system)
	navigateTo: (segment: string) => void;
	navigateToPath: (path: NavigationPath) => void;
	navigateBack: () => void;
	navigateToRoot: () => void;
	getCurrentLevel: () => string | null;
	isAtRoot: () => boolean;

	// Actions - Filters
	setSearch: (search: string) => void;
	setCategories: (categories: string[]) => void;
	setItemTypes: (types: ("service" | "material" | "package")[]) => void;
	setStatusFilter: (status: "all" | "active" | "inactive") => void;
	setSupplierFilter: (suppliers: SupplierName[]) => void;
	setPriceRange: (min: number | null, max: number | null) => void;
	setMarginRange: (min: number | null, max: number | null) => void;
	resetFilters: () => void;

	// Actions - Drill-down Filters (legacy - keeping for compatibility)
	setItemTypeFilter: (type: ItemTypeFilter) => void;
	setCategoryFilter: (category: string | null, subcategory?: string | null) => void;
	clearAllFilters: () => void;
	hasActiveFilters: () => boolean;
	getFilterSummary: () => string;

	// Actions - Suppliers
	updateSupplierStatus: (name: SupplierName, updates: Partial<SupplierStatus>) => void;
	syncSupplier: (name: SupplierName) => Promise<void>;

	// Actions - Sidebar
	toggleSidebar: () => void;
	setActiveSection: (section: string | null) => void;

	// Utility
	reset: () => void;
};

// ============================================================================
// Initial State
// ============================================================================

const initialFilters: PriceBookFilter = {
	search: "",
	categories: [],
	itemTypes: [],
	statusFilter: "all",
	supplierFilter: [],
	priceRange: { min: null, max: null },
	marginRange: { min: null, max: null },
};

const initialSuppliers: SupplierStatus[] = [
	{
		name: "ferguson",
		displayName: "Ferguson Enterprises",
		status: "disconnected",
		lastSyncAt: null,
		itemsImported: 0,
		errorMessage: null,
		apiEnabled: false,
	},
	{
		name: "fastenal",
		displayName: "Fastenal",
		status: "disconnected",
		lastSyncAt: null,
		itemsImported: 0,
		errorMessage: null,
		apiEnabled: false,
	},
	{
		name: "grainger",
		displayName: "Grainger",
		status: "disconnected",
		lastSyncAt: null,
		itemsImported: 0,
		errorMessage: null,
		apiEnabled: false,
	},
	{
		name: "hdsupply",
		displayName: "HD Supply",
		status: "disconnected",
		lastSyncAt: null,
		itemsImported: 0,
		errorMessage: null,
		apiEnabled: false,
	},
	{
		name: "pace",
		displayName: "Pace Supply",
		status: "disconnected",
		lastSyncAt: null,
		itemsImported: 0,
		errorMessage: null,
		apiEnabled: false,
	},
	{
		name: "winsupply",
		displayName: "Winsupply",
		status: "disconnected",
		lastSyncAt: null,
		itemsImported: 0,
		errorMessage: null,
		apiEnabled: false,
	},
];

const initialState = {
	viewMode: "table" as ViewMode,
	selectedItemIds: [],
	navigationPath: [] as NavigationPath,
	filters: initialFilters,
	itemTypeFilter: "all" as ItemTypeFilter,
	categoryFilter: { category: null, subcategory: null },
	suppliers: initialSuppliers,
	sidebarCollapsed: false,
	activeSection: null,
};

// ============================================================================
// Create Store
// ============================================================================

export const usePriceBookStore = create<PriceBookStore>()(
	devtools(
		persist(
			(set, get) => ({
				...initialState,

				// View Mode Actions
				setViewMode: (mode) => set({ viewMode: mode }),

				toggleSelection: (id) =>
					set((state) => ({
						selectedItemIds: state.selectedItemIds.includes(id)
							? state.selectedItemIds.filter((itemId) => itemId !== id)
							: [...state.selectedItemIds, id],
					})),

				selectAll: (ids) => set({ selectedItemIds: ids }),

				clearSelection: () => set({ selectedItemIds: [] }),

				// Navigation Actions (new drill-down system)
				navigateTo: (segment) =>
					set((state) => ({
						navigationPath: [...state.navigationPath, segment],
					})),

				navigateToPath: (path) => set({ navigationPath: path }),

				navigateBack: () =>
					set((state) => ({
						navigationPath: state.navigationPath.slice(0, -1),
					})),

				navigateToRoot: () => set({ navigationPath: [] }),

				getCurrentLevel: () => {
					const state = get();
					return state.navigationPath.length > 0 ? state.navigationPath.at(-1) : null;
				},

				isAtRoot: () => get().navigationPath.length === 0,

				// Filter Actions
				setSearch: (search) =>
					set((state) => ({
						filters: { ...state.filters, search },
					})),

				setCategories: (categories) =>
					set((state) => ({
						filters: { ...state.filters, categories },
					})),

				setItemTypes: (itemTypes) =>
					set((state) => ({
						filters: { ...state.filters, itemTypes },
					})),

				setStatusFilter: (statusFilter) =>
					set((state) => ({
						filters: { ...state.filters, statusFilter },
					})),

				setSupplierFilter: (supplierFilter) =>
					set((state) => ({
						filters: { ...state.filters, supplierFilter },
					})),

				setPriceRange: (min, max) =>
					set((state) => ({
						filters: { ...state.filters, priceRange: { min, max } },
					})),

				setMarginRange: (min, max) =>
					set((state) => ({
						filters: { ...state.filters, marginRange: { min, max } },
					})),

				resetFilters: () => set({ filters: initialFilters }),

				// Drill-down Filter Actions
				setItemTypeFilter: (itemTypeFilter) => set({ itemTypeFilter }),

				setCategoryFilter: (category, subcategory = null) =>
					set({ categoryFilter: { category, subcategory } }),

				clearAllFilters: () =>
					set({
						itemTypeFilter: "all",
						categoryFilter: { category: null, subcategory: null },
						filters: initialFilters,
					}),

				hasActiveFilters: () => {
					const state = get();
					return (
						state.itemTypeFilter !== "all" ||
						state.categoryFilter.category !== null ||
						state.filters.search !== ""
					);
				},

				getFilterSummary: () => {
					const state = get();
					const filters: string[] = [];

					if (state.itemTypeFilter !== "all") {
						filters.push(state.itemTypeFilter);
					}

					if (state.categoryFilter.subcategory) {
						filters.push(`${state.categoryFilter.category} › ${state.categoryFilter.subcategory}`);
					} else if (state.categoryFilter.category) {
						filters.push(state.categoryFilter.category);
					}

					if (state.filters.search) {
						filters.push(`"${state.filters.search}"`);
					}

					return filters.length > 0 ? filters.join(" • ") : "All Items";
				},

				// Supplier Actions
				updateSupplierStatus: (name, updates) =>
					set((state) => ({
						suppliers: state.suppliers.map((supplier) =>
							supplier.name === name ? { ...supplier, ...updates } : supplier
						),
					})),

				syncSupplier: async (name) => {
					// Set status to syncing
					get().updateSupplierStatus(name, { status: "syncing" });

					try {
						// TODO: Call actual API sync function
						// const result = await syncSupplierAPI(name);

						// Simulate API call for now
						await new Promise((resolve) => setTimeout(resolve, 2000));

						// Update success status
						get().updateSupplierStatus(name, {
							status: "connected",
							lastSyncAt: new Date(),
							errorMessage: null,
						});
					} catch (error) {
						// Update error status
						get().updateSupplierStatus(name, {
							status: "error",
							errorMessage: error instanceof Error ? error.message : "Sync failed",
						});
					}
				},

				// Sidebar Actions
				toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

				setActiveSection: (section) => set({ activeSection: section }),

				// Reset
				reset: () => set(initialState),
			}),
			{
				name: "pricebook-storage",
				partialize: (state) => ({
					viewMode: state.viewMode,
					navigationPath: state.navigationPath,
					filters: state.filters,
					sidebarCollapsed: state.sidebarCollapsed,
				}),
				// PERFORMANCE: Skip hydration to prevent SSR mismatches
				// Allows Next.js to generate static pages without Zustand errors
				skipHydration: true,
			}
		),
		{ name: "PriceBookStore" }
	)
);
