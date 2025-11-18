/**
 * Appointments Filters Store
 *
 * Global state management for appointment filtering
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppointmentsFilters = {
	archiveStatus: "active" | "all" | "archived";
	status: string; // "all", "scheduled", "confirmed", "in_progress", "completed", "cancelled", "no_show"
	assignedTo: string;
	customerName: string;
	appointmentNumber: string;
};

const DEFAULT_FILTERS: AppointmentsFilters = {
	archiveStatus: "active",
	status: "all",
	assignedTo: "",
	customerName: "",
	appointmentNumber: "",
};

type AppointmentsFiltersStore = {
	filters: AppointmentsFilters;
	setFilters: (filters: Partial<AppointmentsFilters>) => void;
	resetFilters: () => void;
};

export const useAppointmentsFiltersStore = create<AppointmentsFiltersStore>()(
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
			name: "appointments-filters",
			skipHydration: true, // CRITICAL: Prevents hydration mismatch with Next.js 16
		},
	),
);
