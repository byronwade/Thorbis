/**
 * Email Communication Page - Server Component
 *
 * Uses Server Component pattern for initial data fetching:
 * - Data fetched server-side with React.cache() for deduplication
 * - Client component receives pre-fetched data for instant render
 * - No client-side useEffect data fetching on initial load
 *
 * Route: /dashboard/communication/email?folder=inbox
 */

import { Suspense } from "react";
import { getEmails, type EmailFolder } from "@/lib/queries/emails";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { EmailPageClient } from "@/components/communication/email-page-client";
import { Loader2 } from "lucide-react";

type SearchParams = Promise<{
	folder?: string;
	id?: string;
	compose?: string;
}>;

// Loading skeleton for Suspense boundary
function EmailPageSkeleton() {
	return (
		<div className="flex h-full w-full items-center justify-center bg-sidebar">
			<div className="text-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
				<p className="text-sm text-muted-foreground">Loading emails...</p>
			</div>
		</div>
	);
}

// Async server component that fetches data
async function EmailPageData({ searchParams }: { searchParams: SearchParams }) {
	const params = await searchParams;
	const folder = (params?.folder || "inbox") as EmailFolder;
	const emailId = params?.id || null;

	// Fetch data server-side using cached query
	const [emails, companyId] = await Promise.all([
		getEmails({ folder, limit: 50, offset: 0 }),
		getActiveCompanyId(),
	]);

	return (
		<EmailPageClient
			initialEmails={emails}
			initialFolder={folder}
			initialEmailId={emailId}
			companyId={companyId}
		/>
	);
}

export default async function EmailPage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	return (
		<Suspense fallback={<EmailPageSkeleton />}>
			<EmailPageData searchParams={searchParams} />
		</Suspense>
	);
}
