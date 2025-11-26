/**
 * Payments Filters Store
 *
 * Global state management for payment filtering
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PaymentsFilters = {
	archiveStatus: "active" | "all" | "archived";
	status: string; // "all", "pending", "completed", "failed", "refunded"
	method: string; // "all", "cash", "check", "card", "ach", "other"
	amountMin: string;
	amountMax: string;
	customerName: string;
	referenceNumber: string;
};

const DEFAULT_FILTERS: PaymentsFilters = {
	archiveStatus: "active",
	status: "all",
	method: "all",
	amountMin: "",
	amountMax: "",
	customerName: "",
	referenceNumber: "",
};

type PaymentsFiltersStore = {
	filters: PaymentsFilters;
	setFilters: (filters: Partial<PaymentsFilters>) => void;
	resetFilters: () => void;
};

export const usePaymentsFiltersStore = create<PaymentsFiltersStore>()(
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
			name: "payments-filters",
			skipHydration: true, // CRITICAL: Prevents hydration mismatch with Next.js 16
		},
	),
);
