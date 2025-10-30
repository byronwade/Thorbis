"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Server Actions for Settings Forms
 *
 * These replace client-side state management with server-side form handling
 * for better performance and SEO
 */

// Validation schemas
const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.coerce.number().int().positive(),
  smtpUser: z.string().email("Valid email required"),
  smtpPassword: z.string().min(1, "Password is required"),
  fromEmail: z.string().email("Valid email required"),
  fromName: z.string().min(1, "From name is required"),
});

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  jobUpdates: z.boolean(),
  teamMessages: z.boolean(),
  systemAlerts: z.boolean(),
});

const companySettingsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z.string().email("Valid email required"),
  companyPhone: z.string().min(1, "Phone number is required"),
  companyAddress: z.string().min(1, "Address is required"),
  businessHours: z.string().optional(),
  timezone: z.string().min(1, "Timezone is required"),
});

// Type exports
export type EmailSettings = z.infer<typeof emailSettingsSchema>;
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type CompanySettings = z.infer<typeof companySettingsSchema>;

// Server Actions
export async function updateEmailSettings(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const rawData = {
      smtpHost: formData.get("smtpHost"),
      smtpPort: formData.get("smtpPort"),
      smtpUser: formData.get("smtpUser"),
      smtpPassword: formData.get("smtpPassword"),
      fromEmail: formData.get("fromEmail"),
      fromName: formData.get("fromName"),
    };

    const validated = emailSettingsSchema.parse(rawData);

    // TODO: Save to database

    // Revalidate the settings page
    revalidatePath("/dashboard/settings/communications/email");

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return { success: false, error: "Failed to update settings" };
  }
}

export async function updateNotificationSettings(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const rawData = {
      emailNotifications: formData.get("emailNotifications") === "on",
      pushNotifications: formData.get("pushNotifications") === "on",
      smsNotifications: formData.get("smsNotifications") === "on",
      jobUpdates: formData.get("jobUpdates") === "on",
      teamMessages: formData.get("teamMessages") === "on",
      systemAlerts: formData.get("systemAlerts") === "on",
    };

    const validated = notificationSettingsSchema.parse(rawData);

    // TODO: Save to database

    // Revalidate the settings page
    revalidatePath("/dashboard/settings/communications/notifications");

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return { success: false, error: "Failed to update settings" };
  }
}

export async function updateCompanySettings(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const rawData = {
      companyName: formData.get("companyName"),
      companyEmail: formData.get("companyEmail"),
      companyPhone: formData.get("companyPhone"),
      companyAddress: formData.get("companyAddress"),
      businessHours: formData.get("businessHours"),
      timezone: formData.get("timezone"),
    };

    const validated = companySettingsSchema.parse(rawData);

    // TODO: Save to database

    // Revalidate the settings page
    revalidatePath("/dashboard/settings/company");

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return { success: false, error: "Failed to update settings" };
  }
}
