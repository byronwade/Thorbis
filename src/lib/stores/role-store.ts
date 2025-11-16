/**
 * Role Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Automatic localStorage persistence for development mode
 * - Selective subscriptions prevent unnecessary re-renders
 *
 * Manages user role state with two modes:
 * 1. Development: localStorage override for testing different roles
 * 2. Production: Fetches actual role from database
 *
 * The store checks localStorage first (dev mode), then falls back to DB role.
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { UserRole } from "@/types/roles";
import { USER_ROLES } from "@/types/roles";

type RoleStore = {
  role: UserRole;
  isLoading: boolean;
  isDevelopmentOverride: boolean; // True if using dev mode override
  actualRole: UserRole | null; // Role from database
  setRole: (role: UserRole) => void;
  setActualRole: (role: UserRole | null) => void;
  clearDevelopmentOverride: () => void;
  reset: () => void;
};

const initialState = {
  role: USER_ROLES.OWNER as UserRole,
  isLoading: false,
  isDevelopmentOverride: false,
  actualRole: null,
};

/**
 * Check if we're in development mode
 */
const isDevelopment = process.env.NODE_ENV === "development";

export const useRoleStore = create<RoleStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        /**
         * Set role (development mode override)
         * This is used by the development settings page
         */
        setRole: (role) =>
          set({
            role,
            isDevelopmentOverride: true,
          }),

        /**
         * Set actual role from database
         * This is set when fetching user's real role
         */
        setActualRole: (actualRole) => {
          const state = get();

          // If no development override, use actual role
          if (state.isDevelopmentOverride && isDevelopment) {
            // Keep development override but store actual role
            set({ actualRole });
          } else {
            set({
              actualRole,
              role: actualRole || USER_ROLES.OWNER,
              isDevelopmentOverride: false,
            });
          }
        },

        /**
         * Clear development override and use actual role
         */
        clearDevelopmentOverride: () => {
          const state = get();
          set({
            role: state.actualRole || USER_ROLES.OWNER,
            isDevelopmentOverride: false,
          });
        },

        reset: () => set(initialState),
      }),
      {
        name: "thorbis_dev_role", // localStorage key
        partialize: (state) => ({
          // Only persist in development mode
          role: isDevelopment ? state.role : undefined,
          isDevelopmentOverride: isDevelopment
            ? state.isDevelopmentOverride
            : false,
        }),
      }
    ),
    { name: "RoleStore" } // DevTools name
  )
);

/**
 * Hook to initialize role from database
 * Call this in layout or auth wrapper to sync role
 *
 * @example
 * ```typescript
 * // In layout or auth provider
 * import { initializeRoleFromDatabase } from '@/lib/stores/role-store';
 *
 * useEffect(() => {
 *   initializeRoleFromDatabase();
 * }, []);
 * ```
 */
export async function initializeRoleFromDatabase() {
  try {
    // Import dynamically to avoid circular dependencies
    const { getCurrentUserRole } = await import("@/actions/roles");

    const result = await getCurrentUserRole();

    if (result.success && result.data) {
      useRoleStore.getState().setActualRole(result.data);
    }
  } catch (_error) {}
}
