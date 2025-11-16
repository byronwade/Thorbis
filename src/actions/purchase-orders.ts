/**
 * Purchase Orders Server Actions
 *
 * Handles purchase order management with CRUD operations, status updates,
 * approval workflows, and vendor integration.
 */

"use server";

import { revalidatePath } from "next/cache";
import { getActiveCompanyId } from "@/lib/auth/company-context";
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
import { purchaseOrderInsertSchema } from "@/lib/validations/database-schemas";

/**
 * Generate unique PO number
 */
async function generatePONumber(
  supabase: any,
  companyId: string
): Promise<string> {
  const { data: latestPO } = await supabase
    .from("purchase_orders")
    .select("po_number")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!latestPO) {
    return `PO-${new Date().getFullYear()}-001`;
  }

  const match = latestPO.po_number.match(/PO-(\d{4})-(\d+)/);
  if (match) {
    const year = match[1];
    const nextNumber = Number.parseInt(match[2], 10) + 1;
    return `PO-${year}-${nextNumber.toString().padStart(3, "0")}`;
  }

  return `PO-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;
}

/**
 * Calculate PO totals from line items
 */
function calculateTotals(lineItems: any[]): {
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
} {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + (item.total || item.unit_price * item.quantity),
    0
  );

  // Tax and shipping would come from form data or be calculated
  const taxAmount = 0;
  const shippingAmount = 0;
  const totalAmount = subtotal + taxAmount + shippingAmount;

  return {
    subtotal,
    taxAmount,
    shippingAmount,
    totalAmount,
  };
}

/**
 * Get a single purchase order by ID with relations
 */
export function getPurchaseOrder(poId: string): Promise<ActionResult<any>> {
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

    // Use getActiveCompanyId which handles company selection properly
    const activeCompanyId = await getActiveCompanyId();

    if (!activeCompanyId) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Simplified query without vendors table (doesn't exist in current schema)
    const { data: po, error } = await supabase
      .from("purchase_orders")
      .select("*")
      .eq("id", poId)
      .eq("company_id", activeCompanyId)
      .single();

    if (error) {
      throw new ActionError(
        "Failed to fetch purchase order",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    assertExists(po, "Purchase order");

    return po;
  });
}

/**
 * Create a new purchase order
 */
export function createPurchaseOrder(
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

    // Use getActiveCompanyId which handles company selection properly
    const activeCompanyId = await getActiveCompanyId();

    if (!activeCompanyId) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Parse line items from JSON
    const lineItemsString = formData.get("line_items");
    let lineItems: any[] = [];
    if (lineItemsString && typeof lineItemsString === "string") {
      try {
        lineItems = JSON.parse(lineItemsString);
      } catch {
        throw new ActionError(
          "Invalid line items data",
          ERROR_CODES.VALIDATION_FAILED
        );
      }
    }

    if (lineItems.length === 0) {
      throw new ActionError(
        "At least one line item is required",
        ERROR_CODES.VALIDATION_FAILED
      );
    }

    // Generate PO number if not provided
    const poNumber =
      formData.get("po_number")?.toString() ||
      (await generatePONumber(supabase, activeCompanyId));

    // Get vendor info if vendor_id is provided
    let vendorName = formData.get("vendor") as string;
    let vendorEmail = formData.get("vendor_email") as string | null;
    let vendorPhone = formData.get("vendor_phone") as string | null;

    const vendorId = formData.get("vendor_id")?.toString();
    if (vendorId) {
      const { data: vendor } = await supabase
        .from("vendors")
        .select("name, display_name, email, phone")
        .eq("id", vendorId)
        .single();

      if (vendor) {
        vendorName = vendor.display_name || vendor.name;
        vendorEmail = vendor.email || vendorEmail;
        vendorPhone = vendor.phone || vendorPhone;
      }
    }

    if (!vendorName) {
      throw new ActionError(
        "Vendor name is required",
        ERROR_CODES.VALIDATION_FAILED
      );
    }

    // Calculate totals
    const totals = calculateTotals(lineItems);

    // Validate input
    const data = purchaseOrderInsertSchema.parse({
      company_id: activeCompanyId,
      job_id: formData.get("job_id") || undefined,
      estimate_id: formData.get("estimate_id") || undefined,
      invoice_id: formData.get("invoice_id") || undefined,
      requested_by: user.id,
      vendor_id: vendorId || undefined,
      vendor: vendorName,
      vendor_email: vendorEmail || undefined,
      vendor_phone: vendorPhone || undefined,
      po_number: poNumber,
      title: formData.get("title"),
      description: formData.get("description") || undefined,
      status: formData.get("status") || "draft",
      priority: formData.get("priority") || "normal",
      line_items: lineItems,
      subtotal: totals.subtotal,
      tax_amount: formData.get("tax_amount")
        ? Number.parseInt(formData.get("tax_amount") as string, 10)
        : totals.taxAmount,
      shipping_amount: formData.get("shipping_amount")
        ? Number.parseInt(formData.get("shipping_amount") as string, 10)
        : totals.shippingAmount,
      total_amount: totals.totalAmount,
      expected_delivery: formData.get("expected_delivery")
        ? new Date(formData.get("expected_delivery") as string).toISOString()
        : undefined,
      delivery_address: formData.get("delivery_address") || undefined,
      notes: formData.get("notes") || undefined,
      internal_notes: formData.get("internal_notes") || undefined,
      auto_generated: formData.get("auto_generated") === "true",
    });

    // Insert purchase order
    const { data: po, error } = await supabase
      .from("purchase_orders")
      .insert({
        company_id: data.company_id,
        job_id: data.job_id,
        estimate_id: data.estimate_id,
        invoice_id: data.invoice_id,
        requested_by: data.requested_by,
        approved_by: data.approved_by,
        vendor_id: data.vendor_id,
        vendor: data.vendor,
        vendor_email: data.vendor_email,
        vendor_phone: data.vendor_phone,
        po_number: data.po_number,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        line_items: data.line_items,
        subtotal: data.subtotal,
        tax_amount: data.tax_amount,
        shipping_amount: data.shipping_amount,
        total_amount: data.total_amount,
        expected_delivery: data.expected_delivery,
        delivery_address: data.delivery_address,
        notes: data.notes,
        internal_notes: data.internal_notes,
        auto_generated: data.auto_generated,
      })
      .select("id")
      .single();

    if (error) {
      throw new ActionError(
        "Failed to create purchase order",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    assertExists(po, "Purchase order");

    revalidatePath("/dashboard/work/purchase-orders");
    revalidatePath(`/dashboard/work/purchase-orders/${po.id}`);

    return po.id;
  });
}

/**
 * Update purchase order status
 */
export function updatePurchaseOrderStatus(
  poId: string,
  status: string,
  _notes?: string
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

    // Use getActiveCompanyId which handles company selection properly
    const activeCompanyId = await getActiveCompanyId();

    if (!activeCompanyId) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify PO exists and belongs to company
    const { data: existingPO } = await supabase
      .from("purchase_orders")
      .select("id, company_id, status")
      .eq("id", poId)
      .single();

    assertExists(existingPO, "Purchase order");

    if (existingPO.company_id !== activeCompanyId) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("purchase order"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Build update object
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Set timestamps based on status
    if (status === "approved" && existingPO.status !== "approved") {
      updateData.approved_at = new Date().toISOString();
      updateData.approved_by = user.id;
    }

    if (status === "ordered" && existingPO.status !== "ordered") {
      updateData.ordered_at = new Date().toISOString();
    }

    if (status === "received" && existingPO.status !== "received") {
      updateData.received_at = new Date().toISOString();
      updateData.actual_delivery = new Date().toISOString();
    }

    // Update purchase order
    const { error } = await supabase
      .from("purchase_orders")
      .update(updateData)
      .eq("id", poId);

    if (error) {
      throw new ActionError(
        "Failed to update purchase order status",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/purchase-orders");
    revalidatePath(`/dashboard/work/purchase-orders/${poId}`);
  });
}

/**
 * Update purchase order vendor
 */
export function updatePurchaseOrderVendor(
  poId: string,
  vendorId: string | null,
  vendorName: string,
  vendorEmail?: string | null,
  vendorPhone?: string | null
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

    const activeCompanyId = await getActiveCompanyId();

    if (!activeCompanyId) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify PO exists and belongs to company
    const { data: existingPO } = await supabase
      .from("purchase_orders")
      .select("id, company_id")
      .eq("id", poId)
      .single();

    assertExists(existingPO, "Purchase order");

    if (existingPO.company_id !== activeCompanyId) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("purchase order"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // If vendor_id is provided, fetch vendor details
    let finalVendorName = vendorName;
    let finalVendorEmail = vendorEmail;
    let finalVendorPhone = vendorPhone;

    if (vendorId) {
      const { data: vendor } = await supabase
        .from("vendors")
        .select("name, display_name, email, phone")
        .eq("id", vendorId)
        .single();

      if (vendor) {
        finalVendorName = vendor.display_name || vendor.name;
        finalVendorEmail = vendor.email || finalVendorEmail;
        finalVendorPhone = vendor.phone || finalVendorPhone;
      }
    }

    // Update purchase order
    const { error } = await supabase
      .from("purchase_orders")
      .update({
        vendor_id: vendorId || null,
        vendor: finalVendorName,
        vendor_email: finalVendorEmail || null,
        vendor_phone: finalVendorPhone || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", poId);

    if (error) {
      throw new ActionError(
        "Failed to update vendor",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/purchase-orders");
    revalidatePath(`/dashboard/work/purchase-orders/${poId}`);
  });
}

/**
 * Approve a purchase order
 */
export async function approvePurchaseOrder(
  poId: string
): Promise<ActionResult<void>> {
  return updatePurchaseOrderStatus(poId, "approved");
}

/**
 * Update purchase order line items
 */
export function updatePurchaseOrderLineItems(
  poId: string,
  lineItems: any[]
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

    // Use getActiveCompanyId which handles company selection properly
    const activeCompanyId = await getActiveCompanyId();

    if (!activeCompanyId) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify PO exists and belongs to company
    const { data: existingPO } = await supabase
      .from("purchase_orders")
      .select("id, company_id")
      .eq("id", poId)
      .single();

    assertExists(existingPO, "Purchase order");

    if (existingPO.company_id !== activeCompanyId) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("purchase order"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Calculate new totals
    const totals = calculateTotals(lineItems);

    // Update purchase order
    const { error } = await supabase
      .from("purchase_orders")
      .update({
        line_items: lineItems,
        subtotal: totals.subtotal,
        total_amount: totals.totalAmount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", poId);

    if (error) {
      throw new ActionError(
        "Failed to update purchase order line items",
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/purchase-orders");
    revalidatePath(`/dashboard/work/purchase-orders/${poId}`);
  });
}

/**
 * Archive a purchase order (soft delete)
 */
export async function archivePurchaseOrder(
  poId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("purchase_orders")
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq("id", poId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/work/purchase-orders");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Unlink purchase order from job
 * Removes the job association (sets job_id to NULL)
 * Bidirectional operation - updates both PO and job views
 */
export function unlinkPurchaseOrderFromJob(
  poId: string
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

    const activeCompanyId = await getActiveCompanyId();

    if (!activeCompanyId) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Get current PO to verify exists and get job_id for revalidation
    const { data: po, error: fetchError } = await supabase
      .from("purchase_orders")
      .select("id, job_id, company_id")
      .eq("id", poId)
      .single();

    if (fetchError || !po) {
      throw new ActionError(
        "Purchase order not found",
        ERROR_CODES.DB_RECORD_NOT_FOUND
      );
    }

    if (po.company_id !== activeCompanyId) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("purchase order"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const previousJobId = po.job_id;

    // Unlink purchase order from job (set job_id to NULL)
    const { error: unlinkError } = await supabase
      .from("purchase_orders")
      .update({ job_id: null })
      .eq("id", poId);

    if (unlinkError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("unlink purchase order from job"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Revalidate both pages
    revalidatePath(`/dashboard/work/purchase-orders/${poId}`);
    if (previousJobId) {
      revalidatePath(`/dashboard/work/${previousJobId}`);
    }
    revalidatePath("/dashboard/work/purchase-orders");
  });
}
