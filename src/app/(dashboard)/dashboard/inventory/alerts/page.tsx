/**
 * Inventory > Alerts Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Dynamic content streams in (100-300ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { AlertsData } from "@/components/inventory/alerts/alerts-data";
import { AlertsSkeleton } from "@/components/inventory/alerts/alerts-skeleton";

export default function LowStockAlertsPage() {
	return (
		<Suspense fallback={<AlertsSkeleton />}>
			<AlertsData />
		</Suspense>
	);
}
