import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * EstimatesStats - Async Server Component
 *
 * Fetches and displays estimates statistics.
 * This streams in first, before the table/kanban.
 */
export async function EstimatesStats() {
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    return notFound();
  }

  // Fetch estimates for stats (only need status, amount, and archived fields)
  const { data: estimatesRaw, error } = await supabase
    .from("estimates")
    .select("id, status, total_amount, archived_at, deleted_at")
    .eq("company_id", activeCompanyId);

  if (error) {
    return <StatusPipeline compact stats={[]} />;
  }

  // Filter to active estimates for stats calculations
  const activeEstimates = (estimatesRaw || []).filter(
    (est: any) => !(est.archived_at || est.deleted_at)
  );

  // Calculate estimate stats
  const draftCount = activeEstimates.filter(
    (est: any) => est.status === "draft"
  ).length;
  const sentCount = activeEstimates.filter(
    (est: any) => est.status === "sent"
  ).length;
  const acceptedCount = activeEstimates.filter(
    (est: any) => est.status === "accepted"
  ).length;
  const declinedCount = activeEstimates.filter(
    (est: any) => est.status === "declined"
  ).length;

  const totalValue = activeEstimates.reduce(
    (sum: number, est: any) => sum + (est.total_amount || 0),
    0
  );
  const acceptedValue = activeEstimates
    .filter((est: any) => est.status === "accepted")
    .reduce((sum: number, est: any) => sum + (est.total_amount || 0), 0);
  const pendingValue = activeEstimates
    .filter((est: any) => est.status === "sent")
    .reduce((sum: number, est: any) => sum + (est.total_amount || 0), 0);

  const CHANGE_PERCENTAGE_DRAFT_POSITIVE = 4.8;
  const CHANGE_PERCENTAGE_SENT_POSITIVE = 7.2;
  const CHANGE_PERCENTAGE_ACCEPTED = 15.3;
  const CHANGE_PERCENTAGE_DECLINED_NEGATIVE = -5.4;
  const CHANGE_PERCENTAGE_DECLINED_POSITIVE = 3.1;
  const CHANGE_PERCENTAGE_TOTAL = 10.8;
  const CENTS_PER_DOLLAR = 100;

  const estimateStats: StatCard[] = [
    {
      label: "Draft",
      value: draftCount,
      change: draftCount > 0 ? 0 : CHANGE_PERCENTAGE_DRAFT_POSITIVE,
      changeLabel: "ready to send",
    },
    {
      label: "Sent",
      value: `$${(pendingValue / CENTS_PER_DOLLAR).toLocaleString()}`,
      change: sentCount > 0 ? 0 : CHANGE_PERCENTAGE_SENT_POSITIVE,
      changeLabel: `${sentCount} estimates`,
    },
    {
      label: "Accepted",
      value: `$${(acceptedValue / CENTS_PER_DOLLAR).toLocaleString()}`,
      change: acceptedCount > 0 ? CHANGE_PERCENTAGE_ACCEPTED : 0,
      changeLabel: `${acceptedCount} estimates`,
    },
    {
      label: "Declined",
      value: declinedCount,
      change:
        declinedCount > 0
          ? CHANGE_PERCENTAGE_DECLINED_NEGATIVE
          : CHANGE_PERCENTAGE_DECLINED_POSITIVE,
      changeLabel:
        declinedCount > 0 ? `${declinedCount} declined` : "none declined",
    },
    {
      label: "Total Value",
      value: `$${(totalValue / CENTS_PER_DOLLAR).toLocaleString()}`,
      change: totalValue > 0 ? CHANGE_PERCENTAGE_TOTAL : 0,
      changeLabel: "all estimates",
    },
  ];

  return <StatusPipeline compact stats={estimateStats} />;
}
