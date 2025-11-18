/**
 * Service Tickets Filters Store
 *
 * Global state management for service ticket filtering
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ServiceTicketsFilters = {
	archiveStatus: "active" | "all" | "archived";
	status: string; // "all", "open", "in_progress", "resolved", "closed", "on_hold"
	priority: string; // "all", "low", "medium", "high", "urgent"
	customerName: string;
	ticketNumber: string;
	assignedTo: string;
};

const DEFAULT_FILTERS: ServiceTicketsFilters = {
	archiveStatus: "active",
	status: "all",
	priority: "all",
	customerName: "",
	ticketNumber: "",
	assignedTo: "",
};

type ServiceTicketsFiltersStore = {
	filters: ServiceTicketsFilters;
	setFilters: (filters: Partial<ServiceTicketsFilters>) => void;
	resetFilters: () => void;
};

export const useServiceTicketsFiltersStore =
	create<ServiceTicketsFiltersStore>()(
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
				name: "service-tickets-filters",
				skipHydration: true, // CRITICAL: Prevents hydration mismatch with Next.js 16
			},
		),
	);
