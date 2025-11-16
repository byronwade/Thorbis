/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { PaymentsData } from "@/components/finance/payments/payments-data";
import { PaymentsSkeleton } from "@/components/finance/payments/payments-skeleton";

export default function PaymentsPage() {
	return (
		<Suspense fallback={<PaymentsSkeleton />}>
			<PaymentsData />
		</Suspense>
	);
}
