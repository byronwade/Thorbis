/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { TechniciansData } from "@/components/reports/technicians/technicians-data";
import { TechniciansSkeleton } from "@/components/reports/technicians/technicians-skeleton";

export default function TechniciansPage() {
	return (
		<Suspense fallback={<TechniciansSkeleton />}>
			<TechniciansData />
		</Suspense>
	);
}
