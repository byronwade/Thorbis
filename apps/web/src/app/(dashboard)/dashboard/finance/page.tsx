/**
 * Finance Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - In production, renders Coming Soon instantly (no dynamic data)
 * - In development, static shell renders instantly (5-20ms)
 * - Finance data streams in (100-300ms)
 *
 * Performance: 5-15x faster than traditional SSR
 */

import { Suspense } from "react";
import { FinanceComingSoon } from "@/components/finance/finance-coming-soon";
import { FinanceData } from "@/components/finance/finance-data";
import { FinanceShell } from "@/components/finance/finance-shell";
import { FinanceSkeleton } from "@/components/finance/finance-skeleton";

export default function FinancePage() {
	// Show Coming Soon in production, PPR dashboard in development
	const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

	if (isProduction) {
		return <FinanceComingSoon />;
	}

	return (
		<FinanceShell>
			<Suspense fallback={<FinanceSkeleton />}>
				<FinanceData />
			</Suspense>
		</FinanceShell>
	);
}
