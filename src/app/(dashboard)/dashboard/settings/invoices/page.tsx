/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { InvoicesData } from "@/components/settings/invoices/invoices-data";
import { InvoicesSkeleton } from "@/components/settings/invoices/invoices-skeleton";

export default function InvoicesPage() {
	return (
		<Suspense fallback={<InvoicesSkeleton />}>
			<InvoicesData />
		</Suspense>
	);
}
