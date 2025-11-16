/**
 * Company Settings Server Actions
 *
 * Handles company-wide settings with server-side validation
 */

"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  convertHoursToSettings,
  DAYS_OF_WEEK,
  DEFAULT_HOURS,
  type HoursOfOperation,
  normalizeHoursFromSettings,
} from "@/lib/company/hours";
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
import type { Database } from "@/types/supabase";

type TypedSupabaseClient = SupabaseClient<Database>;

// Constants
const ZIP_CODE_MIN_LENGTH = 5;
const STATE_MIN_LENGTH = 2;
const MIN_SERVICE_RADIUS = 1;
const MAX_SERVICE_RADIUS = 500;
const DESCRIPTION_MAX_LENGTH = 1000;
const HTTP_STATUS_FORBIDDEN = 403;
const DEFAULT_SERVICE_RADIUS = 25;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const BYTES_PER_KILOBYTE = 1024;
const MAX_LOGO_FILE_SIZE_MB = 5;
const MAX_LOGO_FILE_SIZE_BYTES =
  MAX_LOGO_FILE_SIZE_MB * BYTES_PER_KILOBYTE * BYTES_PER_KILOBYTE;

// Schema for company information
const hoursEntrySchema = z.object({
  enabled: z.boolean(),
  openTime: z.string(),
  closeTime: z.string(),
});

const hoursOfOperationSchema = z.object(
  (() => {
    const entries: Record<
      (typeof DAYS_OF_WEEK)[number],
      typeof hoursEntrySchema
    > = {} as Record<(typeof DAYS_OF_WEEK)[number], typeof hoursEntrySchema>;
    for (const day of DAYS_OF_WEEK) {
      entries[day] = hoursEntrySchema;
    }
    return entries;
  })()
);

const companyInfoSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  legalName: z.string().optional(),
  industry: z.string().min(1, "Industry is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(STATE_MIN_LENGTH, "State is required"),
  zipCode: z.string().min(ZIP_CODE_MIN_LENGTH, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  taxId: z.string().optional(),
  licenseNumber: z.string().optional(),
  serviceAreaType: z.enum(["radius", "locations"]),
  serviceRadius: z.number().min(MIN_SERVICE_RADIUS).max(MAX_SERVICE_RADIUS),
  serviceAreas: z.array(z.string()),
  hoursOfOperation: hoursOfOperationSchema,
  description: z.string().max(DESCRIPTION_MAX_LENGTH).optional(),
});

const cloneDefaultHours = (): HoursOfOperation => {
  const result: HoursOfOperation = {} as HoursOfOperation;
  for (const day of DAYS_OF_WEEK) {
    result[day] = { ...DEFAULT_HOURS[day] };
  }
  return result;
};

const parseServiceAreas = (value: FormDataEntryValue | null): string[] => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (entry): entry is string =>
        typeof entry === "string" && entry.trim().length > 0
    );
  } catch {
    return [];
  }
};

const parseHoursPayload = (
  value: FormDataEntryValue | null
): HoursOfOperation => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return cloneDefaultHours();
  }

  try {
    const parsed = JSON.parse(value) as Partial<HoursOfOperation>;
    const result: HoursOfOperation = {} as HoursOfOperation;

    for (const day of DAYS_OF_WEEK) {
      const dayConfig = parsed?.[day];
      result[day] = {
        enabled: Boolean(dayConfig?.enabled),
        openTime:
          typeof dayConfig?.openTime === "string"
            ? (dayConfig.openTime ?? DEFAULT_HOURS[day].openTime)
            : DEFAULT_HOURS[day].openTime,
        closeTime:
          typeof dayConfig?.closeTime === "string"
            ? (dayConfig.closeTime ?? DEFAULT_HOURS[day].closeTime)
            : DEFAULT_HOURS[day].closeTime,
      };
    }

    return result;
  } catch {
    return cloneDefaultHours();
  }
};

