/**
 * Equipment Management Server Actions
 *
 * Comprehensive equipment/asset tracking with:
 * - Equipment CRUD operations
 * - Auto-generated equipment numbers (EQ-2025-001)
 * - Warranty and service tracking
 * - Maintenance scheduling
 * - Service history and metrics
 * - Soft delete support
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

const equipmentSchema = z.object({
  customerId: z.string().uuid("Customer is required"),
  propertyId: z.string().uuid("Property is required"),
  name: z.string().min(1, "Equipment name is required").max(200),
  type: z.enum([
    "hvac",
    "plumbing",
    "electrical",
    "appliance",
    "water_heater",
    "furnace",
    "ac_unit",
    "heat_pump",
    "boiler",
    "other",
  ]),
  category: z.string().max(100).optional(),
  manufacturer: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  serialNumber: z.string().max(100).optional(),
  modelYear: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional(),
  installDate: z.date().optional().nullable(),
  capacity: z.string().max(100).optional(),
  efficiency: z.string().max(100).optional(),
  fuelType: z
    .enum(["electric", "gas", "propane", "oil", "dual", "other"])
    .optional(),
  location: z.string().max(200).optional(),
  condition: z
    .enum(["excellent", "good", "fair", "poor", "needs_replacement"])
    .default("good"),
  warrantyExpiration: z.date().optional().nullable(),
  warrantyProvider: z.string().max(200).optional(),
  warrantyNotes: z.string().optional(),
  serviceIntervalDays: z.number().int().min(1).default(365),
  notes: z.string().optional(),
  customerNotes: z.string().optional(),
});

const recordServiceSchema = z.object({
  equipmentId: z.string().uuid(),
  jobId: z.string().uuid(),
  serviceDate: z.date(),
  serviceCost: z.number().int().min(0), // In cents
  notes: z.string().optional(),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate unique equipment number in format: EQ-YYYY-###
 */
async function generateEquipmentNumber(
  supabase: any,
  companyId: string
): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `EQ-${year}-`;

  // Get the latest equipment number for this year
  const { data: latestEquipment } = await supabase
    .from("equipment")
    .select("equipment_number")
    .eq("company_id", companyId)
    .like("equipment_number", `${prefix}%`)
    .order("equipment_number", { ascending: false })
    .limit(1)
    .single();

  let nextNumber = 1;
  if (latestEquipment?.equipment_number) {
    const currentNumber = Number.parseInt(
      latestEquipment.equipment_number.split("-")[2],
      10
    );
    nextNumber = currentNumber + 1;
  }

  return `${prefix}${nextNumber.toString().padStart(3, "0")}`;
}

// ============================================================================
// EQUIPMENT CRUD OPERATIONS
// ============================================================================

/**
 * Create new equipment/asset
 */
