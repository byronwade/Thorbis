/**
 * Service Agreements Page - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Real-time data from Supabase
 * - Only ServiceAgreementsTable component is client-side for interactivity
 * - Better SEO and initial page load performance
 * - Matches jobs/invoices page structure: stats pipeline + table/kanban views
 */

import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { ServiceAgreementsKanban } from "@/components/work/service-agreements-kanban";
import { ServiceAgreementsTable } from "@/components/work/service-agreements-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export default async function ServiceAgreementsPage() {
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

  // Fetch service agreements from service_plans table where type = 'contract'
  // Fetch all agreements including archived (filter in UI)
  const { data: agreementsRaw, error } = await supabase
    .from("service_plans")
    .select(`
      *,
      customer:customers!customer_id(display_name, first_name, last_name)
    `)
    .eq("company_id", activeCompanyId)
    .eq("type", "contract")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching service agreements:", error);
  }

  // Transform data for table component
  const agreements = (agreementsRaw || []).map((agreement: any) => {
    const customer = Array.isArray(agreement.customer)
      ? agreement.customer[0]
      : agreement.customer;

    return {
      id: agreement.id,
      agreementNumber: agreement.plan_number,
      name: agreement.name,
      type: agreement.type || agreement.agreement_type || "Service Agreement",
      customer:
        customer?.display_name ||
        `${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() ||
        "Unknown Customer",
      status: agreement.status,
      value: agreement.price || agreement.value || 0,
      startDate: agreement.start_date
        ? new Date(agreement.start_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "",
      endDate: agreement.end_date
        ? new Date(agreement.end_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "",
      contractValue: agreement.price || 0,
      archived_at: agreement.archived_at,
      deleted_at: agreement.deleted_at,
    };
  });

  // Filter to active agreements for stats calculations
  const activeAgreements = agreements.filter((a) => !a.archived_at && !a.deleted_at);

  // Calculate service agreement stats (from active agreements only)
  const totalAgreements = activeAgreements.length;
  const activeCount = activeAgreements.filter((a) => a.status === "active").length;
  const draftCount = activeAgreements.filter((a) => a.status === "draft").length;
  const expiredCount = activeAgreements.filter((a) => a.status === "expired").length;
  const totalValue = activeAgreements
    .filter((a) => a.status === "active")
    .reduce((sum, a) => sum + (a.contractValue || 0), 0);
  const expiringSoon = activeAgreements.filter((a) => {
    if (!a.endDate) return false;
    const endDate = new Date(a.endDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  }).length;

  const agreementStats: StatCard[] = [
    {
      label: "Active Agreements",
      value: activeCount,
      change: activeCount > 0 ? 12.6 : 0, // Green if active agreements exist
      changeLabel: `${activeCount} active`,
    },
    {
      label: "Pending Signatures",
      value: draftCount,
      change: draftCount > 0 ? 0 : 4.9, // Neutral if drafts exist, green if none
      changeLabel: "awaiting customer",
    },
    {
      label: "Expiring Soon",
      value: expiringSoon,
      change: expiringSoon > 0 ? -6.2 : 3.8, // Red if expiring, green if none
      changeLabel: expiringSoon > 0 ? "within 30 days" : "all current",
    },
    {
      label: "Total Value",
      value: `$${(totalValue / 100).toLocaleString()}`,
      change: totalValue > 0 ? 10.4 : 0, // Green if value exists
      changeLabel: "annual contract value",
    },
    {
      label: "Total Agreements",
      value: totalAgreements,
      change: totalAgreements > 0 ? 8.1 : 0, // Green if agreements exist
      changeLabel: "all agreements",
    },
  ];

  return (
    <>
      <StatusPipeline compact stats={agreementStats} />
      <WorkDataView
        kanban={<ServiceAgreementsKanban agreements={agreements} />}
        section="serviceAgreements"
        table={
          <ServiceAgreementsTable agreements={agreements} itemsPerPage={50} />
        }
      />
    </>
  );
}
