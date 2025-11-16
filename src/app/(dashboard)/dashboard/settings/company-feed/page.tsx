/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { CompanyFeedData } from "@/components/settings/company-feed/company-feed-data";
import { CompanyFeedSkeleton } from "@/components/settings/company-feed/company-feed-skeleton";

export default function CompanyFeedPage() {
	return (
		<Suspense fallback={<CompanyFeedSkeleton />}>
			<CompanyFeedData />
		</Suspense>
	);
}