async function _getActiveTeamMember(
  supabase: TypedSupabaseClient,
  userId: string
): Promise<Database["public"]["Tables"]["team_members"]["Row"]> {
  const { getActiveCompanyId } = await import("@/lib/auth/company-context");
  const preferredCompanyId = await getActiveCompanyId();

  if (preferredCompanyId) {
    const { data: membership } = await supabase
      .from("team_members")
      .select("*")
      .eq("user_id", userId)
      .eq("company_id", preferredCompanyId)
      .maybeSingle();

    if (membership?.company_id) {
      return membership;
    }
  }

  const { data: fallbackMembership } = await supabase
    .from("team_members")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fallbackMembership?.company_id) {
    return fallbackMembership;
  }

  const { data: anyStatusMembership } = await supabase
    .from("team_members")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (anyStatusMembership?.company_id) {
    return anyStatusMembership;
  }

  throw new ActionError(
    "You must be part of a company",
    ERROR_CODES.AUTH_FORBIDDEN,
    HTTP_STATUS_FORBIDDEN
  );
}

// Schema for billing information
const billingInfoSchema = z.object({
  billingEmail: z.string().email("Invalid email address"),
  billingAddress: z.string().min(1, "Billing address is required"),
  billingCity: z.string().min(1, "City is required"),
  billingState: z.string().min(STATE_MIN_LENGTH, "State is required"),
  billingZipCode: z.string().min(ZIP_CODE_MIN_LENGTH, "ZIP code is required"),
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
export async function getCompanyInfo(): Promise<ActionResult<unknown>> {
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

    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const activeCompanyId =
      (await getActiveCompanyId()) ??
      (
        await supabase
          .from("team_members")
          .select("company_id")
          .eq("user_id", user.id)
          .eq("status", "active")
          .order("updated_at", { ascending: false })
          .limit(1)
      ).data?.[0]?.company_id ??
      null;

    if (!activeCompanyId) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        HTTP_STATUS_FORBIDDEN
      );
    }

    const [company, settings, hoursOfOperation, portalSettings] =
      await fetchCompanyAndSettings(supabase, activeCompanyId);

    return buildCompanyInfoResponse(
      company,
      settings,
      hoursOfOperation,
      portalSettings
    );
  });
}

type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];
type CompanySettingsRow =
  Database["public"]["Tables"]["company_settings"]["Row"];
type NormalizedHours = ReturnType<typeof normalizeHoursFromSettings>;

async function fetchCompanyAndSettings(
  supabase: TypedSupabaseClient,
  companyId: string
): Promise<
  [
    CompanyRow,
    CompanySettingsRow | null,
    NormalizedHours,
    Record<string, unknown> | undefined,
  ]
> {
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select(
      "id,name,legal_name,email,phone,website,website_url,tax_id,license_number,industry"
    )
    .eq("id", companyId)
    .single();

  if (companyError || !company) {
    throw new ActionError(
      ERROR_MESSAGES.notFound("Company"),
      ERROR_CODES.DB_RECORD_NOT_FOUND
    );
  }

  const { data: settings } = await supabase
    .from("company_settings")
    .select(
      "address,address2,city,state,zip_code,country,service_area_type,service_radius,service_areas,hours_of_operation,portal_settings"
    )
    .eq("company_id", companyId)
    .single();

  const hoursOfOperation = normalizeHoursFromSettings(
    (settings?.hours_of_operation as Record<
      string,
      { open?: string | null; close?: string | null }
    >) ?? null
  );

  const portalSettings = settings?.portal_settings as
    | Record<string, unknown>
    | undefined;

  return [company, settings, hoursOfOperation, portalSettings];
}

function buildCompanyInfoResponse(
  company: CompanyRow,
  settings: CompanySettingsRow | null,
  hoursOfOperation: NormalizedHours,
  portalSettings: Record<string, unknown> | undefined
) {
  const description = getCompanyDescription(portalSettings);
  const website = company.website ?? company.website_url ?? "";
  const addressInfo = buildAddressInfo(settings);
  const { serviceAreaType, serviceRadius, serviceAreas } =
    buildServiceAreaInfo(settings);

  return {
    id: company.id,
    name: company.name ?? "",
    legalName: company.legal_name ?? "",
    email: company.email ?? "",
    phone: company.phone ?? "",
    website,
    taxId: company.tax_id ?? "",
    licenseNumber: company.license_number ?? "",
    industry: company.industry ?? "",
    description,
    ...addressInfo,
    hoursOfOperation,
    serviceAreaType,
    serviceRadius,
    serviceAreas,
  };
}

