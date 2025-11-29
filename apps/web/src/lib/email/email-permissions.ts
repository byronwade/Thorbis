/**
 * Email Permissions Service
 *
 * Role-based email access control system that manages what team members can do
 * with emails based on their permissions and the email's visibility scope.
 *
 * Key Concepts:
 * 1. Email Categories: personal, support, sales, billing, marketing, all
 * 2. Permission Types: can_read, can_send, can_assign
 * 3. Visibility Scopes: private, team, department, shared, company
 * 4. Automatic Grants: Permissions auto-granted on team member creation via trigger
 *
 * Permission Hierarchy:
 * - Owners/Admins: "all" category (full access to everything)
 * - CSRs: "support" category (support emails only)
 * - Everyone: "personal" category (their own mailbox)
 *
 * Visibility Rules:
 * - private: Only mailbox owner
 * - team: Mailbox owner + team members with same role
 * - department: Mailbox owner + department members
 * - shared: Anyone with category permission
 * - company: Everyone in company
 *
 * @see /docs/email/REPLY_TO_ARCHITECTURE.md
 */

import { cache } from "react";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Email category types
 */
export type EmailCategory =
	| "personal"
	| "support"
	| "sales"
	| "billing"
	| "marketing"
	| "all";

/**
 * Visibility scope types
 */
export type VisibilityScope =
	| "private"
	| "team"
	| "department"
	| "shared"
	| "company";

/**
 * Permission action types
 */
export type PermissionAction = "read" | "send" | "assign";

/**
 * Permission record from database
 */
export interface EmailPermission {
	id: string;
	companyId: string;
	teamMemberId: string;
	emailCategory: EmailCategory;
	canRead: boolean;
	canSend: boolean;
	canAssign: boolean;
}

/**
 * Team member role types
 */
export type TeamMemberRole =
	| "owner"
	| "admin"
	| "manager"
	| "technician"
	| "csr"
	| "sales"
	| "accountant";

// =============================================================================
// CORE PERMISSION CHECKING
// =============================================================================

/**
 * Check if a team member has a specific permission for an email category
 *
 * @param teamMemberId - Team member ID to check
 * @param category - Email category to check (personal, support, sales, etc.)
 * @param action - Permission action (read, send, assign)
 * @returns Promise<boolean> - True if permission granted
 *
 * @example
 * const canRead = await hasEmailPermission(teamMemberId, "support", "read");
 * if (canRead) {
 *   // Show support emails
 * }
 */
async function hasEmailPermission(
	teamMemberId: string,
	category: EmailCategory,
	action: PermissionAction,
): Promise<boolean> {
	const supabase = await createServiceSupabaseClient();

	// Get permissions for this team member and category
	const { data: permission } = await supabase
		.from("email_permissions")
		.select("can_read, can_send, can_assign")
		.eq("team_member_id", teamMemberId)
		.eq("email_category", category)
		.maybeSingle();

	if (!permission) {
		// No permission record = no access
		return false;
	}

	// Check specific action
	switch (action) {
		case "read":
			return permission.can_read;
		case "send":
			return permission.can_send;
		case "assign":
			return permission.can_assign;
		default:
			return false;
	}
}

/**
 * Check if team member has "all" category permission (owner/admin)
 *
 * @param teamMemberId - Team member ID to check
 * @param action - Permission action (read, send, assign)
 * @returns Promise<boolean> - True if has "all" permission
 */
async function hasAllCategoryPermission(
	teamMemberId: string,
	action: PermissionAction,
): Promise<boolean> {
	return hasEmailPermission(teamMemberId, "all", action);
}

/**
 * Get all email categories a team member has access to
 *
 * @param teamMemberId - Team member ID
 * @param action - Permission action (read, send, assign)
 * @returns Promise<EmailCategory[]> - List of accessible categories
 *
 * @example
 * const categories = await getEmailCategories(teamMemberId, "read");
 * // ["personal", "support", "all"]
 */
export const getEmailCategories = cache(
	async (
		teamMemberId: string,
		action: PermissionAction,
	): Promise<EmailCategory[]> => {
		const supabase = await createServiceSupabaseClient();

		// Get all permissions for this team member
		const { data: permissions } = await supabase
			.from("email_permissions")
			.select("email_category, can_read, can_send, can_assign")
			.eq("team_member_id", teamMemberId);

		if (!permissions || permissions.length === 0) {
			return [];
		}

		// Filter by action
		return permissions
			.filter((p) => {
				switch (action) {
					case "read":
						return p.can_read;
					case "send":
						return p.can_send;
					case "assign":
						return p.can_assign;
					default:
						return false;
				}
			})
			.map((p) => p.email_category as EmailCategory);
	},
);

