import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type ZoomLevel = number; // 5 - 500 (percentage)

export type ViewFilters = {
	technicianIds: string[];
	statuses: Array<"scheduled" | "in-progress" | "completed" | "cancelled">;
	priorities: Array<"low" | "medium" | "high" | "urgent">;
	searchQuery: string;
};

type ViewState = {
	// Zoom and timeline
	zoom: ZoomLevel;
	currentDate: Date;

	// Filters
	filters: ViewFilters;

	// UI State
	sidebarCollapsed: boolean;
	showCompletedJobs: boolean;
	showConflicts: boolean;
	showTravelTime: boolean;

	// View preferences
	workingHoursStart: number; // 0-23 (hour)
	workingHoursEnd: number; // 0-23 (hour)

	// Actions - Zoom
	setZoom: (zoom: ZoomLevel) => void;
	zoomIn: () => void;
	zoomOut: () => void;
	resetZoom: () => void;

	// Actions - Navigation
	setCurrentDate: (date: Date) => void;
	goToToday: () => void;
	goToDate: (date: Date) => void;
	navigateDays: (days: number) => void;

	// Actions - Filters
	setFilters: (filters: Partial<ViewFilters>) => void;
	resetFilters: () => void;
	toggleTechnicianFilter: (technicianId: string) => void;
	setSearchQuery: (query: string) => void;

	// Actions - UI
	toggleSidebar: () => void;
	setSidebarCollapsed: (collapsed: boolean) => void;
	toggleCompletedJobs: () => void;
	toggleConflicts: () => void;
	toggleTravelTime: () => void;

	// Actions - Working hours
	setWorkingHours: (start: number, end: number) => void;

	// Helpers
	getVisibleTimeRange: () => { start: Date; end: Date };
	isFiltered: () => boolean;
};

const defaultFilters: ViewFilters = {
	technicianIds: [],
	statuses: [],
	priorities: [],
	searchQuery: "",
};

export const useViewStore = create<ViewState>()(
	devtools(
		persist(
			(set, get) => ({
				// Initial state
				zoom: 100,
				currentDate: new Date(),
				filters: defaultFilters,
				sidebarCollapsed: false,
				showCompletedJobs: true,
				showConflicts: true,
				showTravelTime: false,
				workingHoursStart: 7, // 7 AM
				workingHoursEnd: 19, // 7 PM

				// Zoom actions
				setZoom: (zoom) => {
					const clampedZoom = Math.max(5, Math.min(500, zoom));
					set({ zoom: clampedZoom });
				},

				zoomIn: () => {
					const currentZoom = get().zoom;
					const newZoom = Math.min(500, currentZoom * 1.2);
					set({ zoom: newZoom });
				},

				zoomOut: () => {
					const currentZoom = get().zoom;
					const newZoom = Math.max(5, currentZoom / 1.2);
					set({ zoom: newZoom });
				},

				resetZoom: () => set({ zoom: 100 }),

				// Navigation actions
				setCurrentDate: (date) => set({ currentDate: date }),

				goToToday: () => set({ currentDate: new Date() }),

				goToDate: (date) => set({ currentDate: date }),

				navigateDays: (days) => {
					const current = get().currentDate;
					const newDate = new Date(current);
					newDate.setDate(newDate.getDate() + days);
					set({ currentDate: newDate });
				},

				// Filter actions
				setFilters: (updates) => {
					set((state) => ({
						filters: { ...state.filters, ...updates },
					}));
				},

				resetFilters: () => set({ filters: defaultFilters }),

				toggleTechnicianFilter: (technicianId) => {
					set((state) => {
						const current = state.filters.technicianIds;
						const updated = current.includes(technicianId)
							? current.filter((id) => id !== technicianId)
							: [...current, technicianId];

						return {
							filters: {
								...state.filters,
								technicianIds: updated,
							},
						};
					});
				},

				setSearchQuery: (query) => {
					set((state) => ({
						filters: {
							...state.filters,
							searchQuery: query,
						},
					}));
				},

				// UI actions
				toggleSidebar: () => {
					set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
				},

				setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

				toggleCompletedJobs: () => {
					set((state) => ({ showCompletedJobs: !state.showCompletedJobs }));
				},

				toggleConflicts: () => {
					set((state) => ({ showConflicts: !state.showConflicts }));
				},

				toggleTravelTime: () => {
					set((state) => ({ showTravelTime: !state.showTravelTime }));
				},

				// Working hours
				setWorkingHours: (start, end) => {
					set({
						workingHoursStart: Math.max(0, Math.min(23, start)),
						workingHoursEnd: Math.max(0, Math.min(23, end)),
					});
				},

				// Helpers
				getVisibleTimeRange: () => {
					const { currentDate, zoom } = get();

					// Calculate visible range based on zoom level
					// Lower zoom = more days visible, higher zoom = fewer days/more hours
					let daysVisible: number;

					if (zoom < 50) {
						daysVisible = 90; // ~3 months
					} else if (zoom < 100) {
						daysVisible = 30; // 1 month
					} else if (zoom < 200) {
						daysVisible = 7; // 1 week
					} else if (zoom < 400) {
						daysVisible = 1; // 1 day (hourly view)
					} else {
						daysVisible = 0.5; // Half day (detailed hourly)
					}

					const start = new Date(currentDate);
					start.setDate(start.getDate() - Math.floor(daysVisible / 2));
					start.setHours(0, 0, 0, 0);

					const end = new Date(currentDate);
					end.setDate(end.getDate() + Math.ceil(daysVisible / 2));
					end.setHours(23, 59, 59, 999);

					return { start, end };
				},

				isFiltered: () => {
					const { filters } = get();
					return (
						filters.technicianIds.length > 0 ||
						filters.statuses.length > 0 ||
						filters.priorities.length > 0 ||
						filters.searchQuery.trim() !== ""
					);
				},
			}),
			{
				name: "view-storage",
				partialize: (state) => ({
					zoom: state.zoom,
					sidebarCollapsed: state.sidebarCollapsed,
					showCompletedJobs: state.showCompletedJobs,
					showConflicts: state.showConflicts,
					showTravelTime: state.showTravelTime,
					workingHoursStart: state.workingHoursStart,
					workingHoursEnd: state.workingHoursEnd,
				}),
			}
		)
	)
);
