"use server";

/**
 * Server Actions for Job Signatures
 *
 * Handles digital signature capture and storage with:
 * - Server-side validation using Zod
 * - Signature verification
 * - Timestamp and IP logging
 * - Customer and technician signatures
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import {
  jobSignatureInsertSchema,
  jobSignatureUpdateSchema,
  type JobSignatureInsert,
} from "@/lib/validations/database-schemas";

// ============================================================================
// CREATE SIGNATURE
// ============================================================================

export async function createJobSignature(
  data: Omit<JobSignatureInsert, "company_id" | "signed_at" | "ip_address">
): Promise<{ success: boolean; error?: string; signatureId?: string }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    // Get authenticated user (may not be required for customer signatures)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get company ID from job
    const { data: job } = await supabase
      .from("jobs")
      .select("company_id")
      .eq("id", data.job_id)
      .single();

    if (!job) {
      return { success: false, error: "Job not found" };
    }

    // Get IP address
    const headersList = await headers();
    const ipAddress =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    // Get user agent
    const userAgent = headersList.get("user-agent") || "unknown";

    // Generate signature hash for verification (SHA-256 of signature data)
    const signatureHash = await generateSignatureHash(data.signature_data_url);

    // Create signature record
    const signatureData: JobSignatureInsert = {
      ...data,
      company_id: job.company_id,
      signed_at: new Date(),
      ip_address: ipAddress,
      user_agent: userAgent,
      signature_hash: signatureHash,
    };

    const validated = jobSignatureInsertSchema.parse(signatureData);

    const { data: signature, error } = await supabase
      .from("job_signatures")
      .insert(validated)
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    // Update job with signature reference
    if (data.signature_type === "customer") {
      await supabase
        .from("jobs")
        .update({
          customer_signature: { id: signature.id },
          customer_approval_status: "approved",
          customer_approval_timestamp: new Date().toISOString(),
        })
        .eq("id", data.job_id);
    }

    revalidatePath(`/dashboard/work/${data.job_id}`);
    return { success: true, signatureId: signature.id };
  } catch (error) {
    console.error("Create signature error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create signature",
    };
  }
}

// ============================================================================
// VERIFY SIGNATURE
// ============================================================================

export async function verifyJobSignature(
  signatureId: string
): Promise<{ success: boolean; error?: string; isValid?: boolean }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get signature
    const { data: signature } = await supabase
      .from("job_signatures")
      .select("*")
      .eq("id", signatureId)
      .single();

    if (!signature) {
      return { success: false, error: "Signature not found" };
    }

    // Verify hash
    const currentHash = await generateSignatureHash(
      signature.signature_data_url
    );
    const isValid = currentHash === signature.signature_hash;

    // Update verification status
    const { error } = await supabase
      .from("job_signatures")
      .update({
        is_verified: isValid,
        verified_at: new Date().toISOString(),
        verified_by: user.id,
      })
      .eq("id", signatureId);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/work/${signature.job_id}`);
    return { success: true, isValid };
  } catch (error) {
    console.error("Verify signature error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to verify signature",
    };
  }
}

// ============================================================================
// DELETE SIGNATURE
// ============================================================================

export async function deleteJobSignature(
  signatureId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get signature
    const { data: signature } = await supabase
      .from("job_signatures")
      .select("id, job_id, company_id")
      .eq("id", signatureId)
      .single();

    if (!signature) {
      return { success: false, error: "Signature not found" };
    }

    // Check if user is admin
    const { data: teamMember } = await supabase
      .from("team_members")
      .select("role_id, custom_roles!role_id(name, is_system)")
      .eq("user_id", user.id)
      .eq("company_id", signature.company_id)
      .single();

    const role = Array.isArray(teamMember?.custom_roles)
      ? teamMember.custom_roles[0]
      : teamMember?.custom_roles;

    const isAdmin =
      role?.name === "Admin" || role?.name === "Owner" || role?.is_system;

    if (!isAdmin) {
      return {
        success: false,
        error: "Only admins can delete signatures",
      };
    }

    const { error } = await supabase
      .from("job_signatures")
      .delete()
      .eq("id", signatureId);

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/work/${signature.job_id}`);
    return { success: true };
  } catch (error) {
    console.error("Delete signature error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete signature",
    };
  }
}

// ============================================================================
// GET SIGNATURES BY TYPE
// ============================================================================

export async function getSignaturesByType(
  jobId: string,
  signatureType: string
): Promise<{
  success: boolean;
  error?: string;
  signatures?: any[];
}> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    const { data: signatures, error } = await supabase
      .from("job_signatures")
      .select("*")
      .eq("job_id", jobId)
      .eq("signature_type", signatureType)
      .order("signed_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, signatures: signatures || [] };
  } catch (error) {
    console.error("Get signatures error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get signatures",
    };
  }
}

// ============================================================================
// HELPER: Generate Signature Hash
// ============================================================================

async function generateSignatureHash(signatureDataUrl: string): Promise<string> {
  // In a real implementation, use crypto.subtle.digest
  // For now, return a simple hash
  const encoder = new TextEncoder();
  const data = encoder.encode(signatureDataUrl);

  if (typeof crypto !== "undefined" && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Fallback for environments without crypto.subtle
  return Buffer.from(signatureDataUrl).toString("base64").substring(0, 64);
}
