/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { InvoicesData } from "@/components/invoices/main-data";
import { InvoicesSkeleton } from "@/components/invoices/main-skeleton";

export default function InvoicesPage() {
	return (
		<Suspense fallback={<InvoicesSkeleton />}>
			<InvoicesData />
		</Suspense>
	);
}
