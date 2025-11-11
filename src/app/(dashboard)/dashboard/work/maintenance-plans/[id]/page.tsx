/**
 * Maintenance Plan Details Page - Single Page with Collapsible Sections
 * Matches job details page pattern
 */

import { notFound, redirect } from "next/navigation";
import { MaintenancePlanPageContent } from "@/components/work/maintenance-plans/maintenance-plan-page-content";
import { isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export default async function MaintenancePlanDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: planId } = await params;

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

  // Fetch maintenance plan with all related data
  const { data: plan, error: planError } = await supabase
    .from("service_plans")
    .select(`
      *,
      customer:customers!customer_id(*),
      property:properties!property_id(*)
    `)
    .eq("id", planId)
    .is("deleted_at", null)
    .single();

  if (planError || !plan) {
    return notFound();
  }

  if (plan.company_id !== activeCompanyId) {
    return notFound();
  }

  // Get related data
  const customer = Array.isArray(plan.customer) ? plan.customer[0] : plan.customer;
  const property = Array.isArray(plan.property) ? plan.property[0] : plan.property;

  // Fetch equipment linked to this plan
  const { data: equipment } = await supabase
    .from("equipment")
    .select("*")
    .eq("service_plan_id", planId)
    .is("deleted_at", null);

  // Fetch all related data
  const [
    { data: activities },
    { data: notes },
    { data: attachments },
  ] = await Promise.all([
    supabase
      .from("activity_log")
      .select("*, user:users!user_id(*)")
      .eq("entity_type", "service_plan")
      .eq("entity_id", planId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("notes")
      .select("*")
      .eq("entity_type", "service_plan")
      .eq("entity_id", planId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("attachments")
      .select("*")
      .eq("entity_type", "service_plan")
      .eq("entity_id", planId)
      .order("created_at", { ascending: false }),
  ]);

  const planData = {
    plan,
    customer,
    property,
    equipment: equipment || [],
    activities: activities || [],
    notes: notes || [],
    attachments: attachments || [],
  };

  return (
    <div className="flex h-full w-full flex-col overflow-auto">
      <MaintenancePlanPageContent entityData={planData} />
    </div>
  );
}





