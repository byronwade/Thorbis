/**
 * Property Details Page - Server Component
 * Comprehensive single-page view matching Job Details architecture
 *
 * Features:
 * - Sticky stats bar with 4 KPIs
 * - Comprehensive data fetching (8+ queries)
 * - Collapsible accordion sections
 * - Google Maps integration
 * - Job history, equipment, schedules
 * - Customer info, communications
 * - Activity log, notes, attachments
 * - Inline editable metadata
 */

import { notFound, redirect } from "next/navigation";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { PropertyPageContent } from "@/components/properties/property-details/property-page-content";
import {
  getActiveCompanyId,
  isActiveCompanyOnboardingComplete,
} from "@/lib/auth/company-context";
import { generatePropertyStats } from "@/lib/stats/utils";
import { createClient } from "@/lib/supabase/server";

type PropertyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id: propertyId } = await params;
  console.log("🔍 Property page loading, ID:", propertyId);

  const supabase = await createClient();

  if (!supabase) {
    console.error("❌ No Supabase client");
    return notFound();
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("❌ No authenticated user");
    return notFound();
  }

  console.log("✅ User authenticated:", user.id);

  // Check if active company has completed onboarding
  const isOnboardingComplete = await isActiveCompanyOnboardingComplete();

  if (!isOnboardingComplete) {
    console.log("⚠️ Onboarding incomplete, redirecting");
    redirect("/dashboard/welcome");
  }

  // Get active company ID
  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    console.error("❌ No active company ID");
    redirect("/dashboard/welcome");
  }

  console.log("✅ Active company ID:", activeCompanyId);
  console.log("🔍 Querying property with:", { propertyId, activeCompanyId });

  // ==================================================================================
  // COMPREHENSIVE DATA FETCHING - Parallel queries for performance
  // ==================================================================================

  // First fetch property to check if it exists
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .eq("company_id", activeCompanyId)
    .single();

  if (propertyError) {
    console.error("❌ Property query error:", {
      message: propertyError.message || "Unknown error",
      code: propertyError.code,
      details: propertyError.details,
      hint: propertyError.hint,
      propertyId,
      activeCompanyId,
    });
    return notFound();
  }

  if (!property) {
    console.error("❌ Property not found:", propertyId);
    return notFound();
  }

  console.log("✅ Property loaded:", property.name || property.address);

  // Then fetch all related data in parallel (including financial data for Property 360° view)
  const [
    customerResult,
    jobsResult,
    equipmentResult,
    schedulesResult,
    estimatesResult,
    invoicesResult,
    maintenancePlansResult,
    communicationsResult,
    activitiesResult,
    notesResult,
    attachmentsResult,
  ] = await Promise.all([
    // 1. Customer info
    property.customer_id
      ? supabase
          .from("customers")
          .select("id, first_name, last_name, email, phone, company_name")
          .eq("id", property.customer_id)
          .single()
      : Promise.resolve({ data: null, error: null }),

    // 2. Jobs at this property
    supabase
      .from("jobs")
      .select(
        `
        id,
        job_number,
        title,
        status,
        priority,
        scheduled_start,
        scheduled_end,
        total_amount,
        paid_amount,
        created_at,
        customer:customers!customer_id (
          id,
          first_name,
          last_name
        ),
        assigned_user:users!assigned_to (
          id,
          name,
          avatar
        )
      `
      )
      .eq("property_id", propertyId)
      .eq("company_id", activeCompanyId)
      .order("created_at", { ascending: false }),

    // 3. Equipment installed at property
    supabase
      .from("equipment")
      .select("*")
      .eq("property_id", propertyId)
      .eq("company_id", activeCompanyId)
      .order("install_date", { ascending: false }),

    // 4. Upcoming schedules/appointments
    supabase
      .from("schedules")
      .select(`
        id,
        title,
        description,
        start_time,
        end_time,
        duration,
        status,
        type,
        job:jobs!job_id (
          id,
          job_number,
          title
        )
      `)
      .eq("property_id", propertyId)
      .gte("start_time", new Date().toISOString())
      .order("start_time", { ascending: true })
      .limit(20),

    // 5. NEW: Estimates for this property
    // Note: Will be filtered after jobs are fetched to include job-linked estimates
    supabase
      .from("estimates")
      .select(
        "id, estimate_number, title, total_amount, status, created_at, job_id, property_id"
      )
      .eq("company_id", activeCompanyId)
      .is("deleted_at", null)
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false })
      .limit(10),

    // 6. NEW: Invoices for this property
    // Note: Will be filtered after jobs are fetched to include job-linked invoices
    supabase
      .from("invoices")
      .select(
        "id, invoice_number, title, total_amount, balance_amount, status, created_at, job_id, property_id"
      )
      .eq("company_id", activeCompanyId)
      .or(`property_id.eq.${propertyId}`)
      .order("created_at", { ascending: false })
      .limit(10),

    // 7. NEW: Maintenance plans for this property
    supabase
      .from("service_plans")
      .select(
        "id, name, description, frequency, status, created_at, next_service_date"
      )
      .eq("property_id", propertyId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),

    // 8. Communications related to this property
    supabase
      .from("communications")
      .select("*")
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false })
      .limit(50),

    // 6. Activity log
    supabase
      .from("activity_log")
      .select("*, user:users(id, name, email, avatar)")
      .eq("entity_type", "property")
      .eq("entity_id", propertyId)
      .order("created_at", { ascending: false })
      .limit(50),

    // 7. Notes
    supabase
      .from("notes")
      .select("*, user:users(id, name, email, avatar)")
      .eq("entity_type", "property")
      .eq("entity_id", propertyId)
      .order("created_at", { ascending: false }),

    // 8. Attachments
    supabase
      .from("attachments")
      .select("*")
      .eq("entity_type", "property")
      .eq("entity_id", propertyId)
      .order("created_at", { ascending: false }),
  ]);

  // Extract customer data
  const customer = customerResult.data;
  console.log(
    "✅ Customer:",
    customer ? `${customer.first_name} ${customer.last_name}` : "None"
  );

  // Extract data from results
  const jobs = jobsResult.data || [];
  const equipment = equipmentResult.data || [];
  const schedules = schedulesResult.data || [];
  const estimates = estimatesResult.data || []; // NEW
  const invoices = invoicesResult.data || []; // NEW
  const maintenancePlans = maintenancePlansResult.data || []; // NEW
  const communications = communicationsResult.data || [];
  const activities = activitiesResult.data || [];
  const notes = notesResult.data || [];
  const attachments = attachmentsResult.data || [];

  // ==================================================================================
  // CALCULATE METRICS FOR STATS BAR
  // ==================================================================================

  // Total jobs count
  const totalJobs = jobs.length;

  // Active jobs count
  const activeJobs = jobs.filter(
    (job: any) =>
      job.status &&
      !["completed", "cancelled"].includes(job.status.toLowerCase())
  ).length;

  // Total revenue from all jobs (in cents)
  const totalRevenue = jobs.reduce(
    (sum: number, job: any) => sum + (job.total_amount || 0),
    0
  );

  // Last service date (most recent completed job)
  const completedJobs = jobs.filter(
    (job: any) => job.status?.toLowerCase() === "completed"
  );
  const lastServiceDate =
    completedJobs.length > 0 ? completedJobs[0]?.created_at || null : null;

  // Next scheduled date (earliest upcoming schedule)
  const nextScheduledDate =
    schedules.length > 0 ? schedules[0]?.start_time || null : null;

  // Equipment count
  const equipmentCount = equipment.length;

  const metrics = {
    totalJobs,
    activeJobs,
    totalRevenue,
    lastServiceDate,
    nextScheduledDate,
    equipmentCount,
  };

  // ==================================================================================
  // PREPARE DATA FOR PAGE CONTENT
  // ==================================================================================

  const propertyData = {
    property,
    customer,
    jobs,
    equipment,
    schedules,
    estimates, // NEW
    invoices, // NEW
    maintenancePlans, // NEW
    communications,
    activities,
    notes,
    attachments,
  };

  // Generate stats for toolbar
  const stats = generatePropertyStats(metrics);

  return (
    <ToolbarStatsProvider stats={stats}>
      <div className="flex h-full w-full flex-col overflow-auto">
        <div className="mx-auto w-full max-w-7xl">
          <PropertyPageContent entityData={propertyData} metrics={metrics} />
        </div>
      </div>
    </ToolbarStatsProvider>
  );
}
