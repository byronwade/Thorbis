/**
 * Jobs Filters Store
 * 
 * Global state management for job filtering
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type JobsFilters = {
  archiveStatus: "active" | "all" | "archived";
  status: string; // "all", "scheduled", "in_progress", "completed", "on_hold", "cancelled"
  priority: string; // "all", "low", "medium", "high", "urgent"
  customerName: string;
  jobNumber: string;
  assignedTo: string;
  category: string;
};

const DEFAULT_FILTERS: JobsFilters = {
  archiveStatus: "active",
  status: "all",
  priority: "all",
  customerName: "",
  jobNumber: "",
  assignedTo: "",
  category: "",
};

type JobsFiltersStore = {
  filters: JobsFilters;
  setFilters: (filters: Partial<JobsFilters>) => void;
  resetFilters: () => void;
};

export const useJobsFiltersStore = create<JobsFiltersStore>()(
  persist(
    (set) => ({
      filters: DEFAULT_FILTERS,
      
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      
      resetFilters: () =>
        set({ filters: DEFAULT_FILTERS }),
    }),
    {
      name: "jobs-filters",
    }
  )
);
