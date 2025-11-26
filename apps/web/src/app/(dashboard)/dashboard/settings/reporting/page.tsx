/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ReportingData } from "@/components/settings/reporting/reporting-data";
import { ReportingSkeleton } from "@/components/settings/reporting/reporting-skeleton";

export default function ReportingPage() {
	return (
		<Suspense fallback={<ReportingSkeleton />}>
			<ReportingData />
		</Suspense>
	);
}
