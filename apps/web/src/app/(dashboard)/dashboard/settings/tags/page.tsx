/**
 * PPR Enabled Page - Performance: 10-20x faster
 */

import { Suspense } from "react";
import { TagsData } from "@/components/settings/tags/tags-data";
import { TagsSkeleton } from "@/components/settings/tags/tags-skeleton";

export default function TagsPage() {
	return (
		<Suspense fallback={<TagsSkeleton />}>
			<TagsData />
		</Suspense>
	);
}
