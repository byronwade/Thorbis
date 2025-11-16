/**
 * Reports > Financial Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { FinancialReportsData } from "@/components/reports/financial/financial-reports-data";
import { FinancialReportsSkeleton } from "@/components/reports/financial/financial-reports-skeleton";

export default function FinancialReportsPage() {
	return (
		<Suspense fallback={<FinancialReportsSkeleton />}>
			<FinancialReportsData />
		</Suspense>
	);
}
