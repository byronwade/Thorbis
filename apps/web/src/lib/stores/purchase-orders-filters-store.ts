/**
 * Purchase Orders Filters Store
 *
 * Global state management for purchase order filtering
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PurchaseOrdersFilters = {
	archiveStatus: "active" | "all" | "archived";
	status: string; // "all", "draft", "pending", "ordered", "received", "cancelled"
	vendorName: string;
	orderNumber: string;
	totalMin: string;
	totalMax: string;
};

const DEFAULT_FILTERS: PurchaseOrdersFilters = {
	archiveStatus: "active",
	status: "all",
	vendorName: "",
	orderNumber: "",
	totalMin: "",
	totalMax: "",
};

type PurchaseOrdersFiltersStore = {
	filters: PurchaseOrdersFilters;
	setFilters: (filters: Partial<PurchaseOrdersFilters>) => void;
	resetFilters: () => void;
};

export const usePurchaseOrdersFiltersStore =
	create<PurchaseOrdersFiltersStore>()(
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
				name: "purchase-orders-filters",
				skipHydration: true, // CRITICAL: Prevents hydration mismatch with Next.js 16
			},
		),
	);
