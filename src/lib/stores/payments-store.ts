/**
 * Payments Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Selective subscriptions prevent unnecessary re-renders
 * - Organized in /src/lib/stores/ directory
 *
 * Manages payment transactions UI state (filters, selections, view mode)
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ============================================================================
// Types
// ============================================================================

export type PaymentMethod =
  | "all"
  | "cash"
  | "check"
  | "credit_card"
  | "debit_card"
  | "ach"
  | "wire"
  | "venmo"
  | "paypal"
  | "other";
export type PaymentStatus =
  | "all"
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded"
  | "partially_refunded"
  | "cancelled";
export type PaymentType = "all" | "payment" | "refund" | "credit";
export type ViewMode = "table" | "grid" | "timeline";

export type DateRange = {
  from: Date | null;
  to: Date | null;
};

export type PaymentFilters = {
  search: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentType: PaymentType;
  dateRange: DateRange;
  amountRange: { min: number | null; max: number | null };
  showReconciledOnly: boolean;
  showUnreconciledOnly: boolean;
  customerId: string | null;
};

// ============================================================================
// Store State Type
// ============================================================================

type PaymentsStore = {
  // View State
  viewMode: ViewMode;
  selectedPaymentIds: string[];

  // Filters
  filters: PaymentFilters;

  // Sidebar State
  sidebarCollapsed: boolean;
  activeSection: string | null;

  // Actions - View Mode
  setViewMode: (mode: ViewMode) => void;
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;

  // Actions - Filters
  setSearch: (search: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setPaymentStatus: (status: PaymentStatus) => void;
  setPaymentType: (type: PaymentType) => void;
  setDateRange: (from: Date | null, to: Date | null) => void;
  setAmountRange: (min: number | null, max: number | null) => void;
  setShowReconciledOnly: (value: boolean) => void;
  setShowUnreconciledOnly: (value: boolean) => void;
  setCustomerId: (id: string | null) => void;
  resetFilters: () => void;
  hasActiveFilters: () => boolean;

  // Actions - Sidebar
  toggleSidebar: () => void;
  setActiveSection: (section: string | null) => void;

  // Utility
  reset: () => void;
};

// ============================================================================
// Initial State
// ============================================================================

const initialFilters: PaymentFilters = {
  search: "",
  paymentMethod: "all",
  paymentStatus: "all",
  paymentType: "all",
  dateRange: { from: null, to: null },
  amountRange: { min: null, max: null },
  showReconciledOnly: false,
  showUnreconciledOnly: false,
  customerId: null,
};

const initialState = {
  viewMode: "table" as ViewMode,
  selectedPaymentIds: [],
  filters: initialFilters,
  sidebarCollapsed: false,
  activeSection: null,
};

// ============================================================================
// Create Store
// ============================================================================

export const usePaymentsStore = create<PaymentsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // View Mode Actions
        setViewMode: (mode) => set({ viewMode: mode }),

        toggleSelection: (id) =>
          set((state) => ({
            selectedPaymentIds: state.selectedPaymentIds.includes(id)
              ? state.selectedPaymentIds.filter((paymentId) => paymentId !== id)
              : [...state.selectedPaymentIds, id],
          })),

        selectAll: (ids) => set({ selectedPaymentIds: ids }),

        clearSelection: () => set({ selectedPaymentIds: [] }),

        // Filter Actions
        setSearch: (search) =>
          set((state) => ({
            filters: { ...state.filters, search },
          })),

        setPaymentMethod: (paymentMethod) =>
          set((state) => ({
            filters: { ...state.filters, paymentMethod },
          })),

        setPaymentStatus: (paymentStatus) =>
          set((state) => ({
            filters: { ...state.filters, paymentStatus },
          })),

        setPaymentType: (paymentType) =>
          set((state) => ({
            filters: { ...state.filters, paymentType },
          })),

        setDateRange: (from, to) =>
          set((state) => ({
            filters: { ...state.filters, dateRange: { from, to } },
          })),

        setAmountRange: (min, max) =>
          set((state) => ({
            filters: { ...state.filters, amountRange: { min, max } },
          })),

        setShowReconciledOnly: (value) =>
          set((state) => ({
            filters: {
              ...state.filters,
              showReconciledOnly: value,
              showUnreconciledOnly: value
                ? false
                : state.filters.showUnreconciledOnly,
            },
          })),

        setShowUnreconciledOnly: (value) =>
          set((state) => ({
            filters: {
              ...state.filters,
              showUnreconciledOnly: value,
              showReconciledOnly: value
                ? false
                : state.filters.showReconciledOnly,
            },
          })),

        setCustomerId: (customerId) =>
          set((state) => ({
            filters: { ...state.filters, customerId },
          })),

        resetFilters: () => set({ filters: initialFilters }),

        hasActiveFilters: () => {
          const state = get();
          return (
            state.filters.search !== "" ||
            state.filters.paymentMethod !== "all" ||
            state.filters.paymentStatus !== "all" ||
            state.filters.paymentType !== "all" ||
            state.filters.dateRange.from !== null ||
            state.filters.dateRange.to !== null ||
            state.filters.amountRange.min !== null ||
            state.filters.amountRange.max !== null ||
            state.filters.showReconciledOnly ||
            state.filters.showUnreconciledOnly ||
            state.filters.customerId !== null
          );
        },

        // Sidebar Actions
        toggleSidebar: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

        setActiveSection: (section) => set({ activeSection: section }),

        // Reset
        reset: () => set(initialState),
      }),
      {
        name: "payments-storage",
        partialize: (state) => ({
          viewMode: state.viewMode,
          filters: state.filters,
          sidebarCollapsed: state.sidebarCollapsed,
        }),
        // PERFORMANCE: Skip hydration to prevent SSR mismatches
        // Allows Next.js to generate static pages without Zustand errors
        skipHydration: true,
      }
    ),
    { name: "PaymentsStore" }
  )
);
