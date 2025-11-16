/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { OperationsData } from "@/components/operations/main-data";
import { OperationsSkeleton } from "@/components/operations/main-skeleton";

export default function OperationsPage() {
	return (
		<Suspense fallback={<OperationsSkeleton />}>
			<OperationsData />
		</Suspense>
	);
}
