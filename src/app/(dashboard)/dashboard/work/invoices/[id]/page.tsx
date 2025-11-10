/**
 * Invoice Details Page - Full-Screen Editable View
 *
 * Modern invoice interface with:
 * - Full-screen layout (no preview/edit toggle)
 * - Inline editing for all fields
 * - Real-time auto-save
 * - AppToolbar integration
 * - Adaptable for all construction industries
 *
 * Performance:
 * - Server Component wrapper
 * - Client Component for editor
 * - Auto-save debounced
 */

import { notFound, redirect } from "next/navigation";
import { InvoiceEditorWrapper } from "@/components/invoices/invoice-editor-wrapper";
import {
  getActiveCompanyId,
  isActiveCompanyOnboardingComplete,
} from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: "Invoice Details",
  };
}

export default async function InvoiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: invoiceId } = await params;

  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  // Check if active company has completed onboarding (has payment)
  const isOnboardingComplete = await isActiveCompanyOnboardingComplete();

  if (!isOnboardingComplete) {
    // User hasn't completed onboarding or doesn't have an active company with payment
    // Redirect to onboarding for better UX
    redirect("/dashboard/welcome");
  }

  // Get active company ID
  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    // Should not happen if onboarding is complete, but handle gracefully
    redirect("/dashboard/welcome");
  }

  // Fetch invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .single();

  if (invoiceError || !invoice) {
    console.error("Invoice fetch error:", invoiceError);
    return notFound();
  }

  // Verify company access
  if (invoice.company_id !== activeCompanyId) {
    return notFound();
  }

  // Fetch related data in parallel
  const [
    { data: customer },
    { data: company },
    { data: job },
    { data: property },
    { data: paymentMethods },
    { data: activities },
  ] = await Promise.all([
    // Fetch customer with full details
    supabase
      .from("customers")
      .select("*")
      .eq("id", invoice.customer_id)
      .single(),

    // Fetch company
    supabase
      .from("companies")
      .select("*")
      .eq("id", activeCompanyId)
      .single(),

    // Fetch job (if linked)
    invoice.job_id
      ? supabase
          .from("jobs")
          .select("id, job_number, title, property_id")
          .eq("id", invoice.job_id)
          .single()
      : Promise.resolve({ data: null, error: null }),

    // Fetch property (if job has one)
    invoice.job_id
      ? supabase
          .from("jobs")
          .select("property_id")
          .eq("id", invoice.job_id)
          .single()
          .then(async ({ data: jobData }) => {
            if (jobData?.property_id) {
              return supabase
                .from("properties")
                .select("*")
                .eq("id", jobData.property_id)
                .single();
            }
            return { data: null, error: null };
          })
      : Promise.resolve({ data: null, error: null }),

    // Fetch customer payment methods
    supabase
      .from("customer_payment_methods")
      .select("*")
      .eq("customer_id", invoice.customer_id)
      .eq("is_active", true)
      .order("is_default", { ascending: false }),

    // Fetch activity log for this invoice
    supabase
      .from("activity_log")
      .select(
        `
        *,
        user:users!user_id(
          id,
          email,
          first_name,
          last_name
        )
      `
      )
      .eq("entity_type", "invoice")
      .eq("entity_id", invoiceId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  return (
    <InvoiceEditorWrapper
      activities={activities || []}
      company={company}
      customer={customer}
      invoice={invoice}
      job={job}
      paymentMethods={paymentMethods || []}
      property={property}
    />
  );
}
