/**
 * Company Settings Server Actions
 *
 * Handles company-wide settings with server-side validation
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  ActionError,
  ERROR_CODES,
  ERROR_MESSAGES,
} from "@/lib/errors/action-error";
import {
  type ActionResult,
  assertAuthenticated,
  assertExists,
  withErrorHandling,
} from "@/lib/errors/with-error-handling";
import {
  attachPaymentMethodToCustomer,
  getOrCreateStripeCustomer,
} from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

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
 * Get company information for current user's company
 *
 * Returns company data from companies + company_settings tables
 */
export async function getCompanyInfo(): Promise<ActionResult<any>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Fetch company data
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("*")
      .eq("id", teamMember.company_id)
      .single();

    if (companyError) {
      throw new ActionError(
        ERROR_MESSAGES.notFound("Company"),
        ERROR_CODES.DB_RECORD_NOT_FOUND
      );
    }

    // Fetch company settings
    const { data: settings } = await supabase
      .from("company_settings")
      .select("*")
      .eq("company_id", teamMember.company_id)
      .single();

    // Return combined data
    return {
      id: company.id,
      name: company.name,
      slug: company.slug,
      logo: company.logo,
      // From company_settings table
      address: settings?.address || "",
      city: settings?.city || "",
      state: settings?.state || "",
      zipCode: settings?.zip_code || "",
      hoursOfOperation: settings?.hours_of_operation || null,
      serviceAreaType: settings?.service_area_type || "locations",
      serviceRadius: settings?.service_radius || 25,
      serviceAreas: settings?.service_areas || [],
      // Note: These fields don't exist in schema yet
      // Will return empty strings until schema is updated
      legalName: "",
      email: "",
      phone: "",
      website: "",
      taxId: "",
      licenseNumber: "",
    };
  });
}

/**
 * Update company information
 *
 * NOTE: Current schema limitations:
 * - companies table only has: name, slug, logo
 * - companySettings table has: address fields, hoursOfOperation
 * - Missing fields in schema: email, phone, website, legalName, taxId, licenseNumber
 * These fields would need to be added to companies or companySettings table
 */
export async function updateCompanyInfo(
  formData: FormData
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

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

    // Update companies table (only name is available in current schema)
    const { error: companyError } = await supabase
      .from("companies")
      .update({
        name: data.name,
        // TODO: Add these fields to companies table schema:
        // legal_name: data.legalName,
        // email: data.email,
        // phone: data.phone,
        // website: data.website,
        // tax_id: data.taxId,
        // license_number: data.licenseNumber,
      })
      .eq("id", teamMember.company_id);

    if (companyError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update company"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Update or create companySettings (address fields are available)
    const { data: existingSettings } = await supabase
      .from("company_settings")
      .select("id")
      .eq("company_id", teamMember.company_id)
      .single();

    if (existingSettings) {
      // Update existing settings
      const { error: settingsError } = await supabase
        .from("company_settings")
        .update({
          address: data.address,
          city: data.city,
          state: data.state,
          zip_code: data.zipCode,
        })
        .eq("company_id", teamMember.company_id);

      if (settingsError) {
        throw new ActionError(
          ERROR_MESSAGES.operationFailed("update company settings"),
          ERROR_CODES.DB_QUERY_ERROR
        );
      }
    } else {
      // Create new settings (need default hoursOfOperation)
      const defaultHours = {
        monday: { open: "09:00", close: "17:00" },
        tuesday: { open: "09:00", close: "17:00" },
        wednesday: { open: "09:00", close: "17:00" },
        thursday: { open: "09:00", close: "17:00" },
        friday: { open: "09:00", close: "17:00" },
        saturday: { open: null, close: null },
        sunday: { open: null, close: null },
      };

      const { error: createError } = await supabase
        .from("company_settings")
        .insert({
          company_id: teamMember.company_id,
          address: data.address,
          city: data.city,
          state: data.state,
          zip_code: data.zipCode,
          hours_of_operation: defaultHours,
        });

      if (createError) {
        throw new ActionError(
          ERROR_MESSAGES.operationFailed("create company settings"),
          ERROR_CODES.DB_QUERY_ERROR
        );
      }
    }

    revalidatePath("/dashboard/settings/company");
  });
}

/**
 * Update billing information
 *
 * NOTE: Current schema limitations:
 * - No dedicated billing table exists
 * - TODO: Create a billing_information table with:
 *   - company_id (FK to companies)
 *   - billing_email, billing_address, billing_city, billing_state, billing_zip_code
 *   - payment_method, stripe_customer_id, etc.
 */
