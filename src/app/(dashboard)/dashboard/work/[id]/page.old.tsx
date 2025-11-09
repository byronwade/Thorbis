/**
 * Job Details Page - Server Component (New Widget-Based Version)
 *
 * Performance optimizations:
 * - Server Component (no "use client" - uses params prop)
 * - Static content rendered on server
 * - Reduced JavaScript bundle size
 * - Better SEO and initial page load
 * - Improved performance with server-side data fetching
 *
 * Features:
 * - Widget-based customizable layout
 * - Industry-specific presets
 * - Property data enrichment
 * - Drag-and-drop widget repositioning
 */

import { notFound } from "next/navigation";
import { JobHeaderPermanent } from "@/components/work/job-details/job-header-permanent";
import { WidgetGrid } from "@/components/work/job-details/widget-grid";
import { JobProcessIndicatorEditable } from "@/components/work/job-process-indicator-editable";
import { propertyEnrichmentService } from "@/lib/services/property-enrichment";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// Page Component
// ============================================================================

export default async function JobDetailsPageNew({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: jobId } = await params;

  // ============================================================================
  // Data Fetching (Server-side)
  // ============================================================================

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

  // Get user's company
  const { data: teamMember } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .single();

  if (!teamMember?.company_id) {
    return notFound();
  }

  // Fetch job with related data
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select(
      `
      *,
      customer:customers!customer_id(
        id,
        first_name,
        last_name,
        email,
        phone,
        company_name,
        address,
        city,
        state,
        zip_code
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
        notes
      ),
      assigned_user:users!assigned_to(
        id,
        name,
        email
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

  // Fetch all customers for this job (many-to-many)
  const { data: jobCustomers } = await supabase
    .from("job_customers")
    .select(`
      *,
      customer:customers(*)
    `)
    .eq("job_id", jobId)
    .order("is_primary", { ascending: false });

  // Fetch all properties for this job (many-to-many)
  const { data: jobProperties } = await supabase
    .from("job_properties")
    .select(`
      *,
      property:properties(*)
    `)
    .eq("job_id", jobId)
    .order("is_primary", { ascending: false });

  // Get primary customer and property (for backward compatibility)
  const customer =
    jobCustomers && jobCustomers.length > 0
      ? Array.isArray(jobCustomers[0].customer)
        ? jobCustomers[0].customer[0]
        : jobCustomers[0].customer
      : Array.isArray(job.customer) && job.customer.length > 0
        ? job.customer[0]
        : job.customer;

  const property =
    jobProperties && jobProperties.length > 0
      ? Array.isArray(jobProperties[0].property)
        ? jobProperties[0].property[0]
        : jobProperties[0].property
      : Array.isArray(job.property) && job.property.length > 0
        ? job.property[0]
        : job.property;

  const assignedUser =
    Array.isArray(job.assigned_user) && job.assigned_user.length > 0
      ? job.assigned_user[0]
      : job.assigned_user;

  // Fetch enriched property data if property exists
  let propertyEnrichment = null;
  if (
    property &&
    property.address &&
    property.city &&
    property.state &&
    property.zip_code
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
      // Continue without enrichment
    }
  }

  // Fetch related data
  // Invoices for this job
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("job_id", jobId)
    .eq("company_id", teamMember.company_id)
    .order("created_at", { ascending: false });

  // Estimates for this job
  const { data: estimates } = await supabase
    .from("estimates")
    .select("*")
    .eq("job_id", jobId)
    .eq("company_id", teamMember.company_id)
    .order("created_at", { ascending: false });

  // Team assignments for this job
  const { data: teamAssignments } = await supabase
    .from("job_team_assignments")
    .select(`
      *,
      team_member:team_members!team_member_id(
        user_id,
        role,
        users!user_id(
          id,
          name,
          email,
          phone,
          avatar
        )
      )
    `)
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  // Materials/line items for this job
  const { data: materials } = await supabase
    .from("job_line_items")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  // Activity log for this job
  const { data: activities } = await supabase
    .from("activity_log")
    .select(`
      *,
      user:users!user_id(
        id,
        name,
        email,
        avatar
      )
    `)
    .eq("entity_type", "job")
    .eq("entity_id", jobId)
    .eq("company_id", teamMember.company_id)
    .order("created_at", { ascending: false })
    .limit(20);

  // Photos/documents - using empty arrays for now
  const photos: unknown[] = [];
  const documents: unknown[] = [];
  const communications: unknown[] = [];

  // Transform customer for widget grid (matching expected User type)
  const customerForWidget = customer
    ? {
        id: customer.id,
        name: `${customer.first_name} ${customer.last_name}`,
        email: customer.email || "",
        phone: customer.phone || null,
        avatar: null,
        bio: null,
        emailVerified: true,
        lastLoginAt: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    : undefined;

  // Transform property for widget grid
  const propertyForWidget = property
    ? {
        id: property.id,
        companyId: job.company_id,
        customerId: job.customer_id || "",
        name: property.name || null,
        address: property.address,
        address2: property.address2 || null,
        city: property.city,
        state: property.state,
        zipCode: property.zip_code,
        country: property.country || "USA",
        propertyType: property.property_type as
          | "residential"
          | "commercial"
          | "industrial"
          | null,
        squareFootage: property.square_footage || null,
        yearBuilt: property.year_built || null,
        notes: property.notes || null,
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    : undefined;

  // Transform job for widget grid
  const jobForWidget = {
    id: job.id,
    companyId: job.company_id,
    propertyId: job.property_id,
    customerId: job.customer_id,
    assignedTo: job.assigned_to,
    jobNumber: job.job_number,
    title: job.title,
    description: job.description || null,
    status: job.status,
    priority: job.priority,
    jobType: job.job_type || null,
    scheduledStart: job.scheduled_start ? new Date(job.scheduled_start) : null,
    scheduledEnd: job.scheduled_end ? new Date(job.scheduled_end) : null,
    actualStart: job.actual_start ? new Date(job.actual_start) : null,
    actualEnd: job.actual_end ? new Date(job.actual_end) : null,
    totalAmount: job.total_amount,
    paidAmount: job.paid_amount,
    notes: job.notes || null,
    metadata: job.metadata,
    createdAt: new Date(job.created_at),
    updatedAt: new Date(job.updated_at),
    aiCategories: job.ai_categories,
    aiEquipment: job.ai_equipment,
    aiServiceType: job.ai_service_type,
    aiPriorityScore: job.ai_priority_score,
    aiTags: job.ai_tags,
    aiProcessedAt: job.ai_processed_at ? new Date(job.ai_processed_at) : null,
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Permanent Job Header - Always Visible */}
      <JobHeaderPermanent
        allCustomers={jobCustomers || []}
        allProperties={jobProperties || []}
        assignedUser={assignedUser}
        customer={customer}
        job={jobForWidget}
        property={property}
        teamAssignments={teamAssignments || []}
      />

      {/* Process Timeline - Editable */}
      <div className="rounded-lg border bg-card p-4">
        <JobProcessIndicatorEditable
          currentStatus={jobForWidget.status as never}
          dates={{
            quoted: jobForWidget.createdAt,
            scheduled: jobForWidget.scheduledStart,
            inProgress: jobForWidget.actualStart,
            completed: jobForWidget.actualEnd,
          }}
          jobId={jobForWidget.id}
        />
      </div>

      {/* Widget Grid */}
      <WidgetGrid
        activities={activities || []}
        communications={communications}
        customer={customerForWidget}
        documents={documents}
        estimates={estimates || []}
        invoices={invoices || []}
        job={jobForWidget}
        materials={materials || []}
        photos={photos}
        property={propertyForWidget}
        propertyEnrichment={propertyEnrichment}
        teamAssignments={teamAssignments || []}
      />

      {/* Property Enrichment Debug (Remove in production) */}
      {propertyEnrichment && process.env.NODE_ENV === "development" ? (
        <details className="rounded-lg border p-4">
          <summary className="cursor-pointer font-medium text-sm">
            Property Enrichment Data (Debug)
          </summary>
          <pre className="mt-2 overflow-auto rounded bg-muted p-4 text-xs">
            {JSON.stringify(propertyEnrichment, null, 2)}
          </pre>
        </details>
      ) : null}
    </div>
  );
}
