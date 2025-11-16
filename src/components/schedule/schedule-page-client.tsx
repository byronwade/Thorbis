"use client";

import { useEffect, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ScheduleBootstrapSerialized } from "@/lib/schedule-bootstrap";
import { deserializeScheduleBootstrap } from "@/lib/schedule-bootstrap";
import { useScheduleStore } from "@/lib/stores/schedule-store";
import { useScheduleViewStore } from "@/lib/stores/schedule-view-store";
import { DispatchTimeline } from "./dispatch-timeline";
import { KanbanView } from "./kanban-view";
import { MonthlyView } from "./monthly-view";

type SchedulePageClientProps = {
	initialData?: ScheduleBootstrapSerialized;
	bootstrapError?: string | null;
};

export function SchedulePageClient({ initialData, bootstrapError }: SchedulePageClientProps) {
	const hydrateFromServer = useScheduleStore((state) => state.hydrateFromServer);
	const { viewMode } = useScheduleViewStore();
	const payload = useMemo(() => (initialData ? deserializeScheduleBootstrap(initialData) : null), [initialData]);

	useEffect(() => {
		if (payload) {
			hydrateFromServer(payload);
		}
	}, [hydrateFromServer, payload]);

	return (
		<div className="m-0 flex h-full w-full flex-1 flex-col overflow-hidden p-0">
			{bootstrapError && (
				<Alert className="mx-4 mt-2 mb-4 max-w-2xl self-center" variant="destructive">
					<AlertTitle>Live schedule data unavailable</AlertTitle>
					<AlertDescription>
						{bootstrapError}. Showing the scheduler without preloaded jobs—use the refresh controls after fixing the
						issue.
					</AlertDescription>
				</Alert>
			)}

			{viewMode === "month" ? <MonthlyView /> : viewMode === "week" ? <KanbanView /> : <DispatchTimeline />}
		</div>
	);
}
