/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { TechniciansData } from "@/components/communication/technicians/technicians-data";
import { TechniciansSkeleton } from "@/components/communication/technicians/technicians-skeleton";

export default function TechniciansPage() {
	return (
		<Suspense fallback={<TechniciansSkeleton />}>
			<TechniciansData />
		</Suspense>
	);
}
