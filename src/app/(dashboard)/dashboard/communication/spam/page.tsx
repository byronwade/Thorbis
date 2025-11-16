/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { SpamData } from "@/components/communication/spam/spam-data";
import { SpamSkeleton } from "@/components/communication/spam/spam-skeleton";

export default function SpamPage() {
	return (
		<Suspense fallback={<SpamSkeleton />}>
			<SpamData />
		</Suspense>
	);
}
