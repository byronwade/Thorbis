"use server";

import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

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
		display_name: string | null;
		email: string | null;
		phone: string | null;
		company_name: string | null;
	} | null;
	sent_at: string | null;
	delivered_at: string | null;
	opened_at: string | null;
	clicked_at: string | null;
	open_count: number | null;
	click_count: number | null;
	status: string;
	tags?: string[] | null;
	category?: string | null;
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
			customer:customers!left(id, first_name, last_name, display_name, email, phone, company_name),
			sent_at,
			delivered_at,
			opened_at,
			clicked_at,
			open_count,
			click_count,
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
				// Inbox: inbound, not archived, not deleted, not draft, not spam, not snoozed (or snooze expired)
				query = query
					.eq("direction", "inbound")
					.eq("is_archived", false)
					.is("deleted_at", null)
					.neq("status", "draft")
					.or("category.is.null,category.neq.spam")
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
				query = query.or("category.eq.spam").is("deleted_at", null);
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
				query = query.is("deleted_at", null);
				break;
			default:
				// Custom folder or label filtering - will be done in memory after fetch
				// (JSONB array containment not supported by PostgREST cs operator)
				query = query.is("deleted_at", null);
				break;
		}
	} else {
		// Default: exclude deleted emails
		query = query.is("deleted_at", null);
	}

	// Filter by direction (if not already filtered by folder)
	if (
		!folder ||
		(folder !== "inbox" && folder !== "sent" && folder !== "drafts")
	) {
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

	// Normalize customer data and filter out channel field
	let emails: CompanyEmail[] = (data || []).map((email: any) => {
		const customer = Array.isArray(email.customer)
			? (email.customer[0] ?? null)
			: (email.customer ?? null);

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
	} else if (folder !== "archive") {
		// Exclude spam emails from all folders EXCEPT spam and archive
		// Archive should show ALL archived emails regardless of spam status
		emails = emails.filter((email: any) => {
			const tags = (email.tags as string[]) || [];
			const isSpam = email.category === "spam" || tags.includes("spam");
			return !isSpam; // Exclude spam from non-spam, non-archive folders
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

	// Post-process custom folder/label filtering (JSONB array containment not supported by PostgREST)
	const standardFolders = [
		"inbox",
		"spam",
		"starred",
		"sent",
		"drafts",
		"archive",
		"snoozed",
		"trash",
		"bin",
	];
	const folderName = label || folder;
	if (folderName && !standardFolders.includes(folderName)) {
		emails = emails.filter((email: any) => {
			const tags = (email.tags as string[]) || [];
			return tags.includes(folderName);
		});
		const customCount = emails.length;
		return {
			emails,
			total: customCount,
			hasMore: customCount >= limit,
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
			customer:customers(id, first_name, last_name, display_name, email, phone, company_name),
			sent_at,
			delivered_at,
			status
		`,
		)
		.eq("id", emailId)
		.eq("company_id", companyId)
		.in("channel", ["sendgrid", "resend"]) // SendGrid is primary, resend for legacy data
		.eq("type", "email")
		.single();

	if (error || !data) {
		return null;
	}

	const customer = Array.isArray(data.customer)
		? (data.customer[0] ?? null)
		: (data.customer ?? null);

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
		console.error("❌ markEmailAsRead: Email not found:", {
			emailId,
			error: checkError,
		});
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
			requestedCompanyId: companyId,
		});
		return false;
	}

	// Verify type is email
	if (existingEmail.type !== "email") {
		console.error("❌ markEmailAsRead: Type mismatch:", {
			emailId,
			type: existingEmail.type,
		});
		return false;
	}

	// If already read, return success
	if (existingEmail.read_at) {
		return true;
	}

	const readAt = new Date().toISOString();

	// Try update without .single() first to see if it affects any rows
	const {
		data: updateData,
		error: updateError,
		count,
	} = await supabase
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
			errorHint: updateError.hint,
		});
		return false;
	}

	if (!updateData || updateData.length === 0) {
		console.error("❌ markEmailAsRead: No rows updated", {
			emailId,
			companyId,
			count,
			existingEmail: existingEmail,
		});
		// This could mean RLS policy blocked it or the filters didn't match
		return false;
	}

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
		.in("channel", ["sendgrid", "resend"]) // SendGrid is primary, resend for legacy data
		.eq("type", "email")
		.is("deleted_at", null);

	// Get sent emails
	const { count: sentCount } = await supabase
		.from("communications")
		.select("*", { count: "exact", head: true })
		.eq("company_id", companyId)
		.in("channel", ["sendgrid", "resend"]) // SendGrid is primary, resend for legacy data
		.eq("type", "email")
		.eq("direction", "outbound")
		.is("deleted_at", null);

	// Get received emails
	const { count: receivedCount } = await supabase
		.from("communications")
		.select("*", { count: "exact", head: true })
		.eq("company_id", companyId)
		.in("channel", ["sendgrid", "resend"]) // SendGrid is primary, resend for legacy data
		.eq("type", "email")
		.eq("direction", "inbound")
		.is("deleted_at", null);

	// Get unread emails
	const { count: unreadCount } = await supabase
		.from("communications")
		.select("*", { count: "exact", head: true })
		.eq("company_id", companyId)
		.in("channel", ["sendgrid", "resend"]) // SendGrid is primary, resend for legacy data
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

export type ArchiveAllEmailsResult = {
	success: boolean;
	count: number;
	error?: string;
};

export async function archiveAllEmails(
	companyId: string,
	folder?: EmailFolder,
): Promise<ArchiveAllEmailsResult> {
	const supabase = await createClient();

	if (!supabase) {
		return { success: false, count: 0, error: "Database connection failed" };
	}

	if (!companyId) {
		return { success: false, count: 0, error: "Missing company ID" };
	}

	const buildArchiveQuery = () =>
		supabase
			.from("communications")
			.update({ is_archived: true })
			.eq("company_id", companyId)
			.eq("type", "email");

	type ArchiveQuery = ReturnType<typeof buildArchiveQuery>;

	const runArchive = async (queryBuilder: ArchiveQuery) => {
		const { data, error, count } = await queryBuilder.select("id", {
			count: "exact",
		});

		if (error) {
			throw error;
		}

		return data?.length ?? count ?? 0;
	};

	const folderName = folder?.trim();
	const normalizedFolder = folderName?.toLowerCase();

	try {
		switch (normalizedFolder || "inbox") {
			case "inbox": {
				// Inbox: inbound, not archived, not draft, not spam, not snoozed (or snooze expired)
				const archived = await runArchive(
					buildArchiveQuery()
						.eq("direction", "inbound")
						.eq("is_archived", false)
						.neq("status", "draft")
						.or("category.is.null,category.neq.spam")
						.or(
							`snoozed_until.is.null,snoozed_until.lt.${new Date().toISOString()}`,
						)
						.is("deleted_at", null),
				);
				return { success: true, count: archived };
			}
			case "drafts": {
				const archived = await runArchive(
					buildArchiveQuery().eq("status", "draft").is("deleted_at", null),
				);
				return { success: true, count: archived };
			}
			case "sent": {
				const archived = await runArchive(
					buildArchiveQuery()
						.eq("direction", "outbound")
						.eq("is_archived", false)
						.is("deleted_at", null)
						.neq("status", "draft"),
				);
				return { success: true, count: archived };
			}
			case "archive": {
				const archived = await runArchive(
					buildArchiveQuery().eq("is_archived", true).is("deleted_at", null),
				);
				return { success: true, count: archived };
			}
			case "snoozed": {
				const archived = await runArchive(
					buildArchiveQuery()
						.not("snoozed_until", "is", null)
						.gt("snoozed_until", new Date().toISOString())
						.is("deleted_at", null),
				);
				return { success: true, count: archived };
			}
			case "spam": {
				const categorized = await runArchive(
					buildArchiveQuery().eq("category", "spam").is("deleted_at", null),
				);
				// For spam tagged emails, fetch IDs first then update (JSONB filtering not supported)
				const { data: spamTaggedEmails } = await supabase
					.from("communications")
					.select("id, tags")
					.eq("company_id", companyId)
					.eq("type", "email")
					.neq("category", "spam")
					.is("deleted_at", null);
				const spamTaggedIds = (spamTaggedEmails ?? [])
					.filter(
						(e) =>
							Array.isArray(e.tags) && (e.tags as string[]).includes("spam"),
					)
					.map((e) => e.id);
				let taggedCount = 0;
				if (spamTaggedIds.length > 0) {
					const { data } = await supabase
						.from("communications")
						.update({ is_archived: true })
						.in("id", spamTaggedIds)
						.select("id");
					taggedCount = data?.length ?? 0;
				}
				return {
					success: true,
					count: categorized + taggedCount,
				};
			}
			case "trash":
			case "bin": {
				const archived = await runArchive(
					buildArchiveQuery().not("deleted_at", "is", null),
				);
				return { success: true, count: archived };
			}
			case "starred": {
				// Fetch starred email IDs first then update (JSONB filtering not supported)
				const { data: starredEmails } = await supabase
					.from("communications")
					.select("id, tags")
					.eq("company_id", companyId)
					.eq("type", "email")
					.is("deleted_at", null);
				const starredIds = (starredEmails ?? [])
					.filter(
						(e) =>
							Array.isArray(e.tags) && (e.tags as string[]).includes("starred"),
					)
					.map((e) => e.id);
				let starredCount = 0;
				if (starredIds.length > 0) {
					const { data } = await supabase
						.from("communications")
						.update({ is_archived: true })
						.in("id", starredIds)
						.select("id");
					starredCount = data?.length ?? 0;
				}
				return { success: true, count: starredCount };
			}
			default: {
				// Custom folder - fetch IDs first then update (JSONB filtering not supported)
				const { data: customEmails } = await supabase
					.from("communications")
					.select("id, tags")
					.eq("company_id", companyId)
					.eq("type", "email")
					.is("deleted_at", null);
				const customIds = (customEmails ?? [])
					.filter(
						(e) =>
							Array.isArray(e.tags) &&
							folderName &&
							(e.tags as string[]).includes(folderName),
					)
					.map((e) => e.id);
				let customCount = 0;
				if (customIds.length > 0) {
					const { data } = await supabase
						.from("communications")
						.update({ is_archived: true })
						.in("id", customIds)
						.select("id");
					customCount = data?.length ?? 0;
				}
				return { success: true, count: customCount };
			}
		}
	} catch (error) {
		console.error("❌ archiveAllEmails error:", { companyId, folder, error });
		return {
			success: false,
			count: 0,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
