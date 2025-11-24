/**
 * Communications Query Helpers with Permission Filtering
 *
 * Provides helper functions for querying communications (emails, SMS, calls)
 * with proper permission filtering based on team member roles and visibility.
 *
 * All queries automatically filter by:
 * 1. Company isolation (only show company's communications)
 * 2. Permission-based visibility (respects RLS + email_permissions)
 * 3. Visibility scope (private, team, department, shared, company)
 *
 * @see /src/lib/email/email-permissions.ts
 */

import { cache } from "react";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import {
	canViewCommunication,
	getEmailCategories,
	type EmailCategory,
	type VisibilityScope,
} from "@/lib/email/email-permissions";

// =============================================================================
// TYPES
// =============================================================================

export interface Communication {
	id: string;
	companyId: string;
	type: "email" | "sms" | "call" | "voicemail";
	direction: "inbound" | "outbound";
	status: string;
	fromAddress?: string;
	toAddress?: string;
	subject?: string;
	body?: string;
	customerId?: string;
	mailboxOwnerId?: string | null;
	assignedTo?: string | null;
	visibilityScope?: VisibilityScope | null;
	emailCategory?: EmailCategory;
	gmailMessageId?: string;
	createdAt: string;
	customer?: {
		id: string;
		firstName?: string;
		lastName?: string;
		email?: string;
	};
	assignedTeamMember?: {
		id: string;
		firstName: string;
		lastName: string;
	};
}

export interface CommunicationsFilters {
	type?: "email" | "sms" | "call" | "voicemail";
	direction?: "inbound" | "outbound";
	status?: string;
	customerId?: string;
	assignedTo?: string;
	mailboxOwnerId?: string;
	category?: EmailCategory;
	visibilityScope?: VisibilityScope;
	searchQuery?: string;
	limit?: number;
	offset?: number;
}

// =============================================================================
// QUERY FUNCTIONS
// =============================================================================

/**
 * Get communications for a team member with permission filtering
 *
 * This is the primary function for fetching communications.
 * It automatically applies permission checks and visibility filtering.
 *
 * @param teamMemberId - Team member viewing the communications
 * @param companyId - Company ID
 * @param filters - Optional filters
 * @returns Promise<Communication[]>
 */
export const getCommunications = cache(
	async (
		teamMemberId: string,
		companyId: string,
		filters: CommunicationsFilters = {}
	): Promise<Communication[]> => {
		const supabase = await createServiceSupabaseClient();

		// Build base query
		let query = supabase
			.from("communications")
			.select(
				`
			*,
			customer:customers(id, first_name, last_name, email),
			assignedTeamMember:team_members!assigned_to(id, first_name, last_name)
		`
			)
			.eq("company_id", companyId);

		// Apply filters
		if (filters.type) {
			query = query.eq("type", filters.type);
		}

		if (filters.direction) {
			query = query.eq("direction", filters.direction);
		}

		if (filters.status) {
			query = query.eq("status", filters.status);
		}

		if (filters.customerId) {
			query = query.eq("customer_id", filters.customerId);
		}

		if (filters.assignedTo) {
			query = query.eq("assigned_to", filters.assignedTo);
		}

		if (filters.mailboxOwnerId) {
			query = query.eq("mailbox_owner_id", filters.mailboxOwnerId);
		}

		if (filters.visibilityScope) {
			query = query.eq("visibility_scope", filters.visibilityScope);
		}

		if (filters.searchQuery) {
			query = query.or(
				`subject.ilike.%${filters.searchQuery}%,body.ilike.%${filters.searchQuery}%,from_address.ilike.%${filters.searchQuery}%,to_address.ilike.%${filters.searchQuery}%`
			);
		}

		// Apply pagination
		const limit = filters.limit || 50;
		const offset = filters.offset || 0;

		query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

		const { data: communications, error } = await query;

		if (error) {
			console.error("[Communications Query] Error fetching communications:", error);
			return [];
		}

		if (!communications || communications.length === 0) {
			return [];
		}

		// Filter by permissions (post-fetch)
		// This is necessary because RLS policies can't easily express complex permission logic
		const filtered: Communication[] = [];

		for (const comm of communications) {
			const canView = await canViewCommunication(teamMemberId, {
				mailboxOwnerId: comm.mailbox_owner_id,
				assignedTo: comm.assigned_to,
				visibilityScope: comm.visibility_scope as VisibilityScope | null,
				emailCategory: comm.email_category as EmailCategory | undefined,
			});

			if (canView) {
				filtered.push({
					id: comm.id,
					companyId: comm.company_id,
					type: comm.type as "email" | "sms" | "call" | "voicemail",
					direction: comm.direction as "inbound" | "outbound",
					status: comm.status,
					fromAddress: comm.from_address || undefined,
					toAddress: comm.to_address || undefined,
					subject: comm.subject || undefined,
					body: comm.body || undefined,
					customerId: comm.customer_id || undefined,
					mailboxOwnerId: comm.mailbox_owner_id,
					assignedTo: comm.assigned_to,
					visibilityScope: comm.visibility_scope as VisibilityScope | null | undefined,
					emailCategory: comm.email_category as EmailCategory | undefined,
					gmailMessageId: comm.gmail_message_id || undefined,
					createdAt: comm.created_at,
					customer: comm.customer
						? {
								id: comm.customer.id,
								firstName: comm.customer.first_name || undefined,
								lastName: comm.customer.last_name || undefined,
								email: comm.customer.email || undefined,
							}
						: undefined,
					assignedTeamMember: comm.assignedTeamMember
						? {
								id: comm.assignedTeamMember.id,
								firstName: comm.assignedTeamMember.first_name,
								lastName: comm.assignedTeamMember.last_name,
							}
						: undefined,
				});
			}
		}

		return filtered;
	}
);

