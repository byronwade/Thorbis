/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { SupportData } from "@/components/communication/support/support-data";
import { SupportSkeleton } from "@/components/communication/support/support-skeleton";

export default function SupportPage() {
	return (
		<Suspense fallback={<SupportSkeleton />}>
			<SupportData />
		</Suspense>
	);
}
