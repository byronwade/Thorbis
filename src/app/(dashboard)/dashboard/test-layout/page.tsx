/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { TestLayoutData } from "@/components/test-layout/main-data";
import { TestLayoutSkeleton } from "@/components/test-layout/main-skeleton";

export default function TestLayoutPage() {
	return (
		<Suspense fallback={<TestLayoutSkeleton />}>
			<TestLayoutData />
		</Suspense>
	);
}
