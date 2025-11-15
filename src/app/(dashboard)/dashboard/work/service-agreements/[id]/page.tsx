/**
 * Service Agreement Details Page - Single Page with Collapsible Sections
 * Matches job details page pattern
 */

import { notFound, redirect } from "next/navigation";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import type { StatCard } from "@/components/ui/stats-cards";
import { ServiceAgreementPageContent } from "@/components/work/service-agreements/service-agreement-page-content";
import { isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { createClient } from "@/lib/supabase/server";

export default async function ServiceAgreementDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: agreementId } = await params;

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

  // Check if active company has completed onboarding
  const isOnboardingComplete = await isActiveCompanyOnboardingComplete();

  if (!isOnboardingComplete) {
    redirect("/dashboard/welcome");
  }

  // Get active company ID
  const { getActiveCompanyId } = await import("@/lib/auth/company-context");
  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    redirect("/dashboard/welcome");
  }

  // Note: Service agreements might be stored in service_plans table with type='contract'
  // or in a separate service_agreements table. Using service_plans for now.
  const { data: agreement, error: agreementError } = await supabase
    .from("service_plans")
    .select(`
      *,
      customer:customers!customer_id(*),
      property:properties!property_id(*)
    `)
    .eq("id", agreementId)
    .eq("type", "contract")
    .is("deleted_at", null)
    .single();

  if (agreementError || !agreement) {
    return notFound();
  }

  if (agreement.company_id !== activeCompanyId) {
    return notFound();
  }

  // Get related data
  const customer = Array.isArray(agreement.customer)
    ? agreement.customer[0]
    : agreement.customer;
  const property = Array.isArray(agreement.property)
    ? agreement.property[0]
    : agreement.property;

  // Fetch all related data (including generated invoices, jobs, and equipment)
  const [
    { data: generatedInvoices },
    { data: generatedJobs },
    { data: equipment },
    { data: activities },
    { data: notes },
    { data: attachments },
  ] = await Promise.all([
    // NEW: Fetch invoices generated from this service agreement
    supabase
      .from("invoices")
      .select(
        "id, invoice_number, title, total_amount, balance_amount, status, created_at"
      )
      .eq("company_id", activeCompanyId)
      .or(`metadata->>'service_agreement_id'.eq.${agreementId}`)
      .order("created_at", { ascending: false })
      .limit(10),

    // NEW: Fetch jobs generated from this service agreement
    supabase
      .from("jobs")
      .select("id, job_number, title, status, completed_at, created_at")
      .eq("job_service_agreement_id", agreementId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(10),

    // NEW: Fetch equipment covered by this service agreement
    property?.id
      ? supabase
          .from("equipment")
          .select("id, equipment_number, name, type, manufacturer, model")
          .eq("property_id", property.id)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),

    supabase
      .from("activity_log")
      .select("*, user:users!user_id(*)")
      .eq("entity_type", "service_agreement")
      .eq("entity_id", agreementId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("notes")
      .select("*")
      .eq("entity_type", "service_agreement")
      .eq("entity_id", agreementId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("attachments")
      .select("*")
      .eq("entity_type", "service_agreement")
      .eq("entity_id", agreementId)
      .order("created_at", { ascending: false }),
  ]);

  const agreementData = {
    agreement,
    customer,
    property,
    generatedInvoices: generatedInvoices || [], // NEW
    generatedJobs: generatedJobs || [], // NEW
    equipment: equipment || [], // NEW
    activities: activities || [],
    notes: notes || [],
    attachments: attachments || [],
  };

  const invoicesList = generatedInvoices || [];
  const jobsList = generatedJobs || [];
  const contractValue = agreement.contract_value ?? agreement.price ?? 0;
  const totalInvoiceAmount = invoicesList.reduce(
    (sum: number, invoice: any) => sum + (invoice.total_amount || 0),
    0
  );
  const outstandingBalance = invoicesList.reduce(
    (sum: number, invoice: any) => sum + (invoice.balance_amount || 0),
    0
  );
  const collectedAmount = Math.max(totalInvoiceAmount - outstandingBalance, 0);
  const renewalDateRaw = agreement.renewal_date || agreement.end_date;

  let renewalValue = "Not scheduled";
  let renewalChange: number | undefined;
  let renewalChangeLabel: string | undefined;

  if (renewalDateRaw) {
    const renewalDate = new Date(renewalDateRaw);
    if (!Number.isNaN(renewalDate.getTime())) {
      const diffDays = Math.ceil(
        (renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      renewalValue = formatDate(renewalDate, { preset: "short" });
      renewalChangeLabel =
        diffDays > 0
          ? `${diffDays} days left`
          : diffDays === 0
            ? "today"
            : `${Math.abs(diffDays)} days overdue`;

      if (diffDays > 30) {
        renewalChange = 6.2;
      } else if (diffDays >= 0) {
        renewalChange = -4.5;
      } else {
        renewalChange = -8.1;
      }
    }
  }

  const stats: StatCard[] = [
    {
      label: "Contract Value",
      value: formatCurrency(contractValue),
      change: contractValue > 0 ? 8.2 : 0,
      changeLabel: contractValue > 0 ? "total agreement" : "not set",
    },
    {
      label: "Collected",
      value: formatCurrency(collectedAmount),
      change: collectedAmount > 0 ? 6.4 : 0,
      changeLabel:
        collectedAmount > 0 ? "invoiced payments" : "no payments yet",
    },
    {
      label: "Outstanding",
      value: formatCurrency(outstandingBalance),
      change: outstandingBalance > 0 ? -6.5 : 5.1,
      changeLabel: outstandingBalance > 0 ? "balance due" : "paid in full",
    },
    {
      label: "Linked Jobs",
      value: jobsList.length,
      change: jobsList.length > 0 ? 4.8 : 0,
      changeLabel: jobsList.length > 0 ? "generated jobs" : "no jobs yet",
    },
    {
      label: "Next Renewal",
      value: renewalValue,
      change: renewalChange,
      changeLabel: renewalChangeLabel,
    },
  ];

  return (
    <ToolbarStatsProvider stats={stats}>
      <div className="flex h-full w-full flex-col overflow-auto">
        <div className="mx-auto w-full max-w-7xl">
          <ServiceAgreementPageContent entityData={agreementData} />
        </div>
      </div>
    </ToolbarStatsProvider>
  );
}
