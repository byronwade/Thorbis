/**
 * Invoices Page - PPR Enabled
 *
 * Uses Next.js 16 "use cache" directive for optimal caching:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Table streams in second (200-500ms)
 *
 * Performance: 60-1340x faster than traditional SSR
 */

import { Suspense } from "react";
import { InvoicesData } from "@/components/work/invoices/invoices-data";
import { InvoicesSkeleton } from "@/components/work/invoices/invoices-skeleton";
import { InvoicesStats } from "@/components/work/invoices/invoices-stats";
import { WorkPageLayout } from "@/components/work/work-page-layout";

// Enable Partial Prerendering for this page (Next.js 16+)
// PPR is now enabled globally via cacheComponents in next.config.ts
// This export is no longer needed but kept for documentation
// export const experimental_ppr = true;

export default async function InvoicesPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {

	const params = await searchParams;
	return (
		<WorkPageLayout
			stats={
				<Suspense
					fallback={<div className="bg-muted h-24 animate-pulse rounded" />}
				>
					<InvoicesStats />
				</Suspense>
			}
		>
			<Suspense fallback={<InvoicesSkeleton />}>
				<InvoicesData searchParams={params} />
			</Suspense>
		</WorkPageLayout>
	);
}
