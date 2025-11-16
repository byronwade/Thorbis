/**
 * Customers Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Selective subscriptions prevent unnecessary re-renders
 * - Organized in /src/lib/stores/ directory
 *
 * Manages customer list UI state (filters, selections, view mode)
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ============================================================================
// Types
// ============================================================================

export type CustomerType = "all" | "residential" | "commercial" | "industrial";
export type CustomerStatus = "all" | "active" | "inactive" | "blocked";
export type ViewMode = "grid" | "table" | "map";

export type CustomerFilters = {
	search: string;
	type: CustomerType;
	status: CustomerStatus;
	tags: string[];
	hasOutstandingBalance: boolean;
	hasPortalAccess: boolean;
};

// ============================================================================
// Store State Type
// ============================================================================

type CustomersStore = {
	// View State
	viewMode: ViewMode;
	selectedCustomerIds: string[];

	// Filters
	filters: CustomerFilters;

	// Sidebar State
	sidebarCollapsed: boolean;
	activeSection: string | null;

	// Actions - View Mode
	setViewMode: (mode: ViewMode) => void;
	toggleSelection: (id: string) => void;
	selectAll: (ids: string[]) => void;
	clearSelection: () => void;

	// Actions - Filters
	setSearch: (search: string) => void;
	setType: (type: CustomerType) => void;
	setStatus: (status: CustomerStatus) => void;
	setTags: (tags: string[]) => void;
	toggleTag: (tag: string) => void;
	setHasOutstandingBalance: (value: boolean) => void;
	setHasPortalAccess: (value: boolean) => void;
	resetFilters: () => void;
	hasActiveFilters: () => boolean;

	// Actions - Sidebar
	toggleSidebar: () => void;
	setActiveSection: (section: string | null) => void;

	// Utility
	reset: () => void;
};

// ============================================================================
// Initial State
// ============================================================================

const initialFilters: CustomerFilters = {
	search: "",
	type: "all",
	status: "all",
	tags: [],
	hasOutstandingBalance: false,
	hasPortalAccess: false,
};

const initialState = {
	viewMode: "table" as ViewMode,
	selectedCustomerIds: [],
	filters: initialFilters,
	sidebarCollapsed: false,
	activeSection: null,
};

// ============================================================================
// Create Store
// ============================================================================

export const useCustomersStore = create<CustomersStore>()(
	devtools(
		persist(
			(set, get) => ({
				...initialState,

				// View Mode Actions
				setViewMode: (mode) => set({ viewMode: mode }),

				toggleSelection: (id) =>
					set((state) => ({
						selectedCustomerIds: state.selectedCustomerIds.includes(id)
							? state.selectedCustomerIds.filter((customerId) => customerId !== id)
							: [...state.selectedCustomerIds, id],
					})),

				selectAll: (ids) => set({ selectedCustomerIds: ids }),

				clearSelection: () => set({ selectedCustomerIds: [] }),

				// Filter Actions
				setSearch: (search) =>
					set((state) => ({
						filters: { ...state.filters, search },
					})),

				setType: (type) =>
					set((state) => ({
						filters: { ...state.filters, type },
					})),

				setStatus: (status) =>
					set((state) => ({
						filters: { ...state.filters, status },
					})),

				setTags: (tags) =>
					set((state) => ({
						filters: { ...state.filters, tags },
					})),

				toggleTag: (tag) =>
					set((state) => ({
						filters: {
							...state.filters,
							tags: state.filters.tags.includes(tag)
								? state.filters.tags.filter((t) => t !== tag)
								: [...state.filters.tags, tag],
						},
					})),

				setHasOutstandingBalance: (value) =>
					set((state) => ({
						filters: { ...state.filters, hasOutstandingBalance: value },
					})),

				setHasPortalAccess: (value) =>
					set((state) => ({
						filters: { ...state.filters, hasPortalAccess: value },
					})),

				resetFilters: () => set({ filters: initialFilters }),

				hasActiveFilters: () => {
					const state = get();
					return (
						state.filters.search !== "" ||
						state.filters.type !== "all" ||
						state.filters.status !== "all" ||
						state.filters.tags.length > 0 ||
						state.filters.hasOutstandingBalance ||
						state.filters.hasPortalAccess
					);
				},

				// Sidebar Actions
				toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

				setActiveSection: (section) => set({ activeSection: section }),

				// Reset
				reset: () => set(initialState),
			}),
			{
				name: "customers-storage",
				partialize: (state) => ({
					viewMode: state.viewMode,
					filters: state.filters,
					sidebarCollapsed: state.sidebarCollapsed,
				}),
				// PERFORMANCE: Skip hydration to prevent SSR mismatches
				// Allows Next.js to generate static pages without Zustand errors
				skipHydration: true,
			}
		),
		{ name: "CustomersStore" }
	)
);
