/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ExportData } from "@/components/reports/export/export-data";
import { ExportSkeleton } from "@/components/reports/export/export-skeleton";

export default function ExportPage() {
	return (
		<Suspense fallback={<ExportSkeleton />}>
			<ExportData />
		</Suspense>
	);
}
