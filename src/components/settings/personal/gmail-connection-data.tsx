/**
 * Gmail Connection Data Component (Server Component)
 *
 * Fetches Gmail connection data for the current team member and passes it to
 * the client component for rendering.
 */

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GmailConnection } from "./gmail-connection";

export async function GmailConnectionData() {
	const supabase = await createClient();

	if (!supabase) {
		return notFound();
	}

	// Get current user
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		return notFound();
	}

	// Get team member info
	const { data: teamMember, error: memberError } = await supabase
		.from("team_members")
		.select("id, company_id")
		.eq("user_id", user.id)
		.single();

	if (memberError || !teamMember) {
		return notFound();
	}

	// Get Gmail connection status
	const { data: gmailToken } = await supabase
		.from("user_gmail_tokens")
		.select(
			`
			id,
			scopes,
			last_synced_at,
			sync_enabled,
			user_email_accounts!inner(
				email_address
			)
		`
		)
		.eq("team_member_id", teamMember.id)
		.maybeSingle();

	// Prepare data for client component
	const connectionData = {
		isConnected: !!gmailToken,
		emailAddress: gmailToken?.user_email_accounts?.email_address,
		lastSyncedAt: gmailToken?.last_synced_at || undefined,
		syncEnabled: gmailToken?.sync_enabled ?? false,
		scopes: gmailToken?.scopes || [],
	};

	return <GmailConnection data={connectionData} />;
}
