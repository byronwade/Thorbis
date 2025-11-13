import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type WorkSection =
  | "jobs"
  | "appointments"
  | "payments"
  | "estimates"
  | "invoices"
  | "contracts"
  | "maintenancePlans"
  | "materials"
  | "purchaseOrders"
  | "serviceAgreements"
  | "equipment"
  | "teams"
  | "customers";

export type WorkViewMode = "table" | "kanban";

type WorkViewState = {
  views: Record<WorkSection, WorkViewMode>;
  setView: (section: WorkSection, mode: WorkViewMode) => void;
  getView: (section: WorkSection) => WorkViewMode;
  reset: () => void;
};

const defaultViews: Record<WorkSection, WorkViewMode> = {
  jobs: "table",
  appointments: "table",
  payments: "table",
  estimates: "table",
  invoices: "table",
  contracts: "table",
  maintenancePlans: "table",
  materials: "table",
  purchaseOrders: "table",
  serviceAgreements: "table",
  equipment: "table",
  teams: "table",
  customers: "table",
};

function createInitialState(): WorkViewState {
  return {
    views: { ...defaultViews },
    setView: () => {},
    getView: () => "table",
    reset: () => {},
  };
}

export const useWorkViewStore = create<WorkViewState>()(
  devtools(
    persist(
      (set, get) => ({
        ...createInitialState(),
        setView: (section, mode) =>
          set((state) => ({
            views: {
              ...state.views,
              [section]: mode,
            },
          })),
        getView: (section) => get().views[section] ?? "table",
        reset: () => set({ views: { ...defaultViews } }),
      }),
      {
        name: "work-view-preferences",
        partialize: (state) => ({
          views: state.views,
        }),
      }
    ),
    { name: "WorkViewStore" }
  )
);

export function useWorkView(section: WorkSection): WorkViewMode {
  return useWorkViewStore((state) => state.views[section] ?? "table");
}

export function useSetWorkView(section: WorkSection) {
  const setView = useWorkViewStore((state) => state.setView);
  return (mode: WorkViewMode) => setView(section, mode);
}
