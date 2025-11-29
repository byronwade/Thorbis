/**
 * Company Communications Hub - Server Component with PPR
 *
 * Company-wide view of ALL communications across all team members
 * Shows emails, SMS, calls, and voicemails for the entire company
 *
 * Features:
 * - Company-wide communications timeline (not user-specific)
 * - Type filtering (All, Email, SMS, Call, Voicemail)
 * - Auto-linking suggestions to customers/jobs/properties
 * - Internal notes for CSR collaboration
 * - Link to customer/job detail pages
 *
 * Note: For personal user-specific inboxes, see:
 * - /dashboard/communication/email (My Email)
 * - /dashboard/communication/sms (My SMS)
 * - /dashboard/communication/calls (My Calls)
 *
 * Uses Server Component pattern for initial data fetching:
 * - Data fetched server-side with React.cache() for deduplication
 * - Client component receives pre-fetched data for instant render
 * - No client-side useEffect data fetching on initial load
 */

import { Loader2 } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { UnifiedInboxPageClient } from "@/components/communication/unified-inbox-page-client";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getCompanyCommunicationCounts, getCompanyCommunications } from "@/lib/queries/communications";
import { createClient } from "@/lib/supabase/server";

type SearchParams = Promise<{
	id?: string;
	type?: "email" | "sms" | "call" | "voicemail";
	folder?: "inbox" | "sent" | "starred" | "archive" | "trash";
	category?: "support" | "sales" | "billing" | "general";
}>;

// Loading skeleton for Suspense boundary
function UnifiedInboxSkeleton() {
	return (
		<div className="flex h-full w-full items-center justify-center bg-sidebar">
			<div className="text-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
				<p className="text-sm text-muted-foreground">
					Loading communications...
				</p>
			</div>
		</div>
	);
}

// Async server component that fetches data
async function UnifiedInboxData({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const params = await searchParams;
	const selectedId = params?.id || null;
	const activeType = params?.type || null;
	const activeFolder = params?.folder || null;
	const activeCategory = params?.category || null;

	// Get authenticated user and company
	const supabase = await createClient();
	if (!supabase) {
		return notFound();
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/sign-in");
	}

	const companyId = await getActiveCompanyId();
	if (!companyId) {
		redirect("/dashboard");
	}

	// Get team member ID by looking up the team_members table
	const { data: teamMember } = await supabase
		.from("team_members")
		.select("id")
		.eq("user_id", user.id)
		.eq("company_id", companyId)
		.single();

	const teamMemberId = teamMember?.id || user.id;

	// Build filters based on search params
	const filters: Parameters<typeof getCompanyCommunications>[1] = {
		limit: 100,
		type: activeType ?? undefined,
	};

	// Add direction filter for sent folder
	if (activeFolder === "sent") {
		filters.direction = "outbound";
	}

	// Fetch ALL company communications (no permission filtering)
	// This shows company-wide view for admins/managers
	// Also fetch counts for accurate filter badge display
	const [communications, counts] = await Promise.all([
		getCompanyCommunications(companyId, filters),
		getCompanyCommunicationCounts(companyId),
	]);

	return (
		<UnifiedInboxPageClient
			initialCommunications={communications}
			initialCounts={counts}
			companyId={companyId}
			teamMemberId={teamMemberId}
			selectedId={selectedId}
			activeType={activeType}
			activeFolder={activeFolder}
			activeCategory={activeCategory}
		/>
	);
}

export default async function UnifiedInboxPage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	return (
		<div className="flex flex-1 h-full w-full">
			<Suspense fallback={<UnifiedInboxSkeleton />}>
				<UnifiedInboxData searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
