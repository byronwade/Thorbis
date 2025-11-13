import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { User } from "@/lib/db/schema";

/**
 * User store state
 */
type UserState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

/**
 * User store actions
 */
type UserActions = {
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

/**
 * Complete user store
 */
export type UserStore = UserState & UserActions;

/**
 * Initial state
 */
const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

/**
 * User store - manages authentication state
 *
 * @example
 * ```tsx
 * import { useUserStore } from "@/lib/stores/user-store";
 *
 * function Profile() {
 *   const { user, isAuthenticated } = useUserStore();
 *   const setUser = useUserStore((state) => state.setUser);
 *
 *   if (!isAuthenticated) return <Login />;
 *   return <div>Hello {user.name}</div>;
 * }
 * ```
 */
export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        setUser: (user) =>
          set(
            (state) => {
              state.user = user;
              state.isAuthenticated = !!user;
              state.isLoading = false;
            },
            false,
            "setUser"
          ),

        updateUser: (updates) =>
          set(
            (state) => {
              if (state.user) {
                state.user = { ...state.user, ...updates };
              }
            },
            false,
            "updateUser"
          ),

        logout: () =>
          set(
            (state) => {
              state.user = null;
              state.isAuthenticated = false;
              state.isLoading = false;
            },
            false,
            "logout"
          ),

        setLoading: (loading) =>
          set(
            (state) => {
              state.isLoading = loading;
            },
            false,
            "setLoading"
          ),

        reset: () => set(initialState, false, "reset"),
      })),
      {
        name: "user-store",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: "UserStore" }
  )
);

/**
 * Selectors for optimized component re-renders
 */
export const userSelectors = {
  user: (state: UserStore) => state.user,
  isAuthenticated: (state: UserStore) => state.isAuthenticated,
  isLoading: (state: UserStore) => state.isLoading,
};
