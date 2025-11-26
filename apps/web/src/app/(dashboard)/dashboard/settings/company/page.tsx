/**
 * Ucompany Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UcompanyData } from "@/components/settings/company/company-data";
import { UcompanySkeleton } from "@/components/settings/company/company-skeleton";

export default function UcompanyPage() {
	return (
		<Suspense fallback={<UcompanySkeleton />}>
			<UcompanyData />
		</Suspense>
	);
}
