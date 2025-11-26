/**
 * Schedule View Store - Zustand State Management
 * Optimized for timeline-only view with performant infinite scroll
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type TimelineViewMode = "day" | "week" | "month" | "list" | "map";
type TimelineZoomLevel = 15 | 30 | 60;

// Buffer configuration for infinite scroll (PERFORMANCE TUNED)
const BUFFER_DAYS_BEFORE = 3; // Initial days to load before current date
const BUFFER_DAYS_AFTER = 3; // Initial days to load after current date
const EXTEND_DAYS = 3; // Days to add when extending buffer (reduces state updates)
const MAX_BUFFER_DAYS = 14; // Maximum buffer size before trimming (prevents memory bloat)

type ScheduleViewStore = {
	viewMode: TimelineViewMode;
	currentDate: Date;
	zoomLevel: TimelineZoomLevel;
	showTravelTime: boolean;
	showCapacity: boolean;
	// Infinite scroll buffer state
	bufferStartDate: Date;
	bufferEndDate: Date;
	setViewMode: (mode: TimelineViewMode) => void;
	setCurrentDate: (date: Date) => void;
	setZoomLevel: (level: TimelineZoomLevel) => void;
	toggleTravelTime: () => void;
	toggleCapacity: () => void;
	goToToday: () => void;
	navigatePrevious: () => void;
	navigateNext: () => void;
	// Buffer management for infinite scroll
	extendBufferLeft: () => void;
	extendBufferRight: () => void;
	trimBuffer: (centerDate: Date) => void;
	resetBuffer: () => void;
	reset: () => void;
};

// Detect mobile viewport and set default view accordingly
// List view is more mobile-friendly than day view
const getDefaultViewMode = (): TimelineViewMode => {
	if (typeof window === "undefined") return "day"; // SSR fallback
	return window.innerWidth < 768 ? "list" : "day";
};

// Helper to create buffer dates around a center date
const createBufferDates = (centerDate: Date) => {
	const start = new Date(centerDate);
	start.setDate(start.getDate() - BUFFER_DAYS_BEFORE);
	start.setHours(0, 0, 0, 0);

	const end = new Date(centerDate);
	end.setDate(end.getDate() + BUFFER_DAYS_AFTER);
	end.setHours(23, 59, 59, 999);

	return { bufferStartDate: start, bufferEndDate: end };
};

const now = new Date();
const { bufferStartDate, bufferEndDate } = createBufferDates(now);

const initialState = {
	viewMode: getDefaultViewMode(),
	currentDate: new Date(),
	zoomLevel: 30 as TimelineZoomLevel, // 30-minute intervals default
	showTravelTime: true,
	showCapacity: true,
	bufferStartDate,
	bufferEndDate,
};

export const useScheduleViewStore = create<ScheduleViewStore>()(
	devtools(
		persist(
			(set, get) => ({
				...initialState,

				setViewMode: (mode) => set({ viewMode: mode }),

				setCurrentDate: (date) => {
					// Update buffer when current date changes
					const { bufferStartDate, bufferEndDate } = createBufferDates(date);
					set({ currentDate: date, bufferStartDate, bufferEndDate });
				},

				setZoomLevel: (level) => set({ zoomLevel: level }),

				toggleTravelTime: () =>
					set((state) => ({ showTravelTime: !state.showTravelTime })),

				toggleCapacity: () =>
					set((state) => ({ showCapacity: !state.showCapacity })),

				goToToday: () => {
					const today = new Date();
					const { bufferStartDate, bufferEndDate } = createBufferDates(today);
					set({ currentDate: today, bufferStartDate, bufferEndDate });
				},

				navigatePrevious: () => {
					const { currentDate, viewMode } = get();
					const newDate = new Date(currentDate);
					if (viewMode === "day" || viewMode === "list") {
						newDate.setDate(newDate.getDate() - 1);
					} else if (viewMode === "week") {
						newDate.setDate(newDate.getDate() - 7);
					} else {
						newDate.setMonth(newDate.getMonth() - 1);
					}
					const { bufferStartDate, bufferEndDate } = createBufferDates(newDate);
					set({ currentDate: newDate, bufferStartDate, bufferEndDate });
				},

				navigateNext: () => {
					const { currentDate, viewMode } = get();
					const newDate = new Date(currentDate);
					if (viewMode === "day" || viewMode === "list") {
						newDate.setDate(newDate.getDate() + 1);
					} else if (viewMode === "week") {
						newDate.setDate(newDate.getDate() + 7);
					} else {
						newDate.setMonth(newDate.getMonth() + 1);
					}
					const { bufferStartDate, bufferEndDate } = createBufferDates(newDate);
					set({ currentDate: newDate, bufferStartDate, bufferEndDate });
				},

				// Extend buffer to the left (earlier dates) for infinite scroll
				// Extends by EXTEND_DAYS at once to reduce state update frequency
				extendBufferLeft: () => {
					const { bufferStartDate, bufferEndDate } = get();
					const newStart = new Date(bufferStartDate);
					newStart.setDate(newStart.getDate() - EXTEND_DAYS);

					// Check if buffer would exceed max size, trim from right if so
					const totalDays = Math.ceil(
						(bufferEndDate.getTime() - newStart.getTime()) /
							(1000 * 60 * 60 * 24),
					);
					if (totalDays > MAX_BUFFER_DAYS) {
						const newEnd = new Date(bufferEndDate);
						newEnd.setDate(newEnd.getDate() - (totalDays - MAX_BUFFER_DAYS));
						set({ bufferStartDate: newStart, bufferEndDate: newEnd });
					} else {
						set({ bufferStartDate: newStart });
					}
				},

				// Extend buffer to the right (later dates) for infinite scroll
				// Extends by EXTEND_DAYS at once to reduce state update frequency
				extendBufferRight: () => {
					const { bufferStartDate, bufferEndDate } = get();
					const newEnd = new Date(bufferEndDate);
					newEnd.setDate(newEnd.getDate() + EXTEND_DAYS);

					// Check if buffer would exceed max size, trim from left if so
					const totalDays = Math.ceil(
						(newEnd.getTime() - bufferStartDate.getTime()) /
							(1000 * 60 * 60 * 24),
					);
					if (totalDays > MAX_BUFFER_DAYS) {
						const newStart = new Date(bufferStartDate);
						newStart.setDate(
							newStart.getDate() + (totalDays - MAX_BUFFER_DAYS),
						);
						set({ bufferStartDate: newStart, bufferEndDate: newEnd });
					} else {
						set({ bufferEndDate: newEnd });
					}
				},

				// Trim buffer to MAX_BUFFER_DAYS centered around the given date
				trimBuffer: (centerDate: Date) => {
					const { bufferStartDate, bufferEndDate } = get();
					const totalDays = Math.ceil(
						(bufferEndDate.getTime() - bufferStartDate.getTime()) /
							(1000 * 60 * 60 * 24),
					);

					if (totalDays <= MAX_BUFFER_DAYS) return;

					const halfMax = Math.floor(MAX_BUFFER_DAYS / 2);
					const newStart = new Date(centerDate);
					newStart.setDate(newStart.getDate() - halfMax);
					newStart.setHours(0, 0, 0, 0);

					const newEnd = new Date(centerDate);
					newEnd.setDate(newEnd.getDate() + halfMax);
					newEnd.setHours(23, 59, 59, 999);

					set({ bufferStartDate: newStart, bufferEndDate: newEnd });
				},

				// Reset buffer to default around current date
				resetBuffer: () => {
					const { currentDate } = get();
					const { bufferStartDate, bufferEndDate } =
						createBufferDates(currentDate);
					set({ bufferStartDate, bufferEndDate });
				},

				reset: () => set(initialState),
			}),
			{
				name: "schedule-view-store",
				skipHydration: true, // CRITICAL: Prevents hydration mismatch with Next.js 16
				// Don't persist buffer dates - they should be recalculated on load
				partialize: (state) => ({
					viewMode: state.viewMode,
					currentDate: state.currentDate,
					zoomLevel: state.zoomLevel,
					showTravelTime: state.showTravelTime,
					showCapacity: state.showCapacity,
				}),
			},
		),
		{ name: "ScheduleViewStore" },
	),
);

// Export types
export type { TimelineViewMode, TimelineZoomLevel };
