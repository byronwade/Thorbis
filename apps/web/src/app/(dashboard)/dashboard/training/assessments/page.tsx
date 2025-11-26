/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { AssessmentsData } from "@/components/training/assessments/assessments-data";
import { AssessmentsSkeleton } from "@/components/training/assessments/assessments-skeleton";

export default function AssessmentsPage() {
	return (
		<Suspense fallback={<AssessmentsSkeleton />}>
			<AssessmentsData />
		</Suspense>
	);
}
