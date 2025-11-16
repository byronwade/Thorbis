/**
 * Purchase Order Detail Data Component - PPR Enabled
 *
 * Async server component that fetches all purchase order data.
 * This component streams in after the shell renders.
 *
 * Fetches:
 * - Purchase order data
 * - Team member verification
 * - Line items
 * - Job data
 * - Estimate data (source)
 * - Invoice data (related)
 * - Activity log
 * - Attachments
 * - Requested by user
 * - Approved by user
 *
 * Total: 10 queries (optimized with Promise.all)
 */

import { notFound } from "next/navigation";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { PurchaseOrderPageContent } from "@/components/work/purchase-order-page-content";
import { generatePurchaseOrderStats } from "@/lib/stats/utils";
import { createClient } from "@/lib/supabase/server";

type PurchaseOrderDetailDataProps = {
  poId: string;
};

export async function PurchaseOrderDetailData({
  poId,
}: PurchaseOrderDetailDataProps) {
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

  // Get active company
  const { getActiveCompanyId } = await import("@/lib/auth/company-context");
  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    return notFound();
  }

  // Verify user access
  const { data: teamMember } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .eq("company_id", activeCompanyId)
    .eq("status", "active")
    .maybeSingle();

  if (!teamMember) {
    return notFound();
  }

  // Fetch purchase order
  const { data: po, error } = await supabase
    .from("purchase_orders")
    .select("*")
    .eq("id", poId)
    .eq("company_id", activeCompanyId)
    .single();

  if (error || !po) {
    return notFound();
  }

  // Fetch related data (including estimate and invoice for complete context)
  const [
    { data: lineItems },
    { data: job },
    { data: estimate },
    { data: invoice },
    { data: activities },
    { data: attachments },
    { data: requestedByUser },
    { data: approvedByUser },
  ] = await Promise.all([
    supabase
      .from("purchase_order_line_items")
      .select("*")
      .eq("purchase_order_id", poId)
      .order("created_at", { ascending: true }),

    po.job_id
      ? supabase
          .from("jobs")
          .select("id, job_number, title, status")
          .eq("id", po.job_id)
          .single()
      : Promise.resolve({ data: null, error: null }),

    // Fetch source estimate (if PO was created from an estimate)
    po.estimate_id
      ? supabase
          .from("estimates")
          .select("id, estimate_number, title, total_amount, status")
          .eq("id", po.estimate_id)
          .single()
      : Promise.resolve({ data: null, error: null }),

    // Fetch related invoice (if PO is for an invoice)
    po.invoice_id
      ? supabase
          .from("invoices")
          .select("id, invoice_number, title, total_amount, status")
          .eq("id", po.invoice_id)
          .single()
      : Promise.resolve({ data: null, error: null }),

    supabase
      .from("activity_log")
      .select("*, user:users(*)")
      .eq("entity_type", "purchase_order")
      .eq("entity_id", poId)
      .order("created_at", { ascending: false })
      .limit(20),

    supabase
      .from("attachments")
      .select("*")
      .eq("entity_type", "purchase_order")
      .eq("entity_id", poId)
      .order("created_at", { ascending: false }),

    po.requested_by
      ? supabase
          .from("users")
          .select("id, name, email")
          .eq("id", po.requested_by)
          .single()
      : Promise.resolve({ data: null, error: null }),

    po.approved_by
      ? supabase
          .from("users")
          .select("id, name, email")
          .eq("id", po.approved_by)
          .single()
      : Promise.resolve({ data: null, error: null }),
  ]);

  // Calculate metrics
  const totalAmount = po.total_amount || 0;
  const lineItemCount = lineItems?.length || 0;
  const daysUntilDelivery = po.expected_delivery
    ? Math.ceil(
        (new Date(po.expected_delivery).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : undefined;

  const metrics = {
    totalAmount,
    lineItemCount,
    status: po.status || "Unknown",
    daysUntilDelivery,
  };

  const purchaseOrderData = {
    purchaseOrder: po,
    job,
    estimate, // source estimate
    invoice, // related invoice
    lineItems: lineItems || [],
    activities: activities || [],
    attachments: attachments || [],
    requestedByUser: requestedByUser || null,
    approvedByUser: approvedByUser || null,
  };

  // Generate stats for toolbar
  const stats = generatePurchaseOrderStats(metrics);

  return (
    <ToolbarStatsProvider stats={stats}>
      <div className="flex h-full w-full flex-col overflow-auto">
        <div className="mx-auto w-full max-w-7xl">
          <PurchaseOrderPageContent
            entityData={purchaseOrderData}
            metrics={metrics}
          />
        </div>
      </div>
    </ToolbarStatsProvider>
  );
}
