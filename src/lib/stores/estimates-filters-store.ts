/**
 * Estimates Filters Store
 *
 * Global state management for estimate filtering
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EstimatesFilters = {
	archiveStatus: "active" | "all" | "archived";
	status: string; // "all", "draft", "sent", "accepted", "rejected", "expired"
	amountMin: string;
	amountMax: string;
	customerName: string;
	estimateNumber: string;
};

const DEFAULT_FILTERS: EstimatesFilters = {
	archiveStatus: "active",
	status: "all",
	amountMin: "",
	amountMax: "",
	customerName: "",
	estimateNumber: "",
};

type EstimatesFiltersStore = {
	filters: EstimatesFilters;
	setFilters: (filters: Partial<EstimatesFilters>) => void;
	resetFilters: () => void;
};

export const useEstimatesFiltersStore = create<EstimatesFiltersStore>()(
	persist(
		(set) => ({
			filters: DEFAULT_FILTERS,

			setFilters: (newFilters) =>
				set((state) => ({
					filters: { ...state.filters, ...newFilters },
				})),

			resetFilters: () => set({ filters: DEFAULT_FILTERS }),
		}),
		{
			name: "estimates-filters",
			skipHydration: true, // CRITICAL: Prevents hydration mismatch with Next.js 16
		},
	),
);
