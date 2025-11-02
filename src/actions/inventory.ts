/**
 * Inventory Management Server Actions
 *
 * Comprehensive inventory/stock tracking with:
 * - Stock level management (on-hand, reserved, available)
 * - Reorder point automation and alerts
 * - Location tracking (warehouse, bins)
 * - Stock movement tracking
 * - Cost tracking and valuation
 * - Low stock alerts
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
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const inventorySchema = z.object({
  priceBookItemId: z.string().uuid("Price book item is required"),
  quantityOnHand: z
    .number()
    .int()
    .min(0, "Quantity cannot be negative")
    .default(0),
  minimumQuantity: z.number().int().min(0).default(0),
  maximumQuantity: z.number().int().min(0).optional(),
  reorderPoint: z.number().int().min(0).default(0),
  reorderQuantity: z.number().int().min(0).default(0),
  warehouseLocation: z.string().max(100).optional(),
  primaryLocation: z.string().max(100).optional(),
  costPerUnit: z.number().int().min(0).default(0), // In cents
  notes: z.string().optional(),
});

const stockAdjustmentSchema = z.object({
  inventoryId: z.string().uuid(),
  quantityChange: z.number().int(),
  reason: z.enum([
    "restock",
    "sale",
    "damage",
    "theft",
    "correction",
    "transfer",
    "return",
  ]),
  reference: z.string().max(200).optional(), // PO number, job number, etc.
  notes: z.string().optional(),
});

const reserveStockSchema = z.object({
  inventoryId: z.string().uuid(),
  quantity: z.number().int().min(1),
  jobId: z.string().uuid().optional(),
  notes: z.string().optional(),
});

// ============================================================================
// INVENTORY CRUD OPERATIONS
// ============================================================================

/**
 * Create new inventory record for a price book item
 */
