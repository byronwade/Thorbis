/**
 * Invoice Filters Store
 *
 * Global state management for invoice filtering
 * - Archive status (active, all, archived)
 * - Status filter (draft, pending, paid, overdue)
 * - Amount range
 * - Customer name search
 * - Invoice number search
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type InvoiceFilters = {
	archiveStatus: "active" | "all" | "archived";
	status: string;
	amountMin: string;
	amountMax: string;
	customerName: string;
	invoiceNumber: string;
};

const DEFAULT_FILTERS: InvoiceFilters = {
	archiveStatus: "active",
	status: "all",
	amountMin: "",
	amountMax: "",
	customerName: "",
	invoiceNumber: "",
};

type InvoiceFiltersStore = {
	filters: InvoiceFilters;
	setFilters: (filters: Partial<InvoiceFilters>) => void;
	resetFilters: () => void;
};

export const useInvoiceFiltersStore = create<InvoiceFiltersStore>()(
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
			name: "invoice-filters",
		}
	)
);
