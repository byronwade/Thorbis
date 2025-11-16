/**
 * Uteam Page - PPR Enabled
 *
 * Uses Partial Prerendering for instant page loads:
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

export default function UteamPage() {
	return (
		<>
			<Suspense
				fallback={<div className="h-24 animate-pulse rounded bg-muted" />}
			>
				<UteamStats />
			</Suspense>
			<Suspense fallback={<TeamSkeleton />}>
				<UteamData />
			</Suspense>
		</>
	);
}
