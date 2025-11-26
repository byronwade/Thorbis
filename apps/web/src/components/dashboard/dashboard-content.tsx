import { Suspense } from "react";
import { PinBoardSection } from "@/components/dashboard/pin-board";
import { PinBoardSkeleton } from "@/components/dashboard/pin-board/pin-board-skeleton";
import { RoleBasedDashboard } from "@/components/dashboard/role-based-dashboard";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getMissionControlData } from "@/lib/queries/mission-control-data";

/**
 * Dashboard Content - Async Server Component
 *
 * Fetches dashboard data and streams in after shell renders.
 * This component is wrapped in Suspense, so it doesn't block the initial page load.
 */
export async function DashboardContent() {
	// Fetch company ID and data server-side
	const companyId = await getActiveCompanyId();
	const dashboardData = companyId
		? await getMissionControlData(companyId)
		: null;

	// Capture the render timestamp so client components can format relative times
	const renderedAt = Date.now();

	return (
		<div className="space-y-6">
			<RoleBasedDashboard
				dashboardData={dashboardData}
				renderedAt={renderedAt}
			/>

			{/* Pin Board / Content Portal - Streams independently */}
			<Suspense fallback={<PinBoardSkeleton />}>
				<PinBoardSection />
			</Suspense>
		</div>
	);
}
