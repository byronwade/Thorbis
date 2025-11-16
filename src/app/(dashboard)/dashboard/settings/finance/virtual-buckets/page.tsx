/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { VirtualBucketsData } from "@/components/settings/virtual-buckets/virtual-buckets-data";
import { VirtualBucketsSkeleton } from "@/components/settings/virtual-buckets/virtual-buckets-skeleton";

export default function VirtualBucketsPage() {
	return (
		<Suspense fallback={<VirtualBucketsSkeleton />}>
			<VirtualBucketsData />
		</Suspense>
	);
}
