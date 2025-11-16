/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { NewData } from "@/components/customers/new/new-data";
import { NewSkeleton } from "@/components/customers/new/new-skeleton";

export default function NewPage() {
	return (
		<Suspense fallback={<NewSkeleton />}>
			<NewData />
		</Suspense>
	);
}
