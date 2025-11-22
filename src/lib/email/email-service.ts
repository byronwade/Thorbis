"use server";

import { createClient } from "@/lib/supabase/server";
import { getActiveCompanyId } from "@/lib/auth/company-context";

export type CompanyEmail = {
	id: string;
	from_address: string | null;
	from_name: string | null;
	to_address: string | null;
	subject: string | null;
	body: string | null;
	body_html: string | null;
	created_at: string;
	read_at: string | null;
	direction: "inbound" | "outbound";
	customer_id: string | null;
	customer?: {
		id: string;
		first_name: string | null;
		last_name: string | null;
	} | null;
	sent_at: string | null;
	delivered_at: string | null;
	status: string;
	tags?: string[] | null;
	provider_metadata?: Record<string, unknown> | null;
};

export type EmailFolder = 
	| "inbox" 
	| "drafts" 
	| "sent" 
	| "archive" 
	| "snoozed" 
	| "spam" 
	| "trash" 
	| "bin"
	| "starred"
	| string; // For labels

type GetCompanyEmailsInput = {
	limit?: number;
	offset?: number;
	type?: "sent" | "received" | "all";
	folder?: EmailFolder;
	label?: string; // For label filtering
	search?: string;
	sortBy?: "created_at" | "sent_at" | "subject";
	sortOrder?: "asc" | "desc";
};

export type GetCompanyEmailsResult = {
	emails: CompanyEmail[];
	total: number;
	hasMore: boolean;
};

