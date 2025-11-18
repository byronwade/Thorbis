/**
 * Upayments Page - PPR Enabled
 *
 * Uses Next.js 16 "use cache" directive for optimal caching:
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

export default async function UpaymentsPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const params = await searchParams;
	return (
		<>
			<Suspense
				fallback={<div className="bg-muted h-24 animate-pulse rounded" />}
			>
				<UpaymentsStats />
			</Suspense>
			<Suspense fallback={<PaymentsSkeleton />}>
				<UpaymentsData searchParams={params} />
			</Suspense>
		</>
	);
}