export async function createEquipment(
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
    const data = equipmentSchema.parse({
      customerId: formData.get("customerId"),
      propertyId: formData.get("propertyId"),
      name: formData.get("name"),
      type: formData.get("type"),
      category: formData.get("category") || undefined,
      manufacturer: formData.get("manufacturer") || undefined,
      model: formData.get("model") || undefined,
      serialNumber: formData.get("serialNumber") || undefined,
      modelYear: formData.get("modelYear")
        ? Number(formData.get("modelYear"))
        : undefined,
      installDate: formData.get("installDate")
        ? new Date(formData.get("installDate") as string)
        : null,
      capacity: formData.get("capacity") || undefined,
      efficiency: formData.get("efficiency") || undefined,
      fuelType: formData.get("fuelType") || undefined,
      location: formData.get("location") || undefined,
      condition: (formData.get("condition") as any) || "good",
      warrantyExpiration: formData.get("warrantyExpiration")
        ? new Date(formData.get("warrantyExpiration") as string)
        : null,
      warrantyProvider: formData.get("warrantyProvider") || undefined,
      warrantyNotes: formData.get("warrantyNotes") || undefined,
      serviceIntervalDays: formData.get("serviceIntervalDays")
        ? Number(formData.get("serviceIntervalDays"))
        : 365,
      notes: formData.get("notes") || undefined,
      customerNotes: formData.get("customerNotes") || undefined,
    });

    // Verify customer exists and belongs to company
    const { data: customer } = await supabase
      .from("customers")
      .select("id, company_id")
      .eq("id", data.customerId)
      .single();

    assertExists(customer, "Customer");

    if (customer.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Customer not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify property exists and belongs to customer
    const { data: property } = await supabase
      .from("properties")
      .select("id, customer_id")
      .eq("id", data.propertyId)
      .single();

    assertExists(property, "Property");

    if (property.customer_id !== data.customerId) {
      throw new ActionError(
        "Property does not belong to this customer",
        ERROR_CODES.BUSINESS_RULE_VIOLATION
      );
    }

    // Generate unique equipment number
    const equipmentNumber = await generateEquipmentNumber(
      supabase,
      teamMember.company_id
    );

    // Check if warranty is currently active
    const isUnderWarranty = data.warrantyExpiration
      ? new Date(data.warrantyExpiration) > new Date()
      : false;

    // Calculate next service due date
    let nextServiceDue: Date | null = null;
    if (data.installDate && data.serviceIntervalDays) {
      nextServiceDue = new Date(data.installDate);
      nextServiceDue.setDate(
        nextServiceDue.getDate() + data.serviceIntervalDays
      );
    }

    // Create equipment
    const { data: equipment, error: createError } = await supabase
      .from("equipment")
      .insert({
        company_id: teamMember.company_id,
        customer_id: data.customerId,
        property_id: data.propertyId,
        equipment_number: equipmentNumber,
        name: data.name,
        type: data.type,
        category: data.category,
        manufacturer: data.manufacturer,
        model: data.model,
        serial_number: data.serialNumber,
        model_year: data.modelYear,
        install_date: data.installDate,
        capacity: data.capacity,
        efficiency: data.efficiency,
        fuel_type: data.fuelType,
        location: data.location,
        condition: data.condition,
        status: "active",
        warranty_expiration: data.warrantyExpiration,
        warranty_provider: data.warrantyProvider,
        warranty_notes: data.warrantyNotes,
        is_under_warranty: isUnderWarranty,
        service_interval_days: data.serviceIntervalDays,
        next_service_due: nextServiceDue,
        notes: data.notes,
        customer_notes: data.customerNotes,
        total_service_count: 0,
        total_service_cost: 0,
        average_service_cost: 0,
      })
      .select("id")
      .single();

    if (createError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("create equipment"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/equipment");
    revalidatePath(`/dashboard/customers/${data.customerId}`);
    return equipment.id;
  });
}

/**
 * Update existing equipment
 */
export async function updateEquipment(
  equipmentId: string,
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

    // Verify equipment exists and belongs to company
    const { data: equipment } = await supabase
      .from("equipment")
      .select("id, company_id, customer_id")
      .eq("id", equipmentId)
      .is("deleted_at", null)
      .single();

    assertExists(equipment, "Equipment");

    if (equipment.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Equipment not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Validate input
    const data = equipmentSchema.parse({
      customerId: formData.get("customerId") || equipment.customer_id,
      propertyId: formData.get("propertyId"),
      name: formData.get("name"),
      type: formData.get("type"),
      category: formData.get("category") || undefined,
      manufacturer: formData.get("manufacturer") || undefined,
      model: formData.get("model") || undefined,
      serialNumber: formData.get("serialNumber") || undefined,
      modelYear: formData.get("modelYear")
        ? Number(formData.get("modelYear"))
        : undefined,
      installDate: formData.get("installDate")
        ? new Date(formData.get("installDate") as string)
        : null,
      capacity: formData.get("capacity") || undefined,
      efficiency: formData.get("efficiency") || undefined,
      fuelType: formData.get("fuelType") || undefined,
      location: formData.get("location") || undefined,
      condition: (formData.get("condition") as any) || "good",
      warrantyExpiration: formData.get("warrantyExpiration")
        ? new Date(formData.get("warrantyExpiration") as string)
        : null,
      warrantyProvider: formData.get("warrantyProvider") || undefined,
      warrantyNotes: formData.get("warrantyNotes") || undefined,
      serviceIntervalDays: formData.get("serviceIntervalDays")
        ? Number(formData.get("serviceIntervalDays"))
        : 365,
      notes: formData.get("notes") || undefined,
      customerNotes: formData.get("customerNotes") || undefined,
    });

    // Check if warranty is currently active
    const isUnderWarranty = data.warrantyExpiration
      ? new Date(data.warrantyExpiration) > new Date()
      : false;

    // Update equipment
    const { error: updateError } = await supabase
      .from("equipment")
      .update({
        property_id: data.propertyId,
        name: data.name,
        type: data.type,
        category: data.category,
        manufacturer: data.manufacturer,
        model: data.model,
        serial_number: data.serialNumber,
        model_year: data.modelYear,
        install_date: data.installDate,
        capacity: data.capacity,
        efficiency: data.efficiency,
        fuel_type: data.fuelType,
        location: data.location,
        condition: data.condition,
        warranty_expiration: data.warrantyExpiration,
        warranty_provider: data.warrantyProvider,
        warranty_notes: data.warrantyNotes,
        is_under_warranty: isUnderWarranty,
        service_interval_days: data.serviceIntervalDays,
        notes: data.notes,
        customer_notes: data.customerNotes,
      })
      .eq("id", equipmentId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update equipment"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/equipment");
    revalidatePath(`/dashboard/customers/${equipment.customer_id}`);
  });
}

/**
 * Delete equipment (soft delete)
 */
export async function deleteEquipment(
  equipmentId: string
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

    // Verify equipment exists and belongs to company
    const { data: equipment } = await supabase
      .from("equipment")
      .select("id, company_id, customer_id")
      .eq("id", equipmentId)
      .is("deleted_at", null)
      .single();

    assertExists(equipment, "Equipment");

    if (equipment.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Equipment not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Soft delete
    const { error: deleteError } = await supabase
      .from("equipment")
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id,
        status: "retired",
      })
      .eq("id", equipmentId);

    if (deleteError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("delete equipment"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/equipment");
    revalidatePath(`/dashboard/customers/${equipment.customer_id}`);
  });
}

