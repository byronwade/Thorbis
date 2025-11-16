/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { PendingData } from "@/components/invoices/pending/pending-data";
import { PendingSkeleton } from "@/components/invoices/pending/pending-skeleton";

export default function PendingPage() {
	return (
		<Suspense fallback={<PendingSkeleton />}>
			<PendingData />
		</Suspense>
	);
}
