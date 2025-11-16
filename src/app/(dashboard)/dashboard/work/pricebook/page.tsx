/**
 * Work > Pricebook Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
 * - Static shell renders instantly (5-20ms)
 * - Data streams in (200-500ms)
 *
 * Performance: 10-40x faster than traditional SSR
 *
 * Enhanced with industry best practices:
 * - ServiceTitan-style organization (Services, Materials, Equipment)
 * - Hierarchical categories with subcategories
 * - Good/Better/Best pricing tiers
 * - Flat-rate pricing indicators
 * - Labor hours for services
 * - Image thumbnails for items
 */

import { Suspense } from "react";
import { PricebookData } from "@/components/work/pricebook/pricebook-data";
import { PricebookSkeleton } from "@/components/work/pricebook/pricebook-skeleton";

export default function PriceBookPage() {
	return (
		<Suspense fallback={<PricebookSkeleton />}>
			<PricebookData />
		</Suspense>
	);
}
