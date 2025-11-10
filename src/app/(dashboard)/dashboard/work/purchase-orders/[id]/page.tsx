/**
 * Purchase Order Details Page
 *
 * Displays comprehensive purchase order information using unified layout system
 * Matches job, customer, appointment, team member page patterns
 */

import { notFound } from "next/navigation";
import { DetailPageLayout } from "@/components/layout/detail-page-layout";
import { PurchaseOrderStatsBar } from "@/components/work/purchase-order-stats-bar";
import { PurchaseOrderPageContent } from "@/components/work/purchase-order-page-content";
import { createClient } from "@/lib/supabase/server";

export default async function PurchaseOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: poId } = await params;

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

  // Fetch related data
  const [
    { data: lineItems },
    { data: job },
    { data: activities },
  ] = await Promise.all([
    supabase
      .from("purchase_order_line_items")
      .select("*")
      .eq("purchase_order_id", poId)
      .order("created_at", { ascending: true }),

    po.job_id
      ? supabase
          .from("jobs")
          .select("id, job_number, title")
          .eq("id", po.job_id)
          .single()
      : Promise.resolve({ data: null, error: null }),

    supabase
      .from("activity_log")
      .select("*, user:users(*)")
      .eq("entity_type", "purchase_order")
      .eq("entity_id", poId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  // Calculate metrics
  const totalAmount = po.total_amount || 0;
  const lineItemCount = lineItems?.length || 0;
  const daysUntilDelivery = po.expected_delivery
    ? Math.ceil((new Date(po.expected_delivery).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
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
    lineItems: lineItems || [],
    activities: activities || [],
  };

  return (
    <DetailPageLayout
      entityId={poId}
      entityType="purchase-order"
      entityData={purchaseOrderData}
      metrics={metrics}
      StatsBarComponent={PurchaseOrderStatsBar}
      ContentComponent={PurchaseOrderPageContent}
    />
  );
}
