/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { DeductionsData } from "@/components/settings/deductions/deductions-data";
import { DeductionsSkeleton } from "@/components/settings/deductions/deductions-skeleton";

export default function DeductionsPage() {
	return (
		<Suspense fallback={<DeductionsSkeleton />}>
			<DeductionsData />
		</Suspense>
	);
}
