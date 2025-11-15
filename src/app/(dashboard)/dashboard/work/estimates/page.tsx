import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { EstimatesKanban } from "@/components/work/estimates-kanban";
import {
  type Estimate,
  EstimatesTable,
} from "@/components/work/estimates-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * Estimates Page - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Real-time data from Supabase
 * - Only EstimatesTable component is client-side for interactivity
 * - Better SEO and initial page load performance
 * - Matches jobs/invoices page structure: stats pipeline + table/kanban views
 */

export default async function EstimatesPage() {
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

  // Fetch estimates from database
  // Fetch all estimates including archived (filter in UI)
  const { data: estimatesRaw, error } = await supabase
    .from("estimates")
    .select(
      `
      id,
      estimate_number,
      title,
      status,
      total_amount,
      created_at,
      valid_until,
      archived_at,
      deleted_at,
      customers!customer_id(display_name, first_name, last_name)
    `
    )
    .eq("company_id", activeCompanyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching estimates:", error);
  }

  // Transform data for table component
  const estimates: Estimate[] = (estimatesRaw || []).map((est: any) => {
    const customer = Array.isArray(est.customers)
      ? est.customers[0]
      : est.customers;

    return {
      id: est.id,
      estimateNumber: est.estimate_number,
      customer:
        customer?.display_name ||
        `${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() ||
        "Unknown Customer",
      project: est.title,
      date: new Date(est.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      validUntil: est.valid_until
        ? new Date(est.valid_until).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "",
      amount: est.total_amount || 0,
      status: est.status as "accepted" | "sent" | "draft" | "declined",
      archived_at: est.archived_at,
      deleted_at: est.deleted_at,
    };
  });

  // Filter to active estimates for stats calculations
  const activeEstimates = estimates.filter(
    (est) => !(est.archived_at || est.deleted_at)
  );

  // Calculate estimate stats (from active estimates only)
  const draftCount = activeEstimates.filter(
    (est) => est.status === "draft"
  ).length;
  const sentCount = activeEstimates.filter(
    (est) => est.status === "sent"
  ).length;
  const acceptedCount = activeEstimates.filter(
    (est) => est.status === "accepted"
  ).length;
  const declinedCount = activeEstimates.filter(
    (est) => est.status === "declined"
  ).length;

  const totalValue = activeEstimates.reduce((sum, est) => sum + est.amount, 0);
  const acceptedValue = activeEstimates
    .filter((est) => est.status === "accepted")
    .reduce((sum, est) => sum + est.amount, 0);
  const pendingValue = activeEstimates
    .filter((est) => est.status === "sent")
    .reduce((sum, est) => sum + est.amount, 0);

  const estimateStats: StatCard[] = [
    {
      label: "Draft",
      value: draftCount,
      change: draftCount > 0 ? 0 : 4.8, // Neutral if drafts exist, green if none
      changeLabel: "ready to send",
    },
    {
      label: "Sent",
      value: `$${(pendingValue / 100).toLocaleString()}`,
      change: sentCount > 0 ? 0 : 7.2, // Neutral if sent, green if all closed
      changeLabel: `${sentCount} estimates`,
    },
    {
      label: "Accepted",
      value: `$${(acceptedValue / 100).toLocaleString()}`,
      change: acceptedCount > 0 ? 15.3 : 0, // Green if accepted estimates exist
      changeLabel: `${acceptedCount} estimates`,
    },
    {
      label: "Declined",
      value: declinedCount,
      change: declinedCount > 0 ? -5.4 : 3.1, // Red if declined, green if none
      changeLabel:
        declinedCount > 0 ? `${declinedCount} declined` : "none declined",
    },
    {
      label: "Total Value",
      value: `$${(totalValue / 100).toLocaleString()}`,
      change: totalValue > 0 ? 10.8 : 0, // Green if total value exists
      changeLabel: "all estimates",
    },
  ];

  return (
    <>
      <StatusPipeline compact stats={estimateStats} />
      <WorkDataView
        kanban={<EstimatesKanban estimates={estimates} />}
        section="estimates"
        table={<EstimatesTable estimates={estimates} itemsPerPage={50} />}
      />
    </>
  );
}
