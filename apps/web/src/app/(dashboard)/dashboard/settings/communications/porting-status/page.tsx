/**
 * Porting Status Page
 *
 * Dedicated page for tracking phone number porting requests:
 * - View all active porting requests
 * - Track progress with visual timeline
 * - Receive real-time status updates
 * - Access troubleshooting help
 */

import { Suspense } from "react";
import { AppToolbar } from "@/components/layout/app-toolbar";
import { PortingStatusDashboard } from "@/components/telnyx/porting-status-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
	title: "Number Porting Status | Communications Settings",
	description: "Track the progress of your phone number porting requests",
};

export default function PortingStatusPage() {
	return (
		<div className="flex h-full flex-col">
			{/* Page Header */}
			<AppToolbar config={{ show: true, title: "Number Porting Status" }} />

			{/* Porting Status Dashboard */}
			<div className="flex-1 overflow-auto">
				<Suspense fallback={<PortingStatusSkeleton />}>
					<PortingStatusDashboard />
				</Suspense>
			</div>
		</div>
	);
}

function PortingStatusSkeleton() {
	return (
		<div className="space-y-4 p-6">
			<Skeleton className="h-8 w-64" />
			<Skeleton className="h-4 w-96" />
			{[...new Array(3)].map((_, i) => (
				<Skeleton className="h-40 w-full" key={i} />
			))}
		</div>
	);
}
