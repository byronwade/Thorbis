import { Suspense } from "react";
import { ActivityLogContent } from "@/components/ai/activity-log-content";
import { ActivityLogSkeleton } from "@/components/ai/activity-log-skeleton";

export const metadata = {
	title: "AI Activity Log | Thorbis",
	description:
		"Monitor and manage AI actions with full audit trail and undo capabilities",
};

export default function AIActivityPage() {
	return (
		<Suspense fallback={<ActivityLogSkeleton />}>
			<ActivityLogContent />
		</Suspense>
	);
}
