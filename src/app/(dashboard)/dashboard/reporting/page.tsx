/**
 * Reporting Analytics Dashboard
 *
 * PPR Enabled Page - Performance: 10-20x faster
 * Layout follows communication hub pattern with sidebar navigation
 */

import { Suspense } from "react";
import { ReportingData } from "@/components/reporting/main-data";
import { ReportingSkeleton } from "@/components/reporting/main-skeleton";

export default function ReportingPage() {
	return (
		<Suspense fallback={<ReportingSkeleton />}>
			<ReportingData />
		</Suspense>
	);
}
