import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

/**
 * Modal state
 */
type ModalState = {
  isOpen: boolean;
  type: string | null;
  data?: unknown;
};

/**
 * UI store state
 */
type UIState = {
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;
  modals: Record<string, ModalState>;
  notifications: Array<{
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
    duration?: number;
  }>;
};

/**
 * UI store actions
 */
type UIActions = {
  setTheme: (theme: UIState["theme"]) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (type: string, data?: unknown) => void;
  closeModal: (type: string) => void;
  addNotification: (
    notification: Omit<UIState["notifications"][0], "id">
  ) => void;
  removeNotification: (id: string) => void;
  reset: () => void;
};

/**
 * Complete UI store
 */
export type UIStore = UIState & UIActions;

/**
 * Initial state
 */
const initialState: UIState = {
  theme: "dark",
  sidebarOpen: true,
  modals: {},
  notifications: [],
};

/**
 * UI store - manages application UI state
 *
 * @example
 * ```tsx
 * import { useUIStore } from "@/lib/store/ui-store";
 *
 * function Header() {
 *   const { theme, sidebarOpen } = useUIStore();
 *   const { setTheme, toggleSidebar } = useUIStore();
 *
 *   return (
 *     <header>
 *       <button onClick={toggleSidebar}>Toggle</button>
 *       <button onClick={() => setTheme("dark")}>Dark</button>
 *     </header>
 *   );
 * }
 * ```
 */
export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        setTheme: (theme) =>
          set(
            (state) => {
              state.theme = theme;
            },
            false,
            "setTheme"
          ),

        toggleSidebar: () =>
          set(
            (state) => {
              state.sidebarOpen = !state.sidebarOpen;
            },
            false,
            "toggleSidebar"
          ),

        setSidebarOpen: (open) =>
          set(
            (state) => {
              state.sidebarOpen = open;
            },
            false,
            "setSidebarOpen"
          ),

        openModal: (type, data) =>
          set(
            (state) => {
              state.modals[type] = {
                isOpen: true,
                type,
                data,
              };
            },
            false,
            "openModal"
          ),

        closeModal: (type) =>
          set(
            (state) => {
              if (state.modals[type]) {
                state.modals[type].isOpen = false;
              }
            },
            false,
            "closeModal"
          ),

        addNotification: (notification) =>
          set(
            (state) => {
              const id = crypto.randomUUID();
              state.notifications.push({ ...notification, id });

              // Auto-remove after duration
              if (notification.duration) {
                setTimeout(() => {
                  set(
                    (state) => {
                      state.notifications = state.notifications.filter(
                        (n) => n.id !== id
                      );
                    },
                    false,
                    "autoRemoveNotification"
                  );
                }, notification.duration);
              }
            },
            false,
            "addNotification"
          ),

        removeNotification: (id) =>
          set(
            (state) => {
              state.notifications = state.notifications.filter(
                (n) => n.id !== id
              );
            },
            false,
            "removeNotification"
          ),

        reset: () => set(initialState, false, "reset"),
      })),
      {
        name: "ui-store",
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    { name: "UIStore" }
  )
);

/**
 * Selectors for optimized component re-renders
 */
export const uiSelectors = {
  theme: (state: UIStore) => state.theme,
  sidebarOpen: (state: UIStore) => state.sidebarOpen,
  modals: (state: UIStore) => state.modals,
  notifications: (state: UIStore) => state.notifications,
  getModal: (type: string) => (state: UIStore) => state.modals[type],
};
