import { NextResponse } from "next/server";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getSchedulingSupabaseClient } from "@/lib/schedule/supabase-client";
import { serializeJob } from "@/lib/schedule-bootstrap";
import { fetchAdditionalUnscheduledJobs } from "@/lib/schedule-data";

export async function POST(request: Request) {
	try {
		const body = await request.json().catch(() => ({}));
		const search = typeof body?.search === "string" ? body.search : "";
		const limit =
			typeof body?.limit === "number" && body.limit > 0
				? body.limit
				: undefined;
		const offset =
			typeof body?.offset === "number" && body.offset >= 0 ? body.offset : 0;

		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return NextResponse.json(
				{ error: "No active company selected" },
				{ status: 401 },
			);
		}

		const supabase = await getSchedulingSupabaseClient();
		if (!supabase) {
			return NextResponse.json(
				{ error: "Database unavailable" },
				{ status: 500 },
			);
		}

		const { jobs, meta } = await fetchAdditionalUnscheduledJobs({
			supabase,
			companyId,
			limit,
			offset,
			search,
		});

		return NextResponse.json({
			jobs: jobs.map(serializeJob),
			meta,
		});
	} catch (error) {
		console.error(
			"[Schedule] Failed to load additional unscheduled jobs",
			error,
		);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Unable to load unscheduled jobs",
			},
			{ status: 500 },
		);
	}
}
