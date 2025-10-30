/**
 * Reporting Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Selective subscriptions prevent unnecessary re-renders
 * - Persisted to localStorage for custom reports
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type CustomReport = {
  id: string;
  title: string;
  href: string;
  description?: string;
  filters?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
};

type ReportingStore = {
  // State
  customReports: CustomReport[];
  activeReportId: string | null;
  isCreatingReport: boolean;

  // Actions
  setCustomReports: (reports: CustomReport[]) => void;
  addCustomReport: (
    report: Omit<CustomReport, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateCustomReport: (id: string, updates: Partial<CustomReport>) => void;
  deleteCustomReport: (id: string) => void;
  setActiveReport: (id: string | null) => void;
  setIsCreatingReport: (isCreating: boolean) => void;
  reset: () => void;
};

// Initial state
const initialState = {
  customReports: [
    {
      id: "1",
      title: "Q1 2025 Revenue Deep Dive",
      href: "/dashboard/reporting/custom/q1-2025-revenue",
      description: "Comprehensive revenue analysis for Q1 2025",
      createdAt: new Date("2025-01-15"),
      updatedAt: new Date("2025-01-15"),
    },
    {
      id: "2",
      title: "Top 10 Customers Analysis",
      href: "/dashboard/reporting/custom/top-10-customers",
      description: "Performance analysis of top 10 customers",
      createdAt: new Date("2025-01-20"),
      updatedAt: new Date("2025-01-20"),
    },
    {
      id: "3",
      title: "Service Call Response Times",
      href: "/dashboard/reporting/custom/response-times",
      description: "Response time metrics across all service calls",
      createdAt: new Date("2025-01-22"),
      updatedAt: new Date("2025-01-22"),
    },
  ],
  activeReportId: null,
  isCreatingReport: false,
};

// Create store
export const useReportingStore = create<ReportingStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setCustomReports: (reports) => set({ customReports: reports }),

        addCustomReport: (report) => {
          const newReport: CustomReport = {
            ...report,
            id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set((state) => ({
            customReports: [...state.customReports, newReport],
          }));
        },

        updateCustomReport: (id, updates) => {
          set((state) => ({
            customReports: state.customReports.map((report) =>
              report.id === id
                ? { ...report, ...updates, updatedAt: new Date() }
                : report
            ),
          }));
        },

        deleteCustomReport: (id) => {
          set((state) => ({
            customReports: state.customReports.filter(
              (report) => report.id !== id
            ),
            activeReportId:
              state.activeReportId === id ? null : state.activeReportId,
          }));
        },

        setActiveReport: (id) => set({ activeReportId: id }),

        setIsCreatingReport: (isCreating) =>
          set({ isCreatingReport: isCreating }),

        reset: () => set(initialState),
      }),
      {
        name: "reporting-storage",
        partialize: (state) => ({
          customReports: state.customReports,
        }),
      }
    ),
    { name: "ReportingStore" }
  )
);

// Selectors for optimized subscriptions
export const reportingSelectors = {
  customReports: (state: ReportingStore) => state.customReports,
  activeReportId: (state: ReportingStore) => state.activeReportId,
  isCreatingReport: (state: ReportingStore) => state.isCreatingReport,
  getReportById: (id: string) => (state: ReportingStore) =>
    state.customReports.find((report) => report.id === id),
};
