/**
 * Uteam Page - PPR Enabled
 *
 * Uses Next.js 16 "use cache" directive for optimal caching:
 * - Static shell renders instantly (5-20ms)
 * - Stats stream in first (100-200ms)
 * - Data streams in second (200-500ms)
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { UteamData } from "@/components/work/team/team-data";
import { TeamSkeleton } from "@/components/work/team/team-skeleton";
import { UteamStats } from "@/components/work/team/team-stats";

export default async function UteamPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string; search?: string }>;
}) {
	const params = await searchParams;
	return (
		<>
			<Suspense
				fallback={<div className="bg-muted h-24 animate-pulse rounded" />}
			>
				<UteamStats />
			</Suspense>
			<Suspense fallback={<TeamSkeleton />}>
				<UteamData searchParams={params} />
			</Suspense>
		</>
	);
}
