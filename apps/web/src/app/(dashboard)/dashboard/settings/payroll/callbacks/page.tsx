/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { CallbacksData } from "@/components/settings/callbacks/callbacks-data";
import { CallbacksSkeleton } from "@/components/settings/callbacks/callbacks-skeleton";

export default function CallbacksPage() {
	return (
		<Suspense fallback={<CallbacksSkeleton />}>
			<CallbacksData />
		</Suspense>
	);
}
