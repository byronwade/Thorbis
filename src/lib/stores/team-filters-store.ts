/**
 * Team Members Filters Store
 *
 * Global state management for team member filtering
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TeamFilters = {
	archiveStatus: "active" | "all" | "archived";
	role: string; // "all", "admin", "technician", "manager", "sales", etc.
	status: string; // "all", "active", "inactive", "on_leave"
	department: string;
	name: string;
	email: string;
};

const DEFAULT_FILTERS: TeamFilters = {
	archiveStatus: "active",
	role: "all",
	status: "all",
	department: "",
	name: "",
	skipHydration: true, // CRITICAL: Prevents hydration mismatch with Next.js 16
	email: "",
};

type TeamFiltersStore = {
	filters: TeamFilters;
	setFilters: (filters: Partial<TeamFilters>) => void;
	resetFilters: () => void;
};

export const useTeamFiltersStore = create<TeamFiltersStore>()(
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
			name: "team-filters",
			skipHydration: true, // CRITICAL: Prevents hydration mismatch with Next.js 16
		},
	),
);