export async function createInventory(
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
      .single();

    if (!teamMember?.company_id) {
      throw new ActionError(
        "You must be part of a company",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Validate input
    const data = inventorySchema.parse({
      priceBookItemId: formData.get("priceBookItemId"),
      quantityOnHand: formData.get("quantityOnHand")
        ? Number(formData.get("quantityOnHand"))
        : 0,
      minimumQuantity: formData.get("minimumQuantity")
        ? Number(formData.get("minimumQuantity"))
        : 0,
      maximumQuantity: formData.get("maximumQuantity")
        ? Number(formData.get("maximumQuantity"))
        : undefined,
      reorderPoint: formData.get("reorderPoint")
        ? Number(formData.get("reorderPoint"))
        : 0,
      reorderQuantity: formData.get("reorderQuantity")
        ? Number(formData.get("reorderQuantity"))
        : 0,
      warehouseLocation: formData.get("warehouseLocation") || undefined,
      primaryLocation: formData.get("primaryLocation") || undefined,
      costPerUnit: formData.get("costPerUnit")
        ? Number(formData.get("costPerUnit"))
        : 0,
      notes: formData.get("notes") || undefined,
    });

    // Verify price book item exists and belongs to company
    const { data: priceBookItem } = await supabase
      .from("price_book_items")
      .select("id, company_id, name")
      .eq("id", data.priceBookItemId)
      .single();

    assertExists(priceBookItem, "Price book item");

    if (priceBookItem.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Price book item not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Check if inventory already exists for this item
    const { data: existingInventory } = await supabase
      .from("inventory")
      .select("id")
      .eq("price_book_item_id", data.priceBookItemId)
      .is("deleted_at", null)
      .single();

    if (existingInventory) {
      throw new ActionError(
        "Inventory already exists for this item. Use update instead.",
        ERROR_CODES.DB_DUPLICATE_ENTRY
      );
    }

    // Calculate derived values
    const quantityAvailable = data.quantityOnHand; // Initially no reservations
    const totalCostValue = data.quantityOnHand * data.costPerUnit;
    const isLowStock = data.quantityOnHand <= data.minimumQuantity;

    // Create inventory
    const { data: inventory, error: createError } = await supabase
      .from("inventory")
      .insert({
        company_id: teamMember.company_id,
        price_book_item_id: data.priceBookItemId,
        quantity_on_hand: data.quantityOnHand,
        quantity_reserved: 0,
        quantity_available: quantityAvailable,
        minimum_quantity: data.minimumQuantity,
        maximum_quantity: data.maximumQuantity,
        reorder_point: data.reorderPoint,
        reorder_quantity: data.reorderQuantity,
        warehouse_location: data.warehouseLocation,
        primary_location: data.primaryLocation,
        cost_per_unit: data.costPerUnit,
        total_cost_value: totalCostValue,
        last_purchase_cost: data.costPerUnit,
        is_low_stock: isLowStock,
        low_stock_alert_sent: false,
        status: "active",
        notes: data.notes,
      })
      .select("id")
      .single();

    if (createError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("create inventory"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/materials");
    revalidatePath("/dashboard/work/pricebook");
    return inventory.id;
  });
}

/**
 * Update existing inventory settings
 */
export async function updateInventory(
  inventoryId: string,
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

    // Verify inventory exists and belongs to company
    const { data: inventory } = await supabase
      .from("inventory")
      .select("id, company_id, price_book_item_id")
      .eq("id", inventoryId)
      .is("deleted_at", null)
      .single();

    assertExists(inventory, "Inventory");

    if (inventory.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Inventory not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Validate input (excluding quantity changes - use adjustStock for that)
    const data = inventorySchema.omit({ quantityOnHand: true }).parse({
      priceBookItemId: inventory.price_book_item_id,
      minimumQuantity: formData.get("minimumQuantity")
        ? Number(formData.get("minimumQuantity"))
        : 0,
      maximumQuantity: formData.get("maximumQuantity")
        ? Number(formData.get("maximumQuantity"))
        : undefined,
      reorderPoint: formData.get("reorderPoint")
        ? Number(formData.get("reorderPoint"))
        : 0,
      reorderQuantity: formData.get("reorderQuantity")
        ? Number(formData.get("reorderQuantity"))
        : 0,
      warehouseLocation: formData.get("warehouseLocation") || undefined,
      primaryLocation: formData.get("primaryLocation") || undefined,
      costPerUnit: formData.get("costPerUnit")
        ? Number(formData.get("costPerUnit"))
        : 0,
      notes: formData.get("notes") || undefined,
    });

    // Update inventory
    const { error: updateError } = await supabase
      .from("inventory")
      .update({
        minimum_quantity: data.minimumQuantity,
        maximum_quantity: data.maximumQuantity,
        reorder_point: data.reorderPoint,
        reorder_quantity: data.reorderQuantity,
        warehouse_location: data.warehouseLocation,
        primary_location: data.primaryLocation,
        cost_per_unit: data.costPerUnit,
        notes: data.notes,
      })
      .eq("id", inventoryId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update inventory"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/materials");
  });
}

/**
 * Delete inventory record (soft delete)
 */
export async function deleteInventory(
  inventoryId: string
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

    // Verify inventory exists and belongs to company
    const { data: inventory } = await supabase
      .from("inventory")
      .select("id, company_id, quantity_reserved")
      .eq("id", inventoryId)
      .is("deleted_at", null)
      .single();

    assertExists(inventory, "Inventory");

    if (inventory.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Inventory not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Prevent deletion if there are reserved quantities
    if (inventory.quantity_reserved > 0) {
      throw new ActionError(
        "Cannot delete inventory with reserved stock. Release reservations first.",
        ERROR_CODES.BUSINESS_RULE_VIOLATION
      );
    }

    // Soft delete
    const { error: deleteError } = await supabase
      .from("inventory")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id,
        status: "discontinued",
      })
      .eq("id", inventoryId);

    if (deleteError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("delete inventory"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/materials");
  });
}

// ============================================================================
// STOCK MANAGEMENT OPERATIONS
// ============================================================================

/**
 * Adjust stock levels (add or remove inventory)
 */
export async function adjustStock(
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

    // Validate input
    const data = stockAdjustmentSchema.parse({
      inventoryId: formData.get("inventoryId"),
      quantityChange: Number(formData.get("quantityChange")),
      reason: formData.get("reason"),
      reference: formData.get("reference") || undefined,
      notes: formData.get("notes") || undefined,
    });

    // Verify inventory exists and belongs to company
    const { data: inventory } = await supabase
      .from("inventory")
      .select(
        "id, company_id, quantity_on_hand, quantity_reserved, cost_per_unit, minimum_quantity, reorder_point"
      )
      .eq("id", data.inventoryId)
      .is("deleted_at", null)
      .single();

    assertExists(inventory, "Inventory");

    if (inventory.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Inventory not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Calculate new quantities
    const newQuantityOnHand = inventory.quantity_on_hand + data.quantityChange;

    // Prevent negative inventory
    if (newQuantityOnHand < 0) {
      throw new ActionError(
        "Stock adjustment would result in negative inventory",
        ERROR_CODES.BUSINESS_RULE_VIOLATION
      );
    }

    // Prevent reducing below reserved quantity
    if (newQuantityOnHand < inventory.quantity_reserved) {
      throw new ActionError(
        `Cannot reduce stock below reserved quantity (${inventory.quantity_reserved})`,
        ERROR_CODES.BUSINESS_RULE_VIOLATION
      );
    }

    const newQuantityAvailable =
      newQuantityOnHand - inventory.quantity_reserved;
    const newTotalCostValue = newQuantityOnHand * inventory.cost_per_unit;
    const isLowStock = newQuantityOnHand <= inventory.minimum_quantity;

    // Update inventory
    const updateData: any = {
      quantity_on_hand: newQuantityOnHand,
      quantity_available: newQuantityAvailable,
      total_cost_value: newTotalCostValue,
      is_low_stock: isLowStock,
    };

    // Track last restock if this is an increase
    if (data.quantityChange > 0 && data.reason === "restock") {
      updateData.last_restock_date = new Date().toISOString();
      updateData.last_restock_quantity = data.quantityChange;
      if (data.reference) {
        updateData.last_restock_purchase_order_id = data.reference;
      }
      // Reset low stock alert when restocking
      updateData.low_stock_alert_sent = false;
    }

    // Track last stock check
    updateData.last_stock_check_date = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("inventory")
      .update(updateData)
      .eq("id", data.inventoryId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("adjust stock"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // TODO: Create stock_movements record to track the adjustment
    // This would require a stock_movements table in the schema

    revalidatePath("/dashboard/work/materials");
  });
}

/**
 * Reserve stock for a job
 */
export async function reserveStock(
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

    // Validate input
    const data = reserveStockSchema.parse({
      inventoryId: formData.get("inventoryId"),
      quantity: Number(formData.get("quantity")),
      jobId: formData.get("jobId") || undefined,
      notes: formData.get("notes") || undefined,
    });

    // Verify inventory exists and belongs to company
    const { data: inventory } = await supabase
      .from("inventory")
      .select("id, company_id, quantity_on_hand, quantity_reserved")
      .eq("id", data.inventoryId)
      .is("deleted_at", null)
      .single();

    assertExists(inventory, "Inventory");

    if (inventory.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Inventory not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Check if enough stock is available
    const availableQuantity =
      inventory.quantity_on_hand - inventory.quantity_reserved;
    if (data.quantity > availableQuantity) {
      throw new ActionError(
        `Insufficient stock available. Only ${availableQuantity} units available.`,
        ERROR_CODES.BUSINESS_RULE_VIOLATION
      );
    }

    // Update inventory with new reservation
    const newQuantityReserved = inventory.quantity_reserved + data.quantity;
    const newQuantityAvailable =
      inventory.quantity_on_hand - newQuantityReserved;

    const { error: updateError } = await supabase
      .from("inventory")
      .update({
        quantity_reserved: newQuantityReserved,
        quantity_available: newQuantityAvailable,
      })
      .eq("id", data.inventoryId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("reserve stock"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // TODO: Create stock_reservations record to track the reservation
    // This would require a stock_reservations table in the schema

    if (data.jobId) {
      revalidatePath(`/dashboard/work/jobs/${data.jobId}`);
    }
    revalidatePath("/dashboard/work/materials");
  });
}

/**
 * Release reserved stock
 */
export async function releaseReservedStock(
  inventoryId: string,
  quantity: number
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

    // Verify inventory exists and belongs to company
    const { data: inventory } = await supabase
      .from("inventory")
      .select("id, company_id, quantity_on_hand, quantity_reserved")
      .eq("id", inventoryId)
      .is("deleted_at", null)
      .single();

    assertExists(inventory, "Inventory");

    if (inventory.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Inventory not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Validate quantity to release
    if (quantity > inventory.quantity_reserved) {
      throw new ActionError(
        `Cannot release more than reserved quantity (${inventory.quantity_reserved})`,
        ERROR_CODES.BUSINESS_RULE_VIOLATION
      );
    }

    // Update inventory
    const newQuantityReserved = inventory.quantity_reserved - quantity;
    const newQuantityAvailable =
      inventory.quantity_on_hand - newQuantityReserved;

    const { error: updateError } = await supabase
      .from("inventory")
      .update({
        quantity_reserved: newQuantityReserved,
        quantity_available: newQuantityAvailable,
      })
      .eq("id", inventoryId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("release reserved stock"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/materials");
  });
}

/**
 * Use reserved stock (deduct from both reserved and on-hand)
 */
export async function useReservedStock(
  inventoryId: string,
  quantity: number,
  jobId?: string
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

    // Verify inventory exists and belongs to company
    const { data: inventory } = await supabase
      .from("inventory")
      .select(
        "id, company_id, quantity_on_hand, quantity_reserved, cost_per_unit"
      )
      .eq("id", inventoryId)
      .is("deleted_at", null)
      .single();

    assertExists(inventory, "Inventory");

    if (inventory.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Inventory not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Validate quantity to use
    if (quantity > inventory.quantity_reserved) {
      throw new ActionError(
        `Cannot use more than reserved quantity (${inventory.quantity_reserved})`,
        ERROR_CODES.BUSINESS_RULE_VIOLATION
      );
    }

    // Update inventory (reduce both on-hand and reserved)
    const newQuantityOnHand = inventory.quantity_on_hand - quantity;
    const newQuantityReserved = inventory.quantity_reserved - quantity;
    const newQuantityAvailable = newQuantityOnHand - newQuantityReserved;
    const newTotalCostValue = newQuantityOnHand * inventory.cost_per_unit;

    const updateData: any = {
      quantity_on_hand: newQuantityOnHand,
      quantity_reserved: newQuantityReserved,
      quantity_available: newQuantityAvailable,
      total_cost_value: newTotalCostValue,
      last_used_date: new Date().toISOString(),
    };

    if (jobId) {
      updateData.last_used_job_id = jobId;
    }

    const { error: updateError } = await supabase
      .from("inventory")
      .update(updateData)
      .eq("id", inventoryId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("use reserved stock"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    if (jobId) {
      revalidatePath(`/dashboard/work/jobs/${jobId}`);
    }
    revalidatePath("/dashboard/work/materials");
  });
}

// ============================================================================
// REPORTING & ALERTS
// ============================================================================

/**
 * Get low stock items that need reordering
 */
export async function getLowStockItems(): Promise<ActionResult<any[]>> {
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

    // Get items at or below reorder point
    const { data: lowStockItems, error } = await supabase
      .from("inventory")
      .select(
        `
        *,
        item:price_book_items(id, name, sku, unit, supplier_id)
      `
      )
      .eq("company_id", teamMember.company_id)
      .eq("status", "active")
      .is("deleted_at", null)
      .or("quantity_on_hand.lte.reorder_point,is_low_stock.eq.true")
      .order("quantity_on_hand", { ascending: true });

    if (error) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("fetch low stock items"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return lowStockItems || [];
  });
}

/**
 * Get inventory items that need stock check
 */
export async function getItemsNeedingStockCheck(
  daysSinceLastCheck = 30
): Promise<ActionResult<any[]>> {
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

    const checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - daysSinceLastCheck);

    const { data: items, error } = await supabase
      .from("inventory")
      .select(
        `
        *,
        item:price_book_items(id, name, sku)
      `
      )
      .eq("company_id", teamMember.company_id)
      .eq("status", "active")
      .is("deleted_at", null)
      .or(
        `last_stock_check_date.is.null,last_stock_check_date.lt.${checkDate.toISOString()}`
      )
      .order("last_stock_check_date", { ascending: true, nullsFirst: true });

    if (error) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("fetch items needing stock check"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return items || [];
  });
}
