/**
 * Marketing Page - Leads Management (PPR Enabled)
 *
 * Full-width seamless datatable layout matching work pages:
 * - Toolbar shows in header with actions
 * - Stats cards appear below toolbar
 * - Table extends edge-to-edge for seamless appearance
 *
 * Environment behavior:
 * - Production: Shows Coming Soon page
 * - Development: PPR-enabled stats + datatable
 */

import { Suspense } from "react";
import { MarketingComingSoon } from "@/components/marketing/marketing-coming-soon";
import { MarketingData } from "@/components/marketing/marketing-data";
import { MarketingSkeleton } from "@/components/marketing/marketing-skeleton";

export default function MarketingPage() {
	// Show Coming Soon in production, PPR leads dashboard in development
	const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

	if (isProduction) {
		return <MarketingComingSoon />;
	}

	return (
		<Suspense fallback={<MarketingSkeleton />}>
			<MarketingData />
		</Suspense>
	);
}
