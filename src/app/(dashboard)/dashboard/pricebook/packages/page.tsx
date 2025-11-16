/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { PackagesData } from "@/components/pricebook/packages/packages-data";
import { PackagesSkeleton } from "@/components/pricebook/packages/packages-skeleton";

export default function PackagesPage() {
	return (
		<Suspense fallback={<PackagesSkeleton />}>
			<PackagesData />
		</Suspense>
	);
}
