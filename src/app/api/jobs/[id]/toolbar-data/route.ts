import { NextResponse } from "next/server";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

/**
 * Get job data for toolbar statistics
 * Returns minimal data needed for statistics sheet
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id: jobId } = await params;
		const user = await getCurrentUser();

		if (!user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json({ error: "Database not configured" }, { status: 500 });
		}

		const activeCompanyId = await getActiveCompanyId();
		if (!activeCompanyId) {
			return NextResponse.json({ error: "No active company" }, { status: 403 });
		}

		// Fetch job
		const { data: job, error: jobError } = await supabase
			.from("jobs")
			.select("*")
			.eq("id", jobId)
			.eq("company_id", activeCompanyId)
			.is("deleted_at", null)
			.single();

		if (jobError || !job) {
			return NextResponse.json({ error: "Job not found" }, { status: 404 });
		}

		// Fetch related data in parallel
		const [
			{ data: customer },
			{ data: property },
			{ data: timeEntries },
			{ data: teamAssignments },
			{ data: invoices },
			{ data: payments },
			{ data: jobMaterials },
		] = await Promise.all([
			// Fetch customer
			supabase
				.from("customers")
				.select("id, first_name, last_name, display_name, tags, credit_limit, outstanding_balance")
				.eq("id", job.customer_id)
				.single(),
			// Fetch property with metadata (includes tags)
			supabase
				.from("properties")
				.select(
					"id, name, address, city, state, zip_code, property_type, square_footage, year_built, lat, lon, metadata"
				)
				.eq("id", job.property_id)
				.single(),
			supabase
				.from("time_entries")
				.select(
					`
          *,
          user:users!user_id(id, name, email, avatar)
        `
				)
				.eq("job_id", jobId)
				.is("deleted_at", null),
			supabase
				.from("job_team_assignments")
				.select("*, team_member:team_members!team_member_id(*, users!user_id(*))")
				.eq("job_id", jobId),
			supabase.from("invoices").select("*").eq("job_id", jobId).is("deleted_at", null),
			supabase.from("payments").select("*").eq("job_id", jobId).is("deleted_at", null),
			supabase.from("job_materials").select("*").eq("job_id", jobId).is("deleted_at", null),
		]);

		// Calculate metrics
		const totalLaborHours = timeEntries?.reduce((sum, entry) => sum + (entry.total_hours || 0), 0) || 0;

		const materialsCost = (invoices || []).reduce((total, invoice) => {
			const items = invoice.line_items || [];
			const invoiceTotal = items.reduce(
				(sum: number, item: any) => sum + item.quantity * (item.unit_price || item.price || 0),
				0
			);
			return total + invoiceTotal;
		}, 0);

		const estimatedProfit = (job.total_amount || 0) - materialsCost;
		const profitMargin = job.total_amount > 0 ? (estimatedProfit / job.total_amount) * 100 : 0;

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

		return NextResponse.json({
			job,
			customer: customer || null,
			property: property || null,
			metrics,
			timeEntries: timeEntries || [],
			teamAssignments: teamAssignments || [],
			invoices: invoices || [],
			payments: payments || [],
			jobMaterials: jobMaterials || [],
		});
	} catch (_error) {
    console.error("Error:", _error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
