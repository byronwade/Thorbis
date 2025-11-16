/**
 * Vendors Server Actions
 *
 * Handles vendor management with CRUD operations, search, and vendor selection.
 */

"use server";

import { revalidatePath } from "next/cache";
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
import { createClient } from "@/lib/supabase/server";
import {
  type VendorUpdate,
  vendorInsertSchema,
  vendorUpdateSchema,
} from "@/lib/validations/database-schemas";

/**
 * Generate unique vendor number
 */
async function generateVendorNumber(
  supabase: any,
  companyId: string
): Promise<string> {
  const { data: latestVendor } = await supabase
    .from("vendors")
    .select("vendor_number")
    .eq("company_id", companyId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!latestVendor) {
    return `VND-${new Date().getFullYear()}-001`;
  }

  const match = latestVendor.vendor_number.match(/VND-\d{4}-(\d+)/);
  if (match) {
    const nextNumber = Number.parseInt(match[1], 10) + 1;
    return `VND-${new Date().getFullYear()}-${nextNumber.toString().padStart(3, "0")}`;
  }

  return `VND-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;
}

/**
 * Create a new vendor
 */
export function createVendor(
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

    const {
      data: { user },
    } = await supabase.auth.getUser();
    assertAuthenticated(user?.id);

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

    // Generate vendor number if not provided
    const vendorNumber =
      formData.get("vendor_number")?.toString() ||
      (await generateVendorNumber(supabase, teamMember.company_id));

    // Validate input
    const data = vendorInsertSchema.parse({
      company_id: teamMember.company_id,
      name: formData.get("name"),
      display_name: formData.get("display_name") || formData.get("name"),
      vendor_number: vendorNumber,
      email: formData.get("email") || undefined,
      phone: formData.get("phone") || undefined,
      secondary_phone: formData.get("secondary_phone") || undefined,
      website: formData.get("website") || undefined,
      address: formData.get("address") || undefined,
      address2: formData.get("address2") || undefined,
      city: formData.get("city") || undefined,
      state: formData.get("state") || undefined,
      zip_code: formData.get("zip_code") || undefined,
      country: formData.get("country") || "USA",
      tax_id: formData.get("tax_id") || undefined,
      payment_terms: formData.get("payment_terms") || "net_30",
      credit_limit: formData.get("credit_limit")
        ? Number.parseInt(formData.get("credit_limit") as string, 10) * 100
        : 0,
      preferred_payment_method:
        formData.get("preferred_payment_method") || undefined,
      category: formData.get("category") || undefined,
      tags: formData.get("tags")
        ? JSON.parse(formData.get("tags") as string)
        : undefined,
      status: formData.get("status") || "active",
      notes: formData.get("notes") || undefined,
      internal_notes: formData.get("internal_notes") || undefined,
      custom_fields: formData.get("custom_fields")
        ? JSON.parse(formData.get("custom_fields") as string)
        : undefined,
    });

    // Check if vendor number already exists
    const { data: existingVendor } = await supabase
      .from("vendors")
      .select("id")
      .eq("company_id", teamMember.company_id)
      .eq("vendor_number", data.vendor_number)
      .is("deleted_at", null)
      .single();

    if (existingVendor) {
      throw new ActionError(
        "Vendor number already exists",
        ERROR_CODES.VALIDATION_FAILED
      );
    }

    // Insert vendor
    const { data: vendor, error } = await supabase
      .from("vendors")
      .insert({
        company_id: data.company_id,
        name: data.name,
        display_name: data.display_name,
        vendor_number: data.vendor_number,
        email: data.email,
        phone: data.phone,
        secondary_phone: data.secondary_phone,
        website: data.website,
        address: data.address,
        address2: data.address2,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        country: data.country,
        tax_id: data.tax_id,
        payment_terms: data.payment_terms,
        credit_limit: data.credit_limit,
        preferred_payment_method: data.preferred_payment_method,
        category: data.category,
        tags: data.tags || [],
        status: data.status,
        notes: data.notes,
        internal_notes: data.internal_notes,
        custom_fields: data.custom_fields || {},
      })
      .select("id")
      .single();

    if (error) {
      throw new ActionError(
        "Failed to create vendor",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    assertExists(vendor, "Vendor");

    revalidatePath("/dashboard/inventory/vendors");
    revalidatePath(`/dashboard/inventory/vendors/${vendor.id}`);

    return vendor.id;
  });
}

/**
 * Update an existing vendor
 */
export function updateVendor(
  vendorId: string,
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
      .eq("status", "active")
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify vendor exists and belongs to company
    const { data: existingVendor } = await supabase
      .from("vendors")
      .select("id, company_id, vendor_number")
      .eq("id", vendorId)
      .is("deleted_at", null)
      .single();

    assertExists(existingVendor, "Vendor");

    if (existingVendor.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("vendor"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Build update object from form data
    const updateData: Partial<VendorUpdate> = {};

    if (formData.has("name")) {
      updateData.name = formData.get("name") as string;
    }
    if (formData.has("display_name")) {
      updateData.display_name = formData.get("display_name") as string;
    }
    if (formData.has("vendor_number")) {
      updateData.vendor_number = formData.get("vendor_number") as string;
    }
    if (formData.has("email")) {
      updateData.email = (formData.get("email") as string) || undefined;
    }
    if (formData.has("phone")) {
      updateData.phone = (formData.get("phone") as string) || undefined;
    }
    if (formData.has("secondary_phone")) {
      updateData.secondary_phone =
        (formData.get("secondary_phone") as string) || undefined;
    }
    if (formData.has("website")) {
      updateData.website = (formData.get("website") as string) || undefined;
    }
    if (formData.has("address")) {
      updateData.address = (formData.get("address") as string) || undefined;
    }
    if (formData.has("address2")) {
      updateData.address2 = (formData.get("address2") as string) || undefined;
    }
    if (formData.has("city")) {
      updateData.city = (formData.get("city") as string) || undefined;
    }
    if (formData.has("state")) {
      updateData.state = (formData.get("state") as string) || undefined;
    }
    if (formData.has("zip_code")) {
      updateData.zip_code = (formData.get("zip_code") as string) || undefined;
    }
    if (formData.has("country")) {
      updateData.country = formData.get("country") as string;
    }
    if (formData.has("tax_id")) {
      updateData.tax_id = (formData.get("tax_id") as string) || undefined;
    }
    if (formData.has("payment_terms")) {
      updateData.payment_terms = formData.get("payment_terms") as any;
    }
    if (formData.has("credit_limit")) {
      updateData.credit_limit =
        Number.parseInt(formData.get("credit_limit") as string, 10) * 100;
    }
    if (formData.has("preferred_payment_method")) {
      updateData.preferred_payment_method = formData.get(
        "preferred_payment_method"
      ) as any;
    }
    if (formData.has("category")) {
      updateData.category = formData.get("category") as any;
    }
    if (formData.has("tags")) {
      updateData.tags = JSON.parse(formData.get("tags") as string);
    }
    if (formData.has("status")) {
      updateData.status = formData.get("status") as "active" | "inactive";
    }
    if (formData.has("notes")) {
      updateData.notes = (formData.get("notes") as string) || undefined;
    }
    if (formData.has("internal_notes")) {
      updateData.internal_notes =
        (formData.get("internal_notes") as string) || undefined;
    }
    if (formData.has("custom_fields")) {
      updateData.custom_fields = JSON.parse(
        formData.get("custom_fields") as string
      );
    }

    // Validate update data
    const validated = vendorUpdateSchema.parse(updateData);

    // Check vendor number uniqueness if changed
    if (
      validated.vendor_number &&
      validated.vendor_number !== existingVendor.vendor_number
    ) {
      const { data: duplicate } = await supabase
        .from("vendors")
        .select("id")
        .eq("company_id", teamMember.company_id)
        .eq("vendor_number", validated.vendor_number)
        .neq("id", vendorId)
        .is("deleted_at", null)
        .single();

      if (duplicate) {
        throw new ActionError(
          "Vendor number already exists",
          ERROR_CODES.VALIDATION_FAILED
        );
      }
    }

    // Update vendor
    const { error } = await supabase
      .from("vendors")
      .update(validated)
      .eq("id", vendorId);

    if (error) {
      throw new ActionError(
        "Failed to update vendor",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/inventory/vendors");
    revalidatePath(`/dashboard/inventory/vendors/${vendorId}`);
  });
}

/**
 * Delete (soft delete) a vendor
 */
export async function deleteVendor(vendorId: string): Promise<ActionResult<void>> {
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
      .eq("status", "active")
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify vendor exists and belongs to company
    const { data: vendor } = await supabase
      .from("vendors")
      .select("id, company_id")
      .eq("id", vendorId)
      .is("deleted_at", null)
      .single();

    assertExists(vendor, "Vendor");

    if (vendor.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("vendor"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Soft delete vendor
    const { error } = await supabase
      .from("vendors")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id,
      })
      .eq("id", vendorId);

    if (error) {
      throw new ActionError(
        "Failed to delete vendor",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/inventory/vendors");
  });
}

/**
 * Get a single vendor by ID
 */
export async function getVendor(vendorId: string): Promise<ActionResult<any>> {
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
      .eq("status", "active")
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const { data: vendor, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("id", vendorId)
      .eq("company_id", teamMember.company_id)
      .is("deleted_at", null)
      .single();

    if (error) {
      throw new ActionError(
        "Failed to fetch vendor",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    assertExists(vendor, "Vendor");

    return vendor;
  });
}

/**
 * List all vendors for the company
 */
export function listVendors(options?: {
  status?: "active" | "inactive";
  category?: string;
  search?: string;
}): Promise<ActionResult<any[]>> {
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
      .eq("status", "active")
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    let query = supabase
      .from("vendors")
      .select("*")
      .eq("company_id", teamMember.company_id)
      .is("deleted_at", null)
      .order("name", { ascending: true });

    if (options?.status) {
      query = query.eq("status", options.status);
    }

    if (options?.category) {
      query = query.eq("category", options.category);
    }

    if (options?.search) {
      query = query.or(
        `name.ilike.%${options.search}%,display_name.ilike.%${options.search}%,vendor_number.ilike.%${options.search}%,email.ilike.%${options.search}%`
      );
    }

    const { data: vendors, error } = await query;

    if (error) {
      throw new ActionError(
        "Failed to fetch vendors",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return vendors || [];
  });
}

/**
 * Search vendors by query string
 */
export async function searchVendors(query: string): Promise<ActionResult<any[]>> {
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
      .eq("status", "active")
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const { data: vendors, error } = await supabase
      .from("vendors")
      .select("id, name, display_name, vendor_number, email, phone, status")
      .eq("company_id", teamMember.company_id)
      .eq("status", "active")
      .is("deleted_at", null)
      .or(
        `name.ilike.%${query}%,display_name.ilike.%${query}%,vendor_number.ilike.%${query}%,email.ilike.%${query}%`
      )
      .limit(20);

    if (error) {
      throw new ActionError(
        "Failed to search vendors",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return vendors || [];
  });
}

/**
 * Link a purchase order to a vendor
 */
export function linkPurchaseOrderToVendor(
  purchaseOrderId: string,
  vendorId: string
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
      .eq("status", "active")
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify purchase order exists and belongs to company
    const { data: po } = await supabase
      .from("purchase_orders")
      .select("id, company_id")
      .eq("id", purchaseOrderId)
      .is("deleted_at", null)
      .single();

    assertExists(po, "Purchase Order");

    if (po.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("purchase order"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify vendor exists and belongs to company
    const { data: vendor } = await supabase
      .from("vendors")
      .select("id, company_id")
      .eq("id", vendorId)
      .is("deleted_at", null)
      .single();

    assertExists(vendor, "Vendor");

    if (vendor.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("vendor"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Link purchase order to vendor
    const { error } = await supabase
      .from("purchase_orders")
      .update({ vendor_id: vendorId })
      .eq("id", purchaseOrderId);

    if (error) {
      throw new ActionError(
        "Failed to link purchase order",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/vendors");
    revalidatePath(`/dashboard/work/vendors/${vendorId}`);
    revalidatePath("/dashboard/work/purchase-orders");
    revalidatePath(`/dashboard/work/purchase-orders/${purchaseOrderId}`);
  });
}
