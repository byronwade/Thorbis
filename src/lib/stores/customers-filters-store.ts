/**
 * Customers Filters Store
 *
 * Global state management for customer filtering
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CustomersFilters = {
  archiveStatus: "active" | "all" | "archived";
  type: string; // "all", "residential", "commercial"
  status: string; // "all", "active", "inactive"
  name: string;
  email: string;
  phone: string;
};

const DEFAULT_FILTERS: CustomersFilters = {
  archiveStatus: "active",
  type: "all",
  status: "all",
  name: "",
  email: "",
  phone: "",
};

type CustomersFiltersStore = {
  filters: CustomersFilters;
  setFilters: (filters: Partial<CustomersFilters>) => void;
  resetFilters: () => void;
};

export const useCustomersFiltersStore = create<CustomersFiltersStore>()(
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
      name: "customers-filters",
    }
  )
);
