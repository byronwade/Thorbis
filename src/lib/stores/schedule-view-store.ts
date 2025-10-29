/**
 * Schedule View Store - Zustand State Management
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Selective subscriptions prevent unnecessary re-renders
 *
 * Manages schedule view state (timeline, calendar, list, board)
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ScheduleView } from "@/types/schedule";

type ScheduleViewStore = {
  view: ScheduleView;
  setView: (view: ScheduleView) => void;
  reset: () => void;
};

const initialState = {
  view: "timeline" as ScheduleView,
};

export const useScheduleViewStore = create<ScheduleViewStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setView: (view) => set({ view }),

      reset: () => set(initialState),
    }),
    { name: "ScheduleViewStore" } // DevTools name
  )
);
