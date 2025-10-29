/**
 * Role Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Automatic localStorage persistence
 * - Selective subscriptions prevent unnecessary re-renders
 *
 * Manages user role state with localStorage persistence for development
 * In production, this would integrate with authentication system
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { UserRole } from "@/types/roles";
import { USER_ROLES } from "@/types/roles";

type RoleStore = {
  role: UserRole;
  isLoading: boolean;
  setRole: (role: UserRole) => void;
  reset: () => void;
};

const initialState = {
  role: USER_ROLES.OWNER as UserRole,
  isLoading: false,
};

export const useRoleStore = create<RoleStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setRole: (role) => set({ role }),

        reset: () => set(initialState),
      }),
      {
        name: "stratos_dev_role", // localStorage key
      }
    ),
    { name: "RoleStore" } // DevTools name
  )
);
