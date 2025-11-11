/**
 * Archive Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Selective subscriptions prevent unnecessary re-renders
 * - Persists archive filter preferences to localStorage
 *
 * Manages archive filter state for all datatables
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ArchiveFilter } from "@/lib/utils/archive";

// Define entity types that can have archive filters
export type ArchivableEntity =
  | "team_members"
  | "customers"
  | "jobs"
  | "equipment"
  | "invoices"
  | "estimates"
  | "contracts"
  | "purchase_orders"
  | "service_agreements"
  | "maintenance_plans"
  | "appointments";

// State type
type ArchiveStore = {
  // Archive filters per entity
  filters: Record<ArchivableEntity, ArchiveFilter>;

  // Actions
  setFilter: (entity: ArchivableEntity, filter: ArchiveFilter) => void;
  getFilter: (entity: ArchivableEntity) => ArchiveFilter;
  resetFilter: (entity: ArchivableEntity) => void;
  resetAllFilters: () => void;
};

// Default filters (all entities default to "active" - don't show archived)
const defaultFilters: Record<ArchivableEntity, ArchiveFilter> = {
  team_members: "active",
  customers: "active",
  jobs: "active",
  equipment: "active",
  invoices: "active",
  estimates: "active",
  contracts: "active",
  purchase_orders: "active",
  service_agreements: "active",
  maintenance_plans: "active",
  appointments: "active",
};

// Create store
export const useArchiveStore = create<ArchiveStore>()(
  devtools(
    persist(
      (set, get) => ({
        filters: { ...defaultFilters },

        setFilter: (entity, filter) =>
          set((state) => ({
            filters: {
              ...state.filters,
              [entity]: filter,
            },
          })),

        getFilter: (entity) => {
          const state = get();
          return state.filters[entity] || "active";
        },

        resetFilter: (entity) =>
          set((state) => ({
            filters: {
              ...state.filters,
              [entity]: "active",
            },
          })),

        resetAllFilters: () =>
          set({
            filters: { ...defaultFilters },
          }),
      }),
      {
        name: "archive-filters", // localStorage key
        partialize: (state) => ({ filters: state.filters }), // Persist only filters
      }
    ),
    { name: "ArchiveStore" } // DevTools name
  )
);
