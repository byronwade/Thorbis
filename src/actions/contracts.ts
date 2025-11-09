"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

/**
 * Server Actions for Contract Management
 *
 * These handle contract CRUD operations with proper validation
 * and support for both standalone contracts and contracts linked
 * to estimates/invoices for digital signature workflows.
 *
 * Database implementation: Uses Supabase client with full CRUD operations
 * Security: All operations are company-scoped via RLS and getAuthContext()
 */

/**
 * Get authenticated user and company context
 */
async function getAuthContext() {
  const supabase = await createClient();

  if (!supabase) {
    throw new Error("Supabase client not configured");
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  // Get user's active company from team_members
  const { data: teamMember, error: teamError } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (teamError || !teamMember) {
    throw new Error("No active company found");
  }

  return {
    userId: user.id,
    companyId: teamMember.company_id,
    supabase,
  };
}

/**
 * Generate unique contract number
 */
async function generateContractNumber(
  companyId: string,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `CON-${year}-`;

  // Get count of contracts for this company this year
  if (!supabase) {
    throw new Error("Supabase client not available");
  }

  const { data: contracts } = await supabase
    .from("contracts")
    .select("contract_number")
    .eq("company_id", companyId);

  const yearContracts =
    contracts?.filter((c) => c.contract_number?.startsWith(prefix)) || [];

  const nextNumber = yearContracts.length + 1;
  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
}

/**
 * Validation schemas
 *
 * Note: Contracts are NOT linked directly to customers.
 * They must be linked to either an estimate or invoice (which have customer info).
 * The signer email is used to send the contract for signature.
 */
const contractSchema = z
  .object({
    title: z.string().min(1, "Contract title is required"),
    description: z.string().optional(),
    content: z.string().min(1, "Contract content is required"),
    // Must have either estimateId or invoiceId
    jobId: z.string().optional(),
    estimateId: z.string().optional(),
    invoiceId: z.string().optional(),
    contractType: z.enum(["service", "maintenance", "custom"]),
    validFrom: z.string().optional(),
    validUntil: z.string().optional(),
    terms: z.string().optional(),
    notes: z.string().optional(),
    // Signer info - email is required to send the contract
    signerName: z.string().optional(),
    signerEmail: z
      .string()
      .email("Valid email required")
      .min(1, "Signer email is required"),
    signerTitle: z.string().optional(),
    signerCompany: z.string().optional(),
  })
  .refine((data) => data.estimateId || data.invoiceId, {
    message: "Contract must be linked to either an estimate or invoice",
    path: ["estimateId"],
  });

const signContractSchema = z.object({
  contractId: z.string().min(1, "Contract ID is required"),
  signature: z.string().min(1, "Signature is required"),
  signerName: z.string().min(1, "Signer name is required"),
  signerEmail: z.string().email("Valid email required"),
  signerTitle: z.string().optional(),
  signerCompany: z.string().optional(),
  ipAddress: z.string().optional(),
});

// NOTE: Type exports moved to @/types/contracts
// to comply with Next.js 16 "use server" file restrictions.

/**
 * Create a new contract
 */
export async function createContract(
  formData: FormData
): Promise<{ success: boolean; error?: string; contractId?: string }> {
  try {
    const data = contractSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      content: formData.get("content"),
      jobId: formData.get("jobId"),
      estimateId: formData.get("estimateId"),
      invoiceId: formData.get("invoiceId"),
      contractType: formData.get("contractType"),
      validFrom: formData.get("validFrom"),
      validUntil: formData.get("validUntil"),
      terms: formData.get("terms"),
      notes: formData.get("notes"),
      signerName: formData.get("signerName"),
      signerEmail: formData.get("signerEmail"),
      signerTitle: formData.get("signerTitle"),
      signerCompany: formData.get("signerCompany"),
    });

    // Get auth context for company scoping
    const { companyId, supabase } = await getAuthContext();

    // Generate unique contract number
    const contractNumber = await generateContractNumber(companyId, supabase);

    // Insert into database
    const { data: contract, error } = await supabase
      .from("contracts")
      .insert({
        company_id: companyId,
        contract_number: contractNumber,
        title: data.title,
        description: data.description || null,
        content: data.content,
        job_id: data.jobId || null,
        estimate_id: data.estimateId || null,
        invoice_id: data.invoiceId || null,
        contract_type: data.contractType,
        valid_from: data.validFrom || null,
        valid_until: data.validUntil || null,
        terms: data.terms || null,
        notes: data.notes || null,
        signer_name: data.signerName || null,
        signer_email: data.signerEmail,
        signer_title: data.signerTitle || null,
        signer_company: data.signerCompany || null,
        status: "draft",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating contract:", error);
      throw new Error("Failed to create contract");
    }

    revalidatePath("/dashboard/work/contracts");
    return {
      success: true,
      contractId: contract.id,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return { success: false, error: "Failed to create contract" };
  }
}

/**
 * Update an existing contract
 */
export async function updateContract(
  contractId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const data = contractSchema.partial().parse({
      title: formData.get("title"),
      description: formData.get("description"),
      content: formData.get("content"),
      jobId: formData.get("jobId"),
      estimateId: formData.get("estimateId"),
      invoiceId: formData.get("invoiceId"),
      contractType: formData.get("contractType"),
      validFrom: formData.get("validFrom"),
      validUntil: formData.get("validUntil"),
      terms: formData.get("terms"),
      notes: formData.get("notes"),
      signerName: formData.get("signerName"),
      signerEmail: formData.get("signerEmail"),
      signerTitle: formData.get("signerTitle"),
      signerCompany: formData.get("signerCompany"),
    });

    // Get auth context for security
    const { companyId, supabase } = await getAuthContext();

    // Prepare update data with snake_case for Supabase
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description || null;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.jobId !== undefined) updateData.job_id = data.jobId || null;
    if (data.estimateId !== undefined)
      updateData.estimate_id = data.estimateId || null;
    if (data.invoiceId !== undefined)
      updateData.invoice_id = data.invoiceId || null;
    if (data.contractType !== undefined)
      updateData.contract_type = data.contractType;
    if (data.validFrom !== undefined)
      updateData.valid_from = data.validFrom || null;
    if (data.validUntil !== undefined)
      updateData.valid_until = data.validUntil || null;
    if (data.terms !== undefined) updateData.terms = data.terms || null;
    if (data.notes !== undefined) updateData.notes = data.notes || null;
    if (data.signerName !== undefined)
      updateData.signer_name = data.signerName || null;
    if (data.signerEmail !== undefined)
      updateData.signer_email = data.signerEmail;
    if (data.signerTitle !== undefined)
      updateData.signer_title = data.signerTitle || null;
    if (data.signerCompany !== undefined)
      updateData.signer_company = data.signerCompany || null;

    // Update in database (company-scoped for security via RLS)
    const { error } = await supabase
      .from("contracts")
      .update(updateData)
      .eq("id", contractId)
      .eq("company_id", companyId);

    if (error) {
      console.error("Error updating contract:", error);
      throw new Error("Failed to update contract");
    }

    revalidatePath("/dashboard/work/contracts");
    revalidatePath(`/dashboard/work/contracts/${contractId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return { success: false, error: "Failed to update contract" };
  }
}

/**
 * Archive a contract (soft delete)
 *
 * Archives instead of permanently deleting. Can be restored within 90 days.
 */
export async function archiveContract(
  contractId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get auth context for security
    const { companyId, supabase, userId } = await getAuthContext();

    // Cannot archive signed contracts (business rule)
    const { data: contract } = await supabase
      .from("contracts")
      .select("status")
      .eq("id", contractId)
      .eq("company_id", companyId)
      .single();

    if (contract?.status === "signed" || contract?.status === "active") {
      return {
        success: false,
        error:
          "Cannot archive signed or active contracts. Signed contracts must be retained for records.",
      };
    }

    // Archive contract (soft delete)
    const now = new Date().toISOString();
    const scheduledDeletion = new Date(
      Date.now() + 90 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { error } = await supabase
      .from("contracts")
      .update({
        deleted_at: now,
        deleted_by: userId,
        archived_at: now,
        permanent_delete_scheduled_at: scheduledDeletion,
        status: "archived",
      })
      .eq("id", contractId)
      .eq("company_id", companyId);

    if (error) {
      console.error("Error archiving contract:", error);
      throw new Error("Failed to archive contract");
    }

    revalidatePath("/dashboard/work/contracts");
    revalidatePath("/dashboard/settings/archive");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to archive contract" };
  }
}

/**
 * Restore archived contract
 */
export async function restoreContract(
  contractId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get auth context for security
    const { companyId, supabase } = await getAuthContext();

    // Verify contract is archived
    const { data: contract } = await supabase
      .from("contracts")
      .select("deleted_at, status")
      .eq("id", contractId)
      .eq("company_id", companyId)
      .single();

    if (!contract?.deleted_at) {
      return { success: false, error: "Contract is not archived" };
    }

    // Restore contract
    const { error } = await supabase
      .from("contracts")
      .update({
        deleted_at: null,
        deleted_by: null,
        archived_at: null,
        permanent_delete_scheduled_at: null,
        status: contract.status === "archived" ? "draft" : contract.status,
      })
      .eq("id", contractId)
      .eq("company_id", companyId);

    if (error) {
      console.error("Error restoring contract:", error);
      throw new Error("Failed to restore contract");
    }

    revalidatePath("/dashboard/work/contracts");
    revalidatePath("/dashboard/settings/archive");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to restore contract" };
  }
}

/**
 * Delete a contract (legacy - deprecated)
 * @deprecated Use archiveContract() instead
 */
export async function deleteContract(
  contractId: string
): Promise<{ success: boolean; error?: string }> {
  return archiveContract(contractId);
}

/**
 * Send contract for signature
 */
export async function sendContract(
  contractId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get auth context for security
    const { companyId, supabase } = await getAuthContext();

    // Update status and record sent time (company-scoped for security via RLS)
    const { error } = await supabase
      .from("contracts")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", contractId)
      .eq("company_id", companyId);

    if (error) {
      console.error("Error sending contract:", error);
      throw new Error("Failed to send contract");
    }

    // Note: Email sending will be implemented in separate task
    // await sendContractEmail(contract);

    revalidatePath("/dashboard/work/contracts");
    revalidatePath(`/dashboard/work/contracts/${contractId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to send contract" };
  }
}

/**
 * Sign a contract (customer-facing action)
 */
export async function signContract(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const data = signContractSchema.parse({
      contractId: formData.get("contractId"),
      signature: formData.get("signature"),
      signerName: formData.get("signerName"),
      signerEmail: formData.get("signerEmail"),
      signerTitle: formData.get("signerTitle"),
      signerCompany: formData.get("signerCompany"),
      ipAddress: formData.get("ipAddress"),
    });

    // Update contract with signature
    // Note: This is customer-facing, no auth context needed (public action)
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Supabase client not configured");
    }

    const { error } = await supabase
      .from("contracts")
      .update({
        status: "signed",
        signature: data.signature,
        signer_name: data.signerName,
        signer_email: data.signerEmail,
        signer_title: data.signerTitle || null,
        signer_company: data.signerCompany || null,
        ip_address: data.ipAddress || null,
        signed_at: new Date().toISOString(),
      })
      .eq("id", data.contractId);

    if (error) {
      console.error("Error signing contract:", error);
      throw new Error("Failed to sign contract");
    }

    revalidatePath("/dashboard/work/contracts");
    revalidatePath(`/dashboard/work/contracts/${data.contractId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }
    return { success: false, error: "Failed to sign contract" };
  }
}

/**
 * Reject a contract
 */
export async function rejectContract(
  contractId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get auth context for security
    const { companyId, supabase } = await getAuthContext();

    // Update status (company-scoped for security via RLS)
    const { error } = await supabase
      .from("contracts")
      .update({
        status: "rejected",
        notes: reason || null,
      })
      .eq("id", contractId)
      .eq("company_id", companyId);

    if (error) {
      console.error("Error rejecting contract:", error);
      throw new Error("Failed to reject contract");
    }

    revalidatePath("/dashboard/work/contracts");
    revalidatePath(`/dashboard/work/contracts/${contractId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to reject contract" };
  }
}

/**
 * Track contract view (when customer opens the contract)
 */
export async function trackContractView(
  contractId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get contract to check current status (public action, no auth needed)
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Supabase client not configured");
    }

    const { data: contract, error: fetchError } = await supabase
      .from("contracts")
      .select("status")
      .eq("id", contractId)
      .single();

    if (fetchError) {
      console.error("Error fetching contract:", fetchError);
      throw new Error("Failed to track contract view");
    }

    // Only update to 'viewed' if currently 'sent'
    if (contract && contract.status === "sent") {
      const { error } = await supabase
        .from("contracts")
        .update({
          status: "viewed",
          viewed_at: new Date().toISOString(),
        })
        .eq("id", contractId);

      if (error) {
        console.error("Error updating contract view:", error);
        throw new Error("Failed to update contract view");
      }
    }

    revalidatePath("/dashboard/work/contracts");
    revalidatePath(`/dashboard/work/contracts/${contractId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to track contract view" };
  }
}
