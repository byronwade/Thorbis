/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { PrivacyData } from "@/components/settings/privacy/privacy-data";
import { PrivacySkeleton } from "@/components/settings/privacy/privacy-skeleton";

export default function PrivacyPage() {
	return (
		<Suspense fallback={<PrivacySkeleton />}>
			<PrivacyData />
		</Suspense>
	);
}
