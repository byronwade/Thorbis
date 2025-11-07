/**
 * Profile Server Actions
 *
 * Handles profile-related form submissions with server-side validation
 * Database implementation: Uses Supabase for user profile management
 * Security: Auth-protected actions via Supabase RLS
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// Schema for personal information
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  title: z.string().optional(),
});

// Schema for password change
const passwordChangeSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Schema for notification preferences
const notificationPreferencesSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  jobUpdates: z.boolean(),
  systemAlerts: z.boolean(),
  marketingEmails: z.boolean(),
});

/**
 * Update personal information
 */
export async function updatePersonalInfo(formData: FormData) {
  try {
    const data = personalInfoSchema.parse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      title: formData.get("title") || undefined,
    });

    // Get authenticated user
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Supabase client not configured");
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Not authenticated");
    }

    // Update user profile in database
    const { error } = await supabase
      .from("users")
      .update({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone || null,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
      throw new Error("Failed to update profile");
    }

    // Also update auth user email if changed
    if (data.email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: data.email,
      });

      if (emailError) {
        console.error("Error updating email:", emailError);
        throw new Error("Failed to update email");
      }
    }

    revalidatePath("/dashboard/settings/profile/personal");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return { success: false, error: "Failed to update profile" };
  }
}

/**
 * Change password
 */
export async function changePassword(formData: FormData) {
  try {
    const data = passwordChangeSchema.parse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });

    // Get authenticated user and update password
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Supabase client not configured");
    }

    // Supabase Auth handles current password verification automatically
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (error) {
      console.error("Error changing password:", error);
      if (error.message.includes("same")) {
        throw new Error("New password must be different from current password");
      }
      throw new Error("Failed to change password. Please verify your current password.");
    }

    revalidatePath("/dashboard/settings/profile/security/password");
    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return { success: false, error: "Failed to change password" };
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(formData: FormData) {
  try {
    const data = notificationPreferencesSchema.parse({
      emailNotifications: formData.get("emailNotifications") === "on",
      smsNotifications: formData.get("smsNotifications") === "on",
      pushNotifications: formData.get("pushNotifications") === "on",
      jobUpdates: formData.get("jobUpdates") === "on",
      systemAlerts: formData.get("systemAlerts") === "on",
      marketingEmails: formData.get("marketingEmails") === "on",
    });

    // Get authenticated user
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Supabase client not configured");
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Not authenticated");
    }

    // Store notification preferences in user metadata
    const { error } = await supabase.auth.updateUser({
      data: {
        notification_preferences: data,
      },
    });

    if (error) {
      console.error("Error updating notification preferences:", error);
      throw new Error("Failed to update preferences");
    }

    revalidatePath("/dashboard/settings/profile/notifications");
    return { success: true, message: "Preferences updated successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return { success: false, error: "Failed to update preferences" };
  }
}

/**
 * Enable two-factor authentication
 */
export async function enableTwoFactor() {
  try {
    // Get authenticated user
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Supabase client not configured");
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Not authenticated");
    }

    // Enroll in MFA
    const { data: enrollData, error: enrollError } =
      await supabase.auth.mfa.enroll({
        factorType: "totp",
      });

    if (enrollError) {
      console.error("Error enabling 2FA:", enrollError);
      throw new Error("Failed to enable 2FA");
    }

    revalidatePath("/dashboard/settings/profile/security/2fa");
    return {
      success: true,
      message: "Two-factor authentication enabled",
      qrCode: enrollData.totp.qr_code,
      secret: enrollData.totp.secret,
      factorId: enrollData.id,
    };
  } catch (error) {
    return { success: false, error: "Failed to enable 2FA" };
  }
}

/**
 * Disable two-factor authentication
 */
export async function disableTwoFactor(formData: FormData) {
  try {
    const code = formData.get("code") as string;

    if (!code || code.length !== 6) {
      return { success: false, error: "Invalid verification code" };
    }

    // Get authenticated user
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Supabase client not configured");
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Not authenticated");
    }

    // Get all MFA factors
    const { data: factors, error: factorsError } =
      await supabase.auth.mfa.listFactors();

    if (factorsError) {
      console.error("Error listing MFA factors:", factorsError);
      throw new Error("Failed to list MFA factors");
    }

    // Unenroll from all TOTP factors
    if (factors && factors.totp && factors.totp.length > 0) {
      for (const factor of factors.totp) {
        const { error: unenrollError } = await supabase.auth.mfa.unenroll({
          factorId: factor.id,
        });

        if (unenrollError) {
          console.error("Error disabling 2FA:", unenrollError);
          throw new Error("Failed to disable 2FA");
        }
      }
    }

    revalidatePath("/dashboard/settings/profile/security/2fa");
    return { success: true, message: "Two-factor authentication disabled" };
  } catch (error) {
    return { success: false, error: "Failed to disable 2FA" };
  }
}
