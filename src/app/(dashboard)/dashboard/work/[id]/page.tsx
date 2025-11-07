/**
 * Job Details Page - Single Page with Collapsible Sections
 * Matches customer details page pattern
 */

import { notFound } from "next/navigation";
import { JobPageContent } from "@/components/work/job-details/job-page-content";
import { JobStatsBar } from "@/components/work/job-details/job-stats-bar";
import { StickyStatsBar } from "@/components/ui/sticky-stats-bar";
import { createClient } from "@/lib/supabase/server";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: jobId } = await params;

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
    .eq("status", "active")
    .single();

  if (!teamMember?.company_id) {
    return notFound();
  }

  // Fetch job with all related data
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select(
      `
      *,
      customer:customers!customer_id(*),
      property:properties!property_id(*),
      assigned_user:users!assigned_to(id, name, email, phone, avatar)
    `
    )
    .eq("id", jobId)
    .is("deleted_at", null)
    .single();

  if (jobError || !job || job.company_id !== teamMember.company_id) {
    return notFound();
  }

  // Get primary customer and property
  const customer = Array.isArray(job.customer) ? job.customer[0] : job.customer;
  const property = Array.isArray(job.property) ? job.property[0] : job.property;
  const assignedUser = Array.isArray(job.assigned_user)
    ? job.assigned_user[0]
    : job.assigned_user;

  // Fetch all related data
  const [
    { data: teamAssignments },
    { data: timeEntries },
    { data: invoices },
    { data: estimates },
    { data: payments },
    { data: purchaseOrders },
    { data: tasks },
    { data: photos },
    { data: documents },
    { data: signatures },
    { data: activities },
    { data: communications },
    { data: equipment },
    { data: jobEquipment },
    { data: jobMaterials },
    { data: jobNotes },
  ] = await Promise.all([
    supabase
      .from("job_team_assignments")
      .select("*, team_member:team_members!team_member_id(*, users!user_id(*))")
      .eq("job_id", jobId),
    supabase
      .from("job_time_entries")
      .select("*, user:users!user_id(*)")
      .eq("job_id", jobId)
      .order("clock_in", { ascending: false }),
    supabase
      .from("invoices")
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false }),
    supabase
      .from("estimates")
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false }),
    supabase
      .from("payments")
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false }),
    supabase
      .from("purchase_orders")
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false }),
    supabase
      .from("job_tasks")
      .select(
        "*, assigned_user:users!assigned_to(id, name, avatar), completed_by_user:users!completed_by(id, name)"
      )
      .eq("job_id", jobId)
      .order("display_order", { ascending: true }),
    supabase
      .from("job_photos")
      .select("*, uploaded_by_user:users!uploaded_by(*)")
      .eq("job_id", jobId)
      .order("taken_at", { ascending: false }),
    supabase
      .from("attachments")
      .select("*")
      .eq("entity_type", "job")
      .eq("entity_id", jobId),
    supabase
      .from("job_signatures")
      .select("*")
      .eq("job_id", jobId)
      .order("signed_at", { ascending: false }),
    supabase
      .from("activity_log")
      .select("*, user:users!user_id(*)")
      .eq("entity_type", "job")
      .eq("entity_id", jobId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("communications")
      .select("*, user:users!user_id(*)")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("equipment")
      .select("*")
      .eq("property_id", property?.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("job_equipment")
      .select(`
        *,
        equipment:equipment_id(
          id,
          name,
          type,
          manufacturer,
          model,
          serial_number,
          status,
          condition
        )
      `)
      .eq("job_id", jobId)
      .order("created_at", { ascending: false }),
    supabase
      .from("job_materials")
      .select(`
        *,
        price_book_item:price_book_items(id, name, sku, unit_price),
        used_by:users(id, name, email)
      `)
      .eq("job_id", jobId)
      .order("created_at", { ascending: false }),
    supabase
      .from("job_notes")
      .select(
        `
        *,
        user:users!user_id(id, name, email, avatar)
      `
      )
      .eq("job_id", jobId)
      .is("deleted_at", null)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  // Calculate metrics
  const totalLaborHours =
    timeEntries?.reduce((sum, entry) => sum + (entry.total_hours || 0), 0) || 0;

  // Calculate materials cost from invoice line items
  const materialsCost = (invoices || []).reduce((total, invoice) => {
    const items = invoice.line_items || [];
    const invoiceTotal = items.reduce(
      (sum: number, item: any) =>
        sum + item.quantity * (item.unit_price || item.price || 0),
      0
    );
    return total + invoiceTotal;
  }, 0);

  const estimatedProfit = (job.total_amount || 0) - materialsCost;
  const profitMargin =
    job.total_amount > 0 ? (estimatedProfit / job.total_amount) * 100 : 0;

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

  // Prepare data for client component
  const jobData = {
    job,
    customer,
    property,
    assignedUser,
    teamAssignments: teamAssignments || [],
    timeEntries: timeEntries || [],
    invoices: invoices || [],
    estimates: estimates || [],
    payments: payments || [],
    purchaseOrders: purchaseOrders || [],
    tasks: tasks || [],
    photos: photos || [],
    documents: documents || [],
    signatures: signatures || [],
    activities: activities || [],
    communications: communications || [],
    equipment: equipment || [], // Customer's equipment at the property
    jobEquipment: jobEquipment || [], // Equipment serviced on this job
    jobMaterials: jobMaterials || [], // Materials used on this job
    jobNotes: jobNotes || [], // Job notes
  };

  return (
    <div className="flex h-full w-full flex-col overflow-auto">
      {/* Sticky Stats Bar - Becomes compact on scroll */}
      <StickyStatsBar>
        <JobStatsBar
          jobId={jobId}
          metrics={metrics}
          status={job.status as string}
        />
      </StickyStatsBar>

      {/* Full-Width Content - No Padding */}
      <JobPageContent jobData={jobData} metrics={metrics} />
    </div>
  );
}