export async function getCompanyEmails(
	companyId: string,
	input: GetCompanyEmailsInput = {},
): Promise<GetCompanyEmailsResult> {
	const supabase = await createClient();

	if (!supabase) {
		return { emails: [], total: 0, hasMore: false };
	}

	const {
		limit = 50,
		offset = 0,
		type = "all",
		folder,
		label,
		search,
		sortBy = "created_at",
		sortOrder = "desc",
	} = input;

	// First, let's check what emails exist for debugging
	const { data: debugData, error: debugError } = await supabase
		.from("communications")
		.select("id, channel, type, direction, subject, created_at, status, to_address")
		.eq("company_id", companyId)
		.eq("type", "email")
		.is("deleted_at", null)
		.order("created_at", { ascending: false })
		.limit(10);

	console.log("🔍 Debug: All emails for company:", {
		companyId,
		total: debugData?.length || 0,
		channels: debugData?.map((e) => e.channel),
		directions: debugData?.map((e) => e.direction),
		statuses: debugData?.map((e) => e.status),
		subjects: debugData?.map((e) => e.subject),
		toAddresses: debugData?.map((e) => e.to_address),
		error: debugError,
		errorMessage: debugError?.message,
		errorDetails: debugError ? JSON.stringify(debugError, null, 2) : null,
	});

	// Also check ALL communications (not just emails) to see what exists
	const { data: allComms, error: allCommsError } = await supabase
		.from("communications")
		.select("id, type, channel, direction, subject, created_at")
		.eq("company_id", companyId)
		.is("deleted_at", null)
		.order("created_at", { ascending: false })
		.limit(10);

	console.log("🔍 Debug: ALL communications for company:", {
		total: allComms?.length || 0,
		types: allComms?.map((e) => e.type),
		channels: allComms?.map((e) => e.channel),
		error: allCommsError,
	});

	// Build the query - get all emails, we'll filter by channel in memory
	// Note: Using left join for customer to avoid filtering out emails without customers
	let query = supabase
		.from("communications")
		.select(
			`
			id,
			from_address,
			from_name,
			to_address,
			subject,
			body,
			body_html,
			created_at,
			read_at,
			direction,
			customer_id,
			customer:customers!left(id, first_name, last_name),
			sent_at,
			delivered_at,
			status,
			channel,
			provider_metadata,
			is_archived,
			snoozed_until,
			category,
			tags
		`,
			{ count: "exact" },
		)
		.eq("company_id", companyId)
		.eq("type", "email");

	// Apply folder filtering
	if (folder) {
		switch (folder) {
			case "inbox":
				// Inbox: inbound, not archived, not deleted, not draft, not snoozed (or snooze expired)
				query = query
					.eq("direction", "inbound")
					.eq("is_archived", false)
					.is("deleted_at", null)
					.neq("status", "draft")
					.or("snoozed_until.is.null,snoozed_until.lt.now()");
				break;
			case "drafts":
				// Drafts: status is draft, not deleted
				query = query.eq("status", "draft").is("deleted_at", null);
				break;
			case "sent":
				// Sent: outbound, not archived, not deleted
				query = query
					.eq("direction", "outbound")
					.eq("is_archived", false)
					.is("deleted_at", null)
					.neq("status", "draft");
				break;
			case "archive":
				// Archive: is_archived = true, not deleted
				query = query.eq("is_archived", true).is("deleted_at", null);
				break;
			case "snoozed":
				// Snoozed: snoozed_until is not null and in the future, not deleted
				query = query
					.not("snoozed_until", "is", null)
					.gt("snoozed_until", new Date().toISOString())
					.is("deleted_at", null);
				break;
			case "spam":
				// Spam: category = 'spam' or tags contains 'spam', not deleted
				// Use separate queries and combine in memory, or use OR with proper syntax
				query = query
					.or("category.eq.spam")
					.is("deleted_at", null);
				// Note: Tags filtering for spam will be done in memory after fetch
				break;
			case "trash":
			case "bin":
				// Trash/Bin: deleted_at is not null
				query = query.not("deleted_at", "is", null);
				break;
			case "starred":
				// Starred: tags contains 'starred', not deleted
				// Note: We'll filter by tags in memory after fetch due to JSONB query limitations
				query = query
					.is("deleted_at", null);
				break;
			default:
				// Custom folder or label filtering
				if (label || folder) {
					const folderName = label || folder;
					
					// First, check if it's a custom folder by slug
					// We'll need to check the email_folders table
					// For now, filter by tags containing the folder name
					// The folder slug should match the tag name
					query = query
						.contains("tags", [folderName])
						.is("deleted_at", null);
				}
				break;
		}
	} else {
		// Default: exclude deleted emails
		query = query.is("deleted_at", null);
	}

	// Filter by direction (if not already filtered by folder)
	if (!folder || (folder !== "inbox" && folder !== "sent" && folder !== "drafts")) {
		if (type === "sent") {
			query = query.eq("direction", "outbound");
		} else if (type === "received") {
			query = query.eq("direction", "inbound");
		}
		// Note: type === "all" doesn't filter by direction
	}

	// Search filter
	if (search) {
		query = query.or(
			`subject.ilike.%${search}%,body.ilike.%${search}%,from_address.ilike.%${search}%,to_address.ilike.%${search}%`,
		);
	}

	// Sort
	query = query.order(sortBy, { ascending: sortOrder === "asc" });

	// Pagination
	query = query.range(offset, offset + limit - 1);

	const { data, error, count } = await query;

	if (error) {
		console.error("❌ Error fetching emails:", error);
		console.error("   Company ID:", companyId);
		console.error("   Query filters:", { type: "email", direction: type });
		console.error("   Full error details:", JSON.stringify(error, null, 2));
		return { emails: [], total: 0, hasMore: false };
	}

	console.log("📧 Email query results:", {
		companyId,
		count: count || 0,
		emailsFound: data?.length || 0,
		limit,
		offset,
		type,
		firstEmailId: data?.[0]?.id,
		firstEmailSubject: data?.[0]?.subject,
	});

	// Debug: Log the first email's content fields to see what we're getting
	if (data && data.length > 0) {
		const firstEmail = data[0];
		console.log("🔍 First email content check:", {
			id: firstEmail.id,
			subject: firstEmail.subject,
			body: firstEmail.body ? `${firstEmail.body.substring(0, 100)}...` : "null/empty",
			body_length: firstEmail.body?.length || 0,
			body_html: firstEmail.body_html ? `${firstEmail.body_html.substring(0, 100)}...` : "null/empty",
			body_html_length: firstEmail.body_html?.length || 0,
			has_provider_metadata: !!firstEmail.provider_metadata,
			provider_metadata_type: typeof firstEmail.provider_metadata,
			provider_metadata_keys: firstEmail.provider_metadata ? Object.keys(firstEmail.provider_metadata as Record<string, unknown>) : [],
		});
	}

	// Normalize customer data and filter out channel field
	let emails: CompanyEmail[] = (data || []).map((email: any) => {
		const customer = Array.isArray(email.customer)
			? email.customer[0] ?? null
			: email.customer ?? null;

		// Remove channel from the returned object as it's not part of CompanyEmail type
		const { channel, ...emailData } = email;

		return {
			...emailData,
			customer,
		};
	});

	// Post-process spam filtering
	if (folder === "spam") {
		// Show only spam emails
		emails = emails.filter((email: any) => {
			const tags = (email.tags as string[]) || [];
			return email.category === "spam" || tags.includes("spam");
		});
		// Update count for spam after filtering
		const spamCount = emails.length;
		return {
			emails,
			total: spamCount,
			hasMore: spamCount >= limit,
		};
	} else {
		// Exclude spam emails from all other folders (same way archiving works)
		emails = emails.filter((email: any) => {
			const tags = (email.tags as string[]) || [];
			const isSpam = email.category === "spam" || tags.includes("spam");
			return !isSpam; // Exclude spam from all non-spam folders
		});
	}

	// Post-process starred filtering (if folder is starred)
	if (folder === "starred") {
		emails = emails.filter((email: any) => {
			const tags = (email.tags as string[]) || [];
			return tags.includes("starred");
		});
		// Update count for starred after filtering
		const starredCount = emails.length;
		return {
			emails,
			total: starredCount,
			hasMore: starredCount >= limit,
		};
	}

	return {
		emails,
		total: count || 0,
		hasMore: (count || 0) > offset + limit,
	};
}

