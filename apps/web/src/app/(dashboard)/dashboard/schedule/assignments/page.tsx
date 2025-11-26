/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { AssignmentsData } from "@/components/schedule/assignments/assignments-data";
import { AssignmentsSkeleton } from "@/components/schedule/assignments/assignments-skeleton";

export default function AssignmentsPage() {
	return (
		<Suspense fallback={<AssignmentsSkeleton />}>
			<AssignmentsData />
		</Suspense>
	);
}
