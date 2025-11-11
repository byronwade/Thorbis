import { notFound } from "next/navigation";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { type StatCard } from "@/components/ui/stats-cards";
import {
  type Contract,
  ContractsTable,
} from "@/components/work/contracts-table";
import { ContractsKanban } from "@/components/work/contracts-kanban";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * Contracts Page - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Real-time data from Supabase
 * - Only ContractsTable component is client-side for interactivity
 * - Better SEO and initial page load performance
 * - Matches jobs/invoices page structure: stats pipeline + table/kanban views
 */

export default async function ContractsPage() {
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

  // Fetch contracts from database - simplified query to test
  const { data: contractsRaw, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("company_id", activeCompanyId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contracts:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Error details:", error.details);
    console.error("Error hint:", error.hint);
  }

  let contracts: Contract[] = [];

  // Only process if we have data
  if (!error && contractsRaw) {
    // Fetch customers separately if we have customer IDs
    const customerIds = Array.from(
      new Set(
        contractsRaw
          .map((c: any) => c.customer_id)
          .filter(Boolean)
      )
    );

    let customersMap = new Map<string, any>();
    if (customerIds.length > 0) {
      const { data: customersData } = await supabase
        .from("customers")
        .select("id, display_name, first_name, last_name, email")
        .in("id", customerIds);

      if (customersData) {
        customersData.forEach((customer) => {
          customersMap.set(customer.id, customer);
        });
      }
    }

    // Transform data for table component
    contracts = contractsRaw.map((contract: any) => {
      const customer = contract.customer_id
        ? customersMap.get(contract.customer_id)
        : null;

      return {
        id: contract.id,
        contractNumber: contract.contract_number,
        customer:
          customer?.display_name ||
          `${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() ||
          customer?.email ||
          contract.signer_email ||
          contract.signer_name ||
          "Unknown",
        title: contract.title,
        date: new Date(contract.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        validUntil: contract.expires_at
          ? new Date(contract.expires_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "",
        status: contract.status as
          | "signed"
          | "sent"
          | "draft"
          | "viewed"
          | "expired",
        contractType: contract.contract_type || "custom",
        signerName: contract.signer_name || null,
      };
    });
  }

  // Calculate contract stats
  const totalContracts = contracts.length;
  const signedCount = contracts.filter((c) => c.status === "signed").length;
  const pendingCount = contracts.filter(
    (c) => c.status === "sent" || c.status === "viewed"
  ).length;
  const draftCount = contracts.filter((c) => c.status === "draft").length;
  const expiredCount = contracts.filter((c) => c.status === "expired").length;

  const contractStats: StatCard[] = [
    {
      label: "Draft",
      value: draftCount,
      change: draftCount > 0 ? 0 : 5.1, // Neutral if drafts exist, green if none
      changeLabel: "ready to send",
    },
    {
      label: "Awaiting Signature",
      value: pendingCount,
      change: pendingCount > 0 ? 0 : 6.8, // Neutral if pending, green if all signed
      changeLabel: `${pendingCount} pending`,
    },
    {
      label: "Signed",
      value: signedCount,
      change: signedCount > 0 ? 14.2 : 0, // Green if signed contracts exist
      changeLabel: `${Math.round((signedCount / (totalContracts || 1)) * 100)}% completion`,
    },
    {
      label: "Expired",
      value: expiredCount,
      change: expiredCount > 0 ? -4.3 : 2.7, // Red if expired, green if none
      changeLabel: expiredCount > 0 ? `${expiredCount} expired` : "none expired",
    },
    {
      label: "Total Contracts",
      value: totalContracts,
      change: totalContracts > 0 ? 8.9 : 0, // Green if contracts exist
      changeLabel: "all contracts",
    },
  ];

  return (
    <>
      <StatusPipeline compact stats={contractStats} />
      <WorkDataView
        kanban={<ContractsKanban contracts={contracts} />}
        section="contracts"
        table={<ContractsTable contracts={contracts} itemsPerPage={50} />}
      />
    </>
  );
}
