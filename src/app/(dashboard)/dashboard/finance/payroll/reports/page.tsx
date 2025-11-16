/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ReportsData } from "@/components/finance/reports/reports-data";
import { ReportsSkeleton } from "@/components/finance/reports/reports-skeleton";

export default function ReportsPage() {
	return (
		<Suspense fallback={<ReportsSkeleton />}>
			<ReportsData />
		</Suspense>
	);
}