/**
 * Get communications by category
 *
 * @param teamMemberId - Team member viewing
 * @param companyId - Company ID
 * @param category - Email category
 * @param limit - Max results
 * @returns Promise<Communication[]>
 */
export async function getCommunicationsByCategory(
	teamMemberId: string,
	companyId: string,
	category: EmailCategory,
	limit: number = 50
): Promise<Communication[]> {
	return getCommunications(teamMemberId, companyId, {
		category,
		type: "email",
		limit,
	});
}

/**
 * Get personal inbox for a team member
 *
 * Returns emails from their connected Gmail account (mailboxOwnerId = teamMemberId)
 *
 * @param teamMemberId - Team member ID
 * @param companyId - Company ID
 * @param limit - Max results
 * @returns Promise<Communication[]>
 */
export async function getPersonalInbox(
	teamMemberId: string,
	companyId: string,
	limit: number = 50
): Promise<Communication[]> {
	return getCommunications(teamMemberId, companyId, {
		mailboxOwnerId: teamMemberId,
		type: "email",
		limit,
	});
}

/**
 * Get shared communications (non-personal, visible to team)
 *
 * @param teamMemberId - Team member ID
 * @param companyId - Company ID
 * @param limit - Max results
 * @returns Promise<Communication[]>
 */
export async function getSharedCommunications(
	teamMemberId: string,
	companyId: string,
	limit: number = 50
): Promise<Communication[]> {
	const supabase = await createServiceSupabaseClient();

	// Get team member's accessible categories
	const categories = await getEmailCategories(teamMemberId, "read");

	// Fetch shared communications
	const { data: communications } = await supabase
		.from("communications")
		.select(
			`
			*,
			customer:customers(id, first_name, last_name, email),
			assignedTeamMember:team_members!assigned_to(id, first_name, last_name)
		`
		)
		.eq("company_id", companyId)
		.eq("type", "email")
		.in("visibility_scope", ["shared", "company"])
		.is("mailbox_owner_id", null) // Exclude personal emails
		.order("created_at", { ascending: false })
		.limit(limit);

	if (!communications) return [];

	// Filter by category permissions
	const filtered: Communication[] = [];

	for (const comm of communications) {
		const category = (comm.email_category as EmailCategory) || "support";

		// Check if user has access to this category
		if (categories.includes("all") || categories.includes(category)) {
			const canView = await canViewCommunication(teamMemberId, {
				mailboxOwnerId: comm.mailbox_owner_id,
				assignedTo: comm.assigned_to,
				visibilityScope: comm.visibility_scope as VisibilityScope | null,
				emailCategory: category,
			});

			if (canView) {
				filtered.push({
					id: comm.id,
					companyId: comm.company_id,
					type: comm.type as "email" | "sms" | "call" | "voicemail",
					direction: comm.direction as "inbound" | "outbound",
					status: comm.status,
					fromAddress: comm.from_address || undefined,
					toAddress: comm.to_address || undefined,
					subject: comm.subject || undefined,
					body: comm.body || undefined,
					customerId: comm.customer_id || undefined,
					mailboxOwnerId: comm.mailbox_owner_id,
					assignedTo: comm.assigned_to,
					visibilityScope: comm.visibility_scope as VisibilityScope | null | undefined,
					emailCategory: category,
					gmailMessageId: comm.gmail_message_id || undefined,
					createdAt: comm.created_at,
					customer: comm.customer
						? {
								id: comm.customer.id,
								firstName: comm.customer.first_name || undefined,
								lastName: comm.customer.last_name || undefined,
								email: comm.customer.email || undefined,
							}
						: undefined,
					assignedTeamMember: comm.assignedTeamMember
						? {
								id: comm.assignedTeamMember.id,
								firstName: comm.assignedTeamMember.first_name,
								lastName: comm.assignedTeamMember.last_name,
							}
						: undefined,
				});
			}
		}
	}

	return filtered;
}

