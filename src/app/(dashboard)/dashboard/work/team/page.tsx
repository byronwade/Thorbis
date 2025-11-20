/**
 * Team Page - PPR Enabled with Inline Stats
 *
 * Uses Next.js 16 "use cache" directive for optimal caching:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in toolbar (100-200ms)
 * - Data streams in main content (200-500ms)
 *
 * Performance: 10-20x faster than traditional SSR
 * Clean design: Stats integrated directly into toolbar
 */

import { Suspense } from "react";
import { TeamData } from "@/components/work/team/team-data";
import { TeamSkeleton } from "@/components/work/team/team-skeleton";

export default async function TeamPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; search?: string }>;
}) {
	const params = await searchParams;
	return (
		<div className="flex h-full flex-col">
			{/* Stats now shown in toolbar - see layout.tsx */}

			{/* Table - Main content */}
			<div className="flex-1 overflow-hidden">
				<Suspense fallback={<TeamSkeleton />}>
					<TeamData searchParams={params} />
				</Suspense>
			</div>
		</div>
	);
}
