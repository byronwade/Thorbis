/**
 * Technicians Stats - Fast Server Component
 *
 * Fetches and displays technician summary statistics.
 * Loads faster than main data, so users see metrics first.
 */

import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function TechniciansStats() {
	const supabase = await createClient();
	const companyId = await getActiveCompanyId();

	let totalTechnicians = 0;
	let activeToday = 0;
	let onBreak = 0;
	let available = 0;

	if (companyId) {
		// Get all technicians (field roles)
		const { data: technicianData, error: techError } = await supabase
			.from("company_memberships")
			.select("id, user_id, role, status")
			.eq("company_id", companyId)
			.in("role", ["technician", "lead_technician", "field_supervisor"])
			.eq("status", "active");

		if (!techError && technicianData) {
			totalTechnicians = technicianData.length;

			// Get today's date range
			const todayStart = new Date();
			todayStart.setHours(0, 0, 0, 0);
			const todayEnd = new Date();
			todayEnd.setHours(23, 59, 59, 999);

			// Get technicians with appointments today
			const { data: todayAppointments, error: apptError } = await supabase
				.from("job_assignments")
				.select(
					`
					technician_id,
					status,
					jobs!inner(scheduled_start, scheduled_end, company_id)
				`,
				)
				.eq("jobs.company_id", companyId)
				.gte("jobs.scheduled_start", todayStart.toISOString())
				.lte("jobs.scheduled_start", todayEnd.toISOString());

			if (!apptError && todayAppointments) {
				// Count unique technicians with jobs today
				const activeTechnicianIds = new Set(
					todayAppointments.map((a) => a.technician_id),
				);
				activeToday = activeTechnicianIds.size;

				// Count those available (total minus active)
				available = totalTechnicians - activeToday;

				// On break is typically tracked in real-time, using 0 as default
				onBreak = 0;
			} else {
				available = totalTechnicians;
			}
		}
	}

	const stats = {
		totalTechnicians,
		activeToday,
		onBreak,
		available,
	};

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<div className="bg-card rounded-lg border p-6">
				<h3 className="text-muted-foreground text-sm font-medium">
					Total Technicians
				</h3>
				<p className="mt-2 text-2xl font-bold">{stats.totalTechnicians}</p>
				<p className="text-muted-foreground mt-1 text-xs">Team members</p>
			</div>

			<div className="bg-card rounded-lg border p-6">
				<h3 className="text-muted-foreground text-sm font-medium">
					Active Today
				</h3>
				<p className="mt-2 text-2xl font-bold">{stats.activeToday}</p>
				<p className="text-muted-foreground mt-1 text-xs">Currently working</p>
			</div>

			<div className="bg-card rounded-lg border p-6">
				<h3 className="text-muted-foreground text-sm font-medium">On Break</h3>
				<p className="mt-2 text-2xl font-bold">{stats.onBreak}</p>
				<p className="text-muted-foreground mt-1 text-xs">Break time</p>
			</div>

			<div className="bg-card rounded-lg border p-6">
				<h3 className="text-muted-foreground text-sm font-medium">Available</h3>
				<p className="mt-2 text-2xl font-bold">{stats.available}</p>
				<p className="text-muted-foreground mt-1 text-xs">Ready for dispatch</p>
			</div>
		</div>
	);
}
