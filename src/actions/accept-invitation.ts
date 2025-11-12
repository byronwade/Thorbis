/**
 * Accept Team Invitation Action
 *
 * Handles accepting a team invitation with magic link
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  ActionError,
  ERROR_CODES,
  ERROR_MESSAGES,
} from "@/lib/errors/action-error";
import {
  type ActionResult,
  withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

const acceptInvitationSchema = z.object({
  token: z.string().min(1, "Token is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

/**
 * Accept a team invitation and create user account
 */
export async function acceptTeamInvitation(formData: FormData): Promise<
  ActionResult<string>
> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
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

    // Look up invitation
    const { data: invitation, error: invitationError } = await supabase
      .from("team_invitations")
      .select("*")
      .eq("token", validated.token)
      .is("used_at", null)
      .single();

    if (invitationError || !invitation) {
      throw new ActionError(
        "Invalid or expired invitation",
        ERROR_CODES.DB_RECORD_NOT_FOUND,
        404
      );
    }

    // Check if expired
    if (new Date(invitation.expires_at) < new Date()) {
      throw new ActionError(
        "Invitation has expired",
        ERROR_CODES.VALIDATION_ERROR,
        410
      );
    }

    // Check if email matches
    if (invitation.email !== validated.email) {
      throw new ActionError(
        "Email does not match invitation",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    // Create auth user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
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

    if (authError || !authData.user) {
      // Check if user already exists
      if (authError?.message?.includes("already registered")) {
        // Try to sign in instead
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: validated.email,
            password: validated.password,
          });

        if (signInError || !signInData.user) {
          throw new ActionError(
            "An account with this email already exists. Please log in or reset your password.",
            ERROR_CODES.AUTH_FORBIDDEN,
            409
          );
        }

        // Use existing user
        (authData as any).user = signInData.user;
      } else {
        throw new ActionError(
          authError?.message || "Failed to create account",
          ERROR_CODES.AUTH_UNAUTHORIZED,
          500
        );
      }
    }

    // Ensure user exists at this point (either from signUp or signIn)
    if (!authData.user) {
      throw new ActionError(
        "Failed to authenticate user",
        ERROR_CODES.AUTH_UNAUTHORIZED,
        500
      );
    }

    // Upload profile photo if provided
    let photoUrl: string | null = null;
    if (photo && photo.size > 0) {
      const photoPath = `team-member-photos/${authData.user.id}/${Date.now()}-${photo.name}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(photoPath, photo);

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(photoPath);
        photoUrl = publicUrl;
      }
    }

    // Create team_members record
    const { error: teamMemberError } = await supabase
      .from("team_members")
      .upsert(
        {
          user_id: authData.user.id,
          company_id: invitation.company_id,
          role: invitation.role,
          status: "active",
          phone: validated.phone || invitation.phone || null,
          avatar_url: photoUrl,
          joined_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,company_id",
        }
      );

    if (teamMemberError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("join team"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Mark invitation as used
    const { error: updateError } = await supabase
      .from("team_invitations")
      .update({ used_at: new Date().toISOString() })
      .eq("id", invitation.id);

    if (updateError) {
      console.error("Error marking invitation as used:", updateError);
    }

    revalidatePath("/dashboard/settings/team");
    
    return "Invitation accepted successfully";
  });
}

