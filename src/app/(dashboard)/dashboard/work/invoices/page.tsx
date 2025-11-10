/**
 * Invoices Page - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Real-time data from Supabase
 * - Only InvoicesTable component is client-side for interactivity
 * - Better SEO and initial page load performance
 * - Matches jobs page structure: stats pipeline + table
 */

import { notFound, redirect } from "next/navigation";
import { InvoiceStatusPipeline } from "@/components/invoices/invoice-status-pipeline";
import { InvoicesKanban } from "@/components/work/invoices-kanban";
import { type Invoice, InvoicesTable } from "@/components/work/invoices-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { WorkViewSwitcher } from "@/components/work/work-view-switcher";
import {
  getActiveCompanyId,
  isActiveCompanyOnboardingComplete,
} from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

// Configuration constants
const MAX_INVOICES_PER_PAGE = 100;

export default async function InvoicesPage() {
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  // Get authenticated user
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

  // Fetch invoices from Supabase with customer details
  const { data: invoicesRaw, error } = await supabase
    .from("invoices")
    .select(`
      *,
      customer:customers!customer_id(
        first_name,
        last_name,
        display_name,
        email
      )
    `)
    .eq("company_id", activeCompanyId)
    .order("created_at", { ascending: false })
    .limit(MAX_INVOICES_PER_PAGE);

  if (error) {
    const errorMessage =
      error.message || JSON.stringify(error) || "Unknown database error";
    throw new Error(`Failed to load invoices: ${errorMessage}`);
  }

  // Transform for table component
  const invoices: Invoice[] = (invoicesRaw || []).map((inv: any) => ({
    id: inv.id,
    invoiceNumber: inv.invoice_number,
    customer:
      inv.customer?.display_name ||
      `${inv.customer?.first_name || ""} ${inv.customer?.last_name || ""}`.trim() ||
      "Unknown Customer",
    date: new Date(inv.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    dueDate: inv.due_date
      ? new Date(inv.due_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "-",
    amount: inv.total_amount,
    status: inv.status as "paid" | "pending" | "draft" | "overdue",
  }));

  return (
    <div className="flex h-full flex-col">
      <InvoiceStatusPipeline invoices={invoices} />
      <div className="flex items-center justify-end gap-2 px-4 py-3">
        <WorkViewSwitcher section="invoices" />
      </div>
      <div className="flex-1 overflow-auto">
        <WorkDataView
          kanban={<InvoicesKanban invoices={invoices} />}
          section="invoices"
          table={<InvoicesTable invoices={invoices} itemsPerPage={50} />}
        />
      </div>
    </div>
  );
}
