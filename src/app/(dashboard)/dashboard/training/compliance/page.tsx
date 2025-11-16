/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ComplianceData } from "@/components/training/compliance/compliance-data";
import { ComplianceSkeleton } from "@/components/training/compliance/compliance-skeleton";

export default function CompliancePage() {
	return (
		<Suspense fallback={<ComplianceSkeleton />}>
			<ComplianceData />
		</Suspense>
	);
}
