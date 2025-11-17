/**
 * Job Status API Route
 *
 * Returns the current status of an import/export job
 * Supports real-time updates for long-running operations
 */

import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
	params: {
		jobId: string;
	};
};

export async function GET(_request: NextRequest, context: RouteContext) {
	try {
		// Check authentication
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json({ error: "Database not configured" }, { status: 500 });
		}

		const { jobId } = context.params;

		// Get import job status
		const { data: job, error } = await supabase
			.from("data_imports")
			.select("*")
			.eq("id", jobId)
			.eq("user_id", user.id) // Ensure user owns this job
			.single();

		if (error || !job) {
			return NextResponse.json({ error: "Job not found" }, { status: 404 });
		}

		return NextResponse.json({
			jobId: job.id,
			status: job.status,
			dataType: job.data_type,
			totalRows: job.total_rows,
			successfulRows: job.successful_rows || 0,
			failedRows: job.failed_rows || 0,
			errors: job.errors || [],
			requiresApproval: job.requires_approval,
			approvedBy: job.approved_by,
			approvedAt: job.approved_at,
			createdAt: job.created_at,
			completedAt: job.completed_at,
		});
	} catch (_error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
