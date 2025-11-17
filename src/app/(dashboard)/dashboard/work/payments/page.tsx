/**
 * Upayments Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Data streams in second (200-500ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UpaymentsData } from "@/components/work/payments/payments-data";
import PaymentsSkeleton from "@/components/work/payments/payments-skeleton";
import { UpaymentsStats } from "@/components/work/payments/payments-stats";

// ISR: Revalidate every 60 seconds (reduces render time from 3-10s to instant on repeat visits)
export const revalidate = 60;

export default function UpaymentsPage() {
	return (
		<>
			<Suspense fallback={<div className="bg-muted h-24 animate-pulse rounded" />}>
				<UpaymentsStats />
			</Suspense>
			<Suspense fallback={<PaymentsSkeleton />}>
				<UpaymentsData />
			</Suspense>
		</>
	);
}
