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
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { InvoicesKanban } from "@/components/work/invoices-kanban";
import { type Invoice, InvoicesTable } from "@/components/work/invoices-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { WorkPageLayout } from "@/components/work/work-page-layout";
import {
  getActiveCompanyId,
  isActiveCompanyOnboardingComplete,
} from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0; // Disable caching - always fetch fresh data
export const dynamic = "force-dynamic"; // Force dynamic rendering

// Configuration constants
const MAX_INVOICES_PER_PAGE = 10_000; // Fetch all invoices for virtualization

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

  // Fetch ALL invoices from Supabase with customer details
  // Including archived invoices - filtering is handled client-side
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

  // Debug logging (shows in terminal)
  console.log("📊 SERVER: Fetched invoices count:", invoicesRaw?.length || 0);
  console.log(
    "📊 SERVER: First 3 invoice numbers:",
    invoicesRaw?.slice(0, 3).map((i: any) => i.invoice_number)
  );

  // Map database statuses to display statuses
  const mapStatus = (
    dbStatus: string
  ): "paid" | "pending" | "draft" | "overdue" => {
    switch (dbStatus) {
      case "draft":
        return "draft";
      case "sent":
        return "pending";
      case "partial":
        return "pending"; // Partially paid = still pending
      case "paid":
        return "paid";
      case "past_due":
        return "overdue";
      default:
        return "pending";
    }
  };

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
    status: mapStatus(inv.status),
    archived_at: inv.archived_at,
    deleted_at: inv.deleted_at,
  }));

  // Calculate invoice stats from RAW data (more accurate)
  // Only count non-archived invoices in stats
  const activeInvoices =
    invoicesRaw?.filter((inv: any) => !(inv.archived_at || inv.deleted_at)) ||
    [];

  const draftInvoices = activeInvoices.filter(
    (inv: any) => inv.status === "draft"
  );
  const pendingInvoices = activeInvoices.filter(
    (inv: any) => inv.status === "sent" || inv.status === "partial"
  );
  const paidInvoices = activeInvoices.filter(
    (inv: any) => inv.status === "paid"
  );
  const overdueInvoices = activeInvoices.filter(
    (inv: any) => inv.status === "past_due"
  );

  const draftCount = draftInvoices.length;
  const pendingCount = pendingInvoices.length;
  const paidCount = paidInvoices.length;
  const overdueCount = overdueInvoices.length;

  // Use paid_amount for actual revenue, balance_amount for pending/overdue
  const totalRevenue = paidInvoices.reduce(
    (sum: number, inv: any) => sum + (inv.paid_amount || 0),
    0
  );
  const pendingRevenue = pendingInvoices.reduce(
    (sum: number, inv: any) =>
      sum + (inv.balance_amount || inv.total_amount || 0),
    0
  );
  const overdueRevenue = overdueInvoices.reduce(
    (sum: number, inv: any) =>
      sum + (inv.balance_amount || inv.total_amount || 0),
    0
  );
  const draftRevenue = draftInvoices.reduce(
    (sum: number, inv: any) => sum + (inv.total_amount || 0),
    0
  );

  // Debug logging for stats
  console.log("💰 INVOICE STATS:", {
    draft: { count: draftCount, amount: `$${(draftRevenue / 100).toFixed(2)}` },
    pending: {
      count: pendingCount,
      amount: `$${(pendingRevenue / 100).toFixed(2)}`,
    },
    paid: { count: paidCount, amount: `$${(totalRevenue / 100).toFixed(2)}` },
    overdue: {
      count: overdueCount,
      amount: `$${(overdueRevenue / 100).toFixed(2)}`,
    },
    total: invoicesRaw?.length || 0,
  });

  const invoiceStats: StatCard[] = [
    {
      label: "Draft",
      value:
        draftCount > 0
          ? `${draftCount} ($${(draftRevenue / 100).toLocaleString()})`
          : "0",
      change: 0,
      changeLabel: draftCount > 0 ? "ready to send" : "no drafts",
    },
    {
      label: "Pending",
      value: `$${(pendingRevenue / 100).toLocaleString()}`,
      change: 0,
      changeLabel: `${pendingCount} invoice${pendingCount !== 1 ? "s" : ""}`,
    },
    {
      label: "Paid",
      value: `$${(totalRevenue / 100).toLocaleString()}`,
      change: paidCount > 0 ? 12.4 : 0,
      changeLabel: `${paidCount} invoice${paidCount !== 1 ? "s" : ""}`,
    },
    {
      label: "Overdue",
      value:
        overdueCount > 0 ? `$${(overdueRevenue / 100).toLocaleString()}` : "$0",
      change: overdueCount > 0 ? -15.2 : 0, // NEGATIVE = BAD (red)
      changeLabel:
        overdueCount > 0
          ? `${overdueCount} need${overdueCount === 1 ? "s" : ""} attention`
          : "all current",
    },
    {
      label: "Total Invoices",
      value: activeInvoices.length,
      change: 0,
      changeLabel: "active",
    },
  ];

  return (
    <WorkPageLayout stats={<StatusPipeline compact stats={invoiceStats} />}>
      <WorkDataView
        kanban={<InvoicesKanban invoices={invoices} />}
        section="invoices"
        table={
          <InvoicesTable
            enableVirtualization={true}
            invoices={invoices}
            itemsPerPage={50}
          />
        }
      />
    </WorkPageLayout>
  );
}
