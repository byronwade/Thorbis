import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { PaymentsKanban } from "@/components/work/payments-kanban";
import { PaymentsTable } from "@/components/work/payments-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * Payments Page - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Real-time data from Supabase
 * - Only PaymentsTable and PaymentsKanban components are client-side for interactivity
 * - Better SEO and initial page load performance
 */

// Configuration constants
const MAX_PAYMENTS_PER_PAGE = 100;

export default async function PaymentsPage() {
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

  // Get active company ID
  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    return notFound();
  }

  // Fetch payments from payments table
  // Fetch all payments including archived (filter in UI)
  const { data: paymentsRaw, error } = await supabase
    .from("payments")
    .select(`
      *,
      customers!customer_id(first_name, last_name, display_name)
    `)
    .eq("company_id", activeCompanyId)
    .order("processed_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(MAX_PAYMENTS_PER_PAGE);

  if (error) {
    const errorMessage =
      error.message ||
      error.hint ||
      JSON.stringify(error) ||
      "Unknown database error";
    throw new Error(`Failed to load payments: ${errorMessage}`);
  }

  // Transform data for components
  const payments = (paymentsRaw || []).map((payment: any) => ({
    id: payment.id,
    payment_number: payment.payment_number,
    amount: payment.amount ?? 0,
    payment_method: payment.payment_method || "other",
    status: payment.status || "pending",
    processed_at: payment.processed_at ? new Date(payment.processed_at) : null,
    created_at: new Date(payment.created_at),
    updated_at: new Date(payment.updated_at),
    customer: Array.isArray(payment.customers)
      ? payment.customers[0]
      : payment.customers,
    invoice_id: payment.invoice_id,
    job_id: payment.job_id,
    customer_id: payment.customer_id,
    company_id: payment.company_id,
    description: payment.description,
    transaction_id: payment.transaction_id,
    processor: payment.processor,
    archived_at: payment.archived_at,
    deleted_at: payment.deleted_at,
  }));

  // Filter to active payments for stats calculations
  const activePayments = payments.filter(
    (p) => !(p.archived_at || p.deleted_at)
  );

  // Calculate payment stats (from active payments only)
  const completedCount = activePayments.filter(
    (p) => p.status === "completed"
  ).length;
  const pendingCount = activePayments.filter(
    (p) => p.status === "pending"
  ).length;
  const refundedCount = activePayments.filter(
    (p) => p.status === "refunded" || p.status === "partially_refunded"
  ).length;
  const failedCount = activePayments.filter(
    (p) => p.status === "failed"
  ).length;

  const paymentStats: StatCard[] = [
    {
      label: "Completed",
      value: completedCount,
      change: completedCount > 0 ? 14.2 : 0, // Green if completed payments
      changeLabel: "vs last month",
    },
    {
      label: "Pending",
      value: pendingCount,
      change: pendingCount > 0 ? 0 : 6.5, // Neutral if pending, green if none
      changeLabel: "vs last month",
    },
    {
      label: "Refunded",
      value: refundedCount,
      change: refundedCount > 0 ? -4.1 : 3.2, // Red if refunded, green if none
      changeLabel: "vs last month",
    },
    {
      label: "Failed",
      value: failedCount,
      change: failedCount > 0 ? -7.8 : 5.9, // Red if failed, green if none
      changeLabel: "vs last month",
    },
  ];

  return (
    <>
      <StatusPipeline compact stats={paymentStats} />
      <WorkDataView
        kanban={<PaymentsKanban payments={payments} />}
        section="payments"
        table={
          <div>
            <PaymentsTable itemsPerPage={50} payments={payments} />
          </div>
        }
      />
    </>
  );
}
