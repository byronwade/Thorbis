"use client";

import { useEffect, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScheduleKeyboardShortcuts } from "@/hooks/use-schedule-keyboard-shortcuts";
import type { ScheduleBootstrapSerialized } from "@/lib/schedule-bootstrap";
import { deserializeScheduleBootstrap } from "@/lib/schedule-bootstrap";
import { useScheduleStore } from "@/lib/stores/schedule-store";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { DispatchMapLazy as DispatchMapView } from "./dispatch-map/dispatch-map-lazy";
import { DispatchTimelineLazy as DispatchTimeline } from "./dispatch-timeline-lazy";
import { KanbanViewLazy as KanbanView } from "./kanban-view-lazy";
import { DayViewMobile } from "./mobile/day-view-mobile";
import { KanbanViewMobile } from "./mobile/kanban-view-mobile";
import { ListViewMobile } from "./mobile/list-view-mobile";
import { MonthlyViewMobile } from "./mobile/monthly-view-mobile";
import { MonthlyViewLazy as MonthlyView } from "./monthly-view-lazy";

type SchedulePageClientProps = {
	initialData?: ScheduleBootstrapSerialized;
	bootstrapError?: string | null;
};

export function SchedulePageClient({
	initialData,
	bootstrapError,
}: SchedulePageClientProps) {
	const hydrateFromServer = useScheduleStore(
		(state) => state.hydrateFromServer,
	);
	const { viewMode } = useScheduleViewStore();
	const isMobile = useIsMobile(); // Detect mobile viewport (<768px)
	const payload = useMemo(
		() => (initialData ? deserializeScheduleBootstrap(initialData) : null),
		[initialData],
	);

	// Enable keyboard shortcuts (T=today, N=new, [/]=nav, 1/2/3=views)
	useScheduleKeyboardShortcuts();

	useEffect(() => {
		if (payload) {
			hydrateFromServer(payload);
		}
	}, [hydrateFromServer, payload]);

	return (
		<div className="m-0 flex h-full w-full flex-1 flex-col overflow-hidden p-0">
			{bootstrapError && (
				<Alert
					className="mx-3 md:mx-4 mt-2 mb-3 md:mb-4 max-w-2xl self-center"
					variant="destructive"
				>
					<AlertTitle>Live schedule data unavailable</AlertTitle>
					<AlertDescription>
						{bootstrapError}. Showing the scheduler without preloaded jobs—use
						the refresh controls after fixing the issue.
					</AlertDescription>
				</Alert>
			)}

			{/*
				Mobile vs Desktop Routing:
				- Mobile (<768px): Use mobile-optimized views with vertical scrolling, tap actions
				- Desktop (≥768px): Use existing drag & drop timeline/kanban/month views

				Mobile views:
				- List view: ✅ Primary mobile view (vertical scrolling, search/filter)
				- Day view: ✅ Vertical timeline with collapsible tech sections
				- Week view: ✅ Single-column kanban with swipe navigation
				- Month view: ✅ Touch-friendly calendar grid with day detail bottom sheets
			*/}
			{isMobile ? (
				<>
					{viewMode === "list" ? (
						<ListViewMobile />
					) : viewMode === "day" ? (
						<DayViewMobile />
					) : viewMode === "week" ? (
						<KanbanViewMobile />
					) : viewMode === "month" ? (
						<MonthlyViewMobile />
					) : viewMode === "map" ? (
						<DispatchMapView />
					) : (
						// Fallback: Use list view for unknown modes
						<ListViewMobile />
					)}
				</>
			) : (
				<>
					{/* Desktop views (unchanged) */}
					{viewMode === "month" ? (
						<MonthlyView />
					) : viewMode === "week" ? (
						<KanbanView />
					) : viewMode === "list" ? (
						// Desktop users can access list view too
						<ListViewMobile />
					) : viewMode === "map" ? (
						<DispatchMapView />
					) : (
						<DispatchTimeline />
					)}
				</>
			)}
		</div>
	);
}
