/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { RolesData } from "@/components/work/roles/roles-data";
import { RolesSkeleton } from "@/components/work/roles/roles-skeleton";

export default function RolesPage() {
	return (
		<Suspense fallback={<RolesSkeleton />}>
			<RolesData />
		</Suspense>
	);
}