export async function getEmailThreads(
	companyId: string,
	input: {
		limit?: number;
		offset?: number;
		search?: string;
	} = {},
): Promise<{ threads: CompanyEmail[]; total: number; hasMore: boolean }> {
	// For now, return emails grouped by thread
	// This is a simplified implementation
	const result = await getCompanyEmails(companyId, {
		...input,
		type: "all",
		sortBy: "created_at",
		sortOrder: "desc",
	});

	return {
		threads: result.emails,
		total: result.total,
		hasMore: result.hasMore,
	};
}

export async function getEmailById(
	companyId: string,
	emailId: string,
): Promise<CompanyEmail | null> {
	const supabase = await createClient();

	if (!supabase || !companyId) {
		return null;
	}

	const { data, error } = await supabase
		.from("communications")
		.select(
			`
			id,
			from_address,
			from_name,
			to_address,
			subject,
			body,
			body_html,
			created_at,
			read_at,
			direction,
			customer_id,
			customer:customers(id, first_name, last_name),
			sent_at,
			delivered_at,
			status
		`,
		)
		.eq("id", emailId)
		.eq("company_id", companyId)
		.eq("channel", "resend")
		.eq("type", "email")
		.single();

	if (error || !data) {
		return null;
	}

	const customer = Array.isArray(data.customer)
		? data.customer[0] ?? null
		: data.customer ?? null;

	return {
		...data,
		customer,
	};
}

