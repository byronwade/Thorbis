"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Server Actions for Contract Management
 *
 * These handle contract CRUD operations with proper validation
 * and support for both standalone contracts and contracts linked
 * to estimates/invoices for digital signature workflows.
 */

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

// Type exports
export type ContractInput = z.infer<typeof contractSchema>;
export type SignContractInput = z.infer<typeof signContractSchema>;

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

    // TODO: Insert into database
    // const contract = await db.insert(contracts).values({
    //   ...data,
    //   companyId: getCurrentCompanyId(),
    //   contractNumber: generateContractNumber(),
    //   status: 'draft',
    // }).returning();

    console.log("Creating contract:", data);

    revalidatePath("/dashboard/work/contracts");
    return {
      success: true,
      contractId: "new-contract-id", // Replace with actual ID from DB
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

    // TODO: Update in database
    // await db.update(contracts)
    //   .set({ ...data, updatedAt: new Date() })
    //   .where(eq(contracts.id, contractId));

    console.log("Updating contract:", contractId, data);

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
 * Delete a contract
 */
export async function deleteContract(
  contractId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Delete from database
    // await db.delete(contracts).where(eq(contracts.id, contractId));

    console.log("Deleting contract:", contractId);

    revalidatePath("/dashboard/work/contracts");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete contract" };
  }
}

/**
 * Send contract for signature
 */
export async function sendContract(
  contractId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Update status and send email
    // await db.update(contracts)
    //   .set({ status: 'sent', sentAt: new Date() })
    //   .where(eq(contracts.id, contractId));
    // await sendContractEmail(contract);

    console.log("Sending contract:", contractId);

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

    // TODO: Update contract with signature
    // await db.update(contracts)
    //   .set({
    //     status: 'signed',
    //     signature: data.signature,
    //     signerName: data.signerName,
    //     signerEmail: data.signerEmail,
    //     signerTitle: data.signerTitle,
    //     signerCompany: data.signerCompany,
    //     ipAddress: data.ipAddress,
    //     signedAt: new Date(),
    //   })
    //   .where(eq(contracts.id, data.contractId));

    console.log("Signing contract:", data.contractId);

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
    // TODO: Update status
    // await db.update(contracts)
    //   .set({
    //     status: 'rejected',
    //     notes: reason,
    //   })
    //   .where(eq(contracts.id, contractId));

    console.log("Rejecting contract:", contractId, reason);

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
    // TODO: Update viewedAt timestamp
    // const contract = await db.select().from(contracts).where(eq(contracts.id, contractId)).limit(1);
    // if (contract[0] && contract[0].status === 'sent') {
    //   await db.update(contracts)
    //     .set({ status: 'viewed', viewedAt: new Date() })
    //     .where(eq(contracts.id, contractId));
    // }

    console.log("Tracking contract view:", contractId);

    revalidatePath("/dashboard/work/contracts");
    revalidatePath(`/dashboard/work/contracts/${contractId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to track contract view" };
  }
}
