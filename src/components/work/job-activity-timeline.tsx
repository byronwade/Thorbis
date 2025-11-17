"use client";

/**
 * Job Activity Timeline Wrapper - Client Component
 *
 * Fetches and displays activity timeline for a specific job
 * This component handles data fetching and passes it to ActivityTimeline
 */

import { useEffect, useState } from "react";
import { getActivities } from "@/actions/activity";
import type { Activity } from "@/types/activity";
import { ActivityTimeline } from "./activity-timeline";

type JobActivityTimelineProps = {
	jobId: string;
	entityType?: "job" | "customer" | "invoice" | "estimate";
};

export function JobActivityTimeline({ jobId, entityType = "job" }: JobActivityTimelineProps) {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchActivities() {
			try {
				setIsLoading(true);
				const result = await getActivities({
					entityType,
					entityId: jobId,
				});

				if (result.success && result.activities) {
					setActivities(result.activities as Activity[]);
				} else {
					setError(result.error || "Failed to load activities");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load activities");
			} finally {
				setIsLoading(false);
			}
		}

		fetchActivities();
	}, [jobId, entityType]);

	if (error) {
		return (
			<div className="flex h-96 items-center justify-center">
				<div className="text-center">
					<p className="text-destructive font-semibold">Error loading activities</p>
					<p className="text-muted-foreground mt-2 text-sm">{error}</p>
				</div>
			</div>
		);
	}

	return <ActivityTimeline activities={activities} isLoading={isLoading} />;
}