export async function markEmailAsRead(
	companyId: string,
	emailId: string,
): Promise<boolean> {
	const supabase = await createClient();

	if (!supabase || !companyId) {
		console.error("❌ markEmailAsRead: Missing supabase or companyId");
		return false;
	}

	// First, check if the email exists and get its current state
	const { data: existingEmail, error: checkError } = await supabase
		.from("communications")
		.select("id, company_id, type, read_at")
		.eq("id", emailId)
		.single();

	if (checkError) {
		console.error("❌ markEmailAsRead: Email not found:", { emailId, error: checkError });
		return false;
	}

	if (!existingEmail) {
		console.error("❌ markEmailAsRead: Email not found:", emailId);
		return false;
	}

	// Verify company_id matches
	if (existingEmail.company_id !== companyId) {
		console.error("❌ markEmailAsRead: Company ID mismatch:", { 
			emailId, 
			emailCompanyId: existingEmail.company_id, 
			requestedCompanyId: companyId 
		});
		return false;
	}

	// Verify type is email
	if (existingEmail.type !== "email") {
		console.error("❌ markEmailAsRead: Type mismatch:", { 
			emailId, 
			type: existingEmail.type 
		});
		return false;
	}

	// If already read, return success
	if (existingEmail.read_at) {
		console.log("✅ markEmailAsRead: Already read:", { emailId, read_at: existingEmail.read_at });
		return true;
	}

	const readAt = new Date().toISOString();
	
	// Try update without .single() first to see if it affects any rows
	const { data: updateData, error: updateError, count } = await supabase
		.from("communications")
		.update({ read_at: readAt })
		.eq("id", emailId)
		.eq("company_id", companyId)
		.eq("type", "email")
		.select("id, read_at");

	if (updateError) {
		console.error("❌ markEmailAsRead update error:", { 
			emailId, 
			companyId,
			error: updateError, 
			errorCode: updateError.code, 
			errorMessage: updateError.message,
			errorDetails: updateError.details,
			errorHint: updateError.hint
		});
		return false;
	}

	if (!updateData || updateData.length === 0) {
		console.error("❌ markEmailAsRead: No rows updated", { 
			emailId, 
			companyId,
			count,
			existingEmail: existingEmail 
		});
		// This could mean RLS policy blocked it or the filters didn't match
		return false;
	}

	console.log("✅ markEmailAsRead success:", { emailId, read_at: updateData[0].read_at, rowsUpdated: updateData.length });
	return true;
}

export async function getEmailStats(): Promise<{
	totalEmails: number;
	sentEmails: number;
	receivedEmails: number;
	unreadEmails: number;
	threadsCount: number;
}> {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	if (!supabase || !companyId) {
		return {
			totalEmails: 0,
			sentEmails: 0,
			receivedEmails: 0,
			unreadEmails: 0,
			threadsCount: 0,
		};
	}

	// Get total emails
	const { count: totalCount } = await supabase
		.from("communications")
		.select("*", { count: "exact", head: true })
		.eq("company_id", companyId)
		.eq("channel", "resend")
		.eq("type", "email")
		.is("deleted_at", null);

	// Get sent emails
	const { count: sentCount } = await supabase
		.from("communications")
		.select("*", { count: "exact", head: true })
		.eq("company_id", companyId)
		.eq("channel", "resend")
		.eq("type", "email")
		.eq("direction", "outbound")
		.is("deleted_at", null);

	// Get received emails
	const { count: receivedCount } = await supabase
		.from("communications")
		.select("*", { count: "exact", head: true })
		.eq("company_id", companyId)
		.eq("channel", "resend")
		.eq("type", "email")
		.eq("direction", "inbound")
		.is("deleted_at", null);

	// Get unread emails
	const { count: unreadCount } = await supabase
		.from("communications")
		.select("*", { count: "exact", head: true })
		.eq("company_id", companyId)
		.eq("channel", "resend")
		.eq("type", "email")
		.eq("direction", "inbound")
		.is("read_at", null)
		.is("deleted_at", null);

	// For threads, we'll use a simple count of unique subjects
	// This is a simplified implementation
	const threadsCount = totalCount || 0;

	return {
		totalEmails: totalCount || 0,
		sentEmails: sentCount || 0,
		receivedEmails: receivedCount || 0,
		unreadEmails: unreadCount || 0,
		threadsCount,
	};
}

