import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * ContractsStats - Async Server Component
 *
 * Fetches and displays contracts statistics.
 * This streams in first, before the table/kanban.
 */
export async function ContractsStats() {
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

  // Fetch contracts for stats (only need status and archived fields)
  const { data: contractsRaw, error } = await supabase
    .from("contracts")
    .select("id, status, archived_at, deleted_at, created_at, expires_at")
    .eq("company_id", activeCompanyId)
    .order("created_at", { ascending: false });

  if (error) {
    // Return empty stats on error
    return <StatusPipeline compact stats={[]} />;
  }

  // Filter to active contracts for stats calculations
  const activeContracts = (contractsRaw || []).filter(
    (c: any) => !(c.archived_at || c.deleted_at)
  );

  // Calculate contract stats (from active contracts only)
  const totalContracts = activeContracts.length;
  const signedCount = activeContracts.filter(
    (c: any) => c.status === "signed"
  ).length;
  const pendingCount = activeContracts.filter(
    (c: any) => c.status === "sent" || c.status === "viewed"
  ).length;
  const draftCount = activeContracts.filter(
    (c: any) => c.status === "draft"
  ).length;
  const expiredCount = activeContracts.filter(
    (c: any) => c.status === "expired"
  ).length;

  const CHANGE_PERCENTAGE_DRAFT_POSITIVE = 5.1;
  const CHANGE_PERCENTAGE_PENDING_POSITIVE = 6.8;
  const CHANGE_PERCENTAGE_SIGNED = 14.2;
  const CHANGE_PERCENTAGE_EXPIRED_NEGATIVE = -4.3;
  const CHANGE_PERCENTAGE_EXPIRED_POSITIVE = 2.7;
  const CHANGE_PERCENTAGE_TOTAL = 8.9;

  const contractStats: StatCard[] = [
    {
      label: "Draft",
      value: draftCount,
      change: draftCount > 0 ? 0 : CHANGE_PERCENTAGE_DRAFT_POSITIVE,
      changeLabel: "ready to send",
    },
    {
      label: "Awaiting Signature",
      value: pendingCount,
      change: pendingCount > 0 ? 0 : CHANGE_PERCENTAGE_PENDING_POSITIVE,
      changeLabel: `${pendingCount} pending`,
    },
    {
      label: "Signed",
      value: signedCount,
      change: signedCount > 0 ? CHANGE_PERCENTAGE_SIGNED : 0,
      changeLabel: `${Math.round((signedCount / (totalContracts || 1)) * 100)}% completion`,
    },
    {
      label: "Expired",
      value: expiredCount,
      change:
        expiredCount > 0
          ? CHANGE_PERCENTAGE_EXPIRED_NEGATIVE
          : CHANGE_PERCENTAGE_EXPIRED_POSITIVE,
      changeLabel:
        expiredCount > 0 ? `${expiredCount} expired` : "none expired",
    },
    {
      label: "Total Contracts",
      value: totalContracts,
      change: totalContracts > 0 ? CHANGE_PERCENTAGE_TOTAL : 0,
      changeLabel: "all contracts",
    },
  ];

  return <StatusPipeline compact stats={contractStats} />;
}
