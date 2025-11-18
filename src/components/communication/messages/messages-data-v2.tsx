/**
 * Messages Data V2 - Server component for new messaging UI
 *
 * Fetches initial data:
 * - SMS threads
 * - Company phone numbers
 * - Team members (for assignments)
 * - First conversation
 */

import { notFound } from "next/navigation";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
	fetchSmsConversation,
	fetchSmsThreads,
} from "@/lib/communications/sms";
import type { SmsThread } from "@/lib/stores/messages-store";
import { createClient } from "@/lib/supabase/server";
import { MessagesPageClientV2 } from "./messages-page-client-v2";

export async function MessagesDataV2() {
	const supabase = await createClient();
	if (!supabase) {
		return notFound();
	}

	const companyId = await getActiveCompanyId();
	if (!companyId) {
		return notFound();
	}

	// Fetch all data in parallel
	const [rawThreads, companyPhonesResult, teamMembersResult] =
		await Promise.all([
			fetchSmsThreads(supabase, companyId),
			supabase
				.from("phone_numbers")
				.select("id, phone_number, formatted_number, status")
				.eq("company_id", companyId)
				.is("deleted_at", null)
				.order("created_at", { ascending: false }),
			supabase
				.from("team_members")
				.select("id, user_id, first_name, last_name, email, avatar_url, status")
				.eq("company_id", companyId)
				.eq("status", "active")
				.order("first_name", { ascending: true }),
		]);

	// Transform threads to match SmsThread type
	const threads: SmsThread[] = (rawThreads || []).map((thread) => {
		// Safely parse date
		let lastMessageAt: Date;
		try {
			lastMessageAt = new Date(thread.lastTimestamp);
			if (isNaN(lastMessageAt.getTime())) {
				lastMessageAt = new Date(); // Fallback to now
			}
		} catch {
			lastMessageAt = new Date(); // Fallback to now
		}

		return {
			threadId: thread.id,
			remotePhoneNumber: thread.phoneNumber,
			remoteName: thread.contactName,
			customerId: thread.customerId,
			lastMessage: thread.lastMessage,
			lastMessageAt,
			unreadCount: thread.unreadCount,
			direction: "inbound" as "inbound" | "outbound", // Default to inbound for threads
			status: "open", // Default status
			priority: "normal", // Default priority
			assignedTo: null, // Will be loaded from message_assignments
			assignedToName: null,
			snoozedUntil: null,
			messages: [], // Will be loaded on selection
		};
	});

	// Company phones
	const companyPhones = (companyPhonesResult.data || []).map((phone) => ({
		id: phone.id,
		number: phone.phone_number,
		label: phone.formatted_number || phone.phone_number,
		status: phone.status ?? "active",
	}));

	// Team members
	const teamMembers = (teamMembersResult.data || []).map((member) => ({
		id: member.id,
		userId: member.user_id,
		name:
			`${member.first_name ?? ""} ${member.last_name ?? ""}`.trim() ||
			member.email,
		email: member.email,
		avatarUrl: member.avatar_url,
		status: member.status,
	}));

	// Load first conversation if available
	const initialThreadId = threads[0]?.threadId ?? null;
	let initialConversation: any[] = [];

	if (initialThreadId) {
		initialConversation = await fetchSmsConversation(
			supabase,
			companyId,
			initialThreadId,
		);

		// Add messages to first thread
		if (threads[0]) {
			threads[0].messages = initialConversation;
		}
	}

	return (
		<MessagesPageClientV2
			companyId={companyId}
			initialThreads={threads}
			companyPhones={companyPhones}
			teamMembers={teamMembers}
			initialThreadId={initialThreadId}
		/>
	);
}
