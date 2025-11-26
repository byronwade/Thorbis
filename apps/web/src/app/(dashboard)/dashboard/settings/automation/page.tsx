/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { AutomationData } from "@/components/settings/automation/automation-data";
import { AutomationSkeleton } from "@/components/settings/automation/automation-skeleton";

export default function AutomationPage() {
	return (
		<Suspense fallback={<AutomationSkeleton />}>
			<AutomationData />
		</Suspense>
	);
}
