/**
 * Gantt Scheduler Store - Zustand State Management
 * Manages Gantt scheduler view state (date, view type, filters)
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

type GanttViewType = "day" | "week" | "month";

type GanttSchedulerStore = {
	currentDate: Date;
	view: GanttViewType;
	selectedTechnicianId: string;
	statusFilter: string;
	highlightUnassigned: boolean;
	showOverloadedOnly: boolean;
	setCurrentDate: (date: Date) => void;
	setView: (view: GanttViewType) => void;
	setSelectedTechnicianId: (id: string) => void;
	setStatusFilter: (status: string) => void;
	toggleHighlightUnassigned: () => void;
	toggleShowOverloadedOnly: () => void;
	handlePrevious: () => void;
	handleNext: () => void;
	handleToday: () => void;
};

export const useGanttSchedulerStore = create<GanttSchedulerStore>()(
	devtools(
		(set, get) => ({
			currentDate: new Date(),
			view: "day",
			selectedTechnicianId: "",
			statusFilter: "",
			highlightUnassigned: false,
			showOverloadedOnly: false,

			setCurrentDate: (date) => set({ currentDate: date }),

			setView: (view) => set({ view }),

			setSelectedTechnicianId: (id) => set({ selectedTechnicianId: id }),

			setStatusFilter: (status) => set({ statusFilter: status }),

			toggleHighlightUnassigned: () =>
				set((state) => ({ highlightUnassigned: !state.highlightUnassigned })),

			toggleShowOverloadedOnly: () =>
				set((state) => ({ showOverloadedOnly: !state.showOverloadedOnly })),

			handlePrevious: () => {
				const { currentDate, view } = get();
				const prevDate = new Date(currentDate);
				if (view === "day") {
					prevDate.setDate(prevDate.getDate() - 1);
				} else if (view === "week") {
					prevDate.setDate(prevDate.getDate() - 7);
				} else {
					// month
					prevDate.setMonth(prevDate.getMonth() - 1);
				}
				set({ currentDate: prevDate });
			},

			handleNext: () => {
				const { currentDate, view } = get();
				const nextDate = new Date(currentDate);
				if (view === "day") {
					nextDate.setDate(nextDate.getDate() + 1);
				} else if (view === "week") {
					nextDate.setDate(nextDate.getDate() + 7);
				} else {
					// month
					nextDate.setMonth(nextDate.getMonth() + 1);
				}
				set({ currentDate: nextDate });
			},

			handleToday: () => set({ currentDate: new Date() }),
		}),
		{ name: "GanttSchedulerStore" },
	),
);
