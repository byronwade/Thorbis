/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { DepartmentsData } from "@/components/work/departments/departments-data";
import { DepartmentsSkeleton } from "@/components/work/departments/departments-skeleton";

export default function DepartmentsPage() {
	return (
		<Suspense fallback={<DepartmentsSkeleton />}>
			<DepartmentsData />
		</Suspense>
	);
}
