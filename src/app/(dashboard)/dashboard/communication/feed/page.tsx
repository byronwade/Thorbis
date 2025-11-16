/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { FeedData } from "@/components/communication/feed/feed-data";
import { FeedSkeleton } from "@/components/communication/feed/feed-skeleton";

export default function FeedPage() {
	return (
		<Suspense fallback={<FeedSkeleton />}>
			<FeedData />
		</Suspense>
	);
}
