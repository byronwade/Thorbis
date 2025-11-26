/**
 * Email Communication Page - Server Component with Dual-Inbox Support
 *
 * Uses Server Component pattern for initial data fetching:
 * - Data fetched server-side with React.cache() for deduplication
 * - Client component receives pre-fetched data for instant render
 * - No client-side useEffect data fetching on initial load
 *
 * Dual-Inbox Routes:
 * - Personal: /dashboard/communication/email?inbox=personal&folder=inbox
 * - Company: /dashboard/communication/email?inbox=company&category=support
 * - Legacy: /dashboard/communication/email?folder=inbox (defaults to personal)
 */

import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { EmailPageClient } from "@/components/communication/email-page-client";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { type EmailFolder, getEmails } from "@/lib/queries/emails";

export type InboxType = "personal" | "company";
export type EmailCategory = "support" | "sales" | "billing" | "general";

type SearchParams = Promise<{
	inbox?: InboxType;
	folder?: string;
	category?: EmailCategory;
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

	// Determine inbox type (defaults to personal for backwards compatibility)
	const inboxType: InboxType = (params?.inbox as InboxType) || "personal";

	// For personal inbox, use folder (inbox, sent, drafts, etc.)
	// For company inbox, use category (support, sales, billing, general)
	const folder = params?.folder as EmailFolder | undefined;
	const category = params?.category as EmailCategory | undefined;
	const emailId = params?.id || null;

	// Fetch data server-side using cached query
	const [emails, companyId] = await Promise.all([
		getEmails({
			inboxType,
			folder: inboxType === "personal" ? folder || "inbox" : undefined,
			category: inboxType === "company" ? category || "support" : undefined,
			limit: 50,
			offset: 0,
		}),
		getActiveCompanyId(),
	]);

	return (
		<EmailPageClient
			initialEmails={emails}
			initialInboxType={inboxType}
			initialFolder={folder}
			initialCategory={category}
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
