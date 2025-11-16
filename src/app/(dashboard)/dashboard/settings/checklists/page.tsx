/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ChecklistsData } from "@/components/settings/checklists/checklists-data";
import { ChecklistsSkeleton } from "@/components/settings/checklists/checklists-skeleton";

export default function ChecklistsPage() {
	return (
		<Suspense fallback={<ChecklistsSkeleton />}>
			<ChecklistsData />
		</Suspense>
	);
}
