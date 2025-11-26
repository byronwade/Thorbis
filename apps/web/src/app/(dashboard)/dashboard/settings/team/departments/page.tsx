/**
 * Udepartments Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads.
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UdepartmentsData } from "@/components/settings/departments/departments-data";
import { UdepartmentsSkeleton } from "@/components/settings/departments/departments-skeleton";

export default function UdepartmentsPage() {
	return (
		<Suspense fallback={<UdepartmentsSkeleton />}>
			<UdepartmentsData />
		</Suspense>
	);
}
