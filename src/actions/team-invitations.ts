/**
 * Team Invitations - Magic Link System
 *
 * Handles sending and managing team member invitations with magic links
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sendEmail } from "@/lib/email/email-sender";
import { EmailTemplate } from "@/lib/email/email-types";
import { ActionError, ERROR_CODES, ERROR_MESSAGES } from "@/lib/errors/action-error";
import { type ActionResult, assertAuthenticated, withErrorHandling } from "@/lib/errors/with-error-handling";
import { generateInvitationToken } from "@/lib/invitations/token-utils";
import { createClient } from "@/lib/supabase/server";
import TeamInvitationEmail from "../../emails/templates/team/invitation";

const INVITATION_EXPIRY_DAYS = 7;

/**
 * Send team member invitations after onboarding payment
 */
export async function sendTeamMemberInvitations(
	companyId: string
): Promise<ActionResult<{ sent: number; failed: number }>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		// Get company and onboarding progress
		const { data: company, error: companyError } = await supabase
			.from("companies")
			.select("id, name, onboarding_progress")
			.eq("id", companyId)
			.single();

		if (companyError || !company) {
			throw new ActionError("Company not found", ERROR_CODES.DB_RECORD_NOT_FOUND, 404);
		}

		// Get team members from onboarding progress
		const teamMembers = (company.onboarding_progress as any)?.step2?.teamMembers || [];

		if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
			return { sent: 0, failed: 0 };
		}

		// Get current user (the one who completed onboarding)
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: inviter } = await supabase.from("users").select("name, email").eq("id", user.id).single();

		let sentCount = 0;
		let failedCount = 0;

		const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

		// Process each team member
		for (const member of teamMembers) {
			// Skip current user
			if (member.isCurrentUser) {
				// Create team_members record for current user (owner)
				const { error: ownerError } = await supabase.from("team_members").upsert(
					{
						company_id: companyId,
						user_id: user.id,
						role: member.role,
						status: "active",
						job_title: "Owner",
						phone: member.phone || null,
						joined_at: new Date().toISOString(),
					},
					{
						onConflict: "user_id,company_id",
					}
				);

				if (ownerError) {
					// TODO: Handle error case
				}
				continue;
			}

			try {
				// Generate invitation token
				const token = generateInvitationToken({
					email: member.email,
					companyId: company.id,
					role: member.role,
				});

				const expiresAt = new Date();
				expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

				// Store invitation in database
				const { error: invitationError } = await supabase.from("team_invitations").insert({
					company_id: companyId,
					email: member.email,
					first_name: member.firstName,
					last_name: member.lastName,
					role: member.role,
					phone: member.phone || null,
					token,
					invited_by: user.id,
					expires_at: expiresAt.toISOString(),
				});

				if (invitationError) {
					failedCount++;
					continue;
				}

				// Send invitation email
				const magicLink = `${siteUrl}/accept-invitation?token=${token}`;

				const emailResult = await sendEmail({
					to: member.email,
					subject: `You've been invited to join ${company.name} on Thorbis`,
					template: TeamInvitationEmail({
						inviteeName: `${member.firstName} ${member.lastName}`,
						inviterName: inviter?.name || inviter?.email || "Your colleague",
						companyName: company.name,
						role: member.role,
						magicLink,
						expiresInDays: INVITATION_EXPIRY_DAYS,
					}),
					templateType: EmailTemplate.TEAM_INVITATION,
				});

				if (emailResult.success) {
					sentCount++;
				} else {
					failedCount++;
				}
			} catch (_error) {
				failedCount++;
			}
		}

		return { sent: sentCount, failed: failedCount };
	});
}

/**
 * Send a single team invitation (for adding members after onboarding)
 */
export async function sendSingleTeamInvitation(formData: FormData): Promise<ActionResult<string>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		// Get current user
		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get user's company
		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id, companies!inner(name)")
			.eq("user_id", user.id)
			.eq("status", "active")
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company to invite team members", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		const email = formData.get("email") as string;
		const firstName = formData.get("firstName") as string;
		const lastName = formData.get("lastName") as string;
		const role = formData.get("role") as string;
		const phone = formData.get("phone") as string | null;

		// Validate inputs
		const schema = z.object({
			email: z.string().email(),
			firstName: z.string().min(1),
			lastName: z.string().min(1),
			role: z.enum(["owner", "admin", "manager", "technician", "dispatcher"]),
		});

		const validated = schema.parse({ email, firstName, lastName, role });

		// Generate invitation token
		const token = generateInvitationToken({
			email: validated.email,
			companyId: teamMember.company_id,
			role: validated.role,
		});

		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

		// Store invitation
		const { error: invitationError } = await supabase.from("team_invitations").insert({
			company_id: teamMember.company_id,
			email: validated.email,
			first_name: validated.firstName,
			last_name: validated.lastName,
			role: validated.role,
			phone: phone || null,
			token,
			invited_by: user.id,
			expires_at: expiresAt.toISOString(),
		});

		if (invitationError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("send invitation"), ERROR_CODES.DB_QUERY_ERROR);
		}

		// Send invitation email
		const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
		const magicLink = `${siteUrl}/accept-invitation?token=${token}`;

		const companies = Array.isArray(teamMember.companies) ? teamMember.companies[0] : teamMember.companies;

		const { data: inviter } = await supabase.from("users").select("name, email").eq("id", user.id).single();

		const emailResult = await sendEmail({
			to: validated.email,
			subject: `You've been invited to join ${companies?.name} on Thorbis`,
			template: TeamInvitationEmail({
				inviteeName: `${validated.firstName} ${validated.lastName}`,
				inviterName: inviter?.name || inviter?.email || "Your colleague",
				companyName: companies?.name || "the team",
				role: validated.role,
				magicLink,
				expiresInDays: INVITATION_EXPIRY_DAYS,
			}),
			templateType: EmailTemplate.TEAM_INVITATION,
		});

		if (!emailResult.success) {
			// Don't fail the whole operation if email fails
		}

		revalidatePath("/dashboard/settings/team");
		return "Invitation sent successfully";
	});
}

/**
 * Cancel/revoke an invitation
 */
export async function cancelTeamInvitation(invitationId: string): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Delete invitation (RLS will ensure user has permission)
		const { error } = await supabase.from("team_invitations").delete().eq("id", invitationId);

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("cancel invitation"), ERROR_CODES.DB_QUERY_ERROR);
		}

		revalidatePath("/dashboard/settings/team");
	});
}
