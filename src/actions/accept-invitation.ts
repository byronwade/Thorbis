/**
 * Accept Team Invitation Action
 *
 * Handles accepting a team invitation with magic link
 */

"use server";

import type { SupabaseClient, User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionError, ERROR_CODES, ERROR_MESSAGES } from "@/lib/errors/action-error";
import { type ActionResult, withErrorHandling } from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

const PASSWORD_MIN_LENGTH = 8;
const HTTP_STATUS = {
	notFound: 404,
	gone: 410,
	badRequest: 400,
	conflict: 409,
	internal: 500,
} as const;

const acceptInvitationSchema = z.object({
	token: z.string().min(1, "Token is required"),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email"),
	phone: z.string().optional(),
	password: z
		.string()
		.min(PASSWORD_MIN_LENGTH, "Password must be at least 8 characters")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[a-z]/, "Password must contain at least one lowercase letter")
		.regex(/[0-9]/, "Password must contain at least one number"),
});

type SupabaseServerClient = SupabaseClient<Database>;

type InvitationRecord = Database["public"]["Tables"]["team_invitations"]["Row"];

/**
 * Accept a team invitation and create user account
 */
export async function acceptTeamInvitation(formData: FormData): Promise<ActionResult<string>> {
	return await withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const token = formData.get("token") as string;
		const firstName = formData.get("firstName") as string;
		const lastName = formData.get("lastName") as string;
		const email = formData.get("email") as string;
		const phone = (formData.get("phone") as string) || "";
		const password = formData.get("password") as string;
		const photo = formData.get("photo") as File | null;

		// Validate input
		const validated = acceptInvitationSchema.parse({
			token,
			firstName,
			lastName,
			email,
			phone,
			password,
		});

		const invitation = await fetchInvitation(supabase, validated.token);
		validateInvitation(invitation, validated.email);

		const user = await ensureAuthUser(supabase, validated);

		// Upload profile photo if provided
		let photoUrl: string | null = null;
		if (photo && photo.size > 0) {
			photoUrl = await uploadProfilePhoto(supabase, user.id, photo);
		}

		await upsertTeamMember({
			supabase,
			invitation,
			userId: user.id,
			phone: validated.phone,
			photoUrl,
		});
		await markInvitationUsed(supabase, invitation.id);

		revalidatePath("/dashboard/settings/team");

		return "Invitation accepted successfully";
	});
}

async function fetchInvitation(supabase: SupabaseServerClient, token: string): Promise<InvitationRecord> {
	const { data, error } = await supabase
		.from("team_invitations")
		.select("*")
		.eq("token", token)
		.is("used_at", null)
		.single();

	if (error || !data) {
		throw new ActionError("Invalid or expired invitation", ERROR_CODES.DB_RECORD_NOT_FOUND, HTTP_STATUS.notFound);
	}

	return data as InvitationRecord;
}

function validateInvitation(invitation: InvitationRecord, email: string) {
	if (new Date(invitation.expires_at) < new Date()) {
		throw new ActionError("Invitation has expired", ERROR_CODES.VALIDATION_ERROR, HTTP_STATUS.gone);
	}

	if (invitation.email !== email) {
		throw new ActionError("Email does not match invitation", ERROR_CODES.VALIDATION_ERROR, HTTP_STATUS.badRequest);
	}
}

async function ensureAuthUser(
	supabase: SupabaseServerClient,
	validated: z.infer<typeof acceptInvitationSchema>
): Promise<User> {
	const { data, error } = await supabase.auth.signUp({
		email: validated.email,
		password: validated.password,
		options: {
			data: {
				first_name: validated.firstName,
				last_name: validated.lastName,
				phone: validated.phone || "",
			},
		},
	});

	if (data.user) {
		return data.user;
	}

	if (error?.message?.includes("already registered")) {
		const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
			email: validated.email,
			password: validated.password,
		});

		if (signInError || !signInData.user) {
			throw new ActionError(
				"An account with this email already exists. Please log in or reset your password.",
				ERROR_CODES.AUTH_FORBIDDEN,
				HTTP_STATUS.conflict
			);
		}

		return signInData.user;
	}

	throw new ActionError(
		error?.message || "Failed to create account",
		ERROR_CODES.AUTH_UNAUTHORIZED,
		HTTP_STATUS.internal
	);
}

async function uploadProfilePhoto(supabase: SupabaseServerClient, userId: string, photo: File): Promise<string | null> {
	const photoPath = `team-member-photos/${userId}/${Date.now()}-${photo.name}`;
	const { error } = await supabase.storage.from("avatars").upload(photoPath, photo);

	if (error) {
		return null;
	}

	const {
		data: { publicUrl },
	} = supabase.storage.from("avatars").getPublicUrl(photoPath);
	return publicUrl;
}

type UpsertTeamMemberParams = {
	supabase: SupabaseServerClient;
	invitation: InvitationRecord;
	userId: string;
	phone?: string;
	photoUrl: string | null;
};

async function upsertTeamMember({ supabase, invitation, userId, phone, photoUrl }: UpsertTeamMemberParams) {
	const { error } = await supabase.from("team_members").upsert(
		{
			user_id: userId,
			company_id: invitation.company_id,
			role: invitation.role,
			status: "active",
			phone: phone || invitation.phone || null,
			avatar_url: photoUrl,
			joined_at: new Date().toISOString(),
		},
		{
			onConflict: "user_id,company_id",
		}
	);

	if (error) {
		throw new ActionError(ERROR_MESSAGES.operationFailed("join team"), ERROR_CODES.DB_QUERY_ERROR);
	}
}

async function markInvitationUsed(supabase: SupabaseServerClient, invitationId: string) {
	const { error } = await supabase
		.from("team_invitations")
		.update({ used_at: new Date().toISOString() })
		.eq("id", invitationId);

	if (error) {
		throw new ActionError(ERROR_MESSAGES.operationFailed("update invitation status"), ERROR_CODES.DB_QUERY_ERROR);
	}
}
