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
import { type Invoice, InvoicesTable } from "@/components/work/invoices-table";
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

  // Get user's company
  const { data: teamMember } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .single();

  if (!teamMember?.company_id) {
    // User hasn't completed onboarding or doesn't have an active company membership
    // Redirect to onboarding for better UX
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
    .eq("company_id", teamMember.company_id)
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
    <>
      {/* Invoice Status Pipeline - Like JobStatusPipeline */}
      <InvoiceStatusPipeline invoices={invoices} />

      {/* Invoices Table - Client component handles sorting, filtering, pagination */}
      <div>
        <InvoicesTable invoices={invoices} itemsPerPage={50} />
      </div>
    </>
  );
}

// Old mock data below - will be removed
const OLD_mockInvoices = [
  {
    id: "1",
    invoiceNumber: "INV-2025-001",
    customer: "Acme Corp",
    date: "Jan 15, 2025",
    dueDate: "Feb 14, 2025",
    amount: 250_000,
    status: "paid",
  },
  {
    id: "2",
    invoiceNumber: "INV-2025-002",
    customer: "Tech Solutions",
    date: "Jan 18, 2025",
    dueDate: "Feb 17, 2025",
    amount: 375_000,
    status: "pending",
  },
  {
    id: "3",
    invoiceNumber: "INV-2025-003",
    customer: "Global Industries",
    date: "Jan 20, 2025",
    dueDate: "Feb 19, 2025",
    amount: 120_000,
    status: "draft",
  },
  {
    id: "4",
    invoiceNumber: "INV-2025-004",
    customer: "Summit LLC",
    date: "Jan 22, 2025",
    dueDate: "Feb 21, 2025",
    amount: 580_000,
    status: "pending",
  },
  {
    id: "5",
    invoiceNumber: "INV-2025-005",
    customer: "Mountain View Co",
    date: "Jan 10, 2025",
    dueDate: "Feb 9, 2025",
    amount: 100_000,
    status: "overdue",
  },
  {
    id: "6",
    invoiceNumber: "INV-2025-006",
    customer: "Pacific Corp",
    date: "Jan 25, 2025",
    dueDate: "Feb 24, 2025",
    amount: 425_000,
    status: "paid",
  },
  {
    id: "7",
    invoiceNumber: "INV-2025-007",
    customer: "Downtown Services",
    date: "Jan 28, 2025",
    dueDate: "Feb 27, 2025",
    amount: 195_000,
    status: "pending",
  },
];
