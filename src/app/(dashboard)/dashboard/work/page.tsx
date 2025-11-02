import { JobStatusPipeline } from "@/components/dashboard/job-status-pipeline";
import { notFound } from "next/navigation";
import { JobsTable } from "@/components/work/jobs-table";
import { createClient } from "@/lib/supabase/server";

/**
 * Work Page - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Real-time data from Supabase
 * - Only JobsTable and JobStatusPipeline components are client-side for interactivity
 * - Better SEO and initial page load performance
 *
 * Features:
 * - Realistic customer-focused job display (Customer Name + Job Type)
 * - AI auto-tagging extracts categories, equipment, and priority from notes
 * - No fake AI summaries - shows actual job data like real FSM systems
 * - Full-width seamless datatable layout with toolbar integration
 */

// Configuration constants
const MAX_JOBS_PER_PAGE = 100;

export default async function JobsPage() {
  const supabase = await createClient();

  if (!supabase) {
    return notFound();
  }

  if (!supabase) {
    throw new Error("Database connection not available");
  }

  // Fetch jobs from Supabase with customer and property details
  // Note: Use the foreign key column name with ! to specify the exact relationship
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select(`
      *,
      customers!customer_id(first_name, last_name, email, phone),
      properties!property_id(address, city, state, zip_code)
    `)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(MAX_JOBS_PER_PAGE);

  if (error) {
    // Supabase PostgREST errors may not have standard structure
    const errorMessage = error.message || error.hint || JSON.stringify(error) || "Unknown database error";
    throw new Error(`Failed to load jobs: ${errorMessage}`);
  }

  return (
    <>
      {/* Job Flow Pipeline - Rendered on server, passed to client component */}
      <JobStatusPipeline />

      {/* Jobs Table - Client component handles sorting, filtering, pagination */}
      <div>
        <JobsTable itemsPerPage={50} jobs={jobs || []} />
      </div>
    </>
  );
}
