/**
 * Equipment Service Server Actions
 *
 * Manages equipment service history and tracking:
 * - Service history per equipment
 * - Parts used and replaced
 * - Equipment condition tracking
 * - Warranty tracking
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

const equipmentServiceSchema = z.object({
  equipmentId: z.string().uuid("Invalid equipment ID"),
  jobId: z.string().uuid("Invalid job ID").optional(),
  serviceDate: z.string(),
  serviceType: z.enum(["inspection", "repair", "replacement", "maintenance", "install"]),
  serviceDescription: z.string().min(1, "Service description is required"),
  technicianId: z.string().uuid().optional(),
  hoursSpent: z.number().min(0).default(0),
  partsCost: z.number().min(0).default(0),
  laborCost: z.number().min(0).default(0),
  equipmentCondition: z.enum(["excellent", "good", "fair", "poor", "failed"]).optional(),
  warrantyWork: z.boolean().default(false),
  warrantyClaimNumber: z.string().optional(),
  technicianNotes: z.string().optional(),
});

// ============================================================================
// EQUIPMENT SERVICE HISTORY
// ============================================================================

/**
 * Add service record to equipment
 */
export async function addEquipmentService(
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

    const data = equipmentServiceSchema.parse({
      equipmentId: formData.get("equipmentId"),
      jobId: formData.get("jobId") || undefined,
      serviceDate: formData.get("serviceDate") as string,
      serviceType: formData.get("serviceType") as any,
      serviceDescription: formData.get("serviceDescription"),
      technicianId: formData.get("technicianId") || undefined,
      hoursSpent: formData.get("hoursSpent")
        ? Number.parseFloat(formData.get("hoursSpent") as string)
        : 0,
      partsCost: formData.get("partsCost")
        ? Number.parseFloat(formData.get("partsCost") as string)
        : 0,
      laborCost: formData.get("laborCost")
        ? Number.parseFloat(formData.get("laborCost") as string)
        : 0,
      equipmentCondition: formData.get("equipmentCondition") as any || undefined,
      warrantyWork: formData.get("warrantyWork") === "true",
      warrantyClaimNumber: formData.get("warrantyClaimNumber") || undefined,
      technicianNotes: formData.get("technicianNotes") || undefined,
    });

    // Verify equipment belongs to company
    const { data: equipment } = await supabase
      .from("equipment")
      .select("company_id")
      .eq("id", data.equipmentId)
      .single();

    assertExists(equipment, "Equipment");

    if (equipment.company_id !== teamMember.company_id) {
      throw new ActionError(
        ERROR_MESSAGES.forbidden("equipment"),
        ERROR_CODES.AUTH_FORBIDDEN,
        403
      );
    }

    const totalCost = Math.round((data.partsCost + data.laborCost) * 100);

    // Add service record
    const { data: serviceRecord, error: createError } = await supabase
      .from("equipment_service_history")
      .insert({
        company_id: teamMember.company_id,
        equipment_id: data.equipmentId,
        job_id: data.jobId,
        service_date: data.serviceDate,
        service_type: data.serviceType,
        service_description: data.serviceDescription,
        technician_id: data.technicianId || user.id,
        hours_spent: data.hoursSpent,
        parts_cost: Math.round(data.partsCost * 100),
        labor_cost: Math.round(data.laborCost * 100),
        total_cost: totalCost,
        equipment_condition: data.equipmentCondition,
        warranty_work: data.warrantyWork,
        warranty_claim_number: data.warrantyClaimNumber,
        technician_notes: data.technicianNotes,
      })
      .select("id")
      .single();

    if (createError) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("add equipment service record"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    // Update equipment's last service date and condition
    await supabase
      .from("equipment")
      .update({
        last_service_date: data.serviceDate,
        condition: data.equipmentCondition,
      })
      .eq("id", data.equipmentId);

    revalidatePath(`/dashboard/equipment/${data.equipmentId}`);
    if (data.jobId) {
      revalidatePath(`/dashboard/work/${data.jobId}`);
    }

    return serviceRecord.id;
  });
}

/**
 * Get service history for equipment
 */
export async function getEquipmentServiceHistory(
  equipmentId: string
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

    const { data: serviceHistory, error } = await supabase
      .from("equipment_service_history")
      .select(`
        *,
        technician:users!technician_id(first_name, last_name, email),
        job:jobs(job_number, title)
      `)
      .eq("equipment_id", equipmentId)
      .eq("company_id", teamMember.company_id)
      .is("deleted_at", null)
      .order("service_date", { ascending: false });

    if (error) {
      throw new ActionError(
        ERROR_MESSAGES.operationFailed("fetch service history"),
        ERROR_CODES.DB_QUERY_ERROR
      );
    }

    return serviceHistory || [];
  });
}
