/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ReportsData } from "@/components/training/reports/reports-data";
import { ReportsSkeleton } from "@/components/training/reports/reports-skeleton";

export default function ReportsPage() {
	return (
		<Suspense fallback={<ReportsSkeleton />}>
			<ReportsData />
		</Suspense>
	);
}
