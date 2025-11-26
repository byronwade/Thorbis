/**
 * SMS Communication Page - Server Component
 *
 * Uses Server Component pattern for initial data fetching:
 * - Data fetched server-side with React.cache() for deduplication
 * - Client component receives pre-fetched data for instant render
 * - No client-side useEffect data fetching on initial load
 *
 * Route: /dashboard/communication/sms?folder=inbox
 */

import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { getSmsAction } from "@/actions/sms-actions";
import { SmsPageClient } from "@/components/communication/sms-page-client";

type SearchParams = Promise<{
	folder?: string;
	id?: string;
}>;

// Loading skeleton for Suspense boundary
function SmsPageSkeleton() {
	return (
		<div className="flex h-full w-full items-center justify-center bg-sidebar">
			<div className="text-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
				<p className="text-sm text-muted-foreground">Loading messages...</p>
			</div>
		</div>
	);
}

// Async server component that fetches data
async function SmsPageData({ searchParams }: { searchParams: SearchParams }) {
	const params = await searchParams;
	const folder = (params?.folder as string) || "inbox";
	const smsId = params?.id || null;

	// Fetch data server-side using Server Action
	const initialSms = await getSmsAction({
		limit: 50,
		offset: 0,
		type: "all",
		folder: folder === "inbox" ? undefined : folder,
		sortBy: "created_at",
		sortOrder: "desc",
	});

	return (
		<SmsPageClient
			initialSms={initialSms}
			initialFolder={folder}
			initialSmsId={smsId}
		/>
	);
}

export default async function SmsPage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	return (
		<Suspense fallback={<SmsPageSkeleton />}>
			<SmsPageData searchParams={searchParams} />
		</Suspense>
	);
}
