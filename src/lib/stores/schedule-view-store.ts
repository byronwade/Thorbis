/**
 * Schedule View Store - Zustand State Management
 * Simplified for timeline-only view
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type TimelineViewMode = "day" | "week" | "month";

type ScheduleViewStore = {
	viewMode: TimelineViewMode;
	currentDate: Date;
	setViewMode: (mode: TimelineViewMode) => void;
	setCurrentDate: (date: Date) => void;
	goToToday: () => void;
	navigatePrevious: () => void;
	navigateNext: () => void;
	reset: () => void;
};

const initialState = {
	viewMode: "day" as TimelineViewMode,
	currentDate: new Date(),
};

export const useScheduleViewStore = create<ScheduleViewStore>()(
	devtools(
		persist(
			(set, get) => ({
				...initialState,

				setViewMode: (mode) => set({ viewMode: mode }),

				setCurrentDate: (date) => set({ currentDate: date }),

				goToToday: () => set({ currentDate: new Date() }),

				navigatePrevious: () => {
					const { currentDate, viewMode } = get();
					const newDate = new Date(currentDate);
					if (viewMode === "day") {
						newDate.setDate(newDate.getDate() - 1);
					} else if (viewMode === "week") {
						newDate.setDate(newDate.getDate() - 7);
					} else {
						newDate.setMonth(newDate.getMonth() - 1);
					}
					set({ currentDate: newDate });
				},

				navigateNext: () => {
					const { currentDate, viewMode } = get();
					const newDate = new Date(currentDate);
					if (viewMode === "day") {
						newDate.setDate(newDate.getDate() + 1);
					} else if (viewMode === "week") {
						newDate.setDate(newDate.getDate() + 7);
					} else {
						newDate.setMonth(newDate.getMonth() + 1);
					}
					set({ currentDate: newDate });
				},

				reset: () => set(initialState),
			}),
			{
				name: "schedule-view-store",
				skipHydration: true, // CRITICAL: Prevents hydration mismatch with Next.js 16
			}
		),
		{ name: "ScheduleViewStore" }
	)
);
