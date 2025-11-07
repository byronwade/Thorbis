"use server";

/**
 * Invoice Communications Server Actions
 *
 * Handles sending invoices and estimates via email:
 * - Send invoice to customer
 * - Send estimate to customer
 * - Track sent status
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Send invoice via email
 */
export async function sendInvoiceEmail(invoiceId: string) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get invoice with customer details
    const { data: invoice, error } = await supabase
      .from("invoices")
      .select(`
        *,
        customer:customers!customer_id(
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq("id", invoiceId)
      .single();

    if (error || !invoice) {
      return { success: false, error: "Invoice not found" };
    }

    if (!invoice.customer?.email) {
      return { success: false, error: "Customer has no email address" };
    }

    // TODO: Send actual email with Resend
    // For now, just update sent_at timestamp
    await supabase
      .from("invoices")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", invoiceId);

    revalidatePath(`/dashboard/customers/${invoice.customer_id}`);

    // Simulate email sending
    console.log(`Would send invoice ${invoice.invoice_number} to ${invoice.customer.email}`);

    return {
      success: true,
      message: `Invoice sent to ${invoice.customer.email}`,
    };
  } catch (error) {
    console.error("Error sending invoice:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send invoice",
    };
  }
}

/**
 * Send estimate via email
 */
export async function sendEstimateEmail(estimateId: string) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return { success: false, error: "Database connection failed" };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get estimate with customer details (using invoices table for now)
    const { data: estimate, error } = await supabase
      .from("invoices")
      .select(`
        *,
        customer:customers!customer_id(
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq("id", estimateId)
      .single();

    if (error || !estimate) {
      return { success: false, error: "Estimate not found" };
    }

    if (!estimate.customer?.email) {
      return { success: false, error: "Customer has no email address" };
    }

    // TODO: Send actual email with Resend
    // For now, just update sent_at timestamp
    await supabase
      .from("invoices")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", estimateId);

    revalidatePath(`/dashboard/customers/${estimate.customer_id}`);

    // Simulate email sending
    console.log(`Would send estimate to ${estimate.customer.email}`);

    return {
      success: true,
      message: `Estimate sent to ${estimate.customer.email}`,
    };
  } catch (error) {
    console.error("Error sending estimate:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send estimate",
    };
  }
}
