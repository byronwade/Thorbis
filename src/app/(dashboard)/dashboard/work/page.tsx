"use client";

/**
 * Work Page - Jobs List with AI Auto-Tagging
 *
 * Features:
 * - Realistic customer-focused job display (Customer Name + Job Type)
 * - AI auto-tagging extracts categories, equipment, and priority from notes
 * - No fake AI summaries - shows actual job data like real FSM systems
 * - Full-width seamless datatable layout with toolbar integration
 */

import { JobStatusPipeline } from "@/components/dashboard/job-status-pipeline";
import { JobsTable } from "@/components/work/jobs-table";
import { mockJobs } from "@/lib/data/mock-jobs";

export default function JobsPage() {
	return (
		<>
			{/* Job Flow Pipeline - Full width, no padding */}
			<JobStatusPipeline />

			{/* Full-width seamless table (no padding) */}
			<div>
				<JobsTable itemsPerPage={50} jobs={mockJobs} />
			</div>
		</>
	);
}
