/**
 * Equipment Details Page - Single Page with Collapsible Sections
 * Matches job details page pattern
 */

import { notFound, redirect } from "next/navigation";
import { EquipmentPageContent } from "@/components/work/equipment/equipment-page-content";
import { isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export default async function EquipmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: equipmentId } = await params;

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

  // Fetch equipment with all related data
  const { data: equipment, error: equipmentError } = await supabase
    .from("equipment")
    .select(`
      *,
      customer:customers!customer_id(*),
      property:properties!property_id(*),
      service_plan:service_plans!service_plan_id(*)
    `)
    .eq("id", equipmentId)
    .is("deleted_at", null)
    .single();

  if (equipmentError || !equipment) {
    return notFound();
  }

  if (equipment.company_id !== activeCompanyId) {
    return notFound();
  }

  // Get related data
  const customer = Array.isArray(equipment.customer) ? equipment.customer[0] : equipment.customer;
  const property = Array.isArray(equipment.property) ? equipment.property[0] : equipment.property;
  const servicePlan = Array.isArray(equipment.service_plan) ? equipment.service_plan[0] : equipment.service_plan;

  // Fetch service history from job_equipment junction table
  const { data: serviceHistory } = await supabase
    .from("job_equipment")
    .select(`
      *,
      job:jobs!job_id(id, job_number, title)
    `)
    .eq("equipment_id", equipmentId)
    .order("serviced_at", { ascending: false })
    .limit(20);

  // Fetch all related data
  const [
    { data: activities },
    { data: notes },
    { data: attachments },
  ] = await Promise.all([
    supabase
      .from("activity_log")
      .select("*, user:users!user_id(*)")
      .eq("entity_type", "equipment")
      .eq("entity_id", equipmentId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("notes")
      .select("*")
      .eq("entity_type", "equipment")
      .eq("entity_id", equipmentId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("attachments")
      .select("*")
      .eq("entity_type", "equipment")
      .eq("entity_id", equipmentId)
      .order("created_at", { ascending: false }),
  ]);

  const equipmentData = {
    equipment,
    customer,
    property,
    servicePlan,
    serviceHistory: serviceHistory || [],
    activities: activities || [],
    notes: notes || [],
    attachments: attachments || [],
  };

  return (
    <div className="flex h-full w-full flex-col overflow-auto">
      <EquipmentPageContent entityData={equipmentData} />
    </div>
  );
}





