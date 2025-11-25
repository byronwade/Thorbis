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

import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";
import { getCompanyCommunications } from "@/lib/queries/communications";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";
import { UnifiedInboxPageClient } from "@/components/communication/unified-inbox-page-client";
import { Loader2 } from "lucide-react";

type SearchParams = Promise<{
	id?: string;
	type?: "email" | "sms" | "call" | "voicemail";
}>;

// Loading skeleton for Suspense boundary
function UnifiedInboxSkeleton() {
	return (
		<div className="flex h-full w-full items-center justify-center bg-sidebar">
			<div className="text-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
				<p className="text-sm text-muted-foreground">Loading communications...</p>
			</div>
		</div>
	);
}

// Async server component that fetches data
async function UnifiedInboxData({ searchParams }: { searchParams: SearchParams }) {
	const params = await searchParams;
	const selectedId = params?.id || null;

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

	// Get team member ID (assuming user.id maps to team_members)
	// TODO: Update this to use actual team member lookup
	const teamMemberId = user.id;

	// Fetch ALL company communications (no permission filtering)
	// This shows company-wide view for admins/managers
	const communications = await getCompanyCommunications(companyId, {
		limit: 100,
		type: params?.type,
	});

	return (
		<UnifiedInboxPageClient
			initialCommunications={communications}
			companyId={companyId}
			teamMemberId={teamMemberId}
			selectedId={selectedId}
		/>
	);
}

export default async function UnifiedInboxPage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	return (
		<div className="flex h-full w-full">
			<Suspense fallback={<UnifiedInboxSkeleton />}>
				<UnifiedInboxData searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
