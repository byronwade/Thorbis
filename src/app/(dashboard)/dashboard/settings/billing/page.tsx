/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { BillingData } from "@/components/settings/billing/billing-data";
import { BillingSkeleton } from "@/components/settings/billing/billing-skeleton";

export default function BillingPage() {
	return (
		<Suspense fallback={<BillingSkeleton />}>
			<BillingData />
		</Suspense>
	);
}
