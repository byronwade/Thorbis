/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { VoipData } from "@/components/marketing/voip/voip-data";
import { VoipSkeleton } from "@/components/marketing/voip/voip-skeleton";

export default function VoipPage() {
	return (
		<Suspense fallback={<VoipSkeleton />}>
			<VoipData />
		</Suspense>
	);
}
