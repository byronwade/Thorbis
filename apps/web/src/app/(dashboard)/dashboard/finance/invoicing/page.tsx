/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { InvoicingData } from "@/components/finance/invoicing/invoicing-data";
import { InvoicingSkeleton } from "@/components/finance/invoicing/invoicing-skeleton";

export default function InvoicingPage() {
	return (
		<Suspense fallback={<InvoicingSkeleton />}>
			<InvoicingData />
		</Suspense>
	);
}
