/**
 * Equipment Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Selective subscriptions prevent unnecessary re-renders
 * - Organized in /src/lib/stores/ directory
 *
 * Manages equipment/asset tracking UI state (filters, selections, view mode)
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ============================================================================
// Types
// ============================================================================

export type EquipmentType =
  | "all"
  | "hvac"
  | "plumbing"
  | "electrical"
  | "appliance"
  | "other";
export type EquipmentStatus =
  | "all"
  | "active"
  | "inactive"
  | "retired"
  | "warranty"
  | "needs_service";
export type EquipmentCondition = "all" | "excellent" | "good" | "fair" | "poor";
export type ViewMode = "table" | "grid" | "map";

export type EquipmentFilters = {
  search: string;
  type: EquipmentType;
  status: EquipmentStatus;
  condition: EquipmentCondition;
  customerId: string | null;
  propertyId: string | null;
  manufacturer: string | null;
  tags: string[];
  showUnderWarrantyOnly: boolean;
  showServiceDueOnly: boolean;
};

// ============================================================================
// Store State Type
// ============================================================================

type EquipmentStore = {
  // View State
  viewMode: ViewMode;
  selectedEquipmentIds: string[];

  // Filters
  filters: EquipmentFilters;

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
  setType: (type: EquipmentType) => void;
  setStatus: (status: EquipmentStatus) => void;
  setCondition: (condition: EquipmentCondition) => void;
  setCustomerId: (id: string | null) => void;
  setPropertyId: (id: string | null) => void;
  setManufacturer: (manufacturer: string | null) => void;
  setTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  setShowUnderWarrantyOnly: (value: boolean) => void;
  setShowServiceDueOnly: (value: boolean) => void;
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

const initialFilters: EquipmentFilters = {
  search: "",
  type: "all",
  status: "all",
  condition: "all",
  customerId: null,
  propertyId: null,
  manufacturer: null,
  tags: [],
  showUnderWarrantyOnly: false,
  showServiceDueOnly: false,
};

const initialState = {
  viewMode: "table" as ViewMode,
  selectedEquipmentIds: [],
  filters: initialFilters,
  sidebarCollapsed: false,
  activeSection: null,
};

// ============================================================================
// Create Store
// ============================================================================

export const useEquipmentStore = create<EquipmentStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // View Mode Actions
        setViewMode: (mode) => set({ viewMode: mode }),

        toggleSelection: (id) =>
          set((state) => ({
            selectedEquipmentIds: state.selectedEquipmentIds.includes(id)
              ? state.selectedEquipmentIds.filter(
                  (equipmentId) => equipmentId !== id
                )
              : [...state.selectedEquipmentIds, id],
          })),

        selectAll: (ids) => set({ selectedEquipmentIds: ids }),

        clearSelection: () => set({ selectedEquipmentIds: [] }),

        // Filter Actions
        setSearch: (search) =>
          set((state) => ({
            filters: { ...state.filters, search },
          })),

        setType: (type) =>
          set((state) => ({
            filters: { ...state.filters, type },
          })),

        setStatus: (status) =>
          set((state) => ({
            filters: { ...state.filters, status },
          })),

        setCondition: (condition) =>
          set((state) => ({
            filters: { ...state.filters, condition },
          })),

        setCustomerId: (customerId) =>
          set((state) => ({
            filters: { ...state.filters, customerId },
          })),

        setPropertyId: (propertyId) =>
          set((state) => ({
            filters: { ...state.filters, propertyId },
          })),

        setManufacturer: (manufacturer) =>
          set((state) => ({
            filters: { ...state.filters, manufacturer },
          })),

        setTags: (tags) =>
          set((state) => ({
            filters: { ...state.filters, tags },
          })),

        toggleTag: (tag) =>
          set((state) => ({
            filters: {
              ...state.filters,
              tags: state.filters.tags.includes(tag)
                ? state.filters.tags.filter((t) => t !== tag)
                : [...state.filters.tags, tag],
            },
          })),

        setShowUnderWarrantyOnly: (value) =>
          set((state) => ({
            filters: { ...state.filters, showUnderWarrantyOnly: value },
          })),

        setShowServiceDueOnly: (value) =>
          set((state) => ({
            filters: { ...state.filters, showServiceDueOnly: value },
          })),

        resetFilters: () => set({ filters: initialFilters }),

        hasActiveFilters: () => {
          const state = get();
          return (
            state.filters.search !== "" ||
            state.filters.type !== "all" ||
            state.filters.status !== "all" ||
            state.filters.condition !== "all" ||
            state.filters.customerId !== null ||
            state.filters.propertyId !== null ||
            state.filters.manufacturer !== null ||
            state.filters.tags.length > 0 ||
            state.filters.showUnderWarrantyOnly ||
            state.filters.showServiceDueOnly
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
        name: "equipment-storage",
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
    { name: "EquipmentStore" }
  )
);
