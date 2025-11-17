"use server";

/**
 * Schedule Server Actions
 *
 * Fetch real schedule data for all technicians including:
 * - All team members (not just leads)
 * - Real jobs from database
 * - Available time slots
 * - Current time tracking
 */

import { createClient } from "@/lib/supabase/server";

export type ScheduleAppointment = {
	id: string;
	job_id: string;
	job_number: string;
	customer_name: string;
	customer_id: string;
	address: string;
	city: string;
	state: string;
	job_type: string;
	scheduled_start: string;
	scheduled_end: string;
	duration_hours: number;
	status: "scheduled" | "in_progress" | "completed" | "cancelled";
	assigned_technicians: Array<{
		id: string;
		name: string;
		avatar_url?: string;
		is_lead: boolean;
	}>;
};

export type TechnicianSchedule = {
	id: string;
	name: string;
	email: string;
	avatar_url?: string;
	color: string;
	role: string;
	appointments: ScheduleAppointment[];
	working_hours: {
		start: number; // 8 for 8 AM
		end: number; // 18 for 6 PM
	};
};

export async function getTechnicianSchedules(date: Date, companyId: string) {
	const supabase = await createClient();

	if (!supabase) {
		return [];
	}
	// Get start and end of day
	const startOfDay = new Date(date);
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date(date);
	endOfDay.setHours(23, 59, 59, 999);

	// Fetch all technicians/team members for the company
	const { data: technicians, error: techError } = await supabase
		.from("team_members")
		.select(
			`
        user_id,
        role,
        users:user_id (
          id,
          email,
          raw_user_meta_data
        )
      `
		)
		.eq("company_id", companyId)
		.in("role", ["technician", "lead_technician", "admin"]);

	if (techError) {
		throw techError;
	}

	if (!technicians || technicians.length === 0) {
		return [];
	}

	// Fetch all jobs for the day with assigned team members
	const { data: jobs, error: jobsError } = await supabase
		.from("jobs")
		.select(
			`
        id,
        job_number,
        title,
        status,
        scheduled_start,
        scheduled_end,
        company_id,
        customer:customer_id (
          id,
          first_name,
          last_name
        ),
        property:property_id (
          address,
          city,
          state
        ),
        job_team_members:job_team_members (
          user_id,
          is_lead,
          users:user_id (
            id,
            email,
            raw_user_meta_data
          )
        )
      `
		)
		.eq("company_id", companyId)
		.gte("scheduled_start", startOfDay.toISOString())
		.lte("scheduled_start", endOfDay.toISOString())
		.order("scheduled_start");

	if (jobsError) {
		throw jobsError;
	}

	// Assign colors to technicians (cycling through a palette)
	const colorPalette = [
		"bg-blue-500",
		"bg-green-500",
		"bg-purple-500",
		"bg-orange-500",
		"bg-pink-500",
		"bg-cyan-500",
		"bg-red-500",
		"bg-yellow-500",
		"bg-indigo-500",
		"bg-teal-500",
	];

	// Build technician schedules
	const schedules: TechnicianSchedule[] = technicians.map((tech, index) => {
		const user = tech.users as any;
		const userId = user?.id || tech.user_id;
		const metadata = user?.raw_user_meta_data || {};
		const fullName = metadata.full_name || metadata.name || user?.email?.split("@")[0] || "Unknown";

		// Find all jobs assigned to this technician
		const techJobs = (jobs || [])
			.filter((job: any) => job.job_team_members?.some((member: any) => member.user_id === userId))
			.map((job: any) => {
				const customer = job.customer as any;
				const property = job.property as any;
				const customerName = customer
					? `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || "Unknown Customer"
					: "Unknown Customer";

				// Calculate duration
				const start = new Date(job.scheduled_start);
				const end = new Date(job.scheduled_end);
				const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

				// Get all assigned technicians for this job
				const assignedTechs = (job.job_team_members || []).map((member: any) => {
					const memberUser = member.users as any;
					const memberMetadata = memberUser?.raw_user_meta_data || {};
					return {
						id: memberUser?.id || member.user_id,
						name:
							memberMetadata.full_name ||
							memberMetadata.name ||
							memberUser?.email?.split("@")[0] ||
							"Unknown",
						avatar_url: memberMetadata.avatar_url,
						is_lead: member.is_lead,
					};
				});

				return {
					id: job.id,
					job_id: job.id,
					job_number: job.job_number || "N/A",
					customer_name: customerName,
					customer_id: customer?.id || "",
					address: property?.address || "No address",
					city: property?.city || "",
					state: property?.state || "",
					job_type: job.title || "Service Call",
					scheduled_start: job.scheduled_start,
					scheduled_end: job.scheduled_end,
					duration_hours: Math.max(1, Math.round(durationHours * 2) / 2), // Round to nearest 0.5
					status: mapJobStatus(job.status),
					assigned_technicians: assignedTechs,
				};
			});

		return {
			id: userId,
			name: fullName,
			email: user?.email || "",
			avatar_url: metadata.avatar_url,
			color: colorPalette[index % colorPalette.length],
			role: tech.role || "technician",
			appointments: techJobs,
			working_hours: {
				start: 8, // 8 AM
				end: 18, // 6 PM
			},
		};
	});

	return schedules;
}

// Map job status to appointment status
function mapJobStatus(jobStatus: string): "scheduled" | "in_progress" | "completed" | "cancelled" {
	const statusMap: Record<string, "scheduled" | "in_progress" | "completed" | "cancelled"> = {
		scheduled: "scheduled",
		in_progress: "in_progress",
		active: "in_progress",
		completed: "completed",
		done: "completed",
		cancelled: "cancelled",
		canceled: "cancelled",
	};

	return statusMap[jobStatus?.toLowerCase()] || "scheduled";
}
