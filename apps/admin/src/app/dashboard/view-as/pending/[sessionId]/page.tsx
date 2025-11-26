/**
 * Support Session Approval Waiting Page
 *
 * Admin sees this page while waiting for customer to approve access request.
 * Polls for session status changes and auto-redirects when approved.
 */

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { PendingSessionClient } from "./pending-session-client";

interface PageProps {
	params: Promise<{ sessionId: string }>;
}

async function PendingSessionData({ sessionId }: { sessionId: string }) {
	const supabase = createAdminClient();

	// Fetch session details
	const { data: session, error } = await supabase.from("support_sessions").select("*, companies(id, name)").eq("id", sessionId).single();

	if (error || !session) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-center space-y-4">
					<h1 className="text-2xl font-bold text-destructive">Session Not Found</h1>
					<p className="text-muted-foreground">The support session could not be found.</p>
					<a href="/admin/dashboard/view-as" className="text-primary hover:underline">
						← Back to Companies
					</a>
				</div>
			</div>
		);
	}

	// If already approved, redirect to view-as interface
	if (session.status === "active") {
		redirect(`/admin/dashboard/view-as/${session.company_id}/work/jobs`);
	}

	// If rejected, show rejection message
	if (session.status === "rejected") {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-center space-y-4 max-w-md">
					<div className="rounded-full bg-destructive/10 w-16 h-16 flex items-center justify-center mx-auto">
						<svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</div>
					<h1 className="text-2xl font-bold">Access Request Denied</h1>
					<p className="text-muted-foreground">The customer declined your access request.</p>
					{session.rejection_reason && (
						<div className="rounded-md border bg-muted/50 p-3 text-sm">
							<p className="font-medium">Reason:</p>
							<p className="text-muted-foreground">{session.rejection_reason}</p>
						</div>
					)}
					<a href="/admin/dashboard/view-as" className="inline-block text-primary hover:underline">
						← Back to Companies
					</a>
				</div>
			</div>
		);
	}

	// Pending - show waiting screen with polling
	return (
		<PendingSessionClient
			sessionId={session.id}
			companyId={session.company_id}
			companyName={session.companies?.name || "Unknown Company"}
			ticketId={session.ticket_id}
			reason={session.reason}
			requestedAt={session.requested_at}
		/>
	);
}

export default async function PendingSessionPage({ params }: PageProps) {
	const { sessionId } = await params;

	return (
		<Suspense
			fallback={
				<div className="flex h-screen items-center justify-center">
					<div className="text-center space-y-4">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
						<p className="text-muted-foreground">Loading session...</p>
					</div>
				</div>
			}
		>
			<PendingSessionData sessionId={sessionId} />
		</Suspense>
	);
}