// =============================================================================
// COMMUNICATION VISIBILITY
// =============================================================================

/**
 * Check if a team member can view a specific communication
 *
 * Considers:
 * 1. Visibility scope (private, team, department, shared, company)
 * 2. Mailbox ownership (can always see their own emails)
 * 3. Email category permissions
 * 4. Assignment (can see assigned emails)
 * 5. Owner/admin override (can see everything)
 *
 * @param teamMemberId - Team member ID to check
 * @param communication - Communication record with visibility and ownership
 * @returns Promise<boolean> - True if can view
 */
export async function canViewCommunication(
	teamMemberId: string,
	communication: {
		mailboxOwnerId?: string | null;
		assignedTo?: string | null;
		visibilityScope?: VisibilityScope | null;
		emailCategory?: EmailCategory;
	},
): Promise<boolean> {
	// 1. Check if owner/admin (can see everything)
	const hasAllAccess = await hasAllCategoryPermission(teamMemberId, "read");
	if (hasAllAccess) {
		return true;
	}

	// 2. Check if mailbox owner (can always see own emails)
	if (communication.mailboxOwnerId === teamMemberId) {
		return true;
	}

	// 3. Check if assigned to this user
	if (communication.assignedTo === teamMemberId) {
		return true;
	}

	// 4. Check visibility scope
	const scope = communication.visibilityScope;

	if (!scope || scope === "company") {
		// Company-wide or legacy emails (no scope) are visible to all
		return true;
	}

	if (scope === "private") {
		// Private emails only visible to owner
		return false;
	}

	if (scope === "shared") {
		// Shared emails require category permission
		const category = communication.emailCategory || "support";
		return hasEmailPermission(teamMemberId, category, "read");
	}

	if (scope === "team") {
		// Team scope requires same role as owner
		return checkTeamVisibility(teamMemberId, communication.mailboxOwnerId);
	}

	if (scope === "department") {
		// Department scope requires same department as owner
		return checkDepartmentVisibility(
			teamMemberId,
			communication.mailboxOwnerId,
		);
	}

	// Default deny
	return false;
}

/**
 * Check if team member is on same team as email owner
 */
async function checkTeamVisibility(
	teamMemberId: string,
	ownerId?: string | null,
): Promise<boolean> {
	if (!ownerId) return false;

	const supabase = await createServiceSupabaseClient();

	// Get both team members' roles
	const { data: members } = await supabase
		.from("team_members")
		.select("id, role")
		.in("id", [teamMemberId, ownerId]);

	if (!members || members.length !== 2) {
		return false;
	}

	// Check if same role
	const viewer = members.find((m) => m.id === teamMemberId);
	const owner = members.find((m) => m.id === ownerId);

	return viewer?.role === owner?.role;
}

/**
 * Check if team member is in same department as email owner
 */
async function checkDepartmentVisibility(
	teamMemberId: string,
	ownerId?: string | null,
): Promise<boolean> {
	if (!ownerId) return false;

	const supabase = await createServiceSupabaseClient();

	// Get both team members' departments
	const { data: members } = await supabase
		.from("team_members")
		.select("id, department")
		.in("id", [teamMemberId, ownerId]);

	if (!members || members.length !== 2) {
		return false;
	}

	// Check if same department
	const viewer = members.find((m) => m.id === teamMemberId);
	const owner = members.find((m) => m.id === ownerId);

	return viewer?.department === owner?.department;
}

// =============================================================================
// BATCH PERMISSION CHECKING (N+1 Query Optimization)
// =============================================================================

/**
 * Permission context for batch checking
 * Pre-fetched data to avoid N+1 queries
 */
interface BatchPermissionContext {
	teamMemberId: string;
	hasAllAccess: boolean;
	categoryPermissions: Map<EmailCategory, boolean>;
	teamMemberData: {
		role?: string | null;
		department?: string | null;
	};
	ownerDataCache: Map<string, { role?: string | null; department?: string | null }>;
}

/**
 * Create a permission context for batch checking multiple communications
 * This pre-fetches all necessary data to avoid N+1 queries
 *
 * @param teamMemberId - Team member ID to check permissions for
 * @param ownerIds - Unique list of mailbox owner IDs that appear in the communications batch
 * @returns Promise<BatchPermissionContext> - Pre-fetched permission context
 */