function buildAddressInfo(settings: CompanySettingsRow | null) {
  return {
    address: settings?.address ?? "",
    address2: settings?.address2 ?? "",
    city: settings?.city ?? "",
    state: settings?.state ?? "",
    zipCode: settings?.zip_code ?? "",
    country: settings?.country ?? "",
  };
}

function buildServiceAreaInfo(settings: CompanySettingsRow | null) {
  const serviceAreas = getServiceAreasFromSettings(settings);
  const serviceAreaType = settings?.service_area_type ?? "locations";
  const serviceRadius = settings?.service_radius ?? DEFAULT_SERVICE_RADIUS;

  return {
    serviceAreas,
    serviceAreaType,
    serviceRadius,
  };
}

function getServiceAreasFromSettings(
  settings: CompanySettingsRow | null
): string[] {
  if (!(settings?.service_areas && Array.isArray(settings.service_areas))) {
    return [];
  }

  return (settings.service_areas as unknown[]).filter(
    (entry): entry is string => typeof entry === "string"
  );
}

function getCompanyDescription(
  portalSettings: Record<string, unknown> | undefined
): string {
  const raw = portalSettings?.profile_description;
  return typeof raw === "string" ? raw : "";
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
export function updateCompanyInfo(
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

    const companyId = await getUserCompanyIdForSettingsOrThrow(supabase);
    const parsed = parseCompanyInfoFormData(formData);

    await updateCompanyCoreRecord(supabase, companyId, parsed);
    await upsertCompanySettingsRecord(supabase, companyId, parsed);

    revalidatePath("/dashboard/settings/company");
  });
}

async function getUserCompanyIdForSettingsOrThrow(
  supabase: TypedSupabaseClient
): Promise<string> {
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
      HTTP_STATUS_FORBIDDEN
    );
  }

  return teamMember.company_id;
}

type ParsedCompanyInfo = z.infer<typeof companyInfoSchema>;

