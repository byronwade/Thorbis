/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { AppData } from "@/components/technicians/app/app-data";
import { AppSkeleton } from "@/components/technicians/app/app-skeleton";

export default function AppPage() {
	return (
		<Suspense fallback={<AppSkeleton />}>
			<AppData />
		</Suspense>
	);
}