async function createBatchPermissionContext(
	teamMemberId: string,
	ownerIds: (string | null)[],
): Promise<BatchPermissionContext> {
	const supabase = await createServiceSupabaseClient();

	// 1. Check if has "all" category permission (owner/admin)
	const hasAllAccess = await hasAllCategoryPermission(teamMemberId, "read");

	// 2. Fetch all email category permissions for this team member
	const { data: permissions } = await supabase
		.from("email_permissions")
		.select("email_category, can_read")
		.eq("team_member_id", teamMemberId)
		.eq("can_read", true);

	const categoryPermissions = new Map<EmailCategory, boolean>();
	if (permissions) {
		permissions.forEach((p) => {
			categoryPermissions.set(p.email_category as EmailCategory, true);
		});
	}

	// 3. Fetch team member's own role and department
	const { data: viewerMember } = await supabase
		.from("team_members")
		.select("id, role, department")
		.eq("id", teamMemberId)
		.single();

	// 4. Fetch all unique owner team member data in one query
	const uniqueOwnerIds = [...new Set(ownerIds.filter((id): id is string => !!id))];
	let ownerDataCache = new Map<string, { role?: string | null; department?: string | null }>();

	if (uniqueOwnerIds.length > 0) {
		const { data: ownerMembers } = await supabase
			.from("team_members")
			.select("id, role, department")
			.in("id", uniqueOwnerIds);

		if (ownerMembers) {
			ownerMembers.forEach((member) => {
				ownerDataCache.set(member.id, {
					role: member.role,
					department: member.department,
				});
			});
		}
	}

	return {
		teamMemberId,
		hasAllAccess: hasAllAccess || false,
		categoryPermissions,
		teamMemberData: {
			role: viewerMember?.role || null,
			department: viewerMember?.department || null,
		},
		ownerDataCache,
	};
}

/**
 * Batch check if a team member can view multiple communications
 * This eliminates N+1 queries by pre-fetching all necessary data
 *
 * @param teamMemberId - Team member ID to check permissions for
 * @param communications - Array of communications to check
 * @returns Promise<boolean[]> - Array of boolean results, one per communication
 *
 * @example
 * const communications = [...]; // 50 communications
 * const canView = await batchCanViewCommunications(teamMemberId, communications);
 * // Returns [true, false, true, ...] - only 2-3 database queries total instead of 50-150
 */
export async function batchCanViewCommunications(
	teamMemberId: string,
	communications: Array<{
		mailboxOwnerId?: string | null;
		assignedTo?: string | null;
		visibilityScope?: VisibilityScope | null;
		emailCategory?: EmailCategory;
	}>,
): Promise<boolean[]> {
	if (communications.length === 0) {
		return [];
	}

	// Extract unique owner IDs for batch fetching
	const ownerIds = communications
		.map((comm) => comm.mailboxOwnerId)
		.filter((id): id is string => id !== null && id !== undefined);

	// Create permission context (pre-fetches all data)
	const context = await createBatchPermissionContext(teamMemberId, ownerIds);

	// Perform in-memory checks for all communications
	return communications.map((comm) => {
		// 1. Check if owner/admin (can see everything)
		if (context.hasAllAccess) {
			return true;
		}

		// 2. Check if mailbox owner (can always see own emails)
		if (comm.mailboxOwnerId === teamMemberId) {
			return true;
		}

		// 3. Check if assigned to this user
		if (comm.assignedTo === teamMemberId) {
			return true;
		}

		// 4. Check visibility scope
		const scope = comm.visibilityScope;

		if (!scope || scope === "company") {
			// Company-wide or legacy emails (no scope) are visible to all
			return true;
		}

		if (scope === "private") {
			// Private emails only visible to owner
			return false;
		}

		if (scope === "shared") {
			// Shared emails require category permission
			const category = comm.emailCategory || "support";
			return context.categoryPermissions.has(category) || context.categoryPermissions.has("all");
		}

		if (scope === "team") {
			// Team scope requires same role as owner
			if (!comm.mailboxOwnerId) {
				return false;
			}
			const ownerData = context.ownerDataCache.get(comm.mailboxOwnerId);
			if (!ownerData) {
				return false;
			}
			return context.teamMemberData.role === ownerData.role && context.teamMemberData.role !== null;
		}

		if (scope === "department") {
			// Department scope requires same department as owner
			if (!comm.mailboxOwnerId) {
				return false;
			}
			const ownerData = context.ownerDataCache.get(comm.mailboxOwnerId);
			if (!ownerData) {
				return false;
			}
			return context.teamMemberData.department === ownerData.department && context.teamMemberData.department !== null;
		}

		// Default deny
		return false;
	});
}

// =============================================================================
// PERMISSION MANAGEMENT
// =============================================================================

/**
 * Grant email permission to a team member
 *
 * @param teamMemberId - Team member ID
 * @param companyId - Company ID
 * @param category - Email category
 * @param permissions - Permissions to grant
 * @returns Promise<{success: boolean, error?: string}>
 */
