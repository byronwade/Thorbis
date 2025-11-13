/**
 * Bulk Communications Actions
 *
 * Server actions for sending bulk emails for invoices and estimates
 * with progress tracking and error handling
 */

"use server";

import { revalidatePath } from "next/cache";
import type {
  BulkEmailConfig,
  BulkEmailResult,
} from "@/lib/email/bulk-email-sender";
import { sendBulkEmails } from "@/lib/email/bulk-email-sender";
import { EmailTemplate } from "@/lib/email/email-types";
import { createClient } from "@/lib/supabase/server";

type CustomerRecord = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  company_name: string | null;
};

interface BulkSendInvoicesResult {
  success: boolean;
  message: string;
  results?: BulkEmailResult;
  error?: string;
}

/**
 * Send multiple invoices via email
 *
 * @param invoiceIds - Array of invoice IDs to send
 * @param config - Optional configuration for batch processing
 * @returns Result with success/failure counts
 */
export async function bulkSendInvoices(
  invoiceIds: string[],
  config?: BulkEmailConfig
): Promise<BulkSendInvoicesResult> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return {
        success: false,
        message: "Database connection failed",
        error: "Unable to connect to database",
      };
    }

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "Authentication required",
        error: "You must be logged in to send invoices",
      };
    }

    // Get team member's company (limit to 1 in case of multiple memberships)
    const { data: teamMember, error: teamError } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(1)
      .single();

    if (teamError) {
      console.error("Team member query error:", teamError);
      return {
        success: false,
        message: "Failed to verify company membership",
        error: teamError.message,
      };
    }

    if (!teamMember?.company_id) {
      return {
        success: false,
        message: "Company association required",
        error: "You must be part of a company to send invoices",
      };
    }

    // Fetch all invoices with customer details
    const { data: invoices, error: fetchError } = await supabase
      .from("invoices")
      .select(
        `
          id,
          invoice_number,
          total_amount,
          status,
          company_id,
          customer_id,
          job_id,
          created_at,
          due_date,
          notes,
          customer:customers!customer_id(
            id,
            first_name,
            last_name,
            email,
            company_name
          )
        `
      )
      .in("id", invoiceIds)
      .eq("company_id", teamMember.company_id);

    if (fetchError || !invoices) {
      return {
        success: false,
        message: "Failed to fetch invoices",
        error: fetchError?.message || "Unable to retrieve invoices",
      };
    }

    const normalizedInvoices = invoices.map((invoice) => {
      const rawCustomer = invoice.customer as
        | CustomerRecord
        | CustomerRecord[]
        | null;
      const customer = Array.isArray(rawCustomer)
        ? rawCustomer[0] ?? null
        : rawCustomer;
      return { ...invoice, customer };
    });

    // Validate all invoices have customer emails
    const validInvoices = normalizedInvoices.filter((inv) => {
      if (!inv.customer?.email) {
        console.warn(
          `Invoice ${inv.invoice_number} has no customer email, skipping`
        );
        return false;
      }
      return true;
    });

    if (validInvoices.length === 0) {
      return {
        success: false,
        message: "No valid invoices to send",
        error: "None of the selected invoices have customer email addresses",
      };
    }

    // Import email template
    const { InvoiceEmail } = await import("@/lib/email/templates");

    // Prepare emails for bulk sending
    const emails = validInvoices.map((invoice) => {
      const customer = invoice.customer;
      const customerName =
        customer?.company_name ||
        `${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`.trim() ||
        "Valued Customer";
      return {
        to: customer!.email!,
        subject: `Invoice ${invoice.invoice_number}`,
        template: InvoiceEmail({
          invoiceNumber: invoice.invoice_number,
          customerName,
          invoiceDate:
            invoice.created_at ?? new Date().toISOString(),
          dueDate: invoice.due_date ?? undefined,
          totalAmount: invoice.total_amount ?? 0,
          notes: invoice.notes ?? undefined,
          invoiceUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/work/invoices/${invoice.id}`,
        }),
        templateType: EmailTemplate.INVOICE,
        itemId: invoice.id,
        tags: [
          { name: "invoice_id", value: invoice.id },
          { name: "invoice_number", value: invoice.invoice_number },
        ],
      };
    });

    // Send emails in bulk with rate limiting
    const results = await sendBulkEmails(emails, config);

    // Update sent_at timestamp for successful emails
    const successfulInvoiceIds = results.results
      .filter((r) => r.success && r.itemId)
      .map((r) => r.itemId!);

    if (successfulInvoiceIds.length > 0) {
      await supabase
        .from("invoices")
        .update({
          sent_at: new Date().toISOString(),
          status: "sent",
        })
        .in("id", successfulInvoiceIds);
    }

    // Revalidate paths
    revalidatePath("/dashboard/work/invoices");
    for (const id of successfulInvoiceIds) {
      revalidatePath(`/dashboard/work/invoices/${id}`);
    }

    // Build result message
    const skippedCount = invoices.length - validInvoices.length;
    let message = `Successfully sent ${results.successful} invoice${results.successful !== 1 ? "s" : ""}`;

    if (results.failed > 0) {
      message += `, ${results.failed} failed`;
    }

    if (skippedCount > 0) {
      message += `, ${skippedCount} skipped (no email)`;
    }

    return {
      success: results.allSuccessful,
      message,
      results,
    };
  } catch (error) {
    console.error("Error in bulkSendInvoices:", error);
    return {
      success: false,
      message: "Failed to send invoices",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send multiple estimates via email
 *
 * @param estimateIds - Array of estimate IDs to send
 * @param config - Optional configuration for batch processing
 * @returns Result with success/failure counts
 */
export async function bulkSendEstimates(
  estimateIds: string[],
  config?: BulkEmailConfig
): Promise<BulkSendInvoicesResult> {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return {
        success: false,
        message: "Database connection failed",
        error: "Unable to connect to database",
      };
    }

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "Authentication required",
        error: "You must be logged in to send estimates",
      };
    }

    // Get team member's company (limit to 1 in case of multiple memberships)
    const { data: teamMember, error: teamError } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(1)
      .single();

    if (teamError) {
      console.error("Team member query error:", teamError);
      return {
        success: false,
        message: "Failed to verify company membership",
        error: teamError.message,
      };
    }

    if (!teamMember?.company_id) {
      return {
        success: false,
        message: "Company association required",
        error: "You must be part of a company to send estimates",
      };
    }

    // Fetch all estimates with customer details
    // Note: Using invoices table as estimates might be stored there
    const { data: estimates, error: fetchError } = await supabase
      .from("invoices")
      .select(
        `
          id,
          invoice_number,
          total_amount,
          status,
          company_id,
          customer_id,
          job_id,
          created_at,
          due_date,
          notes,
          customer:customers!customer_id(
            id,
            first_name,
            last_name,
            email,
            company_name
          )
        `
      )
      .in("id", estimateIds)
      .eq("company_id", teamMember.company_id);

    if (fetchError || !estimates) {
      return {
        success: false,
        message: "Failed to fetch estimates",
        error: fetchError?.message || "Unable to retrieve estimates",
      };
    }

    const normalizedEstimates = estimates.map((estimate) => {
      const rawCustomer = estimate.customer as
        | CustomerRecord
        | CustomerRecord[]
        | null;
      const customer = Array.isArray(rawCustomer)
        ? rawCustomer[0] ?? null
        : rawCustomer;
      return { ...estimate, customer };
    });

    // Validate all estimates have customer emails
    const validEstimates = normalizedEstimates.filter((est) => {
      if (!est.customer?.email) {
        console.warn(
          `Estimate ${est.invoice_number} has no customer email, skipping`
        );
        return false;
      }
      return true;
    });

    if (validEstimates.length === 0) {
      return {
        success: false,
        message: "No valid estimates to send",
        error: "None of the selected estimates have customer email addresses",
      };
    }

    // Import email template
    const { EstimateEmail } = await import("@/lib/email/templates");

    // Prepare emails for bulk sending
    const emails = validEstimates.map((estimate) => {
      const customer = estimate.customer;
      const customerName =
        customer?.company_name ||
        `${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`.trim() ||
        "Valued Customer";
      return {
        to: customer!.email!,
        subject: `Estimate ${estimate.invoice_number}`,
        template: EstimateEmail({
          estimateNumber: estimate.invoice_number,
          customerName,
          estimateDate:
            estimate.created_at ?? new Date().toISOString(),
          validUntil: estimate.due_date ?? undefined,
          totalAmount: estimate.total_amount ?? 0,
          notes: estimate.notes ?? undefined,
          estimateUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/work/estimates/${estimate.id}`,
        }),
        templateType: EmailTemplate.ESTIMATE,
        itemId: estimate.id,
        tags: [
          { name: "estimate_id", value: estimate.id },
          { name: "estimate_number", value: estimate.invoice_number },
        ],
      };
    });

    // Send emails in bulk with rate limiting
    const results = await sendBulkEmails(emails, config);

    // Update sent_at timestamp for successful emails
    const successfulEstimateIds = results.results
      .filter((r) => r.success && r.itemId)
      .map((r) => r.itemId!);

    if (successfulEstimateIds.length > 0) {
      await supabase
        .from("invoices")
        .update({
          sent_at: new Date().toISOString(),
          status: "sent",
        })
        .in("id", successfulEstimateIds);
    }

    // Revalidate paths
    revalidatePath("/dashboard/work/estimates");
    for (const id of successfulEstimateIds) {
      revalidatePath(`/dashboard/work/estimates/${id}`);
    }

    // Build result message
    const skippedCount = estimates.length - validEstimates.length;
    let message = `Successfully sent ${results.successful} estimate${results.successful !== 1 ? "s" : ""}`;

    if (results.failed > 0) {
      message += `, ${results.failed} failed`;
    }

    if (skippedCount > 0) {
      message += `, ${skippedCount} skipped (no email)`;
    }

    return {
      success: results.allSuccessful,
      message,
      results,
    };
  } catch (error) {
    console.error("Error in bulkSendEstimates:", error);
    return {
      success: false,
      message: "Failed to send estimates",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
