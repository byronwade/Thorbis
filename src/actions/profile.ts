/**
 * Profile Server Actions
 *
 * Handles profile-related form submissions with server-side validation
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for personal information
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  title: z.string().optional(),
});

// Schema for password change
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(8, "Password must be at least 8 characters"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
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

    // TODO: Save to database using Supabase
    // const { error } = await supabase
    //   .from("profiles")
    //   .update(data)
    //   .eq("id", userId);

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

    // TODO: Verify current password and update
    // const { error } = await supabase.auth.updateUser({
    //   password: data.newPassword
    // });

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

    // TODO: Save to database
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
    // TODO: Generate 2FA secret and QR code
    revalidatePath("/dashboard/settings/profile/security/2fa");
    return {
      success: true,
      message: "Two-factor authentication enabled",
      qrCode: "data:image/png;base64,..." // Placeholder
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

    // TODO: Verify code and disable 2FA
    revalidatePath("/dashboard/settings/profile/security/2fa");
    return { success: true, message: "Two-factor authentication disabled" };
  } catch (error) {
    return { success: false, error: "Failed to disable 2FA" };
  }
}
