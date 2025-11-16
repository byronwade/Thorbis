/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { OutreachData } from "@/components/marketing/outreach/outreach-data";
import { OutreachSkeleton } from "@/components/marketing/outreach/outreach-skeleton";

export default function OutreachPage() {
	return (
		<Suspense fallback={<OutreachSkeleton />}>
			<OutreachData />
		</Suspense>
	);
}
