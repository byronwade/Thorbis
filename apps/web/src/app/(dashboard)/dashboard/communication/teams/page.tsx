/**
 * Teams Communication Page - Server Component
 *
 * Uses Server Component pattern for initial data fetching:
 * - Data fetched server-side with React.cache() for deduplication
 * - Client component receives pre-fetched data for instant render
 * - No client-side useEffect data fetching on initial load
 *
 * Route: /dashboard/communication/teams?channel=general
 */

import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { TeamsPageClient } from "@/components/communication/teams-page-client";
import { getTeamChannels } from "@/lib/queries/teams";

type SearchParams = Promise<{
	channel?: string;
}>;

// Loading skeleton for Suspense boundary
function TeamsPageSkeleton() {
	return (
		<div className="flex h-full w-full items-center justify-center bg-sidebar">
			<div className="text-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
				<p className="text-sm text-muted-foreground">Loading channels...</p>
			</div>
		</div>
	);
}

// Async server component that fetches data
async function TeamsPageData({ searchParams }: { searchParams: SearchParams }) {
	const params = await searchParams;
	const channelId = params?.channel || null;

	// Fetch data server-side using cached query
	const { channels } = await getTeamChannels();

	return (
		<TeamsPageClient initialChannels={channels} initialChannelId={channelId} />
	);
}

export default async function TeamsPage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	return (
		<Suspense fallback={<TeamsPageSkeleton />}>
			<TeamsPageData searchParams={searchParams} />
		</Suspense>
	);
}