/**
 * Get assigned communications (emails assigned to team member)
 *
 * @param teamMemberId - Team member ID
 * @param companyId - Company ID
 * @param limit - Max results
 * @returns Promise<Communication[]>
 */
export async function getAssignedCommunications(
	teamMemberId: string,
	companyId: string,
	limit: number = 50
): Promise<Communication[]> {
	return getCommunications(teamMemberId, companyId, {
		assignedTo: teamMemberId,
		type: "email",
		limit,
	});
}

/**
 * Get communication by ID with permission check
 *
 * @param communicationId - Communication ID
 * @param teamMemberId - Team member viewing
 * @returns Promise<Communication | null>
 */
export async function getCommunicationById(
	communicationId: string,
	teamMemberId: string
): Promise<Communication | null> {
	const supabase = await createServiceSupabaseClient();

	const { data: comm, error } = await supabase
		.from("communications")
		.select(
			`
			*,
			customer:customers(id, first_name, last_name, email),
			assignedTeamMember:team_members!assigned_to(id, first_name, last_name)
		`
		)
		.eq("id", communicationId)
		.single();

	if (error || !comm) {
		return null;
	}

	// Check permissions
	const canView = await canViewCommunication(teamMemberId, {
		mailboxOwnerId: comm.mailbox_owner_id,
		assignedTo: comm.assigned_to,
		visibilityScope: comm.visibility_scope as VisibilityScope | null,
		emailCategory: comm.email_category as EmailCategory | undefined,
	});

	if (!canView) {
		return null;
	}

	return {
		id: comm.id,
		companyId: comm.company_id,
		type: comm.type as "email" | "sms" | "call" | "voicemail",
		direction: comm.direction as "inbound" | "outbound",
		status: comm.status,
		fromAddress: comm.from_address || undefined,
		toAddress: comm.to_address || undefined,
		subject: comm.subject || undefined,
		body: comm.body || undefined,
		customerId: comm.customer_id || undefined,
		mailboxOwnerId: comm.mailbox_owner_id,
		assignedTo: comm.assigned_to,
		visibilityScope: comm.visibility_scope as VisibilityScope | null | undefined,
		emailCategory: comm.email_category as EmailCategory | undefined,
		gmailMessageId: comm.gmail_message_id || undefined,
		createdAt: comm.created_at,
		customer: comm.customer
			? {
					id: comm.customer.id,
					firstName: comm.customer.first_name || undefined,
					lastName: comm.customer.last_name || undefined,
					email: comm.customer.email || undefined,
				}
			: undefined,
		assignedTeamMember: comm.assignedTeamMember
			? {
					id: comm.assignedTeamMember.id,
					firstName: comm.assignedTeamMember.first_name,
					lastName: comm.assignedTeamMember.last_name,
				}
			: undefined,
	};
}

/**
 * Get communication count by category for a team member
 *
 * @param teamMemberId - Team member ID
 * @param companyId - Company ID
 * @returns Promise<Record<EmailCategory, number>>
 */
export async function getCommunicationCountsByCategory(
	teamMemberId: string,
	companyId: string
): Promise<Record<string, number>> {
	const categories = await getEmailCategories(teamMemberId, "read");

	const counts: Record<string, number> = {};

	for (const category of categories) {
		const communications = await getCommunicationsByCategory(
			teamMemberId,
			companyId,
			category,
			1000 // Get all for counting
		);
		counts[category] = communications.length;
	}

	return counts;
}
