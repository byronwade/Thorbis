/**
 * Sidebar State Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Page-specific sidebar state for tailored UX
 * - Persists preferences per route in localStorage
 *
 * This store manages both LEFT and RIGHT sidebar open/closed state on a per-page basis.
 * Each route can have its own sidebar states, allowing users to:
 * - Close sidebar on schedule page for more calendar space
 * - Keep sidebar open on settings for easy navigation
 * - Toggle right sidebar on invoice/pricebook pages
 * - Customize workspace per context
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ============================================================================
// Types and Definitions
// ============================================================================

/**
 * Sidebar state per page/route
 * Key: route path (e.g., "/dashboard/work/invoices")
 * Value: boolean (true = open, false = closed)
 */
type SidebarStates = Record<string, boolean>;

type SidebarStateStore = {
  // Left sidebar state per route
  sidebarStates: SidebarStates;

  // Right sidebar state per route
  rightSidebarStates: SidebarStates;

  // Left sidebar methods
  getSidebarState: (route: string) => boolean;
  setSidebarState: (route: string, isOpen: boolean) => void;
  toggleSidebarState: (route: string) => void;

  // Right sidebar methods
  getRightSidebarState: (route: string, defaultOpen?: boolean) => boolean;
  setRightSidebarState: (route: string, isOpen: boolean) => void;
  toggleRightSidebarState: (route: string) => void;

  // Reset methods
  resetAllStates: () => void;
  resetRouteState: (route: string) => void;
};

// ============================================================================
// Initial State
// ============================================================================

const initialState = {
  sidebarStates: {},
  rightSidebarStates: {},
};

// ============================================================================
// Create Store
// ============================================================================

export const useSidebarStateStore = create<SidebarStateStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Left sidebar methods
        getSidebarState: (route) => {
          const states = get().sidebarStates;
          // Default to true (open) if not set
          return states[route] ?? true;
        },

        setSidebarState: (route, isOpen) => {
          set((state) => ({
            sidebarStates: {
              ...state.sidebarStates,
              [route]: isOpen,
            },
          }));
        },

        toggleSidebarState: (route) => {
          const currentState = get().getSidebarState(route);
          get().setSidebarState(route, !currentState);
        },

        // Right sidebar methods
        getRightSidebarState: (route, defaultOpen = true) => {
          const states = get().rightSidebarStates;
          // Default to true (open) if not set, unless specified otherwise
          return states[route] ?? defaultOpen;
        },

        setRightSidebarState: (route, isOpen) => {
          set((state) => ({
            rightSidebarStates: {
              ...state.rightSidebarStates,
              [route]: isOpen,
            },
          }));
        },

        toggleRightSidebarState: (route) => {
          const currentState = get().getRightSidebarState(route);
          get().setRightSidebarState(route, !currentState);
        },

        // Reset methods
        resetAllStates: () => {
          set({ sidebarStates: {}, rightSidebarStates: {} });
        },

        resetRouteState: (route) => {
          set((state) => {
            const newLeftStates = { ...state.sidebarStates };
            const newRightStates = { ...state.rightSidebarStates };
            delete newLeftStates[route];
            delete newRightStates[route];
            return {
              sidebarStates: newLeftStates,
              rightSidebarStates: newRightStates,
            };
          });
        },
      }),
      {
        name: "sidebar-state-storage",
        // Persist both left and right sidebar states
        partialize: (state) => ({
          sidebarStates: state.sidebarStates,
          rightSidebarStates: state.rightSidebarStates,
        }),
        // PERFORMANCE: Skip hydration to prevent SSR mismatches
        // Allows Next.js to generate static pages without Zustand errors
        skipHydration: true,
      }
    ),
    { name: "SidebarStateStore" }
  )
);
