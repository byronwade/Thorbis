/**
 * Job Details Page - Complete Redesign (Server Component)
 *
 * Performance optimizations:
 * - Server Component with async params (Next.js 16+)
 * - Comprehensive data fetching on server
 * - Lazy-loaded editor component
 * - Reduced client JavaScript bundle
 *
 * Features:
 * - Tabbed interface (Overview, Team, Financials, Materials, Photos, Activity, Equipment)
 * - Inline editing with Novel editor
 * - Real-time stats bar
 * - Mobile-responsive design
 * - Property enrichment integration
 * - Time tracking
 * - Photo management
 * - Signature capture
 * - Workflow automation
 */

import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { JobHeaderPermanent } from "@/components/work/job-details/job-header-permanent";
import { propertyEnrichmentService } from "@/lib/services/property-enrichment";
import { generateJobStats } from "@/lib/stats/utils";
import { createClient } from "@/lib/supabase/server";

// Lazy load the editor to reduce initial bundle size
// Note: No ssr: false needed - JobPageEditor is already a client component
const JobPageEditor = dynamic(
  () =>
    import("@/components/work/job-details/job-page-editor").then((mod) => ({
      default: mod.JobPageEditor,
    })),
  {
    loading: () => (
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="h-[600px] w-full" />
      </div>
    ),
  }
);