export async function grantEmailPermission(
	teamMemberId: string,
	companyId: string,
	category: EmailCategory,
	permissions: {
		canRead?: boolean;
		canSend?: boolean;
		canAssign?: boolean;
	},
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createServiceSupabaseClient();

		const { error } = await supabase.from("email_permissions").upsert(
			{
				team_member_id: teamMemberId,
				company_id: companyId,
				email_category: category,
				can_read: permissions.canRead ?? true,
				can_send: permissions.canSend ?? true,
				can_assign: permissions.canAssign ?? false,
			},
			{
				onConflict: "team_member_id,email_category",
			},
		);

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Revoke email permission from a team member
 *
 * @param teamMemberId - Team member ID
 * @param category - Email category to revoke
 * @returns Promise<{success: boolean, error?: string}>
 */
export async function revokeEmailPermission(
	teamMemberId: string,
	category: EmailCategory,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createServiceSupabaseClient();

		const { error } = await supabase
			.from("email_permissions")
			.delete()
			.eq("team_member_id", teamMemberId)
			.eq("email_category", category);

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Get all permissions for a team member
 *
 * @param teamMemberId - Team member ID
 * @returns Promise<EmailPermission[]> - List of permissions
 */
export const getTeamMemberPermissions = cache(
	async (teamMemberId: string): Promise<EmailPermission[]> => {
		const supabase = await createServiceSupabaseClient();

		const { data: permissions } = await supabase
			.from("email_permissions")
			.select("*")
			.eq("team_member_id", teamMemberId)
			.order("email_category");

		if (!permissions) {
			return [];
		}

		return permissions.map((p) => ({
			id: p.id,
			companyId: p.company_id,
			teamMemberId: p.team_member_id,
			emailCategory: p.email_category as EmailCategory,
			canRead: p.can_read,
			canSend: p.can_send,
			canAssign: p.can_assign,
		}));
	},
);

/**
 * Update permission for a specific action
 *
 * @param teamMemberId - Team member ID
 * @param category - Email category
 * @param action - Permission action
 * @param granted - Whether permission is granted
 * @returns Promise<{success: boolean, error?: string}>
 */
async function updatePermissionAction(
	teamMemberId: string,
	category: EmailCategory,
	action: PermissionAction,
	granted: boolean,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createServiceSupabaseClient();

		// Map action to column name
		const columnMap = {
			read: "can_read",
			send: "can_send",
			assign: "can_assign",
		};

		const column = columnMap[action];

		const { error } = await supabase
			.from("email_permissions")
			.update({ [column]: granted })
			.eq("team_member_id", teamMemberId)
			.eq("email_category", category);

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

// =============================================================================
// CATEGORY HELPERS
// =============================================================================

/**
 * Determine email category from communication metadata
 *
 * @param communication - Communication record
 * @returns EmailCategory - Determined category
 */
function determineEmailCategory(communication: {
	subject?: string;
	body?: string;
	from?: string;
	mailboxOwnerId?: string | null;
}): EmailCategory {
	// Personal emails (from user's connected Gmail)
	if (communication.mailboxOwnerId) {
		return "personal";
	}

	// Check subject/body for keywords
	const text =
		`${communication.subject || ""} ${communication.body || ""}`.toLowerCase();

	if (
		text.includes("support") ||
		text.includes("help") ||
		text.includes("issue") ||
		text.includes("problem")
	) {
		return "support";
	}

	if (
		text.includes("quote") ||
		text.includes("proposal") ||
		text.includes("estimate")
	) {
		return "sales";
	}

	if (
		text.includes("invoice") ||
		text.includes("payment") ||
		text.includes("billing")
	) {
		return "billing";
	}

	if (
		text.includes("newsletter") ||
		text.includes("promotion") ||
		text.includes("campaign")
	) {
		return "marketing";
	}

	// Default to support for company emails
	return "support";
}

/**
 * Get appropriate visibility scope based on category and context
 *
 * @param category - Email category
 * @param isPersonal - Whether from personal mailbox
 * @returns VisibilityScope - Suggested scope
 */
function getDefaultVisibilityScope(
	category: EmailCategory,
	isPersonal: boolean,
): VisibilityScope {
	// Personal emails default to private
	if (isPersonal) {
		return "private";
	}

	// Company emails default based on category
	switch (category) {
		case "personal":
			return "private";
		case "support":
			return "shared"; // Support team can see
		case "sales":
			return "shared"; // Sales team can see
		case "billing":
			return "shared"; // Billing team can see
		case "marketing":
			return "company"; // Everyone can see marketing
		case "all":
			return "company"; // All-access means company-wide
		default:
			return "shared";
	}
}