export async function updateBillingInfo(
  formData: FormData
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const data = billingInfoSchema.parse({
      billingEmail: formData.get("billingEmail"),
      billingAddress: formData.get("billingAddress"),
      billingCity: formData.get("billingCity"),
      billingState: formData.get("billingState"),
      billingZipCode: formData.get("billingZipCode"),
      paymentMethod: formData.get("paymentMethod"),
    });

    // TODO: Once billing_information table is created in schema:
    // const { error: billingError } = await supabase
    //   .from("billing_information")
    //   .upsert({
    //     company_id: teamMember.company_id,
    //     billing_email: data.billingEmail,
    //     billing_address: data.billingAddress,
    //     billing_city: data.billingCity,
    //     billing_state: data.billingState,
    //     billing_zip_code: data.billingZipCode,
    //     payment_method: data.paymentMethod,
    //   });

    // TODO: Update payment processor (Stripe, etc.) with new billing info
    // await updateStripeCustomer(...)

    console.warn(
      "Billing table not yet implemented in schema. Data validated but not saved:",
      data
    );

    revalidatePath("/dashboard/settings/billing");
  });
}

/**
 * Update business hours
 */
export async function updateBusinessHours(
  formData: FormData
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

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

    // Build hoursOfOperation JSON object
    const hoursOfOperation = {
      monday: { open: data.mondayOpen, close: data.mondayClose },
      tuesday: { open: data.tuesdayOpen, close: data.tuesdayClose },
      wednesday: { open: data.wednesdayOpen, close: data.wednesdayClose },
      thursday: { open: data.thursdayOpen, close: data.thursdayClose },
      friday: { open: data.fridayOpen, close: data.fridayClose },
      saturday: {
        open: data.saturdayOpen || null,
        close: data.saturdayClose || null,
      },
      sunday: {
        open: data.sundayOpen || null,
        close: data.sundayClose || null,
      },
      timezone: data.timezone,
    };

    // Update or create companySettings
    const { data: existingSettings } = await supabase
      .from("company_settings")
      .select("id")
      .eq("company_id", teamMember.company_id)
      .single();

    if (existingSettings) {
      // Update existing settings
      const { error: updateError } = await supabase
        .from("company_settings")
        .update({ hours_of_operation: hoursOfOperation })
        .eq("company_id", teamMember.company_id);

      if (updateError) {
        throw new ActionError(
          ERROR_MESSAGES.operationFailed("update business hours"),
          ERROR_CODES.DB_QUERY_ERROR
        );
      }
    } else {
      // Create new settings
      const { error: createError } = await supabase
        .from("company_settings")
        .insert({
          company_id: teamMember.company_id,
          hours_of_operation: hoursOfOperation,
        });

      if (createError) {
        throw new ActionError(
          ERROR_MESSAGES.operationFailed("create company settings"),
          ERROR_CODES.DB_QUERY_ERROR
        );
      }
    }

    revalidatePath("/dashboard/settings/company");
  });
}

/**
 * Upload company logo
 */
export async function uploadCompanyLogo(
  formData: FormData
): Promise<ActionResult<string>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const file = formData.get("logo") as File;

    if (!file || file.size === 0) {
      throw new ActionError("No file provided", ERROR_CODES.VALIDATION_FAILED);
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new ActionError(
        "File must be an image",
        ERROR_CODES.FILE_INVALID_TYPE
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new ActionError(
        "File size must be less than 5MB",
        ERROR_CODES.FILE_TOO_LARGE
      );
    }

    // Get existing logo to delete later
    const { data: company } = await supabase
      .from("companies")
      .select("logo")
      .eq("id", teamMember.company_id)
      .single();

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${teamMember.company_id}-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("company-assets")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("upload logo"),
        ERROR_CODES.FILE_UPLOAD_FAILED
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("company-assets").getPublicUrl(filePath);

    // Update company record with new logo URL
    const { error: updateError } = await supabase
      .from("companies")
      .update({ logo: publicUrl })
      .eq("id", teamMember.company_id);

    if (updateError) {
      // Clean up uploaded file if database update fails
      await supabase.storage.from("company-assets").remove([filePath]);
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update company logo"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Delete old logo if it exists
    if (company?.logo) {
      const oldPath = company.logo.split("/").slice(-2).join("/");
      await supabase.storage.from("company-assets").remove([oldPath]);
    }

    revalidatePath("/dashboard/settings/company");
    return publicUrl;
  });
}

/**
 * Delete company logo
 */
