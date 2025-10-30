import { JobStatusPipeline } from "@/components/dashboard/job-status-pipeline";
import { JobsTable } from "@/components/work/jobs-table";
import { mockJobs } from "@/lib/data/mock-jobs";

/**
 * Work Page - Server Component
 *
 * Performance optimizations:
 * - Server Component fetches data before rendering (no loading flash)
 * - Mock data defined on server (will be replaced with real DB queries)
 * - Only JobsTable and JobStatusPipeline components are client-side for interactivity
 * - Better SEO and initial page load performance
 *
 * Features:
 * - Realistic customer-focused job display (Customer Name + Job Type)
 * - AI auto-tagging extracts categories, equipment, and priority from notes
 * - No fake AI summaries - shows actual job data like real FSM systems
 * - Full-width seamless datatable layout with toolbar integration
 */

export default function JobsPage() {
  // Server Component: Data is fetched here before rendering
  // TODO: Replace mockJobs with real database query
  // const jobs = await db.select().from(jobsTable).where(...);

  return (
    <>
      {/* Job Flow Pipeline - Rendered on server, passed to client component */}
      <JobStatusPipeline />

      {/* Jobs Table - Client component handles sorting, filtering, pagination */}
      <div>
        <JobsTable itemsPerPage={50} jobs={mockJobs} />
      </div>
    </>
  );
}