function parseCompanyInfoFormData(formData: FormData): ParsedCompanyInfo {
  const serviceAreas = parseServiceAreas(formData.get("serviceAreas"));
  const hoursOfOperation = parseHoursPayload(formData.get("hoursOfOperation"));

  return companyInfoSchema.parse({
    name: formData.get("name"),
    legalName: formData.get("legalName") || undefined,
    industry: formData.get("industry"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    website: formData.get("website") || undefined,
    address: formData.get("address"),
    address2: formData.get("address2") || undefined,
    city: formData.get("city"),
    state: formData.get("state"),
    zipCode: formData.get("zipCode"),
    country: formData.get("country"),
    taxId: formData.get("taxId") || undefined,
    licenseNumber: formData.get("licenseNumber") || undefined,
    serviceAreaType: formData.get("serviceAreaType"),
    serviceRadius: Number(formData.get("serviceRadius")),
    serviceAreas,
    hoursOfOperation,
    description: formData.get("description") || "",
  });
}

async function updateCompanyCoreRecord(
  supabase: TypedSupabaseClient,
  companyId: string,
  data: ParsedCompanyInfo
) {
  const { error: companyError } = await supabase
    .from("companies")
    .update({
      name: data.name,
      legal_name: data.legalName ?? null,
      industry: data.industry,
      email: data.email,
      phone: data.phone,
      website: data.website || null,
      website_url: data.website || null,
      tax_id: data.taxId ?? null,
      license_number: data.licenseNumber ?? null,
    })
    .eq("id", companyId);

  if (companyError) {
    throw new ActionError(
      ERROR_MESSAGES.operationFailed("update company"),
      ERROR_CODES.DB_QUERY_ERROR
    );
  }
}

async function upsertCompanySettingsRecord(
  supabase: TypedSupabaseClient,
  companyId: string,
  data: ParsedCompanyInfo
) {
  const { data: existingSettings } = await supabase
    .from("company_settings")
    .select("id, portal_settings")
    .eq("company_id", companyId)
    .single();

  const portalSettingsPayload = {
    ...((existingSettings?.portal_settings as Record<string, unknown>) ?? {}),
    profile_description: data.description ?? "",
  };

  if (existingSettings) {
    const { error: settingsError } = await supabase
      .from("company_settings")
      .update({
        address: data.address,
        address2: data.address2 ?? null,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        country: data.country,
        service_area_type: data.serviceAreaType,
        service_radius: data.serviceRadius,
        service_areas: data.serviceAreas,
        hours_of_operation: convertHoursToSettings(data.hoursOfOperation),
        portal_settings: portalSettingsPayload,
      })
      .eq("company_id", companyId);

    if (settingsError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update company settings"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }
    return;
  }

  const { error: createError } = await supabase
    .from("company_settings")
    .insert({
      company_id: companyId,
      address: data.address,
      address2: data.address2 ?? null,
      city: data.city,
      state: data.state,
      zip_code: data.zipCode,
      country: data.country,
      service_area_type: data.serviceAreaType,
      service_radius: data.serviceRadius,
      service_areas: data.serviceAreas,
      hours_of_operation: convertHoursToSettings(data.hoursOfOperation),
      portal_settings: portalSettingsPayload,
    });

  if (createError) {
    throw new ActionError(
      ERROR_MESSAGES.operationFailed("create company settings"),
      ERROR_CODES.DB_QUERY_ERROR
    );
  }
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
export function updateBillingInfo(
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
        HTTP_STATUS_FORBIDDEN
      );
    }

    const _data = billingInfoSchema.parse({
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

    revalidatePath("/dashboard/settings/billing");
  });
}

/**
 * Update business hours
 */
export function updateBusinessHours(
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
    const companyId = await getUserCompanyIdForSettingsOrThrow(supabase);
    const data = parseBusinessHoursFormData(formData);
    const hoursOfOperation = buildHoursOfOperationPayload(data);

    await upsertBusinessHours(supabase, companyId, hoursOfOperation);

    revalidatePath("/dashboard/settings/company");
  });
}

type ParsedBusinessHours = z.infer<typeof businessHoursSchema>;