export async function deleteCompanyLogo(): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Get user's company
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Get existing logo
    const { data: company } = await supabase
      .from("companies")
      .select("logo")
      .eq("id", teamMember.company_id)
      .single();

    assertExists(company, "Company");

    if (!company.logo) {
      throw new ActionError(
        "No logo to delete",
        ERROR_CODES.DB_RECORD_NOT_FOUND
      );
    }

    // Extract file path from URL
    const filePath = company.logo.split("/").slice(-2).join("/");

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from("company-assets")
      .remove([filePath]);

    if (deleteError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("delete logo"),
        ERROR_CODES.FILE_UPLOAD_FAILED
      );
    }

    // Update company record to remove logo URL
    const { error: updateError } = await supabase
      .from("companies")
      .update({ logo: null })
      .eq("id", teamMember.company_id);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update company"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/company");
  });
}

// Schema for creating a new organization
const createOrganizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  industry: z.enum([
    "hvac",
    "plumbing",
    "electrical",
    "landscaping",
    "cleaning",
    "other",
  ]),
  phone: z.string().min(10, "Phone number is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  confirmPricing: z.literal(true).refine((val) => val === true, {
    message:
      "You must acknowledge the $100/month charge for additional organizations",
  }),
});

/**
 * Create New Organization
 *
 * Creates a new company/organization and adds the current user as owner.
 * Additional organizations beyond the first one incur a $100/month charge.
 *
 * @returns The new company ID
 */
