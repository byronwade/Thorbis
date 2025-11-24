/**
 * Email Permissions API
 *
 * Manages email category permissions for team members.
 * Only owners and admins can modify permissions.
 *
 * Endpoints:
 * - GET /api/email/permissions?teamMemberId=xxx - Get permissions for a team member
 * - POST /api/email/permissions - Grant or update permissions
 * - DELETE /api/email/permissions - Revoke permissions
 *
 * Permission Categories:
 * - personal: User's own mailbox
 * - support: Customer support emails
 * - sales: Sales-related emails
 * - billing: Billing and payment emails
 * - marketing: Marketing campaigns
 * - all: Full access (owner/admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
	grantEmailPermission,
	revokeEmailPermission,
	getTeamMemberPermissions,
	type EmailCategory,
} from "@/lib/email/email-permissions";

// =============================================================================
// GET - Get Permissions
// =============================================================================

/**
 * GET /api/email/permissions?teamMemberId=xxx
 *
 * Get all email permissions for a team member.
 * Requires: Admin/Owner role
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = request.nextUrl;
		const teamMemberId = searchParams.get("teamMemberId");

		if (!teamMemberId) {
			return NextResponse.json(
				{ error: "teamMemberId parameter required" },
				{ status: 400 }
			);
		}

		// Get current user
		const supabase = await createClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		// Check if current user is admin/owner
		const { data: currentMember } = await supabase
			.from("team_members")
			.select("role, company_id")
			.eq("user_id", user.id)
			.single();

		if (!currentMember || !["owner", "admin"].includes(currentMember.role)) {
			return NextResponse.json(
				{ error: "Only owners and admins can view permissions" },
				{ status: 403 }
			);
		}

		// Verify target team member is in same company
		const { data: targetMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("id", teamMemberId)
			.single();

		if (
			!targetMember ||
			targetMember.company_id !== currentMember.company_id
		) {
			return NextResponse.json(
				{ error: "Team member not found" },
				{ status: 404 }
			);
		}

		// Get permissions
		const permissions = await getTeamMemberPermissions(teamMemberId);

		return NextResponse.json({ permissions });
	} catch (error) {
		console.error("[Email Permissions API] GET error:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to get permissions",
			},
			{ status: 500 }
		);
	}
}

// =============================================================================
// POST - Grant/Update Permissions
// =============================================================================

/**
 * POST /api/email/permissions
 *
 * Grant or update email permissions for a team member.
 * Requires: Admin/Owner role
 *
 * Body:
 * {
 *   teamMemberId: string;
 *   category: EmailCategory;
 *   canRead?: boolean;
 *   canSend?: boolean;
 *   canAssign?: boolean;
 * }
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { teamMemberId, category, canRead, canSend, canAssign } = body;

		// Validate inputs
		if (!teamMemberId || !category) {
			return NextResponse.json(
				{ error: "teamMemberId and category required" },
				{ status: 400 }
			);
		}

		const validCategories: EmailCategory[] = [
			"personal",
			"support",
			"sales",
			"billing",
			"marketing",
			"all",
		];

		if (!validCategories.includes(category)) {
			return NextResponse.json(
				{ error: "Invalid category" },
				{ status: 400 }
			);
		}

		// Get current user
		const supabase = await createClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		// Check if current user is admin/owner
		const { data: currentMember } = await supabase
			.from("team_members")
			.select("role, company_id")
			.eq("user_id", user.id)
			.single();

		if (!currentMember || !["owner", "admin"].includes(currentMember.role)) {
			return NextResponse.json(
				{ error: "Only owners and admins can grant permissions" },
				{ status: 403 }
			);
		}

		// Verify target team member is in same company
		const { data: targetMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("id", teamMemberId)
			.single();

		if (
			!targetMember ||
			targetMember.company_id !== currentMember.company_id
		) {
			return NextResponse.json(
				{ error: "Team member not found" },
				{ status: 404 }
			);
		}

		// Prevent non-owners from granting "all" category
		if (category === "all" && currentMember.role !== "owner") {
			return NextResponse.json(
				{ error: "Only owners can grant 'all' category permissions" },
				{ status: 403 }
			);
		}

		// Grant permission
		const result = await grantEmailPermission(
			teamMemberId,
			currentMember.company_id,
			category,
			{
				canRead: canRead ?? true,
				canSend: canSend ?? true,
				canAssign: canAssign ?? false,
			}
		);

		if (!result.success) {
			return NextResponse.json(
				{ error: result.error || "Failed to grant permission" },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Permission granted successfully",
		});
	} catch (error) {
		console.error("[Email Permissions API] POST error:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to grant permission",
			},
			{ status: 500 }
		);
	}
}

// =============================================================================
// DELETE - Revoke Permissions
// =============================================================================

/**
 * DELETE /api/email/permissions
 *
 * Revoke email permissions for a team member.
 * Requires: Admin/Owner role
 *
 * Body:
 * {
 *   teamMemberId: string;
 *   category: EmailCategory;
 * }
 */
export async function DELETE(request: NextRequest) {
	try {
		const body = await request.json();
		const { teamMemberId, category } = body;

		// Validate inputs
		if (!teamMemberId || !category) {
			return NextResponse.json(
				{ error: "teamMemberId and category required" },
				{ status: 400 }
			);
		}

		// Get current user
		const supabase = await createClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		// Check if current user is admin/owner
		const { data: currentMember } = await supabase
			.from("team_members")
			.select("role, company_id")
			.eq("user_id", user.id)
			.single();

		if (!currentMember || !["owner", "admin"].includes(currentMember.role)) {
			return NextResponse.json(
				{ error: "Only owners and admins can revoke permissions" },
				{ status: 403 }
			);
		}

		// Verify target team member is in same company
		const { data: targetMember } = await supabase
			.from("team_members")
			.select("company_id, role")
			.eq("id", teamMemberId)
			.single();

		if (
			!targetMember ||
			targetMember.company_id !== currentMember.company_id
		) {
			return NextResponse.json(
				{ error: "Team member not found" },
				{ status: 404 }
			);
		}

		// Prevent revoking "personal" category (everyone needs access to their own inbox)
		if (category === "personal") {
			return NextResponse.json(
				{ error: "Cannot revoke 'personal' category permissions" },
				{ status: 400 }
			);
		}

		// Prevent revoking owner/admin "all" permissions
		if (
			category === "all" &&
			["owner", "admin"].includes(targetMember.role)
		) {
			return NextResponse.json(
				{ error: "Cannot revoke 'all' permissions from owners or admins" },
				{ status: 400 }
			);
		}

		// Revoke permission
		const result = await revokeEmailPermission(teamMemberId, category);

		if (!result.success) {
			return NextResponse.json(
				{ error: result.error || "Failed to revoke permission" },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Permission revoked successfully",
		});
	} catch (error) {
		console.error("[Email Permissions API] DELETE error:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to revoke permission",
			},
			{ status: 500 }
		);
	}
}