function parseBusinessHoursFormData(formData: FormData): ParsedBusinessHours {
  return businessHoursSchema.parse({
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
}

function buildHoursOfOperationPayload(data: ParsedBusinessHours) {
  return {
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
}

async function upsertBusinessHours(
  supabase: TypedSupabaseClient,
  companyId: string,
  hoursOfOperation: Record<string, unknown>
) {
  const { data: existingSettings } = await supabase
    .from("company_settings")
    .select("id")
    .eq("company_id", companyId)
    .single();

  if (existingSettings) {
    const { error: updateError } = await supabase
      .from("company_settings")
      .update({ hours_of_operation: hoursOfOperation })
      .eq("company_id", companyId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update business hours"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }
    return;
  }

  const { error: createError } = await supabase
    .from("company_settings")
    .insert({
      company_id: companyId,
      hours_of_operation: hoursOfOperation,
    });

  if (createError) {
    throw new ActionError(
      ERROR_MESSAGES.operationFailed("create company settings"),
      ERROR_CODES.DB_QUERY_ERROR
    );
  }
}

/**
 * Upload company logo
 */
export function uploadCompanyLogo(
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

    const companyId = await getUserCompanyIdForSettingsOrThrow(supabase);
    const file = validateLogoFile(formData.get("logo"));
    const company = await getCompanyLogoRecord(supabase, companyId);

    const { publicUrl, filePath } = await uploadLogoToStorage(
      supabase,
      companyId,
      file
    );

    await updateCompanyLogoUrl(supabase, companyId, publicUrl, filePath);
    await deleteOldCompanyLogoIfExists(supabase, company);

    revalidatePath("/dashboard/settings/company");
    return publicUrl;
  });
}

function validateLogoFile(fileEntry: FormDataEntryValue | null): File {
  const file = fileEntry as File;

  if (!file || file.size === 0) {
    throw new ActionError("No file provided", ERROR_CODES.VALIDATION_FAILED);
  }

  if (!file.type.startsWith("image/")) {
    throw new ActionError(
      "File must be an image",
      ERROR_CODES.FILE_INVALID_TYPE
    );
  }

  if (file.size > MAX_LOGO_FILE_SIZE_BYTES) {
    throw new ActionError(
      "File size must be less than 5MB",
      ERROR_CODES.FILE_TOO_LARGE
    );
  }

  return file;
}

async function getCompanyLogoRecord(
  supabase: TypedSupabaseClient,
  companyId: string
) {
  const { data: company } = await supabase
    .from("companies")
    .select("logo")
    .eq("id", companyId)
    .single();

  return company;
}

async function uploadLogoToStorage(
  supabase: TypedSupabaseClient,
  companyId: string,
  file: File
): Promise<{ publicUrl: string; filePath: string }> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${companyId}-${Date.now()}.${fileExt}`;
  const filePath = `logos/${fileName}`;

  const { error: uploadError } = await supabase.storage
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

  const {
    data: { publicUrl },
  } = supabase.storage.from("company-assets").getPublicUrl(filePath);

  return { publicUrl, filePath };
}

async function updateCompanyLogoUrl(
  supabase: TypedSupabaseClient,
  companyId: string,
  publicUrl: string,
  filePath: string
) {
  const { error: updateError } = await supabase
    .from("companies")
    .update({ logo: publicUrl })
    .eq("id", companyId);

  if (updateError) {
    await supabase.storage.from("company-assets").remove([filePath]);
    throw new ActionError(
      ERROR_MESSAGES.operationFailed("update company logo"),
      ERROR_CODES.DB_QUERY_ERROR
    );
  }
}

async function deleteOldCompanyLogoIfExists(
  supabase: TypedSupabaseClient,
  company: { logo?: string | null } | null
) {
  if (!company?.logo) {
    return;
  }

  const oldPath = company.logo.split("/").slice(-2).join("/");
  await supabase.storage.from("company-assets").remove([oldPath]);
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
        HTTP_STATUS_FORBIDDEN
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
export function createOrganization(
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

    const { data, logoFile, paymentMethodId } =
      parseCreateOrganizationFormData(formData);
    const serviceSupabase = await createServiceSupabaseClientOrThrow();

    const slug = await generateUniqueCompanySlug(serviceSupabase, data.name);
    const logoUrl = await uploadOrganizationLogoIfProvided(
      serviceSupabase,
      slug,
      logoFile
    );

    const newCompanyId = await insertOrganizationCompanyRecord({
      serviceSupabase,
      data,
      userId: user.id,
      slug,
      logoUrl,
    });

    await addOwnerMembership(serviceSupabase, newCompanyId, user.id);
    await createDefaultCompanySettingsForOrganization(
      serviceSupabase,
      newCompanyId,
      data
    );

    if (paymentMethodId) {
      await attachInitialPaymentMethodIfProvided(
        serviceSupabase,
        user.id,
        paymentMethodId
      );
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return newCompanyId;
  });
}

type ParsedCreateOrganization = z.infer<typeof createOrganizationSchema>;

type ParsedCreateOrganizationForm = {
  data: ParsedCreateOrganization;
  logoFile: File | null;
  paymentMethodId: string | null;
};

function parseCreateOrganizationFormData(
  formData: FormData
): ParsedCreateOrganizationForm {
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

  return { data, logoFile, paymentMethodId };
}

async function createServiceSupabaseClientOrThrow() {
  const { createClient: createServiceClient } = await import(
    "@supabase/supabase-js"
  );
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!(supabaseUrl && serviceRoleKey)) {
    throw new ActionError(
      "Supabase service role configuration is missing",
      ERROR_CODES.DB_CONNECTION_ERROR,
      HTTP_STATUS_INTERNAL_SERVER_ERROR
    );
  }

  return createServiceClient(supabaseUrl, serviceRoleKey);
}

async function generateUniqueCompanySlug(
  serviceSupabase: SupabaseClient,
  name: string
): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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

  return slug;
}

async function uploadOrganizationLogoIfProvided(
  serviceSupabase: SupabaseClient,
  slug: string,
  logoFile: File | null
): Promise<string | null> {
  if (!logoFile || logoFile.size === 0) {
    return null;
  }

  try {
    const fileExt = logoFile.name.split(".").pop();
    const fileName = `${slug}-${Date.now()}.${fileExt}`;
    const filePath = `company-logos/${fileName}`;

    const { error: uploadError } = await serviceSupabase.storage
      .from("company-assets")
      .upload(filePath, logoFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return null;
    }

    const {
      data: { publicUrl },
    } = serviceSupabase.storage.from("company-assets").getPublicUrl(filePath);

    return publicUrl;
  } catch {
    return null;
  }
}

type InsertOrganizationCompanyParams = {
  serviceSupabase: SupabaseClient;
  data: ParsedCreateOrganization;
  userId: string;
  slug: string;
  logoUrl: string | null;
};

async function insertOrganizationCompanyRecord(
  params: InsertOrganizationCompanyParams
): Promise<string> {
  const { serviceSupabase, data, userId, slug, logoUrl } = params;
  const { data: newCompany, error: companyError } = await serviceSupabase
    .from("companies")
    .insert({
      name: data.name,
      slug,
      owner_id: userId,
      logo: logoUrl,
      industry: data.industry,
      phone: data.phone || null,
      email: data.email || null,
      website: data.website || null,
      created_by: userId,
    })
    .select("id")
    .single();

  if (companyError || !newCompany) {
    const errorMessage = companyError
      ? `Failed to create organization: ${companyError.message}`
      : ERROR_MESSAGES.operationFailed("create organization");
    throw new ActionError(
      errorMessage,
      ERROR_CODES.DB_QUERY_ERROR,
      HTTP_STATUS_INTERNAL_SERVER_ERROR,
      {
        organizationName: data.name,
        slug,
        dbError: companyError?.message || "No company returned",
        code: companyError?.code,
      }
    );
  }

  return newCompany.id;
}

async function addOwnerMembership(
  serviceSupabase: SupabaseClient,
  companyId: string,
  userId: string
) {
  const { data: ownerRole } = await serviceSupabase
    .from("custom_roles")
    .select("id")
    .eq("name", "Owner")
    .single();

  const { error: memberError } = await serviceSupabase
    .from("team_members")
    .insert({
      company_id: companyId,
      user_id: userId,
      role_id: ownerRole?.id || null,
      status: "active",
    });

  if (memberError) {
    await serviceSupabase.from("companies").delete().eq("id", companyId);

    throw new ActionError(
      ERROR_MESSAGES.operationFailed("add user to organization"),
      ERROR_CODES.DB_QUERY_ERROR
    );
  }
}

async function createDefaultCompanySettingsForOrganization(
  serviceSupabase: SupabaseClient,
  companyId: string,
  data: ParsedCreateOrganization
) {
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
    company_id: companyId,
    hours_of_operation: defaultHours,
    address: data.address,
    address2: data.address2 || null,
    city: data.city,
    state: data.state,
    zip_code: data.zipCode,
    country: data.country,
  });
}

async function attachInitialPaymentMethodIfProvided(
  serviceSupabase: SupabaseClient,
  userId: string,
  paymentMethodId: string
) {
  try {
    const { data: userData } = await serviceSupabase
      .from("users")
      .select("email, name, stripe_customer_id")
      .eq("id", userId)
      .single();

    if (!userData) {
      return;
    }

    let customerId = userData.stripe_customer_id;
    if (!customerId) {
      customerId = await getOrCreateStripeCustomer(
        userId,
        userData.email,
        userData.name || undefined
      );

      if (customerId) {
        await serviceSupabase
          .from("users")
          .update({ stripe_customer_id: customerId })
          .eq("id", userId);
      }
    }

    if (customerId) {
      await attachPaymentMethodToCustomer(paymentMethodId, customerId);
    }
  } catch {
    // Ignore Stripe failures during initial organization creation
  }
}

/**
 * Update Company Feed Settings
 */
export function updateCompanyFeedSettings(
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
        HTTP_STATUS_FORBIDDEN
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

export async function getCompanyFeedSettings(): Promise<ActionResult<unknown>> {
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
        HTTP_STATUS_FORBIDDEN
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
