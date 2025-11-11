/**
 * Service Agreement Details Page - Single Page with Collapsible Sections
 * Matches job details page pattern
 */

import { notFound, redirect } from "next/navigation";
import { ServiceAgreementPageContent } from "@/components/work/service-agreements/service-agreement-page-content";
import { isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
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
  const customer = Array.isArray(agreement.customer) ? agreement.customer[0] : agreement.customer;
  const property = Array.isArray(agreement.property) ? agreement.property[0] : agreement.property;

  // Fetch all related data
  const [
    { data: activities },
    { data: notes },
    { data: attachments },
  ] = await Promise.all([
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
    activities: activities || [],
    notes: notes || [],
    attachments: attachments || [],
  };

  return (
    <div className="flex h-full w-full flex-col overflow-auto">
      <ServiceAgreementPageContent entityData={agreementData} />
    </div>
  );
}