// ============================================================================
// Page Component
// ============================================================================

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: jobId } = await params;

  console.log("[Job Details] Loading job:", jobId);

  // ============================================================================
  // Authentication & Authorization
  // ============================================================================

  const supabase = await createClient();

  if (!supabase) {
    console.error("[Job Details] No supabase client");
    return notFound();
  }

  console.log("[Job Details] Supabase client OK");

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("[Job Details] No authenticated user");
    return notFound();
  }

  console.log("[Job Details] User authenticated:", user.id);

  // Get user's company
  const { data: teamMember } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!teamMember?.company_id) {
    return notFound();
  }

  // ============================================================================
  // Core Job Data
  // ============================================================================

  // Fetch job with all related data
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select(
      `
      *,
      customer:customers!customer_id(
        id,
        first_name,
        last_name,
        display_name,
        email,
        phone,
        alternate_phone,
        company_name,
        address,
        city,
        state,
        zip,
        total_revenue,
        total_jobs
      ),
      property:properties!property_id(
        id,
        name,
        address,
        address2,
        city,
        state,
        zip_code,
        country,
        property_type,
        square_footage,
        year_built,
        bedrooms,
        bathrooms,
        notes
      ),
      assigned_user:users!assigned_to(
        id,
        name,
        email,
        phone,
        avatar
      )
    `
    )
    .eq("id", jobId)
    .is("deleted_at", null)
    .single();

  // Check if job exists and belongs to user's company
  if (jobError || !job || job.company_id !== teamMember.company_id) {
    return notFound();
  }

  // ============================================================================
  // Multi-Customer & Multi-Property Support
  // ============================================================================

  // Fetch all customers for this job
  const { data: jobCustomers } = await supabase
    .from("job_customers")
    .select("*, customer:customers(*)")
    .eq("job_id", jobId)
    .order("is_primary", { ascending: false });

  // Fetch all properties for this job
  const { data: jobProperties } = await supabase
    .from("job_properties")
    .select("*, property:properties(*)")
    .eq("job_id", jobId)
    .order("is_primary", { ascending: false });

  // Get primary customer and property
  const customer =
    jobCustomers?.[0]?.customer ||
    (Array.isArray(job.customer) ? job.customer[0] : job.customer);

  const property =
    jobProperties?.[0]?.property ||
    (Array.isArray(job.property) ? job.property[0] : job.property);

  const assignedUser = Array.isArray(job.assigned_user)
    ? job.assigned_user[0]
    : job.assigned_user;

  // ============================================================================
  // Property Enrichment
  // ============================================================================

  let propertyEnrichment = null;
  if (
    property?.address &&
    property?.city &&
    property?.state &&
    property?.zip_code
  ) {
    try {
      propertyEnrichment = await propertyEnrichmentService.enrichProperty(
        property.address,
        property.city,
        property.state,
        property.zip_code
      );
    } catch (error) {
      console.error("Failed to enrich property data:", error);
    }
  }

  // ============================================================================
  // Team & Assignments
  // ============================================================================

  const { data: teamAssignments } = await supabase
    .from("job_team_assignments")
    .select(
      `
      *,
      team_member:team_members!team_member_id(
        user_id,
        role_id,
        job_title,
        users!user_id(
          id,
          name,
          email,
          phone,
          avatar
        )
      )
    `
    )
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  // ============================================================================
  // Time Tracking (NEW)
  // ============================================================================

  const { data: timeEntries } = await supabase
    .from("job_time_entries")
    .select(
      `
      *,
      user:users!user_id(
        id,
        name,
        email,
        avatar
      )
    `
    )
    .eq("job_id", jobId)
    .order("clock_in", { ascending: false });

  // Calculate total labor hours
  const totalLaborHours =
    timeEntries?.reduce((sum, entry) => sum + (entry.total_hours || 0), 0) || 0;

  // ============================================================================
  // Financials
  // ============================================================================

  // Invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("job_id", jobId)
    .eq("company_id", teamMember.company_id)
    .order("created_at", { ascending: false });

  // Estimates
  const { data: estimates } = await supabase
    .from("estimates")
    .select("*")
    .eq("job_id", jobId)
    .eq("company_id", teamMember.company_id)
    .order("created_at", { ascending: false });

  // ============================================================================
  // Materials & Line Items
  // ============================================================================

  const { data: materials } = await supabase
    .from("job_line_items")
    .select("*")
    .eq("job_id", jobId)
    .order("display_order", { ascending: true });

  // Calculate materials cost
  const materialsCost =
    materials?.reduce(
      (sum, item) => sum + (item.quantity * item.unit_price || 0),
      0
    ) || 0;

  // ============================================================================
  // Photos & Documents (NEW)
  // ============================================================================

  const { data: photos } = await supabase
    .from("job_photos")
    .select(
      `
      *,
      uploaded_by_user:users!uploaded_by(
        id,
        name,
        email,
        avatar
      )
    `
    )
    .eq("job_id", jobId)
    .order("taken_at", { ascending: false });

  // Group photos by category
  const photosByCategory = {
    before: photos?.filter((p) => p.category === "before") || [],
    during: photos?.filter((p) => p.category === "during") || [],
    after: photos?.filter((p) => p.category === "after") || [],
    issue: photos?.filter((p) => p.category === "issue") || [],
    equipment: photos?.filter((p) => p.category === "equipment") || [],
    completion: photos?.filter((p) => p.category === "completion") || [],
    other: photos?.filter((p) => p.category === "other") || [],
  };

  // Documents (using attachments table)
  const { data: documents } = await supabase
    .from("attachments")
    .select("*")
    .eq("entity_type", "job")
    .eq("entity_id", jobId)
    .order("created_at", { ascending: false });

  // ============================================================================
  // Signatures (NEW)
  // ============================================================================

  const { data: signatures } = await supabase
    .from("job_signatures")
    .select("*")
    .eq("job_id", jobId)
    .order("signed_at", { ascending: false });

  const customerSignature = signatures?.find(
    (s) => s.signature_type === "customer"
  );
  const technicianSignature = signatures?.find(
    (s) => s.signature_type === "technician"
  );

  // ============================================================================
  // Activity Log & Communications
  // ============================================================================

  const { data: activities } = await supabase
    .from("activity_log")
    .select(
      `
      *,
      user:users!user_id(
        id,
        name,
        email,
        avatar
      )
    `
    )
    .eq("entity_type", "job")
    .eq("entity_id", jobId)
    .eq("company_id", teamMember.company_id)
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: communications } = await supabase
    .from("communications")
    .select(
      `
      *,
      user:users!user_id(
        id,
        name,
        email,
        avatar
      )
    `
    )
    .eq("job_id", jobId)
    .eq("company_id", teamMember.company_id)
    .order("created_at", { ascending: false })
    .limit(20);

  // ============================================================================
  // Equipment (if applicable)
  // ============================================================================

  const { data: equipment } = await supabase
    .from("equipment")
    .select("*")
    .eq("property_id", property?.id)
    .eq("company_id", teamMember.company_id)
    .order("created_at", { ascending: false });

  // ============================================================================
  // Workflow Stages (NEW)
  // ============================================================================

  const { data: workflowStages } = await supabase
    .from("job_workflow_stages")
    .select("*")
    .eq("company_id", teamMember.company_id)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  // ============================================================================
  // Calculate Metrics for Stats Bar
  // ============================================================================

  // Calculate profit margin
  const estimatedProfit = (job.total_amount || 0) - materialsCost;
  const profitMargin =
    job.total_amount > 0 ? (estimatedProfit / job.total_amount) * 100 : 0;

  // Calculate completion percentage based on workflow or status
  const statusCompletionMap: Record<string, number> = {
    quoted: 10,
    scheduled: 25,
    in_progress: 50,
    completed: 100,
    cancelled: 0,
    on_hold: 40,
  };
  const completionPercentage = statusCompletionMap[job.status as string] || 0;

  const metrics = {
    totalAmount: job.total_amount || 0,
    paidAmount: job.paid_amount || 0,
    totalLaborHours,
    estimatedLaborHours: job.estimated_labor_hours || 0,
    materialsCost,
    profitMargin,
    completionPercentage,
  };

  // ============================================================================
  // Render
  // ============================================================================

  // Generate stats for toolbar
  const stats = generateJobStats({
    ...metrics,
    status: job.status as string,
  });

  return (
    <ToolbarStatsProvider stats={stats}>
      <div className="flex h-full w-full flex-col overflow-auto">
        {/* Container with max-w-7xl */}
        <div className="mx-auto w-full max-w-7xl">
          {/* Job Header - Permanent */}
          <JobHeaderPermanent
            assignedUser={assignedUser}
            customer={customer}
            enrichmentData={propertyEnrichment}
            job={job}
            property={property}
          />
        </div>

        {/* Main Content - Tabbed Editor */}
        <JobPageEditor
          activities={activities || []}
          assignedUser={assignedUser}
          communications={communications || []}
          customer={customer}
          customerSignature={customerSignature}
          customers={jobCustomers || []}
          documents={documents || []}
          equipment={equipment || []}
          estimates={estimates || []}
          invoices={invoices || []}
          job={job}
          materials={materials || []}
          metrics={metrics}
          photos={photos || []}
          photosByCategory={photosByCategory}
          properties={jobProperties || []}
          property={property}
          propertyEnrichment={propertyEnrichment}
          signatures={signatures || []}
          teamAssignments={teamAssignments || []}
          technicianSignature={technicianSignature}
          timeEntries={timeEntries || []}
          workflowStages={workflowStages || []}
        />
      </div>
    </ToolbarStatsProvider>
  );
}