export async function createOrganization(
  formData: FormData
): Promise<ActionResult<string>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    // Validate input - include better error details
    const nameValue = formData.get("name");
    const industryValue = formData.get("industry");
    const phoneValue = formData.get("phone");
    const emailValue = formData.get("email");
    const websiteValue = formData.get("website");
    const addressValue = formData.get("address");
    const address2Value = formData.get("address2");
    const cityValue = formData.get("city");
    const stateValue = formData.get("state");
    const zipCodeValue = formData.get("zipCode");
    const countryValue = formData.get("country");
    const confirmPricingValue = formData.get("confirmPricing");
    const logoFile = formData.get("logo") as File | null;
    const paymentMethodId = formData.get("paymentMethodId") as string | null;

    // Debug logging in development
    if (process.env.NODE_ENV === "development") {
      console.log("[createOrganization] FormData:", {
        name: nameValue,
        industry: industryValue,
        phone: phoneValue,
        email: emailValue,
        website: websiteValue,
        address: addressValue,
        city: cityValue,
        state: stateValue,
        zipCode: zipCodeValue,
        country: countryValue,
        confirmPricing: confirmPricingValue,
        hasLogo: !!logoFile,
      });
    }

    const data = createOrganizationSchema.parse({
      name: nameValue,
      industry: industryValue,
      phone: phoneValue || undefined,
      email: emailValue || undefined,
      website: websiteValue || "",
      address: addressValue,
      address2: address2Value || "",
      city: cityValue,
      state: stateValue,
      zipCode: zipCodeValue,
      country: countryValue,
      confirmPricing: confirmPricingValue === "true",
    });

    // Check how many companies the user already belongs to
    const { data: existingMemberships, error: membershipError } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .eq("status", "active");

    if (membershipError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("check existing memberships"),
        ERROR_CODES.DB_QUERY_ERROR,
        500,
        { membershipError: membershipError.message }
      );
    }

    // If user already has 1+ companies, they've acknowledged the additional charge
    const hasExistingCompanies = (existingMemberships?.length || 0) > 0;

    // Generate slug from company name
    const baseSlug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Create the company using service role to bypass RLS
    // We need service role because regular users don't have INSERT permission on companies table
    const { createClient: createServiceClient } = await import(
      "@supabase/supabase-js"
    );
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if slug already exists and make it unique if needed
    let slug = baseSlug;
    let slugExists = true;
    let counter = 1;

    while (slugExists) {
      const { data: existingCompany } = await serviceSupabase
        .from("companies")
        .select("id")
        .eq("slug", slug)
        .single();

      if (existingCompany) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      } else {
        slugExists = false;
      }
    }

    // Handle logo upload if provided
    let logoUrl: string | null = null;
    if (logoFile && logoFile.size > 0) {
      try {
        // Create unique filename
        const fileExt = logoFile.name.split(".").pop();
        const fileName = `${slug}-${Date.now()}.${fileExt}`;
        const filePath = `company-logos/${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } =
          await serviceSupabase.storage
            .from("company-assets")
            .upload(filePath, logoFile, {
              cacheControl: "3600",
              upsert: false,
            });

        if (uploadError) {
          console.warn("Failed to upload logo:", uploadError.message);
        } else {
          // Get public URL
          const {
            data: { publicUrl },
          } = serviceSupabase.storage
            .from("company-assets")
            .getPublicUrl(filePath);
          logoUrl = publicUrl;
        }
      } catch (uploadErr) {
        console.warn("Error uploading logo:", uploadErr);
        // Continue with organization creation even if logo upload fails
      }
    }

    const { data: newCompany, error: companyError } = await serviceSupabase
      .from("companies")
      .insert({
        name: data.name,
        slug,
        owner_id: user.id,
        logo: logoUrl,
        industry: data.industry,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (companyError || !newCompany) {
      const errorMessage = companyError
        ? `Failed to create organization: ${companyError.message}`
        : ERROR_MESSAGES.operationFailed("create organization");
      throw new ActionError(errorMessage, ERROR_CODES.DB_QUERY_ERROR, 500, {
        organizationName: data.name,
        slug,
        dbError: companyError?.message || "No company returned",
        code: companyError?.code,
      });
    }

    // Get the owner role ID
    const { data: ownerRole, error: roleError } = await serviceSupabase
      .from("custom_roles")
      .select("id")
      .eq("name", "Owner")
      .single();

    if (roleError || !ownerRole) {
      // If Owner role doesn't exist, we still proceed but log warning
      console.warn("Owner role not found, creating team member without role");
    }

    // Add current user as owner of the new company using service role to bypass RLS
    const { error: memberError } = await serviceSupabase
      .from("team_members")
      .insert({
        company_id: newCompany.id,
        user_id: user.id,
        role_id: ownerRole?.id || null,
        status: "active",
      });

    if (memberError) {
      // Clean up: delete the company we just created since we couldn't add the owner
      await serviceSupabase.from("companies").delete().eq("id", newCompany.id);

      throw new ActionError(
        ERROR_MESSAGES.operationFailed("add user to organization"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Create default company settings using service role to bypass RLS
    const defaultHours = {
      monday: { open: "09:00", close: "17:00" },
      tuesday: { open: "09:00", close: "17:00" },
      wednesday: { open: "09:00", close: "17:00" },
      thursday: { open: "09:00", close: "17:00" },
      friday: { open: "09:00", close: "17:00" },
      saturday: { open: null, close: null },
      sunday: { open: null, close: null },
    };

    await serviceSupabase.from("company_settings").insert({
      company_id: newCompany.id,
      hours_of_operation: defaultHours,
      address: data.address,
      address2: data.address2 || null,
      city: data.city,
      state: data.state,
      zip_code: data.zipCode,
      country: data.country,
    });

    // Handle payment method if provided
    if (paymentMethodId) {
      try {
        // Get user data for Stripe customer creation
        const { data: userData } = await serviceSupabase
          .from("users")
          .select("email, name, stripe_customer_id")
          .eq("id", user.id)
          .single();

        if (userData) {
          // Get or create Stripe customer
          let customerId = userData.stripe_customer_id;
          if (!customerId) {
            customerId = await getOrCreateStripeCustomer(
              user.id,
              userData.email,
              userData.name || undefined
            );

            if (customerId) {
              // Save customer ID to database
              await serviceSupabase
                .from("users")
                .update({ stripe_customer_id: customerId })
                .eq("id", user.id);
            }
          }

          // Attach payment method to customer
          if (customerId) {
            const attached = await attachPaymentMethodToCustomer(
              paymentMethodId,
              customerId
            );

            if (!attached) {
              console.warn("Failed to attach payment method to customer");
              // Don't fail the organization creation if payment method attachment fails
              // The user can add payment method later via billing portal
            }
          }
        }
      } catch (stripeError) {
        console.error("Error handling payment method:", stripeError);
        // Don't fail organization creation if Stripe operations fail
        // The user can add payment method later via billing portal
      }
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return newCompany.id;
  });
}

/**
 * Update Company Feed Settings
 */
export async function updateCompanyFeedSettings(
  formData: FormData
): Promise<ActionResult<void>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const feedEnabled = formData.get("feedEnabled") === "true";
    const feedVisibility = formData.get("feedVisibility") || "all_team";

    const { error } = await supabase
      .from("company_settings")
      .update({
        company_feed_enabled: feedEnabled,
        feed_visibility: feedVisibility,
      })
      .eq("company_id", teamMember.company_id);

    if (error) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update company feed settings"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/settings/company-feed");
  });
}

export async function getCompanyFeedSettings(): Promise<ActionResult<any>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();
    if (!supabase) {
      throw new ActionError(
        "Database connection failed",
        ERROR_CODES.DB_CONNECTION_ERROR
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

    const { data: teamMember } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const { data, error } = await supabase
      .from("company_settings")
      .select("company_feed_enabled, feed_visibility")
      .eq("company_id", teamMember.company_id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("fetch company feed settings"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return data || null;
  });
}
