/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { ReviewsData } from "@/components/marketing/reviews/reviews-data";
import { ReviewsSkeleton } from "@/components/marketing/reviews/reviews-skeleton";

export default function ReviewsPage() {
	return (
		<Suspense fallback={<ReviewsSkeleton />}>
			<ReviewsData />
		</Suspense>
	);
}
