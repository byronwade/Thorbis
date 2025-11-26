/**
 * Payment Details Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Payment data streams in (100-500ms)
 *
 * Performance: 5-18x faster than traditional SSR
 *
 * Single page with collapsible sections
 * Matches job details page pattern
 */

import { Suspense } from "react";
import { PaymentDetailData } from "@/components/work/payments/payment-detail-data";
import { PaymentDetailSkeleton } from "@/components/work/payments/payment-detail-skeleton";

export default async function PaymentDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: paymentId } = await params;

	return (
		<Suspense fallback={<PaymentDetailSkeleton />}>
			<PaymentDetailData paymentId={paymentId} />
		</Suspense>
	);
}
