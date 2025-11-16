/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { TestFullWidthData } from "@/components/test-full-width/main-data";
import { TestFullWidthSkeleton } from "@/components/test-full-width/main-skeleton";

export default function TestFullWidthPage() {
	return (
		<Suspense fallback={<TestFullWidthSkeleton />}>
			<TestFullWidthData />
		</Suspense>
	);
}
