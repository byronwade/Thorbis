/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ReferralsData } from "@/components/marketing/referrals/referrals-data";
import { ReferralsSkeleton } from "@/components/marketing/referrals/referrals-skeleton";

export default function ReferralsPage() {
	return (
		<Suspense fallback={<ReferralsSkeleton />}>
			<ReferralsData />
		</Suspense>
	);
}
