/**
 * Company Settings Server Actions
 *
 * Handles company-wide settings with server-side validation
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for company information
const companyInfoSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  legalName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  taxId: z.string().optional(),
  licenseNumber: z.string().optional(),
});

// Schema for billing information
const billingInfoSchema = z.object({
  billingEmail: z.string().email("Invalid email address"),
  billingAddress: z.string().min(1, "Billing address is required"),
  billingCity: z.string().min(1, "City is required"),
  billingState: z.string().min(2, "State is required"),
  billingZipCode: z.string().min(5, "ZIP code is required"),
  paymentMethod: z.enum(["card", "bank", "invoice"]),
});

// Schema for business hours
const businessHoursSchema = z.object({
  mondayOpen: z.string(),
  mondayClose: z.string(),
  tuesdayOpen: z.string(),
  tuesdayClose: z.string(),
  wednesdayOpen: z.string(),
  wednesdayClose: z.string(),
  thursdayOpen: z.string(),
  thursdayClose: z.string(),
  fridayOpen: z.string(),
  fridayClose: z.string(),
  saturdayOpen: z.string().optional(),
  saturdayClose: z.string().optional(),
  sundayOpen: z.string().optional(),
  sundayClose: z.string().optional(),
  timezone: z.string(),
});

/**
 * Update company information
 */
export async function updateCompanyInfo(formData: FormData) {
  try {
    const data = companyInfoSchema.parse({
      name: formData.get("name"),
      legalName: formData.get("legalName") || undefined,
      email: formData.get("email"),
      phone: formData.get("phone"),
      website: formData.get("website") || undefined,
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      zipCode: formData.get("zipCode"),
      taxId: formData.get("taxId") || undefined,
      licenseNumber: formData.get("licenseNumber") || undefined,
    });

    // TODO: Save to database

    revalidatePath("/dashboard/settings/company");
    return { success: true, message: "Company information updated successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return { success: false, error: "Failed to update company information" };
  }
}

/**
 * Update billing information
 */
export async function updateBillingInfo(formData: FormData) {
  try {
    const data = billingInfoSchema.parse({
      billingEmail: formData.get("billingEmail"),
      billingAddress: formData.get("billingAddress"),
      billingCity: formData.get("billingCity"),
      billingState: formData.get("billingState"),
      billingZipCode: formData.get("billingZipCode"),
      paymentMethod: formData.get("paymentMethod"),
    });

    // TODO: Save to database and update payment processor

    revalidatePath("/dashboard/settings/billing");
    return { success: true, message: "Billing information updated successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return { success: false, error: "Failed to update billing information" };
  }
}

/**
 * Update business hours
 */
export async function updateBusinessHours(formData: FormData) {
  try {
    const data = businessHoursSchema.parse({
      mondayOpen: formData.get("mondayOpen") as string,
      mondayClose: formData.get("mondayClose") as string,
      tuesdayOpen: formData.get("tuesdayOpen") as string,
      tuesdayClose: formData.get("tuesdayClose") as string,
      wednesdayOpen: formData.get("wednesdayOpen") as string,
      wednesdayClose: formData.get("wednesdayClose") as string,
      thursdayOpen: formData.get("thursdayOpen") as string,
      thursdayClose: formData.get("thursdayClose") as string,
      fridayOpen: formData.get("fridayOpen") as string,
      fridayClose: formData.get("fridayClose") as string,
      saturdayOpen: (formData.get("saturdayOpen") as string) || undefined,
      saturdayClose: (formData.get("saturdayClose") as string) || undefined,
      sundayOpen: (formData.get("sundayOpen") as string) || undefined,
      sundayClose: (formData.get("sundayClose") as string) || undefined,
      timezone: formData.get("timezone") as string,
    });

    // TODO: Save to database

    revalidatePath("/dashboard/settings/company");
    return { success: true, message: "Business hours updated successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return { success: false, error: "Failed to update business hours" };
  }
}

/**
 * Upload company logo
 */
export async function uploadCompanyLogo(formData: FormData) {
  try {
    const file = formData.get("logo") as File;

    if (!file || file.size === 0) {
      return { success: false, error: "No file provided" };
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File size must be less than 5MB" };
    }

    // TODO: Upload to storage (Supabase Storage)

    revalidatePath("/dashboard/settings/company");
    return {
      success: true,
      message: "Logo uploaded successfully",
      url: "/placeholder-logo.png", // Placeholder
    };
  } catch (error) {
    return { success: false, error: "Failed to upload logo" };
  }
}

/**
 * Delete company logo
 */
export async function deleteCompanyLogo() {
  try {
    // TODO: Delete from storage

    revalidatePath("/dashboard/settings/company");
    return { success: true, message: "Logo deleted successfully" };
  } catch (error) {
    return { success: false, error: "Failed to delete logo" };
  }
}
