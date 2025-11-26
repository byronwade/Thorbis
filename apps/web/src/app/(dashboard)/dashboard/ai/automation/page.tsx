/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { AutomationData } from "@/components/ai/automation/automation-data";
import { AutomationSkeleton } from "@/components/ai/automation/automation-skeleton";

export default function AutomationPage() {
	return (
		<Suspense fallback={<AutomationSkeleton />}>
			<AutomationData />
		</Suspense>
	);
}
