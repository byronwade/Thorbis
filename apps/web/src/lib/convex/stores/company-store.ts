"use client";

/**
 * Convex Company Context Store
 *
 * Manages the active company state for Convex-based components.
 * Works alongside the server-side company context for hybrid usage.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Id } from "../../../../../../convex/_generated/dataModel";

// ============================================================================
// Types
// ============================================================================

export interface ConvexCompanyInfo {
  _id: Id<"companies">;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  logo?: string;
  role: string;
  membershipStatus: string;
}

interface ConvexCompanyStore {
  // State
  activeCompanyId: Id<"companies"> | null;
  companies: ConvexCompanyInfo[];
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  setActiveCompanyId: (companyId: Id<"companies"> | null) => void;
  setCompanies: (companies: ConvexCompanyInfo[]) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
}

// ============================================================================
// Store
// ============================================================================

const initialState = {
  activeCompanyId: null,
  companies: [],
  isLoading: true,
  isInitialized: false,
};

export const useConvexCompanyStore = create<ConvexCompanyStore>()(
  persist(
    (set) => ({
      ...initialState,

      setActiveCompanyId: (companyId) =>
        set({ activeCompanyId: companyId }),

      setCompanies: (companies) =>
        set({ companies }),

      setLoading: (loading) =>
        set({ isLoading: loading }),

      setInitialized: (initialized) =>
        set({ isInitialized: initialized }),

      reset: () => set(initialState),
    }),
    {
      name: "convex-company-store",
      partialize: (state) => ({
        // Only persist activeCompanyId
        activeCompanyId: state.activeCompanyId,
      }),
    }
  )
);

// ============================================================================
// Selectors
// ============================================================================

export const selectActiveCompanyId = (state: ConvexCompanyStore) =>
  state.activeCompanyId;

export const selectCompanies = (state: ConvexCompanyStore) =>
  state.companies;

export const selectActiveCompany = (state: ConvexCompanyStore) =>
  state.companies.find((c) => c._id === state.activeCompanyId);

export const selectIsLoading = (state: ConvexCompanyStore) =>
  state.isLoading;

export const selectIsInitialized = (state: ConvexCompanyStore) =>
  state.isInitialized;

export const selectHasMultipleCompanies = (state: ConvexCompanyStore) =>
  state.companies.length > 1;
