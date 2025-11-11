/**
 * Estimate Details Page - Single Page with Collapsible Sections
 * Matches job details page pattern
 */

import { notFound, redirect } from "next/navigation";
import { EstimatePageContent } from "@/components/work/estimates/estimate-page-content";
import { isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export default async function EstimateDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: estimateId } = await params;

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

  // Fetch estimate with all related data
  const { data: estimate, error: estimateError } = await supabase
    .from("estimates")
    .select(`
      *,
      customer:customers!customer_id(*),
      job:jobs!job_id(*),
      invoice:invoices!estimate_id(*)
    `)
    .eq("id", estimateId)
    .is("deleted_at", null)
    .single();

  if (estimateError || !estimate) {
    return notFound();
  }

  if (estimate.company_id !== activeCompanyId) {
    return notFound();
  }

  // Get related data
  const customer = Array.isArray(estimate.customer) ? estimate.customer[0] : estimate.customer;
  const job = Array.isArray(estimate.job) ? estimate.job[0] : estimate.job;
  const invoice = Array.isArray(estimate.invoice) ? estimate.invoice[0] : estimate.invoice;

  // Fetch all related data
  const [
    { data: activities },
    { data: notes },
    { data: attachments },
  ] = await Promise.all([
    supabase
      .from("activity_log")
      .select("*, user:users!user_id(*)")
      .eq("entity_type", "estimate")
      .eq("entity_id", estimateId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("notes")
      .select("*")
      .eq("entity_type", "estimate")
      .eq("entity_id", estimateId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("attachments")
      .select("*")
      .eq("entity_type", "estimate")
      .eq("entity_id", estimateId)
      .order("created_at", { ascending: false }),
  ]);

  const estimateData = {
    estimate,
    customer,
    job,
    invoice,
    activities: activities || [],
    notes: notes || [],
    attachments: attachments || [],
  };

  return (
    <div className="flex h-full w-full flex-col overflow-auto">
      <EstimatePageContent entityData={estimateData} />
    </div>
  );
}





