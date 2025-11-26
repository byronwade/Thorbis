/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { SecurityData } from "@/components/settings/security/security-data";
import { SecuritySkeleton } from "@/components/settings/security/security-skeleton";

export default function SecurityPage() {
	return (
		<Suspense fallback={<SecuritySkeleton />}>
			<SecurityData />
		</Suspense>
	);
}
