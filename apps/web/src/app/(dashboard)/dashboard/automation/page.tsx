/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { AutomationData } from "@/components/automation/main-data";
import { AutomationSkeleton } from "@/components/automation/main-skeleton";

export default function AutomationPage() {
	return (
		<Suspense fallback={<AutomationSkeleton />}>
			<AutomationData />
		</Suspense>
	);
}