// ============================================================================
// SERVICE & MAINTENANCE OPERATIONS
// ============================================================================

/**
 * Record service performed on equipment
 * Updates service metrics and schedules next service
 */
export async function recordService(
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
    const data = recordServiceSchema.parse({
      equipmentId: formData.get("equipmentId"),
      jobId: formData.get("jobId"),
      serviceDate: new Date(formData.get("serviceDate") as string),
      serviceCost: Number(formData.get("serviceCost")),
      notes: formData.get("notes") || undefined,
    });

    // Verify equipment exists and belongs to company
    const { data: equipment } = await supabase
      .from("equipment")
      .select(
        "id, company_id, total_service_count, total_service_cost, service_interval_days"
      )
      .eq("id", data.equipmentId)
      .is("deleted_at", null)
      .single();

    assertExists(equipment, "Equipment");

    if (equipment.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Equipment not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify job exists and belongs to company
    const { data: job } = await supabase
      .from("jobs")
      .select("id, company_id")
      .eq("id", data.jobId)
      .single();

    assertExists(job, "Job");

    if (job.company_id !== teamMember.company_id) {
      throw new ActionError("Job not found", ERROR_CODES.AUTH_FORBIDDEN, 403);
    }

    // Calculate updated metrics
    const newServiceCount = equipment.total_service_count + 1;
    const newTotalCost = equipment.total_service_cost + data.serviceCost;
    const newAverageCost = Math.round(newTotalCost / newServiceCount);

    // Calculate next service due date
    const nextServiceDue = new Date(data.serviceDate);
    nextServiceDue.setDate(
      nextServiceDue.getDate() + equipment.service_interval_days
    );

    // Update equipment with service information
    const { error: updateError } = await supabase
      .from("equipment")
      .update({
        last_service_date: data.serviceDate,
        last_service_job_id: data.jobId,
        next_service_due: nextServiceDue,
        total_service_count: newServiceCount,
        total_service_cost: newTotalCost,
        average_service_cost: newAverageCost,
      })
      .eq("id", data.equipmentId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("record service"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/equipment");
    revalidatePath(`/dashboard/work/jobs/${data.jobId}`);
  });
}

/**
 * Mark equipment as replaced by new equipment
 */
export async function replaceEquipment(
  oldEquipmentId: string,
  newEquipmentId: string
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

    // Verify old equipment exists and belongs to company
    const { data: oldEquipment } = await supabase
      .from("equipment")
      .select("id, company_id")
      .eq("id", oldEquipmentId)
      .is("deleted_at", null)
      .single();

    assertExists(oldEquipment, "Old equipment");

    if (oldEquipment.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Equipment not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Verify new equipment exists and belongs to company
    const { data: newEquipment } = await supabase
      .from("equipment")
      .select("id, company_id")
      .eq("id", newEquipmentId)
      .is("deleted_at", null)
      .single();

    assertExists(newEquipment, "New equipment");

    if (newEquipment.company_id !== teamMember.company_id) {
      throw new ActionError(
        "Equipment not found",
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    // Update old equipment to mark as replaced
    const { error: updateError } = await supabase
      .from("equipment")
      .update({
        status: "replaced",
        replaced_date: new Date().toISOString(),
        replaced_by_equipment_id: newEquipmentId,
      })
      .eq("id", oldEquipmentId);

    if (updateError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("mark equipment as replaced"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    revalidatePath("/dashboard/work/equipment");
  });
}

/**
 * Update warranty status for all equipment (background job)
 * This would typically be run by a cron job to check warranty expirations
 */
export async function updateWarrantyStatuses(): Promise<ActionResult<number>> {
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

    const now = new Date().toISOString();

    // Update equipment where warranty has expired
    const { error: expiredError, count: expiredCount } = await supabase
      .from("equipment")
      .update({ is_under_warranty: false })
      .eq("company_id", teamMember.company_id)
      .eq("is_under_warranty", true)
      .lt("warranty_expiration", now)
      .is("deleted_at", null);

    if (expiredError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update expired warranties"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Update equipment where warranty is now active
    const { error: activeError, count: activeCount } = await supabase
      .from("equipment")
      .update({ is_under_warranty: true })
      .eq("company_id", teamMember.company_id)
      .eq("is_under_warranty", false)
      .gte("warranty_expiration", now)
      .is("deleted_at", null);

    if (activeError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("update active warranties"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return (expiredCount || 0) + (activeCount || 0);
  });
}

/**
 * Get equipment due for service
 */
export async function getEquipmentDueForService(): Promise<
  ActionResult<any[]>
> {
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

    // Get equipment where next service is due within the next 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const { data: equipment, error } = await supabase
      .from("equipment")
      .select(
        `
        *,
        customer:customers(id, name, email, phone),
        property:properties(id, address, city, state, zip_code)
      `
      )
      .eq("company_id", teamMember.company_id)
      .eq("status", "active")
      .is("deleted_at", null)
      .lte("next_service_due", thirtyDaysFromNow.toISOString())
      .order("next_service_due", { ascending: true });

    if (error) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("fetch equipment due for service"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return equipment || [];
  });
}
