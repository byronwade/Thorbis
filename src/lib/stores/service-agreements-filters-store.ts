/**
 * Service Agreements Filters Store
 *
 * Global state management for service agreement filtering
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ServiceAgreementsFilters = {
  archiveStatus: "active" | "all" | "archived";
  status: string; // "all", "draft", "active", "expired", "cancelled"
  customerName: string;
  agreementNumber: string;
  valueMin: string;
  valueMax: string;
};

const DEFAULT_FILTERS: ServiceAgreementsFilters = {
  archiveStatus: "active",
  status: "all",
  customerName: "",
  agreementNumber: "",
  valueMin: "",
  valueMax: "",
};

type ServiceAgreementsFiltersStore = {
  filters: ServiceAgreementsFilters;
  setFilters: (filters: Partial<ServiceAgreementsFilters>) => void;
  resetFilters: () => void;
};

export const useServiceAgreementsFiltersStore =
  create<ServiceAgreementsFiltersStore>()(
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
        name: "service-agreements-filters",
      }
    )
  );
