/**
 * Email Permissions Manager Data Component (Server Component)
 *
 * Fetches email permissions for a team member and renders the permissions manager.
 * Only accessible to admins and owners.
 */

import { notFound } from "next/navigation";
import { getTeamMemberPermissions } from "@/lib/email/email-permissions";
import { createClient } from "@/lib/supabase/server";
import { EmailPermissionsManager } from "./email-permissions-manager";

interface EmailPermissionsManagerDataProps {
	teamMemberId: string;
}

export async function EmailPermissionsManagerData({
	teamMemberId,
}: EmailPermissionsManagerDataProps) {
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

	// Check if current user is admin/owner
	const { data: currentMember } = await supabase
		.from("team_members")
		.select("role, company_id")
		.eq("user_id", user.id)
		.single();

	if (!currentMember || !["owner", "admin"].includes(currentMember.role)) {
		return (
			<div className="rounded-lg border border-dashed p-8 text-center">
				<p className="text-muted-foreground text-sm">
					Only owners and admins can manage email permissions
				</p>
			</div>
		);
	}

	// Get target team member info
	const { data: targetMember, error: memberError } = await supabase
		.from("team_members")
		.select("id, first_name, last_name, role, company_id")
		.eq("id", teamMemberId)
		.single();

	if (memberError || !targetMember) {
		return notFound();
	}

	// Verify same company
	if (targetMember.company_id !== currentMember.company_id) {
		return notFound();
	}

	// Get permissions
	const permissions = await getTeamMemberPermissions(teamMemberId);

	// Transform to component format
	const formattedPermissions = permissions.map((p) => ({
		category: p.emailCategory,
		canRead: p.canRead,
		canSend: p.canSend,
		canAssign: p.canAssign,
	}));

	return (
		<EmailPermissionsManager
			permissions={formattedPermissions}
			teamMemberId={targetMember.id}
			teamMemberName={`${targetMember.first_name} ${targetMember.last_name}`}
			teamMemberRole={targetMember.role}
		/>
	);
}
