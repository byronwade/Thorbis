/**
 * Communication Statistics Dashboard
 * 
 * Displays charts and statistics for all communication channels
 * Supports different report views via URL query parameters
 */

import { Suspense } from "react";
import { CommunicationStatsDashboard } from "@/components/communication/communication-stats-dashboard";
import { CommunicationStatsSkeleton } from "@/components/communication/communication-stats-skeleton";

export default function CommunicationStatsPage() {
	return (
		<div className="flex w-full flex-col">
			<Suspense fallback={<CommunicationStatsSkeleton />}>
				<CommunicationStatsDashboard />
			</Suspense>
		</div>
	);
}
