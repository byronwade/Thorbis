/**
 * Contracts Filters Store
 *
 * Global state management for contract filtering
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ContractsFilters = {
	archiveStatus: "active" | "all" | "archived";
	status: string; // "all", "draft", "active", "expired", "cancelled"
	customerName: string;
	contractNumber: string;
	valueMin: string;
	valueMax: string;
};

const DEFAULT_FILTERS: ContractsFilters = {
	archiveStatus: "active",
	status: "all",
	customerName: "",
	contractNumber: "",
	valueMin: "",
	valueMax: "",
};

type ContractsFiltersStore = {
	filters: ContractsFilters;
	setFilters: (filters: Partial<ContractsFilters>) => void;
	resetFilters: () => void;
};

export const useContractsFiltersStore = create<ContractsFiltersStore>()(
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
			name: "contracts-filters",
		}
	)
);
